import { useState, useEffect, useCallback } from "react";

export type TimerStatus = "idle" | "focus" | "break" | "paused";

interface Settings {
  focusDuration: number;
  breakDuration: number;
  soundEnabled?: boolean;
  soundVolume?: number;
  notificationType?: string;
  meetingMode?: boolean;
  meetingModeAutoDisableMinutes?: number;
}

interface Stats {
  todayBreaks: number;
  totalBreaks: number;
  currentStreak: number;
  lastActiveDate: string;
}

interface StorageResult {
  settings?: Settings;
  timerStatus?: TimerStatus;
  timerStartTime?: number;
  timerDuration?: number;
  pausedRemainingMs?: number;
  stats?: Stats;
}

export function useChromeExtensionTimer() {
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [settings, setSettings] = useState<Settings>({
    focusDuration: 20,
    breakDuration: 20,
  });
  const [stats, setStats] = useState<Stats>({
    todayBreaks: 0,
    totalBreaks: 0,
    currentStreak: 0,
    lastActiveDate: "",
  });

  useEffect(() => {
    const loadState = () => {
      chrome.storage.sync.get(
        ["settings", "timerStatus", "timerStartTime", "timerDuration", "pausedRemainingMs", "stats"],
        (result: StorageResult) => {
          if (result.settings) {
            setSettings(result.settings);
          }

          if (result.stats) {
            const today = new Date().toDateString();
            if (result.stats.lastActiveDate !== today) {
              setStats({
                ...result.stats,
                todayBreaks: 0,
              });
            } else {
              setStats(result.stats);
            }
          }

          const timerStatus = result.timerStatus || "idle";
          setStatus(timerStatus);

          if (timerStatus === "paused" && result.pausedRemainingMs) {
            setTimeLeft(Math.floor(result.pausedRemainingMs / 1000));
          } else if ((timerStatus === "focus" || timerStatus === "break") && 
                     result.timerStartTime && result.timerDuration) {
            const elapsed = Date.now() - result.timerStartTime;
            const remaining = Math.max(0, Math.floor((result.timerDuration - elapsed) / 1000));
            setTimeLeft(remaining);
          } else {
            const focusDuration = result.settings?.focusDuration || 20;
            setTimeLeft(focusDuration * 60);
          }
        }
      );
    };

    loadState();

    const handleStorageChange = (changes: { [key: string]: { newValue?: unknown; oldValue?: unknown } }) => {
      if (changes.timerStatus?.newValue) {
        setStatus(changes.timerStatus.newValue as TimerStatus);
      }
      if (changes.settings?.newValue) {
        const newSettings = changes.settings.newValue as Settings;
        setSettings(newSettings);
        
        chrome.storage.sync.get(["timerStatus"], (result: StorageResult) => {
          if (result.timerStatus === "idle" || !result.timerStatus) {
            setTimeLeft(newSettings.focusDuration * 60);
          }
        });
      }
      if (changes.timerDuration?.newValue && changes.timerStatus?.newValue === "idle") {
        setTimeLeft(Math.floor((changes.timerDuration.newValue as number) / 1000));
      }
      if (changes.pausedRemainingMs?.newValue && changes.timerStatus?.newValue === "paused") {
        setTimeLeft(Math.floor((changes.pausedRemainingMs.newValue as number) / 1000));
      }
      if (changes.stats?.newValue) {
        setStats(changes.stats.newValue as Stats);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (status !== "focus" && status !== "break") return;

    const interval = setInterval(() => {
      chrome.storage.sync.get(["timerStartTime", "timerDuration", "timerStatus"], (result: StorageResult) => {
        if (result.timerStatus !== "focus" && result.timerStatus !== "break") {
          return;
        }
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
    chrome.runtime.sendMessage({ action: "startTimer" }, () => {
      chrome.storage.sync.get(["timerStatus", "timerStartTime", "timerDuration"], (result: StorageResult) => {
        if (result.timerStatus) {
          setStatus(result.timerStatus);
        }
        if (result.timerStartTime && result.timerDuration) {
          const elapsed = Date.now() - result.timerStartTime;
          const remaining = Math.max(0, Math.floor((result.timerDuration - elapsed) / 1000));
          setTimeLeft(remaining);
        }
      });
    });
  }, []);

  const pauseTimer = useCallback(() => {
    chrome.runtime.sendMessage({ action: "pauseTimer" }, () => {
      chrome.storage.sync.get(["timerStatus", "pausedRemainingMs"], (result: StorageResult) => {
        if (result.timerStatus) {
          setStatus(result.timerStatus);
        }
        if (result.pausedRemainingMs) {
          setTimeLeft(Math.floor(result.pausedRemainingMs / 1000));
        }
      });
    });
  }, []);

  const resetTimer = useCallback(() => {
    chrome.runtime.sendMessage({ action: "resetTimer" }, () => {
      chrome.storage.sync.get(["timerStatus", "timerDuration", "settings"], (result: StorageResult) => {
        setStatus("idle");
        const duration = result.timerDuration || (result.settings?.focusDuration || 20) * 60 * 1000;
        setTimeLeft(Math.floor(duration / 1000));
      });
    });
  }, []);

  const toggleMeetingMode = useCallback(() => {
    chrome.runtime.sendMessage({ action: "toggleMeetingMode" }, (response) => {
      if (response?.success) {
        setSettings(prev => ({ ...prev, meetingMode: response.meetingMode }));
      }
    });
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progress = status === "focus"
    ? ((settings.focusDuration * 60 - timeLeft) / (settings.focusDuration * 60)) * 100
    : status === "break"
    ? ((settings.breakDuration - timeLeft) / settings.breakDuration) * 100
    : 0;

  return {
    status,
    timeLeft,
    progress,
    formatTime,
    startFocus,
    pauseTimer,
    resetTimer,
    toggleMeetingMode,
    settings,
    stats,
    meetingMode: settings.meetingMode ?? false,
  };
}
