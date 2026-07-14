# `js/config.js` — experiment-wide settings and content

## Context

`js/config.js` is the single home for every experiment-wide setting: timing, prompts,
response labels, randomization flags, item pools, attention checks, and completion codes.
It loads before all other `js/` scripts, so every phase script reads its values instead of
hard-coding them. Test-only overrides do **not** belong here — they go in `local_dev.js`
([local-dev-js.md](local-dev-js.md)). Apply this reference before creating or modifying
`config.js`, or before touching any value that belongs in it.

## Procedure

Values are never invented. Establish them from three sources, in this order:

1. **The experiment plan** (`ai_artifacts/plan/EXPERIMENT_BLUEPRINT.md` and
   `ai_artifacts/plan/artifacts/SPECIFICATION.md`) — the authoritative source for which variables the study needs
   and their values. If the blueprint specifies a duration, an item list, or a
   randomization scheme, `config.js` must match it exactly.
2. **The other `.js` files** — trace how phase scripts consume `CONFIG`, item arrays, and
   other globals. Consumers define the required key names, types, and allowed values.
3. **Your knowledge of the project** — source assets, prior commits, researcher
   instructions. Preserve validated item wording verbatim.

When these sources conflict, surface the conflict to the researcher instead of silently
choosing a value.

## Coding rules

**Structure**
- Scalar settings go in one `CONFIG` object; structured content (item arrays, path maps,
  special-trial objects) goes in separate named constants beside it.
- Plain script, browser globals: no exports, no modules, no build step, no jsPsych calls.

**Naming**
- Keys are descriptive and UPPERCASE.
- Numeric timing keys carry their unit: `_MS`, `_SEC`, `_MIN`.
- Item identifiers are strings, so IDs like `"2a"` stay possible.

**Content**
- Special trials (attention checks, practice items) stay out of the ordinary item pool,
  so they can never enter pair generation, randomization, or scoring by accident.
- Derive dependent values from `CONFIG` instead of duplicating them.
- Add a key only when code consumes it — never speculatively.
- Never put secrets here. A Prolific completion code is public routing, not a secret.

**Comments**
- Comment non-obvious invariants: fixed positions, exclusions, expected counts,
  provenance. Do not narrate obvious lines.

Common variable groups (not comprehensive — the blueprint and the consuming code decide
what is actually required): timing, content, randomization flags, special trials,
response mapping, presentation, and study metadata (duration, completion code, condition
labels).

## Example

Structural reference only — never copy values from it; take values from the blueprint.

```javascript
// Experiment-wide settings consumed by the phase scripts
const CONFIG = {
  RESPONSE_DELAY_MS: 3000,
  ITI_MS: 2000,
  RESPONSE_LABELS: ["Option 1", "Option 2"],
  RANDOMIZE_PAIR_ORDER: true,
  FULLSCREEN: true,
  ESTIMATED_DURATION_MIN: 15,
  ATTENTION_CHECK_POSITION: "fixed_last", // appended after the shuffle, never randomized
};

// Validated item content with stable string identifiers
const ITEMS = [
  { item_number: "1", item: "First validated item text" },
  { item_number: "2a", item: "Second validated item text" },
];

// Kept outside ITEMS so it never enters pair generation or scoring
const ATTENTION_CHECK_ITEM = {
  item_number: "attn_check",
  item: "Please select the left option to show you are paying attention.",
};

const PROLIFIC_COMPLETION_CODE = "REPLACE_WITH_STUDY_CODE";
```

## Validation

- [ ] Syntax-check the file.
- [ ] Every value with a blueprint counterpart matches the blueprint.
- [ ] Every changed key and global agrees in spelling and type with its consumers.
- [ ] `index.html` loads `config.js` before every script that reads it.
- [ ] Documented trial and pair counts are recalculated after item-pool changes — for all
      unique unordered pairs of `n` items, expect `n * (n - 1) / 2`.
- [ ] Attention checks and practice items cannot enter ordinary randomization or scoring.
- [ ] No source item was silently dropped, duplicated, or reworded.
- [ ] The diff contains no accidental participant-facing or completion-code changes.
- [ ] No test-only override lives here — those belong in `local_dev.js`.
