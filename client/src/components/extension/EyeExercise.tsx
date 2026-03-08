import { motion } from "framer-motion";
import { Eye, RotateCcw, Move, Maximize2, Hand, Sun, Focus, Scan } from "lucide-react";

interface Exercise {
  id: number;
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
  titleFallback: string;
  descFallback: string;
}

const exercises: Exercise[] = [
  {
    id: 0,
    icon: <Eye className="w-5 h-5" />,
    titleKey: "exercisePalming",
    descKey: "exercisePalmingDesc",
    titleFallback: "Palming",
    descFallback: "Rub your hands together to warm them, then gently cup your closed eyes for 30 seconds. The warmth relaxes eye muscles and relieves tension.",
  },
  {
    id: 1,
    icon: <RotateCcw className="w-5 h-5" />,
    titleKey: "exerciseFigureEight",
    descKey: "exerciseFigureEightDesc",
    titleFallback: "Figure Eight",
    descFallback: "Imagine a giant figure 8 on the floor about 10 feet away. Trace it slowly with your eyes for 30 seconds, then reverse direction.",
  },
  {
    id: 2,
    icon: <Move className="w-5 h-5" />,
    titleKey: "exerciseEyeRolls",
    descKey: "exerciseEyeRollsDesc",
    titleFallback: "Eye Rolls",
    descFallback: "Look up, then slowly rotate your eyes clockwise in a full circle. Repeat 5 times, then switch to counter-clockwise.",
  },
  {
    id: 3,
    icon: <Focus className="w-5 h-5" />,
    titleKey: "exerciseNearFar",
    descKey: "exerciseNearFarDesc",
    titleFallback: "Near-Far Focus",
    descFallback: "Hold a finger 6 inches from your face. Focus on it, then shift focus to something 20+ feet away. Alternate 10 times.",
  },
  {
    id: 4,
    icon: <Maximize2 className="w-5 h-5" />,
    titleKey: "exerciseBlinkBreak",
    descKey: "exerciseBlinkBreakDesc",
    titleFallback: "Blink Break",
    descFallback: "Close your eyes gently for 2 seconds, then open. Repeat 20 times. This refreshes the tear film and reduces dryness.",
  },
  {
    id: 5,
    icon: <Scan className="w-5 h-5" />,
    titleKey: "exercisePeripheral",
    descKey: "exercisePeripheralDesc",
    titleFallback: "Peripheral Awareness",
    descFallback: "Stare straight ahead. Without moving your eyes, notice objects at the edges of your vision. Hold for 10 seconds, then relax.",
  },
  {
    id: 6,
    icon: <Hand className="w-5 h-5" />,
    titleKey: "exerciseTemple",
    descKey: "exerciseTempleDesc",
    titleFallback: "Temple Massage",
    descFallback: "Gently massage your temples in small circles for 20 seconds. This increases blood flow and relieves eye strain headaches.",
  },
];

interface WellnessTip {
  id: number;
  titleKey: string;
  descKey: string;
  titleFallback: string;
  descFallback: string;
}

const wellnessTips: WellnessTip[] = [
  {
    id: 0,
    titleKey: "tipHydration",
    descKey: "tipHydrationDesc",
    titleFallback: "Stay Hydrated",
    descFallback: "Dehydration contributes to dry eyes. Aim for 8 glasses of water throughout the day.",
  },
  {
    id: 1,
    titleKey: "tipMonitorDistance",
    descKey: "tipMonitorDistanceDesc",
    titleFallback: "Monitor Distance",
    descFallback: "Keep your screen 20-28 inches (50-70cm) from your eyes, with the top of the screen at or slightly below eye level.",
  },
  {
    id: 2,
    titleKey: "tipLighting",
    descKey: "tipLightingDesc",
    titleFallback: "Room Lighting",
    descFallback: "Match your screen brightness to ambient light. Avoid working in complete darkness with a bright screen.",
  },
  {
    id: 3,
    titleKey: "tipBlueLight",
    descKey: "tipBlueLightDesc",
    titleFallback: "Blue Light",
    descFallback: "Enable night mode on your devices in the evening. Blue light can disrupt sleep and increase eye fatigue.",
  },
  {
    id: 4,
    titleKey: "tipTextSize",
    descKey: "tipTextSizeDesc",
    titleFallback: "Text Size",
    descFallback: "Increase your default text size if you find yourself leaning forward. Squinting strains your eye muscles.",
  },
  {
    id: 5,
    titleKey: "tipFreshAir",
    descKey: "tipFreshAirDesc",
    titleFallback: "Fresh Air Break",
    descFallback: "Step outside for 5 minutes during breaks. Natural light helps regulate your eyes and boost mood.",
  },
  {
    id: 6,
    titleKey: "tipEyeDrops",
    descKey: "tipEyeDropsDesc",
    titleFallback: "Artificial Tears",
    descFallback: "Keep preservative-free eye drops nearby. A drop or two can quickly relieve dryness from extended screen use.",
  },
];

const quotes = [
  { text: "The eyes indicate the antiquity of the soul.", author: "Ralph Waldo Emerson" },
  { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
  { text: "Health is not valued till sickness comes.", author: "Thomas Fuller" },
  { text: "Rest when you're weary. Refresh and renew yourself.", author: "Ralph Marston" },
  { text: "Almost everything will work again if you unplug it for a few minutes.", author: "Anne Lamott" },
  { text: "Your calm mind is the ultimate weapon against your challenges.", author: "Bryant McGill" },
  { text: "The greatest wealth is health.", author: "Virgil" },
];

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getExerciseOfDay(): Exercise {
  return exercises[getDayOfYear() % exercises.length];
}

export function getTipOfDay(): WellnessTip {
  return wellnessTips[(getDayOfYear() + 3) % wellnessTips.length];
}

export function getQuoteOfDay() {
  return quotes[(getDayOfYear() + 1) % quotes.length];
}

interface EyeExerciseCardProps {
  t: (key: string) => string;
}

export function EyeExerciseCard({ t }: EyeExerciseCardProps) {
  const exercise = getExerciseOfDay();
  const title = t(exercise.titleKey);
  const desc = t(exercise.descKey);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-sm"
      data-testid="card-eye-exercise"
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          {exercise.icon}
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("exerciseOfDay")}
          </p>
          <h3 className="font-display font-bold text-foreground">{title}</h3>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}

export function WellnessTipCard({ t }: EyeExerciseCardProps) {
  const tip = getTipOfDay();
  const title = t(tip.titleKey);
  const desc = t(tip.descKey);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-sm"
      data-testid="card-wellness-tip"
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
          <Sun className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("wellnessTip")}
          </p>
          <h3 className="font-display font-bold text-foreground">{title}</h3>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}

export function QuoteCard() {
  const quote = getQuoteOfDay();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="text-center mt-4"
      data-testid="card-quote"
    >
      <p className="text-sm italic text-foreground/60">"{quote.text}"</p>
      <p className="text-xs text-foreground/40 mt-1">— {quote.author}</p>
    </motion.div>
  );
}
