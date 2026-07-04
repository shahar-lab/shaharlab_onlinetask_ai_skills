# Experiment Blueprint — Agent Context: PHQ-9 Pairwise Symptom Comparison
<!-- Agent-facing file. The researcher will never read this. Be dense and complete. -->

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

1. **Welcome** — single screen; "a few questions, ~5 minutes"; no response required; auto-advance or button
2. **Instructions** — single screen; enter fullscreen; silence phone and alerts
3. **Overview** — single screen; truthful responses; no rush; some questions may feel similar; anonymous
4. **Ready** — single screen; press Spacebar to begin
5. **Phase 1 · Likert** — 11 trials, ~2–3 min estimated
6. **Phase 1 ended notice** — single transition screen; no timing requirement
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
- All 11 rows used as-is; no items are merged or dropped
- Items 6a, 6b, 6c and 8a, 8b are kept as separate entries (not collapsed)
- Item text loaded from CSV at runtime; not hard-coded
- Pairs generated programmatically: C(11, 2) = 55 unique pairs
- No images, audio, or video; text only
- [NEEDS INPUT — confirm exact item text for all 11 rows from the CSV, especially 6a/6b/6c and 8a/8b]

---

## Randomization and Counterbalancing

- Likert item order: fully random per participant; no constraints
- Pairwise pair order: fully random per participant; no constraints
- Left/right side per pair: fully random per pair presentation; independent of pair order
- No consecutive-trial constraints
- [NEEDS INPUT — use a fixed random seed for reproducibility, or generate fresh each session?]

---

## Questionnaires and Scales

| Name | Phase | Items | Format | Scoring | Notes |
|---|---|---|---|---|---|
| PHQ-9 (adapted) | Phase 1 | 11 | 4-point Likert | 0–3 per item; total 0–33 | Standard wording; items from CSV; 6a/6b/6c and 8a/8b kept separate |
| Open-text feedback | End | 1 | Free text | None | "Any thoughts, feelings, or feedback?" |

---

## Data Variables — Complete Column List

Every trial row must record the following columns:

| Column | Type | Phases | Notes |
|---|---|---|---|
| `participant` | string | all | Session/participant token from Pavlovia |
| `session_token` | string | all | Pavlovia session ID |
| `phase` | string | all | `likert`, `pairwise`, or `feedback` |
| `trial` | integer | all | Running index across all trials |
| `phase_trial` | integer | all | Trial index within the current phase |
| `item` | string/integer | likert | PHQ-9 item ID (e.g., `4`, `6a`) |
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

**Expected rows per participant:** 11 (likert) + 55 (pairwise) + 1 (feedback) = **67 rows**

Skipped pairwise trials: kept in data, not removed. `skipped = true`, `chosen_side = skip`, `chosen_item` blank.

---

## Data Quality, Exclusions, and Sample Plan

Attention and quality checks:
- RT < 200 ms after options unlock: flag as possible pre-empted response; review but do not auto-exclude
- Skip rate per participant > 50%: flag for review
- Incomplete sessions (Pavlovia save failed or tab closed early): exclude
- [NEEDS INPUT — any formal in-task attention-check trials planned?]
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
- Device: desktop/laptop with mouse required; mobile not supported (pairwise clicks require mouse)
- Browser: any modern browser; no audio/video requirements
- Data save: Pavlovia CSV auto-save at session end; partial data risk if participant exits early — consider incremental saves if plugin supports it
- Custom response-lock helper: must implement "show stimulus at t=0, block all clicks until t=3000 ms, start RT clock at t=3000 ms"; this is not available in stock jsPsych plugins and must be custom-built

---

## Open Questions and Risks

Open questions:
- [NEEDS INPUT] Fixed random seed vs. fresh seed per session?
- [NEEDS INPUT] Formal attention-check trials — include or omit?
- [NEEDS INPUT] Exclusion thresholds for RT, skip rate, and completeness
- [NEEDS INPUT] Sample size and power analysis
- [NEEDS INPUT] Recruitment platform and target population
- [NEEDS INPUT] Does the PHQ-9 header question appear on every Likert trial or only once before the block?
- [NEEDS INPUT] Confirm exact item text for all 11 CSV rows (especially 6a/6b/6c and 8a/8b splits)
- [NEEDS INPUT] ITI between trials — currently none specified; confirm 0 ms is intended

Risks and implementation watch-outs:
- **Fatigue:** 55 pairwise trials with no break may cause fatigue and increased skip rates near the end. Consider a mid-point rest screen after trial 27.
- **Item repetition:** Items 6a/6b/6c and 8a/8b may feel confusingly similar to participants; consider a brief note in the Phase 2 intro explaining that some problems may seem related.
- **Pre-empted responses:** Without cursor-tracking, there is no safeguard against participants moving the mouse and clicking immediately after unlock. Flag via RT threshold.
- **Partial data loss:** Pavlovia saves at session end only; browser closure mid-task loses all data. Investigate incremental save options.
- **RT validity:** RT is measured from options-unlock; ensure the custom lock helper uses the same clock as jsPsych's internal RT system to avoid off-by-one-frame errors.
