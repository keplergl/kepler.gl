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
5. Switch **Render mode** to **3D surface** to rebuild the aggregate grid on the CPU and render it
   as an elevation-colored terrain mesh with `SimpleMeshLayer`.

The example ships with 500 synthetic points clustered over three Bay Area hot-spots. Each point
carries a generated `elevation` value from a smooth synthetic terrain, so the sample map config can
open in **3D surface** mode colored by elevation.

## How it works

| File                          | Purpose                                                                                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/custom-contour-layer.js` | Extends `Layer` from `@kepler.gl/layers` and renders `ContourLayer` or `SimpleMeshLayer`.                                                     |
| `src/density-surface.js`      | CPU grid aggregation, colored mesh generation, and baked hillshade for the 3D surface mode.                                                   |
| `src/app.tsx`                 | Registers the custom layer by passing `layerClasses` to `keplerGlReducer.initialState()`. Loads the sample dataset and an initial map config. |

### 3D surface mode

`ContourLayer` aggregates points on the GPU and only exposes contour geometry, so its internal grid
cannot be reused. The surface mode instead bins the original points into a regular lng/lat grid
(`cellRadius` km per cell), optionally smooths it, and builds a triangle mesh. Heights are normalized
to **Max surface height**; each vertex is colored by the normalized value through a hypsometric ramp
and multiplied by a simple northwest hillshade. The mesh is rendered with `SimpleMeshLayer` using
per-vertex colors.

With **Show elevation contours** enabled, the same grid is run through marching squares and the
resulting segments are raised to the surface height and drawn with `PathLayer`, so the DEM and
contour lines render together.

The sample data carries a generated `elevation` column, and the sample layer uses it as **Weight**,
so the surface color follows elevation. With no weight it is a **density surface** (point count per
cell). Either way it is an interpolated surface, not a survey-grade elevation DEM.

Controls:

- **Contours** — **Show elevation contours** overlays marching-squares contour
  lines on the surface; **Contour levels** sets how many levels are drawn.
- **Color** — color range selector; the default is a DEM-like blue → green → sand → white ramp.
- **Weight** — `Point count (density)`, or a numeric column aggregated as a per-cell mean.
- **Max surface height (m)** — normalized height applied to the highest cell.
- **Smoothing** — number of 3×3 box-blur passes; the slider goes to 20 and the
  **Custom passes** checkbox allows a typed value (internally capped at 100).

Grids are capped at 256×256 cells; a cell radius that would exceed the cap is coarsened so the mesh
stays small.

### Registering a custom layer

```ts
import keplerGlReducer from '@kepler.gl/reducers';
import {LayerClasses} from '@kepler.gl/layers';
import ContourKeplerLayer from './custom-contour-layer';

const customizedKeplerGlReducer = keplerGlReducer.initialState({
  visState: {
    layerClasses: {
      ...LayerClasses, // keep all built-in layer types
      contour: ContourKeplerLayer // add the new type under key 'contour'
    }
  }
});
```

The `type` getter of `ContourKeplerLayer` returns `'contour'`, matching the key above. kepler.gl
uses that key to look up the class when creating or restoring layers.

### Writing a custom layer class

A custom layer must extend `Layer` (or a subclass like `AggregationLayer`) and implement at
minimum:

| Member              | Required    | Description                                                          |
| ------------------- | ----------- | -------------------------------------------------------------------- |
| `get type()`        | ✓           | Unique string identifier, must match the key used in `layerClasses`. |
| `get name()`        | ✓           | Human-readable label shown in the UI.                                |
| `get layerIcon()`   | recommended | React component rendered as the layer type icon.                     |
| `renderLayer(opts)` | ✓           | Returns an array of deck.gl layer instances.                         |

For aggregation layers (point → grid → color) extend `AggregationLayer`. It handles column
configuration, data formatting, and `getPosition`/`getColorValue` accessors for you.

## Pre-requirements

- [Node.js >= 20](http://nodejs.org) (Volta pin: 24.21.0)
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
