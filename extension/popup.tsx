import React from "react";
import { createRoot } from "react-dom/client";
import { Popup } from "../client/src/components/extension/Popup";
import { useChromeExtensionTimer } from "./hooks/useChromeExtensionTimer";
import "../client/src/index.css";

function PopupApp() {
  const {
    status,
    timeLeft,
    progress,
    formatTime,
    startFocus,
    pauseTimer,
    resetTimer,
  } = useChromeExtensionTimer();

  const handleOpenSettings = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="w-[360px]">
      <Popup
        status={status}
        timeLeft={timeLeft}
        progress={progress}
        formatTime={formatTime}
        onStart={startFocus}
        onPause={pauseTimer}
        onReset={resetTimer}
        onOpenSettings={handleOpenSettings}
      />
    </div>
  );
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<PopupApp />);
}
