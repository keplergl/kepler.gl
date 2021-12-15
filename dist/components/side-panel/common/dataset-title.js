"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = DatasetTitleFactory;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _localization = require("../../../localization");

var _styledComponents2 = require("../../common/styled-components");

var _icons = require("../../common/icons");

var _datasetTag = _interopRequireDefault(require("./dataset-tag"));

var _templateObject, _templateObject2;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function nop(_) {}

var StyledDatasetTitle = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  display: flex;\n  align-items: flex-start;\n\n  .source-data-arrow {\n    height: 16px;\n  }\n  :hover {\n    cursor: ", ";\n\n    .dataset-name {\n      color: ", ";\n    }\n\n    .dataset-action {\n      color: ", ";\n      opacity: 1;\n    }\n\n    .dataset-action:hover {\n      color: ", ";\n    }\n  }\n"])), function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.clickable ? 'pointer' : 'auto';
}, function (props) {
  return props.clickable ? props.theme.textColorHl : props.theme.textColor;
}, function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.textColorHl;
});

var DataTagAction = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  margin-left: 12px;\n  height: 16px;\n  opacity: 0;\n"])));

var ShowDataTable = function ShowDataTable(_ref) {
  var id = _ref.id,
      _ref$showDatasetTable = _ref.showDatasetTable,
      showDatasetTable = _ref$showDatasetTable === void 0 ? nop : _ref$showDatasetTable;
  return /*#__PURE__*/_react["default"].createElement(DataTagAction, {
    className: "dataset-action show-data-table",
    "data-tip": true,
    "data-for": "data-table-".concat(id)
  }, /*#__PURE__*/_react["default"].createElement(_icons.Table, {
    height: "16px",
    onClick: function onClick(e) {
      e.stopPropagation();
      showDatasetTable(id);
    }
  }), /*#__PURE__*/_react["default"].createElement(_styledComponents2.Tooltip, {
    id: "data-table-".concat(id),
    effect: "solid"
  }, /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
    id: 'datasetTitle.showDataTable'
  }))));
};

var RemoveDataset = function RemoveDataset(_ref2) {
  var datasetKey = _ref2.datasetKey,
      _ref2$removeDataset = _ref2.removeDataset,
      removeDataset = _ref2$removeDataset === void 0 ? nop : _ref2$removeDataset;
  return /*#__PURE__*/_react["default"].createElement(DataTagAction, {
    className: "dataset-action remove-dataset",
    "data-tip": true,
    "data-for": "delete-".concat(datasetKey)
  }, /*#__PURE__*/_react["default"].createElement(_icons.Trash, {
    height: "16px",
    onClick: function onClick(e) {
      e.stopPropagation();
      removeDataset(datasetKey);
    }
  }), /*#__PURE__*/_react["default"].createElement(_styledComponents2.Tooltip, {
    id: "delete-".concat(datasetKey),
    effect: "solid",
    type: "error"
  }, /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
    id: 'datasetTitle.removeDataset'
  }))));
};

DatasetTitleFactory.deps = [_datasetTag["default"]];

