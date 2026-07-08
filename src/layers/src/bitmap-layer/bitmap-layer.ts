// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {BitmapLayer as DeckBitmapLayer, PathLayer, ScatterplotLayer} from '@deck.gl/layers';
import {
  EditableGeoJsonLayer,
  ModifyMode,
  TranslateMode,
  CompositeMode,
  GeoJsonEditMode
} from '@deck.gl-community/editable-layers';

import Layer from '../base-layer';
import BitmapLayerIcon from './bitmap-layer-icon';
import {FindDefaultLayerPropsReturnValue} from '../layer-utils';
import {
  LAYER_VIS_CONFIGS,
  LAYER_TYPES,
  DatasetType,
  BitmapDatasetMetadata,
  BitmapBounds
} from '@kepler.gl/constants';
import {KeplerTable as KeplerDataset, Datasets as KeplerDatasets} from '@kepler.gl/table';
import {VisConfigNumber, VisConfigBoolean} from '@kepler.gl/types';

const EDIT_MODE = new CompositeMode([
  new TranslateMode() as unknown as GeoJsonEditMode,
  new ModifyMode() as unknown as GeoJsonEditMode
]);

export type BitmapLayerVisConfigSettings = {
  opacity: VisConfigNumber;
  showBounds: VisConfigBoolean;
  editBounds: VisConfigBoolean;
  alignMode: VisConfigBoolean;
  boundsWest: VisConfigNumber;
  boundsSouth: VisConfigNumber;
  boundsEast: VisConfigNumber;
  boundsNorth: VisConfigNumber;
};

export const bitmapVisConfigs = {
  opacity: {
    ...LAYER_VIS_CONFIGS.opacity,
    defaultValue: 1,
    property: 'opacity'
  } as VisConfigNumber,
  showBounds: {
    type: 'boolean',
    defaultValue: true,
    label: 'layerVisConfigs.showBounds',
    group: 'display',
    property: 'showBounds'
  } as VisConfigBoolean,
  editBounds: {
    type: 'boolean',
    defaultValue: false,
    label: 'layerVisConfigs.editBounds',
    group: 'display',
    property: 'editBounds'
  } as VisConfigBoolean,
  alignMode: {
    type: 'boolean',
    defaultValue: false,
    label: 'layerVisConfigs.alignMode',
    group: 'display',
    property: 'alignMode'
  } as VisConfigBoolean,
  boundsWest: {
    type: 'number',
    defaultValue: 0,
    label: 'layerVisConfigs.boundsWest',
    isRanged: false,
    range: [-180, 180],
    step: 0.0001,
    group: 'display',
    property: 'boundsWest'
  } as VisConfigNumber,
  boundsSouth: {
    type: 'number',
    defaultValue: 0,
    label: 'layerVisConfigs.boundsSouth',
    isRanged: false,
    range: [-90, 90],
    step: 0.0001,
    group: 'display',
    property: 'boundsSouth'
  } as VisConfigNumber,
  boundsEast: {
    type: 'number',
    defaultValue: 0,
    label: 'layerVisConfigs.boundsEast',
    isRanged: false,
    range: [-180, 180],
    step: 0.0001,
    group: 'display',
    property: 'boundsEast'
  } as VisConfigNumber,
  boundsNorth: {
    type: 'number',
    defaultValue: 0,
    label: 'layerVisConfigs.boundsNorth',
    isRanged: false,
    range: [-90, 90],
    step: 0.0001,
    group: 'display',
    property: 'boundsNorth'
  } as VisConfigNumber
};

export type AlignControlPoint = {
  uv: [number, number]; // normalized image coordinates (0-1)
  geo: [number, number]; // [lng, lat]
};

export default class BitmapOverlayLayer extends Layer {
  declare visConfigSettings: BitmapLayerVisConfigSettings;
  private _editFeatureCollection: any = null;
  private _prevDataBoundsKey: string = '';
  private _onRedrawNeeded: (() => void) | undefined;
  private _rafId: number | undefined;

  // Alignment mode state
  alignControlPoints: AlignControlPoint[] = [];
  alignWaitingForMap: boolean = false;
  private _pendingUV: [number, number] | null = null;

  constructor(props: {dataId: string; visConfig?: Record<string, any>} & Record<string, any>) {
    super(props);
    this.registerVisConfig(bitmapVisConfigs);
    if (props.visConfig) {
      const {alignMode: _, editBounds: __, ...persistedVisConfig} = props.visConfig;
      super.updateLayerVisConfig(persistedVisConfig);
    }
    this.meta = {};
  }

