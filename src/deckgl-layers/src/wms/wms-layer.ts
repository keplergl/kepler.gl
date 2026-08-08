// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {lngLatToWorld} from '@math.gl/web-mercator';

import {
  Layer,
  CompositeLayer,
  CompositeLayerProps,
  UpdateParameters,
  DefaultProps,
  Viewport,
  COORDINATE_SYSTEM,
  _deepEqual as deepEqual
} from '@deck.gl/core';
import {BitmapLayer} from '@deck.gl/layers';
import {ImageSource, WMSImageSource} from '@loaders.gl/wms';

import type {ImageSourceMetadata} from '@loaders.gl/loader-utils';
import type {ImageType} from '@loaders.gl/wms';

// TODO: This is a modified copy of WMSLayer from deck.gl. Remove this once we upgrade deck.gl and loaders.gl.

/** All props supported by the TileLayer */
export type WMSLayerProps = CompositeLayerProps & _WMSLayerProps;

/** Props added by the TileLayer */
type _WMSLayerProps = {
  data: string | ImageSource;
  serviceType?: string | 'auto';
  layers?: string[];
  srs?: 'EPSG:4326' | 'EPSG:3857' | 'auto';
  transparent?: boolean;
  onMetadataLoad?: (metadata: ImageSourceMetadata) => void;
  onMetadataLoadError?: (error: Error) => void;
  onImageLoadStart?: (requestId: unknown) => void;
  onImageLoad?: (requestId: unknown) => void;
  onImageLoadError?: (requestId: unknown, error: Error) => void;
};

/**
 * How much the user may zoom in (shrinking the visible span) before a view that
 * is still contained in the last requested extent triggers a fresh, higher
 * resolution request. `2` means the cached image may be stretched up to ~2x
 * before refetching; higher values mean fewer requests but blurrier zoom-ins.
 */
const COVERAGE_REFETCH_ZOOM_FACTOR = 2;

const defaultProps: DefaultProps<WMSLayerProps> = {
  id: 'imagery-layer',
  data: '',
  serviceType: 'auto',
  srs: 'auto',
  layers: {type: 'array', compare: true, value: []},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onMetadataLoad: {type: 'function', value: () => {}},
  // eslint-disable-next-line
  onMetadataLoadError: {type: 'function', value: console.error},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onImageLoadStart: {type: 'function', value: () => {}},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onImageLoad: {type: 'function', value: () => {}},
  onImageLoadError: {
    type: 'function',
    compare: false,
    // eslint-disable-next-line
    value: (requestId: unknown, error: Error) => console.error(error, requestId)
  }
};

export default class WMSLayer extends CompositeLayer<Required<_WMSLayerProps>> {
  static layerName = 'WMSLayer';
  static defaultProps: DefaultProps = defaultProps;

  declare state: {
    imageSource: ImageSource;
    image: ImageType;
    bounds: [number, number, number, number];
    lastRequestParameters: {
      // TODO: remove bbox once deck.gl is upgraded to ^8.10 with loaders.gl ^4
      bbox: [number, number, number, number];
      boundingBox: [[number, number], [number, number]];
      layers: string[];
      srs: 'EPSG:4326' | 'EPSG:3857';
      width: number;
      height: number;
    };
    inFlightRequestParameters?: {
      bbox: [number, number, number, number];
      boundingBox: [[number, number], [number, number]];
      layers: string[];
      srs: 'EPSG:4326' | 'EPSG:3857';
      width: number;
      height: number;
    };
    lastRequestId: number;
    _nextRequestId: number;
    /** TODO: Change any => setTimeout return type. Different between Node and browser... */
    _timeoutId: any;
    loadCounter: number;
    _lastRequestZoom: number;
  };

  /** Returns true if all async resources are loaded */
  get isLoaded(): boolean {
    // Track the explicit loading done by this layer
    return Boolean(this.state) && this.state.loadCounter === 0 && super.isLoaded;
  }

  /** Lets deck.gl know that we want viewport change events */
  override shouldUpdateState(): boolean {
    return true;
  }

  override initializeState(): void {
    // intentionally empty, initialization is done in updateState
    this.state._nextRequestId = 0;
    this.state.lastRequestId = -1;
    this.state.loadCounter = 0;
    this.state._lastRequestZoom = -1;
  }

