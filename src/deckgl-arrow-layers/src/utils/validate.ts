// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// deck.gl-community
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {assert} from '@deck.gl/core/typed';
import * as arrow from 'apache-arrow';

export function validateAccessors(props: Record<string, any>, table: arrow.Table): void {
  const vectorAccessors: arrow.Vector[] = [];
  const colorVectorAccessors: arrow.Vector[] = [];
  for (const [accessorName, accessorValue] of Object.entries(props)) {
    // Is it an accessor
    if (accessorName.startsWith('get')) {
      // Is it a vector accessor
      if (accessorValue instanceof arrow.Vector) {
        vectorAccessors.push(accessorValue);

        // Is it a color vector accessor
        if (accessorName.endsWith('Color')) {
          colorVectorAccessors.push(accessorValue);
        }
      }
    }
  }

  validateVectorAccessors(table, vectorAccessors);
  for (const colorVectorAccessor of colorVectorAccessors) {
    validateColorVector(colorVectorAccessor);
  }
}

/**
 * Provide validation for accessors provided
 *
 * - Assert that all vectors have the same number of chunks as the main table
 * - Assert that all chunks in each vector have the same number of rows as the
 *   relevant batch in the main table.
 *
 */
export function validateVectorAccessors(table: arrow.Table, vectorAccessors: arrow.Vector[]) {
  // Check the same number of chunks as the table's batches
  for (const vectorAccessor of vectorAccessors) {
    assert(table.batches.length === vectorAccessor.data.length);
  }

  // Check that each table batch/vector data has the same number of rows
  for (const vectorAccessor of vectorAccessors) {
    for (let i = 0; i < table.batches.length; i++) {
      assert(table.batches[i].numRows === vectorAccessor.data[i].length);
    }
  }
}

export function validateColorVector(vector: arrow.Vector) {
  // Assert the color vector is a FixedSizeList
  assert(arrow.DataType.isFixedSizeList(vector.type));

  // Assert it has 3 or 4 values
  assert(vector.type.listSize === 3 || vector.type.listSize === 4);

  // Assert the child type is an integer
  assert(arrow.DataType.isInt(vector.type.children[0]));

  // Assert the child type is a Uint8
  // Property 'type' does not exist on type 'Int_<Ints>'. Did you mean 'TType'?
  assert(vector.type.children[0].type.bitWidth === 8);
}
