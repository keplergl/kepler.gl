import {initializeDuckDb} from './init';

export const keplerGlDuckDBPlugin = {
  async init() {
    await initializeDuckDb();
    console.log('kepler.gl DuckDB Plugin initialized');
  }
};
