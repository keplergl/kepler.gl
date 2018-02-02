'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  padding: 12px;\n\n  :hover {\n    cursor: pointer;\n  }\n'], ['\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  padding: 12px;\n\n  :hover {\n    cursor: pointer;\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  flex-grow: 1;\n  flex-direction: column;\n  justify-content: space-between;\n'], ['\n  display: flex;\n  flex-grow: 1;\n  flex-direction: column;\n  justify-content: space-between;\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  flex-grow: 1;\n  height: ', ';\n  border-width: 1px;\n  border-style: solid;\n'], ['\n  flex-grow: 1;\n  height: ', ';\n  border-width: 1px;\n  border-style: solid;\n']);

// TODO: remove uber colors, replace with generic color schemes


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Array = require('d3-array');

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _colorUtils = require('../../../utils/color-utils');

var _uberColors = require('../../../constants/uber-colors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  onSelectColor: _propTypes2.default.func.isRequired,
  // hex value
  selectedColor: _propTypes2.default.string.isRequired
};

var PALETTE_HEIGHT = '8px';
var ROWS = 16;

var StyledColorPalette = _styledComponents2.default.div(_templateObject);

var StyledColorColumn = _styledComponents2.default.div(_templateObject2);

var StyledColorBlock = _styledComponents2.default.div(_templateObject3, PALETTE_HEIGHT);

var SingleColorPalette = function SingleColorPalette(_ref) {
  var selectedColor = _ref.selectedColor,
      onSelectColor = _ref.onSelectColor;
  return _react2.default.createElement(
    StyledColorPalette,
    { className: 'single-color-palette' },
    _uberColors.Themes.map(function (theme, col) {
      return _react2.default.createElement(
        StyledColorColumn,
        { key: theme },
        (0, _d3Array.range)(1, ROWS + 1, 1).map(function (key, i) {
          return _react2.default.createElement(StyledColorBlock, {
            style: {
              backgroundColor: _uberColors.ColorsByTheme[theme][String(key)],
              borderColor: selectedColor === _uberColors.ColorsByTheme[theme][String(key)].toUpperCase() ? 'white' : _uberColors.ColorsByTheme[theme][String(key)]
            },
            key: theme + '_' + key,
            selected: selectedColor === _uberColors.ColorsByTheme[theme][String(key)].toUpperCase(),
            onClick: function onClick(e) {
              return onSelectColor((0, _colorUtils.hexToRgb)(_uberColors.ColorsByTheme[theme][String(key)]), e);
            }
          });
        })
      );
    })
  );
};

SingleColorPalette.propTypes = propTypes;

