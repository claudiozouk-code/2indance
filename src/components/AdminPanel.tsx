import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  User, 
  LogOut, 
  Sparkles, 
  Edit, 
  Trash2, 
  Plus, 
  Save, 
  X, 
  Check, 
  FileText, 
  Calendar, 
  Clock, 
  Video, 
  Image as ImageIcon, 
  MapPin, 
  DollarSign, 
  Users, 
  BookOpen, 
  HelpCircle,
  Database,
  Mail,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ShieldCheck
} from "lucide-react";
import MediaPicker from "./MediaPicker";

const DEFAULT_SECTIONS = [
  { id: "hero", name: "Hero Section", visible: true, zIndex: 10, effect: "hero" },
  { id: "about", name: "About Us", visible: true, zIndex: 20, effect: "zoom-in" },
  { id: "classes-events", name: "Weekly Classes & Events", visible: true, zIndex: 30, effect: "slide-left" },
  { id: "media", name: "Media & Gallery", visible: true, zIndex: 35, effect: "zoom-out" },
  { id: "news", name: "News & Articles", visible: true, zIndex: 40, effect: "slide-right" },
  { id: "hainan", name: "Hainan Zouk Marathon", visible: true, zIndex: 43, effect: "zoom-in" },
  { id: "contact", name: "Contact & Booking", visible: true, zIndex: 48, effect: "3d-rise" }
];

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Helper to parse sections order
  const getSectionsList = () => {
    try {
      const parsed = JSON.parse(frontpageForm.sections_order || "[]");
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge with default list to handle any added or missing sections
        const merged = parsed.map((item: any) => {
          const def = DEFAULT_SECTIONS.find(d => d.id === item.id);
          return { ...def, ...item };
        });
        DEFAULT_SECTIONS.forEach(def => {
          if (!merged.some((m: any) => m.id === def.id)) {
            merged.push(def);
          }
        });
        return merged;
      }
    } catch (e) {}
    return DEFAULT_SECTIONS;
  };

  const updateSectionsList = (newList: any[]) => {
    const serialized = JSON.stringify(newList.map(item => ({ id: item.id, visible: item.visible, zIndex: item.zIndex, effect: item.effect })));
    setFrontpageForm({ ...frontpageForm, sections_order: serialized });
  };

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const list = [...getSectionsList()];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    
    // Swap items
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // Recalculate zIndex values to preserve scroll layering
    list.forEach((item, idx) => {
      item.zIndex = 10 + idx * 5;
    });

    updateSectionsList(list);
  };

  const handleToggleSectionVisibility = (index: number) => {
    const list = [...getSectionsList()];
    list[index].visible = list[index].visible === false ? true : false;
    updateSectionsList(list);
  };

  // DB connection status
  const [dbStatus, setDbStatus] = useState({ connected: false, message: "" });
  const [isCheckingDb, setIsCheckingDb] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<"frontpage" | "about" | "schedule" | "events" | "media" | "news" | "submissions" | "global_settings">("frontpage");

  // State arrays fetched from API
  const [aboutData, setAboutData] = useState<any>({
    title: "",
    subtitle: "",
    storyTitle: "",
    storyText1: "",
    storyText2: "",
    founders: []
  });

  const [frontpageForm, setFrontpageForm] = useState<any>({
    brand_name: "",
    brand_tagline: "",
    brand_description: "",
    brand_phone: "",
    brand_email: "",
    brand_locations: "",
    hero_title_line1: "",
    hero_title_line2: "",
    hero_title_line3: "",
    hero_subtitle: "",
    hero_cta_primary: "",
    hero_cta_secondary: "",
    hainan_badge: "",
    hainan_title: "",
    hainan_quote: "",
    hainan_link: "",
    social_instagram: "",
    social_facebook: "",
    social_youtube: "",
    social_whatsapp: "",
    footer_text: "",
    footer_disclaimer: "",
    logo_url: "",
    favicon_url: "",
    seo_title: "",
    seo_meta_description: "",
    seo_keywords: "",
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
  });

  const [scheduleList, setScheduleList] = useState<any[]>([]);
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [eventGalleriesList, setEventGalleriesList] = useState<any[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [submissionsList, setSubmissionsList] = useState<any[]>([]);

  // Loading indicator states
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error" | ""; msg: string }>({ type: "", msg: "" });

  // Modals / Adding states
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [modalType, setModalType] = useState<"founder" | "schedule" | "event" | "media" | "eventGallery" | "news" | "">("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Field States
  const [founderForm, setFounderForm] = useState({ id: "", name: "", role: "", bio: "", image: "" });
  const [scheduleForm, setScheduleForm] = useState({ id: "", day: "Monday", time: "", style: "", level: "", location: "", price: "" });
  const [eventForm, setEventForm] = useState({ id: "", title: "", date: "", time: "", location: "", description: "", image: "", price: "" });
  const [mediaForm, setMediaForm] = useState({ id: "", type: "photo", title: "", thumbnail: "", url: "", category: "Class Highlight" });
  const [eventGalleryForm, setEventGalleryForm] = useState({
    id: "",
    title: "",
    date: "",
    location: "",
    category: "Marathon",
    coverImage: "",
    description: "",
    photosText: ""
  });
  const [newsForm, setNewsForm] = useState({ id: "", title: "", excerpt: "", content: "", date: "", author: "2inDance Team", image: "", category: "Announcement" });

  useEffect(() => {
    // Check local storage for pre-existing session
    const token = localStorage.getItem("admin_token");
    if (token) {
      setIsAuthenticated(true);
      fetchDbStatus();
      fetchAllData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("admin_token", data.token);
        setIsAuthenticated(true);
        fetchDbStatus();
        fetchAllData();
      } else {
        setLoginError(data.error || "Login falhou. Verifique os dados.");
      }
    } catch (err) {
      setLoginError("Erro ao se conectar com o servidor.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
  };

  const fetchDbStatus = async () => {
    setIsCheckingDb(true);
    try {
      const res = await fetch("/api/db-status");
      const data = await res.json();
      setDbStatus({ connected: data.connected, message: data.message });
    } catch (err) {
      setDbStatus({ connected: false, message: "Could not poll database status." });
    } finally {
      setIsCheckingDb(false);
    }
  };

  const handleTestDbConnection = async () => {
    setIsCheckingDb(true);
    try {
      const res = await fetch("/api/db-test", { method: "POST" });
      const data = await res.json();
      if (data.connected) {
        setDbStatus({ connected: true, message: data.message });
        triggerAlert("success", "MySQL Conectado! " + data.message);
        fetchAllData();
      } else {
        setDbStatus({ connected: false, message: "Modo Offline: " + (data.error || "Banco de dados indisponível") });
        triggerAlert("error", "Erro MySQL: " + (data.error || "Acesso remoto negado. Verifique o Remote MySQL no painel Hostinger."));
      }
    } catch (err: any) {
      triggerAlert("error", "Erro ao testar conexão: " + err.message);
    } finally {
      setIsCheckingDb(false);
    }
  };

  const fetchAllData = async () => {
    setIsLoadingData(true);
    try {
      const [resAbout, resSched, resEvt, resMed, resGalleries, resNews, resSub, resFrontpage] = await Promise.all([
        fetch("/api/about"),
        fetch("/api/schedule"),
        fetch("/api/events"),
        fetch("/api/media"),
        fetch("/api/event-galleries"),
        fetch("/api/news"),
        fetch("/api/submissions"),
        fetch("/api/frontpage")
      ]);

      const about = await resAbout.json();
      const sched = await resSched.json();
      const evt = await resEvt.json();
      const med = await resMed.json();
      const galleries = await resGalleries.json();
      const news = await resNews.json();
      const subs = await resSub.json();
      const frontpage = await resFrontpage.json();

      setAboutData(about);
      setScheduleList(sched);
      setEventsList(evt);
      setMediaList(med);
      if (Array.isArray(galleries)) setEventGalleriesList(galleries);
      setNewsList(news);
      setSubmissionsList(subs);
      
      if (frontpage) {
        setFrontpageForm({
          brand_name: frontpage.brand_name || "",
          brand_tagline: frontpage.brand_tagline || "",
          brand_description: frontpage.brand_description || "",
          brand_phone: frontpage.brand_phone || "",
          brand_email: frontpage.brand_email || "",
          brand_locations: frontpage.brand_locations || "",
          hero_title_line1: frontpage.hero_title_line1 || "",
          hero_title_line2: frontpage.hero_title_line2 || "",
          hero_title_line3: frontpage.hero_title_line3 || "",
          hero_subtitle: frontpage.hero_subtitle || "",
          hero_cta_primary: frontpage.hero_cta_primary || "",
          hero_cta_secondary: frontpage.hero_cta_secondary || "",
          hainan_badge: frontpage.hainan_badge || "",
          hainan_title: frontpage.hainan_title || "",
          hainan_quote: frontpage.hainan_quote || "",
          hainan_link: frontpage.hainan_link || "",
          social_instagram: frontpage.social_instagram || "",
          social_facebook: frontpage.social_facebook || "",
          social_youtube: frontpage.social_youtube || "",
          social_whatsapp: frontpage.social_whatsapp || "",
          footer_text: frontpage.footer_text || "",
          footer_disclaimer: frontpage.footer_disclaimer || "",
          logo_url: frontpage.logo_url || "",
          favicon_url: frontpage.favicon_url || "",
          seo_title: frontpage.seo_title || "",
          seo_meta_description: frontpage.seo_meta_description || "",
          seo_keywords: frontpage.seo_keywords || "",
          seo_og_image: frontpage.seo_og_image || "",
          seo_robots: frontpage.seo_robots || "index, follow",
          google_site_verification: frontpage.google_site_verification || "",
          seo_custom_tags: frontpage.seo_custom_tags || "",
          hero_bg_type: frontpage.hero_bg_type || "animation",
          hero_bg_image: frontpage.hero_bg_image || "",
          hainan_logo_image: frontpage.hainan_logo_image || "",
          hainan_resort_image: frontpage.hainan_resort_image || "",
          hainan_room_image: frontpage.hainan_room_image || "",
          hainan_beach_image: frontpage.hainan_beach_image || "",
          sections_order: frontpage.sections_order || "[]"
        });
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const triggerAlert = (type: "success" | "error", msg: string) => {
    setSaveStatus({ type, msg });
    setTimeout(() => setSaveStatus({ type: "", msg: "" }), 4000);
  };

  // --- SAVE FRONTPAGE CONTENT ---
  const handleSaveFrontpageContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/frontpage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(frontpageForm)
      });
      const data = await res.json();
      if (res.ok) {
        triggerAlert("success", "Frontpage settings updated successfully!");
        fetchAllData();
      } else {
        triggerAlert("error", data.error || "Error saving frontpage content.");
      }
    } catch (err) {
      triggerAlert("error", "Connection error while saving frontpage.");
    }
  };

  // --- SAVE ABOUT CONTENT ---
  const handleSaveAboutContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: aboutData.title,
          subtitle: aboutData.subtitle,
          storyTitle: aboutData.storyTitle,
          storyText1: aboutData.storyText1,
          storyText2: aboutData.storyText2
        })
      });
      const data = await res.json();
      if (res.ok) {
        triggerAlert("success", "Conteúdo 'About Us' atualizado com sucesso!");
        fetchAllData();
      } else {
        triggerAlert("error", data.error || "Erro ao salvar conteúdo.");
      }
    } catch (err) {
      triggerAlert("error", "Erro de conexão ao salvar.");
    }
  };

  // --- FOUNDERS CRUD ---
  const handleOpenFounderModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setFounderForm({
        id: item.id || "",
        name: item.name,
        role: item.role,
        bio: item.bio,
        image: item.image
      });
    } else {
      setEditingItem(null);
      setFounderForm({ id: "", name: "", role: "", bio: "", image: "" });
    }
    setModalType("founder");
    setIsModalOpen(true);
  };

  const handleSaveFounder = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingItem;
    const url = isEdit ? `/api/founders/${editingItem.id}` : "/api/founders";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(founderForm)
      });
      if (res.ok) {
        triggerAlert("success", isEdit ? "Instrutor atualizado!" : "Novo instrutor adicionado!");
        setIsModalOpen(false);
        fetchAllData();
      } else {
        triggerAlert("error", "Erro ao salvar dados do instrutor.");
      }
    } catch (err) {
      triggerAlert("error", "Erro de rede.");
    }
  };

  const handleDeleteFounder = async (id: any) => {
    if (!confirm("Tem certeza que deseja remover este instrutor?")) return;
    try {
      const res = await fetch(`/api/founders/${id}`, { method: "DELETE" });
      if (res.ok) {
        triggerAlert("success", "Instrutor removido com sucesso.");
        fetchAllData();
      } else {
        triggerAlert("error", "Falha ao deletar.");
      }
    } catch (err) {
      triggerAlert("error", "Erro de rede.");
    }
  };

  // --- SCHEDULE CRUD ---
  const handleOpenScheduleModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setScheduleForm({
        id: item.id || "",
        day: item.day,
        time: item.time,
        style: item.style,
        level: item.level,
        location: item.location,
        price: item.price
      });
    } else {
      setEditingItem(null);
      setScheduleForm({ id: "", day: "Monday", time: "", style: "", level: "", location: "", price: "HK$150" });
    }
    setModalType("schedule");
    setIsModalOpen(true);
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingItem;
    const url = isEdit ? `/api/schedule/${editingItem.id}` : "/api/schedule";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleForm)
      });
      if (res.ok) {
        triggerAlert("success", isEdit ? "Aula atualizada!" : "Nova aula adicionada!");
        setIsModalOpen(false);
        fetchAllData();
      } else {
        triggerAlert("error", "Erro ao salvar aula.");
      }
    } catch (err) {
      triggerAlert("error", "Erro de conexão.");
    }
  };

  const handleDeleteSchedule = async (id: any) => {
    if (!confirm("Deletar esta aula do cronograma?")) return;
    try {
      const res = await fetch(`/api/schedule/${id}`, { method: "DELETE" });
      if (res.ok) {
        triggerAlert("success", "Aula removida com sucesso.");
        fetchAllData();
      } else {
        triggerAlert("error", "Falha ao deletar.");
      }
    } catch (err) {
      triggerAlert("error", "Erro de rede.");
    }
  };

  // --- EVENTS CRUD ---
  const handleOpenEventModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setEventForm({
        id: item.id || "",
        title: item.title,
        date: item.date,
        time: item.time,
        location: item.location,
        description: item.description,
        image: item.image,
        price: item.price
      });
    } else {
      setEditingItem(null);
      setEventForm({
        id: "",
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800",
        price: ""
      });
    }
    setModalType("event");
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingItem;
    const url = isEdit ? `/api/events/${editingItem.id}` : "/api/events";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventForm)
      });
      if (res.ok) {
        triggerAlert("success", isEdit ? "Workshop/Festa atualizado!" : "Novo evento criado!");
        setIsModalOpen(false);
        fetchAllData();
      } else {
        triggerAlert("error", "Erro ao salvar workshop.");
      }
    } catch (err) {
      triggerAlert("error", "Erro de conexão.");
    }
  };

  const handleDeleteEvent = async (id: any) => {
    if (!confirm("Remover este workshop/evento?")) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        triggerAlert("success", "Evento removido.");
        fetchAllData();
      }
    } catch (err) {
      triggerAlert("error", "Erro de rede.");
    }
  };

  // --- MEDIA CRUD ---
  const handleOpenMediaModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setMediaForm({
        id: item.id || "",
        type: item.type,
        title: item.title,
        thumbnail: item.thumbnail,
        url: item.url || "",
        category: item.category
      });
    } else {
      setEditingItem(null);
      setMediaForm({
        id: "",
        type: "photo",
        title: "",
        thumbnail: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800",
        url: "",
        category: "Class Highlight"
      });
    }
    setModalType("media");
    setIsModalOpen(true);
  };

  const handleSaveMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingItem;
    const url = isEdit ? `/api/media/${editingItem.id}` : "/api/media";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mediaForm)
      });
      if (res.ok) {
        triggerAlert("success", isEdit ? "Mídia editada!" : "Nova mídia adicionada!");
        setIsModalOpen(false);
        fetchAllData();
      }
    } catch (err) {
      triggerAlert("error", "Erro de rede.");
    }
  };

  const handleDeleteMedia = async (id: any) => {
    if (!confirm("Deletar item da galeria?")) return;
    try {
      await fetch(`/api/media/${id}`, { method: "DELETE" });
      triggerAlert("success", "Item de mídia excluído.");
      fetchAllData();
    } catch (err) {
      triggerAlert("error", "Erro.");
    }
  };

  // --- EVENT GALLERIES CRUD ---
  const handleOpenEventGalleryModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      const photosText = Array.isArray(item.photos)
        ? item.photos.map((p: any) => typeof p === "string" ? p : p.url).join("\n")
        : "";
      setEventGalleryForm({
        id: item.id || "",
        title: item.title || "",
        date: item.date || "",
        location: item.location || "",
        category: item.category || "Marathon",
        coverImage: item.coverImage || "",
        description: item.description || "",
        photosText
      });
    } else {
      setEditingItem(null);
      setEventGalleryForm({
        id: "",
        title: "",
        date: "",
        location: "",
        category: "Marathon",
        coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000",
        description: "",
        photosText: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000\nhttps://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=1000\nhttps://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000"
      });
    }
    setModalType("eventGallery");
    setIsModalOpen(true);
  };

  const handleSaveEventGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingItem;
    const url = isEdit ? `/api/event-galleries/${editingItem.id}` : "/api/event-galleries";
    const method = isEdit ? "PUT" : "POST";

    const photosList = eventGalleryForm.photosText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((urlStr, idx) => ({
        id: `p-${Date.now()}-${idx}`,
        url: urlStr,
        title: `Foto ${idx + 1}`
      }));

    const payload = {
      title: eventGalleryForm.title,
      date: eventGalleryForm.date,
      location: eventGalleryForm.location,
      category: eventGalleryForm.category,
      coverImage: eventGalleryForm.coverImage,
      description: eventGalleryForm.description,
      photos: photosList
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        triggerAlert("success", isEdit ? "Galeria editada!" : "Nova galeria criada!");
        setIsModalOpen(false);
        fetchAllData();
      }
    } catch (err) {
      triggerAlert("error", "Erro de rede ao salvar galeria.");
    }
  };

  const handleDeleteEventGallery = async (id: any) => {
    if (!confirm("Deletar esta galeria de evento?")) return;
    try {
      await fetch(`/api/event-galleries/${id}`, { method: "DELETE" });
      triggerAlert("success", "Galeria excluída.");
      fetchAllData();
    } catch (err) {
      triggerAlert("error", "Erro de rede.");
    }
  };

  // --- NEWS CRUD ---
  const handleOpenNewsModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setNewsForm({
        id: item.id || "",
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        date: item.date,
        author: item.author,
        image: item.image,
        category: item.category
      });
    } else {
      setEditingItem(null);
      setNewsForm({
        id: "",
        title: "",
        excerpt: "",
        content: "",
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        author: "2inDance Team",
        image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&q=80&w=800",
        category: "Announcement"
      });
    }
    setModalType("news");
    setIsModalOpen(true);
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingItem;
    const url = isEdit ? `/api/news/${editingItem.id}` : "/api/news";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newsForm)
      });
      if (res.ok) {
        triggerAlert("success", isEdit ? "Artigo atualizado!" : "Novo post publicado!");
        setIsModalOpen(false);
        fetchAllData();
      }
    } catch (err) {
      triggerAlert("error", "Erro de rede.");
    }
  };

  const handleDeleteNews = async (id: any) => {
    if (!confirm("Deletar este post de notícia?")) return;
    try {
      await fetch(`/api/news/${id}`, { method: "DELETE" });
      triggerAlert("success", "Notícia deletada.");
      fetchAllData();
    } catch (err) {
      triggerAlert("error", "Erro.");
    }
  };

  // --- DELETE CONTACT SUBMISSION ---
  const handleDeleteSubmission = async (id: any) => {
    if (!confirm("Deseja mesmo arquivar/deletar essa mensagem?")) return;
    try {
      const res = await fetch(`/api/submissions/${id}`, { method: "DELETE" });
      if (res.ok) {
        triggerAlert("success", "Mensagem arquivada.");
        fetchAllData();
      }
    } catch (err) {
      triggerAlert("error", "Erro.");
    }
  };

  // --- LOGIN PANEL RENDER ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1c2e24] via-[#2d322f] to-[#121c15] text-[#fff6da]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8 bg-white/5 p-8 sm:p-10 rounded-3xl border border-[#9bb08a]/20 backdrop-blur-md shadow-2xl"
        >
          <div className="text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-[#f6c86b]/10 border border-[#f6c86b]/30 flex items-center justify-center text-[#f6c86b] mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-display text-2.5xl font-bold uppercase tracking-tight">
              2inDance Admin
            </h2>
            <p className="mt-2 text-xs text-[#fff6da]/70 font-light">
              Enter credentials to modify frontend and manage bookings.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-montserrat font-bold uppercase tracking-wider text-[#ffe6a6]/80 block mb-1.5">
                  Email / Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#fff6da]/55">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="claudiozouk@gmail.com or admin"
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#f6c86b]/60 focus:ring-1 focus:ring-[#f6c86b]/30 transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-montserrat font-bold uppercase tracking-wider text-[#ffe6a6]/80 block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#fff6da]/55">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#f6c86b]/60 focus:ring-1 focus:ring-[#f6c86b]/30 transition-all font-sans"
                  />
                </div>
              </div>
            </div>

            {loginError && (
              <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-xs text-red-300 font-sans flex items-start space-x-2">
                <span className="flex-shrink-0 mt-0.5">⚠️</span>
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full inline-flex items-center justify-center space-x-2.5 bg-[#f6c86b] hover:bg-[#ffe6a6] text-[#3b3f3a] font-montserrat text-xs font-bold tracking-widest uppercase py-4 rounded-xl transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50"
              >
                {isLoggingIn ? "Authenticating..." : "Sign In to Admin"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  // --- LOGGED IN CONTENT RENDER ---
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#fff6da] font-sans">
      
      {/* DB AND SESSION HEADER STATUS BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#213026] border border-[#9bb08a]/20 p-4 sm:p-5 rounded-2xl mb-8">
        <div className="flex flex-wrap items-center gap-6 text-left w-full md:w-auto">
          {/* DB Section */}
          <div className="flex items-center space-x-3.5">
            <div className={`p-2.5 rounded-xl ${dbStatus.connected ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-orange-500/10 border border-orange-500/30 text-orange-400"}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-montserrat font-bold tracking-wider uppercase text-white/90">MySQL Database</span>
                <span className={`inline-block w-2 h-2 rounded-full ${dbStatus.connected ? "bg-emerald-500 animate-pulse" : "bg-orange-500"}`} />
              </div>
              <p className="text-[11px] text-[#fff6da]/65 leading-tight font-mono mt-0.5">
                {dbStatus.message || "Checking Connection..."}
              </p>
            </div>
            <div className="flex items-center space-x-1.5">
              <button 
                onClick={fetchDbStatus} 
                disabled={isCheckingDb}
                className="p-1.5 hover:bg-white/5 rounded-lg text-[#f6c86b] transition-all cursor-pointer"
                title="Atualizar Status"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingDb ? "animate-spin" : ""}`} />
              </button>
              <button 
                onClick={handleTestDbConnection} 
                disabled={isCheckingDb}
                className="px-2.5 py-1 bg-[#f6c86b]/10 hover:bg-[#f6c86b]/20 border border-[#f6c86b]/30 rounded-lg text-[10px] font-mono font-bold text-[#f6c86b] transition-all cursor-pointer"
                title="Testar Conexão Direta ao Banco MySQL Hostinger"
              >
                Testar DB
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t border-white/5 pt-3 md:pt-0 md:border-t-0">
          <div className="text-left md:text-right">
            <span className="text-[10px] font-montserrat font-bold uppercase tracking-wider text-[#ffe6a6]/70">Session Active</span>
            <p className="text-xs font-semibold text-white">claudiozouk@gmail.com</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* ACTION BANNER NOTIFICATIONS */}
      <AnimatePresence>
        {saveStatus.type && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className={`p-4 rounded-xl mb-6 flex items-center space-x-3 text-xs leading-relaxed border ${
              saveStatus.type === "success" 
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            }`}
          >
            <span>{saveStatus.type === "success" ? "✓" : "⚠️"}</span>
            <span className="font-semibold">{saveStatus.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DASHBOARD TABS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left side: Navigation links (3 cols) */}
        <div className="lg:col-span-3 space-y-2">
          <span className="font-montserrat text-[10px] font-bold text-[#ffe6a6] tracking-widest uppercase block pl-2 mb-2">
            Dynamic Sections
          </span>
          {[
            { id: "frontpage", label: "Frontpage & Brand Settings", icon: Sparkles },
            { id: "global_settings", label: "Configurações Globais & SEO", icon: Database },
            { id: "about", label: "About Us & Instructors", icon: BookOpen },
            { id: "schedule", label: "Weekly Schedule", icon: Calendar },
            { id: "events", label: "Workshops & Events", icon: Sparkles },
            { id: "media", label: "Media & Gallery", icon: ImageIcon },
            { id: "news", label: "News & Articles", icon: FileText },
            { id: "submissions", label: "Bookings & Contact submissions", icon: Mail, badge: submissionsList.length },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-montserrat text-xs font-semibold tracking-wider uppercase transition-all duration-300 text-left cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#f6c86b] text-[#3b3f3a] font-bold shadow-lg"
                    : "bg-white/5 border border-white/5 text-[#fff6da]/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === tab.id ? "bg-[#3b3f3a] text-white" : "bg-[#f6c86b] text-[#3b3f3a]"}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right side: Editor Pane (9 cols) */}
        <div className="lg:col-span-9 bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl min-h-[60vh] backdrop-blur-md">
          {isLoadingData ? (
            <div className="h-[40vh] flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#f6c86b] animate-spin" />
              <p className="text-xs text-[#fff6da]/60 uppercase font-mono tracking-widest">Loading Live Hostinger Data...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              
              {/* TAB 0: FRONTPAGE SETTINGS */}
              {activeTab === "frontpage" && (
                <motion.div
                  key="tab-frontpage"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8 text-left"
                >
                  <div>
                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white mb-1">
                      Homepage Content & Brand Settings
                    </h3>
                    <p className="text-xs text-[#fff6da]/70">
                      Configure details for the main brand, contact links, Hero section, and Hainan Zouk Marathon.
                    </p>
                  </div>

                  <form onSubmit={handleSaveFrontpageContent} className="space-y-8">
                    {/* SECTION 1: BRAND & CONTACT */}
                    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-6">
                      <h4 className="font-montserrat text-sm font-bold tracking-wider text-[#ffe6a6] uppercase border-b border-white/10 pb-2">
                        1. Brand Details & Global Contact Info
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            Brand Name
                          </label>
                          <input
                            type="text"
                            value={frontpageForm.brand_name}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, brand_name: e.target.value })}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                            placeholder="e.g. 2inDance"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            Global Tagline / Slogan
                          </label>
                          <input
                            type="text"
                            value={frontpageForm.brand_tagline}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, brand_tagline: e.target.value })}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                            placeholder="e.g. The Art of FusionDance in Motion"
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            Brand/SEO Description
                          </label>
                          <textarea
                            value={frontpageForm.brand_description}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, brand_description: e.target.value })}
                            rows={3}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                            placeholder="Brief site overview for search results or footer info"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            Contact Phone / WhatsApp
                          </label>
                          <input
                            type="text"
                            value={frontpageForm.brand_phone}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, brand_phone: e.target.value })}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                            placeholder="e.g. +852 9123 4567"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            Contact Email Address
                          </label>
                          <input
                            type="email"
                            value={frontpageForm.brand_email}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, brand_email: e.target.value })}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                            placeholder="e.g. info@2indance.hk"
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            Venues & Main Studio Locations
                          </label>
                          <input
                            type="text"
                            value={frontpageForm.brand_locations}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, brand_locations: e.target.value })}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                            placeholder="e.g. Hong Kong (Central • Sheung Wan • TST)"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: HERO COMPONENT */}
                    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-6">
                      <h4 className="font-montserrat text-sm font-bold tracking-wider text-[#ffe6a6] uppercase border-b border-white/10 pb-2">
                        2. Hero Section Content (Top of Page)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            Title - Line 1 (Main highlight)
                          </label>
                          <input
                            type="text"
                            value={frontpageForm.hero_title_line1}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, hero_title_line1: e.target.value })}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                            placeholder="e.g. Connection"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            Title - Line 2 (Sub-word)
                          </label>
                          <input
                            type="text"
                            value={frontpageForm.hero_title_line2}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, hero_title_line2: e.target.value })}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                            placeholder="e.g. Flow & Fluid"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            Title - Line 3 (Italic highlight)
                          </label>
                          <input
                            type="text"
                            value={frontpageForm.hero_title_line3}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, hero_title_line3: e.target.value })}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                            placeholder="e.g. Soulzouk Methodology"
                            required
                          />
                        </div>

                        <div className="md:col-span-3">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            Hero Main Subtitle text
                          </label>
                          <textarea
                            value={frontpageForm.hero_subtitle}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, hero_subtitle: e.target.value })}
                            rows={3}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                            placeholder="Longer introduction paragraph displayed under the title"
                            required
                          />
                        </div>

                        <div className="md:col-span-2 grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                              Primary Button Text
                            </label>
                            <input
                              type="text"
                              value={frontpageForm.hero_cta_primary}
                              onChange={(e) => setFrontpageForm({ ...frontpageForm, hero_cta_primary: e.target.value })}
                              className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                              placeholder="e.g. Book a Trial Class"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                              Secondary Button Text
                            </label>
                            <input
                              type="text"
                              value={frontpageForm.hero_cta_secondary}
                              onChange={(e) => setFrontpageForm({ ...frontpageForm, hero_cta_secondary: e.target.value })}
                              className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                              placeholder="e.g. Explore Classes"
                              required
                            />
                          </div>
                        </div>

                        {/* HERO BACKGROUND TYPE SWITCHER & MEDIA PICKER */}
                        <div className="md:col-span-3 border-t border-white/10 pt-6 space-y-6">
                          <h5 className="font-montserrat text-xs font-bold tracking-wider text-[#ffe6a6] uppercase">
                            Hero Background Visuals & Layout
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                                Background Visual Mode
                              </label>
                              <select
                                value={frontpageForm.hero_bg_type || "animation"}
                                onChange={(e) => setFrontpageForm({ ...frontpageForm, hero_bg_type: e.target.value })}
                                className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all cursor-pointer"
                              >
                                <option value="animation">3D Fluid Ribbon Animation (Default)</option>
                                <option value="image">Custom Uploaded Background Photo</option>
                              </select>
                              <p className="text-[10px] text-[#fff6da]/50 mt-2 font-sans">
                                Select "Custom Uploaded Background Photo" to swap the abstract lines with a high-definition image.
                              </p>
                            </div>

                            {frontpageForm.hero_bg_type === "image" && (
                              <MediaPicker
                                label="Custom Background Photo"
                                value={frontpageForm.hero_bg_image || ""}
                                onChange={(url) => setFrontpageForm({ ...frontpageForm, hero_bg_image: url })}
                                idPrefix="hero-bg"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: HAINAN ISLAND ZOUK MARATHON */}
                    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-6">
                      <h4 className="font-montserrat text-sm font-bold tracking-wider text-[#ffe6a6] uppercase border-b border-white/10 pb-2">
                        3. Hainan Island Zouk Marathon Section
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            Marathon Event Badge Text
                          </label>
                          <input
                            type="text"
                            value={frontpageForm.hainan_badge}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, hainan_badge: e.target.value })}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                            placeholder="e.g. Featured Global Event • March 2027"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            Marathon Main Header Title
                          </label>
                          <input
                            type="text"
                            value={frontpageForm.hainan_title}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, hainan_title: e.target.value })}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                            placeholder="e.g. Hainan Island Zouk Marathon"
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            Marathon Slogan / Intro Quote
                          </label>
                          <textarea
                            value={frontpageForm.hainan_quote}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, hainan_quote: e.target.value })}
                            rows={3}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                            placeholder="Tropical citation quote about Hainan Island beauty"
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            Official Registration Website Link URL
                          </label>
                          <input
                            type="url"
                            value={frontpageForm.hainan_link}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, hainan_link: e.target.value })}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                            placeholder="e.g. https://hainanzouk.2indance.com"
                            required
                          />
                        </div>

                        {/* HAINAN MARATHON DYNAMIC PHOTO UPLOADS */}
                        <div className="md:col-span-2 border-t border-white/10 pt-6 space-y-6">
                          <h5 className="font-montserrat text-xs font-bold tracking-wider text-[#ffe6a6] uppercase">
                            Marathon Pictures & Logos Replacement
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <MediaPicker
                              label="Main Event Logo / Emblem Image"
                              value={frontpageForm.hainan_logo_image || ""}
                              onChange={(url) => setFrontpageForm({ ...frontpageForm, hainan_logo_image: url })}
                              idPrefix="hainan-logo"
                            />
                            <MediaPicker
                              label="Sanya Resort Hotel / Scenery Banner"
                              value={frontpageForm.hainan_resort_image || ""}
                              onChange={(url) => setFrontpageForm({ ...frontpageForm, hainan_resort_image: url })}
                              idPrefix="hainan-resort"
                            />
                            <MediaPicker
                              label="Accommodation / Room Luxury Photo"
                              value={frontpageForm.hainan_room_image || ""}
                              onChange={(url) => setFrontpageForm({ ...frontpageForm, hainan_room_image: url })}
                              idPrefix="hainan-room"
                            />
                            <MediaPicker
                              label="Palm Beach Dance Arena Photo"
                              value={frontpageForm.hainan_beach_image || ""}
                              onChange={(url) => setFrontpageForm({ ...frontpageForm, hainan_beach_image: url })}
                              idPrefix="hainan-beach"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 4: ELEMENTOR PAGE BUILDER SECTION CONTROL */}
                    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <h4 className="font-montserrat text-sm font-bold tracking-wider text-[#ffe6a6] uppercase">
                          4. Home Page Section Layout Builder (Elementor-Style)
                        </h4>
                        <span className="text-[10px] font-mono text-[#f6c86b] uppercase bg-[#f6c86b]/10 px-2 py-1 rounded-md">
                          Live Reordering & Visibility
                        </span>
                      </div>
                      <p className="text-xs text-[#fff6da]/70 leading-relaxed">
                        Control the rendering order and visibility of all sections on the main page. Use the up/down arrows to position sections and the eye icon to hide or show them instantly.
                      </p>

                      <div className="space-y-3 bg-black/25 p-4 rounded-2xl border border-white/5">
                        {getSectionsList().map((sec, idx, arr) => {
                          const isFirst = idx === 0;
                          const isLast = idx === arr.length - 1;
                          const isVisible = sec.visible !== false;

                          return (
                            <div
                              key={sec.id}
                              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                                isVisible
                                  ? "bg-[#3b3f3a]/80 border-white/10 text-white"
                                  : "bg-[#252826]/60 border-white/5 text-white/40"
                              }`}
                            >
                              {/* Section Title */}
                              <div className="flex items-center space-x-3">
                                <span className="font-mono text-xs text-[#f6c86b]/60 w-6">
                                  #{idx + 1}
                                </span>
                                <div>
                                  <p className="font-montserrat text-xs font-bold uppercase tracking-wider">
                                    {sec.name}
                                  </p>
                                  <p className="text-[10px] font-mono text-[#fff6da]/50 mt-0.5">
                                    ID: {sec.id} | Effect: {sec.effect}
                                  </p>
                                </div>
                              </div>

                              {/* Controls */}
                              <div className="flex items-center space-x-2">
                                {/* Toggle Visibility */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleSectionVisibility(idx)}
                                  className={`p-2 rounded-lg transition-all cursor-pointer border ${
                                    isVisible
                                      ? "bg-[#9bb08a]/10 hover:bg-[#9bb08a]/20 border-[#9bb08a]/20 text-[#9bb08a]"
                                      : "bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-400"
                                  }`}
                                  title={isVisible ? "Hide Section" : "Show Section"}
                                >
                                  {isVisible ? (
                                    <div className="flex items-center space-x-1 px-1">
                                      <Eye className="w-3.5 h-3.5" />
                                      <span className="text-[10px] font-mono font-bold uppercase">Visible</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center space-x-1 px-1">
                                      <EyeOff className="w-3.5 h-3.5" />
                                      <span className="text-[10px] font-mono font-bold uppercase">Hidden</span>
                                    </div>
                                  )}
                                </button>

                                {/* Move Up */}
                                <button
                                  type="button"
                                  onClick={() => handleMoveSection(idx, "up")}
                                  disabled={isFirst}
                                  className={`p-2 rounded-lg border transition-all cursor-pointer ${
                                    isFirst
                                      ? "opacity-20 cursor-not-allowed border-white/5 text-white/20"
                                      : "bg-white/5 hover:bg-white/10 border-white/10 text-white hover:text-[#f6c86b]"
                                  }`}
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>

                                {/* Move Down */}
                                <button
                                  type="button"
                                  onClick={() => handleMoveSection(idx, "down")}
                                  disabled={isLast}
                                  className={`p-2 rounded-lg border transition-all cursor-pointer ${
                                    isLast
                                      ? "opacity-20 cursor-not-allowed border-white/5 text-white/20"
                                      : "bg-white/5 hover:bg-white/10 border-white/10 text-white hover:text-[#f6c86b]"
                                  }`}
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        className="inline-flex items-center space-x-2 bg-[#f6c86b] hover:bg-[#ffe6a6] text-[#3b3f3a] px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-[#f6c86b]/15"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Frontpage Settings</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* TAB: GLOBAL SETTINGS & SEO */}
              {activeTab === "global_settings" && (
                <motion.div
                  key="tab-global-settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8 text-left"
                >
                  <div>
                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white mb-1">
                      Configurações Globais, SEO e Tags de Otimização
                    </h3>
                    <p className="text-xs text-[#fff6da]/70">
                      Gerencie links de redes sociais do rodapé, textos do copyright, URLs personalizadas de Favicon e Logo, e meta tags de otimização de busca.
                    </p>
                  </div>

                  <form onSubmit={handleSaveFrontpageContent} className="space-y-8">
                    
                    {/* SECTION 1: SOCIAL NETWORKS */}
                    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-6">
                      <h4 className="font-montserrat text-sm font-bold tracking-wider text-[#ffe6a6] uppercase border-b border-white/10 pb-2">
                        1. Ícones de Redes Sociais
                      </h4>
                      <p className="text-xs text-[#fff6da]/60 leading-relaxed">
                        Insira os links completos das redes sociais de destino para atualizar os ícones dinâmicos no rodapé do site.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            Instagram Link
                          </label>
                          <input
                            type="text"
                            value={frontpageForm.social_instagram}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, social_instagram: e.target.value })}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                            placeholder="e.g. https://instagram.com/2indance"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            Facebook Link
                          </label>
                          <input
                            type="text"
                            value={frontpageForm.social_facebook}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, social_facebook: e.target.value })}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                            placeholder="e.g. https://facebook.com/2indance"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            YouTube Link
                          </label>
                          <input
                            type="text"
                            value={frontpageForm.social_youtube}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, social_youtube: e.target.value })}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                            placeholder="e.g. https://youtube.com/@2indance"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            WhatsApp / Link de Contato
                          </label>
                          <input
                            type="text"
                            value={frontpageForm.social_whatsapp}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, social_whatsapp: e.target.value })}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                            placeholder="e.g. https://wa.me/85291234567"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: FOOTER TEXTS */}
                    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-6">
                      <h4 className="font-montserrat text-sm font-bold tracking-wider text-[#ffe6a6] uppercase border-b border-white/10 pb-2">
                        2. Rodapé e Disclaimers
                      </h4>
                      <p className="text-xs text-[#fff6da]/60 leading-relaxed">
                        Atualize os textos de copyright, créditos e isenções legais exibidos no final do rodapé.
                      </p>
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            Texto de Direitos Autorais / Copyright
                          </label>
                          <input
                            type="text"
                            value={frontpageForm.footer_text}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, footer_text: e.target.value })}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                            placeholder="e.g. © 2027 2inDance. All rights reserved. • Soulzouk Methodology in HK"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            Nota de Isenção Adicional / Créditos (Disclaimer)
                          </label>
                          <textarea
                            value={frontpageForm.footer_disclaimer}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, footer_disclaimer: e.target.value })}
                            rows={2}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all leading-relaxed"
                            placeholder="e.g. Learn Brazilian Zouk, Lambada, and Samba with Xina & Laura in Hong Kong."
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: VISUAL BRANDING */}
                    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-6">
                      <h4 className="font-montserrat text-sm font-bold tracking-wider text-[#ffe6a6] uppercase border-b border-white/10 pb-2">
                        3. Marca Visual (Favicon & Logo)
                      </h4>
                      <p className="text-xs text-[#fff6da]/60 leading-relaxed">
                        Personalize as imagens de marca. Use o uploader ou selecione da biblioteca de mídia do Hostinger.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MediaPicker
                          label="Logo Customizado (PNG/JPG)"
                          value={frontpageForm.logo_url || ""}
                          onChange={(url) => setFrontpageForm({ ...frontpageForm, logo_url: url })}
                          idPrefix="logo-url"
                        />
                        <MediaPicker
                          label="Favicon Customizado (.ico/.png)"
                          value={frontpageForm.favicon_url || ""}
                          onChange={(url) => setFrontpageForm({ ...frontpageForm, favicon_url: url })}
                          idPrefix="favicon-url"
                        />
                      </div>
                    </div>

                    {/* SECTION 4: SEO & INDEXING */}
                    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-6">
                      <h4 className="font-montserrat text-sm font-bold tracking-wider text-[#ffe6a6] uppercase border-b border-white/10 pb-2">
                        4. SEO e Compatibilidade com Motores de Busca
                      </h4>
                      <p className="text-xs text-[#fff6da]/60 leading-relaxed">
                        Configure meta tags importantes para o Google indexar seu site perfeitamente.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            Título SEO da Página (&lt;title&gt;)
                          </label>
                          <input
                            type="text"
                            value={frontpageForm.seo_title}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, seo_title: e.target.value })}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all font-semibold"
                            placeholder="Título exibido na aba do navegador e nos buscadores"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            Descrição de Busca (Meta Description)
                          </label>
                          <textarea
                            value={frontpageForm.seo_meta_description}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, seo_meta_description: e.target.value })}
                            rows={3}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all leading-relaxed"
                            placeholder="Frase descritiva resumindo o site exibida logo abaixo do título no Google"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            Palavras-Chave de Indexação (Meta Keywords)
                          </label>
                          <input
                            type="text"
                            value={frontpageForm.seo_keywords}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, seo_keywords: e.target.value })}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                            placeholder="zouk, samba, lambada, dança, hong kong"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            Regras de Indexação (Robots Directives)
                          </label>
                          <select
                            value={frontpageForm.seo_robots}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, seo_robots: e.target.value })}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                          >
                            <option value="index, follow">Indexar site e seguir links (Recomendado)</option>
                            <option value="noindex, follow">Ocultar dos buscadores, seguir links</option>
                            <option value="index, nofollow">Indexar, mas ignorar links</option>
                            <option value="noindex, nofollow">Bloquear totalmente robôs de busca</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            URL do Preview Social (OpenGraph Image)
                          </label>
                          <input
                            type="text"
                            value={frontpageForm.seo_og_image}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, seo_og_image: e.target.value })}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                            placeholder="e.g. Link da imagem de capa que aparece no compartilhamento"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 5: ADVANCED TAG OPTIMIZATION */}
                    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-6">
                      <h4 className="font-montserrat text-sm font-bold tracking-wider text-[#ffe6a6] uppercase border-b border-white/10 pb-2">
                        5. Tags de Otimização Adicionais e Rastreamento
                      </h4>
                      <p className="text-xs text-[#fff6da]/60 leading-relaxed">
                        Integre códigos externos de verificação (como do Google Search Console) ou insira scripts customizados de cabeçalho.
                      </p>
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            Código do Google Search Console (google-site-verification)
                          </label>
                          <input
                            type="text"
                            value={frontpageForm.google_site_verification}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, google_site_verification: e.target.value })}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all"
                            placeholder="e.g. ksdhjf89324hksdjhfksdyrfg"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80 mb-2">
                            Tags Customizadas Adicionais (Meta tags, Bing, Analytics)
                          </label>
                          <textarea
                            value={frontpageForm.seo_custom_tags}
                            onChange={(e) => setFrontpageForm({ ...frontpageForm, seo_custom_tags: e.target.value })}
                            rows={3}
                            className="w-full bg-[#3b3f3a]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c86b] transition-all font-mono text-xs leading-relaxed"
                            placeholder="Cole aqui tags personalizadas adicionais de verificação ou otimização."
                          />
                        </div>
                      </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        className="inline-flex items-center space-x-2 bg-[#f6c86b] hover:bg-[#ffe6a6] text-[#3b3f3a] px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-[#f6c86b]/15"
                      >
                        <Save className="w-4 h-4" />
                        <span>Salvar Configurações Globais</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* TAB 1: ABOUT US */}
              {activeTab === "about" && (
                <motion.div
                  key="tab-about"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8 text-left"
                >
                  <div>
                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white mb-1">
                      About Us Section Content
                    </h3>
                    <p className="text-xs text-[#fff6da]/70">
                      Configure the title, subtitles, and story descriptions displayed on the frontend.
                    </p>
                  </div>

                  <form onSubmit={handleSaveAboutContent} className="space-y-5 border-b border-white/10 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-montserrat font-bold uppercase tracking-wider text-[#ffe6a6]/80 block mb-1.5">Section Title</label>
                        <input
                          type="text"
                          value={aboutData.title}
                          onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                          className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#f6c86b]/60 transition-all font-sans"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-montserrat font-bold uppercase tracking-wider text-[#ffe6a6]/80 block mb-1.5">Section Subtitle</label>
                        <input
                          type="text"
                          value={aboutData.subtitle}
                          onChange={(e) => setAboutData({ ...aboutData, subtitle: e.target.value })}
                          className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#f6c86b]/60 transition-all font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-montserrat font-bold uppercase tracking-wider text-[#ffe6a6]/80 block mb-1.5">Philosophy/Story Title</label>
                      <input
                        type="text"
                        value={aboutData.storyTitle}
                        onChange={(e) => setAboutData({ ...aboutData, storyTitle: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#f6c86b]/60 transition-all font-sans"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-montserrat font-bold uppercase tracking-wider text-[#ffe6a6]/80 block mb-1.5">Philosophy Description 1</label>
                      <textarea
                        rows={4}
                        value={aboutData.storyText1}
                        onChange={(e) => setAboutData({ ...aboutData, storyText1: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#f6c86b]/60 transition-all font-sans leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-montserrat font-bold uppercase tracking-wider text-[#ffe6a6]/80 block mb-1.5">Philosophy Description 2</label>
                      <textarea
                        rows={4}
                        value={aboutData.storyText2}
                        onChange={(e) => setAboutData({ ...aboutData, storyText2: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#f6c86b]/60 transition-all font-sans leading-relaxed"
                      />
                    </div>

                    <div className="text-right">
                      <button
                        type="submit"
                        className="inline-flex items-center space-x-2 bg-[#f6c86b] hover:bg-[#ffe6a6] text-[#3b3f3a] font-montserrat text-[11px] font-bold tracking-widest uppercase px-6 py-3 rounded-xl transition-all duration-300 shadow-md cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save General Content</span>
                      </button>
                    </div>
                  </form>

                  {/* INSTRUCTORS LIST */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-display text-lg font-bold uppercase text-[#ffe6a6]">
                          School Founders & Instructors
                        </h4>
                        <p className="text-[11px] text-[#fff6da]/60">Manage the instructors displayed under meet our founders.</p>
                      </div>
                      <button
                        onClick={() => handleOpenFounderModal()}
                        className="inline-flex items-center space-x-1.5 bg-[#9bb08a] hover:bg-[#ffe6a6] hover:text-[#3b3f3a] text-[#3b3f3a] px-3.5 py-2 rounded-xl text-xs font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Member</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {aboutData.founders?.map((member: any, idx: number) => (
                        <div key={member.id || idx} className="bg-black/20 border border-white/5 rounded-2xl p-4 flex gap-4 items-start hover:border-white/15 transition-all">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-14 h-14 rounded-full object-cover border border-[#f6c86b]/40 flex-shrink-0"
                          />
                          <div className="space-y-1.5 flex-grow">
                            <span className="text-xs font-montserrat font-bold text-[#f6c86b] uppercase block tracking-wider">{member.name}</span>
                            <span className="text-[11px] font-medium text-white/80 block leading-tight">{member.role}</span>
                            <p className="text-[11px] text-[#fff6da]/70 line-clamp-2 leading-relaxed font-light">{member.bio}</p>
                            
                            <div className="flex items-center space-x-2 pt-2 border-t border-white/5">
                              <button
                                onClick={() => handleOpenFounderModal(member)}
                                className="inline-flex items-center space-x-1 text-[10px] font-bold text-[#ffe6a6] hover:text-[#f6c86b] transition-colors"
                              >
                                <Edit className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteFounder(member.id)}
                                className="inline-flex items-center space-x-1 text-[10px] font-bold text-red-300 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: WEEKLY SCHEDULE */}
              {activeTab === "schedule" && (
                <motion.div
                  key="tab-schedule"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 text-left"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
                        Weekly Class Schedule
                      </h3>
                      <p className="text-xs text-[#fff6da]/70">Add, edit, and organize weekly classes with style, level, times, and location details.</p>
                    </div>
                    <button
                      onClick={() => handleOpenScheduleModal()}
                      className="inline-flex items-center space-x-1.5 bg-[#f6c86b] hover:bg-[#ffe6a6] text-[#3b3f3a] px-4 py-2.5 rounded-xl text-xs font-montserrat font-bold uppercase tracking-widest transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Class</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-white/10 rounded-2xl bg-black/10">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/10 text-[#ffe6a6] font-montserrat font-bold uppercase tracking-wider">
                          <th className="py-3 px-4">Day</th>
                          <th className="py-3 px-4">Style & Level</th>
                          <th className="py-3 px-4">Time</th>
                          <th className="py-3 px-4">Location</th>
                          <th className="py-3 px-4">Price</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {scheduleList.map((item) => (
                          <tr key={item.id} className="hover:bg-white/5 transition-all">
                            <td className="py-3.5 px-4 font-semibold font-montserrat">{item.day}</td>
                            <td className="py-3.5 px-4">
                              <span className="font-bold block text-white">{item.style}</span>
                              <span className="text-[10px] font-mono text-[#f6c86b] tracking-wider uppercase block">{item.level}</span>
                            </td>
                            <td className="py-3.5 px-4 font-mono">{item.time}</td>
                            <td className="py-3.5 px-4 max-w-xs truncate">{item.location}</td>
                            <td className="py-3.5 px-4 text-[#9bb08a] font-bold font-mono">{item.price}</td>
                            <td className="py-3.5 px-4 text-right space-x-2">
                              <button
                                onClick={() => handleOpenScheduleModal(item)}
                                className="p-1.5 bg-white/5 hover:bg-[#f6c86b]/15 text-[#ffe6a6] hover:text-[#f6c86b] rounded-lg transition-all"
                                title="Edit Class"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteSchedule(item.id)}
                                className="p-1.5 bg-white/5 hover:bg-red-500/15 text-red-300 hover:text-red-400 rounded-lg transition-all"
                                title="Delete Class"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: WORKSHOPS & EVENTS */}
              {activeTab === "events" && (
                <motion.div
                  key="tab-events"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 text-left"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
                        Workshops & Special Parties
                      </h3>
                      <p className="text-xs text-[#fff6da]/70">Publish special workshops, masterclasses, intensives, and acoustic parties.</p>
                    </div>
                    <button
                      onClick={() => handleOpenEventModal()}
                      className="inline-flex items-center space-x-1.5 bg-[#f6c86b] hover:bg-[#ffe6a6] text-[#3b3f3a] px-4 py-2.5 rounded-xl text-xs font-montserrat font-bold uppercase tracking-widest transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Event</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {eventsList.map((evt) => (
                      <div key={evt.id} className="bg-black/20 border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-all flex flex-col justify-between">
                        <div>
                          <div className="h-40 relative">
                            <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                            <div className="absolute top-3 right-3 bg-black/60 border border-white/20 px-2.5 py-1 rounded-lg text-[10px] font-mono text-[#f6c86b]">
                              {evt.price}
                            </div>
                          </div>
                          <div className="p-5 space-y-2.5">
                            <h4 className="font-display text-lg font-bold text-white uppercase">{evt.title}</h4>
                            <div className="flex flex-wrap gap-3 text-[10px] font-mono text-[#fff6da]/70 border-b border-white/5 pb-2.5">
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3 text-[#f6c86b]" />
                                <span>{evt.date}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-[#f6c86b]" />
                                <span>{evt.time}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3 text-[#f6c86b]" />
                                <span>{evt.location}</span>
                              </span>
                            </div>
                            <p className="text-xs text-[#fff6da]/80 font-light leading-relaxed line-clamp-3">{evt.description}</p>
                          </div>
                        </div>

                        <div className="px-5 pb-5 pt-2 flex items-center justify-end space-x-3 border-t border-white/5">
                          <button
                            onClick={() => handleOpenEventModal(evt)}
                            className="inline-flex items-center space-x-1 text-xs font-semibold text-[#ffe6a6] hover:text-[#f6c86b] transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(evt.id)}
                            className="inline-flex items-center space-x-1 text-xs font-semibold text-red-300 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 4: MEDIA GALLERY & EVENT PHOTO GALLERIES */}
              {activeTab === "media" && (
                <motion.div
                  key="tab-media"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8 text-left"
                >
                  {/* SECTION 1: EVENT PHOTO GALLERIES */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
                      <div>
                        <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-[#f6c86b]">
                          Galerias de Fotos por Evento
                        </h3>
                        <p className="text-xs text-[#fff6da]/70">
                          Gerencie as galerias de fotos dos eventos (com imagem de capa e modal moderno de exibição).
                        </p>
                      </div>
                      <button
                        onClick={() => handleOpenEventGalleryModal()}
                        className="inline-flex items-center space-x-1.5 bg-[#f6c86b] hover:bg-[#ffe6a6] text-[#3b3f3a] px-4 py-2.5 rounded-xl text-xs font-montserrat font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Nova Galeria de Fotos</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                      {eventGalleriesList.map((gal) => (
                        <div key={gal.id} className="bg-black/20 border border-white/10 rounded-2xl overflow-hidden hover:border-[#f6c86b]/40 transition-all flex flex-col justify-between">
                          <div>
                            <div className="h-40 relative bg-gray-900">
                              <img src={gal.coverImage} alt={gal.title} className="w-full h-full object-cover" />
                              <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] uppercase font-mono text-[#f6c86b] tracking-wider font-bold">
                                {gal.category}
                              </span>
                              <span className="absolute top-2 right-2 bg-[#f6c86b] text-[#3b3f3a] px-2.5 py-1 rounded-full text-[10px] font-mono font-extrabold shadow-md">
                                {Array.isArray(gal.photos) ? gal.photos.length : 0} Fotos
                              </span>
                            </div>
                            <div className="p-4 space-y-2">
                              <h4 className="font-display text-base font-bold text-white leading-tight truncate">
                                {gal.title}
                              </h4>
                              <p className="text-[11px] font-mono text-[#fff6da]/60">
                                📅 {gal.date} • 📍 {gal.location}
                              </p>
                              <p className="text-xs text-white/70 line-clamp-2 font-light">
                                {gal.description}
                              </p>
                            </div>
                          </div>

                          <div className="p-3 bg-black/40 border-t border-white/5 flex items-center justify-between text-xs font-bold">
                            <span className="text-[#9bb08a] text-[10px]">Capa Configurada</span>
                            <div className="space-x-3">
                              <button onClick={() => handleOpenEventGalleryModal(gal)} className="text-[#ffe6a6] hover:text-[#f6c86b]">Editar</button>
                              <button onClick={() => handleDeleteEventGallery(gal.id)} className="text-red-300 hover:text-red-400">Excluir</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 2: FEATURED VIDEOS & DEMOS */}
                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between flex-wrap gap-4 pb-2">
                      <div>
                        <h3 className="font-display text-xl font-bold uppercase tracking-tight text-white">
                          Vídeos em Destaque
                        </h3>
                        <p className="text-xs text-[#fff6da]/70">Gerencie os vídeos e demos da seção de mídias.</p>
                      </div>
                      <button
                        onClick={() => handleOpenMediaModal()}
                        className="inline-flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-montserrat font-bold uppercase tracking-widest transition-all cursor-pointer border border-white/10"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar Vídeo</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                      {mediaList.map((item) => (
                        <div key={item.id} className="bg-black/20 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all">
                          <div className="h-32 relative">
                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[9px] uppercase font-mono text-[#f6c86b] tracking-wider flex items-center space-x-1">
                              {item.type === "video" ? <Video className="w-2.5 h-2.5" /> : <ImageIcon className="w-2.5 h-2.5" />}
                              <span>{item.type}</span>
                            </div>
                          </div>
                          <div className="p-3.5 space-y-2">
                            <span className="text-[10px] font-mono font-bold text-[#9bb08a] uppercase tracking-wider block">{item.category}</span>
                            <span className="text-xs font-bold text-white block leading-tight truncate">{item.title}</span>
                            
                            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-white/5 text-[10px] font-bold">
                              <button onClick={() => handleOpenMediaModal(item)} className="text-[#ffe6a6] hover:text-[#f6c86b]">Edit</button>
                              <span className="text-white/10">|</span>
                              <button onClick={() => handleDeleteMedia(item.id)} className="text-red-300 hover:text-red-400">Delete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 5: NEWS BLOG */}
              {activeTab === "news" && (
                <motion.div
                  key="tab-news"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 text-left"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
                        Latest News & Blog Posts
                      </h3>
                      <p className="text-xs text-[#fff6da]/70">Publish notifications, tips, tutorials, and community announcements.</p>
                    </div>
                    <button
                      onClick={() => handleOpenNewsModal()}
                      className="inline-flex items-center space-x-1.5 bg-[#f6c86b] hover:bg-[#ffe6a6] text-[#3b3f3a] px-4 py-2.5 rounded-xl text-xs font-montserrat font-bold uppercase tracking-widest transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Post</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {newsList.map((post) => (
                      <div key={post.id} className="bg-black/20 border border-white/5 rounded-2xl p-4 sm:p-5 hover:border-white/10 transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                        <img src={post.image} alt={post.title} className="w-24 h-24 rounded-xl object-cover border border-white/5 flex-shrink-0" />
                        <div className="flex-grow space-y-1.5">
                          <div className="flex items-center space-x-2.5">
                            <span className="text-[10px] font-mono text-[#f6c86b] uppercase tracking-wider font-bold">{post.category}</span>
                            <span className="text-[10px] font-mono text-[#fff6da]/40">{post.date}</span>
                          </div>
                          <h4 className="font-display text-base font-bold text-white uppercase tracking-tight leading-tight">{post.title}</h4>
                          <p className="text-xs text-[#fff6da]/75 line-clamp-2 font-light leading-relaxed">{post.excerpt}</p>
                          
                          <div className="flex items-center space-x-3 pt-2 text-[11px] font-bold">
                            <button onClick={() => handleOpenNewsModal(post)} className="text-[#ffe6a6] hover:text-[#f6c86b] flex items-center space-x-1">
                              <Edit className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button onClick={() => handleDeleteNews(post.id)} className="text-red-300 hover:text-red-400 flex items-center space-x-1">
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 6: CONTACT SUBMISSIONS */}
              {activeTab === "submissions" && (
                <motion.div
                  key="tab-submissions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 text-left"
                >
                  <div>
                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
                      Customer Bookings & Messages
                    </h3>
                    <p className="text-xs text-[#fff6da]/70">Read messages sent by visitors using the contact form, containing lead names, email addresses, and class booking details.</p>
                  </div>

                  {submissionsList.length === 0 ? (
                    <div className="bg-black/10 border border-dashed border-white/10 rounded-2xl py-12 text-center text-[#fff6da]/50 text-xs">
                      No submissions stored in database yet. Form is live and active!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {submissionsList.map((sub) => (
                        <div key={sub.id} className="bg-black/25 border border-white/5 rounded-2xl p-5 hover:border-white/15 transition-all space-y-3 relative group">
                          <button
                            onClick={() => handleDeleteSubmission(sub.id)}
                            className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-400 border border-red-500/20 rounded-xl transition-all"
                            title="Delete Submissions"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="space-y-1.5">
                            <span className="text-[10px] font-mono text-[#f6c86b] block">SUBMISSION #{sub.id}</span>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                              <span className="text-sm font-bold text-white block">{sub.name}</span>
                              <a href={`mailto:${sub.email}`} className="text-xs font-mono text-[#9bb08a] hover:underline flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span>{sub.email}</span>
                              </a>
                            </div>
                            <span className="text-[10px] font-mono text-[#fff6da]/40 block">Sent: {new Date(sub.created_at || Date.now()).toLocaleString()}</span>
                          </div>

                          <div className="bg-white/5 p-4 rounded-xl text-xs text-white/95 leading-relaxed font-sans border border-white/5 font-light whitespace-pre-line">
                            {sub.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          )}
        </div>

      </div>

      {/* --- ALL-PURPOSE DYNAMIC DIALOG MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#242c27] border border-[#9bb08a]/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl text-left text-[#fff6da]"
            >
              <div className="bg-[#1c2420] border-b border-white/5 p-5 flex items-center justify-between">
                <span className="font-montserrat text-xs font-bold uppercase tracking-widest text-[#f6c86b]">
                  {editingItem ? "Editar Item" : "Adicionar Novo Item"}
                </span>
                <button onClick={() => setIsModalOpen(false)} className="text-[#fff6da]/70 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* MODAL FORM: INSTRUCTOR/FOUNDER */}
              {modalType === "founder" && (
                <form onSubmit={handleSaveFounder} className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-montserrat font-bold uppercase block mb-1">Name</label>
                    <input
                      type="text"
                      required
                      value={founderForm.name}
                      onChange={(e) => setFounderForm({ ...founderForm, name: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-montserrat font-bold uppercase block mb-1">Role / Title</label>
                    <input
                      type="text"
                      required
                      value={founderForm.role}
                      onChange={(e) => setFounderForm({ ...founderForm, role: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-montserrat font-bold uppercase block mb-1">Biography</label>
                    <textarea
                      rows={3}
                      required
                      value={founderForm.bio}
                      onChange={(e) => setFounderForm({ ...founderForm, bio: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b] leading-relaxed"
                    />
                  </div>
                  <div>
                    <MediaPicker
                      label="Instructor Profile Photo"
                      value={founderForm.image}
                      onChange={(url) => setFounderForm({ ...founderForm, image: url })}
                      idPrefix="founder-img"
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-white/5 text-right space-x-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-wider">Cancel</button>
                    <button type="submit" className="px-6 py-2.5 bg-[#f6c86b] hover:bg-[#ffe6a6] text-[#3b3f3a] rounded-xl text-xs font-bold uppercase tracking-widest">Save Member</button>
                  </div>
                </form>
              )}

              {/* MODAL FORM: SCHEDULE CLASS */}
              {modalType === "schedule" && (
                <form onSubmit={handleSaveSchedule} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-montserrat font-bold uppercase block mb-1">Day of Week</label>
                      <select
                        value={scheduleForm.day}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, day: e.target.value })}
                        className="w-full bg-[#1c2420] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                      >
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-montserrat font-bold uppercase block mb-1">Time Range</label>
                      <input
                        type="text"
                        required
                        value={scheduleForm.time}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                        placeholder="e.g. 19:00 - 20:15"
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-montserrat font-bold uppercase block mb-1">Class Style / Name</label>
                    <input
                      type="text"
                      required
                      value={scheduleForm.style}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, style: e.target.value })}
                      placeholder="e.g. Brazilian Zouk Foundation"
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-montserrat font-bold uppercase block mb-1">Level</label>
                      <input
                        type="text"
                        required
                        value={scheduleForm.level}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, level: e.target.value })}
                        placeholder="e.g. Beginner"
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-montserrat font-bold uppercase block mb-1">Price Label</label>
                      <input
                        type="text"
                        required
                        value={scheduleForm.price}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, price: e.target.value })}
                        placeholder="e.g. HK$150"
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-montserrat font-bold uppercase block mb-1">Location Venue</label>
                    <input
                      type="text"
                      required
                      value={scheduleForm.location}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                      placeholder="e.g. Flow Dance Hong Kong, Sheung Wan"
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                    />
                  </div>

                  <div className="pt-4 border-t border-white/5 text-right space-x-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-wider">Cancel</button>
                    <button type="submit" className="px-6 py-2.5 bg-[#f6c86b] hover:bg-[#ffe6a6] text-[#3b3f3a] rounded-xl text-xs font-bold uppercase tracking-widest">Save Class</button>
                  </div>
                </form>
              )}

              {/* MODAL FORM: EVENT/WORKSHOP */}
              {modalType === "event" && (
                <form onSubmit={handleSaveEvent} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-montserrat font-bold uppercase block mb-1">Title</label>
                      <input
                        type="text"
                        required
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-montserrat font-bold uppercase block mb-1">Date</label>
                      <input
                        type="text"
                        required
                        value={eventForm.date}
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                        placeholder="e.g. July 18, 2026"
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-montserrat font-bold uppercase block mb-1">Time Range</label>
                      <input
                        type="text"
                        required
                        value={eventForm.time}
                        onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                        placeholder="e.g. 12:00 - 17:00"
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-montserrat font-bold uppercase block mb-1">Price Label</label>
                      <input
                        type="text"
                        required
                        value={eventForm.price}
                        onChange={(e) => setEventForm({ ...eventForm, price: e.target.value })}
                        placeholder="e.g. HK$450"
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-montserrat font-bold uppercase block mb-1">Location Venue</label>
                    <input
                      type="text"
                      required
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-montserrat font-bold uppercase block mb-1">Description</label>
                    <textarea
                      rows={3}
                      required
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b] leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-montserrat font-bold uppercase block mb-1">Image URL</label>
                    <input
                      type="text"
                      required
                      value={eventForm.image}
                      onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                    />
                  </div>

                  <div className="pt-4 border-t border-white/5 text-right space-x-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-wider">Cancel</button>
                    <button type="submit" className="px-6 py-2.5 bg-[#f6c86b] hover:bg-[#ffe6a6] text-[#3b3f3a] rounded-xl text-xs font-bold uppercase tracking-widest">Save Event</button>
                  </div>
                </form>
              )}

              {/* MODAL FORM: MEDIA */}
              {modalType === "media" && (
                <form onSubmit={handleSaveMedia} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-montserrat font-bold uppercase block mb-1">Media Type</label>
                      <select
                        value={mediaForm.type}
                        onChange={(e) => setMediaForm({ ...mediaForm, type: e.target.value })}
                        className="w-full bg-[#1c2420] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                      >
                        <option value="photo">Photo</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-montserrat font-bold uppercase block mb-1">Category</label>
                      <select
                        value={mediaForm.category}
                        onChange={(e) => setMediaForm({ ...mediaForm, category: e.target.value })}
                        className="w-full bg-[#1c2420] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                      >
                        <option value="Class Highlight">Class Highlight</option>
                        <option value="Performance">Performance</option>
                        <option value="Social Dance">Social Dance</option>
                        <option value="Workshop">Workshop</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-montserrat font-bold uppercase block mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={mediaForm.title}
                      onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-montserrat font-bold uppercase block mb-1">Thumbnail Cover URL</label>
                    <input
                      type="text"
                      required
                      value={mediaForm.thumbnail}
                      onChange={(e) => setMediaForm({ ...mediaForm, thumbnail: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                    />
                  </div>

                  {mediaForm.type === "video" && (
                    <div>
                      <label className="text-xs font-montserrat font-bold uppercase block mb-1">Video Stream URL (e.g. YouTube/Vimeo/MP4)</label>
                      <input
                        type="text"
                        value={mediaForm.url}
                        onChange={(e) => setMediaForm({ ...mediaForm, url: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/5 text-right space-x-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-wider">Cancel</button>
                    <button type="submit" className="px-6 py-2.5 bg-[#f6c86b] hover:bg-[#ffe6a6] text-[#3b3f3a] rounded-xl text-xs font-bold uppercase tracking-widest">Save Media</button>
                  </div>
                </form>
              )}

              {/* MODAL FORM: EVENT GALLERY */}
              {modalType === "eventGallery" && (
                <form onSubmit={handleSaveEventGallery} className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-montserrat font-bold uppercase block mb-1">Título do Evento</label>
                    <input
                      type="text"
                      required
                      value={eventGalleryForm.title}
                      onChange={(e) => setEventGalleryForm({ ...eventGalleryForm, title: e.target.value })}
                      placeholder="Ex: Zouk Summer Marathon 2024"
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-montserrat font-bold uppercase block mb-1">Data</label>
                      <input
                        type="text"
                        required
                        value={eventGalleryForm.date}
                        onChange={(e) => setEventGalleryForm({ ...eventGalleryForm, date: e.target.value })}
                        placeholder="Ex: 15-18 Ago 2024"
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-montserrat font-bold uppercase block mb-1">Localização</label>
                      <input
                        type="text"
                        required
                        value={eventGalleryForm.location}
                        onChange={(e) => setEventGalleryForm({ ...eventGalleryForm, location: e.target.value })}
                        placeholder="Ex: Hong Kong Central"
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-montserrat font-bold uppercase block mb-1">Categoria</label>
                      <select
                        value={eventGalleryForm.category}
                        onChange={(e) => setEventGalleryForm({ ...eventGalleryForm, category: e.target.value })}
                        className="w-full bg-[#1c2420] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                      >
                        <option value="Marathon">Marathon</option>
                        <option value="Festival">Festival</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Social Party">Social Party</option>
                        <option value="Bootcamp">Bootcamp</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-montserrat font-bold uppercase block mb-1">URL Imagem de Capa do Evento</label>
                    <input
                      type="text"
                      required
                      value={eventGalleryForm.coverImage}
                      onChange={(e) => setEventGalleryForm({ ...eventGalleryForm, coverImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-montserrat font-bold uppercase block mb-1">Descrição Breve do Evento</label>
                    <textarea
                      rows={2}
                      value={eventGalleryForm.description}
                      onChange={(e) => setEventGalleryForm({ ...eventGalleryForm, description: e.target.value })}
                      placeholder="Descrição dos destaques e momentos mágicos do evento..."
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-montserrat font-bold uppercase block mb-1">URLs das Fotos (uma URL por linha)</label>
                    <textarea
                      rows={6}
                      required
                      value={eventGalleryForm.photosText}
                      onChange={(e) => setEventGalleryForm({ ...eventGalleryForm, photosText: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-1...\nhttps://images.unsplash.com/photo-2..."
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs font-mono text-white focus:outline-none focus:border-[#f6c86b] leading-relaxed"
                    />
                    <p className="text-[10px] text-[#fff6da]/60 mt-1">Cole os links diretos das fotos para incluir na galeria do evento.</p>
                  </div>

                  <div className="pt-4 border-t border-white/5 text-right space-x-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-wider">Cancelar</button>
                    <button type="submit" className="px-6 py-2.5 bg-[#f6c86b] hover:bg-[#ffe6a6] text-[#3b3f3a] rounded-xl text-xs font-bold uppercase tracking-widest">Salvar Galeria</button>
                  </div>
                </form>
              )}

              {/* MODAL FORM: NEWS */}
              {modalType === "news" && (
                <form onSubmit={handleSaveNews} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-montserrat font-bold uppercase block mb-1">Article Title</label>
                      <input
                        type="text"
                        required
                        value={newsForm.title}
                        onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-montserrat font-bold uppercase block mb-1">Category</label>
                      <input
                        type="text"
                        required
                        value={newsForm.category}
                        onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                        placeholder="e.g. Announcement, Tips & Tutorials"
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-montserrat font-bold uppercase block mb-1">Date</label>
                      <input
                        type="text"
                        required
                        value={newsForm.date}
                        onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-montserrat font-bold uppercase block mb-1">Author</label>
                      <input
                        type="text"
                        required
                        value={newsForm.author}
                        onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-montserrat font-bold uppercase block mb-1">Excerpt (Short Summary)</label>
                    <input
                      type="text"
                      required
                      value={newsForm.excerpt}
                      onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-montserrat font-bold uppercase block mb-1">Content Body</label>
                    <textarea
                      rows={6}
                      required
                      value={newsForm.content}
                      onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b] leading-relaxed font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-montserrat font-bold uppercase block mb-1">Cover Image URL</label>
                    <input
                      type="text"
                      required
                      value={newsForm.image}
                      onChange={(e) => setNewsForm({ ...newsForm, image: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#f6c86b]"
                    />
                  </div>

                  <div className="pt-4 border-t border-white/5 text-right space-x-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-wider">Cancel</button>
                    <button type="submit" className="px-6 py-2.5 bg-[#f6c86b] hover:bg-[#ffe6a6] text-[#3b3f3a] rounded-xl text-xs font-bold uppercase tracking-widest">Publish Post</button>
                  </div>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