  override updateState({changeFlags, props, oldProps}: UpdateParameters<this>): void {
    const {viewport} = this.context;

    // Check if data source has changed
    if (changeFlags.dataChanged || props.serviceType !== oldProps.serviceType) {
      this.state.imageSource = this._createImageSource(props);

      this._loadMetadata();
      this.debounce(() => this.loadImage(viewport, 'image source changed'), 0);
    } else if (!deepEqual(props.layers, oldProps.layers, 1)) {
      this.debounce(() => this.loadImage(viewport, 'layers changed'), 0);
    } else if (changeFlags.viewportChanged) {
      // Check if preserveDrawingBuffer is enabled (indicates video recording or image export)
      // Use minimal debounce (10ms) during export for responsive frame capture
      // Request deduplication in loadImage prevents spam from redundant viewport updates
      const gl = this.context.gl;
      const isPreservingBuffer = gl?.getContextAttributes?.()?.preserveDrawingBuffer;

      const debounceDelay = isPreservingBuffer ? 10 : undefined;
      this.debounce(() => this.loadImage(viewport, 'viewport changed'), debounceDelay);
    }
  }

  override renderLayers(): Layer<any> {
    const {bounds, image, lastRequestParameters} = this.state;

    return (
      image &&
      new BitmapLayer({
        ...this.getSubLayerProps({id: 'bitmap'}),
        _imageCoordinateSystem:
          lastRequestParameters.srs === 'EPSG:4326'
            ? COORDINATE_SYSTEM.LNGLAT
            : COORDINATE_SYSTEM.CARTESIAN,
        bounds,
        image,
        pickable: this.props.pickable
      })
    );
  }

  async getFeatureInfoText(x: number, y: number): Promise<string | null> {
    const {lastRequestParameters} = this.state;
    if (lastRequestParameters) {
      // @ts-expect-error Undocumented method
      const featureInfo = await this.state.imageSource.getFeatureInfoText?.({
        ...lastRequestParameters,
        query_layers: lastRequestParameters.layers,
        x,
        y,
        info_format: 'application/vnd.ogc.gml'
      });
      return featureInfo;
    }
    return '';
  }

  _createImageSource(props: WMSLayerProps): ImageSource {
    if (props.data instanceof ImageSource) {
      return props.data;
    }

    if (typeof props.data === 'string') {
      return new WMSImageSource(props.data, {
        loadOptions: props.loadOptions
      });
    }

    throw new Error('invalid image source in props.data');
  }

  /** Run a getMetadata on the image service */
  async _loadMetadata(): Promise<void> {
    const {imageSource} = this.state;
    try {
      this.state.loadCounter++;
      const metadata = await imageSource.getMetadata();

      // If a request takes a long time, it may no longer be expected
      if (this.state.imageSource === imageSource) {
        this.getCurrentLayer()?.props.onMetadataLoad(metadata);
      }
    } catch (error) {
      this.getCurrentLayer()?.props.onMetadataLoadError(error as Error);
    } finally {
      this.state.loadCounter--;
    }
  }

