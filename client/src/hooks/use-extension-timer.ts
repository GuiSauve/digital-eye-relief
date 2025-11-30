import { useState, useEffect, useCallback } from "react";

export type TimerStatus = "idle" | "focus" | "break";

interface UseExtensionTimerProps {
  focusDurationMinutes?: number;
  breakDurationSeconds?: number;
}

export function useExtensionTimer({
  focusDurationMinutes = 20,
  breakDurationSeconds = 20,
}: UseExtensionTimerProps = {}) {
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [timeLeft, setTimeLeft] = useState(focusDurationMinutes * 60);
  
  // Settings state (normally would be in Chrome storage)
  const [settings, setSettings] = useState({
    focusDuration: focusDurationMinutes,
    breakDuration: breakDurationSeconds,
    soundEnabled: true,
    notificationType: "modal" as "modal" | "badge",
  });

  const resetTimer = useCallback(() => {
    setStatus("idle");
    setTimeLeft(settings.focusDuration * 60);
  }, [settings.focusDuration]);

  const startFocus = useCallback(() => {
    setStatus("focus");
  }, []);

  const pauseTimer = useCallback(() => {
    setStatus("idle");
  }, []);

  const startBreak = useCallback(() => {
    setStatus("break");
    setTimeLeft(settings.breakDuration);
  }, [settings.breakDuration]);

  const skipBreak = useCallback(() => {
    setStatus("focus");
    setTimeLeft(settings.focusDuration * 60);
  }, [settings.focusDuration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (status === "focus" || status === "break") {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer finished
            if (status === "focus") {
              setStatus("break");
              return settings.breakDuration;
            } else {
              // Break finished
              setStatus("focus");
              return settings.focusDuration * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [status, settings.breakDuration, settings.focusDuration]);

  // Update timeLeft if settings change while idle
  useEffect(() => {
    if (status === "idle") {
      setTimeLeft(settings.focusDuration * 60);
    }
  }, [settings.focusDuration, status]);

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
    startBreak,
    skipBreak,
    settings,
    setSettings,
  };
}
