# Phase scripts and repeating timelines

## Context

Each experiment phase lives in one `js/<phase>.js` file: a plain top-level script that
builds its trials and pushes them onto the shared global `timeline` (created by
`index.html`'s ENVIRONMENT SETUP block, which runs before any phase script loads). Apply
this reference when creating or modifying phase scripts, trial procedures, or repeating
blocks. The invariant is ownership: a phase script creates and pushes only its own nodes;
`index.html` decides the phase order via script-tag order.

## Procedure

1. Read the blueprint for the phase's trials, timing, randomization, and data columns.
2. Take every study-specific value from `CONFIG` (and test overrides from
   `CONFIG_LOCAL_DEV`) — never hard-code them in the phase script.
3. Choose the repetition mechanism: `timeline_variables` for uniform data-driven trials,
   an ordinary loop for real generation logic (Coding rules below).
4. Give every saved trial an explicit `data` object with stable column names.
5. Check every item in Validation.

## Coding rules

- Named trial constants first, then the block/pushes — one commented section per
  component, so a human can scan the phase top to bottom.
- Use `timeline_variables` when the trial structure is identical and only the stimulus
  data changes.
- Ordinary loops and array methods are valid when they express real generation logic
  rather than disguising a uniform data-driven procedure: generating every unique
  unordered item pair, randomizing left/right assignment per pair, creating accumulated
  instruction slides, appending an ITI after each generated trial, per-trial controller
  closures.
- Phase-local names must not leak into or collide with other files — prefix or scope them
  to the phase.
- jsPsych 8: `button_html` is a function `(choice, choiceIndex) => html`; dynamic
  parameters (e.g. `stimulus: () => ...`) evaluate at run time.
- A phase script never calls `initJsPsych()` or `jsPsych.run()`, and never touches
  another phase's nodes.

## Example

A data-driven block with `timeline_variables`; adapt names, plugins, and fields to the
experiment.

```javascript
/* =====================================================================
   1. FIXATION CROSS
   ===================================================================== */
const fixation_cross = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: CONFIG.FIXATION_HTML,
  choices: "NO_KEYS",
  trial_duration: CONFIG.FIXATION_DURATION_MS,
  data: { phase: "fixation" },
};

/* =====================================================================
   2. IMAGE CHOICE TRIAL
   ===================================================================== */
const image_choice_trial = {
  type: jsPsychImageKeyboardResponse,
  stimulus: jsPsych.timelineVariable("stimulus"),
  choices: CONFIG.RESPONSE_KEYS,
  trial_duration: CONFIG.RESPONSE_TIMEOUT_MS,
  data: {
    phase: "task_choice",
    correct_response: jsPsych.timelineVariable("correct_response"),
  },
};

/* =====================================================================
   3. DYNAMIC FEEDBACK SCREEN
   Evaluates the previous response at run time.
   ===================================================================== */
const feedback_screen = {
  type: jsPsychHtmlKeyboardResponse,
  choices: "NO_KEYS",
  trial_duration: CONFIG.FEEDBACK_DURATION_MS,
  data: { phase: "feedback" },
  stimulus: () => {
    const last_trial = jsPsych.data.getLastTrialData().values()[0];
    const correct_ans = jsPsych.evaluateTimelineVariable("correct_response");
    if (last_trial.response === correct_ans) return CONFIG.FEEDBACK_CORRECT_HTML;
    if (last_trial.response === null) return CONFIG.FEEDBACK_TIMEOUT_HTML;
    return CONFIG.FEEDBACK_INCORRECT_HTML;
  },
};

/* =====================================================================
   4. INTER-TRIAL INTERVAL
   ===================================================================== */
const iti_screen = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: CONFIG.BLANK_SCREEN_HTML,
  choices: "NO_KEYS",
  trial_duration: CONFIG.ITI_MS,
  data: { phase: "iti" },
};

/* =====================================================================
   5. TASK BLOCK -- pushed onto the shared timeline
   ===================================================================== */
timeline.push({
  timeline: [fixation_cross, image_choice_trial, feedback_screen, iti_screen],
  timeline_variables: TASK_STIMULI,
  randomize_order: CONFIG.RANDOMIZE_TASK_ORDER,
});
```

For generation-logic loops (e.g. all unique pairs), build the array first, then loop and
push — truncating for test runs via `CONFIG_LOCAL_DEV` limits, never by editing the pool:

```javascript
let pairs = allPairs(ITEMS);
if (CONFIG.RANDOMIZE_PAIR_ORDER) pairs = jsPsych.randomization.shuffle(pairs);

pairs.forEach((pair, idx) => {
  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: CONFIG.PAIRWISE_PROMPT_HTML,
    choices: [pair[0].item, pair[1].item],
    button_html: (choice) => `<button class="jspsych-btn pairwise-btn">${choice}</button>`,
    data: { phase: "pairwise", phase_trial_num: idx + 1 },
  });
});
```

## Validation

- [ ] The script pushes only its own nodes onto the shared `timeline`, in flow order.
- [ ] Phase-local names do not leak into or collide with other files.
- [ ] Repetition counts, randomization, and timing come from the blueprint or `CONFIG`;
      test truncation comes only from `CONFIG_LOCAL_DEV`.
- [ ] Every generated response trial carries the intended data columns, with stable names
      and types.
- [ ] `index.html` loads the script once, between ENVIRONMENT SETUP and SAVE AND CLOSE,
      in the correct participant-flow position.
