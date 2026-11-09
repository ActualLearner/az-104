# Hard-Mode Scenario 01 Deep Dive: Cross-Tenant Identity Governance, B2B Lifecycle, Group-Based Licensing & SSPR

---

## Part 1: The Scenario, Submission, and Detailed Scoring Analysis

### 1.1 The Original Scenario: Global Logistics Corp Lab 01

#### Architecture Context
Global Logistics Corp operates an Entra ID tenant (`globallogistics.com`) provisioned with Microsoft Entra ID P2 licenses. To facilitate customs processing and global supply chain operations, they invite external customs brokers from partner organizations and freelance field agents.

#### Configuration Baseline
1. **Dynamic Security Group (`DG-Customs-Auditors`)**:
   - Membership Rule:
     ```text
     (user.userType -eq "Guest") and (user.accountEnabled -eq true) and (user.otherMails -contains "@partnerbroker.com")
     ```
2. **Self-Service Password Reset (SSPR) Scope**:
   - SSPR enabled and scoped strictly to security group `SG-SSPR-AllClearance`.
3. **Provisioning Workflow**:
   - 20 freelance agents with personal Microsoft accounts (`@outlook.com`) and 30 partner brokers (`user@partnerbroker.com`) are invited using Microsoft Graph B2B invitation API (`/invitations`).
   - For the 30 partner brokers, the onboarding script sets:
     - `department` = `"Customs"`
     - `mail` = `"user@partnerbroker.com"`
     - `otherMails` = `[]` (left unpopulated / empty).
   - For the 20 freelance `@outlook.com` agents:
     - `usageLocation` = `"US"`
     - Added as direct assigned members to `SG-SSPR-AllClearance`.
4. **Conditional Access & Cross-Tenant Access Settings**:
   - Conditional Access Policy `CAP-Enforce-MFA`:
     - Target: All cloud applications.
     - Users/Groups: `DG-Customs-Auditors`.
     - Grant Control: Require multi-factor authentication (MFA).
   - Entra External ID -> Cross-Tenant Access Settings:
     - Partner Tenant: `partnerbroker.com`.
     - Inbound Trust Settings: **Trust multi-factor authentication from Microsoft Entra tenants** is **Disabled**.

#### The Three Incidents
- **Incident A (Dynamic Group & Group-Based Licensing Failure)**:
  None of the 30 partner brokers appear in `DG-Customs-Auditors` after invitation redemption, despite their corporate email address ending in `@partnerbroker.com`. When the tenant administrator modifies the dynamic membership rule to `(user.mail -contains "@partnerbroker.com")`, the 30 users populate into the group. However, when an Entra ID P2 license is assigned to `DG-Customs-Auditors` via group-based licensing, the assignment triggers a failure state: `LicenseAssignmentFailed` with status `MutuallyExclusiveViolations` or `MissingPrerequisite` / `DependencyViolation`.
- **Incident B (SSPR Portal Rejection on Guest Accounts)**:
  A freelance agent (`agent1@outlook.com`) forgets their password and attempts to initiate a password reset at the tenant-specific reset URL:
  `https://passwordreset.microsoftonline.com/?tenantid=<global-logistics-tenant-id>`.
  The SSPR portal immediately halts the workflow with an error stating the account cannot be reset. The administrator insists this is a platform defect because SSPR is enabled, the user is an active direct member of `SG-SSPR-AllClearance`, and an Entra ID P2 license is assigned.
- **Incident C (Redundant Multi-Factor Authentication Escalation)**:
  Partner brokers from `partnerbroker.com` successfully complete strong MFA when logging into their home corporate Entra tenant. However, upon accessing Global Logistics Corp's cloud resources, `CAP-Enforce-MFA` forces them to register and perform a second MFA inside Global Logistics Corp's tenant, prompting widespread helpdesk escalations.

---

