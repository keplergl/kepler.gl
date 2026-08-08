// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {HeatmapLayer as DeckGLHeatmapLayer} from '@deck.gl/aggregation-layers';
import {Layer, WebMercatorViewport, project32, COORDINATE_SYSTEM} from '@deck.gl/core';
import {Model} from '@luma.gl/engine';
import {editShader, insertBefore} from '@kepler.gl/deckgl-layers';

/**
 * Custom deck.gl HeatmapLayer subclass that patches GPU shaders
 * to match the visual appearance of the previous Mapbox GL heatmap layer.
 *
 * These patches ensure that existing saved maps render identically after
 * the migration from Mapbox heatmap to deck.gl heatmap.
 *
 * Two shader patches are applied:
 *
 * 1. Weights fragment shader (kernel):
 *    - Divides Gaussian kernel output by 8.5 and clips small values
 *      to remove visible hard edges at the radius boundary.
 *    - Changes the distance input from `2. * dist` to `dist` to
 *      correctly map the kernel falloff to the configured radius.
 *
 * 2. Max-weights fragment shader:
 *    - Forces the red channel to 1.0, because Mapbox assumes
 *      a max weight of 1.0 when sampling the color ramp.
 *
 * Additionally, the layer removes the `layerUniforms` (layer) shader module
 * from the weights and max-weights transform shaders. This module injects a
 * uniform block containing `uniform float opacity;` which violates the GLSL
 * ES 3.0 spec (storage qualifiers are not allowed inside uniform blocks) and
 * causes shader compilation failures on strict mobile GPU drivers (e.g. Mali,
 * Adreno on Samsung Galaxy devices). The opacity uniform is not used in these
 * transform passes so removing it is safe.
 *
 * The patching is applied in _createWeightsTransform rather than only in
 * getShaders, because the legacy AggregationLayer.updateState() calls
 * getShaders({}) (with no fs) and then passes the raw shader imports to
 * updateShaders → _createWeightsTransform, bypassing the getShaders patching.
 *
 * # Globe support
 *
 * The stock deck.gl HeatmapLayer only works in a flat WebMercator viewport.
 * It computes the density texture bounds by unprojecting the four screen
 * corners of the *current* viewport, and it renders the final result as a flat
 * 4-vertex quad. Neither of these works on a globe: the screen corners don't
 * unproject to a meaningful lng/lat box, and a flat quad does not conform to
 * the sphere.
 *
 * To support globe mode this layer, when `globeMode` + `densityBounds` are
 * provided:
 *
 * 1. Renders the density texture using a *fixed* WebMercator viewport built
 *    from the layer's data bounds (`densityBounds`), instead of the live globe
 *    viewport. This makes the offscreen density render behave exactly like the
 *    2D top-down case, but framed around the data rather than the screen.
 *
 * 2. Renders the final texture with a subdivided (tessellated) mesh spanning
 *    the same data bounds, so that each vertex is projected onto the globe by
 *    deck.gl's `project_position_to_clipspace`. This is the same technique
 *    deck.gl's BitmapLayer uses to bend a flat image around the sphere.
 *
 * # 2D antimeridian / zoom-out fix
 *
 * `densityBounds` is also used in flat 2D (non-globe) mode: `_updateTextureRenderingBounds`
 * frames the final render quad to the data extent, pinned to a single world
 * copy, instead of deck.gl's screen-corner quad. This keeps the heatmap from
 * disappearing or mirroring when zoomed out (multiple world copies) or panned
 * across the antimeridian. See that method for details.
 */
// Pack an array of [x,y,(z)] points into a flat Float32Array (matches deck.gl's
// internal `packVertices`). Local copies so we don't depend on deck.gl's
// internal, non-public heatmap-layer-utils module.
function packVertices2(points: number[][]): Float32Array {
  const out = new Float32Array(points.length * 2);
  let i = 0;
  for (const p of points) {
    out[i++] = p[0] || 0;
    out[i++] = p[1] || 0;
  }
  return out;
}

function packVertices3(points: number[][]): Float32Array {
  const out = new Float32Array(points.length * 3);
  let i = 0;
  for (const p of points) {
    out[i++] = p[0] || 0;
    out[i++] = p[1] || 0;
    out[i++] = p[2] || 0;
  }
  return out;
}

export default class KeplerHeatmapLayer extends DeckGLHeatmapLayer {
  static defaultProps = {
    ...DeckGLHeatmapLayer.defaultProps,
    // kepler.gl extensions to support globe mode
    globeMode: false,
    // [minLng, minLat, maxLng, maxLat] of the data, used to frame the density texture in globe mode
    densityBounds: null
  };

  // Cached fixed density viewport (keyed by bounds) so we don't rebuild it on
  // every update/render. Not stored in layer state to avoid setState-in-render.
  private _densityViewport: WebMercatorViewport | null = null;
  private _densityViewportKey: string | null = null;

  // Cached globe render mesh, so its identity stays stable across frames (only
  // rebuilt when the density bounds or the globe resolution change).
  private _globeMesh: HeatmapMesh | null = null;
  private _globeMeshKey: string | null = null;

