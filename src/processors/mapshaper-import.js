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

/*****************************************************
 * This file is an adapted from mapshaper
 * https://github.com/mbloch/mapshaper
 * https://mapshaper.org/
 *****************************************************/
import {
  isNumber,
  isString,
  isArray,
  isInteger,
  isObject,
  stringLooksLikeJSON,
  contains
} from './mapshaper-utils';

import {importJSON} from './mapshaper-json-import';
import {importDelim2} from './mapshaper-delim-import';

export function readFile({file, fileCache}) {
  return new Promise((resolve, reject) => {
    const name = file.name;
    const reader = new FileReader();
    const useBinary =
      isSupportedBinaryInputType(name) ||
      isZipFile(name) ||
      guessInputFileType(name) === 'json' ||
      guessInputFileType(name) === 'text';

    reader.addEventListener('loadend', e => {
      if (!reader.result) {
        reject('Web browser was unable to load the file.', name);
      } else {
        const fileType = guessInputType(name, reader.result);
        const dataset = importNewDataset(fileType, name, reader.result);

        fileCache.push(dataset);
        resolve(fileCache);
      }
    });
    if (useBinary) {
      reader.readAsArrayBuffer(file);
    } else {
      // TODO: consider using "encoding" option, to support CSV files in other encodings than utf8
      reader.readAsText(file, 'UTF-8');
    }
  });
}

function isSupportedBinaryInputType(path) {
  var ext = getFileExtension(path).toLowerCase();
  return ext === 'shp' || ext === 'shx' || ext === 'dbf';
}

function isZipFile(file) {
  return /\.zip$/i.test(file);
}
function guessInputType(file, content) {
  return guessInputFileType(file) || guessInputContentType(content);
}
function guessInputContentType(content) {
  let type = null;
  if (isString(content)) {
    type = stringLooksLikeJSON(content) ? 'json' : 'text';
  } else if ((isObject(content) && content.type) || isArray(content)) {
    type = 'json';
  }
  return type;
}

// Guess the type of a data file from file extension, or return null if not sure
function guessInputFileType(file) {
  const ext = getFileExtension(file || '').toLowerCase();
  let type = null;
  if (ext === 'dbf' || ext === 'shp' || ext === 'prj' || ext === 'shx') {
    type = ext;
  } else if (/json$/.test(ext)) {
    type = 'json';
  } else if (ext === 'csv' || ext === 'tsv' || ext === 'txt' || ext === 'tab') {
    type = 'text';
  }
  return type;
}

export function getFileExtension(path) {
  return parseLocalPath(path).extension;
}

function parseLocalPath(path) {
  const obj = {};
  const sep = getPathSep(path);
  const parts = path.split(sep);

  if (parts.length === 1) {
    obj.filename = parts[0];
    obj.directory = '';
  } else {
    obj.filename = parts.pop();
    obj.directory = parts.join(sep);
  }

  const i = obj.filename.lastIndexOf('.');

  if (i > -1) {
    obj.extension = obj.filename.substr(i + 1);
    obj.basename = obj.filename.substr(0, i);
    obj.pathbase = path.substr(0, path.lastIndexOf('.'));
  } else {
    obj.extension = '';
    obj.basename = obj.filename;
    obj.pathbase = path;
  }
  return obj;
}

function getPathSep(path) {
  // TODO: improve
  return path.indexOf('/') === -1 && path.indexOf('\\') !== -1 ? '\\' : '/';
}

function importNewDataset(fileType, fileName, content) {
  const input = {};
  input[fileType] = {filename: fileName, content};

  if (fileType === 'shp') {
    // shx file should already be cached, if it was added together with the shp
    // input.shx =
    // cachedFiles[fileName.replace(/shp$/i, 'shx').toLowerCase()] || null;
  }

  return importContent(input);
}

/**
 *
 * @param {*} obj
 * @returns {object} {datasets: Array<Object>, config: object}
 */
function importContent(obj) {
  let fileFmt;
  let result;

  const dataset = {
    data: null,
    info: {}
  };

  if (obj.json) {
    // {filename: '', dataset: {}, format: 'geojson'}
    result = importJSON(obj.json);
    fileFmt = result.format;
    dataset.data = result.dataset;
    // internal.cleanPathsAfterImport(dataset);
  } else if (obj.text) {
    fileFmt = 'dsv';
    result = importDelim2(obj.text);
    dataset.data = result.records;
    dataset.info = result.info;
  }

  if (!dataset) {
    console.warn('Missing an expected input type');
  }

  // Add input filename and format to the dataset's 'info' object
  // (this is useful when exporting if format or name has not been specified.)
  if (result.filename) {
    dataset.info.inputFiles = [result.filename];
  }
  dataset.info.inputFormat = [fileFmt];

  return dataset;
}
