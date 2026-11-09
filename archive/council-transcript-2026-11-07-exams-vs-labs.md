# LLM Council Transcript: Practice Exams vs. Labs, Shireen Khan Gating & Post-Video Strategy
**Date:** 2026-11-07  
**Topic:** Whether to do hands-on labs vs. practice exams after finishing the video course, how to sequence Tutorials Dojo, Shireen Khan, and MS Learn, and how to bridge the lack of manual labbing.

---

## 1. Original User Prompt
> "can you run a council and ask them, whether i should move to doing practice exams(while telling them exactly how many i have(basically i have a udemy premium which means i have any udemy course/practice assessment including shireens, i also have microsoft learns which is probably one 50 uestion set before it becomes repetitive and also tutorial dojo 20 question))tell them and ask them whether i should move to labs, or practice exam and diagnostic and correcting myself and learning through it? I did watch all of alan's course in 2x, but i did get somehow familiar with the portal through his videos, but obviously less than what i would have if i did the labs. Should I simply move to exams? Also I'm planning on taking shireens exams last, i want them to act as a final gate to determine whether im ready so i think i should search for other good udemy assessments to test myself as preliminary gates before i move to shireens. What does ocuncil think of all this"

---

## 2. Framed Question
**Candidate Situation:**
- Completing Alan Rodrigues video course (passive-watched at 2x).
- Visual portal familiarity from videos, but **zero manual hands-on labbing** in an active Azure subscription.
- Resources on hand:
  1. Udemy Premium (access to all Udemy AZ-104 practice exams, including Shireen Khan).
  2. MS Learn official practice assessment (~50 question pool, repeats quickly).
  3. Tutorials Dojo (Jon Bonso).
- Hard constraint: Microsoft ESI voucher expires in 4 weeks (~Dec 5–10, 2026). No extensions possible. Passing score: 700/1000.

**The Core Decisions Evaluated:**
1. **Labs vs. Diagnostic Practice Exams:** Should the candidate complete the 14 Microsoft official GitHub labs first, or immediately transition to practice exams and learn via diagnostic error correction? Is moving straight to exams viable with only 2x video familiarity?
2. **Practice Exam Sequencing & Gating:** The candidate proposes saving Shireen Khan's exams for the very end as a "final readiness gate" and shopping for additional Udemy practice exams as preliminary gates. Is this sequence sound?
3. **The "Zero Hands-On" Bridge:** How can the candidate compensate for lack of manual labbing without burning dozens of hours following lab manuals?

---

## 3. Independent Advisor Responses

### Advisor 1: The Contrarian
Passive-watching videos at 2x with zero hands-on experience has given you an illusion of competence, not operational knowledge. The fatal flaw in your plan isn't skipping 40 hours of open-ended GitHub labs—a massive time sink four weeks out—it's assuming you can pass AZ-104 by brute-forcing practice test answer keys.

AZ-104 punishes passive learners with multi-step case studies, subtle scope hierarchies, and exact drop-down blade configurations.

1. **Saving Shireen Khan for the end is strategic suicide.** If Shireen’s brutal traps shatter your confidence one week before your voucher expires, you have zero runway to remediate. Unmask your blind spots now, not at the finish line.
2. **Shopping for more Udemy tests is productive procrastination.** You already own Tutorials Dojo, the gold standard for AZ-104 question fidelity and architectural explanations. Adding random Udemy question banks dilutes quality and trains you to memorize stems instead of core mechanics.
3. **"No manual labbing" cannot mean "never opening the Portal."** Treat the Azure Portal as your dictionary. When you miss a question on Tutorials Dojo, open a free Azure tier, navigate directly to that blade, and inspect the actual configuration tabs, constraints, and toggles. Don't deploy anything costly—just verify the UI layout with your own eyes.

Stop consuming; start active retrieval. If you treat tests as passive grading gates rather than aggressive diagnostic dissections coupled with live portal verification, your voucher is dead money.

