import React from 'react'

const FooterLink = ({ href, children }) => {
  return (
    <li>
      <a href={href} className="text-white/90 hover:text-white hover:underline transition-all duration-200 font-medium">
        {children}
      </a>
    </li>
  );
};

const Footer = () => {
  return (
    <div>
      <footer className="bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white border-t-4 border-[#2ECC71] shadow-2xl">
        <div className="text-center pt-8 pb-8">
          <p className="font-semibold text-lg text-white/95">&copy; 2025 AYUSH Virtual Herbal Garden. All rights reserved.</p>

          <div className="flex justify-center space-x-8 mt-8 gap-20 flex-wrap px-4">
            <div>
              <h3 className="font-bold text-white mb-2 text-xl">Product</h3>
              <ul className="space-y-2">
                <FooterLink href="/home">🏠 Home</FooterLink>
                <FooterLink href="/enterprise">🏢 Enterprise</FooterLink>
                <FooterLink href="/pricing">💰 Pricing</FooterLink>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2 text-xl">Company</h3>
              <ul className="space-y-2">
                <FooterLink href="/terms">📋 Terms</FooterLink>
                <FooterLink href="/ai-policy">🤖 AI Policy</FooterLink>
                <FooterLink href="/privacy">🔒 Privacy</FooterLink>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2 text-xl">Resources</h3>
              <ul className="space-y-2">
                <FooterLink href="/faqs">❓ FAQs</FooterLink>
                <FooterLink href="/vo-legacy">📚 vO Legacy</FooterLink>
                <FooterLink href="https://vercel.com" target="_blank" rel="noopener noreferrer">🚀 Vercel</FooterLink>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2 text-xl">Social</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://x.com/moayush" className="hover:scale-110 transition-transform inline-flex">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjljjHnedCRCaCfzQwcK6qkflmLoUHgRpZAw&s"
                      alt="Twitter"
                      className="w-6 h-6 object-contain brightness-0 invert"
                    />
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/company/ministry-of-ayush/" className="hover:scale-110 transition-transform inline-flex">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScjcPGbp1efbFP79tFAuvepFdwQI9hnPJ9Nw&s"
                      alt="LinkedIn"
                      className="w-6 h-6 object-contain brightness-0 invert"
                    />
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/ministryofayush/" className="hover:scale-110 transition-transform inline-flex">
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
