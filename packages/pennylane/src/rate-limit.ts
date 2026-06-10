/**
 * Minimal request throttle. Pennylane v2 allows up to 5 requests/second.
 * We serialize calls through a small queue that releases at most
 * `maxPerInterval` permits per `intervalMs` window.
 */
export class RateLimiter {
  private readonly maxPerInterval: number;
  private readonly intervalMs: number;
  private timestamps: number[] = [];
  private queue: Array<() => void> = [];
  private draining = false;

  constructor(maxPerInterval = 5, intervalMs = 1000) {
    this.maxPerInterval = maxPerInterval;
    this.intervalMs = intervalMs;
  }

  async acquire(): Promise<void> {
    await new Promise<void>((resolve) => {
      this.queue.push(resolve);
      void this.drain();
    });
  }

  private async drain(): Promise<void> {
    if (this.draining) return;
    this.draining = true;
    try {
      while (this.queue.length > 0) {
        const now = Date.now();
        this.timestamps = this.timestamps.filter(
          (t) => now - t < this.intervalMs,
        );
        if (this.timestamps.length < this.maxPerInterval) {
          this.timestamps.push(now);
          const next = this.queue.shift();
          next?.();
        } else {
          const oldest = this.timestamps[0] ?? now;
          const wait = this.intervalMs - (now - oldest) + 5;
          await sleep(wait);
        }
      }
    } finally {
      this.draining = false;
    }
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