### Advisor 2: The First Principles Thinker
You are asking about study tactics, but the fundamental issue is information encoding: **AZ-104 does not test operational muscle memory; it tests constraint satisfaction and state navigation under Microsoft's rules.**

The belief that you must choose between "following 30 hours of lab recipes" and "grinding practice exams" is a false dichotomy. Following step-by-step GitHub labs provides abysmal cognitive yield per hour—you mindlessly copy-paste parameters into the Portal. But doing practice exams blindly just leads to stem memorization.

Rebuild your strategy from first principles:
1. **What the exam measures:** Mapping business constraints (redundancy, SLA, RBAC inheritance, network peering boundaries) to specific Azure mechanisms and drop-down hierarchies.
2. **The role of the Portal:** Under a 4-week hard deadline, the Azure Portal should not be treated as a construction site. Treat it as an **interactive dictionary**.
3. **The execution:** Move directly to practice exams, but adopt **reverse-engineered inspection**. When an exam question discusses conditional access, storage lifecycle tiers, or network security rules, open the free Portal and physically navigate to that blade. Inspect the toggles, examine which fields grey out when an option is selected, and verify the constraint logic with your own eyes. You do not need to incur deployment costs or waste hours configuring prerequisites to observe how Azure presents configuration state.

**The Sequence:**
- **Weeks 1–2:** **Tutorials Dojo.** It mirrors Microsoft's real structural logic and constraint models far better than raw question dumps.
- **Week 3:** **MS Learn Practice Assessment + targeted Portal verification** on your bottom three domains.
- **Week 4:** **Shireen Khan.** Use it strictly as an adversarial stress-test for trick questions, not as an initial gatekeeper that shatters your mental model.

Stop trying to "do labs." Use the Portal purely as a verification engine for practice misses.

### Advisor 3: The Expansionist
Skip the slow manual labs entirely—you are sitting on a massive velocity advantage that most candidates squander. Step-by-step portal labbing is low-yield click-ops. Moving directly into aggressive, forensic exam diagnostics is vastly superior: it compresses months of multi-tier enterprise architecture into four high-octane weeks, and positions you to immediately parlay your momentum into the AZ-305 (Solutions Architect Expert).

Here is the multiplier strategy:
1. **Exams as high-density architecture labs:** Moving straight to exams is not just viable; it’s the highest-ROI path. Start immediately with **Tutorials Dojo in Review Mode**. Every missed question or lucky guess exposes architectural mechanics far faster than clicking through a 45-minute MS Learn lab just to provision a single Bastion host. The explanations, topological diagrams, and CLI/JSON snippets in TD provide 20x the scenario breadth per hour.
2. **The Sequence as a compounding engine:** Use Tutorials Dojo to establish fast pattern recognition across networking, identity, and governance. Then hit Shireen Khan. Don’t treat Shireen as a fragile pass/fail gate—treat it as a mental stress-chamber. Wrestling with those brutal edge cases expands your analytical ceiling so significantly that the actual AZ-104 will feel shockingly easy. 
3. **Bridge the lab gap with surgical inspection:** Don't waste time deploying dummy infrastructure from scratch. When a question confuses you, open the Azure Portal (or MS Learn documentation) strictly to inspect blade hierarchies, parameter tabs, and PowerShell cmdlets. You aren't building; you are scouting terrain.

Stop thinking about merely scraping a 700 to save an expiring voucher. Run this diagnostic loop relentlessly, demolish AZ-104 with room to spare, and ride that exact technical foundation straight into your Solutions Architect certification.

### Advisor 4: The Outsider
Looking at this from the outside, you have 28 days, a hard deadline, and an illusion of competence from playing videos at double speed. You cannot afford a sprawling lab curriculum now. 

You aren't preparing to be an enterprise administrator tomorrow; you are preparing to pass a specific exam. Take practice tests immediately. Doing open-ended GitHub labs without knowing your weak spots is like reading an entire dictionary to prepare for a crossword puzzle. Practice exams provide immediate diagnostic data: they expose precisely what you don't know so you don't waste time studying what you do.

