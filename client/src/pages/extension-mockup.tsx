import { useState } from "react";
import { Popup } from "@/components/extension/Popup";
import { Settings } from "@/components/extension/Settings";
import { NotificationOverlay } from "@/components/extension/NotificationOverlay";
import { useExtensionTimer } from "@/hooks/use-extension-timer";
import generatedImage from '@assets/generated_images/soft_abstract_gradient_with_calming_sage_and_blue_tones.png';
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";

export function ExtensionMockup() {
  const [view, setView] = useState<"popup" | "settings">("popup");
  const {
    status,
    timeLeft,
    progress,
    formatTime,
    startFocus,
    pauseTimer,
    resetTimer,
    skipBreak,
    settings,
    setSettings
  } = useExtensionTimer();

  // Show notification overlay when in break mode and using modal style
  const showOverlay = status === "break" && settings.notificationType === "modal";

  return (
    <div className="min-h-screen w-full bg-stone-100 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Mockup Context */}
      <div 
        className="absolute inset-0 opacity-30 z-0 pointer-events-none"
        style={{
            backgroundImage: `url(${generatedImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}
      />
      
      <div className="z-10 flex flex-col items-center gap-8 max-w-6xl w-full">
        
        <div className="text-center space-y-4 mb-2">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-stone-800 tracking-tight">Digital Eye Relief</h1>
          <p className="text-stone-600 max-w-lg mx-auto text-lg leading-relaxed">
            A chrome extension to help you reduce eye strain. <br/>
            <span className="text-sm text-stone-500">Below is a fully interactive mockup of the extension interface.</span>
          </p>
        </div>

        {/* Browser Mockup Container */}
        <div className="relative w-full max-w-[360px] shadow-2xl rounded-2xl overflow-hidden border border-stone-200 bg-white">
            
            {/* Mock Browser Toolbar */}
            <div className="bg-stone-100 border-b border-stone-200 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-md px-3 py-1.5 text-xs text-stone-400 flex-1 mr-4">
                    <div className="w-3 h-3 rounded-full bg-stone-200" />
                    <span>chrome://extensions</span>
                </div>
                
                {/* Extension Icon with Badge */}
                <div className="relative group cursor-pointer p-1 hover:bg-stone-200 rounded transition-colors" onClick={() => setView("popup")}>
                    <div className="w-6 h-6 text-stone-600 flex items-center justify-center">
                        <Eye className="w-5 h-5" />
                    </div>
                    
                    {/* Badge */}
                    {(status === 'focus' || status === 'break') && (
                        <div className={cn(
                            "absolute -bottom-1 -right-1 text-[9px] font-bold px-1 rounded-sm min-w-[14px] text-center shadow-sm",
                            status === 'break' ? "bg-blue-500 text-white" : "bg-primary text-white"
                        )}>
                            {status === 'break' ? '!' : Math.ceil(timeLeft / 60)}
                        </div>
                    )}
                </div>
            </div>

            {/* Extension Content */}
            <div className="relative h-[500px] bg-white">
                {view === "popup" ? (
                <Popup
                    status={status}
                    timeLeft={timeLeft}
                    progress={progress}
                    formatTime={formatTime}
                    onStart={startFocus}
                    onPause={pauseTimer}
                    onReset={resetTimer}
                    onOpenSettings={() => setView("settings")}
                />
                ) : (
                <Settings
                    settings={settings}
                    onUpdateSettings={setSettings}
                    onBack={() => setView("popup")}
                />
                )}
            </div>
        </div>
      </div>

      {/* Overlay Notification - Renders full screen over the mockup page */}
      <NotificationOverlay
        isOpen={showOverlay}
        timeLeft={timeLeft}
        totalTime={settings.breakDuration}
        onClose={skipBreak}
      />
    </div>
  );
}
