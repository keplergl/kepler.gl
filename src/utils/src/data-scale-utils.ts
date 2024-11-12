// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ALL_FIELD_TYPES, ColorMap, ColorRange, SCALE_FUNC, SCALE_TYPES} from '@kepler.gl/constants';
import {Layer, VisualChannel, VisualChannelDomain} from '@kepler.gl/layers';
import {HexColor, MapState} from '@kepler.gl/types';
import {bisectLeft, quantileSorted as d3Quantile, extent} from 'd3-array';
import moment from 'moment';
import {isRgbColor, rgbToHex} from './color-utils';
import {DataContainerInterface} from './data-container-interface';
import {formatNumber, notNullorUndefined, reverseFormatNumber, unique} from './data-utils';
import {getTimeWidgetHintFormatter} from './filter-utils';
import {isPlainObject} from './utils';

export type ColorBreak = {
  data: HexColor;
  label: string;
  range: number[];
  inputs: number[];
};
export type ColorBreakOrdinal = {
  data: HexColor;
  label: string;
};

export type D3ScaleFunction = Record<string, any> & ((x: any) => any);

export type LabelFormat = (n: number) => string;
type dataValueAccessor = <T>(param: T) => T;
type dataContainerValueAccessor = (d: {index: number}, dc: DataContainerInterface) => any;
type sort = (a: any, b: any) => any;
/**
 * return quantile domain for an array of data
 */
export function getQuantileDomain(
  data: any[],
  valueAccessor?: dataValueAccessor,
  sortFunc?: sort
): number[] {
  const values = typeof valueAccessor === 'function' ? data.map(valueAccessor) : data;

  return values.filter(notNullorUndefined).sort(sortFunc);
}

/**
 * return ordinal domain for a data container
 */
export function getOrdinalDomain(
  dataContainer: DataContainerInterface,
  valueAccessor: dataContainerValueAccessor
): string[] {
  const values = dataContainer.mapIndex(valueAccessor);

  return unique(values).filter(notNullorUndefined).sort();
}

/**
 * return linear domain for an array of data
 */
export function getLinearDomain(
  data: number[],
  valueAccessor?: dataValueAccessor
): [number, number] {
  const range = typeof valueAccessor === 'function' ? extent(data, valueAccessor) : extent(data);
  return range.map((d: undefined | number, i: number) => (d === undefined ? i : d)) as [
    number,
    number
  ];
}

/**
 * return linear domain for an array of data. A log scale domain cannot contain 0
 */
export function getLogDomain(data: any[], valueAccessor: dataValueAccessor): [number, number] {
  const [d0, d1] = getLinearDomain(data, valueAccessor);
  return [d0 === 0 ? 1e-5 : d0, d1];
}

/**
 * whether field domain is stops
 */
export function isDomainStops(domain: any): boolean {
  return isPlainObject(domain) && Array.isArray(domain.stops) && Array.isArray(domain.z);
}

/**
 * whether field domain is quantiles
 */
export function isDomainQuantile(domain: any): boolean {
  return isPlainObject(domain) && Array.isArray(domain.quantiles) && Array.isArray(domain.z);
}

/**
 * get the domain at zoom
 * @type {typeof import('./data-scale-utils').getThresholdsFromQuantiles}
 */
export function getThresholdsFromQuantiles(
  quantiles: number[],
  buckets: number
): (number | undefined)[] {
  const thresholds = [];
  if (!Number.isFinite(buckets) || buckets < 1) {
    return [quantiles[0], quantiles[quantiles.length - 1]];
  }
  for (let i = 1; i < buckets; i++) {
    // position in sorted array
    const position = i / buckets;
    // @ts-ignore
    thresholds.push(d3Quantile(quantiles, position));
  }

  return thresholds;
}

/**
 * get the domain at zoom
 * @type {typeof import('./data-scale-utils').getDomainStepsbyZoom}
 */