  validateVisConfig(_dataset: KeplerDataset, visConfig: Record<string, any>): Record<string, any> {
    const {alignMode: _, editBounds: __, ...rest} = visConfig;
    return rest;
  }

  // --- Alignment mode methods ---

  onAlignImageClick(uv: [number, number]): void {
    this._pendingUV = uv;
    this.alignWaitingForMap = true;
  }

  onAlignMapClick(lngLat: [number, number]): void {
    if (!this._pendingUV) return;
    this.alignControlPoints = [
      ...this.alignControlPoints,
      {uv: this._pendingUV, geo: lngLat}
    ];
    this._pendingUV = null;
    this.alignWaitingForMap = false;

    if (this.alignControlPoints.length >= 2) {
      this._computeBoundsFromControlPoints();
    }
  }

  resetAlignControlPoints(): void {
    this.alignControlPoints = [];
    this.alignWaitingForMap = false;
    this._pendingUV = null;
  }

  private _computeBoundsFromControlPoints(): void {
    const pts = this.alignControlPoints;
    if (pts.length < 2) return;

    // Solve affine: lng = a * u + b, lat = c * v + d
    // From 2+ points, use least squares (for 2 points, exact solution)
    const n = pts.length;
    let sumU = 0, sumLng = 0, sumUU = 0, sumULng = 0;
    let sumV = 0, sumLat = 0, sumVV = 0, sumVLat = 0;
    for (const p of pts) {
      const [u, v] = p.uv;
      const [lng, lat] = p.geo;
      sumU += u; sumLng += lng; sumUU += u * u; sumULng += u * lng;
      sumV += v; sumLat += lat; sumVV += v * v; sumVLat += v * lat;
    }

    // lng = a*u + b (solve for a, b)
    const detU = n * sumUU - sumU * sumU;
    if (Math.abs(detU) < 1e-12) return;
    const a = (n * sumULng - sumU * sumLng) / detU;
    const b = (sumLng - a * sumU) / n;

    // lat = c*v + d (solve for c, d)
    const detV = n * sumVV - sumV * sumV;
    if (Math.abs(detV) < 1e-12) return;
    const c = (n * sumVLat - sumV * sumLat) / detV;
    const d = (sumLat - c * sumV) / n;

    // Bounds: image corners are (0,0), (1,0), (1,1), (0,1)
    // UV origin (0,0) = top-left of image, (1,1) = bottom-right
    const west = b;         // u=0
    const east = a + b;     // u=1
    const north = d;        // v=0 (top of image)
    const south = c + d;    // v=1 (bottom of image)

    this.updateLayerVisConfig({
      boundsWest: Math.min(west, east),
      boundsEast: Math.max(west, east),
      boundsSouth: Math.min(south, north),
      boundsNorth: Math.max(south, north)
    });

    this._onRedrawNeeded?.();
  }

  updateLayerVisConfig(newVisConfig: Record<string, any>): this {
    if ('alignMode' in newVisConfig && !newVisConfig.alignMode) {
      this.resetAlignControlPoints();
    }
    // Make alignMode and editBounds mutually exclusive
    if (newVisConfig.alignMode && this.config.visConfig.editBounds) {
      newVisConfig.editBounds = false;
    }
    if (newVisConfig.editBounds && this.config.visConfig.alignMode) {
      newVisConfig.alignMode = false;
      this.resetAlignControlPoints();
    }
    super.updateLayerVisConfig(newVisConfig);
    return this;
  }

  static findDefaultLayerProps(dataset: KeplerDataset): FindDefaultLayerPropsReturnValue {
    if (dataset.type !== DatasetType.BITMAP) {
      return {props: []};
    }

    const metadata = (dataset.metadata || {}) as BitmapDatasetMetadata;
    const visConfig: Record<string, any> = {};

    if (metadata.bounds) {
      const metaBounds = metadata.bounds;
      if (Array.isArray(metaBounds) && typeof metaBounds[0] === 'number') {
        const [w, s, e, n] = metaBounds as [number, number, number, number];
        visConfig.boundsWest = w;
        visConfig.boundsSouth = s;
        visConfig.boundsEast = e;
        visConfig.boundsNorth = n;
      } else if (Array.isArray(metaBounds) && Array.isArray(metaBounds[0])) {
        const corners = metaBounds as [
          [number, number],
          [number, number],
          [number, number],
          [number, number]
        ];
        const lngs = corners.map(c => c[0]);
        const lats = corners.map(c => c[1]);
        visConfig.boundsWest = Math.min(...lngs);
        visConfig.boundsSouth = Math.min(...lats);
        visConfig.boundsEast = Math.max(...lngs);
        visConfig.boundsNorth = Math.max(...lats);
      }
    }

    return {
      props: [
        {
          label: dataset.label || 'Bitmap',
          isVisible: true,
          visConfig
        }
      ]
    };
  }