  // World bounds [w, s, e, n] the density texture is currently framed to. In
  // globe mode this is normally the data bounds, but when the camera is zoomed
  // in far enough that the visible area sits fully inside the data, we frame the
  // density texture around the *visible* area to improve level-of-detail.
  private _densityBounds: [number, number, number, number] | null = null;
  // Quantized key of `_densityBounds`, so small camera moves don't re-frame.
  private _densityBoundsFrameKey: string | null = null;
  // Cached reference viewport framing the full data bounds (for radius scaling).
  private _referenceViewport: WebMercatorViewport | null = null;
  private _referenceViewportKey: string | null = null;

  _createWeightsTransform(shaders: any) {
    if (shaders.fs?.includes('gaussianKDE')) {
      let fs = editShader(
        shaders.fs,
        'fs',
        'return pow(2.71828, -u*u/0.05555)/(1.77245385*0.166666);',
        `float value = pow(2.71828, -u*u/0.05555)/(1.77245385*0.166666) / 8.5;
          return max(value - 0.00443, 0.0);`
      );
      fs = editShader(fs, 'fs', '2. * dist', 'dist');
      fs = editShader(fs, 'fs', 'DECKGL_FILTER_COLOR(fragColor, geometry);', '');
      shaders = {...shaders, fs};
    }

    if (shaders.modules) {
      shaders = {
        ...shaders,
        modules: shaders.modules.filter((m: any) => (m?.name || m) !== 'layer')
      };
    }

    super._createWeightsTransform(shaders);
  }

  getShaders(shaders: any) {
    const result = super.getShaders(shaders);

    if (result.fs?.includes('outTexture.r / max(1.0, outTexture.a)')) {
      // Max-weights fragment shader: force max value to 1.0
      result.fs = insertBefore(
        result.fs,
        'fs',
        'fragColor.g = outTexture.r / max(1.0, outTexture.a);',
        'fragColor.r = 1.0;\n  '
      );
      if (result.modules) {
        result.modules = result.modules.filter((m: any) => (m?.name || m) !== 'layer');
      }
    }

    return result;
  }

  /**
   * True when the layer should render for a globe: globe mode is enabled and
   * valid data bounds were provided to frame the density texture.
   */
  _isGlobeHeatmap(): boolean {
    const {globeMode, densityBounds} = this.props as any;
    return Boolean(globeMode && densityBounds && this._getDensityViewport());
  }

  /**
   * Decide which world bounds the density texture should be framed to for the
   * current camera.
   *
   * When zoomed out (we can see the whole globe, or the visible area extends
   * past the data), we frame the density texture around the entire data extent
   * so the whole heatmap is covered. When zoomed in far enough that the visible
   * area sits fully inside the data bounds, we frame the density texture around
   * the *visible* area instead — the same fixed-size texture then covers a much
   * smaller region, dramatically improving level-of-detail as the user zooms.
   */
  _computeDensityBounds(globeViewport: any): [number, number, number, number] | null {
    const {densityBounds} = this.props as any;
    if (!densityBounds || densityBounds.length !== 4) {
      return null;
    }
    const [dW, dS, dE, dN] = densityBounds as [number, number, number, number];
    if (![dW, dS, dE, dN].every(Number.isFinite)) {
      return null;
    }
    const dataBounds: [number, number, number, number] = [
      Math.min(dW, dE),
      Math.min(dS, dN),
      Math.max(dW, dE),
      Math.max(dS, dN)
    ];

    const viewBounds = this._getGlobeViewBounds(globeViewport);
    if (viewBounds && this._boundsInside(viewBounds, dataBounds)) {
      // `getBounds()` samples edge-midpoints, so the true visible extent
      // (screen corners) is a bit larger. Pad generously so the heatmap isn't
      // clipped at the corners, and clamp back into the data bounds.
      return this._padBounds(viewBounds, 0.25, dataBounds);
    }

    return dataBounds;
  }

  /**
   * Visible lng/lat bounds of the globe viewport, or null if they can't be
   * determined reliably (e.g. the whole globe is visible / edges miss the
   * sphere / the span is degenerate or wraps around the planet).
   */
  _getGlobeViewBounds(globeViewport: any): [number, number, number, number] | null {
    if (!globeViewport || typeof globeViewport.getBounds !== 'function') {
      return null;
    }
    let bounds: number[];
    try {
      bounds = globeViewport.getBounds();
    } catch (e) {
      return null;
    }
    if (!bounds || bounds.length !== 4 || !bounds.every(Number.isFinite)) {
      return null;
    }
    const [w, s, e, n] = bounds;
    const lngSpan = e - w;
    const latSpan = n - s;
    // Reject degenerate or globe-spanning views: if we see (nearly) the whole
    // planet, framing to the view is pointless and error-prone.
    if (lngSpan <= 0 || latSpan <= 0 || lngSpan >= 350 || latSpan >= 170) {
      return null;
    }
    return [w, s, e, n];
  }

