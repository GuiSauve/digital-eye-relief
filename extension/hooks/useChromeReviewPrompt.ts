import { useState, useEffect, useCallback } from "react";

export type ReviewStep = "hidden" | "ask" | "positive" | "negative";

interface ReviewPromptState {
  dismissed: boolean;
  dismissCount: number;
  responded: boolean;
  breaksAtLastDismiss: number;
  pendingStep: ReviewStep;
}

const INITIAL_THRESHOLD = 5;
const RE_TRIGGER_INTERVAL = 10;
const MAX_LIFETIME_ATTEMPTS = 3;
const STORAGE_KEY = "reviewPromptState";

const DEFAULT_STATE: ReviewPromptState = {
  dismissed: false,
  dismissCount: 0,
  responded: false,
  breaksAtLastDismiss: 0,
  pendingStep: "hidden",
};

export function useChromeReviewPrompt(totalBreaks: number, status: string, meetingMode: boolean) {
  const [reviewState, setReviewState] = useState<ReviewPromptState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get([STORAGE_KEY], (result: Record<string, ReviewPromptState>) => {
      if (result[STORAGE_KEY]) {
        setReviewState(result[STORAGE_KEY]);
      }
      setLoaded(true);
    });

    const handleStorageChange = (changes: { [key: string]: { newValue?: unknown } }) => {
      if (changes[STORAGE_KEY]?.newValue) {
        setReviewState(changes[STORAGE_KEY].newValue as ReviewPromptState);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  const persistState = useCallback((newState: ReviewPromptState) => {
    setReviewState(newState);
    chrome.storage.sync.set({ [STORAGE_KEY]: newState });
  }, []);

  const step = reviewState.pendingStep;

  const shouldShow = (): boolean => {
    if (!loaded) return false;
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
    persistState({ ...reviewState, pendingStep: "positive" });
  }, [reviewState, persistState]);

  const handleThumbsDown = useCallback(() => {
    persistState({ ...reviewState, pendingStep: "negative" });
  }, [reviewState, persistState]);

  const handleDismiss = useCallback(() => {
    if (step === "positive" || step === "negative") {
      persistState({ ...reviewState, responded: true, pendingStep: "hidden" });
    } else {
      persistState({
        ...reviewState,
        dismissed: true,
        dismissCount: reviewState.dismissCount + 1,
        breaksAtLastDismiss: totalBreaks,
        pendingStep: "hidden",
      });
    }
  }, [step, totalBreaks, reviewState, persistState]);

  const handleStoreClick = useCallback(() => {
    persistState({ ...reviewState, responded: true, pendingStep: "hidden" });
  }, [reviewState, persistState]);

  return {
    reviewStep: isVisible ? showPrompt : ("hidden" as ReviewStep),
    onThumbsUp: handleThumbsUp,
    onThumbsDown: handleThumbsDown,
    onDismissReview: handleDismiss,
    onStoreClick: handleStoreClick,
  };
}
