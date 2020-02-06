// Copyright (c) 2020 Uber Technologies, Inc.
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

import {FileReader} from 'global/window';
import Console from 'global/console';
import {
  processCsvData,
  processGeojson,
  processKeplerglJSON,
  processRowObject
} from './data-processor';
import {isPlainObject} from 'utils/utils';
import {DATASET_FORMATS} from 'constants/default-settings';

const FILE_HANDLERS = {
  csv: loadCsv,
  json: loadJSON
};

export function readFile({file, fileCache = []}) {
  return new Promise((resolve, reject) => {
    const {handler, format} = getFileHandler(file);
    if (!handler) {
      Console.warn(
        `Canont determine file handler for file ${file.name}. It must have a valid file extension`
      );
      resolve(fileCache);
    }

    handler({file, format}).then(result => {
      if (!result || !result.data) {
        // return fileCache, to keep process other files
        resolve(fileCache);
      }
      resolve([
        ...fileCache,
        {
          data: result.data,
          info: {
            label: file.name,
            format: result.format
          }
        }
      ]);
    });
  });
}

export function getFileHandler(fileBlob) {
  const type = getFileType(fileBlob.name);

  return {handler: FILE_HANDLERS[type], format: type};
}

export function getFileType(filename) {
  if (filename.endsWith('csv')) {
    return 'csv';
  } else if (filename.endsWith('json') || filename.endsWith('geojson')) {
    // Read GeoJson from browser
    return 'json';
  }

  // Wait to add other file type handler
  return 'other';
}

function readCSVFile(fileBlob) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = ({target: {result}}) => {
      resolve(result);
    };

    fileReader.readAsText(fileBlob);
  });
}

export function loadCsv({file, format, processor = processCsvData}) {
  return readCSVFile(file).then(rawData => (rawData ? {data: processor(rawData), format} : null));
}

export function loadJSON({file, processor = processGeojson}) {
  return readJSONFile(file).then(content => {
    if (isKeplerGlMap(content)) {
      return {
        format: DATASET_FORMATS.keplergl,
        data: processKeplerglJSON(content)
      };
    } else if (isRowObject(content)) {
      return {
        format: DATASET_FORMATS.row,
        data: processRowObject(content)
      };
    } else if (isGeoJson(content)) {
      return {
        format: DATASET_FORMATS.geojson,
        data: processGeojson(content)
      };
    }
    // unsupported json format
    Console.warn(`unsupported Json format ${file.name}`);
    return null;
  });
}

export function readJSONFile(fileBlob) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = ({target: {result}}) => {
      try {
        const json = JSON.parse(result);
        resolve(json);
      } catch (err) {
        reject(null);
      }
    };

    fileReader.readAsText(fileBlob, 'UTF-8');
  });
}

export function isGeoJson(json) {
  // json can be feature collection
  // or simgle feature
  return isPlainObject(json) && (isFeature(json) || isFeatureCollection(json));
}

export function isFeature(json) {
  return json.type === 'Feature' && json.geometry;
}

export function isFeatureCollection(json) {
  return json.type === 'FeatureCollection' && json.features;
}

export function isRowObject(json) {
  return Array.isArray(json) && isPlainObject(json[0]);
}

export function isKeplerGlMap(json) {
  return (
    isPlainObject(json) &&
    json.datasets &&
    json.config &&
    json.info &&
    json.info.app === 'kepler.gl'
  );
}

export function determineJsonProcess({dataset, format}, defaultProcessor) {
  if (isKeplerGlMap(dataset)) {
    return processKeplerglJSON;
  }

  return defaultProcessor;
}