exports.default = SingleColorPalette;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvc2luZ2xlLWNvbG9yLXBhbGV0dGUuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwib25TZWxlY3RDb2xvciIsImZ1bmMiLCJpc1JlcXVpcmVkIiwic2VsZWN0ZWRDb2xvciIsInN0cmluZyIsIlBBTEVUVEVfSEVJR0hUIiwiUk9XUyIsIlN0eWxlZENvbG9yUGFsZXR0ZSIsImRpdiIsIlN0eWxlZENvbG9yQ29sdW1uIiwiU3R5bGVkQ29sb3JCbG9jayIsIlNpbmdsZUNvbG9yUGFsZXR0ZSIsIm1hcCIsInRoZW1lIiwiY29sIiwia2V5IiwiaSIsImJhY2tncm91bmRDb2xvciIsIlN0cmluZyIsImJvcmRlckNvbG9yIiwidG9VcHBlckNhc2UiLCJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQU1BOzs7QUFOQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFHQTs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEJDLGlCQUFlLG9CQUFVQyxJQUFWLENBQWVDLFVBRGQ7QUFFaEI7QUFDQUMsaUJBQWUsb0JBQVVDLE1BQVYsQ0FBaUJGO0FBSGhCLENBQWxCOztBQU1BLElBQU1HLGlCQUFpQixLQUF2QjtBQUNBLElBQU1DLE9BQU8sRUFBYjs7QUFFQSxJQUFNQyxxQkFBcUIsMkJBQU9DLEdBQTVCLGlCQUFOOztBQVdBLElBQU1DLG9CQUFvQiwyQkFBT0QsR0FBM0Isa0JBQU47O0FBT0EsSUFBTUUsbUJBQW1CLDJCQUFPRixHQUExQixtQkFFTUgsY0FGTixDQUFOOztBQU9BLElBQU1NLHFCQUFxQixTQUFyQkEsa0JBQXFCO0FBQUEsTUFBRVIsYUFBRixRQUFFQSxhQUFGO0FBQUEsTUFBaUJILGFBQWpCLFFBQWlCQSxhQUFqQjtBQUFBLFNBQ3pCO0FBQUMsc0JBQUQ7QUFBQSxNQUFvQixXQUFVLHNCQUE5QjtBQUNHLHVCQUFPWSxHQUFQLENBQVcsVUFBQ0MsS0FBRCxFQUFRQyxHQUFSO0FBQUEsYUFDVjtBQUFDLHlCQUFEO0FBQUEsVUFBbUIsS0FBS0QsS0FBeEI7QUFDRyw0QkFBTSxDQUFOLEVBQVNQLE9BQU8sQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0JNLEdBQXRCLENBQTBCLFVBQUNHLEdBQUQsRUFBTUMsQ0FBTjtBQUFBLGlCQUN6Qiw4QkFBQyxnQkFBRDtBQUNFLG1CQUFPO0FBQ0xDLCtCQUFpQiwwQkFBY0osS0FBZCxFQUFxQkssT0FBT0gsR0FBUCxDQUFyQixDQURaO0FBRUxJLDJCQUNFaEIsa0JBQ0EsMEJBQWNVLEtBQWQsRUFBcUJLLE9BQU9ILEdBQVAsQ0FBckIsRUFBa0NLLFdBQWxDLEVBREEsR0FFSSxPQUZKLEdBR0ksMEJBQWNQLEtBQWQsRUFBcUJLLE9BQU9ILEdBQVAsQ0FBckI7QUFORCxhQURUO0FBU0UsaUJBQVFGLEtBQVIsU0FBaUJFLEdBVG5CO0FBVUUsc0JBQ0VaLGtCQUFrQiwwQkFBY1UsS0FBZCxFQUFxQkssT0FBT0gsR0FBUCxDQUFyQixFQUFrQ0ssV0FBbEMsRUFYdEI7QUFhRSxxQkFBUztBQUFBLHFCQUNQcEIsY0FBYywwQkFBUywwQkFBY2EsS0FBZCxFQUFxQkssT0FBT0gsR0FBUCxDQUFyQixDQUFULENBQWQsRUFBMkRNLENBQTNELENBRE87QUFBQTtBQWJYLFlBRHlCO0FBQUEsU0FBMUI7QUFESCxPQURVO0FBQUEsS0FBWDtBQURILEdBRHlCO0FBQUEsQ0FBM0I7O0FBNEJBVixtQkFBbUJaLFNBQW5CLEdBQStCQSxTQUEvQjs7a0JBRWVZLGtCIiwiZmlsZSI6InNpbmdsZS1jb2xvci1wYWxldHRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtyYW5nZX0gZnJvbSAnZDMtYXJyYXknO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge2hleFRvUmdifSBmcm9tICd1dGlscy9jb2xvci11dGlscyc7XG5cbi8vIFRPRE86IHJlbW92ZSB1YmVyIGNvbG9ycywgcmVwbGFjZSB3aXRoIGdlbmVyaWMgY29sb3Igc2NoZW1lc1xuaW1wb3J0IHtDb2xvcnNCeVRoZW1lLCBUaGVtZXN9IGZyb20gJ2NvbnN0YW50cy91YmVyLWNvbG9ycyc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgb25TZWxlY3RDb2xvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgLy8gaGV4IHZhbHVlXG4gIHNlbGVjdGVkQ29sb3I6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxufTtcblxuY29uc3QgUEFMRVRURV9IRUlHSFQgPSAnOHB4JztcbmNvbnN0IFJPV1MgPSAxNjtcblxuY29uc3QgU3R5bGVkQ29sb3JQYWxldHRlID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBwYWRkaW5nOiAxMnB4O1xuXG4gIDpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG5gO1xuXG5jb25zdCBTdHlsZWRDb2xvckNvbHVtbiA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZ3JvdzogMTtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuYDtcblxuY29uc3QgU3R5bGVkQ29sb3JCbG9jayA9IHN0eWxlZC5kaXZgXG4gIGZsZXgtZ3JvdzogMTtcbiAgaGVpZ2h0OiAke1BBTEVUVEVfSEVJR0hUfTtcbiAgYm9yZGVyLXdpZHRoOiAxcHg7XG4gIGJvcmRlci1zdHlsZTogc29saWQ7XG5gO1xuXG5jb25zdCBTaW5nbGVDb2xvclBhbGV0dGUgPSAoe3NlbGVjdGVkQ29sb3IsIG9uU2VsZWN0Q29sb3J9KSA9PiAoXG4gIDxTdHlsZWRDb2xvclBhbGV0dGUgY2xhc3NOYW1lPVwic2luZ2xlLWNvbG9yLXBhbGV0dGVcIj5cbiAgICB7VGhlbWVzLm1hcCgodGhlbWUsIGNvbCkgPT4gKFxuICAgICAgPFN0eWxlZENvbG9yQ29sdW1uIGtleT17dGhlbWV9PlxuICAgICAgICB7cmFuZ2UoMSwgUk9XUyArIDEsIDEpLm1hcCgoa2V5LCBpKSA9PiAoXG4gICAgICAgICAgPFN0eWxlZENvbG9yQmxvY2tcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogQ29sb3JzQnlUaGVtZVt0aGVtZV1bU3RyaW5nKGtleSldLFxuICAgICAgICAgICAgICBib3JkZXJDb2xvcjpcbiAgICAgICAgICAgICAgICBzZWxlY3RlZENvbG9yID09PVxuICAgICAgICAgICAgICAgIENvbG9yc0J5VGhlbWVbdGhlbWVdW1N0cmluZyhrZXkpXS50b1VwcGVyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICA/ICd3aGl0ZSdcbiAgICAgICAgICAgICAgICAgIDogQ29sb3JzQnlUaGVtZVt0aGVtZV1bU3RyaW5nKGtleSldXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAga2V5PXtgJHt0aGVtZX1fJHtrZXl9YH1cbiAgICAgICAgICAgIHNlbGVjdGVkPXtcbiAgICAgICAgICAgICAgc2VsZWN0ZWRDb2xvciA9PT0gQ29sb3JzQnlUaGVtZVt0aGVtZV1bU3RyaW5nKGtleSldLnRvVXBwZXJDYXNlKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9uQ2xpY2s9e2UgPT5cbiAgICAgICAgICAgICAgb25TZWxlY3RDb2xvcihoZXhUb1JnYihDb2xvcnNCeVRoZW1lW3RoZW1lXVtTdHJpbmcoa2V5KV0pLCBlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIC8+XG4gICAgICAgICkpfVxuICAgICAgPC9TdHlsZWRDb2xvckNvbHVtbj5cbiAgICApKX1cbiAgPC9TdHlsZWRDb2xvclBhbGV0dGU+XG4pO1xuXG5TaW5nbGVDb2xvclBhbGV0dGUucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuXG5leHBvcnQgZGVmYXVsdCBTaW5nbGVDb2xvclBhbGV0dGU7XG4iXX0=