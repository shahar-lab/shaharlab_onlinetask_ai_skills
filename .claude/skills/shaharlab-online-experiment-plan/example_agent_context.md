# Experiment Blueprint — Agent Context: PHQ-9 Pairwise Symptom Comparison

## Changelog
- 2026-07-05: Window monitoring now stamps per-trial `window_status` / `window_left_ms` columns alongside the `attention_event` audit rows.
- 2026-07-05: Added attention & robustness checks — window-leave logging and an infrequency catch item; Phase 1 is now 12 trials (68 rows per participant).
- 2026-07-01: Confirmed skip-bar wording with the researcher; updated Phase 2 trial-level notes.

---

## Research Question and Rationale

The PHQ-9 is a standard 9-item (11-row in this implementation) self-report scale for depression symptoms. Its Likert format captures frequency but not the relative importance participants assign to individual symptoms. This study adds a pairwise forced-choice phase to derive a within-person preference ordering of symptoms, supplemented by reaction times as a continuous measure of choice difficulty or salience.

Primary question: Does the pairwise preference ordering of PHQ-9 symptoms correlate with Likert ratings, and does RT carry additional signal about symptom salience?

Secondary questions:
- Do participants show consistent (low-variance) pairwise orderings?
- Do RTs increase for "hard" pairs (items with similar Likert ratings)?
- Does skip rate vary with the Likert score distance between paired items?

Hypotheses:
- Items rated higher on the Likert will be chosen more often in pairwise comparisons (convergent validity).
- Pairs with similar Likert scores will produce longer RTs and higher skip rates.

Study type: Exploratory pilot. Confirmatory design to be specified after piloting.

---

## Experimental Design

- Design: within-subjects, single-session, two-phase
- Factors: Phase (Likert vs. Pairwise) — within-subjects; Item identity — within-subjects
- IVs: PHQ-9 item identity; pair composition; left/right side assignment (randomized per pair)
- DVs:
  - Phase 1: Likert rating (0–3), RT from scale-unlock to click
  - Phase 2: chosen item ID, chosen side (left/right/skip), skip flag (boolean), RT from options-unlock to click
- No control condition; no manipulation checks planned for pilot

---

## Participant Flow and Timing

1. **Welcome** — single screen; "a few questions, ~5 minutes"; no response required
2. **Instructions** — single screen; enter fullscreen; silence phone and alerts
3. **Overview** — single screen; truthful responses; no rush; some questions may feel similar; anonymous
4. **Ready** — single screen; press Spacebar to begin
5. **Phase 1 · Likert** — 12 trials (11 PHQ-9 items + 1 catch item), ~2–3 min estimated
6. **Phase 1 ended notice** — single transition screen
7. **Phase 2 intro** — single screen; "which problem bothers you more?"; Spacebar advances
8. **Phase 2 · Pairwise** — 55 trials, ~2–3 min estimated
9. **Feedback** — single screen; open-text input; "any thoughts, feelings, or feedback?"
10. **Thank you** — data saved to Pavlovia; session ends

No breaks planned. No branching paths. All participants complete both phases in the same order.

---

## Trial-Level Event Sequence and Timing

### Phase 1 — Likert trial

| t | Event |
|---|---|
| 0 ms | Item text displayed (header + PHQ-9 item question) |
| 0 ms | 4-point scale visible; all buttons disabled (locked) |
| 3000 ms | Scale unlocks; RT clock starts |
| 3000 ms + RT | Participant clicks a rating; trial ends |
| immediately | Advance to next trial (no ITI specified) |

- 4-point scale labels (verbatim, scored 0–3): Not at all · Several days · More than half the days · Nearly every day
- Header question (verbatim): "Over the last 2 weeks, how often have you been bothered by the following problems?" [NEEDS INPUT — confirm whether header appears on every trial or only once before the block]

### Phase 2 — Pairwise trial

| t | Event |
|---|---|
| 0 ms | Both items displayed in left/right positions |
| 0 ms | All response options locked (left button, right button, skip bar) |
| 3000 ms | Options unlock; RT clock starts |
| 3000 ms + RT | Participant clicks left, right, or skip bar; trial ends |
| immediately | Advance to next trial (no ITI specified) |

