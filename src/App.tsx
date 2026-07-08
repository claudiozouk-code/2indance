import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import ClassesEvents from "./components/ClassesEvents";
import Media from "./components/Media";
import News from "./components/News";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

interface ScrollSectionProps {
  children: React.ReactNode;
  zIndex: number;
  effect: "zoom-in" | "slide-left" | "zoom-out" | "slide-right" | "3d-rise" | "hero";
  className?: string;
}

function ScrollSection({ children, zIndex, effect, className = "" }: ScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of this container.
  // - Starts at 0 when the bottom of this container enters the bottom of the viewport (meaning the user has scrolled all the way to the bottom and read everything!).
  // - Ends at 1 when the bottom of this container leaves the top of the viewport.
  // This perfectly preserves the reading limit of each page so no bottom content is cut off!
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["end end", "end start"]
  });

  // Keep the current section completely fixed (stationary) relative to the viewport
  // by translating it down by exactly the scroll distance (100vh) as the scrollbar moves.
  // This lets the subsequent section (with a higher z-index) roll up and overlay it beautifully!
  const yParallax = useTransform(scrollYProgress, [0, 1], ["0px", "100vh"]);
  
  // Smoothly dim the pinned section to enhance visual focus on the overlapping active section on top
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  let initial = {};
  let whileInView = {};
  
  switch (effect) {
    case "zoom-in":
      // Smooth morph rise (no scale zoom)
      initial = { opacity: 0, y: 100 };
      whileInView = { opacity: 1, y: 0 };
      break;
    case "slide-left":
      // Pure elegant slide-left
      initial = { opacity: 0, x: -80, y: 30 };
      whileInView = { opacity: 1, x: 0, y: 0 };
      break;
    case "zoom-out":
      // Smooth morph rise (no scale zoom)
      initial = { opacity: 0, y: 100 };
      whileInView = { opacity: 1, y: 0 };
      break;
    case "slide-right":
      // Pure elegant slide-right
      initial = { opacity: 0, x: 80, y: 30 };
      whileInView = { opacity: 1, x: 0, y: 0 };
      break;
    case "3d-rise":
      // Smooth heavy rise morph (no 3D scale/rotation)
      initial = { opacity: 0, y: 140 };
      whileInView = { opacity: 1, y: 0 };
      break;
    case "hero":
      initial = { opacity: 1, y: 0 };
      whileInView = { opacity: 1, y: 0 };
      break;
  }

  return (
    <div 
      ref={containerRef}
      style={{ zIndex }}
      className={`relative ${effect === "hero" ? "mt-0" : "mt-[-3.5rem] md:mt-[-5.5rem]"}`}
    >
      <motion.div
        style={{ 
          y: yParallax, 
          opacity, 
        }}
        className={`w-full overflow-hidden ${
          effect === "hero" 
            ? "" 
            : "rounded-t-[2.5rem] md:rounded-t-[4.5rem] shadow-[0_-25px_50px_-12px_rgba(0,0,0,0.55)]"
        }`}
      >
        <motion.div
          initial={initial}
          whileInView={whileInView}
          viewport={{ once: false, amount: 0.08 }}
          transition={{ 
            duration: 1.0, 
            ease: [0.16, 1, 0.3, 1],
            opacity: { duration: 0.8 }
          }}
          className={`relative overflow-hidden ${className}`}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [selectedClass, setSelectedClass] = useState("");

  const handleSelectClass = (className: string) => {
    setSelectedClass(className);
  };

  return (
    <div className="min-h-screen bg-[#3b3f3a] text-[#fff6da] font-sans selection:bg-[#f6c86b]/40 selection:text-[#fff6da]">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Page Layout */}
      <main className="relative overflow-hidden">
        {/* Hero Section - Fades back beautifully as you scroll */}
        <ScrollSection zIndex={10} effect="hero">
          <Hero />
        </ScrollSection>

        {/* About Us (Founders Xina & Laura) Section - Zoom In & Up */}
        <ScrollSection zIndex={20} effect="zoom-in">
          <About />
        </ScrollSection>

        {/* Class/Events Section - Slide in from Left with subtle angle */}
        <ScrollSection zIndex={30} effect="slide-left">
          <ClassesEvents onSelectClass={handleSelectClass} />
        </ScrollSection>

        {/* Media (Gallery & Videos) Section - Zoom Out & Up */}
        <ScrollSection zIndex={35} effect="zoom-out">
          <Media />
        </ScrollSection>

        {/* News Section - Slide in from Right with subtle angle */}
        <ScrollSection zIndex={40} effect="slide-right">
          <News />
        </ScrollSection>

        {/* Booking & Contact Section with FAQ Accordions - Premium 3D Heavy Rise */}
        <ScrollSection zIndex={45} effect="3d-rise">
          <Contact selectedClass={selectedClass} />
        </ScrollSection>
      </main>

      {/* Footer Branding Area */}
      <div className="relative z-50">
        <Footer />
      </div>
    </div>
  );
}