Your biggest tactical mistake is saving the hardest test for last. Why wait until days before an unextendable deadline to discover you fall for word traps? If Shireen Khan exposes how the exam tricks candidates, you need that humiliation in Week 2, not Week 4. Saving it for the end turns it into an autopsy with no runway to fix your weaknesses.

Sequence them aggressively:
1. **Tutorials Dojo**: Start here to establish your baseline and learn scenario explanations.
2. **Shireen Khan**: Introduce this by mid-prep (Week 2/3) to inoculate yourself against brutal edge cases and ambiguous wording.
3. **MS Learn Assessment**: Use concurrently to calibrate against Microsoft’s official phrasing and format.

To handle zero manual labbing without burning hours, use "surgical inspection." Whenever you miss an exam question about a routing table, identity setting, or backup policy, open the free Azure portal and spend exactly two minutes navigating to that blade. Look at the real drop-downs, visually anchor where the toggles live, and close the tab. Do not build infrastructure; simply inspect the UI where you got tricked.

### Advisor 5: The Executor
Monday morning at 8 AM, do not touch a lab manual. With 28 days and a hard voucher cutoff, setting up official GitHub labs is a massive time sink that will kill your momentum. Moving directly to practice exams is your only viable execution path.

Here is your exact operational sequence:

**Weeks 1 and 2: Tutorials Dojo (Review Mode)**
Open Tutorials Dojo immediately. TD gives the cleanest explanations, comparison tables, and portal screenshots. Work in Review Mode so feedback is instantaneous. Cycle one full 60-question block every two days:
- Day A: Complete 60 questions under realistic timing.
- Day B: Dissect every missed question and every lucky guess. Log the core concept gap into a simple spreadsheet.

**How to handle zero labbing:**
Do not build full environments. Use "micro-click verification." When an exam question hinges on a blade hierarchy or setting dependency (e.g., VNet peering settings, Private Endpoint DNS integration, or Azure Backup policies), log into a free Azure sandbox or Portal session, manually click the exact 3-step navigation path to inspect the blade, and close the tab. Three minutes per gap, zero infrastructure overhead.

**Week 3: MS Learn Practice Assessment & Weak Spot Drills**
Run the MS Learn 50-question bank 2–3 times. It uses Microsoft's actual question engine, familiarizing you with their precise phrasing, drag-and-drop mechanics, and hot-area questions. Use your error log from Weeks 1–2 to drill your two weakest domains (typically Networking and Identity).

**Week 4: Shireen Khan (Final Stress Test)**
Take Shireen Khan 7–10 days out. Expect word traps and scores in the 65–75% range. Do not panic; use it strictly as mental stamina training for dense case studies.

Stop watching videos. Open Tutorials Dojo Test 1 tomorrow morning.

---

## 4. Peer Reviews (Anonymized Round)

**Anonymization Mapping:**
- Response A = The Contrarian
- Response B = The First Principles Thinker
- Response C = The Expansionist
- Response D = The Outsider
- Response E = The Executor

### Reviewer 1
1. **Strongest: Response D.** It provides the cleanest strategic sequence. Unlike B and E—which warn against late shocks yet still place Shireen Khan in Week 4—D correctly forces Shireen into Weeks 2–3 so blind spots can actually be remediated. It also gives realistic, time-boxed portal inspection rules without infrastructure overhead.
2. **Biggest blind spot: Response C.** It dangerously reframes passive 2x video skimming as a "massive velocity advantage" rather than severe cognitive debt. It minimizes the penalty of lacking operational depth on complex case studies and ignores the candidate's impulse to shop for more Udemy tests.
3. **What ALL five missed:**
- **In-exam MS Learn access:** Role-based Azure exams now include live access to MS Learn. Candidates must practice rapid documentation search/lookup under timed conditions rather than memorizing obscure configurations.
- **PowerShell, CLI, and ARM/Bicep templates:** Visual portal clicking completely ignores CLI syntax and JSON/Bicep parameters, which appear frequently in drop-down and drag-and-drop questions.

