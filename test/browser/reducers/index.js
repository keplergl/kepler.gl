// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {visStateReducer as reducer} from '@kepler.gl/reducers';
import CloneDeep from 'lodash.clonedeep';
import test from 'tape-catch';
import {StateWFiles, testCsvDataId, testGeoJsonDataId} from 'test/helpers/mock-state';
import {VisStateActions} from '@kepler.gl/actions';

test('#visStateReducer -> COPY_TABLE_COLUMN', t => {
  const initialState = CloneDeep(StateWFiles.visState);
  const nextState = reducer(initialState, VisStateActions.copyTableColumn());
  t.equal(nextState, initialState, 'state should not change when input is not given');

  reducer(nextState, VisStateActions.copyTableColumn(testCsvDataId, 'gps_data.lat'));
  const expectedCopy =
    '29.9900937\n29.9927699\n29.9907261\n29.9870074\n29.9923041\n29.9968249\n30.0037217\n30.0116207\n30.0208925\n30.0218999\n30.0229344\n30.0264237\n30.0292134\n30.034391\n30.0352752\n30.0395918\n30.0497387\n30.0538936\n30.060911\n30.060334\n30.0554663\n30.0614122\n30.0612697\n30.0610977';

  t.equal(window.clipboardData.data().text, expectedCopy, 'should copy to clipboard');

  reducer(nextState, VisStateActions.copyTableColumn(testGeoJsonDataId, '_geojson'));

  const expectedCopy2 =
    `{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-122.40115971858505,37.78202426695214],[-122.40037436684331,37.78264451554517],[-122.40001902006377,37.782925153640136],[-122.39989147796784,37.783025880124256],[-122.398930331093,37.783784933304034]]]},"properties":{"OBJECTID":1,"ZIP_CODE":94107,"ID":94107,"TRIPS":11,"RATE":"a","OBJ":{"id":1}}}\n` +
    `{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-122.39249932896719,37.79376881413398],[-122.39189026034138,37.79427854456892],[-122.39166672864975,37.794132425256194],[-122.39172303426619,37.79410061945832],[-122.39249932896719,37.79376881413398]]]},"properties":{"OBJECTID":2,"ZIP_CODE":94105,"ID":94105,"TRIPS":4,"RATE":"b","OBJ":{"id":2}}}\n` +
    `{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-122.39249932896719,37.79376881413398],[-122.39189026034138,37.79427854456892],[-122.39198201510793,37.79387190612868],[-122.39249932896719,37.79376881413398]]]},"properties":{"OBJECTID":3,"ZIP_CODE":94109,"ID":94109,"TRIPS":20,"RATE":null,"OBJ":{"id":3}}}\n` +
    `{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-122.39249932896719,37.79376881413398],[-122.39166672864975,37.794132425256194],[-122.39172303426619,37.79410061945832],[-122.3916732283519,37.7940478541246],[-122.39198201510793,37.79387190612868],[-122.39249932896719,37.79376881413398]]]},"properties":{"OBJECTID":4,"ZIP_CODE":94111,"ID":94111,"RATE":"c","OBJ":{"id":4},"TRIPS":null}}\n` +
    `{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-122.39249932896719,37.79376881413398],[-122.39189026034138,37.79427854456892],[-122.39178886557242,37.794170982455135],[-122.39249932896719,37.79376881413398]]]},"properties":{"OBJECTID":5,"ZIP_CODE":94107,"ID":9409,"RATE":"c","OBJ":{"id":5},"TRIPS":null}}`;

  t.equal(window.clipboardData.data().text, expectedCopy2, 'should copy to clipboard');
  t.end();
});