  get type(): string {
    return LAYER_TYPES.bitmap;
  }

  get name(): string {
    return 'Bitmap';
  }

  get requireData(): boolean {
    return false;
  }

  get requiredLayerColumns(): string[] {
    return [];
  }

  get layerIcon(): typeof BitmapLayerIcon {
    return BitmapLayerIcon;
  }

  get supportedDatasetTypes(): DatasetType[] {
    return [DatasetType.BITMAP];
  }

  get visualChannels() {
    return {};
  }

  shouldRenderLayer(): boolean {
    return Boolean(this.type && this.config.isVisible);
  }

  getHoverData(): any {
    return null;
  }

  formatLayerData(datasets: KeplerDatasets): Record<string, any> {
    const {dataId} = this.config;
    if (!dataId || !datasets[dataId]) {
      return {};
    }

    const dataset = datasets[dataId];
    const metadata = (dataset.metadata || {}) as BitmapDatasetMetadata;
    const {visConfig} = this.config;

    const bounds: BitmapBounds = [
      visConfig.boundsWest,
      visConfig.boundsSouth,
      visConfig.boundsEast,
      visConfig.boundsNorth
    ];

    this.updateMeta({bounds});

    return {
      imageUrl: metadata.imageUrl,
      bounds
    };
  }

  updateLayerMeta(_dataset: KeplerDataset): void {
    // bounds are managed through visConfig, meta.bounds is set in formatLayerData
  }

