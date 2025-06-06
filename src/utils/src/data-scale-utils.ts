// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {bisectLeft, quantileSorted as d3Quantile, extent} from 'd3-array';
import uniq from 'lodash/uniq';
import moment from 'moment';

import {notNullorUndefined, toArray} from '@kepler.gl/common-utils';
import {ALL_FIELD_TYPES, SCALE_FUNC, SCALE_TYPES, NO_VALUE_COLOR} from '@kepler.gl/constants';
// import {FilterProps, KeplerTable} from '@kepler.gl/layers';
import {
  AggregatedBin,
  ColorMap,
  ColorRange,
  HexColor,
  KeplerLayer as Layer,
  MapState,
  VisualChannel,
  VisualChannelDomain,
  RGBColor,
  RGBAColor,
  ColorUI,
  Field
} from '@kepler.gl/types';

import {isRgbColor, rgbToHex, hexToRgb} from './color-utils';
import {DataContainerInterface} from './data-container-interface';
import {formatNumber, isNumber, reverseFormatNumber, unique} from './data-utils';
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
  label: string | number | string[] | number[] | null;
};

export type D3ScaleFunction = Record<string, any> & ((x: any) => any);

// TODO isolate types - depends on @kepler.gl/layers
type FilterProps = any;
type KeplerTable = any;

export type LabelFormat = (n: number, type?: string) => string;
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

export type DomainStops = {
  stops: number[];
  z: number[];
};

/**
 * whether field domain is stops
 */
export function isDomainStops(domain: unknown): domain is DomainStops {
  return isPlainObject(domain) && Array.isArray(domain.stops) && Array.isArray(domain.z);
}

export type DomainQuantiles = {
  quantiles: number[];
  z: number[];
};

/**
 * whether field domain is quantiles
 */
export function isDomainQuantile(domain: any): domain is DomainQuantiles {
  return isPlainObject(domain) && Array.isArray(domain.quantiles) && Array.isArray(domain.z);
}

/**
 * get the domain at zoom
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
 */
export function getDomainStepsbyZoom(domain: any[], steps: number[], z: number): any {
  const i = bisectLeft(steps, z);

  if (steps[i] === z) {
    // If z is an integer value exactly matching a step, return the corresponding domain
    return domain[i];
  }
  // Otherwise, return the next coarsest domain
  return domain[Math.max(i - 1, 0)];
}

/**
 * Get d3 scale function
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
  return scale.range().map(d => {
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

const customScaleLabelFormat = n => (n ? formatNumber(n, 'real') : 'no value');
/**
 * Get linear / quant scale color breaks
 */
