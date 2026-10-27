// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {
  fetchRemoteFile,
  fetchRemoteFileAsKeplerFile,
  getExtensionFromUrl,
  getFileNameForRemoteUrl,
  getMimeTypeForFormat,
  isRemoteDatasetUrl,
  loadExternallyHostedDataset
} from '@kepler.gl/processors';

test('#remote-file -> recognizes only the established CSV header', async t => {
  const originalFetch = global.fetch;
  const metadata = {
    source: 'https://example.com/live.csv',
    csvHeader: ['lat', 'lng', 'value']
  };
  try {
    for (const body of [
      'lat,lng,value',
      '\ufeff"lat",lng,"value"\r\n',
      '\nlat,lng,value\n\n',
      'lat\tlng\tvalue\n',
      'lat;lng;value\n',
      'lat|lng|value\n'
    ]) {
      global.fetch = async () => new Response(body, {headers: {etag: 'empty'}});
      const result = await loadExternallyHostedDataset(metadata);
      t.deepEqual(result.data, {fields: [], rows: []}, 'clears rows using established types');
      t.equal(result.notModified, false, 'empty is a new snapshot');
      t.equal(result.etag, 'empty', 'retains response validators');
    }
    const csvHeader = ['la,t', 'ln\ng', 'say "hi"', 'a.*'];
    global.fetch = async () => new Response('"la,t","ln\ng","say ""hi""",a.*\n');
    const result = await loadExternallyHostedDataset({...metadata, csvHeader});
    t.deepEqual(result.data.rows, [], 'recognizes quoted delimiters, newlines and escaped quotes');

    for (const body of [
      '',
      '\n \t\r\n',
      '"lat,lng,value\n',
      'lat,lng,"value',
      '"lat"oops,lng,value\n',
      'lat"oops,lng,value\n',
      'value,lng,lat\n',
      'lat,lng\n',
      'lat,lng,value,new\n'
    ]) {
      global.fetch = async () => new Response(body);
      try {
        await loadExternallyHostedDataset(metadata);
        t.fail('blank, malformed or changed headers must not clear the table');
      } catch (error) {
        t.ok(error instanceof Error, 'rejects unsupported empty snapshots');
      }
    }
    global.fetch = async () => new Response('lat,lng,value\n');
    try {
      await loadExternallyHostedDataset({source: metadata.source});
      t.fail('initially empty imports must retain their existing error behavior');
    } catch (error) {
      t.ok(error instanceof Error, 'requires an established table');
    }
  } finally {
    global.fetch = originalFetch;
  }
  t.end();
});

test('#remote-file -> header matching cannot reinterpret a column delimiter', async t => {
  const originalFetch = global.fetch;
  const source = 'https://example.com/live.csv';
  const fixtures = [
    ...[',', '\t', ';', '|'].map(delimiter => [
      `"a${delimiter}b"\nvalue\n`,
      `a${delimiter}b\n`,
      `"a${delimiter}b"\n`
    ]),
    ['lat,lng,"a,b,c,d"\n37,-122,1\n38,-123,2\n', 'lat;lng;a,b,c,d\n', 'lat;lng;"a,b,c,d"\n']
  ];
  try {
    for (const [populated, ambiguous, quoted] of fixtures) {
      let body = populated;
      global.fetch = async () => new Response(body);
      const loaded = await loadExternallyHostedDataset({source});
      const csvHeader = loaded.data.fields.map(field => field.name);
      body = ambiguous;
      try {
        await loadExternallyHostedDataset({source, csvHeader});
        t.fail('a different delimiter interpretation must not clear existing data');
      } catch (error) {
        t.ok(error instanceof Error, 'rejects the ambiguous header');
      }
      body = quoted;
      const result = await loadExternallyHostedDataset({source, csvHeader});
      t.deepEqual(result.data, {fields: [], rows: []}, 'accepts the quoted established header');
    }
  } finally {
    global.fetch = originalFetch;
  }
  t.end();
});

