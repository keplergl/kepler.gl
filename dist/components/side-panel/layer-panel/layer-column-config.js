"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactIntl = require("react-intl");

var _fieldSelector = _interopRequireDefault(require("../../common/field-selector"));

var _reselect = require("reselect");

var _styledComponents2 = require("../../common/styled-components");

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  width: 70%;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  width: 30%;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  margin-bottom: 8px;\n  align-items: center;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  justify-content: space-between;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var TopRow = _styledComponents["default"].div(_templateObject());

var LayerColumnConfig =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(LayerColumnConfig, _Component);

  function LayerColumnConfig() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, LayerColumnConfig);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(LayerColumnConfig)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "columnPairs", function (props) {
      return props.columnPairs;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "fieldPairs", function (props) {
      return props.fieldPairs;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "fieldPairsSelector", (0, _reselect.createSelector)(_this.columnPairs, _this.fieldPairs, function (columnPairs, fieldPairs) {
      return columnPairs ? fieldPairs.map(function (fp) {
        return {
          name: fp.defaultName,
          type: 'point',
          pair: fp.pair
        };
      }) : null;
    }));
    return _this;
  }

  (0, _createClass2["default"])(LayerColumnConfig, [{
    key: "_updateColumn",
    value: function _updateColumn(key, value) {
      var _this$props = this.props,
          columnPairs = _this$props.columnPairs,
          assignColumnPairs = _this$props.assignColumnPairs,
          assignColumn = _this$props.assignColumn;
      var columns = value && value.pair && columnPairs ? assignColumnPairs(key, value.pair) : assignColumn(key, value);
      this.props.updateLayerConfig({
        columns: columns
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          columns = _this$props2.columns,
          columnLabels = _this$props2.columnLabels,
          fields = _this$props2.fields;
      var fieldPairs = this.fieldPairsSelector(this.props);
      return _react["default"].createElement("div", null, _react["default"].createElement(_styledComponents2.SidePanelSection, null, _react["default"].createElement("div", {
        className: "layer-config__column"
      }, _react["default"].createElement(TopRow, null, _react["default"].createElement(_styledComponents2.PanelLabel, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
        id: 'columns.title'
      })), _react["default"].createElement(_styledComponents2.PanelLabel, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
        id: "layer.required"
      }))), Object.keys(columns).map(function (key) {
        return _react["default"].createElement(ColumnSelector, {
          column: columns[key],
          label: columnLabels && columnLabels[key] || key,
          key: key,
          allFields: fields,
          fieldPairs: fieldPairs,
          onSelect: function onSelect(val) {
            return _this2._updateColumn(key, val);
          }
        });
      }))));
    }
  }]);
  return LayerColumnConfig;
}(_react.Component);

exports["default"] = LayerColumnConfig;
(0, _defineProperty2["default"])(LayerColumnConfig, "propTypes", {
  columns: _propTypes["default"].object.isRequired,
  fields: _propTypes["default"].arrayOf(_propTypes["default"].any).isRequired,
  assignColumnPairs: _propTypes["default"].func.isRequired,
  assignColumn: _propTypes["default"].func.isRequired,
  updateLayerConfig: _propTypes["default"].func.isRequired,
  columnPairs: _propTypes["default"].object,
  fieldPairs: _propTypes["default"].arrayOf(_propTypes["default"].any),
  columnLabels: _propTypes["default"].object
});

var ColumnRow = _styledComponents["default"].div(_templateObject2());

var ColumnName = _styledComponents["default"].div(_templateObject3());

var ColumnSelect = _styledComponents["default"].div(_templateObject4());

