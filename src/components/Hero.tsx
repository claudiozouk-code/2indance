import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { brandDetails } from "../data";
// @ts-ignore
import logoImage from "../assets/images/logo_2indance_1782381576138.jpg";

export default function Hero() {
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Staggered perspective flip animations for the title words
  const titleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      y: 45, 
      rotateX: -60,
      scale: 0.85
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      scale: 1,
      transition: { 
        type: "spring",
        damping: 14,
        stiffness: 95,
      }
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#3b3f3a] text-white"
    >
      {/* 1. Ambient Background Glows representing Connection (Lead & Follow) */}
      <motion.div
        animate={{
          x: [0, 40, -40, 20, 0],
          y: [0, -50, 40, -20, 0],
          scale: [1, 1.1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#f6c86b]/10 blur-[130px] rounded-full pointer-events-none"
      />

      <motion.div
        animate={{
          x: [0, -40, 40, -20, 0],
          y: [0, 50, -40, 20, 0],
          scale: [1, 0.95, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#9bb08a]/20 blur-[130px] rounded-full pointer-events-none"
      />

      {/* 2. 3D Flowing Dance Ribbon Lines (Representing social dance movement & fluid connection paths) */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center" 
        style={{ perspective: "1200px" }}
      >
        <motion.div
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            rotateX: [12, 28, 8, 12],
            rotateY: [-22, -8, -32, -22],
            rotateZ: [0, 360],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="relative w-[150vw] h-[150vw] sm:w-[100vw] sm:h-[100vw] flex items-center justify-center opacity-35"
        >
          {/* SVG Containing the morphing 3D Ribbon Paths */}
          <svg
            viewBox="0 0 800 800"
            className="w-full h-full absolute"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="ribbonGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f6c86b" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ffe6a6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#9bb08a" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="ribbonGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#9bb08a" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#fff6da" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#f6c86b" stopOpacity="0.8" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Path 1: Infinite Flow Loop representing couple spinning */}
            <motion.path
              d="M 100 400 C 100 150, 300 100, 400 400 C 500 700, 700 650, 700 400 C 700 150, 500 100, 400 400 C 300 700, 100 650, 100 400 Z"
              stroke="url(#ribbonGrad1)"
              strokeWidth="2.5"
              strokeDasharray="1200"
              animate={{
                strokeDashoffset: [1200, 0],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "linear",
              }}
              filter="url(#glow)"
            />

            {/* Path 2: Secondary orbiting helper wave path */}
            <motion.path
              d="M 400 100 C 150 100, 100 300, 400 400 C 700 500, 650 700, 400 700 C 150 700, 200 500, 400 400 C 600 300, 650 100, 400 100 Z"
              stroke="url(#ribbonGrad2)"
              strokeWidth="1.5"
              strokeDasharray="1400"
              animate={{
                strokeDashoffset: [0, -1400],
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: "linear",
              }}
              filter="url(#glow)"
              className="opacity-80"
            />

            {/* Path 3: Inner tight spin trajectory */}
            <motion.path
              d="M 250 400 C 250 280, 350 250, 400 400 C 450 550, 550 520, 550 400 C 550 280, 450 250, 400 400 C 350 550, 250 520, 250 400 Z"
              stroke="url(#ribbonGrad1)"
              strokeWidth="1"
              strokeDasharray="800"
              animate={{
                strokeDashoffset: [0, 800],
              }}
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: "linear",
              }}
              className="opacity-60"
            />

            {/* Path 4: Outer giant sweeping atmospheric curve */}
            <motion.path
              d="M 50 400 Q 400 -100 750 400 Q 400 900 50 400"
              stroke="url(#ribbonGrad2)"
              strokeWidth="2"
              strokeDasharray="1600"
              animate={{
                strokeDashoffset: [1600, 0],
              }}
              transition={{
                duration: 28,
                repeat: Infinity,
                ease: "linear",
              }}
              filter="url(#glow)"
              className="opacity-50"
            />
          </svg>

          {/* 3D floating nodes/dancers moving in space */}
          <motion.div
            style={{ translateZ: "80px" }}
            className="absolute w-4 h-4 rounded-full bg-[#f6c86b] shadow-[0_0_15px_#f6c86b]"
            animate={{
              x: [-150, 150, 80, -150],
              y: [-120, 80, -160, -120],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            style={{ translateZ: "-60px" }}
            className="absolute w-3 h-3 rounded-full bg-[#9bb08a] shadow-[0_0_12px_#9bb08a]"
            animate={{
              x: [180, -120, -50, 180],
              y: [100, -150, 120, 100],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>

      {/* 3. Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff6da_1px,transparent_1px),linear-gradient(to_bottom,#fff6da_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col text-center lg:text-left items-center lg:items-start space-y-6 md:space-y-8">
            
            {/* Tagline Badge with continuous floating animation */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center space-x-2 bg-white/5 border border-[#9bb08a]/20 px-4 py-1.5 rounded-full backdrop-blur-md"
            >
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center space-x-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#f6c86b] animate-pulse" />
                <span className="font-montserrat text-[10px] font-bold tracking-widest text-[#fff6da] uppercase">
                  Soulzouk Hong Kong • Xina & Laura
                </span>
              </motion.div>
            </motion.div>

            {/* Display Title with 3D Spring stagger entrance, Soulzouk Methodology & Connected Social Dance theme */}
            <motion.h1
              variants={titleContainerVariants}
              initial="hidden"
              animate="visible"
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[58px] font-bold tracking-tight leading-[1.1] text-[#fff6da] uppercase flex flex-col items-center lg:items-start"
              style={{ 
                perspective: "1000px",
                textShadow: "0 6px 16px rgba(0,0,0,0.4)"
              }}
            >
              {/* Row 1: Connected */}
              <div className="flex flex-wrap gap-x-3 justify-center lg:justify-start overflow-hidden py-1">
                <motion.span 
                  variants={wordVariants} 
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#ffe6a6] via-white to-[#ffe6a6]"
                >
                  FusionDance
                </motion.span>
              </div>

              {/* Row 2: Social Dance */}
              <div className="flex flex-wrap gap-x-3 justify-center lg:justify-start overflow-hidden py-1">
                <motion.span variants={wordVariants} className="inline-block">Social</motion.span>
                <motion.span 
                  variants={wordVariants} 
                  className="inline-block text-[#f6c86b]"
                >
                  Dance
                </motion.span>
              </div>

              {/* Row 3: Soulzouk Methodology (with moving gradient shine and flow underline) */}
              <div className="relative overflow-visible py-2 mt-1">
                <motion.span
                  variants={wordVariants}
                  className="relative inline-block font-semibold font-display italic text-transparent bg-clip-text bg-gradient-to-r from-[#f6c86b] via-[#ffe6a6] to-[#9bb08a] bg-[size:200%_200%]"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Soulzouk Methodology
                </motion.span>
                
                {/* Active underlying glowing trace line representing flow of lead & follow */}
                <motion.span 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1.4, duration: 1.5, ease: "easeOut" }}
                  className="absolute -bottom-1 left-0 h-[4px] bg-gradient-to-r from-[#f6c86b] via-[#ffe6a6] to-[#9bb08a] opacity-80 rounded-full shadow-[0_0_8px_rgba(246,200,107,0.5)]"
                />
              </div>
            </motion.h1>

            {/* Subtitle Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-sm sm:text-base md:text-lg text-[#fff6da]/80 max-w-xl leading-relaxed font-light"
            >
              Learn the beautiful art of FusionDance in partner dance. Master the flow, physical conversation, and technique of Soulzouk in Hong Kong.
            </motion.p>

            {/* Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(246, 200, 107, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleScrollTo("contact")}
                className="w-full sm:w-auto bg-[#f6c86b] hover:bg-[#ffe6a6] text-[#3b3f3a] font-montserrat text-xs font-bold tracking-widest uppercase px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-[#f6c86b]/15 transform cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Book a Trial Class</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "rgba(155, 176, 138, 0.25)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleScrollTo("classes-events")}
                className="w-full sm:w-auto border border-[#9bb08a]/30 text-[#fff6da] font-montserrat text-xs font-bold tracking-widest uppercase px-8 py-4 rounded-xl transition-all duration-300 backdrop-blur-md cursor-pointer"
              >
                Explore Classes
              </motion.button>
            </motion.div>

            {/* Social Proof Stats */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="pt-6 grid grid-cols-3 gap-6 md:gap-8 border-t border-[#9bb08a]/20 w-full"
            >
              <div>
                <h4 className="font-display text-2xl font-bold text-[#f6c86b]">20+</h4>
                <p className="font-montserrat text-[10px] text-[#fff6da]/60 uppercase tracking-wider font-semibold">Years Exp</p>
              </div>
              <div>
                <h4 className="font-display text-2xl font-bold text-[#9bb08a]">5k+</h4>
                <p className="font-montserrat text-[10px] text-[#fff6da]/60 uppercase tracking-wider font-semibold">Students</p>
              </div>
              <div>
                <h4 className="font-display text-2xl font-bold text-[#f6c86b]">100%</h4>
                <p className="font-montserrat text-[10px] text-[#fff6da]/60 uppercase tracking-wider font-semibold">Connection</p>
              </div>
            </motion.div>
          </div>

          {/* Hero Right Content - Logo Showcase with partner floating drift */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -1.5 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotate: 0,
                y: [0, -8, 4, -4, 0],
                x: [0, 4, -4, 2, 0]
              }}
              transition={{ 
                opacity: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
                scale: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
                rotate: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
                y: { duration: 12, repeat: Infinity, ease: "easeInOut" },
                x: { duration: 14, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative w-72 h-72 sm:w-85 sm:h-85 md:w-[410px] md:h-[410px] flex items-center justify-center"
            >
              {/* Outer Decorative Glowing Borders */}
              <div className="absolute inset-0 rounded-full border border-[#9bb08a]/10 p-2 animate-[spin_45s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border border-dashed border-[#f6c86b]/20" />
              
              {/* Spinning subtle light ray */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#f6c86b]/10 to-transparent blur-md animate-[spin_12s_linear_infinite]" />

              {/* Central Logo Box Container */}
              <div className="relative w-64 h-64 sm:w-76 sm:h-76 md:w-[360px] md:h-[360px] rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-[#9bb08a]/20 bg-white/5 backdrop-blur-md group">
                <img
                  src={logoImage}
                  alt="2inDance Brand Artwork Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform scale-102 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Internal overlay border */}
                <div className="absolute inset-0 border border-[#f6c86b]/10 rounded-3xl pointer-events-none group-hover:border-[#f6c86b]/30 transition-colors duration-500" />
                
                {/* Bottom dark vignette */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#3b3f3a] to-transparent opacity-80 pointer-events-none" />
              </div>
              
              {/* Decorative floating blurred spots */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#f6c86b]/10 rounded-full blur-lg" />
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-[#9bb08a]/15 rounded-full blur-lg" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
