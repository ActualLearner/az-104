# Microsoft Entra ID Architecture — Part 2: Advanced Identity, Devices, Governance & Hybrid Provisioning

> **Target Exam:** Microsoft Certified: Azure Administrator Associate (AZ-104)  
> **Status:** Current Architecture (2026 Standard)  
> **Prerequisite:** [entra-id-part1-core-architecture.md](entra-id-part1-core-architecture.md)

---

## 1. Deep Dive: Devices in Microsoft Entra ID

### 1.1 Device as an Independent Security Principal
In legacy environments, identity was synonymous with the human user. In modern Microsoft Entra ID and Zero Trust architecture, a **device is an independent security principal**:
- Every managed or registered device receives its own distinct **Object ID** in Microsoft Entra ID.
- Devices have their own security attributes, compliance flags, certificate pairs, and directory status.
- **Zero Trust Authentication Principle:** Authentication and authorization decisions evaluate **User Identity + Device Identity + Real-time Health/Compliance Context** simultaneously. Even if a user enters valid credentials and completes MFA, access will be blocked if the device object fails Conditional Access compliance checks (e.g., outdated OS, unencrypted disk, missing corporate compliance flag).

```
       [ Human User: alice@contoso.com ]      +      [ Device Object ID: dev-8f4b-229a ]
                     \                                      /
                      \                                    /
                       ▼                                  ▼
               [ Conditional Access Engine (Signals & Context) ]
                                      │
                     Evaluates: User Risk + Device Compliance + Location
                                      │
                                      ▼
                      [ Grant Access with PRT / Deny ]
```

---

### 1.2 The Three Device Join Types (Architectural Comparison)

Microsoft Entra ID supports three distinct device states. Understanding the technical boundaries between them is one of the most heavily tested areas on the AZ-104 exam.

| Dimension | Microsoft Entra Registered (BYOD) | Microsoft Entra Joined (Cloud-Native) | Microsoft Entra Hybrid Joined (Dual-State) |
| :--- | :--- | :--- | :--- |
| **Ownership Model** | Personal device / BYOD (Windows, macOS, iOS, Android, Linux) | Corporate-owned modern asset | Corporate-owned legacy or transition asset |
| **Directory Authority** | Local OS database / Personal Microsoft Account / Apple ID / Google | **Microsoft Entra ID ONLY** (Pure Cloud) | **Dual Authority:** On-Premises Active Directory DS **AND** Microsoft Entra ID |
| **Windows Lock Screen Sign-in** | Personal/Local OS Account (e.g., local admin, personal MS account). Work account is added later under "Access work or school". | **Entra ID UPN directly** (e.g., `user@contoso.com`). No local domain controllers required. | **On-Premises AD Domain Credentials** (or cached domain credentials). |
| **On-Prem AD Domain Membership** | **No** | **No** (Never joins on-prem AD DS domain) | **Yes** (Joined to traditional on-prem AD domain) |
| **Device Management** | **MAM (Mobile Application Management)** via Intune. Lightweight app protection policies. | **Full MDM (Mobile Device Management)** via Microsoft Intune or modern MDM. | **Co-Management:** On-prem Group Policy (GPO) / Microsoft Configuration Manager (SCCM) + Intune MDM. |
| **Administrative Control & Remote Wipe** | **Selective App Wipe Only**. IT cannot wipe personal photos, OS, or personal files. | **Full Remote OS Wipe** & Device Factory Reset capability. IT has complete hardware/OS ownership. | **Full OS Wipe** via SCCM/Intune or on-prem administrative control. |
| **Local Admin Rights** | User remains local admin of their own personal machine. | Controlled via Entra ID: Global Admins, Device Admins, or Intune Local Admin Service. | Managed via on-premises Active Directory GPO (Restricted Groups). |
| **BitLocker Key Storage** | User's personal OneDrive or local backup (not corporate tenant by default). | Automatically backed up into **Microsoft Entra ID device object**. | Backed up to **On-Prem AD DS** (via GPO) and synced/escrowed to **Entra ID**. |
| **Primary SSO Artifact** | PRT issued scoped only to registered work applications. | Full Enterprise **Primary Refresh Token (PRT)** stored in TPM. | Full Enterprise **Primary Refresh Token (PRT)** + On-Prem **Kerberos TGT**. |

