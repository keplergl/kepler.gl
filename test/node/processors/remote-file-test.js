// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {getExtensionFromUrl, getFileNameForRemoteUrl, getMimeTypeForFormat} from '@kepler.gl/processors';

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
