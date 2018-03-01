// Copyright (c) 2018 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import uniq from 'lodash.uniq';

import {
  ALL_FIELD_TYPES,
  DEFAULT_LIGHT_SETTINGS,
  GEOJSON_FIELDS,
  HEXAGON_ID_FIELDS,
  ICON_FIELDS,
  LAYER_TYPES,
  TRIP_ARC_FIELDS,
  LAYER_CLASSES
} from 'constants/default-settings';

import {notNullorUndefined, isPlainObject} from 'utils/data-utils';
import {hexToRgb} from 'utils/color-utils';

import * as KeplerGlLayers from 'keplergl-layers';

const DEFAULT_LAYER_COLOR = {
  tripArc: '#9226C6',
  begintrip_lat: '#1E96BE',
  dropoff_lat: '#FF991F',
  request_lat: '#52A353'
};

/**
 * recursively assign all value of saved layer to a mint layer
 * reason we don't use merge here is to make sure only assign
 * property that's in an empty layer
 * @param {Object} emptyLayer
 * @param {Object} layer
 * @return {Object} - layer with value
 */
export function assignPropToEmptyLayer(emptyLayer, layer) {
  const notToOverride = ['type', 'isAggregated'];
  const notToDeepMerge = ['colorField', 'sizeField'];

  Object.keys(emptyLayer).forEach(key => {
    if (
      isPlainObject(emptyLayer[key]) &&
      isPlainObject(layer[key]) &&
      !notToDeepMerge.includes(key)
    ) {
      // recursively assign object
      emptyLayer[key] = assignPropToEmptyLayer(emptyLayer[key], layer[key]);
    } else if (notNullorUndefined(layer[key]) && !notToOverride.includes(key)) {
      emptyLayer[key] = layer[key];
    }
  });

  return emptyLayer;
}

/**
 * Find default layers from fields
 *
 * @param {Array} fields
 * @param {Array} fieldPairs
 * @param {string} dataId
 * @param {string} label
 * @returns {Array} found layers
 */
export function findDefaultLayer({fields, fieldPairs, id: dataId, label}) {
  if (!fields) {
    return [];
  }

  const pointLayers = _findDefaultPointLayers(fieldPairs, dataId);
  const arcLayers = _findDefaultArcLayers(pointLayers, 'arc', dataId);
  // const clusterLayers = _findDefaultClusterLayers(pointLayers, dataId);
  const geojsonLayers = _findDefaultGeojsonLayer(fields, dataId, label);
  const iconLayers = _findDefaultIconLayers(pointLayers, fields, dataId);
  const hexagonIdLayers = _findDefaultHexagonIdLayer(fields, dataId);

  // for performance, do not create too many default layers
  // const hexagonLayer = _findDefaultAggregationLayers(pointLayers, 'hexagon');
  // const gridLayer = _findDefaultAggregationLayers(pointLayers, 'grid');

  return [
    // ...hexagonLayer,
    // ...gridLayer,
    // ...clusterLayers,
    ...arcLayers,
    ...hexagonIdLayers,
    ...geojsonLayers,
    ...pointLayers,
    ...iconLayers
  ];
}

/**
 * Find default point layers from fields
 *
 * @param {Array} fieldPairs
 * @param {string} dataId
 * @returns {Array} found point layers
 */
function _findDefaultPointLayers(fieldPairs, dataId) {
  const layers = [];

  // Make layer for each pair
  fieldPairs.forEach(pair => {
    // find fields for tableFieldIndex
    const latField = pair.pair.lat;
    const lngField = pair.pair.lng;
    const layerName = pair.defaultName;

    const prop = {
      dataId,
      label: layerName.length ? layerName : 'Point'
    };

    // default layer color for begintrip and dropoff point
    if (latField.value in DEFAULT_LAYER_COLOR) {
      // newLayer.color = hexToRgb(DEFAULT_LAYER_COLOR[latField.name]);
      prop.color = hexToRgb(DEFAULT_LAYER_COLOR[latField.value]);
    }

    // set the first layer to be visible
    if (layers.length === 0) {
      prop.isVisible = true;
    }

    const newLayer = new KeplerGlLayers.PointLayer(prop);
    newLayer.config.columns = {
      ...newLayer.config.columns,
      lat: latField,
      lng: lngField
    };

    layers.push(newLayer);
  });

  return layers;
}

/**
 * Find default arc layers from point layers, if none
 * use the first two point layer to create a arc layer
 *
 * @param {Array} pointLayers
 * @param {string} type
 * @param {string} dataId
 * @returns {Array} found arc layers
 */
