import { useState, useCallback } from "react";

export type ReviewStep = "hidden" | "ask" | "positive" | "negative";

interface ReviewPromptState {
  dismissed: boolean;
  dismissCount: number;
  responded: boolean;
  breaksAtLastDismiss: number;
}

const INITIAL_THRESHOLD = 2; // DEMO: normally 5
const RE_TRIGGER_INTERVAL = 10;
const MAX_LIFETIME_ATTEMPTS = 3;

export function useReviewPrompt(totalBreaks: number, status: string, meetingMode: boolean) {
  const [reviewState, setReviewState] = useState<ReviewPromptState>({
    dismissed: false,
    dismissCount: 0,
    responded: false,
    breaksAtLastDismiss: 0,
  });
  const [step, setStep] = useState<ReviewStep>("hidden");

  const shouldShow = (): boolean => {
    if (reviewState.responded) return false;
    if (reviewState.dismissCount >= MAX_LIFETIME_ATTEMPTS) return false;
    if (status === "break" || meetingMode) return false;
    if (step === "positive" || step === "negative") return true;

    if (totalBreaks < INITIAL_THRESHOLD) return false;

    if (!reviewState.dismissed) return true;

    const breaksSinceDismiss = totalBreaks - reviewState.breaksAtLastDismiss;
    return breaksSinceDismiss >= RE_TRIGGER_INTERVAL;
  };

  const visible = shouldShow();

  const showPrompt = visible && step === "hidden" ? "ask" : step;
  const isVisible = visible && showPrompt !== "hidden";

  const handleThumbsUp = useCallback(() => {
    setStep("positive");
  }, []);

  const handleThumbsDown = useCallback(() => {
    setStep("negative");
  }, []);

  const handleDismiss = useCallback(() => {
    if (step === "positive" || step === "negative") {
      setReviewState(prev => ({ ...prev, responded: true }));
    } else {
      setReviewState(prev => ({
        ...prev,
        dismissed: true,
        dismissCount: prev.dismissCount + 1,
        breaksAtLastDismiss: totalBreaks,
      }));
    }
    setStep("hidden");
  }, [step, totalBreaks]);

  const handleStoreClick = useCallback(() => {
    setReviewState(prev => ({ ...prev, responded: true }));
    setStep("hidden");
  }, []);

  return {
    reviewStep: isVisible ? showPrompt : ("hidden" as ReviewStep),
    onThumbsUp: handleThumbsUp,
    onThumbsDown: handleThumbsDown,
    onDismissReview: handleDismiss,
    onStoreClick: handleStoreClick,
    reviewState,
  };
}
