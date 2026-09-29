import React from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface SectionTransitionDividerProps {
  label?: string;
  theme?: "gold" | "sage" | "amber";
  className?: string;
}

export default function SectionTransitionDivider({
  label,
  theme = "gold",
  className = ""
}: SectionTransitionDividerProps) {
  // Color palette options
  const colorMap = {
    gold: {
      lineCore: "via-[#f6c86b]",
      lineGlow: "via-[#f6c86b]/40",
      centerGlow: "rgba(246, 200, 107, 0.75)",
      accentBorder: "border-[#f6c86b]/80",
      pulseColor: "bg-[#fff6da]",
      textGlow: "text-[#ffe6a6]"
    },
    sage: {
      lineCore: "via-[#9bb08a]",
      lineGlow: "via-[#9bb08a]/45",
      centerGlow: "rgba(155, 176, 138, 0.75)",
      accentBorder: "border-[#9bb08a]/80",
      pulseColor: "bg-[#e5ffe6]",
      textGlow: "text-[#9bb08a]"
    },
    amber: {
      lineCore: "via-[#e5a045]",
      lineGlow: "via-[#e5a045]/40",
      centerGlow: "rgba(229, 160, 69, 0.75)",
      accentBorder: "border-[#e5a045]/80",
      pulseColor: "bg-[#fff2d6]",
      textGlow: "text-[#e5a045]"
    }
  };

  const selectedTheme = colorMap[theme] || colorMap.gold;

  return (
    <div className={`relative w-full py-6 md:py-8 flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none ${className}`}>
      {/* 1. Ambient Background Light Flare (Soft Radial Halo) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute w-[450px] h-[100px] bg-radial from-[#f6c86b]/15 via-transparent to-transparent blur-xl pointer-events-none -z-10"
      />

      {/* 2. The Opening Neon Thread ("Fio de Luz se Abrindo") */}
      <div className="relative w-full max-w-7xl px-4 sm:px-8 flex items-center justify-center">
        
        {/* Left Thread Arm (Expands from center to left) */}
        <div className="relative flex-1 h-[3px] flex items-center justify-end overflow-hidden">
          {/* Ambient Glow Trail */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "right center" }}
            className={`w-full h-[6px] bg-gradient-to-r from-transparent ${selectedTheme.lineGlow} to-transparent blur-[2px]`}
          />
          {/* Razor-sharp Laser Line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "right center" }}
            className={`absolute right-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#fff6da]/90 ${selectedTheme.lineCore}`}
          />
          {/* Travelling Light Spark / Energy Pulse moving outwards */}
          <motion.div
            initial={{ x: 20, opacity: 0, scale: 0.5 }}
            whileInView={{ x: "-100%", opacity: [0, 1, 1, 0], scale: [0.8, 1.4, 0.8] }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 3.5, ease: "easeOut" }}
            className={`absolute right-0 w-8 h-[2px] bg-gradient-to-l from-white via-[#f6c86b] to-transparent shadow-[0_0_8px_#f6c86b]`}
          />
        </div>

        {/* Center Diamond Energy Core */}
        <motion.div
          initial={{ scale: 0, rotate: -45, opacity: 0 }}
          whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative mx-3 sm:mx-5 flex items-center justify-center z-10"
        >
          {/* Subtle Outer Pulsing Halo */}
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-8 h-8 rounded-full bg-[#f6c86b]/20 blur-[4px]"
          />

          {/* Rotating Thin Dashed Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-dashed border-[#f6c86b]/40 flex items-center justify-center"
          />

          {/* Center Glowing Rhombus Core */}
          <div 
            className={`absolute w-3.5 h-3.5 sm:w-4 sm:h-4 rotate-45 bg-[#252824] ${selectedTheme.accentBorder} border-[1.5px] flex items-center justify-center transition-all duration-300`}
            style={{
              boxShadow: `0 0 12px ${selectedTheme.centerGlow}, inset 0 0 6px ${selectedTheme.centerGlow}`
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#fff6da] shadow-[0_0_6px_#fff]" />
          </div>
        </motion.div>

        {/* Right Thread Arm (Expands from center to right) */}
        <div className="relative flex-1 h-[3px] flex items-center justify-start overflow-hidden">
          {/* Ambient Glow Trail */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "left center" }}
            className={`w-full h-[6px] bg-gradient-to-r ${selectedTheme.lineGlow} via-[#fff6da]/30 to-transparent blur-[2px]`}
          />
          {/* Razor-sharp Laser Line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "left center" }}
            className={`absolute left-0 w-full h-[1.5px] bg-gradient-to-r ${selectedTheme.lineCore} via-[#fff6da]/90 to-transparent`}
          />
          {/* Travelling Light Spark / Energy Pulse moving outwards */}
          <motion.div
            initial={{ x: -20, opacity: 0, scale: 0.5 }}
            whileInView={{ x: "100%", opacity: [0, 1, 1, 0], scale: [0.8, 1.4, 0.8] }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 3.5, ease: "easeOut" }}
            className={`absolute left-0 w-8 h-[2px] bg-gradient-to-r from-white via-[#f6c86b] to-transparent shadow-[0_0_8px_#f6c86b]`}
          />
        </div>
      </div>

      {/* Optional Minimalist Label Whisper */}
      {label && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-2.5 flex items-center space-x-1.5"
        >
          <Sparkles className="w-2.5 h-2.5 text-[#f6c86b] opacity-80" />
          <span className="font-montserrat text-[10px] tracking-[0.25em] uppercase text-[#ffe6a6]/70 font-semibold">
            {label}
          </span>
          <Sparkles className="w-2.5 h-2.5 text-[#f6c86b] opacity-80" />
        </motion.div>
      )}
    </div>
  );
}
