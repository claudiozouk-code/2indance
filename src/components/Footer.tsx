import { Instagram, Facebook, Youtube, MessageCircle, Mail } from "lucide-react";
import { brandDetails } from "../data";
// @ts-ignore
import logoImage from "../assets/images/logo_2indance_1782381576138.jpg";

export default function Footer() {
  const currentYear = new Date().getFullYear();

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

  return (
    <footer className="bg-[#3b3f3a] border-t border-[#9bb08a]/20 py-12 md:py-16 text-[#fff6da]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Layout */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-[#9bb08a]/15">
          
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 max-w-sm">
            <button
              onClick={() => handleScrollTo("home")}
              className="flex items-center space-x-3 group text-left cursor-pointer"
            >
              <img
                src={logoImage}
                alt="2inDance Logo"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full border border-[#f6c86b]/30 object-cover group-hover:border-[#f6c86b] transition-all duration-300"
              />
              <div className="text-left">
                <span className="font-display text-lg font-bold tracking-tight text-[#fff6da] flex items-baseline">
                  2<span className="italic font-sans text-[10px] lowercase text-[#f6c86b] mx-0.5">in</span>
                  <span className="font-display font-medium text-white">Dance</span>
                </span>
                <p className="text-[8px] font-montserrat tracking-widest text-[#ffe6a6] uppercase leading-none">
                  by Xina & Laura
                </p>
              </div>
            </button>
            <p className="font-sans text-xs text-[#fff6da]/60 font-light leading-relaxed">
              Celebrating connection, music, and movement since 2005. Join our world-class partner dance school in the heart of Hong Kong.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <button onClick={() => handleScrollTo("home")} className="font-montserrat text-xs tracking-wide hover:text-[#f6c86b] transition-colors cursor-pointer">
              Home
            </button>
            <button onClick={() => handleScrollTo("about")} className="font-montserrat text-xs tracking-wide hover:text-[#f6c86b] transition-colors cursor-pointer">
              About Us
            </button>
            <button onClick={() => handleScrollTo("classes-events")} className="font-montserrat text-xs tracking-wide hover:text-[#f6c86b] transition-colors cursor-pointer">
              Class/Events
            </button>
            <button onClick={() => handleScrollTo("media")} className="font-montserrat text-xs tracking-wide hover:text-[#f6c86b] transition-colors cursor-pointer">
              Media
            </button>
            <button onClick={() => handleScrollTo("news")} className="font-montserrat text-xs tracking-wide hover:text-[#f6c86b] transition-colors cursor-pointer">
              News
            </button>
            <button onClick={() => handleScrollTo("contact")} className="font-montserrat text-xs tracking-wide hover:text-[#f6c86b] transition-colors cursor-pointer">
              Contact
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-white/5 border border-[#9bb08a]/20 hover:border-[#f6c86b] text-[#fff6da] hover:text-[#f6c86b] rounded-xl transition-all duration-300"
              title="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-white/5 border border-[#9bb08a]/20 hover:border-[#f6c86b] text-[#fff6da] hover:text-[#f6c86b] rounded-xl transition-all duration-300"
              title="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-white/5 border border-[#9bb08a]/20 hover:border-[#f6c86b] text-[#fff6da] hover:text-[#f6c86b] rounded-xl transition-all duration-300"
              title="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href={`https://wa.me/447984564350`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-white/5 border border-[#9bb08a]/20 hover:border-[#f6c86b] text-[#fff6da] hover:text-[#f6c86b] rounded-xl transition-all duration-300"
              title="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Bottom Rights Disclaimer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-center md:text-left text-[11px] text-[#fff6da]/40 font-light">
          <p>© {currentYear} {brandDetails.name}. All rights reserved.</p>
          <p className="font-montserrat tracking-widest text-[9px] uppercase font-bold text-[#ffe6a6]/50">
            Made with love for the Global Zouk Community ❤️
          </p>
        </div>

      </div>
    </footer>
  );
}
