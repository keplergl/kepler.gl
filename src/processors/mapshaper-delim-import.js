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

import {default as Console} from 'global/console';

import {isString, regexEscape, contains} from './mapshaper-utils';

import {
  BufferReader,
  encodingIsAsciiCompat,
  readFirstChars,
  decodeString
} from './mapshaper-file-reader';

export const supportedDelimiters = ['|', '\t', ',', ';'];

// Convert a string, buffer or file containing delimited text into a dataset obj.
// eslint-disable-next-line max-statements
export function importDelim2(data, opts = {}) {
  // TODO: remove duplication with importJSON()
  let readFromFile = !data.content && data.content !== '';
  let content = data.content;
  let reader;
  let records;
  let delimiter;

  // // read content of all but very large files into a buffer
  // if (readFromFile && cli.fileSize(data.filename) < 2e9) {
  //   content = cli.readFile(data.filename);
  //   readFromFile = false;
  // }

  if (readFromFile) {
    // try to read data incrementally from file, if content is missing
    reader = new FileReader(data.filename);
  } else if (content instanceof ArrayBuffer || content instanceof Buffer) {
    // Web API may import as ArrayBuffer, to support larger files
    reader = new BufferReader(content);
    content = null;
  } else if (isString(content)) {
    // import as string
  } else {
    throw new Error('Unexpected object type');
  }

  if (reader && !encodingIsAsciiCompat(opts.encoding)) {
    // Currently, incremental reading assumes ascii-compatible data.
    // Incompatible encodings must be parsed as strings.
    content = reader.toString(opts.encoding);
    reader = null;
  }

  if (reader) {
    delimiter = guessDelimiter(readFirstChars(reader, 2000));
    records = readDelimRecords(reader, delimiter, opts);
  } else {
    delimiter = guessDelimiter(content);
    records = readDelimRecordsFromString(content, delimiter, opts);
  }
  if (records.length === 0) {
    Console.warn('Unable to read any data records');
  }

  if (!isSupportedDelimiter(delimiter)) {
    throw new Error(`Unexpected delimiter: ${delimiter}`);
  }

  return {
    // layers: [{data: table}],
    records,
    info: {input_delimiter: delimiter},
    filename: data.filename
  };
}

function isSupportedDelimiter(d) {
  return contains(supportedDelimiters, d);
}

function guessDelimiter(content) {
  return (
    find(supportedDelimiters, delim => {
      var rxp = getDelimiterRxp(delim);
      return rxp.test(content);
    }) || ','
  );
}

// Get RegExp to test for a delimiter before first line break of a string
// Assumes that the first line does not contain alternate delim chars (this will
// be true if the first line has field headers composed of word characters).
function getDelimiterRxp(delim) {
  var rxp = `^[^\\n\\r]+${regexEscape(delim)}`;
  return new RegExp(rxp);
}

// Wraps a BufferReader or FileReader with an API that keeps track of position in the file
function Reader2(reader) {
  var offs = 0; // read-head position in bytes

  this.position = () => offs;

  this.remaining = () => Math.max(reader.size() - offs, 0);

  this.advance = i => (offs += i);

  this.readSync = () => reader.readSync(offs);

  this.expandBuffer = () => reader.expandBuffer();
}

function readDelimRecords(reader, delim, opts = {}) {
  var reader2 = new Reader2(reader);
  const headerStr = readLinesAsString(
    reader2,
    getDelimHeaderLines(opts),
    opts.encoding
  );
  const header = parseDelimHeaderSection(headerStr, delim, opts);
  const convertRowArr = getRowConverter(header.import_fields);
  const batchSize = opts.batch_size || 1000;
  const records = [];
  let str;
  let batch;
  if (header.import_fields.length === 0) return []; // e.g. empty file
  // read in batches (faster than line-by-line)
  while ((str = readLinesAsString(reader2, batchSize, opts.encoding))) {
    batch = parseDelimText(
      str,
      delim,
      convertRowArr,
      header.column_filter || false,
      header.row_filter || false
    );

    records.push(...batch);
    if (opts.csv_lines && records.length >= opts.csv_lines) {
      return records.slice(0, opts.csv_lines);
    }
  }

  return records;
}

// Fallback for readDelimRecords(), for encodings that do not use ascii values
// for delimiter characters and newlines. Input size is limited by the maximum
// string size.
function readDelimRecordsFromString(str, delim, opts) {
  const header = parseDelimHeaderSection(str, delim, opts);
  if (header.import_fields.length === 0 || !header.remainder) return [];
  const convert = getRowConverter(header.import_fields);
  let records = parseDelimText(
    header.remainder,
    delim,
    convert,
    header.column_filter,
    header.row_filter
  );
  if (opts.csv_lines > 0) {
    // TODO: don't parse unneeded rows
    records = records.slice(0, opts.csv_lines);
  }
  return records;
}

