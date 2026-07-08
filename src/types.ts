export interface TranslationDict {
  // Navigation
  home: string;
  about: string;
  styles: string;
  schedule: string;
  testimonials: string;
  contact: string;
  language: string;

  // Hero
  heroTitle: string;
  heroSubtitle: string;
  heroCTA: string;
  heroCTASecondary: string;

  // About Section
  aboutTitle: string;
  aboutSubtitle: string;
  aboutClaudioName: string;
  aboutClaudioRole: string;
  aboutClaudioText1: string;
  aboutClaudioText2: string;
  aboutClaudioStat1Num: string;
  aboutClaudioStat1Label: string;
  aboutClaudioStat2Num: string;
  aboutClaudioStat2Label: string;
  aboutClaudioStat3Num: string;
  aboutClaudioStat3Label: string;

  // Dance Styles
  stylesTitle: string;
  stylesSubtitle: string;
  zoukTitle: string;
  zoukDesc: string;
  lambadaTitle: string;
  lambadaDesc: string;
  sambaTitle: string;
  sambaDesc: string;
  privateTitle: string;
  privateDesc: string;
  learnMore: string;

  // Schedule
  scheduleTitle: string;
  scheduleSubtitle: string;
  allLevels: string;
  beginner: string;
  intermediate: string;
  advanced: string;
  dayMonday: string;
  dayWednesday: string;
  daySaturday: string;
  bookClass: string;
  locationsLabel: string;

  // Benefits
  benefitsTitle: string;
  benefitsSubtitle: string;
  benefit1Title: string;
  benefit1Desc: string;
  benefit2Title: string;
  benefit2Desc: string;
  benefit3Title: string;
  benefit3Desc: string;
  benefit4Title: string;
  benefit4Desc: string;

  // Testimonials
  testimonialsTitle: string;
  testimonialsSubtitle: string;

  // Contact
  contactTitle: string;
  contactSubtitle: string;
  contactName: string;
  contactEmail: string;
  contactMessage: string;
  contactSend: string;
  contactSending: string;
  contactSuccess: string;
  contactPhone: string;
  contactLocation: string;
  followUs: string;
  
  // Footer
  footerRights: string;
  footerTagline: string;
}

export interface DanceStyle {
  id: string;
  titleKey: keyof TranslationDict;
  descKey: keyof TranslationDict;
  image: string;
  features: string[];
}

export interface ScheduleItem {
  id: string;
  dayKey: keyof TranslationDict;
  time: string;
  styleKey: keyof TranslationDict;
  levelKey: keyof TranslationDict;
  location: string;
  price: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  textKey: string; // we can map directly or keep in translations
  text: { pt: string; en: string };
  avatar: string;
}
