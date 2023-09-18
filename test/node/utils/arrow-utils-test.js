// Copyright (c) 2023 Uber Technologies, Inc.
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

import {ArrowLoader} from '@loaders.gl/arrow';
import {ARROW_GEO_METADATA_KEY} from '@kepler.gl/constants';
import {parseGeometryFromArrow, GEOARROW_ENCODINGS} from '@kepler.gl/utils';

import {
  testPointArrowRawBytes,
  testLineStringArrowRawBytes,
  testPolygonArrowRawBytes,
  testMultiPointArrowRawBytes,
  testMultiLineStringArrowRawBytes,
  testMultiPolygonArrowRawBytes,
  testPointArrowWKBRawBytes,
  testPointArrowWKTRawBytes,
  expectedPointGeojson,
  expectedPointGeojsonForWellKnownFormat,
  expectedLineStringGeoJson,
  expectedPolygonGeojson,
  expectedMultiPointGeoJson,
  expectedMultiLineStringGeoJson,
  expectedMultiPolygonGeojson
} from '../../fixtures/test-arrow-data';

test('geojsonUtils.parseGeometryFromArrow', async t => {
  async function testParseFromArrow(t, rawArrowBytes, expectedGeojson) {
    // load parquet file using loaders.gl/arrow
    const testArrowTable = new Uint8Array(rawArrowBytes.split(',').map(byte => parseInt(byte, 10)));

    const arrowTable = await ArrowLoader.parse(testArrowTable.buffer, {
      arrow: {shape: 'arrow-table'}
    });

    // check if the arrow table is loaded correctly
    t.equal(
      arrowTable.length,
      expectedGeojson.features.length,
      `arrow table has ${expectedGeojson.features.length} row`
    );

    const colNames = [...Object.keys(expectedGeojson.features[0].properties), 'geometry'];
    t.equal(arrowTable.numCols, colNames.length, `arrow table has ${colNames.length} columns`);

    // check fields exist in arrow table schema
    arrowTable.schema.fields.map(field =>
      t.equal(colNames.includes(field.name), true, `arrow table has ${field.name} column`)
    );

    // check metadata exists in arrow table schema
    const metadata = arrowTable.schema.metadata;
    t.equal(Boolean(metadata.get(ARROW_GEO_METADATA_KEY)), true, 'arrow table has geo metadata');

    const geoMeta = JSON.parse(metadata.get(ARROW_GEO_METADATA_KEY) || '');
    const geometryColumns = geoMeta.columns;

    // check 'geometry' is in geometryColumns (geometryColumns is a Map object)
    t.equal(Boolean(geometryColumns['geometry']), true, 'geometryColumns has geometry column');

    // get encoding from geometryColumns['geometry']
    const encoding = geometryColumns['geometry'].encoding;

    // check encoding is one of GEOARROW_ENCODINGS
    t.ok(
      Object.values(GEOJSON_ENCODINGS).includes(encoding),
      'encoding is one of GEOARROW_ENCODINGS'
    );

    // get first geometry from arrow geometry column
    const firstArrowGeometry = arrowTable.getColumn('geometry').get(0);
    const firstArrowGeometryObject = {
      encoding,
      data: firstArrowGeometry
    };

    // parse arrow geometry to geojson feature
    const firstFeature = parseGeometryFromArrow(firstArrowGeometryObject);

    // check if geometry in firstFeature is equal to the original geometry in expectedPointGeojson
    t.deepEqual(
      firstFeature.geometry,
      expectedGeojson.features[0].geometry,
      'firstFeature.geometry is equal to expectedGeojson.features[0].geometry'
    );
  }

  const testCases = [
    [testPointArrowRawBytes, expectedPointGeojson],
    [testMultiPointArrowRawBytes, expectedMultiPointGeoJson],
    [testLineStringArrowRawBytes, expectedLineStringGeoJson],
    [testMultiLineStringArrowRawBytes, expectedMultiLineStringGeoJson],
    [testPolygonArrowRawBytes, expectedPolygonGeojson],
    [testMultiPolygonArrowRawBytes, expectedMultiPolygonGeojson],
    [testPointArrowWKTRawBytes, expectedPointGeojsonForWellKnownFormat],
    [testPointArrowWKBRawBytes, expectedPointGeojsonForWellKnownFormat]
  ];

  testCases.forEach(async testCase => {
    await testParseFromArrow(t, testCase[0], testCase[1]);
  });

  t.end();
});
