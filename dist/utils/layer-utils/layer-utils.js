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
    fields: fields,
    defaultColumns: _defaultSettings.HEXAGON_ID_FIELDS,
    type: _defaultSettings.LAYER_TYPES.hexagonId,
    label: 'Hexagon',
    dataId: dataId
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9sYXllci11dGlscy9sYXllci11dGlscy5qcyJdLCJuYW1lcyI6WyJhc3NpZ25Qcm9wVG9FbXB0eUxheWVyIiwiZmluZERlZmF1bHRMYXllciIsIl9maW5kRGVmYXVsdEFyY0xheWVycyIsIl9nZXRBbGxQb3NzaWJsZUNvbHVtblBhcmlzIiwiX2ZpbmREZWZhdWx0R2VvanNvbkxheWVyIiwiX2ZpbmREZWZhdWx0Q2x1c3RlckxheWVycyIsIl9maW5kRGVmYXVsdEZlYXR1cmVMYXllciIsIl9maW5kRGVmYXVsdEhleGFnb25JZExheWVyIiwiX2ZpbmREZWZhdWx0SWNvbkxheWVycyIsIl9maW5kRGVmYXVsdEFnZ3JlZ2F0aW9uTGF5ZXJzIiwiY2FsY3VsYXRlTGF5ZXJEYXRhIiwiZ2V0TGlnaHRTZXR0aW5nc0Zyb21Cb3VuZHMiLCJLZXBsZXJHTExheWVycyIsIkRFRkFVTFRfTEFZRVJfQ09MT1IiLCJ0cmlwQXJjIiwiYXF1YSIsImJlZ2ludHJpcF9sYXQiLCJvcmNoaWQiLCJkcm9wb2ZmX2xhdCIsInRyZWVfcG9wcHkiLCJyZXF1ZXN0X2xhdCIsInBvcnRhZ2UiLCJlbXB0eUxheWVyIiwibGF5ZXIiLCJub3RUb092ZXJyaWRlIiwibm90VG9EZWVwTWVyZ2UiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsImluY2x1ZGVzIiwiZmllbGRzIiwiZmllbGRQYWlycyIsImRhdGFJZCIsImlkIiwibGFiZWwiLCJwb2ludExheWVycyIsIl9maW5kRGVmYXVsdFBvaW50TGF5ZXJzIiwiYXJjTGF5ZXJzIiwiZ2VvanNvbkxheWVycyIsImljb25MYXllcnMiLCJoZXhhZ29uSWRMYXllcnMiLCJsYXllcnMiLCJsYXRGaWVsZCIsInBhaXIiLCJsYXQiLCJsbmdGaWVsZCIsImxuZyIsImxheWVyTmFtZSIsImRlZmF1bHROYW1lIiwicHJvcCIsImxlbmd0aCIsInZhbHVlIiwiY29sb3IiLCJpc1Zpc2libGUiLCJuZXdMYXllciIsIlBvaW50TGF5ZXIiLCJjb25maWciLCJjb2x1bW5zIiwicHVzaCIsInR5cGUiLCJhcmMiLCJwcm9wcyIsInJlZHVjZSIsInByZXYiLCJjdXJyIiwiY29uY2F0IiwidmFsdWVzIiwidHJpcEFyY0ZpZWxkcyIsImZpbmQiLCJmIiwiZXZlcnkiLCJCb29sZWFuIiwibGF0MCIsImxuZzAiLCJsYXQxIiwibG5nMSIsInRyaXBBcmNMYXllciIsIkFyY0xheWVyIiwiX2ZpbmREZWZhdWx0Q29sdW1uRmllbGQiLCJkZWZhdWx0RmllbGRzIiwiYWxsRmllbGRzIiwicmVxdWlyZWRDb2x1bW5zIiwicmVxdWlyZWRGaWVsZHMiLCJmaWx0ZXIiLCJuYW1lIiwibWFwIiwiZmllbGRJZHgiLCJ0YWJsZUZpZWxkSW5kZXgiLCJhbGxLZXlzIiwicG9pbnRlcnMiLCJrIiwiaSIsImNvdW50UGVyS2V5IiwicGFpcnMiLCJpbmNyZW1lbnRQb2ludGVycyIsIm5ld1BhaXIiLCJjdXVyIiwicHRzIiwiY291bnRzIiwiaW5kZXgiLCJmaW5kR2VvanNvbkNvbHVtbiIsImdlb2pzb24iLCJkZWZhdWx0Q29sdW1ucyIsImNsdXN0ZXIiLCJyZXBsYWNlIiwiTGF5ZXJDbGFzcyIsImhleGFnb25JZCIsImljb25GaWVsZHMiLCJ0cmltIiwic3BsaXQiLCJzb21lIiwiaWNvbiIsInQiLCJzZWciLCJwdExheWVyIiwiaWNvbkZpZWxkIiwiYWNjdSIsInN0YXRlIiwib2xkTGF5ZXJEYXRhIiwib3B0IiwiZGF0YXNldHMiLCJkYXRhIiwiZmlsdGVyZWRJbmRleCIsImFsbERhdGEiLCJoYXNBbGxDb2x1bW5zIiwibGF5ZXJEYXRhIiwiZm9ybWF0TGF5ZXJEYXRhIiwiYm91bmRzIiwiQXJyYXkiLCJpc0FycmF5IiwibGlnaHRzUG9zaXRpb24iLCJzbGljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztRQW1DZ0JBLHNCLEdBQUFBLHNCO1FBNkJBQyxnQixHQUFBQSxnQjtRQXdJQUMscUIsR0FBQUEscUI7UUEwRkFDLDBCLEdBQUFBLDBCO1FBdUNB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SUFBRCxJQUFTLENBQUNyQyxNQUFNc0csYUFBTixFQUFkLEVBQXFDO0FBQ25DLFdBQU8sRUFBQ3RHLFlBQUQsRUFBUXVHLFdBQVcsRUFBbkIsRUFBUDtBQUNEOztBQUVELE1BQU1BLFlBQVl2RyxNQUFNd0csZUFBTixDQUNoQkwsSUFEZ0IsRUFFaEJFLE9BRmdCLEVBR2hCRCxhQUhnQixFQUloQkosWUFKZ0IsRUFLaEJDLEdBTGdCLENBQWxCO0FBT0EsU0FBTyxFQUFDTSxvQkFBRCxFQUFZdkcsWUFBWixFQUFQO0FBQ0Q7O0FBRU0sU0FBU1osMEJBQVQsQ0FBb0NxSCxNQUFwQyxFQUE0QztBQUNqRCxTQUFPQyxNQUFNQyxPQUFOLENBQWNGLE1BQWQsS0FBeUJBLE9BQU83RSxNQUFQLElBQWlCLENBQTFDO0FBR0RnRiw4QkFDS0gsT0FBT0ksS0FBUCxDQUFhLENBQWIsRUFBZ0IsQ0FBaEIsQ0FETCxHQUVFLHdDQUF1QkQsY0FBdkIsQ0FBc0MsQ0FBdEMsQ0FGRixHQUdLSCxPQUFPSSxLQUFQLENBQWEsQ0FBYixFQUFnQixDQUFoQixDQUhMLEdBSUUsd0NBQXVCRCxjQUF2QixDQUFzQyxDQUF0QyxDQUpGO0FBSEMsOENBQVA7QUFXRCIsImZpbGUiOiJsYXllci11dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB1bmlxIGZyb20gJ2xvZGFzaC51bmlxJztcblxuaW1wb3J0IHtcbiAgQUxMX0ZJRUxEX1RZUEVTLFxuICBERUZBVUxUX0xJR0hUX1NFVFRJTkdTLFxuICBHRU9KU09OX0ZJRUxEUyxcbiAgSEVYQUdPTl9JRF9GSUVMRFMsXG4gIElDT05fRklFTERTLFxuICBMQVlFUl9UWVBFUyxcbiAgVFJJUF9BUkNfRklFTERTLFxuICBMQVlFUl9DTEFTU0VTXG59IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuaW1wb3J0IHtub3ROdWxsb3JVbmRlZmluZWQsIGlzUGxhaW5PYmplY3R9IGZyb20gJ3V0aWxzL2RhdGEtdXRpbHMnO1xuaW1wb3J0IHtoZXhUb1JnYn0gZnJvbSAndXRpbHMvY29sb3ItdXRpbHMnO1xuXG5pbXBvcnQgKiBhcyBLZXBsZXJHTExheWVycyBmcm9tICdrZXBsZXJnbC1sYXllcnMnO1xuXG5pbXBvcnQge3ViZXJEYXRhVml6Q29sb3JzfSBmcm9tICdjb25zdGFudHMvdWJlci12aXotY29sb3JzJztcblxuY29uc3QgREVGQVVMVF9MQVlFUl9DT0xPUiA9IHtcbiAgdHJpcEFyYzogdWJlckRhdGFWaXpDb2xvcnMuYXF1YSxcbiAgYmVnaW50cmlwX2xhdDogdWJlckRhdGFWaXpDb2xvcnMub3JjaGlkLFxuICBkcm9wb2ZmX2xhdDogdWJlckRhdGFWaXpDb2xvcnMudHJlZV9wb3BweSxcbiAgcmVxdWVzdF9sYXQ6IHViZXJEYXRhVml6Q29sb3JzLnBvcnRhZ2Vcbn07XG5cbi8qKlxuICogcmVjdXJzaXZlbHkgYXNzaWduIGFsbCB2YWx1ZSBvZiBzYXZlZCBsYXllciB0byBhIG1pbnQgbGF5ZXJcbiAqIHJlYXNvbiB3ZSBkb24ndCB1c2UgbWVyZ2UgaGVyZSBpcyB0byBtYWtlIHN1cmUgb25seSBhc3NpZ25cbiAqIHByb3BlcnR5IHRoYXQncyBpbiBhbiBlbXB0eSBsYXllclxuICogQHBhcmFtIHtPYmplY3R9IGVtcHR5TGF5ZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBsYXllclxuICogQHJldHVybiB7T2JqZWN0fSAtIGxheWVyIHdpdGggdmFsdWVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzc2lnblByb3BUb0VtcHR5TGF5ZXIoZW1wdHlMYXllciwgbGF5ZXIpIHtcbiAgY29uc3Qgbm90VG9PdmVycmlkZSA9IFsndHlwZScsICdpc0FnZ3JlZ2F0ZWQnXTtcbiAgY29uc3Qgbm90VG9EZWVwTWVyZ2UgPSBbJ2NvbG9yRmllbGQnLCAnc2l6ZUZpZWxkJ107XG5cbiAgT2JqZWN0LmtleXMoZW1wdHlMYXllcikuZm9yRWFjaChrZXkgPT4ge1xuICAgIGlmIChcbiAgICAgIGlzUGxhaW5PYmplY3QoZW1wdHlMYXllcltrZXldKSAmJlxuICAgICAgaXNQbGFpbk9iamVjdChsYXllcltrZXldKSAmJlxuICAgICAgIW5vdFRvRGVlcE1lcmdlLmluY2x1ZGVzKGtleSlcbiAgICApIHtcbiAgICAgIC8vIHJlY3Vyc2l2ZWx5IGFzc2lnbiBvYmplY3RcbiAgICAgIGVtcHR5TGF5ZXJba2V5XSA9IGFzc2lnblByb3BUb0VtcHR5TGF5ZXIoZW1wdHlMYXllcltrZXldLCBsYXllcltrZXldKTtcbiAgICB9IGVsc2UgaWYgKG5vdE51bGxvclVuZGVmaW5lZChsYXllcltrZXldKSAmJiAhbm90VG9PdmVycmlkZS5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICBlbXB0eUxheWVyW2tleV0gPSBsYXllcltrZXldO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGVtcHR5TGF5ZXI7XG59XG5cbi8qKlxuICogRmluZCBkZWZhdWx0IGxheWVycyBmcm9tIGZpZWxkc1xuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGZpZWxkc1xuICogQHBhcmFtIHtBcnJheX0gZmllbGRQYWlyc1xuICogQHBhcmFtIHtzdHJpbmd9IGRhdGFJZFxuICogQHBhcmFtIHtzdHJpbmd9IGxhYmVsXG4gKiBAcmV0dXJucyB7QXJyYXl9IGZvdW5kIGxheWVyc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZERlZmF1bHRMYXllcih7ZmllbGRzLCBmaWVsZFBhaXJzLCBpZDogZGF0YUlkLCBsYWJlbH0pIHtcbiAgaWYgKCFmaWVsZHMpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCBwb2ludExheWVycyA9IF9maW5kRGVmYXVsdFBvaW50TGF5ZXJzKGZpZWxkcywgZmllbGRQYWlycywgZGF0YUlkKTtcbiAgY29uc3QgYXJjTGF5ZXJzID0gX2ZpbmREZWZhdWx0QXJjTGF5ZXJzKHBvaW50TGF5ZXJzLCAnYXJjJywgZGF0YUlkKTtcbiAgLy8gY29uc3QgY2x1c3RlckxheWVycyA9IF9maW5kRGVmYXVsdENsdXN0ZXJMYXllcnMocG9pbnRMYXllcnMsIGRhdGFJZCk7XG4gIGNvbnN0IGdlb2pzb25MYXllcnMgPSBfZmluZERlZmF1bHRHZW9qc29uTGF5ZXIoZmllbGRzLCBkYXRhSWQsIGxhYmVsKTtcbiAgY29uc3QgaWNvbkxheWVycyA9IF9maW5kRGVmYXVsdEljb25MYXllcnMocG9pbnRMYXllcnMsIGZpZWxkcywgZGF0YUlkKTtcbiAgY29uc3QgaGV4YWdvbklkTGF5ZXJzID0gX2ZpbmREZWZhdWx0SGV4YWdvbklkTGF5ZXIoZmllbGRzLCBkYXRhSWQpO1xuXG4gIC8vIGZvciBwZXJmb3JtYW5jZSwgZG8gbm90IGNyZWF0ZSB0b28gbWFueSBkZWZhdWx0IGxheWVyc3NcbiAgLy8gY29uc3QgaGV4YWdvbkxheWVyID0gX2ZpbmREZWZhdWx0QWdncmVnYXRpb25MYXllcnMocG9pbnRMYXllcnMsICdoZXhhZ29uJyk7XG4gIC8vIGNvbnN0IGdyaWRMYXllciA9IF9maW5kRGVmYXVsdEFnZ3JlZ2F0aW9uTGF5ZXJzKHBvaW50TGF5ZXJzLCAnZ3JpZCcpO1xuXG4gIHJldHVybiBbXG4gICAgLy8gLi4uaGV4YWdvbkxheWVyLFxuICAgIC8vIC4uLmdyaWRMYXllcixcbiAgICAvLyAuLi5jbHVzdGVyTGF5ZXJzLFxuICAgIC4uLmFyY0xheWVycyxcbiAgICAuLi5oZXhhZ29uSWRMYXllcnMsXG4gICAgLi4uZ2VvanNvbkxheWVycyxcbiAgICAuLi5wb2ludExheWVycyxcbiAgICAuLi5pY29uTGF5ZXJzXG4gIF07XG59XG5cbi8vIGZ1bmN0aW9uIHJlbW92ZVN1ZmZpeEFuZERlbGltaXRlcnMobGF5ZXJOYW1lLCBzdWZmaXgpIHtcbi8vICAgcmV0dXJuIGxheWVyTmFtZVxuLy8gICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoc3VmZml4LCAnaWcnKSwgJycpXG4vLyAgICAgLnJlcGxhY2UoL1tfLC5dKy9nLCAnICcpXG4vLyAgICAgLnRyaW0oKTtcbi8vIH1cblxuLyoqXG4gKiBGaW5kIHBvaW50IGZpZWxkcyBwYWlycyBmcm9tIGZpZWxkc1xuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGZpZWxkc1xuICogQHJldHVybnMge0FycmF5fSBmb3VuZCBwb2ludCBmaWVsZHNcbiAqL1xuLy8gZXhwb3J0IGZ1bmN0aW9uIGZpbmRQb2ludEZpZWxkUGFpcnMoZmllbGRzKSB7XG4vLyAgIGNvbnN0IGFsbE5hbWVzID0gZmllbGRzLm1hcChmID0+IGYubmFtZS50b0xvd2VyQ2FzZSgpKTtcbi8vXG4vLyAgIC8vIGdldCBsaXN0IG9mIGFsbCBmaWVsZHMgd2l0aCBtYXRjaGluZyBzdWZmaXhlc1xuLy8gICByZXR1cm4gYWxsTmFtZXMucmVkdWNlKChjYXJyeSwgZmllbGROYW1lLCBpZHgpID0+IHtcbi8vICAgICAvLyBUaGlzIHNlYXJjaCBmb3IgcGFpcnMgd2lsbCBlYXJseSBleGl0IGlmIGZvdW5kLlxuLy8gICAgIGZvciAoY29uc3Qgc3VmZml4UGFpciBvZiBUUklQX1BPSU5UX0ZJRUxEUykge1xuLy8gICAgICAgLy8gbWF0Y2ggZmlyc3Qgc3VmZml4YGBgXG4vLyAgICAgICBpZiAoZmllbGROYW1lLmVuZHNXaXRoKHN1ZmZpeFBhaXJbMF0pKSB7XG4vLyAgICAgICAgIC8vIG1hdGNoIHNlY29uZCBzdWZmaXhcbi8vICAgICAgICAgY29uc3Qgb3RoZXJQYXR0ZXJuID0gbmV3IFJlZ0V4cChgJHtzdWZmaXhQYWlyWzBdfVxcJGApO1xuLy8gICAgICAgICBjb25zdCBwYXJ0bmVyID0gZmllbGROYW1lLnJlcGxhY2Uob3RoZXJQYXR0ZXJuLCBzdWZmaXhQYWlyWzFdKTtcbi8vXG4vLyAgICAgICAgIGNvbnN0IHBhcnRuZXJJZHggPSBhbGxOYW1lcy5maW5kSW5kZXgoZCA9PiBkID09PSBwYXJ0bmVyKTtcbi8vICAgICAgICAgaWYgKHBhcnRuZXJJZHggPiAtMSkge1xuLy8gICAgICAgICAgIGNvbnN0IGRlZmF1bHROYW1lID0gcmVtb3ZlU3VmZml4QW5kRGVsaW1pdGVycyhmaWVsZE5hbWUsIHN1ZmZpeFBhaXJbMF0pO1xuLy9cbi8vICAgICAgICAgICBjYXJyeS5wdXNoKHtcbi8vICAgICAgICAgICAgIGRlZmF1bHROYW1lLFxuLy8gICAgICAgICAgICAgcGFpcjoge1xuLy8gICAgICAgICAgICAgICBsYXQ6IHtcbi8vICAgICAgICAgICAgICAgICBmaWVsZElkeDogaWR4LFxuLy8gICAgICAgICAgICAgICAgIHZhbHVlOiBmaWVsZHNbaWR4XS5uYW1lXG4vLyAgICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICAgIGxuZzoge1xuLy8gICAgICAgICAgICAgICAgIGZpZWxkSWR4OiBwYXJ0bmVySWR4LFxuLy8gICAgICAgICAgICAgICAgIHZhbHVlOiBmaWVsZHNbcGFydG5lcklkeF0ubmFtZVxuLy8gICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICAgc3VmZml4OiBzdWZmaXhQYWlyXG4vLyAgICAgICAgICAgfSk7XG4vLyAgICAgICAgICAgcmV0dXJuIGNhcnJ5O1xuLy8gICAgICAgICB9XG4vLyAgICAgICB9XG4vLyAgICAgfVxuLy8gICAgIHJldHVybiBjYXJyeTtcbi8vICAgfSwgW10pO1xuLy8gfVxuXG4vKipcbiAqIEZpbmQgZGVmYXVsdCBwb2ludCBsYXllcnMgZnJvbSBmaWVsZHNcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBmaWVsZHNcbiAqIEBwYXJhbSB7QXJyYXl9IGZpZWxkUGFpcnNcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhSWRcbiAqIEByZXR1cm5zIHtBcnJheX0gZm91bmQgcG9pbnQgbGF5ZXJzXG4gKi9cbmZ1bmN0aW9uIF9maW5kRGVmYXVsdFBvaW50TGF5ZXJzKGZpZWxkcywgZmllbGRQYWlycywgZGF0YUlkKSB7XG4gIGNvbnN0IGxheWVycyA9IFtdO1xuXG4gIC8vIE1ha2UgbGF5ZXIgZm9yIGVhY2ggcGFpclxuICBmaWVsZFBhaXJzLmZvckVhY2gocGFpciA9PiB7XG4gICAgLy8gZmluZCBmaWVsZHMgZm9yIHRhYmxlRmllbGRJbmRleFxuICAgIGNvbnN0IGxhdEZpZWxkID0gcGFpci5wYWlyLmxhdDtcbiAgICBjb25zdCBsbmdGaWVsZCA9IHBhaXIucGFpci5sbmc7XG4gICAgY29uc3QgbGF5ZXJOYW1lID0gcGFpci5kZWZhdWx0TmFtZTtcblxuICAgIGNvbnN0IHByb3AgPSB7XG4gICAgICBkYXRhSWQsXG4gICAgICBsYWJlbDogbGF5ZXJOYW1lLmxlbmd0aCA/IGxheWVyTmFtZSA6ICdQb2ludCdcbiAgICB9O1xuXG4gICAgLy8gZGVmYXVsdCBsYXllciBjb2xvciBmb3IgYmVnaW50cmlwIGFuZCBkcm9wb2ZmIHBvaW50XG4gICAgaWYgKGxhdEZpZWxkLnZhbHVlIGluIERFRkFVTFRfTEFZRVJfQ09MT1IpIHtcbiAgICAgIC8vIG5ld0xheWVyLmNvbG9yID0gaGV4VG9SZ2IoREVGQVVMVF9MQVlFUl9DT0xPUltsYXRGaWVsZC5uYW1lXSk7XG4gICAgICBwcm9wLmNvbG9yID0gaGV4VG9SZ2IoREVGQVVMVF9MQVlFUl9DT0xPUltsYXRGaWVsZC52YWx1ZV0pO1xuICAgIH1cblxuICAgIC8vIHNldCB0aGUgZmlyc3QgbGF5ZXIgdG8gYmUgdmlzaWJsZVxuICAgIGlmIChsYXllcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICBwcm9wLmlzVmlzaWJsZSA9IHRydWU7XG4gICAgfVxuXG4gICAgY29uc3QgbmV3TGF5ZXIgPSBuZXcgS2VwbGVyR0xMYXllcnMuUG9pbnRMYXllcihwcm9wKTtcbiAgICBuZXdMYXllci5jb25maWcuY29sdW1ucyA9IHtcbiAgICAgIC4uLm5ld0xheWVyLmNvbmZpZy5jb2x1bW5zLFxuICAgICAgbGF0OiBsYXRGaWVsZCxcbiAgICAgIGxuZzogbG5nRmllbGRcbiAgICB9O1xuXG4gICAgbGF5ZXJzLnB1c2gobmV3TGF5ZXIpO1xuICB9KTtcblxuICByZXR1cm4gbGF5ZXJzO1xufVxuXG4vKipcbiAqIEZpbmQgZGVmYXVsdCBhcmMgbGF5ZXJzIGZyb20gcG9pbnQgbGF5ZXJzLCBpZiBub25lXG4gKiB1c2UgdGhlIGZpcnN0IHR3byBwb2ludCBsYXllciB0byBjcmVhdGUgYSBhcmMgbGF5ZXJcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBwb2ludExheWVyc1xuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhSWRcbiAqIEByZXR1cm5zIHtBcnJheX0gZm91bmQgYXJjIGxheWVyc1xuICovXG5leHBvcnQgZnVuY3Rpb24gX2ZpbmREZWZhdWx0QXJjTGF5ZXJzKFxuICBwb2ludExheWVycyxcbiAgdHlwZSA9IExBWUVSX1RZUEVTLmFyYyxcbiAgZGF0YUlkXG4pIHtcbiAgaWYgKHBvaW50TGF5ZXJzLmxlbmd0aCA8IDIpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCBwcm9wcyA9IHtcbiAgICBkYXRhSWQsXG4gICAgbGFiZWw6IHR5cGUsXG4gICAgY29sb3I6IGhleFRvUmdiKERFRkFVTFRfTEFZRVJfQ09MT1IudHJpcEFyYylcbiAgfTtcblxuICAvLyBhbGwgcG9pbnQgbGF5ZXIgZmllbGRzXG4gIGNvbnN0IGZpZWxkcyA9IHBvaW50TGF5ZXJzLnJlZHVjZShcbiAgICAocHJldiwgY3VycikgPT4gcHJldi5jb25jYXQoT2JqZWN0LnZhbHVlcyhjdXJyLmNvbmZpZy5jb2x1bW5zKSksXG4gICAgW11cbiAgKTtcblxuICAvLyBmb3VuZCB0aGUgZGVmYXVsdCB0cmlwIGFyYyBmaWVsZHNcbiAgY29uc3QgdHJpcEFyY0ZpZWxkcyA9IE9iamVjdC5rZXlzKFRSSVBfQVJDX0ZJRUxEUykucmVkdWNlKChwcmV2LCBrZXkpID0+IHtcbiAgICBwcmV2W2tleV0gPSBmaWVsZHMuZmluZChmID0+IGYudmFsdWUgPT09IFRSSVBfQVJDX0ZJRUxEU1trZXldKTtcbiAgICByZXR1cm4gcHJldjtcbiAgfSwge30pO1xuXG4gIGlmIChPYmplY3QudmFsdWVzKHRyaXBBcmNGaWVsZHMpLmV2ZXJ5KEJvb2xlYW4pKSB7XG4gICAgLy8gaWYgYWxsIHRyaXAgYXJjIGZpZWxkcyBmb3VuZFxuICAgIHByb3BzLmNvbHVtbnMgPSB0cmlwQXJjRmllbGRzO1xuICAgIHByb3BzLmxhYmVsID0gJ3RyaXAgYXJjJztcbiAgfSBlbHNlIHtcbiAgICAvLyBjb25uZWN0IHRoZSBmaXJzdCB0d28gcG9pbnQgbGF5ZXIgd2l0aCBhcmNcbiAgICBwcm9wcy5jb2x1bW5zID0ge1xuICAgICAgbGF0MDogcG9pbnRMYXllcnNbMF0uY29uZmlnLmNvbHVtbnMubGF0LFxuICAgICAgbG5nMDogcG9pbnRMYXllcnNbMF0uY29uZmlnLmNvbHVtbnMubG5nLFxuICAgICAgbGF0MTogcG9pbnRMYXllcnNbMV0uY29uZmlnLmNvbHVtbnMubGF0LFxuICAgICAgbG5nMTogcG9pbnRMYXllcnNbMV0uY29uZmlnLmNvbHVtbnMubG5nXG4gICAgfTtcbiAgICBwcm9wcy5sYWJlbCA9IGAke3BvaW50TGF5ZXJzWzBdLmNvbmZpZy5sYWJlbH0gLT4gJHtcbiAgICAgIHBvaW50TGF5ZXJzWzFdLmNvbmZpZy5sYWJlbFxuICAgIH0gYXJjYDtcbiAgfVxuXG4gIGNvbnN0IHRyaXBBcmNMYXllciA9IG5ldyBLZXBsZXJHTExheWVycy5BcmNMYXllcihwcm9wcyk7XG5cbiAgcmV0dXJuIFt0cmlwQXJjTGF5ZXJdO1xufVxuXG4vKipcbiAqIEdpdmVuIGEgYXJyYXkgb2YgcHJlc2V0IHJlcXVpcmVkIGNvbHVtbiBuYW1lc1xuICogZm91bmQgZmllbGQgdGhhdCBoYXMgdGhlIHNhbWUgbmFtZSB0byBzZXQgYXMgbGF5ZXIgY29sdW1uXG4gKlxuICogQHBhcmFtIHtvYmplY3RbXX0gZGVmYXVsdEZpZWxkc1xuICogQHBhcmFtIHtvYmplY3RbXX0gYWxsRmllbGRzXG4gKiBAcmV0dXJucyB7b2JqZWN0W10gfCBudWxsfSBhbGwgcG9zc2libGUgcmVxdWlyZWQgbGF5ZXIgY29sdW1uIHBhaXJzXG4gKi9cbmZ1bmN0aW9uIF9maW5kRGVmYXVsdENvbHVtbkZpZWxkKGRlZmF1bHRGaWVsZHMsIGFsbEZpZWxkcykge1xuICAvLyBmaW5kIGFsbCBtYXRjaGVkIGZpZWxkcyBmb3IgZWFjaCByZXF1aXJlZCBjb2xcbiAgY29uc3QgcmVxdWlyZWRDb2x1bW5zID0gT2JqZWN0LmtleXMoZGVmYXVsdEZpZWxkcykucmVkdWNlKChwcmV2LCBrZXkpID0+IHtcbiAgICBjb25zdCByZXF1aXJlZEZpZWxkcyA9IGFsbEZpZWxkcy5maWx0ZXIoXG4gICAgICBmID0+IGYubmFtZSA9PT0gZGVmYXVsdEZpZWxkc1trZXldIHx8IGRlZmF1bHRGaWVsZHNba2V5XS5pbmNsdWRlcyhmLm5hbWUpXG4gICAgKTtcblxuICAgIHByZXZba2V5XSA9IHJlcXVpcmVkRmllbGRzLmxlbmd0aFxuICAgICAgPyByZXF1aXJlZEZpZWxkcy5tYXAoZiA9PiAoe1xuICAgICAgICAgIHZhbHVlOiBmLm5hbWUsXG4gICAgICAgICAgZmllbGRJZHg6IGYudGFibGVGaWVsZEluZGV4IC0gMVxuICAgICAgICB9KSlcbiAgICAgIDogbnVsbDtcbiAgICByZXR1cm4gcHJldjtcbiAgfSwge30pO1xuXG4gIGlmICghT2JqZWN0LnZhbHVlcyhyZXF1aXJlZENvbHVtbnMpLmV2ZXJ5KEJvb2xlYW4pKSB7XG4gICAgLy8gaWYgYW55IGZpZWxkIG1pc3NpbmcsIHJldHVybiBudWxsXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gX2dldEFsbFBvc3NpYmxlQ29sdW1uUGFyaXMocmVxdWlyZWRDb2x1bW5zKTtcbn1cblxuLyoqXG4gKiBHaXZlbiBhIHNldCBvZiBjb2x1bW5lcyBhbmQgYWxsIGl0cyBwb3NzaWJsZSB2YWx1ZXNcbiAqIHJldHVybiBhbGwgcG9zc2libGUgY29tYmluYXRpb25zXG4gKiBlLGcgd2hlbiByZXF1aXJlZENvbHVtbnMgPSB7ZjogWzEsIDJdLCBiOiBbJ2EnLCAnYiddfVxuICogcmV0dXJuIFt7ZjogMSwgYjogJ2EnfSwge2Y6IDEsIGI6ICdiJ30sIHtmOiAyLCBiOiAnYSd9LCB7ZjogMiwgYjogJ2InfV1cbiAqIGFzIDQgcG9zc2libGUgcGFpcnNcbiAqIEBwYXJhbSB7b2JqZWN0fSByZXF1aXJlZENvbHVtbnNcbiAqIEByZXR1cm5zIHtvYmplY3RbXX0gcGFpcnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9nZXRBbGxQb3NzaWJsZUNvbHVtblBhcmlzKHJlcXVpcmVkQ29sdW1ucykge1xuICAvLyBmb3IgbXVsdGlwbGUgbWF0Y2hlZCBmaWVsZCBmb3Igb25lIHJlcXVpcmVkIGNvbHVtbiwgcmV0dXJuIG11bHRpcGxlXG4gIC8vIGNvbWJpbmF0aW9ucywgZS4gZy4gaWYgY29sdW1uIGEgaGFzIDIgbWF0Y2hlZCwgY29sdW1uIGIgaGFzIDMgbWF0Y2hlZFxuICAvLyA2IHBvc3NpYmxlIGNvbHVtbiBwYWlycyB3aWxsIGJlIHJldHVybmVkXG4gIGNvbnN0IGFsbEtleXMgPSBPYmplY3Qua2V5cyhyZXF1aXJlZENvbHVtbnMpO1xuICBjb25zdCBwb2ludGVycyA9IGFsbEtleXMubWFwKChrLCBpKSA9PiAoaSA9PT0gYWxsS2V5cy5sZW5ndGggLSAxID8gLTEgOiAwKSk7XG4gIGNvbnN0IGNvdW50UGVyS2V5ID0gYWxsS2V5cy5tYXAoayA9PiByZXF1aXJlZENvbHVtbnNba10ubGVuZ3RoKTtcbiAgY29uc3QgcGFpcnMgPSBbXTtcblxuICAvKiBlc2xpbnQtZGlzYWJsZSBuby1sb29wLWZ1bmMgKi9cbiAgd2hpbGUgKGluY3JlbWVudFBvaW50ZXJzKHBvaW50ZXJzLCBjb3VudFBlcktleSwgcG9pbnRlcnMubGVuZ3RoIC0gMSkpIHtcbiAgICBjb25zdCBuZXdQYWlyID0gcG9pbnRlcnMucmVkdWNlKChwcmV2LCBjdXVyLCBpKSA9PiB7XG4gICAgICBwcmV2W2FsbEtleXNbaV1dID0gcmVxdWlyZWRDb2x1bW5zW2FsbEtleXNbaV1dW2N1dXJdO1xuICAgICAgcmV0dXJuIHByZXY7XG4gICAgfSwge30pO1xuXG4gICAgcGFpcnMucHVzaChuZXdQYWlyKTtcbiAgfVxuICAvKiBlc2xpbnQtZW5hYmxlIG5vLWxvb3AtZnVuYyAqL1xuXG4gIC8vIHJlY3Vyc2l2ZWx5IGluY3JlbWVudCBwb2ludGVyc1xuICBmdW5jdGlvbiBpbmNyZW1lbnRQb2ludGVycyhwdHMsIGNvdW50cywgaW5kZXgpIHtcbiAgICBpZiAoaW5kZXggPT09IDAgJiYgcHRzWzBdID09PSBjb3VudHNbMF0gLSAxKSB7XG4gICAgICAvLyBub3RoaW5nIHRvIGluY3JlbWVudFxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChwdHNbaW5kZXhdICsgMSA8IGNvdW50c1tpbmRleF0pIHtcbiAgICAgIHB0c1tpbmRleF0gPSBwdHNbaW5kZXhdICsgMTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHB0c1tpbmRleF0gPSAwO1xuICAgIHJldHVybiBpbmNyZW1lbnRQb2ludGVycyhwdHMsIGNvdW50cywgaW5kZXggLSAxKTtcbiAgfVxuXG4gIHJldHVybiBwYWlycztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9maW5kRGVmYXVsdEdlb2pzb25MYXllcihmaWVsZHMsIGRhdGFJZCwgbGFiZWwpIHtcbiAgY29uc3QgZmluZEdlb2pzb25Db2x1bW4gPSBmaWVsZHNcbiAgICAuZmlsdGVyKGYgPT4gZi50eXBlID09PSBBTExfRklFTERfVFlQRVMuZ2VvanNvbilcbiAgICAubWFwKGYgPT4gZi5uYW1lKTtcblxuICBjb25zdCBkZWZhdWx0Q29sdW1ucyA9IHtcbiAgICBnZW9qc29uOiB1bmlxKFsuLi5HRU9KU09OX0ZJRUxEUy5nZW9qc29uLCAuLi5maW5kR2VvanNvbkNvbHVtbl0pXG4gIH07XG5cbiAgcmV0dXJuIF9maW5kRGVmYXVsdEZlYXR1cmVMYXllcih7XG4gICAgZmllbGRzLFxuICAgIGRlZmF1bHRDb2x1bW5zLFxuICAgIHR5cGU6IExBWUVSX1RZUEVTLmdlb2pzb24sXG4gICAgZGF0YUlkLFxuICAgIGxhYmVsXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX2ZpbmREZWZhdWx0Q2x1c3RlckxheWVycyhwb2ludExheWVycykge1xuICByZXR1cm4gX2ZpbmREZWZhdWx0QWdncmVnYXRpb25MYXllcnMocG9pbnRMYXllcnMsIExBWUVSX1RZUEVTLmNsdXN0ZXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX2ZpbmREZWZhdWx0RmVhdHVyZUxheWVyKHtcbiAgZmllbGRzLFxuICBkZWZhdWx0Q29sdW1ucyxcbiAgdHlwZSxcbiAgbGFiZWwsXG4gIGRhdGFJZFxufSkge1xuICAvLyBmaW5kIGFsbCBwb3NzaWJsZSByZXF1aXJlZCBjb2x1bW4gcGFpcnNcbiAgY29uc3QgY29sdW1ucyA9IF9maW5kRGVmYXVsdENvbHVtbkZpZWxkKGRlZmF1bHRDb2x1bW5zLCBmaWVsZHMpO1xuXG4gIGlmICghY29sdW1ucyB8fCAhY29sdW1ucy5sZW5ndGgpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCBwcm9wcyA9IHtcbiAgICBkYXRhSWQsXG4gICAgbGFiZWw6XG4gICAgICAodHlwZW9mIGxhYmVsID09PSAnc3RyaW5nJyAmJiBsYWJlbC5yZXBsYWNlKC9cXC5bXi8uXSskLywgJycpKSB8fCB0eXBlLFxuICAgIGlzVmlzaWJsZTogdHJ1ZVxuICB9O1xuXG4gIGNvbnN0IExheWVyQ2xhc3MgPSBLZXBsZXJHTExheWVyc1tMQVlFUl9DTEFTU0VTW3R5cGVdXTtcblxuICAvLyBjcmVhdGUgb25lIGxheWVyIGZvciBlYWNoIHBvc3NpYmxlIGNvbHVtbiBwYXJpc1xuICByZXR1cm4gY29sdW1ucy5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHtcbiAgICBjb25zdCBuZXdMYXllciA9IG5ldyBMYXllckNsYXNzKHsuLi5wcm9wcywgY29sdW1uczogY3Vycn0pO1xuICAgIHByZXYucHVzaChuZXdMYXllcik7XG4gICAgcmV0dXJuIHByZXY7XG4gIH0sIFtdKTtcbn1cblxuLyoqXG4gKiBGaW5kIGRlZmF1bHQgaGV4Z29uSWQgbGF5ZXJzIGZyb20gZmllbGRzXG4gKlxuICogQHBhcmFtIHtBcnJheX0gZmllbGRzXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YUlkXG4gKiBAcmV0dXJucyB7QXJyYXl9IGZvdW5kIHBhdGggbGF5ZXJzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfZmluZERlZmF1bHRIZXhhZ29uSWRMYXllcihmaWVsZHMsIGRhdGFJZCkge1xuICByZXR1cm4gX2ZpbmREZWZhdWx0RmVhdHVyZUxheWVyKHtcbiAgICBmaWVsZHMsXG4gICAgZGVmYXVsdENvbHVtbnM6IEhFWEFHT05fSURfRklFTERTLFxuICAgIHR5cGU6IExBWUVSX1RZUEVTLmhleGFnb25JZCxcbiAgICBsYWJlbDogJ0hleGFnb24nLFxuICAgIGRhdGFJZFxuICB9KTtcbn1cblxuLyoqXG4gKiBGaW5kIGRlZmF1bHQgaWNvbiBsYXllcnMgZnJvbSBmaWVsZHNcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBwb2ludExheWVyc1xuICogQHBhcmFtIHtBcnJheX0gZmllbGRzXG4gKiBAcmV0dXJucyB7QXJyYXl9IGZvdW5kIGljb24gbGF5ZXJzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfZmluZERlZmF1bHRJY29uTGF5ZXJzKHBvaW50TGF5ZXJzLCBmaWVsZHMpIHtcbiAgaWYgKCFwb2ludExheWVycy5sZW5ndGgpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCBpY29uRmllbGRzID0gZmllbGRzLmZpbHRlcigoe25hbWV9KSA9PlxuICAgIG5hbWVcbiAgICAgIC5yZXBsYWNlKC9bXywuXSsvZywgJyAnKVxuICAgICAgLnRyaW0oKVxuICAgICAgLnNwbGl0KCcgJylcbiAgICAgIC5zb21lKHNlZyA9PiBJQ09OX0ZJRUxEUy5pY29uLnNvbWUodCA9PiB0LmluY2x1ZGVzKHNlZykpKVxuICApO1xuXG4gIGlmICghaWNvbkZpZWxkcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgLy8gY3JlYXRlIGljb24gbGF5ZXJzIGZvciBmaXJzdCBwb2ludCBsYXllclxuICBjb25zdCBwdExheWVyID0gcG9pbnRMYXllcnNbMF07XG5cbiAgY29uc3QgcHJvcHMgPSB7XG4gICAgZGF0YUlkOiBwdExheWVyLmNvbmZpZy5kYXRhSWQsXG4gICAgY29sdW1uczoge1xuICAgICAgbGF0OiBwdExheWVyLmNvbmZpZy5jb2x1bW5zLmxhdCxcbiAgICAgIGxuZzogcHRMYXllci5jb25maWcuY29sdW1ucy5sbmdcbiAgICB9LFxuICAgIGlzVmlzaWJsZTogdHJ1ZVxuICB9O1xuXG4gIGNvbnN0IExheWVyQ2xhc3MgPSBLZXBsZXJHTExheWVyc1tMQVlFUl9DTEFTU0VTLmljb25dO1xuXG4gIHJldHVybiBpY29uRmllbGRzLm1hcChcbiAgICBpY29uRmllbGQgPT5cbiAgICAgIG5ldyBMYXllckNsYXNzKHtcbiAgICAgICAgLi4ucHJvcHMsXG4gICAgICAgIGxhYmVsOiBpY29uRmllbGQubmFtZS5yZXBsYWNlKC9bXywuXSsvZywgJyAnKS50cmltKCksXG4gICAgICAgIGNvbHVtbnM6IHtcbiAgICAgICAgICAuLi5wcm9wcy5jb2x1bW5zLFxuICAgICAgICAgIGljb246IHtcbiAgICAgICAgICAgIHZhbHVlOiBpY29uRmllbGQubmFtZSxcbiAgICAgICAgICAgIGZpZWxkSWR4OiBpY29uRmllbGQudGFibGVGaWVsZEluZGV4IC0gMVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgKTtcbn1cblxuLyoqXG4gKiBGaW5kIGRlZmF1bHQgZ3JpZCBsYXllcnMgZnJvbSBmaWVsZHNcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBwb2ludExheWVyc1xuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEByZXR1cm5zIHtBcnJheX0gYW4gYXJyYXkgb2YgZm91bmRlZCBncmlkIGxheWVyc1xuICovXG5leHBvcnQgZnVuY3Rpb24gX2ZpbmREZWZhdWx0QWdncmVnYXRpb25MYXllcnMocG9pbnRMYXllcnMsIHR5cGUpIHtcbiAgaWYgKCFwb2ludExheWVycy5sZW5ndGgpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvLyBvbmx5IGNyZWF0ZSBvbmUgYWdncmVnYXRpb24gbGF5ZXJcbiAgY29uc3QgcHRMYXllciA9IHBvaW50TGF5ZXJzWzBdO1xuXG4gIGNvbnN0IHByb3BzID0ge1xuICAgIGRhdGFJZDogcHRMYXllci5jb25maWcuZGF0YUlkLFxuICAgIGxhYmVsOiBgJHtwdExheWVyLmNvbmZpZy5sYWJlbH0gJHt0eXBlfWBcbiAgfTtcblxuICBjb25zdCBMYXllckNsYXNzID0gS2VwbGVyR0xMYXllcnNbTEFZRVJfQ0xBU1NFU1t0eXBlXV07XG4gIGNvbnN0IG5ld0xheWVyID0gbmV3IExheWVyQ2xhc3MocHJvcHMpO1xuXG4gIC8vIGNvcHkgcG9pbnQgbGF5ZXIgY29sdW1ucyBvdmVyXG4gIG5ld0xheWVyLmNvbmZpZy5jb2x1bW5zID0gT2JqZWN0LmtleXMobmV3TGF5ZXIuY29uZmlnLmNvbHVtbnMpLnJlZHVjZShcbiAgICAoYWNjdSwga2V5KSA9PiAoe1xuICAgICAgLi4uYWNjdSxcbiAgICAgIFtrZXldOiB7Li4ucHRMYXllci5jb25maWcuY29sdW1uc1trZXldfVxuICAgIH0pLFxuICAgIHt9XG4gICk7XG5cbiAgcmV0dXJuIFtuZXdMYXllcl07XG59XG5cbi8qKlxuICogY2FsY3VsYXRlIGxheWVyIGRhdGEgYmFzZWQgb24gbGF5ZXIgdHlwZSwgY29sIENvbmZpZyxcbiAqIHJldHVybiB1cGRhdGVkIGxheWVyIGlmIGNvbG9yRG9tYWluLCBkYXRhTWFwIGhhcyBjaGFuZ2VkXG4gKiBAcGFyYW0ge29iamVjdH0gbGF5ZXJcbiAqIEBwYXJhbSB7b2JqZWN0fSBzdGF0ZVxuICogQHBhcmFtIHtvYmplY3R9IG9sZExheWVyRGF0YVxuICogQHBhcmFtIHtvYmplY3R9IG9wdFxuICogQHJldHVybnMge29iamVjdH0ge2xheWVyRGF0YToge30sIGxheWVyOiB7fSB8fCB1bmRlZmluZWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYWxjdWxhdGVMYXllckRhdGEobGF5ZXIsIHN0YXRlLCBvbGRMYXllckRhdGEsIG9wdCA9IHt9KSB7XG4gIGNvbnN0IHt0eXBlfSA9IGxheWVyO1xuICBjb25zdCB7ZGF0YXNldHN9ID0gc3RhdGU7XG5cbiAgY29uc3Qge2RhdGEsIGZpbHRlcmVkSW5kZXgsIGFsbERhdGF9ID0gZGF0YXNldHNbbGF5ZXIuY29uZmlnLmRhdGFJZF0gfHwge307XG5cbiAgaWYgKCF0eXBlIHx8ICFsYXllci5oYXNBbGxDb2x1bW5zKCkpIHtcbiAgICByZXR1cm4ge2xheWVyLCBsYXllckRhdGE6IHt9fTtcbiAgfVxuXG4gIGNvbnN0IGxheWVyRGF0YSA9IGxheWVyLmZvcm1hdExheWVyRGF0YShcbiAgICBkYXRhLFxuICAgIGFsbERhdGEsXG4gICAgZmlsdGVyZWRJbmRleCxcbiAgICBvbGRMYXllckRhdGEsXG4gICAgb3B0XG4gICk7XG4gIHJldHVybiB7bGF5ZXJEYXRhLCBsYXllcn07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMaWdodFNldHRpbmdzRnJvbUJvdW5kcyhib3VuZHMpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYm91bmRzKSAmJiBib3VuZHMubGVuZ3RoID49IDRcbiAgICA/IHtcbiAgICAgICAgLi4uREVGQVVMVF9MSUdIVF9TRVRUSU5HUyxcbiAgICAgICAgbGlnaHRzUG9zaXRpb246IFtcbiAgICAgICAgICAuLi5ib3VuZHMuc2xpY2UoMCwgMiksXG4gICAgICAgICAgREVGQVVMVF9MSUdIVF9TRVRUSU5HUy5saWdodHNQb3NpdGlvblsyXSxcbiAgICAgICAgICAuLi5ib3VuZHMuc2xpY2UoMiwgNCksXG4gICAgICAgICAgREVGQVVMVF9MSUdIVF9TRVRUSU5HUy5saWdodHNQb3NpdGlvbls1XVxuICAgICAgICBdXG4gICAgICB9XG4gICAgOiBERUZBVUxUX0xJR0hUX1NFVFRJTkdTO1xufVxuIl19