export function getQuantLegends(scale: D3ScaleFunction, labelFormat: LabelFormat): ColorBreak[] {
  if (typeof scale.invertExtent !== 'function') {
    return [];
  }
  const thresholdLabelFormat = (n, type) =>
    n && labelFormat ? labelFormat(n) : n ? formatNumber(n, type) : 'no value';
  const labels =
    scale.scaleType === 'threshold'
      ? getThresholdLabels(scale, thresholdLabelFormat)
      : scale.scaleType === 'custom'
      ? getThresholdLabels(scale, customScaleLabelFormat)
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
    : n => (isNumber(n) ? formatNumber(n, fieldType) : 'no value');
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
  if (
    scaleType === SCALE_TYPES.ordinal ||
    scaleType === SCALE_TYPES.customOrdinal ||
    fieldType === ALL_FIELD_TYPES.string
  ) {
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

  const colorBreaks = getLegendOfScale({
    scale: scale?.byZoom ? scale(0) : scale,
    scaleType,
    fieldType: field.type
  });
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
 * Get categorical colorMap from colors and domain (unique values)
 */
export function getCategoricalColorMap(
  colors: string[],
  domain: (string | number | string[] | number[] | null)[]
): any {
  // colorMap: [string | string[], hexstring]
  const colorToUniqueValues = {};
  const uniqueValues = unique(domain).filter(notNullorUndefined).sort();
  // each unique value assign to a color, the rest unique values assign to last color
  const lastColor = colors[colors.length - 1];
  for (let i = 0; i < uniqueValues.length; ++i) {
    if (i < colors.length) {
      colorToUniqueValues[colors[i]] = uniqueValues[i];
    } else {
      colorToUniqueValues[lastColor] = [
        ...(Array.isArray(colorToUniqueValues[lastColor])
          ? colorToUniqueValues[lastColor]
          : [colorToUniqueValues[lastColor]]),
        uniqueValues[i]
      ];
    }
  }

  const colorMap = colors.map(color => {
    if (color in colorToUniqueValues) {
      return [colorToUniqueValues[color], color];
    }
    return [null, color];
  });

  return colorMap;
}

/**
 * Get categorical colorBreaks from colorMap
 */
export function colorMapToCategoricalColorBreaks(
  colorMap?: ColorMap | null
): ColorBreakOrdinal[] | null {
  if (!colorMap) {
    return null;
  }
  const colorBreaks = colorMap.map(([value, color]) => {
    return {
      data: color,
      label: value
    };
  });

  return colorBreaks;
}

/**
 * create categorical colorMap from colorBreaks
 */
export function colorBreaksToCategoricalColorMap(colorBreaks: ColorBreakOrdinal[]): ColorMap {
  // colorMap: [string | string[], hexstring]
  const colors = uniq(colorBreaks.map(cb => cb.data));
  const values = uniq(colorBreaks.map(cb => cb.label));

  return getCategoricalColorMap(colors, values);
}

/**
 * Convert color breaks UI input into colorRange.colorMap
 */
export function colorBreaksToColorMap(colorBreaks: ColorBreak[] | ColorBreakOrdinal[]): ColorMap {
  const colorMap = colorBreaks.map((colorBreak, i) => {
    // [value, hex]
    return [
      colorBreak.inputs
        ? i === colorBreaks.length - 1
          ? null // last
          : colorBreak.inputs[1]
        : colorBreak.label,
      colorBreak.data
    ];
  });

  // @ts-ignore tuple
  return colorMap;
}

/**
 * Convert colorRange.colorMap into color breaks UI input
 */
export function colorMapToColorBreaks(colorMap?: ColorMap | null): ColorBreak[] | null {
  if (!colorMap) {
    return null;
  }
  const colorBreaks = colorMap.map(([value, color], i) => {
    const range =
      i === 0
        ? // first
          [-Infinity, value]
        : // last
        i === colorMap.length - 1
        ? [colorMap[i - 1][0], Infinity]
        : // else
          [colorMap[i - 1][0], value];
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
  return Boolean(Array.isArray(colorBreaks) && colorBreaks.length && colorBreaks[0].inputs);
}

// return domainMin, domainMax, histogramMean
export function getHistogramDomain({
  aggregatedBins,
  columnStats,
  dataset,
  fieldValueAccessor
}: {
  aggregatedBins?: AggregatedBin[];
  columnStats?: FilterProps['columnStats'];
  dataset?: KeplerTable;
  fieldValueAccessor: (idx: unknown) => number;
}) {
  let domainMin = Number.POSITIVE_INFINITY;
  let domainMax = Number.NEGATIVE_INFINITY;
  let nValid = 0;
  let domainSum = 0;

  if (aggregatedBins) {
    Object.values(aggregatedBins).forEach(bin => {
      const val = bin.value;
      if (isNumber(val)) {
        if (val < domainMin) domainMin = val;
        if (val > domainMax) domainMax = val;
        domainSum += val;
        nValid += 1;
      }
    });
  } else {
    if (columnStats && columnStats.quantiles && columnStats.mean) {
      // no need to recalcuate min/max/mean if its already in columnStats
      return [
        columnStats.quantiles[0].value,
        columnStats.quantiles[columnStats.quantiles.length - 1].value,
        columnStats.mean
      ];
    }
    if (dataset && fieldValueAccessor) {
      dataset.allIndexes.forEach(x => {
        const val = fieldValueAccessor(x);
        if (isNumber(val)) {
          if (val < domainMin) domainMin = val;
          if (val > domainMax) domainMax = val;
          domainSum += val;
          nValid += 1;
        }
      });
    }
  }
  const histogramMean = nValid > 0 ? domainSum / nValid : 0;
  return [nValid > 0 ? domainMin : 0, nValid > 0 ? domainMax : 0, histogramMean];
}

export function resetCategoricalColorMapByIndex(colorMap: ColorMap, index: number): any {
  if (!colorMap) {
    return colorMap;
  }
  const newColorMap = colorMap.map((cm, i) => {
    if (i === index) {
      return [null, cm[1]];
    }
    return cm;
  });
  return newColorMap;
}

/**
 * select rest categorical values for a colorMap by its index
 */
export function selectRestCategoricalColorMapByIndex(
  colorMap: ColorMap | null,
  index: number,
  uniqueValues?: number[] | string[]
): ColorMap | undefined | null {
  if (!colorMap || !uniqueValues) {
    return colorMap;
  }

  // find unique values that has not been used in current colorMap
  const uniqValueDict = Object.fromEntries(uniqueValues.map(val => [val, false]));
  colorMap.forEach(cm => {
    toArray(cm[0]).forEach(v => {
      if (v) uniqValueDict[v] = true;
    });
  });
  const rest = Object.keys(uniqValueDict).filter(v => !uniqValueDict[v]);

  // use the not used unique values in the selected color map
  const newColorMap = colorMap.map((cm, i) => {
    if (i === index) {
      return [[...rest, ...toArray(cm[0])], cm[1]];
    }
    return cm;
  }) as ColorMap;

  return newColorMap;
}

/**
 * remove a categorical value from a colorMap by its index
 */
export function removeCategoricalValueFromColorMap(
  colorMap: ColorMap | null | undefined,
  item: number | string,
  index: number
): ColorMap | null | undefined {
  if (!colorMap) {
    return colorMap;
  }
  const newColorMap = colorMap.map((cm, i) => {
    if (i === index) {
      if (!cm[0]) {
        return [null, cm[1]];
      }
      const currentUniqueValues = toArray(cm[0]);
      const updatedUniqueValues = currentUniqueValues.filter(v => v !== item);
      return [updatedUniqueValues, cm[1]];
    }
    return cm;
  }) as ColorMap;

  return newColorMap;
}

/**
 * add categorical values (from multisel dropdown) to a colorMap by its index
 */
export function addCategoricalValuesToColorMap(
  colorMap: ColorMap,
  items: (string | number)[],
  index: number
): ColorMap {
  if (!colorMap) {
    return colorMap;
  }

  const newColorMap = colorMap.map((cm, i) => {
    if (i === index) {
      if (!cm[0]) {
        return [items, cm[1]];
      }
      const currentUniqueValues = toArray(cm[0]);
      const updatedUniqueValues = uniq(currentUniqueValues.concat(items));
      return [updatedUniqueValues, cm[1]];
    }
    // remove value from other colorMap
    const currentUniqueValues = cm[0];
    if (Array.isArray(currentUniqueValues)) {
      const updatedUniqueValues: string[] | number[] = (currentUniqueValues as any[]).filter(
        v => !items.includes(v)
      );
      return [updatedUniqueValues, cm[1]];
    } else if (currentUniqueValues && items.includes(currentUniqueValues)) {
      return [null, cm[1]];
    }

    return cm;
  }) as ColorMap;

  return newColorMap;
}

/**
 * get a color scale func for categorical (custom ordinal) scale
 */
export function getCategoricalColorScale(
  colorDomain: number[] | string[],
  colorRange: ColorRange,
  useRgb = true
): (categoryValue: string | number) => RGBColor | RGBAColor {
  const cMap = colorRange.colorMap
    ? colorRange.colorMap
    : getCategoricalColorMap(colorRange.colors, colorDomain);

  const range: number[][] = [];
  const domain: string[] = [];
  cMap.forEach(cm => {
    if (Array.isArray(cm[0])) {
      cm[0].forEach(val => {
        domain.push(val);
        range.push(useRgb ? hexToRgb(cm[1]) : cm[1]);
      });
    } else {
      domain.push(cm[0]);
      range.push(useRgb ? hexToRgb(cm[1]) : cm[1]);
    }
  });

  const scale = getScaleFunction(SCALE_TYPES.customOrdinal, range, domain, false);
  scale.unknown(NO_VALUE_COLOR);
  return scale as any;
}

/**
 * initialize customPalette by custom scale or customOrdinal scale
 */
export function initCustomPaletteByCustomScale({
  scale,
  field,
  ordinalDomain,
  range,
  colorBreaks
}: {
  scale: string;
  field?: Field;
  ordinalDomain?: number[] | string[];
  range: ColorRange;
  colorBreaks: ColorBreakOrdinal[] | null;
}): ColorUI['customPalette'] {
  const customPaletteName = `color.customPalette.${scale}.${field?.name || 'point-count'}`;
  // reuse range.colorMap if the field and scale not changed
  const reuseColorMap = range.colorMap && range.name === customPaletteName && range.type === scale;
  const colorMap = reuseColorMap
    ? range.colorMap
    : scale === SCALE_TYPES.customOrdinal && ordinalDomain
    ? getCategoricalColorMap(range.colors, ordinalDomain)
    : colorBreaks && isNumericColorBreaks(colorBreaks)
    ? colorBreaksToColorMap(colorBreaks)
    : null;
  const colors = reuseColorMap ? range.colors : colorMap ? colorMap.map(cm => cm[1]) : range.colors;

  // update custom breaks
  const customPalette: ColorUI['customPalette'] = {
    category: 'Custom',
    name: customPaletteName,
    type: scale,
    colorMap,
    colors: colors || []
  };

  return customPalette;
}
