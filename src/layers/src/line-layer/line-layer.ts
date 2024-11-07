// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as arrow from 'apache-arrow';

import {BrushingExtension} from '@deck.gl/extensions';

import {GeoArrowArcLayer} from '@kepler.gl/deckgl-arrow-layers';
import {FilterArrowExtension} from '@kepler.gl/deckgl-layers';
import {EnhancedLineLayer} from '@kepler.gl/deckgl-layers';
import LineLayerIcon from './line-layer-icon';
import ArcLayer, {ArcLayerConfig} from '../arc-layer/arc-layer';
import {LAYER_VIS_CONFIGS, ColorRange, PROJECTED_PIXEL_SIZE_MULTIPLIER} from '@kepler.gl/constants';
import {
  Merge,
  RGBColor,
  VisConfigColorRange,
  VisConfigColorSelect,
  VisConfigNumber,
  VisConfigRange,
  LayerColumn
} from '@kepler.gl/types';
import {default as KeplerTable} from '@kepler.gl/table';
import {DataContainerInterface} from '@kepler.gl/utils';

export type LineLayerVisConfigSettings = {
  opacity: VisConfigNumber;
  thickness: VisConfigNumber;
  colorRange: VisConfigColorRange;
  sizeRange: VisConfigRange;
  targetColor: VisConfigColorSelect;
  elevationScale: VisConfigNumber;
};

export type LineLayerColumnsConfig = {
  // COLUMN_MODE_POINTS required columns
  lat0: LayerColumn;
  lng0: LayerColumn;
  lat1: LayerColumn;
  lng1: LayerColumn;
  alt0?: LayerColumn;
  alt1?: LayerColumn;

  // COLUMN_MODE_NEIGHBORS required columns
  lat: LayerColumn;
  lng: LayerColumn;
  alt: LayerColumn;
  neighbors: LayerColumn;

  // COLUMN_MODE_GEOARROW
  geoarrow0: LayerColumn;
  geoarrow1: LayerColumn;
};

export type LineLayerVisConfig = {
  colorRange: ColorRange;
  opacity: number;
  sizeRange: [number, number];
  targetColor: RGBColor;
  thickness: number;
  elevationScale: number;
};

export type LineLayerConfig = Merge<
  ArcLayerConfig,
  {columns: LineLayerColumnsConfig; visConfig: LineLayerVisConfig}
>;

export const lineRequiredColumns: ['lat0', 'lng0', 'lat1', 'lng1'] = [
  'lat0',
  'lng0',
  'lat1',
  'lng1'
];
export const lineOptionalColumns: ['alt0', 'alt1'] = ['alt0', 'alt1'];
export const neighborRequiredColumns = ['lat', 'lng', 'neighbors'];
export const neighborOptionalColumns = ['alt'];
export const geoarrowRequiredColumns = ['geoarrow0', 'geoarrow1'];

export const lineColumnLabels = {
  lat0: 'arc.lat0',
  lng0: 'arc.lng0',
  lat1: 'arc.lat1',
  lng1: 'arc.lng1',
  alt0: 'line.alt0',
  alt1: 'line.alt1'
};

export const lineVisConfigs: {
  opacity: 'opacity';
  thickness: 'thickness';
  colorRange: 'colorRange';
  sizeRange: 'strokeWidthRange';
  targetColor: 'targetColor';
  elevationScale: VisConfigNumber;
} = {
  opacity: 'opacity',
  thickness: 'thickness',
  colorRange: 'colorRange',
  sizeRange: 'strokeWidthRange',
  targetColor: 'targetColor',
  elevationScale: {
    ...LAYER_VIS_CONFIGS.elevationScale,
    defaultValue: 1
  }
};

export const COLUMN_MODE_POINTS = 'points';
export const COLUMN_MODE_NEIGHBORS = 'neighbors';
export const COLUMN_MODE_GEOARROW = 'geoarrow';
const SUPPORTED_COLUMN_MODES = [
  {
    key: COLUMN_MODE_POINTS,
    label: 'Points',
    requiredColumns: lineRequiredColumns,
    optionalColumns: lineOptionalColumns
  },
  {
    key: COLUMN_MODE_NEIGHBORS,
    label: 'Point and Neighbors',
    requiredColumns: neighborRequiredColumns,
    optionalColumns: neighborOptionalColumns
  },
  {
    key: COLUMN_MODE_GEOARROW,
    label: 'Geoarrow Points',
    requiredColumns: geoarrowRequiredColumns
  }
];

const brushingExtension = new BrushingExtension();
const arrowCPUFilterExtension = new FilterArrowExtension();

export const linePosAccessor =
  (
    {
      lat0,
      lng0,
      lat1,
      lng1,
      alt0,
      alt1,
      lat,
      lng,
      alt,
      geoarrow0,
      geoarrow1
    }: LineLayerColumnsConfig,
    columnMode
  ) =>
  (dc: DataContainerInterface) => {
    switch (columnMode) {
      case COLUMN_MODE_GEOARROW:
        return d => {
          const start = dc.valueAt(d.index, geoarrow0.fieldIdx);
          const end = dc.valueAt(d.index, geoarrow1.fieldIdx);
          return [start.get(0), start.get(1), 0, end.get(2), end.get(3), 0];
        };
      case COLUMN_MODE_NEIGHBORS:
        return d => [
          dc.valueAt(d.index, lng.fieldIdx),
          dc.valueAt(d.index, lat.fieldIdx),
          alt?.fieldIdx > -1 ? dc.valueAt(d.index, alt.fieldIdx) : 0
        ];
      default:
        // COLUMN_MODE_POINTS
        return d => [
          dc.valueAt(d.index, lng0.fieldIdx),
          dc.valueAt(d.index, lat0.fieldIdx),
          alt0 && alt0.fieldIdx > -1 ? dc.valueAt(d.index, alt0.fieldIdx) : 0,
          dc.valueAt(d.index, lng1.fieldIdx),
          dc.valueAt(d.index, lat1.fieldIdx),
          alt1 && alt1?.fieldIdx > -1 ? dc.valueAt(d.index, alt1.fieldIdx) : 0
        ];
    }
  };

