import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";

export default function AudioEngine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  const padIntervalRef = useRef<number | null>(null);
  const delayNodeRef = useRef<DelayNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // A Minor Pentatonic Scale for generative sparkling chimes (in Hz)
  const PENTATONIC_SCALE = [
    220.00, // A3
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25, // E5
    783.99, // G5
    880.00, // A5
  ];

  // Beautiful romantic chords: Am, Fmaj7, C, G6 (in Hz of root/thirds/fifths)
  const ROMANTIC_CHORDS = [
    [110.00, 220.00, 261.63, 329.63], // Am (A2 + A3 + C4 + E4)
    [87.31, 174.61, 261.63, 349.23],  // Fmaj7 / F2 (F1, F2, C4, F4)
    [130.81, 261.63, 329.63, 392.00], // C (C3, C4, E4, G4)
    [98.00, 196.00, 293.66, 392.00],  // G6 (G2, G3, D4, G4)
  ];

  const initAudio = () => {
    if (audioCtxRef.current) return;

    // Create AudioContext safely
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    // Master volume
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.35, ctx.currentTime);
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    // Delay / Echo effect for that cosmic dreamy feel
    const delay = ctx.createDelay(1.0);
    delay.delayTime.setValueAtTime(0.45, ctx.currentTime);

    const delayGain = ctx.createGain();
    delayGain.gain.setValueAtTime(0.4, ctx.currentTime);

    // Feed delay back to itself for echo trails
    delay.connect(delayGain);
    delayGain.connect(delay);
    
    // Connect delay to output
    delayGain.connect(masterGain);
    delayNodeRef.current = delay;
  };

  const playNote = (freq: number, duration: number, volume = 0.08) => {
    const ctx = audioCtxRef.current;
    if (!ctx || ctx.state === "suspended") return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Soft sine wave for beautiful warm chimes
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Fade in and out (Envelope)
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gainNode);
    // Connect directly and also feed to delay for gorgeous echoes
    gainNode.connect(ctx.destination);
    if (delayNodeRef.current) {
      gainNode.connect(delayNodeRef.current);
    }

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  };

  // Play a soft, ambient synthesizer chord pad
  const playSynthesizerPad = (frequencies: number[], duration = 5) => {
    const ctx = audioCtxRef.current;
    if (!ctx || ctx.state === "suspended") return;

    frequencies.forEach((freq) => {
      const osc = ctx.createOscillator();
      const waveShaper = ctx.createWaveShaper();
      const filter = ctx.createBiquadFilter();
      const padGain = ctx.createGain();

      // Triangle/Sine mix makes beautiful atmospheric synth brass
      osc.type = Math.random() > 0.5 ? "sine" : "triangle";
      // Slight detune for cozy warmth
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 1.5, ctx.currentTime);

      // Filter settings for high warmth and no harsh frequencies
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.Q.setValueAtTime(2, ctx.currentTime);

      // Slow envelope attack (takes 2 seconds to swell)
      padGain.gain.setValueAtTime(0, ctx.currentTime);
      padGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2.0);
      padGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(filter);
      filter.connect(padGain);
      if (gainNodeRef.current) {
        padGain.connect(gainNodeRef.current);
      }

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    });
  };

  const startSoundtrack = () => {
    initAudio();

    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    // Play initial chime and pad immediately
    playSynthesizerPad(ROMANTIC_CHORDS[0], 6);
    playNote(PENTATONIC_SCALE[Math.floor(Math.random() * PENTATONIC_SCALE.length)], 2.5);

    // 1. Chime loop: Every 2.4 - 3.8 seconds plays a romantic soft note
    let nextBellTime = 2000;
    const chimeLoop = () => {
      if (!isPlaying) return;
      const note = PENTATONIC_SCALE[Math.floor(Math.random() * PENTATONIC_SCALE.length)];
      playNote(note, 3.5, 0.06);
      
      // Schedule next chime randomly for realistic organic music box
      const delay = Math.random() * 1800 + 1500;
      intervalRef.current = window.setTimeout(chimeLoop, delay);
    };
    intervalRef.current = window.setTimeout(chimeLoop, 1500);

    // 2. Pad loop: Cycle through romantic chords every 5.5 seconds seamlessly
    let chordIdx = 1;
    const padLoop = () => {
      if (!isPlaying) return;
      const chord = ROMANTIC_CHORDS[chordIdx];
      playSynthesizerPad(chord, 6.5);
      
      chordIdx = (chordIdx + 1) % ROMANTIC_CHORDS.length;
      padIntervalRef.current = window.setTimeout(padLoop, 5500);
    };
    padIntervalRef.current = window.setTimeout(padLoop, 5550);
  };

  const stopSoundtrack = () => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
    if (padIntervalRef.current) {
      clearTimeout(padIntervalRef.current);
      padIntervalRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "running") {
      audioCtxRef.current.suspend();
    }
  };

  const toggleSound = () => {
    if (!isPlaying) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      stopSoundtrack();
    }
  };

  // Re-sync loop based on dynamic play state
  useEffect(() => {
    if (isPlaying) {
      startSoundtrack();
    } else {
      stopSoundtrack();
    }
    return () => stopSoundtrack();
  }, [isPlaying]);

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-3">
      {/* Visual glowing indicator when playing */}
      {isPlaying && (
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs rounded-full font-mono font-medium tracking-wide shadow-lg box-glow-pink animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-spin duration-[4000ms]" />
          LOVE_SOUNDSCAPE.SYS
        </span>
      )}

      <button
        id="soundscape-toggle"
        onClick={toggleSound}
        className={`flex items-center justify-center p-3 rounded-full border shadow-2xl transition-all duration-500 cursor-pointer ${
          isPlaying
            ? "bg-rose-600/25 text-rose-200 border-rose-500/50 box-glow-pink scale-105"
            : "bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:border-rose-900 hover:text-rose-400"
        }`}
        title={isPlaying ? "Mute soundtrack" : "Activate cinematic soundscape"}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 text-rose-300 animate-bounce duration-[1500s]" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
