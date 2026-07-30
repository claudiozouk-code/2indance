import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, MapPin, Calendar, CircleDollarSign, Flame, Sparkles } from "lucide-react";
import { danceStyles, weeklySchedule, upcomingEvents } from "../data";

interface ClassesEventsProps {
  onSelectClass: (className: string) => void;
}

export default function ClassesEvents({ onSelectClass }: ClassesEventsProps) {
  const [activeTab, setActiveTab] = useState<"weekly" | "events" | "styles">("weekly");
  const [selectedDay, setSelectedDay] = useState<string>("All");
  const [schedule, setSchedule] = useState<any[]>(weeklySchedule);
  const [events, setEvents] = useState<any[]>(upcomingEvents);

  const daysList = ["All", "Monday", "Wednesday", "Saturday"];

  useEffect(() => {
    fetch("/api/schedule")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSchedule(data);
        }
      })
      .catch((err) => console.error("Error loading schedule:", err));

    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEvents(data);
        }
      })
      .catch((err) => console.error("Error loading events:", err));
  }, []);

  const filteredSchedule = schedule.filter(
    (item) => selectedDay === "All" || item.day === selectedDay
  );

  const handleBook = (item: any, isEvent = false) => {
    const name = isEvent
      ? `Workshop: ${item.title} (${item.date})`
      : `Class: ${item.style} (${item.level}) - ${item.day} ${item.time}`;
    onSelectClass(name);

    // Smooth scroll to contact
    const contactSec = document.getElementById("contact");
    if (contactSec) {
      contactSec.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="classes-events" className="py-20 md:py-28 bg-gradient-to-tr from-[#161916] via-[#252824] to-[#343833] text-[#fff6da] relative overflow-hidden border-t border-[#9bb08a]/25">
      {/* 1. Dance Floor Coordinate Alignment Guides */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dotGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="1" fill="#fff6da" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotGrid)" />
          <circle cx="50%" cy="50%" r="200" stroke="#fff6da" strokeWidth="1" strokeDasharray="5 10" />
          <circle cx="50%" cy="50%" r="400" stroke="#fff6da" strokeWidth="1" strokeDasharray="3 15" />
        </svg>
      </div>

      {/* Glow overlays */}
      <div className="absolute top-1/4 right-[-10%] w-[45vw] h-[45vw] bg-[#f6c86b]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-[-10%] w-[45vw] h-[45vw] bg-[#9bb08a]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-[#9bb08a]/20 px-3.5 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#f6c86b]" />
            <span className="font-montserrat text-[10px] font-bold tracking-widest text-[#ffe6a6] uppercase">
              Classes & Events
            </span>
          </div>
          <h2 className="font-display text-3.5xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#fff6da] uppercase">
            Start Your Dance Journey
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#fff6da]/80 font-light">
            Whether you want to learn Zouk, Lambada, or Samba de Gafieira, explore our schedule and join our passionate Hong Kong community.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="bg-[#2a2d29] border border-[#9bb08a]/20 p-1.5 rounded-2xl flex space-x-2 shadow-lg">
            <button
              onClick={() => setActiveTab("weekly")}
              className={`px-5 py-3 rounded-xl font-montserrat text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeTab === "weekly"
                  ? "bg-[#f6c86b] text-[#3b3f3a] shadow-md"
                  : "text-[#fff6da]/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Weekly Schedule
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-5 py-3 rounded-xl font-montserrat text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeTab === "events"
                  ? "bg-[#f6c86b] text-[#3b3f3a] shadow-md"
                  : "text-[#fff6da]/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Workshops & Parties
            </button>
            <button
              onClick={() => setActiveTab("styles")}
              className={`px-5 py-3 rounded-xl font-montserrat text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeTab === "styles"
                  ? "bg-[#f6c86b] text-[#3b3f3a] shadow-md"
                  : "text-[#fff6da]/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Dance Styles
            </button>
          </div>
        </div>

        {/* Tab Content Panels */}
        <div>
          <AnimatePresence mode="wait">
            
            {/* WEEKLY SCHEDULE */}
            {activeTab === "weekly" && (
              <motion.div
                key="weekly-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {/* Day Filter Sub-Bar */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-4 bg-white/5 p-4 rounded-2xl border border-[#9bb08a]/15 max-w-2xl mx-auto">
                  <span className="font-montserrat text-[10px] font-bold text-[#ffe6a6] uppercase tracking-widest mr-2">Filter Day:</span>
                  {daysList.map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-4 py-2 rounded-xl font-montserrat text-xs font-semibold tracking-wide transition-all duration-300 border cursor-pointer ${
                        selectedDay === day
                          ? "bg-[#9bb08a] border-[#9bb08a] text-[#3b3f3a]"
                          : "bg-transparent hover:bg-white/5 border-[#9bb08a]/20 text-[#fff6da]/80"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                {/* Schedule Table/Grid */}
                <div className="space-y-4">
                  {filteredSchedule.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-[#2a2d29]/60 border border-[#9bb08a]/15 hover:border-[#f6c86b]/40 rounded-2xl p-6 transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-md backdrop-blur-sm"
                    >
                      {/* Day & Time Column */}
                      <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-[#9bb08a]/10 pb-4 md:pb-0 md:pr-6 space-y-1">
                        <span className="inline-block px-3 py-1 bg-[#9bb08a]/20 text-[#ffe6a6] font-montserrat text-[10px] font-bold tracking-widest uppercase rounded-lg">
                          {item.day}
                        </span>
                        <div className="flex items-center space-x-2 text-[#fff6da]/80 font-sans text-sm mt-2">
                          <Clock className="w-4 h-4 text-[#9bb08a]" />
                          <span className="font-medium">{item.time}</span>
                        </div>
                      </div>

                      {/* Class Details */}
                      <div className="md:col-span-5 space-y-2">
                        <div className="flex items-center space-x-3 flex-wrap gap-y-1.5">
                          <h3 className="font-display text-xl font-bold text-[#fff6da]">
                            {item.style}
                          </h3>
                          <span className={`text-[9px] font-montserrat font-bold tracking-widest uppercase px-2 py-0.5 rounded border ${
                            item.level === "Beginner"
                              ? "bg-[#9bb08a]/10 border-[#9bb08a]/40 text-[#9bb08a]"
                              : item.level === "Intermediate"
                              ? "bg-[#f6c86b]/10 border-[#f6c86b]/40 text-[#f6c86b]"
                              : "bg-red-400/10 border-red-400/40 text-red-400"
                          }`}>
                            {item.level}
                          </span>
                        </div>
                        <div className="flex items-start space-x-2 text-xs text-[#fff6da]/70">
                          <MapPin className="w-4 h-4 text-[#9bb08a] mt-0.5 flex-shrink-0" />
                          <span>{item.location}</span>
                        </div>
                      </div>

                      {/* Price & Action button */}
                      <div className="md:col-span-4 flex items-center justify-between md:justify-end space-x-6 border-t md:border-t-0 border-[#9bb08a]/10 pt-4 md:pt-0">
                        <div className="flex items-center space-x-2">
                          <CircleDollarSign className="w-5 h-5 text-[#f6c86b]" />
                          <div>
                            <p className="text-[9px] font-montserrat text-[#fff6da]/50 uppercase tracking-widest font-bold">Investment</p>
                            <p className="font-sans text-sm font-semibold text-[#ffe6a6]">{item.price} / lesson</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleBook(item, false)}
                          className="bg-[#f6c86b] hover:bg-[#ffe6a6] text-[#3b3f3a] font-montserrat text-[10px] font-bold tracking-widest uppercase px-5 py-3 rounded-xl transition-all duration-300 shadow-md cursor-pointer flex-shrink-0"
                        >
                          Book Class
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center mt-6">
                  <p className="font-sans text-xs text-[#fff6da]/60 italic">
                    * No partner required! We rotate partners frequently during class so everyone gets to dance.
                  </p>
                </div>
              </motion.div>
            )}

            {/* SPECIAL WORKSHOPS & EVENTS */}
            {activeTab === "events" && (
              <motion.div
                key="events-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-[#2a2d29]/80 border border-[#9bb08a]/20 rounded-3xl overflow-hidden shadow-xl hover:border-[#f6c86b]/30 transition-all duration-300 flex flex-col group"
                  >
                    {/* Header Image */}
                    <div className="h-56 relative overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2a2d29] via-transparent to-transparent" />
                      
                      {/* Price Badge */}
                      <span className="absolute top-4 right-4 bg-[#f6c86b] text-[#3b3f3a] font-montserrat text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                        {event.price}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-xs text-[#ffe6a6] font-montserrat font-semibold">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3.5 h-3.5 text-[#9bb08a]" />
                            <span>{event.date}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-[#9bb08a]" />
                            <span>{event.time}</span>
                          </span>
                        </div>
                        
                        <h3 className="font-display text-2xl font-bold text-[#fff6da] group-hover:text-[#f6c86b] transition-colors leading-snug">
                          {event.title}
                        </h3>

                        <p className="font-sans text-[#fff6da]/85 text-xs sm:text-sm font-light leading-relaxed">
                          {event.description}
                        </p>
                      </div>

                      <div className="border-t border-[#9bb08a]/10 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-start space-x-2 text-xs text-[#fff6da]/70">
                          <MapPin className="w-4 h-4 text-[#9bb08a] mt-0.5 flex-shrink-0" />
                          <span>{event.location}</span>
                        </div>

                        <button
                          onClick={() => handleBook(event, true)}
                          className="bg-[#f6c86b] hover:bg-[#ffe6a6] text-[#3b3f3a] font-montserrat text-[10px] font-bold tracking-widest uppercase px-5 py-3 rounded-xl transition-all duration-300 shadow-sm cursor-pointer whitespace-nowrap text-center"
                        >
                          Reserve Ticket
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* DANCE STYLES INFO */}
            {activeTab === "styles" && (
              <motion.div
                key="styles-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {danceStyles.map((style) => (
                  <div
                    key={style.id}
                    className="bg-[#2a2d29]/40 border border-[#9bb08a]/15 rounded-3xl p-6 md:p-8 hover:bg-[#2a2d29]/60 transition-all duration-300 flex flex-col sm:flex-row gap-6 shadow-sm"
                  >
                    {/* Style Thumbnail */}
                    <div className="sm:w-1/3 h-48 sm:h-auto rounded-2xl overflow-hidden relative">
                      <img
                        src={style.image}
                        alt={style.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-[#3b3f3a]/25" />
                    </div>

                    {/* Details */}
                    <div className="sm:w-2/3 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="font-display text-2xl font-bold text-[#fff6da] flex items-center space-x-2">
                          <Flame className="w-5 h-5 text-[#f6c86b]" />
                          <span>{style.title}</span>
                        </h3>
                        <p className="font-sans text-[#fff6da]/80 text-xs sm:text-sm mt-2 font-light leading-relaxed">
                          {style.desc}
                        </p>
                      </div>

                      {/* Tag Features */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {style.features.map((feat, idx) => (
                          <span
                            key={idx}
                            className="bg-[#9bb08a]/10 border border-[#9bb08a]/20 text-[#ffe6a6] font-montserrat text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
