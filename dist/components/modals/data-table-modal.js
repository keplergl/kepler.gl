"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.DatasetTabs = exports.DatasetModalTab = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireWildcard(require("styled-components"));

var _datasetLabel = _interopRequireDefault(require("../common/dataset-label"));

var _dataTable = _interopRequireDefault(require("../common/data-table"));

var _reselect = require("reselect");

var _cellSize = require("../common/data-table/cell-size");

var _canvas = _interopRequireDefault(require("../common/data-table/canvas"));

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var dgSettings = {
  sidePadding: '38px',
  verticalPadding: '16px',
  height: '36px'
};

var StyledModal = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  min-height: 70vh;\n  overflow: hidden;\n  display: flex;\n"])));

var DatasetCatalog = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  padding: ", " ", " 0;\n"])), dgSettings.verticalPadding, dgSettings.sidePadding);

var DatasetModalTab = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  align-items: center;\n  border-bottom: 3px solid ", ";\n  cursor: pointer;\n  display: flex;\n  height: 35px;\n  margin: 0 3px;\n  padding: 0 5px;\n\n  :first-child {\n    margin-left: 0;\n    padding-left: 0;\n  }\n"])), function (props) {
  return props.active ? 'black' : 'transparent';
});

exports.DatasetModalTab = DatasetModalTab;

var DatasetTabsUnmemoized = function DatasetTabsUnmemoized(_ref) {
  var activeDataset = _ref.activeDataset,
      datasets = _ref.datasets,
      showDatasetTable = _ref.showDatasetTable;
  return /*#__PURE__*/_react["default"].createElement(DatasetCatalog, {
    className: "dataset-modal-catalog"
  }, Object.values(datasets).map(function (dataset) {
    return /*#__PURE__*/_react["default"].createElement(DatasetModalTab, {
      className: "dataset-modal-tab",
      active: dataset === activeDataset,
      key: dataset.id,
      onClick: function onClick() {
        return showDatasetTable(dataset.id);
      }
    }, /*#__PURE__*/_react["default"].createElement(_datasetLabel["default"], {
      dataset: dataset
    }));
  }));
};

var DatasetTabs = /*#__PURE__*/_react["default"].memo(DatasetTabsUnmemoized);

exports.DatasetTabs = DatasetTabs;
DatasetTabs.displayName = 'DatasetTabs';
DataTableModalFactory.deps = [_dataTable["default"]];

