# Developing Kepler.gl

## Table of contents

- [Development Setup](./#development-setup)
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

Before you can build Kepler.gl, you must install and configure the following dependencies on your
machine:

- [Git](http://git-scm.com/): The [Github Guide to Installing Git][git-setup] is a good source of information.

- [Node.js ^18.x](http://nodejs.org): We use Node to generate the documentation, run a
  development web server, run tests, and generate distributable files. Depending on your system,
  you can install Node either from source or as a pre-packaged bundle.

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

Install dependencies with Yarn

```bash
# Install Puppeteer
yarn global add puppeteer


# Install JavaScript dependencies:
yarn install
yarn bootstrap

# Setup mapbox access token locally
export MapboxAccessToken=<insert_your_token>

# Start the kepler.gl demo app
yarn start
```

An demo app will be served at `http://localhost:8080/`

This is the demo app we hosted on [http://kepler.gl/#/demo][demo-app]. By default, it serves non-minified source code inside the src directory.

#### Develop with deck.gl

When develop, upgrade, debug deck.gl, Demo app can load deck.gl directly from src

```
// load deck.gl from node_modules/deck.gl/src, sub-modules from node_modules/@deck.gl/<module>/src
npm run start:deck

// load deck.gl src from the deck.gl folder parallel to kepler.gl
npm run start:deck-src
```

## Running Tests

- We write node and browser tests with [Tape][tape], [Enzyme][enzyme], [jsDom](https://www.npmjs.com/package/jsdom) and [@probe.gl/test-util](https://uber-web.github.io/probe.gl/docs/modules/test-utils/browser-driver), and lint with [ESLint][eslint]. Make sure to run test before submitting your PR. To run all of the tests once

```bash
yarn test
```

- Yarn test runs lint and 3 tests in different env. To run them separately

```bash
# lint
yarn lint

# node tests
yarn test-node

# jsdom tests
yarn test-browser

# headless browser tests, uses probe.gl to run browser tests with puppeteer
yarn test-headless
```

- Here are some handy scripts / tricks for debugging tests

1. add `.only` to errored tests to only run 1 test at a time

```js
test.only('MapContainerFactory', t => {
  // tests
}
```

2. run all tests in chromium browser. This runs node, browser and headless browser tests in chromium browser and logs the output, you can step through the code with chrome developer tools

```bash
yarn test-browser-drive
```

3. Fast tests, runs node and browser tests without tap-spec output

```bash
yarn test-fast
```

To generate a coverage report

```bash
yarn cover
```

## Test React components

Enzyme is no longer supported therefore we are now transitioning to [testing library](https://testing-library.com/).

We have introduced an eslint rule to deprecate the usage of enzyme so if you attempt to create new tests using enzyme
it will throw an error when running lint.

In order to create new tests cases please take advantage of [Testing Library](https://testing-library.com/).
All necessary dependencies are already installed, you can start testing your React components by following this
[doc](https://testing-library.com/docs/react-testing-library/intro);

### Migrating enzyme to React testing library

If you are interested in migrating enzyme tests to RTL (react testing library) feel free to check
the [official migration guidelines](https://testing-library.com/docs/react-testing-library/migrate-from-enzyme/)

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

To prepare a new release you need the following tool:

- [gh-release](https://www.npmjs.com/package/gh-release): this tool facilitates the creation of a new git tag (using package.json version number) and a github release (different from npm release)

Setup `gh-release` with your github api token ([instructions](https://www.npmjs.com/package/gh-release#command-line-interface))

### Push a new release

In order to publish a new version of kepler.gl a developer must perform the following steps:

1. Update **package.json** file with the new version value. Run `npm version major | minor | patch` to update version accordingly.
2. Update **CHANGELOG.md** with the latest commit changes. Print commits with `git log --pretty=oneline --abbrev-commit`
3. Create a new PR for review.
4. Once the PR is reviewed and merged, pull the latest changes locally.
5. Run `gh-release`: this command will create a new Github Release with the new updated CHANGELOG.md section.
6. Once the new Github Release is created, Github will automatically trigger a new Github Action flow that will automatically build and publish the new package version to NPM registry.

**After Release is completed and pushed**

- Update each of the example folder package.json kepler.gl dependency with the newer. To update all examples, run

```bash
npm run example-version
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
[enzyme]: https://airbnb.io/enzyme/
[git-revert]: https://git-scm.com/docs/git-revert
[git-setup]: https://help.github.com/articles/set-up-git
[github]: https://github.com/keplergl/kepler.gl
[github-pr]: https://help.github.com/articles/creating-a-pull-request/
[jsDoc]: http://usejsdoc.org/
[tape]: https://github.com/substack/tape
[yarn-install]: https://yarnpkg.com/getting-started/install
