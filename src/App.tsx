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
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";
import { injectTrackingTags, trackUserEvent } from "./utils";

interface ScrollSectionProps {
  key?: string;
  children: React.ReactNode;
  zIndex: number;
  effect: string;
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
    damping: 40,
    stiffness: 320,
    mass: 0.08,
    restDelta: 0.001
  });

  // Keep the current section completely fixed (stationary) relative to the viewport
  // by translating it down by exactly the scroll distance (100vh) as the scrollbar moves.
  // Using vh-based transforms is hardware-accelerated and maintains perfect alignment across different device screens!
  const yParallax = useTransform(smoothProgress, [0, 1], ["0vh", "100vh"]);

  // Detect when the section's static layout is active/visible in the viewport
  const isInView = useInView(anchorRef, { once: false, amount: 0.05 });

  // Fast, ultra-smooth entrance variants for the inner content
  const contentVariants = {
    hidden: { 
      opacity: 0.3, 
      y: 10,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.25,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      style={{ zIndex }}
      className={`relative ${effect === "hero" ? "mt-0" : "mt-[-2.5rem] md:mt-[-4rem]"}`}
    >
      {/* Invisible anchor element that remains static in layout flow to prevent scrolling feedback loops */}
      <div ref={anchorRef} className="absolute inset-0 pointer-events-none" />

      <motion.div
        style={{ 
          y: yParallax, 
          willChange: "transform"
        }}
        className={`w-full overflow-hidden transform-gpu ${
          effect === "hero" 
            ? "" 
            : "rounded-t-[2rem] md:rounded-t-[3.5rem] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.35)] border-t border-white/10"
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

const DEFAULT_SECTIONS = [
  { id: "hero", name: "Hero Section", visible: true, zIndex: 10, effect: "hero" },
  { id: "hainan", name: "Hainan Zouk Marathon", visible: true, zIndex: 15, effect: "zoom-in" },
  { id: "about", name: "About Us", visible: true, zIndex: 20, effect: "zoom-in" },
  { id: "classes-events", name: "Weekly Classes & Events", visible: true, zIndex: 30, effect: "slide-left" },
  { id: "media", name: "Media & Gallery", visible: true, zIndex: 35, effect: "zoom-out" },
  { id: "news", name: "News & Articles", visible: true, zIndex: 40, effect: "slide-right" },
  { id: "contact", name: "Contact & Booking", visible: true, zIndex: 48, effect: "3d-rise" }
];

export default function App() {
  const [selectedClass, setSelectedClass] = useState("");
  const [currentPage, setCurrentPage] = useState("home");
  const [sectionsLayout, setSectionsLayout] = useState<any[]>(DEFAULT_SECTIONS);

  const handleSelectClass = (className: string) => {
    setSelectedClass(className);
    trackUserEvent("select_class", "Engagement", className);
    window.location.hash = "#/contact";
  };

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      const targetPage = hash.startsWith("#/") ? hash.slice(2) : "home";
      setCurrentPage(targetPage);
      trackUserEvent("view_page", "Navigation", targetPage);
      window.scrollTo(0, 0);
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // SEO & Global tags optimization client-side synchronizer
  useEffect(() => {
    fetch("/api/frontpage")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          // 1. Dynamic document title
          if (data.seo_title) {
            document.title = data.seo_title;
          }

          // 2. Meta description (Search Engine Compatibility)
          if (data.seo_meta_description !== undefined) {
            let descMeta = document.querySelector('meta[name="description"]');
            if (!descMeta) {
              descMeta = document.createElement("meta");
              descMeta.setAttribute("name", "description");
              document.head.appendChild(descMeta);
            }
            descMeta.setAttribute("content", data.seo_meta_description || data.brand_description || "");
          }

          // 3. Meta keywords (Tag Optimization)
          if (data.seo_keywords !== undefined) {
            let keyMeta = document.querySelector('meta[name="keywords"]');
            if (!keyMeta) {
              keyMeta = document.createElement("meta");
              keyMeta.setAttribute("name", "keywords");
              document.head.appendChild(keyMeta);
            }
            keyMeta.setAttribute("content", data.seo_keywords || "");
          }

          // 4. Robots indexing (Search Engine compatibility)
          if (data.seo_robots) {
            let robMeta = document.querySelector('meta[name="robots"]');
            if (!robMeta) {
              robMeta = document.createElement("meta");
              robMeta.setAttribute("name", "robots");
              document.head.appendChild(robMeta);
            }
            robMeta.setAttribute("content", data.seo_robots);
          }

          // 5. Google Site Verification (GSC tracking tag optimization)
          if (data.google_site_verification) {
            let gscMeta = document.querySelector('meta[name="google-site-verification"]');
            if (!gscMeta) {
              gscMeta = document.createElement("meta");
              gscMeta.setAttribute("name", "google-site-verification");
              document.head.appendChild(gscMeta);
            }
            gscMeta.setAttribute("content", data.google_site_verification);
          }

          // 6. OpenGraph custom OG Image
          if (data.seo_og_image) {
            let ogImg = document.querySelector('meta[property="og:image"]');
            if (!ogImg) {
              ogImg = document.createElement("meta");
              ogImg.setAttribute("property", "og:image");
              document.head.appendChild(ogImg);
            }
            ogImg.setAttribute("content", data.seo_og_image);
          }

          // 7. Dynamic Favicon Link
          if (data.favicon_url) {
            let favLink: HTMLLinkElement | null = document.querySelector("link[rel='icon']") || document.querySelector("link[rel='shortcut icon']");
            if (!favLink) {
              favLink = document.createElement("link");
              favLink.setAttribute("rel", "icon");
              document.head.appendChild(favLink);
            }
            favLink.setAttribute("href", data.favicon_url);
          }

          // 8. Custom HTML / Optimization tags injector (scripts, verification, meta tags)
          if (data.seo_custom_tags) {
            injectTrackingTags(data.seo_custom_tags);
          }

          // 9. Load Page Builder Dynamic Layout
          if (data.sections_order) {
            try {
              const parsed = JSON.parse(data.sections_order);
              if (Array.isArray(parsed) && parsed.length > 0) {
                // Merge with default list to handle any added or missing sections gracefully
                const merged = parsed.map((item: any) => {
                  const def = DEFAULT_SECTIONS.find(d => d.id === item.id);
                  return { ...def, ...item };
                });
                
                // Add any default sections that might be missing from the database record
                DEFAULT_SECTIONS.forEach(def => {
                  if (!merged.some((m: any) => m.id === def.id)) {
                    merged.push(def);
                  }
                });

                setSectionsLayout(merged);
              } else {
                setSectionsLayout(DEFAULT_SECTIONS);
              }
            } catch (err) {
              setSectionsLayout(DEFAULT_SECTIONS);
            }
          } else {
            setSectionsLayout(DEFAULT_SECTIONS);
          }
        }
      })
      .catch((err) => console.error("SEO sync error:", err));
  }, []);

  const renderSubPage = () => {
    let content = null;
    let title = "";
    let subtitle = "";

    switch (currentPage) {
      case "admin":
        content = <AdminPanel />;
        title = "Admin Panel";
        subtitle = "Modify frontpage content, manage classes, upcoming events, news articles, and read contact bookings.";
        break;
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
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
          {sectionsLayout
            .filter((sec: any) => sec.visible !== false)
            .map((sec: any) => {
              switch (sec.id) {
                case "hero":
                  return (
                    <ScrollSection key="hero" zIndex={sec.zIndex} effect={sec.effect}>
                      <Hero />
                    </ScrollSection>
                  );
                case "about":
                  return (
                    <ScrollSection key="about" zIndex={sec.zIndex} effect={sec.effect}>
                      <About />
                    </ScrollSection>
                  );
                case "classes-events":
                  return (
                    <ScrollSection key="classes-events" zIndex={sec.zIndex} effect={sec.effect}>
                      <ClassesEvents onSelectClass={handleSelectClass} />
                    </ScrollSection>
                  );
                case "media":
                  return (
                    <ScrollSection key="media" zIndex={sec.zIndex} effect={sec.effect}>
                      <Media />
                    </ScrollSection>
                  );
                case "news":
                  return (
                    <ScrollSection key="news" zIndex={sec.zIndex} effect={sec.effect}>
                      <News />
                    </ScrollSection>
                  );
                case "hainan":
                  return (
                    <ScrollSection key="hainan" zIndex={sec.zIndex} effect={sec.effect}>
                      <HainanMarathon />
                    </ScrollSection>
                  );
                case "contact":
                  return (
                    <ScrollSection key="contact" zIndex={sec.zIndex} effect={sec.effect}>
                      <Contact selectedClass={selectedClass} />
                    </ScrollSection>
                  );
                default:
                  return null;
              }
            })}
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
