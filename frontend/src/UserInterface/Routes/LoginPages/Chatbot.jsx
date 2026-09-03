import React, { useState } from "react";
import { useTranslation } from 'react-i18next';

// Mock responses for testing (remove after API is working)
const herbKnowledge = {
  "tulsi": "Tulsi (Holy Basil) is an amazing adaptogenic herb with anti-inflammatory properties. It helps reduce stress, boost immunity, and improve digestion. Perfect for making herbal tea!",
  "neem": "Neem is a powerful detoxifying herb used in Ayurveda for centuries. Great for skin health, fighting infections, and purifying the blood. Often used in face masks and oral care.",
  "ginger": "Ginger is excellent for digestion, reduces nausea, and has strong anti-inflammatory properties. Perfect for tea, cooking, or medicinal preparations. Great for immune support!",
  "ashwagandha": "Ashwagandha is an adaptogenic herb that helps manage stress and anxiety. It improves sleep quality, boosts energy, and supports overall wellness. A key herb in Ayurvedic medicine.",
  "aloe": "Aloe vera is a cooling herb perfect for skin care and digestive health. It soothes burns, supports gut health, and has detoxifying properties. Use gel topically or juice internally.",
  "mint": "Mint is refreshing and aids digestion, relieves headaches, and freshens breath. Great in tea, smoothies, or salads. Has natural cooling and soothing properties.",
  "default": "That's a great question about herbs! I'd love to help. Please try asking about specific herbs like Tulsi, Neem, Ginger, Ashwagandha, Aloe, or Mint for detailed information."
};

const getHerbResponse = (text) => {
  const query = text.toLowerCase();
  for (let herb in herbKnowledge) {
    if (query.includes(herb)) {
      return herbKnowledge[herb];
    }
  }
  return herbKnowledge.default;
};

const Chatbot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: t('chat.greeting'), sender: "bot" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const userMessage = inputValue;
      setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
      setInputValue("");
      setLoading(true);

      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        // If API key exists, try to use Gemini API
        if (apiKey) {
          
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{
                  parts: [{
                    text: `You are a helpful herbal garden assistant. Answer briefly (2-3 sentences) about herbs, plants, and natural remedies. Question: ${userMessage}`
                  }]
                }],
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 200
                }
              })
            }
          );

          if (response.ok) {
            const data = await response.json();
            const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (botReply) {
              setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
              setLoading(false);
              return;
            }
          }
        }

        // Fallback: Use mock herb knowledge base
        const fallbackReply = getHerbResponse(userMessage);
        setMessages((prev) => [...prev, { text: fallbackReply, sender: "bot" }]);

      } catch (error) {
        console.error("❌ Error:", error);
        
        // Last resort: Use mock response
        const fallbackReply = getHerbResponse(userMessage);
        setMessages((prev) => [...prev, { text: fallbackReply, sender: "bot" }]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-[#0F1720] rounded-2xl shadow-2xl w-screen sm:w-[450px] md:w-[600px] mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom h-[600px] border border-gray-200 dark:border-gray-800 max-w-[96vw]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2ECC71] via-[#58E07A] to-[#87E08A] text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <div>
                <h3 className="font-bold text-lg">🌿 {t('chat.title')}</h3>
                <p className="text-xs text-white/80">{t('chat.subtitle')}</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
              aria-label={t('chat.closeAria')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white dark:from-[#0B1120] dark:to-[#0F1720] space-y-4 p-5 scroll-smooth">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom duration-300`}
              >
                <div
                  className={`max-w-sm px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white rounded-br-none shadow-lg"
                      : "bg-white dark:bg-[#071519] text-gray-800 dark:text-gray-200 shadow-md border border-gray-200 dark:border-gray-700 rounded-bl-none"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-[#071519] text-gray-800 dark:text-gray-200 shadow-md border border-gray-200 dark:border-gray-700 rounded-bl-none px-5 py-3 rounded-2xl">
                  <div className="flex gap-2 items-center">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-[#2ECC71] rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-[#2ECC71] rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></span>
                      <span className="w-2 h-2 bg-[#2ECC71] rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></span>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{t('chat.thinking')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-5 bg-gradient-to-r from-gray-50 to-white dark:from-[#0B1120] dark:to-[#0F1720] border-t border-gray-200 dark:border-gray-800">
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={loading}
                placeholder={t('chat.placeholder')}
                className="flex-1 px-5 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white p-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:scale-100"
                aria-label={t('chat.sendAria')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button - Always Visible */}
      <button
        onClick={toggleChat}
        className={`bg-gradient-to-br from-[#2ECC71] to-[#1ea85a] text-white w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full shadow-2xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center border-4 border-white dark:border-gray-800 relative ${isOpen ? 'rotate-180' : ''}`}
        aria-label={t('chat.toggleAria')}
        title={t('chat.toggleTitle')}
      >
        <svg 
          className="w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          <circle cx="12" cy="10" r="1.5"/>
          <circle cx="8" cy="10" r="1.5"/>
          <circle cx="16" cy="10" r="1.5"/>
        </svg>
        {!isOpen && <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse"></div>}
      </button>
    </div>
  );
};

export default Chatbot;