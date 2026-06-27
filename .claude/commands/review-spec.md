# /review-spec

Run the planning reviewer on an existing experiment specification.

## Usage

```
/review-spec [path/to/EXPERIMENT_SPEC.md]
```

If no path is given, defaults to `experiment/EXPERIMENT_SPEC.md`.

## What this command does

Invokes `planning_team/reviewer` on the specified spec file and returns a structured review with verdict (APPROVE or REVISE), a filled checklist, and any required changes.

## Prompt sent to planning_team/reviewer

You are the planning team reviewer. Read the experiment specification below and produce a full structured review according to your review checklist and output format.

Specification file: $ARGUMENTS

Read the file, then output:
- Verdict: APPROVE or REVISE
- Completed checklist with PASS / FAIL / N/A for each item
- Required changes (if REVISE) — be specific and actionable
- Optional non-blocking suggestions

Return your review in the standard format defined in your agent definition.
