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

test('renderBasemapAttribution -> single space preserved between adjacent links', t => {
  // whitespace between two links must collapse to a single space (not be
  // dropped), so links don't run together (e.g. OpenFreeMap-style strings)
  const html = '<a href="https://a.com">A</a>   <a href="https://b.com">B</a>';
  const wrapper = mountAttribution(html);
  t.equal(wrapper.find('a').length, 2, 'both links rendered');
  t.equal(wrapper.text(), 'A B', 'a single separating space is preserved');
  t.end();
});

test('renderBasemapAttribution -> collapses whitespace runs but keeps inter-link spacing', t => {
  const html =
    '<a href="https://openfreemap.org">OpenFreeMap</a> ' +
    '<a href="https://www.openmaptiles.org/">© OpenMapTiles</a> ' +
    'Data from <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
  const wrapper = mountAttribution(html);
  t.equal(
    wrapper.text(),
    'OpenFreeMap © OpenMapTiles Data from OpenStreetMap',
    'links stay separated by single spaces'
  );
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

test('renderBasemapAttribution -> script/style/template/noscript content is not rendered', t => {
  const cases = [
    'before<script>alert(1)</script>after',
    'a<style>.x{color:red}</style>b',
    'c<template><span>hidden</span></template>d',
    'e<noscript>noscript-text</noscript>f'
  ];
  cases.forEach(html => {
    const wrapper = mountAttribution(html);
    t.equal(wrapper.find('script').length, 0, `no script element rendered: ${html}`);
    t.equal(wrapper.find('style').length, 0, `no style element rendered: ${html}`);
    t.notOk(wrapper.text().includes('alert(1)'), 'script source not surfaced as text');
    t.notOk(wrapper.text().includes('color:red'), 'style source not surfaced as text');
    t.notOk(wrapper.text().includes('hidden'), 'template content not surfaced as text');
    t.notOk(wrapper.text().includes('noscript-text'), 'noscript content not surfaced as text');
  });
  t.end();
});

test('renderBasemapAttribution -> unsafe/non-allowlisted schemes are dropped, text kept', t => {
  const cases = [
    {href: '//evil.com', label: 'protocol-relative'},
    {href: '/relative/path', label: 'relative'},
    {href: 'tel:12345', label: 'tel'},
    {href: 'ftp://host/file', label: 'ftp'},
    {href: 'data:text/html,<b>x</b>', label: 'data'},
    // eslint-disable-next-line no-script-url
    {href: '  javascript:alert(1)', label: 'js with leading space'},
    // eslint-disable-next-line no-script-url
    {href: 'JAVASCRIPT:alert(1)', label: 'uppercase js'},
    {href: 'vbscript:msgbox(1)', label: 'vbscript'}
  ];
  cases.forEach(({href, label}) => {
    const wrapper = mountAttribution(`<a href="${href}">click ${label}</a>`);
    t.equal(wrapper.find('a').length, 0, `no link rendered for ${label}`);
    t.ok(wrapper.text().includes(`click ${label}`), `text preserved for ${label}`);
  });
  t.end();
});

test('renderBasemapAttribution -> allowlisted schemes are kept (incl. uppercase, http)', t => {
  const cases = [
    'http://plain.com',
    'https://secure.com',
    'HTTPS://UPPER.COM',
    'mailto:hi@example.com',
    'MAILTO:hi@example.com'
  ];
  cases.forEach(href => {
    const wrapper = mountAttribution(`<a href="${href}">x</a>`);
    const anchors = wrapper.find('a');
    t.equal(anchors.length, 1, `link rendered for ${href}`);
    t.equal(anchors.at(0).prop('href'), href, `href preserved for ${href}`);
    t.equal(anchors.at(0).prop('rel'), 'noopener noreferrer', `safe rel for ${href}`);
    t.equal(anchors.at(0).prop('target'), '_blank', `target _blank for ${href}`);
  });
  t.end();
});

test('renderBasemapAttribution -> empty and whitespace-only anchors are dropped', t => {
  const empty = mountAttribution('<a href="https://x.com"></a>tail');
  t.equal(empty.find('a').length, 0, 'empty anchor is not rendered as a link');
  t.ok(empty.text().includes('tail'), 'surrounding text kept');

  const wsOnly = mountAttribution('<a href="https://x.com">   </a>keep');
  t.equal(wsOnly.find('a').length, 0, 'whitespace-only anchor is not rendered as a link');
  t.ok(wsOnly.text().includes('keep'), 'surrounding text kept');
  t.end();
});

test('renderBasemapAttribution -> event-handler attributes are never carried to output', t => {
  // even for a safe href, only href/target/rel are set; inline handlers dropped
  const wrapper = mountAttribution(
    '<a href="https://x.com" onclick="alert(1)" onmouseover="x()" style="color:red">y</a>'
  );
  const anchors = wrapper.find('a');
  t.equal(anchors.length, 1, 'safe anchor rendered');
  t.notOk(anchors.at(0).prop('onClick'), 'no onClick handler');
  t.notOk(anchors.at(0).prop('onclick'), 'no onclick attribute');
  t.notOk(anchors.at(0).prop('style'), 'no inline style carried over');
  t.end();
});

test('renderBasemapAttribution -> img/onerror payload does not render an image or execute', t => {
  const wrapper = mountAttribution('<img src="x" onerror="alert(1)">visible');
  t.equal(wrapper.find('img').length, 0, 'no img element rendered');
  t.equal(wrapper.text(), 'visible', 'only surrounding text is rendered');
  t.end();
});

test('renderBasemapAttribution -> deeply nested non-anchor markup flattens to text', t => {
  const html =
    '<div><span><b>Deep</b> <i>text</i></span> and <a href="https://x.com">link</a></div>';
  const wrapper = mountAttribution(html);
  const anchors = wrapper.find('a');
  t.equal(anchors.length, 1, 'the single link is preserved');
  t.equal(anchors.at(0).prop('href'), 'https://x.com', 'href preserved through nesting');
  t.ok(wrapper.text().includes('Deep text'), 'nested formatting flattened to text');
  t.end();
});

test('renderBasemapAttribution -> always returns an array, never throws', t => {
  const inputs = [
    '',
    '   ',
    'plain',
    '<a>no href</a>',
    '<a href="">empty href</a>',
    '<<<malformed>>>',
    '<a href="https://x.com">unclosed',
    '&copy; &amp; &lt; &gt; entities'
  ];
  inputs.forEach(html => {
    const out = renderBasemapAttribution(html, 'k');
    t.ok(Array.isArray(out), `array returned for ${JSON.stringify(html)}`);
  });
  t.end();
});

test('renderBasemapAttribution -> keys are unique across produced nodes', t => {
  const html =
    'a <a href="https://one.com">one</a> b <a href="https://two.com">two</a> c ' +
    '<a href="https://three.com">three</a>';
  const nodes = renderBasemapAttribution(html, 'k');
  const keys = nodes.map(n => n.key);
  t.equal(new Set(keys).size, keys.length, 'no duplicate React keys');
  t.ok(keys.every(Boolean), 'every node has a key');
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

test('dedupeBasemapAttributions -> empty and single-entry inputs', t => {
  t.deepEqual(dedupeBasemapAttributions([]), [], 'empty input yields empty output');
  t.deepEqual(dedupeBasemapAttributions(['© Solo']), ['© Solo'], 'single entry is kept');
  t.end();
});

test('dedupeBasemapAttributions -> order is preserved', t => {
  const a = '<a href="https://a.com">Alpha</a>';
  const b = '<a href="https://b.com">Beta</a>';
  const c = '<a href="https://c.com">Gamma</a>';
  t.deepEqual(dedupeBasemapAttributions([c, a, b]), [c, a, b], 'input order preserved');
  t.end();
});

test('dedupeBasemapAttributions -> shorter-first: fuller variant adds no new tokens, collapses', t => {
  // "© OpenStreetMap" comes first and is kept; the fuller "... contributors"
  // normalizes to the same token set ("contributors" is boilerplate), so it is
  // subsumed and the shorter (first) entry wins
  const osm = '© OpenStreetMap';
  const osmFull = '© OpenStreetMap contributors';
  t.deepEqual(
    dedupeBasemapAttributions([osm, osmFull]),
    [osm],
    'fuller variant with only boilerplate difference collapses to the first'
  );
  t.end();
});

test('dedupeBasemapAttributions -> fuller entry with new tokens after a shorter one is kept', t => {
  // shorter first; the later entry introduces a genuinely new token (carto), so
  // it is NOT subsumed and both are kept
  const osm = '© OpenStreetMap';
  const both = '© CARTO, © OpenStreetMap';
  t.deepEqual(
    dedupeBasemapAttributions([osm, both]),
    [osm, both],
    'later entry with an additional provider is preserved'
  );
  t.end();
});

test('dedupeBasemapAttributions -> is idempotent', t => {
  const carto =
    '© <a href="https://carto.com/attributions">CARTO</a>, © ' +
    '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const osm = '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>';
  const once = dedupeBasemapAttributions([carto, osm]);
  const twice = dedupeBasemapAttributions(once);
  t.deepEqual(twice, once, 'running dedupe again changes nothing');
  t.end();
});

test('dedupeBasemapAttributions -> does not mutate its input array', t => {
  const input = ['© OpenStreetMap contributors', '© OpenStreetMap'];
  const snapshot = [...input];
  dedupeBasemapAttributions(input);
  t.deepEqual(input, snapshot, 'input array is unchanged');
  t.end();
});

test('dedupeBasemapAttributions -> different link hosts are not merged', t => {
  const a = '<a href="https://openstreetmap.org">Map</a>';
  const b = '<a href="https://openmaptiles.org">Map</a>';
  // same visible text "Map" but different hosts -> both kept (host token differs)
  t.deepEqual(
    dedupeBasemapAttributions([a, b]),
    [a, b],
    'same text but distinct hosts are preserved'
  );
  t.end();
});

test('dedupeBasemapAttributions -> punctuation/casing/whitespace normalized in text', t => {
  const a = '©  OpenStreetMap   Contributors';
  const b = '© openstreetmap, contributors';
  t.deepEqual(
    dedupeBasemapAttributions([a, b]),
    [a],
    'text normalized (case, punctuation, whitespace, "contributors") collapses'
  );
  t.end();
});

test('dedupeBasemapAttributions -> whitespace-only entries are dropped as empty signatures', t => {
  // exact-dup path keeps the first; a second identical whitespace entry is a
  // duplicate string so it is removed
  t.deepEqual(dedupeBasemapAttributions(['   ', '   ']), ['   '], 'duplicate blank collapses');
  t.end();
});
