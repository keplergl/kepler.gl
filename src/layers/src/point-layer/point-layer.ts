// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {BrushingExtension} from '@deck.gl/extensions';
import {ScatterplotLayer} from '@deck.gl/layers';

import Layer, {
  LayerBaseConfig,
  LayerBaseConfigPartial,
  LayerColorConfig,
  LayerSizeConfig,
  LayerStrokeColorConfig
} from '../base-layer';
import {hexToRgb, findDefaultColorField, DataContainerInterface} from '@kepler.gl/utils';
import {default as KeplerTable} from '@kepler.gl/table';
import PointLayerIcon from './point-layer-icon';
import {
  LAYER_VIS_CONFIGS,
  DEFAULT_LAYER_COLOR,
  CHANNEL_SCALES,
  ColorRange
} from '@kepler.gl/constants';

import {getTextOffsetByRadius, formatTextLabelData} from '../layer-text-label';
import {assignPointPairToLayerColumn} from '../layer-utils';
import {getGeojsonPointDataMaps, GeojsonPointDataMaps} from '../geojson-layer/geojson-utils';
import {
  Merge,
  RGBColor,
  VisConfigBoolean,
  VisConfigColorRange,
  VisConfigColorSelect,
  VisConfigNumber,
  VisConfigRange,
  LayerColumn
} from '@kepler.gl/types';

export type PointLayerVisConfigSettings = {
  radius: VisConfigNumber;
  fixedRadius: VisConfigBoolean;
  opacity: VisConfigNumber;
  outline: VisConfigBoolean;
  thickness: VisConfigNumber;
  strokeColor: VisConfigColorSelect;
  colorRange: VisConfigColorRange;
  strokeColorRange: VisConfigColorRange;
  radiusRange: VisConfigRange;
  filled: VisConfigBoolean;
};

export type PointLayerColumnsConfig = {
  lat: LayerColumn;
  lng: LayerColumn;
  altitude?: LayerColumn;
  neighbors?: LayerColumn;
  geojson: LayerColumn;
};

export type PointLayerVisConfig = {
  radius: number;
  fixedRadius: boolean;
  opacity: number;
  outline: boolean;
  thickness: number;
  strokeColor: RGBColor;
  colorRange: ColorRange;
  strokeColorRange: ColorRange;
  radiusRange: [number, number];
  filled: boolean;
  allowHover: boolean;
  showNeighborOnHover: boolean;
  showHighlightColor: boolean;
};
export type PointLayerVisualChannelConfig = LayerColorConfig &
  LayerSizeConfig &
  LayerStrokeColorConfig;
export type PointLayerConfig = Merge<
  LayerBaseConfig,
  {columns: PointLayerColumnsConfig; visConfig: PointLayerVisConfig}
> &
  PointLayerVisualChannelConfig;

export type PointLayerData = {
  position: number[];
  index: number;
  neighbors: any[];
};

export const pointPosAccessor =
  ({lat, lng, altitude}: PointLayerColumnsConfig) =>
  (dc: DataContainerInterface) =>
  (d: {index: number}) =>
    [
      dc.valueAt(d.index, lng.fieldIdx),
      dc.valueAt(d.index, lat.fieldIdx),
      altitude && altitude.fieldIdx > -1 ? dc.valueAt(d.index, altitude.fieldIdx) : 0
    ];

export const geojsonPosAccessor =
  ({geojson}: {geojson: LayerColumn}) =>
  d =>
    d[geojson.fieldIdx];

export const COLUMN_MODE_POINTS = 'points';
export const COLUMN_MODE_GEOJSON = 'geojson';

export const pointRequiredColumns: ['lat', 'lng'] = ['lat', 'lng'];
export const pointOptionalColumns: ['altitude', 'neighbors'] = ['altitude', 'neighbors'];
export const geojsonRequiredColumns: ['geojson'] = ['geojson'];

const SUPPORTED_COLUMN_MODES = [
  {
    key: COLUMN_MODE_POINTS,
    label: 'Point Columns',
    requiredColumns: pointRequiredColumns,
    optionalColumns: pointOptionalColumns
  },
  {
    key: COLUMN_MODE_GEOJSON,
    label: 'GeoJSON Feature',
    requiredColumns: geojsonRequiredColumns
  }
];
const DEFAULT_COLUMN_MODE = COLUMN_MODE_POINTS;

const brushingExtension = new BrushingExtension();

function pushPointPosition(data: any[], pos: number[], index: number, neighbors: number[]) {
  if (pos.every(Number.isFinite)) {
    data.push({
      position: pos,
      // index is important for filter
      index,
      ...(neighbors ? {neighbors} : {})
    });
  }
}

