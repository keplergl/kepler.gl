// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {KeplerMcpBridge} from '../../examples/demo-app/src/kepler-mcp-bridge';
import {buildCatalog, buildKeplerContext} from '../../examples/demo-app/src/kepler-mcp-shared';

jest.mock('../../examples/demo-app/src/kepler-mcp-shared', () => ({
  buildCatalog: jest.fn(),
  buildKeplerContext: jest.fn(),
  toDescriptor: command => ({id: command.id})
}));

const originalWebSocket = global.WebSocket;

class MockWebSocket {
  static OPEN = 1;
  static instances = [];
  readyState = MockWebSocket.OPEN;
  send = jest.fn();
  close = jest.fn(() => {
    this.readyState = 3;
  });

  constructor() {
    MockWebSocket.instances.push(this);
  }

  receive(message) {
    return this.onmessage({data: JSON.stringify(message)});
  }
}

function deferred() {
  let resolve;
  const promise = new Promise(done => {
    resolve = done;
  });
  return {promise, resolve};
}

describe('MCP browser bridge cancellation', () => {
  let execute;

  beforeEach(() => {
    MockWebSocket.instances = [];
    global.WebSocket = MockWebSocket;
    sessionStorage.clear();
    window.history.replaceState({}, '', '/?mcp=test-token');
    buildKeplerContext.mockReturnValue({});
    execute = jest.fn();
    buildCatalog.mockReturnValue([{id: 'map.load-data', execute}]);
  });

  afterEach(() => {
    cleanup();
    global.WebSocket = originalWebSocket;
    sessionStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  function call(socket, callId) {
    return socket.receive({type: 'call', callId, tool: 'map.load-data', input: {url: '/data.csv'}});
  }

  it('passes a live signal to the command and returns a completed result', async () => {
    const result = {success: true, commandId: 'map.load-data', data: {datasetId: 'imported'}};
    execute.mockResolvedValue(result);
    render(<KeplerMcpBridge reduxStore={{}} />);
    const socket = MockWebSocket.instances[0];

    await call(socket, 'load');

    const [context, input] = execute.mock.calls[0];
    expect(context.signal).toBeInstanceOf(AbortSignal);
    expect(context.signal.aborted).toBe(false);
    expect(input).toEqual({url: '/data.csv'});
    expect(JSON.parse(socket.send.mock.calls[0][0])).toEqual({
      type: 'result',
      callId: 'load',
      result
    });
  });

  it('cancels only the requested call and suppresses its late result', async () => {
    const first = deferred();
    const second = deferred();
    execute.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    render(<KeplerMcpBridge reduxStore={{}} />);
    const socket = MockWebSocket.instances[0];
    const firstCall = call(socket, 'first');
    const secondCall = call(socket, 'second');

    await socket.receive({type: 'cancel', callId: 'first'});

    expect(execute.mock.calls[0][0].signal.aborted).toBe(true);
    expect(execute.mock.calls[1][0].signal.aborted).toBe(false);
    first.resolve({success: true});
    second.resolve({success: true});
    await Promise.all([firstCall, secondCall]);
    expect(socket.send).toHaveBeenCalledTimes(1);
    expect(JSON.parse(socket.send.mock.calls[0][0]).callId).toBe('second');
  });

  it.each(['disconnect', 'unmount'])('aborts every pending call on %s', async event => {
    const pending = deferred();
    execute.mockReturnValue(pending.promise);
    const view = render(<KeplerMcpBridge reduxStore={{}} />);
    const socket = MockWebSocket.instances[0];
    const calls = [call(socket, 'first'), call(socket, 'second')];

    if (event === 'disconnect') {
      // Invalid-token close does not schedule a reconnect.
      socket.onclose({code: 1008});
    } else {
      view.unmount();
    }

    expect(execute.mock.calls.map(([context]) => context.signal.aborted)).toEqual([true, true]);
    pending.resolve({success: true});
    await Promise.all(calls);
    expect(socket.send).not.toHaveBeenCalled();
  });
});
