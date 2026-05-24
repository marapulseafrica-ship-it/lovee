import React, { ReactNode } from "react";
import { motion } from "motion/react";

interface ScrollSectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  glowColor?: "pink" | "gold" | "none";
}

export default function ScrollSection({
  children,
  id,
  className = "",
  glowColor = "none",
}: ScrollSectionProps) {
  // Set up different glowing background clouds
  const glowClasses = {
    pink: "after:absolute after:inset-0 after:rounded-3xl after:-z-10 after:bg-rose-500/5 after:blur-3xl after:opacity-60",
    gold: "after:absolute after:inset-0 after:rounded-3xl after:-z-10 after:bg-amber-500/5 after:blur-3xl after:opacity-60",
    none: "",
  };

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-15% 0px -15% 0px" }}
      transition={{
        duration: 1.1,
        ease: [0.16, 1, 0.3, 1], // Epic customized ease-out curve
      }}
      className={`relative min-h-screen flex items-center justify-center py-20 px-4 md:px-8 overflow-hidden ${className}`}
    >
      <div
        className={`w-full max-w-3xl bg-white/5 border border-white/10 backdrop-blur-md rounded-[32px] p-8 md:p-14 shadow-2xl transition-all duration-700 hover:border-rose-500/30 hover:bg-white/[0.08] relative ${glowClasses[glowColor]}`}
      >
        {children}
      </div>
    </motion.section>
  );
}
