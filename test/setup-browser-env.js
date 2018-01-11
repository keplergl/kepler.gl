/* setup.js */
import 'babel-polyfill';

import {JSDOM} from 'jsdom';
import global from 'global';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
const {window} = dom;

global.window = window;
global.document = window.document;

Object.keys(global.window).forEach(property => {
  if (typeof global[property] === 'undefined') {
    global[property] = global.window[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};
