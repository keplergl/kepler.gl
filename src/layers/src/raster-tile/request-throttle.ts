import {getApplicationConfig} from '@kepler.gl/utils';

interface RequestQueue {
  activeRequests: number;
  queue: Array<() => Promise<any>>;
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

  async throttleRequest<T>(serverKey: string, requestFunction: () => Promise<T>): Promise<T> {
    const serverQueue = this.getServerQueue(serverKey);

    if (
      serverQueue.activeRequests >= this.maxConcurrentRequests &&
      Boolean(this.maxConcurrentRequests)
    ) {
      // Wait for a slot to become available
      await new Promise<void>(resolve => {
        serverQueue.queue.push(async () => {
          try {
            const result = await requestFunction();
            resolve();
            return result;
          } catch (error) {
            resolve();
            return null;
          }
        });
      });
    }

    serverQueue.activeRequests++;
    try {
      return await requestFunction();
    } finally {
      serverQueue.activeRequests--;
      // Process next request in queue if any
      const nextRequest = serverQueue.queue.shift();
      if (nextRequest) {
        nextRequest();
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
