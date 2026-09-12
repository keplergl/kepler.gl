// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Mock the heavy factory dependencies that side-panel.tsx imports transitively.
// We only need to test the pure comparator function, not render the component.
jest.mock('./side-panel/layer-manager', () => () => null);
jest.mock('./side-panel/filter-manager', () => () => null);
jest.mock('./side-panel/interaction-manager', () => () => null);
jest.mock('./side-panel/map-manager', () => () => null);
jest.mock('./side-panel/custom-panel', () => {
  const factory = () => null;
  factory.panels = [];
  factory.getProps = () => ({});
  return factory;
});
jest.mock('./side-panel/side-bar', () => () => null);
jest.mock('./side-panel/panel-header', () => () => null);
jest.mock('./side-panel/panel-toggle', () => () => null);

import {areSidePanelPropsEqual} from './side-panel';
import {SidePanelProps} from './types';

// ─── Helpers ───────────────────────────────────────────────────────────────

function makeUiState(activeSidePanel: string | null = null): any {
  return {activeSidePanel};
}

function makeFilter(overrides: Record<string, any> = {}): any {
  return {
    id: 'f1',
    name: 'my filter',
    type: 'range',
    dataId: ['ds1'],
    view: 'side',
    enabled: true,
    plotType: {type: 'histogram'},
    animationWindow: 'free',
    speed: 1,
    gpu: false,
    value: [0, 100],
    ...overrides
  };
}

function makeLayer(overrides: Record<string, any> = {}): any {
  return {
    id: 'l1',
    type: 'point',
    config: {
      isVisible: true,
      label: 'My Layer',
      isConfigActive: false,
      color: [255, 0, 0],
      highlightColor: [0, 255, 0],
      visConfig: {},
      dataId: 'ds1',
      columns: {}
    },
    ...overrides
  };
}

function makeDataset(overrides: Record<string, any> = {}): any {
  const fields = [{name: 'col1'}];
  const dataContainer = {};
  return {
    id: 'ds1',
    label: 'Dataset 1',
    color: [0, 0, 255],
    fields,
    dataContainer,
    ...overrides
  };
}

// Stable shared objects used as defaults — all tests share these references
// so props that aren't under test always pass the reference-equality check.
const STABLE = {
  actions: {
    uiStateActions: {} as any,
    visStateActions: {} as any,
    mapStateActions: {} as any,
    mapStyleActions: {} as any
  },
  filters: [] as any[],
  layers: [] as any[],
  layerOrder: [] as any[],
  layerClasses: {},
  interactionConfig: {} as any,
  mapInfo: {},
  mapStyle: {} as any,
  datasets: {},
  availableProviders: {}
};

/** Build a base props object. All unspecified props share stable references. */
function baseProps(): SidePanelProps {
  return {
    ...STABLE.actions,
    appName: 'kepler.gl',
    appWebsite: 'https://kepler.gl',
    version: '3.0.0',
    filters: STABLE.filters,
    layers: STABLE.layers,
    layerOrder: STABLE.layerOrder,
    layerClasses: STABLE.layerClasses,
    layerBlending: 'normal',
    overlayBlending: 'normal',
    interactionConfig: STABLE.interactionConfig,
    mapInfo: STABLE.mapInfo,
    mapStyle: STABLE.mapStyle,
    mapState: undefined,
    datasets: STABLE.datasets,
    uiState: makeUiState() as any,
    availableProviders: STABLE.availableProviders,
    mapSaved: null,
    width: 300,
    onSaveMap: undefined
  } as SidePanelProps;
}

/**
 * Create a prev/next pair where only the specified key differs.
 * Both objects share the same base so all other prop references are identical.
 */
function pair(key: keyof SidePanelProps, prevVal: any, nextVal: any): [SidePanelProps, SidePanelProps] {
  const base = baseProps();
  const sharedUiState = base.uiState;
  const prev = {...base, uiState: sharedUiState, [key]: prevVal};
  const next = {...base, uiState: sharedUiState, [key]: nextVal};
  return [prev, next];
}

function pairWithUiState(
  key: keyof SidePanelProps,
  prevVal: any,
  nextVal: any,
  activeSidePanel: string | null
): [SidePanelProps, SidePanelProps] {
  const base = baseProps();
  const sharedUiState = makeUiState(activeSidePanel) as any;
  const prev = {...base, uiState: sharedUiState, [key]: prevVal};
  const next = {...base, uiState: sharedUiState, [key]: nextVal};
  return [prev, next];
}

