import os
import re
import json

def test_exams():
    print("=== STARTING RIGOROUS EXAM & SIMULATOR VERIFICATION ===")

    # 1. Check files exist
    files = [
        "exam_questions_exam1.js",
        "exam_questions_exam2.js",
        "exam_engine.js",
        "exam_simulator.html",
        "index.html",
        "sw.js"
    ]
    for f in files:
        path = os.path.join("/home/actual/projects/az-104", f)
        assert os.path.exists(path), f"File missing: {path}"
        print(f"✓ File exists: {f} ({os.path.getsize(path)} bytes)")

    # 2. Extract JSON from exam 1 and exam 2
    def extract_exam_data(filename):
        path = os.path.join("/home/actual/projects/az-104", filename)
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        match = re.search(r'window\.AZ104_EXAM_[12]\s*=\s*(\[[\s\S]*?\]);\s*$', content)
        assert match, f"Could not find JSON array in {filename}"
        return json.loads(match.group(1))

    exam1 = extract_exam_data("exam_questions_exam1.js")
    exam2 = extract_exam_data("exam_questions_exam2.js")

    assert len(exam1) == 50, f"Exam 1 must have 50 questions, found {len(exam1)}"
    assert len(exam2) == 50, f"Exam 2 must have 50 questions, found {len(exam2)}"
    print(f"✓ Exam 1 count: {len(exam1)} questions")
    print(f"✓ Exam 2 count: {len(exam2)} questions")
    print(f"✓ Total pool: {len(exam1) + len(exam2)} questions")

    # 3. Check question integrity, uniqueness, and distractor correctness
    all_ids = set()
    all_questions = [("Exam 1", exam1), ("Exam 2", exam2)]
    domain_counts = {}

    for exam_name, q_list in all_questions:
        dist_counts = {}
        for q in q_list:
            qid = q["id"]
            assert qid not in all_ids, f"Duplicate question ID: {qid}"
            all_ids.add(qid)

            assert "topic" in q and len(q["topic"]) > 0, f"Missing topic in {qid}"
            assert "scenario" in q and len(q["scenario"]) > 20, f"Scenario too short in {qid}"
            assert "options" in q and len(q["options"]) >= 4, f"Options < 4 in {qid}"
            assert "correctAnswer" in q, f"Missing correctAnswer in {qid}"
            assert "explanation" in q, f"Missing explanation in {qid}"

            # Check that correctAnswer references valid options
            opt_ids = {opt["id"] for opt in q["options"]}
            if isinstance(q["correctAnswer"], list):
                for ans in q["correctAnswer"]:
                    assert ans in opt_ids, f"Correct answer {ans} not in options {opt_ids} in {qid}"
                ans_str = "+".join(sorted(q["correctAnswer"]))
            else:
                assert q["correctAnswer"] in opt_ids, f"Correct answer {q['correctAnswer']} not in options {opt_ids} in {qid}"
                ans_str = q["correctAnswer"]

            dist_counts[ans_str] = dist_counts.get(ans_str, 0) + 1

            # Check explanation fields
            exp = q["explanation"]
            assert "coreMechanic" in exp, f"Missing coreMechanic in {qid}"
            assert "heuristic" in exp, f"Missing heuristic in {qid}"
            assert "msLearnUrl" in exp and exp["msLearnUrl"].startswith("http"), f"Invalid msLearnUrl in {qid}"

            # Verify distractors do not collide with correct answer
            distractors = exp.get("distractors", {})
            for d_key in distractors:
                assert d_key in opt_ids, f"Distractor key {d_key} not in options {opt_ids} for {qid}"
                if isinstance(q["correctAnswer"], list):
                    assert d_key not in q["correctAnswer"], f"Distractor {d_key} marked as correct in {qid}"
                else:
                    assert d_key != q["correctAnswer"], f"Distractor {d_key} marked as correct in {qid}"

            domain = q.get("domain", "Unknown")
            domain_counts[domain] = domain_counts.get(domain, 0) + 1

        print(f"\n{exam_name} Answer Distribution:")
        for letter in ['A', 'B', 'C', 'D']:
            cnt = dist_counts.get(letter, 0)
            pct = round((cnt / len(q_list)) * 100, 1)
            print(f"  • Option {letter}: {cnt} ({pct}%)")
            assert cnt <= 20, f"Distribution defect: Option {letter} appears {cnt} times (> 40%) in {exam_name}"

    print("\n✓ All 100 questions passed structural, schema & distractor validation!")
    print("\nTotal Domain Distribution:")
    for d, c in sorted(domain_counts.items()):
        print(f"  • {d}: {c} questions")

    # 4. Check index.html links to exam_simulator.html
    with open("/home/actual/projects/az-104/index.html", "r", encoding="utf-8") as f:
        index_content = f.read()
    assert "exam_simulator.html" in index_content, "index.html missing link to exam_simulator.html"
    print("✓ index.html has active links to exam_simulator.html")

    # 5. Check exam_simulator.html loads scripts and essential elements
    with open("/home/actual/projects/az-104/exam_simulator.html", "r", encoding="utf-8") as f:
        sim_content = f.read()
    assert "exam_questions_exam1.js" in sim_content, "exam_simulator.html missing exam_questions_exam1.js"
    assert "exam_questions_exam2.js" in sim_content, "exam_simulator.html missing exam_questions_exam2.js"
    assert "exam_engine.js" in sim_content, "exam_simulator.html missing exam_engine.js"
    assert "drawer-backdrop" in sim_content, "exam_simulator.html missing mobile drawer backdrop"
    assert "toast-container" in sim_content, "exam_simulator.html missing toast container"
    print("✓ exam_simulator.html properly imports all scripts and responsive elements")

    # 6. Check sw.js caches new assets
    with open("/home/actual/projects/az-104/sw.js", "r", encoding="utf-8") as f:
        sw_content = f.read()
    assert "exam_simulator.html" in sw_content, "sw.js missing exam_simulator.html"
    assert "exam_questions_exam1.js" in sw_content, "sw.js missing exam_questions_exam1.js"
    assert "exam_questions_exam2.js" in sw_content, "sw.js missing exam_questions_exam2.js"
    assert "exam_engine.js" in sw_content, "sw.js missing exam_engine.js"
    print("✓ Service Worker (sw.js) caches all simulator assets")

    print("\n=== ALL RIGOROUS VERIFICATION TESTS PASSED SUCCESSFULLY ===")

if __name__ == "__main__":
    test_exams()
