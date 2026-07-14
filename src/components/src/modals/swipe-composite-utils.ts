// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {easeInOut} from 'popmotion';

export type SwipeEasing = 'linear' | 'ease-in-out';

const linear = (p: number): number => p;
const EASING_MAP: Record<SwipeEasing, (p: number) => number> = {
  linear,
  'ease-in-out': easeInOut
};

/**
 * Compute the swipe percentage at a given time.
 */
export function getSwipePercentageAtTime(
  timeMs: number,
  durationMs: number,
  startPct: number,
  endPct: number,
  easing: SwipeEasing = 'ease-in-out'
): number {
  const progress = Math.max(0, Math.min(1, timeMs / durationMs));
  const easedProgress = EASING_MAP[easing](progress);
  return startPct + (endPct - startPct) * easedProgress;
}

const HANDLE_RADIUS = 14;
const ARROW_SIZE = 6;

/**
 * Draw a swipe divider (line + circular handle with arrows) onto a 2D canvas context.
 */
function drawSwipeDivider(
  ctx: CanvasRenderingContext2D,
  splitX: number,
  height: number
): void {
  ctx.save();

  // Divider line
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.moveTo(splitX, 0);
  ctx.lineTo(splitX, height);
  ctx.stroke();

  // Handle circle
  const cy = height / 2;
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(splitX, cy, HANDLE_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = '#29323C';
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Left arrow
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(splitX - ARROW_SIZE - 3, cy);
  ctx.lineTo(splitX - 3, cy - ARROW_SIZE);
  ctx.lineTo(splitX - 3, cy + ARROW_SIZE);
  ctx.closePath();
  ctx.fill();

  // Right arrow
  ctx.beginPath();
  ctx.moveTo(splitX + ARROW_SIZE + 3, cy);
  ctx.lineTo(splitX + 3, cy - ARROW_SIZE);
  ctx.lineTo(splitX + 3, cy + ARROW_SIZE);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * Composite two canvases (left/right map views) with a swipe divider
 * into a single output canvas.
 */
export function compositeSwipeFrame(
  leftCanvas: HTMLCanvasElement,
  rightCanvas: HTMLCanvasElement,
  outputCanvas: HTMLCanvasElement,
  percentage: number,
  showDivider: boolean = true
): void {
  const ctx = outputCanvas.getContext('2d');
  if (!ctx) return;

  const w = outputCanvas.width;
  const h = outputCanvas.height;
  const splitX = Math.round((w * percentage) / 100);

  ctx.clearRect(0, 0, w, h);

  // Draw right (background) canvas fully
  ctx.drawImage(rightCanvas, 0, 0, w, h);

  // Draw left (foreground) canvas clipped to 0..splitX
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, splitX, h);
  ctx.clip();
  ctx.drawImage(leftCanvas, 0, 0, w, h);
  ctx.restore();

  // Draw the divider
  if (showDivider) {
    drawSwipeDivider(ctx, splitX, h);
  }
}
