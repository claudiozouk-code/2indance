import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, User, ArrowRight, Sparkles, X, MailCheck } from "lucide-react";
import { newsItems } from "../data";

export default function News() {
  const [articles, setArticles] = useState<any[]>(newsItems);
  const [activeArticle, setActiveArticle] = useState<any | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setArticles(data);
        }
      })
      .catch((err) => console.error("Error loading news articles:", err));
  }, []);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail("");
      }, 3000);
    }
  };

  return (
    <section id="news" className="py-20 md:py-28 bg-gradient-to-b from-[#111210] via-[#1F221E] to-[#171916] text-[#fff6da] relative overflow-hidden border-t border-[#9bb08a]/25">
      {/* 1. Orbiting Eclipse Rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.07] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute w-[600px] h-[600px] rounded-full border border-dashed border-[#fff6da]"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute w-[400px] h-[400px] rounded-full border border-double border-[#f6c86b]"
        />
      </div>

      {/* 2. Floating Community Sparks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.25]">
        <motion.div 
          className="absolute w-2 h-2 rounded-full bg-[#f6c86b]/40 blur-[1px]" 
          animate={{ y: [800, -100], x: [100, 150, 80, 130] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute w-1.5 h-1.5 rounded-full bg-[#9bb08a]/50 blur-[1px]" 
          animate={{ y: [750, -50], x: [1200, 1150, 1220, 1180] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        <motion.div 
          className="absolute w-3 h-3 rounded-full bg-[#ffe6a6]/30 blur-[2px]" 
          animate={{ y: [850, -80], x: [600, 680, 580, 640] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Background decorations */}
      <div className="absolute top-1/3 left-[-5%] w-[35vw] h-[35vw] bg-[#9bb08a]/12 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-[-5%] w-[40vw] h-[40vw] bg-[#f6c86b]/8 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-[#9bb08a]/20 px-3.5 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#f6c86b]" />
            <span className="font-montserrat text-[10px] font-bold tracking-widest text-[#ffe6a6] uppercase">
              Latest News
            </span>
          </div>
          <h2 className="font-display text-3.5xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#fff6da] uppercase">
            Stories & Announcements
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#fff6da]/80 font-light">
            Stay up to date with community news, technical tips from Xina and Laura, upcoming class launches, and special announcements.
          </p>
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {articles.map((news, idx) => (
            <article
              key={news.id}
              className="bg-[#2a2d29]/60 border border-[#9bb08a]/15 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between hover:border-[#f6c86b]/30 hover:bg-[#2a2d29]/80 transition-all duration-300 group"
            >
              {/* Image Header */}
              <div className="h-48 relative overflow-hidden bg-[#2a2d29]">
                <img
                  src={news.image}
                  alt={news.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-[#f6c86b] text-[#3b3f3a] font-montserrat text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded">
                  {news.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
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

                <div className="pt-2">
                  <button
                    onClick={() => setActiveArticle(news)}
                    className="inline-flex items-center space-x-1.5 text-xs font-montserrat font-bold text-[#ffe6a6] hover:text-[#f6c86b] border-b border-dashed border-[#ffe6a6]/40 hover:border-[#f6c86b] pb-0.5 transition-colors cursor-pointer"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Subscription Panel */}
        <div className="bg-[#2a2d29] border border-[#9bb08a]/25 rounded-3xl p-8 md:p-12 shadow-xl text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-[-30px] left-[-30px] w-48 h-48 bg-[#9bb08a]/5 rounded-full blur-[40px] pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h3 className="font-display text-2.5xl sm:text-3xl font-bold text-[#fff6da] uppercase">
              Join the 2inDance Circle
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#fff6da]/80 font-light leading-relaxed">
              Subscribe to our monthly newsletter to receive exclusive updates on pop-up workshops, flash mobs, special discount offers, and dance inspiration directly to your inbox.
            </p>

            <AnimatePresence mode="wait">
              {!isSubscribed ? (
                <motion.form
                  key="form-sub"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
                >
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-grow bg-[#3b3f3a] border border-[#9bb08a]/30 focus:border-[#f6c86b] focus:ring-1 focus:ring-[#f6c86b] text-sm text-[#fff6da] placeholder-[#fff6da]/40 rounded-xl px-4.5 py-3.5 focus:outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-[#f6c86b] hover:bg-[#ffe6a6] text-[#3b3f3a] font-montserrat text-xs font-bold tracking-widest uppercase px-6 py-3.5 rounded-xl transition-all duration-300 shadow-md cursor-pointer whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success-sub"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#9bb08a]/10 border border-[#9bb08a]/30 p-4 rounded-xl flex items-center justify-center space-x-3 text-[#ffe6a6] max-w-md mx-auto"
                >
                  <MailCheck className="w-5 h-5 text-[#9bb08a]" />
                  <span className="font-montserrat text-xs font-semibold uppercase tracking-wider">Welcome! Check your inbox soon.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Detailed Article Modal */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3b3f3a]/90 backdrop-blur-sm">
            <div className="relative bg-[#3b3f3a] border border-[#9bb08a]/30 rounded-3xl p-6 md:p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-6">
              
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 text-[#fff6da] hover:text-[#f6c86b] p-1.5 rounded-full border border-white/10 hover:border-[#f6c86b]/40 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <span className="bg-[#f6c86b] text-[#3b3f3a] font-montserrat text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded inline-block">
                  {activeArticle.category}
                </span>

                <h3 className="font-display text-2.5xl sm:text-3xl font-bold text-[#fff6da] leading-tight pr-6">
                  {activeArticle.title}
                </h3>

                <div className="flex items-center space-x-4 text-xs text-[#ffe6a6] font-montserrat font-medium border-b border-[#9bb08a]/10 pb-4">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-[#9bb08a]" />
                    <span>{activeArticle.date}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <User className="w-4 h-4 text-[#9bb08a]" />
                    <span>Written by {activeArticle.author}</span>
                  </span>
                </div>
              </div>

              {/* Full Content */}
              <div className="font-sans text-sm text-[#fff6da]/90 leading-relaxed font-light whitespace-pre-wrap space-y-4">
                {activeArticle.content}
              </div>

              {/* Footer CTA inside modal */}
              <div className="border-t border-[#9bb08a]/10 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="font-sans text-xs text-[#fff6da]/60">
                  Ready to practice this in class? Wednesday & Saturday sessions are perfect!
                </p>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#f6c86b] text-[#3b3f3a] font-montserrat text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-[#ffe6a6] transition-colors"
                >
                  Back to News
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
