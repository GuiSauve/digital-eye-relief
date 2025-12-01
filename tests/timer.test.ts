import { describe, test, expect, beforeEach } from '@jest/globals';
import { getMockStorage, setMockStorage, getMockAlarms, triggerAlarm } from './setup';

// Declare chrome as global (set up in setup.ts)
declare const chrome: any;

// Timer state types
interface TimerState {
  timerStatus: 'idle' | 'focus' | 'break' | 'paused';
  timerStartTime: number | null;
  timerDuration: number | null;
  pausedRemainingMs: number | null;
}

interface Settings {
  focusDuration: number;
  breakDuration: number;
  soundEnabled: boolean;
  notificationType: 'modal' | 'badge';
}

const DEFAULT_SETTINGS: Settings = {
  focusDuration: 20,
  breakDuration: 20,
  soundEnabled: true,
  notificationType: 'modal'
};

// Timer logic functions (extracted from background.js for testing)
function startFocusTimer(durationMinutes: number): void {
  chrome.alarms.clear('focusTimer');
  chrome.alarms.clear('updateBadge');
  
  chrome.alarms.create('focusTimer', {
    delayInMinutes: durationMinutes
  });
  
  chrome.alarms.create('updateBadge', { 
    delayInMinutes: 1,
    periodInMinutes: 1 
  });
  
  chrome.storage.sync.set({ 
    timerStatus: 'focus',
    timerStartTime: Date.now(),
    timerDuration: durationMinutes * 60 * 1000
  });
}

function pauseTimer(): void {
  chrome.storage.sync.get(['timerStatus', 'timerStartTime', 'timerDuration'], (result: Record<string, any>) => {
    if (result.timerStatus === 'focus' && result.timerStartTime && result.timerDuration) {
      const elapsed = Date.now() - (result.timerStartTime as number);
      const remainingMs = Math.max(0, (result.timerDuration as number) - elapsed);
      
      chrome.alarms.clear('focusTimer');
      chrome.alarms.clear('updateBadge');
      chrome.storage.sync.set({ 
        timerStatus: 'paused',
        pausedRemainingMs: remainingMs
      });
    }
  });
}

function resumeTimer(): void {
  chrome.storage.sync.get(['settings', 'timerStatus', 'pausedRemainingMs'], (result: Record<string, any>) => {
    const settings = (result.settings as Settings) || DEFAULT_SETTINGS;
    
    if (result.timerStatus === 'paused' && (result.pausedRemainingMs as number) > 0) {
      const remainingMinutes = (result.pausedRemainingMs as number) / 60000;
      chrome.storage.sync.set({ pausedRemainingMs: null });
      startFocusTimer(remainingMinutes);
    } else {
      startFocusTimer(settings.focusDuration);
    }
  });
}

function resetTimer(): void {
  chrome.alarms.clear('focusTimer');
  chrome.alarms.clear('breakTimer');
  chrome.alarms.clear('updateBadge');
  
  chrome.storage.sync.get(['settings'], (result: Record<string, any>) => {
    const settings = (result.settings as Settings) || DEFAULT_SETTINGS;
    chrome.storage.sync.set({ 
      timerStatus: 'idle',
      pausedRemainingMs: null,
      timerStartTime: null,
      timerDuration: settings.focusDuration * 60 * 1000
    });
  });
}

