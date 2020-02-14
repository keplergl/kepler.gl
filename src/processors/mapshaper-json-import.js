/* eslint-disable max-statements */
/* eslint-disable complexity */
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

import {FileReader} from 'global/window';

import {
  isNumber,
  isString,
  isArray,
  isInteger,
  isObject,
  stringLooksLikeJSON,
  contains
} from './mapshaper-utils';

import {
  BufferReader,
  readFirstChars,
  bufferToString,
  createBuffer
} from './mapshaper-file-reader';

FileReader.prototype.findString = function findString(str, maxLen) {
  const len = Math.min(this.size(), maxLen || this.size());
  const buf = this.readSync(0, len);
  const strLen = str.length;
  const n = buf.length - strLen;
  const firstByte = str.charCodeAt(0);
  let i;
  for (i = 0; i < n; i++) {
    if (buf[i] === firstByte && buf.toString('utf8', i, i + strLen) === str) {
      return {
        offset: i + strLen,
        text: buf.toString('utf8', 0, i)
      };
    }
  }
  return null;
};

const GeoJSON = {};

GeoJSON.supportedGeometries = {
  LineString: true,
  MultiLineString: true,
  Polygon: true,
  MultiPolygon: true,
  Point: true,
  MultiPoint: true
};

function FeatureImporter(opts) {
  const features = [];

  // mix in #addPoint() and #endPath() methods
  // extend(this, new PathImportStream(importPathCoords));
  this.importFeature = o => {
    features.push(o);
  };

  // Return imported dataset
  // Apply any requested snapping and rounding
  // Remove duplicate points, check for ring inversions
  //
  this.done = () => {
    return {
      type: 'FeatureCollection',
      features
    };
  };
}

