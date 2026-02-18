import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft, Eye, Flame, Trophy, Target, Clock, 
  TrendingUp, Zap, Star, Award, Shield, SkipForward,
  Calendar, Sun, Sunrise, Moon, Coffee
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

const SAMPLE_WEEKLY = [
  { day: "Mon", breaks: 14, skipped: 2, focusMin: 280 },
  { day: "Tue", breaks: 11, skipped: 3, focusMin: 240 },
  { day: "Wed", breaks: 16, skipped: 1, focusMin: 320 },
  { day: "Thu", breaks: 9, skipped: 4, focusMin: 200 },
  { day: "Fri", breaks: 13, skipped: 2, focusMin: 260 },
  { day: "Sat", breaks: 6, skipped: 0, focusMin: 120 },
  { day: "Sun", breaks: 4, skipped: 0, focusMin: 80 },
];

const SAMPLE_HOURLY = [
  { hour: "8am", breaks: 2 },
  { hour: "9am", breaks: 3 },
  { hour: "10am", breaks: 3 },
  { hour: "11am", breaks: 2 },
  { hour: "12pm", breaks: 1 },
  { hour: "1pm", breaks: 2 },
  { hour: "2pm", breaks: 3 },
  { hour: "3pm", breaks: 3 },
  { hour: "4pm", breaks: 2 },
  { hour: "5pm", breaks: 1 },
  { hour: "6pm", breaks: 1 },
];

const MAX_WEEKLY = Math.max(...SAMPLE_WEEKLY.map(d => d.breaks + d.skipped));
const MAX_HOURLY = Math.max(...SAMPLE_HOURLY.map(d => d.breaks));

interface Achievement {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  earned: boolean;
  progress?: number;
  total?: number;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: "first_break", icon: <Eye className="w-5 h-5" />, title: "First Steps", description: "Take your first break", earned: true },
  { id: "streak_3", icon: <Flame className="w-5 h-5" />, title: "On a Roll", description: "3-day streak", earned: true },
  { id: "streak_7", icon: <Flame className="w-5 h-5" />, title: "Week Warrior", description: "7-day streak", earned: true },
  { id: "streak_30", icon: <Flame className="w-5 h-5" />, title: "Monthly Master", description: "30-day streak", earned: false, progress: 12, total: 30 },
  { id: "breaks_50", icon: <Trophy className="w-5 h-5" />, title: "Half Century", description: "50 total breaks", earned: true },
  { id: "breaks_100", icon: <Trophy className="w-5 h-5" />, title: "Centurion", description: "100 total breaks", earned: false, progress: 73, total: 100 },
  { id: "no_skip", icon: <Target className="w-5 h-5" />, title: "No Skips", description: "Full day, zero skips", earned: true },
  { id: "focus_8h", icon: <Clock className="w-5 h-5" />, title: "Deep Work", description: "8 hours focus in a day", earned: false, progress: 5.3, total: 8 },
  { id: "perfect_week", icon: <Star className="w-5 h-5" />, title: "Perfect Week", description: "No skips for 7 days", earned: false, progress: 3, total: 7 },
  { id: "early_bird", icon: <Sunrise className="w-5 h-5" />, title: "Early Bird", description: "Start before 8am", earned: true },
  { id: "night_owl", icon: <Moon className="w-5 h-5" />, title: "Night Owl", description: "Active past 10pm", earned: false },
  { id: "consistent", icon: <Award className="w-5 h-5" />, title: "Consistent", description: "Same breaks 5 days straight", earned: false, progress: 2, total: 5 },
];

const TODAY_STATS = {
  breaksTaken: 8,
  breaksSkipped: 1,
  focusTime: 160,
  currentStreak: 12,
  longestStreak: 14,
  totalBreaks: 73,
  avgBreaksPerDay: 10.4,
  bestDay: "Wednesday",
};

type TabType = "week" | "patterns" | "achievements";

