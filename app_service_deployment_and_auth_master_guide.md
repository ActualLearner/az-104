# AZ-104 Master Guide: App Service Deployment & Authentication Architecture

**Domain 3: Deploy and Manage Azure Compute Resources**  
*Reference Standard: 2026 Definitive Edition*

---

## 🎯 30-Second Exam Cheat Sheet
* **Developer Least Privilege:** Always assign **`Website Contributor`** (never Owner or general Contributor).
* **Modern Deployments:** **Web Deploy + Microsoft Entra ID** (OAuth Bearer token over Port 443). Enforces MFA and RBAC.
* **Legacy Deployments:** **FTP / FTPS & Publishing Profiles** use Basic Authentication (static passwords). Insecure, no MFA, high blast radius.
* **Modern Security Baseline:** Disable Basic Authentication via `basicPublishingCredentialsPolicies/ftp` and `basicPublishingCredentialsPolicies/scm`.
* **SCM vs SCIM:**
  * **SCM (Source Control Management):** App Service Kudu engine (`*.scm.azurewebsites.net`) for code deployment.
  * **SCIM (System for Cross-domain Identity Management):** Entra ID protocol to auto-provision user accounts into SaaS apps (Slack, Salesforce).

---

## 1. Under-the-Hood Architecture: Public Site vs. SCM Twin
Every Azure App Service web app (`PortalApp`) consists of two endpoints backed by a shared storage mount:
1. **Public Workload Endpoint:** `https://portalapp.azurewebsites.net` (Customer-facing HTTP/HTTPS traffic).
2. **Management SCM Twin:** `https://portalapp.scm.azurewebsites.net` (Administrative backdoor powered by **Kudu**).

### File System Layout
* Windows: `C:\home\site\wwwroot\`
* Linux: `/home/site/wwwroot/`
All deployments (Web Deploy, Git, ZIP, FTP) simply synchronize files from a local machine or repository into the `wwwroot` directory.

---

## 2. FTP vs. FTPS: Protocol Breakdown & Flaws

| Protocol | Ports Used | Transport Encryption | Auth Mode | Exam Assessment |
|---|---|---|---|---|
| **Plain FTP** | Port 21 | ❌ Plaintext (Zero encryption) | Username + Password | **Forbidden:** Transmits credentials and code cleartext over internet. |
| **FTPS** | Port 990 / 21 | ✅ Encrypted via TLS | Username + Password | **Legacy / Insecure:** Encrypted in flight, but uses Basic Auth with zero MFA support. |

### Why FTPS is Rejected in Enterprise Questions:
1. **No Microsoft Entra ID Integration:** Cannot authenticate using corporate identity tokens.
2. **No Multi-Factor Authentication (MFA):** FTP clients cannot handle authenticator app prompts or push notifications.
3. **No Granular Scoping:** An FTP account has unrestricted read/write/delete access across all files in `wwwroot`.

---

## 3. Web Deploy (MSDeploy)
* **Protocol:** HTTPS over standard Port **443** connecting to `https://<app>.scm.azurewebsites.net/msdeploy.axd`.
* **Delta Synchronization:** Compares local binaries against remote files and only uploads byte-level changes.
* **Authentication:** Can authenticate natively using **Microsoft Entra ID access tokens**, satisfying zero-trust governance.

---

## 4. Credential Tiers in Azure App Service

```
1. Microsoft Entra ID (Recommended):
   Developer (alice@corp.com) ──[Entra ID MFA]──> OAuth Token ──> Web Deploy (Port 443) ──> App Service
   (Audited, Least Privilege, Zero Static Passwords)

2. Application-Level Credentials (Publishing Profile):
   Developer ──[*.PublishSettings XML File with $app password]──> App Service
   (Scoped to 1 App, Static Password, No MFA)

3. User-Level Deployment Credentials:
   Developer ──[Single Username/Password set in Portal]──> ANY App Service in Subscription
   (High Blast Radius, Subscription-wide, Legacy)
```

---

## 5. Built-in RBAC Matrix for App Service

| Role | Deploy Code? | Restart Web App? | Modify App Config? | Scale Plan? | Least Privilege For |
|---|:---:|:---:|:---:|:---:|---|
| **Website Contributor** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No | **Application Developers** |
| **Web Plan Contributor** | ❌ No | ❌ No | ❌ No | ✅ Yes | **Infrastructure Engineers** |
| **Contributor** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | Full management (Over-privileged) |
| **Owner** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | Subscription Admins (Can assign roles) |

---

## 6. SCM vs. SCIM Disambiguation
* **SCM:** **Source Control Management** (App Service Kudu engine). Receives code deployments and provides debug tools.
* **SCIM:** **System for Cross-domain Identity Management** (Entra ID user provisioning protocol for SaaS apps).

---

## 7. Exam Scenarios & Distractor Killers
* **Scenario:** *"Developers must deploy updates to PortalApp using Web Deploy. Must authenticate with their Microsoft Entra ID accounts following least privilege."*
  * ❌ *Owner / Contributor:* Violates least privilege.
  * ❌ *User-level FTPS Credentials:* Uses basic auth, subscription-wide blast radius, no Entra ID.
  * ❌ *Application-level FTPS Credentials:* Does not use Entra ID accounts, lacks MFA.
  * ✅ **Website Contributor:** The exact role designed for deploying code without granting administrative permissions.
