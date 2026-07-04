# Skill: Shaharlab Experiment Blueprint Builder

## When to use
Invoke this skill when the team needs a clear, implementation-ready blueprint for a new behavioral experiment. Use it after the research interview or when the researcher has enough information to describe the study, but before detailed coding or deployment planning.

---

## Goal
Produce **two files** inside a `Plan/` folder at the project root. These two files together constitute the experiment blueprint.

| File | Audience | Purpose |
|---|---|---|
| `Plan/EXPERIMENT_BLUEPRINT.md` | **Human (researcher)** | Clean, visual, at-a-glance summary of the experiment. Strictly formatted. |
| `Plan/EXPERIMENT_BLUEPRINT_AGENT_CONTEXT.md` | **Agent only** | Dense context dump — all details, nuance, open questions, and raw notes from the conversation. The researcher will never read this file. |

Both files must be created or updated together every time this skill runs.

---

## Mode detection: Create vs. Update

Before writing anything, check whether `Plan/EXPERIMENT_BLUEPRINT.md` already exists.

### Create mode (files do not exist)
- Generate both files from scratch using the conversation context.
- Mark every unknown as `[NEEDS INPUT]`.
- No changelog entry needed.

### Update mode (files already exist)
- **Read both existing files first** before writing anything.
- Apply only the changes described in the current request. Do not regenerate sections that were not mentioned.
- Preserve all `[NEEDS INPUT]` markers that have not been resolved in this conversation.
- At the very top of `Plan/EXPERIMENT_BLUEPRINT_AGENT_CONTEXT.md`, add or update a `## Changelog` section. Each entry is one line:
  ```
  - YYYY-MM-DD: <one sentence describing what changed and why>
  ```
- Do not add a changelog to the human-facing file.
- If a change affects the human-facing file (e.g., a setting value changed, a new phase was added), update that section too. If the change is agent-context-only (e.g., a hypothesis was refined, an open question was resolved), update only the agent context file.

---

## File 1: EXPERIMENT_BLUEPRINT.md (human-facing)

This file is for the researcher. It must be **extremely clear**, visually clean, and easy to scan. It contains **exactly four sections** in this order. Do not add or remove sections.

### Section 1 — Experiment Flow

Use an ASCII flowchart to show every screen/page in order. Follow these rules exactly:

**Single-outline box** — use for any screen the participant sees exactly once:
- Welcome, instructions, overview, ready, transition notices, intro screens, feedback, thank you
- Rule: one occurrence = single outline
```
┌─────────────────────────────┐
│  PAGE TITLE                  │  brief note about what's on this screen
└─────────────────────────────┘
```

**Double-outline box** — use for any block of screens that repeats (a trial loop):
- Likert trial block, pairwise trial block, practice blocks, any repeated questionnaire items
- Rule: the participant goes through this screen more than once = double outline
```
╔══════════════════════════════════╗
║  BLOCK NAME                      ║  N trials · RANDOM order
║  · what participant sees line 1  ║  key timing note
║  · what participant sees line 2  ║  ↺ loops ×N
╚══════════════════════════════════╝
```

Additional rules:
- Connect all boxes with a vertical arrow `↓` centered on the boxes.
- Keep text inside boxes to what is visible on screen. Put context (order, timing, loop count) in the side annotation to the right of the closing edge.
- Do not describe data schema inside the flowchart — that goes in Section 3.

### Section 2 — Settings You Can Tune

A markdown table with exactly three columns: **Setting · Value · What it does**.

- Include every parameter that a researcher might want to change without rewriting code: timing values, trial counts, randomization flags, labels, durations, and so on.
- Keep the "What it does" column to one short sentence.
- Do not include implementation internals (variable names, plugin options, etc.).

### Section 3 — What the Data Looks Like

A markdown table showing **example data rows**, where each row is one trial. Include a short sentence above the table explaining what one row represents.

Rules:
- Show at least 3–4 representative example rows (mix of conditions/phases if applicable).
- Column headers must be the actual output column names that will appear in the CSV.
- Use realistic but anonymized example values (e.g., `PILOT01`, not `participant_id_here`).
- After the table, add a brief "How to read the rows" section with one bullet per example row explaining what it shows.
- Note the expected total row count per participant.

### Section 4 — Tech Stack

A short bulleted list of:
- jsPsych version
- All jsPsych plugins used (name + version)
- Pavlovia plugin (if used)
- Any custom helpers or non-standard components
- Deployment platform and method

Keep each bullet to one line. No prose.

---

## File 2: EXPERIMENT_BLUEPRINT_AGENT_CONTEXT.md (agent-facing)

This file is **never shown to the researcher**. Its purpose is to give a future agent everything it needs to implement or modify the experiment without asking follow-up questions.

Include all of the following, in any order that is logical for the experiment:

- Full research question, hypotheses, and study rationale
- Complete experimental design (factors, levels, DVs, IVs, design type)
- Full participant flow with timing estimates per phase
- Complete trial-level event sequence and timing for every phase
- All stimuli: source, count, categories, naming, and how they are loaded
- All randomization and counterbalancing rules, including any constraints
- All questionnaires and scales: name, item count, response format, scoring, timing
- Complete list of data variables to record per trial, including column names and types
- Exclusion criteria, attention checks, and data quality rules
- Sample size and recruitment notes
- All practical constraints: platform, device, browser, fullscreen, mobile exclusion
- All open questions marked clearly as `[NEEDS INPUT]`
- All risks, design concerns, and implementation watch-outs
- Any raw notes, quotes, or decisions recorded during the research conversation that are not captured elsewhere

Writing rules for this file:
- Dense and complete. Do not summarize. If in doubt, include it.
- Use `[NEEDS INPUT]` for anything unknown or unresolved.
- Use headers and bullets freely to keep it navigable, but do not sacrifice completeness for polish.
- Do not write code, but do describe implementation intent in enough detail that code can be written from it.

---

## General writing rules (both files)

- Do not invent details. If something is unknown, write `[NEEDS INPUT]`.
- Do not skip required sections in the human file.
- Do not write code in either file.
- Prefer explicit and unambiguous wording over vague summaries.

---

## Final check

Before finishing, verify:
- [ ] `Plan/EXPERIMENT_BLUEPRINT.md` has exactly 4 sections in the correct order.
- [ ] The flowchart uses double-outline boxes for trial loops and single-outline for single screens.
- [ ] The settings table has exactly 3 columns.
- [ ] The data table shows real column names and realistic example values.
- [ ] `Plan/EXPERIMENT_BLUEPRINT_AGENT_CONTEXT.md` covers every topic listed above.
- [ ] All unknown details are marked `[NEEDS INPUT]` in both files.

See `example.md` and `example_supplementary.md` in this skill folder for worked examples of both files.
