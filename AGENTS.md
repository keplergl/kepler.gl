# kepler.gl Agent Instructions

## Definition of done

A coding task is not complete until:

1. The requested behavior is implemented.
2. Appropriate tests have been added or updated.
3. `yarn agent:verify` passes.
4. No unrelated files have been changed.
5. Existing architecture and conventions are followed.
6. For UI changes, the affected behavior has been exercised in the demo app.

Never claim a task is complete if `yarn agent:verify` fails.

If verification fails:

- Investigate the failure.
- Make the smallest change that addresses that failure.
- Rerun verification.

Stop editing when the same failure repeats, or the next edit would reach files the failure does not point at, replace a working approach, or clean up unrelated code. Report the failure and what you changed.

If a failure appears unrelated or pre-existing:

- Confirm it against the base branch if practical.
- Report it explicitly in the PR.

## Implementation

Before changing code:

1. Read the relevant implementation.
2. Read nearby tests.
3. Search for similar patterns elsewhere in kepler.gl.
4. Prefer existing abstractions over introducing new ones.
5. Avoid unrelated refactoring. Do not rename public symbols, reformat unrelated files, or upgrade dependencies unless the task requires it.

## Testing

During implementation, run targeted tests for fast feedback. `yarn agent:check` is the fast loop: Node >= 20, `tsc --noEmit`, and the Jest suite (`--watchAll=false` so it exits in a terminal).

Before handing work to a human, always run:

```bash
yarn agent:verify
```

Report each command as `PASS`, `FAILED`, or `NOT RUN`. Do not report a command you did not run.

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

For bug fixes, add a regression test whenever practical.

## UI changes

When behavior is visible in the UI:

1. Start the demo application.
2. Exercise the changed workflow.
3. Check the browser console for errors.
4. Capture screenshots showing the result where useful.

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

- Screenshots for visual changes 


Do not hide uncertainty. If product or architectural judgment is required, explicitly mark it for human review.
