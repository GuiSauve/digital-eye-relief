import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, X, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExtensionI18n } from "@/hooks/use-extension-i18n";
import type { ReviewStep } from "@/hooks/use-review-prompt";

interface ReviewPromptProps {
  step: ReviewStep;
  onThumbsUp: () => void;
  onThumbsDown: () => void;
  onDismiss: () => void;
  onStoreClick: () => void;
  language?: string;
  storeUrl?: string;
}

const CHROME_STORE_URL = "https://chromewebstore.google.com/detail/digital-eye-relief/dpolekhjjdagbjlohnpogappckndikin";

export function ReviewPrompt({
  step,
  onThumbsUp,
  onThumbsDown,
  onDismiss,
  onStoreClick,
  language,
  storeUrl = CHROME_STORE_URL,
}: ReviewPromptProps) {
  const { t } = useExtensionI18n(language);

  if (step === "hidden") return null;

  const handleStoreLink = () => {
    window.open(storeUrl, "_blank");
    onStoreClick();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="mx-4 mb-3 px-3 py-2.5 bg-green-50 border border-green-200/60 rounded-lg" data-testid="review-prompt">
          <div className="flex items-center justify-between gap-2">
            {step === "ask" && (
              <>
                <span className="text-xs text-green-800 font-medium flex-1">
                  {t("reviewEnjoyingApp")}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7 rounded-full text-green-700 hover:bg-green-200/60 hover:text-green-800"
                    onClick={onThumbsUp}
                    data-testid="button-thumbs-up"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7 rounded-full text-green-700 hover:bg-green-200/60 hover:text-green-800"
                    onClick={onThumbsDown}
                    data-testid="button-thumbs-down"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 rounded-full text-green-500 hover:bg-green-200/60 hover:text-green-700"
                    onClick={onDismiss}
                    data-testid="button-dismiss-review"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </>
            )}

            {step === "positive" && (
              <>
                <span className="text-xs text-green-800 font-medium flex-1">
                  {t("reviewThanksPositive")}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs rounded-full text-green-700 hover:bg-green-200/60 hover:text-green-800 gap-1"
                    onClick={handleStoreLink}
                    data-testid="button-rate-store"
                  >
                    <Star className="w-3 h-3" />
                    {t("reviewRateStore")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 rounded-full text-green-500 hover:bg-green-200/60 hover:text-green-700"
                    onClick={onDismiss}
                    data-testid="button-dismiss-review"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </>
            )}

            {step === "negative" && (
              <>
                <span className="text-xs text-green-800 font-medium flex-1">
                  {t("reviewThanksNegative")}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs rounded-full text-green-700 hover:bg-green-200/60 hover:text-green-800 gap-1"
                    onClick={handleStoreLink}
                    data-testid="button-feedback-store"
                  >
                    <MessageCircle className="w-3 h-3" />
                    {t("reviewLeaveFeedback")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 rounded-full text-green-500 hover:bg-green-200/60 hover:text-green-700"
                    onClick={onDismiss}
                    data-testid="button-dismiss-review"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