---

### 1.3 Deep Breakdown: Registered vs. Joined vs. Hybrid Joined

#### A. Microsoft Entra Registered (BYOD)
- **What it is:** Designed for contractor machines, mobile phones (iOS/Android), and employee personal laptops.
- **The Registration Process:** The user logs in with their personal account, opens an application (like Word or Teams) or goes to *Windows Settings $\rightarrow$ Accounts $\rightarrow$ Access work or school $\rightarrow$ Connect*.
- **The Separation of Church and State:** Registering a personal device does **not** hand over full control of the machine to company IT. It installs a workplace management profile. IT can enforce PIN length on the Outlook app, wipe corporate emails if the device is lost, or prevent copying text from Teams to personal WhatsApp. IT cannot see personal browsing history or wipe personal photos.

#### B. Microsoft Entra Joined (Cloud-Native Enterprise)
- **What it is:** The gold standard for modern, cloud-first, zero-on-prem enterprises. Laptops ship directly from the manufacturer to the user's home via **Windows Autopilot**.
- **How it Works:** The machine is taken out of the box, turned on, connects to Wi-Fi, and at the Windows Out-of-Box Experience (OOBE) lock screen, the user types `user@contoso.com` and password.
- **No Domain Controllers:** The device never communicates with a traditional Windows Server Active Directory domain controller. It has no LDAP, no Kerberos TGT from on-prem, and no on-premises Group Policy Objects (GPOs). Everything is governed by Microsoft Intune configuration profiles and Entra ID Conditional Access.
- **Can it access on-prem resources?** **YES!** If an Entra Joined device is brought into the corporate office or connects via VPN, Entra ID passes Kerberos hints. If Microsoft Entra Connect is syncing users, the device can obtain Kerberos tickets from local domain controllers to access legacy file shares without being domain-joined.

#### C. Microsoft Entra Hybrid Joined (The Enterprise Bridge)
- **What it is:** Existing enterprise machines that are already domain-joined to on-premises Windows Server Active Directory (`corp.contoso.com`), but need cloud features (Conditional Access, Intune compliance, cloud SSO).
- **The Crucial Clarification:** A Hybrid Joined device is **NOT** merely an on-prem computer. It is a **dual-registered entity**. It exists as a Computer object in on-prem Active Directory DS **AND** as a synchronized Device object in Microsoft Entra ID.
- **How Registration Happens:**
  1. The computer joins the local on-premises AD domain via standard domain join.
  2. A Group Policy Object (GPO) or Entra Connect setup configures the **Service Connection Point (SCP)** in on-prem AD (in the Configuration partition: `CN=62a0ff2e-7c21-42c6-829d-4288b5638c38,CN=Device Registration Configuration,CN=Services`).
  3. The local computer reads the SCP to discover the Entra ID tenant information.
  4. The computer generates a public/private key pair, writes the public key to its own computer object attribute in on-prem AD (`userCertificate`).
  5. Microsoft Entra Connect synchronizes that computer object and public key to Microsoft Entra ID.
  6. The machine contacts Entra ID over the internet (port 443) to complete registration and obtain its cloud device certificate and PRT.

---

### 1.4 The Primary Refresh Token (PRT) and Hardware TPM

#### What is the Primary Refresh Token (PRT)?
The **PRT** is the crown jewel of Windows 10/11 and Entra ID authentication. It is an encrypted JSON Web Token (JWT) issued by Microsoft Entra ID to a device after successful user logon.

```
+-----------------------------------------------------------------------------------+
|                        PRIMARY REFRESH TOKEN (PRT)                                |
|-----------------------------------------------------------------------------------|
|  * Header & Device ID: dev-8f4b-229a                                              |
|  * User ID: alice@contoso.com                                                     |
|  * Claims: MFA Satisfied = TRUE, Compliance = PASS                                |
|  * Lifetime: Valid up to 14 days; rolling renewal on active device usage          |
|  * Security Binding: Cryptographically bound to TPM (Transport Key / Context)     |
+-----------------------------------------------------------------------------------+
```