test('#remote-file -> header-only refresh uses CSV parsing and imported column order', async t => {
  const originalFetch = global.fetch;
  const fixtures = [
    ['live.csv', 'text/csv', 'lat,lng,a|b', '37,-122,1', ['lat', 'lng', 'a|b']],
    ['live.csv', 'text/csv', 'lat;lng;a,b', '37;-122;1', ['lat', 'lng', 'a,b']],
    [
      'live.tsv',
      'text/tab-separated-values',
      'lat\tlng\tvalue',
      '37\t-122\t1',
      ['lat', 'lng', 'value']
    ],
    ['live.dsv', 'text/dsv', 'lat;lng;value', '37;-122;1', ['lat', 'lng', 'value']],
    [
      'live',
      'text/tab-separated-values',
      'lat\tlng\tvalue',
      '37\t-122\t1',
      ['lat', 'lng', 'value']
    ],
    ['live.csv', 'text/csv', '2025,2024,value', '1,2,3', ['2024', '2025', 'value']]
  ];
  try {
    for (const [name, mimeType, header, row, expectedNames] of fixtures) {
      let body = `${header}\n${row}\n`;
      global.fetch = async () => new Response(body, {headers: {'content-type': mimeType}});
      const source = `https://example.com/${name}`;
      const loaded = await loadExternallyHostedDataset({source});
      const csvHeader = loaded.data.fields.map(field => field.name);
      t.deepEqual(csvHeader, expectedNames, 'establishes columns using the normal import path');
      body = `${header}\n`;
      try {
        const result = await loadExternallyHostedDataset({source, csvHeader});
        t.deepEqual(result.data, {fields: [], rows: []}, 'recognizes the unchanged empty snapshot');
      } catch (error) {
        t.fail(`unchanged header-only ${name} rejected: ${error.message}`);
      }
    }
  } finally {
    global.fetch = originalFetch;
  }
  t.end();
});

test('#remote-file -> getExtensionFromUrl', t => {
  t.equal(getExtensionFromUrl('https://example.com/data.geojson'), 'geojson');
  t.equal(
    getExtensionFromUrl('https://example.com/data.csv?sv=2020-08-04&sig=abc'),
    'csv',
    'should ignore SAS query params'
  );
  t.equal(
    getExtensionFromUrl('https://account.blob.core.windows.net/container/abc123?sv=1&sig=2'),
    '',
    'should return empty string when the blob name has no extension'
  );
  t.end();
});

