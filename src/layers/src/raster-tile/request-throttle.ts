// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {getApplicationConfig} from '@kepler.gl/utils';

interface RequestQueue {
  activeRequests: number;
  queue: Array<() => void>;
}

class RequestThrottle {
  private serverQueues: Record<string, RequestQueue>;
  private maxConcurrentRequests: number;

  constructor() {
    this.serverQueues = {};
    this.maxConcurrentRequests = getApplicationConfig().rasterServerMaxPerServerRequests;
  }

  private getServerQueue(serverKey: string): RequestQueue {
    if (!this.serverQueues[serverKey]) {
      this.serverQueues[serverKey] = {
        activeRequests: 0,
        queue: []
      };
    }
    return this.serverQueues[serverKey];
  }

  getDebugInfo(): string {
    const stats = Object.entries(this.serverQueues).map(([serverKey, queue]) => {
      return `Server: ${serverKey}
  Active Requests: ${queue.activeRequests}
  Queued Requests: ${queue.queue.length}`;
    });

    return stats.length > 0
      ? `Request Throttle Stats:\n${stats.join('\n')}`
      : 'No active server queues';
  }

  async throttleRequest<T>(
    serverKey: string,
    requestFunction: () => Promise<T>,
    maxConcurrentRequestsOverride?: number
  ): Promise<T> {
    const serverQueue = this.getServerQueue(serverKey);
    const maxConcurrentRequests =
      typeof maxConcurrentRequestsOverride === 'number'
        ? maxConcurrentRequestsOverride
        : this.maxConcurrentRequests;

    if (serverQueue.activeRequests >= maxConcurrentRequests && Boolean(maxConcurrentRequests)) {
      // Wait for a free slot. We push only the resolver — requestFunction is called once below.
      await new Promise<void>(resolve => {
        serverQueue.queue.push(resolve);
      });
    }

    serverQueue.activeRequests++;
    try {
      return await requestFunction();
    } finally {
      serverQueue.activeRequests--;
      // Unblock the next waiting caller, if any
      const nextResolve = serverQueue.queue.shift();
      if (nextResolve) {
        nextResolve();
      }
    }
  }
}

// Create a singleton instance
let requestThrottle: RequestThrottle | null = null;

export function getRequestThrottle(): RequestThrottle {
  if (!requestThrottle) requestThrottle = new RequestThrottle();
  return requestThrottle;
}
