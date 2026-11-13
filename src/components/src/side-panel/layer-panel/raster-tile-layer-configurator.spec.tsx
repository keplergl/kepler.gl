// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, screen, within} from '@testing-library/react';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {appInjector} from '@kepler.gl/components';
import {RasterTileLayer, RASTER_COLOR_RESET_PARAMS} from '@kepler.gl/layers';
import {IntlWrapper, renderWithTheme} from 'test/helpers/component-jest-utils';
import RasterTileLayerConfiguratorFactory from './raster-tile-layer-configurator';

beforeAll(() => {
  window.IntersectionObserver = class {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
    takeRecords() {
      return [];
    }
    root = null;
    rootMargin = '';
    thresholds = [];
  };
});

const Configurator = appInjector.get(RasterTileLayerConfiguratorFactory);
const metadata = {
  type: 'Feature',
  id: 'custom-raster',
  assets: {
    image: {
      href: 'https://example.com/image.tif',
      'eo:bands': [
        {name: 'B04', common_name: 'red'},
        {name: 'B03', common_name: 'green'},
        {name: 'B02', common_name: 'blue'},
        {name: 'B08', common_name: 'nir'}
      ]
    }
  }
};

function renderConfigurator(config = {}, data: any = metadata) {
  const layer = new RasterTileLayer({id: 'raster', dataId: 'test'});
  layer.updateLayerVisConfig({preset: 'trueColor', dynamicColor: true, ...config});
  const onChange = jest.fn();
  const view = renderWithTheme(
    <Provider store={createStore(() => ({}))}>
      <IntlWrapper>
        <Configurator
          layer={layer}
          dataset={{metadata: data} as any}
          visConfiguratorProps={{layer, onChange}}
        />
      </IntlWrapper>
    </Provider>
  );
  return {onChange, view};
}

function selectOption(label: string, option: string) {
  const section = screen.getByText(label).parentElement!;
  fireEvent.click(
    section.querySelector('.item-selector__dropdown') || section.querySelector('.item-selector')!
  );
  fireEvent.click(
    within(document.querySelector('.list-selector') as HTMLElement).getByText(option)
  );
}

function openAssignments() {
  fireEvent.click(screen.getByText('Band Assignment'));
}

test('auto-detects RGB slots and limits presets to bands present in the dataset', () => {
  renderConfigurator();
  openAssignments();
  for (const [label, selected] of [
    ['Red Channel', 'B04 (red)'],
    ['Green Channel', 'B03 (green)'],
    ['Blue Channel', 'B02 (blue)']
  ]) {
    expect(within(screen.getByText(label).parentElement!).getByText(selected)).toBeInTheDocument();
  }
  fireEvent.click(screen.getByText('True Color'));
  const options = within(document.querySelector('.list-selector') as HTMLElement);
  expect(options.getByText('Infrared')).toBeInTheDocument();
  expect(options.queryByText('Agriculture')).not.toBeInTheDocument();
});

test.each([JSON.stringify({red: 'B08', green: 'B02'}), {red: 'B08', green: 'B02'}])(
  'restores overrides and preserves other slots when assigning a physical band (%p)',
  bandOverrides => {
    const {onChange} = renderConfigurator({bandOverrides});
    openAssignments();
    expect(
      within(screen.getByText('Red Channel').parentElement!).getByText('B08 (nir)')
    ).toBeInTheDocument();
    selectOption('Red Channel', 'B03 (green)');
    expect(onChange).toHaveBeenLastCalledWith({
      bandOverrides: JSON.stringify({red: 'B03', green: 'B02'})
    });
  }
);

test('malformed saved overrides fall back to detected bands and can be replaced', () => {
  const {onChange} = renderConfigurator({bandOverrides: '{invalid'});
  openAssignments();
  expect(
    within(screen.getByText('Red Channel').parentElement!).getByText('B04 (red)')
  ).toBeInTheDocument();
  selectOption('Red Channel', 'B08 (nir)');
  expect(onChange).toHaveBeenLastCalledWith({bandOverrides: JSON.stringify({red: 'B08'})});
});

test('switching to single band clears RGB overrides and resets color enhancements', () => {
  const {onChange} = renderConfigurator({bandOverrides: JSON.stringify({red: 'B08'})});
  fireEvent.click(screen.getByText('True Color'));
  fireEvent.click(
    within(document.querySelector('.list-selector') as HTMLElement).getByText('Single Band')
  );
  expect(onChange).toHaveBeenLastCalledWith({
    ...RASTER_COLOR_RESET_PARAMS,
    preset: 'singleBand',
    bandOverrides: null
  });
});

test('single band initializes an empty selection but preserves a saved selection', () => {
  const first = renderConfigurator({preset: 'singleBand', singleBandName: null});
  expect(first.onChange).toHaveBeenCalledWith({singleBandName: 'B04'});
  expect(screen.queryByText('Band Assignment')).not.toBeInTheDocument();
  first.view.unmount();
  const saved = renderConfigurator({preset: 'singleBand', singleBandName: 'B08'});
  expect(saved.onChange).not.toHaveBeenCalled();
  fireEvent.click(screen.getByText('B08 (nir)'));
  fireEvent.click(
    within(document.querySelector('.list-selector') as HTMLElement).getByText('B02 (blue)')
  );
  expect(saved.onChange).toHaveBeenLastCalledWith({singleBandName: 'B02'});
});

test('renders nothing before metadata is available', () => {
  const {view, onChange} = renderConfigurator({}, null);
  expect(view.container).toBeEmptyDOMElement();
  expect(onChange).not.toHaveBeenCalled();
});
