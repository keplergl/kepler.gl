# Upgrade Guide — kepler.gl 3.3

kepler.gl 3.3 upgrades the rendering stack from **deck.gl 8 / luma.gl 8** to **deck.gl 9 / luma.gl 9**. This is a major dependency upgrade that changes how WebGL resources, shaders, and rendering parameters are handled under the hood. Most kepler.gl users will not need to change application code, but library consumers who extend layers, interact with the WebGL context directly, or depend on internal types should review this guide.

## Dependency Changes

| Package group   | Old version | New version |
| --------------- | ----------- | ----------- |
| `react`         | ^18.2.0     | **^19.0.0** |
| `react-dom`     | ^18.2.0     | **^19.0.0** |
| `react-redux`   | ^8.0.5      | **^9.1.0**  |
| `react-intl`    | ^6.3.0      | **^7.0.0**  |
| `react-map-gl`  | ^7.1.6      | **^8.1.1**  |
| `maplibre-gl`   | ^3.6.2      | **^4.0.0**  |
| `@deck.gl/*`    | 8.9.x       | **9.2.11**  |
| `@luma.gl/*`    | 8.x         | **9.2.6**   |
| `@loaders.gl/*` | 3.x / 4.3.2 | **4.3.4**   |
| `math.gl`       | —           | **^4.1.0**  |
| `typescript`    | 4.7.2       | **5.6.3**   |
| Node.js         | >=18.18.2   | **>=20.19.3** |

### New dependencies

| Package                              | Version | Notes                                         |
| ------------------------------------ | ------- | --------------------------------------------- |
| `@vis.gl/react-maplibre`             | 8.1.1   | MapLibre bindings for react-map-gl 8          |
| `maplibregl-mapbox-request-transformer` | ^0.0.2 | Mapbox-style URL transform for MapLibre      |
| `@deck.gl-community/editable-layers` | 9.2.8   | Replaces `@nebula.gl/layers` for editor layer |
| `@deck.gl-community/layers`          | 9.2.8   | Community layers package                      |
| `@deck.gl/widgets`                   | 9.2.11  | New deck.gl 9 module                          |
| `@luma.gl/effects`                   | 9.2.6   | New luma.gl 9 module                          |
| `@luma.gl/webgpu`                    | 9.2.6   | Dev dependency for test environment           |

### Removed dependencies

| Package                             | Notes                                            |
| ----------------------------------- | ------------------------------------------------ |
| `hubble.gl/core`, `hubble.gl/react` | Removed from kepler.gl                           |
| `@nebula.gl/layers`                 | Replaced by `@deck.gl-community/editable-layers` |

### Yarn resolutions

All `@deck.gl/*`, `@loaders.gl/*`, and `@luma.gl/*` packages are pinned via resolutions. If your project has its own resolutions for these packages, make sure they are consistent with the versions above.

---

## Breaking Changes — React 19

kepler.gl 3.3 requires **React 19**. React 18 is no longer supported.

```sh
npm install react@^19.0.0 react-dom@^19.0.0 react-redux@^9.1.0
```

### Removed legacy lifecycle methods

All usage of deprecated lifecycle methods (`componentWillReceiveProps`, `componentWillMount`) has been removed. If you have custom components extending kepler.gl internals that rely on these methods, migrate them to `componentDidUpdate`, `getDerivedStateFromProps`, or hooks.

### `ref` handling

React 19 passes `ref` as a regular prop. If you have custom wrapper components using `React.forwardRef` around kepler.gl components, these will still work but `forwardRef` is no longer required for new components.

### Strict Mode

React 19 enforces stricter Strict Mode behavior. If your application uses `<React.StrictMode>`, you may notice double-invocation of effects during development. This does not affect production builds.

### `react-redux` v9

The upgrade to `react-redux@^9.1.0` drops the legacy context API. Ensure you are not relying on the removed `store` prop passed directly to connected components — use `<Provider store={store}>` at the root instead.

### `react-intl` v7

