'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

exports.assignPropToEmptyLayer = assignPropToEmptyLayer;
exports.findDefaultLayer = findDefaultLayer;
exports._findDefaultArcLayers = _findDefaultArcLayers;
exports._getAllPossibleColumnParis = _getAllPossibleColumnParis;
exports._findDefaultGeojsonLayer = _findDefaultGeojsonLayer;
exports._findDefaultClusterLayers = _findDefaultClusterLayers;
exports._findDefaultFeatureLayer = _findDefaultFeatureLayer;
exports._findDefaultHexagonIdLayer = _findDefaultHexagonIdLayer;
exports._findDefaultIconLayers = _findDefaultIconLayers;
exports._findDefaultAggregationLayers = _findDefaultAggregationLayers;
exports.calculateLayerData = calculateLayerData;
exports.getLightSettingsFromBounds = getLightSettingsFromBounds;

var _lodash = require('lodash.uniq');

var _lodash2 = _interopRequireDefault(_lodash);

var _defaultSettings = require('../../constants/default-settings');

var _dataUtils = require('../data-utils');

var _colorUtils = require('../color-utils');

var _keplerglLayers = require('../../keplergl-layers');

var KeplerGLLayers = _interopRequireWildcard(_keplerglLayers);

var _uberVizColors = require('../../constants/uber-viz-colors');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_LAYER_COLOR = {
  tripArc: _uberVizColors.uberDataVizColors.aqua,
  begintrip_lat: _uberVizColors.uberDataVizColors.orchid,
  dropoff_lat: _uberVizColors.uberDataVizColors.tree_poppy,
  request_lat: _uberVizColors.uberDataVizColors.portage
};

/**
 * recursively assign all value of saved layer to a mint layer
 * reason we don't use merge here is to make sure only assign
 * property that's in an empty layer
 * @param {Object} emptyLayer
 * @param {Object} layer
 * @return {Object} - layer with value
 */