- Skip bar label (verbatim): "They feel extremely similar to me."
- Left/right assignment: randomized independently per pair at runtime

---

## Stimuli and Materials

- Source file: `assets/phq9.csv`
- All 11 rows used as-is; items 6a, 6b, 6c and 8a, 8b are kept as separate entries
- One infrequency catch item, ID `attn_check`, text (verbatim): "I participated in the Olympic Games of 1974." — shuffled in with the Likert items, excluded from the PHQ-9 total and from the pairwise pool
- Item text loaded from CSV at runtime
- Pairs generated programmatically from the 11 PHQ-9 items: C(11, 2) = 55 unique pairs
- Text only; no images, audio, or video
- [NEEDS INPUT — confirm exact item text for all 11 rows from the CSV, especially 6a/6b/6c and 8a/8b]

---

## Randomization and Counterbalancing

- Likert item order: fully random per participant (catch item shuffled in with the 11 PHQ-9 items); no constraints
- Pairwise pair order: fully random per participant; no constraints
- Left/right side per pair: fully random per pair presentation; independent of pair order
- No consecutive-trial constraints
- [NEEDS INPUT — use a fixed random seed for reproducibility, or generate fresh each session?]

---

## Questionnaires and Scales

| Name | Phase | Items | Format | Scoring | Notes |
|---|---|---|---|---|---|
| PHQ-9 (adapted) | Phase 1 | 11 | 4-point Likert | 0–3 per item; total 0–33 | Standard wording; items from CSV; 6a/6b/6c and 8a/8b kept separate |
| Infrequency catch item | Phase 1 | 1 | 4-point Likert | Pass = "Not at all" (score 0) | "I participated in the Olympic Games of 1974."; excluded from the PHQ-9 total |
| Open-text feedback | End | 1 | Free text | None | "Any thoughts, feelings, or feedback?" |

---

## Data Variables — Complete Column List

Every trial row records the following columns:

| Column | Type | Phases | Notes |
|---|---|---|---|
| `participant` | string | all | Session/participant token from Pavlovia |
| `session_token` | string | all | Pavlovia session ID |
| `phase` | string | all | `likert`, `pairwise`, or `feedback` |
| `trial` | integer | all | Running index across all trials |
| `phase_trial` | integer | all | Trial index within the current phase |
| `item` | string/integer | likert | PHQ-9 item ID (e.g., `4`, `6a`) or `attn_check` for the catch item |
| `item_text` | string | likert | Full item text |
| `response` | string | likert, feedback | Likert label text or free-text string |
| `score` | integer | likert | 0–3 numeric score |
| `left` | string/integer | pairwise | Item ID shown on the left |
| `right` | string/integer | pairwise | Item ID shown on the right |
| `left_text` | string | pairwise | Full text of left item |
| `right_text` | string | pairwise | Full text of right item |
| `chosen_side` | string | pairwise | `left`, `right`, or `skip` |
| `chosen_item` | string/integer | pairwise | Item ID of chosen item; blank if skipped |
| `skipped` | boolean | pairwise | `true` if participant used skip bar |
| `rt_ms` | integer | likert, pairwise | RT in ms from options-unlock to click |
| `stimulus_onset_ms` | integer | all | Absolute timestamp when stimulus appeared |
| `clickable_onset_ms` | integer | all | Absolute timestamp when options unlocked |
| `response_device` | string | all | `mouse` or `keyboard` |
| `iso_timestamp` | string | all | ISO 8601 absolute timestamp of response |
| `window_status` | string | all | `ok` when the window stayed focused and visible for the whole trial; `left` when the participant was away during it |
| `window_left_ms` | integer | all | Total ms the participant was away during this trial; `0` when `window_status` is `ok` |

**Expected trial rows per participant:** 12 (likert incl. catch) + 55 (pairwise) + 1 (feedback) = **68 rows**

Skipped pairwise trials are kept in the data: `skipped = true`, `chosen_side = skip`, `chosen_item` blank.

**Window-leave audit rows** add a variable number of extra rows: each fullscreen exit, tab switch, or window blur writes one row with these columns filled:

