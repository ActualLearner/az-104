import os
import re
import json

def test_exams():
    print("=== STARTING RIGOROUS EXAM & SIMULATOR VERIFICATION ===")

    base_dir = "/home/actual/projects/az-104"

    # 1. Check critical files exist and are non-empty
    files = [
        "exam_questions_exam1.js",
        "exam_questions_exam2.js",
        "exam_questions_exam3.js",
        "exam_engine.js",
        "exam_simulator.html",
        "index.html",
        "sw.js"
    ]
    for f in files:
        path = os.path.join(base_dir, f)
        assert os.path.exists(path), f"File missing: {path}"
        size = os.path.getsize(path)
        assert size > 0, f"File is empty: {path}"
        print(f"✓ File exists: {f} ({size} bytes)")

    # 2. Extract JSON from exam 1, exam 2, and exam 3
    def extract_exam_data(filename):
        path = os.path.join(base_dir, filename)
        with open(path, "r", encoding="utf-8") as fh:
            content = fh.read()
        match = re.search(r'window\.AZ104_EXAM_[123]\s*=\s*(\[[\s\S]*?\]);\s*$', content)
        assert match, f"Could not find JSON array in {filename}"
        return json.loads(match.group(1))

    exam1 = extract_exam_data("exam_questions_exam1.js")
    exam2 = extract_exam_data("exam_questions_exam2.js")
    exam3 = extract_exam_data("exam_questions_exam3.js")

    assert len(exam1) == 65, f"Exam 1 must have 65 questions, found {len(exam1)}"
    assert len(exam2) == 65, f"Exam 2 must have 65 questions, found {len(exam2)}"
    assert len(exam3) == 65, f"Exam 3 must have 65 questions, found {len(exam3)}"
    print(f"✓ Exam 1 count: {len(exam1)} questions")
    print(f"✓ Exam 2 count: {len(exam2)} questions")
    print(f"✓ Exam 3 count: {len(exam3)} questions")
    total_q = len(exam1) + len(exam2) + len(exam3)
    print(f"✓ Total pool: {total_q} questions (3 Full 65Q Exams)")
    assert total_q == 195, f"Total question pool must equal 195, found {total_q}"

    # 3. Check question integrity, uniqueness, schema, and distractor correctness
    all_ids = set()
    all_scenarios = set()
    all_questions = [("Exam 1", exam1), ("Exam 2", exam2), ("Exam 3", exam3)]
    total_domain_counts = {}

    for exam_name, q_list in all_questions:
        exam_topics = set()
        dist_counts = {'A': 0, 'B': 0, 'C': 0, 'D': 0}
        multi_counts = 0
        exam_domains = {}

        for q in q_list:
            qid = q.get("id")
            assert qid, f"Missing id in {exam_name}"
            assert qid not in all_ids, f"Duplicate question ID across exams: {qid}"
            all_ids.add(qid)

            topic = q.get("topic", "")
            assert len(topic) > 0, f"Missing topic in {qid}"
            assert topic not in exam_topics, f"Duplicate topic '{topic}' in {exam_name} ({qid})"
            exam_topics.add(topic)

            scenario = q.get("scenario", "")
            assert len(scenario) > 20, f"Scenario too short in {qid}"
            assert scenario not in all_scenarios, f"Duplicate scenario across exams in {qid}"
            all_scenarios.add(scenario)

            assert "options" in q and len(q["options"]) >= 4, f"Options < 4 in {qid}"
            opt_ids = [opt["id"] for opt in q["options"]]
            assert len(opt_ids) == len(set(opt_ids)), f"Duplicate option IDs in {qid}: {opt_ids}"

            assert "correctAnswer" in q, f"Missing correctAnswer in {qid}"
            corr = q["correctAnswer"]

            if isinstance(corr, list):
                assert q.get("questionType") == "multiple", f"List correctAnswer but not multiple type in {qid}"
                assert len(corr) >= 2, f"Multi-select with < 2 correct answers in {qid}"
                for ans in corr:
                    assert ans in opt_ids, f"Correct answer {ans} not in options {opt_ids} in {qid}"
                multi_counts += 1
            else:
                assert q.get("questionType") == "single", f"Single correctAnswer but not single type in {qid}"
                assert corr in opt_ids, f"Correct answer {corr} not in options {opt_ids} in {qid}"
                assert corr in dist_counts, f"Unexpected single answer {corr} in {qid}"
                dist_counts[corr] += 1

            # Check explanation fields
            exp = q.get("explanation", {})
            for field in ["verdict", "triggerConstraints", "flawedMentalModel", "coreMechanic", "distractors", "heuristic", "msLearnUrl"]:
                assert field in exp and len(str(exp[field])) > 0, f"Missing or empty explanation field '{field}' in {qid}"

            assert exp["msLearnUrl"].startswith("https://learn.microsoft.com"), f"Invalid msLearnUrl in {qid}: {exp['msLearnUrl']}"

            # Verify verdict references correct answer letter(s)
            verdict_text = exp["verdict"]
            expected_letters = corr if isinstance(corr, list) else [corr]
            for ltr in expected_letters:
                assert f"Option {ltr}" in verdict_text or f"Options {ltr}" in verdict_text or f"and {ltr}" in verdict_text or f", {ltr}" in verdict_text or f"Option {ltr} (" in verdict_text, \
                    f"Verdict '{verdict_text}' does not reference expected option {ltr} in {qid}"

            # Verify distractors do not collide with correct answer and cover all wrong options
            distractors = exp.get("distractors", {})
            correct_set = set(corr) if isinstance(corr, list) else {corr}
            wrong_set = set(opt_ids) - correct_set

            for d_key in distractors:
                assert d_key in opt_ids, f"Distractor key {d_key} not in options {opt_ids} for {qid}"
                assert d_key not in correct_set, f"Distractor {d_key} marked as correct in {qid}"

            for w_key in wrong_set:
                assert w_key in distractors, f"Missing distractor explanation for wrong option {w_key} in {qid}"

            domain = q.get("domain", "Unknown")
            domain_code = q.get("domainCode", 0)
            assert 1 <= domain_code <= 5, f"Invalid domainCode {domain_code} in {qid}"
            exam_domains[domain_code] = exam_domains.get(domain_code, 0) + 1
            total_domain_counts[domain] = total_domain_counts.get(domain, 0) + 1

        # Check answer key balance (~25% for each option, e.g. 12-20 out of 65)
        print(f"\n{exam_name} Answer Distribution:")
        accounted_total = sum(dist_counts.values()) + multi_counts
        assert accounted_total == len(q_list), f"Accounting mismatch: {accounted_total} != {len(q_list)}"

        for letter in ['A', 'B', 'C', 'D']:
            cnt = dist_counts[letter]
            pct = round((cnt / len(q_list)) * 100, 1)
            print(f"  • Option {letter}: {cnt} ({pct}%)")
            assert 12 <= cnt <= 20, f"Distribution imbalance: Option {letter} appears {cnt} times in {exam_name} (must be between 12 and 20)"

        if multi_counts > 0:
            pct_m = round((multi_counts / len(q_list)) * 100, 1)
            print(f"  • Multi-Select: {multi_counts} ({pct_m}%)")

        # Verify all 5 domains are represented in this exam
        for d_code in range(1, 6):
            assert exam_domains.get(d_code, 0) >= 5, f"Domain {d_code} underrepresented in {exam_name}: {exam_domains.get(d_code, 0)} questions"

        if exam_name == "Exam 3":
            # Strict blueprint ranges: D1 (14-16), D2 (11-13), D3 (14-16), D4 (11-13), D5 (8-10)
            assert 14 <= exam_domains.get(1, 0) <= 16, f"Exam 3 Domain 1 outside blueprint (14-16): {exam_domains.get(1, 0)}"
            assert 11 <= exam_domains.get(2, 0) <= 13, f"Exam 3 Domain 2 outside blueprint (11-13): {exam_domains.get(2, 0)}"
            assert 14 <= exam_domains.get(3, 0) <= 16, f"Exam 3 Domain 3 outside blueprint (14-16): {exam_domains.get(3, 0)}"
            assert 11 <= exam_domains.get(4, 0) <= 13, f"Exam 3 Domain 4 outside blueprint (11-13): {exam_domains.get(4, 0)}"
            assert 8 <= exam_domains.get(5, 0) <= 10, f"Exam 3 Domain 5 outside blueprint (8-10): {exam_domains.get(5, 0)}"
            print("  ✓ Exam 3 strictly conforms to all AZ-104 domain blueprint distribution ranges!")

    print("\n✓ All 195 questions passed structural, schema, uniqueness & distractor validation!")
    print("\nTotal Domain Distribution across 195 Questions:")
    for d, c in sorted(total_domain_counts.items()):
        print(f"  • {d}: {c} questions")

    # 4. Check exam_engine.js timer logic, session configuration, and result copy functionality
    with open(os.path.join(base_dir, "exam_engine.js"), "r", encoding="utf-8") as fh:
        engine_content = fh.read()

    assert "function getDefaultExamTimeSeconds(examKey)" in engine_content, "Missing getDefaultExamTimeSeconds in exam_engine.js"
    assert "if (examKey === 'combined') return 300 * 60;" in engine_content, "Combined pool timer must be 300 minutes (18000s)"
    assert "return 100 * 60;" in engine_content, "Single exam timer must be 100 minutes (6000s)"
    assert "az104_simulator_session_v2" in engine_content, "Session key should use v2 to isolate 65-question state"
    assert "function copyFullCurrentExamResults" in engine_content, "exam_engine.js missing copyFullCurrentExamResults"
    assert "function generateFullExamResultsMarkdown" in engine_content, "exam_engine.js missing generateFullExamResultsMarkdown"
    assert "function copyPastAttemptResult" in engine_content, "exam_engine.js missing copyPastAttemptResult"
    assert "function copyTextToClipboardWithFallback" in engine_content, "exam_engine.js missing copyTextToClipboardWithFallback"
    assert "userAnswers: JSON.parse(JSON.stringify(userAnswers))" in engine_content, "exam_engine.js must persist userAnswers in history record"
    assert "isLegacyNoAnswers" in engine_content, "exam_engine.js must handle legacy history records without userAnswers"
    assert "btnCopyHistoryLatest" in engine_content, "exam_engine.js missing btnCopyHistoryLatest binding"
    print("✓ exam_engine.js timer enforces 100m (65Q) and 300m (195Q) with robust error journal copy & persistence")

    # 5. Check exam_simulator.html loads scripts and essential elements
    with open(os.path.join(base_dir, "exam_simulator.html"), "r", encoding="utf-8") as fh:
        sim_content = fh.read()
    assert "exam_questions_exam1.js" in sim_content, "exam_simulator.html missing exam_questions_exam1.js"
    assert "exam_questions_exam2.js" in sim_content, "exam_simulator.html missing exam_questions_exam2.js"
    assert "exam_questions_exam3.js" in sim_content, "exam_simulator.html missing exam_questions_exam3.js"
    assert "exam_engine.js" in sim_content, "exam_simulator.html missing exam_engine.js"
    assert "drawer-backdrop" in sim_content, "exam_simulator.html missing mobile drawer backdrop"
    assert "toast-container" in sim_content, "exam_simulator.html missing toast container"
    assert "Exam 1 — Shireen Khan Gauntlet (65Q)" in sim_content, "exam_simulator.html missing 65Q label for Exam 1"
    assert "Exam 2 — Advanced Architecture &amp; Edge Cases (65Q)" in sim_content, "exam_simulator.html missing 65Q label for Exam 2"
    assert "Exam 3 — Standard Comprehensive Blueprint (65Q)" in sim_content, "exam_simulator.html missing 65Q label for Exam 3"
    assert "Combined Mega Mock (195 Questions Pool)" in sim_content, "exam_simulator.html missing 195Q label for Combined"
    assert "btn-copy-full-results" in sim_content, "exam_simulator.html missing btn-copy-full-results"
    assert "btn-copy-history-latest" in sim_content, "exam_simulator.html missing prominent copy button in history modal"
    assert "export-markdown-text" in sim_content, "exam_simulator.html missing export-markdown-text"
    assert "btn-select-all-export" in sim_content, "exam_simulator.html missing btn-select-all-export"
    assert "Select All &amp; Copy" in sim_content, "exam_simulator.html missing 'Select All & Copy' button label"
    assert "#export-modal" in sim_content and "z-index: 700" in sim_content, "exam_simulator.html export modal must have higher z-index to overlay history modal"
    assert "btn-copy-export" in sim_content, "exam_simulator.html missing btn-copy-export"
    assert "1:40:00" in sim_content, "exam_simulator.html timer display initial format should be 1:40:00 (100 mins)"
    print("✓ exam_simulator.html properly imports all scripts, labels, prominent copy buttons, and 65Q/100m/195Q indicators")

    # 6. Check index.html links to exam_simulator.html and shows accurate badges
    with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as fh:
        index_content = fh.read()
    assert "exam_simulator.html" in index_content, "index.html missing link to exam_simulator.html"
    assert "195 Questions" in index_content, "index.html missing 195 Questions badge"
    assert "195Q" in index_content, "index.html missing 195Q label"
    assert "65Q/100m" in index_content, "index.html missing 65Q/100m badge"
    assert "exam_simulator.html?exam=exam3" in index_content, "index.html missing direct link to exam 3"
    print("✓ index.html has active links and accurate 195Q / 65Q / 100m badges and Exam 3 button")

    # 7. Check sw.js caches new assets
    with open(os.path.join(base_dir, "sw.js"), "r", encoding="utf-8") as fh:
        sw_content = fh.read()
    assert "exam_simulator.html" in sw_content, "sw.js missing exam_simulator.html"
    assert "exam_questions_exam1.js" in sw_content, "sw.js missing exam_questions_exam1.js"
    assert "exam_questions_exam2.js" in sw_content, "sw.js missing exam_questions_exam2.js"
    assert "exam_questions_exam3.js" in sw_content, "sw.js missing exam_questions_exam3.js"
    assert "exam_engine.js" in sw_content, "sw.js missing exam_engine.js"
    assert "az104-hub-v4" in sw_content, "sw.js cache version should be bumped to v4"
    print("✓ Service Worker (sw.js) caches all simulator assets including exam 3")

    # 8. Run Node E2E simulation of exam engine export markdown and legacy attempt handling
    import subprocess
    node_test_script = """
const fs = require('fs');
const vm = require('vm');

const makeEl = () => {
  const attrs = {};
  return {
    style: {},
    classList: { add: () => {}, remove: () => {}, contains: () => false },
    addEventListener: () => {},
    querySelectorAll: () => [],
    querySelector: () => null,
    appendChild: () => {},
    setAttribute: (k, v) => { attrs[k] = v; },
    getAttribute: (k) => attrs[k] || null,
    innerHTML: '',
    textContent: '',
    value: ''
  };
};

const windowMock = { location: { search: '' }, scrollTo: () => {} };
const documentMock = {
  readyState: 'complete',
  getElementById: (id) => makeEl(),
  querySelectorAll: () => [],
  addEventListener: () => {},
  createElement: () => makeEl()
};
const localStorageData = {};
const localStorageMock = {
  getItem: (key) => localStorageData[key] || null,
  setItem: (key, val) => { localStorageData[key] = String(val); },
  removeItem: (key) => { delete localStorageData[key]; }
};

const sandbox = {
  window: windowMock,
  document: documentMock,
  localStorage: localStorageMock,
  navigator: {},
  console: console,
  setInterval: () => 1,
  clearInterval: () => {},
  setTimeout: (cb) => cb(),
  Date: Date,
  Math: Math,
  URLSearchParams: URLSearchParams
};

vm.createContext(sandbox);

['exam_questions_exam1.js', 'exam_questions_exam2.js', 'exam_questions_exam3.js'].forEach(file => {
  const code = fs.readFileSync('""" + base_dir + """/' + file, 'utf-8');
  vm.runInContext(code, sandbox);
});

const engineCode = fs.readFileSync('""" + base_dir + """/exam_engine.js', 'utf-8');
vm.runInContext(engineCode, sandbox);

const exp = sandbox.window._AZ104_ENGINE_TEST;
if (!exp) throw new Error('Missing engine test hook');

// Timers
if (exp.getDefaultExamTimeSeconds('exam1') !== 6000) throw new Error('exam1 timer mismatch');
if (exp.getDefaultExamTimeSeconds('exam2') !== 6000) throw new Error('exam2 timer mismatch');
if (exp.getDefaultExamTimeSeconds('exam3') !== 6000) throw new Error('exam3 timer mismatch');
if (exp.getDefaultExamTimeSeconds('combined') !== 18000) throw new Error('combined timer mismatch');

// Exam 3 simulation with mixed answers
const e3Questions = sandbox.window.AZ104_EXAM_3;
const answersMap = {};
e3Questions.forEach((q, idx) => {
  if (idx < 50) {
    answersMap[q.id] = q.correctAnswer;
  } else {
    const corr = Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer;
    const wrong = q.options.map(o => o.id).find(o => o !== corr);
    answersMap[q.id] = wrong;
  }
});

const scoreData = {
  date: new Date().toISOString(),
  scaledScore: Math.round((50 / 65) * 1000),
  scorePct: Math.round((50 / 65) * 100),
  passed: (50 / 65) >= 0.7,
  correctCount: 50,
  totalQuestions: 65,
  timeSpentSeconds: 4500,
  mode: 'timed',
  userAnswers: answersMap
};

const md = exp.generateFullExamResultsMarkdown('exam3', scoreData, answersMap, e3Questions);
if (!md.includes('Exam 3 — Standard Comprehensive Blueprint (65Q)')) throw new Error('Missing exam title');
if (!md.includes('769 / 1000')) throw new Error('Missing score');
if (!md.includes('✅ PASSED')) throw new Error('Missing pass badge');
if (!md.includes('Performance by Azure Domain')) throw new Error('Missing domain table');
if (!md.includes('Missed Questions Analysis (15 Missed Questions)')) throw new Error('Missing missed questions section');
if (!md.includes('#### 1. Diagnostic Verdict')) throw new Error('Missing SOP 1');
if (!md.includes('#### 6. Exam Heuristic')) throw new Error('Missing SOP 6');
if (!md.includes('**Your Choice:** Option')) throw new Error('Missing choice text');

// Legacy attempt verification
const legacyScoreData = {
  date: new Date().toISOString(),
  scaledScore: 850,
  scorePct: 85,
  passed: true,
  correctCount: 55,
  totalQuestions: 65,
  timeSpentSeconds: 3600,
  mode: 'timed'
};
const mdLegacy = exp.generateFullExamResultsMarkdown('exam1', legacyScoreData, {}, sandbox.window.AZ104_EXAM_1);
if (!mdLegacy.includes('850 / 1000')) throw new Error('Legacy score corrupted');
if (!mdLegacy.includes('Detailed question responses were not recorded for this legacy attempt')) throw new Error('Missing legacy notice');
if (mdLegacy.includes('| 0 / 65 |')) throw new Error('Legacy incorrectly calculated 0 correct');
"""
    result = subprocess.run(["node", "-e", node_test_script], capture_output=True, text=True)
    assert result.returncode == 0, f"Node E2E verification failed:\n{result.stderr}\n{result.stdout}"
    print("✓ End-to-end Node engine simulation verified (markdown generation, 6-part SOP, option labels, and legacy history resilience)")

    print("\n=== ALL RIGOROUS VERIFICATION TESTS PASSED SUCCESSFULLY ===")

if __name__ == "__main__":
    test_exams()
