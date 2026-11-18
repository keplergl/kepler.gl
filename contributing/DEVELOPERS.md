# Developing Kepler.gl

## Table of contents

- [Development Setup](./#development-setup)
- [Troubleshooting: gl package install](./#troubleshooting-gl-package-install)
- [Running Tests](./#running-tests)
- [Coding Rules](./#coding-rules)
- [Commit Message Guidelines](./#git-commit-guidelines)
- [Writing Documentation](./#writing-documentation-this-part-is-not-available-yet)
- [Developing kepler.gl Website](./#develop-the-kepler-gl-website)
- [Publish the website](./#publish-the-website)
- [Publish a new version](./#publish-kepler-gl-package-to-npm)

## Development Setup

This document describes how to set up your development environment to build and test Kepler.gl, and
explains the basic mechanics of using `git`, `node`, `yarn`.

### Installing Dependencies

Before you can build Kepler.gl, you must install and configure the following dependencies on your machine:

- [Git](http://git-scm.com/): The [Github Guide to Installing Git][git-setup] is a good source of information.

- [Node.js 24.21.0](http://nodejs.org) (see `.nvmrc`): We use Node to generate the documentation, run a
  development web server, run tests, and generate distributable files. Depending on your system,
  you can install Node either from source or as a pre-packaged bundle. Published packages accept Node >= 20.

  We recommend using [nvm](https://github.com/creationix/nvm) (or
  [nvm-windows](https://github.com/coreybutler/nvm-windows))
  to manage and install Node.js, which makes it easy to change the version of Node.js per project.

- [Yarn 4.4.0](https://yarnpkg.com): We use Yarn to install our Node.js module dependencies
  (rather than using npm). See the detailed [installation instructions][yarn-install].

- [Volta](https://volta.sh/): We use Volta to manage Node and Yarn versions without you manually switching them

#### Fork Kepler.gl Repo

If you plan to contribute code to kepler.gl, you must have a [GitHub account](https://github.com/signup/free) so you can push code and open Pull Requests in the [GitHub Repository][github]. You must [fork](http://help.github.com/forking) the
[main kepler.gl repository][github] to [create a Pull Request][github-pr].

#### Developing kepler.gl

If you are using Windows then using `WSL (Windows Subsystem for Linux)` is recommended. You can download a Linux Distribution like e.g. `Ubuntu` and inside of that distribution you can follow along with the next steps. You can find the detailed instructions about `WSL` [here](https://learn.microsoft.com/en-us/windows/wsl/).

If you are using MacOS or Linux then you can follow along.

Also please make sure the code editor you are using it has proper support for [EditorConfig](https://editorconfig.org/).VSCode has the [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) Plugin. Please install necessary support for EditorConfig for your editor so that other code formatters do not have an effect on the Kepler.GL code.

To develop features, debug code, run tests, we use webpack to start a local web server and serve the kepler.gl demo app from the src directory.

```bash
# Clone your kepler.gl fork repository:
git clone git@github.com:<github username>/kepler.gl.git

# Go to the kepler.gl directory:
cd kepler.gl

# Add the main kepler.gl repository as an upstream remote to your repository:
git remote add upstream "git@github.com:keplergl/kepler.gl.git"
```

Install [volta](https://docs.volta.sh/guide/getting-started)
On Unix, MacOS

```bash
# install Volta on Unix
curl https://get.volta.sh | bash
```

On Windows

```bash
winget install Volta.Volta
```

Install `nvm` to set the proper Node.js version for the project. Follow instructions to install nvm [here](https://github.com/nvm-sh/nvm).

```bash
# Install the proper Node.js version for the Kepler.gl project
nvm install

# Use the downloaded Node.js version for the Kepler.gl project
nvm use

# Enable Yarn
corepack enable
```

Install dependencies with Yarn

```bash
# Install Puppeteer
yarn dlx puppeteer


# Install JavaScript dependencies, then prepare compatibility patches and workspace entries:
yarn install --immutable
yarn bootstrap:prepare

# Setup Mapbox access token locally
export MapboxAccessToken=<MapboxAccessToken>
# Set up other environment variables
export DropboxClientId=<DropboxClientId>
export MapboxExportToken=<MapboxExportToken>
export CartoClientId=<CartoClientId>
export FoursquareClientId=<FoursquareClientId>
export FoursquareDomain=<FoursquareDomain>
export FoursquareAPIURL=<FoursquareAPIURL>
export FoursquareUserMapsURL=<FoursquareUserMapsURL>

# Start the kepler.gl demo app
yarn start
```

After the first install, `yarn bootstrap` can reinstall dependencies and run the same preparation.
The initial `yarn install` is required because Yarn 4 cannot run project scripts before its
`node_modules` state exists.

An demo app will be served at `http://localhost:8080/`

This is the demo app we hosted on [http://kepler.gl/#/demo][demo-app]. By default, it serves non-minified source code inside the src directory.

### Troubleshooting: gl package install

Yarn may report that the `gl` package (a dev dependency used for headless WebGL in tests) **could not be built**. That usually happens for one of two reasons:

1. **No prebuilt binary for your Node version and platform**  
   `prebuild-install` only ships binaries for certain Node releases and OS/arch pairs (for example, very new Node versions on Apple Silicon often have none). Yarn then falls back to compiling `gl` from source with `node-gyp`.

2. **Source build needs a `python` command**  
   The ANGLE sources invoked during that compile run `python` (not `python3`). macOS Command Line Tools typically install `python3` only, so the log shows `python: command not found` and `gyp ERR! configure error` even though `node-gyp` found Python 3.

**What to do**

- **Use the Node version pinned for this repo** (see `.nvmrc`, currently 24.21.0). After `nvm install` and `nvm use` (or Volta, as above), run `yarn install` / `yarn bootstrap` again. `gl@9.0.0-rc.10` has no Node 24 prebuild, so this pin compiles `gl` from source.

- **Install the native build dependencies.** On macOS, install Python 3 and the Xcode Command Line Tools. On Ubuntu/Debian, install Python 3 and the OpenGL/X11 toolchain:

  ```bash
  sudo apt-get install -y build-essential libxi-dev libglu1-mesa-dev libglew-dev pkg-config python3 python-is-python3
  ```

- **Ensure `python` is on your `PATH` and points to Python 3.** The pinned Node version compiles `gl` from source, so this also applies when using Node 24.21.0. For example, on macOS:

  ```bash
  sudo mkdir -p /usr/local/bin
  sudo ln -sf /usr/bin/python3 /usr/local/bin/python
  ```

  Use another location if `/usr/local/bin` is not early in your `PATH`.

#### Develop with deck.gl

When develop, upgrade, debug deck.gl, Demo app can load deck.gl directly from src

```
// load deck.gl from node_modules/deck.gl/src, sub-modules from node_modules/@deck.gl/<module>/src
npm run start:deck

// load deck.gl src from the deck.gl folder parallel to kepler.gl
npm run start:deck-src
```

## Running Tests

Run commands from the repository root on Node >= 20 (the Volta pin matches CI).
The test suite combines [Jest](https://jestjs.io/) with [Tape][tape]:

- Jest discovers `*.spec.ts` and `*.spec.tsx` beside the source in `src/`, plus
  `*.spec.js` under `src/` and `test/`. Use [Testing Library](https://testing-library.com/)
  for new React component tests.
- Tape tests live under `test/node/` and `test/browser/`. Import each new `*-test.js`
  file in the nearest `index.js`; an unimported file will not run. Browser Tape
  tests normally run in [jsdom](https://www.npmjs.com/package/jsdom).

```bash
# Jest, then Tape in Node and jsdom (does not run lint or headless browser tests)
yarn test

# Run one Jest suite while iterating
yarn test-jest --runTestsByPath src/layers/src/layer-text-label.spec.ts --watchAll=false

# Run each harness separately
yarn test-jest --watchAll=false
yarn test-node
yarn test-browser

# Tape in Node and jsdom without tap-spec formatting (does not run Jest)
yarn test-fast

# Typecheck plus Jest
yarn agent:check

# Required local verification: circular dependencies, typecheck, Jest, Tape and SQLRooms
yarn agent:verify
```

ESLint is separate from `yarn test`. `yarn lint:check` typechecks and runs ESLint
without changing files. `yarn lint` also applies fixes, so it can rewrite unrelated
files. CI currently uses ESLint with `--fix` because of existing formatting issues.
The Jest lint override covers the discovered spec extensions; some rules remain
warnings while existing test patterns are reviewed. Do not commit focused `.only`
tests after debugging.

The browser-driver commands are separate, optional checks:

```bash
# Headless Chromium via Puppeteer and probe.gl
yarn test-headless

# Open Chromium to debug the browser suites with developer tools
yarn test-browser-drive
```

To generate and merge Tape and Jest coverage reports:

```bash
yarn cover
```

## Test React components

Write new component tests with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
and Jest. Testing Library dependencies are already installed. Enzyme is no longer
supported or installed; do not introduce new Enzyme tests. Existing Tape suites
remain part of the test run and should not be removed as part of a component test
migration.

For older test examples, see the
[Enzyme migration guide](https://testing-library.com/docs/react-testing-library/migrate-from-enzyme/).

## Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as you are working:

- All features or bug fixes **must be tested** by one or more [specs][unit-testing].
- All public API methods **must be documented** with using jsdoc. To see how we document our APIs, please check
  out the existing source code and see the section about [writing documentation](#documentation)

This project use Eslint together Prettier. The linter should automatically inform you if you break any rules (like incorrect indenting, line breaking or if you forget a semicolon). Before doing a pull request, make sure to run the linter.

```bash
# To run the linter
yarn lint
```

## Git Commit Guidelines

To commit your changes, please follow our rules over how our git commit messages can be formatted. This leads to **more readable and unified messages** that are easy to follow. But also,
we use the git commit messages to **generate the kepler.gl change log**.

### Commit Message Format

Each commit message consists of a **header** and a **body**. The header has a special
format that includes a **type** and a **subject**. The **PR** # will be auto-generated once the PR is merged.

```
[<type>]<subject>(<pr>)
<BLANK LINE>
<body>

#e.g.
[Enhancement] Upgrade type-analyzer to pass 0/1 as integer (#317)

* Upgrade to type-analyzer@0.2.1
* Add test
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

### Revert

If the commit reverts a previous commit, it should begin with `revert: `, followed by the header
of the reverted commit.
In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit
being reverted.
A commit with this format is automatically created by the [`git revert`][git-revert] command.

### Type

Must be one of the following, capitalized.

- **[Feat]**: A new feature
- **[Enhancement]**: An update of a existing feature
- **[Bug]**: A bug fix
- **[Docs]**: Documentation only changes
- **[Style]**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, typos, etc)
- **[Refactor]**: A code change that neither fixes a bug nor adds a feature
- **[Perf]**: A code change that improves performance
- **[Test]**: Adding missing or correcting existing tests
- **[Chore]**: Changes to the build process or auxiliary tools and libraries such as documentation
  generation

### Subject

The subject contains succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines.
The rest of the commit message is then used for this.

## Writing Documentation (THIS PART IS NOT AVAILABLE YET)

The Kepler.gl project uses [jsdoc](http://usejsdoc.org/)

This means that all the docs are stored inline in the source code and so are kept in sync as it
changes.

There is also extra content (the developer guide, error pages, the tutorial,
and misceallenous pages) that live inside the Kepler.gl repository as markdown files.

This means that since we generate the documentation from the source code, we can easily provide
version-specific documentation by simply checking out a version of Kepler.gl and running the build.

### Building and viewing the docs locally

We build Api docs from scratch using [documentation.js][documentationjs]. It generates docs from jsdoc:

```bash
yarn docs
```

### Writing jsdoc

You can find JSDoc instructions [here][jsDoc]. Documentation.js is interested in the following block tags:

- `@param {type} name description` - describes a parameter of a function
- `@returns {type} description` - describes what a function returns
- `@property` - describes a property of an object
- `@description` - used to provide a description of a component in markdown

- `@example` - specifies an example.
- `@public` - Only methods with @public tag will be included in the docs

The `type` in `@param` and `@returns` must be wrapped in `{}` curly braces, e.g. `{Object|Array}`.
Parameters can be made optional by _either_ appending a `=` to the type, e.g. `{Object=}`, _or_ by
putting the `[name]` in square brackets.
Default values are only possible with the second syntax by appending `=<value>` to the parameter
name, e.g. `@param {boolean} [ownPropsOnly=false]`.

## Develop The kepler.gl Website

Make sure to export mapbox token in the same terminal before start the server.

```bash
$ export MapboxAccessToken=<insert_your_token>
```

In order to start

```bash
$ yarn web
```

To checkout the build

```bash
$ cd website && yarn build
```

## Publish the website

[Netlify](https://www.netlify.com/) is used to support kepler.gl demo website.

Netlify is connected to the following github triggers:

- Create a new PR
- Updated an existing PR
- Merge PR onto master

A new production version of kepler.gl website is automatically created and deployed every time a PR is merged onto master.

In order to support testing environment, Netlify is setup to generate build every time a PR is created or updated.
By generating builds for new and updated PRs we support CI/CD so developers can test their own build in a production like environment

### Publish kepler.gl package to NPM

#### Requirements

Run the local commands below from the repository root after completing the development setup. The npm publisher must also have the [publisher setup](#publisher-setup) below in place. GitHub release creation uses the workflow's built-in token; no local `gh-release` installation or personal GitHub token is required.

#### Release a new version

1. **Prepare locally.** Start a release branch from up-to-date `master`, fetch the release tags, and run:

   ```bash
   git fetch --tags
   yarn release:prepare 3.3.0-alpha.23
   ```

   Replace `3.3.0-alpha.23` with the new version. `release:prepare` bumps the workspace and root package versions and their internal dependency references, updates `yarn.lock` and the manual publisher workflow's version default, and adds a `CHANGELOG.md` section from commits since the previous release tag. It uses the first version heading in `CHANGELOG.md` and requires the matching local `v<version>` tag to be an ancestor of the current branch. It does not commit, tag, push, or publish.

   Review the generated version, lockfile, workflow, and changelog changes. Use this command for patch releases too; `npm version` in the private root package does not update the workspace packages and their cross-references.

   Preparation finishes by running `yarn release:check` to catch release build and TypeScript errors. This runs npm publish dry runs for both the workspace packages and the standalone `kepler.gl` bundle, including their release builds. It does not upload packages or validate npm publishing authentication. The manual publisher runs these checks again in CI.

   If the checks fail, the prepared version, lockfile, workflow, and changelog changes remain. Fix the errors and rerun `yarn release:check`; do not rerun `release:prepare` for the same version, since its changelog entry already exists.

2. **Commit, open a PR, and merge it into `master`.** Include the version, lockfile, workflow, and changelog changes. Wait for review and merge before starting the publisher.

3. **Publish from CI.** In `keplergl/kepler.gl`, open GitHub **Actions → npm Manual Publisher → Run workflow**, select `master`, confirm the prefilled version matches the merged release (for example, `3.3.0-alpha.23`), and check **publish**. `release:prepare` keeps this default current; the publisher still rejects a version that differs from the checked-out packages. Publishing is off by default; leaving it unchecked only rehearses the release.

   The [npm Manual Publisher workflow](../.github/workflows/npmpublish-manual.yml) runs `release:check`, packs and validates the workspaces and standalone bundle, saves the checked tarballs and checksums, and publishes those artifacts. The root manifest's `private` field is removed only while packing and restored afterward. Packages are published with public access and the npm `latest` tag, **including alpha versions**.

   After all npm uploads succeed, the final step runs `gh-release` noninteractively to create the Git tag and GitHub release from the exact published commit, using its `package.json` version and `CHANGELOG.md` section. The existing `gh-release` metadata defaults are unchanged. Wait for the publish job to succeed; see [failed publishing runs](#failed-publishing-runs) if it fails.

#### Publisher setup

Configure npm Trusted Publishing for **every published workspace package and the root `kepler.gl` package** using the settings below, leaving **Environment name** empty. No GitHub environment setup is required. Configure new registrations close to the release because [npm requires a first successful publish within two days](https://docs.npmjs.com/trusted-publishers/#trusted-publisher-configuration-expiry). A dry run does not validate authentication.

In each package's npm settings, add a GitHub Actions Trusted Publisher:

| Setting              | Value                                      |
| -------------------- | ------------------------------------------ |
| Organization or user | `keplergl`                                 |
| Repository           | `kepler.gl`                                |
| Workflow filename    | `npmpublish-manual.yml`                    |
| Environment name     | Leave empty                                |
| Allowed actions      | Allow direct publishing with `npm publish` |

The publish job uses GitHub OIDC, not an npm token. If an existing registration for this workflow specifies `npm-release`, delete it and create a new registration with **Environment name** empty; existing connections cannot be edited. Keep the old token/secret until the new path has completed a successful release. See [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/) for setup requirements.

This workflow deliberately uses no GitHub environment or environment protection rules, so setup does not require a repository admin. The repository and `master` checks prevent accidental publishing from the wrong place, but are editable workflow code: repository writers who can modify workflows could publish from another branch. This setup therefore trusts those contributors with npm publishing access.

In GitHub Actions, open the old **Node.js Package** workflow ([`npmpublish.yml`](../.github/workflows/npmpublish.yml)) and choose **Disable workflow** from its menu. Wait for or cancel any outstanding runs. The manual publisher checks that this workflow is disabled and idle before uploading; it never changes that setting itself. Keep it disabled after publishing, including when creating the GitHub release. Avoid concurrent local publishing too.

#### Preview releases in CI

For a rehearsal of the manual publisher, run it with **publish** unchecked. It runs the same preparation and saves checked artifacts without uploading to npm.

The separate [npm Release Preview workflow](../.github/workflows/npmpublish-preview.yml) also runs both workspace and standalone bundle dry runs with `yarn release:check`. Open GitHub **Actions → npm Release Preview → Run workflow**, select the branch to check, and start the run. It runs only when started manually; creating a GitHub release does not trigger it. It uses npm 11.19.0 and the repository's Node/Yarn versions, with no npm credentials or OIDC publishing permission. Do not configure npm Trusted Publishers for this preview workflow.

A successful rehearsal checks the release build path; it does not prove npm publishing authentication works or guarantee that a later multi-package release cannot fail partway through.

#### Failed publishing runs

The workflow proceeds to the next package as soon as `npm publish` succeeds, then creates the GitHub release after the bundle publish succeeds. It does not poll the registry or wait for npm's background processing. A successful run means npm accepted the uploads and the GitHub release was created; the new package versions may become available later. Both release dry runs and all artifact checks still run before publishing.

If a publish command fails, use **Re-run failed jobs** on that same run. The failed publish job downloads the original artifact by ID and does not rebuild. It skips an already-published version only when its registry checksum matches the saved tarball, and refuses conflicts, registry errors, or an attempt to move `latest` backward. If an earlier accepted upload is still being processed by npm, a retry can fail because that version is not yet visible to the skip check. Let npm finish processing before retrying; CI does not wait for it. A rerun uses the original commit and script, so merging a script fix does not change an existing run's behavior.

If the final GitHub release step fails, npm uploads may already be complete. Fix the error and use **Re-run failed jobs** on the same run; the existing checksum checks skip matching npm packages before retrying release creation. `gh-release` fails if the GitHub release already exists and does not overwrite it. If an error leaves creation uncertain, inspect the existing GitHub release before retrying.

Do not use **Re-run all jobs** or start a new run to resume an interrupted upload. GitHub [may delete the original artifacts on a full rerun](https://github.com/actions/upload-artifact/issues/323#issuecomment-2786789065), even with a fixed artifact name and overwriting disabled. For publishing runs, preparation refuses every attempt after the first, before any build or upload. This prevents replacement artifacts from being published but cannot prevent GitHub deleting the originals. If the original artifact is deleted or expires after 14 days, stop and recover the original tarballs from an independently saved copy for manual review; do not rebuild a partial release. If preparation itself failed before publishing could start, start a new workflow run instead.

Publishing multiple packages is not atomic: a network or authentication failure can leave a partial release. The retry continues from verified existing packages; it does not roll back uploads. The workflow creates the GitHub release only after all packages succeed.

#### After the release

- Update each of the example folder `package.json` kepler.gl dependency with the new version. To update all examples, run:

```bash
yarn example-version
```

This step is required after the new version is published otherwise it would fail.

## Gitbook documentation

Kepler.gl documentation is hosted on [gitbook](https://kepler-gl.gitbook.io/kepler-gl/). For more information [read here](https://docs.gitbook.com/)

### Documentation structure

The documentation layout is defined by **SUMMARY.md** file where the table of contents define each entry has the following structure

```markdown
- [ENTRY_LABEL](FILE_PATH)
  e.g.
- [Welcome](README.md)
```

The above file is used by Gitbook to generate the doc navigation visible on the left-hand side of Kepler.gl doc website.
Gitbook also has the ability to show description for each folder/section of the documentation by creating an entry in **SUMMARY.md**
and create a new **README.md** file within said folder. The README.md file is a Gitbook convention that treats README files as if they were the main entry file for each folder.

The following is an example of doc section in SUMMARY.md file:

```markdown
- [User guides](docs/user-guides/README.md)
```

### Update Documentation

The integration with Gitbook allows to update the documentation in two different ways:

- Update doc files in the Kepler.gl repo. Follow the PR flow like any other changes
- Update documentation directly on Gitbook.

For both scenarios, changes will be propagated from one system to the other and vice versa. When updating Gitbook, a new git commit will be push to the Kepler.gl master branch.

[demo-app]: http://kepler.gl/#/demo
[documentationjs]: https://documentation.js.org/
[eslint]: https://eslint.org/
[git-revert]: https://git-scm.com/docs/git-revert
[git-setup]: https://help.github.com/articles/set-up-git
[github]: https://github.com/keplergl/kepler.gl
[github-pr]: https://help.github.com/articles/creating-a-pull-request/
[jsDoc]: http://usejsdoc.org/
[tape]: https://github.com/substack/tape
[yarn-install]: https://yarnpkg.com/getting-started/install
