// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape';
import sinon from 'sinon';

import {InteractionManagerFactory, appInjector} from '@kepler.gl/components';
import {defaultInteractionConfig} from '@kepler.gl/reducers';
import {initApplicationConfig} from '@kepler.gl/utils';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';

const InteractionManager = appInjector.get(InteractionManagerFactory);

const panelMetadata = {id: 'interaction', label: 'sidebar.panels.interaction'};

function expandLegend(wrapper) {
  wrapper.find('.interaction-legend__header').hostNodes().at(0).simulate('click');
  wrapper.update();
}

test('Components -> InteractionManager legend section', t => {
  const layerConfigChange = sinon.spy();
  const updateLayerGroup = sinon.spy();
  const interactionConfigChange = sinon.spy();
  const toggleMapControl = sinon.spy();
  const excludedLayer = {
    id: 'layer-1',
    config: {label: 'Quakes', isIncludedInLegend: false, hidden: false}
  };
  const includedLayer = {
    id: 'layer-2',
    config: {label: 'Cities', hidden: false}
  };
  const layerOrder = [
    {
      id: 'group-1',
      label: 'New group',
      isVisible: true,
      isIncludedInLegend: false,
      layerOrder: ['layer-1']
    },
    'layer-2'
  ];

  const wrapper = mountWithTheme(
    <IntlWrapper>
      <InteractionManager
        interactionConfig={{
          legend: {
            id: 'legend',
            label: 'interactions.legend',
            enabled: true,
            config: {hideInvisibleLayers: false}
          }
        }}
        datasets={{}}
        panelMetadata={panelMetadata}
        layers={[excludedLayer, includedLayer]}
        layerOrder={layerOrder}
        mapLegendActive={true}
        uiStateActions={{toggleMapControl}}
        visStateActions={{
          interactionConfigChange,
          setColumnDisplayFormat: () => {},
          layerConfigChange,
          updateLayerGroup
        }}
      />
    </IntlWrapper>
  );

  t.ok(wrapper.find('.interaction-legend').hostNodes().length >= 1, 'renders legend section');
  t.equal(
    wrapper.find('input#legend-toggle').at(0).prop('checked'),
    true,
    'legend header switch is on when enabled'
  );
  t.equal(
    wrapper.find('.interaction-legend__content').hostNodes().length,
    0,
    'legend settings stay collapsed until opened'
  );

  expandLegend(wrapper);

  const text = wrapper.text();
  t.ok(text.includes('All Layers'), 'renders the All Layers heading');
  t.ok(
    wrapper.find('.interaction-legend .side-panel-divider').hostNodes().length >= 1,
    'renders a separator before the layer list'
  );
  t.ok(text.includes('Quakes'), 'lists an excluded layer so it can be restored');
  t.ok(text.includes('New group'), 'lists an excluded group so it can be restored');
  t.ok(text.includes('Cities'), 'lists an included layer');

  wrapper.find('input#legend-include-layer-1').at(0).simulate('change');
  t.equal(layerConfigChange.callCount, 1, 'toggling a layer updates layer config');
  t.equal(layerConfigChange.args[0][0].id, 'layer-1');
  t.deepEqual(layerConfigChange.args[0][1], {isIncludedInLegend: true});

  wrapper.find('input#legend-include-group-1').at(0).simulate('change');
  t.equal(updateLayerGroup.callCount, 1, 'toggling a group updates the group');
  t.deepEqual(updateLayerGroup.args[0][0], {
    id: 'group-1',
    options: {isIncludedInLegend: true}
  });

  wrapper.find('input#legend-include-layer-2').at(0).simulate('change');
  t.deepEqual(layerConfigChange.args[1][1], {isIncludedInLegend: false});

  t.equal(
    wrapper.find('input#legend-hide-invisible').at(0).prop('checked'),
    false,
    'hide hidden layers starts off'
  );
  wrapper.find('input#legend-hide-invisible').at(0).simulate('change');
  t.equal(
    interactionConfigChange.callCount,
    1,
    'toggling hide hidden layers updates interaction config'
  );
  t.equal(interactionConfigChange.args[0][0].id, 'legend');
  t.deepEqual(interactionConfigChange.args[0][0].config, {hideInvisibleLayers: true});

  wrapper.find('input#legend-toggle').at(0).simulate('change');
  t.equal(
    interactionConfigChange.callCount,
    2,
    'toggling the legend header switch updates interaction config'
  );
  t.equal(interactionConfigChange.args[1][0].enabled, false);
  // Turning off while the map legend is open should close it.
  t.equal(toggleMapControl.callCount, 1, 'disabling Interactions legend closes the map legend');
  t.deepEqual(toggleMapControl.args[0], ['mapLegend', 0]);
  t.ok(
    wrapper.find('.interaction-legend__content').hostNodes().length >= 1,
    'disabling the feature keeps the settings section open'
  );

  t.end();
});

