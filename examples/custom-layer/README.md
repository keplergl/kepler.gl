# Custom Layer Example

Demonstrates how to add a **custom deck.gl layer** to kepler.gl's layer type selector.

The example registers [`ContourLayer`](https://deck.gl/docs/api-reference/aggregation-layers/contour-layer)
from `@deck.gl/aggregation-layers` as a new kepler.gl layer type called **"Contour"**. This layer is
not part of kepler.gl's built-in layer set.

When you load a dataset with `lat`/`lng` columns you can:

1. Open the **Layers** panel and click **+ Add Layer**.
2. Select **Contour** from the layer type dropdown.
3. Map the `lat` and `lng` columns.
4. The `ContourLayer` renders isoband contour lines over dense point clusters — similar to topographic contour maps.

The example ships with 500 synthetic points clustered over three Bay Area hot-spots so the
contour rendering is immediately visible.

## How it works

| File | Purpose |
|------|---------|
| `src/custom-contour-layer.js` | Extends `AggregationLayer` from `@kepler.gl/layers` and renders `ContourLayer` from `@deck.gl/aggregation-layers`. |
| `src/app.tsx` | Registers the custom layer by passing `layerClasses` to `keplerGlReducer.initialState()`. Loads the sample dataset and an initial map config. |

### Registering a custom layer

```ts
import keplerGlReducer from '@kepler.gl/reducers';
import {LayerClasses} from '@kepler.gl/layers';
import ContourKeplerLayer from './custom-contour-layer';

const customizedKeplerGlReducer = keplerGlReducer.initialState({
  visState: {
    layerClasses: {
      ...LayerClasses,          // keep all built-in layer types
      contour: ContourKeplerLayer  // add the new type under key 'contour'
    }
  }
});
```

The `type` getter of `ContourKeplerLayer` returns `'contour'`, matching the key above. kepler.gl
uses that key to look up the class when creating or restoring layers.

### Writing a custom layer class

A custom layer must extend `Layer` (or a subclass like `AggregationLayer`) and implement at
minimum:

| Member | Required | Description |
|--------|----------|-------------|
| `get type()` | ✓ | Unique string identifier, must match the key used in `layerClasses`. |
| `get name()` | ✓ | Human-readable label shown in the UI. |
| `get layerIcon()` | recommended | React component rendered as the layer type icon. |
| `renderLayer(opts)` | ✓ | Returns an array of deck.gl layer instances. |

For aggregation layers (point → grid → color) extend `AggregationLayer`. It handles column
configuration, data formatting, and `getPosition`/`getColorValue` accessors for you.

## Pre-requirements

- [Node.js ^20.x](http://nodejs.org)
- [Yarn 4.4.0](https://yarnpkg.com): See the detailed [installation instructions][yarn-install].

## 1. Install Dependencies

Go to the `examples/custom-layer` directory and run:

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
