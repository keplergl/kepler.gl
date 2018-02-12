'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VisConfigSlider = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('../../common/styled-components');

var _utils = require('../../../utils/utils');

var _rangeSlider = require('../../common/range-slider');

var _rangeSlider2 = _interopRequireDefault(_rangeSlider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  layer: _propTypes2.default.object.isRequired,
  property: _propTypes2.default.string.isRequired,
  onChange: _propTypes2.default.func.isRequired,
  label: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.bool, _propTypes2.default.func]),
  range: _propTypes2.default.arrayOf(_propTypes2.default.number).isRequired,
  step: _propTypes2.default.number,
  isRanged: _propTypes2.default.bool,
  disabled: _propTypes2.default.bool,
  inputTheme: _propTypes2.default.bool
};

var VisConfigSlider = exports.VisConfigSlider = function VisConfigSlider(_ref) {
  var config = _ref.layer.config,
      property = _ref.property,
      label = _ref.label,
      range = _ref.range,
      step = _ref.step,
      isRanged = _ref.isRanged,
      disabled = _ref.disabled,
      _onChange2 = _ref.onChange,
      inputTheme = _ref.inputTheme;
  return _react2.default.createElement(
    _styledComponents.SidePanelSection,
    { disabled: Boolean(disabled) },
    label ? _react2.default.createElement(
      _styledComponents.PanelLabel,
      null,
      typeof label === 'string' ? label : typeof label === 'function' ? label(config) : (0, _utils.capitalizeFirstLetter)(property)
    ) : null,
    _react2.default.createElement(_rangeSlider2.default, {
      range: range,
      value0: isRanged ? config.visConfig[property][0] : range[0],
      value1: isRanged ? config.visConfig[property][1] : config.visConfig[property],
      step: step,
      isRanged: Boolean(isRanged),
      onChange: function onChange(value) {
        return _onChange2((0, _defineProperty3.default)({}, property, isRanged ? value : value[1]));
      },
      inputTheme: inputTheme,
      showInput: true
    })
  );
};

VisConfigSlider.propTypes = propTypes;