test('Components -> InteractionManager legend section default off', t => {
  const wrapper = mountWithTheme(
    <IntlWrapper>
      <InteractionManager
        interactionConfig={defaultInteractionConfig}
        datasets={{}}
        panelMetadata={panelMetadata}
        layers={[{id: 'layer-1', config: {label: 'Quakes', hidden: false}}]}
        visStateActions={{
          interactionConfigChange: () => {},
          setColumnDisplayFormat: () => {},
          layerConfigChange: () => {},
          updateLayerGroup: () => {}
        }}
      />
    </IntlWrapper>
  );

  t.equal(
    wrapper.find('input#legend-toggle').at(0).prop('checked'),
    false,
    'legend header switch starts off by default'
  );
  t.equal(
    wrapper.find('.interaction-legend__content').hostNodes().length,
    0,
    'hides legend settings by default'
  );
  t.end();
});

test('Components -> InteractionManager legend switch syncs map control', t => {
  const interactionConfigChange = sinon.spy();
  const toggleMapControl = sinon.spy();

  const wrapper = mountWithTheme(
    <IntlWrapper>
      <InteractionManager
        interactionConfig={{
          legend: {
            id: 'legend',
            label: 'interactions.legend',
            enabled: false,
            config: {hideInvisibleLayers: false}
          }
        }}
        datasets={{}}
        panelMetadata={panelMetadata}
        layers={[{id: 'layer-1', config: {label: 'Quakes', hidden: false}}]}
        mapLegendActive={false}
        uiStateActions={{toggleMapControl}}
        visStateActions={{
          interactionConfigChange,
          setColumnDisplayFormat: () => {},
          layerConfigChange: () => {},
          updateLayerGroup: () => {}
        }}
      />
    </IntlWrapper>
  );

  wrapper.find('input#legend-toggle').at(0).simulate('change');
  t.equal(interactionConfigChange.args[0][0].enabled, true);
  t.equal(toggleMapControl.callCount, 1, 'enabling Interactions legend opens the map legend');
  t.deepEqual(toggleMapControl.args[0], ['mapLegend', 0]);
  t.equal(
    wrapper.find('.interaction-legend__content').hostNodes().length,
    0,
    'enabling the feature does not open settings by itself'
  );

  t.end();
});

test('Components -> InteractionManager legend settings expand independently', t => {
  const wrapper = mountWithTheme(
    <IntlWrapper>
      <InteractionManager
        interactionConfig={{
          legend: {
            id: 'legend',
            label: 'interactions.legend',
            enabled: false,
            config: {hideInvisibleLayers: false}
          }
        }}
        datasets={{}}
        panelMetadata={panelMetadata}
        layers={[{id: 'layer-1', config: {label: 'Quakes', hidden: false}}]}
        visStateActions={{
          interactionConfigChange: () => {},
          setColumnDisplayFormat: () => {},
          layerConfigChange: () => {},
          updateLayerGroup: () => {}
        }}
      />
    </IntlWrapper>
  );

  t.equal(
    wrapper.find('input#legend-toggle').at(0).prop('checked'),
    false,
    'legend header switch is off'
  );
  t.equal(
    wrapper.find('.interaction-legend__content').hostNodes().length,
    0,
    'settings start collapsed'
  );

  expandLegend(wrapper);

  t.ok(
    wrapper.find('.interaction-legend__content').hostNodes().length >= 1,
    'settings can open while the feature switch is off'
  );
  t.ok(wrapper.text().includes('Quakes'), 'lists layers while the feature is disabled');

  t.end();
});

