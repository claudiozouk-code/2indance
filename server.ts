import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Import the default fallback data directly
import { 
  aboutContent, 
  weeklySchedule, 
  upcomingEvents, 
  mediaItems, 
  newsItems 
} from "./src/data";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Database connection configuration targeting Hostinger Remote MySQL
const dbConfig = {
  host: (process.env.DB_HOST && process.env.DB_HOST !== "127.0.0.1" && process.env.DB_HOST !== "localhost")
    ? process.env.DB_HOST
    : "srv2106.hstgr.io",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: (process.env.DB_USER && process.env.DB_USER !== "root" && process.env.DB_USER !== "user")
    ? process.env.DB_USER
    : "u906077841_claudiozouk",
  password: (process.env.DB_PASSWORD && process.env.DB_PASSWORD.trim() !== "")
    ? process.env.DB_PASSWORD
    : "@Just990717@",
  database: (process.env.DB_NAME && process.env.DB_NAME !== "test" && process.env.DB_NAME !== "database" && process.env.DB_NAME !== "db")
    ? process.env.DB_NAME
    : "u906077841_2indancenew",
};

console.log("Resolved DB Config:", {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database,
  passwordLength: dbConfig.password ? dbConfig.password.length : 0,
});

let pool: mysql.Pool | null = null;
let dbHealthy = false;

async function getDbPool() {
  if (!pool) {
    try {
      pool = mysql.createPool({
        ...dbConfig,
        waitForConnections: true,
        connectionLimit: 5,
        queueLimit: 0,
        connectTimeout: 8000, // Fail fast if unreachable
      });
      
      const conn = await pool.getConnection();
      console.log("Successfully connected to Hostinger MySQL Database!");
      dbHealthy = true;
      
      // Initialize tables and seed default data
      await initializeDatabase(conn);
      
      conn.release();
    } catch (err: any) {
      console.error("Failed to connect to Hostinger MySQL Database:", err.message);
      console.warn("Server will fall back to in-memory/static content mode!");
      pool = null;
      dbHealthy = false;
    }
  }
  return pool;
}

// Memory fallbacks in case database connection fails or is offline
let localAbout = { ...aboutContent };
let localSchedule = [...weeklySchedule];
let localEvents = [...upcomingEvents];
let localMedia = [...mediaItems];
let localNews = [...newsItems];
let localSubmissions: any[] = [];
let localFrontpage = {
  brand_name: "2inDance",
  brand_tagline: "The Art of FusionDance in Motion",
  brand_description: "Learn Brazilian Zouk, Lambada, and Samba with Xina and Laura in Hong Kong. Discover fluidity, harmony, and the joy of partner dancing.",
  brand_phone: "+852 9123 4567",
  brand_email: "info@2indance.hk",
  brand_locations: "Hong Kong (Central • Sheung Wan • TST)",
  hero_title_line1: "Connection",
  hero_title_line2: "Flow & Fluid",
  hero_title_line3: "Soulzouk Methodology",
  hero_subtitle: "Learn the beautiful art of FusionDance in partner dance. Master the flow, physical conversation, and technique of Soulzouk in Hong Kong.",
  hero_cta_primary: "Book a Trial Class",
  hero_cta_secondary: "Explore Classes",
  hainan_badge: "Featured Global Event • March 2027",
  hainan_title: "Hainan Island Zouk Marathon",
  hainan_quote: "Hainan Island — China's tropical paradise. White-sand beaches, green mountains, fresh seafood, and vibrant reefs set the stage for endless adventures, unforgettable nights of dance, and the taste of local flavors.",
  hainan_link: "https://hainanzouk.2indance.com",
  social_instagram: "https://instagram.com/2indance",
  social_facebook: "https://facebook.com/2indance",
  social_youtube: "https://youtube.com/@2indance",
  social_whatsapp: "https://wa.me/85291234567",
  footer_text: "© 2027 2inDance. All rights reserved. • Soulzouk Methodology in HK",
  footer_disclaimer: "Learn Brazilian Zouk, Lambada, and Samba with Xina & Laura in Hong Kong. Discover fluidity, harmony, and partner dancing.",
  logo_url: "",
  favicon_url: "",
  seo_title: "2inDance | Brazilian Zouk, Lambada & Samba Hong Kong",
  seo_meta_description: "Learn Brazilian Zouk, Lambada, and Samba with Xina and Laura in Hong Kong. Discover fluidity, harmony, and the joy of partner dancing.",
  seo_keywords: "zouk, brazilian zouk, lambada, samba, soulzouk, hong kong dance class, partner dance, xina, laura",
  seo_og_image: "",
  seo_robots: "index, follow",
  google_site_verification: "",
  seo_custom_tags: "",
  hero_bg_type: "animation",
  hero_bg_image: "",
  hainan_logo_image: "",
  hainan_resort_image: "",
  hainan_room_image: "",
  hainan_beach_image: "",
  sections_order: "[]"
};

