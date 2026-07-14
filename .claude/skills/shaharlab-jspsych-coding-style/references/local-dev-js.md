# `local_dev.js` — local-testing switches

## Context

`local_dev.js` sits at the **repository root** (not in `js/`) and gathers every switch a
researcher flips for a quick local test run, so testing never requires editing
`js/config.js` or `index.html`. It is the first experiment script `index.html` loads.
Apply this reference when creating or editing `local_dev.js`, or when adding any
test-only shortcut to the experiment.

## Procedure

1. Keep exactly two globals: `PAVLOVIA_PLUGIN_ACTIVATE` and `CONFIG_LOCAL_DEV` (Example below).
2. When a phase needs a test-only shortcut (item-pool truncation, block shortening,
   trial-count limit), add a key to `CONFIG_LOCAL_DEV` — not to `CONFIG` — with the "off"
   value (`null`/`false`) as its default, and read it from the phase script.
3. Before Pavlovia deployment: set `PAVLOVIA_PLUGIN_ACTIVATE = true` and every
   `CONFIG_LOCAL_DEV` key back to its "off" value. Flipping `PAVLOVIA_PLUGIN_ACTIVATE`
   requires the researcher's explicit approval.

## Coding rules

- `PAVLOVIA_PLUGIN_ACTIVATE` lives here and **only** here — `index.html` reads it to choose
  between the Pavlovia init/finish nodes (production, `true`) and the local CSV-save trial
  (testing, `false`).
- Test-only overrides go in `CONFIG_LOCAL_DEV`, never in `CONFIG`. `js/config.js` holds
  the real experiment; this file holds what a test run temporarily overrides.
- Every `CONFIG_LOCAL_DEV` key defaults to its "off" value, so production behavior is
  untouched when nothing is flipped.
- Loads before `js/config.js` in `<head>`, so any later script may read both globals.
- Comment each key with what it does and what its "off" value is.

## Example

```js
// FALSE -> run locally: skip Pavlovia, save a CSV to your Downloads folder.
// TRUE  -> deploy on Pavlovia: init/finish + Prolific redirect.
// Flip to true only with the researcher's explicit approval.
const PAVLOVIA_PLUGIN_ACTIVATE = false;

// Everything you'd tweak for a quick local test run, in one place.
const CONFIG_LOCAL_DEV = {
  // e.g. 2 for a short test run; null = full item pool
  TEST_LIKERT_ITEM_LIMIT: null,
  TEST_PAIRWISE_ITEM_LIMIT: null,
};
```

## Validation

- [ ] `PAVLOVIA_PLUGIN_ACTIVATE` and `CONFIG_LOCAL_DEV` are defined nowhere else in the project.
- [ ] `index.html` loads `local_dev.js` before `js/config.js` and every other consumer.
- [ ] Every `CONFIG_LOCAL_DEV` key has an "off" default and at least one consumer.
- [ ] Before a Pavlovia deploy: `PAVLOVIA_PLUGIN_ACTIVATE = true` and all overrides back to "off".