  _boundsInside(
    inner: [number, number, number, number],
    outer: [number, number, number, number]
  ): boolean {
    return (
      inner[0] >= outer[0] && inner[1] >= outer[1] && inner[2] <= outer[2] && inner[3] <= outer[3]
    );
  }

  _padBounds(
    bounds: [number, number, number, number],
    ratio: number,
    clampTo: [number, number, number, number]
  ): [number, number, number, number] {
    const [w, s, e, n] = bounds;
    const padX = (e - w) * ratio;
    const padY = (n - s) * ratio;
    return [
      Math.max(w - padX, clampTo[0]),
      Math.max(s - padY, clampTo[1]),
      Math.min(e + padX, clampTo[2]),
      Math.min(n + padY, clampTo[3])
    ];
  }

  /**
   * Build a plain WebMercator viewport that exactly frames `bounds`
   * ([w, s, e, n]) into a fixed offscreen size. Returns null for invalid bounds.
   */
  _buildMercatorViewport(bounds: [number, number, number, number]): WebMercatorViewport | null {
    const [minLng, minLat, maxLng, maxLat] = bounds;
    if (![minLng, minLat, maxLng, maxLat].every(Number.isFinite)) {
      return null;
    }

    // Clamp latitudes to WebMercator limits so fitBounds stays valid.
    const MAX_LAT = 85.051129;
    const south = Math.max(Math.min(minLat, maxLat), -MAX_LAT);
    const north = Math.min(Math.max(minLat, maxLat), MAX_LAT);
    const west = Math.min(minLng, maxLng);
    const east = Math.max(minLng, maxLng);

    // Use a reasonably large offscreen frame so the density render has enough
    // resolution regardless of the current globe zoom.
    const width = 1024;
    const height = 1024;

    try {
      return new WebMercatorViewport({
        width,
        height,
        longitude: (west + east) / 2,
        latitude: (south + north) / 2,
        zoom: 0
      }).fitBounds(
        [
          [west, south],
          [east, north]
        ],
        {width, height, padding: 0}
      );
    } catch (e) {
      return null;
    }
  }

  /**
   * Build (and cache) the WebMercator viewport that frames `_densityBounds`.
   *
   * This viewport is completely independent of the current globe camera
   * *projection* — it is always a plain WebMercator frame — but the region it
   * covers (`_densityBounds`) follows the camera for level-of-detail (see
   * `_computeDensityBounds`). It drives the offscreen density texture render.
   */
  _getDensityViewport(): WebMercatorViewport | null {
    const bounds = this._densityBounds || (this.props as any).densityBounds;
    if (!bounds || bounds.length !== 4) {
      return null;
    }

    const cacheKey = bounds.join(',');
    if (this._densityViewportKey === cacheKey && this._densityViewport) {
      return this._densityViewport;
    }

    const viewport = this._buildMercatorViewport(bounds as [number, number, number, number]);
    if (!viewport) {
      return null;
    }

    this._densityViewport = viewport;
    this._densityViewportKey = cacheKey;
    return viewport;
  }

  /**
   * Reference WebMercator viewport framing the FULL data bounds. Used to keep
   * the effective heatmap radius constant (in world terms) when the density
   * texture is reframed to a smaller, zoomed-in region: as the frame shrinks the
   * texture resolution increases, so `radiusPixels` must be scaled up by the
   * ratio of viewport scales to avoid a visible jump in blob size / detail.
   */
  _getReferenceViewport(): WebMercatorViewport | null {
    const dataBounds = (this.props as any).densityBounds;
    if (!dataBounds || dataBounds.length !== 4) {
      return null;
    }
    const key = dataBounds.join(',');
    if (this._referenceViewportKey === key && this._referenceViewport) {
      return this._referenceViewport;
    }
    const viewport = this._buildMercatorViewport(dataBounds as [number, number, number, number]);
    this._referenceViewport = viewport;
    this._referenceViewportKey = key;
    return viewport;
  }

  /**
   * Factor to multiply `radiusPixels` by so the heatmap's world-space radius
   * matches what it would be when framed to the full data bounds. Equals the
   * ratio of the current density viewport scale to the reference (data-bounds)
   * viewport scale (scale ∝ 2^zoom, larger for the tighter frame).
   */
  _getRadiusScale(): number {
    const current = this._getDensityViewport();
    const reference = this._getReferenceViewport();
    if (!current || !reference || !reference.scale || !current.scale) {
      return 1;
    }
    const scale = current.scale / reference.scale;
    return Number.isFinite(scale) && scale > 0 ? scale : 1;
  }

  /**
   * Quantize world bounds into a stable string key. Small camera movements
   * should NOT re-frame the density texture (that would thrash the GPU and
   * flicker), so we snap the bounds to a grid proportional to their span.
   */
  _densityBoundsKey(bounds: [number, number, number, number]): string {
    const [w, s, e, n] = bounds;
    const lngSpan = Math.max(1e-6, e - w);
    const latSpan = Math.max(1e-6, n - s);
    // ~12 steps across the current span; re-frame only when the view has moved
    // or zoomed by roughly one twelfth of the frame.
    const stepX = lngSpan / 12;
    const stepY = latSpan / 12;
    const q = (v: number, step: number) => Math.round(v / step) * step;
    return [q(w, stepX), q(s, stepY), q(e, stepX), q(n, stepY)].map(v => v.toFixed(4)).join(',');
  }

