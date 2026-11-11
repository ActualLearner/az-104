window.AZ104_EXAM_1 = [
  {
    "id": "e1-q01",
    "examNumber": 1,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "Subnet IP Reservation Formula & Usable Addresses",
    "scenario": "You are designing an Azure Virtual Network (`vnet-prod-eastus`) to host backend microservices. You create a new subnet named `snet-backend` with the IPv4 address prefix `10.100.4.0/26`.\n\nBefore provisioning virtual machine network interfaces (NICs) in this subnet, you need to calculate the exact number of usable private IP addresses available for allocation to Azure VMs.\n\nHow many usable host IP addresses are available in `snet-backend`?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "59"
      },
      {
        "id": "B",
        "text": "64"
      },
      {
        "id": "C",
        "text": "62"
      },
      {
        "id": "D",
        "text": "56"
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A (59 usable IP addresses) is correct.",
      "triggerConstraints": "Requirement: Calculate usable host IP addresses for an Azure subnet with prefix /26. Constraint: Azure SDN reserves 5 IP addresses in every subnet, differing from traditional on-prem RFC 1918 calculations.",
      "flawedMentalModel": "Candidates frequently select 62 (Option C) by applying the on-premises formula: 2^(32 - prefix) - 2 (subtracting only network .0 and broadcast .255).",
      "coreMechanic": "In Azure Virtual Networks, Microsoft SDN ALWAYS reserves exactly 5 IP addresses in every subnet:\n1. .0 - Network address.\n2. .1 - Default Gateway (Azure virtual router).\n3. .2 - Azure DNS service (maps to 168.63.129.16).\n4. .3 - Azure DNS fallback coordination.\n5. .63 (last address of the CIDR block) - Subnet broadcast address.\n\nCalculation for /26:\nTotal raw IPs: 2^(32 - 26) = 2^6 = 64.\nUsable IPs = 64 - 5 = 59.",
      "distractors": {
        "B": "64 is the total theoretical address space without subtracting any Azure SDN infrastructure reservations.",
        "C": "62 represents the on-premises networking formula (64 - 2), which fails to account for Azure's default gateway (.1) and DNS service reservations (.2 and .3).",
        "D": "56 incorrectly assumes Azure reserves 8 addresses."
      },
      "heuristic": "Azure Subnet Usable IPs = 2^(32 - prefix) - 5. Azure ALWAYS reserves exactly 5 addresses per subnet!",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-network/virtual-networks-faq#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets",
      "errorJournalRef": "AR PT02 Q21"
    }
  },
  {
    "id": "e1-q02",
    "examNumber": 1,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "Azure Disk Encryption (ADE) Key Vault Prerequisites",
    "scenario": "You plan to enable Azure Disk Encryption (ADE) on the OS and data disks of several production Windows and Linux Azure virtual machines deployed in the `East US` region under `SubscriptionA`.\n\nYou create a new Azure Key Vault named `kv-disk-sec-eus` to store the BitLocker and DM-Crypt Key Encryption Keys (KEKs).\n\nWhich configuration setting MUST be explicitly enabled on `kv-disk-sec-eus` to allow the Azure compute fabric to access the encryption keys during VM boot?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Assign the 'Key Vault Crypto Service Encryption User' RBAC role to each VM's system-assigned managed identity."
      },
      {
        "id": "B",
        "text": "Enable the 'Azure Disk Encryption for volume encryption' access policy flag on the Key Vault."
      },
      {
        "id": "C",
        "text": "Create a Disk Encryption Set (DES) in Key Vault access policies linked to the subscription root."
      },
      {
        "id": "D",
        "text": "Configure Key Vault firewall to allow all Azure Public IP address ranges."
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B is correct.",
      "triggerConstraints": "Requirement: Enable Azure Disk Encryption (ADE) using BitLocker/DM-Crypt. Hidden Constraint: ADE operates at the guest OS volume layer and requires the compute fabric to retrieve keys during boot before managed identities are initialized.",
      "flawedMentalModel": "Conflating ADE (Azure Disk Encryption) with SSE-CMK (Server-Side Encryption with Customer-Managed Keys). SSE-CMK uses Disk Encryption Sets and managed identities; ADE uses Key Vault access policy volume encryption flags.",
      "coreMechanic": "Azure Disk Encryption (ADE) requires the Azure Key Vault to meet three strict prerequisites:\n1. Colocation: Key Vault MUST reside in the same Azure region and subscription as the VMs.\n2. Protection: Soft-delete and purge protection MUST be enabled.\n3. Access Flag: Under Access Policies / Access Configuration, the checkbox 'Azure Disk Encryption for volume encryption' (PowerShell: EnabledForDiskEncryption = $true) must be enabled to authorize Microsoft.Compute to fetch secrets at VM boot.",
      "distractors": {
        "A": "Managed identities are used for SSE-CMK via Disk Encryption Sets, not for ADE volume encryption.",
        "C": "Disk Encryption Sets (DES) are required for storage-level SSE-CMK, not for guest-level ADE BitLocker/DM-Crypt.",
        "D": "Opening firewall to all Azure public IPs does not grant the Microsoft.Compute service permission to unwrap volume encryption keys."
      },
      "heuristic": "ADE = BitLocker/DM-Crypt + Key Vault Access Policy 'EnabledForDiskEncryption'. SSE-CMK = Disk Encryption Set + Managed Identity.",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machines/windows/disk-encryption-key-vault",
      "errorJournalRef": "AR PT02 Q4"
    }
  },
  {
    "id": "e1-q03",
    "examNumber": 1,
    "domain": "Domain 5: Monitor and maintain Azure resources",
    "domainCode": 5,
    "topic": "Workload Segregation: Backup Vault vs. Recovery Services Vault",
    "scenario": "Your enterprise environment includes the following cloud assets deployed across multiple resource groups:\n\n1. `vm-web-01` (Azure Virtual Machine running Windows Server 2022)\n2. `disk-db-data` (Azure Managed Data Disk attached to a database VM)\n3. `share-fin-data` (Azure Files SMB share inside a GPv2 storage account)\n4. `blob-raw-telemetry` (Azure Blob Storage container holding operational log archives)\n\nYou are configuring automated backup protection policies. Which of these workloads MUST be protected using a **Backup Vault** rather than a **Recovery Services Vault**?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "vm-web-01 and share-fin-data"
      },
      {
        "id": "B",
        "text": "disk-db-data and share-fin-data"
      },
      {
        "id": "C",
        "text": "disk-db-data and blob-raw-telemetry"
      },
      {
        "id": "D",
        "text": "vm-web-01 and blob-raw-telemetry"
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C (disk-db-data and blob-raw-telemetry) is correct.",
      "triggerConstraints": "Requirement: Identify which workloads map to Azure Backup Vault vs. Recovery Services Vault. Constraint: Understand the strict architectural boundary between IaaS snapshot vaults (RSV) and modern PaaS operational vaults (Backup Vault).",
      "flawedMentalModel": "Assuming Recovery Services Vault is a universal backup target for all Azure resources, or confusing Azure Files (RSV) with Azure Blobs (Backup Vault).",
      "coreMechanic": "Azure Backup enforces a strict segregation between vault types:\n1. Recovery Services Vault (RSV): Designed for Azure Virtual Machines, Azure Files shares, SQL Server in Azure VMs, SAP HANA in Azure VMs, and On-Premises (MARS/ASR).\n2. Backup Vault: Designed for modern cloud-native PaaS workloads: Azure Managed Disks (Disk Backup), Azure Blobs (Operational and vaulted blob backup), Azure Database for PostgreSQL Flexible Server, and Azure Kubernetes Service (AKS).",
      "distractors": {
        "A": "Azure VMs and Azure Files shares are backed up exclusively using Recovery Services Vaults.",
        "B": "Azure Files shares use Recovery Services Vaults, not Backup Vaults.",
        "D": "Azure VMs use Recovery Services Vaults."
      },
      "heuristic": "Backup Vault = Disks, Blobs, AKS, PostgreSQL. Recovery Services Vault = VMs, Azure Files, SQL in VM, On-Prem/MARS.",
      "msLearnUrl": "https://learn.microsoft.com/azure/backup/backup-vault-overview",
      "errorJournalRef": "AR PT01 Q52, AR PT02 Q53"
    }
  },
  {
    "id": "e1-q04",
    "examNumber": 1,
    "domain": "Domain 5: Monitor and maintain Azure resources",
    "domainCode": 5,
    "topic": "Azure Files Share Backup Frequency & Schedule",
    "scenario": "You are configuring a scheduled backup policy in a Recovery Services Vault to protect an Azure Files share named `data-share` that hosts financial transactions. Management requires backups to run multiple times throughout the business day to minimize the Recovery Point Objective (RPO).\n\nWhat is the most frequent backup schedule supported natively by Recovery Services Vault policies for Azure Files shares?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Once every 24 hours (Daily only)"
      },
      {
        "id": "B",
        "text": "Every 15 minutes (via continuous transaction log capture)"
      },
      {
        "id": "C",
        "text": "Every 1 hour (up to 24 snapshots per day)"
      },
      {
        "id": "D",
        "text": "Every 4 hours (via hourly schedule)"
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D (Every 4 hours) is correct.",
      "triggerConstraints": "Requirement: Determine the maximum backup frequency / shortest interval for Azure Files in Recovery Services Vault. Constraint: Distinguish Azure Files share backup capabilities from standard VM daily backup policies.",
      "flawedMentalModel": "Assuming the 1-per-day restriction of classic Azure VM Standard backup policies applies to Azure Files, or assuming continuous 15-minute log shipping is available for file shares.",
      "coreMechanic": "Azure Files backup in a Recovery Services Vault is powered by native storage snapshot orchestration. Unlike Standard Azure VM backup policies (which are strictly limited to once daily), Azure Files backup policies support an hourly schedule option allowing backups to run as frequently as every 4 hours (e.g. intervals of 4, 6, 8, or 12 hours) with daily, weekly, monthly, and yearly retention tiers.",
      "distractors": {
        "A": "Daily once per day is the limitation of Standard VM backup policies, but Azure Files supports sub-daily hourly schedules.",
        "B": "15-minute continuous replication is unsupported; snapshot scheduling minimum interval is 4 hours.",
        "C": "Azure Backup does not support 1-hour intervals for Azure Files; the most granular frequency interval is every 4 hours."
      },
      "heuristic": "Azure Files Share Backup = Multiple times per day (up to every 4 hours). VM Standard Policy = Once daily only.",
      "msLearnUrl": "https://learn.microsoft.com/azure/backup/backup-azure-files-faq#what-is-the-maximum-frequency-of-backup-supported-for-azure-files",
      "errorJournalRef": "AR PT02 Q62"
    }
  },
  {
    "id": "e1-q05",
    "examNumber": 1,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Management Locks: Move Feasibility with ReadOnly vs. CanNotDelete",
    "scenario": "You have an Azure subscription with two resource groups:\n- `rg-core-networking` (contains a Virtual Network `vnet-hub` and a Public IP address `pip-hub-gw`)\n- `rg-shared-services`\n\nTo prevent accidental modification, an administrator applies a **ReadOnly** management lock on `rg-core-networking`.\n\nYou receive a ticket requesting to move the Public IP address `pip-hub-gw` from `rg-core-networking` into `rg-shared-services`.\n\nCan you complete this move operation while the lock remains in place?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "No, because a ReadOnly lock on the source resource group strictly blocks moving resources until the lock is removed."
      },
      {
        "id": "B",
        "text": "Yes, because moving a resource is a metadata reparenting operation, not a deletion or modification of the resource itself."
      },
      {
        "id": "C",
        "text": "Yes, provided the target resource group (rg-shared-services) does not have a lock applied."
      },
      {
        "id": "D",
        "text": "No, because Public IP addresses can never be moved between resource groups under any circumstances."
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A is correct.",
      "triggerConstraints": "Requirement: Move a resource out of a resource group locked with ReadOnly. Constraint: Understand the exact ARM platform behavior regarding ReadOnly locks vs CanNotDelete locks during resource move operations.",
      "flawedMentalModel": "Conflating CanNotDelete with ReadOnly. CanNotDelete allows moves (because moving is not deleting), but ReadOnly strictly blocks moving resources.",
      "coreMechanic": "According to official Microsoft specifications:\n'Azure resources cannot be moved if a Read-only management lock exists on the source resource group, destination resource group, subscription, or the resources themselves. You must remove the read-only lock before initiating the move.'\nMoving a resource modifies the container's resource collection metadata in the ARM control plane, which a ReadOnly lock strictly forbids.",
      "distractors": {
        "B": "This logic applies to CanNotDelete locks, but is completely false for ReadOnly locks.",
        "C": "The lock on the SOURCE resource group blocks the operation, regardless of the target resource group's lock state.",
        "D": "Public IP addresses can freely be moved between resource groups in the same subscription, provided no blocking locks exist."
      },
      "heuristic": "CanNotDelete Lock = Allows moving resources. ReadOnly Lock on Source OR Destination = STRICTLY BLOCKS moving resources!",
      "msLearnUrl": "https://learn.microsoft.com/azure/azure-resource-manager/management/move-resources-overview#checklist-before-moving-resources",
      "errorJournalRef": "AR PT01 Q57, AR PT02 Q57"
    }
  },
  {
    "id": "e1-q06",
    "examNumber": 1,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "Serverless Windows Container Hosting Without Kubernetes",
    "scenario": "Your organization is migrating a legacy ASP.NET 4.8 application packaged inside a custom **Windows Server Core container image** to Microsoft Azure.\n\nManagement requirements dictate:\n1. The solution must NOT require managing Kubernetes clusters, node pools, or orchestration control planes.\n2. You must select two Azure compute hosting options that natively support running Windows-based container images without managing virtual machine operating systems.\n\nWhich TWO Azure services should you recommend? (Select TWO)",
    "questionType": "multiple",
    "options": [
      {
        "id": "A",
        "text": "Azure Container Instances (ACI)"
      },
      {
        "id": "B",
        "text": "Azure Container Apps (ACA)"
      },
      {
        "id": "C",
        "text": "Azure App Service (Web App for Containers on Windows)"
      },
      {
        "id": "D",
        "text": "Azure Kubernetes Service (AKS)"
      },
      {
        "id": "E",
        "text": "Azure Functions (Consumption Plan on Linux)"
      }
    ],
    "correctAnswer": [
      "A",
      "C"
    ],
    "explanation": {
      "verdict": "Options A (Azure Container Instances) and C (Azure App Service Web App for Containers) are correct.",
      "triggerConstraints": "Requirement: Host a Windows Server container image. Constraints: No Kubernetes cluster management; no manual VM OS management.",
      "flawedMentalModel": "Assuming Azure Container Apps (ACA) supports both Windows and Linux containers. ACA is built exclusively on Linux hosts and does NOT support Windows containers.",
      "coreMechanic": "1. Azure Container Instances (ACI): Serverless container primitive that supports both Linux and Windows Server containers (Windows Server 2019/2022 LTSC) with zero infrastructure management.\n2. Azure App Service (Web App for Containers): Supports custom Windows container images deployed onto Windows App Service Plans without exposing any Kubernetes or node infrastructure.\n3. Azure Container Apps (ACA): Opinionated serverless platform running exclusively on Linux (supports Linux containers ONLY).\n4. AKS: While AKS supports Windows node pools, it requires managing Kubernetes manifests, node pools, and cluster upgrades (violating the constraint).",
      "distractors": {
        "B": "Azure Container Apps (ACA) supports Linux containers only.",
        "D": "Azure Kubernetes Service requires managing cluster orchestration, node pools, and K8s configuration.",
        "E": "Azure Functions Linux Consumption plan does not run Windows Server container images."
      },
      "heuristic": "Windows containers without managing Kubernetes = ACI + App Service (Web App for Containers). Azure Container Apps (ACA) = Linux ONLY.",
      "msLearnUrl": "https://learn.microsoft.com/azure/container-instances/container-instances-faq#what-os-does-azure-container-instances-support",
      "errorJournalRef": "AR PT02 Q15"
    }
  },
  {
    "id": "e1-q07",
    "examNumber": 1,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "ACI Container Groups: Public Port Exposition vs. Shared Localhost",
    "scenario": "You deploy an Azure Container Instance (ACI) multi-container group using an ARM template. The container group contains two containers:\n1. `container-frontend` (nginx web server listening on port 80)\n2. `container-backend` (MySQL database listening on port 3306)\n\nThe template configuration defines:\n```json\n\"ipAddress\": {\n  \"type\": \"Public\",\n  \"ports\": [\n    { \"protocol\": \"TCP\", \"port\": 80 }\n  ]\n}\n```\nPort 3306 is defined only within `container-backend`'s container definition, and is NOT listed in the container group's `ipAddress.ports` property.\n\nWhich two statements accurately describe network connectivity for this deployment? (Select TWO)",
    "questionType": "multiple",
    "options": [
      {
        "id": "A",
        "text": "Clients on the public Internet can connect directly to MySQL over TCP port 3306."
      },
      {
        "id": "B",
        "text": "container-frontend can connect to the database container using localhost:3306 (127.0.0.1:3306)."
      },
      {
        "id": "C",
        "text": "container-frontend must connect to the database container using the container group's public IP address."
      },
      {
        "id": "D",
        "text": "TCP port 3306 is completely inaccessible from the public Internet."
      },
      {
        "id": "E",
        "text": "container-backend cannot communicate with container-frontend unless both are connected via VNet peering."
      }
    ],
    "correctAnswer": [
      "B",
      "D"
    ],
    "explanation": {
      "verdict": "Options B and D are correct.",
      "triggerConstraints": "Requirement: Determine inter-container and external network connectivity in an ACI multi-container group. Constraint: Port 80 is in group ipAddress.ports; port 3306 is only in container definition.",
      "flawedMentalModel": "Assuming container port definitions automatically expose ports to the public IP, or assuming containers in the same group need public IPs to reach each other.",
      "coreMechanic": "An ACI Container Group shares the same lifecycle, local network namespace, and IP address (identical to a Kubernetes Pod):\n1. Inter-Container Communication: Containers in the group communicate via localhost / 127.0.0.1. container-frontend connects to MySQL via localhost:3306.\n2. Ingress Gating: A port is accessible from outside ONLY IF it is explicitly declared in the group-level ipAddress.ports array. Because 3306 is omitted, MySQL is completely shielded from external traffic.",
      "distractors": {
        "A": "Port 3306 is omitted from the group ipAddress.ports array, so Internet ingress is dropped.",
        "C": "Connecting via the public IP is unnecessary, inefficient, and blocked by loopback hair-pinning rules.",
        "E": "Containers within the same ACI container group share the local network stack and do not need VNet peering."
      },
      "heuristic": "ACI Container Group = Shared localhost (127.0.0.1) internally. External reachability requires explicit declaration in group-level ipAddress.ports.",
      "msLearnUrl": "https://learn.microsoft.com/azure/container-instances/container-instances-container-groups",
      "errorJournalRef": "AR PT02 Q16"
    }
  },
  {
    "id": "e1-q08",
    "examNumber": 1,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "VNet Service Endpoints vs. Azure Private Endpoints",
    "scenario": "Your company has a hybrid enterprise network connecting an on-premises datacenter to an Azure Virtual Network (`vnet-hub-eus`) via an ExpressRoute circuit with private peering.\n\nYou have an Azure Storage account named `stdatafinprod` hosting confidential files. You need to restrict network access to `stdatafinprod` so that:\n1. Compute workloads in `vnet-hub-eus` can access the storage account over private Microsoft backbone routing.\n2. On-premises servers connected via ExpressRoute can also access the storage account securely over the private ExpressRoute connection.\n3. The storage account must reject all public Internet traffic.\n\nWhich networking solution should you implement?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Enable a Virtual Network Service Endpoint for Microsoft.Storage on the subnets of vnet-hub-eus."
      },
      {
        "id": "B",
        "text": "Deploy an Azure Private Endpoint for the blob sub-resource into a subnet in vnet-hub-eus and integrate with Private DNS Zone privatelink.blob.core.windows.net."
      },
      {
        "id": "C",
        "text": "Configure the storage account firewall to allow the on-premises public IP range and enable Service Endpoint Policies."
      },
      {
        "id": "D",
        "text": "Deploy an Azure NAT Gateway on vnet-hub-eus and attach a public IP prefix."
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B (Azure Private Endpoint) is correct.",
      "triggerConstraints": "Requirement: Secure Storage Account access for both Azure VNet VMs and on-premises servers via ExpressRoute. Constraint: Public internet access must be disabled.",
      "flawedMentalModel": "Selecting Service Endpoints (Option A). Service Endpoints do NOT extend to on-premises networks across ExpressRoute or VPN gateways.",
      "coreMechanic": "Architectural difference between Service Endpoints and Private Endpoints:\n1. Virtual Network Service Endpoints: Modify subnet routing tables to send traffic directly to Azure PaaS public IP endpoints over the Azure backbone. Crucially, Service Endpoints DO NOT route traffic from on-premises networks across VPN or ExpressRoute connections.\n2. Azure Private Endpoints: Injects a dedicated Network Interface Card (NIC) with a private RFC 1918 IP address (e.g., 10.10.2.5) into your VNet subnet. Because it is a true internal private IP, on-premises clients can route to it across ExpressRoute or Site-to-Site VPN seamlessly via internal DNS.",
      "distractors": {
        "A": "Service Endpoints cannot be reached from on-premises networks over ExpressRoute or VPN.",
        "C": "This exposes the storage account to the public internet using public IP ranges, violating the private connectivity requirement.",
        "D": "NAT Gateway provides outbound SNAT for internet-bound traffic, not private inbound access to Azure Storage."
      },
      "heuristic": "Service Endpoints = Subnet route to public PaaS IP, NO on-prem routing. Private Endpoints = Private RFC 1918 NIC, routes from on-prem VPN/ExpressRoute.",
      "msLearnUrl": "https://learn.microsoft.com/azure/private-link/private-endpoint-overview#private-endpoint-versus-service-endpoint",
      "errorJournalRef": "azure_placement_and_boundary_matrix.md"
    }
  },
  {
    "id": "e1-q09",
    "examNumber": 1,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "NSG Inbound Traffic Evaluation Flow & Dual-Allow Requirement",
    "scenario": "You have a Windows Server virtual machine named `vm-jumpbox` with a single network interface (`nic-jumpbox`). The VM resides in subnet `snet-mgmt` inside `vnet-prod`.\n\nThe network security architecture is configured as follows:\n- Subnet NSG (`nsg-snet-mgmt`) attached to `snet-mgmt` has custom Priority 200 rule: `Allow Inbound TCP 3389 from Any to Any`.\n- NIC NSG (`nsg-nic-jumpbox`) attached to `nic-jumpbox` has only default rules, including default rule `DenyAllInBound` (Priority 65500: `Deny Inbound Any Protocol from Any to Any`).\n- Inbound RDP is enabled at the Windows OS firewall on `vm-jumpbox`.\n\nAn administrator attempts to connect to `vm-jumpbox` from the public Internet via RDP (port 3389).\n\nWill the connection succeed, and why?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Yes, because the Subnet NSG evaluates first and explicitly allows TCP 3389, which bypasses the NIC NSG."
      },
      {
        "id": "B",
        "text": "Yes, because default NSG rules only apply when no custom rules match across the entire path."
      },
      {
        "id": "C",
        "text": "No, because inbound traffic must be allowed by BOTH the Subnet NSG AND the NIC NSG; the NIC NSG blocks the traffic via DenyAllInBound."
      },
      {
        "id": "D",
        "text": "No, because Azure SDN evaluates the NIC NSG first for inbound traffic and rejects packets before reaching the subnet."
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C is correct.",
      "triggerConstraints": "Requirement: Connect via RDP from Internet. Architecture: Subnet NSG allows 3389; NIC NSG has only default rules.",
      "flawedMentalModel": "Assuming allowing traffic at the Subnet NSG overrides or bypasses the NIC NSG, or assuming NIC NSG evaluates first for inbound traffic.",
      "coreMechanic": "Azure SDN processes inbound traffic in strict sequential layers:\n1. Subnet NSG is evaluated first. If allowed, traffic proceeds to the NIC.\n2. NIC NSG is evaluated second.\nDual-Allow Requirement: For an inbound packet to reach the VM, it MUST be allowed by BOTH the Subnet NSG AND the NIC NSG. In this scenario, the packet passes the Subnet NSG, but hits default rule DenyAllInBound (Priority 65500) on the NIC NSG and is dropped.",
      "distractors": {
        "A": "Subnet allow rules never bypass the NIC NSG; both layers must evaluate and allow.",
        "B": "Default rules exist on every NSG; the NIC NSG evaluates independently regardless of Subnet NSG custom rules.",
        "D": "Azure SDN evaluates Subnet NSG first for inbound traffic, not NIC NSG."
      },
      "heuristic": "Inbound packet flow: Subnet NSG -> NIC NSG (BOTH must allow!). Standard RDP = TCP 3389.",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-network/network-security-group-how-it-works",
      "errorJournalRef": "AR PT01 Q21"
    }
  },
  {
    "id": "e1-q10",
    "examNumber": 1,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "Blob Lifecycle Management JSON Path Filtering",
    "scenario": "You are authoring an Azure Blob Storage lifecycle management policy in JSON for a general-purpose v2 storage account named `stcorpfinprod`.\n\nYou need to automatically delete block blobs located in the virtual directory path `archive/reports/` inside the blob container named `financial-records` when they have not been modified for 365 days.\n\nWhich JSON filter definition correctly targets this specific virtual folder path?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "\"filters\": { \"blobTypes\": [ \"blockBlob\" ], \"blobIndexMatch\": [ { \"name\": \"path\", \"op\": \"==\", \"value\": \"financial-records/archive/reports/\" } ] }"
      },
      {
        "id": "B",
        "text": "\"filters\": { \"blobTypes\": [ \"blockBlob\" ], \"pathMatch\": [ \"financial-records/archive/reports/*\" ] }"
      },
      {
        "id": "C",
        "text": "\"filters\": { \"blobTypes\": [ \"blockBlob\" ], \"container\": \"financial-records\", \"folder\": \"archive/reports/\" }"
      },
      {
        "id": "D",
        "text": "\"filters\": { \"blobTypes\": [ \"blockBlob\" ], \"prefixMatch\": [ \"financial-records/archive/reports\" ] }"
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D is correct.",
      "triggerConstraints": "Requirement: Filter blobs in a specific container directory path in a lifecycle JSON rule. Constraint: Correct JSON schema property for path matching.",
      "flawedMentalModel": "Attempting to use blobIndexMatch for folder paths, or guessing invalid schema properties like pathMatch or folder.",
      "coreMechanic": "In Azure Blob Storage lifecycle management rule definitions:\n1. Path filtering is configured strictly using the prefixMatch string array in definition.filters.\n2. The prefixMatch array must specify the full path starting with the container name: e.g. [\"financial-records/archive/reports\"].\n3. In contrast, blobIndexMatch is reserved exclusively for matching key-value Blob Index Tags (e.g. Project == 'Audit'), not directory paths.",
      "distractors": {
        "A": "blobIndexMatch evaluates blob index key-value metadata tags, not directory path prefixes.",
        "B": "pathMatch is an invalid JSON property schema for Azure lifecycle management.",
        "C": "Azure lifecycle rules do not use separate 'container' and 'folder' fields; paths are unified inside prefixMatch."
      },
      "heuristic": "Lifecycle rule folder/path filter = prefixMatch: [\"container/folder\"]. Blob Index Tags = blobIndexMatch.",
      "msLearnUrl": "https://learn.microsoft.com/azure/storage/blobs/lifecycle-management-overview#rule-filters",
      "errorJournalRef": "AR PT01 Q8"
    }
  },
  {
    "id": "e1-q11",
    "examNumber": 1,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "Regional vCPU Quotas: Stopped (Deallocated) VMs Trap",
    "scenario": "Your Azure subscription has a regional vCPU quota limit of 14 vCPUs in the `North Central US` region.\n\nThe following virtual machines are currently provisioned in `North Central US`:\n- `vm-core-app` (Standard_D4s_v5: 4 vCPUs) - Status: **Running**\n- `vm-batch-worker` (Standard_D8s_v5: 8 vCPUs) - Status: **Stopped (Deallocated)**\n- `vm-analytics` (Standard_F2s_v2: 2 vCPUs) - Provisioned in `South Central US` (Status: Running)\n\nYou attempt to sequentially deploy the following two virtual machines into `North Central US`:\n1. `vm-edge-01` (Standard_D2s_v5: 2 vCPUs)\n2. `vm-edge-02` (Standard_D2s_v5: 2 vCPUs)\n\nWhich virtual machines will successfully deploy?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Only vm-edge-01 deploys successfully; vm-edge-02 fails due to quota exhaustion."
      },
      {
        "id": "B",
        "text": "Both vm-edge-01 and vm-edge-02 deploy successfully, because vm-batch-worker is deallocated and releases its 8 vCPUs."
      },
      {
        "id": "C",
        "text": "Neither vm-edge-01 nor vm-edge-02 deploys, because all 14 vCPUs in the subscription are already fully consumed."
      },
      {
        "id": "D",
        "text": "Only vm-edge-02 deploys successfully, provided vm-batch-worker is permanently deleted."
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A is correct.",
      "triggerConstraints": "Requirement: Determine VM deployment feasibility against regional vCPU quota. Hidden Constraint: Stopped (Deallocated) status stops billing, but DOES NOT release vCPU quota reservations.",
      "flawedMentalModel": "Assuming Stopped (Deallocated) releases the VM's vCPU quota allocation like it stops hourly billing charges.",
      "coreMechanic": "Billing vs. Quota Allocation in Azure:\n1. Deallocating a VM stops hourly compute charges, BUT Azure reserves the vCPU quota so the VM can be restarted without allocation failure.\n2. In North Central US:\n- vm-core-app consumes 4 vCPUs.\n- vm-batch-worker consumes 8 vCPUs (even while deallocated!).\n- Total consumed = 4 + 8 = 12 vCPUs of 14.\n- Remaining regional quota = 14 - 12 = 2 vCPUs.\n3. Sequential deployment:\n- vm-edge-01 requests 2 vCPUs: 2 <= 2 -> Deployed successfully! Remaining = 0 vCPUs.\n- vm-edge-02 requests 2 vCPUs: 0 available -> QuotaExceeded failure.",
      "distractors": {
        "B": "Deallocated VMs retain their vCPU quota reservation.",
        "C": "vm-edge-01 can deploy because exactly 2 vCPUs remain available (14 - 12 = 2).",
        "D": "vm-batch-worker has not been deleted; only vm-edge-01 fits within the remaining 2 vCPUs."
      },
      "heuristic": "Stopped (Deallocated) VMs stop billing, but STILL CONSUME vCPU quota. Only deleting the VM frees quota.",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machines/windows/quotas",
      "errorJournalRef": "TD Timed Q3"
    }
  },
  {
    "id": "e1-q12",
    "examNumber": 1,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "App Service OS Isolation & Multi-Runtime Plan Sizing",
    "scenario": "Your enterprise plans to host 5 web applications in Azure App Service:\n1. `App1`: Legacy ASP.NET v4.8 (.NET Framework)\n2. `App2`: Python 3.11 Django API\n3. `App3`: PHP 8.2 Customer Portal\n4. `App4`: Node.js 20 Express Service\n5. `App5`: Java 17 Spring Boot Microservice\n\nAll applications will run in the `East US` region. You need to deploy these applications using the **minimum number of App Service Plans**.\n\nWhat is the minimum number of App Service Plans required?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "1"
      },
      {
        "id": "B",
        "text": "2"
      },
      {
        "id": "C",
        "text": "3"
      },
      {
        "id": "D",
        "text": "5"
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B (2 App Service Plans) is correct.",
      "triggerConstraints": "Requirement: Host 5 distinct runtimes with the minimum number of App Service Plans. Constraint: Operating system compatibility and isolation rules in Azure App Service.",
      "flawedMentalModel": "Assuming all 5 runtimes can share a single plan (1 plan), or assuming each runtime stack requires its own plan (5 plans).",
      "coreMechanic": "In Azure App Service:\n1. An App Service Plan is strictly bound to ONE operating system (Windows OR Linux).\n2. ASP.NET v4.8 (.NET Framework) runs ONLY on Windows plans.\n3. In modern Azure App Service, Python and PHP runtimes are supported ONLY on Linux plans (Windows runtime for PHP/Python is retired).\n4. Node.js and Java are cross-platform and can run on either Windows or Linux.\n5. Therefore, you must provision a minimum of 1 Windows Plan (for App1) and 1 Linux Plan (for App2, App3, App4, App5) = 2 Plans total.",
      "distractors": {
        "A": "You cannot mix Windows and Linux web apps in the same App Service Plan.",
        "C": "3 plans is redundant; cross-platform runtimes can share the Linux plan with Python and PHP.",
        "D": "5 plans is unnecessary administrative overhead and cost."
      },
      "heuristic": "App Service Plan = 1 OS per plan. ASP.NET Framework requires Windows, Python/PHP requires Linux -> Minimum 2 plans.",
      "msLearnUrl": "https://learn.microsoft.com/azure/app-service/overview-hosting-plans",
      "errorJournalRef": "TD Timed Q2"
    }
  },
  {
    "id": "e1-q13",
    "examNumber": 1,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "App Service Outbound Connectivity to Private VNet Resources",
    "scenario": "You have an Azure App Service web app named `app-orders-eus` running on a Standard (S1) plan. The web app needs to connect to a backend SQL Server running on an Azure Virtual Machine named `vm-sql-db` with private IP `10.200.2.15` in `vnet-corp-eus`.\n\nYou need to enable network communication from `app-orders-eus` to `10.200.2.15` without routing traffic over the public Internet.\n\nWhat should you configure?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Create a Private Endpoint for app-orders-eus inside the subnet hosting vm-sql-db."
      },
      {
        "id": "B",
        "text": "Attach a Public IP address to vm-sql-db and add an inbound NSG rule allowing Azure App Service IPs."
      },
      {
        "id": "C",
        "text": "Configure Regional Virtual Network Integration for app-orders-eus, delegating an empty subnet to Microsoft.Web/serverFarms."
      },
      {
        "id": "D",
        "text": "Configure a Service Endpoint for Microsoft.Sql on the subnet containing vm-sql-db."
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C is correct.",
      "triggerConstraints": "Requirement: App Service web app needs to initiate outbound calls to private RFC 1918 IP 10.200.2.15 in a VNet. Constraint: Must not route over public Internet.",
      "flawedMentalModel": "Confusing Inbound access with Outbound access. Private Endpoints provide inbound access TO the web app; Regional VNet Integration provides outbound access FROM the web app into the VNet.",
      "coreMechanic": "1. Regional VNet Integration: Delegates a dedicated subnet in your VNet to the App Service plan (Microsoft.Web/serverFarms). All outbound TCP/UDP calls from the web app route directly through that subnet into your private network, allowing communication with private IPs (10.200.2.15), peered VNets, and ExpressRoute.\n2. Private Endpoint: Secures INBOUND traffic to the web app, assigning it a private IP for clients in the VNet to reach it. It does NOT enable the web app to call private resources in the VNet.",
      "distractors": {
        "A": "Private Endpoint is strictly for inbound traffic to the web app.",
        "B": "Exposes the database VM to public internet and violates the private routing constraint.",
        "D": "Service Endpoints are for multi-tenant Azure PaaS services (Azure SQL Database, Storage), not IaaS virtual machines running SQL Server."
      },
      "heuristic": "App Service OUTBOUND to private VNet IP = Regional VNet Integration. INBOUND to App Service via private IP = Private Endpoint.",
      "msLearnUrl": "https://learn.microsoft.com/azure/app-service/overview-vnet-integration",
      "errorJournalRef": "AR PT01 Q28"
    }
  },
  {
    "id": "e1-q14",
    "examNumber": 1,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "Virtual Machine Licensing & Azure Hybrid Benefit (AHB)",
    "scenario": "Your enterprise currently runs an active, mission-critical Windows Server 2022 virtual machine named `vm-erp-prod` (Standard_D16s_v5, 16 vCPUs) in Azure on a standard Pay-As-You-Go licensing model.\n\nThe finance department acquires Windows Server Datacenter licenses with active Software Assurance (SA) covering 16 cores and requests that you apply Azure Hybrid Benefit (AHB) to eliminate the hourly Windows OS software fee.\n\nManagement mandates that this licensing change must incur **zero downtime** and must not require redeploying the virtual machine.\n\nWhat should you do?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Deallocate vm-erp-prod, redeploy it from a generalized Windows Server custom image with AHB enabled, and restore data disks."
      },
      {
        "id": "B",
        "text": "Submit an Azure Support ticket to convert the underlying subscription billing model from PAYG to Enterprise Agreement."
      },
      {
        "id": "C",
        "text": "Create an Azure Automation runbook to stop the VM, swap the OS disk with a BYOL disk, and restart the VM."
      },
      {
        "id": "D",
        "text": "Execute `az vm update --resource-group rg-erp --name vm-erp-prod --license-type Windows_Server` while the VM remains running."
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D is correct.",
      "triggerConstraints": "Requirement: Apply Azure Hybrid Benefit to eliminate Windows Server OS licensing charges on an active VM. Constraint: Zero downtime; no redeployment.",
      "flawedMentalModel": "Assuming Azure Hybrid Benefit must be chosen at creation time or requires VM redeployment / restart.",
      "coreMechanic": "Azure Hybrid Benefit (AHB) is a metadata property on the ARM compute resource (`licenseType`).\n1. It can be toggled on or off dynamically on a live, running VM in the Azure Portal or via CLI (`az vm update --license-type Windows_Server`) with ZERO downtime and ZERO reboot.\n2. It eliminates the Windows Server OS surcharge, billing the VM at the base Linux compute rate.\n3. Licensing rule: Requires on-prem Windows Server licenses with active SA, licensed in minimum 16-core allocations per VM.",
      "distractors": {
        "A": "Redeploying from a custom image is unnecessary and incurs significant downtime.",
        "B": "Subscription billing models do not automatically convert individual VM license metadata properties.",
        "C": "Swapping the OS disk causes service interruption and is technically incorrect for toggling AHB."
      },
      "heuristic": "Azure Hybrid Benefit (AHB) = Eliminates OS license fees. Minimum 16 cores. Zero-downtime dynamic toggle via licenseType.",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machines/windows/hybrid-use-benefit-licensing",
      "errorJournalRef": "error_journal.md"
    }
  },
  {
    "id": "e1-q15",
    "examNumber": 1,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Deleting Entra ID Users vs Groups with Assigned Licenses",
    "scenario": "You are managing identities and licensing in Microsoft Entra ID. You encounter the following administrative tasks:\n\n- **Task 1:** An employee leaves the company. You need to delete user object `UserA`. `UserA` is currently a member of a security group named `grp-sales-lic` that has 50 Microsoft 365 E5 licenses assigned to the group.\n- **Task 2:** A project concludes. You need to delete security group `grp-dev-lic`. The group object itself has 25 Microsoft Entra ID P2 licenses directly assigned to it.\n\nHow will Microsoft Entra ID handle these two deletion requests?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "UserA can be deleted directly; grp-dev-lic CANNOT be deleted until its assigned licenses are explicitly removed."
      },
      {
        "id": "B",
        "text": "Both UserA and grp-dev-lic can be deleted directly without modifying license assignments."
      },
      {
        "id": "C",
        "text": "Neither UserA nor grp-dev-lic can be deleted until all assigned licenses are removed first."
      },
      {
        "id": "D",
        "text": "grp-dev-lic can be deleted directly; UserA CANNOT be deleted until removed from grp-sales-lic."
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A is correct.",
      "triggerConstraints": "Requirement: Compare deletion rules in Entra ID for a user with group-assigned licenses vs a group with directly assigned licenses.",
      "flawedMentalModel": "Assuming license assignments block user deletion, or assuming security groups can be deleted freely while licenses are assigned.",
      "coreMechanic": "In Microsoft Entra ID:\n1. User Deletion: A user account can be deleted directly at any time. Moving the user to Deleted Users automatically releases and suspends all direct and inherited group licenses. There is no need to remove the user from the group first.\n2. Group Deletion: A security group with directly assigned licenses CANNOT be deleted. Entra ID displays an error preventing deletion until an administrator explicitly navigates to the group's Licenses blade and unassigns all licenses.",
      "distractors": {
        "B": "Attempting to delete grp-dev-lic will fail with a platform validation error until licenses are removed.",
        "C": "UserA can be deleted immediately without touching group licensing.",
        "D": "Inverts the true platform rules."
      },
      "heuristic": "User with group license = Can delete immediately. Group with assigned license = CANNOT delete until licenses are unassigned first.",
      "msLearnUrl": "https://learn.microsoft.com/entra/identity/users/groups-lifecycle",
      "errorJournalRef": "AR PT01 Q50, AR PT01 Q51"
    }
  },
  {
    "id": "e1-q16",
    "examNumber": 1,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Entra ID Custom Domain Verification DNS Records",
    "scenario": "You are adding a new custom domain name (`contoso-cloud.com`) to your Microsoft Entra ID tenant. To verify domain ownership, you must add a DNS record to your public DNS registrar's zone file.\n\nYour public DNS hosting provider does not support creating `TXT` record types on apex domains.\n\nWhich alternative DNS record type does Microsoft Entra ID support as the official fallback method for custom domain verification?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "A record (pointing to Azure verification IP 168.63.129.16)"
      },
      {
        "id": "B",
        "text": "MX record (pointing to ms12345678.msv1.invalid)"
      },
      {
        "id": "C",
        "text": "CNAME record (pointing to verify.entra.microsoft.com)"
      },
      {
        "id": "D",
        "text": "SOA record (specifying Microsoft primary name server)"
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B (MX record) is correct.",
      "triggerConstraints": "Requirement: Verify custom domain in Entra ID when TXT records are unsupported by DNS provider.",
      "flawedMentalModel": "Memorizing only TXT records for Entra ID verification, or assuming CNAME / A records can be used for tenant apex domain validation.",
      "coreMechanic": "Microsoft Entra ID supports exactly TWO DNS record types for custom domain verification:\n1. TXT record: Primary/recommended method (e.g. MS=ms12345678).\n2. MX record: The official fallback method when a DNS provider does not support TXT records. Azure generates an MX record pointing to `<msid>.msv1.invalid` with a priority (e.g., 32767).\nNo other record types (A, CNAME, PTR, SOA, or SRV) are supported for domain ownership verification.",
      "distractors": {
        "A": "A records map hostnames to IP addresses and do not prove domain identity to Entra ID.",
        "C": "CNAME records cannot be placed at the root/apex domain and are not supported for Entra ID tenant verification.",
        "D": "SOA records manage zone transfer metadata and cannot be used for tenant verification."
      },
      "heuristic": "Entra ID Custom Domain verification DNS record = TXT (primary) or MX (fallback). Never A, CNAME, or SOA.",
      "msLearnUrl": "https://learn.microsoft.com/entra/identity/users/domains-manage#add-the-dns-record-at-the-domain-registrar",
      "errorJournalRef": "TD Timed Q5"
    }
  },
  {
    "id": "e1-q17",
    "examNumber": 1,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Control Plane vs. Data Plane RBAC for Azure Storage",
    "scenario": "User `Admin1` is assigned the **Owner** role at the Azure subscription scope (`Subscription-Prod`).\n\n`Admin1` logs into the Azure Portal, navigates to a storage account named `stprodappdata`, and attempts to view and download blobs in a private container named `confidential` using their Microsoft Entra ID user credentials.\n\nThe Azure Portal displays the error: `You do not have permissions to list data using your user account with Microsoft Entra ID`.\n\nWhy does this error occur despite `Admin1` having the Subscription Owner role?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "The storage account firewall is enabled and blocking Admin1's client IP address."
      },
      {
        "id": "B",
        "text": "The storage account has reached its maximum quota of 5 Stored Access Policies."
      },
      {
        "id": "C",
        "text": "The Subscription Owner role grants Azure Resource Manager (ARM) control-plane permissions only, and does not grant data-plane permissions to read blob contents."
      },
      {
        "id": "D",
        "text": "Admin1 must be assigned the 'Global Administrator' directory role in Microsoft Entra ID to read blob data."
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C is correct.",
      "triggerConstraints": "Requirement: Access blob data via Azure Portal using Entra ID. User has Subscription Owner role. Error indicates insufficient data-plane permissions.",
      "flawedMentalModel": "Assuming Subscription Owner grants god-mode access to all data plane objects inside every resource in the subscription.",
      "coreMechanic": "Azure RBAC enforces a strict separation between:\n1. Control Plane (Management Plane): Operations managed by Azure Resource Manager (`Microsoft.Storage/storageAccounts/*`). The Owner role grants full control-plane permissions (create, delete, update storage accounts, manage firewalls).\n2. Data Plane: Operations managed by the storage service itself (`Microsoft.Storage/storageAccounts/blobServices/containers/blobs/*`). Owner and Contributor DO NOT include data actions.\nTo read or write blobs via Entra ID auth, the user must be assigned an explicit data-plane role such as `Storage Blob Data Owner`, `Storage Blob Data Contributor`, or `Storage Blob Data Reader`.",
      "distractors": {
        "A": "If blocked by firewall, the error would specifically report network authorization failure (HTTP 403 Forbidden).",
        "B": "Stored access policies manage SAS signatures, not direct portal Entra ID RBAC.",
        "D": "Entra ID directory roles manage tenant identities, not Azure resource data-plane RBAC."
      },
      "heuristic": "Subscription Owner/Contributor grants control plane only. Reading/writing blob data requires Storage Blob Data [Role] or Storage Keys.",
      "msLearnUrl": "https://learn.microsoft.com/azure/storage/blobs/assign-azure-role-data-access",
      "errorJournalRef": "error_journal.md"
    }
  },
  {
    "id": "e1-q18",
    "examNumber": 1,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Azure ABAC Supported Roles in Azure Blob Storage",
    "scenario": "Your organization wants to implement Attribute-Based Access Control (ABAC) in Azure Blob Storage to restrict access based on blob index tags (e.g., granting read access only if `@Resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project] == @Principal[Department]`).\n\nYou need to author an ABAC role assignment condition in Azure RBAC.\n\nWhich built-in Azure RBAC role does NOT support adding ABAC conditions for blob storage actions?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Storage Blob Data Reader"
      },
      {
        "id": "B",
        "text": "Storage Blob Data Contributor"
      },
      {
        "id": "C",
        "text": "Storage Blob Data Owner"
      },
      {
        "id": "D",
        "text": "Storage Blob Delegator"
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D (Storage Blob Delegator) is correct.",
      "triggerConstraints": "Requirement: Author ABAC conditions for Azure Blob Storage. Constraint: Identify which built-in role is unsupported.",
      "flawedMentalModel": "Assuming all roles with 'Blob' in their title support ABAC conditions.",
      "coreMechanic": "Azure Attribute-Based Access Control (ABAC) conditions are supported strictly on data actions:\n1. Supported roles: Storage Blob Data Reader, Storage Blob Data Contributor, and Storage Blob Data Owner.\n2. Storage Blob Delegator grants only permission to generate a user delegation key (`Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action`) to sign SAS tokens. It does not grant direct blob read/write/delete data actions and DOES NOT support ABAC conditions.",
      "distractors": {
        "A": "Storage Blob Data Reader supports ABAC read conditions.",
        "B": "Storage Blob Data Contributor supports ABAC read/write conditions.",
        "C": "Storage Blob Data Owner supports ABAC conditions."
      },
      "heuristic": "Azure Blob ABAC conditions = Supported ONLY on Storage Blob Data Reader, Contributor, and Owner. NEVER Storage Blob Delegator.",
      "msLearnUrl": "https://learn.microsoft.com/azure/role-based-access-control/conditions-role-assignments",
      "errorJournalRef": "AR PT01 Q47"
    }
  },
  {
    "id": "e1-q19",
    "examNumber": 1,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "Stored Access Policies Maximum Limit per Container",
    "scenario": "You manage an Azure Blob Storage container named `invoices` that shares data with multiple external vendor applications using Shared Access Signatures (SAS).\n\nTo allow instantaneous revocation of vendor access, you use Stored Access Policies defined on the container.\n\nWhat is the maximum number of Stored Access Policies that can be maintained on a single container at any one time?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "5"
      },
      {
        "id": "B",
        "text": "1"
      },
      {
        "id": "C",
        "text": "10"
      },
      {
        "id": "D",
        "text": "Unlimited"
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A (5 policies) is correct.",
      "triggerConstraints": "Requirement: Centralized SAS management via Stored Access Policies on a blob container. Constraint: Maximum supported limit.",
      "flawedMentalModel": "Guessing 10, 20, or assuming container policies are unlimited.",
      "coreMechanic": "Azure Storage enforces a strict platform limit: A maximum of 5 Stored Access Policies can be created on any single container, file share, table, or queue. Stored Access Policies are stored in the container's ACL metadata; adding a 6th policy results in an HTTP 400 Bad Request error.",
      "distractors": {
        "B": "A container supports more than 1 policy simultaneously.",
        "C": "10 exceeds the hard limit of 5.",
        "D": "Stored access policies are not unlimited due to container metadata size restrictions."
      },
      "heuristic": "Maximum Stored Access Policies on a blob container / file share / queue / table = Exactly 5.",
      "msLearnUrl": "https://learn.microsoft.com/azure/storage/common/storage-sas-overview#stored-access-policies",
      "errorJournalRef": "AR PT01 Q63"
    }
  },
  {
    "id": "e1-q20",
    "examNumber": 1,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "Secondary Region Read Access Without Failover",
    "scenario": "You have an Azure General Purpose v2 storage account named `stdataeastus` deployed in `East US`. The account is configured with **Geo-redundant storage (GRS)** redundancy.\n\nA regional network issue degrades performance in `East US`. Your application tier requires immediate read access to blob data from the secondary paired region (`West US`). Management insists that you must NOT initiate a customer-managed account failover, because write operations will resume in `East US` as soon as the issue resolves.\n\nWhat configuration change should you make to `stdataeastus` to meet this requirement with minimal administrative overhead?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Initiate an unplanned customer-managed failover to West US and enable LRS."
      },
      {
        "id": "B",
        "text": "Convert the storage account redundancy to Read-Access Geo-Redundant Storage (RA-GRS)."
      },
      {
        "id": "C",
        "text": "Use AzCopy to replicate blob data to a new storage account in West US."
      },
      {
        "id": "D",
        "text": "Enable Blob Object Replication between stdataeastus and a backup storage account in West US."
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B is correct.",
      "triggerConstraints": "Requirement: Read access from secondary paired region. Constraint: Must NOT initiate customer failover; minimal administrative effort.",
      "flawedMentalModel": "Assuming standard GRS secondary endpoint is readable by default.",
      "coreMechanic": "Standard GRS asynchronously replicates data 3x locally + 3x to paired region, but the secondary endpoint (`*.secondary.core.windows.net`) is completely unavailable for read operations under standard GRS. Converting the account redundancy to RA-GRS (Read-Access Geo-Redundant Storage) immediately activates the secondary read endpoint without initiating failover and without changing the primary write endpoint.",
      "distractors": {
        "A": "Initiating failover converts the secondary to LRS primary and changes DNS endpoints, violating the constraint to avoid customer failover.",
        "C": "AzCopy requires custom scripts and continuous administrative overhead.",
        "D": "Object Replication requires configuring two separate accounts and container rules."
      },
      "heuristic": "Secondary read access without failover = Always RA-GRS / RA-GZRS.",
      "msLearnUrl": "https://learn.microsoft.com/azure/storage/common/storage-redundancy#read-access-to-data-in-the-secondary-region",
      "errorJournalRef": "Q12"
    }
  },
  {
    "id": "e1-q21",
    "examNumber": 1,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "Uploading On-Premises VHD Disks to Azure",
    "scenario": "You have a generalized on-premises Hyper-V virtual machine disk file (`C:\\VHDs\\custom-app-os.vhd`). You need to upload this disk image to an Azure Storage account so that it can be used to create managed OS disks for new Azure virtual machines.\n\nWhich PowerShell cmdlet and blob type MUST be used?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Use `Set-AzStorageBlobContent` to upload the file as a Block Blob."
      },
      {
        "id": "B",
        "text": "Use `New-AzDisk` pointing to the local file path `C:\\VHDs\\custom-app-os.vhd`."
      },
      {
        "id": "C",
        "text": "Use `Add-AzVhd` to upload the file as a Page Blob."
      },
      {
        "id": "D",
        "text": "Use `Add-AzImage` to directly stream the VHD into an Azure Compute Gallery."
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C is correct.",
      "triggerConstraints": "Requirement: Upload on-prem .vhd to Azure Storage for VM deployment. Constraint: Azure VM disk storage mechanics.",
      "flawedMentalModel": "Assuming VM disks can be uploaded as Block Blobs using standard blob upload cmdlets, or assuming Add-AzImage transfers bytes over the network.",
      "coreMechanic": "Azure virtual machine OS and data disks must be stored as Page Blobs (512-byte aligned random-access storage). The dedicated Azure PowerShell cmdlet designed specifically for uploading on-prem VHD files to Azure Page Blobs is `Add-AzVhd`. It automatically converts dynamic disks to fixed size and aligns sectors to 512-byte boundaries.",
      "distractors": {
        "A": "Set-AzStorageBlobContent uploads as Block Blobs by default; Azure VMs cannot boot from Block Blobs.",
        "B": "New-AzDisk creates a managed disk from existing cloud resources, but cannot read local file paths across the network.",
        "D": "Add-AzImage requires the VHD to already exist in Azure storage."
      },
      "heuristic": "Upload on-prem .vhd to Azure = Always Add-AzVhd (Page Blob, 512-byte boundary).",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machines/windows/prepare-for-upload-vhd-image",
      "errorJournalRef": "Q22"
    }
  },
  {
    "id": "e1-q22",
    "examNumber": 1,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "Point-to-Site VPN & VNet Peering Route Propagation",
    "scenario": "Remote teleworkers connect to your corporate network using Point-to-Site (P2S) OpenVPN client software connected to a Virtual Network Gateway in `vnet-hub`.\n\nYou create a new VNet peering connection between `vnet-hub` and a newly provisioned virtual network named `vnet-spoke2` (`10.30.0.0/16`). On the peering settings:\n- `vnet-hub` peering has **Allow 'vnet-hub' to use its remote virtual network's gateway** (or 'Use the remote virtual network's gateway' on spoke, 'Allow gateway transit' on hub) enabled.\n\nHowever, active P2S VPN users report that they cannot connect to any VMs inside `vnet-spoke2`.\n\nWhat must be done to resolve this issue?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Restart the Virtual Network Gateway in vnet-hub to reload routing tables."
      },
      {
        "id": "B",
        "text": "Add a User Defined Route (UDR) to GatewaySubnet pointing to vnet-spoke2."
      },
      {
        "id": "C",
        "text": "Recreate the VNet peering with 'Allow forwarded traffic' enabled."
      },
      {
        "id": "D",
        "text": "Re-download and re-install the VPN client configuration package on the client devices."
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D is correct.",
      "triggerConstraints": "Requirement: P2S VPN clients connected to hub need to reach a newly peered spoke VNet. Constraint: Peering and gateway transit are properly configured.",
      "flawedMentalModel": "Assuming Azure SDN automatically pushes new VNet routes down to client virtual adapters dynamically over active tunnels.",
      "coreMechanic": "Point-to-Site VPN clients (Windows, macOS) receive their local routing table only when downloading the VPN configuration file package. When new VNet peerings or routes are added to the gateway after client installation, existing client software DOES NOT dynamically learn the new routes. The VPN client configuration package must be re-downloaded from the Azure Portal and re-installed on client devices.",
      "distractors": {
        "A": "Restarting the gateway drops active sessions but does not alter the static routing tables on client devices.",
        "B": "UDRs on GatewaySubnet do not update the routing tables on external remote client devices.",
        "C": "Allow forwarded traffic applies to NVA transit, not client VPN route learning."
      },
      "heuristic": "P2S VPN clients cannot reach newly peered VNet = Re-download and re-install client VPN package.",
      "msLearnUrl": "https://learn.microsoft.com/azure/vpn-gateway/vpn-gateway-peering-gateway-transit#point-to-site",
      "errorJournalRef": "Q24/Q25"
    }
  },
  {
    "id": "e1-q23",
    "examNumber": 1,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "Azure-Provided DNS Reverse Lookup (PTR) & Domain Suffix Taxonomy",
    "scenario": "You deploy an Azure Virtual Machine named `vm-db-01` in `vnet-corp`. `vnet-corp` uses default **Azure-provided DNS** (`168.63.129.16`) with no custom DNS servers or Private DNS Zones configured.\n\nYou connect to another VM in the same VNet and execute a reverse DNS lookup query (`nslookup 10.0.1.4`) against `vm-db-01`'s private IP address.\n\nWhat Fully Qualified Domain Name (FQDN) is returned by the Azure DNS resolver?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "vm-db-01.internal.cloudapp.net"
      },
      {
        "id": "B",
        "text": "vm-db-01.azureportal.com"
      },
      {
        "id": "C",
        "text": "vm-db-01.cloudapp.azure.com"
      },
      {
        "id": "D",
        "text": "vm-db-01.corp.contoso.com"
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A is correct.",
      "triggerConstraints": "Requirement: Determine FQDN returned by reverse DNS lookup (PTR) for a private IP under Azure-provided DNS.",
      "flawedMentalModel": "Confusing internal DNS suffixes with public IP DNS labels (cloudapp.azure.com) or management URLs (azureportal.com).",
      "coreMechanic": "Azure-provided DNS automatically manages reverse DNS (PTR) records for all VMs within a VNet using the internal suffix `internal.cloudapp.net`. A reverse query against a private IP returns `<vmname>.internal.cloudapp.net`. Note: This resolution is strictly scoped to the SAME VNet and cannot resolve across peered VNets without Azure Private DNS Zones.",
      "distractors": {
        "B": "portal.azure.com is the management web portal, not a DNS suffix.",
        "C": "cloudapp.azure.com is used for public IP DNS name labels.",
        "D": "Custom domains require creating an Azure Private DNS Zone."
      },
      "heuristic": "Azure-provided DNS private IP reverse lookup (PTR) = <vmname>.internal.cloudapp.net. Never resolves cross-VNet without Private DNS Zone.",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances",
      "errorJournalRef": "AR PT01 Q23"
    }
  },
  {
    "id": "e1-q24",
    "examNumber": 1,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "Resizing Virtual Machines in an Availability Set",
    "scenario": "You have an Availability Set named `avail-web-prod` containing three virtual machines (`web-vm-1`, `web-vm-2`, and `web-vm-3`) of size `Standard_D2s_v3`.\n\nYou need to resize `web-vm-1` to a memory-optimized `Standard_E4s_v5` size. You stop `web-vm-1` (status shows Stopped / Deallocated), navigate to the Size blade in the Azure Portal, select `Standard_E4s_v5`, and click Resize.\n\nThe operation fails with the error: `AllocationFailed: Cannot allocate requested size on this hardware cluster`.\n\nWhat action must you take to successfully resize `web-vm-1`?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Restart web-vm-1 and retry the resize operation while the VM is in the Running state."
      },
      {
        "id": "B",
        "text": "Stop (deallocate) all three virtual machines in the Availability Set, then resize web-vm-1."
      },
      {
        "id": "C",
        "text": "Move web-vm-1 to another Resource Group in the same region, then resize."
      },
      {
        "id": "D",
        "text": "Remove web-vm-1 from the Availability Set, resize it, and re-add it to avail-web-prod."
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B is correct.",
      "triggerConstraints": "Requirement: Resolve AllocationFailed when resizing a VM in an Availability Set. Architecture: 3 VMs in Availability Set; target size is in a different VM family (D-series to E-series).",
      "flawedMentalModel": "Assuming stopping only the single target VM is sufficient to change hardware clusters, or assuming VMs can be dynamically removed from Availability Sets.",
      "coreMechanic": "An Availability Set is bound to a specific physical hardware cluster in an Azure datacenter. If the target VM size family is not available on that physical cluster, Azure cannot allocate the new size. To allow Azure to reallocate the entire Availability Set to a modern cluster supporting the target SKU, ALL virtual machines in the Availability Set must be stopped (deallocated).",
      "distractors": {
        "A": "Resizing cannot be performed while the VM is running.",
        "C": "Moving between resource groups does not alter physical hardware cluster bindings.",
        "D": "A VM cannot be removed from or added to an existing Availability Set after creation."
      },
      "heuristic": "AllocationFailed resizing an Availability Set VM = Deallocate ALL VMs in the set first.",
      "msLearnUrl": "https://learn.microsoft.com/troubleshoot/azure/virtual-machines/allocation-failure-availability-set",
      "errorJournalRef": "Q16"
    }
  },
  {
    "id": "e1-q25",
    "examNumber": 1,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Resource Group Deployments vs. Properties Blade",
    "scenario": "An auditor requests historical documentation for an Azure Resource Group named `rg-finance-core`.\n\nYou need to retrieve:\n1. The exact timestamp when resources were deployed via ARM templates\n2. The parameters and template inputs used during each deployment\n3. The success or failure status and duration of each template deployment\n\nWhich blade under the `rg-finance-core` Resource Group menu should you inspect?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Properties"
      },
      {
        "id": "B",
        "text": "Activity log"
      },
      {
        "id": "C",
        "text": "Deployments"
      },
      {
        "id": "D",
        "text": "Resource costs"
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C (Deployments) is correct.",
      "triggerConstraints": "Requirement: Retrieve exact ARM deployment timestamps, input parameters, template definitions, and execution duration in a Resource Group.",
      "flawedMentalModel": "Assuming Properties shows creation history and deployment parameters, like file properties in Windows/Linux.",
      "coreMechanic": "1. Properties blade: Contains static metadata only (Subscription ID, Resource Group name, Location, Resource ID, and Tags). It does NOT contain deployment history or parameters.\n2. Deployments blade: The dedicated ARM engine execution log. Contains deployment names, timestamps, durations, inputs, outputs, and the raw ARM/Bicep template used.",
      "distractors": {
        "A": "Properties blade shows static metadata only.",
        "B": "Activity log shows management events for the last 90 days, but does not display structured ARM template inputs, outputs, and parameters.",
        "D": "Resource costs shows billing analytics, not deployment history."
      },
      "heuristic": "ARM template history, inputs, outputs, and deployment timestamps = Always the Deployments blade (never Properties).",
      "msLearnUrl": "https://learn.microsoft.com/azure/azure-resource-manager/templates/deployment-history",
      "errorJournalRef": "TD Sampler Q6"
    }
  },
  {
    "id": "e1-q26",
    "examNumber": 1,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Cross-Subscription VM Move: Dependent Resource Bundling",
    "scenario": "You have an Azure Virtual Machine named `vm-payroll` running in `SubscriptionA` under resource group `rg-payroll-prod`. The VM has an attached OS disk, two data disks, one network interface (`nic-payroll`), an associated Public IP address (`pip-payroll`), and an associated Network Security Group (`nsg-payroll`).\n\nYou need to move `vm-payroll` to `SubscriptionB` within the same Microsoft Entra ID tenant.\n\nWhich resources MUST be moved together with `vm-payroll` in the same move operation?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Only vm-payroll; attached disks and network interfaces can remain in SubscriptionA."
      },
      {
        "id": "B",
        "text": "vm-payroll and its OS disk only; data disks and NICs can be moved in subsequent operations."
      },
      {
        "id": "C",
        "text": "vm-payroll and the virtual network only; all disks are detached and recreated in SubscriptionB."
      },
      {
        "id": "D",
        "text": "vm-payroll, all attached OS and data disks, the NIC, the associated Public IP, and the associated NSG."
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D is correct.",
      "triggerConstraints": "Requirement: Move an Azure VM cross-subscription. Constraint: ARM dependency validation rules.",
      "flawedMentalModel": "Assuming compute resources can be moved independently of attached storage or network adapters.",
      "coreMechanic": "Azure Resource Manager (ARM) enforces strict dependency validation when moving virtual machines across subscriptions or resource groups. A VM cannot be disassociated from its infrastructure dependencies. You MUST move the VM, its OS disk, all attached data disks, attached NICs, associated Public IP addresses, and associated NSGs together in a single batch operation.",
      "distractors": {
        "A": "Leaving disks or NICs behind causes ARM validation error ResourceMoveValidationFailed.",
        "B": "All attached disks must move simultaneously with the VM.",
        "C": "Detaching disks is unnecessary and causes administrative overhead and downtime."
      },
      "heuristic": "Move VM across subscriptions = VM + Disks + NICs + Public IPs + NSGs MUST all move together in a single batch.",
      "msLearnUrl": "https://learn.microsoft.com/azure/azure-resource-manager/management/move-limitations/virtual-machines-move-limitations",
      "errorJournalRef": "AR PT01 Q56"
    }
  },
  {
    "id": "e1-q27",
    "examNumber": 1,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "Azure Load Balancer Session Persistence & Affinity",
    "scenario": "You deploy an Azure Public Standard Load Balancer (`lb-web-eus`) front-ending a backend pool of four web servers running an e-commerce shopping cart application.\n\nUsers report that their shopping carts randomly empty as they browse the website. Investigation reveals that sequential requests from the same user are being distributed to different backend servers because the default 5-tuple hash distribution is in use.\n\nWhich setting on the load balancing rule should you modify to ensure that all requests from a specific client IP address route consistently to the same backend web server?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Change Session persistence to 'Client IP' (2-tuple)."
      },
      {
        "id": "B",
        "text": "Configure an HTTP Health Probe with an interval of 5 seconds."
      },
      {
        "id": "C",
        "text": "Enable Floating IP (Direct Server Return) on the rule."
      },
      {
        "id": "D",
        "text": "Change TCP Reset on Idle to 30 minutes."
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A is correct.",
      "triggerConstraints": "Requirement: Stateful sticky routing for e-commerce shopping carts on Azure Load Balancer.",
      "flawedMentalModel": "Assuming default load balancer distribution maintains session affinity, or confusing Health Probes with session persistence.",
      "coreMechanic": "1. Default Distribution: Azure Load Balancer uses a 5-tuple hash (Source IP, Source Port, Destination IP, Destination Port, Protocol) with Session persistence: None. Successive requests from a client use different ephemeral client ports, landing on different backend VMs.\n2. Session Persistence:\n- Client IP (2-tuple): Hashes Source IP and Destination IP, guaranteeing all connections from that client IP route to the same backend server.\n- Client IP and protocol (3-tuple): Hashes Source IP, Destination IP, and Protocol.",
      "distractors": {
        "B": "Health probes only determine backend host health; they do not control session routing.",
        "C": "Floating IP is used for SQL Server Always On Availability Groups, not session affinity.",
        "D": "TCP Reset manages idle connection teardown, not session affinity."
      },
      "heuristic": "Route requests to the SAME backend VM on Azure Load Balancer = Session persistence: Client IP.",
      "msLearnUrl": "https://learn.microsoft.com/azure/load-balancer/load-balancer-distribution-mode-how-to",
      "errorJournalRef": "TD Timed Q4"
    }
  },
  {
    "id": "e1-q28",
    "examNumber": 1,
    "domain": "Domain 5: Monitor and maintain Azure resources",
    "domainCode": 5,
    "topic": "Recovery Services Vault vs. Log Analytics Workspace Regional Boundaries",
    "scenario": "Your enterprise has a centralized Log Analytics workspace named `law-monitoring-weu` deployed in the `West Europe` region.\n\nYou have multiple virtual machines and a Recovery Services Vault named `rsv-core-eus` located in the `East US` region.\n\nYou need to configure Azure Backup Reports for `rsv-core-eus` so that backup job history, alert metrics, and storage consumption are aggregated into `law-monitoring-weu`.\n\nCan `rsv-core-eus` stream its diagnostic settings telemetry to `law-monitoring-weu`?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "No, because a Recovery Services Vault can only send diagnostic telemetry to a Log Analytics workspace in the exact same region."
      },
      {
        "id": "B",
        "text": "Yes, because Azure Monitor Diagnostic Settings support streaming log and metric telemetry across Azure regions globally."
      },
      {
        "id": "C",
        "text": "No, because Azure Backup Reports require a dedicated Azure Storage account, not a Log Analytics workspace."
      },
      {
        "id": "D",
        "text": "Yes, but only if an ExpressRoute circuit connects East US and West Europe."
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B is correct.",
      "triggerConstraints": "Requirement: Send backup reporting telemetry from an East US Recovery Services Vault to a West Europe Log Analytics workspace.",
      "flawedMentalModel": "Conflating VM backup boundaries with monitoring telemetry boundaries. VM backup is strictly regional, but diagnostic logging is globally flexible.",
      "coreMechanic": "1. Backup Data Plane (Strictly Regional): A Recovery Services Vault can ONLY protect VMs located in the exact same Azure region as the vault.\n2. Monitoring Telemetry Plane (Globally Flexible): Azure Monitor Diagnostic Settings allow streaming resource logs and metrics across regions. An Azure Recovery Services Vault in East US CAN stream diagnostic logs (`AzureBackupReport`, `CoreAzureBackup`) to a Log Analytics workspace in ANY region globally.",
      "distractors": {
        "A": "False; Log Analytics workspaces accept diagnostic telemetry from any region.",
        "C": "Azure Backup Reports are built directly on Log Analytics workspaces and Azure Workbooks.",
        "D": "Azure diagnostic telemetry routes internally over the Microsoft global WAN backbone without ExpressRoute."
      },
      "heuristic": "RSV VM Backup = STRICTLY same region. RSV Diagnostic Settings / Backup Reports = CAN stream to Log Analytics in ANY region.",
      "msLearnUrl": "https://learn.microsoft.com/azure/backup/configure-reports",
      "errorJournalRef": "AR PT02 Q65"
    }
  },
  {
    "id": "e1-q29",
    "examNumber": 1,
    "domain": "Domain 5: Monitor and maintain Azure resources",
    "domainCode": 5,
    "topic": "Azure Disk Backup Architecture & Required RBAC Roles",
    "scenario": "You need to configure scheduled, automated backups for an Azure Managed Data Disk named `disk-db-logs` attached to a mission-critical database VM.\n\nYou create a Backup Vault named `bv-disks-eus`. You enable a system-assigned managed identity on `bv-disks-eus`.\n\nWhich RBAC roles must be assigned to the Backup Vault's managed identity on the **source disk** and on the **target snapshot resource group**?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Virtual Machine Contributor on the source VM, and Contributor on the target resource group."
      },
      {
        "id": "B",
        "text": "Storage Blob Data Contributor on the source disk, and Reader on the target snapshot resource group."
      },
      {
        "id": "C",
        "text": "Disk Backup Reader on the source disk, and Disk Snapshot Contributor on the target snapshot resource group."
      },
      {
        "id": "D",
        "text": "Owner role across the entire Azure subscription."
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C is correct.",
      "triggerConstraints": "Requirement: Configure Azure Disk Backup with least privilege RBAC permissions for the Backup Vault managed identity.",
      "flawedMentalModel": "Assuming generic Contributor or VM Contributor roles are used, or violating least privilege.",
      "coreMechanic": "Azure Disk Backup uses an agentless control-plane architecture managed by a Backup Vault:\n1. On the Source Managed Disk (or source RG): Assign `Disk Backup Reader` to the vault's managed identity to read disk properties.\n2. On the Target Resource Group (where disk snapshots are stored): Assign `Disk Snapshot Contributor` to the vault's managed identity to create and manage snapshot lifecycles.\n3. During Restore: The vault identity requires `Disk Restore Operator` on the target resource group.",
      "distractors": {
        "A": "Virtual Machine Contributor manages VMs, not disk snapshots, and violates least privilege.",
        "B": "Storage Blob Data Contributor is for Blob Storage, not Managed Disks.",
        "D": "Assigning Owner violates least privilege."
      },
      "heuristic": "Azure Disk Backup = Backup Vault (Agentless). Vault Managed Identity needs Disk Backup Reader on Source Disk + Disk Snapshot Contributor on Target RG.",
      "msLearnUrl": "https://learn.microsoft.com/azure/backup/disk-backup-overview#prerequisites",
      "errorJournalRef": "AR PT02 Q54"
    }
  },
  {
    "id": "e1-q30",
    "examNumber": 1,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "Blob Lifecycle Rule Targets: Base Blobs vs. Versions",
    "scenario": "You have a General Purpose v2 storage account where Blob Versioning is enabled. You create the following lifecycle management JSON rule:\n\n```json\n{\n  \"rules\": [\n    {\n      \"name\": \"archiveNonCurrent\",\n      \"enabled\": true,\n      \"type\": \"Lifecycle\",\n      \"definition\": {\n        \"actions\": {\n          \"version\": {\n            \"tierToCool\": {\n              \"daysAfterCreationGreaterThan\": 30\n            }\n          }\n        },\n        \"filters\": {\n          \"blobTypes\": [ \"blockBlob\" ]\n        }\n      }\n    }\n  ]\n}\n```\n\nA blob named `contract.pdf` was created 45 days ago in the Hot tier and has never been overwritten, modified, or updated.\n\nWill `contract.pdf` be transitioned to the Cool tier by this rule?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Yes, because 45 days exceeds the 30-day threshold and contract.pdf is the first version of the blob."
      },
      {
        "id": "B",
        "text": "Yes, because lifecycle rules treat the current blob as version 1 until modified."
      },
      {
        "id": "C",
        "text": "No, because tierToCool only supports daysAfterModificationGreaterThan, not daysAfterCreationGreaterThan."
      },
      {
        "id": "D",
        "text": "No, because the rule's actions block targets 'version' (historical non-current versions only); transitioning the active base blob requires a 'baseBlob' action block."
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D is correct.",
      "triggerConstraints": "Requirement: Determine if active, unmodified blob transitions under a rule with only an actions.version block.",
      "flawedMentalModel": "Assuming actions inside the 'version' block apply to all blobs or that the active base blob is treated as an eligible version.",
      "coreMechanic": "In Azure Blob lifecycle management, action targets are strictly segregated:\n1. `baseBlob`: Targets the current, active version of the blob.\n2. `version`: Targets historical non-current versions generated when versioning is enabled and a blob is overwritten.\n3. `snapshot`: Targets point-in-time snapshots.\nBecause contract.pdf was never overwritten or modified, no historical version exists. Actions inside the 'version' block NEVER apply to the active base blob.",
      "distractors": {
        "A": "Active blobs are base blobs, not non-current versions.",
        "B": "The current base blob is not evaluated by the 'version' action block.",
        "C": "daysAfterCreationGreaterThan is valid and supported on versions and base blobs."
      },
      "heuristic": "Lifecycle rule JSON: Actions on `version` ONLY affect historical non-current versions. Transitioning active blobs requires an explicit `baseBlob` action block.",
      "msLearnUrl": "https://learn.microsoft.com/azure/storage/blobs/lifecycle-management-overview#rule-actions",
      "errorJournalRef": "AR PT02 Q5"
    }
  },
  {
    "id": "e1-q31",
    "examNumber": 1,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "Azure Files Tier Selection: Premium vs. Standard for Write-Intensive SMB",
    "scenario": "You are migrating a write-intensive database logging application to Azure Files SMB shares. The application requires:\n1. Consistent sub-millisecond latencies for random read and write operations\n2. Provisioned IOPS up to 50,000 and throughput up to 1,500 MB/s\n3. Full support for SMB 3.1.1 protocol\n\nWhich Azure Storage account type and file share tier should you deploy?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "FileStorage storage account with the Premium tier."
      },
      {
        "id": "B",
        "text": "General Purpose v2 (GPv2) storage account with the Transaction Optimized tier."
      },
      {
        "id": "C",
        "text": "General Purpose v2 (GPv2) storage account with the Hot tier."
      },
      {
        "id": "D",
        "text": "BlobStorage account with Large File Shares enabled."
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A (FileStorage Premium) is correct.",
      "triggerConstraints": "Requirement: Write-intensive SMB share with sub-millisecond latency and high provisioned IOPS.",
      "flawedMentalModel": "Selecting Standard Transaction Optimized (Option B), assuming transaction optimization improves physical disk performance.",
      "coreMechanic": "1. Standard Azure Files (GPv2): Backed by spinning hard drives (HDDs). 'Transaction Optimized' is purely a billing tier that reduces per-transaction API fees, but does NOT improve physical disk I/O latency (double-digit ms latency).\n2. Azure Files Premium (FileStorage account): Backed by Solid-State Drives (SSDs). Purpose-built for write-heavy workloads, databases, and enterprise applications. Delivers consistent single-digit / sub-millisecond latency, provisioned IOPS (up to 100,000 IOPS), and provisioned throughput (up to 10,340 MB/s).",
      "distractors": {
        "B": "Transaction Optimized is HDD-backed and cannot provide sub-millisecond latency or 50k IOPS.",
        "C": "Hot tier is HDD-backed general purpose storage with higher latency.",
        "D": "BlobStorage accounts do not support Azure Files SMB shares."
      },
      "heuristic": "Write-intensive + low latency / high IOPS SMB = Azure Files Premium (FileStorage SSD). Transaction Optimized = Standard HDD billing structure only.",
      "msLearnUrl": "https://learn.microsoft.com/azure/storage/files/storage-files-planning#storage-tiers",
      "errorJournalRef": "AR PT02 Q10"
    }
  },
  {
    "id": "e1-q32",
    "examNumber": 1,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "Storage Account Types Supporting Lifecycle Management",
    "scenario": "Your enterprise has three Azure Storage accounts:\n- `stgpv2data` (Kind: StorageV2 - General Purpose v2)\n- `stblobarchive` (Kind: BlobStorage)\n- `stpremiumfiles` (Kind: FileStorage)\n\nYou need to implement automated lifecycle management policies (auto-tiering to Cool and Archive, and scheduled blob deletion).\n\nWhich of these storage accounts support Azure Lifecycle Management policies?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "stgpv2data only"
      },
      {
        "id": "B",
        "text": "stgpv2data and stblobarchive only"
      },
      {
        "id": "C",
        "text": "stpremiumfiles only"
      },
      {
        "id": "D",
        "text": "All three storage accounts"
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B (stgpv2data and stblobarchive only) is correct.",
      "triggerConstraints": "Requirement: Determine which storage accounts support Blob Lifecycle Management.",
      "flawedMentalModel": "Assuming all storage accounts support lifecycle management, or assuming only GPv2 supports it.",
      "coreMechanic": "Azure Lifecycle Management operates exclusively on Block Blobs and Append Blobs.\n1. Supported account types: General Purpose v2 (StorageV2), BlobStorage, and BlockBlobStorage (Premium Block Blobs).\n2. Unsupported account types:\n- FileStorage: Dedicated exclusively to Azure Files shares; does not host blob containers.\n- General Purpose v1 (Storage): Legacy accounts lacking tiering and lifecycle features.",
      "distractors": {
        "A": "BlobStorage accounts also support lifecycle policies for block blobs.",
        "C": "FileStorage accounts host SMB/NFS file shares and do not support blob lifecycle rules.",
        "D": "FileStorage accounts are incompatible with blob lifecycle policies."
      },
      "heuristic": "Blob Lifecycle Management = GPv2, BlobStorage, BlockBlobStorage. NEVER FileStorage (filestore) or GPv1.",
      "msLearnUrl": "https://learn.microsoft.com/azure/storage/blobs/lifecycle-management-overview#supported-accounts",
      "errorJournalRef": "AR PT02 Q12"
    }
  },
  {
    "id": "e1-q33",
    "examNumber": 1,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "Azure Bastion Public IP Tier Requirements (Regional vs. Global)",
    "scenario": "You are deploying a new Azure Bastion host (`bastion-hub`) into `vnet-hub-eus` in the `East US` region.\n\nYou create a Public IP address resource named `pip-bastion` with the following configuration:\n- SKU: **Standard**\n- Tier: **Global**\n- Allocation: **Static**\n\nWhen you attempt to deploy the Bastion host using `pip-bastion`, ARM template validation fails with an error indicating an incompatible public IP configuration.\n\nWhy did this deployment fail?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Azure Bastion requires a Basic SKU Public IP address with dynamic allocation."
      },
      {
        "id": "B",
        "text": "Azure Bastion cannot be assigned a Public IP address; it uses private IP injection only."
      },
      {
        "id": "C",
        "text": "Azure Bastion requires the Public IP address to be configured with the Regional tier, not the Global tier."
      },
      {
        "id": "D",
        "text": "pip-bastion must be assigned to Azure Firewall before Bastion can associate with it."
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C is correct.",
      "triggerConstraints": "Requirement: Configure Public IP for Azure Bastion. Failed configuration: Standard SKU, Static, Global tier.",
      "flawedMentalModel": "Assuming any Standard SKU Public IP works with Bastion, overlooking the distinction between Regional and Global tiers.",
      "coreMechanic": "Azure Public IP Standard SKU has two distinct tiers:\n1. Regional Tier: Bound to a single Azure region. Assigned to regional compute and networking resources (VMs, Application Gateways, Azure Bastion).\n2. Global Tier: Spans multiple Azure regions. Exclusively designed to front-end Azure Cross-Region Load Balancers.\nAzure Bastion Public IP Requirements:\n- SKU: Standard\n- Allocation: Static\n- Tier: Regional ONLY. Associating a Global tier Public IP triggers validation failure.",
      "distractors": {
        "A": "Basic SKU and dynamic allocation are unsupported by Azure Bastion.",
        "B": "Azure Bastion requires a public IP address for internet ingress to the proxy service.",
        "D": "Azure Bastion has no dependency on Azure Firewall."
      },
      "heuristic": "Azure Bastion Public IP = Standard SKU + Static Allocation + Regional Tier ONLY. Global tier is for Cross-Region Load Balancers.",
      "msLearnUrl": "https://learn.microsoft.com/azure/bastion/bastion-faq#ip-requirements",
      "errorJournalRef": "AR PT02 Q24"
    }
  },
  {
    "id": "e1-q34",
    "examNumber": 1,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "AzureBastionSubnet Mandatory Inbound NSG Security Rules",
    "scenario": "You are applying a Network Security Group (`nsg-bastion`) to `AzureBastionSubnet` to harden management access.\n\nWhich **Inbound** security rule is MANDATORY on `nsg-bastion` to allow administrators to connect to the Bastion service from their client web browsers?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Allow Inbound TCP port 3389 and TCP port 22 from Internet."
      },
      {
        "id": "B",
        "text": "Allow Inbound UDP port 500 and UDP port 4500 from Any."
      },
      {
        "id": "C",
        "text": "Allow Inbound TCP port 80 (HTTP) from Internet."
      },
      {
        "id": "D",
        "text": "Allow Inbound TCP port 443 (HTTPS) from Internet and GatewayManager."
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D is correct.",
      "triggerConstraints": "Requirement: Mandatory Inbound NSG rule on AzureBastionSubnet for administrative access.",
      "flawedMentalModel": "Selecting Inbound RDP (3389) and SSH (22). Those are OUTBOUND rules from Bastion to the target VM subnets.",
      "coreMechanic": "Azure Bastion is an SSL/TLS reverse proxy:\n1. Inbound to AzureBastionSubnet: Administrators connect from browsers over HTTPS on TCP port 443 from Internet and the service tag `GatewayManager`. Inbound 443 is mandatory.\n2. Outbound from AzureBastionSubnet: Bastion opens internal RDP (TCP 3389) and SSH (TCP 22) connections to target workload VMs. These are OUTBOUND rules towards VirtualNetwork.",
      "distractors": {
        "A": "RDP 3389 and SSH 22 are outbound rules from BastionSubnet to VMs, never inbound from Internet.",
        "B": "UDP 500/4500 are IPsec ports used for VPN Gateways, not Bastion.",
        "C": "Bastion requires encrypted TLS on port 443; port 80 is not used."
      },
      "heuristic": "`AzureBastionSubnet` NSG: INBOUND = HTTPS (TCP 443) from Internet/GatewayManager. OUTBOUND = RDP (TCP 3389) & SSH (TCP 22) to VirtualNetwork.",
      "msLearnUrl": "https://learn.microsoft.com/azure/bastion/bastion-nsg",
      "errorJournalRef": "AR PT02 Q25"
    }
  },
  {
    "id": "e1-q35",
    "examNumber": 1,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "Subnet Without NSG vs. NIC NSG Inbound Traffic Evaluation",
    "scenario": "You have a Virtual Network with two subnets:\n- `Subnet1`: Has `nsg-subnet1` attached (with only default rules, blocking all inbound traffic from Internet).\n- `Subnet2`: Has **NO NSG attached** (`NSG = None`).\n\nYou deploy `vm-app-2` into `Subnet2`. `vm-app-2`'s network interface has a dedicated NIC NSG named `nsg-nic-app2` attached. `nsg-nic-app2` contains an explicit rule at Priority 100: `Allow Inbound TCP port 443 from Internet`.\n\nAn administrator connects from the Internet to `vm-app-2` over HTTPS (port 443).\n\nWill the connection be allowed by Azure SDN?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Yes, because Subnet2 has no NSG so all traffic passes through freely to the NIC layer, where nsg-nic-app2 explicitly allows TCP 443."
      },
      {
        "id": "B",
        "text": "No, because subnets without an NSG default to denying all inbound Internet traffic."
      },
      {
        "id": "C",
        "text": "No, because Azure requires both a Subnet NSG and a NIC NSG to be present before custom allow rules can be processed."
      },
      {
        "id": "D",
        "text": "No, because the Subnet1 NSG applies to all subnets across the entire Virtual Network."
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A is correct.",
      "triggerConstraints": "Requirement: Inbound traffic evaluation when Subnet has NSG = None, but NIC has an NSG with an allow rule.",
      "flawedMentalModel": "Assuming subnets have invisible default NSGs that block traffic, or assuming both subnet and NIC NSGs must exist.",
      "coreMechanic": "1. Subnets Have NO NSG by Default: In Azure, assigning an NSG to a subnet is completely optional (default is None). If a subnet has no NSG, it enforces ZERO traffic filtering—all inbound and outbound traffic passes through the subnet layer unimpeded.\n2. Packet Flow to vm-app-2:\n- Subnet Layer (Subnet2): No NSG attached -> Packet passes through without evaluation.\n- NIC Layer: nsg-nic-app2 evaluates -> Matches Priority 100 Allow Inbound TCP 443 -> ALLOWED.",
      "distractors": {
        "B": "Subnets without NSGs do not drop traffic; they allow all traffic to reach the NIC.",
        "C": "Azure does not require both NSGs; traffic evaluates only against whichever NSGs are attached.",
        "D": "NSGs attached to Subnet1 only apply to Subnet1, not other subnets."
      },
      "heuristic": "Subnets have NO NSG by default. If a subnet has no NSG, traffic passes through freely, and ONLY the NIC-level NSG rules determine allow/deny.",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-network/network-security-group-how-it-works",
      "errorJournalRef": "AR PT01 Q24"
    }
  },
  {
    "id": "e1-q36",
    "examNumber": 1,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "Regional Scope of Network Security Groups (NSGs)",
    "scenario": "Your enterprise deploys virtual machine subnets across two Azure regions: `East US` and `West Europe`.\n\nYou need to enforce identical inbound and outbound network security rules across the subnets in both regions.\n\nWhat is the MINIMUM number of Network Security Groups (NSGs) that you must deploy?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "1 (a single global NSG can be associated with subnets in any region)"
      },
      {
        "id": "B",
        "text": "2 (at least one NSG per Azure region)"
      },
      {
        "id": "C",
        "text": "4 (one NSG per subnet in each region)"
      },
      {
        "id": "D",
        "text": "None (rules can be defined directly at the Azure subscription root)"
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B (2 NSGs) is correct.",
      "triggerConstraints": "Requirement: Apply security rules to subnets in East US and West Europe with the minimum number of NSGs.",
      "flawedMentalModel": "Assuming an NSG is a global resource that can span across multiple Azure regions.",
      "coreMechanic": "A Network Security Group (NSG) is strictly a regional resource. An NSG can ONLY be associated with subnets or NICs located in the exact same Azure region as the NSG itself. It is impossible to associate an East US NSG with a West Europe subnet. Therefore, you must deploy a minimum of 2 NSGs (one in East US, one in West Europe).",
      "distractors": {
        "A": "Global NSGs do not exist; cross-region NSG association fails ARM validation.",
        "C": "One NSG can be associated with multiple subnets within the same region, so 4 is not the minimum.",
        "D": "Subscription roots do not host NSG rule associations."
      },
      "heuristic": "NSGs are regional resources: Subnet and NSG MUST reside in the same region -> 2 regions = minimum 2 NSGs.",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-network/network-security-groups-overview",
      "errorJournalRef": "AR PT01 Q20"
    }
  },
  {
    "id": "e1-q37",
    "examNumber": 1,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "Application Security Groups (ASGs) VNet Boundary",
    "scenario": "You have two Virtual Networks in the `East US` region connected via Virtual Network Peering:\n- `vnet-web` (contains web servers `web-01` and `web-02`)\n- `vnet-db` (contains database servers `db-01` and `db-02`)\n\nYou create an Application Security Group named `asg-web` in `vnet-web`.\n\nYou attempt to add the network interface of `web-03` (which is located in `vnet-db`) to `asg-web`.\n\nWhy does this operation fail?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "VNet Peering is inactive between vnet-web and vnet-db."
      },
      {
        "id": "B",
        "text": "Application Security Groups can only contain up to two network interfaces."
      },
      {
        "id": "C",
        "text": "All network interfaces assigned to an Application Security Group must reside in the exact same Virtual Network."
      },
      {
        "id": "D",
        "text": "ASGs require an Azure Firewall to process cross-VNet traffic."
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C is correct.",
      "triggerConstraints": "Requirement: Assign NICs from two peered VNets to the same Application Security Group.",
      "flawedMentalModel": "Assuming VNet peering allows Application Security Groups to span across virtual networks.",
      "coreMechanic": "All network interfaces (NICs) assigned to an Application Security Group (ASG) MUST exist within the exact same Virtual Network. Even if two VNets are peered in the same region, an ASG cannot contain NICs from different VNets.",
      "distractors": {
        "A": "Even with active peering, cross-VNet ASG association is strictly unsupported by ARM SDN.",
        "B": "ASGs support thousands of NICs within the same VNet.",
        "D": "Azure Firewall is unrelated to ASG membership boundaries."
      },
      "heuristic": "Application Security Groups (ASGs): All NICs in an ASG MUST reside in the exact same Virtual Network. Never cross-VNet!",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-network/application-security-groups",
      "errorJournalRef": "azure_placement_and_boundary_matrix.md"
    }
  },
  {
    "id": "e1-q38",
    "examNumber": 1,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "Storage Customer-Managed Keys (CMK) Cryptographic Requirements",
    "scenario": "You are configuring Storage Service Encryption (SSE) with Customer-Managed Keys (CMK) stored in Azure Key Vault for an Azure Storage account.\n\nYou need to generate the Key Encryption Key (KEK) inside Azure Key Vault.\n\nWhich cryptographic key type and size is supported for the KEK in Azure Storage CMK?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Symmetric AES-256 bit key"
      },
      {
        "id": "B",
        "text": "Elliptic Curve (EC) key with curve P-256 or P-384"
      },
      {
        "id": "C",
        "text": "RSA key of size 1024 bits"
      },
      {
        "id": "D",
        "text": "Asymmetric RSA key of size 2048, 3072, or 4096 bits"
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D is correct.",
      "triggerConstraints": "Requirement: Configure KEK in Key Vault for Azure Storage CMK.",
      "flawedMentalModel": "Assuming Azure Storage CMK uses symmetric AES-256 keys because underlying data is encrypted with AES-256, or assuming Elliptic Curve (EC) keys are supported for key wrapping.",
      "coreMechanic": "Azure Storage CMK implements envelope encryption: data is encrypted with an AES-256 Data Encryption Key (DEK), and the DEK is wrapped by the Key Encryption Key (KEK) stored in Azure Key Vault. The KEK in Azure Key Vault MUST be an asymmetric RSA key of bit length 2048, 3072, or 4096. Azure Storage CMK does NOT support symmetric keys (AES) or Elliptic Curve (EC) keys.",
      "distractors": {
        "A": "Azure Storage CMK does not support symmetric AES keys as KEKs.",
        "B": "EC keys are used for digital signatures, not key wrapping in Azure Storage encryption.",
        "C": "RSA 1024 is insecure and blocked by Azure Key Vault validation."
      },
      "heuristic": "Azure Storage CMK in Key Vault = RSA 2048, 3072, or 4096 only. Never symmetric (AES) and never EC.",
      "msLearnUrl": "https://learn.microsoft.com/azure/storage/common/customer-managed-keys-overview#about-customer-managed-keys",
      "errorJournalRef": "AR PT01 Q6"
    }
  },
  {
    "id": "e1-q39",
    "examNumber": 1,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "ARM Template Deployment Modes: Incremental vs. Complete",
    "scenario": "You deploy resources to an Azure Resource Group named `rg-apps` using the Azure CLI command `az deployment group create`.\n\nThe resource group currently contains three virtual machines (`vm1`, `vm2`, and `vm3`).\n\nYour ARM template defines only `vm1` and `vm2`.\n\nYou want to deploy the template such that `vm3` is **automatically deleted** from the resource group because it is not declared in the template.\n\nWhich parameter must you specify in the Azure CLI command?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "--mode Complete"
      },
      {
        "id": "B",
        "text": "--mode Incremental"
      },
      {
        "id": "C",
        "text": "--deployment-mode Strict"
      },
      {
        "id": "D",
        "text": "--purge-unreferenced true"
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A is correct.",
      "triggerConstraints": "Requirement: Delete resources in the Resource Group that are not defined in the template. Azure CLI command.",
      "flawedMentalModel": "Guessing parameters like --deployment-mode or confusing Incremental with Complete.",
      "coreMechanic": "ARM Template Deployment Modes:\n1. Incremental (--mode Incremental, Default): ARM adds or modifies resources declared in the template; existing resources in the RG not in the template remain completely untouched.\n2. Complete (--mode Complete): ARM deletes resources present in the Resource Group that are not defined in the template (subject to specific resource type exemptions and resource locks).",
      "distractors": {
        "B": "Incremental mode leaves vm3 untouched.",
        "C": "--deployment-mode is invalid CLI parameter syntax.",
        "D": "--purge-unreferenced is not a valid ARM deployment parameter."
      },
      "heuristic": "ARM deployment mode parameter = `--mode` (CLI) or `-Mode` (PowerShell). Values: Incremental (default) or Complete.",
      "msLearnUrl": "https://learn.microsoft.com/azure/azure-resource-manager/templates/deployment-modes",
      "errorJournalRef": "AR PT01 Q36"
    }
  },
  {
    "id": "e1-q40",
    "examNumber": 1,
    "domain": "Domain 5: Monitor and maintain Azure resources",
    "domainCode": 5,
    "topic": "Recovery Services Vault: Standard vs. Enhanced Backup Policies",
    "scenario": "You have a modern Azure Virtual Machine (`vm-trusted-db`) configured with **Trusted Launch**, an attached **Ultra Disk**, and an attached **Premium SSD v2** data disk.\n\nYou need to configure a backup policy in a Recovery Services Vault using the Azure Portal.\n\nWhich backup policy type MUST be used?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Standard Policy"
      },
      {
        "id": "B",
        "text": "Enhanced Policy"
      },
      {
        "id": "C",
        "text": "Basic Policy"
      },
      {
        "id": "D",
        "text": "Archive Policy"
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B (Enhanced Policy) is correct.",
      "triggerConstraints": "Requirement: Back up VM with Trusted Launch, Ultra Disks, and Premium SSD v2 using Azure Portal.",
      "flawedMentalModel": "Assuming Standard Policy supports Ultra Disks or Premium SSD v2.",
      "coreMechanic": "Recovery Services Vault Policy Differences:\n1. Standard Policy: Supports only 1 backup per day. Does NOT support Premium SSD v2 or Ultra Disks. The Azure Portal blocks configuring Standard Policy for Trusted Launch VMs (only supported via CLI/API).\n2. Enhanced Policy: Supports sub-daily snapshots (as frequent as every 4 hours), fully supports Premium SSD v2 and Ultra Disks, and provides native Azure Portal support for Trusted Launch VMs.",
      "distractors": {
        "A": "Standard policy does not support Ultra Disks or Premium SSD v2.",
        "C": "Basic Policy does not exist in Azure Backup.",
        "D": "Archive is a storage retention tier, not a vault policy type."
      },
      "heuristic": "Standard Policy = 1/day, no Ultra/Prem SSD v2; Trusted Launch via CLI only. Enhanced Policy = Multiple/day, Ultra/Prem SSD v2, full Trusted Launch portal support.",
      "msLearnUrl": "https://learn.microsoft.com/azure/backup/backup-azure-vms-enhanced-policy",
      "errorJournalRef": "AR PT01 Q53"
    }
  },
  {
    "id": "e1-q41",
    "examNumber": 1,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "Virtual Machine Scale Sets: Flexible Mode VM Attachment Prerequisites",
    "scenario": "You have an existing standalone Azure Virtual Machine named `vm-api-01` deployed in `rg-workloads` in the `East US` region.\n\nYou create a Virtual Machine Scale Set named `vmss-api` configured in **Flexible orchestration mode** in `rg-scale-sets` in the `East US` region.\n\nYou attempt to attach `vm-api-01` to `vmss-api`.\n\nThe Azure Portal disables the option to attach `vm-api-01`.\n\nWhat is the reason for this restriction?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Standalone VMs can only be attached to Uniform orchestration scale sets."
      },
      {
        "id": "B",
        "text": "VMSS Flexible mode does not support attaching existing virtual machines."
      },
      {
        "id": "C",
        "text": "The standalone VM must reside in the exact same Resource Group as the Flexible VMSS."
      },
      {
        "id": "D",
        "text": "vm-api-01 must be placed in an Availability Set before attachment."
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C is correct.",
      "triggerConstraints": "Requirement: Attach existing standalone VM to Flexible VMSS. Setup: VM is in rg-workloads; VMSS is in rg-scale-sets. Both in East US.",
      "flawedMentalModel": "Assuming same region and subscription is sufficient, overlooking the Resource Group boundary constraint.",
      "coreMechanic": "To attach an existing standalone virtual machine to a Virtual Machine Scale Set operating in Flexible mode, the VM must satisfy three strict requirements:\n1. SAME Azure Region as the VMSS.\n2. SAME Resource Group as the VMSS (cross-RG attachment is blocked by ARM validation).\n3. Connected to the same Virtual Network / Subnet configured on the scale set.",
      "distractors": {
        "A": "Uniform mode creates identical clones from a model and CANNOT attach existing standalone VMs.",
        "B": "Flexible mode explicitly supports attaching existing standalone VMs, provided placement rules are met.",
        "D": "Availability Set membership is not required and would conflict with VMSS fault domain mapping."
      },
      "heuristic": "VMSS Flexible Mode VM Attachment: MUST be in the SAME Region AND the SAME Resource Group!",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-attach-detach-vm",
      "errorJournalRef": "azure_placement_and_boundary_matrix.md"
    }
  },
  {
    "id": "e1-q42",
    "examNumber": 1,
    "domain": "Domain 5: Monitor and maintain Azure resources",
    "domainCode": 5,
    "topic": "Cost Optimization: Azure Advisor vs. Azure Monitor",
    "scenario": "Your enterprise management asks you to conduct a cost-optimization review across 100 Azure Virtual Machines. You need to identify **idle, underutilized, and oversized VMs** to generate right-sizing and shutdown recommendations that will lower ongoing compute spend.\n\nWhich Azure service natively analyzes resource utilization against operational best practices and generates proactive right-sizing cost recommendations?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Azure Monitor"
      },
      {
        "id": "B",
        "text": "Azure Service Health"
      },
      {
        "id": "C",
        "text": "Application Insights"
      },
      {
        "id": "D",
        "text": "Azure Advisor"
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D (Azure Advisor) is correct.",
      "triggerConstraints": "Requirement: Identify idle and underutilized VMs to generate proactive right-sizing cost optimization recommendations.",
      "flawedMentalModel": "Selecting Azure Monitor because it collects VM CPU and memory performance telemetry.",
      "coreMechanic": "1. Azure Monitor: Telemetry collection engine. Collects metrics, logs, application traces, and fires alert rules. It displays what IS happening, but does NOT generate proactive right-sizing recommendations.\n2. Azure Advisor: Personalized cloud recommendation engine. Analyzes resource telemetry against best-practice guidelines across 5 pillars: Cost (right-sizing/shutting down idle VMs), Security, Reliability, Performance, and Operational Excellence.",
      "distractors": {
        "A": "Azure Monitor collects telemetry; it does not generate right-sizing recommendations.",
        "B": "Azure Service Health tracks Azure datacenter outages and planned maintenance.",
        "C": "Application Insights monitors application performance (APM), not VM infrastructure cost sizing."
      },
      "heuristic": "Identify underutilized/idle VMs to cut costs or right-size = Always Azure Advisor (never Azure Monitor).",
      "msLearnUrl": "https://learn.microsoft.com/azure/advisor/advisor-cost-recommendations",
      "errorJournalRef": "TD Sampler Q5"
    }
  },
  {
    "id": "e1-q43",
    "examNumber": 1,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "AzCopy CLI Syntax & Recursive Directory Migration",
    "scenario": "You need to copy an on-premises folder `D:\\MarketingAssets` and all of its nested subdirectories and files to an Azure Storage Blob container named `media` in storage account `stassets`.\n\nWhich AzCopy v10 command syntax correctly executes this transfer?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "azcopy copy \"D:\\MarketingAssets\" \"https://stassets.blob.core.windows.net/media\" --recursive"
      },
      {
        "id": "B",
        "text": "azcopy copy \"https://stassets.blob.core.windows.net/media\" \"D:\\MarketingAssets\" --all"
      },
      {
        "id": "C",
        "text": "azcopy sync \"D:\\MarketingAssets\" \"https://stassets.blob.core.windows.net/media\" --include-subfolders"
      },
      {
        "id": "D",
        "text": "az storage blob copy start-batch --source \"D:\\MarketingAssets\" --destination media"
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A is correct.",
      "triggerConstraints": "Requirement: Copy local folder + all subdirectories to Azure Blob container using AzCopy.",
      "flawedMentalModel": "Inverting source and destination, or forgetting the mandatory --recursive flag.",
      "coreMechanic": "AzCopy v10 syntax is strictly: `azcopy copy <SOURCE> <DESTINATION> [FLAGS]`.\n1. When uploading: Source is local path, Destination is storage blob container URL.\n2. To include nested subdirectories, the `--recursive` flag is mandatory. Without `--recursive`, AzCopy copies only top-level files or skips directories.",
      "distractors": {
        "B": "Inverts source and destination (this would download from Azure to local).",
        "C": "--include-subfolders is an invalid flag in AzCopy v10 (the flag is --recursive).",
        "D": "az storage blob copy start-batch is for cloud-to-cloud transfers between storage accounts."
      },
      "heuristic": "Upload local folder + subfolders to Azure Blob = `azcopy copy <LocalPath> <BlobURL> --recursive`.",
      "msLearnUrl": "https://learn.microsoft.com/azure/storage/common/storage-use-azcopy-blobs-upload#upload-the-contents-of-a-directory",
      "errorJournalRef": "TD Sampler Q7"
    }
  },
  {
    "id": "e1-q44",
    "examNumber": 1,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "Blob Container Leases (HTTP 412 Precondition Failed)",
    "scenario": "An administrator attempts to delete a blob container named `app-backups` in the Azure Portal. The operation fails immediately with the error: `HTTP 412: There is currently a lease on the container and no lease ID was specified in the request`.\n\nWhat action must the administrator take before the container can be deleted?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Acquire an exclusive write lock using an Azure PowerShell script."
      },
      {
        "id": "B",
        "text": "Select 'Break lease' on the container in the Azure Portal."
      },
      {
        "id": "C",
        "text": "Assign the Storage Account Contributor role to the administrator's account."
      },
      {
        "id": "D",
        "text": "Restart the storage account service via Azure CLI."
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B (Break lease) is correct.",
      "triggerConstraints": "Requirement: Resolve HTTP 412 when attempting to modify or delete a leased blob container.",
      "flawedMentalModel": "Assuming higher RBAC permissions override an active storage lease.",
      "coreMechanic": "An active blob or container lease establishes an exclusive lock against concurrent writes or deletion. When a lease is active, modifying policies or deleting the container returns HTTP 412 (Precondition Failed) unless the caller provides the LeaseId. In the Azure Portal, an administrator must select 'Break lease' on the container to transition the lease state to broken.",
      "distractors": {
        "A": "Acquiring another lease does not allow deletion without breaking the existing lease.",
        "C": "Storage leases are storage data-plane concurrency locks that cannot be bypassed by RBAC roles.",
        "D": "Storage accounts cannot be 'restarted'."
      },
      "heuristic": "HTTP 412 on Storage Blob / Container = Active lease lock. Must break lease.",
      "msLearnUrl": "https://learn.microsoft.com/rest/api/storageservices/lease-container",
      "errorJournalRef": "error_journal.md"
    }
  },
  {
    "id": "e1-q45",
    "examNumber": 1,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "Dedicated Subnet Sizing & Naming Constraints",
    "scenario": "You are designing an Azure Virtual Network topology that requires dedicated subnets for:\n1. Azure Bastion Host\n2. Azure VPN Gateway\n\nWhich combination of mandatory subnet names and minimum CIDR prefix sizes is correct?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "snet-bastion (minimum /28) and snet-gateway (minimum /28)"
      },
      {
        "id": "B",
        "text": "AzureBastionSubnet (minimum /24) and GatewaySubnet (minimum /24)"
      },
      {
        "id": "C",
        "text": "AzureBastionSubnet (minimum /26) and GatewaySubnet (minimum /29, /27 recommended)"
      },
      {
        "id": "D",
        "text": "BastionSubnet (minimum /26) and VPNGatewaySubnet (minimum /27)"
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C is correct.",
      "triggerConstraints": "Requirement: Identify mandatory subnet names and minimum CIDR sizes for Bastion and VPN Gateway.",
      "flawedMentalModel": "Assuming custom subnet names can be chosen or confusing prefix size requirements.",
      "coreMechanic": "Azure enforces strict, case-sensitive reserved subnet names:\n1. Azure Bastion: MUST be named `AzureBastionSubnet`. Minimum prefix size is /26 (64 addresses) to support scale units.\n2. VPN / ExpressRoute Gateway: MUST be named `GatewaySubnet`. Minimum prefix is /29, but Microsoft strongly recommends /27 (or /28) to accommodate coexisting ExpressRoute and VPN gateways and future expansion.",
      "distractors": {
        "A": "Custom names like snet-bastion or snet-gateway will cause deployment failure.",
        "B": "/24 is unnecessarily large; minimums are /26 and /29.",
        "D": "Subnet names are strictly case-sensitive: AzureBastionSubnet and GatewaySubnet."
      },
      "heuristic": "AzureBastionSubnet = min /26. GatewaySubnet = min /27 recommended (min /29). Names are strictly case-sensitive!",
      "msLearnUrl": "https://learn.microsoft.com/azure/bastion/bastion-overview#subnet",
      "errorJournalRef": "azure_placement_and_boundary_matrix.md"
    }
  },
  {
    "id": "e1-q46",
    "examNumber": 1,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Entra ID Self-Service Password Reset (SSPR) Configuration",
    "scenario": "You are rolling out Self-Service Password Reset (SSPR) for all employees in your Microsoft Entra ID tenant. You configure SSPR with the following requirements:\n1. Users must be required to register 2 authentication methods before they can reset passwords.\n2. The supported methods must include Microsoft Authenticator app and Mobile phone (SMS).\n3. Password resets must write back to the on-premises Active Directory Domain Services (AD DS) forest.\n\nWhich component is MANDATORY to enable password writeback to your on-premises AD DS?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Azure Application Gateway with SSL termination"
      },
      {
        "id": "B",
        "text": "Active Directory Federation Services (AD FS) farm"
      },
      {
        "id": "C",
        "text": "Entra ID Application Proxy connector"
      },
      {
        "id": "D",
        "text": "Microsoft Entra Connect (or Entra Cloud Sync) with Password Writeback enabled"
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D is correct.",
      "triggerConstraints": "Requirement: Enable SSPR password writeback from Entra ID to on-premises AD DS.",
      "flawedMentalModel": "Assuming AD FS is required for password writeback, or confusing Application Proxy with directory synchronization.",
      "coreMechanic": "Password writeback is a feature of Microsoft Entra Connect (and Microsoft Entra Cloud Sync). It allows cloud-initiated password changes (such as SSPR or admin resets) to be written back to an on-premises Active Directory Domain Services environment in real time over an outbound encrypted channel. Neither AD FS nor Application Proxy is required.",
      "distractors": {
        "A": "Application Gateway is a web load balancer, unrelated to identity writeback.",
        "B": "AD FS is for federated authentication; SSPR writeback is handled via Entra Connect.",
        "C": "Application Proxy publishes internal web apps to external users."
      },
      "heuristic": "SSPR Password Writeback to On-Prem AD = Microsoft Entra Connect / Cloud Sync with Password Writeback enabled.",
      "msLearnUrl": "https://learn.microsoft.com/entra/identity/authentication/tutorial-enable-sspr-writeback",
      "errorJournalRef": "entra-id-master-architecture-and-governance.md"
    }
  },
  {
    "id": "e1-q47",
    "examNumber": 1,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Conditional Access: Policy Evaluation & Report-Only Mode",
    "scenario": "You are authoring a new Microsoft Entra Conditional Access policy to require Multi-Factor Authentication (MFA) and compliant devices for all users accessing the Azure Management portal.\n\nBefore enforcing the policy and potentially locking out legitimate administrators, management requires you to evaluate the policy's impact without actually enforcing MFA or blocking access.\n\nWhat policy state should you configure?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Report-only"
      },
      {
        "id": "B",
        "text": "Off"
      },
      {
        "id": "C",
        "text": "On"
      },
      {
        "id": "D",
        "text": "Audit"
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A (Report-only) is correct.",
      "triggerConstraints": "Requirement: Evaluate Conditional Access policy impact without enforcing grant controls or blocking users.",
      "flawedMentalModel": "Looking for 'Audit' (which is an Azure Policy effect, not a Conditional Access policy state).",
      "coreMechanic": "Microsoft Entra Conditional Access policies support three operational states:\n1. Report-only: Evaluates the policy conditions during sign-in and logs the hypothetical result (ReportOnlySuccess, ReportOnlyFailure, ReportOnlyNotApplied) to the sign-in logs without prompting for MFA or blocking access.\n2. On: Actively enforces the policy controls.\n3. Off: Completely disabled and does not evaluate or log.",
      "distractors": {
        "B": "Off does not evaluate or log policy results.",
        "C": "On enforces MFA immediately, risking admin lockouts.",
        "D": "Audit is not a valid state for Conditional Access policies (it is an Azure Policy effect)."
      },
      "heuristic": "Test Conditional Access policy without impact = Report-only mode.",
      "msLearnUrl": "https://learn.microsoft.com/entra/identity/conditional-access/concept-conditional-access-report-only",
      "errorJournalRef": "entra-id-part2-advanced-identity.md"
    }
  },
  {
    "id": "e1-q48",
    "examNumber": 1,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "VNet Peering Hub-Spoke Gateway Transit Configuration",
    "scenario": "You have a Hub-and-Spoke network architecture:\n- `vnet-hub`: Contains a Virtual Network Gateway connected to on-premises via Site-to-Site VPN.\n- `vnet-spoke1`: Contains workload virtual machines and has NO virtual network gateway.\n\nYou create a Virtual Network Peering connection between `vnet-hub` and `vnet-spoke1`.\n\nWhich settings must be enabled on each side of the peering connection to allow VMs in `vnet-spoke1` to route traffic through the gateway in `vnet-hub`?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "On vnet-hub peering: enable 'Use the remote virtual network's gateway'. On vnet-spoke1 peering: enable 'Allow gateway transit'."
      },
      {
        "id": "B",
        "text": "On vnet-hub peering: enable 'Allow gateway transit'. On vnet-spoke1 peering: enable 'Use the remote virtual network's gateway'."
      },
      {
        "id": "C",
        "text": "On both peering connections: enable 'Allow forwarded traffic' and 'Allow gateway transit'."
      },
      {
        "id": "D",
        "text": "Deploy a second Virtual Network Gateway in vnet-spoke1 and enable BGP peering."
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B is correct.",
      "triggerConstraints": "Requirement: Allow spoke VNet to share and route through the hub VNet's gateway.",
      "flawedMentalModel": "Confusing which side gets 'Allow gateway transit' vs 'Use the remote virtual network's gateway'.",
      "coreMechanic": "In a Hub-and-Spoke VNet peering setup:\n1. On the Hub VNet peering (towards the spoke): Enable 'Allow gateway transit' (declares that this VNet shares its gateway with the peer).\n2. On the Spoke VNet peering (towards the hub): Enable 'Use the remote virtual network's gateway' (tells the spoke to use the hub's gateway for routing).\nNote: A spoke cannot use a remote gateway if it already has its own gateway deployed.",
      "distractors": {
        "A": "Inverts the settings on hub and spoke.",
        "C": "A spoke VNet without a gateway cannot enable 'Allow gateway transit'.",
        "D": "A spoke cannot deploy its own gateway if it uses remote gateway transit."
      },
      "heuristic": "Gateway Transit in Hub-Spoke: Hub Peering = 'Allow gateway transit'. Spoke Peering = 'Use the remote virtual network's gateway'.",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-network/virtual-network-peering-overview#gateway-transit-and-on-premises-connectivity",
      "errorJournalRef": "azure_placement_and_boundary_matrix.md"
    }
  },
  {
    "id": "e1-q49",
    "examNumber": 1,
    "domain": "Domain 5: Monitor and maintain Azure resources",
    "domainCode": 5,
    "topic": "Azure Monitor Alert Processing Rules: Maintenance Suppression",
    "scenario": "Your operations team performs routine server patching on production virtual machines every Saturday between 02:00 UTC and 06:00 UTC.\n\nDuring this window, VM reboots trigger dozens of high-severity Azure Monitor metric alerts, generating unwanted on-call phone calls and emails from Action Groups.\n\nYou need to suppress all alert notifications during the scheduled maintenance window without disabling the underlying alert rules.\n\nWhat should you configure?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Create an Azure Automation runbook that runs a script to disable all metric alert rules at 02:00 UTC and re-enable them at 06:00 UTC."
      },
      {
        "id": "B",
        "text": "Modify the Action Group to remove email and SMS receivers."
      },
      {
        "id": "C",
        "text": "Create an Alert Processing Rule configured to 'Suppress notifications' with a weekly recurring schedule for Saturdays 02:00-06:00 UTC."
      },
      {
        "id": "D",
        "text": "Configure an Azure Advisor cost recommendation rule."
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C is correct.",
      "triggerConstraints": "Requirement: Suppress alert notifications during recurring maintenance window without disabling alert rules.",
      "flawedMentalModel": "Writing complex Automation runbooks to toggle alert rule states or manually editing Action Groups.",
      "coreMechanic": "Alert Processing Rules (formerly Action Rules) in Azure Monitor modify fired alerts as they occur:\n1. Rule Action: Select 'Suppress notifications'.\n2. Schedule: Configure recurring schedule (Weekly on Saturday from 02:00 to 06:00 UTC).\n3. Scope: Target the specific subscription, resource group, or VMs.\nAlert rules continue to fire and log history in the Azure Monitor alerts pane, but all Action Group notifications (email, SMS, push, webhook) are suppressed.",
      "distractors": {
        "A": "Disabling rules loses alert state history and requires maintaining custom automation scripts.",
        "B": "Manually modifying Action Groups is error-prone and disables notifications permanently.",
        "D": "Azure Advisor does not manage alert suppression schedules."
      },
      "heuristic": "Suppress alert notifications during maintenance windows without disabling rules = Alert Processing Rules.",
      "msLearnUrl": "https://learn.microsoft.com/azure/azure-monitor/alerts/alerts-action-rules",
      "errorJournalRef": "error_logging_guide.md"
    }
  },
  {
    "id": "e1-q50",
    "examNumber": 1,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Azure Policy Evaluation Sequence and Effects",
    "scenario": "You are authoring Azure Policy definitions to enforce enterprise governance across your subscriptions. Multiple policies are assigned at the subscription scope with different effects:\n1. Policy 1 has effect: `Deny`\n2. Policy 2 has effect: `Append`\n3. Policy 3 has effect: `Modify`\n4. Policy 4 has effect: `Audit`\n\nWhen a user submits an ARM template request to create a new resource, in what order does the Azure Resource Manager policy engine evaluate these effects?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Deny -> Audit -> Append -> Modify -> Disabled"
      },
      {
        "id": "B",
        "text": "Audit -> Deny -> Modify -> Append -> Disabled"
      },
      {
        "id": "C",
        "text": "Append -> Modify -> Deny -> Audit -> Disabled"
      },
      {
        "id": "D",
        "text": "Disabled -> Modify -> Append -> Deny -> Audit -> AuditIfNotExists"
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D is correct.",
      "triggerConstraints": "Requirement: Identify Azure Policy evaluation sequence during ARM resource creation.",
      "flawedMentalModel": "Assuming Deny evaluates first, or assuming Audit evaluates before mutation effects.",
      "coreMechanic": "Azure Policy processes effects in a deterministic order for resource creation or update requests:\n1. `Disabled` is checked first.\n2. `Modify` is evaluated before the request is handled by the resource provider (can alter resource properties or tags).\n3. `Append` is evaluated next (appends additional fields to the request payload).\n4. `Deny` is evaluated next (if matched, blocks the deployment immediately during pre-flight before any resources are provisioned).\n5. `Audit` is evaluated after the request is sent to the resource provider (logs a warning event).\n6. `AuditIfNotExists` / `DeployIfNotExists` are evaluated after the resource has been successfully created.",
      "distractors": {
        "A": "Modify and Append evaluate before Deny so that required tags/fields can be added before Deny evaluation.",
        "B": "Deny evaluates before Audit; mutation effects evaluate first.",
        "C": "Modify evaluates before Append in the official Azure Policy evaluation order."
      },
      "heuristic": "Azure Policy Evaluation Order: Disabled -> Modify -> Append -> Deny -> Audit -> AuditIfNotExists.",
      "msLearnUrl": "https://learn.microsoft.com/azure/governance/policy/concepts/effects#order-of-evaluation",
      "errorJournalRef": "entra-id-master-architecture-and-governance.md"
    }
  },
  {
    "id": "e1-q51",
    "examNumber": 1,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Bicep targetScope & Subscription-Level Policy Deployment",
    "scenario": "Your organization enforces cloud governance using infrastructure-as-code. You author a Bicep file named 'customPolicy.bicep' that defines a custom Azure Policy definition and creates a policy assignment at the subscription root.\n\nWhen you attempt to deploy the template using 'az deployment group create --resource-group rg-governance --template-file customPolicy.bicep', the deployment fails with the error: 'The resource namespace Microsoft.Authorization is invalid for target scope resourceGroup.'\n\nYou need to modify the Bicep template and deployment command so the policy definition and assignment deploy successfully at the subscription level. What should you do?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Add 'targetScope = \\'subscription\\'' at the top of the Bicep file, and deploy using 'az deployment sub create --location eastus --template-file customPolicy.bicep'."
      },
      {
        "id": "B",
        "text": "Add '@targetScope(\\'tenant\\')' decorator above the resource declaration, and deploy using 'az deployment group create --resource-group rg-governance --template-file customPolicy.bicep'."
      },
      {
        "id": "C",
        "text": "Add 'scope: subscription()' inside the resource definition block, and execute 'az deployment mg create --management-group-id mg-root --template-file customPolicy.bicep'."
      },
      {
        "id": "D",
        "text": "Convert the Bicep file to an ARM JSON template and deploy using 'az deployment group create --mode Complete'."
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A is correct.",
      "triggerConstraints": "Requirement: Deploy subscription-level policy definitions and assignments using Bicep. Constraint: By default, Bicep targetScope is 'resourceGroup', which rejects subscription-scoped resources like Policy Definitions.",
      "flawedMentalModel": "Attempting to use 'az deployment group create' for subscription-scoped resources or attempting to use decorators instead of top-level targetScope.",
      "coreMechanic": "In Bicep, the default deployment target scope is 'resourceGroup'. When deploying resources that exist at the subscription scope (such as Policy Definitions, Role Definitions, and Policy Assignments at the subscription root):\n1. The Bicep file MUST declare 'targetScope = \\'subscription\\'' at the very top of the file.\n2. The Azure CLI command used to initiate the deployment must be 'az deployment sub create' (or PowerShell 'New-AzSubscriptionDeployment'), supplying a deployment location metadata parameter (--location).",
      "distractors": {
        "B": "targetScope is a statement, not a decorator, and resource group deployment commands cannot create subscription-scoped policy definitions.",
        "C": "az deployment mg create targets management groups, which is mismatched with subscription scope.",
        "D": "Converting to ARM template and running group deployment does not resolve the scope mismatch."
      },
      "heuristic": "Subscription-level resources in Bicep require 'targetScope = \\'subscription\\'' + 'az deployment sub create'.",
      "msLearnUrl": "https://learn.microsoft.com/azure/azure-resource-manager/bicep/deploy-to-subscription",
      "errorJournalRef": "council-report-2026-11-07-bicep-endpoints.html"
    }
  },
  {
    "id": "e1-q52",
    "examNumber": 1,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "Blob Lifecycle Management Versioning Constraints",
    "scenario": "You administer an Azure general-purpose v2 storage account named 'stblobprod01' storing financial audit reports with Blob Versioning enabled. You are authoring a Lifecycle Management JSON rule to transition old blob versions to Archive tier and delete noncurrent versions after retention periods expire.\n\nYou attempt to define a lifecycle action using 'daysAfterLastAccessTimeGreaterThan: 90' inside the 'version' filter block. Azure Resource Manager rejects the lifecycle policy JSON during validation.\n\nWhy did the lifecycle rule validation fail?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Blob versioning is not supported on General-purpose v2 storage accounts without hierarchical namespace enabled."
      },
      {
        "id": "B",
        "text": "Blob version actions in lifecycle management rules only support 'daysAfterCreationGreaterThan'; last access time tracking is not supported on blob versions."
      },
      {
        "id": "C",
        "text": "Archive tier transitions cannot be applied to blob versions; only base blobs can be transitioned to Archive tier."
      },
      {
        "id": "D",
        "text": "Lifecycle management rules for blob versions require the storage account to be upgraded to Premium Block Blob tier."
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B is correct.",
      "triggerConstraints": "Requirement: Define lifecycle management rules targeting blob versions. Constraint: Azure Storage lifecycle management rule syntax restricts which condition parameters apply to versions.",
      "flawedMentalModel": "Assuming 'daysAfterLastAccessTimeGreaterThan' or 'daysAfterLastModifiedGreaterThan' can be applied uniformly across base blobs, snapshots, and versions.",
      "coreMechanic": "In Azure Blob Lifecycle Management rules:\n1. Base blobs support 'daysAfterModificationGreaterThan', 'daysAfterCreationGreaterThan', and 'daysAfterLastAccessTimeGreaterThan'.\n2. Snapshots support 'daysAfterCreationGreaterThan' and 'daysAfterLastTierChangeGreaterThan'.\n3. Versions ONLY support 'daysAfterCreationGreaterThan' (and 'daysAfterLastTierChangeGreaterThan' when tiering). Last access time tracking is explicitly NOT supported for blob versions or snapshots because access time is only tracked for current base blobs.",
      "distractors": {
        "A": "General-purpose v2 fully supports blob versioning with flat namespace.",
        "C": "Blob versions CAN be transitioned to Archive tier using daysAfterCreationGreaterThan.",
        "D": "Premium Block Blob tier does not support Archive tier or tiering lifecycle actions."
      },
      "heuristic": "Lifecycle rules on blob versions and snapshots ONLY support 'daysAfterCreationGreaterThan'!",
      "msLearnUrl": "https://learn.microsoft.com/azure/storage/blobs/lifecycle-management-overview#rule-actions",
      "errorJournalRef": "AR PT02 Q5"
    }
  },
  {
    "id": "e1-q53",
    "examNumber": 1,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "Server-Side Encryption with Customer-Managed Keys (SSE-CMK) & Disk Encryption Sets",
    "scenario": "You administer multiple Azure virtual machines hosting proprietary database workloads in 'Central US'. Security compliance mandates that all Managed OS and Data disks must be encrypted using Customer-Managed Keys (SSE-CMK) rather than Platform-Managed Keys (PMK).\n\nYou create an Azure Key Vault in 'Central US' and generate an RSA 2048-bit key named 'cmk-db-key'. You then provision a Disk Encryption Set (DES) named 'des-centralus'. When attempting to associate 'des-centralus' with a new managed disk, the operation fails.\n\nWhat configuration step is required before the Disk Encryption Set can be used to encrypt managed disks?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Enable the 'Azure Disk Encryption for volume encryption' access policy on the Azure Key Vault."
      },
      {
        "id": "B",
        "text": "Assign the Key Vault Crypto Officer role to the virtual machine's system-assigned managed identity."
      },
      {
        "id": "C",
        "text": "Grant the Disk Encryption Set's system-assigned managed identity the 'Key Vault Crypto Service Encryption User' role (or Key Get, Wrap, Unwrap permissions) on the Key Vault."
      },
      {
        "id": "D",
        "text": "Configure the Key Vault to disable Purge Protection and set soft-delete retention to 7 days."
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C is correct.",
      "triggerConstraints": "Requirement: Enable SSE-CMK on Azure Managed Disks using a Disk Encryption Set. Constraint: The DES acts as an intermediary resource and must have identity permissions to access the key.",
      "flawedMentalModel": "Conflating SSE-CMK with Azure Disk Encryption (ADE). ADE uses Key Vault access policy volume encryption flags; SSE-CMK uses Disk Encryption Sets with managed identities.",
      "coreMechanic": "Server-Side Encryption with Customer-Managed Keys (SSE-CMK) uses a Disk Encryption Set (DES) resource:\n1. When a DES is created, Azure automatically generates a System-Assigned Managed Identity for the DES.\n2. Before the DES can be associated with any disk, you MUST grant this managed identity access to the Key Vault containing the CMK: either the RBAC role 'Key Vault Crypto Service Encryption User' or Key permissions: 'Get', 'Wrap Key', and 'Unwrap Key'.\n3. The Key Vault MUST have soft-delete and purge protection enabled.",
      "distractors": {
        "A": "'Azure Disk Encryption for volume encryption' is strictly for ADE (BitLocker/DM-Crypt), not SSE-CMK with DES.",
        "B": "The identity requiring permission is the Disk Encryption Set's managed identity, not the individual VM's identity.",
        "D": "Purge protection MUST be enabled, not disabled, for Key Vaults used with Disk Encryption Sets."
      },
      "heuristic": "SSE-CMK = Disk Encryption Set (DES) system-assigned identity granted Key Vault Crypto permissions!",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machines/disk-encryption#customer-managed-keys",
      "errorJournalRef": "AR PT02 Q4"
    }
  },
  {
    "id": "e1-q54",
    "examNumber": 1,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "Azure Bastion Deployment Prerequisites & Public IP Constraints",
    "scenario": "You are deploying an Azure Bastion host named 'bas-prod-eastus' into an existing Virtual Network ('vnet-corp-eastus') to provide secure browser-based administrative access to private VMs without exposing public IPs.\n\nYou create a subnet named 'AzureBastionSubnet' with address prefix '10.20.10.0/26'. During the deployment wizard, you attempt to associate an existing Public IP address named 'pip-bastion-global' that was created with the Global tier and Standard SKU. The deployment validation fails.\n\nWhat change must you make to the Public IP address to successfully deploy Azure Bastion?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Change the Public IP address SKU from Standard to Basic with Dynamic allocation."
      },
      {
        "id": "B",
        "text": "Create a Public IP prefix of size /28 and assign the first available IP to Azure Bastion."
      },
      {
        "id": "C",
        "text": "Reconfigure the Public IP address allocation method from Static to Dynamic."
      },
      {
        "id": "D",
        "text": "Provision a new Public IP address with Standard SKU, Static allocation, and Regional tier in the same region as the VNet."
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D is correct.",
      "triggerConstraints": "Requirement: Provision a Public IP address compatible with Azure Bastion. Constraints: SKU, Tier, and Allocation method constraints.",
      "flawedMentalModel": "Assuming Azure Bastion can use Global tier Public IPs or Basic SKU IPs.",
      "coreMechanic": "Azure Bastion Public IP requirements are strictly enforced by Azure ARM:\n1. SKU: MUST be Standard SKU (Basic SKU is unsupported).\n2. Allocation: MUST be Static (Dynamic allocation is not allowed on Standard Public IPs).\n3. Tier: MUST be Regional tier. Azure Bastion does NOT support Global tier Public IPs.\n4. Location: Must match the region of the target Virtual Network.",
      "distractors": {
        "A": "Basic SKU is unsupported for Azure Bastion.",
        "B": "Bastion requires a dedicated single Standard IP, not a /28 prefix block assignment.",
        "C": "Dynamic allocation is invalid; Standard SKU requires Static allocation."
      },
      "heuristic": "Azure Bastion requires: Standard SKU + Static Allocation + REGIONAL Tier Public IP!",
      "msLearnUrl": "https://learn.microsoft.com/azure/bastion/bastion-faq#public-ip",
      "errorJournalRef": "AR PT02 Q24"
    }
  },
  {
    "id": "e1-q55",
    "examNumber": 1,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Management Locks: ReadOnly Lock Blocking Resource Move",
    "scenario": "You have an Azure subscription containing two resource groups named 'rg-source' and 'rg-target'. You need to move a storage account named 'stdataarchive01' from 'rg-source' to 'rg-target'.\n\n'rg-source' has a 'CanNotDelete' lock applied. 'rg-target' has a 'ReadOnly' lock applied to prevent unauthorized modifications to production resources. When you initiate the resource move operation using the Azure Portal or Azure CLI ('az resource move'), the operation fails with a locked resource error.\n\nWhat is the root cause of the failure and how should you resolve it?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "A ReadOnly lock on the destination resource group blocks moving resources into it; you must temporarily remove the ReadOnly lock from 'rg-target' before initiating the move."
      },
      {
        "id": "B",
        "text": "The CanNotDelete lock on 'rg-source' prevents resource migration; you must delete the CanNotDelete lock from 'rg-source'."
      },
      {
        "id": "C",
        "text": "Storage accounts cannot be moved across resource groups once blob data has been written."
      },
      {
        "id": "D",
        "text": "Both CanNotDelete and ReadOnly locks block resource moves; both locks must be removed from both resource groups."
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A is correct.",
      "triggerConstraints": "Requirement: Move an Azure Storage Account across resource groups where locks exist on source and target. Constraint: Differentiate CanNotDelete vs ReadOnly lock behaviors during move operations.",
      "flawedMentalModel": "Assuming CanNotDelete blocks moves, or failing to realize that ReadOnly on the destination resource group blocks resource creation/registration.",
      "coreMechanic": "Microsoft Resource Lock Move Rules:\n1. CanNotDelete (ReadOnly = False): Does NOT block moving resources. A resource move transfers the resource identity without deleting it.\n2. ReadOnly (ReadOnly = True): STRICTLY BLOCKS resource moves. If a ReadOnly lock is applied to the source RG, destination RG, parent subscription, or the resource itself, the move fails.\nMoving 'stdataarchive01' into 'rg-target' requires writing new resource registrations into 'rg-target', which the ReadOnly lock on 'rg-target' completely blocks. Removing the ReadOnly lock on 'rg-target' allows the move to proceed successfully.",
      "distractors": {
        "B": "CanNotDelete locks do NOT block move operations; the lock on rg-source is not the cause.",
        "C": "Storage accounts can be moved between resource groups regardless of blob data.",
        "D": "CanNotDelete does not block moves, so it does not need to be removed."
      },
      "heuristic": "CanNotDelete ALLOWS resource moves! ReadOnly lock on source OR destination BLOCKS resource moves!",
      "msLearnUrl": "https://learn.microsoft.com/azure/azure-resource-manager/management/move-resources-overview#checklist-before-moving-resources",
      "errorJournalRef": "AR PT01 Q57"
    }
  },
  {
    "id": "e1-q56",
    "examNumber": 1,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "Azure Files Share Backup Frequency & Hourly Snapshots",
    "scenario": "Your enterprise uses Azure Files shares mounted via SMB across multiple branch offices. Departmental policy mandates that file share backups must be captured every 4 hours throughout the business day (08:00, 12:00, 16:00, and 20:00 UTC) to minimize potential data loss to under 4 hours.\n\nYou configure a Recovery Services Vault named 'rsv-prod-files' to protect the Azure Files share. How can you fulfill this backup frequency requirement within the backup policy?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Azure Files only supports a single daily backup snapshot; you must write an Azure Automation runbook using PowerShell to trigger manual snapshots every 4 hours."
      },
      {
        "id": "B",
        "text": "In the Recovery Services Vault backup policy for Azure Files, set the backup frequency to Hourly with a schedule interval of every 4 hours."
      },
      {
        "id": "C",
        "text": "Deploy an Azure Backup Vault instead of a Recovery Services Vault, as Recovery Services Vaults cannot back up Azure Files."
      },
      {
        "id": "D",
        "text": "Configure Azure File Sync with Cloud Tiering set to 240 minutes to automate cloud snapshots."
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B is correct.",
      "triggerConstraints": "Requirement: Configure backup policy for Azure Files with a 4-hour RPO. Constraint: Recovery Services Vault capabilities for Azure Files workloads.",
      "flawedMentalModel": "Believing Azure Files backups in Recovery Services Vault only support once-daily schedules, like standard Azure VM backup policies.",
      "coreMechanic": "Azure Files backup policies in a Recovery Services Vault natively support multiple snapshots per day:\n1. Frequency: Can be set to 'Daily' or 'Hourly'.\n2. Hourly Schedule: Allows setting snapshot intervals of every 4, 8, or 12 hours.\n3. Native Integration: Azure Backup takes native Azure Files share snapshots in the local storage account, which are instantaneous and do not transfer data across regions during backup creation.",
      "distractors": {
        "A": "Hourly backup frequency is natively supported in Recovery Services Vault for Azure Files.",
        "C": "Azure Files is backed up using Recovery Services Vaults, not Backup Vaults.",
        "D": "Azure File Sync Cloud Tiering manages cache space, not automated point-in-time backup snapshots."
      },
      "heuristic": "Azure Files backup in Recovery Services Vault natively supports HOURLY frequency (every 4, 8, or 12 hours)!",
      "msLearnUrl": "https://learn.microsoft.com/azure/backup/backup-azure-files-faq#can-i-schedule-multiple-backups-per-day-for-azure-files",
      "errorJournalRef": "AR PT02 Q62"
    }
  },
  {
    "id": "e1-q57",
    "examNumber": 1,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "Azure Container Instances (ACI) Port Allocation on Localhost",
    "scenario": "You are creating an Azure Container Instances (ACI) multi-container group named 'acigroup-web' using an ARM template. The container group contains two containers: 'frontend-nginx' (listening on TCP port 80) and 'backend-api' (also configured to listen on TCP port 80 on localhost).\n\nThe template deployment fails during container group initialization with an IP address / port allocation conflict.\n\nWhat is the fundamental networking principle of ACI container groups that caused this error?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "ACI container groups can only contain a single container unless deployed into a Virtual Network with an Application Gateway."
      },
      {
        "id": "B",
        "text": "Windows containers cannot run alongside Linux containers in the same subscription."
      },
      {
        "id": "C",
        "text": "All containers in an ACI container group share the same network namespace and localhost; therefore, containers within the same group cannot bind to identical port numbers."
      },
      {
        "id": "D",
        "text": "Port 80 is reserved exclusively for the Azure Container Instances management agent and cannot be bound by user applications."
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C is correct.",
      "triggerConstraints": "Requirement: Identify why two containers in an ACI container group cannot both listen on TCP port 80.",
      "flawedMentalModel": "Assuming each container inside an ACI group receives an independent private IP address or separate localhost loopback adapter.",
      "coreMechanic": "In Azure Container Instances (ACI):\n1. A container group is the top-level scheduling unit (comparable to a Kubernetes pod).\n2. All containers in a container group share the exact same network namespace, including the single assigned IP address and the 'localhost' interface.\n3. Consequently, containers within the group can communicate with each other over localhost on distinct ports, but two containers within the group CANNOT bind to the same port.",
      "distractors": {
        "A": "ACI natively supports multi-container groups without requiring VNet or Application Gateway.",
        "B": "The question specifies port conflict, not OS incompatibility.",
        "D": "Port 80 is a standard HTTP port that user applications can freely bind."
      },
      "heuristic": "Containers in an ACI container group share the same network namespace and localhost: ports must not collide!",
      "msLearnUrl": "https://learn.microsoft.com/azure/container-instances/container-instances-container-groups#networking",
      "errorJournalRef": "AR PT02 Q16"
    }
  },
  {
    "id": "e1-q58",
    "examNumber": 1,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "Subnet Sizing Calculation & Azure SDN 5 Reserved Addresses",
    "scenario": "You are provisioning a new subnet named 'snet-analytics' in an Azure Virtual Network. The analytics team will deploy exactly 28 virtual machines with one NIC each into this subnet immediately, and requires at least 15 additional IP addresses reserved for future VM scaling over the next 6 months (total minimum required usable host IPs = 43).\n\nWhat is the minimum CIDR subnet prefix size that satisfies this requirement without wasting excessive IP addresses?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "/27"
      },
      {
        "id": "B",
        "text": "/28"
      },
      {
        "id": "C",
        "text": "/25"
      },
      {
        "id": "D",
        "text": "/26"
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D (/26) is correct.",
      "triggerConstraints": "Requirement: Size an Azure subnet for at least 43 usable host IP addresses (28 + 15 = 43). Constraint: Account for Azure's 5 reserved IP addresses per subnet.",
      "flawedMentalModel": "Calculating /27 as 32 - 2 = 30 usable IPs (on-prem formula) or forgetting that Azure reserves 5 IPs (32 - 5 = 27 < 43).",
      "coreMechanic": "Azure Subnet IP Reservation Formula: Usable IPs = 2^(32 - prefix) - 5.\n- /28: 16 - 5 = 11 usable IPs (insufficient for 43).\n- /27: 32 - 5 = 27 usable IPs (insufficient for 43).\n- /26: 64 - 5 = 59 usable IPs (satisfies 43 with 16 spare).\n- /25: 128 - 5 = 123 usable IPs (unnecessarily large).\nTherefore, /26 is the minimum CIDR prefix that provides at least 43 usable host IP addresses.",
      "distractors": {
        "A": "/27 only provides 27 usable host addresses in Azure (32 - 5 = 27), which is less than the required 43.",
        "B": "/28 only provides 11 usable host addresses.",
        "C": "/25 satisfies 43 but is not the minimum prefix size (/26 is smaller and satisfies the requirement)."
      },
      "heuristic": "Azure Usable IPs = 2^(32 - prefix) - 5. For 43 hosts: /27 = 27 (too small); /26 = 59 (correct minimum).",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-network/virtual-networks-faq#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets",
      "errorJournalRef": "AR PT02 Q21"
    }
  },
  {
    "id": "e1-q59",
    "examNumber": 1,
    "domain": "Domain 5: Monitor and maintain Azure resources",
    "domainCode": 5,
    "topic": "Recovery Services Vault vs. Azure Backup Vault Workload Boundaries",
    "scenario": "Your organization operates a mixed cloud environment consisting of Azure Virtual Machines, standalone Azure Managed Disks (used for raw data staging), Azure Files shares, and Azure Database for PostgreSQL Flexible Server instances.\n\nYou need to establish backup policies for:\n1. Independent Azure Managed Disks (snapshot-based disk backup without VM agent).\n2. Azure Virtual Machines.\n\nWhich vault types must you deploy to protect these two workloads?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Deploy an Azure Backup Vault for Managed Disks, and a Recovery Services Vault for Azure Virtual Machines."
      },
      {
        "id": "B",
        "text": "Deploy a Recovery Services Vault for both Managed Disks and Azure Virtual Machines."
      },
      {
        "id": "C",
        "text": "Deploy an Azure Backup Vault for both Managed Disks and Azure Virtual Machines."
      },
      {
        "id": "D",
        "text": "Deploy a Recovery Services Vault for Managed Disks, and an Azure Backup Vault for Azure Virtual Machines."
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A is correct.",
      "triggerConstraints": "Requirement: Map Managed Disks and Azure VMs to their designated Azure backup vault types.",
      "flawedMentalModel": "Assuming Recovery Services Vault protects all Azure resources or confusing Backup Vaults with Recovery Services Vaults.",
      "coreMechanic": "Workload Segregation between Vault Types:\n1. Recovery Services Vault: Supports classic IaaS workloads including Azure Virtual Machines, Azure Files (SMB), SQL Server in Azure VMs, SAP HANA in Azure VMs, and MARS agent (on-premises).\n2. Azure Backup Vault: Supports modern cloud-native workloads including Azure Managed Disks, Azure Blob Storage (operational backup), Azure Database for PostgreSQL Flexible Server, and Azure Kubernetes Service (AKS Backup).\nManaged Disks cannot be backed up into a Recovery Services Vault; they require an Azure Backup Vault.",
      "distractors": {
        "B": "Recovery Services Vault does NOT support standalone Azure Managed Disk backup.",
        "C": "Azure Backup Vault does NOT support native Azure Virtual Machine backups.",
        "D": "Inverts the proper workload mapping."
      },
      "heuristic": "Azure VMs & Azure Files = Recovery Services Vault. Managed Disks & PostgreSQL Flexible Server = Backup Vault!",
      "msLearnUrl": "https://learn.microsoft.com/azure/backup/backup-vault-overview",
      "errorJournalRef": "AR PT01 Q52"
    }
  },
  {
    "id": "e1-q60",
    "examNumber": 1,
    "domain": "Domain 2: Implement and manage storage",
    "domainCode": 2,
    "topic": "VNet Service Endpoints vs. Azure Private Endpoints with Private DNS Zones",
    "scenario": "You need to configure secure access from an Azure Virtual Network ('vnet-app-eastus') to an Azure Storage Account ('stprodeastus01').\n\nThe security architecture mandates that traffic to the blob storage service NEVER traverses the public internet, must use a private IP address within 'vnet-app-eastus', and must resolve transparently when application VMs query 'stprodeastus01.blob.core.windows.net'.\n\nWhich solution fulfills these requirements?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Configure a Service Endpoint for Microsoft.Storage on the subnet and add an NSG rule allowing outbound traffic to the Storage service tag."
      },
      {
        "id": "B",
        "text": "Deploy an Azure Private Endpoint for the blob sub-resource in the subnet, and link a Private DNS Zone named 'privatelink.blob.core.windows.net' to the VNet."
      },
      {
        "id": "C",
        "text": "Deploy a NAT Gateway associated with the subnet and configure a custom hosts file on each VM mapping the public IP of the storage account."
      },
      {
        "id": "D",
        "text": "Enable Azure Bastion with IP-based connection and configure a public CNAME DNS record pointing to the storage account."
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B is correct.",
      "triggerConstraints": "Requirement: Private IP within VNet + No public IP traversal + Transparent DNS resolution.",
      "flawedMentalModel": "Choosing Service Endpoints when private IP allocation in the VNet is explicitly required.",
      "coreMechanic": "Service Endpoints vs Private Endpoints:\n1. Service Endpoints: Keep traffic on Azure backbone, but the PaaS resource still uses its public IP address. Does not consume a private IP in your VNet.\n2. Private Endpoints: Allocate a private NIC with a private IP address from your subnet. To enable transparent resolution so VMs querying 'stprodeastus01.blob.core.windows.net' get the private IP, you must link the Azure Private DNS Zone 'privatelink.blob.core.windows.net' to the Virtual Network. Azure automatically configures CNAME redirection.",
      "distractors": {
        "A": "Service Endpoints do not allocate a private IP inside the subnet; clients still connect to public IP ranges.",
        "C": "NAT Gateway routes outbound internet traffic; it does not provide private endpoint IP allocation.",
        "D": "Azure Bastion is an administrative RDP/SSH tool, not a storage connectivity solution."
      },
      "heuristic": "Private IP in VNet subnet + Private Link DNS = Private Endpoint + privatelink Private DNS Zone linked to VNet.",
      "msLearnUrl": "https://learn.microsoft.com/azure/private-link/private-endpoint-dns",
      "errorJournalRef": "AR PT01 Q28"
    }
  },
  {
    "id": "e1-q61",
    "examNumber": 1,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "Serverless Windows Container Hosting: ACI vs. ACA Constraints",
    "scenario": "You are architecting a containerized deployment for a legacy .NET Framework 4.8 enterprise service packaged as a Windows Server Core container image.\n\nYour team requires a serverless hosting model where you do not have to manage virtual machines, scale sets, or Kubernetes control planes (no AKS clusters).\n\nWhich Azure service should you select to host this Windows container?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Azure Container Apps (ACA)"
      },
      {
        "id": "B",
        "text": "Azure App Service on Linux with custom container plan"
      },
      {
        "id": "C",
        "text": "Azure Container Instances (ACI)"
      },
      {
        "id": "D",
        "text": "Azure Spring Apps Enterprise"
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C (ACI) is correct.",
      "triggerConstraints": "Requirement: Run a Windows Server container image in a serverless model without managing Kubernetes/AKS.",
      "flawedMentalModel": "Selecting Azure Container Apps (ACA), unaware that ACA strictly supports Linux containers only.",
      "coreMechanic": "Container Workload Operating System Constraints:\n1. Azure Container Apps (ACA): Based on Kubernetes, Envoy, and KEDA. Strictly supports Linux-based containers ONLY. Windows containers are NOT supported.\n2. Azure Container Instances (ACI): Fully serverless compute that natively supports both Linux containers and Windows Server containers (Windows Server 2019/2022 Core).\nTherefore, to run a Windows Server container serverlessly without managing an AKS cluster, Azure Container Instances (ACI) is the only supported option.",
      "distractors": {
        "A": "Azure Container Apps does NOT support Windows containers (Linux only).",
        "B": "App Service on Linux cannot run Windows containers.",
        "D": "Azure Spring Apps is specialized for Java Spring Boot applications."
      },
      "heuristic": "Serverless Windows container without managing Kubernetes = Azure Container Instances (ACI)! ACA is Linux-only.",
      "msLearnUrl": "https://learn.microsoft.com/azure/container-instances/container-instances-overview",
      "errorJournalRef": "AR PT02 Q15"
    }
  },
  {
    "id": "e1-q62",
    "examNumber": 1,
    "domain": "Domain 4: Implement and manage virtual networking",
    "domainCode": 4,
    "topic": "Effective NSG Evaluation Flow: Subnet NSG vs. NIC NSG Dual-Evaluation",
    "scenario": "An Azure VM named 'vm-web01' is connected to subnet 'snet-web' in 'vnet-prod'. Both 'snet-web' and the NIC of 'vm-web01' ('nic-web01') have Network Security Groups associated:\n\nSubnet NSG ('nsg-subnet'):\n- Priority 200: Inbound | Source: Internet | Port: 443 | Action: Allow\n- Priority 65500: DenyAllInBound\n\nNIC NSG ('nsg-nic'):\n- Priority 300: Inbound | Source: Internet | Port: 443 | Action: Deny\n- Priority 400: Inbound | Source: 10.0.0.0/8 | Port: 443 | Action: Allow\n- Priority 65500: DenyAllInBound\n\nAn external client on the public internet attempts to establish an HTTPS connection (TCP 443) to the public IP of 'vm-web01'. What happens to the inbound HTTPS traffic and why?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "The traffic is allowed because Subnet NSG has lower priority number (200 vs 300) and takes absolute precedence over NIC NSG."
      },
      {
        "id": "B",
        "text": "The traffic is allowed because Subnet NSG evaluates first and once an Allow rule is matched, evaluation immediately terminates."
      },
      {
        "id": "C",
        "text": "The traffic is denied because NIC NSG evaluates first for inbound traffic, overriding Subnet NSG."
      },
      {
        "id": "D",
        "text": "The traffic is denied because for inbound traffic, the packet must pass BOTH Subnet NSG and NIC NSG; while Subnet NSG allows it, NIC NSG Priority 300 explicitly denies it."
      }
    ],
    "correctAnswer": "D",
    "explanation": {
      "verdict": "Option D is correct.",
      "triggerConstraints": "Requirement: Determine effective NSG behavior for inbound internet traffic across Subnet NSG and NIC NSG.",
      "flawedMentalModel": "Assuming priority numbers compete across different NSGs, or that a match on the Subnet NSG skips the NIC NSG evaluation.",
      "coreMechanic": "Azure NSG Inbound Traffic Evaluation Flow:\n1. When inbound traffic arrives from outside the VM, Azure SDN evaluates the Subnet NSG FIRST.\n2. In 'nsg-subnet', Priority 200 matches and ALLOWS the packet through the subnet boundary.\n3. The packet is then evaluated by the NIC NSG SECOND.\n4. In 'nsg-nic', Priority 300 matches 'Source: Internet, Port: 443' with action DENY.\n5. The packet is dropped at the NIC boundary.\nFor inbound traffic to reach the VM, it MUST be allowed by BOTH the Subnet NSG AND the NIC NSG.",
      "distractors": {
        "A": "Priority numbers are local to each individual NSG and are not compared against each other across different NSGs.",
        "B": "Matching an Allow rule in the Subnet NSG only permits traffic through the subnet; it must still pass NIC NSG evaluation.",
        "C": "Subnet NSG evaluates first for inbound traffic, not NIC NSG (NIC NSG evaluates first for outbound traffic)."
      },
      "heuristic": "Inbound NSG Flow: Subnet NSG first -> NIC NSG second. BOTH must allow the packet!",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-network/network-security-group-how-it-works",
      "errorJournalRef": "AR PT01 Q21"
    }
  },
  {
    "id": "e1-q63",
    "examNumber": 1,
    "domain": "Domain 1: Manage Azure identities and governance",
    "domainCode": 1,
    "topic": "Bicep Parameter Files (.bicepparam) & Decorators",
    "scenario": "You are modularizing your enterprise Bicep code. In your 'main.bicep' file, you declare an administrative password parameter for Azure VM provisioning.\n\nYou want to ensure that:\n1. The password value is never logged or exposed in plain text in deployment history.\n2. Values provided for the deployment environment parameter are restricted strictly to 'dev', 'test', or 'prod'.\n3. Default parameters are populated using a dedicated parameter file using modern Bicep syntax.\n\nWhich Bicep decorators and parameter file configuration should you use?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Use '@secure()' decorator on the password parameter, '@allowed([\\'dev\\', \\'test\\', \\'prod\\'])' on the environment parameter, and a '.bicepparam' file containing 'using \\'./main.bicep\\''."
      },
      {
        "id": "B",
        "text": "Use '@protected()' decorator on the password parameter, '@validate([\\'dev\\', \\'test\\', \\'prod\\'])' on the environment parameter, and a 'parameters.json' file."
      },
      {
        "id": "C",
        "text": "Use '@secret()' decorator on the password parameter, '@restrict([\\'dev\\', \\'test\\', \\'prod\\'])' on the environment parameter, and an ARM template parameters file."
      },
      {
        "id": "D",
        "text": "Use '@keyvault()' decorator on the password parameter, '@choice([\\'dev\\', \\'test\\', \\'prod\\'])' on the environment parameter, and a '.bicep' parameter file."
      }
    ],
    "correctAnswer": "A",
    "explanation": {
      "verdict": "Option A is correct.",
      "triggerConstraints": "Requirement: Secure password parameter, restrict allowed environment string values, and use native Bicep parameter file format.",
      "flawedMentalModel": "Confusing ARM template parameter decorators with Bicep syntax (@secure and @allowed).",
      "coreMechanic": "Bicep Parameter Decorators & Parameter Files:\n1. '@secure()': Decorator applied to string or object parameters that prevents values from being logged in deployment outputs or saved in deployment history.\n2. '@allowed([\\'dev\\', \\'test\\', \\'prod\\'])': Decorator restricting acceptable values to a predefined list.\n3. Modern Bicep Parameters (.bicepparam): Dedicated Bicep parameter files start with the statement 'using \\'./main.bicep\\'' and assign parameter values directly without verbose JSON wrapping.",
      "distractors": {
        "B": "@protected and @validate are not valid Bicep parameter decorators.",
        "C": "@secret and @restrict do not exist in Bicep syntax.",
        "D": "@keyvault and @choice do not exist in Bicep syntax."
      },
      "heuristic": "Bicep parameter safety: @secure() hides secrets, @allowed([]) restricts values, .bicepparam starts with using './main.bicep'.",
      "msLearnUrl": "https://learn.microsoft.com/azure/azure-resource-manager/bicep/parameters",
      "errorJournalRef": "council-report-2026-11-07-bicep-endpoints.html"
    }
  },
  {
    "id": "e1-q64",
    "examNumber": 1,
    "domain": "Domain 3: Deploy and manage Azure compute resources",
    "domainCode": 3,
    "topic": "Virtual Machine Scale Sets (VMSS) Automatic OS Image Upgrades",
    "scenario": "You manage a production Virtual Machine Scale Set (VMSS) deployed across three Availability Zones. You want to enable Automatic OS Image Upgrades so that new platform image patches are rolled out to instances safely with zero downtime.\n\nWhich prerequisites must be met before Azure will allow you to enable Automatic OS Image Upgrades on the scale set?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "The scale set must use Custom VM Images, have over-provisioning enabled, and use manual upgrade policy."
      },
      {
        "id": "B",
        "text": "The scale set must use a supported platform OS image, have the upgradePolicy mode set to 'Automatic' or 'Rolling', and have an Application Health Extension or Load Balancer health probe configured."
      },
      {
        "id": "C",
        "text": "The scale set instances must have public IP addresses on each NIC, use unmanaged disks, and run on Basic Load Balancers."
      },
      {
        "id": "D",
        "text": "The scale set must be deployed in Flexible orchestration mode with spot instances only."
      }
    ],
    "correctAnswer": "B",
    "explanation": {
      "verdict": "Option B is correct.",
      "triggerConstraints": "Requirement: Enable Automatic OS Image Upgrades on a Virtual Machine Scale Set.",
      "flawedMentalModel": "Assuming custom generalized images support automated platform upgrades without Azure Compute Gallery shared image definitions.",
      "coreMechanic": "Virtual Machine Scale Set Automatic OS Image Upgrade Prerequisites:\n1. Image: Must use a supported platform image (or Azure Compute Gallery specialized/generalized image with version tracking).\n2. Upgrade Policy: The scale set's 'upgradePolicy.mode' must be set to 'Automatic' or 'Rolling'.\n3. Health Monitoring: An application health probe (either Application Health Extension or Load Balancer health probe) is strictly required so Azure can determine whether newly upgraded instances are healthy before proceeding to the next batch.",
      "distractors": {
        "A": "Manual upgrade policy explicitly disables automatic upgrades.",
        "C": "Public IPs and unmanaged disks are not required; unmanaged disks are deprecated.",
        "D": "Automatic OS upgrade is not restricted to spot instances."
      },
      "heuristic": "VMSS Automatic OS Upgrades require: Supported image + Rolling/Automatic policy + Health Probe / Extension!",
      "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade",
      "errorJournalRef": "scenario_01_deep_dive.md"
    }
  },
  {
    "id": "e1-q65",
    "examNumber": 1,
    "domain": "Domain 5: Monitor and maintain Azure resources",
    "domainCode": 5,
    "topic": "Azure Monitor Agent (AMA) & Data Collection Rules (DCR) Scoping",
    "scenario": "Your organization is migrating from the legacy Log Analytics agent (MMA) to the Azure Monitor Agent (AMA). You need to collect specific Windows Event Logs (System and Application error events) and performance counters (Processor % Processor Time and Memory Available MBytes) from 45 Azure VMs situated across multiple resource groups and two Azure regions ('East US' and 'West US').\n\nHow should you configure and apply the collection settings with the least administrative effort?",
    "questionType": "single",
    "options": [
      {
        "id": "A",
        "text": "Create an individual Data Collection Rule in every resource group and configure custom PowerShell scripts to push metrics via the Azure Monitor REST API."
      },
      {
        "id": "B",
        "text": "Configure diagnostic settings on each VM to stream metrics directly to an Event Hub in West US."
      },
      {
        "id": "C",
        "text": "Create a Data Collection Rule (DCR) specifying the required performance counters and Windows event logs, and associate the DCR to the target virtual machines using Data Collection Rule Associations (DCRA)."
      },
      {
        "id": "D",
        "text": "Install the Network Watcher Agent on all VMs and configure packet capture rules linked to a central storage account."
      }
    ],
    "correctAnswer": "C",
    "explanation": {
      "verdict": "Option C is correct.",
      "triggerConstraints": "Requirement: Collect Windows events and performance counters from multiple VMs across regions using AMA with minimal management overhead.",
      "flawedMentalModel": "Creating per-VM or per-RG collection configurations, or relying on diagnostic settings which do not manage guest OS event collection.",
      "coreMechanic": "Azure Monitor Agent (AMA) Architecture:\n1. Data Collection Rules (DCR): Define what data to collect (event logs, syslog, performance counters, IIS logs) and where to send it (Log Analytics workspace).\n2. Data Collection Rule Associations (DCRA): Decouple the collection configuration from the VMs. A single DCR can be associated with hundreds of VMs across different resource groups and subscriptions.\n3. The Azure Monitor Agent running inside the VM receives the DCR configuration and streams telemetry directly to the designated Log Analytics workspace.",
      "distractors": {
        "A": "DCRs do not need to be duplicated per resource group; a single DCR can be associated across multiple groups.",
        "B": "VM Diagnostic settings are for host metrics and boot diagnostics, not granular guest OS event log filtering via AMA.",
        "D": "Network Watcher Agent is for network packet captures and topology, not OS performance counters."
      },
      "heuristic": "Azure Monitor Agent (AMA) centralizes guest telemetry via Data Collection Rules (DCR) + Associations (DCRA)!",
      "msLearnUrl": "https://learn.microsoft.com/azure/azure-monitor/agents/data-collection-rule-overview",
      "errorJournalRef": "AR PT01 Q65"
    }
  }
];