  /** Load an image */
  async loadImage(viewport: Viewport, _reason: string): Promise<void> {
    const {layers, serviceType, transparent} = this.props;

    // TODO - move to ImageSource?
    if (serviceType === 'wms' && layers.length === 0) {
      return;
    }

    // In globe mode deck's GlobeViewport.getBounds() only unprojects 4 edge
    // midpoints and takes their min/max. That misses the screen corners, the
    // curved limb, and (most importantly) the case where a pole is in view when
    // looking from a high latitude — where every meridian and part of the far
    // hemisphere become visible. Compute a fuller visible bounding box instead so
    // the requested WMS image covers everything on screen.
    const bounds = viewport.resolution
      ? getGlobeVisibleBounds(viewport)
      : viewport.getBounds();
    const {width, height} = viewport;
    
    // Edge case: when bounds are perfectly symmetric around 0° (both longitude and latitude),
    // it can cause rendering artifacts with EPSG:4326 on the globe.
    // Add asymmetry to avoid this issue.
    if (viewport.resolution && bounds) {
      const minLat = bounds[1];
      const maxLat = bounds[3];
      // Check if latitude bounds are symmetric around 0° (within 0.1° tolerance)
      if (Math.abs(minLat + maxLat) < 0.1 && Math.abs(minLat) > 1) {
        bounds[3] += 0.1;
      }
    }
    
    let {srs} = this.props;
    if (srs === 'auto') {
      // BitmapLayer only supports LNGLAT or CARTESIAN (Web-Mercator)
      srs = viewport.resolution ? 'EPSG:4326' : 'EPSG:3857';
    }
    const requestParams = {
      width,
      height,
      // TODO: remove bbox once deck.gl is upgraded to ^8.10 with loaders.gl ^4
      bbox: bounds,
      boundingBox: [
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]]
      ] as [[number, number], [number, number]],
      layers,
      srs,
      transparent
    };
    if (srs === 'EPSG:3857') {
      const [minX, minY] = WGS84ToPseudoMercator([bounds[0], bounds[1]]);
      const [maxX, maxY] = WGS84ToPseudoMercator([bounds[2], bounds[3]]);
      requestParams.boundingBox = [
        [minX, minY],
        [maxX, maxY]
      ];
      // TODO: remove bbox once deck.gl is upgraded to ^8.10 with loaders.gl ^4
      requestParams.bbox = [minX, minY, maxX, maxY];
    }

    // Skip request if parameters haven't meaningfully changed from an in-flight request
    if (
      this.state.inFlightRequestParameters &&
      this._areRequestParamsEqual(this.state.inFlightRequestParameters, requestParams)
    ) {
      return;
    }

    // Skip request if the new view is already fully covered by the last COMPLETED request
    // at comparable resolution. This is very common while panning (and small
    // zoom-ins) within a larger, recently fetched extent — e.g. on the globe a
    // single request can cover the whole visible hemisphere, so rotating around it
    // shouldn't hit the network again. The existing image is simply repositioned by
    // the BitmapLayer. We still refetch once the user zooms in enough that the
    // cached image would be visibly stretched (see COVERAGE_REFETCH_ZOOM_FACTOR).
    if (
      this.state.lastRequestParameters &&
      this._isViewCoveredByLastRequest(this.state.lastRequestParameters, requestParams)
    ) {
      return;
    }

    // During video export, throttle zoom-in requests to only fire on zoom level crossings.
    // The existing image is stretched by the BitmapLayer until the next level is reached.
    // However, always allow requests if the new view isn't fully covered by the last image.
    const gl = this.context.gl;
    const isExporting = gl?.getContextAttributes?.()?.preserveDrawingBuffer;
    
    if (isExporting && this.state._lastRequestZoom >= 0) {
      const currentZoom = viewport.zoom;
      const lastZoom = this.state._lastRequestZoom;
      const isZoomingIn = currentZoom > lastZoom;
      
      // Check if the new view is fully covered by the last loaded image
      const lastBbox = this.state.lastRequestParameters?.bbox;
      const currentBbox = requestParams.bbox;
      let fullyContained = false;
      
      if (lastBbox && currentBbox) {
        // New bbox must be fully inside the previous bbox
        fullyContained = 
          currentBbox[0] >= lastBbox[0] && 
          currentBbox[1] >= lastBbox[1] && 
          currentBbox[2] <= lastBbox[2] && 
          currentBbox[3] <= lastBbox[3];
      }
      
      // Only throttle if:
      // 1. Zooming in (not zooming out or panning at same zoom)
      // 2. Same zoom floor (haven't crossed an integer zoom level)
      // 3. New view is fully contained in the last loaded image (no uncovered areas)
      if (isZoomingIn && Math.floor(currentZoom) === Math.floor(lastZoom) && fullyContained) {
        return;
      }
    }

    // Mark request as in-flight to prevent duplicate requests
    this.state.inFlightRequestParameters = requestParams;

    const requestId = this.getRequestId();
    try {
      this.state.loadCounter++;
      // Trigger a redraw to update the UI loading indicator
      this.setNeedsRedraw();
      this.props.onImageLoadStart(requestId);

      const image = await this.state.imageSource.getImage(requestParams);

      // If a request takes a long time, later requests may have already loaded.
      if (this.state.lastRequestId < requestId) {
        this.getCurrentLayer()?.props.onImageLoad(requestId);
        // Update lastRequestParameters only after successful load
        // This ensures coverage checks only use successfully loaded images
        this.state.lastRequestParameters = requestParams;
        this.state._lastRequestZoom = viewport.zoom;
        // Not type safe...
        this.setState({
          image,
          bounds,
          lastRequestId: requestId
        });
      }
    } catch (error) {
      this.context.onError?.(error as Error, this);
      this.getCurrentLayer()?.props.onImageLoadError(requestId, error as Error);
    } finally {
      // Clear in-flight marker when request completes (success or error)
      this.state.inFlightRequestParameters = undefined;
      this.state.loadCounter--;
      // Trigger a redraw to update the UI loading indicator
      this.setNeedsRedraw();
    }
  }

  // HELPERS

  /** Global counter for issuing unique request ids */
  private getRequestId(): number {
    return this.state._nextRequestId++;
  }

  /** Runs an action in the future, cancels it if the new action is issued before it executes */
  private debounce(fn: () => void, ms = 500): void {
    clearTimeout(this.state._timeoutId);
    this.state._timeoutId = setTimeout(() => fn(), ms);
  }

  /**
   * Returns true when the `next` view is fully inside the `prev` (last requested)
   * extent AND not meaningfully higher resolution, so the cached image already
   * covers the screen and no new request is needed.
   */
  private _isViewCoveredByLastRequest(prev: any, next: any): boolean {
    // Coverage only makes sense within the same projection / dataset / canvas size.
    if (
      prev.srs !== next.srs ||
      prev.width !== next.width ||
      prev.height !== next.height ||
      prev.transparent !== next.transparent ||
      !deepEqual(prev.layers, next.layers)
    ) {
      return false;
    }

    const p = prev.bbox;
    const n = next.bbox;
    if (!p || !n) {
      return false;
    }

    // Is the new bbox fully contained within the previously requested bbox?
    const contained = n[0] >= p[0] && n[1] >= p[1] && n[2] <= p[2] && n[3] <= p[3];
    
    if (!contained) {
      return false;
    }

    // Ground resolution is proportional to bbox span / pixel count. The guard
    // above already ensured prev and next share the same width/height, so equal
    // pixel counts let us compare spans directly. Only skip while the new view
    // isn't much finer than what we already fetched, otherwise the cached image
    // would look stretched/blurry.
    const prevSpanX = p[2] - p[0];
    const nextSpanX = n[2] - n[0];
    const prevSpanY = p[3] - p[1];
    const nextSpanY = n[3] - n[1];

    return (
      nextSpanX >= prevSpanX / COVERAGE_REFETCH_ZOOM_FACTOR &&
      nextSpanY >= prevSpanY / COVERAGE_REFETCH_ZOOM_FACTOR
    );
  }

  /** Compare request parameters to determine if a new request is needed */
  private _areRequestParamsEqual(prev: any, next: any): boolean {
    // Compare dimensions
    if (prev.width !== next.width || prev.height !== next.height) {
      return false;
    }

    // Compare SRS
    if (prev.srs !== next.srs) {
      return false;
    }

    // Compare layers
    if (!deepEqual(prev.layers, next.layers)) {
      return false;
    }

    // Compare transparent
    if (prev.transparent !== next.transparent) {
      return false;
    }

    // Compare bounds with tolerance for floating point precision
    const tolerance = 1e-10;
    const prevBbox = prev.bbox;
    const nextBbox = next.bbox;

    if (prevBbox && nextBbox) {
      for (let i = 0; i < 4; i++) {
        if (Math.abs(prevBbox[i] - nextBbox[i]) > tolerance) {
          return false;
        }
      }
    }

    return true;
  }
}

