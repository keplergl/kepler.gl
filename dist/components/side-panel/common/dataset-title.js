"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = DatasetTitleFactory;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactIntl = require("react-intl");

var _styledComponents2 = require("../../common/styled-components");

var _icons = require("../../common/icons");

var _datasetTag = _interopRequireDefault(require("./dataset-tag"));

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin-left: 12px;\n  height: 16px;\n  opacity: 0;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  display: flex;\n  align-items: flex-start;\n\n  .source-data-arrow {\n    height: 16px;\n  }\n  :hover {\n    cursor: ", ";\n\n    .dataset-name {\n      color: ", ";\n    }\n\n    .dataset-action {\n      color: ", ";\n      opacity: 1;\n    }\n\n    .dataset-action:hover {\n      color: ", ";\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function nop() {}

var StyledDatasetTitle = _styledComponents["default"].div(_templateObject(), function (props) {
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

var DataTagAction = _styledComponents["default"].div(_templateObject2());

var ShowDataTable = function ShowDataTable(_ref) {
  var id = _ref.id,
      _ref$showDatasetTable = _ref.showDatasetTable,
      showDatasetTable = _ref$showDatasetTable === void 0 ? nop : _ref$showDatasetTable;
  return _react["default"].createElement(DataTagAction, {
    className: "dataset-action show-data-table",
    "data-tip": true,
    "data-for": "data-table-".concat(id)
  }, _react["default"].createElement(_icons.Table, {
    height: "16px",
    onClick: function onClick(e) {
      e.stopPropagation();
      showDatasetTable(id);
    }
  }), _react["default"].createElement(_styledComponents2.Tooltip, {
    id: "data-table-".concat(id),
    effect: "solid"
  }, _react["default"].createElement("span", null, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: 'datasetTitle.showDataTable'
  }))));
};

var RemoveDataset = function RemoveDataset(_ref2) {
  var datasetKey = _ref2.datasetKey,
      _ref2$removeDataset = _ref2.removeDataset,
      removeDataset = _ref2$removeDataset === void 0 ? nop : _ref2$removeDataset;
  return _react["default"].createElement(DataTagAction, {
    className: "dataset-action remove-dataset",
    "data-tip": true,
    "data-for": "delete-".concat(datasetKey)
  }, _react["default"].createElement(_icons.Trash, {
    height: "16px",
    onClick: function onClick(e) {
      e.stopPropagation();
      removeDataset(datasetKey);
    }
  }), _react["default"].createElement(_styledComponents2.Tooltip, {
    id: "delete-".concat(datasetKey),
    effect: "solid",
    type: "error"
  }, _react["default"].createElement("span", null, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: 'datasetTitle.removeDataset'
  }))));
};

DatasetTitleFactory.deps = [_datasetTag["default"]];

