// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import memoize from 'lodash/memoize';
import uniq from 'lodash/uniq';
import {interpolateArray} from 'd3-interpolate';
import Layer, {LayerBaseConfig, defaultGetFieldValue, VisualChannelField} from '../base-layer';
import {TripsLayer as DeckGLTripsLayer} from '@deck.gl/geo-layers';
import {Matrix4, Quaternion} from '@math.gl/core';
import {lngLatToWorld} from '@math.gl/web-mercator';

import {
  CHANNEL_SCALES,
  GEOJSON_FIELDS,
  PROJECTED_PIXEL_SIZE_MULTIPLIER,
  SCALE_TYPES,
  LAYER_VIS_CONFIGS,
  PROPERTY_GROUPS,
  DEFAULT_TEXT_LABEL,
  CUSTOM_SCENEGRAPH_MODEL_ID,
  TRIP_LAYER_SCENEGRAPH_MODELS
} from '@kepler.gl/constants';
import TripLayerIcon from './trip-layer-icon';
import {
  formatTextLabelData,
  getSingleTextLabelValue,
  getTextOffsetByRadius
} from '../layer-text-label';

import {
  getGeojsonDataMaps,
  getGeojsonBounds,
  getGeojsonFeatureTypes,
  GeojsonDataMaps,
  detectTableColumns,
  groupColumnsAsGeoJson,
  applyFiltersToTableColumns
} from '../geojson-layer/geojson-utils';

import {isTripGeoJsonField, parseTripGeoJsonTimestamp} from './trip-utils';
import TripInfoModalFactory from './trip-info-modal';
import {bisectRight} from 'd3-array';
import {
  ColorRange,
  Field,
  Merge,
  VisConfigColorRange,
  VisConfigNumber,
  VisConfigInput,
  VisConfigBoolean,
  VisConfigRange,
  LayerColumn,
  LayerTextLabel,
  AnimationConfig,
  RGBColor
} from '@kepler.gl/types';
import {default as KeplerTable, Datasets} from '@kepler.gl/table';
import {DataContainerInterface} from '@kepler.gl/utils';
import {notNullorUndefined} from '@kepler.gl/common-utils';
import {ScenegraphLayer as DeckScenegraphLayer} from '@deck.gl/mesh-layers';
import {fetchGltf} from '../scenegraph-layer/scenegraph-layer';

export type TripLayerVisConfigSettings = {
  opacity: VisConfigNumber;
  thickness: VisConfigNumber;
  colorRange: VisConfigColorRange;
  trailLength: VisConfigNumber;
  sizeRange: VisConfigRange;
  scenegraphCustomModelUrl: VisConfigInput;
};

export type TripLayerColumnsConfig = {
  geojson: LayerColumn;
  timestamp?: LayerColumn;
};

export type TripLayerVisConfig = {
  opacity: number;
  thickness: number;
  colorRange: ColorRange;
  trailLength: number;
  sizeRange: [number, number];
  billboard: boolean;
  fadeTrail: boolean;
  sizeScale: number;
  adjustRoll: number;
  adjustPitch: number;
  adjustYaw: number;
  invertRoll: boolean;
  invertPitch: boolean;
  invertYaw: boolean;
  scenegraphEnabled: boolean;
  scenegraph: string;
  scenegraphColor: RGBColor;
  scenegraphColorEnabled: boolean;
  scenegraphUseTrailColor: boolean;
  scenegraphCustomModelUrl: string;
};

export type TripLayerConfig = Merge<
  LayerBaseConfig,
  {
    columns: TripLayerColumnsConfig;
    visConfig: TripLayerVisConfig;
    colorField?: VisualChannelField;
    rollField: VisualChannelField;
    rollDomain: [number, number];
    rollScale: string;
    pitchField: VisualChannelField;
    pitchDomain: [number, number];
    pitchScale: string;
    yawField: VisualChannelField;
    yawDomain: [number, number];
    yawScale: string;
  }
>;

export type TripLayerMeta = {
  getFeature: any;
};

const zoomFactorValue = 8;

export const defaultThickness = 0.5;
export const defaultLineWidth = 1;

const SCENEGRAPH_DEFAULT_COLOR = [255, 255, 255];
const SCENEGRAPH_DEFAULT_TRANSITION = [0, 0, 0];
const SCENEGRAPH_DEFAULT_SIZE_SCALE = 5;