### Reviewer 2
1. **Strongest: Response E.** It provides an actionable, disciplined operational cadence (Day A/B testing cycle, spreadsheet tracking) and calibrates expectations by noting Shireen Khan scores in the 65–75% range are normal, preventing panic.
2. **Biggest Blind Spot: Response C.** It dangerously validates the candidate’s passive 2x video viewing as a "massive velocity advantage" instead of warning about the illusion of competence. It also ignores the candidate's urge to test-shop on Udemy and offers vague hype instead of rigorous structure.
3. **What ALL Five Missed:**
- **PowerShell & Azure CLI:** AZ-104 heavily tests command-line syntax, parameters, and JSON templates via drag-and-drop/dropdowns. Pure Portal blade verification leaves candidates completely blind to CLI mechanics.
- **In-Exam MS Learn Resource:** Microsoft role-based exams now allow live access to MS Learn. Practicing rapid documentation lookup during timed diagnostics is a critical tactical skill none of the advisors mentioned.

### Reviewer 3
1. **Strongest: Response D.** It provides the sharpest strategic correction to the candidate's sequencing flaw. While B and E leave Shireen Khan in Week 4—risking a demoralizing late autopsy—D correctly pulls it forward to Week 2/3 so uncovered weaknesses can actually be remediated before the deadline. It also provides a clear, time-boxed rule for surgical portal inspection.
2. **Biggest Blind Spot: Response C.** It dangerously flatters the candidate by reframing passive 2x viewing and zero manual experience as a "massive velocity advantage." It also provides no actionable schedule and completely ignores the candidate's question about shopping for additional Udemy tests.
3. **What ALL five responses missed:**
- **In-Exam Microsoft Learn Access:** AZ-104 permits searching official MS Learn documentation during the live exam. Candidates relying on visual memory should practice rapid doc-searching during timed exams to look up exact SKU constraints, blade paths, and PowerShell syntax.
- **Booking Logistics:** None advised booking the exam slot immediately; waiting until Week 4 risks finding no available test slots before the voucher expires.

### Reviewer 4
1. **Strongest: Response D.** It delivers the sharpest tactical sequencing by pulling Shireen Khan into Weeks 2–3, giving the candidate actual runway to remediate gaps. In contrast, B and E contradict their own advice by still relegating Shireen to Week 4.
2. **Biggest Blind Spot: Response C.** It dangerously frames 2x passive video watching as a "massive velocity advantage" rather than a severe illusion of competence, and completely ignores the candidate's question about purchasing additional Udemy practice tests.
3. **What ALL five missed:** Microsoft role-based exams (including AZ-104) now include **built-in access to MS Learn during the live exam**. In a 4-week crunch, learning how to rapidly search official documentation under time constraints is a vital scoring lifeline—especially for PowerShell/CLI syntax, JSON templates, and SKU limits that quick portal browsing will not teach.

### Reviewer 5
1. **Strongest: Response D.** D provides the sharpest tactical correction. Unlike B and E—which leave Shireen Khan in Week 4—D fixes the candidate’s flawed sequencing by pulling Shireen into Weeks 2–3. This grants genuine runway to remediate brutal blind spots rather than facing an eleventh-hour confidence crisis.
2. **Biggest Blind Spot: Response C.** C exhibits reckless optimism. Framing passive 2x video watching as a "massive velocity advantage" dangerously trivializes AZ-104's complexity. Moreover, C offers zero concrete timeline, scheduling cadence, or safety margin for a candidate on a strict 28-day clock.
3. **What ALL Five Missed:**
- **In-exam open-book access to MS Learn:** Microsoft role-based exams now provide live access to MS Learn during the test. For a candidate with visual recognition but no muscle memory, learning how to rapidly search MS Learn during practice tests to verify SKU limits, governance scopes, and PowerShell/CLI syntax is a crucial, high-yield exam skill none of the advisors addressed.

---

## 5. Chairman Synthesis & Final Verdict

