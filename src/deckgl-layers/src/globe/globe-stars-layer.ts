// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Generates a CSS-compatible star-field background image as a data URL.
 * The stars are rendered onto an offscreen canvas, tiled seamlessly via CSS
 * `background-repeat`. The result is deterministic (seeded PRNG) and cached
 * so it's only generated once.
 */

const STAR_CANVAS_SIZE = 512;
const STAR_COUNT = 600;

// Seeded pseudo-random number generator (Park-Miller) for determinism.
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Transparent 1x1 PNG used as a fallback when a canvas context is unavailable
// (SSR or unsupported browser), so that `url(...)` never resolves to an empty
// value that could trigger a request for the current document.
const TRANSPARENT_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

let cachedDataUrl: string | null = null;

/**
 * Returns a data URL of a tileable star-field image (512×512 PNG).
 * Generates the image once and caches it for subsequent calls.
 */
export function getStarsBackgroundImage(): string {
  if (cachedDataUrl) return cachedDataUrl;

  if (typeof document === 'undefined') {
    // SSR fallback: return a transparent 1x1 pixel to avoid url() triggering a page request
    return TRANSPARENT_PIXEL;
  }

  const canvas = document.createElement('canvas');
  canvas.width = STAR_CANVAS_SIZE;
  canvas.height = STAR_CANVAS_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return (cachedDataUrl = TRANSPARENT_PIXEL);

  // Transparent background so CSS backgroundColor shows through
  ctx.clearRect(0, 0, STAR_CANVAS_SIZE, STAR_CANVAS_SIZE);

  const random = seededRandom(42);

  for (let i = 0; i < STAR_COUNT; i++) {
    const x = random() * STAR_CANVAS_SIZE;
    const y = random() * STAR_CANVAS_SIZE;
    const brightness = 140 + Math.floor(random() * 115); // 140–255
    const alpha = 0.4 + random() * 0.6; // 0.4–1.0
    const radius = 0.3 + random() * 1.0; // 0.3–1.3 px

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${alpha})`;
    ctx.fill();
  }

  cachedDataUrl = canvas.toDataURL('image/png');
  return cachedDataUrl;
}

