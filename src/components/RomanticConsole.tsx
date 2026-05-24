import React, { useState, useEffect } from "react";
import { Heart, ShieldCheck, Activity, Send, MessageSquareHeart, Sparkles } from "lucide-react";

interface RomanticConsoleProps {
  onSpawnHearts: (count: number) => void;
  onTriggerFireworks: () => void;
}

export default function RomanticConsole({ onSpawnHearts, onTriggerFireworks }: RomanticConsoleProps) {
  const [heartRate, setHeartRate] = useState(72);
  const [messages, setMessages] = useState<string[]>(() => {
    const saved = localStorage.getItem("love_os_thoughts");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      "I love how comfortable we are together, even in the quietest moments.",
      "You make my world feel brighter, softer, and more meaningful.",
      "Just a little record safe in Love OS: you are my absolute favorite person."
    ];
  });
  const [typedThought, setTypedThought] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Simulate a heart rate that goes up when scrolling or interacting
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate((prev) => {
        const base = 72;
        const flux = Math.floor(Math.sin(Date.now() / 10000) * 12);
        return base + flux + Math.floor(Math.random() * 4);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAddThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedThought.trim()) return;

    const updated = [typedThought.trim(), ...messages];
    setMessages(updated);
    localStorage.setItem("love_os_thoughts", JSON.stringify(updated));
    setTypedThought("");
    
    // Trigger emotional reaction burst
    onSpawnHearts(25);
  };

  const handleClearThoughts = () => {
    const reset = [
      "I love how comfortable we are together, even in the quietest moments.",
      "You make my world feel brighter, softer, and more meaningful."
    ];
    setMessages(reset);
    localStorage.setItem("love_os_thoughts", JSON.stringify(reset));
  };

  return (
    <>
      {/* Floating Pill Toggle on the Left boundary */}
      <div className="fixed bottom-6 left-6 z-40 transition-all duration-300">
        <button
          id="toggle-romantic-console"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-3 rounded-full border shadow-2xl transition-all duration-300 backdrop-blur-md cursor-pointer text-sm font-mono ${
            isOpen
              ? "bg-rose-950/90 text-rose-200 border-rose-500/50 box-glow-pink"
              : "bg-neutral-900/95 text-neutral-300 border-neutral-800 hover:border-rose-900/50 hover:text-rose-300"
          }`}
        >
          <Activity className={`w-4 h-4 text-rose-400 ${isOpen ? "animate-pulse" : ""}`} />
          {isOpen ? "CLOSE CORE STATUS" : "VIEW LOVE_OS STATUS"}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
        </button>
      </div>

      {/* Retro-Romantic Futuristic OS Terminal Panel */}
      {isOpen && (
        <div
          id="romantic-console"
          className="fixed bottom-24 left-6 z-40 w-[90vw] md:w-[380px] h-[480px] bg-neutral-950/95 border border-rose-950/60 rounded-2xl shadow-2xl flex flex-col backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-300 box-glow-pink"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-rose-950/20 border-b border-rose-950/30">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
              <span className="font-mono text-xs font-bold text-rose-300 tracking-wider">LOVE_OS // CONNECTED_STATE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[10px] text-zinc-400">HER_VERSION_1.0</span>
            </div>
          </div>

          {/* Stats Scroll Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-zinc-300 text-xs">
            {/* Real-time Diagnostics HUD Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-rose-950/5 border border-rose-950/20 rounded-xl p-3 flex flex-col">
                <span className="text-zinc-500 font-mono text-[10px] tracking-wide">SYSTEM MEMORY</span>
                <span className="font-serif text-base text-rose-200 mt-1 font-semibold">100% HER</span>
                <span className="text-[9px] text-zinc-400 font-mono">0KB remaining</span>
              </div>
              <div className="bg-rose-950/5 border border-rose-950/20 rounded-xl p-3 flex flex-col">
                <span className="text-zinc-500 font-mono text-[10px] tracking-wide">EMOTIONAL CORE</span>
                <span className="font-serif text-base text-zinc-200 mt-1 font-semibold">Settled & Warm</span>
                <span className="text-[9px] text-rose-400 font-mono">Quietly devoted</span>
              </div>
              <div className="bg-rose-950/5 border border-rose-950/20 rounded-xl p-3 flex flex-col">
                <span className="text-zinc-500 font-mono text-[10px] tracking-wide">HEARTBEAT SYNC</span>
                <span className="font-serif text-base text-rose-400 mt-1 font-semibold flex items-center gap-1.5 font-bold">
                  {heartRate} <span className="text-[10px] text-zinc-400">BPM</span>
                </span>
                <span className="text-[9px] text-rose-500 font-mono">Pulsing consistently</span>
              </div>
              <div className="bg-rose-950/5 border border-rose-950/20 rounded-xl p-3 flex flex-col">
                <span className="text-zinc-500 font-mono text-[10px] tracking-wide">CONNECTION SECURE</span>
                <span className="font-serif text-base text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                  100% <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </span>
                <span className="text-[9px] text-zinc-400 font-mono">Synced with feelings</span>
              </div>
            </div>

            {/* Diagnostics Actions */}
            <div className="border border-neutral-900 border-dashed rounded-xl p-3.5 space-y-2.5">
              <span className="text-rose-300 font-mono text-[10px] uppercase font-bold tracking-wider block">Affection Diagnostics</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="diagnostics-hearts"
                  onClick={() => onSpawnHearts(15)}
                  className="bg-rose-900/20 hover:bg-rose-900/30 border border-rose-900/40 hover:border-rose-500 text-rose-200 rounded-lg py-2 cursor-pointer font-mono font-medium text-[11px] transition-all flex items-center justify-center gap-1"
                >
                  <Heart className="w-3 h-3 fill-rose-500 text-rose-500" /> +15 Hearts
                </button>
                <button
                  id="diagnostics-sparks"
                  onClick={onTriggerFireworks}
                  className="bg-amber-950/20 hover:bg-amber-950/30 border border-amber-900/40 hover:border-amber-500 text-amber-200 rounded-lg py-2 cursor-pointer font-mono font-medium text-[11px] transition-all flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-400 animate-bounce" /> Spark Firework
                </button>
              </div>
            </div>

            {/* Memory Write Diary Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <MessageSquareHeart className="w-3.5 h-3.5 text-rose-400" /> Encrypted Thoughts Logs ({messages.length})
                </span>
                <button
                  onClick={handleClearThoughts}
                  className="text-[9px] text-zinc-500 hover:text-rose-400 underline font-mono cursor-pointer"
                >
                  RESET LOGS
                </button>
              </div>

              {/* Form Input */}
              <form onSubmit={handleAddThought} className="flex gap-2">
                <input
                  type="text"
                  maxLength={120}
                  value={typedThought}
                  onChange={(e) => setTypedThought(e.target.value)}
                  placeholder="Record a silent thought or feeling..."
                  className="flex-1 bg-zinc-900/70 border border-zinc-800 focus:border-rose-500/50 rounded-lg px-3 py-2 text-[11px] text-zinc-200 focus:outline-none placeholder-zinc-650 transition-all"
                />
                <button
                  type="submit"
                  className="p-2 bg-rose-600/35 hover:bg-rose-600/50 border border-rose-500/35 text-rose-200 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Send className="w-3 h-3" />
                </button>
              </form>

              {/* Thoughts Lists - beautifully scrolled */}
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-neutral-900/40 rounded-lg border border-neutral-900 font-serif leading-relaxed italic text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    “ {msg} ”
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer status line */}
          <div className="px-4 py-2 bg-neutral-900/30 border-t border-rose-950/20 text-center text-[9px] font-mono text-zinc-500">
            LOVE OS ACTIVE IN THIS CONTAINER // DEV STREAK: ∞
          </div>
        </div>
      )}
    </>
  );
}
