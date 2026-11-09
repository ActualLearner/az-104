# AZ-104 Active Error Journal
**Personalized High-Yield Mistake Tracker & Distractor Dissection**

> *Protocol Reference:* See [error_logging_guide.md](file:///home/actual/projects/az-104/error_logging_guide.md) for the diagnostic framework.  
> *Core Rule:* Every logged entry breaks down the scenario trigger, flawed assumption, underlying Azure mechanic, distractor killers, and exam heuristic.

---

### [Domain 2: Storage] Secondary Region Read Access Without Failover (Q12)
* **1. Diagnostic Verdict:** ❌ Incorrect
* **2. The Scenario Trigger & Hidden Constraints:**
  * Requirement: Read-only access to blobs during primary region outage.
  * Constraint: *Must not initiate customer failover* (minimal administrative overhead).
* **3. Flawed Mental Model:**
  * Assumed standard GRS makes secondary copy available automatically during a read request.
* **4. The Core Azure Mechanic (2026 Standard):**
  * Standard GRS replicates 3x locally + 3x asynchronously to paired region, but the secondary endpoint (`*.secondary.core.windows.net`) is **completely inaccessible** unless **RA-GRS** (Read-Access Geo-Redundant Storage) is enabled. Initiating failover converts the secondary to LRS primary and changes DNS endpoints, which is high impact.
* **5. Distractor Killers:**
  * *Customer Failover:* Changes primary endpoint and incurs potential RPO data loss.
  * *AzCopy Sync:* Unnecessary custom scripting overhead.
* **6. Exam Heuristic:**
  * **"Secondary read access without failover = Always RA-GRS / RA-GZRS."**

---

### [Domain 3: Compute] Resizing VMs in an Availability Set (Q16)
* **1. Diagnostic Verdict:** ❌ Incorrect
* **2. The Scenario Trigger & Hidden Constraints:**
  * Requirement: Resize a VM within an Availability Set to a larger size family (e.g., D-series to E-series).
  * Error: Allocation failure (`AllocationFailed`) when attempting resize while other VMs are running.
* **3. Flawed Mental Model:**
  * Assumed stopping only the target VM frees up cluster allocation resources.
* **4. The Core Azure Mechanic (2026 Standard):**
  * An Availability Set is pinned to an underlying hardware cluster. If the new target VM size is not supported on that specific physical cluster, resizing fails unless **ALL VMs in the Availability Set are stopped (deallocated)**. Deallocating all VMs allows Azure to reallocate the entire set to a modern cluster supporting the target SKU.
* **5. Distractor Killers:**
  * *Restarting the single VM:* Retries allocation on the same incompatible hardware cluster.
  * *Moving to another Resource Group:* Does not change physical hardware cluster binding.
* **6. Exam Heuristic:**
  * **"AllocationFailed resizing an Availability Set VM = Deallocate ALL VMs in the set first."**

---

### [Domain 2: Storage] Uploading On-Premises VHD Disks to Azure (Q22)
* **1. Diagnostic Verdict:** ❌ Incorrect
* **2. The Scenario Trigger & Hidden Constraints:**
  * Requirement: Upload a generalized on-prem `.vhd` disk image to Azure Storage for VM deployment.
* **3. Flawed Mental Model:**
  * Selected `Add-AzImage` or assumed disks are uploaded as Block Blobs.
* **4. The Core Azure Mechanic (2026 Standard):**
  * Azure OS disks and data disks are stored as **Page Blobs** (512-byte aligned). The native PowerShell cmdlet designed specifically for uploading on-prem VHDs to Page Blobs is **`Add-AzVhd`**. `Add-AzImage` creates an image object from an already-uploaded disk, but does not transfer the file bytes over the wire.
* **5. Distractor Killers:**
  * *`Set-AzStorageBlobContent`:* Uploads as Block Blob by default (invalid for bootable VHDs).
  * *`Add-AzImage`:* Requires the VHD to already exist in Azure storage.
* **6. Exam Heuristic:**
  * **"Upload on-prem .vhd to Azure = Always `Add-AzVhd` (Page Blob, 512-byte boundary)."**

---

### [Domain 4: Virtual Networking] Point-to-Site VPN & VNet Peering Route Propagation (Q24/Q25)
* **1. Diagnostic Verdict:** ❌ Incorrect
* **2. The Scenario Trigger & Hidden Constraints:**
  * Requirement: Point-to-Site (P2S) VPN users connected to VNet-Hub need to reach VMs in peered VNet-Spoke.
  * State: Peering is configured with "Allow Gateway Transit", but P2S clients cannot route to Spoke IPs.
* **3. Flawed Mental Model:**
  * Assumed Azure SDN pushes route updates dynamically to connected client VPN virtual network adapters.
* **4. The Core Azure Mechanic (2026 Standard):**
  * P2S clients (Windows/macOS) receive their route table upon downloading the VPN configuration file package. When new VNet peerings or routes are added to the gateway, **existing client software does not dynamically learn the new routes**. The VPN client configuration package **must be re-downloaded and re-installed** on client devices.
* **5. Distractor Killers:**
  * *UDR on GatewaySubnet:* P2S clients are remote endpoints outside the VNet fabric.
  * *Restart VPN Gateway:* Tears down active sessions but doesn't modify client routing tables.
* **6. Exam Heuristic:**
  * **"P2S VPN clients cannot reach newly peered VNet = Re-download and re-install client VPN package."**

---

### [Domain 1: Governance] Azure Policy Enforcement & Region Restrictions
* **1. Diagnostic Verdict:** ⚠️ Lab Observation
* **2. The Scenario Trigger & Hidden Constraints:**
  * Tenant-level Azure Policy `sys.regionrestriction` enforces allowed deployment regions.
* **3. Flawed Mental Model:**
  * Assumed resources deploy to default `eastus` if not explicitly specified.
* **4. The Core Azure Mechanic (2026 Standard):**
  * `Deny` policies evaluate before resource provisioning starts (during ARM pre-flight request validation). Allowed regions in this subscription are strictly: **Spain Central**, **UAE North**, and **Central India**.
* **5. Exam Heuristic:**
  * **"Azure Policy Deny action blocks ARM deployment at template validation before any cost or provisioning occurs."**

---

### [Domain 2: Storage] Storage Firewalls & Dynamic Client IPs
* **1. Diagnostic Verdict:** ⚠️ Lab Observation
* **2. The Scenario Trigger & Hidden Constraints:**
  * Restricting storage account access to specific IPv4 addresses while working from home.
* **3. Flawed Mental Model:**
  * Assumed a single whitelisted IP remains valid permanently.
* **4. The Core Azure Mechanic (2026 Standard):**
  * Home ISPs rotate dynamic public IPs. If Azure Storage Firewall returns 403 Forbidden the next day, re-check the **"Add your client IP address"** box in the Networking blade or access via Entra ID RBAC from an authenticated portal session.
* **5. Exam Heuristic:**
  * **"Storage Account Firewall 403 on known network = Check dynamic ISP IP rotation or missing VNet Service Endpoint."**

---

### [Domain 2: Storage] Blob Container Leases (Error 412 Precondition Failed)
* **1. Diagnostic Verdict:** ⚠️ Lab Observation
* **2. The Scenario Trigger & Hidden Constraints:**
  * Modifying or deleting a container or blob with an active lease.
* **3. Flawed Mental Model:**
  * Assumed Subscription Owner can immediately overwrite or delete a leased container.
* **4. The Core Azure Mechanic (2026 Standard):**
  * An active exclusive lease locks the container against concurrent writes and deletion. Modifying policies returns `HTTP 412 (Precondition Failed)`. You must explicitly select **"Break lease"** in the Azure Portal or provide the `LeaseId` in the API call.
* **5. Exam Heuristic:**
  * **"HTTP 412 on Storage Blob / Container = Active lease lock. Must break lease."**

---

### [Domain 1: Identity & Governance] Control Plane vs Data Plane RBAC
* **1. Diagnostic Verdict:** ⚠️ Critical Distractor Trap
* **2. The Scenario Trigger & Hidden Constraints:**
  * Subscription `Owner` or `Contributor` tries to read/write blob containers or queue messages via Azure Portal and receives access denied.
* **3. Flawed Mental Model:**
  * Assumed Subscription `Owner` has full access to everything inside the subscription including data.
* **4. The Core Azure Mechanic (2026 Standard):**
  * ARM RBAC divides operations into **Control Plane** (`Microsoft.Storage/storageAccounts/*`) and **Data Plane** (`Microsoft.Storage/storageAccounts/blobServices/containers/blobs/*`). `Owner` and `Contributor` grant control plane only. Reading and writing blob data requires explicit data-plane roles: **`Storage Blob Data Owner`**, **`Storage Blob Data Contributor`**, or **`Storage Blob Data Reader`**.
* **5. Exam Heuristic:**
  * **"Subscription Owner/Contributor cannot read/write blob data without `Storage Blob Data [Role]` or Access Keys."**

---

### [Domain 3: Compute] Azure Virtual Machine Licensing & Azure Hybrid Benefit (AHB)
* **1. Diagnostic Verdict:** 💡 High-Yield Architecture Standard
* **2. The Scenario Trigger & Hidden Constraints:**
  * Requirement: Minimize ongoing compute costs when deploying Windows Server or Enterprise Linux (RHEL/SLES) VMs in Azure, or understand what software costs are bundled into Linux vs. Windows VMs.
  * Constraint: Enterprise has existing on-premises Windows Server or RHEL/SLES licenses with Software Assurance (SA) or active subscriptions. Must not incur VM downtime or redeployment when converting licensing models.
* **3. Flawed Mental Model:**
  * Assuming all Linux distributions have zero software licensing costs, or assuming a Windows VM must be destroyed and redeployed from scratch to apply Azure Hybrid Benefit (AHB).
* **4. The Core Azure Mechanic (2026 Standard):**
  * **Open-Source Linux (Ubuntu, Debian, Rocky, AlmaLinux):** $0.00 OS software fee. You pay only base compute (vCPU/RAM) and managed disk storage.
  * **Commercial Linux (RHEL, SLES):** Hourly software premium is billed for vendor support updates unless Bring-Your-Own-Subscription (BYOS) / Azure Hybrid Benefit for Linux is toggled (`--license-type RHEL_BYOS` or `SLES_BYOS`).
  * **Windows Server:** Default Pay-As-You-Go (PAYG) includes the Windows Server license (~30%–45% hourly premium over base Linux compute).
  * **Azure Hybrid Benefit (AHB):** Strips the Windows OS license fee down to $0, billing the Windows VM at the **base Linux compute rate**. Requires on-prem Windows Server licenses with active Software Assurance (SA) (minimum 16-core allocation rule per VM, licensed in 8-core increments).
  * **Dynamic Zero-Downtime Conversion:** You can switch an active, running VM between PAYG and AHB live in the portal or via CLI (`az vm update --license-type Windows_Server`) with **no redeployment and no downtime**.
* **5. Distractor Killers:**
  * *Redeploying the VM from a custom image:* Unnecessary administrative overhead; AHB is a runtime metadata property of the ARM VM resource model (`licenseType`).
  * *Assuming RHEL/SLES has no OS charge:* Enterprise Linux incurs vendor support fees unless enrolled in AHB/BYOS.
* **6. Exam Heuristic:**
  * **"Azure Hybrid Benefit (AHB) = Eliminates OS license fees (runs at base Linux compute rate). Minimum 16 cores. Zero-downtime toggle via `licenseType`."**

---

### [Domain 1: Identity & Governance] Resource Group Deployments vs. Properties Blade (TD Sampler Q6)
* **1. Diagnostic Verdict:** ❌ Incorrect (User picked "Yes"; Correct is "No")
* **2. The Scenario Trigger & Hidden Constraints:**
  * Requirement: Retrieve the exact date, time, and execution history when ARM-template deployed resources were provisioned in a Resource Group (`TD-RG`).
  * Proposed Solution: Navigate to Resource Group settings and select **`Properties`**.
* **3. Flawed Mental Model:**
  * Assumed Azure Portal `Properties` functions like file properties in an OS (showing creation date, modification history, and deployment timestamps).
* **4. The Core Azure Mechanic (2026 Standard):**
  * **`Properties` blade:** Contains static identity metadata only: Subscription Name/ID, Resource Group Name, Location, Location ID, Resource ID, and Tags. It does **NOT** contain deployment history or timestamps.
  * **`Deployments` blade:** The dedicated ARM engine history log. Displays every deployment name, status (Succeeded/Failed), duration, exact start/end timestamp, inputs, outputs, and the raw ARM/Bicep template used.
* **5. Distractor Killers:**
  * `Properties` blade: Static identification metadata only.
  * `Activity Log`: Shows management events for the last 90 days, but does not provide structured ARM template inputs, outputs, and duration metrics.
* **6. Exam Heuristic:**
  * **"ARM template history, inputs, outputs, and deployment timestamps = Always the `Deployments` blade under the Resource Group (never `Properties`)."**

---

### [Domain 3: Compute] App Service Deployment Slots & Scaling Dimensions (TD Sampler Q3)
* **1. Diagnostic Verdict:** ❌ Incorrect
* **2. The Scenario Trigger & Hidden Constraints:**
  * Requirement: Add a staging/deployment slot to a Web App running on an **F1 (Free)** App Service plan.
  * Constraint: The deployment slot option is greyed out / unavailable in the Azure portal. What must be done first?
* **3. Flawed Mental Model:**
  * Confusing **Scale Up** (changing SKU tier / CPU / RAM / features) with **Scale Out** (adding more horizontal VM instances), or assuming deployment slots can be enabled on the Free tier.
* **4. The Core Azure Mechanic (2026 Standard):**
  * Deployment slots require a minimum of the **Standard (S1)** tier (Standard, Premium, or Isolated). Free (F1), Shared (D1), and Basic (B1) do **NOT** support staging slots.
  * Moving from F1 to Standard/Premium requires changing the pricing tier, which is defined in Azure App Service as **"Scale Up (App Service plan)"**.
  * **Scale Out** only increases the instance count for load balancing/autoscaling—it never changes the feature tier.
* **5. Distractor Killers:**
  * *Scale out:* Adds more instances of the exact same tier; does not unlock enterprise features.
  * *Add a new deployment slot:* Impossible to click while restricted to F1.
  * *Create a CNAME record:* Used for custom domain mapping, completely unrelated to deployment slots.
* **6. Exam Heuristic:**
  * **"App Service Staging Slots = Requires Standard (S1) tier or higher. Changing pricing tiers = Always 'Scale Up'."**

---

### [Domain 5: Monitoring & Backup] Cost Optimization: Azure Advisor vs. Azure Monitor (TD Sampler Q5)
* **1. Diagnostic Verdict:** ❌ Incorrect
* **2. The Scenario Trigger & Hidden Constraints:**
  * Requirement: Analyze 50 virtual machines to identify **idle and underutilized resources** to reduce overall costs, and recommend downsizing development VMs to less expensive tiers.
* **3. Flawed Mental Model:**
  * Selecting **Azure Monitor** because it monitors VM CPU and memory performance graphs.
* **4. The Core Azure Mechanic (2026 Standard):**
  * **Azure Monitor:** Telemetry engine. Collects metrics, logs, application traces, and triggers alert rules. It tells you *what is currently happening*, but does **NOT** provide proactive optimization recommendations or right-sizing guidance.
  * **Azure Advisor:** Personalized cloud consultant and recommendation engine. Analyzes resource telemetry against best practices across 5 pillars: **Cost** (right-sizing/shutting down idle VMs, reserved instances), **Security**, **Reliability**, **Performance**, and **Operational Excellence**.
* **5. Distractor Killers:**
  * *Azure Monitor:* Stores metrics and logs; does not generate cost reduction recommendations.
  * *Azure Compliance Manager:* Evaluates regulatory standards and compliance postures (ISO, HIPAA, NIST).
  * *Azure Event Hubs:* Big data streaming event ingestion service.
* **6. Exam Heuristic:**
  * **"Identify underutilized/idle VMs to cut costs or right-size = Always Azure Advisor (never Azure Monitor)."**

---

### [Domain 2: Storage] AzCopy CLI Syntax & Recursive Directory Migration (TD Sampler Q7)
* **1. Diagnostic Verdict:** ❌ Incorrect
* **2. The Scenario Trigger & Hidden Constraints:**
  * Requirement: Migrate an on-premises local directory `E:\TutorialsDojoMedia` **and all its subdirectories** to an Azure Storage Blob container named `public` in `TutorialsDojoAccount`.
* **3. Flawed Mental Model:**
  * Mixing up the parameter order of source vs. destination, forgetting the directory recursion flag, or confusing AzCopy with Azure CLI `az storage blob copy`.
* **4. The Core Azure Mechanic (2026 Standard):**
  * **AzCopy v10 syntax** is strictly: `azcopy copy <SOURCE> <DESTINATION> [FLAGS]`.
  * When uploading from local storage to Azure: Source = Local Path (`E:\TutorialsDojoMedia`), Destination = Storage Blob URL (`https://<account>.blob.core.windows.net/<container>`).
  * To include nested folders and subdirectories, the **`--recursive`** flag is mandatory. Without `--recursive`, AzCopy copies only top-level files or skips folders entirely.
  * `az storage blob copy start-batch` is Azure CLI for asynchronous server-side copying *between* cloud containers, not for uploading a local folder over the network.
* **5. Distractor Killers:**
  * *Inverted arguments (`azcopy copy https://... E:\...`):* Downloads from Azure down to local disk.
  * *Without `--recursive`:* Leaves subdirectories behind.
  * *`az storage blob copy start-batch`:* Designed for cloud-to-cloud container transfers, not local drive uploads.
* **6. Exam Heuristic:**
  * **"Upload local folder + subfolders to Azure Blob = `azcopy copy <LocalPath> <BlobURL> --recursive`."**

---

### [Domain 3: Compute] App Service OS Isolation & Multi-Runtime Plan Sizing (TD Timed Q2)
* **1. Diagnostic Verdict:** ❌ Incorrect
* **2. The Scenario Trigger & Hidden Constraints:**
  * Requirement: Deploy 5 applications (ASP.NET v4.8, Node 16 LTS, PHP 8.2, Python 3.10, Java 11) in Azure App Service.
  * Constraint: Deploy with the **minimum number of App Service Plans**.
* **3. Flawed Mental Model:**
  * Assuming each runtime stack requires its own dedicated plan (5 plans), or assuming all 5 runtimes can be mixed into a single plan (1 plan).
* **4. The Core Azure Mechanic (2026 Standard):**
  * An App Service Plan is strictly bound to **ONE operating system** (Windows OR Linux).
  * **ASP.NET v4.8 (.NET Framework):** Runs **only on Windows**.
  * **PHP and Python:** In Azure App Service, runtime support is provided **only on Linux** (Windows runtime for PHP/Python is retired).
  * **Node.js and Java:** Cross-platform (can run on either Windows or Linux plans).
  * Therefore, you must provision at least **1 Windows Plan** (for ASP.NET) and **1 Linux Plan** (for PHP and Python) = **2 Plans minimum**.
* **5. Distractor Killers:**
  * *One plan:* Cannot mix Windows and Linux web apps inside the same App Service Plan.
  * *Five plans:* Redundant; apps sharing the same OS can share the same underlying plan.
* **6. Exam Heuristic:**
  * **"App Service Plan = 1 OS per plan. ASP.NET Framework requires Windows, Python/PHP requires Linux $\rightarrow$ Minimum 2 plans."**

---

### [Domain 3: Compute] Regional vCPU Quotas: Stopped (Deallocated) VMs Trap (TD Timed Q3)
* **1. Diagnostic Verdict:** ❌ Incorrect (Partial 1/3)
* **2. The Scenario Trigger & Hidden Constraints:**
  * Subscription Quota: North Central US Regional = 15 vCPUs. Av2 family = 15. DSv3 family = 15.
  * Currently deployed:
    - VM1: A4_v2 (4 vCPUs) - Running in North Central US.
    - VM2: D8s_v3 (8 vCPUs) - **Stopped (Deallocated)** in North Central US.
    - VM3: F2s_v2 (2 vCPUs) - Running in South Central US (different region, ignored).
  * Plan to deploy sequentially: VM4 (A2m_v2, 2 vCPUs) $\rightarrow$ VM5 (D2s_v3, 2 vCPUs) $\rightarrow$ VM6 (A8_v2, 8 vCPUs).
* **3. Flawed Mental Model:**
  * Assuming `Stopped (Deallocated)` releases the VM's vCPU quota allocation.
* **4. The Core Azure Mechanic (2026 Standard):**
  * **Billing vs. Quota:** Deallocating a VM stops hourly compute charges, **BUT DOES NOT RELEASE THE vCPU QUOTA**. Azure reserves the quota so the VM can be restarted.
  * Quota consumed = VM1 (4) + VM2 (8) = **12 of 15 vCPUs used**.
  * Remaining regional quota = $15 - 12 = \mathbf{3\text{ vCPUs}}$.
  * **Sequential execution:**
    1. VM4 (needs 2 vCPUs): $3 \ge 2 \rightarrow$ **Created (YES)**. Remaining quota = $3 - 2 = \mathbf{1\text{ vCPU}}$.
    2. VM5 (needs 2 vCPUs): Only 1 vCPU available $\rightarrow$ **Blocked (NO)**.
    3. VM6 (needs 8 vCPUs): Only 1 vCPU available $\rightarrow$ **Blocked (NO)**.
* **5. Exam Heuristic:**
  * **"Stopped (Deallocated) VMs stop billing, but STILL CONSUME vCPU quota. Only deleting the VM frees quota."**

---

### [Domain 4: Virtual Networking] Azure Load Balancer Session Persistence (TD Timed Q4)
* **1. Diagnostic Verdict:** ❌ Incorrect
* **2. The Scenario Trigger & Hidden Constraints:**
  * Requirement: Public Azure Load Balancer `TD1` must consistently route a specific user's requests to the **same backend web server** every time they access it (stateful sessions / sticky sessions).
* **3. Flawed Mental Model:**
  * Assuming default hash-based load balancing guarantees sticky routing, or confusing Health Probes with distribution modes.
* **4. The Core Azure Mechanic (2026 Standard):**
  * **Default Distribution:** 5-tuple hash (`Source IP`, `Source Port`, `Destination IP`, `Destination Port`, `Protocol`) with `Session persistence: None`. Successive requests from the same client can hit different backend servers.
  * **Sticky Sessions / Session Affinity:** Configured via **Session persistence**:
    - **`Client IP` (2-tuple):** `Source IP` + `Destination IP`. All requests from that client IP go to the same backend instance.
    - **`Client IP and protocol` (3-tuple):** `Source IP` + `Destination IP` + `Protocol`.
* **5. Distractor Killers:**
  * *Hash based / None:* Distributes requests randomly across all healthy instances.
  * *Health probe:* Only monitors whether an instance is responsive; does not control traffic distribution affinity.
* **6. Exam Heuristic:**
  * **"Route user requests to the SAME backend VM on Azure Load Balancer = Session persistence: Client IP."**

---

### [Domain 1: Identity & Governance] Entra ID Custom Domain Verification DNS Records (TD Timed Q5)
* **1. Diagnostic Verdict:** ❌ Incorrect
* **2. The Scenario Trigger & Hidden Constraints:**
  * Requirement: Add custom domain `tutorialsdojo.com` to Microsoft Entra ID. Need to configure DNS record in public DNS zone to verify domain ownership.
  * Constraint: `TXT` record is **not** listed among the choices (Options: SOA, A, MX, RRSIG).
* **3. Flawed Mental Model:**
  * Memorizing only `TXT` records for domain verification and getting stumped when `TXT` is missing from the options.
* **4. The Core Azure Mechanic (2026 Standard):**
  * Microsoft Entra ID supports exactly **TWO DNS record types** for proving domain ownership:
    1. **`TXT` record:** Primary/recommended method (`MS=ms12345678`).
    2. **`MX` record:** Official fallback verification method (`ms12345678.msv1.invalid` with Priority e.g. 32767). Used when a DNS registrar or hosting provider does not support TXT records.
* **5. Distractor Killers:**
  * *A record:* Maps domain name to an IPv4 address; does not verify identity.
  * *SOA (Start of Authority):* DNS zone metadata; cannot prove administrative domain ownership to Azure.
  * *RRSIG:* DNSSEC cryptographic signature; unrelated to domain validation.
* **6. Exam Heuristic:**
  * **"Entra ID Custom Domain verification DNS record = TXT (primary) or MX (fallback). Never A, CNAME, or SOA."**




