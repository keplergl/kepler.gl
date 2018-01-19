'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DatasetTabs = exports.DatasetModalTab = exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  .react-grid-Main {\n    outline: 0;\n  }\n\n  .react-grid-Grid {\n    border: 0;\n  }\n\n  .react-grid-Cell {\n    border-right: 0;\n    border-bottom: ', ';\n    padding-left: 16px;\n  }\n\n  .react-grid-HeaderCell {\n    border-right: 0;\n    border-bottom: 0;\n    background: ', ';\n    color: ', ';\n    padding: 14px 8px 14px 0;\n  }\n  .react-grid-Cell:first-child,\n  .react-grid-HeaderCell:first-child {\n    padding-left: ', ';\n  }\n  .react-grid-Cell:last-child,\n  .react-grid-HeaderCell:last-child {\n    padding-right: ', ';\n  }\n  .react-grid-Cell__value {\n    color: ', ';\n  }\n  .react-grid-Canvas {\n    ', ';\n  }\n'], ['\n  .react-grid-Main {\n    outline: 0;\n  }\n\n  .react-grid-Grid {\n    border: 0;\n  }\n\n  .react-grid-Cell {\n    border-right: 0;\n    border-bottom: ', ';\n    padding-left: 16px;\n  }\n\n  .react-grid-HeaderCell {\n    border-right: 0;\n    border-bottom: 0;\n    background: ', ';\n    color: ', ';\n    padding: 14px 8px 14px 0;\n  }\n  .react-grid-Cell:first-child,\n  .react-grid-HeaderCell:first-child {\n    padding-left: ', ';\n  }\n  .react-grid-Cell:last-child,\n  .react-grid-HeaderCell:last-child {\n    padding-right: ', ';\n  }\n  .react-grid-Cell__value {\n    color: ', ';\n  }\n  .react-grid-Canvas {\n    ', ';\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  padding: 0 ', ';\n'], ['\n  display: flex;\n  padding: 0 ', ';\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  align-items: center;\n  border-bottom: 3px solid ', ';\n  cursor: pointer;\n  display: flex;\n  height: 35px;\n  margin: 0 3px;\n  padding: 0 5px;\n\n  :first-child {\n    margin-left: 0;\n    padding-left: 0;\n  }\n'], ['\n  align-items: center;\n  border-bottom: 3px solid ', ';\n  cursor: pointer;\n  display: flex;\n  height: 35px;\n  margin: 0 3px;\n  padding: 0 5px;\n\n  :first-child {\n    margin-left: 0;\n    padding-left: 0;\n  }\n']),
    _templateObject4 = (0, _taggedTemplateLiteralLoose3.default)(['\n  font-weight: 500;\n  color: ', ';\n'], ['\n  font-weight: 500;\n  color: ', ';\n']),
    _templateObject5 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: inline-block;\n  margin-right: 20px;\n  height: 10px;\n  width: 10px;\n  background: rgb(', ');\n'], ['\n  display: inline-block;\n  margin-right: 20px;\n  height: 10px;\n  width: 10px;\n  background: rgb(', ');\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _window = require('global/window');

var _window2 = _interopRequireDefault(_window);

var _defaultSettings = require('../../../constants/default-settings');

var _fieldToken = require('../../common/field-token');

var _fieldToken2 = _interopRequireDefault(_fieldToken);

var _icons = require('../../common/icons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReactDataGrid = _window2.default.navigator ? require('react-data-grid') : null;

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
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DataTableModal);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this._onMouseWheel = function (e) {
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

  DataTableModal.prototype.render = function render() {
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
    }).filter(function (_ref2) {
      var name = _ref2.name;
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
  };

  return DataTableModal;
}(_react.Component);

exports.default = DataTableModal;


var tagContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

