import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Phone, MapPin, MessageCircle, HelpCircle, ChevronDown, ChevronUp, Sparkles, Send } from "lucide-react";
import { brandDetails, faqList } from "../data";

interface ContactProps {
  selectedClass?: string;
}

export default function Contact({ selectedClass = "" }: ContactProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [frontpage, setFrontpage] = useState<any>({
    brand_phone: brandDetails.phone,
    brand_email: brandDetails.email,
    brand_locations: brandDetails.locations[0]
  });

  useEffect(() => {
    fetch("/api/frontpage")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setFrontpage(data);
        }
      })
      .catch((err) => console.error("Error loading frontpage content in Contact:", err));
  }, []);

  useEffect(() => {
    if (selectedClass) {
      setMessage(`Hi Xina & Laura, I would love to book a spot in the: ${selectedClass}`);
    }
  }, [selectedClass]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, message })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSent(true);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        throw new Error(data.error || data.details || "Failed to save message to database.");
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || "Unable to send. Please make sure remote IP access is enabled for your Hostinger MySQL database.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-gradient-to-br from-[#FFF9EE] via-[#F4EDE0] to-[#EAE0D1]/80 text-[#3b3f3a] relative overflow-hidden border-t border-[#9bb08a]/25">
      {/* 1. Geometric Gold Thread Partner Connections */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 800" preserveAspectRatio="none">
          <path d="M 0,400 L 720,400 M 1440,400 L 720,400" stroke="#f6c86b" strokeWidth="2.5" strokeDasharray="10 15" />
          <path d="M 300,0 L 720,400 L 1140,0" stroke="#9bb08a" strokeWidth="1.5" />
          <path d="M 300,800 L 720,400 L 1140,800" stroke="#3b3f3a" strokeWidth="1" />
          <circle cx="720" cy="400" r="100" stroke="#f6c86b" strokeWidth="1" strokeDasharray="5 5" />
          <circle cx="720" cy="400" r="8" fill="#f6c86b" />
        </svg>
      </div>

      {/* Decorative Blur Spots */}
      <div className="absolute top-1/4 right-[-10%] w-[40vw] h-[40vw] bg-[#f6c86b]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-[-10%] w-[45vw] h-[45vw] bg-[#9bb08a]/20 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center space-x-2 bg-[#3b3f3a]/5 border border-[#3b3f3a]/10 px-3.5 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#f6c86b]" />
            <span className="font-montserrat text-[10px] font-bold tracking-widest text-[#3b3f3a]/80 uppercase">
              Get In Touch
            </span>
          </div>
          <h2 className="font-display text-3.5xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#3b3f3a] uppercase">
            Start Your Journey
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#3b3f3a]/75 font-light">
            Ready to learn Brazilian Zouk, Lambada, or Samba de Gafieira? Have questions? Contact Xina and Laura directly!
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Contact Details & FAQ */}
          <div className="lg:col-span-5 space-y-10">
            
            {/* Quick Contact Info */}
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-bold tracking-tight text-[#3b3f3a] uppercase">
                Contact Details
              </h3>
              
              <div className="space-y-4">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/447984564350`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-4 bg-[#ffe6a6]/25 hover:bg-[#ffe6a6]/45 border border-[#9bb08a]/20 hover:border-[#f6c86b] rounded-2xl transition-all duration-300 group"
                >
                  <div className="p-3 bg-[#9bb08a]/10 border border-[#9bb08a]/20 rounded-xl text-[#3b3f3a] group-hover:bg-[#9bb08a]/20 transition-all">
                    <MessageCircle className="w-5 h-5 stroke-[2.5px]" />
                  </div>
                  <div>
                    <p className="font-montserrat text-[9px] font-bold text-[#3b3f3a]/60 uppercase tracking-widest leading-none">WhatsApp Chat</p>
                    <p className="font-sans text-sm text-[#3b3f3a] mt-1 font-semibold group-hover:text-[#3b3f3a] transition-colors">{frontpage.brand_phone}</p>
                  </div>
                </a>

                {/* Direct Email */}
                <a
                  href={`mailto:${frontpage.brand_email}`}
                  className="flex items-center space-x-4 p-4 bg-[#ffe6a6]/25 hover:bg-[#ffe6a6]/45 border border-[#9bb08a]/20 hover:border-[#f6c86b] rounded-2xl transition-all duration-300 group"
                >
                  <div className="p-3 bg-[#9bb08a]/10 border border-[#9bb08a]/20 rounded-xl text-[#3b3f3a] group-hover:bg-[#9bb08a]/20 transition-all">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-montserrat text-[9px] font-bold text-[#3b3f3a]/60 uppercase tracking-widest leading-none">Direct Email</p>
                    <p className="font-sans text-sm text-[#3b3f3a] mt-1 font-semibold group-hover:text-[#3b3f3a] transition-colors">{frontpage.brand_email}</p>
                  </div>
                </a>

                {/* Locations */}
                <div className="flex items-center space-x-4 p-4 bg-[#ffe6a6]/15 border border-[#9bb08a]/10 rounded-2xl">
                  <div className="p-3 bg-[#9bb08a]/5 border border-[#9bb08a]/10 rounded-xl text-[#3b3f3a]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-montserrat text-[9px] font-bold text-[#3b3f3a]/60 uppercase tracking-widest leading-none">Venues & Studios</p>
                    <p className="font-sans text-xs text-[#3b3f3a]/90 mt-1 font-medium">{frontpage.brand_locations}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Accordion FAQ Section */}
            <div className="space-y-4 pt-4 border-t border-[#9bb08a]/10">
              <h3 className="font-display text-xl font-bold tracking-tight text-[#3b3f3a] flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-[#9bb08a]" />
                <span>Frequently Asked Questions</span>
              </h3>

              <div className="space-y-3">
                {faqList.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-[#9bb08a]/20 rounded-2xl overflow-hidden bg-[#ffe6a6]/15 hover:border-[#f6c86b]/40 transition-all duration-300"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-4 text-left font-display text-xs sm:text-sm font-bold text-[#3b3f3a] hover:text-[#9bb08a] transition-colors cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-[#9bb08a]" /> : <ChevronDown className="w-4 h-4 text-[#3b3f3a]/50" />}
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 pt-0 text-[#3b3f3a]/80 font-sans text-xs sm:text-sm leading-relaxed font-light border-t border-[#9bb08a]/10">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: High Fidelity Booking & Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#3b3f3a] border border-[#9bb08a]/20 p-6 md:p-8 rounded-3xl shadow-xl relative text-[#fff6da]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f6c86b]/5 rounded-full blur-2xl pointer-events-none" />

              <h3 className="font-display text-2xl font-bold mb-2 text-[#fff6da] uppercase">
                Book Your Spot
              </h3>
              <p className="font-sans text-xs text-[#fff6da]/80 font-light mb-6">
                Send your details below and Xina, Laura or our team will get in touch shortly to confirm your booking and details.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-1">
                  <label htmlFor="form-name" className="font-montserrat text-[9px] font-bold text-[#ffe6a6] uppercase tracking-widest block">
                    Your Full Name
                  </label>
                  <input
                    id="form-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maria Smith"
                    className="w-full bg-[#2a2d29]/80 border border-[#9bb08a]/20 focus:border-[#f6c86b] focus:ring-1 focus:ring-[#f6c86b] rounded-xl px-4 py-3.5 text-sm text-[#fff6da] placeholder-[#fff6da]/30 focus:outline-none transition-all shadow-inner"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="form-email" className="font-montserrat text-[9px] font-bold text-[#ffe6a6] uppercase tracking-widest block">
                    Your Email Address
                  </label>
                  <input
                    id="form-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. maria@gmail.com"
                    className="w-full bg-[#2a2d29]/80 border border-[#9bb08a]/20 focus:border-[#f6c86b] focus:ring-1 focus:ring-[#f6c86b] rounded-xl px-4 py-3.5 text-sm text-[#fff6da] placeholder-[#fff6da]/30 focus:outline-none transition-all shadow-inner"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label htmlFor="form-message" className="font-montserrat text-[9px] font-bold text-[#ffe6a6] uppercase tracking-widest block">
                    Your Message / Style of Interest
                  </label>
                  <textarea
                    id="form-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what style you are interested in and if you have any previous dance experience..."
                    className="w-full bg-[#2a2d29]/80 border border-[#9bb08a]/20 focus:border-[#f6c86b] focus:ring-1 focus:ring-[#f6c86b] rounded-xl px-4 py-3.5 text-sm text-[#fff6da] placeholder-[#fff6da]/30 focus:outline-none transition-all shadow-inner resize-none"
                  />
                </div>

                {/* Error Notification */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 p-3.5 rounded-xl text-xs text-red-300 font-sans leading-relaxed flex items-start space-x-2">
                    <span className="mt-0.5">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-[#f6c86b] hover:bg-[#ffe6a6] disabled:bg-[#2a2d29] text-[#3b3f3a] disabled:text-[#fff6da]/30 font-montserrat text-xs font-bold tracking-widest uppercase py-4 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <span>Sending Message...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Message Sent Success overlay */}
              <AnimatePresence>
                {isSent && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#2a2d29]/95 rounded-3xl flex flex-col items-center justify-center p-8 text-center space-y-4 border border-[#9bb08a]/30 backdrop-blur-md"
                  >
                    <div className="w-14 h-14 bg-[#9bb08a]/10 border border-[#9bb08a]/20 rounded-full flex items-center justify-center text-[#9bb08a]">
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </div>
                    <h4 className="font-display text-xl font-bold text-[#fff6da] uppercase">
                      Message Sent!
                    </h4>
                    <p className="font-sans text-xs text-[#fff6da]/80 leading-relaxed font-light max-w-sm">
                      Thank you! Your inquiry was sent successfully. Xina or Laura will get back to you shortly to confirm your booking and answer any questions!
                    </p>
                    <button
                      onClick={() => setIsSent(false)}
                      className="mt-2 text-[#f6c86b] hover:text-[#ffe6a6] font-montserrat text-[10px] font-bold uppercase tracking-widest border-b border-dashed border-[#f6c86b]/40 hover:border-[#ffe6a6] pb-0.5 cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