var ColumnSelector = function ColumnSelector(_ref) {
  var column = _ref.column,
      label = _ref.label,
      allFields = _ref.allFields,
      onSelect = _ref.onSelect,
      fieldPairs = _ref.fieldPairs;
  return _react["default"].createElement(ColumnRow, {
    className: "layer-config__column__selector"
  }, _react["default"].createElement(ColumnName, {
    className: "layer-config__column__name"
  }, _react["default"].createElement(_styledComponents2.PanelLabel, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: "columns.".concat(label)
  })), !column.optional ? _react["default"].createElement(_styledComponents2.PanelLabel, null, "  *") : null), _react["default"].createElement(ColumnSelect, {
    className: "layer-config__column__select"
  }, _react["default"].createElement(_fieldSelector["default"], {
    suggested: fieldPairs,
    error: !column.optional && !column.value,
    fields: allFields,
    value: column.value,
    erasable: Boolean(column.optional),
    onSelect: onSelect
  })));
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItY29sdW1uLWNvbmZpZy5qcyJdLCJuYW1lcyI6WyJUb3BSb3ciLCJzdHlsZWQiLCJkaXYiLCJMYXllckNvbHVtbkNvbmZpZyIsInByb3BzIiwiY29sdW1uUGFpcnMiLCJmaWVsZFBhaXJzIiwibWFwIiwiZnAiLCJuYW1lIiwiZGVmYXVsdE5hbWUiLCJ0eXBlIiwicGFpciIsImtleSIsInZhbHVlIiwiYXNzaWduQ29sdW1uUGFpcnMiLCJhc3NpZ25Db2x1bW4iLCJjb2x1bW5zIiwidXBkYXRlTGF5ZXJDb25maWciLCJjb2x1bW5MYWJlbHMiLCJmaWVsZHMiLCJmaWVsZFBhaXJzU2VsZWN0b3IiLCJPYmplY3QiLCJrZXlzIiwidmFsIiwiX3VwZGF0ZUNvbHVtbiIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJhcnJheU9mIiwiYW55IiwiZnVuYyIsIkNvbHVtblJvdyIsIkNvbHVtbk5hbWUiLCJDb2x1bW5TZWxlY3QiLCJDb2x1bW5TZWxlY3RvciIsImNvbHVtbiIsImxhYmVsIiwiYWxsRmllbGRzIiwib25TZWxlY3QiLCJvcHRpb25hbCIsIkJvb2xlYW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsTUFBTSxHQUFHQyw2QkFBT0MsR0FBVixtQkFBWjs7SUFLcUJDLGlCOzs7Ozs7Ozs7Ozs7Ozs7OztvR0FZTCxVQUFBQyxLQUFLO0FBQUEsYUFBSUEsS0FBSyxDQUFDQyxXQUFWO0FBQUEsSzttR0FDTixVQUFBRCxLQUFLO0FBQUEsYUFBSUEsS0FBSyxDQUFDRSxVQUFWO0FBQUEsSzsyR0FDRyw4QkFDbkIsTUFBS0QsV0FEYyxF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QUFDSSxRQUFSLENBTG5CO0FBTUUsSUFBQSxRQUFRLEVBQUVEO0FBTlosSUFERixDQVBGLENBRHFCO0FBQUEsQ0FBdkIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAncmVhY3QtaW50bCc7XG5pbXBvcnQgRmllbGRTZWxlY3RvciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9maWVsZC1zZWxlY3Rvcic7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5cbmltcG9ydCB7UGFuZWxMYWJlbCwgU2lkZVBhbmVsU2VjdGlvbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5jb25zdCBUb3BSb3cgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXllckNvbHVtbkNvbmZpZyBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY29sdW1uczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGZpZWxkczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmFueSkuaXNSZXF1aXJlZCxcbiAgICBhc3NpZ25Db2x1bW5QYWlyczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBhc3NpZ25Db2x1bW46IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdXBkYXRlTGF5ZXJDb25maWc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgY29sdW1uUGFpcnM6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgZmllbGRQYWlyczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmFueSksXG4gICAgY29sdW1uTGFiZWxzOiBQcm9wVHlwZXMub2JqZWN0XG4gIH07XG5cbiAgY29sdW1uUGFpcnMgPSBwcm9wcyA9PiBwcm9wcy5jb2x1bW5QYWlycztcbiAgZmllbGRQYWlycyA9IHByb3BzID0+IHByb3BzLmZpZWxkUGFpcnM7XG4gIGZpZWxkUGFpcnNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHRoaXMuY29sdW1uUGFpcnMsXG4gICAgdGhpcy5maWVsZFBhaXJzLFxuICAgIChjb2x1bW5QYWlycywgZmllbGRQYWlycykgPT5cbiAgICAgIGNvbHVtblBhaXJzXG4gICAgICAgID8gZmllbGRQYWlycy5tYXAoZnAgPT4gKHtcbiAgICAgICAgICAgIG5hbWU6IGZwLmRlZmF1bHROYW1lLFxuICAgICAgICAgICAgdHlwZTogJ3BvaW50JyxcbiAgICAgICAgICAgIHBhaXI6IGZwLnBhaXJcbiAgICAgICAgICB9KSlcbiAgICAgICAgOiBudWxsXG4gICk7XG5cbiAgX3VwZGF0ZUNvbHVtbihrZXksIHZhbHVlKSB7XG4gICAgY29uc3Qge2NvbHVtblBhaXJzLCBhc3NpZ25Db2x1bW5QYWlycywgYXNzaWduQ29sdW1ufSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBjb2x1bW5zID1cbiAgICAgIHZhbHVlICYmIHZhbHVlLnBhaXIgJiYgY29sdW1uUGFpcnNcbiAgICAgICAgPyBhc3NpZ25Db2x1bW5QYWlycyhrZXksIHZhbHVlLnBhaXIpXG4gICAgICAgIDogYXNzaWduQ29sdW1uKGtleSwgdmFsdWUpO1xuXG4gICAgdGhpcy5wcm9wcy51cGRhdGVMYXllckNvbmZpZyh7Y29sdW1uc30pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtjb2x1bW5zLCBjb2x1bW5MYWJlbHMsIGZpZWxkc30gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgZmllbGRQYWlycyA9IHRoaXMuZmllbGRQYWlyc1NlbGVjdG9yKHRoaXMucHJvcHMpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGF5ZXItY29uZmlnX19jb2x1bW5cIj5cbiAgICAgICAgICAgIDxUb3BSb3c+XG4gICAgICAgICAgICAgIDxQYW5lbExhYmVsPlxuICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnY29sdW1ucy50aXRsZSd9IC8+XG4gICAgICAgICAgICAgIDwvUGFuZWxMYWJlbD5cbiAgICAgICAgICAgICAgPFBhbmVsTGFiZWw+XG4gICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9XCJsYXllci5yZXF1aXJlZFwiIC8+XG4gICAgICAgICAgICAgIDwvUGFuZWxMYWJlbD5cbiAgICAgICAgICAgIDwvVG9wUm93PlxuICAgICAgICAgICAge09iamVjdC5rZXlzKGNvbHVtbnMpLm1hcChrZXkgPT4gKFxuICAgICAgICAgICAgICA8Q29sdW1uU2VsZWN0b3JcbiAgICAgICAgICAgICAgICBjb2x1bW49e2NvbHVtbnNba2V5XX1cbiAgICAgICAgICAgICAgICBsYWJlbD17KGNvbHVtbkxhYmVscyAmJiBjb2x1bW5MYWJlbHNba2V5XSkgfHwga2V5fVxuICAgICAgICAgICAgICAgIGtleT17a2V5fVxuICAgICAgICAgICAgICAgIGFsbEZpZWxkcz17ZmllbGRzfVxuICAgICAgICAgICAgICAgIGZpZWxkUGFpcnM9e2ZpZWxkUGFpcnN9XG4gICAgICAgICAgICAgICAgb25TZWxlY3Q9e3ZhbCA9PiB0aGlzLl91cGRhdGVDb2x1bW4oa2V5LCB2YWwpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuY29uc3QgQ29sdW1uUm93ID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgbWFyZ2luLWJvdHRvbTogOHB4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuYDtcblxuY29uc3QgQ29sdW1uTmFtZSA9IHN0eWxlZC5kaXZgXG4gIHdpZHRoOiAzMCU7XG5gO1xuY29uc3QgQ29sdW1uU2VsZWN0ID0gc3R5bGVkLmRpdmBcbiAgd2lkdGg6IDcwJTtcbmA7XG5cbmNvbnN0IENvbHVtblNlbGVjdG9yID0gKHtjb2x1bW4sIGxhYmVsLCBhbGxGaWVsZHMsIG9uU2VsZWN0LCBmaWVsZFBhaXJzfSkgPT4gKFxuICA8Q29sdW1uUm93IGNsYXNzTmFtZT1cImxheWVyLWNvbmZpZ19fY29sdW1uX19zZWxlY3RvclwiPlxuICAgIDxDb2x1bW5OYW1lIGNsYXNzTmFtZT1cImxheWVyLWNvbmZpZ19fY29sdW1uX19uYW1lXCI+XG4gICAgICA8UGFuZWxMYWJlbD5cbiAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9e2Bjb2x1bW5zLiR7bGFiZWx9YH0gLz5cbiAgICAgIDwvUGFuZWxMYWJlbD5cbiAgICAgIHshY29sdW1uLm9wdGlvbmFsID8gPFBhbmVsTGFiZWw+e2AgICpgfTwvUGFuZWxMYWJlbD4gOiBudWxsfVxuICAgIDwvQ29sdW1uTmFtZT5cbiAgICA8Q29sdW1uU2VsZWN0IGNsYXNzTmFtZT1cImxheWVyLWNvbmZpZ19fY29sdW1uX19zZWxlY3RcIj5cbiAgICAgIDxGaWVsZFNlbGVjdG9yXG4gICAgICAgIHN1Z2dlc3RlZD17ZmllbGRQYWlyc31cbiAgICAgICAgZXJyb3I9eyFjb2x1bW4ub3B0aW9uYWwgJiYgIWNvbHVtbi52YWx1ZX1cbiAgICAgICAgZmllbGRzPXthbGxGaWVsZHN9XG4gICAgICAgIHZhbHVlPXtjb2x1bW4udmFsdWV9XG4gICAgICAgIGVyYXNhYmxlPXtCb29sZWFuKGNvbHVtbi5vcHRpb25hbCl9XG4gICAgICAgIG9uU2VsZWN0PXtvblNlbGVjdH1cbiAgICAgIC8+XG4gICAgPC9Db2x1bW5TZWxlY3Q+XG4gIDwvQ29sdW1uUm93PlxuKTtcbiJdfQ==