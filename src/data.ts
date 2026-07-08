export interface Feature {
  title: string;
  desc: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface DanceStyle {
  id: string;
  title: string;
  desc: string;
  image: string;
  features: string[];
}

export interface ClassItem {
  id: string;
  day: string;
  time: string;
  style: string;
  level: string;
  location: string;
  price: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  price: string;
}

export interface MediaItem {
  id: string;
  type: "video" | "photo";
  title: string;
  thumbnail: string;
  url?: string;
  category: "Class Highlight" | "Performance" | "Social Dance" | "Workshop";
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image: string;
  category: string;
}

export const brandDetails = {
  name: "2inDance",
  tagline: "The Art of FusionDance in Motion",
  description: "Learn Brazilian Zouk, Lambada, and Samba with Xina and Laura in Hong Kong. Discover fluidity, harmony, and the joy of partner dancing.",
  phone: "+852 9123 4567",
  email: "info@2indance.hk",
  locations: ["Hong Kong (Central • Sheung Wan • TST)"],
};

export const aboutContent = {
  title: "About Us",
  subtitle: "Meet the founders and team behind 2inDance",
  storyTitle: "Our Story",
  storyText1: "Founded by Xina and Laura, 2inDance was born out of a shared passion for partner dancing and a vision to make Brazilian rhythms accessible, beautiful, and deeply connected. Specializing in Brazilian Zouk, Lambada, and Samba, Xina and Laura bring years of training, performance, and international teaching experience directly to the heart of Hong Kong.",
  storyText2: "The philosophy of 2inDance (2 in Dance) centers entirely around the conversation that happens between two people on the dance floor. It's not just about learning steps; it's about developing an active body dialogue, healthy mechanics, and mutual trust. Whether you're taking your very first step or refining advanced head movements, 2inDance offers an inspiring space where music meets community.",
  founders: [
    {
      name: "Xina",
      role: "Co-Founder & Lead Instructor",
      bio: "Xina is a world-class instructor known for her precise technique, expressive styling, and energetic dance philosophy. Dedicated to teaching Brazilian Zouk and Lambada, she breaks down complex biomechanics into intuitive, flowing movements. Her warmth and dedication ensure that every student feels confident and supported on the dance floor.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Laura",
      role: "Co-Founder & Lead Instructor",
      bio: "Laura is a passionate choreographer and pioneer who brings grace, deep musicality, and connection to every class. With an extensive background in Samba de Gafieira and Zouk, Laura excels in teaching lead-and-follow relationships, allowing dancers to speak a wordless language. Her creative choreography has inspired countless dancers globally.",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=600"
    }
  ],
  stats: [
    { num: "20+", label: "Combined Years Teaching" },
    { num: "5k+", label: "Students Inspired" },
    { num: "12+", label: "International Festivals" },
    { num: "3", label: "Central Hong Kong Locations" }
  ]
};

export const danceStyles: DanceStyle[] = [
  {
    id: "zouk",
    title: "Brazilian Zouk",
    desc: "A breathtaking, contemporary partner dance characterized by incredible fluidity, elegant body ripples, head movements, and deep emotional styling. Danced to modern R&B, pop, and electronic beats.",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800",
    features: ["Deep Connection", "Fluid Body Waves", "Lyrical Expression", "Modern Music"]
  },
  {
    id: "lambada",
    title: "Classic Lambada",
    desc: "The upbeat, joyful, and historic rhythm that paved the way for modern Zouk. Marked by dynamic continuous turns, rapid footwork, infectious hip movements, and a sunny energy like no other.",
    image: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=800",
    features: ["Dynamic Turns", "Fast Pace & Speed", "Joyful Samba Roots", "Continuous Motion"]
  },
  {
    id: "samba",
    title: "Samba de Gafieira",
    desc: "The sophisticated Brazilian ballroom dance. Known for its 'ginga' (swing), sharp footwork, and playful, smooth attitude. It perfectly balances elegance with a cheeky, dramatic charm.",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800",
    features: ["Ballroom Elegance", "Rhythmic Play", "Sharp Lead & Follow", "Authentic Ginga Style"]
  },
  {
    id: "privates",
    title: "1-on-1 Private Lessons",
    desc: "Surgical, personalized attention tailored perfectly to your individual pace, physical profile, and schedule. Perfect for rapid progression, building confidence, or choreographing a special dance.",
    image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&q=80&w=800",
    features: ["Custom Focus", "Flexible Scheduling", "Accelerated Learning", "Perfect for Wedding Dances"]
  }
];

export const weeklySchedule: ClassItem[] = [
  {
    id: "sch-1",
    day: "Monday",
    time: "19:00 - 20:15",
    style: "Brazilian Zouk",
    level: "Beginner",
    location: "Hong Kong Dance Academy, Central",
    price: "HK$150"
  },
  {
    id: "sch-2",
    day: "Monday",
    time: "20:15 - 21:30",
    style: "Brazilian Zouk",
    level: "Intermediate",
    location: "Hong Kong Dance Academy, Central",
    price: "HK$150"
  },
  {
    id: "sch-3",
    day: "Wednesday",
    time: "19:30 - 20:45",
    style: "Classic Lambada",
    level: "All Levels",
    location: "Flow Dance Hong Kong, Sheung Wan",
    price: "HK$150"
  },
  {
    id: "sch-4",
    day: "Wednesday",
    time: "20:45 - 22:00",
    style: "Brazilian Zouk (Advanced Concept)",
    level: "Advanced",
    location: "Flow Dance Hong Kong, Sheung Wan",
    price: "HK$150"
  },
  {
    id: "sch-5",
    day: "Saturday",
    time: "14:00 - 15:30",
    style: "Samba de Gafieira",
    level: "All Levels",
    location: "YMCA Hong Kong, Tsim Sha Tsui",
    price: "HK$160"
  },
  {
    id: "sch-6",
    day: "Saturday",
    time: "15:30 - 18:00",
    style: "Brazilian Zouk (Class + Social Practice)",
    level: "Intermediate",
    location: "YMCA Hong Kong, Tsim Sha Tsui",
    price: "HK$180"
  }
];

export const upcomingEvents: EventItem[] = [
  {
    id: "evt-1",
    title: "Summer Zouk & Lambada Intensive",
    date: "July 18, 2026",
    time: "12:00 - 17:00",
    location: "Flow Dance Hong Kong, Sheung Wan",
    description: "Join Xina and Laura for a 5-hour comprehensive masterclass focused on fluid head movements, styling, and counter-balance connections. Includes a social meetup afterward!",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800",
    price: "HK$450"
  },
  {
    id: "evt-2",
    title: "Samba de Gafieira & Choro Party",
    date: "August 01, 2026",
    time: "19:00 - 23:00",
    location: "YMCA Hong Kong, Tsim Sha Tsui",
    description: "An authentic Brazilian social dance night with live acoustic Choro music. Come practice your samba, enjoy standard Brazilian appetizers, and experience real social warmth.",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800",
    price: "HK$120"
  }
];

export const mediaItems: MediaItem[] = [
  {
    id: "med-1",
    type: "video",
    title: "Zouk Connection Demo in Hong Kong",
    thumbnail: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&q=80&w=800",
    category: "Performance"
  },
  {
    id: "med-2",
    type: "photo",
    title: "Weekly Lambada Class Energy",
    thumbnail: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&q=80&w=800",
    category: "Class Highlight"
  },
  {
    id: "med-3",
    type: "video",
    title: "Samba de Gafieira Footwork breakdown",
    thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800",
    category: "Workshop"
  },
  {
    id: "med-4",
    type: "photo",
    title: "Summer Social Dance Party",
    thumbnail: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=800",
    category: "Social Dance"
  },
  {
    id: "med-5",
    type: "video",
    title: "Advanced Zouk Head Movements & Safety",
    thumbnail: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800",
    category: "Workshop"
  },
  {
    id: "med-6",
    type: "photo",
    title: "Warmup Routine at Hong Kong Dance Academy",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800",
    category: "Class Highlight"
  }
];

export const newsItems: NewsItem[] = [
  {
    id: "news-1",
    title: "Xina & Laura represent Hong Kong at International Zouk Congress",
    excerpt: "We are thrilled to announce that 2inDance founders will be teaching and performing at the upcoming Global Congress, bringing Hong Kong's unique style to the world stage.",
    content: "We are excited to share some wonderful news with our community! Xina and Laura have been officially invited to teach and choreograph a masterclass at the International Zouk Congress this winter. It is an honor to represent our vibrant Hong Kong community. In our class, we will be highlighting our unique teaching curriculum centered on 'Dynamic Active Listening' and flow transitions. Stay tuned as we'll be bringing home fresh material, concepts, and connection techniques directly to our weekly classes in Hong Kong!",
    date: "June 14, 2026",
    author: "2inDance Team",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800",
    category: "Announcement"
  },
  {
    id: "news-2",
    title: "Tips for Perfecting your Zouk Head Movement (Cambré)",
    excerpt: "Safety first! Laura shares her top 3 essential body coordination tips for leaders and followers to dance head movements comfortably and securely.",
    content: "Brazilian Zouk is famous for its beautiful, flowing head movements (known as head rolls or cambré). However, doing them safely and comfortably is crucial. Here are Laura's top 3 guidelines:\n\n1. It Starts with the Core, Not the Neck: Followers should never throw their head back independently. Head movements are a result of the chest tilting, which comes from core support.\n2. Strong, Flexible Frame: Leaders must guide with clear, supportive framing. Do not push or force the follower's head; guide the upper thoracic spine.\n3. Keep the Knees Soft: Bending your knees slightly lowers your center of gravity, giving you the grounding and balance needed to complete movements fluidly.\n\nWant to practice these under expert supervision? Join our Wednesday Advanced Concept class in Sheung Wan!",
    date: "May 28, 2026",
    author: "Laura",
    image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&q=80&w=800",
    category: "Tips & Tutorials"
  },
  {
    id: "news-3",
    title: "New Lambada Course launching in Central",
    excerpt: "By popular demand, we are adding an extra foundation course focusing on the dynamic continuous spins and joyful rhythm of classic Lambada.",
    content: "You asked, we delivered! Starting next month, we are launching a brand new 4-week Lambada Foundation Course at Hong Kong Dance Academy in Central. Classic Lambada is the energetic, high-vibe ancestor of Zouk. It is perfect for dancers who want to increase their spin control, master continuous hip flow, and inject pure joy and speed into their dance. Best of all, no dance partner is required to sign up. We rotate partners regularly so everyone gets to dance and make friends!",
    date: "April 15, 2026",
    author: "Xina",
    image: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=800",
    category: "New Class"
  }
];

export const faqList = [
  {
    q: "Do I need to bring a partner to your classes?",
    a: "Absolutely not! In all our classes, we rotate partners frequently throughout the lesson. This ensures everyone gets to dance, learn from different physical inputs, and meet everyone in the community. If you prefer to stay with your own partner, just let us know at the start of the class."
  },
  {
    q: "What should I wear to my first dance class?",
    a: "Comfort is key! Wear breathable, flexible clothing (like activewear or stretchy jeans). For footwear, choose comfortable flat shoes or lightweight sneakers with smooth soles (avoid rubber soles with high grip as they make spinning difficult). Clean dance shoes, jazz shoes, or socks are also perfect."
  },
  {
    q: "I have absolute zero dance experience. Which class should I join?",
    a: "Welcome! You are in safe hands. We recommend joining our Monday 19:00 Brazilian Zouk Beginner class at Hong Kong Dance Academy or our Wednesday 19:30 Lambada All Levels class. We break down the absolute basics from the ground up, so no prior experience is required!"
  },
  {
    q: "How do I book a spot or pay for classes?",
    a: "You can book directly using the contact form on our website, or send a quick message to our WhatsApp at +852 9123 4567. You can pay online via transfer or with card/cash at the door before the class begins."
  }
];

export const benefitsList = [
  {
    title: "Deeper Connection",
    desc: "Cultivate physical awareness, active body dialogue, and profound non-verbal connection on the dance floor.",
    icon: "Heart"
  },
  {
    title: "Physical Grace & Stamina",
    desc: "Improve your posture, physical coordination, core strength, and cardiovascular health through dynamic movement.",
    icon: "Activity"
  },
  {
    title: "Joy & Stress Relief",
    desc: "Unplug from the daily grind. Dance triggers a beautiful release of endorphins, bringing absolute focus to the present moment.",
    icon: "Brain"
  },
  {
    title: "A Global Family",
    desc: "Join a warm, inclusive, and international Hong Kong community. Make lifelong friends at classes, socials, and festivals.",
    icon: "Users"
  }
];
