# Microsoft Entra ID - Part 1: Core Identity Architecture & Foundations

---

## 1. The Two Universes of Microsoft Cloud

Microsoft Cloud is fundamentally divided into two isolated, independent planes:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   THE IDENTITY PLANE (Microsoft Entra ID)              │
│   • Admin Center: entra.microsoft.com                                  │
│   • Governs: WHO you are (Authentication, Passwords, MFA, Tokens)      │
│   • Objects: Users, Groups, App Registrations, Service Principals      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    │ 1-Way Trust Relationship
                                    │ ("Who is allowed to manage resources?")
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│              THE RESOURCE & BILLING PLANE (Azure Resource Manager)     │
│   • Portal: portal.azure.com                                           │
│   • Governs: WHAT exists (VMs, Storage, Networks, Databases, Billing)  │
│   • Hierarchy: Management Groups ──► Subscriptions ──► Resource Groups │
└────────────────────────────────────────────────────────────────────────┘
```

1. **The Identity Plane (Microsoft Entra ID):** Knows *who* an entity is. It manages users, checks passwords, validates MFA, evaluates Conditional Access policies, and issues signed JSON Web Tokens (JWT). It has no concept of virtual machines, storage disks, or credit card invoices.
2. **The Resource Plane (Azure Resource Manager / ARM):** Manages cloud hardware, deployments, and billing. It has no concept of passwords or user databases. When you deploy a VM, ARM delegates authentication to Entra ID: *"Did this user pass MFA, and what role does Entra say they have?"*

---

## 2. Tenants, Directories, and Domains

### What is a "Directory"?
In computer networking, a "Directory" is an identity database heavily optimized for lightning-fast reading, searching, and attribute lookup (originating from physical phone directories). Microsoft Entra ID is a multi-tenant cloud directory database.

### What is a "Tenant"?
A **Tenant** is a dedicated, completely isolated instance of Microsoft Entra ID provisioned for an organization when it signs up for Microsoft 365, Azure, or Dynamics.
* **Hard Isolation Boundary:** Tenant A cannot read, query, or modify Tenant B. Each tenant has a unique, permanent 36-character GUID called the **Tenant ID** (e.g. `0ed1ea11-a7a4-4961-bd7a-22ede3e8aaad`).
* **The Domain Requirement:** Because every human identity requires a standard RFC-compliant login namespace (`username@domain.com`), every Entra tenant must be bound to at least one DNS domain name.
  * **Initial Default Domain:** Microsoft automatically generates a free domain ending in **`.onmicrosoft.com`** (e.g., `contosocorp.onmicrosoft.com`).
  * **Custom Verified Domains:** Organizations add their public domain (e.g., `contoso.com`) by adding a DNS TXT verification record at their domain registrar (GoDaddy, Cloudflare, etc.). Once verified, users log in as `sarah@contoso.com`.

### Why Does an Azure Subscription "Trust" a Directory?
* A **Subscription** is a billing container. It defines who gets billed for cloud compute and enforces spending limits.
* A subscription **cannot maintain its own users**. It must trust **exactly ONE Entra ID tenant**.
* **The Rule of Trust:**
  * **1 Subscription $\rightarrow$ Trusts exactly 1 Tenant.**
  * **1 Tenant $\rightarrow$ Can be trusted by Many Subscriptions** (e.g., *Dev-Sub*, *Test-Sub*, *Prod-Sub*, *Billing-Sub* all trust the same corporate tenant).
* If an administrator transfers a subscription to a different Entra ID tenant, **all Role-Based Access Control (RBAC) role assignments are immediately wiped clean**, because the security principals (users and groups) from the old directory do not exist in the new directory.

### Why Would a Company Have Multiple Tenants?
95% of organizations only ever need one tenant. However, enterprise architects deploy multiple distinct tenants in three specific scenarios:
1. **Mergers, Acquisitions, and Divestitures:** Company A acquires Company B. Both keep their legacy tenants until identity consolidation takes place months or years later.
2. **Sovereignty & Regulatory Compliance:** Separate legal jurisdictions (e.g., US Department of Defense, Azure China operated by 21Vianet, or strict healthcare/financial data isolation requirements) mandate zero shared directory infrastructure.
3. **Tenant-Wide Isolation Sandboxing:** Certain configurations are **global to the entire tenant** (e.g., root Cross-Tenant Access Settings, B2B collaboration restrictions, Tenant-wide Conditional Access baseline policies). You cannot test changes to these settings inside a subscription—you need a separate, isolated tenant to test them safely.

---

## 3. The Identity Objects: Users, Members, and Guests

Inside the Entra ID directory, every entity is an object with an **Object ID** (GUID).

```
                            [ Entra ID Users ]
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
     MEMBER USER                                          GUEST USER
