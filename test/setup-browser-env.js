// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* setup.js */
import {JSDOM, VirtualConsole} from 'jsdom';
import global from 'global';
const {gl} = require('@deck.gl/test-utils');

const virtualConsole = new VirtualConsole();
virtualConsole.sendTo(console);

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  // JSDom 11.12 causes SecurityError: localStorage is not available for opaque origins
  // https://github.com/jsdom/jsdom/issues/2304
  url: 'http://localhost',
  virtualConsole
});
const {window} = dom;
mockCanvas(window);

// // issue: https://github.com/chromaui/chromatic-cli/issues/14
Object.defineProperty(window, 'fetch', {
  value: () =>
    new Promise(() => {
      // we just let this never resolve
    }),
  writable: true
});

Object.defineProperty(window, 'prompt', {
  value: () => {},
  writable: true
});

// TODO: This should be the right wat to mock matchMedia but matchMedia was still undefined so I moved to another way to mock it

// Object.defineProperty(window, 'matchMedia', {
//   value: () => ({
//       matches: false,
//       addListener: function() {},
//       removeListener: function() {}
//   }),
//   writable: true
// });
window.matchMedia = () => {
  return {
    matches: false,
    addListener: () => {},
    removeListener: () => {}
  };
};

function mockClipboardData() {
  let data = null;
  const obj = {};
  obj.data = () => {
    return data;
  };

  obj.setData = (format, text) => {
    data = {format, text};
  };
  obj.clearData = () => {};

  return obj;
}

Object.defineProperty(window, 'clipboardData', {
  value: mockClipboardData(),
  writable: true
});

// These do not seem to be present under jsdom v16, even though the documentation suggests that should be the case
[
  'addEventListener',
  'removeEventListener',
  'dispatchEvent',
  'requestAnimationFrame',
  'cancelAnimationFrame'
].forEach(prop => {
  window[prop] = () => {};
});

const nop = () => {};

function mockCanvas(globalWindow) {
  globalWindow.HTMLCanvasElement.prototype.getContext = function mockGetContext() {
    return {
      fillRect: nop,
      clearRect: nop,
      getImageData: (x, y, w, h) => ({
        data: new Array(w * h * 4)
      }),
      putImageData: nop,
      createImageData: () => [],
      setTransform: nop,
      drawImage: nop,
      save: nop,
      fillText: nop,
      restore: nop,
      beginPath: nop,
      moveTo: nop,
      lineTo: nop,
      closePath: nop,
      stroke: nop,
      translate: nop,
      scale: nop,
      rotate: nop,
      arc: nop,
      fill: nop,
      measureText: () => ({width: 0}),
      transform: nop,
      rect: nop,
      clip: nop
    };
  };

  globalWindow.HTMLCanvasElement.prototype.toDataURL = () => '';
}

window.URL.createObjectURL = () => {};

global.window = window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;
global.Element = window.Element;
global.fetch = window.fetch;

// Create a dummy canvas for the headless gl context
const canvas = global.document.createElement('canvas');
canvas.width = gl.drawingBufferWidth;
canvas.height = gl.drawingBufferHeight;
gl.canvas = canvas;

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

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}

  disconnect() {
    return null;
  }

  observe() {
    return null;
  }

  takeRecords() {
    return null;
  }

  unobserve() {
    return null;
  }
};

// Undefined once bumped to node v18 in @floating-ui
global.Node = global.Node || (() => {});
