// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {areMapControlPropsEqual, MapControlProps} from './map-control';

// ─── Helpers ───────────────────────────────────────────────────────────────

function makeLayer(overrides: Record<string, any> = {}): any {
  return {
    id: 'l1',
    type: 'point',
    config: {
      isVisible: true,
      label: 'Layer 1',
      isConfigActive: false,
      color: [255, 0, 0],
      highlightColor: [0, 255, 0]
    },
    ...overrides
  };
}

function makeDataset(overrides: Record<string, any> = {}): any {
  return {
    id: 'ds1',
    label: 'Dataset 1',
    color: [0, 0, 255],
    ...overrides
  };
}

// Stable shared objects — all tests that don't override a specific prop
// will share these references, so unrelated props always pass reference equality.
const STABLE = {
  callbacks: {
    onTogglePerspective: jest.fn(),
    onToggleSplitMap: jest.fn() as any,
    onToggleSplitMapViewport: jest.fn(),
    onMapToggleLayer: jest.fn(),
    onToggleMapControl: jest.fn(),
    onSetEditorMode: jest.fn(),
    onToggleEditorVisibility: jest.fn(),
    onLayerVisConfigChange: jest.fn(),
    onSetLocale: jest.fn() as any,
    setMapControlSettings: jest.fn() as any
  },
  datasets: {} as any,
  layers: [] as any[],
  layerOrder: [] as any[],
  layersToRender: {} as {[key: string]: boolean},
  mapControls: {} as any,
  editor: {} as any
};

function baseProps(): MapControlProps {
  return {
    ...STABLE.callbacks,
    datasets: STABLE.datasets,
    dragRotate: false,
    isSplit: false,
    primary: true,
    layers: STABLE.layers,
    layerOrder: STABLE.layerOrder,
    layersToRender: STABLE.layersToRender,
    mapIndex: 0,
    mapControls: STABLE.mapControls,
    top: 0,
    availableLocales: ['en'],
    locale: 'en',
    activeSidePanel: null,
    editor: STABLE.editor
  };
}

/**
 * Create a prev/next pair where only the specified key differs.
 * Both objects share the same base so all other prop references are identical.
 */
function pair(
  key: keyof MapControlProps,
  prevVal: any,
  nextVal: any
): [MapControlProps, MapControlProps] {
  const base = baseProps();
  const prev = {...base, [key]: prevVal};
  const next = {...base, [key]: nextVal};
  return [prev, next];
}

const isEqual = areMapControlPropsEqual;

// ═══════════════════════════════════════════════════════════════════════════
// Baseline
// ═══════════════════════════════════════════════════════════════════════════

describe('areMapControlPropsEqual — baseline', () => {
  test('returns true when props are identical references', () => {
    const props = baseProps();
    expect(isEqual(props, props)).toBe(true);
  });

  test('returns false when a simple scalar prop changes (e.g. locale)', () => {
    const [prev, next] = pair('locale', 'en', 'fr');
    expect(isEqual(prev, next)).toBe(false);
  });

  test('returns false when isSplit changes', () => {
    const [prev, next] = pair('isSplit', false, true);
    expect(isEqual(prev, next)).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// layers
// ═══════════════════════════════════════════════════════════════════════════

describe('areMapControlPropsEqual — layers', () => {
  test('re-renders when a layer is added', () => {
    const [prev, next] = pair('layers', [], [makeLayer()]);
    expect(isEqual(prev, next)).toBe(false);
  });

  test('re-renders when layer.config.isVisible changes', () => {
    const layer = makeLayer();
    const [prev, next] = pair('layers', [layer], [
      {...layer, config: {...layer.config, isVisible: false}}
    ]);
    expect(isEqual(prev, next)).toBe(false);
  });

  test('re-renders when layer.config.label changes', () => {
    const layer = makeLayer();
    const [prev, next] = pair('layers', [layer], [
      {...layer, config: {...layer.config, label: 'New'}}
    ]);
    expect(isEqual(prev, next)).toBe(false);
  });

  test('re-renders when layer.config.color changes (legend color)', () => {
    const layer = makeLayer();
    const [prev, next] = pair('layers', [layer], [
      {...layer, config: {...layer.config, color: [0, 255, 0]}}
    ]);
    expect(isEqual(prev, next)).toBe(false);
  });

  test('re-renders when layer.config.highlightColor changes', () => {
    const layer = makeLayer();
    const [prev, next] = pair('layers', [layer], [
      {...layer, config: {...layer.config, highlightColor: [255, 0, 255]}}
    ]);
    expect(isEqual(prev, next)).toBe(false);
  });

  test('re-renders when layer.config.isConfigActive changes', () => {
    const layer = makeLayer();
    const [prev, next] = pair('layers', [layer], [
      {...layer, config: {...layer.config, isConfigActive: true}}
    ]);
    expect(isEqual(prev, next)).toBe(false);
  });

  test('does NOT re-render when layer object ref changes but all checked fields are the same', () => {
    const layer = makeLayer();
    const [prev, next] = pair('layers', [layer], [{...layer}]); // spread = new object, same values
    expect(isEqual(prev, next)).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// datasets
// ═══════════════════════════════════════════════════════════════════════════

describe('areMapControlPropsEqual — datasets', () => {
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
    const ds = makeDataset();
    const [prev, next] = pair('datasets', {ds1: ds}, {ds1: {...ds}});
    expect(isEqual(prev, next)).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// layersToRender
// ═══════════════════════════════════════════════════════════════════════════

describe('areMapControlPropsEqual — layersToRender', () => {
  test('re-renders when a layer visibility entry changes', () => {
    const [prev, next] = pair('layersToRender', {l1: true}, {l1: false});
    expect(isEqual(prev, next)).toBe(false);
  });

  test('re-renders when a new layer visibility entry is added', () => {
    const [prev, next] = pair('layersToRender', {l1: true}, {l1: true, l2: true});
    expect(isEqual(prev, next)).toBe(false);
  });

  test('does NOT re-render when layersToRender object is recreated with same values', () => {
    const [prev, next] = pair('layersToRender', {l1: true, l2: false}, {l1: true, l2: false});
    expect(isEqual(prev, next)).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// mapControls (unhandled prop — reference equality)
// ═══════════════════════════════════════════════════════════════════════════

describe('areMapControlPropsEqual — mapControls (reference equality)', () => {
  test('re-renders when mapControls reference changes', () => {
    const [prev, next] = pair(
      'mapControls',
      {mapLegend: {show: true}} as any,
      {mapLegend: {show: true}} as any // new object
    );
    expect(isEqual(prev, next)).toBe(false);
  });

  test('does NOT re-render when mapControls reference is the same', () => {
    const mapControls = {mapLegend: {show: true}} as any;
    const [prev, next] = pair('mapControls', mapControls, mapControls);
    expect(isEqual(prev, next)).toBe(true);
  });
});
