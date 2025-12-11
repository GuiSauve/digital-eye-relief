import { ChevronLeft, Bell, Clock, Volume2, Play, Lightbulb, Monitor, Armchair, Eye, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SettingsProps {
  settings: {
    focusDuration: number;
    breakDuration: number;
    soundEnabled: boolean;
    notificationType: "badge";
  };
  onUpdateSettings: (settings: any) => void;
  onBack: () => void;
}

export function Settings({ settings, onUpdateSettings, onBack }: SettingsProps) {
  const [tipsExpanded, setTipsExpanded] = useState(false);
  const breakStartAudioRef = useRef<HTMLAudioElement | null>(null);
  const breakEndAudioRef = useRef<HTMLAudioElement | null>(null);

  const playBreakStartSound = () => {
    if (!breakStartAudioRef.current) {
      breakStartAudioRef.current = new Audio('/sounds/singing-bowl.mp3');
      breakStartAudioRef.current.volume = 0.7;
    }
    breakStartAudioRef.current.currentTime = 0;
    breakStartAudioRef.current.play().catch(err => console.log('Audio play error:', err));
  };

  const playBreakEndSound = () => {
    if (!breakEndAudioRef.current) {
      breakEndAudioRef.current = new Audio('/sounds/bells.mp3');
      breakEndAudioRef.current.volume = 0.7;
    }
    breakEndAudioRef.current.currentTime = 0;
    breakEndAudioRef.current.play().catch(err => console.log('Audio play error:', err));
  };

  return (
    <div className="w-full h-[500px] bg-white flex flex-col overflow-hidden relative font-sans">
      {/* Header */}
      <div className="p-6 flex items-center gap-4 bg-gradient-to-b from-secondary/50 to-transparent">
        <Button
          variant="ghost"
          size="icon"
          className="-ml-2 rounded-full hover:bg-background/50"
          onClick={onBack}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-lg font-display font-bold">Settings</h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 pt-0 pb-8 space-y-8">
        {/* Timer Settings */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-primary font-semibold border-b border-border pb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm uppercase tracking-wide">Timer Intervals</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Label>Focus Duration</Label>
                <span className="font-mono text-muted-foreground">{settings.focusDuration} min</span>
              </div>
              <div className="relative">
                <Slider
                  value={[settings.focusDuration]}
                  min={5}
                  max={60}
                  step={5}
                  onValueChange={(val) => onUpdateSettings({ ...settings, focusDuration: val[0] })}
                  className="py-2"
                />
                {/* Default marker at 20 min: (20-5)/(60-5) = 27.27% */}
                <div 
                  className="absolute top-full mt-0.5 flex flex-col items-center"
                  style={{ left: 'calc(27.27% - 1px)' }}
                >
                  <div className="w-0.5 h-2 bg-primary/40 rounded-full" />
                  <span className="text-[10px] text-primary/60 font-medium mt-0.5">20</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-6">
              <div className="flex justify-between text-sm">
                <Label>Break Duration</Label>
                <span className="font-mono text-muted-foreground">{settings.breakDuration} sec</span>
              </div>
              <div className="relative">
                <Slider
                  value={[settings.breakDuration]}
                  min={10}
                  max={60}
                  step={5}
                  onValueChange={(val) => onUpdateSettings({ ...settings, breakDuration: val[0] })}
                  className="py-2"
                />
                {/* Default marker at 20 sec: (20-10)/(60-10) = 20% */}
                <div 
                  className="absolute top-full mt-0.5 flex flex-col items-center"
                  style={{ left: 'calc(20% - 1px)' }}
                >
                  <div className="w-0.5 h-2 bg-primary/40 rounded-full" />
                  <span className="text-[10px] text-primary/60 font-medium mt-0.5">20</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-primary font-semibold border-b border-border pb-2">
            <Bell className="w-4 h-4" />
            <span className="text-sm uppercase tracking-wide">Notifications</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="sound-toggle">Sound Effects</Label>
              </div>
              <Switch
                id="sound-toggle"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => onUpdateSettings({ ...settings, soundEnabled: checked })}
              />
            </div>

            <div className="space-y-2 pl-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Break starts</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 rounded-full hover:bg-primary/10 hover:text-primary gap-1"
                  onClick={playBreakStartSound}
                  data-testid="button-preview-break-start"
                >
                  <Play className="w-3 h-3" fill="currentColor" />
                  <span className="text-xs">Preview</span>
                </Button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Break ends</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 rounded-full hover:bg-primary/10 hover:text-primary gap-1"
                  onClick={playBreakEndSound}
                  data-testid="button-preview-break-end"
                >
                  <Play className="w-3 h-3" fill="currentColor" />
                  <span className="text-xs">Preview</span>
                </Button>
              </div>
            </div>

          </div>
        </div>

        {/* Workspace Setup Tips */}
        <div className="space-y-4">
          <button
            onClick={() => setTipsExpanded(!tipsExpanded)}
            className="w-full flex items-center justify-between text-primary font-semibold border-b border-border pb-2 hover:opacity-80 transition-opacity"
            data-testid="button-toggle-tips"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm uppercase tracking-wide">Workspace Setup Tips</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${tipsExpanded ? 'rotate-180' : ''}`} />
          </button>

          {tipsExpanded && (
            <div className="space-y-3 pt-2">
              <div className="flex gap-3 p-3 bg-secondary/30 rounded-lg">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Monitor className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Screen Position</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Position your screen 20-28 inches away, with the top at or slightly below eye level</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-secondary/30 rounded-lg">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Lighting</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Reduce glare by positioning your screen away from windows and bright overhead lights</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-secondary/30 rounded-lg">
                <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Armchair className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Posture</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Keep feet flat on the floor with arms parallel to the keyboard</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-secondary/30 rounded-lg">
                <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Eye className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Blinking</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Make a conscious effort to blink fully — we blink 40-60% less when using screens</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