function DatasetTitleFactory(DatasetTag) {
  var DatasetTitle = /*#__PURE__*/function (_PureComponent) {
    (0, _inherits2["default"])(DatasetTitle, _PureComponent);

    var _super = _createSuper(DatasetTitle);

    function DatasetTitle() {
      var _this;

      (0, _classCallCheck2["default"])(this, DatasetTitle);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onClickTitle", function (e) {
        e.stopPropagation();

        if (typeof _this.props.onTitleClick === 'function') {
          _this.props.onTitleClick();
        } else if (typeof _this.props.showDatasetTable === 'function') {
          _this.props.showDatasetTable(_this.props.dataset.id);
        }
      });
      return _this;
    }

    (0, _createClass2["default"])(DatasetTitle, [{
      key: "render",
      value: function render() {
        var _this$props = this.props,
            showDatasetTable = _this$props.showDatasetTable,
            showDeleteDataset = _this$props.showDeleteDataset,
            onTitleClick = _this$props.onTitleClick,
            removeDataset = _this$props.removeDataset,
            dataset = _this$props.dataset;
        return /*#__PURE__*/_react["default"].createElement(StyledDatasetTitle, {
          className: "source-data-title",
          clickable: Boolean(showDatasetTable || onTitleClick)
        }, /*#__PURE__*/_react["default"].createElement(DatasetTag, {
          dataset: dataset,
          onClick: this._onClickTitle
        }), showDatasetTable ? /*#__PURE__*/_react["default"].createElement(_styledComponents2.CenterFlexbox, {
          className: "source-data-arrow"
        }, /*#__PURE__*/_react["default"].createElement(_icons.ArrowRight, {
          height: "12px"
        })) : null, showDatasetTable ? /*#__PURE__*/_react["default"].createElement(ShowDataTable, {
          id: dataset.id,
          showDatasetTable: showDatasetTable
        }) : null, showDeleteDataset ? /*#__PURE__*/_react["default"].createElement(RemoveDataset, {
          datasetKey: dataset.id,
          removeDataset: removeDataset
        }) : null);
      }
    }]);
    return DatasetTitle;
  }(_react.PureComponent);

  return DatasetTitle;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvY29tbW9uL2RhdGFzZXQtdGl0bGUuanMiXSwibmFtZXMiOlsibm9wIiwiXyIsIlN0eWxlZERhdGFzZXRUaXRsZSIsInN0eWxlZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJ0ZXh0Q29sb3IiLCJjbGlja2FibGUiLCJ0ZXh0Q29sb3JIbCIsIkRhdGFUYWdBY3Rpb24iLCJTaG93RGF0YVRhYmxlIiwiaWQiLCJzaG93RGF0YXNldFRhYmxlIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsIlJlbW92ZURhdGFzZXQiLCJkYXRhc2V0S2V5IiwicmVtb3ZlRGF0YXNldCIsIkRhdGFzZXRUaXRsZUZhY3RvcnkiLCJkZXBzIiwiRGF0YXNldFRhZ0ZhY3RvcnkiLCJEYXRhc2V0VGFnIiwiRGF0YXNldFRpdGxlIiwib25UaXRsZUNsaWNrIiwiZGF0YXNldCIsInNob3dEZWxldGVEYXRhc2V0IiwiQm9vbGVhbiIsIl9vbkNsaWNrVGl0bGUiLCJQdXJlQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUEsU0FBU0EsR0FBVCxDQUFhQyxDQUFiLEVBQWdCLENBQUU7O0FBRWxCLElBQU1DLGtCQUFrQixHQUFHQyw2QkFBT0MsR0FBVixnYUFDYixVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLFNBQWhCO0FBQUEsQ0FEUSxFQVNWLFVBQUFGLEtBQUs7QUFBQSxTQUFLQSxLQUFLLENBQUNHLFNBQU4sR0FBa0IsU0FBbEIsR0FBOEIsTUFBbkM7QUFBQSxDQVRLLEVBWVQsVUFBQUgsS0FBSztBQUFBLFNBQUtBLEtBQUssQ0FBQ0csU0FBTixHQUFrQkgsS0FBSyxDQUFDQyxLQUFOLENBQVlHLFdBQTlCLEdBQTRDSixLQUFLLENBQUNDLEtBQU4sQ0FBWUMsU0FBN0Q7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LFlBR0xhLGlCQUhLLGVBR0xBLGlCQUhLO0FBQUEsWUFJTEYsWUFKSyxlQUlMQSxZQUpLO0FBQUEsWUFLTE4sYUFMSyxlQUtMQSxhQUxLO0FBQUEsWUFNTE8sT0FOSyxlQU1MQSxPQU5LO0FBU1AsNEJBQ0UsZ0NBQUMsa0JBQUQ7QUFDRSxVQUFBLFNBQVMsRUFBQyxtQkFEWjtBQUVFLFVBQUEsU0FBUyxFQUFFRSxPQUFPLENBQUNkLGdCQUFnQixJQUFJVyxZQUFyQjtBQUZwQix3QkFJRSxnQ0FBQyxVQUFEO0FBQVksVUFBQSxPQUFPLEVBQUVDLE9BQXJCO0FBQThCLFVBQUEsT0FBTyxFQUFFLEtBQUtHO0FBQTVDLFVBSkYsRUFLR2YsZ0JBQWdCLGdCQUNmLGdDQUFDLGdDQUFEO0FBQWUsVUFBQSxTQUFTLEVBQUM7QUFBekIsd0JBQ0UsZ0NBQUMsaUJBQUQ7QUFBWSxVQUFBLE1BQU0sRUFBQztBQUFuQixVQURGLENBRGUsR0FJYixJQVROLEVBVUdBLGdCQUFnQixnQkFDZixnQ0FBQyxhQUFEO0FBQWUsVUFBQSxFQUFFLEVBQUVZLE9BQU8sQ0FBQ2IsRUFBM0I7QUFBK0IsVUFBQSxnQkFBZ0IsRUFBRUM7QUFBakQsVUFEZSxHQUViLElBWk4sRUFhR2EsaUJBQWlCLGdCQUNoQixnQ0FBQyxhQUFEO0FBQWUsVUFBQSxVQUFVLEVBQUVELE9BQU8sQ0FBQ2IsRUFBbkM7QUFBdUMsVUFBQSxhQUFhLEVBQUVNO0FBQXRELFVBRGdCLEdBRWQsSUFmTixDQURGO0FBbUJEO0FBdkNtRDtBQUFBO0FBQUEsSUFDM0JXLG9CQUQyQjs7QUEwQ3RELFNBQU9OLFlBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge1B1cmVDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdsb2NhbGl6YXRpb24nO1xuXG5pbXBvcnQge0NlbnRlckZsZXhib3gsIFRvb2x0aXB9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7QXJyb3dSaWdodCwgVGFibGUsIFRyYXNofSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQgRGF0YXNldFRhZ0ZhY3RvcnkgZnJvbSAnY29tcG9uZW50cy9zaWRlLXBhbmVsL2NvbW1vbi9kYXRhc2V0LXRhZyc7XG5cbmZ1bmN0aW9uIG5vcChfKSB7fVxuXG5jb25zdCBTdHlsZWREYXRhc2V0VGl0bGUgPSBzdHlsZWQuZGl2YFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcblxuICAuc291cmNlLWRhdGEtYXJyb3cge1xuICAgIGhlaWdodDogMTZweDtcbiAgfVxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogJHtwcm9wcyA9PiAocHJvcHMuY2xpY2thYmxlID8gJ3BvaW50ZXInIDogJ2F1dG8nKX07XG5cbiAgICAuZGF0YXNldC1uYW1lIHtcbiAgICAgIGNvbG9yOiAke3Byb3BzID0+IChwcm9wcy5jbGlja2FibGUgPyBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbCA6IHByb3BzLnRoZW1lLnRleHRDb2xvcil9O1xuICAgIH1cblxuICAgIC5kYXRhc2V0LWFjdGlvbiB7XG4gICAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICAgICAgb3BhY2l0eTogMTtcbiAgICB9XG5cbiAgICAuZGF0YXNldC1hY3Rpb246aG92ZXIge1xuICAgICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICAgIH1cbiAgfVxuYDtcblxuY29uc3QgRGF0YVRhZ0FjdGlvbiA9IHN0eWxlZC5kaXZgXG4gIG1hcmdpbi1sZWZ0OiAxMnB4O1xuICBoZWlnaHQ6IDE2cHg7XG4gIG9wYWNpdHk6IDA7XG5gO1xuXG5jb25zdCBTaG93RGF0YVRhYmxlID0gKHtpZCwgc2hvd0RhdGFzZXRUYWJsZSA9IG5vcH0pID0+IChcbiAgPERhdGFUYWdBY3Rpb24gY2xhc3NOYW1lPVwiZGF0YXNldC1hY3Rpb24gc2hvdy1kYXRhLXRhYmxlXCIgZGF0YS10aXAgZGF0YS1mb3I9e2BkYXRhLXRhYmxlLSR7aWR9YH0+XG4gICAgPFRhYmxlXG4gICAgICBoZWlnaHQ9XCIxNnB4XCJcbiAgICAgIG9uQ2xpY2s9e2UgPT4ge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBzaG93RGF0YXNldFRhYmxlKGlkKTtcbiAgICAgIH19XG4gICAgLz5cbiAgICA8VG9vbHRpcCBpZD17YGRhdGEtdGFibGUtJHtpZH1gfSBlZmZlY3Q9XCJzb2xpZFwiPlxuICAgICAgPHNwYW4+XG4gICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnZGF0YXNldFRpdGxlLnNob3dEYXRhVGFibGUnfSAvPlxuICAgICAgPC9zcGFuPlxuICAgIDwvVG9vbHRpcD5cbiAgPC9EYXRhVGFnQWN0aW9uPlxuKTtcblxuY29uc3QgUmVtb3ZlRGF0YXNldCA9ICh7ZGF0YXNldEtleSwgcmVtb3ZlRGF0YXNldCA9IG5vcH0pID0+IChcbiAgPERhdGFUYWdBY3Rpb25cbiAgICBjbGFzc05hbWU9XCJkYXRhc2V0LWFjdGlvbiByZW1vdmUtZGF0YXNldFwiXG4gICAgZGF0YS10aXBcbiAgICBkYXRhLWZvcj17YGRlbGV0ZS0ke2RhdGFzZXRLZXl9YH1cbiAgPlxuICAgIDxUcmFzaFxuICAgICAgaGVpZ2h0PVwiMTZweFwiXG4gICAgICBvbkNsaWNrPXtlID0+IHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgcmVtb3ZlRGF0YXNldChkYXRhc2V0S2V5KTtcbiAgICAgIH19XG4gICAgLz5cbiAgICA8VG9vbHRpcCBpZD17YGRlbGV0ZS0ke2RhdGFzZXRLZXl9YH0gZWZmZWN0PVwic29saWRcIiB0eXBlPVwiZXJyb3JcIj5cbiAgICAgIDxzcGFuPlxuICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J2RhdGFzZXRUaXRsZS5yZW1vdmVEYXRhc2V0J30gLz5cbiAgICAgIDwvc3Bhbj5cbiAgICA8L1Rvb2x0aXA+XG4gIDwvRGF0YVRhZ0FjdGlvbj5cbik7XG5cbkRhdGFzZXRUaXRsZUZhY3RvcnkuZGVwcyA9IFtEYXRhc2V0VGFnRmFjdG9yeV07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIERhdGFzZXRUaXRsZUZhY3RvcnkoRGF0YXNldFRhZykge1xuICBjbGFzcyBEYXRhc2V0VGl0bGUgZXh0ZW5kcyBQdXJlQ29tcG9uZW50IHtcbiAgICBfb25DbGlja1RpdGxlID0gZSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLnByb3BzLm9uVGl0bGVDbGljayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLnByb3BzLm9uVGl0bGVDbGljaygpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5wcm9wcy5zaG93RGF0YXNldFRhYmxlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMucHJvcHMuc2hvd0RhdGFzZXRUYWJsZSh0aGlzLnByb3BzLmRhdGFzZXQuaWQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHNob3dEYXRhc2V0VGFibGUsXG4gICAgICAgIHNob3dEZWxldGVEYXRhc2V0LFxuICAgICAgICBvblRpdGxlQ2xpY2ssXG4gICAgICAgIHJlbW92ZURhdGFzZXQsXG4gICAgICAgIGRhdGFzZXRcbiAgICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3R5bGVkRGF0YXNldFRpdGxlXG4gICAgICAgICAgY2xhc3NOYW1lPVwic291cmNlLWRhdGEtdGl0bGVcIlxuICAgICAgICAgIGNsaWNrYWJsZT17Qm9vbGVhbihzaG93RGF0YXNldFRhYmxlIHx8IG9uVGl0bGVDbGljayl9XG4gICAgICAgID5cbiAgICAgICAgICA8RGF0YXNldFRhZyBkYXRhc2V0PXtkYXRhc2V0fSBvbkNsaWNrPXt0aGlzLl9vbkNsaWNrVGl0bGV9IC8+XG4gICAgICAgICAge3Nob3dEYXRhc2V0VGFibGUgPyAoXG4gICAgICAgICAgICA8Q2VudGVyRmxleGJveCBjbGFzc05hbWU9XCJzb3VyY2UtZGF0YS1hcnJvd1wiPlxuICAgICAgICAgICAgICA8QXJyb3dSaWdodCBoZWlnaHQ9XCIxMnB4XCIgLz5cbiAgICAgICAgICAgIDwvQ2VudGVyRmxleGJveD5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICB7c2hvd0RhdGFzZXRUYWJsZSA/IChcbiAgICAgICAgICAgIDxTaG93RGF0YVRhYmxlIGlkPXtkYXRhc2V0LmlkfSBzaG93RGF0YXNldFRhYmxlPXtzaG93RGF0YXNldFRhYmxlfSAvPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIHtzaG93RGVsZXRlRGF0YXNldCA/IChcbiAgICAgICAgICAgIDxSZW1vdmVEYXRhc2V0IGRhdGFzZXRLZXk9e2RhdGFzZXQuaWR9IHJlbW92ZURhdGFzZXQ9e3JlbW92ZURhdGFzZXR9IC8+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvU3R5bGVkRGF0YXNldFRpdGxlPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gRGF0YXNldFRpdGxlO1xufVxuIl19