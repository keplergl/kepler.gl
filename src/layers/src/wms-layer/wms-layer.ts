// Imports
// @ts-expect-error 
import {_WMSLayer as DeckWMSLayer} from '@deck.gl/geo-layers';
import AbstractTileLayer, {
  AbstractTileLayerConfig,
  AbstractTileLayerVisConfigSettings,
  LayerData as CommonLayerData
} from '../vector-tile/abstract-tile-layer';
import {Field, Merge, VisConfigNumber, VisConfigSelection} from 'src/types';
import TileDataset from '../vector-tile/common-tile/tile-dataset';
import WMSLayerIcon from './wms-layer-icon';
import {FindDefaultLayerPropsReturnValue} from '../layer-utils';
import {DatasetType, LAYER_TYPES} from '@kepler.gl/constants';
import {KeplerTable as KeplerDataset} from '@kepler.gl/table';
import {notNullorUndefined} from '@kepler.gl/common-utils';

// Types
type WMSFeature = {
  id: string;
  url: string;
  layer: string;
};

export const wmsTileVisConfigs = {
  opacity: 'opacity' as const
};

export type WMSLayerVisConfig = {
  opacity: number;
  wmsLayer: {
    name: string;
    title: string;
  };
};

export type WMSLayerConfig = Merge<
  AbstractTileLayerConfig,
  {
    visConfig: WMSLayerVisConfig;
  }
>;

export type WMSLayerVisConfigSettings = Merge<
  AbstractTileLayerVisConfigSettings,
  {
    opacity: VisConfigNumber;
    wmsLayer: VisConfigSelection;
  }
>;

type LayerData = CommonLayerData & {
  tilesetDataUrl?: string | null;
  metadata?: any;
};

// Class Definition
export default class WMSLayer extends AbstractTileLayer<WMSFeature> {
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
      wmsLayer: defaultWmsLayer
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

  protected initTileDataset(): TileDataset<WMSFeature, never> {
    return new TileDataset<WMSFeature, never>({
      getTileId: tile => tile.id,
      getIterable: () => null as never, // Return null to match the 'never' type
      getRowCount: () => 0, // Return 0 row count for 'never' type
      getRowValue: () => {
        return () => null; // Return null for 'never' type
      }
    });
  }

  formatLayerData(datasets, oldLayerData, animationConfig): LayerData {
    const {dataId} = this.config;

    if (!notNullorUndefined(dataId)) {
      return {tilesetDataUrl: null};
    }

    const dataset = datasets[dataId];
    const metadata = dataset.metadata;

    // Use metadata to configure your layer
    const tilesetDataUrl = metadata?.tilesetDataUrl || null;

    return {
      ...super.formatLayerData(datasets, oldLayerData, animationConfig),
      tilesetDataUrl,
      metadata
    };
  }

  renderLayer(opts) {
    const {visConfig} = this.config;
    const {data} = opts;

    const wmsLayer = visConfig.wmsLayer.name ?? data.metadata?.layers?.[0]?.name ?? null;

    return [
      new DeckWMSLayer({
        data: data.tilesetDataUrl,
        serviceType: 'wms',
        layers: [wmsLayer],
        opacity: visConfig.opacity,
      })
    ];
  }

  // Protected/Private Methods
  accessRowValue(
    field?: Field,
    indexKey?: number | null
  ): (field: Field, datum: never) => string | number | null {
    throw new Error('Method not implemented.');
  }
}
