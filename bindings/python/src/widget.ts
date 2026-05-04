// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createRoot, Root} from 'react-dom/client';
import React from 'react';
import {Provider} from 'react-redux';
import {createStore, KEPLER_ID} from './store';
import {App} from './components/App';
import {processDataset} from './utils/data';
import type {WidgetModel, DatasetPayload} from './types';
import type {AddDataToMapPayload} from '@kepler.gl/types';
import {addDataToMap, wrapTo} from '@kepler.gl/actions';
import KeplerGlSchema from '@kepler.gl/schemas';

const DEBUG = false;
function debug(...args: unknown[]) {
  if (DEBUG) {
    console.log('[keplergl-widget]', ...args);
  }
}

export class KeplerGlWidget {
  private model: WidgetModel;
  private el: HTMLElement;
  private root: Root | null = null;
  private store: ReturnType<typeof createStore>;
  private previousConfigHash = '';
  private mapUpdateCounter = 0;
  private isSyncingConfig = false;
  private loadedDatasetHashes: Map<string, string> = new Map();

  constructor(model: WidgetModel, el: HTMLElement) {
    debug('KeplerGlWidget constructor');
    this.model = model;
    this.el = el;
    this.store = createStore();
  }

  mount() {
    debug('mount() called');
    this.el.style.height = `${this.model.get('height')}px`;
    this.root = createRoot(this.el);
    this.root.render(
      React.createElement(Provider, {
        store: this.store,
        children: React.createElement(App, {model: this.model})
      })
    );

    this.loadInitial();
    this.store.subscribe(() => this.syncConfigToPython());
  }

  unmount() {
    debug('unmount() called');
    this.root?.unmount();
    this.root = null;
  }

  onDataChange() {
    debug('onDataChange() called');
    this.loadData();
  }

  onConfigChange() {
    debug('onConfigChange() called');
    const config = this.model.get('config');
    const hash = JSON.stringify(config);
    // Avoid re-applying config that was just synced from the store
    if (hash === this.previousConfigHash) {
      debug('onConfigChange: config matches store, skipping');
      return;
    }
    this.loadConfig();
  }

  onHeightChange() {
    this.el.style.height = `${this.model.get('height')}px`;
  }

  private async loadInitial() {
    const data = this.model.get('data');
    const config = this.model.get('config');
    debug(
      'loadInitial() called, data keys:',
      Object.keys(data),
      'has config:',
      !!(config && Object.keys(config).length)
    );

    await this.waitForInstance();

    const datasets = await this.processAllDatasets(data);

    if (datasets.length > 0 || (config && Object.keys(config).length > 0)) {
      const hasMapState = !!config?.config?.mapState;
      const payload: Record<string, unknown> = {
        datasets,
        options: {centerMap: !hasMapState, readOnly: false}
      };
      if (config && Object.keys(config).length > 0) {
        payload.config = config;
        this.previousConfigHash = JSON.stringify(config);
      }
      const action = addDataToMap(payload as AddDataToMapPayload);
      this.store.dispatch(wrapTo(KEPLER_ID, action));
      for (const [name, dataPayload] of Object.entries(data)) {
        this.loadedDatasetHashes.set(name, JSON.stringify(dataPayload));
      }
      debug('loadInitial: dispatched addDataToMap with datasets + config');
    }
  }

  private async loadData() {
    const data = this.model.get('data');
    debug('loadData() called, data keys:', Object.keys(data));

    await this.waitForInstance();

    const currentNames = new Set(Object.keys(data));

    for (const prevName of this.loadedDatasetHashes.keys()) {
      if (!currentNames.has(prevName)) {
        this.loadedDatasetHashes.delete(prevName);
        debug(`Dataset '${prevName}' removed`);
      }
    }

    for (const [name, payload] of Object.entries(data)) {
      const hash = JSON.stringify(payload);
      if (this.loadedDatasetHashes.get(name) === hash) {
        continue;
      }
      debug(`Processing dataset '${name}'...`);
      try {
        const processed = await processDataset(payload as DatasetPayload);
        if (!processed) {
          debug(`Dataset '${name}' returned null, skipping`);
          continue;
        }
        const action = addDataToMap({
          datasets: {
            info: {id: name, label: name},
            data: processed
          },
          options: {centerMap: true, readOnly: false, keepExistingConfig: true}
        } as AddDataToMapPayload);
        this.store.dispatch(wrapTo(KEPLER_ID, action));
        this.loadedDatasetHashes.set(name, hash);
        debug(`Dataset '${name}' dispatched`);
      } catch (error) {
        console.error(`[keplergl-widget] Error processing dataset '${name}':`, error);
      }
    }
  }

  private async processAllDatasets(
    data: Record<string, DatasetPayload>
  ): Promise<Array<{info: {id: string; label: string}; data: unknown}>> {
    const datasets: Array<{info: {id: string; label: string}; data: unknown}> = [];
    for (const [name, payload] of Object.entries(data)) {
      debug(`Processing dataset '${name}'...`);
      try {
        const processed = await processDataset(payload as DatasetPayload);
        if (!processed) {
          debug(`Dataset '${name}' returned null, skipping`);
          continue;
        }
        datasets.push({
          info: {id: name, label: name},
          data: processed
        });
        debug(`Dataset '${name}' processed successfully`);
      } catch (error) {
        console.error(`[keplergl-widget] Error processing dataset '${name}':`, error);
      }
    }
    return datasets;
  }

  private waitForInstance(): Promise<void> {
    return new Promise(resolve => {
      const checkInstance = () => {
        const state = this.store.getState() as {keplerGl?: Record<string, unknown>};
        if (state.keplerGl && state.keplerGl[KEPLER_ID]) {
          debug('Instance registered:', KEPLER_ID);
          resolve();
          return true;
        }
        return false;
      };

      // Check immediately
      if (checkInstance()) return;

      // Otherwise subscribe and wait
      const unsubscribe = this.store.subscribe(() => {
        if (checkInstance()) {
          unsubscribe();
        }
      });

      // Timeout after 5 seconds
      setTimeout(() => {
        unsubscribe();
        console.warn('[keplergl-widget] Timeout waiting for instance registration');
        resolve();
      }, 5000);
    });
  }

  private loadConfig() {
    const config = this.model.get('config');
    debug('loadConfig() called, config:', config);
    if (config && Object.keys(config).length > 0) {
      this.isSyncingConfig = true;
      const action = addDataToMap({
        datasets: [],
        config,
        options: {centerMap: false, keepExistingConfig: true}
      } as AddDataToMapPayload);
      this.store.dispatch(wrapTo(KEPLER_ID, action));
      this.previousConfigHash = JSON.stringify(config);
      this.isSyncingConfig = false;
    }
  }

  private syncConfigToPython() {
    if (this.isSyncingConfig) {
      return;
    }

    const state = this.store.getState() as {keplerGl?: Record<string, unknown>};
    const instanceState = state.keplerGl?.[KEPLER_ID];
    if (!instanceState) {
      return;
    }

    this.mapUpdateCounter++;
    // Skip early store updates during component initialization
    if (this.mapUpdateCounter <= 2) {
      return;
    }

    const configToSave = KeplerGlSchema.getConfigToSave(instanceState);
    const hash = JSON.stringify(configToSave);

    if (hash !== this.previousConfigHash) {
      debug('Config changed, syncing to Python');
      this.previousConfigHash = hash;
      this.model.set('config', configToSave);
      this.model.save_changes();
    }
  }
}
