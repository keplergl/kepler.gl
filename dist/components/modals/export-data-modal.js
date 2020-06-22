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

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _defaultSettings = require("../../constants/default-settings");

var _icons = require("../common/icons");

var _styledComponents = require("../common/styled-components");

var _reactIntl = require("react-intl");

// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
var propTypes = {
  datasets: _propTypes["default"].object.isRequired,
  selectedDataset: _propTypes["default"].string,
  dataType: _propTypes["default"].string.isRequired,
  filtered: _propTypes["default"].bool.isRequired,
  // callbacks
  applyCPUFilter: _propTypes["default"].func.isRequired,
  onClose: _propTypes["default"].func.isRequired,
  onChangeExportSelectedDataset: _propTypes["default"].func.isRequired,
  onChangeExportDataType: _propTypes["default"].func.isRequired,
  onChangeExportFiltered: _propTypes["default"].func.isRequired
};

var getDataRowCount = function getDataRowCount(datasets, selectedDataset, filtered, intl) {
  var selectedData = datasets[selectedDataset];

  if (!selectedData) {
    return intl.formatMessage({
      id: 'modal.exportData.fileCount'
    }, {
      fileCount: Object.keys(datasets).length
    });
  }

  var allData = selectedData.allData,
      filteredIdxCPU = selectedData.filteredIdxCPU;

  if (filtered && !filteredIdxCPU) {
    return '-';
  }

  var rowCount = filtered ? filteredIdxCPU.length : allData.length;
  return intl.formatMessage({
    id: 'modal.exportData.rowCount'
  }, {
    rowCount: rowCount.toLocaleString()
  });
};

var ExportDataModalFactory = function ExportDataModalFactory() {
  var ExportDataModal =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(ExportDataModal, _Component);

    function ExportDataModal() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, ExportDataModal);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(ExportDataModal)).call.apply(_getPrototypeOf2, [this].concat(args)));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onSelectDataset", function (_ref) {
        var value = _ref.target.value;

        _this.props.applyCPUFilter(value);

        _this.props.onChangeExportSelectedDataset(value);
      });
      return _this;
    }

    (0, _createClass2["default"])(ExportDataModal, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var toCPUFilter = this.props.selectedDataset || Object.keys(this.props.datasets);
        this.props.applyCPUFilter(toCPUFilter);
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props = this.props,
            datasets = _this$props.datasets,
            selectedDataset = _this$props.selectedDataset,
            dataType = _this$props.dataType,
            filtered = _this$props.filtered,
            onChangeExportDataType = _this$props.onChangeExportDataType,
            onChangeExportFiltered = _this$props.onChangeExportFiltered,
            intl = _this$props.intl;
        return _react["default"].createElement(_styledComponents.StyledModalContent, {
          className: "export-data-modal"
        }, _react["default"].createElement("div", null, _react["default"].createElement(_styledComponents.StyledExportSection, null, _react["default"].createElement("div", {
          className: "description"
        }, _react["default"].createElement("div", {
          className: "title"
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.exportData.datasetTitle'
        })), _react["default"].createElement("div", {
          className: "subtitle"
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.exportData.datasetSubtitle'
        }))), _react["default"].createElement("div", {
          className: "selection"
        }, _react["default"].createElement("select", {
          value: selectedDataset,
          onChange: this._onSelectDataset
        }, [intl.formatMessage({
          id: 'modal.exportData.allDatasets'
        })].concat(Object.keys(datasets)).map(function (d) {
          return _react["default"].createElement("option", {
            key: d,
            value: d
          }, datasets[d] && datasets[d].label || d);
        })))), _react["default"].createElement(_styledComponents.StyledExportSection, null, _react["default"].createElement("div", {
          className: "description"
        }, _react["default"].createElement("div", {
          className: "title"
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.exportData.dataTypeTitle'
        })), _react["default"].createElement("div", {
          className: "subtitle"
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.exportData.dataTypeSubtitle'
        }))), _react["default"].createElement("div", {
          className: "selection"
        }, _defaultSettings.EXPORT_DATA_TYPE_OPTIONS.map(function (op) {
          return _react["default"].createElement(_styledComponents.StyledType, {
            key: op.id,
            selected: dataType === op.id,
            available: op.available,
            onClick: function onClick() {
              return op.available && onChangeExportDataType(op.id);
            }
          }, _react["default"].createElement(_icons.FileType, {
            ext: op.label,
            height: "80px",
            fontSize: "11px"
          }));
        }))), _react["default"].createElement(_styledComponents.StyledExportSection, null, _react["default"].createElement("div", {
          className: "description"
        }, _react["default"].createElement("div", {
          className: "title"
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.exportData.dataTypeTitle'
        })), _react["default"].createElement("div", {
          className: "subtitle"
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.exportData.filterDataSubtitle'
        }))), _react["default"].createElement("div", {
          className: "selection"
        }, _react["default"].createElement(_styledComponents.StyledFilteredOption, {
          className: "unfiltered-option",
          selected: !filtered,
          onClick: function onClick() {
            return onChangeExportFiltered(false);
          }
        }, _react["default"].createElement("div", {
          className: "filter-option-title"
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.exportData.unfilteredData'
        })), _react["default"].createElement("div", {
          className: "filter-option-subtitle"
        }, getDataRowCount(datasets, selectedDataset, false, intl))), _react["default"].createElement(_styledComponents.StyledFilteredOption, {
          className: "filtered-option",
          selected: filtered,
          onClick: function onClick() {
            return onChangeExportFiltered(true);
          }
        }, _react["default"].createElement("div", {
          className: "filter-option-title"
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.exportData.filteredData'
        })), _react["default"].createElement("div", {
          className: "filter-option-subtitle"
        }, getDataRowCount(datasets, selectedDataset, true, intl)))))));
      }
    }]);
    return ExportDataModal;
  }(_react.Component);

  ExportDataModal.propTypes = propTypes;
  return (0, _reactIntl.injectIntl)(ExportDataModal);
};

