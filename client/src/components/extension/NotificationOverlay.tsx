import { motion, AnimatePresence } from "framer-motion";
import { Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationOverlayProps {
  isOpen: boolean;
  timeLeft: number;
  totalTime: number;
  onClose: () => void;
}

export function NotificationOverlay({ isOpen, timeLeft, totalTime, onClose }: NotificationOverlayProps) {
  const progress = (timeLeft / totalTime) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-background w-full max-w-lg p-8 rounded-3xl shadow-2xl text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-secondary">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: "100%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>

            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                <Eye className="w-12 h-12 text-blue-600" />
              </div>
            </div>

            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Look away for 20 seconds
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
              Focus on something at least 20 feet (6 meters) away to relax your eye muscles.
            </p>

            <div className="flex flex-col items-center gap-2">
              <span className="text-6xl font-mono font-bold text-primary tabular-nums">
                {timeLeft}
              </span>
              <span className="text-sm text-muted-foreground uppercase tracking-widest">seconds remaining</span>
            </div>

            {timeLeft <= 0 && (
               <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="mt-8"
               >
                 <Button 
                    size="lg" 
                    className="w-full max-w-xs bg-primary hover:bg-primary/90 text-white text-lg h-14 rounded-xl"
                    onClick={onClose}
                  >
                   I'm back!
                 </Button>
               </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
