// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {initApplicationConfig} from '@kepler.gl/utils';

import {loadSqlJs} from './sql-js';

describe('loadSqlJs', () => {
  test('uses the package loader in a production Node environment', async () => {
    const previousNodeEnv = process.env.NODE_ENV;
    const documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'document');
    process.env.NODE_ENV = 'production';
    Object.defineProperty(globalThis, 'document', {configurable: true, value: undefined});
    try {
      expect(typeof document).toBe('undefined');
      const SQL = await loadSqlJs();
      const db = new SQL.Database();
      db.run('CREATE TABLE places (name TEXT);');
      expect(db.exec("SELECT name FROM sqlite_master WHERE name = 'places'")[0].values).toEqual([
        ['places']
      ]);
      db.close();
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
      if (documentDescriptor) {
        Object.defineProperty(globalThis, 'document', documentDescriptor);
      }
    }
  });
});

describe('loadSqlJs in a browser', () => {
  let previousNodeEnv: string | undefined;

  beforeEach(() => {
    previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    delete (globalThis as {initSqlJs?: unknown}).initSqlJs;
  });

  afterEach(() => {
    process.env.NODE_ENV = previousNodeEnv;
    delete (globalThis as {initSqlJs?: unknown}).initSqlJs;
    document.head.querySelectorAll('script').forEach(script => script.remove());
    initApplicationConfig({sqlJsUrl: ''});
  });

  function freshLoadSqlJs(): typeof loadSqlJs {
    let load: typeof loadSqlJs = loadSqlJs;
    jest.isolateModules(() => {
      load = require('./sql-js').loadSqlJs;
    });
    return load;
  }

  test.each([
    ['', 'https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/'],
    ['https://example.com/assets/sql.js', 'https://example.com/assets/sql.js/'],
    ['/static/sql.js/', '/static/sql.js/']
  ])('loads sql.js and its wasm from sqlJsUrl "%s"', async (sqlJsUrl, baseUrl) => {
    initApplicationConfig({sqlJsUrl});
    const pending = freshLoadSqlJs()();

    const script = document.head.querySelector('script');
    expect(script?.getAttribute('src')).toBe(`${baseUrl}sql-wasm.js`);

    const init = jest.fn(async (config: {locateFile: (file: string) => string}) => ({
      wasm: config.locateFile('sql-wasm.wasm')
    }));
    (globalThis as {initSqlJs?: unknown}).initSqlJs = init;
    script?.dispatchEvent(new Event('load'));

    await expect(pending).resolves.toEqual({wasm: `${baseUrl}sql-wasm.wasm`});
  });
});
