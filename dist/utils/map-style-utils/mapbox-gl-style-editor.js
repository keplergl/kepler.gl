'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editBottomMapStyle = exports.editTopMapStyle = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

exports.getDefaultLayerGroupVisibility = getDefaultLayerGroupVisibility;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _lodash = require('lodash.memoize');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getDefaultLayerGroupVisibility(_ref) {
  var _ref$layerGroups = _ref.layerGroups,
      layerGroups = _ref$layerGroups === undefined ? [] : _ref$layerGroups;

  return layerGroups.reduce(function (accu, layer) {
    return (0, _extends4.default)({}, accu, (0, _defineProperty3.default)({}, layer.slug, layer.defaultVisibility));
  }, {});
}

var resolver = function resolver(_ref2) {
  var id = _ref2.id,
      mapStyle = _ref2.mapStyle,
      _ref2$visibleLayerGro = _ref2.visibleLayerGroups,
      visibleLayerGroups = _ref2$visibleLayerGro === undefined ? {} : _ref2$visibleLayerGro;
  return id + ':' + Object.keys(visibleLayerGroups).filter(function (d) {
    return visibleLayerGroups[d];
  }).sort().join('-');
};

/**
 * Edit preset map style to keep only visible layers
 *
 * @param {object} mapStyle - preset map style
 * @param {object} visibleLayerGroups - visible layers of top map
 * @returns {Immutable.Map} top map style
 */
var editTopMapStyle = exports.editTopMapStyle = (0, _lodash2.default)(function (_ref3) {
  var id = _ref3.id,
      mapStyle = _ref3.mapStyle,
      visibleLayerGroups = _ref3.visibleLayerGroups;

  var visibleFilters = mapStyle.layerGroups.filter(function (lg) {
    return visibleLayerGroups[lg.slug];
  }).map(function (lg) {
    return lg.filter;
  });

  // if top map
  // keep only visible layers
  var filteredLayers = mapStyle.style.layers.filter(function (layer) {
    return visibleFilters.some(function (match) {
      return match(layer);
    });
  });

  return _immutable2.default.fromJS((0, _extends4.default)({}, mapStyle.style, {
    layers: filteredLayers
  }));
}, resolver);

/**
 * Edit preset map style to filter out invisible layers
 *
 * @param {object} mapStyle - preset map style
 * @param {object} visibleLayerGroups - visible layers of bottom map
 * @returns {Immutable.Map} bottom map style
 */