var _default = ExportDataModalFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9leHBvcnQtZGF0YS1tb2RhbC5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJkYXRhc2V0cyIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJzZWxlY3RlZERhdGFzZXQiLCJzdHJpbmciLCJkYXRhVHlwZSIsImZpbHRlcmVkIiwiYm9vbCIsImFwcGx5Q1BVRmlsdGVyIiwiZnVuYyIsIm9uQ2xvc2UiLCJvbkNoYW5nZUV4cG9ydFNlbGVjdGVkRGF0YXNldCIsIm9uQ2hhbmdlRXhwb3J0RGF0YVR5cGUiLCJvbkNoYW5nZUV4cG9ydEZpbHRlcmVkIiwiZ2V0RGF0YVJvd0NvdW50IiwiaW50bCIsInNlbGVjdGVkRGF0YSIsImZvcm1hdE1lc3NhZ2UiLCJpZCIsImZpbGVDb3VudCIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJhbGxEYXRhIiwiZmlsdGVyZWRJZHhDUFUiLCJyb3dDb3VudCIsInRvTG9jYWxlU3RyaW5nIiwiRXhwb3J0RGF0YU1vZGFsRmFjdG9yeSIsIkV4cG9ydERhdGFNb2RhbCIsInZhbHVlIiwidGFyZ2V0IiwicHJvcHMiLCJ0b0NQVUZpbHRlciIsIl9vblNlbGVjdERhdGFzZXQiLCJjb25jYXQiLCJtYXAiLCJkIiwibGFiZWwiLCJFWFBPUlRfREFUQV9UWVBFX09QVElPTlMiLCJvcCIsImF2YWlsYWJsZSIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFNQTs7QUEvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFlQSxJQUFNQSxTQUFTLEdBQUc7QUFDaEJDLEVBQUFBLFFBQVEsRUFBRUMsc0JBQVVDLE1BQVYsQ0FBaUJDLFVBRFg7QUFFaEJD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QUEsRUFBRSxFQUFFO0FBQXRCLFVBREYsQ0FMRixFQVFFO0FBQUssVUFBQSxTQUFTLEVBQUM7QUFBZixXQUNHQyxlQUFlLENBQUNmLFFBQUQsRUFBV0ksZUFBWCxFQUE0QixLQUE1QixFQUFtQ1ksSUFBbkMsQ0FEbEIsQ0FSRixDQURGLEVBYUUsZ0NBQUMsc0NBQUQ7QUFDRSxVQUFBLFNBQVMsRUFBQyxpQkFEWjtBQUVFLFVBQUEsUUFBUSxFQUFFVCxRQUZaO0FBR0UsVUFBQSxPQUFPLEVBQUU7QUFBQSxtQkFBTU8sc0JBQXNCLENBQUMsSUFBRCxDQUE1QjtBQUFBO0FBSFgsV0FLRTtBQUFLLFVBQUEsU0FBUyxFQUFDO0FBQWYsV0FDRSxnQ0FBQywyQkFBRDtBQUFrQixVQUFBLEVBQUUsRUFBRTtBQUF0QixVQURGLENBTEYsRUFRRTtBQUFLLFVBQUEsU0FBUyxFQUFDO0FBQWYsV0FDR0MsZUFBZSxDQUFDZixRQUFELEVBQVdJLGVBQVgsRUFBNEIsSUFBNUIsRUFBa0NZLElBQWxDLENBRGxCLENBUkYsQ0FiRixDQVRGLENBNUNGLENBREYsQ0FERjtBQXFGRDtBQTVHZ0M7QUFBQTtBQUFBLElBQ0wwQixnQkFESzs7QUE4R25DYixFQUFBQSxlQUFlLENBQUM5QixTQUFoQixHQUE0QkEsU0FBNUI7QUFDQSxTQUFPLDJCQUFXOEIsZUFBWCxDQUFQO0FBQ0QsQ0FoSEQ7O2VBa0hlRCxzQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IHtFWFBPUlRfREFUQV9UWVBFX09QVElPTlN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7RmlsZVR5cGV9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCB7XG4gIFN0eWxlZEV4cG9ydFNlY3Rpb24sXG4gIFN0eWxlZEZpbHRlcmVkT3B0aW9uLFxuICBTdHlsZWRNb2RhbENvbnRlbnQsXG4gIFN0eWxlZFR5cGVcbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlLCBpbmplY3RJbnRsfSBmcm9tICdyZWFjdC1pbnRsJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBkYXRhc2V0czogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBzZWxlY3RlZERhdGFzZXQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGRhdGFUeXBlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGZpbHRlcmVkOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAvLyBjYWxsYmFja3NcbiAgYXBwbHlDUFVGaWx0ZXI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9uQ2xvc2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9uQ2hhbmdlRXhwb3J0U2VsZWN0ZWREYXRhc2V0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBvbkNoYW5nZUV4cG9ydERhdGFUeXBlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBvbkNoYW5nZUV4cG9ydEZpbHRlcmVkOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBnZXREYXRhUm93Q291bnQgPSAoZGF0YXNldHMsIHNlbGVjdGVkRGF0YXNldCwgZmlsdGVyZWQsIGludGwpID0+IHtcbiAgY29uc3Qgc2VsZWN0ZWREYXRhID0gZGF0YXNldHNbc2VsZWN0ZWREYXRhc2V0XTtcbiAgaWYgKCFzZWxlY3RlZERhdGEpIHtcbiAgICByZXR1cm4gaW50bC5mb3JtYXRNZXNzYWdlKFxuICAgICAge2lkOiAnbW9kYWwuZXhwb3J0RGF0YS5maWxlQ291bnQnfSxcbiAgICAgIHtmaWxlQ291bnQ6IE9iamVjdC5rZXlzKGRhdGFzZXRzKS5sZW5ndGh9XG4gICAgKTtcbiAgfVxuICBjb25zdCB7YWxsRGF0YSwgZmlsdGVyZWRJZHhDUFV9ID0gc2VsZWN0ZWREYXRhO1xuXG4gIGlmIChmaWx0ZXJlZCAmJiAhZmlsdGVyZWRJZHhDUFUpIHtcbiAgICByZXR1cm4gJy0nO1xuICB9XG5cbiAgY29uc3Qgcm93Q291bnQgPSBmaWx0ZXJlZCA/IGZpbHRlcmVkSWR4Q1BVLmxlbmd0aCA6IGFsbERhdGEubGVuZ3RoO1xuXG4gIHJldHVybiBpbnRsLmZvcm1hdE1lc3NhZ2UoXG4gICAge2lkOiAnbW9kYWwuZXhwb3J0RGF0YS5yb3dDb3VudCd9LFxuICAgIHtyb3dDb3VudDogcm93Q291bnQudG9Mb2NhbGVTdHJpbmcoKX1cbiAgKTtcbn07XG5cbmNvbnN0IEV4cG9ydERhdGFNb2RhbEZhY3RvcnkgPSAoKSA9PiB7XG4gIGNsYXNzIEV4cG9ydERhdGFNb2RhbCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICBjb25zdCB0b0NQVUZpbHRlciA9IHRoaXMucHJvcHMuc2VsZWN0ZWREYXRhc2V0IHx8IE9iamVjdC5rZXlzKHRoaXMucHJvcHMuZGF0YXNldHMpO1xuICAgICAgdGhpcy5wcm9wcy5hcHBseUNQVUZpbHRlcih0b0NQVUZpbHRlcik7XG4gICAgfVxuXG4gICAgX29uU2VsZWN0RGF0YXNldCA9ICh7dGFyZ2V0OiB7dmFsdWV9fSkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy5hcHBseUNQVUZpbHRlcih2YWx1ZSk7XG4gICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlRXhwb3J0U2VsZWN0ZWREYXRhc2V0KHZhbHVlKTtcbiAgICB9O1xuXG4gICAgcmVuZGVyKCkge1xuICAgICAgY29uc3Qge1xuICAgICAgICBkYXRhc2V0cyxcbiAgICAgICAgc2VsZWN0ZWREYXRhc2V0LFxuICAgICAgICBkYXRhVHlwZSxcbiAgICAgICAgZmlsdGVyZWQsXG4gICAgICAgIG9uQ2hhbmdlRXhwb3J0RGF0YVR5cGUsXG4gICAgICAgIG9uQ2hhbmdlRXhwb3J0RmlsdGVyZWQsXG4gICAgICAgIGludGxcbiAgICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3R5bGVkTW9kYWxDb250ZW50IGNsYXNzTmFtZT1cImV4cG9ydC1kYXRhLW1vZGFsXCI+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxTdHlsZWRFeHBvcnRTZWN0aW9uPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5leHBvcnREYXRhLmRhdGFzZXRUaXRsZSd9IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdWJ0aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5leHBvcnREYXRhLmRhdGFzZXRTdWJ0aXRsZSd9IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlbGVjdGlvblwiPlxuICAgICAgICAgICAgICAgIDxzZWxlY3QgdmFsdWU9e3NlbGVjdGVkRGF0YXNldH0gb25DaGFuZ2U9e3RoaXMuX29uU2VsZWN0RGF0YXNldH0+XG4gICAgICAgICAgICAgICAgICB7W2ludGwuZm9ybWF0TWVzc2FnZSh7aWQ6ICdtb2RhbC5leHBvcnREYXRhLmFsbERhdGFzZXRzJ30pXVxuICAgICAgICAgICAgICAgICAgICAuY29uY2F0KE9iamVjdC5rZXlzKGRhdGFzZXRzKSlcbiAgICAgICAgICAgICAgICAgICAgLm1hcChkID0+IChcbiAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17ZH0gdmFsdWU9e2R9PlxuICAgICAgICAgICAgICAgICAgICAgICAgeyhkYXRhc2V0c1tkXSAmJiBkYXRhc2V0c1tkXS5sYWJlbCkgfHwgZH1cbiAgICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9TdHlsZWRFeHBvcnRTZWN0aW9uPlxuICAgICAgICAgICAgPFN0eWxlZEV4cG9ydFNlY3Rpb24+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmV4cG9ydERhdGEuZGF0YVR5cGVUaXRsZSd9IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdWJ0aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5leHBvcnREYXRhLmRhdGFUeXBlU3VidGl0bGUnfSAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWxlY3Rpb25cIj5cbiAgICAgICAgICAgICAgICB7RVhQT1JUX0RBVEFfVFlQRV9PUFRJT05TLm1hcChvcCA9PiAoXG4gICAgICAgICAgICAgICAgICA8U3R5bGVkVHlwZVxuICAgICAgICAgICAgICAgICAgICBrZXk9e29wLmlkfVxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZD17ZGF0YVR5cGUgPT09IG9wLmlkfVxuICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGU9e29wLmF2YWlsYWJsZX1cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb3AuYXZhaWxhYmxlICYmIG9uQ2hhbmdlRXhwb3J0RGF0YVR5cGUob3AuaWQpfVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8RmlsZVR5cGUgZXh0PXtvcC5sYWJlbH0gaGVpZ2h0PVwiODBweFwiIGZvbnRTaXplPVwiMTFweFwiIC8+XG4gICAgICAgICAgICAgICAgICA8L1N0eWxlZFR5cGU+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9TdHlsZWRFeHBvcnRTZWN0aW9uPlxuICAgICAgICAgICAgPFN0eWxlZEV4cG9ydFNlY3Rpb24+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmV4cG9ydERhdGEuZGF0YVR5cGVUaXRsZSd9IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdWJ0aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5leHBvcnREYXRhLmZpbHRlckRhdGFTdWJ0aXRsZSd9IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlbGVjdGlvblwiPlxuICAgICAgICAgICAgICAgIDxTdHlsZWRGaWx0ZXJlZE9wdGlvblxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidW5maWx0ZXJlZC1vcHRpb25cIlxuICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ9eyFmaWx0ZXJlZH1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uQ2hhbmdlRXhwb3J0RmlsdGVyZWQoZmFsc2UpfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmlsdGVyLW9wdGlvbi10aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmV4cG9ydERhdGEudW5maWx0ZXJlZERhdGEnfSAvPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbHRlci1vcHRpb24tc3VidGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgICAge2dldERhdGFSb3dDb3VudChkYXRhc2V0cywgc2VsZWN0ZWREYXRhc2V0LCBmYWxzZSwgaW50bCl9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L1N0eWxlZEZpbHRlcmVkT3B0aW9uPlxuICAgICAgICAgICAgICAgIDxTdHlsZWRGaWx0ZXJlZE9wdGlvblxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmlsdGVyZWQtb3B0aW9uXCJcbiAgICAgICAgICAgICAgICAgIHNlbGVjdGVkPXtmaWx0ZXJlZH1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uQ2hhbmdlRXhwb3J0RmlsdGVyZWQodHJ1ZSl9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWx0ZXItb3B0aW9uLXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbW9kYWwuZXhwb3J0RGF0YS5maWx0ZXJlZERhdGEnfSAvPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbHRlci1vcHRpb24tc3VidGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgICAge2dldERhdGFSb3dDb3VudChkYXRhc2V0cywgc2VsZWN0ZWREYXRhc2V0LCB0cnVlLCBpbnRsKX1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvU3R5bGVkRmlsdGVyZWRPcHRpb24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9TdHlsZWRFeHBvcnRTZWN0aW9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L1N0eWxlZE1vZGFsQ29udGVudD5cbiAgICAgICk7XG4gICAgfVxuICB9XG4gIEV4cG9ydERhdGFNb2RhbC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG4gIHJldHVybiBpbmplY3RJbnRsKEV4cG9ydERhdGFNb2RhbCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBFeHBvcnREYXRhTW9kYWxGYWN0b3J5O1xuIl19