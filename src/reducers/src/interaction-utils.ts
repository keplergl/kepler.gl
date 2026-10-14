// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  DEFAULT_TOOLTIP_FIELDS,
  ALL_FIELD_TYPES,
  TRIP_POINT_FIELDS,
  TOOLTIP_FORMATS,
  TOOLTIP_KEY,
  COMPARE_TYPES
} from '@kepler.gl/constants';

import {
  Field,
  InteractionConfig,
  TooltipField,
  CompareType,
  ZoomOpacityController,
  ZoomOpacityStops
} from '@kepler.gl/types';
import {parseFieldValue, getFormatter, isNumber, defaultFormatter} from '@kepler.gl/utils';
import {notNullorUndefined} from '@kepler.gl/common-utils';

/**
 * Minus sign used in tooltip formatting.
 * \u2212 or \u002D is the minus sign that d3-format uses for decimal number formatting
 * d3-format 2.0 uses \u002D
 */
export const TOOLTIP_MINUS_SIGN = '\u2212';
// both are posible negative signs
export const NEGATIVE_SIGNS = ['\u002D', '\u2212'];

export const BRUSH_CONFIG: {
  range: [number, number];
} = {
  range: [0, 50]
};

export function findFieldsToShow({
  fields,
  id,
  maxDefaultTooltips
}: {
  fields: Field[];
  id: string;
  maxDefaultTooltips: number;
}): {
  [key: string]: TooltipField[];
} {
  // first find default tooltip fields for trips
  const fieldsToShow = DEFAULT_TOOLTIP_FIELDS.reduce((prev, curr) => {
    if (fields.find(({name}) => curr.name === name)) {
      // @ts-ignore
      prev.push(curr);
    }
    return prev;
  }, []);

  return {
    [id]: fieldsToShow.length ? fieldsToShow : autoFindTooltipFields(fields, maxDefaultTooltips)
  };
}

function autoFindTooltipFields(fields, maxDefaultTooltips) {
  const ptFields = _mergeFieldPairs(TRIP_POINT_FIELDS);
  // filter out the default fields that contains lat and lng and any geometry
  const fieldsToShow = fields.filter(
    ({name, type}) =>
      name
        .replace(/[_,.]+/g, ' ')
        .trim()
        .split(' ')
        .every(seg => !ptFields.includes(seg)) &&
      type !== ALL_FIELD_TYPES.geojson &&
      type !== ALL_FIELD_TYPES.geoarrow &&
      type !== 'object'
  );

  return fieldsToShow.slice(0, maxDefaultTooltips).map(({name, type}) => {
    return {
      name,
      format: getDefaultTooltipFormat(type)
    };
  });
}

function getDefaultTooltipFormat(type?: string): string | null {
  if (type === ALL_FIELD_TYPES.timestamp) {
    return TOOLTIP_FORMATS.DATE_TIME_L_LTS[TOOLTIP_KEY];
  }
  if (type === ALL_FIELD_TYPES.date) {
    return TOOLTIP_FORMATS.DATE_L[TOOLTIP_KEY];
  }
  return null;
}

function _mergeFieldPairs(pairs) {
  return pairs.reduce((prev, pair) => [...prev, ...pair], []);
}

export function getTooltipDisplayDeltaValue({
  field,
  value,
  primaryValue,
  compareType
}: {
  field: Field;
  value: any;
  primaryValue: any;
  compareType?: CompareType;
}): string | null {
  let displayDeltaValue: string | null = null;

  if (
    // comparison mode only works for numeric field
    field.type === ALL_FIELD_TYPES.integer ||
    field.type === ALL_FIELD_TYPES.real
  ) {
    if (isNumber(primaryValue) && isNumber(value)) {
      const deltaValue =
        compareType === COMPARE_TYPES.RELATIVE ? value / primaryValue - 1 : value - primaryValue;
      const deltaFormat =
        compareType === COMPARE_TYPES.RELATIVE
          ? TOOLTIP_FORMATS.DECIMAL_PERCENT_FULL_2[TOOLTIP_KEY]
          : field.displayFormat || TOOLTIP_FORMATS.DECIMAL_DECIMAL_FIXED_3[TOOLTIP_KEY];

      displayDeltaValue = getFormatter(deltaFormat, field)(deltaValue);

      // safely cast string
      displayDeltaValue = defaultFormatter(displayDeltaValue);
      const deltaFirstChar = displayDeltaValue.charAt(0);

      if (deltaFirstChar !== '+' && !NEGATIVE_SIGNS.includes(deltaFirstChar)) {
        displayDeltaValue = `+${displayDeltaValue}`;
      }
    } else {
      displayDeltaValue = TOOLTIP_MINUS_SIGN;
    }
  }

  return displayDeltaValue;
}

export function getTooltipDisplayValue({
  item,
  field,
  value
}: {
  item: TooltipField | undefined;
  field: Field;
  value: any;
}): string {
  if (!notNullorUndefined(value)) {
    return '';
  }

  return item?.format
    ? getFormatter(item?.format, field)(value)
    : field.displayFormat
    ? getFormatter(field.displayFormat, field)(value)
    : parseFieldValue(value, field.type);
}

export const ZOOM_OPACITY_RANGE: [number, number] = [0, 24];

