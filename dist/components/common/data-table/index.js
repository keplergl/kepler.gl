"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.TableSection = exports.Container = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

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

var _dataUtils = require("../../../utils/data-utils");

var _cellSize = require("./cell-size");

var _defaultSettings = require("../../../constants/default-settings");

var _fieldToken = _interopRequireDefault(require("../field-token"));

var _fieldToAlignRight, _templateObject;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var defaultHeaderRowHeight = 55;
var defaultRowHeight = 32;
var overscanColumnCount = 10;
var overscanRowCount = 10;
var fieldToAlignRight = (_fieldToAlignRight = {}, (0, _defineProperty2["default"])(_fieldToAlignRight, _defaultSettings.ALL_FIELD_TYPES.integer, true), (0, _defineProperty2["default"])(_fieldToAlignRight, _defaultSettings.ALL_FIELD_TYPES.real, true), _fieldToAlignRight);

var Container = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  font-size: 11px;\n  flex-grow: 1;\n  color: ", ";\n  width: 100%;\n\n  .ReactVirtualized__Grid:focus,\n  .ReactVirtualized__Grid:active {\n    outline: 0;\n  }\n\n  .cell {\n    &::-webkit-scrollbar {\n      display: none;\n    }\n  }\n\n  *:focus {\n    outline: 0;\n  }\n\n  .results-table-wrapper {\n    position: relative;\n    min-height: 100%;\n    max-height: 100%;\n    display: flex;\n    flex-direction: row;\n    flex-grow: 1;\n    overflow: hidden;\n    border-top: none;\n\n    .scroll-in-ui-thread::after {\n      content: '';\n      height: 100%;\n      left: 0;\n      position: absolute;\n      pointer-events: none;\n      top: 0;\n      width: 100%;\n    }\n\n    .grid-row {\n      position: relative;\n      display: flex;\n      flex-direction: row;\n    }\n    .grid-column {\n      display: flex;\n      flex-direction: column;\n      flex: 1 1 auto;\n    }\n    .pinned-grid-container {\n      flex: 0 0 75px;\n      z-index: 10;\n      position: absolute;\n      left: 0;\n      top: 0;\n      border-right: 2px solid ", ";\n    }\n\n    .header-grid {\n      overflow: hidden !important;\n    }\n\n    .even-row {\n      background-color: ", ";\n    }\n    .odd-row {\n      background-color: ", ";\n    }\n    .cell,\n    .header-cell {\n      width: 100%;\n      height: 100%;\n      display: flex;\n      flex-direction: column;\n      justify-content: center;\n      align-items: flex-start;\n      text-align: center;\n      overflow: hidden;\n\n      .n-sort-idx {\n        font-size: 9px;\n      }\n    }\n    .cell {\n      border-bottom: 1px solid ", ";\n      border-right: 1px solid ", ";\n      white-space: nowrap;\n      overflow: auto;\n      padding: 0 ", "px;\n      font-size: ", "px;\n\n      .result-link {\n        text-decoration: none;\n      }\n    }\n    .cell.end-cell,\n    .header-cell.end-cell {\n      border-right: none;\n      padding-right: ", "px;\n    }\n    .cell.first-cell,\n    .header-cell.first-cell {\n      padding-left: ", "px;\n    }\n    .cell.bottom-cell {\n      border-bottom: none;\n    }\n    .cell.align-right {\n      align-items: flex-end;\n    }\n    .header-cell {\n      border-bottom: 1px solid ", ";\n      border-top: 1px solid ", ";\n      padding-top: ", "px;\n      padding-right: 0;\n      padding-bottom: ", "px;\n      padding-left: ", "px;\n      align-items: center;\n      justify-content: space-between;\n      display: flex;\n      flex-direction: row;\n      background-color: ", ";\n\n      &:hover {\n        .more {\n          color: ", ";\n        }\n      }\n      .n-sort-idx {\n        font-size: 9px;\n      }\n      .details {\n        font-weight: 500;\n        display: flex;\n        flex-direction: column;\n        justify-content: flex-start;\n        height: 100%;\n        overflow: hidden;\n        flex-grow: 1;\n\n        .col-name {\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          cursor: pointer;\n\n          .col-name__left {\n            display: flex;\n            align-items: center;\n            overflow: hidden;\n            svg {\n              margin-left: 6px;\n            }\n          }\n          .col-name__name {\n            overflow: hidden;\n            white-space: nowrap;\n          }\n        }\n      }\n\n      .more {\n        color: transparent;\n        margin-left: 5px;\n      }\n    }\n  }\n\n  :focus {\n    outline: none;\n  }\n"])), function (props) {
  return props.theme.dataTableTextColor;
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
      sortOrder = _ref2.sortOrder;
  var rowIdx = sortOrder && sortOrder.length ? (0, _lodash["default"])(sortOrder, rowIndex) : rowIndex;
  var type = colMeta[column].type;
  return (0, _dataUtils.parseFieldValue)((0, _lodash["default"])(rows, [rowIdx, columns.indexOf(column)], 'Err'), type);
};

