// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState} from 'react';
import {fireEvent, screen, within, waitFor} from '@testing-library/react';
import {IntlWrapper, renderWithTheme} from 'test/helpers/component-jest-utils';
import {appInjector, LayerConfiguratorFactory, MapPopoverFactory} from '@kepler.gl/components';
import {DonutLayer, DONUT_COLORS} from '@kepler.gl/layers';
import {KeplerTable} from '@kepler.gl/table';
import DonutLayerConfiguratorFactory from './donut-layer-configurator';
import {DonutLegend} from '../../map/donut-layer-info';
import LayerHoverInfoFactory from '../../map/layer-hover-info';

const Configurator = appInjector.get(DonutLayerConfiguratorFactory);
const LayerConfigurator = appInjector.get(LayerConfiguratorFactory);
const HoverInfo = LayerHoverInfoFactory();
const MapPopover = appInjector.get(MapPopoverFactory);
const fields = ['bus', 'car', 'bike', 'walk', 'train', 'other', 'extra'].map((name, fieldIdx) => ({
  name,
  displayName: name,
  type: 'real',
  format: '',
  fieldIdx
}));
const categories = fields
  .slice(0, 2)
  .map((field, i) => ({field: field.name, label: field.name, color: DONUT_COLORS[i]}));
const renderUI = component => renderWithTheme(<IntlWrapper>{component}</IntlWrapper>);

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

test('selects numeric categories, retains colors when removing a field and edits labels/colors', () => {
  const onChange = jest.fn();
  function Editor() {
    const [config, setConfig] = useState({composition: {categories}});
    const layer = new DonutLayer({dataId: 'test'});
    layer.updateLayerVisConfig(config);
    return (
      <Configurator
        layer={layer}
        fields={[...fields, {name: 'text', displayName: 'text', type: 'string', format: ''}]}
        onChange={next => {
          onChange(next);
          setConfig({...config, ...next});
        }}
      />
    );
  }
  renderUI(<Editor />);
  fireEvent.change(screen.getByLabelText('Label for bus'), {target: {value: 'Public transport'}});
  expect(onChange.mock.lastCall[0].composition.categories[0].label).toBe('Public transport');
  const colorControl = screen.getByRole('group', {name: 'Color for bus'});
  fireEvent.click(colorControl.querySelector('.color-selector__selector') as Element);
  const preset = colorControl.querySelector('.single-color-palette__block') as HTMLElement;
  const presetColor = preset.style.backgroundColor.match(/\d+/g)!.map(Number);
  fireEvent.click(preset);
  expect(onChange.mock.lastCall[0].composition.categories[0].color).toEqual(presetColor);
  expect(onChange.mock.lastCall[0].composition.categories[1]).toEqual(categories[1]);
  fireEvent.click(within(colorControl).getByText('Color Picker'));
  fireEvent.change(within(colorControl).getByLabelText(/hex/i), {target: {value: '123456'}});
  expect(onChange.mock.lastCall[0].composition.categories[0].color).toEqual([18, 52, 86]);
  const removeButton = screen.getByRole('button', {name: 'Remove bus'});
  removeButton.focus();
  expect(removeButton).toHaveFocus();
  fireEvent.click(removeButton);
  expect(onChange).toHaveBeenLastCalledWith({composition: {categories: [categories[1]]}});
  fireEvent.click(screen.getByText('Add numeric field'));
  const options = within(document.querySelector('.list-selector') as HTMLElement);
  expect(options.queryByText('text')).toBeNull();
  fireEvent.click(options.getByText('bike'));
  expect(onChange.mock.lastCall[0].composition.categories.map(category => category.field)).toEqual([
    'car',
    'bike'
  ]);
  expect(onChange.mock.lastCall[0].composition.categories[0].color).toEqual(DONUT_COLORS[1]);
});