export const tripVisConfigs: {
  opacity: 'opacity';
  thickness: VisConfigNumber;
  colorRange: 'colorRange';
  trailLength: 'trailLength';
  fadeTrail: 'fadeTrail';
  billboard: 'billboard';
  sizeRange: 'strokeWidthRange';
  sizeScale: VisConfigNumber;
  scenegraph: 'scenegraph';
  scenegraphEnabled: 'scenegraphEnabled';
  scenegraphColorEnabled: 'scenegraphColorEnabled';
  scenegraphUseTrailColor: 'scenegraphUseTrailColor';
  scenegraphColor: 'scenegraphColor';
  scenegraphCustomModelUrl: 'scenegraphCustomModelUrl';
  adjustRoll: VisConfigNumber;
  adjustPitch: VisConfigNumber;
  adjustYaw: VisConfigNumber;
  invertRoll: VisConfigBoolean;
  invertPitch: VisConfigBoolean;
  invertYaw: VisConfigBoolean;
  fixedRoll: VisConfigBoolean;
  fixedPitch: VisConfigBoolean;
  fixedYaw: VisConfigBoolean;
} = {
  opacity: 'opacity',
  thickness: {
    type: 'number',
    defaultValue: defaultThickness,
    label: 'Stroke Width',
    isRanged: false,
    range: [0, 100],
    step: 0.1,
    group: 'stroke',
    property: 'thickness'
  },
  colorRange: 'colorRange',
  trailLength: 'trailLength',
  fadeTrail: 'fadeTrail',
  billboard: 'billboard',
  sizeRange: 'strokeWidthRange',
  sizeScale: {
    ...LAYER_VIS_CONFIGS.sizeScale,
    label: 'layerVisConfigs.adjustSize',
    description: 'layerVisConfigs.adjustSizeDescription',
    defaultValue: 1,
    isRanged: false,
    range: [-10, 10],
    step: 0.1
  },
  scenegraph: 'scenegraph',
  scenegraphEnabled: 'scenegraphEnabled',
  scenegraphColorEnabled: 'scenegraphColorEnabled',
  scenegraphUseTrailColor: 'scenegraphUseTrailColor',
  scenegraphColor: 'scenegraphColor',
  scenegraphCustomModelUrl: 'scenegraphCustomModelUrl',
  adjustRoll: {
    ...LAYER_VIS_CONFIGS.angle,
    property: 'adjustRoll',
    label: 'layerVisConfigs.adjustRoll',
    range: [-180, +180]
  },
  adjustPitch: {
    ...LAYER_VIS_CONFIGS.angle,
    property: 'adjustPitch',
    label: 'layerVisConfigs.adjustPitch',
    range: [-180, +180]
  },
  adjustYaw: {
    ...LAYER_VIS_CONFIGS.angle,
    property: 'adjustYaw',
    label: 'layerVisConfigs.adjustYaw',
    range: [-180, +180]
  },
  invertRoll: {
    property: 'invertRoll',
    label: 'Invert Roll',
    type: 'boolean',
    defaultValue: false,
    group: PROPERTY_GROUPS.angle
  },
  invertPitch: {
    property: 'invertPitch',
    label: 'Invert Pitch',
    type: 'boolean',
    defaultValue: false,
    group: PROPERTY_GROUPS.angle
  },
  invertYaw: {
    property: 'invertYaw',
    label: 'Invert Yaw',
    type: 'boolean',
    defaultValue: false,
    group: PROPERTY_GROUPS.angle
  },
  fixedRoll: {
    defaultValue: true,
    type: 'boolean',
    label: 'layerVisConfigs.fixedRoll',
    description: 'layerVisConfigs.fixedRollDescription',
    group: PROPERTY_GROUPS.angle,
    property: 'fixedRoll'
  },
  fixedPitch: {
    defaultValue: true,
    type: 'boolean',
    label: 'layerVisConfigs.fixedPitch',
    description: 'layerVisConfigs.fixedPitchDescription',
    group: PROPERTY_GROUPS.angle,
    property: 'fixedPitch'
  },
  fixedYaw: {
    defaultValue: true,
    type: 'boolean',
    label: 'layerVisConfigs.fixedYaw',
    description: 'layerVisConfigs.fixedYawDescription',
    group: PROPERTY_GROUPS.angle,
    property: 'fixedYaw'
  }
};

export const featureAccessor =
  ({geojson}: TripLayerColumnsConfig) =>
  (dc: DataContainerInterface) =>
  d =>
    dc.valueAt(d.index, geojson.fieldIdx);
export const featureResolver = ({geojson}: TripLayerColumnsConfig) => geojson.fieldIdx;
const getTableModeFieldValue = (field, data) => {
  let rv;
  if (typeof data === 'function') {
    rv = data(field);
  } else {
    rv = defaultGetFieldValue(field, data);
  }
  return rv;
};