export function getDomainStepsbyZoom(domain: any[], steps: number[], z: number): any {
  const i = bisectLeft(steps, z);

  if (i === 0) {
    return domain[0];
  }
  return domain[i - 1];
}

/**
 * Get d3 scale function
 * @type {typeof import('./data-scale-utils').getScaleFunction}
 */
export function getScaleFunction(
  scale: string,
  range: any[] | IterableIterator<any>,
  domain: (number | undefined)[] | string[] | IterableIterator<any>,
  fixed?: boolean
): D3ScaleFunction {
  const scaleFunction = SCALE_FUNC[fixed ? 'linear' : scale]()
    .domain(domain)
    .range(fixed ? domain : range);
  scaleFunction.scaleType = fixed ? 'linear' : scale;
  return scaleFunction;
}

/**
 * Get threshold scale color labels
 */
function getThresholdLabels(
  scale: D3ScaleFunction,
  labelFormat: LabelFormat
): Omit<ColorBreak, 'data'>[] {
  const genLength = scale.range().length;
  return scale.range().map((d, i) => {
    const invert = scale.invertExtent(d);
    const inputs = [
      i === 0 ? null : reverseFormatNumber(labelFormat(invert[0])),
      i === genLength - 1 ? null : reverseFormatNumber(labelFormat(invert[1]))
    ];
    return {
      // raw value
      range: invert,
      // formatted value
      inputs,
      label:
        i === 0
          ? `Less than ${labelFormat(invert[1])}`
          : i === genLength - 1
          ? `${labelFormat(invert[0])} or more`
          : `${labelFormat(invert[0])} to ${labelFormat(invert[1])}`
    };
  });
}

/**
 * Get linear / quant scale color labels
 */
function getScaleLabels(
  scale: D3ScaleFunction,
  labelFormat: LabelFormat
): Omit<ColorBreak, 'data'>[] {
  return scale.range().map((d, i) => {
    // @ts-ignore
    const invert = scale.invertExtent(d);
    const inputs = [
      reverseFormatNumber(labelFormat(invert[0])),
      reverseFormatNumber(labelFormat(invert[1]))
    ];

    return {
      label: `${labelFormat(invert[0])} to ${labelFormat(invert[1])}`,
      // raw value
      range: invert,
      // formatted value
      inputs
    };
  });
}

/**
 * Get linear / quant scale color breaks
 */
export function getQuantLegends(scale: D3ScaleFunction, labelFormat: LabelFormat): ColorBreak[] {
  if (typeof scale.invertExtent !== 'function') {
    return [];
  }
  const labels =
    scale.scaleType === 'threshold' || scale.scaleType === 'custom'
      ? getThresholdLabels(scale, labelFormat)
      : getScaleLabels(scale, labelFormat);

  const data = scale.range();

  return labels.map((label, index) => ({
    data: Array.isArray(data[index]) ? rgbToHex(data[index]) : data[index],
    ...label
  }));
}

/**
 * Get ordinal color scale legends
 */
export function getOrdinalLegends(scale: D3ScaleFunction): ColorBreakOrdinal[] {
  const domain = scale.domain();
  const labels = scale.domain();
  const data = domain.map(scale);

  return data.map((datum, index) => ({
    data: isRgbColor(datum) ? rgbToHex(datum) : datum,
    label: labels[index]
  }));
}

const defaultFormat = d => d;

const getTimeLabelFormat = domain => {
  const formatter = getTimeWidgetHintFormatter(domain);
  return val => moment.utc(val).format(formatter);
};

export function getQuantLabelFormat(domain, fieldType) {
  // quant scale can only be assigned to linear Fields: real, timestamp, integer
  return fieldType === ALL_FIELD_TYPES.timestamp
    ? getTimeLabelFormat(domain)
    : !fieldType
    ? defaultFormat
    : n => formatNumber(n, fieldType);
}

/**
 * Get legends for scale
 */
