import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, Terminal, AlertTriangle, RefreshCcw, WifiOff, Settings, ShieldAlert } from "lucide-react";

interface RomanticCrashSequenceProps {
  onRestart: () => void;
  onSpawnHearts: (count: number) => void;
  onTriggerFireworks: () => void;
}

type CrashPhase = 
  | "darkness" 
  | "love_stream_slow" 
  | "love_stream_fast" 
  | "sorry_card" 
  | "system_crash" 
  | "dzaddy_love" 
  | "restart_loop";

interface MessageItem {
  id: number;
  text: string;
  x: number;
  y: number;
  scale: number;
  delay: number;
  color: string;
}

export default function RomanticCrashSequence({ onRestart, onSpawnHearts, onTriggerFireworks }: RomanticCrashSequenceProps) {
  const [phase, setPhase] = useState<CrashPhase>("darkness");
  const [spawnedMessages, setSpawnedMessages] = useState<MessageItem[]>([]);
  const [glitchText, setGlitchText] = useState("EMOTION_ENGINE::OPTIMAL");
  const [crashLogs, setCrashLogs] = useState<string[]>([]);
  const [audioPlayed, setAudioPlayed] = useState(false);

  const loveTexts = [
    "I love you", "I love you so much", "I love who you are", 
    "You are my beautiful girl", "Always thinking of you", 
    "You matter to me", "Properly. Consistently.", "My whole heart",
    "I love you baby", "You make me smile", "I love everything about you",
    "My favorite person", "I love you, my beautiful beautiful girl"
  ];

  const colors = [
    "text-pink-300 shadow-pink-500/20",
    "text-purple-300 shadow-purple-500/20",
    "text-rose-300 shadow-rose-500/20",
    "text-amber-200 shadow-amber-500/10",
    "text-pink-150 shadow-pink-400/30",
    "text-rose-200 shadow-rose-400/30"
  ];

  // Sound generator safely using HTML5 Audio Synthesis
  const playAlertTone = (freq = 280, duration = 0.5) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Ignored if browser restrains it
    }
  };

  // 1. Darkness -> Love Stream Flow Phase timings
  useEffect(() => {
    // Stage 1: Absolute Darkness (2.0s) -> slow stream
    const timer1 = setTimeout(() => {
      setPhase("love_stream_slow");
    }, 2200);

    // Stage 2: Slow stream (4s) -> rapid love stream
    const timer2 = setTimeout(() => {
      setPhase("love_stream_fast");
    }, 6200);

    // Stage 3: Fast stream (4.5s) -> apology board
    const timer3 = setTimeout(() => {
      setPhase("sorry_card");
    }, 11000);

    // Stage 4: Apology Board displays (6s) -> Simulated emoting crash!
    const timer4 = setTimeout(() => {
      setPhase("system_crash");
    }, 17500);

    // Stage 5: System reboot with cozy message
    const timer5 = setTimeout(() => {
      setPhase("dzaddy_love");
    }, 23500);

    // Stage 6: Loop selection panel opens
    const timer6 = setTimeout(() => {
      setPhase("restart_loop");
    }, 29500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, []);

  // 2. Spawn Love messages dynamically according to flow velocity
  useEffect(() => {
    if (phase === "love_stream_slow") {
      // Spawn slow messages
      const interval = setInterval(() => {
        const newMessage: MessageItem = {
          id: Date.now() + Math.random(),
          text: loveTexts[Math.floor(Math.random() * loveTexts.length)],
          x: Math.random() * 80 + 10, // keep within margin coordinates
          y: Math.random() * 80 + 10,
          scale: Math.random() * 0.4 + 0.8, // subtle readable size
          delay: 0,
          color: colors[Math.floor(Math.random() * colors.length)]
        };
        setSpawnedMessages((prev) => [...prev, newMessage]);
        onSpawnHearts(2);
        playAlertTone(360, 0.1);
      }, 700);
      return () => clearInterval(interval);
    }

    if (phase === "love_stream_fast") {
      // Spawn fast flooding messages
      const interval = setInterval(() => {
        const nextBatch: MessageItem[] = Array.from({ length: 4 }).map(() => ({
          id: Math.random() + Date.now(),
          text: loveTexts[Math.floor(Math.random() * loveTexts.length)],
          x: Math.random() * 92 + 4,
          y: Math.random() * 92 + 4,
          scale: Math.random() * 0.7 + 1.0, // big glowing text
          delay: 0,
          color: colors[Math.floor(Math.random() * colors.length)]
        }));
        setSpawnedMessages((prev) => [...prev, ...nextBatch]);
        onSpawnHearts(4);
        playAlertTone(440 + Math.random() * 200, 0.08);
      }, 150);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // 3. Simulated OS crash typewriter logs
  useEffect(() => {
    if (phase === "system_crash") {
      const logs = [
        "FATAL ERROR :: SENSORY_OVERLOAD",
        "EMOTION_VOLUME_DETECTED: 100,000,000,000 TB",
        "HEARTBEAT_RATIO: 180bpm [OVER_MAXIMUM_SAFE_LIMIT]",
        "UNCONDITIONAL_DEVOTION_OVERHEAD_RATIO :: INFINITE",
        "CORRUPTION: NONE DETECTED",
        "EXCEPTION: PRETTY_EYES_BUFFER_OVERFLOW",
        "STACK_TRACE: herSmile() was called recursively...",
        "SYSTEM LOCKDOWN PREVENTING SHUTDOWN FROM EXCESSIVE ATTACHMENT",
        "EMERGENCY SEQUENCING CRASHED...",
        "INITIALIZING REBOOT FOR LIL MAMA..."
      ];

      logs.forEach((log, index) => {
        setTimeout(() => {
          setCrashLogs((prev) => [...prev, log]);
          playAlertTone(150 + index * 30, 0.15);
        }, index * 450);
      });
    }
  }, [phase]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans select-none bg-black">
      <AnimatePresence mode="wait">

        {/* --- STAGE 1: THE COMPLETE Pitch Darkness --- */}
        {phase === "darkness" && (
          <motion.div
            key="darkness"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-black flex flex-col items-center justify-center text-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: [0, 0.4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="text-stone-700 font-mono text-[9px] uppercase tracking-[0.5em]"
            >
              Absolute Devotion Lockdown initiated...
            </motion.div>
          </motion.div>
        )}


        {/* --- STAGE 2: THE GLOWING LOVE FLOW STREAMS (SLOW & FAST) --- */}
        {(phase === "love_stream_slow" || phase === "love_stream_fast") && (
          <motion.div
            key="stream"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 bg-neutral-950/95 flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute top-[30%] left-[30%] w-[50%] h-[50%] bg-purple-900/40 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-pink-900/30 rounded-full blur-[140px]" />
            </div>

            {/* Background floating watermarks of big hearts */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-15">
              <Heart className="w-[450px] h-[450px] text-pink-500 fill-pink-500 animate-pulse duration-[3s]" />
            </div>

            {/* Spawned 'I love you' messages with glowing typography */}
            <div className="absolute inset-0 z-10 p-4">
              {spawnedMessages.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.4, filter: "blur(6px)" }}
                  animate={{ opacity: 1, scale: item.scale, filter: "blur(0px)" }}
                  className={`absolute font-serif italic text-glow-pink font-extrabold select-none pointer-events-none transition-shadow ${item.color}`}
                  style={{ left: `${item.x}%`, top: `${item.y}%`, transform: "translate(-50%, -50%)" }}
                >
                  {item.text}
                </motion.div>
              ))}
            </div>

            {/* Header info HUD indicator */}
            <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center text-[9px] font-mono tracking-[0.3em] uppercase text-pink-400">
              <span className="flex items-center gap-1.5 animate-pulse">
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-ping" />
                VALENTINE_EMOTION_BANDWIDTH_BURST: OVER 100%
              </span>
              <span>
                {phase === "love_stream_fast" ? "FLOW: ULTRA_VELOCITY" : "FLOW: GRADUAL_ALIGNMENT"}
              </span>
            </div>
          </motion.div>
        )}


        {/* --- STAGE 3: THE HEARTFELT APOLOGY BOARD --- */}
        {phase === "sorry_card" && (
          <motion.div
            key="sorry_card"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -40, scale: 1.05 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 bg-[#0d0417] flex items-center justify-center p-4 md:p-8"
          >
            {/* Background atmospheric velvet red aura */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-radial-gradient(circle at center, rgba(244, 63, 94, 0.15) 0%, transparent 70%)" />
            </div>

            <div className="w-full max-w-2xl bg-[#090311]/90 border border-pink-500/30 backdrop-blur-2xl rounded-[36px] p-8 md:p-14 text-center shadow-[0_0_80px_rgba(244,63,94,0.35)] box-glow-pink relative">
              <div className="absolute top-4 left-4 font-mono text-[8px] tracking-[0.4em] text-pink-500/50">
                SYSTEMS::DESIRED_SETTLEMENT
              </div>

              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 4, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <Heart className="w-16 h-16 text-rose-500 fill-rose-500 filter drop-shadow-[0_0_20px_rgba(244,63,94,0.8)]" />
                </motion.div>
              </div>

              {/* Big, beautiful I am sorry sign */}
              <h1 className="font-serif text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-rose-100 to-amber-200 tracking-tight italic mb-8 drop-shadow-md leading-tight">
                l am sorry
              </h1>

              <div className="space-y-6 text-stone-200 tracking-wide">
                <p className="font-serif text-xl md:text-2xl font-light italic text-pink-300">
                  “ l hope this made u smile ”
                </p>
                <div className="h-[2px] w-24 bg-gradient-to-r from-purple-600 to-rose-500 mx-auto rounded-full my-6 opacity-60" />
                <p className="font-sans text-base md:text-lg text-stone-300 leading-relaxed font-light font-sans tracking-normal max-w-lg mx-auto">
                  l dont like it when we dont talk.
                </p>
              </div>

              <div className="mt-12 text-[10px] text-zinc-500 font-mono uppercase tracking-[0.3em] animate-pulse">
                Emotion buffer filling to limit... Critical Exception Imminent
              </div>
            </div>
          </motion.div>
        )}


        {/* --- STAGE 4: GLITCH ERROR / KERNEL CRASH PANIC --- */}
        {phase === "system_crash" && (
          <motion.div
            key="crash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-950 font-mono text-emerald-400 p-6 flex flex-col justify-between overflow-hidden text-xs md:text-sm"
          >
            {/* Horizontal glitch lines sweep */}
            <div className="absolute inset-0 bg-scanlines pointer-events-none opacity-25 z-20" />

            <div className="space-y-3 z-10 max-w-4xl">
              <div className="flex items-center gap-3 p-4.5 bg-rose-950/20 border border-rose-900/40 rounded-xl text-rose-400 animate-pulse font-bold mb-6">
                <ShieldAlert className="w-6 h-6 text-rose-500 animate-bounce" />
                <div>
                  <h3 className="text-sm font-bold tracking-widest uppercase">CRITICAL CRASH: SENSORY_EMOTION_OVERLOAD</h3>
                  <p className="text-[10px] lowercase tracking-normal font-light">The core processor failed to scale when love metrics exceeded designated float values.</p>
                </div>
              </div>

              {/* Typewriter simulated diagnostic errors stacking */}
              <div className="space-y-1 text-[11px] md:text-xs">
                {crashLogs.map((log, index) => (
                  <div key={index} className={log.includes("FATAL") || log.includes("CRITICAL") ? "text-red-450 font-bold" : "text-zinc-400 font-mono"}>
                    <span className="text-zinc-600 mr-2">[{new Date().toLocaleTimeString()} :: CORE]</span>
                    &gt; {log}
                  </div>
                ))}
              </div>
            </div>

            {/* Crash screen center blinking panic indicator */}
            <div className="flex flex-col items-center justify-center py-6 text-center z-10 gap-2">
              <div className="flex justify-center gap-1.5">
                <span className="w-3 h-3 bg-red-600 rounded-full animate-ping" />
                <span className="w-3 h-3 bg-red-600 rounded-full" />
              </div>
              <span className="text-glow-rose text-red-500 uppercase tracking-widest text-[9px] font-bold">
                SYSTEM EXCEPTION AT SECTOR: LOVE_CORE_V1.0
              </span>
            </div>

            {/* Terminal bottom label */}
            <div className="border-t border-zinc-900 pt-3 flex justify-between items-center text-[10px] text-zinc-600 z-10">
              <span>LOVE_KERN_PANIC // STACK_OVERFLOW</span>
              <span>REBOOT_SEQUENCE_AUTOMATED :: 100% READY</span>
            </div>
          </motion.div>
        )}


        {/* --- STAGE 5: SYSTEM ENERGETIC HEART CENTER REBOOT (Hey please smile for Dzaddy D) --- */}
        {phase === "dzaddy_love" && (
          <motion.div
            key="dzaddy"
            initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="absolute inset-0 bg-[#070110] flex flex-col items-center justify-center p-6 text-center"
          >
            {/* A massive glowing heart pulsing deeply in the center of the viewport */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
              <motion.div
                animate={{
                  scale: [1, 1.15, 0.95, 1.15, 1],
                  filter: [
                    "drop-shadow(0 0 40px rgba(244,63,94,0.5))",
                    "drop-shadow(0 0 95px rgba(244,63,94,0.9))",
                    "drop-shadow(0 0 40px rgba(244,63,94,0.5))"
                  ]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5,
                  ease: "easeInOut"
                }}
              >
                <Heart className="w-[300px] md:w-[480px] h-[300px] md:h-[480px] text-rose-500 fill-rose-600 opacity-20" />
              </motion.div>
            </div>

            <div className="relative z-10 space-y-8">
              <div className="flex justify-center gap-1">
                <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                <Sparkles className="w-8 h-8 text-yellow-300 animate-spin duration-[4000ms]" />
              </div>

              <motion.h1 
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2 }}
                className="font-serif text-glow-pink text-4xl md:text-6xl font-extrabold italic bg-gradient-to-b from-pink-150 via-rose-100 to-rose-350 bg-clip-text text-transparent leading-snug tracking-tight max-w-2xl"
              >
                “ heyyyy please smile for Dzaddy D ”
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="font-mono text-[10px] uppercase tracking-[0.4em] text-pink-400"
              >
                Unconditional connection successfully established
              </motion.p>
            </div>
          </motion.div>
        )}


        {/* --- STAGE 6: THE BEAUTIFUL LOOP OPTION (Restart Sequence) --- */}
        {phase === "restart_loop" && (
          <motion.div
            key="restart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-neutral-950/98 flex items-center justify-center p-6 text-center"
          >
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute top-[20%] left-[20%] w-[50%] h-[50%] bg-purple-950/30 rounded-full blur-[120px]" />
              <div className="absolute bottom-[20%] right-[20%] w-[50%] h-[50%] bg-pink-950/30 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-lg bg-[#0e0319]/90 border border-purple-500/25 backdrop-blur-2xl rounded-3xl p-8 md:p-12 shadow-[0_0_60px_rgba(168,85,247,0.2)] text-center relative z-10 box-glow-pink">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-800 to-rose-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border border-purple-500/30">
                <Heart className="w-6 h-6 text-pink-100 fill-pink-100 animate-pulse" />
              </div>

              <h2 className="font-serif text-3xl text-stone-100 font-normal tracking-tight mb-4">
                The End of the Script.
              </h2>
              
              <p className="font-sans text-stone-350 text-xs md:text-sm leading-relaxed mb-8 font-light italic">
                I made this entirely for you, to stay on the web whenever you need a reminder that you matter, my beautiful girl. Would you like to experience this whole journey again?
              </p>

              <button
                id="interactive-loop-reset"
                onClick={() => {
                  onTriggerFireworks();
                  onSpawnHearts(30);
                  setTimeout(() => {
                    onRestart();
                  }, 650);
                }}
                className="w-full relative overflow-hidden flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-purple-800 via-rose-750 to-purple-800 hover:from-purple-700 hover:to-rose-600 border border-purple-600/30 hover:border-pink-300 text-pink-50 font-sans text-xs uppercase tracking-[0.2em] font-bold rounded-2xl cursor-pointer shadow-lg hover:shadow-[0_0_35px_rgba(244,63,94,0.4)] transition-all duration-300 group"
              >
                <RefreshCcw className="w-4 h-4 text-pink-200 group-hover:rotate-180 transition-transform duration-700" />
                <span>RESTART WHOLE EXPERIENCE</span>
              </button>

              <div className="mt-8 pt-6 border-t border-purple-950/40 font-mono text-[9px] text-zinc-650 uppercase tracking-widest block">
                Love OS v1.0.24 // Unconditional Devotion Stream
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
