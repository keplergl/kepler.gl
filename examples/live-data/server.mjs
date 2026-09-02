// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Serves a CORS CSV of points orbiting San Francisco.
 *
 * Positions are a function of wall-clock time: each point completes one full
 * loop every 120 seconds. GET /vehicles.csv returns the current positions at
 * request time (no server-side snapshot timer).
 *
 * Kepler.gl polls this URL as DatasetType.EXTERNALLY_HOSTED.
 */
import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {attachWebSocketHub} from './websocket.mjs';

const DEFAULT_PORT = Number(process.env.LIVE_DATA_PORT || 4010);
const PERIOD_MS = Number(process.env.LIVE_DATA_PERIOD_MS || 120_000);
const POINT_COUNT = Number(process.env.LIVE_DATA_POINTS || 3);
const WS_INTERVAL_MS = Number(process.env.LIVE_DATA_WS_INTERVAL_MS || 400);
const WS_POINT_COUNT = Number(process.env.LIVE_DATA_WS_POINTS || 3);
const WS_PATH = '/vehicles.ws';
const WS_PERIOD_MS = 20_000;
const SF = {lat: 37.7749, lng: -122.4194};
const COS_LAT = Math.cos((SF.lat * Math.PI) / 180);
const KM_PER_DEG_LAT = 111.32;
const RINGS = 3;
const POINTS_PER_RING = Math.max(1, Math.round(POINT_COUNT / RINGS));

function corsHeaders(extra = {}) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'If-None-Match, If-Modified-Since, Content-Type',
    'Access-Control-Expose-Headers': 'ETag, Last-Modified',
    'Cache-Control': 'no-store',
    ...extra
  };
}

function orbitProgress(nowMs) {
  const elapsed = ((nowMs % PERIOD_MS) + PERIOD_MS) % PERIOD_MS;
  return elapsed / PERIOD_MS;
}

function pointAt(nowMs, index) {
  const ring = Math.floor(index / POINTS_PER_RING);
  const onRing = index % POINTS_PER_RING;
  const radiusKm = 1.8 + ring * 1.2;
  const radiusLat = radiusKm / KM_PER_DEG_LAT;
  const radiusLng = radiusKm / (KM_PER_DEG_LAT * COS_LAT);
  const direction = ring % 2 === 0 ? 1 : -1;
  const start = (onRing / POINTS_PER_RING) * 2 * Math.PI + ring * 0.35;
  const tau = orbitProgress(nowMs);
  const theta = start + direction * tau * 2 * Math.PI;
  const lat = SF.lat + radiusLat * Math.sin(theta);
  const lng = SF.lng + radiusLng * Math.cos(theta);
  const dLat = direction * radiusLat * Math.cos(theta);
  const dLng = direction * -radiusLng * Math.sin(theta);
  const heading = (Math.atan2(dLng, dLat) * 180) / Math.PI;
  const speedKmh = ((2 * Math.PI * radiusKm) / (PERIOD_MS / 1000)) * 3600;
  return {
    id: `veh-${String(index + 1).padStart(2, '0')}`,
    lat,
    lng,
    heading: (heading + 360) % 360,
    speed: speedKmh,
    ring: ring + 1,
    progress: tau
  };
}

function buildCsv(now = new Date()) {
  const nowMs = now.getTime();
  const tau = orbitProgress(nowMs);
  const updatedAt = now.toISOString();
  const header = 'id,lat,lng,heading,speed,ring,progress,orbit_s,updated_at';
  const rows = Array.from({length: POINT_COUNT}, (_, index) => {
    const point = pointAt(nowMs, index);
    return [
      point.id,
      point.lat.toFixed(6),
      point.lng.toFixed(6),
      point.heading.toFixed(1),
      point.speed.toFixed(1),
      point.ring,
      point.progress.toFixed(4),
      (tau * (PERIOD_MS / 1000)).toFixed(2),
      updatedAt
    ].join(',');
  });
  return `${header}\n${rows.join('\n')}\n`;
}

