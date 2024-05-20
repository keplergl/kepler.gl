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