var editBottomMapStyle = exports.editBottomMapStyle = (0, _lodash2.default)(function (_ref4) {
  var id = _ref4.id,
      mapStyle = _ref4.mapStyle,
      visibleLayerGroups = _ref4.visibleLayerGroups;

  var invisibleFilters = mapStyle.layerGroups.filter(function (lg) {
    return !visibleLayerGroups[lg.slug];
  }).map(function (lg) {
    return lg.filter;
  });

  // if bottom map
  // filter out invisible layers
  var filteredLayers = mapStyle.style.layers.filter(function (layer) {
    return invisibleFilters.every(function (match) {
      return !match(layer);
    });
  });

  return _immutable2.default.fromJS((0, _extends4.default)({}, mapStyle.style, {
    layers: filteredLayers
  }));
}, resolver);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9tYXAtc3R5bGUtdXRpbHMvbWFwYm94LWdsLXN0eWxlLWVkaXRvci5qcyJdLCJuYW1lcyI6WyJnZXREZWZhdWx0TGF5ZXJHcm91cFZpc2liaWxpdHkiLCJsYXllckdyb3VwcyIsInJlZHVjZSIsImFjY3UiLCJsYXllciIsInNsdWciLCJkZWZhdWx0VmlzaWJpbGl0eSIsInJlc29sdmVyIiwiaWQiLCJtYXBTdHlsZSIsInZpc2libGVMYXllckdyb3VwcyIsIk9iamVjdCIsImtleXMiLCJmaWx0ZXIiLCJkIiwic29ydCIsImpvaW4iLCJlZGl0VG9wTWFwU3R5bGUiLCJ2aXNpYmxlRmlsdGVycyIsImxnIiwibWFwIiwiZmlsdGVyZWRMYXllcnMiLCJzdHlsZSIsImxheWVycyIsInNvbWUiLCJtYXRjaCIsImZyb21KUyIsImVkaXRCb3R0b21NYXBTdHlsZSIsImludmlzaWJsZUZpbHRlcnMiLCJldmVyeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O1FBR2dCQSw4QixHQUFBQSw4Qjs7QUFIaEI7Ozs7QUFDQTs7Ozs7O0FBRU8sU0FBU0EsOEJBQVQsT0FBNEQ7QUFBQSw4QkFBbkJDLFdBQW1CO0FBQUEsTUFBbkJBLFdBQW1CLG9DQUFMLEVBQUs7O0FBQ2pFLFNBQU9BLFlBQVlDLE1BQVosQ0FDTCxVQUFDQyxJQUFELEVBQU9DLEtBQVA7QUFBQSxzQ0FDS0QsSUFETCxvQ0FFR0MsTUFBTUMsSUFGVCxFQUVnQkQsTUFBTUUsaUJBRnRCO0FBQUEsR0FESyxFQUtMLEVBTEssQ0FBUDtBQU9EOztBQUVELElBQU1DLFdBQVcsU0FBWEEsUUFBVztBQUFBLE1BQUVDLEVBQUYsU0FBRUEsRUFBRjtBQUFBLE1BQU1DLFFBQU4sU0FBTUEsUUFBTjtBQUFBLG9DQUFnQkMsa0JBQWhCO0FBQUEsTUFBZ0JBLGtCQUFoQix5Q0FBcUMsRUFBckM7QUFBQSxTQUNaRixFQURZLFNBQ05HLE9BQU9DLElBQVAsQ0FBWUYsa0JBQVosRUFDTkcsTUFETSxDQUNDO0FBQUEsV0FBS0gsbUJBQW1CSSxDQUFuQixDQUFMO0FBQUEsR0FERCxFQUVOQyxJQUZNLEdBR05DLElBSE0sQ0FHRCxHQUhDLENBRE07QUFBQSxDQUFqQjs7QUFNQTs7Ozs7OztBQU9PLElBQU1DLDRDQUFrQixzQkFBUSxpQkFBd0M7QUFBQSxNQUF0Q1QsRUFBc0MsU0FBdENBLEVBQXNDO0FBQUEsTUFBbENDLFFBQWtDLFNBQWxDQSxRQUFrQztBQUFBLE1BQXhCQyxrQkFBd0IsU0FBeEJBLGtCQUF3Qjs7QUFDN0UsTUFBTVEsaUJBQWlCVCxTQUFTUixXQUFULENBQ3BCWSxNQURvQixDQUNiO0FBQUEsV0FBTUgsbUJBQW1CUyxHQUFHZCxJQUF0QixDQUFOO0FBQUEsR0FEYSxFQUVwQmUsR0FGb0IsQ0FFaEI7QUFBQSxXQUFNRCxHQUFHTixNQUFUO0FBQUEsR0FGZ0IsQ0FBdkI7O0FBSUE7QUFDQTtBQUNBLE1BQU1RLGlCQUFpQlosU0FBU2EsS0FBVCxDQUFlQyxNQUFmLENBQXNCVixNQUF0QixDQUE2QjtBQUFBLFdBQ2xESyxlQUFlTSxJQUFmLENBQW9CO0FBQUEsYUFBU0MsTUFBTXJCLEtBQU4sQ0FBVDtBQUFBLEtBQXBCLENBRGtEO0FBQUEsR0FBN0IsQ0FBdkI7O0FBSUEsU0FBTyxvQkFBVXNCLE1BQVYsNEJBQ0ZqQixTQUFTYSxLQURQO0FBRUxDLFlBQVFGO0FBRkgsS0FBUDtBQUlELENBZjhCLEVBZTVCZCxRQWY0QixDQUF4Qjs7QUFpQlA7Ozs7Ozs7QUFPTyxJQUFNb0Isa0RBQXFCLHNCQUNoQyxpQkFBd0M7QUFBQSxNQUF0Q25CLEVBQXNDLFNBQXRDQSxFQUFzQztBQUFBLE1BQWxDQyxRQUFrQyxTQUFsQ0EsUUFBa0M7QUFBQSxNQUF4QkMsa0JBQXdCLFNBQXhCQSxrQkFBd0I7O0FBQ3RDLE1BQU1rQixtQkFBbUJuQixTQUFTUixXQUFULENBQ3RCWSxNQURzQixDQUNmO0FBQUEsV0FBTSxDQUFDSCxtQkFBbUJTLEdBQUdkLElBQXRCLENBQVA7QUFBQSxHQURlLEVBRXRCZSxHQUZzQixDQUVsQjtBQUFBLFdBQU1ELEdBQUdOLE1BQVQ7QUFBQSxHQUZrQixDQUF6Qjs7QUFJQTtBQUNBO0FBQ0EsTUFBTVEsaUJBQWlCWixTQUFTYSxLQUFULENBQWVDLE1BQWYsQ0FBc0JWLE1BQXRCLENBQTZCO0FBQUEsV0FDbERlLGlCQUFpQkMsS0FBakIsQ0FBdUI7QUFBQSxhQUFTLENBQUNKLE1BQU1yQixLQUFOLENBQVY7QUFBQSxLQUF2QixDQURrRDtBQUFBLEdBQTdCLENBQXZCOztBQUlBLFNBQU8sb0JBQVVzQixNQUFWLDRCQUNGakIsU0FBU2EsS0FEUDtBQUVMQyxZQUFRRjtBQUZILEtBQVA7QUFJRCxDQWhCK0IsRUFpQmhDZCxRQWpCZ0MsQ0FBM0IiLCJmaWxlIjoibWFwYm94LWdsLXN0eWxlLWVkaXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCBtZW1vaXplIGZyb20gJ2xvZGFzaC5tZW1vaXplJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldERlZmF1bHRMYXllckdyb3VwVmlzaWJpbGl0eSh7bGF5ZXJHcm91cHMgPSBbXX0pIHtcbiAgcmV0dXJuIGxheWVyR3JvdXBzLnJlZHVjZShcbiAgICAoYWNjdSwgbGF5ZXIpID0+ICh7XG4gICAgICAuLi5hY2N1LFxuICAgICAgW2xheWVyLnNsdWddOiBsYXllci5kZWZhdWx0VmlzaWJpbGl0eVxuICAgIH0pLFxuICAgIHt9XG4gICk7XG59XG5cbmNvbnN0IHJlc29sdmVyID0gKHtpZCwgbWFwU3R5bGUsIHZpc2libGVMYXllckdyb3VwcyA9IHt9fSkgPT5cbiAgYCR7aWR9OiR7T2JqZWN0LmtleXModmlzaWJsZUxheWVyR3JvdXBzKVxuICAgIC5maWx0ZXIoZCA9PiB2aXNpYmxlTGF5ZXJHcm91cHNbZF0pXG4gICAgLnNvcnQoKVxuICAgIC5qb2luKCctJyl9YDtcblxuLyoqXG4gKiBFZGl0IHByZXNldCBtYXAgc3R5bGUgdG8ga2VlcCBvbmx5IHZpc2libGUgbGF5ZXJzXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG1hcFN0eWxlIC0gcHJlc2V0IG1hcCBzdHlsZVxuICogQHBhcmFtIHtvYmplY3R9IHZpc2libGVMYXllckdyb3VwcyAtIHZpc2libGUgbGF5ZXJzIG9mIHRvcCBtYXBcbiAqIEByZXR1cm5zIHtJbW11dGFibGUuTWFwfSB0b3AgbWFwIHN0eWxlXG4gKi9cbmV4cG9ydCBjb25zdCBlZGl0VG9wTWFwU3R5bGUgPSBtZW1vaXplKCh7aWQsIG1hcFN0eWxlLCB2aXNpYmxlTGF5ZXJHcm91cHN9KSA9PiB7XG4gIGNvbnN0IHZpc2libGVGaWx0ZXJzID0gbWFwU3R5bGUubGF5ZXJHcm91cHNcbiAgICAuZmlsdGVyKGxnID0+IHZpc2libGVMYXllckdyb3Vwc1tsZy5zbHVnXSlcbiAgICAubWFwKGxnID0+IGxnLmZpbHRlcik7XG5cbiAgLy8gaWYgdG9wIG1hcFxuICAvLyBrZWVwIG9ubHkgdmlzaWJsZSBsYXllcnNcbiAgY29uc3QgZmlsdGVyZWRMYXllcnMgPSBtYXBTdHlsZS5zdHlsZS5sYXllcnMuZmlsdGVyKGxheWVyID0+XG4gICAgdmlzaWJsZUZpbHRlcnMuc29tZShtYXRjaCA9PiBtYXRjaChsYXllcikpXG4gICk7XG5cbiAgcmV0dXJuIEltbXV0YWJsZS5mcm9tSlMoe1xuICAgIC4uLm1hcFN0eWxlLnN0eWxlLFxuICAgIGxheWVyczogZmlsdGVyZWRMYXllcnNcbiAgfSk7XG59LCByZXNvbHZlcik7XG5cbi8qKlxuICogRWRpdCBwcmVzZXQgbWFwIHN0eWxlIHRvIGZpbHRlciBvdXQgaW52aXNpYmxlIGxheWVyc1xuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBtYXBTdHlsZSAtIHByZXNldCBtYXAgc3R5bGVcbiAqIEBwYXJhbSB7b2JqZWN0fSB2aXNpYmxlTGF5ZXJHcm91cHMgLSB2aXNpYmxlIGxheWVycyBvZiBib3R0b20gbWFwXG4gKiBAcmV0dXJucyB7SW1tdXRhYmxlLk1hcH0gYm90dG9tIG1hcCBzdHlsZVxuICovXG5leHBvcnQgY29uc3QgZWRpdEJvdHRvbU1hcFN0eWxlID0gbWVtb2l6ZShcbiAgKHtpZCwgbWFwU3R5bGUsIHZpc2libGVMYXllckdyb3Vwc30pID0+IHtcbiAgICBjb25zdCBpbnZpc2libGVGaWx0ZXJzID0gbWFwU3R5bGUubGF5ZXJHcm91cHNcbiAgICAgIC5maWx0ZXIobGcgPT4gIXZpc2libGVMYXllckdyb3Vwc1tsZy5zbHVnXSlcbiAgICAgIC5tYXAobGcgPT4gbGcuZmlsdGVyKTtcblxuICAgIC8vIGlmIGJvdHRvbSBtYXBcbiAgICAvLyBmaWx0ZXIgb3V0IGludmlzaWJsZSBsYXllcnNcbiAgICBjb25zdCBmaWx0ZXJlZExheWVycyA9IG1hcFN0eWxlLnN0eWxlLmxheWVycy5maWx0ZXIobGF5ZXIgPT5cbiAgICAgIGludmlzaWJsZUZpbHRlcnMuZXZlcnkobWF0Y2ggPT4gIW1hdGNoKGxheWVyKSlcbiAgICApO1xuXG4gICAgcmV0dXJuIEltbXV0YWJsZS5mcm9tSlMoe1xuICAgICAgLi4ubWFwU3R5bGUuc3R5bGUsXG4gICAgICBsYXllcnM6IGZpbHRlcmVkTGF5ZXJzXG4gICAgfSk7XG4gIH0sXG4gIHJlc29sdmVyXG4pO1xuIl19