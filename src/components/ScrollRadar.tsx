import { useState, useEffect } from "react";
import { motion } from "motion/react";

interface SectionItem {
  id: string;
  name: string;
}

const SECTIONS: SectionItem[] = [
  { id: "home", name: "Home" },
  { id: "about", name: "About Us" },
  { id: "classes-events", name: "Classes & Events" },
  { id: "hainan", name: "Hainan Marathon" },
  { id: "media", name: "Media Gallery" },
  { id: "news", name: "News & Articles" },
  { id: "contact", name: "Contact & Booking" }
];

export default function ScrollRadar() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const sec = SECTIONS[i];
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sec.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 70;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <aside 
      aria-label="Section Navigation"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[40] hidden lg:flex flex-col items-center gap-3.5 pointer-events-auto select-none"
    >
      <div className="relative py-3 px-1.5 rounded-full bg-[#1e221d]/60 backdrop-blur-md border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex flex-col items-center gap-3">
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          const isHovered = hoveredSection === sec.id;

          return (
            <div
              key={sec.id}
              className="relative flex items-center justify-center"
              onMouseEnter={() => setHoveredSection(sec.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              {/* Tooltip on hover */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: 10, scale: 0.95 }}
                  animate={{ opacity: 1, x: -8, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute right-full mr-2 px-2.5 py-1 rounded-md bg-[#252824]/95 text-[#fff6da] text-[11px] font-montserrat font-medium whitespace-nowrap border border-[#f6c86b]/40 shadow-[0_2px_12px_rgba(0,0,0,0.5)] pointer-events-none"
                >
                  {sec.name}
                </motion.div>
              )}

              {/* Dot Button */}
              <button
                onClick={() => scrollTo(sec.id)}
                aria-label={`Scroll to ${sec.name}`}
                className="relative w-6 h-6 flex items-center justify-center group cursor-pointer"
              >
                {/* Active Outer Pulsing Halo */}
                {isActive && (
                  <motion.div
                    layoutId="activeRadarHalo"
                    className="absolute inset-0 rounded-full bg-[#f6c86b]/20 border border-[#f6c86b]/60 shadow-[0_0_10px_rgba(246,200,107,0.7)]"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}

                {/* Inner Core Dot */}
                <div
                  className={`rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-2.5 h-2.5 bg-[#f6c86b] shadow-[0_0_8px_#f6c86b]"
                      : "w-1.5 h-1.5 bg-white/40 group-hover:bg-[#f6c86b]/80 group-hover:scale-125"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
