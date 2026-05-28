// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {BitmapLayer as DeckBitmapLayer, PathLayer} from '@deck.gl/layers';

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

export type BitmapLayerVisConfigSettings = {
  opacity: VisConfigNumber;
  showBounds: VisConfigBoolean;
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
  boundsWest: {
    type: 'number',
    defaultValue: 0,
    label: 'layerVisConfigs.boundsWest',
    isRanged: false,
    range: [-180, 180],
    step: 0.0001,
    group: 'display',
    property: 'boundsWest',
    allowCustomValue: true
  } as VisConfigNumber,
  boundsSouth: {
    type: 'number',
    defaultValue: 0,
    label: 'layerVisConfigs.boundsSouth',
    isRanged: false,
    range: [-90, 90],
    step: 0.0001,
    group: 'display',
    property: 'boundsSouth',
    allowCustomValue: true
  } as VisConfigNumber,
  boundsEast: {
    type: 'number',
    defaultValue: 0,
    label: 'layerVisConfigs.boundsEast',
    isRanged: false,
    range: [-180, 180],
    step: 0.0001,
    group: 'display',
    property: 'boundsEast',
    allowCustomValue: true
  } as VisConfigNumber,
  boundsNorth: {
    type: 'number',
    defaultValue: 0,
    label: 'layerVisConfigs.boundsNorth',
    isRanged: false,
    range: [-90, 90],
    step: 0.0001,
    group: 'display',
    property: 'boundsNorth',
    allowCustomValue: true
  } as VisConfigNumber
};

export default class BitmapOverlayLayer extends Layer {
  declare visConfigSettings: BitmapLayerVisConfigSettings;

  constructor(props: {dataId: string} & Record<string, any>) {
    super(props);
    this.registerVisConfig(bitmapVisConfigs);
    this.meta = {};
  }

  static findDefaultLayerProps(dataset: KeplerDataset): FindDefaultLayerPropsReturnValue {
    if (dataset.type !== DatasetType.BITMAP) {
      return {props: []};
    }

    return {
      props: [
        {
          label: dataset.label || 'Bitmap',
          isVisible: true
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

    // Seed visConfig bounds from metadata on first load
    const {visConfig} = this.config;
    if (
      metadata.bounds &&
      visConfig.boundsWest === 0 &&
      visConfig.boundsSouth === 0 &&
      visConfig.boundsEast === 0 &&
      visConfig.boundsNorth === 0
    ) {
      const metaBounds = metadata.bounds;
      if (Array.isArray(metaBounds) && typeof metaBounds[0] === 'number') {
        const [w, s, e, n] = metaBounds as [number, number, number, number];
        this.updateLayerVisConfig({boundsWest: w, boundsSouth: s, boundsEast: e, boundsNorth: n});
      } else if (Array.isArray(metaBounds) && Array.isArray(metaBounds[0])) {
        const corners = metaBounds as [
          [number, number],
          [number, number],
          [number, number],
          [number, number]
        ];
        const lngs = corners.map(c => c[0]);
        const lats = corners.map(c => c[1]);
        this.updateLayerVisConfig({
          boundsWest: Math.min(...lngs),
          boundsSouth: Math.min(...lats),
          boundsEast: Math.max(...lngs),
          boundsNorth: Math.max(...lats)
        });
      }
    }

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
    const {data} = opts;
    const {imageUrl, bounds} = data || {};
    if (!imageUrl || !bounds) {
      return [];
    }

    const {visConfig} = this.config;
    const {visible} = this.getDefaultDeckLayerProps(opts);

    const layers: any[] = [
      new DeckBitmapLayer({
        id: this.id,
        image: imageUrl,
        bounds,
        opacity: visConfig.opacity ?? 1,
        pickable: false,
        visible
      })
    ];

    if (visConfig.showBounds) {
      const boundaryPath = this._getBoundaryPath(bounds);
      if (boundaryPath) {
        layers.push(
          new PathLayer({
            id: `${this.id}-bounds`,
            data: [boundaryPath],
            getPath: (d: number[][]) => d,
            getColor: [255, 255, 255, 200],
            getWidth: 2,
            widthUnits: 'pixels',
            pickable: false,
            visible
          })
        );
      }
    }

    return layers;
  }

  _getBoundaryPath(bounds: BitmapBounds): number[][] | null {
    if (!bounds) {
      return null;
    }

    if (Array.isArray(bounds[0]) && Array.isArray(bounds[0])) {
      // 4-corners format: [[x0,y0], [x1,y1], [x2,y2], [x3,y3]]
      const corners = bounds as [
        [number, number],
        [number, number],
        [number, number],
        [number, number]
      ];
      return [corners[0], corners[1], corners[2], corners[3], corners[0]];
    }

    // [west, south, east, north] format
    const [west, south, east, north] = bounds as [number, number, number, number];
    return [
      [west, north],
      [east, north],
      [east, south],
      [west, south],
      [west, north]
    ];
  }
}
