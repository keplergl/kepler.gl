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
      }
    }))
  );
};

ColorRangePalette.propTypes = propTypes;

exports.default = ColorRangePalette;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvY29sb3ItcmFuZ2UtcGFsZXR0ZS5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJ3aWR0aCIsIm51bWJlciIsImlzUmVxdWlyZWQiLCJoZWlnaHQiLCJjb2xvcnMiLCJhcnJheSIsImNsYXNzTmFtZSIsInN0cmluZyIsInN0eWxlIiwib2JqZWN0IiwiQ29sb3JSYW5nZVBhbGV0dGUiLCJtYXAiLCJjb2xvciIsImkiLCJsZW5ndGgiLCJmaWxsIiwic3Ryb2tlIiwiY29uY2F0Iiwic3Ryb2tlV2lkdGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxZQUFZO0FBQ2hCQyxTQUFPLG9CQUFVQyxNQUFWLENBQWlCQyxVQURSO0FBRWhCQyxVQUFRLG9CQUFVRixNQUFWLENBQWlCQyxVQUZUO0FBR2hCRSxVQUFRLG9CQUFVQyxLQUFWLENBQWdCSCxVQUhSO0FBSWhCSSxhQUFXLG9CQUFVQyxNQUpMO0FBS2hCQyxTQUFPLG9CQUFVQztBQUxELENBQWxCOztBQVFBLElBQU1DLG9CQUFvQixTQUFwQkEsaUJBQW9CO0FBQUEsTUFBRU4sTUFBRixRQUFFQSxNQUFGO0FBQUEsTUFBVUosS0FBVixRQUFVQSxLQUFWO0FBQUEsTUFBaUJHLE1BQWpCLFFBQWlCQSxNQUFqQjtBQUFBLE1BQXlCRyxTQUF6QixRQUF5QkEsU0FBekI7QUFBQSxNQUFvQ0UsS0FBcEMsUUFBb0NBLEtBQXBDO0FBQUEsU0FDeEI7QUFBQTtBQUFBLE1BQUssa0NBQVdBLEtBQVgsSUFBa0JSLFlBQWxCLEVBQXlCRyxjQUF6QixHQUFMLEVBQXVDLFdBQVdHLFNBQWxEO0FBQ0dGLFdBQ0VPLEdBREYsQ0FDTSxVQUFDQyxLQUFELEVBQVFDLENBQVI7QUFBQSxhQUNIO0FBQ0UsYUFBS0EsQ0FEUDtBQUVFLGVBQU9iLFFBQVFJLE9BQU9VLE1BRnhCO0FBR0UsZ0JBQVFYLE1BSFY7QUFJRSxXQUFHSCxRQUFRSSxPQUFPVSxNQUFmLEdBQXdCRCxDQUo3QjtBQUtFLGVBQU8sRUFBQ0UsTUFBTUgsS0FBUCxFQUFjSSxRQUFRLE1BQXRCO0FBTFQsUUFERztBQUFBLEtBRE4sRUFVRUMsTUFWRixDQVdHO0FBQ0UsU0FBRSxLQURKO0FBRUUsU0FBRSxLQUZKO0FBR0UsV0FBSSxVQUhOO0FBSUUsYUFBT2pCLFFBQVEsR0FKakI7QUFLRSxjQUFRRyxTQUFTLEdBTG5CO0FBTUUsYUFBTztBQUNMYSxnQkFBUSxNQURIO0FBRUxELGNBQU0sTUFGRDtBQUdMRyxxQkFBYTtBQUhSO0FBTlQsTUFYSDtBQURILEdBRHdCO0FBQUEsQ0FBMUI7O0FBNkJBUixrQkFBa0JYLFNBQWxCLEdBQThCQSxTQUE5Qjs7a0JBRWVXLGlCIiwiZmlsZSI6ImNvbG9yLXJhbmdlLXBhbGV0dGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgY29sb3JzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuY29uc3QgQ29sb3JSYW5nZVBhbGV0dGUgPSAoe2NvbG9ycywgd2lkdGgsIGhlaWdodCwgY2xhc3NOYW1lLCBzdHlsZX0pID0+IChcbiAgPHN2ZyBzdHlsZT17ey4uLnN0eWxlLCB3aWR0aCwgaGVpZ2h0fX0gY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxuICAgIHtjb2xvcnNcbiAgICAgIC5tYXAoKGNvbG9yLCBpKSA9PiAoXG4gICAgICAgIDxyZWN0XG4gICAgICAgICAga2V5PXtpfVxuICAgICAgICAgIHdpZHRoPXt3aWR0aCAvIGNvbG9ycy5sZW5ndGh9XG4gICAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgICAgeD17d2lkdGggLyBjb2xvcnMubGVuZ3RoICogaX1cbiAgICAgICAgICBzdHlsZT17e2ZpbGw6IGNvbG9yLCBzdHJva2U6ICdub25lJ319XG4gICAgICAgIC8+XG4gICAgICApKVxuICAgICAgLmNvbmNhdChcbiAgICAgICAgPHJlY3RcbiAgICAgICAgICB4PVwiMC41XCJcbiAgICAgICAgICB5PVwiMC41XCJcbiAgICAgICAgICBrZXk9XCJzZWxlY3RlZFwiXG4gICAgICAgICAgd2lkdGg9e3dpZHRoIC0gMS41fVxuICAgICAgICAgIGhlaWdodD17aGVpZ2h0IC0gMS41fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBzdHJva2U6ICdub25lJyxcbiAgICAgICAgICAgIGZpbGw6ICdub25lJyxcbiAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAxLjVcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgPC9zdmc+XG4pO1xuXG5Db2xvclJhbmdlUGFsZXR0ZS5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5cbmV4cG9ydCBkZWZhdWx0IENvbG9yUmFuZ2VQYWxldHRlO1xuIl19