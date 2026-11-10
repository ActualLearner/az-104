# Azure Resource Placement, Scope & Region Boundary Matrix
**Target Exam:** Microsoft AZ-104 (Azure Administrator)  
**Document Version:** 2026 Definitive Edition  
**Companion Artifact:** [Error Journal](file:///home/actual/projects/az-104/error_journal.html) | [Master Command Hub](file:///home/actual/projects/az-104/index.html)

---

## Executive Summary: The Core Azure Placement Axioms

On the AZ-104 exam, Microsoft frequently presents scenario tables containing Virtual Machines, Subnets, Disks, NICs, Resource Groups, and Vaults situated across multiple regions, resource groups, or virtual networks. Candidates fail these questions because they conflate **administrative boundaries** (Management Groups, Subscriptions, Resource Groups) with **physical/routing boundaries** (Regions, Availability Zones, Virtual Networks).

### The 4 Golden Axioms
1. **Resource Groups are purely logical metadata containers:** A Resource Group's location has **zero** technical impact on where resources inside it can be deployed.
2. **Virtual Machines are composed of regional couplings:** A VM cannot span across regions or availability zones. Its NIC, Managed Disks, and Public IP must match its region.
3. **Security and Routing are strictly localized:** An NSG cannot protect a subnet in another region. An ASG cannot protect a NIC in another VNet.
4. **Backup vs. Monitoring Divergence:** Azure Backup (Recovery Services Vault) is **region-locked** to the VM. Azure Monitor (Log Analytics Workspace) is **globally aggregatable**.

---

## 1. Master Cross-Resource Placement & Compatibility Matrix

| Source Resource | Target / Associated Resource | Allowed Across Different Regions? | Allowed Across Different VNets? | Allowed Across Different Resource Groups? | Allowed Across Different Subscriptions? | Exam Traps & Critical Constraints |
|:---|:---|:---:|:---:|:---:|:---:|:---|
| **Resource Group** | Any Child Resource | ✅ **YES** | ✅ **YES** | N/A | N/A | A Resource Group in `East US` can hold VMs, Storage, and VNets located in `West Europe`. RG location only dictates where ARM deployment metadata is kept. |
| **Virtual Machine** | Network Interface (NIC) | ❌ **NO** | N/A | ✅ **YES** | ✅ **YES** | VM and NIC **must reside in the exact same region**. However, they can reside in different Resource Groups within the same subscription. |
| **Virtual Machine** | OS & Data Managed Disks | ❌ **NO** | N/A | ✅ **YES** | ❌ **NO** | Disks and VM must be in the **same region** (and same Availability Zone if zonal). Disks cannot be attached across subscriptions. |
| **Virtual Machine** | Availability Set | ❌ **NO** | N/A | ✅ **YES** | ❌ **NO** | VM must be in the **same region** as the Availability Set. **Fatal Trap:** A VM can **only** be placed into an Availability Set at creation time. You cannot add an existing VM to an Availability Set later without recreating the VM. |
| **Virtual Machine** | VMSS (Flexible Mode) | ❌ **NO** | ⚠️ Subnet shared | ❌ **NO** | ❌ **NO** | To attach a standalone VM to a Flexible VMSS, the VM must be in the **same Region** and the **same Resource Group** as the VMSS. |
| **NIC** | Subnet / VNet | ❌ **NO** | ❌ **NO** | ✅ **YES** | ✅ **YES** | A NIC belongs to exactly one subnet in one VNet. Must match the VNet's region. |
| **NIC** | Public IP Address | ❌ **NO** | N/A | ✅ **YES** | ✅ **YES** | Public IP must be in the **same region** as the NIC. Also, SKUs must match: Standard NIC requires Standard Public IP. |
| **NSG** | Subnet | ❌ **NO** | ❌ **NO** | ✅ **YES** | ✅ **YES** | An NSG can only be associated with a Subnet in the **same region**. One NSG can protect multiple subnets *within the same VNet or across different VNets in the same region*. |
| **NSG** | NIC | ❌ **NO** | ❌ **NO** | ✅ **YES** | ✅ **YES** | An NSG can only be associated with a NIC in the **same region**. |
| **Application Security Group (ASG)** | NIC | ❌ **NO** | ❌ **NO** | ✅ **YES** | ✅ **YES** | **Fatal Trap:** All NICs associated with an ASG **must exist within the exact same Virtual Network**. You cannot group NICs across peered VNets into one ASG. |
| **Recovery Services Vault** | Azure VM Backup | ❌ **NO** | ✅ **YES** | ✅ **YES** | ❌ **NO** | **High-Frequency Trap:** The Recovery Services Vault **must be in the same Azure region** as the VMs being protected. To protect VMs in `West Central US`, you must deploy a vault in `West Central US`. |
| **Backup Vault** | Azure Managed Disks | ❌ **NO** | N/A | ✅ **YES** | ❌ **NO** | Azure Disk Backup uses a Backup Vault (not Recovery Services Vault) in the same region. |
| **Log Analytics Workspace** | Azure Monitor Agent (AMA) / VMs | ✅ **YES** | ✅ **YES** | ✅ **YES** | ✅ **YES** | A single central Log Analytics workspace in `East US` can collect logs, performance counters, and IIS events from VMs globally across all regions and subscriptions. |
| **Standard Load Balancer** | Backend Pool VMs / NICs | ❌ **NO** (unless Cross-Region LB) | ✅ **YES** (same region) | ✅ **YES** | ✅ **YES** | Standard Load Balancer backend pool can span multiple VNets in the **same region**. It cannot span across regions unless deploying the specialized global Cross-Region Load Balancer SKU. |
| **Azure Bastion** | Target VM (RDP/SSH) | ⚠️ Peered only | ⚠️ Standard SKU | ✅ **YES** | ✅ **YES** | Bastion Basic SKU can only connect to VMs in the **same VNet**. Bastion Standard SKU can connect to VMs in **peered VNets** (even cross-region global peering). |
| **Storage Account** | VNet Service Endpoint | ✅ **YES** | N/A | ✅ **YES** | ✅ **YES** | Storage account firewalls can allow traffic from VNet service endpoints located in any Azure region over the Microsoft backbone. |
| **Private Endpoint** | Target PaaS Resource (Storage/SQL) | ✅ **YES** | N/A | ✅ **YES** | ✅ **YES** | The Private Endpoint (NIC) sits in your local subnet, but can connect to a Storage Account or Azure SQL Database in a **different region or different tenant/subscription**. |

---

## 2. Deep Dive: Resource Moves (Cross-RG and Cross-Subscription)

When Microsoft asks: *"You need to move VM1 from Subscription 1 to Subscription 2. Which resources must be moved?"*

### The "All-or-Nothing" VM Dependency Rule
An Azure VM cannot exist in a vacuum. If you move a VM across resource groups or subscriptions, **all attached dependencies must move together**:
1. The **Virtual Machine** itself.
2. The **OS Disk** and all attached **Data Disks** (Managed Disks).
3. The **Network Interface Cards (NICs)** attached to the VM.
4. Any **Public IP Address** resource directly associated with the VM's NIC.
5. Any **Network Security Group (NSG)** directly associated with the VM's NIC.
6. The **Virtual Network** containing the VM's subnet (when moving across subscriptions, because a NIC cannot reference a subnet in a different subscription).

### Resource Locks vs. Move Operations (Official Microsoft Standard vs. Q57 Bug)
* **CanNotDelete Lock (`CanNotDelete`):** Prevents accidental deletion of the resource. A `CanNotDelete` lock **DOES NOT block moving resources** (because moving a resource is not a deletion operation).
* **ReadOnly Lock (`ReadOnly`):** Prevents modification of resource settings and prevents deletion.
* **Official Microsoft Rule:** **A `ReadOnly` lock STRICTLY BLOCKS moving resources!** According to official Microsoft documentation: *"Azure resources cannot be moved if a Read-only management lock exists on the source resource group, destination resource group, subscription, or the resources themselves. You must remove the read-only lock before initiating the move."*
* **Note on Practice Test 01 Q57:** Alan Rodrigues incorrectly marked "Yes" claiming ReadOnly locks allow moves. Official Microsoft documentation confirms the candidate's answer (**"No"**) is the true platform behavior.

### Does Moving a Resource Change its Region? (Q58 Trap)
* **NEVER.** Moving a resource to a new Resource Group in another region does **NOT** migrate or move the underlying physical hardware.
* An App Service Plan in `Central US` moved to an `East US` Resource Group **remains in `Central US`**.

### Virtual Machine Scale Sets (VMSS): Flexible Mode Attachment Rules (Q32 Trap)
* **Uniform Orchestration Mode:** Traditional scale set where all VMs are identical clones deployed by the scale set itself from one model. You **cannot** attach an existing standalone VM to a Uniform scale set.
* **Flexible Orchestration Mode:** Modern scale set that supports mixing VM sizes, availability models, and attaching existing standalone VMs.
* **The Strict Attachment Prerequisites (The Exam Rule):**
  To attach an existing standalone Virtual Machine to a Flexible VMSS:
  1. **SAME Region:** The VM must reside in the exact same Azure Region as the VMSS.
  2. **SAME Resource Group:** The VM **must reside in the exact same Resource Group** as the VMSS. (Even within the same subscription, if the VM is in `rg-app` and the VMSS is in `rg-scale`, the VM cannot be attached).
  3. **SAME Virtual Network / Subnet:** The VM's network interface must connect to the same VNet and subnet configured for the scale set.

---

## 3. Deep Dive: Dedicated Subnet Name Constraints

Several Azure PaaS and networking services require strict, hardcoded subnet names. Using any alternative name causes immediate deployment failure:

| Service | Mandatory Subnet Name (Case-Sensitive) | Minimum Subnet Prefix Size | NSG Allowed? | User Defined Routes (UDR) Allowed? |
|:---|:---|:---:|:---:|:---:|
| **Azure Bastion** | `AzureBastionSubnet` | **/26** (64 IPs) | ✅ Yes (strict inbound 443 & outbound 3389/22 rules) | ❌ Restricted |
| **Azure VPN / ExpressRoute Gateway** | `GatewaySubnet` | **/27** (recommended /27, min /29) | ❌ Never attach an NSG to GatewaySubnet | ⚠️ Specific rules only |
| **Azure Firewall** | `AzureFirewallSubnet` | **/26** (64 IPs) | ❌ No NSG allowed | ⚠️ Default route 0.0.0.0/0 to Internet |
| **Azure Firewall Management** | `AzureFirewallManagementSubnet` | **/26** (for forced tunneling) | ❌ No NSG allowed | Must route direct to Internet |
| **App Service VNet Integration** | Any name (Delegated to `Microsoft.Web/serverFarms`) | **/28** (min 16 IPs, /26 recommended) | ✅ Yes | ✅ Yes |
| **Container Instances (ACI)** | Any name (Delegated to `Microsoft.ContainerInstance/containerGroups`) | **/28** | ✅ Yes | ✅ Yes |

---

## 4. Deep Dive: Inbound Network Security Group Evaluation Order

When internet traffic reaches an Azure VM, it must pass through **TWO independent layers of evaluation**:

```
[ Inbound Traffic from Internet ]
               │
               ▼
   ┌───────────────────────┐
   │   1. Subnet-Level NSG │ ──► Does Subnet NSG ALLOW the traffic?
   └───────────┬───────────┘
               │
               ├─► [DENY] ──► PACKET DROPPED IMMEDIATELY.
               │              (Never evaluates NIC NSG)
               ▼
            [ALLOW]
               │
               ▼
   ┌───────────────────────┐
   │    2. NIC-Level NSG   │ ──► Does NIC NSG ALLOW the traffic?
   └───────────┬───────────┘
               │
               ├─► [DENY] ──► PACKET DROPPED.
               ▼
            [ALLOW]
               │
               ▼
   ┌───────────────────────┐
   │  Virtual Machine OS   │ ──► Windows Firewall / Linux iptables
   └───────────────────────┘
```

### The Inbound RDP Golden Rule (Q21)
To allow RDP (TCP port 3389) or SSH (TCP port 22) from the internet:
- **Rule 1:** Subnet NSG must have an Inbound Allow rule for TCP 3389.
- **Rule 2:** NIC NSG must have an Inbound Allow rule for TCP 3389.
- If *either* level lacks an allow rule (or hits the default `DenyAllInBound` rule with priority 65500), **traffic is dropped**.

---

## 5. High-Yield Exam Traps & Heuristics Summary

1. **"Can VM1 in East US be backed up to RSV1 in West US?"**  
   $\rightarrow$ **NO.** Recovery Services Vaults are region-locked. Deploy a second vault in East US.
2. **"Can an NSG created in West Europe be linked to a subnet in North Europe?"**  
   $\rightarrow$ **NO.** NSGs are strictly regional. Create an NSG in North Europe.
3. **"Can an Application Security Group (ASG) contain VMs from two peered VNets?"**  
   $\rightarrow$ **NO.** ASGs cannot cross VNet boundaries. All NICs must reside in the same VNet.
4. **"Can we add an existing production VM to a newly created Availability Set?"**  
   $\rightarrow$ **NO.** Availability Sets are an immutable property set only at VM creation time.
5. **"Can we move a VM with a ReadOnly lock to another Resource Group?"**  
   $\rightarrow$ **YES.** Management locks do not prevent cross-RG moves.
6. **"If we move an App Service from a West US RG to an East US RG, does its region change?"**  
   $\rightarrow$ **NO.** Resource location is permanent and independent of Resource Group location.
7. **"Can VMs in 5 different regions stream syslog to 1 Log Analytics workspace?"**  
   $\rightarrow$ **YES.** Azure Monitor Log Analytics workspaces support global multi-region ingestion.
