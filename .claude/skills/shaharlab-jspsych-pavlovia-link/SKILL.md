# Skill: Shahar Lab jsPsych–Pavlovia Link

Wires a jsPsych 7 experiment to Pavlovia and Prolific: the lab's Pavlovia plugin, the session `init` trial, and the `finish` trial with the Prolific redirect. In the build pipeline this wiring belongs to Maya (`pavlovia_architect_maya`); the skill also works standalone for integrating an existing experiment a researcher brings in.

## When to use

Invoke this skill when connecting a jsPsych 7 experiment to Pavlovia — during the pipeline's Pavlovia stage, or when a researcher asks to make an existing experiment save data on Pavlovia and redirect back to Prolific.

## The assets

| File | What it is |
|---|---|
| `assets/jspsych-7-pavlovia-2021.12.js` | The lab's Pavlovia plugin (Pitiot's plugin, v2021.12). It exposes the global `jsPsychPavlovia` and is the exact file the lab has verified against jsPsych 7 — always wire this copy. |
| `assets/init_snippet.js` | Session-start code: jsPsych initialization with engagement tracking, Prolific URL variables, device detection, and the Pavlovia `init` trial. |
| `assets/prolific_finish_snippet.js` | Session-end code: end-of-experiment flag, fullscreen exit, Pavlovia `finish` trial, and the timed Prolific redirect. |
| `assets/example_index.html` | A minimal but complete jsPsych 7 experiment with the integration in place — the target state after following the steps below. |
| `assets/instructions_from_pavlovia_website.png` | Pavlovia's own integration instructions, kept for reference. |

## Before wiring, collect

- **The Prolific completion code** — shown on the study page on Prolific. The finish snippet redirects to `https://app.prolific.com/submissions/complete?cc=<code>`.
- **The plugins the snippets rely on** — `jsPsychCallFunction` (call-function) and `jsPsychFullscreen` (fullscreen) must be loaded alongside the other jsPsych plugins.
- **Where the timeline lives** — the snippets push trials onto an existing `timeline` array, so they go after its declaration.

## Integration steps

### 1. Copy the plugin into the project

Place `jspsych-7-pavlovia-2021.12.js` in the project's plugin folder (`lib/` or `plugins/`).

### 2. Load it in index.html

Add its `<script>` tag in the `<head>`, immediately after the core `jspsych.js` import:

```html
<script src="lib/jspsych-7-pavlovia-2021.12.js"></script>
```

### 3. Open the session — start of the timeline

Adapt `assets/init_snippet.js`. It does four things, in order:

1. **Engagement tracking** — counts window blurs and fullscreen exits; on blur it pauses the experiment and shows a warning until focus returns. Each trial row receives the running `blur_count` and `fullscreen_exit_count`. (The richer per-trial window monitoring — `window_status` / `window_left_ms` — is defined in the `shaharlab-jspsych-window-monitoring` skill.)
2. **Prolific URL variables** — reads `PROLIFIC_PID` into `subject_id` and `STUDY_ID` into `study_id`, falling back to `'not_provided'` when absent.
3. **Device detection** — classifies the participant's device as `desktop` or `mobile_or_tablet` and stamps `subject_id`, `study_id`, and `device_type` onto every data row.
4. **Pavlovia init** — pushes `{ type: jsPsychPavlovia, command: 'init' }` as the **first** trial in the timeline.

### 4. Close the session — end of the timeline

Adapt `assets/prolific_finish_snippet.js`, placed just before `jsPsych.run(timeline)`. It does four things, in order:

1. **Marks the experiment ended** (`experimentEnded = true`) so the blur-pause from step 3 stops firing during wrap-up.
2. **Exits fullscreen** via `jsPsychFullscreen`.
3. **Pavlovia finish** — pushes `{ type: jsPsychPavlovia, command: 'finish', participantId: subject_id }` as the **last** trial, so `subject_id` names the saved data file.
4. **Prolific redirect** — on finish, shows a "please wait, data saved" message, then after 5 seconds redirects to Prolific using `COMPLETION_CODE`, with a clickable fallback link.

Fill in the two placeholders at the top of the snippet:
- `COMPLETION_CODE` — the code collected before wiring.
- `ON_PAVLOVIA` — `true` for the deployed version; drive it from the environment for local runs (in pipeline projects this is the `IS_PREVIEW` guard from `docs/contracts/IS_PREVIEW.md`).

### 5. Verify

- The `init` trial is the first item in the timeline and the `finish` trial is the last.
- `participantId` in the finish trial receives `subject_id`.
- `COMPLETION_CODE` holds the real Prolific code.
- `jsPsychCallFunction` and `jsPsychFullscreen` are loaded.

## Rules

- Wire the plugin file shipped in this skill's `assets/` — it is the version the lab has verified end-to-end with jsPsych 7 and Pavlovia's server (other distributions of the Pavlovia plugin have failed this pairing).
- Pass `subject_id` to `participantId` in the finish trial, so each Pavlovia data file is named by the Prolific participant.
- In pipeline-built experiments, keep the `IS_PREVIEW` contract intact: the Pavlovia trials sit on the production side of the guard, and `preview.html` keeps running locally without them.
