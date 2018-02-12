'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DatasetTabs = exports.DatasetModalTab = exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  .react-grid-Main {\n    outline: 0;\n  }\n\n  .react-grid-Grid {\n    border: 0;\n  }\n\n  .react-grid-Cell {\n    border-right: 0;\n    border-bottom: ', ';\n    padding-left: 16px;\n  }\n\n  .react-grid-HeaderCell {\n    border-right: 0;\n    border-bottom: 0;\n    background: ', ';\n    color: ', ';\n    padding: 14px 8px 14px 0;\n  }\n  .react-grid-Cell:first-child,\n  .react-grid-HeaderCell:first-child {\n    padding-left: ', ';\n  }\n  .react-grid-Cell:last-child,\n  .react-grid-HeaderCell:last-child {\n    padding-right: ', ';\n  }\n  .react-grid-Cell__value {\n    color: ', ';\n  }\n  .react-grid-Canvas {\n    ', ';\n  }\n'], ['\n  .react-grid-Main {\n    outline: 0;\n  }\n\n  .react-grid-Grid {\n    border: 0;\n  }\n\n  .react-grid-Cell {\n    border-right: 0;\n    border-bottom: ', ';\n    padding-left: 16px;\n  }\n\n  .react-grid-HeaderCell {\n    border-right: 0;\n    border-bottom: 0;\n    background: ', ';\n    color: ', ';\n    padding: 14px 8px 14px 0;\n  }\n  .react-grid-Cell:first-child,\n  .react-grid-HeaderCell:first-child {\n    padding-left: ', ';\n  }\n  .react-grid-Cell:last-child,\n  .react-grid-HeaderCell:last-child {\n    padding-right: ', ';\n  }\n  .react-grid-Cell__value {\n    color: ', ';\n  }\n  .react-grid-Canvas {\n    ', ';\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  display: flex;\n  padding: 0 ', ';\n'], ['\n  display: flex;\n  padding: 0 ', ';\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  align-items: center;\n  border-bottom: 3px solid ', ';\n  cursor: pointer;\n  display: flex;\n  height: 35px;\n  margin: 0 3px;\n  padding: 0 5px;\n\n  :first-child {\n    margin-left: 0;\n    padding-left: 0;\n  }\n'], ['\n  align-items: center;\n  border-bottom: 3px solid ', ';\n  cursor: pointer;\n  display: flex;\n  height: 35px;\n  margin: 0 3px;\n  padding: 0 5px;\n\n  :first-child {\n    margin-left: 0;\n    padding-left: 0;\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _window = require('global/window');

var _window2 = _interopRequireDefault(_window);

var _defaultSettings = require('../../constants/default-settings');

var _fieldToken = require('../common/field-token');

var _fieldToken2 = _interopRequireDefault(_fieldToken);

var _datasetLabel = require('../common/dataset-label');

var _datasetLabel2 = _interopRequireDefault(_datasetLabel);

var _icons = require('../common/icons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReactDataGrid = _window2.default.navigator ? require('react-data-grid/dist/react-data-grid.min') : null;

var shouldPreventScrollBack = false;

if (_window2.default.navigator && _window2.default.navigator.userAgent) {
  var navigator = _window2.default.navigator;
  // Detect browsers
  // http://stackoverflow.com/questions/5899783/detect-safari-using-jquery

  var isMac = navigator.userAgent.match(/Macintosh/);
  var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
  var is_safari = navigator.userAgent.indexOf('Safari') > -1;
  var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;

  // prevent chrome scroll back
  shouldPreventScrollBack = isMac && (is_chrome || is_safari || is_firefox);
}

var dgSettings = {
  sidePadding: '38px'
};

var DataGridWrapper = _styledComponents2.default.div(_templateObject, function (props) {
  return props.theme.panelBorderLT;
}, function (props) {
  return props.theme.panelBackgroundLT;
}, function (props) {
  return props.theme.titleColorLT;
}, dgSettings.sidePadding, dgSettings.sidePadding, function (props) {
  return props.theme.labelColorLT;
}, function (props) {
  return props.theme.modalScrollBar;
});

var BooleanFormatter = function BooleanFormatter(_ref) {
  var value = _ref.value;
  return _react2.default.createElement(
    'span',
    null,
    String(value)
  );
};

var DataTableModal = function (_Component) {
  (0, _inherits3.default)(DataTableModal, _Component);

  function DataTableModal() {
    var _ref2;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DataTableModal);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref2 = DataTableModal.__proto__ || Object.getPrototypeOf(DataTableModal)).call.apply(_ref2, [this].concat(args))), _this), _this._onMouseWheel = function (e) {
      // Prevent futile scroll, which would trigger the Back/Next page event
      // https://github.com/micho/jQuery.preventMacBackScroll
      // This prevents scroll when reaching the topmost or leftmost
      // positions of a container.

      // react-data-grid canvas element can be scrolled
      var canvas = _this.refs.root.querySelector('.react-grid-Canvas');

      // If canvas can not be scrolled left anymore when we try to scroll left
      var prevent_left = e.deltaX < 0 && canvas.scrollLeft <= 0;
      // If canvas can not be scrolled up when we try to scroll up
      var prevent_up = e.deltaY < 0 && canvas.scrollTop <= 0;

      if (prevent_left || prevent_up) {
        e.preventDefault();
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DataTableModal, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          datasets = _props.datasets,
          dataId = _props.dataId,
          showDatasetTable = _props.showDatasetTable;


      if (!datasets || !dataId) {
        return null;
      }

      var activeDataset = datasets[dataId];
      var rows = activeDataset.data;
      var columns = activeDataset.fields.map(function (field, i) {
        return (0, _extends3.default)({}, field, {
          key: i,
          headerRenderer: _react2.default.createElement(FieldHeader, field),
          resizable: true,
          formatter: field.type === _defaultSettings.ALL_FIELD_TYPES.boolean ? BooleanFormatter : undefined
        });
      }).filter(function (_ref3) {
        var name = _ref3.name;
        return name !== '_geojson';
      });

      return _react2.default.createElement(
        'div',
        { ref: 'root', className: 'dataset-modal', style: { overflow: 'overlay' } },
        _react2.default.createElement(DatasetTabs, {
          activeDataset: activeDataset,
          datasets: datasets,
          showDatasetTable: showDatasetTable
        }),
        _react2.default.createElement(
          DataGridWrapper,
          {
            onWheel: shouldPreventScrollBack ? this._onMouseWheel : null
          },
          ReactDataGrid ? _react2.default.createElement(ReactDataGrid, {
            headerRowHeight: 72,
            columns: columns,
            minColumnWidth: 172,
            minWidth: this.props.width,
            minHeight: this.props.height - 65,
            rowGetter: function rowGetter(i) {
              return rows[i];
            },
            rowHeight: 48,
            rowsCount: rows.length
          }) : null
        )
      );
    }
  }]);
  return DataTableModal;
}(_react.Component);

