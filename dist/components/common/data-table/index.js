"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.DataTable = exports.TableSection = exports.Container = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _reactVirtualized = require("react-virtualized");

var _styledComponents = _interopRequireWildcard(require("styled-components"));

var _classnames3 = _interopRequireDefault(require("classnames"));

var _reselect = require("reselect");

var _lodash = _interopRequireDefault(require("lodash.get"));

var _lodash2 = _interopRequireDefault(require("lodash.debounce"));

var _optionDropdown = _interopRequireDefault(require("./option-dropdown"));

var _grid = _interopRequireDefault(require("./grid"));

var _button = _interopRequireDefault(require("./button"));

var _icons = require("../icons");

var _fieldToken = _interopRequireDefault(require("../field-token"));

var _dataUtils = require("../../../utils/data-utils");

var _cellSize = require("./cell-size");

var _defaultSettings = require("../../../constants/default-settings");

var _fieldToAlignRight;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  font-size: 11px;\n  flex-grow: 1;\n  color: ", ";\n  width: 100%;\n\n  .ReactVirtualized__Grid:focus,\n  .ReactVirtualized__Grid:active {\n    outline: 0;\n  }\n\n  .cell {\n    &::-webkit-scrollbar {\n      display: none;\n    }\n  }\n\n  *:focus {\n    outline: 0;\n  }\n\n  .results-table-wrapper {\n    position: relative;\n    min-height: 100%;\n    max-height: 100%;\n    display: flex;\n    flex-direction: row;\n    flex-grow: 1;\n    overflow: hidden;\n    border-top: none;\n\n    .scroll-in-ui-thread::after {\n      content: '';\n      height: 100%;\n      left: 0;\n      position: absolute;\n      pointer-events: none;\n      top: 0;\n      width: 100%;\n    }\n\n    .grid-row {\n      position: relative;\n      display: flex;\n      flex-direction: row;\n    }\n    .grid-column {\n      display: flex;\n      flex-direction: column;\n      flex: 1 1 auto;\n    }\n    .pinned-grid-container {\n      flex: 0 0 75px;\n      z-index: 10;\n      position: absolute;\n      left: 0;\n      top: 0;\n      border-right: 2px solid ", ";\n    }\n\n    .header-grid {\n      overflow: hidden !important;\n    }\n\n    .body-grid {\n      overflow: overlay !important;\n    }\n\n    .pinned-grid {\n      overflow: overlay !important;\n    }\n\n    .even-row {\n      background-color: ", ";\n    }\n    .odd-row {\n      background-color: ", ";\n    }\n    .cell,\n    .header-cell {\n      width: 100%;\n      height: 100%;\n      display: flex;\n      flex-direction: column;\n      justify-content: center;\n      align-items: flex-start;\n      text-align: center;\n      overflow: hidden;\n\n      .n-sort-idx {\n        font-size: 9px;\n      }\n    }\n    .cell {\n      border-bottom: 1px solid ", ";\n      border-right: 1px solid ", ";\n      white-space: nowrap;\n      overflow: auto;\n      padding: 0 ", "px;\n      font-size: ", "px;\n\n      .result-link {\n        text-decoration: none;\n      }\n    }\n    .cell.end-cell,\n    .header-cell.end-cell {\n      border-right: none;\n      padding-right: ", "px;\n    }\n    .cell.first-cell,\n    .header-cell.first-cell {\n      padding-left: ", "px;\n    }\n    .cell.bottom-cell {\n      border-bottom: none;\n    }\n    .cell.align-right {\n      align-items: flex-end;\n    }\n    .header-cell {\n      border-bottom: 1px solid ", ";\n      border-top: 1px solid ", ";\n      padding-top: ", "px;\n      padding-right: 0;\n      padding-bottom: ", "px;\n      padding-left: ", "px;\n      align-items: center;\n      justify-content: space-between;\n      display: flex;\n      flex-direction: row;\n      background-color: ", ";\n\n      &:hover {\n        .more {\n          color: ", ";\n        }\n      }\n      .n-sort-idx {\n        font-size: 9px;\n      }\n      .details {\n        font-weight: 500;\n        display: flex;\n        flex-direction: column;\n        justify-content: flex-start;\n        height: 100%;\n        overflow: hidden;\n        flex-grow: 1;\n        .col-name {\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n\n          .col-name__left {\n            display: flex;\n            align-items: center;\n            overflow: hidden;\n            svg {\n              margin-left: 6px;\n            }\n          }\n          .col-name__name {\n            overflow: hidden;\n            white-space: nowrap;\n          }\n          .col-name__sort {\n            cursor: pointer;\n          }\n        }\n      }\n\n      .more {\n        color: transparent;\n        margin-left: 5px;\n      }\n    }\n  }\n\n  :focus {\n    outline: none;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var defaultHeaderRowHeight = 55;
var defaultRowHeight = 32;
var overscanColumnCount = 10;
var overscanRowCount = 10;
var fieldToAlignRight = (_fieldToAlignRight = {}, (0, _defineProperty2["default"])(_fieldToAlignRight, _defaultSettings.ALL_FIELD_TYPES.integer, true), (0, _defineProperty2["default"])(_fieldToAlignRight, _defaultSettings.ALL_FIELD_TYPES.real, true), _fieldToAlignRight);

var Container = _styledComponents["default"].div(_templateObject(), function (props) {
  return props.theme.textColorLT;
}, function (props) {
  return props.theme.pinnedGridBorderColor;
}, function (props) {
  return props.theme.evenRowBackground;
}, function (props) {
  return props.theme.oddRowBackground;
}, function (props) {
  return props.theme.cellBorderColor;
}, function (props) {
  return props.theme.cellBorderColor;
}, function (props) {
  return props.theme.cellPaddingSide;
}, function (props) {
  return props.theme.cellFontSize;
}, function (props) {
  return props.theme.cellPaddingSide + props.theme.edgeCellPaddingSide;
}, function (props) {
  return props.theme.cellPaddingSide + props.theme.edgeCellPaddingSide;
}, function (props) {
  return props.theme.headerCellBorderColor;
}, function (props) {
  return props.theme.headerCellBorderColor;
}, function (props) {
  return props.theme.headerPaddingTop;
}, function (props) {
  return props.theme.headerPaddingBottom;
}, function (props) {
  return props.theme.cellPaddingSide;
}, function (props) {
  return props.theme.headerCellBackground;
}, function (props) {
  return props.theme.headerCellIconColor;
});

exports.Container = Container;
var defaultColumnWidth = 200;

var columnWidthFunction = function columnWidthFunction(columns, cellSizeCache, ghost) {
  return function (_ref) {
    var index = _ref.index;
    return (columns[index] || {}).ghost ? ghost : cellSizeCache[columns[index]] || defaultColumnWidth;
  };
};
/*
 * This is an accessor method used to generalize getting a cell from a data row
 */


var getRowCell = function getRowCell(_ref2) {
  var rows = _ref2.rows,
      columns = _ref2.columns,
      column = _ref2.column,
      colMeta = _ref2.colMeta,
      rowIndex = _ref2.rowIndex,
      sortColumn = _ref2.sortColumn,
      sortOrder = _ref2.sortOrder;
  var rowIdx = sortOrder && sortOrder.length ? (0, _lodash["default"])(sortOrder, rowIndex) : rowIndex;
  var type = colMeta[column];
  return (0, _dataUtils.parseFieldValue)((0, _lodash["default"])(rows, [rowIdx, columns.indexOf(column)], 'Err'), type);
};

var renderHeaderCell = function renderHeaderCell(columns, isPinned, props, toggleMoreOptions, moreOptionsColumn) {
  // eslint-disable-next-line react/display-name
  return function (cellInfo) {
    var _classnames;

    var columnIndex = cellInfo.columnIndex,
        key = cellInfo.key,
        style = cellInfo.style;
    var colMeta = props.colMeta,
        sortColumn = props.sortColumn,
        _sortTableColumn = props.sortTableColumn,
        unsortColumn = props.unsortColumn,
        _pinTableColumn = props.pinTableColumn,
        _copyTableColumn = props.copyTableColumn,
        dataId = props.dataId;
    var column = columns[columnIndex];
    var isGhost = column.ghost;
    var isSorted = sortColumn[column];
    var firstCell = columnIndex === 0;
    return _react["default"].createElement("div", {
      className: (0, _classnames3["default"])('header-cell', (_classnames = {}, (0, _defineProperty2["default"])(_classnames, "column-".concat(columnIndex), true), (0, _defineProperty2["default"])(_classnames, 'pinned-header-cell', isPinned), (0, _defineProperty2["default"])(_classnames, 'first-cell', firstCell), _classnames)),
      key: key,
      style: style,
      onClick: function onClick(e) {
        e.shiftKey ? _sortTableColumn(dataId, column) : null;
      },
      onDoubleClick: function onDoubleClick() {
        return _sortTableColumn(dataId, column);
      },
      title: column
    }, isGhost ? _react["default"].createElement("div", null) : _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement("section", {
      className: "details"
    }, _react["default"].createElement("div", {
      className: "col-name"
    }, _react["default"].createElement("div", {
      className: "col-name__left"
    }, _react["default"].createElement("div", {
      className: "col-name__name"
    }, column), _react["default"].createElement(_button["default"], {
      className: "col-name__sort",
      onClick: function onClick() {
        return _sortTableColumn(dataId, column);
      }
    }, isSorted ? isSorted === _defaultSettings.SORT_ORDER.ASCENDING ? _react["default"].createElement(_icons.ArrowUp, {
      height: "14px"
    }) : _react["default"].createElement(_icons.ArrowDown, {
      height: "14px"
    }) : null)), _react["default"].createElement(_button["default"], {
      className: "more",
      onClick: function onClick() {
        return toggleMoreOptions(column);
      }
    }, _react["default"].createElement(_icons.VertThreeDots, {
      height: "14px"
    }))), _react["default"].createElement(_fieldToken["default"], {
      type: colMeta[column]
    })), _react["default"].createElement("section", {
      className: "options"
    }, _react["default"].createElement(_optionDropdown["default"], {
      isOpened: moreOptionsColumn === column,
      type: colMeta[column],
      column: column,
      toggleMoreOptions: toggleMoreOptions,
      sortTableColumn: function sortTableColumn(mode) {
        return _sortTableColumn(dataId, column, mode);
      },
      sortMode: sortColumn && sortColumn[column],
      pinTableColumn: function pinTableColumn() {
        return _pinTableColumn(dataId, column);
      },
      copyTableColumn: function copyTableColumn() {
        return _copyTableColumn(dataId, column);
      },
      isSorted: isSorted,
      isPinned: isPinned,
      unsortColumn: unsortColumn
    }))));
  };
};

