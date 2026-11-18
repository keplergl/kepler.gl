// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {SqlJsStatic} from 'sql.js';
import {getApplicationConfig} from '@kepler.gl/utils';

/** Keep in sync with the sql.js dependency in package.json. */
const SQL_JS_VERSION = '1.13.0';
const SQL_JS_CDN = `https://cdn.jsdelivr.net/npm/sql.js@${SQL_JS_VERSION}/dist/`;

let sqlPromise: Promise<SqlJsStatic> | null = null;

type InitSqlJs = (config?: {locateFile?: (file: string) => string}) => Promise<SqlJsStatic>;

/**
 * Load sql.js once.
 * Tests import the package, which reads the wasm from disk. The browser build
 * of that package calls Node's fs/path/crypto, so the demo bundle loads the
 * script from `sqlJsUrl` in the application config, or from a CDN, instead of
 * importing it.
 */
export function loadSqlJs(): Promise<SqlJsStatic> {
  if (!sqlPromise) {
    const pending = (
      process.env.NODE_ENV === 'test' || typeof document === 'undefined'
        ? loadSqlJsFromPackage()
        : loadSqlJsFromUrl()
    ).catch(error => {
      sqlPromise = null;
      throw error;
    });
    sqlPromise = pending;
  }
  return sqlPromise;
}

async function loadSqlJsFromPackage(): Promise<SqlJsStatic> {
  // Non-literal so browser bundlers do not pull in sql-wasm.js (it requires fs).
  const specifier = 'sql.js';
  const sqlModule = (await import(specifier)) as {default: InitSqlJs};
  return sqlModule.default();
}

function sqlJsBaseUrl(): string {
  const configured = getApplicationConfig().sqlJsUrl;
  if (!configured) {
    return SQL_JS_CDN;
  }
  return configured.endsWith('/') ? configured : `${configured}/`;
}

function loadSqlJsFromUrl(): Promise<SqlJsStatic> {
  const baseUrl = sqlJsBaseUrl();
  const locateFile = (file: string) => `${baseUrl}${file}`;
  const existing = (globalThis as {initSqlJs?: InitSqlJs}).initSqlJs;
  if (existing) {
    return existing({locateFile});
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${baseUrl}sql-wasm.js`;
    script.async = true;
    script.onload = () => {
      const init = (globalThis as {initSqlJs?: InitSqlJs}).initSqlJs;
      if (!init) {
        reject(new Error('sql.js failed to initialize'));
        return;
      }
      resolve(init({locateFile}));
    };
    script.onerror = () => reject(new Error('Failed to load sql.js'));
    document.head.appendChild(script);
  });
}
