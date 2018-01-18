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

var ReactDataGrid = null;
// const ReactDataGrid = window.navigator ? require('react-data-grid') : null;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbW9kYWxzL2RhdGEtdGFibGUtbW9kYWwuanMiXSwibmFtZXMiOlsiUmVhY3REYXRhR3JpZCIsInNob3VsZFByZXZlbnRTY3JvbGxCYWNrIiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwiaXNNYWMiLCJtYXRjaCIsImlzX2Nocm9tZSIsImluZGV4T2YiLCJpc19zYWZhcmkiLCJpc19maXJlZm94IiwiZGdTZXR0aW5ncyIsInNpZGVQYWRkaW5nIiwiRGF0YUdyaWRXcmFwcGVyIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsInBhbmVsQm9yZGVyTFQiLCJwYW5lbEJhY2tncm91bmRMVCIsInRpdGxlQ29sb3JMVCIsImxhYmVsQ29sb3JMVCIsIm1vZGFsU2Nyb2xsQmFyIiwiQm9vbGVhbkZvcm1hdHRlciIsInZhbHVlIiwiU3RyaW5nIiwiRGF0YVRhYmxlTW9kYWwiLCJfb25Nb3VzZVdoZWVsIiwiZSIsImNhbnZhcyIsInJlZnMiLCJyb290IiwicXVlcnlTZWxlY3RvciIsInByZXZlbnRfbGVmdCIsImRlbHRhWCIsInNjcm9sbExlZnQiLCJwcmV2ZW50X3VwIiwiZGVsdGFZIiwic2Nyb2xsVG9wIiwicHJldmVudERlZmF1bHQiLCJyZW5kZXIiLCJkYXRhc2V0cyIsImRhdGFJZCIsInNob3dEYXRhc2V0VGFibGUiLCJhY3RpdmVEYXRhc2V0Iiwicm93cyIsImRhdGEiLCJjb2x1bW5zIiwiZmllbGRzIiwibWFwIiwiZmllbGQiLCJpIiwia2V5IiwiaGVhZGVyUmVuZGVyZXIiLCJyZXNpemFibGUiLCJmb3JtYXR0ZXIiLCJ0eXBlIiwiYm9vbGVhbiIsInVuZGVmaW5lZCIsImZpbHRlciIsIm5hbWUiLCJvdmVyZmxvdyIsIndpZHRoIiwiaGVpZ2h0IiwibGVuZ3RoIiwidGFnQ29udGFpbmVyU3R5bGUiLCJkaXNwbGF5IiwiZmxleERpcmVjdGlvbiIsImp1c3RpZnlDb250ZW50IiwiRmllbGRIZWFkZXIiLCJhbGlnbkl0ZW1zIiwibWFyZ2luUmlnaHQiLCJtYXJnaW5MZWZ0IiwiRGF0YXNldENhdGFsb2ciLCJEYXRhc2V0TW9kYWxUYWIiLCJhY3RpdmUiLCJEYXRhc2V0TmFtZSIsIkRhdGFzZXRDb2xvckljb24iLCJjb2xvciIsImpvaW4iLCJEYXRhc2V0VGFicyIsIk9iamVjdCIsInZhbHVlcyIsImRhdGFzZXQiLCJpZCIsImxhYmVsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0EsSUFBTUEsZ0JBQWdCLElBQXRCO0FBQ0E7O0FBRUEsSUFBSUMsMEJBQTBCLEtBQTlCOztBQUVBLElBQUksaUJBQU9DLFNBQVAsSUFBb0IsaUJBQU9BLFNBQVAsQ0FBaUJDLFNBQXpDLEVBQW9EO0FBQ3BEO0FBQ0E7QUFDRSxNQUFNQyxRQUFRRixVQUFVQyxTQUFWLENBQW9CRSxLQUFwQixDQUEwQixXQUExQixDQUFkO0FBQ0EsTUFBTUMsWUFBWUosVUFBVUMsU0FBVixDQUFvQkksT0FBcEIsQ0FBNEIsUUFBNUIsSUFBd0MsQ0FBQyxDQUEzRDtBQUNBLE1BQU1DLFlBQVlOLFVBQVVDLFNBQVYsQ0FBb0JJLE9BQXBCLENBQTRCLFFBQTVCLElBQXdDLENBQUMsQ0FBM0Q7QUFDQSxNQUFNRSxhQUFhUCxVQUFVQyxTQUFWLENBQW9CSSxPQUFwQixDQUE0QixTQUE1QixJQUF5QyxDQUFDLENBQTdEOztBQUVGO0FBQ0VOLDRCQUEwQkcsVUFBVUUsYUFBYUUsU0FBYixJQUEwQkMsVUFBcEMsQ0FBMUI7QUFDRDs7QUFFRCxJQUFNQyxhQUFhO0FBQ2pCQyxlQUFhO0FBREksQ0FBbkI7O0FBSUEsSUFBTUMsa0JBQWtCLDJCQUFPQyxHQUF6QixrQkFXZTtBQUFBLFNBQVNDLE1BQU1DLEtBQU4sQ0FBWUMsYUFBckI7QUFBQSxDQVhmLEVBa0JZO0FBQUEsU0FBU0YsTUFBTUMsS0FBTixDQUFZRSxpQkFBckI7QUFB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QUFkQSxXQUFjO0FBQUEsTUFBRXBDLGFBQUYsU0FBRUEsYUFBRjtBQUFBLE1BQWlCSCxRQUFqQixTQUFpQkEsUUFBakI7QUFBQSxNQUEyQkUsZ0JBQTNCLFNBQTJCQSxnQkFBM0I7QUFBQSxTQUN6QjtBQUFDLGtCQUFEO0FBQUEsTUFBZ0IsV0FBVSx1QkFBMUI7QUFDR3NDLFdBQU9DLE1BQVAsQ0FBY3pDLFFBQWQsRUFBd0JRLEdBQXhCLENBQTRCO0FBQUEsYUFDM0I7QUFBQyx1QkFBRDtBQUFBO0FBQ0UscUJBQVUsbUJBRFo7QUFFRSxrQkFBUWtDLFlBQVl2QyxhQUZ0QjtBQUdFLGVBQUt1QyxRQUFRQyxFQUhmO0FBSUUsbUJBQVM7QUFBQSxtQkFBTXpDLGlCQUFpQndDLFFBQVFDLEVBQXpCLENBQU47QUFBQTtBQUpYO0FBTUUsc0NBQUMsZ0JBQUQsSUFBa0IsV0FBVSxXQUE1QixFQUF3QyxPQUFPRCxRQUFRTCxLQUF2RCxHQU5GO0FBT0U7QUFBQyxxQkFBRDtBQUFBLFlBQWEsV0FBVSxjQUF2QjtBQUF1Q0ssa0JBQVFFO0FBQS9DO0FBUEYsT0FEMkI7QUFBQSxLQUE1QjtBQURILEdBRHlCO0FBQUEsQ0FBcEIiLCJmaWxlIjoiZGF0YS10YWJsZS1tb2RhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgd2luZG93IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuXG5pbXBvcnQge0FMTF9GSUVMRF9UWVBFU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IEZpZWxkVG9rZW4gZnJvbSAnY29tcG9uZW50cy9jb21tb24vZmllbGQtdG9rZW4nO1xuaW1wb3J0IHtDbG9ja30gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuY29uc3QgUmVhY3REYXRhR3JpZCA9IG51bGw7XG4vLyBjb25zdCBSZWFjdERhdGFHcmlkID0gd2luZG93Lm5hdmlnYXRvciA/IHJlcXVpcmUoJ3JlYWN0LWRhdGEtZ3JpZCcpIDogbnVsbDtcblxubGV0IHNob3VsZFByZXZlbnRTY3JvbGxCYWNrID0gZmFsc2U7XG5cbmlmICh3aW5kb3cubmF2aWdhdG9yICYmIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KSB7XG4vLyBEZXRlY3QgYnJvd3NlcnNcbi8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTg5OTc4My9kZXRlY3Qtc2FmYXJpLXVzaW5nLWpxdWVyeVxuICBjb25zdCBpc01hYyA9IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL01hY2ludG9zaC8pO1xuICBjb25zdCBpc19jaHJvbWUgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0Nocm9tZScpID4gLTE7XG4gIGNvbnN0IGlzX3NhZmFyaSA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIlNhZmFyaVwiKSA+IC0xO1xuICBjb25zdCBpc19maXJlZm94ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdGaXJlZm94JykgPiAtMTtcblxuLy8gcHJldmVudCBjaHJvbWUgc2Nyb2xsIGJhY2tcbiAgc2hvdWxkUHJldmVudFNjcm9sbEJhY2sgPSBpc01hYyAmJiAoaXNfY2hyb21lIHx8IGlzX3NhZmFyaSB8fCBpc19maXJlZm94KTtcbn1cblxuY29uc3QgZGdTZXR0aW5ncyA9IHtcbiAgc2lkZVBhZGRpbmc6ICczOHB4J1xufTtcblxuY29uc3QgRGF0YUdyaWRXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgLnJlYWN0LWdyaWQtTWFpbiB7XG4gICAgb3V0bGluZTogMDtcbiAgfVxuXG4gIC5yZWFjdC1ncmlkLUdyaWQge1xuICAgIGJvcmRlcjogMDtcbiAgfVxuXG4gIC5yZWFjdC1ncmlkLUNlbGwge1xuICAgIGJvcmRlci1yaWdodDogMDtcbiAgICBib3JkZXItYm90dG9tOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQm9yZGVyTFR9O1xuICAgIHBhZGRpbmctbGVmdDogMTZweDtcbiAgfVxuXG4gIC5yZWFjdC1ncmlkLUhlYWRlckNlbGwge1xuICAgIGJvcmRlci1yaWdodDogMDtcbiAgICBib3JkZXItYm90dG9tOiAwO1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxCYWNrZ3JvdW5kTFR9O1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRpdGxlQ29sb3JMVH07XG4gICAgcGFkZGluZzogMTRweCA4cHggMTRweCAwO1xuICB9XG4gIC5yZWFjdC1ncmlkLUNlbGw6Zmlyc3QtY2hpbGQsXG4gIC5yZWFjdC1ncmlkLUhlYWRlckNlbGw6Zmlyc3QtY2hpbGQge1xuICAgIHBhZGRpbmctbGVmdDogJHtkZ1NldHRpbmdzLnNpZGVQYWRkaW5nfTtcbiAgfVxuICAucmVhY3QtZ3JpZC1DZWxsOmxhc3QtY2hpbGQsXG4gIC5yZWFjdC1ncmlkLUhlYWRlckNlbGw6bGFzdC1jaGlsZCB7XG4gICAgcGFkZGluZy1yaWdodDogJHtkZ1NldHRpbmdzLnNpZGVQYWRkaW5nfTtcbiAgfVxuICAucmVhY3QtZ3JpZC1DZWxsX192YWx1ZSB7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvckxUfTtcbiAgfVxuICAucmVhY3QtZ3JpZC1DYW52YXMge1xuICAgICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubW9kYWxTY3JvbGxCYXJ9O1xuICB9XG5gO1xuXG5jb25zdCBCb29sZWFuRm9ybWF0dGVyID0gKHt2YWx1ZX0pID0+IDxzcGFuPntTdHJpbmcodmFsdWUpfTwvc3Bhbj47XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERhdGFUYWJsZU1vZGFsIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgX29uTW91c2VXaGVlbCA9IChlKSA9PiB7XG4gICAgLy8gUHJldmVudCBmdXRpbGUgc2Nyb2xsLCB3aGljaCB3b3VsZCB0cmlnZ2VyIHRoZSBCYWNrL05leHQgcGFnZSBldmVudFxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNoby9qUXVlcnkucHJldmVudE1hY0JhY2tTY3JvbGxcbiAgICAvLyBUaGlzIHByZXZlbnRzIHNjcm9sbCB3aGVuIHJlYWNoaW5nIHRoZSB0b3Btb3N0IG9yIGxlZnRtb3N0XG4gICAgLy8gcG9zaXRpb25zIG9mIGEgY29udGFpbmVyLlxuXG4gICAgLy8gcmVhY3QtZGF0YS1ncmlkIGNhbnZhcyBlbGVtZW50IGNhbiBiZSBzY3JvbGxlZFxuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMucmVmcy5yb290LnF1ZXJ5U2VsZWN0b3IoJy5yZWFjdC1ncmlkLUNhbnZhcycpO1xuXG4gICAgLy8gSWYgY2FudmFzIGNhbiBub3QgYmUgc2Nyb2xsZWQgbGVmdCBhbnltb3JlIHdoZW4gd2UgdHJ5IHRvIHNjcm9sbCBsZWZ0XG4gICAgY29uc3QgcHJldmVudF9sZWZ0ID0gZS5kZWx0YVggPCAwICYmIGNhbnZhcy5zY3JvbGxMZWZ0IDw9IDA7XG4gICAgLy8gSWYgY2FudmFzIGNhbiBub3QgYmUgc2Nyb2xsZWQgdXAgd2hlbiB3ZSB0cnkgdG8gc2Nyb2xsIHVwXG4gICAgY29uc3QgcHJldmVudF91cCA9IGUuZGVsdGFZIDwgMCAmJiBjYW52YXMuc2Nyb2xsVG9wIDw9IDA7XG5cbiAgICBpZiAocHJldmVudF9sZWZ0IHx8IHByZXZlbnRfdXApIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2RhdGFzZXRzLCBkYXRhSWQsIHNob3dEYXRhc2V0VGFibGV9ID0gdGhpcy5wcm9wcztcblxuICAgIGlmICghZGF0YXNldHMgfHwgIWRhdGFJZCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgYWN0aXZlRGF0YXNldCA9IGRhdGFzZXRzW2RhdGFJZF07XG4gICAgY29uc3Qgcm93cyA9IGFjdGl2ZURhdGFzZXQuZGF0YTtcbiAgICBjb25zdCBjb2x1bW5zID0gYWN0aXZlRGF0YXNldC5maWVsZHNcbiAgICAgIC5tYXAoKGZpZWxkLCBpKSA9PiAoe1xuICAgICAgICAuLi5maWVsZCxcbiAgICAgICAga2V5OiBpLFxuICAgICAgICBoZWFkZXJSZW5kZXJlcjogPEZpZWxkSGVhZGVyIHsuLi5maWVsZH0gLz4sXG4gICAgICAgIHJlc2l6YWJsZTogdHJ1ZSxcbiAgICAgICAgZm9ybWF0dGVyOlxuICAgICAgICAgIGZpZWxkLnR5cGUgPT09IEFMTF9GSUVMRF9UWVBFUy5ib29sZWFuID8gQm9vbGVhbkZvcm1hdHRlciA6IHVuZGVmaW5lZFxuICAgICAgfSkpXG4gICAgICAuZmlsdGVyKCh7bmFtZX0pID0+IG5hbWUgIT09ICdfZ2VvanNvbicpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgcmVmPVwicm9vdFwiIGNsYXNzTmFtZT1cImRhdGFzZXQtbW9kYWxcIiBzdHlsZT17e292ZXJmbG93OiAnb3ZlcmxheSd9fT5cbiAgICAgICAgPERhdGFzZXRUYWJzXG4gICAgICAgICAgYWN0aXZlRGF0YXNldD17YWN0aXZlRGF0YXNldH1cbiAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgc2hvd0RhdGFzZXRUYWJsZT17c2hvd0RhdGFzZXRUYWJsZX1cbiAgICAgICAgLz5cbiAgICAgICAgPERhdGFHcmlkV3JhcHBlclxuICAgICAgICAgIG9uV2hlZWw9e1xuICAgICAgICAgICAgc2hvdWxkUHJldmVudFNjcm9sbEJhY2sgPyB0aGlzLl9vbk1vdXNlV2hlZWwgOiBudWxsXG4gICAgICAgICAgfVxuICAgICAgICA+XG4gICAgICAgICAge1JlYWN0RGF0YUdyaWQgPyA8UmVhY3REYXRhR3JpZFxuICAgICAgICAgICAgaGVhZGVyUm93SGVpZ2h0PXs3Mn1cbiAgICAgICAgICAgIGNvbHVtbnM9e2NvbHVtbnN9XG4gICAgICAgICAgICBtaW5Db2x1bW5XaWR0aD17MTcyfVxuICAgICAgICAgICAgbWluV2lkdGg9e3RoaXMucHJvcHMud2lkdGh9XG4gICAgICAgICAgICBtaW5IZWlnaHQ9e3RoaXMucHJvcHMuaGVpZ2h0IC0gNjV9XG4gICAgICAgICAgICByb3dHZXR0ZXI9e2kgPT4gcm93c1tpXX1cbiAgICAgICAgICAgIHJvd0hlaWdodD17NDh9XG4gICAgICAgICAgICByb3dzQ291bnQ9e3Jvd3MubGVuZ3RofVxuICAgICAgICAgIC8+IDogbnVsbH1cbiAgICAgICAgPC9EYXRhR3JpZFdyYXBwZXI+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmNvbnN0IHRhZ0NvbnRhaW5lclN0eWxlID0ge1xuICBkaXNwbGF5OiAnZmxleCcsXG4gIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nXG59O1xuXG5jb25zdCBGaWVsZEhlYWRlciA9ICh7bmFtZSwgdHlwZX0pID0+IChcbiAgPGRpdiBzdHlsZT17dGFnQ29udGFpbmVyU3R5bGV9PlxuICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInfX0+XG4gICAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luUmlnaHQ6IHR5cGUgPT09ICd0aW1lc3RhbXAnID8gJzJweCcgOiAnMThweCcsIGhlaWdodDogJzE2cHgnfX0+XG4gICAgICAgIHt0eXBlID09PSAndGltZXN0YW1wJyA/IDxDbG9jayBoZWlnaHQ9XCIxNnB4XCIvPiA6IG51bGx9PC9kaXY+XG4gICAgICAgIHtuYW1lfVxuICAgIDwvZGl2PlxuICAgIDxkaXYgc3R5bGU9e3ttYXJnaW5MZWZ0OiAnMThweCd9fT5cbiAgICAgIDxGaWVsZFRva2VuIHR5cGU9e3R5cGV9Lz5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4pO1xuXG5jb25zdCBEYXRhc2V0Q2F0YWxvZyA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBhZGRpbmc6IDAgJHtkZ1NldHRpbmdzLnNpZGVQYWRkaW5nfTtcbmA7XG5cbmV4cG9ydCBjb25zdCBEYXRhc2V0TW9kYWxUYWIgPSBzdHlsZWQuZGl2YFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBib3JkZXItYm90dG9tOiAzcHggc29saWQgJHtwcm9wcyA9PiAocHJvcHMuYWN0aXZlID8gJ2JsYWNrJyA6ICd0cmFuc3BhcmVudCcpfTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBkaXNwbGF5OiBmbGV4O1xuICBoZWlnaHQ6IDM1cHg7XG4gIG1hcmdpbjogMCAzcHg7XG4gIHBhZGRpbmc6IDAgNXB4O1xuXG4gIDpmaXJzdC1jaGlsZCB7XG4gICAgbWFyZ2luLWxlZnQ6IDA7XG4gICAgcGFkZGluZy1sZWZ0OiAwO1xuICB9XG5gO1xuXG5jb25zdCBEYXRhc2V0TmFtZSA9IHN0eWxlZC5kaXZgXG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRpdGxlQ29sb3JMVH07XG5gO1xuXG5jb25zdCBEYXRhc2V0Q29sb3JJY29uID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBtYXJnaW4tcmlnaHQ6IDIwcHg7XG4gIGhlaWdodDogMTBweDtcbiAgd2lkdGg6IDEwcHg7XG4gIGJhY2tncm91bmQ6IHJnYigke3Byb3BzID0+IHByb3BzLmNvbG9yLmpvaW4oJywnKX0pO1xuYDtcblxuZXhwb3J0IGNvbnN0IERhdGFzZXRUYWJzID0gKHthY3RpdmVEYXRhc2V0LCBkYXRhc2V0cywgc2hvd0RhdGFzZXRUYWJsZX0pID0+IChcbiAgPERhdGFzZXRDYXRhbG9nIGNsYXNzTmFtZT1cImRhdGFzZXQtbW9kYWwtY2F0YWxvZ1wiPlxuICAgIHtPYmplY3QudmFsdWVzKGRhdGFzZXRzKS5tYXAoZGF0YXNldCA9PiAoXG4gICAgICA8RGF0YXNldE1vZGFsVGFiXG4gICAgICAgIGNsYXNzTmFtZT1cImRhdGFzZXQtbW9kYWwtdGFiXCJcbiAgICAgICAgYWN0aXZlPXtkYXRhc2V0ID09PSBhY3RpdmVEYXRhc2V0fVxuICAgICAgICBrZXk9e2RhdGFzZXQuaWR9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHNob3dEYXRhc2V0VGFibGUoZGF0YXNldC5pZCl9XG4gICAgICA+XG4gICAgICAgIDxEYXRhc2V0Q29sb3JJY29uIGNsYXNzTmFtZT1cImluZGljYXRvclwiIGNvbG9yPXtkYXRhc2V0LmNvbG9yfSAvPlxuICAgICAgICA8RGF0YXNldE5hbWUgY2xhc3NOYW1lPVwiZGF0YXNldC1uYW1lXCI+e2RhdGFzZXQubGFiZWx9PC9EYXRhc2V0TmFtZT5cbiAgICAgIDwvRGF0YXNldE1vZGFsVGFiPlxuICAgICkpfVxuICA8L0RhdGFzZXRDYXRhbG9nPlxuKTtcbiJdfQ==