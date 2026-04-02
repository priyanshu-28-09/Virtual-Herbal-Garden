import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Model3D = ({ plant }) => {
  const [hasError, setHasError] = useState(false);
  const modelId = plant._3DId || plant["3dId"] || plant.threeId;

  if (modelId && modelId.trim() !== "" && !hasError) {
    return (
      <div className="relative w-full max-w-md mx-auto aspect-video rounded-xl overflow-hidden shadow-lg border border-green-200">
        <iframe
          title={`3D Model - ${plant.name}`}
          src={`https://sketchfab.com/models/${modelId}/embed?autostart=1&ui_theme=dark`}
          allowFullScreen
          allow="autoplay; fullscreen; xr-spatial-tracking"
          className="absolute top-0 left-0 w-full h-full"
          style={{ border: "none" }}
          onLoad={(e) => {
            setTimeout(() => {
              try {
                const iframeDoc =
                  e.target.contentDocument || e.target.contentWindow.document;
                if (
                  iframeDoc.title.includes("404") ||
                  iframeDoc.title.includes("Error")
                ) {
                  setHasError(true);
                }
              } catch {}
            }, 2000);
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-80 bg-gradient-to-br from-[#E6FFF5] to-[#B8F6D1] flex flex-col items-center justify-center rounded-xl shadow-lg border-2 border-[#2ECC71]/30">
      <div className="text-6xl mb-3 animate-bounce">🌿</div>
      <p className="text-gray-700 font-semibold text-lg">{plant.name}</p>
      <p className="text-sm text-gray-600 mt-2">3D Model Coming Soon</p>
    </div>
  );
};

const PlantCard = ({ plant, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.isIntersecting && setIsVisible(true));
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      className="bg-white dark:bg-[#0F1720] rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-shadow"
    >
      <div className="grid md:grid-cols-2">
        {index % 2 === 0 ? (
          <>
            <div className="p-6 bg-gray-50 dark:bg-[#1a2f24] hover:scale-[1.02] transition-transform duration-300">
              <Model3D plant={plant} />
            </div>
            <div className="p-6 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 hover:text-[#2ECC71] transition-colors">
                {plant.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 italic text-sm mb-4">
                {plant.scientificName}
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {plant.description}
              </p>
              {plant.referenceLink && (
                <a
                  href={plant.referenceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2ECC71] hover:text-[#1ea85a] font-medium transition-transform duration-300 hover:translate-x-2 inline-block"
                >
                  {/* Learn more → */}
                </a>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="p-6 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 hover:text-[#2ECC71] transition-colors">
                {plant.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 italic text-sm mb-4">
                {plant.scientificName}
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {plant.description}
              </p>
              {plant.referenceLink && (
                <a
                  href={plant.referenceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2ECC71] hover:text-[#1ea85a] font-medium transition-transform duration-300 hover:translate-x-2 inline-block"
                >
                  {/* Learn more → */}
                </a>
              )}
            </div>
            <div className="p-6 bg-gray-50 dark:bg-[#1a2f24] hover:scale-[1.02] transition-transform duration-300">
              <Model3D plant={plant} />
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

const VirtualTour = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/herbs");
        const data = await res.json();
        setPlants(data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlantData();

    const timer = setTimeout(() => setShowIntro(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#0F1720]">
      {/* Intro Animation */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#2ECC71] to-[#1ea85a] text-white"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-5xl font-extrabold tracking-wide"
            >
              🌿 Virtual Herbal Garden Tour
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-4 text-lg text-white/90"
            >
              Experience nature like never before
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content */}
      {!loading && !showIntro && (
        <motion.div
          className="py-12 px-4 max-w-6xl mx-auto space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Virtual Herbal <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ECC71] to-[#58E07A]">Garden Tour</span>
            </h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              Explore {plants.length} medicinal plants in stunning 3D
            </p>
            <div className="mt-4 h-1 w-32 bg-gradient-to-r from-[#2ECC71] to-[#87E08A] rounded-full mx-auto"></div>
          </div>

          {plants.map((plant, index) => (
            <PlantCard key={plant._id || index} plant={plant} index={index} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default VirtualTour;
