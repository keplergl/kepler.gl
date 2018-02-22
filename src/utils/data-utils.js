import moment from 'moment';
import assert from 'assert';
import {range} from 'd3-array';
import {ALL_FIELD_TYPES} from 'constants/default-settings';
import {getFieldsFromData} from 'processors/data-processor';
/**
 * @param data
 * @returns {{allData: Array, fields: Array}}
 */
export function validateInputData(data) {
  // TODO: add test
  /*
   * expected input data format
   * {
   *   fields: [],
   *   rows: []
   * }
   */
  let proceed = true;
  if (!data) {
    assert('receiveVisData: data cannot be null');
    proceed = false;
  } else if (!Array.isArray(data.fields)) {
    assert('receiveVisData: expect data.fields to be an array');
    proceed = false;
  } else if (!Array.isArray(data.rows)) {
    assert('receiveVisData: expect data.rows to be an array');
    proceed = false;
  }

  if (!proceed) {
    return null;
  }

  const {fields, rows} = data;

  // check if all fields has name, format and type
  const allValid = fields.every((f, i) => {
    if (typeof f !== 'object') {
      assert(`fields needs to be an array of object, but find ${f}`);
      return false;
    }

    if (!f.name) {
      assert(
        `field.name is required but missing in field ${JSON.stringify(f)}`
      );
      // assign a name
      f.name = `column_${i}`;
    }

    if (!ALL_FIELD_TYPES[f.type]) {
      assert(`unknown field type ${f.type}`);
      return false;
    }

    return f.type && f.format && f.name;
  });

  if (allValid) {
    return {rows, fields};
  }

  // if any field has missing type, recalculate it for everyone
  // because we simply lost faith in humanity
  const sampleData = getSampleForTypeAnalyze({fields, allData: rows});
  const fieldOrder = fields.map(f => f.name);
  const meta = getFieldsFromData(sampleData, fieldOrder);
  const updatedFields = fields.map((f, i) => ({
    ...f,
    type: meta[i].type,
    format: meta[i].format
  }));

  return {fields: updatedFields, rows};
}

/**
 * get fields from csv data
 *
 * @param {array} fields
 * @param {array} allData
 * @param {array} sampleCount
 * @returns {array} formatted fields
 */
export function getSampleForTypeAnalyze({fields, allData, sampleCount = 50}) {
  const total = Math.min(sampleCount, allData.length);
  const fieldOrder = fields.map(f => f.name);
  const sample = range(0, total, 1).map(d => ({}));

  // collect sample data for each field
  fieldOrder.forEach((field, fieldIdx) => {
    // data counter
    let i = 0;
    // sample counter
    let j = 0;

    while (j < total) {
      if (i >= allData.length) {
        // if depleted data pool
        sample[j][field] = null;
        j++;
      } else if (notNullorUndefined(allData[i][fieldIdx])) {
        sample[j][field] = allData[i][fieldIdx];
        j++;
        i++;
      } else {
        i++;
      }
    }
  });

  return sample;
}

/**
 * simple getting unique values of an array
 *
 * @param {array} values
 * @returns {array} unique values
 */
export function unique(values) {
  const results = [];
  values.forEach(v => {
    if (!results.includes(v) && v !== null && v !== undefined) {
      results.push(v);
    }
  });

  return results;
}

/* eslint-disable max-statements */
/**
 * return center of map from given points
 * @param {array} layers
 * @param {string} dataId
 * @returns {object} coordinates of map center, empty if not found
 */
export function findMapBounds(layers, dataId) {
  // find bounds in formatted layerData
  // use first isVisible Layer

  const newLayers = dataId
    ? layers.filter(l => l.config.dataId === dataId)
    : layers;
  const firstVisibleLayer = newLayers.find(l => l.config.isVisible);
  if (!firstVisibleLayer) {
    return null;
  }

  // if first visible layer has bounds, use it
  if (firstVisibleLayer.meta && firstVisibleLayer.meta.bounds) {
    return firstVisibleLayer.meta.bounds;
  }

  // if not, find any layer that has bound
  const anyLayerWBound = newLayers.find(l => l.meta && l.meta.bounds);

  return anyLayerWBound ? anyLayerWBound.meta.bounds : null;
}
/* eslint-enable max-statements */

export function getLatLngBounds(points, idx, limit) {
  const lats = points
    .map(d => Array.isArray(d) && d[idx])
    .filter(Number.isFinite)
    .sort(numberSort);

  if (!lats.length) {
    return null;
  }
  // use 99 percentile to filter out outliers
  // clamp to limit
  return [
    Math.max(lats[Math.floor(0.01 * (lats.length - 1))], limit[0]),
    Math.min(lats[Math.ceil(0.99 * (lats.length - 1))], limit[1])
  ];
}

export function getSampleData(data, sampleSize = 500) {
  const sampleStep = Math.max(Math.floor(data.length / sampleSize), 1);
  const output = [];
  for (let i = 0; i < data.length; i += sampleStep) {
    output.push(data[i]);
  }

  return output;
}

export function maybeToDate(isTime, fieldIdx, format, d) {
  if (isTime) {
    if (notNullorUndefined(d[fieldIdx])) {
      return typeof d[fieldIdx] === 'string'
        ? moment.utc(d[fieldIdx], format).valueOf()
        : format === 'x' ? d[fieldIdx] * 1000 : d[fieldIdx];
    }

    return null;
  }

  return d[fieldIdx];
}

export function notNullorUndefined(d) {
  return d !== undefined && d !== null;
}

export function isPlainObject(obj) {
  return (
    obj === Object(obj) && typeof obj !== 'function' && !Array.isArray(obj)
  );
}

export function numberSort(a, b) {
  return a - b;
}

export function getSortingFunction(fieldType) {
  switch (fieldType) {
    case ALL_FIELD_TYPES.real:
    case ALL_FIELD_TYPES.integer:
    case ALL_FIELD_TYPES.timestamp:
      return numberSort;
    default:
      return undefined;
  }
}

/**
 * round number with exact number of decimals
 * return as a string
 * @param {number} num
 * @param {number} decimals
 * @returns {string} - a rounded number in string format
 */
export function preciseRound(num, decimals) {
  const t = Math.pow(10, decimals);
  return (
    Math.round(
      num * t +
        (decimals > 0 ? 1 : 0) *
          (Math.sign(num) * (10 / Math.pow(100, decimals)))
    ) / t
  ).toFixed(decimals);
}

/**
 * get number of decimals to round to for slider from step
 * @param {number} step
 * @returns {number} - number of decimal
 */
export function getRoundingDecimalFromStep(step) {
  if (isNaN(step)) {
    assert('step is not a number');
    assert(step);
  }

  const splitZero = step.toString().split('.');
  if (splitZero.length === 1) {
    return 0;
  }
  return splitZero[1].length;
}

/**
 * round the value to step for the slider
 * @param {number} minValue
 * @param {number} step
 * @param {number} val
 * @returns {number} - rounded number
 */
export function roundValToStep(minValue, step, val) {
  if (isNaN(step)) {
    return val;
  }

  const decimal = getRoundingDecimalFromStep(step);
  const steps = Math.floor((val - minValue) / step);
  let remain = val - (steps * step + minValue);

  // has to round because javascript turns 0.1 into 0.9999999999999987
  remain = Number(preciseRound(remain, 8));

  let closest;
  if (remain === 0) {
    closest = val;
  } else if (remain < step / 2) {
    closest = steps * step + minValue;
  } else {
    closest = (steps + 1) * step + minValue;
  }

  // precise round return a string rounded to the defined decimal
  const rounded = preciseRound(closest, decimal);

  return Number(rounded);
}