• Native internal employee                           • External partner / vendor
• UPN: sarah@contoso.com                             • UPN: bob_partner.com#EXT#@contoso.com
• Full directory read rights                         • Highly restricted directory rights
• Home tenant: Contoso                               • Home tenant: Partner company (B2B)
```

### 1. Member Users
* **Who they are:** Permanent employees of the organization.
* **User Principal Name (UPN):** Matches the company domain (`user@contoso.com`).
* **Permissions:** By default, Members have broad directory read permissions: they can search the Global Address List, view other employees, see group memberships, and view registered applications.

### 2. Guest Users (B2B Collaboration)
* **Who they are:** External contractors, auditors, suppliers, or partners (e.g., `auditor@deloitte.com`).
* **How B2B Works:**
  1. An admin invites `auditor@deloitte.com` to the Contoso tenant.
  2. Entra ID creates a user object with `UserType: Guest`.
  3. Notice the UPN format: `auditor_deloitte.com#EXT#@contoso.onmicrosoft.com`.
  4. **Authentication:** The auditor logs in using **their own Deloitte password and Deloitte MFA**. Deloitte’s identity provider signs a token, and Contoso’s tenant cryptographically trusts it. Contoso never knows or stores the auditor’s password!
* **Permissions:** By default, Guests have **restricted permissions**. They cannot browse the full list of company users or groups; they can only access the specific apps, files, or Azure resources explicitly shared with them.

---

## 4. External Identities: B2B vs. B2C

All external collaboration is unified under the **Microsoft Entra External ID** portfolio, but serves two radically different audiences:

| Feature | 🏢 B2B Collaboration | 🛒 B2C / Customer External ID |
| :--- | :--- | :--- |
| **Target Audience** | Business partners, vendors, contractors | Millions of retail consumers / mobile app shoppers |
| **Where Users Live** | Directly inside your **Corporate Tenant** as `Guest` | Inside a **Separate, Isolated Customer Directory** |
| **Identity Providers** | Other Entra ID tenants, Google Workspace, SAML | Google, Facebook, Apple, local email/password |
| **Access Scope** | Corporate apps (Teams, SharePoint, Azure Portal) | Only your specific consumer-facing website/app |
| **Why Separated?** | Partners collaborate with internal staff | **Never mix 5 million shoppers with corporate payroll!** |

### How Social Logins Work (Google / Facebook)
Google and Facebook **do not receive Service Principals** in your tenant. They are registered under **External Identity Providers**:
1. You register an OAuth app in Google Cloud Console or Meta for Developers to obtain a `Client ID` and `Client Secret`.
2. You save those credentials in Entra External ID under *Identity Providers*.
3. When a user clicks *"Sign in with Google"*, Entra redirects their browser to Google’s OAuth endpoints. Google authenticates the user and returns an OpenID Connect (OIDC) token. Entra verifies Google's cryptographic signature and issues an internal session token.

---

## 5. Applications: App Registration vs. Service Principal

This maps directly to classical Object-Oriented Programming:

$$\mathbf{App\ Registration} = \mathbf{The\ Class\ (Global\ Blueprint)}$$
$$\mathbf{Service\ Principal} = \mathbf{The\ Object\ Instance\ (Local\ Tenant\ Identity)}$$

```
                   [ App Registration ]
                   "InventoryApp v1"
                   (Created in Dev Tenant)
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [ Service Principal ]             [ Service Principal ]
    in Contoso Tenant                 in Fabrikam Tenant
   (Local Object ID: a1b2...)        (Local Object ID: c3d4...)
   (Has Contoso Storage RBAC)        (Has Fabrikam SQL RBAC)
```

1. **App Registration (The Blueprint):** The master definition of the application (Client ID, Redirect URIs, permissions requested).
2. **Service Principal (The Local Enterprise Account):** An application cannot type passwords or answer phone MFA. Entra ID instantiates a **Service Principal** in each tenant where the app runs. It has an **Object ID**, its own audit logs, and is the actual entity that receives Azure RBAC roles in *Access Control (IAM)*.
3. **Security Principal (Umbrella Term):** Any entity that can be assigned an Azure role:
   $$\mathbf{Security\ Principal} \in \{\text{User},\ \text{Group},\ \text{Service Principal},\ \text{Managed Identity}\}$$

