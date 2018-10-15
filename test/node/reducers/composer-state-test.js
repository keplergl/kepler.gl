// Copyright (c) 2018 Uber Technologies, Inc.
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

import test from 'tape';
import keplerGlReducer from 'reducers';
import {addDataToMapComposed, removeLayerDataComposed, appendRowsToDatasetComposed} from 'reducers/composers';
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
  const state = keplerGlReducer({}, registerEntry({id: 'test'})).test;

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
  const state = keplerGlReducer({}, registerEntry({id: 'test'})).test;
  const mapStateProperties = {
    latitude: 29.23, //33.88608913680742,
    longitude: 60.71, //-84.43459130456425
  };
  const newState = addDataToMapComposed(state, {
    payload: {
      datasets: {
        data: mockRawData,
        info: {
          id: 'foo'
        }
      }
    }
  });

  t.equal(newState.mapState.latitude, mapStateProperties.latitude, 'mapstate latitude is set correctly');
  t.equal(newState.mapState.longitude, mapStateProperties.longitude, 'mapstate longitude is set correctly');

  t.end()
});

test('#composerStateReducer - removeLayerDataComposed: visState.layerData', t => {
  // init kepler.gl root and instance
  const state = keplerGlReducer({}, registerEntry({id: 'test'})).test;

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
      }
    }
  });

  const rows = [
    //[12.25, 37.75, 45.21, 100.12],
    //[null, 35.2, 45.0, 21.3],
    [12.29, 37.64, 46.21, 99.127],
    [null, null, 33.1, 29.34]
  ];


  let removeState = removeLayerDataComposed(newState, {
    payload: {
      datasets: {
        data: {
          rows: rows
        }
      },
      options: null,
      config: {
        mapStyle: {
          styleType: 'light'
        }
      },
      key: 'foo'
    }
  });


  removeState.visState.layerData.forEach((layerData, index) => {
    layerData.data.forEach((data, idx) => {
      rows.forEach((rw, po) => {
        let rs = rw.every(e => data.data.includes(e));
        t.equal(rs, false, 'Remove layer data passed');
      });
    });
  });



  let emptyState = removeLayerDataComposed(removeState, {
    payload: {
      datasets: {
        data: {
          rows: []
        }
      },
      options: null,
      config: {
        mapStyle: {
          styleType: 'light'
        }
      },
      key: 'foo'
    }
  });

  emptyState.visState.layerData.forEach((layerData, index) => {
    layerData.data.forEach((data, idx) => {
      rows.forEach((rw, po) => {
        let rs = rw.every(e => data.data.includes(e));
        t.equal(rs, false, 'Remove empty layer data passed');
      });
    });
  });

  t.end();
});

test('#composerStateReducer - appendRowsToDatasetComposed: visState.datasets', t => {
  // init kepler.gl root and instance
  const state = keplerGlReducer({}, registerEntry({id: 'test'})).test;

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

  const rows = [
    //[12.25, 37.75, 45.21, 100.12],
    //[null, 35.2, 45.0, 21.3],
    [14.29, 26.64, 66.21, 88.127],
    [14.29, 26.64, 23.1, 59.34]
  ];

  let addState = appendRowsToDatasetComposed(newState, {
    payload: {
      datasets: {
        data: {
          rows: rows
        }
      },
      options: null,
      config: {
        mapStyle: {
          styleType: 'light'
        }
      },
      key: 'foo'
    }
  });

  t.equal(addState.visState.datasets.foo.data.length, (rows.length + mockRawData.rows.length), 'Add layer data passed');

  addState = removeLayerDataComposed(addState, {
    payload: {
      datasets: {
        data: {
          rows: []
        }
      },
      options: null,
      config: {
        mapStyle: {
          styleType: 'light'
        }
      },
      key: 'foo'
    }
  });

  t.equal(newState.visState.datasets.foo.data.length, mockRawData.rows.length, 'Add empty layer data test passed--');
  t.end();
});
