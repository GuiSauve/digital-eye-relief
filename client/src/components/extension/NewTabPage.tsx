import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Eye,
  Flame,
  Plus,
  X,
  ExternalLink,
  Pencil,
  Check,
  Play,
  Pause,
  Settings as SettingsIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useExtensionI18n } from "@/hooks/use-extension-i18n";
import { EyeExerciseCard, WellnessTipCard, QuoteCard } from "./EyeExercise";

interface TimerState {
  status: "idle" | "focus" | "break" | "paused";
  timeLeft: number;
  focusDuration: number;
  breakDuration: number;
}

interface Stats {
  todayBreaks: number;
  totalBreaks: number;
  currentStreak: number;
  lastActiveDate: string;
}

interface QuickLink {
  id: string;
  title: string;
  url: string;
}

declare const chrome: {
  storage?: {
    sync: {
      get: (keys: string[], cb: (result: Record<string, unknown>) => void) => void;
      set: (items: Record<string, unknown>, cb?: () => void) => void;
    };
    onChanged: {
      addListener: (cb: (changes: Record<string, { newValue?: unknown }>) => void) => void;
      removeListener: (cb: (changes: Record<string, { newValue?: unknown }>) => void) => void;
    };
  };
  runtime?: {
    sendMessage: (msg: Record<string, string>, cb?: (response?: Record<string, unknown>) => void) => void;
    openOptionsPage: () => void;
  };
} | undefined;

function isChromeExtension(): boolean {
  return typeof chrome !== "undefined" && !!chrome?.storage?.sync;
}

function getGreeting(t: (key: string) => string): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    const msg = t("goodMorning");
    return msg !== "goodMorning" ? msg : "Good morning";
  }
  if (hour < 17) {
    const msg = t("goodAfternoon");
    return msg !== "goodAfternoon" ? msg : "Good afternoon";
  }
  const msg = t("goodEvening");
  return msg !== "goodEvening" ? msg : "Good evening";
}

