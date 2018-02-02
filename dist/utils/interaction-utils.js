'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultInteraction = getDefaultInteraction;
exports.findFieldsToShow = findFieldsToShow;

var _defaultSettings = require('../constants/default-settings');

var _icons = require('../components/common/icons');

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

function findFieldsToShow(_ref) {
  var _ref3;

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

  return _ref3 = {}, _ref3[id] = fieldsToShow.length ? fieldsToShow : autoFindTooltipFields(fields), _ref3;
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
    return [].concat(prev, pair);
  }, []);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9pbnRlcmFjdGlvbi11dGlscy5qcyJdLCJuYW1lcyI6WyJnZXREZWZhdWx0SW50ZXJhY3Rpb24iLCJmaW5kRmllbGRzVG9TaG93IiwidG9vbHRpcCIsImlkIiwiZW5hYmxlZCIsImljb25Db21wb25lbnQiLCJjb25maWciLCJmaWVsZHNUb1Nob3ciLCJicnVzaCIsInNpemUiLCJmaWVsZHMiLCJyZWR1Y2UiLCJwcmV2IiwiY3VyciIsImZpbmQiLCJuYW1lIiwicHVzaCIsImxlbmd0aCIsImF1dG9GaW5kVG9vbHRpcEZpZWxkcyIsInB0RmllbGRzIiwiX21lcmdlRmllbGRQYWlycyIsImZpbHRlciIsInR5cGUiLCJyZXBsYWNlIiwidHJpbSIsInNwbGl0IiwiZXZlcnkiLCJpbmNsdWRlcyIsInNlZyIsImdlb2pzb24iLCJzbGljZSIsIm1hcCIsImQiLCJwYWlycyIsInBhaXIiXSwibWFwcGluZ3MiOiI7Ozs7O1FBUWdCQSxxQixHQUFBQSxxQjtRQXNCQUMsZ0IsR0FBQUEsZ0I7O0FBOUJoQjs7QUFNQTs7QUFFTyxTQUFTRCxxQkFBVCxHQUFpQztBQUN0QyxTQUFPO0FBQ0xFLGFBQVM7QUFDUEMsVUFBSSxTQURHO0FBRVBDLGVBQVMsSUFGRjtBQUdQQyxvQ0FITztBQUlQQyxjQUFRO0FBQ05DLHNCQUFjO0FBRFI7QUFKRCxLQURKO0FBU0xDLFdBQU87QUFDTEwsVUFBSSxPQURDO0FBRUxDLGVBQVMsS0FGSjtBQUdMQyxzQ0FISztBQUlMQyxjQUFRO0FBQ047QUFDQUcsY0FBTTtBQUZBO0FBSkg7QUFURixHQUFQO0FBbUJEOztBQUVNLFNBQVNSLGdCQUFULE9BQXdDO0FBQUE7O0FBQUEsTUFBYlMsTUFBYSxRQUFiQSxNQUFhO0FBQUEsTUFBTFAsRUFBSyxRQUFMQSxFQUFLOztBQUM3QztBQUNBLE1BQU1JLGVBQWUsd0NBQXVCSSxNQUF2QixDQUE4QixVQUFDQyxJQUFELEVBQU9DLElBQVAsRUFBZ0I7QUFDakUsUUFBSUgsT0FBT0ksSUFBUCxDQUFZO0FBQUEsVUFBRUMsSUFBRixTQUFFQSxJQUFGO0FBQUEsYUFBWUYsU0FBU0UsSUFBckI7QUFBQSxLQUFaLENBQUosRUFBNEM7QUFDMUNILFdBQUtJLElBQUwsQ0FBVUgsSUFBVjtBQUNEO0FBQ0QsV0FBT0QsSUFBUDtBQUNELEdBTG9CLEVBS2xCLEVBTGtCLENBQXJCOztBQU9BLDJCQUNHVCxFQURILElBQ1FJLGFBQWFVLE1BQWIsR0FBc0JWLFlBQXRCLEdBQXFDVyxzQkFBc0JSLE1BQXRCLENBRDdDO0FBR0Q7O0FBRUQsU0FBU1EscUJBQVQsQ0FBK0JSLE1BQS9CLEVBQXVDO0FBQ3JDLE1BQU1TLFdBQVdDLG9EQUFqQjtBQUNBO0FBQ0EsTUFBTWIsZUFBZUcsT0FBT1csTUFBUCxDQUNuQjtBQUFBLFFBQUVOLElBQUYsU0FBRUEsSUFBRjtBQUFBLFFBQVFPLElBQVIsU0FBUUEsSUFBUjtBQUFBLFdBQ0VQLEtBQ0dRLE9BREgsQ0FDVyxTQURYLEVBQ3NCLEdBRHRCLEVBRUdDLElBRkgsR0FHR0MsS0FISCxDQUdTLEdBSFQsRUFJR0MsS0FKSCxDQUlTO0FBQUEsYUFBTyxDQUFDUCxTQUFTUSxRQUFULENBQWtCQyxHQUFsQixDQUFSO0FBQUEsS0FKVCxLQUtBTixTQUFTLGlDQUFnQk8sT0FMekIsSUFNQVAsU0FBUyxRQVBYO0FBQUEsR0FEbUIsQ0FBckI7O0FBV0EsU0FBT2YsYUFBYXVCLEtBQWIsQ0FBbUIsQ0FBbkIseUNBQTRDQyxHQUE1QyxDQUFnRDtBQUFBLFdBQUtDLEVBQUVqQixJQUFQO0FBQUEsR0FBaEQsQ0FBUDtBQUNEOztBQUVELFNBQVNLLGdCQUFULENBQTBCYSxLQUExQixFQUFpQztBQUMvQixTQUFPQSxNQUFNdEIsTUFBTixDQUFhLFVBQUNDLElBQUQsRUFBT3NCLElBQVA7QUFBQSxxQkFBb0J0QixJQUFwQixFQUE2QnNCLElBQTdCO0FBQUEsR0FBYixFQUFpRCxFQUFqRCxDQUFQO0FBQ0QiLCJmaWxlIjoiaW50ZXJhY3Rpb24tdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBERUZBVUxUX1RPT0xUSVBfRklFTERTLFxuICBNQVhfREVGQVVMVF9UT09MVElQUyxcbiAgQUxMX0ZJRUxEX1RZUEVTLFxuICBUUklQX1BPSU5UX0ZJRUxEU1xufSBmcm9tICcuLi9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQge01lc3NhZ2VzLCBDcm9zc2hhaXJzfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9pbmRleCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0SW50ZXJhY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgdG9vbHRpcDoge1xuICAgICAgaWQ6ICd0b29sdGlwJyxcbiAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICBpY29uQ29tcG9uZW50OiBNZXNzYWdlcyxcbiAgICAgIGNvbmZpZzoge1xuICAgICAgICBmaWVsZHNUb1Nob3c6IHt9XG4gICAgICB9XG4gICAgfSxcbiAgICBicnVzaDoge1xuICAgICAgaWQ6ICdicnVzaCcsXG4gICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgIGljb25Db21wb25lbnQ6IENyb3NzaGFpcnMsXG4gICAgICBjb25maWc6IHtcbiAgICAgICAgLy8gc2l6ZSBpcyBpbiBrbVxuICAgICAgICBzaXplOiAwLjVcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kRmllbGRzVG9TaG93KHtmaWVsZHMsIGlkfSkge1xuICAvLyBmaXJzdCBmaW5kIGRlZmF1bHQgdG9vbHRpcCBmaWVsZHMgZm9yIHRyaXBzXG4gIGNvbnN0IGZpZWxkc1RvU2hvdyA9IERFRkFVTFRfVE9PTFRJUF9GSUVMRFMucmVkdWNlKChwcmV2LCBjdXJyKSA9PiB7XG4gICAgaWYgKGZpZWxkcy5maW5kKCh7bmFtZX0pID0+IGN1cnIgPT09IG5hbWUpKSB7XG4gICAgICBwcmV2LnB1c2goY3Vycik7XG4gICAgfVxuICAgIHJldHVybiBwcmV2O1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIHtcbiAgICBbaWRdOiBmaWVsZHNUb1Nob3cubGVuZ3RoID8gZmllbGRzVG9TaG93IDogYXV0b0ZpbmRUb29sdGlwRmllbGRzKGZpZWxkcylcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXV0b0ZpbmRUb29sdGlwRmllbGRzKGZpZWxkcykge1xuICBjb25zdCBwdEZpZWxkcyA9IF9tZXJnZUZpZWxkUGFpcnMoVFJJUF9QT0lOVF9GSUVMRFMpO1xuICAvLyBmaWx0ZXIgb3V0IHRoZSBkZWZhdWx0IGZpZWxkcyB0aGF0IGNvbnRhaW5zIGxhdCBhbmQgbG5nIGFuZCBhbnkgZ2VvbWV0cnlcbiAgY29uc3QgZmllbGRzVG9TaG93ID0gZmllbGRzLmZpbHRlcihcbiAgICAoe25hbWUsIHR5cGV9KSA9PlxuICAgICAgbmFtZVxuICAgICAgICAucmVwbGFjZSgvW18sLl0rL2csICcgJylcbiAgICAgICAgLnRyaW0oKVxuICAgICAgICAuc3BsaXQoJyAnKVxuICAgICAgICAuZXZlcnkoc2VnID0+ICFwdEZpZWxkcy5pbmNsdWRlcyhzZWcpKSAmJlxuICAgICAgdHlwZSAhPT0gQUxMX0ZJRUxEX1RZUEVTLmdlb2pzb24gJiZcbiAgICAgIHR5cGUgIT09ICdvYmplY3QnXG4gICk7XG5cbiAgcmV0dXJuIGZpZWxkc1RvU2hvdy5zbGljZSgwLCBNQVhfREVGQVVMVF9UT09MVElQUykubWFwKGQgPT4gZC5uYW1lKTtcbn1cblxuZnVuY3Rpb24gX21lcmdlRmllbGRQYWlycyhwYWlycykge1xuICByZXR1cm4gcGFpcnMucmVkdWNlKChwcmV2LCBwYWlyKSA9PiBbLi4ucHJldiwgLi4ucGFpcl0sIFtdKTtcbn1cbiJdfQ==