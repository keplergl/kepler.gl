// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {EXPORT_HTML_MAP_MODES} from '@kepler.gl/constants';

import {exportMapToHTML} from './export-map-html';

function getBranding(options: Record<string, unknown> = {}) {
  const html = exportMapToHTML({
    datasets: [],
    config: {version: 'v1', config: {}},
    mode: EXPORT_HTML_MAP_MODES.READ,
    ...options
  });
  const match = html.match(/const branding = (.+);/);
  if (!match) {
    throw new Error('Exported HTML did not serialize branding');
  }
  return {branding: JSON.parse(match[1]), html};
}

describe('exportMapToHTML branding', () => {
  test('normalizes custom icon and color branding for read-only and editable exports', () => {
    const {branding, html} = getBranding({
      appName: 'Atlas',
      appWebsite: 'atlas.example/maps',
      appIcon: 'atlas.example/icon.svg',
      appNameColor: '#123abc'
    });

    expect(branding).toEqual({
      appName: 'Atlas',
      appWebsite: 'https://atlas.example/maps',
      appIcon: 'https://atlas.example/icon.svg',
      appNameColor: '#123abc'
    });
    expect(html).toContain('src: branding.appIcon');
    expect(html).toContain(
      'react.createElement("span", {style: {color: branding.appNameColor}}, branding.appName)'
    );
    expect(html).toContain('react.createElement(BrandLogo, {fixed: true})');
    expect(html).toContain('Object.assign({}, props, {logoComponent: BrandLogo})');
    expect(html).toContain('!fixed && props && props.version');
    expect(html).toContain('className: "logo__version"');
  });

  test('falls back safely for missing or invalid icon and color values', () => {
    expect(getBranding().branding).toEqual({
      appName: 'kepler.gl',
      appWebsite: 'http://kepler.gl/',
      appIcon: null,
      appNameColor: '#1FBAD6'
    });
    expect(
      getBranding({appIcon: 'javascript:alert(1)', appNameColor: 'red'}).branding
    ).toMatchObject({appIcon: null, appNameColor: '#1FBAD6'});
  });

  test('keeps icon branding script-safe', () => {
    const {branding, html} = getBranding({
      appIcon: 'https://example.test/icon.svg?next=</script><script>window.pwned=1</script>'
    });

    expect(html).not.toContain('<script>window.pwned');
    expect(branding.appIcon).toBe(
      'https://example.test/icon.svg?next=%3C/script%3E%3Cscript%3Ewindow.pwned=1%3C/script%3E'
    );
  });
});