  // Tracks whether the previous update ran in globe mode, so we can detect the
  // globe→2D (and 2D→globe) transition and reset stale density framing state.
  private _wasGlobeHeatmap = false;

  updateState(opts: any) {
    const {globeMode, densityBounds} = this.props as any;

    // Detect a transition out of globe mode. In globe mode we frame the density
    // texture to a FIXED WebMercator viewport built from the data bounds and
    // cache the resulting `worldBounds` on the base layer's state. When we
    // switch back to 2D the base layer's `_updateBounds` only recomputes
    // `worldBounds` when the new visible bounds are NOT contained in the cached
    // ones (`boundsContain`). The stale globe frame usually still "contains" the
    // 2D view, so the base layer keeps the globe framing and the heatmap renders
    // in the wrong place (and stays wrong while panning). Clear the cached
    // framing + our globe caches so the 2D path rebuilds from scratch.
    const isGlobeNow = Boolean(globeMode && densityBounds);
    const leftGlobe = this._wasGlobeHeatmap && !isGlobeNow;
    if (leftGlobe) {
      this._resetGlobeState();
    }
    this._wasGlobeHeatmap = isGlobeNow;

    if (!globeMode || !densityBounds) {
      super.updateState(opts);
      // On the globe→2D transition, the base layer's viewport-change detection
      // may not fire (the mode toggle can arrive without a viewport diff in the
      // same cycle). Force a fresh bounds + weightmap computation against the
      // live 2D viewport so the heatmap doesn't keep the stale globe framing.
      if (leftGlobe && this.context?.viewport && !(this.context.viewport as any).resolution) {
        try {
          this._updateBounds(true);
          this._updateTextureRenderingBounds();
          (this.state as any).isWeightMapDirty = true;
          this._updateWeightmap();
        } catch (e) {
          // Defensive: if the live viewport isn't ready this frame, the next
          // regular update will recompute (worldBounds was cleared).
        }
      }
      return;
    }

    // The globe viewport (live camera) is available on the update context. Use
    // it to decide how to frame the density texture (whole data vs. zoomed-in
    // visible area) for level-of-detail. Do this BEFORE swapping the viewport.
    const globeViewport = opts.context?.viewport || this.context.viewport;
    const nextBounds = this._computeDensityBounds(globeViewport);
    if (nextBounds) {
      const nextKey = this._densityBoundsKey(nextBounds);
      if (nextKey !== this._densityBoundsFrameKey) {
        this._densityBounds = nextBounds;
        this._densityBoundsFrameKey = nextKey;
        // Invalidate the cached mercator viewport so it is rebuilt for the new
        // frame, and force the base layer to recompute its density bounds +
        // regenerate the weightmap (it would otherwise keep the old, coarser
        // texture because the new visible bounds are contained in the old ones).
        this._densityViewport = null;
        this._densityViewportKey = null;
        (this.state as any).worldBounds = null;
      }
    }

    if (!this._isGlobeHeatmap()) {
      super.updateState(opts);
      return;
    }

    // In globe mode the density texture is framed by a fixed WebMercator
    // viewport (see `_getDensityViewport`), not the live globe camera. Swap the
    // viewport everywhere the base layer reads it from during update:
    //   - `this.context.viewport` and `opts.context.viewport`: used by the
    //     density math (`_updateBounds`, `_worldToCommonBounds`) and by change
    //     detection (`_getChangeFlags` reads `opts.context.viewport.zoom`).
    //   - `this.internalState.viewport`: TAKES PRIORITY in `Layer.projectPosition`
    //     (`this.internalState.viewport || this.context.viewport`) and is what
    //     deck.gl assigns to `context.viewport` at the start of every update. If
    //     we don't swap it too, the data points are projected with the globe
    //     viewport and land outside the density texture, producing an empty map.
    const densityViewport = this._getDensityViewport();
    if (!densityViewport) {
      super.updateState(opts);
      return;
    }

    const internalState = this.internalState as any;
    const originalContextViewport = this.context.viewport;
    const originalOptsViewport = opts.context?.viewport;
    const originalInternalViewport = internalState?.viewport;
    (this.context as any).viewport = densityViewport;
    if (opts.context) {
      opts.context.viewport = densityViewport;
    }
    if (internalState) {
      internalState.viewport = densityViewport;
    }

    try {
      // Cancel any pending (2D-style) debounced weightmap update; the density
      // is regenerated synchronously here against the fixed viewport.
      const {updateTimer} = this.state as any;
      if (updateTimer) {
        clearTimeout(updateTimer);
        this.setState({updateTimer: null});
      }
      super.updateState(opts);
    } finally {
      (this.context as any).viewport = originalContextViewport;
      if (opts.context) {
        opts.context.viewport = originalOptsViewport;
      }
      if (internalState) {
        internalState.viewport = originalInternalViewport;
      }
    }
  }

