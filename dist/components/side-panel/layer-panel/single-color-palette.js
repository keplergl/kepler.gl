'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  padding: 12px;\n\n  :hover {\n    cursor: pointer;\n  }\n'], ['\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  padding: 12px;\n\n  :hover {\n    cursor: pointer;\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  display: flex;\n  flex-grow: 1;\n  flex-direction: column;\n  justify-content: space-between;\n'], ['\n  display: flex;\n  flex-grow: 1;\n  flex-direction: column;\n  justify-content: space-between;\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  flex-grow: 1;\n  height: ', ';\n  border-width: 1px;\n  border-style: solid;\n'], ['\n  flex-grow: 1;\n  height: ', ';\n  border-width: 1px;\n  border-style: solid;\n']);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvc2luZ2xlLWNvbG9yLXBhbGV0dGUuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwib25TZWxlY3RDb2xvciIsImZ1bmMiLCJpc1JlcXVpcmVkIiwic2VsZWN0ZWRDb2xvciIsInN0cmluZyIsIlBBTEVUVEVfSEVJR0hUIiwiUk9XUyIsIlN0eWxlZENvbG9yUGFsZXR0ZSIsImRpdiIsIlN0eWxlZENvbG9yQ29sdW1uIiwiU3R5bGVkQ29sb3JCbG9jayIsIlNpbmdsZUNvbG9yUGFsZXR0ZSIsIm1hcCIsInRoZW1lIiwiY29sIiwia2V5IiwiaSIsImJhY2tncm91bmRDb2xvciIsIlN0cmluZyIsImJvcmRlckNvbG9yIiwidG9VcHBlckNhc2UiLCJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQU1BOzs7QUFOQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFHQTs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEJDLGlCQUFlLG9CQUFVQyxJQUFWLENBQWVDLFVBRGQ7QUFFaEI7QUFDQUMsaUJBQWUsb0JBQVVDLE1BQVYsQ0FBaUJGO0FBSGhCLENBQWxCOztBQU1BLElBQU1HLGlCQUFpQixLQUF2QjtBQUNBLElBQU1DLE9BQU8sRUFBYjs7QUFFQSxJQUFNQyxxQkFBcUIsMkJBQU9DLEdBQTVCLGlCQUFOOztBQVdBLElBQU1DLG9CQUFvQiwyQkFBT0QsR0FBM0Isa0JBQU47O0FBT0EsSUFBTUUsbUJBQW1CLDJCQUFPRixHQUExQixtQkFFTUgsY0FGTixDQUFOOztBQU9BLElBQU1NLHFCQUFxQixTQUFyQkEsa0JBQXFCO0FBQUEsTUFBRVIsYUFBRixRQUFFQSxhQUFGO0FBQUEsTUFBaUJILGFBQWpCLFFBQWlCQSxhQUFqQjtBQUFBLFNBQ3pCO0FBQUMsc0JBQUQ7QUFBQSxNQUFvQixXQUFVLHNCQUE5QjtBQUNHLHVCQUFPWSxHQUFQLENBQVcsVUFBQ0MsS0FBRCxFQUFRQyxHQUFSO0FBQUEsYUFDVjtBQUFDLHlCQUFEO0FBQUEsVUFBbUIsS0FBS0QsS0FBeEI7QUFDRyw0QkFBTSxDQUFOLEVBQVNQLE9BQU8sQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0JNLEdBQXRCLENBQTBCLFVBQUNHLEdBQUQsRUFBTUMsQ0FBTjtBQUFBLGlCQUN6Qiw4QkFBQyxnQkFBRDtBQUNFLG1CQUFPO0FBQ0xDLCtCQUFpQiwwQkFBY0osS0FBZCxFQUFxQkssT0FBT0gsR0FBUCxDQUFyQixDQURaO0FBRUxJLDJCQUNFaEIsa0JBQ0EsMEJBQWNVLEtBQWQsRUFBcUJLLE9BQU9ILEdBQVAsQ0FBckIsRUFBa0NLLFdBQWxDLEVBREEsR0FFSSxPQUZKLEdBR0ksMEJBQWNQLEtBQWQsRUFBcUJLLE9BQU9ILEdBQVAsQ0FBckI7QUFORCxhQURUO0FBU0UsaUJBQVFGLEtBQVIsU0FBaUJFLEdBVG5CO0FBVUUsc0JBQ0VaLGtCQUFrQiwwQkFBY1UsS0FBZCxFQUFxQkssT0FBT0gsR0FBUCxDQUFyQixFQUFrQ0ssV0FBbEMsRUFYdEI7QUFhRSxxQkFBUztBQUFBLHFCQUNQcEIsY0FBYywwQkFBUywwQkFBY2EsS0FBZCxFQUFxQkssT0FBT0gsR0FBUCxDQUFyQixDQUFULENBQWQsRUFBMkRNLENBQTNELENBRE87QUFBQTtBQWJYLFlBRHlCO0FBQUEsU0FBMUI7QUFESCxPQURVO0FBQUEsS0FBWDtBQURILEdBRHlCO0FBQUEsQ0FBM0I7O0FBNEJBVixtQkFBbUJaLFNBQW5CLEdBQStCQSxTQUEvQjs7a0JBRWVZLGtCIiwiZmlsZSI6InNpbmdsZS1jb2xvci1wYWxldHRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge3JhbmdlfSBmcm9tICdkMy1hcnJheSc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7aGV4VG9SZ2J9IGZyb20gJ3V0aWxzL2NvbG9yLXV0aWxzJztcblxuLy8gVE9ETzogcmVtb3ZlIHViZXIgY29sb3JzLCByZXBsYWNlIHdpdGggZ2VuZXJpYyBjb2xvciBzY2hlbWVzXG5pbXBvcnQge0NvbG9yc0J5VGhlbWUsIFRoZW1lc30gZnJvbSAnY29uc3RhbnRzL3ViZXItY29sb3JzJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBvblNlbGVjdENvbG9yOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAvLyBoZXggdmFsdWVcbiAgc2VsZWN0ZWRDb2xvcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBQQUxFVFRFX0hFSUdIVCA9ICc4cHgnO1xuY29uc3QgUk9XUyA9IDE2O1xuXG5jb25zdCBTdHlsZWRDb2xvclBhbGV0dGUgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIHBhZGRpbmc6IDEycHg7XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZENvbG9yQ29sdW1uID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1ncm93OiAxO1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG5gO1xuXG5jb25zdCBTdHlsZWRDb2xvckJsb2NrID0gc3R5bGVkLmRpdmBcbiAgZmxleC1ncm93OiAxO1xuICBoZWlnaHQ6ICR7UEFMRVRURV9IRUlHSFR9O1xuICBib3JkZXItd2lkdGg6IDFweDtcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcbmA7XG5cbmNvbnN0IFNpbmdsZUNvbG9yUGFsZXR0ZSA9ICh7c2VsZWN0ZWRDb2xvciwgb25TZWxlY3RDb2xvcn0pID0+IChcbiAgPFN0eWxlZENvbG9yUGFsZXR0ZSBjbGFzc05hbWU9XCJzaW5nbGUtY29sb3ItcGFsZXR0ZVwiPlxuICAgIHtUaGVtZXMubWFwKCh0aGVtZSwgY29sKSA9PiAoXG4gICAgICA8U3R5bGVkQ29sb3JDb2x1bW4ga2V5PXt0aGVtZX0+XG4gICAgICAgIHtyYW5nZSgxLCBST1dTICsgMSwgMSkubWFwKChrZXksIGkpID0+IChcbiAgICAgICAgICA8U3R5bGVkQ29sb3JCbG9ja1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcnNCeVRoZW1lW3RoZW1lXVtTdHJpbmcoa2V5KV0sXG4gICAgICAgICAgICAgIGJvcmRlckNvbG9yOlxuICAgICAgICAgICAgICAgIHNlbGVjdGVkQ29sb3IgPT09XG4gICAgICAgICAgICAgICAgQ29sb3JzQnlUaGVtZVt0aGVtZV1bU3RyaW5nKGtleSldLnRvVXBwZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgID8gJ3doaXRlJ1xuICAgICAgICAgICAgICAgICAgOiBDb2xvcnNCeVRoZW1lW3RoZW1lXVtTdHJpbmcoa2V5KV1cbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBrZXk9e2Ake3RoZW1lfV8ke2tleX1gfVxuICAgICAgICAgICAgc2VsZWN0ZWQ9e1xuICAgICAgICAgICAgICBzZWxlY3RlZENvbG9yID09PSBDb2xvcnNCeVRoZW1lW3RoZW1lXVtTdHJpbmcoa2V5KV0udG9VcHBlckNhc2UoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb25DbGljaz17ZSA9PlxuICAgICAgICAgICAgICBvblNlbGVjdENvbG9yKGhleFRvUmdiKENvbG9yc0J5VGhlbWVbdGhlbWVdW1N0cmluZyhrZXkpXSksIGUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSl9XG4gICAgICA8L1N0eWxlZENvbG9yQ29sdW1uPlxuICAgICkpfVxuICA8L1N0eWxlZENvbG9yUGFsZXR0ZT5cbik7XG5cblNpbmdsZUNvbG9yUGFsZXR0ZS5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5cbmV4cG9ydCBkZWZhdWx0IFNpbmdsZUNvbG9yUGFsZXR0ZTtcbiJdfQ==