function wsVehicleAt(nowMs, index) {
  const tau = (((nowMs % WS_PERIOD_MS) + WS_PERIOD_MS) % WS_PERIOD_MS) / WS_PERIOD_MS;
  const radiusKm = 6.4 + index * 0.45;
  const radiusLat = radiusKm / KM_PER_DEG_LAT;
  const radiusLng = radiusKm / (KM_PER_DEG_LAT * COS_LAT);
  const theta = tau * 2 * Math.PI + index * 1.7;
  const lat = SF.lat + radiusLat * Math.sin(theta);
  const lng = SF.lng + radiusLng * Math.cos(theta);
  const heading = (((Math.atan2(-radiusLng * Math.sin(theta), radiusLat * Math.cos(theta)) * 180) /
    Math.PI) +
    360) %
    360;
  return {
    id: `ws-${String(index + 1).padStart(2, '0')}`,
    lat,
    lng,
    heading,
    speed: ((2 * Math.PI * radiusKm) / (WS_PERIOD_MS / 1000)) * 3600,
    ring: 8 + index,
    progress: tau,
    orbit_s: tau * (WS_PERIOD_MS / 1000),
    updated_at: new Date(nowMs).toISOString()
  };
}

function websocketPayload(nowMs = Date.now()) {
  return {
    op: 'upsert',
    upsertBy: 'id',
    rows: Array.from({length: WS_POINT_COUNT}, (_, index) => wsVehicleAt(nowMs, index))
  };
}

function serveCsv(req, res) {
  const now = new Date();
  const csv = buildCsv(now);
  const lastModifiedHttp = now.toUTCString();
  // Unique per request so If-None-Match never 304s: each fetch is a new time sample.
  const etag = `"t-${now.getTime()}"`;
  res.writeHead(
    200,
    corsHeaders({
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Length': Buffer.byteLength(csv),
      ETag: etag,
      'Last-Modified': lastModifiedHttp
    })
  );
  if (req.method !== 'HEAD') {
    res.end(csv);
    return;
  }
  res.end();
}

function serveIndex(res, port) {
  const tau = orbitProgress(Date.now());
  const body = `<!DOCTYPE html>
<html>
  <head><title>kepler.gl live-data</title></head>
  <body style="font-family: sans-serif; max-width: 42em; padding: 24px">
    <h1>Live orbit CSV</h1>
    <p>${POINT_COUNT} points circle San Francisco. One full loop every ${
    PERIOD_MS / 1000
  }s (currently ${(tau * 100).toFixed(1)}% through the orbit).</p>
    <ul>
      <li><a href="/vehicles.csv">/vehicles.csv</a> — paste this into Kepler.gl Add Data → URL, then set Refresh to Custom (0.3s)</li>
      <li><code>ws://localhost:${port}${WS_PATH}</code> — JSON upserts for the live-data <strong>host app</strong> (not Add Data)</li>
    </ul>
    <p>The WebSocket URL is not a Kepler dataset source. Only the CSV belongs in Add Data → URL.</p>
  </body>
</html>`;
  res.writeHead(200, corsHeaders({'Content-Type': 'text/html; charset=utf-8'}));
  res.end(body);
}

export function startLiveDataServer(port = DEFAULT_PORT) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url || '/', `http://127.0.0.1:${port}`);
    if (req.method === 'OPTIONS') {
      res.writeHead(204, corsHeaders());
      res.end();
      return;
    }
    if (url.pathname === '/vehicles.csv') {
      serveCsv(req, res);
      return;
    }
    if (url.pathname === '/' || url.pathname === '/index.html') {
      serveIndex(res, port);
      return;
    }
    res.writeHead(404, corsHeaders({'Content-Type': 'text/plain'}));
    res.end('Not found\n');
  });

  attachWebSocketHub(server, {
    pathname: WS_PATH,
    intervalMs: WS_INTERVAL_MS,
    getPayload: () => websocketPayload()
  });

  server.listen(port, () => {
    console.info(
      `Live CSV at http://localhost:${port}/vehicles.csv (${POINT_COUNT} points, ${
        PERIOD_MS / 1000
      }s orbit)`
    );
    console.info(
      `Live WebSocket at ws://localhost:${port}${WS_PATH} (${WS_POINT_COUNT} points, ${
        WS_INTERVAL_MS
      }ms upsert)`
    );
  });

  return server;
}

const isDirectRun =
  Boolean(process.argv[1]) && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isDirectRun) {
  startLiveDataServer();
}