export default class LineLayer extends ArcLayer {
  declare visConfigSettings: LineLayerVisConfigSettings;
  declare config: LineLayerConfig;

  constructor(props) {
    super(props);

    this.registerVisConfig(lineVisConfigs);
    this.getPositionAccessor = (dataContainer: DataContainerInterface) =>
      linePosAccessor(this.config.columns, this.config.columnMode)(dataContainer);
  }

  get type() {
    return 'line';
  }

  get layerIcon() {
    return LineLayerIcon;
  }

  get columnLabels() {
    return lineColumnLabels;
  }

  get columnPairs() {
    return this.defaultLinkColumnPairs;
  }

  get supportedColumnModes() {
    return SUPPORTED_COLUMN_MODES;
  }

  get visualChannels() {
    const visualChannels = super.visualChannels;
    return {
      ...visualChannels,
      sourceColor: {
        ...visualChannels.sourceColor,
        accessor: 'getColor'
      }
    };
  }

  static findDefaultLayerProps({fields, fieldPairs = []}: KeplerTable): {
    props: {color?: RGBColor; columns: LineLayerColumnsConfig; label: string}[];
  } {
    if (fieldPairs.length < 2) {
      return {props: []};
    }

    const defaultAltColumn = {value: null, fieldIdx: -1, optional: true};
    const props: {columns: LineLayerColumnsConfig; label: string; isVisible: boolean} = {
      // connect the first two point layer with line
      // TODO: fill default columns by parsing supported_column_modes
      columns: {
        lat0: fieldPairs[0].pair.lat,
        lng0: fieldPairs[0].pair.lng,
        alt0: fieldPairs[0].pair.altitude
          ? {...defaultAltColumn, ...fieldPairs[0].pair.altitude}
          : {...defaultAltColumn},
        lat1: fieldPairs[1].pair.lat,
        lng1: fieldPairs[1].pair.lng,
        alt1: fieldPairs[1].pair.altitude
          ? {...defaultAltColumn, ...fieldPairs[1].pair.altitude}
          : {...defaultAltColumn},
        lat: {...defaultAltColumn},
        lng: {...defaultAltColumn},
        alt: {...defaultAltColumn},
        neighbors: {...defaultAltColumn},
        geoarrow0: {...defaultAltColumn},
        geoarrow1: {...defaultAltColumn}
      },
      label: `${fieldPairs[0].defaultName} -> ${fieldPairs[1].defaultName} line`,
      isVisible: false
    };

    return {props: [props]};
  }

  renderLayer(opts) {
    const {data, gpuFilter, objectHovered, interactionConfig, dataset} = opts;

    const layerProps = {
      widthScale: this.config.visConfig.thickness * PROJECTED_PIXEL_SIZE_MULTIPLIER,
      elevationScale: this.config.visConfig.elevationScale
    };

    const updateTriggers = {
      getPosition: this.config.columns,
      getFilterValue: gpuFilter.filterValueUpdateTriggers,
      getFiltered: this.filteredIndexTrigger,
      ...this.getVisualChannelUpdateTriggers()
    };
    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);
    const hoveredObject = this.hasHoveredObject(objectHovered);

    const useArrowLayer = Boolean(this.geoArrowVector0);

    let LineLayerClass: typeof EnhancedLineLayer | typeof GeoArrowArcLayer = EnhancedLineLayer;
    let experimentalPropOverrides: {
      data?: arrow.Table;
      getSourcePosition?: arrow.Vector;
      getTargetPosition?: arrow.Vector;
    } = {};

    if (useArrowLayer) {
      LineLayerClass = GeoArrowArcLayer;
      experimentalPropOverrides = {
        data: dataset.dataContainer.getTable(),
        getSourcePosition: this.geoArrowVector0,
        getTargetPosition: this.geoArrowVector1
      };
    }

    return [
      // base layer
      new LineLayerClass({
        ...defaultLayerProps,
        ...this.getBrushingExtensionProps(interactionConfig, 'source_target'),
        ...data,
        ...experimentalPropOverrides,
        ...layerProps,
        updateTriggers,
        extensions: [
          ...defaultLayerProps.extensions,
          brushingExtension,
          ...(useArrowLayer ? [arrowCPUFilterExtension] : [])
        ],
        _subLayerProps: {
          'geo-arrow-arc-layer': {
            type: EnhancedLineLayer
          }
        }
      }),
      // hover layer
      ...(hoveredObject
        ? [
            new EnhancedLineLayer({
              ...this.getDefaultHoverLayerProps(),
              ...layerProps,
              data: [hoveredObject],
              getColor: this.config.highlightColor,
              getTargetColor: this.config.highlightColor,
              getWidth: data.getWidth
            })
          ]
        : [])
    ];
  }
}
