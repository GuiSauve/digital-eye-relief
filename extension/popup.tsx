import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Popup } from "../client/src/components/extension/Popup";
import { Welcome } from "../client/src/components/extension/Welcome";
import { useChromeExtensionTimer } from "./hooks/useChromeExtensionTimer";
import "../client/src/index.css";

function PopupApp() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    status,
    timeLeft,
    progress,
    formatTime,
    startFocus,
    pauseTimer,
    resetTimer,
    toggleMeetingMode,
    stats,
    meetingMode,
  } = useChromeExtensionTimer();

  useEffect(() => {
    chrome.storage.sync.get(["hasSeenWelcome"], (result) => {
      if (!result.hasSeenWelcome) {
        setShowWelcome(true);
      }
      setIsLoading(false);
    });
  }, []);

  const handleGetStarted = () => {
    chrome.storage.sync.set({ hasSeenWelcome: true });
    setShowWelcome(false);
  };

  const handleOpenSettings = () => {
    chrome.runtime.openOptionsPage();
  };

  if (isLoading) {
    return <div className="w-[360px] h-[500px] bg-white" />;
  }

  if (showWelcome) {
    return (
      <div className="w-[360px]">
        <Welcome onGetStarted={handleGetStarted} />
      </div>
    );
  }

  return (
    <div className="w-[360px] h-[520px]">
      <Popup
        status={status}
        timeLeft={timeLeft}
        progress={progress}
        formatTime={formatTime}
        onStart={startFocus}
        onPause={pauseTimer}
        onReset={resetTimer}
        onOpenSettings={handleOpenSettings}
        stats={stats}
        meetingMode={meetingMode}
        onToggleMeetingMode={toggleMeetingMode}
      />
    </div>
  );
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<PopupApp />);
}
