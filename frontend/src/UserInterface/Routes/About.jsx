import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6FFF5] to-[#B8F6D1] dark:from-[#0F1720] dark:to-[#153726] py-12 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#2ECC71] to-[#58E07A] bg-clip-text text-transparent mb-4">
            🌿 {t('about.title')}
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
            {t('about.subtitle')}
          </p>
          <div className="h-1 w-40 bg-gradient-to-r from-[#2ECC71] to-[#87E08A] rounded-full mx-auto"></div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-[#0F1720] rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-all duration-300">
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2ECC71] to-[#58E07A] mb-4">{t('about.missionTitle')}</h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              {t('about.missionDesc')}
            </p>
          </div>

          <div className="bg-white dark:bg-[#0F1720] rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-all duration-300">
            <div className="text-4xl mb-4">✨</div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2ECC71] to-[#58E07A] mb-4">{t('about.visionTitle')}</h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              {t('about.visionDesc')}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">{t('about.whyChooseUs')}</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#0F1720] p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 text-center">
              <div className="text-5xl mb-4">📚</div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('about.featureKnowledge')}</h4>
              <p className="text-gray-700 dark:text-gray-300">
                {t('about.featureKnowledgeDesc')}
              </p>
            </div>
            <div className="bg-white dark:bg-[#0F1720] p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 text-center">
              <div className="text-5xl mb-4">🎮</div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('about.featureInteractive')}</h4>
              <p className="text-gray-700 dark:text-gray-300">
                {t('about.featureInteractiveDesc')}
              </p>
            </div>
            <div className="bg-white dark:bg-[#0F1720] p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 text-center">
              <div className="text-5xl mb-4">🌍</div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('about.featureCommunity')}</h4>
              <p className="text-gray-700 dark:text-gray-300">
                {t('about.featureCommunityDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-[#E6FFF5] to-[#B8F6D1] dark:from-[#1a2f24] dark:to-[#0F1720] p-12 rounded-2xl border-2 border-[#2ECC71] border-dashed">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('about.joinTitle')}</h3>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            {t('about.joinDesc')}
          </p>
          <div className="text-5xl mb-4">🌱</div>
          <p className="text-lg text-[#2ECC71] font-semibold">
            {t('about.joinTagline')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;