  /**
   * Clear all globe-mode density framing state, both our own caches and the
   * base deck.gl HeatmapLayer's cached bounds, so the next (2D) update recomputes
   * `worldBounds` / `normalizedCommonBounds` from the live viewport instead of
   * reusing the fixed globe frame. Also resets the base layer's cached `zoom` so
   * its viewport-change detection fires, and marks the weight map dirty.
   */
  _resetGlobeState() {
    this._densityViewport = null;
    this._densityViewportKey = null;
    this._densityBounds = null;
    this._densityBoundsFrameKey = null;
    this._referenceViewport = null;
    this._referenceViewportKey = null;
    this._globeMesh = null;
    this._globeMeshKey = null;

    const state = this.state as any;
    if (state) {
      // Force base `_updateBounds` to recompute (it skips when the new visible
      // bounds are contained in the stale globe `worldBounds`).
      state.worldBounds = null;
      state.normalizedCommonBounds = null;
      // Force base `_getChangeFlags` to report a viewport/zoom change so it
      // recomputes bounds and regenerates the weight map on this update.
      state.zoom = null;
    }
  }

  /**
   * When the density texture is reframed to a smaller (zoomed-in) region, its
   * resolution increases, so a fixed `radiusPixels` would suddenly cover a
   * smaller world area — a visible jump in detail. Scale `radiusPixels` by the
   * viewport-scale ratio so the effective world-space radius stays constant as
   * the frame changes. Only applies in globe mode; otherwise defers to super.
   */
  _updateWeightmap() {
    if (!this._isGlobeHeatmap()) {
      super._updateWeightmap();
      return;
    }

    const radiusScale = this._getRadiusScale();
    if (radiusScale === 1) {
      super._updateWeightmap();
      return;
    }

    const originalProps = this.props;
    const scaledRadius = Math.max(1, (originalProps as any).radiusPixels * radiusScale);
    // Shallow-override radiusPixels without mutating the (possibly frozen) props.
    this.props = Object.create(originalProps, {
      radiusPixels: {value: scaledRadius, enumerable: true}
    });
    try {
      super._updateWeightmap();
    } finally {
      this.props = originalProps;
    }
  }

  _updateTextureRenderingBounds() {
    // Globe mode uses its own rendering path.
    if (this._isGlobeHeatmap()) {
      super._updateTextureRenderingBounds();
      return;
    }

    const state = this.state as any;
    const {triPositionBuffer, triTexCoordBuffer, normalizedCommonBounds} = state;
    if (!triPositionBuffer || !triTexCoordBuffer || !normalizedCommonBounds) {
      super._updateTextureRenderingBounds();
      return;
    }
    const {viewport} = this.context;
    const {densityBounds} = this.props as any;

    // Fix for 2D (non-globe) mode: the heatmap disappears / jumps when the view
    // is zoomed out (multiple world copies visible) and/or panned across the
    // antimeridian.
    //
    // deck.gl frames the render quad to the four unprojected screen corners.
    // When zoomed out those corners span multiple world copies and, once they
    // step past ±180°, the single 4-vertex quad straddles the antimeridian seam,
    // its GPU-projected vertices collapse, and nothing is drawn. Every other
    // kepler layer avoids this because it renders its geometry once, pinned to a
    // single world copy (deck.gl's `wrapLongitude`).
    //
    // To match that behaviour we stop tying the quad to the screen. Instead we
    // render the quad over the DATA's own extent (`densityBounds`), pinned to a
    // single world copy. The density texture already covers the data, so the
    // heatmap renders at one stable basemap location like every other layer,
    // regardless of zoom or how far the camera has panned.
    if (densityBounds && densityBounds.length === 4) {
      const corners = this._dataQuadCorners(densityBounds);
      if (corners) {
        // Pin the quad to the world copy nearest the camera so it stays on
        // screen as the user pans across world copies — the same visual result
        // as `wrapLongitude` gives point layers. The quad is narrow (data
        // extent) so shifting it by whole world-widths never straddles the seam.
        const centerLng = Number.isFinite((viewport as any)?.longitude)
          ? (viewport as any).longitude
          : 0;
        const quadCenterLng = (corners[0][0] + corners[1][0]) / 2;
        const copyShift = Math.round((centerLng - quadCenterLng) / 360) * 360;

        const positions = corners.map((p: number[]) => [p[0] + copyShift, p[1], p[2]]);
        triPositionBuffer.write(packVertices3(positions));

        // Texture coordinates come from the data's canonical geography (no
        // shift) projected against the framed common-space window.
        const [xMin, yMin, xMax, yMax] = normalizedCommonBounds;
        const textureBounds = corners.map((p: number[]) => {
          const common = viewport.projectPosition(p);
          return [(common[0] - xMin) / (xMax - xMin), (common[1] - yMin) / (yMax - yMin)];
        });
        triTexCoordBuffer.write(packVertices2(textureBounds));
        return;
      }
    }

    // Fallback (no data bounds): stock behaviour.
    super._updateTextureRenderingBounds();
  }

