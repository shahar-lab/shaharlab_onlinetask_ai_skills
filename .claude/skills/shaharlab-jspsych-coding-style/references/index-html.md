# `index.html` — the orchestrator

## Context

`index.html` is the single entry point of every ShaharLab experiment and the only file
allowed to orchestrate: it loads all dependencies in order, calls `initJsPsych()` once,
assembles the master timeline from the phase scripts, guards the Pavlovia init/finish
nodes behind `PAVLOVIA_PLUGIN_ACTIVATE`, and calls `jsPsych.run()` once. Trial content, stimuli, and
scoring live in the `js/` phase scripts it loads — never here. Apply this reference when
creating or regenerating `index.html`, wiring Pavlovia, or changing script load order.

## Procedure

1. Read the plan (`ai_artifacts/plan/EXPERIMENT_BLUEPRINT.md` + `ai_artifacts/plan/artifacts/SPECIFICATION.md`)
   for its phases, plugins, and folder layout — never invent one. If it doesn't exist yet,
   stop and tell the researcher it must be created first.
2. Copy the template (Example below) verbatim.
3. Add one `<script src="https://unpkg.com/@jspsych/plugin-<name>@<version>">` line per
   plugin actually used — nothing speculative. If a plugin isn't in the blueprint's list,
   confirm with the researcher.
4. Add one `<script>` tag per phase script, between the ENVIRONMENT SETUP and SAVE AND
   CLOSE blocks, in the blueprint's phase order.
5. `PAVLOVIA_PLUGIN_ACTIVATE` lives in root-level `local_dev.js` ([local-dev-js.md](local-dev-js.md)),
   not here. Leave it `false` until the researcher explicitly confirms the experiment is
   ready for Pavlovia; Dan owns the production-mode change.
6. Check every item in Validation before handoff.

## Coding rules

- jsPsych core, CSS, and every plugin load from `unpkg.com`, version-pinned, using
  jsPsych 8's matching plugin line (core `8.x`, plugins `2.x`).
- jQuery loads from CDN (pinned to `2.2.4`), after the jsPsych tags — the Pavlovia
  plugin's `$.get`/`$.post`/`$.ajax` calls depend on it, even though the experiment code
  itself doesn't use jQuery.
- The Pavlovia bridge tag points to `lib/jspsych-7-pavlovia-2022.1.1.js` — hosted by
  Pavlovia and injected into `lib/` at deploy time, never vendored locally. It 404s
  harmlessly in local dev. The filename is Pavlovia's jsPsych-7-era build; on the first
  jsPsych 8 deploy, verify whether Pavlovia publishes a v8 bridge under a different name.
- `<head>` load order: jsPsych core + CSS → plugins → jQuery → Pavlovia bridge → global
  CSS override (white background / black text) → experiment stylesheet → `local_dev.js` →
  `js/config.js` → `js/helpers.js` → `js/setup.js`. Everything in `<head>` only defines
  functions and constants — nothing touches the jsPsych instance at parse time.
- The inline ENVIRONMENT SETUP block creates the globals every phase script relies on:
  the jsPsych instance (`initJsPsych(JSPSYCH_INIT_OPTIONS)`), the setup results from
  `js/setup.js`, and the shared `timeline` array.
- Both Pavlovia pushes sit inside `if (PAVLOVIA_PLUGIN_ACTIVATE)`; the `else` branch pushes the local
  CSV-save trial. This is what lets the experiment run locally without freezing.
- If a deployment-critical file (Pavlovia bridge, credentials, pinned vendor library)
  appears to be missing, stop and ask the researcher via Tzadok — never recreate, rename,
  or source a replacement from another project on your own judgment.

## Example — the template

