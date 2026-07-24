import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Sparkles, 
  Image as ImageIcon, 
  Music, 
  Video, 
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
  Download
} from "lucide-react";
import { mediaItems } from "../data";

export default function Media() {
  const [media, setMedia] = useState<any[]>(mediaItems);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [mediaTypeFilter, setMediaTypeFilter] = useState<"all" | "photo" | "video">("all");
  
  // Fullscreen lightbox states
  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/media")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMedia(data);
        }
      })
      .catch((err) => console.error("Error loading media:", err));
  }, []);

  const categories = ["All", "Performance", "Class Highlight", "Workshop", "Social Dance"];

  // Filter media based on selected category and media type
  const filteredMedia = media.filter((item) => {
    const matchesCategory = selectedFilter === "All" || item.category === selectedFilter;
    const matchesType = mediaTypeFilter === "all" || item.type === mediaTypeFilter;
    return matchesCategory && matchesType;
  });

  const handleNext = useCallback(() => {
    if (activeMediaIndex === null || filteredMedia.length === 0) return;
    setIsZoomed(false);
    setActiveMediaIndex((prev) => (prev !== null ? (prev + 1) % filteredMedia.length : 0));
  }, [activeMediaIndex, filteredMedia.length]);

  const handlePrev = useCallback(() => {
    if (activeMediaIndex === null || filteredMedia.length === 0) return;
    setIsZoomed(false);
    setActiveMediaIndex((prev) => (prev !== null ? (prev - 1 + filteredMedia.length) % filteredMedia.length : 0));
  }, [activeMediaIndex, filteredMedia.length]);

  // Toggle browser fullscreen mode
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

  // Keyboard navigation & Esc handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeMediaIndex !== null) {
        if (e.key === "Escape") {
          setActiveMediaIndex(null);
          setIsZoomed(false);
        } else if (e.key === "ArrowLeft") {
          handlePrev();
        } else if (e.key === "ArrowRight") {
          handleNext();
        } else if (e.key === "f" || e.key === "F") {
          toggleBrowserFullscreen();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMediaIndex, handlePrev, handleNext]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (activeMediaIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeMediaIndex]);

  const activeMedia = activeMediaIndex !== null && filteredMedia[activeMediaIndex] ? filteredMedia[activeMediaIndex] : null;

  const handleShare = () => {
    if (!activeMedia) return;
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section id="media" className="py-20 md:py-28 bg-gradient-to-b from-[#F2F4F1] via-[#EAEFE9] to-[#F7FAF6] text-[#3b3f3a] relative overflow-hidden border-t border-[#9bb08a]/25">
      {/* Luminous Stage Spotlight Beams */}
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
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-[#3b3f3a]/5 border border-[#3b3f3a]/10 px-3.5 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#f6c86b]" />
            <span className="font-montserrat text-[10px] font-bold tracking-widest text-[#3b3f3a]/80 uppercase">
              Galeria de Mídia • Media & Photos
            </span>
          </div>
          <h2 className="font-display text-3.5xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#3b3f3a] uppercase">
            Dance In Action
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#3b3f3a]/75 font-light">
            Capture a energia, graça e conexão da 2inDance. Explore nossas fotos de turmas, apresentações, workshops e momentos sociais.
          </p>
        </motion.div>

        {/* Media Controls Bar: Type Switcher + Category Filters */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white/50 backdrop-blur-md p-4 rounded-3xl border border-[#9bb08a]/20 shadow-sm"
        >
          {/* Media Type Segmented Toggle */}
          <div className="flex items-center bg-[#3b3f3a]/10 p-1 rounded-2xl w-full sm:w-auto justify-center">
            <button
              onClick={() => setMediaTypeFilter("all")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-montserrat font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                mediaTypeFilter === "all"
                  ? "bg-[#3b3f3a] text-[#fff6da] shadow-sm"
                  : "text-[#3b3f3a]/70 hover:text-[#3b3f3a]"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Tudo</span>
            </button>
            <button
              onClick={() => setMediaTypeFilter("photo")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-montserrat font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                mediaTypeFilter === "photo"
                  ? "bg-[#3b3f3a] text-[#fff6da] shadow-sm"
                  : "text-[#3b3f3a]/70 hover:text-[#3b3f3a]"
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Fotos</span>
            </button>
            <button
              onClick={() => setMediaTypeFilter("video")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-montserrat font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                mediaTypeFilter === "video"
                  ? "bg-[#3b3f3a] text-[#fff6da] shadow-sm"
                  : "text-[#3b3f3a]/70 hover:text-[#3b3f3a]"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Vídeos</span>
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3.5 py-2 rounded-xl font-montserrat text-xs font-bold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                  selectedFilter === filter
                    ? "bg-[#3b3f3a] text-[#fff6da] border-[#3b3f3a] shadow-sm"
                    : "bg-white/60 hover:bg-[#ffe6a6]/50 border-[#9bb08a]/25 text-[#3b3f3a]/80"
                }`}
              >
                {filter === "All" ? "Todas Categorias" : filter}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Empty state fallback */}
        {filteredMedia.length === 0 && (
          <div className="text-center py-16 bg-white/40 border border-[#9bb08a]/20 rounded-3xl p-8 max-w-md mx-auto my-8">
            <Camera className="w-12 h-12 mx-auto text-[#3b3f3a]/30 mb-3" />
            <h4 className="font-display font-bold text-lg text-[#3b3f3a]">Nenhuma mídia encontrada</h4>
            <p className="font-sans text-xs text-[#3b3f3a]/60 mt-1">Tente alterar os filtros de mídia ou categoria acima.</p>
          </div>
        )}

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredMedia.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              onClick={() => {
                setActiveMediaIndex(idx);
                setIsZoomed(false);
              }}
              initial={{ opacity: 0, y: 35, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.7, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group bg-[#ffe6a6]/25 border border-[#9bb08a]/20 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer relative"
            >
              {/* Thumbnail Container */}
              <div className="aspect-video relative overflow-hidden bg-black/5">
                <img
                  src={item.thumbnail || item.url}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                
                {/* Media Type Icon & Hover Overlay */}
                <div className="absolute inset-0 bg-[#3b3f3a]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-14 h-14 bg-[#f6c86b] text-[#3b3f3a] rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    {item.type === "video" ? (
                      <Play className="w-6 h-6 fill-[#3b3f3a] ml-1" />
                    ) : (
                      <Maximize2 className="w-6 h-6 text-[#3b3f3a]" />
                    )}
                  </div>
                </div>

                {/* Badge Category */}
                <span className="absolute top-4 left-4 bg-[#3b3f3a] text-[#fff6da] font-montserrat text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded shadow-sm">
                  {item.category}
                </span>

                {/* Media Type Badge (Photo or Video) */}
                <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-[#fff6da] font-montserrat text-[9px] font-bold tracking-wider uppercase px-2 py-1 rounded flex items-center space-x-1">
                  {item.type === "video" ? (
                    <>
                      <Video className="w-3 h-3 text-[#f6c86b]" />
                      <span>Vídeo</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-3 h-3 text-[#9bb08a]" />
                      <span>Foto</span>
                    </>
                  )}
                </span>
              </div>

              {/* Title Info */}
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-[#3b3f3a] group-hover:text-[#9bb08a] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="font-sans text-[11px] text-[#3b3f3a]/60 uppercase tracking-widest font-semibold mt-1">
                    {item.type === "video" ? "Assistir em Full Screen" : "Abrir Galeria Full Screen"}
                  </p>
                </div>
                {item.type === "photo" ? (
                  <div className="p-2 bg-[#3b3f3a]/5 rounded-xl text-[#3b3f3a]/60 group-hover:bg-[#f6c86b]/20 group-hover:text-[#3b3f3a] transition-all">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="p-2 bg-[#3b3f3a]/5 rounded-xl text-[#3b3f3a]/60 group-hover:bg-[#f6c86b]/20 group-hover:text-[#3b3f3a] transition-all">
                    <Play className="w-4 h-4 fill-[#3b3f3a]" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Music Playlist Promo Card */}
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
                Ouça Nossos Ritmos Oficiais
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#fff6da]/80 font-light leading-relaxed max-w-2xl">
                Músicas selecionadas a dedo de Zouk Brasileiro, Lambada e Samba de Gafieira para você praticar em casa e sentir o ritmo das aulas.
              </p>
            </div>
            
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <a
                href="https://spotify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 bg-[#f6c86b] hover:bg-[#ffe6a6] text-[#3b3f3a] font-montserrat text-xs font-bold tracking-widest uppercase px-8 py-4.5 rounded-xl transition-all duration-300 shadow-md cursor-pointer hover:-translate-y-0.5"
              >
                <span>Ouvir no Spotify</span>
                <Play className="w-3.5 h-3.5 fill-[#3b3f3a]" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* ULTRA-MODERN FULLSCREEN LIGHTBOX GALLERY MODAL */}
        <AnimatePresence>
          {activeMedia && activeMediaIndex !== null && (
            <motion.div 
              ref={modalRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-[#0d0f0e] select-none overflow-hidden flex flex-col justify-between"
            >
              {/* Dynamic Ambient Background Blur Halo */}
              <div className="absolute inset-0 z-0 opacity-40 pointer-events-none scale-110 blur-3xl">
                <img
                  src={activeMedia.thumbnail || activeMedia.url}
                  alt="background ambient halo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60" />
              </div>

              {/* 1. TOP GLASSMOGRAPHIC FLOATING HEADER */}
              <header className="relative z-30 w-full px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/50 to-transparent backdrop-blur-md border-b border-white/10">
                {/* Left: Media Metadata */}
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <span className="bg-[#f6c86b] text-[#3b3f3a] font-montserrat text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                    {activeMedia.category}
                  </span>
                  <div>
                    <h3 className="font-display text-base sm:text-xl font-bold text-[#fff6da] leading-tight truncate max-w-[200px] sm:max-w-md md:max-w-xl">
                      {activeMedia.title}
                    </h3>
                    <p className="font-sans text-[11px] text-white/60 font-light flex items-center space-x-1.5 mt-0.5">
                      {activeMedia.type === "video" ? (
                        <>
                          <Video className="w-3 h-3 text-[#f6c86b]" />
                          <span>Vídeo Exclusivo 2inDance</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-3 h-3 text-[#9bb08a]" />
                          <span>Fotografia HD</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Right: Controls & Actions */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                  {/* Photo Counter */}
                  <span className="hidden sm:inline-block font-mono text-xs text-[#fff6da]/70 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                    <strong className="text-[#f6c86b]">{activeMediaIndex + 1}</strong> / {filteredMedia.length}
                  </span>

                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    className="p-2.5 rounded-full bg-white/10 hover:bg-[#f6c86b] hover:text-[#3b3f3a] text-white transition-all cursor-pointer border border-white/10"
                    title="Copiar Link da Mídia"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  </button>

                  {/* Download button if image */}
                  {activeMedia.type === "photo" && (
                    <a
                      href={activeMedia.url || activeMedia.thumbnail}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="p-2.5 rounded-full bg-white/10 hover:bg-[#f6c86b] hover:text-[#3b3f3a] text-white transition-all cursor-pointer border border-white/10"
                      title="Baixar Foto Original"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}

                  {/* Zoom Toggle (Photos) */}
                  {activeMedia.type === "photo" && (
                    <button
                      onClick={() => setIsZoomed(!isZoomed)}
                      className="p-2.5 rounded-full bg-white/10 hover:bg-[#f6c86b] hover:text-[#3b3f3a] text-white transition-all cursor-pointer border border-white/10"
                      title={isZoomed ? "Diminuir Zoom" : "Ampliar Zoom"}
                    >
                      {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                    </button>
                  )}

                  {/* Toggle Fullscreen Browser */}
                  <button
                    onClick={toggleBrowserFullscreen}
                    className="p-2.5 rounded-full bg-white/10 hover:bg-[#f6c86b] hover:text-[#3b3f3a] text-white transition-all cursor-pointer border border-white/10 hidden sm:flex"
                    title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia Total (F)"}
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>

                  {/* Close Modal Button */}
                  <button
                    onClick={() => {
                      setActiveMediaIndex(null);
                      setIsZoomed(false);
                    }}
                    className="p-2.5 rounded-full bg-[#f6c86b] text-[#3b3f3a] hover:bg-white hover:text-black transition-all cursor-pointer font-bold shadow-lg ml-1"
                    title="Fechar Galeria (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </header>

              {/* 2. MAIN FULLSCREEN VIEWPORT STAGE */}
              <div className="relative flex-1 z-10 w-full h-full flex items-center justify-center p-2 sm:p-6 overflow-hidden">
                {/* PREVIOUS NAV BUTTON */}
                {filteredMedia.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute left-3 sm:left-8 z-30 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[#f6c86b] text-white hover:text-[#3b3f3a] border border-white/20 transition-all duration-300 cursor-pointer shadow-2xl hover:scale-110 active:scale-95 group"
                    title="Mídia Anterior (Seta Esquerda)"
                  >
                    <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                )}

                {/* MEDIA CONTENT DISPLAY */}
                <div className="w-full h-full flex items-center justify-center max-w-7xl max-h-[80vh] relative">
                  {activeMedia.type === "photo" ? (
                    <motion.div
                      key={activeMedia.id || activeMediaIndex}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: isZoomed ? 1.4 : 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-full flex items-center justify-center cursor-zoom-in"
                      onClick={() => setIsZoomed(!isZoomed)}
                    >
                      <img
                        src={activeMedia.url || activeMedia.thumbnail}
                        alt={activeMedia.title}
                        referrerPolicy="no-referrer"
                        className="max-h-[78vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/10 transition-transform duration-300"
                      />
                    </motion.div>
                  ) : (
                    /* Video Player Full Screen Stage */
                    <motion.div
                      key={activeMedia.id || activeMediaIndex}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="w-full max-w-4xl bg-[#181a18] rounded-3xl overflow-hidden border border-white/15 shadow-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-6"
                    >
                      <div className="w-20 h-20 bg-[#f6c86b]/20 border-2 border-[#f6c86b] rounded-full flex items-center justify-center text-[#f6c86b] shadow-xl animate-pulse">
                        <Play className="w-10 h-10 fill-[#f6c86b] ml-1.5" />
                      </div>
                      <div className="space-y-2 max-w-lg">
                        <span className="font-montserrat text-xs font-bold text-[#f6c86b] uppercase tracking-widest">
                          Exibição de Vídeo HD
                        </span>
                        <h4 className="font-display text-2xl font-bold text-white">
                          {activeMedia.title}
                        </h4>
                        <p className="font-sans text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                          Siga o canal oficial da 2inDance no YouTube e Instagram para ver a gravação completa em alta definição.
                        </p>
                      </div>

                      <div className="flex items-center space-x-4 pt-2">
                        <a
                          href="https://youtube.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 rounded-xl bg-[#f6c86b] text-[#3b3f3a] hover:bg-white font-montserrat text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center space-x-2"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>Assistir no YouTube</span>
                        </a>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* NEXT NAV BUTTON */}
                {filteredMedia.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-3 sm:right-8 z-30 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[#f6c86b] text-white hover:text-[#3b3f3a] border border-white/20 transition-all duration-300 cursor-pointer shadow-2xl hover:scale-110 active:scale-95 group"
                    title="Próxima Mídia (Seta Direita)"
                  >
                    <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>

              {/* 3. BOTTOM CAROUSEL FILMSTRIP THUMBNAILS */}
              <footer className="relative z-30 w-full px-4 py-4 flex flex-col items-center justify-center bg-gradient-to-t from-black/90 via-black/50 to-transparent backdrop-blur-md border-t border-white/10">
                {filteredMedia.length > 1 && (
                  <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto max-w-full py-1 px-4 scrollbar-none">
                    {filteredMedia.map((item, idx) => (
                      <button
                        key={item.id || idx}
                        onClick={() => {
                          setActiveMediaIndex(idx);
                          setIsZoomed(false);
                        }}
                        className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 transition-all duration-300 shrink-0 cursor-pointer ${
                          idx === activeMediaIndex
                            ? "border-[#f6c86b] scale-110 shadow-lg ring-4 ring-[#f6c86b]/30 z-10"
                            : "border-white/20 opacity-40 hover:opacity-100 hover:border-white/60"
                        }`}
                      >
                        <img
                          src={item.thumbnail || item.url}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        {item.type === "video" && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Play className="w-4 h-4 fill-white text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
                
                <p className="text-[11px] font-sans text-white/50 mt-2 font-light hidden sm:block">
                  Dica: Use as setas do teclado (←/→) para navegar, <strong>F</strong> para Tela Cheia e <strong>Esc</strong> para fechar.
                </p>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}