### 1.2 User Submission
> *"1. The invited b2b users "mail" property is filled with the mail they use to log in, which is the partners mail. Using othermails wouldn't work since that's not where their @partnerbroker.com is. The licensing assignment failed because I think it's the inbound MFA being disabled though I don't know why.*
> 
> *2. Since they are guest users, their accounts are not actually stored with us in our tenant, we're simply trusting their Identity provider for authenticating them, so we can't really change their passwords or give them SSPR feature. I'm guessing the tenant can't perform any self-service account operations in our tenant since their idenitty is not with us.*
> 
> *3. Your question told me the answer to no.1, duplicate MFA is what caused the license assignment to fail(don't give me the answer again like this, i doubt shireens and other practice exams are like this). I'm guessing the answer is the inbound MFA being disabled, we should trust it, thus allowing the accounts to pass mfa from their IDP and accepting that mFA passing as mfa passed."*

---

### 1.3 Detailed Scoring & Diagnostic Breakdown

| Incident | Candidate Assessment | Score | Architectural Truth & Root Cause Breakdown |
| :--- | :--- | :---: | :--- |
| **Incident A**<br>*(Dynamic Rule & Licensing)* | **Partially Correct**<br>(Identified `mail` attribute correctly; missed licensing root cause) | **1.5 / 3.0** | **Attribute Discovery**: 100% correct. B2B invitations write the invited address into `mail` and construct the User Principal Name (`user_partnerbroker.com#EXT#@globallogistics.onmicrosoft.com`). The `otherMails` collection remained empty (`[]`), so the initial filter returned zero users.<br><br>**Licensing Failure Root Cause**: Incorrect. MFA settings have zero interaction with the Entra ID licensing evaluation engine. The assignment failed because:<br>1. **Missing `usageLocation`**: Guest user objects provisioned via Graph without explicit `usageLocation` default to `null`. Azure licensing requires ISO-3166-1 alpha-2 country codes.<br>2. **Service Plan Dependency / Mutually Exclusive SKUs**: Group-based licensing assigns all service plans by default unless specific plans are toggled off. Assigning a standalone add-on (e.g., PIM or Identity Governance) without its prerequisite base plan, or assigning overlapping plans that conflict (e.g., conflicting Exchange Online or Defender service plans), triggers `MutuallyExclusiveViolations` or `MissingPrerequisite`. |
| **Incident B**<br>*(SSPR & Guest Boundary)* | **Strongly Correct**<br>(Identified authentication authority boundary; clarified self-service boundary) | **2.5 / 3.0** | **Authentication Authority**: 100% accurate. SSPR requires write authority over the user's credential store. For external B2B guests (MSA `@outlook.com` or external Entra ID), password authority resides strictly in their Home IdP (MSA accounts at `account.live.com`). Global Logistics Corp issues SAML/WS-Fed/OIDC federated security tokens; it holds no password hashes for external identities and cannot execute password writebacks or resets.<br><br>**Nuance / Self-Service Boundary**: While guests *cannot* reset their passwords in the resource tenant, guests *can* and *must* perform self-service operations for resource-scoped authentication methods (e.g., registering Microsoft Authenticator, FIDO2 keys, phone) via the resource tenant's Combined Registration portal: `https://mysignins.microsoftonline.com?tenantid=<tenant-id>`. |
| **Incident C**<br>*(Cross-Tenant Inbound MFA)* | **Accurate**<br>(Identified Inbound Trust disabled; correct fix) | **3.0 / 3.0** | **Cross-Tenant Trust Triad**: Correct. By default, Inbound Access for external organizations requires guests to satisfy MFA within the resource tenant. When `CAP-Enforce-MFA` evaluates the token, if Inbound Trust for MFA is unchecked, the token lacks an accepted MFA claim. To honor the partner's MFA token, the resource administrator must navigate to **External Identities -> Cross-tenant access settings -> Organizational settings -> Add partnerbroker.com -> Inbound access -> Trust settings** and check **Trust multi-factor authentication from Microsoft Entra tenants**. |

**Overall Score**: **7.0 / 9.0 (77.8% - PASS on Hard Mode)**

---

## Part 2: Microsoft Entra B2B Graph API & Object Lifecycle Mechanics

```
                  +----------------------------------------------+
                  | Admin / Automation calls POST /invitations    |
                  +----------------------+-----------------------+
                                         |
                                         v
                  +----------------------------------------------+
                  |  Pre-Redemption Guest Object Created         |
                  |  - userType: "Guest"                         |
                  |  - mail: "user@partnerbroker.com"            |
                  |  - otherMails: [] (unless explicitly passed) |
                  |  - UPN: user_partnerbroker.com#EXT#@domain   |
                  |  - externalUserState: "PendingAcceptance"    |
                  |  - usageLocation: null (unless specified!)   |
                  +----------------------+-----------------------+
                                         |
                       Invitation Link Delivered to User
                                         |
                                         v
                  +----------------------------------------------+
                  | User Clicks Link & Authenticates at Home IdP |
                  +----------------------+-----------------------+
                                         |
                                         v
                  +----------------------------------------------+
                  |  Post-Redemption State Transition             |
                  |  - externalUserState: "Accepted"             |
                  |  - externalUserStateChangeDateTime: <UTC>    |
                  |  - Object immutable ID linked to Home IdP    |
                  |  - mail & UPN remain intact                  |
                  +----------------------------------------------+
```

### 2.1 The Invitation Payload & Schema Attributes
When inviting external users via Microsoft Graph API (`POST https://graph.microsoft.com/v1.0/invitations`), the directory engine provisions a shadow user object in the resource tenant. Understanding how identity attributes map across the API payload is essential for AZ-104 dynamic groups.

```json
{
  "invitedUserEmailAddress": "broker101@partnerbroker.com",
  "invitedUserDisplayName": "Customs Broker 101",
  "inviteRedirectUrl": "https://logistics.globallogistics.com/customs",
  "sendInvitationMessage": true,
  "invitedUserType": "Guest",
  "invitedUserMessageInfo": {
    "customizedMessageBody": "Welcome to Global Logistics Customs Portal."
  }
}
```

#### Directory Attribute State Table

| Attribute | State Prior to Redemption | State Post-Redemption | Dynamic Rule Caveat |
| :--- | :--- | :--- | :--- |
| `userPrincipalName` | `broker101_partnerbroker.com#EXT#@globallogistics.onmicrosoft.com` | Remains unchanged unless manually modified by tenant admin. | Contains `#EXT#` and the resource tenant default domain. Never use `-match "@partnerbroker.com"` on UPN. |
| `mail` | Populated with `invitedUserEmailAddress` (`broker101@partnerbroker.com`). | Persists as `broker101@partnerbroker.com`. | **Primary filter target** for dynamic membership rules targeting external corporate domains. |
| `otherMails` | Empty collection `[]` by default unless explicitly supplied during provisioning via Graph `/users/{id}` PATCH. | Remains unchanged. Graph invitation does **not** populate `otherMails`. | Filtering `(user.otherMails -contains "@partnerbroker.com")` will evaluate to `false` for all standard invitations. |
| `userType` | `"Guest"` (or `"Member"` if requested in API payload). | Remains `"Guest"`. | Can be toggled between `Guest` and `Member` without altering authentication authority. |
| `externalUserState` | `"PendingAcceptance"` | `"Accepted"` | Useful for targeting onboarding campaigns (e.g., users who have not yet redeemed). |
| `usageLocation` | `null` (unless explicitly provided). | `null` | **Critical blocker**: Prevents group-based licensing assignment. |

### 2.2 Redemption Flow & Identity Mapping
1. **Target Identification**: When the external user navigates to the invitation URL, Entra ID inspects the tenant context and redirects the user to their authoritative identity provider (IdP).
2. **Authority Resolution**:
   - If the domain matches a managed or federated Entra ID tenant (e.g., `partnerbroker.com`), authentication occurs against that tenant.
   - If the user uses a consumer Microsoft Account (`@outlook.com`, `@live.com`), authentication occurs against the consumer MSA identity platform.
   - If Google Federation or Email One-Time Passcode (OTP) is configured, the respective provider issues the identity assertion.
3. **Claim Anchoring**: Entra ID maps the external subject identifier (`sub` or `oid` from the home tenant) to the shadow user object's alternative security identities. The object is now linked; subsequent sign-ins evaluate credentials strictly at the home IdP.

---

## Part 3: Group-Based Licensing Architecture & Failure Remediation

Group-based licensing automates license assignment and removal based on group membership. While simple in concept, its internal dependency engine enforces strict validation rules that frequently cause failures in heterogeneous environments.

```
+---------------------------------------------------------------------------------+
|                         Group-Based Licensing Engine                            |
+---------------------------------------------------------------------------------+
                                         |
                                         v
   +---------------------------+---------------------------+---------------------------+
   |   1. Usage Location       |   2. License Quantity     |   3. Service Dependency   |
   +---------------------------+---------------------------+---------------------------+
   | Checks if `usageLocation` | Checks if tenant has      | Validates base SKU is     |
   | is set (ISO-3166-1).      | available unassigned seats| assigned for any add-on   |
   | FAIL: ProhibitedInUsage-  | FAIL: CountViolation      | plans.                    |
   | LocationViolation         |                           | FAIL: DependencyViolation |
   +---------------------------+---------------------------+---------------------------+
                                         |
                                         v
   +---------------------------+---------------------------+---------------------------+
   |   4. Mutual Exclusivity   |   5. Inheritance Bounds   |   6. Resolution Engine    |
   +---------------------------+---------------------------+---------------------------+
   | Checks for duplicate or   | Evaluates DIRECT members  | Error recorded on user.   |
   | conflicting plans.        | only. Nested groups are   | Admin fixes issue, then   |
   | FAIL: MutuallyExclusive-  | IGNORED by licensing engine| triggers "Reprocess".     |
   | Violation                 |                           |                           |
   +---------------------------+---------------------------+---------------------------+
```

### 3.1 License Assignment Failure States & Violation Types

| Violation Type | Technical Trigger | Real-World Scenario | Remediation Action |
| :--- | :--- | :--- | :--- |
| **`MutuallyExclusiveViolation`** | Two conflicting service plans that cannot coexist are assigned to the same user simultaneously. | A group assigns a license containing *Exchange Online (Plan 2)* while the user already has *Exchange Online (Plan 1)* or a conflicting security plan assigned directly or via another group. | Open group license configuration -> toggle OFF conflicting service plan components within the assignment blade. |
| **`DependencyViolation` / `MissingPrerequisite`** | An assigned service plan requires another service plan to be enabled, but that prerequisite plan is disabled or absent. | Assigning *Microsoft Entra ID Governance Step-Up* or *PIM for Groups* when the base *Microsoft Entra ID P1/P2* license plan is toggled off or unassigned. | Enable the parent service plan in the same group assignment, or assign the prerequisite base license to the user. |
| **`ProhibitedInUsageLocationViolation`** | The user object lacks a `usageLocation`, or the service is legally restricted in the specified country. | B2B Guest users invited via script where `usageLocation` was left `null`. Azure cannot calculate tax or compliance. | Execute PowerShell / Graph call to populate `usageLocation` with a 2-letter ISO country code (e.g., `"US"`). |
| **`CountViolation`** | All purchased seats for the specified SKU are exhausted. | Group has 500 members; only 450 Entra ID P2 seats remain available in tenant. | Purchase additional licenses, unassign unused direct licenses, or downsize group membership. |

### 3.2 Critical Structural Constraints
1. **Strict Non-Inheritance of Nested Groups**:
   - If Group A is assigned a license, and Group B is added as a member of Group A (Group B nested inside Group A), **members of Group B DO NOT receive the license**.
   - Group-based licensing *only* evaluates direct first-degree members (`transitiveMemberOf` is not used by the licensing processor).
2. **License Assignment State Transition**:
   - When a user enters a group: Entra ID transitions user license state to `Active` (or `Error` if a violation occurs).
   - If in `Error` state, the user **does not receive the license**, but remains a member of the security group.
3. **Reprocessing Licenses**:
   - After resolving root causes (e.g., updating `usageLocation` on all guest objects), licensing is not always re-evaluated immediately.
   - The administrator must force re-evaluation via the Azure Portal: **Microsoft Entra ID -> Licenses -> All products -> [Select License] -> Licensed groups -> [Select Group] -> Reprocess**.
   - Via Microsoft Graph PowerShell:
     ```powershell
     # Force group license reprocessing
     Invoke-MgGraphRequest -Method POST -Uri "https://graph.microsoft.com/v1.0/groups/<group-id>/reprocessLicense"
     ```

### 3.3 Bulk Setting `usageLocation` for Guest Accounts
```powershell
# Connect to Microsoft Graph
Connect-MgGraph -Scopes "User.ReadWrite.All"

# Query all Guest users lacking a usageLocation and set to 'US'
$guestsWithoutLocation = Get-MgUser -Filter "userType eq 'Guest' and usageLocation eq null" -All

foreach ($guest in $guestsWithoutLocation) {
    Update-MgUser -UserId $guest.Id -UsageLocation "US"
    Write-Host "Updated usageLocation for: $($guest.UserPrincipalName)" -ForegroundColor Green
}
```

---

## Part 4: Comprehensive Microsoft Entra ID Licensing Matrix (2026 Standards)

Azure and Microsoft Entra licensing spans multiple tiers. For AZ-104, administrators must distinguish between what is free, what requires P1, what requires P2, and how External ID (B2B) billing functions.

### 4.1 Feature Breakdown by License Tier

| Feature Capability | Entra ID Free | Entra ID P1 | Entra ID P2 | Entra ID Governance |
| :--- | :---: | :---: | :---: | :---: |
| **Directory Object Limit** | 500,000 objects | Unlimited | Unlimited | Unlimited |
| **User & Group Management** | Yes | Yes | Yes | Yes |
| **Self-Service Password Reset (SSPR)** | Cloud users only (No password writeback) | Cloud + Hybrid Password Writeback to AD DS | Cloud + Hybrid Password Writeback to AD DS | Cloud + Hybrid Password Writeback to AD DS |
| **Conditional Access Policies (CAP)** | No (Security Defaults only) | **Full Support** | **Full Support** | **Full Support** |
| **Group-Based Licensing** | No | **Yes** | **Yes** | **Yes** |
| **Dynamic Security & M365 Groups** | No | **Yes** | **Yes** | **Yes** |
| **Hybrid Identity (Password Hash Sync)** | Yes | Yes | Yes | Yes |
| **Hybrid Identity (Pass-Through Auth)** | Yes | Yes | Yes | Yes |
| **Identity Protection (Risk Policies)** | No (Can view basic flags) | No (Can view basic flags) | **Yes** (Risk-based Conditional Access) | **Yes** |
| **Privileged Identity Management (PIM)** | No | No | **Yes** (Roles + Groups) | **Yes** |
| **Access Reviews & Lifecycle Workflows** | No | No | Basic Reviews | **Yes** (Complete Governance Suite) |
| **Entitlement Management (Access Packages)** | No | No | Yes | **Yes** |

### 4.2 Microsoft 365 License Alignment

| Microsoft 365 SKU | Included Entra ID License | Notable Identity Features Included |
| :--- | :--- | :--- |
| **Microsoft 365 Business Basic / Standard** | Entra ID Free | Security Defaults, basic cloud SSPR, standard directory. |
| **Microsoft 365 Business Premium** | **Entra ID P1** | Conditional Access, Dynamic Groups, Group Licensing, Cloud SSPR + Password Writeback. |
| **Microsoft 365 E3 / Office 365 E3** | **Entra ID P1** | Enterprise Conditional Access, hybrid writeback, dynamic groups. |
| **Microsoft 365 E5 / Office 365 E5 Security** | **Entra ID P2** | Full Identity Protection (User/Sign-in Risk), PIM for Azure resources & Entra roles, Access Reviews. |

### 4.3 Microsoft Entra External ID (B2B) Licensing Model
- **Historical Model (Deprecated)**: 1:5 ratio (1 P1/P2 license covered 5 guest users).
- **Current Official Model (Monthly Active Users - MAU)**:
  - B2B Collaboration is billed under **Microsoft Entra External ID**.
  - **First 50,000 MAUs per month are 100% FREE** across both P1 and P2 feature sets.
  - An MAU is defined as a unique guest user who performs an authentication event (interactive or non-interactive) within the calendar month.
  - If guest usage exceeds 50,000 MAU within a single month:
    - B2B with P1 features: Flat per-MAU charge (~$0.00325 per active user).
    - B2B with P2 features (e.g., Risk-based Conditional Access evaluating guest sign-ins): Premium per-MAU charge (~$0.01625 per active user).
  - **Linking Requirement**: To enable P1/P2 features for guest users beyond free defaults, the Entra ID tenant must be linked to an active Azure Subscription via a Resource Group.

---

## Part 5: Self-Service Password Reset (SSPR) & Credential Authority Boundaries

```
+---------------------------------------------------------------------------------+
|                       SSPR Reset Request Architecture                           |
+---------------------------------------------------------------------------------+
                                         |
                                         v
   +-------------------------------------+-------------------------------------+
   |           Native Cloud Member       |           External B2B Guest        |
   |      (alice@globallogistics.com)    |         (agent1@outlook.com)        |
   +-------------------------------------+-------------------------------------+
   | - Password Authority:               | - Password Authority:               |
   |   Resource Tenant (globallogistics) |   Home IdP (account.live.com)       |
   | - Hash Stored Locally: YES          | - Hash Stored Locally: NO           |
   | - SSPR Capability: ALLOWED          | - SSPR Capability: BLOCKED          |
   |   (Can reset password in portal)    |   (Cannot reset password in tenant) |
   +-------------------------------------+-------------------------------------+
                                         |
                                         v
   +-------------------------------------+-------------------------------------+
   | SSPR Outcome:                       | SSPR Outcome:                       |
   | Success -> Updates Cloud Hash       | Halt -> Error displayed:            |
   | (and writes back to AD DS if P1)    | "You cannot reset your own password |
   |                                     | because password reset is not       |
   |                                     | properly set up for your organization"|
   +-------------------------------------+-------------------------------------+
```

### 5.1 Identity Authority Boundaries
The fundamental principle of federated identity and B2B collaboration is **Authority Boundary**:
1. **Credential Authority**: The tenant or provider that issues, verifies, and stores the cryptographic credential (password, private key, biometric).
2. **Resource Authority**: The tenant granting access to cloud applications, subscriptions, and workloads.

For B2B Guest users:
- The resource tenant possesses **zero write authority** over the guest's home credential database.
- An `@outlook.com` user authenticates against Microsoft Consumer Identity (`login.live.com`).
- A `user@partnerbroker.com` user authenticates against `login.microsoftonline.com/partnerbroker.com`.
- When an external user visits `passwordreset.microsoftonline.com/?tenantid=<resource-tenant-id>`, the resource tenant inspects the user object. Because `CreationType` is `Invitation` or `userType` is `Guest` backed by an external IdP, the portal aborts.

### 5.2 What Guests CAN and CANNOT Do
- **Guests CANNOT**:
  - Reset their password in the inviting resource tenant.
  - Unlock their account via the resource tenant's SSPR portal.
  - Register security questions for password reset in the resource tenant.
- **Guests CAN**:
  - Register authentication methods specifically for the resource tenant (e.g., Microsoft Authenticator app push notifications, SMS verification, FIDO2 security keys).
  - Manage their resource tenant security methods by visiting:
    `https://mysignins.microsoftonline.com?tenantid=<resource-tenant-id>` -> **Security info**.
  - Leave the resource tenant self-service via `https://myaccount.microsoftonline.com` -> **Organizations** -> **Leave organization**.

### 5.3 SSPR Implementation Matrix: Cloud vs Hybrid

| Configuration Component | Cloud-Only User | Hybrid User (Without Writeback) | Hybrid User (With Writeback Enabled) | External Guest User |
| :--- | :---: | :---: | :---: | :---: |
| **Minimum License** | Entra ID Free | Entra ID Free / P1 | **Entra ID P1 or P2** | N/A (Unsupported) |
| **Password Change Location** | Entra ID Portal | On-premises Windows / Ctrl+Alt+Del | Entra ID Portal / MySignIns | Home IdP Only |
| **Writeback Agent** | Not required | Not required | **Microsoft Entra Connect Sync** / Cloud Sync | Not applicable |
| **Account Unlock Sync** | Immediate in Cloud | Local AD only | Synchronizes unlock to on-premises AD DS | Not applicable |

---

## Part 6: Multi-Factor Authentication (MFA) Architecture & Enforcement

Modern Microsoft Entra MFA has completely transitioned away from legacy per-user enforcement to unified policies and Conditional Access.

```
+---------------------------------------------------------------------------------+
|                       Modern Authentication Policy Engine                       |
+---------------------------------------------------------------------------------+
                                         |
                                         v
   +-------------------------------------+-------------------------------------+
   |           Legacy Per-User MFA       |        Conditional Access MFA       |
   |          (DEPRECATED / RETIRED)     |         (MODERN STANDARD 2026)      |
   +-------------------------------------+-------------------------------------+
   | - Static: Disabled / Enabled /      | - Dynamic: Context-aware evaluation |
   |   Enforced                          |   (Device, Location, Risk, App)     |
   | - Disrupts modern auth workflows    | - Enforced per-session or per-token |
   | - Lacks granular scoping            | - Granular grant controls           |
   +-------------------------------------+-------------------------------------+
                                         |
                                         v
   +---------------------------------------------------------------------------+
   |                Authentication Methods Convergence Policy                  |
   |      (Microsoft Entra ID -> Protection -> Authentication methods)         |
   |                                                                           |
   | - FIDO2 / Passkeys (Phishing-resistant)                                   |
   | - Microsoft Authenticator (Number Matching & Geo-Context MANDATORY)       |
   | - Certificate-Based Authentication (CBA)                                  |
   | - Temporary Access Pass (TAP) for onboarding & bootstrapping              |
   +---------------------------------------------------------------------------+
```

### 6.1 Authentication Methods Policy Convergence
Microsoft has unified all legacy MFA and SSPR method toggles into the centralized **Authentication Methods Policy**:
- **Location**: **Microsoft Entra ID -> Protection -> Authentication methods -> Policies**.
- Legacy portals (**MFA Service Settings** at `account.activedirectory.windowsazure.com` and **Password Reset -> Authentication methods**) are superseded.

#### Core Modern Authentication Methods

| Authentication Method | Security Classification | Phishing Resistant? | AZ-104 Key Architectural Property |
| :--- | :--- | :---: | :--- |
| **FIDO2 / WebAuthn / Passkeys** | High | **YES** | Hardware token or device passkey; bound to domain origin; immune to AiTM proxy attacks. |
| **Windows Hello for Business** | High | **YES** | Cryptographic key pair tied to physical TPM 2.0 chip on registered device. |
| **Certificate-Based Auth (CBA)** | High | **YES** | X.509 client certificates validated against trusted tenant CA hierarchy. |
| **Microsoft Authenticator (Push)** | Medium-High | No | App notification with **Number Matching** and **Application Context** enforced tenant-wide. |
| **OATH TOTP (Hardware/Software)** | Medium | No | 6-digit rolling code; vulnerable to real-time prompt replay / AiTM phishing. |
| **SMS / Voice Call** | Low | No | Legacy telephony; vulnerable to SIM swap and SS7 interception. Weakest method. |
| **Temporary Access Pass (TAP)** | Administrative | N/A | Time-limited passcode (1 hr to 8 hrs) used to bootstrap passwordless / FIDO2 onboarding without passwords. |

### 6.2 Security Defaults vs Conditional Access
- **Security Defaults**:
  - Included with Entra ID Free.
  - Binary switch: All users must register for Microsoft Authenticator within 14 days.
  - Blocks legacy authentication protocols (POP3, IMAP, SMTP).
  - Forces MFA for privileged administrator roles on every sign-in.
  - **Incompatibility**: Cannot be enabled if any Conditional Access policy is active in the tenant.
- **Conditional Access Policies (CAP)**:
  - Requires **Entra ID P1** or **P2**.
  - Provides granular signal-based evaluation:
    - *Signals*: User/Group, Cloud App, Device Platform, Named Network Location, Device State (Compliant/Hybrid Joined), Sign-in Risk (P2), User Risk (P2).
    - *Decisions*: Block Access, Grant Access with Controls (Require MFA, Require Compliant Device, Require Password Change).
    - *Session Controls*: Sign-in frequency, Persistent browser session.

### 6.3 Phishing-Resistant MFA & Number Matching
As of 2023–2026, **Number Matching** is permanently enforced globally for all Microsoft Authenticator push notifications.
- When a user signs in, the browser displays a two-digit number.
- The user must enter that exact two-digit number into the Microsoft Authenticator prompt on their mobile device.
- Eliminates **MFA Fatigue / MFA Bombing** attacks where attackers spam approval prompts until the victim taps "Approve".
- **Application Context & Geographic Location**: Admins can configure the prompt to display the calling application name and approximate GPS-derived map location.

---

## Part 7: Cross-Tenant Access Settings & External Identities Deep Dive

Cross-tenant access settings govern how external users collaborate with your tenant (Inbound) and how your internal users interact with external tenants (Outbound).

```
                      INBOUND ACCESS                             OUTBOUND ACCESS
             (External Users -> Our Tenant)              (Our Users -> External Tenants)
             +----------------------------+              +----------------------------+
             | Default Settings           |              | Default Settings           |
             | (Applies to all external)  |              | (Applies to all external)  |
             +--------------+-------------+              +--------------+-------------+
                            |                                           |
                            v                                           v
             +----------------------------+              +----------------------------+
             | Organizational Settings    |              | Organizational Settings    |
             | (Overrides Default for     |              | (Overrides Default for     |
             | partnerbroker.com)         |              | partnerbroker.com)         |
             +--------------+-------------+              +--------------+-------------+
                            |
                            v
             +----------------------------------------------------------+
             |                 Inbound Trust Triad                      |
             |  [x] Trust MFA from Entra tenants                        |
             |  [ ] Trust compliant devices                             |
             |  [ ] Trust Microsoft Entra hybrid joined devices         |
             +----------------------------------------------------------+
```

### 7.1 Cross-Tenant Access Hierarchy
1. **Default Settings**: Baseline inbound and outbound rules applied to every external Entra ID organization not explicitly defined.
2. **Organizational Settings**: Specific per-domain configurations that override default settings for designated partner tenants (e.g., adding `partnerbroker.com`).

### 7.2 The Inbound Trust Triad
When an external partner user accesses your tenant, your Conditional Access policies evaluate their session. Without Inbound Trust enabled, your tenant ignores any claims issued by their home tenant.

The Trust Triad consists of three independent checkboxes under **Inbound access -> Trust settings**:
1. **Trust multi-factor authentication from Microsoft Entra tenants**:
   - When checked: If the partner completes MFA in their home tenant, their issued authentication token contains an MFA claim (`authmethodsreferences` containing `mfa`). Your tenant's Conditional Access policy satisfies `Require MFA` immediately without re-prompting.
   - When unchecked: Global Logistics Corp treats the incoming token as single-factor. The user is redirected to Global Logistics' MFA registration flow.
2. **Trust compliant devices**:
   - Honors the MDM compliance claim (Intune) issued by the partner tenant.
   - Allows partner devices managed by their own MDM to satisfy your Conditional Access policies requiring `Require device to be marked as compliant`.
3. **Trust Microsoft Entra hybrid joined devices**:
   - Honors the on-premises domain-join claim issued by the partner tenant.

### 7.3 B2B Collaboration vs B2B Direct Connect

| Capability Dimension | B2B Collaboration (Standard) | B2B Direct Connect |
| :--- | :--- | :--- |
| **User Object in Resource Tenant** | **Shadow Guest User created** (`userType: Guest`). | **No shadow user object created**. Mutual token trust only. |
| **Invitation & Redemption** | Required (Email invitation or direct link redemption). | No invitation or redemption required. Seamless SSO. |
| **Primary Workloads** | All Azure Portal, Azure resources, SharePoint, Teams, SaaS apps. | Exclusively **Microsoft Teams Shared Channels**. |
| **Administration** | Managed via Users blade, Dynamic Groups, App assignments. | Managed via Cross-Tenant Access Settings -> B2B Direct Connect. |
| **Cross-Tenant Trust Requirements**| Optional (MFA trust recommended to avoid double MFA). | **Mandatory**: Mutual cross-tenant inbound and outbound trust must be enabled. |

### 7.4 Tenant Restrictions
- **Purpose**: Prevents internal corporate users on managed devices/networks from accessing external unauthorized Entra tenants (data exfiltration mitigation).
- **Mechanism**: Injects HTTP request headers via corporate proxy / firewall:
  - `Restrict-Access-To-Tenants: <allowed-tenant-list>`
  - `Restrict-Access-Context: <directory-ID>`

---

## Part 8: Step-by-Step Azure Portal Click-Paths & Microsoft Graph PowerShell Commands

### 8.1 Remediation Click-Paths

#### Click-Path 1: Enabling Inbound MFA Trust for Partner Tenant
1. Sign in to the **Microsoft Entra admin center** (`https://entra.microsoft.com`) as a **Security Administrator** or **Global Administrator**.
2. In the left navigation pane, expand **Identity** -> expand **External Identities** -> select **Cross-tenant access settings**.
3. Select the **Organizational settings** tab.
4. Click **+ Add organization**.
5. In the search box, type `partnerbroker.com` (or enter the partner's Tenant ID) -> select the partner -> click **Add**.
6. In the list, locate `partnerbroker.com` and select the hyperlink under the **Inbound access** column (initially states *Inherited from default*).
7. Select the **Trust settings** tab.
8. Check the box: **Trust multi-factor authentication from Microsoft Entra tenants**.
9. *(Optional)* Check **Trust compliant devices** if partner Intune compliance should be honored.
10. Click **Save** at the bottom of the blade.

#### Click-Path 2: Correcting Dynamic Group Rule
1. Navigate to **Identity** -> **Groups** -> **All groups**.
2. Locate and select **`DG-Customs-Auditors`**.
3. Under the **Manage** section, select **Dynamic membership rules**.
4. In the rule builder, update the syntax:
   ```text
   (user.userType -eq "Guest") and (user.accountEnabled -eq true) and (user.mail -contains "@partnerbroker.com")
   ```
5. Click **Save**.
6. Select **Validate Rules (Preview)** -> Add test partner broker accounts to verify evaluation returns `true`.

#### Click-Path 3: Reprocessing Group Licenses
1. In the Entra admin center, navigate to **Identity** -> **Billing** -> **Licenses**.
2. Select **All products** -> click your **Microsoft Entra ID P2** license.
3. In the left menu, select **Licensed groups**.
4. Locate and check the box next to **`DG-Customs-Auditors`**.
5. In the top action toolbar, click **Reprocess**.

#### Click-Path 4: Enabling Multi-Factor Authentication via Conditional Access (Targeting Guests & Partners)
1. Sign in to the **Microsoft Entra admin center** (`https://entra.microsoft.com`) as a **Conditional Access Administrator** or **Security Administrator**.
2. Expand **Protection** -> select **Conditional Access** -> **Policies**.
3. Click **+ New policy**.
4. Name the policy: e.g., `CAP-Enforce-MFA-CustomsAuditors`.
5. Under **Users**:
   - Select **Include** -> Choose **Select users and groups** -> Check **Users and groups** -> Select `DG-Customs-Auditors` (or select **Guest or external users** -> check *B2B collaboration guest users* and *B2B collaboration member users*).
   - Under **Exclude** -> Always exclude at least one Break-Glass / Emergency Access Account.
6. Under **Target resources** (Cloud apps):
   - Select **All cloud apps** (or select specific apps like *Office 365* or *Azure Remote Management*).
7. Under **Access controls** -> **Grant**:
   - Select **Grant access**.
   - Check **Require multifactor authentication** (or **Require authentication strength** -> *Phishing-resistant MFA*).
   - Operator: *Require all the selected controls*.
8. Under **Enable policy**:
   - Toggle to **Report-only** (for initial baseline testing) or **On**.
9. Click **Create**.

#### Click-Path 5: Enabling MFA via Security Defaults (Entra ID Free Tier)
1. Sign in to **Microsoft Entra admin center** (`https://entra.microsoft.com`) as a **Global Administrator**.
2. Expand **Identity** -> select **Overview** -> **Properties**.
3. Scroll to the bottom of the Properties blade and click **Manage security defaults**.
4. In the side flyout panel, change **Security defaults** from *Disabled* to **Enabled**.
5. Click **Save**.
   *(Note: This enforces registration for all users within 14 days and requires MFA for admins on sign-in. Cannot be enabled if Conditional Access policies exist.)*

#### Click-Path 6: Activating Modern Authentication Methods (Microsoft Authenticator / FIDO2 / TAP)
1. Sign in to **Microsoft Entra admin center** (`https://entra.microsoft.com`) as an **Authentication Policy Administrator**.
2. Expand **Protection** -> select **Authentication methods** -> **Policies**.
3. To configure **Microsoft Authenticator**:
   - Click **Microsoft Authenticator**.
   - Set **Enable** to **On** and Target to **All users** (or selected pilot groups).
   - Click the **Configure** tab:
     - Set *Show application name in push notifications* to **Enabled**.
     - Set *Show geographic location in push notifications* to **Enabled**.
     - Verify *Require number matching for push notifications* is set to **Enabled** (enforced by default).
4. To configure **Temporary Access Pass (TAP)**:
   - Click **Temporary Access Pass** -> toggle **Enable** to **On** -> Target the required onboarding group.
   - Under **Configure**, set *Minimum lifetime* (e.g. 1 hour), *Maximum lifetime* (e.g. 8 hours), and *One-time use* preference.
5. Click **Save**.

---

### 8.2 Production PowerShell / Microsoft Graph Automation Scripts

```powershell
<#
=================================================================================
AZ-104 PRODUCTION SCRIPT: Cross-Tenant Onboarding, Fixing Guest usageLocation,
Configuring Dynamic Membership, and Updating Cross-Tenant Trust Settings
=================================================================================
#>

# 1. Install and Connect to Microsoft Graph
Install-Module Microsoft.Graph.Authentication -Scope CurrentUser -Repository PSGallery -Force
Install-Module Microsoft.Graph.Identity.SignIns -Scope CurrentUser -Repository PSGallery -Force
Install-Module Microsoft.Graph.Users -Scope CurrentUser -Repository PSGallery -Force
Install-Module Microsoft.Graph.Groups -Scope CurrentUser -Repository PSGallery -Force

Connect-MgGraph -Scopes @(
    "Policy.ReadWrite.CrossTenantAccess",
    "User.ReadWrite.All",
    "Group.ReadWrite.All",
    "Directory.ReadWrite.All"
)

# 2. Bulk Invite Guest Brokers with explicit usageLocation to prevent Licensing Errors
$brokers = @(
    @{ Name = "Customs Broker 1"; Email = "broker1@partnerbroker.com" },
    @{ Name = "Customs Broker 2"; Email = "broker2@partnerbroker.com" }
)

foreach ($broker in $brokers) {
    $invitationParams = @{
        InvitedUserEmailAddress = $broker.Email
        InvitedUserDisplayName = $broker.Name
        InviteRedirectUrl = "https://myapps.microsoft.com"
        SendInvitationMessage = $true
        InvitedUserType = "Guest"
    }
    
    $invitation = New-MgInvitation -BodyParameter $invitationParams
    Write-Host "Invited: $($broker.Email) [User ID: $($invitation.InvitedUser.Id)]" -ForegroundColor Cyan
    
    # CRITICAL: Explicitly set usageLocation immediately to prevent ProhibitedInUsageLocationViolation
    Update-MgUser -UserId $invitation.InvitedUser.Id -UsageLocation "US" -Department "Customs"
}

# 3. Configure Inbound Cross-Tenant Access Policy for partnerbroker.com
# NOTE: PartnerId strictly requires the partner's Entra Tenant GUID (not domain name).
# In production, query the partner tenant ID via: (Invoke-RestMethod "https://login.microsoftonline.com/partnerbroker.com/v2.0/.well-known/openid-configuration").token_endpoint.Split('/')[3]
$partnerTenantId = "72f988bf-86f1-41af-91ab-2d7cd011db47" # Partner Tenant GUID
$partnerDomain = "partnerbroker.com"

# Prepare Inbound Partner Policy with Inbound MFA Trust enabled
$partnerConfig = @{
    PartnerId = $partnerTenantId
    InboundTrust = @{
        IsMfaAccepted = $true
        IsCompliantDeviceAccepted = $false
        IsHybridAzureADJoinedDeviceAccepted = $false
    }
    B2bCollaborationInbound = @{
        UsersAndGroups = @{
            AccessType = "allowed"
            Targets = @(
                @{
                    Target = "AllUsers"
                    TargetType = "user"
                }
            )
        }
        Applications = @{
            AccessType = "allowed"
            Targets = @(
                @{
                    Target = "AllApplications"
                    TargetType = "application"
                }
            )
        }
    }
}

# Apply Organizational Setting in Cross-Tenant Access Policy
New-MgPolicyCrossTenantAccessPolicyPartner -BodyParameter $partnerConfig
Write-Host "Inbound MFA Trust successfully established for $partnerDomain ($partnerTenantId)" -ForegroundColor Green

# 4. Update Dynamic Group Rule to use 'mail' with exact match or -endsWith
# In Entra ID dynamic rules, -match or -endsWith is best practice for single-value strings like 'mail'
$targetGroup = Get-MgGroup -Filter "DisplayName eq 'DG-Customs-Auditors'"
if ($targetGroup) {
    $updatedRule = '(user.userType -eq "Guest") and (user.accountEnabled -eq true) and (user.mail -endsWith "@partnerbroker.com")'
    Update-MgGroup -GroupId $targetGroup.Id -MembershipRule $updatedRule -MembershipRuleProcessingState "On"
    Write-Host "Updated dynamic rule on DG-Customs-Auditors using -endsWith" -ForegroundColor Green
}

# 5. Trigger License Reprocessing on the Group
Invoke-MgGraphRequest -Method POST -Uri "https://graph.microsoft.com/v1.0/groups/$($targetGroup.Id)/reprocessLicense"
Write-Host "Triggered license reprocessing on DG-Customs-Auditors" -ForegroundColor Yellow
```

---

## Part 9: High-Yield AZ-104 Exam Traps & Real-World Gotchas

1. **Dynamic Group `match` vs `-contains`**:
   - `-contains` is a prefix/substring operator for string fields and array inclusion operator for multi-value collections.
   - For string properties like `mail`, `(user.mail -contains "@partnerbroker.com")` evaluates true for `alice@partnerbroker.com`.
   - On the exam, Microsoft often tricks candidates by setting the rule to `(user.userPrincipalName -contains "@partnerbroker.com")`. This **FAILS** for redeemed B2B guests because their UPN is altered to `user_partnerbroker.com#EXT#@resourcetenant.onmicrosoft.com`!
2. **SSPR Scoping Pitfall**:
   - In Microsoft Entra ID SSPR configuration, the options are: **None**, **Selected**, or **All**.
   - If **Selected** is chosen, you can select **only ONE group**.
   - If multiple departments need SSPR, you cannot select five separate security groups. You must create an umbrella group (or nested members, though SSPR does not evaluate nested groups reliably—a flat security group populated dynamically is required).
3. **Security Defaults vs Conditional Access**:
   - You cannot use both simultaneously. Enabling Conditional Access policies requires turning off Security Defaults.
   - If a scenario asks to enforce MFA for specific users on Entra ID Free, the answer is **Security Defaults** (which enforces it for everyone/admins), not Conditional Access (which requires P1).
4. **Group Licensing Nested Group Trap**:
   - If an exam question depicts Group Sales-US nested inside Group Sales-Global, and Group Sales-Global has an Entra ID P2 license assigned:
   - Question: *"Are users in Sales-US licensed?"*
   - Answer: **NO**. Direct membership is strictly required.
5. **UsageLocation Inheritance**:
   - Users created manually in the Azure Portal inherit the Tenant's country location if not specified.
   - Users created via PowerShell or Graph API **DO NOT** inherit tenant location; `usageLocation` remains `null`.
   - Any group licensing assignment targeting API-created users will throw `ProhibitedInUsageLocationViolation` until updated.
