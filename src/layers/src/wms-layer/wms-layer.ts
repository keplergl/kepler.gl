// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  Field,
  LayerBaseConfig,
  VisConfigBoolean,
  VisConfigNumber,
  VisConfigSelection
} from 'src/types';
import TileDataset from '../vector-tile/common-tile/tile-dataset';
import WMSLayerIcon from './wms-layer-icon';
import {FindDefaultLayerPropsReturnValue} from '../layer-utils';

import AbstractTileLayer, {
  AbstractTileLayerVisConfigSettings,
  LayerData
} from '../vector-tile/abstract-tile-layer';

import {DatasetType, LAYER_TYPES} from '@kepler.gl/constants';
import {notNullorUndefined} from '@kepler.gl/common-utils';
import {WMSLayer as DeckWMSLayer} from '@kepler.gl/deckgl-layers';
import {KeplerTable as KeplerDataset} from '@kepler.gl/table';

// Types
export type WMSTile = {
  id: string;
  url: string;
};

export const wmsTileVisConfigs = {
  opacity: 'opacity' as const,
  transparent: 'transparent' as const
};

export type WMSLayerVisConfig = {
  opacity: number;
  transparent?: boolean;
  wmsLayer: {
    name: string;
    title: string;
    boundingBox: number[][];
  };
};

export type WMSLayerConfig = LayerBaseConfig & {
  visConfig: WMSLayerVisConfig;
};

// Extend visConfigSettings to satisfy AbstractTileLayer
export type WMSLayerVisConfigSettings = AbstractTileLayerVisConfigSettings & {
  opacity: VisConfigNumber;
  transparent: VisConfigBoolean;
  wmsLayer: VisConfigSelection;
};

// Extend LayerData for WMS
export type WMSLayerData = LayerData & {
  tilesetDataUrl?: string | null;
  metadata?: any;
};

// Class Definition
export default class WMSLayer extends AbstractTileLayer<WMSTile, any[]> {
  declare config: WMSLayerConfig;
  declare visConfigSettings: WMSLayerVisConfigSettings;

  // Constructor
  constructor(
    props: ConstructorParameters<typeof AbstractTileLayer>[0] & {
      layers?: {name: string; title: string}[];
    }
  ) {
    super(props);

    const defaultWmsLayer = props.layers?.[0] || {
      name: 'defaultLayer',
      title: 'Default Layer'
    };

    this.registerVisConfig(wmsTileVisConfigs);
    this.updateLayerVisConfig({
      opacity: 0.8, // Default opacity
      wmsLayer: defaultWmsLayer,
      transparent: true
    });
  }

  // Properties
  get type() {
    return LAYER_TYPES.wms;
  }

  get name() {
    return 'WMS Tile';
  }

  get layerIcon() {
    return WMSLayerIcon;
  }

  // Static Methods
  static findDefaultLayerProps(dataset: KeplerDataset): FindDefaultLayerPropsReturnValue {
    if (dataset.type !== DatasetType.WMS_TILE) {
      return {props: []};
    }
    const {label} = dataset.metadata || {};
    const props = {
      label: label || 'WMS Layer',
      layers: dataset.metadata?.layers || []
    };

    return {props: [props]};
  }

  // Instance Methods
  get supportedDatasetTypes(): DatasetType[] {
    return [DatasetType.WMS_TILE];
  }

  protected initTileDataset() {
    // Provide dummy accessors for raster/WMS
    return new TileDataset<WMSTile, any[]>({
      getTileId: tile => tile?.id || 'wms',
      getIterable: _tile => [],
      getRowCount: () => 0,
      getRowValue: () => () => null
    });
  }

  accessRowValue(_field?: Field, _indexKey?: number | null) {
    // WMS layers are raster, so no row access; return a dummy accessor
    return () => null;
  }

  formatLayerData(datasets, oldLayerData, animationConfig): WMSLayerData {
    const {dataId} = this.config;
    if (!notNullorUndefined(dataId)) {
      return {
        ...super.formatLayerData(datasets, oldLayerData, animationConfig),
        tilesetDataUrl: null,
        metadata: null
      };
    }
    const dataset = datasets[dataId];
    const metadata = dataset.metadata;

    return {
      ...super.formatLayerData(datasets, oldLayerData, animationConfig),
      tilesetDataUrl: metadata?.tilesetDataUrl || null, // URL for WMS tiles
      metadata: dataset?.metadata
    };
  }

  _getCurrentServiceLayer(dataset: KeplerDataset) {
    const {visConfig} = this.config;
    return visConfig.wmsLayer ?? dataset.metadata?.layers?.[0] ?? null;
  }

  updateLayerMeta(dataset: KeplerDataset): void {
    if (dataset.type !== DatasetType.WMS_TILE) {
      return;
    }

    const currentLayer = this._getCurrentServiceLayer(dataset);
    if (currentLayer && currentLayer.boundingBox) {
      const bb = currentLayer.boundingBox;
      this.updateMeta({
        bounds: [bb[0][0], bb[0][1], bb[1][0], bb[1][1]]
      });
    }
  }

  renderLayer(opts) {
    const {visConfig} = this.config;
    const {data} = opts;
    const wmsLayer = visConfig.wmsLayer.name ?? data.metadata?.layers?.[0]?.name ?? null;
    const template = {
      LAYERS: '{layers}',
      BBOX: '{east},{north},{west},{south}',
      TRANSPARENT: visConfig.transparent ? 'TRUE' : 'FALSE',
      FORMAT: 'image/png',
      REQUEST: 'GetMap',
      SERVICE: 'WMS',
      WIDTH: '{width}',
      HEIGHT: '{height}',
      VERSION: data.metadata?.version || '1.3.0',
      CRS: 'EPSG:3857'
    };

    const qs = Object.entries(template)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    return [
      new DeckWMSLayer({
        data: `${data.tilesetDataUrl}?${qs}`,
        serviceType: 'template',
        layers: [wmsLayer],
        opacity: visConfig.opacity,
        id: this.id
      })
    ];
  }
}
