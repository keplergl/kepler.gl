// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* setup.js */
import {JSDOM, VirtualConsole} from 'jsdom';
import global from 'global';

const nop = () => {};

const virtualConsole = new VirtualConsole();
virtualConsole.sendTo(console);

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  // JSDom 11.12 causes SecurityError: localStorage is not available for opaque origins
  // https://github.com/jsdom/jsdom/issues/2304
  url: 'http://localhost',
  virtualConsole
});
const {window} = dom;

// Mock canvas with headless-gl for WebGL contexts
const createGLContext = require('gl');

function mockCanvas(globalWindow) {
  globalWindow.HTMLCanvasElement.prototype.getContext = function mockGetContext(
    contextType,
    attrs
  ) {
    if (contextType === 'webgl' || contextType === 'webgl2') {
      try {
        return createGLContext(this.width || 1, this.height || 1, attrs);
      } catch (e) {
        return null;
      }
    }
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

window.URL.createObjectURL = () => {};

// Set globals BEFORE importing deck.gl test utils
global.window = window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;
global.Element = window.Element;
global.fetch = window.fetch;
global.navigator = {
  userAgent: 'node.js',
  platform: 'mac',
  appName: 'kepler.gl'
};

// Tell @probe.gl/env isBrowser() to return true so luma.gl uses document.createElement
// instead of creating a fake canvas object without getContext
process.browser = true;

// Now import deck.gl test-utils — luma.gl will use our JSDOM canvas mock with headless-gl
const {gl} = require('@deck.gl/test-utils');

// Create a dummy canvas for the headless gl context
const canvas = global.document.createElement('canvas');
if (gl && typeof gl === 'object') {
  canvas.width = gl.drawingBufferWidth;
  canvas.height = gl.drawingBufferHeight;
  gl.canvas = canvas;
}

Object.keys(global.window).forEach(property => {
  if (typeof global[property] === 'undefined') {
    global[property] = global.window[property];
  }
});

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
