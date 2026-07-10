import { useState } from "react";
import { motion } from "motion/react";
import { Play, Sparkles, Image as ImageIcon, Music, Video, X } from "lucide-react";
import { mediaItems } from "../data";

export default function Media() {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const filters = ["All", "Performance", "Class Highlight", "Workshop", "Social Dance"];

  const filteredMedia = selectedFilter === "All"
    ? mediaItems
    : mediaItems.filter(item => item.category === selectedFilter);

  return (
    <section id="media" className="py-20 md:py-28 bg-gradient-to-b from-[#F2F4F1] via-[#EAEFE9] to-[#F7FAF6] text-[#3b3f3a] relative overflow-hidden border-t border-[#9bb08a]/25">
      {/* 1. Luminous Stage Spotlight Beams */}
      <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 800" preserveAspectRatio="none">
          <path d="M 0,0 L 500,800 L 100,800 Z" fill="url(#beamGrad1)" />
          <path d="M 1440,0 L 940,800 L 1340,800 Z" fill="url(#beamGrad2)" />
          <defs>
            <linearGradient id="beamGrad1" x1="0%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#f6c86b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f6c86b" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="beamGrad2" x1="100%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#9bb08a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#9bb08a" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Decorative organic background glows */}
      <div className="absolute top-1/2 left-[-10%] w-[40vw] h-[40vw] bg-[#f6c86b]/12 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-[-10%] w-[45vw] h-[45vw] bg-[#9bb08a]/20 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-[#3b3f3a]/5 border border-[#3b3f3a]/10 px-3.5 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#f6c86b]" />
            <span className="font-montserrat text-[10px] font-bold tracking-widest text-[#3b3f3a]/80 uppercase">
              Our Media
            </span>
          </div>
          <h2 className="font-display text-3.5xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#3b3f3a] uppercase">
            Dance In Action
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#3b3f3a]/75 font-light">
            Capture the energy, grace, and community vibes of 2inDance. Explore our class recaps, performances, and student moments.
          </p>
        </motion.div>

        {/* Media Category Filters */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-2 mb-12"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4.5 py-2.5 rounded-xl font-montserrat text-xs font-bold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                selectedFilter === filter
                  ? "bg-[#3b3f3a] text-[#fff6da] border-[#3b3f3a] shadow-sm"
                  : "bg-white/40 hover:bg-[#ffe6a6]/50 border-[#9bb08a]/25 text-[#3b3f3a]/80"
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredMedia.map((item, idx) => (
            <motion.div
              key={item.id}
              onClick={() => {
                if (item.type === "video") {
                  setActiveVideo(item.title);
                }
              }}
              initial={{ opacity: 0, y: 35, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group bg-[#ffe6a6]/25 border border-[#9bb08a]/20 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer relative"
            >
              {/* Thumbnail Container */}
              <div className="aspect-video relative overflow-hidden bg-black/5">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                />
                
                {/* Media Type Icon & Hover Overlay */}
                <div className="absolute inset-0 bg-[#3b3f3a]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-14 h-14 bg-[#f6c86b] text-[#3b3f3a] rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    {item.type === "video" ? (
                      <Play className="w-6 h-6 fill-[#3b3f3a] ml-1" />
                    ) : (
                      <ImageIcon className="w-6 h-6" />
                    )}
                  </div>
                </div>

                {/* Badge Category */}
                <span className="absolute top-4 left-4 bg-[#3b3f3a] text-[#fff6da] font-montserrat text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded">
                  {item.category}
                </span>

                {/* Video Play Trigger (Indicator) */}
                {item.type === "video" && (
                  <div className="absolute bottom-4 right-4 bg-black/60 p-1.5 rounded-lg text-[#fff6da] group-hover:hidden transition-all">
                    <Video className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Title Info */}
              <div className="p-5">
                <h3 className="font-display text-base font-bold text-[#3b3f3a] group-hover:text-[#9bb08a] transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="font-sans text-[11px] text-[#3b3f3a]/60 uppercase tracking-widest font-semibold mt-1">
                  {item.type === "video" ? "Video Reel" : "Photo Gallery"}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Music Playlist Promo Card (Aesthetic Value integration) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 bg-[#3b3f3a] text-[#fff6da] rounded-3xl p-8 md:p-12 border border-[#9bb08a]/20 shadow-lg relative overflow-hidden"
        >
          {/* Background overlay design */}
          <div className="absolute top-[-30px] right-[-30px] w-64 h-64 bg-[#ffe6a6]/5 rounded-full blur-[40px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-white/5 border border-[#9bb08a]/20 px-3 py-1 rounded-full">
                <Music className="w-3.5 h-3.5 text-[#f6c86b]" />
                <span className="font-montserrat text-[9px] font-bold uppercase tracking-wider text-[#ffe6a6]">Spotify Community Playlist</span>
              </div>
              <h3 className="font-display text-2.5xl sm:text-3xl font-bold uppercase tracking-tight">
                Listen to Our Official Dance Beat
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#fff6da]/80 font-light leading-relaxed max-w-2xl">
                We've handpicked the absolute best Brazilian Zouk, modern Lambada, and swingy Samba de Gafieira beats to help you practice your connection and footwork flow at home. Updated weekly by Xina and Laura.
              </p>
            </div>
            
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <a
                href="https://spotify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 bg-[#f6c86b] hover:bg-[#ffe6a6] text-[#3b3f3a] font-montserrat text-xs font-bold tracking-widest uppercase px-8 py-4.5 rounded-xl transition-all duration-300 shadow-md cursor-pointer hover:-translate-y-0.5"
              >
                <span>Listen on Spotify</span>
                <Play className="w-3.5 h-3.5 fill-[#3b3f3a]" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Interactive Video Modal Overlay */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3b3f3a]/90 backdrop-blur-sm">
            <div className="relative bg-[#3b3f3a] border border-[#9bb08a]/30 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl">
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 text-[#fff6da] hover:text-[#f6c86b] p-1.5 rounded-full border border-white/10 hover:border-[#f6c86b]/40 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <span className="font-montserrat text-[10px] font-bold text-[#f6c86b] uppercase tracking-widest">
                  Preview Mode
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#fff6da] leading-tight pr-6">
                  {activeVideo}
                </h3>
                
                {/* Fake High Fidelity player placeholder */}
                <div className="aspect-video bg-[#2a2d29] border border-[#9bb08a]/20 rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#f6c86b]/5 to-transparent pointer-events-none" />
                  
                  <div className="w-16 h-16 bg-[#f6c86b]/15 border border-[#f6c86b]/30 rounded-full flex items-center justify-center text-[#f6c86b] animate-pulse">
                    <Play className="w-7 h-7 fill-[#f6c86b] ml-1" />
                  </div>
                  <h4 className="font-display text-sm font-semibold text-[#fff6da]">Video stream connecting...</h4>
                  <p className="font-sans text-xs text-[#fff6da]/60 max-w-sm font-light">
                    This is a preview mode of our dance media system. For complete high resolution 4K performance videos, follow us on our YouTube and Instagram accounts!
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setActiveVideo(null)}
                    className="px-5 py-2.5 rounded-xl border border-[#9bb08a]/30 text-[#fff6da] hover:bg-white/5 font-montserrat text-[10px] font-bold uppercase tracking-widest cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
