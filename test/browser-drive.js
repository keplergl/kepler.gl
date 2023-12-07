// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

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

  // eslint-disable-next-line no-console
  console.log(options);
  return options;
}

function runBrowserTest() {
  const options = getOptions({debug});
  return new BrowserTestDriver().run(options);
}

runBrowserTest();