  /**
   * Build the four corners [TL, TR, BL, BR] of a flat quad covering the data
   * extent (`densityBounds`), padded slightly so the heatmap's Gaussian falloff
   * isn't clipped at the edges. Latitude is clamped to the Web Mercator limit.
   * The quad is emitted in the canonical world copy (data longitudes as-is),
   * matching how other layers pin geometry to a single basemap.
   */
  private _dataQuadCorners(
    densityBounds: [number, number, number, number]
  ): number[][] | null {
    const [dW, dS, dE, dN] = densityBounds;
    if (![dW, dS, dE, dN].every(Number.isFinite)) {
      return null;
    }
    let w = Math.min(dW, dE);
    let e = Math.max(dW, dE);
    let s = Math.min(dS, dN);
    let n = Math.max(dS, dN);

    // Pad so the Gaussian falloff isn't clipped at the edges. Use a small
    // fraction of the extent, capped, so wide/global datasets don't get a huge
    // pad that pushes the quad past a full world width (which would make the
    // texture wrap and mirror).
    const lngSpan = e - w;
    const latSpan = n - s;
    const padLng = Math.min(10, Math.max(1, lngSpan * 0.05));
    const padLat = Math.min(10, Math.max(1, latSpan * 0.05));
    w -= padLng;
    e += padLng;
    s = Math.max(-85.051129, s - padLat);
    n = Math.min(85.051129, n + padLat);

    // A heatmap quad can never sensibly be wider than one world (360°). If the
    // (padded) data extent spans the whole globe, clamp it to exactly [-180,
    // 180] so the texture maps 1:1 across the world without wrapping/mirroring
    // or leaking pixels past the antimeridian.
    if (e - w >= 360) {
      w = -180;
      e = 180;
    }

    // [topLeft, topRight, bottomLeft, bottomRight] to match deck's corner order.
    return [
      [w, n, 0],
      [e, n, 0],
      [w, s, 0],
      [e, s, 0]
    ];
  }

  /**
   * In 2D mode we position the flat heatmap quad ourselves (see
   * `_updateTextureRenderingBounds`), pinning it to a single world copy. The GPU
   * render shader must therefore NOT independently wrap longitude: with
   * `wrapLongitude: true` (kepler's default) a full-world quad has its +180°
   * edge wrapped back to -180°, collapsing / mirroring the quad and leaking
   * pixels past the antimeridian. Force it off for our sublayers in 2D; globe
   * mode is unaffected.
   */
  getSubLayerProps(sublayerProps?: any): any {
    const props = super.getSubLayerProps(sublayerProps);
    if (!this._isGlobeHeatmap()) {
      return {...props, wrapLongitude: false};
    }
    return props;
  }

  renderLayers(): any {
    if (!this._isGlobeHeatmap()) {
      return super.renderLayers();
    }

    const {
      weightsTexture,
      maxWeightsTexture,
      colorTexture,
      colorDomain,
      worldBounds,
      normalizedCommonBounds
    } = this.state as any;
    const {updateTriggers, intensity, threshold, aggregation} = this.props as any;

    if (
      !weightsTexture ||
      !colorTexture ||
      !maxWeightsTexture ||
      !worldBounds ||
      !normalizedCommonBounds
    ) {
      return null;
    }

    const densityViewport = this._getDensityViewport();
    if (!densityViewport) {
      return null;
    }

    const AGGREGATION_MODE: Record<string, number> = {SUM: 0, MEAN: 1};

    // Build (and memoize) the tessellated mesh spanning the exact region
    // covered by the density texture (`worldBounds`, already aspect-corrected by
    // the base layer). Texture coordinates are computed the same way deck.gl's
    // flat heatmap does: project each vertex through the density viewport and
    // normalize against `normalizedCommonBounds`. This correctly handles the
    // non-linear Web Mercator latitude mapping of the density texture.
    const resolution = this.context.viewport.resolution;
    const meshKey = `${worldBounds.join(',')}|${resolution}`;
    if (this._globeMeshKey !== meshKey || !this._globeMesh) {
      this._globeMesh = createGlobeHeatmapMesh(
        worldBounds as [number, number, number, number],
        normalizedCommonBounds as [number, number, number, number],
        densityViewport,
        resolution
      );
      this._globeMeshKey = meshKey;
    }
    const mesh = this._globeMesh;

    const GlobeTriangleLayerClass = this.getSubLayerClass(
      'globe-triangle',
      GlobeHeatmapTriangleLayer
    );

    return new GlobeTriangleLayerClass(
      this.getSubLayerProps({
        id: 'globe-triangle-layer',
        updateTriggers
      }),
      {
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        data: {length: 1},
        mesh,
        maxTexture: maxWeightsTexture,
        colorTexture,
        aggregationMode: AGGREGATION_MODE[aggregation] || 0,
        weightsTexture,
        intensity,
        threshold,
        colorDomain
      }
    );
  }
}

KeplerHeatmapLayer.layerName = 'HeatmapLayer';

type HeatmapMesh = {
  positions: Float64Array;
  texCoords: Float32Array;
  indices: Uint32Array;
  vertexCount: number;
};

