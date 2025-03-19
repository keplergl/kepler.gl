// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export {DuckDBWasmAdapter} from './adapters/duckdb-wasm-adapter';
export {SqlPanel} from './components';
import {keplerGlDuckDBPlugin} from './plugin';
export {KeplerGlDuckDbTable} from './table/duckdb-table';
export default keplerGlDuckDBPlugin;
