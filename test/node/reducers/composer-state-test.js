import test from 'tape';
import keplerGlReducer from 'reducers';
import {addDataToMapComposed} from 'reducers/composers';
import {keplerGlInit} from 'actions/actions';
import {coreReducerFactory} from 'reducers/core';
import {registerEntry} from 'actions/identity-actions';

const mockRawData = {
  fields: [
    {
      name: 'start_point_lat',
      type: 'real',
      tableFieldIndex: 1
    },
    {
      name: 'start_point_lng',
      type: 'real',
      tableFieldIndex: 3
    },
    {
      name: 'end_point_lat',
      type: 'real',
      tableFieldIndex: 4
    },
    {
      name: 'end_point_lng',
      type: 'real',
      tableFieldIndex: 2
    }
  ],
  rows: [
    [12.25, 37.75, 45.21, 100.12],
    [null, 35.2, 45.0, 21.3],
    [12.29, 37.64, 46.21, 99.127],
    [null, null, 33.1, 29.34]
  ]
};

test('#composerStateReducer - addDataToMapComposed: mapStyle', t => {
  // init kepler.gl root and instance
  const state = keplerGlReducer({}, registerEntry('test')).test;

  const newState = addDataToMapComposed(state, {
    payload: {
      datasets: {
        data: mockRawData,
        info: {
          id: 'foo'
        }
      },
      options: null,
      config: {
        mapStyle: {
          styleType: 'light'
        }
      }
    }
  });

  t.equal(newState.mapStyle.styleType, 'light', 'Map style is set correctly');

  t.end();
});

test('#composerStateReducer - addDataToMapComposed: mapState should not be centered', t => {
  // init kepler.gl root and instance
  const state = keplerGlReducer({}, registerEntry('test')).test;
  const mapStateProperties = {
    latitude: 33.88608913680742,
    longitude: -84.43459130456425
  };
  const newState = addDataToMapComposed(state, {
    payload: {
      datasets: {
        data: mockRawData,
        info: {
          id: 'foo'
        }
      },
      options: {
        centerMap: true
      },
      config: {
        mapState: mapStateProperties
      }
    }
  });

  t.equal(newState.mapState.latitude, mapStateProperties.latitude, 'mapstate latitude is set correctly');
  t.equal(newState.mapState.longitude, mapStateProperties.longitude, 'mapstate longitude is set correctly');

  t.end()
});
