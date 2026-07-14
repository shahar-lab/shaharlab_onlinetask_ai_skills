# Experiment Blueprint: PHQ-9 Pairwise Symptom Comparison

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
   │  OVERVIEW                                 │  truthful · no rush · anonymous
   └──────────────────────────────────────────┘
                         ↓
   ┌──────────────────────────────────────────┐
   │  READY                                    │  press SPACEBAR to begin
   └──────────────────────────────────────────┘
                         ↓
   ╔══════════════════════════════════════════╗
   ║  PHASE 1 · LIKERT                        ║  11 items + 1 catch · RANDOM order
   ║  · header + item text                    ║  scale LOCKED 3 s → clickable
   ║  · 4-point scale                         ║  ↺ loops ×12
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
   ║  PHASE 2 · PAIRWISE                      ║  55 pairs · RANDOM order
   ║  · left item  vs  right item             ║  sides random · LOCKED 3 s → clickable
   ║  · click L or R · skip bar below         ║  ↺ loops ×55
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

| Experiment setting | Value | What it does |
|---|---|---|
| Number of Likert items | 11 | All PHQ-9 rows from `assets/phq9.csv`, including 6a/6b/6c and 8a/8b. |
| Number of catch items | 1 | One infrequency item mixed into the Likert phase at a random position. |
| Number of pairwise trials | 55 | All unique pairs of the 11 items: C(11, 2). |
| Likert item order | Random per participant | Item order is reshuffled each session. |
| Pairwise pair order | Random per participant | Pair order is reshuffled each session. |
| Left/right assignment | Random per trial | Which item appears on the left vs. right, drawn independently for every pair. |
| Estimated session duration | 5 min | Shown to the participant on the Welcome screen. |


| Trial setting | Value | What it does |
|---|---|---|
| Stimulus onset | 0 ms | Item (or pair) appears the moment the trial starts. |
| Response lock | 3000 ms | Response options are visible but disabled for this long from onset. |
| RT clock start | 3000 ms | RT is measured from the moment options unlock. |
| Response window | Until response | Trial ends on click; responding is self-paced. |
| Inter-trial interval | 0 ms | Next trial starts immediately after the response. |


| Additional setting | Value | What it does |
|---|---|---|
| Likert scale labels | Not at all / Several days / More than half the days / Nearly every day | The 4 response options, scored 0–3. |
| Skip-bar label | "They feel extremely similar to me." | The middle skip option in Phase 2. |
| Fullscreen | On | Requested at the Instructions screen. |

---

## 3. Attention & Robustness Checks

| Check | Used | What is in place |
|---|:---:|---|
| Leaving the window | ✓ | Every trial row records whether the window was left and for how long (`window_status`, `window_left_ms`); each exit also writes a timestamped `attention_event` row. |
| Response deadline | ✗ | Trials are self-paced; extreme RTs are screened during analysis instead. |
| Infrequency item | ✓ | "I participated in the Olympic Games of 1974." appears at a random position among the Likert items; the expected answer is "Not at all". |

---

## 4. What the Data Looks Like

| participant | phase | trial | item | response | score | left | right | chosen_side | chosen_item | skipped | rt_ms | window_status | window_left_ms |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| PILOT01 | likert | 1 | 4 | Several days | 1 | | | | | | 842 | ok | 0 |
| PILOT01 | likert | 7 | attn_check | Not at all | 0 | | | | | | 951 | ok | 0 |
| PILOT01 | pairwise | 20 | | | | 4 | 2 | right | 2 | false | 1543 | ok | 0 |
| PILOT01 | pairwise | 21 | | | | 6a | 8b | skip | | true | 2201 | left | 4210 |
| PILOT01 | feedback | 68 | | It was hard to choose. | | | | | | | | ok | 0 |

| Variable | Levels | Description |
|---|---|---|
| `participant` | free text (e.g. `PILOT01`) | Participant token assigned by Pavlovia. |
| `phase` | `likert` / `pairwise` / `feedback` | Which phase this row belongs to. |
| `trial` | integer, running count | Trial number across the whole session. |
| `item` | PHQ-9 item ID, or `attn_check` | Item rated on this Likert trial, or the catch item. |
| `response` | Likert label, or free text | Likert label clicked, or the free-text feedback. |
| `score` | 0–3 | Numeric Likert score. |
| `left` / `right` | PHQ-9 item ID | Item IDs shown on each side of a pairwise trial. |
| `chosen_side` | `left` / `right` / `skip` | Side the participant picked. |
| `chosen_item` | PHQ-9 item ID, or empty | Item ID the participant picked; empty when skipped. |
| `skipped` | `true` / `false` | Whether the skip bar was used. |
| `rt_ms` | integer, ms | Milliseconds from options unlocking to the click. |
| `window_status` | `ok` / `left` | Whether the window stayed focused and visible for the whole trial. |
| `window_left_ms` | integer, ms | Total milliseconds the window was left during that trial; `0` when `window_status` is `ok`. |

---

## 5. Project Folder Structure

```
/phq9_pairwise
  ├── index.html
  ├── /js
  │    └── main.js
  │    └── config.js
  │    └── intro.js
  │    └── items.js
  │    └── likert.js
  │    └── pairwise.js
  │    └── feedback.js
  │    └── helpers.js
  ├── /css
  │    └── style.css
  ├── /assets
  │    └── phq9.csv
  └── /ai_artifacts
       └── /plan
            ├── EXPERIMENT_BLUEPRINT.md
            └── /artifacts
                 ├── SPECIFICATION.md
                 └── CHANGELOG.md
```

---

## 6. Tech Stack

**Sources**
- jsPsych 7.x
- jspsych-pavlovia

**jsPsych plugins**
- `html-button-response`
- `survey-text`


