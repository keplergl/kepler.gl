"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _defaultSettings = require("../../constants/default-settings");

var _icons = require("../common/icons");

var _styledComponents = require("../common/styled-components");

var _reactIntl = require("react-intl");

var _localization = require("../../localization");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

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
  var ExportDataModal = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(ExportDataModal, _Component);

    var _super = _createSuper(ExportDataModal);

    function ExportDataModal() {
      var _this;

      (0, _classCallCheck2["default"])(this, ExportDataModal);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
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
            supportedDataTypes = _this$props.supportedDataTypes,
            datasets = _this$props.datasets,
            selectedDataset = _this$props.selectedDataset,
            dataType = _this$props.dataType,
            filtered = _this$props.filtered,
            onChangeExportDataType = _this$props.onChangeExportDataType,
            onChangeExportFiltered = _this$props.onChangeExportFiltered,
            intl = _this$props.intl;
        return /*#__PURE__*/_react["default"].createElement(_styledComponents.StyledModalContent, {
          className: "export-data-modal"
        }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_styledComponents.StyledExportSection, null, /*#__PURE__*/_react["default"].createElement("div", {
          className: "description"
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "title"
        }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: 'modal.exportData.datasetTitle'
        })), /*#__PURE__*/_react["default"].createElement("div", {
          className: "subtitle"
        }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: 'modal.exportData.datasetSubtitle'
        }))), /*#__PURE__*/_react["default"].createElement("div", {
          className: "selection"
        }, /*#__PURE__*/_react["default"].createElement("select", {
          value: selectedDataset,
          onChange: this._onSelectDataset
        }, [intl.formatMessage({
          id: 'modal.exportData.allDatasets'
        })].concat(Object.keys(datasets)).map(function (d) {
          return /*#__PURE__*/_react["default"].createElement("option", {
            key: d,
            value: d
          }, datasets[d] && datasets[d].label || d);
        })))), /*#__PURE__*/_react["default"].createElement(_styledComponents.StyledExportSection, null, /*#__PURE__*/_react["default"].createElement("div", {
          className: "description"
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "title"
        }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: 'modal.exportData.dataTypeTitle'
        })), /*#__PURE__*/_react["default"].createElement("div", {
          className: "subtitle"
        }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: 'modal.exportData.dataTypeSubtitle'
        }))), /*#__PURE__*/_react["default"].createElement("div", {
          className: "selection"
        }, supportedDataTypes.map(function (op) {
          return /*#__PURE__*/_react["default"].createElement(_styledComponents.StyledType, {
            key: op.id,
            selected: dataType === op.id,
            available: op.available,
            onClick: function onClick() {
              return op.available && onChangeExportDataType(op.id);
            }
          }, /*#__PURE__*/_react["default"].createElement(_icons.FileType, {
            ext: op.label,
            height: "80px",
            fontSize: "11px"
          }), dataType === op.id && /*#__PURE__*/_react["default"].createElement(_styledComponents.CheckMark, null));
        }))), /*#__PURE__*/_react["default"].createElement(_styledComponents.StyledExportSection, null, /*#__PURE__*/_react["default"].createElement("div", {
          className: "description"
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "title"
        }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: 'modal.exportData.dataTypeTitle'
        })), /*#__PURE__*/_react["default"].createElement("div", {
          className: "subtitle"
        }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: 'modal.exportData.filterDataSubtitle'
        }))), /*#__PURE__*/_react["default"].createElement("div", {
          className: "selection"
        }, /*#__PURE__*/_react["default"].createElement(_styledComponents.StyledFilteredOption, {
          className: "unfiltered-option",
          selected: !filtered,
          onClick: function onClick() {
            return onChangeExportFiltered(false);
          }
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "filter-option-title"
        }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: 'modal.exportData.unfilteredData'
        })), /*#__PURE__*/_react["default"].createElement("div", {
          className: "filter-option-subtitle"
        }, getDataRowCount(datasets, selectedDataset, false, intl)), !filtered && /*#__PURE__*/_react["default"].createElement(_styledComponents.CheckMark, null)), /*#__PURE__*/_react["default"].createElement(_styledComponents.StyledFilteredOption, {
          className: "filtered-option",
          selected: filtered,
          onClick: function onClick() {
            return onChangeExportFiltered(true);
          }
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "filter-option-title"
        }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: 'modal.exportData.filteredData'
        })), /*#__PURE__*/_react["default"].createElement("div", {
          className: "filter-option-subtitle"
        }, getDataRowCount(datasets, selectedDataset, true, intl)), filtered && /*#__PURE__*/_react["default"].createElement(_styledComponents.CheckMark, null))))));
      }
    }]);
    return ExportDataModal;
  }(_react.Component);

  ExportDataModal.propTypes = propTypes;
  ExportDataModal.defaultProps = {
    supportedDataTypes: _defaultSettings.EXPORT_DATA_TYPE_OPTIONS
  };
  return (0, _reactIntl.injectIntl)(ExportDataModal);
};

