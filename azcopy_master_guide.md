# AZ-104 Definitive Master Guide: AzCopy v10
**Authoritative, 360-Degree Reference for Microsoft Certified Azure Administrator Associate (AZ-104)**  
*Based strictly on official Microsoft Learn technical documentation and audited against current AZ-104 exam blueprints.*

---

## Table of Contents
1. [Core Fundamentals & Architecture](#1-core-fundamentals--architecture)
2. [Installation, Distribution & Azure Cloud Shell](#2-installation-distribution--azure-cloud-shell)
3. [Authentication & Authorization Deep Dive](#3-authentication--authorization-deep-dive)
4. [SAS Token Parameter Anatomy (The Exam Anatomy)](#4-sas-token-parameter-anatomy-the-exam-anatomy)
5. [Command Verbs & Core Syntax](#5-command-verbs--core-syntax)
6. [The Source-to-Destination Matrix](#6-the-source-to-destination-matrix)
7. [Trailing Slash & URL Wildcard Rules](#7-trailing-slash--url-wildcard-rules)
8. [Comprehensive Flag Reference for AZ-104](#8-comprehensive-flag-reference-for-az-104)
9. [`azcopy copy` vs `azcopy sync` (The Deep Dive)](#9-azcopy-copy-vs-azcopy-sync-the-deep-dive)
10. [Job Engine, Resume Mechanics & Logging](#10-job-engine-resume-mechanics--logging)
11. [Performance Tuning & Environment Variables](#11-performance-tuning--environment-variables)
12. [Network Routing: TCP 445 (SMB) vs TCP 443 (HTTPS REST)](#12-network-routing-tcp-445-smb-vs-tcp-443-https-rest)
13. [Data Migration Decision Matrix: AzCopy vs All Alternatives](#13-data-migration-decision-matrix-azcopy-vs-all-alternatives)
14. [The 9 Classic AZ-104 Exam Scenarios & Traps](#14-the-9-classic-az-104-exam-scenarios--traps)
15. [The Top 10 "Fatal Traps" Quick-Reference Card](#15-the-top-10-fatal-traps-quick-reference-card)

---

## 1. Core Fundamentals & Architecture

### What is AzCopy?
AzCopy (specifically **AzCopy v10**, the current active major version) is Microsoft's official, high-performance command-line utility written in **Go**. It is designed specifically for high-throughput, parallelized data transfer to, from, and between Microsoft Azure Storage services.

### Key Architectural Characteristics
* **Stateless & Self-Contained:** Distributed as a single compiled binary with zero external runtime dependencies (.NET Framework or runtime libraries are **not** required).
* **Multi-Platform:** Native support on Windows (x64/x86/ARM64), Linux (x64/ARM64), and macOS.
* **Asynchronous Multi-Threaded Engine:** Built-in auto-scaling concurrency that saturates available network pipes by opening simultaneous HTTP/HTTPS connections.
* **Server-to-Server (S2S) Direct Transfer:** When transferring data between two cloud storage accounts (or from Amazon S3 / Google Cloud Storage to Azure Blob), AzCopy instructs Azure Storage to execute a direct **Put Block From URL** / **Put Page From URL** copy via Microsoft's cloud backbone. Data is **never** downloaded to the local client machine executing the AzCopy command.
* **Storage Services Supported:**
  1. **Azure Blob Storage:** Block Blobs, Page Blobs (VM VHDs), Append Blobs.
  2. **Azure Data Lake Storage (ADLS) Gen2:** Full hierarchical namespace (HNS) support with POSIX ACLs.
  3. **Azure Files:** Full SMB/NFS share migration with NTFS metadata preservation.
  4. **External Object Stores (Source Only):** Amazon Web Services (AWS) S3 buckets and Google Cloud Storage (GCS) buckets (can only transfer into Azure Blob Storage).
* **Services NOT Supported:**
  * **Azure Table Storage** and **Azure Queue Storage** are **NOT** supported in AzCopy v10 (support was retired after legacy v8).

---

## 2. Installation, Distribution & Azure Cloud Shell

### Distribution & Installation
* AzCopy does **not** use an `.msi`, `.deb`, or package-manager installer.
* It is distributed as a compressed `.zip` (Windows) or `.tar.gz` (Linux/macOS) archive containing a single executable (`azcopy.exe` or `azcopy`).
* System-wide configuration is achieved simply by placing the executable into any directory listed in the system's `PATH` environment variable.

### Azure Cloud Shell Pre-Installation (High-Yield Exam Fact)
* **AzCopy v10 is pre-installed and automatically updated in Azure Cloud Shell** (both Bash and PowerShell environments).
* *Exam Scenario:* If an administrative question asks how to run an AzCopy transfer script immediately from a browser without installing software, downloading binaries, or modifying local machine PATH variables, the answer is **Azure Cloud Shell**.

### Relationship with Azure Storage Explorer
* **Azure Storage Explorer** is Microsoft's free GUI desktop application for managing storage.
* Storage Explorer uses **AzCopy v10 under the hood** as its primary copy/transfer engine for all high-throughput blob and file operations. Non-technical users requiring GUI drag-and-drop operations leverage AzCopy through Storage Explorer.

---

## 3. Authentication & Authorization Deep Dive

Microsoft AZ-104 rigorously tests the specific authorization method used for each storage service:

```
                              ┌── Authentication Method ──┐
                              │                           │
                     Microsoft Entra ID              SAS Token
                     (Identity-Based)             (Signed Query)
                              │                           │
          ✅ Azure Blob (Block/Page/Append)       ✅ Azure Blob
          ✅ ADLS Gen2 (Hierarchical)             ✅ ADLS Gen2
          ✅ Azure Files (REST Privileged Role)   ✅ Azure Files (Standard)
```

### Method 1: Microsoft Entra ID (OAuth 2.0 / Identity-Based)
Used when assigning least-privilege enterprise identity roles without distributing shared secret strings.

#### How to Authenticate:
```bash
# Interactive browser login:
azcopy login

# Tenant-specific login:
azcopy login --tenant-id "<tenant-id>"

# Service Principal with Client Secret:
export AZCOPY_SPA_CLIENT_SECRET="<client-secret>"
azcopy login --service-principal --application-id "<app-id>" --tenant-id "<tenant-id>"

# Service Principal with Certificate:
azcopy login --service-principal --application-id "<app-id>" --cert-path "/path/to/cert.pem" --tenant-id "<tenant-id>"

# Managed Identity (VM or Container with System-assigned or User-assigned identity):
azcopy login --identity
azcopy login --identity --identity-client-id "<client-id>"
```

#### Mandatory Azure RBAC Roles Required:

| Storage Target | Permitted Built-In Data-Plane Roles | Forbidden / Ineffective Roles |
| :--- | :--- | :--- |
| **Azure Blob Storage / ADLS Gen2** | • `Storage Blob Data Owner`<br>• **`Storage Blob Data Contributor`** *(Standard)*<br>• `Storage Blob Data Reader` | ❌ `Owner`<br>❌ `Contributor`<br>❌ `Reader` *(ARM Control Plane only)* |
| **Azure Files (File Shares)** | • **`Storage File Data Privileged Contributor`**<br>• `Storage File Data Privileged Reader` | ❌ `Storage File Data SMB Share Contributor`<br>❌ `Storage File Data SMB Share Reader`<br>*(SMB client mount roles do NOT work for REST API transfers!)* |

> [!IMPORTANT]
> **The Azure Files Entra ID Nuance on the Exam:**
> 1. Standard SMB share roles (`Storage File Data SMB Share Contributor / Reader`) are for **SMB protocol drive mounting only** and fail in AzCopy.
> 2. AzCopy operates over the **File REST API**, which requires the specialized **`Storage File Data Privileged Contributor`** (for uploads/deletions) or **`Storage File Data Privileged Reader`** (for downloads) roles.
> 3. *Exam Duality:* Older questions in the AZ-104 pool frequently present **SAS Token** as the only valid answer for Azure Files. Modern questions test whether you know to select the **"Privileged"** role rather than the "SMB Share" role.

---

### Method 2: Shared Access Signature (SAS) Tokens
A SAS token is a signed URI query string granting restricted access rights for a specific timeframe.

* **Usage:** Appended directly to the resource URI in the command line (always wrap the URL in quotes to prevent the command line shell from interpreting `&` or `?`):
  ```bash
  azcopy copy "C:\data" "https://mystorage.blob.core.windows.net/mycontainer?<SAS-Token>" --recursive
  ```
* **Supported SAS Types:**
  1. **Account SAS:** Grants access to services at the account level (Blob, File, Queue, Table).
  2. **Service SAS:** Grants access to specific containers, directories, or individual blobs/file shares.
  3. **User Delegation SAS:** Secured by Microsoft Entra credentials rather than storage account keys (Blob and ADLS Gen2 only). Requires the **`Storage Blob Data Delegator`** role.

---

### Method 3: Storage Account Access Keys (Shared Key)
* **The CLI Rule:** There is **NO** command-line parameter for account keys (e.g., `--account-key` does **not** exist).
* **The Native Environment Variable Method:** AzCopy v10 natively supports Account Key authorization via environment variables:
  ```bash
  # Windows CMD:
  set AZCOPY_ACCOUNT_NAME=mystorageaccount
  set AZCOPY_ACCOUNT_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY==

  # Linux / macOS / Bash:
  export AZCOPY_ACCOUNT_NAME="mystorageaccount"
  export AZCOPY_ACCOUNT_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY=="
  ```
  When these variables are set in the session, AzCopy authorizes against the storage account directly without requiring a SAS token.
* **The SAS Generation Fallback:** If not using environment variables, you must generate a SAS token signed with the key and pass the SAS token in the URL.

---

### Method 4: Anonymous / Public Read Access
* Works **only** if the storage account has `allowBlobPublicAccess: true` and the container has `Container` or `Blob` anonymous access enabled.
* Allows read/download operations from `https://<account>.blob.core.windows.net/<container>/<blob>` with zero credentials.

---

## 4. SAS Token Parameter Anatomy (The Exam Anatomy)

On the AZ-104 exam, Microsoft frequently presents raw SAS URLs and asks candidates why an upload failed or which parameter must be corrected:

```
https://mystorage.blob.core.windows.net/data?sv=2024-11-04&ss=bf&srt=co&sp=rwdlacx&se=2026-12-31T23:59:59Z&st=2026-01-01T00:00:00Z&spr=https&sip=198.51.100.0/24&sig=EXAMPLE
```

| Parameter | Name | Valid Values | Exam Validation Rule / Trap |
| :--- | :--- | :--- | :--- |
| **`sv`** | Signed Version | e.g., `2024-11-04` | Storage API version. |
| **`ss`** | Signed Services | `b` (Blob), `f` (File), `q` (Queue), `t` (Table) | **Account SAS only.** If copying to Azure Files, `ss` **must contain `f`**. If `ss=b`, File transfers fail. |
| **`srt`** | Signed Resource Types | `s` (Service), `c` (Container/Share), `o` (Object/File) | **Account SAS only.** Uploading folder trees requires **both `c` and `o`** (`srt=co`). |
| **`sp`** | Signed Permissions | `r`, `w`, `d`, `l`, `a`, `c` | **Uploads:** Require **Write (`w`)**, **Add (`a`)**, and **Create (`c`)**.<br>**Recursive/Tree Copy:** Requires **List (`l`)** on source.<br>**Delete/Sync:** Requires **Delete (`d`)**. |
| **`se`** | Signed Expiry | ISO 8601 UTC timestamp | If expired, transfer drops. Resuming requires supplying a fresh token via `--source-sas` / `--destination-sas`. |
| **`st`** | Signed Start Time | ISO 8601 UTC timestamp | **Clock Skew Trap:** If set to exact current time, client clock skew can cause immediate `403 Forbidden`. Best practice: set 15 minutes in past. |
| **`sip`** | Allowed IP Address | Single IP or CIDR | If client machine runs from an IP outside this CIDR, AzCopy fails with `403 Authentication Error`. |
| **`spr`** | Allowed Protocol | `https` or `https,http` | If `spr=https` and URL uses `http://`, connection is instantly terminated. |
| **`sr`** | Signed Resource | `b` (Blob), `c` (Container), `d` (Dir), `s` (Share), `f` (File) | **Service SAS only.** Identifies scope. |
| **`sig`** | Signature | HMAC-SHA256 string | Cryptographic hash validating the token hasn't been tampered with. |

---

## 5. Command Verbs & Core Syntax

```bash
azcopy <verb> <source> <destination> [flags]
```

| Verb | Purpose | Primary Syntax Example |
| :--- | :--- | :--- |
| **`copy`** | Transfers files/directories between source and destination (Local $\leftrightarrow$ Azure, or Cloud $\leftrightarrow$ Cloud). | `azcopy copy "src" "dst" [flags]` |
| **`sync`** | One-way directory synchronization (mirrors destination to match source). | `azcopy sync "src" "dst" [flags]` |
| **`remove`** (or `rm`) | Deletes blobs, directories, or files from Azure storage. | `azcopy rm "https://<account>.blob.../<container>/file.txt?<SAS>"` |
| **`list`** | Lists entities inside a container, directory, or file share. | `azcopy list "https://<account>.blob.../<container>?<SAS>"` |
| **`make`** (or `mk`) | Creates a new container in Blob storage or a new file share in Azure Files. | `azcopy make "https://<account>.blob.../newcontainer?<SAS>"` |
| **`jobs`** | Manages transfer operations (`list`, `show`, `resume`, `clean`). | `azcopy jobs resume <job-id>` |
| **`env`** | Displays all AzCopy environment variables and their active values. | `azcopy env` |
| **`doc`** | Generates offline reference documentation in Markdown format. | `azcopy doc --output-type=md` |

---

## 6. The Source-to-Destination Matrix

| Source | Destination | Tool Verb | Architectural Mechanism |
| :--- | :--- | :--- | :--- |
| **Local Disk** | Azure Blob Storage | `copy` or `sync` | Network upload. |
| **Azure Blob Storage** | Local Disk | `copy` or `sync` | Network download. |
| **Local Disk** | Azure Files (File Share) | `copy` or `sync` | Network upload (SAS or Privileged Entra ID). |
| **Azure Files** | Local Disk | `copy` or `sync` | Network download. |
| **Azure Blob Storage** | Azure Blob Storage | `copy` or `sync` | **Direct S2S Cloud Copy** (Azure backbone via Put Block From URL). No local download. |
| **Azure Files** | Azure Files | `copy` or `sync` | Direct S2S Cloud Copy. |
| **Azure Blob Storage** | Azure Files (or vice-versa) | `copy` | Direct S2S Cloud Copy. (`sync` between Blob and Files is unsupported). |
| **Amazon S3 Bucket** | Azure Blob Storage | `copy` | Direct S2S Cloud Copy. Requires `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY`. Destination must be Blob Storage. |
| **Google Cloud Storage** | Azure Blob Storage | `copy` | Direct S2S Cloud Copy. Requires GCP Storage Access Keys. |

---

## 7. Trailing Slash & URL Wildcard Rules

### Local vs Remote Wildcard Rules:
* **Local paths:** Wildcards (`*`) can appear anywhere (e.g., `C:\logs\2026\*.log`).
* **Remote Azure URLs (Microsoft Learn Specification):** Wildcards in URLs are strictly restricted to **two locations only**:
  1. Immediately following the final forward slash (`/`) of a URL:  
     `https://<account>.blob.core.windows.net/<container>/folder/*?<SAS>`
  2. Inside a container name *only* when the URL refers strictly to containers:  
     `https://<account>.blob.core.windows.net/container*?<SAS>`
* **The Fatal Trap:** Placing wildcards in the middle of virtual directories (e.g., `https://.../container/2026*/*.pdf`) is **INVALID** and causes syntax failure. To filter file types in remote hierarchies, you **must** use `--include-pattern "*.pdf"`.

### Directory Hierarchy Mapping:
```bash
# 1. Source without wildcard:
azcopy copy "C:\reports" "https://mystorage.blob.core.windows.net/finance?<SAS>" --recursive
```
* **Result:** Creates a virtual directory named `reports` inside the container: `finance/reports/file1.txt`.

```bash
# 2. Source with wildcard '/*':
azcopy copy "C:\reports\*" "https://mystorage.blob.core.windows.net/finance?<SAS>" --recursive
```
* **Result:** Copies the *contents* of `reports` directly into the root of `finance`: `finance/file1.txt` (no `reports` subfolder created).

---

## 8. Comprehensive Flag Reference for AZ-104

### 1. Directory & Traversal Flags
* **`--recursive`** (Boolean):
  * **Critical Exam Discrepancy:**
    * In **`azcopy copy`**, `--recursive` defaults to **`false`**. (Omitting it copies only loose root files).
    * In **`azcopy sync`**, `--recursive` defaults to **`true`**!
* **`--follow-symlinks`** (Boolean, default: `false`): Resolves and follows symbolic links on local filesystems.

### 2. Overwrite, Dry Run & Comparison Flags
* **`--overwrite`** (String, default: `true`): Supported values: `true`, `false`, `prompt`, `ifSourceNewer`.
* **`--dry-run`** (Boolean, default: `false`): Prints the files that would be copied, synced, or deleted without modifying any data. Essential for migration change-control validation.
* **`--compare-hash`** (String, default: `None`): In `azcopy sync`, compares MD5 hashes (`None` or `MD5`) in addition to timestamps.

### 3. Storage Tiering & Blob Types
* **`--block-blob-tier`** (String): Sets tier at upload: `Hot`, `Cool`, `Cold`, `Archive`.
  * **The Archive Rehydration Trap:** AzCopy **cannot download or read directly from the Archive tier**. Attempting to copy an archived blob throws an HTTP 409 / `BlobArchived` error. Blobs must first be **rehydrated** to Hot or Cool tier before AzCopy can transfer them.
* **`--blob-type`** (String, default: `BlockBlob`): Supported values: `BlockBlob`, `PageBlob`, `AppendBlob`.
  * **The VHD Disk Trap:** Uploading an on-premises `.vhd` for an Azure VM **must** specify `--blob-type=PageBlob`, must be fixed-size, must be aligned to a **512-byte boundary**, and **must be `.vhd` (not `.vhdx`)**.
* **`--s2s-preserve-access-tier`** (Boolean, default: `true`): Preserves tier in cloud-to-cloud copies (set to `false` when targeting Premium Block Blob accounts).

### 4. Windows File Share Migration Flags (SMB / NTFS)
* **`--preserve-smb-permissions`** (Boolean, default: `false` for Blobs, `true` for Files): Preserves Windows NTFS Access Control Lists (ACLs). Mandatory for file server migrations to Azure Files.
* **`--preserve-smb-info`** (Boolean, default: `true` for SMB-aware transfers): Preserves creation time, last write time, and attribute bits (ReadOnly, Hidden, System).
* **`--preserve-owner`** (Boolean, default: `false`): Preserves user and group ownership in ADLS Gen2 alongside POSIX ACLs (`--preserve-permissions`).

### 5. Filtering & Delimiter Syntax
* **`--include-pattern`**: Semicolon-separated list of file names/wildcards (e.g. `--include-pattern "*.jpg;*.png"`).
* **`--exclude-pattern`**: Semicolon-separated list of file names/wildcards to exclude.
* **`--include-path`**: Semicolon-separated list of relative directory paths (no wildcards).
* **`--exclude-path`**: Semicolon-separated list of relative directory paths to exclude.
* **`--include-after` / `--include-before`**: Filters by ISO 8601 UTC timestamp (`2026-11-01T00:00:00Z`).
* **Delimiter Difference:**
  * `--metadata` uses **semicolons**: `"dept=finance;audit=2026"`
  * `--blob-tags` uses **ampersands**: `"dept=finance&audit=2026"`

### 6. Throttling & Integrity
* **`--cap-mbps`** (Float): Caps transfer throughput in **Megabits per second (Mbps)** to prevent saturating production internet pipes.
* **`--put-md5`** (Boolean): Computes MD5 hash and stores it in blob `Content-MD5` header.
* **`--check-md5`**: Validates MD5 on download (`FailIfDifferent`, `NoCheck`, `LogOnly`).

---

## 9. `azcopy copy` vs `azcopy sync` (The Deep Dive)

```
┌──────────────────────────────────────────┬──────────────────────────────────────────┐
│               azcopy copy                │               azcopy sync                │
├──────────────────────────────────────────┼──────────────────────────────────────────┤
│ Direction: Point A to Point B            │ Direction: Source MIRRORS to Destination │
│ Copies everything matching filter        │ Compares timestamps / hashes (Delta)     │
│ Overwrites identical files by default    │ SKIPS identical, unmodified files        │
│ Orphan files at destination: KEPT        │ Orphan files: DELETED with               │
│                                          │ --delete-destination=true                │
│ Default recursive: FALSE                 │ Default recursive: TRUE                  │
│ Supports S3 & GCS as source              │ Only supports Local and Azure Storage    │
└──────────────────────────────────────────┴──────────────────────────────────────────┘
```

### The `--delete-destination` Flag:
* Values: `false` (default), `true`, `prompt`.
* If `true`: Deletes files from destination that no longer exist in source.
* *Exam Rule:* Any question requiring destination cleanup / exact mirror synchronization requires **`azcopy sync ... --delete-destination=true`**.

---

## 10. Job Engine, Resume Mechanics & Logging

### Architecture
* Generates a unique **Job ID** (GUID) per execution.
* Tracks progress in binary **Plan (`.plan`)** and **Journal (`.jnl`)** files saved to:
  * Windows: `%USERPROFILE%\.azcopy\`
  * Linux/macOS: `~/.azcopy/`
* Chunks are committed transactionally to the plan file.

### Job Management Commands:
```bash
azcopy jobs list
azcopy jobs show <job-id> --with-status=Failed
azcopy jobs resume <job-id>
azcopy jobs clean
```

### The Expired SAS Resume Trap (High-Yield Exam Trap):
* If an 8-hour transfer fails at 90% and the original SAS token expires, executing `azcopy jobs resume <job-id>` **FAILS** because AzCopy does not store plaintext secrets in plan files.
* **The Solution:** Pass new SAS tokens directly into the resume command:
  ```bash
  azcopy jobs resume <job-id> --source-sas="<new-sas>" --destination-sas="<new-sas>"
  ```

---

## 11. Performance Tuning & Environment Variables

| Variable | Valid Values | Purpose |
| :--- | :--- | :--- |
| **`AZCOPY_CONCURRENCY_VALUE`** | `AUTO` (default) or Integer | Adjusts concurrent HTTP connections (auto-scales up to 300). |
| **`AZCOPY_BUFFER_GB`** | Float (e.g. `4`, `0.5`) | Caps max system RAM AzCopy can use for buffering. |
| **`AZCOPY_JOB_PLAN_LOCATION`** | File path | Redirects `.plan` files away from OS drive (`C:\`) to high-capacity storage during massive migrations. |
| **`AZCOPY_ACCOUNT_NAME`** | String | Storage account name for native Account Key authentication. |
| **`AZCOPY_ACCOUNT_KEY`** | String | Storage account access key for native Account Key authentication. |
| **`AZCOPY_AUTO_LOGIN_TYPE`** | `SPN`, `MSI`, `DEVICE`, `AZCLI`, `PSCRED` | Unattended auto-login for CI/CD pipelines without running `azcopy login`. |
| **`HTTPS_PROXY`** | Proxy URL | Defines outbound corporate proxy server (`http://user:pass@proxy:8080`). |
| **`NO_PROXY`** | Domain/IP list | Bypasses proxy for direct Azure backbone endpoints. |

---

## 12. Network Routing: TCP 445 (SMB) vs TCP 443 (HTTPS REST)

This is a classic real-world and exam scenario:

* **The Problem:** Many residential ISPs and corporate firewalls block outbound **TCP Port 445** to prevent SMB malware exploits.
* **The Symptom:** Mounting an Azure File Share via `net use`, Windows Explorer, or Robocopy fails with network errors.
* **The AzCopy Solution:** AzCopy communicates with Azure Files over the **File REST API using TCP Port 443 (HTTPS)**.
* *Exam Takeaway:* When SMB port 445 is blocked, use **AzCopy** to upload and download files to Azure File Shares.

---

## 13. Data Migration Decision Matrix: AzCopy vs All Alternatives

```
                                  DATA MIGRATION DECISION TREE
                                                │
                       Is the data transfer Online (over network)
                               or Offline (physical shipping)?
                                       ┌────────┴────────┐
                                    ONLINE            OFFLINE
                                       │                 │
                What is the nature of the sync?    Data Volume?
                    ┌───────────────┴───────────────┐    │
               One-time / Scripted      Continuous  │    ├─ < 35 TB: Azure Data Box Disk
                        │               File Share  │    │           (8 TB SSDs)
            Interface Preference?          Sync     │    │
               ┌────────┴────────┐          │       │    ├─ < 80 TB: Azure Data Box
           CLI / Script       Desktop GUI   │       │    │           (100 TB appliance)
               │                 │          │       │    │
            AzCopy         Azure Storage  Azure     │    ├─ > 500 TB: Azure Data Box Heavy
             v10             Explorer     File      │    │            (1 PB unit)
                                          Sync      │    │
                                                    │    └─ Customer ships OWN hard drives:
                                                    │       Azure Import/Export Service
```

### Complete Comparative Matrix:

| Technology | Best Suited Scenario | Network Dependency | Key Distinguishing Factor |
| :--- | :--- | :--- | :--- |
| **AzCopy v10** | High-throughput scripted migration of files, folders, or blobs up to tens of TBs. | Online (Internet / ExpressRoute) | Command-line, multi-threaded, supports S2S cloud copy, SAS/Entra ID. Works over Port 443. |
| **Azure Storage Explorer** | Non-technical users, ad-hoc uploads/downloads, visual container management. | Online | GUI desktop app; uses AzCopy engine under the hood. |
| **Azure File Sync (AFS)** | Hybrid file server tiering; branch office multi-site caching; bi-directional Windows Server sync. | Online (Continuous background sync) | Requires agent on Windows Server; features **Cloud Tiering** (keeps hot files local). |
| **Azure Storage Mover** | Fully managed, cloud-orchestrated hybrid migration for large-scale on-premises SMB/NFS file shares. | Online | Agent VM deployed on Hyper-V/VMware; managed and scheduled centrally via Azure Portal. |
| **Azure Data Factory (ADF)** | Enterprise data transformation (ETL/ELT), multi-source pipelines across 90+ connectors. | Online | Complex orchestration service; handles transformation rather than pure file transfer. |
| **Azure Data Box Disk** | Small-to-medium offline shipments (up to 35 TB total, shipped in sets of up to 5x 8TB SSDs). | Offline (Courier via DHL/FedEx) | Pre-encrypted with BitLocker; USB/SATA interface. |
| **Azure Data Box (Standard)** | Medium-to-large offline migrations (up to 80 TB usable data). | Offline (Ruggedized 100 TB appliance) | Microsoft ships the appliance; connects via RJ45/SFP+ 10GbE network cables. |
| **Azure Data Box Heavy** | Massive enterprise datacenter evacuations (up to 800 TB usable data). | Offline (Huge wheeled device on casters) | Dual 40GbE interfaces; 1 Petabyte raw capacity. |
| **Azure Import/Export** | Customer **owns their own 2.5" or 3.5" SATA hard drives** and wants to mail them directly to an Azure datacenter. | Offline | Must prepare disks with `WAImportExport.exe` tool and encrypt with BitLocker. |

---

## 14. The 9 Classic AZ-104 Exam Scenarios & Traps

### Scenario 1: Migrating Windows File Server with ACLs
* **Requirement:** Copy 5 TB from Windows Server to Azure Files preserving NTFS ACLs and timestamps.
* **Solution:** Run `azcopy copy` using a SAS token (or Privileged Entra role) and append:
  ```bash
  --preserve-smb-permissions=true --preserve-smb-info=true --recursive
  ```

### Scenario 2: Synchronizing Directory and Deleting Deprecated Files
* **Requirement:** Mirror local `D:\Web` to an Azure Blob container, removing files from Azure that were deleted locally.
* **Solution:**
  ```bash
  azcopy sync "D:\Web" "https://mystorage.blob.core.windows.net/web?<SAS>" --delete-destination=true
  ```

### Scenario 3: Uploading Directly to Archive Tier
* **Requirement:** Upload financial records directly into the lowest-cost storage tier without post-upload lifecycle rules.
* **Solution:** Append `--block-blob-tier=Archive` to the `azcopy copy` command.

### Scenario 4: Interrupted Transfer with Expired SAS Token
* **Requirement:** Resume a failed 15 TB upload after the original 8-hour SAS token expired.
* **Solution:** Generate a new SAS token and execute:
  ```bash
  azcopy jobs resume <job-id> --source-sas="<new-sas>" --destination-sas="<new-sas>"
  ```

### Scenario 5: Direct Cloud-to-Cloud Migration (S3 to Azure Blob)
* **Requirement:** Migrate 20 TB from AWS S3 to Azure Blob without downloading to the admin workstation.
* **Solution:** Set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in environment, then run `azcopy copy` from the S3 URL to the Azure Blob URL. (Bytes transfer directly cloud-to-cloud).

### Scenario 6: Uploading Bootable VHD Disks
* **Requirement:** Upload an on-premises Windows Server VM disk image to create an Azure VM image.
* **Solution:** Must specify `--blob-type=PageBlob`, ensure 512-byte boundary alignment, and ensure the format is `.vhd` (never `.vhdx`).

### Scenario 7: Outbound Port 445 Blocked by ISP
* **Requirement:** Admin cannot mount Azure File Share over SMB because residential ISP blocks TCP 445.
* **Solution:** Use **AzCopy** (or Azure Storage Explorer) to transfer files over HTTPS port 443.

### Scenario 8: Downloading Blobs from Archive Tier
* **Requirement:** Admin attempts to download archived blobs using AzCopy and gets `BlobArchived` error.
* **Solution:** Blobs must first be **rehydrated** to Hot or Cool tier before AzCopy can read them.

### Scenario 9: S2S Transfer Between Firewalled Storage Accounts
* **Requirement:** Direct cloud copy between two storage accounts fails with `403 Forbidden`.
* **Solution:** In direct S2S transfers, the destination cluster pulls directly from the source via `Put Block From URL`. The source account firewall must be configured to allow inbound access from the destination service or public endpoints.

---

## 15. The Top 10 "Fatal Traps" Quick-Reference Card

```
┌────────────────────────────────────────┬────────────────────────────────────────────────────────┐
│ Trap / Question Pattern                │ The Winning Exam Answer                                │
├────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 1. ISP blocks outbound TCP port 445    │ Use AzCopy (TCP 443 / HTTPS REST) instead of Robocopy  │
│    to Azure Files.                     │ or standard SMB network drive mapping.                 │
├────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 2. Use Entra ID with AzCopy against    │ Assign "Storage File Data PRIVILEGED Contributor" role.│
│    Azure Files.                        │ (Standard "SMB Share Contributor" roles FAIL).         │
├────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 3. Can you pass Account Key on CLI?    │ NO. No --account-key flag. Use SAS token, OR set       │
│                                        │ AZCOPY_ACCOUNT_NAME & AZCOPY_ACCOUNT_KEY env vars.     │
├────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 4. Resume interrupted job after SAS    │ Must provide new SAS via --source-sas and              │
│    has expired.                        │ --destination-sas on `azcopy jobs resume`.             │
├────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 5. AzCopy downloading Archive blob.    │ FAILS (BlobArchived). Must rehydrate to Hot/Cool first.│
├────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 6. Upload on-prem VHD for Azure VM.    │ Must be PageBlob (--blob-type=PageBlob), 512-byte      │
│                                        │ aligned, and fixed .vhd format (.vhdx not supported).  │
├────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 7. Delete orphan files at destination. │ Use `azcopy sync` with `--delete-destination=true`.    │
│                                        │ (`azcopy copy` can NEVER delete orphan files).         │
├────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 8. Recursive behavior defaults.        │ `azcopy copy` defaults to recursive=false.             │
│                                        │ `azcopy sync` defaults to recursive=true.              │
├────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 9. S2S direct cloud copy across        │ Destination cluster pulls directly from source.        │
│    storage accounts with firewalls.    │ Source firewall must allow destination access.         │
├────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 10. Run AzCopy with zero installation. │ Use Azure Cloud Shell (AzCopy is pre-installed).       │
└────────────────────────────────────────┴────────────────────────────────────────────────────────┘
```
