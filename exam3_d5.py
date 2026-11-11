#!/usr/bin/env python3
"""
Generator for exam_questions_exam3.js (Domain 5: Questions e3-q57 to e3-q65)
"""

def get_domain5_questions():
    return [
        {
            "id": "e3-q57",
            "examNumber": 3,
            "domain": "Domain 5: Monitor and maintain Azure resources",
            "domainCode": 5,
            "topic": "Azure Monitor Metric Alerts vs Scheduled Log Search Alerts",
            "scenario": "You are designing an alerting strategy for production virtual machines running an online trading service. When VM CPU utilization exceeds 90%, on-call engineers must be alerted within 2 minutes of the breach. The rule must evaluate metrics every 1 minute.\n\nWhy is an Azure Monitor Metric Alert chosen over a Scheduled Log Search Alert for this requirement?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Scheduled log search alerts can only be configured to run once every 24 hours."},
                {"id": "B", "text": "Metric alerts can trigger voice notifications, whereas Log search alerts only support email."},
                {"id": "C", "text": "Metric alerts evaluate near real-time against pre-aggregated time-series data with evaluation frequencies down to 1 minute, whereas Log Search Alerts query the Log Analytics workspace and suffer from 3 to 5 minutes of log ingestion latency."},
                {"id": "D", "text": "Metric alerts do not require an Action Group to send alerts."}
            ],
            "correctAnswer": "C",
            "explanation": {
                "verdict": "Option C is correct.",
                "triggerConstraints": "Requirement: Explain why Metric alerts provide lower latency and faster notifications (<2 mins) than Scheduled Log Search alerts.",
                "flawedMentalModel": "Assuming Log Analytics queries can trigger instant alerts without ingestion pipeline lag.",
                "coreMechanic": "Azure Monitor Metric Alerts evaluate directly against the lightweight, highly indexed time-series metric pipeline. Metrics are available within seconds and can be evaluated every 1 minute. Log Search Alerts run KQL queries against Log Analytics, which involves log ingestion latency (typically 3 to 5 minutes), making them unsuitable for sub-2-minute notification SLAs.",
                "distractors": {
                    "A": "Log search alerts can evaluate every 5 minutes (or 1 minute in some preview configurations), not 24 hours.",
                    "B": "Both metric and log search alerts invoke Action Groups, which support voice, SMS, email, and webhooks.",
                    "D": "Both alert types require Action Groups to dispatch notifications."
                },
                "heuristic": "Near real-time alerts (<2 min latency, 1-min frequency) = Metric Alerts. Deep text/complex event correlation = Log Alerts.",
                "msLearnUrl": "https://learn.microsoft.com/azure/azure-monitor/alerts/alerts-types#metric-alerts-compared-to-log-alerts"
            }
        },
        {
            "id": "e3-q58",
            "examNumber": 3,
            "domain": "Domain 5: Monitor and maintain Azure resources",
            "domainCode": 5,
            "topic": "Alert Processing Rules for Scheduled Maintenance Notification Suppression",
            "scenario": "You have 60 Azure virtual machines monitored by metric alert rules that page on-call engineers via an Action Group. Every Sunday between 02:00 and 06:00 UTC, the VMs undergo automated patching and OS reboots, triggering repeated false-alarm high CPU and heartbeat alert notifications.\n\nYou need to prevent notification emails and SMS pages from dispatching to engineers during this maintenance window without disabling or editing the underlying alert rules.\n\nWhat should you configure?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Delete the Action Group on Saturday and recreate it on Monday morning."},
                {"id": "B", "text": "Manually disable the 60 alert rules before patching and re-enable them afterwards."},
                {"id": "C", "text": "Change the alert severity from Sev 0 to Sev 4 during the weekend."},
                {"id": "D", "text": "Create an Alert Processing Rule configured to 'Suppress notifications', set a recurring schedule for Sundays 02:00–06:00 UTC, and scope it to the target resource group or subscription."}
            ],
            "correctAnswer": "D",
            "explanation": {
                "verdict": "Option D is correct.",
                "triggerConstraints": "Requirement: Suppress alert notifications during a recurring maintenance window without disabling alert rules.",
                "flawedMentalModel": "Disabling alert rules manually or modifying Action Groups repeatedly.",
                "coreMechanic": "Azure Monitor Alert Processing Rules (formerly Action Rules) operate on fired alerts. You can configure an Alert Processing Rule with action 'Suppress notifications' and assign a recurring schedule (e.g. Every Sunday from 02:00 to 06:00 UTC). During this window, alerts continue to fire and record in the portal, but Action Group notifications (SMS, email, push) are silently suppressed.",
                "distractors": {
                    "A": "Deleting and recreating Action Groups creates administrative churn and risks misconfiguration.",
                    "B": "Manually toggling 60 rules twice every weekend is operationally fragile and prone to human error.",
                    "C": "Changing severity still sends notifications configured for that severity."
                },
                "heuristic": "Silence alert notifications during maintenance windows = Alert Processing Rule > Suppress notifications on a schedule.",
                "msLearnUrl": "https://learn.microsoft.com/azure/azure-monitor/alerts/alerts-action-rules"
            }
        },
        {
            "id": "e3-q59",
            "examNumber": 3,
            "domain": "Domain 5: Monitor and maintain Azure resources",
            "domainCode": 5,
            "topic": "Log Analytics Workspace KQL Query for Missing Agent Heartbeats",
            "scenario": "You manage 150 Azure virtual machines running the Azure Monitor Agent (AMA). You need to write a Kusto Query Language (KQL) query in Log Analytics to identify any virtual machines that have stopped reporting and have not sent a heartbeat in the last 20 minutes.\n\nWhich KQL query should you run?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": 'Heartbeat | summarize LastHeartbeat = max(TimeGenerated) by Computer | where LastHeartbeat < ago(20m)'},
                {"id": "B", "text": 'AzureActivity | where OperationName == "Heartbeat" and TimeGenerated < ago(20m) | project Computer'},
                {"id": "C", "text": 'Perf | where CounterName == "% Processor Time" and TimeGenerated > ago(20m) | summarize by Computer'},
                {"id": "D", "text": 'Heartbeat | where TimeGenerated > ago(20m) | summarize count() by Computer | where count_ == 0'}
            ],
            "correctAnswer": "A",
            "explanation": {
                "verdict": "Option A is correct.",
                "triggerConstraints": "Requirement: Write a KQL query identifying virtual machines that have not reported a heartbeat within the last 20 minutes.",
                "flawedMentalModel": "Attempting to query `TimeGenerated > ago(20m)` with count == 0 (rows that do not exist cannot be filtered by a positive `where` clause).",
                "coreMechanic": "In Log Analytics, the `Heartbeat` table records health signals sent every minute by agents. To find machines that stopped reporting, you summarize the most recent timestamp (`max(TimeGenerated)`) grouped by `Computer` across the workspace dataset, and then filter for machines whose latest heartbeat occurred prior to 20 minutes ago: `where LastHeartbeat < ago(20m)`.",
                "distractors": {
                    "B": "`AzureActivity` records ARM management operations (create/update/delete), not VM OS agent heartbeats.",
                    "C": "`Perf` table records performance metrics, not heartbeat health signals.",
                    "D": "Filtering for `TimeGenerated > ago(20m)` eliminates all missing machines from the initial dataset, resulting in zero rows returned."
                },
                "heuristic": "Find inactive reporting resources in KQL: summarize LastSeen = max(TimeGenerated) by Resource | where LastSeen < ago(window).",
                "msLearnUrl": "https://learn.microsoft.com/azure/azure-monitor/logs/log-query-overview"
            }
        },
        {
            "id": "e3-q60",
            "examNumber": 3,
            "domain": "Domain 5: Monitor and maintain Azure resources",
            "domainCode": 5,
            "topic": "Recovery Services Vault VM Backup Instant Restore Snapshots",
            "scenario": "You configure a virtual machine backup policy in an Azure Recovery Services Vault with the following policy parameters:\n- Daily backup at 01:00 UTC\n- Instant Restore snapshot retention: 2 days\n- Daily backup point retention in vault: 30 days\n\nA corrupted configuration file occurs on VM `vm-web-01`. You restore the VM from yesterday's backup point. The restore finishes in under 3 minutes without waiting for data transfer out of the vault storage.\n\nWhy does this restore complete so rapidly?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "The VM disk was stored in the cool storage tier of the Recovery Services Vault."},
                {"id": "B", "text": "The restore point is satisfied directly from the local Instant Restore snapshot stored in the VM's storage subscription, bypassing vault storage data retrieval."},
                {"id": "C", "text": "The VM is protected by an Azure Backup Vault rather than a Recovery Services Vault."},
                {"id": "D", "text": "Azure Site Recovery automatically executed a failback."}
            ],
            "correctAnswer": "B",
            "explanation": {
                "verdict": "Option B is correct.",
                "triggerConstraints": "Requirement: Explain why an Azure VM backup restore completes in minutes when within the Instant Restore retention window.",
                "flawedMentalModel": "Assuming all restores pull data across the network from the Recovery Services Vault storage backend.",
                "coreMechanic": "Azure VM Backup's Instant Restore feature retains a local point-in-time disk snapshot in the customer's subscription alongside the VM disks for 1 to 5 days (default 2 days). When restoring from a backup within this snapshot window, Azure attaches a disk clone directly from the local snapshot, completing the restore in minutes without waiting for data transfer from the vault.",
                "distractors": {
                    "A": "Vault storage tiers do not alter network transfer times from the vault.",
                    "C": "Azure Backup Vault does not protect standard Azure VMs; Recovery Services Vault does.",
                    "D": "Azure Site Recovery is a disaster recovery replication tool, not the standard daily backup restore engine."
                },
                "heuristic": "Instant Restore in Azure Backup: Snapshots kept locally for 1–5 days allow near-instant disk restores without vault data transfer.",
                "msLearnUrl": "https://learn.microsoft.com/azure/backup/backup-instant-restore-capability"
            }
        },
        {
            "id": "e3-q61",
            "examNumber": 3,
            "domain": "Domain 5: Monitor and maintain Azure resources",
            "domainCode": 5,
            "topic": "Recovery Services Vault Cross Region Restore (CRR) Prerequisites",
            "scenario": "You are designing an Azure disaster recovery strategy for virtual machines and SQL databases hosted in `East US`. If `East US` experiences a catastrophic regional disaster, administrators must be able to restore backups in the paired secondary region (`West US`), even while the primary region is completely offline.\n\nWhich Recovery Services Vault feature must you configure, and what is its mandatory prerequisite?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Enable Cross Region Restore (CRR) on a vault configured with Locally Redundant Storage (LRS)."},
                {"id": "B", "text": "Configure an Azure Site Recovery replication group with an ExpressRoute gateway."},
                {"id": "C", "text": "Configure the Recovery Services Vault storage redundancy as Geo-Redundant Storage (GRS), and explicitly enable 'Cross Region Restore' before taking backups."},
                {"id": "D", "text": "Deploy Microsoft Azure Backup Server (MABS) on an Azure VM in the secondary region."}
            ],
            "correctAnswer": "C",
            "explanation": {
                "verdict": "Option C is correct.",
                "triggerConstraints": "Requirement: Enable backup restores in a secondary paired region during primary region outages.",
                "flawedMentalModel": "Assuming standard GRS backup storage allows secondary region restores without enabling Cross Region Restore (CRR).",
                "coreMechanic": "Standard GRS vaults only allow restoring data in the secondary region if Microsoft declares an official regional disaster. To restore data in the secondary region at any time (including during partial outages, drills, or immediate failover), you must explicitly enable 'Cross Region Restore (CRR)'. CRR is ONLY available when vault storage redundancy is configured as Geo-Redundant (GRS).",
                "distractors": {
                    "A": "CRR requires Geo-Redundant Storage (GRS); it cannot be enabled on Locally Redundant Storage (LRS).",
                    "B": "ASR handles live replication, but the question specifically asks for Recovery Services Vault backup restores.",
                    "D": "MABS is for on-premises hybrid workload protection and is not required for native Azure VM CRR."
                },
                "heuristic": "Restore Azure Backups in secondary paired region during primary outage = Vault GRS + Cross Region Restore (CRR) enabled.",
                "msLearnUrl": "https://learn.microsoft.com/azure/backup/backup-create-rs-vault#set-cross-region-restore"
            }
        },
        {
            "id": "e3-q62",
            "examNumber": 3,
            "domain": "Domain 5: Monitor and maintain Azure resources",
            "domainCode": 5,
            "topic": "Workload Protection Boundaries: Recovery Services Vault vs Azure Backup Vault",
            "scenario": "You are organizing Azure backup infrastructure for three distinct workloads:\n1. 20 Azure Virtual Machines (IaaS Windows and Linux)\n2. 50 Azure Managed Disks (standalone disk backups)\n3. 10 Azure Storage Blob Containers (operational backup for blobs)\n\nWhich vault types must you provision to back up these three workloads?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "A single Recovery Services Vault for all three workloads."},
                {"id": "B", "text": "A single Azure Backup Vault for all three workloads."},
                {"id": "C", "text": "An Azure Backup Vault for VMs, and a Recovery Services Vault for Disks and Blobs."},
                {"id": "D", "text": "A Recovery Services Vault for Azure Virtual Machines, and an Azure Backup Vault for Azure Managed Disks and Azure Blobs."}
            ],
            "correctAnswer": "D",
            "explanation": {
                "verdict": "Option D is correct.",
                "triggerConstraints": "Requirement: Assign the correct vault type (Recovery Services Vault vs Backup Vault) to Azure VMs, Managed Disks, and Blobs.",
                "flawedMentalModel": "Assuming Recovery Services Vault supports all modern Azure resources like Disks and Blobs.",
                "coreMechanic": "Microsoft Azure partitions backup management into two vault architectures: (1) Recovery Services Vault: Protects traditional server/compute workloads (Azure VMs, SQL Server in Azure VMs, SAP HANA, and on-premises MARS/MABS). (2) Azure Backup Vault: Protects newer cloud workloads (Azure Managed Disks, Azure Blobs, Azure PostgreSQL Flexible Server, and AKS).",
                "distractors": {
                    "A": "Recovery Services Vault does not support native disk backups or blob operational backups.",
                    "B": "Azure Backup Vault does not support traditional Azure Virtual Machine backups.",
                    "C": "Completely reverses the workload assignments."
                },
                "heuristic": "Vault Division: Recovery Services Vault = Azure VMs & SQL in VM. Backup Vault = Managed Disks & Blobs & PostgreSQL.",
                "msLearnUrl": "https://learn.microsoft.com/azure/backup/backup-vault-overview"
            }
        },
        {
            "id": "e3-q63",
            "examNumber": 3,
            "domain": "Domain 5: Monitor and maintain Azure resources",
            "domainCode": 5,
            "topic": "Azure Site Recovery (ASR) Disaster Recovery Drills via Test Failover",
            "scenario": "Your enterprise conducts quarterly disaster recovery drills for an accounting application replicated from `East US` to `Central US` via Azure Site Recovery (ASR). The DR drill must:\n1. Verify that replicated VMs boot and pass operational smoke tests in `Central US`.\n2. Cause zero downtime to production VMs running in `East US`.\n3. Prevent any IP address collisions or network interference with ongoing replication.\n\nWhich action should you perform in Azure Site Recovery?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Execute a 'Test Failover' and select an isolated, non-production test virtual network in `Central US`."},
                {"id": "B", "text": "Execute a 'Planned Failover' and shut down the primary VMs."},
                {"id": "C", "text": "Execute an 'Unplanned Failover' and immediately click Commit."},
                {"id": "D", "text": "Disable replication, clone the target disks, and build manual VMs."}
            ],
            "correctAnswer": "A",
            "explanation": {
                "verdict": "Option A is correct.",
                "triggerConstraints": "Requirement: Execute a disaster recovery drill without impacting production VMs or interrupting ongoing ASR replication.",
                "flawedMentalModel": "Running a planned or unplanned failover for a routine drill.",
                "coreMechanic": "Azure Site Recovery provides a dedicated 'Test Failover' feature designed specifically for non-disruptive disaster recovery drills. Test failover creates test virtual machines attached to an isolated test virtual network in the target region. Production workloads remain online in the primary region, ongoing replication continues uninterrupted, and cleaning up the drill requires just clicking 'Clean up test failover'.",
                "distractors": {
                    "B": "Planned failover shuts down primary production virtual machines, causing production downtime.",
                    "C": "Unplanned failover is for real disasters; committing it makes the secondary region the permanent production site.",
                    "D": "Disabling replication breaks DR protection and creates significant operational overhead."
                },
                "heuristic": "Disaster recovery drills without production impact = ASR Test Failover into an isolated test VNet.",
                "msLearnUrl": "https://learn.microsoft.com/azure/site-recovery/site-recovery-test-failover-to-azure"
            }
        },
        {
            "id": "e3-q64",
            "examNumber": 3,
            "domain": "Domain 5: Monitor and maintain Azure resources",
            "domainCode": 5,
            "topic": "Azure Network Watcher Connection Troubleshoot for Multi-Hop Latency",
            "scenario": "A Linux virtual machine `vm-api` in `vnet-apps` experiences intermittent latency and connection drops when communicating with an on-premises database server over an ExpressRoute circuit. You need to inspect the hop-by-hop network path, identify intermediate router latencies, and confirm whether any NSG or route rule is dropping packets along the path.\n\nWhich Azure Network Watcher tool should you use?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Packet Capture."},
                {"id": "B", "text": "Security Group View."},
                {"id": "C", "text": "VPN Troubleshoot."},
                {"id": "D", "text": "Connection Troubleshoot."}
            ],
            "correctAnswer": "D",
            "explanation": {
                "verdict": "Option D is correct.",
                "triggerConstraints": "Requirement: Trace hop-by-hop latency and identify any NSG or routing blocks between an Azure VM and a remote database.",
                "flawedMentalModel": "Using Packet Capture or Next Hop when multi-hop hop-by-hop analysis is needed.",
                "coreMechanic": "Network Watcher `Connection Troubleshoot` evaluates end-to-end TCP or ICMP connectivity from a source VM to a target destination (VM, FQDN, or IPv4 address). It provides hop-by-hop network path visualization, identifies minimum/average/maximum latency for each hop, and pinpoints whether packet drops occur due to NSGs, UDRs, or intermediate appliances.",
                "distractors": {
                    "A": "Packet Capture captures raw PCAP files for packet analysis; it does not generate automated hop-by-hop latency topologies.",
                    "B": "Security Group View only displays NSGs applied to a single VM's NIC, lacking multi-hop path awareness.",
                    "C": "VPN Troubleshoot tests site-to-site VPN gateway health, not ExpressRoute end-to-end VM TCP connections."
                },
                "heuristic": "End-to-end hop-by-hop path, latency, and routing diagnostics = Network Watcher Connection Troubleshoot.",
                "msLearnUrl": "https://learn.microsoft.com/azure/network-watcher/network-watcher-connectivity-overview"
            }
        },
        {
            "id": "e3-q65",
            "examNumber": 3,
            "domain": "Domain 5: Monitor and maintain Azure resources",
            "domainCode": 5,
            "topic": "Log Analytics Workspace Interactive Retention vs Data Export Archival",
            "scenario": "Corporate compliance requires that security audit logs in Log Analytics workspace `law-corp-audit` must remain queryable via interactive KQL queries for 90 days. For long-term legal compliance, all raw logs must be retained for 7 years in an immutable, cost-effective storage tier.\n\nYou want to avoid paying high interactive Log Analytics workspace retention rates for 7 years of data.\n\nWhich architecture should you deploy?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Set the Log Analytics workspace retention period slider to 2,555 days (7 years)."},
                {"id": "B", "text": "Export logs manually each month using PowerShell into an on-premises NAS device."},
                {"id": "C", "text": "Configure Log Analytics interactive retention to 90 days, and configure Log Analytics Data Export to stream selected tables continuously to an Azure Storage account configured with immutable blob storage."},
                {"id": "D", "text": "Deploy a second Log Analytics workspace and replicate logs between them daily."}
            ],
            "correctAnswer": "C",
            "explanation": {
                "verdict": "Option C is correct.",
                "triggerConstraints": "Requirement: Retain logs for 90 days interactive KQL search and 7 years long-term low-cost compliance storage.",
                "flawedMentalModel": "Leaving logs in interactive Log Analytics retention for 7 years, which incurs very high storage costs.",
                "coreMechanic": "The standard Microsoft Azure Monitor pattern for dual-retention requirements is: (1) Retain data in Log Analytics for 30–90 days for fast, interactive KQL searching and incident response, and (2) Configure Log Analytics Data Export (or continuous export) to stream selected log tables into Azure Blob Storage (Cool or Archive tier with immutability) for long-term low-cost compliance.",
                "distractors": {
                    "A": "Setting interactive retention to 7 years in Log Analytics is prohibitively expensive compared to blob storage.",
                    "B": "Manual PowerShell exports are unreliable, unautomated, and fail compliance automation audits.",
                    "D": "Replicating between workspaces doubles costs without solving the long-term archival problem."
                },
                "heuristic": "Cost-effective log retention: 30–90 days in Log Analytics + Log Analytics Data Export to Storage Account for multi-year archive.",
                "msLearnUrl": "https://learn.microsoft.com/azure/azure-monitor/logs/logs-data-export"
            }
        }
    ]
