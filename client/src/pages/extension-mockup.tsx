import { useState } from "react";
import { Popup } from "@/components/extension/Popup";
import { Settings } from "@/components/extension/Settings";
import { NotificationOverlay } from "@/components/extension/NotificationOverlay";
import { useExtensionTimer } from "@/hooks/use-extension-timer";
import { useReviewPrompt } from "@/hooks/use-review-prompt";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import generatedImage from '@assets/generated_images/soft_abstract_gradient_with_calming_sage_and_blue_tones.png';
import { cn } from "@/lib/utils";
import { Eye, Chrome, Timer, Bell, Volume2, Sparkles, Heart, Shield, ArrowDown, HelpCircle, ChevronDown, FileText } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function ExtensionMockup() {
  const [view, setView] = useState<"popup" | "settings">("popup");
  const { language, t } = useLanguage();
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
    setSettings,
    stats,
    meetingMode,
    toggleMeetingMode,
    pausedFrom,
  } = useExtensionTimer();

  const {
    reviewStep,
    onThumbsUp,
    onThumbsDown,
    onDismissReview,
    onStoreClick,
  } = useReviewPrompt(stats.totalBreaks, status, meetingMode);

  const showOverlay = false; // Modal overlay disabled - badge notifications only

  const scrollToDemo = () => {
    document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const getPrivacyPath = () => language === 'en' ? '/privacy' : `/${language}/privacy`;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-stone-50 to-stone-100 relative overflow-x-hidden">
      {/* Language Selector - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-20 z-0 pointer-events-none"
          style={{
            backgroundImage: `url(${generatedImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Floating Elements */}
        <motion.div 
          className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-2xl"
          animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-40 right-20 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
        
        <div className="z-10 text-center w-full max-w-4xl mx-auto space-y-8 px-6">
          {/* Logo */}
          <motion.div 
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
              <Eye className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          {/* Tagline */}
          <motion.h1 
            className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-display font-bold text-stone-800 tracking-tight leading-tight w-full break-words"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t.hero.tagline1}
            <br />
            <span className="text-primary">{t.hero.tagline2}</span>
          </motion.h1>
          
          <motion.p 
            className="text-base sm:text-lg md:text-2xl text-stone-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t.hero.description}
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <a 
              href="https://chromewebstore.google.com/detail/digital-eye-relief/dpolekhjjdagbjlohnpogappckndikin"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button 
                size="lg" 
                className="h-auto min-h-[3.5rem] px-6 sm:px-8 py-3 text-base sm:text-lg rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30 transition-all w-full sm:w-auto whitespace-normal"
                data-testid="button-add-to-chrome"
              >
                <Chrome className="w-5 h-5 mr-2 flex-shrink-0" />
                {t.hero.addToChrome}
              </Button>
            </a>
            <Button 
              size="lg" 
              variant="outline"
              className="h-auto min-h-[3.5rem] px-6 sm:px-8 py-3 text-base sm:text-lg rounded-full border-2 hover:bg-stone-100 w-full sm:w-auto whitespace-normal"
              onClick={scrollToDemo}
              data-testid="button-try-demo"
            >
              {t.hero.tryDemo}
            </Button>
          </motion.div>
          
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-6 h-6 text-stone-400" />
        </motion.div>
      </section>

      {/* What is 20-20-20 Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-stone-800 mb-4">
              {t.science.title}
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              {t.science.description.split('{aoa}')[0]}
              <a href="https://www.aoa.org/healthy-eyes/eye-and-vision-conditions/computer-vision-syndrome" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">{t.science.aoaName}</a>
              {t.science.description.split('{aoa}')[1]}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center p-8 bg-gradient-to-br from-stone-50 to-white rounded-3xl border border-stone-100 shadow-lg"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold text-primary">20</span>
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">{t.science.minutes}</h3>
              <p className="text-stone-600">{t.science.minutesDesc}</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-8 bg-gradient-to-br from-stone-50 to-white rounded-3xl border border-stone-100 shadow-lg"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-20 h-20 bg-blue-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold text-blue-500">20</span>
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">{t.science.feetAway}</h3>
              <p className="text-stone-600">{t.science.feetAwayDesc}</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-8 bg-gradient-to-br from-stone-50 to-white rounded-3xl border border-stone-100 shadow-lg"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-20 h-20 bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold text-emerald-500">20</span>
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">{t.science.seconds}</h3>
              <p className="text-stone-600">{t.science.secondsDesc}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-stone-50 to-stone-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-stone-800 mb-4">
              {t.features.title}
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              {t.features.description}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              className="p-6 bg-white rounded-2xl shadow-md border border-stone-100"
              whileHover={{ y: -3 }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Timer className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-stone-800 mb-2">{t.features.timer.title}</h3>
              <p className="text-sm text-stone-600">{t.features.timer.description}</p>
            </motion.div>
            
            <motion.div 
              className="p-6 bg-white rounded-2xl shadow-md border border-stone-100"
              whileHover={{ y: -3 }}
            >
              <div className="w-12 h-12 bg-blue-400/10 rounded-xl flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-bold text-stone-800 mb-2">{t.features.notifications.title}</h3>
              <p className="text-sm text-stone-600">{t.features.notifications.description}</p>
            </motion.div>
            
            <motion.div 
              className="p-6 bg-white rounded-2xl shadow-md border border-stone-100"
              whileHover={{ y: -3 }}
            >
              <div className="w-12 h-12 bg-emerald-400/10 rounded-xl flex items-center justify-center mb-4">
                <Volume2 className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="font-bold text-stone-800 mb-2">{t.features.sounds.title}</h3>
              <p className="text-sm text-stone-600">{t.features.sounds.description}</p>
            </motion.div>
            
            <motion.div 
              className="p-6 bg-white rounded-2xl shadow-md border border-stone-100"
              whileHover={{ y: -3 }}
            >
              <div className="w-12 h-12 bg-purple-400/10 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-bold text-stone-800 mb-2">{t.features.design.title}</h3>
              <p className="text-sm text-stone-600">{t.features.design.description}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo-section" className="py-24 px-4 bg-white scroll-mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-stone-800 mb-4">
              {t.demo.title}
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              {t.demo.description}
            </p>
          </div>
          
          <div className="flex justify-center">
            {/* Browser Mockup Container */}
            <div className="relative w-full max-w-[380px] shadow-2xl rounded-2xl overflow-hidden border border-stone-200 bg-white">
                
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
                        {(status === 'focus' || status === 'break' || status === 'paused') && (
                            <div className={cn(
                                "absolute -bottom-1 -right-1 text-[9px] font-bold px-1 rounded-sm min-w-[14px] text-center shadow-sm",
                                status === 'break' ? "bg-blue-500 text-white" : 
                                status === 'paused' ? "bg-orange-400 text-white" :
                                "bg-primary text-white"
                            )}>
                                {status === 'break' ? '!' : status === 'paused' ? '⏸' : Math.ceil(timeLeft / 60)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Extension Content */}
                <div className="relative h-[520px] bg-secondary/30 rounded-b-2xl overflow-hidden">
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
                        onSkipBreak={skipBreak}
                        stats={stats}
                        meetingMode={meetingMode}
                        onToggleMeetingMode={toggleMeetingMode}
                        language={language}
                        pausedFrom={pausedFrom}
                        reviewStep={reviewStep}
                        onThumbsUp={onThumbsUp}
                        onThumbsDown={onThumbsDown}
                        onDismissReview={onDismissReview}
                        onStoreClick={onStoreClick}
                    />
                    ) : (
                    <Settings
                        settings={settings}
                        onUpdateSettings={setSettings}
                        onBack={() => setView("popup")}
                        language={language}
                    />
                    )}
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-stone-50 to-stone-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-stone-800 mb-4">
              {t.faq.title}
            </h2>
            <p className="text-lg text-stone-600">
              {t.faq.description}
            </p>
          </div>
          
          <div className="space-y-4">
            <details className="group bg-white rounded-2xl border border-stone-200 shadow-sm" data-testid="faq-item-1">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-stone-800 pr-4">{t.faq.q1.question}</h3>
                <ChevronDown className="w-5 h-5 text-stone-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-stone-600">
                <p dangerouslySetInnerHTML={{ __html: t.faq.q1.answer
                  .replace('{aoa}', `<a href="https://www.aoa.org/healthy-eyes/eye-and-vision-conditions/computer-vision-syndrome" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-semibold">${t.science.aoaName}</a>`)
                }} />
              </div>
            </details>
            
            <details className="group bg-white rounded-2xl border border-stone-200 shadow-sm" data-testid="faq-item-2">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-stone-800 pr-4">{t.faq.q2.question}</h3>
                <ChevronDown className="w-5 h-5 text-stone-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-stone-600">
                <p dangerouslySetInnerHTML={{ __html: t.faq.q2.answer.replace('{research}', `<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9434525/" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-semibold">${t.faq.q2.researchLink}</a>`) }} />
              </div>
            </details>
            
            <details className="group bg-white rounded-2xl border border-stone-200 shadow-sm" data-testid="faq-item-3">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-stone-800 pr-4">{t.faq.q3.question}</h3>
                <ChevronDown className="w-5 h-5 text-stone-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-stone-600">
                <p dangerouslySetInnerHTML={{ __html: t.faq.q3.answer.replace('{cvs}', `<a href="https://www.aoa.org/healthy-eyes/eye-and-vision-conditions/computer-vision-syndrome" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-semibold">${t.faq.q3.cvsLink}</a>`).replace('{research}', `<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6020759/" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-semibold">${t.faq.q3.researchLink}</a>`) }} />
              </div>
            </details>
            
            <details className="group bg-white rounded-2xl border border-stone-200 shadow-sm" data-testid="faq-item-4">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-stone-800 pr-4">{t.faq.q4.question}</h3>
                <ChevronDown className="w-5 h-5 text-stone-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-stone-600">
                <p>{t.faq.q4.answer}</p>
              </div>
            </details>
            
            <details className="group bg-white rounded-2xl border border-stone-200 shadow-sm" data-testid="faq-item-5">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-stone-800 pr-4">{t.faq.q5.question}</h3>
                <ChevronDown className="w-5 h-5 text-stone-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-stone-600">
                <p>{t.faq.q5.answer}</p>
              </div>
            </details>
            
            <details className="group bg-white rounded-2xl border border-stone-200 shadow-sm" data-testid="faq-item-6">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-stone-800 pr-4">{t.faq.q6.question}</h3>
                <ChevronDown className="w-5 h-5 text-stone-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-stone-600">
                <p>{t.faq.q6.answer}</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-primary/5 to-primary/10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/30">
            <Eye className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-display font-bold text-stone-800 mb-4">
            {t.cta.title}
          </h2>
          <p className="text-lg text-stone-600 mb-8 max-w-xl mx-auto">
            {t.cta.description}
          </p>
          
          <a 
            href="https://chromewebstore.google.com/detail/digital-eye-relief/dpolekhjjdagbjlohnpogappckndikin"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto max-w-md"
          >
            <Button 
              size="lg" 
              className="h-auto min-h-[4rem] px-6 sm:px-10 py-4 text-lg sm:text-xl rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30 transition-all w-full whitespace-normal"
              data-testid="button-download-cta"
            >
              <Chrome className="w-6 h-6 mr-3 flex-shrink-0" />
              {t.hero.addToChrome}
            </Button>
          </a>
          
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-stone-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>{t.cta.privacyFocused}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{t.cta.noAccount}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>{t.cta.free}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-stone-800 text-stone-400">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-white">Digital Eye Relief</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href={getPrivacyPath()} className="text-sm hover:text-white transition-colors flex items-center gap-1" data-testid="link-privacy-policy">
              <FileText className="w-4 h-4" />
              {t.footer.privacyPolicy}
            </Link>
            <p className="text-sm">
              {t.footer.madeWith}
            </p>
          </div>
        </div>
      </footer>

      {/* Overlay Notification - Renders full screen */}
      <NotificationOverlay
        isOpen={showOverlay}
        timeLeft={timeLeft}
        totalTime={settings.breakDuration}
        onClose={skipBreak}
      />
    </div>
  );
}
