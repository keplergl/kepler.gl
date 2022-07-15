// Copyright (c) 2022 Uber Technologies, Inc.
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

const fs = require('fs');
const resolve = require('path').resolve;
const BrowserTestDriver = require('@probe.gl/test-utils').BrowserTestDriver;

const configPath = resolve(__dirname, './webpack.config.js');
const myArgs = process.argv.slice(2);
const debug = myArgs.length && myArgs[0] === 'debug';

function getExecutablePath(dir) {
  try {
    const puppeteer = require(dir ? `${dir}/node_modules/puppeteer` : 'puppeteer');
    const executablePath = puppeteer.executablePath();
    if (fs.existsSync(executablePath)) {
      return executablePath;
    }
  } catch (err) {
    // ignore
  }
  return null;
}

function getOptions(opt) {
  const entryPath = opt.debug
    ? resolve(__dirname, './browser-debug.js')
    : resolve(__dirname, './browser-headless.js');
  const headless = !opt.debug;

  const options = {
    server: {
      command: 'webpack-dev-server',
      arguments: ['--entry', entryPath, '--config', configPath, '--env.mode=test']
    },
    browser: {
      defaultViewport: {width: 1200, height: 800}
    },
    headless,
    executablePath: getExecutablePath()
  };

  return options;
}

const options = getOptions({debug});
const browserTest = new BrowserTestDriver();
browserTest.run(options);