#### Hardware-Bound Security via TPM (Trusted Platform Module)
- On modern devices with a TPM 2.0 chip, the cryptographic keys that sign and unlock the PRT are generated inside the physical hardware TPM chip.
- **The Private Key NEVER leaves the TPM.** Even if malware runs on the machine with local administrator rights, it cannot export the PRT's underlying private key to another computer. An attacker copying tokens to an external laptop cannot impersonate the device.

#### How the PRT Enables Zero-Prompt SSO:
1. When Alice logs into her Windows lock screen in the morning, the Windows Cloud Authentication Provider (`CloudAP`) authenticates her credentials with Entra ID.
2. Entra ID issues the PRT to the Windows Web Account Manager (`WAM`).
3. When Alice opens Microsoft Edge, Teams, Outlook, or Azure Portal, the application does not ask for her username or password.
4. The application requests a token from WAM. WAM uses the PRT to request an Entra ID Access Token silently in the background.
5. Result: Instant, zero-friction Single Sign-On across all corporate web and desktop apps.

---

## 2. Groups Architecture & Group-Based Licensing

### 2.1 Security Groups vs. Microsoft 365 Groups

Understanding the fundamental dichotomy between Security Groups and Microsoft 365 Groups is essential for both administration and the AZ-104 exam.

```
                          ┌─────────────────────────────────────┐
                          │         GROUPS IN ENTRA ID          │
                          └──────────────────┬──────────────────┘
                                             │
                    ┌────────────────────────┴────────────────────────┐
                    ▼                                                 ▼
       ┌────────────────────────┐                        ┌────────────────────────┐
       │     SECURITY GROUP     │                        │  MICROSOFT 365 GROUP   │
       ├────────────────────────┤                        ├────────────────────────┤
       │ * Pure Access & RBAC   │                        │ * Collaboration Hub    │
       │ * Licensing Target     │                        │ * Auto-provisions:     │
       │ * Role-Assignable Opt  │                        │   - Exchange Mailbox   │
       │ * Nesting Supported    │                        │   - SharePoint Site    │
       │ * No Mailbox/Sites     │                        │   - Teams Channel      │
       │                        │                        │   - OneNote / Planner  │
       │                        │                        │ * No Nesting           │
       └────────────────────────┘                        └────────────────────────┘
```

#### Detailed Feature Comparison Matrix

