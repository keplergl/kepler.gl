// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

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
