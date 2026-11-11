window.AZ104_EXAM_2 = [
  {
    "id": "e2-q01",
    "examNumber": 2,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "Subnet IP Math, Subnet Sizing & CIDR Allocation",
    "scenario": "You are allocating subnets within a new Virtual Network (`vnet-hub-weu`) with address space `10.50.0.0/23` (512 addresses: 10.50.0.0 to 10.50.1.255).\n\nYou need to allocate three subnets with the following requirements:\n1. `GatewaySubnet`: Must follow Microsoft's recommended sizing for future co-existence of ExpressRoute and VPN gateways.\n2. `AzureFirewallSubnet`: Must satisfy Azure Firewall's minimum prefix requirement.\n3. `snet-workload`: A general workload subnet with CIDR prefix `/24`.\n\nWhich address space allocation and usable IP counts are correct for `AzureFirewallSubnet` and `snet-workload`?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "AzureFirewallSubnet: /26 (59 usable host IPs); snet-workload: /24 (251 usable host IPs)"
      },
      {
        "id": "B",
        "text": "AzureFirewallSubnet: /28 (11 usable host IPs); snet-workload: /24 (254 usable host IPs)"
      },
      {
        "id": "C",
        "text": "AzureFirewallSubnet: /26 (64 usable host IPs); snet-workload: /24 (256 usable host IPs)"
      },
      {
        "id": "D",
        "text": "AzureFirewallSubnet: /27 (27 usable host IPs); snet-workload: /24 (250 usable host IPs)"
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A is correct.",
      "triggerConstraints": "Requirement: Sizing for AzureFirewallSubnet and /24 workload subnet. Constraint: Usable host IP count after subtracting Azure's 5 reserved addresses.",
      "flawedMentalModel": "Calculating usable addresses using the on-premises /24 formula (256 - 2 = 254) or assuming Azure Firewall supports /28.",
      "coreMechanic": "1. Azure Subnet IP Math: Azure ALWAYS reserves 5 IP addresses per subnet (.0 network, .1 gateway, .2 DNS, .3 DNS fallback, .255 broadcast). For a /24 subnet: 256 - 5 = 251 usable host IPs. For a /26 subnet: 64 - 5 = 59 usable host IPs.\n2. AzureFirewallSubnet Requirements: MUST be named AzureFirewallSubnet and MUST be at least /26 (64 addresses) to support internal scaling.",
      "distractors": {
        "B": "AzureFirewallSubnet requires minimum /26; /28 is unsupported and causes deployment failure.",
        "C": "64 and 256 are raw CIDR sizes that fail to subtract Azure's 5 reserved IP addresses.",
        "D": "AzureFirewallSubnet requires at least /26; /27 is insufficient."
      },
      "heuristic": "AzureFirewallSubnet = minimum /26 (59 usable). /24 Subnet = 256 - 5 = 251 usable host addresses.",
      "msLearnUrl": "https://learn.microsoft.com/azure/firewall/firewall-faq#what-are-the-subnet-requirements-for-azure-firewall",
      "errorJournalRef": "AR PT02 Q21"
    }
  },
  {
    "id": "e2-q02",
    "examNumber": 2,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "Server-Side Encryption with Customer-Managed Keys (SSE-CMK) vs. ADE",
    "scenario": "You need to encrypt the OS and data disks of multiple Azure Virtual Machines using Server-Side Encryption with Customer-Managed Keys (SSE-CMK).\n\nYou create an Azure Key Vault in the same region and generate an RSA key named `key-disk-cmk`.\n\nWhich Azure resource MUST be created to bridge the storage managed disk layer with the Key Vault key, and what permission must be granted to its identity?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Enable the 'Azure Disk Encryption for volume encryption' flag on the Key Vault access policies and configure BitLocker on the guest OS."
      },
      {
        "id": "B",
        "text": "Create a Disk Encryption Set (DES) with a system-assigned managed identity, and grant the DES identity the 'Key Vault Crypto Service Encryption User' role on the Key Vault."
      },
      {
        "id": "C",
        "text": "Create an Azure Automation account with Run As credentials and grant Contributor on the Key Vault."
      },
      {
        "id": "D",
        "text": "Assign the 'Storage Blob Data Contributor' role to each VM's system-assigned managed identity."
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B is correct.",
      "triggerConstraints": "Requirement: Configure Server-Side Encryption with Customer-Managed Keys (SSE-CMK) for managed disks. Constraint: Contrast SSE-CMK architecture with Azure Disk Encryption (ADE).",
      "flawedMentalModel": "Confusing SSE-CMK with ADE (Option A). ADE is guest-level volume encryption using BitLocker/DM-Crypt. SSE-CMK is storage-level encryption using Disk Encryption Sets.",
      "coreMechanic": "Server-Side Encryption with Customer-Managed Keys (SSE-CMK):\n1. Disk Encryption Set (DES): A standalone ARM resource (`Microsoft.Compute/diskEncryptionSets`) that represents the customer key reference for managed disks.\n2. Managed Identity: The DES generates a system-assigned managed identity.\n3. RBAC Role: The DES identity must be granted the `Key Vault Crypto Service Encryption User` role (or Get/WrapKey/UnwrapKey permissions) on the Key Vault containing the KEK.\n4. When disks are created or updated, their encryption settings reference the DES resource ID.",
      "distractors": {
        "A": "This describes Azure Disk Encryption (ADE), not SSE-CMK.",
        "C": "Azure Automation accounts are for scripting, not storage encryption envelope key retrieval.",
        "D": "Storage Blob Data Contributor is for Blob Storage, not Managed Disk SSE."
      },
      "heuristic": "SSE-CMK = Disk Encryption Set (DES) + Managed Identity + 'Key Vault Crypto Service Encryption User'. ADE = BitLocker + Vault Access Policy.",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machines/disk-encryption",
      "errorJournalRef": "AR PT02 Q4"
    }
  },
  {
    "id": "e2-q03",
    "examNumber": 2,
    "domain": "Domain 5: Monitor and maintain Azure resources",
    "domainCode": 5,
    "topic": "Recovery Services Vault: Soft Delete & Data Retention Mechanics",
    "scenario": "A security incident occurs, and a compromised administrator account executes an unauthorized operation to delete the backup data of a production virtual machine (`vm-finance-db`) in a Recovery Services Vault where **Soft Delete** is enabled.\n\nWhat happens to the backup data, and for how long is it retained before permanent, irreversible deletion?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "The backup data is purged immediately because the delete request was submitted by an administrator."
      },
      {
        "id": "B",
        "text": "The backup data is retained for 30 days in the Azure Storage recycle bin and incurs double storage billing."
      },
      {
        "id": "C",
        "text": "The backup data is retained in a 'Soft Deleted' state for 14 days, during which it can be undeleted and restored by an authorized administrator."
      },
      {
        "id": "D",
        "text": "The backup data is converted to an unmanaged VHD and downloaded to the local administrator workstation."
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C is correct.",
      "triggerConstraints": "Requirement: Understand Soft Delete behavior for Azure Backup in a Recovery Services Vault.",
      "flawedMentalModel": "Assuming administrator actions bypass soft delete, or confusing the 14-day backup retention period with the 30-day Entra ID recycle bin.",
      "coreMechanic": "Soft Delete in Recovery Services Vaults:\n1. When a backup item's data is deleted, the vault transitions the backup data into a 'Soft Deleted' state.\n2. Retention Duration: Retained for exactly 14 additional days at no additional backup cost.\n3. Protection: Prevents ransomware or accidental administrator deletions. An administrator can click 'Undelete' during the 14-day window to resume protection and restore recovery points.",
      "distractors": {
        "A": "Soft delete specifically protects against compromised administrator accounts.",
        "B": "14 days is the standard soft delete window for Azure Backup, not 30 days.",
        "D": "Data remains inside the vault in a soft-deleted state; it is not converted to unmanaged VHDs."
      },
      "heuristic": "Azure Backup Soft Delete = Retains deleted backup data for 14 days in 'Soft Deleted' state before permanent purge.",
      "msLearnUrl": "https://learn.microsoft.com/azure/backup/backup-azure-security-feature-cloud",
      "errorJournalRef": "AR PT01 Q52"
    }
  },
  {
    "id": "e2-q04",
    "examNumber": 2,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "Azure Files Identity-Based Authentication (AD DS Kerberos)",
    "scenario": "Your enterprise wants to enable identity-based authentication for an Azure Files SMB share named `corp-files` so that on-premises domain-joined Windows clients can access shares using Active Directory credentials without using storage account access keys.\n\nYou join the storage account to your on-premises Active Directory Domain Services (AD DS) domain.\n\nTo allow domain users in security group `FinanceUsers` to connect and read/write files, which TWO levels of permissions must be configured? (Select TWO)",
    "questionType": "multiple",
    "options": [
      {
        "id": "A",
        "text": "Share-level Azure RBAC role (e.g. Storage File Data SMB Share Contributor) assigned to the security group on the storage account or file share."
      },
      {
        "id": "B",
        "text": "Assign the Owner role on the Resource Group to FinanceUsers."
      },
      {
        "id": "C",
        "text": "Directory- and file-level Windows Access Control Lists (NTFS permissions) configured on the files and folders within the mounted share."
      },
      {
        "id": "D",
        "text": "Create a Stored Access Policy on the file share with Read and Write permissions."
      },
      {
        "id": "E",
        "text": "Enable Anonymous Public Access on the storage account networking blade."
      }
    ],
    "correctAnswer": [
      "A",
      "C"
    ],
    "explanation": {
      "verdict": "Options A and C are correct.",
      "triggerConstraints": "Requirement: Configure identity-based authentication for Azure Files SMB shares using on-premises AD DS.",
      "flawedMentalModel": "Assuming Azure RBAC alone is sufficient, or assuming NTFS permissions alone are sufficient.",
      "coreMechanic": "Azure Files identity-based authentication requires two complementary authorization tiers:\n1. Share-Level Azure RBAC Permissions: Controls whether a user or group can mount the file share over SMB. Built-in roles: Storage File Data SMB Share Reader, Storage File Data SMB Share Contributor, or Storage File Data SMB Share Elevated Contributor.\n2. Directory- and File-Level NTFS Permissions: Standard Windows DACLs (NTFS permissions) configured on the mounted share via Windows File Explorer or icacls. Enforces granular read/write/modify access on specific folders and files.",
      "distractors": {
        "B": "Owner on Resource Group grants control-plane access and violates least privilege.",
        "D": "Stored access policies are for SAS tokens, not AD DS Kerberos authentication.",
        "E": "Azure Files does not support anonymous public access."
      },
      "heuristic": "Azure Files AD DS SMB Auth: 1) Share-level Azure RBAC (Mounting) + 2) Directory/file-level NTFS DACLs (File access).",
      "msLearnUrl": "https://learn.microsoft.com/azure/storage/files/storage-files-identity-auth-active-directory-enable",
      "errorJournalRef": "azure_placement_and_boundary_matrix.md"
    }
  },
  {
    "id": "e2-q05",
    "examNumber": 2,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Management Locks: Inheritance Scope & Cross-RG Move Mechanics",
    "scenario": "You have an Azure subscription containing resource group `rg-app-prod`. `rg-app-prod` contains an Azure Virtual Network (`vnet-prod`).\n\nThe following management locks exist:\n- At the Subscription scope: A **CanNotDelete** lock named `lock-sub-nodelete`.\n- At the Resource Group scope (`rg-app-prod`): A **ReadOnly** lock named `lock-rg-readonly`.\n\nYou are tasked with moving `vnet-prod` from `rg-app-prod` to a different resource group named `rg-app-dev`.\n\nWhich lock(s) MUST be removed before ARM will permit the resource move operation?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Both the CanNotDelete lock on the subscription and the ReadOnly lock on the resource group must be removed."
      },
      {
        "id": "B",
        "text": "Only the CanNotDelete lock on the subscription must be removed."
      },
      {
        "id": "C",
        "text": "Neither lock needs to be removed because moving a resource is an administrative operation."
      },
      {
        "id": "D",
        "text": "Only the ReadOnly lock (lock-rg-readonly) on the resource group must be removed."
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D is correct.",
      "triggerConstraints": "Requirement: Determine which locks block moving a resource. Setup: Subscription has CanNotDelete; Resource Group has ReadOnly.",
      "flawedMentalModel": "Assuming CanNotDelete blocks moves, or assuming all parent locks must be deleted.",
      "coreMechanic": "1. CanNotDelete Lock: Prevents resource deletion. Moving a resource changes its parent resource group container, but does NOT delete the resource. Therefore, CanNotDelete locks do NOT block resource moves.\n2. ReadOnly Lock: Prevents modifying container metadata. According to official Microsoft specifications, a ReadOnly lock on the source RG, destination RG, subscription, or resource strictly blocks resource moves. Therefore, only `lock-rg-readonly` must be removed.",
      "distractors": {
        "A": "The subscription-level CanNotDelete lock does not prevent resource moves; only the ReadOnly lock blocks it.",
        "B": "CanNotDelete does not block moves.",
        "C": "ReadOnly strictly blocks moves with error ScopeLocked until deleted."
      },
      "heuristic": "CanNotDelete = Allows moves. ReadOnly = STRICTLY BLOCKS moves. Remove ONLY the ReadOnly lock!",
      "msLearnUrl": "https://learn.microsoft.com/azure/azure-resource-manager/management/lock-resources",
      "errorJournalRef": "AR PT01 Q57, AR PT02 Q57"
    }
  },
  {
    "id": "e2-q06",
    "examNumber": 2,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "Azure Container Apps: Multiple Revisions & Traffic Splitting (Canary)",
    "scenario": "You deploy a microservice to **Azure Container Apps (ACA)**. You want to implement a zero-downtime canary deployment strategy where:\n1. The current stable production revision (`rev-v1`) receives 80% of incoming HTTP traffic.\n2. A newly deployed revision (`rev-v2`) receives 20% of incoming HTTP traffic for telemetry validation.\n\nWhich configuration setting must be enabled on the Container App to allow multiple concurrent active revisions and traffic weight allocation?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Set Active Revisions Mode to 'Multiple' and configure traffic weights under the Ingress blade."
      },
      {
        "id": "B",
        "text": "Set Active Revisions Mode to 'Single' and deploy an external Azure Load Balancer."
      },
      {
        "id": "C",
        "text": "Configure an Azure Application Gateway with URL path routing rules."
      },
      {
        "id": "D",
        "text": "Attach an Azure Front Door profile with session affinity enabled."
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A is correct.",
      "triggerConstraints": "Requirement: Split traffic 80/20 between two container revisions in Azure Container Apps.",
      "flawedMentalModel": "Assuming external load balancers (Application Gateway or Azure Front Door) are required for revision traffic splitting.",
      "coreMechanic": "Azure Container Apps natively includes an Envoy-based reverse proxy that manages revisions and traffic distribution:\n1. Revision Modes:\n- Single revision mode: Only one revision is active at a time; new deployments automatically deactivate the previous revision.\n- Multiple revision mode: Allows multiple revisions to be active simultaneously. When enabled, you can define traffic splitting percentages (e.g. 80% to rev-v1, 20% to rev-v2) directly inside ACA without any external load balancer.",
      "distractors": {
        "B": "Single mode deactivates older revisions and cannot split traffic.",
        "C": "Application Gateway is external and unnecessary; ACA has native Envoy ingress traffic splitting.",
        "D": "Azure Front Door is unnecessary for revision splitting."
      },
      "heuristic": "Azure Container Apps Traffic Splitting / Canary = Active Revisions Mode: 'Multiple' + Ingress traffic weights.",
      "msLearnUrl": "https://learn.microsoft.com/azure/container-apps/revisions",
      "errorJournalRef": "AR PT02 Q15"
    }
  },
  {
    "id": "e2-q07",
    "examNumber": 2,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "Azure Container Instances: Mounting Azure Files SMB Shares",
    "scenario": "You are deploying an Azure Container Instance (ACI) running a stateful application container. The container requires persistent storage so that files written by the application survive container restarts and crashes.\n\nWhich Azure storage service can be mounted directly as a persistent volume into an Azure Container Instances container group?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Azure Managed OS Disk"
      },
      {
        "id": "B",
        "text": "Azure Files share (SMB)"
      },
      {
        "id": "C",
        "text": "Azure Blob Storage container (Block Blobs)"
      },
      {
        "id": "D",
        "text": "Azure Queue Storage"
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B (Azure Files share) is correct.",
      "triggerConstraints": "Requirement: Mount a persistent volume into Azure Container Instances (ACI).",
      "flawedMentalModel": "Assuming Azure Managed Disks or Blob containers can be mounted directly as standard POSIX file system volumes in ACI without external drivers.",
      "coreMechanic": "Azure Container Instances natively supports mounting persistent storage volumes using Azure Files (SMB shares). You define an `azureFile` volume in the container group specification containing the share name, storage account name, and storage account key. Azure Managed Disks cannot be attached to ACI container groups (they are reserved for VMs/VMSS).",
      "distractors": {
        "A": "Azure Managed Disks cannot be attached directly to ACI container groups.",
        "C": "Blob Storage does not provide native SMB volume mounting for ACI container definitions.",
        "D": "Queue storage is a messaging service, not a file system volume."
      },
      "heuristic": "Persistent volume mount in ACI = Azure Files share (SMB).",
      "msLearnUrl": "https://learn.microsoft.com/azure/container-instances/container-instances-volume-azure-files",
      "errorJournalRef": "AR PT02 Q16"
    }
  },
  {
    "id": "e2-q08",
    "examNumber": 2,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "Azure Private DNS Zones: Virtual Network Links & Auto-Registration Limits",
    "scenario": "You manage an Azure Private DNS Zone named `corp.internal`.\n\nYou have 5 virtual networks (`vnet-prod`, `vnet-dev`, `vnet-test`, `vnet-qa`, and `vnet-stage`).\n\nYou want VMs in all 5 virtual networks to be able to resolve DNS records in `corp.internal`.\n\nAdditionally, you want Azure to automatically register DNS host records (A records) for virtual machines as they are created in `vnet-prod`.\n\nWhat is the maximum number of Virtual Networks that can have **auto-registration** enabled for a single Azure Private DNS Zone?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "5 Virtual Networks"
      },
      {
        "id": "B",
        "text": "100 Virtual Networks"
      },
      {
        "id": "C",
        "text": "1 Virtual Network"
      },
      {
        "id": "D",
        "text": "1,000 Virtual Networks"
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C (1 Virtual Network) is correct.",
      "triggerConstraints": "Requirement: Understand Virtual Network Link limits for auto-registration vs resolution in Azure Private DNS Zones.",
      "flawedMentalModel": "Confusing resolution virtual network links (which support up to 1,000 VNets) with auto-registration links (which support only 1 VNet per zone).",
      "coreMechanic": "Azure Private DNS Zone Limits:\n1. Resolution Virtual Network Links: Up to 1,000 VNets can be linked to a single Private DNS Zone for name resolution.\n2. Auto-Registration Virtual Network Link: Exactly ONE Virtual Network can be designated as the auto-registration VNet for a specific Private DNS Zone. If you attempt to enable auto-registration on a second VNet for the same zone, ARM returns an error stating that the private zone already has a registration virtual network.",
      "distractors": {
        "A": "Only 1 VNet can be the auto-registration VNet per zone.",
        "B": "100 is the limit for how many private DNS zones a single VNet can register to.",
        "D": "1,000 is the limit for resolution links without auto-registration."
      },
      "heuristic": "Private DNS Zone Limits = Up to 1,000 Resolution VNets, but ONLY 1 Auto-Registration VNet per zone!",
      "msLearnUrl": "https://learn.microsoft.com/azure/dns/private-dns-virtual-network-links",
      "errorJournalRef": "AR PT01 Q23"
    }
  },
  {
    "id": "e2-q09",
    "examNumber": 2,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "NSG Rule Prioritization & Evaluation Rules",
    "scenario": "A Network Security Group named `nsg-app` is associated with a subnet containing web servers. The following inbound security rules are defined:\n\n| Priority | Name | Source | Source Port | Destination | Destination Port | Protocol | Action |\n| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n| 150 | DenyInternetWeb | Internet | * | Any | 80, 443 | TCP | Deny |\n| 200 | AllowOfficeWeb | 203.0.113.50/32 | * | Any | 80, 443 | TCP | Allow |\n| 300 | AllowAllWeb | Any | * | Any | 80, 443 | TCP | Allow |\n| 65000 | AllowVnetInBound | VirtualNetwork | * | VirtualNetwork | * | Any | Allow |\n| 65500 | DenyAllInBound | Any | * | Any | * | Any | Deny |\n\nA user connects from the corporate office public IP address `203.0.113.50` over TCP port 443 (HTTPS).\n\nWhat action does Azure SDN take?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Traffic is ALLOWED by Rule 200 (AllowOfficeWeb) because it is a more specific source IP than Internet."
      },
      {
        "id": "B",
        "text": "Traffic is ALLOWED by Rule 300 (AllowAllWeb) because Allow rules always take precedence over Deny rules."
      },
      {
        "id": "C",
        "text": "Traffic is DENIED by default rule 65500."
      },
      {
        "id": "D",
        "text": "Traffic is DENIED by Rule 150 (DenyInternetWeb) because 150 has a lower priority number and evaluates first."
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D is correct.",
      "triggerConstraints": "Requirement: Determine NSG rule evaluation outcome when lower priority rule matches traffic broadly.",
      "flawedMentalModel": "Assuming Azure NSGs use 'longest prefix match' like route tables, or assuming Allow rules override Deny rules.",
      "coreMechanic": "Network Security Group Rule Evaluation Order:\n1. Rules are evaluated in strict numerical order based on Priority (from lowest number 100 to highest number 4096).\n2. When a packet matches a rule's criteria (5-tuple), processing STOPS immediately—no further rules are evaluated.\n3. Packet trace: Traffic from public IP 203.0.113.50 matches the source tag 'Internet' on Rule 150 (Priority 150). Because 150 < 200, Rule 150 evaluates first, matches, and DENIES the connection. Rule 200 is never reached.",
      "distractors": {
        "A": "NSGs do NOT use most-specific-prefix matching; they evaluate strictly by priority order.",
        "B": "Allow rules do not have inherent precedence over Deny rules.",
        "C": "Processing stops at Rule 150; default rules are not reached."
      },
      "heuristic": "NSG Rules: Lowest priority number evaluates FIRST. Once matched, processing STOPS immediately (no longest prefix match!).",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-network/network-security-groups-overview#security-rules",
      "errorJournalRef": "AR PT01 Q21"
    }
  },
  {
    "id": "e2-q10",
    "examNumber": 2,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "Blob Storage Archive Tier Rehydration Priority",
    "scenario": "You have an archived block blob named `financial_audit_2025.tar.gz` stored in the **Archive** access tier of an Azure General Purpose v2 storage account.\n\nAn external compliance auditor requires immediate access to this blob. You initiate a rehydration request to move the blob to the **Hot** tier.\n\nYou need to retrieve the blob as quickly as possible. Which rehydration priority should you select, and what is its expected rehydration window?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "High priority (rehydrates typically in under 1 hour for blobs up to 10 GB)"
      },
      {
        "id": "B",
        "text": "Standard priority (rehydrates in under 5 minutes)"
      },
      {
        "id": "C",
        "text": "Instant rehydration (rehydrates in real-time with zero latency)"
      },
      {
        "id": "D",
        "text": "Batch priority (rehydrates in 24 to 48 hours)"
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A is correct.",
      "triggerConstraints": "Requirement: Fastest rehydration of archived blob to Hot tier.",
      "flawedMentalModel": "Assuming Standard priority takes minutes, or assuming instant rehydration is supported from Archive.",
      "coreMechanic": "Azure Blob Archive Rehydration Priorities:\n1. Standard priority: Default rehydration mode. Requests are processed in the order received and can take up to 15 hours.\n2. High priority: Expedited rehydration for urgent recovery. For blobs up to 10 GB, high priority rehydration typically finishes in under 1 hour (incurs higher rehydration cost).\nWhile rehydrating, the blob remains in Archive tier with an archive status of `rehydrate-pending-to-hot`.",
      "distractors": {
        "B": "Standard priority takes up to 15 hours, not 5 minutes.",
        "C": "Archive tier is offline tape/cold media; instant real-time rehydration is physically impossible.",
        "D": "Batch priority is not an Azure rehydration tier."
      },
      "heuristic": "Archive Rehydration: High Priority = under 1 hour (<10GB). Standard Priority = up to 15 hours.",
      "msLearnUrl": "https://learn.microsoft.com/azure/storage/blobs/archive-rehydrate-overview",
      "errorJournalRef": "error_journal.md"
    }
  },
  {
    "id": "e2-q11",
    "examNumber": 2,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "Virtual Machine Ephemeral OS Disks Architecture",
    "scenario": "You are deploying a stateless batch computing worker tier inside a Virtual Machine Scale Set. The workload creates and destroys VMs frequently.\n\nYou want to achieve the following goals:\n1. Achieve the lowest possible OS disk latency with maximum read/write performance\n2. Eliminate remote managed disk storage billing fees for the OS disks\n3. Enable rapid VM re-imaging and reset times\n\nWhich disk configuration should you select during VM creation?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Ultra Disk Managed OS disk with 100,000 provisioned IOPS."
      },
      {
        "id": "B",
        "text": "Ephemeral OS Disk deployed to local VM cache or temp disk."
      },
      {
        "id": "C",
        "text": "Premium SSD v2 managed disk with zone-redundant storage (ZRS)."
      },
      {
        "id": "D",
        "text": "Standard HDD unmanaged disk on Page Blobs."
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B (Ephemeral OS Disk) is correct.",
      "triggerConstraints": "Requirement: Zero storage cost, lowest latency, rapid reimaging for stateless workload.",
      "flawedMentalModel": "Selecting Ultra Disks (Option A) for speed, ignoring the requirements to eliminate storage costs and support stateless scale sets.",
      "coreMechanic": "Ephemeral OS Disks are created directly on the local VM storage (cache or temp NVMe drive) of the host physical machine:\n1. Performance: Delivers sub-millisecond latency identical to local physical NVMe drives.\n2. Cost: Completely FREE storage cost (incurs $0.00 disk storage charges because it utilizes already-included VM cache space).\n3. Reimaging: Re-imaging is near instantaneous.\n4. Trade-off: Data on the OS disk is ephemeral (lost on VM deallocation/reboot to a new host), making it ideal for stateless batch compute and scale sets.",
      "distractors": {
        "A": "Ultra Disks incur high hourly storage and provisioned IOPS costs, and cannot be used as Ephemeral disks.",
        "C": "Premium SSD v2 incurs managed disk billing charges.",
        "D": "Standard HDD is high latency magnetic media and incurs storage billing."
      },
      "heuristic": "Stateless VMs + zero storage cost + sub-ms OS latency = Ephemeral OS Disk (on VM cache/temp disk).",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machines/ephemeral-os-disks",
      "errorJournalRef": "azure_placement_and_boundary_matrix.md"
    }
  },
  {
    "id": "e2-q12",
    "examNumber": 2,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "App Service Deployment Slots & Sticky Settings Configuration",
    "scenario": "You have an Azure Web App named `app-shop-eus` running on a Standard (S1) plan with two deployment slots: `production` and `staging`.\n\nYou configure application settings on both slots:\n- `DatabaseConnectionString`: Production connects to production DB; Staging connects to staging DB.\n- `FeatureFlags`: Contains experimental features enabled only on Staging.\n\nYou need to ensure that when you execute a **Slot Swap** between staging and production:\n1. The production slot continues to connect to the production database.\n2. The staging slot continues to connect to the staging database.\n3. Application code and binaries swap seamlessly with zero downtime.\n\nWhat setting should you enable on `DatabaseConnectionString` in both slots?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Set the connection string type to 'Custom' instead of 'SQLAzure'."
      },
      {
        "id": "B",
        "text": "Configure an Azure Key Vault reference with system-assigned managed identity on the staging slot."
      },
      {
        "id": "C",
        "text": "Select the 'Deployment slot setting' (sticky) checkbox for DatabaseConnectionString."
      },
      {
        "id": "D",
        "text": "Enable Auto Swap on the production slot targeting the staging slot."
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C is correct.",
      "triggerConstraints": "Requirement: Prevent connection string from swapping during slot swap (keep it pinned to the slot).",
      "flawedMentalModel": "Assuming all app settings swap by default, or assuming connection string types affect swap behavior.",
      "coreMechanic": "In Azure App Service Deployment Slots:\n1. Swappable Settings (Default): Configuration settings (app settings, connection strings) swap along with the application binaries unless configured otherwise.\n2. Sticky Settings ('Deployment slot setting'): Checking 'Deployment slot setting' marks the parameter as sticky to the slot. When a swap occurs, sticky settings do NOT swap; each slot retains its specific configuration (e.g. database connection strings, custom domains, SSL certificates).",
      "distractors": {
        "A": "Connection string types define the ADO.NET provider; they do not control slot stickiness.",
        "B": "Key Vault references will still swap if the setting itself is not marked as a slot setting.",
        "D": "Auto swap triggers the swap upon deployment; it does not control setting stickiness."
      },
      "heuristic": "Pin connection string/app setting to an App Service slot across swaps = 'Deployment slot setting' (sticky).",
      "msLearnUrl": "https://learn.microsoft.com/azure/app-service/deploy-staging-slots#which-settings-are-swapped",
      "errorJournalRef": "TD Sampler Q3"
    }
  },
  {
    "id": "e2-q13",
    "examNumber": 2,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "App Service Custom Domain Mapping & Domain Verification ID",
    "scenario": "You are mapping a custom apex domain (`contoso.com`) and a subdomain (`shop.contoso.com`) to an Azure App Service web app (`app-contoso.azurewebsites.net`).\n\nTo prevent dangling DNS domain takeovers and prove ownership of the domain before routing traffic, what DNS verification record must you create at your DNS registrar?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "An MX record with priority 0 pointing to mail.azurewebsites.net."
      },
      {
        "id": "B",
        "text": "A PTR record resolving the Azure Web App public VIP to contoso.com."
      },
      {
        "id": "C",
        "text": "An NS record delegating your public DNS zone to Azure DNS name servers."
      },
      {
        "id": "D",
        "text": "A TXT record pointing `asuid.<subdomain>` to the Custom Domain Verification ID found in the App Service Custom domains blade."
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D is correct.",
      "triggerConstraints": "Requirement: Verify domain ownership for Azure App Service custom domain.",
      "flawedMentalModel": "Confusing Entra ID custom domain verification (which uses MS=ms12345678) with App Service custom domain verification (which uses asuid.<subdomain> with Custom Domain Verification ID).",
      "coreMechanic": "Azure App Service requires pre-validation of domain ownership using a Custom Domain Verification ID (a unique GUID generated on the web app):\n1. Subdomain (`shop.contoso.com`): Create a CNAME record mapping `shop` to `app-contoso.azurewebsites.net`, or create a TXT record `asuid.shop` with the verification ID.\n2. Apex domain (`contoso.com`): Create an A record pointing to the web app's inbound IP AND a TXT record `asuid` (or `asuid.contoso.com`) containing the verification ID.",
      "distractors": {
        "A": "MX records are used for email delivery or Entra ID fallback verification, not App Service custom domains.",
        "B": "PTR records are for reverse DNS lookups.",
        "C": "Delegating your entire zone to Azure DNS is optional and does not bypass domain verification."
      },
      "heuristic": "App Service Custom Domain Verification = TXT record with `asuid.<subdomain>` and the Custom Domain Verification ID.",
      "msLearnUrl": "https://learn.microsoft.com/azure/app-service/app-service-web-tutorial-custom-domain",
      "errorJournalRef": "TD Timed Q5"
    }
  },
  {
    "id": "e2-q14",
    "examNumber": 2,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "Azure Spot Virtual Machines: Eviction Policies & Sizing",
    "scenario": "You are deploying non-critical batch processing compute workloads to Azure Virtual Machines. To reduce costs by up to 90%, you select **Azure Spot Virtual Machines**.\n\nYou need to configure the eviction policy such that when Azure reclaims the unallocated capacity, the virtual machines are **stopped and deallocated** (preserving their attached disks and network configurations) rather than permanently deleted.\n\nWhich Eviction policy should you configure?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Deallocate"
      },
      {
        "id": "B",
        "text": "Delete"
      },
      {
        "id": "C",
        "text": "Hibernate"
      },
      {
        "id": "D",
        "text": "Evict-to-Cold"
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A (Deallocate) is correct.",
      "triggerConstraints": "Requirement: Configure Azure Spot VM eviction policy to preserve disk and network state upon eviction.",
      "flawedMentalModel": "Assuming Azure Spot VMs can only be deleted upon eviction, or confusing Deallocate with Delete.",
      "coreMechanic": "Azure Spot Virtual Machines offer two eviction policies:\n1. Deallocate (Default for standalone Spot VMs): When evicted, the VM is stopped and deallocated. Underlying compute charges stop, but attached managed disks and public IPs remain preserved (and billed). The VM can be restarted when spot capacity returns.\n2. Delete: When evicted, the VM and its local infrastructure are permanently deleted (ideal for stateless scale sets).",
      "distractors": {
        "B": "Delete permanently purges the VM and attached disks upon eviction.",
        "C": "Hibernate is not an eviction policy option for Spot VMs.",
        "D": "Evict-to-Cold is not an Azure feature."
      },
      "heuristic": "Spot VM Eviction Policy: 'Deallocate' (preserves disks/configs) vs 'Delete' (purges VM).",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machines/spot-vms#eviction-policy",
      "errorJournalRef": "TD Timed Q3"
    }
  },
  {
    "id": "e2-q15",
    "examNumber": 2,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Microsoft Entra Privileged Identity Management (PIM) Role Assignments",
    "scenario": "Your enterprise requires zero-standing administrative privileges across Azure subscriptions. You configure Microsoft Entra Privileged Identity Management (PIM).\n\nYou want administrators to have the ability to activate the **Contributor** role on `Subscription-Core` only when needed, requiring Multi-Factor Authentication and business justification, for a maximum duration of 4 hours.\n\nWhich type of role assignment should you configure in PIM?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Active assignment"
      },
      {
        "id": "B",
        "text": "Eligible assignment"
      },
      {
        "id": "C",
        "text": "Permanent assignment"
      },
      {
        "id": "D",
        "text": "Dynamic device assignment"
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B (Eligible assignment) is correct.",
      "triggerConstraints": "Requirement: Just-in-Time (JIT) role elevation with MFA and justification; no standing privileges.",
      "flawedMentalModel": "Confusing 'Eligible' assignment with 'Active' assignment in PIM.",
      "coreMechanic": "Microsoft Entra Privileged Identity Management (PIM) Assignment Types:\n1. Eligible Assignment: The user does NOT have active permissions by default (zero standing access). When needed, the user requests activation in PIM, satisfies MFA / approval / justification requirements, and gains permissions for a bounded time window (e.g. 4 hours).\n2. Active Assignment: The user holds permanent or time-bound standing permissions without needing to perform an activation step.",
      "distractors": {
        "A": "Active assignment gives standing permissions, violating zero-standing-access rules.",
        "C": "Permanent assignment grants indefinite access without JIT activation.",
        "D": "PIM role assignments apply to users and groups, not dynamic devices."
      },
      "heuristic": "PIM Just-in-Time access = 'Eligible' role assignment. Standing access = 'Active' assignment.",
      "msLearnUrl": "https://learn.microsoft.com/entra/id-governance/privileged-identity-management/pim-configure",
      "errorJournalRef": "entra-id-master-architecture-and-governance.md"
    }
  },
  {
    "id": "e2-q16",
    "examNumber": 2,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Entra ID Dynamic Membership Rules Syntax",
    "scenario": "You need to create a dynamic security group in Microsoft Entra ID named `grp-us-sales`.\n\nThe group must automatically populate with all user accounts that meet the following criteria:\n1. The user's `Department` attribute is set to `Sales`\n2. The user's `UsageLocation` attribute is set to `US`\n\nWhich dynamic membership rule syntax is correct?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "SELECT * FROM Users WHERE Department = 'Sales' AND UsageLocation = 'US'"
      },
      {
        "id": "B",
        "text": "(user.department == \"Sales\") && (user.country == \"US\")"
      },
      {
        "id": "C",
        "text": "(user.department -eq \"Sales\") -and (user.usageLocation -eq \"US\")"
      },
      {
        "id": "D",
        "text": "user.department:Sales + user.usageLocation:US"
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C is correct.",
      "triggerConstraints": "Requirement: Author a Microsoft Entra ID dynamic membership rule syntax for users matching Department and UsageLocation.",
      "flawedMentalModel": "Guessing SQL syntax (Option A) or C-style operators (Option B).",
      "coreMechanic": "Microsoft Entra ID dynamic membership rules use PowerShell-like comparison operators:\n- Equality: `-eq`\n- Logical AND: `-and`\n- String values are enclosed in double quotes: `(user.department -eq \"Sales\") -and (user.usageLocation -eq \"US\")`.\nOther supported operators include `-ne`, `-contains`, `-notContains`, `-startsWith`, and `-match`.",
      "distractors": {
        "A": "SQL syntax is invalid in Entra dynamic group rule expressions.",
        "B": "Double equals (==) and ampersands (&&) are invalid operators in Entra rule syntax.",
        "D": "Colon and plus are invalid syntax."
      },
      "heuristic": "Entra Dynamic Group Syntax: Uses PowerShell operators: `-eq`, `-ne`, `-and`, `-or`, `-contains`.",
      "msLearnUrl": "https://learn.microsoft.com/entra/identity/users/groups-dynamic-membership",
      "errorJournalRef": "entra-id-part2-advanced-identity.md"
    }
  },
  {
    "id": "e2-q17",
    "examNumber": 2,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Custom RBAC Role Definitions & Assignable Scopes",
    "scenario": "You are creating a custom Azure RBAC role named `VM Restart Operator` using a JSON definition.\n\nThe role must allow users to restart virtual machines, read VM properties, and inspect network interface configurations, but must NOT allow modifying or deleting VMs.\n\nReview the following JSON definition snippet:\n```json\n{\n  \"Name\": \"VM Restart Operator\",\n  \"IsDataAction\": false,\n  \"Actions\": [\n    \"Microsoft.Compute/virtualMachines/read\",\n    \"Microsoft.Compute/virtualMachines/restart/action\",\n    \"Microsoft.Network/networkInterfaces/read\"\n  ],\n  \"NotActions\": [],\n  \"DataActions\": [],\n  \"NotDataActions\": [],\n  \"AssignableScopes\": [\n    \"/subscriptions/11111111-2222-3333-4444-555555555555\"\n  ]\n}\n```\n\nWhich scopes are legally supported inside `AssignableScopes` for a custom role?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Subscriptions, Resource Groups, and individual child resources (e.g. specific VMs) only."
      },
      {
        "id": "B",
        "text": "The Microsoft Entra ID Tenant Root Directory (/), Subscriptions, and Resource Groups."
      },
      {
        "id": "C",
        "text": "Any URL pointing to an on-premises Active Directory organizational unit (OU)."
      },
      {
        "id": "D",
        "text": "Management Groups, Subscriptions, and Resource Groups only."
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D is correct.",
      "triggerConstraints": "Requirement: Identify legally supported assignable scopes for an Azure custom RBAC role.",
      "flawedMentalModel": "Assuming custom roles can be assigned to individual child resource IDs (e.g. specific VMs) in AssignableScopes, or assuming Tenant Root is supported.",
      "coreMechanic": "In Azure RBAC custom role definitions, `AssignableScopes` specifies where the custom role can be made available for assignment. Legally supported scopes are strictly:\n1. Management Groups (e.g. `/providers/Microsoft.Management/managementGroups/mg-corp`)\n2. Subscriptions (e.g. `/subscriptions/<sub-id>`)\n3. Resource Groups (e.g. `/subscriptions/<sub-id>/resourceGroups/<rg-name>`)\nIndividual resource scopes (e.g. a specific VM) are NOT supported in AssignableScopes (though a role can be assigned at that scope after creation).",
      "distractors": {
        "A": "Individual child resources cannot be declared inside AssignableScopes.",
        "B": "The Entra ID tenant root directory is for Entra directory roles, not Azure Resource Manager custom RBAC roles.",
        "C": "On-premises Active Directory OUs are completely outside the ARM scope model."
      },
      "heuristic": "Custom RBAC AssignableScopes = Management Group, Subscription, or Resource Group ONLY. Never child resource IDs!",
      "msLearnUrl": "https://learn.microsoft.com/azure/role-based-access-control/custom-roles#assignablescopes",
      "errorJournalRef": "entra-id-master-architecture-and-governance.md"
    }
  },
  {
    "id": "e2-q18",
    "examNumber": 2,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "Azure Blob Storage Object Replication Prerequisites",
    "scenario": "You want to configure asynchronous **Object Replication** between a source General Purpose v2 storage account (`stsourceeus` in East US) and a destination storage account (`stdestweu` in West Europe) to replicate block blobs in a specific container automatically.\n\nWhich TWO features are mandatory prerequisites to enable Object Replication between the accounts? (Select TWO)",
    "questionType": "multiple",
    "options": [
      {
        "id": "A",
        "text": "Hierarchical Namespace (Azure Data Lake Storage Gen2)"
      },
      {
        "id": "B",
        "text": "Blob Versioning"
      },
      {
        "id": "C",
        "text": "Customer-Managed Keys (CMK) encryption"
      },
      {
        "id": "D",
        "text": "Blob Change Feed (on the source account)"
      },
      {
        "id": "E",
        "text": "Large File Shares support"
      }
    ],
    "correctAnswer": [
      "B",
      "D"
    ],
    "explanation": {
      "verdict": "Options B (Blob Versioning) and D (Blob Change Feed) are correct.",
      "triggerConstraints": "Requirement: Configure Blob Object Replication between two storage accounts.",
      "flawedMentalModel": "Assuming Object Replication works on standard accounts without prerequisites, or confusing it with Data Lake Gen2.",
      "coreMechanic": "Azure Blob Object Replication asynchronously copies block blobs according to rules configured between accounts. Mandatory prerequisites:\n1. Blob Versioning: MUST be enabled on BOTH source and destination accounts.\n2. Blob Change Feed: MUST be enabled on the SOURCE storage account (so the replication engine can track blob creations and modifications).\n3. Account Type: Both accounts must be GPv2 or Premium BlockBlobStorage.",
      "distractors": {
        "A": "Hierarchical namespace (ADLS Gen2) is actually INCOMPATIBLE with Object Replication.",
        "C": "Customer-Managed Keys are optional and not a prerequisite.",
        "E": "Large File Shares applies to Azure Files, not Blob Object Replication."
      },
      "heuristic": "Blob Object Replication Prerequisites = Blob Versioning (on BOTH) + Blob Change Feed (on SOURCE).",
      "msLearnUrl": "https://learn.microsoft.com/azure/storage/blobs/object-replication-overview#prerequisites-for-object-replication",
      "errorJournalRef": "error_journal.md"
    }
  },
  {
    "id": "e2-q19",
    "examNumber": 2,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "Shared Access Signature (SAS) Types & User Delegation SAS",
    "scenario": "A development team requests a Shared Access Signature (SAS) token to allow a mobile application to upload user photos to an Azure Blob container.\n\nSecurity policy strictly forbids sharing storage account access keys or using SAS tokens that rely on account shared keys for cryptographic signing.\n\nWhich type of SAS token should you generate to adhere to this security policy?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "User Delegation SAS secured by Microsoft Entra ID credentials"
      },
      {
        "id": "B",
        "text": "Service SAS secured by Storage Account Key 1"
      },
      {
        "id": "C",
        "text": "Account SAS signed with a Key Vault Secret"
      },
      {
        "id": "D",
        "text": "Anonymous SAS token with write-only permissions"
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A (User Delegation SAS) is correct.",
      "triggerConstraints": "Requirement: Generate a SAS token without using or exposing storage account shared keys.",
      "flawedMentalModel": "Assuming all SAS tokens are signed with storage account shared keys.",
      "coreMechanic": "Azure Storage provides three SAS types:\n1. User Delegation SAS: Secured and signed using Microsoft Entra ID credentials rather than the storage account shared key. An Entra ID identity (user or managed identity) is granted a user delegation key, which is used to sign the SAS. This eliminates exposure of storage account keys and allows Entra ID RBAC revocation.\n2. Service SAS: Signed with storage account shared keys.\n3. Account SAS: Signed with storage account shared keys.",
      "distractors": {
        "B": "Service SAS is signed with the storage account key, violating security policy.",
        "C": "Account SAS is signed with storage account keys, not Key Vault secrets.",
        "D": "Anonymous SAS does not exist; anonymous access does not use SAS tokens."
      },
      "heuristic": "SAS token without storage account keys = User Delegation SAS (secured by Microsoft Entra ID).",
      "msLearnUrl": "https://learn.microsoft.com/azure/storage/blobs/storage-blob-user-delegation-sas-create-portal",
      "errorJournalRef": "AR PT01 Q47"
    }
  },
  {
    "id": "e2-q20",
    "examNumber": 2,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "Storage Account Firewalls & Trusted Azure Services Exception",
    "scenario": "You have a General Purpose v2 storage account named `stcorpfin`. You configure the storage account firewall to **'Enabled from selected virtual networks and IP addresses'** with no public IP rules added.\n\nYou have an Azure Backup Vault that must execute scheduled Operational Backups of blob containers inside `stcorpfin`.\n\nWhich setting in the storage account Networking blade must be enabled to permit Azure Backup to connect through the storage firewall?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Add 0.0.0.0/0 to the allowed firewall IP ranges."
      },
      {
        "id": "B",
        "text": "Check 'Allow Azure services on the trusted services list to access this storage account' under Exceptions."
      },
      {
        "id": "C",
        "text": "Configure an Inbound NSG rule on the Backup Vault subnet allowing port 443."
      },
      {
        "id": "D",
        "text": "Assign the Owner role on stcorpfin to Azure Backup."
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B is correct.",
      "triggerConstraints": "Requirement: Allow Azure Backup to access storage account behind firewall.",
      "flawedMentalModel": "Attempting to whitelist Azure public IP ranges (Option A) or assuming RBAC roles bypass firewalls.",
      "coreMechanic": "When an Azure Storage account firewall is restricted to selected networks, first-party Microsoft Azure services (such as Azure Backup, Azure Monitor, Azure Event Grid, and Azure DevTest Labs) are blocked unless the platform exception is enabled:\n- Setting: In the Networking blade, check 'Allow Azure services on the trusted services list to access this storage account'.\n- Behind the scenes: Azure verifies the caller using strong managed identity authentication.",
      "distractors": {
        "A": "0.0.0.0/0 opens the storage account to the entire public internet.",
        "C": "Backup Vaults do not sit in subnets with NSGs.",
        "D": "RBAC permissions evaluate after network firewall rules; RBAC cannot bypass a network block."
      },
      "heuristic": "PaaS service accessing firewalled Storage Account = 'Allow Azure services on the trusted services list'.",
      "msLearnUrl": "https://learn.microsoft.com/azure/storage/common/storage-network-security#trusted-access-based-on-a-managed-identity",
      "errorJournalRef": "error_journal.md"
    }
  },
  {
    "id": "e2-q21",
    "examNumber": 2,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "AzCopy: `copy` vs. `sync` Mechanics & Destination File Deletion",
    "scenario": "You are synchronizing an on-premises folder (`C:\\WebsiteData`) with an Azure Blob container named `web`.\n\nFiles are frequently deleted from `C:\\WebsiteData` on-premises. You need a command that ensures the Azure Blob container reflects an **exact replica** of the local folder, including automatically deleting any files in the blob container that no longer exist in the local source directory.\n\nWhich command should you execute?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "azcopy copy \"C:\\WebsiteData\" \"https://stweb.blob.core.windows.net/web\" --recursive --purge"
      },
      {
        "id": "B",
        "text": "az storage blob sync --source \"C:\\WebsiteData\" --container web --mirror"
      },
      {
        "id": "C",
        "text": "azcopy sync \"C:\\WebsiteData\" \"https://stweb.blob.core.windows.net/web\" --delete-destination=true"
      },
      {
        "id": "D",
        "text": "azcopy sync \"https://stweb.blob.core.windows.net/web\" \"C:\\WebsiteData\" --mirror"
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C is correct.",
      "triggerConstraints": "Requirement: Exact one-way mirror from local folder to Azure Blob container, deleting orphaned destination files.",
      "flawedMentalModel": "Assuming `azcopy copy` can delete files, or confusing sync with copy.",
      "coreMechanic": "Difference between `azcopy copy` and `azcopy sync`:\n1. `azcopy copy`: Copies new and modified files from source to destination. It NEVER deletes files from the destination.\n2. `azcopy sync`: Compares source and destination based on file names and last modified timestamps. To remove files from the destination that do not exist at the source, you MUST supply the flag `--delete-destination=true` (or `prompt`).",
      "distractors": {
        "A": "azcopy copy does not support --purge; copy never deletes destination files.",
        "B": "az storage blob sync is not a valid Azure CLI command.",
        "D": "Inverts source and destination (would sync from Azure to local drive)."
      },
      "heuristic": "One-way directory mirror with deletion = `azcopy sync <Source> <Destination> --delete-destination=true`.",
      "msLearnUrl": "https://learn.microsoft.com/azure/storage/common/storage-ref-azcopy-sync",
      "errorJournalRef": "azcopy_master_guide.md"
    }
  },
  {
    "id": "e2-q22",
    "examNumber": 2,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "Azure VPN Gateway SKUs & Routing Protocols (BGP)",
    "scenario": "You are deploying a site-to-site VPN connection between an on-premises datacenter and an Azure Virtual Network. The connection requires:\n1. Dynamic route exchange using Border Gateway Protocol (BGP)\n2. Active-Active dual-redundant VPN tunnels with two public IP addresses on the Azure gateway\n3. An aggregate throughput of at least 1 Gbps\n\nWhich minimum VPN Gateway SKU and routing type should you select?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Basic SKU with Policy-based VPN"
      },
      {
        "id": "B",
        "text": "VpnGw1 with Policy-based VPN"
      },
      {
        "id": "C",
        "text": "VpnGw1Generation1 with Static Routing"
      },
      {
        "id": "D",
        "text": "VpnGw2 with Route-based VPN"
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D (VpnGw2 Route-based) is correct.",
      "triggerConstraints": "Requirements: BGP dynamic routing, Active-Active dual tunnels, >= 1 Gbps aggregate throughput.",
      "flawedMentalModel": "Assuming Basic SKU or Policy-based VPNs support BGP or Active-Active tunnels, or selecting VpnGw1 (which only provides 650 Mbps).",
      "coreMechanic": "Azure VPN Gateway SKU and Routing Rules:\n1. Routing Type: BGP and Active-Active setups REQUIRE a **Route-based** VPN gateway. Policy-based VPNs do not support BGP or Active-Active.\n2. Throughput Benchmarks:\n- Basic SKU: 100 Mbps (no BGP, no Active-Active).\n- VpnGw1: 650 Mbps.\n- VpnGw2: 1 Gbps (1.25 Gbps benchmark).\nTo achieve at least 1 Gbps throughput with BGP and Active-Active, **VpnGw2 Route-based** is the minimum requirement.",
      "distractors": {
        "A": "Basic SKU only supports 100 Mbps and does not support BGP or Active-Active.",
        "B": "Policy-based VPNs do not support BGP dynamic routing.",
        "C": "VpnGw1 maximum throughput is 650 Mbps, failing the 1 Gbps requirement."
      },
      "heuristic": "BGP + Active-Active VPN = Always Route-based. >= 1 Gbps = VpnGw2 minimum.",
      "msLearnUrl": "https://learn.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways#gwsku",
      "errorJournalRef": "azure_placement_and_boundary_matrix.md"
    }
  },
  {
    "id": "e2-q23",
    "examNumber": 2,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "Azure NAT Gateway: Outbound SNAT & Subnet Association",
    "scenario": "You have a subnet named `snet-backend` containing 20 virtual machines running background microservices. The microservices must initiate outbound connections to external third-party payment APIs on the Internet.\n\nSecurity requirements dictate:\n1. All 20 VMs must share a single, static public IP address for outbound Internet traffic to allow payment providers to whitelist the IP.\n2. Inbound connections initiated from the Internet to these VMs must be strictly prohibited at the network level.\n3. The solution must scale automatically without SNAT port exhaustion.\n\nWhat should you deploy?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Associate an Azure NAT Gateway with a static Public IP address to snet-backend."
      },
      {
        "id": "B",
        "text": "Assign a Public IP address directly to each VM's network interface."
      },
      {
        "id": "C",
        "text": "Deploy a Public Azure Load Balancer with outbound rules targeting snet-backend."
      },
      {
        "id": "D",
        "text": "Deploy an Azure Application Gateway v2 in snet-backend."
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A (Azure NAT Gateway) is correct.",
      "triggerConstraints": "Requirement: Outbound internet SNAT with single static IP; zero unsolicited inbound traffic; no SNAT exhaustion.",
      "flawedMentalModel": "Deploying Load Balancers or individual Public IPs.",
      "coreMechanic": "Azure Virtual Network NAT (NAT Gateway):\n1. Outbound SNAT: Provides outbound-only Internet connectivity for all resources in an attached subnet. Traffic originates from the NAT Gateway's assigned static public IP(s).\n2. Unsolicited Inbound: Completely drops unsolicited inbound connections from the Internet, providing high security by default.\n3. Port Allocation: Dynamically allocates SNAT ports from an on-demand pool (up to 64,512 concurrent flows per IP), eliminating SNAT port exhaustion.",
      "distractors": {
        "B": "Assigning 20 public IPs requires whitelisting 20 IPs and exposes VMs to inbound internet attacks.",
        "C": "Public Load Balancer pre-allocates fixed SNAT ports per VM, leading to SNAT port exhaustion.",
        "D": "Application Gateway is for inbound HTTP reverse proxy load balancing, not outbound VM internet SNAT."
      },
      "heuristic": "Outbound-only Internet SNAT with static IP + zero inbound ingress = Azure NAT Gateway.",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-network/nat-gateway/nat-overview",
      "errorJournalRef": "azure_placement_and_boundary_matrix.md"
    }
  },
  {
    "id": "e2-q24",
    "examNumber": 2,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "Azure Application Gateway v2: Path-Based URL Routing",
    "scenario": "You deploy an Azure Application Gateway v2 (`appgw-prod`). You have two backend pools:\n- `pool-images`: Contains virtual machines optimized for serving image media.\n- `pool-video`: Contains virtual machines optimized for streaming video content.\n\nYou need to route incoming HTTP requests as follows:\n- Requests to `https://media.contoso.com/images/*` must route to `pool-images`.\n- Requests to `https://media.contoso.com/video/*` must route to `pool-video`.\n- All other requests must route to a default backend pool named `pool-default`.\n\nWhich Application Gateway routing rule configuration should you configure?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Create a Basic routing rule with two frontend IP configurations."
      },
      {
        "id": "B",
        "text": "Create a Path-based routing rule with a URL path map defining /images/* and /video/* paths."
      },
      {
        "id": "C",
        "text": "Create an Azure Traffic Manager profile with Priority routing method."
      },
      {
        "id": "D",
        "text": "Create two separate Application Gateways in different subnets."
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B is correct.",
      "triggerConstraints": "Requirement: Route HTTP traffic based on URL path (/images/* vs /video/*) to different backend pools on Application Gateway.",
      "flawedMentalModel": "Selecting Basic routing rule (Option A) or Traffic Manager (Option C).",
      "coreMechanic": "Azure Application Gateway is a Layer 7 (HTTP/HTTPS) reverse proxy load balancer:\n1. Path-based Routing: Uses a URL path map associated with a path-based routing rule. The rule inspects the URI path of the request and forwards traffic to the corresponding backend pool (`/images/*` -> `pool-images`, `/video/*` -> `pool-video`), while unmapped paths route to the default backend pool.\n2. Basic Routing: Directs all requests on a listener to a single backend pool without inspecting URL paths.",
      "distractors": {
        "A": "Basic routing rules cannot inspect URL paths.",
        "C": "Traffic Manager is DNS-based and cannot inspect HTTP URL paths.",
        "D": "Deploying multiple Application Gateways is unnecessary and expensive."
      },
      "heuristic": "Route HTTP traffic based on URL path (/images/*, /video/*) = Application Gateway Path-based routing rule.",
      "msLearnUrl": "https://learn.microsoft.com/azure/application-gateway/url-route-overview",
      "errorJournalRef": "azure_placement_and_boundary_matrix.md"
    }
  },
  {
    "id": "e2-q25",
    "examNumber": 2,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "User Defined Routes (UDR) & Longest Prefix Match Rule",
    "scenario": "A subnet named `snet-workload` has a custom Route Table attached with the following routes:\n\n| Route Name | Address Prefix | Next Hop Type | Next Hop IP Address |\n| :--- | :--- | :--- | :--- |\n| Route-Default | 0.0.0.0/0 | Virtual appliance | 10.10.1.4 |\n| Route-Corp | 10.0.0.0/8 | Virtual network | None |\n| Route-Database | 10.200.4.0/24 | Virtual appliance | 10.10.1.4 |\n\nA virtual machine in `snet-workload` transmits a packet destined for IP address `10.200.4.55`.\n\nWhich route determines the forwarding behavior, and what is the next hop?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Route-Corp (10.0.0.0/8) because Virtual network routes override Virtual appliance routes."
      },
      {
        "id": "B",
        "text": "Route-Default (0.0.0.0/0) because default routes evaluate first."
      },
      {
        "id": "C",
        "text": "Route-Database (10.200.4.0/24) because it is the longest prefix match; Next Hop is Virtual appliance (10.10.1.4)."
      },
      {
        "id": "D",
        "text": "The packet is dropped because of route conflict."
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C is correct.",
      "triggerConstraints": "Requirement: Determine packet routing when multiple routes match destination IP 10.200.4.55.",
      "flawedMentalModel": "Assuming system routes override UDRs, or assuming 0.0.0.0/0 takes precedence.",
      "coreMechanic": "Azure Virtual Network Routing Algorithm:\n1. Longest Prefix Match (LPM): When multiple routes contain the destination IP address, Azure SDN selects the route with the most specific (longest) subnet prefix.\n2. In this scenario, destination 10.200.4.55 matches:\n- 0.0.0.0/0 (prefix length: 0)\n- 10.0.0.0/8 (prefix length: 8)\n- 10.200.4.0/24 (prefix length: 24)\n3. Because /24 is the longest prefix match, `Route-Database` wins. Next hop is Virtual appliance 10.10.1.4.",
      "distractors": {
        "A": "Route-Corp (/8) has a shorter prefix than Route-Database (/24).",
        "B": "Default routes (/0) have the lowest precedence under longest prefix match.",
        "D": "Azure routing resolves overlapping routes deterministically via longest prefix match."
      },
      "heuristic": "Azure Routing: Longest Prefix Match (most specific CIDR prefix) ALWAYS wins!",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-network/virtual-networks-udr-overview#how-azure-selects-a-route",
      "errorJournalRef": "azure_placement_and_boundary_matrix.md"
    }
  },
  {
    "id": "e2-q26",
    "examNumber": 2,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "Azure Cross-Region Load Balancer & Global Public IP Tier",
    "scenario": "You are designing a globally distributed web application deployed across two Azure regions: `East US` and `North Europe`.\n\nEach region contains a regional Standard Load Balancer distributing traffic to backend virtual machines.\n\nYou need to deploy an Azure Load Balancer that routes incoming traffic to the nearest regional load balancer with ultra-low latency and provides automated cross-region failover.\n\nWhich configuration is required?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Deploy a Basic SKU Public Load Balancer with dynamic IP allocation."
      },
      {
        "id": "B",
        "text": "Deploy an Azure NAT Gateway in each region linked to a regional Traffic Manager profile."
      },
      {
        "id": "C",
        "text": "Configure VNet Peering between East US and North Europe with Gateway Transit enabled."
      },
      {
        "id": "D",
        "text": "Deploy an Azure Standard Load Balancer configured with the Global tier and a Global tier Public IP address."
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D is correct.",
      "triggerConstraints": "Requirement: Global cross-region load balancing front-ending regional Standard Load Balancers.",
      "flawedMentalModel": "Assuming Standard Load Balancers cannot route across regions, or attempting to use Basic SKU.",
      "coreMechanic": "Azure Cross-Region Load Balancer:\n1. Operates at Layer 4 across multiple regions.\n2. Requires the **Global tier** on the Load Balancer and the **Global tier** on the associated Standard Public IP address.\n3. Backend Pool: Contains regional Standard Load Balancers (not individual VMs or NICs). Routes traffic based on geographic proximity (Anycast IP) with automated failover.",
      "distractors": {
        "A": "Basic SKU is strictly regional and does not support cross-region routing.",
        "B": "NAT Gateway is strictly for outbound SNAT, not inbound load balancing.",
        "C": "VNet peering does not provide external Layer 4 cross-region client load balancing."
      },
      "heuristic": "Cross-Region Layer 4 Load Balancing = Azure Load Balancer (Global Tier) + Public IP (Global Tier).",
      "msLearnUrl": "https://learn.microsoft.com/azure/load-balancer/cross-region-overview",
      "errorJournalRef": "AR PT02 Q24"
    }
  },
  {
    "id": "e2-q27",
    "examNumber": 2,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "VM Run Command vs. Custom Script Extension",
    "scenario": "An administrator inadvertently misconfigures the Windows Firewall inside an Azure Virtual Machine (`vm-app-eus`), completely blocking all inbound RDP (port 3389) traffic. Network Security Groups on the subnet and NIC allow port 3389.\n\nYou cannot connect to `vm-app-eus` via RDP, Azure Bastion, or SSH.\n\nYou need to execute a PowerShell command inside the guest OS (`netsh advfirewall firewall set rule group=\"remote desktop\" new enable=Yes`) to re-enable RDP access without redeploying the virtual machine.\n\nWhich Azure feature should you use?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Azure Virtual Machine Run Command (RunPowerShellScript)"
      },
      {
        "id": "B",
        "text": "Attach a new Public IP address to the VM's network interface"
      },
      {
        "id": "C",
        "text": "Create a new Network Security Group rule with Priority 100"
      },
      {
        "id": "D",
        "text": "Enable IP Forwarding on the VM's network interface"
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A (Run Command) is correct.",
      "triggerConstraints": "Requirement: Execute script inside VM guest OS when RDP/SSH is blocked at the guest firewall.",
      "flawedMentalModel": "Modifying NSGs or Public IPs (Options B and C), overlooking that the block is inside the guest OS firewall.",
      "coreMechanic": "Azure VM Run Command:\n1. Operates via the Azure VM Guest Agent over the internal management plane (does not require open RDP/SSH ports or a public IP address).\n2. Allows administrators to run PowerShell (Windows) or Bash (Linux) scripts directly inside the guest OS via the Azure Portal, CLI, or REST API.\n3. Ideal for emergency remediation when guest OS firewalls, networking, or RDP services fail.",
      "distractors": {
        "B": "The block is inside the guest OS firewall; a new Public IP will still be rejected by Windows Firewall.",
        "C": "NSGs are already open; the guest OS is rejecting the connection.",
        "D": "IP forwarding is for Network Virtual Appliances routing traffic, not guest OS remediation."
      },
      "heuristic": "Emergency script execution inside VM when RDP/SSH blocked = VM Run Command (via Azure VM Agent).",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machines/windows/run-command",
      "errorJournalRef": "AR PT01 Q21"
    }
  },
  {
    "id": "e2-q28",
    "examNumber": 2,
    "domain": "Domain 5: Monitor and maintain Azure resources",
    "domainCode": 5,
    "topic": "Azure Monitor Agent (AMA) & Data Collection Rules (DCR)",
    "scenario": "You are migrating legacy VM monitoring away from the deprecated Log Analytics agent (MMA/OMS) to the modern **Azure Monitor Agent (AMA)**.\n\nYou install AMA on 50 virtual machines across different resource groups. You create a Data Collection Rule (DCR) to collect Windows Security Events (`Audit Failure` and `Audit Success`) and stream them to a centralized Log Analytics workspace.\n\nWhat action is required to activate log collection on the virtual machines?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Assign the Virtual Machine Contributor role to the Log Analytics workspace identity."
      },
      {
        "id": "B",
        "text": "Create a Data Collection Rule Association (DCRA) linking each VM to the DCR."
      },
      {
        "id": "C",
        "text": "Add the Log Analytics Workspace ID and Primary Key into the VM's registry."
      },
      {
        "id": "D",
        "text": "Restart the virtual machines in sequential order."
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B is correct.",
      "triggerConstraints": "Requirement: Activate log collection for VMs monitored by Azure Monitor Agent (AMA) using Data Collection Rules (DCR).",
      "flawedMentalModel": "Assuming workspace keys are still used like the legacy OMS agent, or assuming role assignments are needed on the workspace.",
      "coreMechanic": "Azure Monitor Agent (AMA) Architecture:\n1. AMA is decoupled from workspace workspaces and configuration.\n2. Configuration is defined centrally in a Data Collection Rule (DCR) specifying data sources (e.g. Security Events, IIS logs, Syslog) and destinations (Log Analytics).\n3. To apply the DCR to resources, you must create a **Data Collection Rule Association (DCRA)** linking the target VM(s) to the DCR. Once associated, the agent begins streaming data without requiring workspace keys.",
      "distractors": {
        "A": "VMs do NOT require Contributor roles on the Log Analytics workspace.",
        "C": "Workspace IDs and Primary Keys are legacy MMA architecture, not used by AMA.",
        "D": "Rebooting VMs is unnecessary; DCRAs apply dynamically."
      },
      "heuristic": "Azure Monitor Agent (AMA) requires Data Collection Rule Association (DCRA) to bind VMs to DCRs. No workspace keys!",
      "msLearnUrl": "https://learn.microsoft.com/azure/azure-monitor/agents/data-collection-rule-azure-monitor-agent",
      "errorJournalRef": "AR PT01 Q65"
    }
  },
  {
    "id": "e2-q29",
    "examNumber": 2,
    "domain": "Domain 5: Monitor and maintain Azure resources",
    "domainCode": 5,
    "topic": "Log Analytics Workspace Ingestion & Retention Tiers",
    "scenario": "Your organization has a Log Analytics workspace that collects security logs. Compliance regulations mandate that all security logs must be retained for **365 days (1 year)**.\n\nTo optimize costs, operations requires:\n1. Logs must remain actively searchable via standard KQL queries for **90 days** (interactive retention).\n2. Logs older than 90 days must be archived for the remaining **275 days** in low-cost long-term storage where they can be restored if an audit occurs.\n\nWhich configuration achieves this compliance and cost objective?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Set Workspace Data Retention to 365 days on the Pricing tier blade."
      },
      {
        "id": "B",
        "text": "Export logs daily to an Azure Storage account using AzCopy and set an Archive lifecycle policy."
      },
      {
        "id": "C",
        "text": "Set Interactive Retention to 90 days and Total Retention to 365 days on the target tables in the workspace."
      },
      {
        "id": "D",
        "text": "Create an Azure Automation runbook that deletes logs older than 90 days."
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C is correct.",
      "triggerConstraints": "Requirement: 90 days interactive KQL search + 275 days low-cost archive retention in Log Analytics.",
      "flawedMentalModel": "Setting 365 days interactive retention (Option A) which incurs full interactive ingestion and retention costs for the entire year.",
      "coreMechanic": "Log Analytics Workspace Data Retention:\n1. Interactive Retention: Logs are indexed and immediately queryable via Kusto Query Language (KQL). Can be configured per table (from 4 to 730 days). Standard is 30 or 90 days.\n2. Archive Tier (Total Retention): You can extend total retention up to 2,556 days (7 years). Data between the interactive limit (90 days) and total retention (365 days) is stored in the low-cost archive tier at a fraction of the price. Archived data can be restored or queried via search jobs if an audit occurs.",
      "distractors": {
        "A": "Setting interactive retention to 365 days incurs significantly higher storage and analytics charges.",
        "B": "Native Log Analytics archive eliminates the need for custom export scripts and external storage.",
        "D": "Deleting logs violates the compliance mandate to retain logs for 365 days."
      },
      "heuristic": "Log Analytics Cost Optimization: Set Interactive Retention (e.g. 90 days) + Total Retention (e.g. 365 days) for low-cost archive.",
      "msLearnUrl": "https://learn.microsoft.com/azure/azure-monitor/logs/data-retention-archive",
      "errorJournalRef": "AR PT01 Q5"
    }
  },
  {
    "id": "e2-q30",
    "examNumber": 2,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "Azure Blob Storage Immutability Policies (WORM Compliance)",
    "scenario": "A financial institution must comply with regulatory requirements (SEC Rule 17a-4) mandating that records must be stored in a Write-Once-Read-Many (WORM) state for 7 years.\n\nDuring this 7-year period, records must be protected from being overwritten, modified, or deleted by any user, including the Azure Subscription Owner and Microsoft Support.\n\nWhich Azure Blob Storage feature should you configure?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "A ReadOnly management lock applied to the storage account resource group."
      },
      {
        "id": "B",
        "text": "A time-based retention immutability policy in the Unlocked state."
      },
      {
        "id": "C",
        "text": "A Stored Access Policy with Read-Only permissions."
      },
      {
        "id": "D",
        "text": "A time-based retention immutability policy configured in the **Locked** state."
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D is correct.",
      "triggerConstraints": "Requirement: SEC WORM compliance; cannot be deleted or modified even by Subscription Owner or Microsoft Support.",
      "flawedMentalModel": "Assuming management locks (Option A) provide SEC WORM compliance, or using an Unlocked policy (Option B).",
      "coreMechanic": "Azure Blob Storage Immutable Storage provides WORM (Write Once, Read Many) protection:\n1. Unlocked Policy: Used for testing; the retention period can be shortened or deleted by administrators.\n2. Locked Policy: Once tested, the policy can be locked. Once LOCKED, the policy CANNOT be deleted, the retention interval CANNOT be shortened, and blobs CANNOT be modified or deleted by anyone (including Subscription Owners, Global Admins, and Microsoft Support) until the retention period expires. Complies with SEC 17a-4(f) regulations.",
      "distractors": {
        "A": "A ReadOnly management lock can be removed at any time by a Subscription Owner; it is not regulatory WORM.",
        "B": "An Unlocked policy can be modified or deleted by an administrator.",
        "C": "Stored Access Policies govern SAS tokens, not immutable storage compliance."
      },
      "heuristic": "Immutable Storage / SEC WORM Compliance = Time-based retention policy in the LOCKED state.",
      "msLearnUrl": "https://learn.microsoft.com/azure/storage/blobs/immutable-storage-overview",
      "errorJournalRef": "error_journal.md"
    }
  },
  {
    "id": "e2-q31",
    "examNumber": 2,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "Azure Files NFS 4.1 Protocol Prerequisites",
    "scenario": "You are migrating a Linux enterprise application that requires mounting shared storage using the **NFS v4.1** protocol.\n\nWhich combination of Azure Storage account kind and configuration settings is REQUIRED to create and mount an NFS file share in Azure Files?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "FileStorage (Premium SSD) account, Secure transfer required: Disabled, Private Endpoint (or selected VNet)."
      },
      {
        "id": "B",
        "text": "General Purpose v2 account, Secure transfer required: Enabled, Public Internet access enabled."
      },
      {
        "id": "C",
        "text": "BlobStorage account with Hierarchical Namespace enabled."
      },
      {
        "id": "D",
        "text": "General Purpose v1 account with Large File Shares enabled."
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A is correct.",
      "triggerConstraints": "Requirement: Prerequisites for Azure Files NFS 4.1 file shares.",
      "flawedMentalModel": "Assuming standard GPv2 accounts support NFS shares, or keeping Secure transfer enabled (NFS 4.1 does not support encryption in transit, so secure transfer must be disabled).",
      "coreMechanic": "Azure Files NFS 4.1 Prerequisites:\n1. Account Kind: MUST be **FileStorage** (Premium SSD file shares). Standard GPv2 accounts support SMB shares ONLY, not NFS.\n2. Secure Transfer: Because the NFS 4.1 protocol does not support native transport-layer encryption, 'Secure transfer required' MUST be set to **Disabled** on the storage account.\n3. Network Security: Because secure transfer is disabled, traffic cannot travel over the public internet. Access must be secured via **Private Endpoints** or Virtual Network Service Endpoints.",
      "distractors": {
        "B": "GPv2 does not support NFS shares, and Secure transfer must be disabled.",
        "C": "BlobStorage accounts do not host Azure Files NFS shares.",
        "D": "GPv1 does not support NFS file shares."
      },
      "heuristic": "Azure Files NFS 4.1 = FileStorage (Premium SSD) ONLY + Secure transfer DISABLED + Private Endpoint.",
      "msLearnUrl": "https://learn.microsoft.com/azure/storage/files/storage-files-quick-create-use-linux#prerequisites",
      "errorJournalRef": "azure_placement_and_boundary_matrix.md"
    }
  },
  {
    "id": "e2-q32",
    "examNumber": 2,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "Storage Account Move Boundaries & Limitations",
    "scenario": "You have an Azure Storage account named `stproddataeus` in resource group `rg-storage-prod` in the `East US` region.\n\nYou need to reorganize subscriptions within your Microsoft Entra ID tenant.\n\nWhich of the following operations is SUPPORTED by Azure Resource Manager for `stproddataeus`?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Changing the storage account's underlying Azure Region from East US to West Europe during the move."
      },
      {
        "id": "B",
        "text": "Moving stproddataeus to another resource group or subscription within the same Microsoft Entra ID tenant."
      },
      {
        "id": "C",
        "text": "Renaming the storage account to stproddataweu during the move."
      },
      {
        "id": "D",
        "text": "Moving stproddataeus while a ReadOnly management lock is active on rg-storage-prod."
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B is correct.",
      "triggerConstraints": "Requirement: Identify supported vs unsupported operations when moving an Azure Storage account.",
      "flawedMentalModel": "Assuming moving a resource changes its physical region (Option A) or allows renaming (Option C).",
      "coreMechanic": "Azure Resource Move Rules:\n1. Supported: Moving a storage account across Resource Groups or Subscriptions within the same tenant is fully supported.\n2. Region is Immutable: Moving a resource NEVER changes its underlying physical datacenter region.\n3. Name is Immutable: Storage account names are globally unique DNS endpoints (`*.core.windows.net`) and cannot be renamed.\n4. Locks: A ReadOnly lock on the resource group strictly blocks moving resources.",
      "distractors": {
        "A": "Moving resources never changes their physical region.",
        "C": "Storage accounts cannot be renamed.",
        "D": "ReadOnly locks strictly block moving resources."
      },
      "heuristic": "Moving a resource NEVER changes its region or name. ReadOnly lock strictly blocks moves.",
      "msLearnUrl": "https://learn.microsoft.com/azure/azure-resource-manager/management/move-limitations/storage-move-limitations",
      "errorJournalRef": "azure_placement_and_boundary_matrix.md"
    }
  },
  {
    "id": "e2-q33",
    "examNumber": 2,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "Azure Bastion SKU Capabilities: Standard vs. Basic",
    "scenario": "You manage multiple virtual networks in Azure. You have an Azure Bastion host deployed in `vnet-hub`.\n\nYou need to support the following operational requirements:\n1. Administrators must connect to VMs in **peered spoke virtual networks** (`vnet-spoke1` and `vnet-spoke2`) through the central Bastion host.\n2. Administrators must be able to connect using their local Windows **native Remote Desktop client (mstsc.exe)** using Azure CLI (`az network bastion rdp`).\n3. Administrators must be able to upload and download files to target VMs via the Bastion session.\n\nWhich Azure Bastion SKU is required?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Basic SKU"
      },
      {
        "id": "B",
        "text": "Developer SKU"
      },
      {
        "id": "C",
        "text": "Standard SKU (or higher)"
      },
      {
        "id": "D",
        "text": "Free SKU"
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C (Standard SKU) is correct.",
      "triggerConstraints": "Requirements: VNet peering transit, native client support (mstsc), and file copy via Azure Bastion.",
      "flawedMentalModel": "Assuming Basic SKU supports peered VNets or native RDP client connections.",
      "coreMechanic": "Azure Bastion SKU Features:\n1. Basic SKU: Connects to VMs in the SAME VNet only via browser-based HTML5 console. No native client support, no file copy, no peered VNet connectivity.\n2. Standard SKU: Unlocks enterprise features:\n- Peered Virtual Network support (Hub-and-Spoke)\n- Native client support (`az network bastion rdp/ssh`)\n- File upload / download via web session\n- Host scaling (up to 50 scale units)\n- IP-based connection.",
      "distractors": {
        "A": "Basic SKU does not support peered VNets, native clients, or file transfer.",
        "B": "Developer SKU is a lightweight single-tenant free/low-cost tier with no VNet peering or scaling.",
        "D": "There is no 'Free SKU' for Azure Bastion."
      },
      "heuristic": "Azure Bastion: VNet Peering transit + Native client (mstsc) + File copy = Standard SKU minimum.",
      "msLearnUrl": "https://learn.microsoft.com/azure/bastion/bastion-overview#sku",
      "errorJournalRef": "azure_placement_and_boundary_matrix.md"
    }
  },
  {
    "id": "e2-q34",
    "examNumber": 2,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "Azure Firewall Rule Processing Architecture & Order",
    "scenario": "You deploy an Azure Firewall to inspect and filter all outbound and inbound traffic in a hub virtual network.\n\nYou configure multiple rule collection types on the firewall policy:\n1. Network rule collection allowing TCP 443\n2. DNAT rule collection translating public port 8080 to an internal web server\n3. Application rule collection allowing outbound FQDN `*.microsoft.com`\n4. Threat Intelligence filtering set to Alert and Deny\n\nWhen inbound traffic arrives at the Azure Firewall, in which sequential order does the firewall engine process these rule types?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Application rules -> Network rules -> DNAT rules -> Threat Intelligence"
      },
      {
        "id": "B",
        "text": "Network rules -> Application rules -> DNAT rules -> Threat Intelligence"
      },
      {
        "id": "C",
        "text": "DNAT rules -> Application rules -> Network rules -> Threat Intelligence"
      },
      {
        "id": "D",
        "text": "Threat Intelligence -> DNAT rules -> Network rules -> Application rules"
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D is correct.",
      "triggerConstraints": "Requirement: Sequential order of rule evaluation in Azure Firewall.",
      "flawedMentalModel": "Assuming Network rules evaluate before DNAT rules or Threat Intelligence.",
      "coreMechanic": "Azure Firewall Rule Processing Order (Inbound & Outbound):\n1. Threat Intelligence filtering evaluates first (drops known malicious IPs/domains immediately).\n2. DNAT rules evaluate second (translates inbound public destination IP/port to internal private target).\n3. Network rules evaluate third (inspects Layer 3/4 IP, protocol, port). If matched, processing STOPS.\n4. Application rules evaluate fourth (inspects Layer 7 FQDN, HTTP/HTTPS, MSSQL).",
      "distractors": {
        "A": "Application rules evaluate last (Layer 7), not first.",
        "B": "Threat Intelligence and DNAT evaluate before Network rules.",
        "C": "Application rules do not evaluate before Network rules."
      },
      "heuristic": "Azure Firewall Processing Order: Threat Intelligence -> DNAT -> Network -> Application.",
      "msLearnUrl": "https://learn.microsoft.com/azure/firewall/rule-processing",
      "errorJournalRef": "azure_placement_and_boundary_matrix.md"
    }
  },
  {
    "id": "e2-q35",
    "examNumber": 2,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "Network Watcher Diagnostic Tools: IP Flow Verify vs. Connection Troubleshoot",
    "scenario": "A web server (`vm-web-01`) cannot communicate with a backend database (`vm-sql-01`) on port 1433.\n\nYou suspect that a Network Security Group rule is dropping the packets.\n\nYou need a diagnostic tool in Azure Network Watcher that checks whether a packet is allowed or denied based on the 5-tuple parameters (Source IP, Destination IP, Source Port, Destination Port, Protocol) and **identifies the exact NSG rule name and priority** responsible for the block.\n\nWhich Network Watcher tool should you use?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "IP flow verify"
      },
      {
        "id": "B",
        "text": "Connection troubleshoot"
      },
      {
        "id": "C",
        "text": "Packet capture"
      },
      {
        "id": "D",
        "text": "Next hop"
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A (IP flow verify) is correct.",
      "triggerConstraints": "Requirement: Test whether traffic is allowed or denied by NSGs and identify the exact blocking NSG rule name.",
      "flawedMentalModel": "Selecting Connection Troubleshoot (Option B) or Next Hop (Option D).",
      "coreMechanic": "Azure Network Watcher Tool Matrix:\n1. IP Flow Verify: Checks 5-tuple packet flow against effective security rules on a VM's NIC. Returns 'Access Allowed' or 'Access Denied', along with the EXACT Network Security Group rule name that allowed or blocked the packet.\n2. Connection Troubleshoot: Tests end-to-end TCP connectivity between two points (hop-by-hop latency and reachability).\n3. Next Hop: Tests routing tables (UDR) to identify the next hop type (e.g. Virtual Appliance, Internet).\n4. Packet Capture: Captures raw PCAP traffic traces on the VM.",
      "distractors": {
        "B": "Connection troubleshoot tests live end-to-end reachability, but IP flow verify specifically analyzes NSG rule evaluation.",
        "C": "Packet capture records raw packet traces, but does not identify NSG rule names.",
        "D": "Next hop checks routing tables, not NSG rules."
      },
      "heuristic": "Check NSG allow/deny + identify exact blocking rule = IP flow verify. Check routing next hop = Next hop.",
      "msLearnUrl": "https://learn.microsoft.com/azure/network-watcher/diagnose-vm-network-traffic-filtering-problem",
      "errorJournalRef": "azure_placement_and_boundary_matrix.md"
    }
  },
  {
    "id": "e2-q36",
    "examNumber": 2,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "Network Watcher: NSG Flow Logs & Traffic Analytics Integration",
    "scenario": "You need to audit all IP traffic passing through Network Security Groups across your enterprise. You need to identify top talkers, malicious external IP addresses attempting to probe your network, and traffic volume in bytes and packets.\n\nWhich combination of Azure features should you configure?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Azure Monitor Activity Logs exported to an Event Hub."
      },
      {
        "id": "B",
        "text": "NSG Flow Logs (Version 2) stored in a Storage Account, integrated with Traffic Analytics and a Log Analytics workspace."
      },
      {
        "id": "C",
        "text": "Diagnostic Settings on Virtual Machines sending IIS logs to Azure Blob Storage."
      },
      {
        "id": "D",
        "text": "Continuous Packet Capture on each VM using Azure Automation."
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B is correct.",
      "triggerConstraints": "Requirement: Audit NSG traffic, top talkers, malicious IPs, and byte/packet throughput.",
      "flawedMentalModel": "Assuming Activity Logs track IP network traffic flows.",
      "coreMechanic": "NSG Flow Logs and Traffic Analytics:\n1. NSG Flow Logs Version 2: Captures allowed and denied traffic through NSGs, including byte counts, packet counts, and TCP state transitions. Flow logs are written to an Azure Storage account.\n2. Traffic Analytics: Enriches NSG flow logs with Microsoft security intelligence and feeds rich visual dashboards and KQL tables (`AzureNetworkAnalytics_CL`) into a Log Analytics workspace, surfacing top talkers and malicious IPs.",
      "distractors": {
        "A": "Activity logs record control-plane management events (who created/deleted a resource), not network packet flows.",
        "C": "IIS logs only capture HTTP requests to web servers, not all network traffic.",
        "D": "Continuous packet capture generates massive storage overhead and requires manual Wireshark analysis."
      },
      "heuristic": "NSG traffic analysis + top talkers + malicious IP detection = NSG Flow Logs (v2) + Traffic Analytics (Log Analytics).",
      "msLearnUrl": "https://learn.microsoft.com/azure/network-watcher/traffic-analytics",
      "errorJournalRef": "azure_placement_and_boundary_matrix.md"
    }
  },
  {
    "id": "e2-q37",
    "examNumber": 2,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "Virtual Machine Scale Sets: Autoscaling Rules & Scale-In Policies",
    "scenario": "You configure horizontal autoscaling for a Virtual Machine Scale Set (`vmss-backend`):\n- Scale-out rule: Increase instance count by 2 when average Percentage CPU > 75% for 10 minutes.\n- Scale-in rule: Decrease instance count by 1 when average Percentage CPU < 25% for 10 minutes.\n- Cool down duration: 15 minutes.\n\nWhen traffic subsides and a scale-in event is triggered, you want the scale set to **terminate the oldest virtual machine instances first** that were deployed during earlier scale events.\n\nWhich Scale-In Policy should you configure on `vmss-backend`?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "NewestVM"
      },
      {
        "id": "B",
        "text": "Default"
      },
      {
        "id": "C",
        "text": "OldestVM"
      },
      {
        "id": "D",
        "text": "CustomScriptFirst"
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C (OldestVM) is correct.",
      "triggerConstraints": "Requirement: Terminate oldest VM instances first during VMSS scale-in.",
      "flawedMentalModel": "Assuming Default scale-in policy deletes oldest VMs, or guessing NewestVM.",
      "coreMechanic": "VMSS Scale-In Policies determine which VMs are deleted when the scale set scales down:\n1. Default: Balances VMs across availability zones and fault domains, then deletes the VM with the highest instance ID (newest VM).\n2. OldestVM: Balances across zones/FDs, then deletes the oldest virtual machine instance (lowest creation timestamp).\n3. NewestVM: Balances across zones/FDs, then deletes the newest virtual machine instance.",
      "distractors": {
        "A": "NewestVM deletes the most recently created instances.",
        "B": "Default balances across zones and deletes the newest instance.",
        "D": "CustomScriptFirst is an invalid policy name."
      },
      "heuristic": "VMSS Scale-In: 'OldestVM' deletes oldest instances first; 'Default' balances zones and deletes newest.",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-scale-in-policy",
      "errorJournalRef": "azure_placement_and_boundary_matrix.md"
    }
  },
  {
    "id": "e2-q38",
    "examNumber": 2,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Azure Key Vault Permission Models: Azure RBAC vs. Vault Access Policy",
    "scenario": "You deploy an Azure Key Vault named `kv-app-eus`. Your organization mandates using uniform Azure role-based access control across all Azure services.\n\nYou want to assign granular data plane roles (such as `Key Vault Secrets Officer` and `Key Vault Secrets User`) to security groups directly using the Access control (IAM) blade.\n\nWhich Key Vault permission model must be selected under the Access Configuration blade?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Vault access policy"
      },
      {
        "id": "B",
        "text": "Active Directory Shared Key Authentication"
      },
      {
        "id": "C",
        "text": "Anonymous SAS access"
      },
      {
        "id": "D",
        "text": "Azure role-based access control (Azure RBAC)"
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D is correct.",
      "triggerConstraints": "Requirement: Manage Key Vault keys/secrets using Azure RBAC roles via Access control (IAM) blade.",
      "flawedMentalModel": "Assuming Vault access policies support standard IAM roles.",
      "coreMechanic": "Azure Key Vault offers two mutually exclusive permission models:\n1. Vault access policy (Legacy default): Permissions (Get, List, Set, Delete) are configured inside the Key Vault's Access Policies blade for users/service principals. Does not integrate with standard Azure IAM.\n2. Azure role-based access control (Azure RBAC): Disables the Access Policies blade and integrates fully with ARM Access control (IAM). Allows assigning built-in roles (`Key Vault Administrator`, `Key Vault Secrets Officer`, `Key Vault Secrets User`, `Key Vault Crypto Officer`) with inheritance from Management Group or Subscription scopes.",
      "distractors": {
        "A": "Vault access policies use custom vault ACLs, not Azure IAM roles.",
        "B": "Shared Key authentication does not exist for Key Vault.",
        "C": "Anonymous access is impossible on Key Vault."
      },
      "heuristic": "Manage Key Vault data plane via IAM blade = 'Azure role-based access control' permission model.",
      "msLearnUrl": "https://learn.microsoft.com/azure/key-vault/general/rbac-guide",
      "errorJournalRef": "AR PT02 Q4"
    }
  },
  {
    "id": "e2-q39",
    "examNumber": 2,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Bicep Modules: Outputs & Inter-Module Resource Referencing",
    "scenario": "You are modularizing your infrastructure-as-code deployments using Bicep. You have two Bicep files:\n1. `network.bicep`: Deploys a Virtual Network and outputs the Subnet Resource ID: `output subnetId string = subnet.id`.\n2. `main.bicep`: Orchestrates the deployment, calling the network module and a virtual machine module.\n\nHow should `main.bicep` pass the subnet ID output from the network module into the virtual machine module?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Reference `networkModule.outputs.subnetId` inside the parameters block of the VM module."
      },
      {
        "id": "B",
        "text": "Execute a `Get-AzVirtualNetwork` cmdlet inside the Bicep template."
      },
      {
        "id": "C",
        "text": "Hardcode the ARM resource ID string inside main.bicep."
      },
      {
        "id": "D",
        "text": "Use the `@secure()` decorator on the network module declaration."
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A is correct.",
      "triggerConstraints": "Requirement: Pass an output from one Bicep module to another in main.bicep.",
      "flawedMentalModel": "Assuming PowerShell cmdlets can run inside Bicep files, or hardcoding resource IDs.",
      "coreMechanic": "In Bicep:\n1. Modules declare outputs using the `output` keyword: `output subnetId string = subnet.id`.\n2. When consuming the module in an orchestrator file (`main.bicep`), you reference the output using `<moduleSymbolicName>.outputs.<outputName>` (e.g. `networkModule.outputs.subnetId`).\n3. Bicep automatically builds an internal dependency graph, ensuring `networkModule` deploys before the VM module without requiring explicit `dependsOn` declarations.",
      "distractors": {
        "B": "PowerShell cmdlets cannot be executed inside declarative Bicep files.",
        "C": "Hardcoding defeats the purpose of modular infrastructure-as-code.",
        "D": "@secure() is a decorator for hiding passwords/secrets from deployment history, not passing outputs."
      },
      "heuristic": "Bicep inter-module data flow: Declare `output` in child module -> Consume via `<moduleName>.outputs.<property>` in parent.",
      "msLearnUrl": "https://learn.microsoft.com/azure/azure-resource-manager/bicep/modules#outputs",
      "errorJournalRef": "council-report-2026-11-07-bicep-endpoints.html"
    }
  },
  {
    "id": "e2-q40",
    "examNumber": 2,
    "domain": "Domain 5: Monitor and maintain Azure resources",
    "domainCode": 5,
    "topic": "Recovery Services Vault Cross-Region Restore (CRR)",
    "scenario": "You have production virtual machines in `East US` protected by an Azure Recovery Services Vault. The vault's backup storage redundancy is set to **Geo-redundant storage (GRS)**.\n\nManagement requires that in the event of an outage in `East US`, the disaster recovery team must be able to restore the VMs into the paired region (`West US`) **at any time, even if Microsoft has not declared an official primary region disaster**.\n\nWhich feature must be enabled on the Recovery Services Vault?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Zone-Redundant Storage (ZRS)"
      },
      {
        "id": "B",
        "text": "Cross-Region Restore (CRR)"
      },
      {
        "id": "C",
        "text": "Customer-Managed Failover"
      },
      {
        "id": "D",
        "text": "Enhanced Policy Multi-Snapshot"
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B (Cross-Region Restore) is correct.",
      "triggerConstraints": "Requirement: Restore backups in paired secondary region at any time without waiting for Microsoft to declare a regional outage.",
      "flawedMentalModel": "Assuming standard GRS allows secondary restore without Microsoft declaring an outage, or confusing storage failover with backup restore.",
      "coreMechanic": "Cross-Region Restore (CRR) in Recovery Services Vault:\n1. Standard GRS Vault: Backups replicate to the secondary paired region, BUT you can only restore in the secondary region if Microsoft officially declares a primary region outage.\n2. Cross-Region Restore (CRR): When enabled on a GRS vault, CRR allows restoring VMs and disks in the secondary paired region AT ANY TIME (even for disaster recovery testing drills, or before Microsoft declares an outage).",
      "distractors": {
        "A": "ZRS replicates across availability zones within the same region, not cross-region.",
        "C": "Customer-managed failover is a storage account feature, not a Recovery Services Vault feature.",
        "D": "Enhanced policy manages snapshot frequency, not cross-region restore availability."
      },
      "heuristic": "Restore Azure VM backups in paired region at any time without Microsoft outage declaration = Cross-Region Restore (CRR).",
      "msLearnUrl": "https://learn.microsoft.com/azure/backup/backup-azure-arm-restore-vms#cross-region-restore",
      "errorJournalRef": "Q12"
    }
  },
  {
    "id": "e2-q41",
    "examNumber": 2,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Microsoft Entra Administrative Units (AUs) Delegation",
    "scenario": "Your organization has offices in New York and London. You have a local IT helpdesk team in London.\n\nYou need to delegate permissions to the London helpdesk team so they can reset passwords and update phone numbers for **London office employees only**.\n\nThey must NOT be able to modify user accounts in New York, and must NOT have directory-wide administrative roles.\n\nWhat should you configure in Microsoft Entra ID?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Assign the Helpdesk Administrator role at the Subscription scope with an Azure Policy denying access to US users."
      },
      {
        "id": "B",
        "text": "Create a Dynamic Security Group and assign the User Administrator directory role to the group."
      },
      {
        "id": "C",
        "text": "Create an Administrative Unit (AU) named 'London AU', add London users to it, and assign the 'Helpdesk Administrator' role scoped to the Administrative Unit."
      },
      {
        "id": "D",
        "text": "Deploy an on-premises Active Directory Domain Services forest and configure Entra Connect Cloud Sync."
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C (Administrative Unit) is correct.",
      "triggerConstraints": "Requirement: Delegate user management (password reset) for a specific regional subset of users without tenant-wide permissions.",
      "flawedMentalModel": "Assigning directory roles globally or attempting to use Azure Resource Manager subscriptions to govern Entra ID user objects.",
      "coreMechanic": "Microsoft Entra Administrative Units (AUs):\n1. Purpose: Provides regional or departmental administrative boundaries within a single Entra ID tenant.\n2. Delegation: You create an Administrative Unit (e.g. 'London AU'), add users/groups/devices to it, and assign Entra ID roles (such as `Helpdesk Administrator` or `User Administrator`) SCOPED strictly to that Administrative Unit. Role assignees can only manage objects inside that specific AU.",
      "distractors": {
        "A": "Subscription scopes apply to Azure resources (VMs, storage), not Entra ID user objects.",
        "B": "Assigning User Administrator to a group gives all members directory-wide permissions over ALL users in the tenant.",
        "D": "On-prem AD forests add unnecessary infrastructure and do not solve cloud delegation."
      },
      "heuristic": "Delegate Entra ID admin permissions to a specific subset/department of users = Administrative Units (AUs).",
      "msLearnUrl": "https://learn.microsoft.com/entra/identity/role-based-access-control/administrative-units",
      "errorJournalRef": "entra-id-master-architecture-and-governance.md"
    }
  },
  {
    "id": "e2-q42",
    "examNumber": 2,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Entra B2B External Identities: Cross-Tenant Access Settings & Trust MFA",
    "scenario": "Your enterprise collaborates with a partner organization (`fabrikam.com`). You invite 50 external users from `fabrikam.com` as guest users into your Microsoft Entra ID tenant to access internal Azure resources.\n\nYour Conditional Access policies require Multi-Factor Authentication (MFA) for all resource access. Fabrikam users already perform MFA within their home Entra ID tenant using hardware FIDO2 keys.\n\nYou want Fabrikam guest users to satisfy your tenant's MFA requirement using their home tenant's MFA claims, so they are not prompted to register a second MFA device in your tenant.\n\nWhere should you configure this setting?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Under Password reset -> Authentication methods, enable FIDO2 security keys for guest users."
      },
      {
        "id": "B",
        "text": "Assign the Guest Inviter role to all 50 Fabrikam users."
      },
      {
        "id": "C",
        "text": "Create an Azure B2C tenant and configure an OpenID Connect federation."
      },
      {
        "id": "D",
        "text": "Under External Identities -> Cross-tenant access settings, add fabrikam.com and check 'Trust multi-factor authentication from Microsoft Entra tenants' in Inbound trust settings."
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D is correct.",
      "triggerConstraints": "Requirement: Accept MFA claims from partner tenant (fabrikam.com) without requiring double MFA registration.",
      "flawedMentalModel": "Attempting to configure SSPR settings or creating separate B2C tenants.",
      "coreMechanic": "Microsoft Entra Cross-Tenant Access Settings:\n1. Location: Microsoft Entra ID -> External Identities -> Cross-tenant access settings.\n2. Inbound Trust Settings: You can add specific partner domains (e.g. fabrikam.com) and enable Trust Settings: 'Trust multi-factor authentication from Microsoft Entra tenants'.\n3. Result: When a Fabrikam user presents an MFA token issued by their home tenant, your tenant accepts the claim to satisfy your Conditional Access MFA requirements, providing a seamless user experience.",
      "distractors": {
        "A": "SSPR settings manage password resets, not accepting external partner MFA claims.",
        "B": "Guest Inviter allows inviting more users; it does not trust external MFA tokens.",
        "C": "Azure B2C is for consumer customer apps, not enterprise B2B partner collaboration."
      },
      "heuristic": "Trust partner tenant's MFA = Cross-tenant access settings -> Inbound trust settings -> 'Trust multi-factor authentication'.",
      "msLearnUrl": "https://learn.microsoft.com/entra/external-id/cross-tenant-access-settings-b2b-collaboration#to-change-inbound-trust-settings-for-mfa-and-device-claims",
      "errorJournalRef": "scenario_01_deep_dive.md"
    }
  },
  {
    "id": "e2-q43",
    "examNumber": 2,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "Availability Sets: Fault Domains vs. Update Domains Architecture",
    "scenario": "You deploy an Availability Set named `avail-crm` in an Azure region that supports up to 3 Fault Domains.\n\nYou configure `avail-crm` with the maximum supported number of **Fault Domains** and **Update Domains**.\n\nWhat are the maximum values you can configure?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "3 Fault Domains and 20 Update Domains"
      },
      {
        "id": "B",
        "text": "5 Fault Domains and 10 Update Domains"
      },
      {
        "id": "C",
        "text": "2 Fault Domains and 5 Update Domains"
      },
      {
        "id": "D",
        "text": "10 Fault Domains and 50 Update Domains"
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A (3 Fault Domains and 20 Update Domains) is correct.",
      "triggerConstraints": "Requirement: Identify maximum supported Fault Domains and Update Domains in an Azure Availability Set.",
      "flawedMentalModel": "Confusing Fault Domains (physical racks with shared power/switch, max 2 or 3) with Update Domains (reboot groups during planned host patching, max 20).",
      "coreMechanic": "Azure Availability Set Limits:\n1. Fault Domains (FD): Represent physical racks in the datacenter sharing common power sources and network switches. Maximum is **3** (or 2 in certain regions). Protects against unplanned hardware failures.\n2. Update Domains (UD): Logical groups of underlying physical hardware that can be rebooted simultaneously during Azure planned platform maintenance. Maximum is **20** (default is 5).",
      "distractors": {
        "B": "Fault domains cannot exceed 3 in any Azure region.",
        "C": "2 and 5 are default minimums, not maximums.",
        "D": "10 and 50 exceed platform architectural limits."
      },
      "heuristic": "Availability Set Limits: Maximum 3 Fault Domains (unplanned hardware) and Maximum 20 Update Domains (planned patching).",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machines/availability-set-overview",
      "errorJournalRef": "azure_placement_and_boundary_matrix.md"
    }
  },
  {
    "id": "e2-q44",
    "examNumber": 2,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "Proximity Placement Groups (PPG) for Ultra-Low Latency",
    "scenario": "You are deploying a high-frequency trading application across a multi-tier virtual machine architecture (Web tier, Application tier, and Database tier) in `East US`.\n\nThe application requires the **lowest possible network latency (sub-millisecond)** between all virtual machines across all tiers.\n\nWhich Azure deployment construct should you implement?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Deploy each tier into a different Availability Zone."
      },
      {
        "id": "B",
        "text": "Deploy all virtual machines into a single Proximity Placement Group (PPG)."
      },
      {
        "id": "C",
        "text": "Deploy an Azure Traffic Manager profile in Performance routing mode."
      },
      {
        "id": "D",
        "text": "Create an Availability Set with 3 Fault Domains."
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B (Proximity Placement Group) is correct.",
      "triggerConstraints": "Requirement: Achieve lowest possible network latency between VMs across multiple tiers.",
      "flawedMentalModel": "Selecting Availability Zones (Option A). Availability Zones are physically separated datacenters (miles apart) that increase network latency between zones.",
      "coreMechanic": "Proximity Placement Groups (PPG):\n1. A logical grouping constraint used to ensure Azure compute resources are physically located close to each other within the same physical datacenter.\n2. Colocating VMs, Availability Sets, or VMSS within the same PPG guarantees minimum physical distance between servers, delivering the lowest possible network latency for inter-tier communication.",
      "distractors": {
        "A": "Availability Zones introduce inter-datacenter latency (typically 1-2 ms), violating low latency requirements.",
        "C": "Traffic Manager is DNS-based and routes client internet traffic, not inter-tier VM traffic.",
        "D": "Availability Sets separate VMs across physical racks to avoid single points of failure, which does not optimize for minimum latency."
      },
      "heuristic": "Sub-millisecond inter-VM network latency = Proximity Placement Group (PPG). Availability Zones = High Availability, NOT lowest latency.",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machines/co-location",
      "errorJournalRef": "azure_placement_and_boundary_matrix.md"
    }
  },
  {
    "id": "e2-q45",
    "examNumber": 2,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "Storage Account Customer-Managed Failover Mechanics",
    "scenario": "You initiate an unplanned **Customer-Managed Failover** for an Azure Storage account named `stdataeus` that was originally deployed with Geo-redundant storage (GRS) in `East US` (paired with `West US`).\n\nThe failover operation completes successfully. `West US` is now the primary region for the storage account.\n\nWhat is the new storage redundancy configuration of `stdataeus` immediately after the failover completes?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Geo-redundant storage (GRS) replicating back to East US"
      },
      {
        "id": "B",
        "text": "Read-Access Geo-Redundant Storage (RA-GRS) in West US"
      },
      {
        "id": "C",
        "text": "Locally Redundant Storage (LRS) in West US"
      },
      {
        "id": "D",
        "text": "Zone-Redundant Storage (ZRS) in West US"
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C (LRS in West US) is correct.",
      "triggerConstraints": "Requirement: Redundancy state of a storage account immediately following customer failover.",
      "flawedMentalModel": "Assuming the storage account automatically remains GRS and fails back, or replicates back to the degraded primary region automatically.",
      "coreMechanic": "Customer-Managed Failover for Azure Storage:\n1. When failover is executed, DNS endpoints for the storage account are updated to point to the secondary region (`West US`), making it the new primary.\n2. Converted to LRS: Because the original primary region (`East US`) may be completely offline or unavailable, Azure CANNOT replicate to it. Therefore, the account's redundancy is automatically converted to **Locally Redundant Storage (LRS)** in the new primary region.\n3. Failback: To re-establish geo-replication, an administrator must manually convert the account back to GRS or RA-GRS after the original region recovers.",
      "distractors": {
        "A": "Azure cannot replicate to a potentially damaged or offline region automatically.",
        "B": "RA-GRS requires an active secondary region, which does not exist after failover converts to LRS.",
        "D": "Failover does not convert storage to ZRS unless explicitly reconfigured."
      },
      "heuristic": "Storage Customer Failover: Secondary becomes primary, and redundancy AUTOMATICALLY CONVERTS TO LRS!",
      "msLearnUrl": "https://learn.microsoft.com/azure/storage/common/storage-initiate-account-failover#how-an-unplanned-failover-works",
      "errorJournalRef": "Q12"
    }
  },
  {
    "id": "e2-q46",
    "examNumber": 2,
    "domain": "Domain 5: Monitor and maintain Azure resources",
    "domainCode": 5,
    "topic": "Azure Monitor: Metric Alerts vs. Log Search Alerts Statefulness",
    "scenario": "You are designing monitoring alert rules in Azure Monitor. You have two alerting requirements:\n1. Alert 1: Trigger an alert when VM CPU Percentage > 90% and automatically resolve the alert when CPU drops below 90%.\n2. Alert 2: Trigger an alert when a specific event ID (`EventID 4625` - Failed Logon) appears in Windows Security logs more than 5 times in 10 minutes.\n\nWhich Azure Monitor alert rule types should you create for Alert 1 and Alert 2?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Alert 1: Activity Log Alert rule; Alert 2: Metric Alert rule"
      },
      {
        "id": "B",
        "text": "Alert 1: Log Search Alert rule; Alert 2: Metric Alert rule"
      },
      {
        "id": "C",
        "text": "Alert 1: Service Health Alert rule; Alert 2: Activity Log Alert rule"
      },
      {
        "id": "D",
        "text": "Alert 1: Metric Alert rule; Alert 2: Log Search Alert rule"
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D is correct.",
      "triggerConstraints": "Requirement: Automated stateful resolution for CPU + tabular event log counting for failed logons.",
      "flawedMentalModel": "Attempting to use Metric alerts for event logs, or using Log search alerts for simple metric thresholds that require auto-resolution.",
      "coreMechanic": "Azure Monitor Alert Rule Types:\n1. Metric Alerts: Evaluate numerical metric timeseries data at frequent intervals (as frequent as 1 minute). Metric alerts are **stateful** by default: they automatically resolve (auto-mitigate) and send a resolved notification when the condition is no longer met.\n2. Log Search Alerts: Run KQL queries against log tables (e.g. `SecurityEvent | where EventID == 4625`) in Log Analytics. By default, log search alerts are stateless (they fire every time the query returns matching records within the evaluation window).",
      "distractors": {
        "A": "Activity Log alerts evaluate ARM management events, not VM CPU or Windows Security logs.",
        "B": "Inverts the proper alert types.",
        "C": "Service Health alerts track Microsoft datacenter incidents."
      },
      "heuristic": "Stateful auto-resolving threshold = Metric Alert. Querying structured logs/events = Log Search Alert (KQL).",
      "msLearnUrl": "https://learn.microsoft.com/azure/azure-monitor/alerts/alerts-types",
      "errorJournalRef": "AR PT01 Q65"
    }
  },
  {
    "id": "e2-q47",
    "examNumber": 2,
    "domain": "Domain 5: Monitor and maintain Azure resources",
    "domainCode": 5,
    "topic": "Azure Service Health vs. Azure Resource Health Scope",
    "scenario": "A production virtual machine (`vm-db-prod`) becomes unresponsive. An administrator needs to determine whether the issue is caused by:\n1. A platform-level physical hardware failure affecting this specific virtual machine instance\n2. A widespread regional outage affecting the entire Azure compute service in that region\n\nWhich two Azure monitoring features should the administrator check to differentiate between a regional platform incident and an individual resource-level issue? (Select TWO)",
    "questionType": "multiple",
    "options": [
      {
        "id": "A",
        "text": "Azure Resource Health (to inspect the individual health status of vm-db-prod)"
      },
      {
        "id": "B",
        "text": "Azure Service Health (to check for service issues, planned maintenance, and health advisories affecting the region)"
      },
      {
        "id": "C",
        "text": "Azure Cost Management export logs"
      },
      {
        "id": "D",
        "text": "Azure Application Insights Live Metrics"
      },
      {
        "id": "E",
        "text": "Microsoft Defender for Cloud security score"
      }
    ],
    "correctAnswer": [
      "A",
      "B"
    ],
    "explanation": {
      "verdict": "Options A (Azure Resource Health) and B (Azure Service Health) are correct.",
      "triggerConstraints": "Requirement: Diagnose resource-level hardware health vs broader cloud service outages.",
      "flawedMentalModel": "Assuming Service Health and Resource Health are identical services, or confusing cost management with availability diagnostics.",
      "coreMechanic": "Azure Health Services Breakdown:\n1. Azure Resource Health: Diagnoses the specific health status of an individual Azure resource (Available, Degraded, Unavailable, Unknown). Reports whether an individual VM was stopped due to platform hardware degradation, host reboot, or user action.\n2. Azure Service Health: Provides a personalized dashboard of the overall health of Azure services and regions. Displays Service Issues (active widespread datacenter outages), Planned Maintenance, and Health Advisories.",
      "distractors": {
        "C": "Cost Management tracks billing and expenses, not platform availability.",
        "D": "Application Insights monitors application code performance, not Azure infrastructure health.",
        "E": "Defender for Cloud assesses security posture and vulnerability compliance."
      },
      "heuristic": "Specific individual resource health = Resource Health. Widespread Azure region/service outage = Service Health.",
      "msLearnUrl": "https://learn.microsoft.com/azure/service-health/service-health-overview",
      "errorJournalRef": "azure_placement_and_boundary_matrix.md"
    }
  },
  {
    "id": "e2-q48",
    "examNumber": 2,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "Virtual Machine Boot Diagnostics: Managed vs. Custom Storage",
    "scenario": "You deploy an Azure Virtual Machine. During boot, the operating system hangs on a blue screen (BSOD) / kernel panic, and remote RDP/SSH sessions cannot be established.\n\nYou need to view the OS console screenshot and access the interactive Serial Console to troubleshoot the boot failure.\n\nWhich configuration allows you to view boot screenshots and access Serial Console with **zero storage account cost and zero storage configuration overhead**?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Enable Boot Diagnostics with a managed storage account (Microsoft-managed)."
      },
      {
        "id": "B",
        "text": "Enable Boot Diagnostics with a custom Premium FileStorage account."
      },
      {
        "id": "C",
        "text": "Deploy a dedicated Azure Bastion host into GatewaySubnet."
      },
      {
        "id": "D",
        "text": "Attach an unmanaged Page Blob OS disk to the VM."
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A is correct.",
      "triggerConstraints": "Requirement: View boot screenshot and access Serial Console with zero storage cost and zero configuration overhead.",
      "flawedMentalModel": "Creating a custom general-purpose storage account for boot diagnostics.",
      "coreMechanic": "Azure VM Boot Diagnostics:\n1. Managed Storage Account (Default / Recommended): Uses Microsoft-managed storage behind the scenes. Incurs $0.00 storage billing, requires zero storage account creation or lifecycle management, and provides instant access to boot console screenshots and the Azure Serial Console.\n2. Custom Storage Account: Legacy option where boot screenshots and serial logs are saved into a customer-created storage account, incurring ongoing storage fees.",
      "distractors": {
        "B": "Custom storage accounts incur additional administrative overhead and billing costs.",
        "C": "Azure Bastion connects over network RDP/SSH, which fails when the guest OS hangs during boot.",
        "D": "Unmanaged disks are deprecated and do not provide boot diagnostics."
      },
      "heuristic": "VM Boot Diagnostics & Serial Console = Enable with Managed Storage Account (zero cost, zero config).",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machines/boot-diagnostics",
      "errorJournalRef": "azure_placement_and_boundary_matrix.md"
    }
  },
  {
    "id": "e2-q49",
    "examNumber": 2,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "System-Assigned vs. User-Assigned Managed Identities Lifecycle",
    "scenario": "You are deploying a fleet of 10 virtual machines that host an identical data ingestion microservice. All 10 VMs need read access to a shared Azure Key Vault named `kv-ingest-eus`.\n\nYou want to manage role assignments efficiently and ensure that:\n1. A single managed identity can be shared across all 10 virtual machines.\n2. Deleting any individual virtual machine does NOT delete the identity or its Key Vault role assignments.\n\nWhich type of managed identity should you configure?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "System-assigned managed identity"
      },
      {
        "id": "B",
        "text": "User-assigned managed identity"
      },
      {
        "id": "C",
        "text": "Service Principal with client secret in source code"
      },
      {
        "id": "D",
        "text": "Microsoft Entra App Registration with certificate auth"
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B (User-assigned managed identity) is correct.",
      "triggerConstraints": "Requirements: Share identity across 10 VMs; identity lifecycle independent of individual VM deletions.",
      "flawedMentalModel": "Selecting System-assigned managed identity (Option A).",
      "coreMechanic": "System-Assigned vs. User-Assigned Managed Identity:\n1. System-Assigned: Created directly on a single Azure resource. Strictly 1:1 relationship. When the resource is deleted, Azure automatically deletes the identity in Entra ID.\n2. User-Assigned: Created as an independent standalone Azure resource (`Microsoft.ManagedIdentity/userAssignedIdentities`). Has an independent lifecycle. Can be assigned to MULTIPLE Azure resources (1:Many relationship). Deleting a VM leaves the identity and its RBAC assignments intact.",
      "distractors": {
        "A": "System-assigned identities cannot be shared across multiple VMs and are deleted when the VM is deleted.",
        "C": "Storing client secrets violates secretless managed identity security best practices.",
        "D": "App Registrations require manual credential rotation and maintenance."
      },
      "heuristic": "1:1 lifecycle tied to resource = System-Assigned. 1:Many standalone reusable identity = User-Assigned.",
      "msLearnUrl": "https://learn.microsoft.com/entra/identity/managed-identities-azure-resources/overview",
      "errorJournalRef": "entra-id-part1-core-architecture.md"
    }
  },
  {
    "id": "e2-q50",
    "examNumber": 2,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Azure Policy Initiatives (Policy Sets) Architecture",
    "scenario": "Your enterprise security team defines 15 distinct Azure Policy definitions to enforce compliance standards (e.g. requiring tags, restricting VM SKUs, enforcing disk encryption, and blocking public storage endpoints).\n\nYou need to assign all 15 policies to 10 different subscriptions and track their overall compliance score through a single unified compliance dashboard.\n\nWhat should you create to manage and assign these policies efficiently?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "An Azure Blueprint with 15 separate ARM template artifacts."
      },
      {
        "id": "B",
        "text": "A Management Lock with CanNotDelete applied at the Management Group root."
      },
      {
        "id": "C",
        "text": "An Azure Policy Initiative (Policy Set Definition) grouping all 15 policy definitions together."
      },
      {
        "id": "D",
        "text": "An Azure Monitor Alert Processing Rule targeting the subscriptions."
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C (Policy Initiative) is correct.",
      "triggerConstraints": "Requirement: Group 15 policies together for unified assignment across 10 subscriptions and single compliance dashboard.",
      "flawedMentalModel": "Assigning 15 policies individually 10 times (150 assignments), or confusing Initiatives with Blueprints.",
      "coreMechanic": "Azure Policy Initiative (Policy Set Definition):\n1. Purpose: Groups multiple policy definitions together as a single administrative unit.\n2. Management: You assign the single initiative to target scopes (Management Groups or Subscriptions) rather than managing individual policy assignments.\n3. Compliance Reporting: Azure Policy provides an aggregated compliance view for the initiative, allowing security teams to track overall compliance progress against frameworks like ISO 27001 or PCI DSS.",
      "distractors": {
        "A": "Azure Blueprints are for environment orchestration, not ongoing policy set definitions.",
        "B": "Management locks prevent deletion, not governance policy enforcement.",
        "D": "Alert processing rules manage notifications, not governance policies."
      },
      "heuristic": "Group multiple Azure policies into one assignment & compliance view = Azure Policy Initiative (Policy Set).",
      "msLearnUrl": "https://learn.microsoft.com/azure/governance/policy/concepts/initiative-definition-structure",
      "errorJournalRef": "entra-id-master-architecture-and-governance.md"
    }
  },
  {
    "id": "e2-q51",
    "examNumber": 2,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Cross-Subscription Resource Relocation with CanNotDelete Lock",
    "scenario": "You have an enterprise Azure environment with 'Subscription-A' (production) and 'Subscription-B' (shared services). You plan to move a standalone virtual machine named 'vm-tools01', along with its attached OS disk, data disk, and NIC, from resource group 'rg-prod-tools' in Subscription-A to 'rg-shared-tools' in Subscription-B.\n\nYou notice that 'rg-prod-tools' has a resource lock configured with the lock type 'CanNotDelete'. Neither 'rg-shared-tools' nor Subscription-B has any resource locks. You execute the resource move command.\n\nWhat is the outcome of the resource move operation?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "The move operation succeeds because a 'CanNotDelete' lock prevents deletion operations, but does NOT block moving resources across resource groups or subscriptions."
      },
      {
        "id": "B",
        "text": "The move operation fails because any lock type, including CanNotDelete, completely blocks moving resources out of a source resource group."
      },
      {
        "id": "C",
        "text": "The move operation succeeds, but the attached data disk is automatically detached and left behind in Subscription-A."
      },
      {
        "id": "D",
        "text": "The move operation fails because Azure virtual machines can only be moved across subscriptions if they are deallocated for more than 48 hours."
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A is correct.",
      "triggerConstraints": "Requirement: Move an Azure VM and its disks/NIC across subscriptions when source resource group has a CanNotDelete lock.",
      "flawedMentalModel": "Assuming CanNotDelete blocks moves (conflating CanNotDelete with ReadOnly, or believing a move constitutes a delete).",
      "coreMechanic": "Microsoft Official Resource Lock Specification:\n1. CanNotDelete (Delete lock): Prevents users from deleting a resource. Moving a resource changes its parent resource group / subscription metadata pointer in Azure Resource Manager; it does NOT delete the resource. Therefore, CanNotDelete locks do NOT block move operations!\n2. ReadOnly Lock: Prevents modifying or deleting resources. A ReadOnly lock on the source or target resource group STRICTLY BLOCKS move operations.\nBecause 'rg-prod-tools' only has a CanNotDelete lock, the move operation proceeds and succeeds.",
      "distractors": {
        "B": "Only ReadOnly locks block move operations; CanNotDelete does not block moves.",
        "C": "Moving a VM across subscriptions requires all attached disks and NICs to move together in the same batch.",
        "D": "VMs do not need 48 hours of deallocation; deallocation is required during the move, but no waiting period exists."
      },
      "heuristic": "CanNotDelete lock DOES NOT block resource moves! Only ReadOnly locks block moves.",
      "msLearnUrl": "https://learn.microsoft.com/azure/azure-resource-manager/management/lock-resources#considerations-before-applying-locks",
      "errorJournalRef": "AR PT01 Q57"
    }
  },
  {
    "id": "e2-q52",
    "examNumber": 2,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "Blob Lifecycle Management on Versioned Storage with Immutability",
    "scenario": "You are managing an Azure Blob Storage container that stores regulatory compliance documents with both Version-Level Immutability (WORM) and Blob Versioning enabled. You want to implement an automated Lifecycle Management policy that permanently deletes noncurrent blob versions once they reach 180 days past creation.\n\nYou need to ensure the lifecycle rule does not fail and complies with Azure Storage lifecycle engine requirements.\n\nHow should you define the rule filter and action?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Define a rule targeting 'baseBlobs' with action 'delete' and condition 'daysAfterLastTierChangeGreaterThan: 180'."
      },
      {
        "id": "B",
        "text": "Define a rule targeting 'version' with action 'delete' and condition 'daysAfterCreationGreaterThan: 180'."
      },
      {
        "id": "C",
        "text": "Define a rule targeting 'snapshots' with action 'tierToArchive' and condition 'daysAfterLastModifiedGreaterThan: 180'."
      },
      {
        "id": "D",
        "text": "Define a rule targeting 'version' with action 'tierToCool' and condition 'daysAfterLastAccessTimeGreaterThan: 180'."
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B is correct.",
      "triggerConstraints": "Requirement: Define a lifecycle management rule to delete noncurrent blob versions after 180 days on a container with versioning.",
      "flawedMentalModel": "Targeting baseBlobs instead of version, or attempting to use 'daysAfterLastAccessTimeGreaterThan' on versions.",
      "coreMechanic": "Azure Blob Lifecycle Management Rule Specification:\n1. Rule Target: When managing noncurrent versions generated by blob updates or deletions, the rule target MUST specify 'version' (not 'baseBlobs' or 'snapshots').\n2. Allowed Conditions for Versions: The ONLY condition supported for deleting blob versions is 'daysAfterCreationGreaterThan'. Azure does not maintain last-modified or last-access-time metadata independently for noncurrent versions.\n3. Once the 180-day threshold and any legal hold/retention period expires, the lifecycle engine automatically purges the noncurrent version.",
      "distractors": {
        "A": "Targeting baseBlobs deletes active current blobs rather than noncurrent versions.",
        "C": "Snapshots are point-in-time read-only copies created manually, not automated version history.",
        "D": "daysAfterLastAccessTimeGreaterThan is not supported for blob versions."
      },
      "heuristic": "Lifecycle management rules on blob versions ONLY support 'daysAfterCreationGreaterThan'!",
      "msLearnUrl": "https://learn.microsoft.com/azure/storage/blobs/lifecycle-management-overview#rule-actions",
      "errorJournalRef": "AR PT02 Q5"
    }
  },
  {
    "id": "e2-q53",
    "examNumber": 2,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "Azure Disk Encryption (ADE) Prerequisites vs. Key Vault Permission Models",
    "scenario": "You need to enable Azure Disk Encryption (ADE) on several Linux virtual machines using dm-crypt. You create a new Azure Key Vault named 'kv-ade-westus2'. During configuration of the Key Vault, you must select the Permission Model and access policies.\n\nHow must the Key Vault be configured to successfully support Azure Disk Encryption?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Configure Azure RBAC permission model, and assign the VMs' managed identities the Key Vault Secrets Officer role."
      },
      {
        "id": "B",
        "text": "Configure Vault Access Policy permission model, but leave all resource access flags disabled for security."
      },
      {
        "id": "C",
        "text": "Configure Vault Access Policy permission model, enable the 'Azure Disk Encryption for volume encryption' flag, and ensure soft-delete and purge protection are enabled."
      },
      {
        "id": "D",
        "text": "Configure Azure RBAC permission model, and create a Disk Encryption Set linked to the Key Vault."
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C is correct.",
      "triggerConstraints": "Requirement: Configure Key Vault prerequisites specifically for Azure Disk Encryption (ADE).",
      "flawedMentalModel": "Confusing Azure Disk Encryption (ADE) with Server-Side Encryption with Customer-Managed Keys (SSE-CMK).",
      "coreMechanic": "Azure Disk Encryption (ADE) Key Vault Prerequisites:\n1. Permission Model: ADE requires the Vault Access Policy permission model (or explicit access policies). The 'Azure Disk Encryption for volume encryption' flag (PowerShell: -EnabledForDiskEncryption) MUST be enabled to allow Microsoft.Compute to fetch secrets at VM boot.\n2. Security Flags: Soft-delete and purge protection MUST be enabled.\n3. Location: Key Vault must be in the exact same region and subscription as the VMs.\nNote: Disk Encryption Sets (DES) and RBAC are used for SSE-CMK, NOT for ADE.",
      "distractors": {
        "A": "ADE relies on Key Vault access policy volume encryption flags rather than VM managed identities.",
        "B": "Leaving resource access flags disabled will prevent Microsoft.Compute from retrieving BitLocker/DM-Crypt keys at boot.",
        "D": "Disk Encryption Sets are for SSE-CMK, not Azure Disk Encryption (ADE)."
      },
      "heuristic": "ADE requires: Vault Access Policy + 'Azure Disk Encryption for volume encryption' flag enabled!",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machines/linux/disk-encryption-key-vault",
      "errorJournalRef": "AR PT02 Q4"
    }
  },
  {
    "id": "e2-q54",
    "examNumber": 2,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "Application Security Groups (ASGs) Across Peered VNets Boundary",
    "scenario": "You have a hub-and-spoke network architecture with two peered virtual networks in the same Azure region: 'vnet-hub' and 'vnet-spoke1'.\n\nYou create an Application Security Group named 'asg-db' in 'rg-spoke1'. You attach the NICs of two backend database VMs in 'vnet-spoke1' to 'asg-db'. You then attempt to attach the NIC of a proxy VM located in 'vnet-hub' to the same 'asg-db' group.\n\nThe Azure Portal and CLI reject the operation.\n\nWhat is the fundamental constraint governing Application Security Groups in Azure?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "An ASG can only contain up to two network interfaces across the entire subscription."
      },
      {
        "id": "B",
        "text": "Application Security Groups can only be applied to Windows virtual machines, not Linux VMs."
      },
      {
        "id": "C",
        "text": "ASGs require Azure Firewall Premium to be deployed in the hub virtual network."
      },
      {
        "id": "D",
        "text": "All network interfaces assigned to an Application Security Group MUST exist within the exact same Virtual Network; ASGs cannot span across peered VNets."
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D is correct.",
      "triggerConstraints": "Requirement: Understand ASG boundary constraints across peered Virtual Networks.",
      "flawedMentalModel": "Assuming that because VNets are peered and in the same region, ASGs can group NICs across both VNets.",
      "coreMechanic": "Application Security Group (ASG) Boundaries:\n1. An ASG is an Azure resource that allows grouping network interfaces under a common application tag for NSG rule definitions.\n2. Strict VNet Boundary: All network interfaces (NICs) assigned to an ASG MUST reside within the exact same Virtual Network.\n3. ASGs CANNOT span across Virtual Networks, even if the VNets are in the same region, same resource group, and interconnected via VNet Peering.\nTo control traffic between peered VNets, you must reference IP prefixes or deploy separate ASGs inside each VNet.",
      "distractors": {
        "A": "ASGs can contain thousands of NICs within the same VNet.",
        "B": "ASGs are OS-agnostic and apply to both Windows and Linux NICs.",
        "C": "ASGs are an SDN feature of Network Security Groups and do not require Azure Firewall."
      },
      "heuristic": "All NICs in an Application Security Group (ASG) MUST reside in the same Virtual Network! ASGs cannot cross VNet boundaries.",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-network/application-security-groups#allow-database-access",
      "errorJournalRef": "azure_placement_and_boundary_matrix.md"
    }
  },
  {
    "id": "e2-q55",
    "examNumber": 2,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Bicep Multi-Scope Resource Group and Resource Deployment",
    "scenario": "You are creating an enterprise landing zone deployment in Bicep. You need a single Bicep template execution to create a new Resource Group named 'rg-network-prod' in the 'East US' region, and subsequently deploy a Virtual Network into that newly created Resource Group.\n\nHow should you structure your Bicep files to achieve this multi-scope deployment?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Set 'targetScope = \\'subscription\\'' in the main Bicep file, create the resource group resource, and declare a module targeting that resource group using 'scope: resourceGroup(\\'rg-network-prod\\')' to deploy the VNet."
      },
      {
        "id": "B",
        "text": "Set 'targetScope = \\'resourceGroup\\'' in the main Bicep file, and use the 'new' keyword to instantiate the resource group before declaring the VNet."
      },
      {
        "id": "C",
        "text": "Create an ARM JSON template with 'mode: Complete' and nest the resource group creation inside a tenant-level deployment."
      },
      {
        "id": "D",
        "text": "Set 'targetScope = \\'managementGroup\\'' and deploy both the resource group and VNet directly without using modules."
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A is correct.",
      "triggerConstraints": "Requirement: Deploy both a new Resource Group and child resources (VNet) in a single Bicep execution.",
      "flawedMentalModel": "Attempting to create a Resource Group within a resourceGroup-scoped template.",
      "coreMechanic": "Multi-Scope Deployments in Bicep:\n1. A Resource Group cannot be created at the 'resourceGroup' scope; it must be created at the 'subscription' scope.\n2. In 'main.bicep', declare 'targetScope = \\'subscription\\' and define the resource group: 'resource newRG \\'Microsoft.Resources/resourceGroups@2021-04-01\\' = { ... }'.\n3. To deploy resources (like a Virtual Network) into the newly created resource group, declare a module referencing your network Bicep file and supply the cross-scope property: 'scope: resourceGroup(newRG.name)'.",
      "distractors": {
        "B": "resourceGroup scope cannot create resource groups, and Bicep does not have a 'new' keyword.",
        "C": "ARM JSON templates do not simplify multi-scope orchestration compared to native Bicep.",
        "D": "Management group scope cannot deploy VNets directly without subscription and resource group delegation modules."
      },
      "heuristic": "Deploy Resource Group + Resources in Bicep: targetScope = 'subscription' in main + module with scope: resourceGroup(...).",
      "msLearnUrl": "https://learn.microsoft.com/azure/azure-resource-manager/bicep/deploy-to-resource-group?tabs=azure-cli#cross-resource-group-deployment",
      "errorJournalRef": "council-report-2026-11-07-bicep-endpoints.html"
    }
  },
  {
    "id": "e2-q56",
    "examNumber": 2,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "Azure Files Share Snapshot Retention & 4-Hour Frequency Mechanics",
    "scenario": "You configure Azure Backup for an Azure Files share in a Recovery Services Vault. The backup policy is configured with an Hourly frequency of every 4 hours starting at 00:00 UTC, with daily retention set to 30 days.\n\nWhich statement accurately describes how Azure Backup executes and stores these backups?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Azure Backup transfers the full file contents over the internet to the Recovery Services Vault storage every 4 hours."
      },
      {
        "id": "B",
        "text": "Azure Backup creates native Azure Files share snapshots in the same storage account every 4 hours, and retains up to the configured snapshot retention limit without transferring data across regions."
      },
      {
        "id": "C",
        "text": "Azure Backup shuts down the SMB service temporarily during each 4-hour window to ensure crash-consistent data transfer."
      },
      {
        "id": "D",
        "text": "Azure Backup converts the file share into an append blob container before creating daily differential backups."
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B is correct.",
      "triggerConstraints": "Requirement: Understand how Azure Backup executes scheduled hourly Azure Files backups.",
      "flawedMentalModel": "Assuming Azure Backup copies file share data into the Recovery Services Vault storage pool like it does for VM disks.",
      "coreMechanic": "Azure Files Backup Architecture in Recovery Services Vault:\n1. Snapshot-Based: Azure Backup orchestrates and schedules native Azure Files share snapshots. The snapshots are stored directly within the source storage account.\n2. No Cross-Region Data Transfer: Scheduled backups do not transfer file payload into the vault's storage tiers; they trigger instantaneous differential snapshots in-place.\n3. Management & Retention: The Recovery Services Vault manages pruning and lifecycle retention according to the backup policy rules.",
      "distractors": {
        "A": "File share data is not copied over the internet or transferred to vault storage during snapshot creation.",
        "C": "Azure Files snapshots are instantaneous and non-disruptive; SMB access remains continuous.",
        "D": "Azure Files shares are never converted into blob containers."
      },
      "heuristic": "Azure Files backup takes native share snapshots locally in the storage account—data does not leave the storage account!",
      "msLearnUrl": "https://learn.microsoft.com/azure/backup/azure-file-share-backup-overview",
      "errorJournalRef": "AR PT02 Q62"
    }
  },
  {
    "id": "e2-q57",
    "examNumber": 2,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "Azure Container Apps: Linux Container Constraint & Ingress Architecture",
    "scenario": "A development team has two microservices:\n1. 'svc-orders': Built on .NET 8 running in a Linux Alpine container image.\n2. 'svc-reports': Built on legacy .NET Framework 4.7.2 running in a Windows Server container image.\n\nThe team requests deploying both microservices to an existing Azure Container Apps (ACA) environment ('cae-prod') with HTTP ingress and automated horizontal scaling.\n\nWhat must you advise the team regarding Azure Container Apps support?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Both microservices can be deployed directly to Azure Container Apps by configuring a multi-container app revision."
      },
      {
        "id": "B",
        "text": "Neither microservice can run in Azure Container Apps unless migrated to an Azure Red Hat OpenShift cluster."
      },
      {
        "id": "C",
        "text": "Azure Container Apps only supports Linux-based container images; 'svc-orders' can be deployed to ACA, but 'svc-reports' must be hosted on an alternative service like Azure Container Instances (ACI) or App Service for Windows Containers."
      },
      {
        "id": "D",
        "text": "Azure Container Apps supports Windows containers only if the container environment is deployed with Internal Ingress enabled."
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C is correct.",
      "triggerConstraints": "Requirement: Identify platform OS support for Azure Container Apps (ACA) with Linux and Windows containers.",
      "flawedMentalModel": "Assuming Azure Container Apps supports both Windows and Linux container runtimes like ACI does.",
      "coreMechanic": "Azure Container Apps (ACA) Platform Constraints:\n1. Underlying Node Pool: Azure Container Apps worker nodes run strictly on Linux.\n2. Operating System Support: ACA supports Linux-based container images exclusively. It has NO support for Windows Server container images.\n3. Alternative Hosting: To host Windows containers in a containerized environment without managing full VM infrastructure, you must use Azure Container Instances (ACI) or Azure App Service for Containers (Windows plan).",
      "distractors": {
        "A": "ACA cannot run Windows containers even in multi-container revisions.",
        "B": "Linux microservices run natively on ACA without OpenShift.",
        "D": "Internal Ingress has no bearing on underlying container OS support."
      },
      "heuristic": "Azure Container Apps (ACA) supports LINUX containers ONLY! Windows containers must use ACI or App Service Windows.",
      "msLearnUrl": "https://learn.microsoft.com/azure/container-apps/containers",
      "errorJournalRef": "AR PT02 Q15"
    }
  },
  {
    "id": "e2-q58",
    "examNumber": 2,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "AzureBastionSubnet Inbound & Outbound Mandatory NSG Rules",
    "scenario": "You are applying a Network Security Group named 'nsg-bastion' to the dedicated 'AzureBastionSubnet' subnet. The security compliance team wants to restrict all traffic to the minimum mandatory rules required for Azure Bastion to function.\n\nWhich inbound security rule MUST be present on the NSG associated with 'AzureBastionSubnet' to allow administrative users to connect to the Bastion host from the public internet?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Inbound from Internet on TCP port 3389 and 22."
      },
      {
        "id": "B",
        "text": "Inbound from VirtualNetwork on TCP port 80."
      },
      {
        "id": "C",
        "text": "Inbound from Any on UDP port 500 and 4500."
      },
      {
        "id": "D",
        "text": "Inbound from Internet (or client public IPs) on TCP port 443."
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D is correct.",
      "triggerConstraints": "Requirement: Identify mandatory inbound NSG security rules for AzureBastionSubnet.",
      "flawedMentalModel": "Thinking administrative users connect to Azure Bastion via RDP/SSH ports (3389/22) over the public internet.",
      "coreMechanic": "Azure Bastion Inbound NSG Requirements:\n1. User Traffic: Administrative users connect to Azure Bastion via their web browser or native client over HTTPS on TCP port 443. Therefore, an Inbound rule allowing TCP 443 from Internet (or admin public IPs) is MANDATORY.\n2. Control Plane Traffic: Inbound TCP 443 from 'GatewayManager' service tag is also required for health monitoring.\n3. Azure Load Balancer: Inbound TCP 443 from 'AzureLoadBalancer' service tag.\nNote: Outbound from AzureBastionSubnet to the target VM subnet uses TCP 3389 (RDP) and TCP 22 (SSH).",
      "distractors": {
        "A": "RDP (3389) and SSH (22) inbound from Internet are blocked; users connect to Bastion over HTTPS (443).",
        "B": "Port 80 is unencrypted HTTP and not used by Azure Bastion.",
        "C": "UDP 500 and 4500 are for IPsec VPN tunnels, not Azure Bastion."
      },
      "heuristic": "AzureBastionSubnet Inbound from user/Internet = TCP 443! Outbound to target VMs = TCP 3389/22.",
      "msLearnUrl": "https://learn.microsoft.com/azure/bastion/bastion-nsg",
      "errorJournalRef": "AR PT02 Q25"
    }
  },
  {
    "id": "e2-q59",
    "examNumber": 2,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Microsoft Entra ID Role-Assignable Groups Security Architecture",
    "scenario": "You are designing privileged role delegation in Microsoft Entra ID. You need to assign the 'User Administrator' Entra ID role to a group so that helpdesk team leads can manage user accounts. To prevent unauthorized privilege escalation, you want to ensure that only authorized administrators can modify the membership of this group.\n\nWhat setting must be configured when creating the security group in Entra ID?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Set 'Microsoft Entra roles can be assigned to the group' to 'Yes' during group creation (this setting cannot be changed after creation)."
      },
      {
        "id": "B",
        "text": "Create a standard dynamic user group with a query filter matching JobTitle eq 'Team Lead'."
      },
      {
        "id": "C",
        "text": "Create a Microsoft 365 group and assign the Key Vault Crypto Officer role to the group owner."
      },
      {
        "id": "D",
        "text": "Configure an Administrative Unit and assign the User Administrator role to all members of a standard security group."
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A is correct.",
      "triggerConstraints": "Requirement: Assign an Entra ID privileged role to a security group with protection against unauthorized privilege escalation.",
      "flawedMentalModel": "Attempting to assign Entra directory roles to dynamic membership groups, or assuming any standard group can hold directory roles.",
      "coreMechanic": "Role-Assignable Groups in Microsoft Entra ID:\n1. Immutable Setting: When creating the group, you MUST set 'Microsoft Entra roles can be assigned to the group' to 'Yes' (isAssignableToRole: true). This property CANNOT be modified after group creation.\n2. Security Protection: Only Global Administrators and Privileged Role Administrators can create these groups and modify their membership or ownership.\n3. Membership Constraint: Role-assignable groups CANNOT use dynamic membership rules (membership must be Assigned).",
      "distractors": {
        "B": "Dynamic membership groups CANNOT be assigned Microsoft Entra directory roles.",
        "C": "Microsoft 365 groups are for collaboration, and Key Vault roles do not govern Entra directory roles.",
        "D": "Assigning roles to individual members directly does not fulfill the requirement of group-based role management."
      },
      "heuristic": "Role-assignable groups in Entra ID: Must set 'Microsoft Entra roles can be assigned to the group' = Yes AT CREATION (immutable); Assigned membership only!",
      "msLearnUrl": "https://learn.microsoft.com/entra/identity/role-based-access-control/groups-concept",
      "errorJournalRef": "entra-id-part2-advanced-identity.md"
    }
  },
  {
    "id": "e2-q60",
    "examNumber": 2,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "Azure Private Endpoints & Private DNS Zone Resolution",
    "scenario": "You manage an enterprise environment where an Azure Storage account named `stfinancedata` in `East US` hosts sensitive financial audit files. To satisfy compliance requirements, you disable public network access to `stfinancedata` and create a Private Endpoint in subnet `snet-backend` of virtual network `vnet-finance-eus` (private IP: `10.10.2.5`).\n\nYou deploy a virtual machine named `vm-analytics01` in a peered virtual network named `vnet-analytics-eus`. When scripts on `vm-analytics01` attempt to connect to `https://stfinancedata.blob.core.windows.net/audits`, connection attempts fail with an HTTP 403 Forbidden error because the FQDN resolves to a public IP address instead of `10.10.2.5`.\n\nA private DNS zone named `privatelink.blob.core.windows.net` exists in the subscription and contains an 'A' record pointing `stfinancedata` to `10.10.2.5`.\n\nWhat should you do to allow `vm-analytics01` to resolve the private IP address of the storage account?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Add a Service Endpoint for Microsoft.Storage to the subnet containing vm-analytics01 in vnet-analytics-eus."
      },
      {
        "id": "B",
        "text": "Configure a Virtual Network Link from vnet-analytics-eus to the Private DNS Zone privatelink.blob.core.windows.net."
      },
      {
        "id": "C",
        "text": "Enable DNS auto-registration on the existing Virtual Network Link between vnet-finance-eus and privatelink.blob.core.windows.net."
      },
      {
        "id": "D",
        "text": "Configure a User Defined Route (UDR) on vm-analytics01's subnet routing all traffic destined for 0.0.0.0/0 to 10.10.2.5."
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B is correct.",
      "triggerConstraints": "Requirement: Resolve storage account private endpoint IP across peered virtual networks. Constraint: Public network access is disabled on the storage account; VM resolves public IP instead of private IP.",
      "flawedMentalModel": "Believing that VNet peering automatically propagates Private DNS Zone resolution without explicitly linking each VNet, or confusing Service Endpoints with Private Endpoints.",
      "coreMechanic": "Azure Private Endpoint DNS Architecture:\n1. When a Private Endpoint is created for a storage account, Azure configures a CNAME record mapping `<account>.blob.core.windows.net` to `<account>.privatelink.blob.core.windows.net`.\n2. The Private DNS Zone `privatelink.blob.core.windows.net` contains the 'A' record mapping `<account>` to the private IP (e.g. 10.10.2.5).\n3. Any virtual network containing client VMs (including peered VNets like `vnet-analytics-eus`) MUST have a Virtual Network Link to `privatelink.blob.core.windows.net`. Without this link, VMs in that VNet query Azure public recursive resolvers, which resolve the public IP address where access is denied by the storage firewall.",
      "distractors": {
        "A": "Service Endpoints keep traffic on the Azure backbone but route to the public IP of the storage account; they do not resolve or connect to Private Endpoints.",
        "C": "Auto-registration automatically registers DNS host records for VMs created in that VNet; it does not resolve PaaS private endpoints and should NOT be enabled on private endpoint DNS zones.",
        "D": "UDRs manage packet routing, not DNS name resolution. A 0.0.0.0/0 route to the private endpoint would break internet egress and fails to resolve the private FQDN."
      },
      "heuristic": "Private Endpoints require EVERY client VNet to have a Virtual Network Link to privatelink.<service>.core.windows.net for DNS resolution to succeed!",
      "msLearnUrl": "https://learn.microsoft.com/azure/private-link/private-endpoint-dns",
      "errorJournalRef": "error_journal.md"
    }
  },
  {
    "id": "e2-q61",
    "examNumber": 2,
    "domain": "Domain 5: Monitor and maintain Azure resources",
    "domainCode": 5,
    "topic": "Azure Backup Vault Workload Boundaries: PostgreSQL Flexible Server & Managed Disks",
    "scenario": "You are planning backup policies for modern cloud workloads across your enterprise subscriptions:\n- Workload 1: Azure Database for PostgreSQL Flexible Server.\n- Workload 2: Azure Kubernetes Service (AKS) cluster persistent volumes and cluster state.\n\nYou open the Azure Portal to configure automated backups. Which backup vault architecture supports protecting these workloads?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Recovery Services Vault supports both PostgreSQL Flexible Server and AKS backups natively."
      },
      {
        "id": "B",
        "text": "Azure Backup Vault supports Azure VMs, while Recovery Services Vault supports PostgreSQL Flexible Server."
      },
      {
        "id": "C",
        "text": "Azure Backup Vault supports both Azure Database for PostgreSQL Flexible Server and AKS backups."
      },
      {
        "id": "D",
        "text": "Azure Monitor Log Analytics Workspace directly manages native PostgreSQL Flexible Server backups."
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C is correct.",
      "triggerConstraints": "Requirement: Identify vault support for modern cloud workloads (PostgreSQL Flexible Server and AKS).",
      "flawedMentalModel": "Assuming Recovery Services Vault handles all Azure backup workloads.",
      "coreMechanic": "Workload Architecture: Backup Vault vs. Recovery Services Vault:\n1. Azure Backup Vault: Created specifically for newer cloud-native workloads: Azure Database for PostgreSQL Flexible Server, Azure Managed Disks, Azure Blob Storage (operational backup), and Azure Kubernetes Service (AKS Backup).\n2. Recovery Services Vault: Reserved for traditional compute and storage workloads: Azure VMs, Azure Files shares, SQL Server / SAP HANA running in Azure VMs, and on-premises MARS/MABS backups.",
      "distractors": {
        "A": "Recovery Services Vault does not support PostgreSQL Flexible Server or AKS backups.",
        "B": "Inverts the vault roles; Backup Vault does not back up Azure VMs.",
        "D": "Log Analytics is a monitoring workspace, not a backup vault service."
      },
      "heuristic": "PostgreSQL Flexible Server, Managed Disks, and AKS Backup = Azure Backup Vault!",
      "msLearnUrl": "https://learn.microsoft.com/azure/backup/backup-vault-overview",
      "errorJournalRef": "AR PT01 Q52"
    }
  },
  {
    "id": "e2-q62",
    "examNumber": 2,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "Dedicated Subnet Sizing: AzureBastionSubnet /26 Constraint",
    "scenario": "You are preparing a Virtual Network ('vnet-corp') for an Azure Bastion deployment with the Standard SKU to support host scaling up to 50 concurrent scale units. You allocate a subnet for Azure Bastion.\n\nWhat is the minimum CIDR subnet prefix required for 'AzureBastionSubnet', and how many usable IP addresses will it provide after Azure SDN reservations?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Subnet prefix /29, providing 3 usable IP addresses."
      },
      {
        "id": "B",
        "text": "Subnet prefix /28, providing 11 usable IP addresses."
      },
      {
        "id": "C",
        "text": "Subnet prefix /27, providing 27 usable IP addresses."
      },
      {
        "id": "D",
        "text": "Subnet prefix /26, providing 59 usable IP addresses."
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D (/26, providing 59 usable IPs) is correct.",
      "triggerConstraints": "Requirement: Minimum subnet prefix and usable IP count for AzureBastionSubnet.",
      "flawedMentalModel": "Confusing GatewaySubnet (/27 minimum) or AzureFirewallManagementSubnet (/26) with Bastion requirements, or assuming /27 is sufficient for Bastion.",
      "coreMechanic": "Azure Dedicated Subnet Sizing Rules:\n1. 'AzureBastionSubnet' MUST be /26 or larger (e.g. /26, /25, /24). Microsoft documentation explicitly states: 'The subnet size must be /26 or larger to support Bastion host scaling features.'\n2. Sizing calculation for /26: Total raw IPs = 2^(32 - 26) = 64. Azure reserves 5 IPs (.0, .1, .2, .3, .63). Usable IPs = 64 - 5 = 59.",
      "distractors": {
        "A": "/29 is too small and will cause Bastion deployment failure.",
        "B": "/28 is too small (historically allowed for basic preview, but /26 is the required minimum).",
        "C": "/27 is the minimum size for GatewaySubnet and RouteServerSubnet, but AzureBastionSubnet requires /26."
      },
      "heuristic": "AzureBastionSubnet REQUIRES /26 or larger (64 total - 5 reserved = 59 usable IPs)!",
      "msLearnUrl": "https://learn.microsoft.com/azure/bastion/bastion-faq#subnet",
      "errorJournalRef": "AR PT02 Q21"
    }
  },
  {
    "id": "e2-q63",
    "examNumber": 2,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Azure Policy 'Modify' Effect & Managed Identity Remediation Tasks",
    "scenario": "You assign an Azure Policy definition that enforces tagging compliance on all newly created and existing resource groups. The policy rule uses the 'modify' effect to evaluate and add a tag named 'CostCenter: 90210' if the tag is absent.\n\nYou also need to apply this tag to 200 pre-existing resource groups that were deployed prior to policy assignment.\n\nWhat must you create to remediate the existing non-compliant resource groups, and what identity does Azure Policy use to execute the change?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Create a Remediation Task under the policy assignment; Azure Policy uses the policy assignment's Managed Identity (which must have Contributor permissions on the subscription) to apply the tag."
      },
      {
        "id": "B",
        "text": "Run an Azure Automation Runbook with an Entra ID user credential that has Owner permissions."
      },
      {
        "id": "C",
        "text": "Delete and recreate all 200 resource groups using an ARM template with Complete deployment mode."
      },
      {
        "id": "D",
        "text": "Create an Alert Processing Rule targeting the resource groups with a webhook action."
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A is correct.",
      "triggerConstraints": "Requirement: Remediate pre-existing non-compliant resources using Azure Policy 'modify' effect.",
      "flawedMentalModel": "Assuming Azure Policy automatically mutates existing resources upon assignment, or using manual automation scripts.",
      "coreMechanic": "Azure Policy Remediation Architecture:\n1. 'modify' and 'deployIfNotExists' effects automatically modify or deploy resources during CREATE or UPDATE operations.\n2. For pre-existing non-compliant resources, Azure Policy does NOT modify them automatically upon assignment. You MUST create a Remediation Task.\n3. Security Execution: The remediation task runs under the context of the Policy Assignment's Managed Identity (System-Assigned or User-Assigned), which must have appropriate RBAC permissions (e.g. Contributor or Tag Contributor) at the assignment scope.",
      "distractors": {
        "B": "Automation runbooks are unnecessary and introduce maintenance overhead; Azure Policy has built-in Remediation Tasks.",
        "C": "Deleting resource groups destroys all enclosed resources and data.",
        "D": "Alert processing rules handle notifications, not resource remediation."
      },
      "heuristic": "Remediate pre-existing resources with Azure Policy = Remediation Task using Policy Assignment Managed Identity!",
      "msLearnUrl": "https://learn.microsoft.com/azure/governance/policy/how-to/remediate-resources",
      "errorJournalRef": "entra-id-master-architecture-and-governance.md"
    }
  },
  {
    "id": "e2-q64",
    "examNumber": 2,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "Azure Virtual Machine Spot Instances & Eviction Policies",
    "scenario": "You are configuring an asynchronous batch processing cluster using Azure Spot Virtual Machines to take advantage of deep cost savings. Your workload can tolerate interruptions, but you want to ensure that if Azure needs capacity back, running VMs are deallocated (preserving their OS and data disks) rather than permanently deleted, allowing them to restart automatically when capacity becomes available.\n\nWhich Spot instance eviction policy should you configure?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Set Eviction Policy to 'Delete' and Max Price to -1."
      },
      {
        "id": "B",
        "text": "Set Eviction Policy to 'Stop / Deallocate' and Eviction Type to 'Capacity Only' (or Capacity and Price)."
      },
      {
        "id": "C",
        "text": "Set Eviction Policy to 'Migrate to Reserved Instance' with automated billing fallback."
      },
      {
        "id": "D",
        "text": "Configure an Availability Set with 3 Fault Domains and set Priority to 'Spot-Exclusive'."
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B is correct.",
      "triggerConstraints": "Requirement: Configure Spot VM eviction to preserve disks and restart when capacity returns, rather than deleting resources.",
      "flawedMentalModel": "Assuming Spot VMs are always permanently deleted upon eviction.",
      "coreMechanic": "Azure Spot Virtual Machine Eviction Policies:\n1. 'Stop / Deallocate': When Azure evicts the Spot VM due to capacity or price, the VM is placed into the Stopped (Deallocated) state. The compute cores are released, but the OS disk, data disks, and network interfaces are preserved. You only pay for underlying disk storage while deallocated.\n2. 'Delete': The VM and all attached ephemeral/managed disks are permanently deleted upon eviction.\nConfiguring 'Stop / Deallocate' satisfies the requirement to preserve data and allow restarting when capacity permits.",
      "distractors": {
        "A": "'Delete' policy deletes the VM and disks, losing all local state.",
        "C": "'Migrate to Reserved Instance' is not a valid Azure eviction policy.",
        "D": "Availability Sets cannot mix Spot and regular VMs or change eviction semantics."
      },
      "heuristic": "Spot VM Eviction: 'Stop / Deallocate' preserves disks for later restart; 'Delete' permanently destroys the VM and disks.",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machines/spot-vms#eviction-policy",
      "errorJournalRef": "AR PT02 Q14"
    }
  },
  {
    "id": "e2-q65",
    "examNumber": 2,
    "domain": "Domain 5: Monitor and maintain Azure resources",
    "domainCode": 5,
    "topic": "Azure Monitor Metric Alerts with Dynamic Thresholds & Multi-Resource Scopes",
    "scenario": "You are configuring performance monitoring across 25 production web servers (virtual machines) situated in the 'rg-ecommerce-prod' resource group in 'East US'.\n\nThe traffic pattern experiences significant cyclical variations between day and night. You need to configure an alert rule that notifies the on-call team if the '% Processor Time' spikes abnormally compared to historical baseline patterns, without triggering false alarms during expected daily traffic surges. You also want to manage this via a single alert rule rather than 25 separate rules.\n\nHow should you configure the Azure Monitor alert?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Create 25 separate static metric alerts with a hardcoded threshold of 85% CPU utilization."
      },
      {
        "id": "B",
        "text": "Create an Azure Log Search alert using Kusto Query Language (KQL) scheduled to run every 24 hours."
      },
      {
        "id": "C",
        "text": "Create an Alert Processing Rule with notification suppression applied to all VMs during daytime hours."
      },
      {
        "id": "D",
        "text": "Create a single Metric Alert targeting all Virtual Machines in 'rg-ecommerce-prod' (in East US) using Dynamic Thresholds with machine learning anomaly detection."
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D is correct.",
      "triggerConstraints": "Requirement: Monitor 25 VMs with cyclical workloads using a single alert rule without false alarms from daily traffic patterns.",
      "flawedMentalModel": "Creating 25 static alerts or attempting to use log search alerts with 24-hour delays for immediate performance spikes.",
      "coreMechanic": "Azure Monitor Dynamic Thresholds & Multi-Resource Scoping:\n1. Dynamic Thresholds: Uses advanced machine learning to learn metric historical behavior, accounting for seasonality, hourly cycles, and business day patterns. It calculates expected upper and lower bounds automatically.\n2. Multi-Resource Scope: A single metric alert rule can target all Virtual Machines within a specific Resource Group and Region, monitoring each VM instance independently.\nThis provides granular anomaly detection for all 25 VMs with zero false positives during peak business hours and minimal administrative overhead.",
      "distractors": {
        "A": "Static alerts cause false alarms during legitimate peak hours and require 25 rules to maintain.",
        "B": "Log search alerts running every 24 hours cannot provide near-real-time operational alerting.",
        "C": "Suppressing daytime notifications leaves outages unnoticed during business hours."
      },
      "heuristic": "Cyclical metric baselines across multiple VMs in one RG/Region = Metric Alert with Dynamic Thresholds & Multi-Resource Scope!",
      "msLearnUrl": "https://learn.microsoft.com/azure/azure-monitor/alerts/alerts-dynamic-thresholds",
      "errorJournalRef": "error_logging_guide.md"
    }
  }
];
