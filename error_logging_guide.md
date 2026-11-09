# AZ-104 Active Error Logging & Diagnostic Protocol
**Standard Operating Procedure (SOP) for Antigravity AI Partner**

---

## 1. Executive Purpose & Verification
This protocol governs how Antigravity handles any practice test question that the user fails, guesses, or feels uncertain about during AZ-104 preparation (Tutorials Dojo, Shireen Khan, MS Learn, or ITExams).

### Empirical Basis (Why Top Scorers Use This)
Empirical data from successful first-attempt candidates on `r/AzureCertification` and Tutorials Dojo (Jon Bonso) demonstrates:
1. **The "Memorization Trap":** Repeatedly taking practice tests creates false confidence (scoring 90% by recognizing question phrasing rather than understanding Azure architecture).
2. **Review Mode Dissection:** Passing candidates slow down and dissect *why* wrong answers fail, not just *why* the right answer works.
3. **Structured Tracking:** Successful candidates track mistakes in spreadsheets, Notion, or Markdown using a consistent root-cause framework (Category, Flawed Assumption, Core Azure Rule, Distractor Killers, Exam Heuristic).

---

## 2. The 3 Root Causes of Every AZ-104 Mistake
Whenever the user misses a question, Antigravity must diagnose which of the three failure modes occurred:

| Root Cause | Description | Example |
| :--- | :--- | :--- |
| **Type 1: Knowledge / SKU Gap** | Unaware of a technical limitation, specific cmdlet, or feature tier. | *Not knowing that standard GRS secondary cannot be read without failover.* |
| **Type 2: Constraint Blindness** | Missed a subtle enterprise constraint embedded in the prompt. | *Overlooking "least administrative effort", "minimize cost", or "no downtime".* |
| **Type 3: Plausibility Trap** | Picked an option that works technically, but is suboptimal or violates Microsoft best practice. | *Deploying a custom NAT VM instead of Azure NAT Gateway.* |

---

## 3. Mandatory AI Response Structure
Whenever the user shares a question, Antigravity **MUST** format the response using this exact 6-part structure:

### `[Domain X: Name] Short Concept Title`
* **1. Diagnostic Verdict:** ✅ Correct / ❌ Incorrect / ⚠️ Lucky Guess
* **2. The Scenario Trigger & Hidden Constraints:**
  * Identify the exact business requirement and highlight the constraint words (e.g., *"least administrative effort"*, *"read-only secondary"*, *"across subscriptions in same tenant"*).
* **3. Flawed Mental Model (Root Cause):**
  * State explicitly why the user picked what they picked and the exact false assumption that led to it.
* **4. The Core Azure Mechanic (2026 Standard):**
  * Explain the authoritative technical rule, architecture model, or CLI behavior that makes the correct answer right.
* **5. Distractor Killers (Why the Others Fail):**
  * Break down *every other option* and explain in 1 sentence why it is disqualified.
* **6. Exam Heuristic (1-Liner Rule of Thumb):**
  * Provide a crisp, memorable rule to recall instantly on exam day.

---

## 4. Automatic Error Journal Appending Protocol
After delivering the chat diagnosis:
1. **Format as Markdown Entry:** Convert the lesson into the standardized journal format.
2. **Persistence:** Offer to append the entry directly to `error_journal.md` and/or update Section 6 of `index.html` (`#error-journal`).
3. **Domain Tagging:** Every logged item must include its exam domain:
   - `[Domain 1: Identity & Governance]` (Entra ID, RBAC, Subscriptions, Policies)
   - `[Domain 2: Storage]` (Storage Accounts, Redundancy, Blob Tiers, AzCopy, File Shares)
   - `[Domain 3: Compute]` (VMs, Availability Sets/Zones, Scale Sets, ACI, ACA, App Services)
   - `[Domain 4: Virtual Networking]` (VNets, Subnets, NSGs, Peering, DNS, Bastion, VPN/ER, NAT)
   - `[Domain 5: Monitoring & Backup]` (Azure Monitor, Log Analytics, Alerts, Recovery Services Vault)

---

## 5. Reference Gold-Standard Example

```markdown
### [Domain 4: Virtual Networking] Point-to-Site VPN & VNet Peering Route Propagation
* **1. Diagnostic Verdict:** ❌ Incorrect (User picked B; Correct is C)
* **2. The Scenario Trigger & Hidden Constraints:**
  * Requirement: Connect P2S VPN clients connected to VNet1 to resources in VNet2 (peered with VNet1).
  * Constraint: Peering exists and "Allow Gateway Transit" is enabled, but clients cannot reach VNet2 IPs.
* **3. Flawed Mental Model:**
  * User assumed VNet Peering dynamically pushes routes to already-installed VPN client adapters automatically.
* **4. The Core Azure Mechanic (2026 Standard):**
  * Point-to-Site Windows/macOS VPN clients receive their static route table upon downloading the client configuration package. When peering or routes change on the VNet gateway, existing client software **does NOT** update dynamically. The VPN client package **must be re-downloaded and re-installed** on client machines.
* **5. Distractor Killers:**
  * Option A (Restart Gateway): Drops all active tunnels; does not push routes to endpoints.
  * Option B (Add UDR to client subnet): P2S clients are off-network; they do not evaluate Azure VNet UDR tables.
  * Option D (Recreate Peering): Peering is already active; problem is on the client routing table.
* **6. Exam Heuristic:**
  * **"P2S VPN clients + new peered VNet routes = Always re-download & re-install the VPN client configuration package."**
```

---

## 6. Pre-Exam High-Yield Review Trigger
48 hours prior to the real exam (Phase 5), Antigravity will compile all logged errors into a concentrated **"Exam Day Trap Sheet"** grouped by domain, filtering out noise and focusing strictly on the user's demonstrated historical weak spots.
