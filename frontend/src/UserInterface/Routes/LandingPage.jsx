import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BookOpenIcon,
  CubeIcon,
  GlobeAltIcon,
  SparklesIcon,
  HeartIcon,
  UserIcon,
  MenuIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useAuth } from "../../AuthContext";
import { API_URL } from "../../api";
import LanguageSwitcher from "../../LanguageSwitcher";

function useProtectedNavigate() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  return (path) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };
}

export default function VirtualHerbalGardenHome() {
  const [dark, setDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <div className="min-h-screen font-sans bg-white dark:bg-[#0F1720] text-gray-900 dark:text-white transition-colors duration-500">
      <Navbar dark={dark} setDark={setDark} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <HeroSection />
      <FeaturedHerbs />
      <WhyChooseUs />
      <CategoriesSection />
      <TestimonialsSection />
      <NewsletterCTA />
      <Footer />
    </div>
  );
}

function Navbar({ dark, setDark, mobileMenuOpen, setMobileMenuOpen }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const protectedNavigate = useProtectedNavigate();

  const navLinks = [
    { label: t('nav.home'), key: 'home', path: "/landing", protected: false },
    { label: t('nav.3dModels'), key: '3d', path: "/home/virtualTour", protected: true },
    { label: t('nav.about'), key: 'about', path: "/home/about", protected: true },
  ];

  const handleNav = (item) => {
    if (item.path === "/landing") {
      navigate("/landing");
    } else {
      protectedNavigate(item.path);
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#0F1720]/90 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="container mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/landing")}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#2ECC71] to-[#87E08A] flex items-center justify-center shadow-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C9 6 4 7 4 13a8 8 0 0016 0c0-6-5-7-8-11z" fill="white" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide">{t('brand.name')}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('brand.tagline')}</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNav(item)}
              className="text-sm font-medium hover:text-[#2ECC71] dark:hover:text-[#58E07A] transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <button
            onClick={() => navigate("/login")}
            className="hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-tr from-[#2ECC71] to-[#87E08A] text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            <UserIcon className="w-5 h-5" />
            {t('nav.login')}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#0F1720] border-t border-gray-200 dark:border-gray-800 px-6 py-4 space-y-3">
          {navLinks.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                handleNav(item);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm font-medium hover:text-[#2ECC71]"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ herbs: 0, users: 0, categories: 0 });

  useEffect(() => {
    let mounted = true;
    fetch(`${API_URL}/users/stats`)
      .then((res) => res.json())
      .then((data) => {
        if (mounted) {
          setStats({
            herbs: data.herbs || 0,
            users: data.users || 0,
            categories: data.categories || 0,
          });
        }
      })
      .catch(() => {
        if (mounted) setStats({ herbs: 0, users: 0, categories: 0 });
      });
    return () => { mounted = false; };
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#E6FFF5] to-[#B8F6D1] dark:from-[#0F1720] dark:to-[#153726] py-20 lg:py-32">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#2ECC71]/30 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-6">
          <span className="inline-block px-4 py-1 rounded-full bg-[#2ECC71]/20 text-[#2ECC71] dark:text-[#58E07A] text-sm font-semibold">
            🌿 {stats.herbs ? `${stats.herbs}+` : '100+'} {t('landing.heroBadgePlural')}
          </span>
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
            {t('landing.heroTitle1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ECC71] to-[#58E07A]">{t('landing.heroTitle2')}</span> {t('landing.heroTitle3')}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('landing.heroSubtitle')}
          </p>
          <HeroButtonsSection />
          <div className="flex items-center gap-8 pt-4">
            <Stat number={stats.herbs ? `${stats.herbs}+` : '100+'} label={t('landing.statPlants')} />
            <Stat number={stats.categories ? `${stats.categories}+` : '15+'} label={t('landing.statCategories')} />
            <Stat number={stats.users ? `${stats.users}+` : '5K+'} label={t('landing.statUsers')} />
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
            <img
              src="/IMG/lush-green-herb-garden-flourishing-under-gentle-rainfall-vibrant-foliage-basking-sunlight-generative-ai-aesthetic-image-398924704.webp"
              alt="Medicinal herbs garden"
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white dark:bg-[#0B1220] p-6 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 max-w-xs">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#E6FFEB] dark:bg-[#0F2B1F] flex items-center justify-center">
                <SparklesIcon className="w-8 h-8 text-[#2ECC71]" />
              </div>
              <div>
                <h4 className="font-bold text-lg">{t('landing.interactiveLearning')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('landing.interactiveLearningDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroButtonsSection() {
  const { t } = useTranslation();
  const protectedNavigate = useProtectedNavigate();
  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={() => protectedNavigate("/home/virtualTour")}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#2ECC71] text-[#2ECC71] dark:text-[#58E07A] font-semibold hover:bg-[#2ECC71] hover:text-white transition"
      >
        <CubeIcon className="w-5 h-5" />
        {t('landing.heroCta')}
      </button>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div>
      <div className="text-3xl font-bold text-[#2ECC71]">{number}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  );
}

function FeaturedHerbs() {
  const { t } = useTranslation();
  const herbs = [
    {
      name: "Tulsi (Holy Basil)",
      latin: "Ocimum sanctum",
      uses: "Respiratory health, immunity booster",
      image: "/IMG/Tulsi.webp",
    },
    {
      name: "Aloe Vera",
      latin: "Aloe barbadensis",
      uses: "Skin healing, digestive support",
      image: "/IMG/download.jpg",
    },
    {
      name: "Ashwagandha",
      latin: "Withania somnifera",
      uses: "Stress relief, adaptogen",
      image: "/IMG/images (1).jpg",
    },
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-[#071519]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-4">{t('landing.featuredTitle')}</h2>
          <p className="text-gray-600 dark:text-gray-400">{t('landing.featuredSubtitle')}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {herbs.map((herb, i) => (
            <HerbCard key={i} {...herb} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HerbCard({ name, latin, uses, image }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="group bg-white dark:bg-[#0F1720] rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:scale-105 transition-all duration-300">
      <div className="relative overflow-hidden h-56">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/70 px-3 py-1 rounded-full text-xs font-semibold">
          <HeartIcon className="w-4 h-4 inline text-red-500" />
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className="text-sm italic text-gray-500 dark:text-gray-400 mb-3">{latin}</p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{uses}</p>
        <button
          onClick={() => navigate("/home/story")}
          className="inline-flex items-center gap-2 text-[#2ECC71] dark:text-[#58E07A] font-semibold hover:underline"
        >
          {t('common.learnMore')} →
        </button>
      </div>
    </div>
  );
}

function WhyChooseUs() {
  const { t } = useTranslation();
  const features = [
    { icon: <BookOpenIcon className="w-8 h-8" />, title: t('landing.featureDatabase'), desc: t('landing.featureDatabaseDesc') },
    { icon: <CubeIcon className="w-8 h-8" />, title: t('landing.feature3d'), desc: t('landing.feature3dDesc') },
    { icon: <GlobeAltIcon className="w-8 h-8" />, title: t('landing.featureMultilingual'), desc: t('landing.featureMultilingualDesc') },
    { icon: <SparklesIcon className="w-8 h-8" />, title: t('landing.featureUpdates'), desc: t('landing.featureUpdatesDesc') },
  ];

  return (
    <section className="py-20 bg-white dark:bg-[#0F1720]">
      <div className="container mx-auto px-6 lg:px-12">
        <h2 className="text-4xl font-extrabold text-center mb-12">{t('landing.whyChoosePlatform')}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-[#071519] border border-gray-100 dark:border-gray-800 hover:shadow-lg transition">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#E6FFEB] dark:bg-[#0F2B1F] flex items-center justify-center text-[#2ECC71]">
                {f.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  const { t } = useTranslation();
  const protectedNavigate = useProtectedNavigate();
  const categories = [
    { name: "Respiratory", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300", count: 25 },
    { name: "Digestive", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300", count: 18 },
    { name: "Skin Care", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300", count: 22 },
    { name: "Immunity", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300", count: 30 },
    { name: "Pain Relief", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300", count: 15 },
    { name: "Mental Health", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300", count: 12 },
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-[#071519]">
      <div className="container mx-auto px-6 lg:px-12">
        <h2 className="text-4xl font-extrabold text-center mb-12">{t('landing.categoriesTitle')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => protectedNavigate("/home/virtualTour")}
              className={`${cat.color} p-6 rounded-2xl text-center font-semibold hover:scale-105 transition shadow-md`}
            >
              <div className="text-2xl mb-2">{cat.count}</div>
              <div className="text-sm">{cat.name}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const { t } = useTranslation();
  const testimonials = [
    { name: "Dr. Priya Sharma", role: "Ayurvedic Practitioner", text: "An invaluable resource for anyone interested in herbal medicine. The 3D models are exceptional!" },
    { name: "Rahul Mehta", role: "Botany Student", text: "Perfect for my research. The multilingual support makes it accessible to my entire family." },
    { name: "Anita Desai", role: "Home Gardener", text: "I've learned so much about native plants. The interface is beautiful and easy to navigate." },
  ];

  return (
    <section className="py-20 bg-white dark:bg-[#0F1720]">
      <div className="container mx-auto px-6 lg:px-12">
        <h2 className="text-4xl font-extrabold text-center mb-12">{t('landing.testimonialsTitle')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="p-6 rounded-2xl bg-gray-50 dark:bg-[#071519] border border-gray-100 dark:border-gray-800 shadow-md">
              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#2ECC71] to-[#87E08A]" />
                <div>
                  <div className="font-bold">{t.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterCTA() {
  const { t } = useTranslation();
  return (
    <section className="py-16 bg-gradient-to-tr from-[#E6FFF5] to-[#B8F6D1] dark:from-[#0F1720] dark:to-[#153726]">
      <div className="container mx-auto px-6 lg:px-12 text-center">
        <h2 className="text-4xl font-extrabold mb-4">{t('landing.newsletterTitle2')}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          {t('landing.newsletterSubtitle2')}
        </p>
        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder={t('landing.newsletterEmail')}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#2ECC71] outline-none"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-tr from-[#2ECC71] to-[#87E08A] text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            {t('landing.newsletterCta')}
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const protectedNavigate = useProtectedNavigate();
  return (
    <footer className="py-12 bg-white dark:bg-[#0C1821] border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{t('brand.name')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('footer.tagline')}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('landing.quickLinks')}</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => protectedNavigate("/home/virtualTour")} className="hover:text-[#2ECC71]">{t('nav.3dModels')}</button></li>
              <li><button onClick={() => protectedNavigate("/home/virtualTour")} className="hover:text-[#2ECC71]">{t('nav.virtualTour')}</button></li>
              <li><button onClick={() => protectedNavigate("/home/about")} className="hover:text-[#2ECC71]">{t('nav.about')}</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('footer.resources')}</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => protectedNavigate("/home/story")} className="hover:text-[#2ECC71]">{t('footer.blog')}</button></li>
              <li><button onClick={() => protectedNavigate("/home/about")} className="hover:text-[#2ECC71]">{t('home.featuredTitle')}</button></li>
              <li><button onClick={() => navigate("/landing")} className="hover:text-[#2ECC71]">{t('nav.home')}</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('landing.legal')}</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigate("/landing")} className="hover:text-[#2ECC71]">{t('landing.privacyPolicy')}</button></li>
              <li><button onClick={() => navigate("/landing")} className="hover:text-[#2ECC71]">{t('landing.termsOfService')}</button></li>
              <li><button onClick={() => navigate("/landing")} className="hover:text-[#2ECC71]">{t('landing.contact')}</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          © 2025 Virtual Herbal Garden. {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
}