var renderDataCell = function renderDataCell(columns, isPinned, props) {
  return function (cellInfo) {
    var _classnames2;

    var columnIndex = cellInfo.columnIndex,
        key = cellInfo.key,
        style = cellInfo.style,
        rowIndex = cellInfo.rowIndex;
    var rows = props.rows,
        colMeta = props.colMeta;
    var column = columns[columnIndex];
    var isGhost = column.ghost;
    var rowCell = isGhost ? '' : getRowCell(_objectSpread({}, props, {
      column: column,
      rowIndex: rowIndex
    }));
    var type = isGhost ? null : colMeta[column];
    var endCell = columnIndex === columns.length - 1;
    var firstCell = columnIndex === 0;
    var bottomCell = rowIndex === rows.length - 1;
    var alignRight = fieldToAlignRight[type];

    var cell = _react["default"].createElement("div", {
      className: (0, _classnames3["default"])('cell', (_classnames2 = {}, (0, _defineProperty2["default"])(_classnames2, rowIndex % 2 === 0 ? 'even-row' : 'odd-row', true), (0, _defineProperty2["default"])(_classnames2, "row-".concat(rowIndex), true), (0, _defineProperty2["default"])(_classnames2, 'pinned-cell', isPinned), (0, _defineProperty2["default"])(_classnames2, 'first-cell', firstCell), (0, _defineProperty2["default"])(_classnames2, 'end-cell', endCell), (0, _defineProperty2["default"])(_classnames2, 'bottom-cell', bottomCell), (0, _defineProperty2["default"])(_classnames2, 'align-right', alignRight), _classnames2)),
      key: key,
      style: style,
      title: isGhost ? undefined : rowCell
    }, "".concat(rowCell).concat(endCell ? '\n' : '\t'));

    return cell;
  };
};

var TableSection = function TableSection(_ref3) {
  var classList = _ref3.classList,
      isPinned = _ref3.isPinned,
      columns = _ref3.columns,
      headerGridProps = _ref3.headerGridProps,
      fixedWidth = _ref3.fixedWidth,
      fixedHeight = _ref3.fixedHeight,
      onScroll = _ref3.onScroll,
      scrollTop = _ref3.scrollTop,
      dataGridProps = _ref3.dataGridProps,
      columnWidth = _ref3.columnWidth,
      setGridRef = _ref3.setGridRef,
      headerCellRender = _ref3.headerCellRender,
      dataCellRender = _ref3.dataCellRender,
      scrollLeft = _ref3.scrollLeft;
  return _react["default"].createElement(_reactVirtualized.AutoSizer, null, function (_ref4) {
    var width = _ref4.width,
        height = _ref4.height;
    var gridDimension = {
      columnCount: columns.length,
      columnWidth: columnWidth,
      width: fixedWidth || width
    };
    var dataGridHeight = fixedHeight || height;
    return _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement("div", {
      className: (0, _classnames3["default"])('scroll-in-ui-thread', classList.header)
    }, _react["default"].createElement(_grid["default"], (0, _extends2["default"])({
      cellRenderer: headerCellRender
    }, headerGridProps, gridDimension, {
      scrollLeft: scrollLeft
    }))), _react["default"].createElement("div", {
      className: (0, _classnames3["default"])('scroll-in-ui-thread', classList.rows),
      style: {
        top: headerGridProps.height
      }
    }, _react["default"].createElement(_grid["default"], (0, _extends2["default"])({
      cellRenderer: dataCellRender
    }, dataGridProps, gridDimension, {
      className: isPinned ? 'pinned-grid' : 'body-grid',
      height: dataGridHeight - headerGridProps.height,
      onScroll: onScroll,
      scrollTop: scrollTop,
      setGridRef: setGridRef
    }))));
  });
};

exports.TableSection = TableSection;

