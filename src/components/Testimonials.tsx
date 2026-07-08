import { motion } from "motion/react";
import { Star, Quote, Sparkles } from "lucide-react";
import { TranslationDict } from "../types";
import { testimonialsData } from "../translations";

interface TestimonialsProps {
  t: TranslationDict;
}

export default function Testimonials({ t }: TestimonialsProps) {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-[#050507] text-stone-100 relative overflow-hidden border-t border-white/5">
      {/* Background soft glowing orb */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
            <span className="font-montserrat text-[10px] font-semibold tracking-widest text-slate-300 uppercase">
              {t.testimonialsTitle}
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-slate-100 uppercase">
            {t.testimonialsTitle}
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-400 font-light">
            {t.testimonialsSubtitle}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((item, idx) => {
            const quoteText = t.language.includes("English") ? item.text.pt : item.text.en;

            // Assemble with slide-in & rotation offsets for a dynamic layout feel
            const directions = [
              { x: -40, y: 20, rotate: -1.5 },
              { x: 0, y: 40, rotate: 0 },
              { x: 40, y: 20, rotate: 1.5 }
            ];
            const dir = directions[idx % directions.length];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: dir.x, y: dir.y, rotate: dir.rotate, scale: 0.92 }}
                whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between card-hover-shadow relative group backdrop-blur-md hover:border-fuchsia-500/20 transition-all duration-300"
              >
                {/* Speech Bubble quote accent */}
                <Quote className="absolute top-6 right-6 w-8 h-8 text-white/5 group-hover:text-fuchsia-500/10 transition-colors duration-300 pointer-events-none" />

                {/* Stars */}
                <div className="flex items-center space-x-1 mb-5">
                  {[...Array(5)].map((_, sIdx) => (
                    <Star key={sIdx} className="w-3.5 h-3.5 fill-fuchsia-500 text-fuchsia-500" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="font-sans text-slate-300 text-xs sm:text-sm leading-relaxed font-light mb-6 flex-grow italic">
                  “{quoteText}”
                </p>

                {/* Author Info */}
                <div className="flex items-center space-x-4 pt-4 border-t border-white/5">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover border border-fuchsia-500/20 group-hover:border-fuchsia-500/50 transition-colors duration-300"
                  />
                  <div>
                    <h4 className="font-display text-sm font-bold text-slate-100 group-hover:text-fuchsia-400 transition-colors">
                      {item.name}
                    </h4>
                    <p className="font-montserrat text-[9px] text-slate-500 uppercase tracking-wider font-semibold">
                      {item.role}
                    </p>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
