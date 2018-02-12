'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reselect = require('reselect');

var _styledComponents = require('../common/styled-components');

var _itemSelector = require('../common/item-selector/item-selector');

var _itemSelector2 = _interopRequireDefault(_itemSelector);

var _sourceDataCatalog = require('./source-data-catalog');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultPlaceHolder = 'Select A Data Source';

var DatasetItem = function DatasetItem(_ref) {
  var value = _ref.value;
  return _react2.default.createElement(_sourceDataCatalog.DatasetTag, { dataset: value });
};

var SourceDataSelector = function (_Component) {
  (0, _inherits3.default)(SourceDataSelector, _Component);

  function SourceDataSelector() {
    var _ref2;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, SourceDataSelector);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref2 = SourceDataSelector.__proto__ || Object.getPrototypeOf(SourceDataSelector)).call.apply(_ref2, [this].concat(args))), _this), _this.datasetsSelector = function (props) {
      return props.datasets;
    }, _this.dsOptionsSelector = (0, _reselect.createSelector)(_this.datasetsSelector, function (datasets) {
      return Object.values(datasets).map(function (ds) {
        return {
          label: ds.label,
          value: ds.id,
          color: ds.color
        };
      });
    }), _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }
  /* selectors */
  /* eslint-disable no-invalid-this */


  (0, _createClass3.default)(SourceDataSelector, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          dataId = _props.dataId,
          disabled = _props.disabled,
          onSelect = _props.onSelect,
          _props$defaultValue = _props.defaultValue,
          defaultValue = _props$defaultValue === undefined ? defaultPlaceHolder : _props$defaultValue,
          inputTheme = _props.inputTheme;

      var dsOptions = this.dsOptionsSelector(this.props);

      return _react2.default.createElement(
        _styledComponents.SidePanelSection,
        { className: 'data-source-selector' },
        _react2.default.createElement(
          _styledComponents.PanelLabel,
          null,
          'Data Source'
        ),
        _react2.default.createElement(_itemSelector2.default, {
          inputTheme: inputTheme,
          selectedItems: dataId ? this.props.datasets[dataId] : null,
          options: dsOptions,
          getOptionValue: 'value',
          filterOption: 'label',
          multiSelect: false,
          onChange: onSelect,
          placeholder: defaultValue,
          disabled: disabled,
          displayOption: 'label',
          DropDownLineItemRenderComponent: DatasetItem
        })
      );
    }
  }]);
  return SourceDataSelector;
}(_react.Component);

