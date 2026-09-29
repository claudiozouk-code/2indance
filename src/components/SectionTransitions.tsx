import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { Sparkles, Layers, Tv, Play, RotateCcw, Clapperboard, Power } from "lucide-react";

interface TransitionWrapperProps {
  children: React.ReactNode;
  effect?: string;
  index: number;
  total: number;
  sectionName?: string;
}

// =========================================================================
// 1. EFEITO BARALHO (CARD DECK TRANSITION)
// =========================================================================
export function BaralhoTransition({ children, sectionName = "Seção" }: { children: React.ReactNode; sectionName?: string }) {
  const [shuffleCount, setShuffleCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-8% 0px -8% 0px" });

  const handleShuffle = () => {
    setShuffleCount((prev) => prev + 1);
  };

  return (
    <div ref={containerRef} className="relative w-full py-8 md:py-12 overflow-hidden perspective-[1400px]">
      {/* Background Deck Card 2 (Deep Behind - Tilted Left) */}
      <div 
        className="absolute inset-x-3 sm:inset-x-8 top-12 bottom-4 rounded-3xl bg-gradient-to-br from-[#1a231d] via-[#242b26] to-[#141b16] border border-[#f6c86b]/20 shadow-[0_15px_35px_rgba(0,0,0,0.6)] pointer-events-none transform -rotate-[2.2deg] scale-[0.985] opacity-60 hidden sm:block"
      >
        <div className="absolute top-4 left-6 flex items-center space-x-2 text-xs font-mono text-[#f6c86b]/40">
          <span>♠</span>
          <span>CARD #01</span>
        </div>
        <div className="absolute bottom-4 right-6 text-xs font-mono text-[#f6c86b]/40">
          <span>2inDance Deck</span>
        </div>
      </div>

      {/* Background Deck Card 1 (Immediately Behind - Tilted Right) */}
      <div 
        className="absolute inset-x-2 sm:inset-x-6 top-8 bottom-6 rounded-3xl bg-gradient-to-br from-[#272d28] via-[#323933] to-[#1c221e] border border-[#f6c86b]/35 shadow-[0_20px_45px_rgba(0,0,0,0.7)] pointer-events-none transform rotate-[1.8deg] scale-[0.99] opacity-80 hidden sm:block"
      >
        <div className="absolute top-4 right-6 flex items-center space-x-2 text-xs font-mono text-[#f6c86b]/60">
          <span>♦</span>
          <span>CARD #02</span>
        </div>
        <div className="absolute bottom-4 left-6 text-xs font-mono text-[#f6c86b]/60">
          <span>FusionDance Edition</span>
        </div>
      </div>

      {/* Main Front Playing Card Container */}
      <motion.div
        key={shuffleCount}
        initial={{ opacity: 0, y: 80, rotateZ: -3.5, scale: 0.94 }}
        animate={isInView ? { opacity: 1, y: 0, rotateZ: 0, scale: 1 } : { opacity: 0.4, y: 40, rotateZ: -2, scale: 0.96 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 18,
          mass: 0.9
        }}
        className="relative z-10 w-full max-w-[1440px] mx-auto rounded-3xl bg-[#3b3f3a] border-2 border-[#f6c86b]/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_25px_rgba(246,200,107,0.18)] overflow-hidden"
      >
        {/* Luxury Gold Card Header Trim */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-gradient-to-r from-[#1c2e24] via-[#2a382e] to-[#1c2e24] border-b border-[#f6c86b]/30">
          <div className="flex items-center space-x-3">
            <span className="text-[#f6c86b] font-bold text-sm tracking-wider">🂡 A♠</span>
            <span className="text-[11px] font-montserrat font-bold tracking-widest text-[#ffe6a6] uppercase flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#f6c86b]" />
              Efeito Baralho • Carta do Deck
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShuffle}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#f6c86b]/15 hover:bg-[#f6c86b]/25 border border-[#f6c86b]/40 text-[#f6c86b] text-[10px] font-mono uppercase tracking-wider transition-all duration-300 hover:scale-105 cursor-pointer"
              title="Embaralhar / Retirar Carta Novamente"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Embaralhar</span>
            </button>
            <span className="text-[#f6c86b] font-bold text-sm tracking-wider">A♠ 🂡</span>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="relative">
          {children}
        </div>

        {/* Card Footer Trim with Suit Symbols */}
        <div className="flex items-center justify-between px-6 py-2 bg-gradient-to-r from-[#1c2e24] via-[#2a382e] to-[#1c2e24] border-t border-[#f6c86b]/30 text-[10px] font-mono text-[#ffe6a6]/70">
          <span>♠ ♥ 2inDance Special Suit ♦ ♣</span>
          <span className="hidden sm:inline">Deck Transition Active • Gold Stacking</span>
          <span>#01 / TOP CARD</span>
        </div>
      </motion.div>
    </div>
  );
}

// =========================================================================
// 2. EFEITO TEATRO / TRAATER (THEATER CURTAINS & STAGE TRANSITION)
// =========================================================================
export function TeatroTransition({ children, sectionName = "Seção" }: { children: React.ReactNode; sectionName?: string }) {
  const [curtainsOpen, setCurtainsOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-12% 0px -12% 0px" });

  // Automatically trigger curtain open on scroll into view
  useEffect(() => {
    if (isInView) {
      setCurtainsOpen(true);
    }
  }, [isInView]);

  return (
    <div ref={containerRef} className="relative w-full py-6 md:py-10 overflow-hidden bg-[#241517]">
      {/* Stage Pelmet / Lambrequim Valance at the top */}
      <div className="relative z-30 w-full max-w-[1440px] mx-auto">
        <div className="h-10 sm:h-12 w-full bg-gradient-to-r from-[#50131b] via-[#751d27] to-[#50131b] border-b-2 border-[#f6c86b] shadow-2xl flex items-center justify-between px-4 sm:px-8 rounded-t-2xl">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🎭</span>
            <span className="text-xs font-montserrat font-bold tracking-widest text-[#ffe6a6] uppercase">
              Palco Principal • Efeito Teatro (Traater)
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurtainsOpen(!curtainsOpen)}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#f6c86b]/20 hover:bg-[#f6c86b]/30 border border-[#f6c86b]/60 text-[#f6c86b] text-[11px] font-montserrat font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 cursor-pointer shadow-[0_0_10px_rgba(246,200,107,0.3)]"
            >
              <Clapperboard className="w-3.5 h-3.5" />
              <span>{curtainsOpen ? "Fechar Cortinas" : "Abrir Cortinas"}</span>
            </button>
          </div>
        </div>

        {/* Gold Fringe & Tassel Trim underneath valance */}
        <div className="h-2 w-full bg-gradient-to-r from-[#d49929] via-[#f6c86b] to-[#d49929] shadow-md flex justify-around overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="w-2 h-2.5 bg-[#f6c86b] rounded-b-full shadow-sm" />
          ))}
        </div>
      </div>

      {/* Main Stage Enclosure */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto rounded-b-3xl bg-[#3b3f3a] shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden border-x-2 border-b-2 border-[#f6c86b]/30">
        {/* Overhead Stage Spotlight Beam */}
        <div 
          className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 z-10 ${
            curtainsOpen ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: "radial-gradient(circle at 50% 0%, rgba(246,200,107,0.18) 0%, rgba(246,200,107,0.05) 45%, transparent 75%)"
          }}
        />

        {/* Children (Stage Content) */}
        <div className="relative z-0">
          {children}
        </div>

        {/* LEFT THEATER CURTAIN */}
        <motion.div
          initial={{ x: "0%" }}
          animate={{ x: curtainsOpen ? "-102%" : "0%" }}
          transition={{
            duration: 1.15,
            ease: [0.25, 1, 0.5, 1]
          }}
          className="absolute inset-y-0 left-0 w-1/2 z-20 pointer-events-none"
          style={{
            background: "repeating-linear-gradient(90deg, #300a10 0px, #641722 25px, #420f17 50px, #7a1d2b 75px, #28080d 100px)",
            boxShadow: "inset -15px 0 35px rgba(0, 0, 0, 0.8), 10px 0 25px rgba(0, 0, 0, 0.7)"
          }}
        >
          {/* Gold Curtain Rope & Tassel */}
          <div className="absolute top-1/2 right-3 -translate-y-1/2 flex flex-col items-center">
            <div className="w-3.5 h-16 bg-gradient-to-b from-[#f6c86b] via-[#c9922e] to-[#f6c86b] rounded-full border border-black/40 shadow-lg" />
            <div className="w-5 h-7 bg-[#f6c86b] rounded-b-full shadow-md -mt-1" />
          </div>
        </motion.div>

        {/* RIGHT THEATER CURTAIN */}
        <motion.div
          initial={{ x: "0%" }}
          animate={{ x: curtainsOpen ? "102%" : "0%" }}
          transition={{
            duration: 1.15,
            ease: [0.25, 1, 0.5, 1]
          }}
          className="absolute inset-y-0 right-0 w-1/2 z-20 pointer-events-none"
          style={{
            background: "repeating-linear-gradient(90deg, #28080d 0px, #7a1d2b 25px, #420f17 50px, #641722 75px, #300a10 100px)",
            boxShadow: "inset 15px 0 35px rgba(0, 0, 0, 0.8), -10px 0 25px rgba(0, 0, 0, 0.7)"
          }}
        >
          {/* Gold Curtain Rope & Tassel */}
          <div className="absolute top-1/2 left-3 -translate-y-1/2 flex flex-col items-center">
            <div className="w-3.5 h-16 bg-gradient-to-b from-[#f6c86b] via-[#c9922e] to-[#f6c86b] rounded-full border border-black/40 shadow-lg" />
            <div className="w-5 h-7 bg-[#f6c86b] rounded-b-full shadow-md -mt-1" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// =========================================================================
// 3. EFEITO TV DESLIGADO (CRT RETRO TV POWER-OFF / TURN-ON TRANSITION)
// =========================================================================
export function TVOffTransition({ children, sectionName = "Seção" }: { children: React.ReactNode; sectionName?: string }) {
  const [isTvOn, setIsTvOn] = useState(true);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-10% 0px -10% 0px" });

  // Toggle TV Power state with authentic collapse sequence
  const handleTogglePower = () => {
    if (isTvOn) {
      setIsShuttingDown(true);
      setTimeout(() => {
        setIsTvOn(false);
        setIsShuttingDown(false);
      }, 700);
    } else {
      setIsTvOn(true);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full py-8 md:py-12 overflow-hidden bg-[#181a18]">
      {/* Outer Vintage CRT TV Cabinet */}
      <div className="w-full max-w-[1440px] mx-auto rounded-3xl bg-gradient-to-b from-[#2a2d2a] via-[#1e201e] to-[#121412] p-3 sm:p-6 border-4 border-[#3a3f3a] shadow-[0_30px_90px_rgba(0,0,0,0.95)]">
        
        {/* Retro TV Top Control Console */}
        <div className="flex items-center justify-between pb-3 px-2 sm:px-4 border-b border-white/10 mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5">
              <span className={`w-3 h-3 rounded-full transition-all duration-300 ${
                isTvOn 
                  ? "bg-emerald-400 shadow-[0_0_12px_#34d399]" 
                  : "bg-red-500 shadow-[0_0_8px_#ef4444]"
              }`} />
              <span className="text-[10px] font-mono tracking-widest uppercase text-white/70">
                {isTvOn ? "POWER: ON" : "POWER: STANDBY"}
              </span>
            </div>

            <div className="h-4 w-px bg-white/20" />

            <div className="flex items-center space-x-1.5 text-xs font-montserrat font-bold text-[#ffe6a6] tracking-wider uppercase">
              <Tv className="w-4 h-4 text-[#f6c86b]" />
              <span className="hidden sm:inline">2inDance Trinitron CRT</span>
              <span className="text-[#f6c86b]">• Efeito TV Desligado</span>
            </div>
          </div>

          {/* Interactive Power Switch Knob */}
          <button
            onClick={handleTogglePower}
            className={`inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer hover:scale-105 ${
              isTvOn
                ? "bg-red-500/20 hover:bg-red-500/30 border-red-500/40 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.25)]"
                : "bg-emerald-500/25 hover:bg-emerald-500/35 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse"
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isTvOn ? "Desligar TV" : "Ligar TV CRT"}</span>
          </button>
        </div>

        {/* CRT Glass Monitor Enclosure */}
        <div className="relative rounded-2xl bg-black overflow-hidden border-2 border-white/10 shadow-inner min-h-[420px]">
          {/* Subtle CRT Scanlines & Screen Glass Vignette */}
          <div 
            className="absolute inset-0 pointer-events-none z-30 opacity-40"
            style={{
              backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.35) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.04))",
              backgroundSize: "100% 3px, 6px 100%"
            }}
          />
          <div 
            className="absolute inset-0 pointer-events-none z-30"
            style={{
              boxShadow: "inset 0 0 100px rgba(0, 0, 0, 0.85), inset 0 0 40px rgba(0, 0, 0, 0.95)"
            }}
          />

          {/* ACTIVE TV SCREEN (When TV is ON) */}
          <AnimatePresence mode="wait">
            {isTvOn && !isShuttingDown && (
              <motion.div
                key="tv-on"
                initial={{ opacity: 0, scaleY: 0.005, scaleX: 0.8, filter: "brightness(3)" }}
                animate={{ opacity: 1, scaleY: 1, scaleX: 1, filter: "brightness(1)" }}
                exit={{
                  scaleY: [1, 0.005, 0.005, 0],
                  scaleX: [1, 1, 0.005, 0],
                  filter: ["brightness(1)", "brightness(4)", "brightness(6)", "brightness(0)"],
                  opacity: [1, 1, 0.9, 0],
                  transition: { duration: 0.65, times: [0, 0.45, 0.8, 1], ease: "easeInOut" }
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full"
              >
                {children}
              </motion.div>
            )}

            {/* TV SHUTTING DOWN ANIMATION LINE/DOT */}
            {isShuttingDown && (
              <motion.div
                key="tv-shutdown"
                className="absolute inset-0 z-40 flex items-center justify-center bg-black"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Horizontal Phosphor Line collapsing into Dot */}
                <motion.div 
                  initial={{ width: "100%", height: "3px", backgroundColor: "#ffffff" }}
                  animate={{
                    width: ["100%", "85%", "4px", "0px"],
                    height: ["3px", "4px", "4px", "0px"],
                    boxShadow: [
                      "0 0 30px #ffffff, 0 0 60px #f6c86b",
                      "0 0 40px #ffffff, 0 0 80px #f6c86b",
                      "0 0 50px #ffffff",
                      "0 0 0px transparent"
                    ],
                    opacity: [1, 1, 1, 0]
                  }}
                  transition={{ duration: 0.65, ease: "easeInOut" }}
                  className="rounded-full"
                />
              </motion.div>
            )}

            {/* TV IS OFF (OFFLINE CRT SCREEN STATE) */}
            {!isTvOn && !isShuttingDown && (
              <motion.div
                key="tv-off"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative z-20 flex flex-col items-center justify-center py-28 px-4 text-center space-y-6"
              >
                {/* Vintage CRT Center Dot Phosphor Glow */}
                <div className="w-1.5 h-1.5 rounded-full bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.6)] animate-ping" />

                <div className="max-w-md bg-[#252826]/80 border border-white/10 p-6 rounded-2xl shadow-2xl backdrop-blur-md">
                  <div className="inline-flex p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 mb-3">
                    <Power className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#fff6da]">
                    Efeito TV Desligado
                  </h4>
                  <p className="text-xs font-mono text-[#fff6da]/70 mt-2 leading-relaxed">
                    A televisão de tubo CRT foi desligada com o efeito de colapso de feixe de fósforo.
                  </p>
                  <button
                    onClick={handleTogglePower}
                    className="mt-5 inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#f6c86b] to-[#e5a045] text-black font-montserrat font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(246,200,107,0.4)] hover:scale-105 transition-all cursor-pointer"
                  >
                    <Power className="w-4 h-4" />
                    <span>Ligar TV Novamente</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Vintage TV Bottom Speaker Grill & Channel Dial */}
        <div className="flex items-center justify-between pt-3 px-2 sm:px-4 text-[11px] font-mono text-white/50">
          <div className="flex space-x-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-1.5 h-3 bg-white/10 rounded-sm" />
            ))}
          </div>
          <span>CH 04 • 2inDance Broadcast System</span>
          <div className="flex space-x-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-1.5 h-3 bg-white/10 rounded-sm" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 4. UNIFIED SECTION TRANSITION DISPATCHER
// =========================================================================
export default function SectionTransitionWrapper({
  children,
  effect = "none",
  index,
  total,
  sectionName = "Section"
}: TransitionWrapperProps) {
  const isFirst = index === 0;
  const isSecond = index === 1;
  const isLast = index === total - 1;

  // Determine effective transition based on user prompt rules:
  // 1. "primeiro efeito baralho" -> First section (index 0) OR explicit "baralho"
  // 2. "segunda traater" (teatro) -> Second section (index 1) OR explicit "teatro" / "traater"
  // 3. "a ultima efeito tv desligado" -> Last section (index total - 1) OR explicit "tv-off" / "tv-desligado"
  const isBaralho = effect === "baralho" || isFirst;
  const isTeatro = effect === "teatro" || effect === "traater" || (isSecond && effect !== "baralho" && effect !== "tv-off");
  const isTvOff = effect === "tv-off" || effect === "tv-desligado" || (isLast && effect !== "baralho" && effect !== "teatro" && effect !== "traater");

  if (isBaralho) {
    return (
      <BaralhoTransition sectionName={sectionName}>
        {children}
      </BaralhoTransition>
    );
  }

  if (isTeatro) {
    return (
      <TeatroTransition sectionName={sectionName}>
        {children}
      </TeatroTransition>
    );
  }

  if (isTvOff) {
    return (
      <TVOffTransition sectionName={sectionName}>
        {children}
      </TVOffTransition>
    );
  }

  // Smooth Motion Transition for intermediate sections
  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: "-6% 0px -6% 0px" }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
