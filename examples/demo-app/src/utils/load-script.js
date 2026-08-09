// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Dynamically load an external script once.
 * @param {string} src
 * @returns {Promise<void>}
 */
export function loadScript(src) {
  if (typeof document === 'undefined') {
    return Promise.reject(new Error('Cannot load script outside the browser'));
  }

  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) {
    if (existing.dataset.loaded === 'true') {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      existing.addEventListener(
        'load',
        () => {
          existing.dataset.loaded = 'true';
          resolve();
        },
        {once: true}
      );
      existing.addEventListener(
        'error',
        () => reject(new Error(`Failed to load script: ${src}`)),
        {once: true}
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}
