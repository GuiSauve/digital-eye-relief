import { jest, beforeEach } from '@jest/globals';

// Mock Chrome APIs for testing
const mockStorage: Record<string, any> = {};
const mockAlarms: Map<string, { name: string; scheduledTime: number }> = new Map();
const mockAlarmListeners: Array<(alarm: { name: string }) => void> = [];

// Mock chrome.storage.sync
const mockChromeStorage = {
  sync: {
    get: jest.fn((keys: string[], callback: (result: Record<string, any>) => void) => {
      const result: Record<string, any> = {};
      keys.forEach(key => {
        if (mockStorage[key] !== undefined) {
          result[key] = mockStorage[key];
        }
      });
      callback(result);
    }),
    set: jest.fn((items: Record<string, any>, callback?: () => void) => {
      Object.assign(mockStorage, items);
      if (callback) callback();
    }),
    clear: jest.fn((callback?: () => void) => {
      Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
      if (callback) callback();
    })
  }
};

// Mock chrome.alarms
const mockChromeAlarms = {
  create: jest.fn((name: string, alarmInfo: { delayInMinutes?: number; periodInMinutes?: number }) => {
    const scheduledTime = Date.now() + (alarmInfo.delayInMinutes || 0) * 60000;
    mockAlarms.set(name, { name, scheduledTime });
  }),
  clear: jest.fn((name: string, callback?: (wasCleared: boolean) => void) => {
    const wasCleared = mockAlarms.delete(name);
    if (callback) callback(wasCleared);
  }),
  clearAll: jest.fn((callback?: (wasCleared: boolean) => void) => {
    mockAlarms.clear();
    if (callback) callback(true);
  }),
  get: jest.fn((name: string, callback: (alarm: { name: string; scheduledTime: number } | undefined) => void) => {
    callback(mockAlarms.get(name));
  }),
  getAll: jest.fn((callback: (alarms: Array<{ name: string; scheduledTime: number }>) => void) => {
    callback(Array.from(mockAlarms.values()));
  }),
  onAlarm: {
    addListener: jest.fn((callback: (alarm: { name: string }) => void) => {
      mockAlarmListeners.push(callback);
    }),
    removeListener: jest.fn((callback: (alarm: { name: string }) => void) => {
      const index = mockAlarmListeners.indexOf(callback);
      if (index > -1) mockAlarmListeners.splice(index, 1);
    })
  }
};

// Mock chrome.action (badge)
const mockChromeAction = {
  setBadgeText: jest.fn(),
  setBadgeBackgroundColor: jest.fn()
};

// Mock chrome.notifications
const mockChromeNotifications = {
  create: jest.fn()
};

// Mock chrome.runtime
const mockChromeRuntime = {
  onMessage: {
    addListener: jest.fn(),
    removeListener: jest.fn()
  },
  sendMessage: jest.fn(),
  getContexts: jest.fn(() => Promise.resolve([])),
  getURL: jest.fn((path: string) => `chrome-extension://mock-id/${path}`)
};

// Mock chrome.offscreen
const mockChromeOffscreen = {
  createDocument: jest.fn(() => Promise.resolve())
};

// Assign mocks to global
(global as any).chrome = {
  storage: mockChromeStorage,
  alarms: mockChromeAlarms,
  action: mockChromeAction,
  notifications: mockChromeNotifications,
  runtime: mockChromeRuntime,
  offscreen: mockChromeOffscreen
};

// Helper to trigger alarm
export function triggerAlarm(name: string) {
  mockAlarmListeners.forEach(listener => listener({ name }));
}

// Helper to get mock storage
export function getMockStorage() {
  return mockStorage;
}

// Helper to set mock storage
export function setMockStorage(data: Record<string, any>) {
  Object.assign(mockStorage, data);
}

// Helper to clear mock storage
export function clearMockStorage() {
  Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
}

// Helper to get mock alarms
export function getMockAlarms() {
  return mockAlarms;
}

// Helper to clear all mocks before each test
beforeEach(() => {
  clearMockStorage();
  mockAlarms.clear();
  jest.clearAllMocks();
});