export function StatsDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("week");
  const { language } = useLanguage();
  const homePath = language === "en" ? "/" : `/${language}`;

  const totalWeekBreaks = SAMPLE_WEEKLY.reduce((s, d) => s + d.breaks, 0);
  const totalWeekSkips = SAMPLE_WEEKLY.reduce((s, d) => s + d.skipped, 0);
  const totalWeekFocus = SAMPLE_WEEKLY.reduce((s, d) => s + d.focusMin, 0);
  const completionRate = Math.round((totalWeekBreaks / (totalWeekBreaks + totalWeekSkips)) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <Link href={homePath}>
            <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-back-home">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-display font-bold text-stone-800">Your Eye Health</h1>
            <p className="text-sm text-stone-500">Stay on track with the 20-20-20 rule</p>
          </div>
        </div>

        {/* Today's Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.div
            className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            data-testid="card-today-breaks"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Eye className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-stone-800">{TODAY_STATS.breaksTaken}</p>
            <p className="text-xs text-stone-500">Breaks Today</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            data-testid="card-focus-time"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-stone-800">{Math.round(TODAY_STATS.focusTime / 60 * 10) / 10}h</p>
            <p className="text-xs text-stone-500">Focus Time</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            data-testid="card-streak"
          >
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-stone-800">{TODAY_STATS.currentStreak}</p>
            <p className="text-xs text-stone-500">Day Streak</p>
          </motion.div>
        </div>

        {/* Completion Rate Ring */}
        <motion.div
          className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 mb-6 flex items-center gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          data-testid="card-completion-rate"
        >
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" stroke="#f5f5f4" strokeWidth="8" fill="transparent" />
              <motion.circle
                cx="40" cy="40" r="34"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-primary"
                strokeDasharray={2 * Math.PI * 34}
                strokeDashoffset={2 * Math.PI * 34 * (1 - completionRate / 100)}
                strokeLinecap="round"
                initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - completionRate / 100) }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-stone-800">{completionRate}%</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-stone-800">Weekly Completion</h3>
            <p className="text-sm text-stone-500 mt-0.5">{totalWeekBreaks} breaks taken, {totalWeekSkips} skipped</p>
            <p className="text-sm text-stone-500">{Math.round(totalWeekFocus / 60 * 10) / 10}h total focus this week</p>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-stone-100 rounded-xl p-1 mb-5">
          {([
            { key: "week" as TabType, label: "This Week" },
            { key: "patterns" as TabType, label: "Patterns" },
            { key: "achievements" as TabType, label: "Achievements" },
          ]).map(tab => (
            <button
              key={tab.key}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.key
                  ? "bg-white text-stone-800 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              )}
              onClick={() => setActiveTab(tab.key)}
              data-testid={`tab-${tab.key}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "week" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Weekly Bar Chart */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100" data-testid="chart-weekly">
              <h3 className="font-semibold text-stone-800 mb-1">Daily Breaks</h3>
              <p className="text-xs text-stone-400 mb-4">Taken vs. skipped this week</p>
              <div className="flex items-end gap-3 h-40">
                {SAMPLE_WEEKLY.map((day, i) => {
                  const total = day.breaks + day.skipped;
                  const takenH = (day.breaks / MAX_WEEKLY) * 100;
                  const skippedH = (day.skipped / MAX_WEEKLY) * 100;
                  const isToday = i === 0;
                  return (
                    <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex flex-col items-center justify-end h-32 relative">
                        <span className="text-[10px] text-stone-400 mb-1">{total}</span>
                        <motion.div
                          className="w-full flex flex-col items-stretch rounded-t-md overflow-hidden"
                          initial={{ height: 0 }}
                          animate={{ height: `${((takenH + skippedH) / 100) * 120}px` }}
                          transition={{ duration: 0.6, delay: i * 0.05 }}
                        >
                          {day.skipped > 0 && (
                            <div
                              className="bg-orange-300/60"
                              style={{ height: `${(skippedH / (takenH + skippedH)) * 100}%` }}
                            />
                          )}
                          <div
                            className={cn(
                              "flex-1",
                              isToday ? "bg-primary" : "bg-primary/60"
                            )}
                          />
                        </motion.div>
                      </div>
                      <span className={cn("text-xs", isToday ? "font-bold text-primary" : "text-stone-500")}>{day.day}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-stone-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-primary/60" />
                  <span className="text-xs text-stone-500">Breaks taken</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-orange-300/60" />
                  <span className="text-xs text-stone-500">Skipped</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100" data-testid="stat-avg-breaks">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-xs text-stone-500">Avg / Day</span>
                </div>
                <p className="text-xl font-bold text-stone-800">{TODAY_STATS.avgBreaksPerDay}</p>
                <p className="text-xs text-stone-400">breaks per day</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100" data-testid="stat-best-day">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="text-xs text-stone-500">Best Day</span>
                </div>
                <p className="text-xl font-bold text-stone-800">{TODAY_STATS.bestDay}</p>
                <p className="text-xs text-stone-400">16 breaks, 0 skips</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100" data-testid="stat-total-breaks">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-4 h-4 text-purple-500" />
                  <span className="text-xs text-stone-500">All-Time</span>
                </div>
                <p className="text-xl font-bold text-stone-800">{TODAY_STATS.totalBreaks}</p>
                <p className="text-xs text-stone-400">total breaks</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100" data-testid="stat-longest-streak">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="text-xs text-stone-500">Best Streak</span>
                </div>
                <p className="text-xl font-bold text-stone-800">{TODAY_STATS.longestStreak}</p>
                <p className="text-xs text-stone-400">days in a row</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "patterns" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Time of Day Distribution */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100" data-testid="chart-hourly">
              <h3 className="font-semibold text-stone-800 mb-1">Break Patterns by Hour</h3>
              <p className="text-xs text-stone-400 mb-4">When you typically take breaks (today)</p>
              <div className="flex items-end gap-1.5 h-28">
                {SAMPLE_HOURLY.map((slot, i) => {
                  const h = (slot.breaks / MAX_HOURLY) * 100;
                  const intensity = slot.breaks / MAX_HOURLY;
                  return (
                    <div key={slot.hour} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div
                        className="w-full rounded-t-sm"
                        style={{
                          backgroundColor: `rgba(107, 142, 95, ${0.2 + intensity * 0.8})`,
                        }}
                        initial={{ height: 0 }}
                        animate={{ height: `${(h / 100) * 96}px` }}
                        transition={{ duration: 0.5, delay: i * 0.03 }}
                      />
                      <span className="text-[9px] text-stone-400 -rotate-45 origin-center whitespace-nowrap">{slot.hour}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time Period Summary */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100" data-testid="card-time-periods">
              <h3 className="font-semibold text-stone-800 mb-3">Your Rhythms</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                    <Sunrise className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-stone-700">Morning (8-12)</span>
                      <span className="text-sm font-semibold text-stone-800">8 breaks</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-1.5 mt-1">
                      <motion.div className="bg-amber-400 h-1.5 rounded-full" initial={{ width: 0 }} animate={{ width: "73%" }} transition={{ duration: 0.8 }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Sun className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-stone-700">Afternoon (12-5)</span>
                      <span className="text-sm font-semibold text-stone-800">9 breaks</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-1.5 mt-1">
                      <motion.div className="bg-blue-400 h-1.5 rounded-full" initial={{ width: 0 }} animate={{ width: "82%" }} transition={{ duration: 0.8, delay: 0.1 }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                    <Moon className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-stone-700">Evening (5-10)</span>
                      <span className="text-sm font-semibold text-stone-800">2 breaks</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-1.5 mt-1">
                      <motion.div className="bg-indigo-400 h-1.5 rounded-full" initial={{ width: 0 }} animate={{ width: "18%" }} transition={{ duration: 0.8, delay: 0.2 }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-primary/5 to-blue-50 rounded-2xl p-5 border border-primary/10" data-testid="card-insights">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Coffee className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800 mb-1">Insight</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    You tend to skip more breaks on <strong>Thursdays</strong> - that's your busiest day. 
                    Try enabling Meeting Mode on heavy meeting days to keep reminders gentle.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "achievements" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-stone-500">
                {ACHIEVEMENTS.filter(a => a.earned).length} of {ACHIEVEMENTS.length} unlocked
              </p>
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold text-stone-700">{ACHIEVEMENTS.filter(a => a.earned).length}</span>
              </div>
            </div>

            {ACHIEVEMENTS.map((achievement, i) => (
              <motion.div
                key={achievement.id}
                className={cn(
                  "bg-white rounded-2xl p-4 shadow-sm border flex items-center gap-4 transition-all",
                  achievement.earned
                    ? "border-primary/20 bg-gradient-to-r from-primary/5 to-white"
                    : "border-stone-100 opacity-70"
                )}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: achievement.earned ? 1 : 0.7, x: 0 }}
                transition={{ delay: i * 0.04 }}
                data-testid={`achievement-${achievement.id}`}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                  achievement.earned
                    ? "bg-primary/10 text-primary"
                    : "bg-stone-100 text-stone-400"
                )}>
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={cn(
                      "font-semibold text-sm",
                      achievement.earned ? "text-stone-800" : "text-stone-500"
                    )}>{achievement.title}</h4>
                    {achievement.earned && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Earned</span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">{achievement.description}</p>
                  {!achievement.earned && achievement.progress !== undefined && achievement.total !== undefined && (
                    <div className="mt-2">
                      <div className="w-full bg-stone-100 rounded-full h-1.5">
                        <motion.div
                          className="bg-stone-300 h-1.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                          transition={{ duration: 0.6, delay: 0.3 + i * 0.04 }}
                        />
                      </div>
                      <p className="text-[10px] text-stone-400 mt-0.5">{achievement.progress} / {achievement.total}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
