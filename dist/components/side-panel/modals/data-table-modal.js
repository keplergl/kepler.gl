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
  // Detect browsers
  // http://stackoverflow.com/questions/5899783/detect-safari-using-jquery
  var isMac = navigator.userAgent.match(/Macintosh/);
  var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
  var is_safari = navigator.userAgent.indexOf("Safari") > -1;
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
        { style: { marginRight: type === 'timestamp' ? '2px' : '18px', height: '16px' } },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbW9kYWxzL2RhdGEtdGFibGUtbW9kYWwuanMiXSwibmFtZXMiOlsiUmVhY3REYXRhR3JpZCIsIm5hdmlnYXRvciIsInJlcXVpcmUiLCJzaG91bGRQcmV2ZW50U2Nyb2xsQmFjayIsInVzZXJBZ2VudCIsImlzTWFjIiwibWF0Y2giLCJpc19jaHJvbWUiLCJpbmRleE9mIiwiaXNfc2FmYXJpIiwiaXNfZmlyZWZveCIsImRnU2V0dGluZ3MiLCJzaWRlUGFkZGluZyIsIkRhdGFHcmlkV3JhcHBlciIsImRpdiIsInByb3BzIiwidGhlbWUiLCJwYW5lbEJvcmRlckxUIiwicGFuZWxCYWNrZ3JvdW5kTFQiLCJ0aXRsZUNvbG9yTFQiLCJsYWJlbENvbG9yTFQiLCJtb2RhbFNjcm9sbEJhciIsIkJvb2xlYW5Gb3JtYXR0ZXIiLCJ2YWx1ZSIsIlN0cmluZyIsIkRhdGFUYWJsZU1vZGFsIiwiX29uTW91c2VXaGVlbCIsImUiLCJjYW52YXMiLCJyZWZzIiwicm9vdCIsInF1ZXJ5U2VsZWN0b3IiLCJwcmV2ZW50X2xlZnQiLCJkZWx0YVgiLCJzY3JvbGxMZWZ0IiwicHJldmVudF91cCIsImRlbHRhWSIsInNjcm9sbFRvcCIsInByZXZlbnREZWZhdWx0IiwicmVuZGVyIiwiZGF0YXNldHMiLCJkYXRhSWQiLCJzaG93RGF0YXNldFRhYmxlIiwiYWN0aXZlRGF0YXNldCIsInJvd3MiLCJkYXRhIiwiY29sdW1ucyIsImZpZWxkcyIsIm1hcCIsImZpZWxkIiwiaSIsImtleSIsImhlYWRlclJlbmRlcmVyIiwicmVzaXphYmxlIiwiZm9ybWF0dGVyIiwidHlwZSIsImJvb2xlYW4iLCJ1bmRlZmluZWQiLCJmaWx0ZXIiLCJuYW1lIiwib3ZlcmZsb3ciLCJ3aWR0aCIsImhlaWdodCIsImxlbmd0aCIsInRhZ0NvbnRhaW5lclN0eWxlIiwiZGlzcGxheSIsImZsZXhEaXJlY3Rpb24iLCJqdXN0aWZ5Q29udGVudCIsIkZpZWxkSGVhZGVyIiwiYWxpZ25JdGVtcyIsIm1hcmdpblJpZ2h0IiwibWFyZ2luTGVmdCIsIkRhdGFzZXRDYXRhbG9nIiwiRGF0YXNldE1vZGFsVGFiIiwiYWN0aXZlIiwiRGF0YXNldE5hbWUiLCJEYXRhc2V0Q29sb3JJY29uIiwiY29sb3IiLCJqb2luIiwiRGF0YXNldFRhYnMiLCJPYmplY3QiLCJ2YWx1ZXMiLCJkYXRhc2V0IiwiaWQiLCJsYWJlbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBLElBQU1BLGdCQUFnQixpQkFBT0MsU0FBUCxHQUFtQkMsUUFBUSxpQkFBUixDQUFuQixHQUFnRCxJQUF0RTs7QUFFQSxJQUFJQywwQkFBMEIsS0FBOUI7O0FBRUEsSUFBSSxpQkFBT0YsU0FBUCxJQUFvQixpQkFBT0EsU0FBUCxDQUFpQkcsU0FBekMsRUFBb0Q7QUFDcEQ7QUFDQTtBQUNFLE1BQU1DLFFBQVFKLFVBQVVHLFNBQVYsQ0FBb0JFLEtBQXBCLENBQTBCLFdBQTFCLENBQWQ7QUFDQSxNQUFNQyxZQUFZTixVQUFVRyxTQUFWLENBQW9CSSxPQUFwQixDQUE0QixRQUE1QixJQUF3QyxDQUFDLENBQTNEO0FBQ0EsTUFBTUMsWUFBWVIsVUFBVUcsU0FBVixDQUFvQkksT0FBcEIsQ0FBNEIsUUFBNUIsSUFBd0MsQ0FBQyxDQUEzRDtBQUNBLE1BQU1FLGFBQWFULFVBQVVHLFNBQVYsQ0FBb0JJLE9BQXBCLENBQTRCLFNBQTVCLElBQXlDLENBQUMsQ0FBN0Q7O0FBRUY7QUFDRUwsNEJBQTBCRSxVQUFVRSxhQUFhRSxTQUFiLElBQTBCQyxVQUFwQyxDQUExQjtBQUNEOztBQUVELElBQU1DLGFBQWE7QUFDakJDLGVBQWE7QUFESSxDQUFuQjs7QUFJQSxJQUFNQyxrQkFBa0IsMkJBQU9DLEdBQXpCLGtCQVdlO0FBQUEsU0FBU0MsTUFBTUMsS0FBTixDQUFZQyxhQUFyQjtBQUFBLENB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QixHQUFqQixDQUFUO0FBQUEsQ0FMZCxDQUFOOztBQVFPLElBQU1DLG9DQUFjLFNBQWRBLFdBQWM7QUFBQSxNQUFFcEMsYUFBRixTQUFFQSxhQUFGO0FBQUEsTUFBaUJILFFBQWpCLFNBQWlCQSxRQUFqQjtBQUFBLE1BQTJCRSxnQkFBM0IsU0FBMkJBLGdCQUEzQjtBQUFBLFNBQ3pCO0FBQUMsa0JBQUQ7QUFBQSxNQUFnQixXQUFVLHVCQUExQjtBQUNHc0MsV0FBT0MsTUFBUCxDQUFjekMsUUFBZCxFQUF3QlEsR0FBeEIsQ0FBNEI7QUFBQSxhQUMzQjtBQUFDLHVCQUFEO0FBQUE7QUFDRSxxQkFBVSxtQkFEWjtBQUVFLGtCQUFRa0MsWUFBWXZDLGFBRnRCO0FBR0UsZUFBS3VDLFFBQVFDLEVBSGY7QUFJRSxtQkFBUztBQUFBLG1CQUFNekMsaUJBQWlCd0MsUUFBUUMsRUFBekIsQ0FBTjtBQUFBO0FBSlg7QUFNRSxzQ0FBQyxnQkFBRCxJQUFrQixXQUFVLFdBQTVCLEVBQXdDLE9BQU9ELFFBQVFMLEtBQXZELEdBTkY7QUFPRTtBQUFDLHFCQUFEO0FBQUEsWUFBYSxXQUFVLGNBQXZCO0FBQXVDSyxrQkFBUUU7QUFBL0M7QUFQRixPQUQyQjtBQUFBLEtBQTVCO0FBREgsR0FEeUI7QUFBQSxDQUFwQiIsImZpbGUiOiJkYXRhLXRhYmxlLW1vZGFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5cbmltcG9ydCB7QUxMX0ZJRUxEX1RZUEVTfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQgRmllbGRUb2tlbiBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9maWVsZC10b2tlbic7XG5pbXBvcnQge0Nsb2NrfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5jb25zdCBSZWFjdERhdGFHcmlkID0gd2luZG93Lm5hdmlnYXRvciA/IHJlcXVpcmUoJ3JlYWN0LWRhdGEtZ3JpZCcpIDogbnVsbDtcblxubGV0IHNob3VsZFByZXZlbnRTY3JvbGxCYWNrID0gZmFsc2U7XG5cbmlmICh3aW5kb3cubmF2aWdhdG9yICYmIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KSB7XG4vLyBEZXRlY3QgYnJvd3NlcnNcbi8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTg5OTc4My9kZXRlY3Qtc2FmYXJpLXVzaW5nLWpxdWVyeVxuICBjb25zdCBpc01hYyA9IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL01hY2ludG9zaC8pO1xuICBjb25zdCBpc19jaHJvbWUgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0Nocm9tZScpID4gLTE7XG4gIGNvbnN0IGlzX3NhZmFyaSA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIlNhZmFyaVwiKSA+IC0xO1xuICBjb25zdCBpc19maXJlZm94ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdGaXJlZm94JykgPiAtMTtcblxuLy8gcHJldmVudCBjaHJvbWUgc2Nyb2xsIGJhY2tcbiAgc2hvdWxkUHJldmVudFNjcm9sbEJhY2sgPSBpc01hYyAmJiAoaXNfY2hyb21lIHx8IGlzX3NhZmFyaSB8fCBpc19maXJlZm94KTtcbn1cblxuY29uc3QgZGdTZXR0aW5ncyA9IHtcbiAgc2lkZVBhZGRpbmc6ICczOHB4J1xufTtcblxuY29uc3QgRGF0YUdyaWRXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgLnJlYWN0LWdyaWQtTWFpbiB7XG4gICAgb3V0bGluZTogMDtcbiAgfVxuXG4gIC5yZWFjdC1ncmlkLUdyaWQge1xuICAgIGJvcmRlcjogMDtcbiAgfVxuXG4gIC5yZWFjdC1ncmlkLUNlbGwge1xuICAgIGJvcmRlci1yaWdodDogMDtcbiAgICBib3JkZXItYm90dG9tOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQm9yZGVyTFR9O1xuICAgIHBhZGRpbmctbGVmdDogMTZweDtcbiAgfVxuXG4gIC5yZWFjdC1ncmlkLUhlYWRlckNlbGwge1xuICAgIGJvcmRlci1yaWdodDogMDtcbiAgICBib3JkZXItYm90dG9tOiAwO1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxCYWNrZ3JvdW5kTFR9O1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRpdGxlQ29sb3JMVH07XG4gICAgcGFkZGluZzogMTRweCA4cHggMTRweCAwO1xuICB9XG4gIC5yZWFjdC1ncmlkLUNlbGw6Zmlyc3QtY2hpbGQsXG4gIC5yZWFjdC1ncmlkLUhlYWRlckNlbGw6Zmlyc3QtY2hpbGQge1xuICAgIHBhZGRpbmctbGVmdDogJHtkZ1NldHRpbmdzLnNpZGVQYWRkaW5nfTtcbiAgfVxuICAucmVhY3QtZ3JpZC1DZWxsOmxhc3QtY2hpbGQsXG4gIC5yZWFjdC1ncmlkLUhlYWRlckNlbGw6bGFzdC1jaGlsZCB7XG4gICAgcGFkZGluZy1yaWdodDogJHtkZ1NldHRpbmdzLnNpZGVQYWRkaW5nfTtcbiAgfVxuICAucmVhY3QtZ3JpZC1DZWxsX192YWx1ZSB7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvckxUfTtcbiAgfVxuICAucmVhY3QtZ3JpZC1DYW52YXMge1xuICAgICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubW9kYWxTY3JvbGxCYXJ9O1xuICB9XG5gO1xuXG5jb25zdCBCb29sZWFuRm9ybWF0dGVyID0gKHt2YWx1ZX0pID0+IDxzcGFuPntTdHJpbmcodmFsdWUpfTwvc3Bhbj47XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERhdGFUYWJsZU1vZGFsIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgX29uTW91c2VXaGVlbCA9IChlKSA9PiB7XG4gICAgLy8gUHJldmVudCBmdXRpbGUgc2Nyb2xsLCB3aGljaCB3b3VsZCB0cmlnZ2VyIHRoZSBCYWNrL05leHQgcGFnZSBldmVudFxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNoby9qUXVlcnkucHJldmVudE1hY0JhY2tTY3JvbGxcbiAgICAvLyBUaGlzIHByZXZlbnRzIHNjcm9sbCB3aGVuIHJlYWNoaW5nIHRoZSB0b3Btb3N0IG9yIGxlZnRtb3N0XG4gICAgLy8gcG9zaXRpb25zIG9mIGEgY29udGFpbmVyLlxuXG4gICAgLy8gcmVhY3QtZGF0YS1ncmlkIGNhbnZhcyBlbGVtZW50IGNhbiBiZSBzY3JvbGxlZFxuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMucmVmcy5yb290LnF1ZXJ5U2VsZWN0b3IoJy5yZWFjdC1ncmlkLUNhbnZhcycpO1xuXG4gICAgLy8gSWYgY2FudmFzIGNhbiBub3QgYmUgc2Nyb2xsZWQgbGVmdCBhbnltb3JlIHdoZW4gd2UgdHJ5IHRvIHNjcm9sbCBsZWZ0XG4gICAgY29uc3QgcHJldmVudF9sZWZ0ID0gZS5kZWx0YVggPCAwICYmIGNhbnZhcy5zY3JvbGxMZWZ0IDw9IDA7XG4gICAgLy8gSWYgY2FudmFzIGNhbiBub3QgYmUgc2Nyb2xsZWQgdXAgd2hlbiB3ZSB0cnkgdG8gc2Nyb2xsIHVwXG4gICAgY29uc3QgcHJldmVudF91cCA9IGUuZGVsdGFZIDwgMCAmJiBjYW52YXMuc2Nyb2xsVG9wIDw9IDA7XG5cbiAgICBpZiAocHJldmVudF9sZWZ0IHx8IHByZXZlbnRfdXApIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtkYXRhc2V0cywgZGF0YUlkLCBzaG93RGF0YXNldFRhYmxlfSA9IHRoaXMucHJvcHM7XG5cbiAgICBpZiAoIWRhdGFzZXRzIHx8ICFkYXRhSWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGFjdGl2ZURhdGFzZXQgPSBkYXRhc2V0c1tkYXRhSWRdO1xuICAgIGNvbnN0IHJvd3MgPSBhY3RpdmVEYXRhc2V0LmRhdGE7XG4gICAgY29uc3QgY29sdW1ucyA9IGFjdGl2ZURhdGFzZXQuZmllbGRzXG4gICAgICAubWFwKChmaWVsZCwgaSkgPT4gKHtcbiAgICAgICAgLi4uZmllbGQsXG4gICAgICAgIGtleTogaSxcbiAgICAgICAgaGVhZGVyUmVuZGVyZXI6IDxGaWVsZEhlYWRlciB7Li4uZmllbGR9IC8+LFxuICAgICAgICByZXNpemFibGU6IHRydWUsXG4gICAgICAgIGZvcm1hdHRlcjpcbiAgICAgICAgICBmaWVsZC50eXBlID09PSBBTExfRklFTERfVFlQRVMuYm9vbGVhbiA/IEJvb2xlYW5Gb3JtYXR0ZXIgOiB1bmRlZmluZWRcbiAgICAgIH0pKVxuICAgICAgLmZpbHRlcigoe25hbWV9KSA9PiBuYW1lICE9PSAnX2dlb2pzb24nKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHJlZj1cInJvb3RcIiBjbGFzc05hbWU9XCJkYXRhc2V0LW1vZGFsXCIgc3R5bGU9e3tvdmVyZmxvdzogJ292ZXJsYXknfX0+XG4gICAgICAgIDxEYXRhc2V0VGFic1xuICAgICAgICAgIGFjdGl2ZURhdGFzZXQ9e2FjdGl2ZURhdGFzZXR9XG4gICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgIHNob3dEYXRhc2V0VGFibGU9e3Nob3dEYXRhc2V0VGFibGV9XG4gICAgICAgIC8+XG4gICAgICAgIDxEYXRhR3JpZFdyYXBwZXJcbiAgICAgICAgICBvbldoZWVsPXtcbiAgICAgICAgICAgIHNob3VsZFByZXZlbnRTY3JvbGxCYWNrID8gdGhpcy5fb25Nb3VzZVdoZWVsIDogbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgPlxuICAgICAgICAgIHtSZWFjdERhdGFHcmlkID8gPFJlYWN0RGF0YUdyaWRcbiAgICAgICAgICAgIGhlYWRlclJvd0hlaWdodD17NzJ9XG4gICAgICAgICAgICBjb2x1bW5zPXtjb2x1bW5zfVxuICAgICAgICAgICAgbWluQ29sdW1uV2lkdGg9ezE3Mn1cbiAgICAgICAgICAgIG1pbldpZHRoPXt0aGlzLnByb3BzLndpZHRofVxuICAgICAgICAgICAgbWluSGVpZ2h0PXt0aGlzLnByb3BzLmhlaWdodCAtIDY1fVxuICAgICAgICAgICAgcm93R2V0dGVyPXtpID0+IHJvd3NbaV19XG4gICAgICAgICAgICByb3dIZWlnaHQ9ezQ4fVxuICAgICAgICAgICAgcm93c0NvdW50PXtyb3dzLmxlbmd0aH1cbiAgICAgICAgICAvPiA6IG51bGx9XG4gICAgICAgIDwvRGF0YUdyaWRXcmFwcGVyPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCB0YWdDb250YWluZXJTdHlsZSA9IHtcbiAgZGlzcGxheTogJ2ZsZXgnLFxuICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJ1xufTtcblxuY29uc3QgRmllbGRIZWFkZXIgPSAoe25hbWUsIHR5cGV9KSA9PiAoXG4gIDxkaXYgc3R5bGU9e3RhZ0NvbnRhaW5lclN0eWxlfT5cbiAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJ319PlxuICAgICAgPGRpdiBzdHlsZT17e21hcmdpblJpZ2h0OiB0eXBlID09PSAndGltZXN0YW1wJyA/ICcycHgnIDogJzE4cHgnLCBoZWlnaHQ6ICcxNnB4J319PlxuICAgICAgICB7dHlwZSA9PT0gJ3RpbWVzdGFtcCcgPyA8Q2xvY2sgaGVpZ2h0PVwiMTZweFwiLz4gOiBudWxsfTwvZGl2PlxuICAgICAgICB7bmFtZX1cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luTGVmdDogJzE4cHgnfX0+XG4gICAgICA8RmllbGRUb2tlbiB0eXBlPXt0eXBlfS8+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuKTtcblxuY29uc3QgRGF0YXNldENhdGFsb2cgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBwYWRkaW5nOiAwICR7ZGdTZXR0aW5ncy5zaWRlUGFkZGluZ307XG5gO1xuXG5leHBvcnQgY29uc3QgRGF0YXNldE1vZGFsVGFiID0gc3R5bGVkLmRpdmBcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkICR7cHJvcHMgPT4gKHByb3BzLmFjdGl2ZSA/ICdibGFjaycgOiAndHJhbnNwYXJlbnQnKX07XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgZGlzcGxheTogZmxleDtcbiAgaGVpZ2h0OiAzNXB4O1xuICBtYXJnaW46IDAgM3B4O1xuICBwYWRkaW5nOiAwIDVweDtcblxuICA6Zmlyc3QtY2hpbGQge1xuICAgIG1hcmdpbi1sZWZ0OiAwO1xuICAgIHBhZGRpbmctbGVmdDogMDtcbiAgfVxuYDtcblxuY29uc3QgRGF0YXNldE5hbWUgPSBzdHlsZWQuZGl2YFxuICBmb250LXdlaWdodDogNTAwO1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50aXRsZUNvbG9yTFR9O1xuYDtcblxuY29uc3QgRGF0YXNldENvbG9ySWNvbiA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgbWFyZ2luLXJpZ2h0OiAyMHB4O1xuICBoZWlnaHQ6IDEwcHg7XG4gIHdpZHRoOiAxMHB4O1xuICBiYWNrZ3JvdW5kOiByZ2IoJHtwcm9wcyA9PiBwcm9wcy5jb2xvci5qb2luKCcsJyl9KTtcbmA7XG5cbmV4cG9ydCBjb25zdCBEYXRhc2V0VGFicyA9ICh7YWN0aXZlRGF0YXNldCwgZGF0YXNldHMsIHNob3dEYXRhc2V0VGFibGV9KSA9PiAoXG4gIDxEYXRhc2V0Q2F0YWxvZyBjbGFzc05hbWU9XCJkYXRhc2V0LW1vZGFsLWNhdGFsb2dcIj5cbiAgICB7T2JqZWN0LnZhbHVlcyhkYXRhc2V0cykubWFwKGRhdGFzZXQgPT4gKFxuICAgICAgPERhdGFzZXRNb2RhbFRhYlxuICAgICAgICBjbGFzc05hbWU9XCJkYXRhc2V0LW1vZGFsLXRhYlwiXG4gICAgICAgIGFjdGl2ZT17ZGF0YXNldCA9PT0gYWN0aXZlRGF0YXNldH1cbiAgICAgICAga2V5PXtkYXRhc2V0LmlkfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBzaG93RGF0YXNldFRhYmxlKGRhdGFzZXQuaWQpfVxuICAgICAgPlxuICAgICAgICA8RGF0YXNldENvbG9ySWNvbiBjbGFzc05hbWU9XCJpbmRpY2F0b3JcIiBjb2xvcj17ZGF0YXNldC5jb2xvcn0gLz5cbiAgICAgICAgPERhdGFzZXROYW1lIGNsYXNzTmFtZT1cImRhdGFzZXQtbmFtZVwiPntkYXRhc2V0LmxhYmVsfTwvRGF0YXNldE5hbWU+XG4gICAgICA8L0RhdGFzZXRNb2RhbFRhYj5cbiAgICApKX1cbiAgPC9EYXRhc2V0Q2F0YWxvZz5cbik7XG4iXX0=