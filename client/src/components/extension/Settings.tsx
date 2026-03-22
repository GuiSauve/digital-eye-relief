import { ChevronLeft, Bell, Clock, Volume2, Play, Lightbulb, Monitor, Armchair, Eye, ChevronDown, Users } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useExtensionI18n } from "@/hooks/use-extension-i18n";

interface SettingsProps {
  settings: {
    focusDuration: number;
    breakDuration: number;
    soundEnabled: boolean;
    soundVolume: number;
    notificationType: "badge";
    meetingMode?: boolean;
    meetingModeAutoDisableMinutes?: number;
  };
  onUpdateSettings: (settings: any) => void;
  onBack: () => void;
  language?: string;
}

export function Settings({ settings, onUpdateSettings, onBack, language }: SettingsProps) {
  const { t } = useExtensionI18n(language);
  const breakStartAudioRef = useRef<HTMLAudioElement | null>(null);
  const breakEndAudioRef = useRef<HTMLAudioElement | null>(null);

  const playBreakStartSound = () => {
    if (!breakStartAudioRef.current) {
      breakStartAudioRef.current = new Audio('/sounds/singing-bowl.mp3');
    }
    breakStartAudioRef.current.volume = (settings.soundVolume ?? 70) / 100;
    breakStartAudioRef.current.currentTime = 0;
    breakStartAudioRef.current.play().catch(err => console.log('Audio play error:', err));
  };

  const playBreakEndSound = () => {
    if (!breakEndAudioRef.current) {
      breakEndAudioRef.current = new Audio('/sounds/bells.mp3');
    }
    breakEndAudioRef.current.volume = (settings.soundVolume ?? 70) / 100;
    breakEndAudioRef.current.currentTime = 0;
    breakEndAudioRef.current.play().catch(err => console.log('Audio play error:', err));
  };

  return (
    <div className="w-full h-[500px] bg-background flex flex-col overflow-hidden relative font-sans">
      {/* Header */}
      <div className="p-6 flex items-center gap-4 bg-gradient-to-b from-secondary/50 to-transparent">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Back to popup"
          className="-ml-2 rounded-full hover:bg-background/50"
          onClick={onBack}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-lg font-display font-bold">{t('settings')}</h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 pt-0 pb-8 space-y-8">
        {/* Timer Settings */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-primary font-semibold border-b border-border pb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm uppercase tracking-wide">{t('timerIntervals')}</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Label>{t('focusDuration')}</Label>
                <span className="font-mono text-muted-foreground">{settings.focusDuration} {t('min')}</span>
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
                <Label>{t('breakDuration')}</Label>
                <span className="font-mono text-muted-foreground">{settings.breakDuration} {t('sec')}</span>
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
            <span className="text-sm uppercase tracking-wide">{t('notifications')}</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="sound-toggle">{t('soundEffects')}</Label>
              </div>
              <Switch
                id="sound-toggle"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => onUpdateSettings({ ...settings, soundEnabled: checked })}
              />
            </div>

            <div className="space-y-4 pl-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('volume')}</span>
                  <span className="font-mono text-muted-foreground">{settings.soundVolume ?? 70}%</span>
                </div>
                <Slider
                  value={[settings.soundVolume ?? 70]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(val) => onUpdateSettings({ ...settings, soundVolume: val[0] })}
                  className="py-2"
                  data-testid="slider-volume"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('breakStarts')}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 rounded-full hover:bg-primary/10 hover:text-primary gap-1"
                  onClick={playBreakStartSound}
                  data-testid="button-preview-break-start"
                >
                  <Play className="w-3 h-3" fill="currentColor" />
                  <span className="text-xs">{t('preview')}</span>
                </Button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('breakEnds')}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 rounded-full hover:bg-primary/10 hover:text-primary gap-1"
                  onClick={playBreakEndSound}
                  data-testid="button-preview-break-end"
                >
                  <Play className="w-3 h-3" fill="currentColor" />
                  <span className="text-xs">{t('preview')}</span>
                </Button>
              </div>
            </div>

          </div>
        </div>

        {/* Meeting Mode Settings */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-primary font-semibold border-b border-border pb-2">
            <Users className="w-4 h-4" />
            <span className="text-sm uppercase tracking-wide">{t('meetingMode')}</span>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-xs text-amber-700">
                {t('meetingModeInfo')}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Label>{t('autoDisable')}</Label>
                <span className="font-mono text-muted-foreground">
                  {settings.meetingModeAutoDisableMinutes === 0 ? t('manual') : `${settings.meetingModeAutoDisableMinutes} ${t('min')}`}
                </span>
              </div>
              <Slider
                value={[settings.meetingModeAutoDisableMinutes ?? 0]}
                min={0}
                max={120}
                step={15}
                onValueChange={(val) => onUpdateSettings({ ...settings, meetingModeAutoDisableMinutes: val[0] })}
                className="py-2"
                data-testid="slider-meeting-mode-auto-disable"
              />
              <p className="text-xs text-muted-foreground">
                {t('autoDisableInfo')}
              </p>
            </div>
          </div>
        </div>

        {/* Workspace Setup Tips */}
        <details className="group" data-testid="details-tips">
          <summary className="w-full flex items-center justify-between text-primary font-semibold border-b border-border pb-2 hover:opacity-80 transition-opacity cursor-pointer list-none">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm uppercase tracking-wide">{t('workspaceSetupTips')}</span>
            </div>
            <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
          </summary>

          <div className="space-y-3 pt-4">
              <div className="flex gap-3 p-3 bg-secondary/30 rounded-lg">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Monitor className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t('screenPosition')}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t('screenPositionDesc')}</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-secondary/30 rounded-lg">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t('lighting')}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t('lightingDesc')}</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-secondary/30 rounded-lg">
                <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Armchair className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t('posture')}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t('postureDesc')}</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-secondary/30 rounded-lg">
                <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Eye className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t('blinking')}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t('blinkingDesc')}</p>
                </div>
              </div>
          </div>
        </details>
      </div>
    </div>
  );
}
