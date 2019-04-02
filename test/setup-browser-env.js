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

/* setup.js */
import {JSDOM} from 'jsdom';
import global from 'global';

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  // JSDom 11.12 causes SecurityError: localStorage is not available for opaque origins
  // https://github.com/jsdom/jsdom/issues/2304
  url: 'http://localhost'
});
const {window} = dom;

global.window = window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;

Object.keys(global.window).forEach(property => {
  if (typeof global[property] === 'undefined') {
    global[property] = global.window[property];
  }
});

global.navigator = {
  userAgent: 'node.js',
  platform: 'mac',
  appName: 'kepler.gl'
};
