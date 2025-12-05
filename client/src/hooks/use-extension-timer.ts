import { useState, useEffect, useCallback, useRef } from "react";

export type TimerStatus = "idle" | "focus" | "break" | "paused";

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
  const pausedTimeRef = useRef<number>(0);
  
  // Audio refs for sound notifications
  const breakStartSoundRef = useRef<HTMLAudioElement | null>(null);
  const breakEndSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Settings state (normally would be in Chrome storage)
  const [settings, setSettings] = useState({
    focusDuration: focusDurationMinutes,
    breakDuration: breakDurationSeconds,
    soundEnabled: true,
    notificationType: "badge" as const,
  });
  
  // Play sound helper
  const playSound = useCallback((type: 'breakStart' | 'breakEnd') => {
    if (!settings.soundEnabled) return;
    
    if (type === 'breakStart') {
      if (!breakStartSoundRef.current) {
        breakStartSoundRef.current = new Audio('/sounds/singing-bowl.mp3');
        breakStartSoundRef.current.volume = 0.7;
      }
      breakStartSoundRef.current.currentTime = 0;
      breakStartSoundRef.current.play().catch(err => console.log('Audio play error:', err));
    } else {
      if (!breakEndSoundRef.current) {
        breakEndSoundRef.current = new Audio('/sounds/break-end-chime.mp3');
        breakEndSoundRef.current.volume = 0.7;
      }
      breakEndSoundRef.current.currentTime = 0;
      breakEndSoundRef.current.play().catch(err => console.log('Audio play error:', err));
    }
  }, [settings.soundEnabled]);

  const resetTimer = useCallback(() => {
    setStatus("idle");
    setTimeLeft(settings.focusDuration * 60);
    pausedTimeRef.current = 0;
  }, [settings.focusDuration]);

  const startFocus = useCallback(() => {
    if (status === "paused" && pausedTimeRef.current > 0) {
      setTimeLeft(pausedTimeRef.current);
      pausedTimeRef.current = 0;
    }
    setStatus("focus");
  }, [status]);

  const pauseTimer = useCallback(() => {
    pausedTimeRef.current = timeLeft;
    setStatus("paused");
  }, [timeLeft]);

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
              // Focus ended, break starting - play break start sound
              playSound('breakStart');
              setStatus("break");
              return settings.breakDuration;
            } else {
              // Break finished - play break end sound
              playSound('breakEnd');
              setStatus("focus");
              return settings.focusDuration * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [status, settings.breakDuration, settings.focusDuration, playSound]);

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

  // Calculate progress based on current status
  const calculateProgress = () => {
    if (status === "idle") {
      return 0;
    }
    if (status === "focus" || status === "paused") {
      // For focus and paused, calculate based on focus duration
      return ((settings.focusDuration * 60 - timeLeft) / (settings.focusDuration * 60)) * 100;
    }
    if (status === "break") {
      return ((settings.breakDuration - timeLeft) / settings.breakDuration) * 100;
    }
    return 0;
  };

  const progress = calculateProgress();

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
