import test from 'tape';
import {
  findDefaultLayer,
  _getAllPossibleColumnParis,
  _findDefaultHexagonIdLayer,
  _findDefaultGeojsonLayer,
  _findDefaultIconLayers,
  _findDefaultArcLayers,
  _findDefaultAggregationLayers
} from 'utils/layer-utils/layer-utils';

import {findPointFieldPairs} from 'utils/dataset-utils';
import {processCsvData} from 'processor/data-processor';
import {GEOJSON_FIELDS} from 'constants/default-settings';
import {PointLayer, ArcLayer, GeojsonLayer, GridLayer} from 'keplergl-layers';

import {wktCsv} from 'test/fixtures/test-csv-data';
import {cmpLayers} from 'test/helpers/comparison-utils';

test('layerUtils -> findDefaultLayer.1', t => {
  const inputFields = [
    // layer 1
    {
      name: 'one_lat',
      tableFieldIndex: 1
    },
    {
      name: 'one_lng',
      tableFieldIndex: 2
    },
    // layer 2
    {
      name: 'two_two.lng',
      tableFieldIndex: 3
    },
    {
      name: 'two_two.lat',
      tableFieldIndex: 4
    },
    // layer 3
    {
      name: 'three longitude',
      tableFieldIndex: 5
    },
    {
      name: 'three latitude',
      tableFieldIndex: 6
    },
    // layer 4
    {
      name: 'four._.lon',
      tableFieldIndex: 7
    },
    {
      name: 'four._.lat',
      tableFieldIndex: 8
    },
    // layer 5
    {
      name: 'lat',
      tableFieldIndex: 9
    },
    {
      name: 'lon',
      tableFieldIndex: 10
    },
    // non layer
    //
    {
      name: 'non_layer_longitude.alt',
      tableFieldIndex: 11
    },
    {
      name: 'non_layer_latitude.alt',
      tableFieldIndex: 12
    }
  ];

  const dataId = 'testtest';

  const outputLayers = [
    new ArcLayer({
      label: 'one -> two two arc',
      dataId,
      columns: {
        lat0: {
          value: 'one_lat',
          fieldIdx: 0
        },
        lng0: {
          value: 'one_lng',
          fieldIdx: 1
        },
        lat1: {
          value: 'two_two.lat',
          fieldIdx: 3
        },
        lng1: {
          value: 'two_two.lng',
          fieldIdx: 2
        }
      }
    }),
    new PointLayer({
      label: 'one',
      dataId,
      isVisible: true,
      columns: {
        lat: {
          value: 'one_lat',
          fieldIdx: 0
        },
        lng: {
          value: 'one_lng',
          fieldIdx: 1
        },
        altitude: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    }),
    new PointLayer({
      label: 'two two',
      dataId,
      columns: {
        lat: {
          value: 'two_two.lat',
          fieldIdx: 3
        },
        lng: {
          value: 'two_two.lng',
          fieldIdx: 2
        },
        altitude: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    }),
    new PointLayer({
      label: 'three',
      dataId,
      columns: {
        lat: {
          value: 'three latitude',
          fieldIdx: 5
        },
        lng: {
          value: 'three longitude',
          fieldIdx: 4
        },
        altitude: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    }),
    new PointLayer({
      label: 'four',
      dataId,
      columns: {
        lat: {
          value: 'four._.lat',
          fieldIdx: 7
        },
        lng: {
          value: 'four._.lon',
          fieldIdx: 6
        },
        altitude: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    }),
    new PointLayer({
      label: 'Point',
      dataId,
      columns: {
        lat: {
          value: 'lat',
          fieldIdx: 8
        },
        lng: {
          value: 'lon',
          fieldIdx: 9
        },
        altitude: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    })
  ];

  const fieldPairs = findPointFieldPairs(inputFields);
  const layers = findDefaultLayer({fields: inputFields, fieldPairs, id: dataId});

  t.equal(layers.length, 6, 'number of layers found');

  layers.forEach((l, i) => cmpLayers(t, outputLayers[i], l));

  t.end();
});

test('layerUtils -> findDefaultLayer.2', t => {

  const inputFields = [
    // layer 1
    {
      name: 'all_points',
      tableFieldIndex: 1
    }
  ];

  const dataId = 'cool';

  const outputLayers = [
    new GeojsonLayer({
      label: 'geojson',
      isVisible: true,
      dataId,
      columns: {
        geojson: {
          value: 'all_points',
          fieldIdx: 0
        }
      }
    })
  ];

  const fieldPairs = findPointFieldPairs(inputFields);
  const layers = findDefaultLayer({fields: inputFields, fieldPairs, id: dataId});

  t.equal(layers.length, 1, 'number of layers found');
  cmpLayers(t, outputLayers[0], layers[0]);

  t.end();
});

test('layerUtils -> findDefaultLayer.3', t => {
  const dataId = 'cool';

  const inputFields = [
    // layer 1 & 2
    {
      name: 'begintrip_lat',
      tableFieldIndex: 1
    },
    {
      name: 'begintrip_lng',
      tableFieldIndex: 2
    }
  ];

  const outputLayers = [
    new PointLayer({
      label: 'begintrip',
      dataId,
      isVisible: true,
      columns: {
        lat: {
          value: 'begintrip_lat',
          fieldIdx: 0
        },
        lng: {
          value: 'begintrip_lng',
          fieldIdx: 1
        },
        altitude: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    })
  ];

  const fieldPairs = findPointFieldPairs(inputFields);
  const layers = findDefaultLayer({fields: inputFields, fieldPairs, id: dataId});

  t.equal(layers.length, 1, 'number of layers found');
  layers.forEach((l, i) => cmpLayers(t, outputLayers[i], l));

  t.end();
});

test('layerUtils -> findDefaultLayer.4', t => {

  // Since all defaults layers are scanned and they
  // share field names or patterns.  This set produces
  // multiple layers.
  // Order determined by the order
  // the defaults are scanned inside the function under test.
  const inputFields = [
    // layer 1 (grid), 2 (arc), 3 (point)
    {
      name: 'begintrip_lat',
      tableFieldIndex: 1
    },
    {
      name: 'begintrip_lng',
      tableFieldIndex: 2
    },
    // layer 2 (arc), 4 (point)
    {
      name: 'dropoff_lat',
      tableFieldIndex: 3
    },
    {
      name: 'dropoff_lng',
      tableFieldIndex: 4
    }
  ];

  const dataId = 'yololo';
  const outputLayers = [
    new ArcLayer({
      label: 'trip arc',
      dataId,
      columns: {
        lat0: {
          value: 'begintrip_lat',
          fieldIdx: 0
        },
        lng0: {
          value: 'begintrip_lng',
          fieldIdx: 1
        },
        lat1: {
          value: 'dropoff_lat',
          fieldIdx: 2
        },
        lng1: {
          value: 'dropoff_lng',
          fieldIdx: 3
        }
      }
    }),
    new PointLayer({
      label: 'begintrip',
      dataId,
      isVisible: true,
      columns: {
        lat: {
          value: 'begintrip_lat',
          fieldIdx: 0
        },
        lng: {
          value: 'begintrip_lng',
          fieldIdx: 1
        },
        altitude: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    }),
    new PointLayer({
      label: 'dropoff',
      dataId,
      columns: {
        lat: {
          value: 'dropoff_lat',
          fieldIdx: 2
        },
        lng: {
          value: 'dropoff_lng',
          fieldIdx: 3
        },
        altitude: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    })
  ];

  const fieldPairs = findPointFieldPairs(inputFields);
  const layers = findDefaultLayer({fields: inputFields, fieldPairs, id: dataId});

  t.equal(layers.length, 3, 'number of layers found');
  layers.forEach((l, i) => cmpLayers(t, outputLayers[i], l));

  t.end();
});

test('layerUtils -> findDefaultLayer.5', t => {

  const inputFields = [
    // layer 1
    {
      name: 'one_late',
      tableFieldIndex: 1
    },
    {
      name: 'one_lng',
      tableFieldIndex: 2
    }
  ];

  const fieldPairs = findPointFieldPairs(inputFields);
  const layers = findDefaultLayer({fields: inputFields, fieldPairs, id: 'yo'});

  t.equal(layers.length, 0, 'number of layers found');

  t.end();
});

test('layerUtils -> _findDefaultAggregationLayers', t => {
  const pointLayers = [
    new PointLayer({
      label: 'begintrip',
      dataId: 'yoyo',
      columns: {
        lat: {
          value: 'begintrip_lat',
          fieldIdx: 0
        },
        lng: {
          value: 'begintrip_lng',
          fieldIdx: 1
        },
        altitude: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    })
  ];

  const expGridLayers = [
    new GridLayer({
      label: 'begintrip grid',
      dataId: 'yoyo',
      columns: {
        lat: {
          value: 'begintrip_lat',
          fieldIdx: 0
        },
        lng: {
          value: 'begintrip_lng',
          fieldIdx: 1
        }
      }
    })
  ];

  const gridLayers = _findDefaultAggregationLayers(pointLayers, 'grid');
  cmpLayers(t, expGridLayers, gridLayers);
  t.end();
});

test('layerUtils -> _findDefaultGeojsonLayer', t => {
  const fields = [{
    name: 'begintrip_lat',
    tableFieldIndex: 1
  }, {
    name: 'begintrip_lng',
    tableFieldIndex: 2
  }, {
    name: 'dropoff_lat',
    tableFieldIndex: 3
  }, {
    name: 'dropoff_lng',
    tableFieldIndex: 4
  }, {
    name: GEOJSON_FIELDS.geojson[0],
    tableFieldIndex: 5
  }, {
    name: GEOJSON_FIELDS.geojson[1],
    tableFieldIndex: 6
  }];

  const geojsonLayers = _findDefaultGeojsonLayer(fields, 'smoothie', 'what');

  const expectedGeojsonLayers = [
    new GeojsonLayer({
      label: 'what',
      dataId: 'smoothie',
      isVisible: true,
      columns: {
        geojson: {value: GEOJSON_FIELDS.geojson[0], fieldIdx: 4}
      }
    }),
    new GeojsonLayer({
      label: 'what',
      dataId: 'smoothie',
      isVisible: true,
      columns: {
        geojson: {value: GEOJSON_FIELDS.geojson[1], fieldIdx: 5}
      }
    })
  ];

  cmpLayers(t, expectedGeojsonLayers, geojsonLayers);
  t.end();
});

test('layerUtils -> _findDefaultGeojsonLayer.wkt', async t => {
  const {fields} = await processCsvData(wktCsv);
  const dataId = '0dj3h';
  const label = 'some geometry file';

  const geojsonLayers = _findDefaultGeojsonLayer(fields, dataId, label);

  const expectedLayers = [
    new GeojsonLayer({
      dataId: '0dj3h',
      label: 'some geometry file',
      isVisible: true,
      columns: {
        geojson: {value: 'simplified_shape_v2', fieldIdx: 1}
      }
    }),
    new GeojsonLayer({
      dataId: '0dj3h',
      label: 'some geometry file',
      isVisible: true,
      columns: {
        geojson: {value: 'simplified_shape', fieldIdx: 2}
      }
    })
  ];

  cmpLayers(t, expectedLayers, geojsonLayers);
  t.end();
});

test('layerUtils -> _findDefaultIconLayers', t => {

  const inputFields = [{
    name: 'begintrip_lat',
    tableFieldIndex: 1
  }, {
    name: 'begintrip_lng',
    tableFieldIndex: 2
  }, {
    name: 'dropoff_lat',
    tableFieldIndex: 3
  }, {
    name: 'dropoff_lng',
    tableFieldIndex: 4
  }];

  const pointLayers = [
    new PointLayer({
      label: 'begintrip',
      dataId: 'smoothie_cat',
      columns: {
        lat: {
          value: 'begintrip_lat',
          fieldIdx: 0
        },
        lng: {
          value: 'begintrip_lng',
          fieldIdx: 1
        },
        altitude: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    })
  ];

  const eventIcon = [{name: 'event_icon', tableFieldIndex: 5}];
  const nameIcon = [{name: 'name.icon', tableFieldIndex: 5}];

  t.equal(_findDefaultIconLayers(pointLayers, inputFields).length, 0,
    'should find no icon layer');

  t.equal(_findDefaultIconLayers([], inputFields).length, 0,
    'should find no icon layer');

  let iconLayers = _findDefaultIconLayers(pointLayers,
    [...inputFields, ...eventIcon]);

  t.equal(iconLayers.length, 1, 'should find 1 icon layer');
  t.equal(iconLayers[0].config.label, 'event icon', 'should find 1 icon layer');

  iconLayers = _findDefaultIconLayers(pointLayers,
    [...inputFields, ...nameIcon, ...eventIcon]);

  t.equal(iconLayers.length, 2, 'should find 2 icon layers');
  t.equal(iconLayers[0].config.label, 'name icon', 'should find 2 icon layer');

  t.end();
});

test('LayerUtils -> _getAllPossibleColumnParis', t => {
  const columnes1 = {
    a: [1, 2],
    b: [3, 4]
  };
  const columnes2 = {
    a: [1],
    b: [3, 4]
  };

  const columnes3 = {
    a: [1]
  };
  t.equal(_getAllPossibleColumnParis(columnes1).length, 4, 'should find 4 pairs');
  t.equal(_getAllPossibleColumnParis(columnes2).length, 2, 'should find 4 pairs');
  t.equal(_getAllPossibleColumnParis(columnes3).length, 1, 'should find 4 pairs');
  t.end();
});

test('layerUtils -> _findDefaultArcLayers', t => {
  const pointLayers = [
    new PointLayer({
      label: 'begintrip',
      columns: {
        lat: {
          value: 'begintrip_lat',
          fieldIdx: 0
        },
        lng: {
          value: 'begintrip_lng',
          fieldIdx: 1
        },
        altitude: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    }),
    new PointLayer({
      label: 'dropoff',
      columns: {
        lat: {
          value: 'dropoff_lat',
          fieldIdx: 2
        },
        lng: {
          value: 'dropoff_lng',
          fieldIdx: 3
        },
        altitude: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    })
  ];

  const morePointLayers = [
    new PointLayer({
      label: 'restaurant',
      columns: {
        lat: {
          value: 'restaurant_lat',
          fieldIdx: 0
        },
        lng: {
          value: 'restaurant_lng',
          fieldIdx: 1
        },
        altitude: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    }),
    new PointLayer({
      label: 'delivery',
      columns: {
        lat: {
          value: 'delivery_lat',
          fieldIdx: 2
        },
        lng: {
          value: 'delivery_lng',
          fieldIdx: 3
        },
        altitude: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    }),
    new PointLayer({
      label: 'carrier',
      columns: {
        lat: {
          value: 'start_lat',
          fieldIdx: 4
        },
        lng: {
          value: 'start_lng',
          fieldIdx: 5
        },
        altitude: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    })
  ];
  const expectedArcLayer = new ArcLayer({
    label: 'trip arc',
    dataId: 'trip',
    columns: {
      lat0: {
        value: 'begintrip_lat',
        fieldIdx: 0
      },
      lng0: {
        value: 'begintrip_lng',
        fieldIdx: 1
      },
      lat1: {
        value: 'dropoff_lat',
        fieldIdx: 2
      },
      lng1: {
        value: 'dropoff_lng',
        fieldIdx: 3
      }
    }
  });

  const expectedMoreArcLayers = new ArcLayer({
    dataId: 'journey',
    label: 'restaurant -> delivery arc',
    columns: {
      lat0: {value: 'restaurant_lat', fieldIdx: 0},
      lng0: {value: 'restaurant_lng', fieldIdx: 1},
      lat1: {value: 'delivery_lat', fieldIdx: 2},
      lng1: {value: 'delivery_lng', fieldIdx: 3}
    }
  });

  t.deepEqual(_findDefaultArcLayers([pointLayers[0]], 'arc', 'hello'), [],
    'should found 0 arc layer');

  cmpLayers(t, expectedArcLayer, _findDefaultArcLayers(pointLayers, 'arc', 'trip')[0],
    'should found trip arc layer');

  cmpLayers(t, expectedMoreArcLayers, _findDefaultArcLayers(morePointLayers, 'arc', 'journey')[0],
    'should found 1 arc layer');

  t.end();
});

test('layerUtils -> _findDefaultHexagonIdLayer', t => {
  const fields = [{
    name: 'hex_id',
    tableFieldIndex: 5
  }, {
    name: 'hexagon_id',
    tableFieldIndex: 6
  }];

  const hexagonIdLayers = _findDefaultHexagonIdLayer(fields);

  t.equal(hexagonIdLayers.length, 2, 'should return 2 hexagon id layer');

  t.end();
});