export function _findDefaultArcLayers(
  pointLayers,
  type = LAYER_TYPES.arc,
  dataId
) {
  if (pointLayers.length < 2) {
    return [];
  }

  const props = {
    dataId,
    label: type,
    color: hexToRgb(DEFAULT_LAYER_COLOR.tripArc)
  };

  // all point layer fields
  const fields = pointLayers.reduce(
    (prev, curr) => prev.concat(Object.values(curr.config.columns)),
    []
  );

  // found the default trip arc fields
  const tripArcFields = Object.keys(TRIP_ARC_FIELDS).reduce((prev, key) => {
    prev[key] = fields.find(f => f.value === TRIP_ARC_FIELDS[key]);
    return prev;
  }, {});

  if (Object.values(tripArcFields).every(Boolean)) {
    // if all trip arc fields found
    props.columns = tripArcFields;
    props.label = 'trip arc';
  } else {
    // connect the first two point layer with arc
    props.columns = {
      lat0: pointLayers[0].config.columns.lat,
      lng0: pointLayers[0].config.columns.lng,
      lat1: pointLayers[1].config.columns.lat,
      lng1: pointLayers[1].config.columns.lng
    };
    props.label = `${pointLayers[0].config.label} -> ${
      pointLayers[1].config.label
    } arc`;
  }

  const tripArcLayer = new KeplerGlLayers.ArcLayer(props);

  return [tripArcLayer];
}

/**
 * Given a array of preset required column names
 * found field that has the same name to set as layer column
 *
 * @param {object[]} defaultFields
 * @param {object[]} allFields
 * @returns {object[] | null} all possible required layer column pairs
 */
function _findDefaultColumnField(defaultFields, allFields) {
  // find all matched fields for each required col
  const requiredColumns = Object.keys(defaultFields).reduce((prev, key) => {
    const requiredFields = allFields.filter(
      f => f.name === defaultFields[key] || defaultFields[key].includes(f.name)
    );

    prev[key] = requiredFields.length
      ? requiredFields.map(f => ({
          value: f.name,
          fieldIdx: f.tableFieldIndex - 1
        }))
      : null;
    return prev;
  }, {});

  if (!Object.values(requiredColumns).every(Boolean)) {
    // if any field missing, return null
    return null;
  }

  return _getAllPossibleColumnParis(requiredColumns);
}

/**
 * Given a set of columnes and all its possible values
 * return all possible combinations
 * e,g when requiredColumns = {f: [1, 2], b: ['a', 'b']}
 * return [{f: 1, b: 'a'}, {f: 1, b: 'b'}, {f: 2, b: 'a'}, {f: 2, b: 'b'}]
 * as 4 possible pairs
 * @param {object} requiredColumns
 * @returns {object[]} pairs
 */
export function _getAllPossibleColumnParis(requiredColumns) {
  // for multiple matched field for one required column, return multiple
  // combinations, e. g. if column a has 2 matched, column b has 3 matched
  // 6 possible column pairs will be returned
  const allKeys = Object.keys(requiredColumns);
  const pointers = allKeys.map((k, i) => (i === allKeys.length - 1 ? -1 : 0));
  const countPerKey = allKeys.map(k => requiredColumns[k].length);
  const pairs = [];

  /* eslint-disable no-loop-func */
  while (incrementPointers(pointers, countPerKey, pointers.length - 1)) {
    const newPair = pointers.reduce((prev, cuur, i) => {
      prev[allKeys[i]] = requiredColumns[allKeys[i]][cuur];
      return prev;
    }, {});

    pairs.push(newPair);
  }
  /* eslint-enable no-loop-func */

  // recursively increment pointers
  function incrementPointers(pts, counts, index) {
    if (index === 0 && pts[0] === counts[0] - 1) {
      // nothing to increment
      return false;
    }

    if (pts[index] + 1 < counts[index]) {
      pts[index] = pts[index] + 1;
      return true;
    }

    pts[index] = 0;
    return incrementPointers(pts, counts, index - 1);
  }

  return pairs;
}

export function _findDefaultGeojsonLayer(fields, dataId, label) {
  const findGeojsonColumn = fields
    .filter(f => f.type === ALL_FIELD_TYPES.geojson)
    .map(f => f.name);

  const defaultColumns = {
    geojson: uniq([...GEOJSON_FIELDS.geojson, ...findGeojsonColumn])
  };

  return _findDefaultFeatureLayer({
    fields,
    defaultColumns,
    type: LAYER_TYPES.geojson,
    dataId,
    label
  });
}

export function _findDefaultClusterLayers(pointLayers) {
  return _findDefaultAggregationLayers(pointLayers, LAYER_TYPES.cluster);
}

