// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape';
import {mountWithTheme} from 'test/helpers/component-utils';
import {renderBasemapAttribution} from '@kepler.gl/components';

// Helper: mount the parsed nodes and return the enzyme wrapper.
function mountAttribution(html) {
  return mountWithTheme(<div>{renderBasemapAttribution(html, 'k')}</div>);
}

test('renderBasemapAttribution -> plain text', t => {
  const wrapper = mountAttribution('© OpenStreetMap contributors');
  t.equal(wrapper.find('a').length, 0, 'No anchors for plain text');
  t.equal(wrapper.text(), '© OpenStreetMap contributors', 'Text preserved verbatim');
  t.end();
});

test('renderBasemapAttribution -> single safe anchor', t => {
  const wrapper = mountAttribution(
    '© <a href="https://carto.com/attributions">CARTO</a>'
  );
  const anchors = wrapper.find('a');
  t.equal(anchors.length, 1, 'One anchor rendered');
  t.equal(anchors.at(0).prop('href'), 'https://carto.com/attributions', 'href preserved');
  t.equal(anchors.at(0).prop('target'), '_blank', 'opens in new tab');
  t.equal(anchors.at(0).prop('rel'), 'noopener noreferrer', 'safe rel');
  t.equal(anchors.at(0).text(), 'CARTO', 'anchor text preserved');
  t.ok(wrapper.text().startsWith('©'), 'leading text preserved');
  t.end();
});

test('renderBasemapAttribution -> OpenFreeMap style (multiple links + entities)', t => {
  const html =
    '<a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> ' +
    '<a href="https://www.openmaptiles.org/" target="_blank">&copy; OpenMapTiles</a> ' +
    'Data from <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>';
  const wrapper = mountAttribution(html);
  const anchors = wrapper.find('a');
  t.equal(anchors.length, 3, 'All three links preserved');
  t.deepEqual(
    anchors.map(a => a.prop('href')),
    [
      'https://openfreemap.org',
      'https://www.openmaptiles.org/',
      'https://www.openstreetmap.org/copyright'
    ],
    'All hrefs preserved in order'
  );
  t.ok(wrapper.text().includes('© OpenMapTiles'), 'HTML entity (&copy;) decoded');
  t.end();
});

test('renderBasemapAttribution -> drops unsafe javascript: href, keeps text', t => {
  const wrapper = mountAttribution(
    // eslint-disable-next-line no-script-url
    '<a href="javascript:alert(1)">Bad</a> and <a href="https://ok.com">Good</a>'
  );
  const anchors = wrapper.find('a');
  t.equal(anchors.length, 1, 'Only the safe anchor becomes a link');
  t.equal(anchors.at(0).prop('href'), 'https://ok.com', 'safe href kept');
  t.ok(wrapper.text().includes('Bad'), 'unsafe link text still rendered as plain text');
  const unsafeCount = anchors.reduce(
    (n, a) => n + ((a.prop('href') || '').startsWith('javascript:') ? 1 : 0),
    0
  );
  t.equal(unsafeCount, 0, 'no javascript: href rendered');
  t.end();
});

test('renderBasemapAttribution -> mailto is allowed', t => {
  const wrapper = mountAttribution('<a href="mailto:hi@example.com">Contact</a>');
  const anchors = wrapper.find('a');
  t.equal(anchors.length, 1, 'mailto anchor is a link');
  t.equal(anchors.at(0).prop('href'), 'mailto:hi@example.com', 'mailto href preserved');
  t.end();
});

test('renderBasemapAttribution -> nested tags and > inside attribute (regex-breaking cases)', t => {
  // A '>' inside an attribute value and nested markup would break the old
  // regex-based parser; the DOM parser handles both.
  const html =
    '<a href="https://x.com" data-tip="a > b"><b>Bold</b> Link</a> tail';
  const wrapper = mountAttribution(html);
  const anchors = wrapper.find('a');
  t.equal(anchors.length, 1, 'One anchor despite > inside attribute');
  t.equal(anchors.at(0).prop('href'), 'https://x.com', 'href parsed correctly');
  t.equal(anchors.at(0).text(), 'Bold Link', 'nested tag content flattened to text');
  t.ok(wrapper.text().includes('tail'), 'trailing text preserved');
  t.end();
});

test('renderBasemapAttribution -> empty / whitespace', t => {
  t.deepEqual(renderBasemapAttribution('', 'k'), [], 'empty string yields no nodes');
  const wrapper = mountAttribution('   ');
  t.equal(wrapper.find('a').length, 0, 'whitespace yields no anchors');
  t.end();
});
