# Instruction and consent screens

## Context

Instruction, consent, and multi-page informational screens are the participant's first
contact with the study, and their wording is often validated material. Apply this
reference when creating or modifying any such screen. The goal: the right plugin for the
required interaction, stable layout across pages, and participant-facing text taken
verbatim from the blueprint or validated materials — never invented.

## Procedure

1. Read the blueprint for the screen sequence, wording, and any required interaction
   pattern (fullscreen transition, timed screens, accumulating text).
2. Pick the plugin (Coding rules below) and reuse the repository's existing CSS classes
   and helpers before writing new ones.
3. Write the screens as a plain top-level phase script that pushes its trials onto the
   shared `timeline`, in flow order.
4. Check every item in Validation.

## Coding rules

**Plugin choice**
- Prefer `jsPsychInstructions` for conventional multi-page instructions with
  Next/Previous navigation.
- Preserve an established sequence of keyboard- or button-response screens when the
  blueprint or existing implementation requires distinct screens, timing, fullscreen
  transitions, or accumulating text. Do not replace an intentional interaction pattern
  merely to standardize on one plugin.

**Stable layout**
- Use a stable container (consistent width / min-height, centered) so navigation controls
  do not jump as text length changes across pages.
- Reuse the repository's CSS classes when they already provide stable dimensions; keep
  presentation rules in `css/style.css`; avoid repeating large inline style strings.
- Preserve the repository's established typography and responsive behavior.

**Content**
- Participant-facing text comes from the blueprint, validated materials, or explicit
  researcher instructions — never silently rewritten.

## Example

Structure only — wording, styling, and plugin choice come from the blueprint.

```javascript
// Page content as named constants, one per screen
const welcomePage = `
  <div class="instruction-card">
    <h1>Welcome</h1>
    <p>In this study, you will answer a series of questions.</p>
  </div>`;

const taskOverviewPage = `
  <div class="instruction-card">
    <h1>What you will do</h1>
    <p>You will compare pairs of items.</p>
  </div>`;

// Plain top-level phase script: push onto the shared `timeline`
timeline.push({
  type: jsPsychInstructions,
  show_clickable_nav: true,
  pages: [welcomePage, taskOverviewPage],
  data: { phase: "instructions" },
});
```

## Validation

- [ ] The instruction sequence matches the blueprint and current participant flow.
- [ ] Verbatim validated text has not been silently rewritten.
- [ ] Navigation controls remain stable across pages and supported viewport sizes.
- [ ] Fullscreen transitions, response keys, and Continue controls behave as described.
- [ ] The script only pushes onto the shared `timeline`; it never calls `initJsPsych()`
      or `jsPsych.run()`.
