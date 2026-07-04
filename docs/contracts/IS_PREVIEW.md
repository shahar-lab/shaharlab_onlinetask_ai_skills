# IS_PREVIEW contract (shared between Dan and Maya)

This is the single source of truth for the preview/Pavlovia guard. Dan writes the stub
version; Maya replaces the `null` stubs with real Pavlovia trials. Neither agent may
deviate from these snippets or remove the guard.

## Dan's stub (initial build — Pavlovia not yet wired)

Place at the top of `experiment/src/main.js`:

```js
const IS_PREVIEW = window.__PAVLOVIA_PREVIEW__ === true;

const pavloviaInit = IS_PREVIEW
  ? { type: jsPsychHtmlKeyboardResponse, stimulus: '', trial_duration: 0 }
  : null; // Maya will replace this

const pavloviaFinish = IS_PREVIEW
  ? { type: jsPsychHtmlKeyboardResponse, stimulus: '<p>Preview complete.</p>', choices: [' '] }
  : null; // Maya will replace this
```

## Maya's completed version (Pavlovia wired)

```js
import pavlovia from '@jspsych/plugin-pavlovia';

const IS_PREVIEW = window.__PAVLOVIA_PREVIEW__ === true;

const pavloviaInit = IS_PREVIEW
  ? { type: jsPsychHtmlKeyboardResponse, stimulus: '', trial_duration: 0 }
  : { type: pavlovia, pavloviaServer: 'https://pavlovia.org' };

const pavloviaFinish = IS_PREVIEW
  ? { type: jsPsychHtmlKeyboardResponse, stimulus: '<p>Preview complete.</p>', choices: [' '] }
  : { type: pavlovia, command: 'finish' };
```

## Invariants (both agents, always)

- `pavloviaInit` is the FIRST trial in the timeline.
- `pavloviaFinish` is the LAST trial in the timeline.
- `localSave` fires only inside the `IS_PREVIEW` guard — never in production.
- The guard is never removed or restructured.

## preview.html (owned by Dan initially, Maya after handoff)

A self-contained file at the repository root that runs the experiment locally without Pavlovia:

- Sets `window.__PAVLOVIA_PREVIEW__ = true` **before** loading `main.js`.
- Shows a visible banner: **⚠️ LOCAL PREVIEW — data will not be saved to Pavlovia**.
- Triggers `jsPsych.data.get().localSave('csv', 'preview_data.csv')` at experiment end.
