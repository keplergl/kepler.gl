import test from 'tape';
import cloneDeep from 'lodash.clonedeep';
import SchemaManager from '../../../../schemas/app-schema';

// fixtures
import AppStateSavedV0 from '../../../../../test/schemas/fixtures/app-state-saved-v0.json';
import AppStateSavedV1 from '../../../../../test/schemas/fixtures/app-state-saved-v1.json';
import AppStateSavedTsV1 from '../../../../../test/schemas/fixtures/app-state-saved-ts-v1.json';
/* eslint-disable max-statements */
test('#DatasetSchema -> SchemaManager.parseSavedData', t => {
  const dataSaved = cloneDeep(AppStateSavedV0).datasets;
  const parsedValid = SchemaManager.parseSavedData(dataSaved);

  const expectedInfo0 = {
    id: '9h10t7fyb',
    label: 'sf_trips_small.csv',
    color: [53, 92, 125]
  };
  const expectedRows0 = dataSaved[0].data.allData;
  const expectedFields0 = [
    {
      name: 'app_version',
      type: 'string',
      format: ''
    },
    {
      name: 'begintrip_lat',
      type: 'real',
      format: ''
    },
    {
      name: 'begintrip_lng',
      type: 'real',
      format: ''
    },
    {
      name: 'begintrip_timestamp_local',
      type: 'timestamp',
      format: 'YYYY-M-DTHH:mm:ss.SSSS'
    },
    {
      name: 'client_bill_usd',
      type: 'real',
      format: ''
    },
    {
      name: 'device',
      type: 'string',
      format: ''
    },
    {
      name: 'dropoff_lat',
      type: 'real',
      format: ''
    },
    {
      name: 'dropoff_lng',
      type: 'real',
      format: ''
    },
    {
      name: 'dropoff_timestamp_local',
      type: 'timestamp',
      format: 'YYYY-M-DTHH:mm:ss.SSSS'
    },
    {
      name: 'eta',
      type: 'integer',
      format: ''
    },
    {
      name: 'has_destination',
      type: 'boolean',
      format: ''
    }
  ];

  const expectedDataset0 = {
    info: expectedInfo0,
    data: {
      fields: expectedFields0,
      rows: expectedRows0
    }
  };

  const expectedInfo1 = {
    id: 'v79816te8',
    label: 'sf.zip.geo_small.json',
    color: [192, 108, 132]
  };

  const expectedRows1 = dataSaved[1].data.allData;
  const expectedFields1 = [
    {
      name: '_geojson',
      type: 'geojson',
      format: ''
    },
    {
      name: 'OBJECTID',
      type: 'integer',
      format: ''
    },
    {
      name: 'ZIP_CODE',
      type: 'integer',
      format: ''
    },
    {
      name: 'ID',
      type: 'integer',
      format: ''
    }
  ];

  const expectedDataset1 = {
    info: expectedInfo1,
    data: {
      fields: expectedFields1,
      rows: expectedRows1
    }
  };

  t.equal(parsedValid.length, 2, 'should have 2 datasets');
  t.deepEqual(
    parsedValid[0],
    expectedDataset0,
    'should parse dataset correctly'
  );
  t.deepEqual(
    parsedValid[0].info,
    expectedInfo0,
    'should parse info correctly'
  );
  t.deepEqual(
    parsedValid[0].data.fields,
    expectedFields0,
    'should parse fields correctly'
  );
  t.deepEqual(
    parsedValid[0].data.rows,
    expectedRows0,
    'should parse fields correctly'
  );

  t.deepEqual(
    parsedValid[1],
    expectedDataset1,
    'should parse dataset correctly'
  );
  t.deepEqual(
    parsedValid[1].info,
    expectedInfo1,
    'should parse info correctly'
  );
  t.deepEqual(
    parsedValid[1].data.fields,
    expectedFields1,
    'should parse fields correctly'
  );
  t.deepEqual(
    parsedValid[1].data.rows,
    expectedRows1,
    'should parse fields correctly'
  );

  t.end();
});
/* eslint-enable max-statements */