async function initializeDatabase(conn: mysql.PoolConnection) {
  try {
    // 1. Create Submissions table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Create About Content table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS site_about_content (
        id INT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT NOT NULL,
        storyTitle VARCHAR(255) NOT NULL,
        storyText1 TEXT NOT NULL,
        storyText2 TEXT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. Create Founders table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS site_founders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(255) NOT NULL,
        bio TEXT NOT NULL,
        image VARCHAR(500) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Create Schedule table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS site_weekly_schedule (
        id INT AUTO_INCREMENT PRIMARY KEY,
        day VARCHAR(20) NOT NULL,
        time VARCHAR(50) NOT NULL,
        style VARCHAR(255) NOT NULL,
        level VARCHAR(100) NOT NULL,
        location VARCHAR(255) NOT NULL,
        price VARCHAR(50) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 5. Create Events table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS site_upcoming_events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date VARCHAR(100) NOT NULL,
        time VARCHAR(100) NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(500) NOT NULL,
        price VARCHAR(50) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 6. Create Media table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS site_media_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(20) NOT NULL,
        title VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(500) NOT NULL,
        url VARCHAR(500),
        category VARCHAR(100) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 7. Create News table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS site_news_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        date VARCHAR(100) NOT NULL,
        author VARCHAR(100) NOT NULL,
        image VARCHAR(500) NOT NULL,
        category VARCHAR(100) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 8. Create Admin Users table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 9. Create Frontpage Settings table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS site_frontpage_settings (
        id INT PRIMARY KEY,
        brand_name VARCHAR(255) NOT NULL,
        brand_tagline VARCHAR(255) NOT NULL,
        brand_description TEXT NOT NULL,
        brand_phone VARCHAR(50) NOT NULL,
        brand_email VARCHAR(255) NOT NULL,
        brand_locations VARCHAR(500) NOT NULL,
        hero_title_line1 VARCHAR(255) NOT NULL,
        hero_title_line2 VARCHAR(255) NOT NULL,
        hero_title_line3 VARCHAR(255) NOT NULL,
        hero_subtitle TEXT NOT NULL,
        hero_cta_primary VARCHAR(100) NOT NULL,
        hero_cta_secondary VARCHAR(100) NOT NULL,
        hainan_badge VARCHAR(255) NOT NULL,
        hainan_title VARCHAR(255) NOT NULL,
        hainan_quote TEXT NOT NULL,
        hainan_link VARCHAR(500) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Safely check and add any missing columns for dynamic icons, footer, logo, favicon, and SEO
    const newColumns = [
      { name: "social_instagram", definition: "VARCHAR(255) NOT NULL DEFAULT 'https://instagram.com/2indance'" },
      { name: "social_facebook", definition: "VARCHAR(255) NOT NULL DEFAULT 'https://facebook.com/2indance'" },
      { name: "social_youtube", definition: "VARCHAR(255) NOT NULL DEFAULT 'https://youtube.com/@2indance'" },
      { name: "social_whatsapp", definition: "VARCHAR(255) NOT NULL DEFAULT 'https://wa.me/85291234567'" },
      { name: "footer_text", definition: "VARCHAR(500) NOT NULL DEFAULT '© 2027 2inDance. All rights reserved. • Soulzouk Methodology in HK'" },
      { name: "footer_disclaimer", definition: "VARCHAR(500) NOT NULL DEFAULT 'Learn Brazilian Zouk, Lambada, and Samba with Xina & Laura in Hong Kong. Discover fluidity, harmony, and partner dancing.'" },
      { name: "logo_url", definition: "VARCHAR(1000) NOT NULL DEFAULT ''" },
      { name: "favicon_url", definition: "VARCHAR(1000) NOT NULL DEFAULT ''" },
      { name: "seo_title", definition: "VARCHAR(255) NOT NULL DEFAULT '2inDance | Brazilian Zouk, Lambada & Samba Hong Kong'" },
      { name: "seo_meta_description", definition: "TEXT NULL" },
      { name: "seo_keywords", definition: "VARCHAR(500) NOT NULL DEFAULT 'zouk, brazilian zouk, lambada, samba, soulzouk, hong kong dance class, partner dance, xina, laura'" },
      { name: "seo_og_image", definition: "VARCHAR(1000) NOT NULL DEFAULT ''" },
      { name: "seo_robots", definition: "VARCHAR(100) NOT NULL DEFAULT 'index, follow'" },
      { name: "google_site_verification", definition: "VARCHAR(255) NOT NULL DEFAULT ''" },
      { name: "seo_custom_tags", definition: "TEXT NULL" },
      { name: "hero_bg_type", definition: "VARCHAR(50) NOT NULL DEFAULT 'animation'" },
      { name: "hero_bg_image", definition: "VARCHAR(1000) NOT NULL DEFAULT ''" },
      { name: "hainan_logo_image", definition: "VARCHAR(1000) NOT NULL DEFAULT ''" },
      { name: "hainan_resort_image", definition: "VARCHAR(1000) NOT NULL DEFAULT ''" },
      { name: "hainan_room_image", definition: "VARCHAR(1000) NOT NULL DEFAULT ''" },
      { name: "hainan_beach_image", definition: "VARCHAR(1000) NOT NULL DEFAULT ''" },
      { name: "sections_order", definition: "TEXT NULL" }
    ];

    for (const col of newColumns) {
      try {
        const [existingCols] = await conn.query(`
          SHOW COLUMNS FROM site_frontpage_settings LIKE ?
        `, [col.name]) as any[];
        
        if (existingCols.length === 0) {
          console.log(`Adding column ${col.name} to site_frontpage_settings...`);
          await conn.query(`ALTER TABLE site_frontpage_settings ADD COLUMN ${col.name} ${col.definition}`);
        }
      } catch (colErr: any) {
        console.error(`Error verifying/adding column ${col.name}:`, colErr.message);
      }
    }

    // --- SEED TABLES IF EMPTY ---
    
    // Seed Admin Users
    const [adminRows] = await conn.query("SELECT * FROM admin_users LIMIT 1");
    if ((adminRows as any[]).length === 0) {
      await conn.query(`
        INSERT INTO admin_users (username, password, email)
        VALUES (?, ?, ?)
      `, ["claudiozouk", "@Soassim2535", "claudiozouk@gmail.com"]);
      console.log("Seeded default admin user claudiozouk");
    }

    // Seed Frontpage Settings
    const [frontpageRows] = await conn.query("SELECT * FROM site_frontpage_settings LIMIT 1");
    if ((frontpageRows as any[]).length === 0) {
      await conn.query(`
        INSERT INTO site_frontpage_settings (
          id, brand_name, brand_tagline, brand_description, brand_phone, brand_email, brand_locations,
          hero_title_line1, hero_title_line2, hero_title_line3, hero_subtitle, hero_cta_primary, hero_cta_secondary,
          hainan_badge, hainan_title, hainan_quote, hainan_link
        ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        "2inDance",
        "The Art of FusionDance in Motion",
        "Learn Brazilian Zouk, Lambada, and Samba with Xina and Laura in Hong Kong. Discover fluidity, harmony, and the joy of partner dancing.",
        "+852 9123 4567",
        "info@2indance.hk",
        "Hong Kong (Central • Sheung Wan • TST)",
        "Connection",
        "Flow & Fluid",
        "Soulzouk Methodology",
        "Learn the beautiful art of FusionDance in partner dance. Master the flow, physical conversation, and technique of Soulzouk in Hong Kong.",
        "Book a Trial Class",
        "Explore Classes",
        "Featured Global Event • March 2027",
        "Hainan Island Zouk Marathon",
        "Hainan Island — China's tropical paradise. White-sand beaches, green mountains, fresh seafood, and vibrant reefs set the stage for endless adventures, unforgettable nights of dance, and the taste of local flavors.",
        "https://hainanzouk.2indance.com"
      ]);
      console.log("Seeded default frontpage settings");
    }
    
    // Seed About Content
    const [aboutRows] = await conn.query("SELECT * FROM site_about_content LIMIT 1");
    if ((aboutRows as any[]).length === 0) {
      await conn.query(`
        INSERT INTO site_about_content (id, title, subtitle, storyTitle, storyText1, storyText2)
        VALUES (1, ?, ?, ?, ?, ?)
      `, [aboutContent.title, aboutContent.subtitle, aboutContent.storyTitle, aboutContent.storyText1, aboutContent.storyText2]);
    }

    // Seed Founders
    const [founderRows] = await conn.query("SELECT * FROM site_founders LIMIT 1");
    if ((founderRows as any[]).length === 0) {
      for (const founder of aboutContent.founders) {
        await conn.query(`
          INSERT INTO site_founders (name, role, bio, image)
          VALUES (?, ?, ?, ?)
        `, [founder.name, founder.role, founder.bio, founder.image]);
      }
    }

    // Seed Schedule
    const [schedRows] = await conn.query("SELECT * FROM site_weekly_schedule LIMIT 1");
    if ((schedRows as any[]).length === 0) {
      for (const item of weeklySchedule) {
        await conn.query(`
          INSERT INTO site_weekly_schedule (day, time, style, level, location, price)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [item.day, item.time, item.style, item.level, item.location, item.price]);
      }
    }

    // Seed Events
    const [eventRows] = await conn.query("SELECT * FROM site_upcoming_events LIMIT 1");
    if ((eventRows as any[]).length === 0) {
      for (const item of upcomingEvents) {
        await conn.query(`
          INSERT INTO site_upcoming_events (title, date, time, location, description, image, price)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [item.title, item.date, item.time, item.location, item.description, item.image, item.price]);
      }
    }

    // Seed Media
    const [medRows] = await conn.query("SELECT * FROM site_media_items LIMIT 1");
    if ((medRows as any[]).length === 0) {
      for (const item of mediaItems) {
        await conn.query(`
          INSERT INTO site_media_items (type, title, thumbnail, url, category)
          VALUES (?, ?, ?, ?, ?)
        `, [item.type, item.title, item.thumbnail, item.url || null, item.category]);
      }
    }

    // Seed News
    const [newsRows] = await conn.query("SELECT * FROM site_news_items LIMIT 1");
    if ((newsRows as any[]).length === 0) {
      for (const item of newsItems) {
        await conn.query(`
          INSERT INTO site_news_items (title, excerpt, content, date, author, image, category)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [item.title, item.excerpt, item.content, item.date, item.author, item.image, item.category]);
      }
    }

    console.log("Database tables initialized and seeded successfully!");
  } catch (err: any) {
    console.error("Database initialization failed:", err.message);
  }
}

// TRIGGER POOL INITIALIZATION
getDbPool();


// ==========================================
// REST API ENDPOINTS
// ==========================================

// 1. DATABASE STATUS & INFO
app.get("/api/db-status", async (req, res) => {
  try {
    const dbPool = await getDbPool();
    if (!dbPool) {
      res.status(200).json({ 
        connected: false, 
        message: "Using offline in-memory/static content mode. (Database unreachable/unauthorized)" 
      });
      return;
    }
    res.status(200).json({ 
      connected: true, 
      message: "Successfully connected to Hostinger MySQL database!",
      host: dbConfig.host,
      database: dbConfig.database
    });
  } catch (err: any) {
    res.status(200).json({ 
      connected: false, 
      message: "Offline mode. Connection failed: " + err.message 
    });
  }
});

// 2. ADMIN LOGIN
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const dbPool = await getDbPool();
    if (dbPool) {
      const [rows] = await dbPool.query(
        "SELECT * FROM admin_users WHERE username = ? OR email = ?", 
        [username, username]
      ) as any[];

      if (rows.length > 0) {
        const user = rows[0];
        if (password === user.password) {
          res.status(200).json({ 
            success: true, 
            token: "admin-secure-session-2indance-990717",
            user: { username: user.username, email: user.email || "claudiozouk@gmail.com" } 
          });
          return;
        }
      }
    }
  } catch (dbErr: any) {
    console.error("Database authentication query error:", dbErr.message);
  }

  // Static/Fallback authentication (original values and specified credentials)
  const adminUser = "admin";
  const adminEmail = "claudiozouk@gmail.com";
  const adminPass = process.env.DB_PASSWORD || "@Just990717@";

  if (
    ((username === adminUser || username === adminEmail) && password === adminPass) ||
    ((username === "claudiozouk" || username === "claudiozouk@gmail.com") && password === "@Soassim2535")
  ) {
    res.status(200).json({ 
      success: true, 
      token: "admin-secure-session-2indance-990717",
      user: { username: username === adminUser ? adminUser : "claudiozouk", email: adminEmail } 
    });
  } else {
    res.status(401).json({ success: false, error: "Invalid username or password." });
  }
});


