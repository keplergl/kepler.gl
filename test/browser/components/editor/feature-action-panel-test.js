// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape';
import sinon from 'sinon';
import {PureFeatureActionPanelFactory} from '@kepler.gl/components';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';

const FeatureActionPanel = PureFeatureActionPanelFactory();

test('FeatureActionPanel -> display layers', t => {
  const layers = [
    {
      config: {
        label: 'layer 1',
        dataId: 'puppy'
      }
    },
    {
      config: {
        label: 'layer 2',
        dataId: 'puppy'
      }
    }
  ];

  const datasets = {
    puppy: {
      color: [123, 123, 123]
    }
  };

  const selectedFeature = {type: 'Feature', geometry: {type: 'Polygon', coordinates: []}};

  const onToggleLayer = sinon.spy();
  const onDeleteFeature = sinon.spy();

  let wrapper;

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <FeatureActionPanel
          className="action-item-test"
          layers={layers}
          datasets={datasets}
          selectedFeature={selectedFeature}
          onToggleLayer={onToggleLayer}
          onDeleteFeature={onDeleteFeature}
          position={{x: 0, y: 0}}
        />
      </IntlWrapper>
    );
  }, 'FeatureActionPanel should not fail mount');

  t.equal(wrapper.find('Checkbox').length, 2, 'We should display only 2 layer checkbox');
  for (let i = 0; i < wrapper.find('Checkbox').length; i++) {
    t.equal(
      wrapper.find('Checkbox').at(i).find('label').text(),
      `layer ${i + 1}`,
      'should render correct layer label'
    );
  }

  t.end();
});

test('FeatureActionPanel -> edit properties', t => {
  const selectedFeature = {
    type: 'Feature',
    id: 'point-1',
    properties: {},
    geometry: {type: 'Point', coordinates: [0, 0]}
  };
  const onSetFeatureProperties = sinon.spy();
  const wrapper = mountWithTheme(
    <IntlWrapper>
      <FeatureActionPanel
        className="action-item-test"
        layers={[]}
        datasets={{}}
        selectedFeature={selectedFeature}
        onToggleLayer={() => {}}
        onDeleteFeature={() => {}}
        onSetFeatureProperties={onSetFeatureProperties}
        position={{x: 0, y: 0}}
      />
    </IntlWrapper>
  );

  t.equal(
    wrapper.find('.feature-properties-editor').length,
    0,
    'Properties editor should be hidden until requested'
  );

  wrapper.find('.edit-properties-panel-item').simulate('click');
  wrapper.update();

  t.ok(
    wrapper.find('.feature-properties-editor').length,
    'Clicking Edit Properties should open the properties table'
  );

  wrapper
    .find('.feature-property-name')
    .at(0)
    .simulate('change', {target: {value: 'name'}});
  wrapper.update();
  wrapper
    .find('.feature-property-value')
    .at(0)
    .simulate('change', {target: {value: 'Park'}});

  t.ok(onSetFeatureProperties.called, 'Should save properties when a named row has a value');
  t.deepEqual(
    onSetFeatureProperties.lastCall.args[1],
    {name: 'Park'},
    'Should pass user properties without editor internals'
  );

  t.end();
});