  renderLayer(opts: any) {
    const {data, layerCallbacks} = opts;
    const {imageUrl, bounds} = data || {};
    if (!imageUrl || !bounds) {
      return [];
    }

    this._onRedrawNeeded = layerCallbacks?.onRedrawNeeded;
    const {visConfig} = this.config;

    const {visible} = this.getDefaultDeckLayerProps(opts);

    // Use live visConfig bounds (handles direct mutations from alignment mode)
    // rather than the potentially stale cached data.bounds from formatLayerData
    const west = visConfig.boundsWest ?? bounds[0];
    const south = visConfig.boundsSouth ?? bounds[1];
    const east = visConfig.boundsEast ?? bounds[2];
    const north = visConfig.boundsNorth ?? bounds[3];
    const dataBoundsKey = `${west},${south},${east},${north}`;

    // Rebuild the editable feature collection only when data.bounds changes
    // (i.e., formatLayerData was re-run due to slider change or other external update).
    // During editing, data.bounds stays stale (cached), so this won't trigger.
    if (dataBoundsKey !== this._prevDataBoundsKey) {
      this._prevDataBoundsKey = dataBoundsKey;
      this._editFeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [west, north],
                  [east, north],
                  [east, south],
                  [west, south],
                  [west, north]
                ]
              ]
            },
            properties: {shape: 'Rectangle'}
          }
        ]
      };
    }

    // Read current bounds from the edit feature collection (source of truth during editing)
    const editCoords =
      this._editFeatureCollection?.features?.[0]?.geometry?.coordinates?.[0];
    let activeBounds: [number, number, number, number];
    if (editCoords && editCoords.length >= 4) {
      // Use all vertices (excluding closing point which duplicates the first)
      const pts = editCoords.slice(0, -1);
      const lngs = pts.map((c: number[]) => c[0]);
      const lats = pts.map((c: number[]) => c[1]);
      activeBounds = [
        Math.min(...lngs),
        Math.min(...lats),
        Math.max(...lngs),
        Math.max(...lats)
      ];
    } else {
      activeBounds = [west, south, east, north];
    }

    const isAligning = visConfig.alignMode;

    const layers: any[] = [
      new DeckBitmapLayer({
        id: this.id,
        image: imageUrl,
        bounds: activeBounds,
        opacity: visConfig.opacity ?? 1,
        pickable: isAligning,
        visible,
        onClick: isAligning
          ? (info: any): boolean | undefined => {
              if (!this.alignWaitingForMap && info.bitmap?.uv) {
                this.onAlignImageClick(info.bitmap.uv as [number, number]);
                this._onRedrawNeeded?.();
                return true;
              }
              return undefined;
            }
          : undefined
      })
    ];

    // Visualize alignment control points
    if (visConfig.alignMode && this.alignControlPoints.length > 0) {
      layers.push(
        new ScatterplotLayer({
          id: `${this.id}-align-pts`,
          data: this.alignControlPoints,
          getPosition: (d: AlignControlPoint) => d.geo,
          getFillColor: [255, 100, 100, 220],
          getRadius: 6,
          radiusUnits: 'pixels',
          pickable: false,
          visible,
          updateTriggers: {
            getPosition: this.alignControlPoints.length
          }
        })
      );
    }

    // Visualize pending point (waiting for map click)
    if (visConfig.alignMode && this._pendingUV) {
      const [u, v] = this._pendingUV;
      const [aW, aS, aE, aN] = activeBounds;
      const pendingLng = aW + u * (aE - aW);
      const pendingLat = aN + v * (aS - aN);
      layers.push(
        new ScatterplotLayer({
          id: `${this.id}-align-pending`,
          data: [{position: [pendingLng, pendingLat]}],
          getPosition: (d: any) => d.position,
          getFillColor: [100, 200, 255, 220],
          getLineColor: [255, 255, 255, 255],
          getRadius: 8,
          radiusUnits: 'pixels',
          stroked: true,
          lineWidthMinPixels: 2,
          pickable: false,
          visible
        })
      );
    }

    if (visConfig.showBounds && !visConfig.editBounds) {
      // Static boundary outline (no interaction)
      const [aW, aS, aE, aN] = activeBounds;
      layers.push(
        new PathLayer({
          id: `${this.id}-bounds`,
          data: [
            [
              [aW, aN],
              [aE, aN],
              [aE, aS],
              [aW, aS],
              [aW, aN]
            ]
          ],
          getPath: (d: any) => d,
          getColor: [255, 255, 255, 200],
          getWidth: 2,
          widthUnits: 'pixels',
          pickable: false,
          visible
        })
      );
    }

    if (visConfig.editBounds) {
      // @ts-ignore - EditableGeoJsonLayer types are loose
      layers.push(
        new EditableGeoJsonLayer({
          id: `${this.id}-edit`,
          // @ts-ignore
          data: this._editFeatureCollection,
          mode: EDIT_MODE,
          selectedFeatureIndexes: [0],
          pickable: true,
          pickingRadius: 12,
          visible,
          modeConfig: {
            lockRectangles: true
          },
          filled: false,
          stroked: true,
          getLineColor: [255, 255, 255, 200],
          getLineWidth: 2,
          lineWidthUnits: 'pixels',
          getEditHandlePointColor: [255, 200, 0, 255],
          getEditHandlePointRadius: 6,
          editHandlePointRadiusUnits: 'pixels',
          onEdit: ({updatedData, editType}) => {
            this._editFeatureCollection = updatedData;

            const isFinal =
              editType === 'finishMovePosition' ||
              editType === 'translated' ||
              editType === 'addPosition';

            if (isFinal) {
              // Sync sliders on gesture end
              const geom = updatedData?.features?.[0]?.geometry;
              const coords =
                geom && 'coordinates' in geom ? (geom as any).coordinates[0] : null;
              if (coords && coords.length >= 5) {
                const pts = coords.slice(0, -1);
                const lngs = pts.map((c: number[]) => c[0]);
                const lats = pts.map((c: number[]) => c[1]);
                this.updateLayerVisConfig({
                  boundsWest: Math.min(...lngs),
                  boundsSouth: Math.min(...lats),
                  boundsEast: Math.max(...lngs),
                  boundsNorth: Math.max(...lats)
                });
              }
              if (this._rafId) {
                cancelAnimationFrame(this._rafId);
                this._rafId = undefined;
              }
              this._onRedrawNeeded?.();
            } else if (!this._rafId) {
              // Throttle live redraws to animation frame rate
              this._rafId = requestAnimationFrame(() => {
                this._rafId = undefined;
                this._onRedrawNeeded?.();
              });
            }
          }
        })
      );
    }

    return layers;
  }

}