// 2.5 FRONT-PAGE SETTINGS API
app.get("/api/frontpage", async (req, res) => {
  try {
    const dbPool = await getDbPool();
    if (!dbPool) {
      res.json({ success: true, isFallback: true, ...localFrontpage });
      return;
    }
    const [[data]] = await dbPool.query("SELECT * FROM site_frontpage_settings WHERE id = 1") as any[];
    if (!data) {
      res.json({ success: true, isFallback: true, ...localFrontpage });
      return;
    }
    res.json({ success: true, ...data });
  } catch (err: any) {
    res.json({ success: true, isFallback: true, ...localFrontpage });
  }
});

app.post("/api/frontpage", async (req, res) => {
  const {
    brand_name, brand_tagline, brand_description, brand_phone, brand_email, brand_locations,
    hero_title_line1, hero_title_line2, hero_title_line3, hero_subtitle, hero_cta_primary, hero_cta_secondary,
    hainan_badge, hainan_title, hainan_quote, hainan_link,
    social_instagram, social_facebook, social_youtube, social_whatsapp,
    footer_text, footer_disclaimer, logo_url, favicon_url,
    seo_title, seo_meta_description, seo_keywords, seo_og_image, seo_robots, google_site_verification, seo_custom_tags,
    hero_bg_type, hero_bg_image, hainan_logo_image, hainan_resort_image, hainan_room_image, hainan_beach_image, sections_order
  } = req.body;

  localFrontpage = {
    brand_name: brand_name !== undefined ? brand_name : localFrontpage.brand_name,
    brand_tagline: brand_tagline !== undefined ? brand_tagline : localFrontpage.brand_tagline,
    brand_description: brand_description !== undefined ? brand_description : localFrontpage.brand_description,
    brand_phone: brand_phone !== undefined ? brand_phone : localFrontpage.brand_phone,
    brand_email: brand_email !== undefined ? brand_email : localFrontpage.brand_email,
    brand_locations: brand_locations !== undefined ? brand_locations : localFrontpage.brand_locations,
    hero_title_line1: hero_title_line1 !== undefined ? hero_title_line1 : localFrontpage.hero_title_line1,
    hero_title_line2: hero_title_line2 !== undefined ? hero_title_line2 : localFrontpage.hero_title_line2,
    hero_title_line3: hero_title_line3 !== undefined ? hero_title_line3 : localFrontpage.hero_title_line3,
    hero_subtitle: hero_subtitle !== undefined ? hero_subtitle : localFrontpage.hero_subtitle,
    hero_cta_primary: hero_cta_primary !== undefined ? hero_cta_primary : localFrontpage.hero_cta_primary,
    hero_cta_secondary: hero_cta_secondary !== undefined ? hero_cta_secondary : localFrontpage.hero_cta_secondary,
    hainan_badge: hainan_badge !== undefined ? hainan_badge : localFrontpage.hainan_badge,
    hainan_title: hainan_title !== undefined ? hainan_title : localFrontpage.hainan_title,
    hainan_quote: hainan_quote !== undefined ? hainan_quote : localFrontpage.hainan_quote,
    hainan_link: hainan_link !== undefined ? hainan_link : localFrontpage.hainan_link,
    social_instagram: social_instagram !== undefined ? social_instagram : localFrontpage.social_instagram,
    social_facebook: social_facebook !== undefined ? social_facebook : localFrontpage.social_facebook,
    social_youtube: social_youtube !== undefined ? social_youtube : localFrontpage.social_youtube,
    social_whatsapp: social_whatsapp !== undefined ? social_whatsapp : localFrontpage.social_whatsapp,
    footer_text: footer_text !== undefined ? footer_text : localFrontpage.footer_text,
    footer_disclaimer: footer_disclaimer !== undefined ? footer_disclaimer : localFrontpage.footer_disclaimer,
    logo_url: logo_url !== undefined ? logo_url : localFrontpage.logo_url,
    favicon_url: favicon_url !== undefined ? favicon_url : localFrontpage.favicon_url,
    seo_title: seo_title !== undefined ? seo_title : localFrontpage.seo_title,
    seo_meta_description: seo_meta_description !== undefined ? seo_meta_description : localFrontpage.seo_meta_description,
    seo_keywords: seo_keywords !== undefined ? seo_keywords : localFrontpage.seo_keywords,
    seo_og_image: seo_og_image !== undefined ? seo_og_image : localFrontpage.seo_og_image,
    seo_robots: seo_robots !== undefined ? seo_robots : localFrontpage.seo_robots,
    google_site_verification: google_site_verification !== undefined ? google_site_verification : localFrontpage.google_site_verification,
    seo_custom_tags: seo_custom_tags !== undefined ? seo_custom_tags : localFrontpage.seo_custom_tags,
    hero_bg_type: hero_bg_type !== undefined ? hero_bg_type : localFrontpage.hero_bg_type,
    hero_bg_image: hero_bg_image !== undefined ? hero_bg_image : localFrontpage.hero_bg_image,
    hainan_logo_image: hainan_logo_image !== undefined ? hainan_logo_image : localFrontpage.hainan_logo_image,
    hainan_resort_image: hainan_resort_image !== undefined ? hainan_resort_image : localFrontpage.hainan_resort_image,
    hainan_room_image: hainan_room_image !== undefined ? hainan_room_image : localFrontpage.hainan_room_image,
    hainan_beach_image: hainan_beach_image !== undefined ? hainan_beach_image : localFrontpage.hainan_beach_image,
    sections_order: sections_order !== undefined ? sections_order : localFrontpage.sections_order
  };

  try {
    const dbPool = await getDbPool();
    if (dbPool) {
      await dbPool.query(`
        UPDATE site_frontpage_settings 
        SET brand_name = ?, brand_tagline = ?, brand_description = ?, brand_phone = ?, brand_email = ?, brand_locations = ?,
            hero_title_line1 = ?, hero_title_line2 = ?, hero_title_line3 = ?, hero_subtitle = ?, hero_cta_primary = ?, hero_cta_secondary = ?,
            hainan_badge = ?, hainan_title = ?, hainan_quote = ?, hainan_link = ?,
            social_instagram = ?, social_facebook = ?, social_youtube = ?, social_whatsapp = ?,
            footer_text = ?, footer_disclaimer = ?, logo_url = ?, favicon_url = ?,
            seo_title = ?, seo_meta_description = ?, seo_keywords = ?, seo_og_image = ?, seo_robots = ?, google_site_verification = ?, seo_custom_tags = ?,
            hero_bg_type = ?, hero_bg_image = ?, hainan_logo_image = ?, hainan_resort_image = ?, hainan_room_image = ?, hainan_beach_image = ?, sections_order = ?
        WHERE id = 1
      `, [
        localFrontpage.brand_name, localFrontpage.brand_tagline, localFrontpage.brand_description, localFrontpage.brand_phone, localFrontpage.brand_email, localFrontpage.brand_locations,
        localFrontpage.hero_title_line1, localFrontpage.hero_title_line2, localFrontpage.hero_title_line3, localFrontpage.hero_subtitle, localFrontpage.hero_cta_primary, localFrontpage.hero_cta_secondary,
        localFrontpage.hainan_badge, localFrontpage.hainan_title, localFrontpage.hainan_quote, localFrontpage.hainan_link,
        localFrontpage.social_instagram, localFrontpage.social_facebook, localFrontpage.social_youtube, localFrontpage.social_whatsapp,
        localFrontpage.footer_text, localFrontpage.footer_disclaimer, localFrontpage.logo_url, localFrontpage.favicon_url,
        localFrontpage.seo_title, localFrontpage.seo_meta_description, localFrontpage.seo_keywords, localFrontpage.seo_og_image, localFrontpage.seo_robots, localFrontpage.google_site_verification, localFrontpage.seo_custom_tags,
        localFrontpage.hero_bg_type, localFrontpage.hero_bg_image, localFrontpage.hainan_logo_image, localFrontpage.hainan_resort_image, localFrontpage.hainan_room_image, localFrontpage.hainan_beach_image, localFrontpage.sections_order
      ]);
    }
    res.json({ success: true, message: "Frontpage settings updated successfully!" });
  } catch (err: any) {
    res.json({ success: true, error: "Saved locally, but failed to write to MySQL: " + err.message });
  }
});