export const DEFAULT_ZOOM_OPACITY_STOPS: ZoomOpacityStops = {
  appear: 1,
  full: 3,
  fade: 8,
  gone: 12
};

const ZOOM_OPACITY_STOP_KEYS = ['appear', 'full', 'fade', 'gone'] as const;

function isOrderedZoomOpacityStops(stops: ZoomOpacityStops | undefined): stops is ZoomOpacityStops {
  if (!stops) {
    return false;
  }
  const {appear, full, fade, gone} = stops;
  return (
    [appear, full, fade, gone].every(
      value => typeof value === 'number' && Number.isFinite(value)
    ) &&
    appear <= full &&
    full <= fade &&
    fade <= gone
  );
}

/**
 * 0–1 multiplier for a layer's opacity at `zoom`.
 * 0 at and outside the envelope, rising from appear to full, holding through fade, then falling to gone.
 * Equal neighbors are a step. Unordered stops leave opacity unchanged.
 */
export function zoomOpacityFactor(zoom: number, stops: ZoomOpacityStops): number {
  if (!isOrderedZoomOpacityStops(stops) || !Number.isFinite(zoom)) {
    return 1;
  }
  const {appear, full, fade, gone} = stops;
  if (zoom <= appear || zoom >= gone) {
    return 0;
  }
  if (zoom < full) {
    const span = full - appear;
    return span <= 0 ? 1 : (zoom - appear) / span;
  }
  if (zoom <= fade) {
    return 1;
  }
  const span = gone - fade;
  return span <= 0 ? 0 : (gone - zoom) / span;
}

/** Envelope multiplier for one layer. 1 when fade-on-zoom is off or the layer is not assigned. */
export function getLayerZoomOpacityFactor(
  layerId: string,
  zoom: number | undefined,
  interactionConfig?: InteractionConfig | null
): number {
  const zoomOpacity = interactionConfig?.zoomOpacity;
  if (!zoomOpacity?.enabled || typeof zoom !== 'number') {
    return 1;
  }
  const controller = zoomOpacity.config?.controllers?.find(item =>
    item.layerIds?.includes(layerId)
  );
  if (!controller) {
    return 1;
  }
  return zoomOpacityFactor(zoom, controller.stops);
}

/** Write one stop and push its neighbors so appear <= full <= fade <= gone. */
export function setZoomOpacityStop(
  stops: ZoomOpacityStops,
  key: keyof ZoomOpacityStops,
  value: number
): ZoomOpacityStops {
  const [minZoom, maxZoom] = ZOOM_OPACITY_RANGE;
  const next: ZoomOpacityStops = {...stops};
  const clamped = Math.min(maxZoom, Math.max(minZoom, value));
  next[key] = Math.round(clamped * 10) / 10;
  const index = ZOOM_OPACITY_STOP_KEYS.indexOf(key);
  for (let i = index - 1; i >= 0; i--) {
    const stopKey = ZOOM_OPACITY_STOP_KEYS[i];
    if (next[stopKey] > next[ZOOM_OPACITY_STOP_KEYS[i + 1]]) {
      next[stopKey] = next[ZOOM_OPACITY_STOP_KEYS[i + 1]];
    }
  }
  for (let i = index + 1; i < ZOOM_OPACITY_STOP_KEYS.length; i++) {
    const stopKey = ZOOM_OPACITY_STOP_KEYS[i];
    if (next[stopKey] < next[ZOOM_OPACITY_STOP_KEYS[i - 1]]) {
      next[stopKey] = next[ZOOM_OPACITY_STOP_KEYS[i - 1]];
    }
  }
  return next;
}

/** Concatenate controllers and keep the first assignment of each layer id. */
export function combineZoomOpacityControllers(
  configs: Array<{controllers?: ZoomOpacityController[]} | null | undefined>
): ZoomOpacityController[] {
  const seen = new Set<string>();
  const controllers: ZoomOpacityController[] = [];
  configs.forEach(config => {
    (config?.controllers || []).forEach(controller => {
      const layerIds = (controller.layerIds || []).filter(id => {
        if (seen.has(id)) {
          return false;
        }
        seen.add(id);
        return true;
      });
      if (layerIds.length || !(controller.layerIds || []).length) {
        controllers.push({
          ...controller,
          stops: {...controller.stops},
          layerIds
        });
      }
    });
  });
  return controllers;
}

/** Drop a deleted layer from fade-on-zoom controllers. Returns the same config when nothing changes. */
export function removeLayerFromZoomOpacity<
  T extends {zoomOpacity?: InteractionConfig['zoomOpacity']}
>(interactionConfig: T, layerId: string): T {
  const zoomOpacity = interactionConfig?.zoomOpacity;
  if (!zoomOpacity) {
    return interactionConfig;
  }
  const controllers = zoomOpacity.config?.controllers;
  if (!controllers?.length) {
    return interactionConfig;
  }
  let changed = false;
  const nextControllers = controllers.map(controller => {
    if (!controller.layerIds?.includes(layerId)) {
      return controller;
    }
    changed = true;
    return {
      ...controller,
      layerIds: controller.layerIds.filter(id => id !== layerId)
    };
  });
  if (!changed) {
    return interactionConfig;
  }
  return {
    ...interactionConfig,
    zoomOpacity: {
      ...zoomOpacity,
      config: {
        ...zoomOpacity.config,
        controllers: nextControllers
      }
    }
  };
}