var TableSection = function TableSection(_ref3) {
  var classList = _ref3.classList,
      isPinned = _ref3.isPinned,
      columns = _ref3.columns,
      headerGridProps = _ref3.headerGridProps,
      fixedWidth = _ref3.fixedWidth,
      _ref3$fixedHeight = _ref3.fixedHeight,
      fixedHeight = _ref3$fixedHeight === void 0 ? undefined : _ref3$fixedHeight,
      onScroll = _ref3.onScroll,
      scrollTop = _ref3.scrollTop,
      dataGridProps = _ref3.dataGridProps,
      columnWidth = _ref3.columnWidth,
      setGridRef = _ref3.setGridRef,
      headerCellRender = _ref3.headerCellRender,
      dataCellRender = _ref3.dataCellRender,
      _ref3$scrollLeft = _ref3.scrollLeft,
      scrollLeft = _ref3$scrollLeft === void 0 ? undefined : _ref3$scrollLeft;
  return /*#__PURE__*/_react["default"].createElement(_reactVirtualized.AutoSizer, null, function (_ref4) {
    var width = _ref4.width,
        height = _ref4.height;
    var gridDimension = {
      columnCount: columns.length,
      columnWidth: columnWidth,
      width: fixedWidth || width
    };
    var dataGridHeight = fixedHeight || height;
    return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
      className: (0, _classnames3["default"])('scroll-in-ui-thread', classList.header)
    }, /*#__PURE__*/_react["default"].createElement(_grid["default"], (0, _extends2["default"])({
      cellRenderer: headerCellRender
    }, headerGridProps, gridDimension, {
      scrollLeft: scrollLeft
    }))), /*#__PURE__*/_react["default"].createElement("div", {
      className: (0, _classnames3["default"])('scroll-in-ui-thread', classList.rows),
      style: {
        top: headerGridProps.height
      }
    }, /*#__PURE__*/_react["default"].createElement(_grid["default"], (0, _extends2["default"])({
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
DataTableFactory.deps = [_fieldToken["default"]];

function DataTableFactory(FieldToken) {
  var DataTable = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(DataTable, _Component);

    var _super = _createSuper(DataTable);

    function DataTable() {
      var _this;

      (0, _classCallCheck2["default"])(this, DataTable);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
        cellSizeCache: {},
        moreOptionsColumn: null
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "root", /*#__PURE__*/(0, _react.createRef)());
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
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "renderHeaderCell", function (columns, isPinned, props, toggleMoreOptions, moreOptionsColumn, TokenComponent) {
        // eslint-disable-next-line react/display-name
        return function (cellInfo) {
          var _classnames;

          var columnIndex = cellInfo.columnIndex,
              key = cellInfo.key,
              style = cellInfo.style;
          var colMeta = props.colMeta,
              sortColumn = props.sortColumn,
              _sortTableColumn = props.sortTableColumn,
              _pinTableColumn = props.pinTableColumn,
              _copyTableColumn = props.copyTableColumn;
          var column = columns[columnIndex];
          var isGhost = column.ghost;
          var isSorted = sortColumn[column];
          var firstCell = columnIndex === 0;
          return /*#__PURE__*/_react["default"].createElement("div", {
            className: (0, _classnames3["default"])('header-cell', (_classnames = {}, (0, _defineProperty2["default"])(_classnames, "column-".concat(columnIndex), true), (0, _defineProperty2["default"])(_classnames, 'pinned-header-cell', isPinned), (0, _defineProperty2["default"])(_classnames, 'first-cell', firstCell), _classnames)),
            key: key,
            style: style,
            onClick: function onClick(e) {
              e.shiftKey ? _sortTableColumn(column) : null;
            },
            onDoubleClick: function onDoubleClick() {
              return _sortTableColumn(column);
            },
            title: column
          }, isGhost ? /*#__PURE__*/_react["default"].createElement("div", null) : /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("section", {
            className: "details"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "col-name"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "col-name__left"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "col-name__name"
          }, colMeta[column].name), /*#__PURE__*/_react["default"].createElement(_button["default"], {
            className: "col-name__sort",
            onClick: function onClick() {
              return _sortTableColumn(column);
            }
          }, isSorted ? isSorted === _defaultSettings.SORT_ORDER.ASCENDING ? /*#__PURE__*/_react["default"].createElement(_icons.ArrowUp, {
            height: "14px"
          }) : /*#__PURE__*/_react["default"].createElement(_icons.ArrowDown, {
            height: "14px"
          }) : null)), /*#__PURE__*/_react["default"].createElement(_button["default"], {
            className: "more",
            onClick: function onClick() {
              return toggleMoreOptions(column);
            }
          }, /*#__PURE__*/_react["default"].createElement(_icons.VertThreeDots, {
            height: "14px"
          }))), /*#__PURE__*/_react["default"].createElement(FieldToken, {
            type: colMeta[column].type
          })), /*#__PURE__*/_react["default"].createElement("section", {
            className: "options"
          }, /*#__PURE__*/_react["default"].createElement(_optionDropdown["default"], {
            isOpened: moreOptionsColumn === column,
            type: colMeta[column].type,
            column: column,
            toggleMoreOptions: toggleMoreOptions,
            sortTableColumn: function sortTableColumn(mode) {
              return _sortTableColumn(column, mode);
            },
            sortMode: sortColumn && sortColumn[column],
            pinTableColumn: function pinTableColumn() {
              return _pinTableColumn(column);
            },
            copyTableColumn: function copyTableColumn() {
              return _copyTableColumn(column);
            },
            isSorted: isSorted,
            isPinned: isPinned
          }))));
        };
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "renderDataCell", function (columns, isPinned, props) {
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
          var rowCell = isGhost ? '' : getRowCell(_objectSpread(_objectSpread({}, props), {}, {
            column: column,
            rowIndex: rowIndex
          }));
          var type = isGhost ? null : colMeta[column].type;
          var endCell = columnIndex === columns.length - 1;
          var firstCell = columnIndex === 0;
          var bottomCell = rowIndex === rows.length - 1;
          var alignRight = fieldToAlignRight[type];

          var cell = /*#__PURE__*/_react["default"].createElement("div", {
            className: (0, _classnames3["default"])('cell', (_classnames2 = {}, (0, _defineProperty2["default"])(_classnames2, rowIndex % 2 === 0 ? 'even-row' : 'odd-row', true), (0, _defineProperty2["default"])(_classnames2, "row-".concat(rowIndex), true), (0, _defineProperty2["default"])(_classnames2, 'pinned-cell', isPinned), (0, _defineProperty2["default"])(_classnames2, 'first-cell', firstCell), (0, _defineProperty2["default"])(_classnames2, 'end-cell', endCell), (0, _defineProperty2["default"])(_classnames2, 'bottom-cell', bottomCell), (0, _defineProperty2["default"])(_classnames2, 'align-right', alignRight), _classnames2)),
            key: key,
            style: style,
            title: isGhost ? undefined : rowCell
          }, "".concat(rowCell).concat(endCell ? '\n' : '\t'));

          return cell;
        };
      });
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
        window.removeEventListener('resize', this.scaleCellsToWidth); // fix Warning: Can't perform a React state update on an unmounted component

        this.setState = function () {
          return;
        };
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
        return /*#__PURE__*/_react["default"].createElement(Container, {
          className: "data-table-container",
          ref: this.root
        }, Object.keys(cellSizeCache).length && /*#__PURE__*/_react["default"].createElement(_reactVirtualized.ScrollSync, null, function (_ref5) {
          var _onScroll = _ref5.onScroll,
              scrollLeft = _ref5.scrollLeft,
              scrollTop = _ref5.scrollTop;
          return /*#__PURE__*/_react["default"].createElement("div", {
            className: "results-table-wrapper"
          }, hasPinnedColumns && /*#__PURE__*/_react["default"].createElement("div", {
            key: "pinned-columns",
            className: "pinned-columns grid-row"
          }, /*#__PURE__*/_react["default"].createElement(TableSection, {
            classList: {
              header: 'pinned-columns--header pinned-grid-container',
              rows: 'pinned-columns--rows pinned-grid-container'
            },
            isPinned: true,
            columns: pinnedColumns,
            headerGridProps: headerGridProps,
            fixedWidth: pinnedColumnsWidth,
            onScroll: function onScroll(args) {
              return _onScroll(_objectSpread(_objectSpread({}, args), {}, {
                scrollLeft: scrollLeft
              }));
            },
            scrollTop: scrollTop,
            dataGridProps: dataGridProps,
            setGridRef: function setGridRef(pinnedGrid) {
              return _this2.pinnedGrid = pinnedGrid;
            },
            columnWidth: columnWidthFunction(pinnedColumns, cellSizeCache),
            headerCellRender: _this2.renderHeaderCell(pinnedColumns, true, _this2.props, _this2.toggleMoreOptions, moreOptionsColumn),
            dataCellRender: _this2.renderDataCell(pinnedColumns, true, _this2.props)
          })), /*#__PURE__*/_react["default"].createElement("div", {
            key: "unpinned-columns",
            style: {
              marginLeft: "".concat(hasPinnedColumns ? "".concat(pinnedColumnsWidth, "px") : '0')
            },
            className: "unpinned-columns grid-column"
          }, /*#__PURE__*/_react["default"].createElement(TableSection, {
            classList: {
              header: 'unpinned-columns--header unpinned-grid-container',
              rows: 'unpinned-columns--rows unpinned-grid-container'
            },
            isPinned: false,
            columns: unpinnedColumnsGhost,
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
            headerCellRender: _this2.renderHeaderCell(unpinnedColumnsGhost, false, _this2.props, _this2.toggleMoreOptions, moreOptionsColumn),
            dataCellRender: _this2.renderDataCell(unpinnedColumnsGhost, false, _this2.props)
          })));
        }));
      }
    }]);
    return DataTable;
  }(_react.Component);

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
  return (0, _styledComponents.withTheme)(DataTable);
}

