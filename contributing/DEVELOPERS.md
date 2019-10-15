# Developing Kepler.gl

* [Development Setup](#setup)
* [Running Tests](#tests)
* [Coding Rules](#rules)
* [Commit Message Guidelines](#commits)
* [Writing Documentation](#documentation)
* [Developing kepler.gl Website](#website)

## <a name="setup"> Development Setup

This document describes how to set up your development environment to build and test Kepler.gl, and
explains the basic mechanics of using `git`, `node`, `yarn`.

### Installing Dependencies

Before you can build Kepler.gl, you must install and configure the following dependencies on your
machine:

* [Git](http://git-scm.com/): The [Github Guide to
  Installing Git][git-setup] is a good source of information.

* [Node.js ^6.x](http://nodejs.org): We use Node to generate the documentation, run a
  development web server, run tests, and generate distributable files. Depending on your system,
  you can install Node either from source or as a pre-packaged bundle.

  We recommend using [nvm](https://github.com/creationix/nvm) (or
  [nvm-windows](https://github.com/coreybutler/nvm-windows))
  to manage and install Node.js, which makes it easy to change the version of Node.js per project.

* [Yarn](https://yarnpkg.com): We use Yarn to install our Node.js module dependencies
  (rather than using npm). See the detailed [installation instructions][yarn-install].

#### Fork Kepler.gl Repo
If you plan to contribute code to kepler.gl, you must have a [GitHub account](https://github.com/signup/free) so you can push code and open Pull Requests in the [GitHub Repository][github]. You must [fork](http://help.github.com/forking) the
[main kepler.gl repository][github] to [create a Pull Request][github-pr].


#### Developing kepler.gl

To develop features, debug code, run tests, we use webpack to start a local web server and serve the kepler.gl demo app from the src directory.

```shell
# Clone your kepler.gl fork repository:
git clone git@github.com:<github username>/kepler.gl.git

# Go to the kepler.gl directory:
cd kepler.gl

# Add the main kepler.gl repository as an upstream remote to your repository:
git remote add upstream "git@github.com:keplergl/kepler.gl.git"

# Install JavaScript dependencies:
yarn --ignore-engines

# Setup mapbox access token locally
export MapboxAccessToken=<insert_your_token>

# Start the kepler.gl demo app
npm start
```

An demo app will be served at

```text
http://localhost:8080/
```

This is the demo app we hosted on [http://kepler.gl/#/demo][demo-app]. By default, it serves non-minified source code inside the src directory.

#### Develop with deck.gl

When develop, upgrade, debug deck.gl, Demo app can load deck.gl directly from src
```
// load deck.gl from node_modules/deck.gl/src, sub-modules from node_modules/@deck.gl/<module>/src
npm run start:deck

// load deck.gl src from the deck.gl folder parallel to kepler.gl
npm run start:deck-src
```

## <a name="tests"> Running Tests

We write unit and browser tests with [Tape][tape] and [Enzyme][enzyme], and lint with [ESLint][eslint]. Make sure to run test before submitting your PR. To run all of the tests once with node:

```shell
yarn test
```

To run separately
```shell
# lint
yarn lint

# node tests
yarn test-node

# browser tests
yarn test-browser

# fast test (no linting)
yarn fast-test
```

To generate a coverage report
```shell
yarn cover
```

<!-- ## <a name="rules"></a> Coding Rules -->

To ensure consistency throughout the source code, keep these rules in mind as you are working:

* All features or bug fixes **must be tested** by one or more [specs][unit-testing].
* All public API methods **must be documented** with using jsdoc. To see how we document our APIs, please check
  out the existing source code and see the section about [writing documentation](#documentation)


## <a name="commits"></a> Git Commit Guidelines

To commit your changes, please follow our rules over how our git commit messages can be formatted.  This leads to **more readable and unified messages** that are easy to follow.  But also,
we use the git commit messages to **generate the kepler.gl change log**.

### Commit Message Format
Each commit message consists of a **header** and a **body**.  The header has a special
format that includes a **type** and a **subject**. The **PR** # will be auto-generated once the PR is merged.

```shell
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

* **[Feat]**: A new feature
* **[Enhancement]**: An update of a existing feature
* **[Bug]**: A bug fix
* **[Docs]**: Documentation only changes
* **[Style]**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, typos, etc)
* **[Refactor]**: A code change that neither fixes a bug nor adds a feature
* **[Perf]**: A code change that improves performance
* **[Test]**: Adding missing or correcting existing tests
* **[Chore]**: Changes to the build process or auxiliary tools and libraries such as documentation
  generation

### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines.
The rest of the commit message is then used for this.

## <a name="documentation"></a> Writing Documentation (THIS PART IS NOT AVAILABLE YET)

The Kepler.gl project uses [jsdoc](http://usejsdoc.org/)

This means that all the docs are stored inline in the source code and so are kept in sync as it
changes.

There is also extra content (the developer guide, error pages, the tutorial,
and misceallenous pages) that live inside the Kepler.gl repository as markdown files.

This means that since we generate the documentation from the source code, we can easily provide
version-specific documentation by simply checking out a version of Kepler.gl and running the build.

### Building and viewing the docs locally
We build Api docs from scratch using [documentation.js][documentationjs]. It generates docs from jsdoc:

```shell
yarn docs
```

### Writing jsdoc
You can find JSDoc instructions [here][jsDoc]. Documentation.js is interested in the following block tags:

* `@param {type} name description` - describes a parameter of a function
* `@returns {type} description` - describes what a function returns
* `@property` - describes a property of an object
* `@description` - used to provide a description of a component in markdown

* `@example` - specifies an example.
* `@public` - Only methods with @public tag will be included in the docs

The `type` in `@param` and `@returns` must be wrapped in `{}` curly braces, e.g. `{Object|Array}`.
Parameters can be made optional by *either* appending a `=` to the type, e.g. `{Object=}`, *or* by
putting the `[name]` in square brackets.
Default values are only possible with the second syntax by appending `=<value>` to the parameter
name, e.g. `@param {boolean} [ownPropsOnly=false]`.


## <a name="website"></a> Develop The kepler.gl Website

Make sure to export mapbox token in the same terminal before start the server.
```sh
    export MapboxAccessToken=<insert_your_token>
```

In order to start
```
    yarn web
```

To checkout the build
```
    cd website && yarn build
```

Publish on github pages __Authorized User Only__.

<b>important* Before publish. Copy the mapbox token at [this link](http://t.uber.com/kepler.gl-token). (Only accessible by Uber developer). Deploy will fail if token is missing</b>
```
    export MapboxAccessToken=<insert_your_token>
    yarn deploy
```

### <a name="gh-pages"></a> Testing environment using GH Pages
We currently host the demo-app on Github pages. We have provided a way to test github pages before pushing the branch to
the actual repo.
In order to test github pages with your changes, you need to satisfy the following requirements first:
- Make sure you have your own github pages (username.github.io) repo, [click here](https://pages.github.com/)
- In your local fork of kepler.gl, add your github pages repo to the list of git remotes by doing:

```bash
git remote add test git@github.com:<username>/<username>.github.io.git
```

With the above command, A new origin __test__ will be created, and your own testing copy of gh pages will be push to it.

When everything is set up, run the following command:

```bash
yarn deploy:test
```

The above command will build the website and push to your gh-pages branch.

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
[yarn-install]: https://yarnpkg.com/en/docs/install
