# Skill: Shahar Lab Online Experiment Plan

Creates and maintains the experiment plan: two files in `Plan/` that together document an online behavioral experiment — one written for the researcher, one written for the agents that build it.

## When to use

Run this skill once the researcher has described the study well enough to document it — typically right after the planning interview — and again whenever the design or the experiment code changes.

## The two files

| File | Audience | What it is |
|---|---|---|
| `Plan/EXPERIMENT_BLUEPRINT.md` | Researcher | At-a-glance summary: flowchart, tunable settings, attention checks, data preview, tech stack. |
| `Plan/EXPERIMENT_BLUEPRINT_AGENT_CONTEXT.md` | Agents | Complete design record: every detail needed to build or modify the experiment. |

The exact contents of each file are specified in [`blueprint-format.md`](blueprint-format.md). Read that spec before writing either file. Worked examples: [`example_blueprint.md`](example_blueprint.md) and [`example_agent_context.md`](example_agent_context.md).

## How to run

1. **Pick the mode.** If `Plan/EXPERIMENT_BLUEPRINT.md` already exists you are updating; otherwise you are creating.

2. **Create** — write both files from the conversation context, following `blueprint-format.md`.

3. **Update** — read both existing files first. Apply the changes requested in the current conversation and leave everything else as it is, including unresolved `[NEEDS INPUT]` markers. Record each update as one line in the `## Changelog` at the top of the agent context file:

   ```
   - YYYY-MM-DD: <what changed and why>
   ```

   The changelog lives only in the agent context file. When a change touches a value that appears in both files, update it in both.

## Ground rules

- When a detail is unknown, write `[NEEDS INPUT]` — a marked gap gets resolved; an invented value gets built.
- Both files are documentation: prose, tables, and diagrams. Code lives in the experiment repository.
