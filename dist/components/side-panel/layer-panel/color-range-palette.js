'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  width: _propTypes2.default.number.isRequired,
  height: _propTypes2.default.number.isRequired,
  colors: _propTypes2.default.array.isRequired,
  className: _propTypes2.default.string,
  style: _propTypes2.default.object
};

var ColorRangePalette = function ColorRangePalette(_ref) {
  var colors = _ref.colors,
      width = _ref.width,
      height = _ref.height,
      className = _ref.className,
      style = _ref.style;
  return _react2.default.createElement(
    'svg',
    { style: (0, _extends3.default)({}, style, { width: width, height: height }), className: className },
    colors.map(function (color, i) {
      return _react2.default.createElement('rect', {
        key: i,
        width: width / colors.length,
        height: height,
        x: width / colors.length * i,
        style: { fill: color, stroke: 'none' }
      });
    }).concat(_react2.default.createElement('rect', {
      x: '0.5',
      y: '0.5',
      key: 'selected',
      width: width - 1.5,
      height: height - 1.5,
      style: {
        stroke: 'none',
        fill: 'none',
        strokeWidth: 1.5
      } }))
  );
};

ColorRangePalette.propTypes = propTypes;

exports.default = ColorRangePalette;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvY29sb3ItcmFuZ2UtcGFsZXR0ZS5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJ3aWR0aCIsIm51bWJlciIsImlzUmVxdWlyZWQiLCJoZWlnaHQiLCJjb2xvcnMiLCJhcnJheSIsImNsYXNzTmFtZSIsInN0cmluZyIsInN0eWxlIiwib2JqZWN0IiwiQ29sb3JSYW5nZVBhbGV0dGUiLCJtYXAiLCJjb2xvciIsImkiLCJsZW5ndGgiLCJmaWxsIiwic3Ryb2tlIiwiY29uY2F0Iiwic3Ryb2tlV2lkdGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxZQUFZO0FBQ2hCQyxTQUFPLG9CQUFVQyxNQUFWLENBQWlCQyxVQURSO0FBRWhCQyxVQUFRLG9CQUFVRixNQUFWLENBQWlCQyxVQUZUO0FBR2hCRSxVQUFRLG9CQUFVQyxLQUFWLENBQWdCSCxVQUhSO0FBSWhCSSxhQUFXLG9CQUFVQyxNQUpMO0FBS2hCQyxTQUFPLG9CQUFVQztBQUxELENBQWxCOztBQVFBLElBQU1DLG9CQUFvQixTQUFwQkEsaUJBQW9CO0FBQUEsTUFBRU4sTUFBRixRQUFFQSxNQUFGO0FBQUEsTUFBVUosS0FBVixRQUFVQSxLQUFWO0FBQUEsTUFBaUJHLE1BQWpCLFFBQWlCQSxNQUFqQjtBQUFBLE1BQXlCRyxTQUF6QixRQUF5QkEsU0FBekI7QUFBQSxNQUFvQ0UsS0FBcEMsUUFBb0NBLEtBQXBDO0FBQUEsU0FDeEI7QUFBQTtBQUFBLE1BQUssa0NBQVdBLEtBQVgsSUFBa0JSLFlBQWxCLEVBQXlCRyxjQUF6QixHQUFMLEVBQXVDLFdBQVdHLFNBQWxEO0FBQ0dGLFdBQU9PLEdBQVAsQ0FBVyxVQUFDQyxLQUFELEVBQVFDLENBQVI7QUFBQSxhQUNWO0FBQ0UsYUFBS0EsQ0FEUDtBQUVFLGVBQU9iLFFBQVFJLE9BQU9VLE1BRnhCO0FBR0UsZ0JBQVFYLE1BSFY7QUFJRSxXQUFHSCxRQUFRSSxPQUFPVSxNQUFmLEdBQXdCRCxDQUo3QjtBQUtFLGVBQU8sRUFBQ0UsTUFBTUgsS0FBUCxFQUFjSSxRQUFRLE1BQXRCO0FBTFQsUUFEVTtBQUFBLEtBQVgsRUFRRUMsTUFSRixDQVFTO0FBQ1IsU0FBRSxLQURNO0FBRVIsU0FBRSxLQUZNO0FBR1IsV0FBSSxVQUhJO0FBSVIsYUFBT2pCLFFBQVEsR0FKUDtBQUtSLGNBQVFHLFNBQVMsR0FMVDtBQU1SLGFBQU87QUFDTGEsZ0JBQVEsTUFESDtBQUVMRCxjQUFNLE1BRkQ7QUFHTEcscUJBQWE7QUFIUixPQU5DLEdBUlQ7QUFESCxHQUR3QjtBQUFBLENBQTFCOztBQXlCQVIsa0JBQWtCWCxTQUFsQixHQUE4QkEsU0FBOUI7O2tCQUVlVyxpQiIsImZpbGUiOiJjb2xvci1yYW5nZS1wYWxldHRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGNvbG9yczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgc3R5bGU6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmNvbnN0IENvbG9yUmFuZ2VQYWxldHRlID0gKHtjb2xvcnMsIHdpZHRoLCBoZWlnaHQsIGNsYXNzTmFtZSwgc3R5bGV9KSA9PiAoXG4gIDxzdmcgc3R5bGU9e3suLi5zdHlsZSwgd2lkdGgsIGhlaWdodH19IGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cbiAgICB7Y29sb3JzLm1hcCgoY29sb3IsIGkpID0+IChcbiAgICAgIDxyZWN0XG4gICAgICAgIGtleT17aX1cbiAgICAgICAgd2lkdGg9e3dpZHRoIC8gY29sb3JzLmxlbmd0aH1cbiAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgIHg9e3dpZHRoIC8gY29sb3JzLmxlbmd0aCAqIGl9XG4gICAgICAgIHN0eWxlPXt7ZmlsbDogY29sb3IsIHN0cm9rZTogJ25vbmUnfX1cbiAgICAgIC8+XG4gICAgKSkuY29uY2F0KDxyZWN0XG4gICAgICB4PVwiMC41XCJcbiAgICAgIHk9XCIwLjVcIlxuICAgICAga2V5PVwic2VsZWN0ZWRcIlxuICAgICAgd2lkdGg9e3dpZHRoIC0gMS41fVxuICAgICAgaGVpZ2h0PXtoZWlnaHQgLSAxLjV9XG4gICAgICBzdHlsZT17e1xuICAgICAgICBzdHJva2U6ICdub25lJyxcbiAgICAgICAgZmlsbDogJ25vbmUnLFxuICAgICAgICBzdHJva2VXaWR0aDogMS41XG4gICAgICB9fS8+KVxuICAgIH1cbiAgPC9zdmc+XG4pO1xuXG5Db2xvclJhbmdlUGFsZXR0ZS5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5cbmV4cG9ydCBkZWZhdWx0IENvbG9yUmFuZ2VQYWxldHRlO1xuIl19