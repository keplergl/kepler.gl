# Customize kepler.gl Theme

This example shows how to customize the kepler.gl theme:

1. Define an object (`theme`) to override kepler.gl styles
2. Pass the newly created object as the `theme` prop to the `KeplerGl` component

## Pre-requirements

- [Node.js ^20.x](http://nodejs.org)
- [Yarn 4.4.0](https://yarnpkg.com): See the [installation instructions][yarn-install].

## 1. Install Dependencies

Go to the `examples/custom-theme` directory and run:

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

Use the checkbox in the bottom-right corner to toggle between the default and the custom (light) theme.

## Production Build

```sh
yarn build
```

The output will be in the `dist/` directory.

[yarn-install]: https://yarnpkg.com/getting-started/install
