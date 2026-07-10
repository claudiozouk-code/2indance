import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  ExternalLink, 
  Calendar, 
  MapPin, 
  Waves, 
  Compass, 
  Sparkles, 
  Coffee, 
  Phone, 
  AlertCircle, 
  Clock, 
  Users, 
  PartyPopper,
  Info
} from "lucide-react";

// @ts-ignore
import logoImageDefault from "../assets/images/hainan_zouk_logo_1783656713499.jpg";
// @ts-ignore
import resortImageDefault from "../assets/images/stony_brook_resort_1783657607790.jpg";
// @ts-ignore
import roomImageDefault from "../assets/images/standard_hotel_room_1783657625011.jpg";
// @ts-ignore
import beachImageDefault from "../assets/images/dadonghai_beach_1783657644143.jpg";

export default function HainanMarathon() {
  const [frontpage, setFrontpage] = useState<any>({
    hainan_badge: "Featured Global Event • March 2027",
    hainan_title: "Hainan Island Zouk Marathon",
    hainan_quote: "Hainan Island — China's tropical paradise. White-sand beaches, green mountains, fresh seafood, and vibrant reefs set the stage for endless adventures, unforgettable nights of dance, and the taste of local flavors.",
    hainan_link: "https://hainanzouk.2indance.com",
    hainan_logo_image: "",
    hainan_resort_image: "",
    hainan_room_image: "",
    hainan_beach_image: ""
  });

  const logoImage = frontpage.hainan_logo_image || logoImageDefault;
  const resortImage = frontpage.hainan_resort_image || resortImageDefault;
  const roomImage = frontpage.hainan_room_image || roomImageDefault;
  const beachImage = frontpage.hainan_beach_image || beachImageDefault;

  useEffect(() => {
    fetch("/api/frontpage")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setFrontpage(data);
        }
      })
      .catch((err) => console.error("Error loading frontpage content in HainanMarathon:", err));
  }, []);

  return (
    <section 
      id="hainan" 
      className="py-16 md:py-24 bg-gradient-to-b from-[#111e17] via-[#1c2e24] to-[#2b2f2d] text-[#fff6da] relative overflow-hidden border-t border-[#9bb08a]/20"
    >
      {/* Tropical Floating Palm leaves & waves vector decorations */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1000" fill="none" preserveAspectRatio="none">
          <motion.path 
            d="M -100,200 C 200,100 400,300 700,200 C 1000,100 1200,300 1500,200" 
            stroke="#f6c86b" 
            strokeWidth="3" 
            strokeDasharray="8 8"
            animate={{ strokeDashoffset: [0, -40] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.path 
            d="M -50,600 C 350,500 550,750 850,650 C 1150,550 1350,750 1650,650" 
            stroke="#9bb08a" 
            strokeWidth="2.5" 
            animate={{ strokeDashoffset: [0, 40] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>

      {/* Decorative Radial Glowing Orbs resembling tropical sun & sea breeze */}
      <div className="absolute top-10 left-10 w-[45vw] h-[45vw] bg-[#f6c86b]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[35vw] h-[35vw] bg-[#9bb08a]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-[20%] w-[40vw] h-[40vw] bg-cyan-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-18">
          <div className="inline-flex items-center space-x-2 bg-[#f6c86b]/10 border border-[#f6c86b]/20 px-3.5 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#f6c86b]" />
            <span className="font-montserrat text-[10px] font-bold tracking-widest text-[#ffe6a6] uppercase">
              {frontpage.hainan_badge || "Featured Global Event • March 2027"}
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-[#fff6da] via-[#ffe6a6] to-[#f6c86b] bg-clip-text text-transparent uppercase">
            {frontpage.hainan_title || "Hainan Island Zouk Marathon"}
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#f6c86b] to-transparent mx-auto mb-5" />
          <p className="font-sans text-sm sm:text-base text-[#fff6da]/85 font-light max-w-2xl mx-auto italic">
            "{frontpage.hainan_quote || "Hainan Island — China's tropical paradise. White-sand beaches, green mountains, fresh seafood, and vibrant reefs set the stage for endless adventures, unforgettable nights of dance, and the taste of local flavors."}"
          </p>
        </div>

        {/* MAIN BENTO DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT PANEL: MAIN FLYER LOGO & QUICK HIGHLIGHTS (4 COLS) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div className="bg-[#1c2e24]/75 border border-[#9bb08a]/20 p-6 rounded-3xl backdrop-blur-md flex-grow flex flex-col items-center justify-center text-center shadow-xl group hover:border-[#f6c86b]/30 transition-all duration-300">
              <div className="relative w-full max-w-[280px] mx-auto mb-6">
                {/* Image Glow */}
                <div className="absolute inset-0 bg-[#f6c86b]/10 rounded-2xl blur-xl opacity-60 group-hover:opacity-85 transition-opacity duration-300" />
                <img 
                  src={logoImage} 
                  alt="Hainan Island Zouk Marathon Logo" 
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              <div className="space-y-2 w-full">
                <span className="font-montserrat text-[11px] font-bold tracking-widest text-[#f6c86b] uppercase block">
                  Official Portal
                </span>
                <a 
                  href={frontpage.hainan_link || "https://hainanzouk.2indance.com"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-sm text-[#fff6da]/90 hover:text-[#f6c86b] font-mono transition-colors border-b border-dashed border-[#ffe6a6]/30 pb-0.5"
                >
                  <span>{(frontpage.hainan_link || "hainanzouk.2indance.com").replace("https://", "").replace("http://", "")}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* ORGANIZERS & CONTACT CARD */}
            <div className="bg-gradient-to-br from-[#1c2e24]/90 to-[#2b2f2d] border border-[#9bb08a]/20 p-6 rounded-3xl backdrop-blur-md shadow-xl">
              <h4 className="font-montserrat text-xs font-bold uppercase tracking-wider text-[#ffe6a6] mb-4 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#f6c86b] animate-ping" />
                <span>Contact Organizers</span>
              </h4>
              <p className="font-sans text-xs text-[#fff6da]/80 mb-5 leading-relaxed">
                Have questions regarding registration, visas, or flights? Reach out directly via WhatsApp:
              </p>
              
              <div className="space-y-3">
                <a 
                  href="https://wa.me/85268400676"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 bg-black/25 hover:bg-black/40 border border-white/5 hover:border-[#f6c86b]/40 rounded-2xl transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#9bb08a]/20 rounded-xl text-[#f6c86b] group-hover:bg-[#9bb08a]/30 transition-all">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-montserrat font-bold text-[#fff6da] uppercase block">Laura</span>
                      <span className="text-[11px] font-mono text-[#fff6da]/60">852 6840 0676</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-montserrat font-semibold tracking-wider text-[#f6c86b] uppercase opacity-0 group-hover:opacity-100 transition-opacity">Chat</span>
                </a>

                <a 
                  href="https://wa.me/85266847462"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 bg-black/25 hover:bg-black/40 border border-white/5 hover:border-[#f6c86b]/40 rounded-2xl transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#9bb08a]/20 rounded-xl text-[#f6c86b] group-hover:bg-[#9bb08a]/30 transition-all">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-montserrat font-bold text-[#fff6da] uppercase block">Xina</span>
                      <span className="text-[11px] font-mono text-[#fff6da]/60">852 6684 7462</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-montserrat font-semibold tracking-wider text-[#f6c86b] uppercase opacity-0 group-hover:opacity-100 transition-opacity">Chat</span>
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT PANELS: SCHEDULE, VENUE & PARTIES (8 COLS) */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-8">
            
            {/* MARATHON KEY DETAILS & FULL PASS SECTION */}
            <div className="bg-gradient-to-r from-[#1c2e24]/80 to-[#2b2f2d]/85 border border-[#9bb08a]/20 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-xl space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <div className="flex items-center space-x-2 text-[#f6c86b] mb-1">
                    <Calendar className="w-5 h-5" />
                    <span className="font-montserrat text-sm font-bold tracking-wider uppercase">Event Dates</span>
                  </div>
                  <h3 className="font-display text-2.5xl sm:text-3xl font-extrabold text-[#fff6da]">
                    26 – 28 March 2027
                  </h3>
                  <p className="font-sans text-xs text-[#ffe6a6]/80 uppercase font-bold tracking-widest mt-0.5">
                    Friday to Sunday
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl md:text-right max-w-xs">
                  <div className="flex items-center md:justify-end space-x-2 text-[#9bb08a] text-xs font-montserrat font-bold uppercase mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Official Venue</span>
                  </div>
                  <p className="font-sans text-sm font-semibold text-[#fff6da]">
                    Stony Brook Villa Resort Sanya
                  </p>
                </div>
              </div>

              {/* Grid content inside full pass */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                <div className="md:col-span-7 space-y-4">
                  <div className="inline-flex items-center space-x-1.5 bg-[#f6c86b]/10 px-2.5 py-1 rounded-md text-xs font-montserrat font-bold uppercase text-[#f6c86b]">
                    <span>What's Included</span>
                  </div>
                  <h4 className="font-display text-lg font-bold text-[#ffe6a6]">
                    Full Pass Experience
                  </h4>
                  <p className="font-sans text-sm text-[#fff6da]/95 leading-relaxed">
                    Immerse yourself completely in the festival with our masterfully arranged pass. It grants you access to premium amenities:
                  </p>
                  
                  <ul className="space-y-2.5 text-sm">
                    <li className="flex items-start space-x-2.5">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f6c86b]/20 flex items-center justify-center text-[#f6c86b] font-bold text-xs mt-0.5">✓</span>
                      <span><strong>All Parties (3 Marathon Nights)</strong> — Non-stop beach social dance music.</span>
                    </li>
                    <li className="flex items-start space-x-2.5">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f6c86b]/20 flex items-center justify-center text-[#f6c86b] font-bold text-xs mt-0.5">✓</span>
                      <span><strong>Special Dance Classes</strong> — Level up with incredible top-tier artists.</span>
                    </li>
                    <li className="flex items-start space-x-2.5">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f6c86b]/20 flex items-center justify-center text-[#f6c86b] font-bold text-xs mt-0.5">✓</span>
                      <span><strong>Unlimited Soft Drinks & Snacks</strong> — Complimentary during the night parties.</span>
                    </li>
                  </ul>
                </div>

                <div className="md:col-span-5 relative group overflow-hidden rounded-2xl border border-white/10 shadow-lg">
                  <img 
                    src={resortImage} 
                    alt="Stony Brook Villa Resort Sanya" 
                    referrerPolicy="no-referrer"
                    className="w-full h-48 md:h-52 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3.5">
                    <span className="font-montserrat text-[10px] font-bold uppercase tracking-widest text-[#f6c86b]">Host Resort</span>
                    <span className="font-sans text-xs font-semibold text-white">Stony Brook Villa Sanya</span>
                  </div>
                </div>

              </div>
            </div>

            {/* TWO-COLUMN GRID: ACCOMMODATION & PRE-PARTIES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* ACCOMMODATION OFFER CARD */}
              <div className="bg-[#1c2e24]/85 border border-[#9bb08a]/25 p-5 md:p-6 rounded-3xl backdrop-blur-md shadow-xl flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="inline-flex items-center space-x-1.5 bg-[#9bb08a]/25 px-2.5 py-1 rounded-md text-[10px] font-montserrat font-bold uppercase text-[#ffe6a6] tracking-wider">
                    <Coffee className="w-3.5 h-3.5 text-[#f6c86b]" />
                    <span>Special Lodging Deal</span>
                  </div>
                  <h4 className="font-display text-xl font-bold text-[#f6c86b] uppercase tracking-wide">
                    Accommodation
                  </h4>
                  <p className="font-sans text-xs text-[#fff6da]/90 font-bold uppercase tracking-wide">
                    Standard Hotel Room Offer
                  </p>
                  
                  <ul className="space-y-2 text-xs text-[#fff6da]/85 border-t border-white/10 pt-3">
                    <li className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#ffe6a6]/80 font-medium">Price:</span>
                      <strong className="text-[#f6c86b] font-mono">HKD 1,401</strong>
                    </li>
                    <li className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#ffe6a6]/80 font-medium">Duration:</span>
                      <strong>3 Nights</strong>
                    </li>
                    <li className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#ffe6a6]/80 font-medium">Guests:</span>
                      <strong className="flex items-center space-x-1">
                        <Users className="w-3 h-3 text-[#9bb08a]" />
                        <span>2 People Max</span>
                      </strong>
                    </li>
                    <li className="flex justify-between py-1">
                      <span className="text-[#ffe6a6]/80 font-medium">Breakfast:</span>
                      <span className="text-[#9bb08a] font-semibold">Included</span>
                    </li>
                  </ul>
                </div>

                <div className="relative group rounded-xl overflow-hidden border border-white/10">
                  <img 
                    src={roomImage} 
                    alt="Standard Resort Hotel Room" 
                    referrerPolicy="no-referrer"
                    className="w-full h-28 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                    <span className="text-[10px] font-sans font-medium text-white/90">Preview Resort Room</span>
                  </div>
                </div>
              </div>

              {/* PRE-PARTY (EXTRA PARTIES) CARD */}
              <div className="bg-[#1c2e24]/85 border border-[#9bb08a]/25 p-5 md:p-6 rounded-3xl backdrop-blur-md shadow-xl flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="inline-flex items-center space-x-1.5 bg-[#f6c86b]/10 px-2.5 py-1 rounded-md text-[10px] font-montserrat font-bold uppercase text-[#f6c86b] tracking-wider">
                    <PartyPopper className="w-3.5 h-3.5" />
                    <span>Extra Warm-Up Parties</span>
                  </div>
                  <h4 className="font-display text-xl font-bold text-[#f6c86b] uppercase tracking-wide">
                    Pre-Party
                  </h4>
                  <p className="font-sans text-xs text-[#fff6da]/90 font-bold uppercase tracking-wide">
                    Party at Dadonghai Beach
                  </p>
                  
                  <div className="space-y-1.5 text-xs text-[#fff6da]/80 border-t border-white/10 pt-3">
                    <div className="flex items-start space-x-1.5 py-1 text-[#ffe6a6]">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#f6c86b]" />
                      <span>
                        <strong>Wed 24/03 & Thu 25/03/2027</strong><br />
                        <span className="text-[#fff6da]/70 font-mono text-[11px]">From 7:00 PM to 1:00 AM</span>
                      </span>
                    </div>

                    <ul className="space-y-1.5 pt-1.5 border-t border-white/5">
                      <li className="flex justify-between">
                        <span>Early Bird:</span>
                        <strong className="text-[#9bb08a] font-mono">¥110 RMB</strong>
                      </li>
                      <li className="flex justify-between">
                        <span>At the Door:</span>
                        <strong className="text-[#fff6da] font-mono">¥130 RMB</strong>
                      </li>
                      <li className="flex justify-between text-[#ffe6a6]/90 font-medium">
                        <span>Drinks:</span>
                        <span>1 complimentary drink</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[#f6c86b]/10 border border-[#f6c86b]/20 p-2.5 rounded-xl flex items-start space-x-2 text-[10px] text-[#ffe6a6]/90 leading-tight">
                    <AlertCircle className="w-4 h-4 text-[#f6c86b] flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Important Note:</strong> This party is <strong>not</strong> included in the Full Pass. Tickets must be purchased separately.
                    </span>
                  </div>
                </div>

                <div className="relative group rounded-xl overflow-hidden border border-white/10">
                  <img 
                    src={beachImage} 
                    alt="Dadonghai Beach" 
                    referrerPolicy="no-referrer"
                    className="w-full h-28 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                    <span className="text-[10px] font-sans font-medium text-white/90">Dadonghai Beach Lounge</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM CTA ACTION BANNER */}
        <div className="mt-12 bg-gradient-to-r from-[#1c2e24] via-[#2d4d3a] to-[#1c2e24] border border-[#9bb08a]/20 p-6 md:p-8 rounded-3xl text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Compass className="w-32 h-32 text-white" />
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h4 className="font-display text-xl md:text-2xl font-bold text-[#ffe6a6] uppercase tracking-wide">
              Secure Your Spot in Tropical Paradise
            </h4>
            <p className="font-sans text-xs sm:text-sm text-[#fff6da]/80 max-w-lg mx-auto">
              Ready to embark on an incredible journey of dance, nature, and friendship? Head over to the official Hainan Marathon portal to buy passes, register for resort pricing, and read the flight guide.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="https://hainanzouk.2indance.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 bg-[#f6c86b] hover:bg-[#ffe6a6] text-[#111e17] font-montserrat text-xs font-bold tracking-widest uppercase px-8 py-4 rounded-xl transition-all duration-300 shadow-md hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Hainan Zouk Official Website</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
