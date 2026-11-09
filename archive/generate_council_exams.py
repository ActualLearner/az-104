import os

md_content = """# LLM Council Transcript: Practice Exams vs. Labs, Shireen Khan Gating & Post-Video Strategy
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
"""

with open('/home/actual/projects/az-104/council-transcript-2026-11-07-exams-vs-labs.md', 'w') as f:
    f.write(md_content)

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LLM Council Briefing: AZ-104 Post-Video Strategy & Practice Exam Sequencing</title>
<style>
  :root {
    --bg-page: #f8fafc;
    --bg-card: #ffffff;
    --border: #e2e8f0;
    --text-primary: #0f172a;
    --text-secondary: #475569;
    --accent: #2563eb;
    --accent-light: #eff6ff;
    --success: #16a34a;
    --success-light: #f0fdf4;
    --warning: #d97706;
    --warning-light: #fffbeb;
    --danger: #dc2626;
    --danger-light: #fef2f2;
    --radius: 8px;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: var(--bg-page);
    color: var(--text-primary);
    line-height: 1.6;
    padding: 2rem 1rem;
  }
  .container { max-width: 920px; margin: 0 auto; }
  header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
  }
  .badge {
    display: inline-block;
    padding: 0.25rem 0.6rem;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-radius: 9999px;
    background-color: var(--accent-light);
    color: var(--accent);
    margin-bottom: 0.5rem;
  }
  h1 { font-size: 1.85rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; }
  .meta { font-size: 0.875rem; color: var(--text-secondary); }
  
  .card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }
  .card-verdict {
    border-left: 5px solid var(--success);
    background: #ffffff;
  }
  .card-alert {
    background-color: var(--warning-light);
    border: 1px solid #fde68a;
    color: #92400e;
  }
  h2 { font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
  h3 { font-size: 1rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem; }
  p { margin-bottom: 0.75rem; color: var(--text-secondary); font-size: 0.95rem; }
  p strong { color: var(--text-primary); }
  ul, ol { margin-left: 1.25rem; margin-bottom: 1rem; color: var(--text-secondary); font-size: 0.95rem; }
  li { margin-bottom: 0.35rem; }

  /* Grid visual */
  .grid-council {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 0.75rem;
    margin: 1.25rem 0;
  }
  .advisor-box {
    padding: 0.75rem;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    background: #fafafa;
    text-align: center;
  }
  .advisor-name { font-weight: 700; font-size: 0.85rem; margin-bottom: 0.25rem; }
  .advisor-vote { font-size: 0.8rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 4px; display: inline-block; }
  .vote-exams { background: var(--success-light); color: var(--success); }
  .advisor-sub { font-size: 0.75rem; color: #64748b; margin-top: 0.35rem; }

  /* Callout action */
  .action-box {
    background: #0f172a;
    color: #f8fafc;
    border-radius: var(--radius);
    padding: 1.25rem;
    margin-top: 1.5rem;
  }
  .action-box h3 { color: #38bdf8; margin-top: 0; }
  .action-box p { color: #cbd5e1; margin-bottom: 0.5rem; }
  .action-step {
    background: rgba(255,255,255,0.08);
    padding: 0.75rem;
    border-radius: 6px;
    margin-top: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
  }

  /* Schedule Table */
  .schedule-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    font-size: 0.9rem;
  }
  .schedule-table th, .schedule-table td {
    padding: 0.75rem;
    border: 1px solid var(--border);
    text-align: left;
  }
  .schedule-table th { background: #f1f5f9; font-weight: 700; color: #0f172a; }

  /* Collapsibles */
  details {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    margin-bottom: 0.75rem;
    overflow: hidden;
  }
  summary {
    padding: 0.85rem 1.25rem;
    font-weight: 600;
    cursor: pointer;
    background: #fdfdfd;
    user-select: none;
    font-size: 0.95rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  summary:hover { background: #f1f5f9; }
  .details-content {
    padding: 1.25rem;
    border-top: 1px solid var(--border);
    background: #ffffff;
    font-size: 0.92rem;
  }
  .details-content p { color: var(--text-secondary); margin-bottom: 0.75rem; }

  footer {
    text-align: center;
    font-size: 0.8rem;
    color: #94a3b8;
    margin-top: 3rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
  }
</style>
</head>
<body>
<div class="container">

  <header>
    <span class="badge">LLM Council Consensus Verdict</span>
    <h1>AZ-104 Strategy: Practice Exams vs. Labs & Gating Architecture</h1>
    <div class="meta">Session Date: 2026-11-07 | Target Exam: ~Dec 5–8, 2026 | ESI Voucher Deadline: 4 Weeks</div>
  </header>

  <!-- Council Alignment Visual -->
  <div class="card">
    <h2>Council Verdict on Hands-on Labs vs. Diagnostic Exams</h2>
    <div class="grid-council">
      <div class="advisor-box">
        <div class="advisor-name">The Outsider</div>
        <span class="advisor-vote vote-exams">EXAMS (Rated #1)</span>
        <div class="advisor-sub">Pulls Shireen to W2/3</div>
      </div>
      <div class="advisor-box">
        <div class="advisor-name">First Principles</div>
        <span class="advisor-vote vote-exams">EXAMS DIRECTLY</span>
        <div class="advisor-sub">Portal as dictionary</div>
      </div>
      <div class="advisor-box">
        <div class="advisor-name">The Executor</div>
        <span class="advisor-vote vote-exams">EXAMS DIRECTLY</span>
        <div class="advisor-sub">Day A/B testing cycle</div>
      </div>
      <div class="advisor-box">
        <div class="advisor-name">The Contrarian</div>
        <span class="advisor-vote vote-exams">EXAMS DIRECTLY</span>
        <div class="advisor-sub">Warns: No late Shireen</div>
      </div>
      <div class="advisor-box">
        <div class="advisor-name">The Expansionist</div>
        <span class="advisor-vote vote-exams">EXAMS DIRECTLY</span>
        <div class="advisor-sub">Forensic diagnostics</div>
      </div>
    </div>
  </div>

  <!-- Chairman Verdict -->
  <div class="card card-verdict">
    <h2>Chairman's Official Verdict & Blueprint</h2>
    
    <p><strong>1. Skip the 14 GitHub Labs Entirely:</strong> All 5 advisors and all 5 reviewers unanimously agree: do <em>not</em> spend 30–40 hours following generic lab manuals. You have 4 weeks. Doing labs blindly without knowing your weak spots is low-yield click-ops. Move straight to practice exams.</p>

    <p><strong>2. How to Bridge the "Zero Hands-On" Gap (The Interactive Dictionary Rule):</strong><br>
    Whenever a question exposes a gap (e.g., Private DNS Zone links, lifecycle management rules, Conditional Access policies), open a free Azure Portal tab for <strong>exactly 2 to 3 minutes</strong>. Navigate to that blade, inspect the toggles, see what greys out when an option is selected, and visually register the hierarchy. <strong>Do not build infrastructure—simply inspect the terrain where you got tricked.</strong></p>

    <p><strong>3. THE MAJOR CORRECTION: Do NOT Save Shireen Khan for the Final Week!</strong><br>
    Saving Shireen Khan for Week 4 is <em>strategic suicide</em>. Shireen Khan is famous for brutal word traps and edge cases; scoring 65% a few days before an unextendable deadline shatters confidence with zero runway to remediate. <strong>Introduce Shireen Khan in Weeks 2 and 3</strong> so her trick questions inoculate you against traps while you still have time to fix gaps.</p>

    <p><strong>4. Stop Test-Shopping on Udemy:</strong><br>
    Shopping for random extra Udemy practice tests is productive procrastination. You already have the gold standard: <strong>Tutorials Dojo (architecture & diagrams)</strong>, <strong>Shireen Khan (brutal trap resilience)</strong>, and <strong>MS Learn (official question format)</strong>. Adding unvetted banks dilutes your focus.</p>

    <p><strong>5. THE SECRET WEAPON: In-Exam MS Learn Open-Book Access:</strong><br>
    Microsoft exams now include <strong>live split-screen access to MS Learn</strong>! During your practice exam runs, practice searching `learn.microsoft.com` under 60 seconds to look up obscure PowerShell flags, SKU limits, and template syntax.</p>

    <table class="schedule-table">
      <thead>
        <tr>
          <th>Phase</th>
          <th>Timeframe</th>
          <th>Primary Assessment</th>
          <th>Operational Focus</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Phase 1: Foundation</strong></td>
          <td>Week 1 (Nov 8–15)</td>
          <td><strong>Tutorials Dojo (Review Mode)</strong></td>
          <td>Take 60-question sets. Dissect every explanation and diagram. Use Portal as a 2-min dictionary for misses.</td>
        </tr>
        <tr>
          <td><strong>Phase 2: Stress Inoculation</strong></td>
          <td>Weeks 2–3 (Nov 16–29)</td>
          <td><strong>Shireen Khan (Udemy)</strong> + Tutorials Dojo Retakes</td>
          <td>Expose brutal word traps. Expect scores in the 65–75% range (normal!). Train rapid MS Learn doc search.</td>
        </tr>
        <tr>
          <td><strong>Phase 3: Final Calibration</strong></td>
          <td>Week 4 (Nov 30–Dec 5)</td>
          <td><strong>MS Learn Practice Assessment</strong> + Error Log Review</td>
          <td>Calibrate against official Microsoft phrasing. Review your error journal. Zero panic. Take exam ~Dec 5–8.</td>
        </tr>
      </tbody>
    </table>

    <div class="action-box">
      <h3>The One Thing to Do First</h3>
      <p>Finish your 3-hour video run today to permanently close out video lectures.</p>
      <div class="action-step">
        Tomorrow morning at 8:00 AM: Open <strong>Tutorials Dojo AZ-104 Practice Exam 1 in Review Mode</strong> and take your first diagnostic baseline test.
      </div>
    </div>
  </div>

  <!-- Collapsible Section for Details -->
  <h2 style="margin-top: 2rem; margin-bottom: 1rem;">Full Advisor Arguments & Peer Reviews (Click to Expand)</h2>

  <details open>
    <summary><span>Advisor 4: The Outsider (Council Champion)</span> <span style="font-size:0.8rem; color:#16a34a; font-weight:700;">★ 4/5 Peer Review Winner</span></summary>
    <div class="details-content">
      <p>Looking at this from the outside, you have 28 days, a hard deadline, and an illusion of competence from playing videos at double speed. You cannot afford a sprawling lab curriculum now.</p>
      <p>You aren't preparing to be an enterprise administrator tomorrow; you are preparing to pass a specific exam. Take practice tests immediately. Doing open-ended GitHub labs without knowing your weak spots is like reading an entire dictionary to prepare for a crossword puzzle.</p>
      <p><strong>Your biggest tactical mistake is saving the hardest test for last.</strong> Why wait until days before an unextendable deadline to discover you fall for word traps? If Shireen Khan exposes how the exam tricks candidates, you need that humiliation in Week 2, not Week 4. Saving it for the end turns it into an autopsy with no runway to fix your weaknesses.</p>
      <p>To handle zero manual labbing: surgical inspection. Whenever you miss an exam question, open the free Azure portal and spend exactly two minutes navigating to that blade. Look at the real drop-downs, visually anchor where toggles live, and close the tab. Do not build infrastructure.</p>
    </div>
  </details>

  <details>
    <summary><span>Advisor 1: The Contrarian</span> <span style="font-size:0.8rem; color:#64748b;">(Why test-shopping fails)</span></summary>
    <div class="details-content">
      <p>Passive-watching videos at 2x with zero hands-on experience has given you an illusion of competence, not operational knowledge. The fatal flaw in your plan isn't skipping 40 hours of open-ended GitHub labs—a massive time sink four weeks out—it's assuming you can pass AZ-104 by brute-forcing practice test answer keys.</p>
      <p>1. <strong>Saving Shireen Khan for the end is strategic suicide.</strong> If Shireen’s brutal traps shatter your confidence one week before your voucher expires, you have zero runway to remediate.<br>
      2. <strong>Shopping for more Udemy tests is productive procrastination.</strong> You already own Tutorials Dojo, the gold standard. Adding random question banks dilutes quality.<br>
      3. <strong>"No manual labbing" cannot mean "never opening the Portal."</strong> Treat the Portal as your dictionary. When you miss a question, verify the UI layout with your own eyes.</p>
    </div>
  </details>

  <details>
    <summary><span>Advisor 2: The First Principles Thinker</span> <span style="font-size:0.8rem; color:#64748b;">(Constraint satisfaction model)</span></summary>
    <div class="details-content">
      <p>AZ-104 does not test operational muscle memory; it tests constraint satisfaction and state navigation under Microsoft's rules. Following step-by-step GitHub labs provides abysmal cognitive yield per hour—you mindlessly copy-paste parameters into the Portal.</p>
      <p>Under a 4-week hard deadline, the Azure Portal should not be treated as a construction site. Treat it as an <strong>interactive dictionary</strong>. When an exam question discusses conditional access, storage lifecycle tiers, or network security rules, open the free Portal and physically navigate to that blade. Inspect the toggles, examine which fields grey out, and verify the constraint logic.</p>
    </div>
  </details>

  <details>
    <summary><span>Advisor 5: The Executor</span> <span style="font-size:0.8rem; color:#64748b;">(Operational testing cadence)</span></summary>
    <div class="details-content">
      <p>Monday morning at 8 AM, do not touch a lab manual. With 28 days and a hard voucher cutoff, setting up official GitHub labs is a massive time sink. Move directly to practice exams.</p>
      <p><strong>Cycle one full 60-question block every two days:</strong> Day A: Complete 60 questions under realistic timing. Day B: Dissect every missed question and lucky guess. Log the core concept gap into a spreadsheet.</p>
      <p><strong>Micro-click verification:</strong> Three minutes per gap, zero infrastructure overhead.</p>
    </div>
  </details>

  <footer>
    Generated by Antigravity Autonomous LLM Council System | Full markdown transcript saved to <code>council-transcript-2026-11-07-exams-vs-labs.md</code>
  </footer>

</div>
</body>
</html>
"""

with open('/home/actual/projects/az-104/council-report-2026-11-07-exams-vs-labs.html', 'w') as f:
    f.write(html_content)

print("Exams vs Labs Council artifacts successfully generated!")