// 3. ABOUT CONTENT & FOUNDERS API
app.get("/api/about", async (req, res) => {
  try {
    const dbPool = await getDbPool();
    if (!dbPool) {
      res.json({ success: true, isFallback: true, ...localAbout });
      return;
    }

    const [[aboutData]] = await dbPool.query("SELECT * FROM site_about_content WHERE id = 1") as any[];
    const [founders] = await dbPool.query("SELECT * FROM site_founders") as any[];

    if (!aboutData) {
      res.json({ success: true, isFallback: true, ...localAbout });
      return;
    }

    res.json({
      success: true,
      title: aboutData.title,
      subtitle: aboutData.subtitle,
      storyTitle: aboutData.storyTitle,
      storyText1: aboutData.storyText1,
      storyText2: aboutData.storyText2,
      founders: founders,
      stats: localAbout.stats // Keep default stats array or return it
    });
  } catch (err: any) {
    res.json({ success: true, isFallback: true, ...localAbout });
  }
});

app.post("/api/about", async (req, res) => {
  const { title, subtitle, storyTitle, storyText1, storyText2 } = req.body;
  
  // Update local memory always
  localAbout = {
    ...localAbout,
    title: title || localAbout.title,
    subtitle: subtitle || localAbout.subtitle,
    storyTitle: storyTitle || localAbout.storyTitle,
    storyText1: storyText1 || localAbout.storyText1,
    storyText2: storyText2 || localAbout.storyText2,
  };

  try {
    const dbPool = await getDbPool();
    if (dbPool) {
      await dbPool.query(`
        UPDATE site_about_content 
        SET title = ?, subtitle = ?, storyTitle = ?, storyText1 = ?, storyText2 = ?
        WHERE id = 1
      `, [title, subtitle, storyTitle, storyText1, storyText2]);
    }
    res.json({ success: true, message: "About content updated successfully!" });
  } catch (err: any) {
    res.json({ success: true, error: "Saved locally, but failed to write to MySQL: " + err.message });
  }
});

