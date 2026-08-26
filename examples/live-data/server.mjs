// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Serves a CORS CSV snapshot of vehicles around San Francisco.
 *
 * GET /vehicles.csv        current snapshot (rewritten every 10 seconds)
 * GET /vehicles.csv?fresh=1  step immediately, then return (for Reload testing)
 *
 * Kepler.gl polls this URL as DatasetType.EXTERNALLY_HOSTED.
 */
import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const DEFAULT_PORT = Number(process.env.LIVE_DATA_PORT || 4010);
const SNAPSHOT_MS = Number(process.env.LIVE_DATA_INTERVAL_MS || 10_000);
const SF = {lat: 37.7749, lng: -122.4194};

const vehicles = Array.from({length: 12}, (_, i) => ({
  id: `veh-${String(i + 1).padStart(2, '0')}`,
  lat: SF.lat + (Math.random() - 0.5) * 0.04,
  lng: SF.lng + (Math.random() - 0.5) * 0.06,
  speed: 12 + Math.random() * 28,
  heading: Math.random() * 360
}));

let snapshot = 0;
let updatedAt = new Date().toISOString();
let lastModifiedHttp = new Date().toUTCString();
let csv = '';
let etag = '';

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

function clampToSf(vehicle) {
  if (Math.abs(vehicle.lat - SF.lat) > 0.05) {
    vehicle.lat = SF.lat + (Math.random() - 0.5) * 0.02;
  }
  if (Math.abs(vehicle.lng - SF.lng) > 0.08) {
    vehicle.lng = SF.lng + (Math.random() - 0.5) * 0.03;
  }
}

function step() {
  snapshot += 1;
  const now = new Date();
  updatedAt = now.toISOString();
  lastModifiedHttp = now.toUTCString();
  const dtHours = SNAPSHOT_MS / 3_600_000;
  for (const vehicle of vehicles) {
    const headingRad = (vehicle.heading * Math.PI) / 180;
    // Exaggerate real km/h so a 10s poll is obvious at city zoom (~300–500 m).
    const distDeg = ((vehicle.speed * dtHours) / 111) * 40;
    vehicle.lat += Math.cos(headingRad) * distDeg;
    vehicle.lng +=
      (Math.sin(headingRad) * distDeg) / Math.max(0.2, Math.cos((vehicle.lat * Math.PI) / 180));
    vehicle.heading = (vehicle.heading + (Math.random() - 0.5) * 50 + 360) % 360;
    vehicle.speed = Math.max(5, Math.min(65, vehicle.speed + (Math.random() - 0.5) * 10));
    clampToSf(vehicle);
  }
  const header = 'id,lat,lng,speed,heading,snapshot,updated_at';
  const rows = vehicles.map(
    vehicle =>
      `${vehicle.id},${vehicle.lat.toFixed(6)},${vehicle.lng.toFixed(6)},${vehicle.speed.toFixed(
        1
      )},${vehicle.heading.toFixed(1)},${snapshot},${updatedAt}`
  );
  csv = `${header}\n${rows.join('\n')}\n`;
  etag = `"snap-${snapshot}"`;
}

function serveCsv(req, res) {
  if (req.headers['if-none-match'] === etag) {
    res.writeHead(304, corsHeaders({ETag: etag, 'Last-Modified': lastModifiedHttp}));
    res.end();
    return;
  }
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

function serveIndex(res) {
  const body = `<!DOCTYPE html>
<html>
  <head><title>kepler.gl live-data</title></head>
  <body style="font-family: sans-serif; max-width: 42em; padding: 24px">
    <h1>Live vehicle CSV</h1>
    <p>New snapshot every ${SNAPSHOT_MS / 1000}s (currently snapshot ${snapshot}).</p>
    <ul>
      <li><a href="/vehicles.csv">/vehicles.csv</a> — current snapshot</li>
      <li><a href="/vehicles.csv?fresh=1">/vehicles.csv?fresh=1</a> — step, then return</li>
    </ul>
    <p>Paste that URL into Kepler.gl Add Data → URL, with refresh set to 10s.</p>
  </body>
</html>`;
  res.writeHead(200, corsHeaders({'Content-Type': 'text/html; charset=utf-8'}));
  res.end(body);
}

export function startLiveDataServer(port = DEFAULT_PORT) {
  step();
  const timer = setInterval(step, SNAPSHOT_MS);
  timer.unref?.();

  const server = http.createServer((req, res) => {
    const url = new URL(req.url || '/', `http://127.0.0.1:${port}`);
    if (req.method === 'OPTIONS') {
      res.writeHead(204, corsHeaders());
      res.end();
      return;
    }
    if (url.pathname === '/vehicles.csv') {
      if (url.searchParams.has('fresh')) {
        step();
      }
      serveCsv(req, res);
      return;
    }
    if (url.pathname === '/' || url.pathname === '/index.html') {
      serveIndex(res);
      return;
    }
    res.writeHead(404, corsHeaders({'Content-Type': 'text/plain'}));
    res.end('Not found\n');
  });

  server.listen(port, () => {
    console.info(
      `Live CSV at http://localhost:${port}/vehicles.csv (new snapshot every ${SNAPSHOT_MS / 1000}s)`
    );
  });

  return server;
}

const isDirectRun =
  Boolean(process.argv[1]) &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isDirectRun) {
  startLiveDataServer();
}