### Where the Council Agrees
1. **Hard NO on the 14 GitHub Labs:** All 5 advisors and all 5 reviewers unanimously agree: do **NOT** attempt the 14 open-ended Microsoft GitHub labs. Doing so burns 30–40 hours following click-recipes without knowing where your actual conceptual gaps lie. Under a 4-week voucher deadline, moving directly to diagnostic practice exams is mandatory.
2. **The "Portal as an Interactive Dictionary" Concept:** To bridge the zero hands-on gap without getting bogged down in infrastructure setup, use **surgical micro-click inspection**:
   - When a practice test question exposes a gap (e.g., storage lifecycle tiers, Conditional Access controls, VNet peering flags, Private DNS links), log into the free Azure Portal for **2–3 minutes**.
   - Navigate to that exact blade, examine the toggles, see which fields grey out, and visually anchor the hierarchy. Do not deploy resources; inspect the terrain.
3. **Stop Test-Shopping on Udemy:** Shopping for random extra Udemy test banks is "productive procrastination." Tutorials Dojo and Shireen Khan are the two most authoritative resources in existence for AZ-104. Adding unvetted banks dilutes your focus and trains stem memorization.

### Where the Council Clashes: The Shireen Khan Sequencing Debate
- **Candidate's Original Plan:** Save Shireen Khan for Week 4 as a "final readiness gate."
- **The Council's Overwhelming Counter-Argument (4/5 Reviewers Backed Response D):** Saving Shireen Khan for the final week is **strategic suicide**. Shireen Khan is famous for brutal word traps, dense case studies, and harsh edge cases. Scoring 60–70% a few days before an unextendable voucher deadline induces panic and leaves zero runway to remediate weaknesses.
- **The Resolution:** Pull Shireen Khan forward into **Weeks 2 and 3** (interleaved with Tutorials Dojo), reserving the final week for MS Learn official calibrations and rapid review of your error log.

### Blind Spots the Council Caught (Peer Review Round)
1. **Live Open-Book Microsoft Learn Access During Exam:** Every advisor missed this in Round 1. Microsoft now provides **built-in split-screen access to MS Learn** during the real AZ-104 exam! You do not need to memorize obscure SKU limits or exact PowerShell parameter flags. During practice exams, you must actively train your ability to search MS Learn and find an answer in under 60–90 seconds.
2. **PowerShell & Azure CLI Syntax:** The Azure Portal dictionary trick covers GUI questions, but AZ-104 heavily tests PowerShell cmdlets (`New-Az*`, `Set-Az*`) and Azure CLI (`az network *`) in dropdowns. Whenever a question features CLI syntax, note the cmdlet naming pattern (`Verb-AzNoun`) in your error log.
3. **Lock In Your Exam Appointment Today:** Do not wait until you "feel ready" to book your exam slot. Pearson VUE exam slots (both online proctored and test center) disappear quickly towards month-end. Book your appointment today for **December 5–8, 2026**.

---

### The Recommendation

1. **Move straight to Practice Exams tomorrow morning.** Do not touch the GitHub lab manuals.
2. **The 3-Tier Exam Strategy:**
   * **Tier 1 (Foundation & Architecture): Tutorials Dojo (Review Mode).** Start here. Dissect every question, table, and topological diagram.
   * **Tier 2 (Adversarial Hard-Mode): Shireen Khan.** Introduce Shireen in **Week 2**, not Week 4. Expect brutal scores (65–75% is passing on Shireen). Treat it as stress inoculation, not a pass/fail judgment.
   * **Tier 3 (Exam UI & Official Phrasing): MS Learn Practice Assessment.** Take 2–3 runs in Week 3/4 to calibrate with Microsoft's real question engine and hot-area drag-and-drops.
3. **Surgical Portal Inspection (2 Minutes per Miss):** Keep the Azure Portal open in a side tab. When you miss a question, click to the blade, look at the options, and close it.
4. **Train Open-Book Search:** Practice searching `learn.microsoft.com` for tricky syntax while taking your practice tests.

---

### The One Thing to Do First
**Finish your 3-hour video run today to close out Alan Rodrigues, and tomorrow morning at 8:00 AM, open Tutorials Dojo Test 1 in Review Mode.**
