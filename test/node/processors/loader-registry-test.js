// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {
  getAcceptedKeplerLoaderEntries,
  getAcceptedRemoteFileFormats,
  getKeplerLoaders,
  isKeplerFileFormatAccepted,
  KeplerCSVLoader,
  processFileData,
  readFileInBatches
} from '@kepler.gl/processors';
import {
  getDisplayedFileExtensions,
  getFileExtensions,
  getFileFormatNames
} from '@kepler.gl/reducers';
import {initApplicationConfig} from '@kepler.gl/utils';

test('#loader-registry -> resolves matching loaders lazily', async t => {
  const loaders = await getKeplerLoaders({name: 'data.csv', type: ''});

  t.equal(loaders.length, 1, 'only the matching default loader should be resolved');
  t.equal(loaders[0], KeplerCSVLoader, 'CSV should resolve to the Kepler CSV adapter');
  t.equal(typeof loaders[0].parseInBatches, 'function', 'adapter should expose parseInBatches');
  t.end();
});

test('#loader-registry -> resolves JSON loaders from MIME metadata', async t => {
  const loaders = await getKeplerLoaders({name: 'data', type: 'application/json; charset=utf-8'});

  t.equal(loaders.length, 1, 'only the matching default loader should be resolved');
  t.equal(loaders[0].id, 'json', 'JSON should be selected from the MIME type');
  t.end();
});

test('#loader-registry -> resolves NDJSON and GIS loaders by extension', async t => {
  const ndjson = await getKeplerLoaders({name: 'rows.jsonl', type: ''});
  t.equal(ndjson[0].id, 'ndjson', 'jsonl should resolve to NDJSON');

  const geojsonl = await getKeplerLoaders({name: 'places.geojsonl', type: ''});
  t.equal(geojsonl[0].id, 'ndjson', 'geojsonl should resolve to NDJSON');
  t.ok(geojsonl[0].extensions.includes('geojsonl'), 'NDJSON adapter should accept geojsonl');

  const kml = await getKeplerLoaders({name: 'places.kml', type: ''});
  t.equal(kml[0].id, 'kml', 'kml should resolve to the KML loader');

  const gpx = await getKeplerLoaders({name: 'track.gpx', type: ''});
  t.equal(gpx[0].id, 'gpx', 'gpx should resolve to the GPX loader');

  const tcx = await getKeplerLoaders({name: 'activity.tcx', type: ''});
  t.equal(tcx[0].id, 'tcx', 'tcx should resolve to the TCX loader');
  t.end();
});

test('#loader-registry -> custom loaders take precedence', async t => {
  const customLoader = {...KeplerCSVLoader, name: 'Custom CSV'};
  const loaders = await getKeplerLoaders({name: 'data.csv', type: ''}, [customLoader]);

  t.equal(loaders.length, 1, 'the default loader should be deduplicated');
  t.equal(loaders[0], customLoader, 'custom loader should be first and authoritative');
  t.end();
});

test('#loader-registry -> CSV parser is async and dynamically loaded', async t => {
  const table = await KeplerCSVLoader.parseText('name,value\nalpha,1\n');

  t.equal(table.shape, 'object-row-table', 'CSV should return a loaders.gl table');
  t.deepEqual(table.data, [{name: 'alpha', value: '1'}], 'CSV values should remain strings');
  t.end();
});

async function readLastBatch(file) {
  const generator = await readFileInBatches({file, fileCache: [], loaders: [], loadOptions: {}});
  let last;
  for await (const batch of generator) {
    last = batch;
  }
  return last;
}

test('#loader-registry -> file loading uses the async loader path', async t => {
  const file = new File(['name,value\nalpha,1\n'], 'data.csv', {type: 'text/csv'});
  const generator = await readFileInBatches({file, fileCache: [], loaders: [], loadOptions: {}});
  const batches = [];

  for await (const batch of generator) {
    batches.push(batch);
  }

  const dataBatch = batches.find(batch => batch.batchType === 'data');
  t.ok(dataBatch, 'should yield a data batch');
  t.deepEqual(dataBatch.data, [{name: 'alpha', value: '1'}], 'should preserve CSV rows');
  t.end();
});

test('#loader-registry -> geojsonl files become GeoJSON datasets', async t => {
  const geojsonl = [
    '{"type":"Feature","properties":{"name":"alpha"},"geometry":{"type":"Point","coordinates":[-122.4,37.8]}}',
    '{"type":"Feature","properties":{"name":"beta"},"geometry":{"type":"Point","coordinates":[-122.5,37.9]}}'
  ].join('\n');
  const file = new File([geojsonl], 'places.geojsonl', {type: ''});
  const batch = await readLastBatch(file);
  const processed = await processFileData({content: batch, fileCache: []});

  t.equal(processed[0].info.format, 'geojson', 'geojsonl should process as geojson');
  t.equal(processed[0].data.rows.length, 2, 'should keep both features');
  t.end();
});

test('#loader-registry -> ndjson row files stay row datasets', async t => {
  const ndjson = '{"name":"alpha","value":1}\n{"name":"beta","value":2}\n';
  const file = new File([ndjson], 'rows.ndjson', {type: ''});
  const batch = await readLastBatch(file);
  const processed = await processFileData({content: batch, fileCache: []});

  t.equal(processed[0].info.format, 'row', 'generic NDJSON should process as rows');
  t.equal(processed[0].data.rows.length, 2, 'should keep both rows');
  t.end();
});

