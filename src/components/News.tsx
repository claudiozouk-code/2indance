import { useState, useEffect, FormEvent, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, 
  User, 
  ArrowRight, 
  Sparkles, 
  X, 
  MailCheck, 
  Clock, 
  BookOpen, 
  Newspaper,
  Tag,
  CheckCircle2
} from "lucide-react";
import { newsItems } from "../data";

export default function News() {
  const [articles, setArticles] = useState<any[]>(newsItems);
  const [activeArticle, setActiveArticle] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setArticles(data);
        }
      })
      .catch((err) => console.error("Error loading news articles:", err));
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ["All", ...Array.from(set)];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (selectedCategory === "All") return articles;
    return articles.filter((item) => item.category === selectedCategory);
  }, [articles, selectedCategory]);

  const featuredArticle = useMemo(() => {
    return articles.find((item) => item.featured) || articles[0];
  }, [articles]);

  const regularArticles = useMemo(() => {
    if (selectedCategory !== "All") return filteredArticles;
    return filteredArticles.filter((item) => item.id !== featuredArticle?.id);
  }, [filteredArticles, featuredArticle, selectedCategory]);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail("");
      }, 4000);
    }
  };

  return (
    <section 
      id="news" 
      className="py-24 md:py-32 bg-gradient-to-b from-[#181a17] via-[#222521] to-[#1a1c18] text-[#fff6da] relative overflow-hidden border-t border-[#9bb08a]/20"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.05] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
          className="absolute w-[800px] h-[800px] rounded-full border border-dashed border-[#fff6da]"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute w-[500px] h-[500px] rounded-full border border-double border-[#f6c86b]"
        />
      </div>

      <div className="absolute top-1/4 left-[-10%] w-[40vw] h-[40vw] bg-[#9bb08a]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-10%] w-[45vw] h-[45vw] bg-[#f6c86b]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-8 border-b border-[#9bb08a]/15 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-[#f6c86b]/10 border border-[#f6c86b]/30 px-3.5 py-1.5 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#f6c86b]" />
              <span className="font-montserrat text-[10px] font-bold tracking-widest text-[#ffe6a6] uppercase">
                2inDance Editorial & Updates
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#fff6da] uppercase leading-none">
              Latest <span className="text-[#f6c86b]">News</span> & Articles
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#fff6da]/75 font-light mt-3">
              Explore dance technique guides, festival announcements, community highlights, and expert insights from Xina & Laura.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 items-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-montserrat font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#f6c86b] text-[#222521] shadow-lg shadow-[#f6c86b]/20 scale-105"
                    : "bg-[#2a2d29] text-[#fff6da]/70 hover:text-[#fff6da] hover:bg-[#343833] border border-[#9bb08a]/15"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Editorial Article Banner (only when 'All' category is active) */}
        {selectedCategory === "All" && featuredArticle && (
          <div className="mb-14">
            <div className="bg-[#262925] border border-[#f6c86b]/35 shadow-xl neon-card-hover hover:bg-[#2c302a] rounded-3xl overflow-hidden group grid grid-cols-1 lg:grid-cols-12 cursor-pointer" onClick={() => setActiveArticle(featuredArticle)}>
              <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[420px] overflow-hidden bg-[#1d1f1b]">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#262925] via-transparent to-transparent lg:hidden" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="bg-[#f6c86b] text-[#222521] font-montserrat text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-md shadow-md">
                    Featured Story
                  </span>
                  <span className="bg-[#222521]/80 backdrop-blur-md text-[#ffe6a6] border border-[#ffe6a6]/30 font-montserrat text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-md">
                    {featuredArticle.category}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-7 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-xs text-[#ffe6a6] font-montserrat">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-[#9bb08a]" />
                      <span>{featuredArticle.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-[#9bb08a]" />
                      <span>{featuredArticle.author}</span>
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#fff6da] group-hover:text-[#f6c86b] transition-colors leading-snug">
                    {featuredArticle.title}
                  </h3>

                  <p className="font-sans text-[#fff6da]/80 text-sm font-light leading-relaxed line-clamp-4">
                    {featuredArticle.excerpt}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#9bb08a]/15">
                  <span className="flex items-center text-xs text-[#9bb08a] font-montserrat font-medium space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>4 min read</span>
                  </span>

                  <button
                    onClick={() => setActiveArticle(featuredArticle)}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#f6c86b] hover:bg-[#ffe6a6] text-[#222521] font-montserrat text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer"
                  >
                    <span>Read Full Story</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-[#262925]/50 border border-[#9bb08a]/15 rounded-3xl">
            <Newspaper className="w-12 h-12 text-[#9bb08a]/50 mx-auto mb-3" />
            <p className="font-sans text-sm text-[#fff6da]/70">No articles found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {regularArticles.map((news) => (
              <article
                key={news.id}
                className="bg-[#262925] border border-[#f6c86b]/30 shadow-xl neon-card-hover hover:bg-[#2c302a] rounded-3xl overflow-hidden flex flex-col justify-between group cursor-pointer"
                onClick={() => setActiveArticle(news)}
              >
                {/* Thumbnail Header */}
                <div className="h-52 relative overflow-hidden bg-[#1d1f1b]">
                  <img
                    src={news.image}
                    alt={news.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#262925] via-transparent to-transparent opacity-80" />
                  <span className="absolute top-4 left-4 bg-[#f6c86b] text-[#222521] font-montserrat text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded shadow-sm">
                    {news.category}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-[11px] text-[#ffe6a6] font-montserrat font-medium">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-[#9bb08a]" />
                        <span>{news.date}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <User className="w-3.5 h-3.5 text-[#9bb08a]" />
                        <span>{news.author}</span>
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-[#fff6da] group-hover:text-[#f6c86b] transition-colors leading-snug line-clamp-2">
                      {news.title}
                    </h3>

                    <p className="font-sans text-[#fff6da]/70 text-xs sm:text-sm font-light leading-relaxed line-clamp-3">
                      {news.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#9bb08a]/10 flex items-center justify-between">
                    <button
                      onClick={() => setActiveArticle(news)}
                      className="inline-flex items-center space-x-1.5 text-xs font-montserrat font-bold text-[#ffe6a6] hover:text-[#f6c86b] transition-colors cursor-pointer group/btn"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <BookOpen className="w-4 h-4 text-[#9bb08a]/40" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Newsletter Subscription Banner */}
        <div className="bg-gradient-to-r from-[#262925] via-[#2d312c] to-[#262925] border border-[#f6c86b]/25 rounded-3xl p-8 md:p-14 shadow-2xl text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-[-40px] left-[-40px] w-56 h-56 bg-[#f6c86b]/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute bottom-[-40px] right-[-40px] w-56 h-56 bg-[#9bb08a]/10 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-[#9bb08a]/20 px-3 py-1 rounded-full">
              <Tag className="w-3.5 h-3.5 text-[#f6c86b]" />
              <span className="font-montserrat text-[10px] font-bold tracking-widest text-[#ffe6a6] uppercase">
                Stay Connected
              </span>
            </div>

            <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-[#fff6da] uppercase">
              Join the <span className="text-[#f6c86b]">2inDance</span> Circle
            </h3>

            <p className="font-sans text-xs sm:text-sm text-[#fff6da]/80 font-light leading-relaxed">
              Subscribe to our VIP newsletter to receive early bird discounts on workshops, exclusive technique tips from Xina & Laura, and Hainan Zouk Marathon updates directly to your inbox.
            </p>

            <AnimatePresence mode="wait">
              {!isSubscribed ? (
                <motion.form
                  key="form-sub"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2"
                >
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-grow bg-[#1a1c18] border border-[#9bb08a]/35 focus:border-[#f6c86b] focus:ring-2 focus:ring-[#f6c86b]/30 text-sm text-[#fff6da] placeholder-[#fff6da]/40 rounded-xl px-4.5 py-3.5 focus:outline-none transition-all shadow-inner"
                  />
                  <button
                    type="submit"
                    className="bg-[#f6c86b] hover:bg-[#ffe6a6] text-[#222521] font-montserrat text-xs font-bold tracking-widest uppercase px-7 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-[#f6c86b]/15 cursor-pointer whitespace-nowrap active:scale-95"
                  >
                    Subscribe Now
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success-sub"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#9bb08a]/15 border border-[#9bb08a]/40 p-4.5 rounded-xl flex items-center justify-center space-x-3 text-[#ffe6a6] max-w-md mx-auto shadow-md"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#f6c86b]" />
                  <span className="font-montserrat text-xs font-bold uppercase tracking-wider">You're subscribed! Welcome to the circle.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Article Full View Modal */}
        {activeArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#262925] border border-[#9bb08a]/30 rounded-3xl p-6 sm:p-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6"
            >
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-5 right-5 text-[#fff6da] hover:text-[#f6c86b] p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4 pr-6">
                <span className="bg-[#f6c86b] text-[#222521] font-montserrat text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded inline-block shadow-sm">
                  {activeArticle.category}
                </span>

                <h3 className="font-display text-2.5xl sm:text-3.5xl font-bold text-[#fff6da] leading-tight">
                  {activeArticle.title}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#ffe6a6] font-montserrat font-medium border-b border-[#9bb08a]/15 pb-4">
                  <span className="flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4 text-[#9bb08a]" />
                    <span>{activeArticle.date}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1.5">
                    <User className="w-4 h-4 text-[#9bb08a]" />
                    <span>Author: {activeArticle.author}</span>
                  </span>
                </div>
              </div>

              {activeArticle.image && (
                <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-[#9bb08a]/20">
                  <img 
                    src={activeArticle.image} 
                    alt={activeArticle.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Full Content */}
              <div className="font-sans text-sm sm:text-base text-[#fff6da]/90 leading-relaxed font-light whitespace-pre-wrap space-y-4 pt-2">
                {activeArticle.content}
              </div>

              {/* Modal Footer */}
              <div className="border-t border-[#9bb08a]/15 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="font-sans text-xs text-[#fff6da]/60">
                  Interested in joining our classes? Check out our Weekly Classes & Events schedule.
                </p>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#f6c86b] text-[#222521] font-montserrat text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#ffe6a6] transition-colors shadow-md"
                >
                  Close Article
                </button>
              </div>

            </motion.div>
          </div>
        )}

      </div>
    </section>
  );
}
