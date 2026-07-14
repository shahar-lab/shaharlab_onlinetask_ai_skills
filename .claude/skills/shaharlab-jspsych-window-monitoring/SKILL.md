---
name: shaharlab-jspsych-window-monitoring
description: The lab's behavioral attention check for online experiments — records tab switches, window blur, and fullscreen exits during a session, and summarizes completed sessions per participant. Use when building an experiment whose blueprint marks "Leaving the window" as used, or invoke as /shaharlab-jspsych-window-monitoring <path> to report on exported data.
---

# Skill: Shahar Lab jsPsych Window Monitoring

Window monitoring is the lab's behavioral attention check: it detects when a participant leaves the study window (tab switch, window blur, fullscreen exit) during an online experiment. It complements the infrequency catch item (`attn_check`, "I participated in the Olympic Games of 1974.") — the item catches participants who respond without reading; window monitoring catches participants who were away from the screen.

The skill has two parts:

- **Part 1 — Recording**: what the experiment code logs while the participant runs the study. Follow it when building or updating an experiment whose blueprint marks **Leaving the window** as used.
- **Part 2 — Reporting**: how to summarize completed sessions per participant. Follow it when invoked as `/shaharlab-jspsych-window-monitoring <path>` on exported data.

Throughout, the check informs and the researcher decides: reports flag sessions for review, and exclusion is always the researcher's call.

---

## Part 1 — Recording

### What the data must contain

**Two columns on every trial row.** These are the researcher's at-a-glance signal — a scan down one column shows exactly which trials were affected:

| Column | Values | Meaning |
|---|---|---|
| `window_status` | `ok` / `left` | `ok` when the window stayed focused and visible for the whole trial; `left` when the participant was away at any point during the trial. |
| `window_left_ms` | integer ≥ 0 | Total milliseconds the participant was away during this trial. `0` whenever `window_status` is `ok`. |

**One audit row per leave-type event.** These rows carry the event-level detail behind the per-trial columns:

| Column | Values |
|---|---|
| `event_type` | `attention_event` — identifies audit rows; filter on this column |
| `attention_event` | `exit_fullscreen` / `tab_hidden` / `window_blur` |
| `in_fullscreen` | boolean, state at the moment of the event |
| `page_hidden` | boolean, state at the moment of the event |
| `timestamp` | ISO 8601 string |

Identify audit rows by `event_type`. The `phase` column on an audit row echoes whichever trial happened to be running: jsPsych 7.x merges the concurrent trial's data over `jsPsych.data.write()` calls (`Object.assign({}, data_object, trial.data, ...)`), so the trial's own `phase` overwrites the value passed in. (In exports predating the `event_type` fix, flag the file as legacy and treat `phase` as unreliable for isolating audit rows.)

### Listeners

Attach once, in `index.html`'s inline script, before the timeline runs:

- **Leave events** — `visibilitychange` (page becomes hidden), `blur` (window loses focus), `fullscreenchange` (fullscreen exited). Each firing writes one audit row.
- **Return events** — `visibilitychange` (page visible again), `focus` (window refocused). These close the away interval described next; they update state and stay out of the data.

### Measuring time away

The participant counts as **away** while the page is hidden or the window is blurred. Track one **away interval** rather than per-event durations, because a single physical exit usually fires several events at once (alt-tabbing out of fullscreen fires `exit_fullscreen`, `tab_hidden`, and `window_blur` together):

1. **Open** the interval at the first event that makes the participant away (record `performance.now()`). Further leave events while already away add audit rows and leave the interval as is.
2. **Close** the interval at the first return event that makes the page visible and the window focused again; add the elapsed time to a running per-trial accumulator.
3. **Stamp each trial**: in a global `on_trial_finish` (or equivalent), write `window_left_ms` from the accumulator and set `window_status` (`left` when the accumulator is positive, `ok` when it is zero), then reset the accumulator for the next trial.
4. **Interval spanning a trial boundary**: the ending trial receives the away time that elapsed during it and is marked `left`; the interval stays open and keeps accumulating into the following trial(s).
5. **Interval still open at session end**: the time elapsed so far goes to the final trial.

A fullscreen exit on its own (window still focused and visible) writes an audit row and leaves the away interval closed — the participant can still see the study. It therefore shows up in the report's `leaving_times` and in the audit trail, while `window_left_ms` stays a pure measure of time the study was out of sight.

### Where the code lives

Implement as a self-contained helper file in `src/utils/` (e.g., `window_monitoring.js`), loaded via its own `<script>` tag in `index.html` and defining a global `initWindowMonitoring(jsPsych)` function that `index.html`'s inline script calls once during setup.

---

## Part 2 — Reporting

### Step 1 — Locate the data

- With a path argument, use it: either a single CSV (one participant/session) or a directory of participant CSVs (a data-collection wave).
- Without a path, ask the researcher where the exported Pavlovia CSVs live — they are downloaded per wave and kept outside this repo.
- Read the `.csv` files in a directory and skip everything else.
- When a file lacks this experiment's schema, record it as unreadable in the report and continue with the rest.

### Step 2 — Parse per participant

For each CSV (one CSV = one participant/session):

1. Identify the participant: prefer `prolific_pid` when present and non-empty, then `participant_id`, then the filename.
2. Sort the rows chronologically by `timestamp`.
3. Split them into **trial rows** and **audit rows** (`event_type == "attention_event"` — the Part 1 note explains why `event_type`, and only `event_type`, identifies audit rows).

### Step 3 — Compute three measures per participant

| Measure | Source | Definition |
|---|---|---|
| `leaving_times` | audit rows | Number of distinct leaving instances. Group consecutive audit rows within 1 second of each other (`timestamp` gap ≤ 1000 ms) into one instance — one physical exit fires several events at once. Zero audit rows means `leaving_times = 0`. |
| `trials_left` | trial rows | Number of trials with `window_status == "left"`. |
| `total_time_away` | trial rows | Sum of `window_left_ms`, reported in seconds with one decimal. |

- The 1-second grouping window is a lab convention, an assumption rather than something derived from the data. When the researcher asks for a different threshold or for raw event counts, apply their definition and record which definition the report used.
- `leaving_times` can exceed what the other two measures suggest: a fullscreen exit with the window still visible counts as an instance while adding zero away time. Read the three measures together.
- **Legacy exports** (per-trial columns absent): report `leaving_times` from the audit rows and write `not recorded` for `trials_left` and `total_time_away`.

### Step 4 — Write the report

Write one file inside `window_monitoring_reports/` at the project root, creating the folder when needed:

`window_monitoring_reports/<label>_report.md` — `<label>` is the input directory's name, or today's date (YYYY-MM-DD) for a single file.

Report contents, in order:

1. A summary line: participants processed, unreadable/skipped files, participants with `leaving_times = 0`, total leaving instances, and total time away across all participants.
2. A table with one row per participant — including participants whose values are all zero — sorted by `leaving_times` descending:

   | Participant | leaving_times | trials_left | total_time_away_s |
   |---|---|---|---|

3. A closing note, verbatim in spirit:
   > `leaving_times` counts distinct window-exit instances (same-moment multi-event firings within 1 second are one exit). `trials_left` and `total_time_away_s` come from the per-trial `window_status` / `window_left_ms` columns. These are behavioral attention signals for review — cross-reference with the `attn_check` item and use your own judgment; exclusion is the researcher's call.

### Step 5 — Notify the researcher

Report the output file path plus an inline headline, so the numbers arrive without opening the file: how many participants had `leaving_times = 0` vs. ≥ 1, the top 1–3 participants by `leaving_times`, and the participant with the most `total_time_away`.
