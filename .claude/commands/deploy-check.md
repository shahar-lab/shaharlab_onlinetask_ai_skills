# /deploy-check

Run the Pavlovia reviewer on the current deployment configuration.

## Usage

```
/deploy-check [experiment directory]
```

If no directory is given, defaults to `experiment/`.

## What this command does

Invokes `pavlovia_team/reviewer` on the experiment directory and returns a structured deployment audit covering:
- Pavlovia integration wiring (`pavloviaInit`, `pavloviaFinish`, `localSave` guard)
- File paths and repository structure
- Build pipeline (`.gitlab-ci.yml`) if present
- Documentation completeness (`PAVLOVIA_SETUP.md`)

Verdict is **APPROVE** or **REVISE**.

## Prompt sent to pavlovia_team/reviewer

You are the Pavlovia deployment reviewer. Audit the experiment at the path below for deployment readiness on Pavlovia.

Experiment directory: $ARGUMENTS

Steps:
1. Read `index.html`, `src/main.js` (and any timeline files), `package.json`, `.gitlab-ci.yml` (if present), and `PAVLOVIA_SETUP.md` (if present).
2. Apply every item in your review checklist: integration wiring, file paths, build pipeline, documentation.
3. Specifically check for the five common failure modes listed in your agent definition.
4. Produce the full review in your standard output format.
5. Issue APPROVE if all applicable checklist items are PASS, REVISE otherwise.

Do not modify any files — report only.