function assignPropToEmptyLayer(emptyLayer, layer) {
  var notToOverride = ['type', 'isAggregated'];
  var notToDeepMerge = ['colorField', 'sizeField'];

  Object.keys(emptyLayer).forEach(function (key) {
    if ((0, _dataUtils.isPlainObject)(emptyLayer[key]) && (0, _dataUtils.isPlainObject)(layer[key]) && !notToDeepMerge.includes(key)) {

      // recursively assign object
      emptyLayer[key] = assignPropToEmptyLayer(emptyLayer[key], layer[key]);
    } else if ((0, _dataUtils.notNullorUndefined)(layer[key]) && !notToOverride.includes(key)) {
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
function findDefaultLayer(_ref) {
  var fields = _ref.fields,
      fieldPairs = _ref.fieldPairs,
      dataId = _ref.id,
      label = _ref.label;


  if (!fields) {
    return [];
  }

  var pointLayers = _findDefaultPointLayers(fields, fieldPairs, dataId);
  var arcLayers = _findDefaultArcLayers(pointLayers, 'arc', dataId);
  // const clusterLayers = _findDefaultClusterLayers(pointLayers, dataId);
  var geojsonLayers = _findDefaultGeojsonLayer(fields, dataId, label);
  var iconLayers = _findDefaultIconLayers(pointLayers, fields, dataId);
  var hexagonIdLayers = _findDefaultHexagonIdLayer(fields, dataId);

  // for performance, do not create too many default layerss
  // const hexagonLayer = _findDefaultAggregationLayers(pointLayers, 'hexagon');
  // const gridLayer = _findDefaultAggregationLayers(pointLayers, 'grid');

  return [].concat(arcLayers, hexagonIdLayers, geojsonLayers, pointLayers, iconLayers);
}

// function removeSuffixAndDelimiters(layerName, suffix) {
//   return layerName
//     .replace(new RegExp(suffix, 'ig'), '')
//     .replace(/[_,.]+/g, ' ')
//     .trim();
// }

/**
 * Find point fields pairs from fields
 *
 * @param {Array} fields
 * @returns {Array} found point fields
 */
// export function findPointFieldPairs(fields) {
//   const allNames = fields.map(f => f.name.toLowerCase());
//
//   // get list of all fields with matching suffixes
//   return allNames.reduce((carry, fieldName, idx) => {
//     // This search for pairs will early exit if found.
//     for (const suffixPair of TRIP_POINT_FIELDS) {
//       // match first suffix```
//       if (fieldName.endsWith(suffixPair[0])) {
//         // match second suffix
//         const otherPattern = new RegExp(`${suffixPair[0]}\$`);
//         const partner = fieldName.replace(otherPattern, suffixPair[1]);
//
//         const partnerIdx = allNames.findIndex(d => d === partner);
//         if (partnerIdx > -1) {
//           const defaultName = removeSuffixAndDelimiters(fieldName, suffixPair[0]);
//
//           carry.push({
//             defaultName,
//             pair: {
//               lat: {
//                 fieldIdx: idx,
//                 value: fields[idx].name
//               },
//               lng: {
//                 fieldIdx: partnerIdx,
//                 value: fields[partnerIdx].name
//               }
//             },
//             suffix: suffixPair
//           });
//           return carry;
//         }
//       }
//     }
//     return carry;
//   }, []);
// }

/**
 * Find default point layers from fields
 *
 * @param {Array} fields
 * @param {Array} fieldPairs
 * @param {string} dataId
 * @returns {Array} found point layers
 */
function _findDefaultPointLayers(fields, fieldPairs, dataId) {
  var layers = [];

  // Make layer for each pair
  fieldPairs.forEach(function (pair) {
    // find fields for tableFieldIndex
    var latField = pair.pair.lat;
    var lngField = pair.pair.lng;
    var layerName = pair.defaultName;

    var prop = {
      dataId: dataId,
      label: layerName.length ? layerName : 'Point'
    };

    // default layer color for begintrip and dropoff point
    if (latField.value in DEFAULT_LAYER_COLOR) {
      // newLayer.color = hexToRgb(DEFAULT_LAYER_COLOR[latField.name]);
      prop.color = (0, _colorUtils.hexToRgb)(DEFAULT_LAYER_COLOR[latField.value]);
    }

    // set the first layer to be visible
    if (layers.length === 0) {
      prop.isVisible = true;
    }

    var newLayer = new KeplerGLLayers.PointLayer(prop);
    newLayer.config.columns = (0, _extends4.default)({}, newLayer.config.columns, {
      lat: latField,
      lng: lngField
    });

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
function _findDefaultArcLayers(pointLayers) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _defaultSettings.LAYER_TYPES.arc;
  var dataId = arguments[2];


  if (pointLayers.length < 2) {
    return [];
  }

  var props = {
    dataId: dataId,
    label: type,
    color: (0, _colorUtils.hexToRgb)(DEFAULT_LAYER_COLOR.tripArc)
  };

  // all point layer fields
  var fields = pointLayers.reduce(function (prev, curr) {
    return prev.concat(Object.values(curr.config.columns));
  }, []);

  // found the default trip arc fields
  var tripArcFields = Object.keys(_defaultSettings.TRIP_ARC_FIELDS).reduce(function (prev, key) {
    prev[key] = fields.find(function (f) {
      return f.value === _defaultSettings.TRIP_ARC_FIELDS[key];
    });
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
    props.label = pointLayers[0].config.label + ' -> ' + pointLayers[1].config.label + ' arc';
  }

  var tripArcLayer = new KeplerGLLayers.ArcLayer(props);

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
  var requiredColumns = Object.keys(defaultFields).reduce(function (prev, key) {

    var requiredFields = allFields.filter(function (f) {
      return f.name === defaultFields[key] || defaultFields[key].includes(f.name);
    });

    prev[key] = requiredFields.length ? requiredFields.map(function (f) {
      return {
        value: f.name,
        fieldIdx: f.tableFieldIndex - 1
      };
    }) : null;
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
function _getAllPossibleColumnParis(requiredColumns) {
  // for multiple matched field for one required column, return multiple
  // combinations, e. g. if column a has 2 matched, column b has 3 matched
  // 6 possible column pairs will be returned
  var allKeys = Object.keys(requiredColumns);
  var pointers = allKeys.map(function (k, i) {
    return i === allKeys.length - 1 ? -1 : 0;
  });
  var countPerKey = allKeys.map(function (k) {
    return requiredColumns[k].length;
  });
  var pairs = [];

  /* eslint-disable no-loop-func */
  while (incrementPointers(pointers, countPerKey, pointers.length - 1)) {
    var newPair = pointers.reduce(function (prev, cuur, i) {
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

function _findDefaultGeojsonLayer(fields, dataId, label) {
  var findGeojsonColumn = fields.filter(function (f) {
    return f.type === _defaultSettings.ALL_FIELD_TYPES.geojson;
  }).map(function (f) {
    return f.name;
  });

  var defaultColumns = {
    geojson: (0, _lodash2.default)([].concat(_defaultSettings.GEOJSON_FIELDS.geojson, findGeojsonColumn))
  };

  return _findDefaultFeatureLayer({
    fields: fields,
    defaultColumns: defaultColumns,
    type: _defaultSettings.LAYER_TYPES.geojson,
    dataId: dataId,
    label: label
  });
}

function _findDefaultClusterLayers(pointLayers) {
  return _findDefaultAggregationLayers(pointLayers, _defaultSettings.LAYER_TYPES.cluster);
}

function _findDefaultFeatureLayer(_ref2) {
  var fields = _ref2.fields,
      defaultColumns = _ref2.defaultColumns,
      type = _ref2.type,
      label = _ref2.label,
      dataId = _ref2.dataId;

  // find all possible required column pairs
  var columns = _findDefaultColumnField(defaultColumns, fields);

  if (!columns || !columns.length) {
    return [];
  }

  var props = {
    dataId: dataId,
    label: typeof label === 'string' && label.replace(/\.[^/.]+$/, '') || type,
    isVisible: true
  };

  var LayerClass = KeplerGLLayers[_defaultSettings.LAYER_CLASSES[type]];

  // create one layer for each possible column paris
  return columns.reduce(function (prev, curr) {
    var newLayer = new LayerClass((0, _extends4.default)({}, props, { columns: curr }));
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
function _findDefaultHexagonIdLayer(fields, dataId) {
  return _findDefaultFeatureLayer({
    fields: fields, defaultColumns: _defaultSettings.HEXAGON_ID_FIELDS,
    type: _defaultSettings.LAYER_TYPES.hexagonId, label: 'Hexagon', dataId: dataId
  });
}

/**
 * Find default icon layers from fields
 *
 * @param {Array} pointLayers
 * @param {Array} fields
 * @returns {Array} found icon layers
 */
function _findDefaultIconLayers(pointLayers, fields) {

  if (!pointLayers.length) {
    return [];
  }

  var iconFields = fields.filter(function (_ref3) {
    var name = _ref3.name;
    return name.replace(/[_,.]+/g, ' ').trim().split(' ').some(function (seg) {
      return _defaultSettings.ICON_FIELDS.icon.some(function (t) {
        return t.includes(seg);
      });
    });
  });

  if (!iconFields.length) {
    return [];
  }
  // create icon layers for first point layer
  var ptLayer = pointLayers[0];

  var props = {
    dataId: ptLayer.config.dataId,
    columns: {
      lat: ptLayer.config.columns.lat,
      lng: ptLayer.config.columns.lng
    },
    isVisible: true
  };

  var LayerClass = KeplerGLLayers[_defaultSettings.LAYER_CLASSES.icon];

  return iconFields.map(function (iconField) {
    return new LayerClass((0, _extends4.default)({}, props, {
      label: iconField.name.replace(/[_,.]+/g, ' ').trim(),
      columns: (0, _extends4.default)({}, props.columns, {
        icon: {
          value: iconField.name,
          fieldIdx: iconField.tableFieldIndex - 1
        }
      })
    }));
  });
}

/**
 * Find default grid layers from fields
 *
 * @param {Array} pointLayers
 * @param {String} type
 * @returns {Array} an array of founded grid layers
 */
function _findDefaultAggregationLayers(pointLayers, type) {

  if (!pointLayers.length) {
    return [];
  }

  // only create one aggregation layer
  var ptLayer = pointLayers[0];

  var props = {
    dataId: ptLayer.config.dataId,
    label: ptLayer.config.label + ' ' + type
  };

  var LayerClass = KeplerGLLayers[_defaultSettings.LAYER_CLASSES[type]];
  var newLayer = new LayerClass(props);

  // copy point layer columns over
  newLayer.config.columns = Object.keys(newLayer.config.columns).reduce(function (accu, key) {
    var _extends2;

    return (0, _extends4.default)({}, accu, (_extends2 = {}, _extends2[key] = (0, _extends4.default)({}, ptLayer.config.columns[key]), _extends2));
  }, {});

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
function calculateLayerData(layer, state, oldLayerData) {
  var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var type = layer.type;
  var datasets = state.datasets;

  var _ref4 = datasets[layer.config.dataId] || {},
      data = _ref4.data,
      filteredIndex = _ref4.filteredIndex,
      allData = _ref4.allData;

  if (!type || !layer.hasAllColumns()) {
    return { layer: layer, layerData: {} };
  }

  var layerData = layer.formatLayerData(data, allData, filteredIndex, oldLayerData, opt);
  return { layerData: layerData, layer: layer };
}

function getLightSettingsFromBounds(bounds) {
  return Array.isArray(bounds) && bounds.length >= 4 ? (0, _extends4.default)({}, _defaultSettings.DEFAULT_LIGHT_SETTINGS, {
    lightsPosition: [].concat(bounds.slice(0, 2), [_defaultSettings.DEFAULT_LIGHT_SETTINGS.lightsPosition[2]], bounds.slice(2, 4), [_defaultSettings.DEFAULT_LIGHT_SETTINGS.lightsPosition[5]])
  }) : _defaultSettings.DEFAULT_LIGHT_SETTINGS;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9sYXllci11dGlscy9sYXllci11dGlscy5qcyJdLCJuYW1lcyI6WyJhc3NpZ25Qcm9wVG9FbXB0eUxheWVyIiwiZmluZERlZmF1bHRMYXllciIsIl9maW5kRGVmYXVsdEFyY0xheWVycyIsIl9nZXRBbGxQb3NzaWJsZUNvbHVtblBhcmlzIiwiX2ZpbmREZWZhdWx0R2VvanNvbkxheWVyIiwiX2ZpbmREZWZhdWx0Q2x1c3RlckxheWVycyIsIl9maW5kRGVmYXVsdEZlYXR1cmVMYXllciIsIl9maW5kRGVmYXVsdEhleGFnb25JZExheWVyIiwiX2ZpbmREZWZhdWx0SWNvbkxheWVycyIsIl9maW5kRGVmYXVsdEFnZ3JlZ2F0aW9uTGF5ZXJzIiwiY2FsY3VsYXRlTGF5ZXJEYXRhIiwiZ2V0TGlnaHRTZXR0aW5nc0Zyb21Cb3VuZHMiLCJLZXBsZXJHTExheWVycyIsIkRFRkFVTFRfTEFZRVJfQ09MT1IiLCJ0cmlwQXJjIiwiYXF1YSIsImJlZ2ludHJpcF9sYXQiLCJvcmNoaWQiLCJkcm9wb2ZmX2xhdCIsInRyZWVfcG9wcHkiLCJyZXF1ZXN0X2xhdCIsInBvcnRhZ2UiLCJlbXB0eUxheWVyIiwibGF5ZXIiLCJub3RUb092ZXJyaWRlIiwibm90VG9EZWVwTWVyZ2UiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsImluY2x1ZGVzIiwiZmllbGRzIiwiZmllbGRQYWlycyIsImRhdGFJZCIsImlkIiwibGFiZWwiLCJwb2ludExheWVycyIsIl9maW5kRGVmYXVsdFBvaW50TGF5ZXJzIiwiYXJjTGF5ZXJzIiwiZ2VvanNvbkxheWVycyIsImljb25MYXllcnMiLCJoZXhhZ29uSWRMYXllcnMiLCJsYXllcnMiLCJsYXRGaWVsZCIsInBhaXIiLCJsYXQiLCJsbmdGaWVsZCIsImxuZyIsImxheWVyTmFtZSIsImRlZmF1bHROYW1lIiwicHJvcCIsImxlbmd0aCIsInZhbHVlIiwiY29sb3IiLCJpc1Zpc2libGUiLCJuZXdMYXllciIsIlBvaW50TGF5ZXIiLCJjb25maWciLCJjb2x1bW5zIiwicHVzaCIsInR5cGUiLCJhcmMiLCJwcm9wcyIsInJlZHVjZSIsInByZXYiLCJjdXJyIiwiY29uY2F0IiwidmFsdWVzIiwidHJpcEFyY0ZpZWxkcyIsImZpbmQiLCJmIiwiZXZlcnkiLCJCb29sZWFuIiwibGF0MCIsImxuZzAiLCJsYXQxIiwibG5nMSIsInRyaXBBcmNMYXllciIsIkFyY0xheWVyIiwiX2ZpbmREZWZhdWx0Q29sdW1uRmllbGQiLCJkZWZhdWx0RmllbGRzIiwiYWxsRmllbGRzIiwicmVxdWlyZWRDb2x1bW5zIiwicmVxdWlyZWRGaWVsZHMiLCJmaWx0ZXIiLCJuYW1lIiwibWFwIiwiZmllbGRJZHgiLCJ0YWJsZUZpZWxkSW5kZXgiLCJhbGxLZXlzIiwicG9pbnRlcnMiLCJrIiwiaSIsImNvdW50UGVyS2V5IiwicGFpcnMiLCJpbmNyZW1lbnRQb2ludGVycyIsIm5ld1BhaXIiLCJjdXVyIiwicHRzIiwiY291bnRzIiwiaW5kZXgiLCJmaW5kR2VvanNvbkNvbHVtbiIsImdlb2pzb24iLCJkZWZhdWx0Q29sdW1ucyIsImNsdXN0ZXIiLCJyZXBsYWNlIiwiTGF5ZXJDbGFzcyIsImhleGFnb25JZCIsImljb25GaWVsZHMiLCJ0cmltIiwic3BsaXQiLCJzb21lIiwiaWNvbiIsInQiLCJzZWciLCJwdExheWVyIiwiaWNvbkZpZWxkIiwiYWNjdSIsInN0YXRlIiwib2xkTGF5ZXJEYXRhIiwib3B0IiwiZGF0YXNldHMiLCJkYXRhIiwiZmlsdGVyZWRJbmRleCIsImFsbERhdGEiLCJoYXNBbGxDb2x1bW5zIiwibGF5ZXJEYXRhIiwiZm9ybWF0TGF5ZXJEYXRhIiwiYm91bmRzIiwiQXJyYXkiLCJpc0FycmF5IiwibGlnaHRzUG9zaXRpb24iLCJzbGljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztRQW1DZ0JBLHNCLEdBQUFBLHNCO1FBNEJBQyxnQixHQUFBQSxnQjtRQXlJQUMscUIsR0FBQUEscUI7UUFtRkFDLDBCLEdBQUFBLDBCO1FBdUNB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YUFKMEQ7QUFBQSxNQUkzQ0MsT0FKMkMsU0FJM0NBLE9BSjJDOztBQU12RSxNQUFJLENBQUNoRSxJQUFELElBQVMsQ0FBQ3JDLE1BQU1zRyxhQUFOLEVBQWQsRUFBcUM7QUFDbkMsV0FBTyxFQUFDdEcsWUFBRCxFQUFRdUcsV0FBVyxFQUFuQixFQUFQO0FBQ0Q7O0FBRUQsTUFBTUEsWUFBWXZHLE1BQU13RyxlQUFOLENBQXNCTCxJQUF0QixFQUE0QkUsT0FBNUIsRUFBcUNELGFBQXJDLEVBQW9ESixZQUFwRCxFQUFrRUMsR0FBbEUsQ0FBbEI7QUFDQSxTQUFPLEVBQUNNLG9CQUFELEVBQVl2RyxZQUFaLEVBQVA7QUFDRDs7QUFFTSxTQUFTWiwwQkFBVCxDQUFvQ3FILE1BQXBDLEVBQTRDO0FBQ2pELFNBQU9DLE1BQU1DLE9BQU4sQ0FBY0YsTUFBZCxLQUF5QkEsT0FBTzdFLE1BQVAsSUFBaUIsQ0FBMUM7QUFFTGdGLDhCQUNLSCxPQUFPSSxLQUFQLENBQWEsQ0FBYixFQUFnQixDQUFoQixDQURMLEdBRUUsd0NBQXVCRCxjQUF2QixDQUFzQyxDQUF0QyxDQUZGLEdBR0tILE9BQU9JLEtBQVAsQ0FBYSxDQUFiLEVBQWdCLENBQWhCLENBSEwsR0FJRSx3Q0FBdUJELGNBQXZCLENBQXNDLENBQXRDLENBSkY7QUFGSyw4Q0FBUDtBQVNEIiwiZmlsZSI6ImxheWVyLXV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHVuaXEgZnJvbSAnbG9kYXNoLnVuaXEnO1xuXG5pbXBvcnQge1xuICBBTExfRklFTERfVFlQRVMsXG4gIERFRkFVTFRfTElHSFRfU0VUVElOR1MsXG4gIEdFT0pTT05fRklFTERTLFxuICBIRVhBR09OX0lEX0ZJRUxEUyxcbiAgSUNPTl9GSUVMRFMsXG4gIExBWUVSX1RZUEVTLFxuICBUUklQX0FSQ19GSUVMRFMsXG4gIExBWUVSX0NMQVNTRVNcbn0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5pbXBvcnQge25vdE51bGxvclVuZGVmaW5lZCwgaXNQbGFpbk9iamVjdH0gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5pbXBvcnQge2hleFRvUmdifSBmcm9tICd1dGlscy9jb2xvci11dGlscyc7XG5cbmltcG9ydCAqIGFzIEtlcGxlckdMTGF5ZXJzIGZyb20gJ2tlcGxlcmdsLWxheWVycyc7XG5cbmltcG9ydCB7dWJlckRhdGFWaXpDb2xvcnN9IGZyb20gJ2NvbnN0YW50cy91YmVyLXZpei1jb2xvcnMnO1xuXG5jb25zdCBERUZBVUxUX0xBWUVSX0NPTE9SID0ge1xuICB0cmlwQXJjOiB1YmVyRGF0YVZpekNvbG9ycy5hcXVhLFxuICBiZWdpbnRyaXBfbGF0OiB1YmVyRGF0YVZpekNvbG9ycy5vcmNoaWQsXG4gIGRyb3BvZmZfbGF0OiB1YmVyRGF0YVZpekNvbG9ycy50cmVlX3BvcHB5LFxuICByZXF1ZXN0X2xhdDogdWJlckRhdGFWaXpDb2xvcnMucG9ydGFnZVxufTtcblxuLyoqXG4gKiByZWN1cnNpdmVseSBhc3NpZ24gYWxsIHZhbHVlIG9mIHNhdmVkIGxheWVyIHRvIGEgbWludCBsYXllclxuICogcmVhc29uIHdlIGRvbid0IHVzZSBtZXJnZSBoZXJlIGlzIHRvIG1ha2Ugc3VyZSBvbmx5IGFzc2lnblxuICogcHJvcGVydHkgdGhhdCdzIGluIGFuIGVtcHR5IGxheWVyXG4gKiBAcGFyYW0ge09iamVjdH0gZW1wdHlMYXllclxuICogQHBhcmFtIHtPYmplY3R9IGxheWVyXG4gKiBAcmV0dXJuIHtPYmplY3R9IC0gbGF5ZXIgd2l0aCB2YWx1ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXNzaWduUHJvcFRvRW1wdHlMYXllcihlbXB0eUxheWVyLCBsYXllcikge1xuICBjb25zdCBub3RUb092ZXJyaWRlID0gWyd0eXBlJywgJ2lzQWdncmVnYXRlZCddO1xuICBjb25zdCBub3RUb0RlZXBNZXJnZSA9IFsnY29sb3JGaWVsZCcsICdzaXplRmllbGQnXTtcblxuICBPYmplY3Qua2V5cyhlbXB0eUxheWVyKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgaWYgKGlzUGxhaW5PYmplY3QoZW1wdHlMYXllcltrZXldKSAmJiBpc1BsYWluT2JqZWN0KGxheWVyW2tleV0pICYmXG4gICAgICAhbm90VG9EZWVwTWVyZ2UuaW5jbHVkZXMoa2V5KSkge1xuXG4gICAgICAvLyByZWN1cnNpdmVseSBhc3NpZ24gb2JqZWN0XG4gICAgICBlbXB0eUxheWVyW2tleV0gPSBhc3NpZ25Qcm9wVG9FbXB0eUxheWVyKGVtcHR5TGF5ZXJba2V5XSwgbGF5ZXJba2V5XSk7XG5cbiAgICB9IGVsc2UgaWYgKG5vdE51bGxvclVuZGVmaW5lZChsYXllcltrZXldKSAmJiAhbm90VG9PdmVycmlkZS5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICBlbXB0eUxheWVyW2tleV0gPSBsYXllcltrZXldO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGVtcHR5TGF5ZXI7XG59XG5cbi8qKlxuICogRmluZCBkZWZhdWx0IGxheWVycyBmcm9tIGZpZWxkc1xuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGZpZWxkc1xuICogQHBhcmFtIHtBcnJheX0gZmllbGRQYWlyc1xuICogQHBhcmFtIHtzdHJpbmd9IGRhdGFJZFxuICogQHBhcmFtIHtzdHJpbmd9IGxhYmVsXG4gKiBAcmV0dXJucyB7QXJyYXl9IGZvdW5kIGxheWVyc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZERlZmF1bHRMYXllcih7ZmllbGRzLCBmaWVsZFBhaXJzLCBpZDogZGF0YUlkLCBsYWJlbH0pIHtcblxuICBpZiAoIWZpZWxkcykge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IHBvaW50TGF5ZXJzID0gX2ZpbmREZWZhdWx0UG9pbnRMYXllcnMoZmllbGRzLCBmaWVsZFBhaXJzLCBkYXRhSWQpO1xuICBjb25zdCBhcmNMYXllcnMgPSBfZmluZERlZmF1bHRBcmNMYXllcnMocG9pbnRMYXllcnMsICdhcmMnLCBkYXRhSWQpO1xuICAvLyBjb25zdCBjbHVzdGVyTGF5ZXJzID0gX2ZpbmREZWZhdWx0Q2x1c3RlckxheWVycyhwb2ludExheWVycywgZGF0YUlkKTtcbiAgY29uc3QgZ2VvanNvbkxheWVycyA9IF9maW5kRGVmYXVsdEdlb2pzb25MYXllcihmaWVsZHMsIGRhdGFJZCwgbGFiZWwpO1xuICBjb25zdCBpY29uTGF5ZXJzID0gX2ZpbmREZWZhdWx0SWNvbkxheWVycyhwb2ludExheWVycywgZmllbGRzLCBkYXRhSWQpO1xuICBjb25zdCBoZXhhZ29uSWRMYXllcnMgPSBfZmluZERlZmF1bHRIZXhhZ29uSWRMYXllcihmaWVsZHMsIGRhdGFJZCk7XG5cbiAgLy8gZm9yIHBlcmZvcm1hbmNlLCBkbyBub3QgY3JlYXRlIHRvbyBtYW55IGRlZmF1bHQgbGF5ZXJzc1xuICAvLyBjb25zdCBoZXhhZ29uTGF5ZXIgPSBfZmluZERlZmF1bHRBZ2dyZWdhdGlvbkxheWVycyhwb2ludExheWVycywgJ2hleGFnb24nKTtcbiAgLy8gY29uc3QgZ3JpZExheWVyID0gX2ZpbmREZWZhdWx0QWdncmVnYXRpb25MYXllcnMocG9pbnRMYXllcnMsICdncmlkJyk7XG5cbiAgcmV0dXJuIFtcbiAgICAvLyAuLi5oZXhhZ29uTGF5ZXIsXG4gICAgLy8gLi4uZ3JpZExheWVyLFxuICAgIC8vIC4uLmNsdXN0ZXJMYXllcnMsXG4gICAgLi4uYXJjTGF5ZXJzLFxuICAgIC4uLmhleGFnb25JZExheWVycyxcbiAgICAuLi5nZW9qc29uTGF5ZXJzLFxuICAgIC4uLnBvaW50TGF5ZXJzLFxuICAgIC4uLmljb25MYXllcnNcbiAgXTtcbn1cblxuLy8gZnVuY3Rpb24gcmVtb3ZlU3VmZml4QW5kRGVsaW1pdGVycyhsYXllck5hbWUsIHN1ZmZpeCkge1xuLy8gICByZXR1cm4gbGF5ZXJOYW1lXG4vLyAgICAgLnJlcGxhY2UobmV3IFJlZ0V4cChzdWZmaXgsICdpZycpLCAnJylcbi8vICAgICAucmVwbGFjZSgvW18sLl0rL2csICcgJylcbi8vICAgICAudHJpbSgpO1xuLy8gfVxuXG4vKipcbiAqIEZpbmQgcG9pbnQgZmllbGRzIHBhaXJzIGZyb20gZmllbGRzXG4gKlxuICogQHBhcmFtIHtBcnJheX0gZmllbGRzXG4gKiBAcmV0dXJucyB7QXJyYXl9IGZvdW5kIHBvaW50IGZpZWxkc1xuICovXG4vLyBleHBvcnQgZnVuY3Rpb24gZmluZFBvaW50RmllbGRQYWlycyhmaWVsZHMpIHtcbi8vICAgY29uc3QgYWxsTmFtZXMgPSBmaWVsZHMubWFwKGYgPT4gZi5uYW1lLnRvTG93ZXJDYXNlKCkpO1xuLy9cbi8vICAgLy8gZ2V0IGxpc3Qgb2YgYWxsIGZpZWxkcyB3aXRoIG1hdGNoaW5nIHN1ZmZpeGVzXG4vLyAgIHJldHVybiBhbGxOYW1lcy5yZWR1Y2UoKGNhcnJ5LCBmaWVsZE5hbWUsIGlkeCkgPT4ge1xuLy8gICAgIC8vIFRoaXMgc2VhcmNoIGZvciBwYWlycyB3aWxsIGVhcmx5IGV4aXQgaWYgZm91bmQuXG4vLyAgICAgZm9yIChjb25zdCBzdWZmaXhQYWlyIG9mIFRSSVBfUE9JTlRfRklFTERTKSB7XG4vLyAgICAgICAvLyBtYXRjaCBmaXJzdCBzdWZmaXhgYGBcbi8vICAgICAgIGlmIChmaWVsZE5hbWUuZW5kc1dpdGgoc3VmZml4UGFpclswXSkpIHtcbi8vICAgICAgICAgLy8gbWF0Y2ggc2Vjb25kIHN1ZmZpeFxuLy8gICAgICAgICBjb25zdCBvdGhlclBhdHRlcm4gPSBuZXcgUmVnRXhwKGAke3N1ZmZpeFBhaXJbMF19XFwkYCk7XG4vLyAgICAgICAgIGNvbnN0IHBhcnRuZXIgPSBmaWVsZE5hbWUucmVwbGFjZShvdGhlclBhdHRlcm4sIHN1ZmZpeFBhaXJbMV0pO1xuLy9cbi8vICAgICAgICAgY29uc3QgcGFydG5lcklkeCA9IGFsbE5hbWVzLmZpbmRJbmRleChkID0+IGQgPT09IHBhcnRuZXIpO1xuLy8gICAgICAgICBpZiAocGFydG5lcklkeCA+IC0xKSB7XG4vLyAgICAgICAgICAgY29uc3QgZGVmYXVsdE5hbWUgPSByZW1vdmVTdWZmaXhBbmREZWxpbWl0ZXJzKGZpZWxkTmFtZSwgc3VmZml4UGFpclswXSk7XG4vL1xuLy8gICAgICAgICAgIGNhcnJ5LnB1c2goe1xuLy8gICAgICAgICAgICAgZGVmYXVsdE5hbWUsXG4vLyAgICAgICAgICAgICBwYWlyOiB7XG4vLyAgICAgICAgICAgICAgIGxhdDoge1xuLy8gICAgICAgICAgICAgICAgIGZpZWxkSWR4OiBpZHgsXG4vLyAgICAgICAgICAgICAgICAgdmFsdWU6IGZpZWxkc1tpZHhdLm5hbWVcbi8vICAgICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgICAgbG5nOiB7XG4vLyAgICAgICAgICAgICAgICAgZmllbGRJZHg6IHBhcnRuZXJJZHgsXG4vLyAgICAgICAgICAgICAgICAgdmFsdWU6IGZpZWxkc1twYXJ0bmVySWR4XS5uYW1lXG4vLyAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICBzdWZmaXg6IHN1ZmZpeFBhaXJcbi8vICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICByZXR1cm4gY2Fycnk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgIH1cbi8vICAgICB9XG4vLyAgICAgcmV0dXJuIGNhcnJ5O1xuLy8gICB9LCBbXSk7XG4vLyB9XG5cbi8qKlxuICogRmluZCBkZWZhdWx0IHBvaW50IGxheWVycyBmcm9tIGZpZWxkc1xuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGZpZWxkc1xuICogQHBhcmFtIHtBcnJheX0gZmllbGRQYWlyc1xuICogQHBhcmFtIHtzdHJpbmd9IGRhdGFJZFxuICogQHJldHVybnMge0FycmF5fSBmb3VuZCBwb2ludCBsYXllcnNcbiAqL1xuZnVuY3Rpb24gX2ZpbmREZWZhdWx0UG9pbnRMYXllcnMoZmllbGRzLCBmaWVsZFBhaXJzLCBkYXRhSWQpIHtcbiAgY29uc3QgbGF5ZXJzID0gW107XG5cbiAgLy8gTWFrZSBsYXllciBmb3IgZWFjaCBwYWlyXG4gIGZpZWxkUGFpcnMuZm9yRWFjaChwYWlyID0+IHtcbiAgICAvLyBmaW5kIGZpZWxkcyBmb3IgdGFibGVGaWVsZEluZGV4XG4gICAgY29uc3QgbGF0RmllbGQgPSBwYWlyLnBhaXIubGF0O1xuICAgIGNvbnN0IGxuZ0ZpZWxkID0gcGFpci5wYWlyLmxuZztcbiAgICBjb25zdCBsYXllck5hbWUgPSBwYWlyLmRlZmF1bHROYW1lO1xuXG4gICAgY29uc3QgcHJvcCA9IHtcbiAgICAgIGRhdGFJZCxcbiAgICAgIGxhYmVsOiBsYXllck5hbWUubGVuZ3RoID8gbGF5ZXJOYW1lIDogJ1BvaW50J1xuICAgIH07XG5cbiAgICAvLyBkZWZhdWx0IGxheWVyIGNvbG9yIGZvciBiZWdpbnRyaXAgYW5kIGRyb3BvZmYgcG9pbnRcbiAgICBpZiAobGF0RmllbGQudmFsdWUgaW4gREVGQVVMVF9MQVlFUl9DT0xPUikge1xuICAgICAgLy8gbmV3TGF5ZXIuY29sb3IgPSBoZXhUb1JnYihERUZBVUxUX0xBWUVSX0NPTE9SW2xhdEZpZWxkLm5hbWVdKTtcbiAgICAgIHByb3AuY29sb3IgPSBoZXhUb1JnYihERUZBVUxUX0xBWUVSX0NPTE9SW2xhdEZpZWxkLnZhbHVlXSk7XG4gICAgfVxuXG4gICAgLy8gc2V0IHRoZSBmaXJzdCBsYXllciB0byBiZSB2aXNpYmxlXG4gICAgaWYgKGxheWVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHByb3AuaXNWaXNpYmxlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdMYXllciA9IG5ldyBLZXBsZXJHTExheWVycy5Qb2ludExheWVyKHByb3ApO1xuICAgIG5ld0xheWVyLmNvbmZpZy5jb2x1bW5zID0ge1xuICAgICAgLi4ubmV3TGF5ZXIuY29uZmlnLmNvbHVtbnMsXG4gICAgICBsYXQ6IGxhdEZpZWxkLFxuICAgICAgbG5nOiBsbmdGaWVsZFxuICAgIH07XG5cbiAgICBsYXllcnMucHVzaChuZXdMYXllcik7XG4gIH0pO1xuXG4gIHJldHVybiBsYXllcnM7XG59XG5cbi8qKlxuICogRmluZCBkZWZhdWx0IGFyYyBsYXllcnMgZnJvbSBwb2ludCBsYXllcnMsIGlmIG5vbmVcbiAqIHVzZSB0aGUgZmlyc3QgdHdvIHBvaW50IGxheWVyIHRvIGNyZWF0ZSBhIGFyYyBsYXllclxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHBvaW50TGF5ZXJzXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGFJZFxuICogQHJldHVybnMge0FycmF5fSBmb3VuZCBhcmMgbGF5ZXJzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfZmluZERlZmF1bHRBcmNMYXllcnMocG9pbnRMYXllcnMsIHR5cGUgPSBMQVlFUl9UWVBFUy5hcmMsIGRhdGFJZCkge1xuXG4gIGlmIChwb2ludExheWVycy5sZW5ndGggPCAyKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgcHJvcHMgPSB7XG4gICAgZGF0YUlkLFxuICAgIGxhYmVsOiB0eXBlLFxuICAgIGNvbG9yOiBoZXhUb1JnYihERUZBVUxUX0xBWUVSX0NPTE9SLnRyaXBBcmMpXG4gIH07XG5cbiAgLy8gYWxsIHBvaW50IGxheWVyIGZpZWxkc1xuICBjb25zdCBmaWVsZHMgPSBwb2ludExheWVycy5yZWR1Y2UoKHByZXYsIGN1cnIpID0+XG4gICAgICBwcmV2LmNvbmNhdChPYmplY3QudmFsdWVzKGN1cnIuY29uZmlnLmNvbHVtbnMpKSwgW10pO1xuXG4gIC8vIGZvdW5kIHRoZSBkZWZhdWx0IHRyaXAgYXJjIGZpZWxkc1xuICBjb25zdCB0cmlwQXJjRmllbGRzID0gT2JqZWN0LmtleXMoVFJJUF9BUkNfRklFTERTKS5yZWR1Y2UoKHByZXYsIGtleSkgPT4ge1xuICAgIHByZXZba2V5XSA9IGZpZWxkcy5maW5kKGYgPT4gZi52YWx1ZSA9PT0gVFJJUF9BUkNfRklFTERTW2tleV0pO1xuICAgIHJldHVybiBwcmV2O1xuICB9LCB7fSk7XG5cbiAgaWYgKE9iamVjdC52YWx1ZXModHJpcEFyY0ZpZWxkcykuZXZlcnkoQm9vbGVhbikpIHtcbiAgICAvLyBpZiBhbGwgdHJpcCBhcmMgZmllbGRzIGZvdW5kXG4gICAgcHJvcHMuY29sdW1ucyA9IHRyaXBBcmNGaWVsZHM7XG4gICAgcHJvcHMubGFiZWwgPSAndHJpcCBhcmMnO1xuICB9IGVsc2Uge1xuICAgIC8vIGNvbm5lY3QgdGhlIGZpcnN0IHR3byBwb2ludCBsYXllciB3aXRoIGFyY1xuICAgIHByb3BzLmNvbHVtbnMgPSB7XG4gICAgICBsYXQwOiBwb2ludExheWVyc1swXS5jb25maWcuY29sdW1ucy5sYXQsXG4gICAgICBsbmcwOiBwb2ludExheWVyc1swXS5jb25maWcuY29sdW1ucy5sbmcsXG4gICAgICBsYXQxOiBwb2ludExheWVyc1sxXS5jb25maWcuY29sdW1ucy5sYXQsXG4gICAgICBsbmcxOiBwb2ludExheWVyc1sxXS5jb25maWcuY29sdW1ucy5sbmdcbiAgICB9O1xuICAgIHByb3BzLmxhYmVsID1cbiAgICAgIGAke3BvaW50TGF5ZXJzWzBdLmNvbmZpZy5sYWJlbH0gLT4gJHtwb2ludExheWVyc1sxXS5jb25maWcubGFiZWx9IGFyY2A7XG4gIH1cblxuICBjb25zdCB0cmlwQXJjTGF5ZXIgPSBuZXcgS2VwbGVyR0xMYXllcnMuQXJjTGF5ZXIocHJvcHMpO1xuXG4gIHJldHVybiBbdHJpcEFyY0xheWVyXTtcbn1cblxuLyoqXG4gKiBHaXZlbiBhIGFycmF5IG9mIHByZXNldCByZXF1aXJlZCBjb2x1bW4gbmFtZXNcbiAqIGZvdW5kIGZpZWxkIHRoYXQgaGFzIHRoZSBzYW1lIG5hbWUgdG8gc2V0IGFzIGxheWVyIGNvbHVtblxuICpcbiAqIEBwYXJhbSB7b2JqZWN0W119IGRlZmF1bHRGaWVsZHNcbiAqIEBwYXJhbSB7b2JqZWN0W119IGFsbEZpZWxkc1xuICogQHJldHVybnMge29iamVjdFtdIHwgbnVsbH0gYWxsIHBvc3NpYmxlIHJlcXVpcmVkIGxheWVyIGNvbHVtbiBwYWlyc1xuICovXG5mdW5jdGlvbiBfZmluZERlZmF1bHRDb2x1bW5GaWVsZChkZWZhdWx0RmllbGRzLCBhbGxGaWVsZHMpIHtcblxuICAvLyBmaW5kIGFsbCBtYXRjaGVkIGZpZWxkcyBmb3IgZWFjaCByZXF1aXJlZCBjb2xcbiAgY29uc3QgcmVxdWlyZWRDb2x1bW5zID0gT2JqZWN0LmtleXMoZGVmYXVsdEZpZWxkcykucmVkdWNlKChwcmV2LCBrZXkpID0+IHtcblxuICAgIGNvbnN0IHJlcXVpcmVkRmllbGRzID0gYWxsRmllbGRzLmZpbHRlcihmID0+IGYubmFtZSA9PT0gZGVmYXVsdEZpZWxkc1trZXldIHx8XG4gICAgZGVmYXVsdEZpZWxkc1trZXldLmluY2x1ZGVzKGYubmFtZSkpO1xuXG4gICAgcHJldltrZXldID0gcmVxdWlyZWRGaWVsZHMubGVuZ3RoID8gcmVxdWlyZWRGaWVsZHMubWFwKGYgPT4gKHtcbiAgICAgIHZhbHVlOiBmLm5hbWUsXG4gICAgICBmaWVsZElkeDogZi50YWJsZUZpZWxkSW5kZXggLSAxXG4gICAgfSkpIDogbnVsbDtcbiAgICByZXR1cm4gcHJldjtcbiAgfSwge30pO1xuXG4gIGlmICghT2JqZWN0LnZhbHVlcyhyZXF1aXJlZENvbHVtbnMpLmV2ZXJ5KEJvb2xlYW4pKSB7XG4gICAgLy8gaWYgYW55IGZpZWxkIG1pc3NpbmcsIHJldHVybiBudWxsXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gX2dldEFsbFBvc3NpYmxlQ29sdW1uUGFyaXMocmVxdWlyZWRDb2x1bW5zKTtcbn1cblxuLyoqXG4gKiBHaXZlbiBhIHNldCBvZiBjb2x1bW5lcyBhbmQgYWxsIGl0cyBwb3NzaWJsZSB2YWx1ZXNcbiAqIHJldHVybiBhbGwgcG9zc2libGUgY29tYmluYXRpb25zXG4gKiBlLGcgd2hlbiByZXF1aXJlZENvbHVtbnMgPSB7ZjogWzEsIDJdLCBiOiBbJ2EnLCAnYiddfVxuICogcmV0dXJuIFt7ZjogMSwgYjogJ2EnfSwge2Y6IDEsIGI6ICdiJ30sIHtmOiAyLCBiOiAnYSd9LCB7ZjogMiwgYjogJ2InfV1cbiAqIGFzIDQgcG9zc2libGUgcGFpcnNcbiAqIEBwYXJhbSB7b2JqZWN0fSByZXF1aXJlZENvbHVtbnNcbiAqIEByZXR1cm5zIHtvYmplY3RbXX0gcGFpcnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9nZXRBbGxQb3NzaWJsZUNvbHVtblBhcmlzKHJlcXVpcmVkQ29sdW1ucykge1xuICAvLyBmb3IgbXVsdGlwbGUgbWF0Y2hlZCBmaWVsZCBmb3Igb25lIHJlcXVpcmVkIGNvbHVtbiwgcmV0dXJuIG11bHRpcGxlXG4gIC8vIGNvbWJpbmF0aW9ucywgZS4gZy4gaWYgY29sdW1uIGEgaGFzIDIgbWF0Y2hlZCwgY29sdW1uIGIgaGFzIDMgbWF0Y2hlZFxuICAvLyA2IHBvc3NpYmxlIGNvbHVtbiBwYWlycyB3aWxsIGJlIHJldHVybmVkXG4gIGNvbnN0IGFsbEtleXMgPSBPYmplY3Qua2V5cyhyZXF1aXJlZENvbHVtbnMpO1xuICBjb25zdCBwb2ludGVycyA9IGFsbEtleXMubWFwKChrLCBpKSA9PiBpID09PSBhbGxLZXlzLmxlbmd0aCAtIDEgPyAtMSA6IDApO1xuICBjb25zdCBjb3VudFBlcktleSA9IGFsbEtleXMubWFwKGsgPT4gcmVxdWlyZWRDb2x1bW5zW2tdLmxlbmd0aCk7XG4gIGNvbnN0IHBhaXJzID0gW107XG5cbiAgLyogZXNsaW50LWRpc2FibGUgbm8tbG9vcC1mdW5jICovXG4gIHdoaWxlIChpbmNyZW1lbnRQb2ludGVycyhwb2ludGVycywgY291bnRQZXJLZXksIHBvaW50ZXJzLmxlbmd0aCAtIDEpKSB7XG4gICAgY29uc3QgbmV3UGFpciA9IHBvaW50ZXJzLnJlZHVjZSgocHJldiwgY3V1ciwgaSkgPT4ge1xuICAgICAgcHJldlthbGxLZXlzW2ldXSA9IHJlcXVpcmVkQ29sdW1uc1thbGxLZXlzW2ldXVtjdXVyXTtcbiAgICAgIHJldHVybiBwcmV2O1xuICAgIH0sIHt9KTtcblxuICAgIHBhaXJzLnB1c2gobmV3UGFpcik7XG4gIH1cbiAgLyogZXNsaW50LWVuYWJsZSBuby1sb29wLWZ1bmMgKi9cblxuICAvLyByZWN1cnNpdmVseSBpbmNyZW1lbnQgcG9pbnRlcnNcbiAgZnVuY3Rpb24gaW5jcmVtZW50UG9pbnRlcnMocHRzLCBjb3VudHMsIGluZGV4KSB7XG4gICAgaWYgKGluZGV4ID09PSAwICYmIHB0c1swXSA9PT0gY291bnRzWzBdIC0gMSkge1xuICAgICAgLy8gbm90aGluZyB0byBpbmNyZW1lbnRcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAocHRzW2luZGV4XSArIDEgPCBjb3VudHNbaW5kZXhdKSB7XG4gICAgICBwdHNbaW5kZXhdID0gcHRzW2luZGV4XSArIDE7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwdHNbaW5kZXhdID0gMDtcbiAgICByZXR1cm4gaW5jcmVtZW50UG9pbnRlcnMocHRzLCBjb3VudHMsIGluZGV4IC0gMSk7XG4gIH1cblxuICByZXR1cm4gcGFpcnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfZmluZERlZmF1bHRHZW9qc29uTGF5ZXIoZmllbGRzLCBkYXRhSWQsIGxhYmVsKSB7XG4gIGNvbnN0IGZpbmRHZW9qc29uQ29sdW1uID0gZmllbGRzXG4gICAgLmZpbHRlcihmID0+IGYudHlwZSA9PT0gQUxMX0ZJRUxEX1RZUEVTLmdlb2pzb24pXG4gICAgLm1hcChmID0+IGYubmFtZSk7XG5cbiAgY29uc3QgZGVmYXVsdENvbHVtbnMgPSB7XG4gICAgZ2VvanNvbjogdW5pcShbLi4uR0VPSlNPTl9GSUVMRFMuZ2VvanNvbiwgLi4uZmluZEdlb2pzb25Db2x1bW5dKVxuICB9O1xuXG4gIHJldHVybiBfZmluZERlZmF1bHRGZWF0dXJlTGF5ZXIoe1xuICAgIGZpZWxkcyxcbiAgICBkZWZhdWx0Q29sdW1ucyxcbiAgICB0eXBlOiBMQVlFUl9UWVBFUy5nZW9qc29uLFxuICAgIGRhdGFJZCxcbiAgICBsYWJlbFxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9maW5kRGVmYXVsdENsdXN0ZXJMYXllcnMocG9pbnRMYXllcnMpIHtcbiAgcmV0dXJuIF9maW5kRGVmYXVsdEFnZ3JlZ2F0aW9uTGF5ZXJzKHBvaW50TGF5ZXJzLCBMQVlFUl9UWVBFUy5jbHVzdGVyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9maW5kRGVmYXVsdEZlYXR1cmVMYXllcih7ZmllbGRzLCBkZWZhdWx0Q29sdW1ucywgdHlwZSwgbGFiZWwsIGRhdGFJZH0pIHtcbiAgLy8gZmluZCBhbGwgcG9zc2libGUgcmVxdWlyZWQgY29sdW1uIHBhaXJzXG4gIGNvbnN0IGNvbHVtbnMgPSBfZmluZERlZmF1bHRDb2x1bW5GaWVsZChkZWZhdWx0Q29sdW1ucywgZmllbGRzKTtcblxuICBpZiAoIWNvbHVtbnMgfHwgIWNvbHVtbnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgcHJvcHMgPSB7XG4gICAgZGF0YUlkLFxuICAgIGxhYmVsOiAodHlwZW9mIGxhYmVsID09PSAnc3RyaW5nJyAmJiBsYWJlbC5yZXBsYWNlKC9cXC5bXi8uXSskLywgJycpKSB8fCB0eXBlLFxuICAgIGlzVmlzaWJsZTogdHJ1ZVxuICB9O1xuXG4gIGNvbnN0IExheWVyQ2xhc3MgPSBLZXBsZXJHTExheWVyc1tMQVlFUl9DTEFTU0VTW3R5cGVdXTtcblxuICAvLyBjcmVhdGUgb25lIGxheWVyIGZvciBlYWNoIHBvc3NpYmxlIGNvbHVtbiBwYXJpc1xuICByZXR1cm4gY29sdW1ucy5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHtcbiAgICBjb25zdCBuZXdMYXllciA9IG5ldyBMYXllckNsYXNzKHsuLi5wcm9wcywgY29sdW1uczogY3Vycn0pO1xuICAgIHByZXYucHVzaChuZXdMYXllcik7XG4gICAgcmV0dXJuIHByZXY7XG4gIH0sIFtdKTtcbn1cblxuLyoqXG4gKiBGaW5kIGRlZmF1bHQgaGV4Z29uSWQgbGF5ZXJzIGZyb20gZmllbGRzXG4gKlxuICogQHBhcmFtIHtBcnJheX0gZmllbGRzXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YUlkXG4gKiBAcmV0dXJucyB7QXJyYXl9IGZvdW5kIHBhdGggbGF5ZXJzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfZmluZERlZmF1bHRIZXhhZ29uSWRMYXllcihmaWVsZHMsIGRhdGFJZCkge1xuICByZXR1cm4gX2ZpbmREZWZhdWx0RmVhdHVyZUxheWVyKHtcbiAgICBmaWVsZHMsIGRlZmF1bHRDb2x1bW5zOiBIRVhBR09OX0lEX0ZJRUxEUyxcbiAgICB0eXBlOiBMQVlFUl9UWVBFUy5oZXhhZ29uSWQsIGxhYmVsOiAnSGV4YWdvbicsIGRhdGFJZFxuICB9KTtcbn1cblxuLyoqXG4gKiBGaW5kIGRlZmF1bHQgaWNvbiBsYXllcnMgZnJvbSBmaWVsZHNcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBwb2ludExheWVyc1xuICogQHBhcmFtIHtBcnJheX0gZmllbGRzXG4gKiBAcmV0dXJucyB7QXJyYXl9IGZvdW5kIGljb24gbGF5ZXJzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfZmluZERlZmF1bHRJY29uTGF5ZXJzKHBvaW50TGF5ZXJzLCBmaWVsZHMpIHtcblxuICBpZiAoIXBvaW50TGF5ZXJzLmxlbmd0aCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IGljb25GaWVsZHMgPSBmaWVsZHMuZmlsdGVyKCh7bmFtZX0pID0+XG4gICAgbmFtZS5yZXBsYWNlKC9bXywuXSsvZywgJyAnKS50cmltKCkuc3BsaXQoJyAnKVxuICAgICAgLnNvbWUoc2VnID0+IElDT05fRklFTERTLmljb24uc29tZSh0ID0+IHQuaW5jbHVkZXMoc2VnKSkpKTtcblxuICBpZiAoIWljb25GaWVsZHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIC8vIGNyZWF0ZSBpY29uIGxheWVycyBmb3IgZmlyc3QgcG9pbnQgbGF5ZXJcbiAgY29uc3QgcHRMYXllciA9IHBvaW50TGF5ZXJzWzBdO1xuXG4gIGNvbnN0IHByb3BzID0ge1xuICAgIGRhdGFJZDogcHRMYXllci5jb25maWcuZGF0YUlkLFxuICAgIGNvbHVtbnM6IHtcbiAgICAgIGxhdDogcHRMYXllci5jb25maWcuY29sdW1ucy5sYXQsXG4gICAgICBsbmc6IHB0TGF5ZXIuY29uZmlnLmNvbHVtbnMubG5nXG4gICAgfSxcbiAgICBpc1Zpc2libGU6IHRydWVcbiAgfTtcblxuICBjb25zdCBMYXllckNsYXNzID0gS2VwbGVyR0xMYXllcnNbTEFZRVJfQ0xBU1NFUy5pY29uXTtcblxuICByZXR1cm4gaWNvbkZpZWxkcy5tYXAoaWNvbkZpZWxkID0+IG5ldyBMYXllckNsYXNzKHtcbiAgICAuLi5wcm9wcyxcbiAgICBsYWJlbDogaWNvbkZpZWxkLm5hbWUucmVwbGFjZSgvW18sLl0rL2csICcgJykudHJpbSgpLFxuICAgIGNvbHVtbnM6IHtcbiAgICAgIC4uLnByb3BzLmNvbHVtbnMsXG4gICAgICBpY29uOiB7XG4gICAgICAgIHZhbHVlOiBpY29uRmllbGQubmFtZSxcbiAgICAgICAgZmllbGRJZHg6IGljb25GaWVsZC50YWJsZUZpZWxkSW5kZXggLSAxXG4gICAgICB9XG4gICAgfVxuICB9KSk7XG59XG5cbi8qKlxuICogRmluZCBkZWZhdWx0IGdyaWQgbGF5ZXJzIGZyb20gZmllbGRzXG4gKlxuICogQHBhcmFtIHtBcnJheX0gcG9pbnRMYXllcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcmV0dXJucyB7QXJyYXl9IGFuIGFycmF5IG9mIGZvdW5kZWQgZ3JpZCBsYXllcnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9maW5kRGVmYXVsdEFnZ3JlZ2F0aW9uTGF5ZXJzKHBvaW50TGF5ZXJzLCB0eXBlKSB7XG5cbiAgaWYgKCFwb2ludExheWVycy5sZW5ndGgpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvLyBvbmx5IGNyZWF0ZSBvbmUgYWdncmVnYXRpb24gbGF5ZXJcbiAgY29uc3QgcHRMYXllciA9IHBvaW50TGF5ZXJzWzBdO1xuXG4gIGNvbnN0IHByb3BzID0ge1xuICAgIGRhdGFJZDogcHRMYXllci5jb25maWcuZGF0YUlkLFxuICAgIGxhYmVsOiBgJHtwdExheWVyLmNvbmZpZy5sYWJlbH0gJHt0eXBlfWBcbiAgfTtcblxuICBjb25zdCBMYXllckNsYXNzID0gS2VwbGVyR0xMYXllcnNbTEFZRVJfQ0xBU1NFU1t0eXBlXV07XG4gIGNvbnN0IG5ld0xheWVyID0gbmV3IExheWVyQ2xhc3MocHJvcHMpO1xuXG4gIC8vIGNvcHkgcG9pbnQgbGF5ZXIgY29sdW1ucyBvdmVyXG4gIG5ld0xheWVyLmNvbmZpZy5jb2x1bW5zID0gT2JqZWN0LmtleXMobmV3TGF5ZXIuY29uZmlnLmNvbHVtbnMpLnJlZHVjZSgoYWNjdSwga2V5KSA9PiAoe1xuICAgIC4uLmFjY3UsXG4gICAgW2tleV06IHsuLi5wdExheWVyLmNvbmZpZy5jb2x1bW5zW2tleV19XG4gIH0pLCB7fSk7XG5cbiAgcmV0dXJuIFtuZXdMYXllcl07XG59XG5cbi8qKlxuICogY2FsY3VsYXRlIGxheWVyIGRhdGEgYmFzZWQgb24gbGF5ZXIgdHlwZSwgY29sIENvbmZpZyxcbiAqIHJldHVybiB1cGRhdGVkIGxheWVyIGlmIGNvbG9yRG9tYWluLCBkYXRhTWFwIGhhcyBjaGFuZ2VkXG4gKiBAcGFyYW0ge29iamVjdH0gbGF5ZXJcbiAqIEBwYXJhbSB7b2JqZWN0fSBzdGF0ZVxuICogQHBhcmFtIHtvYmplY3R9IG9sZExheWVyRGF0YVxuICogQHBhcmFtIHtvYmplY3R9IG9wdFxuICogQHJldHVybnMge29iamVjdH0ge2xheWVyRGF0YToge30sIGxheWVyOiB7fSB8fCB1bmRlZmluZWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYWxjdWxhdGVMYXllckRhdGEobGF5ZXIsIHN0YXRlLCBvbGRMYXllckRhdGEsIG9wdCA9IHt9KSB7XG4gIGNvbnN0IHt0eXBlfSA9IGxheWVyO1xuICBjb25zdCB7ZGF0YXNldHN9ID0gc3RhdGU7XG5cbiAgY29uc3Qge2RhdGEsIGZpbHRlcmVkSW5kZXgsIGFsbERhdGF9ID0gZGF0YXNldHNbbGF5ZXIuY29uZmlnLmRhdGFJZF0gfHwge307XG5cbiAgaWYgKCF0eXBlIHx8ICFsYXllci5oYXNBbGxDb2x1bW5zKCkpIHtcbiAgICByZXR1cm4ge2xheWVyLCBsYXllckRhdGE6IHt9fTtcbiAgfVxuXG4gIGNvbnN0IGxheWVyRGF0YSA9IGxheWVyLmZvcm1hdExheWVyRGF0YShkYXRhLCBhbGxEYXRhLCBmaWx0ZXJlZEluZGV4LCBvbGRMYXllckRhdGEsIG9wdCk7XG4gIHJldHVybiB7bGF5ZXJEYXRhLCBsYXllcn07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMaWdodFNldHRpbmdzRnJvbUJvdW5kcyhib3VuZHMpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYm91bmRzKSAmJiBib3VuZHMubGVuZ3RoID49IDQgPyB7XG4gICAgLi4uREVGQVVMVF9MSUdIVF9TRVRUSU5HUyxcbiAgICBsaWdodHNQb3NpdGlvbjogW1xuICAgICAgLi4uYm91bmRzLnNsaWNlKDAsIDIpLFxuICAgICAgREVGQVVMVF9MSUdIVF9TRVRUSU5HUy5saWdodHNQb3NpdGlvblsyXSxcbiAgICAgIC4uLmJvdW5kcy5zbGljZSgyLCA0KSxcbiAgICAgIERFRkFVTFRfTElHSFRfU0VUVElOR1MubGlnaHRzUG9zaXRpb25bNV1cbiAgICBdXG4gIH0gOiBERUZBVUxUX0xJR0hUX1NFVFRJTkdTO1xufVxuIl19