The literal starting point every time `index.html` is generated. Add version-pinned CDN
tags for whichever plugins the blueprint needs; leave the `PAVLOVIA_PLUGIN_ACTIVATE` guards, jQuery tag,
and Pavlovia tag exactly as shown.

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Shahar Lab | jsPsych Experiment</title>

    <!-- ========================================================= -->
    <!-- STEP 1: LOAD CORE JSPSYCH ENGINE (FROM WEB)               -->
    <!-- ========================================================= -->
    <script src="https://unpkg.com/jspsych@8.2.2"></script>
    <link href="https://unpkg.com/jspsych@8.2.2/css/jspsych.css" rel="stylesheet" type="text/css" />


    <!-- ========================================================= -->
    <!-- STEP 2: LOAD JSPSYCH PLUGINS (FROM WEB)                   -->
    <!-- jsPsych 8 pairs with the 2.x plugin line.                 -->
    <!-- ========================================================= -->
    <script src="https://unpkg.com/@jspsych/plugin-html-keyboard-response@2.1.0"></script>
    <!-- (Add more plugins here as needed) -->


    <!-- jQuery (CDN, pinned to 2.2.4). Required by the Pavlovia plugin's
         $.get/$.post/$.ajax calls, even though the experiment code doesn't
         use jQuery itself. Must load after the jsPsych tags. -->
    <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>


    <!-- ========================================================= -->
    <!-- STEP 3: LOAD PAVLOVIA BRIDGE                              -->
    <!-- (Note: Causes a harmless 404 error when testing locally)  -->
    <!-- ========================================================= -->
    <!-- Hosted by Pavlovia itself and injected into lib/ at deploy time --
         not vendored in this repo. The 404 is expected and harmless in
         local dev (PAVLOVIA_PLUGIN_ACTIVATE=false skips building the Pavlovia nodes entirely,
         so the missing jsPsychPavlovia global is never referenced). -->
    <script type="text/javascript" src="lib/jspsych-7-pavlovia-2022.1.1.js"></script>


    <!-- ========================================================= -->
    <!-- STEP 4: LOAD CUSTOM STYLES                                -->
    <!-- ========================================================= -->
    <style>
      body {
        background-color: white !important;
        color: black;
      }
    </style>
    <link href="css/style.css" rel="stylesheet" type="text/css" />


    <!-- ========================================================= -->
    <!-- STEP 5: LOAD LOCAL-DEV SWITCHES AND SHARED SCRIPTS        -->
    <!-- ========================================================= -->
    <!-- local_dev.js (repo root) defines PAVLOVIA_PLUGIN_ACTIVATE and CONFIG_LOCAL_DEV --
         the only file a researcher edits for a local test run. Then the
         shared scripts, in dependency order. All of these only define
         functions/constants; none touch the jsPsych instance at parse
         time, so they're safe in <head>, before initJsPsych() runs. -->
    <script src="local_dev.js"></script>
    <script src="js/config.js"></script>
    <script src="js/helpers.js"></script>
    <script src="js/setup.js"></script>

  </head>

  <body></body>

  <script>
    // ==================================================================
    // ENVIRONMENT SETUP
    // ==================================================================
    // Creating the globals every phase script below relies on: the jsPsych
    // instance, per-run identifiers, the Pavlovia/local-fallback nodes, and
    // the shared `timeline` array each phase script pushes its trials onto.
    const jsPsych = initJsPsych(JSPSYCH_INIT_OPTIONS);
    const { participantId } = setupExperimentEnvironment(jsPsych);
    const { pavloviaInit, pavloviaFinish, localSaveTrial } =
      buildEnvironmentNodes(jsPsych, participantId, !PAVLOVIA_PLUGIN_ACTIVATE);

    let timeline = [];
    if (PAVLOVIA_PLUGIN_ACTIVATE) timeline.push(pavloviaInit);
  </script>

  <!-- ==================================================================
       ASSEMBLE MODULAR TIMELINE
       One <script> tag per phase, in the blueprint's phase order. Each is
       a plain top-level script that pushes its own trials onto the shared
       `timeline` array created above. -->
  <!-- <script src="js/instructions.js"></script> -->
  <!-- (Add more phase scripts here as needed) -->

  <script>
    // ==================================================================
    // SAVE AND CLOSE
    // ==================================================================
    // Pavlovia finish (production) or local CSV download (PAVLOVIA_PLUGIN_ACTIVATE=false)
    if (PAVLOVIA_PLUGIN_ACTIVATE) {
      timeline.push(pavloviaFinish);
    } else {
      timeline.push(localSaveTrial);
    }

    // ==================================================================
    // EXECUTE
    // ==================================================================
    jsPsych.run(timeline);
  </script>

</html>
```

## Validation

This checklist is the shared contract between Dan, who owns the complete `index.html` and
Pavlovia wiring, and Ezra, who reviews it. Both must be able to confirm every item:

- [ ] jsPsych core `8.x` and plugins `2.x`, all version-pinned from `unpkg.com`; a tag
      exists only for plugins the experiment actually uses.
- [ ] jQuery `2.2.4` loads after the jsPsych tags.
- [ ] The Pavlovia bridge tag points to `lib/jspsych-7-pavlovia-2022.1.1.js` and is
      understood to 404 harmlessly in local dev.
- [ ] `<head>` load order matches the Coding rules exactly.
- [ ] `PAVLOVIA_PLUGIN_ACTIVATE` and `CONFIG_LOCAL_DEV` are defined only in root-level `local_dev.js`,
      which loads before every consumer; both Pavlovia pushes sit inside
      `if (PAVLOVIA_PLUGIN_ACTIVATE)`, with the local CSV-save trial in the `else`.
- [ ] `data/` exists at the repository root (a `.gitkeep` is fine), so Pavlovia data
      saving has somewhere to land from the first test run.
- [ ] The inline scripts only orchestrate: `initJsPsych(JSPSYCH_INIT_OPTIONS)` once,
      setup via `js/setup.js`'s functions ([setup-js.md](setup-js.md)), timeline assembly,
      and `jsPsych.run(timeline)` once.
- [ ] Every phase script's `<script>` tag sits between the ENVIRONMENT SETUP block and the
      SAVE AND CLOSE block, so the globals exist when it runs and its trials land before
      the finish/save node.
