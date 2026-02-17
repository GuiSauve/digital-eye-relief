import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useExtensionI18n, getExtensionMessage } from "../use-extension-i18n";

const SUPPORTED_LANGUAGES = ["en", "es", "fr", "de"];

const REQUIRED_KEYS = [
  "focus", "break", "paused", "start", "pause", "reset", "skip", "resume",
  "settings", "focusDuration", "breakDuration", "minutes", "seconds",
  "soundSettings", "enableSounds", "volume",
  "meetingMode", "meetingModeDesc", "meetingModeActive", "meetingModeActiveDesc",
  "autoDisable", "never",
  "notifications", "enableNotifications",
  "todayStats", "breaksCompleted", "totalBreakTime",
  "save", "cancel", "close",
  "digitalEyeRelief", "protectYourEyes",
  "ready", "relaxEyes", "focusing",
  "today", "breaks", "breakSingular", "streak", "days", "daySingular",
  "timerIntervals", "soundEffects", "preview",
  "breakStarts", "breakEnds",
  "meetingModeInfo", "manual", "autoDisableInfo",
  "workspaceSetupTips",
  "screenPosition", "screenPositionDesc",
  "lighting", "lightingDesc",
  "posture", "postureDesc",
  "blinking", "blinkingDesc",
  "meetingModeSoundsMuted", "meetingModeOn", "enableMeetingMode",
  "min", "sec",
  "reviewEnjoyingApp", "reviewThanksPositive", "reviewThanksNegative",
  "reviewRateStore", "reviewLeaveFeedback",
];

describe("useExtensionI18n", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Translation completeness", () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      it(`has all required keys for ${lang}`, () => {
        const { result } = renderHook(() => useExtensionI18n(lang));
        const missing: string[] = [];

        for (const key of REQUIRED_KEYS) {
          const value = result.current.t(key);
          if (!value || value.length === 0) {
            missing.push(key);
          }
        }

        expect(missing).toEqual([]);
      });
    }

    it("non-English languages have translated values (not just English fallbacks)", () => {
      const { result: enResult } = renderHook(() => useExtensionI18n("en"));
      for (const lang of ["es", "fr", "de"]) {
        const { result } = renderHook(() => useExtensionI18n(lang));
        const sameAsEnglish: string[] = [];
        const coreKeys = ["focus", "break", "paused", "start", "reset", "settings", "ready"];
        for (const key of coreKeys) {
          if (result.current.t(key) === enResult.current.t(key)) {
            sameAsEnglish.push(`${lang}:${key}`);
          }
        }
        expect(sameAsEnglish).toEqual([]);
      }
    });
  });

  describe("Translation values", () => {
    it("returns English translations by default", () => {
      const { result } = renderHook(() => useExtensionI18n("en"));
      expect(result.current.t("focus")).toBe("Focus");
      expect(result.current.t("break")).toBe("Break");
      expect(result.current.t("paused")).toBe("Paused");
    });

    it("returns Spanish translations", () => {
      const { result } = renderHook(() => useExtensionI18n("es"));
      expect(result.current.t("focus")).toBe("Enfoque");
      expect(result.current.t("break")).toBe("Descanso");
    });

    it("returns French translations", () => {
      const { result } = renderHook(() => useExtensionI18n("fr"));
      expect(result.current.t("focus")).toBe("Concentration");
      expect(result.current.t("break")).toBe("Pause");
    });

    it("returns German translations", () => {
      const { result } = renderHook(() => useExtensionI18n("de"));
      expect(result.current.t("focus")).toBe("Fokus");
      expect(result.current.t("break")).toBe("Pause");
    });
  });

  describe("Fallback behavior", () => {
    it("falls back to English for unsupported language", () => {
      const { result } = renderHook(() => useExtensionI18n("ja"));
      expect(result.current.t("focus")).toBe("Focus");
    });

    it("returns key name for completely unknown keys", () => {
      const { result } = renderHook(() => useExtensionI18n("en"));
      expect(result.current.t("nonexistentKey")).toBe("nonexistentKey");
    });
  });

  describe("Singular/plural keys", () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      it(`has distinct singular and plural for breaks in ${lang}`, () => {
        const { result } = renderHook(() => useExtensionI18n(lang));
        const plural = result.current.t("breaks");
        const singular = result.current.t("breakSingular");
        expect(plural.length).toBeGreaterThan(0);
        expect(singular.length).toBeGreaterThan(0);
        expect(plural).not.toBe(singular);
      });

      it(`has distinct singular and plural for days in ${lang}`, () => {
        const { result } = renderHook(() => useExtensionI18n(lang));
        const plural = result.current.t("days");
        const singular = result.current.t("daySingular");
        expect(plural.length).toBeGreaterThan(0);
        expect(singular.length).toBeGreaterThan(0);
        expect(plural).not.toBe(singular);
      });
    }
  });

  describe("getExtensionMessage function", () => {
    it("returns translation for known keys", () => {
      const result = getExtensionMessage("focus");
      expect(result).toBeTruthy();
      expect(result).not.toBe("focus");
    });

    it("returns key name for unknown keys", () => {
      const result = getExtensionMessage("unknownKey123");
      expect(result).toBe("unknownKey123");
    });
  });
});
