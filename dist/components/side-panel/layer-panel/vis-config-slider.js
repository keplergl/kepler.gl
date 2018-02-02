'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VisConfigSlider = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('../../common/styled-components');

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
      typeof label === 'string' ? label : typeof label === 'function' ? label(config) : capitalizeFirstLetter(property)
    ) : null,
    _react2.default.createElement(_rangeSlider2.default, {
      minValue: range[0],
      maxValue: range[1],
      value0: isRanged ? config.visConfig[property][0] : range[0],
      value1: isRanged ? config.visConfig[property][1] : config.visConfig[property],
      step: step,
      isRanged: Boolean(isRanged),
      onChange: function onChange(value) {
        var _onChange;

        return _onChange2((_onChange = {}, _onChange[property] = isRanged ? value : value[1], _onChange));
      },
      inputTheme: inputTheme,
      showInput: true
    })
  );
};

VisConfigSlider.propTyupes = propTypes;

exports.default = VisConfigSlider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvdmlzLWNvbmZpZy1zbGlkZXIuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwibGF5ZXIiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwicHJvcGVydHkiLCJzdHJpbmciLCJvbkNoYW5nZSIsImZ1bmMiLCJsYWJlbCIsIm9uZU9mVHlwZSIsImJvb2wiLCJyYW5nZSIsImFycmF5T2YiLCJudW1iZXIiLCJzdGVwIiwiaXNSYW5nZWQiLCJkaXNhYmxlZCIsImlucHV0VGhlbWUiLCJWaXNDb25maWdTbGlkZXIiLCJjb25maWciLCJCb29sZWFuIiwiY2FwaXRhbGl6ZUZpcnN0TGV0dGVyIiwidmlzQ29uZmlnIiwidmFsdWUiLCJwcm9wVHl1cGVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztBQUlBOzs7Ozs7QUFFQSxJQUFNQSxZQUFZO0FBQ2hCQyxTQUFPLG9CQUFVQyxNQUFWLENBQWlCQyxVQURSO0FBRWhCQyxZQUFVLG9CQUFVQyxNQUFWLENBQWlCRixVQUZYO0FBR2hCRyxZQUFVLG9CQUFVQyxJQUFWLENBQWVKLFVBSFQ7QUFJaEJLLFNBQU8sb0JBQVVDLFNBQVYsQ0FBb0IsQ0FDekIsb0JBQVVKLE1BRGUsRUFFekIsb0JBQVVLLElBRmUsRUFHekIsb0JBQVVILElBSGUsQ0FBcEIsQ0FKUztBQVNoQkksU0FBTyxvQkFBVUMsT0FBVixDQUFrQixvQkFBVUMsTUFBNUIsRUFBb0NWLFVBVDNCO0FBVWhCVyxRQUFNLG9CQUFVRCxNQVZBO0FBV2hCRSxZQUFVLG9CQUFVTCxJQVhKO0FBWWhCTSxZQUFVLG9CQUFVTixJQVpKO0FBYWhCTyxjQUFZLG9CQUFVUDtBQWJOLENBQWxCOztBQWdCTyxJQUFNUSw0Q0FBa0IsU0FBbEJBLGVBQWtCO0FBQUEsTUFDckJDLE1BRHFCLFFBQzdCbEIsS0FENkIsQ0FDckJrQixNQURxQjtBQUFBLE1BRTdCZixRQUY2QixRQUU3QkEsUUFGNkI7QUFBQSxNQUc3QkksS0FINkIsUUFHN0JBLEtBSDZCO0FBQUEsTUFJN0JHLEtBSjZCLFFBSTdCQSxLQUo2QjtBQUFBLE1BSzdCRyxJQUw2QixRQUs3QkEsSUFMNkI7QUFBQSxNQU03QkMsUUFONkIsUUFNN0JBLFFBTjZCO0FBQUEsTUFPN0JDLFFBUDZCLFFBTzdCQSxRQVA2QjtBQUFBLE1BUTdCVixVQVI2QixRQVE3QkEsUUFSNkI7QUFBQSxNQVM3QlcsVUFUNkIsUUFTN0JBLFVBVDZCO0FBQUEsU0FXN0I7QUFBQTtBQUFBLE1BQWtCLFVBQVVHLFFBQVFKLFFBQVIsQ0FBNUI7QUFDR1IsWUFDQztBQUFBO0FBQUE7QUFDRyxhQUFPQSxLQUFQLEtBQWlCLFFBQWpCLEdBQ0dBLEtBREgsR0FFRyxPQUFPQSxLQUFQLEtBQWlCLFVBQWpCLEdBQ0VBLE1BQU1XLE1BQU4sQ0FERixHQUVFRSxzQkFBc0JqQixRQUF0QjtBQUxSLEtBREQsR0FRRyxJQVROO0FBVUU7QUFDRSxnQkFBVU8sTUFBTSxDQUFOLENBRFo7QUFFRSxnQkFBVUEsTUFBTSxDQUFOLENBRlo7QUFHRSxjQUFRSSxXQUFXSSxPQUFPRyxTQUFQLENBQWlCbEIsUUFBakIsRUFBMkIsQ0FBM0IsQ0FBWCxHQUEyQ08sTUFBTSxDQUFOLENBSHJEO0FBSUUsY0FDRUksV0FBV0ksT0FBT0csU0FBUCxDQUFpQmxCLFFBQWpCLEVBQTJCLENBQTNCLENBQVgsR0FBMkNlLE9BQU9HLFNBQVAsQ0FBaUJsQixRQUFqQixDQUwvQztBQU9FLFlBQU1VLElBUFI7QUFRRSxnQkFBVU0sUUFBUUwsUUFBUixDQVJaO0FBU0UsZ0JBQVU7QUFBQTs7QUFBQSxlQUFTVCxzQ0FBV0YsUUFBWCxJQUFzQlcsV0FBV1EsS0FBWCxHQUFtQkEsTUFBTSxDQUFOLENBQXpDLGFBQVQ7QUFBQSxPQVRaO0FBVUUsa0JBQVlOLFVBVmQ7QUFXRTtBQVhGO0FBVkYsR0FYNkI7QUFBQSxDQUF4Qjs7QUFxQ1BDLGdCQUFnQk0sVUFBaEIsR0FBNkJ4QixTQUE3Qjs7a0JBRWVrQixlIiwiZmlsZSI6InZpcy1jb25maWctc2xpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge1xuICBTaWRlUGFuZWxTZWN0aW9uLFxuICBQYW5lbExhYmVsXG59IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBSYW5nZVNsaWRlciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9yYW5nZS1zbGlkZXInO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIGxheWVyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIHByb3BlcnR5OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBsYWJlbDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICBQcm9wVHlwZXMuYm9vbCxcbiAgICBQcm9wVHlwZXMuZnVuY1xuICBdKSxcbiAgcmFuZ2U6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5udW1iZXIpLmlzUmVxdWlyZWQsXG4gIHN0ZXA6IFByb3BUeXBlcy5udW1iZXIsXG4gIGlzUmFuZ2VkOiBQcm9wVHlwZXMuYm9vbCxcbiAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICBpbnB1dFRoZW1lOiBQcm9wVHlwZXMuYm9vbFxufTtcblxuZXhwb3J0IGNvbnN0IFZpc0NvbmZpZ1NsaWRlciA9ICh7XG4gIGxheWVyOiB7Y29uZmlnfSxcbiAgcHJvcGVydHksXG4gIGxhYmVsLFxuICByYW5nZSxcbiAgc3RlcCxcbiAgaXNSYW5nZWQsXG4gIGRpc2FibGVkLFxuICBvbkNoYW5nZSxcbiAgaW5wdXRUaGVtZVxufSkgPT4gKFxuICA8U2lkZVBhbmVsU2VjdGlvbiBkaXNhYmxlZD17Qm9vbGVhbihkaXNhYmxlZCl9PlxuICAgIHtsYWJlbCA/IChcbiAgICAgIDxQYW5lbExhYmVsPlxuICAgICAgICB7dHlwZW9mIGxhYmVsID09PSAnc3RyaW5nJ1xuICAgICAgICAgID8gbGFiZWxcbiAgICAgICAgICA6IHR5cGVvZiBsYWJlbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgPyBsYWJlbChjb25maWcpXG4gICAgICAgICAgICA6IGNhcGl0YWxpemVGaXJzdExldHRlcihwcm9wZXJ0eSl9XG4gICAgICA8L1BhbmVsTGFiZWw+XG4gICAgKSA6IG51bGx9XG4gICAgPFJhbmdlU2xpZGVyXG4gICAgICBtaW5WYWx1ZT17cmFuZ2VbMF19XG4gICAgICBtYXhWYWx1ZT17cmFuZ2VbMV19XG4gICAgICB2YWx1ZTA9e2lzUmFuZ2VkID8gY29uZmlnLnZpc0NvbmZpZ1twcm9wZXJ0eV1bMF0gOiByYW5nZVswXX1cbiAgICAgIHZhbHVlMT17XG4gICAgICAgIGlzUmFuZ2VkID8gY29uZmlnLnZpc0NvbmZpZ1twcm9wZXJ0eV1bMV0gOiBjb25maWcudmlzQ29uZmlnW3Byb3BlcnR5XVxuICAgICAgfVxuICAgICAgc3RlcD17c3RlcH1cbiAgICAgIGlzUmFuZ2VkPXtCb29sZWFuKGlzUmFuZ2VkKX1cbiAgICAgIG9uQ2hhbmdlPXt2YWx1ZSA9PiBvbkNoYW5nZSh7W3Byb3BlcnR5XTogaXNSYW5nZWQgPyB2YWx1ZSA6IHZhbHVlWzFdfSl9XG4gICAgICBpbnB1dFRoZW1lPXtpbnB1dFRoZW1lfVxuICAgICAgc2hvd0lucHV0XG4gICAgLz5cbiAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuKTtcblxuVmlzQ29uZmlnU2xpZGVyLnByb3BUeXVwZXMgPSBwcm9wVHlwZXM7XG5cbmV4cG9ydCBkZWZhdWx0IFZpc0NvbmZpZ1NsaWRlcjtcbiJdfQ==