const isEqual = areSidePanelPropsEqual;

// ═══════════════════════════════════════════════════════════════════════════
// Baseline
// ═══════════════════════════════════════════════════════════════════════════

describe('areSidePanelPropsEqual — baseline', () => {
  test('returns true when props are identical references', () => {
    const props = baseProps();
    expect(isEqual(props, props)).toBe(true);
  });

  test('returns false when a simple scalar prop changes', () => {
    const [prev, next] = pair('appName', 'kepler.gl', 'my-app');
    expect(isEqual(prev, next)).toBe(false);
  });

  test('returns true when all props share the same references', () => {
    const prev = baseProps();
    const next = {...prev}; // shallow copy — all refs identical
    expect(isEqual(prev, next)).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Animation / mousemove suppression
// ═══════════════════════════════════════════════════════════════════════════

describe('areSidePanelPropsEqual — animation & mousemove suppression', () => {
  test('does NOT re-render when only filter value changes (animation tick)', () => {
    const filter = makeFilter({value: [0, 100]});
    const [prev, next] = pair('filters', [filter], [{...filter, value: [0, 50]}]);
    expect(isEqual(prev, next)).toBe(true);
  });

  test('does NOT re-render when mapState lat/lng/zoom changes (map pan)', () => {
    const [prev, next] = pair(
      'mapState',
      {latitude: 37.7, longitude: -122.4, zoom: 10, globe: {enabled: false}},
      {latitude: 37.8, longitude: -122.3, zoom: 11, globe: {enabled: false}}
    );
    expect(isEqual(prev, next)).toBe(true);
  });

  test('does NOT re-render when mapState bearing/pitch changes', () => {
    const [prev, next] = pair(
      'mapState',
      {bearing: 0, pitch: 0, globe: {enabled: false}},
      {bearing: 45, pitch: 30, globe: {enabled: false}}
    );
    expect(isEqual(prev, next)).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// mapState — globe toggle
// ═══════════════════════════════════════════════════════════════════════════

describe('areSidePanelPropsEqual — mapState.globe.enabled', () => {
  test('re-renders when globe is enabled', () => {
    const [prev, next] = pair(
      'mapState',
      {latitude: 0, longitude: 0, zoom: 2, globe: {enabled: false}},
      {latitude: 0, longitude: 0, zoom: 2, globe: {enabled: true}}
    );
    expect(isEqual(prev, next)).toBe(false);
  });

  test('re-renders when globe is disabled', () => {
    const [prev, next] = pair(
      'mapState',
      {globe: {enabled: true}},
      {globe: {enabled: false}}
    );
    expect(isEqual(prev, next)).toBe(false);
  });

  test('does NOT re-render when mapState is undefined on both sides', () => {
    const [prev, next] = pair('mapState', undefined, undefined);
    expect(isEqual(prev, next)).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// filters
// ═══════════════════════════════════════════════════════════════════════════

describe('areSidePanelPropsEqual — filters', () => {
  test('re-renders when a filter is added', () => {
    const [prev, next] = pair('filters', [], [makeFilter()]);
    expect(isEqual(prev, next)).toBe(false);
  });

  test('re-renders when filter.enabled changes', () => {
    const filter = makeFilter({enabled: true});
    const [prev, next] = pair('filters', [filter], [{...filter, enabled: false}]);
    expect(isEqual(prev, next)).toBe(false);
  });

  test('re-renders when filter.view changes', () => {
    const filter = makeFilter({view: 'side'});
    const [prev, next] = pair('filters', [filter], [{...filter, view: 'enlarged'}]);
    expect(isEqual(prev, next)).toBe(false);
  });

  test('re-renders when filter.value changes and filter panel is open', () => {
    const filter = makeFilter({value: [0, 100]});
    const [prev, next] = pairWithUiState(
      'filters',
      [filter],
      [{...filter, value: [10, 90]}],
      'filter'
    );
    expect(isEqual(prev, next)).toBe(false);
  });

  test('does NOT re-render when filter.value changes and filter panel is closed', () => {
    const filter = makeFilter({value: [0, 100]});
    const [prev, next] = pairWithUiState(
      'filters',
      [filter],
      [{...filter, value: [10, 90]}],
      null
    );
    expect(isEqual(prev, next)).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// layers
// ═══════════════════════════════════════════════════════════════════════════

describe('areSidePanelPropsEqual — layers', () => {
  test('re-renders when a layer is added', () => {
    const [prev, next] = pair('layers', [], [makeLayer()]);
    expect(isEqual(prev, next)).toBe(false);
  });

  test('re-renders when layer.config.isVisible changes', () => {
    const layer = makeLayer();
    const [prev, next] = pair(
      'layers',
      [layer],
      [{...layer, config: {...layer.config, isVisible: false}}]
    );
    expect(isEqual(prev, next)).toBe(false);
  });

  test('re-renders when layer.config.label changes', () => {
    const layer = makeLayer();
    const [prev, next] = pair(
      'layers',
      [layer],
      [{...layer, config: {...layer.config, label: 'New Name'}}]
    );
    expect(isEqual(prev, next)).toBe(false);
  });

  test('does NOT re-render when layer config color changes and layer panel is closed', () => {
    const layer = makeLayer();
    const [prev, next] = pairWithUiState(
      'layers',
      [layer],
      [{...layer, config: {...layer.config, color: [0, 255, 0]}}],
      null
    );
    expect(isEqual(prev, next)).toBe(true);
  });

  test('re-renders when layer.config.color changes and layer panel is open', () => {
    const layer = makeLayer();
    const [prev, next] = pairWithUiState(
      'layers',
      [layer],
      [{...layer, config: {...layer.config, color: [0, 255, 0]}}],
      'layer'
    );
    expect(isEqual(prev, next)).toBe(false);
  });

  test('re-renders when layer.config.visConfig changes and layer panel is open', () => {
    const layer = makeLayer();
    const [prev, next] = pairWithUiState(
      'layers',
      [layer],
      [{...layer, config: {...layer.config, visConfig: {radius: 20}}}],
      'layer'
    );
    expect(isEqual(prev, next)).toBe(false);
  });

  test('re-renders when layer.config.isConfigActive changes and layer panel is open', () => {
    const layer = makeLayer();
    const [prev, next] = pairWithUiState(
      'layers',
      [layer],
      [{...layer, config: {...layer.config, isConfigActive: true}}],
      'layer'
    );
    expect(isEqual(prev, next)).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// layerOrder
// ═══════════════════════════════════════════════════════════════════════════

describe('areSidePanelPropsEqual — layerOrder', () => {
  test('re-renders when layerOrder changes (drag-and-drop)', () => {
    const [prev, next] = pair('layerOrder', ['l1', 'l2'], ['l2', 'l1']);
    expect(isEqual(prev, next)).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// datasets
// ═══════════════════════════════════════════════════════════════════════════

describe('areSidePanelPropsEqual — datasets', () => {
  test('re-renders when a dataset is added', () => {
    const [prev, next] = pair('datasets', {}, {ds1: makeDataset()});
    expect(isEqual(prev, next)).toBe(false);
  });

  test('re-renders when dataset label changes', () => {
    const ds = makeDataset({label: 'old'});
    const [prev, next] = pair('datasets', {ds1: ds}, {ds1: {...ds, label: 'new'}});
    expect(isEqual(prev, next)).toBe(false);
  });

  test('re-renders when dataset color changes', () => {
    const ds = makeDataset({color: [255, 0, 0]});
    const [prev, next] = pair('datasets', {ds1: ds}, {ds1: {...ds, color: [0, 255, 0]}});
    expect(isEqual(prev, next)).toBe(false);
  });

  test('does NOT re-render when dataset object is recreated with same values', () => {
    const fields = [{name: 'col1'}];      // same reference
    const dataContainer = {};             // same reference
    const ds = makeDataset({fields, dataContainer});
    const [prev, next] = pair('datasets', {ds1: ds}, {ds1: {...ds}});
    expect(isEqual(prev, next)).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// uiState
// ═══════════════════════════════════════════════════════════════════════════

describe('areSidePanelPropsEqual — uiState', () => {
  test('re-renders when activeSidePanel changes', () => {
    const [prev, next] = pair('uiState', makeUiState(null), makeUiState('layer'));
    expect(isEqual(prev, next)).toBe(false);
  });

  test('re-renders when uiState ref changes (new Redux state slice)', () => {
    const [prev, next] = pair(
      'uiState',
      {activeSidePanel: 'layer'},
      {activeSidePanel: 'layer'} // same shape, different object
    );
    expect(isEqual(prev, next)).toBe(false);
  });
});