type DatumForFeatureByTime = {
  idx: number;
  coords: any;
  datum: any[] | null;
  advancement?: any;
  prevDatum?: any;
};

export const COLUMN_MODE_GEOJSON = 'geojson';
export const COLUMN_MODE_TABLE = 'table';
const SUPPORTED_COLUMN_MODES = [
  {
    key: COLUMN_MODE_GEOJSON,
    label: 'GeoJSON',
    requiredColumns: ['geojson']
  },
  {
    key: COLUMN_MODE_TABLE,
    label: 'Table columns',
    requiredColumns: ['id', 'lat', 'lng', 'timestamp'],
    optionalColumns: ['altitude']
  }
];
const DEFAULT_COLUMN_MODE = COLUMN_MODE_GEOJSON;

export default class TripLayer extends Layer {
  declare visConfigSettings: TripLayerVisConfigSettings;
  declare config: TripLayerConfig;
  declare meta: TripLayerMeta;
  declare dataContainer: DataContainerInterface | null;

  dataToFeature: GeojsonDataMaps;
  dataToTimeStamp: any[];
  getFeature: (columns: TripLayerColumnsConfig) => (dataContainer: DataContainerInterface) => any;
  _layerInfoModal: Record<string, () => JSX.Element>;

  constructor(props) {
    super(props);

    this.dataToFeature = [];
    this.dataToTimeStamp = [];
    this.dataContainer = null;
    this.registerVisConfig(tripVisConfigs);
    this.getFeature = memoize(featureAccessor, featureResolver);
    this._layerInfoModal = {
      [COLUMN_MODE_TABLE]: TripInfoModalFactory(COLUMN_MODE_TABLE),
      [COLUMN_MODE_GEOJSON]: TripInfoModalFactory(COLUMN_MODE_GEOJSON)
    };
  }

  get supportedColumnModes() {
    return SUPPORTED_COLUMN_MODES;
  }

  static get type(): 'trip' {
    return 'trip';
  }
  get type() {
    return TripLayer.type;
  }

  get name(): 'Trip' {
    return 'Trip';
  }

  get layerIcon() {
    return TripLayerIcon;
  }

  get columnPairs() {
    return this.defaultPointColumnPairs;
  }

