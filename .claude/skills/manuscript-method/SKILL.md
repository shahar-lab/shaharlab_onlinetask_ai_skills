# Skill: Manuscript Method Section Preparation

## When to use
Invoke this skill (via `/manuscript-method`) when the researcher wants to generate a publication-ready method section from a completed jsPsych experiment. This skill drives Baruch (`manuscript_editor_baruch`).

---

## Step 1: Read the entire project

Before writing a single word, Baruch must read every relevant file (see his agent definition for the full list). The goal is to extract:

- The exact sequence of phases shown to participants
- The verbatim text of all on-screen instructions
- Every timing value (fixation duration, stimulus duration, ISI, max RT, feedback duration, rest break duration)
- The stimulus set: type, count, categories, presentation format
- The response device and valid keys
- The trial count, block structure, and rest break logic
- The randomization and counterbalancing procedure
- All questionnaires: name, validated reference, number of items, scale endpoints, when administered
- The data columns recorded and what they represent

---

## Step 2: Create the output folder

All output goes in:

```
manuscript_snippets/
├── method_main.md
└── method_supplementary.md
```

Create this folder at the project root if it does not exist. Never modify any other project file.

---

## Step 3: Write `method_main.md` — Main Manuscript Method Section

This document contains what would appear in the method section of a standard journal article. It should be concise, precise, and written in third-person past tense (APA style by default unless the researcher specifies otherwise).

### Required subsections in this order:

#### 3.1 Participants
Leave a bracketed placeholder — Baruch does not know sample size or demographics:
```
[PARTICIPANTS — to be completed by researcher: N, age range, gender breakdown, inclusion/exclusion criteria applied, compensation]
```

#### 3.2 Design
State the experimental design explicitly:
- Number of factors, levels, and whether each is within- or between-subjects
- Primary dependent variable(s)
- How conditions were assigned (randomized, counterbalanced, etc.)

Example:
> *The experiment used a 2 (condition: congruent vs. incongruent) × 3 (SOA: 100, 300, 500 ms) within-subjects design. The primary dependent variable was response time.*

#### 3.3 Stimuli and Materials
Describe stimuli precisely — drawn directly from the code:
- Type (words, images, tones, etc.)
- Count and category breakdown
- Source or generation method
- Presentation format (size, color, position) if specified in the code
- Any preloading procedure

#### 3.4 Procedure
Describe what participants experienced, in the order they experienced it:
- Consent procedure (brief)
- Instructions phase
- Practice block (number of trials, feedback provided)
- Main task (number of blocks × trials per block, rest breaks)
- Questionnaires (name, timing)
- Debrief

For each trial, describe the sequence of events with exact timing:
> *Each trial began with a fixation cross presented for 500 ms, followed by the target stimulus for 200 ms. Participants had up to 1500 ms to respond. Feedback ("Correct" / "Incorrect") was displayed for 500 ms following the response.*

#### 3.5 Data Recording
State what was recorded and how:
- Response key and RT on each trial
- Any computed variables (accuracy, trimmed RT)
- Data saving method (jsPsych → CSV via Pavlovia)

---

## Step 4: Write `method_supplementary.md` — Supplementary Materials

This document contains everything that is too detailed for the main manuscript but must be available for reproducibility and pre-registration. It should be exhaustive.

### Required sections in this order:

#### 4.1 Verbatim Participant Instructions
Copy the exact text shown to participants at each phase, formatted as block quotes:
- Welcome / consent text
- Task instructions (every screen)
- Practice instructions
- Between-block messages
- Debrief text

#### 4.2 Full Trial Sequence and Timing Specification
A complete table of every event in a trial:

| Event | Duration | Notes |
|-------|----------|-------|
| Fixation cross | 500 ms | centered, black on white |
| Stimulus | 200 ms | ... |
| Response window | up to 1500 ms | keyboard response |
| Feedback | 500 ms | only on practice trials |
| ITI | 1000 ms | blank screen |

#### 4.3 Stimulus List
A complete table or appendix of all stimuli:
- Every stimulus item, its category, and any relevant properties
- Counterbalancing assignments if applicable

#### 4.4 Randomization and Counterbalancing Details
Explain the exact algorithm used:
- Was a fixed seed used?
- How were condition orders assigned across participants?
- Were there constraints (e.g., no more than 3 consecutive trials of the same type)?

#### 4.5 Questionnaire Items
For each questionnaire administered:
- Full name and citation
- Number of items
- Response scale (endpoints and midpoint)
- Scoring procedure

#### 4.6 Technical Implementation
- Software: jsPsych v7.x
- Hosting: Pavlovia
- Browser requirements / any participant-side constraints (headphones, full-screen, etc.)
- Data format: JSON → CSV

---

## Step 5: Flag anything uncertain

Wherever the code or spec is ambiguous, incomplete, or contradicts itself, insert a clearly visible marker:

```
[CONFIRM WITH RESEARCHER: the fixation duration is set as a variable that could be 500 or 1000 ms depending on block — which value should be reported?]
```

Do not guess. Do not average. Flag it.

---

## Step 6: Notify the researcher

When both files are written, report:

> "I have placed two files in `manuscript_snippets/`:
> - `method_main.md` — method section for the main manuscript
> - `method_supplementary.md` — full supplementary detail
>
> Items marked `[CONFIRM WITH RESEARCHER: ...]` require your input before the section is complete. Please review and let me know what needs to be changed or filled in."
