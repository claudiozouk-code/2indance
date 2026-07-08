import React, { useState } from "react";
import { motion } from "motion/react";
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
  effect: "zoom-in" | "slide-left" | "zoom-out" | "slide-right" | "3d-rise";
  className?: string;
}

function ScrollSection({ children, zIndex, effect, className = "" }: ScrollSectionProps) {
  let initial = {};
  let whileInView = {};
  
  switch (effect) {
    case "zoom-in":
      initial = { opacity: 0, scale: 0.9, y: 120 };
      whileInView = { opacity: 1, scale: 1, y: 0 };
      break;
    case "slide-left":
      initial = { opacity: 0, x: -100, y: 40, rotate: -1 };
      whileInView = { opacity: 1, x: 0, y: 0, rotate: 0 };
      break;
    case "zoom-out":
      initial = { opacity: 0, scale: 1.08, y: 100 };
      whileInView = { opacity: 1, scale: 1, y: 0 };
      break;
    case "slide-right":
      initial = { opacity: 0, x: 100, y: 40, rotate: 1 };
      whileInView = { opacity: 1, x: 0, y: 0, rotate: 0 };
      break;
    case "3d-rise":
      initial = { opacity: 0, y: 160, scale: 0.93, rotateX: 12 };
      whileInView = { opacity: 1, y: 0, scale: 1, rotateX: 0 };
      break;
  }

  return (
    <motion.div
      initial={initial}
      whileInView={whileInView}
      viewport={{ once: false, amount: 0.08 }}
      transition={{ 
        duration: 1.0, 
        ease: [0.16, 1, 0.3, 1],
        opacity: { duration: 0.8 }
      }}
      style={{ zIndex, perspective: effect === "3d-rise" ? "1200px" : "none" }}
      className={`relative mt-[-3.5rem] md:mt-[-5.5rem] rounded-t-[2.5rem] md:rounded-t-[4.5rem] shadow-[0_-25px_50px_-12px_rgba(0,0,0,0.35)] overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
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
        {/* Hero Section */}
        <div className="relative z-10">
          <Hero />
        </div>

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
