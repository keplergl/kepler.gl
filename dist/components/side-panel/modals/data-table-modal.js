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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbW9kYWxzL2RhdGEtdGFibGUtbW9kYWwuanMiXSwibmFtZXMiOlsiUmVhY3REYXRhR3JpZCIsIm5hdmlnYXRvciIsInJlcXVpcmUiLCJzaG91bGRQcmV2ZW50U2Nyb2xsQmFjayIsInVzZXJBZ2VudCIsImlzTWFjIiwibWF0Y2giLCJpc19jaHJvbWUiLCJpbmRleE9mIiwiaXNfc2FmYXJpIiwiaXNfZmlyZWZveCIsImRnU2V0dGluZ3MiLCJzaWRlUGFkZGluZyIsIkRhdGFHcmlkV3JhcHBlciIsImRpdiIsInByb3BzIiwidGhlbWUiLCJwYW5lbEJvcmRlckxUIiwicGFuZWxCYWNrZ3JvdW5kTFQiLCJ0aXRsZUNvbG9yTFQiLCJsYWJlbENvbG9yTFQiLCJtb2RhbFNjcm9sbEJhciIsIkJvb2xlYW5Gb3JtYXR0ZXIiLCJ2YWx1ZSIsIlN0cmluZyIsIkRhdGFUYWJsZU1vZGFsIiwiX29uTW91c2VXaGVlbCIsImNhbnZhcyIsInJlZnMiLCJyb290IiwicXVlcnlTZWxlY3RvciIsInByZXZlbnRfbGVmdCIsImUiLCJkZWx0YVgiLCJzY3JvbGxMZWZ0IiwicHJldmVudF91cCIsImRlbHRhWSIsInNjcm9sbFRvcCIsInByZXZlbnREZWZhdWx0IiwicmVuZGVyIiwiZGF0YXNldHMiLCJkYXRhSWQiLCJzaG93RGF0YXNldFRhYmxlIiwiYWN0aXZlRGF0YXNldCIsInJvd3MiLCJkYXRhIiwiY29sdW1ucyIsImZpZWxkcyIsIm1hcCIsImZpZWxkIiwiaSIsImtleSIsImhlYWRlclJlbmRlcmVyIiwicmVzaXphYmxlIiwiZm9ybWF0dGVyIiwidHlwZSIsImJvb2xlYW4iLCJ1bmRlZmluZWQiLCJmaWx0ZXIiLCJuYW1lIiwib3ZlcmZsb3ciLCJ3aWR0aCIsImhlaWdodCIsImxlbmd0aCIsInRhZ0NvbnRhaW5lclN0eWxlIiwiZGlzcGxheSIsImZsZXhEaXJlY3Rpb24iLCJqdXN0aWZ5Q29udGVudCIsIkZpZWxkSGVhZGVyIiwiYWxpZ25JdGVtcyIsIm1hcmdpblJpZ2h0IiwibWFyZ2luTGVmdCIsIkRhdGFzZXRDYXRhbG9nIiwiRGF0YXNldE1vZGFsVGFiIiwiYWN0aXZlIiwiRGF0YXNldE5hbWUiLCJEYXRhc2V0Q29sb3JJY29uIiwiY29sb3IiLCJqb2luIiwiRGF0YXNldFRhYnMiLCJPYmplY3QiLCJ2YWx1ZXMiLCJkYXRhc2V0IiwiaWQiLCJsYWJlbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBLElBQU1BLGdCQUFnQixpQkFBT0MsU0FBUCxHQUFtQkMsUUFBUSwwQ0FBUixDQUFuQixHQUF5RSxJQUEvRjs7QUFFQSxJQUFJQywwQkFBMEIsS0FBOUI7O0FBRUEsSUFBSSxpQkFBT0YsU0FBUCxJQUFvQixpQkFBT0EsU0FBUCxDQUFpQkcsU0FBekMsRUFBb0Q7QUFBQSxNQUMzQ0gsU0FEMkMsb0JBQzNDQSxTQUQyQztBQUVsRDtBQUNBOztBQUNBLE1BQU1JLFFBQVFKLFVBQVVHLFNBQVYsQ0FBb0JFLEtBQXBCLENBQTBCLFdBQTFCLENBQWQ7QUFDQSxNQUFNQyxZQUFZTixVQUFVRyxTQUFWLENBQW9CSSxPQUFwQixDQUE0QixRQUE1QixJQUF3QyxDQUFDLENBQTNEO0FBQ0EsTUFBTUMsWUFBWVIsVUFBVUcsU0FBVixDQUFvQkksT0FBcEIsQ0FBNEIsUUFBNUIsSUFBd0MsQ0FBQyxDQUEzRDtBQUNBLE1BQU1FLGFBQWFULFVBQVVHLFNBQVYsQ0FBb0JJLE9BQXBCLENBQTRCLFNBQTVCLElBQXlDLENBQUMsQ0FBN0Q7O0FBRUE7QUFDQUwsNEJBQTBCRSxVQUFVRSxhQUFhRSxTQUFiLElBQTBCQyxVQUFwQyxDQUExQjtBQUNEOztBQUVELElBQU1DLGFBQWE7QUFDakJDLGVBQWE7QUFESSxDQUFuQjs7QUFJQSxJQUFNQyxrQkFBa0IsMkJBQU9DLEdBQXpCLGtCQVdlO0FBQUEsU0FB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QUFNOEQsS0FBTixDQUFZQyxJQUFaLENBQWlCLEdBQWpCLENBQVQ7QUFBQSxDQUxkLENBQU47O0FBUU8sSUFBTUMsb0NBQWMsU0FBZEEsV0FBYztBQUFBLE1BQUVwQyxhQUFGLFNBQUVBLGFBQUY7QUFBQSxNQUFpQkgsUUFBakIsU0FBaUJBLFFBQWpCO0FBQUEsTUFBMkJFLGdCQUEzQixTQUEyQkEsZ0JBQTNCO0FBQUEsU0FDekI7QUFBQyxrQkFBRDtBQUFBLE1BQWdCLFdBQVUsdUJBQTFCO0FBQ0dzQyxXQUFPQyxNQUFQLENBQWN6QyxRQUFkLEVBQXdCUSxHQUF4QixDQUE0QjtBQUFBLGFBQzNCO0FBQUMsdUJBQUQ7QUFBQTtBQUNFLHFCQUFVLG1CQURaO0FBRUUsa0JBQVFrQyxZQUFZdkMsYUFGdEI7QUFHRSxlQUFLdUMsUUFBUUMsRUFIZjtBQUlFLG1CQUFTO0FBQUEsbUJBQU16QyxpQkFBaUJ3QyxRQUFRQyxFQUF6QixDQUFOO0FBQUE7QUFKWDtBQU1FLHNDQUFDLGdCQUFELElBQWtCLFdBQVUsV0FBNUIsRUFBd0MsT0FBT0QsUUFBUUwsS0FBdkQsR0FORjtBQU9FO0FBQUMscUJBQUQ7QUFBQSxZQUFhLFdBQVUsY0FBdkI7QUFBdUNLLGtCQUFRRTtBQUEvQztBQVBGLE9BRDJCO0FBQUEsS0FBNUI7QUFESCxHQUR5QjtBQUFBLENBQXBCIiwiZmlsZSI6ImRhdGEtdGFibGUtbW9kYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcblxuaW1wb3J0IHtBTExfRklFTERfVFlQRVN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCBGaWVsZFRva2VuIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ZpZWxkLXRva2VuJztcbmltcG9ydCB7Q2xvY2t9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmNvbnN0IFJlYWN0RGF0YUdyaWQgPSB3aW5kb3cubmF2aWdhdG9yID8gcmVxdWlyZSgncmVhY3QtZGF0YS1ncmlkL2Rpc3QvcmVhY3QtZGF0YS1ncmlkLm1pbicpIDogbnVsbDtcblxubGV0IHNob3VsZFByZXZlbnRTY3JvbGxCYWNrID0gZmFsc2U7XG5cbmlmICh3aW5kb3cubmF2aWdhdG9yICYmIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KSB7XG4gIGNvbnN0IHtuYXZpZ2F0b3J9ID0gd2luZG93O1xuICAvLyBEZXRlY3QgYnJvd3NlcnNcbiAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81ODk5NzgzL2RldGVjdC1zYWZhcmktdXNpbmctanF1ZXJ5XG4gIGNvbnN0IGlzTWFjID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvTWFjaW50b3NoLyk7XG4gIGNvbnN0IGlzX2Nocm9tZSA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignQ2hyb21lJykgPiAtMTtcbiAgY29uc3QgaXNfc2FmYXJpID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdTYWZhcmknKSA+IC0xO1xuICBjb25zdCBpc19maXJlZm94ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdGaXJlZm94JykgPiAtMTtcblxuICAvLyBwcmV2ZW50IGNocm9tZSBzY3JvbGwgYmFja1xuICBzaG91bGRQcmV2ZW50U2Nyb2xsQmFjayA9IGlzTWFjICYmIChpc19jaHJvbWUgfHwgaXNfc2FmYXJpIHx8IGlzX2ZpcmVmb3gpO1xufVxuXG5jb25zdCBkZ1NldHRpbmdzID0ge1xuICBzaWRlUGFkZGluZzogJzM4cHgnXG59O1xuXG5jb25zdCBEYXRhR3JpZFdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICAucmVhY3QtZ3JpZC1NYWluIHtcbiAgICBvdXRsaW5lOiAwO1xuICB9XG5cbiAgLnJlYWN0LWdyaWQtR3JpZCB7XG4gICAgYm9yZGVyOiAwO1xuICB9XG5cbiAgLnJlYWN0LWdyaWQtQ2VsbCB7XG4gICAgYm9yZGVyLXJpZ2h0OiAwO1xuICAgIGJvcmRlci1ib3R0b206ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxCb3JkZXJMVH07XG4gICAgcGFkZGluZy1sZWZ0OiAxNnB4O1xuICB9XG5cbiAgLnJlYWN0LWdyaWQtSGVhZGVyQ2VsbCB7XG4gICAgYm9yZGVyLXJpZ2h0OiAwO1xuICAgIGJvcmRlci1ib3R0b206IDA7XG4gICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJhY2tncm91bmRMVH07XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGl0bGVDb2xvckxUfTtcbiAgICBwYWRkaW5nOiAxNHB4IDhweCAxNHB4IDA7XG4gIH1cbiAgLnJlYWN0LWdyaWQtQ2VsbDpmaXJzdC1jaGlsZCxcbiAgLnJlYWN0LWdyaWQtSGVhZGVyQ2VsbDpmaXJzdC1jaGlsZCB7XG4gICAgcGFkZGluZy1sZWZ0OiAke2RnU2V0dGluZ3Muc2lkZVBhZGRpbmd9O1xuICB9XG4gIC5yZWFjdC1ncmlkLUNlbGw6bGFzdC1jaGlsZCxcbiAgLnJlYWN0LWdyaWQtSGVhZGVyQ2VsbDpsYXN0LWNoaWxkIHtcbiAgICBwYWRkaW5nLXJpZ2h0OiAke2RnU2V0dGluZ3Muc2lkZVBhZGRpbmd9O1xuICB9XG4gIC5yZWFjdC1ncmlkLUNlbGxfX3ZhbHVlIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYWJlbENvbG9yTFR9O1xuICB9XG4gIC5yZWFjdC1ncmlkLUNhbnZhcyB7XG4gICAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5tb2RhbFNjcm9sbEJhcn07XG4gIH1cbmA7XG5cbmNvbnN0IEJvb2xlYW5Gb3JtYXR0ZXIgPSAoe3ZhbHVlfSkgPT4gPHNwYW4+e1N0cmluZyh2YWx1ZSl9PC9zcGFuPjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGF0YVRhYmxlTW9kYWwgZXh0ZW5kcyBDb21wb25lbnQge1xuICBfb25Nb3VzZVdoZWVsID0gZSA9PiB7XG4gICAgLy8gUHJldmVudCBmdXRpbGUgc2Nyb2xsLCB3aGljaCB3b3VsZCB0cmlnZ2VyIHRoZSBCYWNrL05leHQgcGFnZSBldmVudFxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNoby9qUXVlcnkucHJldmVudE1hY0JhY2tTY3JvbGxcbiAgICAvLyBUaGlzIHByZXZlbnRzIHNjcm9sbCB3aGVuIHJlYWNoaW5nIHRoZSB0b3Btb3N0IG9yIGxlZnRtb3N0XG4gICAgLy8gcG9zaXRpb25zIG9mIGEgY29udGFpbmVyLlxuXG4gICAgLy8gcmVhY3QtZGF0YS1ncmlkIGNhbnZhcyBlbGVtZW50IGNhbiBiZSBzY3JvbGxlZFxuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMucmVmcy5yb290LnF1ZXJ5U2VsZWN0b3IoJy5yZWFjdC1ncmlkLUNhbnZhcycpO1xuXG4gICAgLy8gSWYgY2FudmFzIGNhbiBub3QgYmUgc2Nyb2xsZWQgbGVmdCBhbnltb3JlIHdoZW4gd2UgdHJ5IHRvIHNjcm9sbCBsZWZ0XG4gICAgY29uc3QgcHJldmVudF9sZWZ0ID0gZS5kZWx0YVggPCAwICYmIGNhbnZhcy5zY3JvbGxMZWZ0IDw9IDA7XG4gICAgLy8gSWYgY2FudmFzIGNhbiBub3QgYmUgc2Nyb2xsZWQgdXAgd2hlbiB3ZSB0cnkgdG8gc2Nyb2xsIHVwXG4gICAgY29uc3QgcHJldmVudF91cCA9IGUuZGVsdGFZIDwgMCAmJiBjYW52YXMuc2Nyb2xsVG9wIDw9IDA7XG5cbiAgICBpZiAocHJldmVudF9sZWZ0IHx8IHByZXZlbnRfdXApIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtkYXRhc2V0cywgZGF0YUlkLCBzaG93RGF0YXNldFRhYmxlfSA9IHRoaXMucHJvcHM7XG5cbiAgICBpZiAoIWRhdGFzZXRzIHx8ICFkYXRhSWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGFjdGl2ZURhdGFzZXQgPSBkYXRhc2V0c1tkYXRhSWRdO1xuICAgIGNvbnN0IHJvd3MgPSBhY3RpdmVEYXRhc2V0LmRhdGE7XG4gICAgY29uc3QgY29sdW1ucyA9IGFjdGl2ZURhdGFzZXQuZmllbGRzXG4gICAgICAubWFwKChmaWVsZCwgaSkgPT4gKHtcbiAgICAgICAgLi4uZmllbGQsXG4gICAgICAgIGtleTogaSxcbiAgICAgICAgaGVhZGVyUmVuZGVyZXI6IDxGaWVsZEhlYWRlciB7Li4uZmllbGR9IC8+LFxuICAgICAgICByZXNpemFibGU6IHRydWUsXG4gICAgICAgIGZvcm1hdHRlcjpcbiAgICAgICAgICBmaWVsZC50eXBlID09PSBBTExfRklFTERfVFlQRVMuYm9vbGVhbiA/IEJvb2xlYW5Gb3JtYXR0ZXIgOiB1bmRlZmluZWRcbiAgICAgIH0pKVxuICAgICAgLmZpbHRlcigoe25hbWV9KSA9PiBuYW1lICE9PSAnX2dlb2pzb24nKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHJlZj1cInJvb3RcIiBjbGFzc05hbWU9XCJkYXRhc2V0LW1vZGFsXCIgc3R5bGU9e3tvdmVyZmxvdzogJ292ZXJsYXknfX0+XG4gICAgICAgIDxEYXRhc2V0VGFic1xuICAgICAgICAgIGFjdGl2ZURhdGFzZXQ9e2FjdGl2ZURhdGFzZXR9XG4gICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgIHNob3dEYXRhc2V0VGFibGU9e3Nob3dEYXRhc2V0VGFibGV9XG4gICAgICAgIC8+XG4gICAgICAgIDxEYXRhR3JpZFdyYXBwZXJcbiAgICAgICAgICBvbldoZWVsPXtzaG91bGRQcmV2ZW50U2Nyb2xsQmFjayA/IHRoaXMuX29uTW91c2VXaGVlbCA6IG51bGx9XG4gICAgICAgID5cbiAgICAgICAgICB7UmVhY3REYXRhR3JpZCA/IChcbiAgICAgICAgICAgIDxSZWFjdERhdGFHcmlkXG4gICAgICAgICAgICAgIGhlYWRlclJvd0hlaWdodD17NzJ9XG4gICAgICAgICAgICAgIGNvbHVtbnM9e2NvbHVtbnN9XG4gICAgICAgICAgICAgIG1pbkNvbHVtbldpZHRoPXsxNzJ9XG4gICAgICAgICAgICAgIG1pbldpZHRoPXt0aGlzLnByb3BzLndpZHRofVxuICAgICAgICAgICAgICBtaW5IZWlnaHQ9e3RoaXMucHJvcHMuaGVpZ2h0IC0gNjV9XG4gICAgICAgICAgICAgIHJvd0dldHRlcj17aSA9PiByb3dzW2ldfVxuICAgICAgICAgICAgICByb3dIZWlnaHQ9ezQ4fVxuICAgICAgICAgICAgICByb3dzQ291bnQ9e3Jvd3MubGVuZ3RofVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPC9EYXRhR3JpZFdyYXBwZXI+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmNvbnN0IHRhZ0NvbnRhaW5lclN0eWxlID0ge1xuICBkaXNwbGF5OiAnZmxleCcsXG4gIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nXG59O1xuXG5jb25zdCBGaWVsZEhlYWRlciA9ICh7bmFtZSwgdHlwZX0pID0+IChcbiAgPGRpdiBzdHlsZT17dGFnQ29udGFpbmVyU3R5bGV9PlxuICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInfX0+XG4gICAgICA8ZGl2XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgbWFyZ2luUmlnaHQ6IHR5cGUgPT09ICd0aW1lc3RhbXAnID8gJzJweCcgOiAnMThweCcsXG4gICAgICAgICAgaGVpZ2h0OiAnMTZweCdcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAge3R5cGUgPT09ICd0aW1lc3RhbXAnID8gPENsb2NrIGhlaWdodD1cIjE2cHhcIiAvPiA6IG51bGx9XG4gICAgICA8L2Rpdj5cbiAgICAgIHtuYW1lfVxuICAgIDwvZGl2PlxuICAgIDxkaXYgc3R5bGU9e3ttYXJnaW5MZWZ0OiAnMThweCd9fT5cbiAgICAgIDxGaWVsZFRva2VuIHR5cGU9e3R5cGV9IC8+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuKTtcblxuY29uc3QgRGF0YXNldENhdGFsb2cgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBwYWRkaW5nOiAwICR7ZGdTZXR0aW5ncy5zaWRlUGFkZGluZ307XG5gO1xuXG5leHBvcnQgY29uc3QgRGF0YXNldE1vZGFsVGFiID0gc3R5bGVkLmRpdmBcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkICR7cHJvcHMgPT4gKHByb3BzLmFjdGl2ZSA/ICdibGFjaycgOiAndHJhbnNwYXJlbnQnKX07XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgZGlzcGxheTogZmxleDtcbiAgaGVpZ2h0OiAzNXB4O1xuICBtYXJnaW46IDAgM3B4O1xuICBwYWRkaW5nOiAwIDVweDtcblxuICA6Zmlyc3QtY2hpbGQge1xuICAgIG1hcmdpbi1sZWZ0OiAwO1xuICAgIHBhZGRpbmctbGVmdDogMDtcbiAgfVxuYDtcblxuY29uc3QgRGF0YXNldE5hbWUgPSBzdHlsZWQuZGl2YFxuICBmb250LXdlaWdodDogNTAwO1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50aXRsZUNvbG9yTFR9O1xuYDtcblxuY29uc3QgRGF0YXNldENvbG9ySWNvbiA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgbWFyZ2luLXJpZ2h0OiAyMHB4O1xuICBoZWlnaHQ6IDEwcHg7XG4gIHdpZHRoOiAxMHB4O1xuICBiYWNrZ3JvdW5kOiByZ2IoJHtwcm9wcyA9PiBwcm9wcy5jb2xvci5qb2luKCcsJyl9KTtcbmA7XG5cbmV4cG9ydCBjb25zdCBEYXRhc2V0VGFicyA9ICh7YWN0aXZlRGF0YXNldCwgZGF0YXNldHMsIHNob3dEYXRhc2V0VGFibGV9KSA9PiAoXG4gIDxEYXRhc2V0Q2F0YWxvZyBjbGFzc05hbWU9XCJkYXRhc2V0LW1vZGFsLWNhdGFsb2dcIj5cbiAgICB7T2JqZWN0LnZhbHVlcyhkYXRhc2V0cykubWFwKGRhdGFzZXQgPT4gKFxuICAgICAgPERhdGFzZXRNb2RhbFRhYlxuICAgICAgICBjbGFzc05hbWU9XCJkYXRhc2V0LW1vZGFsLXRhYlwiXG4gICAgICAgIGFjdGl2ZT17ZGF0YXNldCA9PT0gYWN0aXZlRGF0YXNldH1cbiAgICAgICAga2V5PXtkYXRhc2V0LmlkfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBzaG93RGF0YXNldFRhYmxlKGRhdGFzZXQuaWQpfVxuICAgICAgPlxuICAgICAgICA8RGF0YXNldENvbG9ySWNvbiBjbGFzc05hbWU9XCJpbmRpY2F0b3JcIiBjb2xvcj17ZGF0YXNldC5jb2xvcn0gLz5cbiAgICAgICAgPERhdGFzZXROYW1lIGNsYXNzTmFtZT1cImRhdGFzZXQtbmFtZVwiPntkYXRhc2V0LmxhYmVsfTwvRGF0YXNldE5hbWU+XG4gICAgICA8L0RhdGFzZXRNb2RhbFRhYj5cbiAgICApKX1cbiAgPC9EYXRhc2V0Q2F0YWxvZz5cbik7XG4iXX0=