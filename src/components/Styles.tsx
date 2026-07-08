import { motion } from "motion/react";
import { Sparkles, Check } from "lucide-react";
import { TranslationDict } from "../types";
import { danceStylesData } from "../translations";

interface StylesProps {
  t: TranslationDict;
}

export default function Styles({ t }: StylesProps) {
  return (
    <section id="styles" className="py-20 md:py-28 bg-[#050507] text-stone-100 relative overflow-hidden border-t border-white/5">
      {/* Background soft glowing orb */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

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
              {t.stylesTitle}
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-slate-100 uppercase">
            {t.stylesTitle}
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-400 font-light">
            {t.stylesSubtitle}
          </p>
        </motion.div>

        {/* Styles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {danceStylesData.map((style, idx) => {
            const title = t[style.titleKey as keyof TranslationDict] as string;
            const desc = t[style.descKey as keyof TranslationDict] as string;

            // Varied assembly effects: zoom/slide based on odd/even positions
            const xOffset = idx % 2 === 0 ? -45 : 45;
            const yOffset = idx > 1 ? 40 : -40;

            return (
              <motion.div
                key={style.id}
                initial={{ opacity: 0, x: xOffset, y: yOffset, scale: 0.92 }}
                whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden card-hover-shadow hover:border-fuchsia-500/30 transition-all duration-300 flex flex-col group relative backdrop-blur-md"
              >
                {/* Style Image container */}
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={style.image}
                    alt={title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Dark vignette over image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent" />
                  
                  {/* Tiny badge inside image */}
                  <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-montserrat font-bold tracking-widest uppercase text-fuchsia-400 px-2.5 py-1 rounded-md">
                    {style.id === "private" ? "Exclusive" : "Dance Style"}
                  </span>
                </div>

                {/* Content area */}
                <div className="p-6 flex flex-col flex-grow space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-display text-xl font-bold text-slate-100 group-hover:text-fuchsia-400 transition-colors">
                      {title}
                    </h3>
                    <div className="w-8 h-[2px] bg-fuchsia-500 rounded group-hover:w-16 transition-all duration-300" />
                  </div>
                  
                  <p className="font-sans text-slate-300 text-xs sm:text-sm leading-relaxed font-light flex-grow">
                    {desc}
                  </p>

                  {/* Highlights list */}
                  <div className="pt-4 border-t border-white/5 space-y-2">
                    {style.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center space-x-2 text-stone-300">
                        <div className="w-4 h-4 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 text-fuchsia-400" />
                        </div>
                        <span className="font-montserrat text-[10px] font-semibold tracking-wider uppercase text-slate-400">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ambient glowing hover strip at the bottom */}
                <div className="h-1 bg-transparent group-hover:bg-gradient-to-r group-hover:from-fuchsia-500 group-hover:to-blue-400 transition-all duration-300" />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
