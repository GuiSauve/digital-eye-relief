import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useReviewPrompt } from "../use-review-prompt";

describe("useReviewPrompt", () => {
  describe("Visibility rules", () => {
    it("is hidden when totalBreaks < 5", () => {
      const { result } = renderHook(() => useReviewPrompt(3, "idle", false));
      expect(result.current.reviewStep).toBe("hidden");
    });

    it("shows ask step when totalBreaks >= 5 and idle", () => {
      const { result } = renderHook(() => useReviewPrompt(5, "idle", false));
      expect(result.current.reviewStep).toBe("ask");
    });

    it("shows ask step when totalBreaks >= 5 and focus", () => {
      const { result } = renderHook(() => useReviewPrompt(5, "focus", false));
      expect(result.current.reviewStep).toBe("ask");
    });

    it("is hidden during break", () => {
      const { result } = renderHook(() => useReviewPrompt(10, "break", false));
      expect(result.current.reviewStep).toBe("hidden");
    });

    it("is hidden during meeting mode", () => {
      const { result } = renderHook(() => useReviewPrompt(10, "idle", true));
      expect(result.current.reviewStep).toBe("hidden");
    });
  });

  describe("Thumbs up flow", () => {
    it("shows positive step after thumbs up", () => {
      const { result } = renderHook(() => useReviewPrompt(5, "idle", false));
      act(() => { result.current.onThumbsUp(); });
      expect(result.current.reviewStep).toBe("positive");
    });

    it("hides permanently after dismissing positive step", () => {
      const { result } = renderHook(() => useReviewPrompt(5, "idle", false));
      act(() => { result.current.onThumbsUp(); });
      act(() => { result.current.onDismissReview(); });
      expect(result.current.reviewStep).toBe("hidden");
      expect(result.current.reviewState.responded).toBe(true);
    });

    it("hides permanently after clicking store link", () => {
      const { result } = renderHook(() => useReviewPrompt(5, "idle", false));
      act(() => { result.current.onThumbsUp(); });
      act(() => { result.current.onStoreClick(); });
      expect(result.current.reviewStep).toBe("hidden");
      expect(result.current.reviewState.responded).toBe(true);
    });
  });

  describe("Thumbs down flow", () => {
    it("shows negative step after thumbs down", () => {
      const { result } = renderHook(() => useReviewPrompt(5, "idle", false));
      act(() => { result.current.onThumbsDown(); });
      expect(result.current.reviewStep).toBe("negative");
    });

    it("hides permanently after dismissing negative step", () => {
      const { result } = renderHook(() => useReviewPrompt(5, "idle", false));
      act(() => { result.current.onThumbsDown(); });
      act(() => { result.current.onDismissReview(); });
      expect(result.current.reviewStep).toBe("hidden");
      expect(result.current.reviewState.responded).toBe(true);
    });
  });

  describe("Dismiss behavior", () => {
    it("dismissing ask step increments dismiss count", () => {
      const { result } = renderHook(() => useReviewPrompt(5, "idle", false));
      expect(result.current.reviewStep).toBe("ask");
      act(() => { result.current.onDismissReview(); });
      expect(result.current.reviewStep).toBe("hidden");
      expect(result.current.reviewState.dismissCount).toBe(1);
      expect(result.current.reviewState.responded).toBe(false);
    });

    it("stays hidden after dismiss until 10 more breaks", () => {
      const { result, rerender } = renderHook(
        ({ breaks }) => useReviewPrompt(breaks, "idle", false),
        { initialProps: { breaks: 5 } }
      );
      act(() => { result.current.onDismissReview(); });
      expect(result.current.reviewStep).toBe("hidden");

      rerender({ breaks: 10 });
      expect(result.current.reviewStep).toBe("hidden");

      rerender({ breaks: 15 });
      expect(result.current.reviewStep).toBe("ask");
    });

    it("stops showing after 3 lifetime dismissals", () => {
      const { result, rerender } = renderHook(
        ({ breaks }) => useReviewPrompt(breaks, "idle", false),
        { initialProps: { breaks: 5 } }
      );

      act(() => { result.current.onDismissReview(); });
      rerender({ breaks: 15 });
      expect(result.current.reviewStep).toBe("ask");

      act(() => { result.current.onDismissReview(); });
      rerender({ breaks: 25 });
      expect(result.current.reviewStep).toBe("ask");

      act(() => { result.current.onDismissReview(); });
      expect(result.current.reviewState.dismissCount).toBe(3);

      rerender({ breaks: 35 });
      expect(result.current.reviewStep).toBe("hidden");
    });
  });
});
