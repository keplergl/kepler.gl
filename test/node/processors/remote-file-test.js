// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {
  fetchRemoteFile,
  fetchRemoteFileAsKeplerFile,
  getExtensionFromUrl,
  getFileNameForRemoteUrl,
  getMimeTypeForFormat,
  isRemoteDatasetUrl
} from '@kepler.gl/processors';

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

test('#remote-file -> fetchRemoteFile returns notModified on 304', async t => {
  const origFetch = global.fetch;
  global.fetch = async (url, init) => {
    t.equal(init.headers['If-None-Match'], '"abc"', 'should send If-None-Match');
    return new Response(null, {
      status: 304,
      headers: {etag: '"xyz"', 'last-modified': 'Wed, 21 Oct 2015 07:28:00 GMT'}
    });
  };

  try {
    const result = await fetchRemoteFile('https://example.com/data.csv', {
      etag: '"abc"',
      lastModified: 'Tue, 20 Oct 2015 07:28:00 GMT'
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
  }
  t.end();
});
