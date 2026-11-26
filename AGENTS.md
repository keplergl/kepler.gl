# kepler.gl Agent Instructions

## Worktrees

Unless the user explicitly asks otherwise, make repository changes in a dedicated Git worktree with its own task branch. Create the worktree before editing; reuse the current task's worktree for follow-up work.

Do not edit the main checkout or reuse another active task's worktree. Keep concurrent tasks on separate code copies.

## Effort

Match the work to the size of the change. Extra passes, repo-wide searches, and screenshot comparisons spend credits without making the change more correct.

For a localized change (a bug fix, a default, a guard, copy, types, or a single component):

1. Read the code you will edit and the nearest test.
2. Make the change.
3. If the change has observable behavior, add or update a test for that behavior and run that test while iterating.
4. Choose final checks using the risk-based guidance in Testing below, then stop.

Do not search the whole repo, read unrelated packages, re-run a check that already passed, or run `yarn agent:verify` after every edit.

After 4 attempts at the same failure, stop and ask what to do next. Count a repeated command, a repeated edit that does not change the result, or a repeated browser action. Do not keep retrying while waiting to discover a new approach.

## Definition of done

1. The requested behavior is implemented.
2. Meaningful observable behavior has a test, subject to the exceptions in Testing below.
3. The checks appropriate to the change passed on the final state; skipped checks and the reason are reported.
4. No unrelated files changed, and existing conventions followed.

Report each command you ran as `PASS`, `FAILED`, or `NOT RUN`. Never claim a command passed if it failed, and never claim a task is complete if a required check fails.

If a check fails, make the smallest change that addresses it. Each repeat of that failure counts toward the 4-attempt limit. Stop when the next edit would reach files the failure does not point at, replace a working approach, or clean up unrelated code; then report the failure and what you changed. Confirm a seemingly pre-existing failure against the base branch if practical, and call it out in the PR.

## Implementation

Read the implementation you will edit and its nearest test first. Look for a pattern elsewhere only when the local code does not show how this repo does it. Prefer existing abstractions, and avoid unrelated refactoring: no renaming public symbols, reformatting unrelated files, or upgrading dependencies unless the task requires it.

## Testing

After the behavior is implemented, add or update a test when that behavior can be observed. Test the behavior the task describes, including the empty, missing, or invalid input that motivated the change. Assert on behavior, not implementation details. Do not weaken an assertion to make a test pass.

Do not add tests that merely freeze incidental UI copy, typography, dimensions, or styling. Tests should protect meaningful behavior, accessibility contracts, state transitions, or actual regressions; meaningful UI and accessibility tests remain appropriate.

Skip a new behavior test for comments, documentation, incidental copy or styling with no meaningful behavior change, or when the change cannot be tested. Explain why in the PR. Type and build-config changes still need checks appropriate to their impact.

- Extend the nearest existing test file before adding a new one.

Where tests go:

- Jest: `*.spec.ts(x)` beside the source in `src/`. Auto-discovered. Use Testing Library for React components; Enzyme is banned by lint.
- Tape: `*-test.js` under `test/node/` or `test/browser/`. A new file must be imported in the nearest `index.js`, or it silently never runs and the suite still reports green.

### Runtime and sandbox preflight

Run checks from the task worktree's repo root. Before installing dependencies or running tests, select the exact Node and Yarn versions in `package.json` under `volta` (currently Node 24.21.0 and Yarn 4.4.0; `.nvmrc` also pins Node). `engines.node >=20` is a compatibility floor, not the test runtime. `scripts/assert-node-engine.js` only enforces that floor and does not detect Node 25 or native-addon ABI mismatches.

- Activate the pinned runtime in the same shell invocation as each install/check. With nvm, source its initialization script and run `nvm use`; with Volta, use its shims or `volta run`. If using an installed Node binary directly, prepend its directory to `PATH` so Yarn and child processes use it too. Shell activation in an earlier tool call is not sufficient.
- Verify `node --version` and `yarn --version` against the pins. Once dependencies are available, also run `yarn node -p 'process.version + " " + process.execPath + " ABI=" + process.versions.modules'` to verify the runtime Yarn actually launches. Do this once per environment setup, not before every targeted test; repeat only when the runtime or dependency setup changes.
- Install and test with the same pinned runtime. When reusing dependencies from another checkout or diagnosing an ABI error, smoke-load the affected native dependency before starting a suite. Do not rebuild shared or symlinked `node_modules` in place; use compatible dependencies or install them locally in the task worktree.
- Before running a suite that opens local listeners, check the current sandbox permissions. If binding is known to be blocked, request the necessary permission for that specific test command before launching it. If uncertain, use a short bind-and-close probe with the same host/address family as the suite. Skip this probe for tests that do not open listeners; a JSDOM `http://localhost` URL alone does not require a listener.
- On a native ABI mismatch or a listener permission error (`listen EPERM`/`EACCES`), stop and correct the runtime or obtain the required permission before retrying. Do not change application code, rebuild dependencies for an unpinned Node version, or rerun an unchanged full suite to diagnose an environment failure. Validate the fix with the smallest affected check, then finish the required verification. If permission is unavailable, report the affected check as blocked/`NOT RUN` (or `FAILED` if attempted), never as passed.