var DataTable =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(DataTable, _Component);

  function DataTable() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, DataTable);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(DataTable)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
      cellSizeCache: {},
      moreOptionsColumn: null
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "root", (0, _react.createRef)());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "columns", function (props) {
      return props.columns;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "pinnedColumns", function (props) {
      return props.pinnedColumns;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "unpinnedColumns", (0, _reselect.createSelector)(_this.columns, _this.pinnedColumns, function (columns, pinnedColumns) {
      return !Array.isArray(pinnedColumns) ? columns : columns.filter(function (c) {
        return !pinnedColumns.includes(c);
      });
    }));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "toggleMoreOptions", function (moreOptionsColumn) {
      return _this.setState({
        moreOptionsColumn: _this.state.moreOptionsColumn === moreOptionsColumn ? null : moreOptionsColumn
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "getCellSizeCache", function () {
      var _this$props = _this.props,
          propsCache = _this$props.cellSizeCache,
          fixedWidth = _this$props.fixedWidth,
          pinnedColumns = _this$props.pinnedColumns;

      var unpinnedColumns = _this.unpinnedColumns(_this.props);

      var width = fixedWidth ? fixedWidth : _this.root.current ? _this.root.current.clientWidth : 0; // pin column border is 2 pixel vs 1 pixel

      var adjustWidth = pinnedColumns.length ? width - 1 : width;

      var _adjustCellsToContain = (0, _cellSize.adjustCellsToContainer)(adjustWidth, propsCache, pinnedColumns, unpinnedColumns),
          cellSizeCache = _adjustCellsToContain.cellSizeCache,
          ghost = _adjustCellsToContain.ghost;

      return {
        cellSizeCache: cellSizeCache,
        ghost: ghost
      };
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "doScaleCellsToWidth", function () {
      _this.setState(_this.getCellSizeCache());
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "scaleCellsToWidth", (0, _lodash2["default"])(_this.doScaleCellsToWidth, 300));
    return _this;
  }

  (0, _createClass2["default"])(DataTable, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      window.addEventListener('resize', this.scaleCellsToWidth);
      this.scaleCellsToWidth();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.cellSizeCache !== prevProps.cellSizeCache || this.props.pinnedColumns !== prevProps.pinnedColumns) {
        this.scaleCellsToWidth();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this.scaleCellsToWidth);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          rows = _this$props2.rows,
          pinnedColumns = _this$props2.pinnedColumns,
          _this$props2$theme = _this$props2.theme,
          theme = _this$props2$theme === void 0 ? {} : _this$props2$theme,
          fixedWidth = _this$props2.fixedWidth,
          fixedHeight = _this$props2.fixedHeight;
      var unpinnedColumns = this.unpinnedColumns(this.props);
      var _this$state = this.state,
          cellSizeCache = _this$state.cellSizeCache,
          moreOptionsColumn = _this$state.moreOptionsColumn,
          ghost = _this$state.ghost;
      var unpinnedColumnsGhost = ghost ? [].concat((0, _toConsumableArray2["default"])(unpinnedColumns), [{
        ghost: true
      }]) : unpinnedColumns;
      var pinnedColumnsWidth = pinnedColumns.reduce(function (acc, val) {
        return acc + (0, _lodash["default"])(cellSizeCache, val, 0);
      }, 0);
      var hasPinnedColumns = Boolean(pinnedColumns.length);
      var _theme$headerRowHeigh = theme.headerRowHeight,
          headerRowHeight = _theme$headerRowHeigh === void 0 ? defaultHeaderRowHeight : _theme$headerRowHeigh,
          _theme$rowHeight = theme.rowHeight,
          rowHeight = _theme$rowHeight === void 0 ? defaultRowHeight : _theme$rowHeight;
      var headerGridProps = {
        cellSizeCache: cellSizeCache,
        className: 'header-grid',
        height: headerRowHeight,
        rowCount: 1,
        rowHeight: headerRowHeight
      };
      var dataGridProps = {
        cellSizeCache: cellSizeCache,
        overscanColumnCount: overscanColumnCount,
        overscanRowCount: overscanRowCount,
        rowCount: (rows || []).length,
        rowHeight: rowHeight
      };
      return _react["default"].createElement(Container, {
        className: "data-table-container",
        ref: this.root
      }, Object.keys(cellSizeCache).length && _react["default"].createElement(_reactVirtualized.ScrollSync, null, function (_ref5) {
        var _onScroll = _ref5.onScroll,
            scrollLeft = _ref5.scrollLeft,
            scrollTop = _ref5.scrollTop;
        return _react["default"].createElement("div", {
          className: "results-table-wrapper"
        }, hasPinnedColumns && _react["default"].createElement("div", {
          key: "pinned-columns",
          className: "pinned-columns grid-row"
        }, _react["default"].createElement(TableSection, {
          classList: {
            header: 'pinned-columns--header pinned-grid-container',
            rows: 'pinned-columns--rows pinned-grid-container'
          },
          isPinned: true,
          columns: pinnedColumns,
          headerGridProps: headerGridProps,
          fixedWidth: pinnedColumnsWidth,
          onScroll: function onScroll(args) {
            return _onScroll(_objectSpread({}, args, {
              scrollLeft: scrollLeft
            }));
          },
          scrollTop: scrollTop,
          dataGridProps: dataGridProps,
          setGridRef: function setGridRef(pinnedGrid) {
            return _this2.pinnedGrid = pinnedGrid;
          },
          columnWidth: columnWidthFunction(pinnedColumns, cellSizeCache),
          headerCellRender: renderHeaderCell(pinnedColumns, true, _this2.props, _this2.toggleMoreOptions, moreOptionsColumn),
          dataCellRender: renderDataCell(pinnedColumns, true, _this2.props)
        })), _react["default"].createElement("div", {
          key: "unpinned-columns",
          style: {
            marginLeft: "".concat(hasPinnedColumns ? "".concat(pinnedColumnsWidth, "px") : '0')
          },
          className: "unpinned-columns grid-column"
        }, _react["default"].createElement(TableSection, {
          classList: {
            header: 'unpinned-columns--header unpinned-grid-container',
            rows: 'unpinned-columns--rows unpinned-grid-container'
          },
          isPinned: false,
          columns: unpinnedColumnsGhost,
          ghost: ghost,
          headerGridProps: headerGridProps,
          fixedWidth: fixedWidth,
          fixedHeight: fixedHeight,
          onScroll: _onScroll,
          scrollTop: scrollTop,
          scrollLeft: scrollLeft,
          dataGridProps: dataGridProps,
          setGridRef: function setGridRef(unpinnedGrid) {
            return _this2.unpinnedGrid = unpinnedGrid;
          },
          columnWidth: columnWidthFunction(unpinnedColumnsGhost, cellSizeCache, ghost),
          headerCellRender: renderHeaderCell(unpinnedColumnsGhost, false, _this2.props, _this2.toggleMoreOptions, moreOptionsColumn),
          dataCellRender: renderDataCell(unpinnedColumnsGhost, false, _this2.props)
        })));
      }));
    }
  }]);
  return DataTable;
}(_react.Component);

exports.DataTable = DataTable;
(0, _defineProperty2["default"])(DataTable, "defaultProps", {
  rows: [],
  pinnedColumns: [],
  colMeta: {},
  cellSizeCache: {},
  sortColumn: {},
  fixedWidth: null,
  fixedHeight: null,
  theme: {}
});

function DataTableFactory() {
  return (0, _styledComponents.withTheme)(DataTable);
}

