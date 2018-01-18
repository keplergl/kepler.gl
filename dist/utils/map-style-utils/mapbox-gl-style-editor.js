'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editBottomMapStyle = exports.editTopMapStyle = undefined;

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
    var _extends2;

    return (0, _extends4.default)({}, accu, (_extends2 = {}, _extends2[layer.slug] = layer.defaultVisibility, _extends2));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9tYXAtc3R5bGUtdXRpbHMvbWFwYm94LWdsLXN0eWxlLWVkaXRvci5qcyJdLCJuYW1lcyI6WyJnZXREZWZhdWx0TGF5ZXJHcm91cFZpc2liaWxpdHkiLCJsYXllckdyb3VwcyIsInJlZHVjZSIsImFjY3UiLCJsYXllciIsInNsdWciLCJkZWZhdWx0VmlzaWJpbGl0eSIsInJlc29sdmVyIiwiaWQiLCJtYXBTdHlsZSIsInZpc2libGVMYXllckdyb3VwcyIsIk9iamVjdCIsImtleXMiLCJmaWx0ZXIiLCJkIiwic29ydCIsImpvaW4iLCJlZGl0VG9wTWFwU3R5bGUiLCJ2aXNpYmxlRmlsdGVycyIsImxnIiwibWFwIiwiZmlsdGVyZWRMYXllcnMiLCJzdHlsZSIsImxheWVycyIsInNvbWUiLCJtYXRjaCIsImZyb21KUyIsImVkaXRCb3R0b21NYXBTdHlsZSIsImludmlzaWJsZUZpbHRlcnMiLCJldmVyeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7UUFHZ0JBLDhCLEdBQUFBLDhCOztBQUhoQjs7OztBQUNBOzs7Ozs7QUFFTyxTQUFTQSw4QkFBVCxPQUE0RDtBQUFBLDhCQUFuQkMsV0FBbUI7QUFBQSxNQUFuQkEsV0FBbUIsb0NBQUwsRUFBSzs7QUFDakUsU0FBT0EsWUFDSkMsTUFESSxDQUNHLFVBQUNDLElBQUQsRUFBT0MsS0FBUDtBQUFBOztBQUFBLHNDQUNIRCxJQURHLDZCQUVMQyxNQUFNQyxJQUZELElBRVFELE1BQU1FLGlCQUZkO0FBQUEsR0FESCxFQUlELEVBSkMsQ0FBUDtBQUtEOztBQUVELElBQU1DLFdBQVcsU0FBWEEsUUFBVztBQUFBLE1BQUVDLEVBQUYsU0FBRUEsRUFBRjtBQUFBLE1BQU1DLFFBQU4sU0FBTUEsUUFBTjtBQUFBLG9DQUFnQkMsa0JBQWhCO0FBQUEsTUFBZ0JBLGtCQUFoQix5Q0FBcUMsRUFBckM7QUFBQSxTQUNaRixFQURZLFNBQ05HLE9BQU9DLElBQVAsQ0FBWUYsa0JBQVosRUFDTkcsTUFETSxDQUNDO0FBQUEsV0FBS0gsbUJBQW1CSSxDQUFuQixDQUFMO0FBQUEsR0FERCxFQUM2QkMsSUFEN0IsR0FDb0NDLElBRHBDLENBQ3lDLEdBRHpDLENBRE07QUFBQSxDQUFqQjs7QUFJQTs7Ozs7OztBQU9PLElBQU1DLDRDQUFrQixzQkFBUSxpQkFBd0M7QUFBQSxNQUF0Q1QsRUFBc0MsU0FBdENBLEVBQXNDO0FBQUEsTUFBbENDLFFBQWtDLFNBQWxDQSxRQUFrQztBQUFBLE1BQXhCQyxrQkFBd0IsU0FBeEJBLGtCQUF3Qjs7O0FBRTdFLE1BQU1RLGlCQUFpQlQsU0FBU1IsV0FBVCxDQUNwQlksTUFEb0IsQ0FDYjtBQUFBLFdBQU1ILG1CQUFtQlMsR0FBR2QsSUFBdEIsQ0FBTjtBQUFBLEdBRGEsRUFFcEJlLEdBRm9CLENBRWhCO0FBQUEsV0FBTUQsR0FBR04sTUFBVDtBQUFBLEdBRmdCLENBQXZCOztBQUlBO0FBQ0E7QUFDQSxNQUFNUSxpQkFBaUJaLFNBQVNhLEtBQVQsQ0FBZUMsTUFBZixDQUNwQlYsTUFEb0IsQ0FDYjtBQUFBLFdBQVNLLGVBQWVNLElBQWYsQ0FBb0I7QUFBQSxhQUFTQyxNQUFNckIsS0FBTixDQUFUO0FBQUEsS0FBcEIsQ0FBVDtBQUFBLEdBRGEsQ0FBdkI7O0FBR0EsU0FBTyxvQkFBVXNCLE1BQVYsNEJBQ0ZqQixTQUFTYSxLQURQO0FBRUxDLFlBQVFGO0FBRkgsS0FBUDtBQUlELENBZjhCLEVBZTVCZCxRQWY0QixDQUF4Qjs7QUFpQlA7Ozs7Ozs7QUFPTyxJQUFNb0Isa0RBQXFCLHNCQUFRLGlCQUF3QztBQUFBLE1BQXRDbkIsRUFBc0MsU0FBdENBLEVBQXNDO0FBQUEsTUFBbENDLFFBQWtDLFNBQWxDQSxRQUFrQztBQUFBLE1BQXhCQyxrQkFBd0IsU0FBeEJBLGtCQUF3Qjs7O0FBRWhGLE1BQU1rQixtQkFBbUJuQixTQUFTUixXQUFULENBQ3RCWSxNQURzQixDQUNmO0FBQUEsV0FBTSxDQUFDSCxtQkFBbUJTLEdBQUdkLElBQXRCLENBQVA7QUFBQSxHQURlLEVBRXRCZSxHQUZzQixDQUVsQjtBQUFBLFdBQU1ELEdBQUdOLE1BQVQ7QUFBQSxHQUZrQixDQUF6Qjs7QUFJQTtBQUNBO0FBQ0EsTUFBTVEsaUJBQWlCWixTQUFTYSxLQUFULENBQWVDLE1BQWYsQ0FDcEJWLE1BRG9CLENBQ2I7QUFBQSxXQUFTZSxpQkFBaUJDLEtBQWpCLENBQXVCO0FBQUEsYUFBUyxDQUFDSixNQUFNckIsS0FBTixDQUFWO0FBQUEsS0FBdkIsQ0FBVDtBQUFBLEdBRGEsQ0FBdkI7O0FBR0EsU0FBTyxvQkFBVXNCLE1BQVYsNEJBQ0ZqQixTQUFTYSxLQURQO0FBRUxDLFlBQVFGO0FBRkgsS0FBUDtBQUlELENBZmlDLEVBZS9CZCxRQWYrQixDQUEzQiIsImZpbGUiOiJtYXBib3gtZ2wtc3R5bGUtZWRpdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xuaW1wb3J0IG1lbW9pemUgZnJvbSAnbG9kYXNoLm1lbW9pemUnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdExheWVyR3JvdXBWaXNpYmlsaXR5KHtsYXllckdyb3VwcyA9IFtdfSkge1xuICByZXR1cm4gbGF5ZXJHcm91cHNcbiAgICAucmVkdWNlKChhY2N1LCBsYXllcikgPT4gKHtcbiAgICAgIC4uLmFjY3UsXG4gICAgICBbbGF5ZXIuc2x1Z106IGxheWVyLmRlZmF1bHRWaXNpYmlsaXR5XG4gICAgfSksIHt9KTtcbn1cblxuY29uc3QgcmVzb2x2ZXIgPSAoe2lkLCBtYXBTdHlsZSwgdmlzaWJsZUxheWVyR3JvdXBzID0ge319KSA9PlxuICBgJHtpZH06JHtPYmplY3Qua2V5cyh2aXNpYmxlTGF5ZXJHcm91cHMpXG4gICAgLmZpbHRlcihkID0+IHZpc2libGVMYXllckdyb3Vwc1tkXSkuc29ydCgpLmpvaW4oJy0nKX1gO1xuXG4vKipcbiAqIEVkaXQgcHJlc2V0IG1hcCBzdHlsZSB0byBrZWVwIG9ubHkgdmlzaWJsZSBsYXllcnNcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gbWFwU3R5bGUgLSBwcmVzZXQgbWFwIHN0eWxlXG4gKiBAcGFyYW0ge29iamVjdH0gdmlzaWJsZUxheWVyR3JvdXBzIC0gdmlzaWJsZSBsYXllcnMgb2YgdG9wIG1hcFxuICogQHJldHVybnMge0ltbXV0YWJsZS5NYXB9IHRvcCBtYXAgc3R5bGVcbiAqL1xuZXhwb3J0IGNvbnN0IGVkaXRUb3BNYXBTdHlsZSA9IG1lbW9pemUoKHtpZCwgbWFwU3R5bGUsIHZpc2libGVMYXllckdyb3Vwc30pID0+IHtcblxuICBjb25zdCB2aXNpYmxlRmlsdGVycyA9IG1hcFN0eWxlLmxheWVyR3JvdXBzXG4gICAgLmZpbHRlcihsZyA9PiB2aXNpYmxlTGF5ZXJHcm91cHNbbGcuc2x1Z10pXG4gICAgLm1hcChsZyA9PiBsZy5maWx0ZXIpO1xuXG4gIC8vIGlmIHRvcCBtYXBcbiAgLy8ga2VlcCBvbmx5IHZpc2libGUgbGF5ZXJzXG4gIGNvbnN0IGZpbHRlcmVkTGF5ZXJzID0gbWFwU3R5bGUuc3R5bGUubGF5ZXJzXG4gICAgLmZpbHRlcihsYXllciA9PiB2aXNpYmxlRmlsdGVycy5zb21lKG1hdGNoID0+IG1hdGNoKGxheWVyKSkpO1xuXG4gIHJldHVybiBJbW11dGFibGUuZnJvbUpTKHtcbiAgICAuLi5tYXBTdHlsZS5zdHlsZSxcbiAgICBsYXllcnM6IGZpbHRlcmVkTGF5ZXJzXG4gIH0pO1xufSwgcmVzb2x2ZXIpO1xuXG4vKipcbiAqIEVkaXQgcHJlc2V0IG1hcCBzdHlsZSB0byBmaWx0ZXIgb3V0IGludmlzaWJsZSBsYXllcnNcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gbWFwU3R5bGUgLSBwcmVzZXQgbWFwIHN0eWxlXG4gKiBAcGFyYW0ge29iamVjdH0gdmlzaWJsZUxheWVyR3JvdXBzIC0gdmlzaWJsZSBsYXllcnMgb2YgYm90dG9tIG1hcFxuICogQHJldHVybnMge0ltbXV0YWJsZS5NYXB9IGJvdHRvbSBtYXAgc3R5bGVcbiAqL1xuZXhwb3J0IGNvbnN0IGVkaXRCb3R0b21NYXBTdHlsZSA9IG1lbW9pemUoKHtpZCwgbWFwU3R5bGUsIHZpc2libGVMYXllckdyb3Vwc30pID0+IHtcblxuICBjb25zdCBpbnZpc2libGVGaWx0ZXJzID0gbWFwU3R5bGUubGF5ZXJHcm91cHNcbiAgICAuZmlsdGVyKGxnID0+ICF2aXNpYmxlTGF5ZXJHcm91cHNbbGcuc2x1Z10pXG4gICAgLm1hcChsZyA9PiBsZy5maWx0ZXIpO1xuXG4gIC8vIGlmIGJvdHRvbSBtYXBcbiAgLy8gZmlsdGVyIG91dCBpbnZpc2libGUgbGF5ZXJzXG4gIGNvbnN0IGZpbHRlcmVkTGF5ZXJzID0gbWFwU3R5bGUuc3R5bGUubGF5ZXJzXG4gICAgLmZpbHRlcihsYXllciA9PiBpbnZpc2libGVGaWx0ZXJzLmV2ZXJ5KG1hdGNoID0+ICFtYXRjaChsYXllcikpKTtcblxuICByZXR1cm4gSW1tdXRhYmxlLmZyb21KUyh7XG4gICAgLi4ubWFwU3R5bGUuc3R5bGUsXG4gICAgbGF5ZXJzOiBmaWx0ZXJlZExheWVyc1xuICB9KTtcbn0sIHJlc29sdmVyKTtcbiJdfQ==