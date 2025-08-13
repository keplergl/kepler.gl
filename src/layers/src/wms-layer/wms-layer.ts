// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {notNullorUndefined} from '@kepler.gl/common-utils';
import {DatasetType, WMSDatasetMetadata, LAYER_TYPES} from '@kepler.gl/constants';
import {WMSLayer as DeckWMSLayer} from '@kepler.gl/deckgl-layers';
import {KeplerTable as KeplerDataset} from '@kepler.gl/table';
import {
  AnimationConfig,
  Field,
  LayerBaseConfig,
  VisConfigBoolean,
  VisConfigNumber,
  VisConfigSelection
} from '@kepler.gl/types';
import {DataContainerInterface} from '@kepler.gl/utils';

import TileDataset from '../vector-tile/common-tile/tile-dataset';
import WMSLayerIcon from './wms-layer-icon';
import {FindDefaultLayerPropsReturnValue} from '../layer-utils';

import AbstractTileLayer, {
  AbstractTileLayerVisConfigSettings,
  LayerData
} from '../vector-tile/abstract-tile-layer';

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
    queryable: boolean;
  } | null;
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

  // Store reference to the deck layer for feature info access
  private deckLayerRef: DeckWMSLayer | null = null;

  // Constructor
  constructor(
    props: ConstructorParameters<typeof AbstractTileLayer>[0] & {
      layers?: WMSDatasetMetadata['layers'];
    }
  ) {
    super(props);

    const defaultWmsLayer = props.layers?.[0] ?? null;

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
    if (!notNullorUndefined(dataId) || !datasets[dataId]) {
      return {
        tilesetDataUrl: null,
        metadata: null
      };
    }
    const dataset = datasets[dataId];
    const metadata = dataset?.metadata;

    return {
      ...super.formatLayerData(datasets, oldLayerData, animationConfig),
      tilesetDataUrl: metadata?.tilesetDataUrl || null, // URL for WMS tiles
      metadata: dataset?.metadata
    };
  }

  _getCurrentServiceLayer() {
    const {visConfig} = this.config;
    return visConfig.wmsLayer ?? null;
  }

  updateLayerMeta(dataset: KeplerDataset): void {
    if (dataset.type !== DatasetType.WMS_TILE) {
      return;
    }

    const currentLayer = this._getCurrentServiceLayer();
    if (currentLayer && currentLayer.boundingBox) {
      this.updateMeta({
        bounds: currentLayer.boundingBox
      });
    }
  }

  hasHoveredObject(objectInfo: any) {
    // For WMS layers, we consider it hovered if the layer is picked
    // The actual feature info will be retrieved via getHoverData
    if (this.isLayerHovered(objectInfo)) {
      return {
        index: 0, // WMS layers don't have discrete data points, so we use index 0
        ...objectInfo
      };
    }
    return null;
  }

  getHoverData(
    object: any,
    dataContainer: DataContainerInterface,
    fields: Field[],
    animationConfig: AnimationConfig,
    hoverInfo: {index: number; x?: number; y?: number}
  ) {
    // Check if this is a WMS feature info object from clicked state
    if (object?.wmsFeatureInfo) {
      if (Array.isArray(object.wmsFeatureInfo)) {
        return {
          wmsFeatureData: object.wmsFeatureInfo
        };
      }

      return {
        wmsFeatureData: [
          {
            name: 'WMS Feature Info',
            value: object.wmsFeatureInfo
          }
        ]
      };
    }

    if (hoverInfo.x !== undefined && hoverInfo.y !== undefined) {
      return {
        fieldValues: [
          {
            labelMessage: 'layer.wms.hover',
            value: 'Click to query WMS feature info'
          }
        ]
      };
    }

    return null;
  }

  renderLayer(opts) {
    const {visConfig} = this.config;
    const {data, interactionConfig, layerCallbacks} = opts;
    const wmsLayer = this._getCurrentServiceLayer();
    if (!wmsLayer) {
      return [];
    }
    const {name: wmsLayerName, queryable} = wmsLayer;
    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);
    const pickable = interactionConfig?.tooltip?.enabled && queryable;

    const deckLayer = new DeckWMSLayer({
      id: `${this.id}-WMSLayer` as string,
      idx: defaultLayerProps.idx,
      serviceType: 'wms',
      data: data.tilesetDataUrl,
      layers: [wmsLayerName],
      opacity: visConfig.opacity,
      transparent: visConfig.transparent,
      pickable,
      // @ts-ignore
      onClick: pickable ? this._onClick.bind(this, layerCallbacks) : null
    });

    // Store reference to the deck layer for feature info access
    this.deckLayerRef = deckLayer;

    return [deckLayer];
  }

  protected async _onClick(layerCallbacks, {bitmap, coordinate}) {
    if (!bitmap) return null;

    const x = bitmap.pixel[0];
    const y = bitmap.pixel[1];
    const featureInfo = await this.getWMSFeatureInfo(x, y);

    // Call the callback to update state with coordinate
    if (layerCallbacks?.onWMSFeatureInfo) {
      layerCallbacks.onWMSFeatureInfo({featureInfo, coordinate});
    }

    return featureInfo;
  }

  // Method to retrieve WMS feature info asynchronously
  protected async getWMSFeatureInfo(
    x: number,
    y: number
  ): Promise<Array<{name: string; value: string}> | null> {
    try {
      if (this.deckLayerRef && typeof this.deckLayerRef.getFeatureInfoText === 'function') {
        const featureInfoXml = await this.deckLayerRef.getFeatureInfoText(x, y);
        if (featureInfoXml) {
          // Parse the XML response to extract attributes
          const parsedAttributes = this.parseWMSFeatureInfo(featureInfoXml);
          return parsedAttributes.length > 0 ? parsedAttributes : null;
        }
      }
      return null;
    } catch (error) {
      console.warn('Failed to get WMS feature info:', error);
      return null;
    }
  }

  // Helper method to parse WMS XML response
  protected parseWMSFeatureInfo(xmlString: string): Array<{name: string; value: string}> {
    try {
      // Simple XML parsing to extract feature attributes
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

      const attributes: Array<{name: string; value: string}> = [];

      // Look for feature members
      const featureMembers = xmlDoc.getElementsByTagName('gml:featureMember');

      for (let i = 0; i < featureMembers.length; i++) {
        const featureMember = featureMembers[i];

        // Get all child elements that contain attribute data
        const children = featureMember.children;

        for (let j = 0; j < children.length; j++) {
          const feature = children[j];
          const featureChildren = feature.children;

          // Extract attribute name-value pairs
          for (let k = 0; k < featureChildren.length; k++) {
            const attr = featureChildren[k];
            const tagName = attr.tagName;
            const value = attr.textContent || '';

            // Clean up the tag name (remove namespace prefix)
            const cleanName = tagName.includes(':') ? tagName.split(':')[1] : tagName;

            // Skip empty values and geometry elements
            if (value.trim() && !cleanName.toLowerCase().includes('geom')) {
              attributes.push({
                name: cleanName.replace(/_/g, ' ').toUpperCase(),
                value: value.trim()
              });
            }
          }
        }
      }

      return attributes;
    } catch (error) {
      console.warn('Error parsing WMS feature info XML:', error);
      return [];
    }
  }
}
