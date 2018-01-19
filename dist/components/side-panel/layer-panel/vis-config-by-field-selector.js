'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('../../common/styled-components');

var _fieldSelector = require('../../common/field-selector');

var _fieldSelector2 = _interopRequireDefault(_fieldSelector);

var _infoHelper = require('../../common/info-helper');

var _infoHelper2 = _interopRequireDefault(_infoHelper);

var _dimensionScaleSelector = require('./dimension-scale-selector');

var _dimensionScaleSelector2 = _interopRequireDefault(_dimensionScaleSelector);

var _utils = require('../../../utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  channel: _propTypes2.default.string.isRequired,
  domain: _propTypes2.default.array.isRequired,
  fields: _propTypes2.default.array.isRequired,
  id: _propTypes2.default.string.isRequired,
  innerPanelWidth: _propTypes2.default.number.isRequired,
  property: _propTypes2.default.string.isRequired,
  range: _propTypes2.default.any.isRequired,
  scaleType: _propTypes2.default.string.isRequired,
  showScale: _propTypes2.default.bool.isRequired,
  updateField: _propTypes2.default.func.isRequired,
  updateScale: _propTypes2.default.func.isRequired,

  // optional
  selectedField: _propTypes2.default.object,
  description: _propTypes2.default.string,
  label: _propTypes2.default.string
};

var VisConfigByFieldSelector = function (_Component) {
  (0, _inherits3.default)(VisConfigByFieldSelector, _Component);

  function VisConfigByFieldSelector() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, VisConfigByFieldSelector);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this._updateVisByField = function (val) {
      _this.props.updateField(val);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  VisConfigByFieldSelector.prototype.render = function render() {
    var _props = this.props,
        property = _props.property,
        showScale = _props.showScale,
        selectedField = _props.selectedField,
        description = _props.description,
        _props$scaleOptions = _props.scaleOptions,
        scaleOptions = _props$scaleOptions === undefined ? [] : _props$scaleOptions;


    return _react2.default.createElement(
      _styledComponents.SidePanelSection,
      null,
      _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _styledComponents.PanelLabel,
          null,
          this.props.label || (0, _utils.capitalizeFirstLetter)(property) + ' based on'
        ),
        description && _react2.default.createElement(_infoHelper2.default, {
          description: description,
          id: this.props.id + '-' + property
        })
      ),
      _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_fieldSelector2.default, {
          fields: this.props.fields,
          value: selectedField && selectedField.name,
          onSelect: this._updateVisByField,
          erasable: true
        }),
        showScale ? _react2.default.createElement(_dimensionScaleSelector2.default, {
          scaleType: this.props.scaleType,
          options: scaleOptions,
          label: property + ' scale',
          onSelect: this.props.updateScale,
          disabled: scaleOptions.length < 2
        }) : null
      )
    );
  };

  return VisConfigByFieldSelector;
}(_react.Component);

exports.default = VisConfigByFieldSelector;


