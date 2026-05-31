// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {BitmapLayer as DeckBitmapLayer, PathLayer} from '@deck.gl/layers';
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

export default class BitmapOverlayLayer extends Layer {
  declare visConfigSettings: BitmapLayerVisConfigSettings;
  private _editFeatureCollection: any = null;
  private _prevDataBoundsKey: string = '';
  private _onRedrawNeeded: (() => void) | undefined;
  private _rafId: number | undefined;

  constructor(props: {dataId: string; visConfig?: Record<string, any>} & Record<string, any>) {
    super(props);
    this.registerVisConfig(bitmapVisConfigs);
    // Apply visConfig from findDefaultLayerProps (e.g. bounds seeded from metadata)
    if (props.visConfig) {
      this.updateLayerVisConfig(props.visConfig);
    }
    this.meta = {};
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

    const [west, south, east, north] = bounds as [number, number, number, number];
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

    const layers: any[] = [
      new DeckBitmapLayer({
        id: this.id,
        image: imageUrl,
        bounds: activeBounds,
        opacity: visConfig.opacity ?? 1,
        pickable: false,
        visible,
        parameters: {
          blend: true,
          blendColorSrcFactor: 'one',
          blendColorDstFactor: 'one-minus-src-alpha',
          blendAlphaSrcFactor: 'one',
          blendAlphaDstFactor: 'one-minus-src-alpha'
        }
      })
    ];

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