var _default = ExportDataModalFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9leHBvcnQtZGF0YS1tb2RhbC5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJkYXRhc2V0cyIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJzZWxlY3RlZERhdGFzZXQiLCJzdHJpbmciLCJkYXRhVHlwZSIsImZpbHRlcmVkIiwiYm9vbCIsImFwcGx5Q1BVRmlsdGVyIiwiZnVuYyIsIm9uQ2xvc2UiLCJvbkNoYW5nZUV4cG9ydFNlbGVjdGVkRGF0YXNldCIsIm9uQ2hhbmdlRXhwb3J0RGF0YVR5cGUiLCJvbkNoYW5nZUV4cG9ydEZpbHRlcmVkIiwiZ2V0RGF0YVJvd0NvdW50IiwiaW50bCIsInNlbGVjdGVkRGF0YSIsImZvcm1hdE1lc3NhZ2UiLCJpZCIsImZpbGVDb3VudCIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJhbGxEYXRhIiwiZmlsdGVyZWRJZHhDUFUiLCJyb3dDb3VudCIsInRvTG9jYWxlU3RyaW5nIiwiRXhwb3J0RGF0YU1vZGFsRmFjdG9yeSIsIkV4cG9ydERhdGFNb2RhbCIsInZhbHVlIiwidGFyZ2V0IiwicHJvcHMiLCJ0b0NQVUZpbHRlciIsInN1cHBvcnRlZERhdGFUeXBlcyIsIl9vblNlbGVjdERhdGFzZXQiLCJjb25jYXQiLCJtYXAiLCJkIiwibGFiZWwiLCJvcCIsImF2YWlsYWJsZSIsIkNvbXBvbmVudCIsImRlZmF1bHRQcm9wcyIsIkVYUE9SVF9EQVRBX1RZUEVfT1BUSU9OUyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFPQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsU0FBUyxHQUFHO0FBQ2hCQyxFQUFBQSxRQUFRLEVBQUVDLHNCQUFVQyxNQUFWLENBQWlCQyxVQURYO0FBRWhCQyxFQUFBQSxlQUFlLEVBQUVILHNCQUFVSSxNQUZYO0FBR2hCQyxFQUFBQSxRQUFRLEVB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QUFBO0FBSFgsd0JBS0U7QUFBSyxVQUFBLFNBQVMsRUFBQztBQUFmLHdCQUNFLGdDQUFDLDhCQUFEO0FBQWtCLFVBQUEsRUFBRSxFQUFFO0FBQXRCLFVBREYsQ0FMRixlQVFFO0FBQUssVUFBQSxTQUFTLEVBQUM7QUFBZixXQUNHQyxlQUFlLENBQUNmLFFBQUQsRUFBV0ksZUFBWCxFQUE0QixLQUE1QixFQUFtQ1ksSUFBbkMsQ0FEbEIsQ0FSRixFQVdHLENBQUNULFFBQUQsaUJBQWEsZ0NBQUMsMkJBQUQsT0FYaEIsQ0FERixlQWNFLGdDQUFDLHNDQUFEO0FBQ0UsVUFBQSxTQUFTLEVBQUMsaUJBRFo7QUFFRSxVQUFBLFFBQVEsRUFBRUEsUUFGWjtBQUdFLFVBQUEsT0FBTyxFQUFFO0FBQUEsbUJBQU1PLHNCQUFzQixDQUFDLElBQUQsQ0FBNUI7QUFBQTtBQUhYLHdCQUtFO0FBQUssVUFBQSxTQUFTLEVBQUM7QUFBZix3QkFDRSxnQ0FBQyw4QkFBRDtBQUFrQixVQUFBLEVBQUUsRUFBRTtBQUF0QixVQURGLENBTEYsZUFRRTtBQUFLLFVBQUEsU0FBUyxFQUFDO0FBQWYsV0FDR0MsZUFBZSxDQUFDZixRQUFELEVBQVdJLGVBQVgsRUFBNEIsSUFBNUIsRUFBa0NZLElBQWxDLENBRGxCLENBUkYsRUFXR1QsUUFBUSxpQkFBSSxnQ0FBQywyQkFBRCxPQVhmLENBZEYsQ0FURixDQTdDRixDQURGLENBREY7QUF3RkQ7QUFoSGdDO0FBQUE7QUFBQSxJQUNMbUMsZ0JBREs7O0FBa0huQ2IsRUFBQUEsZUFBZSxDQUFDOUIsU0FBaEIsR0FBNEJBLFNBQTVCO0FBQ0E4QixFQUFBQSxlQUFlLENBQUNjLFlBQWhCLEdBQStCO0FBQzdCVCxJQUFBQSxrQkFBa0IsRUFBRVU7QUFEUyxHQUEvQjtBQUlBLFNBQU8sMkJBQVdmLGVBQVgsQ0FBUDtBQUNELENBeEhEOztlQTBIZUQsc0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCB7RVhQT1JUX0RBVEFfVFlQRV9PUFRJT05TfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQge0ZpbGVUeXBlfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQge1xuICBTdHlsZWRFeHBvcnRTZWN0aW9uLFxuICBTdHlsZWRGaWx0ZXJlZE9wdGlvbixcbiAgU3R5bGVkTW9kYWxDb250ZW50LFxuICBTdHlsZWRUeXBlLFxuICBDaGVja01hcmtcbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtpbmplY3RJbnRsfSBmcm9tICdyZWFjdC1pbnRsJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAnbG9jYWxpemF0aW9uJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBkYXRhc2V0czogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBzZWxlY3RlZERhdGFzZXQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGRhdGFUeXBlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGZpbHRlcmVkOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAvLyBjYWxsYmFja3NcbiAgYXBwbHlDUFVGaWx0ZXI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9uQ2xvc2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9uQ2hhbmdlRXhwb3J0U2VsZWN0ZWREYXRhc2V0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBvbkNoYW5nZUV4cG9ydERhdGFUeXBlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBvbkNoYW5nZUV4cG9ydEZpbHRlcmVkOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBnZXREYXRhUm93Q291bnQgPSAoZGF0YXNldHMsIHNlbGVjdGVkRGF0YXNldCwgZmlsdGVyZWQsIGludGwpID0+IHtcbiAgY29uc3Qgc2VsZWN0ZWREYXRhID0gZGF0YXNldHNbc2VsZWN0ZWREYXRhc2V0XTtcbiAgaWYgKCFzZWxlY3RlZERhdGEpIHtcbiAgICByZXR1cm4gaW50bC5mb3JtYXRNZXNzYWdlKFxuICAgICAge2lkOiAnbW9kYWwuZXhwb3J0RGF0YS5maWxlQ291bnQnfSxcbiAgICAgIHtmaWxlQ291bnQ6IE9iamVjdC5rZXlzKGRhdGFzZXRzKS5sZW5ndGh9XG4gICAgKTtcbiAgfVxuICBjb25zdCB7YWxsRGF0YSwgZmlsdGVyZWRJZHhDUFV9ID0gc2VsZWN0ZWREYXRhO1xuXG4gIGlmIChmaWx0ZXJlZCAmJiAhZmlsdGVyZWRJZHhDUFUpIHtcbiAgICByZXR1cm4gJy0nO1xuICB9XG5cbiAgY29uc3Qgcm93Q291bnQgPSBmaWx0ZXJlZCA/IGZpbHRlcmVkSWR4Q1BVLmxlbmd0aCA6IGFsbERhdGEubGVuZ3RoO1xuXG4gIHJldHVybiBpbnRsLmZvcm1hdE1lc3NhZ2UoXG4gICAge2lkOiAnbW9kYWwuZXhwb3J0RGF0YS5yb3dDb3VudCd9LFxuICAgIHtyb3dDb3VudDogcm93Q291bnQudG9Mb2NhbGVTdHJpbmcoKX1cbiAgKTtcbn07XG5cbmNvbnN0IEV4cG9ydERhdGFNb2RhbEZhY3RvcnkgPSAoKSA9PiB7XG4gIGNsYXNzIEV4cG9ydERhdGFNb2RhbCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICBjb25zdCB0b0NQVUZpbHRlciA9IHRoaXMucHJvcHMuc2VsZWN0ZWREYXRhc2V0IHx8IE9iamVjdC5rZXlzKHRoaXMucHJvcHMuZGF0YXNldHMpO1xuICAgICAgdGhpcy5wcm9wcy5hcHBseUNQVUZpbHRlcih0b0NQVUZpbHRlcik7XG4gICAgfVxuXG4gICAgX29uU2VsZWN0RGF0YXNldCA9ICh7dGFyZ2V0OiB7dmFsdWV9fSkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy5hcHBseUNQVUZpbHRlcih2YWx1ZSk7XG4gICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlRXhwb3J0U2VsZWN0ZWREYXRhc2V0KHZhbHVlKTtcbiAgICB9O1xuXG4gICAgcmVuZGVyKCkge1xuICAgICAgY29uc3Qge1xuICAgICAgICBzdXBwb3J0ZWREYXRhVHlwZXMsXG4gICAgICAgIGRhdGFzZXRzLFxuICAgICAgICBzZWxlY3RlZERhdGFzZXQsXG4gICAgICAgIGRhdGFUeXBlLFxuICAgICAgICBmaWx0ZXJlZCxcbiAgICAgICAgb25DaGFuZ2VFeHBvcnREYXRhVHlwZSxcbiAgICAgICAgb25DaGFuZ2VFeHBvcnRGaWx0ZXJlZCxcbiAgICAgICAgaW50bFxuICAgICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxTdHlsZWRNb2RhbENvbnRlbnQgY2xhc3NOYW1lPVwiZXhwb3J0LWRhdGEtbW9kYWxcIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPFN0eWxlZEV4cG9ydFNlY3Rpb24+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmV4cG9ydERhdGEuZGF0YXNldFRpdGxlJ30gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN1YnRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmV4cG9ydERhdGEuZGF0YXNldFN1YnRpdGxlJ30gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VsZWN0aW9uXCI+XG4gICAgICAgICAgICAgICAgPHNlbGVjdCB2YWx1ZT17c2VsZWN0ZWREYXRhc2V0fSBvbkNoYW5nZT17dGhpcy5fb25TZWxlY3REYXRhc2V0fT5cbiAgICAgICAgICAgICAgICAgIHtbaW50bC5mb3JtYXRNZXNzYWdlKHtpZDogJ21vZGFsLmV4cG9ydERhdGEuYWxsRGF0YXNldHMnfSldXG4gICAgICAgICAgICAgICAgICAgIC5jb25jYXQoT2JqZWN0LmtleXMoZGF0YXNldHMpKVxuICAgICAgICAgICAgICAgICAgICAubWFwKGQgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtkfSB2YWx1ZT17ZH0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7KGRhdGFzZXRzW2RdICYmIGRhdGFzZXRzW2RdLmxhYmVsKSB8fCBkfVxuICAgICAgICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L1N0eWxlZEV4cG9ydFNlY3Rpb24+XG4gICAgICAgICAgICA8U3R5bGVkRXhwb3J0U2VjdGlvbj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbW9kYWwuZXhwb3J0RGF0YS5kYXRhVHlwZVRpdGxlJ30gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN1YnRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmV4cG9ydERhdGEuZGF0YVR5cGVTdWJ0aXRsZSd9IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlbGVjdGlvblwiPlxuICAgICAgICAgICAgICAgIHtzdXBwb3J0ZWREYXRhVHlwZXMubWFwKG9wID0+IChcbiAgICAgICAgICAgICAgICAgIDxTdHlsZWRUeXBlXG4gICAgICAgICAgICAgICAgICAgIGtleT17b3AuaWR9XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkPXtkYXRhVHlwZSA9PT0gb3AuaWR9XG4gICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZT17b3AuYXZhaWxhYmxlfVxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvcC5hdmFpbGFibGUgJiYgb25DaGFuZ2VFeHBvcnREYXRhVHlwZShvcC5pZCl9XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxGaWxlVHlwZSBleHQ9e29wLmxhYmVsfSBoZWlnaHQ9XCI4MHB4XCIgZm9udFNpemU9XCIxMXB4XCIgLz5cbiAgICAgICAgICAgICAgICAgICAge2RhdGFUeXBlID09PSBvcC5pZCAmJiA8Q2hlY2tNYXJrIC8+fVxuICAgICAgICAgICAgICAgICAgPC9TdHlsZWRUeXBlPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvU3R5bGVkRXhwb3J0U2VjdGlvbj5cbiAgICAgICAgICAgIDxTdHlsZWRFeHBvcnRTZWN0aW9uPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5leHBvcnREYXRhLmRhdGFUeXBlVGl0bGUnfSAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3VidGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbW9kYWwuZXhwb3J0RGF0YS5maWx0ZXJEYXRhU3VidGl0bGUnfSAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWxlY3Rpb25cIj5cbiAgICAgICAgICAgICAgICA8U3R5bGVkRmlsdGVyZWRPcHRpb25cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInVuZmlsdGVyZWQtb3B0aW9uXCJcbiAgICAgICAgICAgICAgICAgIHNlbGVjdGVkPXshZmlsdGVyZWR9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNoYW5nZUV4cG9ydEZpbHRlcmVkKGZhbHNlKX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbHRlci1vcHRpb24tdGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5leHBvcnREYXRhLnVuZmlsdGVyZWREYXRhJ30gLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWx0ZXItb3B0aW9uLXN1YnRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgIHtnZXREYXRhUm93Q291bnQoZGF0YXNldHMsIHNlbGVjdGVkRGF0YXNldCwgZmFsc2UsIGludGwpfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICB7IWZpbHRlcmVkICYmIDxDaGVja01hcmsgLz59XG4gICAgICAgICAgICAgICAgPC9TdHlsZWRGaWx0ZXJlZE9wdGlvbj5cbiAgICAgICAgICAgICAgICA8U3R5bGVkRmlsdGVyZWRPcHRpb25cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZpbHRlcmVkLW9wdGlvblwiXG4gICAgICAgICAgICAgICAgICBzZWxlY3RlZD17ZmlsdGVyZWR9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNoYW5nZUV4cG9ydEZpbHRlcmVkKHRydWUpfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmlsdGVyLW9wdGlvbi10aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmV4cG9ydERhdGEuZmlsdGVyZWREYXRhJ30gLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWx0ZXItb3B0aW9uLXN1YnRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgIHtnZXREYXRhUm93Q291bnQoZGF0YXNldHMsIHNlbGVjdGVkRGF0YXNldCwgdHJ1ZSwgaW50bCl9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIHtmaWx0ZXJlZCAmJiA8Q2hlY2tNYXJrIC8+fVxuICAgICAgICAgICAgICAgIDwvU3R5bGVkRmlsdGVyZWRPcHRpb24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9TdHlsZWRFeHBvcnRTZWN0aW9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L1N0eWxlZE1vZGFsQ29udGVudD5cbiAgICAgICk7XG4gICAgfVxuICB9XG4gIEV4cG9ydERhdGFNb2RhbC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG4gIEV4cG9ydERhdGFNb2RhbC5kZWZhdWx0UHJvcHMgPSB7XG4gICAgc3VwcG9ydGVkRGF0YVR5cGVzOiBFWFBPUlRfREFUQV9UWVBFX09QVElPTlNcbiAgfTtcblxuICByZXR1cm4gaW5qZWN0SW50bChFeHBvcnREYXRhTW9kYWwpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRXhwb3J0RGF0YU1vZGFsRmFjdG9yeTtcbiJdfQ==