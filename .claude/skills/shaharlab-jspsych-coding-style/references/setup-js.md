# `js/setup.js` — environment / session setup

## Context

`setup.js` holds everything about the *run environment* — identifiers, data stamping,
Pavlovia open/close nodes, and the local-save fallback — so `index.html`'s inline script
stays a pure orchestrator: load deps → `initJsPsych()` → assemble timeline →
`jsPsych.run()`. Apply this reference when creating or editing `js/setup.js`, or when
changing anything about session IDs, Prolific wiring, or data saving.

## Procedure

1. Define exactly three things (Coding rules below): `JSPSYCH_INIT_OPTIONS`,
   `setupExperimentEnvironment(jsPsych)`, and
   `buildEnvironmentNodes(jsPsych, participantId, localDev)`.
2. `index.html` consumes all three in its ENVIRONMENT SETUP block; this file never calls
   `initJsPsych()` or `jsPsych.run()` itself.
3. Take the completion code from `js/config.js` and attention logging from
   `js/helpers.js` — `setup.js` loads after both.

## Coding rules

- `setup.js` loads in `<head>`, **before** the inline script runs. It only *defines*
  constants and functions — it must never touch the jsPsych instance at parse time.
  Anything that needs the instance is a function `index.html` calls after `initJsPsych()`.
- `JSPSYCH_INIT_OPTIONS` — the options object passed to `initJsPsych()`. The *call* stays
  in `index.html`; only the config lives here. Use `on_trial_finish` to stamp every row
  with an ISO timestamp.
- `setupExperimentEnvironment(jsPsych)` — called once, right after `initJsPsych()`.
  Generates `participantId`/`sessionId` (`jsPsych.randomization.randomID(8)`), attaches
  shared data properties (Prolific URL params, screen size) via
  `jsPsych.data.addProperties()`, starts attention logging, and returns the identifiers.
- `buildEnvironmentNodes(jsPsych, participantId, localDev)` — returns
  `{ pavloviaInit, pavloviaFinish, localSaveTrial }`. `index.html` decides which to push
  based on `PAVLOVIA_PLUGIN_ACTIVATE`; this module only defines them.
- **Critical guard:** the Pavlovia nodes reference the `jsPsychPavlovia` global, which
  only exists after Pavlovia injects its bridge at deploy time. When `localDev` is true
  the Pavlovia nodes must not be constructed at all — referencing the undeclared global
  would throw before `jsPsych.run()` ever runs.
- `pavloviaFinish` owns the Prolific redirect in its own `on_finish` (fires only after
  the plugin has uploaded the data and closed the session), behind a short "please wait"
  screen rather than navigating away instantly.
- `localSaveTrial` is the `PAVLOVIA_PLUGIN_ACTIVATE=false` fallback: a short end screen whose `on_load` calls
  `jsPsych.data.get().localSave("csv", "<experiment>_local.csv")`.

## Example

```js
// initJsPsych options -- index.html keeps the CALL, this file keeps the config.
const JSPSYCH_INIT_OPTIONS = {
  on_trial_finish: function (data) {
    data.timestamp = new Date().toISOString();
  },
};

// Called once, right after initJsPsych(). Returns the per-run identifiers.
function setupExperimentEnvironment(jsPsych) {
  const participantId = jsPsych.randomization.randomID(8);
  const sessionId = jsPsych.randomization.randomID(8);

  const urlParams = new URLSearchParams(window.location.search);
  jsPsych.data.addProperties({
    participant_id: participantId,
    session: sessionId,
    prolific_pid: urlParams.get("PROLIFIC_PID") || "",
    screen_w: window.screen.width,
    screen_h: window.screen.height,
  });

  initAttentionLogging(jsPsych); // js/helpers.js
  return { participantId, sessionId };
}

// Defines the environment nodes; index.html decides which to push.
function buildEnvironmentNodes(jsPsych, participantId, localDev) {
  let pavloviaInit = null;
  let pavloviaFinish = null;

  if (!localDev) {
    // jsPsychPavlovia exists only after Pavlovia injects its bridge --
    // never construct these nodes under localDev.
    pavloviaInit = { type: jsPsychPavlovia, command: "init" };
    pavloviaFinish = {
      type: jsPsychPavlovia,
      command: "finish",
      participantId: participantId,
      on_finish: function () {
        window.location =
          "https://app.prolific.com/submissions/complete?cc=" + PROLIFIC_COMPLETION_CODE;
      },
    };
  }

  const localSaveTrial = {
    type: jsPsychHtmlKeyboardResponse,
    choices: "NO_KEYS",
    trial_duration: 3000,
    stimulus: "<p>Local test complete. Check your Downloads folder for the CSV.</p>",
    on_load: function () {
      jsPsych.data.get().localSave("csv", "experiment_local.csv");
    },
  };

  return { pavloviaInit, pavloviaFinish, localSaveTrial };
}
```

The example shows structure; the redirect screen, saved properties, and filenames come
from the blueprint and the researcher.

## Validation

- [ ] Nothing in this file touches the jsPsych instance at parse time.
- [ ] `initJsPsych()`/`jsPsych.run()` are not called here.
- [ ] The Pavlovia nodes are constructed only when `localDev` is false.
- [ ] The Prolific redirect fires from `pavloviaFinish`'s own `on_finish`, after upload.
- [ ] `localSaveTrial` downloads a CSV when `PAVLOVIA_PLUGIN_ACTIVATE` is `false`.
- [ ] `index.html` loads `setup.js` after `config.js` and `helpers.js`.
