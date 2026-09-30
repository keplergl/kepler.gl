// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Minimal WebSocket hub for the live-data example (no extra npm dependency).
 * Text frames only. Good enough to demo host-app `ws → addToDataset`.
 */
import crypto from 'node:crypto';

const ACCEPT_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
const OP_TEXT = 0x1;
const OP_CLOSE = 0x8;
const OP_PING = 0x9;
const OP_PONG = 0xa;

function acceptKey(secWebSocketKey) {
  return crypto.createHash('sha1').update(`${secWebSocketKey}${ACCEPT_GUID}`).digest('base64');
}

function encodeFrame(opcode, payload) {
  const body = Buffer.isBuffer(payload) ? payload : Buffer.from(payload);
  const len = body.length;
  let header;
  if (len < 126) {
    header = Buffer.alloc(2);
    header[0] = 0x80 | opcode;
    header[1] = len;
  } else if (len < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x80 | opcode;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x80 | opcode;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(len), 2);
  }
  return Buffer.concat([header, body]);
}

function readFrames(buffer) {
  const frames = [];
  let offset = 0;
  while (offset + 2 <= buffer.length) {
    const second = buffer[offset + 1];
    const masked = Boolean(second & 0x80);
    let len = second & 0x7f;
    let pos = offset + 2;
    if (len === 126) {
      if (pos + 2 > buffer.length) {
        break;
      }
      len = buffer.readUInt16BE(pos);
      pos += 2;
    } else if (len === 127) {
      if (pos + 8 > buffer.length) {
        break;
      }
      len = Number(buffer.readBigUInt64BE(pos));
      pos += 8;
    }
    const maskBytes = masked ? 4 : 0;
    if (pos + maskBytes + len > buffer.length) {
      break;
    }
    const opcode = buffer[offset] & 0x0f;
    let payload = buffer.subarray(pos + maskBytes, pos + maskBytes + len);
    if (masked) {
      const mask = buffer.subarray(pos, pos + 4);
      payload = Buffer.from(payload);
      for (let i = 0; i < payload.length; i++) {
        payload[i] ^= mask[i % 4];
      }
    }
    frames.push({opcode, payload});
    offset = pos + maskBytes + len;
  }
  return {frames, rest: buffer.subarray(offset)};
}

/**
 * Upgrade GET requests on `pathname` and broadcast `getPayload()` JSON to
 * every connected client on `intervalMs`.
 */
export function attachWebSocketHub(server, {pathname, intervalMs, getPayload}) {
  const clients = new Set();

  server.on('upgrade', (req, socket, head) => {
    const url = new URL(req.url || '/', 'http://127.0.0.1');
    if (url.pathname !== pathname) {
      socket.write('HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n');
      socket.destroy();
      return;
    }
    const key = req.headers['sec-websocket-key'];
    if (req.headers.upgrade !== 'websocket' || !key) {
      socket.write('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n');
      socket.destroy();
      return;
    }

    socket.write(
      [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${acceptKey(key)}`,
        '',
        ''
      ].join('\r\n')
    );
    if (head?.length) {
      socket.unshift(head);
    }

    const client = {socket, buffer: Buffer.alloc(0)};
    clients.add(client);

    const drop = () => {
      clients.delete(client);
      socket.destroy();
    };

    socket.on('data', chunk => {
      client.buffer = Buffer.concat([client.buffer, chunk]);
      const {frames, rest} = readFrames(client.buffer);
      client.buffer = rest;
      for (const frame of frames) {
        if (frame.opcode === OP_CLOSE) {
          try {
            socket.write(encodeFrame(OP_CLOSE, frame.payload));
          } catch {
            // ignore
          }
          drop();
          return;
        }
        if (frame.opcode === OP_PING) {
          socket.write(encodeFrame(OP_PONG, frame.payload));
        }
      }
    });
    socket.on('error', drop);
    socket.on('close', drop);
  });

  const timer = setInterval(() => {
    if (!clients.size) {
      return;
    }
    const frame = encodeFrame(OP_TEXT, JSON.stringify(getPayload()));
    for (const client of clients) {
      try {
        client.socket.write(frame);
      } catch {
        clients.delete(client);
        client.socket.destroy();
      }
    }
  }, intervalMs);

  server.on('close', () => clearInterval(timer));
  return {clients, timer};
}
