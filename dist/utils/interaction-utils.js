'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BRUSH_CONFIG = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.getDefaultInteraction = getDefaultInteraction;
exports.findFieldsToShow = findFieldsToShow;

var _defaultSettings = require('../constants/default-settings');

var _icons = require('../components/common/icons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getDefaultInteraction() {
  return {
    tooltip: {
      id: 'tooltip',
      enabled: true,
      iconComponent: _icons.Messages,
      config: {
        fieldsToShow: {}
      }
    },
    brush: {
      id: 'brush',
      enabled: false,
      iconComponent: _icons.Crosshairs,
      config: {
        // size is in km
        size: 0.5
      }
    }
  };
}

var BRUSH_CONFIG = exports.BRUSH_CONFIG = {
  range: [0, 50]
};

function findFieldsToShow(_ref) {
  var fields = _ref.fields,
      id = _ref.id;

  // first find default tooltip fields for trips
  var fieldsToShow = _defaultSettings.DEFAULT_TOOLTIP_FIELDS.reduce(function (prev, curr) {
    if (fields.find(function (_ref2) {
      var name = _ref2.name;
      return curr === name;
    })) {
      prev.push(curr);
    }
    return prev;
  }, []);

  return (0, _defineProperty3.default)({}, id, fieldsToShow.length ? fieldsToShow : autoFindTooltipFields(fields));
}

function autoFindTooltipFields(fields) {
  var ptFields = _mergeFieldPairs(_defaultSettings.TRIP_POINT_FIELDS);
  // filter out the default fields that contains lat and lng and any geometry
  var fieldsToShow = fields.filter(function (_ref4) {
    var name = _ref4.name,
        type = _ref4.type;
    return name.replace(/[_,.]+/g, ' ').trim().split(' ').every(function (seg) {
      return !ptFields.includes(seg);
    }) && type !== _defaultSettings.ALL_FIELD_TYPES.geojson && type !== 'object';
  });

  return fieldsToShow.slice(0, _defaultSettings.MAX_DEFAULT_TOOLTIPS).map(function (d) {
    return d.name;
  });
}