export const pointVisConfigs: {
  radius: 'radius';
  fixedRadius: 'fixedRadius';
  opacity: 'opacity';
  outline: 'outline';
  thickness: 'thickness';
  strokeColor: 'strokeColor';
  colorRange: 'colorRange';
  strokeColorRange: 'strokeColorRange';
  radiusRange: 'radiusRange';
  filled: VisConfigBoolean;
  allowHover: 'allowHover';
  showNeighborOnHover: 'showNeighborOnHover';
  showHighlightColor: 'showHighlightColor';
} = {
  radius: 'radius',
  fixedRadius: 'fixedRadius',
  opacity: 'opacity',
  outline: 'outline',
  thickness: 'thickness',
  strokeColor: 'strokeColor',
  colorRange: 'colorRange',
  strokeColorRange: 'strokeColorRange',
  radiusRange: 'radiusRange',
  filled: {
    ...LAYER_VIS_CONFIGS.filled,
    type: 'boolean',
    label: 'layer.fillColor',
    defaultValue: true,
    property: 'filled'
  },
  allowHover: 'allowHover',
  showNeighborOnHover: 'showNeighborOnHover',
  showHighlightColor: 'showHighlightColor'
};

export default class PointLayer extends Layer {
  declare config: PointLayerConfig;
  declare visConfigSettings: PointLayerVisConfigSettings;
  dataToFeature: GeojsonPointDataMaps = [];

  constructor(props) {
    super(props);

    this.registerVisConfig(pointVisConfigs);
    this.getPositionAccessor = (dataContainer: DataContainerInterface) =>
      this.config.columnMode === COLUMN_MODE_POINTS
        ? pointPosAccessor(this.config.columns)(dataContainer)
        : geojsonPosAccessor(this.config.columns);
  }

  get type(): 'point' {
    return 'point';
  }

  get isAggregated(): false {
    return false;
  }

  get layerIcon() {
    return PointLayerIcon;
  }

  get optionalColumns() {
    return pointOptionalColumns;
  }

  get columnPairs() {
    return this.defaultPointColumnPairs;
  }

  get supportedColumnModes() {
    return SUPPORTED_COLUMN_MODES;
  }

  get noneLayerDataAffectingProps() {
    return [...super.noneLayerDataAffectingProps, 'radius'];
  }

  get visualChannels() {
    return {
      color: {
        ...super.visualChannels.color,
        accessor: 'getFillColor',
        condition: config => config.visConfig.filled,
        defaultValue: config => config.color
      },
      strokeColor: {
        property: 'strokeColor',
        key: 'strokeColor',
        field: 'strokeColorField',
        scale: 'strokeColorScale',
        domain: 'strokeColorDomain',
        range: 'strokeColorRange',
        channelScaleType: CHANNEL_SCALES.color,
        accessor: 'getLineColor',
        condition: config => config.visConfig.outline,
        defaultValue: config => config.visConfig.strokeColor || config.color
      },
      size: {
        ...super.visualChannels.size,
        property: 'radius',
        range: 'radiusRange',
        fixed: 'fixedRadius',
        channelScaleType: 'radius',
        accessor: 'getRadius',
        defaultValue: 1
      }
    };
  }

  setInitialLayerConfig(dataset) {
    if (!dataset.dataContainer.numRows()) {
      return this;
    }
    const defaultColorField = findDefaultColorField(dataset);

    if (defaultColorField) {
      this.updateLayerConfig({
        // @ts-expect-error Remove this after updateLayerConfig converted into generic function
        colorField: defaultColorField
      });
      this.updateLayerVisualChannel(dataset, 'color');
    }

    return this;
  }

  static findDefaultLayerProps({fieldPairs = []}: KeplerTable) {
    const props: {
      label: string;
      color?: RGBColor;
      isVisible?: boolean;
      columns?: PointLayerColumnsConfig;
    }[] = [];

    // Make layer for each pair
    fieldPairs.forEach(pair => {
      const latField = pair.pair.lat;

      const prop: {
        label: string;
        color?: RGBColor;
        isVisible?: boolean;
        columns?: PointLayerColumnsConfig;
      } = {
        label: pair.defaultName || 'Point'
      };

      // default layer color for begintrip and dropoff point
      if (latField.value in DEFAULT_LAYER_COLOR) {
        prop.color = hexToRgb(DEFAULT_LAYER_COLOR[latField.value]);
      }

      // set the first layer to be visible
      if (props.length === 0) {
        prop.isVisible = true;
      }
      //@ts-expect-error logically separate geojson column type?
      prop.columns = assignPointPairToLayerColumn(pair, true);

      props.push(prop);
    });

    return {props};
  }

  getDefaultLayerConfig(props: LayerBaseConfigPartial) {
    return {
      ...super.getDefaultLayerConfig(props),
      columnMode: props?.columnMode ?? DEFAULT_COLUMN_MODE,

      // add stroke color visual channel
      strokeColorField: null,
      strokeColorDomain: [0, 1],
      strokeColorScale: 'quantile'
    };
  }

