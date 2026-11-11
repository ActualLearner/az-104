#!/usr/bin/env python3
"""
Generator for exam_questions_exam3.js (Domain 3: Questions e3-q28 to e3-q42)
"""

def get_domain3_questions():
    return [
        {
            "id": "e3-q28",
            "examNumber": 3,
            "domain": "Domain 3: Deploy and manage Azure compute resources",
            "domainCode": 3,
            "topic": "Availability Sets Maximum Fault Domains and Update Domains",
            "scenario": "You are designing an Availability Set for a cluster of 6 production database virtual machines in the `East US` region. You will attach Azure Managed Disks to all VMs.\n\nTo maximize resilience against hardware outages and scheduled platform maintenance, what are the maximum number of Fault Domains (FDs) and Update Domains (UDs) you can configure in this Availability Set?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "5 Fault Domains and 5 Update Domains."},
                {"id": "B", "text": "3 Fault Domains and 20 Update Domains."},
                {"id": "C", "text": "2 Fault Domains and 10 Update Domains."},
                {"id": "D", "text": "10 Fault Domains and 50 Update Domains."}
            ],
            "correctAnswer": "B",
            "explanation": {
                "verdict": "Option B is correct.",
                "triggerConstraints": "Requirement: Identify maximum Fault Domains and Update Domains for an Availability Set using managed disks in East US.",
                "flawedMentalModel": "Confusing on-premises hypervisor cluster nodes with Azure regional fabric domain limits.",
                "coreMechanic": "In Azure regions supporting managed disks, an Availability Set supports a maximum of 3 Fault Domains (FD 0, 1, 2) that share a physical rack, power, and network switch. For platform maintenance sequencing, up to 20 Update Domains (UD 0 through 19) are supported (default is 5).",
                "distractors": {
                    "A": "Fault Domains in Azure are limited to a maximum of 3, never 5.",
                    "C": "While some older or unmanaged-disk regions historically supported 2 FDs, modern managed disk regions support up to 3 FDs and 20 UDs.",
                    "D": "Azure fabric architecture does not support 10 FDs or 50 UDs."
                },
                "heuristic": "Availability Set Limits: Max 3 Fault Domains (FDs) and Max 20 Update Domains (UDs).",
                "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machines/availability-set-overview"
            }
        },
        {
            "id": "e3-q29",
            "examNumber": 3,
            "domain": "Domain 3: Deploy and manage Azure compute resources",
            "domainCode": 3,
            "topic": "Virtual Machine Scale Sets (VMSS) Metric Autoscaling and Flapping Protection",
            "scenario": "You configure an autoscaling rule for a Virtual Machine Scale Set named `vmss-orders`. The scale-out rule triggers when the average CPU percentage exceeds 75% for 10 minutes (increasing instance count by 2, cool-down 10 minutes). The scale-in rule triggers when average CPU drops below 30% for 10 minutes (decreasing instance count by 1, cool-down 10 minutes).\n\nDuring a brief flash sale, CPU spikes to 88% for 10 minutes, and the scale-out rule executes. Immediately thereafter, CPU drops to 25% for 3 minutes before rebounding to 72%.\n\nWhy does the scale-in rule NOT execute during the 3-minute dip?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Scale-in rules are only evaluated at 00:00 UTC daily."},
                {"id": "B", "text": "VMSS instances cannot be scaled in until they have been running for at least 24 hours."},
                {"id": "C", "text": "The scale-in rule requires the condition to remain continuously below 30% across the full 10-minute duration window, and the 10-minute scale-out cool-down period also suppresses reverse scaling."},
                {"id": "D", "text": "Scale-in requires manual confirmation in the Azure portal when instances have active sessions."}
            ],
            "correctAnswer": "C",
            "explanation": {
                "verdict": "Option C is correct.",
                "triggerConstraints": "Requirement: Understand why a VMSS autoscaling scale-in rule does not trigger during a short-lived metric dip.",
                "flawedMentalModel": "Assuming any instantaneous breach of a metric threshold triggers immediate scaling.",
                "coreMechanic": "Azure Monitor autoscale rules evaluate metrics over a configured time aggregation window (here, 10 minutes). A 3-minute drop below 30% is insufficient to satisfy the 10-minute duration requirement. Furthermore, the scale-out cool-down period (10 minutes) actively suppresses any subsequent scale actions to prevent thrashing/flapping.",
                "distractors": {
                    "A": "Autoscale rules are evaluated continuously (every 1 minute) against the configured lookback duration.",
                    "B": "There is no 24-hour minimum runtime requirement for scale-in.",
                    "D": "Autoscale is fully automated and does not require portal manual confirmation."
                },
                "heuristic": "Autoscale triggers require the threshold to be breached for the ENTIRE duration window + cool-down prevents flapping.",
                "msLearnUrl": "https://learn.microsoft.com/azure/azure-monitor/autoscale/autoscale-best-practices"
            }
        },
        {
            "id": "e3-q30",
            "examNumber": 3,
            "domain": "Domain 3: Deploy and manage Azure compute resources",
            "domainCode": 3,
            "topic": "Virtual Machine Scale Sets Upgrade Policies: Rolling vs Automatic",
            "scenario": "You manage a production Virtual Machine Scale Set comprising 25 Linux instances running an e-commerce API behind an Azure Load Balancer. You update the VMSS model to point to a new custom Golden Image.\n\nYou need the new image to deploy across the scale set automatically in controlled batches (e.g. 20% of instances at a time) without causing full application downtime. If any batch fails application health checks, the deployment must halt immediately.\n\nWhich upgrade policy should you configure on the scale set?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Manual upgrade policy with an Azure Automation runbook."},
                {"id": "B", "text": "Automatic upgrade policy without an Application Health extension."},
                {"id": "C", "text": "Opportunistic upgrade policy."},
                {"id": "D", "text": "Rolling upgrade policy combined with an Application Health extension or Load Balancer health probe."}
            ],
            "correctAnswer": "D",
            "explanation": {
                "verdict": "Option D is correct.",
                "triggerConstraints": "Requirement: Automatically roll out a new VMSS image in batches without downtime and halt if health checks fail.",
                "flawedMentalModel": "Assuming 'Automatic' upgrade policy upgrades instances in safe batches with rollback protection.",
                "coreMechanic": "The `Rolling` upgrade policy deploys model updates in controlled phases/batches across the scale set. When combined with health probes or the Application Health Extension, it pauses and rolls back if unhealthy instances are detected. In contrast, `Automatic` upgrades all instances simultaneously without guaranteeing zero-downtime batching, and `Manual` requires manual intervention per VM.",
                "distractors": {
                    "A": "Manual policy requires administrators to trigger `az vmss update-instances` manually.",
                    "B": "Automatic policy can bring down too many instances simultaneously and lacks batch health gating.",
                    "C": "'Opportunistic' is not a recognized Azure VMSS upgrade policy mode."
                },
                "heuristic": "Safe, zero-downtime batch updates for VMSS = Rolling upgrade policy + Application Health probe.",
                "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-scale-set#how-to-use-rolling-upgrades"
            }
        },
        {
            "id": "e3-q31",
            "examNumber": 3,
            "domain": "Domain 3: Deploy and manage Azure compute resources",
            "domainCode": 3,
            "topic": "Azure Container Instances (ACI) Restart Policies for Batch Workloads",
            "scenario": "You are deploying an Azure Container Instance (ACI) via Bicep to execute a nightly data transformation job. The container executes a Python script that takes 30 minutes, writes transformed output to an Azure Storage blob, and exits with code 0 upon success.\n\nIf the script encounters a transient network error and crashes with a non-zero exit code (e.g. code 1), it must restart automatically. Once the script finishes successfully with exit code 0, the container must stop and terminate billing.\n\nWhich `restartPolicy` should you specify?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "`OnFailure`"},
                {"id": "B", "text": "`Always`"},
                {"id": "C", "text": "`Never`"},
                {"id": "D", "text": "`Conditional`"}
            ],
            "correctAnswer": "A",
            "explanation": {
                "verdict": "Option A is correct.",
                "triggerConstraints": "Requirement: Configure ACI restart policy to restart on crash/non-zero exit but stay stopped on successful exit 0.",
                "flawedMentalModel": "Selecting `Always` (which causes batch containers to loop forever) or `Never` (which fails to retry on crashes).",
                "coreMechanic": "Azure Container Instances supports three restart policies: (1) `Always` (ideal for long-running web servers; always restarts on exit), (2) `Never` (runs once and never restarts regardless of exit code), and (3) `OnFailure` (restarts only if the container process crashes or exits with a non-zero exit code; stays terminated on exit 0).",
                "distractors": {
                    "B": "`Always` restarts the container even when it successfully completes with exit code 0, causing infinite execution loops and billing.",
                    "C": "`Never` will not restart the container if it encounters a transient crash or exit code 1.",
                    "D": "`Conditional` is not a valid ACI restartPolicy property."
                },
                "heuristic": "ACI Batch Jobs that retry errors: restartPolicy: OnFailure. Long-running web apps: Always. Run-once tasks: Never.",
                "msLearnUrl": "https://learn.microsoft.com/azure/container-instances/container-instances-restart-policy"
            }
        },
        {
            "id": "e3-q32",
            "examNumber": 3,
            "domain": "Domain 3: Deploy and manage Azure compute resources",
            "domainCode": 3,
            "topic": "Azure Container Apps (ACA) Revision Modes and Traffic Splitting (Canary)",
            "scenario": "You deploy an Azure Container App named `aca-payment-service` to host a microservice. You are preparing to deploy revision `v2`. You need to perform a canary deployment by routing exactly 15% of incoming HTTPS traffic to revision `v2`, while 85% remains directed to the stable revision `v1`.\n\nWhat configuration steps are required in Azure Container Apps?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Set Ingress to Internal and configure an Azure Front Door origin group with weighted routing rules."},
                {"id": "B", "text": "Set the Revision mode to `Multiple`, deploy revision `v2`, and configure Ingress traffic splitting rules allocating 85% to `v1` and 15% to `v2`."},
                {"id": "C", "text": "Set the Revision mode to `Single` and configure an Application Gateway URL rewrite rule."},
                {"id": "D", "text": "Deploy revision `v2` to an Azure Container Instance and configure DNS round-robin."}
            ],
            "correctAnswer": "B",
            "explanation": {
                "verdict": "Option B is correct.",
                "triggerConstraints": "Requirement: Split traffic between two revisions (85% / 15%) in Azure Container Apps.",
                "flawedMentalModel": "Attempting to use external load balancers or assuming Container Apps only supports Single revision mode.",
                "coreMechanic": "Azure Container Apps provides built-in application revision management. By setting the Revision mode to `Multiple` (rather than `Single`), multiple active revisions can run concurrently. In the Ingress settings, administrators can define exact percentage traffic splitting across revisions (e.g. 85% to v1, 15% to v2).",
                "distractors": {
                    "A": "Azure Container Apps provides native traffic splitting; external Front Door weighting is unnecessary and overly complex.",
                    "C": "`Single` revision mode automatically deactivates previous revisions when a new revision is deployed, preventing traffic splitting.",
                    "D": "Splitting across disparate compute services (ACA and ACI) breaks revision tracking and microservice observability."
                },
                "heuristic": "Azure Container Apps canary traffic splitting REQUIRES Revision mode = Multiple + Ingress traffic split percentages.",
                "msLearnUrl": "https://learn.microsoft.com/azure/container-apps/revisions"
            }
        },
        {
            "id": "e3-q33",
            "examNumber": 3,
            "domain": "Domain 3: Deploy and manage Azure compute resources",
            "domainCode": 3,
            "topic": "Azure Container Apps (ACA) Ingress Types: Internal vs External",
            "scenario": "You have a microservices architecture hosted in an Azure Container Apps Environment containing two container apps: `storefront-frontend` and `order-processing-api`.\n- `storefront-frontend` must be accessible from the public Internet over HTTPS.\n- `order-processing-api` must ONLY be callable by `storefront-frontend` within the environment and must reject all direct inbound traffic from the public Internet.\n\nHow should you configure the Ingress settings for `order-processing-api`?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Set Ingress to External and configure an IP restriction rule blocking `0.0.0.0/0`."},
                {"id": "B", "text": "Disable Ingress completely on `order-processing-api`."},
                {"id": "C", "text": "Set Ingress to `Internal` (limited to the Container Apps Environment)."},
                {"id": "D", "text": "Configure a Network Security Group on the Container Apps Environment management subnet."}
            ],
            "correctAnswer": "C",
            "explanation": {
                "verdict": "Option C is correct.",
                "triggerConstraints": "Requirement: Allow internal microservice communication within a Container Apps Environment while blocking all Internet ingress.",
                "flawedMentalModel": "Disabling Ingress entirely (which prevents even internal HTTP communication from sibling container apps).",
                "coreMechanic": "In Azure Container Apps, Ingress can be configured to: (1) `External` (accepts traffic from the public internet and other container apps), (2) `Internal` (accessible only to other apps within the Container Apps Environment or connected VNet, rejecting public internet traffic), or (3) `Disabled` (blocks all HTTP ingress; only useful for background queue/event worker apps).",
                "distractors": {
                    "A": "Configuring External ingress with IP restrictions is fragile and unnecessarily exposes the public ingress endpoint.",
                    "B": "Disabling Ingress prevents incoming HTTP traffic from ANY source, including `storefront-frontend`.",
                    "D": "Container Apps ingress is managed directly at the application and environment ingress configuration, not manual NSG rules."
                },
                "heuristic": "Container App internal-only microservice communication = Ingress: Internal.",
                "msLearnUrl": "https://learn.microsoft.com/azure/container-apps/ingress-overview"
            }
        },
        {
            "id": "e3-q34",
            "examNumber": 3,
            "domain": "Domain 3: Deploy and manage Azure compute resources",
            "domainCode": 3,
            "topic": "App Service Deployment Slot Swap Mechanics and Sticky Slot Settings",
            "scenario": "You have an Azure App Service Web App `app-ecommerce` running on Standard plan `S1` with a `production` slot and a `staging` slot. You add an Application Setting named `DatabaseConnectionString` pointing to the staging database on the `staging` slot.\n\nYou need to ensure that when you execute a deployment slot swap between `staging` and `production`, this connection string setting DOES NOT swap to production, but stays permanently attached to the staging slot.\n\nWhat configuration should you apply?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Store the connection string in an Azure Key Vault and configure a Key Vault reference with system-assigned identity."},
                {"id": "B", "text": "Upgrade the App Service Plan from Standard S1 to Premium v3 P1v3."},
                {"id": "C", "text": "Add the setting to `web.config` and deploy via Git deployment."},
                {"id": "D", "text": "Select the 'Deployment slot setting' checkbox for `DatabaseConnectionString` in the staging slot configuration blade."}
            ],
            "correctAnswer": "D",
            "explanation": {
                "verdict": "Option D is correct.",
                "triggerConstraints": "Requirement: Ensure an App Service configuration setting remains pinned (sticky) to a slot during slot swaps.",
                "flawedMentalModel": "Assuming slot swaps swap everything unless stored in Key Vault.",
                "coreMechanic": "In Azure App Service, checking the 'Deployment slot setting' box (sticky setting) on an app setting or connection string pins that configuration to the specific slot. When a swap occurs, sticky settings do not move; the swapped code will automatically read the destination slot's existing configuration.",
                "distractors": {
                    "A": "Key Vault references will still swap if not designated as a Deployment slot setting.",
                    "B": "Deployment slot settings are fully supported on Standard tier; upgrading to Premium v3 is unnecessary.",
                    "C": "Hardcoding connection strings in source code or `web.config` is an insecure anti-pattern."
                },
                "heuristic": "To keep an App Service setting pinned to a slot across swaps: check 'Deployment slot setting' (sticky setting).",
                "msLearnUrl": "https://learn.microsoft.com/azure/app-service/deploy-staging-slots#which-settings-are-swapped"
            }
        },
        {
            "id": "e3-q35",
            "examNumber": 3,
            "domain": "Domain 3: Deploy and manage Azure compute resources",
            "domainCode": 3,
            "topic": "App Service Managed Certificates (ASMC) Limitations and Supported Hostnames",
            "scenario": "You are configuring custom domains and TLS/SSL bindings for an Azure App Service Web App running on a Basic `B1` plan. You plan to use the free Azure App Service Managed Certificates (ASMC) to secure the bindings.\n\nWhich custom domain configuration is supported by free App Service Managed Certificates?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "`portal.contoso.com` (a standard subdomain mapped via a CNAME record to the app's default hostname)."},
                {"id": "B", "text": "`contoso.com` (a naked apex root domain mapped via an A record and TXT verification)."},
                {"id": "C", "text": "`*.contoso.com` (a wildcard certificate domain for all subdomains)."},
                {"id": "D", "text": "Any domain configured with client certificate authentication enabled."}
            ],
            "correctAnswer": "A",
            "explanation": {
                "verdict": "Option A is correct.",
                "triggerConstraints": "Requirement: Identify which domain type can be secured using the free Azure App Service Managed Certificate (ASMC).",
                "flawedMentalModel": "Assuming free App Service Managed Certificates support apex/root domains or wildcards.",
                "coreMechanic": "Free Azure App Service Managed Certificates (ASMC) have specific constraints: (1) They support standard subdomains validated via CNAME (e.g. `portal.contoso.com`), (2) They do NOT support naked/apex root domains (`contoso.com`), (3) They do NOT support wildcard domains (`*.contoso.com`), and (4) They do not support export or private endpoints.",
                "distractors": {
                    "B": "Naked apex root domains are NOT supported by free App Service Managed Certificates; they require App Service Certificate (paid) or custom cert.",
                    "C": "Wildcard domains are NOT supported by free App Service Managed Certificates.",
                    "D": "Client certificate authentication is not a property of server TLS certificates."
                },
                "heuristic": "Free App Service Managed Certificates (ASMC) ONLY support standard subdomains (CNAME). NO apex domains, NO wildcards.",
                "msLearnUrl": "https://learn.microsoft.com/azure/app-service/configure-ssl-certificate#create-a-free-managed-certificate"
            }
        },
        {
            "id": "e3-q36",
            "examNumber": 3,
            "domain": "Domain 3: Deploy and manage Azure compute resources",
            "domainCode": 3,
            "topic": "Azure Managed Disk Resizing and Shrinking Limitations",
            "scenario": "You have an Azure virtual machine `vm-analytics` running Ubuntu Linux with an attached 512 GB Premium SSD data disk (`disk-data-01`). The application disk usage has reached 90%, and you need to increase the disk capacity to 1024 GB.\n\nYou also want to confirm whether you can shrink the disk back to 512 GB in the future if data is archived to blob storage.\n\nWhat is the true behavior regarding disk resizing in Azure?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "You can expand the disk online, and you can later shrink the disk back to 512 GB without data loss."},
                {"id": "B", "text": "You can expand the disk (online expansion is supported without deallocating the VM on modern host OSes), but Azure Managed Disks NEVER support shrinking an existing disk; reducing disk size requires creating a new smaller disk and copying files over."},
                {"id": "C", "text": "You must deallocate the VM to expand the disk, but shrinking can be performed while the VM is running."},
                {"id": "D", "text": "Disk resizing requires converting the disk to Standard HDD first."}
            ],
            "correctAnswer": "B",
            "explanation": {
                "verdict": "Option B is correct.",
                "triggerConstraints": "Requirement: Understand capabilities and strict limitations when resizing Azure Managed Disks.",
                "flawedMentalModel": "Assuming Azure Managed Disks allow shrinking like virtual disk files in on-premises VMware or Hyper-V.",
                "coreMechanic": "Azure Managed Disks support expansion (increasing size), which can be done online without deallocating the VM for supported OS configurations. However, Azure Managed Disks NEVER support shrinking or reducing disk size to protect against file system corruption. Downsizing requires provisioning a new smaller disk and migrating data.",
                "distractors": {
                    "A": "Azure strictly blocks any operation that attempts to decrease disk size.",
                    "C": "Shrinking is completely unsupported regardless of VM running or deallocated state.",
                    "D": "Disks can be resized within their current performance tier without SKU downgrade."
                },
                "heuristic": "Azure Managed Disks can ONLY be expanded. Shrinking an existing managed disk is strictly IMPOSSIBLE.",
                "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machines/disks-expand-how-to"
            }
        },
        {
            "id": "e3-q37",
            "examNumber": 3,
            "domain": "Domain 3: Deploy and manage Azure compute resources",
            "domainCode": 3,
            "topic": "Azure Premium SSD Dynamic Performance Tier Changes Without Downtime",
            "scenario": "You operate an e-commerce database on an Azure VM using a 1 TB Premium SSD managed data disk (`P30` tier: 5,000 IOPS, 200 MB/s). During an upcoming annual sales festival, expected transaction volume will require 7,500 IOPS and 250 MB/s.\n\nYou need to temporarily boost disk performance to meet this demand without resizing the disk, without adding more disks, and without deallocating or restarting the VM.\n\nWhat should you do?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Strip 2 additional P30 disks inside the guest OS using LVM."},
                {"id": "B", "text": "Convert the disk storage account type to Ultra Disk."},
                {"id": "C", "text": "Change the disk 'Performance tier' setting from P30 to P40 in the Azure portal or CLI while maintaining the 1 TB disk size, and downgrade it back after the event."},
                {"id": "D", "text": "Enable host caching with Read/Write mode on the data disk."}
            ],
            "correctAnswer": "C",
            "explanation": {
                "verdict": "Option C is correct.",
                "triggerConstraints": "Requirement: Increase IOPS and throughput on a Premium SSD without resizing disk size or deallocating the VM.",
                "flawedMentalModel": "Assuming disk performance is tied strictly to disk size and cannot be scaled independently.",
                "coreMechanic": "Azure Premium SSDs support dynamic Performance Tiers. You can change the performance tier (e.g. from P30 to P40 or P50) on an active disk without changing the physical capacity (remaining 1 TB) and without rebooting or deallocating the VM. After the peak period, you can change the performance tier back (minimum 12 hours between tier changes).",
                "distractors": {
                    "A": "Requires partitioning, volume management, and adding extra cost disks.",
                    "B": "Ultra Disk cannot be changed dynamically on a running VM that wasn't created with Ultra Disk compatibility.",
                    "D": "Host caching does not increase baseline disk IOPS from 5,000 to 7,500 and is not recommended for database write paths."
                },
                "heuristic": "Boost Premium SSD IOPS/throughput without resizing disk or restarting VM = Change Disk Performance Tier.",
                "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machines/disks-change-performance"
            }
        },
        {
            "id": "e3-q38",
            "examNumber": 3,
            "domain": "Domain 3: Deploy and manage Azure compute resources",
            "domainCode": 3,
            "topic": "Constrained vCPU VM Sizing for Per-Core Database Licensing",
            "scenario": "Your enterprise plans to deploy Microsoft SQL Server Enterprise on an Azure Virtual Machine. The database workload requires 128 GB of RAM and high memory bandwidth, but SQL Server Enterprise licensing is charged per active CPU core. Query processing only requires 4 vCPUs.\n\nDeploying a standard 16-vCPU VM (`Standard_E16ds_v5`) would result in exorbitant licensing fees for 16 cores.\n\nWhich VM size should you deploy to minimize software licensing costs while retaining 128 GB of RAM?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "`Standard_B4ms`"},
                {"id": "B", "text": "`Standard_D4ds_v5`"},
                {"id": "C", "text": "`Standard_F4s_v2`"},
                {"id": "D", "text": "`Standard_E16-4s_v5` (Constrained vCPU SKU)"}
            ],
            "correctAnswer": "D",
            "explanation": {
                "verdict": "Option D is correct.",
                "triggerConstraints": "Requirement: Minimize per-core database software licensing costs while providing 128 GB RAM and 4 active vCPUs.",
                "flawedMentalModel": "Choosing a smaller standard 4-core VM like D4ds_v5 which only has 16 GB RAM.",
                "coreMechanic": "Azure Constrained vCPU VM sizes (such as `Standard_E16-4s_v5` or `Standard_M32-8ms`) offer the full memory, storage, and I/O bandwidth of the parent size (128 GB RAM from E16), but constrain the reported active vCPUs to 4 cores. This drastically slashes per-core database licensing fees while preserving memory capacity.",
                "distractors": {
                    "A": "`Standard_B4ms` only has 16 GB of RAM, failing the 128 GB requirement.",
                    "B": "`Standard_D4ds_v5` only has 16 GB of RAM, failing the 128 GB requirement.",
                    "C": "`Standard_F4s_v2` is compute-optimized with only 8 GB of RAM."
                },
                "heuristic": "High memory + low active CPU cores for database licensing = Constrained vCPU VM SKU (e.g. E16-4s).",
                "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machines/constrained-vcpu"
            }
        },
        {
            "id": "e3-q39",
            "examNumber": 3,
            "domain": "Domain 3: Deploy and manage Azure compute resources",
            "domainCode": 3,
            "topic": "App Service Plan Scaling Dimensions: Scale-Up vs Scale-Out",
            "scenario": "An enterprise web application running on Azure App Service Plan `ASP-Finance` (currently on `Basic B2` tier) is experiencing performance degradation. The DevOps lead asks you to explain the difference between scaling up and scaling out, and specifies that the application must support automatic metric-based autoscaling up to 30 instances during month-end billing runs.\n\nWhich statement accurately describes the architecture and required tier?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Scaling up increases compute capacity per VM instance (CPU/RAM/pricing tier); scaling out increases the number of VM instances. Automatic metric-based scaling up to 30 instances requires the Premium v3 tier."},
                {"id": "B", "text": "Scaling up increases the number of VM instances; scaling out upgrades from Basic to Standard. Standard tier supports autoscaling up to 50 instances."},
                {"id": "C", "text": "Basic B2 tier supports metric-based autoscaling up to 30 instances without upgrading."},
                {"id": "D", "text": "Scaling out is only supported if the App Service is deployed to an isolated App Service Environment (ASE)."}
            ],
            "correctAnswer": "A",
            "explanation": {
                "verdict": "Option A is correct.",
                "triggerConstraints": "Requirement: Define scale-up vs scale-out and identify tier needed for metric autoscaling up to 30 instances.",
                "flawedMentalModel": "Confusing scale-up (vertical) with scale-out (horizontal) or assuming Standard tier scales up to 30 instances.",
                "coreMechanic": "Scale-up = vertical scaling (upgrading pricing tier and VM hardware specs like CPU and RAM). Scale-out = horizontal scaling (adding more VM instances). Basic tier only supports manual scale-out up to 3 instances. Standard tier supports metric autoscaling up to 10 instances. Premium v3 tier supports metric autoscaling up to 30 instances.",
                "distractors": {
                    "B": "Inverts the definitions of scale-up and scale-out, and Standard tier is capped at 10 instances, not 50.",
                    "C": "Basic tier does NOT support autoscaling (only manual scaling up to 3 instances).",
                    "D": "Scale-out is supported across all multi-tenant tiers (Basic, Standard, Premium); an ASE is not required."
                },
                "heuristic": "Scale Up = Bigger VMs (CPU/RAM). Scale Out = More VMs. Autoscaling up to 30 instances = Premium v3.",
                "msLearnUrl": "https://learn.microsoft.com/azure/app-service/manage-scale-up"
            }
        },
        {
            "id": "e3-q40",
            "examNumber": 3,
            "domain": "Domain 3: Deploy and manage Azure compute resources",
            "domainCode": 3,
            "topic": "Azure VM Run Command vs Custom Script Extension",
            "scenario": "A production Windows Azure VM `vm-payroll` has become inaccessible via Remote Desktop (RDP) following an erroneous Windows Firewall policy update inside the guest OS that disabled port 3389. The VM has no public IP address and resides in a private backend subnet behind a firewall.\n\nYou need to immediately re-enable RDP in the guest operating system without restarting the VM and without requiring direct network connectivity from your workstation.\n\nWhat should you do?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Redeploy the VM to a new Azure host using the Redeploy blade in the portal."},
                {"id": "B", "text": "Use the 'Run Command' feature in the Azure Portal (or `az vm run-command invoke`) to execute the pre-built `EnableRemotePS` or a PowerShell command via the Azure VM Agent."},
                {"id": "C", "text": "Create an NSG inbound rule with priority 50 allowing port 3389 from Any."},
                {"id": "D", "text": "Detach the OS disk, attach it to another VM, edit the registry, and attach it back."}
            ],
            "correctAnswer": "B",
            "explanation": {
                "verdict": "Option B is correct.",
                "triggerConstraints": "Requirement: Execute an administrative script inside a guest OS to fix firewall rules without RDP/SSH network connectivity and without rebooting.",
                "flawedMentalModel": "Assuming host redeployment fixes guest OS internal firewall settings or detaching disks unnecessarily.",
                "coreMechanic": "Azure VM Run Command utilizes the Azure VM Agent (Windows or Linux) to execute scripts directly inside the guest OS. Because communications pass through the internal Azure fabric channel (168.63.129.16), Run Command works even if the VM has no public IP, no open inbound ports, and RDP is disabled in Windows Firewall.",
                "distractors": {
                    "A": "Redeploying moves the VM to a new physical hypervisor host but does not modify guest OS internal firewall settings.",
                    "C": "The blockage is inside the guest OS Windows Firewall, not the Azure Network Security Group.",
                    "D": "Detaching the OS disk incurs significant downtime and operational risk when Run Command solves it live in seconds."
                },
                "heuristic": "Execute scripts inside an isolated or misconfigured VM without network access = Azure VM Run Command.",
                "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machines/windows/run-command"
            }
        },
        {
            "id": "e3-q41",
            "examNumber": 3,
            "domain": "Domain 3: Deploy and manage Azure compute resources",
            "domainCode": 3,
            "topic": "Azure Dedicated Hosts for Physical Server Isolation",
            "scenario": "A banking institution is migrating transaction processing workloads to Azure Virtual Machines. Due to strict financial regulatory standards, the bank's virtual machines CANNOT share physical hypervisor host hardware with workloads from other Azure customers. Furthermore, the bank requires full control over platform host maintenance schedules.\n\nWhich Azure service architecture fulfills these requirements?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Purchase 3-year Azure Reserved Virtual Machine Instances (RIs)."},
                {"id": "B", "text": "Deploy the VMs into an isolated Availability Zone with Proximity Placement Groups."},
                {"id": "C", "text": "Provision an Azure Dedicated Host Group, create Azure Dedicated Hosts, and deploy the virtual machines onto the dedicated hosts."},
                {"id": "D", "text": "Apply a CanNotDelete management lock to the subscription root."}
            ],
            "correctAnswer": "C",
            "explanation": {
                "verdict": "Option C is correct.",
                "triggerConstraints": "Requirement: Guarantee dedicated single-tenant physical hardware and control over host maintenance windows.",
                "flawedMentalModel": "Assuming Reserved Instances or Proximity Placement Groups provide single-tenant physical hardware isolation.",
                "coreMechanic": "Azure Dedicated Host provides physical servers dedicated to your Azure subscription that host only your virtual machines. It satisfies single-tenant hardware isolation compliance mandates, gives socket/core visibility, and provides control over host maintenance windows.",
                "distractors": {
                    "A": "Reserved Instances are a billing discount mechanism; they do not alter multi-tenant physical hardware placement.",
                    "B": "Proximity Placement Groups minimize network latency by placing VMs physically close together; they do not provide single-tenant host isolation.",
                    "D": "Management locks prevent deletion; they have no relation to compute hardware tenancy."
                },
                "heuristic": "Strict single-tenant physical hardware isolation compliance = Azure Dedicated Host.",
                "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machines/dedicated-hosts"
            }
        },
        {
            "id": "e3-q42",
            "examNumber": 3,
            "domain": "Domain 3: Deploy and manage Azure compute resources",
            "domainCode": 3,
            "topic": "Managed Disk Incremental Snapshots vs Full Snapshots Cost Optimization",
            "scenario": "You need to implement a daily backup snapshot strategy for several 4 TB Azure Managed OS and Data disks. To minimize monthly Azure storage consumption and billing, the snapshots must only store the blocks that have changed since the previous snapshot, while allowing point-in-time disk recovery.\n\nWhich snapshot type should you configure?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Full Snapshots stored in Premium SSD LRS."},
                {"id": "B", "text": "Disk clones created via AzCopy daily jobs."},
                {"id": "C", "text": "Unmanaged VHD exports to an archive storage account."},
                {"id": "D", "text": "Incremental Snapshots of the managed disks."}
            ],
            "correctAnswer": "D",
            "explanation": {
                "verdict": "Option D is correct.",
                "triggerConstraints": "Requirement: Implement cost-effective managed disk snapshots storing only delta changes since the last snapshot.",
                "flawedMentalModel": "Assuming managed disk snapshots always duplicate the entire disk size.",
                "coreMechanic": "Azure Managed Disks support Incremental Snapshots. Unlike Full Snapshots (which copy the entire disk capacity), Incremental Snapshots only store the delta changes (modified blocks) since the previous snapshot. They are billed on Standard HDD rates for only the changed data, resulting in massive cost savings.",
                "distractors": {
                    "A": "Full snapshots copy the entire disk capacity regardless of how few blocks changed, incurring high storage costs.",
                    "B": "Disk clones duplicate full provisioned capacity and require VM downtime or disk detachment.",
                    "C": "VHD exports require SAS URL generation, compute egress, and manual scripting."
                },
                "heuristic": "Cost-effective disk snapshots storing only changed blocks = Incremental Snapshots.",
                "msLearnUrl": "https://learn.microsoft.com/azure/virtual-machines/disks-incremental-snapshots"
            }
        }
    ]