function _mergeFieldPairs(pairs) {
  return pairs.reduce(function (prev, pair) {
    return [].concat((0, _toConsumableArray3.default)(prev), (0, _toConsumableArray3.default)(pair));
  }, []);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9pbnRlcmFjdGlvbi11dGlscy5qcyJdLCJuYW1lcyI6WyJnZXREZWZhdWx0SW50ZXJhY3Rpb24iLCJmaW5kRmllbGRzVG9TaG93IiwidG9vbHRpcCIsImlkIiwiZW5hYmxlZCIsImljb25Db21wb25lbnQiLCJjb25maWciLCJmaWVsZHNUb1Nob3ciLCJicnVzaCIsInNpemUiLCJCUlVTSF9DT05GSUciLCJyYW5nZSIsImZpZWxkcyIsInJlZHVjZSIsInByZXYiLCJjdXJyIiwiZmluZCIsIm5hbWUiLCJwdXNoIiwibGVuZ3RoIiwiYXV0b0ZpbmRUb29sdGlwRmllbGRzIiwicHRGaWVsZHMiLCJfbWVyZ2VGaWVsZFBhaXJzIiwiZmlsdGVyIiwidHlwZSIsInJlcGxhY2UiLCJ0cmltIiwic3BsaXQiLCJldmVyeSIsImluY2x1ZGVzIiwic2VnIiwiZ2VvanNvbiIsInNsaWNlIiwibWFwIiwiZCIsInBhaXJzIiwicGFpciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O1FBUWdCQSxxQixHQUFBQSxxQjtRQTBCQUMsZ0IsR0FBQUEsZ0I7O0FBbENoQjs7QUFNQTs7OztBQUVPLFNBQVNELHFCQUFULEdBQWlDO0FBQ3RDLFNBQU87QUFDTEUsYUFBUztBQUNQQyxVQUFJLFNBREc7QUFFUEMsZUFBUyxJQUZGO0FBR1BDLG9DQUhPO0FBSVBDLGNBQVE7QUFDTkMsc0JBQWM7QUFEUjtBQUpELEtBREo7QUFTTEMsV0FBTztBQUNMTCxVQUFJLE9BREM7QUFFTEMsZUFBUyxLQUZKO0FBR0xDLHNDQUhLO0FBSUxDLGNBQVE7QUFDTjtBQUNBRyxjQUFNO0FBRkE7QUFKSDtBQVRGLEdBQVA7QUFtQkQ7O0FBRU0sSUFBTUMsc0NBQWU7QUFDMUJDLFNBQU8sQ0FBQyxDQUFELEVBQUksRUFBSjtBQURtQixDQUFyQjs7QUFJQSxTQUFTVixnQkFBVCxPQUF3QztBQUFBLE1BQWJXLE1BQWEsUUFBYkEsTUFBYTtBQUFBLE1BQUxULEVBQUssUUFBTEEsRUFBSzs7QUFDN0M7QUFDQSxNQUFNSSxlQUFlLHdDQUF1Qk0sTUFBdkIsQ0FBOEIsVUFBQ0MsSUFBRCxFQUFPQyxJQUFQLEVBQWdCO0FBQ2pFLFFBQUlILE9BQU9JLElBQVAsQ0FBWTtBQUFBLFVBQUVDLElBQUYsU0FBRUEsSUFBRjtBQUFBLGFBQVlGLFNBQVNFLElBQXJCO0FBQUEsS0FBWixDQUFKLEVBQTRDO0FBQzFDSCxXQUFLSSxJQUFMLENBQVVILElBQVY7QUFDRDtBQUNELFdBQU9ELElBQVA7QUFDRCxHQUxvQixFQUtsQixFQUxrQixDQUFyQjs7QUFPQSwyQ0FDR1gsRUFESCxFQUNRSSxhQUFhWSxNQUFiLEdBQXNCWixZQUF0QixHQUFxQ2Esc0JBQXNCUixNQUF0QixDQUQ3QztBQUdEOztBQUVELFNBQVNRLHFCQUFULENBQStCUixNQUEvQixFQUF1QztBQUNyQyxNQUFNUyxXQUFXQyxvREFBakI7QUFDQTtBQUNBLE1BQU1mLGVBQWVLLE9BQU9XLE1BQVAsQ0FDbkI7QUFBQSxRQUFFTixJQUFGLFNBQUVBLElBQUY7QUFBQSxRQUFRTyxJQUFSLFNBQVFBLElBQVI7QUFBQSxXQUNFUCxLQUNHUSxPQURILENBQ1csU0FEWCxFQUNzQixHQUR0QixFQUVHQyxJQUZILEdBR0dDLEtBSEgsQ0FHUyxHQUhULEVBSUdDLEtBSkgsQ0FJUztBQUFBLGFBQU8sQ0FBQ1AsU0FBU1EsUUFBVCxDQUFrQkMsR0FBbEIsQ0FBUjtBQUFBLEtBSlQsS0FLQU4sU0FBUyxpQ0FBZ0JPLE9BTHpCLElBTUFQLFNBQVMsUUFQWDtBQUFBLEdBRG1CLENBQXJCOztBQVdBLFNBQU9qQixhQUFheUIsS0FBYixDQUFtQixDQUFuQix5Q0FBNENDLEdBQTVDLENBQWdEO0FBQUEsV0FBS0MsRUFBRWpCLElBQVA7QUFBQSxHQUFoRCxDQUFQO0FBQ0Q7O0FBRUQsU0FBU0ssZ0JBQVQsQ0FBMEJhLEtBQTFCLEVBQWlDO0FBQy9CLFNBQU9BLE1BQU10QixNQUFOLENBQWEsVUFBQ0MsSUFBRCxFQUFPc0IsSUFBUDtBQUFBLHNEQUFvQnRCLElBQXBCLG9DQUE2QnNCLElBQTdCO0FBQUEsR0FBYixFQUFpRCxFQUFqRCxDQUFQO0FBQ0QiLCJmaWxlIjoiaW50ZXJhY3Rpb24tdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBERUZBVUxUX1RPT0xUSVBfRklFTERTLFxuICBNQVhfREVGQVVMVF9UT09MVElQUyxcbiAgQUxMX0ZJRUxEX1RZUEVTLFxuICBUUklQX1BPSU5UX0ZJRUxEU1xufSBmcm9tICcuLi9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQge01lc3NhZ2VzLCBDcm9zc2hhaXJzfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9pbmRleCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0SW50ZXJhY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgdG9vbHRpcDoge1xuICAgICAgaWQ6ICd0b29sdGlwJyxcbiAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICBpY29uQ29tcG9uZW50OiBNZXNzYWdlcyxcbiAgICAgIGNvbmZpZzoge1xuICAgICAgICBmaWVsZHNUb1Nob3c6IHt9XG4gICAgICB9XG4gICAgfSxcbiAgICBicnVzaDoge1xuICAgICAgaWQ6ICdicnVzaCcsXG4gICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgIGljb25Db21wb25lbnQ6IENyb3NzaGFpcnMsXG4gICAgICBjb25maWc6IHtcbiAgICAgICAgLy8gc2l6ZSBpcyBpbiBrbVxuICAgICAgICBzaXplOiAwLjVcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBCUlVTSF9DT05GSUcgPSB7XG4gIHJhbmdlOiBbMCwgNTBdXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZmluZEZpZWxkc1RvU2hvdyh7ZmllbGRzLCBpZH0pIHtcbiAgLy8gZmlyc3QgZmluZCBkZWZhdWx0IHRvb2x0aXAgZmllbGRzIGZvciB0cmlwc1xuICBjb25zdCBmaWVsZHNUb1Nob3cgPSBERUZBVUxUX1RPT0xUSVBfRklFTERTLnJlZHVjZSgocHJldiwgY3VycikgPT4ge1xuICAgIGlmIChmaWVsZHMuZmluZCgoe25hbWV9KSA9PiBjdXJyID09PSBuYW1lKSkge1xuICAgICAgcHJldi5wdXNoKGN1cnIpO1xuICAgIH1cbiAgICByZXR1cm4gcHJldjtcbiAgfSwgW10pO1xuXG4gIHJldHVybiB7XG4gICAgW2lkXTogZmllbGRzVG9TaG93Lmxlbmd0aCA/IGZpZWxkc1RvU2hvdyA6IGF1dG9GaW5kVG9vbHRpcEZpZWxkcyhmaWVsZHMpXG4gIH07XG59XG5cbmZ1bmN0aW9uIGF1dG9GaW5kVG9vbHRpcEZpZWxkcyhmaWVsZHMpIHtcbiAgY29uc3QgcHRGaWVsZHMgPSBfbWVyZ2VGaWVsZFBhaXJzKFRSSVBfUE9JTlRfRklFTERTKTtcbiAgLy8gZmlsdGVyIG91dCB0aGUgZGVmYXVsdCBmaWVsZHMgdGhhdCBjb250YWlucyBsYXQgYW5kIGxuZyBhbmQgYW55IGdlb21ldHJ5XG4gIGNvbnN0IGZpZWxkc1RvU2hvdyA9IGZpZWxkcy5maWx0ZXIoXG4gICAgKHtuYW1lLCB0eXBlfSkgPT5cbiAgICAgIG5hbWVcbiAgICAgICAgLnJlcGxhY2UoL1tfLC5dKy9nLCAnICcpXG4gICAgICAgIC50cmltKClcbiAgICAgICAgLnNwbGl0KCcgJylcbiAgICAgICAgLmV2ZXJ5KHNlZyA9PiAhcHRGaWVsZHMuaW5jbHVkZXMoc2VnKSkgJiZcbiAgICAgIHR5cGUgIT09IEFMTF9GSUVMRF9UWVBFUy5nZW9qc29uICYmXG4gICAgICB0eXBlICE9PSAnb2JqZWN0J1xuICApO1xuXG4gIHJldHVybiBmaWVsZHNUb1Nob3cuc2xpY2UoMCwgTUFYX0RFRkFVTFRfVE9PTFRJUFMpLm1hcChkID0+IGQubmFtZSk7XG59XG5cbmZ1bmN0aW9uIF9tZXJnZUZpZWxkUGFpcnMocGFpcnMpIHtcbiAgcmV0dXJuIHBhaXJzLnJlZHVjZSgocHJldiwgcGFpcikgPT4gWy4uLnByZXYsIC4uLnBhaXJdLCBbXSk7XG59XG4iXX0=