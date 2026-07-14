# Blueprint Format

Exact contents of the two plan documents. `EXPERIMENT_BLUEPRINT.md` (at `ai_artifacts/plan/`) is the researcher-facing contract; `artifacts/SPECIFICATION.md` is read by the agents that build the experiment.

---

## EXPERIMENT_BLUEPRINT.md — for the researcher

Six sections, in this order: Experiment Flow, Settings You Can Tune, Attention & Robustness Checks, What the Data Looks Like, Project Folder Structure, Tech Stack. The researcher should grasp the whole experiment in one read.

### 1. Experiment Flow

A single ASCII flowchart showing every screen the participant encounters, in order. The flowchart is the entire section.

A screen the participant sees once gets a single-outline box:

```
┌─────────────────────────────┐
│  PAGE TITLE                 │  side annotation
└─────────────────────────────┘
```

A block of screens the participant repeats (a trial loop) gets a double-outline box:

```
╔═════════════════════════════╗
║  BLOCK NAME                 ║  N trials · RANDOM order
║  · what is on screen        ║  ↺ loops ×N
╚═════════════════════════════╝
```

- Connect boxes with a centered `↓`.
- Inside a box: what the participant sees. To the right of a box: order, timing, loop count.

### 2. Settings You Can Tune

Three consecutive tables. The first column header names each table, so the tables follow one another directly:

**Experiment setting · Value · What it does** — the structure of the session: number of blocks, trials per block or phase, stimulus counts, randomization and counterbalancing schemes, estimated duration.

**Trial setting · Value · What it does** — the event sequence inside one trial: each event (fixation, stimulus onset, response lock, response window, feedback, inter-trial interval) with its duration or trigger. If trial types differ, give each type its own table.

**Additional setting · Value · What it does** — every remaining tunable: on-screen labels, condition names, feature toggles.

The **Value** column holds:
- a number with units (`3000 ms`, `55`) — the usual case
- a text label when the setting names a condition (`reward` / `punishment`)
- a distribution when the value is sampled at runtime (`Uniform(400, 800) ms`)

Keep **What it does** to one short sentence.

### 3. Attention & Robustness Checks

A table of the measures that verify the participant was attentive and the data can be trusted, with columns **Check · Used · What is in place**.

The table always opens with these three rows, in this order, and grows one row for every additional measure the experiment uses:

| Check | Used | What is in place |
|---|:---:|---|
| Leaving the window | ✓ or ✗ | ... |
| Response deadline | ✓ or ✗ | ... |
| Infrequency item | ✓ or ✗ | ... |

What each standard check means:

- **Leaving the window** — logging when the participant switches away from the study (tab switch, fullscreen exit, window blur).
- **Response deadline** — a time limit on responding, with a defined consequence when it passes.
- **Infrequency item** — a catch question whose correct answer is obvious to anyone reading it (e.g., "I participated in the Olympic Games of 1974.").

Column rules:

- **Used** — a single mark: ✓ when the measure is part of this experiment, ✗ when it is left out.
- **What is in place** — one short sentence: for a ✓, how the check works in this experiment; for an ✗, how the design handles that risk instead.

Data footprint: when **leaving the window** is used, every trial row carries two extra columns — `window_status` (`ok` / `left`) and `window_left_ms` (time away during that trial) — so include them in Section 4's example table and column guide. The `shaharlab-jspsych-window-monitoring` skill defines how these columns are recorded and reported.

### 4. What the Data Looks Like

Two elements, in this order — nothing else in this section:

1. **An example data table.** Each row is one saved CSV row (one trial). Column headers are the actual output column names. Values are realistic (`PILOT01`, `1543`). Show 3–5 rows covering the different trial types.
2. **A data legend table**, immediately after the data table, with columns **Variable · Levels · Description**. One row per column from the table above.
   - **Variable** — the column name, exactly as it appears in the data table header.
   - **Levels** — the labels a categorical variable can take (`left` / `right`, `ok` / `left`), or the range/type for a numeric or free-form variable (`0–10000`, `integer, ms since trial onset`, `free text`).
   - **Description** — one short sentence on what the column records.

### 5. Project Folder Structure

An ASCII directory tree of the experiment repository, showing every top-level folder and the files inside it — enough that the researcher can find any file mentioned elsewhere in the document. The tree is the entire section; no text follows it. Standard layout:

```
/my_experiment
  ├── index.html
  ├── /js
  │    └── main.js
  │    └── instructions.js
  │    └── quiz.js
  ├── /css
  │    └── custom_styles.css
  ├── /assets
  │    └── stimuli.csv
  └── /ai_artifacts
       ├── /plan
       │    ├── EXPERIMENT_BLUEPRINT.md
       │    └── /artifacts
       │         ├── SPECIFICATION.md
       │         └── CHANGELOG.md
       └── /manuscript-excerpt
            └── method_main.md
            └── method_supplementary.md
```

Add, rename, or drop folders to match what the experiment actually uses (e.g. `/lib` for third-party plugins like the Pavlovia plugin). Keep the tree in sync with the real repository whenever files are added, renamed, or moved.

### 6. Tech Stack

Bare names only, no explanations, grouped under two headings:

**Sources**
- One line per library/runtime with its version (e.g. `jsPsych 8.2.2`, `jspsych-7-pavlovia-2022.1.1`).

**jsPsych plugins**
- One line per plugin package used (e.g. `@jspsych/plugin-html-keyboard-response`).

---

## artifacts/SPECIFICATION.md — for agents

A dense, complete technical design record: everything too technical or detailed for the researcher-facing blueprint. Its test: a future agent can implement or modify the experiment from this file plus the blueprint alone, without asking follow-up questions. When in doubt whether a detail belongs here or in the blueprint, ask the researcher.

Cover, in whatever order fits the experiment:

- Research question, hypotheses, and study rationale
- Experimental design: type, factors, levels, IVs, DVs
- Participant flow with a timing estimate per phase
- Trial-level event sequence and timing for every trial type
- Stimuli: source, count, categories, naming, loading method
- Randomization and counterbalancing rules, including constraints
- Questionnaires and scales: name, item count, response format, scoring
- Data variables: complete column list with names, types, and which phases fill them
- Exclusion criteria, attention checks, and data-quality rules
- Sample size and recruitment notes
- Practical constraints: platform, device, browser, fullscreen
- Project folder structure: the same directory tree as Section 5 of the human blueprint, kept identical between the two files
- Open questions, each marked `[NEEDS INPUT]`
- Risks and implementation watch-outs
- Decisions and quotes from the researcher conversation not captured elsewhere

Writing rules: use headers and bullets to keep it navigable, mark every unknown `[NEEDS INPUT]`, and describe implementation intent in enough detail that code can be written from it.