| Column | Type | Notes |
|---|---|---|
| `event_type` | string | `attention_event` — filter on this column to isolate audit rows |
| `attention_event` | string | `exit_fullscreen`, `tab_hidden`, or `window_blur` |
| `in_fullscreen` | boolean | Fullscreen state at the moment of the event |
| `page_hidden` | boolean | Page-visibility state at the moment of the event |

The per-trial `window_status` / `window_left_ms` columns are the primary signal; the audit rows carry the event-level detail behind them. Recording and reporting rules live in the `shaharlab-jspsych-window-monitoring` skill.

---

## Data Quality, Exclusions, and Sample Plan

Attention and robustness checks (mirrors Section 3 of the human blueprint):
- Leaving the window: every trial row records `window_status` / `window_left_ms`, and each exit writes an `attention_event` audit row; per participant, count distinct leaving instances and total time away, and flag repeated or long exits for review — exclusion is the researcher's call
- Response deadline: trials are self-paced by design; extreme RTs are screened during analysis instead
- Infrequency item: `attn_check` answered above "Not at all" (score > 0) flags the session for review

Additional quality checks:
- RT < 200 ms after options unlock: flag as possible pre-empted response; review, keep in data
- Skip rate per participant > 50%: flag for review
- Incomplete sessions (Pavlovia save failed or tab closed early): exclude
- [NEEDS INPUT — minimum RT threshold for exclusion?]
- [NEEDS INPUT — maximum skip rate threshold for exclusion?]

Sample size: [NEEDS INPUT]
Recruitment platform: [NEEDS INPUT — Prolific, SONA, other?]
Target population: [NEEDS INPUT — general adult community, clinical, student?]

---

## Practical Constraints and Technical Notes

- Platform: jsPsych (v7.x) + Pavlovia jsPsych plugin; GitLab-based Pavlovia repo
- Deployment: push to Pavlovia GitLab repo; run in PILOTING mode for pilot; switch to RUNNING for live data collection
- Fullscreen: required; entered at instructions screen; participant instructed explicitly
- Device: desktop/laptop with mouse required; pairwise clicks require a mouse, so mobile is excluded
- Browser: any modern browser; no audio/video requirements
- Data save: Pavlovia CSV auto-save at session end; partial data risk if participant exits early — consider incremental saves if plugin supports it
- Custom response-lock helper: implements "show stimulus at t=0, block all clicks until t=3000 ms, start RT clock at t=3000 ms"; must be custom-built
- Custom window-monitoring helper: built per the `shaharlab-jspsych-window-monitoring` skill — `fullscreenchange` / `visibilitychange` / `blur` listeners write `attention_event` rows, focus/visibility returns close the away interval, and every trial is stamped with `window_status` / `window_left_ms` (columns listed in Data Variables)

---

## Open Questions and Risks

Open questions:
- [NEEDS INPUT] Fixed random seed vs. fresh seed per session?
- [NEEDS INPUT] Exclusion thresholds for RT, skip rate, and completeness
- [NEEDS INPUT] Sample size and power analysis
- [NEEDS INPUT] Recruitment platform and target population
- [NEEDS INPUT] Does the PHQ-9 header question appear on every Likert trial or only once before the block?
- [NEEDS INPUT] Confirm exact item text for all 11 CSV rows (especially 6a/6b/6c and 8a/8b splits)
- [NEEDS INPUT] ITI between trials — currently 0 ms; confirm this is intended

Risks and implementation watch-outs:
- **Fatigue:** 55 pairwise trials with no break may raise skip rates near the end. Consider a mid-point rest screen after trial 27.
- **Item repetition:** Items 6a/6b/6c and 8a/8b may feel confusingly similar; consider a brief note in the Phase 2 intro that some problems may seem related.
- **Pre-empted responses:** Participants can hover and click immediately after unlock. Flag via the RT threshold.
- **Partial data loss:** Pavlovia saves at session end only; browser closure mid-task loses all data. Investigate incremental save options.
- **RT validity:** The custom lock helper must use the same clock as jsPsych's internal RT system to avoid off-by-one-frame errors.
