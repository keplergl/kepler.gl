// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// deck.gl-community
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import * as arrow from 'apache-arrow';
import {GetPickingInfoParams} from '@deck.gl/core/typed';
import {GeoArrowPickingInfo} from '../types';

export interface GeoArrowExtraPickingProps {
  recordBatchIdx: number;
  tableOffsets: Uint32Array;
  data: {
    invertedGeomOffsets?: Uint8Array | Uint16Array | Uint32Array;
  };
}

export function getPickingInfo(
  {
    info,
    sourceLayer
  }: GetPickingInfoParams & {
    sourceLayer: {props: GeoArrowExtraPickingProps};
  },
  table: arrow.Table
): GeoArrowPickingInfo {
  // Geometry index as rendered
  let index = info.index;

  // if a Multi- geometry dataset, map from the rendered index back to the
  // feature index
  if (sourceLayer.props.data.invertedGeomOffsets) {
    index = sourceLayer.props.data.invertedGeomOffsets[index];
  }

  const recordBatchIdx = sourceLayer.props.recordBatchIdx;
  const tableOffsets = sourceLayer.props.tableOffsets;

  const batch = table.batches[recordBatchIdx];
  const row = batch.get(index);
  if (row === null) {
    return info;
  }

  const currentBatchOffset = tableOffsets[recordBatchIdx];

  // Update index to be _global_ index, not within the specific record batch
  index += currentBatchOffset;
  return {
    ...info,
    index,
    object: row
  };
}

// This is vendored from Arrow JS because it's a private API
export function computeChunkOffsets<T extends arrow.DataType>(
  chunks: ReadonlyArray<arrow.Data<T>>
) {
  return chunks.reduce((offsets, chunk, index) => {
    offsets[index + 1] = offsets[index] + chunk.length;
    return offsets;
  }, new Uint32Array(chunks.length + 1));
}