var _default = DataTableFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9kYXRhLXRhYmxlL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHRIZWFkZXJSb3dIZWlnaHQiLCJkZWZhdWx0Um93SGVpZ2h0Iiwib3ZlcnNjYW5Db2x1bW5Db3VudCIsIm92ZXJzY2FuUm93Q291bnQiLCJmaWVsZFRvQWxpZ25SaWdodCIsIkFMTF9GSUVMRF9UWVBFUyIsImludGVnZXIiLCJyZWFsIiwiQ29udGFpbmVyIiwic3R5bGVkIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsImRhdGFUYWJsZVRleHRDb2xvciIsInBpbm5lZEdyaWRCb3JkZXJDb2xvciIsImV2ZW5Sb3dCYWNrZ3JvdW5kIiwib2RkUm93QmFja2dyb3VuZCIsImNlbGxCb3JkZXJDb2xvciIsImNlbGxQYWRkaW5nU2lkZSIsImNlbGxGb250U2l6ZSIsImVkZ2VDZWxsUGFkZGluZ1NpZGUiLCJoZWFkZXJDZWxsQm9yZGVyQ29sb3IiLCJoZWFkZXJQYWRkaW5nVG9wIiwiaGVhZGVyUGFkZGluZ0JvdHRvbSIsImhlYWRlckNlbGxCYWNrZ3JvdW5kIiwiaGVhZGVyQ2VsbEljb25Db2xvciIsImRlZmF1bHRDb2x1bW5XaWR0aCIsImNvbHVtbldpZHRoRnVuY3Rpb24iLCJjb2x1bW5zIiwiY2VsbFNpemVDYWNoZSIsImdob3N0IiwiaW5kZXgiLCJnZXRSb3dDZWxsIiwicm93cyIsImNvbHVtbiIsImNvbE1ldGEiLCJyb3dJbmRleCIsInNvcnRPcmRlciIsInJvd0lkeCIsImxlbmd0aCIsInR5cGUiLCJpbmRleE9mIiwiVGFibGVTZWN0aW9uIiwiY2xhc3NMaXN0IiwiaXNQaW5uZWQiLCJoZWFkZXJHcmlkUHJvcHMiLCJmaXhlZFdpZHRoIiwiZml4ZWRIZWlnaHQiLCJ1bmRlZmluZWQiLCJvblNjcm9sbCIsInNjcm9sbFRvcCIsImRhdGFHcmlkUHJvcHMiLCJjb2x1bW5XaWR0aCIsInNldEdyaWRSZWYiLCJoZWFkZXJDZWxsUmVuZGVyIiwiZGF0YUNlbGxSZW5kZXIiLCJzY3JvbGxMZWZ0Iiwid2lkdGgiLCJoZWlnaHQiLCJncmlkRGltZW5zaW9uIiwiY29sdW1uQ291bnQiLCJkYXRhR3JpZEhlaWdodCIsImhlYWRlciIsInRvcCIsIkRhdGFUYWJsZUZhY3RvcnkiLCJkZXBzIiwiRmllbGRUb2tlbkZhY3RvcnkiLCJGaWVsZFRva2VuIiwiRGF0YVRhYmxlIiwibW9yZU9wdGlvbnNDb2x1bW4iLCJwaW5uZWRDb2x1bW5zIiwiQXJyYXkiLCJpc0FycmF5IiwiZmlsdGVyIiwiYyIsImluY2x1ZGVzIiwic2V0U3RhdGUiLCJzdGF0ZSIsInByb3BzQ2FjaGUiLCJ1bnBpbm5lZENvbHVtbnMiLCJyb290IiwiY3VycmVudCIsImNsaWVudFdpZHRoIiwiYWRqdXN0V2lkdGgiLCJnZXRDZWxsU2l6ZUNhY2hlIiwiZG9TY2FsZUNlbGxzVG9XaWR0aCIsInRvZ2dsZU1vcmVPcHRpb25zIiwiVG9rZW5Db21wb25lbnQiLCJjZWxsSW5mbyIsImNvbHVtbkluZGV4Iiwia2V5Iiwic3R5bGUiLCJzb3J0Q29sdW1uIiwic29ydFRhYmxlQ29sdW1uIiwicGluVGFibGVDb2x1bW4iLCJjb3B5VGFibGVDb2x1bW4iLCJpc0dob3N0IiwiaXNTb3J0ZWQiLCJmaXJzdENlbGwiLCJlIiwic2hpZnRLZXkiLCJuYW1lIiwiU09SVF9PUkRFUiIsIkFTQ0VORElORyIsIm1vZGUiLCJyb3dDZWxsIiwiZW5kQ2VsbCIsImJvdHRvbUNlbGwiLCJhbGlnblJpZ2h0IiwiY2VsbCIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJzY2FsZUNlbGxzVG9XaWR0aCIsInByZXZQcm9wcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJ1bnBpbm5lZENvbHVtbnNHaG9zdCIsInBpbm5lZENvbHVtbnNXaWR0aCIsInJlZHVjZSIsImFjYyIsInZhbCIsImhhc1Bpbm5lZENvbHVtbnMiLCJCb29sZWFuIiwiaGVhZGVyUm93SGVpZ2h0Iiwicm93SGVpZ2h0IiwiY2xhc3NOYW1lIiwicm93Q291bnQiLCJPYmplY3QiLCJrZXlzIiwiYXJncyIsInBpbm5lZEdyaWQiLCJyZW5kZXJIZWFkZXJDZWxsIiwicmVuZGVyRGF0YUNlbGwiLCJtYXJnaW5MZWZ0IiwidW5waW5uZWRHcmlkIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUVBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxzQkFBc0IsR0FBRyxFQUEvQjtBQUNBLElBQU1DLGdCQUFnQixHQUFHLEVBQXpCO0FBQ0EsSUFBTUMsbUJBQW1CLEdBQUcsRUFBNUI7QUFDQSxJQUFNQyxnQkFBZ0IsR0FBRyxFQUF6QjtBQUNBLElBQU1DLGlCQUFpQixrRkFDcEJDLGlDQUFnQkMsT0FESSxFQUNNLElBRE4sd0RBRXBCRCxpQ0FBZ0JFLElBRkksRUFFRyxJQUZILHNCQUF2Qjs7QUFLTyxJQUFNQyxTQUFTLEdBQUdDLDZCQUFPQyxHQUFWLG8rR0FJWCxVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLGtCQUFoQjtBQUFBLENBSk0sRUEwRFUsVUFBQUYsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZRSxxQkFBaEI7QUFBQSxDQTFEZixFQWtFSSxVQUFBSCxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlHLGlCQUFoQjtBQUFBLENBbEVULEVBcUVJLFVBQUFKLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUksZ0JBQWhCO0FBQUEsQ0FyRVQsRUF1RlcsVUFBQUwsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZSyxlQUFoQjtBQUFBLENBdkZoQixFQXdGVSxVQUFBTixLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlLLGVBQWhCO0FB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QUU5QnRGLGFBRjhCLEVBRzlCQyxLQUg4QixDQWZsQztBQW9CRSxZQUFBLGdCQUFnQixFQUFFLE1BQUksQ0FBQ29HLGdCQUFMLENBQ2hCZixvQkFEZ0IsRUFFaEIsS0FGZ0IsRUFHaEIsTUFBSSxDQUFDeEcsS0FIVyxFQUloQixNQUFJLENBQUMyRSxpQkFKVyxFQUtoQmpCLGlCQUxnQixDQXBCcEI7QUEyQkUsWUFBQSxjQUFjLEVBQUUsTUFBSSxDQUFDOEQsY0FBTCxDQUNkaEIsb0JBRGMsRUFFZCxLQUZjLEVBR2QsTUFBSSxDQUFDeEcsS0FIUztBQTNCbEIsWUFQRixDQTVCRixDQURGO0FBd0VELFNBMUVILENBRkosQ0FERjtBQWtGRDtBQXRUaUM7QUFBQTtBQUFBLElBQ1oySCxnQkFEWTs7QUFBQSxtQ0FDOUJsRSxTQUQ4QixrQkFFWjtBQUNwQm5DLElBQUFBLElBQUksRUFBRSxFQURjO0FBRXBCcUMsSUFBQUEsYUFBYSxFQUFFLEVBRks7QUFHcEJuQyxJQUFBQSxPQUFPLEVBQUUsRUFIVztBQUlwQk4sSUFBQUEsYUFBYSxFQUFFLEVBSks7QUFLcEIrRCxJQUFBQSxVQUFVLEVBQUUsRUFMUTtBQU1wQjlDLElBQUFBLFVBQVUsRUFBRSxJQU5RO0FBT3BCQyxJQUFBQSxXQUFXLEVBQUUsSUFQTztBQVFwQm5DLElBQUFBLEtBQUssRUFBRTtBQVJhLEdBRlk7QUF5VHBDLFNBQU8saUNBQVV3RCxTQUFWLENBQVA7QUFDRDs7ZUFFY0osZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnQsIGNyZWF0ZVJlZn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtTY3JvbGxTeW5jLCBBdXRvU2l6ZXJ9IGZyb20gJ3JlYWN0LXZpcnR1YWxpemVkJztcbmltcG9ydCBzdHlsZWQsIHt3aXRoVGhlbWV9IGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHtjcmVhdGVTZWxlY3Rvcn0gZnJvbSAncmVzZWxlY3QnO1xuaW1wb3J0IGdldCBmcm9tICdsb2Rhc2guZ2V0JztcbmltcG9ydCBkZWJvdW5jZSBmcm9tICdsb2Rhc2guZGVib3VuY2UnO1xuXG5pbXBvcnQgT3B0aW9uRHJvcGRvd24gZnJvbSAnLi9vcHRpb24tZHJvcGRvd24nO1xuXG5pbXBvcnQgR3JpZCBmcm9tICcuL2dyaWQnO1xuaW1wb3J0IEJ1dHRvbiBmcm9tICcuL2J1dHRvbic7XG5pbXBvcnQge0Fycm93VXAsIEFycm93RG93bn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IHtWZXJ0VGhyZWVEb3RzfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQge3BhcnNlRmllbGRWYWx1ZX0gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5pbXBvcnQge2FkanVzdENlbGxzVG9Db250YWluZXJ9IGZyb20gJy4vY2VsbC1zaXplJztcblxuaW1wb3J0IHtBTExfRklFTERfVFlQRVMsIFNPUlRfT1JERVJ9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCBGaWVsZFRva2VuRmFjdG9yeSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9maWVsZC10b2tlbic7XG5cbmNvbnN0IGRlZmF1bHRIZWFkZXJSb3dIZWlnaHQgPSA1NTtcbmNvbnN0IGRlZmF1bHRSb3dIZWlnaHQgPSAzMjtcbmNvbnN0IG92ZXJzY2FuQ29sdW1uQ291bnQgPSAxMDtcbmNvbnN0IG92ZXJzY2FuUm93Q291bnQgPSAxMDtcbmNvbnN0IGZpZWxkVG9BbGlnblJpZ2h0ID0ge1xuICBbQUxMX0ZJRUxEX1RZUEVTLmludGVnZXJdOiB0cnVlLFxuICBbQUxMX0ZJRUxEX1RZUEVTLnJlYWxdOiB0cnVlXG59O1xuXG5leHBvcnQgY29uc3QgQ29udGFpbmVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgZm9udC1zaXplOiAxMXB4O1xuICBmbGV4LWdyb3c6IDE7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRhdGFUYWJsZVRleHRDb2xvcn07XG4gIHdpZHRoOiAxMDAlO1xuXG4gIC5SZWFjdFZpcnR1YWxpemVkX19HcmlkOmZvY3VzLFxuICAuUmVhY3RWaXJ0dWFsaXplZF9fR3JpZDphY3RpdmUge1xuICAgIG91dGxpbmU6IDA7XG4gIH1cblxuICAuY2VsbCB7XG4gICAgJjo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgICAgZGlzcGxheTogbm9uZTtcbiAgICB9XG4gIH1cblxuICAqOmZvY3VzIHtcbiAgICBvdXRsaW5lOiAwO1xuICB9XG5cbiAgLnJlc3VsdHMtdGFibGUtd3JhcHBlciB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIG1pbi1oZWlnaHQ6IDEwMCU7XG4gICAgbWF4LWhlaWdodDogMTAwJTtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgZmxleC1ncm93OiAxO1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgYm9yZGVyLXRvcDogbm9uZTtcblxuICAgIC5zY3JvbGwtaW4tdWktdGhyZWFkOjphZnRlciB7XG4gICAgICBjb250ZW50OiAnJztcbiAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgIGxlZnQ6IDA7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICAgIHRvcDogMDtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cblxuICAgIC5ncmlkLXJvdyB7XG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICB9XG4gICAgLmdyaWQtY29sdW1uIHtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgZmxleDogMSAxIGF1dG87XG4gICAgfVxuICAgIC5waW5uZWQtZ3JpZC1jb250YWluZXIge1xuICAgICAgZmxleDogMCAwIDc1cHg7XG4gICAgICB6LWluZGV4OiAxMDtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIGxlZnQ6IDA7XG4gICAgICB0b3A6IDA7XG4gICAgICBib3JkZXItcmlnaHQ6IDJweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBpbm5lZEdyaWRCb3JkZXJDb2xvcn07XG4gICAgfVxuXG4gICAgLmhlYWRlci1ncmlkIHtcbiAgICAgIG92ZXJmbG93OiBoaWRkZW4gIWltcG9ydGFudDtcbiAgICB9XG5cbiAgICAuZXZlbi1yb3cge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5ldmVuUm93QmFja2dyb3VuZH07XG4gICAgfVxuICAgIC5vZGQtcm93IHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUub2RkUm93QmFja2dyb3VuZH07XG4gICAgfVxuICAgIC5jZWxsLFxuICAgIC5oZWFkZXItY2VsbCB7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgIG92ZXJmbG93OiBoaWRkZW47XG5cbiAgICAgIC5uLXNvcnQtaWR4IHtcbiAgICAgICAgZm9udC1zaXplOiA5cHg7XG4gICAgICB9XG4gICAgfVxuICAgIC5jZWxsIHtcbiAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLmNlbGxCb3JkZXJDb2xvcn07XG4gICAgICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLmNlbGxCb3JkZXJDb2xvcn07XG4gICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgICAgb3ZlcmZsb3c6IGF1dG87XG4gICAgICBwYWRkaW5nOiAwICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuY2VsbFBhZGRpbmdTaWRlfXB4O1xuICAgICAgZm9udC1zaXplOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmNlbGxGb250U2l6ZX1weDtcblxuICAgICAgLnJlc3VsdC1saW5rIHtcbiAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgICAgfVxuICAgIH1cbiAgICAuY2VsbC5lbmQtY2VsbCxcbiAgICAuaGVhZGVyLWNlbGwuZW5kLWNlbGwge1xuICAgICAgYm9yZGVyLXJpZ2h0OiBub25lO1xuICAgICAgcGFkZGluZy1yaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5jZWxsUGFkZGluZ1NpZGUgKyBwcm9wcy50aGVtZS5lZGdlQ2VsbFBhZGRpbmdTaWRlfXB4O1xuICAgIH1cbiAgICAuY2VsbC5maXJzdC1jZWxsLFxuICAgIC5oZWFkZXItY2VsbC5maXJzdC1jZWxsIHtcbiAgICAgIHBhZGRpbmctbGVmdDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5jZWxsUGFkZGluZ1NpZGUgKyBwcm9wcy50aGVtZS5lZGdlQ2VsbFBhZGRpbmdTaWRlfXB4O1xuICAgIH1cbiAgICAuY2VsbC5ib3R0b20tY2VsbCB7XG4gICAgICBib3JkZXItYm90dG9tOiBub25lO1xuICAgIH1cbiAgICAuY2VsbC5hbGlnbi1yaWdodCB7XG4gICAgICBhbGlnbi1pdGVtczogZmxleC1lbmQ7XG4gICAgfVxuICAgIC5oZWFkZXItY2VsbCB7XG4gICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5oZWFkZXJDZWxsQm9yZGVyQ29sb3J9O1xuICAgICAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaGVhZGVyQ2VsbEJvcmRlckNvbG9yfTtcbiAgICAgIHBhZGRpbmctdG9wOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmhlYWRlclBhZGRpbmdUb3B9cHg7XG4gICAgICBwYWRkaW5nLXJpZ2h0OiAwO1xuICAgICAgcGFkZGluZy1ib3R0b206ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaGVhZGVyUGFkZGluZ0JvdHRvbX1weDtcbiAgICAgIHBhZGRpbmctbGVmdDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5jZWxsUGFkZGluZ1NpZGV9cHg7XG4gICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmhlYWRlckNlbGxCYWNrZ3JvdW5kfTtcblxuICAgICAgJjpob3ZlciB7XG4gICAgICAgIC5tb3JlIHtcbiAgICAgICAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5oZWFkZXJDZWxsSWNvbkNvbG9yfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLm4tc29ydC1pZHgge1xuICAgICAgICBmb250LXNpemU6IDlweDtcbiAgICAgIH1cbiAgICAgIC5kZXRhaWxzIHtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgIGZsZXgtZ3JvdzogMTtcblxuICAgICAgICAuY29sLW5hbWUge1xuICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuXG4gICAgICAgICAgLmNvbC1uYW1lX19sZWZ0IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiA2cHg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC5jb2wtbmFtZV9fbmFtZSB7XG4gICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLm1vcmUge1xuICAgICAgICBjb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgICAgIG1hcmdpbi1sZWZ0OiA1cHg7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgOmZvY3VzIHtcbiAgICBvdXRsaW5lOiBub25lO1xuICB9XG5gO1xuXG5jb25zdCBkZWZhdWx0Q29sdW1uV2lkdGggPSAyMDA7XG5cbmNvbnN0IGNvbHVtbldpZHRoRnVuY3Rpb24gPSAoY29sdW1ucywgY2VsbFNpemVDYWNoZSwgZ2hvc3QpID0+ICh7aW5kZXh9KSA9PiB7XG4gIHJldHVybiAoY29sdW1uc1tpbmRleF0gfHwge30pLmdob3N0ID8gZ2hvc3QgOiBjZWxsU2l6ZUNhY2hlW2NvbHVtbnNbaW5kZXhdXSB8fCBkZWZhdWx0Q29sdW1uV2lkdGg7XG59O1xuXG4vKlxuICogVGhpcyBpcyBhbiBhY2Nlc3NvciBtZXRob2QgdXNlZCB0byBnZW5lcmFsaXplIGdldHRpbmcgYSBjZWxsIGZyb20gYSBkYXRhIHJvd1xuICovXG5jb25zdCBnZXRSb3dDZWxsID0gKHtyb3dzLCBjb2x1bW5zLCBjb2x1bW4sIGNvbE1ldGEsIHJvd0luZGV4LCBzb3J0T3JkZXJ9KSA9PiB7XG4gIGNvbnN0IHJvd0lkeCA9IHNvcnRPcmRlciAmJiBzb3J0T3JkZXIubGVuZ3RoID8gZ2V0KHNvcnRPcmRlciwgcm93SW5kZXgpIDogcm93SW5kZXg7XG4gIGNvbnN0IHt0eXBlfSA9IGNvbE1ldGFbY29sdW1uXTtcblxuICByZXR1cm4gcGFyc2VGaWVsZFZhbHVlKGdldChyb3dzLCBbcm93SWR4LCBjb2x1bW5zLmluZGV4T2YoY29sdW1uKV0sICdFcnInKSwgdHlwZSk7XG59O1xuXG5leHBvcnQgY29uc3QgVGFibGVTZWN0aW9uID0gKHtcbiAgY2xhc3NMaXN0LFxuICBpc1Bpbm5lZCxcbiAgY29sdW1ucyxcbiAgaGVhZGVyR3JpZFByb3BzLFxuICBmaXhlZFdpZHRoLFxuICBmaXhlZEhlaWdodCA9IHVuZGVmaW5lZCxcbiAgb25TY3JvbGwsXG4gIHNjcm9sbFRvcCxcbiAgZGF0YUdyaWRQcm9wcyxcbiAgY29sdW1uV2lkdGgsXG4gIHNldEdyaWRSZWYsXG4gIGhlYWRlckNlbGxSZW5kZXIsXG4gIGRhdGFDZWxsUmVuZGVyLFxuICBzY3JvbGxMZWZ0ID0gdW5kZWZpbmVkXG59KSA9PiAoXG4gIDxBdXRvU2l6ZXI+XG4gICAgeyh7d2lkdGgsIGhlaWdodH0pID0+IHtcbiAgICAgIGNvbnN0IGdyaWREaW1lbnNpb24gPSB7XG4gICAgICAgIGNvbHVtbkNvdW50OiBjb2x1bW5zLmxlbmd0aCxcbiAgICAgICAgY29sdW1uV2lkdGgsXG4gICAgICAgIHdpZHRoOiBmaXhlZFdpZHRoIHx8IHdpZHRoXG4gICAgICB9O1xuICAgICAgY29uc3QgZGF0YUdyaWRIZWlnaHQgPSBmaXhlZEhlaWdodCB8fCBoZWlnaHQ7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdzY3JvbGwtaW4tdWktdGhyZWFkJywgY2xhc3NMaXN0LmhlYWRlcil9PlxuICAgICAgICAgICAgPEdyaWRcbiAgICAgICAgICAgICAgY2VsbFJlbmRlcmVyPXtoZWFkZXJDZWxsUmVuZGVyfVxuICAgICAgICAgICAgICB7Li4uaGVhZGVyR3JpZFByb3BzfVxuICAgICAgICAgICAgICB7Li4uZ3JpZERpbWVuc2lvbn1cbiAgICAgICAgICAgICAgc2Nyb2xsTGVmdD17c2Nyb2xsTGVmdH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdzY3JvbGwtaW4tdWktdGhyZWFkJywgY2xhc3NMaXN0LnJvd3MpfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgdG9wOiBoZWFkZXJHcmlkUHJvcHMuaGVpZ2h0XG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxHcmlkXG4gICAgICAgICAgICAgIGNlbGxSZW5kZXJlcj17ZGF0YUNlbGxSZW5kZXJ9XG4gICAgICAgICAgICAgIHsuLi5kYXRhR3JpZFByb3BzfVxuICAgICAgICAgICAgICB7Li4uZ3JpZERpbWVuc2lvbn1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtpc1Bpbm5lZCA/ICdwaW5uZWQtZ3JpZCcgOiAnYm9keS1ncmlkJ31cbiAgICAgICAgICAgICAgaGVpZ2h0PXtkYXRhR3JpZEhlaWdodCAtIGhlYWRlckdyaWRQcm9wcy5oZWlnaHR9XG4gICAgICAgICAgICAgIG9uU2Nyb2xsPXtvblNjcm9sbH1cbiAgICAgICAgICAgICAgc2Nyb2xsVG9wPXtzY3JvbGxUb3B9XG4gICAgICAgICAgICAgIHNldEdyaWRSZWY9e3NldEdyaWRSZWZ9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8Lz5cbiAgICAgICk7XG4gICAgfX1cbiAgPC9BdXRvU2l6ZXI+XG4pO1xuXG5EYXRhVGFibGVGYWN0b3J5LmRlcHMgPSBbRmllbGRUb2tlbkZhY3RvcnldO1xuZnVuY3Rpb24gRGF0YVRhYmxlRmFjdG9yeShGaWVsZFRva2VuKSB7XG4gIGNsYXNzIERhdGFUYWJsZSBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgIHJvd3M6IFtdLFxuICAgICAgcGlubmVkQ29sdW1uczogW10sXG4gICAgICBjb2xNZXRhOiB7fSxcbiAgICAgIGNlbGxTaXplQ2FjaGU6IHt9LFxuICAgICAgc29ydENvbHVtbjoge30sXG4gICAgICBmaXhlZFdpZHRoOiBudWxsLFxuICAgICAgZml4ZWRIZWlnaHQ6IG51bGwsXG4gICAgICB0aGVtZToge31cbiAgICB9O1xuXG4gICAgc3RhdGUgPSB7XG4gICAgICBjZWxsU2l6ZUNhY2hlOiB7fSxcbiAgICAgIG1vcmVPcHRpb25zQ29sdW1uOiBudWxsXG4gICAgfTtcblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuc2NhbGVDZWxsc1RvV2lkdGgpO1xuICAgICAgdGhpcy5zY2FsZUNlbGxzVG9XaWR0aCgpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5wcm9wcy5jZWxsU2l6ZUNhY2hlICE9PSBwcmV2UHJvcHMuY2VsbFNpemVDYWNoZSB8fFxuICAgICAgICB0aGlzLnByb3BzLnBpbm5lZENvbHVtbnMgIT09IHByZXZQcm9wcy5waW5uZWRDb2x1bW5zXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5zY2FsZUNlbGxzVG9XaWR0aCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuc2NhbGVDZWxsc1RvV2lkdGgpO1xuICAgICAgLy8gZml4IFdhcm5pbmc6IENhbid0IHBlcmZvcm0gYSBSZWFjdCBzdGF0ZSB1cGRhdGUgb24gYW4gdW5tb3VudGVkIGNvbXBvbmVudFxuICAgICAgdGhpcy5zZXRTdGF0ZSA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICByb290ID0gY3JlYXRlUmVmKCk7XG4gICAgY29sdW1ucyA9IHByb3BzID0+IHByb3BzLmNvbHVtbnM7XG4gICAgcGlubmVkQ29sdW1ucyA9IHByb3BzID0+IHByb3BzLnBpbm5lZENvbHVtbnM7XG4gICAgdW5waW5uZWRDb2x1bW5zID0gY3JlYXRlU2VsZWN0b3IodGhpcy5jb2x1bW5zLCB0aGlzLnBpbm5lZENvbHVtbnMsIChjb2x1bW5zLCBwaW5uZWRDb2x1bW5zKSA9PlxuICAgICAgIUFycmF5LmlzQXJyYXkocGlubmVkQ29sdW1ucykgPyBjb2x1bW5zIDogY29sdW1ucy5maWx0ZXIoYyA9PiAhcGlubmVkQ29sdW1ucy5pbmNsdWRlcyhjKSlcbiAgICApO1xuXG4gICAgdG9nZ2xlTW9yZU9wdGlvbnMgPSBtb3JlT3B0aW9uc0NvbHVtbiA9PlxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG1vcmVPcHRpb25zQ29sdW1uOlxuICAgICAgICAgIHRoaXMuc3RhdGUubW9yZU9wdGlvbnNDb2x1bW4gPT09IG1vcmVPcHRpb25zQ29sdW1uID8gbnVsbCA6IG1vcmVPcHRpb25zQ29sdW1uXG4gICAgICB9KTtcblxuICAgIGdldENlbGxTaXplQ2FjaGUgPSAoKSA9PiB7XG4gICAgICBjb25zdCB7Y2VsbFNpemVDYWNoZTogcHJvcHNDYWNoZSwgZml4ZWRXaWR0aCwgcGlubmVkQ29sdW1uc30gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3QgdW5waW5uZWRDb2x1bW5zID0gdGhpcy51bnBpbm5lZENvbHVtbnModGhpcy5wcm9wcyk7XG5cbiAgICAgIGNvbnN0IHdpZHRoID0gZml4ZWRXaWR0aCA/IGZpeGVkV2lkdGggOiB0aGlzLnJvb3QuY3VycmVudCA/IHRoaXMucm9vdC5jdXJyZW50LmNsaWVudFdpZHRoIDogMDtcblxuICAgICAgLy8gcGluIGNvbHVtbiBib3JkZXIgaXMgMiBwaXhlbCB2cyAxIHBpeGVsXG4gICAgICBjb25zdCBhZGp1c3RXaWR0aCA9IHBpbm5lZENvbHVtbnMubGVuZ3RoID8gd2lkdGggLSAxIDogd2lkdGg7XG4gICAgICBjb25zdCB7Y2VsbFNpemVDYWNoZSwgZ2hvc3R9ID0gYWRqdXN0Q2VsbHNUb0NvbnRhaW5lcihcbiAgICAgICAgYWRqdXN0V2lkdGgsXG4gICAgICAgIHByb3BzQ2FjaGUsXG4gICAgICAgIHBpbm5lZENvbHVtbnMsXG4gICAgICAgIHVucGlubmVkQ29sdW1uc1xuICAgICAgKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY2VsbFNpemVDYWNoZSxcbiAgICAgICAgZ2hvc3RcbiAgICAgIH07XG4gICAgfTtcblxuICAgIGRvU2NhbGVDZWxsc1RvV2lkdGggPSAoKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0Q2VsbFNpemVDYWNoZSgpKTtcbiAgICB9O1xuXG4gICAgc2NhbGVDZWxsc1RvV2lkdGggPSBkZWJvdW5jZSh0aGlzLmRvU2NhbGVDZWxsc1RvV2lkdGgsIDMwMCk7XG5cbiAgICByZW5kZXJIZWFkZXJDZWxsID0gKFxuICAgICAgY29sdW1ucyxcbiAgICAgIGlzUGlubmVkLFxuICAgICAgcHJvcHMsXG4gICAgICB0b2dnbGVNb3JlT3B0aW9ucyxcbiAgICAgIG1vcmVPcHRpb25zQ29sdW1uLFxuICAgICAgVG9rZW5Db21wb25lbnRcbiAgICApID0+IHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC9kaXNwbGF5LW5hbWVcbiAgICAgIHJldHVybiBjZWxsSW5mbyA9PiB7XG4gICAgICAgIGNvbnN0IHtjb2x1bW5JbmRleCwga2V5LCBzdHlsZX0gPSBjZWxsSW5mbztcbiAgICAgICAgY29uc3Qge2NvbE1ldGEsIHNvcnRDb2x1bW4sIHNvcnRUYWJsZUNvbHVtbiwgcGluVGFibGVDb2x1bW4sIGNvcHlUYWJsZUNvbHVtbn0gPSBwcm9wcztcblxuICAgICAgICBjb25zdCBjb2x1bW4gPSBjb2x1bW5zW2NvbHVtbkluZGV4XTtcbiAgICAgICAgY29uc3QgaXNHaG9zdCA9IGNvbHVtbi5naG9zdDtcbiAgICAgICAgY29uc3QgaXNTb3J0ZWQgPSBzb3J0Q29sdW1uW2NvbHVtbl07XG4gICAgICAgIGNvbnN0IGZpcnN0Q2VsbCA9IGNvbHVtbkluZGV4ID09PSAwO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdoZWFkZXItY2VsbCcsIHtcbiAgICAgICAgICAgICAgW2Bjb2x1bW4tJHtjb2x1bW5JbmRleH1gXTogdHJ1ZSxcbiAgICAgICAgICAgICAgJ3Bpbm5lZC1oZWFkZXItY2VsbCc6IGlzUGlubmVkLFxuICAgICAgICAgICAgICAnZmlyc3QtY2VsbCc6IGZpcnN0Q2VsbFxuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICBrZXk9e2tleX1cbiAgICAgICAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgICAgICAgIG9uQ2xpY2s9e2UgPT4ge1xuICAgICAgICAgICAgICBlLnNoaWZ0S2V5ID8gc29ydFRhYmxlQ29sdW1uKGNvbHVtbikgOiBudWxsO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIG9uRG91YmxlQ2xpY2s9eygpID0+IHNvcnRUYWJsZUNvbHVtbihjb2x1bW4pfVxuICAgICAgICAgICAgdGl0bGU9e2NvbHVtbn1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7aXNHaG9zdCA/IChcbiAgICAgICAgICAgICAgPGRpdiAvPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJkZXRhaWxzXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1uYW1lXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW5hbWVfX2xlZnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1uYW1lX19uYW1lXCI+e2NvbE1ldGFbY29sdW1uXS5uYW1lfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gY2xhc3NOYW1lPVwiY29sLW5hbWVfX3NvcnRcIiBvbkNsaWNrPXsoKSA9PiBzb3J0VGFibGVDb2x1bW4oY29sdW1uKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7aXNTb3J0ZWQgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlzU29ydGVkID09PSBTT1JUX09SREVSLkFTQ0VORElORyA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QXJyb3dVcCBoZWlnaHQ9XCIxNHB4XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QXJyb3dEb3duIGhlaWdodD1cIjE0cHhcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxCdXR0b24gY2xhc3NOYW1lPVwibW9yZVwiIG9uQ2xpY2s9eygpID0+IHRvZ2dsZU1vcmVPcHRpb25zKGNvbHVtbil9PlxuICAgICAgICAgICAgICAgICAgICAgIDxWZXJ0VGhyZWVEb3RzIGhlaWdodD1cIjE0cHhcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICA8RmllbGRUb2tlbiB0eXBlPXtjb2xNZXRhW2NvbHVtbl0udHlwZX0gLz5cbiAgICAgICAgICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJvcHRpb25zXCI+XG4gICAgICAgICAgICAgICAgICA8T3B0aW9uRHJvcGRvd25cbiAgICAgICAgICAgICAgICAgICAgaXNPcGVuZWQ9e21vcmVPcHRpb25zQ29sdW1uID09PSBjb2x1bW59XG4gICAgICAgICAgICAgICAgICAgIHR5cGU9e2NvbE1ldGFbY29sdW1uXS50eXBlfVxuICAgICAgICAgICAgICAgICAgICBjb2x1bW49e2NvbHVtbn1cbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlTW9yZU9wdGlvbnM9e3RvZ2dsZU1vcmVPcHRpb25zfVxuICAgICAgICAgICAgICAgICAgICBzb3J0VGFibGVDb2x1bW49e21vZGUgPT4gc29ydFRhYmxlQ29sdW1uKGNvbHVtbiwgbW9kZSl9XG4gICAgICAgICAgICAgICAgICAgIHNvcnRNb2RlPXtzb3J0Q29sdW1uICYmIHNvcnRDb2x1bW5bY29sdW1uXX1cbiAgICAgICAgICAgICAgICAgICAgcGluVGFibGVDb2x1bW49eygpID0+IHBpblRhYmxlQ29sdW1uKGNvbHVtbil9XG4gICAgICAgICAgICAgICAgICAgIGNvcHlUYWJsZUNvbHVtbj17KCkgPT4gY29weVRhYmxlQ29sdW1uKGNvbHVtbil9XG4gICAgICAgICAgICAgICAgICAgIGlzU29ydGVkPXtpc1NvcnRlZH1cbiAgICAgICAgICAgICAgICAgICAgaXNQaW5uZWQ9e2lzUGlubmVkfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICAgIH07XG4gICAgfTtcblxuICAgIHJlbmRlckRhdGFDZWxsID0gKGNvbHVtbnMsIGlzUGlubmVkLCBwcm9wcykgPT4ge1xuICAgICAgcmV0dXJuIGNlbGxJbmZvID0+IHtcbiAgICAgICAgY29uc3Qge2NvbHVtbkluZGV4LCBrZXksIHN0eWxlLCByb3dJbmRleH0gPSBjZWxsSW5mbztcbiAgICAgICAgY29uc3Qge3Jvd3MsIGNvbE1ldGF9ID0gcHJvcHM7XG4gICAgICAgIGNvbnN0IGNvbHVtbiA9IGNvbHVtbnNbY29sdW1uSW5kZXhdO1xuICAgICAgICBjb25zdCBpc0dob3N0ID0gY29sdW1uLmdob3N0O1xuXG4gICAgICAgIGNvbnN0IHJvd0NlbGwgPSBpc0dob3N0ID8gJycgOiBnZXRSb3dDZWxsKHsuLi5wcm9wcywgY29sdW1uLCByb3dJbmRleH0pO1xuICAgICAgICBjb25zdCB0eXBlID0gaXNHaG9zdCA/IG51bGwgOiBjb2xNZXRhW2NvbHVtbl0udHlwZTtcblxuICAgICAgICBjb25zdCBlbmRDZWxsID0gY29sdW1uSW5kZXggPT09IGNvbHVtbnMubGVuZ3RoIC0gMTtcbiAgICAgICAgY29uc3QgZmlyc3RDZWxsID0gY29sdW1uSW5kZXggPT09IDA7XG4gICAgICAgIGNvbnN0IGJvdHRvbUNlbGwgPSByb3dJbmRleCA9PT0gcm93cy5sZW5ndGggLSAxO1xuICAgICAgICBjb25zdCBhbGlnblJpZ2h0ID0gZmllbGRUb0FsaWduUmlnaHRbdHlwZV07XG5cbiAgICAgICAgY29uc3QgY2VsbCA9IChcbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ2NlbGwnLCB7XG4gICAgICAgICAgICAgIFtyb3dJbmRleCAlIDIgPT09IDAgPyAnZXZlbi1yb3cnIDogJ29kZC1yb3cnXTogdHJ1ZSxcbiAgICAgICAgICAgICAgW2Byb3ctJHtyb3dJbmRleH1gXTogdHJ1ZSxcbiAgICAgICAgICAgICAgJ3Bpbm5lZC1jZWxsJzogaXNQaW5uZWQsXG4gICAgICAgICAgICAgICdmaXJzdC1jZWxsJzogZmlyc3RDZWxsLFxuICAgICAgICAgICAgICAnZW5kLWNlbGwnOiBlbmRDZWxsLFxuICAgICAgICAgICAgICAnYm90dG9tLWNlbGwnOiBib3R0b21DZWxsLFxuICAgICAgICAgICAgICAnYWxpZ24tcmlnaHQnOiBhbGlnblJpZ2h0XG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIGtleT17a2V5fVxuICAgICAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICAgICAgdGl0bGU9e2lzR2hvc3QgPyB1bmRlZmluZWQgOiByb3dDZWxsfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtgJHtyb3dDZWxsfSR7ZW5kQ2VsbCA/ICdcXG4nIDogJ1xcdCd9YH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gY2VsbDtcbiAgICAgIH07XG4gICAgfTtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHtyb3dzLCBwaW5uZWRDb2x1bW5zLCB0aGVtZSA9IHt9LCBmaXhlZFdpZHRoLCBmaXhlZEhlaWdodH0gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3QgdW5waW5uZWRDb2x1bW5zID0gdGhpcy51bnBpbm5lZENvbHVtbnModGhpcy5wcm9wcyk7XG5cbiAgICAgIGNvbnN0IHtjZWxsU2l6ZUNhY2hlLCBtb3JlT3B0aW9uc0NvbHVtbiwgZ2hvc3R9ID0gdGhpcy5zdGF0ZTtcbiAgICAgIGNvbnN0IHVucGlubmVkQ29sdW1uc0dob3N0ID0gZ2hvc3QgPyBbLi4udW5waW5uZWRDb2x1bW5zLCB7Z2hvc3Q6IHRydWV9XSA6IHVucGlubmVkQ29sdW1ucztcbiAgICAgIGNvbnN0IHBpbm5lZENvbHVtbnNXaWR0aCA9IHBpbm5lZENvbHVtbnMucmVkdWNlKFxuICAgICAgICAoYWNjLCB2YWwpID0+IGFjYyArIGdldChjZWxsU2l6ZUNhY2hlLCB2YWwsIDApLFxuICAgICAgICAwXG4gICAgICApO1xuXG4gICAgICBjb25zdCBoYXNQaW5uZWRDb2x1bW5zID0gQm9vbGVhbihwaW5uZWRDb2x1bW5zLmxlbmd0aCk7XG4gICAgICBjb25zdCB7aGVhZGVyUm93SGVpZ2h0ID0gZGVmYXVsdEhlYWRlclJvd0hlaWdodCwgcm93SGVpZ2h0ID0gZGVmYXVsdFJvd0hlaWdodH0gPSB0aGVtZTtcblxuICAgICAgY29uc3QgaGVhZGVyR3JpZFByb3BzID0ge1xuICAgICAgICBjZWxsU2l6ZUNhY2hlLFxuICAgICAgICBjbGFzc05hbWU6ICdoZWFkZXItZ3JpZCcsXG4gICAgICAgIGhlaWdodDogaGVhZGVyUm93SGVpZ2h0LFxuICAgICAgICByb3dDb3VudDogMSxcbiAgICAgICAgcm93SGVpZ2h0OiBoZWFkZXJSb3dIZWlnaHRcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGRhdGFHcmlkUHJvcHMgPSB7XG4gICAgICAgIGNlbGxTaXplQ2FjaGUsXG4gICAgICAgIG92ZXJzY2FuQ29sdW1uQ291bnQsXG4gICAgICAgIG92ZXJzY2FuUm93Q291bnQsXG4gICAgICAgIHJvd0NvdW50OiAocm93cyB8fCBbXSkubGVuZ3RoLFxuICAgICAgICByb3dIZWlnaHRcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxDb250YWluZXIgY2xhc3NOYW1lPVwiZGF0YS10YWJsZS1jb250YWluZXJcIiByZWY9e3RoaXMucm9vdH0+XG4gICAgICAgICAge09iamVjdC5rZXlzKGNlbGxTaXplQ2FjaGUpLmxlbmd0aCAmJiAoXG4gICAgICAgICAgICA8U2Nyb2xsU3luYz5cbiAgICAgICAgICAgICAgeyh7b25TY3JvbGwsIHNjcm9sbExlZnQsIHNjcm9sbFRvcH0pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZXN1bHRzLXRhYmxlLXdyYXBwZXJcIj5cbiAgICAgICAgICAgICAgICAgICAge2hhc1Bpbm5lZENvbHVtbnMgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PVwicGlubmVkLWNvbHVtbnNcIiBjbGFzc05hbWU9XCJwaW5uZWQtY29sdW1ucyBncmlkLXJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFRhYmxlU2VjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc0xpc3Q9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXI6ICdwaW5uZWQtY29sdW1ucy0taGVhZGVyIHBpbm5lZC1ncmlkLWNvbnRhaW5lcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93czogJ3Bpbm5lZC1jb2x1bW5zLS1yb3dzIHBpbm5lZC1ncmlkLWNvbnRhaW5lcidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaXNQaW5uZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1ucz17cGlubmVkQ29sdW1uc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyR3JpZFByb3BzPXtoZWFkZXJHcmlkUHJvcHN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZpeGVkV2lkdGg9e3Bpbm5lZENvbHVtbnNXaWR0aH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25TY3JvbGw9e2FyZ3MgPT4gb25TY3JvbGwoey4uLmFyZ3MsIHNjcm9sbExlZnR9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wPXtzY3JvbGxUb3B9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFHcmlkUHJvcHM9e2RhdGFHcmlkUHJvcHN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNldEdyaWRSZWY9e3Bpbm5lZEdyaWQgPT4gKHRoaXMucGlubmVkR3JpZCA9IHBpbm5lZEdyaWQpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5XaWR0aD17Y29sdW1uV2lkdGhGdW5jdGlvbihwaW5uZWRDb2x1bW5zLCBjZWxsU2l6ZUNhY2hlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyQ2VsbFJlbmRlcj17dGhpcy5yZW5kZXJIZWFkZXJDZWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpbm5lZENvbHVtbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlTW9yZU9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9yZU9wdGlvbnNDb2x1bW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUNlbGxSZW5kZXI9e3RoaXMucmVuZGVyRGF0YUNlbGwocGlubmVkQ29sdW1ucywgdHJ1ZSwgdGhpcy5wcm9wcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAga2V5PVwidW5waW5uZWQtY29sdW1uc1wiXG4gICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQ6IGAke2hhc1Bpbm5lZENvbHVtbnMgPyBgJHtwaW5uZWRDb2x1bW5zV2lkdGh9cHhgIDogJzAnfWBcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInVucGlubmVkLWNvbHVtbnMgZ3JpZC1jb2x1bW5cIlxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPFRhYmxlU2VjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NMaXN0PXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcjogJ3VucGlubmVkLWNvbHVtbnMtLWhlYWRlciB1bnBpbm5lZC1ncmlkLWNvbnRhaW5lcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJvd3M6ICd1bnBpbm5lZC1jb2x1bW5zLS1yb3dzIHVucGlubmVkLWdyaWQtY29udGFpbmVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUGlubmVkPXtmYWxzZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbnM9e3VucGlubmVkQ29sdW1uc0dob3N0fVxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyR3JpZFByb3BzPXtoZWFkZXJHcmlkUHJvcHN9XG4gICAgICAgICAgICAgICAgICAgICAgICBmaXhlZFdpZHRoPXtmaXhlZFdpZHRofVxuICAgICAgICAgICAgICAgICAgICAgICAgZml4ZWRIZWlnaHQ9e2ZpeGVkSGVpZ2h0fVxuICAgICAgICAgICAgICAgICAgICAgICAgb25TY3JvbGw9e29uU2Nyb2xsfVxuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wPXtzY3JvbGxUb3B9XG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxMZWZ0PXtzY3JvbGxMZWZ0fVxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUdyaWRQcm9wcz17ZGF0YUdyaWRQcm9wc31cbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEdyaWRSZWY9e3VucGlubmVkR3JpZCA9PiAodGhpcy51bnBpbm5lZEdyaWQgPSB1bnBpbm5lZEdyaWQpfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uV2lkdGg9e2NvbHVtbldpZHRoRnVuY3Rpb24oXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHVucGlubmVkQ29sdW1uc0dob3N0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsU2l6ZUNhY2hlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBnaG9zdFxuICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlckNlbGxSZW5kZXI9e3RoaXMucmVuZGVySGVhZGVyQ2VsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdW5waW5uZWRDb2x1bW5zR2hvc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZU1vcmVPcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBtb3JlT3B0aW9uc0NvbHVtblxuICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDZWxsUmVuZGVyPXt0aGlzLnJlbmRlckRhdGFDZWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICB1bnBpbm5lZENvbHVtbnNHaG9zdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHNcbiAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPC9TY3JvbGxTeW5jPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvQ29udGFpbmVyPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gd2l0aFRoZW1lKERhdGFUYWJsZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IERhdGFUYWJsZUZhY3Rvcnk7XG4iXX0=