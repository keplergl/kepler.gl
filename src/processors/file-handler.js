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
import {
  processCsvData,
  processGeojson,
  processKeplerglJSON
} from './data-processor';
import {importJSON} from './mapshaper-json-import';

const FILE_HANDLERS = {
  csv: loadCsv,
  json: loadJSON
};

export function getFileHandler(fileBlob) {
  const type = getFileType(fileBlob.name);
  return FILE_HANDLERS[type];
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

export function loadCsv(fileBlob, processor = processCsvData) {
  return readCSVFile(fileBlob).then(rawData =>
    rawData ? processor(rawData) : null
  );
}

function readJSONFile(fileBlob) {
  const useBinary = true;
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = ({target: {result}}) => {
      try {
        const json = useBinary
          ? importJSON({filename: fileBlob.name, content: result})
          : JSON.parse(result);
        console.log(json)
        resolve(json);
      } catch (err) {
        console.log(err)
        resolve(null);
      }
    };
    if (useBinary) {
      fileReader.readAsArrayBuffer(fileBlob);
    } else {
      fileReader.readAsText(fileBlob, 'UTF-8');
    }
  });
}

export function isKeplerGlMap(json) {
  return (
    typeof json === 'object' &&
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

export function loadJSON(fileBlob, processor = processGeojson) {
  return readJSONFile(fileBlob).then(content =>
    content ? determineJsonProcess(content, processor)(content.dataset) : null
  );
}
