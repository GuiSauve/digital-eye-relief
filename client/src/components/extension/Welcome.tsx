import { motion } from "framer-motion";
import { Eye, Sparkles, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeProps {
  onGetStarted: () => void;
}

export function Welcome({ onGetStarted }: WelcomeProps) {
  return (
    <div className="w-full h-[500px] bg-gradient-to-b from-green-50 to-white flex flex-col overflow-hidden relative font-sans">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 mb-6"
        >
          <Eye className="w-10 h-10" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-display font-bold text-foreground mb-2"
        >
          Welcome to Digital Eye Relief
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-sm max-w-[280px] mb-8"
        >
          Protect your eyes with the 20-20-20 rule. Every 20 minutes, look at something 20 feet away for 20 seconds.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3 w-full max-w-[260px] mb-8"
        >
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-border/50">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <p className="text-sm text-foreground text-left">Gentle reminders to rest your eyes</p>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-border/50">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Heart className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-sm text-foreground text-left">Build healthy screen habits daily</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            size="lg"
            className="px-8 py-6 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 gap-2"
            onClick={onGetStarted}
            data-testid="button-get-started"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>

      <div className="p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Your eyes will thank you
        </p>
      </div>
    </div>
  );
}
