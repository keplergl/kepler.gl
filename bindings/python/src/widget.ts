import {createRoot, Root} from 'react-dom/client';
import React from 'react';
import {Provider} from 'react-redux';
import {createStore, KEPLER_ID} from './store';
import {App} from './components/App';
import {processDataset} from './utils/data';
import type {WidgetModel, DatasetPayload} from './types';
import type {ParsedConfig} from '@kepler.gl/types';
import {addDataToMap, receiveMapConfig, wrapTo} from '@kepler.gl/actions';

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

    this.loadData();
    this.loadConfig();
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
    this.loadConfig();
  }

  onHeightChange() {
    this.el.style.height = `${this.model.get('height')}px`;
  }

  private async loadData() {
    const data = this.model.get('data');
    debug('loadData() called, data keys:', Object.keys(data));
    debug('loadData() raw data:', JSON.stringify(data, null, 2));

    // Wait for the KeplerGl component to register itself
    await this.waitForInstance();

    for (const [name, payload] of Object.entries(data)) {
      debug(`Processing dataset '${name}'...`);
      try {
        const processed = await processDataset(payload as DatasetPayload);
        debug(
          `Dataset '${name}' processed:`,
          processed ? {fields: processed.fields, rowCount: processed.rows?.length} : null
        );

        if (!processed) {
          debug(`Dataset '${name}' returned null, skipping`);
          continue;
        }

        const action = addDataToMap({
          datasets: {
            info: {id: name, label: name},
            data: processed
          }
        });
        // Wrap the action to target the specific kepler.gl instance
        const wrappedAction = wrapTo(KEPLER_ID, action);
        debug(`Dispatching addDataToMap for '${name}'`, wrappedAction);
        this.store.dispatch(wrappedAction);
        debug(`addDataToMap dispatched for '${name}'`);
      } catch (error) {
        console.error(`[keplergl-widget] Error processing dataset '${name}':`, error);
      }
    }

    debug('loadData() complete, store state:', this.store.getState());
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
      this.store.dispatch(wrapTo(KEPLER_ID, receiveMapConfig(config as ParsedConfig, {})));
    }
  }

  private syncConfigToPython() {
    // TODO: Extract config from store and sync back
  }
}
