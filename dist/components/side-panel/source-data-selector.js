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
        return { label: ds.label, value: ds.id, color: ds.color };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvc291cmNlLWRhdGEtc2VsZWN0b3IuanMiXSwibmFtZXMiOlsiZGVmYXVsdFBsYWNlSG9sZGVyIiwiRGF0YXNldEl0ZW0iLCJ2YWx1ZSIsIlNvdXJjZURhdGFTZWxlY3RvciIsImRhdGFzZXRzU2VsZWN0b3IiLCJwcm9wcyIsImRhdGFzZXRzIiwiZHNPcHRpb25zU2VsZWN0b3IiLCJPYmplY3QiLCJ2YWx1ZXMiLCJtYXAiLCJsYWJlbCIsImRzIiwiaWQiLCJjb2xvciIsInJlbmRlciIsImRhdGFJZCIsImRpc2FibGVkIiwib25TZWxlY3QiLCJkZWZhdWx0VmFsdWUiLCJkc09wdGlvbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUVBOztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxxQkFBcUIsc0JBQTNCOztBQUVBLElBQU1DLGNBQWMsU0FBZEEsV0FBYztBQUFBLE1BQUVDLEtBQUYsUUFBRUEsS0FBRjtBQUFBLFNBQWEsK0RBQVksU0FBU0EsS0FBckIsR0FBYjtBQUFBLENBQXBCOztJQUVxQkMsa0I7Ozs7Ozs7Ozs7OzswSkFHbkJDLGdCLEdBQW1CO0FBQUEsYUFBU0MsTUFBTUMsUUFBZjtBQUFBLEssUUFDbkJDLGlCLEdBQW9CLDhCQUNsQixNQUFLSCxnQkFEYSxFQUVsQjtBQUFBLGFBQVlJLE9BQU9DLE1BQVAsQ0FBY0gsUUFBZCxFQUNUSSxHQURTLENBQ0w7QUFBQSxlQUFPLEVBQUNDLE9BQU9DLEdBQUdELEtBQVgsRUFBa0JULE9BQU9VLEdBQUdDLEVBQTVCLEVBQWdDQyxPQUFPRixHQUFHRSxLQUExQyxFQUFQO0FBQUEsT0FESyxDQUFaO0FBQUEsS0FGa0IsQzs7QUFIcEI7QUFDQTs7OytCQVFBQyxNLHFCQUFTO0FBQUEsaUJBQ2lFLEtBQUtWLEtBRHRFO0FBQUEsUUFDQVcsTUFEQSxVQUNBQSxNQURBO0FBQUEsUUFDUUMsUUFEUixVQUNRQSxRQURSO0FBQUEsUUFDa0JDLFFBRGxCLFVBQ2tCQSxRQURsQjtBQUFBLHFDQUM0QkMsWUFENUI7QUFBQSxRQUM0QkEsWUFENUIsdUNBQzJDbkIsa0JBRDNDOztBQUVQLFFBQU1vQixZQUFZLEtBQUtiLGlCQUFMLENBQXVCLEtBQUtGLEtBQTVCLENBQWxCOztBQUVBLFdBQ0U7QUFBQTtBQUFBLFFBQWtCLFdBQVUsc0JBQTVCO0FBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQURGO0FBRUU7QUFDRSx1QkFBZVcsU0FBUyxLQUFLWCxLQUFMLENBQVdDLFFBQVgsQ0FBb0JVLE1BQXBCLENBQVQsR0FBdUMsSUFEeEQ7QUFFRSxpQkFBU0ksU0FGWDtBQUdFLHdCQUFnQixPQUhsQjtBQUlFLHNCQUFjLE9BSmhCO0FBS0UscUJBQWEsS0FMZjtBQU1FLGtCQUFVRixRQU5aO0FBT0UscUJBQWFDLFlBUGY7QUFRRSxrQkFBVUYsUUFSWjtBQVNFLHVCQUFlLE9BVGpCO0FBVUUseUNBQWlDaEI7QUFWbkM7QUFGRixLQURGO0FBaUJELEc7Ozs7O2tCQS9Ca0JFLGtCIiwiZmlsZSI6InNvdXJjZS1kYXRhLXNlbGVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5cbmltcG9ydCB7UGFuZWxMYWJlbCwgU2lkZVBhbmVsU2VjdGlvbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IEl0ZW1TZWxlY3RvciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3InO1xuaW1wb3J0IHtEYXRhc2V0VGFnfSBmcm9tICcuL3NvdXJjZS1kYXRhLWNhdGFsb2cnO1xuXG5jb25zdCBkZWZhdWx0UGxhY2VIb2xkZXIgPSAnU2VsZWN0IEEgRGF0YSBTb3VyY2UnO1xuXG5jb25zdCBEYXRhc2V0SXRlbSA9ICh7dmFsdWV9KSA9PiA8RGF0YXNldFRhZyBkYXRhc2V0PXt2YWx1ZX0vPjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU291cmNlRGF0YVNlbGVjdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgLyogc2VsZWN0b3JzICovXG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLWludmFsaWQtdGhpcyAqL1xuICBkYXRhc2V0c1NlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMuZGF0YXNldHM7XG4gIGRzT3B0aW9uc1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgdGhpcy5kYXRhc2V0c1NlbGVjdG9yLFxuICAgIGRhdGFzZXRzID0+IE9iamVjdC52YWx1ZXMoZGF0YXNldHMpXG4gICAgICAubWFwKGRzID0+ICh7bGFiZWw6IGRzLmxhYmVsLCB2YWx1ZTogZHMuaWQsIGNvbG9yOiBkcy5jb2xvcn0pKVxuICApO1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7ZGF0YUlkLCBkaXNhYmxlZCwgb25TZWxlY3QsIGRlZmF1bHRWYWx1ZSA9IGRlZmF1bHRQbGFjZUhvbGRlcn0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGRzT3B0aW9ucyA9IHRoaXMuZHNPcHRpb25zU2VsZWN0b3IodGhpcy5wcm9wcyk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFNpZGVQYW5lbFNlY3Rpb24gY2xhc3NOYW1lPVwiZGF0YS1zb3VyY2Utc2VsZWN0b3JcIj5cbiAgICAgICAgPFBhbmVsTGFiZWw+RGF0YSBTb3VyY2U8L1BhbmVsTGFiZWw+XG4gICAgICAgIDxJdGVtU2VsZWN0b3JcbiAgICAgICAgICBzZWxlY3RlZEl0ZW1zPXtkYXRhSWQgPyB0aGlzLnByb3BzLmRhdGFzZXRzW2RhdGFJZF0gOiBudWxsfVxuICAgICAgICAgIG9wdGlvbnM9e2RzT3B0aW9uc31cbiAgICAgICAgICBnZXRPcHRpb25WYWx1ZT17J3ZhbHVlJ31cbiAgICAgICAgICBmaWx0ZXJPcHRpb249eydsYWJlbCd9XG4gICAgICAgICAgbXVsdGlTZWxlY3Q9e2ZhbHNlfVxuICAgICAgICAgIG9uQ2hhbmdlPXtvblNlbGVjdH1cbiAgICAgICAgICBwbGFjZWhvbGRlcj17ZGVmYXVsdFZhbHVlfVxuICAgICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgICBkaXNwbGF5T3B0aW9uPXsnbGFiZWwnfVxuICAgICAgICAgIERyb3BEb3duTGluZUl0ZW1SZW5kZXJDb21wb25lbnQ9e0RhdGFzZXRJdGVtfVxuICAgICAgICAvPlxuICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==