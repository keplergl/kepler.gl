// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {NO_VALUE_COLOR, SCALE_TYPES} from '@kepler.gl/constants';
import type {Bins, ColorRange, Field, KeplerLayer, VisualChannels} from '@kepler.gl/types';
import {getCategoricalColorMap, getLayerColorScale, getLegendOfScale} from './data-scale-utils';
import {rgbToHex} from './color-utils';

// These layers map one row to one feature's primary color. Trajectories,
// aggregation and tile sources require different membership semantics.
const ROW_COLOR_LAYERS = new Set(['point', 'icon', 'geojson', 'arc', 'line']);
const DISCRETE_SCALES = new Set<string>([
  SCALE_TYPES.ordinal,
  SCALE_TYPES.customOrdinal,
  SCALE_TYPES.quantize,
  SCALE_TYPES.quantile,
  SCALE_TYPES.jenks,
  SCALE_TYPES.threshold,
  SCALE_TYPES.custom
]);
const SCALAR_FIELD_TYPES = new Set([
  'string',
  'boolean',
  'integer',
  'real',
  'date',
  'timestamp',
  'h3'
]);

type HistogramDatasets = Record<string, {fields: Field[]}>;
type LegendItem = {name: string; color: string};

function getLayerHistogramSource(layer: KeplerLayer, dataId: string) {
  const channels = (layer as KeplerLayer & {visualChannels?: VisualChannels})?.visualChannels;
  const channel = channels?.color || channels?.sourceColor;
  const config = layer?.config;
  if (
    !ROW_COLOR_LAYERS.has(layer?.type || '') ||
    !config ||
    config.dataId !== dataId ||
    (layer.type === 'geojson' && config.columnMode === 'table') ||
    !channel ||
    channel.aggregation ||
    (channel.condition && !channel.condition(config))
  ) {
    return null;
  }
  const field = config[channel.field] as Field | undefined;
  const scaleType = config[channel.scale] as string;
  const range = config.visConfig[channel.range] as ColorRange | undefined;
  const domain = config[channel.domain];
  if (!field?.name || !SCALAR_FIELD_TYPES.has(field.type) || !DISCRETE_SCALES.has(scaleType)) {
    return null;
  }
  const scale = getLayerColorScale({
    layer,
    domain,
    range,
    scaleType
  });
  if (
    !scale ||
    scale.byZoom ||
    typeof scale.copy !== 'function' ||
    typeof scale.domain !== 'function' ||
    typeof scale.range !== 'function' ||
    !scale.range().length
  ) {
    return null;
  }
  const nullValue =
    typeof channel.nullValue === 'function' ? channel.nullValue(config) : channel.nullValue;
  return {
    field,
    scaleType,
    range,
    domain,
    scale: scale.copy(),
    nullValue: nullValue ?? NO_VALUE_COLOR
  };
}

/** Whether this layer supplies a discrete, per-row primary color for the selected dataset. */
export function isLayerHistogramSupported(layer: KeplerLayer, dataId: string): boolean {
  return Boolean(getLayerHistogramSource(layer, dataId));
}

function cssColor(value: any): string {
  if (typeof value === 'string') {
    return value.toLowerCase();
  }
  if (Array.isArray(value) && value.length >= 3) {
    return value.length > 3
      ? `rgba(${value[0]}, ${value[1]}, ${value[2]}, ${value[3] / 255})`
      : rgbToHex(value as [number, number, number]).toLowerCase();
  }
  return 'rgba(0, 0, 0, 0)';
}

function legendName(label: unknown): string {
  return Array.isArray(label)
    ? label.length > 5
      ? `${label.length} selected`
      : label.join(', ')
    : label === null || label === undefined
    ? 'No value'
    : String(label);
}

