// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Generates a tileable star-field used behind the globe.
 * The live map and video-export preview paint it as a CSS `background-image`
 * with `background-repeat: repeat`. Video-export capture (which only reads
 * canvas pixels) tiles the same image onto a 2D context via
 * `drawStarsBackground`. The result is deterministic (seeded PRNG) and cached
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

let cachedCanvas: HTMLCanvasElement | null = null;
let cachedDataUrl: string | null = null;

function generateStarsTile(): HTMLCanvasElement | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const canvas = document.createElement('canvas');
  canvas.width = STAR_CANVAS_SIZE;
  canvas.height = STAR_CANVAS_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Transparent background so CSS backgroundColor / canvas fill shows through
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

  return canvas;
}

function getStarsTileCanvas(): HTMLCanvasElement | null {
  if (cachedCanvas) return cachedCanvas;
  cachedCanvas = generateStarsTile();
  return cachedCanvas;
}

/**
 * Returns a data URL of a tileable star-field image (512×512 PNG).
 * Generates the image once and caches it for subsequent calls.
 */
export function getStarsBackgroundImage(): string {
  if (cachedDataUrl) return cachedDataUrl;

  const canvas = getStarsTileCanvas();
  if (!canvas) {
    // SSR / missing 2D context: return a transparent 1x1 pixel so url() never
    // resolves to an empty value that could trigger a request for the document.
    return (cachedDataUrl = TRANSPARENT_PIXEL);
  }

  cachedDataUrl = canvas.toDataURL('image/png');
  return cachedDataUrl;
}

type StarCamera = {longitude?: number; latitude?: number; zoom?: number};

/** Decorative parallax, not a physical sky. Keep zoom subtle and longitude periodic. */
function starLayout(camera: StarCamera, width: number, height: number) {
  const finite = (value: number | undefined) => (Number.isFinite(value) ? value! : 0);
  const zoomScale = 1 + 0.15 * Math.tanh(finite(camera.zoom) / 6);
  // Preserve the original pixel-sized stars regardless of viewport width or DPR.
  const size = STAR_CANVAS_SIZE * zoomScale;
  const longitude = ((finite(camera.longitude) % 360) + 360) % 360;
  const latitude = Math.max(-90, Math.min(90, finite(camera.latitude)));
  return {
    size,
    x: (width / 2) * (1 - zoomScale) - (longitude / 360) * size,
    y: (height / 2) * (1 - zoomScale) + (latitude / 180) * size
  };
}

/** CSS and canvas capture share the same cached tile and camera transform. */
export function getStarsBackgroundStyle(
  camera: StarCamera,
  width: number,
  height: number,
  displayScale = 1
) {
  // Export previews display a smaller copy of the encoded frame, not a larger star tile.
  const scale = Number.isFinite(displayScale) && displayScale > 0 ? displayScale : 1;
  const {size, x, y} = starLayout(camera, width / scale, height / scale);
  return {
    backgroundSize: `${size * scale}px ${size * scale}px`,
    backgroundPosition: `${x * scale}px ${y * scale}px`
  };
}

/**
 * Tile the star-field onto a 2D canvas (e.g. video-export frame capture).
 * Stars are drawn with alpha so the caller should fill the background color first.
 */
export function drawStarsBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  camera?: StarCamera
): void {
  const tile = getStarsTileCanvas();
  if (!tile || width <= 0 || height <= 0) return;
  const pattern = ctx.createPattern(tile, 'repeat');
  if (!pattern) return;
  ctx.fillStyle = pattern;
  if (!camera) {
    ctx.fillRect(0, 0, width, height);
    return;
  }
  const {size, x, y} = starLayout(camera, width, height);
  const scale = size / STAR_CANVAS_SIZE;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillRect(-x / scale, -y / scale, width / scale, height / scale);
  ctx.restore();
}
