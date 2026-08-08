# Customize kepler.gl Reducer

Demo showing how to customize the kepler.gl reducer:

1. Customize reducer initial state via `keplerGlReducer.initialState`
2. Add custom actions via `keplerGlReducer.plugin`

## Pre-requirements

- [Node.js ^20.x](http://nodejs.org)
- [Yarn 4.4.0](https://yarnpkg.com): See the [installation instructions][yarn-install].

## 1. Install Dependencies

Go to the `examples/custom-reducer` directory and run:

```sh
touch yarn.lock && yarn
```

> `touch yarn.lock` is required once to mark this directory as a standalone Yarn project,
> independent of the monorepo root.

## 2. Start the App

```sh
yarn start
```

The app will be available at [http://localhost:8080](http://localhost:8080).

## Production Build

```sh
yarn build
```

The output will be in the `dist/` directory.

[yarn-install]: https://yarnpkg.com/getting-started/install
