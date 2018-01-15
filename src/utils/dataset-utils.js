import {hexToRgb} from './color-utils';
import uniq from 'lodash.uniq';
import {TRIP_POINT_FIELDS} from 'constants/default-settings';
import {generateHashId} from "./utils";

// apply a color for each dataset
// to use as label colors
const datasetColors = [
  '#355C7D',
  '#6C5B7B',
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

  const usedColors = uniq(Object.values(datasets).map(d => String(d.color)))
    .filter(c => presetColors.includes(c));

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

export function createNewDataEntry({info = {}, data}, datasets) {

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
    tableFieldIndex: i + 1
  }));

  return {
    [dataId]: {
      ...datasetInfo,
      color: datasetInfo.color || getNewDatasetColor(datasets),
      id: dataId,
      allData,
      // TODO: no need to make a copy anymore, only save fieldedIndex
      data: allData.slice(),
      filteredIndex: allData.map((_, i) => i),
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
