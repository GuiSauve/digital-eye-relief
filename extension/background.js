// Background Service Worker for Digital Eye Relief Chrome Extension
// Handles timer logic using Chrome Alarms API

const DEFAULT_SETTINGS = {
  focusDuration: 20, // minutes
  breakDuration: 20, // seconds
  soundEnabled: true,
  notificationType: 'system', // 'modal', 'system', or 'badge'
  isActive: false
};

// Initialize extension on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('Digital Eye Relief installed');
  chrome.storage.sync.get(['settings'], (result) => {
    if (!result.settings) {
      chrome.storage.sync.set({ settings: DEFAULT_SETTINGS });
    }
  });
});

// Handle alarm events
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'focusTimer') {
    handleFocusComplete();
  } else if (alarm.name === 'breakTimer') {
    handleBreakComplete();
  }
});

// Start the focus timer
function startFocusTimer(durationMinutes) {
  chrome.alarms.create('focusTimer', {
    delayInMinutes: durationMinutes
  });
  
  chrome.storage.sync.set({ 
    timerStatus: 'focus',
    timerStartTime: Date.now(),
    timerDuration: durationMinutes * 60 * 1000
  });
  
  updateBadge('focus', durationMinutes);
}

// Start the break timer
function startBreakTimer(durationSeconds) {
  chrome.alarms.create('breakTimer', {
    delayInMinutes: durationSeconds / 60
  });
  
  chrome.storage.sync.set({ 
    timerStatus: 'break',
    timerStartTime: Date.now(),
    timerDuration: durationSeconds * 1000
  });
  
  updateBadge('break', Math.ceil(durationSeconds / 60));
}

// Handle when focus period completes
function handleFocusComplete() {
  chrome.storage.sync.get(['settings'], (result) => {
    const settings = result.settings || DEFAULT_SETTINGS;
    
    // Show notification
    if (settings.notificationType === 'system') {
      chrome.notifications.create('breakReminder', {
        type: 'basic',
        iconUrl: 'icons/icon-128.png',
        title: 'Time for an Eye Break! 👀',
        message: 'Look at something 20 feet (6 meters) away for 20 seconds.',
        priority: 2,
        requireInteraction: true
      });
    }
    
    // Play sound if enabled
    if (settings.soundEnabled) {
      // Note: Sound playing in service workers requires additional setup
      // Can be implemented with offscreen documents in Manifest V3
    }
    
    // Start break timer
    startBreakTimer(settings.breakDuration);
  });
}

// Handle when break period completes
function handleBreakComplete() {
  chrome.storage.sync.get(['settings'], (result) => {
    const settings = result.settings || DEFAULT_SETTINGS;
    
    chrome.notifications.create('breakComplete', {
      type: 'basic',
      iconUrl: 'icons/icon-128.png',
      title: 'Break Complete! ✨',
      message: 'Back to work. Your next break is in ' + settings.focusDuration + ' minutes.',
      priority: 1
    });
    
    // Restart focus timer if still active
    chrome.storage.sync.get(['timerStatus'], (statusResult) => {
      if (statusResult.timerStatus === 'break') {
        startFocusTimer(settings.focusDuration);
      }
    });
  });
}

// Update extension badge
function updateBadge(status, value) {
  if (status === 'focus') {
    chrome.action.setBadgeText({ text: String(value) });
    chrome.action.setBadgeBackgroundColor({ color: '#6B9F7B' }); // Sage green
  } else if (status === 'break') {
    chrome.action.setBadgeText({ text: '!' });
    chrome.action.setBadgeBackgroundColor({ color: '#60A5FA' }); // Blue
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

// Stop all timers
function stopTimers() {
  chrome.alarms.clear('focusTimer');
  chrome.alarms.clear('breakTimer');
  chrome.storage.sync.set({ timerStatus: 'idle' });
  updateBadge('idle');
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startTimer') {
    chrome.storage.sync.get(['settings'], (result) => {
      const settings = result.settings || DEFAULT_SETTINGS;
      startFocusTimer(settings.focusDuration);
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.action === 'pauseTimer') {
    stopTimers();
    sendResponse({ success: true });
    return true;
  }
  
  if (request.action === 'resetTimer') {
    stopTimers();
    sendResponse({ success: true });
    return true;
  }
  
  if (request.action === 'skipBreak') {
    chrome.alarms.clear('breakTimer');
    chrome.storage.sync.get(['settings'], (result) => {
      const settings = result.settings || DEFAULT_SETTINGS;
      startFocusTimer(settings.focusDuration);
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.action === 'getTimerState') {
    chrome.storage.sync.get(['timerStatus', 'timerStartTime', 'timerDuration'], (result) => {
      sendResponse(result);
    });
    return true;
  }
});

// Update badge every minute while timer is running
chrome.alarms.create('updateBadge', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'updateBadge') {
    chrome.storage.sync.get(['timerStatus', 'timerStartTime', 'timerDuration'], (result) => {
      if (result.timerStatus === 'focus') {
        const elapsed = Date.now() - result.timerStartTime;
        const remaining = Math.ceil((result.timerDuration - elapsed) / 60000);
        if (remaining > 0) {
          updateBadge('focus', remaining);
        }
      }
    });
  }
});
