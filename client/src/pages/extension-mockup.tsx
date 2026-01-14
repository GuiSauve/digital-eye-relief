import { useState } from "react";
import { Popup } from "@/components/extension/Popup";
import { Settings } from "@/components/extension/Settings";
import { NotificationOverlay } from "@/components/extension/NotificationOverlay";
import { useExtensionTimer } from "@/hooks/use-extension-timer";
import generatedImage from '@assets/generated_images/soft_abstract_gradient_with_calming_sage_and_blue_tones.png';
import { cn } from "@/lib/utils";
import { Eye, Chrome, Timer, Bell, Volume2, Sparkles, Heart, Shield, ArrowDown, HelpCircle, ChevronDown, FileText } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
    setSettings,
    stats
  } = useExtensionTimer();

  const showOverlay = false; // Modal overlay disabled - badge notifications only

  const scrollToDemo = () => {
    document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-stone-50 to-stone-100 relative overflow-x-hidden">
      
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
        
        <div className="z-10 text-center max-w-4xl mx-auto space-y-8">
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
            className="text-5xl md:text-7xl font-display font-bold text-stone-800 tracking-tight leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Protect your eyes.
            <br />
            <span className="text-primary">Stay focused.</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-stone-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A simple Chrome extension that reminds you to take eye breaks using the medically-recommended 20-20-20 rule.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <a 
              href="https://chromewebstore.google.com/detail/digital-eye-relief/dpolekhjjdagbjlohnpogappckndikin"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30 transition-all"
                data-testid="button-add-to-chrome"
              >
                <Chrome className="w-5 h-5 mr-2" />
                Add to Chrome — It's Free
              </Button>
            </a>
            <Button 
              size="lg" 
              variant="outline"
              className="h-14 px-8 text-lg rounded-full border-2 hover:bg-stone-100"
              onClick={scrollToDemo}
              data-testid="button-try-demo"
            >
              Try Interactive Demo
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
              The Science Behind Healthy Eyes
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Recommended by the <a href="https://www.aoa.org/healthy-eyes/eye-and-vision-conditions/computer-vision-syndrome" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">American Optometric Association</a>, 
              the 20-20-20 rule is the gold standard for preventing digital eye strain.
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
              <h3 className="text-xl font-bold text-stone-800 mb-2">Minutes</h3>
              <p className="text-stone-600">Every 20 minutes of screen time</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-8 bg-gradient-to-br from-stone-50 to-white rounded-3xl border border-stone-100 shadow-lg"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-20 h-20 bg-blue-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold text-blue-500">20</span>
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">Feet Away</h3>
              <p className="text-stone-600">Look at something 20 feet (6 meters) distant</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-8 bg-gradient-to-br from-stone-50 to-white rounded-3xl border border-stone-100 shadow-lg"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-20 h-20 bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold text-emerald-500">20</span>
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">Seconds</h3>
              <p className="text-stone-600">Just a short, refreshing break</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-stone-50 to-stone-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-stone-800 mb-4">
              Simple. Gentle. Effective.
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Designed to help without getting in your way
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
              <h3 className="font-bold text-stone-800 mb-2">Customizable Timer</h3>
              <p className="text-sm text-stone-600">Set your own focus and break durations to match your workflow</p>
            </motion.div>
            
            <motion.div 
              className="p-6 bg-white rounded-2xl shadow-md border border-stone-100"
              whileHover={{ y: -3 }}
            >
              <div className="w-12 h-12 bg-blue-400/10 rounded-xl flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-bold text-stone-800 mb-2">Gentle Notifications</h3>
              <p className="text-sm text-stone-600">Subtle badge reminders with optional calming sounds at break start and end</p>
            </motion.div>
            
            <motion.div 
              className="p-6 bg-white rounded-2xl shadow-md border border-stone-100"
              whileHover={{ y: -3 }}
            >
              <div className="w-12 h-12 bg-emerald-400/10 rounded-xl flex items-center justify-center mb-4">
                <Volume2 className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="font-bold text-stone-800 mb-2">Calming Sounds</h3>
              <p className="text-sm text-stone-600">A gentle temple bell reminds you even when on other tabs</p>
            </motion.div>
            
            <motion.div 
              className="p-6 bg-white rounded-2xl shadow-md border border-stone-100"
              whileHover={{ y: -3 }}
            >
              <div className="w-12 h-12 bg-purple-400/10 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-bold text-stone-800 mb-2">Calm Focus Design</h3>
              <p className="text-sm text-stone-600">Beautiful, minimal interface that promotes relaxation</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo-section" className="py-24 px-4 bg-white scroll-mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-stone-800 mb-4">
              Try It Now
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              This is a fully interactive demo of the extension. Click the buttons to see how it works!
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
                <div className="relative h-[520px] bg-white">
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
                        stats={stats}
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
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-stone-600">
              Everything you need to know about eye health and the 20-20-20 rule
            </p>
          </div>
          
          <div className="space-y-4">
            <details className="group bg-white rounded-2xl border border-stone-200 shadow-sm" data-testid="faq-item-1">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-stone-800 pr-4">What is the 20-20-20 rule?</h3>
                <ChevronDown className="w-5 h-5 text-stone-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-stone-600">
                <p>The 20-20-20 rule is a guideline recommended by the <a href="https://www.aoa.org/healthy-eyes/eye-and-vision-conditions/computer-vision-syndrome" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">American Optometric Association</a> to reduce digital eye strain. The rule is simple: every <strong>20 minutes</strong> of screen time, look at something <strong>20 feet (6 meters) away</strong> for <strong>20 seconds</strong>. This helps relax your eye muscles and reduces fatigue from prolonged focusing on nearby screens.</p>
              </div>
            </details>
            
            <details className="group bg-white rounded-2xl border border-stone-200 shadow-sm" data-testid="faq-item-2">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-stone-800 pr-4">Does the 20-20-20 rule really work?</h3>
                <ChevronDown className="w-5 h-5 text-stone-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-stone-600">
                <p>Yes, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9434525/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">peer-reviewed research</a> supports the effectiveness of the 20-20-20 rule. Clinical studies show that taking regular breaks using this method <strong>reduces accommodation stress</strong> on eye muscles, <strong>improves tear film stability</strong> (helping with dry eyes), and <strong>decreases symptoms of asthenopia</strong> (eye strain). Many users report reduced headaches, less eye fatigue, and improved focus after implementing regular screen breaks.</p>
              </div>
            </details>
            
            <details className="group bg-white rounded-2xl border border-stone-200 shadow-sm" data-testid="faq-item-3">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-stone-800 pr-4">What causes digital eye strain?</h3>
                <ChevronDown className="w-5 h-5 text-stone-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-stone-600">
                <p>Digital eye strain (also called <a href="https://www.aoa.org/healthy-eyes/eye-and-vision-conditions/computer-vision-syndrome" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Computer Vision Syndrome</a>) is caused by prolonged screen use. When focusing on screens, we blink <strong>40-60% less frequently</strong>, leading to dry, irritated eyes. The constant focusing effort also fatigues the ciliary muscles in your eyes. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6020759/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Research indicates</a> that <strong>50-90% of digital device users</strong> experience symptoms including eye fatigue, dryness, blurred vision, headaches, and neck pain.</p>
              </div>
            </details>
            
            <details className="group bg-white rounded-2xl border border-stone-200 shadow-sm" data-testid="faq-item-4">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-stone-800 pr-4">How does Digital Eye Relief help?</h3>
                <ChevronDown className="w-5 h-5 text-stone-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-stone-600">
                <p>Digital Eye Relief is a free Chrome extension that <strong>automatically reminds you</strong> to take eye breaks using the 20-20-20 rule. It runs quietly in the background, tracks your screen time, and sends <strong>gentle notifications</strong> when it's time for a break. Features include customizable timer intervals, subtle badge reminders, optional calming sounds at break start and end, and a beautiful, distraction-free design.</p>
              </div>
            </details>
            
            <details className="group bg-white rounded-2xl border border-stone-200 shadow-sm" data-testid="faq-item-5">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-stone-800 pr-4">Is Digital Eye Relief free?</h3>
                <ChevronDown className="w-5 h-5 text-stone-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-stone-600">
                <p>Yes, Digital Eye Relief is <strong>completely free</strong> to use. There are no premium features, subscriptions, in-app purchases, or hidden costs. The extension is also <strong>privacy-focused</strong> — it doesn't collect any personal data, doesn't require an account, and works entirely on your device. We believe eye health shouldn't have a paywall.</p>
              </div>
            </details>
            
            <details className="group bg-white rounded-2xl border border-stone-200 shadow-sm" data-testid="faq-item-6">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-stone-800 pr-4">Who should use the 20-20-20 rule?</h3>
                <ChevronDown className="w-5 h-5 text-stone-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-stone-600">
                <p>Anyone who spends extended time looking at screens can benefit from the 20-20-20 rule. This includes <strong>office workers, programmers, designers, students, gamers</strong>, and anyone who uses computers, tablets, or smartphones for prolonged periods. It's especially important for people who already experience symptoms of eye strain like dry eyes, headaches, or blurred vision.</p>
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
            Ready to protect your eyes?
          </h2>
          <p className="text-lg text-stone-600 mb-8 max-w-xl mx-auto">
            Start taking care of your eyes today with a simple, free tool designed for healthier screen time.
          </p>
          
          <a 
            href="https://chromewebstore.google.com/detail/digital-eye-relief/dpolekhjjdagbjlohnpogappckndikin"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button 
              size="lg" 
              className="h-16 px-10 text-xl rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30 transition-all"
              data-testid="button-download-cta"
            >
              <Chrome className="w-6 h-6 mr-3" />
              Add to Chrome — It's Free
            </Button>
          </a>
          
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-stone-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Privacy-focused</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>No account required</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>100% Free</span>
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
            <Link href="/privacy" className="text-sm hover:text-white transition-colors flex items-center gap-1" data-testid="link-privacy-policy">
              <FileText className="w-4 h-4" />
              Privacy Policy
            </Link>
            <p className="text-sm">
              Made with ❤️ for healthier screen time
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
