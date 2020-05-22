// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to tdahe following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {TRIP_POINT_FIELDS, SORT_ORDER} from 'constants/default-settings';
// import {validateInputData} from 'processors/data-processor';
import {generateHashId} from 'utils/utils';
import {getGpuFilterProps} from 'utils/gpu-filter-utils';
import {getFieldDomain} from 'utils/filter-utils';
import {ascending, descending} from 'd3-array';

const FID_KEY = 'name';

export class KeplerTable {
  constructor({info = {}, data, color}) {
    // TODO - what to do if validation fails? Can kepler handle exceptions?
    // const validatedData = validateInputData(data);
    // if (!validatedData) {
    //   return this;
    // }

    const allData = data.rows;
    const datasetInfo = {
      id: generateHashId(4),
      label: 'new dataset',
      ...(info || {})
    };
    const dataId = datasetInfo.id;

    // add tableFieldIndex and id to fields
    // TODO: don't need id and name and tableFieldIndex anymore
    // Add value accessor instead
    const fields = data.fields.map((f, i) => ({
      ...f,
      id: f.name,
      tableFieldIndex: i + 1
    }));

    const allIndexes = allData.map((_, i) => i);

    Object.assign(this, {
      ...datasetInfo,
      id: dataId,
      color,
      allData,
      allIndexes,
      filteredIndex: allIndexes,
      filteredIndexForDomain: allIndexes,
      fieldPairs: findPointFieldPairs(fields),
      fields,
      gpuFilter: getGpuFilterProps([], dataId, fields)
    });
  }

  getColumnField(columnName) {
    // TODO - id or name?
    return this.fields.find(field => field[FID_KEY] === columnName);
  }

  /**
   * Calculate field domain based on field type and data
   *
   * @param {Array<Array>} allData
   * @param {Object} field
   * @returns {Object} with domain as key
   */
  getColumnDomain(columnName) {
    const {allData} = this;
    const field = this.getColumnField(columnName);

    return getFieldDomain(allData, field);
  }
}

// HELPER FUNCTIONS (MAINLY EXPORTED FOR TEST...)

export function removeSuffixAndDelimiters(layerName, suffix) {
  return layerName
    .replace(new RegExp(suffix, 'ig'), '')
    .replace(/[_,.]+/g, ' ')
    .trim();
}

/**
 * Find point fields pairs from fields
 *
 * @param fields
 * @returns found point fields
 * @type {typeof import('../dataset-utils').findPointFieldPairs}
 */
export function findPointFieldPairs(fields) {
  const allNames = fields.map(f => f.name.toLowerCase());

  // get list of all fields with matching suffixes
  return allNames.reduce((carry, fieldName, idx) => {
    // This search for pairs will early exit if found.
    for (const suffixPair of TRIP_POINT_FIELDS) {
      // match first suffix```
      if (fieldName.endsWith(suffixPair[0])) {
        // match second suffix
        const otherPattern = new RegExp(`${suffixPair[0]}\$`);
        const partner = fieldName.replace(otherPattern, suffixPair[1]);

        const partnerIdx = allNames.findIndex(d => d === partner);
        if (partnerIdx > -1) {
          const defaultName = removeSuffixAndDelimiters(fieldName, suffixPair[0]);

          carry.push({
            defaultName,
            pair: {
              lat: {
                fieldIdx: idx,
                value: fields[idx].name
              },
              lng: {
                fieldIdx: partnerIdx,
                value: fields[partnerIdx].name
              }
            },
            suffix: suffixPair
          });
          return carry;
        }
      }
    }
    return carry;
  }, []);
}

/**
 *
 * @param dataset
 * @param column
 * @param mode
 * @type {typeof import('../dataset-utils').sortDatasetByColumn}
 */
export function sortDatasetByColumn(dataset, column, mode) {
  const {allIndexes, fields, allData} = dataset;
  const fieldIndex = fields.findIndex(f => f.name === column);
  if (fieldIndex < 0) {
    return dataset;
  }

  const sortBy = SORT_ORDER[mode] || SORT_ORDER.ASCENDING;

  if (sortBy === SORT_ORDER.UNSORT) {
    return {
      ...dataset,
      sortColumn: {},
      sortOrder: null
    };
  }

  const sortFunction = sortBy === SORT_ORDER.ASCENDING ? ascending : descending;
  const sortOrder = allIndexes
    .slice()
    .sort((a, b) => sortFunction(allData[a][fieldIndex], allData[b][fieldIndex]));

  return {
    ...dataset,
    sortColumn: {
      [column]: sortBy
    },
    sortOrder
  };
}
