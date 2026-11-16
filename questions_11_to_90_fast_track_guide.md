# AZ-104 Fast-Track Master Cheat Sheet: Questions 11 to 90 (Zero Redundancy)

> **Exam Series:** Shireen Khan Practice Test #1 (80 Questions Condensed: Q11–Q90)
> **Target:** Microsoft Certified: Azure Administrator Associate (AZ-104)
> **Philosophy:** Zero redundancy, zero scenario repetition. 80 questions reduced to 12 atomic mental models.

## Table of Contents

- [1. Blob Storage Architecture, Replication & AzCopy](#t1)
- [2. Container Ecosystem: ACR Authentication, CLI & ACI Allocation](#t2)
- [3. Storage Key Management, ABAC & Least Privilege Data Access](#t3)
- [4. Virtual Machine Maintenance & Configuration Management](#t4)
- [5. Microsoft Entra ID Governance: Licensing, SSPR & Custom Attributes](#t5)
- [6. RBAC Hierarchy Cascades, Scope Boundaries & Custom Role JSON](#t6)
- [7. Virtual Networking: UDR Next Hops, Peering & Service Endpoints](#t7)
- [8. Vault Architecture & Backup Cadence](#t8)
- [9. Azure Key Vault, Azure Disk Encryption (ADE) & TLS Certificates](#t9)
- [10. Governance: Azure Policy Exclusions & Resource Move Mechanics](#t10)
- [11. Monitoring DCR Event Filtering & Private DNS Zone VNet Linking](#t11)
- [12. ApexCore Specifics: Storage Policy Limits & Encryption Scopes](#t12)

---

<a id="t1"></a>
## 1. Blob Storage Architecture, Replication & AzCopy

**Solved Questions:** `Solves Q11, Q12, Q13, Q14, Q44, Q56, Q70, Q75`

The Mechanics: Azure Storage provides 3 blob types, cross-account replication, and optimized routing. You must know what operates at the container vs blob level.

### 🎯 Core Mental Models

- **The 3 Blob Types:**
  - blockBlob: Unstructured general files (images, documents, videos, CSVs). Up to 190.7 TB. Standard answer for data files.
  - pageBlob: 512-byte aligned for random read/write. Exclusively for Virtual Machine VHD disks.
  - appendBlob: Append-only. Exclusively for audit logs and diagnostics.
- **Blob Inventory Prefix Syntax: The prefix string MUST include the container name: <container-name>/<blob-prefix> (e.g. images/finance). Omitting the container fails.**
- **Object Replication: Replicates block blobs between Containers only. Accounts must be StorageV2 or BlobStorage (never FileStorage) with Blob Versioning and Blob Change Feed enabled on both source and target.**
- **Hierarchical Namespace (HNS): Enabling HNS transforms Blob Storage into Azure Data Lake Storage Gen2 (ADLS Gen2). It enables true file directories and atomic renames. Azure Files natively supports directories without HNS.**
- **AzCopy Container Creation: To create a container via CLI before uploading, use azcopy make 'https://<acct>.blob.core.windows.net/<container>'. (azcopy copy transfers files; azcopy sync synchronizes directories).**
- **Routing Preference:**
  - Microsoft Network Routing (Cold Potato): Traverses Microsoft's global fiber backbone entering at the POP closest to the user. Lowest latency.
  - Internet Routing (Hot Potato): Traverses public transit ISP networks and enters Microsoft's network at the POP closest to the storage account. Cheaper egress.

> [!TIP]
> **⚡ Exam Trigger Formula:**
> • "Inventory CSV of images" →
> blockBlob
> +
> <container>/<prefix>
> • "Replicate blobs across accounts" → Target:
> Container
> | Account:
> StorageV2 / BlobStorage
> • "Route users through closest POP" →
> Routing preference
> (Microsoft network routing)
> • "AzCopy create container" →
> azcopy make

> [!WARNING]
> ⚠️ Exam Trap: FileStorage accounts only support Azure Files (SMB/NFS). If an option suggests deploying FileStorage for Object Replication, eliminate it immediately.

---

<a id="t2"></a>
## 2. Container Ecosystem: ACR Authentication, CLI & ACI Allocation

**Solved Questions:** `Solves Q15–Q18, Q29–Q31, Q62, Q63 (Missed Q17, Q18, Q31)`

The Mechanics: How Azure Container Instances (ACI) pull from private Azure Container Registry (ACR), and how multi-container groups allocate CPU.

### 🎯 Core Mental Models

- **Pulling Images from Private ACR:**
  - ❌ Private Endpoint: Protects network traffic, but provides zero credentials. Pull still fails.
  - ❌ ACR-Tasks with AcrPull: ACR-Tasks is the internal build agent within ACR. Giving it AcrPull does not authorize external ACI containers.
  - ✅ Admin User: Enabling the registry Admin user provides static username/password credentials. (Valid solution in yes/no questions).
  - ✅ Managed Identity: The production best practice. Assign a User-Assigned Managed Identity to ACI and grant it AcrPull on the ACR.
- **ACI Multi-Container CPU Contention: In an ACI container group, total group CPU = sum of container CPU requests. If a container has a limit higher than its request, it bursts into the pooled quota, starving other containers. The Fix: Remove the container resource limit. This strictly caps maximum CPU usage at each container's resource request.**
- **CLI Workflow for ACR:**
  - Create registry in Azure: az acr create --resource-group <rg> --name <name> --sku Basic.
  - Push image from local Docker host: docker push <login-server>/<image>:<tag>.
- **OS Container Support Matrix (ApexCore):**
  - Windows Containers (WinImg1): Supported on Azure App Service and Azure Container Instances (ACI). NOT supported on Azure Container Apps (ACA)!
  - Linux Containers (LinuxImg1): Supported on App Service, ACA, and ACI.

> [!TIP]
> **⚡ Exam Trigger Formula:**
> • "ACI pull error from ACR" → Enable
> Admin user
> OR Managed Identity with
> AcrPull
> • "Prevent container from consuming more than allocated CPU" →
> Remove resource limits
> • "Run Windows container image" →
> App Service or ACI only
> (eliminate Container Apps)

---

<a id="t3"></a>
## 3. Storage Key Management, ABAC & Least Privilege Data Access

**Solved Questions:** `Solves Q19–Q22, Q73, Q74, Q76 (Missed Q21, Q73, Q76)`

The Mechanics: Splitting management control-plane permissions from data-plane access, and where Azure ABAC applies.

### 🎯 Core Mental Models

- **Account Key Viewing & Regeneration:**
  - Storage Account Key Operator Service Role: The dedicated least-privilege role to view and regenerate access keys.
  - Storage Account Contributor: Has full management permissions over the account, which includes listkeys and regeneratekey actions. (It works, even if not least-privilege).
  - Reader and Data Access: Can view metadata and list keys to read data, but CANNOT regenerate keys.
- **Viewing Data in Any Storage Account with Least Privilege: Assign Reader and Data Access at the subscription scope. It allows reading data across all storage services (Blobs, Files, Queues, Tables) without granting destructive write or manage permissions. (Storage Blob Data Reader only covers Blobs, failing the "any storage account" requirement).**
- **Delegating Role Assignment Power with Least Privilege: Assign Role Based Access Control Administrator. It permits creating/deleting role assignments without the broad resource management powers of Owner.**
- **Azure Role Assignment Conditions (ABAC): ABAC conditional expressions can ONLY be configured on Blob Containers and Queues. Azure Files and Table Storage do NOT support ABAC conditions!**

> [!TIP]
> **⚡ Exam Trigger Formula:**
> • "Least privilege to view and rotate storage keys" →
> Storage Account Key Operator Service Role
> • "View data in ANY storage account with least privilege" →
> Reader and Data Access
> • "Assign roles without full Owner rights" →
> Role Based Access Control Administrator
> • "Storage services that support conditional role assignments" →
> containers and queues only

---

<a id="t4"></a>
## 4. Virtual Machine Maintenance & Configuration Management

**Solved Questions:** `Solves Q23–Q28, Q71 (Missed Q27)`

The Mechanics: What actually moves a running VM instance to fresh physical hypervisor hardware, and prerequisite state for configuration management.

### 🎯 Core Mental Models

- **Avoiding Scheduled Host Maintenance: When an underlying physical hypervisor blade is scheduled for maintenance:**
  - ❌ Moving the VM to another Resource Group or Subscription is purely an ARM metadata update. The VM stays running on the exact same physical blade.
  - ❌ Guest OS updates blade applies software patches in place; it does not move the VM.
  - ✅ Redeploy: Clicking Redeploy in the VM blade shuts down the VM, provisions it on a fresh, healthy physical host in the datacenter, and restarts it while preserving OS and data disks. Maintenance cleared immediately!
- **Desired State Configuration (DSC) Prerequisite: To apply an Azure Automation DSC extension to a VM (such as ShireenVM), the virtual machine must be powered on and running so the VM agent can execute the extension script.**

> [!TIP]
> **⚡ Exam Trigger Formula:**
> • "Immediately relocate VM to different physical host" →
> Redeploy
> • "Move VM to another Resource Group" →
> No physical relocation
> (metadata move only)
> • "First action to enable DSC on stopped VM" →
> Power on the VM

---

<a id="t5"></a>
## 5. Microsoft Entra ID Governance: Licensing, SSPR & Custom Attributes

**Solved Questions:** `Solves Q32, Q38, Q39, Q72 (Missed Q38, Q39, Q72)`

The Mechanics: License tier boundaries, self-service scoping, and the strict identity boundaries of Custom Security Attributes.

### 🎯 Core Mental Models

- **Group-Based Licensing Tiers: Assigning licenses to groups (Security groups or M365 groups) strictly requires Microsoft Entra ID P1 or P2. On the Free tier, licenses can ONLY be assigned directly to individual users (e.g. UserA only).**
- **Self-Service Password Reset (SSPR) Scope: In the Azure Portal SSPR blade, scope options are None, Selected, and All. Under Selected, the portal UI ONLY allows choosing Groups. You cannot select individual users! (Correct: SecGroup01 and M365Group01 only).**
- **Custom Security Attributes Supported Objects: Custom Security Attributes can ONLY be assigned to Users, Service Principals, and Managed Identities. They can NEVER be assigned to Groups! (Neither Security nor M365 groups).**
- **Group Naming Policy Setup: 1. Admin center $ o$ 2. Add prefix: Attribute $ o$ 3. Select type: Office.**

> [!TIP]
> **⚡ Exam Trigger Formula:**
> • "Assign license to group on Free tier" →
> Impossible
> (assign to individual user only)
> • "Enable SSPR for Selected scope" →
> Groups only
> (cannot select users)
> • "Identities supporting Custom Security Attributes" →
> Users & Service Principals only
> (eliminate Groups!)

---

<a id="t6"></a>
## 6. RBAC Hierarchy Cascades, Scope Boundaries & Custom Role JSON

**Solved Questions:** `Solves Q33–Q35, Q64, Q67, Q68, Q78–Q80, Q89–Q90 (Missed Q64)`

The Mechanics: How Azure IAM permissions inherit downward, how resource group scope overrides resource blade confusion, and how custom roles are structured.

### 🎯 Core Mental Models

- **The Downward Inheritance Hierarchy: Management Group $ o$ Subscription $ o$ Resource Group $ o$ Resource. Permissions cascade downwards. Permissions CANNOT be blocked or overridden at a child scope.**
- **Resource Scope vs. Resource Group Scope (The Priya Trap - Q64): If a user has Storage Account Contributor assigned at the Resource Group scope, they can create and manage storage accounts anywhere in that RG—even if you are viewing role assignments on a child resource (like an NSG or NIC)! Broader inherited scope always empowers the user.**
- **Narrow Resource Scope (The Riley Trap - Q34): If a user has Storage Account Contributor assigned strictly to a single Storage Account (`storeA1`), they have zero permissions on the parent Resource Group to create new storage accounts.**
- **Custom Role JSON Structure:**
  - actions: Allowed control plane operations.
  - notActions: Subtracted control plane operations.
  - dataActions: Allowed data plane operations (e.g., reading blob bytes, reading message queues).
  - assignableScopes: Management Groups, Subscriptions, or Resource Groups where the role can be assigned.
  - Least privilege VNet management wildcard: "Microsoft.Network/virtualNetworks/*".

> [!TIP]
> **⚡ Exam Trigger Formula:**
> • "Role assigned at Resource Group scope" →
> Applies to entire RG
> (can create resources in RG)
> • "Role assigned at Resource scope" →
> Applies to that object only
> (cannot create new siblings)
> • "Custom role property for data-plane access" →
> dataActions
> • "Custom role property defining where role can be used" →
> assignableScopes

---

<a id="t7"></a>
## 7. Virtual Networking: UDR Next Hops, Peering & Service Endpoints

**Solved Questions:** `Solves Q40, Q43, Q45, Q46, Q83–Q88 (Missed Q88)`

The Mechanics: Routing packets through firewalls, NSG/ASG filtering logic, non-transitive peering, and service endpoint policy scoping.

### 🎯 Core Mental Models

- **UDR Next Hop Types: NSGs only allow or deny; they cannot reroute packets. To send traffic to an NVA/Firewall, attach a Route Table (UDR). The Virtual appliance next hop is the ONLY type that requires typing an IP address.**
- **VNet Role Separation: Creating subnets requires network write permissions (Owner and Network Contributor can both do this). Assigning roles on a VNet requires IAM permissions (Owner only; Network Contributor cannot assign roles).**
- **Application Security Groups (ASGs): ASGs let you group VMs (NICs) logically (e.g. `ASG-Web`, `ASG-DB`) and reference them as source/destination in NSG rules without knowing or updating IP addresses.**
- **VNet Peering is Non-Transitive: If VNet-A peers with VNet-B, and VNet-B peers with VNet-C: VNet-A cannot talk to VNet-C unless you configure an NVA with route tables or a VPN Gateway with Gateway Transit.**
- **Service Endpoint Policies Scope (The Q88 Trap): A Service Endpoint Policy restricts outbound traffic from a subnet to specific allowed storage accounts. The Trap: It ONLY affects subnets that have the service endpoint enabled! A sibling subnet without the service endpoint enabled can still access all storage accounts via public internet endpoints!**

> [!TIP]
> **⚡ Exam Trigger Formula:**
> • "Next hop type requiring an IP address" →
> Virtual appliance
> • "Allow VM subnet to reach Key Vault through deny-all NSG" → Add outbound rule with
> AzureKeyVault Service Tag
> • "Service endpoint policy blocks all access?" →
> False
> (subnets without endpoint route normally)

---

<a id="t8"></a>
## 8. Vault Architecture & Backup Cadence

**Solved Questions:** `Solves Q36, Q37, Q47, Q48, Q81 (Missed Q48)`

The Mechanics: Recovery Services Vault vs Backup Vault, backup frequencies for Files vs Blobs, and ITSM integration.

### 🎯 Core Mental Models

- **The Vault Division:**
  - Recovery Services Vault (RSV): Classic IaaS workloads: Virtual Machines (VM01), SQL Server in Azure VMs, SAP HANA, Azure Backup Server (MARS).
  - Azure Backup Vault: Modern cloud-native workloads: Azure Managed Disks (Disk01), Azure Blobs, Azure Files (vaulted), AKS.
- **Maximum Backup Frequency:**
  - Azure Blob Storage: Vaulted blob backup only supports Daily or Weekly scheduled backups.
  - Azure Files: Supports up to 24 snapshot backups per day (runnable Every 1 hour!).
- **System Center Service Manager Integration: To trigger automated tickets/alerts in on-premises System Center Service Manager from Azure VM metrics, deploy the IT Service Management Connector (ITSM) in Azure Monitor.**

> [!TIP]
> **⚡ Exam Trigger Formula:**
> • "Backup Azure Virtual Machine" →
> Recovery Services Vault
> • "Backup Managed Disk / Blob" →
> Azure Backup Vault
> • "Highest backup frequency for Azure Files" →
> Every 1 hour
> (24x daily)
> • "Highest backup frequency for Blobs" →
> Daily

---

<a id="t9"></a>
## 9. Azure Key Vault, Azure Disk Encryption (ADE) & TLS Certificates

**Solved Questions:** `Solves Q41, Q42, Q52, Q53, Q57, Q82 (Missed Q42, Q52, Q57)`

The Mechanics: Key Vault's cross-region reach, ADE algorithm constraints, and App Service certificate import format.

### 🎯 Core Mental Models

- **Key Vault Has No Regional Boundary for Data/Secrets: A Key Vault can be located in any region and any resource group. Any VM with an identity and RBAC permissions can access secrets from it across regions!**
- **Azure Disk Encryption (ADE) with KEK:**
  - Algorithm: KEK strictly requires an RSA key (2048, 3072, 4096). Elliptic Curve (EC) keys are completely unsupported for ADE.
  - Cmdlet: Set-AzVMDiskEncryptionExtension.
  - Unsupported Disks: Ephemeral OS disks, Write Accelerator disks, and Windows Dynamic Volumes CANNOT be encrypted with ADE.
- **App Service TLS Certificate Import: Importing certificates directly from Key Vault into Azure App Service strictly requires PKCS#12 (.pfx) format containing the private key. PEM certificates are rejected.**

> [!TIP]
> **⚡ Exam Trigger Formula:**
> • "VM in RegionA fetching secret from Key Vault in RegionB" →
> Fully supported
> (RBAC + Managed Identity)
> • "Key Vault key for ADE KEK" →
> RSA only
> (eliminate EC)
> • "Certificate format for App Service import" →
> PKCS#12 (.pfx) only
> (eliminate PEM)

---

<a id="t10"></a>
## 10. Governance: Azure Policy Exclusions & Resource Move Mechanics

**Solved Questions:** `Solves Q69, Q77`

The Mechanics: How policy exclusions work and what actually happens when moving App Service resources between Resource Groups.

### 🎯 Core Mental Models

- **Azure Policy Exclusions: If a policy assigned at the Subscription denies creating Storage Accounts, but excludes rg-finance, storage accounts can ONLY be created in `rg-finance`.**
- **Moving Web Apps Across Resource Groups: When moving a Web App from ResGrp1 to ResGrp2: 1. The App Service plan and physical deployment remain in their original region (West Europe remains West Europe). 2. Any Azure Policies assigned to the destination Resource Group (`Pol2`) now apply to the moved Web App.**

> [!TIP]
> **⚡ Exam Trigger Formula:**
> • "Policy denies resource type on Sub, excludes RG1" → Can create resource in
> RG1 only
> • "Move Web App to RG in another region" → App Service Plan
> remains in original region
> , new RG policies apply

---

<a id="t11"></a>
## 11. Monitoring DCR Event Filtering & Private DNS Zone VNet Linking

**Solved Questions:** `Solves Q58, Q59, Q60 (Missed Q58)`

The Mechanics: Filtering Windows events at the agent level vs query time, and least-privilege DNS link permissions.

### 🎯 Core Mental Models

- **DCR Ingestion Filtering vs Log Analytics Search:**
  - At the Agent / Ingestion level (Data Collection Rule): Filtering Windows Event Logs uses XPath queries (e.g. System!*[System[(EventID=4648)]]).
  - In Log Analytics Workspace: Querying data after ingestion uses KQL (Kusto Query Language).
- **Linking Private DNS Zones to Virtual Networks: Creating a virtual network link bridges two resources. Under least privilege, assign roles strictly at the resource level: 1. Private DNS Zone Contributor on the DNS zone (to create the link). 2. Network Contributor on the Virtual Network (to grant join/action).**

> [!TIP]
> **⚡ Exam Trigger Formula:**
> • "Query language inside DCR to filter Windows events" →
> XPath
> (not KQL!)
> • "Least privilege roles to link Private DNS zone to VNet" →
> Private DNS Zone Contributor (on Zone) + Network Contributor (on VNet)

---

<a id="t12"></a>
## 12. ApexCore Specifics: Storage Policy Limits & Encryption Scopes

**Solved Questions:** `Solves Q54, Q55, Q61 (Missed Q55, Q61)`

The Mechanics: Hard caps on container access policies and the exact boundary of customer-managed encryption scopes.

### 🎯 Core Mental Models

- **Storage Policy Capacity Caps:**
  - Stored Access Policies (SAS): Maximum limit is 5 per container. If 3 exist, you can add $5 - 3 =$ 2 more.
  - Immutable Blob Storage Policies: Maximum limit is 2 per container: exactly 1 Legal Hold + 1 Time-Based Retention policy. If a Legal Hold exists, you can add 1 more.
- **Encryption Scopes Scope Boundary (`EncScope1`): Encryption Scopes are a feature designed exclusively for Blob Storage. They can encrypt containers and blobs only. They CANNOT be applied to File shares, Queues, or Tables.**

> [!TIP]
> **⚡ Exam Trigger Formula:**
> • "Maximum additional immutable policies when Legal Hold exists" →
> 1
> • "Resources that can be encrypted using an Encryption Scope" →
> containers and blobs only

---
