// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import Layer, {
  LayerBaseConfig,
  LayerColorConfig,
  LayerSizeConfig,
  LayerBounds,
  LayerBaseConfigPartial
} from '../base-layer';
import {BrushingExtension} from '@deck.gl/extensions';
import {ArcLayer as DeckArcLayer} from '@deck.gl/layers';
import {h3ToGeo} from 'h3-js';

import {hexToRgb, DataContainerInterface} from '@kepler.gl/utils';
import ArcLayerIcon from './arc-layer-icon';
import {
  DEFAULT_LAYER_COLOR,
  ColorRange,
  PROJECTED_PIXEL_SIZE_MULTIPLIER
} from '@kepler.gl/constants';

import {
  RGBColor,
  Merge,
  VisConfigColorRange,
  VisConfigColorSelect,
  VisConfigNumber,
  VisConfigRange,
  LayerColumn
} from '@kepler.gl/types';
import {KeplerTable} from '@kepler.gl/table';

export type ArcLayerVisConfigSettings = {
  opacity: VisConfigNumber;
  thickness: VisConfigNumber;
  colorRange: VisConfigColorRange;
  sizeRange: VisConfigRange;
  targetColor: VisConfigColorSelect;
};

export type ArcLayerColumnsConfig = {
  // COLUMN_MODE_POINTS required columns
  lat0: LayerColumn;
  lat1: LayerColumn;
  lng0: LayerColumn;
  lng1: LayerColumn;

  // COLUMN_MODE_NEIGHBORS required columns
  lat: LayerColumn;
  lng: LayerColumn;
  neighbors: LayerColumn;
};

export type ArcLayerVisConfig = {
  colorRange: ColorRange;
  opacity: number;
  sizeRange: [number, number];
  targetColor: RGBColor;
  thickness: number;
};

export type ArcLayerVisualChannelConfig = LayerColorConfig & LayerSizeConfig;
export type ArcLayerConfig = Merge<
  LayerBaseConfig,
  {columns: ArcLayerColumnsConfig; visConfig: ArcLayerVisConfig}
> &
  ArcLayerVisualChannelConfig;

export type ArcLayerData = {
  index: number;
  sourcePosition: [number, number, number];
  targetPosition: [number, number, number];
};

export type ArcLayerMeta = {
  bounds: LayerBounds;
};

export const arcRequiredColumns = ['lat0', 'lng0', 'lat1', 'lng1'];
export const neighborRequiredColumns = ['lat', 'lng', 'neighbors'];

export const arcColumnLabels = {
  lat0: 'arc.lat0',
  lng0: 'arc.lng0',
  lat1: 'arc.lat1',
  lng1: 'arc.lng1',
  neighbors: 'neighbors'
};

export const arcVisConfigs: {
  opacity: 'opacity';
  thickness: 'thickness';
  colorRange: 'colorRange';
  sizeRange: 'strokeWidthRange';
  targetColor: 'targetColor';
} = {
  opacity: 'opacity',
  thickness: 'thickness',
  colorRange: 'colorRange',
  sizeRange: 'strokeWidthRange',
  targetColor: 'targetColor'
};

export const COLUMN_MODE_POINTS = 'points';
export const COLUMN_MODE_NEIGHBORS = 'neighbors';
const SUPPORTED_COLUMN_MODES = [
  {
    key: COLUMN_MODE_POINTS,
    label: 'Points',
    requiredColumns: arcRequiredColumns
  },
  {
    key: COLUMN_MODE_NEIGHBORS,
    label: 'Point and Neighbors',
    requiredColumns: neighborRequiredColumns
  }
];
const DEFAULT_COLUMN_MODE = COLUMN_MODE_POINTS;

export function getPositionFromHexValue(token) {
  const pos = h3ToGeo(token);

  if (Array.isArray(pos) && pos.every(Number.isFinite)) {
    return [pos[1], pos[0]];
  }
  return null;
}

function maybeHexToGeo(
  dc: DataContainerInterface,
  d: {index: number},
  lat: LayerColumn,
  lng: LayerColumn
) {
  // lat or lng column could be hex column
  // we assume string value is hex and try to convert it to geo lat lng
  const latVal = dc.valueAt(d.index, lat.fieldIdx);
  const lngVal = dc.valueAt(d.index, lng.fieldIdx);

  return typeof latVal === 'string'
    ? getPositionFromHexValue(latVal)
    : typeof lngVal === 'string'
    ? getPositionFromHexValue(lngVal)
    : null;
}

