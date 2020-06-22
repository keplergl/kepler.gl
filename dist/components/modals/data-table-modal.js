"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.DatasetTabs = exports.DatasetModalTab = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireWildcard(require("styled-components"));

var _datasetLabel = _interopRequireDefault(require("../common/dataset-label"));

var _dataTable = _interopRequireDefault(require("../common/data-table"));

var _reselect = require("reselect");

var _cellSize = require("../common/data-table/cell-size");

var _canvas = _interopRequireDefault(require("../common/data-table/canvas"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  min-height: 70vh;\n  max-height: 70vh;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  align-items: center;\n  border-bottom: 3px solid ", ";\n  cursor: pointer;\n  display: flex;\n  height: 35px;\n  margin: 0 3px;\n  padding: 0 5px;\n\n  :first-child {\n    margin-left: 0;\n    padding-left: 0;\n  }\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  padding: ", " ", " 0;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  min-height: 70vh;\n  overflow: hidden;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var dgSettings = {
  sidePadding: '38px',
  verticalPadding: '16px',
  height: '36px'
};

var StyledModal = _styledComponents["default"].div(_templateObject());

var DatasetCatalog = _styledComponents["default"].div(_templateObject2(), dgSettings.verticalPadding, dgSettings.sidePadding);

var DatasetModalTab = _styledComponents["default"].div(_templateObject3(), function (props) {
  return props.active ? 'black' : 'transparent';
});

exports.DatasetModalTab = DatasetModalTab;

var DatasetTabs = _react["default"].memo(function (_ref) {
  var activeDataset = _ref.activeDataset,
      datasets = _ref.datasets,
      showDatasetTable = _ref.showDatasetTable;
  return _react["default"].createElement(DatasetCatalog, {
    className: "dataset-modal-catalog"
  }, Object.values(datasets).map(function (dataset) {
    return _react["default"].createElement(DatasetModalTab, {
      className: "dataset-modal-tab",
      active: dataset === activeDataset,
      key: dataset.id,
      onClick: function onClick() {
        return showDatasetTable(dataset.id);
      }
    }, _react["default"].createElement(_datasetLabel["default"], {
      dataset: dataset
    }));
  }));
});

exports.DatasetTabs = DatasetTabs;
DatasetTabs.displayName = 'DatasetTabs';
DataTableModalFactory.deps = [_dataTable["default"]];

var TableContainer = _styledComponents["default"].div(_templateObject4());

function DataTableModalFactory(DataTable) {
  var DataTableModal =
  /*#__PURE__*/
  function (_React$Component) {
    (0, _inherits2["default"])(DataTableModal, _React$Component);

    function DataTableModal() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, DataTableModal);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(DataTableModal)).call.apply(_getPrototypeOf2, [this].concat(args)));
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
              type = _ref2.type;
          return _objectSpread({}, acc, (0, _defineProperty2["default"])({}, name, type));
        }, {});
      }));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "cellSizeCache", (0, _reselect.createSelector)(_this.dataId, _this.datasets, function (dataId, datasets) {
        if (!_this.props.datasets[dataId]) {
          return {};
        }

        var _this$props$datasets$ = _this.props.datasets[dataId],
            fields = _this$props$datasets$.fields,
            allData = _this$props$datasets$.allData;
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
          return _objectSpread({}, acc, (0, _defineProperty2["default"])({}, field.name, (0, _cellSize.renderedSize)({
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
      return _this;
    }

    (0, _createClass2["default"])(DataTableModal, [{
      key: "render",
      value: function render() {
        var _this$props = this.props,
            datasets = _this$props.datasets,
            dataId = _this$props.dataId,
            showDatasetTable = _this$props.showDatasetTable;

        if (!datasets || !dataId) {
          return null;
        }

        var activeDataset = datasets[dataId];
        var columns = this.columns(this.props);
        var colMeta = this.colMeta(this.props);
        var cellSizeCache = this.cellSizeCache(this.props);
        return _react["default"].createElement(StyledModal, {
          className: "dataset-modal",
          id: "dataset-modal"
        }, _react["default"].createElement(_canvas["default"], null), _react["default"].createElement(TableContainer, null, _react["default"].createElement(DatasetTabs, {
          activeDataset: activeDataset,
          datasets: datasets,
          showDatasetTable: showDatasetTable
        }), datasets[dataId] ? _react["default"].createElement(DataTable, {
          key: dataId,
          dataId: dataId,
          columns: columns,
          colMeta: colMeta,
          cellSizeCache: cellSizeCache,
          rows: activeDataset.allData,
          pinnedColumns: activeDataset.pinnedColumns,
          sortOrder: activeDataset.sortOrder,
          sortColumn: activeDataset.sortColumn,
          copyTableColumn: this.props.copyTableColumn,
          pinTableColumn: this.props.pinTableColumn,
          sortTableColumn: this.props.sortTableColumn
        }) : null));
      }
    }]);
    return DataTableModal;
  }(_react["default"].Component);

  return (0, _styledComponents.withTheme)(DataTableModal);
}

var _default = DataTableModalFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9kYXRhLXRhYmxlLW1vZGFsLmpzIl0sIm5hbWVzIjpbImRnU2V0dGluZ3MiLCJzaWRlUGFkZGluZyIsInZlcnRpY2FsUGFkZGluZyIsImhlaWdodCIsIlN0eWxlZE1vZGFsIiwic3R5bGVkIiwiZGl2IiwiRGF0YXNldENhdGFsb2ciLCJEYXRhc2V0TW9kYWxUYWIiLCJwcm9wcyIsImFjdGl2ZSIsIkRhdGFzZXRUYWJzIiwiUmVhY3QiLCJtZW1vIiwiYWN0aXZlRGF0YXNldCIsImRhdGFzZXRzIiwic2hvd0RhdGFzZXRUYWJsZSIsIk9iamVjdCIsInZhbHVlcyIsIm1hcCIsImRhdGFzZXQiLCJpZCIsImRpc3BsYXlOYW1lIiwiRGF0YVRhYmxlTW9kYWxGYWN0b3J5IiwiZGVwcyIsIkRhdGFUYWJsZUZhY3RvcnkiLCJUYWJsZUNvbnRhaW5lciIsIkRhdGFUYWJsZSIsIkRhdGFUYWJsZU1vZGFsIiwiZGF0YUlkIiwiZmllbGRzIiwiZiIsIm5hbWUiLCJyZWR1Y2UiLCJhY2MiLCJ0eXBlIiwiYWxsRGF0YSIsInNob3dDYWxjdWxhdGUiLCJkYXRhc2V0Q2VsbFNpemVDYWNoZSIsImNlbGxTaXplQ2FjaGUiLCJmaWVsZCIsImNvbElkeCIsInRleHQiLCJyb3dzIiwiY29sdW1uIiwiZm9udFNpemUiLCJ0aGVtZSIsImNlbGxGb250U2l6ZSIsImZvbnQiLCJmb250RmFtaWx5IiwiY29sdW1ucyIsImNvbE1ldGEiLCJwaW5uZWRDb2x1bW5zIiwic29ydE9yZGVyIiwic29ydENvbHVtbiIsImNvcHlUYWJsZUNvbHVtbiIsInBpblRhYmxlQ29sdW1uIiwic29ydFRhYmxlQ29sdW1uIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxVQUFVLEdBQUc7QUFDakJDLEVBQUFBLFdBQVcsRUFBRSxNQURJO0FBRWpCQyxFQUFBQSxlQUFlLEVBQUUsTUFGQTtBQUdqQkMsRUFBQUEsTUFBTSxFQUFFO0FBSFMsQ0FBbkI7O0FBTUEsSUFBTUMsV0FBVyxHQUFHQyw2QkFBT0MsR0FBVixtQkFBakI7O0FBS0EsSUFBTUMsY0FBYyxHQUFHRiw2QkFBT0MsR0FBVixxQkFFUE4sVUFBVSxDQUFDRSxlQUZKLEVBRXVCRixVQUFVLENBQUNDLFdBRmxDLENBQXBCOztBQUtPLElBQU1PLGVBQWUsR0FBR0gsNkJBQU9DLEdBQVYscUJBRUMsVUFBQUcsS0FBSztBQUFBLFNBQUtBLEtBQUssQ0FBQ0MsTUFBTixHQUFlLE9BQWYsR0FBeUIsYUFBOUI7QUFBQSxDQUZOLENBQXJCOzs7O0FBZUEsSUFBTUMsV0FBVyxHQUFHQyxrQkFBTUMsSUFBTixDQUFXO0FBQUEsTUFBRUMsYUFBRixRQUFFQSxhQUFGO0FBQUEsTUFBaUJDLFFBQWpCLFFBQWlCQSxRQUFqQjtBQUFBLE1BQTJCQyxnQkFBM0IsUUFBMkJBLGdCQUEzQjtBQUFBLFNBQ3BDLGdDQUFDLGNBQUQ7QUFBZ0IsSUFBQSxTQUFTLEVBQUM7QUFBMUIsS0FDR0MsTUFBTSxDQUFDQyxNQUFQLENBQWNILFFBQWQsRUFBd0JJLEdBQXhCLENBQTRCLFVBQUFDLE9BQU87QUFBQSxXQUNsQyxnQ0FBQyxlQUFEO0FBQ0UsTUFBQSxTQUFTLEVBQUMsbUJBRFo7QUFFRSxNQUFBLE1BQU0sRUFBRUEsT0FBTyxLQUFLTixhQUZ0QjtBQUdFLE1BQUEsR0FBRyxFQUFFTSxPQUFPLENBQUNDLEVBSGY7QUFJRSxNQUFBLE9BQU8sRUFBRTtBQUFBLGVBQU1MLGdCQUFnQixDQUFDSSxPQUFPLENBQUNDLEVBQVQsQ0FBdEI7QUFBQTtBQUpYLE9BTUUsZ0NBQUMsd0JBQUQ7QUFBYyxNQUFBLE9BQU8sRUFBRUQ7QUFBdkIsTUFORixDQURrQztBQUFBLEdBQW5DLENBREgsQ0FEb0M7QUFBQSxDQUFYLENBQXBCOzs7QUFlUFQsV0FBVyxDQUFDVyxXQUFaLEdBQTBCLGFBQTFCO0FBRUFDLHFCQUFxQixDQUFDQyxJQUF0QixHQUE2QixDQUFDQyxxQkFBRCxDQUE3Qjs7QUFFQSxJQUFNQyxjQUFjLEdBQUdyQiw2QkFBT0MsR0FBVixvQkFBcEI7O0FBUUEsU0FBU2lCLHFCQUFULENBQStCSSxTQUEvQixFQUEwQztBQUFBLE1BQ2xDQyxjQURrQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBOztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLCtHQUVmLEVBRmU7QUFBQSxpR0FHN0IsVUFBQW5CLEtBQUs7QUFBQSxlQUFJQSxLQUFLLENBQUNvQixNQUFWO0FBQUEsT0FId0I7QUFBQSxtR0FJM0IsVUFBQXBCLEtBQUs7QUFBQSxlQUFJQSxLQUFLLENBQUNNLFFBQVY7QUFBQSxPQUpzQjtBQUFBLGlHQUs3QixVQUFBTixLQUFLO0FBQUEsZUFBSSxDQUFDQSxLQUFLLENBQUNNLFFBQU4sQ0FBZU4sS0FBSyxDQUFDb0IsTUFBckIsS0FBZ0MsRUFBakMsRUFBcUNDLE1BQXpDO0FBQUEsT0FMd0I7QUFBQSxrR0FNNUIsOEJBQWUsTUFBS0EsTUFBcEIsRUFBNEIsVUFBQUEsTUFBTTtBQUFBLGVBQUlBLE1BQU0sQ0FBQ1gsR0FBUCxDQUFXLFVBQUFZLENBQUM7QUFBQSxpQkFBSUEsQ0FBQyxDQUFDQyxJQUFOO0FBQUEsU0FBWixDQUFKO0FBQUEsT0FBbEMsQ0FONEI7QUFBQSxrR0FPNUIsOEJBQWUsTUFBS0YsTUFBcEIsRUFBNEIsVUFBQUEsTUFBTTtBQUFBLGVBQzFDQSxNQUFNLENBQUNHLE1BQVAsQ0FDRSxVQUFDQyxHQUFEO0FBQUEsY0FBT0YsSUFBUCxTQUFPQSxJQUFQO0FBQUEsY0FBYUcsSUFBYixTQUFhQSxJQUFiO0FBQUEsbUNBQ0tELEdBREwsdUNBRUdGLElBRkgsRUFFVUcsSUFGVjtBQUFBLFNBREYsRUFLRSxFQUxGLENBRDBDO0FBQUEsT0FBbEMsQ0FQNEI7QUFBQSx3R0FnQnRCLDhCQUFlLE1BQUtOLE1BQXBCLEVBQTRCLE1BQUtkLFFBQWpDLEVBQTJDLFVBQUNjLE1BQUQsRUFBU2QsUUFBVCxFQUFzQjtBQUMvRSxZQUFJLENBQUMsTUFBS04sS0FBTCxDQUFXTSxRQUFYLENBQW9CYyxNQUFwQixDQUFMLEVBQWtDO0FBQ2hDLGlCQUFPLEVBQVA7QUFDRDs7QUFIOEUsb0NBSXJELE1BQUtwQixLQUFMLENBQVdNLFFBQVgsQ0FBb0JjLE1BQXBCLENBSnFEO0FBQUEsWUFJeEVDLE1BSndFLHlCQUl4RUEsTUFKd0U7QUFBQSxZQUloRU0sT0FKZ0UseUJBSWhFQSxPQUpnRTtBQU0vRSxZQUFJQyxhQUFhLEdBQUcsSUFBcEI7O0FBQ0EsWUFBSSxDQUFDLE1BQUtDLG9CQUFMLENBQTBCVCxNQUExQixDQUFMLEVBQXdDO0FBQ3RDUSxVQUFBQSxhQUFhLEdBQUcsSUFBaEI7QUFDRCxTQUZELE1BRU8sSUFDTCxNQUFLQyxvQkFBTCxDQUEwQlQsTUFBMUIsRUFBa0NDLE1BQWxDLEtBQTZDQSxNQUE3QyxJQUNBLE1BQUtRLG9CQUFMLENBQTBCVCxNQUExQixFQUFrQ08sT0FBbEMsS0FBOENBLE9BRnpDLEVBR0w7QUFDQUMsVUFBQUEsYUFBYSxHQUFHLElBQWhCO0FBQ0Q7O0FBRUQsWUFBSSxDQUFDQSxhQUFMLEVBQW9CO0FBQ2xCLGlCQUFPLE1BQUtDLG9CQUFMLENBQTBCVCxNQUExQixFQUFrQ1UsYUFBekM7QUFDRDs7QUFFRCxZQUFNQSxhQUFhLEdBQUdULE1BQU0sQ0FBQ0csTUFBUCxDQUNwQixVQUFDQyxHQUFELEVBQU1NLEtBQU4sRUFBYUMsTUFBYjtBQUFBLG1DQUNLUCxHQURMLHVDQUVHTSxLQUFLLENBQUNSLElBRlQsRUFFZ0IsNEJBQWE7QUFDekJVLFlBQUFBLElBQUksRUFBRTtBQUNKQyxjQUFBQSxJQUFJLEVBQUVQLE9BREY7QUFFSlEsY0FBQUEsTUFBTSxFQUFFSixLQUFLLENBQUNSO0FBRlYsYUFEbUI7QUFLekJTLFlBQUFBLE1BQU0sRUFBTkEsTUFMeUI7QUFNekJOLFlBQUFBLElBQUksRUFBRUssS0FBSyxDQUFDTCxJQU5hO0FBT3pCVSxZQUFBQSxRQUFRLEVBQUUsTUFBS3BDLEtBQUwsQ0FBV3FDLEtBQVgsQ0FBaUJDLFlBUEY7QUFRekJDLFlBQUFBLElBQUksRUFBRSxNQUFLdkMsS0FBTCxDQUFXcUMsS0FBWCxDQUFpQkc7QUFSRSxXQUFiLENBRmhCO0FBQUEsU0FEb0IsRUFjcEIsRUFkb0IsQ0FBdEIsQ0FwQitFLENBb0MvRTs7QUFDQSxjQUFLWCxvQkFBTCxDQUEwQlQsTUFBMUIsSUFBb0M7QUFDbENVLFVBQUFBLGFBQWEsRUFBYkEsYUFEa0M7QUFFbENULFVBQUFBLE1BQU0sRUFBTkEsTUFGa0M7QUFHbENNLFVBQUFBLE9BQU8sRUFBUEE7QUFIa0MsU0FBcEM7QUFLQSxlQUFPRyxhQUFQO0FBQ0QsT0EzQ2UsQ0FoQnNCO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsK0JBNkQ3QjtBQUFBLDBCQUNzQyxLQUFLOUIsS0FEM0M7QUFBQSxZQUNBTSxRQURBLGVBQ0FBLFFBREE7QUFBQSxZQUNVYyxNQURWLGVBQ1VBLE1BRFY7QUFBQSxZQUNrQmIsZ0JBRGxCLGVBQ2tCQSxnQkFEbEI7O0FBRVAsWUFBSSxDQUFDRCxRQUFELElBQWEsQ0FBQ2MsTUFBbEIsRUFBMEI7QUFDeEIsaUJBQU8sSUFBUDtBQUNEOztBQUVELFlBQU1mLGFBQWEsR0FBR0MsUUFBUSxDQUFDYyxNQUFELENBQTlCO0FBQ0EsWUFBTXFCLE9BQU8sR0FBRyxLQUFLQSxPQUFMLENBQWEsS0FBS3pDLEtBQWxCLENBQWhCO0FBQ0EsWUFBTTBDLE9BQU8sR0FBRyxLQUFLQSxPQUFMLENBQWEsS0FBSzFDLEtBQWxCLENBQWhCO0FBQ0EsWUFBTThCLGFBQWEsR0FBRyxLQUFLQSxhQUFMLENBQW1CLEtBQUs5QixLQUF4QixDQUF0QjtBQUVBLGVBQ0UsZ0NBQUMsV0FBRDtBQUFhLFVBQUEsU0FBUyxFQUFDLGVBQXZCO0FBQXVDLFVBQUEsRUFBRSxFQUFDO0FBQTFDLFdBQ0UsZ0NBQUMsa0JBQUQsT0FERixFQUVFLGdDQUFDLGNBQUQsUUFDRSxnQ0FBQyxXQUFEO0FBQ0UsVUFBQSxhQUFhLEVBQUVLLGFBRGpCO0FBRUUsVUFBQSxRQUFRLEVBQUVDLFFBRlo7QUFHRSxVQUFBLGdCQUFnQixFQUFFQztBQUhwQixVQURGLEVBTUdELFFBQVEsQ0FBQ2MsTUFBRCxDQUFSLEdBQ0MsZ0NBQUMsU0FBRDtBQUNFLFVBQUEsR0FBRyxFQUFFQSxNQURQO0FBRUUsVUFBQSxNQUFNLEVBQUVBLE1BRlY7QUFHRSxVQUFBLE9BQU8sRUFBRXFCLE9BSFg7QUFJRSxVQUFBLE9BQU8sRUFBRUMsT0FKWDtBQUtFLFVBQUEsYUFBYSxFQUFFWixhQUxqQjtBQU1FLFVBQUEsSUFBSSxFQUFFekIsYUFBYSxDQUFDc0IsT0FOdEI7QUFPRSxVQUFBLGFBQWEsRUFBRXRCLGFBQWEsQ0FBQ3NDLGFBUC9CO0FBUUUsVUFBQSxTQUFTLEVBQUV0QyxhQUFhLENBQUN1QyxTQVIzQjtBQVNFLFVBQUEsVUFBVSxFQUFFdkMsYUFBYSxDQUFDd0MsVUFUNUI7QUFVRSxVQUFBLGVBQWUsRUFBRSxLQUFLN0MsS0FBTCxDQUFXOEMsZUFWOUI7QUFXRSxVQUFBLGNBQWMsRUFBRSxLQUFLOUMsS0FBTCxDQUFXK0MsY0FYN0I7QUFZRSxVQUFBLGVBQWUsRUFBRSxLQUFLL0MsS0FBTCxDQUFXZ0Q7QUFaOUIsVUFERCxHQWVHLElBckJOLENBRkYsQ0FERjtBQTRCRDtBQXBHcUM7QUFBQTtBQUFBLElBQ1g3QyxrQkFBTThDLFNBREs7O0FBdUd4QyxTQUFPLGlDQUFVOUIsY0FBVixDQUFQO0FBQ0Q7O2VBRWNMLHFCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQsIHt3aXRoVGhlbWV9IGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBEYXRhc2V0TGFiZWwgZnJvbSAnY29tcG9uZW50cy9jb21tb24vZGF0YXNldC1sYWJlbCc7XG5pbXBvcnQgRGF0YVRhYmxlRmFjdG9yeSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9kYXRhLXRhYmxlJztcbmltcG9ydCB7Y3JlYXRlU2VsZWN0b3J9IGZyb20gJ3Jlc2VsZWN0JztcbmltcG9ydCB7cmVuZGVyZWRTaXplfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9kYXRhLXRhYmxlL2NlbGwtc2l6ZSc7XG5pbXBvcnQgQ2FudmFzSGFjayBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9kYXRhLXRhYmxlL2NhbnZhcyc7XG5cbmNvbnN0IGRnU2V0dGluZ3MgPSB7XG4gIHNpZGVQYWRkaW5nOiAnMzhweCcsXG4gIHZlcnRpY2FsUGFkZGluZzogJzE2cHgnLFxuICBoZWlnaHQ6ICczNnB4J1xufTtcblxuY29uc3QgU3R5bGVkTW9kYWwgPSBzdHlsZWQuZGl2YFxuICBtaW4taGVpZ2h0OiA3MHZoO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuYDtcblxuY29uc3QgRGF0YXNldENhdGFsb2cgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBwYWRkaW5nOiAke2RnU2V0dGluZ3MudmVydGljYWxQYWRkaW5nfSAke2RnU2V0dGluZ3Muc2lkZVBhZGRpbmd9IDA7XG5gO1xuXG5leHBvcnQgY29uc3QgRGF0YXNldE1vZGFsVGFiID0gc3R5bGVkLmRpdmBcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkICR7cHJvcHMgPT4gKHByb3BzLmFjdGl2ZSA/ICdibGFjaycgOiAndHJhbnNwYXJlbnQnKX07XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgZGlzcGxheTogZmxleDtcbiAgaGVpZ2h0OiAzNXB4O1xuICBtYXJnaW46IDAgM3B4O1xuICBwYWRkaW5nOiAwIDVweDtcblxuICA6Zmlyc3QtY2hpbGQge1xuICAgIG1hcmdpbi1sZWZ0OiAwO1xuICAgIHBhZGRpbmctbGVmdDogMDtcbiAgfVxuYDtcblxuZXhwb3J0IGNvbnN0IERhdGFzZXRUYWJzID0gUmVhY3QubWVtbygoe2FjdGl2ZURhdGFzZXQsIGRhdGFzZXRzLCBzaG93RGF0YXNldFRhYmxlfSkgPT4gKFxuICA8RGF0YXNldENhdGFsb2cgY2xhc3NOYW1lPVwiZGF0YXNldC1tb2RhbC1jYXRhbG9nXCI+XG4gICAge09iamVjdC52YWx1ZXMoZGF0YXNldHMpLm1hcChkYXRhc2V0ID0+IChcbiAgICAgIDxEYXRhc2V0TW9kYWxUYWJcbiAgICAgICAgY2xhc3NOYW1lPVwiZGF0YXNldC1tb2RhbC10YWJcIlxuICAgICAgICBhY3RpdmU9e2RhdGFzZXQgPT09IGFjdGl2ZURhdGFzZXR9XG4gICAgICAgIGtleT17ZGF0YXNldC5pZH1cbiAgICAgICAgb25DbGljaz17KCkgPT4gc2hvd0RhdGFzZXRUYWJsZShkYXRhc2V0LmlkKX1cbiAgICAgID5cbiAgICAgICAgPERhdGFzZXRMYWJlbCBkYXRhc2V0PXtkYXRhc2V0fSAvPlxuICAgICAgPC9EYXRhc2V0TW9kYWxUYWI+XG4gICAgKSl9XG4gIDwvRGF0YXNldENhdGFsb2c+XG4pKTtcblxuRGF0YXNldFRhYnMuZGlzcGxheU5hbWUgPSAnRGF0YXNldFRhYnMnO1xuXG5EYXRhVGFibGVNb2RhbEZhY3RvcnkuZGVwcyA9IFtEYXRhVGFibGVGYWN0b3J5XTtcblxuY29uc3QgVGFibGVDb250YWluZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBmbGV4LWdyb3c6IDE7XG4gIG1pbi1oZWlnaHQ6IDcwdmg7XG4gIG1heC1oZWlnaHQ6IDcwdmg7XG5gO1xuXG5mdW5jdGlvbiBEYXRhVGFibGVNb2RhbEZhY3RvcnkoRGF0YVRhYmxlKSB7XG4gIGNsYXNzIERhdGFUYWJsZU1vZGFsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBkYXRhc2V0Q2VsbFNpemVDYWNoZSA9IHt9O1xuICAgIGRhdGFJZCA9IHByb3BzID0+IHByb3BzLmRhdGFJZDtcbiAgICBkYXRhc2V0cyA9IHByb3BzID0+IHByb3BzLmRhdGFzZXRzO1xuICAgIGZpZWxkcyA9IHByb3BzID0+IChwcm9wcy5kYXRhc2V0c1twcm9wcy5kYXRhSWRdIHx8IHt9KS5maWVsZHM7XG4gICAgY29sdW1ucyA9IGNyZWF0ZVNlbGVjdG9yKHRoaXMuZmllbGRzLCBmaWVsZHMgPT4gZmllbGRzLm1hcChmID0+IGYubmFtZSkpO1xuICAgIGNvbE1ldGEgPSBjcmVhdGVTZWxlY3Rvcih0aGlzLmZpZWxkcywgZmllbGRzID0+XG4gICAgICBmaWVsZHMucmVkdWNlKFxuICAgICAgICAoYWNjLCB7bmFtZSwgdHlwZX0pID0+ICh7XG4gICAgICAgICAgLi4uYWNjLFxuICAgICAgICAgIFtuYW1lXTogdHlwZVxuICAgICAgICB9KSxcbiAgICAgICAge31cbiAgICAgIClcbiAgICApO1xuICAgIGNlbGxTaXplQ2FjaGUgPSBjcmVhdGVTZWxlY3Rvcih0aGlzLmRhdGFJZCwgdGhpcy5kYXRhc2V0cywgKGRhdGFJZCwgZGF0YXNldHMpID0+IHtcbiAgICAgIGlmICghdGhpcy5wcm9wcy5kYXRhc2V0c1tkYXRhSWRdKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHtmaWVsZHMsIGFsbERhdGF9ID0gdGhpcy5wcm9wcy5kYXRhc2V0c1tkYXRhSWRdO1xuXG4gICAgICBsZXQgc2hvd0NhbGN1bGF0ZSA9IG51bGw7XG4gICAgICBpZiAoIXRoaXMuZGF0YXNldENlbGxTaXplQ2FjaGVbZGF0YUlkXSkge1xuICAgICAgICBzaG93Q2FsY3VsYXRlID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHRoaXMuZGF0YXNldENlbGxTaXplQ2FjaGVbZGF0YUlkXS5maWVsZHMgIT09IGZpZWxkcyB8fFxuICAgICAgICB0aGlzLmRhdGFzZXRDZWxsU2l6ZUNhY2hlW2RhdGFJZF0uYWxsRGF0YSAhPT0gYWxsRGF0YVxuICAgICAgKSB7XG4gICAgICAgIHNob3dDYWxjdWxhdGUgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXNob3dDYWxjdWxhdGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YXNldENlbGxTaXplQ2FjaGVbZGF0YUlkXS5jZWxsU2l6ZUNhY2hlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjZWxsU2l6ZUNhY2hlID0gZmllbGRzLnJlZHVjZShcbiAgICAgICAgKGFjYywgZmllbGQsIGNvbElkeCkgPT4gKHtcbiAgICAgICAgICAuLi5hY2MsXG4gICAgICAgICAgW2ZpZWxkLm5hbWVdOiByZW5kZXJlZFNpemUoe1xuICAgICAgICAgICAgdGV4dDoge1xuICAgICAgICAgICAgICByb3dzOiBhbGxEYXRhLFxuICAgICAgICAgICAgICBjb2x1bW46IGZpZWxkLm5hbWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb2xJZHgsXG4gICAgICAgICAgICB0eXBlOiBmaWVsZC50eXBlLFxuICAgICAgICAgICAgZm9udFNpemU6IHRoaXMucHJvcHMudGhlbWUuY2VsbEZvbnRTaXplLFxuICAgICAgICAgICAgZm9udDogdGhpcy5wcm9wcy50aGVtZS5mb250RmFtaWx5XG4gICAgICAgICAgfSlcbiAgICAgICAgfSksXG4gICAgICAgIHt9XG4gICAgICApO1xuICAgICAgLy8gc2F2ZSBpdCB0byBjYWNoZVxuICAgICAgdGhpcy5kYXRhc2V0Q2VsbFNpemVDYWNoZVtkYXRhSWRdID0ge1xuICAgICAgICBjZWxsU2l6ZUNhY2hlLFxuICAgICAgICBmaWVsZHMsXG4gICAgICAgIGFsbERhdGFcbiAgICAgIH07XG4gICAgICByZXR1cm4gY2VsbFNpemVDYWNoZTtcbiAgICB9KTtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHtkYXRhc2V0cywgZGF0YUlkLCBzaG93RGF0YXNldFRhYmxlfSA9IHRoaXMucHJvcHM7XG4gICAgICBpZiAoIWRhdGFzZXRzIHx8ICFkYXRhSWQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGFjdGl2ZURhdGFzZXQgPSBkYXRhc2V0c1tkYXRhSWRdO1xuICAgICAgY29uc3QgY29sdW1ucyA9IHRoaXMuY29sdW1ucyh0aGlzLnByb3BzKTtcbiAgICAgIGNvbnN0IGNvbE1ldGEgPSB0aGlzLmNvbE1ldGEodGhpcy5wcm9wcyk7XG4gICAgICBjb25zdCBjZWxsU2l6ZUNhY2hlID0gdGhpcy5jZWxsU2l6ZUNhY2hlKHRoaXMucHJvcHMpO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3R5bGVkTW9kYWwgY2xhc3NOYW1lPVwiZGF0YXNldC1tb2RhbFwiIGlkPVwiZGF0YXNldC1tb2RhbFwiPlxuICAgICAgICAgIDxDYW52YXNIYWNrIC8+XG4gICAgICAgICAgPFRhYmxlQ29udGFpbmVyPlxuICAgICAgICAgICAgPERhdGFzZXRUYWJzXG4gICAgICAgICAgICAgIGFjdGl2ZURhdGFzZXQ9e2FjdGl2ZURhdGFzZXR9XG4gICAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgICAgc2hvd0RhdGFzZXRUYWJsZT17c2hvd0RhdGFzZXRUYWJsZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7ZGF0YXNldHNbZGF0YUlkXSA/IChcbiAgICAgICAgICAgICAgPERhdGFUYWJsZVxuICAgICAgICAgICAgICAgIGtleT17ZGF0YUlkfVxuICAgICAgICAgICAgICAgIGRhdGFJZD17ZGF0YUlkfVxuICAgICAgICAgICAgICAgIGNvbHVtbnM9e2NvbHVtbnN9XG4gICAgICAgICAgICAgICAgY29sTWV0YT17Y29sTWV0YX1cbiAgICAgICAgICAgICAgICBjZWxsU2l6ZUNhY2hlPXtjZWxsU2l6ZUNhY2hlfVxuICAgICAgICAgICAgICAgIHJvd3M9e2FjdGl2ZURhdGFzZXQuYWxsRGF0YX1cbiAgICAgICAgICAgICAgICBwaW5uZWRDb2x1bW5zPXthY3RpdmVEYXRhc2V0LnBpbm5lZENvbHVtbnN9XG4gICAgICAgICAgICAgICAgc29ydE9yZGVyPXthY3RpdmVEYXRhc2V0LnNvcnRPcmRlcn1cbiAgICAgICAgICAgICAgICBzb3J0Q29sdW1uPXthY3RpdmVEYXRhc2V0LnNvcnRDb2x1bW59XG4gICAgICAgICAgICAgICAgY29weVRhYmxlQ29sdW1uPXt0aGlzLnByb3BzLmNvcHlUYWJsZUNvbHVtbn1cbiAgICAgICAgICAgICAgICBwaW5UYWJsZUNvbHVtbj17dGhpcy5wcm9wcy5waW5UYWJsZUNvbHVtbn1cbiAgICAgICAgICAgICAgICBzb3J0VGFibGVDb2x1bW49e3RoaXMucHJvcHMuc29ydFRhYmxlQ29sdW1ufVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgPC9UYWJsZUNvbnRhaW5lcj5cbiAgICAgICAgPC9TdHlsZWRNb2RhbD5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHdpdGhUaGVtZShEYXRhVGFibGVNb2RhbCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IERhdGFUYWJsZU1vZGFsRmFjdG9yeTtcbiJdfQ==