const identifyJSONString = (str, opts) => {
  var maxChars = 1000;
  var fmt = null;
  if (str.length > maxChars) str = str.substr(0, maxChars);
  str = str.replace(/\s/g, '');
  if (opts && opts.json_path) {
    fmt = 'json'; // TODO: make json_path compatible with other types
  } else if (/^\[[{\]]/.test(str)) {
    // empty array or array of objects
    fmt = 'json';
  } else if (/"arcs":\[|"objects":\{|"transform":\{/.test(str)) {
    fmt = 'topojson';
  } else if (/^\{"/.test(str)) {
    fmt = 'geojson';
  }
  return fmt;
};

function GeoJSONParser(opts = {}) {
  const importer = new FeatureImporter(opts);

  this.parseObject = function inner(o) {
    importer.importFeature(o);
  };

  this.done = () => {
    return importer.done();
  };
}

export function importGeoJSONFile(fileReader, opts) {
  var importer = new GeoJSONParser(opts);
  new GeoJSONReader(fileReader).readObjects(importer.parseObject);
  return importer.done();
}

export function importJSONFile(reader, opts) {
  const str = readFirstChars(reader, 1000);
  const type = identifyJSONString(str, opts);
  let dataset;
  let retn;

  if (type === 'geojson') {
    // consider only for larger files
    dataset = importGeoJSONFile(reader, opts);
    retn = {
      dataset,
      format: 'geojson'
    };
  } else {
    retn = {
      // content: cli.readFile(path, 'utf8')}
      content: reader.toString('utf8')
    };
  }
  reader.close();
  return retn;
}

function GeoJSONReader(reader) {
  // Read objects synchronously, with callback
  this.readObjects = function inner(onObject) {
    // Search first x bytes of file for features|geometries key
    // 300 bytes not enough... GeoJSON files can have additional non-standard properties, e.g. 'metadata'
    // var bytesToSearch = 300;
    var bytesToSearch = 5000;
    var start =
      reader.findString('"features"', bytesToSearch) ||
      reader.findString('"geometries"', bytesToSearch);
    // Assume single Feature or geometry if collection not found
    var offset = start ? start.offset : 0;
    readObjects(offset, onObject);
  };

  this.readObject = readObject;

  function readObjects(offset, cb) {
    var obj = readObject(offset);
    var json;
    while (obj) {
      try {
        json = JSON.parse(obj.text);
      } catch (e) {
        stop(
          'JSON parsing error --',
          adjustPositionMessage(e.message, offset + obj.start)
        );
      }

      cb(json);
      offset = obj.end;
      obj = readObject(obj.end);
    }
  }

  // msg: JSON.parse() error message, e.g. "Unexpected token . in JSON at position 579"
  // offset: start position of the parsed text in the JSON file
  function adjustPositionMessage(msg, offset) {
    var rxp = /position (\d+)/; // assumes no thousands separator in error message
    var match = rxp.exec(msg);
    if (match) {
      msg = msg.replace(rxp, 'position ' + (offset + parseInt(match[1])));
    }
    return msg;
  }

  // Search for a JSON object starting at position @offs
  // Returns {text: "<object>", offset: <offset>} or null
  //   <offset> is the file position directly after the object's closing brace
  // Skips characters in front of first left curly brace
  // eslint-disable-next-line max-statements
  function readObject(offs) {
    const LBRACE = 123;
    const RBRACE = 125;
    const RBRACK = 93;
    const BSLASH = 92;
    const DQUOTE = 34;
    let level = 0;
    let inString = false;
    let escapeNext = false;
    let buf = reader.readSync(offs);
    let retn = null;
    let startPos;
    let i;
    let n;
    let c;
    for (i = 0, n = buf.length; i < n; i++) {
      c = buf[i];
      if (inString) {
        if (escapeNext) {
          escapeNext = false;
        } else if (c === DQUOTE) {
          inString = false;
        } else if (c === BSLASH) {
          escapeNext = true;
        }
      } else if (c === DQUOTE) {
        inString = true;
      } else if (c === LBRACE) {
        if (level === 0) {
          startPos = i;
        }
        level++;
      } else if (c === RBRACE) {
        level--;
        if (level === 0) {
          retn = {
            text: bufferToString(buf, 'utf8', startPos, i + 1),
            start: startPos,
            end: offs + i + 1
          };
          break;
        } else if (level === -1) {
          break; // error -- "}" encountered before "{"
        }
      } else if (c === RBRACK && level === 0) {
        break; // end of collection
      }
      if (i === n - 1) {
        buf = reader.expandBuffer().readSync(offs);
        n = buf.length;
      }
    }
    return retn;
  }
}

const identifyJSONObject = o => {
  let fmt = null;
  if (!o) {
    //
  } else if (o.type === 'Topology') {
    fmt = 'topojson';
  } else if (o.type) {
    fmt = 'geojson';
  } else if (Array.isArray(o) || o.json_path) {
    fmt = 'json';
  }
  return fmt;
};

const importGeoJSON = (src, optsArg) => {
  const opts = optsArg || {};
  const supportedGeometries = Object.keys(GeoJSON.supportedGeometries);
  const srcObj = isString(src) ? JSON.parse(src) : src;
  const importer = new GeoJSONParser(opts);
  let srcCollection;
  let dataset = null;

  // Convert single feature or geometry into a collection with one member
  if (srcObj.type === 'Feature') {
    srcCollection = {
      type: 'FeatureCollection',
      features: [srcObj]
    };
  } else if (contains(supportedGeometries, srcObj.type)) {
    srcCollection = {
      type: 'GeometryCollection',
      geometries: [srcObj]
    };
  } else {
    srcCollection = srcObj;
  }
  (srcCollection.features || srcCollection.geometries || []).forEach(
    importer.parseObject
  );

  dataset = importer.done();
  return dataset;
};

export function importJSON(data) {
  const {filename} = data;
  const retn = {filename};
  let reader;
  let content = data.content;

  if (!content) {
    reader = new FileReader(filename);
  } else if (content instanceof ArrayBuffer) {
    // Web API imports JSON as ArrayBuffer, to support larger files
    if (content.byteLength < 1e7) {
      content = bufferToString(createBuffer(content));
    } else {
      reader = new BufferReader(content);
      content = null;
    }
  }

  if (reader) {
    data = importJSONFile(reader);
    if (data.dataset) {
      retn.dataset = data.dataset;
      retn.format = data.format;
    } else {
      content = data.content;
    }
  }

  if (content) {
    if (isString(content)) {
      try {
        content = JSON.parse(content); // ~3sec for 100MB string
      } catch (e) {
        // stop("Unable to parse JSON");
        stop('JSON parsing error --', e.message);
      }
    }

    retn.format = identifyJSONObject(content);

    if (retn.format === 'topojson') {
      // retn.dataset = importTopoJSON(content);
    } else if (retn.format === 'geojson') {
      retn.dataset =
        importGeoJSON(content);
    } else if (retn.format === 'json') {
      // retn.dataset = importJSONTable(content);
    } else {
      stop('Unknown JSON format');
    }
  }

  return retn;
}
