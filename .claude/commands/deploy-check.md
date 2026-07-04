# /deploy-check

Run the Pavlovia snippet check on the current deployment configuration.

## Usage

```
/deploy-check [experiment directory]
```

If no directory is given, defaults to `experiment/`.

## What this command does

Invokes `pavlovia_architect_maya` in **check-only mode** on the experiment directory and returns a structured deployment audit covering:
- Pavlovia integration wiring (`pavloviaInit` first, `pavloviaFinish` last, `IS_PREVIEW` guard, `localSave` guarded)
- File paths (relative only) and repository structure
- Build pipeline (`.gitlab-ci.yml`) if present
- Documentation completeness (`experiment/PAVLOVIA_SETUP.md`)

Verdict is **PAVLOVIA OK** or **PAVLOVIA BROKEN: <specifics>**.

## Prompt sent to pavlovia_architect_maya

You are Maya, the Pavlovia architect, running in check-only mode. Audit the experiment at the path below for deployment readiness on Pavlovia. Do NOT modify any files in this mode — report only.

Experiment directory: $ARGUMENTS (default: `experiment/`)

Steps:
1. Read `index.html`, `preview.html`, `src/main.js` (and any timeline files), `package.json`, `.gitlab-ci.yml` (if present), and `PAVLOVIA_SETUP.md` (if present).
2. Apply every item in your self-audit checklist and snippet check.
3. Consult the shared contract in `docs/contracts/IS_PREVIEW.md` to verify the guard is intact and correctly completed.
4. Produce the full audit report.
5. Issue **PAVLOVIA OK** if all applicable items pass, **PAVLOVIA BROKEN: <specifics>** otherwise. If broken, list the fixes needed so Tzadok can route them to you or Dan.