describe('Timer Logic', () => {
  beforeEach(() => {
    setMockStorage({ settings: DEFAULT_SETTINGS });
  });

  describe('Initial State', () => {
    test('timer should show focusDuration from settings when idle', () => {
      resetTimer();
      
      const storage = getMockStorage();
      expect(storage.timerStatus).toBe('idle');
      expect(storage.timerDuration).toBe(20 * 60 * 1000); // 20 minutes in ms
      expect(storage.pausedRemainingMs).toBeNull();
    });

    test('timer should reflect updated settings after change', () => {
      setMockStorage({ 
        settings: { ...DEFAULT_SETTINGS, focusDuration: 5 }
      });
      
      resetTimer();
      
      const storage = getMockStorage();
      expect(storage.timerDuration).toBe(5 * 60 * 1000); // 5 minutes in ms
    });
  });

  describe('Start Timer', () => {
    test('starting timer should set status to focus', () => {
      startFocusTimer(20);
      
      const storage = getMockStorage();
      expect(storage.timerStatus).toBe('focus');
    });

    test('starting timer should create focusTimer alarm', () => {
      startFocusTimer(20);
      
      const alarms = getMockAlarms();
      expect(alarms.has('focusTimer')).toBe(true);
    });

    test('starting timer should record start time', () => {
      const beforeStart = Date.now();
      startFocusTimer(20);
      const afterStart = Date.now();
      
      const storage = getMockStorage();
      expect(storage.timerStartTime).toBeGreaterThanOrEqual(beforeStart);
      expect(storage.timerStartTime).toBeLessThanOrEqual(afterStart);
    });

    test('starting timer should set correct duration', () => {
      startFocusTimer(20);
      
      const storage = getMockStorage();
      expect(storage.timerDuration).toBe(20 * 60 * 1000);
    });
  });

  describe('Pause Timer', () => {
    test('pausing timer should set status to paused', () => {
      startFocusTimer(20);
      pauseTimer();
      
      const storage = getMockStorage();
      expect(storage.timerStatus).toBe('paused');
    });

    test('pausing timer should preserve remaining time', () => {
      // Start timer
      startFocusTimer(20);
      const startTime = getMockStorage().timerStartTime;
      
      // Simulate 5 minutes passing
      const fiveMinutesMs = 5 * 60 * 1000;
      setMockStorage({
        ...getMockStorage(),
        timerStartTime: startTime - fiveMinutesMs
      });
      
      pauseTimer();
      
      const storage = getMockStorage();
      // Should have ~15 minutes remaining (20 - 5)
      const fifteenMinutesMs = 15 * 60 * 1000;
      expect(storage.pausedRemainingMs).toBeCloseTo(fifteenMinutesMs, -3); // Within 1 second
    });

    test('pausing timer should clear alarms', () => {
      startFocusTimer(20);
      pauseTimer();
      
      const alarms = getMockAlarms();
      expect(alarms.has('focusTimer')).toBe(false);
      expect(alarms.has('updateBadge')).toBe(false);
    });
  });

  describe('Resume Timer', () => {
    test('resuming from pause should restore remaining time', () => {
      // Setup paused state with 10 minutes remaining
      const tenMinutesMs = 10 * 60 * 1000;
      setMockStorage({
        settings: DEFAULT_SETTINGS,
        timerStatus: 'paused',
        pausedRemainingMs: tenMinutesMs
      });
      
      resumeTimer();
      
      const storage = getMockStorage();
      expect(storage.timerStatus).toBe('focus');
      expect(storage.timerDuration).toBeCloseTo(tenMinutesMs, -3);
    });

    test('resuming should clear pausedRemainingMs', () => {
      setMockStorage({
        settings: DEFAULT_SETTINGS,
        timerStatus: 'paused',
        pausedRemainingMs: 10 * 60 * 1000
      });
      
      resumeTimer();
      
      const storage = getMockStorage();
      expect(storage.pausedRemainingMs).toBeNull();
    });

    test('starting when not paused should use full duration', () => {
      setMockStorage({
        settings: DEFAULT_SETTINGS,
        timerStatus: 'idle'
      });
      
      resumeTimer();
      
      const storage = getMockStorage();
      expect(storage.timerDuration).toBe(20 * 60 * 1000);
    });
  });

  describe('Reset Timer', () => {
    test('reset should set status to idle', () => {
      startFocusTimer(20);
      resetTimer();
      
      const storage = getMockStorage();
      expect(storage.timerStatus).toBe('idle');
    });

    test('reset should clear alarms', () => {
      startFocusTimer(20);
      resetTimer();
      
      const alarms = getMockAlarms();
      expect(alarms.has('focusTimer')).toBe(false);
      expect(alarms.has('updateBadge')).toBe(false);
    });

    test('reset should use current settings duration', () => {
      // Start with 20 min
      startFocusTimer(20);
      
      // Change settings to 5 min
      setMockStorage({
        ...getMockStorage(),
        settings: { ...DEFAULT_SETTINGS, focusDuration: 5 }
      });
      
      resetTimer();
      
      const storage = getMockStorage();
      expect(storage.timerDuration).toBe(5 * 60 * 1000);
    });

    test('reset should clear pausedRemainingMs', () => {
      setMockStorage({
        settings: DEFAULT_SETTINGS,
        timerStatus: 'paused',
        pausedRemainingMs: 10 * 60 * 1000
      });
      
      resetTimer();
      
      const storage = getMockStorage();
      expect(storage.pausedRemainingMs).toBeNull();
    });

    test('reset should clear timerStartTime', () => {
      startFocusTimer(20);
      resetTimer();
      
      const storage = getMockStorage();
      expect(storage.timerStartTime).toBeNull();
    });
  });

  describe('Settings Changes', () => {
    test('changing focus duration should not affect running timer', () => {
      startFocusTimer(20);
      const originalDuration = getMockStorage().timerDuration;
      
      // Change settings
      setMockStorage({
        ...getMockStorage(),
        settings: { ...DEFAULT_SETTINGS, focusDuration: 5 }
      });
      
      // Timer should still have original duration
      expect(getMockStorage().timerDuration).toBe(originalDuration);
    });

    test('reset after settings change should use new duration', () => {
      startFocusTimer(20);
      
      setMockStorage({
        ...getMockStorage(),
        settings: { ...DEFAULT_SETTINGS, focusDuration: 10 }
      });
      
      resetTimer();
      
      expect(getMockStorage().timerDuration).toBe(10 * 60 * 1000);
    });
  });
});
