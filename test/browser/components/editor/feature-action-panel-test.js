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
      color: [123, 123, 123],
      dataContainer: {numRows: () => 4}
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

test('FeatureActionPanel -> extract data', t => {
  const layers = [
    {
      id: 'layer-1',
      config: {
        label: 'layer 1',
        dataId: 'puppy'
      }
    }
  ];
  const datasets = {
    puppy: {
      label: 'puppy.csv',
      color: [123, 123, 123],
      dataContainer: {numRows: () => 4}
    }
  };
  const selectedFeature = {type: 'Feature', geometry: {type: 'Polygon', coordinates: []}};
  const onExtractData = sinon.spy();
  const onClose = sinon.spy();

  const wrapper = mountWithTheme(
    <IntlWrapper>
      <FeatureActionPanel
        className="action-item-test"
        layers={layers}
        datasets={datasets}
        selectedFeature={selectedFeature}
        onToggleLayer={() => {}}
        onDeleteFeature={() => {}}
        onExtractData={onExtractData}
        onClose={onClose}
        position={{x: 0, y: 0}}
      />
    </IntlWrapper>
  );

  t.ok(wrapper.find('.editor-extract-list').length, 'Should show Extract data for polygons');
  t.ok(
    wrapper.find('.extract-layer-panel-item .label').text().includes('from layer 1 layer'),
    'Extract options should name the source layer'
  );

  wrapper.find('.extract-layer-panel-item').simulate('click');
  t.ok(onExtractData.calledOnce, 'Clicking a layer should extract from that layer');
  t.equal(onExtractData.firstCall.args[0].id, 'layer-1', 'Should pass the clicked layer');
  t.ok(onClose.calledOnce, 'Extract should close the action panel');

  const pointWrapper = mountWithTheme(
    <IntlWrapper>
      <FeatureActionPanel
        layers={layers}
        datasets={datasets}
        selectedFeature={{type: 'Feature', geometry: {type: 'Point', coordinates: [0, 0]}}}
        onToggleLayer={() => {}}
        onDeleteFeature={() => {}}
        onExtractData={onExtractData}
        position={{x: 0, y: 0}}
      />
    </IntlWrapper>
  );

  t.equal(
    pointWrapper.find('.editor-extract-list').length,
    0,
    'Should hide Extract data for non-polygon drawings'
  );

  t.end();
});

test('FeatureActionPanel -> extract vector tile dataset', t => {
  const extractLayers = [
    {
      id: 'vt-1',
      type: 'vectorTile',
      config: {
        label: 'Buildings',
        dataId: 'tiles'
      }
    }
  ];
  const datasets = {
    tiles: {
      label: 'buildings.pmtiles',
      color: [123, 123, 123],
      disableDataOperation: true,
      dataContainer: {numRows: () => 0}
    }
  };

  const wrapper = mountWithTheme(
    <IntlWrapper>
      <FeatureActionPanel
        layers={[]}
        extractLayers={extractLayers}
        datasets={datasets}
        selectedFeature={{type: 'Feature', geometry: {type: 'Polygon', coordinates: []}}}
        onToggleLayer={() => {}}
        onDeleteFeature={() => {}}
        position={{x: 0, y: 0}}
      />
    </IntlWrapper>
  );

  t.ok(
    wrapper.find('.extract-layer-panel-item .label').text().includes('from Buildings layer'),
    'Vector tile layers should appear in Extract data'
  );
  t.end();
});