exports.default = VisConfigSlider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvdmlzLWNvbmZpZy1zbGlkZXIuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwibGF5ZXIiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwicHJvcGVydHkiLCJzdHJpbmciLCJvbkNoYW5nZSIsImZ1bmMiLCJsYWJlbCIsIm9uZU9mVHlwZSIsImJvb2wiLCJyYW5nZSIsImFycmF5T2YiLCJudW1iZXIiLCJzdGVwIiwiaXNSYW5nZWQiLCJkaXNhYmxlZCIsImlucHV0VGhlbWUiLCJWaXNDb25maWdTbGlkZXIiLCJjb25maWciLCJCb29sZWFuIiwidmlzQ29uZmlnIiwidmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztBQUlBOztBQUVBOzs7Ozs7QUFFQSxJQUFNQSxZQUFZO0FBQ2hCQyxTQUFPLG9CQUFVQyxNQUFWLENBQWlCQyxVQURSO0FBRWhCQyxZQUFVLG9CQUFVQyxNQUFWLENBQWlCRixVQUZYO0FBR2hCRyxZQUFVLG9CQUFVQyxJQUFWLENBQWVKLFVBSFQ7QUFJaEJLLFNBQU8sb0JBQVVDLFNBQVYsQ0FBb0IsQ0FDekIsb0JBQVVKLE1BRGUsRUFFekIsb0JBQVVLLElBRmUsRUFHekIsb0JBQVVILElBSGUsQ0FBcEIsQ0FKUztBQVNoQkksU0FBTyxvQkFBVUMsT0FBVixDQUFrQixvQkFBVUMsTUFBNUIsRUFBb0NWLFVBVDNCO0FBVWhCVyxRQUFNLG9CQUFVRCxNQVZBO0FBV2hCRSxZQUFVLG9CQUFVTCxJQVhKO0FBWWhCTSxZQUFVLG9CQUFVTixJQVpKO0FBYWhCTyxjQUFZLG9CQUFVUDtBQWJOLENBQWxCOztBQWdCTyxJQUFNUSw0Q0FBa0IsU0FBbEJBLGVBQWtCO0FBQUEsTUFDckJDLE1BRHFCLFFBQzdCbEIsS0FENkIsQ0FDckJrQixNQURxQjtBQUFBLE1BRTdCZixRQUY2QixRQUU3QkEsUUFGNkI7QUFBQSxNQUc3QkksS0FINkIsUUFHN0JBLEtBSDZCO0FBQUEsTUFJN0JHLEtBSjZCLFFBSTdCQSxLQUo2QjtBQUFBLE1BSzdCRyxJQUw2QixRQUs3QkEsSUFMNkI7QUFBQSxNQU03QkMsUUFONkIsUUFNN0JBLFFBTjZCO0FBQUEsTUFPN0JDLFFBUDZCLFFBTzdCQSxRQVA2QjtBQUFBLE1BUTdCVixVQVI2QixRQVE3QkEsUUFSNkI7QUFBQSxNQVM3QlcsVUFUNkIsUUFTN0JBLFVBVDZCO0FBQUEsU0FXN0I7QUFBQTtBQUFBLE1BQWtCLFVBQVVHLFFBQVFKLFFBQVIsQ0FBNUI7QUFDR1IsWUFDQztBQUFBO0FBQUE7QUFDRyxhQUFPQSxLQUFQLEtBQWlCLFFBQWpCLEdBQ0dBLEtBREgsR0FFRyxPQUFPQSxLQUFQLEtBQWlCLFVBQWpCLEdBQ0VBLE1BQU1XLE1BQU4sQ0FERixHQUVFLGtDQUFzQmYsUUFBdEI7QUFMUixLQURELEdBUUcsSUFUTjtBQVVFO0FBQ0UsYUFBT08sS0FEVDtBQUVFLGNBQVFJLFdBQVdJLE9BQU9FLFNBQVAsQ0FBaUJqQixRQUFqQixFQUEyQixDQUEzQixDQUFYLEdBQTJDTyxNQUFNLENBQU4sQ0FGckQ7QUFHRSxjQUNFSSxXQUFXSSxPQUFPRSxTQUFQLENBQWlCakIsUUFBakIsRUFBMkIsQ0FBM0IsQ0FBWCxHQUEyQ2UsT0FBT0UsU0FBUCxDQUFpQmpCLFFBQWpCLENBSi9DO0FBTUUsWUFBTVUsSUFOUjtBQU9FLGdCQUFVTSxRQUFRTCxRQUFSLENBUFo7QUFRRSxnQkFBVTtBQUFBLGVBQVNULDZDQUFXRixRQUFYLEVBQXNCVyxXQUFXTyxLQUFYLEdBQW1CQSxNQUFNLENBQU4sQ0FBekMsRUFBVDtBQUFBLE9BUlo7QUFTRSxrQkFBWUwsVUFUZDtBQVVFO0FBVkY7QUFWRixHQVg2QjtBQUFBLENBQXhCOztBQW9DUEMsZ0JBQWdCbEIsU0FBaEIsR0FBNEJBLFNBQTVCOztrQkFFZWtCLGUiLCJmaWxlIjoidmlzLWNvbmZpZy1zbGlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7XG4gIFNpZGVQYW5lbFNlY3Rpb24sXG4gIFBhbmVsTGFiZWxcbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtjYXBpdGFsaXplRmlyc3RMZXR0ZXJ9IGZyb20gJ3V0aWxzL3V0aWxzJztcblxuaW1wb3J0IFJhbmdlU2xpZGVyIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3JhbmdlLXNsaWRlcic7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgbGF5ZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgcHJvcGVydHk6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGxhYmVsOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIFByb3BUeXBlcy5ib29sLFxuICAgIFByb3BUeXBlcy5mdW5jXG4gIF0pLFxuICByYW5nZTogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm51bWJlcikuaXNSZXF1aXJlZCxcbiAgc3RlcDogUHJvcFR5cGVzLm51bWJlcixcbiAgaXNSYW5nZWQ6IFByb3BUeXBlcy5ib29sLFxuICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIGlucHV0VGhlbWU6IFByb3BUeXBlcy5ib29sXG59O1xuXG5leHBvcnQgY29uc3QgVmlzQ29uZmlnU2xpZGVyID0gKHtcbiAgbGF5ZXI6IHtjb25maWd9LFxuICBwcm9wZXJ0eSxcbiAgbGFiZWwsXG4gIHJhbmdlLFxuICBzdGVwLFxuICBpc1JhbmdlZCxcbiAgZGlzYWJsZWQsXG4gIG9uQ2hhbmdlLFxuICBpbnB1dFRoZW1lXG59KSA9PiAoXG4gIDxTaWRlUGFuZWxTZWN0aW9uIGRpc2FibGVkPXtCb29sZWFuKGRpc2FibGVkKX0+XG4gICAge2xhYmVsID8gKFxuICAgICAgPFBhbmVsTGFiZWw+XG4gICAgICAgIHt0eXBlb2YgbGFiZWwgPT09ICdzdHJpbmcnXG4gICAgICAgICAgPyBsYWJlbFxuICAgICAgICAgIDogdHlwZW9mIGxhYmVsID09PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICA/IGxhYmVsKGNvbmZpZylcbiAgICAgICAgICAgIDogY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHByb3BlcnR5KX1cbiAgICAgIDwvUGFuZWxMYWJlbD5cbiAgICApIDogbnVsbH1cbiAgICA8UmFuZ2VTbGlkZXJcbiAgICAgIHJhbmdlPXtyYW5nZX1cbiAgICAgIHZhbHVlMD17aXNSYW5nZWQgPyBjb25maWcudmlzQ29uZmlnW3Byb3BlcnR5XVswXSA6IHJhbmdlWzBdfVxuICAgICAgdmFsdWUxPXtcbiAgICAgICAgaXNSYW5nZWQgPyBjb25maWcudmlzQ29uZmlnW3Byb3BlcnR5XVsxXSA6IGNvbmZpZy52aXNDb25maWdbcHJvcGVydHldXG4gICAgICB9XG4gICAgICBzdGVwPXtzdGVwfVxuICAgICAgaXNSYW5nZWQ9e0Jvb2xlYW4oaXNSYW5nZWQpfVxuICAgICAgb25DaGFuZ2U9e3ZhbHVlID0+IG9uQ2hhbmdlKHtbcHJvcGVydHldOiBpc1JhbmdlZCA/IHZhbHVlIDogdmFsdWVbMV19KX1cbiAgICAgIGlucHV0VGhlbWU9e2lucHV0VGhlbWV9XG4gICAgICBzaG93SW5wdXRcbiAgICAvPlxuICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4pO1xuXG5WaXNDb25maWdTbGlkZXIucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuXG5leHBvcnQgZGVmYXVsdCBWaXNDb25maWdTbGlkZXI7XG4iXX0=