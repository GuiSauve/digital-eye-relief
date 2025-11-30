import { useState, useEffect, useCallback } from "react";

export type TimerStatus = "idle" | "focus" | "break";

export function useChromeExtensionTimer() {
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [settings, setSettings] = useState({
    focusDuration: 20,
    breakDuration: 20,
  });

  // Load initial state from Chrome storage
  useEffect(() => {
    chrome.storage.sync.get(["settings", "timerStatus", "timerStartTime", "timerDuration"], (result) => {
      if (result.settings) {
        setSettings(result.settings);
      }
      if (result.timerStatus) {
        setStatus(result.timerStatus);
        
        // Calculate remaining time
        if (result.timerStartTime && result.timerDuration) {
          const elapsed = Date.now() - result.timerStartTime;
          const remaining = Math.max(0, Math.floor((result.timerDuration - elapsed) / 1000));
          setTimeLeft(remaining);
        }
      } else {
        setTimeLeft(result.settings?.focusDuration * 60 || 20 * 60);
      }
    });

    // Listen for storage changes
    const handleStorageChange = (changes: any) => {
      if (changes.timerStatus) {
        setStatus(changes.timerStatus.newValue);
      }
      if (changes.settings) {
        setSettings(changes.settings.newValue);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  // Update countdown every second
  useEffect(() => {
    if (status === "idle") return;

    const interval = setInterval(() => {
      chrome.storage.sync.get(["timerStartTime", "timerDuration"], (result) => {
        if (result.timerStartTime && result.timerDuration) {
          const elapsed = Date.now() - result.timerStartTime;
          const remaining = Math.max(0, Math.floor((result.timerDuration - elapsed) / 1000));
          setTimeLeft(remaining);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  const startFocus = useCallback(() => {
    chrome.runtime.sendMessage({ action: "startTimer" });
  }, []);

  const pauseTimer = useCallback(() => {
    chrome.runtime.sendMessage({ action: "pauseTimer" });
  }, []);

  const resetTimer = useCallback(() => {
    chrome.runtime.sendMessage({ action: "resetTimer" });
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progress = status === "focus" 
    ? ((settings.focusDuration * 60 - timeLeft) / (settings.focusDuration * 60)) * 100
    : ((settings.breakDuration - timeLeft) / settings.breakDuration) * 100;

  return {
    status,
    timeLeft,
    progress,
    formatTime,
    startFocus,
    pauseTimer,
    resetTimer,
    settings,
  };
}
