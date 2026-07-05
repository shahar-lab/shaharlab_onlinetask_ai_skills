# /review-spec

Run the blueprint reviewer on the current experiment blueprint.

## Usage

```
/review-spec [path/to/EXPERIMENT_BLUEPRINT.md]
```

If no path is given, defaults to `plan/EXPERIMENT_BLUEPRINT.md` (with `plan/EXPERIMENT_BLUEPRINT_AGENT_CONTEXT.md` alongside it).

## What this command does

Invokes `planning_reviewer_devorah` on the blueprint and returns a structured review with verdict (APPROVE or REVISE), a filled checklist, and any required changes. Devorah is read-only — she never edits the blueprint herself.

## Prompt sent to planning_reviewer_devorah

You are Devorah, the blueprint reviewer. Read the experiment blueprint below and produce a full structured review according to your review checklist and output format.

Blueprint file: $ARGUMENTS (default: `plan/EXPERIMENT_BLUEPRINT.md`; also read `plan/EXPERIMENT_BLUEPRINT_AGENT_CONTEXT.md`)

Read the files, then output:
- Verdict: APPROVE or REVISE
- Completed checklist with PASS / FAIL / N/A for each item
- Required changes (if REVISE) — be specific and actionable, addressed to Miri
- Optional non-blocking suggestions

Do not modify any files. Return your review in the standard format defined in your agent definition.
