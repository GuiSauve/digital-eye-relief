import { vi, beforeEach } from 'vitest';

// Mock Chrome APIs for testing
const mockStorage: Record<string, any> = {};
const mockAlarms: Map<string, { name: string; scheduledTime: number }> = new Map();
const mockAlarmListeners: Array<(alarm: { name: string }) => void> = [];
const mockStorageChangeListeners: Array<(changes: Record<string, { newValue?: any; oldValue?: any }>, area: string) => void> = [];

// Mock chrome.storage.sync
const mockChromeStorage = {
  sync: {
    get: vi.fn((keys: string[], callback: (result: Record<string, any>) => void) => {
      const result: Record<string, any> = {};
      keys.forEach(key => {
        if (mockStorage[key] !== undefined) {
          result[key] = mockStorage[key];
        }
      });
      callback(result);
    }),
    set: vi.fn((items: Record<string, any>, callback?: () => void) => {
      Object.assign(mockStorage, items);
      if (callback) callback();
    }),
    clear: vi.fn((callback?: () => void) => {
      Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
      if (callback) callback();
    })
  }
};

// Mock chrome.alarms
const mockChromeAlarms = {
  create: vi.fn((name: string, alarmInfo: { delayInMinutes?: number; periodInMinutes?: number }) => {
    const scheduledTime = Date.now() + (alarmInfo.delayInMinutes || 0) * 60000;
    mockAlarms.set(name, { name, scheduledTime });
  }),
  clear: vi.fn((name: string, callback?: (wasCleared: boolean) => void) => {
    const wasCleared = mockAlarms.delete(name);
    if (callback) callback(wasCleared);
  }),
  clearAll: vi.fn((callback?: (wasCleared: boolean) => void) => {
    mockAlarms.clear();
    if (callback) callback(true);
  }),
  get: vi.fn((name: string, callback: (alarm: { name: string; scheduledTime: number } | undefined) => void) => {
    callback(mockAlarms.get(name));
  }),
  getAll: vi.fn((callback: (alarms: Array<{ name: string; scheduledTime: number }>) => void) => {
    callback(Array.from(mockAlarms.values()));
  }),
  onAlarm: {
    addListener: vi.fn((callback: (alarm: { name: string }) => void) => {
      mockAlarmListeners.push(callback);
    }),
    removeListener: vi.fn((callback: (alarm: { name: string }) => void) => {
      const index = mockAlarmListeners.indexOf(callback);
      if (index > -1) mockAlarmListeners.splice(index, 1);
    })
  }
};

// Mock chrome.action (badge)
const mockChromeAction = {
  setBadgeText: vi.fn(),
  setBadgeBackgroundColor: vi.fn()
};

// Mock chrome.notifications
const mockChromeNotifications = {
  create: vi.fn()
};

// Mock chrome.runtime
const mockChromeRuntime = {
  onMessage: {
    addListener: vi.fn(),
    removeListener: vi.fn()
  },
  sendMessage: vi.fn(),
  getContexts: vi.fn(() => Promise.resolve([])),
  getURL: vi.fn((path: string) => `chrome-extension://mock-id/${path}`)
};

// Mock chrome.offscreen
const mockChromeOffscreen = {
  createDocument: vi.fn(() => Promise.resolve())
};

// Mock chrome.storage.onChanged
const mockChromeStorageOnChanged = {
  addListener: vi.fn((callback: (changes: Record<string, { newValue?: any; oldValue?: any }>, area: string) => void) => {
    mockStorageChangeListeners.push(callback);
  }),
  removeListener: vi.fn((callback: (changes: Record<string, { newValue?: any; oldValue?: any }>, area: string) => void) => {
    const index = mockStorageChangeListeners.indexOf(callback);
    if (index > -1) mockStorageChangeListeners.splice(index, 1);
  })
};

// Assign mocks to global
(global as any).chrome = {
  storage: { ...mockChromeStorage, onChanged: mockChromeStorageOnChanged },
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

// Helper to trigger a storage change event
export function triggerStorageChange(
  changes: Record<string, { newValue?: any; oldValue?: any }>,
  area = 'sync'
) {
  mockStorageChangeListeners.forEach(listener => listener(changes, area));
}

// Helper to clear all mocks before each test
beforeEach(() => {
  clearMockStorage();
  mockAlarms.clear();
  mockStorageChangeListeners.length = 0;
  vi.clearAllMocks();
});
