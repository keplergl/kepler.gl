'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  border-radius: 2px;\n  display: flex;\n  flex-direction: row;\n  flex-grow: 1;\n  justify-content: space-between;\n  overflow: hidden;\n'], ['\n  border-radius: 2px;\n  display: flex;\n  flex-direction: row;\n  flex-grow: 1;\n  justify-content: space-between;\n  overflow: hidden;\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  display: flex;\n  flex-grow: 1;\n  border-width: 1px;\n  border-style: solid;\n  border-color: ', ';\n  padding: 4px;\n  border-radius: 4px;\n'], ['\n  display: flex;\n  flex-grow: 1;\n  border-width: 1px;\n  border-style: solid;\n  border-color: ', ';\n  padding: 4px;\n  border-radius: 4px;\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  flex-grow: 1;\n'], ['\n  flex-grow: 1;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  colors: _propTypes2.default.array.isRequired,
  height: _propTypes2.default.number,
  className: _propTypes2.default.string,
  isSelected: _propTypes2.default.bool,
  isReversed: _propTypes2.default.bool
};

var defaultProps = {
  height: 10,
  colors: [],
  className: '',
  isSelected: false,
  isReversed: false
};

var PaletteWrapper = _styledComponents2.default.div(_templateObject);

var PaletteContainer = _styledComponents2.default.div(_templateObject2, function (props) {
  return props.isSelected ? '#FFFFFF' : 'transparent';
});

var ColorBlock = _styledComponents2.default.div(_templateObject3);

var ColorPalette = function ColorPalette(_ref) {
  var colors = _ref.colors,
      height = _ref.height,
      className = _ref.className,
      isSelected = _ref.isSelected,
      isReversed = _ref.isReversed;
  return _react2.default.createElement(
    PaletteContainer,
    {
      className: 'color-range-palette ' + className,
      isSelected: isSelected
    },
    _react2.default.createElement(
      PaletteWrapper,
      { className: 'color-range-palette__inner',
        style: { height: height, transform: 'scale(' + (isReversed ? -1 : 1) + ', 1)' } },
      colors.map(function (color) {
        return _react2.default.createElement(ColorBlock, {
          className: 'color-range-palette__block',
          key: color,
          style: { backgroundColor: color }
        });
      })
    )
  );
};

ColorPalette.propTypes = propTypes;
ColorPalette.defaultProps = defaultProps;

