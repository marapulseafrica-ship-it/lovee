import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, HelpCircle, ShieldAlert, Sparkles, Send, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";

interface RomanticGateProps {
  onSuccess: () => void;
  onSpawnHearts: (count: number) => void;
  onTriggerFireworks: () => void;
}

type GatePhase = "intro" | "wait" | "verify" | "sexy" | "welcomeback" | "decrypting";

export default function RomanticGate({ onSuccess, onSpawnHearts, onTriggerFireworks }: RomanticGateProps) {
  const [phase, setPhase] = useState<GatePhase>("intro");
  const [inputValue, setInputValue] = useState("");
  const [validationError, setValidationError] = useState("");
  const [decryptProgress, setDecryptProgress] = useState(0);
  const [decryptStatus, setDecryptStatus] = useState("Initializing connection...");

  // Exactly what she asked for: "Hi Lil mama my beautiful beautiful girl oh how much l love you"
  const introWords = [
    { word: "Hi", delay: 0.1 },
    { word: "Lil", delay: 0.22 },
    { word: "mama", delay: 0.34 },
    { word: "my", delay: 0.46 },
    { word: "beautiful", delay: 0.58 },
    { word: "beautiful", delay: 0.7 },
    { word: "girl", delay: 0.82 },
    { word: "oh", delay: 0.94 },
    { word: "how", delay: 1.06 },
    { word: "much", delay: 1.18 },
    { word: "l", delay: 1.3 },
    { word: "love", delay: 1.42 },
    { word: "you", delay: 1.54 },
  ];

  const handleProceedClick = () => {
    onSpawnHearts(35);
    setPhase("wait");
  };

  // Phase 2 WAIT screen logic: automatic transition to phase 3
  useEffect(() => {
    if (phase === "wait") {
      const timer = setTimeout(() => {
        onTriggerFireworks();
        onSpawnHearts(20);
        setPhase("verify");
      }, 3500); // Dramatic 3.5s delay
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Phase 4 SEXY screen logic: automatic transition to phase 5 (welcome back)
  useEffect(() => {
    if (phase === "sexy") {
      const timer = setTimeout(() => {
        setPhase("welcomeback");
      }, 4000); // 4.0s of pure romance statement
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Phase 5 WELCOME BACK screen logic: automatic transition to decryption
  useEffect(() => {
    if (phase === "welcomeback") {
      const timer = setTimeout(() => {
        setPhase("decrypting");
      }, 3500); // Cool Welcome Back animation
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Phase 6 Decryption progress simulation -> proceeds to main app
  useEffect(() => {
    if (phase === "decrypting") {
      let current = 0;
      const statusSteps = [
        "Connecting to love core servers...",
        "Decrypting unconditionally saved messages...",
        "Measuring heartbeat synchronicity...",
        "Aligning cosmic coordinates of may 2026...",
        "Parsing smiles & long walks context...",
        "Preparing unconditional feelings stream..."
      ];

      const interval = setInterval(() => {
        current += Math.random() * 6.5 + 3.5;
        if (current >= 100) {
          current = 100;
          clearInterval(interval);
          setDecryptProgress(100);
          setDecryptStatus("Connection found 100% ❤️");
          onTriggerFireworks();
          
          setTimeout(() => {
            onSuccess();
          }, 2200);
        } else {
          setDecryptProgress(Math.floor(current));
          const stepIndex = Math.min(
            Math.floor((current / 100) * statusSteps.length),
            statusSteps.length - 1
          );
          setDecryptStatus(statusSteps[stepIndex]);
          if (Math.random() > 0.6) {
            onSpawnHearts(5);
          }
        }
      }, 150);

      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = inputValue.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    // Check if answer contains "20"
    const isCorrect = 
      cleanInput.includes("20") || 
      cleanInput.includes("twenty") || 
      cleanInput.includes("20th");

    if (isCorrect) {
      setValidationError("");
      onSpawnHearts(40);
      onTriggerFireworks();
      setPhase("sexy");
    } else {
      onSpawnHearts(5);
      setValidationError(
        "❌ Access Denied: Date did not match the core spark. Please think carefully, my beautiful girl!"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d041c] px-4 overflow-hidden select-none">
      
      {/* Intensely Romantic Purple/Violet Atmospheric Glow Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] bg-purple-900/45 rounded-full blur-[140px] animate-pulse duration-[10000ms]" />
        <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] bg-rose-950/35 rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-radial-gradient(ellipse at center, transparent 0%, rgba(13, 4, 28, 0.95) 100%)" />
      </div>

      <AnimatePresence mode="wait">

        {/* --- PHASE 1: LOGIN PAGE INTRO --- */}
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -45 }}
            className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center py-12 px-6 min-h-[580px] justify-between"
          >
            {/* BIG pulsate back-glow heart directly in central coordinates */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-40">
              <motion.svg
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-[300px] md:w-[500px] h-[300px] md:h-[500px] text-purple-700/20 filter drop-shadow-[0_0_100px_rgba(244,63,94,0.4)] stroke-purple-500/10"
                animate={{ 
                  scale: [1, 1.08, 0.96, 1.08, 1],
                  rotate: [0, 2, -2, 2, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3, 
                  ease: "easeInOut" 
                }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </motion.svg>
            </div>

            {/* Sub-header decoration */}
            <div className="relative z-10 flex items-center gap-2 mb-6 font-mono text-[10px] tracking-[0.4em] text-pink-400 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" />
              <span>LOVE_CONNECTION_PORTAL :: UNCONDITIONAL</span>
            </div>

            {/* WORDS FALLING FROM UP IN A COOL WAY */}
            <div className="relative z-10 flex-1 flex items-center justify-center py-10">
              <div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-5 gap-y-4 max-w-xl">
                {introWords.map((item, index) => (
                  <motion.span
                    key={index}
                    initial={{ y: -650, opacity: 0, scale: 0.3 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{
                      type: "spring",
                      damping: 14,
                      stiffness: 65,
                      delay: item.delay,
                    }}
                    className="inline-block font-serif text-3xl md:text-5xl italic font-semibold text-transparent bg-clip-text bg-gradient-to-b from-purple-200 via-pink-150 to-rose-200 drop-shadow-[0_4px_16px_rgba(244,63,94,0.45)] select-none hover:scale-115 hover:text-pink-100 transition-transform duration-350 cursor-default"
                  >
                    {item.word}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Proceed Click Target */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5 }}
              className="relative z-10 mt-8 flex flex-col items-center gap-4 w-full"
            >
              <button
                id="gate-proceed-action"
                onClick={handleProceedClick}
                className="relative overflow-hidden flex items-center gap-4 px-12 py-5 rounded-full font-serif text-lg font-bold uppercase tracking-widest text-pink-50 cursor-pointer bg-gradient-to-r from-purple-900/65 via-rose-900/65 to-purple-900/65 border border-purple-500/40 hover:border-pink-300 shadow-[0_0_35px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(244,63,94,0.6)] transition-all duration-500 scale-100 hover:scale-105 active:scale-95 group"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <Heart className="w-5.5 h-5.5 text-rose-500 fill-rose-500 group-hover:scale-125 transition-transform" />
                <span>click to proceed</span>
                <Heart className="w-5.5 h-5.5 text-rose-500 fill-rose-500 group-hover:scale-125 transition-transform" />
              </button>
              
              <span className="font-mono text-[9px] text-zinc-500 tracking-wider">
                Only for my beautiful girl // Protected Stream
              </span>
            </motion.div>
          </motion.div>
        )}


        {/* --- PHASE 2: DRAMATIC WAIT SHOCK FROM THE SKY --- */}
        {phase === "wait" && (
          <motion.div
            key="wait"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative z-10 flex flex-col items-center justify-center text-center p-6 min-h-[400px]"
          >
            {/* Alert Status Sign */}
            <div className="flex items-center gap-2.5 mb-8 font-mono text-xs text-red-400 tracking-[0.3em] uppercase">
              <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
              <span>DRAMATIC_ALERT::PREPARING_GATES</span>
            </div>

            {/* Falling BIG wait with dramatic feel */}
            <motion.h1
              initial={{ y: -900, scale: 0.3, rotate: -35 }}
              animate={{ 
                y: 0, 
                scale: 1, 
                rotate: 0,
              }}
              transition={{
                type: "spring",
                damping: 9,
                stiffness: 65,
                duration: 1.8,
              }}
              className="text-8xl md:text-9xl lg:text-[190px] font-sans font-black tracking-black uppercase text-glow-pink select-none leading-none bg-gradient-to-b from-rose-500 via-purple-500 to-rose-950 bg-clip-text text-transparent filter drop-shadow-[0_15px_60px_rgba(244,63,94,0.85)]"
            >
              WAIT
            </motion.h1>

            {/* Status indicator description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="font-mono text-pink-300 text-xs md:text-sm tracking-widest uppercase mt-12 animate-pulse"
            >
              Authenticating emotional credentials... Standby, baby
            </motion.p>
          </motion.div>
        )}


        {/* --- PHASE 3: QUESTIONNAIRE VERIFICATION --- */}
        {phase === "verify" && (
          <motion.div
            key="verify"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            className="relative z-10 w-full max-w-lg bg-neutral-950/85 border border-purple-800/40 backdrop-blur-2xl rounded-[32px] p-8 md:p-12 shadow-[0_0_60px_rgba(168,85,247,0.25)] text-center box-glow-pink"
          >
            <div className="flex items-center justify-center gap-2 mb-6 text-purple-400 font-mono text-[10px] tracking-widest uppercase">
              <HelpCircle className="w-4.5 h-4.5 text-purple-400 animate-bounce" />
              <span>IDENTITY CHALLENGE</span>
            </div>

            <h2 className="font-serif text-2xl md:text-3xl text-zinc-100 min-h-[70px] leading-relaxed mb-4 font-normal">
              “ Just to verify its real you reading this... ”
            </h2>
            <p className="font-sans text-stone-300 text-sm md:text-base tracking-wide font-light mb-8 italic">
              What is the date of our anniversary? (every month)
            </p>

            <form onSubmit={handleVerifySubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  required
                  autoFocus
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (validationError) setValidationError("");
                  }}
                  placeholder="e.g. 20th"
                  className="w-full bg-black/60 border border-purple-800/40 focus:border-rose-400/85 rounded-2xl px-6 py-5 text-lg text-pink-50 text-center font-serif focus:outline-none transition-all placeholder-zinc-600 focus:shadow-[0_0_20px_rgba(244,63,94,0.25)]"
                />
                <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-30">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                </div>
              </div>

              {validationError && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-950/35 border border-red-900/40 text-red-350 text-xs rounded-xl font-mono leading-relaxed"
                >
                  {validationError}
                </motion.div>
              )}

              <button
                type="submit"
                className="w-full py-4.5 bg-gradient-to-r from-purple-800 via-rose-750 to-purple-800 hover:from-purple-700 hover:to-rose-600 border border-purple-600/30 hover:border-pink-300 text-pink-50 font-sans text-xs uppercase tracking-[0.25em] font-bold rounded-2xl cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                <span>VERIFY FEELINGS</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-purple-950/40">
              <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest block">
                Security key verification required for sentiment decryption
              </span>
            </div>
          </motion.div>
        )}


        {/* --- PHASE 4: THE CONFESSION STATEMENT --- */}
        {phase === "sexy" && (
          <motion.div
            key="sexy"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -30, filter: "blur(12px)" }}
            className="relative z-10 w-full max-w-2xl px-6 text-center text-glow-pink"
          >
            <div className="flex justify-center gap-4 mb-8">
              <Sparkles className="w-9 h-9 text-amber-300 animate-pulse duration-[3s]" />
              <Heart className="w-12 h-12 text-rose-500 fill-rose-500 animate-bounce" />
              <Sparkles className="w-9 h-9 text-amber-300 animate-pulse duration-[3s]" />
            </div>

            <motion.h1
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="font-serif text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-rose-200 to-amber-200 tracking-tight leading-snug italic font-extrabold"
            >
              “ heyyyyyyy Sexxyyyy... ”
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="font-serif text-2xl md:text-4xl text-rose-200 italic tracking-wide mt-8 leading-relaxed font-light"
            >
              l bet you looked hot today.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, delay: 2.2 }}
              className="mt-14 text-zinc-500 font-mono text-[10px] tracking-[0.25em] uppercase"
            >
              Transitioning sequence to secure welcome stack...
            </motion.div>
          </motion.div>
        )}


        {/* --- PHASE 5: COOL NOT BASIC WELCOME BACK TRANSITION --- */}
        {phase === "welcomeback" && (
          <motion.div
            key="welcomeback"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -30 }}
            className="relative z-10 w-full max-w-xl bg-purple-950/20 border border-purple-500/30 backdrop-blur-2xl rounded-[32px] p-8 md:p-14 shadow-3xl text-center box-glow-pink"
          >
            {/* Animated rotating holographic circle around icon */}
            <div className="relative w-28 h-28 mx-auto mb-8 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full border border-dashed border-rose-500/40"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-2 rounded-full border border-double border-purple-400/30"
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 7, ease: "linear" }}
              />
              <Heart className="w-10 h-10 text-rose-500 fill-rose-500 animate-pulse duration-1000" />
            </div>

            {/* Glowing typography display */}
            <h1 className="font-serif text-4xl md:text-5xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-pink-50 via-purple-100 to-rose-200 leading-tight mb-4 select-none tracking-tight">
              Welcome back.
            </h1>
            
            <p className="font-sans text-stone-350 text-xs md:text-sm tracking-[0.2em] uppercase font-semibold text-rose-300 mb-6">
              Initiating Deep Heart Decryption Stream
            </p>

            <div className="flex justify-center gap-1.5 font-mono text-[9px] text-zinc-400">
              <span className="px-2.5 py-1 bg-purple-950/60 border border-purple-800/30 rounded-md">ACCESS_GRNTED</span>
              <span className="px-2.5 py-1 bg-purple-950/60 border border-purple-800/30 rounded-md">AUTHENTIC_HER</span>
              <span className="px-2.5 py-1 bg-purple-950/60 border border-purple-800/30 rounded-md">SECURE_100%</span>
            </div>
          </motion.div>
        )}


        {/* --- PHASE 6: SECURE DECRYPTION PROGRESS STAGE --- */}
        {phase === "decrypting" && (
          <motion.div
            key="decrypting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 w-full max-w-xl bg-[#090314]/95 border border-purple-800/40 rounded-3xl p-8 md:p-12 shadow-3xl text-left box-glow-pink flex flex-col justify-between"
          >
            {/* Holographic Header */}
            <div className="flex items-center justify-between border-b border-purple-950 pb-5 mb-8">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5.2 h-5.2 text-emerald-400 animate-pulse" />
                <span className="font-mono text-xs font-bold text-emerald-400 tracking-[0.15em] uppercase">connection found 100 percentage</span>
              </div>
              <span className="text-zinc-550 text-[10px] font-mono tracking-wider">ANNIVERSARY::APPROVED_20TH</span>
            </div>

            {/* Data Progress and Stats */}
            <div className="flex-1 flex flex-col justify-center py-6">
              <div className="space-y-4 font-mono text-xs text-zinc-300">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-[#f43f5e] mb-4">
                  <span className="animate-pulse">{decryptStatus}</span>
                  <span className="font-mono text-pink-400">{decryptProgress}%</span>
                </div>
                
                {/* Custom Glow Progress Indicator */}
                <div className="h-3.5 bg-neutral-950 rounded-full w-full overflow-hidden border border-purple-900/40 p-0.5 shadow-inner">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-600 via-rose-500 to-amber-400 rounded-full shadow-[0_0_10px_#f43f5e]"
                    style={{ width: `${decryptProgress}%` }}
                    layoutId="decryption-beam"
                  />
                </div>
              </div>

              {/* Heart popup on decryption success */}
              {decryptProgress >= 100 && (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.9, type: "spring", damping: 11, stiffness: 85 }}
                  className="mt-10 flex flex-col items-center justify-center gap-4"
                >
                  <Heart className="w-24 h-24 text-rose-500 fill-rose-500 filter drop-shadow-[0_0_35px_rgba(244,63,94,0.9)] animate-pulse" />
                  <span className="font-serif text-rose-250 text-xl italic text-glow-pink font-light">
                    Unconditional stream established. Entering...
                  </span>
                </motion.div>
              )}
            </div>

            {/* Terminal output footer info */}
            <div className="mt-8 border-t border-purple-950/60 pt-4 text-[9px] text-zinc-650 font-mono flex justify-between items-center uppercase tracking-wider">
              <span>DECRYPTING FEELINGS LOGS...</span>
              <span>NO_CORRUPTION_DETECTED // STREAM_SECURE</span>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