test('Components -> InteractionManager map info section', t => {
  const setMapInfo = sinon.spy();
  const setMapControlVisibility = sinon.spy();
  const toggleMapControl = sinon.spy();

  const wrapper = mountWithTheme(
    <IntlWrapper>
      <InteractionManager
        interactionConfig={defaultInteractionConfig}
        datasets={{}}
        panelMetadata={panelMetadata}
        mapInfo={{title: undefined, description: undefined}}
        mapInfoShow={true}
        mapInfoActive={true}
        uiStateActions={{setMapControlVisibility, toggleMapControl}}
        visStateActions={{
          interactionConfigChange: () => {},
          setColumnDisplayFormat: () => {},
          setMapInfo,
          layerConfigChange: () => {},
          updateLayerGroup: () => {}
        }}
      />
    </IntlWrapper>
  );

  t.ok(wrapper.find('.interaction-map-info').hostNodes().length >= 1, 'renders map info section');
  t.equal(
    wrapper.find('input#map-info-toggle').at(0).prop('checked'),
    true,
    'map info switch starts on'
  );
  t.equal(
    wrapper.find('.interaction-map-info__content').hostNodes().length,
    0,
    'name and description stay collapsed until opened'
  );

  wrapper.find('.interaction-map-info__header').hostNodes().at(0).simulate('click');
  wrapper.update();

  t.ok(
    wrapper.find('.interaction-map-info__content').hostNodes().length >= 1,
    'opening settings shows name and description'
  );
  t.equal(wrapper.find('input#interaction-map-name').at(0).prop('value'), '', 'name starts unset');
  t.equal(
    wrapper.find('textarea#interaction-map-description').at(0).prop('value'),
    '',
    'description starts unset'
  );
  t.equal(
    wrapper.find('textarea#interaction-map-description').at(0).prop('rows'),
    2,
    'description is a two-line text area'
  );

  wrapper
    .find('input#interaction-map-name')
    .at(0)
    .simulate('change', {target: {value: 'Harbor'}});
  t.deepEqual(setMapInfo.args[0][0], {title: 'Harbor'}, 'editing the name updates map info');

  wrapper.find('input#map-info-toggle').at(0).simulate('change');
  t.deepEqual(
    setMapControlVisibility.args[0],
    ['mapInfo', false],
    'turning the switch off hides the on-map card'
  );
  t.equal(toggleMapControl.callCount, 0, 'hiding the card does not collapse it');

  t.end();
});

test('Components -> InteractionManager map info section can be disabled', t => {
  initApplicationConfig({enableMapInfo: false});
  const wrapper = mountWithTheme(
    <IntlWrapper>
      <InteractionManager
        interactionConfig={defaultInteractionConfig}
        datasets={{}}
        panelMetadata={panelMetadata}
        mapInfo={{title: 'Harbor', description: 'Ferry routes'}}
        mapInfoShow={true}
        visStateActions={{
          interactionConfigChange: () => {},
          setColumnDisplayFormat: () => {},
          setMapInfo: () => {},
          layerConfigChange: () => {},
          updateLayerGroup: () => {}
        }}
      />
    </IntlWrapper>
  );

  t.equal(
    wrapper.find('.interaction-map-info').hostNodes().length,
    0,
    'hides the map info section when enableMapInfo is false'
  );

  initApplicationConfig({enableMapInfo: true});
  t.end();
});
