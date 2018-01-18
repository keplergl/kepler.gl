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
          description: description, id: this.props.id + '-' + property
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvdmlzLWNvbmZpZy1ieS1maWVsZC1zZWxlY3Rvci5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJjaGFubmVsIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsImRvbWFpbiIsImFycmF5IiwiZmllbGRzIiwiaWQiLCJpbm5lclBhbmVsV2lkdGgiLCJudW1iZXIiLCJwcm9wZXJ0eSIsInJhbmdlIiwiYW55Iiwic2NhbGVUeXBlIiwic2hvd1NjYWxlIiwiYm9vbCIsInVwZGF0ZUZpZWxkIiwiZnVuYyIsInVwZGF0ZVNjYWxlIiwic2VsZWN0ZWRGaWVsZCIsIm9iamVjdCIsImRlc2NyaXB0aW9uIiwibGFiZWwiLCJWaXNDb25maWdCeUZpZWxkU2VsZWN0b3IiLCJfdXBkYXRlVmlzQnlGaWVsZCIsInZhbCIsInByb3BzIiwicmVuZGVyIiwic2NhbGVPcHRpb25zIiwibmFtZSIsImxlbmd0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFFQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEJDLFdBQVMsb0JBQVVDLE1BQVYsQ0FBaUJDLFVBRFY7QUFFaEJDLFVBQVEsb0JBQVVDLEtBQVYsQ0FBZ0JGLFVBRlI7QUFHaEJHLFVBQVEsb0JBQVVELEtBQVYsQ0FBZ0JGLFVBSFI7QUFJaEJJLE1BQUksb0JBQVVMLE1BQVYsQ0FBaUJDLFVBSkw7QUFLaEJLLG1CQUFpQixvQkFBVUMsTUFBVixDQUFpQk4sVUFMbEI7QUFNaEJPLFlBQVUsb0JBQVVSLE1BQVYsQ0FBaUJDLFVBTlg7QUFPaEJRLFNBQU8sb0JBQVVDLEdBQVYsQ0FBY1QsVUFQTDtBQVFoQlUsYUFBVyxvQkFBVVgsTUFBVixDQUFpQkMsVUFSWjtBQVNoQlcsYUFBVyxvQkFBVUMsSUFBVixDQUFlWixVQVRWO0FBVWhCYSxlQUFhLG9CQUFVQyxJQUFWLENBQWVkLFVBVlo7QUFXaEJlLGVBQWEsb0JBQVVELElBQVYsQ0FBZWQsVUFYWjs7QUFhaEI7QUFDQWdCLGlCQUFlLG9CQUFVQyxNQWRUO0FBZWhCQyxlQUFhLG9CQUFVbkIsTUFmUDtBQWdCaEJvQixTQUFPLG9CQUFVcEI7QUFoQkQsQ0FBbEI7O0lBbUJxQnFCLHdCOzs7Ozs7Ozs7Ozs7MEpBRW5CQyxpQixHQUFvQixVQUFDQyxHQUFELEVBQVM7QUFDM0IsWUFBS0MsS0FBTCxDQUFXVixXQUFYLENBQXVCUyxHQUF2QjtBQUNELEs7OztxQ0FFREUsTSxxQkFBUztBQUFBLGlCQUNzRSxLQUFLRCxLQUQzRTtBQUFBLFFBQ0FoQixRQURBLFVBQ0FBLFFBREE7QUFBQSxRQUNVSSxTQURWLFVBQ1VBLFNBRFY7QUFBQSxRQUNxQkssYUFEckIsVUFDcUJBLGFBRHJCO0FBQUEsUUFDb0NFLFdBRHBDLFVBQ29DQSxXQURwQztBQUFBLHFDQUNpRE8sWUFEakQ7QUFBQSxRQUNpREEsWUFEakQsdUNBQ2dFLEVBRGhFOzs7QUFHUCxXQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFhLGVBQUtGLEtBQUwsQ0FBV0osS0FBWCxJQUNWLGtDQUFzQlosUUFBdEIsQ0FEVTtBQUFiLFNBREY7QUFHR1csdUJBQWU7QUFDZCx1QkFBYUEsV0FEQyxFQUNZLElBQU8sS0FBS0ssS0FBTCxDQUFXbkIsRUFBbEIsU0FBd0JHO0FBRHBDO0FBSGxCLE9BREY7QUFRRTtBQUFBO0FBQUE7QUFDRTtBQUNFLGtCQUFRLEtBQUtnQixLQUFMLENBQVdwQixNQURyQjtBQUVFLGlCQUFPYSxpQkFBaUJBLGNBQWNVLElBRnhDO0FBR0Usb0JBQVUsS0FBS0wsaUJBSGpCO0FBSUU7QUFKRixVQURGO0FBT0dWLG9CQUFZO0FBQ1gscUJBQVcsS0FBS1ksS0FBTCxDQUFXYixTQURYO0FBRVgsbUJBQVNlLFlBRkU7QUFHWCxpQkFBVWxCLFFBQVYsV0FIVztBQUlYLG9CQUFVLEtBQUtnQixLQUFMLENBQVdSLFdBSlY7QUFLWCxvQkFBVVUsYUFBYUUsTUFBYixHQUFzQjtBQUxyQixVQUFaLEdBTUk7QUFiUDtBQVJGLEtBREY7QUEwQkQsRzs7Ozs7a0JBbkNrQlAsd0I7OztBQXNDckJBLHlCQUF5QnZCLFNBQXpCLEdBQXFDQSxTQUFyQyIsImZpbGUiOiJ2aXMtY29uZmlnLWJ5LWZpZWxkLXNlbGVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQge1BhbmVsTGFiZWwsIFNpZGVQYW5lbFNlY3Rpb259IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBGaWVsZFNlbGVjdG9yIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ZpZWxkLXNlbGVjdG9yJztcbmltcG9ydCBJbmZvSGVscGVyIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2luZm8taGVscGVyJztcbmltcG9ydCBEaW1lbnNpb25TY2FsZVNlbGVjdG9yIGZyb20gJy4vZGltZW5zaW9uLXNjYWxlLXNlbGVjdG9yJztcbmltcG9ydCB7Y2FwaXRhbGl6ZUZpcnN0TGV0dGVyfSBmcm9tICd1dGlscy91dGlscyc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgY2hhbm5lbDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBkb21haW46IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICBmaWVsZHM6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBpbm5lclBhbmVsV2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgcHJvcGVydHk6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgcmFuZ2U6IFByb3BUeXBlcy5hbnkuaXNSZXF1aXJlZCxcbiAgc2NhbGVUeXBlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHNob3dTY2FsZTogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgdXBkYXRlRmllbGQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHVwZGF0ZVNjYWxlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gIC8vIG9wdGlvbmFsXG4gIHNlbGVjdGVkRmllbGQ6IFByb3BUeXBlcy5vYmplY3QsXG4gIGRlc2NyaXB0aW9uOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlzQ29uZmlnQnlGaWVsZFNlbGVjdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICBfdXBkYXRlVmlzQnlGaWVsZCA9ICh2YWwpID0+IHtcbiAgICB0aGlzLnByb3BzLnVwZGF0ZUZpZWxkKHZhbCk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtwcm9wZXJ0eSwgc2hvd1NjYWxlLCBzZWxlY3RlZEZpZWxkLCBkZXNjcmlwdGlvbiwgc2NhbGVPcHRpb25zID0gW119ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiAoXG4gICAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8UGFuZWxMYWJlbD57dGhpcy5wcm9wcy5sYWJlbCB8fFxuICAgICAgICAgIGAke2NhcGl0YWxpemVGaXJzdExldHRlcihwcm9wZXJ0eSl9IGJhc2VkIG9uYH08L1BhbmVsTGFiZWw+XG4gICAgICAgICAge2Rlc2NyaXB0aW9uICYmIDxJbmZvSGVscGVyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbj17ZGVzY3JpcHRpb259IGlkPXtgJHt0aGlzLnByb3BzLmlkfS0ke3Byb3BlcnR5fWB9XG4gICAgICAgICAgLz59XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxGaWVsZFNlbGVjdG9yXG4gICAgICAgICAgICBmaWVsZHM9e3RoaXMucHJvcHMuZmllbGRzfVxuICAgICAgICAgICAgdmFsdWU9e3NlbGVjdGVkRmllbGQgJiYgc2VsZWN0ZWRGaWVsZC5uYW1lfVxuICAgICAgICAgICAgb25TZWxlY3Q9e3RoaXMuX3VwZGF0ZVZpc0J5RmllbGR9XG4gICAgICAgICAgICBlcmFzYWJsZVxuICAgICAgICAgIC8+XG4gICAgICAgICAge3Nob3dTY2FsZSA/IDxEaW1lbnNpb25TY2FsZVNlbGVjdG9yXG4gICAgICAgICAgICBzY2FsZVR5cGU9e3RoaXMucHJvcHMuc2NhbGVUeXBlfVxuICAgICAgICAgICAgb3B0aW9ucz17c2NhbGVPcHRpb25zfVxuICAgICAgICAgICAgbGFiZWw9e2Ake3Byb3BlcnR5fSBzY2FsZWB9XG4gICAgICAgICAgICBvblNlbGVjdD17dGhpcy5wcm9wcy51cGRhdGVTY2FsZX1cbiAgICAgICAgICAgIGRpc2FibGVkPXtzY2FsZU9wdGlvbnMubGVuZ3RoIDwgMn1cbiAgICAgICAgICAvPiA6IG51bGx9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICk7XG4gIH1cbn1cblxuVmlzQ29uZmlnQnlGaWVsZFNlbGVjdG9yLnByb3BUeXBlcyA9IHByb3BUeXBlcztcbiJdfQ==