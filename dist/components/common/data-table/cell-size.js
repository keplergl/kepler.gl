"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderedSize = renderedSize;
exports.adjustCellsToContainer = adjustCellsToContainer;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _document = _interopRequireDefault(require("global/document"));

var _dataUtils = require("../../../utils/data-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var MIN_GHOST_CELL_SIZE = 200;
/**
 * Measure rows and column content to determin min width for each column
 * @param {*} param0
 */

function renderedSize(_ref) {
  var _ref$text = _ref.text,
      rows = _ref$text.rows,
      column = _ref$text.column,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'string' : _ref$type,
      colIdx = _ref.colIdx,
      _ref$numRowsToCalcula = _ref.numRowsToCalculate,
      numRowsToCalculate = _ref$numRowsToCalcula === void 0 ? 10 : _ref$numRowsToCalcula,
      _ref$fontSize = _ref.fontSize,
      fontSize = _ref$fontSize === void 0 ? 12 : _ref$fontSize,
      _ref$font = _ref.font,
      font = _ref$font === void 0 ? 'Lato' : _ref$font,
      _ref$cellPadding = _ref.cellPadding,
      cellPadding = _ref$cellPadding === void 0 ? 40 : _ref$cellPadding,
      _ref$maxCellSize = _ref.maxCellSize,
      maxCellSize = _ref$maxCellSize === void 0 ? 400 : _ref$maxCellSize,
      _ref$maxHeaderSize = _ref.maxHeaderSize,
      maxHeaderSize = _ref$maxHeaderSize === void 0 ? 150 : _ref$maxHeaderSize,
      _ref$minCellSize = _ref.minCellSize,
      minCellSize = _ref$minCellSize === void 0 ? 45 : _ref$minCellSize,
      _ref$optionsButton = _ref.optionsButton,
      optionsButton = _ref$optionsButton === void 0 ? 30 : _ref$optionsButton;

  if (!_document["default"]) {
    return {
      row: 0,
      header: 0
    };
  }

  var textCanvas = _document["default"].createElement('canvas');

  _document["default"].body.appendChild(textCanvas);

  var context = textCanvas.getContext('2d');
  context.font = [fontSize, font].join('px ');
  var rowsToSample = (0, _toConsumableArray2["default"])(Array(numRowsToCalculate)).map(function () {
    return Math.floor(Math.random() * (rows.length - 1));
  }); // IF we have less than 10 rows, lets measure all of them

  if (rows.length <= numRowsToCalculate) {
    rowsToSample = Array.from(Array(rows.length).keys());
  }

  var rowWidth = Math.max.apply(Math, (0, _toConsumableArray2["default"])(rowsToSample.map(function (rowIdx) {
    return Math.ceil(context.measureText((0, _dataUtils.parseFieldValue)(rows[rowIdx][colIdx], type)).width) + cellPadding;
  }))); // header cell only has left padding

  var headerWidth = Math.ceil(context.measureText(column).width) + cellPadding / 2 + optionsButton;
  var minRowWidth = minCellSize + cellPadding;
  var minHeaderWidth = minCellSize + cellPadding / 2 + optionsButton;
  var clampedRowWidth = clamp(minRowWidth, maxCellSize, rowWidth);
  var clampedHeaderWidth = clamp(minHeaderWidth, maxHeaderSize, headerWidth); // cleanup

  textCanvas.parentElement.removeChild(textCanvas);
  return {
    row: clampedRowWidth,
    header: clampedHeaderWidth
  };
}

function clamp(min, max, value) {
  return Math.max(Math.min(max, value), min);
}

function getColumnOrder() {
  var pinnedColumns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var unpinnedColumns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return [].concat((0, _toConsumableArray2["default"])(pinnedColumns), (0, _toConsumableArray2["default"])(unpinnedColumns));
}

function getMinCellSize(cellSizeCache) {
  return Object.keys(cellSizeCache).reduce(function (accu, col) {
    return _objectSpread(_objectSpread({}, accu), {}, (0, _defineProperty2["default"])({}, col, cellSizeCache[col].row));
  }, {});
}

function getSizeSum(sizeCache, key) {
  return Object.keys(sizeCache).reduce(function (acc, val) {
    return acc + (key ? sizeCache[val][key] : sizeCache[val]);
  }, 0);
}
/**
 * Expand cell to fit both row and header, if there is still room left,
 * expand last cell to fit the entire width of the container
 * @param {object} cellSizeCache
 * @param {string[]} columnOrder
 * @param {number} containerWidth
 * @param {number} roomToFill
 */


function expandCellSize(cellSizeCache, columnOrder, containerWidth, roomToFill) {
  var remaining = roomToFill;
  var expandedCellSize = columnOrder.reduce(function (accu, col) {
    var size = cellSizeCache[col].row;

    if (cellSizeCache[col].row < cellSizeCache[col].header && remaining > 0) {
      // if we are cutting off the header, expand to fit it
      size = cellSizeCache[col].header - cellSizeCache[col].row < remaining ? cellSizeCache[col].header : cellSizeCache[col].row + remaining;
      remaining -= size - cellSizeCache[col].row;
    }

    return _objectSpread(_objectSpread({}, accu), {}, (0, _defineProperty2["default"])({}, col, size));
  }, {});
  var ghost = null;

  if (remaining > 0 && remaining < MIN_GHOST_CELL_SIZE) {
    // expand last cell
    var lastCell = columnOrder[columnOrder.length - 1];
    expandedCellSize[lastCell] += remaining;
  } else if (remaining >= MIN_GHOST_CELL_SIZE) {
    // if too much left add a ghost cell
    ghost = remaining;
  }

  return {
    cellSizeCache: expandedCellSize,
    ghost: ghost
  };
}
/**
 * Adjust cell size based on container width
 * @param {number} containerWidth
 * @param {Object} cellSizeCache
 * @param {string[]} pinnedColumns
 * @param {string[]} unpinnedColumns
 */


function adjustCellsToContainer(containerWidth, cellSizeCache, pinnedColumns, unpinnedColumns) {
  var minRowSum = getSizeSum(cellSizeCache, 'row');

  if (minRowSum >= containerWidth) {
    // we apply the min Width to all cells
    return {
      cellSizeCache: getMinCellSize(cellSizeCache)
    };
  } // if we have some room to expand


  var columnOrder = getColumnOrder(pinnedColumns, unpinnedColumns);
  return expandCellSize(cellSizeCache, columnOrder, containerWidth, containerWidth - minRowSum);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9kYXRhLXRhYmxlL2NlbGwtc2l6ZS5qcyJdLCJuYW1lcyI6WyJNSU5fR0hPU1RfQ0VMTF9TSVpFIiwicmVuZGVyZWRTaXplIiwidGV4dCIsInJvd3MiLCJjb2x1bW4iLCJ0eXBlIiwiY29sSWR4IiwibnVtUm93c1RvQ2FsY3VsYXRlIiwiZm9udFNpemUiLCJmb250IiwiY2VsbFBhZGRpbmciLCJtYXhDZWxsU2l6ZSIsIm1heEhlYWRlclNpemUiLCJtaW5DZWxsU2l6ZSIsIm9wdGlvbnNCdXR0b24iLCJkb2N1bWVudCIsInJvdyIsImhlYWRlciIsInRleHRDYW52YXMiLCJjcmVhdGVFbGVtZW50IiwiYm9keSIsImFwcGVuZENoaWxkIiwiY29udGV4dCIsImdldENvbnRleHQiLCJqb2luIiwicm93c1RvU2FtcGxlIiwiQXJyYXkiLCJtYXAiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJsZW5ndGgiLCJmcm9tIiwia2V5cyIsInJvd1dpZHRoIiwibWF4Iiwicm93SWR4IiwiY2VpbCIsIm1lYXN1cmVUZXh0Iiwid2lkdGgiLCJoZWFkZXJXaWR0aCIsIm1pblJvd1dpZHRoIiwibWluSGVhZGVyV2lkdGgiLCJjbGFtcGVkUm93V2lkdGgiLCJjbGFtcCIsImNsYW1wZWRIZWFkZXJXaWR0aCIsInBhcmVudEVsZW1lbnQiLCJyZW1vdmVDaGlsZCIsIm1pbiIsInZhbHVlIiwiZ2V0Q29sdW1uT3JkZXIiLCJwaW5uZWRDb2x1bW5zIiwidW5waW5uZWRDb2x1bW5zIiwiZ2V0TWluQ2VsbFNpemUiLCJjZWxsU2l6ZUNhY2hlIiwiT2JqZWN0IiwicmVkdWNlIiwiYWNjdSIsImNvbCIsImdldFNpemVTdW0iLCJzaXplQ2FjaGUiLCJrZXkiLCJhY2MiLCJ2YWwiLCJleHBhbmRDZWxsU2l6ZSIsImNvbHVtbk9yZGVyIiwiY29udGFpbmVyV2lkdGgiLCJyb29tVG9GaWxsIiwicmVtYWluaW5nIiwiZXhwYW5kZWRDZWxsU2l6ZSIsInNpemUiLCJnaG9zdCIsImxhc3RDZWxsIiwiYWRqdXN0Q2VsbHNUb0NvbnRhaW5lciIsIm1pblJvd1N1bSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLG1CQUFtQixHQUFHLEdBQTVCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBQ08sU0FBU0MsWUFBVCxPQVlKO0FBQUEsdUJBWERDLElBV0M7QUFBQSxNQVhNQyxJQVdOLGFBWE1BLElBV047QUFBQSxNQVhZQyxNQVdaLGFBWFlBLE1BV1o7QUFBQSx1QkFWREMsSUFVQztBQUFBLE1BVkRBLElBVUMsMEJBVk0sUUFVTjtBQUFBLE1BVERDLE1BU0MsUUFUREEsTUFTQztBQUFBLG1DQVJEQyxrQkFRQztBQUFBLE1BUkRBLGtCQVFDLHNDQVJvQixFQVFwQjtBQUFBLDJCQVBEQyxRQU9DO0FBQUEsTUFQREEsUUFPQyw4QkFQVSxFQU9WO0FBQUEsdUJBTkRDLElBTUM7QUFBQSxNQU5EQSxJQU1DLDBCQU5NLE1BTU47QUFBQSw4QkFMREMsV0FLQztBQUFBLE1BTERBLFdBS0MsaUNBTGEsRUFLYjtBQUFBLDhCQUpEQyxXQUlDO0FBQUEsTUFKREEsV0FJQyxpQ0FKYSxHQUliO0FBQUEsZ0NBSERDLGFBR0M7QUFBQSxNQUhEQSxhQUdDLG1DQUhlLEdBR2Y7QUFBQSw4QkFGREMsV0FFQztBQUFBLE1BRkRBLFdBRUMsaUNBRmEsRUFFYjtBQUFBLGdDQUREQyxhQUNDO0FBQUEsTUFEREEsYUFDQyxtQ0FEZSxFQUNmOztBQUNELE1BQUksQ0FBQ0Msb0JBQUwsRUFBZTtBQUNiLFdBQU87QUFDTEMsTUFBQUEsR0FBRyxFQUFFLENBREE7QUFFTEMsTUFBQUEsTUFBTSxFQUFFO0FBRkgsS0FBUDtBQUlEOztBQUNELE1BQU1DLFVBQVUsR0FBR0gscUJBQVNJLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBbkI7O0FBQ0FKLHVCQUFTSyxJQUFULENBQWNDLFdBQWQsQ0FBMEJILFVBQTFCOztBQUNBLE1BQU1JLE9BQU8sR0FB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QUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IGRvY3VtZW50IGZyb20gJ2dsb2JhbC9kb2N1bWVudCc7XG5pbXBvcnQge3BhcnNlRmllbGRWYWx1ZX0gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5cbmNvbnN0IE1JTl9HSE9TVF9DRUxMX1NJWkUgPSAyMDA7XG5cbi8qKlxuICogTWVhc3VyZSByb3dzIGFuZCBjb2x1bW4gY29udGVudCB0byBkZXRlcm1pbiBtaW4gd2lkdGggZm9yIGVhY2ggY29sdW1uXG4gKiBAcGFyYW0geyp9IHBhcmFtMFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyZWRTaXplKHtcbiAgdGV4dDoge3Jvd3MsIGNvbHVtbn0sXG4gIHR5cGUgPSAnc3RyaW5nJyxcbiAgY29sSWR4LFxuICBudW1Sb3dzVG9DYWxjdWxhdGUgPSAxMCxcbiAgZm9udFNpemUgPSAxMixcbiAgZm9udCA9ICdMYXRvJyxcbiAgY2VsbFBhZGRpbmcgPSA0MCxcbiAgbWF4Q2VsbFNpemUgPSA0MDAsXG4gIG1heEhlYWRlclNpemUgPSAxNTAsXG4gIG1pbkNlbGxTaXplID0gNDUsXG4gIG9wdGlvbnNCdXR0b24gPSAzMFxufSkge1xuICBpZiAoIWRvY3VtZW50KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvdzogMCxcbiAgICAgIGhlYWRlcjogMFxuICAgIH07XG4gIH1cbiAgY29uc3QgdGV4dENhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRleHRDYW52YXMpO1xuICBjb25zdCBjb250ZXh0ID0gdGV4dENhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICBjb250ZXh0LmZvbnQgPSBbZm9udFNpemUsIGZvbnRdLmpvaW4oJ3B4ICcpO1xuICBsZXQgcm93c1RvU2FtcGxlID0gWy4uLkFycmF5KG51bVJvd3NUb0NhbGN1bGF0ZSldLm1hcCgoKSA9PlxuICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChyb3dzLmxlbmd0aCAtIDEpKVxuICApO1xuXG4gIC8vIElGIHdlIGhhdmUgbGVzcyB0aGFuIDEwIHJvd3MsIGxldHMgbWVhc3VyZSBhbGwgb2YgdGhlbVxuICBpZiAocm93cy5sZW5ndGggPD0gbnVtUm93c1RvQ2FsY3VsYXRlKSB7XG4gICAgcm93c1RvU2FtcGxlID0gQXJyYXkuZnJvbShBcnJheShyb3dzLmxlbmd0aCkua2V5cygpKTtcbiAgfVxuICBjb25zdCByb3dXaWR0aCA9IE1hdGgubWF4KFxuICAgIC4uLnJvd3NUb1NhbXBsZS5tYXAoXG4gICAgICByb3dJZHggPT5cbiAgICAgICAgTWF0aC5jZWlsKGNvbnRleHQubWVhc3VyZVRleHQocGFyc2VGaWVsZFZhbHVlKHJvd3Nbcm93SWR4XVtjb2xJZHhdLCB0eXBlKSkud2lkdGgpICtcbiAgICAgICAgY2VsbFBhZGRpbmdcbiAgICApXG4gICk7XG4gIC8vIGhlYWRlciBjZWxsIG9ubHkgaGFzIGxlZnQgcGFkZGluZ1xuICBjb25zdCBoZWFkZXJXaWR0aCA9XG4gICAgTWF0aC5jZWlsKGNvbnRleHQubWVhc3VyZVRleHQoY29sdW1uKS53aWR0aCkgKyBjZWxsUGFkZGluZyAvIDIgKyBvcHRpb25zQnV0dG9uO1xuXG4gIGNvbnN0IG1pblJvd1dpZHRoID0gbWluQ2VsbFNpemUgKyBjZWxsUGFkZGluZztcbiAgY29uc3QgbWluSGVhZGVyV2lkdGggPSBtaW5DZWxsU2l6ZSArIGNlbGxQYWRkaW5nIC8gMiArIG9wdGlvbnNCdXR0b247XG5cbiAgY29uc3QgY2xhbXBlZFJvd1dpZHRoID0gY2xhbXAobWluUm93V2lkdGgsIG1heENlbGxTaXplLCByb3dXaWR0aCk7XG4gIGNvbnN0IGNsYW1wZWRIZWFkZXJXaWR0aCA9IGNsYW1wKG1pbkhlYWRlcldpZHRoLCBtYXhIZWFkZXJTaXplLCBoZWFkZXJXaWR0aCk7XG5cbiAgLy8gY2xlYW51cFxuICB0ZXh0Q2FudmFzLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGV4dENhbnZhcyk7XG5cbiAgcmV0dXJuIHtcbiAgICByb3c6IGNsYW1wZWRSb3dXaWR0aCxcbiAgICBoZWFkZXI6IGNsYW1wZWRIZWFkZXJXaWR0aFxuICB9O1xufVxuXG5mdW5jdGlvbiBjbGFtcChtaW4sIG1heCwgdmFsdWUpIHtcbiAgcmV0dXJuIE1hdGgubWF4KE1hdGgubWluKG1heCwgdmFsdWUpLCBtaW4pO1xufVxuXG5mdW5jdGlvbiBnZXRDb2x1bW5PcmRlcihwaW5uZWRDb2x1bW5zID0gW10sIHVucGlubmVkQ29sdW1ucyA9IFtdKSB7XG4gIHJldHVybiBbLi4ucGlubmVkQ29sdW1ucywgLi4udW5waW5uZWRDb2x1bW5zXTtcbn1cblxuZnVuY3Rpb24gZ2V0TWluQ2VsbFNpemUoY2VsbFNpemVDYWNoZSkge1xuICByZXR1cm4gT2JqZWN0LmtleXMoY2VsbFNpemVDYWNoZSkucmVkdWNlKFxuICAgIChhY2N1LCBjb2wpID0+ICh7XG4gICAgICAuLi5hY2N1LFxuICAgICAgW2NvbF06IGNlbGxTaXplQ2FjaGVbY29sXS5yb3dcbiAgICB9KSxcbiAgICB7fVxuICApO1xufVxuXG5mdW5jdGlvbiBnZXRTaXplU3VtKHNpemVDYWNoZSwga2V5KSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhzaXplQ2FjaGUpLnJlZHVjZShcbiAgICAoYWNjLCB2YWwpID0+IGFjYyArIChrZXkgPyBzaXplQ2FjaGVbdmFsXVtrZXldIDogc2l6ZUNhY2hlW3ZhbF0pLFxuICAgIDBcbiAgKTtcbn1cblxuLyoqXG4gKiBFeHBhbmQgY2VsbCB0byBmaXQgYm90aCByb3cgYW5kIGhlYWRlciwgaWYgdGhlcmUgaXMgc3RpbGwgcm9vbSBsZWZ0LFxuICogZXhwYW5kIGxhc3QgY2VsbCB0byBmaXQgdGhlIGVudGlyZSB3aWR0aCBvZiB0aGUgY29udGFpbmVyXG4gKiBAcGFyYW0ge29iamVjdH0gY2VsbFNpemVDYWNoZVxuICogQHBhcmFtIHtzdHJpbmdbXX0gY29sdW1uT3JkZXJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjb250YWluZXJXaWR0aFxuICogQHBhcmFtIHtudW1iZXJ9IHJvb21Ub0ZpbGxcbiAqL1xuZnVuY3Rpb24gZXhwYW5kQ2VsbFNpemUoY2VsbFNpemVDYWNoZSwgY29sdW1uT3JkZXIsIGNvbnRhaW5lcldpZHRoLCByb29tVG9GaWxsKSB7XG4gIGxldCByZW1haW5pbmcgPSByb29tVG9GaWxsO1xuXG4gIGNvbnN0IGV4cGFuZGVkQ2VsbFNpemUgPSBjb2x1bW5PcmRlci5yZWR1Y2UoKGFjY3UsIGNvbCkgPT4ge1xuICAgIGxldCBzaXplID0gY2VsbFNpemVDYWNoZVtjb2xdLnJvdztcbiAgICBpZiAoY2VsbFNpemVDYWNoZVtjb2xdLnJvdyA8IGNlbGxTaXplQ2FjaGVbY29sXS5oZWFkZXIgJiYgcmVtYWluaW5nID4gMCkge1xuICAgICAgLy8gaWYgd2UgYXJlIGN1dHRpbmcgb2ZmIHRoZSBoZWFkZXIsIGV4cGFuZCB0byBmaXQgaXRcbiAgICAgIHNpemUgPVxuICAgICAgICBjZWxsU2l6ZUNhY2hlW2NvbF0uaGVhZGVyIC0gY2VsbFNpemVDYWNoZVtjb2xdLnJvdyA8IHJlbWFpbmluZ1xuICAgICAgICAgID8gY2VsbFNpemVDYWNoZVtjb2xdLmhlYWRlclxuICAgICAgICAgIDogY2VsbFNpemVDYWNoZVtjb2xdLnJvdyArIHJlbWFpbmluZztcbiAgICAgIHJlbWFpbmluZyAtPSBzaXplIC0gY2VsbFNpemVDYWNoZVtjb2xdLnJvdztcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uYWNjdSxcbiAgICAgIFtjb2xdOiBzaXplXG4gICAgfTtcbiAgfSwge30pO1xuXG4gIGxldCBnaG9zdCA9IG51bGw7XG4gIGlmIChyZW1haW5pbmcgPiAwICYmIHJlbWFpbmluZyA8IE1JTl9HSE9TVF9DRUxMX1NJWkUpIHtcbiAgICAvLyBleHBhbmQgbGFzdCBjZWxsXG4gICAgY29uc3QgbGFzdENlbGwgPSBjb2x1bW5PcmRlcltjb2x1bW5PcmRlci5sZW5ndGggLSAxXTtcbiAgICBleHBhbmRlZENlbGxTaXplW2xhc3RDZWxsXSArPSByZW1haW5pbmc7XG4gIH0gZWxzZSBpZiAocmVtYWluaW5nID49IE1JTl9HSE9TVF9DRUxMX1NJWkUpIHtcbiAgICAvLyBpZiB0b28gbXVjaCBsZWZ0IGFkZCBhIGdob3N0IGNlbGxcbiAgICBnaG9zdCA9IHJlbWFpbmluZztcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY2VsbFNpemVDYWNoZTogZXhwYW5kZWRDZWxsU2l6ZSxcbiAgICBnaG9zdFxuICB9O1xufVxuXG4vKipcbiAqIEFkanVzdCBjZWxsIHNpemUgYmFzZWQgb24gY29udGFpbmVyIHdpZHRoXG4gKiBAcGFyYW0ge251bWJlcn0gY29udGFpbmVyV2lkdGhcbiAqIEBwYXJhbSB7T2JqZWN0fSBjZWxsU2l6ZUNhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBwaW5uZWRDb2x1bW5zXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB1bnBpbm5lZENvbHVtbnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkanVzdENlbGxzVG9Db250YWluZXIoXG4gIGNvbnRhaW5lcldpZHRoLFxuICBjZWxsU2l6ZUNhY2hlLFxuICBwaW5uZWRDb2x1bW5zLFxuICB1bnBpbm5lZENvbHVtbnNcbikge1xuICBjb25zdCBtaW5Sb3dTdW0gPSBnZXRTaXplU3VtKGNlbGxTaXplQ2FjaGUsICdyb3cnKTtcbiAgaWYgKG1pblJvd1N1bSA+PSBjb250YWluZXJXaWR0aCkge1xuICAgIC8vIHdlIGFwcGx5IHRoZSBtaW4gV2lkdGggdG8gYWxsIGNlbGxzXG4gICAgcmV0dXJuIHtjZWxsU2l6ZUNhY2hlOiBnZXRNaW5DZWxsU2l6ZShjZWxsU2l6ZUNhY2hlKX07XG4gIH1cblxuICAvLyBpZiB3ZSBoYXZlIHNvbWUgcm9vbSB0byBleHBhbmRcbiAgY29uc3QgY29sdW1uT3JkZXIgPSBnZXRDb2x1bW5PcmRlcihwaW5uZWRDb2x1bW5zLCB1bnBpbm5lZENvbHVtbnMpO1xuICByZXR1cm4gZXhwYW5kQ2VsbFNpemUoY2VsbFNpemVDYWNoZSwgY29sdW1uT3JkZXIsIGNvbnRhaW5lcldpZHRoLCBjb250YWluZXJXaWR0aCAtIG1pblJvd1N1bSk7XG59XG4iXX0=