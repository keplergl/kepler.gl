// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable max-statements */
import React from 'react';
import sinon from 'sinon';
import test from 'tape';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import {GeocoderPanelFactory, appInjector, testForCoordinates} from '@kepler.gl/components';
import {cmpDatasetData, cmpObjectKeys} from '../../helpers/comparison-utils';

import {InitialState} from 'test/helpers/mock-state';

const GeocoderPanel = appInjector.get(GeocoderPanelFactory);
const MAPBOX_TOKEN = process.env.MapboxAccessToken;

test('GeocoderPanel - render', t => {
  const enabled = true;
  const updateVisData = sinon.spy();
  const removeDataset = sinon.spy();
  const updateMap = sinon.spy();
  const mockMapState = {
    latitude: 33,
    longitude: 127,
    zoom: 8,
    width: 800,
    height: 800
  };
  const layerOrder = ['layer_1', 'layer_2'];
  const mockUiState = InitialState.uiState;

  const mockGeoItem = {
    center: [1, 55],
    text: 'mock',
    bbox: [-1, 50, 4, 65]
  };

  const mockGeoItemWithOutBbox = {
    center: [1, 55],
    text: 'mock'
  };

  const mockPayload = [
    [
      {
        data: {
          fields: [
            {
              name: 'lt',
              id: 'lt',
              displayName: 'lt',
              format: '',
              fieldIdx: 0,
              type: 'integer',
              analyzerType: 'INT',
              valueAccessor: values => values[0]
            },
            {
              name: 'ln',
              id: 'ln',
              displayName: 'ln',
              format: '',
              fieldIdx: 1,
              type: 'integer',
              analyzerType: 'INT',
              valueAccessor: values => values[1]
            },
            {
              name: 'icon',
              id: 'icon',
              displayName: 'icon',
              format: '',
              fieldIdx: 2,
              type: 'string',
              analyzerType: 'STRING',
              valueAccessor: values => values[2]
            },
            {
              name: 'text',
              id: 'text',
              displayName: 'text',
              format: '',
              fieldIdx: 3,
              type: 'string',
              analyzerType: 'STRING',
              valueAccessor: values => values[3]
            }
          ],
          rows: [[55, 1, 'place', 'mock']]
        },
        info: {
          hidden: true,
          id: 'geocoder_dataset',
          label: 'geocoder_dataset'
        }
      }
    ],
    {
      keepExistingConfig: true
    },
    {
      visState: {
        layers: [
          {
            id: 'geocoder_layer',
            type: 'icon',
            config: {
              label: 'Geocoder Layer',
              color: [255, 0, 0],
              dataId: 'geocoder_dataset',
              columns: {
                lat: 'lt',
                lng: 'ln',
                icon: 'icon',
                label: 'text'
              },
              isVisible: true,
              hidden: true,
              visConfig: {
                radius: 80
              }
            }
          }
        ],
        layerOrder: ['geocoder_layer', 'layer_1', 'layer_2']
      }
    }
  ];

  let wrapper;

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <GeocoderPanel
          isGeocoderEnabled={enabled}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          mapState={mockMapState}
          uiState={mockUiState}
          updateVisData={updateVisData}
          removeDataset={removeDataset}
          updateMap={updateMap}
          layerOrder={layerOrder}
        />
      </IntlWrapper>
    );
  }, 'Should render');

  t.equal(wrapper.find(GeocoderPanel).length, 1, 'Should display 1 GeoCoderPanel');
  t.equal(wrapper.find('Geocoder').length, 0, 'Should display 0 Geocoder because of invalid key');

  const instance = wrapper.find(GeocoderPanel).instance();

  instance.onSelected(null, mockGeoItem);
  t.deepEqual(
    removeDataset.args,
    [['geocoder_dataset']],
    'Should call removeDataset on onSelected'
  );

  cmpObjectKeys(
    t,
    [mockPayload],
    updateVisData.args,
    'onSelected payload should have the correct params'
  );
  const actualDatasets = updateVisData.args[0][0];
  const mockDatasets = mockPayload[0];

  mockDatasets.forEach(mockDataset => {
    const {data: mockDatasetData, ...restMockDataset} = mockDataset;
    const {data: actualDatasetData, ...restActualDataset} = actualDatasets[0];
    cmpDatasetData(t, mockDatasetData, actualDatasetData, mockDataset.id);
    t.deepEqual(
      restActualDataset,
      restMockDataset,
      `onSelected options dataset.${mockDataset.id} should be the same`
    );
  });

  t.deepEqual(updateVisData.args[0][1], mockPayload[1], 'onSelected options should be correct');
  t.deepEqual(
    updateVisData.args[0][2],
    mockPayload[2],
    'onSelected configuration should be correct'
  );
  const newVP = updateMap.args[0][0];

  t.deepEqual(
    {latitude: newVP.latitude, longitude: newVP.longitude, zoom: newVP.zoom},
    {latitude: 57.5, longitude: 1.5, zoom: 4},
    'Should call updateMap action on onSelected w/ new viewport'
  );

  t.ok(newVP.transitionInterpolator, 'Should call updateMap action with transitionInterpolator');

  instance.onSelected(null, mockGeoItemWithOutBbox);

  const newVP2 = updateMap.args[1][0];
  t.deepEqual(
    {latitude: newVP2.latitude, longitude: newVP2.longitude, zoom: newVP2.zoom},
    {latitude: 55, longitude: 1, zoom: 11},
    'Should call updateMapaction on onSelected w/o bbox'
  );

  instance.removeMarker();
  t.deepEqual(
    removeDataset.args[1],
    ['geocoder_dataset'],
    'Should be dispatching removeDataset action on removeMarker'
  );

  instance.removeGeocoderDataset();
  t.deepEqual(
    removeDataset.args[2],
    ['geocoder_dataset'],
    'Should be dispatching removeDataset action on removeGeocoderDataset'
  );

  t.end();
});

test('Geocoder -> testForCoordinates', t => {
  t.deepEqual(
    testForCoordinates('21.22,-138.0'),
    [true, 21.22, -138.0],
    'should recognize valid coordinates'
  );

  t.deepEqual(
    testForCoordinates('san francisco'),
    [false, 'san francisco'],
    'should recognize invalid coordinates'
  );

  t.deepEqual(
    testForCoordinates('91,123'),
    [false, '91,123'],
    'should recognize invalid coordinates'
  );

  t.deepEqual(
    testForCoordinates('-21.122, -123.4321'),
    [true, -21.122, -123.4321],
    'should recognize valid coordinates'
  );
  t.end();
});
