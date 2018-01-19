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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9tYXAtc3R5bGUtdXRpbHMvbWFwYm94LWdsLXN0eWxlLWVkaXRvci5qcyJdLCJuYW1lcyI6WyJnZXREZWZhdWx0TGF5ZXJHcm91cFZpc2liaWxpdHkiLCJsYXllckdyb3VwcyIsInJlZHVjZSIsImFjY3UiLCJsYXllciIsInNsdWciLCJkZWZhdWx0VmlzaWJpbGl0eSIsInJlc29sdmVyIiwiaWQiLCJtYXBTdHlsZSIsInZpc2libGVMYXllckdyb3VwcyIsIk9iamVjdCIsImtleXMiLCJmaWx0ZXIiLCJkIiwic29ydCIsImpvaW4iLCJlZGl0VG9wTWFwU3R5bGUiLCJ2aXNpYmxlRmlsdGVycyIsImxnIiwibWFwIiwiZmlsdGVyZWRMYXllcnMiLCJzdHlsZSIsImxheWVycyIsInNvbWUiLCJtYXRjaCIsImZyb21KUyIsImVkaXRCb3R0b21NYXBTdHlsZSIsImludmlzaWJsZUZpbHRlcnMiLCJldmVyeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7UUFHZ0JBLDhCLEdBQUFBLDhCOztBQUhoQjs7OztBQUNBOzs7Ozs7QUFFTyxTQUFTQSw4QkFBVCxPQUE0RDtBQUFBLDhCQUFuQkMsV0FBbUI7QUFBQSxNQUFuQkEsV0FBbUIsb0NBQUwsRUFBSzs7QUFDakUsU0FBT0EsWUFBWUMsTUFBWixDQUNMLFVBQUNDLElBQUQsRUFBT0MsS0FBUDtBQUFBOztBQUFBLHNDQUNLRCxJQURMLDZCQUVHQyxNQUFNQyxJQUZULElBRWdCRCxNQUFNRSxpQkFGdEI7QUFBQSxHQURLLEVBS0wsRUFMSyxDQUFQO0FBT0Q7O0FBRUQsSUFBTUMsV0FBVyxTQUFYQSxRQUFXO0FBQUEsTUFBRUMsRUFBRixTQUFFQSxFQUFGO0FBQUEsTUFBTUMsUUFBTixTQUFNQSxRQUFOO0FBQUEsb0NBQWdCQyxrQkFBaEI7QUFBQSxNQUFnQkEsa0JBQWhCLHlDQUFxQyxFQUFyQztBQUFBLFNBQ1pGLEVBRFksU0FDTkcsT0FBT0MsSUFBUCxDQUFZRixrQkFBWixFQUNORyxNQURNLENBQ0M7QUFBQSxXQUFLSCxtQkFBbUJJLENBQW5CLENBQUw7QUFBQSxHQURELEVBRU5DLElBRk0sR0FHTkMsSUFITSxDQUdELEdBSEMsQ0FETTtBQUFBLENBQWpCOztBQU1BOzs7Ozs7O0FBT08sSUFBTUMsNENBQWtCLHNCQUFRLGlCQUF3QztBQUFBLE1BQXRDVCxFQUFzQyxTQUF0Q0EsRUFBc0M7QUFBQSxNQUFsQ0MsUUFBa0MsU0FBbENBLFFBQWtDO0FBQUEsTUFBeEJDLGtCQUF3QixTQUF4QkEsa0JBQXdCOztBQUM3RSxNQUFNUSxpQkFBaUJULFNBQVNSLFdBQVQsQ0FDcEJZLE1BRG9CLENBQ2I7QUFBQSxXQUFNSCxtQkFBbUJTLEdBQUdkLElBQXRCLENBQU47QUFBQSxHQURhLEVBRXBCZSxHQUZvQixDQUVoQjtBQUFBLFdBQU1ELEdBQUdOLE1BQVQ7QUFBQSxHQUZnQixDQUF2Qjs7QUFJQTtBQUNBO0FBQ0EsTUFBTVEsaUJBQWlCWixTQUFTYSxLQUFULENBQWVDLE1BQWYsQ0FBc0JWLE1BQXRCLENBQTZCO0FBQUEsV0FDbERLLGVBQWVNLElBQWYsQ0FBb0I7QUFBQSxhQUFTQyxNQUFNckIsS0FBTixDQUFUO0FBQUEsS0FBcEIsQ0FEa0Q7QUFBQSxHQUE3QixDQUF2Qjs7QUFJQSxTQUFPLG9CQUFVc0IsTUFBViw0QkFDRmpCLFNBQVNhLEtBRFA7QUFFTEMsWUFBUUY7QUFGSCxLQUFQO0FBSUQsQ0FmOEIsRUFlNUJkLFFBZjRCLENBQXhCOztBQWlCUDs7Ozs7OztBQU9PLElBQU1vQixrREFBcUIsc0JBQ2hDLGlCQUF3QztBQUFBLE1BQXRDbkIsRUFBc0MsU0FBdENBLEVBQXNDO0FBQUEsTUFBbENDLFFBQWtDLFNBQWxDQSxRQUFrQztBQUFBLE1BQXhCQyxrQkFBd0IsU0FBeEJBLGtCQUF3Qjs7QUFDdEMsTUFBTWtCLG1CQUFtQm5CLFNBQVNSLFdBQVQsQ0FDdEJZLE1BRHNCLENBQ2Y7QUFBQSxXQUFNLENBQUNILG1CQUFtQlMsR0FBR2QsSUFBdEIsQ0FBUDtBQUFBLEdBRGUsRUFFdEJlLEdBRnNCLENBRWxCO0FBQUEsV0FBTUQsR0FBR04sTUFBVDtBQUFBLEdBRmtCLENBQXpCOztBQUlBO0FBQ0E7QUFDQSxNQUFNUSxpQkFBaUJaLFNBQVNhLEtBQVQsQ0FBZUMsTUFBZixDQUFzQlYsTUFBdEIsQ0FBNkI7QUFBQSxXQUNsRGUsaUJBQWlCQyxLQUFqQixDQUF1QjtBQUFBLGFBQVMsQ0FBQ0osTUFBTXJCLEtBQU4sQ0FBVjtBQUFBLEtBQXZCLENBRGtEO0FBQUEsR0FBN0IsQ0FBdkI7O0FBSUEsU0FBTyxvQkFBVXNCLE1BQVYsNEJBQ0ZqQixTQUFTYSxLQURQO0FBRUxDLFlBQVFGO0FBRkgsS0FBUDtBQUlELENBaEIrQixFQWlCaENkLFFBakJnQyxDQUEzQiIsImZpbGUiOiJtYXBib3gtZ2wtc3R5bGUtZWRpdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xuaW1wb3J0IG1lbW9pemUgZnJvbSAnbG9kYXNoLm1lbW9pemUnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdExheWVyR3JvdXBWaXNpYmlsaXR5KHtsYXllckdyb3VwcyA9IFtdfSkge1xuICByZXR1cm4gbGF5ZXJHcm91cHMucmVkdWNlKFxuICAgIChhY2N1LCBsYXllcikgPT4gKHtcbiAgICAgIC4uLmFjY3UsXG4gICAgICBbbGF5ZXIuc2x1Z106IGxheWVyLmRlZmF1bHRWaXNpYmlsaXR5XG4gICAgfSksXG4gICAge31cbiAgKTtcbn1cblxuY29uc3QgcmVzb2x2ZXIgPSAoe2lkLCBtYXBTdHlsZSwgdmlzaWJsZUxheWVyR3JvdXBzID0ge319KSA9PlxuICBgJHtpZH06JHtPYmplY3Qua2V5cyh2aXNpYmxlTGF5ZXJHcm91cHMpXG4gICAgLmZpbHRlcihkID0+IHZpc2libGVMYXllckdyb3Vwc1tkXSlcbiAgICAuc29ydCgpXG4gICAgLmpvaW4oJy0nKX1gO1xuXG4vKipcbiAqIEVkaXQgcHJlc2V0IG1hcCBzdHlsZSB0byBrZWVwIG9ubHkgdmlzaWJsZSBsYXllcnNcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gbWFwU3R5bGUgLSBwcmVzZXQgbWFwIHN0eWxlXG4gKiBAcGFyYW0ge29iamVjdH0gdmlzaWJsZUxheWVyR3JvdXBzIC0gdmlzaWJsZSBsYXllcnMgb2YgdG9wIG1hcFxuICogQHJldHVybnMge0ltbXV0YWJsZS5NYXB9IHRvcCBtYXAgc3R5bGVcbiAqL1xuZXhwb3J0IGNvbnN0IGVkaXRUb3BNYXBTdHlsZSA9IG1lbW9pemUoKHtpZCwgbWFwU3R5bGUsIHZpc2libGVMYXllckdyb3Vwc30pID0+IHtcbiAgY29uc3QgdmlzaWJsZUZpbHRlcnMgPSBtYXBTdHlsZS5sYXllckdyb3Vwc1xuICAgIC5maWx0ZXIobGcgPT4gdmlzaWJsZUxheWVyR3JvdXBzW2xnLnNsdWddKVxuICAgIC5tYXAobGcgPT4gbGcuZmlsdGVyKTtcblxuICAvLyBpZiB0b3AgbWFwXG4gIC8vIGtlZXAgb25seSB2aXNpYmxlIGxheWVyc1xuICBjb25zdCBmaWx0ZXJlZExheWVycyA9IG1hcFN0eWxlLnN0eWxlLmxheWVycy5maWx0ZXIobGF5ZXIgPT5cbiAgICB2aXNpYmxlRmlsdGVycy5zb21lKG1hdGNoID0+IG1hdGNoKGxheWVyKSlcbiAgKTtcblxuICByZXR1cm4gSW1tdXRhYmxlLmZyb21KUyh7XG4gICAgLi4ubWFwU3R5bGUuc3R5bGUsXG4gICAgbGF5ZXJzOiBmaWx0ZXJlZExheWVyc1xuICB9KTtcbn0sIHJlc29sdmVyKTtcblxuLyoqXG4gKiBFZGl0IHByZXNldCBtYXAgc3R5bGUgdG8gZmlsdGVyIG91dCBpbnZpc2libGUgbGF5ZXJzXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG1hcFN0eWxlIC0gcHJlc2V0IG1hcCBzdHlsZVxuICogQHBhcmFtIHtvYmplY3R9IHZpc2libGVMYXllckdyb3VwcyAtIHZpc2libGUgbGF5ZXJzIG9mIGJvdHRvbSBtYXBcbiAqIEByZXR1cm5zIHtJbW11dGFibGUuTWFwfSBib3R0b20gbWFwIHN0eWxlXG4gKi9cbmV4cG9ydCBjb25zdCBlZGl0Qm90dG9tTWFwU3R5bGUgPSBtZW1vaXplKFxuICAoe2lkLCBtYXBTdHlsZSwgdmlzaWJsZUxheWVyR3JvdXBzfSkgPT4ge1xuICAgIGNvbnN0IGludmlzaWJsZUZpbHRlcnMgPSBtYXBTdHlsZS5sYXllckdyb3Vwc1xuICAgICAgLmZpbHRlcihsZyA9PiAhdmlzaWJsZUxheWVyR3JvdXBzW2xnLnNsdWddKVxuICAgICAgLm1hcChsZyA9PiBsZy5maWx0ZXIpO1xuXG4gICAgLy8gaWYgYm90dG9tIG1hcFxuICAgIC8vIGZpbHRlciBvdXQgaW52aXNpYmxlIGxheWVyc1xuICAgIGNvbnN0IGZpbHRlcmVkTGF5ZXJzID0gbWFwU3R5bGUuc3R5bGUubGF5ZXJzLmZpbHRlcihsYXllciA9PlxuICAgICAgaW52aXNpYmxlRmlsdGVycy5ldmVyeShtYXRjaCA9PiAhbWF0Y2gobGF5ZXIpKVxuICAgICk7XG5cbiAgICByZXR1cm4gSW1tdXRhYmxlLmZyb21KUyh7XG4gICAgICAuLi5tYXBTdHlsZS5zdHlsZSxcbiAgICAgIGxheWVyczogZmlsdGVyZWRMYXllcnNcbiAgICB9KTtcbiAgfSxcbiAgcmVzb2x2ZXJcbik7XG4iXX0=