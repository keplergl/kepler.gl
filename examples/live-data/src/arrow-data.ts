// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Table, Vector, Utf8, Float64, Int32, vectorFromArray} from 'apache-arrow';
import {arrowSchemaToFields} from '@kepler.gl/processors';

export const ARROW_DATASET_ID = 'live-arrow-vehicles';

/** Build once; subsequent changes use addToDataset/removeFromDataset. */
export function createArrowDataset() {
  const table = new Table({
    id: vectorFromArray(['veh-01', 'veh-02', 'veh-03'], new Utf8()),
    lat: vectorFromArray([37.79, 37.76, 37.78], new Float64()),
    lng: vectorFromArray([-122.45, -122.42, -122.39], new Float64()),
    heading: vectorFromArray([0, 120, 240], new Float64()),
    speed: vectorFromArray([25, 40, 55], new Float64()),
    ring: vectorFromArray([1, 2, 3], new Int32()),
    progress: vectorFromArray([0, 0, 0], new Float64()),
    orbit_s: vectorFromArray([0, 0, 0], new Float64()),
    updated_at: vectorFromArray(Array(3).fill(new Date().toISOString()), new Utf8())
  });
  return {
    info: {id: ARROW_DATASET_ID, label: 'Live Arrow'},
    data: {
      fields: arrowSchemaToFields(table),
      cols: table.schema.fields.map((_, index) => table.getChildAt(index) as Vector),
      rows: [],
      arrowTable: table
    }
  };
}
