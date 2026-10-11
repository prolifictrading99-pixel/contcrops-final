---
name: verification-first-fix
description: 'Use for debugging bugs, tracing root causes, and validating fixes before completion. Covers reproduce, isolate, root-cause investigation, targeted proof, patch, and verification.'
argument-hint: 'Describe the bug or issue to debug and validate.'
user-invocable: true
disable-model-invocation: false
---

# Verification-First Fix Workflow

## When to Use
- Debug a failing feature, test, or runtime issue
- Investigate a regression or unexpected behavior
- Confirm a fix before declaring the task complete
- Reduce the chance of patching the wrong layer or symptom

## Procedure

1. Reproduce and isolate
   - Capture the exact failure: stack trace, error message, command, user action, or screenshot
   - Confirm the bug still occurs in the current environment before editing code
   - Identify the narrowest scope of the failing behavior

2. Trace the root cause
   - Read the relevant code path and data flow from trigger to failure
   - Check assumptions against the expected contract, schema, docs, or similar implementations
   - Note the strongest hypothesis and the evidence supporting it

3. Test the hypothesis
   - Validate whether the suspected cause matches the observed behavior
   - If possible, create a minimal failing repro or targeted test before changing code
   - Treat uncertain branches as questions to answer, not as edits to make

4. Apply the smallest correct fix
   - Patch the root cause, not just the symptom
   - Prefer a narrow, well-scoped change over broad cleanup or unrelated refactors
   - Keep the fix aligned with the current architecture and data flow

5. Verify with evidence
   - Run the smallest relevant command, test, or validation step
   - Confirm the original failure is resolved and nearby behavior still works
   - If automated verification is impossible, document the exact blocker and the remaining risk

6. Close with a concise summary
   - State the root cause, the fix, and the exact verification performed
   - Include any remaining uncertainty or follow-up needed

## Decision Points
- If the issue cannot be reproduced, gather more evidence before editing
- If multiple root causes are possible, test the most likely one first
- If no automated check exists, create a minimal repro instead of guessing at a fix
- If verification is blocked, do not claim success; report the blocker explicitly

## Completion Criteria
- Root cause is identified with evidence
- Minimal root-cause fix is implemented
- Targeted validation passes or the blocker is clearly documented
- Final status explains what was verified and any remaining risk

## Example Prompts
- /verification-first-fix "The dashboard crashes on empty contract data; reproduce and fix it safely."
- /verification-first-fix "Investigate why the notification bell shows stale counts and verify the fix."
- /verification-first-fix "Trace the failing form submission, add a minimal repro, and confirm the root-cause patch."
