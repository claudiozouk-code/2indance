import { motion } from "motion/react";
import { Heart, Activity, Brain, Users2, Sparkles } from "lucide-react";
import { TranslationDict } from "../types";

interface BenefitsProps {
  t: TranslationDict;
}

export default function Benefits({ t }: BenefitsProps) {
  const benefits = [
    {
      id: "ben-1",
      title: t.benefit1Title,
      desc: t.benefit1Desc,
      icon: <Heart className="w-6 h-6 text-fuchsia-400" />,
      color: "from-fuchsia-500/10 to-fuchsia-500/5",
    },
    {
      id: "ben-2",
      title: t.benefit2Title,
      desc: t.benefit2Desc,
      icon: <Activity className="w-6 h-6 text-purple-400" />,
      color: "from-purple-500/10 to-purple-500/5",
    },
    {
      id: "ben-3",
      title: t.benefit3Title,
      desc: t.benefit3Desc,
      icon: <Brain className="w-6 h-6 text-blue-400" />,
      color: "from-blue-500/10 to-blue-500/5",
    },
    {
      id: "ben-4",
      title: t.benefit4Title,
      desc: t.benefit4Desc,
      icon: <Users2 className="w-6 h-6 text-indigo-400" />,
      color: "from-indigo-500/10 to-indigo-500/5",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#050507] text-stone-100 relative overflow-hidden border-t border-white/5">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: -45, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
            <span className="font-montserrat text-[10px] font-semibold tracking-widest text-slate-300 uppercase">
              {t.benefitsTitle}
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-slate-100 uppercase">
            {t.benefitsTitle}
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-400 font-light">
            {t.benefitsSubtitle}
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, idx) => {
            // Alternate slide-in directions: left, bottom, top, right for organic assembly effect
            const directions = [
              { x: -50, y: 0, rotate: -2 },
              { x: 0, y: 50, rotate: 0 },
              { x: 0, y: -50, rotate: 0 },
              { x: 50, y: 0, rotate: 2 }
            ];
            const dir = directions[idx % directions.length];

            return (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, x: dir.x, y: dir.y, rotate: dir.rotate, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ 
                  duration: 0.8, 
                  delay: idx * 0.1, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col space-y-4 hover:border-fuchsia-500/30 transition-all duration-300 card-hover-shadow group relative overflow-hidden backdrop-blur-md"
              >
                {/* Top background accent subtle gradient */}
                <div className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${benefit.color} opacity-80`} />

                {/* Icon Container */}
                <div className="p-3 bg-[#050507] border border-white/10 rounded-2xl w-12 h-12 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                  {benefit.icon}
                </div>

                {/* Title & Body */}
                <div className="space-y-2">
                  <h3 className="font-display text-lg font-bold text-slate-100 group-hover:text-fuchsia-400 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                    {benefit.desc}
                  </p>
                </div>

                {/* Micro-arrow at bottom right */}
                <div className="absolute bottom-4 right-4 text-slate-600 group-hover:text-fuchsia-400 transition-colors duration-300 font-sans text-xs font-bold font-mono">
                  →
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* High Fidelity Philosophical Statement Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.93 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 md:mt-24 p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden backdrop-blur-md"
        >
          {/* Subtle light effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
          
          <div className="relative z-10 space-y-4">
            <span className="font-montserrat text-[9px] font-bold tracking-widest text-fuchsia-400 uppercase">
              2inDance Concept
            </span>
            <p className="font-display italic text-lg sm:text-xl md:text-2xl text-slate-200 font-light leading-relaxed">
              {t.language.includes("English")
                ? "“Dançar a dois é a arte de escutar com os olhos e falar com as mãos, onde o silêncio ganha ritmo e a pressa desaparece.”"
                : "“Partner dancing is the art of listening with your eyes and speaking with your hands, where silence finds a rhythm and haste disappears.”"}
            </p>
            <div className="w-16 h-[2px] bg-gradient-to-r from-fuchsia-500 to-blue-400 mx-auto rounded-full mt-4" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
