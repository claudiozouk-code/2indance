import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
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
  zIndex?: number;
  effect?: string;
  className?: string;
}

function ScrollSection({ children, className = "" }: ScrollSectionProps) {
  return (
    <div className={`w-full bg-[#3b3f3a] ${className}`}>
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  );
}

const DEFAULT_SECTIONS = [
  { id: "hero", name: "Hero Section", visible: true, zIndex: 10, effect: "hero" },
  { id: "classes-events", name: "Weekly Classes & Events", visible: true, zIndex: 20, effect: "slide-left" },
  { id: "hainan", name: "Hainan Zouk Marathon", visible: true, zIndex: 30, effect: "zoom-in" },
  { id: "media", name: "Media & Gallery", visible: true, zIndex: 40, effect: "zoom-out" },
  { id: "about", name: "About Us", visible: true, zIndex: 50, effect: "zoom-in" },
  { id: "news", name: "News & Articles", visible: true, zIndex: 60, effect: "slide-right" },
  { id: "contact", name: "Contact & Booking", visible: true, zIndex: 70, effect: "3d-rise" }
];

export default function App() {
  const [selectedClass, setSelectedClass] = useState("");
  const [currentPage, setCurrentPage] = useState("home");
  const [sectionsLayout, setSectionsLayout] = useState<any[]>(DEFAULT_SECTIONS);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScrollProgress = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentScroll = window.scrollY;
        const progress = Math.min(Math.max((currentScroll / totalHeight) * 100, 0), 100);
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener("scroll", handleScrollProgress, { passive: true });
    window.addEventListener("resize", handleScrollProgress);
    handleScrollProgress();

    return () => {
      window.removeEventListener("scroll", handleScrollProgress);
      window.removeEventListener("resize", handleScrollProgress);
    };
  }, []);

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
      .then((res) => {
        const ct = res.headers.get("content-type") || "";
        if (res.ok && ct.includes("application/json")) {
          return res.json();
        }
        const cached = localStorage.getItem("admin_frontpage_settings");
        return cached ? JSON.parse(cached) : null;
      })
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
      {/* Top Viewport Scroll Progress Bar */}
      <div 
        id="scroll-progress-bar-container"
        className="fixed top-0 left-0 right-0 z-[1000] h-1 bg-black/20 backdrop-blur-sm pointer-events-none"
      >
        <div 
          id="scroll-progress-bar-fill"
          className="h-full bg-gradient-to-r from-[#f6c86b] via-[#e5a045] to-[#f6c86b] transition-all duration-150 ease-out shadow-[0_0_10px_rgba(246,200,107,0.8)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Navigation Bar */}
      <Navbar />

      {currentPage === "home" ? (
        /* Main Page Layout */
        <main className="relative">
          {sectionsLayout
            .filter((sec: any) => sec.visible !== false)
            .map((sec: any, index: number) => {
              const computedZIndex = (index + 1) * 10;
              switch (sec.id) {
                case "hero":
                  return (
                    <ScrollSection key="hero" zIndex={computedZIndex} effect={sec.effect}>
                      <Hero />
                    </ScrollSection>
                  );
                case "about":
                  return (
                    <ScrollSection key="about" zIndex={computedZIndex} effect={sec.effect}>
                      <About />
                    </ScrollSection>
                  );
                case "classes-events":
                  return (
                    <ScrollSection key="classes-events" zIndex={computedZIndex} effect={sec.effect}>
                      <ClassesEvents onSelectClass={handleSelectClass} />
                    </ScrollSection>
                  );
                case "media":
                  return (
                    <ScrollSection key="media" zIndex={computedZIndex} effect={sec.effect}>
                      <Media />
                    </ScrollSection>
                  );
                case "news":
                  return (
                    <ScrollSection key="news" zIndex={computedZIndex} effect={sec.effect}>
                      <News />
                    </ScrollSection>
                  );
                case "hainan":
                  return (
                    <ScrollSection key="hainan" zIndex={computedZIndex} effect={sec.effect}>
                      <HainanMarathon />
                    </ScrollSection>
                  );
                case "contact":
                  return (
                    <ScrollSection key="contact" zIndex={computedZIndex} effect={sec.effect}>
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
      <div className="relative z-[100]">
        <Footer />
      </div>
    </div>
  );
}