`react-intl` is upgraded to v7. If your app provides custom format configurations or uses `intlShape`, consult the [react-intl 7.x migration guide](https://formatjs.github.io/docs/react-intl/upgrade-guide-7x/).

### Upgrading custom components

If you use kepler.gl's dependency injection to replace built-in components:

1. Replace any class components with function components using hooks
2. Remove `defaultProps` declarations — use default parameter values instead
3. Update any `propTypes` usage (still functional but no longer shipped with kepler.gl)

---

## Breaking Changes — Map Libraries

### react-map-gl 8 and maplibre-gl 4

`react-map-gl` is upgraded from `^7.1.6` to `^8.1.1`, and `maplibre-gl` from `^3.6.2` to `^4.0.0`. A new dependency `@vis.gl/react-maplibre` (`8.1.1`) has been added.

```sh
npm install react-map-gl@^8.1.1 maplibre-gl@^4.0.0 @vis.gl/react-maplibre@8.1.1
```

If your application imports from `react-map-gl` directly (e.g., for custom map overlays), review the [react-map-gl 8.x upgrade guide](https://visgl.github.io/react-map-gl/docs/upgrade-guide) for API changes.

### maplibre-gl 4

maplibre-gl v4 includes breaking changes to the style specification and internal rendering pipeline. If you use `maplibregl` directly or supply custom map styles, consult the [maplibre-gl v4 changelog](https://github.com/maplibre/maplibre-gl-js/blob/main/CHANGELOG.md).

---

## Breaking Changes — Node.js

### Minimum Node.js version raised to 20

The minimum required Node.js version is now **20.19.3** (previously 18.18.2). Update your CI and development environments accordingly:

```sh
nvm install 20
nvm use 20
```

---

## Breaking Changes — Layers

### HeatmapLayer rewritten from Mapbox GL to deck.gl

`HeatmapLayer` no longer extends `MapboxGLLayer`. It now extends the base `Layer` class and renders using a deck.gl-based implementation.

**Impact:**
- If you extended `HeatmapLayer` or relied on its Mapbox GL internals, your subclass will break.
- The layer config type changed from `MapboxLayerGLConfig` to `LayerBaseConfig`.
- New visual config properties: `intensity`, `threshold`, `aggregation`.
- A new column mode `COLUMN_MODE_GEOJSON` is supported.

If you have custom code that checks `layer instanceof MapboxGLLayer` for heatmap layers, update it to check `layer instanceof Layer` or use `layer.type === 'heatmap'`.

### `layerOrder` type changed

The `layerOrder` property in `visState` changed from a flat `string[]` to `LayerOrderEntry[]`, where:

```typescript
type LayerOrderGroup = {
  id: string;
  label: string;
  isVisible: boolean;
  layerOrder: LayerOrder;
  isIncludedInLegend: boolean;
};
type LayerOrderEntry = string | LayerOrderGroup;
type LayerOrder = LayerOrderEntry[];
```

If your application reads or manipulates `state.keplerGl.*.visState.layerOrder` directly (e.g., for custom layer reordering), update your code to handle mixed arrays of layer IDs and group objects. Use the helper `getFlatLayerOrder(layerOrder)` from `@kepler.gl/utils` to get a flat list of layer IDs.

---

## Breaking Changes — Removed Exports

### `LayerSelectorPanelFactory` removed

`LayerSelectorPanelFactory` is no longer exported from `@kepler.gl/components`. If you were using dependency injection to replace this factory, the functionality has been reorganized — use the layer list panel and layer group components instead.

### `setLayerBlending` removed

The function `setLayerBlending` (previously exported from `@kepler.gl/utils`) is removed. Use `getLayerBlendingParameters` instead, which returns a `parameters` object for deck.gl 9.

---

## Breaking Changes — Behavior

### `preserveDrawingBuffer` disabled by default

The base map's WebGL context previously set `preserveDrawingBuffer: true` unconditionally. It is now **`false` by default** and only enabled during image/video export (`isExport: true`).

**Impact:** If your application calls `canvas.toDataURL()` or `canvas.toBlob()` on kepler.gl's map canvas outside of the built-in export flow, the canvas will now return blank data. To restore the old behavior, pass `preserveDrawingBuffer: true` via `bottomMapContainerProps` in your `MapContainer` override.

### `GEOCODER_ICON_SIZE` constant changed

`GEOCODER_ICON_SIZE` changed from `80` to `160` to compensate for anchor normalization in the new rendering stack. If you import this constant for custom geocoder styling, the rendered pin size should remain the same visually — but if you used the raw value for calculations, update accordingly.

---

## Breaking Changes for Library Consumers

### 1. WebGL context callback renamed

The `DeckGL` component callback changed from `onWebGLInitialized` to `onDeviceInitialized`. The callback now receives a luma.gl `Device` instead of a raw `WebGLRenderingContext`.

If you override `MapContainerFactory` and rely on the initialization callback:

```diff
- onWebGLInitialized={gl => this._onDeckInitialized(gl)}
+ onDeviceInitialized={device => this._onDeckInitialized(device)}
```

### 2. Layer blending is now declarative

In deck.gl 8, kepler.gl called `setParameters(gl, {...})` with GL constants before each render to set blending mode. In deck.gl 9, blending is set via a `parameters` prop on `DeckGL` using WebGPU-style string constants.

**Old (removed):**

```js
import {setParameters} from '@luma.gl/core';
setParameters(gl, {
  blendFunc: [GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA],
  blendEquation: GL.FUNC_ADD
});
```

**New:**

```js
import {getLayerBlendingParameters} from '@kepler.gl/utils';
<DeckGL parameters={getLayerBlendingParameters(layerBlending)} />;
```

If your application calls `setParameters` for blending, migrate to the `parameters` prop instead.

### 3. GPU parameter constants

A new module `@kepler.gl/constants` exports WebGPU-style string constants that replace the old GL enum values throughout the codebase:

- `BLEND_FACTOR` — `'zero'`, `'one'`, `'src-alpha'`, etc.
- `BLEND_OPERATION` — `'add'`, `'subtract'`, etc.
- `FILTER_MODE` — `'nearest'`, `'linear'`
- `ADDRESS_MODE` — `'clamp-to-edge'`, `'repeat'`, `'mirror-repeat'`
- `TEXTURE_FORMAT` — `'r8uint'`, `'rgba8unorm'`, etc.
- `TOPOLOGY` — `'triangle-list'`, `'triangle-strip'`, etc.

If you referenced GL constants for kepler.gl layer configuration, switch to these string constants.

### 4. `setLayerBlending` removed

The function `setLayerBlending` (previously exported from `@kepler.gl/utils`) is removed. Use `getLayerBlendingParameters` instead, which returns a `parameters` object for deck.gl 9.

### 5. Aggregation layers use deck.gl 9 native CPU aggregation

`GridLayer` and `HexagonLayer` now use deck.gl 9's built-in CPU aggregation (`gpuAggregation: false`) instead of kepler.gl's custom `CPUAggregator`. This means:

- `onSetColorDomain` / `onSetElevationDomain` callbacks now receive `[min, max]` number arrays instead of `{domain, aggregatedBins}` objects.
- Per-bin filtering is applied at the accessor level (`getColorValue`, `getElevationValue`) rather than via a `_filterData` prop.
- `ClusterLayer` still uses the internal `CPUAggregator`.

If you listen to domain callbacks on aggregation layers, update your handler to accept the new format:

```diff
- onSetColorDomain={({domain, aggregatedBins}) => { ... }}
+ onSetColorDomain={domain => { /* domain is [min, max] */ }}
```

### 6. Shader changes — GLSL 300 es and UBOs

All custom shaders now target **GLSL 300 es**:

- `attribute` → `in`, `varying` → `in`/`out`
- `texture2D()` → `texture()`
- `gl_FragColor` → explicit `out vec4 fragColor`
- Uniforms are declared inside **Uniform Buffer Objects** (UBOs) instead of standalone `uniform` declarations. For example, `uniform float opacity` becomes a field inside a `uniform layerUniforms { float opacity; } layer;` block, accessed as `layer.opacity`.

If you have custom layers that inject into kepler.gl's shaders (via `editShader` or shader hooks), review the new GLSL 300 es syntax.

### 7. Model API changes in custom layers

If you extend any kepler.gl layer and interact with `Model` objects:

```diff
- model.setUniforms({elevationScale: 1.0});
+ model.shaderInputs.setProps({elevationScale: {elevationScale: 1.0}});
```

```diff
- model.draw();
+ model.draw(this.context.renderPass);
```

The `_getModel(gl)` pattern is replaced — models are now created from `super._getModel()` and modified via `model.setGeometry()`.

### 8. `PickInfo` type change

A custom `PickInfo<DataT>` type is now defined in `@kepler.gl/types`. This type is a relaxed version of deck.gl 9's `PickingInfo` to work around stricter generic inference in the `DeckGL` component's callback types. If you import `PickingInfo` from `@deck.gl/core`, be aware that kepler.gl's callbacks use `PickInfo` instead.

### 9. `MapViewState` type is locally defined

`MapViewState` is no longer imported from `@deck.gl/core/typed`. It is defined locally in `@kepler.gl/types` (from `reducers.d.ts`). If you were importing it from deck.gl, import from `@kepler.gl/types` instead.

### 10. Editor layers migrated to `@deck.gl-community`

The editor layer (`EditableGeoJsonLayer`) is now imported from `@deck.gl-community/editable-layers` instead of `@nebula.gl/layers`. If you extend or replace the editor layer factory, update your imports.

### 11. Lighting effect API changes

`CustomDeckLightingEffect` (kepler.gl's lighting/shadow effect) has been rewritten for deck.gl 9:

- `preRender` → `setup(context)` / `cleanup(context)` lifecycle
- `getModuleParameters` → `getShaderModuleProps`
- Shadow module uses UBO-based uniforms with `uniformTypes` declarations
- `Texture2D` constructor → `device.createTexture()`
- `addDefaultShaderModule` / `removeDefaultShaderModule` API on `deck` instance

If you extend `CustomDeckLightingEffect`, review the new lifecycle methods.

### 12. `MapView` with `legacyMeterSizes`

kepler.gl now creates `MapView` with `{legacyMeterSizes: true}` to preserve backward-compatible meter-based sizing behavior from deck.gl 8.

---

## Runtime Patches

kepler.gl 3.3 applies two patches to work around deck.gl 9 / luma.gl 9 issues. These are applied automatically and require no action, but are documented for awareness:

1. **`patchDeckRendererForPostProcessing()`** — Patches `DeckRenderer._resizeRenderBuffers` to add depth-stencil attachments to post-processing framebuffers. In deck.gl 9, FBOs are created without depth buffers by default, which breaks depth testing when post-processing effects are active.

2. **`patchPipelineValidation()`** — Patches `WEBGLRenderPipeline._getLinkStatus` to suppress false-positive "mixed sampler type" validation errors in luma.gl 9. This patch is applied lazily only when a raster tile layer is instantiated.

---

## New Features

### 3D Tile Layer (experimental)

A new **3D Tile Layer** enables rendering of photogrammetry meshes, buildings, terrain and other 3D content from OGC 3D Tiles and I3S tilesets. Supported providers:

- **OGC 3D Tiles 1.0 / 1.1** — any standard `tileset.json` endpoint.
- **Google Photorealistic 3D Tiles** — requires a Google Maps API key.
- **Cesium Ion** — requires a Cesium Ion access token.
- **ArcGIS I3S** — scene service endpoints.

Add a 3D tileset via the **Add Data → Tilesets** modal by selecting the "3D Tile" type. The layer supports opacity, point size configuration, zoom-to-layer, and the Light and Shadow effect. See the [3D Tile Layer user guide](./user-guides/c-types-of-layers/p-3d-tile-layer.md) for details.

### Flow Layer

A new **Flow Layer** renders origin-destination flows as animated arcs with directional particles.

### Bitmap Overlay Layer

A new **Bitmap Overlay Layer** renders georeferenced raster images (PNG, JPEG) on the map.

### Swipe Compare Mode

A new map split mode (`MapSplitMode.SWIPE_COMPARE`) enables side-by-side comparison of layers using a draggable divider. Use the `setMapSplitMode` action to switch between `SINGLE_MAP`, `DUAL_MAP`, and `SWIPE_COMPARE`.

### Annotations

A new annotation system allows adding text labels, markers, and shapes directly on the map. New actions: `addAnnotation`, `removeAnnotation`, `updateAnnotation`, `duplicateAnnotation`, `setSelectedAnnotation`.

### Layer Groups

Layers can now be organized into named groups with shared visibility and legend controls. New actions: `addLayerGroup`, `removeLayerGroup`, `updateLayerGroup`, `addLayerToLayerGroup`, `removeLayerFromLayerGroup`.

### Other New Features

- **Zoom and compass controls** — on-map navigation buttons
- **Tooltip toggle** — ability to disable tooltips per-map
- **Higher pitch option** — configurable maximum pitch beyond the default 60°
- **GeoJSON mode for aggregation layers** — aggregate by polygon geometry
- **Labels for GeoJSON layer** — text label support on polygon/line features
- **Rectangle drag-to-filter** — streamlined rectangular area filter
- **Layer visibility toggle in map legend**
- **Locale persistence** — locale is included in exported maps and restored on load
- **Video export with effects** — post-processing effects are captured in video export
- **Non-linear piecewise focus range** for VisConfig sliders
- **CSV/TSV auto-delimiter detection** in data processors

### Fog post-processing effects

Two new post-processing effects are available:

- **Distance Fog** (`distanceFog`) — depth-buffer-based fog that increases with camera distance. Parameters: `density`, `fogStart`, `fogRange`, `fogColor`.
- **Surface Fog** (`surfaceFog`) — elevation-based ground fog applied below a configurable height in meters. Parameters: `density`, `height`, `thickness`, `fogColor`.

Both effects are registered in `POSTPROCESSING_EFFECTS` and can be created via `createEffect()`. Only one fog effect can be active at a time (enforced by the effect manager UI). Fog effects are ordered early in the post-processing chain to read the depth buffer before subsequent effects clear it.

---

## Known Issues

### Performance with tiled layers on older hardware

The deck.gl 9 upgrade introduces additional per-frame overhead in the layer management and GPU state pipelines compared to deck.gl 8. This may cause noticeable slowness when interacting with tiled layers (`Tile3DLayer`, raster tile layers) — especially when changing visual properties like opacity or when moving the camera over a scene with many visible tiles. The issue is more pronounced on older or lower-end GPUs and is currently under investigation.
