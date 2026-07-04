# Skill: Shahar Lab jsPsych Instructions Generator

## When to use
Invoke this skill when creating instruction screens, consent forms, or any multi-page informational screens in a jsPsych experiment.

---

## Core Rule: Always Use `jsPsychInstructions`

Use the standard `jsPsychInstructions` plugin for all instruction and consent screens. Do **not** create custom plugins for this purpose.

---

## 1. Anti-Jumping Layout (Strict)

To prevent the Next/Previous buttons from shifting position as text length changes across pages, every page string MUST be wrapped in a fixed-dimension container.

- Outer `<div>` with fixed dimensions (default: `width: 800px; height: 500px;`).
- CSS Flexbox on this container: `display: flex; flex-direction: column; justify-content: center; align-items: center;`
- Restrict inner text width (e.g., `max-width: 80%`) for readability.

```js
// formatting the fixed container to prevent layout shift
const pageContainer = (content) => `
  <div style="
    width: 800px;
    height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #fafafa;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    font-family: Inter, Helvetica, Arial, sans-serif;
  ">
    <div style="max-width: 80%; font-size: 22px; line-height: 1.6; text-align: center;">
      ${content}
    </div>
  </div>
`;
```

---

## 2. Modern Styling

- **Font:** Modern sans-serif — Inter, Helvetica, or Arial (in that order of preference).
- **Font size:** Minimum 22px for readability.
- **Background:** Subtle off-white (e.g., `#fafafa`) on the fixed container.
- **Border radius:** `8px` to give a modern card appearance.
- **Drop shadow:** Soft shadow (e.g., `box-shadow: 0 2px 12px rgba(0,0,0,0.08)`).

---

## 3. Action-Oriented Commenting (Strict)

All JavaScript comments must use **action-oriented verb phrases** that describe what the code is doing.

| ❌ Do NOT write | ✅ Write instead |
|---|---|
| `// instructions screen` | `// building the main instruction timeline block` |
| `// styling` | `// formatting the fixed container to prevent layout shift` |
| `// page 1` | `// defining the HTML string for the welcome page` |
| `// consent` | `// assembling the consent form pages array` |

---

## 4. Full Example

```js
// building the main instruction timeline block
const instructionsTrial = {
  type: jsPsychInstructions,
  show_clickable_nav: true,
  pages: [

    // defining the HTML string for the welcome page
    pageContainer(`
      <h2 style="margin-bottom: 16px;">Welcome</h2>
      <p>In this study, you will answer a series of questions.</p>
    `),

    // defining the HTML string for the task overview page
    pageContainer(`
      <h2 style="margin-bottom: 16px;">What you will do</h2>
      <p>You will compare pairs of items and select the one that applies more to you.</p>
    `),

    // defining the HTML string for the readiness prompt page
    pageContainer(`
      <p>When you are ready, click <strong>Next</strong> to begin.</p>
    `),

  ],
};
```

---

## 5. Placement in Dan's File Structure

Instruction screens belong in `experiment/src/timeline/instructions.js`. Export the trial and import it into `main.js`.

```js
// exporting the instructions block for assembly in main.js
export { instructionsTrial };
```