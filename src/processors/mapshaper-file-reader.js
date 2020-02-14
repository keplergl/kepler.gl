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

const Buffer = require('buffer').Buffer; // works with browserify
import iconv from 'iconv-lite';
import {
  isNumber,
  isString,
  isArray,
  isInteger,
  isObject,
  stringLooksLikeJSON,
  contains
} from './mapshaper-utils';

const encodingIsUtf8 = enc => !enc || /^utf-?8$/i.test(String(enc));

const standardizeEncodingName = enc => {
  return (enc || '').toLowerCase().replace(/[_-]/g, '');
};

const getNativeDecoder = enc => {
  var decoder = null;
  enc = standardizeEncodingName(enc);
  if (enc !== 'utf8') {
    // TODO: support more encodings if TextDecoder is available
    return null;
  }
  if (typeof TextDecoder !== 'undefined') {
    decoder = new TextDecoder(enc);
  }
  return buf => (decoder ? decoder.decode(buf) : buf.toString(enc));
};



export const decodeString = (function inner() {
  var fromUtf8 = getNativeDecoder('utf8');
  // @buf a Node Buffer
  return (buf, enc) => {
    var str;
    if (encodingIsUtf8(enc)) {
      str = fromUtf8(buf);
    } else {
      str = iconv.decode(buf, enc);
    }
    return str;
  };
})();

export function bufferToString(buf, enc, start, end) {
  if (start >= 0) {
    buf = buf.slice(start, end);
  }
  return decodeString(buf, enc);
};

export function BufferReader(src) {
  const bufSize = src.byteLength || src.length;
  let binArr;
  let buf;

  this.readToBinArray = (start, length) => {
    if (bufSize < start + length) {
      throw new Error('Out-of-range error');
    }
    if (!binArr) binArr = new BinArray(src);
    binArr.position(start);
    return binArr;
  };

  this.toString = enc => {
    return bufferToString(buffer(), enc);
  };

  this.readSync = (start, length) => {
    // TODO: consider using a default length like FileReader
    return buffer().slice(start, length || bufSize);
  };

  function buffer() {
    if (!buf) {
      buf = src instanceof ArrayBuffer ? createBuffer(src) : src;
    }
    return buf;
  }

  this.findString = FileReader.prototype.findString;
  this.expandBuffer = function expandBuffer() {
    return this;
  };
  this.size = function size() {
    return bufSize;
  };
  this.close = function close() {};
}

export function createBuffer(arg, arg2) {
  if (isInteger(arg)) {
    return Buffer.allocUnsafe ? Buffer.allocUnsafe(arg) : new Buffer(arg);
  }
  // check allocUnsafe to make sure Buffer.from() will accept strings (it didn't before Node v5.10)
  return Buffer.from && Buffer.allocUnsafe
    ? Buffer.from(arg, arg2)
    : new Buffer(arg, arg2);
};

// Identify the most common encodings that are supersets of ascii at the
// single-byte level (meaning that bytes in 0 - 0x7f range must be ascii)
// (this allows identifying line breaks and other ascii patterns in buffers)
export function encodingIsAsciiCompat(enc) {
  enc = standardizeEncodingName(enc);
  // gb.* selects the Guo Biao encodings
  // big5 in not compatible -- second byte starts at 0x40
  return !enc || /^(win|latin|utf8|ascii|iso88|gb)/.test(enc);
};
export function readFirstChars(reader, n) {
  return bufferToString(reader.readSync(0, Math.min(n || 1000, reader.size())));
}

// Wrapper for DataView class for more convenient reading and writing of
//   binary data; Remembers endianness and read/write position.
// Has convenience methods for copying from buffers, etc.
//
export function BinArray(buf, le) {
  if (isNumber(buf)) {
    buf = new ArrayBuffer(buf);
  } else if (typeof Buffer === 'function' && buf instanceof Buffer) {
    // Since node 0.10, DataView constructor doesn't accept Buffers,
    //   so need to copy Buffer to ArrayBuffer
    buf = BinArray.toArrayBuffer(buf);
  }
  if (buf instanceof ArrayBuffer === false) {
    return new Error(
      'BinArray constructor takes an integer, ArrayBuffer or Buffer argument'
    );
  }
  this._buffer = buf;
  this._bytes = new Uint8Array(buf);
  this._view = new DataView(buf);
  this._idx = 0;
  this._le = le !== false;
}
