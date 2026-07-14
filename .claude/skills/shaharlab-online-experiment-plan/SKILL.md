---
name: shaharlab-online-experiment-plan
description: Creates and maintains the experiment plan — EXPERIMENT_BLUEPRINT.md (the binding researcher–AI contract) plus the agent-facing artifacts folder (SPECIFICATION.md, CHANGELOG.md) in ai_artifacts/plan/. Use right after the planning interview and whenever the design or the experiment code changes.
---

# Skill: Shahar Lab Online Experiment Plan

Creates and maintains the experiment plan in `ai_artifacts/plan/`: a single researcher-facing contract file at the root, plus an `artifacts/` folder holding everything the agents need to understand and track the project.

## Plan folder structure

```
/ai_artifacts
  └── /plan
       ├── EXPERIMENT_BLUEPRINT.md      ← researcher-facing contract (root, always)
       └── /artifacts                   ← agent-facing support files
            ├── SPECIFICATION.md        ← technical design record for agents
            ├── CHANGELOG.md            ← reverse-chronological log of all AI file changes
            └── ...                     ← anything else agents need to understand the project
```

## EXPERIMENT_BLUEPRINT.md is a binding contract

`EXPERIMENT_BLUEPRINT.md` is the contract between the researcher (human) and the AI:

- **Everything in the blueprint must be implemented exactly** in the project. No silent deviations — if the code must diverge, the blueprint is updated first, with the researcher's approval.
- **Every relevant change the AI makes must be reflected in the blueprint.** If an update changes anything the blueprint describes (flow, settings, checks, data, structure, stack), the blueprint is updated in the same piece of work.
- To keep the blueprint readable, technical detail that the researcher does not need lives in `artifacts/` instead — never omit it, relocate it.

## The files

| File | Audience | What it is |
|---|---|---|
| `ai_artifacts/plan/EXPERIMENT_BLUEPRINT.md` | Researcher | At-a-glance summary: flowchart, tunable settings, attention checks, data preview, tech stack, project folder structure. |
| `ai_artifacts/plan/artifacts/SPECIFICATION.md` | Agents | Complete technical design record: every configuration and detail too technical or fine-grained for the blueprint, sufficient to build or modify the experiment. |
| `ai_artifacts/plan/artifacts/CHANGELOG.md` | Agents & researcher | Reverse-chronological log of every AI file modification (format below). |

The exact contents of the blueprint and the specification are defined in [`blueprint-format.md`](blueprint-format.md). Read that spec before writing either file. Worked examples: [`example_blueprint.md`](example_blueprint.md) and [`example_specification.md`](example_specification.md).

## CHANGELOG.md rules

Every time an agent modifies, creates, or deletes project files, it must immediately document the work by **prepending** a new entry to the top of `artifacts/CHANGELOG.md` (reverse-chronological order, zero silent edits). Entry format:

```markdown
## [YYYY-MM-DD] - [Topic Title]

- **Request:** summary of the researcher's prompt
- **Files Modified:** explicit file paths
- **Changes Made:** specific technical details of the edits
- **Status/Tests:** current run or test state

---
```

## Keeping the blueprint in sync after code changes

The coding agent never decides whether a change is "blueprint-worthy" — after every code change, its changelog entry is routed to the plan owner (Miri), who makes the sync decision. The decision ladder, applied per change:

1. **Contract-level** — the change touches anything the blueprint describes (participant-visible flow or text, timing values, trial counts, settings, attention checks, data columns, folder structure, tech stack): update `EXPERIMENT_BLUEPRINT.md` (and `SPECIFICATION.md` where they overlap). No researcher approval needed when the researcher already requested or approved the change — this is bookkeeping, not a new decision.
2. **Technical-level** — the change matters for future agents but not for the researcher (internal refactors, helper logic, CSS internals, variable renames): update `SPECIFICATION.md` only.
3. **Trivial** — nothing the plan documents is affected (comment fixes, formatting, dead-code removal): the CHANGELOG.md entry is the record; no plan edit.

Escalate to the researcher **only** when the change alters the contract in a way the researcher has not already requested or approved, or when it is genuinely ambiguous which rung applies. Do not ask about routine syncs — the pipeline must keep running.

## How to run

1. **Pick the mode.** If `ai_artifacts/plan/EXPERIMENT_BLUEPRINT.md` already exists you are updating; otherwise you are creating.

2. **Create** — create the folder structure above and write `EXPERIMENT_BLUEPRINT.md` and `artifacts/SPECIFICATION.md` from the conversation context, following `blueprint-format.md`. Seed `artifacts/CHANGELOG.md` with the creation entry.

3. **Update** — read the existing blueprint and specification first. Apply the changes requested in the current conversation and leave everything else as it is, including unresolved `[NEEDS INPUT]` markers. When a change touches a value that appears in both files, update it in both. Log the update in `artifacts/CHANGELOG.md` per the format above.

## Ground rules

- When a detail is unknown, write `[NEEDS INPUT]` — a marked gap gets resolved; an invented value gets built.
- When unsure whether something belongs in the blueprint (researcher contract) or the specification (technical detail), **always ask the researcher** — never decide silently.
- All plan files are documentation: prose, tables, and diagrams. Code lives in the experiment repository.