| Architectural Feature | Security Group | Microsoft 365 Group (Formerly Office 365 Group) |
| :--- | :--- | :--- |
| **Primary Purpose** | Access control, RBAC role assignment, software distribution, Conditional Access policy targeting, group-based licensing. | Multi-user team collaboration across Microsoft's productivity SaaS ecosystem. |
| **Associated SaaS Resources** | **None.** A security group has no mailbox, no calendar, no SharePoint site, and no Teams workspace. | **Automatic Bundle:** Every M365 group automatically provisions: <br>1. Shared Exchange Mailbox & Calendar (`group@contoso.com`)<br>2. Dedicated SharePoint Online Team Site Document Library<br>3. Shared OneNote Notebook<br>4. Shared Microsoft Planner board<br>5. Optional connected Microsoft Teams channel. |
| **Group Nesting** | **Supported** (A security group can be placed inside another security group). | **NOT Supported.** Microsoft 365 groups cannot contain other groups; they only accept direct user members. |
| **Licensing Assignment** | **Yes** (Standard practice for Group-Based Licensing). | **Yes** (Can also be targeted for licensing, though Security Groups are preferred for infrastructure). |
| **Role-Assignable Groups** | **Yes** (Can be designated as `isRoleAssignable=true` at creation time to hold Entra ID directory roles). | **No** (Cannot be used for Entra ID role assignments). |
| **Membership Types** | Assigned (Static), Dynamic User, Dynamic Device. | Assigned (Static), Dynamic User. *(Cannot have Dynamic Device membership because devices don't collaborate in email/Teams).* |
| **External/Guest Access** | Can contain B2B Guest users for access control. | Native guest sharing model; guests get access to the group's SharePoint files, Teams chats, and group emails. |

---

### 2.2 Role-Assignable Security Groups (High Security)
By default in Microsoft Entra ID, normal security groups cannot have Entra ID roles (like *User Administrator* or *Helpdesk Administrator*) assigned to them. Why? Because a delegated User Administrator could add themselves to the group and escalate their own privileges to Global Administrator!

To solve this, Entra ID introduced **Role-Assignable Groups**:
- Must be set at creation time: **"Microsoft Entra roles can be assigned to the group" = Yes** (`isRoleAssignable=true`).
- **Permanent Flag:** This setting can **NEVER** be changed after creation.
- **Anti-Tampering Protection:** Only a **Global Administrator** or **Privileged Role Administrator** can modify the membership of this group. A standard User Administrator cannot add members to it.
- **No Dynamic Membership:** Role-assignable groups must have **Assigned (static)** membership. Dynamic rules are forbidden to prevent algorithmic privilege escalation.

---

### 2.3 Group-Based Licensing: Mechanics, Rules & Gotchas

#### How it Works: The Paid Pool Model
1. The organization purchases a commercial subscription from Microsoft (e.g., 500 licenses of *Microsoft 365 E5* or 200 licenses of *Microsoft Entra ID P2*).
2. Group-Based Licensing is purely an **automated allocation and entitlement engine**. It does not create free licenses; it manages consumption from the purchased pool.
3. Instead of an administrator manually clicking on 500 individual users to assign licenses:
   - The administrator links the license package to a Security Group (e.g., `SG-Finance-E5-Licensed`).
   - Specific license components (e.g., disabling Yammer/Viva while keeping Exchange and Intune) can be toggled on or off at the group level.
   - When Alice is added to `SG-Finance-E5-Licensed`, Entra ID automatically provisions the license to Alice within minutes.
   - When Alice leaves the department and is removed from the group, the license is automatically reclaimed and returned to the tenant's unallocated pool.

#### Critical AZ-104 Exam Rules & Traps for Group Licensing:
- **NO NESTED INHERITANCE FOR LICENSES:**
  - If `Group B` is a member of `Group A`, and a license is assigned to `Group A`:
  - Members of `Group A` get the license.
  - **Members of `Group B` do NOT get the license!** Group-based licensing does not traverse nested group hierarchies.
- **License Exhaustion & Error States:**
  - If a group has 50 members and you assign a license that only has 30 seats remaining in the tenant pool:
  - 30 users will receive licenses; the remaining 20 users enter an **"Error state (Count violation)"**.
  - Once new licenses are purchased or freed up, the administrator must click **"Reprocess"** on the group to resolve the error.
- **Direct vs. Inherited Precedence:**
  - If a user has a directly assigned license and is also added to a group with the same license, the license is not duplicated. If the direct license is deleted, the user retains access via group inheritance seamlessly.

---

## 3. Microsoft First-Party Applications & SaaS Integration

### 3.1 Where Microsoft Apps Fit in the Entra ID Architecture
A common point of confusion is whether Microsoft's own applications (Exchange Online, SharePoint, Teams, Azure Portal, Microsoft Graph) are external SaaS apps or part of Entra ID itself.

**The Architectural Reality:**  
- **Microsoft Entra ID is the central Identity Provider (IdP) for everything.**
- Microsoft's applications (Exchange, SharePoint, Teams, Office 365, Azure Management Portal) are **First-Party SaaS Applications** that consume Entra ID as their identity authority, exactly like third-party apps (Salesforce, ServiceNow, Workday).
- In every Entra ID tenant, Microsoft automatically provisions hidden and visible **First-Party Service Principals** (Enterprise Applications) representing these services (e.g., *Office 365 Exchange Online*, *Microsoft Graph*, *Azure Resource Manager*).

```
                      ┌────────────────────────────────┐
                      │    MICROSOFT ENTRA ID (IdP)    │
                      │  (Users, Groups, MFA, Devices) │
                      └───────────────┬────────────────┘
                                      │ OAuth2 / OIDC / SAML
         ┌────────────────────────────┼────────────────────────────┐
         ▼                            ▼                            ▼
┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐
│  Exchange / M365│          │  Azure ARM Hub  │          │ Third-Party     │
│  (First-Party)  │          │  (Control Plane)│          │ (Salesforce, etc│
└─────────────────┘          └─────────────────┘          └─────────────────┘
```

### 3.2 Special Controls for First-Party Microsoft Apps
Because Microsoft controls both the IdP (Entra ID) and the resource applications (M365, Azure Portal), special capabilities exist:
1. **The "Office 365" App Suite in Conditional Access:**
   - In Conditional Access policies, Microsoft bundles dozens of interconnected services (Exchange Online, SharePoint Online, Teams, Planner) under a single umbrella app named **Office 365**.
   - **Exam Best Practice:** Always target the umbrella "Office 365" app rather than individual sub-apps (like Exchange alone) to prevent unexpected token and service dependency failures when users navigate between Teams and SharePoint.
2. **Continuous Access Evaluation (CAE):**
   - Traditional OAuth tokens have a 1-hour lifetime. If an admin disables a user, the user could historically still read emails until the 60-minute token expired.
   - For first-party apps (Exchange, Teams, SharePoint) and Azure Portal, **CAE** provides real-time event communication. If an admin disables Alice's account or changes her password, the resource service rejects the token within **seconds**.

---

## 4. The Two Distinct RBAC Planes: Directory vs. Azure ARM

The most critical architectural boundary on the AZ-104 exam is the complete separation between **Microsoft Entra ID Roles** and **Azure RBAC Roles**.

```
====================================================================================
DIRECTORY / IDENTITY PLANE (Entra ID)         RESOURCE MANAGEMENT PLANE (Azure ARM)
====================================================================================
Authority: Microsoft Entra ID                 Authority: Azure Resource Manager (ARM)
Stored in: Entra ID Directory Database        Stored in: Azure Resource Hierarchy Engine
Scope Structure:                              Scope Structure:
  [ Tenant Root Scope ]                         [ Management Groups ]
         │                                               │
         ▼                                               ▼
  [ Administrative Units (AUs) ]                 [ Subscriptions ]
                                                         │
                                                         ▼
                                                 [ Resource Groups ]
                                                         │
                                                         ▼
                                                 [ Azure Resources ]
------------------------------------------------------------------------------------
Primary Roles:                                Primary Roles:
  * Global Administrator                        * Owner
  * User Administrator                          * Contributor
  * Helpdesk Administrator                      * Reader
  * Security Administrator                      * User Access Administrator
  * Billing Administrator                       * Role-Specific (Storage Blob Owner)
====================================================================================
```

### 4.1 The Complete Separation Principle
- **Default Isolation:** A user who is assigned the highest Entra ID directory role—**Global Administrator**—has **ZERO ACCESS** to Azure subscriptions, resource groups, storage accounts, or virtual machines by default!
- If a Global Admin opens the Azure Portal and navigates to "Subscriptions", they will see nothing unless someone grants them an Azure RBAC role (e.g., Contributor or Reader) on that specific subscription.
- **Why?** Enterprise compliance. Identity admins (managing password resets and HR onboarding) should not have the ability to delete production SQL databases or spin up expensive GPU clusters.

### 4.2 The Emergency Elevation Mechanism ("Break Glass")
What happens if the only Subscription Owner leaves the company, and the subscription is orphaned?

Entra ID provides an emergency bridge located under:  
*Microsoft Entra ID $\rightarrow$ Properties $\rightarrow$ **Access management for Azure resources** $\rightarrow$ Toggle: **Yes***

```
[ Global Administrator ]
          │
          │ Toggles "Access management for Azure resources" = YES
          ▼
[ Granted: "User Access Administrator" at ARM Root Scope ( / ) ]
          │
          ▼
[ Can now grant Azure RBAC "Owner" permissions on ANY subscription in tenant ]
```

- When toggled to **Yes**, Entra ID temporarily assigns the caller the Azure RBAC role **User Access Administrator** at the absolute root scope (`/`) of the Azure Management Group hierarchy.
- This allows the administrator to see all subscriptions, assign new Owners to orphaned subscriptions, and then toggle the switch back to **No**.

### 4.3 Administrative Units (AUs) — Scoping Entra ID Roles
Just as Azure ARM uses Resource Groups to restrict where a Contributor can build VMs, Entra ID uses **Administrative Units (AUs)** to restrict directory roles:
- An AU is a container within Entra ID that holds selected users, groups, or devices.
- **Scenario:** You want Bob to be a User Administrator, but *only* for employees in the Sydney, Australia office.
- **Solution:** Create an AU named `AU-Sydney-Users`, add Sydney users into it, and assign Bob the *User Administrator* role **scoped to `AU-Sydney-Users`**. Bob can reset passwords for Sydney staff, but cannot touch Paris or London accounts.

---

## 5. Automated Hybrid Provisioning & Authentication Architecture

When enterprises connect their on-premises Active Directory Domain Services (AD DS) to Microsoft Entra ID, two main architectural decisions must be made:
1. **Provisioning / Synchronization Engine:** How do user and group objects get replicated to the cloud?
2. **Authentication Method:** How does Entra ID verify the user's password during sign-in?

```
                     ┌────────────────────────────────────────┐
                     │          ON-PREMISES AD DS             │
                     │    (LDAP / Kerberos / Win32 DC)        │
                     └───────────────────┬────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
   [ Entra Connect Sync Server ]                    [ Entra Cloud Sync Agent ]
   * Thick Windows Server                           * Lightweight agent (No SQL)
   * LocalDB / Full SQL                             * Cloud-orchestrated
   * 1-to-1 Tenant Binding                          * Multi-agent high availability
                 │                                               │
                 └───────────────────────┬───────────────────────┘
                                         │ Outbound TLS (Port 443)
                                         ▼
                     ┌────────────────────────────────────────┐
                     │          MICROSOFT ENTRA ID            │
                     │    (Cloud Directory & Graph API)       │
                     └────────────────────────────────────────┘
```

---

### 5.1 Entra Connect Sync vs. Entra Cloud Sync

| Feature / Architecture | Microsoft Entra Connect Sync (Traditional) | Microsoft Entra Cloud Sync (Modern Lightweight) |
| :--- | :--- | :--- |
| **Architecture** | Heavy monolithic server running on a dedicated Windows Server VM. Requires Microsoft SQL Server (or SQL Express LocalDB). | Ultra-lightweight background agent installed on any domain-joined Windows Server. **Zero local SQL database.** |
| **Control Plane** | Configuration rules, attribute mapping, and filtering rules live **locally on the on-prem server** (Sync Rules Editor). | Configuration and attribute transformations live **in the Azure Cloud Portal**. |
| **High Availability** | **Active / Staging (Passive)**. Only 1 server can actively write to Entra ID at a time. Switching requires manual failover. | **Multi-Agent Active/Active**. Multiple agents run simultaneously; cloud automatically routes work to healthy agents. |
| **Forest Topologies** | Connects to multiple on-prem forests, but requires direct network line-of-sight to all domain controllers. | Can connect to disconnected, isolated, or air-gapped forests without trust relationships between forests. |
| **Tenant Relationship** | **1-to-1 Rule:** One Entra Connect installation can synchronize to **EXACTLY ONE** Entra ID tenant. (You cannot sync one server to multiple tenants). | Can sync multiple disconnected AD forests to a single tenant easily using separate agents. |
| **Object Limit** | Up to 100,000 objects with SQL LocalDB; over 100,000 requires full SQL Server Standard/Enterprise. | Scaled automatically by cloud infrastructure; no local database limit. |
| **Sync Interval** | Object delta sync runs every **30 minutes** (customizable). Password hashes sync every **2 minutes**. | Continuous cloud-driven micro-sync. |
| **Special Capabilities** | Supports Device writeback, Exchange hybrid writeback, LDAP directory connections. | Optimized for users, groups, and contacts. (Rapidly closing feature parity). |

---

### 5.2 The Three Core Hybrid Authentication Protocols

When a synchronized user (`user@contoso.com`) types their password into the cloud login prompt, how does Entra ID validate it?

```
====================================================================================================
METHOD 1: PASSWORD HASH SYNCHRONIZATION (PHS) — [RECOMMENDED DEFAULT]
====================================================================================================
On-Prem DC  ──> [Entra Connect extracts MD4] ──> [Computes 1000-iter SHA-256 HMAC] ──> [Entra ID Cloud]
                                                                                             │
User ──> [Enters Password] ──> [Validated 100% in Cloud against stored hash-of-a-hash] <─────┘
* High Availability: 100% resilient to on-prem internet or datacenter outages.
* Cloud Security: Enables Entra ID Protection leaked-credential scanning on the dark web.
* Sync Frequency: Password hash changes sync automatically every 2 minutes.
====================================================================================================
METHOD 2: PASS-THROUGH AUTHENTICATION (PTA) — [NO CLOUD HASHES]
====================================================================================================
User ──> [Enters Password] ──> [Entra ID queues encrypted auth request]
                                           │
                                           ▼ (Outbound HTTPS polling via Port 443)
                             [On-Prem PTA Lightweight Agent]
                                           │ (Win32 LogonUser)
                                           ▼
                             [On-Premises Domain Controller]
* Security Footprint: ZERO password hashes stored in the cloud. Satisfies strict banking compliance.
* Vulnerability: If on-prem internet or domain controllers go down, users CANNOT sign into the cloud!
====================================================================================================
METHOD 3: FEDERATION (AD FS / PING / OKTA) — [ENTERPRISE REDIRECT]
====================================================================================================
User ──> [Entra ID detects federated domain] ──> [Redirects browser to on-prem STS: adfs.contoso.com]
                                                                  │
User authenticates on-premises ──> [AD FS signs SAML Token] ──> [Redirects back to Entra ID]
* Architecture: Heavyweight infrastructure (AD FS farm, Web Application Proxies, public SSL certs).
====================================================================================================
```

#### Detailed Breakdown of PHS Mechanics (Addressing Common Misconceptions):
- **Is the on-prem NTLM or plain text password sent to the cloud?**  
  **NO!** Active Directory stores passwords as MD4 hashes. Entra Connect takes that MD4 hash, adds a cryptographic salt, and runs it through **1,000 iterations of SHA-256 HMAC**.
- **Is the hash stored in Entra ID?**  
  **YES.** The resulting **hash-of-a-hash** is transmitted over TLS 443 and stored directly in the Microsoft Entra ID database.
- **Is authentication cloud-based or on-prem?**  
  **100% Cloud-Based.** When the user logs in, Entra ID hashes the user's submitted password using the same salt and 1,000 SHA-256 iterations and compares it locally in Azure. The on-prem domain controllers are **NOT contacted** at the time of user login!
- **Does it require constant synchronization?**  
  **YES.** Entra Connect runs a dedicated password hash sync thread that polls on-prem domain controllers for password changes every **2 minutes**.

---

### 5.3 Seamless Single Sign-On (Seamless SSO)

#### What Problem Does Seamless SSO Solve?
If an organization uses PHS or PTA, an employee sitting at their office desk on a domain-joined PC would still see a web prompt asking for their username and password when visiting `portal.azure.com`. Seamless SSO removes this friction.

#### The Underlying Mechanics:
1. When Seamless SSO is enabled in Entra Connect, a computer account named **`AZUREADSSOACC`** is automatically generated in the on-premises Active Directory domain.
2. Kerberos Service Principal Names (SPNs) are registered for `https://autologon.microsoftazuread-sso.com`.
3. The shared Kerberos decryption key of `AZUREADSSOACC` is securely shared with Microsoft Entra ID in the cloud.

```
[ Domain-Joined Desktop ]                     [ On-Premises KDC / DC ]                 [ Microsoft Entra ID ]
          │                                              │                                       │
          │ 1. Navigates to portal.azure.com             │                                       │
          ├─────────────────────────────────────────────────────────────────────────────────────>│
          │ 2. Returns 401 Unauthorized + challenges browser for Kerberos ticket                │
          │<─────────────────────────────────────────────────────────────────────────────────────┤
          │                                              │                                       │
          │ 3. Requests Kerberos Ticket for AZUREADSSOACC│                                       │
          ├─────────────────────────────────────────────>│                                       │
          │ 4. Issues Kerberos Ticket (encrypted)        │                                       │
          │<─────────────────────────────────────────────┤                                       │
          │                                                                                      │
          │ 5. Sends Kerberos Ticket to Entra ID over HTTPS                                      │
          ├─────────────────────────────────────────────────────────────────────────────────────>│
          │                                              │ 6. Entra ID decrypts ticket using     │
          │                                              │    stored AZUREADSSOACC shared key.   │
          │ 7. Authenticated! Returns Access Token       │    Signs user in silently!            │
          │<─────────────────────────────────────────────────────────────────────────────────────┤
```

---

## 6. Real-World AZ-104 Exam Traps & Gotchas Summary

1. **Global Admin vs. Azure Subscriptions:**  
   *Trap:* "A Global Admin cannot see or delete a Virtual Machine in an Azure subscription. What is missing?"  
   *Answer:* The Global Admin must elevate their access via Entra ID Properties (*Access management for Azure resources* toggle), or be explicitly assigned an Azure RBAC role (e.g., Contributor or Owner) on the subscription/resource group.

2. **Group-Based Licensing and Nested Groups:**  
   *Trap:* "You assign a Microsoft 365 E5 license to Group A. Group B is a member of Group A. Why do users in Group B not have licenses?"  
   *Answer:* Group-based licensing **does not support nested groups**. Licenses are only granted to direct first-level members.

3. **Role-Assignable Groups Mutation:**  
   *Trap:* "Can you convert an existing dynamic security group into a role-assignable group to manage User Administrator roles?"  
   *Answer:* **NO.** Role-assignable groups can only be enabled during initial creation (`isRoleAssignable=true`), cannot use dynamic membership rules, and cannot be converted later.

4. **Entra Connect Topology Rule:**  
   *Trap:* "Can one Microsoft Entra Connect server sync simultaneously to two different Microsoft Entra ID tenants?"  
   *Answer:* **NO.** Exactly one Entra Connect server maps to exactly one Entra ID tenant. To sync to another tenant, you must deploy a separate sync infrastructure or use Cloud Sync.

5. **Entra Joined vs. On-Premises Active Directory:**  
   *Trap:* "Do Microsoft Entra Joined devices require network line-of-sight to on-premises Domain Controllers to log into Windows?"  
   *Answer:* **NO.** Entra Joined machines authenticate against Microsoft Entra ID in the cloud via the internet. They have no Active Directory domain join.

6. **Password Hash Sync Outage Resilience:**  
   *Trap:* "The corporate WAN connection goes down and on-premises domain controllers are unreachable. Can remote employees still sign into Microsoft 365 if the organization uses PHS?"  
   *Answer:* **YES.** In PHS, the 1,000-iteration SHA-256 hash-of-a-hash is stored in the Entra ID cloud database. Authentication occurs entirely in Azure without contacting on-premises DCs. (If they were using PTA or Federation, sign-ins would fail).

---

## 7. Architectural Cheat Sheet (Quick Revision)

```
+-----------------------------------+-------------------------------------------------------------------------+
| Architecture Question             | Core Architectural Fact                                                 |
+-----------------------------------+-------------------------------------------------------------------------+
| BYOD Personal Machine             | Microsoft Entra Registered (MAM app protection, local account login)     |
| Cloud-First Corporate Laptop      | Microsoft Entra Joined (Full Intune MDM, UPN login at Windows screen)   |
| Legacy On-Prem Corporate Asset    | Microsoft Entra Hybrid Joined (Domain-joined to AD DS + synced to cloud)|
| PRT Storage Location              | Cryptographically bound to TPM 2.0 hardware chip                        |
| Team Mailbox + SharePoint Library | Microsoft 365 Group (Collaboration suite, no group nesting)             |
| Access Control & Licensing        | Security Group (Supports nesting, static/dynamic, role-assignable opt)  |
| Directory RBAC vs Azure RBAC      | Entra ID Roles (Directory Plane) != Azure RBAC Roles (ARM Plane)        |
| Global Admin Azure Elevation      | "Access management for Azure resources" -> User Access Admin at root /  |
| Scoped Directory Roles            | Administrative Units (AUs)                                              |
| Resilient Hybrid Auth             | Password Hash Sync (PHS) - Cloud-based auth, 2-minute sync interval     |
| Zero Hashes in Cloud              | Pass-through Authentication (PTA) - Outbound port 443 agent to on-prem  |
| Silent On-Prem Domain SSO         | Seamless SSO - Kerberos ticket via AZUREADSSOACC computer account       |
+-----------------------------------+-------------------------------------------------------------------------+
```
