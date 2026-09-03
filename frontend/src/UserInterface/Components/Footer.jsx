import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const FooterLink = ({ to, href, children }) => {
  return (
    <li>
      {to ? (
        <Link to={to} className="text-white/90 hover:text-white hover:underline transition-all duration-200 font-medium">
          {children}
        </Link>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white hover:underline transition-all duration-200 font-medium">
          {children}
        </a>
      )}
    </li>
  );
};

const Footer = () => {
  const { t } = useTranslation();
  return (
    <div>
      <footer className="bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white border-t-4 border-[#2ECC71] shadow-2xl">
        <div className="text-center pt-8 pb-8">
          <p className="font-semibold text-lg text-white/95">&copy; 2025 AYUSH Virtual Herbal Garden. {t('footer.rights')}</p>

          <div className="flex justify-center gap-6 sm:gap-10 lg:gap-20 mt-8 flex-wrap px-4">
            <div>
              <h3 className="font-bold text-white mb-2 text-xl">{t('footer.product')}</h3>
              <ul className="space-y-2">
                <FooterLink to="/home">🏠 {t('footer.home')}</FooterLink>
                <FooterLink to="/home/virtualTour">🌿 {t('footer.3dModels')}</FooterLink>
                <FooterLink to="/home/about">📖 {t('footer.about')}</FooterLink>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2 text-xl">{t('footer.company')}</h3>
              <ul className="space-y-2">
                <FooterLink to="/home/story">📰 {t('footer.blog')}</FooterLink>
                <FooterLink to="/login">🔐 {t('footer.login')}</FooterLink>
                <FooterLink to="/register">📝 {t('footer.register')}</FooterLink>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2 text-xl">{t('footer.resources')}</h3>
              <ul className="space-y-2">
                <FooterLink to="/landing">🌱 {t('footer.explore')}</FooterLink>
                <FooterLink to="/logout">🚪 {t('footer.logout')}</FooterLink>
                <FooterLink href="https://main.ayush.gov.in/">🏛️ {t('footer.ayush')}</FooterLink>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2 text-xl">{t('footer.social')}</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://x.com/moayush" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform inline-flex">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjljjHnedCRCaCfzQwcK6qkflmLoUHgRpZAw&s"
                      alt="Twitter"
                      className="w-6 h-6 object-contain brightness-0 invert"
                    />
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/company/ministry-of-ayush/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform inline-flex">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScjcPGbp1efbFP79tFAuvepFdwQI9hnPJ9Nw&s"
                      alt="LinkedIn"
                      className="w-6 h-6 object-contain brightness-0 invert"
                    />
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/ministryofayush/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform inline-flex">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHo1V9_FOjV4Tr7VwJ_NQoCMZ4-Y7Swqzsog&s"
                      alt="Instagram"
                      className="w-6 h-6 object-contain brightness-0 invert"
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;