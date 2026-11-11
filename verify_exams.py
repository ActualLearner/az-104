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

    # 2. Extract JSON from exam 1 and exam 2
    def extract_exam_data(filename):
        path = os.path.join(base_dir, filename)
        with open(path, "r", encoding="utf-8") as fh:
            content = fh.read()
        match = re.search(r'window\.AZ104_EXAM_[12]\s*=\s*(\[[\s\S]*?\]);\s*$', content)
        assert match, f"Could not find JSON array in {filename}"
        return json.loads(match.group(1))

    exam1 = extract_exam_data("exam_questions_exam1.js")
    exam2 = extract_exam_data("exam_questions_exam2.js")

    assert len(exam1) == 65, f"Exam 1 must have 65 questions, found {len(exam1)}"
    assert len(exam2) == 65, f"Exam 2 must have 65 questions, found {len(exam2)}"
    print(f"✓ Exam 1 count: {len(exam1)} questions")
    print(f"✓ Exam 2 count: {len(exam2)} questions")
    print(f"✓ Total pool: {len(exam1) + len(exam2)} questions")

    # 3. Check question integrity, uniqueness, schema, and distractor correctness
    all_ids = set()
    all_scenarios = set()
    all_questions = [("Exam 1", exam1), ("Exam 2", exam2)]
    total_domain_counts = {}

    for exam_name, q_list in all_questions:
        exam_topics = set()
        dist_counts = {'A': 0, 'B': 0, 'C': 0, 'D': 0}
        multi_counts = 0
        exam_domains = {}

        for q in q_list:
            qid = q.get("id")
            assert qid, f"Missing id in {exam_name}"
            assert qid not in all_ids, f"Duplicate question ID: {qid}"
            all_ids.add(qid)

            topic = q.get("topic", "")
            assert len(topic) > 0, f"Missing topic in {qid}"
            assert topic not in exam_topics, f"Duplicate topic '{topic}' in {exam_name} ({qid})"
            exam_topics.add(topic)

            scenario = q.get("scenario", "")
            assert len(scenario) > 20, f"Scenario too short in {qid}"
            assert scenario not in all_scenarios, f"Duplicate scenario in {qid}"
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

    print("\n✓ All 130 questions passed structural, schema, uniqueness & distractor validation!")
    print("\nTotal Domain Distribution across 130 Questions:")
    for d, c in sorted(total_domain_counts.items()):
        print(f"  • {d}: {c} questions")

    # 4. Check exam_engine.js timer logic & session configuration
    with open(os.path.join(base_dir, "exam_engine.js"), "r", encoding="utf-8") as fh:
        engine_content = fh.read()

    assert "function getDefaultExamTimeSeconds(examKey)" in engine_content, "Missing getDefaultExamTimeSeconds in exam_engine.js"
    assert "if (examKey === 'combined') return 200 * 60;" in engine_content, "Combined pool timer must be 200 minutes (12000s)"
    assert "return 100 * 60;" in engine_content, "Single exam timer must be 100 minutes (6000s)"
    assert "az104_simulator_session_v2" in engine_content, "Session key should use v2 to isolate 65-question state"
    print("✓ exam_engine.js timer enforces 100m (65Q) and 200m (130Q) with safe session handling")

    # 5. Check exam_simulator.html loads scripts and essential elements
    with open(os.path.join(base_dir, "exam_simulator.html"), "r", encoding="utf-8") as fh:
        sim_content = fh.read()
    assert "exam_questions_exam1.js" in sim_content, "exam_simulator.html missing exam_questions_exam1.js"
    assert "exam_questions_exam2.js" in sim_content, "exam_simulator.html missing exam_questions_exam2.js"
    assert "exam_engine.js" in sim_content, "exam_simulator.html missing exam_engine.js"
    assert "drawer-backdrop" in sim_content, "exam_simulator.html missing mobile drawer backdrop"
    assert "toast-container" in sim_content, "exam_simulator.html missing toast container"
    assert "Exam 1 — Shireen Khan Gauntlet (65Q)" in sim_content, "exam_simulator.html missing 65Q label for Exam 1"
    assert "Exam 2 — Advanced Architecture & Edge Cases (65Q)" in sim_content, "exam_simulator.html missing 65Q label for Exam 2"
    assert "Combined Mega Mock (130 Questions Pool)" in sim_content, "exam_simulator.html missing 130Q label for Combined"
    assert "Question 1 of 65" in sim_content, "exam_simulator.html question badge mismatch"
    assert "1:40:00" in sim_content, "exam_simulator.html timer display initial format should be 1:40:00 (100 mins)"
    print("✓ exam_simulator.html properly imports all scripts, labels, and 65Q/100m indicators")

    # 6. Check index.html links to exam_simulator.html and shows accurate badges
    with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as fh:
        index_content = fh.read()
    assert "exam_simulator.html" in index_content, "index.html missing link to exam_simulator.html"
    assert "130 Questions" in index_content, "index.html missing 130 Questions badge"
    assert "65Q/100m" in index_content, "index.html missing 65Q/100m badge"
    print("✓ index.html has active links and accurate 130Q / 65Q / 100m badges")

    # 7. Check sw.js caches new assets
    with open(os.path.join(base_dir, "sw.js"), "r", encoding="utf-8") as fh:
        sw_content = fh.read()
    assert "exam_simulator.html" in sw_content, "sw.js missing exam_simulator.html"
    assert "exam_questions_exam1.js" in sw_content, "sw.js missing exam_questions_exam1.js"
    assert "exam_questions_exam2.js" in sw_content, "sw.js missing exam_questions_exam2.js"
    assert "exam_engine.js" in sw_content, "sw.js missing exam_engine.js"
    print("✓ Service Worker (sw.js) caches all simulator assets")

    print("\n=== ALL RIGOROUS VERIFICATION TESTS PASSED SUCCESSFULLY ===")

if __name__ == "__main__":
    test_exams()
