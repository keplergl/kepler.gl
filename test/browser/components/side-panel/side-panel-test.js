// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';
import test from 'tape';
import sinon from 'sinon';
import SidePanelFactory from 'components/side-panel';
import SidebarFactory from 'components/side-panel/side-bar';
import PanelHeaderFactory from 'components/side-panel/panel-header';
import LayerManagerFactory from 'components/side-panel/layer-manager';
import FilterManagerFactory from 'components/side-panel/filter-manager';
import InteractionManagerFactory from 'components/side-panel/interaction-manager';
import MapManagerFactory from 'components/side-panel/map-manager';
import PanelToggleFactory from 'components/side-panel/panel-toggle';
import CustomPanelsFactory from 'components/side-panel/custom-panel';
import {SaveExportDropdownFactory} from 'components/side-panel/panel-header';
import ToolbarItem from 'components/common/toolbar-item';

import * as VisStateActions from 'actions/vis-state-actions';
import * as MapStyleActions from 'actions/map-style-actions';
import * as UIStateActions from 'actions/ui-state-actions';

import {appInjector} from 'components/container';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';

// components
const SidePanel = appInjector.get(SidePanelFactory);
const Sidebar = appInjector.get(SidebarFactory);
const PanelHeader = appInjector.get(PanelHeaderFactory);
const LayerManager = appInjector.get(LayerManagerFactory);
const FilterManager = appInjector.get(FilterManagerFactory);
const InteractionManager = appInjector.get(InteractionManagerFactory);
const MapManager = appInjector.get(MapManagerFactory);
const PanelToggle = appInjector.get(PanelToggleFactory);
const SaveExportDropdown = appInjector.get(SaveExportDropdownFactory);

// mock state
import {InitialState} from 'test/helpers/mock-state';

// Constants
import {EXPORT_DATA_ID, EXPORT_MAP_ID, EXPORT_IMAGE_ID} from 'constants/default-settings';

// default props from initial state
const defaultProps = {
  datasets: InitialState.visState.datasets,
  filters: InitialState.visState.filters,
  layerBlending: InitialState.visState.layerBlending,
  layerClasses: InitialState.visState.layerClasses,
  layerOrder: InitialState.visState.layerOrder,
  interactionConfig: InitialState.visState.interactionConfig,
  layers: InitialState.visState.layers,
  mapStyle: InitialState.mapStyle,
  uiState: InitialState.uiState,
  width: 300,
  uiStateActions: UIStateActions,
  visStateActions: VisStateActions,
  mapStyleActions: MapStyleActions,
  availableProviders: {}
};

test('Components -> SidePanel.mount -> no prop', t => {
  // mount
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <SidePanel {...defaultProps} />
      </IntlWrapper>
    );
  }, 'SidePanel should not fail without props');

  t.ok(wrapper.find(PanelHeader).length === 1, 'should render PanelHeader');
  t.ok(wrapper.find(PanelToggle).length === 1, 'should render PanelToggle');
  t.ok(wrapper.find(Sidebar).length === 1, 'should render Sidebar');

  t.end();
});

test('Components -> SidePanel -> toggle panel', t => {
  const toggleSidePanel = sinon.spy();
  const uiStateActions = {
    ...UIStateActions,
    toggleSidePanel
  };

  let wrapper;
  // mount
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <SidePanel {...defaultProps} uiStateActions={uiStateActions} />
      </IntlWrapper>
    );
  }, 'SidePanel should not fail');

  t.ok(wrapper.find(PanelToggle).length === 1, 'should render PanelToggle');

  t.equal(wrapper.find('.side-panel__tab').length, 4, 'should render 4 panel tabs');
  const layerTab = wrapper.find('.side-panel__tab').at(0);

  // click layer tab
  layerTab.simulate('click');
  t.ok(toggleSidePanel.calledWith('layer'), 'should call toggleSidePanel with layer');
  t.end();
});

test('Components -> SidePanel -> render panel', t => {
  let wrapper;
  let uiState = {
    ...defaultProps.uiState,
    activeSidePanel: 'layer'
  };
  // mount LayerManager
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <SidePanel {...defaultProps} uiState={uiState} />
      </IntlWrapper>
    );
  }, 'SidePanel should not fail');

  t.ok(wrapper.find(LayerManager).length === 1, 'should render LayerManager');

  // mount FilterManager
  uiState = {
    ...defaultProps.uiState,
    activeSidePanel: 'filter'
  };
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <SidePanel {...defaultProps} uiState={uiState} />
      </IntlWrapper>
    );
  }, 'SidePanel should not fail');
  t.ok(wrapper.find(FilterManager).length === 1, 'should render FilterManager');

  // mount InteractionManager
  uiState = {
    ...defaultProps.uiState,
    activeSidePanel: 'interaction'
  };
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <SidePanel {...defaultProps} uiState={uiState} />
      </IntlWrapper>
    );
  }, 'SidePanel should not fail');
  t.ok(wrapper.find(InteractionManager).length === 1, 'should render InteractionManager');

  // mount MapManager
  uiState = {
    ...defaultProps.uiState,
    activeSidePanel: 'map'
  };
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <SidePanel {...defaultProps} uiState={uiState} />
      </IntlWrapper>
    );
  }, 'SidePanel should not fail');
  t.ok(wrapper.find(MapManager).length === 1, 'should render MapManager');

  t.end();
});

