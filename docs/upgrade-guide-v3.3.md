# Upgrade Guide — kepler.gl 3.3

kepler.gl 3.3 upgrades the rendering stack from **deck.gl 8 / luma.gl 8** to **deck.gl 9 / luma.gl 9**. This is a major dependency upgrade that changes how WebGL resources, shaders, and rendering parameters are handled under the hood. Most kepler.gl users will not need to change application code, but library consumers who extend layers, interact with the WebGL context directly, or depend on internal types should review this guide.

## Dependency Changes

| Package group   | Old version | New version |
| --------------- | ----------- | ----------- |
| `@deck.gl/*`    | 8.9.x       | **9.2.11**  |
| `@luma.gl/*`    | 8.x         | **9.2.6**   |
| `@loaders.gl/*` | 3.x / 4.3.2 | **4.3.4**   |
| `math.gl`       | —           | **^4.1.0**  |
| `typescript`    | 4.7.2       | **5.6.3**   |

### New dependencies

| Package                              | Version | Notes                                         |
| ------------------------------------ | ------- | --------------------------------------------- |
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

### Fog post-processing effects

Two new post-processing effects are available:

- **Distance Fog** (`distanceFog`) — depth-buffer-based fog that increases with camera distance. Parameters: `density`, `fogStart`, `fogRange`, `fogColor`.
- **Surface Fog** (`surfaceFog`) — elevation-based ground fog applied below a configurable height in meters. Parameters: `density`, `height`, `thickness`, `fogColor`.

Both effects are registered in `POSTPROCESSING_EFFECTS` and can be created via `createEffect()`. Only one fog effect can be active at a time (enforced by the effect manager UI). Fog effects are ordered early in the post-processing chain to read the depth buffer before subsequent effects clear it.

---

## Known Issues

### Performance with tiled layers on older hardware

The deck.gl 9 upgrade introduces additional per-frame overhead in the layer management and GPU state pipelines compared to deck.gl 8. This may cause noticeable slowness when interacting with tiled layers (`Tile3DLayer`, raster tile layers) — especially when changing visual properties like opacity or when moving the camera over a scene with many visible tiles. The issue is more pronounced on older or lower-end GPUs and is currently under investigation.
