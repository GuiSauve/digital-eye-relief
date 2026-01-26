import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Settings } from "../client/src/components/extension/Settings";
import "../client/src/index.css";

function OptionsApp() {
  const [settings, setSettings] = useState({
    focusDuration: 20,
    breakDuration: 20,
    soundEnabled: true,
    soundVolume: 70,
    notificationType: "badge" as const,
    meetingMode: false,
    meetingModeAutoDisableMinutes: 0,
  });

  const [saved, setSaved] = useState(false);

  // Load settings from Chrome Storage (always coerce notificationType to badge)
  useEffect(() => {
    chrome.storage.sync.get(["settings"], (result: { settings?: typeof settings }) => {
      if (result.settings) {
        setSettings({
          focusDuration: result.settings.focusDuration ?? 20,
          breakDuration: result.settings.breakDuration ?? 20,
          soundEnabled: result.settings.soundEnabled ?? true,
          soundVolume: result.settings.soundVolume ?? 70,
          notificationType: "badge" as const,
          meetingMode: result.settings.meetingMode ?? false,
          meetingModeAutoDisableMinutes: result.settings.meetingModeAutoDisableMinutes ?? 0,
        });
      }
    });
  }, []);

  const handleUpdateSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    chrome.storage.sync.set({ settings: newSettings }, () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  const handleBack = () => {
    window.close();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <Settings
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onBack={handleBack}
        />
        {saved && (
          <div className="mt-4 p-4 bg-primary/10 text-primary rounded-lg text-center font-semibold">
            Settings saved successfully!
          </div>
        )}
      </div>
    </div>
  );
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<OptionsApp />);
}
