// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, screen} from '@testing-library/react';
import {appInjector} from '@kepler.gl/components';
import {DEFAULT_GLOBE_CONFIG, GlobeConfig} from '@kepler.gl/constants';
import {INITIAL_MAP_STATE} from '@kepler.gl/reducers';
import {IntlWrapper, renderWithTheme} from 'test/helpers/component-jest-utils';
import RangeSliderFactory from '../../common/range-slider';
import PanelHeaderActionFactory from '../panel-header-action';
import type {LayerGroupColorPickerProps} from './map-layer-group-color-picker';
import GlobeConfigPanelFactory from './globe-config-panel';

// Isolate the color-picker popup, while exercising the real visibility actions
// and range sliders. The panel owns color routing and picker availability.
const ColorPicker = ({slug, color, disabled, onColorChange}: LayerGroupColorPickerProps) => (
  <button disabled={disabled} onClick={() => onColorChange([12, 34, 56])} aria-label={slug}>
    {color.join(',')}
  </button>
);
const GlobeConfigPanel = GlobeConfigPanelFactory(
  appInjector.get(PanelHeaderActionFactory),
  appInjector.get(RangeSliderFactory),
  ColorPicker
);

function setup(config: Partial<GlobeConfig> = {}, enabled = true) {
  const onChange = jest.fn();
  const renderPanel = (nextConfig: Partial<GlobeConfig>, nextEnabled = enabled) => (
    <IntlWrapper>
      <GlobeConfigPanel
        mapState={{
          ...INITIAL_MAP_STATE,
          globe: {
            ...INITIAL_MAP_STATE.globe,
            enabled: nextEnabled,
            config: {...DEFAULT_GLOBE_CONFIG, ...nextConfig}
          }
        }}
        onGlobeConfigChange={onChange}
      />
    </IntlWrapper>
  );
  const view = renderWithTheme(renderPanel(config));
  return {
    ...view,
    onChange,
    update: (nextConfig: Partial<GlobeConfig>, nextEnabled = enabled) =>
      view.rerender(renderPanel(nextConfig, nextEnabled)),
    toggle: (id: string) => {
      const control = view.container.querySelector(`[data-for$="_globe-${id}-toggle"]`);
      if (!control) throw new Error(`Missing globe toggle: ${id}`);
      fireEvent.click(control);
    }
  };
}

describe('GlobeConfigPanel', () => {
  test('hides the controls outside globe mode and restores them when enabled', () => {
    const view = setup({}, false);
    expect(view.container).toBeEmptyDOMElement();
    view.update({}, true);
    expect(screen.getByRole('button', {name: 'globe-background'})).toBeEnabled();
    expect(view.onChange).not.toHaveBeenCalled();
  });

  test.each([
    ['atmosphere', {atmosphere: false, terminator: false, azimuth: false}],
    ['basemap', {basemap: false, labels: false, adminLines: false, water: false}]
  ] as const)('toggles %s and its dependent layers together using the latest config', (id, off) => {
    const view = setup();
    view.toggle(id);
    expect(view.onChange).toHaveBeenLastCalledWith(off);
    view.update(off);
    view.toggle(id);
    expect(view.onChange).toHaveBeenLastCalledWith(
      Object.fromEntries(Object.keys(off).map(key => [key, true]))
    );
  });

  test.each([
    ['huge-halo', 'hugeHalo', 'atmosphere'],
    ['terminator', 'terminator', 'atmosphere'],
    ['azimuth', 'azimuth', 'atmosphere'],
    ['labels', 'labels', 'basemap'],
    ['admin', 'adminLines', 'basemap'],
    ['water', 'water', 'basemap']
  ] as const)(
    'enabling %s enables its parent; disabling it leaves the parent alone',
    (id, key, parent) => {
      const view = setup({[key]: false, [parent]: false});
      view.toggle(id);
      expect(view.onChange).toHaveBeenLastCalledWith({[key]: true, [parent]: true});
      view.update({[key]: true, [parent]: true});
      view.toggle(id);
      expect(view.onChange).toHaveBeenLastCalledWith({[key]: false});
    }
  );

  test('stars toggle independently of atmosphere and basemap', () => {
    const view = setup({atmosphere: false, basemap: false});
    view.toggle('stars');
    expect(view.onChange).toHaveBeenLastCalledWith({stars: false});
    view.update({stars: false});
    view.toggle('stars');
    expect(view.onChange).toHaveBeenLastCalledWith({stars: true});
  });

  test.each([
    [0, 'hugeHaloRadius', '2.12', 2.1],
    [1, 'hugeHaloOpacity', '0', 0],
    [2, 'terminatorOpacity', '2', 1],
    [3, 'azimuthAngle', '400', 360]
  ] as const)(
    'routes slider %s edits with its configured step and upper bound',
    (index, key, input, expected) => {
      const view = setup({azimuth: true});
      const control = screen.getAllByRole('spinbutton')[index];
      fireEvent.change(control, {target: {value: input}});
      fireEvent.blur(control);
      expect(view.onChange).toHaveBeenLastCalledWith({[key]: expected});
    }
  );

  test('uses halo defaults only for missing values, preserving zero opacity', () => {
    const view = setup({hugeHaloRadius: undefined, hugeHaloOpacity: undefined});
    expect(screen.getAllByRole('spinbutton')[0]).toHaveValue(DEFAULT_GLOBE_CONFIG.hugeHaloRadius);
    expect(screen.getAllByRole('spinbutton')[1]).toHaveValue(DEFAULT_GLOBE_CONFIG.hugeHaloOpacity);
    view.update({hugeHaloOpacity: 0});
    expect(screen.getAllByRole('spinbutton')[1]).toHaveValue(0);
  });

  test.each([
    ['labels', 'labelsColor'],
    ['admin', 'adminLinesColor'],
    ['water', 'waterColor'],
    ['surface', 'surfaceColor'],
    ['background', 'backgroundColor']
  ] as const)('routes %s color edits to only the corresponding config field', (slug, key) => {
    const view = setup({labels: true});
    const picker = screen.getByRole('button', {name: `globe-${slug}`});
    expect(picker).toHaveTextContent(DEFAULT_GLOBE_CONFIG[key].join(','));
    fireEvent.click(picker);
    expect(view.onChange).toHaveBeenCalledTimes(1);
    expect(view.onChange).toHaveBeenCalledWith({[key]: [12, 34, 56]});
  });

  test('disables child colors when their layer or basemap is hidden, but not surface/background', () => {
    const view = setup({labels: true, basemap: false});
    for (const slug of ['labels', 'admin', 'water']) {
      const picker = screen.getByRole('button', {name: `globe-${slug}`});
      expect(picker).toBeDisabled();
      fireEvent.click(picker);
    }
    expect(view.onChange).not.toHaveBeenCalled();
    for (const slug of ['surface', 'background']) {
      expect(screen.getByRole('button', {name: `globe-${slug}`})).toBeEnabled();
    }
    view.update({labels: false, adminLines: false, water: false});
    for (const slug of ['labels', 'admin', 'water']) {
      expect(screen.getByRole('button', {name: `globe-${slug}`})).toBeDisabled();
    }
    view.update({labels: true});
    for (const slug of ['labels', 'admin', 'water']) {
      expect(screen.getByRole('button', {name: `globe-${slug}`})).toBeEnabled();
    }
  });
});
