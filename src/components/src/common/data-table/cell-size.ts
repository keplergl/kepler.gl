// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import document from 'global/document';
import {DataContainerInterface, parseFieldValue} from '@kepler.gl/utils';

const MIN_GHOST_CELL_SIZE = 200;
const MIN_CELL_SIZE = 45;
// first column have padding on the left
const EDGE_COLUMN_PADDING = 10;

// in case cell content is small, column name is big, we allow max empty space to
// be added to min cell width in order to show column name
const MAX_EMPTY_COLUMN_SPACE = 60;

type RenderSizeParam = {
  text: {dataContainer: DataContainerInterface; column: string};
  type?: string;
  colIdx: number;
  numRowsToCalculate?: number;
  fontSize?: number;
  font?: string;
  cellPadding?: number;
  maxCellSize?: number;
  maxHeaderSize?: number;
  minCellSize?: number;
  optionsButton?: number;
};

export type CellSizeCache = {
  [key: string]: {
    row: number;
    header: number;
  };
};

/**
 * Measure rows and column content to determine min width for each column
 * @param {RenderSizeParam} param0
 */
export function renderedSize({
  text: {dataContainer, column},
  type = 'string',
  colIdx,
  numRowsToCalculate = 10,
  fontSize = 12,
  font = 'Lato',
  cellPadding = 40,
  maxCellSize = 500,
  maxHeaderSize = 500,
  minCellSize = MIN_CELL_SIZE,
  optionsButton = 44
}: RenderSizeParam): {row: number; header: number} {
  if (!document) {
    return {
      row: 0,
      header: 0
    };
  }

  const textCanvas = document.createElement('canvas');
  document.body.appendChild(textCanvas);
  const context = textCanvas.getContext('2d');
  context.font = [fontSize, font].join('px ');

  let rowsToSample = [...Array(numRowsToCalculate)].map(() =>
    Math.floor(Math.random() * (dataContainer.numRows() - 1))
  );

  // If we have less than 10 rows, lets measure all of them
  if (dataContainer.numRows() <= numRowsToCalculate) {
    rowsToSample = Array.from(Array(dataContainer.numRows()).keys());
  }
  const rowWidth = Math.max(
    ...rowsToSample.map(rowIdx => {
      const value = parseFieldValue(dataContainer.valueAt(rowIdx, colIdx), type);
      // measuring large text cause slow performance
      if (value.length > maxCellSize) {
        return maxCellSize;
      }
      const textWidth = context.measureText(value).width;
      return Math.ceil(textWidth) + cellPadding;
    })
  );
  // header cell only has left padding
  const headerWidth =
    Math.ceil(context.measureText(column).width) + cellPadding / 2 + optionsButton;

  // min row width is measured by cell content
  const minRowWidth = minCellSize + cellPadding;
  // min header width is measured by cell
  const minHeaderWidth = minCellSize + cellPadding / 2 + optionsButton;

  const clampedRowWidth = clamp(minRowWidth, maxCellSize, rowWidth);
  const clampedHeaderWidth = clamp(minHeaderWidth, maxHeaderSize, headerWidth);

  // cleanup
  textCanvas.parentElement.removeChild(textCanvas);

  return {
    row: clampedRowWidth,
    header: clampedHeaderWidth
  };
}

function clamp(min, max, value) {
  return Math.max(Math.min(max, value), min);
}

function getColumnOrder(pinnedColumns: string[] = [], unpinnedColumns: string[] = []) {
  return [...pinnedColumns, ...unpinnedColumns];
}

// If total min cell size is bigger than containerWidth adjust column
function getMinCellSize(cellSizeCache: CellSizeCache) {
  return Object.keys(cellSizeCache).reduce(
    (accu, col) => ({
      ...accu,
      // if row is larger than header, use row
      [col]:
        cellSizeCache[col].row > cellSizeCache[col].header
          ? cellSizeCache[col].row
          : // if row is smaller than header, use the smaller of MAX_EMPTY_COLUMN_SPACE + row width and header
            Math.min(cellSizeCache[col].header, cellSizeCache[col].row + MAX_EMPTY_COLUMN_SPACE)
    }),
    {}
  );
}

function getSizeSum(sizeCache, key) {
  return Object.keys(sizeCache).reduce(
    (acc, val) => acc + (key ? sizeCache[val][key] : sizeCache[val]),
    0
  );
}

/**
 * Expand cell to fit both row and header, if there is still room left,
 * expand last cell to fit the entire width of the container
 * @param {CellSizeCache} cellSizeCache
 * @param {string[]} columnOrder
 * @param {number} containerWidth
 * @param {number} roomToFill
 */
function expandCellSize(
  cellSizeCache: CellSizeCache,
  columnOrder: string[],
  containerWidth: number,
  roomToFill: number
): {
  cellSizeCache: CellSizeCache;
  ghost: number | null;
} {
  let remaining = roomToFill;

  const expandedCellSize = columnOrder.reduce((accu, col) => {
    let size = cellSizeCache[col].row;
    if (cellSizeCache[col].row < cellSizeCache[col].header && remaining > 0) {
      // if we are cutting off the header, expand to fit it
      size =
        cellSizeCache[col].header - cellSizeCache[col].row < remaining
          ? cellSizeCache[col].header
          : cellSizeCache[col].row + remaining;
      remaining -= size - cellSizeCache[col].row;
    }

    return {
      ...accu,
      [col]: size
    };
  }, {});

  let ghost: number | null = null;
  if (remaining > 0 && remaining < MIN_GHOST_CELL_SIZE) {
    // expand last cell
    const lastCell = columnOrder[columnOrder.length - 1];
    expandedCellSize[lastCell] += remaining;
  } else if (remaining >= MIN_GHOST_CELL_SIZE) {
    // if too much left add a ghost cell
    ghost = remaining;
  }

  return {
    cellSizeCache: expandedCellSize,
    ghost
  };
}

function addPaddingToFirstColumn(
  cellSizeCache: CellSizeCache,
  columnOrder: string[] = []
): CellSizeCache {
  const firstCol = columnOrder[0];

  if (firstCol && cellSizeCache[firstCol]) {
    return {
      ...cellSizeCache,
      [firstCol]: {
        header: cellSizeCache[firstCol].header + EDGE_COLUMN_PADDING,
        row: cellSizeCache[firstCol].row + EDGE_COLUMN_PADDING
      }
    };
  }
  return cellSizeCache;
}

/**
 * Adjust cell size based on container width
 * @param {number} containerWidth
 * @param {CellSizeCache} cellSizeCache
 * @param {string[]} pinnedColumns
 * @param {string[]} unpinnedColumns
 */
export function adjustCellsToContainer(
  containerWidth: number,
  cellSizeCache: CellSizeCache,
  pinnedColumns: string[],
  unpinnedColumns: string[]
): {
  cellSizeCache: CellSizeCache;
  ghost?: number | null;
} {
  const columnOrder = getColumnOrder(pinnedColumns, unpinnedColumns);
  const paddedCellSize = addPaddingToFirstColumn(cellSizeCache, columnOrder);
  const minRowSum = getSizeSum(paddedCellSize, 'row');

  if (minRowSum >= containerWidth) {
    // we apply the min Width to all cells
    return {cellSizeCache: getMinCellSize(paddedCellSize)};
  }
  // if we have some room to expand
  return expandCellSize(paddedCellSize, columnOrder, containerWidth, containerWidth - minRowSum);
}
