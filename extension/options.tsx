import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  Eye, Clock, Bell, Volume2, Play, Users, Lightbulb,
  Monitor, Armchair, ChevronDown, Star, ThumbsUp, ThumbsDown,
  Heart, Mail,
} from "lucide-react";
import { Button } from "../client/src/components/ui/button";
import { Slider } from "../client/src/components/ui/slider";
import { Switch } from "../client/src/components/ui/switch";
import { Label } from "../client/src/components/ui/label";
import { useExtensionI18n } from "../client/src/hooks/use-extension-i18n";
import "../client/src/index.css";

// Apply dark mode class based on system preference (inline scripts are blocked by extension CSP)
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark');
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  document.documentElement.classList.toggle('dark', e.matches);
});

const CHROME_STORE_URL =
  "https://chromewebstore.google.com/detail/digital-eye-relief/dpolekhjjdagbjlohnpogappckndikin";
const FEEDBACK_EMAIL = "support@digitaleyerelief.com";

type FeedbackState = "ask" | "positive" | "negative";

interface SettingsData {
  focusDuration: number;
  breakDuration: number;
  soundEnabled: boolean;
  soundVolume: number;
  notificationType: "badge";
  meetingMode: boolean;
  meetingModeAutoDisableMinutes: number;
}

function OptionsApp() {
  const { t } = useExtensionI18n();
  const [settings, setSettings] = useState<SettingsData>({
    focusDuration: 20,
    breakDuration: 20,
    soundEnabled: true,
    soundVolume: 70,
    notificationType: "badge",
    meetingMode: false,
    meetingModeAutoDisableMinutes: 0,
  });
  const [saved, setSaved] = useState(false);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>("ask");

  const breakStartAudioRef = useRef<HTMLAudioElement | null>(null);
  const breakEndAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    chrome.storage.sync.get(["settings", "feedbackState"], (result: { settings?: SettingsData; feedbackState?: FeedbackState }) => {
      if (result.settings) {
        setSettings({
          focusDuration: result.settings.focusDuration ?? 20,
          breakDuration: result.settings.breakDuration ?? 20,
          soundEnabled: result.settings.soundEnabled ?? true,
          soundVolume: result.settings.soundVolume ?? 70,
          notificationType: "badge",
          meetingMode: result.settings.meetingMode ?? false,
          meetingModeAutoDisableMinutes: result.settings.meetingModeAutoDisableMinutes ?? 0,
        });
      }
      if (result.feedbackState) {
        setFeedbackState(result.feedbackState);
      }
    });
  }, []);

  const updateSettings = (newSettings: SettingsData) => {
    setSettings(newSettings);
    chrome.storage.sync.set({ settings: newSettings }, () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  const handleFeedback = (state: "positive" | "negative") => {
    setFeedbackState(state);
    chrome.storage.sync.set({ feedbackState: state });
  };

  const playBreakStartSound = () => {
    if (!breakStartAudioRef.current) {
      breakStartAudioRef.current = new Audio("/sounds/singing-bowl.mp3");
    }
    breakStartAudioRef.current.volume = (settings.soundVolume ?? 70) / 100;
    breakStartAudioRef.current.currentTime = 0;
    breakStartAudioRef.current.play().catch(() => {});
  };

  const playBreakEndSound = () => {
    if (!breakEndAudioRef.current) {
      breakEndAudioRef.current = new Audio("/sounds/bells.mp3");
    }
    breakEndAudioRef.current.volume = (settings.soundVolume ?? 70) / 100;
    breakEndAudioRef.current.currentTime = 0;
    breakEndAudioRef.current.play().catch(() => {});
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm shadow-primary/30">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-foreground text-base leading-tight">Digital Eye Relief</p>
            <p className="text-xs text-muted-foreground">{t("settings")}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground rounded-full"
          onClick={() => window.close()}
        >
          {t("close")}
        </Button>
      </header>

      {/* Saved banner */}
      {saved && (
        <div className="bg-primary/10 text-primary text-sm text-center py-2 font-medium">
          {t("settings")} saved ✓
        </div>
      )}

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">

        {/* Row 1: Timer + Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Timer Intervals */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 text-primary font-semibold border-b border-border pb-3">
              <Clock className="w-4 h-4" />
              <span className="text-sm uppercase tracking-wide">{t("timerIntervals")}</span>
            </div>
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <Label>{t("focusDuration")}</Label>
                  <span className="font-mono text-muted-foreground">{settings.focusDuration} {t("min")}</span>
                </div>
                <div className="relative pb-5">
                  <Slider
                    value={[settings.focusDuration]}
                    min={5} max={60} step={5}
                    onValueChange={(val) => updateSettings({ ...settings, focusDuration: val[0] })}
                    className="py-2"
                  />
                  <div
                    className="absolute top-8 flex flex-col items-center"
                    style={{ left: "calc(27.27% - 1px)" }}
                  >
                    <div className="w-0.5 h-2 bg-primary/40 rounded-full" />
                    <span className="text-[10px] text-primary/60 font-medium mt-0.5">20</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <Label>{t("breakDuration")}</Label>
                  <span className="font-mono text-muted-foreground">{settings.breakDuration} {t("sec")}</span>
                </div>
                <div className="relative pb-5">
                  <Slider
                    value={[settings.breakDuration]}
                    min={10} max={60} step={5}
                    onValueChange={(val) => updateSettings({ ...settings, breakDuration: val[0] })}
                    className="py-2"
                  />
                  <div
                    className="absolute top-8 flex flex-col items-center"
                    style={{ left: "calc(20% - 1px)" }}
                  >
                    <div className="w-0.5 h-2 bg-primary/40 rounded-full" />
                    <span className="text-[10px] text-primary/60 font-medium mt-0.5">20</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 text-primary font-semibold border-b border-border pb-3">
              <Bell className="w-4 h-4" />
              <span className="text-sm uppercase tracking-wide">{t("notifications")}</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="sound-toggle">{t("soundEffects")}</Label>
                </div>
                <Switch
                  id="sound-toggle"
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => updateSettings({ ...settings, soundEnabled: checked })}
                />
              </div>

              <div className="space-y-4 pl-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("volume")}</span>
                    <span className="font-mono text-muted-foreground">{settings.soundVolume ?? 70}%</span>
                  </div>
                  <Slider
                    value={[settings.soundVolume ?? 70]}
                    min={0} max={100} step={5}
                    onValueChange={(val) => updateSettings({ ...settings, soundVolume: val[0] })}
                    className="py-2"
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("breakStarts")}</span>
                  <Button
                    variant="ghost" size="sm"
                    className="h-7 px-2 rounded-full hover:bg-primary/10 hover:text-primary gap-1"
                    onClick={playBreakStartSound}
                  >
                    <Play className="w-3 h-3" fill="currentColor" />
                    <span className="text-xs">{t("preview")}</span>
                  </Button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("breakEnds")}</span>
                  <Button
                    variant="ghost" size="sm"
                    className="h-7 px-2 rounded-full hover:bg-primary/10 hover:text-primary gap-1"
                    onClick={playBreakEndSound}
                  >
                    <Play className="w-3 h-3" fill="currentColor" />
                    <span className="text-xs">{t("preview")}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meeting Mode */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 text-primary font-semibold border-b border-border pb-3">
            <Users className="w-4 h-4" />
            <span className="text-sm uppercase tracking-wide">{t("meetingMode")}</span>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800/40">
              <p className="text-xs text-amber-700 dark:text-amber-400">{t("meetingModeInfo")}</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Label>{t("autoDisable")}</Label>
                <span className="font-mono text-muted-foreground">
                  {settings.meetingModeAutoDisableMinutes === 0
                    ? t("manual")
                    : `${settings.meetingModeAutoDisableMinutes} ${t("min")}`}
                </span>
              </div>
              <Slider
                value={[settings.meetingModeAutoDisableMinutes ?? 0]}
                min={0} max={120} step={15}
                onValueChange={(val) => updateSettings({ ...settings, meetingModeAutoDisableMinutes: val[0] })}
                className="py-2"
              />
              <p className="text-xs text-muted-foreground">{t("autoDisableInfo")}</p>
            </div>
          </div>
        </div>

        {/* Workspace Setup Tips */}
        <details className="group bg-card rounded-2xl border border-border shadow-sm p-6">
          <summary className="flex items-center justify-between text-primary font-semibold border-b border-border pb-3 cursor-pointer list-none hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm uppercase tracking-wide">{t("workspaceSetupTips")}</span>
            </div>
            <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
          </summary>
          <div className="space-y-3 pt-4">
            <div className="flex gap-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Monitor className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{t("screenPosition")}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("screenPositionDesc")}</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{t("lighting")}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("lightingDesc")}</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Armchair className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{t("posture")}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("postureDesc")}</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{t("blinking")}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("blinkingDesc")}</p>
              </div>
            </div>
          </div>
        </details>

        {/* Feedback Section */}
        <div className="bg-rose-50 dark:bg-rose-950/20 rounded-2xl border border-rose-100 dark:border-rose-900/30 shadow-sm p-6">
          <div className="flex items-center gap-2 text-rose-500 font-semibold border-b border-rose-100 dark:border-rose-900/30 pb-3 mb-6">
            <Heart className="w-4 h-4" />
            <span className="text-sm uppercase tracking-wide">Your Experience</span>
          </div>

          {feedbackState === "ask" && (
            <div className="text-center space-y-5">
              <p className="text-foreground font-medium">Are you enjoying Digital Eye Relief?</p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  className="rounded-full px-6 border-border hover:bg-green-50 hover:border-green-300 hover:text-green-700 gap-2"
                  onClick={() => handleFeedback("positive")}
                >
                  <ThumbsUp className="w-4 h-4" />
                  Loving it
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full px-6 border-border hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 gap-2"
                  onClick={() => handleFeedback("negative")}
                >
                  <ThumbsDown className="w-4 h-4" />
                  Could be better
                </Button>
              </div>
            </div>
          )}

          {feedbackState === "positive" && (
            <div className="text-center space-y-4">
              <p className="text-2xl">🎉</p>
              <p className="text-foreground font-medium">So glad to hear it!</p>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                A quick review on the Chrome Web Store helps others discover the extension — it only takes 30 seconds.
              </p>
              <Button
                className="rounded-full px-6 bg-primary hover:bg-primary/90 gap-2 shadow-md shadow-primary/20"
                onClick={() => window.open(CHROME_STORE_URL, "_blank")}
              >
                <Star className="w-4 h-4" />
                Leave a review
              </Button>
            </div>
          )}

          {feedbackState === "negative" && (
            <div className="text-center space-y-4">
              <p className="text-2xl">🙏</p>
              <p className="text-foreground font-medium">Thank you for being honest.</p>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Your feedback helps make the extension better. What could we improve?
              </p>
              <Button
                variant="outline"
                className="rounded-full px-6 border-border hover:bg-muted gap-2"
                onClick={() =>
                  window.open(
                    `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent("Digital Eye Relief — Feedback")}`,
                    "_blank"
                  )
                }
              >
                <Mail className="w-4 h-4" />
                Send feedback
              </Button>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<OptionsApp />);
}
