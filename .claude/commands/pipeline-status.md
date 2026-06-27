# /pipeline-status

Show the current experiment build stage and what remains.

## Usage

```
/pipeline-status
```

## What this command does

Inspects the `experiment/` directory for artifact files produced by each pipeline stage and reports which stages are complete, which is current, and what is still pending.

## Prompt

Inspect the `experiment/` directory (or repository root if `experiment/` does not exist yet) and determine the current pipeline stage by checking for the presence of these artifact files:

| Stage | Artifact | Agent |
|-------|----------|-------|
| Planning — Created | `EXPERIMENT_SPEC.md` | planning_team/creator |
| Planning — Reviewed | `EXPERIMENT_SPEC.md` contains `## Verdict: APPROVE` | planning_team/reviewer |
| Development — Done | `src/main.js` exists | jspsych_team/developer |
| Editing — Done | `IMPLEMENTATION_NOTES.md` exists | jspsych_team/editor |
| Scaffolding — Passed | `IMPLEMENTATION_NOTES.md` contains `Scaffolding: PASS` OR no BLOCKING findings in last audit | scaffolding_expert |
| Pavlovia — Wired | `PAVLOVIA_SETUP.md` exists and `@jspsych/plugin-pavlovia` in `package.json` | pavlovia_team/architect |
| Pavlovia — Approved | `PAVLOVIA_SETUP.md` contains `## Verdict: APPROVE` | pavlovia_team/reviewer |

Report using this format:

```
## Experiment Build Pipeline Status

**Experiment:** <title from EXPERIMENT_SPEC.md, or "Unknown">

| Stage | Status |
|-------|--------|
| Planning: Created    | ✓ Done / ⏳ Pending |
| Planning: Reviewed   | ✓ Done / ⏳ Pending |
| Development          | ✓ Done / ⏳ Pending |
| Editing              | ✓ Done / ⏳ Pending |
| Scaffolding audit    | ✓ Done / ⏳ Pending |
| Pavlovia: Wired      | ✓ Done / ⏳ Pending |
| Pavlovia: Reviewed   | ✓ Done / ⏳ Pending |

**Current stage:** <first pending stage>
**Next action:** <what needs to happen next, and which command or agent to use>
```