function indexOfLine(str, nth) {
  var rxp = /\r\n|[\r\n]|.$/g; // dot prevents matching end of string twice
  var i = 1;
  if (nth === 1) return 0;
  if (nth > 1 === false) return -1;
  while (rxp.exec(str)) {
    i++;
    if (i < nth === false) return rxp.lastIndex;
  }
  return -1;
}

function parseDelimHeaderSection(str, delim) {
  const nodata = {headers: [], import_fields: []};
  const retn = {};
  str = str || '';

  const i = indexOfLine(str, 2);
  if (i === -1) return nodata;
  retn.headers = parseDelimText(str.slice(0, i), delim)[0];
  str = str.substr(i);

  retn.import_fields = retn.headers;
  retn.remainder = str;
  return retn;
}

/**
 * build row object
 * @param {*} fields
 */
function getRowConverter(fields) {
  return arr =>
    fields.reduce((accu, name, i) => {
      accu[name] = arr[i] || '';
      return accu;
    }, {});
}

function readLinesAsString(reader, lines, encoding) {
  var buf = reader.readSync();
  var retn = readLinesFromBuffer(buf, lines);
  var str;
  if (retn.bytesRead === buf.length && retn.bytesRead < reader.remaining()) {
    // buffer overflow -- enlarge buffer and read lines again
    reader.expandBuffer();
    return readLinesAsString(reader, lines, encoding);
  }
  // str = retn.bytesRead > 0 ? retn.buffer.toString('ascii', 0, retn.bytesRead) : '';
  str = retn.bytesRead > 0 ? decodeString(retn.buffer, encoding) : '';
  if (reader.position() === 0) {
    str = trimBOM(str);
  }
  reader.advance(retn.bytesRead);
  return str;
}

function readLinesFromBuffer(buf, linesToRead) {
  const CR = 13;
  const LF = 10;
  const DQUOTE = 34;
  const bufLen = buf.length;

  let inQuotedText = false;
  let lineCount = 0;
  let i;
  let c;

  lineCount++;
  for (i = 0; i < bufLen && lineCount <= linesToRead; i++) {
    c = buf[i];
    if (c === DQUOTE) {
      inQuotedText = !inQuotedText;
    } else if (c === CR || c === LF) {
      if (c === CR && i + 1 < bufLen && buf[i + 1] === LF) {
        // first half of CRLF pair: advance one byte
        i++;
      }
      lineCount++;
    }
  }
  return {
    bytesRead: i,
    buffer: buf.slice(0, i)
  };
}

function getDelimHeaderLines(opts) {
  var skip = opts.csv_skip_lines || 0;
  if (!opts.csv_field_names) skip++;
  return skip;
}

function trimBOM(str) {
  // remove BOM if present
  if (str.charCodeAt(0) === 0xfeff) {
    str = str.substr(1);
  }
  return str;
}

function parseDelimText(text, delim, convert, colFilter, rowFilter) {
  const CR = 13;
  const LF = 10;
  const DQUOTE = 34;
  const DELIM = delim.charCodeAt(0);
  const records = [];
  let inQuotedText = false;
  let capturing = false;
  let srcCol = -1;
  let fieldStart;
  let i;
  let c;
  let len;
  let record;

  if (!convert) convert = d => d;

  function endLine() {
    var rec = convert ? convert(record) : record;
    if (!rowFilter || rowFilter(rec)) records.push(rec);
    srcCol = -1;
  }

  function startFieldAt(j) {
    fieldStart = j;
    srcCol++;
    if (srcCol === 0) record = [];
    if (!colFilter || colFilter(srcCol)) {
      capturing = true;
    }
  }

  function captureField(start, end) {
    var s;
    if (!capturing) return;
    capturing = false;
    if (start === end) {
      s = '';
    } else if (text.charCodeAt(start) === DQUOTE) {
      s = text.slice(start + 1, end - 1).replace(/""/g, '"');
    } else {
      s = text.slice(start, end);
    }
    record.push(s);
  }

  startFieldAt(0);
  for (i = 0, len = text.length; i < len; i++) {
    c = text.charCodeAt(i);
    if (c === DQUOTE) {
      inQuotedText = !inQuotedText;
    } else if (inQuotedText) {
      //
    } else if (c === DELIM) {
      captureField(fieldStart, i);
      startFieldAt(i + 1);
    } else if (c === CR || c === LF) {
      captureField(fieldStart, i);
      endLine();
      if (c === CR && text.charCodeAt(i + 1) === LF) {
        i++; // first half of CRLF pair; skip a char
      }
      if (i + 1 < len) startFieldAt(i + 1);
    }
  }

  if (srcCol > -1) {
    // finish last line (if file ends without newline)
    if (capturing) captureField(fieldStart, i);
    endLine();
  }

  return records;
}
