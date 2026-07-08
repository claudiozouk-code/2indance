import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, MapPin, BadgePercent, Filter, Sparkles, AlertCircle } from "lucide-react";
import { TranslationDict, ScheduleItem } from "../types";
import { scheduleData } from "../translations";

interface ScheduleProps {
  t: TranslationDict;
  onSelectClass: (className: string) => void;
}

export default function Schedule({ t, onSelectClass }: ScheduleProps) {
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  const daysFilter = [
    { label: t.language.includes("English") ? "Todos os Dias" : "All Days", value: "all" },
    { label: t.dayMonday, value: "dayMonday" },
    { label: t.dayWednesday, value: "dayWednesday" },
    { label: t.daySaturday, value: "daySaturday" },
  ];

  const levelsFilter = [
    { label: t.language.includes("English") ? "Todos os Níveis" : "All Levels", value: "all" },
    { label: t.beginner, value: "beginner" },
    { label: t.intermediate, value: "intermediate" },
    { label: t.advanced, value: "advanced" },
  ];

  // Filtering Logic
  const filteredSchedule = scheduleData.filter((item) => {
    const matchesDay = selectedDay === "all" || item.dayKey === selectedDay;
    
    // level key mapping checks
    let matchesLevel = true;
    if (selectedLevel !== "all") {
      if (selectedLevel === "beginner") {
        matchesLevel = item.levelKey === "beginner" || item.levelKey === "allLevels";
      } else if (selectedLevel === "intermediate") {
        matchesLevel = item.levelKey === "intermediate" || item.levelKey === "allLevels";
      } else if (selectedLevel === "advanced") {
        matchesLevel = item.levelKey === "advanced" || item.levelKey === "allLevels";
      }
    }
    
    return matchesDay && matchesLevel;
  });

  const handleBook = (item: ScheduleItem) => {
    const className = `${t[item.styleKey]} (${t[item.levelKey]}) - ${t[item.dayKey]} ${item.time}`;
    onSelectClass(className);
    
    // smooth scroll to contact
    const contactSec = document.getElementById("contact");
    if (contactSec) {
      contactSec.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="schedule" className="py-20 md:py-28 bg-[#050507] text-stone-100 relative overflow-hidden border-t border-white/5">
      {/* Background visual accents */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

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
              {t.scheduleTitle}
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-slate-100 uppercase">
            {t.scheduleTitle}
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-400 font-light">
            {t.scheduleSubtitle}
          </p>
        </motion.div>

        {/* Filters Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/5 border border-white/10 p-6 rounded-3xl mb-12 shadow-xl backdrop-blur-md"
        >
          <div className="flex items-center space-x-2 mb-6 text-fuchsia-400 border-b border-white/5 pb-3">
            <Filter className="w-4 h-4" />
            <span className="font-montserrat text-xs font-bold tracking-wider uppercase">
              {t.language.includes("English") ? "Filtrar Agenda" : "Filter Schedule"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Days Filter */}
            <div className="space-y-2">
              <span className="font-montserrat text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">
                {t.language.includes("English") ? "Filtrar por Dia" : "Filter by Day"}
              </span>
              <div className="flex flex-wrap gap-2">
                {daysFilter.map((day) => (
                  <button
                    key={day.value}
                    onClick={() => setSelectedDay(day.value)}
                    className={`px-4 py-2 rounded-lg font-montserrat text-xs font-semibold tracking-wide transition-all duration-300 border cursor-pointer ${
                      selectedDay === day.value
                        ? "bg-fuchsia-600 border-fuchsia-600 text-white shadow-md shadow-fuchsia-600/10"
                        : "bg-white/5 hover:bg-white/10 border-white/5 text-slate-300 hover:text-white"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Levels Filter */}
            <div className="space-y-2">
              <span className="font-montserrat text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">
                {t.language.includes("English") ? "Filtrar por Nível" : "Filter by Level"}
              </span>
              <div className="flex flex-wrap gap-2">
                {levelsFilter.map((lvl) => (
                  <button
                    key={lvl.value}
                    onClick={() => setSelectedLevel(lvl.value)}
                    className={`px-4 py-2 rounded-lg font-montserrat text-xs font-semibold tracking-wide transition-all duration-300 border cursor-pointer ${
                      selectedLevel === lvl.value
                        ? "bg-fuchsia-600 border-fuchsia-600 text-white shadow-md shadow-fuchsia-600/10"
                        : "bg-white/5 hover:bg-white/10 border-white/5 text-slate-300 hover:text-white"
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Schedule List */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredSchedule.length > 0 ? (
              filteredSchedule.map((item, idx) => {
                const styleName = t[item.styleKey as keyof TranslationDict] as string;
                const levelName = t[item.levelKey as keyof TranslationDict] as string;
                const dayName = t[item.dayKey as keyof TranslationDict] as string;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30, x: idx % 2 === 0 ? -25 : 25 }}
                    whileInView={{ opacity: 1, y: 0, x: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.65, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-fuchsia-500/30 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center shadow-lg backdrop-blur-md"
                  >
                    {/* Time & Day badge */}
                    <div className="lg:col-span-3 flex lg:flex-col items-center lg:items-start justify-between lg:justify-center border-b lg:border-b-0 lg:border-r border-white/5 pb-4 lg:pb-0 lg:pr-6 space-y-1">
                      <span className="font-montserrat text-xs font-bold uppercase tracking-widest text-fuchsia-400 bg-fuchsia-500/10 px-2.5 py-1 rounded">
                        {dayName}
                      </span>
                      <div className="flex items-center space-x-2 text-slate-300 font-sans font-medium text-sm lg:pt-2">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.time}</span>
                      </div>
                    </div>

                    {/* Class Style & Level Description */}
                    <div className="lg:col-span-5 space-y-2">
                      <div className="flex items-center space-x-3 flex-wrap gap-y-1">
                        <h3 className="font-display text-lg font-bold text-slate-100">
                          {styleName}
                        </h3>
                        {/* Level badge */}
                        <span className={`text-[9px] font-montserrat font-bold tracking-widest uppercase px-2 py-0.5 rounded border ${
                          item.levelKey === "beginner" 
                            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                            : item.levelKey === "intermediate"
                            ? "bg-sky-500/5 border-sky-500/20 text-sky-400"
                            : item.levelKey === "advanced"
                            ? "bg-rose-500/5 border-rose-500/20 text-rose-400"
                            : "bg-purple-500/5 border-purple-500/20 text-purple-400"
                        }`}>
                          {levelName}
                        </span>
                      </div>
                      
                      {/* Location text */}
                      <div className="flex items-start space-x-2 text-xs text-slate-400 font-light">
                        <MapPin className="w-3.5 h-3.5 text-fuchsia-500/70 mt-0.5 flex-shrink-0" />
                        <span>{item.location}</span>
                      </div>
                    </div>

                    {/* Price and Action Book */}
                    <div className="lg:col-span-4 flex items-center justify-between lg:justify-end space-x-6 border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
                      <div className="flex items-center space-x-2">
                        <BadgePercent className="w-4 h-4 text-fuchsia-400" />
                        <div>
                          <p className="text-[10px] font-montserrat text-slate-500 uppercase tracking-widest leading-none font-bold">Investimento</p>
                          <p className="font-sans text-sm font-semibold text-slate-200">{item.price} / class</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBook(item)}
                        className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-montserrat text-[10px] font-bold tracking-widest uppercase px-5 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-fuchsia-600/30 cursor-pointer flex-shrink-0"
                      >
                        {t.bookClass}
                      </button>
                    </div>

                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/5 border border-dashed border-white/10 p-12 text-center rounded-2xl space-y-3 backdrop-blur-sm"
              >
                <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="font-display text-lg text-slate-300 font-bold">Nenhuma aula encontrada</h3>
                <p className="font-sans text-xs text-slate-500 font-light max-w-md mx-auto">
                  {t.language.includes("English") 
                    ? "Tente ajustar seus filtros para encontrar aulas correspondentes ou entre em contato para aulas particulares!"
                    : "Try adjusting your filters to find matching classes or reach out directly for private classes!"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Small Booking Disclaimer */}
        <div className="mt-8 text-center">
          <p className="font-sans text-xs text-slate-500 leading-relaxed font-light">
            💡 {t.language.includes("English") 
              ? "Dica: Tem interesse em acelerar sua curva de aprendizado? Oferecemos pacotes promocionais mensais e aulas particulares personalizadas. Consulte-nos!"
              : "Tip: Interested in accelerating your learning? We offer monthly pass discounts and tailored private coachings. Inquire below!"}
          </p>
        </div>

      </div>
    </section>
  );
}