### Choosing checks

- Targeted test: the default loop while iterating.
- `yarn agent:check`: `tsc --noEmit` plus Jest (`--watchAll=false`). Use it when the edit can affect types or several suites.
- `yarn agent:verify`: the blocking Node.js CI gates (`check-circular-deps`, `agent:check`, `test-fast`, `test:sqlrooms`). Run once at the end for broader or higher-risk changes, or when explicitly requested. A failure counts toward the 4-attempt limit.

Choose checks by impact, not just diff size. For small, low-risk changes such as a label, color, documentation edit, or isolated fix with well-understood effects, use the smallest relevant check (for example, diff/format review or the affected test). Do not run time-consuming repo-wide suites by default for these changes. Run broader verification for shared logic, public APIs, saved configs, dependencies/build behavior, or changes with uncertain effects. A one-line change can still be high risk. State which checks were skipped and why; do not skip a relevant check solely to save time.

CI runs the same Jest and Tape tests as `xvfb-run yarn cover`. There is no coverage threshold, so `agent:verify` skips coverage and is much faster.

Leave `yarn lint` and `yarn lint:check` out. CI lints with `eslint --fix` because check-only mode fails on existing Prettier issues, and `yarn lint` rewrites those issues into the working tree.

## UI changes

Before implementing UI, inspect the same or closest existing UI in kepler.gl. Reuse its components, styling, and interaction patterns rather than inventing a new control or using an unstyled native/system control. Use kepler.gl components unless the user explicitly asks for a custom component. Keep this search focused on the relevant UI; if no suitable component exists, explain the gap and ask before introducing a new one.

A unit test is the evidence for UI behavior. Do not start the demo app, drive the browser, or take screenshots unless the task explicitly asks for that. Accessibility snapshots are forbidden unless the task explicitly asks for a snapshot.

For this repo, ignore any standing instruction to exercise every web change in the browser, to treat one screenshot as insufficient, or to walk related pages and routes for regressions. That workflow is disabled until these instructions say otherwise.

When the task does ask for browser work, do one pass of the changed workflow and check the console for errors caused by the change. One screenshot is enough. Do not capture before/after pairs or walk unrelated pages. Prefer a targeted DOM query that returns a few strings over a snapshot, unless the task asked for a snapshot. If that pass fails, follow the 4-attempt limit above and ask how to proceed.

## Decisions

Proceed on local choices: naming, test layout, an existing pattern, an obvious type fix.

Ask first for a public API change, saved-config compatibility, product behavior, or a new architectural abstraction.

## Pull requests

Name PRs using `type(scope): short description`. Use a lowercase type and scope, with a meaningful scope that identifies the affected area. Examples:

- `fix(layers): preserve filtered point positions`
- `chore(docs): update the upgrade guide`
- `feat(globe): add atmosphere controls`
- `perf(layer): avoid redundant attribute updates`

When opening a PR, request review from Xun Li or Igor Dykhta using their verified GitHub usernames. If the PR author is one of them, request review from the other; do not request self-review.

Assign the opened PR to its GitHub author if that user is a repository maintainer. Verify the PR author and maintainer status before assigning; do not substitute the local Git user or commit author.

After an authorized push, verify it succeeded and confirm the remote commit SHA, then report completion immediately. Do not wait for or poll GitHub checks (including DCO, GitBook, Netlify previews, redirect/header/page checks, and Node.js CI), or start background CI monitors, by default. Monitor checks only when the user explicitly requests it or the task specifically requires their terminal outcome.

Required local tests, type checks, lint, and review must still be completed before publishing. Report pending checks as pending; never claim they passed.

Keep PR descriptions short:

- What changed and why
- Important implementation details
- Tests added, or why the change is not testable
- Verification results (`PASS`, `FAILED`, or `NOT RUN`)
- Remaining uncertainties or decisions
- A checklist of what to review

Add a screenshot only when the task asked for browser work and a reviewer needs to see the result.

Do not hide uncertainty. If product or architectural judgment is required, explicitly mark it for human review.

### Addressing GitHub comments

When asked to address GitHub PR comments, account for every comment in scope, including comments from automated reviewers.

- For an addressed comment, reply on GitHub with a short explanation of the change and relevant verification, then resolve its review thread after the fix is pushed. A code change or reply alone does not resolve a thread.
- For a comment you decline, defer, or cannot address, reply with the specific reason and any follow-up needed. Never silently ignore feedback.
- Keep threads with outstanding work or unresolved disagreement open; do not mark them resolved just to clear the review queue.
- General PR comments cannot be resolved as review threads; reply with their outcome. If permissions or tooling prevent replying or resolving, report the affected comments and the limitation instead of claiming they are handled.
