'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

exports.geojsonFromPoints = geojsonFromPoints;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param points
 * @param columns {
 * lat: {fieldIdx},
 * lng: {fieldIdx},
 * alt: {fieldIdx}
 * }
 * @param properties [{label: {fieldIdx}]
 * @returns {{type: string, properties: {}, features: {type: string, properties: {}, geometry: {type: string, coordinates: *[]}}[]}}
 */
function geojsonFromPoints() {
  var points = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var columns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var properties = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  return {
    type: 'FeatureCollection',
    features: points.map(function (point) {
      return {
        type: 'Feature',
        properties: properties.reduce(function (final, property) {
          return (0, _extends4.default)({}, final, (0, _defineProperty3.default)({}, property.name, point[property.tableFieldIndex]));
        }, {}),
        geometry: {
          type: 'Point',
          coordinates: [columns.lng ? point[columns.lng.fieldIdx] : null, // lng
          columns.lat ? point[columns.lat.fieldIdx] : null, // lat
          columns.altitude ? point[columns.altitude.fieldIdx] : 0 // altitude
          ]
        }
      };
    })
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYXBib3gtbGF5ZXJzL21hcGJveC11dGlscy5qcyJdLCJuYW1lcyI6WyJnZW9qc29uRnJvbVBvaW50cyIsInBvaW50cyIsImNvbHVtbnMiLCJwcm9wZXJ0aWVzIiwidHlwZSIsImZlYXR1cmVzIiwibWFwIiwicmVkdWNlIiwiZmluYWwiLCJwcm9wZXJ0eSIsIm5hbWUiLCJwb2ludCIsInRhYmxlRmllbGRJbmRleCIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCJsbmciLCJmaWVsZElkeCIsImxhdCIsImFsdGl0dWRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztRQVdnQkEsaUIsR0FBQUEsaUI7Ozs7QUFYaEI7Ozs7Ozs7Ozs7O0FBV08sU0FBU0EsaUJBQVQsR0FBdUU7QUFBQSxNQUE1Q0MsTUFBNEMsdUVBQW5DLEVBQW1DO0FBQUEsTUFBL0JDLE9BQStCLHVFQUFyQixFQUFxQjtBQUFBLE1BQWpCQyxVQUFpQix1RUFBSixFQUFJOztBQUM1RSxTQUFPO0FBQ0xDLFVBQU0sbUJBREQ7QUFFTEMsY0FBVUosT0FBT0ssR0FBUCxDQUFXO0FBQUEsYUFBVTtBQUM3QkYsY0FBTSxTQUR1QjtBQUU3QkQsb0JBQVlBLFdBQVdJLE1BQVgsQ0FBa0IsVUFBQ0MsS0FBRCxFQUFRQyxRQUFSO0FBQUEsNENBQ3pCRCxLQUR5QixvQ0FFM0JDLFNBQVNDLElBRmtCLEVBRVhDLE1BQU1GLFNBQVNHLGVBQWYsQ0FGVztBQUFBLFNBQWxCLEVBR1IsRUFIUSxDQUZpQjtBQU03QkMsa0JBQVU7QUFDUlQsZ0JBQU0sT0FERTtBQUVSVSx1QkFBYSxDQUNYWixRQUFRYSxHQUFSLEdBQWNKLE1BQU1ULFFBQVFhLEdBQVIsQ0FBWUMsUUFBbEIsQ0FBZCxHQUE0QyxJQURqQyxFQUN1QztBQUNsRGQsa0JBQVFlLEdBQVIsR0FBY04sTUFBTVQsUUFBUWUsR0FBUixDQUFZRCxRQUFsQixDQUFkLEdBQTRDLElBRmpDLEVBRXVDO0FBQ2xEZCxrQkFBUWdCLFFBQVIsR0FBbUJQLE1BQU1ULFFBQVFnQixRQUFSLENBQWlCRixRQUF2QixDQUFuQixHQUFzRCxDQUgzQyxDQUc2QztBQUg3QztBQUZMO0FBTm1CLE9BQVY7QUFBQSxLQUFYO0FBRkwsR0FBUDtBQWtCRCIsImZpbGUiOiJtYXBib3gtdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqXG4gKiBAcGFyYW0gcG9pbnRzXG4gKiBAcGFyYW0gY29sdW1ucyB7XG4gKiBsYXQ6IHtmaWVsZElkeH0sXG4gKiBsbmc6IHtmaWVsZElkeH0sXG4gKiBhbHQ6IHtmaWVsZElkeH1cbiAqIH1cbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIFt7bGFiZWw6IHtmaWVsZElkeH1dXG4gKiBAcmV0dXJucyB7e3R5cGU6IHN0cmluZywgcHJvcGVydGllczoge30sIGZlYXR1cmVzOiB7dHlwZTogc3RyaW5nLCBwcm9wZXJ0aWVzOiB7fSwgZ2VvbWV0cnk6IHt0eXBlOiBzdHJpbmcsIGNvb3JkaW5hdGVzOiAqW119fVtdfX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlb2pzb25Gcm9tUG9pbnRzKHBvaW50cyA9IFtdLCBjb2x1bW5zID0ge30sIHByb3BlcnRpZXMgPSBbXSkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgZmVhdHVyZXM6IHBvaW50cy5tYXAocG9pbnQgPT4gKHtcbiAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXMucmVkdWNlKChmaW5hbCwgcHJvcGVydHkpID0+ICh7XG4gICAgICAgIC4uLmZpbmFsLFxuICAgICAgICBbcHJvcGVydHkubmFtZV06IHBvaW50W3Byb3BlcnR5LnRhYmxlRmllbGRJbmRleF1cbiAgICAgIH0pLCB7fSksXG4gICAgICBnZW9tZXRyeToge1xuICAgICAgICB0eXBlOiAnUG9pbnQnLFxuICAgICAgICBjb29yZGluYXRlczogW1xuICAgICAgICAgIGNvbHVtbnMubG5nID8gcG9pbnRbY29sdW1ucy5sbmcuZmllbGRJZHhdIDogbnVsbCwgLy8gbG5nXG4gICAgICAgICAgY29sdW1ucy5sYXQgPyBwb2ludFtjb2x1bW5zLmxhdC5maWVsZElkeF0gOiBudWxsLCAvLyBsYXRcbiAgICAgICAgICBjb2x1bW5zLmFsdGl0dWRlID8gcG9pbnRbY29sdW1ucy5hbHRpdHVkZS5maWVsZElkeF0gOiAwIC8vIGFsdGl0dWRlXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9KSlcbiAgfTtcbn0iXX0=