# Clicked Feature Outside the Map

Shows how to read a clicked GeoJSON feature from Kepler.gl Redux state and
render it in a **host-app sidebar**, not in the on-map tooltip.

This answers [discussion #3054](https://github.com/keplergl/kepler.gl/discussions/3054):
subscribe to `visState.clicked` for the Kepler instance `id`.

## How it works

Layer clicks dispatch `onLayerClick`, which stores deck.gl pick info on
`state.keplerGl.<id>.visState.clicked`. Clicking empty map clears it.

For a GeoJSON polygon, original feature properties are kept on the picked
object (plus an internal `index`):

```ts
const clicked = useSelector(state => state.keplerGl.map.visState.clicked);
const shapeName = clicked?.object?.properties?.shapeName;
```

`<id>` must match the `KeplerGl` `id` prop (`map` in this example).

GeoJSON picking only works while **tooltip interaction is enabled** and the
layer has `allowHover: true` (the default).

## Pre-requirements

- [Node.js ^20.x](http://nodejs.org)
- [Yarn 4.4.0](https://yarnpkg.com): See the detailed [installation instructions][yarn-install].

## 1. Install Dependencies

Go to the `examples/clicked-feature` directory and run:

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
Click a neighborhood polygon; `shapeName` appears in the right sidebar.

## Production Build

```sh
yarn build
```

The output will be in the `dist/` directory.

[yarn-install]: https://yarnpkg.com/getting-started/install