/**
 * Compute the [minLng, minLat, maxLng, maxLat] bounding box of the part of the
 * globe that is actually visible on screen.
 *
 * Unlike `GlobeViewport.getBounds()` (4 edge midpoints), this samples a grid of
 * screen pixels, unprojects each onto the sphere (deck.gl clamps rays that miss
 * the globe to the silhouette/limb, which is exactly the boundary we want), and
 * takes the extent. It additionally detects when a pole is in view: at a pole all
 * meridians converge, so we widen the box to the full longitude range and extend
 * the latitude up to the pole, which is what makes viewing from near a pole
 * (seeing across to the far hemisphere) work.
 */
export function getGlobeVisibleBounds(viewport: Viewport): [number, number, number, number] {
  const {width, height} = viewport;
  const centerLng = (viewport as any).longitude ?? 0;

  const SAMPLES = 8; // 8x8 cells => 9x9 = 81 sample points
  const lats: number[] = [];
  // Longitudes tracked as signed offsets from the center longitude, unwrapped to
  // (-180, 180], so an antimeridian-crossing view stays a contiguous range.
  const lngOffsets: number[] = [];

  for (let i = 0; i <= SAMPLES; i++) {
    for (let j = 0; j <= SAMPLES; j++) {
      const px = (i / SAMPLES) * width;
      const py = (j / SAMPLES) * height;
      const coord = viewport.unproject([px, py]);
      const lng = coord[0];
      const lat = coord[1];
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
        continue;
      }
      lats.push(lat);
      // Wrap the offset into (-180, 180].
      const offset = ((lng - centerLng + 540) % 360) - 180;
      lngOffsets.push(offset);
    }
  }

  // Extremely degenerate viewport: fall back to deck's default.
  if (lats.length === 0) {
    return viewport.getBounds();
  }

  let minLat = Math.min(...lats);
  let maxLat = Math.max(...lats);

  const northPoleVisible = isGlobeSurfacePointVisible(viewport, 90);
  const southPoleVisible = isGlobeSurfacePointVisible(viewport, -90);

  let minLng: number;
  let maxLng: number;

  if (northPoleVisible || southPoleVisible) {
    // A pole is on screen: every meridian is visible, so cover all longitudes and
    // extend latitude up to the visible pole.
    minLng = -180;
    maxLng = 180;
    if (northPoleVisible) {
      maxLat = 90;
    }
    if (southPoleVisible) {
      minLat = -90;
    }
  } else {
    minLng = centerLng + Math.min(...lngOffsets);
    maxLng = centerLng + Math.max(...lngOffsets);
  }

  // Pad slightly so the discrete sampling doesn't clip the true limb.
  const latPad = Math.min(5, (maxLat - minLat) * 0.05 + 0.5);
  minLat = Math.max(-90, minLat - latPad);
  maxLat = Math.min(90, maxLat + latPad);

  if (maxLng - minLng < 360) {
    const lngPad = Math.min(5, (maxLng - minLng) * 0.05 + 0.5);
    minLng -= lngPad;
    maxLng += lngPad;
  }

  // A single EPSG:4326 rectangle can't cross the antimeridian, so if the visible
  // span wraps past ±180 (or covers the whole world) request the full longitude
  // range. This over-covers only near the dateline, which is an acceptable
  // trade-off for a valid, gap-free request.
  if (maxLng - minLng >= 360 || minLng < -180 || maxLng > 180) {
    minLng = -180;
    maxLng = 180;
  }

  return [minLng, minLat, maxLng, maxLat];
}

