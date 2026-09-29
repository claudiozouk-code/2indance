import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
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
import SectionTransitionDivider from "./components/SectionTransitionDivider";
import ScrollRadar from "./components/ScrollRadar";
import DanceParticleTrail from "./components/DanceParticleTrail";
import { injectTrackingTags, trackUserEvent } from "./utils";

interface ScrollSectionProps {
  key?: React.Key;
  id?: string;
  children: React.ReactNode;
  zIndex?: number;
  effect?: string;
  className?: string;
  showDivider?: boolean;
  dividerLabel?: string;
  dividerTheme?: "gold" | "sage" | "amber";
}

function ScrollSection({
  id,
  children,
  effect = "fade",
  className = "",
  showDivider = false,
  dividerLabel,
  dividerTheme = "gold"
}: ScrollSectionProps) {
  const isHero = id === "home" || id === "hero";
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isInView, setIsInView] = useState(isHero);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }
  }, []);

  // Parallax Scroll Tracking linked to this specific section's scroll progress
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Layer 1: Slow luminous ambient light float (-45px to +45px)
  const slowY = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [-45, 45]);
  // Layer 2: Medium kinetic dance curvature rings drift (-95px to +95px)
  const mediumY = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [-95, 95]);
  // Layer 3: Subtle rotational drift for celestial dance arcs (-15deg to +15deg)
  const rotateDeg = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [-15, 15]);
  // Layer 4: Counter-rotational float (+12deg to -12deg)
  const counterRotateDeg = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [12, -12]);

  // Color palettes tailored to section theme
  const themeColors = {
    gold: {
      glowA: "rgba(246, 200, 107, 0.12)",
      glowB: "rgba(255, 230, 166, 0.08)",
      ring: "rgba(246, 200, 107, 0.14)"
    },
    sage: {
      glowA: "rgba(155, 176, 138, 0.15)",
      glowB: "rgba(255, 246, 218, 0.07)",
      ring: "rgba(155, 176, 138, 0.16)"
    },
    amber: {
      glowA: "rgba(229, 160, 69, 0.15)",
      glowB: "rgba(246, 200, 107, 0.09)",
      ring: "rgba(229, 160, 69, 0.18)"
    }
  }[dividerTheme] || {
    glowA: "rgba(246, 200, 107, 0.12)",
    glowB: "rgba(255, 230, 166, 0.08)",
    ring: "rgba(246, 200, 107, 0.14)"
  };

  return (
    <div ref={sectionRef} id={id} className="relative w-full section-ambient-mesh overflow-hidden">
      {/* 1. Subtle Multi-Layer Parallax Background Elements */}
      {!reducedMotion && (
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none"
        >
          {/* Parallax Layer A: Deep Slow Floating Ambient Light Orb (top-left) */}
          <motion.div
            style={{ 
              y: slowY,
              background: `radial-gradient(circle, ${themeColors.glowA} 0%, rgba(0,0,0,0) 70%)`
            }}
            className="absolute -top-20 -left-16 w-[420px] h-[420px] md:w-[640px] md:h-[640px] rounded-full blur-3xl will-change-transform"
          />

          {/* Parallax Layer B: Deep Slow Floating Ambient Light Orb (bottom-right) */}
          <motion.div
            style={{ 
              y: slowY,
              background: `radial-gradient(circle, ${themeColors.glowB} 0%, rgba(0,0,0,0) 70%)`
            }}
            className="absolute -bottom-24 -right-20 w-[380px] h-[380px] md:w-[580px] md:h-[580px] rounded-full blur-3xl will-change-transform"
          />

          {/* Parallax Layer C: Medium Speed Geometric Dance Ring (Curvature arc) */}
          <motion.div
            style={{ 
              y: mediumY,
              rotate: rotateDeg,
              borderColor: themeColors.ring
            }}
            className="absolute top-1/4 -right-16 md:right-10 w-64 h-64 md:w-96 md:h-96 rounded-full border border-dashed will-change-transform opacity-60"
          />

          {/* Parallax Layer D: Counter-Rotating Fine Ring (Cross-depth kinetic float) */}
          <motion.div
            style={{ 
              y: mediumY,
              rotate: counterRotateDeg,
              borderColor: themeColors.ring
            }}
            className="absolute bottom-1/5 -left-12 md:left-14 w-48 h-48 md:w-72 md:h-72 rounded-full border will-change-transform opacity-50"
          />
        </div>
      )}

      {/* 2. Opening Neon Thread Divider Between Sections ("Fio de Luz se Abrindo") */}
      {showDivider && (
        <SectionTransitionDivider 
          label={dividerLabel} 
          theme={dividerTheme}
        />
      )}

      {/* 3. Section Content with Staggered Text Entrance (relative z-10 for clean hierarchy above parallax background) */}
      <motion.div
        initial={
          isHero || reducedMotion
            ? { opacity: 1, scale: 1, y: 0 }
            : { opacity: 0.4, scale: 0.96, y: 15 }
        }
        whileInView={{
          opacity: 1,
          scale: 1,
          y: 0
        }}
        onViewportEnter={() => setIsInView(true)}
        onViewportLeave={() => {
          if (!isHero) setIsInView(false);
        }}
        viewport={{ once: false, amount: 0.05 }}
        transition={{
          duration: 0.85,
          ease: [0.16, 1, 0.3, 1]
        }}
        className={`w-full relative z-10 ${
          isInView ? "section-stagger-active" : "section-stagger-idle"
        } ${isHero ? "section-stagger-hero" : ""} ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}

const DEFAULT_SECTIONS = [
  { id: "hero", name: "Hero Section", visible: true, zIndex: 10, effect: "fade" },
  { id: "classes-events", name: "Weekly Classes & Events", visible: true, zIndex: 20, effect: "fade" },
  { id: "hainan", name: "Hainan Zouk Marathon", visible: true, zIndex: 30, effect: "fade" },
  { id: "media", name: "Media & Gallery", visible: true, zIndex: 40, effect: "fade" },
  { id: "about", name: "About Us", visible: true, zIndex: 50, effect: "fade" },
  { id: "news", name: "News & Articles", visible: true, zIndex: 60, effect: "fade" },
  { id: "contact", name: "Contact & Booking", visible: true, zIndex: 70, effect: "fade" }
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
        <>
          {/* Subtle cursor dance particle & ribbon trail */}
          <DanceParticleTrail />

          {/* Desktop Floating Scroll Radar Navigator */}
          <ScrollRadar />

          <main className="relative">
            {sectionsLayout
              .filter((sec: any) => sec.visible !== false)
              .map((sec: any, index: number) => {
                const computedZIndex = (index + 1) * 10;
                const isNotFirst = index > 0;

                switch (sec.id) {
                  case "hero":
                    return (
                      <ScrollSection 
                        id="home"
                        key="hero" 
                        zIndex={computedZIndex} 
                        effect={sec.effect}
                        showDivider={false}
                      >
                        <Hero />
                      </ScrollSection>
                    );
                  case "about":
                    return (
                      <ScrollSection 
                        id="about"
                        key="about" 
                        zIndex={computedZIndex} 
                        effect={sec.effect}
                        showDivider={isNotFirst}
                        dividerLabel="Our Story • FusionDance & Philosophy"
                        dividerTheme="sage"
                      >
                        <About />
                      </ScrollSection>
                    );
                  case "classes-events":
                    return (
                      <ScrollSection 
                        id="classes-events"
                        key="classes-events" 
                        zIndex={computedZIndex} 
                        effect={sec.effect}
                        showDivider={isNotFirst}
                        dividerLabel="Classes & Workshops • Soulzouk HK"
                        dividerTheme="gold"
                      >
                        <ClassesEvents onSelectClass={handleSelectClass} />
                      </ScrollSection>
                    );
                  case "media":
                    return (
                      <ScrollSection 
                        id="media"
                        key="media" 
                        zIndex={computedZIndex} 
                        effect={sec.effect}
                        showDivider={isNotFirst}
                        dividerLabel="Moments in Motion • Media Gallery"
                        dividerTheme="gold"
                      >
                        <Media />
                      </ScrollSection>
                    );
                  case "news":
                    return (
                      <ScrollSection 
                        id="news"
                        key="news" 
                        zIndex={computedZIndex} 
                        effect={sec.effect}
                        showDivider={isNotFirst}
                        dividerLabel="Articles & Community • News & Tips"
                        dividerTheme="gold"
                      >
                        <News />
                      </ScrollSection>
                    );
                  case "hainan":
                    return (
                      <ScrollSection 
                        id="hainan"
                        key="hainan" 
                        zIndex={computedZIndex} 
                        effect={sec.effect}
                        showDivider={isNotFirst}
                        dividerLabel="Tropical Paradise • Hainan Marathon 2027"
                        dividerTheme="amber"
                      >
                        <HainanMarathon />
                      </ScrollSection>
                    );
                  case "contact":
                    return (
                      <ScrollSection 
                        id="contact"
                        key="contact" 
                        zIndex={computedZIndex} 
                        effect={sec.effect}
                        showDivider={isNotFirst}
                        dividerLabel="Book Your Class • Connect with Us"
                        dividerTheme="gold"
                      >
                        <Contact selectedClass={selectedClass} />
                      </ScrollSection>
                    );
                  default:
                    return null;
                }
              })}
          </main>
        </>
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
