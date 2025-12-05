import { ChevronLeft, Bell, Clock, Volume2, Play } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SettingsProps {
  settings: {
    focusDuration: number;
    breakDuration: number;
    soundEnabled: boolean;
    notificationType: "modal" | "badge";
  };
  onUpdateSettings: (settings: any) => void;
  onBack: () => void;
}

export function Settings({ settings, onUpdateSettings, onBack }: SettingsProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playPreviewSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/sounds/singing-bowl.mp3');
      audioRef.current.volume = 0.7;
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(err => console.log('Audio play error:', err));
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
      <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-8">
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
              <Slider
                defaultValue={[settings.focusDuration]}
                min={5}
                max={60}
                step={5}
                onValueChange={(val) => onUpdateSettings({ ...settings, focusDuration: val[0] })}
                className="py-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Label>Break Duration</Label>
                <span className="font-mono text-muted-foreground">{settings.breakDuration} sec</span>
              </div>
              <Slider
                defaultValue={[settings.breakDuration]}
                min={10}
                max={60}
                step={5}
                onValueChange={(val) => onUpdateSettings({ ...settings, breakDuration: val[0] })}
                className="py-2"
              />
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
                <Label htmlFor="sound-toggle">Sound Effect</Label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-primary/10 hover:text-primary"
                  onClick={playPreviewSound}
                  data-testid="button-preview-sound"
                >
                  <Play className="w-3.5 h-3.5" fill="currentColor" />
                </Button>
              </div>
              <Switch
                id="sound-toggle"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => onUpdateSettings({ ...settings, soundEnabled: checked })}
              />
            </div>

            <div className="space-y-3 pt-2">
              <Label className="text-xs text-muted-foreground">Reminder Style</Label>
              <RadioGroup
                value={settings.notificationType}
                onValueChange={(val) => onUpdateSettings({ ...settings, notificationType: val })}
                className="gap-3"
              >
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/30 transition-colors cursor-pointer">
                  <RadioGroupItem value="modal" id="r-modal" />
                  <Label htmlFor="r-modal" className="cursor-pointer flex-1">Full Screen Modal</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/30 transition-colors cursor-pointer">
                  <RadioGroupItem value="badge" id="r-badge" />
                  <Label htmlFor="r-badge" className="cursor-pointer flex-1">Icon Badge Only</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