// Founders CRUD
app.post("/api/founders", async (req, res) => {
  const { name, role, bio, image } = req.body;
  try {
    const dbPool = await getDbPool();
    if (dbPool) {
      const [result] = await dbPool.query(`
        INSERT INTO site_founders (name, role, bio, image) VALUES (?, ?, ?, ?)
      `, [name, role, bio, image]);
      res.json({ success: true, id: (result as any).insertId });
    } else {
      const newItem = { id: String(Date.now()), name, role, bio, image };
      localAbout.founders.push(newItem as any);
      res.json({ success: true, id: newItem.id });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put("/api/founders/:id", async (req, res) => {
  const { id } = req.params;
  const { name, role, bio, image } = req.body;
  try {
    const dbPool = await getDbPool();
    if (dbPool) {
      await dbPool.query(`
        UPDATE site_founders SET name = ?, role = ?, bio = ?, image = ? WHERE id = ?
      `, [name, role, bio, image, id]);
      res.json({ success: true });
    } else {
      localAbout.founders = localAbout.founders.map(f => f.name === name ? { name, role, bio, image } : f);
      res.json({ success: true });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/founders/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const dbPool = await getDbPool();
    if (dbPool) {
      await dbPool.query("DELETE FROM site_founders WHERE id = ?", [id]);
      res.json({ success: true });
    } else {
      res.json({ success: true, message: "Offline mode deletion - refresh will restore static assets." });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// 4. WEEKLY SCHEDULE API
app.get("/api/schedule", async (req, res) => {
  try {
    const dbPool = await getDbPool();
    if (!dbPool) {
      res.json(localSchedule);
      return;
    }
    const [rows] = await dbPool.query("SELECT * FROM site_weekly_schedule ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    res.json(localSchedule);
  }
});

app.post("/api/schedule", async (req, res) => {
  const { day, time, style, level, location, price } = req.body;
  try {
    const dbPool = await getDbPool();
    if (dbPool) {
      const [result] = await dbPool.query(`
        INSERT INTO site_weekly_schedule (day, time, style, level, location, price)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [day, time, style, level, location, price]);
      res.json({ success: true, id: (result as any).insertId });
    } else {
      const newItem = { id: "offline-" + Date.now(), day, time, style, level, location, price };
      localSchedule.push(newItem);
      res.json({ success: true, id: newItem.id });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put("/api/schedule/:id", async (req, res) => {
  const { id } = req.params;
  const { day, time, style, level, location, price } = req.body;
  try {
    const dbPool = await getDbPool();
    if (dbPool) {
      await dbPool.query(`
        UPDATE site_weekly_schedule SET day = ?, time = ?, style = ?, level = ?, location = ?, price = ?
        WHERE id = ?
      `, [day, time, style, level, location, price, id]);
      res.json({ success: true });
    } else {
      localSchedule = localSchedule.map(item => item.id === id ? { id, day, time, style, level, location, price } : item);
      res.json({ success: true });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/schedule/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const dbPool = await getDbPool();
    if (dbPool) {
      await dbPool.query("DELETE FROM site_weekly_schedule WHERE id = ?", [id]);
    } else {
      localSchedule = localSchedule.filter(item => item.id !== id);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// 5. UPCOMING EVENTS API
app.get("/api/events", async (req, res) => {
  try {
    const dbPool = await getDbPool();
    if (!dbPool) {
      res.json(localEvents);
      return;
    }
    const [rows] = await dbPool.query("SELECT * FROM site_upcoming_events ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.json(localEvents);
  }
});

app.post("/api/events", async (req, res) => {
  const { title, date, time, location, description, image, price } = req.body;
  try {
    const dbPool = await getDbPool();
    if (dbPool) {
      const [result] = await dbPool.query(`
        INSERT INTO site_upcoming_events (title, date, time, location, description, image, price)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [title, date, time, location, description, image, price]);
      res.json({ success: true, id: (result as any).insertId });
    } else {
      const newItem = { id: "offline-" + Date.now(), title, date, time, location, description, image, price };
      localEvents.push(newItem);
      res.json({ success: true, id: newItem.id });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put("/api/events/:id", async (req, res) => {
  const { id } = req.params;
  const { title, date, time, location, description, image, price } = req.body;
  try {
    const dbPool = await getDbPool();
    if (dbPool) {
      await dbPool.query(`
        UPDATE site_upcoming_events SET title = ?, date = ?, time = ?, location = ?, description = ?, image = ?, price = ?
        WHERE id = ?
      `, [title, date, time, location, description, image, price, id]);
      res.json({ success: true });
    } else {
      localEvents = localEvents.map(item => item.id === id ? { id, title, date, time, location, description, image, price } : item);
      res.json({ success: true });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/events/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const dbPool = await getDbPool();
    if (dbPool) {
      await dbPool.query("DELETE FROM site_upcoming_events WHERE id = ?", [id]);
    } else {
      localEvents = localEvents.filter(item => item.id !== id);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// 6. MEDIA GALLERY API
app.get("/api/media", async (req, res) => {
  try {
    const dbPool = await getDbPool();
    if (!dbPool) {
      res.json(localMedia);
      return;
    }
    const [rows] = await dbPool.query("SELECT * FROM site_media_items ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.json(localMedia);
  }
});

app.post("/api/media", async (req, res) => {
  const { type, title, thumbnail, url, category } = req.body;
  try {
    const dbPool = await getDbPool();
    if (dbPool) {
      const [result] = await dbPool.query(`
        INSERT INTO site_media_items (type, title, thumbnail, url, category)
        VALUES (?, ?, ?, ?, ?)
      `, [type, title, thumbnail, url || null, category]);
      res.json({ success: true, id: (result as any).insertId });
    } else {
      const newItem = { id: "offline-" + Date.now(), type, title, thumbnail, url, category };
      localMedia.push(newItem as any);
      res.json({ success: true, id: newItem.id });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put("/api/media/:id", async (req, res) => {
  const { id } = req.params;
  const { type, title, thumbnail, url, category } = req.body;
  try {
    const dbPool = await getDbPool();
    if (dbPool) {
      await dbPool.query(`
        UPDATE site_media_items SET type = ?, title = ?, thumbnail = ?, url = ?, category = ?
        WHERE id = ?
      `, [type, title, thumbnail, url, category, id]);
      res.json({ success: true });
    } else {
      localMedia = localMedia.map(item => item.id === id ? { id, type, title, thumbnail, url, category } as any : item);
      res.json({ success: true });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/media/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const dbPool = await getDbPool();
    if (dbPool) {
      await dbPool.query("DELETE FROM site_media_items WHERE id = ?", [id]);
    } else {
      localMedia = localMedia.filter(item => item.id !== id);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// 7. NEWS ARTICLES API
app.get("/api/news", async (req, res) => {
  try {
    const dbPool = await getDbPool();
    if (!dbPool) {
      res.json(localNews);
      return;
    }
    const [rows] = await dbPool.query("SELECT * FROM site_news_items ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.json(localNews);
  }
});

app.post("/api/news", async (req, res) => {
  const { title, excerpt, content, date, author, image, category } = req.body;
  try {
    const dbPool = await getDbPool();
    if (dbPool) {
      const [result] = await dbPool.query(`
        INSERT INTO site_news_items (title, excerpt, content, date, author, image, category)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [title, excerpt, content, date, author, image, category]);
      res.json({ success: true, id: (result as any).insertId });
    } else {
      const newItem = { id: "offline-" + Date.now(), title, excerpt, content, date, author, image, category };
      localNews.push(newItem);
      res.json({ success: true, id: newItem.id });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put("/api/news/:id", async (req, res) => {
  const { id } = req.params;
  const { title, excerpt, content, date, author, image, category } = req.body;
  try {
    const dbPool = await getDbPool();
    if (dbPool) {
      await dbPool.query(`
        UPDATE site_news_items SET title = ?, excerpt = ?, content = ?, date = ?, author = ?, image = ?, category = ?
        WHERE id = ?
      `, [title, excerpt, content, date, author, image, category, id]);
      res.json({ success: true });
    } else {
      localNews = localNews.map(item => item.id === id ? { id, title, excerpt, content, date, author, image, category } : item);
      res.json({ success: true });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/news/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const dbPool = await getDbPool();
    if (dbPool) {
      await dbPool.query("DELETE FROM site_news_items WHERE id = ?", [id]);
    } else {
      localNews = localNews.filter(item => item.id !== id);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// 8. SUBMISSIONS LIST
app.get("/api/submissions", async (req, res) => {
  try {
    const dbPool = await getDbPool();
    if (!dbPool) {
      res.json(localSubmissions);
      return;
    }
    const [rows] = await dbPool.query("SELECT * FROM contact_submissions ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.json(localSubmissions);
  }
});

app.delete("/api/submissions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const dbPool = await getDbPool();
    if (dbPool) {
      await dbPool.query("DELETE FROM contact_submissions WHERE id = ?", [id]);
    } else {
      localSubmissions = localSubmissions.filter(item => item.id !== parseInt(id));
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// ==========================================
// MEDIA FILE UPLOADS & SERVING
// ==========================================

// Create uploads directory if it does not exist
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Media & Uploads Safety (Modo Restrito)
// By default, enabled (true) unless explicitly configured as "false"
const restrictedMediaMode = process.env.RESTRICTED_MEDIA_MODE !== "false";
console.log(`[Media Protection] Modo Restrito (Restricted Media Mode): ${restrictedMediaMode ? "ENABLED (ACTIVE)" : "DISABLED"}`);

// Serve /uploads statically so that the uploaded photos are visible everywhere
app.use("/uploads", express.static(uploadsDir));

// Endpoint to upload a Base64 image
app.post("/api/upload", async (req, res) => {
  try {
    const { image, filename } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, error: "Missing image data in body" });
    }

    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Match base64 data header
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let dataBuffer: Buffer;
    let extension = "png";

    if (matches && matches.length === 3) {
      const mimeType = matches[1];
      const base64Data = matches[2];
      dataBuffer = Buffer.from(base64Data, 'base64');
      
      if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
        extension = "jpg";
      } else if (mimeType.includes("png")) {
        extension = "png";
      } else if (mimeType.includes("webp")) {
        extension = "webp";
      } else if (mimeType.includes("svg")) {
        extension = "svg";
      } else if (mimeType.includes("gif")) {
        extension = "gif";
      } else if (mimeType.includes("x-icon") || mimeType.includes("microsoft")) {
        extension = "ico";
      }
    } else {
      dataBuffer = Buffer.from(image, 'base64');
    }

    const cleanFilename = (filename || "upload").replace(/[^a-z0-9\._-]/gi, '_');
    let finalFilename = `${Date.now()}_${cleanFilename.endsWith(`.${extension}`) ? cleanFilename : `${cleanFilename}.${extension}`}`;
    let filePath = path.join(uploadsDir, finalFilename);

    // If restricted mode is enabled, guarantee that we NEVER overwrite an existing file
    if (restrictedMediaMode && fs.existsSync(filePath)) {
      const randomSuffix = Math.floor(Math.random() * 10000);
      finalFilename = `${Date.now()}_${randomSuffix}_${cleanFilename.endsWith(`.${extension}`) ? cleanFilename : `${cleanFilename}.${extension}`}`;
      filePath = path.join(uploadsDir, finalFilename);
    }

    await fs.promises.writeFile(filePath, dataBuffer);

    const url = `/uploads/${finalFilename}`;
    console.log(`[Media Server] Successfully saved file to: ${url}`);
    res.json({ success: true, url, filename: finalFilename });
  } catch (err: any) {
    console.error("[Media Server] Error handling file upload:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint to fetch list of uploaded images
app.get("/api/uploaded-media", async (req, res) => {
  try {
    if (!fs.existsSync(uploadsDir)) {
      return res.json([]);
    }
    const files = await fs.promises.readdir(uploadsDir);
    const list = files
      .filter(f => /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(f))
      .map(f => {
        const stats = fs.statSync(path.join(uploadsDir, f));
        return {
          name: f,
          url: `/uploads/${f}`,
          time: stats.mtimeMs,
          size: stats.size
        };
      })
      .sort((a, b) => b.time - a.time);
    res.json(list);
  } catch (err) {
    console.error("[Media Server] Error reading uploads folder:", err);
    res.json([]);
  }
});

// Endpoint to check media server status and restricted mode
app.get("/api/media-status", (req, res) => {
  res.json({
    success: true,
    restricted_mode: restrictedMediaMode,
    uploads_dir_exists: fs.existsSync(uploadsDir),
    message: restrictedMediaMode 
      ? "Modo Restrito está ATIVO. Os arquivos de mídia estão protegidos contra deleção ou sobrescrita acidental." 
      : "Modo Restrito está desativado."
  });
});


// Setup Vite middleware in dev mode
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

initServer();
