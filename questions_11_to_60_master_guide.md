# AZ-104 Master Guide: Questions 11 to 60 Comprehensive Breakdown

> **Exam Review Series:** Shireen Khan Practice Test #1 (Q11–Q60 including ApexCore Case Study)
> **Target:** Microsoft Certified: Azure Administrator Associate (AZ-104)
> **Prerequisites:** Zero assumed knowledge — concepts explained from first principles.

## Table of Contents

- [Module 1: Blob Types & Object Replication (Q11–Q14)](#mod1)
- [Module 2: Container Ecosystem — ACR & ACI (Q15–Q18, Q29–Q31)](#mod2)
- [Module 3: Storage Account Key Management & Least Privilege (Q19–Q22)](#mod3)
- [Module 4: Virtual Machine Operations & Host Maintenance (Q23–Q28)](#mod4)
- [Module 5: Entra ID Governance, Group Licensing & SSPR (Q32, Q38, Q39)](#mod5)
- [Module 6: Azure RBAC Hierarchy & Scope Inheritance (Q33–Q35, Q45, Q46)](#mod6)
- [Module 7: Virtual Networking & User-Defined Routing (Q40, Q43)](#mod7)
- [Module 8: Storage Architecture, Vaults & Key Vault (Q36, Q37, Q41, Q42, Q44)](#mod8)
- [Module 9: ApexCore Consulting Case Study Deep Dive (Q47–Q60)](#mod9)

---

<a id="mod1"></a>
## Module 1: Blob Types & Object Replication (Q11–Q14)

Azure Storage provides three distinct blob formats and advanced cross-account replication capabilities. Microsoft frequently tests the precise technical boundaries between them.

### Q11: Blob Inventory Rule — Blob Types Selection

**Outcome / Status:** `Correct Answer: blockBlob`

**Scenario:** You manage storage account `dataarchive01` containing thousands of images in container `images` . You deploy an ARM template to generate a daily CSV inventory of files starting with "finance". What blob type should you specify?

> [!IMPORTANT]
> - **🎯 Core Rule (The 3 Blob Types):**
> - **Block Blobs (`blockBlob`):** Used for unstructured general files (images, documents, videos, backups, CSVs). Stored in blocks up to 190.7 TB. *Always choose this for standard files.*
> - **Page Blobs (`pageBlob`):** 512-byte aligned for random read/write access. Exclusively used for **virtual machine VHD hard disks** .
> - **Append Blobs (`appendBlob`):** Optimized exclusively for appending new blocks to the end. Used for **application logging and audit trails** .

### Q12: Blob Inventory Rule — Prefix Filter Syntax

**Outcome / Status:** `Correct Answer: images/finance`

**Scenario:** What prefix match string must be defined to inventory blobs starting with "finance" inside container `images` ?

> [!IMPORTANT]
> - **🎯 Core Rule (Prefix Matching):** In Azure Blob Inventory and Lifecycle Management rules, the prefix path **must always include the container name**: `<container-name>/<blob-prefix>`.
> - `finance` fails because it omits the container.
> - `images/*` is invalid wildcard syntax for exact prefix matching.

### Q13 & Q14: Object Replication — Target Object & Account Requirements

**Outcome / Status:** `Q13: Container | Q14: StorageV2 or BlobStorage only`

**Scenario:** Replicate image blobs from `mediafiles01` to a new storage account. What target object must you create? What account type must you deploy?

> [!IMPORTANT]
> - **🎯 Core Rule (Object Replication Rules):**
> - **Target Object:** **Container** . Object Replication is strictly a feature of Blob Storage. It replicates block blobs between containers. It does NOT replicate File shares, Tables, or Queues.
> - **Eligible Account Types:** **General-purpose v2 (`StorageV2`)** or **Premium Block Blobs (`BlobStorage`)** . `FileStorage` accounts only support Azure Files and are strictly excluded.
> - **Mandatory Prerequisites:** Both source and destination accounts must have **Blob Versioning** and **Blob Change Feed** enabled.

---

<a id="mod2"></a>
## Module 2: Container Ecosystem — ACR & ACI (Q15–Q18, Q29–Q31)

Azure Container Registry (ACR) hosts container images, while Azure Container Instances (ACI) runs serverless containers. Connecting them reliably under security constraints is heavily tested.

### Q15–Q18: ACI Deployment Failure Pulling from ACR

**Outcome / Status:** `Missed Q17 & Q18`

**Scenario:** Deploying an ACI container using image `webappimage` from private ACR `corpRegistry` fails with an authentication error. Which solutions solve this?

> [!IMPORTANT]
> - **🎯 Core Rule (ACR Authentication Matrix):**
> - **Q15 (Private Endpoint $\to$ No):** Secures network transport, but does not provide credentials. The container still cannot authenticate.
> - **Q16 (Dedicated Data Endpoint $\to$ No):** Optimizes data-plane routing; does not grant pull rights.
> - **Q17 (AcrPull to ACR-Tasks $\to$ No):** *The Trap!* `ACR-Tasks` is the internal build agent inside ACR. Assigning it `AcrPull` does not help an external ACI instance. The role must be assigned to the ACI's Managed Identity!
> - **Q18 (Enable Admin User $\to$ Yes):** Enabling the Admin user generates a static username and password on the registry. Passing these into ACI lets it authenticate and pull the image immediately. (Valid answer to "Does it work?").

### Q29 & Q30: CLI Commands for ACR Provisioning & Image Push

**Outcome / Status:** `Q29: az acr create | Q30: docker push`

**Scenario:** You build `invoiceservice-img` locally on a workstation with Docker and Azure CLI. What command creates the registry? What command uploads the image?

> [!IMPORTANT]
> - **🎯 Core Rule (CLI Tooling Division):**
> - To provision the cloud registry: `az acr create --resource-group <rg> --name <name> --sku Basic` . (Note: `az acr build` builds an image in the cloud; it does not provision the registry).
> - To upload local image bytes to ACR: `docker push <registry-login-server>/invoiceservice-img:tag` . ( `docker tag` only labels the image; it does not transfer bits).

### Q31: ACI CPU Contention in Multi-Container Groups

**Outcome / Status:** `Missed: Container Limits`

**Scenario:** Container group `PodGroup1` hosts `svc-api` (Request: 2 CPU, Limit: 2 CPU) and `svc-worker` (Request: 3 CPU, Limit: 4 CPU). Total allocated = 5 CPUs. Ensure `svc-worker` cannot consume CPU at the expense of `svc-api` without changing group architecture.

> [!IMPORTANT]
> - **🎯 Core Rule (ACI Resource Requests vs Limits):** In an Azure Container Instance group, the hypervisor allocates total CPU based on the **sum of container resource requests** ($2 + 3 = 5\text{ CPUs}$).
> - If a container has a *limit higher than its request* (like 4 CPUs for worker), it is allowed to burst into unused pooled capacity, starving neighboring containers.
> - **The Fix:** If you **remove the resource limit** on containers, their maximum CPU is automatically capped **exactly at their resource request** ($2\text{ and }3$). Neither container can burst into the other's share.

---

<a id="mod3"></a>
## Module 3: Storage Account Key Management & Least Privilege (Q19–Q22)

Managing access keys (Shared Keys) vs data access vs control plane operations is one of the most tested governance topics in AZ-104.

### Q19–Q22: Granting UserA Rights to List and Regenerate Storage Keys

**Outcome / Status:** `Missed Q21`

**Scenario:** UserA must be granted permissions to view (list) storage account access keys and regenerate them when necessary for `datastore01` . Which roles achieve this?

> [!IMPORTANT]
> - **🎯 Core Rule (Storage Key Permission Matrix):**
> - **Q19 (Encryption Scope Contributor $\to$ No):** Manages customer-managed keys for blob encryption scopes; cannot view or rotate account root keys.
> - **Q20 (Storage Account Key Operator Service Role $\to$ Yes):** The dedicated least-privilege role designed strictly for key listing and regeneration without full management rights.
> - **Q21 (Storage Account Contributor $\to$ Yes):** *The Trap!* While not least-privilege, `Storage Account Contributor` has full control plane management over the storage account, including `listkeys/action` and `regeneratekey/action` . It **does achieve the objective** .
> - **Q22 (Reader and Data Access $\to$ No):** Allows listing keys to read data, but strictly lacks permission to **regenerate (write)** keys.

---

<a id="mod4"></a>
## Module 4: Virtual Machine Operations & Host Maintenance (Q23–Q28)

Azure runs scheduled platform maintenance on underlying physical hypervisors. When proactive relocation is required, only specific operations move the VM to new hardware.

### Q23–Q28: Immediately Relocating ShireenVM to Avoid Scheduled Maintenance

**Outcome / Status:** `Missed Q27`

**Scenario:** You receive an alert stating `ShireenVM` will be impacted by scheduled host maintenance. You must immediately relocate the VM to a different physical host. Which action works?

> [!IMPORTANT]
> - **🎯 Core Rule (VM Redeployment vs Metadata Moves):**
> - **Q23 & Q26 (Updates Blade $\to$ No):** Applies guest OS or host patches in place; does not proactively relocate the VM to fresh hardware.
> - **Q24, Q25, Q28 (Move Resource Group / Subscription $\to$ No):** Moving a VM between resource groups or subscriptions is purely a **logical ARM metadata update** . The VM remains pinned to the exact same physical blade in the datacenter.
> - **Q27 (Redeploy Blade $\to$ YES):** Clicking **Redeploy** instructs Azure to shut down the VM, migrate the compute instance to an entirely different healthy physical host within the same Azure region, and restart it. OS and data disks are preserved. This immediately clears the maintenance window!

---

<a id="mod5"></a>
## Module 5: Entra ID Governance, Group Licensing & SSPR (Q32, Q38, Q39)

User administration, group naming conventions, licensing tiers, and self-service password reset rules.

### Q32: Microsoft Entra ID Group Naming Policy Setup

**Outcome / Status:** `Correct Sequence: 2 - 3 - 6`

**Scenario:** Enforce naming format `<Office><RequestedName>` automatically when new M365 groups are created. What is the ordered sequence of actions?

> [!IMPORTANT]
> - **🎯 Core Rule (Naming Policy Workflow):** 1. **Step 1 (Action 2):** Create a group naming policy in Microsoft Entra admin center. 2. **Step 2 (Action 3):** Set *Add prefix* to **Attribute**. 3. **Step 3 (Action 6):** Set *Select type* to **Office** (maps user's office attribute as prefix).

### Q38: License Assignment on Microsoft Entra ID Free Tier

**Outcome / Status:** `Missed: License Assignment`

**Scenario:** Tenant has Free tier license. Identities: `UserA` (User), `SecGroup01` (Security group), `M365Group01` (M365 group). Who can be assigned a Microsoft Fabric license?

> [!IMPORTANT]
> - **🎯 Core Rule (Group-Based Licensing Tier Requirement):** Assigning licenses to groups (Security or M365 groups) is an advanced feature that **strictly requires Microsoft Entra ID P1 or P2**.
> - On the **Free tier**, licenses can **ONLY** be assigned directly to individual users (`UserA only`).

### Q39: Self-Service Password Reset (SSPR) Scope Assignment

**Outcome / Status:** `Missed: SSPR Scoping`

**Scenario:** You plan to enable Self-Service Password Reset (SSPR) in the Azure Portal. For which identities can SSPR be enabled?

> [!IMPORTANT]
> - **🎯 Core Rule (SSPR Portal Scopes):** In the Azure Portal SSPR configuration blade, the assignment options are strictly: `None`, `Selected`, or `All`.
> - Under **Selected**, the interface **ONLY allows selecting Groups** (Security groups or Microsoft 365 groups). You **CANNOT** select individual user accounts directly!
> - Correct Answer: **`SecGroup01 and M365Group01 only`**.

---

<a id="mod6"></a>
## Module 6: Azure RBAC Hierarchy & Scope Inheritance (Q33–Q35, Q45, Q46)

Permissions inherit downward through the management hierarchy. Control plane roles do not grant data plane rights, and child scopes cannot restrict inherited parent permissions.

### Q33–Q35: Management Group Hierarchy Permissions

**Outcome / Status:** `Q33: True | Q34: False | Q35: True`

**Scenario:** Tenant Root Group contains `Global-MG1` (has `AtlasSub` ) and `Global-MG2` (has `ZenithSub` with `vm-prod1` ). `NovaSub` has no parent MG.

> [!IMPORTANT]
> - **🎯 Core Rule (RBAC Hierarchy Downward Cascade):**
> - **Q33 (Morgan can resize vm-prod1 $\to$ True):** Morgan has `Contributor` at `Global-MG2` . This cascades down through `ZenithSub` and `rg-vm` to `vm-prod1` . Contributor allows resizing VMs.
> - **Q34 (Riley can create storage account in rg-data $\to$ False):** Riley has `Storage Account Contributor` assigned strictly to `storeA1` (resource scope). Riley has zero permissions on the parent resource group `rg-data` to create new storage accounts.
> - **Q35 (Casey can assign Morgan Owner on rg-vm $\to$ True):** Casey has `User Access Administrator` at the **Tenant Root Group** . This gives role assignment power across every subscription and resource group in the entire tenant.

### Q45 & Q46: Subnet Creation vs Role Assignment on Virtual Networks

**Outcome / Status:** `Q45: Dana and Sam | Q46: Dana only`

**Scenario:** VNet `vnet-hub1` . Dana (Owner), Priya (Security Admin), Sam (Network Contributor). Who can create a subnet? Who can assign another user Reader?

> [!IMPORTANT]
> - **🎯 Core Rule (Network RBAC Roles):**
> - **Creating Subnets:** Managed via `Microsoft.Network/virtualNetworks/subnets/write` . Both **Owner (Dana)** and **Network Contributor (Sam)** have full network management rights. (Security Admin only manages Defender/security policies).
> - **Assigning Roles:** Strictly an IAM action ( `Microsoft.Authorization/roleAssignments/write` ). **Owner (Dana)** has this. Network Contributor does not!

---

<a id="mod7"></a>
## Module 7: Virtual Networking & User-Defined Routing (Q40, Q43)

Forcing network traffic through firewalls and Network Virtual Appliances (NVAs) requires custom route tables.

### Q40 & Q43: Forcing Inter-VNet Traffic Through an NVA & Next Hop Types

**Outcome / Status:** `Q40: Route table with custom routes | Q43: Virtual appliance`

**Scenario:** Route traffic between peered VNets through NVA `fw-appliance1` . Which component redirects traffic? Which next hop type requires specifying an IP address?

> [!IMPORTANT]
> - **🎯 Core Rule (User-Defined Routes & Next Hop Types):**
> - **Traffic Redirection:** NSGs can only *Allow* or *Deny* traffic; they cannot reroute packets. To force traffic through an NVA, you must attach a **Route Table (UDR)** with a custom route (e.g., `10.2.0.0/16 -> NVA IP` ).
> - **Next Hop Types:** **Virtual appliance:** The **ONLY** next hop type where you must manually supply a target IP address (the private IP of your firewall/NVA). **Virtual network gateway:** Routes to VPN/ExpressRoute (no IP specified). **Internet:** Routes directly out to public internet (no IP specified). **None:** Blackholes / drops traffic.

---

<a id="mod8"></a>
## Module 8: Storage Architecture, Vaults & Key Vault (Q36, Q37, Q41, Q42, Q44)

Backup Vaults vs Recovery Services Vaults, Key Vault regional flexibility, and Data Lake Storage options.

### Q36 & Q37: Azure Backup Vault vs. Recovery Services Vault (RSV)

**Outcome / Status:** `Q36: Disk01 | Q37: VM01`

**Scenario:** You have Backup vault `VaultA` and Recovery Services vault `VaultB` . Resources: `VM01` , `Disk01` , `WebApp01` , `SQLDB01` . Which protects which?

> [!IMPORTANT]
> - **🎯 Core Rule (The Vault Split Matrix):**
> - **Recovery Services Vault (VaultB):** The classic vault for **Azure Virtual Machines (VM01)** , SQL Server in Azure VMs, and Azure Backup Server (MARS agent).
> - **Azure Backup Vault (VaultA):** The modern vault designed for newer workloads: **Azure Managed Disks (Disk01)** , Azure Blobs, Azure Files (vaulted), and AKS.

### Q41 & Q42: Key Vault Authentication & Regional Boundaries

**Outcome / Status:** `Missed Q42`

**Scenario:** Container app `checkout-app` in West US needs a secret from Key Vault. `kv-primary` is in West US; `kv-secondary` and `kv-archive` are in East US and Central US. What authentication is used? Which Key Vault can be accessed?

> [!IMPORTANT]
> - **🎯 Core Rule (Key Vault Regional Independence):**
> - **Authentication:** **Managed Identity** . Provides an automatic Entra ID token with zero embedded credentials.
> - **Which Key Vault can be used?** **`kv-primary, kv-secondary, or kv-archive`** . Azure Key Vaults are public HTTPS endpoints. There are **zero regional or resource group boundaries** blocking an app in West US from querying a Key Vault in East US. (Best practice recommends same region for latency, but Azure does not restrict cross-region access).

### Q44: Azure Data Lake Storage Configuration Options

**Outcome / Status:** `Options: hierarchical namespace, Cool tier, GRS`

**Scenario:** Provision storage account `storage1` : Must be compatible with Azure Data Lake Storage, optimized for infrequent access cost, and automatically replicate to another Azure region.

> [!IMPORTANT]
> - **🎯 Core Rule (ADLS Gen2 Settings):** 1. **Hierarchical Namespace (HNS):** The mandatory feature that transforms standard Blob Storage into Azure Data Lake Storage Gen2 (enables true directory file trees and atomic renames). 2. **Cool Access Tier:** Lowest storage cost for infrequently accessed data (30-day minimum retention). 3. **Geo-Redundant Storage (GRS):** Asynchronously replicates data 3x locally + 3x to a paired secondary region.

---

<a id="mod9"></a>
## Module 9: ApexCore Consulting Case Study Deep Dive (Q47–Q60)

The 14-question ApexCore Case Study tests intricate real-world enterprise constraints across Azure Files, Custom Security Attributes, Disk Encryption (ADE/KEK), Immutability, App Service TLS, and Log Analytics.

### Q47 & Q48: Azure Backup Maximum Frequency — Blobs vs. Azure Files

**Outcome / Status:** `Missed Q48`

**Scenario:** Technical requirement: `data1` (Blob container) and `docs1` (Azure file share) must be backed up as frequently as Azure Backup allows.

> [!IMPORTANT]
> - **🎯 Core Rule (Backup Frequency Limits):**
> - **Azure Blob Storage (data1):** Vaulted blob backup only supports **Daily** or Weekly scheduled backups. Hourly is unsupported.
> - **Azure Files (docs1):** Azure Backup for file shares supports up to **24 snapshot backups per day** ! Therefore, it can run as frequently as **Every 1 hour** . (You chose Every 4 hours).

### Q49, Q50 & Q51: Microsoft Entra Custom Security Attributes

**Outcome / Status:** `Missed Q49 & Q51`

**Scenario:** Tenant has custom security attribute `AttribTag1` . Priya Shah (Global Admin), Derek Nguyen (Attribute Definition Admin), Lena Osei (Attribute Assignment Admin). Groups: `Cohort1` (Security group), `Cohort2` (M365 group). Can Priya or Lena assign the attribute to groups? Can Derek assign to a user?

> [!IMPORTANT]
> - **🎯 Core Rule (Custom Security Attributes Target Boundaries):**
> - **Target Objects:** Custom Security Attributes can **ONLY** be applied to **Users, Service Principals, and Managed Identities** . They can **NEVER be assigned to Groups** (neither Security nor M365 groups). Both Q49 and Q51 are strictly **False** !
> - **Role Separation:** **Attribute Definition Administrator (Derek):** Can create and manage attribute sets and keys. *Cannot assign them to users!* (Q50 is False). **Attribute Assignment Administrator (Lena):** Can assign defined attributes to supported objects (users, service principals). **Global Administrator (Priya):** By default, has **zero permissions** to read, define, or assign custom security attributes without explicit role assignment!

### Q52 & Q53: Azure Disk Encryption (ADE) with Key Encryption Key (KEK)

**Outcome / Status:** `Missed Q52`

**Scenario:** Encrypt VMs using Azure Disk Encryption paired with a KEK in `SecVault1` . `Key1` is RSA 4096; `Key2` is EC P-256. Which cmdlet and key? Which VMs qualify?

> [!IMPORTANT]
> - **🎯 Core Rule (ADE & KEK Requirements):**
> - **KEK Algorithm:** Azure Disk Encryption KEK **strictly requires an RSA key** (2048, 3072, or 4096). Elliptic Curve (EC) keys are completely unsupported for ADE. Use **Key1** .
> - **PowerShell Cmdlet:** **`Set-AzVMDiskEncryptionExtension`** . ( `Set-AzDiskEncryptionKey` is a fake cmdlet).
> - **VM Eligibility:** ✅ **Node2** (Windows Server 2022, Basic Volume) & **Node3** (Ubuntu 22.04 LTS, Standard SSD) $\to$ Fully supported. ❌ **Node1** (Ephemeral OS disk) $\to$ Unsupported for ADE. ❌ **Node4** (Write Accelerator disks) $\to$ Unsupported for ADE. ❌ **Node5** (Dynamic Volume) $\to$ Unsupported for ADE.

### Q54 & Q55: Storage Policy Limits — Stored Access Policies vs. Immutability

**Outcome / Status:** `Missed Q55`

**Scenario:** Container `data2` has 3 stored access policies and 1 legal hold. What is the maximum number of additional stored access policies? Additional immutable policies?

> [!IMPORTANT]
> - **🎯 Core Rule (Storage Policy Capacity Caps):**
> - **Stored Access Policies (SAS):** Maximum limit is **5 per container** . Since 3 exist, $5 - 3 =$ **2 additional policies** can be created.
> - **Immutable Blob Storage Policies:** Maximum limit is **2 per container** : exactly **1 Legal Hold** + **1 Time-Based Retention Policy** . Since `data2` already has a Legal Hold, exactly **1 additional policy** (time-based) can be created!

### Q56: Organizing Content into Hierarchical Directories

**Outcome / Status:** `Correct: data1, docs1, and docs2 only`

**Scenario:** Organize content into directories wherever achievable across `datastore1` (HNS enabled: `data1` blob, `docs1` file share) and `datastore2` (HNS disabled: `data2` blob, `docs2` file share).

> [!IMPORTANT]
> - **🎯 Core Rule (Hierarchical Directories in Storage):**
> - **Azure Files (docs1 & docs2):** File shares **natively support directories** regardless of storage account settings. Both qualify.
> - **Blob Storage:** Blobs only support true directories if **Hierarchical Namespace (HNS) is enabled** ( `data1` ). `data2` has HNS disabled, so it only has virtual folder paths, not true directories.

### Q57: App Service TLS Certificates from Key Vault

**Outcome / Status:** `Missed: PKCS#12 vs PEM`

**Scenario:** `AppSvc1` needs a TLS certificate from `SecVault1` . `TlsCert1` & `TlsCert2` are PKCS#12 (PFX); `TlsCert3` & `TlsCert4` are PEM format. Which certificates can be used?

> [!IMPORTANT]
> - **🎯 Core Rule (App Service Key Vault Certificate Import):** When Azure App Service imports certificates directly from Azure Key Vault, it **strictly requires PKCS#12 (.pfx) format** containing the private key.
> - **PEM format certificates cannot be imported directly** into App Service from Key Vault.
> - Correct Answer: **`TlsCert1 or TlsCert2 only`**.

### Q58: Data Collection Rules (DCR) Event Filtering Query Language

**Outcome / Status:** `Missed: XPath vs KQL`

**Scenario:** DCR `CollectRule1` gathers only system events carrying Event ID 4648 from Windows VMs `Node2` and `Node4` . Which query type must be configured in the DCR?

> [!IMPORTANT]
> - **🎯 Core Rule (DCR Ingestion vs Log Analytics Search):**
> - **At the Agent / Ingestion Level (DCR):** Filtering Windows Event Logs inside the Azure Monitor Agent uses **XPath queries** (e.g., `System!*[System[(EventID=4648)]]` ).
> - **In Log Analytics Workspace:** Querying data *after* ingestion uses **KQL (Kusto Query Language)** . KQL is not used inside the DCR event log filter.

### Q59 & Q60: Linking Private DNS Zones to Virtual Networks

**Outcome / Status:** `Q59: Network Contributor + Private DNS Zone Contributor | Q60: NetVnet1 & corezone1.com only`

**Scenario:** Carlos Vega needs permissions to link Private DNS zone `corezone1.com` (in `CoreRG3` ) to virtual network `NetVnet1` (in `CoreRG2` ) with least privilege.

> [!IMPORTANT]
> - **🎯 Core Rule (DNS Virtual Network Link Permissions):** Creating a virtual network link bridges two resources, requiring rights on both: 1. **Private DNS Zone Contributor:** Scoped to `corezone1.com` (to create the link object). 2. **Network Contributor:** Scoped to `NetVnet1` (provides `Microsoft.Network/virtualNetworks/join/action`).
> - **Least Privilege Scope:** Assign roles strictly at the resource level (`corezone1.com` and `NetVnet1`), *never* at the parent Resource Group level!