  calculateDataAttribute({filteredIndex, dataContainer}: KeplerTable, getPosition) {
    const data: PointLayerData[] = [];

    for (let i = 0; i < filteredIndex.length; i++) {
      const index = filteredIndex[i];
      let neighbors;

      if (this.config.columnMode === COLUMN_MODE_POINTS) {
        if (this.config.columns.neighbors?.value) {
          const {fieldIdx} = this.config.columns.neighbors;
          neighbors = Array.isArray(dataContainer.valueAt(index, fieldIdx))
            ? dataContainer.valueAt(index, fieldIdx)
            : [];
        }
        const pos = getPosition({index});

        // if doesn't have point lat or lng, do not add the point
        // deck.gl can't handle position = null
        pushPointPosition(data, pos, index, neighbors);
      } else {
        // point from geojson coordinates
        const coordinates = this.dataToFeature[i];
        // if multi points
        if (coordinates && Array.isArray(coordinates[0])) {
          coordinates.forEach(coord => {
            pushPointPosition(data, coord, index, neighbors);
          });
        } else if (coordinates && Number.isFinite(coordinates[0])) {
          pushPointPosition(data, coordinates as number[], index, neighbors);
        }
      }
    }

    return data;
  }

  formatLayerData(datasets, oldLayerData) {
    if (this.config.dataId === null) {
      return {};
    }
    const {textLabel} = this.config;
    const {gpuFilter, dataContainer} = datasets[this.config.dataId];
    const {data, triggerChanged} = this.updateData(datasets, oldLayerData);
    const getPosition = d => d.position;

    // get all distinct characters in the text labels
    const textLabels = formatTextLabelData({
      textLabel,
      triggerChanged,
      oldLayerData,
      data,
      dataContainer
    });

    const accessors = this.getAttributeAccessors({dataContainer});

    return {
      data,
      getPosition,
      getFilterValue: gpuFilter.filterValueAccessor(dataContainer)(),
      textLabels,
      ...accessors
    };
  }
  /* eslint-enable complexity */

  updateLayerMeta(dataContainer) {
    if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
      const getFeature = this.getPositionAccessor();
      this.dataToFeature = getGeojsonPointDataMaps(dataContainer, getFeature);
    } else {
      const getPosition = this.getPositionAccessor(dataContainer);
      const bounds = this.getPointsBounds(dataContainer, getPosition);
      this.updateMeta({bounds});
    }
  }

  // eslint-disable-next-line complexity
  renderLayer(opts) {
    const {data, gpuFilter, objectHovered, mapState, interactionConfig, dataset} = opts;

    // if no field size is defined we need to pass fixed radius = false
    const fixedRadius = this.config.visConfig.fixedRadius && Boolean(this.config.sizeField);
    const radiusScale = this.getRadiusScaleByZoom(mapState, fixedRadius);

    const layerProps = {
      stroked: this.config.visConfig.outline,
      filled: this.config.visConfig.filled,
      lineWidthScale: this.config.visConfig.thickness,
      radiusScale,
      ...(this.config.visConfig.fixedRadius ? {} : {radiusMaxPixels: 500})
    };

    const updateTriggers = {
      getPosition: this.config.columns,
      getFilterValue: gpuFilter.filterValueUpdateTriggers,
      ...this.getVisualChannelUpdateTriggers()
    };

    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);
    const brushingProps = this.getBrushingExtensionProps(interactionConfig);
    const getPixelOffset = getTextOffsetByRadius(radiusScale, data.getRadius, mapState);
    const extensions = [...defaultLayerProps.extensions, brushingExtension];

    const sharedProps = {
      getFilterValue: data.getFilterValue,
      extensions,
      filterRange: defaultLayerProps.filterRange,
      visible: defaultLayerProps.visible,
      ...brushingProps
    };
    const hoveredObject = this.hasHoveredObject(objectHovered);
    const {showNeighborOnHover, allowHover} = this.config.visConfig;
    let neighborsData = [];
    if (allowHover && showNeighborOnHover && hoveredObject) {
      // find neighbor
      neighborsData = (hoveredObject.neighbors || [])
        .map(idx => ({
          // TODO do we really need to pass data here?
          data: dataset.dataContainer.rowAsArray(idx),
          // position: pos,
          // index is important for filter
          index: idx
        }))
        .filter(d => d.data);
    }

    return [
      new ScatterplotLayer({
        ...defaultLayerProps,
        ...brushingProps,
        ...layerProps,
        ...data,
        parameters: {
          // circles will be flat on the map when the altitude column is not used
          depthTest: (this.config.columns.altitude?.fieldIdx as number) > -1
        },
        lineWidthUnits: 'pixels',
        updateTriggers,
        extensions,
        opacity: hoveredObject && showNeighborOnHover ? 0.2 : this.config.visConfig.opacity,
        pickable: allowHover,
        autoHighlight: false
      }),
      // hover layer
      ...(hoveredObject
        ? [
            new ScatterplotLayer({
              ...this.getDefaultHoverLayerProps(),
              ...layerProps,
              visible: defaultLayerProps.visible,
              data: [...neighborsData, hoveredObject],
              getLineColor: this.config.visConfig.showHighlightColor
                ? this.config.highlightColor
                : data.getLineColor,
              getFillColor: this.config.visConfig.showHighlightColor
                ? this.config.highlightColor
                : data.getFillColor,
              getRadius: data.getRadius,
              getPosition: data.getPosition
            })
          ]
        : []),
      // text label layer
      ...this.renderTextLabelLayer(
        {
          getPosition: data.getPosition,
          sharedProps,
          getPixelOffset,
          updateTriggers
        },
        opts
      )
    ];
  }
}
