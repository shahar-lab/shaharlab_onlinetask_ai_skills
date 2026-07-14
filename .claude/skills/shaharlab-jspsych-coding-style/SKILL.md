---
name: shaharlab-jspsych-coding-style
description: Enforce ShaharLab's plain-script architecture whenever Claude creates, modifies, reviews, or troubleshoots JavaScript for a jsPsych experiment. Use for phase scripts, screens, trials, loops, instruction or consent screens, configuration variables, shared helpers, stimuli, timelines, index.html, setup, and local-dev switches.
---

# ShaharLab jsPsych Coding Style

## Context

ShaharLab experiments are jsPsych studies deployed to Pavlovia and recruited through
Prolific. Every experiment follows the same architecture: plain `<script>` includes and
browser globals — no ES modules, no bundler, no build step — so a researcher can read,
run, and tweak any file directly. This skill defines that architecture and the coding
rules that keep it intact. Apply it to every jsPsych `.js` and `index.html` change, and
preserve the architecture unless the researcher explicitly approves a structural migration.

## Project structure

```
index.html            The sole orchestrator: loads everything in dependency order,
                      calls initJsPsych() once, assembles the master timeline,
                      guards Pavlovia behind PAVLOVIA_PLUGIN_ACTIVATE, calls jsPsych.run() once.
local_dev.js          Repo root. PAVLOVIA_PLUGIN_ACTIVATE flag + CONFIG_LOCAL_DEV test overrides —
                      the only file a researcher edits for a local test run.
js/
  config.js           Experiment-wide settings and validated content (CONFIG, item
                      pools, attention checks, completion code). Loads first in js/.
  helpers.js          Only helpers genuinely reused across phases.
  setup.js            Environment/session setup: initJsPsych options, per-run IDs,
                      Pavlovia init/finish nodes, local CSV-save fallback.
  <phase>.js          One file per phase (e.g. instructions.js, likert.js,
                      pairwise.js, feedback.js). Each is a plain top-level script
                      that pushes its trials onto the shared `timeline` array.
css/style.css         Experiment styling, layered on the global white/black base.
lib/                  Pavlovia bridge script — injected by Pavlovia at deploy time,
                      never vendored locally (404s harmlessly in local dev).
data/                 Where Pavlovia writes participant CSVs (keep with .gitkeep).
ai_artifacts/plan/    The experiment blueprint — the authoritative design source.
```

Load order in `index.html`: jsPsych core + CSS → plugins → jQuery → Pavlovia bridge →
global CSS override → `local_dev.js` → `js/config.js` → `js/helpers.js` → `js/setup.js` →
inline ENVIRONMENT SETUP → phase scripts in flow order → inline SAVE AND CLOSE →
`jsPsych.run()`.

## References — read before writing

Each part of the codebase has a dedicated reference with its own procedure, coding rules,
example, and validation checklist. **Before creating, adapting, or updating any of the
following, read its reference first and follow its coding rules exactly:**

| Working on | Read first |
|---|---|
| `index.html` — creation or regeneration, Pavlovia integration, script load order | [references/index-html.md](references/index-html.md) |
| `local_dev.js` — the `PAVLOVIA_PLUGIN_ACTIVATE` flag and `CONFIG_LOCAL_DEV` test-run overrides | [references/local-dev-js.md](references/local-dev-js.md) |
| `js/config.js` — settings, timing, prompts, labels, item pools, attention checks, completion codes | [references/config-js.md](references/config-js.md) |
| `js/setup.js` — session identifiers, data stamping, Pavlovia init/finish nodes, local CSV fallback | [references/setup-js.md](references/setup-js.md) |
| Instruction, consent, or multi-page informational screens | [references/instructions.md](references/instructions.md) |
| Phase scripts, trial procedures, repeating timeline blocks | [references/timeline-blocks.md](references/timeline-blocks.md) |

A change that spans several parts (e.g. a new phase that adds config keys and a script tag)
requires each matching reference.

## General jsPsych coding rules

- **jsPsych 8.** Pin the core to `8.x` and plugins to their matching `2.x` line. Note the
  v8 API: `button_html` is a function `(choice, choiceIndex) => html` — the `%choice%`
  string template no longer exists.
- `initJsPsych()` and `jsPsych.run()` appear only in `index.html`'s inline script, each
  exactly once. Phase files never call them.
- Phase scripts push their own trials onto the shared global `timeline` and never touch
  another phase's nodes; only `index.html` creates `timeline` and runs it.
- Prefer `timeline_variables` when many trials share one structure and differ only in
  data. Ordinary loops are fine when they express real generation logic — pair
  generation, accumulated instruction pages, per-trial closures.
- Timing, labels, fixed wording, and feature flags live in `js/config.js`; test-only
  overrides live in `local_dev.js`. Never duplicate either in phase scripts.
- Give every saved trial an explicit, meaningful `data` object. Keep column names and
  value types stable across the study.
- Participant-facing text comes from the blueprint, validated materials, or explicit
  researcher instructions — never invented, never silently reworded.
- Comment non-obvious behavior and invariants only; do not narrate straightforward syntax.
- If a referenced deployment-critical file (Pavlovia bridge, credentials, pinned vendor
  library) is missing or its path looks wrong, stop and ask the researcher via Tzadok —
  do not recreate, rename, or source a replacement on your own judgment.

## Verification

Before completing any JavaScript change:

- Every phase script loads once from `index.html`, in the intended participant-flow order,
  after the ENVIRONMENT SETUP block and before SAVE AND CLOSE.
- `initJsPsych()` and `jsPsych.run()` each occur exactly once, both in `index.html`.
- `local_dev.js`, `config.js`, and `helpers.js` load before their consumers.
- No shared setting is duplicated; every changed identifier has compatible consumers.
- Syntax-check every changed file; search for stale names, missing script tags, and
  undefined globals.
- Run the local smoke check (`PAVLOVIA_PLUGIN_ACTIVATE = false`) when a runnable local mode exists, and
  pass the validation checklist of every reference you applied.
