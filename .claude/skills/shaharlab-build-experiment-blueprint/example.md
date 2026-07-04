# Experiment Blueprint: PHQ-9 Pairwise Symptom Comparison
<!-- Human-facing file. Keep it clean, visual, and easy to scan. -->

---

## 1. Experiment Flow

```
   ┌──────────────────────────────────────────┐
   │  WELCOME                                  │  "a few questions, ~5 minutes"
   └──────────────────────────────────────────┘
                         ↓
   ┌──────────────────────────────────────────┐
   │  INSTRUCTIONS                             │  go FULLSCREEN · phones/alerts off
   └──────────────────────────────────────────┘
                         ↓
   ┌──────────────────────────────────────────┐
   │  OVERVIEW                                 │  truthful · no rush · some repeat · anonymous
   └──────────────────────────────────────────┘
                         ↓
   ┌──────────────────────────────────────────┐
   │  READY                                    │  press SPACEBAR to begin
   └──────────────────────────────────────────┘
                         ↓
   ╔══════════════════════════════════════════╗
   ║  PHASE 1 · LIKERT                        ║  11 items, one per page, RANDOM order
   ║  · header + item text                    ║  scale LOCKED 3 s → then clickable
   ║  · 4-point scale                         ║  ↺ loops ×11
   ╚══════════════════════════════════════════╝
                         ↓
   ┌──────────────────────────────────────────┐
   │  PHASE 1 ENDED                            │  transition notice
   └──────────────────────────────────────────┘
                         ↓
   ┌──────────────────────────────────────────┐
   │  PHASE 2 INTRO                            │  "which problem is worse?" · spacebar skips
   └──────────────────────────────────────────┘
                         ↓
   ╔══════════════════════════════════════════╗
   ║  PHASE 2 · PAIRWISE                      ║  55 pairs, one per page, RANDOM order
   ║  · left item  vs  right item             ║  sides random · LOCKED 3 s → clickable
   ║  · click L or R · skip bar below         ║  RT recorded · ↺ loops ×55
   ╚══════════════════════════════════════════╝
                         ↓
   ┌──────────────────────────────────────────┐
   │  FEEDBACK                                 │  "any thoughts/feelings/feedback?"
   └──────────────────────────────────────────┘
                         ↓
   ┌──────────────────────────────────────────┐
   │  THANK YOU                                │  save to Pavlovia · session ends
   └──────────────────────────────────────────┘
```

---

## 2. Settings You Can Tune

| Setting | Value | What it does |
|---|---|---|
| Response lock duration | 3 s | Stimulus appears immediately; clicks are ignored for this long in both phases. |
| RT clock start | Moment options unlock | RT is measured from when the participant is first allowed to respond. |
| Likert item order | Random per participant | Order of the 11 PHQ-9 items is reshuffled each session. |
| Pairwise pair order | Random per participant | Order of the 55 pairs is reshuffled each session. |
| Left/right side per pair | Random per pair | Which item appears on the left vs. right is randomized independently for every trial. |
| Skip-bar label | "They feel extremely similar to me." | Text shown on the middle skip option in Phase 2. |
| Number of Likert items | 11 | All PHQ-9 rows from `assets/phq9.csv`, including 6a/6b/6c and 8a/8b as separate items. |
| Number of pairwise trials | 55 | All unique pairs from 11 items: C(11, 2). |
| Estimated session duration | ~5 min | Shown to participant on the Welcome screen. |

---

## 3. What the Data Looks Like

Each row is one trial. Phase 1 (Likert) rows leave pairwise columns blank; Phase 2 (pairwise) rows leave Likert columns blank.

| participant | phase | trial | item | response | score | left | right | chosen_side | chosen_item | skipped | rt_ms |
|---|---|---|---|---|---|---|---|---|---|---|---|
| PILOT01 | likert | 1 | 4 | Several days | 1 | | | | | | 842 |
| PILOT01 | likert | 2 | 2 | Nearly every day | 3 | | | | | | 1190 |
| PILOT01 | pairwise | 1 | | | | 4 | 2 | right | 2 | false | 1543 |
| PILOT01 | pairwise | 2 | | | | 6a | 8b | skip | | true | 2201 |
| PILOT01 | feedback | 67 | | It was hard to choose. | | | | | | | |

**How to read the rows:**
- *Likert row 1* — item 4 ("tired / little energy") was rated **"Several days"** (score 1); clicked 842 ms after the scale unlocked.
- *Likert row 2* — item 2 was rated **"Nearly every day"** (score 3); clicked 1190 ms after unlock.
- *Pairwise row 1* — items 4 vs 2 were shown; participant clicked the **right** item (item 2) as more bothersome, 1543 ms after unlock.
- *Pairwise row 2* — items 6a vs 8b were shown; participant **skipped** (felt equal); `chosen_item` is blank, `skipped = true`.
- *Feedback row* — open-text response; no RT or item columns apply.

**Expected per participant:** 11 Likert rows + 55 pairwise rows + 1 feedback row = **67 rows**.  
Skipped pairwise trials are kept and flagged; they are not discarded.

---

## 4. Tech Stack

- **jsPsych** v7.x (timeline engine; JS / HTML / CSS)
- **jsPsych plugin:** `jsPsych.plugins.html-button-response` — Likert trials
- **jsPsych plugin:** `jsPsych.plugins.html-button-response` — Pairwise trials (custom layout)
- **jsPsych plugin:** `jsPsych.plugins.survey-text` — open-text feedback trial
- **Pavlovia plugin:** `jsPsychPavlovia` — automatic CSV save to Pavlovia at session end
- **Custom helper:** response-lock module — shows stimulus immediately, blocks clicks for 3 s, then starts the RT clock (not available in stock jsPsych plugins)
- **Stimuli source:** `assets/phq9.csv` — loaded at runtime; pairs generated programmatically
- **Deployment:** Pavlovia GitLab repo; piloted in PILOTING mode before going live