  accessVSFieldValue(field, indexKey) {
    if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
      return defaultGetFieldValue;
    }
    return getTableModeFieldValue;
  }

  get visualChannels() {
    const visualChannels = super.visualChannels;

    return {
      ...visualChannels,
      color: {
        ...visualChannels.color,
        accessor: 'getColor',
        nullValue: visualChannels.color.nullValue,
        getAttributeValue: config => d => d.properties.lineColor || config.color,
        defaultValue: config => config.color
      },
      size: {
        ...visualChannels.size,
        property: 'stroke',
        accessor: 'getWidth',
        condition: config => config.visConfig.stroked,
        nullValue: 0,
        getAttributeValue: () => d => d.properties.lineWidth || defaultLineWidth
      },
      adjustRoll: {
        fixed: 'fixedRoll',
        property: 'adjustRoll',
        accessor: 'getAdjustRoll',
        defaultValue: config => config.visConfig.adjustRoll,
        nullValue: 0,
        field: 'rollField',
        scale: 'rollScale',
        domain: 'rollDomain',
        range: 'rollRange',
        key: 'adjustRoll',
        channelScaleType: CHANNEL_SCALES.angle
      },
      adjustPitch: {
        fixed: 'fixedPitch',
        property: 'adjustPitch',
        accessor: 'getAdjustPitch',
        defaultValue: config => config.visConfig.adjustPitch,
        nullValue: 0,
        field: 'pitchField',
        scale: 'pitchScale',
        domain: 'pitchDomain',
        range: 'pitchRange',
        key: 'adjustPitch',
        channelScaleType: CHANNEL_SCALES.angle
      },
      adjustYaw: {
        fixed: 'fixedYaw',
        property: 'adjustYaw',
        accessor: 'getAdjustYaw',
        defaultValue: config => config.visConfig.adjustYaw,
        nullValue: 0,
        field: 'yawField',
        scale: 'yawScale',
        domain: 'yawDomain',
        range: 'yawRange',
        key: 'adjustYaw',
        channelScaleType: CHANNEL_SCALES.angle
      }
    };
  }

  get animationDomain() {
    return this.config.animation.domain;
  }

  get layerInfoModal() {
    return {
      [COLUMN_MODE_GEOJSON]: {
        id: 'iconInfo',
        template: this._layerInfoModal[COLUMN_MODE_GEOJSON],
        modalProps: {
          title: 'modal.tripInfo.title'
        }
      },
      [COLUMN_MODE_TABLE]: {
        id: 'iconInfo',
        template: this._layerInfoModal[COLUMN_MODE_TABLE],
        modalProps: {
          title: 'modal.tripInfo.titleTable'
        }
      }
    };
  }

  getPositionAccessor(dataContainer: DataContainerInterface) {
    if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
      return this.getFeature(this.config.columns)(dataContainer);
    }
    return null;
  }

  static findDefaultLayerProps(
    {label, fields = [], dataContainer, id, fieldPairs = []}: KeplerTable,
    foundLayers?: any[]
  ) {
    const geojsonColumns = fields
      .filter(f => f.type === 'geojson' || f.type === 'geoarrow')
      .map(f => f.name);

    const defaultColumns = {
      geojson: uniq([...GEOJSON_FIELDS.geojson, ...geojsonColumns])
    };

    const geoJsonColumns = this.findDefaultColumnField(defaultColumns, fields);

    const tripGeojsonColumns = (geoJsonColumns || []).filter(col =>
      isTripGeoJsonField(dataContainer, fields[col.geojson.fieldIdx])
    );

    if (tripGeojsonColumns.length) {
      return {
        props: tripGeojsonColumns.map(columns => ({
          label: (typeof label === 'string' && label.replace(/\.[^/.]+$/, '')) || this.type,
          columns,
          isVisible: true,
          columnMode: COLUMN_MODE_GEOJSON
        })),

        // if a geojson layer is created from this column, delete it
        foundLayers: foundLayers?.filter(
          prop =>
            prop.type !== 'geojson' ||
            prop.dataId !== id ||
            !tripGeojsonColumns.find(c => prop.columns.geojson.name === c.geojson.name)
        )
      };
    }

    // Try to detect table columns (id/lat/lng/timestamp) for table column mode
    // This allows creating trip layers from tabular data without GeoJSON
    if (fieldPairs.length && fields.length) {
      // Default layer columns for table mode
      const defaultTableColumns = {
        id: {value: null, fieldIdx: -1},
        lat: {value: null, fieldIdx: -1},
        lng: {value: null, fieldIdx: -1},
        timestamp: {value: null, fieldIdx: -1},
        altitude: {value: null, fieldIdx: -1, optional: true},
        geojson: {value: null, fieldIdx: -1}
      };

      const tableColumns = detectTableColumns(
        {fields, fieldPairs} as KeplerTable,
        defaultTableColumns,
        'timestamp'
      );

      if (tableColumns) {
        // Found required columns for table mode
        return {
          props: [
            {
              label:
                tableColumns.label ||
                (typeof label === 'string' && label.replace(/\.[^/.]+$/, '')) ||
                this.type,
              columns: tableColumns.columns,
              isVisible: true,
              columnMode: COLUMN_MODE_TABLE
            }
          ],
          foundLayers
        };
      }
    }

    return {props: []};
  }

  getDefaultLayerConfig(props) {
    return {
      ...super.getDefaultLayerConfig(props),
      columnMode: props?.columnMode ?? DEFAULT_COLUMN_MODE,
      animation: {
        enabled: true,
        domain: null
      },
      textLabel: [
        {
          ...DEFAULT_TEXT_LABEL,
          backgroundColor: null
        }
      ],
      rollField: null,
      rollDomain: [0, 1],
      rollScale: SCALE_TYPES.linear,
      pitchField: null,
      pitchDomain: [0, 1],
      pitchScale: SCALE_TYPES.linear,
      yawField: null,
      yawDomain: [0, 1],
      yawScale: SCALE_TYPES.linear
    };
  }

  getHoverData(object, dataContainer: DataContainerInterface, fields, animationConfig) {
    if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
      // index for dataContainer is saved to feature.properties
      return dataContainer.row(object.properties.index);
    }
    return this._findDatumForFeatureByTime(object.properties.index, animationConfig)?.datum;
  }

  calculateDataAttribute(dataset: KeplerTable) {
    switch (this.config.columnMode) {
      case COLUMN_MODE_GEOJSON: {
        return (
          dataset.filteredIndex
            .map(i => this.dataToFeature[i])
            // TODO d can be BinaryFeatureCollection, fix logic
            .filter(d => d && (d as any).geometry?.type === 'LineString')
        );
      }

      case COLUMN_MODE_TABLE:
        return applyFiltersToTableColumns(dataset, this.dataToFeature);

      default:
        return [];
    }
  }

  private _formatTableColumnModeTextLabelData(textLabel: LayerTextLabel[], fields) {
    return textLabel.map((tl, i) => {
      if (!tl.field) {
        return {
          getText: null,
          characterSet: []
        };
      }

      const field = fields.find(fld => fld.name === (tl.field as Field).name);
      if (!field) {
        return {
          getText: null,
          characterSet: []
        };
      }

      const getText = (f, animationConfig) => {
        const {datum} = this._findDatumForFeatureByTime(f.properties.index, animationConfig);
        return getSingleTextLabelValue({field, format: ''}, datum);
      };

      return {
        characterSet: 'auto',
        getText,
        updateTriggers: {
          getText: {
            field: field.name,
            fieldDisplayName: field.displayName
          }
        }
      };
    });
  }

  _getColumnModeValueAccessor = feature => {
    return field => {
      if (field.fieldIdx === this.config.columns.timestamp?.fieldIdx) {
        return this.dataToTimeStamp[feature.properties.index];
      }
      return feature.properties.values.map(v => field.valueAccessor(v));
    };
  };

  formatLayerData(datasets: Datasets, oldLayerData) {
    const {dataId} = this.config;
    if (!notNullorUndefined(dataId)) {
      return oldLayerData;
    }
    const {dataContainer, gpuFilter, fields} = datasets[dataId];
    const {data, triggerChanged} = this.updateData(datasets, oldLayerData);
    const {textLabel} = this.config;

    let valueAccessor;
    let textLabels;
    switch (this.config.columnMode) {
      case COLUMN_MODE_GEOJSON: {
        valueAccessor = (dc: DataContainerInterface, f, fieldIndex: number) => {
          return dc.valueAt(f.properties.index, fieldIndex);
        };
        const textLabelAccessor = tl => dc => {
          const {field} = tl;
          if (!field) {
            return f => '';
          }
          return f => getSingleTextLabelValue({field, format: ''}, {index: f.properties.index});
        };
        textLabels = formatTextLabelData({
          textLabel,
          triggerChanged,
          oldLayerData,
          data,
          dataContainer,
          textLabelAccessor
        });
        break;
      }
      case COLUMN_MODE_TABLE:
        valueAccessor = this._getColumnModeValueAccessor;
        textLabels = this._formatTableColumnModeTextLabelData(textLabel, fields);
        break;
      default:
        throw new Error(`Unsupported column mode: ${this.config.columnMode}`);
    }
    const indexAccessor = f => f.properties.index;
    const dataAccessor = dc => d => ({index: d.properties.index});
    const accessors = this.getAttributeAccessors({dataAccessor, dataContainer});
    const getFilterValue = gpuFilter.filterValueAccessor(dataContainer)(
      indexAccessor,
      valueAccessor
    );

    return {
      data,
      getFilterValue,
      getPath: d => d.geometry.coordinates,
      getTimestamps: d => this.dataToTimeStamp[d.properties.index],
      textLabels,
      ...accessors
    };
  }

  updateAnimationDomain(domain) {
    this.updateLayerConfig({
      animation: {
        ...this.config.animation,
        domain
      }
    });
  }

  updateLayerMeta(dataset: KeplerTable) {
    const {dataContainer} = dataset;
    let getFeature;
    if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
      getFeature = this.getPositionAccessor(dataContainer);
      if (getFeature === this.meta.getFeature) {
        // TODO: revisit this after gpu filtering
        return;
      }
      this.dataToFeature = getGeojsonDataMaps(dataContainer, getFeature);
    } else {
      this.dataContainer = dataContainer;
      this.dataToFeature = groupColumnsAsGeoJson(dataContainer, this.config.columns, 'timestamp');
    }

    const {dataToTimeStamp, animationDomain} = parseTripGeoJsonTimestamp(this.dataToFeature);

    this.dataToTimeStamp = dataToTimeStamp;
    this.updateAnimationDomain(animationDomain);

    // get bounds from features
    const bounds = getGeojsonBounds(this.dataToFeature);

    // keep a record of what type of geometry the collection has
    const featureTypes = getGeojsonFeatureTypes(this.dataToFeature);

    this.updateMeta({bounds, featureTypes, getFeature});
  }

  setInitialLayerConfig(dataset) {
    const {dataContainer} = dataset;
    if (!dataContainer.numRows()) {
      return this;
    }

    // defefaultLayerProps will automatically find geojson column
    // if not found, we try to set it to id / lat /lng /ts
    if (!this.config.columns.geojson.value) {
      // find columns from lat, lng, id, and ts
      const columnConfig = detectTableColumns(dataset, this.config.columns);
      if (columnConfig) {
        this.updateLayerConfig({
          ...columnConfig,
          columnMode: COLUMN_MODE_TABLE
        });
      } else {
        return this;
      }
    }

    this.updateLayerMeta(dataset);
    return this;
  }

  // eslint-disable-next-line complexity
  renderLayer(opts) {
    const {data, gpuFilter, mapState, animationConfig} = opts;
    const {visConfig} = this.config;
    const zoomFactor = this.getZoomFactor(mapState);
    const isValidTime =
      animationConfig &&
      Array.isArray(animationConfig.domain) &&
      animationConfig.domain.every(Number.isFinite) &&
      Number.isFinite(animationConfig.currentTime);

    const {
      rollField,
      pitchField,
      yawField,
      visConfig: {
        sizeScale = SCENEGRAPH_DEFAULT_SIZE_SCALE,
        adjustRoll = 0,
        adjustPitch = 0,
        adjustYaw = 0,
        invertRoll,
        invertPitch,
        invertYaw
      }
    } = this.config;

    if (!isValidTime) {
      return [];
    }

    const domain0 = animationConfig.domain?.[0];

    const gpuFilterUpdateTriggers = {getFilterValue: gpuFilter.filterValueUpdateTriggers};
    const updateTriggers = {
      ...this.getVisualChannelUpdateTriggers(),
      getTimestamps: {
        columns: this.config.columns,
        domain0
      },
      ...gpuFilterUpdateTriggers
    };
    const baseLayerProps = this.getDefaultDeckLayerProps(opts);

    const billboardWidthFactor = visConfig.billboard ? PROJECTED_PIXEL_SIZE_MULTIPLIER : 1;

    const layerProps = {
      ...baseLayerProps,
      ...data,
      getTimestamps: d => (data.getTimestamps(d) || []).map(ts => ts - domain0),
      widthScale: visConfig.thickness * zoomFactor * zoomFactorValue * billboardWidthFactor,
      capRounded: true,
      jointRounded: true,
      wrapLongitude: false,
      parameters: {
        depthTest: mapState.dragRotate,
        depthMask: false
      },
      trailLength: visConfig.trailLength * 1000,
      fadeTrail: visConfig.fadeTrail,
      billboard: visConfig.billboard,
      currentTime: animationConfig.currentTime - domain0,
      updateTriggers,
      id: `${baseLayerProps.id}${mapState.globe?.enabled ? '-globe' : ''}`
    };

    const getPixelOffset = getTextOffsetByRadius(10, () => 1, mapState);
    const getPosition = f => {
      const {coords} = this._findDatumForFeatureByTime(f.properties.index, animationConfig);
      if (!coords) {
        return [0, 0, -Number.MAX_VALUE];
      }
      return coords;
    };

    const layers: any[] = [new DeckGLTripsLayer(layerProps)];
    const scenegraph = this._getScenegraph();
    if (scenegraph?.url) {
      layers.push(
        new DeckScenegraphLayer({
          ...baseLayerProps,
          id: `${layerProps.id}-scenegraph`,
          ...data,
          opacity: 1.0,
          fetch: fetchGltf,
          scenegraph: scenegraph.url,
          getColor: this._getColorGetter(data, animationConfig),
          getPosition,
          getTranslation: SCENEGRAPH_DEFAULT_TRANSITION,
          getTransformMatrix: this._getTransformMatrixGetter(animationConfig),
          _lighting: 'pbr',
          _animations: {
            '*': {speed: 5}
          },
          parameters: {depthTest: true, blend: false},
          updateTriggers: {
            getTransformMatrix: {
              ...this.config.columns,
              currentTime: animationConfig.currentTime,
              rollField,
              pitchField,
              yawField,
              adjustRoll,
              adjustPitch,
              adjustYaw,
              sizeScale,
              url: scenegraph.url,
              scale: scenegraph.scale,
              invertRoll,
              invertPitch,
              invertYaw
            },
            getColor: {
              url: scenegraph.url,
              scenegraphColor: visConfig.scenegraphColor,
              scenegraphColorEnabled: visConfig.scenegraphColorEnabled,
              scenegraphUseTrailColor: visConfig.scenegraphUseTrailColor,
              ...(visConfig.scenegraphUseTrailColor
                ? {
                    ...layerProps.updateTriggers.getColor,
                    currentTime: animationConfig.currentTime
                  }
                : {})
            },
            getPosition: {...this.config.columns, currentTime: animationConfig.currentTime},
            getFilterValue: gpuFilter.filterValueUpdateTriggers
          }
        })
      );
    }

    const hasTextLabels = this.config.textLabel.some(tl => tl.field);
    if (hasTextLabels) {
      layers.push(
        ...this.renderTextLabelLayer(
          {
            getPosition,
            getPixelOffset,
            animationConfig,
            updateTriggers: {
              getPosition: {
                columns: this.config.columns,
                currentTime: animationConfig.currentTime
              },
              getText: {
                currentTime: animationConfig.currentTime
              }
            },
            sharedProps: null
          },
          opts
        )
      );
    }
    return layers;
  }

  _getScenegraph() {
    const {visConfig} = this.config;
    const scenegraph = visConfig.scenegraphEnabled
      ? TRIP_LAYER_SCENEGRAPH_MODELS.find(d => d.id === visConfig.scenegraph)
      : null;
    if (!scenegraph) return null;
    if (scenegraph.id === CUSTOM_SCENEGRAPH_MODEL_ID) {
      return {...scenegraph, url: visConfig.scenegraphCustomModelUrl};
    }
    return scenegraph;
  }

  _getTransformMatrixGetter(animationConfig: AnimationConfig) {
    const scenegraph = this._getScenegraph();
    const {
      visConfig: {adjustRoll = 0, adjustPitch = 0, adjustYaw = 0, sizeScale = 1}
    } = this.config;

    const q = toQuaternion(adjustRoll, -adjustPitch, -adjustYaw);
    if (scenegraph) {
      // @ts-ignore
      q.multiply(toQuaternion(...scenegraph.angles));
    }

    return feature => {
      const dataForTime = this._findDatumForFeatureByTime(
        feature.properties.index,
        animationConfig
      );
      const {idx} = dataForTime;
      const {coordinates} = feature.geometry;
      let roll = 0;
      let pitch = 0;
      let yaw = 0;
      if (idx >= 0) {
        roll = this._getRoll(dataForTime);
        pitch = this._getPitch(dataForTime);
        yaw = this._getYaw(dataForTime, coordinates);
      }

      const q2 = toQuaternion(roll, -pitch, yaw);
      // @ts-ignore
      q2.multiply(q);

      return new Matrix4()
        .fromQuaternion(q2)
        .scale((scenegraph ? scenegraph.scale : 1) * Math.pow(2, sizeScale));
    };
  }

  _getRoll(dataForTime: DatumForFeatureByTime) {
    const {
      rollField,
      visConfig: {invertRoll}
    } = this.config;
    let roll = 0;
    const {prevDatum, datum, advancement} = dataForTime;
    if (rollField) {
      const {fieldIdx} = rollField;
      if (prevDatum) {
        roll = interpolateAngle(prevDatum[fieldIdx], datum?.[fieldIdx] ?? 0, advancement);
      } else if (datum) {
        roll = datum[fieldIdx];
      }
    }
    return roll * (rollField && invertRoll ? -1 : 1);
  }

  _getPitch(dataForTime: DatumForFeatureByTime) {
    const {
      pitchField,
      visConfig: {invertPitch}
    } = this.config;
    const {datum, prevDatum, advancement} = dataForTime;
    let pitch = 0;
    if (pitchField) {
      const {fieldIdx} = pitchField;
      if (prevDatum) {
        pitch = interpolateAngle(prevDatum[fieldIdx], datum?.[fieldIdx] ?? 0, advancement);
      } else if (datum) {
        pitch = datum[fieldIdx];
      }
    }
    return pitch * (pitchField && invertPitch ? -1 : 1);
  }

  // eslint-disable-next-line complexity
  _getYaw(dataForTime: DatumForFeatureByTime, coordinates) {
    const {
      yawField,
      visConfig: {invertYaw}
    } = this.config;
    const {idx, datum, prevDatum, advancement} = dataForTime;
    let yaw = 0;
    let nextYaw;
    let prevYaw;
    if (yawField) {
      const {fieldIdx} = yawField;
      prevYaw = 90 - (invertYaw ? -1 : 1) * prevDatum?.[fieldIdx];
      nextYaw = 90 - (invertYaw ? -1 : 1) * (datum?.[fieldIdx] ?? 0);
    } else if (coordinates && coordinates.length >= 2) {
      prevYaw = idx > 1 ? getYawFromSpeedVector(coordinates[idx - 2], coordinates[idx - 1]) : 0;
      nextYaw = getYawFromSpeedVector(coordinates[idx - 1], coordinates[idx]);
    }
    if (idx > 1) {
      yaw = interpolateAngle(prevYaw ?? 0, nextYaw ?? 0, advancement);
    } else if (idx > 0) {
      yaw = nextYaw ?? 0;
    }
    return yaw;
  }

  _getColorGetter(data, animationConfig) {
    const {visConfig} = this.config;
    if (visConfig.scenegraphColorEnabled) {
      if (visConfig.scenegraphUseTrailColor) {
        switch (this.config.columnMode) {
          case COLUMN_MODE_GEOJSON:
            return feature => data.getColor(feature);
          case COLUMN_MODE_TABLE:
            return feature => {
              const colors = data.getColor(feature);
              if (this.config.colorField) {
                const {idx} = this._findDatumForFeatureByTime(
                  feature.properties.index,
                  animationConfig
                );
                return idx >= 0 ? colors[idx] : SCENEGRAPH_DEFAULT_COLOR;
              }
              return colors;
            };
          default:
          // fall through
        }
      } else if (visConfig.scenegraphColor) {
        return visConfig.scenegraphColor;
      }
    }
    return SCENEGRAPH_DEFAULT_COLOR;
  }

  private _findDatumForFeatureByTime(
    featureIndex: number,
    animationConfig: AnimationConfig,
    interpolateCoords: boolean = true
  ): DatumForFeatureByTime {
    const {currentTime} = animationConfig ?? {};
    if (notNullorUndefined(currentTime)) {
      const object = this.dataToFeature[featureIndex];
      const timestamps = this.dataToTimeStamp[featureIndex];
      let idx = bisectRight(timestamps, currentTime);
      // @ts-expect-error type geometry?
      const coordinates = object?.geometry?.coordinates;
      if (!coordinates) {
        return {idx: -1, coords: null, datum: null, prevDatum: null, advancement: 0};
      }
      if (idx >= coordinates.length) idx = coordinates.length - 1;
      if (
        timestamps[0] <= currentTime &&
        currentTime <= timestamps[timestamps.length - 1]
      ) {
        const datum = coordinates[idx]?.datum;
        let coords = coordinates[idx].slice(0, 3);
        const prevCoords = idx > 0 ? coordinates[idx - 1].slice(0, 3) : null;
        const timeDiff = idx > 0 ? timestamps[idx] - timestamps[idx - 1] : 0;
        const advancement = idx > 0 ? (currentTime - timestamps[idx - 1]) / timeDiff : 0;

        if (interpolateCoords) {
          coords = interpolateArray(prevCoords, coords)(advancement);
        }

        return {
          idx,
          coords,
          datum,
          advancement,
          prevDatum: idx > 0 ? coordinates[idx - 1]?.datum : null
        };
      }
    }

    return {
      idx: -1,
      coords: null,
      advancement: null,
      prevDatum: null,
      datum: null
    };
  }

  getDeckRenderCallbackData(animationConfig: AnimationConfig) {
    if (!animationConfig) {
      return null;
    }
    const data: {
      position: any;
      orientation: {roll: number; pitch: number; yaw: number};
      keyframes: {startDatum: any; endDatum: any; factor: number};
    }[] = [];
    for (let i = 0; i < this.dataToFeature.length; i++) {
      const df = this._findDatumForFeatureByTime(i, animationConfig, true);
      const feature = this.dataToFeature[i];
      data.push({
        position: df.coords,
        orientation: {
          roll: this._getRoll(df),
          pitch: this._getPitch(df),
          // @ts-expect-error BinaryFeatureCollection
          yaw: this._getYaw(df, feature?.geometry?.coordinates)
        },
        keyframes: {
          startDatum: df.prevDatum,
          endDatum: df.datum,
          factor: df.advancement
        }
      });
    }
    return {
      currentTime: animationConfig.currentTime,
      data
    };
  }
}

function toQuaternion(roll: number, pitch: number, yaw: number): Quaternion {
  return new Quaternion()
    .rotateZ(degreesToRadians(yaw))
    .rotateY(degreesToRadians(pitch))
    .rotateX(degreesToRadians(roll));
}

function getYawFromSpeedVector(prevPoint: number[], nextPoint: number[]) {
  if (!prevPoint || !nextPoint) return 0;
  const p1 = lngLatToWorld(prevPoint);
  const p2 = lngLatToWorld(nextPoint);
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  return radiansToDegrees(Math.atan2(dy, dx));
}

function radiansToDegrees(x: number) {
  return (x * 180) / Math.PI;
}

function degreesToRadians(x: number) {
  return (x * Math.PI) / 180;
}

function interpolateAngle(a: number, b: number, advancement: number) {
  if (a - b > 180) b += 360;
  else if (b - a > 180) a += 360;
  return a + (b - a) * advancement;
}
