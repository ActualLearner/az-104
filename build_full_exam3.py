#!/usr/bin/env python3
import json
import os
from exam3_d1 import get_domain1_questions
from exam3_d2 import get_domain2_questions
from exam3_d3 import get_domain3_questions
from exam3_d4 import get_domain4_questions
from exam3_d5 import get_domain5_questions

def build():
    d1 = get_domain1_questions()
    d2 = get_domain2_questions()
    d3 = get_domain3_questions()
    d4 = get_domain4_questions()
    d5 = get_domain5_questions()

    all_q = d1 + d2 + d3 + d4 + d5
    print(f"Total questions: {len(all_q)}")
    assert len(all_q) == 65, f"Expected 65, got {len(all_q)}"

    # Check IDs, unique topics, unique scenarios
    ids = set()
    topics = set()
    scenarios = set()
    counts = {'A': 0, 'B': 0, 'C': 0, 'D': 0}
    multi = 0

    for idx, q in enumerate(all_q):
        expected_id = f"e3-q{idx+1:02d}"
        assert q["id"] == expected_id, f"ID mismatch: {q['id']} vs {expected_id}"
        assert q["id"] not in ids, f"Duplicate ID: {q['id']}"
        ids.add(q["id"])

        assert q["topic"] not in topics, f"Duplicate topic: {q['topic']}"
        topics.add(q["topic"])

        assert q["scenario"] not in scenarios, f"Duplicate scenario in {q['id']}"
        scenarios.add(q["scenario"])

        ans = q["correctAnswer"]
        if isinstance(ans, list):
            multi += 1
            assert q["questionType"] == "multiple"
            for a in ans:
                assert a in ['A', 'B', 'C', 'D', 'E']
        else:
            counts[ans] += 1
            assert q["questionType"] == "single"

        # Check explanation
        exp = q["explanation"]
        for k in ["verdict", "triggerConstraints", "flawedMentalModel", "coreMechanic", "distractors", "heuristic", "msLearnUrl"]:
            assert k in exp and len(str(exp[k])) > 0, f"Missing {k} in {q['id']}"

        assert exp["msLearnUrl"].startswith("https://learn.microsoft.com")

        # Check distractors
        opt_ids = [o["id"] for o in q["options"]]
        correct_set = set(ans) if isinstance(ans, list) else {ans}
        wrong_set = set(opt_ids) - correct_set

        for d_key in exp["distractors"]:
            assert d_key in opt_ids, f"Distractor {d_key} not in options for {q['id']}"
            assert d_key not in correct_set, f"Distractor {d_key} is correct in {q['id']}"

        for w_key in wrong_set:
            assert w_key in exp["distractors"], f"Missing distractor {w_key} in {q['id']}"

    print("Answer distribution:")
    for k in ['A', 'B', 'C', 'D']:
        print(f"  {k}: {counts[k]} ({counts[k]/65*100:.1f}%)")
    print(f"  Multi: {multi} ({multi/65*100:.1f}%)")

    # Output file
    out_path = "/home/actual/projects/az-104/exam_questions_exam3.js"
    json_str = json.dumps(all_q, indent=2)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("window.AZ104_EXAM_3 = " + json_str + ";\n")

    print(f"Successfully wrote {os.path.getsize(out_path)} bytes to {out_path}")

if __name__ == "__main__":
    build()
