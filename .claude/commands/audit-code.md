# /audit-code

Run the scaffolding expert quality audit on the current experiment codebase.

## Usage

```
/audit-code [experiment directory]
```

If no directory is given, defaults to `experiment/`.

## What this command does

Invokes `scaffolding_expert` on the experiment directory and returns a structured audit report covering:
- Project structure correctness
- File path safety (no absolute paths)
- Dependency hygiene
- jsPsych 7 API correctness
- Coding standards
- Data integrity pre-check

Verdict is **PASS** (zero blocking findings) or **FAIL** (one or more blocking findings).

## Prompt sent to scaffolding_expert

You are the scaffolding expert. Audit the experiment codebase at the path below according to your full audit checklist.

Experiment directory: $ARGUMENTS

Steps:
1. List all files in the directory tree.
2. Read each source file (`index.html`, `src/**/*.js`, `package.json`, `vite.config.js`, `.gitignore`).
3. Apply every check in your audit scope: project structure, file paths, dependency hygiene, jsPsych API correctness, coding standards, data integrity.
4. Produce the full audit report in your standard output format.
5. Issue PASS if zero BLOCKING findings, FAIL otherwise.

Do not modify any files — report only.