function isOtherFieldString(columns, allFields, key) {
  const field = allFields[columns[key].fieldIdx];
  return field && field.type === 'string';
}
export const arcPosAccessor =
  ({lat0, lng0, lat1, lng1, lat, lng}: ArcLayerColumnsConfig, columnMode) =>
  (dc: DataContainerInterface) => {
    if (columnMode === COLUMN_MODE_POINTS) {
      return d => {
        // lat or lng column could be hex column
        // we assume string value is hex and try to convert it to geo lat lng
        const startPos = maybeHexToGeo(dc, d, lat0, lng0);
        const endPos = maybeHexToGeo(dc, d, lat1, lng1);
        return [
          startPos ? startPos[0] : dc.valueAt(d.index, lng0.fieldIdx),
          startPos ? startPos[1] : dc.valueAt(d.index, lat0.fieldIdx),
          0,
          endPos ? endPos[0] : dc.valueAt(d.index, lng1.fieldIdx),
          endPos ? endPos[1] : dc.valueAt(d.index, lat1.fieldIdx),
          0
        ];
      };
    }
    return d => {
      const startPos = maybeHexToGeo(dc, d, lat, lng);
      // only return source point if columnMode is COLUMN_MODE_NEIGHBORS

      return [
        startPos ? startPos[0] : dc.valueAt(d.index, lng.fieldIdx),
        startPos ? startPos[1] : dc.valueAt(d.index, lat.fieldIdx),
        0
      ];
    };
  };
export default class ArcLayer extends Layer {
  declare visConfigSettings: ArcLayerVisConfigSettings;
  declare config: ArcLayerConfig;
  declare meta: ArcLayerMeta;

  constructor(props) {
    super(props);

    this.registerVisConfig(arcVisConfigs);
    this.getPositionAccessor = (dataContainer: DataContainerInterface) =>
      arcPosAccessor(this.config.columns, this.config.columnMode)(dataContainer);
  }

  get type() {
    return 'arc';
  }

  get isAggregated() {
    return false;
  }

  get layerIcon() {
    return ArcLayerIcon;
  }

  get columnLabels(): Record<string, string> {
    return arcColumnLabels;
  }

  get columnPairs() {
    return this.defaultLinkColumnPairs;
  }

  get supportedColumnModes() {
    return SUPPORTED_COLUMN_MODES;
  }

  get visualChannels() {
    return {
      sourceColor: {
        ...super.visualChannels.color,
        property: 'color',
        key: 'sourceColor',
        accessor: 'getSourceColor',
        defaultValue: config => config.color
      },
      targetColor: {
        ...super.visualChannels.color,
        property: 'targetColor',
        key: 'targetColor',
        accessor: 'getTargetColor',
        defaultValue: config => config.visConfig.targetColor || config.color
      },
      size: {
        ...super.visualChannels.size,
        accessor: 'getWidth',
        property: 'stroke'
      }
    };
  }

  get columnValidators() {
    // if one of the lat or lng column is string type, we allow it
    // will try to pass it as hex
    return {
      lat0: (column, columns, allFields) => isOtherFieldString(columns, allFields, 'lng0'),
      lng0: (column, columns, allFields) => isOtherFieldString(columns, allFields, 'lat0'),
      lat1: (column, columns, allFields) => isOtherFieldString(columns, allFields, 'lng1'),
      lng1: (column, columns, allFields) => isOtherFieldString(columns, allFields, 'lat1'),
      lat: (column, columns, allFields) => isOtherFieldString(columns, allFields, 'lng'),
      lng: (column, columns, allFields) => isOtherFieldString(columns, allFields, 'lat')
    };
  }

  hasAllColumns() {
    const {columns} = this.config;
    if (this.config.columnMode === COLUMN_MODE_POINTS) {
      // TODO - this does not have access to allFields...
      // So we can't do the same validation as for the field errors
      const hasStart = this.hasColumnValue(columns.lat0) || this.hasColumnValue(columns.lng0);
      const hasEnd = this.hasColumnValue(columns.lat1) || this.hasColumnValue(columns.lng1);
      return hasStart && hasEnd;
    }
    const hasStart = this.hasColumnValue(columns.lat) || this.hasColumnValue(columns.lng);
    const hasNeibors = this.hasColumnValue(columns.neighbors);
    return hasStart && hasNeibors;
  }

  static findDefaultLayerProps({fieldPairs = []}: KeplerTable): {
    props: {color?: RGBColor; columns: ArcLayerColumnsConfig; label: string}[];
  } {
    if (fieldPairs.length < 2) {
      return {props: []};
    }

    const props: {
      color: RGBColor;
      columns: ArcLayerColumnsConfig;
      label: string;
    } = {
      color: hexToRgb(DEFAULT_LAYER_COLOR.tripArc),
      // connect the first two point layer with arc
      // @ts-expect-error separate types for point / neighbor columns
      columns: {
        lat0: fieldPairs[0].pair.lat,
        lng0: fieldPairs[0].pair.lng,
        lat1: fieldPairs[1].pair.lat,
        lng1: fieldPairs[1].pair.lng
      },
      label: `${fieldPairs[0].defaultName} -> ${fieldPairs[1].defaultName} arc`
    };

    return {props: [props]};
  }

  getDefaultLayerConfig(props: LayerBaseConfigPartial) {
    const defaultLayerConfig = super.getDefaultLayerConfig(props);

    return {
      ...defaultLayerConfig,
      columnMode: props?.columnMode ?? DEFAULT_COLUMN_MODE
    };
  }