test('#remote-file -> getMimeTypeForFormat', t => {
  t.equal(getMimeTypeForFormat('auto'), undefined);
  t.equal(getMimeTypeForFormat(undefined), undefined);
  t.equal(getMimeTypeForFormat('csv'), 'text/csv');
  t.equal(getMimeTypeForFormat('parquet'), 'application/vnd.apache.parquet');
  t.equal(getMimeTypeForFormat('arrow'), 'application/vnd.apache.arrow.file');
  t.equal(getMimeTypeForFormat('kml'), 'application/vnd.google-earth.kml+xml');
  t.equal(getMimeTypeForFormat('geojsonl'), 'application/geo+x-ndjson');
  t.equal(getMimeTypeForFormat('shp'), 'application/x-esri-shapefile');
  t.equal(
    getMimeTypeForFormat('xlsx'),
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  t.equal(getMimeTypeForFormat('fgb'), 'application/x-flatgeobuf');
  t.end();
});

test('#remote-file -> getFileNameForRemoteUrl', t => {
  t.equal(
    getFileNameForRemoteUrl('https://example.com/path/quakes.csv'),
    'quakes.csv',
    'should use the URL path filename'
  );
  t.equal(
    getFileNameForRemoteUrl('https://example.com/path/quakes.csv?sv=2020&sig=abc'),
    'quakes.csv',
    'should strip query params'
  );
  t.equal(
    getFileNameForRemoteUrl(
      'https://account.blob.core.windows.net/container/abc123?sv=1',
      'geojson'
    ),
    'abc123.geojson',
    'should append an explicit format when the blob name has no extension'
  );
  t.equal(
    getFileNameForRemoteUrl('https://example.com/container/blob', 'auto', 'text/csv'),
    'blob.csv',
    'should use Content-Type when format is auto and the URL has no extension'
  );
  t.equal(
    getFileNameForRemoteUrl('https://example.com/data.json', 'geojson'),
    'data.geojson',
    'should replace the extension when an explicit format is provided'
  );
  t.end();
});

test('#remote-file -> isRemoteDatasetUrl', t => {
  t.ok(isRemoteDatasetUrl('https://example.com/data.csv'), 'https is allowed');
  t.ok(isRemoteDatasetUrl('http://example.com/data.csv'), 'http is allowed');
  t.notOk(isRemoteDatasetUrl('javascript:alert(1)'), 'javascript: is rejected');
  t.notOk(isRemoteDatasetUrl('file:///tmp/data.csv'), 'file: is rejected');
  t.notOk(isRemoteDatasetUrl('ftp://example.com/data.csv'), 'ftp is rejected');
  t.notOk(isRemoteDatasetUrl('not a url'), 'invalid URLs are rejected');
  t.end();
});

test('#remote-file -> fetchRemoteFileAsKeplerFile rejects non-http URLs', async t => {
  try {
    await fetchRemoteFileAsKeplerFile('javascript:alert(1)');
    t.fail('should reject javascript: URLs');
  } catch (error) {
    t.ok(error instanceof Error, 'should throw');
    t.ok(/http or https/i.test(error.message), 'should mention http or https');
  }
  t.end();
});

test('#remote-file -> fetchRemoteFileAsKeplerFile does not dump error bodies', async t => {
  const origFetch = global.fetch;
  global.fetch = async () =>
    new Response(`${'<!DOCTYPE html><html><body>Not Found '.repeat(500)}</body></html>`, {
      status: 404,
      statusText: 'Not Found'
    });

  try {
    await fetchRemoteFileAsKeplerFile('https://example.com/missing.csv');
    t.fail('should reject HTTP errors');
  } catch (error) {
    t.ok(error instanceof Error, 'should throw');
    t.equal(
      error.message,
      'Failed to fetch https://example.com/missing.csv (404 Not Found)',
      'should report status without the response body'
    );
    t.ok(!error.message.includes('<html>'), 'should not include HTML from the error page');
  } finally {
    global.fetch = origFetch;
  }
  t.end();
});

test('#remote-file -> fetchRemoteFileAsKeplerFile progress without Content-Length', async t => {
  const origFetch = global.fetch;
  const chunks = [new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6])];
  let i = 0;
  global.fetch = async () =>
    new Response(
      new ReadableStream({
        pull(controller) {
          if (i < chunks.length) {
            controller.enqueue(chunks[i++]);
          } else {
            controller.close();
          }
        }
      }),
      {status: 200}
    );

  try {
    const percents = [];
    await fetchRemoteFileAsKeplerFile('https://example.com/data.csv', 'csv', ({percent}) => {
      percents.push(percent);
    });
    t.ok(percents.length, 'should emit progress');
    t.equal(percents[percents.length - 1], 1, 'should emit 100% when the blob is fully read');
  } finally {
    global.fetch = origFetch;
  }
  t.end();
});

test('#remote-file -> fetchRemoteFileAsKeplerFile progress with Content-Length', async t => {
  const origFetch = global.fetch;
  const chunks = [new Uint8Array([1, 2, 3, 4]), new Uint8Array([5, 6, 7, 8])];
  let i = 0;
  global.fetch = async () =>
    new Response(
      new ReadableStream({
        pull(controller) {
          if (i < chunks.length) {
            controller.enqueue(chunks[i++]);
          } else {
            controller.close();
          }
        }
      }),
      {status: 200, headers: {'content-length': '8'}}
    );

  try {
    const percents = [];
    await fetchRemoteFileAsKeplerFile('https://example.com/data.csv', 'csv', ({percent}) => {
      percents.push(percent);
    });
    t.ok(
      percents.some(p => p > 0 && p < 1),
      'should emit intermediate percent when Content-Length is known'
    );
    t.equal(percents[percents.length - 1], 1, 'should emit 100% when complete');
  } finally {
    global.fetch = origFetch;
  }
  t.end();
});