test('#DatasetSchema -> SchemaManager.parseSavedData.v1', t => {
  const dataSaved = cloneDeep(AppStateSavedV1).datasets;
  const parsedValid = SchemaManager.parseSavedData(dataSaved);

  const expectedInfo = {
    id: 'a5ybmwl2d',
    label: 'geojson_as_string_small.csv',
    color: [53, 92, 125]
  };

  const expectedFields = [
    {name: 'a_zip', type: 'integer', format: ''},
    {name: 'simplified_shape_v2', type: 'geojson', format: ''},
    {name: 'simplified_shape', type: 'geojson', format: ''},
    {name: 'zip_area', type: 'real', format: ''},
    {name: 'c_avg_12wk_tpr', type: 'real', format: ''},
    {name: 'c_zip_type', type: 'string', format: ''},
    {name: 'c_billing_zip', type: 'integer', format: ''},
    {name: 'c_most_freq_trips_local', type: 'real', format: ''},
    {name: 'c_riders', type: 'integer', format: ''},
    {name: 'c_avg_trips_per_rider', type: 'real', format: ''},
    {name: 'c_avg_billings_per_rider', type: 'real', format: ''},
    {name: 'c_churned', type: 'real', format: ''},
    {name: 'c_taken_trips', type: 'real', format: ''},
    {name: 'c_avg_lifetime_months', type: 'real', format: ''},
    {name: 'c_ltv', type: 'real', format: ''},
    {name: 'b_rider_pen', type: 'real', format: ''}
  ];
  const expectedRows = dataSaved[0].data.allData;

  const expectedDataset = {
    info: expectedInfo,
    data: {
      fields: expectedFields,
      rows: expectedRows
    }
  };

  t.equal(parsedValid.length, 1, 'should have 1 dataset');

  t.deepEqual(
    parsedValid[0],
    expectedDataset,
    'should parse dataset correctly'
  );
  t.deepEqual(parsedValid[0].info, expectedInfo, 'should parse info correctly');
  t.deepEqual(
    parsedValid[0].data.fields,
    expectedFields,
    'should parse fields correctly'
  );
  t.deepEqual(
    parsedValid[0].data.rows,
    expectedRows,
    'should parse fields correctly'
  );

  t.end();
});

test('#DatasetSchema -> SchemaManager.parseSavedData.v1 with ts', t => {
  const dataSaved = cloneDeep(AppStateSavedTsV1).datasets;
  const parsedValid = SchemaManager.parseSavedData(dataSaved);

  const expectedInfo = {
    id: 'test_phone_data',
    label: 'sample phone data',
    color: [53, 92, 125]
  };

  const expectedFields = [
    {name: 'trip_uuid', type: 'string', format: ''},
    {name: 'lat', type: 'real', format: ''},
    {name: 'lng', type: 'real', format: ''},
    {name: 'Latitude', type: 'real', format: ''},
    {name: 'Longitude', type: 'real', format: ''},
    {name: 'at_Latitude', type: 'real', format: ''},
    {name: 'at_Longitude', type: 'real', format: ''},
    {name: 'spd', type: 'real', format: ''},
    {name: 'epoch', type: 'timestamp', format: 'x'},
    {name: 'epoch_ms', type: 'timestamp', format: 'X'},
    {name: 'phone_handling', type: 'real', format: ''},
    {name: 'start_ts', type: 'timestamp', format: 'x'},
    {name: 'end_ts', type: 'timestamp', format: 'x'},
    {name: 'time string', type: 'timestamp', format: 'M/D/YYYY H:m'}
  ];

  const expectedRows = dataSaved[0].data.allData;
  const expectedDataset = {
    info: expectedInfo,
    data: {
      fields: expectedFields,
      rows: expectedRows
    }
  };

  t.equal(parsedValid.length, 1, 'should have 1 dataset');

  t.deepEqual(
    parsedValid[0],
    expectedDataset,
    'should parse dataset correctly'
  );
  t.deepEqual(parsedValid[0].info, expectedInfo, 'should parse info correctly');
  t.deepEqual(
    parsedValid[0].data.fields,
    expectedFields,
    'should parse fields correctly'
  );
  t.deepEqual(
    parsedValid[0].data.rows,
    expectedRows,
    'should parse fields correctly'
  );

  t.end();
});
