import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useExtensionTimer } from "../use-extension-timer";

vi.stubGlobal("Audio", class {
  volume = 1;
  play() { return Promise.resolve(); }
});

describe("useExtensionTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Initial State", () => {
    it("starts in idle status with correct default time", () => {
      const { result } = renderHook(() => useExtensionTimer());
      expect(result.current.status).toBe("idle");
      expect(result.current.timeLeft).toBe(20 * 60);
      expect(result.current.progress).toBe(0);
    });

    it("accepts custom focus duration", () => {
      const { result } = renderHook(() =>
        useExtensionTimer({ focusDurationMinutes: 5 })
      );
      expect(result.current.timeLeft).toBe(5 * 60);
    });

    it("formats time correctly", () => {
      const { result } = renderHook(() => useExtensionTimer());
      expect(result.current.formatTime(125)).toBe("2:05");
      expect(result.current.formatTime(60)).toBe("1:00");
      expect(result.current.formatTime(0)).toBe("0:00");
      expect(result.current.formatTime(3600)).toBe("60:00");
    });
  });

  describe("Start / Focus", () => {
    it("transitions to focus on startFocus", () => {
      const { result } = renderHook(() => useExtensionTimer());
      act(() => { result.current.startFocus(); });
      expect(result.current.status).toBe("focus");
    });

    it("counts down every second during focus", () => {
      const { result } = renderHook(() =>
        useExtensionTimer({ focusDurationMinutes: 1 })
      );
      act(() => { result.current.startFocus(); });
      const initial = result.current.timeLeft;

      act(() => { vi.advanceTimersByTime(3000); });
      expect(result.current.timeLeft).toBe(initial - 3);
    });

    it("calculates progress during focus", () => {
      const { result } = renderHook(() =>
        useExtensionTimer({ focusDurationMinutes: 1 })
      );
      act(() => { result.current.startFocus(); });
      act(() => { vi.advanceTimersByTime(30000); });
      expect(result.current.progress).toBeCloseTo(50, 0);
    });
  });

  describe("Focus → Break transition", () => {
    it("transitions to break when focus timer reaches 0", () => {
      const { result } = renderHook(() =>
        useExtensionTimer({ focusDurationMinutes: 1, breakDurationSeconds: 10 })
      );
      act(() => { result.current.startFocus(); });
      act(() => { vi.advanceTimersByTime(60 * 1000); });
      expect(result.current.status).toBe("break");
      expect(result.current.timeLeft).toBe(10);
    });
  });

  describe("Break → Focus transition", () => {
    it("transitions back to focus after break ends", () => {
      const { result } = renderHook(() =>
        useExtensionTimer({ focusDurationMinutes: 1, breakDurationSeconds: 5 })
      );
      act(() => { result.current.startFocus(); });
      act(() => { vi.advanceTimersByTime(60 * 1000); });
      expect(result.current.status).toBe("break");

      act(() => { vi.advanceTimersByTime(5 * 1000); });
      expect(result.current.status).toBe("focus");
      expect(result.current.timeLeft).toBe(60);
    });
  });

  describe("Pause from Focus", () => {
    it("pauses and records focus state", () => {
      const { result } = renderHook(() =>
        useExtensionTimer({ focusDurationMinutes: 1 })
      );
      act(() => { result.current.startFocus(); });
      act(() => { vi.advanceTimersByTime(10000); });
      const timeBeforePause = result.current.timeLeft;

      act(() => { result.current.pauseTimer(); });
      expect(result.current.status).toBe("paused");
      expect(result.current.pausedFrom).toBe("focus");

      act(() => { vi.advanceTimersByTime(5000); });
      expect(result.current.timeLeft).toBe(timeBeforePause);
    });

    it("resumes to focus state with correct time", () => {
      const { result } = renderHook(() =>
        useExtensionTimer({ focusDurationMinutes: 1 })
      );
      act(() => { result.current.startFocus(); });
      act(() => { vi.advanceTimersByTime(10000); });
      const timeBeforePause = result.current.timeLeft;

      act(() => { result.current.pauseTimer(); });
      act(() => { result.current.startFocus(); });

      expect(result.current.status).toBe("focus");
      expect(result.current.timeLeft).toBe(timeBeforePause);
    });
  });

  describe("Pause from Break", () => {
    it("pauses during break and records break state", () => {
      const { result } = renderHook(() =>
        useExtensionTimer({ focusDurationMinutes: 1, breakDurationSeconds: 20 })
      );
      act(() => { result.current.startFocus(); });
      act(() => { vi.advanceTimersByTime(60 * 1000); });
      expect(result.current.status).toBe("break");

      act(() => { vi.advanceTimersByTime(5000); });
      const timeBeforePause = result.current.timeLeft;

      act(() => { result.current.pauseTimer(); });
      expect(result.current.status).toBe("paused");
      expect(result.current.pausedFrom).toBe("break");
      expect(result.current.timeLeft).toBe(timeBeforePause);
    });

    it("resumes to break state (not focus) after pause during break", () => {
      const { result } = renderHook(() =>
        useExtensionTimer({ focusDurationMinutes: 1, breakDurationSeconds: 20 })
      );
      act(() => { result.current.startFocus(); });
      act(() => { vi.advanceTimersByTime(60 * 1000); });
      act(() => { vi.advanceTimersByTime(5000); });

      act(() => { result.current.pauseTimer(); });
      act(() => { result.current.startFocus(); });

      expect(result.current.status).toBe("break");
    });
  });

  describe("Skip Break", () => {
    it("skips break and starts new focus session", () => {
      const { result } = renderHook(() =>
        useExtensionTimer({ focusDurationMinutes: 1, breakDurationSeconds: 20 })
      );
      act(() => { result.current.startFocus(); });
      act(() => { vi.advanceTimersByTime(60 * 1000); });
      expect(result.current.status).toBe("break");

      act(() => { result.current.skipBreak(); });
      expect(result.current.status).toBe("focus");
      expect(result.current.timeLeft).toBe(60);
    });
  });

  describe("Reset", () => {
    it("resets from focus to idle", () => {
      const { result } = renderHook(() =>
        useExtensionTimer({ focusDurationMinutes: 1 })
      );
      act(() => { result.current.startFocus(); });
      act(() => { vi.advanceTimersByTime(10000); });

      act(() => { result.current.resetTimer(); });
      expect(result.current.status).toBe("idle");
      expect(result.current.timeLeft).toBe(60);
      expect(result.current.progress).toBe(0);
    });

    it("resets from paused to idle", () => {
      const { result } = renderHook(() =>
        useExtensionTimer({ focusDurationMinutes: 1 })
      );
      act(() => { result.current.startFocus(); });
      act(() => { result.current.pauseTimer(); });
      act(() => { result.current.resetTimer(); });
      expect(result.current.status).toBe("idle");
    });

    it("resets from break to idle", () => {
      const { result } = renderHook(() =>
        useExtensionTimer({ focusDurationMinutes: 1, breakDurationSeconds: 20 })
      );
      act(() => { result.current.startFocus(); });
      act(() => { vi.advanceTimersByTime(60 * 1000); });
      expect(result.current.status).toBe("break");

      act(() => { result.current.resetTimer(); });
      expect(result.current.status).toBe("idle");
      expect(result.current.timeLeft).toBe(60);
    });
  });

  describe("Progress Calculations", () => {
    it("returns 0 for idle", () => {
      const { result } = renderHook(() => useExtensionTimer());
      expect(result.current.progress).toBe(0);
    });

    it("calculates focus progress correctly", () => {
      const { result } = renderHook(() =>
        useExtensionTimer({ focusDurationMinutes: 1 })
      );
      act(() => { result.current.startFocus(); });
      act(() => { vi.advanceTimersByTime(15000); });
      expect(result.current.progress).toBeCloseTo(25, 0);
    });

    it("calculates break progress correctly", () => {
      const { result } = renderHook(() =>
        useExtensionTimer({ focusDurationMinutes: 1, breakDurationSeconds: 20 })
      );
      act(() => { result.current.startFocus(); });
      act(() => { vi.advanceTimersByTime(60 * 1000); });
      act(() => { vi.advanceTimersByTime(10000); });
      expect(result.current.progress).toBeCloseTo(50, 0);
    });
  });

  describe("Settings Changes", () => {
    it("updates timeLeft when focus duration changes while idle", () => {
      const { result } = renderHook(() => useExtensionTimer());
      expect(result.current.timeLeft).toBe(20 * 60);

      act(() => {
        result.current.setSettings(prev => ({ ...prev, focusDuration: 10 }));
      });
      expect(result.current.timeLeft).toBe(10 * 60);
    });

    it("does not update timeLeft when focus duration changes during focus", () => {
      const { result } = renderHook(() => useExtensionTimer());
      act(() => { result.current.startFocus(); });
      act(() => { vi.advanceTimersByTime(5000); });
      const timeDuringFocus = result.current.timeLeft;

      act(() => {
        result.current.setSettings(prev => ({ ...prev, focusDuration: 10 }));
      });
      expect(result.current.timeLeft).toBeLessThanOrEqual(timeDuringFocus);
    });
  });

  describe("Meeting Mode", () => {
    it("starts with meeting mode off", () => {
      const { result } = renderHook(() => useExtensionTimer());
      expect(result.current.meetingMode).toBe(false);
    });

    it("toggles meeting mode on and off", () => {
      const { result } = renderHook(() => useExtensionTimer());
      act(() => { result.current.toggleMeetingMode(); });
      expect(result.current.meetingMode).toBe(true);

      act(() => { result.current.toggleMeetingMode(); });
      expect(result.current.meetingMode).toBe(false);
    });

    it("meeting mode persists across timer states", () => {
      const { result } = renderHook(() => useExtensionTimer());
      act(() => { result.current.toggleMeetingMode(); });
      act(() => { result.current.startFocus(); });
      expect(result.current.meetingMode).toBe(true);

      act(() => { result.current.pauseTimer(); });
      expect(result.current.meetingMode).toBe(true);

      act(() => { result.current.resetTimer(); });
      expect(result.current.meetingMode).toBe(true);
    });
  });

  describe("Stats Tracking", () => {
    it("starts with zero breaks today", () => {
      const { result } = renderHook(() => useExtensionTimer());
      expect(result.current.stats.todayBreaks).toBe(0);
      expect(result.current.stats.totalBreaks).toBe(0);
    });

    it("increments break count after a complete break", () => {
      const { result } = renderHook(() =>
        useExtensionTimer({ focusDurationMinutes: 1, breakDurationSeconds: 5 })
      );
      act(() => { result.current.startFocus(); });
      act(() => { vi.advanceTimersByTime(60 * 1000); });
      expect(result.current.status).toBe("break");

      act(() => { vi.advanceTimersByTime(5 * 1000); });
      expect(result.current.status).toBe("focus");
      expect(result.current.stats.todayBreaks).toBe(1);
      expect(result.current.stats.totalBreaks).toBe(1);
    });

    it("increments break count for multiple completed breaks", () => {
      const { result } = renderHook(() =>
        useExtensionTimer({ focusDurationMinutes: 1, breakDurationSeconds: 5 })
      );
      act(() => { result.current.startFocus(); });

      act(() => { vi.advanceTimersByTime(60 * 1000); });
      act(() => { vi.advanceTimersByTime(5 * 1000); });
      expect(result.current.stats.todayBreaks).toBe(1);

      act(() => { vi.advanceTimersByTime(60 * 1000); });
      act(() => { vi.advanceTimersByTime(5 * 1000); });
      expect(result.current.stats.todayBreaks).toBe(2);
      expect(result.current.stats.totalBreaks).toBe(2);
    });

    it("does not increment stats when break is skipped", () => {
      const { result } = renderHook(() =>
        useExtensionTimer({ focusDurationMinutes: 1, breakDurationSeconds: 20 })
      );
      act(() => { result.current.startFocus(); });
      act(() => { vi.advanceTimersByTime(60 * 1000); });
      expect(result.current.status).toBe("break");

      act(() => { result.current.skipBreak(); });
      expect(result.current.stats.todayBreaks).toBe(0);
    });

    it("tracks streak with initial value of 1", () => {
      const { result } = renderHook(() => useExtensionTimer());
      expect(result.current.stats.currentStreak).toBe(1);
    });
  });
});
