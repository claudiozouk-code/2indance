import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "motion/react";
import { ArrowLeft } from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import ClassesEvents from "./components/ClassesEvents";
import Media from "./components/Media";
import News from "./components/News";
import HainanMarathon from "./components/HainanMarathon";
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
  const anchorRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of this container.
  // - Starts at 0 when the bottom of this container enters the bottom of the viewport (meaning the user has scrolled all the way to the bottom and read everything!).
  // - Ends at 1 when the bottom of this container leaves the top of the viewport.
  // This perfectly preserves the reading limit of each page so no bottom content is cut off!
  // We track `anchorRef` which is a static layout div with NO transforms, completely preventing feedback loop flickers!
  const { scrollYProgress } = useScroll({
    target: anchorRef,
    offset: ["end end", "end start"]
  });

  // Smooth out the raw scroll progress using a highly responsive spring.
  // This dampens mousewheel ticks and trackpad momentum, creating a premium fluid motion without any trembling!
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 35,
    stiffness: 220,
    mass: 0.15,
    restDelta: 0.0001
  });

  // Keep the current section completely fixed (stationary) relative to the viewport
  // by translating it down by exactly the scroll distance (100vh) as the scrollbar moves.
  // Using vh-based transforms is hardware-accelerated and maintains perfect alignment across different device screens!
  const yParallax = useTransform(smoothProgress, [0, 1], ["0vh", "100vh"]);

  // Detect when the section's static layout is active/visible in the viewport
  const isInView = useInView(anchorRef, { once: false, amount: 0.15 });

  // Elegant entrance variants for the inner content
  const contentVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 18,
        mass: 0.9,
        duration: 0.8
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      style={{ zIndex }}
      className={`relative ${effect === "hero" ? "mt-0" : "mt-[-3.5rem] md:mt-[-5.5rem]"}`}
    >
      {/* Invisible anchor element that remains static in layout flow to prevent scrolling feedback loops */}
      <div ref={anchorRef} className="absolute inset-0 pointer-events-none" />

      <motion.div
        style={{ 
          y: yParallax, 
        }}
        className={`w-full overflow-hidden ${
          effect === "hero" 
            ? "" 
            : "rounded-t-[2.5rem] md:rounded-t-[4.5rem] shadow-[0_-25px_50px_-12px_rgba(0,0,0,0.55)]"
        } ${className}`}
      >
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="w-full h-full"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [selectedClass, setSelectedClass] = useState("");
  const [currentPage, setCurrentPage] = useState("home");

  const handleSelectClass = (className: string) => {
    setSelectedClass(className);
    window.location.hash = "#/contact";
  };

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#/")) {
        setCurrentPage(hash.slice(2));
      } else {
        setCurrentPage("home");
      }
      window.scrollTo(0, 0);
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const renderSubPage = () => {
    let content = null;
    let title = "";
    let subtitle = "";

    switch (currentPage) {
      case "about":
        content = <About />;
        title = "About Us";
        subtitle = "Meet the passionate team behind 2inDance";
        break;
      case "classes-events":
        content = <ClassesEvents onSelectClass={handleSelectClass} />;
        title = "Classes & Events";
        subtitle = "Unlock your Zouk potential with our curated experiences";
        break;
      case "media":
        content = <Media />;
        title = "Media & Gallery";
        subtitle = "Immerse yourself in our visual dance journey";
        break;
      case "news":
        content = <News />;
        title = "Latest News";
        subtitle = "Keep up to date with community highlights and updates";
        break;
      case "contact":
        content = <Contact selectedClass={selectedClass} />;
        title = "Contact & Booking";
        subtitle = "Get in touch or book your next Zouk experience";
        break;
      default:
        return null;
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="pt-24 min-h-screen bg-[#3b3f3a] text-[#fff6da]"
      >
        {/* Subpage Hero Header */}
        <div className="relative py-16 md:py-20 bg-gradient-to-b from-[#1c2e24] to-[#3b3f3a] overflow-hidden border-b border-[#9bb08a]/20">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f6c86b" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                {/* Breadcrumbs */}
                <div className="flex items-center space-x-2 text-xs font-montserrat tracking-widest text-[#ffe6a6]/70 uppercase mb-2">
                  <button 
                    onClick={() => { window.location.hash = ""; }}
                    className="hover:text-[#f6c86b] transition-colors cursor-pointer"
                  >
                    Home
                  </button>
                  <span>/</span>
                  <span className="text-[#f6c86b] font-bold">{title}</span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase text-[#fff6da]">
                  {title}
                </h1>
                <p className="font-sans text-sm text-[#fff6da]/80 mt-2 max-w-xl font-light">
                  {subtitle}
                </p>
              </div>

              <button
                onClick={() => { window.location.hash = ""; }}
                className="self-start md:self-auto inline-flex items-center space-x-2 bg-white/5 border border-white/10 hover:border-[#f6c86b]/40 hover:bg-[#f6c86b]/10 px-4 py-2.5 rounded-xl text-xs font-montserrat font-bold tracking-wider uppercase text-[#fff6da] hover:text-[#f6c86b] transition-all duration-300 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Subpage Content */}
        <div className="relative">
          {content}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#3b3f3a] text-[#fff6da] font-sans selection:bg-[#f6c86b]/40 selection:text-[#fff6da]">
      {/* Top Navigation Bar */}
      <Navbar />

      {currentPage === "home" ? (
        /* Main Page Layout */
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

          {/* Hainan Island Zouk Marathon Section */}
          <ScrollSection zIndex={43} effect="zoom-in">
            <HainanMarathon />
          </ScrollSection>

          {/* Booking & Contact Section with FAQ Accordions - Premium 3D Heavy Rise */}
          <ScrollSection zIndex={48} effect="3d-rise">
            <Contact selectedClass={selectedClass} />
          </ScrollSection>
        </main>
      ) : (
        renderSubPage()
      )}

      {/* Footer Branding Area */}
      <div className="relative z-50">
        <Footer />
      </div>
    </div>
  );
}
