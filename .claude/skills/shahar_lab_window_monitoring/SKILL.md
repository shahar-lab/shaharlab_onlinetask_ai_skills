# Skill: Shahar Lab Window Monitoring

## When to use

Invoke this skill (via `/shahar_lab_window_monitoring <path>`) when the researcher wants to check completed participant sessions for whether — and how many times — they left the study window (tab switch, fullscreen exit, or window blur) during the study. This is a **behavioral attention check** that complements the `attn_check` Likert item ("I participated in the Olympic Games of 1974."): the item catches participants who aren't reading carefully, this catches participants who weren't actually looking at the screen.

This skill only reports. It never excludes or relabels participants — exclusion is the researcher's call.

**What it reports:** for every participant, a single count — how many separate times they left the window. Not logged-event counts, not duration. See Step 3 for why those aren't the same thing.

---

## Background: how window exits are logged

`experiment.js` (see `logAttentionEvent` and its `fullscreenchange` / `visibilitychange` / `blur` listeners) writes one data row every time the participant's browser fires one of three events:

| Column | Values |
|---|---|
| `event_type` | `"attention_event"` — **use this to filter attention-event rows** |
| `phase` | reflects whichever trial happened to be running concurrently (e.g. `"likert"`, `"pairwise"`, `"iti"`) — **not** a reliable discriminator, do not filter on it |
| `attention_event` | `"exit_fullscreen"` \| `"tab_hidden"` \| `"window_blur"` |
| `in_fullscreen` | boolean, state at the moment of the event |
| `page_hidden` | boolean, state at the moment of the event |
| `timestamp` | ISO 8601 string |

`phase` looks like it should identify attention-event rows but doesn't: jsPsych 7.3.4 merges `jsPsych.data.write()` calls as `Object.assign({}, data_object, trial.data, default_data, dataProperties)`, so the concurrently-running trial's own `phase` silently overwrites the `"attention_event"` value passed in. **Always filter on `event_type == "attention_event"`, never on `phase`.** (This was a confirmed bug, fixed in `experiment.js` — if you ever encounter an export predating the fix, `event_type` won't exist and `phase` will be unreliable for isolating these rows; flag such files rather than guessing.)

---

## Step 1 — Locate the data

- If a path is given as an argument, use it. It may be:
  - a single CSV file (one participant/session), or
  - a directory containing multiple participant CSVs (a batch/wave of data collection).
- If no path is given, ask the researcher where the exported Pavlovia CSV(s) live. These files are **not** stored in this repo — they're downloaded per data-collection wave from Pavlovia (or wherever the lab archives completed runs).
- Only read `.csv` files; skip anything else in a directory.
- If a file can't be parsed as this experiment's schema (no `phase` column), skip it and note it as unreadable in the final report rather than failing the whole run.

## Step 2 — Parse per participant

For each CSV (one CSV = one participant/session in this study's export format):

1. Identify the participant: prefer `prolific_pid` if present and non-empty, otherwise `participant_id`, otherwise the filename.
2. Sort all rows for that participant chronologically by `timestamp`.
3. Extract the subset where `event_type == "attention_event"` (do **not** filter on `phase` — see Background above for why it's unreliable for this purpose).

## Step 3 — Count distinct leaving instances (`leaving_times`)

**One real exit can log more than one row.** Alt-tabbing away from a fullscreen trial, for example, can fire `exit_fullscreen`, `tab_hidden`, and `window_blur` all within the same moment — three logged rows for one physical action. Counting raw rows would overcount "how many times did they leave." So:

- Walk the participant's attention_event rows in chronological order (from Step 2).
- Group consecutive rows into a single **leaving instance** whenever they are within **1 second** of each other (`timestamp` gap ≤ 1000 ms). A new instance starts whenever the gap to the previous attention_event row exceeds 1 second.
- `leaving_times` = the number of resulting groups (not the number of raw rows).
- A participant with zero attention_event rows gets `leaving_times = 0`.

This 1-second grouping window is a judgment call, not something derived from the data — it assumes near-simultaneous multi-event firings are the same physical exit and anything more than a second apart is a separate exit. If the researcher wants a different threshold, or wants the raw ungrouped row count instead, ask before changing it, and note whichever definition was used in the report.

## Step 4 — Write the report

Create the output folder `window_monitoring_reports/` at the project root if it doesn't exist (never write anywhere else). Write one file:

`window_monitoring_reports/<label>_report.md`

where `<label>` is the input directory's name if a folder was given, or today's date (YYYY-MM-DD) if a single file was given.

Report contents:

1. A summary line: number of participants processed, number of unreadable/skipped files, number of participants with `leaving_times = 0`, total leaving instances across all participants.
2. A table, one row per participant, **including every participant even if `leaving_times` is 0**, sorted by `leaving_times` descending:

   | Participant | leaving_times |
   |---|---|

3. A closing note, verbatim in spirit:
   > `leaving_times` counts distinct window-exit instances (grouping same-moment multi-event firings within 1 second as one exit), not raw logged rows. This is a behavioral attention signal, not an automatic exclusion — cross-reference with the `attn_check` item and use your own judgment before excluding any participant.

## Step 5 — Notify the researcher

Report the output file path, plus an inline summary: how many participants had `leaving_times = 0` vs. ≥1, and the top 1–3 participants by `leaving_times`, so the researcher doesn't have to open the file to get the headline.