VisConfigByFieldSelector.propTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvdmlzLWNvbmZpZy1ieS1maWVsZC1zZWxlY3Rvci5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJjaGFubmVsIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsImRvbWFpbiIsImFycmF5IiwiZmllbGRzIiwiaWQiLCJpbm5lclBhbmVsV2lkdGgiLCJudW1iZXIiLCJwcm9wZXJ0eSIsInJhbmdlIiwiYW55Iiwic2NhbGVUeXBlIiwic2hvd1NjYWxlIiwiYm9vbCIsInVwZGF0ZUZpZWxkIiwiZnVuYyIsInVwZGF0ZVNjYWxlIiwic2VsZWN0ZWRGaWVsZCIsIm9iamVjdCIsImRlc2NyaXB0aW9uIiwibGFiZWwiLCJWaXNDb25maWdCeUZpZWxkU2VsZWN0b3IiLCJfdXBkYXRlVmlzQnlGaWVsZCIsInByb3BzIiwidmFsIiwicmVuZGVyIiwic2NhbGVPcHRpb25zIiwibmFtZSIsImxlbmd0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFFQTs7QUFJQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEJDLFdBQVMsb0JBQVVDLE1BQVYsQ0FBaUJDLFVBRFY7QUFFaEJDLFVBQVEsb0JBQVVDLEtBQVYsQ0FBZ0JGLFVBRlI7QUFHaEJHLFVBQVEsb0JBQVVELEtBQVYsQ0FBZ0JGLFVBSFI7QUFJaEJJLE1BQUksb0JBQVVMLE1BQVYsQ0FBaUJDLFVBSkw7QUFLaEJLLG1CQUFpQixvQkFBVUMsTUFBVixDQUFpQk4sVUFMbEI7QUFNaEJPLFlBQVUsb0JBQVVSLE1BQVYsQ0FBaUJDLFVBTlg7QUFPaEJRLFNBQU8sb0JBQVVDLEdBQVYsQ0FBY1QsVUFQTDtBQVFoQlUsYUFBVyxvQkFBVVgsTUFBVixDQUFpQkMsVUFSWjtBQVNoQlcsYUFBVyxvQkFBVUMsSUFBVixDQUFlWixVQVRWO0FBVWhCYSxlQUFhLG9CQUFVQyxJQUFWLENBQWVkLFVBVlo7QUFXaEJlLGVBQWEsb0JBQVVELElBQVYsQ0FBZWQsVUFYWjs7QUFhaEI7QUFDQWdCLGlCQUFlLG9CQUFVQyxNQWRUO0FBZWhCQyxlQUFhLG9CQUFVbkIsTUFmUDtBQWdCaEJvQixTQUFPLG9CQUFVcEI7QUFoQkQsQ0FBbEI7O0lBbUJxQnFCLHdCOzs7Ozs7Ozs7Ozs7MEpBQ25CQyxpQixHQUFvQixlQUFPO0FBQ3pCLFlBQUtDLEtBQUwsQ0FBV1QsV0FBWCxDQUF1QlUsR0FBdkI7QUFDRCxLOzs7cUNBRURDLE0scUJBQVM7QUFBQSxpQkFPSCxLQUFLRixLQVBGO0FBQUEsUUFFTGYsUUFGSyxVQUVMQSxRQUZLO0FBQUEsUUFHTEksU0FISyxVQUdMQSxTQUhLO0FBQUEsUUFJTEssYUFKSyxVQUlMQSxhQUpLO0FBQUEsUUFLTEUsV0FMSyxVQUtMQSxXQUxLO0FBQUEscUNBTUxPLFlBTks7QUFBQSxRQU1MQSxZQU5LLHVDQU1VLEVBTlY7OztBQVNQLFdBQ0U7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQ0csZUFBS0gsS0FBTCxDQUFXSCxLQUFYLElBQXVCLGtDQUFzQlosUUFBdEIsQ0FBdkI7QUFESCxTQURGO0FBSUdXLHVCQUNDO0FBQ0UsdUJBQWFBLFdBRGY7QUFFRSxjQUFPLEtBQUtJLEtBQUwsQ0FBV2xCLEVBQWxCLFNBQXdCRztBQUYxQjtBQUxKLE9BREY7QUFZRTtBQUFBO0FBQUE7QUFDRTtBQUNFLGtCQUFRLEtBQUtlLEtBQUwsQ0FBV25CLE1BRHJCO0FBRUUsaUJBQU9hLGlCQUFpQkEsY0FBY1UsSUFGeEM7QUFHRSxvQkFBVSxLQUFLTCxpQkFIakI7QUFJRTtBQUpGLFVBREY7QUFPR1Ysb0JBQ0M7QUFDRSxxQkFBVyxLQUFLVyxLQUFMLENBQVdaLFNBRHhCO0FBRUUsbUJBQVNlLFlBRlg7QUFHRSxpQkFBVWxCLFFBQVYsV0FIRjtBQUlFLG9CQUFVLEtBQUtlLEtBQUwsQ0FBV1AsV0FKdkI7QUFLRSxvQkFBVVUsYUFBYUUsTUFBYixHQUFzQjtBQUxsQyxVQURELEdBUUc7QUFmTjtBQVpGLEtBREY7QUFnQ0QsRzs7Ozs7a0JBOUNrQlAsd0I7OztBQWlEckJBLHlCQUF5QnZCLFNBQXpCLEdBQXFDQSxTQUFyQyIsImZpbGUiOiJ2aXMtY29uZmlnLWJ5LWZpZWxkLXNlbGVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQge1xuICBQYW5lbExhYmVsLFxuICBTaWRlUGFuZWxTZWN0aW9uXG59IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBGaWVsZFNlbGVjdG9yIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ZpZWxkLXNlbGVjdG9yJztcbmltcG9ydCBJbmZvSGVscGVyIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2luZm8taGVscGVyJztcbmltcG9ydCBEaW1lbnNpb25TY2FsZVNlbGVjdG9yIGZyb20gJy4vZGltZW5zaW9uLXNjYWxlLXNlbGVjdG9yJztcbmltcG9ydCB7Y2FwaXRhbGl6ZUZpcnN0TGV0dGVyfSBmcm9tICd1dGlscy91dGlscyc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgY2hhbm5lbDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBkb21haW46IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICBmaWVsZHM6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBpbm5lclBhbmVsV2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgcHJvcGVydHk6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgcmFuZ2U6IFByb3BUeXBlcy5hbnkuaXNSZXF1aXJlZCxcbiAgc2NhbGVUeXBlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHNob3dTY2FsZTogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgdXBkYXRlRmllbGQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHVwZGF0ZVNjYWxlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gIC8vIG9wdGlvbmFsXG4gIHNlbGVjdGVkRmllbGQ6IFByb3BUeXBlcy5vYmplY3QsXG4gIGRlc2NyaXB0aW9uOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlzQ29uZmlnQnlGaWVsZFNlbGVjdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgX3VwZGF0ZVZpc0J5RmllbGQgPSB2YWwgPT4ge1xuICAgIHRoaXMucHJvcHMudXBkYXRlRmllbGQodmFsKTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgcHJvcGVydHksXG4gICAgICBzaG93U2NhbGUsXG4gICAgICBzZWxlY3RlZEZpZWxkLFxuICAgICAgZGVzY3JpcHRpb24sXG4gICAgICBzY2FsZU9wdGlvbnMgPSBbXVxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxQYW5lbExhYmVsPlxuICAgICAgICAgICAge3RoaXMucHJvcHMubGFiZWwgfHwgYCR7Y2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHByb3BlcnR5KX0gYmFzZWQgb25gfVxuICAgICAgICAgIDwvUGFuZWxMYWJlbD5cbiAgICAgICAgICB7ZGVzY3JpcHRpb24gJiYgKFxuICAgICAgICAgICAgPEluZm9IZWxwZXJcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb249e2Rlc2NyaXB0aW9ufVxuICAgICAgICAgICAgICBpZD17YCR7dGhpcy5wcm9wcy5pZH0tJHtwcm9wZXJ0eX1gfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8RmllbGRTZWxlY3RvclxuICAgICAgICAgICAgZmllbGRzPXt0aGlzLnByb3BzLmZpZWxkc31cbiAgICAgICAgICAgIHZhbHVlPXtzZWxlY3RlZEZpZWxkICYmIHNlbGVjdGVkRmllbGQubmFtZX1cbiAgICAgICAgICAgIG9uU2VsZWN0PXt0aGlzLl91cGRhdGVWaXNCeUZpZWxkfVxuICAgICAgICAgICAgZXJhc2FibGVcbiAgICAgICAgICAvPlxuICAgICAgICAgIHtzaG93U2NhbGUgPyAoXG4gICAgICAgICAgICA8RGltZW5zaW9uU2NhbGVTZWxlY3RvclxuICAgICAgICAgICAgICBzY2FsZVR5cGU9e3RoaXMucHJvcHMuc2NhbGVUeXBlfVxuICAgICAgICAgICAgICBvcHRpb25zPXtzY2FsZU9wdGlvbnN9XG4gICAgICAgICAgICAgIGxhYmVsPXtgJHtwcm9wZXJ0eX0gc2NhbGVgfVxuICAgICAgICAgICAgICBvblNlbGVjdD17dGhpcy5wcm9wcy51cGRhdGVTY2FsZX1cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3NjYWxlT3B0aW9ucy5sZW5ndGggPCAyfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4gICAgKTtcbiAgfVxufVxuXG5WaXNDb25maWdCeUZpZWxkU2VsZWN0b3IucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuIl19