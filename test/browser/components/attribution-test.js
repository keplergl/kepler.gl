// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape';
import {mountWithTheme} from 'test/helpers/component-utils';
import {renderBasemapAttribution, dedupeBasemapAttributions} from '@kepler.gl/components';

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
  const wrapper = mountAttribution('© <a href="https://carto.com/attributions">CARTO</a>');
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
  const html = '<a href="https://x.com" data-tip="a > b"><b>Bold</b> Link</a> tail';
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

test('renderBasemapAttribution -> whitespace-only fragments between links are dropped', t => {
  // whitespace-only text nodes sitting between two links should not produce
  // empty-ish fragments
  const html = '<a href="https://a.com">A</a>   <a href="https://b.com">B</a>';
  const nodes = renderBasemapAttribution(html, 'k');
  const wrapper = mountAttribution(html);
  t.equal(wrapper.find('a').length, 2, 'both links rendered');
  // only two nodes: the two anchors, no whitespace fragment in between
  t.equal(nodes.length, 2, 'no whitespace-only fragment emitted between the links');
  t.end();
});

test('renderBasemapAttribution -> nested <a> inside <a> does not produce link-in-link', t => {
  // invalid markup: an anchor nested inside another anchor. Browsers (and
  // JSDOM) auto-close the outer <a>, yielding sibling anchors; the parser must
  // never emit an anchor that contains another anchor.
  const html = '<a href="https://outer.com">outer <a href="https://inner.com">inner</a></a>';
  const wrapper = mountAttribution(html);
  const container = wrapper.getDOMNode();
  const anchorEls = container.querySelectorAll('a');
  anchorEls.forEach(a => {
    t.equal(a.querySelectorAll('a').length, 0, 'no anchor nested inside another anchor');
  });
  t.ok(wrapper.text().includes('inner'), 'inner link text preserved');
  t.ok(wrapper.text().includes('outer'), 'outer link text preserved');
  t.end();
});

test('dedupeBasemapAttributions -> exact duplicates', t => {
  t.deepEqual(
    dedupeBasemapAttributions(['© OpenStreetMap', '© OpenStreetMap']),
    ['© OpenStreetMap'],
    'collapses exact duplicates'
  );
  t.end();
});

test('dedupeBasemapAttributions -> wording variants collapse (OSM vs OSM contributors)', t => {
  t.deepEqual(
    dedupeBasemapAttributions(['© OpenStreetMap contributors', '© OpenStreetMap']),
    ['© OpenStreetMap contributors'],
    'the standalone OSM string is subsumed by the fuller one'
  );
  t.end();
});

test('dedupeBasemapAttributions -> standalone OSM link subsumed by CARTO string that links OSM', t => {
  const carto =
    '© <a href="https://carto.com/attributions">CARTO</a>, © ' +
    '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const osm = '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>';
  t.deepEqual(
    dedupeBasemapAttributions([carto, osm]),
    [carto],
    'OSM-only entry dropped because CARTO already links OSM and the text overlaps'
  );
  t.end();
});

test('dedupeBasemapAttributions -> distinct providers are all kept', t => {
  const ofm = '<a href="https://openfreemap.org">OpenFreeMap</a>';
  const omt = '<a href="https://www.openmaptiles.org/">© OpenMapTiles</a>';
  const osm = '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>';
  t.deepEqual(
    dedupeBasemapAttributions([ofm, omt, osm]),
    [ofm, omt, osm],
    'independent providers are preserved'
  );
  t.end();
});

test('dedupeBasemapAttributions -> distinct provider not dropped by token cross-contamination', t => {
  // "Map Co" is a distinct provider; its tokens (map, co) each appear in a
  // *different* earlier entry, but no single earlier entry covers both, so it
  // must be kept (guards against union-based false positives)
  const a = '© Map Data';
  const b = '© Data Co';
  const c = '© Map Co';
  t.deepEqual(
    dedupeBasemapAttributions([a, b, c]),
    [a, b, c],
    'entry whose tokens span two different kept entries is not subsumed'
  );
  t.end();
});

test('dedupeBasemapAttributions -> www prefix and casing normalized', t => {
  const a = '<a href="https://www.OpenStreetMap.org/copyright">OpenStreetMap</a>';
  const b = '<a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>';
  t.deepEqual(
    dedupeBasemapAttributions([a, b]),
    [a],
    'same host regardless of www/casing collapses'
  );
  t.end();
});

test('dedupeBasemapAttributions -> synthesized OSM entry is subsumed by CARTO', t => {
  // mirrors the runtime fold-in: a synthesized canonical OSM link should not
  // double-render when a CARTO string already links OSM
  const carto =
    '© <a href="https://carto.com/attributions">CARTO</a>, © ' +
    '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const synthesizedOsm = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
  t.deepEqual(
    dedupeBasemapAttributions([carto, synthesizedOsm]),
    [carto],
    'canonical OSM entry dropped when CARTO already links OSM'
  );
  t.end();
});