export function _findDefaultFeatureLayer({
  fields,
  defaultColumns,
  type,
  label,
  dataId
}) {
  // find all possible required column pairs
  const columns = _findDefaultColumnField(defaultColumns, fields);

  if (!columns || !columns.length) {
    return [];
  }

  const props = {
    dataId,
    label:
      (typeof label === 'string' && label.replace(/\.[^/.]+$/, '')) || type,
    isVisible: true
  };

  const LayerClass = KeplerGlLayers[LAYER_CLASSES[type]];

  // create one layer for each possible column paris
  return columns.reduce((prev, curr) => {
    const newLayer = new LayerClass({...props, columns: curr});
    prev.push(newLayer);
    return prev;
  }, []);
}

/**
 * Find default hexgonId layers from fields
 *
 * @param {Array} fields
 * @param {String} dataId
 * @returns {Array} found path layers
 */
export function _findDefaultHexagonIdLayer(fields, dataId) {
  return _findDefaultFeatureLayer({
    fields,
    defaultColumns: HEXAGON_ID_FIELDS,
    type: LAYER_TYPES.hexagonId,
    label: 'Hexagon',
    dataId
  });
}

/**
 * Find default icon layers from fields
 *
 * @param {Array} pointLayers
 * @param {Array} fields
 * @returns {Array} found icon layers
 */
export function _findDefaultIconLayers(pointLayers, fields) {
  if (!pointLayers.length) {
    return [];
  }

  const iconFields = fields.filter(({name}) =>
    name
      .replace(/[_,.]+/g, ' ')
      .trim()
      .split(' ')
      .some(seg => ICON_FIELDS.icon.some(t => t.includes(seg)))
  );

  if (!iconFields.length) {
    return [];
  }
  // create icon layers for first point layer
  const ptLayer = pointLayers[0];

  const props = {
    dataId: ptLayer.config.dataId,
    columns: {
      lat: ptLayer.config.columns.lat,
      lng: ptLayer.config.columns.lng
    },
    isVisible: true
  };

  const LayerClass = KeplerGlLayers[LAYER_CLASSES.icon];

  return iconFields.map(
    iconField =>
      new LayerClass({
        ...props,
        label: iconField.name.replace(/[_,.]+/g, ' ').trim(),
        columns: {
          ...props.columns,
          icon: {
            value: iconField.name,
            fieldIdx: iconField.tableFieldIndex - 1
          }
        }
      })
  );
}

/**
 * Find default grid layers from fields
 *
 * @param {Array} pointLayers
 * @param {String} type
 * @returns {Array} an array of founded grid layers
 */
export function _findDefaultAggregationLayers(pointLayers, type) {
  if (!pointLayers.length) {
    return [];
  }

  // only create one aggregation layer
  const ptLayer = pointLayers[0];

  const props = {
    dataId: ptLayer.config.dataId,
    label: `${ptLayer.config.label} ${type}`
  };

  const LayerClass = KeplerGlLayers[LAYER_CLASSES[type]];
  const newLayer = new LayerClass(props);

  // copy point layer columns over
  newLayer.config.columns = Object.keys(newLayer.config.columns).reduce(
    (accu, key) => ({
      ...accu,
      [key]: {...ptLayer.config.columns[key]}
    }),
    {}
  );

  return [newLayer];
}

/**
 * calculate layer data based on layer type, col Config,
 * return updated layer if colorDomain, dataMap has changed
 * @param {object} layer
 * @param {object} state
 * @param {object} oldLayerData
 * @param {object} opt
 * @returns {object} {layerData: {}, layer: {} || undefined}
 */
export function calculateLayerData(layer, state, oldLayerData, opt = {}) {
  const {type} = layer;
  const {datasets} = state;

  const {data, filteredIndex, allData} = datasets[layer.config.dataId] || {};

  if (!type || !layer.hasAllColumns()) {
    return {layer, layerData: {}};
  }

  const layerData = layer.formatLayerData(
    data,
    allData,
    filteredIndex,
    oldLayerData,
    opt
  );
  return {layerData, layer};
}

export function getLightSettingsFromBounds(bounds) {
  return Array.isArray(bounds) && bounds.length >= 4
    ? {
        ...DEFAULT_LIGHT_SETTINGS,
        lightsPosition: [
          ...bounds.slice(0, 2),
          DEFAULT_LIGHT_SETTINGS.lightsPosition[2],
          ...bounds.slice(2, 4),
          DEFAULT_LIGHT_SETTINGS.lightsPosition[5]
        ]
      }
    : DEFAULT_LIGHT_SETTINGS;
}
