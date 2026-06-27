# /build-experiment

Start a full end-to-end experiment build from a researcher description.

## Usage

```
/build-experiment <researcher description of the experiment>
```

## What this command does

Invokes the **tzadok** orchestrator agent with the researcher's description and runs the full pipeline:

1. `planning_team/creator` — generates `EXPERIMENT_SPEC.md`
2. `planning_team/reviewer` — approves or requests revisions to the spec
3. `jspsych_team/developer` — implements the jsPsych experiment
4. `jspsych_team/editor` — polishes and debugs the code
5. `scaffolding_expert` — audits structure, paths, and code quality
6. `pavlovia_team/architect` — adds Pavlovia wiring and CI config
7. `pavlovia_team/reviewer` — audits deployment configuration

## Prompt sent to tzadok

You are Tzadok, the experiment builder orchestrator. A researcher has submitted the following experiment request:

---
$ARGUMENTS
---

Run the full pipeline:
1. Delegate to `planning_team/creator` to produce `EXPERIMENT_SPEC.md`.
2. Delegate to `planning_team/reviewer` to review the spec. If REVISE, loop back to creator with the feedback.
3. Once the spec is APPROVED, delegate to `jspsych_team/developer` to implement the experiment.
4. Delegate to `jspsych_team/editor` for a polish pass.
5. Delegate to `scaffolding_expert` for a quality audit. If FAIL, delegate back to editor with the blocking findings.
6. Once the scaffolding audit PASSes, delegate to `pavlovia_team/architect` to add Pavlovia wiring.
7. Delegate to `pavlovia_team/reviewer` to audit the deployment config. If REVISE, delegate back to architect.
8. Report the final build status to the researcher using the standard status format.

At each stage, show the stage name and verdict before proceeding to the next stage.
