# Shahar Lab — Online Experiment Builder Template

A Claude Code multi-agent template for building online psychology experiments (jsPsych 7, deployed on Pavlovia). Describe your experiment in plain language; the AI pipeline interviews you, writes a blueprint, builds the code, reviews it, and deploys it.

---

## Project Structure

```
.
├── .claude/                          # AI pipeline configuration (agents, skills, commands)
├── assets/                           # Stimulus files and data for your experiment
├── experiment/                       # The jsPsych experiment code (built by the AI)
├── manuscript-excerpt/               # Generated method section for publication
└── plan/                             # Experiment blueprint and design documents
```

---

## Folder Guide

### `.claude/`
Configuration and orchestration for the AI pipeline. Contains agents (Dan, Maya, etc.), skills, and commands. You won't edit these files directly — they drive the AI that builds your experiment. 

### `assets/`
**Your stimulus files go here.** Before starting the interview, add:

- **Images** — PNG, JPG files for visual stimuli (e.g., `face_01.png`, `stroop_red.png`)
- **Audio** — WAV, MP3 files for auditory stimuli
- **CSV tables** — stimulus lists, lookup tables, or data templates (e.g., `phq9_items.csv`, `word_list.csv`)
- **JSON files** — structured stimulus data (e.g., `stimuli_set.json`)

Example: if your experiment shows pictures of faces, save them as `assets/face_001.png`, `assets/face_002.png`, etc. The AI will reference them by these paths in the experiment code.

### `experiment/`
The built jsPsych experiment code. Created and managed by the AI during the build pipeline. Contains:
- `index.html` — entry point for Pavlovia deployment
- `preview.html` — local preview (run the experiment without Pavlovia)
- `src/` — JavaScript source code (timeline, trials, helpers)
- `package.json` — JavaScript dependencies
- Other files needed for the experiment to run

### `plan/`
Experiment design documents. The AI creates:
- `EXPERIMENT_BLUEPRINT.md` — human-readable summary (flowchart, settings, data preview, tech stack)
- `EXPERIMENT_BLUEPRINT_AGENT_CONTEXT.md` — detailed design record for the AI builders
- `INTERVIEW_NOTES.md` — your answers from the planning interview

**Read `EXPERIMENT_BLUEPRINT.md` carefully.** This is what the AI will build.

### `manuscript-excerpt/`
Generated publication materials. After your experiment is complete, run `/shaharlab-online-experiment-manuscript-excerpt` to generate:
- `method_main.md` — method section for the main manuscript
- `method_supplementary.md` — supplementary methods detail
