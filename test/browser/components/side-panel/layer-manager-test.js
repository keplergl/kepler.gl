// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape';
import {fireEvent, render} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import {LayerClasses} from '@kepler.gl/layers';
import {getApplicationConfig, initApplicationConfig} from '@kepler.gl/utils';

import {
  LayerManagerFactory,
  LayerListFactory,
  DatasetLayerGroupFactory,
  DatasetSectionFactory,
  PanelViewListToggleFactory,
  PanelTitleFactory,
  AddLayerButtonFactory,
  appInjector,
  Layers
} from '@kepler.gl/components';

import {mountWithTheme, IntlWrapper} from 'test/helpers/component-utils';

import {VisStateActions, UIStateActions, MapStateActions} from '@kepler.gl/actions';

import {StateWMultiH3Layers} from 'test/helpers/mock-state';

const LayerManager = appInjector.get(LayerManagerFactory);
const LayerList = appInjector.get(LayerListFactory);
const DatasetLayerGroup = appInjector.get(DatasetLayerGroupFactory);
const DatasetSection = appInjector.get(DatasetSectionFactory);
const PanelViewListToggle = appInjector.get(PanelViewListToggleFactory);
const PanelTitle = appInjector.get(PanelTitleFactory);
const AddLayerButton = appInjector.get(AddLayerButtonFactory);

const nop = () => {};

const defaultProps = {
  datasets: StateWMultiH3Layers.visState.datasets,
  layers: StateWMultiH3Layers.visState.layers,
  layerOrder: StateWMultiH3Layers.visState.layerOrder,
  layerClasses: StateWMultiH3Layers.visState.layerClasses,
  intl: {},
  showAddDataModal: nop,
  updateTableColor: nop,
  showDatasetTable: nop,
  removeDataset: nop,
  panelMetadata: {
    id: 'layer',
    label: 'sidebar.panels.layer',
    iconComponent: Layers,
    onClick: nop,
    component: LayerManager
  },
  layerPanelListView: 'list',
  uiStateActions: UIStateActions,
  visStateActions: VisStateActions,
  mapStateActions: MapStateActions,
  layerBlending: 'normal',
  overlayBlending: 'normal'
};

test('Components -> LayerManager -> contour picker follows application config in both list views', t => {
  const {enableContourLayer} = getApplicationConfig();
  t.equal(enableContourLayer, true, 'Contour is enabled by default');
  const dataId = Object.keys(defaultProps.datasets)[0];
  const layer = new LayerClasses.contour({id: 'optional-contour', dataId});
  layer.updateLayerConfig({isConfigActive: true});
  try {
    for (const panelListView of ['list', 'byDataset']) {
      initApplicationConfig({enableContourLayer: false});
      const props = {
        ...defaultProps,
        layers: [layer],
        layerOrder: [layer.id],
        layerClasses: LayerClasses,
        panelListView
      };
      const view = render(<LayerManager {...props} />, {
        wrapper: ({children}) => (
          <ThemeProvider theme={theme}>
            <IntlWrapper>{children}</IntlWrapper>
          </ThemeProvider>
        )
      });
      try {
        const selector = view.container.querySelector('.layer-config__type');
        t.ok(selector, `${panelListView}: existing Contour layer remains configurable`);
        t.equal(
          selector.querySelector('.layer-type-selector__item__label').textContent.toLowerCase(),
          'contour',
          'still identifies the saved layer when its type is disabled'
        );
        fireEvent.click(selector.querySelector('.item-selector__dropdown'));

        for (const enabled of [false, true, false, undefined]) {
          initApplicationConfig({enableContourLayer: enabled});
          view.rerender(<LayerManager {...props} />);
          const options = Array.from(
            view.baseElement.querySelectorAll(
              '.layer-type-selector__item .layer-type-selector__item__label'
            ),
            element => element.textContent.toLowerCase()
          );
          t.equal(
            options.includes('contour'),
            enabled === true,
            `${panelListView}: Contour is offered only when the flag is true (${enabled})`
          );
          t.ok(options.includes('point'), 'regular layer types stay available');
          t.equal(layer.type, 'contour', 'changing the flag does not replace the saved layer');
        }
      } finally {
        view.unmount();
        view.container.remove();
      }
    }
  } finally {
    initApplicationConfig({enableContourLayer});
  }
  t.end();
});

test('Components -> LayerManager -> render -> list view', t => {
  // mount
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <LayerManager {...defaultProps} />
      </IntlWrapper>
    );
  }, 'LayerManager should not fail');

  t.ok(wrapper.find(DatasetLayerGroup).length === 0, 'should not render DatasetLayerGroup');
  t.ok(wrapper.find(LayerList).length === 1, 'should render LayerList');
  t.ok(wrapper.find(AddLayerButton).length === 1, 'should render AddLayerButton');
  t.ok(wrapper.find(DatasetSection).length === 1, 'should render DatasetSection');
  t.ok(wrapper.find(PanelViewListToggle).length === 1, 'should render PanelViewListToggle');
  t.ok(wrapper.find(PanelTitle).length === 1, 'should render PanelTitle');

  const expectedTitles = ['H3 Hexagon 1', 'H3 Hexagon 1', 'H3 Hexagon 2', 'H3 Hexagon 2'];

  const titles = wrapper.find('.layer__title__editor').map(item => item.getDOMNode().value);
  t.deepEqual(titles, expectedTitles, 'should render panels in correct order');

  const layers = wrapper.find('.layer-panel');
  t.equal(layers.length, 4, 'should render 4 layer panels');

  t.end();
});

test('Components -> LayerManager -> render -> order by dataset view', t => {
  // mount
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <LayerManager {...defaultProps} panelListView="byDataset" />
      </IntlWrapper>
    );
  }, 'LayerManager should not fail');

  t.ok(wrapper.find(DatasetLayerGroup).length === 1, 'should render DatasetLayerGroup');
  t.ok(wrapper.find(LayerList).length === 1, 'should render LayerList');
  t.ok(wrapper.find(AddLayerButton).length === 1, 'should render AddLayerButton');
  t.ok(wrapper.find(DatasetSection).length === 1, 'should render DatasetSection');
  t.ok(wrapper.find(PanelViewListToggle).length === 1, 'should render PanelViewListToggle');
  t.ok(wrapper.find(PanelTitle).length === 1, 'should render PanelTitle');

  //  we have two layers by styled-component will render two elements for each component with the same className
  const expectedTitles = ['H3 Hexagon 1', 'H3 Hexagon 1', 'H3 Hexagon 2', 'H3 Hexagon 2'];
  const titles = wrapper.find('.layer__title__editor').map(item => item.getDOMNode().value);
  t.equal(titles.length, 4, 'Should display two tiles');
  t.deepEqual(titles, expectedTitles, 'should render panels in correct order');

  const layers = wrapper.find('.layer-panel');
  t.equal(layers.length, 4, 'should render 6 layer panels');

  t.end();
});
