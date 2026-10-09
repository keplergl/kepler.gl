# kepler.gl Agent Instructions

## Effort

Match the work to the size of the change. Extra passes, repo-wide searches, and screenshot comparisons spend credits without making the change more correct.

For a localized change (a bug fix, a default, a guard, copy, types, or a single component):

1. Read the code you will edit and the nearest test.
2. Make the change.
3. Run the one targeted test that covers it while iterating.
4. Run `yarn agent:verify` once at the end, then stop.

Do not search the whole repo, read unrelated packages, re-run a check that already passed, or run `yarn agent:verify` after every edit.

## Definition of done

1. The requested behavior is implemented.
2. A nearby test covers the change. Skip a new test for copy, types, and one-line guards when nothing nearby tests that behavior.
3. `yarn agent:verify` passed on the final state.
4. No unrelated files changed, and existing conventions followed.

Report each command you ran as `PASS`, `FAILED`, or `NOT RUN`. Never claim a command passed if it failed, and never claim a task is complete if the final `yarn agent:verify` fails.

If a check fails, make the smallest change that addresses it and rerun that same check once. Stop when the same failure repeats, or when the next edit would reach files the failure does not point at, replace a working approach, or clean up unrelated code; then report the failure and what you changed. Confirm a seemingly pre-existing failure against the base branch if practical, and call it out in the PR.

## Implementation

Read the implementation you will edit and its nearest test first. Look for a pattern elsewhere only when the local code does not show how this repo does it. Prefer existing abstractions, and avoid unrelated refactoring: no renaming public symbols, reformatting unrelated files, or upgrading dependencies unless the task requires it.

For a bug fix, add a regression test when a test file already covers that area.

## Testing

Run from the repo root on Node >= 20 (Volta pin 20.19.3, same as Node.js CI).

- Targeted test: the default loop while iterating.
- `yarn agent:check`: `tsc --noEmit` plus Jest (`--watchAll=false`). Use it when the edit can affect types or several suites.
- `yarn agent:verify`: the blocking Node.js CI gates (`check-circular-deps`, `agent:check`, `test-fast`, `test:sqlrooms`). Run once at the end, and again only after a major iteration.

CI runs the same Jest and Tape tests as `xvfb-run yarn cover`. There is no coverage threshold, so `agent:verify` skips coverage and is much faster.

Leave `yarn lint` and `yarn lint:check` out. CI lints with `eslint --fix` because check-only mode fails on existing Prettier issues, and `yarn lint` rewrites those issues into the working tree.

## UI changes

Do not start the demo app, drive the browser, or take screenshots unless the task explicitly asks for it. A unit test is the default evidence for UI behavior.

When the task does ask, do one pass: exercise the changed workflow once and check the console for errors caused by the change. One screenshot is enough. Do not capture before/after pairs or walk unrelated pages.

## Decisions

Proceed on local choices: naming, test layout, an existing pattern, an obvious type fix.

Ask first for a public API change, saved-config compatibility, product behavior, or a new architectural abstraction.

## Pull requests

Keep PR descriptions short:

- What changed and why
- Important implementation details
- Verification results (`PASS`, `FAILED`, or `NOT RUN`)
- Remaining uncertainties or decisions
- A checklist of what to review

Add a screenshot only when the task asked for browser work and a reviewer needs to see the result.

Do not hide uncertainty. If product or architectural judgment is required, explicitly mark it for human review.