  calculateDataAttributeForPoints(
    {
      dataContainer,
      filteredIndex
    }: {dataContainer: DataContainerInterface; filteredIndex: number[]},
    getPosition
  ) {
    const data: ArcLayerData[] = [];
    for (let i = 0; i < filteredIndex.length; i++) {
      const index = filteredIndex[i];
      const pos = getPosition({index});

      // if doesn't have point lat or lng, do not add the point
      // deck.gl can't handle position = null
      if (pos.every(Number.isFinite)) {
        data.push({
          index,
          sourcePosition: [pos[0], pos[1], pos[2]],
          targetPosition: [pos[3], pos[4], pos[5]]
        });
      }
    }
    return data;
  }

  calculateDataAttributeForPointNNeighbors(
    {
      dataContainer,
      filteredIndex
    }: {dataContainer: DataContainerInterface; filteredIndex: number[]},
    getPosition
  ) {
    const data: {index: number; sourcePosition: number[]; targetPosition: number[]}[] = [];
    for (let i = 0; i < filteredIndex.length; i++) {
      const index = filteredIndex[i];
      const pos = getPosition({index});
      // if doesn't have point lat or lng, do not add the point
      // deck.gl can't handle position = null
      if (pos.every(Number.isFinite)) {
        // push all neibors
        const neighborIdx = this.config.columns.neighbors.value
          ? dataContainer.valueAt(index, this.config.columns.neighbors.fieldIdx)
          : [];
        if (Array.isArray(neighborIdx)) {
          neighborIdx.forEach(idx => {
            // TODO prevent row materialization here
            const tPos = dataContainer.rowAsArray(idx) ? getPosition({index: idx}) : null;
            if (tPos && tPos.every(Number.isFinite)) {
              data.push({
                index,
                sourcePosition: [pos[0], pos[1], pos[2]],
                targetPosition: [tPos[0], tPos[1], tPos[2]]
              });
            }
          });
        }
      }
    }

    return data;
  }

  calculateDataAttribute({dataContainer, filteredIndex}: KeplerTable, getPosition) {
    if (this.config.columnMode === COLUMN_MODE_POINTS) {
      return this.calculateDataAttributeForPoints({dataContainer, filteredIndex}, getPosition);
    }
    return this.calculateDataAttributeForPointNNeighbors(
      {dataContainer, filteredIndex},
      getPosition
    );
  }

  formatLayerData(datasets, oldLayerData) {
    if (this.config.dataId === null) {
      return {};
    }
    const {gpuFilter, dataContainer} = datasets[this.config.dataId];
    const {data} = this.updateData(datasets, oldLayerData);
    const accessors = this.getAttributeAccessors({dataContainer});
    return {
      data,
      getFilterValue: gpuFilter.filterValueAccessor(dataContainer)(),
      ...accessors
    };
  }
  /* eslint-enable complexity */

  updateLayerMeta(dataContainer) {
    // get bounds from arcs
    const getPosition = this.getPositionAccessor(dataContainer);

    const sBounds = this.getPointsBounds(dataContainer, d => {
      const pos = getPosition(d);
      return [pos[0], pos[1]];
    });

    let tBounds: number[] | null = [];
    if (this.config.columnMode === COLUMN_MODE_POINTS) {
      tBounds = this.getPointsBounds(dataContainer, d => {
        const pos = getPosition(d);
        return [pos[3], pos[4]];
      });
    } else {
      // when columnMode is neighbors, it reference the same collection of points
      tBounds = sBounds;
    }

    const bounds =
      tBounds && sBounds
        ? [
            Math.min(sBounds[0], tBounds[0]),
            Math.min(sBounds[1], tBounds[1]),
            Math.max(sBounds[2], tBounds[2]),
            Math.max(sBounds[3], tBounds[3])
          ]
        : sBounds || tBounds;

    this.updateMeta({bounds});
  }

  renderLayer(opts) {
    const {data, gpuFilter, objectHovered, interactionConfig} = opts;
    const updateTriggers = {
      getPosition: this.config.columns,
      getFilterValue: gpuFilter.filterValueUpdateTriggers,
      ...this.getVisualChannelUpdateTriggers()
    };
    const widthScale = this.config.visConfig.thickness * PROJECTED_PIXEL_SIZE_MULTIPLIER;
    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);
    const hoveredObject = this.hasHoveredObject(objectHovered);
    return [
      new DeckArcLayer({
        ...defaultLayerProps,
        ...this.getBrushingExtensionProps(interactionConfig, 'source_target'),
        ...data,
        widthScale,
        updateTriggers,
        extensions: [...defaultLayerProps.extensions, new BrushingExtension()]
      }),
      // hover layer
      ...(hoveredObject
        ? [
            new DeckArcLayer({
              ...this.getDefaultHoverLayerProps(),
              visible: defaultLayerProps.visible,
              data: [hoveredObject],
              widthScale,
              getSourceColor: this.config.highlightColor,
              getTargetColor: this.config.highlightColor,
              getWidth: data.getWidth
            })
          ]
        : [])
    ];
  }
}
