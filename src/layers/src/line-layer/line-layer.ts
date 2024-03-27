// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {BrushingExtension} from '@deck.gl/extensions';

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
  }
];
// const DEFAULT_COLUMN_MODE = COLUMN_MODE_POINTS;

export const linePosAccessor =
  ({lat0, lng0, lat1, lng1, alt0, alt1, lat, lng, alt}: LineLayerColumnsConfig, columnMode) =>
  (dc: DataContainerInterface) => {
    return columnMode === COLUMN_MODE_POINTS
      ? d => [
          dc.valueAt(d.index, lng0.fieldIdx),
          dc.valueAt(d.index, lat0.fieldIdx),
          alt0 && alt0.fieldIdx > -1 ? dc.valueAt(d.index, alt0.fieldIdx) : 0,
          dc.valueAt(d.index, lng1.fieldIdx),
          dc.valueAt(d.index, lat1.fieldIdx),
          alt1 && alt1?.fieldIdx > -1 ? dc.valueAt(d.index, alt1.fieldIdx) : 0
        ]
      : // only return source point if columnMode is COLUMN_MODE_NEIGHBORS
        d => [
          dc.valueAt(d.index, lng.fieldIdx),
          dc.valueAt(d.index, lat.fieldIdx),
          alt?.fieldIdx > -1 ? dc.valueAt(d.index, alt.fieldIdx) : 0
        ];
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

  static findDefaultLayerProps({fieldPairs = []}: KeplerTable) {
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
        neighbors: {...defaultAltColumn}
      },
      label: `${fieldPairs[0].defaultName} -> ${fieldPairs[1].defaultName} line`,
      isVisible: false
    };

    return {props: [props]};
  }

  renderLayer(opts) {
    const {data, gpuFilter, objectHovered, interactionConfig} = opts;

    const layerProps = {
      widthScale: this.config.visConfig.thickness * PROJECTED_PIXEL_SIZE_MULTIPLIER,
      elevationScale: this.config.visConfig.elevationScale
    };

    const updateTriggers = {
      getPosition: this.config.columns,
      getFilterValue: gpuFilter.filterValueUpdateTriggers,
      ...this.getVisualChannelUpdateTriggers()
    };
    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);
    const hoveredObject = this.hasHoveredObject(objectHovered);

    return [
      // base layer
      new EnhancedLineLayer({
        ...defaultLayerProps,
        ...this.getBrushingExtensionProps(interactionConfig, 'source_target'),
        ...data,
        ...layerProps,
        updateTriggers,
        extensions: [...defaultLayerProps.extensions, new BrushingExtension()]
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
