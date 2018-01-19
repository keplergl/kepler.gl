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
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, SourceDataSelector);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.datasetsSelector = function (props) {
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


  SourceDataSelector.prototype.render = function render() {
    var _props = this.props,
        dataId = _props.dataId,
        disabled = _props.disabled,
        onSelect = _props.onSelect,
        _props$defaultValue = _props.defaultValue,
        defaultValue = _props$defaultValue === undefined ? defaultPlaceHolder : _props$defaultValue;

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
  };

  return SourceDataSelector;
}(_react.Component);

exports.default = SourceDataSelector;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvc291cmNlLWRhdGEtc2VsZWN0b3IuanMiXSwibmFtZXMiOlsiZGVmYXVsdFBsYWNlSG9sZGVyIiwiRGF0YXNldEl0ZW0iLCJ2YWx1ZSIsIlNvdXJjZURhdGFTZWxlY3RvciIsImRhdGFzZXRzU2VsZWN0b3IiLCJwcm9wcyIsImRhdGFzZXRzIiwiZHNPcHRpb25zU2VsZWN0b3IiLCJPYmplY3QiLCJ2YWx1ZXMiLCJtYXAiLCJsYWJlbCIsImRzIiwiaWQiLCJjb2xvciIsInJlbmRlciIsImRhdGFJZCIsImRpc2FibGVkIiwib25TZWxlY3QiLCJkZWZhdWx0VmFsdWUiLCJkc09wdGlvbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUVBOztBQUlBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxxQkFBcUIsc0JBQTNCOztBQUVBLElBQU1DLGNBQWMsU0FBZEEsV0FBYztBQUFBLE1BQUVDLEtBQUYsUUFBRUEsS0FBRjtBQUFBLFNBQWEsK0RBQVksU0FBU0EsS0FBckIsR0FBYjtBQUFBLENBQXBCOztJQUVxQkMsa0I7Ozs7Ozs7Ozs7OzswSkFHbkJDLGdCLEdBQW1CO0FBQUEsYUFBU0MsTUFBTUMsUUFBZjtBQUFBLEssUUFDbkJDLGlCLEdBQW9CLDhCQUFlLE1BQUtILGdCQUFwQixFQUFzQztBQUFBLGFBQ3hESSxPQUFPQyxNQUFQLENBQWNILFFBQWQsRUFBd0JJLEdBQXhCLENBQTRCO0FBQUEsZUFBTztBQUNqQ0MsaUJBQU9DLEdBQUdELEtBRHVCO0FBRWpDVCxpQkFBT1UsR0FBR0MsRUFGdUI7QUFHakNDLGlCQUFPRixHQUFHRTtBQUh1QixTQUFQO0FBQUEsT0FBNUIsQ0FEd0Q7QUFBQSxLQUF0QyxDOztBQUhwQjtBQUNBOzs7K0JBVUFDLE0scUJBQVM7QUFBQSxpQkFNSCxLQUFLVixLQU5GO0FBQUEsUUFFTFcsTUFGSyxVQUVMQSxNQUZLO0FBQUEsUUFHTEMsUUFISyxVQUdMQSxRQUhLO0FBQUEsUUFJTEMsUUFKSyxVQUlMQSxRQUpLO0FBQUEscUNBS0xDLFlBTEs7QUFBQSxRQUtMQSxZQUxLLHVDQUtVbkIsa0JBTFY7O0FBT1AsUUFBTW9CLFlBQVksS0FBS2IsaUJBQUwsQ0FBdUIsS0FBS0YsS0FBNUIsQ0FBbEI7O0FBRUEsV0FDRTtBQUFBO0FBQUEsUUFBa0IsV0FBVSxzQkFBNUI7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BREY7QUFFRTtBQUNFLHVCQUFlVyxTQUFTLEtBQUtYLEtBQUwsQ0FBV0MsUUFBWCxDQUFvQlUsTUFBcEIsQ0FBVCxHQUF1QyxJQUR4RDtBQUVFLGlCQUFTSSxTQUZYO0FBR0Usd0JBQWdCLE9BSGxCO0FBSUUsc0JBQWMsT0FKaEI7QUFLRSxxQkFBYSxLQUxmO0FBTUUsa0JBQVVGLFFBTlo7QUFPRSxxQkFBYUMsWUFQZjtBQVFFLGtCQUFVRixRQVJaO0FBU0UsdUJBQWUsT0FUakI7QUFVRSx5Q0FBaUNoQjtBQVZuQztBQUZGLEtBREY7QUFpQkQsRzs7Ozs7a0JBdENrQkUsa0IiLCJmaWxlIjoic291cmNlLWRhdGEtc2VsZWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y3JlYXRlU2VsZWN0b3J9IGZyb20gJ3Jlc2VsZWN0JztcblxuaW1wb3J0IHtcbiAgUGFuZWxMYWJlbCxcbiAgU2lkZVBhbmVsU2VjdGlvblxufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgSXRlbVNlbGVjdG9yIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2l0ZW0tc2VsZWN0b3IvaXRlbS1zZWxlY3Rvcic7XG5pbXBvcnQge0RhdGFzZXRUYWd9IGZyb20gJy4vc291cmNlLWRhdGEtY2F0YWxvZyc7XG5cbmNvbnN0IGRlZmF1bHRQbGFjZUhvbGRlciA9ICdTZWxlY3QgQSBEYXRhIFNvdXJjZSc7XG5cbmNvbnN0IERhdGFzZXRJdGVtID0gKHt2YWx1ZX0pID0+IDxEYXRhc2V0VGFnIGRhdGFzZXQ9e3ZhbHVlfSAvPjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU291cmNlRGF0YVNlbGVjdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgLyogc2VsZWN0b3JzICovXG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLWludmFsaWQtdGhpcyAqL1xuICBkYXRhc2V0c1NlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMuZGF0YXNldHM7XG4gIGRzT3B0aW9uc1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IodGhpcy5kYXRhc2V0c1NlbGVjdG9yLCBkYXRhc2V0cyA9PlxuICAgIE9iamVjdC52YWx1ZXMoZGF0YXNldHMpLm1hcChkcyA9PiAoe1xuICAgICAgbGFiZWw6IGRzLmxhYmVsLFxuICAgICAgdmFsdWU6IGRzLmlkLFxuICAgICAgY29sb3I6IGRzLmNvbG9yXG4gICAgfSkpXG4gICk7XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGRhdGFJZCxcbiAgICAgIGRpc2FibGVkLFxuICAgICAgb25TZWxlY3QsXG4gICAgICBkZWZhdWx0VmFsdWUgPSBkZWZhdWx0UGxhY2VIb2xkZXJcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBkc09wdGlvbnMgPSB0aGlzLmRzT3B0aW9uc1NlbGVjdG9yKHRoaXMucHJvcHMpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxTaWRlUGFuZWxTZWN0aW9uIGNsYXNzTmFtZT1cImRhdGEtc291cmNlLXNlbGVjdG9yXCI+XG4gICAgICAgIDxQYW5lbExhYmVsPkRhdGEgU291cmNlPC9QYW5lbExhYmVsPlxuICAgICAgICA8SXRlbVNlbGVjdG9yXG4gICAgICAgICAgc2VsZWN0ZWRJdGVtcz17ZGF0YUlkID8gdGhpcy5wcm9wcy5kYXRhc2V0c1tkYXRhSWRdIDogbnVsbH1cbiAgICAgICAgICBvcHRpb25zPXtkc09wdGlvbnN9XG4gICAgICAgICAgZ2V0T3B0aW9uVmFsdWU9eyd2YWx1ZSd9XG4gICAgICAgICAgZmlsdGVyT3B0aW9uPXsnbGFiZWwnfVxuICAgICAgICAgIG11bHRpU2VsZWN0PXtmYWxzZX1cbiAgICAgICAgICBvbkNoYW5nZT17b25TZWxlY3R9XG4gICAgICAgICAgcGxhY2Vob2xkZXI9e2RlZmF1bHRWYWx1ZX1cbiAgICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgICAgZGlzcGxheU9wdGlvbj17J2xhYmVsJ31cbiAgICAgICAgICBEcm9wRG93bkxpbmVJdGVtUmVuZGVyQ29tcG9uZW50PXtEYXRhc2V0SXRlbX1cbiAgICAgICAgLz5cbiAgICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgICApO1xuICB9XG59XG4iXX0=