var FieldHeader = function FieldHeader(_ref3) {
  var name = _ref3.name,
      type = _ref3.type;
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

var DatasetName = _styledComponents2.default.div(_templateObject4, function (props) {
  return props.theme.titleColorLT;
});

var DatasetColorIcon = _styledComponents2.default.div(_templateObject5, function (props) {
  return props.color.join(',');
});

var DatasetTabs = exports.DatasetTabs = function DatasetTabs(_ref4) {
  var activeDataset = _ref4.activeDataset,
      datasets = _ref4.datasets,
      showDatasetTable = _ref4.showDatasetTable;
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
        _react2.default.createElement(DatasetColorIcon, { className: 'indicator', color: dataset.color }),
        _react2.default.createElement(
          DatasetName,
          { className: 'dataset-name' },
          dataset.label
        )
      );
    })
  );
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbW9kYWxzL2RhdGEtdGFibGUtbW9kYWwuanMiXSwibmFtZXMiOlsiUmVhY3REYXRhR3JpZCIsIm5hdmlnYXRvciIsInJlcXVpcmUiLCJzaG91bGRQcmV2ZW50U2Nyb2xsQmFjayIsInVzZXJBZ2VudCIsImlzTWFjIiwibWF0Y2giLCJpc19jaHJvbWUiLCJpbmRleE9mIiwiaXNfc2FmYXJpIiwiaXNfZmlyZWZveCIsImRnU2V0dGluZ3MiLCJzaWRlUGFkZGluZyIsIkRhdGFHcmlkV3JhcHBlciIsImRpdiIsInByb3BzIiwidGhlbWUiLCJwYW5lbEJvcmRlckxUIiwicGFuZWxCYWNrZ3JvdW5kTFQiLCJ0aXRsZUNvbG9yTFQiLCJsYWJlbENvbG9yTFQiLCJtb2RhbFNjcm9sbEJhciIsIkJvb2xlYW5Gb3JtYXR0ZXIiLCJ2YWx1ZSIsIlN0cmluZyIsIkRhdGFUYWJsZU1vZGFsIiwiX29uTW91c2VXaGVlbCIsImNhbnZhcyIsInJlZnMiLCJyb290IiwicXVlcnlTZWxlY3RvciIsInByZXZlbnRfbGVmdCIsImUiLCJkZWx0YVgiLCJzY3JvbGxMZWZ0IiwicHJldmVudF91cCIsImRlbHRhWSIsInNjcm9sbFRvcCIsInByZXZlbnREZWZhdWx0IiwicmVuZGVyIiwiZGF0YXNldHMiLCJkYXRhSWQiLCJzaG93RGF0YXNldFRhYmxlIiwiYWN0aXZlRGF0YXNldCIsInJvd3MiLCJkYXRhIiwiY29sdW1ucyIsImZpZWxkcyIsIm1hcCIsImZpZWxkIiwiaSIsImtleSIsImhlYWRlclJlbmRlcmVyIiwicmVzaXphYmxlIiwiZm9ybWF0dGVyIiwidHlwZSIsImJvb2xlYW4iLCJ1bmRlZmluZWQiLCJmaWx0ZXIiLCJuYW1lIiwib3ZlcmZsb3ciLCJ3aWR0aCIsImhlaWdodCIsImxlbmd0aCIsInRhZ0NvbnRhaW5lclN0eWxlIiwiZGlzcGxheSIsImZsZXhEaXJlY3Rpb24iLCJqdXN0aWZ5Q29udGVudCIsIkZpZWxkSGVhZGVyIiwiYWxpZ25JdGVtcyIsIm1hcmdpblJpZ2h0IiwibWFyZ2luTGVmdCIsIkRhdGFzZXRDYXRhbG9nIiwiRGF0YXNldE1vZGFsVGFiIiwiYWN0aXZlIiwiRGF0YXNldE5hbWUiLCJEYXRhc2V0Q29sb3JJY29uIiwiY29sb3IiLCJqb2luIiwiRGF0YXNldFRhYnMiLCJPYmplY3QiLCJ2YWx1ZXMiLCJkYXRhc2V0IiwiaWQiLCJsYWJlbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBLElBQU1BLGdCQUFnQixpQkFBT0MsU0FBUCxHQUFtQkMsUUFBUSxpQkFBUixDQUFuQixHQUFnRCxJQUF0RTs7QUFFQSxJQUFJQywwQkFBMEIsS0FBOUI7O0FBRUEsSUFBSSxpQkFBT0YsU0FBUCxJQUFvQixpQkFBT0EsU0FBUCxDQUFpQkcsU0FBekMsRUFBb0Q7QUFBQSxNQUMzQ0gsU0FEMkMsb0JBQzNDQSxTQUQyQztBQUVsRDtBQUNBOztBQUNBLE1BQU1JLFFBQVFKLFVBQVVHLFNBQVYsQ0FBb0JFLEtBQXBCLENBQTBCLFdBQTFCLENBQWQ7QUFDQSxNQUFNQyxZQUFZTixVQUFVRyxTQUFWLENBQW9CSSxPQUFwQixDQUE0QixRQUE1QixJQUF3QyxDQUFDLENBQTNEO0FBQ0EsTUFBTUMsWUFBWVIsVUFBVUcsU0FBVixDQUFvQkksT0FBcEIsQ0FBNEIsUUFBNUIsSUFBd0MsQ0FBQyxDQUEzRDtBQUNBLE1BQU1FLGFBQWFULFVBQVVHLFNBQVYsQ0FBb0JJLE9BQXBCLENBQTRCLFNBQTVCLElBQXlDLENBQUMsQ0FBN0Q7O0FBRUE7QUFDQUwsNEJBQTBCRSxVQUFVRSxhQUFhRSxTQUFiLElBQTBCQyxVQUFwQyxDQUExQjtBQUNEOztBQUVELElBQU1DLGFBQWE7QUFDakJDLGVBQWE7QUFESSxDQUFuQjs7QUFJQSxJQUFNQyxrQkFBa0IsMkJBQU9DLEdBQXpCLGtCQVdlO0FBQUEsU0FB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QUFNOEQsS0FBTixDQUFZQyxJQUFaLENBQWlCLEdBQWpCLENBQVQ7QUFBQSxDQUxkLENBQU47O0FBUU8sSUFBTUMsb0NBQWMsU0FBZEEsV0FBYztBQUFBLE1BQUVwQyxhQUFGLFNBQUVBLGFBQUY7QUFBQSxNQUFpQkgsUUFBakIsU0FBaUJBLFFBQWpCO0FBQUEsTUFBMkJFLGdCQUEzQixTQUEyQkEsZ0JBQTNCO0FBQUEsU0FDekI7QUFBQyxrQkFBRDtBQUFBLE1BQWdCLFdBQVUsdUJBQTFCO0FBQ0dzQyxXQUFPQyxNQUFQLENBQWN6QyxRQUFkLEVBQXdCUSxHQUF4QixDQUE0QjtBQUFBLGFBQzNCO0FBQUMsdUJBQUQ7QUFBQTtBQUNFLHFCQUFVLG1CQURaO0FBRUUsa0JBQVFrQyxZQUFZdkMsYUFGdEI7QUFHRSxlQUFLdUMsUUFBUUMsRUFIZjtBQUlFLG1CQUFTO0FBQUEsbUJBQU16QyxpQkFBaUJ3QyxRQUFRQyxFQUF6QixDQUFOO0FBQUE7QUFKWDtBQU1FLHNDQUFDLGdCQUFELElBQWtCLFdBQVUsV0FBNUIsRUFBd0MsT0FBT0QsUUFBUUwsS0FBdkQsR0FORjtBQU9FO0FBQUMscUJBQUQ7QUFBQSxZQUFhLFdBQVUsY0FBdkI7QUFBdUNLLGtCQUFRRTtBQUEvQztBQVBGLE9BRDJCO0FBQUEsS0FBNUI7QUFESCxHQUR5QjtBQUFBLENBQXBCIiwiZmlsZSI6ImRhdGEtdGFibGUtbW9kYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcblxuaW1wb3J0IHtBTExfRklFTERfVFlQRVN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCBGaWVsZFRva2VuIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ZpZWxkLXRva2VuJztcbmltcG9ydCB7Q2xvY2t9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmNvbnN0IFJlYWN0RGF0YUdyaWQgPSB3aW5kb3cubmF2aWdhdG9yID8gcmVxdWlyZSgncmVhY3QtZGF0YS1ncmlkJykgOiBudWxsO1xuXG5sZXQgc2hvdWxkUHJldmVudFNjcm9sbEJhY2sgPSBmYWxzZTtcblxuaWYgKHdpbmRvdy5uYXZpZ2F0b3IgJiYgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpIHtcbiAgY29uc3Qge25hdmlnYXRvcn0gPSB3aW5kb3c7XG4gIC8vIERldGVjdCBicm93c2Vyc1xuICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU4OTk3ODMvZGV0ZWN0LXNhZmFyaS11c2luZy1qcXVlcnlcbiAgY29uc3QgaXNNYWMgPSBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9NYWNpbnRvc2gvKTtcbiAgY29uc3QgaXNfY2hyb21lID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdDaHJvbWUnKSA+IC0xO1xuICBjb25zdCBpc19zYWZhcmkgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ1NhZmFyaScpID4gLTE7XG4gIGNvbnN0IGlzX2ZpcmVmb3ggPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0ZpcmVmb3gnKSA+IC0xO1xuXG4gIC8vIHByZXZlbnQgY2hyb21lIHNjcm9sbCBiYWNrXG4gIHNob3VsZFByZXZlbnRTY3JvbGxCYWNrID0gaXNNYWMgJiYgKGlzX2Nocm9tZSB8fCBpc19zYWZhcmkgfHwgaXNfZmlyZWZveCk7XG59XG5cbmNvbnN0IGRnU2V0dGluZ3MgPSB7XG4gIHNpZGVQYWRkaW5nOiAnMzhweCdcbn07XG5cbmNvbnN0IERhdGFHcmlkV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIC5yZWFjdC1ncmlkLU1haW4ge1xuICAgIG91dGxpbmU6IDA7XG4gIH1cblxuICAucmVhY3QtZ3JpZC1HcmlkIHtcbiAgICBib3JkZXI6IDA7XG4gIH1cblxuICAucmVhY3QtZ3JpZC1DZWxsIHtcbiAgICBib3JkZXItcmlnaHQ6IDA7XG4gICAgYm9yZGVyLWJvdHRvbTogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJvcmRlckxUfTtcbiAgICBwYWRkaW5nLWxlZnQ6IDE2cHg7XG4gIH1cblxuICAucmVhY3QtZ3JpZC1IZWFkZXJDZWxsIHtcbiAgICBib3JkZXItcmlnaHQ6IDA7XG4gICAgYm9yZGVyLWJvdHRvbTogMDtcbiAgICBiYWNrZ3JvdW5kOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZExUfTtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50aXRsZUNvbG9yTFR9O1xuICAgIHBhZGRpbmc6IDE0cHggOHB4IDE0cHggMDtcbiAgfVxuICAucmVhY3QtZ3JpZC1DZWxsOmZpcnN0LWNoaWxkLFxuICAucmVhY3QtZ3JpZC1IZWFkZXJDZWxsOmZpcnN0LWNoaWxkIHtcbiAgICBwYWRkaW5nLWxlZnQ6ICR7ZGdTZXR0aW5ncy5zaWRlUGFkZGluZ307XG4gIH1cbiAgLnJlYWN0LWdyaWQtQ2VsbDpsYXN0LWNoaWxkLFxuICAucmVhY3QtZ3JpZC1IZWFkZXJDZWxsOmxhc3QtY2hpbGQge1xuICAgIHBhZGRpbmctcmlnaHQ6ICR7ZGdTZXR0aW5ncy5zaWRlUGFkZGluZ307XG4gIH1cbiAgLnJlYWN0LWdyaWQtQ2VsbF9fdmFsdWUge1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxhYmVsQ29sb3JMVH07XG4gIH1cbiAgLnJlYWN0LWdyaWQtQ2FudmFzIHtcbiAgICAke3Byb3BzID0+IHByb3BzLnRoZW1lLm1vZGFsU2Nyb2xsQmFyfTtcbiAgfVxuYDtcblxuY29uc3QgQm9vbGVhbkZvcm1hdHRlciA9ICh7dmFsdWV9KSA9PiA8c3Bhbj57U3RyaW5nKHZhbHVlKX08L3NwYW4+O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEYXRhVGFibGVNb2RhbCBleHRlbmRzIENvbXBvbmVudCB7XG4gIF9vbk1vdXNlV2hlZWwgPSBlID0+IHtcbiAgICAvLyBQcmV2ZW50IGZ1dGlsZSBzY3JvbGwsIHdoaWNoIHdvdWxkIHRyaWdnZXIgdGhlIEJhY2svTmV4dCBwYWdlIGV2ZW50XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21pY2hvL2pRdWVyeS5wcmV2ZW50TWFjQmFja1Njcm9sbFxuICAgIC8vIFRoaXMgcHJldmVudHMgc2Nyb2xsIHdoZW4gcmVhY2hpbmcgdGhlIHRvcG1vc3Qgb3IgbGVmdG1vc3RcbiAgICAvLyBwb3NpdGlvbnMgb2YgYSBjb250YWluZXIuXG5cbiAgICAvLyByZWFjdC1kYXRhLWdyaWQgY2FudmFzIGVsZW1lbnQgY2FuIGJlIHNjcm9sbGVkXG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5yZWZzLnJvb3QucXVlcnlTZWxlY3RvcignLnJlYWN0LWdyaWQtQ2FudmFzJyk7XG5cbiAgICAvLyBJZiBjYW52YXMgY2FuIG5vdCBiZSBzY3JvbGxlZCBsZWZ0IGFueW1vcmUgd2hlbiB3ZSB0cnkgdG8gc2Nyb2xsIGxlZnRcbiAgICBjb25zdCBwcmV2ZW50X2xlZnQgPSBlLmRlbHRhWCA8IDAgJiYgY2FudmFzLnNjcm9sbExlZnQgPD0gMDtcbiAgICAvLyBJZiBjYW52YXMgY2FuIG5vdCBiZSBzY3JvbGxlZCB1cCB3aGVuIHdlIHRyeSB0byBzY3JvbGwgdXBcbiAgICBjb25zdCBwcmV2ZW50X3VwID0gZS5kZWx0YVkgPCAwICYmIGNhbnZhcy5zY3JvbGxUb3AgPD0gMDtcblxuICAgIGlmIChwcmV2ZW50X2xlZnQgfHwgcHJldmVudF91cCkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2RhdGFzZXRzLCBkYXRhSWQsIHNob3dEYXRhc2V0VGFibGV9ID0gdGhpcy5wcm9wcztcblxuICAgIGlmICghZGF0YXNldHMgfHwgIWRhdGFJZCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgYWN0aXZlRGF0YXNldCA9IGRhdGFzZXRzW2RhdGFJZF07XG4gICAgY29uc3Qgcm93cyA9IGFjdGl2ZURhdGFzZXQuZGF0YTtcbiAgICBjb25zdCBjb2x1bW5zID0gYWN0aXZlRGF0YXNldC5maWVsZHNcbiAgICAgIC5tYXAoKGZpZWxkLCBpKSA9PiAoe1xuICAgICAgICAuLi5maWVsZCxcbiAgICAgICAga2V5OiBpLFxuICAgICAgICBoZWFkZXJSZW5kZXJlcjogPEZpZWxkSGVhZGVyIHsuLi5maWVsZH0gLz4sXG4gICAgICAgIHJlc2l6YWJsZTogdHJ1ZSxcbiAgICAgICAgZm9ybWF0dGVyOlxuICAgICAgICAgIGZpZWxkLnR5cGUgPT09IEFMTF9GSUVMRF9UWVBFUy5ib29sZWFuID8gQm9vbGVhbkZvcm1hdHRlciA6IHVuZGVmaW5lZFxuICAgICAgfSkpXG4gICAgICAuZmlsdGVyKCh7bmFtZX0pID0+IG5hbWUgIT09ICdfZ2VvanNvbicpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgcmVmPVwicm9vdFwiIGNsYXNzTmFtZT1cImRhdGFzZXQtbW9kYWxcIiBzdHlsZT17e292ZXJmbG93OiAnb3ZlcmxheSd9fT5cbiAgICAgICAgPERhdGFzZXRUYWJzXG4gICAgICAgICAgYWN0aXZlRGF0YXNldD17YWN0aXZlRGF0YXNldH1cbiAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgc2hvd0RhdGFzZXRUYWJsZT17c2hvd0RhdGFzZXRUYWJsZX1cbiAgICAgICAgLz5cbiAgICAgICAgPERhdGFHcmlkV3JhcHBlclxuICAgICAgICAgIG9uV2hlZWw9e3Nob3VsZFByZXZlbnRTY3JvbGxCYWNrID8gdGhpcy5fb25Nb3VzZVdoZWVsIDogbnVsbH1cbiAgICAgICAgPlxuICAgICAgICAgIHtSZWFjdERhdGFHcmlkID8gKFxuICAgICAgICAgICAgPFJlYWN0RGF0YUdyaWRcbiAgICAgICAgICAgICAgaGVhZGVyUm93SGVpZ2h0PXs3Mn1cbiAgICAgICAgICAgICAgY29sdW1ucz17Y29sdW1uc31cbiAgICAgICAgICAgICAgbWluQ29sdW1uV2lkdGg9ezE3Mn1cbiAgICAgICAgICAgICAgbWluV2lkdGg9e3RoaXMucHJvcHMud2lkdGh9XG4gICAgICAgICAgICAgIG1pbkhlaWdodD17dGhpcy5wcm9wcy5oZWlnaHQgLSA2NX1cbiAgICAgICAgICAgICAgcm93R2V0dGVyPXtpID0+IHJvd3NbaV19XG4gICAgICAgICAgICAgIHJvd0hlaWdodD17NDh9XG4gICAgICAgICAgICAgIHJvd3NDb3VudD17cm93cy5sZW5ndGh9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L0RhdGFHcmlkV3JhcHBlcj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuY29uc3QgdGFnQ29udGFpbmVyU3R5bGUgPSB7XG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2Vlbidcbn07XG5cbmNvbnN0IEZpZWxkSGVhZGVyID0gKHtuYW1lLCB0eXBlfSkgPT4gKFxuICA8ZGl2IHN0eWxlPXt0YWdDb250YWluZXJTdHlsZX0+XG4gICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcid9fT5cbiAgICAgIDxkaXZcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBtYXJnaW5SaWdodDogdHlwZSA9PT0gJ3RpbWVzdGFtcCcgPyAnMnB4JyA6ICcxOHB4JyxcbiAgICAgICAgICBoZWlnaHQ6ICcxNnB4J1xuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7dHlwZSA9PT0gJ3RpbWVzdGFtcCcgPyA8Q2xvY2sgaGVpZ2h0PVwiMTZweFwiIC8+IDogbnVsbH1cbiAgICAgIDwvZGl2PlxuICAgICAge25hbWV9XG4gICAgPC9kaXY+XG4gICAgPGRpdiBzdHlsZT17e21hcmdpbkxlZnQ6ICcxOHB4J319PlxuICAgICAgPEZpZWxkVG9rZW4gdHlwZT17dHlwZX0gLz5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4pO1xuXG5jb25zdCBEYXRhc2V0Q2F0YWxvZyA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBhZGRpbmc6IDAgJHtkZ1NldHRpbmdzLnNpZGVQYWRkaW5nfTtcbmA7XG5cbmV4cG9ydCBjb25zdCBEYXRhc2V0TW9kYWxUYWIgPSBzdHlsZWQuZGl2YFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBib3JkZXItYm90dG9tOiAzcHggc29saWQgJHtwcm9wcyA9PiAocHJvcHMuYWN0aXZlID8gJ2JsYWNrJyA6ICd0cmFuc3BhcmVudCcpfTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBkaXNwbGF5OiBmbGV4O1xuICBoZWlnaHQ6IDM1cHg7XG4gIG1hcmdpbjogMCAzcHg7XG4gIHBhZGRpbmc6IDAgNXB4O1xuXG4gIDpmaXJzdC1jaGlsZCB7XG4gICAgbWFyZ2luLWxlZnQ6IDA7XG4gICAgcGFkZGluZy1sZWZ0OiAwO1xuICB9XG5gO1xuXG5jb25zdCBEYXRhc2V0TmFtZSA9IHN0eWxlZC5kaXZgXG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRpdGxlQ29sb3JMVH07XG5gO1xuXG5jb25zdCBEYXRhc2V0Q29sb3JJY29uID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBtYXJnaW4tcmlnaHQ6IDIwcHg7XG4gIGhlaWdodDogMTBweDtcbiAgd2lkdGg6IDEwcHg7XG4gIGJhY2tncm91bmQ6IHJnYigke3Byb3BzID0+IHByb3BzLmNvbG9yLmpvaW4oJywnKX0pO1xuYDtcblxuZXhwb3J0IGNvbnN0IERhdGFzZXRUYWJzID0gKHthY3RpdmVEYXRhc2V0LCBkYXRhc2V0cywgc2hvd0RhdGFzZXRUYWJsZX0pID0+IChcbiAgPERhdGFzZXRDYXRhbG9nIGNsYXNzTmFtZT1cImRhdGFzZXQtbW9kYWwtY2F0YWxvZ1wiPlxuICAgIHtPYmplY3QudmFsdWVzKGRhdGFzZXRzKS5tYXAoZGF0YXNldCA9PiAoXG4gICAgICA8RGF0YXNldE1vZGFsVGFiXG4gICAgICAgIGNsYXNzTmFtZT1cImRhdGFzZXQtbW9kYWwtdGFiXCJcbiAgICAgICAgYWN0aXZlPXtkYXRhc2V0ID09PSBhY3RpdmVEYXRhc2V0fVxuICAgICAgICBrZXk9e2RhdGFzZXQuaWR9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHNob3dEYXRhc2V0VGFibGUoZGF0YXNldC5pZCl9XG4gICAgICA+XG4gICAgICAgIDxEYXRhc2V0Q29sb3JJY29uIGNsYXNzTmFtZT1cImluZGljYXRvclwiIGNvbG9yPXtkYXRhc2V0LmNvbG9yfSAvPlxuICAgICAgICA8RGF0YXNldE5hbWUgY2xhc3NOYW1lPVwiZGF0YXNldC1uYW1lXCI+e2RhdGFzZXQubGFiZWx9PC9EYXRhc2V0TmFtZT5cbiAgICAgIDwvRGF0YXNldE1vZGFsVGFiPlxuICAgICkpfVxuICA8L0RhdGFzZXRDYXRhbG9nPlxuKTtcbiJdfQ==