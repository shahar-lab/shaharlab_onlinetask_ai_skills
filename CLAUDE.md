# Shahar Lab — Online Experiment Builder

This repository is a **template** for building online psychology experiments (jsPsych 7 + Pavlovia) with a multi-agent AI pipeline. Students clone it once per experiment. The AI's job: interview the researcher, produce a human-readable blueprint, then build, review, and deploy the experiment code.

## How to start

- New experiment: run `/build-experiment <short description>` (or just ask **tzadok**).
- Check progress anytime: `/pipeline-status`.
- Other entry points: `/review-spec`, `/audit-code`, `/deploy-check`, `/manuscript-method`.

## The pipeline

```
Researcher → galit (interview) → miri (blueprint) → devorah (review gate)
          → dan (jsPsych code) → ezra (review gate) → maya (Pavlovia wiring + self-audit)
          → natan (live visual audit, on demand) → baruch (manuscript method, at the end)
```

**tzadok** orchestrates and maintains `Plan/PIPELINE_STATE.md`. Review gates are never skipped: Devorah must APPROVE before Dan codes; Ezra must APPROVE before Maya wires Pavlovia; any REVISE/FAIL/BROKEN goes back to the originating agent — never pass partial work downstream.

## Canonical artifact files

| File | Owner | Purpose |
|------|-------|---------|
| `Plan/INTERVIEW_NOTES.md` | Galit | Researcher's answers |
| `Plan/EXPERIMENT_BLUEPRINT.md` | Miri | Human-readable design (4 fixed sections) |
| `Plan/EXPERIMENT_BLUEPRINT_AGENT_CONTEXT.md` | Miri | Exhaustive spec for coding agents |
| `Plan/PIPELINE_STATE.md` | Tzadok | Stage + gate verdicts |
| `experiment/` | Dan (code), Maya (`index.html`, `preview.html`, Pavlovia) | The experiment |
| `experiment/ARCHITECTURE_NOTES.md` | Dan | Implementation decisions |
| `experiment/PAVLOVIA_SETUP.md` | Maya | Deployment status + manual steps |
| `docs/contracts/IS_PREVIEW.md` | shared | Single source of truth for the preview/Pavlovia guard |
| `manuscript_snippets/` | Baruch | Method section drafts |

Do not use the legacy names `EXPERIMENT_SPEC.md` or `IMPLEMENTATION_NOTES.md` — they are from an older version of this pipeline.

## Hard rules

- The `IS_PREVIEW` guard (`docs/contracts/IS_PREVIEW.md`) is never removed or restructured; `preview.html` must stay functional after every change.
- Reviewer agents (Devorah, Ezra, Natan) are read-only by design — they report, never edit.
- All paths in experiment code are relative; stimuli live in `experiment/assets/` and are referenced in place.
- Model choice: all agents use the session default model deliberately — the reviewers are the safety net, so we do not downgrade them to a cheaper model.
