import { motion } from "framer-motion";
import { Play, Pause, RefreshCcw, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PopupProps {
  status: "idle" | "focus" | "break" | "paused";
  timeLeft: number;
  progress: number;
  formatTime: (s: number) => string;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onOpenSettings: () => void;
}

export function Popup({
  status,
  timeLeft,
  progress,
  formatTime,
  onStart,
  onPause,
  onReset,
  onOpenSettings,
}: PopupProps) {
  // Calculate circle stroke properties
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="w-full h-[500px] bg-white flex flex-col overflow-hidden relative font-sans">
      {/* Header */}
      <div className="p-6 flex justify-between items-center bg-gradient-to-b from-green-50/50 to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold font-display text-lg">
            20
          </div>
          <span className="font-display font-bold text-foreground text-lg">Digital Eye Relief</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary rounded-full"
          onClick={onOpenSettings}
        >
          <SettingsIcon className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 -mt-8">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Progress Ring Background */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-secondary"
            />
            {/* Progress Ring Value */}
            <motion.circle
              cx="128"
              cy="128"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className={cn(
                "text-primary transition-colors duration-500 ease-in-out",
                status === "break" && "text-blue-400"
              )}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Timer Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              key={status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1"
            >
              {status === "idle" ? "Ready" : status === "break" ? "Relax Eyes" : status === "paused" ? "Paused" : "Focusing"}
            </motion.span>
            <span className="text-5xl font-display font-bold text-foreground tabular-nums tracking-tight">
              {status === "break" ? `${timeLeft}s` : formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-8">
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full border-2 hover:border-primary hover:text-primary transition-all"
            onClick={onReset}
            disabled={status === "idle"}
            data-testid="button-reset"
          >
            <RefreshCcw className="w-5 h-5" />
          </Button>

          {status === "idle" || status === "break" || status === "paused" ? (
            <Button
              size="lg"
              className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105"
              onClick={onStart}
              data-testid="button-play"
            >
              <Play className="w-8 h-8 ml-1" fill="currentColor" />
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-16 h-16 rounded-full bg-orange-400 hover:bg-orange-500 text-white shadow-lg shadow-orange-400/20 transition-all hover:scale-105"
              onClick={onPause}
              data-testid="button-pause"
            >
              <Pause className="w-8 h-8" fill="currentColor" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Status Footer */}
      <div className="p-4 text-center bg-secondary/30">
        <p className="text-xs text-muted-foreground font-medium">
          Next break in {status === 'idle' ? '20:00' : status === 'break' ? 'now' : formatTime(timeLeft)}
        </p>
      </div>
    </div>
  );
}
