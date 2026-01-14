// Background Service Worker for Digital Eye Relief Chrome Extension
// Handles timer logic using Chrome Alarms API

const DEFAULT_SETTINGS = {
  focusDuration: 20, // minutes
  breakDuration: 20, // seconds
  soundEnabled: true,
  soundVolume: 70, // 0-100
  notificationType: 'badge', // 'modal' or 'badge'
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
async function playNotificationSound(soundFile = 'sounds/singing-bowl.mp3', volume = 70) {
  await setupOffscreenDocument();
  
  try {
    await chrome.runtime.sendMessage({
      action: 'playSound',
      sound: soundFile,
      volume: volume
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
      // Migrate legacy 'system' notificationType to 'badge'
      if (result.settings.notificationType === 'system') {
        chrome.storage.sync.set({ 
          settings: { ...result.settings, notificationType: 'badge' }
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

// Track break countdown interval
let breakCountdownInterval = null;

// Start the break timer
// Note: Chrome alarms have a minimum delay of ~30 seconds for delayInMinutes,
// but using 'when' with an absolute timestamp allows precise short-duration alarms
function startBreakTimer(durationSeconds) {
  // Clear any existing break-related alarms and intervals
  chrome.alarms.clear('breakTimer');
  chrome.alarms.clear('breakCheck');
  if (breakCountdownInterval) {
    clearInterval(breakCountdownInterval);
    breakCountdownInterval = null;
  }
  
  const startTime = Date.now();
  const duration = durationSeconds * 1000;
  const endTime = startTime + duration;
  
  chrome.storage.sync.set({ 
    timerStatus: 'break',
    timerStartTime: startTime,
    timerDuration: duration
  });
  
  // Use 'when' for precise timing - this allows sub-30-second alarms
  chrome.alarms.create('breakTimer', {
    when: endTime
  });
  
  // Use setInterval for smooth second-by-second badge updates during break
  // This works because service workers stay alive during active timers
  updateBadge('break', durationSeconds);
  
  breakCountdownInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, Math.ceil((duration - elapsed) / 1000));
    
    if (remaining > 0) {
      updateBadge('break', remaining);
    } else {
      // Break ended, clear interval
      clearInterval(breakCountdownInterval);
      breakCountdownInterval = null;
    }
  }, 1000);
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
      playNotificationSound('sounds/singing-bowl.mp3', settings.soundVolume ?? 70);
    }
    
    // Start break timer
    startBreakTimer(settings.breakDuration);
  });
}

// Handle when break period completes
function handleBreakComplete() {
  // Clear the countdown interval since break is done
  if (breakCountdownInterval) {
    clearInterval(breakCountdownInterval);
    breakCountdownInterval = null;
  }
  
  // Update stats - increment break count
  updateStats();
  
  chrome.storage.sync.get(['settings'], (result) => {
    const settings = result.settings || DEFAULT_SETTINGS;
    
    // Play bells sound if enabled (different from break start sound)
    if (settings.soundEnabled) {
      playNotificationSound('sounds/bells.mp3', settings.soundVolume ?? 70);
    }
    
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

// Update usage stats when a break is completed
function updateStats() {
  const today = new Date().toDateString();
  
  chrome.storage.sync.get(['stats'], (result) => {
    const stats = result.stats || {
      todayBreaks: 0,
      totalBreaks: 0,
      currentStreak: 0,
      lastActiveDate: ''
    };
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    let newStreak = stats.currentStreak;
    
    if (stats.lastActiveDate === today) {
      // Same day, just increment counts
    } else if (stats.lastActiveDate === yesterdayStr) {
      // Consecutive day - increment streak
      newStreak = stats.currentStreak + 1;
    } else if (stats.lastActiveDate !== today) {
      // Not consecutive - reset streak to 1
      newStreak = 1;
    }
    
    const newStats = {
      todayBreaks: stats.lastActiveDate === today ? stats.todayBreaks + 1 : 1,
      totalBreaks: stats.totalBreaks + 1,
      currentStreak: newStreak,
      lastActiveDate: today
    };
    
    chrome.storage.sync.set({ stats: newStats });
  });
}

// Update extension badge
function updateBadge(status, value) {
  if (status === 'focus') {
    // Round to nearest integer for minutes display
    const minutes = Math.ceil(value);
    chrome.action.setBadgeText({ text: String(minutes) });
    chrome.action.setBadgeBackgroundColor({ color: '#6B9F7B' }); // Sage green
  } else if (status === 'break') {
    // Show seconds remaining for break (e.g., "20s")
    const seconds = Math.ceil(value);
    chrome.action.setBadgeText({ text: seconds + 's' });
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
  chrome.alarms.clear('breakCheck');
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
    chrome.alarms.clear('breakCheck');
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
    chrome.alarms.clear('breakCheck');
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
