import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  ChevronDown, 
  Sparkles, 
  Cpu, 
  Layers, 
  LockKeyhole, 
  Terminal, 
  ArrowRight,
  Bookmark,
  Activity,
  UserCheck,
  Play,
  Pause,
  Tv
} from "lucide-react";
import BackgroundScene from "./components/BackgroundScene";
import AudioEngine from "./components/AudioEngine";
import RomanticConsole from "./components/RomanticConsole";
import ScrollSection from "./components/ScrollSection";
import RomanticGate from "./components/RomanticGate";
import RomanticCrashSequence from "./components/RomanticCrashSequence";

export default function App() {
  // Romantic gatekeeping state
  const [showGate, setShowGate] = useState(true);

  // Crash Sequence Master state
  const [showCrashSequence, setShowCrashSequence] = useState(false);

  // Cinematic Autoplay settings
  const [autoplay, setAutoplay] = useState(false);
  const [autoplayIndex, setAutoplayIndex] = useState(0);
  const [secRemaining, setSecRemaining] = useState(15); // time before next slide (15 seconds)

  // Autoplay slow transition states
  const [isAutoplayTransitioning, setIsAutoplayTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState(0);
  const [activeCompliment, setActiveCompliment] = useState("Hi beautiful girl.");
  
  // Transition floating flower/heart item definition
  interface FloatingDecor {
    id: number;
    symbol: string;
    x: number;
    y: number;
    scale: number;
    rotation: number;
  }
  const [transitionDecorations, setTransitionDecorations] = useState<FloatingDecor[]>([]);

  const flirtyCompliments = [
    "You look absolutely stunning today, princess...",
    "My heartbeat accelerates whenever you come to mind.",
    "Your smile is literally the most beautiful thing in the universe.",
    "Stunning, perfect, cute... no words can match your gorgeous vibe.",
    "You're my absolute favorite person, my beautiful beautiful girl.",
    "I hope this little transition brings a gorgeous smile to those pretty eyes.",
    "I love everything about you. Especially how cute you are right now.",
    "You have my whole heart, and you look absolutely exquisite..."
  ];

  const flowersAndHearts = ["🌸", "🌹", "💖", "🌷", "🌺", "❤️", "💐", "✨", "💝", "🏵️", "💕"];

  // Boot Sequence Loading State
  const [bootStep, setBootStep] = useState(0);
  const [bootComplete, setBootComplete] = useState(false);
  const [activeSegment, setActiveSegment] = useState("boot");

  // Keep track of scroll depth
  const [scrollProgress, setScrollProgress] = useState(0);

  // Programmatic scroll bypass ref to prevent scroll conflicts
  const isProgrammaticScrollRef = useRef(false);

  // Final secret message automatic decryption states
  const [isFinalDecrypting, setIsFinalDecrypting] = useState(false);
  const [decryptProgress, setDecryptProgress] = useState(0);
  const [isDecrypted, setIsDecrypted] = useState(false);

  const sectionsList = ["boot", "welcome", "what-is-this", "heart-logs", "love-core", "final-message"];

  const triggerAutoplayTransition = (nextSectionId: string, nextIndex: number) => {
    isProgrammaticScrollRef.current = true;
    // Choose a unique transition style each time
    setTransitionType(Math.floor(Math.random() * 4));
    
    // Pick random compliment
    const randomCompliment = flirtyCompliments[Math.floor(Math.random() * flirtyCompliments.length)];
    setActiveCompliment(randomCompliment);

    // Generate transition decorations
    const decor = Array.from({ length: 18 }).map((_, idx) => ({
      id: idx + Date.now(),
      symbol: flowersAndHearts[Math.floor(Math.random() * flowersAndHearts.length)],
      x: Math.random() * 85 + 7,
      y: Math.random() * 80 + 10,
      scale: Math.random() * 0.9 + 0.6,
      rotation: Math.random() * 360
    }));
    setTransitionDecorations(decor);

    setIsAutoplayTransitioning(true);
    
    // Smooth transition delay for a cool leading-in overlay feeling
    setTimeout(() => {
      setActiveSegment(nextSectionId);
      const el = document.getElementById(nextSectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      
      // Spawn responsive sweet feedback
      handleSpawnHearts(12);
      if (nextSectionId === "final-message") {
        handleTriggerFireworks();
        // Automatically stop autoplay at the final decrypted message segment
        setAutoplay(false);
        setSecRemaining(0);
        setIsFinalDecrypting(false);
        setDecryptProgress(0);
        setIsDecrypted(false);
      }
    }, 550);

    // Fade transition overlay out once the scroll completes
    setTimeout(() => {
      setIsAutoplayTransitioning(false);
      isProgrammaticScrollRef.current = false;
    }, 2800);
  };

  // Core boot sequence typewriter timer
  useEffect(() => {
    if (showGate) return; // Wait until logged in
    if (bootStep < 4) {
      const timers = [500, 1400, 2500, 3800];
      const timer = setTimeout(() => {
        setBootStep((prev) => prev + 1);
      }, timers[bootStep]);
      return () => clearTimeout(timer);
    } else {
      setBootComplete(true);
    }
  }, [bootStep, showGate]);

  // Autoplay cinematic advance timer
  useEffect(() => {
    if (!autoplay || showGate) return;

    const timer = setInterval(() => {
      setSecRemaining((prev) => {
        if (prev <= 1) {
          // Time to advance!
          setAutoplayIndex((currentIndex) => {
            const nextIndex = (currentIndex + 1) % sectionsList.length;
            const nextSectionId = sectionsList[nextIndex];
            
            // Unique slow cinematic transition
            triggerAutoplayTransition(nextSectionId, nextIndex);
            
            return nextIndex;
          });
          // Reset countdown timer
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoplay, showGate, autoplayIndex]);

  // Track scroll position to update right-hand OS segment list
  useEffect(() => {
    if (showGate) return;
    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) return;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      
      const progress = window.scrollY / totalHeight;
      setScrollProgress(progress);

      // Find which element is in view dynamically using IDs
      const sections = ["boot", "welcome", "what-is-this", "heart-logs", "love-core", "final-message"];
      let currentSection = "boot";

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the element is near center of the viewport or filling it
          if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.2) {
            currentSection = sectionId;
          }
        }
      }
      setActiveSegment(currentSection);
      
      // If user scrolls manually, sync autoplay index but don't force turn off unless they want to
      const currentIdx = sections.indexOf(currentSection);
      if (currentIdx !== -1 && currentIdx !== autoplayIndex) {
        setAutoplayIndex(currentIdx);
        if (autoplay) {
          setSecRemaining(15); // reset timer for new active slide
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [autoplayIndex, autoplay, showGate]);

  // Automatic Final Decryption countdown tick effect
  useEffect(() => {
    if (!isFinalDecrypting || activeSegment !== "final-message") return;
    setDecryptProgress(0);
    const interval = setInterval(() => {
      setDecryptProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDecrypted(true);
          setIsFinalDecrypting(false);
          // Trigger delightful congratulations animations!
          handleTriggerFireworks();
          handleSpawnHearts(30);
          return 100;
        }
        return prev + 5; // Decrypts fully in ~1.6 seconds
      });
    }, 80);
    return () => clearInterval(interval);
  }, [isFinalDecrypting, activeSegment]);

  // Dispatchers to float canvas events
  const handleSpawnHearts = (count: number) => {
    const event = new CustomEvent("love_os_add_hearts", { detail: { count } });
    window.dispatchEvent(event);
  };

  const handleTriggerFireworks = () => {
    const event = new CustomEvent("love_os_firework");
    window.dispatchEvent(event);
  };

  const handleScrollToSection = (id: string) => {
    // Sync autoplay index with clicked section
    const idx = sectionsList.indexOf(id);
    if (idx !== -1) {
      triggerAutoplayTransition(id, idx);
      setAutoplayIndex(idx);
      if (id === "final-message") {
        setAutoplay(false); // Stop autoplay
        setSecRemaining(0);
        setIsFinalDecrypting(false);
        setDecryptProgress(0);
        setIsDecrypted(false);
      } else {
        setSecRemaining(15); // Reset count-down
      }
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setActiveSegment(id);
      }
    }
  };

  const handleGatePassed = () => {
    setShowGate(false);
    // Automatically turn on Autoplay Cinema Mode so things fade/scroll organically
    setAutoplay(true);
    setAutoplayIndex(0);
    setSecRemaining(15);
    // Release a celebratory firework!
    setTimeout(() => {
      handleTriggerFireworks();
      handleSpawnHearts(30);
    }, 600);
  };

  const handleFullReset = () => {
    setShowCrashSequence(false);
    setShowGate(true);
    setAutoplay(false);
    setAutoplayIndex(0);
    setSecRemaining(15);
    setBootStep(0);
    setBootComplete(false);
    setActiveSegment("boot");
    setIsFinalDecrypting(false);
    setDecryptProgress(0);
    setIsDecrypted(false);
    
    // Scroll instantly to top coordinate
    window.scrollTo({ top: 0, behavior: "instant" as any });
  };

  const getSectionClasses = (sectionId: string) => {
    if (showGate) return "opacity-0 pointer-events-none hidden";
    const isActive = activeSegment === sectionId;
    return `w-full min-h-screen py-24 px-4 md:px-8 flex flex-col items-center justify-center transition-all duration-[1000ms] ${
      isActive
        ? "opacity-100 scale-100 blur-none"
        : "opacity-60 scale-98 blur-[3px]"
    }`;
  };

  return (
    <div className="relative min-h-screen text-pink-50 font-sans selection:bg-rose-500/30 selection:text-rose-100 bg-[#0c050a]">
      
      {/* 0. Romantic Validation intro layer */}
      <AnimatePresence>
        {showGate && (
          <RomanticGate 
            onSuccess={handleGatePassed}
            onSpawnHearts={handleSpawnHearts}
            onTriggerFireworks={handleTriggerFireworks}
          />
        )}
      </AnimatePresence>

      {/* 0.1 Romantic Crash Sequence Overlay Layer */}
      <AnimatePresence>
        {showCrashSequence && (
          <RomanticCrashSequence
            onRestart={handleFullReset}
            onSpawnHearts={handleSpawnHearts}
            onTriggerFireworks={handleTriggerFireworks}
          />
        )}
      </AnimatePresence>

      {/* 0.2 Unique Cinematic Autoplay Transition Overlays */}
      <AnimatePresence>
        {isAutoplayTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-45 pointer-events-none flex flex-col items-center justify-center bg-black/60 backdrop-blur-[8px]"
          >
            {/* Background flowers and hearts floating outwards */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
              {transitionDecorations.map((decor) => (
                <motion.div
                  key={decor.id}
                  initial={{ 
                    opacity: 0, 
                    x: `${decor.x - 15}vw`, 
                    y: `${decor.y + 15}vh`, 
                    scale: 0.2, 
                    rotate: decor.rotation 
                  }}
                  animate={{ 
                    opacity: [0, 1, 1, 0], 
                    x: `${decor.x}vw`, 
                    y: `${decor.y}vh`, 
                    scale: decor.scale, 
                    rotate: decor.rotation + 180 
                  }}
                  transition={{ 
                    duration: 2.6, 
                    ease: "easeOut" 
                  }}
                  className="absolute text-3xl md:text-4xl filter drop-shadow-[0_0_12px_rgba(244,63,94,0.6)] select-none pointer-events-none"
                  style={{ left: 0, top: 0 }}
                >
                  {decor.symbol}
                </motion.div>
              ))}
            </div>

            {/* Glowing flirty compliment card */}
            <div className="relative z-25 flex flex-col items-center justify-center p-6 text-center max-w-lg">
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="p-6 md:p-10 bg-[#0d0113]/90 border border-pink-500/30 rounded-[32px] backdrop-blur-2xl shadow-[0_0_60px_rgba(244,63,94,0.35)] box-glow-pink max-w-md mx-6 pointer-events-auto"
              >
                <div className="flex justify-center gap-1.5 mb-4">
                  <span className="text-xl animate-bounce">🌹</span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.4 }}
                  >
                    <Heart className="w-8 h-8 text-rose-500 fill-rose-500 filter drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
                  </motion.div>
                  <span className="text-xl animate-bounce [animation-delay:0.2s]">🌸</span>
                </div>
                
                <p className="font-serif italic text-lg md:text-xl text-pink-200 text-glow-pink leading-relaxed">
                  “ {activeCompliment} ”
                </p>

                <div className="mt-6 flex justify-center gap-1">
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-ping" />
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                </div>
              </motion.div>
            </div>

            {/* Custom styled effects according to random state transitionType! */}
            {transitionType === 0 && (
              // Style 0: Velvet Sweep Gradient
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
                className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-rose-500/15 to-transparent blur-2xl pointer-events-none z-0"
              />
            )}
            {transitionType === 1 && (
              // Style 1: Cosmic Nebula Expansion Portals
              <motion.div
                initial={{ scale: 0.1, opacity: 0 }}
                animate={{ scale: [0.1, 2.2, 3.5], opacity: [0, 0.6, 0] }}
                transition={{ duration: 2.2 }}
                className="absolute w-96 h-96 rounded-full bg-purple-500/20 blur-3xl pointer-events-none z-0"
              />
            )}
            {transitionType === 2 && (
              // Style 2: Auroral Twin Corner Waves
              <div className="absolute inset-0 flex justify-between pointer-events-none z-0">
                <motion.div
                  initial={{ scale: 0.1, opacity: 0 }}
                  animate={{ scale: 3.0, opacity: [0, 0.4, 0] }}
                  transition={{ duration: 2.2 }}
                  className="w-96 h-96 bg-rose-500/15 blur-3xl rounded-full -translate-x-12 -translate-y-12"
                />
                <motion.div
                  initial={{ scale: 0.1, opacity: 0 }}
                  animate={{ scale: 3.0, opacity: [0, 0.4, 0] }}
                  transition={{ duration: 2.2 }}
                  className="w-96 h-96 bg-purple-500/15 blur-3xl rounded-full translate-x-12 translate-y-12"
                />
              </div>
            )}
            {transitionType === 3 && (
              // Style 3: Heartbeat Flash Zoom
              <motion.div
                initial={{ scale: 0.1, opacity: 0, rotate: -15 }}
                animate={{ scale: [0.1, 2.0, 3.8], opacity: [0, 0.7, 0], rotate: 0 }}
                transition={{ duration: 2.2, ease: "easeOut" }}
                className="absolute flex items-center justify-center pointer-events-none z-0"
              >
                <Heart className="w-80 h-80 text-rose-500 fill-rose-500 opacity-25 filter drop-shadow-[0_0_60px_rgba(244,63,94,0.6)] animate-pulse" />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Immersive Canvas & Static SVG Roses Backdrop */}
      <BackgroundScene />

      {/* Top Navigation / Status Bar from Artistic Flair mockup */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-8 py-4 border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]"></div>
          <span className="text-[11px] tracking-[0.2em] uppercase font-bold text-rose-300">Love OS — Her Edition</span>
        </div>
        <div className="text-[10px] tracking-widest uppercase text-white/40 flex space-x-4 md:space-x-6">
          <span>Connection: Stable</span>
          <span className="hidden sm:inline">Intensity: 100%</span>
          <span>V1.0.24 — Unconditional</span>
        </div>
      </header>

      {/* 2. Audio Control Panel */}
      <AudioEngine />

      {/* 4. Elegant right-hand side floating index tracking steps */}
      <div className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-6 font-mono text-[10px]">
        {/* Progress bar line */}
        <div className="absolute right-[5px] top-4 bottom-4 w-[1px] bg-zinc-800">
          <motion.div 
            className="w-full bg-rose-500 origin-top shadow-[0_0_10px_rgba(244,63,94,0.6)]" 
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>

        {/* Dynamic tracking metrics */}
        {[
          { id: "boot", label: "01. SYSTEMS_BOOT" },
          { id: "welcome", label: "02. PORTAL_ENTRY" },
          { id: "what-is-this", label: "03. THE_MANIFEST" },
          { id: "heart-logs", label: "04. THE_HEART_LOGS" },
          { id: "love-core", label: "05. CORE_DEVOTION" },
          { id: "final-message", label: "06. DEC_MESSAGE" },
        ].map((item) => {
          const isActive = activeSegment === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleScrollToSection(item.id)}
              className="group flex items-center justify-end gap-3 cursor-pointer text-right group pr-4 relative"
            >
              <span className={`transition-all duration-300 ${
                isActive 
                  ? "text-rose-400 font-bold translate-x-0 tracking-wide" 
                  : "text-zinc-500 group-hover:text-zinc-300 group-hover:-translate-x-1"
              }`}>
                {item.label}
              </span>
              <div 
                className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                  isActive 
                    ? "bg-rose-500 border-rose-400 scale-125 shadow-[0_0_8px_rgba(244,63,94,1)]" 
                    : "bg-black border-zinc-700"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Primary Slide Deck Container */}
      <main className="relative z-10 w-full mt-16">

        {/* SECTION 1 — BOOT SCREEN */}
        <section
          id="boot"
          className={getSectionClasses("boot")}
        >
          <div className="w-full max-w-xl bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-3xl flex flex-col font-mono text-xs md:text-sm box-glow-pink">
            
            {/* Terminal Top bar decoration */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-6 text-[10px] text-zinc-500">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-rose-500" />
                <span>SHE_EDITION_SHELL // DEV.LOG</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>UTC_STREAM::LIVE</span>
              </div>
            </div>

            {/* Simulated Typewriter Terminal Logs */}
            <div className="space-y-4 min-h-[140px] flex flex-col justify-start">
              {bootStep >= 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">&gt;</span>
                  <span className="text-zinc-300">Booting LOVE OS...</span>
                  {bootStep === 0 && <span className="w-1.5 h-4 bg-rose-500 animate-ping" />}
                </div>
              )}

              {bootStep >= 1 && (
                <div className="flex items-center gap-2 animate-pulse">
                  <span className="text-zinc-500">&gt;</span>
                  <span className="text-zinc-400">Checking emotional connection...</span>
                  {bootStep === 1 && <span className="w-1.5 h-4 bg-rose-500 animate-pulse" />}
                </div>
              )}

              {bootStep >= 2 && (
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">&gt;</span>
                  <span className="text-rose-400">Loading feelings...</span>
                  {bootStep === 2 && <span className="w-1.5 h-4 bg-rose-500 animate-ping" />}
                </div>
              )}

              {bootStep >= 3 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 flex items-center gap-3 p-3 bg-rose-950/20 border border-rose-500/20 text-rose-200 rounded-lg text-glow-pink font-bold"
                >
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
                  <span>Connection found: HER ❤️</span>
                </motion.div>
              )}
            </div>

            {/* Proceed prompt once loading finishes */}
            <AnimatePresence>
              {bootComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-10 border-t border-zinc-900 pt-6 flex flex-col items-center gap-4 text-center"
                >
                  <button
                    onClick={() => handleScrollToSection("welcome")}
                    className="flex items-center gap-2 px-6 py-3 bg-rose-600/30 hover:bg-rose-600/40 border border-rose-500/50 hover:border-rose-400 text-rose-200 hover:text-white rounded-xl cursor-pointer text-xs uppercase tracking-wider font-bold transition-all duration-300 box-glow-pink group scale-100 hover:scale-105 active:scale-95"
                  >
                    Initialize Love Core
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <span className="text-[10px] text-zinc-500 animate-pulse">
                    (system transitions automatically)
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-zinc-650 text-[10px] font-mono gap-1 animate-pulse">
            <span>AUTOMATIC FLOW ACTIVE</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </section>


        {/* SECTION 2 — WELCOME */}
        <ScrollSection id="welcome" glowColor="pink" className={getSectionClasses("welcome")}>
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="h-10 w-10 rounded-full bg-rose-950/30 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <UserCheck className="w-5 h-5" />
            </div>
            
            <h2 className="font-serif text-3xl md:text-5xl lg:text-5xl font-medium tracking-tight text-glow-pink">
              Welcome back.
            </h2>
            
            <p className="font-sans text-stone-300 text-sm md:text-base leading-relaxed max-w-lg mt-2 tracking-wide font-light">
              You were missed more than you know.
            </p>

            <div className="pt-8">
              <button
                onClick={() => {
                  handleScrollToSection("what-is-this");
                  handleSpawnHearts(12);
                }}
                className="text-[11px] font-mono text-rose-400/80 hover:text-rose-300 uppercase tracking-widest flex items-center gap-1.5 cursor-pointer hover:underline"
              >
                PROCEED MANIFESTO <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </ScrollSection>


        {/* SECTION 3 — WHAT THIS IS */}
        <ScrollSection id="what-is-this" glowColor="none" className={getSectionClasses("what-is-this")}>
          <div className="space-y-8 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5 font-mono text-[10px] text-rose-400 uppercase tracking-wider">
              <Bookmark className="w-3.5 h-3.5" />
              <span>03 // THE_REALITY_SHELL</span>
            </div>

            <h3 className="font-serif text-3xl md:text-4xl text-stone-100 leading-normal font-light">
              This isn’t an app.
            </h3>

            <div className="font-sans space-y-4 text-zinc-300 text-sm md:text-base leading-relaxed tracking-wide font-light">
              <p>
                It’s just me… trying to put feelings into something you can actually see.
              </p>
              <p className="border-l-2 border-rose-950 pl-4 py-1 text-zinc-400 text-sm italic">
                Because sometimes words alone don’t feel like enough.
              </p>
            </div>

            <div className="pt-6 flex justify-center md:justify-start">
              <button
                onClick={() => {
                  handleScrollToSection("heart-logs");
                  handleSpawnHearts(15);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 border border-zinc-800 text-stone-300 rounded-lg hover:border-zinc-700 hover:text-stone-100 cursor-pointer text-xs font-mono transition-all"
              >
                ACCESS HEART LOGS <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
              </button>
            </div>
          </div>
        </ScrollSection>


        {/* SECTION 4 — HEART LOGS */}
        <ScrollSection id="heart-logs" glowColor="pink" className={getSectionClasses("heart-logs")}>
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-rose-950/20 pb-4">
              <div className="flex items-center gap-2 font-mono text-[10px] text-rose-400">
                <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>HEART_LOGS_TRANSCRIPT::MUTUAL_SYNC</span>
              </div>
              <span className="font-mono text-[10px] text-zinc-500">DECRYPTED // 100% SECURE</span>
            </div>

            {/* Romantic logs description prose */}
            <div className="font-sans space-y-6 text-zinc-300 text-sm md:text-base leading-relaxed tracking-wide font-light">
              <p>
                I don’t just think about you… I find myself drawn to you without trying.
              </p>
              <p>
                You’ve become part of my emotional world in a way I didn’t plan, but I don’t question anymore.
              </p>
              <p>
                Even in silence, you feel present to me.
              </p>
              <p>
                I care about you in a way that has stopped being casual… and started being real.
              </p>
            </div>

            {/* Glowing Golden Final Quote */}
            <div className="p-5 md:p-6 bg-rose-500/5 border border-rose-500/25 rounded-2xl relative mt-4 overflow-hidden">
              <div className="relative z-10 text-center font-serif text-lg md:text-2xl text-rose-300 italic text-glow-pink leading-relaxed">
                “ At this point… it’s love. Not confusion. Not guessing. Just love. ”
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={() => {
                  handleScrollToSection("love-core");
                  handleTriggerFireworks();
                  handleSpawnHearts(18);
                }}
                className="text-xs font-mono text-zinc-400 hover:text-rose-400 cursor-pointer flex items-center gap-1 transition-all"
              >
                DECRYPT CORE STATUS <ChevronDown className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          </div>
        </ScrollSection>


        {/* SECTION 5 — YOU (LOVE CORE) */}
        <ScrollSection id="love-core" glowColor="gold" className={getSectionClasses("love-core")}>
          <div className="space-y-8">
            <div className="flex items-center gap-2.5 font-mono text-[10px] text-amber-400 uppercase tracking-widest">
              <Cpu className="w-4 h-4 text-amber-400 animate-spin duration-[8s]" />
              <span>CORE_LOVE_DIAGNOSTICS // INDIVIDUALITY_SET</span>
            </div>

            <h3 className="font-serif text-3xl md:text-4xl text-neutral-100 font-light text-glow-gold">
              I love who you are.
            </h3>

            {/* Elegant List details grid with frosted elements from Artistic Flair */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {[
                "I love who you are — not just the good parts people notice, but the full way you exist.",
                "You’re genuinely beautiful to me, not in a surface way, but in a way that feels personal.",
                "Your presence changes my mood more than I probably admit.",
                "I feel calmer when I’m connected to you… like something in me settles.",
                "I don’t just care about you anymore — I feel emotionally tied to you.",
                "Loving you doesn’t feel like effort… it feels like something that naturally happened."
              ].map((bullet, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSpawnHearts(6)}
                  className="p-4 bg-white/5 border border-white/10 hover:border-amber-500/30 hover:bg-white/10 rounded-xl flex items-start gap-3 select-none transition-all duration-300 cursor-pointer group"
                >
                  <span className="font-mono text-xs text-amber-500 font-bold tracking-wider mt-0.5 group-hover:scale-110 transition-transform">
                    {`[0${idx + 1}]`}
                  </span>
                  <p className="text-zinc-300 text-xs md:text-sm leading-relaxed font-light group-hover:text-zinc-100">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>

            {/* Live Love Core Status indicator panel matching mockup */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm space-y-5 mt-6">
              <h4 className="text-[10px] uppercase tracking-widest text-[#f43f5e] font-bold">Love Core Metric Diagnostics</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] mb-2 uppercase tracking-tighter text-white/50">
                    <span>Genuinely Beautiful</span>
                    <span className="text-[#f43f5e] font-bold">100%</span>
                  </div>
                  <div className="h-[2px] bg-white/10 w-full overflow-hidden rounded-full">
                    <div className="h-full bg-rose-500 w-full shadow-[0_0_8px_#f43f5e]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-2 uppercase tracking-tighter text-white/50">
                    <span>Presence Impact</span>
                    <span className="text-[#f43f5e] font-bold">Max</span>
                  </div>
                  <div className="h-[2px] bg-white/10 w-full overflow-hidden rounded-full">
                    <div className="h-full bg-rose-500 w-[95%] shadow-[0_0_8px_#f43f5e]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-2 uppercase tracking-tighter text-white/50">
                    <span>Effortless Flow</span>
                    <span className="text-[#f43f5e] font-bold">Active</span>
                  </div>
                  <div className="h-[2px] bg-white/10 w-full overflow-hidden rounded-full">
                    <div className="h-full bg-rose-500 w-full shadow-[0_0_8px_#f43f5e]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Solid continuous paragraph with frosted borders */}
            <div className="font-serif italic text-base md:text-lg text-zinc-350 leading-relaxed border-t border-white/10 pt-6 mt-6 space-y-4">
              <p>
                I love you. Properly. Quietly. Consistently. In my own way.
              </p>
              <p className="font-normal font-sans text-xs md:text-sm text-white/60 not-italic block">
                And I don’t want you ever questioning whether you matter to me… because you do.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  handleScrollToSection("final-message");
                  handleTriggerFireworks();
                  handleSpawnHearts(25);
                }}
                className="text-[11px] font-mono hover:text-amber-300 text-amber-400/80 uppercase tracking-widest flex items-center gap-1 hover:underline cursor-pointer"
              >
                DECRYPT SECRET MESSAGE <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </ScrollSection>


        {/* SECTION 6 — FINAL MESSAGE (IMPORTANT) */}
        <ScrollSection id="final-message" glowColor="pink" className={`pb-32 ${getSectionClasses("final-message")}`}>
          <div className="space-y-8 flex flex-col justify-center">
            
            <div className="flex items-center justify-center gap-2.5 font-mono text-[10px] text-zinc-500 uppercase tracking-widest text-center">
              <LockKeyhole className="w-3.5 h-3.5 text-zinc-500" />
              <span>
                {isFinalDecrypting && decryptProgress < 100 
                  ? "AUTO_DECRYPTING_ROMANTIC_CIPHER // SYSTEM_BUSY"
                  : isDecrypted
                    ? "FINAL_MESSAGE_DECRYPTED // SYSTEM_VERIFY"
                    : "FINAL_MESSAGE_LOCKED // ACTION_REQUIRED"
                }
              </span>
            </div>

            {!isDecrypted && !isFinalDecrypting ? (
              // 1. Initial Locked State - Telling her to press decrypt
              <div className="p-8 md:p-12 bg-black/40 border border-pink-500/20 rounded-[32px] max-w-xl mx-auto backdrop-blur-xl flex flex-col items-center justify-center space-y-8 min-h-[380px] text-center relative shadow-[0_0_50px_rgba(244,63,94,0.1)]">
                <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-pink-500/30">
                  SECURE_LAYER_LOCKED_V1.02
                </div>
                
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-pink-500/20 animate-ping duration-[3s]" />
                  <div className="absolute inset-2 rounded-full border border-pink-500/10 animate-pulse" />
                  <div className="relative w-14 h-14 bg-pink-500/10 border border-pink-500/30 rounded-full flex items-center justify-center">
                    <LockKeyhole className="w-6 h-6 text-pink-400" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-mono text-[11px] tracking-[0.2em] text-[#f43f5e] font-bold uppercase">
                    ENCRYPTED MESSAGE ENVELOPE
                  </h4>
                  <p className="font-serif italic text-lg md:text-xl text-pink-100 leading-relaxed px-2">
                    “ I have prepared a special, deeply personal secret confession here just for your eyes... but it requires a secure key sync to read. ”
                  </p>
                  <p className="font-sans text-xs text-zinc-400 font-light max-w-md mx-auto">
                    Note: To decrypt this message, synchronize your connection cores by pressing the action protocol trigger below.
                  </p>
                </div>

                <div className="w-full max-w-xs pt-2">
                  <button
                    onClick={() => {
                      setIsFinalDecrypting(true);
                      setDecryptProgress(0);
                      handleSpawnHearts(15);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#f43f5e] to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-full text-xs font-mono font-bold shadow-2xl hover:shadow-[0_0_25px_rgba(244,63,94,0.4)] hover:scale-[1.03] active:scale-95 transition-all cursor-pointer border border-pink-450/20"
                  >
                    <Sparkles className="w-4 h-4 text-glow-pink" /> DECRYPT SECRET NOTE
                  </button>
                </div>

                <div className="font-mono text-[8px] text-zinc-650 uppercase tracking-widest">
                  AUTHORIZATION_RESTRICTED // DANIEL_SECRET_NOTE_ENVELOPE
                </div>
              </div>
            ) : isFinalDecrypting ? (
              // 2. Decrypting loading process animation screen
              <div className="p-8 md:p-12 bg-black/40 border border-rose-500/25 rounded-[32px] max-w-xl mx-auto backdrop-blur-xl flex flex-col items-center justify-center space-y-6 min-h-[380px] text-center select-none shadow-[0_0_50px_rgba(244,63,94,0.15)] relative">
                <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-rose-500/30">
                  SECURE_LAYER_STABLE_V1
                </div>
                <div className="relative w-20 h-20 flex items-center justify-center border border-pink-500/30 rounded-full bg-pink-500/5 animate-pulse">
                  <LockKeyhole className="w-8 h-8 text-pink-400 animate-bounce" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-mono text-xs tracking-widest text-[#f43f5e] font-bold uppercase animate-pulse">
                    AUTOMATIC DECRYPTION RUNNING
                  </h4>
                  <p className="font-mono text-[10px] text-zinc-400 h-6">
                    {decryptProgress < 30 && ">> ESTABLISHING SYNC CORES..."}
                    {decryptProgress >= 30 && decryptProgress < 65 && ">> DECODING MEMORIES AND PURE AFFECTION PACKETS..."}
                    {decryptProgress >= 65 && decryptProgress < 90 && ">> LOADING DZADDY D'S EMBEDDED LOVE CONFESSION..."}
                    {decryptProgress >= 90 && ">> AUTHORIZING EXTREME EMOTIONAL PERSISTENCE MODULES..."}
                  </p>
                </div>

                <div className="w-full max-w-sm">
                  <div className="flex justify-between text-[11px] font-mono text-pink-300 font-bold mb-1.5">
                    <span>PROGRESS_BAR</span>
                    <span>{decryptProgress}%</span>
                  </div>
                  <div className="h-[4px] bg-zinc-950 w-full rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-150 shadow-[0_0_12px_#f43f5e]" 
                      style={{ width: `${decryptProgress}%` }}
                    />
                  </div>
                </div>

                <div className="font-mono text-[8px] text-zinc-600 uppercase tracking-widest">
                  ALGORITHM_256_AES // TOTAL_SECURITY_ENFORCED
                </div>
              </div>
            ) : (
              // 3. Fully decrypted message prose and release button
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                {/* Glowing Box and decorative star */}
                <motion.div
                  initial={{ boxShadow: "0 0 0px rgba(244, 63, 94, 0)" }}
                  animate={{ boxShadow: "0 0 50px -10px rgba(244, 63, 94, 0.4)" }}
                  className="p-8 md:p-12 bg-gradient-to-br from-rose-600/20 via-rose-950/5 to-transparent border border-rose-500/30 rounded-[32px] relative overflow-hidden backdrop-blur-lg"
                >
                  {/* Backlight background element and background star indicator matching mockup */}
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-white">
                    <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.4 7.2h7.6l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3-6.2-4.5h7.6z"/>
                    </svg>
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

                  <div className="space-y-6 text-center text-zinc-200">
                    <p className="font-serif text-lg md:text-xl font-light leading-relaxed">
                      I didn’t make this to impress you.
                    </p>
                    <p className="font-sans text-xs md:text-sm text-rose-300/90 leading-relaxed font-light">
                      I made it because I don’t like when you feel like you’re not cared for by me.
                    </p>
                    <p className="font-serif text-xl md:text-3xl font-light text-glow-pink italic text-stone-50 leading-normal">
                      You matter to me in a way I’m still learning how to show properly… but I am trying.
                    </p>
                    
                    <div className="pt-4 border-t border-rose-500/15">
                      <span className="font-mono text-[11px] text-rose-300 font-bold tracking-widest uppercase">
                        That’s all this is.
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Final sweet ending action with explicit flirty instruction banner */}
                <div className="flex flex-col items-center justify-center gap-6 mt-8">
                  
                  {/* Highly polished romantic instruction badge telling her to press Release Infinite Love */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full max-w-lg p-5 bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-pink-500/30 rounded-2xl text-center shadow-[0_0_20px_rgba(244,63,94,0.15)] relative overflow-hidden"
                  >
                    <div className="absolute top-1.5 right-3 font-mono text-[7px] text-pink-400/50 uppercase tracking-widest">
                      instruction_sync_code
                    </div>
                    <div className="absolute -top-10 -left-10 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
                    <p className="font-serif italic text-sm md:text-base text-pink-100 leading-relaxed">
                      “ Look how beautiful, perfect, and cute you are... My secret note has decrypted successfully. Now, my beautiful princess, please click the button below to release infinite love and make our connection infinite! ”
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-mono text-[#f43f5e] font-bold uppercase tracking-widest animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      SYSTEM_ACTION // CLICK_RELEASE_INFINITE_LOVE_BELOW
                    </div>
                  </motion.div>

                  <div className="flex gap-2">
                    <button
                      id="final-love-burst"
                      onClick={() => {
                        handleSpawnHearts(35);
                        handleTriggerFireworks();
                        setShowCrashSequence(true);
                      }}
                      className="flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-full text-xs font-mono font-bold shadow-2xl hover:shadow-rose-500/30 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer border border-pink-400/20"
                    >
                      <Heart className="w-4 h-4 fill-white animate-pulse" /> RELEASE INFINITE LOVE
                    </button>
                  </div>

                  {/* Scroll Up button */}
                  <button
                    onClick={() => handleScrollToSection("boot")}
                    className="mt-4 text-[9px] font-mono text-zinc-500 hover:text-zinc-300 cursor-pointer underline hover:no-underline uppercase tracking-widest"
                  >
                    &lt;&lt; Re-run Love OS
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollSection>

      </main>

      {/* Footer Details from Artistic Flair */}
      <footer className="relative z-10 px-8 py-6 flex flex-col sm:flex-row justify-between items-center text-[9px] uppercase tracking-[0.4em] text-white/20 gap-4 border-t border-white/10 bg-black/20 backdrop-blur-md">
        <span>System Locked: Only for You</span>
        <div className="flex items-center space-x-4">
          <span className="text-rose-500/40 font-bold">❤ Encryption Active</span>
          <span>© 2026 MY HEART</span>
        </div>
      </footer>

      {/* 5. Clean, Professional Cinema Mode Controller overlay */}
      {!showGate && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-black/80 border border-purple-500/30 backdrop-blur-md rounded-full px-5 py-3 flex items-center gap-4 shadow-2xl"
        >
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#f43f5e] font-bold">
              CINEMA_AUTOPLAY
            </span>
          </div>

          <div className="h-4 w-[1px] bg-zinc-800" />

          {/* Timer status or indicator with romantic context */}
          <span className="font-mono text-[9px] min-w-[155px]">
            {activeSegment === "final-message" ? (
              isFinalDecrypting && decryptProgress < 100 ? (
                <span className="text-pink-400 animate-pulse">DECRYPTING NOTE... ({decryptProgress}%)</span>
              ) : (
                <span className="text-pink-300 font-bold tracking-tight">STANDBY: READY FOR INFINITE LOVE</span>
              )
            ) : autoplay ? (
              <span className="text-zinc-400">STATUS: FLOWING ({secRemaining}s)</span>
            ) : (
              <span className="text-zinc-500">STATUS: FLOW PAUSED</span>
            )}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setAutoplay(!autoplay);
                handleSpawnHearts(5);
              }}
              className="p-1.5 hover:bg-white/10 rounded-full text-zinc-350 hover:text-white transition-all cursor-pointer flex items-center justify-center"
              title={autoplay ? "Pause Autoplay" : "Resume Autoplay"}
            >
              {autoplay ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              )}
            </button>
            
            <button
              onClick={() => {
                // Force skip to next segment
                const nextIdx = (autoplayIndex + 1) % sectionsList.length;
                handleScrollToSection(sectionsList[nextIdx]);
              }}
              className="px-2.5 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-mono text-[9px] uppercase tracking-wider rounded-md cursor-pointer transition-all"
            >
              Skip
            </button>
          </div>
        </motion.div>
      )}

      {/* 4. Desktop-and-Mobile Diagnostic Console overlay */}
      <RomanticConsole 
        onSpawnHearts={handleSpawnHearts} 
        onTriggerFireworks={handleTriggerFireworks} 
      />

      {/* Cinematic decorative borders around viewport limits */}
      <div className="fixed top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-rose-950/20 to-transparent z-40" />
      <div className="fixed top-0 bottom-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-rose-950/20 to-transparent z-40" />
    </div>
  );
}