---

## 6. Single-Tenant vs. Multi-Tenant Applications

```
                         [ App Registration ]
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
   SINGLE-TENANT                                     MULTI-TENANT
"Accounts in this directory only"             "Accounts in ANY Entra ID directory"
• Used for internal corporate apps            • Used when building commercial SaaS
• Microsoft blocks external users             • Users from Nike, Amazon, or Contoso
  at the login screen                         • 1 App Registration ──► Many Service Principals
```

* **Single-Tenant (Default):** Only users inside the registering directory can authenticate. If `bob@external.com` tries to sign in, Microsoft blocks them at the door. (Best for internal company portals like `payroll.mycompany.com`).
* **Multi-Tenant:** Users from **ANY** Microsoft Entra ID tenant in the world can authenticate against their home tenant and access the app. (Best for commercial SaaS software like Zoom, Slack, Snowflake).

---

## 7. Permissions: Delegated vs. Application (OAuth 2.0)

```
                            [ API Request to Azure ]
                                       │
           ┌───────────────────────────┴───────────────────────────┐
           ▼                                                       ▼
   DELEGATED PERMISSIONS                               APPLICATION PERMISSIONS
  ("On Behalf Of a User")                                ("Direct App Identity")
• Human user is actively signed in.                   • No human user present.
• User proves identity with MFA.                      • Background daemons, nightly crons.
• Token contains: appid + user oid.                   • Token contains: appid only.
• Effective Rights = Intersection                     • Effective Rights = Full assigned
  (App Rights ∩ User Rights).                           application role permissions.
• App can NEVER exceed the user's rights!             • Requires Tenant Admin Consent!
```

* **Delegated Permissions:** Used when a human is present. The token carries both the Application ID and the User ID. The app’s effective permissions are strictly the **intersection** of what the app is granted AND what the signed-in user is permitted to do.
* **Application Permissions:** Used for headless background services, daemons, and sync scripts running without a user. The app operates with full assigned authority and strictly mandates **Admin Consent** from a Global Administrator.

---

## 8. Machine Credentials: How Service Principals Authenticate

1. **Client Secret (Symmetric Key):** A randomized alphanumeric password generated in the portal. High security risk if committed to code repositories.
2. **Certificate (Asymmetric Cryptography):** An X.509 public/private key pair. Public key uploaded to Entra ID; private key held securely on the server.
3. **Federated Credentials (Workload Identity Federation - 2026 Gold Standard):** **Zero stored secrets!** Direct OpenID Connect (OIDC) trust established with **GitHub Actions**, **GitLab**, or **Kubernetes**. GitHub sends a signed token to Entra ID; Entra ID exchanges it for a 1-hour Azure access token. No passwords ever exist to be stolen!

---

## 9. Managed Identities for Azure Resources

A **Managed Identity IS a Service Principal** whose credential lifecycle is 100% managed by Azure behind the scenes. Zero secrets stored in configuration files!

```
       [ Azure Virtual Machine ]
                  │
                  │ 1. Asks local metadata endpoint for a token:
                  │    http://169.254.169.254/metadata/identity/oauth2/token
                  ▼
       [ Azure Internal IMDS ]
                  │
                  │ 2. Communicates over private fabric to Entra ID
                  ▼
       [ Microsoft Entra ID ]
                  │
                  │ 3. Issues short-lived Access Token back to VM
                  ▼
       [ Azure Virtual Machine ]
                  │
                  │ 4. Uses token to call Azure Key Vault or Storage!
                  ▼
       [ Azure Storage Account ]
```

### System-Assigned vs. User-Assigned Managed Identities

| Property | ⚙️ System-Assigned | 👤 User-Assigned |
| :--- | :--- | :--- |
| **Creation** | Enabled directly via a toggle on the Azure resource | Created as an independent, standalone Azure resource |
| **Relationship** | **1-to-1** (Tied strictly to that single resource) | **1-to-Many** (Can be attached to multiple resources) |
| **Lifecycle** | **Tied:** If you delete the VM, Azure deletes the identity! | **Independent:** Deleting the VM leaves the identity intact. |
| **Best Used For** | Single workloads with unique permissions | Fleets of identical VMs (e.g. a 20-node web scale set) |