test('#remote-file -> fetchRemoteFileAsKeplerFile uses the default HTTP cache', async t => {
  const origFetch = global.fetch;
  global.fetch = async (url, init) => {
    t.equal(init?.cache, undefined, 'first remote URL load should not set cache: no-store');
    t.equal(init?.headers, undefined, 'a load without validators should not add headers');
    return new Response('a,b\n1,2', {status: 200, headers: {'content-type': 'text/csv'}});
  };

  try {
    await fetchRemoteFileAsKeplerFile('https://example.com/data.csv', 'csv');
  } finally {
    global.fetch = origFetch;
  }
  t.end();
});

test('#remote-file -> fetchRemoteFile refreshes cross-origin files without conditional headers', async t => {
  const origFetch = global.fetch;
  const origLocation = global.location;
  global.location = {origin: 'http://localhost:8080'};
  global.fetch = async (url, init) => {
    t.equal(url, 'http://localhost:8081/refresh.csv', 'should keep the source URL unchanged');
    t.equal(init.headers, undefined, 'should not add headers that trigger a CORS preflight');
    t.equal(init.cache, 'no-store', 'should still bypass the HTTP cache');
    return new Response('a,b\n3,4', {
      status: 200,
      headers: {'content-type': 'text/csv', 'last-modified': 'Sat, 24 Oct 2026 20:08:04 GMT'}
    });
  };

  try {
    for (const validators of [
      {etag: '"abc"'},
      {lastModified: 'Tue, 20 Oct 2015 07:28:00 GMT'},
      {etag: '"abc"', lastModified: 'Tue, 20 Oct 2015 07:28:00 GMT'}
    ]) {
      const result = await fetchRemoteFile('http://localhost:8081/refresh.csv', {
        ...validators,
        bypassCache: true
      });
      t.notOk(result.notModified, 'should report a refreshed file');
      t.equal(await result.file.text(), 'a,b\n3,4', 'should return the fresh file contents');
      t.equal(
        result.lastModified,
        'Sat, 24 Oct 2026 20:08:04 GMT',
        'should still capture response validators'
      );
    }
  } finally {
    global.fetch = origFetch;
    if (origLocation === undefined) {
      delete global.location;
    } else {
      global.location = origLocation;
    }
  }
  t.end();
});

test('#remote-file -> fetchRemoteFile returns notModified on same-origin 304', async t => {
  const origFetch = global.fetch;
  const origLocation = global.location;
  global.location = {origin: 'https://example.com'};
  global.fetch = async (url, init) => {
    t.equal(init.headers['If-None-Match'], '"abc"', 'should send If-None-Match');
    t.equal(
      init.headers['If-Modified-Since'],
      'Tue, 20 Oct 2015 07:28:00 GMT',
      'should send If-Modified-Since'
    );
    t.equal(init.cache, 'no-store', 'refresh fetches should bypass the HTTP cache');
    return new Response(null, {
      status: 304,
      headers: {etag: '"xyz"', 'last-modified': 'Wed, 21 Oct 2015 07:28:00 GMT'}
    });
  };

  try {
    const result = await fetchRemoteFile('https://example.com/data.csv', {
      etag: '"abc"',
      lastModified: 'Tue, 20 Oct 2015 07:28:00 GMT',
      bypassCache: true
    });
    t.ok(result.notModified, 'should report notModified');
    t.equal(result.file, null, 'should not return a file');
    t.equal(result.etag, '"xyz"', 'should prefer the 304 response ETag');
    t.equal(
      result.lastModified,
      'Wed, 21 Oct 2015 07:28:00 GMT',
      'should prefer the 304 response Last-Modified'
    );
  } finally {
    global.fetch = origFetch;
    if (origLocation === undefined) {
      delete global.location;
    } else {
      global.location = origLocation;
    }
  }
  t.end();
});