/**
 * Get texture coordinate of a common-space point inside a common bounds box.
 * Mirrors deck.gl's heatmap `getTextureCoordinates`.
 */
function getTextureCoordinate(
  commonPoint: number[],
  commonBounds: [number, number, number, number]
): [number, number] {
  const [xMin, yMin, xMax, yMax] = commonBounds;
  return [(commonPoint[0] - xMin) / (xMax - xMin), (commonPoint[1] - yMin) / (yMax - yMin)];
}

/**
 * Build a mesh covering the world-space rectangle `[minLng, minLat, maxLng,
 * maxLat]` that the density texture spans. When a `resolution` is provided
 * (globe / non-linear viewports set `viewport.resolution`), the quad is
 * subdivided into a grid so it conforms to the sphere.
 *
 * Each vertex's texture coordinate is computed by projecting its world position
 * through the fixed density viewport and normalizing against the density
 * texture's common bounds — identical to how deck.gl's flat heatmap samples the
 * density texture, so the visual result matches 2D top-down mode.
 */
function createGlobeHeatmapMesh(
  worldBounds: [number, number, number, number],
  normalizedCommonBounds: [number, number, number, number],
  densityViewport: WebMercatorViewport,
  resolution?: number
): HeatmapMesh {
  const [minLng, minLat, maxLng, maxLat] = worldBounds;

  const texCoordAt = (lng: number, lat: number): [number, number] =>
    getTextureCoordinate(densityViewport.projectPosition([lng, lat, 0]), normalizedCommonBounds);

  if (!resolution) {
    // corners: [minLng,minLat], [minLng,maxLat], [maxLng,maxLat], [maxLng,minLat]
    const corners = [
      [minLng, minLat],
      [minLng, maxLat],
      [maxLng, maxLat],
      [maxLng, minLat]
    ];
    const positions = new Float64Array(12);
    const texCoords = new Float32Array(8);
    for (let i = 0; i < corners.length; i++) {
      positions[i * 3 + 0] = corners[i][0];
      positions[i * 3 + 1] = corners[i][1];
      positions[i * 3 + 2] = 0;
      const tc = texCoordAt(corners[i][0], corners[i][1]);
      texCoords[i * 2 + 0] = tc[0];
      texCoords[i * 2 + 1] = tc[1];
    }
    return {
      positions,
      texCoords,
      indices: new Uint32Array([0, 2, 1, 0, 3, 2]),
      vertexCount: 6
    };
  }

  const lngSpan = Math.abs(maxLng - minLng);
  const latSpan = Math.abs(maxLat - minLat);
  const uCount = Math.max(2, Math.ceil(lngSpan / resolution) + 1);
  const vCount = Math.max(2, Math.ceil(latSpan / resolution) + 1);

  const vertexCount = (uCount - 1) * (vCount - 1) * 6;
  const indices = new Uint32Array(vertexCount);
  const texCoords = new Float32Array(uCount * vCount * 2);
  const positions = new Float64Array(uCount * vCount * 3);

  let vertex = 0;
  let index = 0;
  for (let u = 0; u < uCount; u++) {
    const ut = u / (uCount - 1);
    for (let v = 0; v < vCount; v++) {
      const vt = v / (vCount - 1);
      const lng = minLng + ut * (maxLng - minLng);
      const lat = minLat + vt * (maxLat - minLat);
      positions[vertex * 3 + 0] = lng;
      positions[vertex * 3 + 1] = lat;
      positions[vertex * 3 + 2] = 0;
      const tc = texCoordAt(lng, lat);
      texCoords[vertex * 2 + 0] = tc[0];
      texCoords[vertex * 2 + 1] = tc[1];
      if (u > 0 && v > 0) {
        indices[index++] = vertex - vCount;
        indices[index++] = vertex - vCount - 1;
        indices[index++] = vertex - 1;
        indices[index++] = vertex - vCount;
        indices[index++] = vertex - 1;
        indices[index++] = vertex;
      }
      vertex++;
    }
  }

  return {positions, texCoords, indices, vertexCount};
}

const globeTriangleVs = `\
#version 300 es
#define SHADER_NAME globe-heatmap-triangle-layer-vertex-shader
uniform sampler2D maxTexture;
in vec3 positions;
in vec3 positions64Low;
in vec2 texCoords;
out vec2 vTexCoords;
out float vIntensityMin;
out float vIntensityMax;
void main(void) {
  gl_Position = project_position_to_clipspace(positions, positions64Low, vec3(0.0));
  vTexCoords = texCoords;
  vec4 maxTexture = texture(maxTexture, vec2(0.5));
  float maxValue = triangle.aggregationMode < 0.5 ? maxTexture.r : maxTexture.g;
  float minValue = maxValue * triangle.threshold;
  if (triangle.colorDomain[1] > 0.) {
    maxValue = triangle.colorDomain[1];
    minValue = triangle.colorDomain[0];
  }
  vIntensityMax = triangle.intensity / maxValue;
  vIntensityMin = triangle.intensity / minValue;
}
`;