test.each(['', '   '])(
  'keeps a %p label editable while legend and tooltip use the field name',
  blank => {
    const onChange = jest.fn();
    function Editor() {
      const [config, setConfig] = useState({composition: {categories}});
      const layer = new DonutLayer({dataId: 'test'});
      layer.updateLayerVisConfig(config);
      return (
        <>
          <Configurator
            layer={layer}
            fields={fields}
            onChange={next => {
              onChange(next);
              setConfig({...config, ...next});
            }}
          />
          <div data-testid="legend">
            <DonutLegend layer={layer} width={240} />
          </div>
          <div data-testid="tooltip">
            <HoverInfo
              layer={layer}
              fieldsToShow={[]}
              data={{
                donut: {
                  categories: layer.getCategories(),
                  values: [30, 70],
                  shares: [0.3, 0.7],
                  total: 100,
                  status: 'valid'
                }
              }}
            />
          </div>
        </>
      );
    }
    renderUI(<Editor />);
    const label = screen.getByLabelText('Label for bus');
    fireEvent.change(label, {target: {value: blank}});
    expect(label).toHaveValue(blank);
    expect(within(screen.getByTestId('legend')).getByText('bus')).toBeInTheDocument();
    expect(within(screen.getByTestId('tooltip')).getByText('bus')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Label for car'), {target: {value: 'Driving'}});
    expect(label).toHaveValue(blank);
    expect(onChange.mock.lastCall[0].composition.categories[0].label).toBe(blank);
    fireEvent.change(label, {target: {value: 'Transit'}});
    expect(label).toHaveValue('Transit');
    expect(within(screen.getByTestId('legend')).getByText('Transit')).toBeInTheDocument();
    expect(within(screen.getByTestId('tooltip')).getByText('Transit')).toBeInTheDocument();
  }
);

test('limits selection to six categories and reports a missing saved field', () => {
  const layer = new DonutLayer({dataId: 'test'});
  layer.updateLayerVisConfig({
    composition: {
      categories: fields
        .slice(0, 6)
        .map((field, i) => ({field: field.name, label: field.name, color: DONUT_COLORS[i]}))
    }
  });
  renderUI(<Configurator layer={layer} fields={fields.slice(1)} onChange={jest.fn()} />);
  expect(screen.queryByText('Add numeric field')).toBeNull();
  expect(screen.getByRole('alert')).toBeInTheDocument();
  expect(screen.getAllByRole('button', {name: /^Remove /})).toHaveLength(6);
});

test('groups radius controls in order, places totals last and excludes legacy controls', () => {
  const onChange = jest.fn();
  const layer = new DonutLayer({dataId: 'test'});
  layer.updateLayerVisConfig({sizeByTotal: true});
  const {container} = renderUI(<Configurator layer={layer} fields={fields} onChange={onChange} />);
  expect(screen.getByText('Cluster Radius in Pixels')).toBeInTheDocument();
  const radius = screen.getByDisplayValue('25');
  const clusterRadius = screen.getByDisplayValue('90');
  const radiusGroup = radius.closest('.layer-config-group')!;
  expect(clusterRadius.closest('.layer-config-group')).toBe(radiusGroup);
  expect(
    within(radiusGroup as HTMLElement)
      .getAllByRole('spinbutton')
      .slice(0, 2)
  ).toEqual([radius, clusterRadius]);
  expect(screen.queryByText('None')).toBeNull();
  expect(screen.queryByText('Grid')).toBeNull();
  expect(screen.queryByText('Grid cell size in pixels')).toBeNull();
  expect(screen.queryByText('Size by total (area)')).toBeNull();
  expect(screen.queryByText('custom input')).toBeNull();
  const switches = screen.getAllByRole('checkbox');
  expect(switches).toHaveLength(1);
  expect(switches.find(input => input.id === `${layer.id}-sizeByTotal-switch`)).toBeUndefined();
  const showTotal = switches.find(input => input.id === `${layer.id}-showTotal-switch`)!;
  const inputs = container.querySelectorAll('input');
  expect(inputs[inputs.length - 1]).toBe(showTotal);
  fireEvent.click(showTotal);
  expect(onChange).toHaveBeenCalledWith({showTotal: true});
  fireEvent.change(clusterRadius, {target: {value: '120'}});
  fireEvent.blur(clusterRadius);
  expect(onChange).toHaveBeenLastCalledWith({clusterRadius: 120});
  fireEvent.change(clusterRadius, {target: {value: '1000'}});
  fireEvent.blur(clusterRadius);
  expect(onChange).toHaveBeenLastCalledWith({clusterRadius: 500});
});

test('grouped hover shows member count, summed values, shares and invalid omissions', () => {
  const layer = new DonutLayer({dataId: 'test'});
  renderUI(
    <HoverInfo
      layer={layer}
      fieldsToShow={[]}
      data={{
        donut: {
          categories,
          pointCount: 42,
          ignoredValueCount: 2,
          values: [91, 19],
          shares: [91 / 110, 19 / 110],
          total: 110,
          status: 'valid'
        }
      }}
    />
  );
  expect(screen.getByText('Points').closest('tr')).toHaveTextContent('42');
  expect(screen.getByText('bus').closest('tr')).toHaveTextContent('9182.7%');
  expect(screen.getByText('Total of selected fields').closest('tr')).toHaveTextContent('110');
  expect(screen.getByText('2 invalid values ignored.')).toHaveAttribute('colspan', '3');
});

test('single-point cluster hover shows valid parts and ignored values', async () => {
  const dataset = new KeplerTable({info: {id: 'test'}, color: [0, 0, 0]});
  await dataset.importData({data: {fields: fields.slice(0, 2), rows: [[30, -1]]}});
  const layer = new DonutLayer({dataId: dataset.id});
  layer.updateLayerVisConfig({composition: {categories}});
  const composition = layer.getCompositionAccessor(dataset.dataContainer, dataset.fields)(0);
  renderUI(
    <HoverInfo
      layer={layer}
      fieldsToShow={[]}
      data={{donut: {...composition, categories, pointCount: 1}}}
    />
  );
  expect(
    within(screen.getByText('bus').closest('tr')!)
      .getAllByRole('cell')
      .map(cell => cell.textContent)
  ).toEqual(['bus', '30', '100%']);
  expect(
    within(screen.getByText('car').closest('tr')!)
      .getAllByRole('cell')
      .map(cell => cell.textContent)
  ).toEqual(['car', '0', '0%']);
  expect(screen.getByText('Total of selected fields').closest('tr')).toHaveTextContent('30');
  expect(screen.getByText('1 invalid value ignored.')).toBeInTheDocument();
  expect(screen.getByText('Points').closest('tr')).toHaveTextContent('1');
});

test('the main layer configurator routes to composition controls', async () => {
  const dataset = new KeplerTable({info: {id: 'test'}, color: [0, 0, 0]});
  await dataset.importData({data: {fields, rows: [[1, 2, 3, 4, 5, 6, 7]]}});
  const layer = new DonutLayer({dataId: dataset.id});
  layer.updateLayerVisConfig({composition: {categories}});
  renderUI(
    <LayerConfigurator
      layer={layer}
      datasets={{[dataset.id]: dataset}}
      layerTypeOptions={[]}
      openModal={jest.fn()}
      updateLayerConfig={jest.fn()}
      updateLayerType={jest.fn()}
      updateLayerVisConfig={jest.fn()}
      updateLayerVisualChannelConfig={jest.fn()}
      updateLayerColorUI={jest.fn()}
      updateLayerTextLabel={jest.fn()}
    />
  );
  expect(screen.getByLabelText('Label for bus')).toBeInTheDocument();
});

test('legend and hover expose category labels, values, shares and total even without selected tooltip fields', () => {
  const layer = new DonutLayer({dataId: 'test'});
  layer.updateLayerVisConfig({composition: {categories}, sizeByTotal: true});
  layer.updateMeta({maxTotal: 100});
  const {unmount} = renderUI(
    <>
      <div data-testid="donut-legend">
        <DonutLegend layer={layer} width={240} />
      </div>
      <HoverInfo
        layer={layer}
        fieldsToShow={[]}
        data={{
          donut: {
            categories,
            values: [30, 70],
            shares: [0.3, 0.7],
            total: 100,
            status: 'valid'
          }
        }}
      />
    </>
  );
  expect(screen.getByText('30%')).toBeInTheDocument();
  expect(screen.getByText('70%')).toBeInTheDocument();
  expect(screen.getByText('100')).toBeInTheDocument();
  expect(screen.getAllByText('bus')).toHaveLength(2);
  expect(screen.getByTestId('donut-legend').textContent).toBe(
    categories.map(category => category.label).join('')
  );
  expect(screen.queryByText('Size by total (area)')).toBeNull();
  expect(screen.queryByText('layerVisConfigs.donut.sizeByTotal')).toBeNull();
  expect(screen.queryByText(/invalid values? ignored/)).toBeNull();
  unmount();
  renderUI(
    <IntlWrapper>
      <HoverInfo
        layer={layer}
        fieldsToShow={[]}
        data={{
          donut: {
            categories,
            values: [0, 70],
            shares: [0, 1],
            total: 70,
            status: 'valid'
          }
        }}
      />
    </IntlWrapper>
  );
  expect(screen.queryByText('30%')).toBeNull();
  expect(screen.queryByText('100')).toBeNull();
  expect(
    within(screen.getByText('bus').closest('tr')!)
      .getAllByRole('cell')
      .map(cell => cell.textContent)
  ).toEqual(['bus', '0', '0%']);
  expect(
    within(screen.getByText('car').closest('tr')!)
      .getAllByRole('cell')
      .map(cell => cell.textContent)
  ).toEqual(['car', '70', '100%']);
  expect(screen.getByText('Total of selected fields').closest('tr')).toHaveTextContent('70');
});

test.each(['valid', 'missing'])(
  'the %s donut tooltip keeps labels, values and shares in three columns',
  async status => {
    const layer = new DonutLayer({dataId: 'test'});
    layer.updateLayerVisConfig({composition: {categories}});
    renderUI(
      <MapPopover
        x={0}
        y={0}
        zoom={10}
        coordinate={false}
        onClose={jest.fn()}
        onSetFeatures={jest.fn()}
        setSelectedFeature={jest.fn()}
        layerHoverProp={{
          layer,
          fields: [],
          fieldsToShow: [],
          data: {
            donut: {
              categories,
              values: status === 'valid' ? [30, 70] : [null, 70],
              shares: status === 'valid' ? [0.3, 0.7] : [0, 0],
              total: status === 'valid' ? 100 : null,
              status
            }
          }
        }}
      />
    );
    const table = await screen.findByRole('table');
    await waitFor(() => {
      expect(getComputedStyle(table).gridTemplateColumns.split(/\s+/)).toHaveLength(3);
    });
    const rows = within(table).getAllByRole('row');
    expect(
      within(rows[0])
        .getAllByRole('cell')
        .map(cell => cell.textContent)
    ).toEqual(status === 'valid' ? ['bus', '30', '30%'] : ['bus', '—', '—']);
    const total = within(rows[2]).getAllByRole('cell')[1];
    expect(total).toHaveAttribute('colspan', '2');
    expect(getComputedStyle(total).gridColumn).toBe('span 2');
    if (status === 'missing') {
      const message = within(rows[3]).getByRole('cell');
      expect(message).toHaveAttribute('colspan', '3');
      expect(
        getComputedStyle(message)
          .gridColumn.split('/')
          .map(value => value.trim())
      ).toEqual(['1', '-1']);
    }
  }
);
