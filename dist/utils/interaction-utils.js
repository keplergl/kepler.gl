'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultInteraction = getDefaultInteraction;
exports.findFieldsToShow = findFieldsToShow;

var _defaultSettings = require('../constants/default-settings');

function getDefaultInteraction() {
  return {
    tooltip: {
      id: 'tooltip',
      enabled: true,
      icon: 'messages',
      config: {
        fieldsToShow: {}
      }
    },
    brush: {
      id: 'brush',
      enabled: false,
      icon: 'crosshairs',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9pbnRlcmFjdGlvbi11dGlscy5qcyJdLCJuYW1lcyI6WyJnZXREZWZhdWx0SW50ZXJhY3Rpb24iLCJmaW5kRmllbGRzVG9TaG93IiwidG9vbHRpcCIsImlkIiwiZW5hYmxlZCIsImljb24iLCJjb25maWciLCJmaWVsZHNUb1Nob3ciLCJicnVzaCIsInNpemUiLCJmaWVsZHMiLCJyZWR1Y2UiLCJwcmV2IiwiY3VyciIsImZpbmQiLCJuYW1lIiwicHVzaCIsImxlbmd0aCIsImF1dG9GaW5kVG9vbHRpcEZpZWxkcyIsInB0RmllbGRzIiwiX21lcmdlRmllbGRQYWlycyIsImZpbHRlciIsInR5cGUiLCJyZXBsYWNlIiwidHJpbSIsInNwbGl0IiwiZXZlcnkiLCJpbmNsdWRlcyIsInNlZyIsImdlb2pzb24iLCJzbGljZSIsIm1hcCIsImQiLCJwYWlycyIsInBhaXIiXSwibWFwcGluZ3MiOiI7Ozs7O1FBT2dCQSxxQixHQUFBQSxxQjtRQXNCQUMsZ0IsR0FBQUEsZ0I7O0FBN0JoQjs7QUFPTyxTQUFTRCxxQkFBVCxHQUFpQztBQUN0QyxTQUFPO0FBQ0xFLGFBQVM7QUFDUEMsVUFBSSxTQURHO0FBRVBDLGVBQVMsSUFGRjtBQUdQQyxZQUFNLFVBSEM7QUFJUEMsY0FBUTtBQUNOQyxzQkFBYztBQURSO0FBSkQsS0FESjtBQVNMQyxXQUFPO0FBQ0xMLFVBQUksT0FEQztBQUVMQyxlQUFTLEtBRko7QUFHTEMsWUFBTSxZQUhEO0FBSUxDLGNBQVE7QUFDTjtBQUNBRyxjQUFNO0FBRkE7QUFKSDtBQVRGLEdBQVA7QUFtQkQ7O0FBRU0sU0FBU1IsZ0JBQVQsT0FBd0M7QUFBQTs7QUFBQSxNQUFiUyxNQUFhLFFBQWJBLE1BQWE7QUFBQSxNQUFMUCxFQUFLLFFBQUxBLEVBQUs7O0FBQzdDO0FBQ0EsTUFBTUksZUFBZSx3Q0FBdUJJLE1BQXZCLENBQThCLFVBQUNDLElBQUQsRUFBT0MsSUFBUCxFQUFnQjtBQUNqRSxRQUFJSCxPQUFPSSxJQUFQLENBQVk7QUFBQSxVQUFFQyxJQUFGLFNBQUVBLElBQUY7QUFBQSxhQUFZRixTQUFTRSxJQUFyQjtBQUFBLEtBQVosQ0FBSixFQUE0QztBQUMxQ0gsV0FBS0ksSUFBTCxDQUFVSCxJQUFWO0FBQ0Q7QUFDRCxXQUFPRCxJQUFQO0FBQ0QsR0FMb0IsRUFLbEIsRUFMa0IsQ0FBckI7O0FBT0EsMkJBQVNULEVBQVQsSUFBY0ksYUFBYVUsTUFBYixHQUFzQlYsWUFBdEIsR0FBcUNXLHNCQUFzQlIsTUFBdEIsQ0FBbkQ7QUFDRDs7QUFFRCxTQUFTUSxxQkFBVCxDQUErQlIsTUFBL0IsRUFBdUM7O0FBRXJDLE1BQU1TLFdBQVdDLG9EQUFqQjtBQUNBO0FBQ0EsTUFBTWIsZUFBZUcsT0FDbEJXLE1BRGtCLENBQ1g7QUFBQSxRQUFFTixJQUFGLFNBQUVBLElBQUY7QUFBQSxRQUFRTyxJQUFSLFNBQVFBLElBQVI7QUFBQSxXQUFrQlAsS0FBS1EsT0FBTCxDQUFhLFNBQWIsRUFBd0IsR0FBeEIsRUFBNkJDLElBQTdCLEdBQW9DQyxLQUFwQyxDQUEwQyxHQUExQyxFQUN2QkMsS0FEdUIsQ0FDakI7QUFBQSxhQUFPLENBQUNQLFNBQVNRLFFBQVQsQ0FBa0JDLEdBQWxCLENBQVI7QUFBQSxLQURpQixLQUNrQk4sU0FBUyxpQ0FBZ0JPLE9BRDNDLElBQ3NEUCxTQUFTLFFBRGpGO0FBQUEsR0FEVyxDQUFyQjs7QUFJQSxTQUFPZixhQUFhdUIsS0FBYixDQUFtQixDQUFuQix5Q0FBNENDLEdBQTVDLENBQWdEO0FBQUEsV0FBS0MsRUFBRWpCLElBQVA7QUFBQSxHQUFoRCxDQUFQO0FBQ0Q7O0FBRUQsU0FBU0ssZ0JBQVQsQ0FBMEJhLEtBQTFCLEVBQWlDO0FBQy9CLFNBQU9BLE1BQU10QixNQUFOLENBQWEsVUFBQ0MsSUFBRCxFQUFPc0IsSUFBUDtBQUFBLHFCQUFxQnRCLElBQXJCLEVBQThCc0IsSUFBOUI7QUFBQSxHQUFiLEVBQW1ELEVBQW5ELENBQVA7QUFDRCIsImZpbGUiOiJpbnRlcmFjdGlvbi11dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERFRkFVTFRfVE9PTFRJUF9GSUVMRFMsXG4gIE1BWF9ERUZBVUxUX1RPT0xUSVBTLFxuICBBTExfRklFTERfVFlQRVMsXG4gIFRSSVBfUE9JTlRfRklFTERTXG59IGZyb20gJy4uL2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldERlZmF1bHRJbnRlcmFjdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICB0b29sdGlwOiB7XG4gICAgICBpZDogJ3Rvb2x0aXAnLFxuICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIGljb246ICdtZXNzYWdlcycsXG4gICAgICBjb25maWc6IHtcbiAgICAgICAgZmllbGRzVG9TaG93OiB7fVxuICAgICAgfVxuICAgIH0sXG4gICAgYnJ1c2g6IHtcbiAgICAgIGlkOiAnYnJ1c2gnLFxuICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICBpY29uOiAnY3Jvc3NoYWlycycsXG4gICAgICBjb25maWc6IHtcbiAgICAgICAgLy8gc2l6ZSBpcyBpbiBrbVxuICAgICAgICBzaXplOiAwLjVcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kRmllbGRzVG9TaG93KHtmaWVsZHMsIGlkfSkge1xuICAvLyBmaXJzdCBmaW5kIGRlZmF1bHQgdG9vbHRpcCBmaWVsZHMgZm9yIHRyaXBzXG4gIGNvbnN0IGZpZWxkc1RvU2hvdyA9IERFRkFVTFRfVE9PTFRJUF9GSUVMRFMucmVkdWNlKChwcmV2LCBjdXJyKSA9PiB7XG4gICAgaWYgKGZpZWxkcy5maW5kKCh7bmFtZX0pID0+IGN1cnIgPT09IG5hbWUpKSB7XG4gICAgICBwcmV2LnB1c2goY3Vycik7XG4gICAgfVxuICAgIHJldHVybiBwcmV2O1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIHtbaWRdOiBmaWVsZHNUb1Nob3cubGVuZ3RoID8gZmllbGRzVG9TaG93IDogYXV0b0ZpbmRUb29sdGlwRmllbGRzKGZpZWxkcyl9O1xufVxuXG5mdW5jdGlvbiBhdXRvRmluZFRvb2x0aXBGaWVsZHMoZmllbGRzKSB7XG5cbiAgY29uc3QgcHRGaWVsZHMgPSBfbWVyZ2VGaWVsZFBhaXJzKFRSSVBfUE9JTlRfRklFTERTKTtcbiAgLy8gZmlsdGVyIG91dCB0aGUgZGVmYXVsdCBmaWVsZHMgdGhhdCBjb250YWlucyBsYXQgYW5kIGxuZyBhbmQgYW55IGdlb21ldHJ5XG4gIGNvbnN0IGZpZWxkc1RvU2hvdyA9IGZpZWxkc1xuICAgIC5maWx0ZXIoKHtuYW1lLCB0eXBlfSkgPT4gbmFtZS5yZXBsYWNlKC9bXywuXSsvZywgJyAnKS50cmltKCkuc3BsaXQoJyAnKVxuICAgICAgLmV2ZXJ5KHNlZyA9PiAhcHRGaWVsZHMuaW5jbHVkZXMoc2VnKSkgJiYgdHlwZSAhPT0gQUxMX0ZJRUxEX1RZUEVTLmdlb2pzb24gJiYgdHlwZSAhPT0gJ29iamVjdCcpO1xuXG4gIHJldHVybiBmaWVsZHNUb1Nob3cuc2xpY2UoMCwgTUFYX0RFRkFVTFRfVE9PTFRJUFMpLm1hcChkID0+IGQubmFtZSk7XG59XG5cbmZ1bmN0aW9uIF9tZXJnZUZpZWxkUGFpcnMocGFpcnMpIHtcbiAgcmV0dXJuIHBhaXJzLnJlZHVjZSgocHJldiwgcGFpcikgPT4gKFsuLi5wcmV2LCAuLi5wYWlyXSksIFtdKTtcbn1cbiJdfQ==