var _default = DataTableFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9kYXRhLXRhYmxlL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHRIZWFkZXJSb3dIZWlnaHQiLCJkZWZhdWx0Um93SGVpZ2h0Iiwib3ZlcnNjYW5Db2x1bW5Db3VudCIsIm92ZXJzY2FuUm93Q291bnQiLCJmaWVsZFRvQWxpZ25SaWdodCIsIkFMTF9GSUVMRF9UWVBFUyIsImludGVnZXIiLCJyZWFsIiwiQ29udGFpbmVyIiwic3R5bGVkIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsInRleHRDb2xvckxUIiwicGlubmVkR3JpZEJvcmRlckNvbG9yIiwiZXZlblJvd0JhY2tncm91bmQiLCJvZGRSb3dCYWNrZ3JvdW5kIiwiY2VsbEJvcmRlckNvbG9yIiwiY2VsbFBhZGRpbmdTaWRlIiwiY2VsbEZvbnRTaXplIiwiZWRnZUNlbGxQYWRkaW5nU2lkZSIsImhlYWRlckNlbGxCb3JkZXJDb2xvciIsImhlYWRlclBhZGRpbmdUb3AiLCJoZWFkZXJQYWRkaW5nQm90dG9tIiwiaGVhZGVyQ2VsbEJhY2tncm91bmQiLCJoZWFkZXJDZWxsSWNvbkNvbG9yIiwiZGVmYXVsdENvbHVtbldpZHRoIiwiY29sdW1uV2lkdGhGdW5jdGlvbiIsImNvbHVtbnMiLCJjZWxsU2l6ZUNhY2hlIiwiZ2hvc3QiLCJpbmRleCIsImdldFJvd0NlbGwiLCJyb3dzIiwiY29sdW1uIiwiY29sTWV0YSIsInJvd0luZGV4Iiwic29ydENvbHVtbiIsInNvcnRPcmRlciIsInJvd0lkeCIsImxlbmd0aCIsInR5cGUiLCJpbmRleE9mIiwicmVuZGVySGVhZGVyQ2VsbCIsImlzUGlubmVkIiwidG9nZ2xlTW9yZU9wdGlvbnMiLCJtb3JlT3B0aW9uc0NvbHVtbiIsImNlbGxJbmZvIiwiY29sdW1uSW5kZXgiLCJrZXkiLCJzdHlsZSIsInNvcnRUYWJsZUNvbHVtbiIsInVuc29ydENvbHVtbiIsInBpblRhYmxlQ29sdW1uIiwiY29weVRhYmxlQ29sdW1uIiwiZGF0YUlkIiwiaXNHaG9zdCIsImlzU29ydGVkIiwiZmlyc3RDZWxsIiwiZSIsInNoaWZ0S2V5IiwiU09SVF9PUkRFUiIsIkFTQ0VORElORyIsIm1vZGUiLCJyZW5kZXJEYXRhQ2VsbCIsInJvd0NlbGwiLCJlbmRDZWxsIiwiYm90dG9tQ2VsbCIsImFsaWduUmlnaHQiLCJjZWxsIiwidW5kZWZpbmVkIiwiVGFibGVTZWN0aW9uIiwiY2xhc3NMaXN0IiwiaGVhZGVyR3JpZFByb3BzIiwiZml4ZWRXaWR0aCIsImZpeGVkSGVpZ2h0Iiwib25TY3JvbGwiLCJzY3JvbGxUb3AiLCJkYXRhR3JpZFByb3BzIiwiY29sdW1uV2lkdGgiLCJzZXRHcmlkUmVmIiwiaGVhZGVyQ2VsbFJlbmRlciIsImRhdGFDZWxsUmVuZGVyIiwic2Nyb2xsTGVmdCIsIndpZHRoIiwiaGVpZ2h0IiwiZ3JpZERpbWVuc2lvbiIsImNvbHVtbkNvdW50IiwiZGF0YUdyaWRIZWlnaHQiLCJoZWFkZXIiLCJ0b3AiLCJEYXRhVGFibGUiLCJwaW5uZWRDb2x1bW5zIiwiQXJyYXkiLCJpc0FycmF5IiwiZmlsdGVyIiwiYyIsImluY2x1ZGVzIiwic2V0U3RhdGUiLCJzdGF0ZSIsInByb3BzQ2FjaGUiLCJ1bnBpbm5lZENvbHVtbnMiLCJyb290IiwiY3VycmVudCIsImNsaWVudFdpZHRoIiwiYWRqdXN0V2lkdGgiLCJnZXRDZWxsU2l6ZUNhY2hlIiwiZG9TY2FsZUNlbGxzVG9XaWR0aCIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJzY2FsZUNlbGxzVG9XaWR0aCIsInByZXZQcm9wcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJ1bnBpbm5lZENvbHVtbnNHaG9zdCIsInBpbm5lZENvbHVtbnNXaWR0aCIsInJlZHVjZSIsImFjYyIsInZhbCIsImhhc1Bpbm5lZENvbHVtbnMiLCJCb29sZWFuIiwiaGVhZGVyUm93SGVpZ2h0Iiwicm93SGVpZ2h0IiwiY2xhc3NOYW1lIiwicm93Q291bnQiLCJPYmplY3QiLCJrZXlzIiwiYXJncyIsInBpbm5lZEdyaWQiLCJtYXJnaW5MZWZ0IiwidW5waW5uZWRHcmlkIiwiQ29tcG9uZW50IiwiRGF0YVRhYmxlRmFjdG9yeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFFQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsc0JBQXNCLEdBQUcsRUFBL0I7QUFDQSxJQUFNQyxnQkFBZ0IsR0FBRyxFQUF6QjtBQUNBLElBQU1DLG1CQUFtQixHQUFHLEVBQTVCO0FBQ0EsSUFBTUMsZ0JBQWdCLEdBQUcsRUFBekI7QUFDQSxJQUFNQyxpQkFBaUIsa0ZBQ3BCQyxpQ0FBZ0JDLE9BREksRUFDTSxJQUROLHdEQUVwQkQsaUNBQWdCRSxJQUZJLEVBRUcsSUFGSCxzQkFBdkI7O0FBS08sSUFBTUMsU0FBUyxHQUFHQyw2QkFBT0MsR0FBVixvQkFJWCxVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLFdBQWhCO0FBQUEsQ0FKTSxFQTBEVSxVQUFBRixLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlFLHFCQUFoQjtBQUFBLENBMURmLEVBMEVJLFVBQUFILEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUcsaUJBQWhCO0FBQUEsQ0ExRVQsRUE2RUksVUFBQUosS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZSSxnQkFBaEI7QUFBQSxDQTdFVCxFQStGVyxVQUFBTCxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlLLGVBQWhCO0FBQUEsQ0EvRmhCLEVBZ0dVLFVBQUFOLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUssZUFBaEI7QUFBQSxDQWhHZixFQW1HSCxVQUFBTixLQUFLO0FBQUEsU0FBSUEsS0FBSyxD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QUFhLEVBQUUsRUFGSztBQUdwQnpELEVBQUFBLE9BQU8sRUFBRSxFQUhXO0FBSXBCTixFQUFBQSxhQUFhLEVBQUUsRUFKSztBQUtwQlEsRUFBQUEsVUFBVSxFQUFFLEVBTFE7QUFNcEJxQyxFQUFBQSxVQUFVLEVBQUUsSUFOUTtBQU9wQkMsRUFBQUEsV0FBVyxFQUFFLElBUE87QUFRcEIvRCxFQUFBQSxLQUFLLEVBQUU7QUFSYSxDOztBQW9MeEIsU0FBU3VILGdCQUFULEdBQTRCO0FBQzFCLFNBQU8saUNBQVV4QyxTQUFWLENBQVA7QUFDRDs7ZUFFY3dDLGdCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50LCBjcmVhdGVSZWZ9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7U2Nyb2xsU3luYywgQXV0b1NpemVyfSBmcm9tICdyZWFjdC12aXJ0dWFsaXplZCc7XG5pbXBvcnQgc3R5bGVkLCB7d2l0aFRoZW1lfSBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7Y3JlYXRlU2VsZWN0b3J9IGZyb20gJ3Jlc2VsZWN0JztcbmltcG9ydCBnZXQgZnJvbSAnbG9kYXNoLmdldCc7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSAnbG9kYXNoLmRlYm91bmNlJztcblxuaW1wb3J0IE9wdGlvbkRyb3Bkb3duIGZyb20gJy4vb3B0aW9uLWRyb3Bkb3duJztcblxuaW1wb3J0IEdyaWQgZnJvbSAnLi9ncmlkJztcbmltcG9ydCBCdXR0b24gZnJvbSAnLi9idXR0b24nO1xuaW1wb3J0IHtBcnJvd1VwLCBBcnJvd0Rvd259IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCB7VmVydFRocmVlRG90c30gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IEZpZWxkVG9rZW4gZnJvbSAnY29tcG9uZW50cy9jb21tb24vZmllbGQtdG9rZW4nO1xuXG5pbXBvcnQge3BhcnNlRmllbGRWYWx1ZX0gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5pbXBvcnQge2FkanVzdENlbGxzVG9Db250YWluZXJ9IGZyb20gJy4vY2VsbC1zaXplJztcblxuaW1wb3J0IHtBTExfRklFTERfVFlQRVMsIFNPUlRfT1JERVJ9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuY29uc3QgZGVmYXVsdEhlYWRlclJvd0hlaWdodCA9IDU1O1xuY29uc3QgZGVmYXVsdFJvd0hlaWdodCA9IDMyO1xuY29uc3Qgb3ZlcnNjYW5Db2x1bW5Db3VudCA9IDEwO1xuY29uc3Qgb3ZlcnNjYW5Sb3dDb3VudCA9IDEwO1xuY29uc3QgZmllbGRUb0FsaWduUmlnaHQgPSB7XG4gIFtBTExfRklFTERfVFlQRVMuaW50ZWdlcl06IHRydWUsXG4gIFtBTExfRklFTERfVFlQRVMucmVhbF06IHRydWVcbn07XG5cbmV4cG9ydCBjb25zdCBDb250YWluZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBmb250LXNpemU6IDExcHg7XG4gIGZsZXgtZ3JvdzogMTtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yTFR9O1xuICB3aWR0aDogMTAwJTtcblxuICAuUmVhY3RWaXJ0dWFsaXplZF9fR3JpZDpmb2N1cyxcbiAgLlJlYWN0VmlydHVhbGl6ZWRfX0dyaWQ6YWN0aXZlIHtcbiAgICBvdXRsaW5lOiAwO1xuICB9XG5cbiAgLmNlbGwge1xuICAgICY6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgfVxuICB9XG5cbiAgKjpmb2N1cyB7XG4gICAgb3V0bGluZTogMDtcbiAgfVxuXG4gIC5yZXN1bHRzLXRhYmxlLXdyYXBwZXIge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBtaW4taGVpZ2h0OiAxMDAlO1xuICAgIG1heC1oZWlnaHQ6IDEwMCU7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgIGZsZXgtZ3JvdzogMTtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIGJvcmRlci10b3A6IG5vbmU7XG5cbiAgICAuc2Nyb2xsLWluLXVpLXRocmVhZDo6YWZ0ZXIge1xuICAgICAgY29udGVudDogJyc7XG4gICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICBsZWZ0OiAwO1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgICB0b3A6IDA7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAuZ3JpZC1yb3cge1xuICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgfVxuICAgIC5ncmlkLWNvbHVtbiB7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgIH1cbiAgICAucGlubmVkLWdyaWQtY29udGFpbmVyIHtcbiAgICAgIGZsZXg6IDAgMCA3NXB4O1xuICAgICAgei1pbmRleDogMTA7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICBsZWZ0OiAwO1xuICAgICAgdG9wOiAwO1xuICAgICAgYm9yZGVyLXJpZ2h0OiAycHggc29saWQgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5waW5uZWRHcmlkQm9yZGVyQ29sb3J9O1xuICAgIH1cblxuICAgIC5oZWFkZXItZ3JpZCB7XG4gICAgICBvdmVyZmxvdzogaGlkZGVuICFpbXBvcnRhbnQ7XG4gICAgfVxuXG4gICAgLmJvZHktZ3JpZCB7XG4gICAgICBvdmVyZmxvdzogb3ZlcmxheSAhaW1wb3J0YW50O1xuICAgIH1cblxuICAgIC5waW5uZWQtZ3JpZCB7XG4gICAgICBvdmVyZmxvdzogb3ZlcmxheSAhaW1wb3J0YW50O1xuICAgIH1cblxuICAgIC5ldmVuLXJvdyB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmV2ZW5Sb3dCYWNrZ3JvdW5kfTtcbiAgICB9XG4gICAgLm9kZC1yb3cge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5vZGRSb3dCYWNrZ3JvdW5kfTtcbiAgICB9XG4gICAgLmNlbGwsXG4gICAgLmhlYWRlci1jZWxsIHtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcblxuICAgICAgLm4tc29ydC1pZHgge1xuICAgICAgICBmb250LXNpemU6IDlweDtcbiAgICAgIH1cbiAgICB9XG4gICAgLmNlbGwge1xuICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuY2VsbEJvcmRlckNvbG9yfTtcbiAgICAgIGJvcmRlci1yaWdodDogMXB4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuY2VsbEJvcmRlckNvbG9yfTtcbiAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgICBvdmVyZmxvdzogYXV0bztcbiAgICAgIHBhZGRpbmc6IDAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5jZWxsUGFkZGluZ1NpZGV9cHg7XG4gICAgICBmb250LXNpemU6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuY2VsbEZvbnRTaXplfXB4O1xuXG4gICAgICAucmVzdWx0LWxpbmsge1xuICAgICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gICAgICB9XG4gICAgfVxuICAgIC5jZWxsLmVuZC1jZWxsLFxuICAgIC5oZWFkZXItY2VsbC5lbmQtY2VsbCB7XG4gICAgICBib3JkZXItcmlnaHQ6IG5vbmU7XG4gICAgICBwYWRkaW5nLXJpZ2h0OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmNlbGxQYWRkaW5nU2lkZSArIHByb3BzLnRoZW1lLmVkZ2VDZWxsUGFkZGluZ1NpZGV9cHg7XG4gICAgfVxuICAgIC5jZWxsLmZpcnN0LWNlbGwsXG4gICAgLmhlYWRlci1jZWxsLmZpcnN0LWNlbGwge1xuICAgICAgcGFkZGluZy1sZWZ0OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmNlbGxQYWRkaW5nU2lkZSArIHByb3BzLnRoZW1lLmVkZ2VDZWxsUGFkZGluZ1NpZGV9cHg7XG4gICAgfVxuICAgIC5jZWxsLmJvdHRvbS1jZWxsIHtcbiAgICAgIGJvcmRlci1ib3R0b206IG5vbmU7XG4gICAgfVxuICAgIC5jZWxsLmFsaWduLXJpZ2h0IHtcbiAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LWVuZDtcbiAgICB9XG4gICAgLmhlYWRlci1jZWxsIHtcbiAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLmhlYWRlckNlbGxCb3JkZXJDb2xvcn07XG4gICAgICBib3JkZXItdG9wOiAxcHggc29saWQgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5oZWFkZXJDZWxsQm9yZGVyQ29sb3J9O1xuICAgICAgcGFkZGluZy10b3A6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaGVhZGVyUGFkZGluZ1RvcH1weDtcbiAgICAgIHBhZGRpbmctcmlnaHQ6IDA7XG4gICAgICBwYWRkaW5nLWJvdHRvbTogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5oZWFkZXJQYWRkaW5nQm90dG9tfXB4O1xuICAgICAgcGFkZGluZy1sZWZ0OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmNlbGxQYWRkaW5nU2lkZX1weDtcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaGVhZGVyQ2VsbEJhY2tncm91bmR9O1xuXG4gICAgICAmOmhvdmVyIHtcbiAgICAgICAgLm1vcmUge1xuICAgICAgICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmhlYWRlckNlbGxJY29uQ29sb3J9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAubi1zb3J0LWlkeCB7XG4gICAgICAgIGZvbnQtc2l6ZTogOXB4O1xuICAgICAgfVxuICAgICAgLmRldGFpbHMge1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgZmxleC1ncm93OiAxO1xuICAgICAgICAuY29sLW5hbWUge1xuICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG5cbiAgICAgICAgICAuY29sLW5hbWVfX2xlZnQge1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IDZweDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLmNvbC1uYW1lX19uYW1lIHtcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgICAgICAgIH1cbiAgICAgICAgICAuY29sLW5hbWVfX3NvcnQge1xuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAubW9yZSB7XG4gICAgICAgIGNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgICAgbWFyZ2luLWxlZnQ6IDVweDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICA6Zm9jdXMge1xuICAgIG91dGxpbmU6IG5vbmU7XG4gIH1cbmA7XG5cbmNvbnN0IGRlZmF1bHRDb2x1bW5XaWR0aCA9IDIwMDtcblxuY29uc3QgY29sdW1uV2lkdGhGdW5jdGlvbiA9IChjb2x1bW5zLCBjZWxsU2l6ZUNhY2hlLCBnaG9zdCkgPT4gKHtpbmRleH0pID0+IHtcbiAgcmV0dXJuIChjb2x1bW5zW2luZGV4XSB8fCB7fSkuZ2hvc3QgPyBnaG9zdCA6IGNlbGxTaXplQ2FjaGVbY29sdW1uc1tpbmRleF1dIHx8IGRlZmF1bHRDb2x1bW5XaWR0aDtcbn07XG5cbi8qXG4gKiBUaGlzIGlzIGFuIGFjY2Vzc29yIG1ldGhvZCB1c2VkIHRvIGdlbmVyYWxpemUgZ2V0dGluZyBhIGNlbGwgZnJvbSBhIGRhdGEgcm93XG4gKi9cbmNvbnN0IGdldFJvd0NlbGwgPSAoe3Jvd3MsIGNvbHVtbnMsIGNvbHVtbiwgY29sTWV0YSwgcm93SW5kZXgsIHNvcnRDb2x1bW4sIHNvcnRPcmRlcn0pID0+IHtcbiAgY29uc3Qgcm93SWR4ID0gc29ydE9yZGVyICYmIHNvcnRPcmRlci5sZW5ndGggPyBnZXQoc29ydE9yZGVyLCByb3dJbmRleCkgOiByb3dJbmRleDtcbiAgY29uc3QgdHlwZSA9IGNvbE1ldGFbY29sdW1uXTtcblxuICByZXR1cm4gcGFyc2VGaWVsZFZhbHVlKGdldChyb3dzLCBbcm93SWR4LCBjb2x1bW5zLmluZGV4T2YoY29sdW1uKV0sICdFcnInKSwgdHlwZSk7XG59O1xuXG5jb25zdCByZW5kZXJIZWFkZXJDZWxsID0gKGNvbHVtbnMsIGlzUGlubmVkLCBwcm9wcywgdG9nZ2xlTW9yZU9wdGlvbnMsIG1vcmVPcHRpb25zQ29sdW1uKSA9PiB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC9kaXNwbGF5LW5hbWVcbiAgcmV0dXJuIGNlbGxJbmZvID0+IHtcbiAgICBjb25zdCB7Y29sdW1uSW5kZXgsIGtleSwgc3R5bGV9ID0gY2VsbEluZm87XG4gICAgY29uc3Qge1xuICAgICAgY29sTWV0YSxcbiAgICAgIHNvcnRDb2x1bW4sXG4gICAgICBzb3J0VGFibGVDb2x1bW4sXG4gICAgICB1bnNvcnRDb2x1bW4sXG4gICAgICBwaW5UYWJsZUNvbHVtbixcbiAgICAgIGNvcHlUYWJsZUNvbHVtbixcbiAgICAgIGRhdGFJZFxuICAgIH0gPSBwcm9wcztcblxuICAgIGNvbnN0IGNvbHVtbiA9IGNvbHVtbnNbY29sdW1uSW5kZXhdO1xuICAgIGNvbnN0IGlzR2hvc3QgPSBjb2x1bW4uZ2hvc3Q7XG4gICAgY29uc3QgaXNTb3J0ZWQgPSBzb3J0Q29sdW1uW2NvbHVtbl07XG4gICAgY29uc3QgZmlyc3RDZWxsID0gY29sdW1uSW5kZXggPT09IDA7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ2hlYWRlci1jZWxsJywge1xuICAgICAgICAgIFtgY29sdW1uLSR7Y29sdW1uSW5kZXh9YF06IHRydWUsXG4gICAgICAgICAgJ3Bpbm5lZC1oZWFkZXItY2VsbCc6IGlzUGlubmVkLFxuICAgICAgICAgICdmaXJzdC1jZWxsJzogZmlyc3RDZWxsXG4gICAgICAgIH0pfVxuICAgICAgICBrZXk9e2tleX1cbiAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICBvbkNsaWNrPXtlID0+IHtcbiAgICAgICAgICBlLnNoaWZ0S2V5ID8gc29ydFRhYmxlQ29sdW1uKGRhdGFJZCwgY29sdW1uKSA6IG51bGw7XG4gICAgICAgIH19XG4gICAgICAgIG9uRG91YmxlQ2xpY2s9eygpID0+IHNvcnRUYWJsZUNvbHVtbihkYXRhSWQsIGNvbHVtbil9XG4gICAgICAgIHRpdGxlPXtjb2x1bW59XG4gICAgICA+XG4gICAgICAgIHtpc0dob3N0ID8gKFxuICAgICAgICAgIDxkaXYgLz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8PlxuICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiZGV0YWlsc1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1uYW1lXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbmFtZV9fbGVmdFwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbmFtZV9fbmFtZVwiPntjb2x1bW59PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNvbC1uYW1lX19zb3J0XCJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc29ydFRhYmxlQ29sdW1uKGRhdGFJZCwgY29sdW1uKX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge2lzU29ydGVkID8gKFxuICAgICAgICAgICAgICAgICAgICAgIGlzU29ydGVkID09PSBTT1JUX09SREVSLkFTQ0VORElORyA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxBcnJvd1VwIGhlaWdodD1cIjE0cHhcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8QXJyb3dEb3duIGhlaWdodD1cIjE0cHhcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8QnV0dG9uIGNsYXNzTmFtZT1cIm1vcmVcIiBvbkNsaWNrPXsoKSA9PiB0b2dnbGVNb3JlT3B0aW9ucyhjb2x1bW4pfT5cbiAgICAgICAgICAgICAgICAgIDxWZXJ0VGhyZWVEb3RzIGhlaWdodD1cIjE0cHhcIiAvPlxuICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICA8RmllbGRUb2tlbiB0eXBlPXtjb2xNZXRhW2NvbHVtbl19IC8+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cIm9wdGlvbnNcIj5cbiAgICAgICAgICAgICAgPE9wdGlvbkRyb3Bkb3duXG4gICAgICAgICAgICAgICAgaXNPcGVuZWQ9e21vcmVPcHRpb25zQ29sdW1uID09PSBjb2x1bW59XG4gICAgICAgICAgICAgICAgdHlwZT17Y29sTWV0YVtjb2x1bW5dfVxuICAgICAgICAgICAgICAgIGNvbHVtbj17Y29sdW1ufVxuICAgICAgICAgICAgICAgIHRvZ2dsZU1vcmVPcHRpb25zPXt0b2dnbGVNb3JlT3B0aW9uc31cbiAgICAgICAgICAgICAgICBzb3J0VGFibGVDb2x1bW49e21vZGUgPT4gc29ydFRhYmxlQ29sdW1uKGRhdGFJZCwgY29sdW1uLCBtb2RlKX1cbiAgICAgICAgICAgICAgICBzb3J0TW9kZT17c29ydENvbHVtbiAmJiBzb3J0Q29sdW1uW2NvbHVtbl19XG4gICAgICAgICAgICAgICAgcGluVGFibGVDb2x1bW49eygpID0+IHBpblRhYmxlQ29sdW1uKGRhdGFJZCwgY29sdW1uKX1cbiAgICAgICAgICAgICAgICBjb3B5VGFibGVDb2x1bW49eygpID0+IGNvcHlUYWJsZUNvbHVtbihkYXRhSWQsIGNvbHVtbil9XG4gICAgICAgICAgICAgICAgaXNTb3J0ZWQ9e2lzU29ydGVkfVxuICAgICAgICAgICAgICAgIGlzUGlubmVkPXtpc1Bpbm5lZH1cbiAgICAgICAgICAgICAgICB1bnNvcnRDb2x1bW49e3Vuc29ydENvbHVtbn1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICA8Lz5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH07XG59O1xuXG5jb25zdCByZW5kZXJEYXRhQ2VsbCA9IChjb2x1bW5zLCBpc1Bpbm5lZCwgcHJvcHMpID0+IHtcbiAgcmV0dXJuIGNlbGxJbmZvID0+IHtcbiAgICBjb25zdCB7Y29sdW1uSW5kZXgsIGtleSwgc3R5bGUsIHJvd0luZGV4fSA9IGNlbGxJbmZvO1xuICAgIGNvbnN0IHtyb3dzLCBjb2xNZXRhfSA9IHByb3BzO1xuICAgIGNvbnN0IGNvbHVtbiA9IGNvbHVtbnNbY29sdW1uSW5kZXhdO1xuICAgIGNvbnN0IGlzR2hvc3QgPSBjb2x1bW4uZ2hvc3Q7XG5cbiAgICBjb25zdCByb3dDZWxsID0gaXNHaG9zdCA/ICcnIDogZ2V0Um93Q2VsbCh7Li4ucHJvcHMsIGNvbHVtbiwgcm93SW5kZXh9KTtcbiAgICBjb25zdCB0eXBlID0gaXNHaG9zdCA/IG51bGwgOiBjb2xNZXRhW2NvbHVtbl07XG5cbiAgICBjb25zdCBlbmRDZWxsID0gY29sdW1uSW5kZXggPT09IGNvbHVtbnMubGVuZ3RoIC0gMTtcbiAgICBjb25zdCBmaXJzdENlbGwgPSBjb2x1bW5JbmRleCA9PT0gMDtcbiAgICBjb25zdCBib3R0b21DZWxsID0gcm93SW5kZXggPT09IHJvd3MubGVuZ3RoIC0gMTtcbiAgICBjb25zdCBhbGlnblJpZ2h0ID0gZmllbGRUb0FsaWduUmlnaHRbdHlwZV07XG5cbiAgICBjb25zdCBjZWxsID0gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ2NlbGwnLCB7XG4gICAgICAgICAgW3Jvd0luZGV4ICUgMiA9PT0gMCA/ICdldmVuLXJvdycgOiAnb2RkLXJvdyddOiB0cnVlLFxuICAgICAgICAgIFtgcm93LSR7cm93SW5kZXh9YF06IHRydWUsXG4gICAgICAgICAgJ3Bpbm5lZC1jZWxsJzogaXNQaW5uZWQsXG4gICAgICAgICAgJ2ZpcnN0LWNlbGwnOiBmaXJzdENlbGwsXG4gICAgICAgICAgJ2VuZC1jZWxsJzogZW5kQ2VsbCxcbiAgICAgICAgICAnYm90dG9tLWNlbGwnOiBib3R0b21DZWxsLFxuICAgICAgICAgICdhbGlnbi1yaWdodCc6IGFsaWduUmlnaHRcbiAgICAgICAgfSl9XG4gICAgICAgIGtleT17a2V5fVxuICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgIHRpdGxlPXtpc0dob3N0ID8gdW5kZWZpbmVkIDogcm93Q2VsbH1cbiAgICAgID5cbiAgICAgICAge2Ake3Jvd0NlbGx9JHtlbmRDZWxsID8gJ1xcbicgOiAnXFx0J31gfVxuICAgICAgPC9kaXY+XG4gICAgKTtcblxuICAgIHJldHVybiBjZWxsO1xuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IFRhYmxlU2VjdGlvbiA9ICh7XG4gIGNsYXNzTGlzdCxcbiAgaXNQaW5uZWQsXG4gIGNvbHVtbnMsXG4gIGhlYWRlckdyaWRQcm9wcyxcbiAgZml4ZWRXaWR0aCxcbiAgZml4ZWRIZWlnaHQsXG4gIG9uU2Nyb2xsLFxuICBzY3JvbGxUb3AsXG4gIGRhdGFHcmlkUHJvcHMsXG4gIGNvbHVtbldpZHRoLFxuICBzZXRHcmlkUmVmLFxuICBoZWFkZXJDZWxsUmVuZGVyLFxuICBkYXRhQ2VsbFJlbmRlcixcbiAgc2Nyb2xsTGVmdFxufSkgPT4gKFxuICA8QXV0b1NpemVyPlxuICAgIHsoe3dpZHRoLCBoZWlnaHR9KSA9PiB7XG4gICAgICBjb25zdCBncmlkRGltZW5zaW9uID0ge1xuICAgICAgICBjb2x1bW5Db3VudDogY29sdW1ucy5sZW5ndGgsXG4gICAgICAgIGNvbHVtbldpZHRoLFxuICAgICAgICB3aWR0aDogZml4ZWRXaWR0aCB8fCB3aWR0aFxuICAgICAgfTtcbiAgICAgIGNvbnN0IGRhdGFHcmlkSGVpZ2h0ID0gZml4ZWRIZWlnaHQgfHwgaGVpZ2h0O1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPD5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnc2Nyb2xsLWluLXVpLXRocmVhZCcsIGNsYXNzTGlzdC5oZWFkZXIpfT5cbiAgICAgICAgICAgIDxHcmlkXG4gICAgICAgICAgICAgIGNlbGxSZW5kZXJlcj17aGVhZGVyQ2VsbFJlbmRlcn1cbiAgICAgICAgICAgICAgey4uLmhlYWRlckdyaWRQcm9wc31cbiAgICAgICAgICAgICAgey4uLmdyaWREaW1lbnNpb259XG4gICAgICAgICAgICAgIHNjcm9sbExlZnQ9e3Njcm9sbExlZnR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnc2Nyb2xsLWluLXVpLXRocmVhZCcsIGNsYXNzTGlzdC5yb3dzKX1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHRvcDogaGVhZGVyR3JpZFByb3BzLmhlaWdodFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8R3JpZFxuICAgICAgICAgICAgICBjZWxsUmVuZGVyZXI9e2RhdGFDZWxsUmVuZGVyfVxuICAgICAgICAgICAgICB7Li4uZGF0YUdyaWRQcm9wc31cbiAgICAgICAgICAgICAgey4uLmdyaWREaW1lbnNpb259XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17aXNQaW5uZWQgPyAncGlubmVkLWdyaWQnIDogJ2JvZHktZ3JpZCd9XG4gICAgICAgICAgICAgIGhlaWdodD17ZGF0YUdyaWRIZWlnaHQgLSBoZWFkZXJHcmlkUHJvcHMuaGVpZ2h0fVxuICAgICAgICAgICAgICBvblNjcm9sbD17b25TY3JvbGx9XG4gICAgICAgICAgICAgIHNjcm9sbFRvcD17c2Nyb2xsVG9wfVxuICAgICAgICAgICAgICBzZXRHcmlkUmVmPXtzZXRHcmlkUmVmfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC8+XG4gICAgICApO1xuICAgIH19XG4gIDwvQXV0b1NpemVyPlxuKTtcblxuZXhwb3J0IGNsYXNzIERhdGFUYWJsZSBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgcm93czogW10sXG4gICAgcGlubmVkQ29sdW1uczogW10sXG4gICAgY29sTWV0YToge30sXG4gICAgY2VsbFNpemVDYWNoZToge30sXG4gICAgc29ydENvbHVtbjoge30sXG4gICAgZml4ZWRXaWR0aDogbnVsbCxcbiAgICBmaXhlZEhlaWdodDogbnVsbCxcbiAgICB0aGVtZToge31cbiAgfTtcblxuICBzdGF0ZSA9IHtcbiAgICBjZWxsU2l6ZUNhY2hlOiB7fSxcbiAgICBtb3JlT3B0aW9uc0NvbHVtbjogbnVsbFxuICB9O1xuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnNjYWxlQ2VsbHNUb1dpZHRoKTtcbiAgICB0aGlzLnNjYWxlQ2VsbHNUb1dpZHRoKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5wcm9wcy5jZWxsU2l6ZUNhY2hlICE9PSBwcmV2UHJvcHMuY2VsbFNpemVDYWNoZSB8fFxuICAgICAgdGhpcy5wcm9wcy5waW5uZWRDb2x1bW5zICE9PSBwcmV2UHJvcHMucGlubmVkQ29sdW1uc1xuICAgICkge1xuICAgICAgdGhpcy5zY2FsZUNlbGxzVG9XaWR0aCgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnNjYWxlQ2VsbHNUb1dpZHRoKTtcbiAgfVxuICByb290ID0gY3JlYXRlUmVmKCk7XG4gIGNvbHVtbnMgPSBwcm9wcyA9PiBwcm9wcy5jb2x1bW5zO1xuICBwaW5uZWRDb2x1bW5zID0gcHJvcHMgPT4gcHJvcHMucGlubmVkQ29sdW1ucztcbiAgdW5waW5uZWRDb2x1bW5zID0gY3JlYXRlU2VsZWN0b3IodGhpcy5jb2x1bW5zLCB0aGlzLnBpbm5lZENvbHVtbnMsIChjb2x1bW5zLCBwaW5uZWRDb2x1bW5zKSA9PlxuICAgICFBcnJheS5pc0FycmF5KHBpbm5lZENvbHVtbnMpID8gY29sdW1ucyA6IGNvbHVtbnMuZmlsdGVyKGMgPT4gIXBpbm5lZENvbHVtbnMuaW5jbHVkZXMoYykpXG4gICk7XG5cbiAgdG9nZ2xlTW9yZU9wdGlvbnMgPSBtb3JlT3B0aW9uc0NvbHVtbiA9PlxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW9yZU9wdGlvbnNDb2x1bW46XG4gICAgICAgIHRoaXMuc3RhdGUubW9yZU9wdGlvbnNDb2x1bW4gPT09IG1vcmVPcHRpb25zQ29sdW1uID8gbnVsbCA6IG1vcmVPcHRpb25zQ29sdW1uXG4gICAgfSk7XG5cbiAgZ2V0Q2VsbFNpemVDYWNoZSA9ICgpID0+IHtcbiAgICBjb25zdCB7Y2VsbFNpemVDYWNoZTogcHJvcHNDYWNoZSwgZml4ZWRXaWR0aCwgcGlubmVkQ29sdW1uc30gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHVucGlubmVkQ29sdW1ucyA9IHRoaXMudW5waW5uZWRDb2x1bW5zKHRoaXMucHJvcHMpO1xuXG4gICAgY29uc3Qgd2lkdGggPSBmaXhlZFdpZHRoID8gZml4ZWRXaWR0aCA6IHRoaXMucm9vdC5jdXJyZW50ID8gdGhpcy5yb290LmN1cnJlbnQuY2xpZW50V2lkdGggOiAwO1xuXG4gICAgLy8gcGluIGNvbHVtbiBib3JkZXIgaXMgMiBwaXhlbCB2cyAxIHBpeGVsXG4gICAgY29uc3QgYWRqdXN0V2lkdGggPSBwaW5uZWRDb2x1bW5zLmxlbmd0aCA/IHdpZHRoIC0gMSA6IHdpZHRoO1xuICAgIGNvbnN0IHtjZWxsU2l6ZUNhY2hlLCBnaG9zdH0gPSBhZGp1c3RDZWxsc1RvQ29udGFpbmVyKFxuICAgICAgYWRqdXN0V2lkdGgsXG4gICAgICBwcm9wc0NhY2hlLFxuICAgICAgcGlubmVkQ29sdW1ucyxcbiAgICAgIHVucGlubmVkQ29sdW1uc1xuICAgICk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNlbGxTaXplQ2FjaGUsXG4gICAgICBnaG9zdFxuICAgIH07XG4gIH07XG5cbiAgZG9TY2FsZUNlbGxzVG9XaWR0aCA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0Q2VsbFNpemVDYWNoZSgpKTtcbiAgfTtcblxuICBzY2FsZUNlbGxzVG9XaWR0aCA9IGRlYm91bmNlKHRoaXMuZG9TY2FsZUNlbGxzVG9XaWR0aCwgMzAwKTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge3Jvd3MsIHBpbm5lZENvbHVtbnMsIHRoZW1lID0ge30sIGZpeGVkV2lkdGgsIGZpeGVkSGVpZ2h0fSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgdW5waW5uZWRDb2x1bW5zID0gdGhpcy51bnBpbm5lZENvbHVtbnModGhpcy5wcm9wcyk7XG5cbiAgICBjb25zdCB7Y2VsbFNpemVDYWNoZSwgbW9yZU9wdGlvbnNDb2x1bW4sIGdob3N0fSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgdW5waW5uZWRDb2x1bW5zR2hvc3QgPSBnaG9zdCA/IFsuLi51bnBpbm5lZENvbHVtbnMsIHtnaG9zdDogdHJ1ZX1dIDogdW5waW5uZWRDb2x1bW5zO1xuICAgIGNvbnN0IHBpbm5lZENvbHVtbnNXaWR0aCA9IHBpbm5lZENvbHVtbnMucmVkdWNlKFxuICAgICAgKGFjYywgdmFsKSA9PiBhY2MgKyBnZXQoY2VsbFNpemVDYWNoZSwgdmFsLCAwKSxcbiAgICAgIDBcbiAgICApO1xuXG4gICAgY29uc3QgaGFzUGlubmVkQ29sdW1ucyA9IEJvb2xlYW4ocGlubmVkQ29sdW1ucy5sZW5ndGgpO1xuICAgIGNvbnN0IHtoZWFkZXJSb3dIZWlnaHQgPSBkZWZhdWx0SGVhZGVyUm93SGVpZ2h0LCByb3dIZWlnaHQgPSBkZWZhdWx0Um93SGVpZ2h0fSA9IHRoZW1lO1xuXG4gICAgY29uc3QgaGVhZGVyR3JpZFByb3BzID0ge1xuICAgICAgY2VsbFNpemVDYWNoZSxcbiAgICAgIGNsYXNzTmFtZTogJ2hlYWRlci1ncmlkJyxcbiAgICAgIGhlaWdodDogaGVhZGVyUm93SGVpZ2h0LFxuICAgICAgcm93Q291bnQ6IDEsXG4gICAgICByb3dIZWlnaHQ6IGhlYWRlclJvd0hlaWdodFxuICAgIH07XG5cbiAgICBjb25zdCBkYXRhR3JpZFByb3BzID0ge1xuICAgICAgY2VsbFNpemVDYWNoZSxcbiAgICAgIG92ZXJzY2FuQ29sdW1uQ291bnQsXG4gICAgICBvdmVyc2NhblJvd0NvdW50LFxuICAgICAgcm93Q291bnQ6IChyb3dzIHx8IFtdKS5sZW5ndGgsXG4gICAgICByb3dIZWlnaHRcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxDb250YWluZXIgY2xhc3NOYW1lPVwiZGF0YS10YWJsZS1jb250YWluZXJcIiByZWY9e3RoaXMucm9vdH0+XG4gICAgICAgIHtPYmplY3Qua2V5cyhjZWxsU2l6ZUNhY2hlKS5sZW5ndGggJiYgKFxuICAgICAgICAgIDxTY3JvbGxTeW5jPlxuICAgICAgICAgICAgeyh7b25TY3JvbGwsIHNjcm9sbExlZnQsIHNjcm9sbFRvcH0pID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlc3VsdHMtdGFibGUtd3JhcHBlclwiPlxuICAgICAgICAgICAgICAgICAge2hhc1Bpbm5lZENvbHVtbnMgJiYgKFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT1cInBpbm5lZC1jb2x1bW5zXCIgY2xhc3NOYW1lPVwicGlubmVkLWNvbHVtbnMgZ3JpZC1yb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8VGFibGVTZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc0xpc3Q9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyOiAncGlubmVkLWNvbHVtbnMtLWhlYWRlciBwaW5uZWQtZ3JpZC1jb250YWluZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByb3dzOiAncGlubmVkLWNvbHVtbnMtLXJvd3MgcGlubmVkLWdyaWQtY29udGFpbmVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUGlubmVkXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5zPXtwaW5uZWRDb2x1bW5zfVxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyR3JpZFByb3BzPXtoZWFkZXJHcmlkUHJvcHN9XG4gICAgICAgICAgICAgICAgICAgICAgICBmaXhlZFdpZHRoPXtwaW5uZWRDb2x1bW5zV2lkdGh9XG4gICAgICAgICAgICAgICAgICAgICAgICBvblNjcm9sbD17YXJncyA9PiBvblNjcm9sbCh7Li4uYXJncywgc2Nyb2xsTGVmdH0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wPXtzY3JvbGxUb3B9XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhR3JpZFByb3BzPXtkYXRhR3JpZFByb3BzfVxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0R3JpZFJlZj17cGlubmVkR3JpZCA9PiAodGhpcy5waW5uZWRHcmlkID0gcGlubmVkR3JpZCl9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5XaWR0aD17Y29sdW1uV2lkdGhGdW5jdGlvbihwaW5uZWRDb2x1bW5zLCBjZWxsU2l6ZUNhY2hlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlckNlbGxSZW5kZXI9e3JlbmRlckhlYWRlckNlbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHBpbm5lZENvbHVtbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlTW9yZU9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG1vcmVPcHRpb25zQ29sdW1uXG4gICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUNlbGxSZW5kZXI9e3JlbmRlckRhdGFDZWxsKHBpbm5lZENvbHVtbnMsIHRydWUsIHRoaXMucHJvcHMpfVxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAga2V5PVwidW5waW5uZWQtY29sdW1uc1wiXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgbWFyZ2luTGVmdDogYCR7aGFzUGlubmVkQ29sdW1ucyA/IGAke3Bpbm5lZENvbHVtbnNXaWR0aH1weGAgOiAnMCd9YFxuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ1bnBpbm5lZC1jb2x1bW5zIGdyaWQtY29sdW1uXCJcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPFRhYmxlU2VjdGlvblxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTGlzdD17e1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyOiAndW5waW5uZWQtY29sdW1ucy0taGVhZGVyIHVucGlubmVkLWdyaWQtY29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3M6ICd1bnBpbm5lZC1jb2x1bW5zLS1yb3dzIHVucGlubmVkLWdyaWQtY29udGFpbmVyJ1xuICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgaXNQaW5uZWQ9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbnM9e3VucGlubmVkQ29sdW1uc0dob3N0fVxuICAgICAgICAgICAgICAgICAgICAgIGdob3N0PXtnaG9zdH1cbiAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJHcmlkUHJvcHM9e2hlYWRlckdyaWRQcm9wc31cbiAgICAgICAgICAgICAgICAgICAgICBmaXhlZFdpZHRoPXtmaXhlZFdpZHRofVxuICAgICAgICAgICAgICAgICAgICAgIGZpeGVkSGVpZ2h0PXtmaXhlZEhlaWdodH1cbiAgICAgICAgICAgICAgICAgICAgICBvblNjcm9sbD17b25TY3JvbGx9XG4gICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wPXtzY3JvbGxUb3B9XG4gICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsTGVmdD17c2Nyb2xsTGVmdH1cbiAgICAgICAgICAgICAgICAgICAgICBkYXRhR3JpZFByb3BzPXtkYXRhR3JpZFByb3BzfVxuICAgICAgICAgICAgICAgICAgICAgIHNldEdyaWRSZWY9e3VucGlubmVkR3JpZCA9PiAodGhpcy51bnBpbm5lZEdyaWQgPSB1bnBpbm5lZEdyaWQpfVxuICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbldpZHRoPXtjb2x1bW5XaWR0aEZ1bmN0aW9uKHVucGlubmVkQ29sdW1uc0dob3N0LCBjZWxsU2l6ZUNhY2hlLCBnaG9zdCl9XG4gICAgICAgICAgICAgICAgICAgICAgaGVhZGVyQ2VsbFJlbmRlcj17cmVuZGVySGVhZGVyQ2VsbChcbiAgICAgICAgICAgICAgICAgICAgICAgIHVucGlubmVkQ29sdW1uc0dob3N0LFxuICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b2dnbGVNb3JlT3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vcmVPcHRpb25zQ29sdW1uXG4gICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICBkYXRhQ2VsbFJlbmRlcj17cmVuZGVyRGF0YUNlbGwodW5waW5uZWRDb2x1bW5zR2hvc3QsIGZhbHNlLCB0aGlzLnByb3BzKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICA8L1Njcm9sbFN5bmM+XG4gICAgICAgICl9XG4gICAgICA8L0NvbnRhaW5lcj5cbiAgICApO1xuICB9XG59XG5cbmZ1bmN0aW9uIERhdGFUYWJsZUZhY3RvcnkoKSB7XG4gIHJldHVybiB3aXRoVGhlbWUoRGF0YVRhYmxlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgRGF0YVRhYmxlRmFjdG9yeTtcbiJdfQ==