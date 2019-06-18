// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
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

import {hexToRgb} from './color-utils';
import uniq from 'lodash.uniq';
import {TRIP_POINT_FIELDS, ALL_FIELD_TYPES} from 'constants/default-settings';
import {generateHashId} from './utils';
import {validateInputData} from 'processors/data-processor';
import {maybeToDate} from './data-utils';
import keyBy from 'lodash.keyby';
import pick from 'lodash.pick';

// apply a color for each dataset
// to use as label colors
const datasetColors = [
  '#8F2FBF',
  '#005CFF',
  '#C06C84',
  '#F8B195',
  '#547A82',
  '#3EACA8',
  '#A2D4AB'
].map(hexToRgb);

/**
 * Random color generator
 */
function* generateColor() {
  let index = 0;
  while (index < datasetColors.length + 1) {
    if (index === datasetColors.length) {
      index = 0;
    }
    yield datasetColors[index++];
  }
}

export const datasetColorMaker = generateColor();

function getNewDatasetColor(datasets) {
  const presetColors = datasetColors.map(String);
  const usedColors = uniq(
    Object.values(datasets).map(d => String(d.color))
  ).filter(c => presetColors.includes(c));

  if (usedColors.length === presetColors.length) {
    // if we already depleted the pool of color
    return datasetColorMaker.next().value;
  }

  let color = datasetColorMaker.next().value;
  while (usedColors.includes(String(color))) {
    color = datasetColorMaker.next().value;
  }

  return color;
}

export function createNewDataEntry({info = {}, data}, datasets = {}) {
  const validatedData = validateInputData(data);
  if (!validatedData) {
    return {};
  }

  const allData = validatedData.rows;
  const datasetInfo = {
    id: generateHashId(4),
    label: 'new dataset',
    ...info
  };
  const dataId = datasetInfo.id;

  // add tableFieldIndex and id to fields
  // TODO: don't need id and name and tableFieldIndex anymore
  // Add value accessor instead
  const fields = validatedData.fields.map((f, i) => ({
    ...f,
    id: f.name,
    tableFieldIndex: i + 1,
    valueAccessor: maybeToDate.bind(
      null,
      // is time
      f.type === ALL_FIELD_TYPES.timestamp,
      i,
      f.format
    )
  }));

  const allIndexes = allData.map((_, i) => i);
  return {
    [dataId]: {
      ...datasetInfo,
      color: datasetInfo.color || getNewDatasetColor(datasets),
      id: dataId,
      allData,
      // TODO: no need to make a copy anymore, only save fieldedIndex
      data: allData.slice(),
      allIndexes,
      filteredIndex: allIndexes,
      filteredIndexForDomain: allIndexes,
      fieldPairs: findPointFieldPairs(fields),
      fields
    }
  };
}

export function removeSuffixAndDelimiters(layerName, suffix) {
  return layerName
    .replace(new RegExp(suffix, 'ig'), '')
    .replace(/[_,.]+/g, ' ')
    .trim();
}

/**
 * Find point fields pairs from fields
 *
 * @param {Array} fields
 * @returns {Array} found point fields
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
          const defaultName = removeSuffixAndDelimiters(
            fieldName,
            suffixPair[0]
          );

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

export const readyToJoin = ({source, target}) =>
  Boolean(source.id && source.field && target.id && target.field);

export const joinTableLeft = (
  sourceData,
  targetData,
  sourceField,
  targetField,
  indexBy
) => {
  console.time('join')
  const [sourceFIdx, targetFIdx] = [
    sourceField.tableFieldIndex - 1,
    targetField.tableFieldIndex - 1
  ];

  let mappedValue = targetField.mappedValue;
  let newMappedValue;
  if (indexBy && !mappedValue) {
    newMappedValue = mappedValue = targetData.allData.map(indexBy.valueAccessor);
  }

  // hash map of source data
  const sourceHashMap = keyBy(sourceData.allIndexes, si => sourceData.allData[si][sourceFIdx]);
  const indexMap = new Array(sourceData.allData.length);
  // iterate through targetData
  for (let i = 0; i < targetData.allData.length; i++) {
    const targetValue = targetData.allData[i][targetFIdx];
    // find match in source table
    const joinIdx = sourceHashMap[targetValue];
    // if find match
    if (joinIdx > -1) {
      if (!indexBy) {
        indexMap[joinIdx] = i;
      } else {
        indexMap[joinIdx] = indexMap[joinIdx] || {};
        indexMap[joinIdx][mappedValue[i]] = i;
      }
    }
  }

  // console.timeEnd('join')
  return {indexMap, mappedValue: newMappedValue};
};

export const joinTable = (state, joinData) => {
  const {source, target, joinType} = joinData;
  const {datasets} = state;
  if (!readyToJoin({source, target})) {
    // still not ready yet
    return state;
  }

  const [sourceData, targetData] = [datasets[source.id], datasets[target.id]];
  // indexMap: indexBy? [sourceIdx -> ts -> targetIdx] : [sourceIdx -> targetIdx]
  const {indexMap, mappedValue} = joinTableLeft(
    sourceData,
    targetData,
    source.field,
    target.field,
    target.indexBy
  );
  console.log(indexMap);
  let saveLinkToTarget = {
    ...targetData,
    joinSource: joinData.source
  };

  if (mappedValue) {
    saveLinkToTarget = {
      ...saveLinkToTarget,
      fields: targetData.fields.map((f, i) => i === target.indexBy.tableFieldIndex - 1 ? {
        ...f,
        mappedValue
      } : f)
    }
  }

  const targetFieldsToAppend = targetData.fields
    .filter(f => f.name !== target.field.name && f.name !== target.indexBy.name)
    .map(f => ({
      ...f,
      joinedFrom: pick(targetData, ['id', 'label', 'color']),
      indexBy: target.indexBy,
    }));

  // append targetFields
  const saveFieldsToSource = {
    ...sourceData,
    fields: sourceData.fields.concat(targetFieldsToAppend)
  }
  const savedLinkToSource = {
    ...saveFieldsToSource,
    joinTarget: pick(targetData, ['id', 'label', 'color']),
    joinData: {
      ...joinData,
      indexMap
    }
  };

  return {
    ...state.datasets,
    [source.id]: savedLinkToSource,
    [target.id]: saveLinkToTarget
  }
};
