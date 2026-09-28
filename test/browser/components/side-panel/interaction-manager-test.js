// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape';
import sinon from 'sinon';

import {InteractionManagerFactory, appInjector} from '@kepler.gl/components';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';

const InteractionManager = appInjector.get(InteractionManagerFactory);

const panelMetadata = {id: 'interaction', label: 'sidebar.panels.interaction'};

test('Components -> InteractionManager legend section', t => {
  const layerConfigChange = sinon.spy();
  const updateLayerGroup = sinon.spy();
  const interactionConfigChange = sinon.spy();
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
        interactionConfig={{}}
        datasets={{}}
        panelMetadata={panelMetadata}
        layers={[excludedLayer, includedLayer]}
        layerOrder={layerOrder}
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
    'legend header switch starts on'
  );
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

  t.end();
});

test('Components -> InteractionManager legend section disabled', t => {
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
    'hides legend settings when the global switch is off'
  );
  t.end();
});
