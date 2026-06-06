import { vi, describe, it, expect, beforeEach } from 'vitest';
import { schedule } from '../../src/framework/scheduler';

describe('schedule', () => {
  it('executes callback on animation frame', () => {
    let rafcallback!: FrameRequestCallback;

    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((cb) => {
        rafcallback = cb;
        return 1;
      }),
    );

    const fn = vi.fn();
    schedule(fn);
    expect(fn).not.toHaveBeenCalled();
    rafcallback(0);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('schedules only one animation frame', () => {
    let rafCallback!: FrameRequestCallback;

    const raf = vi.fn((cb: FrameRequestCallback) => {
      rafCallback = cb;
      return 1;
    });

    vi.stubGlobal('requestAnimationFrame', raf);

    const fn1 = vi.fn();
    const fn2 = vi.fn();
    schedule(fn1);
    schedule(fn2);
    expect(raf).toHaveBeenCalledTimes(1);
    rafCallback(0);
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);
  });

  it('deduplicates callbacks', () => {
    let rafCallback!: FrameRequestCallback;

    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((cb) => {
        rafCallback = cb;
        return 1;
      }),
    );

    const fn = vi.fn();
    schedule(fn);
    schedule(fn);
    schedule(fn);
    rafCallback(0);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
