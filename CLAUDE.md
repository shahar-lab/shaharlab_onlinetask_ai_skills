# Experiment Builder — Project Memory

## What this project is

An automated multi-agent pipeline for building, testing, refining, and deploying behavioral experiments using **jsPsych v7.x** on **Pavlovia**. Researchers describe an experiment; the agent pipeline produces a deployable, data-collecting experiment.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Experiment frontend | jsPsych v7.x |
| Deployment / hosting | Pavlovia (GitLab-backed) |
| Pavlovia integration | `@jspsych/plugin-pavlovia` |
| Bundler | Vite (preferred) or CDN fallback |
| Runtime | Node.js (LTS) |
| Data format | jsPsych JSON → CSV |

## Agent pipeline (entry point: Tzadok)

Always start a new experiment build by invoking the **tzadok** orchestrator agent. Do not invoke sub-agents directly unless performing a targeted fix on an already-in-progress build.

```
Researcher request
  → tzadok (orchestrator)
      → planning_team/creator      → planning_team/reviewer
      → jspsych_team/developer     → jspsych_team/editor
      → scaffolding_expert         (quality gate)
      → pavlovia_team/architect    → pavlovia_team/reviewer
  → Deployable experiment
```

Agent definitions live in `.claude/agents/`. See each file for responsibilities, output formats, and constraints.

## Experiment output structure

Every completed experiment is scaffolded as:

```
experiment/
├── index.html
├── src/
│   ├── main.js
│   ├── timeline/
│   ├── stimuli/
│   └── utils/
├── assets/
├── package.json
├── vite.config.js
├── .gitignore
├── EXPERIMENT_SPEC.md
├── IMPLEMENTATION_NOTES.md
└── PAVLOVIA_SETUP.md
```

## Critical rules (read before touching any experiment code)

1. **Relative paths only** — never use absolute file paths; Pavlovia will 404 them.
2. **`pavloviaInit` must be the first trial; `pavloviaFinish` must be the last.**
3. **`localSave` must be guarded** — only fires when `window.location.hostname === 'localhost'`.
4. **One `initJsPsych` call** per experiment.
5. **Plugin `type` fields are imported classes**, not strings (jsPsych 7 API).
6. **`node_modules/` is never committed** — always in `.gitignore`.

## Custom slash commands

| Command | Purpose |
|---------|---------|
| `/build-experiment` | Start a full experiment build from a researcher description |
| `/review-spec` | Run the planning reviewer on an existing spec |
| `/audit-code` | Run the scaffolding expert on current experiment code |
| `/deploy-check` | Run the Pavlovia reviewer on current deployment config |
| `/pipeline-status` | Show current build stage and pending steps |

## Pavlovia manual steps (cannot be automated)

These must be done by a human in the Pavlovia web UI after code is pushed:
1. Create or link the Pavlovia project to the GitLab repo.
2. Set **Status** to PILOTING for testing, RUNNING for live data collection.
3. Set **Data saving** to DATABASE.
4. Configure recruitment platform redirect URL if using Prolific/SONA.

## Common failure modes

| Symptom | Likely cause |
|---------|-------------|
| Data not appearing in Pavlovia dashboard | `pavloviaInit` trial missing or not first |
| 404 on stimuli/assets | Absolute path in `src=` or `fetch()` |
| Experiment ends immediately | `pavloviaFinish` not last trial |
| `localSave` fires on Pavlovia | Missing hostname guard |
| Build fails on GitLab CI | `node_modules` committed, or CI missing install step |
