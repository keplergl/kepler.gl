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

// from http://blog.stevenlevithan.com/archives/parseuri
/**
 * Allows to break down a url into multiple params
 * @param str
 */
export function parseUri(str) {
  const o = parseUri.options;
  const m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str);
  const uri = {};
  let i = 14;

  while (i--) uri[o.key[i]] = m[i] || '';

  uri[o.q.name] = {};
  uri[o.key[12]].replace(o.q.parser, ($0, $1, $2) => {
    if ($1) uri[o.q.name][$1] = $2;
  });

  return uri;
}

parseUri.options = {
  strictMode: false,
  key: [
    'source',
    'protocol',
    'authority',
    'userInfo',
    'user',
    'password',
    'host',
    'port',
    'relative',
    'path',
    'directory',
    'file',
    'query',
    'anchor'
  ],
  q: {
    name: 'queryKey',
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};
