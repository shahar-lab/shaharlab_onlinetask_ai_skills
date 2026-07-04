# Shahar Lab — Online Experiment Builder Template

A Claude Code multi-agent template for building online psychology experiments (jsPsych 7, deployed on Pavlovia). You describe your experiment in plain language; the AI pipeline interviews you, writes a human-readable blueprint, builds the code, reviews it, and wires up Pavlovia.

## Setup (once per experiment)

1. **Clone this repo** (one copy per experiment) and open it in Claude Code:
   ```
   git clone <this-repo-url> my_experiment
   cd my_experiment
   claude
   ```
2. **Install prerequisites:** Node.js (LTS) and Python 3 (used only to serve local previews).
3. **Optional but recommended — Playwright MCP** (needed for the visual auditor, Natan):
   ```
   claude mcp add playwright -- npx @playwright/mcp@latest
   ```

## Building your experiment

```
/build-experiment a Stroop task with 2 blocks of 48 trials and a PHQ-9 at the end
```

The pipeline will:
1. **Interview you** (Galit) — answer one topic at a time.
2. **Write the blueprint** (Miri) — check `Plan/EXPERIMENT_BLUEPRINT.md`; this is *your* document. Read it carefully; it is what gets built.
3. **Review the blueprint** (Devorah), **build the code** (Dan), **review the code** (Ezra), **wire Pavlovia** (Maya).

Useful commands: `/pipeline-status` (where am I?), `/review-spec`, `/audit-code`, `/deploy-check`, `/manuscript-method` (write your method section at the end).

## Previewing locally

```
python -m http.server 8000
```
Then open `http://localhost:8000/preview.html`. Data is not sent to Pavlovia in preview mode; a CSV downloads at the end.

## Rules of the road

- Put your stimulus files (images, audio, CSV tables) in `experiment/assets/` before or during the interview.
- Never delete `preview.html` or the `IS_PREVIEW` code block — the pipeline depends on them.
- If you edit code by hand, run `/deploy-check` and `/audit-code` afterwards.