exports.default = DataTableModal;


var tagContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

var FieldHeader = function FieldHeader(_ref4) {
  var name = _ref4.name,
      type = _ref4.type;
  return _react2.default.createElement(
    'div',
    { style: tagContainerStyle },
    _react2.default.createElement(
      'div',
      { style: { display: 'flex', alignItems: 'center' } },
      _react2.default.createElement(
        'div',
        {
          style: {
            marginRight: type === 'timestamp' ? '2px' : '18px',
            height: '16px'
          }
        },
        type === 'timestamp' ? _react2.default.createElement(_icons.Clock, { height: '16px' }) : null
      ),
      name
    ),
    _react2.default.createElement(
      'div',
      { style: { marginLeft: '18px' } },
      _react2.default.createElement(_fieldToken2.default, { type: type })
    )
  );
};

var DatasetCatalog = _styledComponents2.default.div(_templateObject2, dgSettings.sidePadding);

var DatasetModalTab = exports.DatasetModalTab = _styledComponents2.default.div(_templateObject3, function (props) {
  return props.active ? 'black' : 'transparent';
});

var DatasetTabs = exports.DatasetTabs = function DatasetTabs(_ref5) {
  var activeDataset = _ref5.activeDataset,
      datasets = _ref5.datasets,
      showDatasetTable = _ref5.showDatasetTable;
  return _react2.default.createElement(
    DatasetCatalog,
    { className: 'dataset-modal-catalog' },
    Object.values(datasets).map(function (dataset) {
      return _react2.default.createElement(
        DatasetModalTab,
        {
          className: 'dataset-modal-tab',
          active: dataset === activeDataset,
          key: dataset.id,
          onClick: function onClick() {
            return showDatasetTable(dataset.id);
          }
        },
        _react2.default.createElement(_datasetLabel2.default, { dataset: dataset })
      );
    })
  );
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9kYXRhLXRhYmxlLW1vZGFsLmpzIl0sIm5hbWVzIjpbIlJlYWN0RGF0YUdyaWQiLCJuYXZpZ2F0b3IiLCJyZXF1aXJlIiwic2hvdWxkUHJldmVudFNjcm9sbEJhY2siLCJ1c2VyQWdlbnQiLCJpc01hYyIsIm1hdGNoIiwiaXNfY2hyb21lIiwiaW5kZXhPZiIsImlzX3NhZmFyaSIsImlzX2ZpcmVmb3giLCJkZ1NldHRpbmdzIiwic2lkZVBhZGRpbmciLCJEYXRhR3JpZFdyYXBwZXIiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwicGFuZWxCb3JkZXJMVCIsInBhbmVsQmFja2dyb3VuZExUIiwidGl0bGVDb2xvckxUIiwibGFiZWxDb2xvckxUIiwibW9kYWxTY3JvbGxCYXIiLCJCb29sZWFuRm9ybWF0dGVyIiwidmFsdWUiLCJTdHJpbmciLCJEYXRhVGFibGVNb2RhbCIsIl9vbk1vdXNlV2hlZWwiLCJjYW52YXMiLCJyZWZzIiwicm9vdCIsInF1ZXJ5U2VsZWN0b3IiLCJwcmV2ZW50X2xlZnQiLCJlIiwiZGVsdGFYIiwic2Nyb2xsTGVmdCIsInByZXZlbnRfdXAiLCJkZWx0YVkiLCJzY3JvbGxUb3AiLCJwcmV2ZW50RGVmYXVsdCIsImRhdGFzZXRzIiwiZGF0YUlkIiwic2hvd0RhdGFzZXRUYWJsZSIsImFjdGl2ZURhdGFzZXQiLCJyb3dzIiwiZGF0YSIsImNvbHVtbnMiLCJmaWVsZHMiLCJtYXAiLCJmaWVsZCIsImkiLCJrZXkiLCJoZWFkZXJSZW5kZXJlciIsInJlc2l6YWJsZSIsImZvcm1hdHRlciIsInR5cGUiLCJib29sZWFuIiwidW5kZWZpbmVkIiwiZmlsdGVyIiwibmFtZSIsIm92ZXJmbG93Iiwid2lkdGgiLCJoZWlnaHQiLCJsZW5ndGgiLCJ0YWdDb250YWluZXJTdHlsZSIsImRpc3BsYXkiLCJmbGV4RGlyZWN0aW9uIiwianVzdGlmeUNvbnRlbnQiLCJGaWVsZEhlYWRlciIsImFsaWduSXRlbXMiLCJtYXJnaW5SaWdodCIsIm1hcmdpbkxlZnQiLCJEYXRhc2V0Q2F0YWxvZyIsIkRhdGFzZXRNb2RhbFRhYiIsImFjdGl2ZSIsIkRhdGFzZXRUYWJzIiwiT2JqZWN0IiwidmFsdWVzIiwiZGF0YXNldCIsImlkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBLElBQU1BLGdCQUFnQixpQkFBT0MsU0FBUCxHQUFtQkMsUUFBUSwwQ0FBUixDQUFuQixHQUF5RSxJQUEvRjs7QUFFQSxJQUFJQywwQkFBMEIsS0FBOUI7O0FBRUEsSUFBSSxpQkFBT0YsU0FBUCxJQUFvQixpQkFBT0EsU0FBUCxDQUFpQkcsU0FBekMsRUFBb0Q7QUFBQSxNQUMzQ0gsU0FEMkMsb0JBQzNDQSxTQUQyQztBQUVsRDtBQUNBOztBQUNBLE1BQU1JLFFBQVFKLFVBQVVHLFNBQVYsQ0FBb0JFLEtBQXBCLENBQTBCLFdBQTFCLENBQWQ7QUFDQSxNQUFNQyxZQUFZTixVQUFVRyxTQUFWLENBQW9CSSxPQUFwQixDQUE0QixRQUE1QixJQUF3QyxDQUFDLENBQTNEO0FBQ0EsTUFBTUMsWUFBWVIsVUFBVUcsU0FBVixDQUFvQkksT0FBcEIsQ0FBNEIsUUFBNUIsSUFBd0MsQ0FBQyxDQUEzRDtBQUNBLE1BQU1FLGFBQWFULFVBQVVHLFNBQVYsQ0FBb0JJLE9BQXBCLENBQTRCLFNBQTVCLElBQXlDLENBQUMsQ0FBN0Q7O0FBRUE7QUFDQUwsNEJBQTBCRSxVQUFVRSxhQUFhRSxTQUFiLElBQTBCQyxVQUFwQyxDQUExQjtBQUNEOztBQUVELElBQU1DLGFBQWE7QUFDakJDLGVBQWE7QUFESSxDQUFuQjs7QUFJQSxJQUFNQyxrQkFBa0IsMkJBQU9DLEdBQXpCLGtCQVdlO0FBQUEsU0FBU0MsTUFBTUMsS0FBTixDQUFZQyxhQUFyQjtBQUFBLENBWGYsRUFrQlk7QUFBQSxTQUFTRixNQUFNQyxLQUFOLENBQVlF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O0FBQUEsYUFDM0I7QUFBQyx1QkFBRDtBQUFBO0FBQ0UscUJBQVUsbUJBRFo7QUFFRSxrQkFBUThCLFlBQVluQyxhQUZ0QjtBQUdFLGVBQUttQyxRQUFRQyxFQUhmO0FBSUUsbUJBQVM7QUFBQSxtQkFBTXJDLGlCQUFpQm9DLFFBQVFDLEVBQXpCLENBQU47QUFBQTtBQUpYO0FBTUUsZ0VBQWMsU0FBU0QsT0FBdkI7QUFORixPQUQyQjtBQUFBLEtBQTVCO0FBREgsR0FEeUI7QUFBQSxDQUFwQiIsImZpbGUiOiJkYXRhLXRhYmxlLW1vZGFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5cbmltcG9ydCB7QUxMX0ZJRUxEX1RZUEVTfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQgRmllbGRUb2tlbiBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9maWVsZC10b2tlbic7XG5pbXBvcnQgRGF0YXNldExhYmVsIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2RhdGFzZXQtbGFiZWwnO1xuaW1wb3J0IHtDbG9ja30gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMvaW5kZXgnO1xuY29uc3QgUmVhY3REYXRhR3JpZCA9IHdpbmRvdy5uYXZpZ2F0b3IgPyByZXF1aXJlKCdyZWFjdC1kYXRhLWdyaWQvZGlzdC9yZWFjdC1kYXRhLWdyaWQubWluJykgOiBudWxsO1xuXG5sZXQgc2hvdWxkUHJldmVudFNjcm9sbEJhY2sgPSBmYWxzZTtcblxuaWYgKHdpbmRvdy5uYXZpZ2F0b3IgJiYgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpIHtcbiAgY29uc3Qge25hdmlnYXRvcn0gPSB3aW5kb3c7XG4gIC8vIERldGVjdCBicm93c2Vyc1xuICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU4OTk3ODMvZGV0ZWN0LXNhZmFyaS11c2luZy1qcXVlcnlcbiAgY29uc3QgaXNNYWMgPSBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9NYWNpbnRvc2gvKTtcbiAgY29uc3QgaXNfY2hyb21lID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdDaHJvbWUnKSA+IC0xO1xuICBjb25zdCBpc19zYWZhcmkgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ1NhZmFyaScpID4gLTE7XG4gIGNvbnN0IGlzX2ZpcmVmb3ggPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0ZpcmVmb3gnKSA+IC0xO1xuXG4gIC8vIHByZXZlbnQgY2hyb21lIHNjcm9sbCBiYWNrXG4gIHNob3VsZFByZXZlbnRTY3JvbGxCYWNrID0gaXNNYWMgJiYgKGlzX2Nocm9tZSB8fCBpc19zYWZhcmkgfHwgaXNfZmlyZWZveCk7XG59XG5cbmNvbnN0IGRnU2V0dGluZ3MgPSB7XG4gIHNpZGVQYWRkaW5nOiAnMzhweCdcbn07XG5cbmNvbnN0IERhdGFHcmlkV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIC5yZWFjdC1ncmlkLU1haW4ge1xuICAgIG91dGxpbmU6IDA7XG4gIH1cblxuICAucmVhY3QtZ3JpZC1HcmlkIHtcbiAgICBib3JkZXI6IDA7XG4gIH1cblxuICAucmVhY3QtZ3JpZC1DZWxsIHtcbiAgICBib3JkZXItcmlnaHQ6IDA7XG4gICAgYm9yZGVyLWJvdHRvbTogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJvcmRlckxUfTtcbiAgICBwYWRkaW5nLWxlZnQ6IDE2cHg7XG4gIH1cblxuICAucmVhY3QtZ3JpZC1IZWFkZXJDZWxsIHtcbiAgICBib3JkZXItcmlnaHQ6IDA7XG4gICAgYm9yZGVyLWJvdHRvbTogMDtcbiAgICBiYWNrZ3JvdW5kOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZExUfTtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50aXRsZUNvbG9yTFR9O1xuICAgIHBhZGRpbmc6IDE0cHggOHB4IDE0cHggMDtcbiAgfVxuICAucmVhY3QtZ3JpZC1DZWxsOmZpcnN0LWNoaWxkLFxuICAucmVhY3QtZ3JpZC1IZWFkZXJDZWxsOmZpcnN0LWNoaWxkIHtcbiAgICBwYWRkaW5nLWxlZnQ6ICR7ZGdTZXR0aW5ncy5zaWRlUGFkZGluZ307XG4gIH1cbiAgLnJlYWN0LWdyaWQtQ2VsbDpsYXN0LWNoaWxkLFxuICAucmVhY3QtZ3JpZC1IZWFkZXJDZWxsOmxhc3QtY2hpbGQge1xuICAgIHBhZGRpbmctcmlnaHQ6ICR7ZGdTZXR0aW5ncy5zaWRlUGFkZGluZ307XG4gIH1cbiAgLnJlYWN0LWdyaWQtQ2VsbF9fdmFsdWUge1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxhYmVsQ29sb3JMVH07XG4gIH1cbiAgLnJlYWN0LWdyaWQtQ2FudmFzIHtcbiAgICAke3Byb3BzID0+IHByb3BzLnRoZW1lLm1vZGFsU2Nyb2xsQmFyfTtcbiAgfVxuYDtcblxuY29uc3QgQm9vbGVhbkZvcm1hdHRlciA9ICh7dmFsdWV9KSA9PiA8c3Bhbj57U3RyaW5nKHZhbHVlKX08L3NwYW4+O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEYXRhVGFibGVNb2RhbCBleHRlbmRzIENvbXBvbmVudCB7XG4gIF9vbk1vdXNlV2hlZWwgPSBlID0+IHtcbiAgICAvLyBQcmV2ZW50IGZ1dGlsZSBzY3JvbGwsIHdoaWNoIHdvdWxkIHRyaWdnZXIgdGhlIEJhY2svTmV4dCBwYWdlIGV2ZW50XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21pY2hvL2pRdWVyeS5wcmV2ZW50TWFjQmFja1Njcm9sbFxuICAgIC8vIFRoaXMgcHJldmVudHMgc2Nyb2xsIHdoZW4gcmVhY2hpbmcgdGhlIHRvcG1vc3Qgb3IgbGVmdG1vc3RcbiAgICAvLyBwb3NpdGlvbnMgb2YgYSBjb250YWluZXIuXG5cbiAgICAvLyByZWFjdC1kYXRhLWdyaWQgY2FudmFzIGVsZW1lbnQgY2FuIGJlIHNjcm9sbGVkXG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5yZWZzLnJvb3QucXVlcnlTZWxlY3RvcignLnJlYWN0LWdyaWQtQ2FudmFzJyk7XG5cbiAgICAvLyBJZiBjYW52YXMgY2FuIG5vdCBiZSBzY3JvbGxlZCBsZWZ0IGFueW1vcmUgd2hlbiB3ZSB0cnkgdG8gc2Nyb2xsIGxlZnRcbiAgICBjb25zdCBwcmV2ZW50X2xlZnQgPSBlLmRlbHRhWCA8IDAgJiYgY2FudmFzLnNjcm9sbExlZnQgPD0gMDtcbiAgICAvLyBJZiBjYW52YXMgY2FuIG5vdCBiZSBzY3JvbGxlZCB1cCB3aGVuIHdlIHRyeSB0byBzY3JvbGwgdXBcbiAgICBjb25zdCBwcmV2ZW50X3VwID0gZS5kZWx0YVkgPCAwICYmIGNhbnZhcy5zY3JvbGxUb3AgPD0gMDtcblxuICAgIGlmIChwcmV2ZW50X2xlZnQgfHwgcHJldmVudF91cCkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2RhdGFzZXRzLCBkYXRhSWQsIHNob3dEYXRhc2V0VGFibGV9ID0gdGhpcy5wcm9wcztcblxuICAgIGlmICghZGF0YXNldHMgfHwgIWRhdGFJZCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgYWN0aXZlRGF0YXNldCA9IGRhdGFzZXRzW2RhdGFJZF07XG4gICAgY29uc3Qgcm93cyA9IGFjdGl2ZURhdGFzZXQuZGF0YTtcbiAgICBjb25zdCBjb2x1bW5zID0gYWN0aXZlRGF0YXNldC5maWVsZHNcbiAgICAgIC5tYXAoKGZpZWxkLCBpKSA9PiAoe1xuICAgICAgICAuLi5maWVsZCxcbiAgICAgICAga2V5OiBpLFxuICAgICAgICBoZWFkZXJSZW5kZXJlcjogPEZpZWxkSGVhZGVyIHsuLi5maWVsZH0gLz4sXG4gICAgICAgIHJlc2l6YWJsZTogdHJ1ZSxcbiAgICAgICAgZm9ybWF0dGVyOlxuICAgICAgICAgIGZpZWxkLnR5cGUgPT09IEFMTF9GSUVMRF9UWVBFUy5ib29sZWFuID8gQm9vbGVhbkZvcm1hdHRlciA6IHVuZGVmaW5lZFxuICAgICAgfSkpXG4gICAgICAuZmlsdGVyKCh7bmFtZX0pID0+IG5hbWUgIT09ICdfZ2VvanNvbicpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgcmVmPVwicm9vdFwiIGNsYXNzTmFtZT1cImRhdGFzZXQtbW9kYWxcIiBzdHlsZT17e292ZXJmbG93OiAnb3ZlcmxheSd9fT5cbiAgICAgICAgPERhdGFzZXRUYWJzXG4gICAgICAgICAgYWN0aXZlRGF0YXNldD17YWN0aXZlRGF0YXNldH1cbiAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgc2hvd0RhdGFzZXRUYWJsZT17c2hvd0RhdGFzZXRUYWJsZX1cbiAgICAgICAgLz5cbiAgICAgICAgPERhdGFHcmlkV3JhcHBlclxuICAgICAgICAgIG9uV2hlZWw9e3Nob3VsZFByZXZlbnRTY3JvbGxCYWNrID8gdGhpcy5fb25Nb3VzZVdoZWVsIDogbnVsbH1cbiAgICAgICAgPlxuICAgICAgICAgIHtSZWFjdERhdGFHcmlkID8gKFxuICAgICAgICAgICAgPFJlYWN0RGF0YUdyaWRcbiAgICAgICAgICAgICAgaGVhZGVyUm93SGVpZ2h0PXs3Mn1cbiAgICAgICAgICAgICAgY29sdW1ucz17Y29sdW1uc31cbiAgICAgICAgICAgICAgbWluQ29sdW1uV2lkdGg9ezE3Mn1cbiAgICAgICAgICAgICAgbWluV2lkdGg9e3RoaXMucHJvcHMud2lkdGh9XG4gICAgICAgICAgICAgIG1pbkhlaWdodD17dGhpcy5wcm9wcy5oZWlnaHQgLSA2NX1cbiAgICAgICAgICAgICAgcm93R2V0dGVyPXtpID0+IHJvd3NbaV19XG4gICAgICAgICAgICAgIHJvd0hlaWdodD17NDh9XG4gICAgICAgICAgICAgIHJvd3NDb3VudD17cm93cy5sZW5ndGh9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L0RhdGFHcmlkV3JhcHBlcj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuY29uc3QgdGFnQ29udGFpbmVyU3R5bGUgPSB7XG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2Vlbidcbn07XG5cbmNvbnN0IEZpZWxkSGVhZGVyID0gKHtuYW1lLCB0eXBlfSkgPT4gKFxuICA8ZGl2IHN0eWxlPXt0YWdDb250YWluZXJTdHlsZX0+XG4gICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcid9fT5cbiAgICAgIDxkaXZcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBtYXJnaW5SaWdodDogdHlwZSA9PT0gJ3RpbWVzdGFtcCcgPyAnMnB4JyA6ICcxOHB4JyxcbiAgICAgICAgICBoZWlnaHQ6ICcxNnB4J1xuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7dHlwZSA9PT0gJ3RpbWVzdGFtcCcgPyA8Q2xvY2sgaGVpZ2h0PVwiMTZweFwiIC8+IDogbnVsbH1cbiAgICAgIDwvZGl2PlxuICAgICAge25hbWV9XG4gICAgPC9kaXY+XG4gICAgPGRpdiBzdHlsZT17e21hcmdpbkxlZnQ6ICcxOHB4J319PlxuICAgICAgPEZpZWxkVG9rZW4gdHlwZT17dHlwZX0gLz5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4pO1xuXG5jb25zdCBEYXRhc2V0Q2F0YWxvZyA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBhZGRpbmc6IDAgJHtkZ1NldHRpbmdzLnNpZGVQYWRkaW5nfTtcbmA7XG5cbmV4cG9ydCBjb25zdCBEYXRhc2V0TW9kYWxUYWIgPSBzdHlsZWQuZGl2YFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBib3JkZXItYm90dG9tOiAzcHggc29saWQgJHtwcm9wcyA9PiAocHJvcHMuYWN0aXZlID8gJ2JsYWNrJyA6ICd0cmFuc3BhcmVudCcpfTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBkaXNwbGF5OiBmbGV4O1xuICBoZWlnaHQ6IDM1cHg7XG4gIG1hcmdpbjogMCAzcHg7XG4gIHBhZGRpbmc6IDAgNXB4O1xuXG4gIDpmaXJzdC1jaGlsZCB7XG4gICAgbWFyZ2luLWxlZnQ6IDA7XG4gICAgcGFkZGluZy1sZWZ0OiAwO1xuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgRGF0YXNldFRhYnMgPSAoe2FjdGl2ZURhdGFzZXQsIGRhdGFzZXRzLCBzaG93RGF0YXNldFRhYmxlfSkgPT4gKFxuICA8RGF0YXNldENhdGFsb2cgY2xhc3NOYW1lPVwiZGF0YXNldC1tb2RhbC1jYXRhbG9nXCI+XG4gICAge09iamVjdC52YWx1ZXMoZGF0YXNldHMpLm1hcChkYXRhc2V0ID0+IChcbiAgICAgIDxEYXRhc2V0TW9kYWxUYWJcbiAgICAgICAgY2xhc3NOYW1lPVwiZGF0YXNldC1tb2RhbC10YWJcIlxuICAgICAgICBhY3RpdmU9e2RhdGFzZXQgPT09IGFjdGl2ZURhdGFzZXR9XG4gICAgICAgIGtleT17ZGF0YXNldC5pZH1cbiAgICAgICAgb25DbGljaz17KCkgPT4gc2hvd0RhdGFzZXRUYWJsZShkYXRhc2V0LmlkKX1cbiAgICAgID5cbiAgICAgICAgPERhdGFzZXRMYWJlbCBkYXRhc2V0PXtkYXRhc2V0fS8+XG4gICAgICA8L0RhdGFzZXRNb2RhbFRhYj5cbiAgICApKX1cbiAgPC9EYXRhc2V0Q2F0YWxvZz5cbik7XG4iXX0=