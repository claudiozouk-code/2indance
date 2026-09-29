import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Sparkles, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2,
  Camera,
  Grid,
  ZoomIn,
  ZoomOut,
  Share2,
  Check,
  Download,
  Calendar,
  MapPin,
  ArrowRight,
  Film
} from "lucide-react";
import { eventGalleries, mediaItems, EventGalleryItem } from "../data";

export default function Media() {
  const [galleries, setGalleries] = useState<EventGalleryItem[]>(eventGalleries);
  const [videos, setVideos] = useState<any[]>(mediaItems.filter(m => m.type === "video"));
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  // Fullscreen event gallery modal state
  const [activeGallery, setActiveGallery] = useState<EventGalleryItem | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [showGridView, setShowGridView] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Active video modal state
  const [activeVideo, setActiveVideo] = useState<any | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch Event Galleries from API if available
    fetch("/api/event-galleries")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGalleries(data);
        }
      })
      .catch((err) => console.error("Error loading event galleries:", err));

    // Fetch Videos
    fetch("/api/media")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const vids = data.filter((m: any) => m.type === "video");
          if (vids.length > 0) setVideos(vids);
        }
      })
      .catch((err) => console.error("Error loading videos:", err));
  }, []);

  const categories = ["All", "Marathon", "Festival", "Workshop", "Social Party", "Classes", "Videos"];

  // Filter galleries according to selected category
  const filteredGalleries = galleries.filter((item) => {
    if (selectedCategory === "All") return true;
    if (selectedCategory === "Videos") return false;
    return item.category === selectedCategory || item.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleNextPhoto = useCallback(() => {
    if (!activeGallery || !activeGallery.photos || activeGallery.photos.length === 0) return;
    setIsZoomed(false);
    setActivePhotoIndex((prev) => (prev + 1) % activeGallery.photos.length);
  }, [activeGallery]);

  const handlePrevPhoto = useCallback(() => {
    if (!activeGallery || !activeGallery.photos || activeGallery.photos.length === 0) return;
    setIsZoomed(false);
    setActivePhotoIndex((prev) => (prev - 1 + activeGallery.photos.length) % activeGallery.photos.length);
  }, [activeGallery]);

  // Toggle browser full screen
  const toggleBrowserFullscreen = () => {
    if (!document.fullscreenElement) {
      if (modalRef.current?.requestFullscreen) {
        modalRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeGallery) {
        if (e.key === "Escape") {
          setActiveGallery(null);
          setIsZoomed(false);
          setShowGridView(false);
        } else if (e.key === "ArrowLeft") {
          handlePrevPhoto();
        } else if (e.key === "ArrowRight") {
          handleNextPhoto();
        } else if (e.key === "f" || e.key === "F") {
          toggleBrowserFullscreen();
        }
      } else if (activeVideo && e.key === "Escape") {
        setActiveVideo(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeGallery, activeVideo, handlePrevPhoto, handleNextPhoto]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (activeGallery || activeVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeGallery, activeVideo]);

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const openGalleryModal = (gallery: EventGalleryItem) => {
    setActiveGallery(gallery);
    setActivePhotoIndex(0);
    setIsZoomed(false);
    setShowGridView(false);
  };

  const currentPhoto = activeGallery && activeGallery.photos && activeGallery.photos[activePhotoIndex] 
    ? activeGallery.photos[activePhotoIndex] 
    : null;

  return (
    <section 
      id="media" 
      className="py-24 md:py-32 bg-gradient-to-b from-[#3b3f3a] via-[#2f332e] to-[#262925] text-[#fff6da] relative overflow-hidden border-t border-[#9bb08a]/20"
    >
      {/* 1. Ambient Glows (Matching Hero Section Design) */}
      <div className="absolute top-[-5%] left-[-5%] w-[45vw] h-[45vw] bg-[#f6c86b]/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[45vw] h-[45vw] bg-[#9bb08a]/15 blur-3xl rounded-full pointer-events-none" />

      {/* 2. Flowing Decorative Ribbons (Matching Hero SVG Flow) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 flex items-center justify-center">
        <svg
          viewBox="0 0 800 800"
          className="w-[110vw] h-[110vw] max-w-none absolute"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="mediaRibbonGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f6c86b" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ffe6a6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#9bb08a" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="mediaRibbonGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9bb08a" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#fff6da" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#f6c86b" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path
            d="M 100 400 C 100 150, 300 100, 400 400 C 500 700, 700 650, 700 400 C 700 150, 500 100, 400 400 C 300 700, 100 650, 100 400 Z"
            stroke="url(#mediaRibbonGrad1)"
            strokeWidth="2"
            className="opacity-60"
          />
          <path
            d="M 400 100 C 150 100, 100 300, 400 400 C 700 500, 650 700, 400 700 C 150 700, 200 500, 400 400 C 600 300, 650 100, 400 100 Z"
            stroke="url(#mediaRibbonGrad2)"
            strokeWidth="1.5"
            className="opacity-40"
          />
        </svg>
      </div>

      {/* 3. Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff6da_1px,transparent_1px),linear-gradient(to_bottom,#fff6da_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 pb-8 border-b border-[#9bb08a]/15 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-[#f6c86b]/10 border border-[#f6c86b]/30 px-3.5 py-1.5 rounded-full mb-4">
              <Camera className="w-3.5 h-3.5 text-[#f6c86b]" />
              <span className="font-montserrat text-[10px] font-bold tracking-widest text-[#ffe6a6] uppercase">
                Media & Photo Galleries
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#fff6da] uppercase leading-none">
              Event <span className="text-[#f6c86b]">Galleries</span> & Media
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#fff6da]/75 font-light mt-3">
              Explore high-definition photo collections and video highlights from our festivals, workshops, marathons, and weekly social parties in Hong Kong.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 items-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-montserrat font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  selectedCategory === category
                    ? "bg-[#f6c86b] text-[#3b3f3a] shadow-lg shadow-[#f6c86b]/20 scale-105"
                    : "bg-[#2a2d29] text-[#fff6da]/70 hover:text-[#fff6da] hover:bg-[#343833] border border-[#9bb08a]/15"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* EVENT GALLERIES GRID */}
        {selectedCategory !== "Videos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {filteredGalleries.map((gallery, idx) => (
              <motion.div
                key={gallery.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => openGalleryModal(gallery)}
                className="group relative bg-[#262925] border border-[#f6c86b]/30 rounded-3xl overflow-hidden shadow-xl neon-card-hover hover:bg-[#2c302a] cursor-pointer flex flex-col justify-between"
              >
                {/* Cover Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1a1c18]">
                  <img
                    src={gallery.coverImage}
                    alt={gallery.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#262925] via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="bg-[#f6c86b] text-[#3b3f3a] font-montserrat text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-md shadow-md">
                      {gallery.category}
                    </span>
                    <span className="bg-[#1c1e1a]/80 backdrop-blur-md text-[#ffe6a6] font-mono text-[11px] font-medium px-2.5 py-1 rounded-md border border-[#ffe6a6]/30 flex items-center space-x-1.5 shadow-md">
                      <Camera className="w-3.5 h-3.5 text-[#f6c86b]" />
                      <span>{gallery.photos?.length || 0} Photos</span>
                    </span>
                  </div>

                  {/* Hover Open Gallery Button Overlay */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 backdrop-blur-[2px]">
                    <span className="px-5 py-2.5 rounded-xl bg-[#f6c86b] text-[#3b3f3a] font-montserrat text-xs font-bold uppercase tracking-wider shadow-xl flex items-center space-x-2 transform scale-95 group-hover:scale-100 transition-transform">
                      <span>Open Fullscreen Gallery</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>

                  {/* Cover Bottom Details */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 text-[#fff6da]">
                    <div className="flex items-center space-x-3 text-xs text-[#ffe6a6] font-montserrat font-medium mb-1">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-[#9bb08a]" />
                        <span>{gallery.date}</span>
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-[#fff6da] group-hover:text-[#f6c86b] transition-colors line-clamp-1">
                      {gallery.title}
                    </h3>
                  </div>
                </div>

                {/* Card Body & Preview Thumbnails */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="font-sans text-xs sm:text-sm text-[#fff6da]/75 leading-relaxed line-clamp-2 font-light">
                    {gallery.description}
                  </p>

                  {/* 4 Mini Photo Preview Strip */}
                  {gallery.photos && gallery.photos.length > 0 && (
                    <div className="pt-3 border-t border-[#9bb08a]/15 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 overflow-hidden">
                        {gallery.photos.slice(0, 4).map((photo, pIdx) => (
                          <div key={pIdx} className="w-10 h-10 rounded-xl overflow-hidden border border-[#9bb08a]/30 shrink-0 bg-[#1a1c18]">
                            <img
                              src={photo.url}
                              alt={photo.title || "Preview"}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {gallery.photos.length > 4 && (
                          <div className="w-10 h-10 rounded-xl bg-[#343833] border border-[#9bb08a]/30 flex items-center justify-center font-mono text-[10px] font-bold text-[#ffe6a6]">
                            +{gallery.photos.length - 4}
                          </div>
                        )}
                      </div>

                      <span className="text-xs font-montserrat font-bold text-[#ffe6a6] group-hover:text-[#f6c86b] transition-colors flex items-center space-x-1">
                        <span>View Photos</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* FEATURED VIDEOS SECTION */}
        {(selectedCategory === "All" || selectedCategory === "Videos") && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#9bb08a]/15">
              <div>
                <span className="font-montserrat text-xs font-bold text-[#ffe6a6] uppercase tracking-widest flex items-center space-x-2">
                  <Film className="w-4 h-4 text-[#f6c86b]" />
                  <span>Video Demos & Performances</span>
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#fff6da] mt-1 uppercase">
                  Featured <span className="text-[#f6c86b]">Videos</span>
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {videos.map((vid, idx) => (
                <motion.div
                  key={vid.id || idx}
                  onClick={() => setActiveVideo(vid)}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group relative bg-[#262925] rounded-3xl overflow-hidden border border-[#f6c86b]/30 shadow-xl neon-card-hover hover:bg-[#2c302a] cursor-pointer"
                >
                  <div className="relative aspect-video w-full bg-[#181a18] overflow-hidden">
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <div className="w-14 h-14 bg-[#f6c86b] rounded-full flex items-center justify-center text-[#3b3f3a] shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute top-3 left-3 bg-[#f6c86b] text-[#3b3f3a] text-[10px] font-montserrat font-bold uppercase px-2.5 py-1 rounded shadow-md">
                      {vid.category}
                    </span>
                  </div>
                  <div className="p-5 bg-[#262925]">
                    <h4 className="font-display text-base font-bold text-[#fff6da] group-hover:text-[#f6c86b] transition-colors truncate">
                      {vid.title}
                    </h4>
                    <p className="font-sans text-xs text-[#fff6da]/60 mt-1 font-light">
                      Click to play video in high definition
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* EVENT PHOTO GALLERY FULLSCREEN MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeGallery && (
          <motion.div 
            ref={modalRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-[#141613]/98 backdrop-blur-2xl select-none overflow-hidden flex flex-col justify-between text-[#fff6da]"
          >
            {/* Ambient Background Halo */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none scale-110 blur-3xl">
              <img
                src={currentPhoto?.url || activeGallery.coverImage}
                alt="Background Halo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141613] via-[#141613]/80 to-transparent" />
            </div>

            {/* 1. TOP HEADER BAR */}
            <header className="relative z-30 w-full px-4 sm:px-8 py-4 flex items-center justify-between bg-[#1f221e]/90 backdrop-blur-md border-b border-[#9bb08a]/20 shadow-xl">
              {/* Left Event Info */}
              <div className="flex items-center space-x-3 sm:space-x-4">
                <span className="bg-[#f6c86b] text-[#3b3f3a] font-montserrat text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-md shadow-md">
                  {activeGallery.category}
                </span>
                <div>
                  <h3 className="font-display text-base sm:text-xl font-bold text-[#fff6da] leading-tight truncate max-w-[200px] sm:max-w-md md:max-w-xl">
                    {activeGallery.title}
                  </h3>
                  <p className="font-sans text-[11px] text-[#ffe6a6]/80 font-light flex items-center space-x-3 mt-0.5">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-[#f6c86b]" />
                      <span>{activeGallery.date}</span>
                    </span>
                    <span className="hidden sm:flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-[#9bb08a]" />
                      <span>{activeGallery.location}</span>
                    </span>
                  </p>
                </div>
              </div>

              {/* Right Action Controls */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Photo Counter */}
                <span className="font-mono text-xs text-[#fff6da]/80 bg-[#2a2d29] px-3 py-1.5 rounded-full border border-[#9bb08a]/20 shadow-sm">
                  <strong className="text-[#f6c86b]">{activePhotoIndex + 1}</strong> / {activeGallery.photos?.length || 0}
                </span>

                {/* Grid View Toggle Button */}
                <button
                  onClick={() => setShowGridView(!showGridView)}
                  className={`p-2.5 rounded-full transition-all cursor-pointer border ${
                    showGridView 
                      ? "bg-[#f6c86b] text-[#3b3f3a] border-[#f6c86b] shadow-lg" 
                      : "bg-[#2a2d29] text-white hover:bg-[#343833] border-[#9bb08a]/20"
                  }`}
                  title={showGridView ? "Back to Slideshow" : "Photo Grid View"}
                >
                  <Grid className="w-4 h-4" />
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-full bg-[#2a2d29] hover:bg-[#f6c86b] hover:text-[#3b3f3a] text-white transition-all cursor-pointer border border-[#9bb08a]/20"
                  title="Copy Media Link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>

                {/* Download Button */}
                {currentPhoto && (
                  <a
                    href={currentPhoto.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="p-2.5 rounded-full bg-[#2a2d29] hover:bg-[#f6c86b] hover:text-[#3b3f3a] text-white transition-all cursor-pointer border border-[#9bb08a]/20"
                    title="Download HD Photo"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}

                {/* Zoom Toggle */}
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="p-2.5 rounded-full bg-[#2a2d29] hover:bg-[#f6c86b] hover:text-[#3b3f3a] text-white transition-all cursor-pointer border border-[#9bb08a]/20 hidden sm:flex"
                  title={isZoomed ? "Zoom Out" : "Zoom In"}
                >
                  {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                </button>

                {/* Browser Fullscreen Toggle */}
                <button
                  onClick={toggleBrowserFullscreen}
                  className="p-2.5 rounded-full bg-[#2a2d29] hover:bg-[#f6c86b] hover:text-[#3b3f3a] text-white transition-all cursor-pointer border border-[#9bb08a]/20 hidden sm:flex"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen (F)"}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Close Modal Button */}
                <button
                  onClick={() => {
                    setActiveGallery(null);
                    setIsZoomed(false);
                    setShowGridView(false);
                  }}
                  className="p-2.5 rounded-full bg-[#f6c86b] text-[#3b3f3a] hover:bg-white hover:text-black transition-all cursor-pointer font-bold shadow-2xl ml-1"
                  title="Close Gallery (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* 2. MAIN VIEWPORT STAGE */}
            <div className="relative flex-1 z-10 w-full h-full flex items-center justify-center p-2 sm:p-6 overflow-hidden">
              
              {/* GRID OVERLAY VIEW IF TOGGLED */}
              {showGridView ? (
                <div className="w-full max-w-6xl h-full max-h-[80vh] overflow-y-auto p-6 bg-[#1f221e]/90 backdrop-blur-xl rounded-3xl border border-[#9bb08a]/20 shadow-2xl scrollbar-none">
                  <div className="flex items-center justify-between pb-4 border-b border-[#9bb08a]/15 mb-6">
                    <h4 className="font-display text-lg font-bold text-[#fff6da] flex items-center space-x-2">
                      <Grid className="w-5 h-5 text-[#f6c86b]" />
                      <span>All {activeGallery.photos?.length || 0} Event Photos</span>
                    </h4>
                    <button
                      onClick={() => setShowGridView(false)}
                      className="px-4 py-1.5 rounded-xl bg-[#f6c86b] text-[#3b3f3a] font-montserrat text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#ffe6a6] transition-colors"
                    >
                      Back to Reader
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {activeGallery.photos?.map((photo, pIdx) => (
                      <button
                        key={photo.id || pIdx}
                        onClick={() => {
                          setActivePhotoIndex(pIdx);
                          setShowGridView(false);
                          setIsZoomed(false);
                        }}
                        className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer shadow-lg ${
                          pIdx === activePhotoIndex
                            ? "border-[#f6c86b] ring-4 ring-[#f6c86b]/40 scale-102"
                            : "border-white/10 hover:border-white/50 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={photo.url}
                          alt={photo.title || "Photo"}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-left">
                          <span className="font-display text-xs font-bold text-[#fff6da] truncate">
                            {photo.title || `Photo ${pIdx + 1}`}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* MAIN PHOTO VIEWER STAGE */
                <>
                  {/* PREVIOUS NAV BUTTON */}
                  {activeGallery.photos && activeGallery.photos.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevPhoto();
                      }}
                      className="absolute left-3 sm:left-8 z-30 p-3 sm:p-4 rounded-full bg-[#1c1e1a]/80 hover:bg-[#f6c86b] text-white hover:text-[#3b3f3a] border border-[#9bb08a]/30 transition-all duration-300 cursor-pointer shadow-2xl hover:scale-110 active:scale-95 group"
                      title="Previous Photo (Left Arrow)"
                    >
                      <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                  )}

                  {/* MAIN PHOTO DISPLAY */}
                  <div className="w-full h-full flex flex-col items-center justify-center max-w-7xl max-h-[82vh] relative">
                    {currentPhoto && (
                      <motion.div
                        key={currentPhoto.id || activePhotoIndex}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: isZoomed ? 1.35 : 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full h-full flex flex-col items-center justify-center cursor-zoom-in relative"
                        onClick={() => setIsZoomed(!isZoomed)}
                      >
                        <img
                          src={currentPhoto.url}
                          alt={currentPhoto.title || activeGallery.title}
                          referrerPolicy="no-referrer"
                          className="max-h-[72vh] w-auto max-w-full object-contain rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.9)] border border-[#9bb08a]/20 transition-transform duration-300"
                        />

                        {/* Photo Caption Overlay */}
                        {(currentPhoto.title || currentPhoto.caption) && !isZoomed && (
                          <div className="mt-3 px-6 py-2.5 rounded-2xl bg-[#1c1e1a]/90 backdrop-blur-md border border-[#9bb08a]/25 text-center max-w-xl shadow-2xl">
                            {currentPhoto.title && (
                              <h4 className="font-display text-sm sm:text-base font-bold text-[#fff6da]">
                                {currentPhoto.title}
                              </h4>
                            )}
                            {currentPhoto.caption && (
                              <p className="font-sans text-xs text-[#fff6da]/70 font-light mt-0.5">
                                {currentPhoto.caption}
                              </p>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {/* NEXT NAV BUTTON */}
                  {activeGallery.photos && activeGallery.photos.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextPhoto();
                      }}
                      className="absolute right-3 sm:right-8 z-30 p-3 sm:p-4 rounded-full bg-[#1c1e1a]/80 hover:bg-[#f6c86b] text-white hover:text-[#3b3f3a] border border-[#9bb08a]/30 transition-all duration-300 cursor-pointer shadow-2xl hover:scale-110 active:scale-95 group"
                      title="Next Photo (Right Arrow)"
                    >
                      <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                </>
              )}
            </div>

            {/* 3. BOTTOM CAROUSEL FILMSTRIP THUMBNAILS */}
            <footer className="relative z-30 w-full px-4 py-3 flex flex-col items-center justify-center bg-[#1f221e]/90 backdrop-blur-md border-t border-[#9bb08a]/20 shadow-2xl">
              {activeGallery.photos && activeGallery.photos.length > 1 && (
                <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto max-w-full py-1 px-4 scrollbar-none">
                  {activeGallery.photos.map((photo, pIdx) => (
                    <button
                      key={photo.id || pIdx}
                      onClick={() => {
                        setActivePhotoIndex(pIdx);
                        setIsZoomed(false);
                      }}
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 transition-all duration-300 shrink-0 cursor-pointer shadow-lg ${
                        pIdx === activePhotoIndex
                          ? "border-[#f6c86b] scale-110 ring-4 ring-[#f6c86b]/30 z-10 shadow-2xl"
                          : "border-white/10 opacity-40 hover:opacity-100 hover:border-white/40"
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.title || "Thumbnail"}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
              
              <p className="text-[11px] font-sans text-[#fff6da]/50 mt-2 font-light hidden sm:block">
                Shortcuts: Arrow keys (← / →) to navigate, <strong>F</strong> for Fullscreen, and <strong>Esc</strong> to close.
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIDEO MODAL OVERLAY */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div className="relative bg-[#262925] border border-[#9bb08a]/30 rounded-3xl p-6 md:p-8 max-w-3xl w-full shadow-2xl">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 text-[#fff6da] hover:text-[#f6c86b] p-2 rounded-full border border-white/10 hover:border-[#f6c86b] transition-all cursor-pointer bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <span className="font-montserrat text-[10px] font-bold text-[#f6c86b] uppercase tracking-widest">
                HD Video Player
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#fff6da] pr-6">
                {activeVideo.title}
              </h3>
              
              <div className="aspect-video bg-[#1a1c18] border border-[#9bb08a]/20 rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-4 relative overflow-hidden">
                <div className="w-16 h-16 bg-[#f6c86b]/20 border-2 border-[#f6c86b] rounded-full flex items-center justify-center text-[#f6c86b] animate-pulse">
                  <Play className="w-7 h-7 fill-[#f6c86b] ml-1" />
                </div>
                <p className="font-sans text-xs sm:text-sm text-[#fff6da]/80 max-w-md font-light">
                  Visit 2inDance official channels to watch full HD dance performances and tutorials.
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <a
                  href="https://youtube.com/@2indance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#f6c86b] text-[#3b3f3a] font-montserrat text-xs font-bold uppercase tracking-wider hover:bg-[#ffe6a6] transition-all cursor-pointer flex items-center space-x-2 shadow-lg"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Watch on YouTube</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