exports.default = ColorPalette;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvY29sb3ItcGFsZXR0ZS5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJjb2xvcnMiLCJhcnJheSIsImlzUmVxdWlyZWQiLCJoZWlnaHQiLCJudW1iZXIiLCJjbGFzc05hbWUiLCJzdHJpbmciLCJpc1NlbGVjdGVkIiwiYm9vbCIsImlzUmV2ZXJzZWQiLCJkZWZhdWx0UHJvcHMiLCJQYWxldHRlV3JhcHBlciIsImRpdiIsIlBhbGV0dGVDb250YWluZXIiLCJwcm9wcyIsIkNvbG9yQmxvY2siLCJDb2xvclBhbGV0dGUiLCJ0cmFuc2Zvcm0iLCJtYXAiLCJjb2xvciIsImJhY2tncm91bmRDb2xvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEJDLFVBQVEsb0JBQVVDLEtBQVYsQ0FBZ0JDLFVBRFI7QUFFaEJDLFVBQVEsb0JBQVVDLE1BRkY7QUFHaEJDLGFBQVcsb0JBQVVDLE1BSEw7QUFJaEJDLGNBQVksb0JBQVVDLElBSk47QUFLaEJDLGNBQVksb0JBQVVEO0FBTE4sQ0FBbEI7O0FBUUEsSUFBTUUsZUFBZTtBQUNuQlAsVUFBUSxFQURXO0FBRW5CSCxVQUFRLEVBRlc7QUFHbkJLLGFBQVcsRUFIUTtBQUluQkUsY0FBWSxLQUpPO0FBS25CRSxjQUFZO0FBTE8sQ0FBckI7O0FBUUEsSUFBTUUsaUJBQWlCLDJCQUFPQyxHQUF4QixpQkFBTjs7QUFTQSxJQUFNQyxtQkFBbUIsMkJBQU9ELEdBQTFCLG1CQUtZO0FBQUEsU0FBU0UsTUFBTVAsVUFBTixHQUFtQixTQUFuQixHQUErQixhQUF4QztBQUFBLENBTFosQ0FBTjs7QUFVQSxJQUFNUSxhQUFhLDJCQUFPSCxHQUFwQixrQkFBTjs7QUFJQSxJQUFNSSxlQUFlLFNBQWZBLFlBQWU7QUFBQSxNQUFFaEIsTUFBRixRQUFFQSxNQUFGO0FBQUEsTUFBVUcsTUFBVixRQUFVQSxNQUFWO0FBQUEsTUFBa0JFLFNBQWxCLFFBQWtCQSxTQUFsQjtBQUFBLE1BQTZCRSxVQUE3QixRQUE2QkEsVUFBN0I7QUFBQSxNQUF5Q0UsVUFBekMsUUFBeUNBLFVBQXpDO0FBQUEsU0FDbkI7QUFBQyxvQkFBRDtBQUFBO0FBQ0UsMENBQWtDSixTQURwQztBQUVFLGtCQUFZRTtBQUZkO0FBSUU7QUFBQyxvQkFBRDtBQUFBLFFBQWdCLFdBQVUsNEJBQTFCO0FBQ2dCLGVBQU8sRUFBQ0osY0FBRCxFQUFTYyx1QkFBb0JSLGFBQWEsQ0FBQyxDQUFkLEdBQWtCLENBQXRDLFVBQVQsRUFEdkI7QUFFR1QsYUFBT2tCLEdBQVAsQ0FBVztBQUFBLGVBQ1YsOEJBQUMsVUFBRDtBQUNFLHFCQUFVLDRCQURaO0FBRUUsZUFBS0MsS0FGUDtBQUdFLGlCQUFPLEVBQUNDLGlCQUFpQkQsS0FBbEI7QUFIVCxVQURVO0FBQUEsT0FBWDtBQUZIO0FBSkYsR0FEbUI7QUFBQSxDQUFyQjs7QUFrQkFILGFBQWFqQixTQUFiLEdBQXlCQSxTQUF6QjtBQUNBaUIsYUFBYU4sWUFBYixHQUE0QkEsWUFBNUI7O2tCQUVlTSxZIiwiZmlsZSI6ImNvbG9yLXBhbGV0dGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIGNvbG9yczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIGhlaWdodDogUHJvcFR5cGVzLm51bWJlcixcbiAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBpc1NlbGVjdGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgaXNSZXZlcnNlZDogUHJvcFR5cGVzLmJvb2xcbn07XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgaGVpZ2h0OiAxMCxcbiAgY29sb3JzOiBbXSxcbiAgY2xhc3NOYW1lOiAnJyxcbiAgaXNTZWxlY3RlZDogZmFsc2UsXG4gIGlzUmV2ZXJzZWQ6IGZhbHNlXG59O1xuXG5jb25zdCBQYWxldHRlV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgZmxleC1ncm93OiAxO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIG92ZXJmbG93OiBoaWRkZW47XG5gO1xuXG5jb25zdCBQYWxldHRlQ29udGFpbmVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1ncm93OiAxO1xuICBib3JkZXItd2lkdGg6IDFweDtcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcbiAgYm9yZGVyLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLmlzU2VsZWN0ZWQgPyAnI0ZGRkZGRicgOiAndHJhbnNwYXJlbnQnfTtcbiAgcGFkZGluZzogNHB4O1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG5gO1xuXG5jb25zdCBDb2xvckJsb2NrID0gc3R5bGVkLmRpdmBcbiAgZmxleC1ncm93OiAxO1xuYDtcblxuY29uc3QgQ29sb3JQYWxldHRlID0gKHtjb2xvcnMsIGhlaWdodCwgY2xhc3NOYW1lLCBpc1NlbGVjdGVkLCBpc1JldmVyc2VkfSkgPT4gKFxuICA8UGFsZXR0ZUNvbnRhaW5lclxuICAgIGNsYXNzTmFtZT17YGNvbG9yLXJhbmdlLXBhbGV0dGUgJHtjbGFzc05hbWV9YH1cbiAgICBpc1NlbGVjdGVkPXtpc1NlbGVjdGVkfVxuICA+XG4gICAgPFBhbGV0dGVXcmFwcGVyIGNsYXNzTmFtZT1cImNvbG9yLXJhbmdlLXBhbGV0dGVfX2lubmVyXCJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3toZWlnaHQsIHRyYW5zZm9ybTogYHNjYWxlKCR7aXNSZXZlcnNlZCA/IC0xIDogMX0sIDEpYH19PlxuICAgICAge2NvbG9ycy5tYXAoY29sb3IgPT4gKFxuICAgICAgICA8Q29sb3JCbG9ja1xuICAgICAgICAgIGNsYXNzTmFtZT1cImNvbG9yLXJhbmdlLXBhbGV0dGVfX2Jsb2NrXCJcbiAgICAgICAgICBrZXk9e2NvbG9yfVxuICAgICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZENvbG9yOiBjb2xvcn19XG4gICAgICAgIC8+XG4gICAgICApKX1cbiAgICA8L1BhbGV0dGVXcmFwcGVyPlxuICA8L1BhbGV0dGVDb250YWluZXI+XG4pO1xuXG5Db2xvclBhbGV0dGUucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuQ29sb3JQYWxldHRlLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcblxuZXhwb3J0IGRlZmF1bHQgQ29sb3JQYWxldHRlO1xuIl19