function formatClockTime(): string {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(): string {
  return new Date().toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatTimerDisplay(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getFocusDateKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function MiniProgressRing({
  progress,
  status,
}: {
  progress: number;
  status: string;
}) {
  const size = 48;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  const color =
    status === "break" ? "rgb(59 130 246)" : "hsl(140 35% 55%)";

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-foreground/10"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000"
      />
    </svg>
  );
}

export function NewTabPage() {
  const { t } = useExtensionI18n();
  const [clock, setClock] = useState(formatClockTime());
  const [userName, setUserName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [focusGoal, setFocusGoal] = useState("");
  const [focusGoalSaved, setFocusGoalSaved] = useState(false);
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [addingLink, setAddingLink] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [timerState, setTimerState] = useState<TimerState>({
    status: "idle",
    timeLeft: 20 * 60,
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
    const interval = setInterval(() => setClock(formatClockTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isChromeExtension()) {
      const savedName = localStorage.getItem("newtabUserName") || "";
      setUserName(savedName);
      const savedGoalDate = localStorage.getItem("newtabFocusGoalDate");
      if (savedGoalDate === getFocusDateKey()) {
        setFocusGoal(localStorage.getItem("newtabFocusGoal") || "");
        setFocusGoalSaved(!!localStorage.getItem("newtabFocusGoal"));
      }
      const savedLinks = localStorage.getItem("newtabQuickLinks");
      if (savedLinks) {
        try { setQuickLinks(JSON.parse(savedLinks)); } catch {}
      }
      setStats({ todayBreaks: 3, totalBreaks: 42, currentStreak: 5, lastActiveDate: new Date().toDateString() });
      setTimerState({ status: "focus", timeLeft: 14 * 60 + 30, focusDuration: 20, breakDuration: 20 });
      return;
    }

    chrome!.storage!.sync.get(
      [
        "newtabUserName",
        "newtabFocusGoal",
        "newtabFocusGoalDate",
        "newtabQuickLinks",
        "settings",
        "timerStatus",
        "timerStartTime",
        "timerDuration",
        "pausedRemainingMs",
        "stats",
      ],
      (result) => {
        if (result.newtabUserName) setUserName(result.newtabUserName as string);
        const savedDate = result.newtabFocusGoalDate as string;
        if (savedDate === getFocusDateKey() && result.newtabFocusGoal) {
          setFocusGoal(result.newtabFocusGoal as string);
          setFocusGoalSaved(true);
        }
        if (result.newtabQuickLinks) {
          setQuickLinks(result.newtabQuickLinks as QuickLink[]);
        }
        const settings = result.settings as { focusDuration?: number; breakDuration?: number } | undefined;
        const focusDur = settings?.focusDuration || 20;
        const breakDur = settings?.breakDuration || 20;
        const status = (result.timerStatus as TimerState["status"]) || "idle";
        let timeLeft = focusDur * 60;

        if (status === "paused" && result.pausedRemainingMs) {
          timeLeft = Math.floor((result.pausedRemainingMs as number) / 1000);
        } else if (
          (status === "focus" || status === "break") &&
          result.timerStartTime &&
          result.timerDuration
        ) {
          const elapsed = Date.now() - (result.timerStartTime as number);
          timeLeft = Math.max(0, Math.floor(((result.timerDuration as number) - elapsed) / 1000));
        }

        setTimerState({ status, timeLeft, focusDuration: focusDur, breakDuration: breakDur });

        if (result.stats) {
          const s = result.stats as Stats;
          const today = new Date().toDateString();
          if (s.lastActiveDate !== today) {
            setStats({ ...s, todayBreaks: 0 });
          } else {
            setStats(s);
          }
        }
      }
    );

    const handleChange = (changes: Record<string, { newValue?: unknown }>) => {
      if (changes.timerStatus?.newValue || changes.timerStartTime?.newValue || changes.timerDuration?.newValue) {
        chrome!.storage!.sync.get(
          ["timerStatus", "timerStartTime", "timerDuration", "pausedRemainingMs", "settings"],
          (result) => {
            const settings = result.settings as { focusDuration?: number; breakDuration?: number } | undefined;
            const focusDur = settings?.focusDuration || 20;
            const breakDur = settings?.breakDuration || 20;
            const status = (result.timerStatus as TimerState["status"]) || "idle";
            let timeLeft = focusDur * 60;
            if (status === "paused" && result.pausedRemainingMs) {
              timeLeft = Math.floor((result.pausedRemainingMs as number) / 1000);
            } else if ((status === "focus" || status === "break") && result.timerStartTime && result.timerDuration) {
              const elapsed = Date.now() - (result.timerStartTime as number);
              timeLeft = Math.max(0, Math.floor(((result.timerDuration as number) - elapsed) / 1000));
            }
            setTimerState({ status, timeLeft, focusDuration: focusDur, breakDuration: breakDur });
          }
        );
      }
      if (changes.stats?.newValue) {
        setStats(changes.stats.newValue as Stats);
      }
    };

    chrome!.storage!.onChanged.addListener(handleChange);
    return () => chrome!.storage!.onChanged.removeListener(handleChange);
  }, []);

  useEffect(() => {
    if (!isChromeExtension()) return;
    if (timerState.status !== "focus" && timerState.status !== "break") return;

    const interval = setInterval(() => {
      chrome!.storage!.sync.get(["timerStartTime", "timerDuration", "timerStatus"], (result) => {
        const st = result.timerStatus as string;
        if (st !== "focus" && st !== "break") return;
        if (result.timerStartTime && result.timerDuration) {
          const elapsed = Date.now() - (result.timerStartTime as number);
          const remaining = Math.max(0, Math.floor(((result.timerDuration as number) - elapsed) / 1000));
          setTimerState((prev) => ({ ...prev, timeLeft: remaining }));
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState.status]);

  const saveName = useCallback(() => {
    setUserName(nameInput);
    setEditingName(false);
    if (isChromeExtension()) {
      chrome!.storage!.sync.set({ newtabUserName: nameInput });
    } else {
      localStorage.setItem("newtabUserName", nameInput);
    }
  }, [nameInput]);

  const saveFocusGoal = useCallback(
    (goal: string) => {
      setFocusGoal(goal);
      setFocusGoalSaved(true);
      if (isChromeExtension()) {
        chrome!.storage!.sync.set({
          newtabFocusGoal: goal,
          newtabFocusGoalDate: getFocusDateKey(),
        });
      } else {
        localStorage.setItem("newtabFocusGoal", goal);
        localStorage.setItem("newtabFocusGoalDate", getFocusDateKey());
      }
    },
    []
  );

  const saveQuickLinks = useCallback((links: QuickLink[]) => {
    setQuickLinks(links);
    if (isChromeExtension()) {
      chrome!.storage!.sync.set({ newtabQuickLinks: links });
    } else {
      localStorage.setItem("newtabQuickLinks", JSON.stringify(links));
    }
  }, []);

  const addQuickLink = useCallback(() => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;
    let url = newLinkUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
    const link: QuickLink = {
      id: Date.now().toString(),
      title: newLinkTitle.trim(),
      url,
    };
    saveQuickLinks([...quickLinks, link]);
    setNewLinkTitle("");
    setNewLinkUrl("");
    setAddingLink(false);
  }, [newLinkTitle, newLinkUrl, quickLinks, saveQuickLinks]);

  const removeQuickLink = useCallback(
    (id: string) => {
      saveQuickLinks(quickLinks.filter((l) => l.id !== id));
    },
    [quickLinks, saveQuickLinks]
  );

  const handleStartPause = useCallback(() => {
    if (!isChromeExtension()) return;
    if (timerState.status === "idle" || timerState.status === "paused") {
      chrome!.runtime!.sendMessage({ action: "startTimer" });
    } else if (timerState.status === "focus") {
      chrome!.runtime!.sendMessage({ action: "pauseTimer" });
    }
  }, [timerState.status]);

  const timerProgress =
    timerState.status === "focus"
      ? ((timerState.focusDuration * 60 - timerState.timeLeft) / (timerState.focusDuration * 60)) * 100
      : timerState.status === "break"
      ? ((timerState.breakDuration - timerState.timeLeft) / timerState.breakDuration) * 100
      : 0;

  const statusLabel =
    timerState.status === "focus"
      ? t("focusing") !== "focusing" ? t("focusing") : "Focusing"
      : timerState.status === "break"
      ? t("relaxEyes") !== "relaxEyes" ? t("relaxEyes") : "Break"
      : timerState.status === "paused"
      ? t("paused") !== "paused" ? t("paused") : "Paused"
      : t("ready") !== "ready" ? t("ready") : "Ready";

  const greeting = getGreeting(t);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(140,25%,92%)] via-[hsl(40,20%,97%)] to-[hsl(200,25%,92%)] flex flex-col items-center justify-center p-6 font-sans selection:bg-primary/20">
      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <p className="text-lg text-foreground/50 font-sans mb-1" data-testid="text-date">
            {formatDate()}
          </p>
          <h1
            className="text-7xl font-display font-extrabold text-foreground tracking-tight mb-3"
            data-testid="text-clock"
          >
            {clock}
          </h1>

          {!editingName && !userName ? (
            <motion.button
              onClick={() => {
                setEditingName(true);
                setNameInput("");
              }}
              className="text-xl text-foreground/40 hover:text-foreground/60 transition-colors font-display cursor-pointer"
              data-testid="button-set-name"
            >
              {t("clickToSetName") !== "clickToSetName" ? t("clickToSetName") : "Click to set your name"}
            </motion.button>
          ) : editingName ? (
            <div className="flex items-center justify-center gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveName()}
                placeholder={t("yourName") !== "yourName" ? t("yourName") : "Your name"}
                className="text-xl font-display bg-transparent border-b-2 border-primary/40 focus:border-primary outline-none text-center text-foreground px-2 py-1"
                autoFocus
                data-testid="input-name"
              />
              <button
                onClick={saveName}
                className="p-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                data-testid="button-save-name"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 group">
              <h2
                className="text-2xl font-display font-bold text-foreground/70"
                data-testid="text-greeting"
              >
                {greeting}, {userName}
              </h2>
              <button
                onClick={() => {
                  setEditingName(true);
                  setNameInput(userName);
                }}
                className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-foreground/10 transition-all cursor-pointer"
                data-testid="button-edit-name"
              >
                <Pencil className="w-3.5 h-3.5 text-foreground/40" />
              </button>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-sm"
            data-testid="card-timer-status"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center",
                    timerState.status === "break"
                      ? "bg-blue-500/10 text-blue-500"
                      : timerState.status === "focus"
                      ? "bg-primary/10 text-primary"
                      : "bg-foreground/5 text-foreground/40"
                  )}
                >
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    20-20-20
                  </p>
                  <p
                    className={cn(
                      "font-display font-bold",
                      timerState.status === "break" ? "text-blue-500" : "text-foreground"
                    )}
                    data-testid="text-timer-status"
                  >
                    {statusLabel}
                  </p>
                </div>
              </div>
              <MiniProgressRing progress={timerProgress} status={timerState.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-display font-bold tabular-nums text-foreground" data-testid="text-timer-value">
                {formatTimerDisplay(timerState.timeLeft)}
              </span>
              <button
                onClick={handleStartPause}
                className={cn(
                  "p-2 rounded-full transition-colors cursor-pointer",
                  timerState.status === "idle" || timerState.status === "paused"
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "bg-foreground/5 text-foreground/40 hover:bg-foreground/10"
                )}
                data-testid="button-timer-toggle"
              >
                {timerState.status === "focus" ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-sm"
            data-testid="card-daily-stats"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t("todayStats") !== "todayStats" ? t("todayStats") : "Today's Stats"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-2xl font-display font-bold text-foreground" data-testid="text-today-breaks">
                  {stats.todayBreaks}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("breaks") !== "breaks" ? t("breaks") : "breaks"}
                </p>
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground" data-testid="text-streak">
                  {stats.currentStreak}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("streak") !== "streak" ? t("streak") : "streak"}{" "}
                  {stats.currentStreak === 1
                    ? t("daySingular") !== "daySingular" ? t("daySingular") : "day"
                    : t("days") !== "days" ? t("days") : "days"}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-sm"
            data-testid="card-focus-goal"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t("dailyFocus") !== "dailyFocus" ? t("dailyFocus") : "Daily Focus"}
                </p>
              </div>
            </div>
            {focusGoalSaved ? (
              <div className="group relative">
                <p className="text-sm text-foreground font-medium leading-relaxed pr-6" data-testid="text-focus-goal">
                  {focusGoal}
                </p>
                <button
                  onClick={() => setFocusGoalSaved(false)}
                  className="absolute top-0 right-0 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-foreground/10 transition-all cursor-pointer"
                  data-testid="button-edit-goal"
                >
                  <Pencil className="w-3 h-3 text-foreground/40" />
                </button>
              </div>
            ) : (
              <input
                type="text"
                value={focusGoal}
                onChange={(e) => setFocusGoal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && focusGoal.trim()) {
                    saveFocusGoal(focusGoal.trim());
                  }
                }}
                onBlur={() => {
                  if (focusGoal.trim()) saveFocusGoal(focusGoal.trim());
                }}
                placeholder={
                  t("focusPlaceholder") !== "focusPlaceholder"
                    ? t("focusPlaceholder")
                    : "What's your main focus today?"
                }
                className="w-full text-sm bg-transparent border-b border-foreground/10 focus:border-primary/40 outline-none text-foreground placeholder:text-foreground/30 py-1 transition-colors"
                autoFocus={!focusGoalSaved}
                data-testid="input-focus-goal"
              />
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <EyeExerciseCard t={t} />
          <WellnessTipCard t={t} />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-sm"
            data-testid="card-quick-links"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t("quickLinks") !== "quickLinks" ? t("quickLinks") : "Quick Links"}
                </p>
              </div>
              {!addingLink && (
                <button
                  onClick={() => setAddingLink(true)}
                  className="p-1.5 rounded-full hover:bg-foreground/5 transition-colors cursor-pointer"
                  data-testid="button-add-link"
                >
                  <Plus className="w-4 h-4 text-foreground/40" />
                </button>
              )}
            </div>

            <AnimatePresence mode="popLayout">
              {addingLink && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-2 space-y-1.5 overflow-hidden"
                >
                  <input
                    type="text"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                    placeholder={t("linkTitle") !== "linkTitle" ? t("linkTitle") : "Title"}
                    className="w-full text-xs bg-white/80 rounded-lg px-2.5 py-1.5 outline-none border border-foreground/10 focus:border-primary/30"
                    autoFocus
                    data-testid="input-link-title"
                  />
                  <input
                    type="text"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addQuickLink()}
                    placeholder="https://..."
                    className="w-full text-xs bg-white/80 rounded-lg px-2.5 py-1.5 outline-none border border-foreground/10 focus:border-primary/30"
                    data-testid="input-link-url"
                  />
                  <div className="flex gap-1.5">
                    <button
                      onClick={addQuickLink}
                      className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                      data-testid="button-save-link"
                    >
                      {t("save") !== "save" ? t("save") : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setAddingLink(false);
                        setNewLinkTitle("");
                        setNewLinkUrl("");
                      }}
                      className="text-xs px-2.5 py-1 rounded-lg bg-foreground/5 text-foreground/50 hover:bg-foreground/10 transition-colors cursor-pointer"
                      data-testid="button-cancel-link"
                    >
                      {t("cancel") !== "cancel" ? t("cancel") : "Cancel"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5 max-h-[120px] overflow-y-auto">
              {quickLinks.length === 0 && !addingLink && (
                <p className="text-xs text-foreground/30 text-center py-2">
                  {t("noLinksYet") !== "noLinksYet" ? t("noLinksYet") : "No links yet"}
                </p>
              )}
              {quickLinks.map((link) => (
                <div
                  key={link.id}
                  className="group flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/60 transition-colors"
                  data-testid={`link-item-${link.id}`}
                >
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=32`}
                    alt=""
                    className="w-4 h-4 rounded-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <a
                    href={link.url}
                    className="text-sm text-foreground/70 hover:text-foreground transition-colors flex-1 truncate"
                    data-testid={`link-anchor-${link.id}`}
                  >
                    {link.title}
                  </a>
                  <button
                    onClick={() => removeQuickLink(link.id)}
                    className="p-0.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-foreground/10 transition-all cursor-pointer"
                    data-testid={`button-remove-link-${link.id}`}
                  >
                    <X className="w-3 h-3 text-foreground/30" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <QuoteCard />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center mt-6"
        >
          <button
            onClick={() => {
              if (isChromeExtension()) {
                chrome!.runtime!.openOptionsPage();
              }
            }}
            className="text-xs text-foreground/30 hover:text-foreground/50 transition-colors flex items-center gap-1 cursor-pointer"
            data-testid="button-open-settings"
          >
            <SettingsIcon className="w-3 h-3" />
            {t("settings") !== "settings" ? t("settings") : "Settings"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
