import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { Menu, X, MessageCircle } from "lucide-react";
import { brandDetails } from "../data";
// @ts-ignore
import logoImage from "../assets/images/logo_2indance_1782381576138.jpg";

interface MagneticNavItemProps {
  key?: React.Key;
  label: string;
  id: string;
  isActive: boolean;
  onClick: () => void;
}

function MagneticNavItem({ label, id, isActive, onClick }: MagneticNavItemProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Soft tactile spring physics
  const springConfig = { damping: 15, stiffness: 200, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "touch" || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // Elastic magnetic pull factor (capped for elegance)
    const pullFactor = 0.36;
    const maxPullX = 10;
    const maxPullY = 8;

    const clampedX = Math.max(Math.min(distanceX * pullFactor, maxPullX), -maxPullX);
    const clampedY = Math.max(Math.min(distanceY * pullFactor, maxPullY), -maxPullY);

    x.set(clampedX);
    y.set(clampedY);
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={buttonRef}
      id={`nav-item-${id}`}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={{ x: springX, y: springY }}
      className={`relative px-3.5 py-1.5 rounded-xl font-montserrat text-xs font-semibold tracking-wider uppercase cursor-pointer select-none transition-colors duration-200 focus:outline-none will-change-transform ${
        isActive ? "text-[#f6c86b]" : "text-[#fff6da]/90 hover:text-[#f6c86b]"
      }`}
    >
      {/* Subtle magnetic ambient highlight backdrop */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
          isHovered
            ? "bg-[#f6c86b]/12 shadow-[0_0_14px_rgba(246,200,107,0.18)] scale-105 opacity-100"
            : "opacity-0 scale-95"
        }`}
      />

      {/* Label text */}
      <span className="relative z-10">{label}</span>

      {/* Active Dot Indicator */}
      {isActive && (
        <motion.span
          layoutId="activeNavDot"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#f6c86b] shadow-[0_0_8px_rgba(246,200,107,0.85)]"
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
        />
      )}
    </motion.button>
  );
}

function MagneticWrapper({
  children,
  className = "",
  strength = 0.28,
  maxDistance = 8
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  maxDistance?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 200, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    x.set(Math.max(Math.min(distanceX * strength, maxDistance), -maxDistance));
    y.set(Math.max(Math.min(distanceY * strength, maxDistance), -maxDistance));
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [currentPage, setCurrentPage] = useState("home");
  const [frontpage, setFrontpage] = useState<any>({
    brand_name: "2inDance",
    brand_tagline: "The Art of FusionDance in Motion",
    logo_url: ""
  });

  useEffect(() => {
    fetch("/api/frontpage")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setFrontpage(data);
        }
      })
      .catch((err) => console.error("Error loading frontpage content in Navbar:", err));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#/")) {
        setCurrentPage(hash.slice(2));
      } else {
        setCurrentPage("home");
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHash);
    };
  }, []);

  const navItems = [
    { label: "Home", id: "home" },
    { label: "About Us", id: "about" },
    { label: "Class / Events", id: "classes-events" },
    { label: "Media", id: "media" },
    { label: "News", id: "news" },
    { label: "Contact", id: "contact" },
  ];

  const handleNavigate = (id: string) => {
    setIsOpen(false);
    if (id === "home") {
      window.location.hash = "";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.hash = "#/" + id;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav
      id="app-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#3b3f3a]/95 border-b border-[#9bb08a]/20 backdrop-blur-md py-3 shadow-xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Brand */}
          <button
            onClick={() => handleNavigate("home")}
            className="flex items-center space-x-3 group text-left cursor-pointer focus:outline-none"
            id="nav-logo-btn"
          >
            <img
              src={frontpage.logo_url || logoImage}
              alt="Brand Logo"
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-full border border-[#f6c86b]/40 object-cover group-hover:border-[#f6c86b] transition-all duration-300 shadow-md group-hover:scale-105"
            />
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-[#fff6da] flex items-baseline">
                {frontpage.brand_name === "2inDance" ? (
                  <>
                    2<span className="italic font-sans text-xs lowercase text-[#f6c86b] mx-0.5">in</span>
                    <span className="font-display font-medium text-white">Dance</span>
                  </>
                ) : (
                  frontpage.brand_name || "2inDance"
                )}
              </span>
              <p className="text-[9px] font-montserrat tracking-widest text-[#ffe6a6]/80 uppercase leading-none">
                {frontpage.brand_tagline || "by Xina & Laura"}
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <MagneticNavItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  isActive={currentPage === item.id}
                  onClick={() => handleNavigate(item.id)}
                />
              ))}
            </div>

            {/* CTA Buttons with Magnetic Hover Feel */}
            <div className="flex items-center space-x-4 border-l border-[#9bb08a]/20 pl-6">
              {/* WhatsApp Quick Chat */}
              <MagneticWrapper strength={0.35} maxDistance={6}>
                <a
                  href={`https://wa.me/447984564350`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-2 rounded-xl text-[#fff6da]/80 hover:text-[#f6c86b] hover:bg-[#f6c86b]/10 transition-colors duration-200"
                  title="Chat with us"
                >
                  <MessageCircle className="w-5 h-5 text-[#9bb08a] hover:text-[#f6c86b] transition-colors" />
                </a>
              </MagneticWrapper>

              <MagneticWrapper strength={0.3} maxDistance={8}>
                <button
                  onClick={() => handleNavigate("contact")}
                  className="px-5 py-2.5 rounded-xl bg-[#f6c86b] text-[#3b3f3a] font-montserrat text-[11px] font-bold tracking-widest uppercase hover:bg-[#ffe6a6] transition-all duration-300 shadow-md shadow-[#f6c86b]/10 cursor-pointer"
                >
                  Book Now
                </button>
              </MagneticWrapper>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <a
              href={`https://wa.me/447984564350`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-[#9bb08a] hover:text-[#f6c86b] transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#fff6da] hover:text-white transition-colors p-1 focus:outline-none"
              id="mobile-menu-toggle-btn"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden fixed inset-x-0 top-[68px] bg-[#3b3f3a] border-b border-[#9bb08a]/20 transition-all duration-300 ease-in-out origin-top ${
          isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"
        }`}
      >
        <div className="px-4 py-6 space-y-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`block w-full text-left font-montserrat text-sm font-semibold tracking-wider transition-colors duration-200 uppercase py-2 border-b border-[#9bb08a]/10 ${
                currentPage === item.id ? "text-[#f6c86b]" : "text-[#fff6da] hover:text-[#f6c86b]"
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4">
            <button
              onClick={() => handleNavigate("contact")}
              className="w-full bg-[#f6c86b] text-[#3b3f3a] font-montserrat text-xs font-bold tracking-widest uppercase py-3.5 rounded-xl text-center transition-all duration-300 shadow-md"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
