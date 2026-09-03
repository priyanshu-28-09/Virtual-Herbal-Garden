import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import fallbackPlants from "./data/plants";
import { API_URL, SERVER_URL } from "./api";

const Model3D = ({ plant }) => {
  const { t } = useTranslation();
  const modelId = plant?._3DId || plant?.["3dId"] || plant?.threeId;
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [modelId]);

  const sketchfabUrl = modelId
    ? `https://sketchfab.com/models/${modelId}/embed?autostart=1&ui_theme=dark`
    : null;

  const showImageFallback = !modelId || failed;

  return (
    <div className="relative w-full max-w-full mx-auto aspect-[14/10] rounded-[28px] overflow-hidden shadow-[0_35px_80px_-40px_rgba(0,0,0,0.35)] border border-emerald-100 bg-white/90">
      {showImageFallback ? (
        <div className="w-full h-full bg-[radial-gradient(circle_at_top,_#e9fff1,_#d7f6e3,_#f8fff9)] flex items-center justify-center p-4">
          <img
            src={plant?.image?.startsWith('/') ? `${SERVER_URL}${plant.image}` : plant?.image || "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80"}
            alt={plant?.name || "Herb preview"}
            className="h-full w-full object-cover rounded-[28px] border border-emerald-100 shadow-inner"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-slate-950/10 py-4 px-5 text-center">
            <p className="text-sm font-semibold text-slate-700">
              {modelId ? t('tour.modelFailedMsg') : t('tour.modelNone')}
            </p>
          </div>
        </div>
      ) : (
        <>
          <iframe
            title={`3D Model - ${plant?.name || "Plant"}`}
            src={sketchfabUrl}
            allowFullScreen
            allow="autoplay; fullscreen; xr-spatial-tracking"
            className="absolute inset-0 w-full h-full"
            style={{ border: "none" }}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
          {!loaded && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-[28px] bg-slate-950/30 text-white">
              <div className="h-12 w-12 rounded-full border border-white/30 bg-white/10 animate-pulse" />
              <p className="text-sm sm:text-base font-medium">{t('tour.modelLoading')}</p>
            </div>
          )}
          <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-800">
            {t('tour.modelBadge')}
          </div>
          <div className="absolute left-4 bottom-4 right-4 flex flex-wrap items-center justify-between gap-2 rounded-3xl bg-white/85 px-4 py-3 text-xs text-slate-700">
            <span>{plant?.name || t('tour.unnamedPlant')} preview</span>
            <a
              href={`https://sketchfab.com/models/${modelId}`}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-emerald-700 underline"
            >
              {t('tour.openSketchfab')}
            </a>
          </div>
        </>
      )}
    </div>
  );
};

