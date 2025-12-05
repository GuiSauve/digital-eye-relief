import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Settings } from "../client/src/components/extension/Settings";
import "../client/src/index.css";

function OptionsApp() {
  const [settings, setSettings] = useState({
    focusDuration: 20,
    breakDuration: 20,
    soundEnabled: true,
    notificationType: "badge" as "modal" | "badge",
  });

  const [saved, setSaved] = useState(false);

  // Load settings from Chrome Storage
  useEffect(() => {
    chrome.storage.sync.get(["settings"], (result) => {
      if (result.settings) {
        setSettings(result.settings);
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
