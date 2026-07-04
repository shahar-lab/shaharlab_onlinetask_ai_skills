# /pipeline-status

Show the current experiment build stage and what remains.

## Usage

```
/pipeline-status
```

## What this command does

Reads `Plan/PIPELINE_STATE.md` (maintained by Tzadok) if it exists, then verifies it against the artifact files each stage actually produces. Reports which stages are complete, which is current, and what to do next.

## Prompt

First, if `Plan/PIPELINE_STATE.md` exists, read it — it is Tzadok's authoritative stage record. Then verify against the artifacts below (artifacts win if they disagree, and note the discrepancy):

| Stage | Artifact | Agent |
|-------|----------|-------|
| Interview done | `Plan/INTERVIEW_NOTES.md` exists | planning_interviewer_galit |
| Blueprint written | `Plan/EXPERIMENT_BLUEPRINT.md` + `Plan/EXPERIMENT_BLUEPRINT_AGENT_CONTEXT.md` exist | planning_architect_miri |
| Blueprint approved | `Plan/PIPELINE_STATE.md` records Devorah `APPROVE` (or latest Devorah review says `## Verdict: APPROVE`) | planning_reviewer_devorah |
| Code built | `experiment/src/main.js` and `experiment/preview.html` exist; `experiment/ARCHITECTURE_NOTES.md` exists | jspsych_architect_dan |
| Code approved | `Plan/PIPELINE_STATE.md` records Ezra `APPROVE` | jspsych_reviewer_ezra |
| Pavlovia wired | `experiment/PAVLOVIA_SETUP.md` exists and `@jspsych/plugin-pavlovia` in `experiment/package.json` | pavlovia_architect_maya |
| Pavlovia checked | `Plan/PIPELINE_STATE.md` records `PAVLOVIA OK` | pavlovia_architect_maya |

Report using this format:

```
## Experiment Build Pipeline Status

**Experiment:** <title from Plan/EXPERIMENT_BLUEPRINT.md, or "Unknown">

| Stage | Status |
|-------|--------|
| Interview            | ✓ Done / ⏳ Pending |
| Blueprint written    | ✓ Done / ⏳ Pending |
| Blueprint approved   | ✓ Done / ⏳ Pending |
| Code built           | ✓ Done / ⏳ Pending |
| Code approved        | ✓ Done / ⏳ Pending |
| Pavlovia wired       | ✓ Done / ⏳ Pending |
| Pavlovia checked     | ✓ Done / ⏳ Pending |

**Current stage:** <first pending stage>
**Next action:** <what needs to happen next, and which command or agent to use>
```

If nothing exists yet, say the pipeline has not started and point the researcher to `/build-experiment`.
