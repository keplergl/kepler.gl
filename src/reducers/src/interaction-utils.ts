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

import {Field, TooltipField, CompareType} from '@kepler.gl/types';
import {
  DataRow,
  parseFieldValue,
  getFormatter,
  isNumber,
  defaultFormatter,
  notNullorUndefined
} from '@kepler.gl/utils';

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
  [key: string]: string[];
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

  return fieldsToShow.slice(0, maxDefaultTooltips).map(({name}) => {
    return {
      name,
      format: null
    };
  });
}

function _mergeFieldPairs(pairs) {
  return pairs.reduce((prev, pair) => [...prev, ...pair], []);
}

export function getTooltipDisplayDeltaValue({
  primaryData,
  field,
  compareType,
  data,
  fieldIdx
}: {
  field: Field;
  data: DataRow;
  fieldIdx: number;
  primaryData: DataRow;
  compareType: CompareType;
}): string | null {
  let displayDeltaValue: string | null = null;

  if (
    primaryData &&
    // comparison mode only works for numeric field
    (field.type === ALL_FIELD_TYPES.integer || field.type === ALL_FIELD_TYPES.real)
  ) {
    const baseDp = primaryData.valueAt(fieldIdx);
    const dp = data.valueAt(fieldIdx);
    if (isNumber(baseDp) && isNumber(dp)) {
      const deltaValue = compareType === COMPARE_TYPES.RELATIVE ? dp / baseDp - 1 : dp - baseDp;
      const deltaFormat =
        compareType === COMPARE_TYPES.RELATIVE
          ? TOOLTIP_FORMATS.DECIMAL_PERCENT_FULL_2[TOOLTIP_KEY]
          : field.displayFormat || TOOLTIP_FORMATS.DECIMAL_DECIMAL_FIXED_3[TOOLTIP_KEY];

      displayDeltaValue = getFormatter(deltaFormat, field)(deltaValue);

      // safely cast string
      displayDeltaValue = defaultFormatter(displayDeltaValue) as string;
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