export function getLegendOfScale({
  scale,
  scaleType,
  labelFormat,
  fieldType
}: {
  scale?: D3ScaleFunction | null;
  scaleType: string;
  labelFormat?: LabelFormat;
  fieldType: string | null | undefined;
}): ColorBreak[] | ColorBreakOrdinal[] {
  if (!scale || scale.byZoom) {
    return [];
  }
  if (scaleType === SCALE_TYPES.ordinal) {
    return getOrdinalLegends(scale);
  }

  const formatLabel = labelFormat || getQuantLabelFormat(scale.domain(), fieldType);

  return getQuantLegends(scale, formatLabel);
}

/**
 * Get color scale function
 */
export function getLayerColorScale({
  range,
  domain,
  scaleType,
  layer
}: {
  range: ColorRange | null | undefined;
  domain: VisualChannelDomain;
  scaleType: string;
  layer: Layer;
  isFixed?: boolean;
}): D3ScaleFunction | null {
  if (range && domain && scaleType) {
    return layer.getColorScale(scaleType, domain, range);
  }
  return null;
}

/**
 * Convert colorRange.colorMap into color breaks UI input
 */
export function initializeLayerColorMap(layer: Layer, visualChannel: VisualChannel): ColorMap {
  const domain = layer.config[visualChannel.domain];
  const range = layer.config.visConfig[visualChannel.range];
  const scaleType = layer.config[visualChannel.scale];
  const field = layer.config[visualChannel.field];

  const scale = getLayerColorScale({
    range,
    domain,
    scaleType,
    layer
  });

  const colorBreaks = getLegendOfScale({scale, scaleType, fieldType: field.type});

  return colorBreaksToColorMap(colorBreaks);
}

/**
 * Get visual chanel scale function if it's based on zoom
 */
export function getVisualChannelScaleByZoom({
  scale,
  layer,
  mapState
}: {
  scale: D3ScaleFunction | null;
  layer: Layer;
  mapState?: MapState;
}): D3ScaleFunction | null {
  if (scale?.byZoom) {
    const z = layer.meta?.getZoom ? layer.meta.getZoom(mapState) : mapState?.zoom;
    scale = Number.isFinite(z) ? scale(z) : null;
  }
  return scale;
}

/**
 * Convert color breaks UI input into colorRange.colorMap
 */
export function colorBreaksToColorMap(colorBreaks: ColorBreak[] | ColorBreakOrdinal[]): ColorMap {
  const colorMap = colorBreaks.map(colorBreak => {
    // [value, hex]
    return [colorBreak.inputs ? colorBreak.inputs[1] : colorBreak.label, colorBreak.data];
  });

  // @ts-ignore tuple
  return colorMap;
}

/**
 * Convert colorRange.colorMap into color breaks UI input
 * @type {typeof import('./data-scale-utils').colorMapToColorBreaks}
 */
export function colorMapToColorBreaks(colorMap?: ColorMap, domain?: number[]): ColorBreak[] | null {
  if (!colorMap) {
    return null;
  }
  const colorBreaks = colorMap.map(([value, color], i) => {
    const range =
      i === 0
        ? [domain ? domain[0] : null, value]
        : // last
        i === colorMap.length - 1
        ? [colorMap[i - 1][0], domain ? domain[1] : null]
        : [colorMap[i - 1][0], value];
    return {
      data: color,
      range,
      inputs: range,
      label:
        // first
        i === 0
          ? `Less than ${value}`
          : // last
          i === colorMap.length - 1
          ? `${colorMap[i - 1][0]} or more`
          : `${colorMap[i - 1][0]} to ${value}`
    };
  });

  // @ts-ignore implement conversion for ordinal
  return colorBreaks;
}

/**
 * Whether color breaks is for numeric field
 */
export function isNumericColorBreaks(colorBreaks: unknown): colorBreaks is ColorBreak[] {
  return Array.isArray(colorBreaks) && colorBreaks.length && colorBreaks[0].inputs;
}
