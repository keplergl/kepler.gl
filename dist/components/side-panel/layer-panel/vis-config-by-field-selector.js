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
        _styledComponents.SidePanelSection,
        null,
        _react2.default.createElement(
          _styledComponents.PanelLabelWrapper,
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
        _react2.default.createElement(_fieldSelector2.default, {
          fields: this.props.fields,
          value: selectedField && selectedField.name,
          onSelect: this._updateVisByField,
          erasable: true
        })
      ),
      _react2.default.createElement(
        'div',
        null,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvdmlzLWNvbmZpZy1ieS1maWVsZC1zZWxlY3Rvci5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJjaGFubmVsIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsImRvbWFpbiIsImFycmF5IiwiZmllbGRzIiwiaWQiLCJwcm9wZXJ0eSIsInJhbmdlIiwiYW55Iiwic2NhbGVUeXBlIiwic2hvd1NjYWxlIiwiYm9vbCIsInVwZGF0ZUZpZWxkIiwiZnVuYyIsInVwZGF0ZVNjYWxlIiwic2VsZWN0ZWRGaWVsZCIsIm9iamVjdCIsImRlc2NyaXB0aW9uIiwibGFiZWwiLCJWaXNDb25maWdCeUZpZWxkU2VsZWN0b3IiLCJfdXBkYXRlVmlzQnlGaWVsZCIsInByb3BzIiwidmFsIiwicmVuZGVyIiwic2NhbGVPcHRpb25zIiwibmFtZSIsImxlbmd0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFFQTs7QUFLQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEJDLFdBQVMsb0JBQVVDLE1BQVYsQ0FBaUJDLFVBRFY7QUFFaEJDLFVBQVEsb0JBQVVDLEtBQVYsQ0FBZ0JGLFVBRlI7QUFHaEJHLFVBQVEsb0JBQVVELEtBQVYsQ0FBZ0JGLFVBSFI7QUFJaEJJLE1BQUksb0JBQVVMLE1BQVYsQ0FBaUJDLFVBSkw7QUFLaEJLLFlBQVUsb0JBQVVOLE1BQVYsQ0FBaUJDLFVBTFg7QUFNaEJNLFNBQU8sb0JBQVVDLEdBQVYsQ0FBY1AsVUFOTDtBQU9oQlEsYUFBVyxvQkFBVVQsTUFBVixDQUFpQkMsVUFQWjtBQVFoQlMsYUFBVyxvQkFBVUMsSUFBVixDQUFlVixVQVJWO0FBU2hCVyxlQUFhLG9CQUFVQyxJQUFWLENBQWVaLFVBVFo7QUFVaEJhLGVBQWEsb0JBQVVELElBQVYsQ0FBZVosVUFWWjs7QUFZaEI7QUFDQWMsaUJBQWUsb0JBQVVDLE1BYlQ7QUFjaEJDLGVBQWEsb0JBQVVqQixNQWRQO0FBZWhCa0IsU0FBTyxvQkFBVWxCO0FBZkQsQ0FBbEI7O0lBa0JxQm1CLHdCOzs7Ozs7Ozs7Ozs7MEpBQ25CQyxpQixHQUFvQixlQUFPO0FBQ3pCLFlBQUtDLEtBQUwsQ0FBV1QsV0FBWCxDQUF1QlUsR0FBdkI7QUFDRCxLOzs7cUNBRURDLE0scUJBQVM7QUFBQSxpQkFPSCxLQUFLRixLQVBGO0FBQUEsUUFFTGYsUUFGSyxVQUVMQSxRQUZLO0FBQUEsUUFHTEksU0FISyxVQUdMQSxTQUhLO0FBQUEsUUFJTEssYUFKSyxVQUlMQSxhQUpLO0FBQUEsUUFLTEUsV0FMSyxVQUtMQSxXQUxLO0FBQUEscUNBTUxPLFlBTks7QUFBQSxRQU1MQSxZQU5LLHVDQU1VLEVBTlY7OztBQVNQLFdBQ0U7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQ0csaUJBQUtILEtBQUwsQ0FBV0gsS0FBWCxJQUF1QixrQ0FBc0JaLFFBQXRCLENBQXZCO0FBREgsV0FERjtBQUlHVyx5QkFDQztBQUNFLHlCQUFhQSxXQURmO0FBRUUsZ0JBQU8sS0FBS0ksS0FBTCxDQUFXaEIsRUFBbEIsU0FBd0JDO0FBRjFCO0FBTEosU0FERjtBQVlFO0FBQ0Usa0JBQVEsS0FBS2UsS0FBTCxDQUFXakIsTUFEckI7QUFFRSxpQkFBT1csaUJBQWlCQSxjQUFjVSxJQUZ4QztBQUdFLG9CQUFVLEtBQUtMLGlCQUhqQjtBQUlFO0FBSkY7QUFaRixPQURGO0FBb0JFO0FBQUE7QUFBQTtBQUNHVixvQkFDQztBQUNFLHFCQUFXLEtBQUtXLEtBQUwsQ0FBV1osU0FEeEI7QUFFRSxtQkFBU2UsWUFGWDtBQUdFLGlCQUFVbEIsUUFBVixXQUhGO0FBSUUsb0JBQVUsS0FBS2UsS0FBTCxDQUFXUCxXQUp2QjtBQUtFLG9CQUFVVSxhQUFhRSxNQUFiLEdBQXNCO0FBTGxDLFVBREQsR0FRRztBQVROO0FBcEJGLEtBREY7QUFrQ0QsRzs7Ozs7a0JBaERrQlAsd0I7OztBQW1EckJBLHlCQUF5QnJCLFNBQXpCLEdBQXFDQSxTQUFyQyIsImZpbGUiOiJ2aXMtY29uZmlnLWJ5LWZpZWxkLXNlbGVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQge1xuICBQYW5lbExhYmVsLFxuICBQYW5lbExhYmVsV3JhcHBlcixcbiAgU2lkZVBhbmVsU2VjdGlvblxufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgRmllbGRTZWxlY3RvciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9maWVsZC1zZWxlY3Rvcic7XG5pbXBvcnQgSW5mb0hlbHBlciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pbmZvLWhlbHBlcic7XG5pbXBvcnQgRGltZW5zaW9uU2NhbGVTZWxlY3RvciBmcm9tICcuL2RpbWVuc2lvbi1zY2FsZS1zZWxlY3Rvcic7XG5pbXBvcnQge2NhcGl0YWxpemVGaXJzdExldHRlcn0gZnJvbSAndXRpbHMvdXRpbHMnO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIGNoYW5uZWw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgZG9tYWluOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgZmllbGRzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgcHJvcGVydHk6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgcmFuZ2U6IFByb3BUeXBlcy5hbnkuaXNSZXF1aXJlZCxcbiAgc2NhbGVUeXBlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHNob3dTY2FsZTogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgdXBkYXRlRmllbGQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHVwZGF0ZVNjYWxlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gIC8vIG9wdGlvbmFsXG4gIHNlbGVjdGVkRmllbGQ6IFByb3BUeXBlcy5vYmplY3QsXG4gIGRlc2NyaXB0aW9uOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlzQ29uZmlnQnlGaWVsZFNlbGVjdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgX3VwZGF0ZVZpc0J5RmllbGQgPSB2YWwgPT4ge1xuICAgIHRoaXMucHJvcHMudXBkYXRlRmllbGQodmFsKTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgcHJvcGVydHksXG4gICAgICBzaG93U2NhbGUsXG4gICAgICBzZWxlY3RlZEZpZWxkLFxuICAgICAgZGVzY3JpcHRpb24sXG4gICAgICBzY2FsZU9wdGlvbnMgPSBbXVxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICA8UGFuZWxMYWJlbFdyYXBwZXI+XG4gICAgICAgICAgICA8UGFuZWxMYWJlbD5cbiAgICAgICAgICAgICAge3RoaXMucHJvcHMubGFiZWwgfHwgYCR7Y2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHByb3BlcnR5KX0gYmFzZWQgb25gfVxuICAgICAgICAgICAgPC9QYW5lbExhYmVsPlxuICAgICAgICAgICAge2Rlc2NyaXB0aW9uICYmIChcbiAgICAgICAgICAgICAgPEluZm9IZWxwZXJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbj17ZGVzY3JpcHRpb259XG4gICAgICAgICAgICAgICAgaWQ9e2Ake3RoaXMucHJvcHMuaWR9LSR7cHJvcGVydHl9YH1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9QYW5lbExhYmVsV3JhcHBlcj5cbiAgICAgICAgICA8RmllbGRTZWxlY3RvclxuICAgICAgICAgICAgZmllbGRzPXt0aGlzLnByb3BzLmZpZWxkc31cbiAgICAgICAgICAgIHZhbHVlPXtzZWxlY3RlZEZpZWxkICYmIHNlbGVjdGVkRmllbGQubmFtZX1cbiAgICAgICAgICAgIG9uU2VsZWN0PXt0aGlzLl91cGRhdGVWaXNCeUZpZWxkfVxuICAgICAgICAgICAgZXJhc2FibGVcbiAgICAgICAgICAvPlxuICAgICAgICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAge3Nob3dTY2FsZSA/IChcbiAgICAgICAgICAgIDxEaW1lbnNpb25TY2FsZVNlbGVjdG9yXG4gICAgICAgICAgICAgIHNjYWxlVHlwZT17dGhpcy5wcm9wcy5zY2FsZVR5cGV9XG4gICAgICAgICAgICAgIG9wdGlvbnM9e3NjYWxlT3B0aW9uc31cbiAgICAgICAgICAgICAgbGFiZWw9e2Ake3Byb3BlcnR5fSBzY2FsZWB9XG4gICAgICAgICAgICAgIG9uU2VsZWN0PXt0aGlzLnByb3BzLnVwZGF0ZVNjYWxlfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17c2NhbGVPcHRpb25zLmxlbmd0aCA8IDJ9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgICApO1xuICB9XG59XG5cblZpc0NvbmZpZ0J5RmllbGRTZWxlY3Rvci5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG4iXX0=