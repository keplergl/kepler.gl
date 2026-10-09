# kepler.gl Agent Instructions

## Effort

Match investigation, tests, and browser work to the size of the change. A small fix stays small. Extra passes, repo-wide searches, and screenshot comparisons spend credits without making the change more correct.

For a localized change (a bug fix, a default, a guard, copy, types, or a single component):

1. Read the code you will edit and the nearest test.
2. Make the change.
3. Run the one targeted test that covers it while iterating. Use `yarn agent:check` when types or more than one Jest suite are involved.
4. Run `yarn agent:verify` once at the end, then stop.

Do not, for that kind of change:

- Start the demo app, drive the browser, or take screenshots.
- Compare screenshots, capture a before/after pair, or repeat a browser pass to re-check pixels.
- Search the whole repo or read unrelated packages.
- Run `yarn agent:verify` after every small edit. It is the full Node CI suite. Run it once at the end, and again only after a major iteration.

Never claim a task is complete if that final `yarn agent:verify` fails.

## Definition of done

A coding task is complete when:

1. The requested behavior is implemented.
2. A nearby test covers the change, or a regression test was added for a bug fix that already has a test file in that area. Skip a new test for copy, types, and one-line guards when nothing nearby tests that behavior.
3. `yarn agent:verify` has been run once at the end and passes. During iteration, the targeted check from [Effort](#effort) is enough.
4. No unrelated files have been changed.
5. Existing architecture and conventions are followed.

Never claim a command passed if it failed. Report each command you actually ran as `PASS`, `FAILED`, or `NOT RUN`.

If verification fails:

- Investigate the failure.
- Make the smallest change that addresses that failure.
- Rerun that same check once.

Stop editing when the same failure repeats, or the next edit would reach files the failure does not point at, replace a working approach, or clean up unrelated code. Report the failure and what you changed.

If a failure appears unrelated or pre-existing:

- Confirm it against the base branch if practical.
- Report it explicitly in the PR.

## Implementation

Before changing code:

1. Read the implementation you will edit.
2. Read the nearest test.
3. Look for a similar pattern only when the local code does not show how this repo does it.
4. Prefer existing abstractions over introducing new ones.
5. Avoid unrelated refactoring. Do not rename public symbols, reformat unrelated files, or upgrade dependencies unless the task requires it.

## Testing

During implementation, run the targeted test for the file you changed. `yarn agent:check` is the broader fast loop: Node >= 20, `tsc --noEmit`, and the Jest suite (`--watchAll=false` so it exits in a terminal). Use it when the edit can affect types or several suites. Prefer the single test over `agent:check` when the change is local.

Before handing work to a human, run `yarn agent:verify` once. Run it again only after a major iteration, not after every small edit.

`agent:verify` is the blocking Node.js CI gates that pass on a clean tree:

- `yarn check-circular-deps`
- `yarn typescript`
- Jest (`yarn test-jest --watchAll=false`)
- Tape (`yarn test-fast`: node tests and jsdom browser tests)
- `yarn test:sqlrooms`

Run both commands from the repository root on Node >= 20 (Volta pin 20.19.3, the same as Node.js CI).

Node.js CI runs those Jest and Tape tests as `xvfb-run yarn cover`. Coverage collection is what makes that step take about five minutes. There is no coverage threshold, so `agent:verify` runs the same tests without coverage.

`test-fast` is the full Tape suite without the tap-spec printer. It is the slow half of the local suite, so it belongs in `agent:verify`.

Leave `yarn lint` and `yarn lint:check` out of these commands. CI's lint step is `eslint --fix` because check-only mode fails on existing Prettier issues. `yarn lint` rewrites those existing issues into the working tree.

For a bug fix, add a regression test when a test file already covers that area.

## UI changes

Use the demo app only when the change is interactive behavior that a unit test cannot show: a new flow, a layout the user asked to see, or a bug that only appears in the running app.

Then do one pass:

1. Start the demo if it is not already running.
2. Exercise the changed workflow once.
3. Check the browser console for errors caused by the change.

Stop after that pass. Do not take screenshots unless the user asked for one, or the change is visual and you cannot judge it from the test or from that single pass. One screenshot of the result is enough. Do not compare it with another screenshot, and do not walk unrelated pages.

## Decisions

Proceed on local choices: naming, test layout, an existing pattern, an obvious type fix.

Ask first for a public API change, saved-config compatibility, product behavior, or a new architectural abstraction.

## Pull requests

PR descriptions must be short and contain:

- What changed
- Why
- Important implementation details
- Verification results (`PASS`, `FAILED`, or `NOT RUN`)
- Remaining uncertainties or decisions
- A checklist of what to review

Optional contents:

- One screenshot when the change is visual and a reviewer needs to see it. Do not attach comparison sets.


Do not hide uncertainty. If product or architectural judgment is required, explicitly mark it for human review.