const PlantCard = ({ plant, index }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.18 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const category = plant?.category || t('tour.cardCategoryFallback');
  const uses = plant?.uses || plant?.medicinalMethod || t('tour.usesFallback');
  const care = plant?.careInstructions || plant?.habitat || t('tour.careFallback');
  const referenceLink = plant?.referenceLink || "#";

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: index * 0.08 }}
      className="rounded-[32px] overflow-hidden shadow-[0_35px_90px_-60px_rgba(15,46,34,0.45)] border border-emerald-100 bg-white/95"
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="p-6 bg-[#f3fff4]">
          <Model3D plant={plant} />
        </div>
        <div className="p-8 flex flex-col justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-900">
                {category}
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-xs text-slate-600">
                {plant?.scientificName || t('tour.sciNameMissing')}
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">{plant?.name || t('tour.unnamedPlant')}</h2>
            <p className="text-slate-600 leading-relaxed">{plant?.description || t('tour.noDesc')}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] bg-white border border-emerald-100 p-5 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 mb-3">{t('tour.usesTitle')}</h3>
              <p className="text-sm leading-relaxed text-slate-700">{uses}</p>
            </div>
            <div className="rounded-[28px] bg-slate-950 text-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200 mb-3">{t('tour.careTitle')}</h3>
              <p className="text-sm leading-relaxed text-slate-100">{care}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] bg-slate-50 p-5 border border-slate-200">
              <h3 className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">{t('tour.prepTitle')}</h3>
              <p className="text-sm text-slate-700">{plant?.plantSuccess || t('tour.prepFallback')}</p>
            </div>
            <div className="rounded-[28px] bg-white p-5 border border-emerald-100">
              <h3 className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">{t('tour.moreInfo')}</h3>
              <a
                href={referenceLink}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-emerald-700 hover:text-emerald-900"
              >
                {t('tour.learnMore')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const VirtualTour = () => {
  const { t } = useTranslation();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showIntro, setShowIntro] = useState(true);

  const getImageSource = (image) => {
    if (!image) return 'https://via.placeholder.com/800x600?text=Herb+Image';
    return image.startsWith('/') ? `${SERVER_URL}${image}` : image;
  };

  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        const res = await fetch(`${API_URL}/herbs`);

        if (!res.ok) {
        }

        const data = await res.json();

        // Normalize response shape to an array
        const herbsArray = Array.isArray(data)
          ? data
          : Array.isArray(data.herbs)
          ? data.herbs
          : Array.isArray(data.data)
          ? data.data
          : [];

        if (herbsArray.length === 0) {
          // Backend returned an empty list — use local sample data
          console.warn('⚠️ /api/herbs returned empty array, using local fallback data.');
          setErrorMessage(t('tour.errorNoHerbs'));
          setPlants(fallbackPlants);
        } else {
          setPlants(herbsArray);
        }
      } catch (err) {
        console.error("Error fetching plants:", err);
        setErrorMessage(t('tour.errorLoadFailed'));
        setPlants(fallbackPlants);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantData();
    const timer = setTimeout(() => setShowIntro(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#f6fff6] dark:bg-[#071409]">
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#2ecc7180] via-[#75ffb780] to-[#ffffffcc] text-slate-900 px-6"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              initial={{ scale: 0.82, opacity: 0 }}
              animate={{ scale: 1.02, opacity: 1 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight"
            >
              🌿 {t('tour.introTitle')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1 }}
              className="mt-4 max-w-2xl text-base md:text-lg text-slate-700"
            >
              {t('tour.introSubtitle')}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && !showIntro && (
        <motion.div
          className="py-12 px-6 max-w-7xl mx-auto space-y-10"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        >
          <header className="rounded-[36px] border border-emerald-100 bg-white/90 p-8 shadow-[0_20px_80px_-45px_rgba(0,0,0,0.18)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-4">
                <div className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-900">
                  {t('tour.badge')}
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                  {t('tour.heading')}
                </h1>
                <p className="max-w-2xl text-slate-600 leading-relaxed">
                  {t('tour.subheading')}
                </p>
              </div>
              <div className="rounded-3xl bg-gradient-to-br from-[#e8fff0] to-[#d4f8dd] p-6 text-slate-800 shadow-inner">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{t('tour.availableLabel')}</p>
                <p className="mt-2 text-5xl font-extrabold text-emerald-800">{plants.length}</p>
                <p className="text-sm text-slate-600">{t('tour.availableReady')}</p>
              </div>
            </div>
            {errorMessage && (
              <div className="mt-6 rounded-3xl bg-emerald-50 border border-emerald-200 px-5 py-4 text-sm text-emerald-900">
                {errorMessage}
              </div>
            )}
          </header>

          {plants.length === 0 ? (
            <div className="rounded-[32px] bg-[#f3fff4] border border-emerald-100 p-10 text-center text-slate-700 shadow-sm">
              <h2 className="text-2xl font-semibold mb-2">{t('tour.noPlants')} 🌱</h2>
              <p>{t('tour.noPlantsDesc')}</p>
            </div>
          ) : (
            <div className="grid gap-8">
              {plants.map((plant, index) => (
                <PlantCard key={plant._id || plant.id || index} plant={plant} index={index} />
              ))}
            </div>
          )}
        </motion.div>
      )}

      {loading && !showIntro && (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="rounded-[32px] border border-emerald-100 bg-white/95 p-8 shadow-lg text-center">
            <p className="text-xl font-semibold text-emerald-800">{t('tour.loadingPlants')}</p>
            <p className="mt-2 text-slate-600">{t('tour.loadingDesc')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualTour;
