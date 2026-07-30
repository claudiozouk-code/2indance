import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Heart, Activity, Award, Check, Instagram, Facebook, Youtube, MessageCircle, ExternalLink, Star } from "lucide-react";
import { aboutContent } from "../data";

export default function About() {
  const [content, setContent] = useState(aboutContent);

  useEffect(() => {
    fetch("/api/about")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setContent(data);
        }
      })
      .catch((err) => console.error("Error loading about us from DB:", err));
  }, []);

  return (
    <section id="about" className="py-20 md:py-28 bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EA] to-[#FFF0D4]/70 text-[#3b3f3a] relative overflow-hidden border-t border-[#9bb08a]/25">
      {/* 1. Fluid Topographic Dance Path Waves */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="none">
          <motion.path 
            d="M -100,200 C 300,100 500,400 800,250 C 1100,100 1300,350 1600,200" 
            stroke="#9bb08a" 
            strokeWidth="3" 
            strokeDasharray="8 8"
            animate={{ strokeDashoffset: [0, -40] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <motion.path 
            d="M -50,350 C 400,200 600,600 900,450 C 1200,300 1400,500 1700,350" 
            stroke="#f6c86b" 
            strokeWidth="2" 
            animate={{ strokeDashoffset: [0, 40] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <path d="M -200,500 C 250,300 450,700 750,550 C 1050,400 1250,600 1550,500" stroke="#3b3f3a" strokeWidth="1.5" strokeOpacity="0.5" />
        </svg>
      </div>

      {/* Background decorations */}
      <div className="absolute top-1/4 right-[-5%] w-[40vw] h-[40vw] bg-[#9bb08a]/12 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-[-5%] w-[35vw] h-[35vw] bg-[#f6c86b]/15 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <div className="inline-flex items-center space-x-2 bg-[#3b3f3a]/5 border border-[#3b3f3a]/10 px-3.5 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#f6c86b]" />
            <span className="font-montserrat text-[10px] font-bold tracking-widest text-[#3b3f3a]/80 uppercase">
              {content.title}
            </span>
          </div>
          <h2 className="font-display text-3.5xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#3b3f3a] uppercase">
            Meet Our School
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#3b3f3a]/70 font-light max-w-xl mx-auto">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Story Section & School philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20">
          
          {/* Left: Philosophy & story */}
          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            <span className="font-montserrat text-xs font-bold uppercase tracking-wider text-[#9bb08a]">
              Our Philosophy
            </span>
            <h3 className="font-display text-3xl font-bold text-[#3b3f3a] tracking-tight leading-tight">
              {content.storyTitle}
            </h3>
            <p className="font-sans text-[#3b3f3a]/80 text-sm sm:text-base leading-relaxed font-light">
              {content.storyText1}
            </p>
            <p className="font-sans text-[#3b3f3a]/80 text-sm sm:text-base leading-relaxed font-light">
              {content.storyText2}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start space-x-3">
                <div className="mt-1 p-1 bg-[#9bb08a]/20 text-[#3b3f3a] rounded-md">
                  <Check className="w-3.5 h-3.5 stroke-[3px]" />
                </div>
                <div>
                  <h4 className="font-montserrat text-xs font-bold uppercase tracking-wider text-[#3b3f3a]">Active Connection</h4>
                  <p className="font-sans text-xs text-[#3b3f3a]/70 mt-0.5">Learn to communicate with direct, clear, non-verbal body language.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1 p-1 bg-[#9bb08a]/20 text-[#3b3f3a] rounded-md">
                  <Check className="w-3.5 h-3.5 stroke-[3px]" />
                </div>
                <div>
                  <h4 className="font-montserrat text-xs font-bold uppercase tracking-wider text-[#3b3f3a]">Healthy Biomechanics</h4>
                  <p className="font-sans text-xs text-[#3b3f3a]/70 mt-0.5">Dance naturally with a healthy posture and fluid spin dynamics.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 grid grid-cols-2 gap-4"
          >
            {content.stats?.map((stat, idx) => (
              <div
                key={idx}
                className="bg-[#ffe6a6]/40 border border-[#9bb08a]/10 p-6 rounded-2xl shadow-sm text-center flex flex-col justify-center items-center group hover:bg-[#ffe6a6]/60 transition-all duration-300"
              >
                <span className="font-display text-4.5xl font-extrabold text-[#3b3f3a]">
                  {stat.num}
                </span>
                <p className="font-montserrat text-[10px] font-bold text-[#3b3f3a]/60 uppercase tracking-widest mt-2 leading-tight">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

        </div>

        {/* Founders Grid */}
        <div className="mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12"
          >
            <span className="font-montserrat text-xs font-bold uppercase tracking-widest text-[#9bb08a] bg-[#9bb08a]/10 px-3.5 py-1.5 rounded-full border border-[#9bb08a]/20">
              The Founders & Master Instructors
            </span>
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-[#3b3f3a] uppercase mt-3">
              Meet Xina & Laura
            </h3>
            <p className="font-sans text-sm text-[#3b3f3a]/75 font-normal max-w-xl mx-auto mt-2 leading-relaxed">
              World-class dancer-educators bringing authentic Brazilian Zouk, Lambada, and Samba technique to the Hong Kong dance community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {content.founders?.map((founder: any, idx: number) => {
              const defaultSpecialties = founder.name.toLowerCase().includes("xina")
                ? ["Brazilian Zouk", "Classic Lambada", "Biomechanics & Technique", "Body Isolations"]
                : ["Samba de Gafieira", "Zouk Styling & Cambré", "Lead & Follow Connection", "Musicality"];
              
              const specialties = founder.specialties || defaultSpecialties;
              const quote = founder.quote || (founder.name.toLowerCase().includes("xina") 
                ? "Dance is a physical dialogue of mutual trust, energy, and freedom."
                : "True partnership begins when you listen with your whole body.");

              const socials = founder.socials || {
                instagram: "https://instagram.com/2indance",
                facebook: "https://facebook.com/2indance",
                youtube: "https://youtube.com/@2indance",
                whatsapp: "https://wa.me/85291234567"
              };

              return (
                <motion.div
                  key={founder.id || idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white/80 backdrop-blur-md border border-[#9bb08a]/25 rounded-3xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Hero Image Banner */}
                    <div className="relative h-72 sm:h-80 overflow-hidden">
                      <img
                        src={founder.image}
                        alt={`${founder.name} - Co-Founder of 2inDance`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#3b3f3a] via-[#3b3f3a]/30 to-transparent" />
                      
                      {/* Floating Badge */}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-black/5 shadow-md flex items-center space-x-1.5">
                        <Star className="w-3.5 h-3.5 text-[#f6c86b] fill-[#f6c86b]" />
                        <span className="font-montserrat text-[10px] font-bold uppercase tracking-wider text-[#3b3f3a]">
                          {founder.role || "Co-Founder & Lead Instructor"}
                        </span>
                      </div>

                      {/* Name Overlay */}
                      <div className="absolute bottom-4 left-6 right-6">
                        <h4 className="font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-tight drop-shadow-md">
                          {founder.name}
                        </h4>
                        <p className="font-montserrat text-xs text-[#ffe6a6] font-semibold uppercase tracking-widest mt-0.5">
                          2inDance Co-Founder
                        </p>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 sm:p-8 space-y-6">
                      
                      {/* Short Bio */}
                      <p className="font-sans text-[#3b3f3a]/85 text-sm sm:text-base leading-relaxed font-normal">
                        {founder.bio}
                      </p>

                      {/* Quote snippet */}
                      <div className="bg-[#FAF5EA] border-l-4 border-[#f6c86b] p-4 rounded-r-2xl">
                        <p className="font-display italic text-xs sm:text-sm text-[#3b3f3a]/90">
                          "{quote}"
                        </p>
                      </div>

                      {/* Specialties & Focus Areas */}
                      <div>
                        <span className="block font-montserrat text-[10px] font-bold uppercase tracking-widest text-[#3b3f3a]/60 mb-2">
                          Specialties & Focus
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {specialties.map((spec: string, i: number) => (
                            <span 
                              key={i} 
                              className="font-montserrat text-[11px] font-semibold text-[#3b3f3a] bg-[#9bb08a]/15 border border-[#9bb08a]/30 px-3 py-1 rounded-lg"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Social Media & Contact Footer Toolbar */}
                  <div className="p-6 sm:p-8 pt-0 border-t border-[#3b3f3a]/10 mt-2 flex items-center justify-between flex-wrap gap-4 bg-[#FAF5EA]/50">
                    <div className="flex items-center space-x-2">
                      <span className="font-montserrat text-[10px] font-bold uppercase tracking-widest text-[#3b3f3a]/60 mr-1 hidden sm:inline-block">
                        Connect:
                      </span>
                      {socials.instagram && (
                        <a
                          href={socials.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-white rounded-xl border border-[#3b3f3a]/10 hover:border-[#f6c86b] text-[#3b3f3a] hover:text-[#e1306c] hover:bg-[#ffe6a6]/20 transition-all duration-300 shadow-sm"
                          title={`${founder.name} on Instagram`}
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}
                      {socials.facebook && (
                        <a
                          href={socials.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-white rounded-xl border border-[#3b3f3a]/10 hover:border-[#f6c86b] text-[#3b3f3a] hover:text-[#1877f2] hover:bg-[#ffe6a6]/20 transition-all duration-300 shadow-sm"
                          title={`${founder.name} on Facebook`}
                        >
                          <Facebook className="w-4 h-4" />
                        </a>
                      )}
                      {socials.youtube && (
                        <a
                          href={socials.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-white rounded-xl border border-[#3b3f3a]/10 hover:border-[#f6c86b] text-[#3b3f3a] hover:text-[#ff0000] hover:bg-[#ffe6a6]/20 transition-all duration-300 shadow-sm"
                          title={`${founder.name} on YouTube`}
                        >
                          <Youtube className="w-4 h-4" />
                        </a>
                      )}
                      {socials.whatsapp && (
                        <a
                          href={socials.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-white rounded-xl border border-[#3b3f3a]/10 hover:border-[#f6c86b] text-[#3b3f3a] hover:text-[#25d366] hover:bg-[#ffe6a6]/20 transition-all duration-300 shadow-sm"
                          title={`WhatsApp ${founder.name}`}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <a
                      href="#contact"
                      className="inline-flex items-center space-x-1.5 bg-[#3b3f3a] hover:bg-[#f6c86b] text-white hover:text-[#3b3f3a] px-4 py-2.5 rounded-xl text-xs font-montserrat font-bold uppercase tracking-wider transition-all duration-300 shadow-md"
                    >
                      <span>Book Class with {founder.name}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Signature Quote */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 bg-[#3b3f3a] text-[#fff6da] p-8 md:p-10 rounded-3xl relative overflow-hidden shadow-lg border border-[#9bb08a]/10 max-w-4xl mx-auto"
        >
          <div className="absolute top-[-20px] left-[-10px] w-40 h-40 bg-[#f6c86b]/5 rounded-full blur-[30px] pointer-events-none" />
          <span className="absolute top-2 left-6 font-display text-7xl text-[#f6c86b]/10 select-none">“</span>
          
          <p className="font-display italic text-base sm:text-lg text-[#fff6da]/90 relative z-10 leading-relaxed font-light text-center max-w-2xl mx-auto">
            "Dance isn't about perfect execution. It's about authentic conversation on the floor—the dialogue that occurs in the quiet spaces between the beats."
          </p>
          
          <p className="font-montserrat text-[10px] font-bold uppercase text-[#f6c86b] tracking-widest mt-4 text-center">
            — Xina & Laura
          </p>
        </motion.div>

      </div>
    </section>
  );
}