const globeTriangleFs = `\
#version 300 es
#define SHADER_NAME globe-heatmap-triangle-layer-fragment-shader
precision highp float;
uniform sampler2D weightsTexture;
uniform sampler2D colorTexture;
in vec2 vTexCoords;
in float vIntensityMin;
in float vIntensityMax;
out vec4 fragColor;
vec4 getLinearColor(float value) {
  float factor = clamp(value * vIntensityMax, 0., 1.);
  vec4 color = texture(colorTexture, vec2(factor, 0.5));
  color.a *= min(value * vIntensityMin, 1.0);
  return color;
}
void main(void) {
  vec4 weights = texture(weightsTexture, vTexCoords);
  float weight = weights.r;
  if (triangle.aggregationMode > 0.5) {
    weight /= max(1.0, weights.a);
  }
  if (weight <= 0.) {
    discard;
  }
  vec4 linearColor = getLinearColor(weight);
  linearColor.a *= layer.opacity;
  fragColor = linearColor;
}
`;

const triangleUniformBlock = `\
layout(std140) uniform triangleUniforms {
  float aggregationMode;
  vec2 colorDomain;
  float intensity;
  float threshold;
} triangle;
`;

const globeTriangleUniforms = {
  name: 'triangle',
  vs: triangleUniformBlock,
  fs: triangleUniformBlock,
  uniformTypes: {
    aggregationMode: 'f32',
    colorDomain: 'vec2<f32>',
    intensity: 'f32',
    threshold: 'f32'
  }
} as any;

/**
 * Renders the heatmap density texture as an (optionally subdivided) mesh that
 * conforms to the globe. It reuses the same density → color-ramp mapping as
 * deck.gl's flat heatmap TriangleLayer, but with an indexed, tessellated mesh
 * whose LNGLAT positions deck.gl projects onto the sphere.
 *
 * The attribute/mesh wiring mirrors deck.gl's BitmapLayer (indexed geometry via
 * the AttributeManager with `noAlloc` update callbacks).
 */
class GlobeHeatmapTriangleLayer extends Layer<any> {
  static layerName = 'GlobeHeatmapTriangleLayer';

  declare state: {
    model?: Model;
    mesh?: HeatmapMesh;
  } & Layer['state'];

  getShaders() {
    return super.getShaders({
      vs: globeTriangleVs,
      fs: globeTriangleFs,
      modules: [project32, globeTriangleUniforms]
    });
  }

  initializeState() {
    const attributeManager = this.getAttributeManager();
    // Not pickable; drop the picking-color attribute the base layer adds.
    attributeManager?.remove(['instancePickingColors']);
    const noAlloc = true;
    attributeManager?.add({
      indices: {
        size: 1,
        isIndexed: true,
        update: attribute => (attribute.value = this.state.mesh?.indices ?? null),
        noAlloc
      },
      positions: {
        size: 3,
        type: 'float64',
        fp64: this.use64bitPositions(),
        update: attribute => (attribute.value = this.state.mesh?.positions ?? null),
        noAlloc
      },
      texCoords: {
        size: 2,
        update: attribute => (attribute.value = this.state.mesh?.texCoords ?? null),
        noAlloc
      }
    });

    this.setState({
      mesh: this.props.mesh,
      model: this._getModel()
    });
  }

  updateState(params: any): void {
    super.updateState(params);
    const {props, oldProps, changeFlags} = params;
    const attributeManager = this.getAttributeManager();

    if (changeFlags.extensionsChanged) {
      this.state.model?.destroy();
      this.setState({model: this._getModel()});
      attributeManager?.invalidateAll();
    }

    // The parent rebuilds the mesh whenever bounds/viewport change and passes
    // it in via the `mesh` prop.
    if (props.mesh !== oldProps.mesh && props.mesh) {
      const oldMesh = this.state.mesh;
      const mesh = props.mesh as HeatmapMesh;
      this.state.model?.setVertexCount(mesh.vertexCount);
      for (const key of Object.keys(mesh) as (keyof HeatmapMesh)[]) {
        if (oldMesh && oldMesh[key] !== mesh[key]) {
          attributeManager?.invalidate(key as string);
        }
      }
      this.setState({mesh});
    }
  }

  _getModel(): Model {
    return new Model(this.context.device, {
      ...this.getShaders(),
      id: this.props.id,
      bufferLayout: this.getAttributeManager()?.getBufferLayouts(),
      topology: 'triangle-list',
      isInstanced: false
    });
  }

  draw(): void {
    const {model} = this.state;
    const {
      aggregationMode,
      colorDomain,
      intensity,
      threshold,
      colorTexture,
      maxTexture,
      weightsTexture
    } = this.props;
    if (!model || !weightsTexture || !colorTexture || !maxTexture) {
      return;
    }
    model.shaderInputs.setProps({
      triangle: {
        aggregationMode,
        colorDomain,
        intensity,
        threshold,
        // Textures are not declared in `uniformTypes`, so they are treated as
        // bindings and bound to the matching sampler uniforms by name.
        colorTexture,
        maxTexture,
        weightsTexture
      }
    });
    model.draw(this.context.renderPass);
  }
}
