# AZ-104 Master Guide: Azure Role Assignment Conditions (Azure ABAC)

**Domain 1: Manage Azure Identities and Governance & Domain 2: Implement and Manage Storage**  
*Reference Standard: 2026 Definitive Edition*

---

## 🎯 30-Second Exam Cheat Sheet
* **What is ABAC:** Adding fine-grained conditional filters to an existing RBAC role assignment.
* **Supported Storage Services:** Supported on **Blob Storage (containers & blobs)** and **Queue Storage** ONLY. (Azure Files and Tables do **NOT** support conditions!).
* **The Disjunction Pattern:** `(Action != write) OR (Constraint)` means **all reads are 100% permitted**; the constraint only restricts write operations.
* **Attribute Sources:**
  * Request (`@Request`): path, container name, snapshot ID.
  * Resource (`@Resource`): Blob Index Tags (key-value pairs indexed on blobs).
  * Principal (`@Principal`): Microsoft Entra ID Custom Security Attributes.

---

## 1. Why Does Azure ABAC Exist?
Traditional Azure RBAC grants access based strictly on Scope (Management Group, Subscription, Resource Group, Resource).

* **The Problem:** In an account with 500 containers, allowing access to 20 containers required 20 individual role assignments. Azure subscriptions cap role assignments at **4,000**.
* **The ABAC Solution:** Assign the role **once** at the storage account scope with a condition:
  `@Request[container:name] == 'archive'`.

---

## 2. Supported Services & Resource Providers

| Azure Service | Supports Role Conditions? | Key Supported Actions |
|---|:---:|---|
| **Azure Blob Storage** | ✅ **YES** | Read, Write, Delete, Delete Version, Add Blob, Create Container |
| **Azure Queue Storage** | ✅ **YES** | Read, Add, Delete, Update Messages |
| **Azure Files** | ❌ **NO** | Not supported (Exam Distractor!) |
| **Azure Tables** | ❌ **NO** | Not supported (Exam Distractor!) |

---

## 3. The Boolean Logic Engine: The "Action != Write" Trap
A standard Azure template for restricting writes while allowing reads:

$$\text{RuleBeta} = (\text{Action is NOT a blob-write}) \;\mathbf{OR}\; (\text{Blob path contains '2'})$$

```
                            User requests READ on file1.dat
                                         │
                   Is the operation a write action?
                       /                       \
                     YES                       NO
                     /                           \
         Clause 1 = FALSE                    Clause 1 = TRUE
                 │                                   │
      Must check Clause 2:                  Condition SATISFIED!
    Does path contain '2'?               (TRUE or Anything = TRUE)
      /              \                               │
    YES              NO                              ▼
  Allowed          DENIED                      ACCESS GRANTED
```

### Why is `OR` used?
If written without `Action != write`, the path restriction would block reading any file that doesn't contain '2'. Adding `(Action != write) OR` ensures **reads are completely unrestricted** and the condition only gates writes.

---

## 4. Deep Walkthrough: Shireen Khan Questions 2, 3 & 4
* `storagenorth`: container `archive` (`file1.dat`), container `media` (`file2.dat`).
* `storagesouth`: container `archive` (`file3.dat`).
* **Priya:** `Storage Blob Data Reader` with `(action != read) OR (container == 'archive')`.
* **Sam:** `Storage Blob Data Owner` with `(action != write) OR (path contains '2')`.

| Question | Operation | Clause 1 | Clause 2 | Result | Verdict |
|---|---|:---:|:---:|:---:|:---:|
| **Q2:** Priya reads `file2.dat` | `media/file2.dat` (Read) | FALSE | FALSE | **FALSE** | ❌ **Denied** (Answer: False) |
| **Q3:** Priya reads `file3.dat` | `archive/file3.dat` (Read) | FALSE | TRUE | **TRUE** | ✅ **Allowed** (Answer: True) |
| **Q4:** Sam reads `file1.dat` | `archive/file1.dat` (Read) | **TRUE** | FALSE | **TRUE** | ✅ **Allowed** (Answer: True) |
