// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Resolve the runtime config URL.
 *
 * Default is origin-root `/config.json` so SPA routes (`/demo/:id`) and
 * GHCR / kepler.gl.com / Docker-at-/ still find it. A naive relative
 * `config.json` would 404 under those routes.
 *
 * Sub-path reverse proxies (`/kepler/`) can set `window.__KEPLER_CONFIG_HREF__`
 * (Docker: `KEPLER_CONFIG_HREF`) or a `<base href>`; then `config.json` is
 * resolved against that base.
 *
 * @param {Window} [win]
 * @returns {string}
 */
export function getRuntimeConfigHref(win = typeof window !== 'undefined' ? window : undefined) {
  if (!win) {
    return '/config.json';
  }

  const override = win.__KEPLER_CONFIG_HREF__;
  if (typeof override === 'string' && override.trim()) {
    return override.trim();
  }

  const doc = win.document;
  const hasBaseHref =
    doc &&
    typeof doc.querySelector === 'function' &&
    doc.querySelector('base[href]') &&
    doc.baseURI;
  if (hasBaseHref) {
    try {
      return new URL('config.json', doc.baseURI).href;
    } catch {
      // fall through to origin-root default
    }
  }

  return '/config.json';
}
