// Background Service Worker for Digital Eye Relief Chrome Extension
// Handles timer logic using Chrome Alarms API

const DEFAULT_SETTINGS = {
  focusDuration: 20, // minutes
  breakDuration: 20, // seconds
  soundEnabled: true,
  notificationType: 'modal', // 'modal' or 'badge'
  isActive: false
};

// Track if offscreen document exists
let creatingOffscreen = false;

// Create offscreen document for audio playback
async function setupOffscreenDocument() {
  const offscreenUrl = 'offscreen.html';
  
  // Check if offscreen document already exists
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [chrome.runtime.getURL(offscreenUrl)]
  });
  
  if (existingContexts.length > 0) {
    return; // Already exists
  }
  
  // Prevent race condition
  if (creatingOffscreen) {
    return;
  }
  
  creatingOffscreen = true;
  
  try {
    await chrome.offscreen.createDocument({
      url: offscreenUrl,
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'Play notification sound for break reminders'
    });
  } catch (error) {
    console.error('Error creating offscreen document:', error);
  } finally {
    creatingOffscreen = false;
  }
}

// Play notification sound
async function playNotificationSound() {
  await setupOffscreenDocument();
  
  try {
    await chrome.runtime.sendMessage({
      action: 'playSound',
      sound: 'sounds/singing-bowl.mp3'
    });
  } catch (error) {
    console.error('Error playing sound:', error);
  }
}

// Initialize extension on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('Digital Eye Relief installed');
  chrome.storage.sync.get(['settings'], (result) => {
    if (!result.settings) {
      chrome.storage.sync.set({ settings: DEFAULT_SETTINGS });
    } else {
      // Migrate legacy 'system' notificationType to 'modal'
      if (result.settings.notificationType === 'system') {
        chrome.storage.sync.set({ 
          settings: { ...result.settings, notificationType: 'modal' }
        });
      }
    }
  });
});

// Handle all alarm events in one listener
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'focusTimer') {
    handleFocusComplete();
  } else if (alarm.name === 'breakTimer') {
    handleBreakComplete();
  } else if (alarm.name === 'updateBadge') {
    // Update the badge with remaining time
    chrome.storage.sync.get(['timerStatus', 'timerStartTime', 'timerDuration'], (result) => {
      if (result.timerStatus === 'focus' && result.timerStartTime && result.timerDuration) {
        const elapsed = Date.now() - result.timerStartTime;
        const remaining = Math.ceil((result.timerDuration - elapsed) / 60000);
        if (remaining > 0) {
          updateBadge('focus', remaining);
        }
      }
    });
  }
});

// Start the focus timer
function startFocusTimer(durationMinutes) {
  // Clear any existing alarms first
  chrome.alarms.clear('focusTimer');
  chrome.alarms.clear('updateBadge');
  
  chrome.alarms.create('focusTimer', {
    delayInMinutes: durationMinutes
  });
  
  // Create badge update alarm that fires every minute
  chrome.alarms.create('updateBadge', { 
    delayInMinutes: 1,
    periodInMinutes: 1 
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
    
    // Always show a system notification when focus time ends (popup might be closed)
    // The notificationType setting controls the popup UI, not the background notification
    chrome.notifications.create('breakReminder', {
      type: 'basic',
      iconUrl: 'icons/icon-128.png',
      title: 'Time for an Eye Break! 👀',
      message: 'Look at something 20 feet (6 meters) away for 20 seconds.',
      priority: 2,
      requireInteraction: true
    });
    
    // Play sound if enabled
    if (settings.soundEnabled) {
      playNotificationSound();
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

// Pause timers and save remaining time
function pauseTimers() {
  chrome.storage.sync.get(['timerStatus', 'timerStartTime', 'timerDuration'], (result) => {
    if (result.timerStatus === 'focus' && result.timerStartTime && result.timerDuration) {
      // Calculate remaining time and save it
      const elapsed = Date.now() - result.timerStartTime;
      const remainingMs = Math.max(0, result.timerDuration - elapsed);
      
      chrome.alarms.clear('focusTimer');
      chrome.alarms.clear('updateBadge');
      chrome.storage.sync.set({ 
        timerStatus: 'paused',
        pausedRemainingMs: remainingMs
      });
      updateBadge('idle');
    } else {
      // If not in focus mode, just stop everything
      stopTimers();
    }
  });
}

// Stop all timers and clear paused state (full reset)
function stopTimers() {
  chrome.alarms.clear('focusTimer');
  chrome.alarms.clear('breakTimer');
  chrome.alarms.clear('updateBadge');
  chrome.storage.sync.set({ 
    timerStatus: 'idle',
    pausedRemainingMs: null 
  });
  updateBadge('idle');
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startTimer') {
    // Check if we're resuming from a paused state
    chrome.storage.sync.get(['settings', 'timerStatus', 'pausedRemainingMs'], (result) => {
      const settings = result.settings || DEFAULT_SETTINGS;
      
      if (result.timerStatus === 'paused' && result.pausedRemainingMs > 0) {
        // Resume from paused time
        const remainingMinutes = result.pausedRemainingMs / 60000;
        chrome.storage.sync.set({ pausedRemainingMs: null }); // Clear paused state
        startFocusTimer(remainingMinutes);
      } else {
        // Start fresh with full duration
        startFocusTimer(settings.focusDuration);
      }
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.action === 'pauseTimer') {
    pauseTimers();
    sendResponse({ success: true });
    return true;
  }
  
  if (request.action === 'resetTimer') {
    // Stop all timers and reset to current settings
    chrome.alarms.clear('focusTimer');
    chrome.alarms.clear('breakTimer');
    chrome.alarms.clear('updateBadge');
    
    // Fetch current settings and reset timerDuration to reflect them
    chrome.storage.sync.get(['settings'], (result) => {
      const settings = result.settings || DEFAULT_SETTINGS;
      chrome.storage.sync.set({ 
        timerStatus: 'idle',
        pausedRemainingMs: null,
        timerStartTime: null,
        timerDuration: settings.focusDuration * 60 * 1000
      });
      updateBadge('idle');
      sendResponse({ success: true });
    });
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
    chrome.storage.sync.get(['timerStatus', 'timerStartTime', 'timerDuration', 'pausedRemainingMs'], (result) => {
      sendResponse(result);
    });
    return true;
  }
});
