import { useState, useEffect } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { brandDetails } from "../data";
// @ts-ignore
import logoImage from "../assets/images/logo_2indance_1782381576138.jpg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [currentPage, setCurrentPage] = useState("home");

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
              src={logoImage}
              alt="2inDance Logo"
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-full border border-[#f6c86b]/40 object-cover group-hover:border-[#f6c86b] transition-all duration-300 shadow-md group-hover:scale-105"
            />
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-[#fff6da] flex items-baseline">
                2<span className="italic font-sans text-xs lowercase text-[#f6c86b] mx-0.5">in</span>
                <span className="font-display font-medium text-white">Dance</span>
              </span>
              <p className="text-[9px] font-montserrat tracking-widest text-[#ffe6a6]/80 uppercase leading-none">
                by Xina & Laura
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`font-montserrat text-xs font-semibold tracking-wider transition-colors duration-200 uppercase cursor-pointer relative ${
                    currentPage === item.id 
                      ? "text-[#f6c86b]" 
                      : "text-[#fff6da]/90 hover:text-[#f6c86b]"
                  }`}
                >
                  {item.label}
                  {currentPage === item.id && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#f6c86b]" />
                  )}
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4 border-l border-[#9bb08a]/20 pl-6">
              {/* WhatsApp Quick Chat */}
              <a
                href={`https://wa.me/447984564350`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#fff6da]/80 hover:text-[#f6c86b] transition-colors duration-200"
                title="Chat with us"
              >
                <MessageCircle className="w-5 h-5 text-[#9bb08a] hover:text-[#f6c86b] transition-colors" />
              </a>

              <button
                onClick={() => handleNavigate("contact")}
                className="px-5 py-2.5 rounded-xl bg-[#f6c86b] text-[#3b3f3a] font-montserrat text-[11px] font-bold tracking-widest uppercase hover:bg-[#ffe6a6] transition-all duration-300 shadow-md shadow-[#f6c86b]/10 cursor-pointer"
              >
                Book Now
              </button>
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