exports.default = SourceDataSelector;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvc291cmNlLWRhdGEtc2VsZWN0b3IuanMiXSwibmFtZXMiOlsiZGVmYXVsdFBsYWNlSG9sZGVyIiwiRGF0YXNldEl0ZW0iLCJ2YWx1ZSIsIlNvdXJjZURhdGFTZWxlY3RvciIsImRhdGFzZXRzU2VsZWN0b3IiLCJwcm9wcyIsImRhdGFzZXRzIiwiZHNPcHRpb25zU2VsZWN0b3IiLCJPYmplY3QiLCJ2YWx1ZXMiLCJtYXAiLCJsYWJlbCIsImRzIiwiaWQiLCJjb2xvciIsImRhdGFJZCIsImRpc2FibGVkIiwib25TZWxlY3QiLCJkZWZhdWx0VmFsdWUiLCJpbnB1dFRoZW1lIiwiZHNPcHRpb25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBRUE7O0FBSUE7Ozs7QUFDQTs7OztBQUVBLElBQU1BLHFCQUFxQixzQkFBM0I7O0FBRUEsSUFBTUMsY0FBYyxTQUFkQSxXQUFjO0FBQUEsTUFBRUMsS0FBRixRQUFFQSxLQUFGO0FBQUEsU0FBYSwrREFBWSxTQUFTQSxLQUFyQixHQUFiO0FBQUEsQ0FBcEI7O0lBRXFCQyxrQjs7Ozs7Ozs7Ozs7Ozs7OE5BR25CQyxnQixHQUFtQjtBQUFBLGFBQVNDLE1BQU1DLFFBQWY7QUFBQSxLLFFBQ25CQyxpQixHQUFvQiw4QkFBZSxNQUFLSCxnQkFBcEIsRUFBc0M7QUFBQSxhQUN4REksT0FBT0MsTUFBUCxDQUFjSCxRQUFkLEVBQXdCSSxHQUF4QixDQUE0QjtBQUFBLGVBQU87QUFDakNDLGlCQUFPQyxHQUFHRCxLQUR1QjtBQUVqQ1QsaUJBQU9VLEdBQUdDLEVBRnVCO0FBR2pDQyxpQkFBT0YsR0FBR0U7QUFIdUIsU0FBUDtBQUFBLE9BQTVCLENBRHdEO0FBQUEsS0FBdEMsQzs7QUFIcEI7QUFDQTs7Ozs7NkJBVVM7QUFBQSxtQkFPSCxLQUFLVCxLQVBGO0FBQUEsVUFFTFUsTUFGSyxVQUVMQSxNQUZLO0FBQUEsVUFHTEMsUUFISyxVQUdMQSxRQUhLO0FBQUEsVUFJTEMsUUFKSyxVQUlMQSxRQUpLO0FBQUEsdUNBS0xDLFlBTEs7QUFBQSxVQUtMQSxZQUxLLHVDQUtVbEIsa0JBTFY7QUFBQSxVQU1MbUIsVUFOSyxVQU1MQSxVQU5LOztBQVFQLFVBQU1DLFlBQVksS0FBS2IsaUJBQUwsQ0FBdUIsS0FBS0YsS0FBNUIsQ0FBbEI7O0FBRUEsYUFDRTtBQUFBO0FBQUEsVUFBa0IsV0FBVSxzQkFBNUI7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBREY7QUFFRTtBQUNFLHNCQUFZYyxVQURkO0FBRUUseUJBQWVKLFNBQVMsS0FBS1YsS0FBTCxDQUFXQyxRQUFYLENBQW9CUyxNQUFwQixDQUFULEdBQXVDLElBRnhEO0FBR0UsbUJBQVNLLFNBSFg7QUFJRSwwQkFBZ0IsT0FKbEI7QUFLRSx3QkFBYyxPQUxoQjtBQU1FLHVCQUFhLEtBTmY7QUFPRSxvQkFBVUgsUUFQWjtBQVFFLHVCQUFhQyxZQVJmO0FBU0Usb0JBQVVGLFFBVFo7QUFVRSx5QkFBZSxPQVZqQjtBQVdFLDJDQUFpQ2Y7QUFYbkM7QUFGRixPQURGO0FBa0JEOzs7OztrQkF4Q2tCRSxrQiIsImZpbGUiOiJzb3VyY2UtZGF0YS1zZWxlY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjcmVhdGVTZWxlY3Rvcn0gZnJvbSAncmVzZWxlY3QnO1xuXG5pbXBvcnQge1xuICBQYW5lbExhYmVsLFxuICBTaWRlUGFuZWxTZWN0aW9uXG59IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBJdGVtU2VsZWN0b3IgZnJvbSAnY29tcG9uZW50cy9jb21tb24vaXRlbS1zZWxlY3Rvci9pdGVtLXNlbGVjdG9yJztcbmltcG9ydCB7RGF0YXNldFRhZ30gZnJvbSAnLi9zb3VyY2UtZGF0YS1jYXRhbG9nJztcblxuY29uc3QgZGVmYXVsdFBsYWNlSG9sZGVyID0gJ1NlbGVjdCBBIERhdGEgU291cmNlJztcblxuY29uc3QgRGF0YXNldEl0ZW0gPSAoe3ZhbHVlfSkgPT4gPERhdGFzZXRUYWcgZGF0YXNldD17dmFsdWV9IC8+O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb3VyY2VEYXRhU2VsZWN0b3IgZXh0ZW5kcyBDb21wb25lbnQge1xuICAvKiBzZWxlY3RvcnMgKi9cbiAgLyogZXNsaW50LWRpc2FibGUgbm8taW52YWxpZC10aGlzICovXG4gIGRhdGFzZXRzU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5kYXRhc2V0cztcbiAgZHNPcHRpb25zU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3Rvcih0aGlzLmRhdGFzZXRzU2VsZWN0b3IsIGRhdGFzZXRzID0+XG4gICAgT2JqZWN0LnZhbHVlcyhkYXRhc2V0cykubWFwKGRzID0+ICh7XG4gICAgICBsYWJlbDogZHMubGFiZWwsXG4gICAgICB2YWx1ZTogZHMuaWQsXG4gICAgICBjb2xvcjogZHMuY29sb3JcbiAgICB9KSlcbiAgKTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgZGF0YUlkLFxuICAgICAgZGlzYWJsZWQsXG4gICAgICBvblNlbGVjdCxcbiAgICAgIGRlZmF1bHRWYWx1ZSA9IGRlZmF1bHRQbGFjZUhvbGRlcixcbiAgICAgIGlucHV0VGhlbWVcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBkc09wdGlvbnMgPSB0aGlzLmRzT3B0aW9uc1NlbGVjdG9yKHRoaXMucHJvcHMpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxTaWRlUGFuZWxTZWN0aW9uIGNsYXNzTmFtZT1cImRhdGEtc291cmNlLXNlbGVjdG9yXCI+XG4gICAgICAgIDxQYW5lbExhYmVsPkRhdGEgU291cmNlPC9QYW5lbExhYmVsPlxuICAgICAgICA8SXRlbVNlbGVjdG9yXG4gICAgICAgICAgaW5wdXRUaGVtZT17aW5wdXRUaGVtZX1cbiAgICAgICAgICBzZWxlY3RlZEl0ZW1zPXtkYXRhSWQgPyB0aGlzLnByb3BzLmRhdGFzZXRzW2RhdGFJZF0gOiBudWxsfVxuICAgICAgICAgIG9wdGlvbnM9e2RzT3B0aW9uc31cbiAgICAgICAgICBnZXRPcHRpb25WYWx1ZT17J3ZhbHVlJ31cbiAgICAgICAgICBmaWx0ZXJPcHRpb249eydsYWJlbCd9XG4gICAgICAgICAgbXVsdGlTZWxlY3Q9e2ZhbHNlfVxuICAgICAgICAgIG9uQ2hhbmdlPXtvblNlbGVjdH1cbiAgICAgICAgICBwbGFjZWhvbGRlcj17ZGVmYXVsdFZhbHVlfVxuICAgICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgICBkaXNwbGF5T3B0aW9uPXsnbGFiZWwnfVxuICAgICAgICAgIERyb3BEb3duTGluZUl0ZW1SZW5kZXJDb21wb25lbnQ9e0RhdGFzZXRJdGVtfVxuICAgICAgICAvPlxuICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==