var TableContainer = _styledComponents["default"].div(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  min-height: 100%;\n  max-height: 100%;\n"])));

function DataTableModalFactory(DataTable) {
  var DataTableModal = /*#__PURE__*/function (_React$Component) {
    (0, _inherits2["default"])(DataTableModal, _React$Component);

    var _super = _createSuper(DataTableModal);

    function DataTableModal() {
      var _this;

      (0, _classCallCheck2["default"])(this, DataTableModal);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "datasetCellSizeCache", {});
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "dataId", function (props) {
        return props.dataId;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "datasets", function (props) {
        return props.datasets;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "fields", function (props) {
        return (props.datasets[props.dataId] || {}).fields;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "columns", (0, _reselect.createSelector)(_this.fields, function (fields) {
        return fields.map(function (f) {
          return f.name;
        });
      }));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "colMeta", (0, _reselect.createSelector)(_this.fields, function (fields) {
        return fields.reduce(function (acc, _ref2) {
          var name = _ref2.name,
              displayName = _ref2.displayName,
              type = _ref2.type;
          return _objectSpread(_objectSpread({}, acc), {}, (0, _defineProperty2["default"])({}, name, {
            name: displayName || name,
            type: type
          }));
        }, {});
      }));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "cellSizeCache", (0, _reselect.createSelector)(_this.dataId, _this.datasets, function (dataId, datasets) {
        if (!datasets[dataId]) {
          return {};
        }

        var _datasets$dataId = datasets[dataId],
            fields = _datasets$dataId.fields,
            allData = _datasets$dataId.allData;
        var showCalculate = null;

        if (!_this.datasetCellSizeCache[dataId]) {
          showCalculate = true;
        } else if (_this.datasetCellSizeCache[dataId].fields !== fields || _this.datasetCellSizeCache[dataId].allData !== allData) {
          showCalculate = true;
        }

        if (!showCalculate) {
          return _this.datasetCellSizeCache[dataId].cellSizeCache;
        }

        var cellSizeCache = fields.reduce(function (acc, field, colIdx) {
          return _objectSpread(_objectSpread({}, acc), {}, (0, _defineProperty2["default"])({}, field.name, (0, _cellSize.renderedSize)({
            text: {
              rows: allData,
              column: field.name
            },
            colIdx: colIdx,
            type: field.type,
            fontSize: _this.props.theme.cellFontSize,
            font: _this.props.theme.fontFamily
          })));
        }, {}); // save it to cache

        _this.datasetCellSizeCache[dataId] = {
          cellSizeCache: cellSizeCache,
          fields: fields,
          allData: allData
        };
        return cellSizeCache;
      }));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "copyTableColumn", function (column) {
        var _this$props = _this.props,
            dataId = _this$props.dataId,
            copyTableColumn = _this$props.copyTableColumn;
        copyTableColumn(dataId, column);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "pinTableColumn", function (column) {
        var _this$props2 = _this.props,
            dataId = _this$props2.dataId,
            pinTableColumn = _this$props2.pinTableColumn;
        pinTableColumn(dataId, column);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "sortTableColumn", function (column, mode) {
        var _this$props3 = _this.props,
            dataId = _this$props3.dataId,
            sortTableColumn = _this$props3.sortTableColumn;
        sortTableColumn(dataId, column, mode);
      });
      return _this;
    }

    (0, _createClass2["default"])(DataTableModal, [{
      key: "render",
      value: function render() {
        var _this$props4 = this.props,
            datasets = _this$props4.datasets,
            dataId = _this$props4.dataId,
            showDatasetTable = _this$props4.showDatasetTable,
            showTab = _this$props4.showTab;

        if (!datasets || !dataId) {
          return null;
        }

        var activeDataset = datasets[dataId];
        var columns = this.columns(this.props);
        var colMeta = this.colMeta(this.props);
        var cellSizeCache = this.cellSizeCache(this.props);
        return /*#__PURE__*/_react["default"].createElement(StyledModal, {
          className: "dataset-modal",
          id: "dataset-modal"
        }, /*#__PURE__*/_react["default"].createElement(_canvas["default"], null), /*#__PURE__*/_react["default"].createElement(TableContainer, null, showTab ? /*#__PURE__*/_react["default"].createElement(DatasetTabs, {
          activeDataset: activeDataset,
          datasets: datasets,
          showDatasetTable: showDatasetTable
        }) : null, datasets[dataId] ? /*#__PURE__*/_react["default"].createElement(DataTable, {
          key: dataId,
          columns: columns,
          colMeta: colMeta,
          cellSizeCache: cellSizeCache,
          rows: activeDataset.allData,
          pinnedColumns: activeDataset.pinnedColumns,
          sortOrder: activeDataset.sortOrder,
          sortColumn: activeDataset.sortColumn,
          copyTableColumn: this.copyTableColumn,
          pinTableColumn: this.pinTableColumn,
          sortTableColumn: this.sortTableColumn
        }) : null));
      }
    }]);
    return DataTableModal;
  }(_react["default"].Component);

  DataTableModal.defaultProps = {
    showTab: true
  };
  return (0, _styledComponents.withTheme)(DataTableModal);
}

var _default = DataTableModalFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9kYXRhLXRhYmxlLW1vZGFsLmpzIl0sIm5hbWVzIjpbImRnU2V0dGluZ3MiLCJzaWRlUGFkZGluZyIsInZlcnRpY2FsUGFkZGluZyIsImhlaWdodCIsIlN0eWxlZE1vZGFsIiwic3R5bGVkIiwiZGl2IiwiRGF0YXNldENhdGFsb2ciLCJEYXRhc2V0TW9kYWxUYWIiLCJwcm9wcyIsImFjdGl2ZSIsIkRhdGFzZXRUYWJzVW5tZW1vaXplZCIsImFjdGl2ZURhdGFzZXQiLCJkYXRhc2V0cyIsInNob3dEYXRhc2V0VGFibGUiLCJPYmplY3QiLCJ2YWx1ZXMiLCJtYXAiLCJkYXRhc2V0IiwiaWQiLCJEYXRhc2V0VGFicyIsIlJlYWN0IiwibWVtbyIsImRpc3BsYXlOYW1lIiwiRGF0YVRhYmxlTW9kYWxGYWN0b3J5IiwiZGVwcyIsIkRhdGFUYWJsZUZhY3RvcnkiLCJUYWJsZUNvbnRhaW5lciIsIkRhdGFUYWJsZSIsIkRhdGFUYWJsZU1vZGFsIiwiZGF0YUlkIiwiZmllbGRzIiwiZiIsIm5hbWUiLCJyZWR1Y2UiLCJhY2MiLCJ0eXBlIiwiYWxsRGF0YSIsInNob3dDYWxjdWxhdGUiLCJkYXRhc2V0Q2VsbFNpemVDYWNoZSIsImNlbGxTaXplQ2FjaGUiLCJmaWVsZCIsImNvbElkeCIsInRleHQiLCJyb3dzIiwiY29sdW1uIiwiZm9udFNpemUiLCJ0aGVtZSIsImNlbGxGb250U2l6ZSIsImZvbnQiLCJmb250RmFtaWx5IiwiY29weVRhYmxlQ29sdW1uIiwicGluVGFibGVDb2x1bW4iLCJtb2RlIiwic29ydFRhYmxlQ29sdW1uIiwic2hvd1RhYiIsImNvbHVtbnMiLCJjb2xNZXRhIiwicGlubmVkQ29sdW1ucyIsInNvcnRPcmRlciIsInNvcnRDb2x1bW4iLCJDb21wb25lbnQiLCJkZWZhdWx0UHJvcHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFD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VUFBQSxHQUFHLEVBQUVBLE1BRFA7QUFFRSxVQUFBLE9BQU8sRUFBRTBCLE9BRlg7QUFHRSxVQUFBLE9BQU8sRUFBRUMsT0FIWDtBQUlFLFVBQUEsYUFBYSxFQUFFakIsYUFKakI7QUFLRSxVQUFBLElBQUksRUFBRTVCLGFBQWEsQ0FBQ3lCLE9BTHRCO0FBTUUsVUFBQSxhQUFhLEVBQUV6QixhQUFhLENBQUM4QyxhQU4vQjtBQU9FLFVBQUEsU0FBUyxFQUFFOUMsYUFBYSxDQUFDK0MsU0FQM0I7QUFRRSxVQUFBLFVBQVUsRUFBRS9DLGFBQWEsQ0FBQ2dELFVBUjVCO0FBU0UsVUFBQSxlQUFlLEVBQUUsS0FBS1QsZUFUeEI7QUFVRSxVQUFBLGNBQWMsRUFBRSxLQUFLQyxjQVZ2QjtBQVdFLFVBQUEsZUFBZSxFQUFFLEtBQUtFO0FBWHhCLFVBREQsR0FjRyxJQXRCTixDQUZGLENBREY7QUE2QkQ7QUF2SHFDO0FBQUE7QUFBQSxJQUNYakMsa0JBQU13QyxTQURLOztBQXlIeENoQyxFQUFBQSxjQUFjLENBQUNpQyxZQUFmLEdBQThCO0FBQzVCUCxJQUFBQSxPQUFPLEVBQUU7QUFEbUIsR0FBOUI7QUFHQSxTQUFPLGlDQUFVMUIsY0FBVixDQUFQO0FBQ0Q7O2VBRWNMLHFCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQsIHt3aXRoVGhlbWV9IGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBEYXRhc2V0TGFiZWwgZnJvbSAnY29tcG9uZW50cy9jb21tb24vZGF0YXNldC1sYWJlbCc7XG5pbXBvcnQgRGF0YVRhYmxlRmFjdG9yeSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9kYXRhLXRhYmxlJztcbmltcG9ydCB7Y3JlYXRlU2VsZWN0b3J9IGZyb20gJ3Jlc2VsZWN0JztcbmltcG9ydCB7cmVuZGVyZWRTaXplfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9kYXRhLXRhYmxlL2NlbGwtc2l6ZSc7XG5pbXBvcnQgQ2FudmFzSGFjayBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9kYXRhLXRhYmxlL2NhbnZhcyc7XG5cbmNvbnN0IGRnU2V0dGluZ3MgPSB7XG4gIHNpZGVQYWRkaW5nOiAnMzhweCcsXG4gIHZlcnRpY2FsUGFkZGluZzogJzE2cHgnLFxuICBoZWlnaHQ6ICczNnB4J1xufTtcblxuY29uc3QgU3R5bGVkTW9kYWwgPSBzdHlsZWQuZGl2YFxuICBtaW4taGVpZ2h0OiA3MHZoO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBkaXNwbGF5OiBmbGV4O1xuYDtcblxuY29uc3QgRGF0YXNldENhdGFsb2cgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBwYWRkaW5nOiAke2RnU2V0dGluZ3MudmVydGljYWxQYWRkaW5nfSAke2RnU2V0dGluZ3Muc2lkZVBhZGRpbmd9IDA7XG5gO1xuXG5leHBvcnQgY29uc3QgRGF0YXNldE1vZGFsVGFiID0gc3R5bGVkLmRpdmBcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkICR7cHJvcHMgPT4gKHByb3BzLmFjdGl2ZSA/ICdibGFjaycgOiAndHJhbnNwYXJlbnQnKX07XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgZGlzcGxheTogZmxleDtcbiAgaGVpZ2h0OiAzNXB4O1xuICBtYXJnaW46IDAgM3B4O1xuICBwYWRkaW5nOiAwIDVweDtcblxuICA6Zmlyc3QtY2hpbGQge1xuICAgIG1hcmdpbi1sZWZ0OiAwO1xuICAgIHBhZGRpbmctbGVmdDogMDtcbiAgfVxuYDtcblxuY29uc3QgRGF0YXNldFRhYnNVbm1lbW9pemVkID0gKHthY3RpdmVEYXRhc2V0LCBkYXRhc2V0cywgc2hvd0RhdGFzZXRUYWJsZX0pID0+IChcbiAgPERhdGFzZXRDYXRhbG9nIGNsYXNzTmFtZT1cImRhdGFzZXQtbW9kYWwtY2F0YWxvZ1wiPlxuICAgIHtPYmplY3QudmFsdWVzKGRhdGFzZXRzKS5tYXAoZGF0YXNldCA9PiAoXG4gICAgICA8RGF0YXNldE1vZGFsVGFiXG4gICAgICAgIGNsYXNzTmFtZT1cImRhdGFzZXQtbW9kYWwtdGFiXCJcbiAgICAgICAgYWN0aXZlPXtkYXRhc2V0ID09PSBhY3RpdmVEYXRhc2V0fVxuICAgICAgICBrZXk9e2RhdGFzZXQuaWR9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHNob3dEYXRhc2V0VGFibGUoZGF0YXNldC5pZCl9XG4gICAgICA+XG4gICAgICAgIDxEYXRhc2V0TGFiZWwgZGF0YXNldD17ZGF0YXNldH0gLz5cbiAgICAgIDwvRGF0YXNldE1vZGFsVGFiPlxuICAgICkpfVxuICA8L0RhdGFzZXRDYXRhbG9nPlxuKTtcblxuZXhwb3J0IGNvbnN0IERhdGFzZXRUYWJzID0gUmVhY3QubWVtbyhEYXRhc2V0VGFic1VubWVtb2l6ZWQpO1xuXG5EYXRhc2V0VGFicy5kaXNwbGF5TmFtZSA9ICdEYXRhc2V0VGFicyc7XG5cbkRhdGFUYWJsZU1vZGFsRmFjdG9yeS5kZXBzID0gW0RhdGFUYWJsZUZhY3RvcnldO1xuXG5jb25zdCBUYWJsZUNvbnRhaW5lciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGZsZXgtZ3JvdzogMTtcbiAgbWluLWhlaWdodDogMTAwJTtcbiAgbWF4LWhlaWdodDogMTAwJTtcbmA7XG5cbmZ1bmN0aW9uIERhdGFUYWJsZU1vZGFsRmFjdG9yeShEYXRhVGFibGUpIHtcbiAgY2xhc3MgRGF0YVRhYmxlTW9kYWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGRhdGFzZXRDZWxsU2l6ZUNhY2hlID0ge307XG4gICAgZGF0YUlkID0gcHJvcHMgPT4gcHJvcHMuZGF0YUlkO1xuICAgIGRhdGFzZXRzID0gcHJvcHMgPT4gcHJvcHMuZGF0YXNldHM7XG4gICAgZmllbGRzID0gcHJvcHMgPT4gKHByb3BzLmRhdGFzZXRzW3Byb3BzLmRhdGFJZF0gfHwge30pLmZpZWxkcztcbiAgICBjb2x1bW5zID0gY3JlYXRlU2VsZWN0b3IodGhpcy5maWVsZHMsIGZpZWxkcyA9PiBmaWVsZHMubWFwKGYgPT4gZi5uYW1lKSk7XG4gICAgY29sTWV0YSA9IGNyZWF0ZVNlbGVjdG9yKHRoaXMuZmllbGRzLCBmaWVsZHMgPT5cbiAgICAgIGZpZWxkcy5yZWR1Y2UoXG4gICAgICAgIChhY2MsIHtuYW1lLCBkaXNwbGF5TmFtZSwgdHlwZX0pID0+ICh7XG4gICAgICAgICAgLi4uYWNjLFxuICAgICAgICAgIFtuYW1lXToge1xuICAgICAgICAgICAgbmFtZTogZGlzcGxheU5hbWUgfHwgbmFtZSxcbiAgICAgICAgICAgIHR5cGVcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICB7fVxuICAgICAgKVxuICAgICk7XG5cbiAgICBjZWxsU2l6ZUNhY2hlID0gY3JlYXRlU2VsZWN0b3IodGhpcy5kYXRhSWQsIHRoaXMuZGF0YXNldHMsIChkYXRhSWQsIGRhdGFzZXRzKSA9PiB7XG4gICAgICBpZiAoIWRhdGFzZXRzW2RhdGFJZF0pIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfVxuICAgICAgY29uc3Qge2ZpZWxkcywgYWxsRGF0YX0gPSBkYXRhc2V0c1tkYXRhSWRdO1xuXG4gICAgICBsZXQgc2hvd0NhbGN1bGF0ZSA9IG51bGw7XG4gICAgICBpZiAoIXRoaXMuZGF0YXNldENlbGxTaXplQ2FjaGVbZGF0YUlkXSkge1xuICAgICAgICBzaG93Q2FsY3VsYXRlID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHRoaXMuZGF0YXNldENlbGxTaXplQ2FjaGVbZGF0YUlkXS5maWVsZHMgIT09IGZpZWxkcyB8fFxuICAgICAgICB0aGlzLmRhdGFzZXRDZWxsU2l6ZUNhY2hlW2RhdGFJZF0uYWxsRGF0YSAhPT0gYWxsRGF0YVxuICAgICAgKSB7XG4gICAgICAgIHNob3dDYWxjdWxhdGUgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXNob3dDYWxjdWxhdGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YXNldENlbGxTaXplQ2FjaGVbZGF0YUlkXS5jZWxsU2l6ZUNhY2hlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjZWxsU2l6ZUNhY2hlID0gZmllbGRzLnJlZHVjZShcbiAgICAgICAgKGFjYywgZmllbGQsIGNvbElkeCkgPT4gKHtcbiAgICAgICAgICAuLi5hY2MsXG4gICAgICAgICAgW2ZpZWxkLm5hbWVdOiByZW5kZXJlZFNpemUoe1xuICAgICAgICAgICAgdGV4dDoge1xuICAgICAgICAgICAgICByb3dzOiBhbGxEYXRhLFxuICAgICAgICAgICAgICBjb2x1bW46IGZpZWxkLm5hbWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb2xJZHgsXG4gICAgICAgICAgICB0eXBlOiBmaWVsZC50eXBlLFxuICAgICAgICAgICAgZm9udFNpemU6IHRoaXMucHJvcHMudGhlbWUuY2VsbEZvbnRTaXplLFxuICAgICAgICAgICAgZm9udDogdGhpcy5wcm9wcy50aGVtZS5mb250RmFtaWx5XG4gICAgICAgICAgfSlcbiAgICAgICAgfSksXG4gICAgICAgIHt9XG4gICAgICApO1xuICAgICAgLy8gc2F2ZSBpdCB0byBjYWNoZVxuICAgICAgdGhpcy5kYXRhc2V0Q2VsbFNpemVDYWNoZVtkYXRhSWRdID0ge1xuICAgICAgICBjZWxsU2l6ZUNhY2hlLFxuICAgICAgICBmaWVsZHMsXG4gICAgICAgIGFsbERhdGFcbiAgICAgIH07XG4gICAgICByZXR1cm4gY2VsbFNpemVDYWNoZTtcbiAgICB9KTtcblxuICAgIGNvcHlUYWJsZUNvbHVtbiA9IGNvbHVtbiA9PiB7XG4gICAgICBjb25zdCB7ZGF0YUlkLCBjb3B5VGFibGVDb2x1bW59ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvcHlUYWJsZUNvbHVtbihkYXRhSWQsIGNvbHVtbik7XG4gICAgfTtcblxuICAgIHBpblRhYmxlQ29sdW1uID0gY29sdW1uID0+IHtcbiAgICAgIGNvbnN0IHtkYXRhSWQsIHBpblRhYmxlQ29sdW1ufSA9IHRoaXMucHJvcHM7XG4gICAgICBwaW5UYWJsZUNvbHVtbihkYXRhSWQsIGNvbHVtbik7XG4gICAgfTtcblxuICAgIHNvcnRUYWJsZUNvbHVtbiA9IChjb2x1bW4sIG1vZGUpID0+IHtcbiAgICAgIGNvbnN0IHtkYXRhSWQsIHNvcnRUYWJsZUNvbHVtbn0gPSB0aGlzLnByb3BzO1xuICAgICAgc29ydFRhYmxlQ29sdW1uKGRhdGFJZCwgY29sdW1uLCBtb2RlKTtcbiAgICB9O1xuXG4gICAgcmVuZGVyKCkge1xuICAgICAgY29uc3Qge2RhdGFzZXRzLCBkYXRhSWQsIHNob3dEYXRhc2V0VGFibGUsIHNob3dUYWJ9ID0gdGhpcy5wcm9wcztcbiAgICAgIGlmICghZGF0YXNldHMgfHwgIWRhdGFJZCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFjdGl2ZURhdGFzZXQgPSBkYXRhc2V0c1tkYXRhSWRdO1xuICAgICAgY29uc3QgY29sdW1ucyA9IHRoaXMuY29sdW1ucyh0aGlzLnByb3BzKTtcbiAgICAgIGNvbnN0IGNvbE1ldGEgPSB0aGlzLmNvbE1ldGEodGhpcy5wcm9wcyk7XG4gICAgICBjb25zdCBjZWxsU2l6ZUNhY2hlID0gdGhpcy5jZWxsU2l6ZUNhY2hlKHRoaXMucHJvcHMpO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3R5bGVkTW9kYWwgY2xhc3NOYW1lPVwiZGF0YXNldC1tb2RhbFwiIGlkPVwiZGF0YXNldC1tb2RhbFwiPlxuICAgICAgICAgIDxDYW52YXNIYWNrIC8+XG4gICAgICAgICAgPFRhYmxlQ29udGFpbmVyPlxuICAgICAgICAgICAge3Nob3dUYWIgPyAoXG4gICAgICAgICAgICAgIDxEYXRhc2V0VGFic1xuICAgICAgICAgICAgICAgIGFjdGl2ZURhdGFzZXQ9e2FjdGl2ZURhdGFzZXR9XG4gICAgICAgICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgICAgICAgIHNob3dEYXRhc2V0VGFibGU9e3Nob3dEYXRhc2V0VGFibGV9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgIHtkYXRhc2V0c1tkYXRhSWRdID8gKFxuICAgICAgICAgICAgICA8RGF0YVRhYmxlXG4gICAgICAgICAgICAgICAga2V5PXtkYXRhSWR9XG4gICAgICAgICAgICAgICAgY29sdW1ucz17Y29sdW1uc31cbiAgICAgICAgICAgICAgICBjb2xNZXRhPXtjb2xNZXRhfVxuICAgICAgICAgICAgICAgIGNlbGxTaXplQ2FjaGU9e2NlbGxTaXplQ2FjaGV9XG4gICAgICAgICAgICAgICAgcm93cz17YWN0aXZlRGF0YXNldC5hbGxEYXRhfVxuICAgICAgICAgICAgICAgIHBpbm5lZENvbHVtbnM9e2FjdGl2ZURhdGFzZXQucGlubmVkQ29sdW1uc31cbiAgICAgICAgICAgICAgICBzb3J0T3JkZXI9e2FjdGl2ZURhdGFzZXQuc29ydE9yZGVyfVxuICAgICAgICAgICAgICAgIHNvcnRDb2x1bW49e2FjdGl2ZURhdGFzZXQuc29ydENvbHVtbn1cbiAgICAgICAgICAgICAgICBjb3B5VGFibGVDb2x1bW49e3RoaXMuY29weVRhYmxlQ29sdW1ufVxuICAgICAgICAgICAgICAgIHBpblRhYmxlQ29sdW1uPXt0aGlzLnBpblRhYmxlQ29sdW1ufVxuICAgICAgICAgICAgICAgIHNvcnRUYWJsZUNvbHVtbj17dGhpcy5zb3J0VGFibGVDb2x1bW59XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICA8L1RhYmxlQ29udGFpbmVyPlxuICAgICAgICA8L1N0eWxlZE1vZGFsPlxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgRGF0YVRhYmxlTW9kYWwuZGVmYXVsdFByb3BzID0ge1xuICAgIHNob3dUYWI6IHRydWVcbiAgfTtcbiAgcmV0dXJuIHdpdGhUaGVtZShEYXRhVGFibGVNb2RhbCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IERhdGFUYWJsZU1vZGFsRmFjdG9yeTtcbiJdfQ==