test('#loader-registry -> kml files become GeoJSON datasets', async t => {
  const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Placemark>
    <name>alpha</name>
    <Point><coordinates>-122.4,37.8</coordinates></Point>
  </Placemark>
</kml>`;
  const file = new File([kml], 'places.kml', {type: ''});
  const batch = await readLastBatch(file);
  const processed = await processFileData({content: batch, fileCache: []});

  t.equal(processed[0].info.format, 'geojson', 'KML should process as geojson');
  t.equal(processed[0].data.rows.length, 1, 'should parse the KML placemark');
  t.end();
});

test('#loader-registry -> gpx files become GeoJSON datasets', async t => {
  const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="kepler-test">
  <wpt lat="37.8" lon="-122.4"><name>alpha</name></wpt>
</gpx>`;
  const file = new File([gpx], 'track.gpx', {type: ''});
  const batch = await readLastBatch(file);
  const processed = await processFileData({content: batch, fileCache: []});

  t.equal(processed[0].info.format, 'geojson', 'GPX should process as geojson');
  t.equal(processed[0].data.rows.length, 1, 'should parse the GPX waypoint');
  t.end();
});

test('#loader-registry -> tcx files become GeoJSON datasets', async t => {
  const tcx = `<?xml version="1.0" encoding="UTF-8"?>
<TrainingCenterDatabase xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2">
  <Activities>
    <Activity Sport="Running">
      <Id>2020-01-01T00:00:00Z</Id>
      <Lap StartTime="2020-01-01T00:00:00Z">
        <Track>
          <Trackpoint>
            <Time>2020-01-01T00:00:00Z</Time>
            <Position>
              <LatitudeDegrees>37.8</LatitudeDegrees>
              <LongitudeDegrees>-122.4</LongitudeDegrees>
            </Position>
          </Trackpoint>
          <Trackpoint>
            <Time>2020-01-01T00:01:00Z</Time>
            <Position>
              <LatitudeDegrees>37.81</LatitudeDegrees>
              <LongitudeDegrees>-122.41</LongitudeDegrees>
            </Position>
          </Trackpoint>
        </Track>
      </Lap>
    </Activity>
  </Activities>
</TrainingCenterDatabase>`;
  const file = new File([tcx], 'activity.tcx', {type: ''});
  const batch = await readLastBatch(file);
  const processed = await processFileData({content: batch, fileCache: []});

  t.equal(processed[0].info.format, 'geojson', 'TCX should process as geojson');
  t.ok(processed[0].data.rows.length >= 1, 'should parse the TCX track');
  t.end();
});

test('#loader-registry -> acceptedFileFormats defaults to all formats', t => {
  t.ok(isKeplerFileFormatAccepted('kml'), 'kml is accepted by default');
  t.ok(isKeplerFileFormatAccepted('geojsonl'), 'geojsonl is accepted by default');
  t.ok(
    getAcceptedKeplerLoaderEntries().some(entry => entry.id === 'kml'),
    'KML stays in the default loader list'
  );
  t.ok(
    getAcceptedRemoteFileFormats().includes('kml'),
    'remote format list includes kml by default'
  );
  t.ok(getFileExtensions({loaders: []}).includes('kml'), 'file picker includes kml by default');
  t.ok(
    getFileExtensions({loaders: []}).includes('geojsonl'),
    'aliases stay accepted even when not shown as icons'
  );
  t.deepEqual(
    getDisplayedFileExtensions({loaders: []}),
    ['csv', 'json', 'geojson', 'arrow', 'parquet', 'geojsonl', 'kml', 'gpx', 'tcx'],
    'Add Data icons show one chip per format family'
  );
  t.deepEqual(
    getFileFormatNames({loaders: []}),
    ['CSV', 'Json', 'GeoJSON', 'Arrow', 'Parquet', 'GeoJSONL', 'KML', 'GPX', 'TCX'],
    'upload copy lists format families, not every alias'
  );
  t.end();
});

test('#loader-registry -> acceptedFileFormats restricts loaders and UI lists', async t => {
  initApplicationConfig({acceptedFileFormats: ['csv', 'geojson']});
  try {
    t.ok(isKeplerFileFormatAccepted('csv'), 'csv remains accepted');
    t.ok(isKeplerFileFormatAccepted('tsv'), 'csv aliases remain accepted');
    t.ok(isKeplerFileFormatAccepted('GeoJSON'), 'geojson remains accepted');
    t.notOk(isKeplerFileFormatAccepted('kml'), 'kml is rejected');
    t.notOk(isKeplerFileFormatAccepted('parquet'), 'parquet is rejected');

    const ids = getAcceptedKeplerLoaderEntries().map(entry => entry.id);
    t.deepEqual(ids.sort(), ['csv', 'json'], 'only matching built-in loaders remain');

    const remote = getAcceptedRemoteFileFormats();
    t.deepEqual(
      remote,
      ['auto', 'csv', 'geojson', 'json'],
      'remote dropdown keeps auto plus accepted formats'
    );

    t.deepEqual(
      getFileExtensions({loaders: []}),
      ['csv', 'tsv', 'dsv', 'json', 'geojson'],
      'file picker extensions follow the allowlist'
    );
    t.deepEqual(
      getFileFormatNames({loaders: []}),
      ['CSV', 'Json', 'GeoJSON'],
      'file picker labels follow the allowlist'
    );
    t.deepEqual(
      getDisplayedFileExtensions({loaders: []}),
      ['csv', 'json', 'geojson'],
      'Add Data icons follow the allowlist without aliases'
    );

    const kmlLoaders = await getKeplerLoaders({name: 'places.kml', type: ''});
    t.ok(
      kmlLoaders.every(loader => loader.id !== 'kml'),
      'KML files do not resolve the KML loader when it is not accepted'
    );
    const csvLoaders = await getKeplerLoaders({name: 'data.csv', type: ''});
    t.equal(csvLoaders[0], KeplerCSVLoader, 'CSV still resolves when accepted');
  } finally {
    initApplicationConfig({acceptedFileFormats: null});
  }
  t.end();
});