test('Components -> SidePanel -> render custom panel', t => {
  const RocketIcon = () => <div id="rocket-icon" />;
  const ChartIcon = () => <div id="chart-icon" />;

  const MyPanels = props => {
    if (props.activeSidePanel === 'rocket') {
      return <div className="rocket-panel">Rocket</div>;
    } else if (props.activeSidePanel === 'chart') {
      return <div className="chart-panel">Charts?</div>;
    }

    return null;
  };

  MyPanels.defaultProps = {
    getProps: props => ({
      layers: props.layers
    })
  };

  function CustomSidePanelsFactory() {
    return MyPanels;
  }

  function CustomSidePanelFactory(...deps) {
    const CustomSidePanel = SidePanelFactory(...deps);
    CustomSidePanel.defaultProps = {
      ...CustomSidePanel.defaultProps,
      panels: [
        ...CustomSidePanel.defaultProps.panels,
        {
          id: 'rocket',
          label: 'Rocket',
          iconComponent: RocketIcon
        },
        {
          id: 'chart',
          label: 'Chart',
          iconComponent: ChartIcon
        }
      ]
    };
    return CustomSidePanel;
  }

  CustomSidePanelFactory.deps = SidePanelFactory.deps;

  let wrapper;

  const CustomSidePanel = appInjector
    .provide(SidePanelFactory, CustomSidePanelFactory)
    .provide(CustomPanelsFactory, CustomSidePanelsFactory)
    .get(SidePanelFactory);

  // mount CustomSidePanel
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <CustomSidePanel {...defaultProps} />
      </IntlWrapper>
    );
  }, 'SidePanel should not fail');

  t.equal(wrapper.find('.side-panel__tab').length, 6, 'should render 6 panel tabs');

  t.equal(wrapper.find(RocketIcon).length, 1, 'should render RocketIcon');
  t.equal(wrapper.find(ChartIcon).length, 1, 'should render RocketIcon');

  // // mount CustomSidePanel with 1 of the custom panel
  const uiState = {...defaultProps.uiState, activeSidePanel: 'rocket'};
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <CustomSidePanel {...defaultProps} uiState={uiState} />
      </IntlWrapper>
    );
  }, 'SidePanel should not fail when mount with custom side panel activated');
  t.equal(wrapper.find(MyPanels).length, 1, 'should render MyPanels');
  t.end();
});

test('Components -> SidePanel -> PanelHeader', t => {
  const showExportDropdown = sinon.spy();
  const uiStateActions = {
    ...UIStateActions,
    showExportDropdown
  };

  let wrapper;
  // mount
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <SidePanel {...defaultProps} uiStateActions={uiStateActions} />
      </IntlWrapper>
    );
  }, 'SidePanel should not fail');

  t.ok(wrapper.find(PanelHeader).length === 1, 'should render PanelHeader');

  const header = wrapper.find(PanelHeader);

  // action item
  t.equal(
    header.find('.side-panel__panel-header__action').length,
    1,
    'should render 1 header action item'
  );

  // Share
  t.equal(
    header
      .find('.side-panel__panel-header__action')
      .at(0)
      .find('p')
      .text(),
    'Share',
    'should only render Save action'
  );

  header
    .find('.side-panel__panel-header__action')
    .at(0)
    .simulate('click');

  t.ok(showExportDropdown.calledWith('save'), 'should call toggleSidePanel with share');

  // mound with exportDropdown
  const uiState = {
    ...defaultProps.uiState,
    visibleDropdown: 'save'
  };
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <SidePanel {...defaultProps} uiState={uiState} uiStateActions={uiStateActions} />
      </IntlWrapper>
    );
  }, 'SidePanel should not fail');

  t.end();
});

test('Components -> SidePanel -> PanelHeader -> ExportDropDown', t => {
  const toggleModal = sinon.spy();
  const startExportingImage = sinon.spy();
  const uiStateActions = {
    ...UIStateActions,
    toggleModal,
    startExportingImage
  };

  // mound with exportDropdown
  const uiState = {
    ...defaultProps.uiState,
    visibleDropdown: 'save'
  };

  let wrapper;
  // mount
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <SidePanel {...defaultProps} uiState={uiState} uiStateActions={uiStateActions} />
      </IntlWrapper>
    );
  }, 'SidePanel should not fail');

  t.ok(wrapper.find(SaveExportDropdown).length === 1, 'should render SaveExportDropdown');
  t.equal(wrapper.find(ToolbarItem).length, 3, 'should render 3 ToolbarItem');

  // export image
  t.equal(
    wrapper
      .find(ToolbarItem)
      .at(0)
      .find('.toolbar-item__title')
      .text(),
    'Export Image',
    'Should render Export Image'
  );

  wrapper
    .find(ToolbarItem)
    .at(0)
    .find('.toolbar-item')
    .simulate('click');
  t.ok(toggleModal.calledWith(EXPORT_IMAGE_ID), 'Should call toggleModal with EXPORT_IMAGE_ID');

  // export data
  t.equal(
    wrapper
      .find(ToolbarItem)
      .at(1)
      .find('.toolbar-item__title')
      .text(),
    'Export Data',
    'Should render Export Data'
  );
  wrapper
    .find(ToolbarItem)
    .at(1)
    .find('.toolbar-item')
    .simulate('click');
  t.ok(toggleModal.calledWith(EXPORT_DATA_ID), 'Should call toggleModal with EXPORT_DATA_ID');

  // export map
  t.equal(
    wrapper
      .find(ToolbarItem)
      .at(2)
      .find('.toolbar-item__title')
      .text(),
    'Export Map',
    'Should render Export Map'
  );
  wrapper
    .find(ToolbarItem)
    .at(2)
    .find('.toolbar-item')
    .simulate('click');
  t.ok(toggleModal.calledWith(EXPORT_MAP_ID), 'Should call toggleModal with EXPORT_MAP_ID');

  t.end();
});
