'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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

  var pointLayers = _findDefaultPointLayers(fieldPairs, dataId);
  var arcLayers = _findDefaultArcLayers(pointLayers, 'arc', dataId);
  // const clusterLayers = _findDefaultClusterLayers(pointLayers, dataId);
  var geojsonLayers = _findDefaultGeojsonLayer(fields, dataId, label);
  var iconLayers = _findDefaultIconLayers(pointLayers, fields, dataId);
  var hexagonIdLayers = _findDefaultHexagonIdLayer(fields, dataId);

  // for performance, do not create too many default layers
  // const hexagonLayer = _findDefaultAggregationLayers(pointLayers, 'hexagon');
  // const gridLayer = _findDefaultAggregationLayers(pointLayers, 'grid');

  return [].concat((0, _toConsumableArray3.default)(arcLayers), (0, _toConsumableArray3.default)(hexagonIdLayers), (0, _toConsumableArray3.default)(geojsonLayers), (0, _toConsumableArray3.default)(pointLayers), (0, _toConsumableArray3.default)(iconLayers));
}

/**
 * Find default point layers from fields
 *
 * @param {Array} fieldPairs
 * @param {string} dataId
 * @returns {Array} found point layers
 */
function _findDefaultPointLayers(fieldPairs, dataId) {
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
    geojson: (0, _lodash2.default)([].concat((0, _toConsumableArray3.default)(_defaultSettings.GEOJSON_FIELDS.geojson), (0, _toConsumableArray3.default)(findGeojsonColumn)))
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
    return (0, _extends4.default)({}, accu, (0, _defineProperty3.default)({}, key, (0, _extends4.default)({}, ptLayer.config.columns[key])));
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
    lightsPosition: [].concat((0, _toConsumableArray3.default)(bounds.slice(0, 2)), [_defaultSettings.DEFAULT_LIGHT_SETTINGS.lightsPosition[2]], (0, _toConsumableArray3.default)(bounds.slice(2, 4)), [_defaultSettings.DEFAULT_LIGHT_SETTINGS.lightsPosition[5]])
  }) : _defaultSettings.DEFAULT_LIGHT_SETTINGS;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9sYXllci11dGlscy9sYXllci11dGlscy5qcyJdLCJuYW1lcyI6WyJhc3NpZ25Qcm9wVG9FbXB0eUxheWVyIiwiZmluZERlZmF1bHRMYXllciIsIl9maW5kRGVmYXVsdEFyY0xheWVycyIsIl9nZXRBbGxQb3NzaWJsZUNvbHVtblBhcmlzIiwiX2ZpbmREZWZhdWx0R2VvanNvbkxheWVyIiwiX2ZpbmREZWZhdWx0Q2x1c3RlckxheWVycyIsIl9maW5kRGVmYXVsdEZlYXR1cmVMYXllciIsIl9maW5kRGVmYXVsdEhleGFnb25JZExheWVyIiwiX2ZpbmREZWZhdWx0SWNvbkxheWVycyIsIl9maW5kRGVmYXVsdEFnZ3JlZ2F0aW9uTGF5ZXJzIiwiY2FsY3VsYXRlTGF5ZXJEYXRhIiwiZ2V0TGlnaHRTZXR0aW5nc0Zyb21Cb3VuZHMiLCJLZXBsZXJHTExheWVycyIsIkRFRkFVTFRfTEFZRVJfQ09MT1IiLCJ0cmlwQXJjIiwiYXF1YSIsImJlZ2ludHJpcF9sYXQiLCJvcmNoaWQiLCJkcm9wb2ZmX2xhdCIsInRyZWVfcG9wcHkiLCJyZXF1ZXN0X2xhdCIsInBvcnRhZ2UiLCJlbXB0eUxheWVyIiwibGF5ZXIiLCJub3RUb092ZXJyaWRlIiwibm90VG9EZWVwTWVyZ2UiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsImluY2x1ZGVzIiwiZmllbGRzIiwiZmllbGRQYWlycyIsImRhdGFJZCIsImlkIiwibGFiZWwiLCJwb2ludExheWVycyIsIl9maW5kRGVmYXVsdFBvaW50TGF5ZXJzIiwiYXJjTGF5ZXJzIiwiZ2VvanNvbkxheWVycyIsImljb25MYXllcnMiLCJoZXhhZ29uSWRMYXllcnMiLCJsYXllcnMiLCJsYXRGaWVsZCIsInBhaXIiLCJsYXQiLCJsbmdGaWVsZCIsImxuZyIsImxheWVyTmFtZSIsImRlZmF1bHROYW1lIiwicHJvcCIsImxlbmd0aCIsInZhbHVlIiwiY29sb3IiLCJpc1Zpc2libGUiLCJuZXdMYXllciIsIlBvaW50TGF5ZXIiLCJjb25maWciLCJjb2x1bW5zIiwicHVzaCIsInR5cGUiLCJhcmMiLCJwcm9wcyIsInJlZHVjZSIsInByZXYiLCJjdXJyIiwiY29uY2F0IiwidmFsdWVzIiwidHJpcEFyY0ZpZWxkcyIsImZpbmQiLCJmIiwiZXZlcnkiLCJCb29sZWFuIiwibGF0MCIsImxuZzAiLCJsYXQxIiwibG5nMSIsInRyaXBBcmNMYXllciIsIkFyY0xheWVyIiwiX2ZpbmREZWZhdWx0Q29sdW1uRmllbGQiLCJkZWZhdWx0RmllbGRzIiwiYWxsRmllbGRzIiwicmVxdWlyZWRDb2x1bW5zIiwicmVxdWlyZWRGaWVsZHMiLCJmaWx0ZXIiLCJuYW1lIiwibWFwIiwiZmllbGRJZHgiLCJ0YWJsZUZpZWxkSW5kZXgiLCJhbGxLZXlzIiwicG9pbnRlcnMiLCJrIiwiaSIsImNvdW50UGVyS2V5IiwicGFpcnMiLCJpbmNyZW1lbnRQb2ludGVycyIsIm5ld1BhaXIiLCJjdXVyIiwicHRzIiwiY291bnRzIiwiaW5kZXgiLCJmaW5kR2VvanNvbkNvbHVtbiIsImdlb2pzb24iLCJkZWZhdWx0Q29sdW1ucyIsImNsdXN0ZXIiLCJyZXBsYWNlIiwiTGF5ZXJDbGFzcyIsImhleGFnb25JZCIsImljb25GaWVsZHMiLCJ0cmltIiwic3BsaXQiLCJzb21lIiwiaWNvbiIsInQiLCJzZWciLCJwdExheWVyIiwiaWNvbkZpZWxkIiwiYWNjdSIsInN0YXRlIiwib2xkTGF5ZXJEYXRhIiwib3B0IiwiZGF0YXNldHMiLCJkYXRhIiwiZmlsdGVyZWRJbmRleCIsImFsbERhdGEiLCJoYXNBbGxDb2x1bW5zIiwibGF5ZXJEYXRhIiwiZm9ybWF0TGF5ZXJEYXRhIiwiYm91bmRzIiwiQXJyYXkiLCJpc0FycmF5IiwibGlnaHRzUG9zaXRpb24iLCJzbGljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBbUNnQkEsc0IsR0FBQUEsc0I7UUE2QkFDLGdCLEdBQUFBLGdCO1FBbUZBQyxxQixHQUFBQSxxQjtRQTBGQUMsMEIsR0FBQUEs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VCxDQUFvQ3FILE1BQXBDLEVBQTRDO0FBQ2pELFNBQU9DLE1BQU1DLE9BQU4sQ0FBY0YsTUFBZCxLQUF5QkEsT0FBTzdFLE1BQVAsSUFBaUIsQ0FBMUM7QUFHRGdGLCtEQUNLSCxPQUFPSSxLQUFQLENBQWEsQ0FBYixFQUFnQixDQUFoQixDQURMLElBRUUsd0NBQXVCRCxjQUF2QixDQUFzQyxDQUF0QyxDQUZGLG9DQUdLSCxPQUFPSSxLQUFQLENBQWEsQ0FBYixFQUFnQixDQUFoQixDQUhMLElBSUUsd0NBQXVCRCxjQUF2QixDQUFzQyxDQUF0QyxDQUpGO0FBSEMsOENBQVA7QUFXRCIsImZpbGUiOiJsYXllci11dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB1bmlxIGZyb20gJ2xvZGFzaC51bmlxJztcblxuaW1wb3J0IHtcbiAgQUxMX0ZJRUxEX1RZUEVTLFxuICBERUZBVUxUX0xJR0hUX1NFVFRJTkdTLFxuICBHRU9KU09OX0ZJRUxEUyxcbiAgSEVYQUdPTl9JRF9GSUVMRFMsXG4gIElDT05fRklFTERTLFxuICBMQVlFUl9UWVBFUyxcbiAgVFJJUF9BUkNfRklFTERTLFxuICBMQVlFUl9DTEFTU0VTXG59IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuaW1wb3J0IHtub3ROdWxsb3JVbmRlZmluZWQsIGlzUGxhaW5PYmplY3R9IGZyb20gJ3V0aWxzL2RhdGEtdXRpbHMnO1xuaW1wb3J0IHtoZXhUb1JnYn0gZnJvbSAndXRpbHMvY29sb3ItdXRpbHMnO1xuXG5pbXBvcnQgKiBhcyBLZXBsZXJHTExheWVycyBmcm9tICdrZXBsZXJnbC1sYXllcnMnO1xuXG5pbXBvcnQge3ViZXJEYXRhVml6Q29sb3JzfSBmcm9tICdjb25zdGFudHMvdWJlci12aXotY29sb3JzJztcblxuY29uc3QgREVGQVVMVF9MQVlFUl9DT0xPUiA9IHtcbiAgdHJpcEFyYzogdWJlckRhdGFWaXpDb2xvcnMuYXF1YSxcbiAgYmVnaW50cmlwX2xhdDogdWJlckRhdGFWaXpDb2xvcnMub3JjaGlkLFxuICBkcm9wb2ZmX2xhdDogdWJlckRhdGFWaXpDb2xvcnMudHJlZV9wb3BweSxcbiAgcmVxdWVzdF9sYXQ6IHViZXJEYXRhVml6Q29sb3JzLnBvcnRhZ2Vcbn07XG5cbi8qKlxuICogcmVjdXJzaXZlbHkgYXNzaWduIGFsbCB2YWx1ZSBvZiBzYXZlZCBsYXllciB0byBhIG1pbnQgbGF5ZXJcbiAqIHJlYXNvbiB3ZSBkb24ndCB1c2UgbWVyZ2UgaGVyZSBpcyB0byBtYWtlIHN1cmUgb25seSBhc3NpZ25cbiAqIHByb3BlcnR5IHRoYXQncyBpbiBhbiBlbXB0eSBsYXllclxuICogQHBhcmFtIHtPYmplY3R9IGVtcHR5TGF5ZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBsYXllclxuICogQHJldHVybiB7T2JqZWN0fSAtIGxheWVyIHdpdGggdmFsdWVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzc2lnblByb3BUb0VtcHR5TGF5ZXIoZW1wdHlMYXllciwgbGF5ZXIpIHtcbiAgY29uc3Qgbm90VG9PdmVycmlkZSA9IFsndHlwZScsICdpc0FnZ3JlZ2F0ZWQnXTtcbiAgY29uc3Qgbm90VG9EZWVwTWVyZ2UgPSBbJ2NvbG9yRmllbGQnLCAnc2l6ZUZpZWxkJ107XG5cbiAgT2JqZWN0LmtleXMoZW1wdHlMYXllcikuZm9yRWFjaChrZXkgPT4ge1xuICAgIGlmIChcbiAgICAgIGlzUGxhaW5PYmplY3QoZW1wdHlMYXllcltrZXldKSAmJlxuICAgICAgaXNQbGFpbk9iamVjdChsYXllcltrZXldKSAmJlxuICAgICAgIW5vdFRvRGVlcE1lcmdlLmluY2x1ZGVzKGtleSlcbiAgICApIHtcbiAgICAgIC8vIHJlY3Vyc2l2ZWx5IGFzc2lnbiBvYmplY3RcbiAgICAgIGVtcHR5TGF5ZXJba2V5XSA9IGFzc2lnblByb3BUb0VtcHR5TGF5ZXIoZW1wdHlMYXllcltrZXldLCBsYXllcltrZXldKTtcbiAgICB9IGVsc2UgaWYgKG5vdE51bGxvclVuZGVmaW5lZChsYXllcltrZXldKSAmJiAhbm90VG9PdmVycmlkZS5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICBlbXB0eUxheWVyW2tleV0gPSBsYXllcltrZXldO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGVtcHR5TGF5ZXI7XG59XG5cbi8qKlxuICogRmluZCBkZWZhdWx0IGxheWVycyBmcm9tIGZpZWxkc1xuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGZpZWxkc1xuICogQHBhcmFtIHtBcnJheX0gZmllbGRQYWlyc1xuICogQHBhcmFtIHtzdHJpbmd9IGRhdGFJZFxuICogQHBhcmFtIHtzdHJpbmd9IGxhYmVsXG4gKiBAcmV0dXJucyB7QXJyYXl9IGZvdW5kIGxheWVyc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZERlZmF1bHRMYXllcih7ZmllbGRzLCBmaWVsZFBhaXJzLCBpZDogZGF0YUlkLCBsYWJlbH0pIHtcbiAgaWYgKCFmaWVsZHMpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCBwb2ludExheWVycyA9IF9maW5kRGVmYXVsdFBvaW50TGF5ZXJzKGZpZWxkUGFpcnMsIGRhdGFJZCk7XG4gIGNvbnN0IGFyY0xheWVycyA9IF9maW5kRGVmYXVsdEFyY0xheWVycyhwb2ludExheWVycywgJ2FyYycsIGRhdGFJZCk7XG4gIC8vIGNvbnN0IGNsdXN0ZXJMYXllcnMgPSBfZmluZERlZmF1bHRDbHVzdGVyTGF5ZXJzKHBvaW50TGF5ZXJzLCBkYXRhSWQpO1xuICBjb25zdCBnZW9qc29uTGF5ZXJzID0gX2ZpbmREZWZhdWx0R2VvanNvbkxheWVyKGZpZWxkcywgZGF0YUlkLCBsYWJlbCk7XG4gIGNvbnN0IGljb25MYXllcnMgPSBfZmluZERlZmF1bHRJY29uTGF5ZXJzKHBvaW50TGF5ZXJzLCBmaWVsZHMsIGRhdGFJZCk7XG4gIGNvbnN0IGhleGFnb25JZExheWVycyA9IF9maW5kRGVmYXVsdEhleGFnb25JZExheWVyKGZpZWxkcywgZGF0YUlkKTtcblxuICAvLyBmb3IgcGVyZm9ybWFuY2UsIGRvIG5vdCBjcmVhdGUgdG9vIG1hbnkgZGVmYXVsdCBsYXllcnNcbiAgLy8gY29uc3QgaGV4YWdvbkxheWVyID0gX2ZpbmREZWZhdWx0QWdncmVnYXRpb25MYXllcnMocG9pbnRMYXllcnMsICdoZXhhZ29uJyk7XG4gIC8vIGNvbnN0IGdyaWRMYXllciA9IF9maW5kRGVmYXVsdEFnZ3JlZ2F0aW9uTGF5ZXJzKHBvaW50TGF5ZXJzLCAnZ3JpZCcpO1xuXG4gIHJldHVybiBbXG4gICAgLy8gLi4uaGV4YWdvbkxheWVyLFxuICAgIC8vIC4uLmdyaWRMYXllcixcbiAgICAvLyAuLi5jbHVzdGVyTGF5ZXJzLFxuICAgIC4uLmFyY0xheWVycyxcbiAgICAuLi5oZXhhZ29uSWRMYXllcnMsXG4gICAgLi4uZ2VvanNvbkxheWVycyxcbiAgICAuLi5wb2ludExheWVycyxcbiAgICAuLi5pY29uTGF5ZXJzXG4gIF07XG59XG5cbi8qKlxuICogRmluZCBkZWZhdWx0IHBvaW50IGxheWVycyBmcm9tIGZpZWxkc1xuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGZpZWxkUGFpcnNcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhSWRcbiAqIEByZXR1cm5zIHtBcnJheX0gZm91bmQgcG9pbnQgbGF5ZXJzXG4gKi9cbmZ1bmN0aW9uIF9maW5kRGVmYXVsdFBvaW50TGF5ZXJzKGZpZWxkUGFpcnMsIGRhdGFJZCkge1xuICBjb25zdCBsYXllcnMgPSBbXTtcblxuICAvLyBNYWtlIGxheWVyIGZvciBlYWNoIHBhaXJcbiAgZmllbGRQYWlycy5mb3JFYWNoKHBhaXIgPT4ge1xuICAgIC8vIGZpbmQgZmllbGRzIGZvciB0YWJsZUZpZWxkSW5kZXhcbiAgICBjb25zdCBsYXRGaWVsZCA9IHBhaXIucGFpci5sYXQ7XG4gICAgY29uc3QgbG5nRmllbGQgPSBwYWlyLnBhaXIubG5nO1xuICAgIGNvbnN0IGxheWVyTmFtZSA9IHBhaXIuZGVmYXVsdE5hbWU7XG5cbiAgICBjb25zdCBwcm9wID0ge1xuICAgICAgZGF0YUlkLFxuICAgICAgbGFiZWw6IGxheWVyTmFtZS5sZW5ndGggPyBsYXllck5hbWUgOiAnUG9pbnQnXG4gICAgfTtcblxuICAgIC8vIGRlZmF1bHQgbGF5ZXIgY29sb3IgZm9yIGJlZ2ludHJpcCBhbmQgZHJvcG9mZiBwb2ludFxuICAgIGlmIChsYXRGaWVsZC52YWx1ZSBpbiBERUZBVUxUX0xBWUVSX0NPTE9SKSB7XG4gICAgICAvLyBuZXdMYXllci5jb2xvciA9IGhleFRvUmdiKERFRkFVTFRfTEFZRVJfQ09MT1JbbGF0RmllbGQubmFtZV0pO1xuICAgICAgcHJvcC5jb2xvciA9IGhleFRvUmdiKERFRkFVTFRfTEFZRVJfQ09MT1JbbGF0RmllbGQudmFsdWVdKTtcbiAgICB9XG5cbiAgICAvLyBzZXQgdGhlIGZpcnN0IGxheWVyIHRvIGJlIHZpc2libGVcbiAgICBpZiAobGF5ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcHJvcC5pc1Zpc2libGUgPSB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld0xheWVyID0gbmV3IEtlcGxlckdMTGF5ZXJzLlBvaW50TGF5ZXIocHJvcCk7XG4gICAgbmV3TGF5ZXIuY29uZmlnLmNvbHVtbnMgPSB7XG4gICAgICAuLi5uZXdMYXllci5jb25maWcuY29sdW1ucyxcbiAgICAgIGxhdDogbGF0RmllbGQsXG4gICAgICBsbmc6IGxuZ0ZpZWxkXG4gICAgfTtcblxuICAgIGxheWVycy5wdXNoKG5ld0xheWVyKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGxheWVycztcbn1cblxuLyoqXG4gKiBGaW5kIGRlZmF1bHQgYXJjIGxheWVycyBmcm9tIHBvaW50IGxheWVycywgaWYgbm9uZVxuICogdXNlIHRoZSBmaXJzdCB0d28gcG9pbnQgbGF5ZXIgdG8gY3JlYXRlIGEgYXJjIGxheWVyXG4gKlxuICogQHBhcmFtIHtBcnJheX0gcG9pbnRMYXllcnNcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0YUlkXG4gKiBAcmV0dXJucyB7QXJyYXl9IGZvdW5kIGFyYyBsYXllcnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9maW5kRGVmYXVsdEFyY0xheWVycyhcbiAgcG9pbnRMYXllcnMsXG4gIHR5cGUgPSBMQVlFUl9UWVBFUy5hcmMsXG4gIGRhdGFJZFxuKSB7XG4gIGlmIChwb2ludExheWVycy5sZW5ndGggPCAyKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgcHJvcHMgPSB7XG4gICAgZGF0YUlkLFxuICAgIGxhYmVsOiB0eXBlLFxuICAgIGNvbG9yOiBoZXhUb1JnYihERUZBVUxUX0xBWUVSX0NPTE9SLnRyaXBBcmMpXG4gIH07XG5cbiAgLy8gYWxsIHBvaW50IGxheWVyIGZpZWxkc1xuICBjb25zdCBmaWVsZHMgPSBwb2ludExheWVycy5yZWR1Y2UoXG4gICAgKHByZXYsIGN1cnIpID0+IHByZXYuY29uY2F0KE9iamVjdC52YWx1ZXMoY3Vyci5jb25maWcuY29sdW1ucykpLFxuICAgIFtdXG4gICk7XG5cbiAgLy8gZm91bmQgdGhlIGRlZmF1bHQgdHJpcCBhcmMgZmllbGRzXG4gIGNvbnN0IHRyaXBBcmNGaWVsZHMgPSBPYmplY3Qua2V5cyhUUklQX0FSQ19GSUVMRFMpLnJlZHVjZSgocHJldiwga2V5KSA9PiB7XG4gICAgcHJldltrZXldID0gZmllbGRzLmZpbmQoZiA9PiBmLnZhbHVlID09PSBUUklQX0FSQ19GSUVMRFNba2V5XSk7XG4gICAgcmV0dXJuIHByZXY7XG4gIH0sIHt9KTtcblxuICBpZiAoT2JqZWN0LnZhbHVlcyh0cmlwQXJjRmllbGRzKS5ldmVyeShCb29sZWFuKSkge1xuICAgIC8vIGlmIGFsbCB0cmlwIGFyYyBmaWVsZHMgZm91bmRcbiAgICBwcm9wcy5jb2x1bW5zID0gdHJpcEFyY0ZpZWxkcztcbiAgICBwcm9wcy5sYWJlbCA9ICd0cmlwIGFyYyc7XG4gIH0gZWxzZSB7XG4gICAgLy8gY29ubmVjdCB0aGUgZmlyc3QgdHdvIHBvaW50IGxheWVyIHdpdGggYXJjXG4gICAgcHJvcHMuY29sdW1ucyA9IHtcbiAgICAgIGxhdDA6IHBvaW50TGF5ZXJzWzBdLmNvbmZpZy5jb2x1bW5zLmxhdCxcbiAgICAgIGxuZzA6IHBvaW50TGF5ZXJzWzBdLmNvbmZpZy5jb2x1bW5zLmxuZyxcbiAgICAgIGxhdDE6IHBvaW50TGF5ZXJzWzFdLmNvbmZpZy5jb2x1bW5zLmxhdCxcbiAgICAgIGxuZzE6IHBvaW50TGF5ZXJzWzFdLmNvbmZpZy5jb2x1bW5zLmxuZ1xuICAgIH07XG4gICAgcHJvcHMubGFiZWwgPSBgJHtwb2ludExheWVyc1swXS5jb25maWcubGFiZWx9IC0+ICR7XG4gICAgICBwb2ludExheWVyc1sxXS5jb25maWcubGFiZWxcbiAgICB9IGFyY2A7XG4gIH1cblxuICBjb25zdCB0cmlwQXJjTGF5ZXIgPSBuZXcgS2VwbGVyR0xMYXllcnMuQXJjTGF5ZXIocHJvcHMpO1xuXG4gIHJldHVybiBbdHJpcEFyY0xheWVyXTtcbn1cblxuLyoqXG4gKiBHaXZlbiBhIGFycmF5IG9mIHByZXNldCByZXF1aXJlZCBjb2x1bW4gbmFtZXNcbiAqIGZvdW5kIGZpZWxkIHRoYXQgaGFzIHRoZSBzYW1lIG5hbWUgdG8gc2V0IGFzIGxheWVyIGNvbHVtblxuICpcbiAqIEBwYXJhbSB7b2JqZWN0W119IGRlZmF1bHRGaWVsZHNcbiAqIEBwYXJhbSB7b2JqZWN0W119IGFsbEZpZWxkc1xuICogQHJldHVybnMge29iamVjdFtdIHwgbnVsbH0gYWxsIHBvc3NpYmxlIHJlcXVpcmVkIGxheWVyIGNvbHVtbiBwYWlyc1xuICovXG5mdW5jdGlvbiBfZmluZERlZmF1bHRDb2x1bW5GaWVsZChkZWZhdWx0RmllbGRzLCBhbGxGaWVsZHMpIHtcbiAgLy8gZmluZCBhbGwgbWF0Y2hlZCBmaWVsZHMgZm9yIGVhY2ggcmVxdWlyZWQgY29sXG4gIGNvbnN0IHJlcXVpcmVkQ29sdW1ucyA9IE9iamVjdC5rZXlzKGRlZmF1bHRGaWVsZHMpLnJlZHVjZSgocHJldiwga2V5KSA9PiB7XG4gICAgY29uc3QgcmVxdWlyZWRGaWVsZHMgPSBhbGxGaWVsZHMuZmlsdGVyKFxuICAgICAgZiA9PiBmLm5hbWUgPT09IGRlZmF1bHRGaWVsZHNba2V5XSB8fCBkZWZhdWx0RmllbGRzW2tleV0uaW5jbHVkZXMoZi5uYW1lKVxuICAgICk7XG5cbiAgICBwcmV2W2tleV0gPSByZXF1aXJlZEZpZWxkcy5sZW5ndGhcbiAgICAgID8gcmVxdWlyZWRGaWVsZHMubWFwKGYgPT4gKHtcbiAgICAgICAgICB2YWx1ZTogZi5uYW1lLFxuICAgICAgICAgIGZpZWxkSWR4OiBmLnRhYmxlRmllbGRJbmRleCAtIDFcbiAgICAgICAgfSkpXG4gICAgICA6IG51bGw7XG4gICAgcmV0dXJuIHByZXY7XG4gIH0sIHt9KTtcblxuICBpZiAoIU9iamVjdC52YWx1ZXMocmVxdWlyZWRDb2x1bW5zKS5ldmVyeShCb29sZWFuKSkge1xuICAgIC8vIGlmIGFueSBmaWVsZCBtaXNzaW5nLCByZXR1cm4gbnVsbFxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIF9nZXRBbGxQb3NzaWJsZUNvbHVtblBhcmlzKHJlcXVpcmVkQ29sdW1ucyk7XG59XG5cbi8qKlxuICogR2l2ZW4gYSBzZXQgb2YgY29sdW1uZXMgYW5kIGFsbCBpdHMgcG9zc2libGUgdmFsdWVzXG4gKiByZXR1cm4gYWxsIHBvc3NpYmxlIGNvbWJpbmF0aW9uc1xuICogZSxnIHdoZW4gcmVxdWlyZWRDb2x1bW5zID0ge2Y6IFsxLCAyXSwgYjogWydhJywgJ2InXX1cbiAqIHJldHVybiBbe2Y6IDEsIGI6ICdhJ30sIHtmOiAxLCBiOiAnYid9LCB7ZjogMiwgYjogJ2EnfSwge2Y6IDIsIGI6ICdiJ31dXG4gKiBhcyA0IHBvc3NpYmxlIHBhaXJzXG4gKiBAcGFyYW0ge29iamVjdH0gcmVxdWlyZWRDb2x1bW5zXG4gKiBAcmV0dXJucyB7b2JqZWN0W119IHBhaXJzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfZ2V0QWxsUG9zc2libGVDb2x1bW5QYXJpcyhyZXF1aXJlZENvbHVtbnMpIHtcbiAgLy8gZm9yIG11bHRpcGxlIG1hdGNoZWQgZmllbGQgZm9yIG9uZSByZXF1aXJlZCBjb2x1bW4sIHJldHVybiBtdWx0aXBsZVxuICAvLyBjb21iaW5hdGlvbnMsIGUuIGcuIGlmIGNvbHVtbiBhIGhhcyAyIG1hdGNoZWQsIGNvbHVtbiBiIGhhcyAzIG1hdGNoZWRcbiAgLy8gNiBwb3NzaWJsZSBjb2x1bW4gcGFpcnMgd2lsbCBiZSByZXR1cm5lZFxuICBjb25zdCBhbGxLZXlzID0gT2JqZWN0LmtleXMocmVxdWlyZWRDb2x1bW5zKTtcbiAgY29uc3QgcG9pbnRlcnMgPSBhbGxLZXlzLm1hcCgoaywgaSkgPT4gKGkgPT09IGFsbEtleXMubGVuZ3RoIC0gMSA/IC0xIDogMCkpO1xuICBjb25zdCBjb3VudFBlcktleSA9IGFsbEtleXMubWFwKGsgPT4gcmVxdWlyZWRDb2x1bW5zW2tdLmxlbmd0aCk7XG4gIGNvbnN0IHBhaXJzID0gW107XG5cbiAgLyogZXNsaW50LWRpc2FibGUgbm8tbG9vcC1mdW5jICovXG4gIHdoaWxlIChpbmNyZW1lbnRQb2ludGVycyhwb2ludGVycywgY291bnRQZXJLZXksIHBvaW50ZXJzLmxlbmd0aCAtIDEpKSB7XG4gICAgY29uc3QgbmV3UGFpciA9IHBvaW50ZXJzLnJlZHVjZSgocHJldiwgY3V1ciwgaSkgPT4ge1xuICAgICAgcHJldlthbGxLZXlzW2ldXSA9IHJlcXVpcmVkQ29sdW1uc1thbGxLZXlzW2ldXVtjdXVyXTtcbiAgICAgIHJldHVybiBwcmV2O1xuICAgIH0sIHt9KTtcblxuICAgIHBhaXJzLnB1c2gobmV3UGFpcik7XG4gIH1cbiAgLyogZXNsaW50LWVuYWJsZSBuby1sb29wLWZ1bmMgKi9cblxuICAvLyByZWN1cnNpdmVseSBpbmNyZW1lbnQgcG9pbnRlcnNcbiAgZnVuY3Rpb24gaW5jcmVtZW50UG9pbnRlcnMocHRzLCBjb3VudHMsIGluZGV4KSB7XG4gICAgaWYgKGluZGV4ID09PSAwICYmIHB0c1swXSA9PT0gY291bnRzWzBdIC0gMSkge1xuICAgICAgLy8gbm90aGluZyB0byBpbmNyZW1lbnRcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAocHRzW2luZGV4XSArIDEgPCBjb3VudHNbaW5kZXhdKSB7XG4gICAgICBwdHNbaW5kZXhdID0gcHRzW2luZGV4XSArIDE7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwdHNbaW5kZXhdID0gMDtcbiAgICByZXR1cm4gaW5jcmVtZW50UG9pbnRlcnMocHRzLCBjb3VudHMsIGluZGV4IC0gMSk7XG4gIH1cblxuICByZXR1cm4gcGFpcnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfZmluZERlZmF1bHRHZW9qc29uTGF5ZXIoZmllbGRzLCBkYXRhSWQsIGxhYmVsKSB7XG4gIGNvbnN0IGZpbmRHZW9qc29uQ29sdW1uID0gZmllbGRzXG4gICAgLmZpbHRlcihmID0+IGYudHlwZSA9PT0gQUxMX0ZJRUxEX1RZUEVTLmdlb2pzb24pXG4gICAgLm1hcChmID0+IGYubmFtZSk7XG5cbiAgY29uc3QgZGVmYXVsdENvbHVtbnMgPSB7XG4gICAgZ2VvanNvbjogdW5pcShbLi4uR0VPSlNPTl9GSUVMRFMuZ2VvanNvbiwgLi4uZmluZEdlb2pzb25Db2x1bW5dKVxuICB9O1xuXG4gIHJldHVybiBfZmluZERlZmF1bHRGZWF0dXJlTGF5ZXIoe1xuICAgIGZpZWxkcyxcbiAgICBkZWZhdWx0Q29sdW1ucyxcbiAgICB0eXBlOiBMQVlFUl9UWVBFUy5nZW9qc29uLFxuICAgIGRhdGFJZCxcbiAgICBsYWJlbFxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9maW5kRGVmYXVsdENsdXN0ZXJMYXllcnMocG9pbnRMYXllcnMpIHtcbiAgcmV0dXJuIF9maW5kRGVmYXVsdEFnZ3JlZ2F0aW9uTGF5ZXJzKHBvaW50TGF5ZXJzLCBMQVlFUl9UWVBFUy5jbHVzdGVyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9maW5kRGVmYXVsdEZlYXR1cmVMYXllcih7XG4gIGZpZWxkcyxcbiAgZGVmYXVsdENvbHVtbnMsXG4gIHR5cGUsXG4gIGxhYmVsLFxuICBkYXRhSWRcbn0pIHtcbiAgLy8gZmluZCBhbGwgcG9zc2libGUgcmVxdWlyZWQgY29sdW1uIHBhaXJzXG4gIGNvbnN0IGNvbHVtbnMgPSBfZmluZERlZmF1bHRDb2x1bW5GaWVsZChkZWZhdWx0Q29sdW1ucywgZmllbGRzKTtcblxuICBpZiAoIWNvbHVtbnMgfHwgIWNvbHVtbnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgcHJvcHMgPSB7XG4gICAgZGF0YUlkLFxuICAgIGxhYmVsOlxuICAgICAgKHR5cGVvZiBsYWJlbCA9PT0gJ3N0cmluZycgJiYgbGFiZWwucmVwbGFjZSgvXFwuW14vLl0rJC8sICcnKSkgfHwgdHlwZSxcbiAgICBpc1Zpc2libGU6IHRydWVcbiAgfTtcblxuICBjb25zdCBMYXllckNsYXNzID0gS2VwbGVyR0xMYXllcnNbTEFZRVJfQ0xBU1NFU1t0eXBlXV07XG5cbiAgLy8gY3JlYXRlIG9uZSBsYXllciBmb3IgZWFjaCBwb3NzaWJsZSBjb2x1bW4gcGFyaXNcbiAgcmV0dXJuIGNvbHVtbnMucmVkdWNlKChwcmV2LCBjdXJyKSA9PiB7XG4gICAgY29uc3QgbmV3TGF5ZXIgPSBuZXcgTGF5ZXJDbGFzcyh7Li4ucHJvcHMsIGNvbHVtbnM6IGN1cnJ9KTtcbiAgICBwcmV2LnB1c2gobmV3TGF5ZXIpO1xuICAgIHJldHVybiBwcmV2O1xuICB9LCBbXSk7XG59XG5cbi8qKlxuICogRmluZCBkZWZhdWx0IGhleGdvbklkIGxheWVycyBmcm9tIGZpZWxkc1xuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGZpZWxkc1xuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFJZFxuICogQHJldHVybnMge0FycmF5fSBmb3VuZCBwYXRoIGxheWVyc1xuICovXG5leHBvcnQgZnVuY3Rpb24gX2ZpbmREZWZhdWx0SGV4YWdvbklkTGF5ZXIoZmllbGRzLCBkYXRhSWQpIHtcbiAgcmV0dXJuIF9maW5kRGVmYXVsdEZlYXR1cmVMYXllcih7XG4gICAgZmllbGRzLFxuICAgIGRlZmF1bHRDb2x1bW5zOiBIRVhBR09OX0lEX0ZJRUxEUyxcbiAgICB0eXBlOiBMQVlFUl9UWVBFUy5oZXhhZ29uSWQsXG4gICAgbGFiZWw6ICdIZXhhZ29uJyxcbiAgICBkYXRhSWRcbiAgfSk7XG59XG5cbi8qKlxuICogRmluZCBkZWZhdWx0IGljb24gbGF5ZXJzIGZyb20gZmllbGRzXG4gKlxuICogQHBhcmFtIHtBcnJheX0gcG9pbnRMYXllcnNcbiAqIEBwYXJhbSB7QXJyYXl9IGZpZWxkc1xuICogQHJldHVybnMge0FycmF5fSBmb3VuZCBpY29uIGxheWVyc1xuICovXG5leHBvcnQgZnVuY3Rpb24gX2ZpbmREZWZhdWx0SWNvbkxheWVycyhwb2ludExheWVycywgZmllbGRzKSB7XG4gIGlmICghcG9pbnRMYXllcnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgaWNvbkZpZWxkcyA9IGZpZWxkcy5maWx0ZXIoKHtuYW1lfSkgPT5cbiAgICBuYW1lXG4gICAgICAucmVwbGFjZSgvW18sLl0rL2csICcgJylcbiAgICAgIC50cmltKClcbiAgICAgIC5zcGxpdCgnICcpXG4gICAgICAuc29tZShzZWcgPT4gSUNPTl9GSUVMRFMuaWNvbi5zb21lKHQgPT4gdC5pbmNsdWRlcyhzZWcpKSlcbiAgKTtcblxuICBpZiAoIWljb25GaWVsZHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIC8vIGNyZWF0ZSBpY29uIGxheWVycyBmb3IgZmlyc3QgcG9pbnQgbGF5ZXJcbiAgY29uc3QgcHRMYXllciA9IHBvaW50TGF5ZXJzWzBdO1xuXG4gIGNvbnN0IHByb3BzID0ge1xuICAgIGRhdGFJZDogcHRMYXllci5jb25maWcuZGF0YUlkLFxuICAgIGNvbHVtbnM6IHtcbiAgICAgIGxhdDogcHRMYXllci5jb25maWcuY29sdW1ucy5sYXQsXG4gICAgICBsbmc6IHB0TGF5ZXIuY29uZmlnLmNvbHVtbnMubG5nXG4gICAgfSxcbiAgICBpc1Zpc2libGU6IHRydWVcbiAgfTtcblxuICBjb25zdCBMYXllckNsYXNzID0gS2VwbGVyR0xMYXllcnNbTEFZRVJfQ0xBU1NFUy5pY29uXTtcblxuICByZXR1cm4gaWNvbkZpZWxkcy5tYXAoXG4gICAgaWNvbkZpZWxkID0+XG4gICAgICBuZXcgTGF5ZXJDbGFzcyh7XG4gICAgICAgIC4uLnByb3BzLFxuICAgICAgICBsYWJlbDogaWNvbkZpZWxkLm5hbWUucmVwbGFjZSgvW18sLl0rL2csICcgJykudHJpbSgpLFxuICAgICAgICBjb2x1bW5zOiB7XG4gICAgICAgICAgLi4ucHJvcHMuY29sdW1ucyxcbiAgICAgICAgICBpY29uOiB7XG4gICAgICAgICAgICB2YWx1ZTogaWNvbkZpZWxkLm5hbWUsXG4gICAgICAgICAgICBmaWVsZElkeDogaWNvbkZpZWxkLnRhYmxlRmllbGRJbmRleCAtIDFcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICk7XG59XG5cbi8qKlxuICogRmluZCBkZWZhdWx0IGdyaWQgbGF5ZXJzIGZyb20gZmllbGRzXG4gKlxuICogQHBhcmFtIHtBcnJheX0gcG9pbnRMYXllcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcmV0dXJucyB7QXJyYXl9IGFuIGFycmF5IG9mIGZvdW5kZWQgZ3JpZCBsYXllcnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9maW5kRGVmYXVsdEFnZ3JlZ2F0aW9uTGF5ZXJzKHBvaW50TGF5ZXJzLCB0eXBlKSB7XG4gIGlmICghcG9pbnRMYXllcnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgLy8gb25seSBjcmVhdGUgb25lIGFnZ3JlZ2F0aW9uIGxheWVyXG4gIGNvbnN0IHB0TGF5ZXIgPSBwb2ludExheWVyc1swXTtcblxuICBjb25zdCBwcm9wcyA9IHtcbiAgICBkYXRhSWQ6IHB0TGF5ZXIuY29uZmlnLmRhdGFJZCxcbiAgICBsYWJlbDogYCR7cHRMYXllci5jb25maWcubGFiZWx9ICR7dHlwZX1gXG4gIH07XG5cbiAgY29uc3QgTGF5ZXJDbGFzcyA9IEtlcGxlckdMTGF5ZXJzW0xBWUVSX0NMQVNTRVNbdHlwZV1dO1xuICBjb25zdCBuZXdMYXllciA9IG5ldyBMYXllckNsYXNzKHByb3BzKTtcblxuICAvLyBjb3B5IHBvaW50IGxheWVyIGNvbHVtbnMgb3ZlclxuICBuZXdMYXllci5jb25maWcuY29sdW1ucyA9IE9iamVjdC5rZXlzKG5ld0xheWVyLmNvbmZpZy5jb2x1bW5zKS5yZWR1Y2UoXG4gICAgKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgIC4uLmFjY3UsXG4gICAgICBba2V5XTogey4uLnB0TGF5ZXIuY29uZmlnLmNvbHVtbnNba2V5XX1cbiAgICB9KSxcbiAgICB7fVxuICApO1xuXG4gIHJldHVybiBbbmV3TGF5ZXJdO1xufVxuXG4vKipcbiAqIGNhbGN1bGF0ZSBsYXllciBkYXRhIGJhc2VkIG9uIGxheWVyIHR5cGUsIGNvbCBDb25maWcsXG4gKiByZXR1cm4gdXBkYXRlZCBsYXllciBpZiBjb2xvckRvbWFpbiwgZGF0YU1hcCBoYXMgY2hhbmdlZFxuICogQHBhcmFtIHtvYmplY3R9IGxheWVyXG4gKiBAcGFyYW0ge29iamVjdH0gc3RhdGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBvbGRMYXllckRhdGFcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRcbiAqIEByZXR1cm5zIHtvYmplY3R9IHtsYXllckRhdGE6IHt9LCBsYXllcjoge30gfHwgdW5kZWZpbmVkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FsY3VsYXRlTGF5ZXJEYXRhKGxheWVyLCBzdGF0ZSwgb2xkTGF5ZXJEYXRhLCBvcHQgPSB7fSkge1xuICBjb25zdCB7dHlwZX0gPSBsYXllcjtcbiAgY29uc3Qge2RhdGFzZXRzfSA9IHN0YXRlO1xuXG4gIGNvbnN0IHtkYXRhLCBmaWx0ZXJlZEluZGV4LCBhbGxEYXRhfSA9IGRhdGFzZXRzW2xheWVyLmNvbmZpZy5kYXRhSWRdIHx8IHt9O1xuXG4gIGlmICghdHlwZSB8fCAhbGF5ZXIuaGFzQWxsQ29sdW1ucygpKSB7XG4gICAgcmV0dXJuIHtsYXllciwgbGF5ZXJEYXRhOiB7fX07XG4gIH1cblxuICBjb25zdCBsYXllckRhdGEgPSBsYXllci5mb3JtYXRMYXllckRhdGEoXG4gICAgZGF0YSxcbiAgICBhbGxEYXRhLFxuICAgIGZpbHRlcmVkSW5kZXgsXG4gICAgb2xkTGF5ZXJEYXRhLFxuICAgIG9wdFxuICApO1xuICByZXR1cm4ge2xheWVyRGF0YSwgbGF5ZXJ9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGlnaHRTZXR0aW5nc0Zyb21Cb3VuZHMoYm91bmRzKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGJvdW5kcykgJiYgYm91bmRzLmxlbmd0aCA+PSA0XG4gICAgPyB7XG4gICAgICAgIC4uLkRFRkFVTFRfTElHSFRfU0VUVElOR1MsXG4gICAgICAgIGxpZ2h0c1Bvc2l0aW9uOiBbXG4gICAgICAgICAgLi4uYm91bmRzLnNsaWNlKDAsIDIpLFxuICAgICAgICAgIERFRkFVTFRfTElHSFRfU0VUVElOR1MubGlnaHRzUG9zaXRpb25bMl0sXG4gICAgICAgICAgLi4uYm91bmRzLnNsaWNlKDIsIDQpLFxuICAgICAgICAgIERFRkFVTFRfTElHSFRfU0VUVElOR1MubGlnaHRzUG9zaXRpb25bNV1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIDogREVGQVVMVF9MSUdIVF9TRVRUSU5HUztcbn1cbiJdfQ==