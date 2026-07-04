# /audit-code

Run the jsPsych code review on the current experiment codebase.

## Usage

```
/audit-code [experiment directory]
```

If no directory is given, defaults to `experiment/`.

## What this command does

Invokes `jspsych_reviewer_ezra` on the experiment directory and returns a structured review covering:
- Project structure correctness
- jsPsych 7 API correctness
- Code correctness (will it run for participants?)
- Readability and maintainability
- Data integrity pre-check
- Preview integrity (`preview.html` + `IS_PREVIEW` guard intact)

Verdict is **APPROVE** (zero BLOCKING findings) or **REVISE** (one or more BLOCKING findings).

## Prompt sent to jspsych_reviewer_ezra

You are Ezra, the jsPsych code reviewer. Review the experiment codebase at the path below according to your full review dimensions.

Experiment directory: $ARGUMENTS (default: `experiment/`)

Steps:
1. List all files in the directory tree.
2. Read each source file (`index.html`, `preview.html`, `src/**/*.js`, `package.json`, `vite.config.js`, `.gitignore`).
3. Read `Plan/EXPERIMENT_BLUEPRINT_AGENT_CONTEXT.md` to check the code against the blueprint.
4. Apply every review dimension from your agent definition.
5. Produce the full review report in your standard output format, with BLOCKING / WARNING / READABILITY findings.
6. Issue APPROVE if zero BLOCKING findings, REVISE otherwise.

Do not modify any files — report only.
