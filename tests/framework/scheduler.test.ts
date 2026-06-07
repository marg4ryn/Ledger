import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { schedule } from '../../src/framework/scheduler';

describe('schedule', () => {
  let rafCallback!: FrameRequestCallback;
  let raf!: Mock;

  beforeEach(() => {
    raf = vi.fn((cb: FrameRequestCallback) => {
      rafCallback = cb;
      return 1;
    });
    vi.stubGlobal('requestAnimationFrame', raf);
  });

  it('executes callback on animation frame', () => {
    const fn = vi.fn();

    schedule(fn);

    expect(fn).not.toHaveBeenCalled();

    rafCallback(0);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('schedules only one animation frame', () => {
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
    const fn = vi.fn();

    schedule(fn);
    schedule(fn);
    schedule(fn);
    rafCallback(0);

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