/**
 * Whether a point on the globe surface at the given latitude (longitude is
 * irrelevant at the poles) is both front-facing (not occluded by the globe) and
 * inside the screen. Uses the sphere-horizon test in deck.gl common space:
 * a surface point is front-facing when the angle between its outward normal and
 * the camera direction is within the horizon half-angle, i.e.
 *   dot(normalize(pointCommon), normalize(cameraPosition)) >= radius / cameraDist
 */
function isGlobeSurfacePointVisible(viewport: Viewport, lat: number): boolean {
  const {width, height} = viewport;
  const point = viewport.projectPosition([0, lat, 0]);
  const camera = viewport.cameraPosition;

  const rPoint = Math.hypot(point[0], point[1], point[2]);
  const rCam = Math.hypot(camera[0], camera[1], camera[2]);
  if (rPoint === 0 || rCam === 0 || rCam <= rPoint) {
    return false;
  }

  const cosSurface =
    (point[0] * camera[0] + point[1] * camera[1] + point[2] * camera[2]) / (rPoint * rCam);
  const cosHorizon = rPoint / rCam;
  if (cosSurface < cosHorizon) {
    return false;
  }

  const screen = viewport.project([0, lat, 0]);
  return screen[0] >= 0 && screen[0] <= width && screen[1] >= 0 && screen[1] <= height;
}

// https://epsg.io/3857
// +proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs
const HALF_EARTH_CIRCUMFERENCE = 6378137 * Math.PI;

/** Projects EPSG:4326 to EPSG:3857
 * This is a lightweight replacement of proj4. Use tests to ensure conformance.
 */
export function WGS84ToPseudoMercator(coord: [number, number]): [number, number] {
  const mercator = lngLatToWorld(coord);
  mercator[0] = (mercator[0] / 256 - 1) * HALF_EARTH_CIRCUMFERENCE;
  mercator[1] = (mercator[1] / 256 - 1) * HALF_EARTH_CIRCUMFERENCE;
  return mercator;
}