function DatasetTitleFactory(DatasetTag) {
  var DatasetTitle =
  /*#__PURE__*/
  function (_PureComponent) {
    (0, _inherits2["default"])(DatasetTitle, _PureComponent);

    function DatasetTitle() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, DatasetTitle);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(DatasetTitle)).call.apply(_getPrototypeOf2, [this].concat(args)));
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
        return _react["default"].createElement(StyledDatasetTitle, {
          className: "source-data-title",
          clickable: Boolean(showDatasetTable || onTitleClick)
        }, _react["default"].createElement(DatasetTag, {
          dataset: dataset,
          onClick: this._onClickTitle
        }), showDatasetTable ? _react["default"].createElement(_styledComponents2.CenterFlexbox, {
          className: "source-data-arrow"
        }, _react["default"].createElement(_icons.ArrowRight, {
          height: "12px"
        })) : null, showDatasetTable ? _react["default"].createElement(ShowDataTable, {
          id: dataset.id,
          showDatasetTable: showDatasetTable
        }) : null, showDeleteDataset ? _react["default"].createElement(RemoveDataset, {
          datasetKey: dataset.id,
          removeDataset: removeDataset
        }) : null);
      }
    }]);
    return DatasetTitle;
  }(_react.PureComponent);

  return DatasetTitle;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvY29tbW9uL2RhdGFzZXQtdGl0bGUuanMiXSwibmFtZXMiOlsibm9wIiwiU3R5bGVkRGF0YXNldFRpdGxlIiwic3R5bGVkIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsInRleHRDb2xvciIsImNsaWNrYWJsZSIsInRleHRDb2xvckhsIiwiRGF0YVRhZ0FjdGlvbiIsIlNob3dEYXRhVGFibGUiLCJpZCIsInNob3dEYXRhc2V0VGFibGUiLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwiUmVtb3ZlRGF0YXNldCIsImRhdGFzZXRLZXkiLCJyZW1vdmVEYXRhc2V0IiwiRGF0YXNldFRpdGxlRmFjdG9yeSIsImRlcHMiLCJEYXRhc2V0VGFnRmFjdG9yeSIsIkRhdGFzZXRUYWciLCJEYXRhc2V0VGl0bGUiLCJvblRpdGxlQ2xpY2siLCJkYXRhc2V0Iiwic2hvd0RlbGV0ZURhdGFzZXQiLCJCb29sZWFuIiwiX29uQ2xpY2tUaXRsZSIsIlB1cmVDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLFNBQVNBLEdBQVQsR0FBZSxDQUFFOztBQUVqQixJQUFNQyxrQkFBa0IsR0FBR0MsNkJBQU9DLEdBQVYsb0JBQ2IsVUFBQUMsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxTQUFoQjtBQUFBLENBRFEsRUFTVixVQUFBRixLQUFLO0FBQUEsU0FBS0EsS0FBSyxDQUFDRyxTQUFOLEdBQWtCLFNBQWxCLEdBQThCLE1BQW5DO0FBQUEsQ0FUSyxFQVlULFVBQUFILEtBQUs7QUFBQSxTQUFLQSxLQUFLLENBQUNHLFNBQU4sR0FBa0JILEtBQUssQ0FBQ0MsS0FBTixDQUFZRyxXQUE5QixHQUE0Q0osS0FBSyxDQUFDQyxLQUFOLENBQVlDLFNBQTdEO0FB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R0xhLGlCQUhLLGVBR0xBLGlCQUhLO0FBQUEsWUFJTEYsWUFKSyxlQUlMQSxZQUpLO0FBQUEsWUFLTE4sYUFMSyxlQUtMQSxhQUxLO0FBQUEsWUFNTE8sT0FOSyxlQU1MQSxPQU5LO0FBU1AsZUFDRSxnQ0FBQyxrQkFBRDtBQUNFLFVBQUEsU0FBUyxFQUFDLG1CQURaO0FBRUUsVUFBQSxTQUFTLEVBQUVFLE9BQU8sQ0FBQ2QsZ0JBQWdCLElBQUlXLFlBQXJCO0FBRnBCLFdBSUUsZ0NBQUMsVUFBRDtBQUFZLFVBQUEsT0FBTyxFQUFFQyxPQUFyQjtBQUE4QixVQUFBLE9BQU8sRUFBRSxLQUFLRztBQUE1QyxVQUpGLEVBS0dmLGdCQUFnQixHQUNmLGdDQUFDLGdDQUFEO0FBQWUsVUFBQSxTQUFTLEVBQUM7QUFBekIsV0FDRSxnQ0FBQyxpQkFBRDtBQUFZLFVBQUEsTUFBTSxFQUFDO0FBQW5CLFVBREYsQ0FEZSxHQUliLElBVE4sRUFVR0EsZ0JBQWdCLEdBQ2YsZ0NBQUMsYUFBRDtBQUFlLFVBQUEsRUFBRSxFQUFFWSxPQUFPLENBQUNiLEVBQTNCO0FBQStCLFVBQUEsZ0JBQWdCLEVBQUVDO0FBQWpELFVBRGUsR0FFYixJQVpOLEVBYUdhLGlCQUFpQixHQUNoQixnQ0FBQyxhQUFEO0FBQWUsVUFBQSxVQUFVLEVBQUVELE9BQU8sQ0FBQ2IsRUFBbkM7QUFBdUMsVUFBQSxhQUFhLEVBQUVNO0FBQXRELFVBRGdCLEdBRWQsSUFmTixDQURGO0FBbUJEO0FBdkNtRDtBQUFBO0FBQUEsSUFDM0JXLG9CQUQyQjs7QUEwQ3RELFNBQU9OLFlBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge1B1cmVDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdyZWFjdC1pbnRsJztcblxuaW1wb3J0IHtDZW50ZXJGbGV4Ym94LCBUb29sdGlwfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge0Fycm93UmlnaHQsIFRhYmxlLCBUcmFzaH0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IERhdGFzZXRUYWdGYWN0b3J5IGZyb20gJ2NvbXBvbmVudHMvc2lkZS1wYW5lbC9jb21tb24vZGF0YXNldC10YWcnO1xuXG5mdW5jdGlvbiBub3AoKSB7fVxuXG5jb25zdCBTdHlsZWREYXRhc2V0VGl0bGUgPSBzdHlsZWQuZGl2YFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcblxuICAuc291cmNlLWRhdGEtYXJyb3cge1xuICAgIGhlaWdodDogMTZweDtcbiAgfVxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogJHtwcm9wcyA9PiAocHJvcHMuY2xpY2thYmxlID8gJ3BvaW50ZXInIDogJ2F1dG8nKX07XG5cbiAgICAuZGF0YXNldC1uYW1lIHtcbiAgICAgIGNvbG9yOiAke3Byb3BzID0+IChwcm9wcy5jbGlja2FibGUgPyBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbCA6IHByb3BzLnRoZW1lLnRleHRDb2xvcil9O1xuICAgIH1cblxuICAgIC5kYXRhc2V0LWFjdGlvbiB7XG4gICAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICAgICAgb3BhY2l0eTogMTtcbiAgICB9XG5cbiAgICAuZGF0YXNldC1hY3Rpb246aG92ZXIge1xuICAgICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICAgIH1cbiAgfVxuYDtcblxuY29uc3QgRGF0YVRhZ0FjdGlvbiA9IHN0eWxlZC5kaXZgXG4gIG1hcmdpbi1sZWZ0OiAxMnB4O1xuICBoZWlnaHQ6IDE2cHg7XG4gIG9wYWNpdHk6IDA7XG5gO1xuXG5jb25zdCBTaG93RGF0YVRhYmxlID0gKHtpZCwgc2hvd0RhdGFzZXRUYWJsZSA9IG5vcH0pID0+IChcbiAgPERhdGFUYWdBY3Rpb24gY2xhc3NOYW1lPVwiZGF0YXNldC1hY3Rpb24gc2hvdy1kYXRhLXRhYmxlXCIgZGF0YS10aXAgZGF0YS1mb3I9e2BkYXRhLXRhYmxlLSR7aWR9YH0+XG4gICAgPFRhYmxlXG4gICAgICBoZWlnaHQ9XCIxNnB4XCJcbiAgICAgIG9uQ2xpY2s9e2UgPT4ge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBzaG93RGF0YXNldFRhYmxlKGlkKTtcbiAgICAgIH19XG4gICAgLz5cbiAgICA8VG9vbHRpcCBpZD17YGRhdGEtdGFibGUtJHtpZH1gfSBlZmZlY3Q9XCJzb2xpZFwiPlxuICAgICAgPHNwYW4+XG4gICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnZGF0YXNldFRpdGxlLnNob3dEYXRhVGFibGUnfSAvPlxuICAgICAgPC9zcGFuPlxuICAgIDwvVG9vbHRpcD5cbiAgPC9EYXRhVGFnQWN0aW9uPlxuKTtcblxuY29uc3QgUmVtb3ZlRGF0YXNldCA9ICh7ZGF0YXNldEtleSwgcmVtb3ZlRGF0YXNldCA9IG5vcH0pID0+IChcbiAgPERhdGFUYWdBY3Rpb25cbiAgICBjbGFzc05hbWU9XCJkYXRhc2V0LWFjdGlvbiByZW1vdmUtZGF0YXNldFwiXG4gICAgZGF0YS10aXBcbiAgICBkYXRhLWZvcj17YGRlbGV0ZS0ke2RhdGFzZXRLZXl9YH1cbiAgPlxuICAgIDxUcmFzaFxuICAgICAgaGVpZ2h0PVwiMTZweFwiXG4gICAgICBvbkNsaWNrPXtlID0+IHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgcmVtb3ZlRGF0YXNldChkYXRhc2V0S2V5KTtcbiAgICAgIH19XG4gICAgLz5cbiAgICA8VG9vbHRpcCBpZD17YGRlbGV0ZS0ke2RhdGFzZXRLZXl9YH0gZWZmZWN0PVwic29saWRcIiB0eXBlPVwiZXJyb3JcIj5cbiAgICAgIDxzcGFuPlxuICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J2RhdGFzZXRUaXRsZS5yZW1vdmVEYXRhc2V0J30gLz5cbiAgICAgIDwvc3Bhbj5cbiAgICA8L1Rvb2x0aXA+XG4gIDwvRGF0YVRhZ0FjdGlvbj5cbik7XG5cbkRhdGFzZXRUaXRsZUZhY3RvcnkuZGVwcyA9IFtEYXRhc2V0VGFnRmFjdG9yeV07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIERhdGFzZXRUaXRsZUZhY3RvcnkoRGF0YXNldFRhZykge1xuICBjbGFzcyBEYXRhc2V0VGl0bGUgZXh0ZW5kcyBQdXJlQ29tcG9uZW50IHtcbiAgICBfb25DbGlja1RpdGxlID0gZSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLnByb3BzLm9uVGl0bGVDbGljayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLnByb3BzLm9uVGl0bGVDbGljaygpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5wcm9wcy5zaG93RGF0YXNldFRhYmxlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMucHJvcHMuc2hvd0RhdGFzZXRUYWJsZSh0aGlzLnByb3BzLmRhdGFzZXQuaWQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHNob3dEYXRhc2V0VGFibGUsXG4gICAgICAgIHNob3dEZWxldGVEYXRhc2V0LFxuICAgICAgICBvblRpdGxlQ2xpY2ssXG4gICAgICAgIHJlbW92ZURhdGFzZXQsXG4gICAgICAgIGRhdGFzZXRcbiAgICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3R5bGVkRGF0YXNldFRpdGxlXG4gICAgICAgICAgY2xhc3NOYW1lPVwic291cmNlLWRhdGEtdGl0bGVcIlxuICAgICAgICAgIGNsaWNrYWJsZT17Qm9vbGVhbihzaG93RGF0YXNldFRhYmxlIHx8IG9uVGl0bGVDbGljayl9XG4gICAgICAgID5cbiAgICAgICAgICA8RGF0YXNldFRhZyBkYXRhc2V0PXtkYXRhc2V0fSBvbkNsaWNrPXt0aGlzLl9vbkNsaWNrVGl0bGV9IC8+XG4gICAgICAgICAge3Nob3dEYXRhc2V0VGFibGUgPyAoXG4gICAgICAgICAgICA8Q2VudGVyRmxleGJveCBjbGFzc05hbWU9XCJzb3VyY2UtZGF0YS1hcnJvd1wiPlxuICAgICAgICAgICAgICA8QXJyb3dSaWdodCBoZWlnaHQ9XCIxMnB4XCIgLz5cbiAgICAgICAgICAgIDwvQ2VudGVyRmxleGJveD5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICB7c2hvd0RhdGFzZXRUYWJsZSA/IChcbiAgICAgICAgICAgIDxTaG93RGF0YVRhYmxlIGlkPXtkYXRhc2V0LmlkfSBzaG93RGF0YXNldFRhYmxlPXtzaG93RGF0YXNldFRhYmxlfSAvPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIHtzaG93RGVsZXRlRGF0YXNldCA/IChcbiAgICAgICAgICAgIDxSZW1vdmVEYXRhc2V0IGRhdGFzZXRLZXk9e2RhdGFzZXQuaWR9IHJlbW92ZURhdGFzZXQ9e3JlbW92ZURhdGFzZXR9IC8+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvU3R5bGVkRGF0YXNldFRpdGxlPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gRGF0YXNldFRpdGxlO1xufVxuIl19