/** Count each bin's rows using the source layer's actual discrete color classes. */
export function getLayerHistogram(
  bins: Bins,
  datasets: HistogramDatasets,
  layer: KeplerLayer
): {bins: Bins; legend: LegendItem[]} | null {
  const dataId = layer?.config?.dataId;
  if (!dataId) return null;
  const source = getLayerHistogramSource(layer, dataId);
  const field = datasets?.[dataId]?.fields.find(item => item.name === source?.field.name);
  const sourceBins = bins?.[dataId];
  if (!source || !field?.valueAccessor || !sourceBins) {
    return null;
  }
  const {scale, scaleType, range, domain, nullValue} = source;
  const ordinal = scaleType === SCALE_TYPES.ordinal || scaleType === SCALE_TYPES.customOrdinal;
  const getValue = (index: number) => field.valueAccessor({index});

  // Ordinary ordinal scales may extend their domain for an unlisted category.
  // Do that on the private scale before assigning stable class IDs.
  if (scaleType === SCALE_TYPES.ordinal) {
    for (const bin of sourceBins) {
      for (const index of bin.indexes) {
        const value = getValue(index);
        if (value !== null && value !== undefined) scale(value);
      }
    }
  }

  const classifier = scale.copy();
  classifier.scaleType = scaleType;
  let classes: LegendItem[];
  if (scaleType === SCALE_TYPES.customOrdinal) {
    const colorMap = range?.colorMap || getCategoricalColorMap(range?.colors || [], domain);
    const classByValue = new Map<unknown, number>();
    classes = [];
    colorMap.forEach(([values, color]) => {
      const valuesByColor = new Map<string, unknown[]>();
      (Array.isArray(values) ? values : [values]).forEach(value => {
        if (value === null || value === undefined) return;
        const actualColor = cssColor(scale(value));
        const members = valuesByColor.get(actualColor) || [];
        members.push(value);
        valuesByColor.set(actualColor, members);
      });
      if (!valuesByColor.size) {
        classes.push({name: legendName(values), color: cssColor(color)});
      }
      // Repeated empty slots are deduplicated by the ordinal domain, which can
      // give members of one configured group different colors in the layer.
      valuesByColor.forEach((members, actualColor) => {
        const index = classes.length;
        members.forEach(value => classByValue.set(value, index));
        classes.push({
          name: legendName(valuesByColor.size === 1 ? values : members),
          color: actualColor
        });
      });
    });
    classifier.range(scale.domain().map(value => classByValue.get(value)));
  } else {
    const scaleDomain = scale.domain();
    const scaleRange = scale.range();
    const count = ordinal ? scaleDomain.length : scaleRange.length;
    classifier.range(Array.from({length: count}, (_, index) => index));
    classes = getLegendOfScale({
      scale: classifier,
      scaleType,
      fieldType: source.field.type
    }).map((item, index) => ({
      name: legendName(item.label),
      color: cssColor(ordinal ? scale(scaleDomain[index]) : scaleRange[index])
    }));
  }
  classifier.unknown?.(undefined);
  const customLabels = new Map(
    Object.entries(range?.colorLegends || {}).map(([color, name]) => [cssColor(color), name])
  );
  classes = classes.map(item => {
    const name = customLabels.get(item.color) ?? item.name;
    // The map legend applies an override only to the first class with that color.
    customLabels.delete(item.color);
    return {...item, name};
  });

  const extraClasses = new Map<string, number>();
  const noValueClass = (value: unknown): number => {
    const mapped = value === null || value === undefined ? null : scale(value);
    const color = cssColor(mapped ?? nullValue);
    const name = mapped === null || mapped === undefined ? 'No value' : 'Unknown';
    const key = `${name}:${color}`;
    if (!extraClasses.has(key)) {
      extraClasses.set(key, classes.length);
      classes.push({name, color});
    }
    return extraClasses.get(key)!;
  };
  const usedClasses = new Set<number>();
  const groupedBins = sourceBins.map(bin => {
    const counts = new Map<number, number>();
    for (const index of bin.indexes) {
      const value = getValue(index);
      const classIndex = value === null || value === undefined ? undefined : classifier(value);
      const id =
        Number.isInteger(classIndex) && classes[classIndex] ? classIndex : noValueClass(value);
      counts.set(id, (counts.get(id) || 0) + 1);
      usedClasses.add(id);
    }
    return {
      ...bin,
      segments: Array.from(counts)
        .sort(([left], [right]) => left - right)
        .map(([id, count]) => ({...classes[id], count}))
    };
  });
  return {
    bins: {...bins, [dataId]: groupedBins},
    legend: classes.filter((_, index) => usedClasses.has(index))
  };
}
