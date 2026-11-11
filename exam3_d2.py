#!/usr/bin/env python3
"""
Generator for exam_questions_exam3.js (Domain 2: Questions e3-q16 to e3-q27)
"""

def get_domain2_questions():
    return [
        {
            "id": "e3-q16",
            "examNumber": 3,
            "domain": "Domain 2: Implement and manage storage",
            "domainCode": 2,
            "topic": "Storage Account Redundancy and Customer-Initiated Account Failover",
            "scenario": "Your organization operates a critical storage account named `saprodeurope` configured with Geo-Redundant Storage (GRS) pairing North Europe (primary) and West Europe (secondary). A major regional power outage causes an extended outage in North Europe.\n\nYou initiate a customer-managed account failover to West Europe using the Azure CLI (`az storage account failover`).\n\nOnce the failover completes successfully, what is the redundancy tier of `saprodeurope`?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Geo-Redundant Storage (GRS) with West Europe as the new primary and North Europe as the secondary."},
                {"id": "B", "text": "Locally Redundant Storage (LRS) located in West Europe."},
                {"id": "C", "text": "Zone-Redundant Storage (ZRS) across three availability zones in West Europe."},
                {"id": "D", "text": "Read-Access Geo-Redundant Storage (RA-GRS) with write operations blocked indefinitely."}
            ],
            "correctAnswer": "B",
            "explanation": {
                "verdict": "Option B is correct.",
                "triggerConstraints": "Requirement: Determine resulting storage redundancy tier following customer-initiated failover of a GRS account.",
                "flawedMentalModel": "Assuming account failover automatically inverts the geo-pair and maintains GRS replication back to the old primary.",
                "coreMechanic": "When a customer initiates an account failover on a GRS or GZRS account, the DNS records are updated to point to the secondary region as the new primary. After failover, the account is automatically converted to Locally Redundant Storage (LRS). There is no replication back to the failed region. The administrator must manually re-enable GRS/GZRS later if desired.",
                "distractors": {
                    "A": "Failover does not automatically establish reverse geo-replication; it drops to LRS.",
                    "C": "Failover does not convert standard GRS to ZRS; the account becomes LRS in the failover region.",
                    "D": "The failover region becomes fully read/write; it is not locked into RA-GRS read-only mode."
                },
                "heuristic": "Customer-managed failover of GRS/GZRS storage ALWAYS converts the storage account to LRS in the secondary region.",
                "msLearnUrl": "https://learn.microsoft.com/azure/storage/common/customer-managed-account-failover"
            }
        },
        {
            "id": "e3-q17",
            "examNumber": 3,
            "domain": "Domain 2: Implement and manage storage",
            "domainCode": 2,
            "topic": "Blob Lifecycle Management Rules with Index Tag and Prefix Filters",
            "scenario": "You have an Azure Blob container named `finance-docs` containing 2 million blobs. You need to implement an automated lifecycle management rule that meets the following criteria:\n1. Moves block blobs to the Cool tier 30 days after creation.\n2. Moves block blobs to the Archive tier 180 days after creation.\n3. Applies ONLY to blobs inside the virtual directory `2024/invoices/` that possess the Blob Index tag `Department = Billing`.\n\nHow should you configure the rule filters in the lifecycle management policy?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Configure `prefixMatch: [\"2024/invoices/\"]` and `blobTypes: [\"appendBlob\"]` with an Azure Event Grid subscription."},
                {"id": "B", "text": "Configure an Azure Logic App that queries the storage logs and runs daily AzCopy tiering scripts."},
                {"id": "C", "text": "Under Rule Filters, specify `blobTypes: [\"blockBlob\"]`, `prefixMatch: [\"finance-docs/2024/invoices/\"]`, and `blobIndexMatch: [{\"name\": \"Department\", \"op\": \"==\", \"value\": \"Billing\"}]`."},
                {"id": "D", "text": "Set the default account access tier to Cool and apply an Azure Policy requiring all blobs to be tagged."}
            ],
            "correctAnswer": "C",
            "explanation": {
                "verdict": "Option C is correct.",
                "triggerConstraints": "Requirement: Configure a lifecycle management policy rule targeting a specific container/prefix path and filtered by Blob Index tags.",
                "flawedMentalModel": "Forgetting that `prefixMatch` in lifecycle rules must include the container name, or trying to tier unsupported blob types.",
                "coreMechanic": "Azure Blob Lifecycle Management supports prefix filtering (`prefixMatch`) and blob index tags (`blobIndexMatch`). In prefixMatch, the path must include the container name (`container/prefix`). The rule actions `tierToCool` and `tierToArchive` apply to `blockBlob` types matching both the prefix and index tag conditions.",
                "distractors": {
                    "A": "Append blobs do not support tiering to Archive, and Event Grid is not a native lifecycle filter.",
                    "B": "Logic Apps and AzCopy introduce custom code and maintenance overhead when native lifecycle policies fully support this.",
                    "D": "Default access tier does not archive blobs after 180 days or filter by index tags."
                },
                "heuristic": "Lifecycle prefix filters require container name: 'container/prefix/'. Tag matching uses blobIndexMatch with '=='.",
                "msLearnUrl": "https://learn.microsoft.com/azure/storage/blobs/lifecycle-management-overview"
            }
        },
        {
            "id": "e3-q18",
            "examNumber": 3,
            "domain": "Domain 2: Implement and manage storage",
            "domainCode": 2,
            "topic": "Blob Versioning vs Blob Soft Delete Interaction Mechanics",
            "scenario": "You enable both Blob Versioning and Blob Soft Delete (retention period: 14 days) on storage account `stgcontracts2026`. A user uses the Azure Portal to delete an existing document `vendor_nda.docx` in container `legal`.\n\nWhat is the exact outcome of this deletion operation?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "The blob is permanently purged immediately because soft delete is disabled when versioning is active."},
                {"id": "B", "text": "The blob is placed in a soft-deleted state for 14 days, and all previous versions are deleted."},
                {"id": "C", "text": "The deletion fails with HTTP 409 Conflict until the user manually deletes all historical versions first."},
                {"id": "D", "text": "The current version becomes a previous version with its original timestamp preserved, and a zero-byte delete marker becomes the new current version; no data is soft-deleted."}
            ],
            "correctAnswer": "D",
            "explanation": {
                "verdict": "Option D is correct.",
                "triggerConstraints": "Requirement: Understand the precise mechanic when deleting a blob while both versioning and soft delete are active.",
                "flawedMentalModel": "Assuming standard blob deletion triggers soft delete when versioning is active.",
                "coreMechanic": "When Blob Versioning is enabled, deleting a blob does not delete the blob or move it to a soft-deleted state. Instead, Azure creates a 'delete marker' (a zero-byte marker with no content) as the current version, while the previous version is preserved in the version history. Soft delete only comes into play if an administrator explicitly deletes a SPECIFIC version from the version history.",
                "distractors": {
                    "A": "Blob versioning preserves previous versions indefinitely unless deleted explicitly.",
                    "B": "Deleting the blob does not delete previous versions or place them in soft-delete.",
                    "C": "Azure does not block deleting blobs that have historical versions."
                },
                "heuristic": "Deleting a blob with versioning enabled creates a Delete Marker as current version; past versions remain safe.",
                "msLearnUrl": "https://learn.microsoft.com/azure/storage/blobs/versioning-overview#deleting-a-blob"
            }
        },
        {
            "id": "e3-q19",
            "examNumber": 3,
            "domain": "Domain 2: Implement and manage storage",
            "domainCode": 2,
            "topic": "Azure Files Identity-Based Access: Share RBAC vs NTFS Permissions",
            "scenario": "You deploy an Azure File share named `shared-marketing` for enterprise users. You configure Microsoft Entra Kerberos for identity-based access. User `bob@contoso.com` can successfully mount the share on his Windows 11 workstation. However, when Bob attempts to create a new subfolder inside the share, Windows displays an 'Access is Denied' error.\n\nBob is already assigned the `Storage File Data SMB Share Contributor` Azure RBAC role on the storage account.\n\nWhat is the cause of the issue?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "The Windows NTFS discretionary access control lists (DACLs) on the root directory of the file share do not grant Bob's identity Modify/Write permissions."},
                {"id": "B", "text": "Bob must be assigned the Storage Account Contributor RBAC role instead."},
                {"id": "C", "text": "Microsoft Entra Kerberos authentication only supports read-only file shares."},
                {"id": "D", "text": "The storage account firewall is blocking SMB port 445."}
            ],
            "correctAnswer": "A",
            "explanation": {
                "verdict": "Option A is correct.",
                "triggerConstraints": "Requirement: Diagnose access denied when modifying files in Azure Files despite having Share Contributor RBAC role.",
                "flawedMentalModel": "Believing Azure RBAC share-level roles control internal file and folder authorization.",
                "coreMechanic": "Azure Files identity-based access uses a dual-layer permission architecture: (1) Azure RBAC share permissions (e.g. Storage File Data SMB Share Contributor) authorize mounting and initial share-level access, and (2) Windows NTFS ACLs configured inside the share control granular directory and file-level permissions (Read, Modify, Full Control). Both layers must grant access.",
                "distractors": {
                    "B": "Storage Account Contributor is a management plane role and does not grant SMB data access.",
                    "C": "Entra Kerberos fully supports read and write access over SMB.",
                    "D": "If port 445 were blocked by firewall, Bob would not have been able to mount the share in the first place."
                },
                "heuristic": "Azure Files Access = Share-level Azure RBAC role + Directory-level NTFS ACL permissions.",
                "msLearnUrl": "https://learn.microsoft.com/azure/storage/files/storage-files-identity-auth-hybrid-identities-enable"
            }
        },
        {
            "id": "e3-q20",
            "examNumber": 3,
            "domain": "Domain 2: Implement and manage storage",
            "domainCode": 2,
            "topic": "Revoking Active Ad-Hoc Shared Access Signatures (SAS)",
            "scenario": "A development team inadvertently commits an ad-hoc Service Shared Access Signature (SAS) URL for container `product-images` into a public GitHub repository. The SAS token was generated with Read and Write permissions and an expiration date set to 6 months in the future, without an associated Stored Access Policy.\n\nYou must immediately prevent any unauthorized parties from using this leaked SAS token to read or write data.\n\nWhat action should you take?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Change the public access level of container `product-images` from Blob to Private in the portal."},
                {"id": "B", "text": "Regenerate the storage account access key (Key 1 or Key 2) that was used to sign the ad-hoc Service SAS token."},
                {"id": "C", "text": "Delete the container and restore it using Blob Soft Delete."},
                {"id": "D", "text": "Modify the stored access policy in Azure Storage Explorer to set the expiration date to yesterday."}
            ],
            "correctAnswer": "B",
            "explanation": {
                "verdict": "Option B is correct.",
                "triggerConstraints": "Requirement: Immediately revoke an active ad-hoc Service SAS that was created without a stored access policy.",
                "flawedMentalModel": "Assuming ad-hoc SAS tokens can be revoked individually without rotating storage account keys.",
                "coreMechanic": "An ad-hoc SAS is cryptographically signed using the storage account's master access key. Because there is no stored access policy binding it, Azure Storage has no mechanism to revoke the ad-hoc SAS token individually. The ONLY way to revoke an ad-hoc SAS is to regenerate the account key (Key 1 or Key 2) used to sign it! (Stored access policies, by contrast, allow instant revocation by editing or deleting the policy).",
                "distractors": {
                    "A": "Container public access level only controls anonymous unauthenticated HTTP requests; it has no effect on SAS token authorization.",
                    "C": "Deleting the container causes severe application downtime and does not invalidate the SAS key signature.",
                    "D": "The scenario explicitly states no stored access policy was used; you cannot modify a non-existent policy."
                },
                "heuristic": "To revoke an ad-hoc SAS (no stored access policy), you MUST rotate the storage account key that signed it.",
                "msLearnUrl": "https://learn.microsoft.com/azure/storage/common/storage-sas-overview#revoke-a-sas"
            }
        },
        {
            "id": "e3-q21",
            "examNumber": 3,
            "domain": "Domain 2: Implement and manage storage",
            "domainCode": 2,
            "topic": "Storage Firewalls and Virtual Network Service Endpoint Prerequisites",
            "scenario": "You have an Azure virtual machine `vm-worker` in subnet `10.40.1.0/24` of `vnet-workloads`. You configure the firewall on storage account `stgbackend2026` to 'Enabled from selected virtual networks and IP addresses'. You add `10.40.1.0/24` as an allowed virtual network rule in the firewall blade.\n\nWhen `vm-worker` attempts to write blobs to `stgbackend2026`, the connection fails with an HTTP 403 Forbidden error.\n\nWhat is the reason for this failure?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Storage account firewall rules only support public IP ranges, not private RFC 1918 subnets."},
                {"id": "B", "text": "The VM is missing a system-assigned managed identity with Reader permissions on the storage account."},
                {"id": "C", "text": "The Service Endpoint `Microsoft.Storage` is not enabled on subnet `10.40.1.0/24`, causing VM traffic to leave with a public IP that does not match the subnet rule."},
                {"id": "D", "text": "The storage account default access tier must be set to Hot."}
            ],
            "correctAnswer": "C",
            "explanation": {
                "verdict": "Option C is correct.",
                "triggerConstraints": "Requirement: Identify why a VM in an allowed subnet cannot access a storage account secured by virtual network firewall rules.",
                "flawedMentalModel": "Assuming adding a subnet to the storage firewall automatically enables service endpoints on that subnet.",
                "coreMechanic": "For an Azure subnet rule in a storage firewall to recognize incoming traffic, the `Microsoft.Storage` Service Endpoint MUST be enabled on the subnet. Without the service endpoint, traffic from the VM routes across the default Azure internet path using the host's public IP address, which is not in the allowed virtual network list, triggering an HTTP 403 Forbidden.",
                "distractors": {
                    "A": "Storage firewalls natively support Azure Virtual Network subnets via Service Endpoints.",
                    "B": "Managed identity governs RBAC authentication, not firewall network boundary traversal.",
                    "D": "Default access tier has no effect on network firewall admission."
                },
                "heuristic": "Securing Storage Accounts with Subnet Rules REQUIRES enabling the Microsoft.Storage Service Endpoint on that subnet.",
                "msLearnUrl": "https://learn.microsoft.com/azure/storage/common/storage-network-security#grant-access-from-a-virtual-network"
            }
        },
        {
            "id": "e3-q22",
            "examNumber": 3,
            "domain": "Domain 2: Implement and manage storage",
            "domainCode": 2,
            "topic": "Private Endpoints for Storage and DNS Private Zone Links",
            "scenario": "You deploy a Private Endpoint named `pe-blob-prod` for the `blob` sub-resource of storage account `stgprodapps` into subnet `snet-endpoints` (`10.10.2.0/24`). The private endpoint is assigned private IP `10.10.2.15` and integrated with Private DNS Zone `privatelink.blob.core.windows.net`.\n\nA VM in a peered virtual network `vnet-spoke-01` queries `stgprodapps.blob.core.windows.net` and receives the public IP address `20.150.42.10` instead of the private IP `10.10.2.15`.\n\nWhat must you do to ensure the VM resolves the storage account to its private IP?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Update the hosts file on the VM to map stgprodapps.blob.core.windows.net to 10.10.2.15."},
                {"id": "B", "text": "Change the Private Endpoint target sub-resource from `blob` to `file`."},
                {"id": "C", "text": "Configure a User-Defined Route in `vnet-spoke-01` with next hop Internet."},
                {"id": "D", "text": "Create a Virtual Network Link from the Private DNS Zone `privatelink.blob.core.windows.net` to `vnet-spoke-01`."}
            ],
            "correctAnswer": "D",
            "explanation": {
                "verdict": "Option D is correct.",
                "triggerConstraints": "Requirement: Enable VMs in a peered VNet to resolve a private endpoint FQDN to its private IP address.",
                "flawedMentalModel": "Assuming VNet peering automatically propagates DNS zone resolution across VNets.",
                "coreMechanic": "Azure Private DNS Zones only resolve for Virtual Networks that have an explicit Virtual Network Link to the zone. Even if VNets are peered, `vnet-spoke-01` will continue querying public Azure DNS unless it is explicitly linked to `privatelink.blob.core.windows.net`.",
                "distractors": {
                    "A": "Editing the hosts file is an unmaintainable anti-pattern that violates enterprise cloud architecture.",
                    "B": "The sub-resource must match the service being consumed (`blob` for Blob storage).",
                    "C": "UDRs govern packet routing, not DNS name resolution."
                },
                "heuristic": "Private Endpoint DNS resolution across multiple VNets requires a Virtual Network Link to EACH VNet.",
                "msLearnUrl": "https://learn.microsoft.com/azure/private-link/private-endpoint-dns"
            }
        },
        {
            "id": "e3-q23",
            "examNumber": 3,
            "domain": "Domain 2: Implement and manage storage",
            "domainCode": 2,
            "topic": "AzCopy Sync Command Syntax and Deleting Orphaned Destination Files",
            "scenario": "You maintain a local on-premises directory `C:\\Backups\\Daily` that you synchronize to Azure Blob container `daily-backups`. The destination container contains obsolete files that have already been deleted from the local source directory.\n\nYou need to run an `azcopy` command that uploads new and modified files AND deletes any files in the destination container that no longer exist in the local source directory.\n\nWhich command should you execute?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": 'azcopy sync "C:\\Backups\\Daily" "https://sa.blob.core.windows.net/daily-backups?<SAS>" --delete-destination=true --recursive=true'},
                {"id": "B", "text": 'azcopy copy "C:\\Backups\\Daily" "https://sa.blob.core.windows.net/daily-backups?<SAS>" --overwrite=true --purge=true'},
                {"id": "C", "text": 'azcopy sync "C:\\Backups\\Daily" "https://sa.blob.core.windows.net/daily-backups?<SAS>" --mirror=true'},
                {"id": "D", "text": 'azcopy jobs clean "https://sa.blob.core.windows.net/daily-backups?<SAS>" --include-destination'}
            ],
            "correctAnswer": "A",
            "explanation": {
                "verdict": "Option A is correct.",
                "triggerConstraints": "Requirement: Synchronize local files to Azure Blob and remove destination files missing from the source.",
                "flawedMentalModel": "Confusing `azcopy copy` with `azcopy sync` or inventing non-existent flags like `--purge` or `--mirror`.",
                "coreMechanic": "`azcopy sync` compares source and destination files based on file names and last-modified timestamps. To remove destination files that are not present in the source, the flag `--delete-destination=true` (or `prompt`) must be explicitly passed. `azcopy copy` cannot delete destination files.",
                "distractors": {
                    "B": "The `azcopy copy` command does not support deleting destination files; only `azcopy sync` supports `--delete-destination`.",
                    "C": "`--mirror` is a robocopy parameter, not a valid azcopy CLI flag.",
                    "D": "`azcopy jobs clean` cleans local job log files, not remote storage blobs."
                },
                "heuristic": "AzCopy mirroring with destination cleanup = azcopy sync --delete-destination=true.",
                "msLearnUrl": "https://learn.microsoft.com/azure/storage/common/storage-ref-azcopy-sync"
            }
        },
        {
            "id": "e3-q24",
            "examNumber": 3,
            "domain": "Domain 2: Implement and manage storage",
            "domainCode": 2,
            "topic": "Storage Account Object Replication Prerequisites",
            "scenario": "You want to configure asynchronous Object Replication between container `data-eus` in source storage account `saeastus` (East US) and container `data-wus` in destination storage account `sawestus` (West US).\n\nWhen attempting to create the replication rule, the Azure Portal displays a prerequisites warning.\n\nWhich two features MUST be enabled on the source storage account for object replication to function?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Blob soft delete and Azure Files identity authentication."},
                {"id": "B", "text": "Blob versioning and Blob change feed."},
                {"id": "C", "text": "Customer-managed encryption keys (SSE-CMK) and Storage Static Website."},
                {"id": "D", "text": "Hierarchical namespace (ADLS Gen2) and Immutable storage."}
            ],
            "correctAnswer": "B",
            "explanation": {
                "verdict": "Option B is correct.",
                "triggerConstraints": "Requirement: Identify mandatory prerequisites on the source storage account for Azure Blob Object Replication.",
                "flawedMentalModel": "Assuming soft delete or hierarchical namespace is required for object replication.",
                "coreMechanic": "Azure Blob Object Replication asynchronously replicates block blobs between storage accounts. It requires: (1) Blob versioning enabled on BOTH the source and destination storage accounts, and (2) Blob change feed enabled on the SOURCE storage account (so changes can be tracked and replayed).",
                "distractors": {
                    "A": "Soft delete is not a prerequisite for object replication and is actually disabled for replicated blobs.",
                    "C": "Customer-managed keys and static website hosting are unrelated to object replication.",
                    "D": "Object replication is not supported on accounts with hierarchical namespace (ADLS Gen2) enabled."
                },
                "heuristic": "Object Replication Prerequisites: Blob Versioning on both accounts + Blob Change Feed on source account.",
                "msLearnUrl": "https://learn.microsoft.com/azure/storage/blobs/object-replication-overview"
            }
        },
        {
            "id": "e3-q25",
            "examNumber": 3,
            "domain": "Domain 2: Implement and manage storage",
            "domainCode": 2,
            "topic": "Storage Access Tiers and Minimum Retention Durations",
            "scenario": "On March 1, you upload 10 TB of historical video archives directly into the `Archive` tier of storage account `stgmedia2026`. On March 21 (after 20 days), business requirements change, and you delete the entire 10 TB dataset.\n\nHow does Microsoft Azure calculate billing for this deleted data?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "You are billed only for the 20 days of actual storage consumed."},
                {"id": "B", "text": "You are billed a flat deletion penalty equal to 365 days of Hot tier pricing."},
                {"id": "C", "text": "You are billed for the 20 days of actual storage plus an early deletion charge for the remaining 160 days of the 180-day minimum retention period at Archive tier rates."},
                {"id": "D", "text": "The deletion request is rejected with HTTP 409 Conflict until 180 days have passed."}
            ],
            "correctAnswer": "C",
            "explanation": {
                "verdict": "Option C is correct.",
                "triggerConstraints": "Requirement: Calculate storage charges when deleting blobs from the Archive tier prior to minimum retention expiration.",
                "flawedMentalModel": "Assuming Azure allows deleting archived blobs at any time without financial penalties.",
                "coreMechanic": "Azure storage tiers impose minimum retention periods: Cool tier = 30 days, Cold tier = 90 days, Archive tier = 180 days. If a blob is deleted, overwritten, or rehydrated before the minimum retention duration has elapsed, Azure bills for the actual days stored plus an early deletion fee for the remaining unfulfilled days.",
                "distractors": {
                    "A": "Fails to include the mandatory early deletion penalty required for Archive tier.",
                    "B": "Penalties are calculated based on the unfulfilled portion of the 180-day tier period, not 365 days of Hot tier.",
                    "D": "Azure never prevents deleting blobs due to minimum retention; it simply bills the early deletion fee."
                },
                "heuristic": "Minimum retention periods: Cool = 30 days, Cold = 90 days, Archive = 180 days. Early deletion charges apply to remaining days.",
                "msLearnUrl": "https://learn.microsoft.com/azure/storage/blobs/access-tiers-overview#pricing-and-billing"
            }
        },
        {
            "id": "e3-q26",
            "examNumber": 3,
            "domain": "Domain 2: Implement and manage storage",
            "domainCode": 2,
            "topic": "Immutable Blob Storage: Time-Based Retention vs Legal Hold",
            "scenario": "A healthcare provider must store patient diagnostic records in Azure Blob container `clinical-records` to comply with federal regulations. The regulatory policy dictates that:\n1. Blobs cannot be modified or deleted by anyone (including Subscription Owners and Microsoft support) for 7 years.\n2. Once tested and validated, the policy must be permanent and impossible to shorten or remove.\n\nWhich immutable storage configuration must you implement?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Apply a ReadOnly Azure Resource Lock to the storage account."},
                {"id": "B", "text": "Apply an Azure Storage Legal Hold to the container."},
                {"id": "C", "text": "Create an Azure Policy with the `deny` effect on Microsoft.Storage delete actions."},
                {"id": "D", "text": "Configure a Time-Based Retention Policy with a retention interval of 2,555 days (7 years), verify it in an unlocked state, and then explicitly Lock the policy."}
            ],
            "correctAnswer": "D",
            "explanation": {
                "verdict": "Option D is correct.",
                "triggerConstraints": "Requirement: Enforce a tamper-proof 7-year immutable retention policy that cannot be shortened or cleared even by subscription owners.",
                "flawedMentalModel": "Using Legal Holds for time-based retention or relying on ARM Resource Locks which can be removed by Owners.",
                "coreMechanic": "Azure Immutable Storage supports two policies: Legal Hold and Time-Based Retention. A Legal Hold has no expiration timer and can be cleared by any user with appropriate permissions. A Time-Based Retention policy in a LOCKED state is legally binding under SEC Rule 17a-4: the retention period can only be extended, never reduced, and the policy cannot be deleted even by Subscription Owners or Global Admins.",
                "distractors": {
                    "A": "Resource locks can be deleted at any time by Subscription Owners or User Access Administrators.",
                    "B": "Legal holds do not enforce fixed time intervals and can be removed by users with legal hold write permissions.",
                    "C": "Azure Policy applies to ARM control plane and can be overridden or unassigned by subscription administrators."
                },
                "heuristic": "Permanent, SEC-compliant immutability = LOCKED Time-Based Retention Policy.",
                "msLearnUrl": "https://learn.microsoft.com/azure/storage/blobs/immutable-storage-overview"
            }
        },
        {
            "id": "e3-q27",
            "examNumber": 3,
            "domain": "Domain 2: Implement and manage storage",
            "domainCode": 2,
            "topic": "General Purpose v2 Default Access Tier Selection",
            "scenario": "You are creating a new General-purpose v2 storage account named `stglogs2026` using the Azure CLI (`az storage account create`). The account will store server access logs that are queried occasionally during monthly audits. You want any new blob uploaded without an explicit access tier parameter to default to the lower-cost storage tier.\n\nWhich CLI parameter should you specify during account provisioning?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "`--access-tier Cool`"},
                {"id": "B", "text": "`--tier Archive`"},
                {"id": "C", "text": "`--sku Standard_LRS --kind BlobStorage`"},
                {"id": "D", "text": "`--default-tier Cold`"}
            ],
            "correctAnswer": "A",
            "explanation": {
                "verdict": "Option A is correct.",
                "triggerConstraints": "Requirement: Specify the default access tier for a General Purpose v2 storage account using Azure CLI.",
                "flawedMentalModel": "Attempting to set Archive as the account default tier.",
                "coreMechanic": "When creating a GPv2 storage account, the default access tier (`--access-tier`) for block blobs can only be set to `Hot` or `Cool`. Archive tier cannot be configured as the default tier for an entire storage account; individual blobs must be moved to Archive explicitly or via lifecycle policies.",
                "distractors": {
                    "B": "Archive cannot be set as the default access tier for a storage account.",
                    "C": "The `--kind BlobStorage` is legacy; GPv2 (`StorageV2`) is the standard.",
                    "D": "`--default-tier` is an invalid CLI parameter syntax for `az storage account create`."
                },
                "heuristic": "Storage account default access tier can ONLY be Hot or Cool (never Archive). Parameter is --access-tier.",
                "msLearnUrl": "https://learn.microsoft.com/azure/storage/blobs/access-tiers-overview"
            }
        }
    ]
