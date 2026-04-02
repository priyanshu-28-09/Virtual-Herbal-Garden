import React, { useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your Herbal Garden Assistant. Ask me about herbs, remedies, or anything about plants!", sender: "bot" }
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
          console.log("🔑 Using Gemini API...");
          
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
        console.log("📚 Using herb knowledge base...");
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
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-96 sm:w-[500px] md:w-[600px] mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom h-[600px] border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2ECC71] via-[#58E07A] to-[#87E08A] text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <div>
                <h3 className="font-bold text-lg">🌿 Herbal Assistant</h3>
                <p className="text-xs text-white/80">Always here to help</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
              aria-label="Close chat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white space-y-4 p-5 scroll-smooth">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom duration-300`}
              >
                <div
                  className={`max-w-sm px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white rounded-br-none shadow-lg"
                      : "bg-white text-gray-800 shadow-md border border-gray-200 rounded-bl-none"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-md border border-gray-200 rounded-bl-none px-5 py-3 rounded-2xl">
                  <div className="flex gap-2 items-center">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-[#2ECC71] rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-[#2ECC71] rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></span>
                      <span className="w-2 h-2 bg-[#2ECC71] rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></span>
                    </div>
                    <span className="text-gray-600 text-sm">Assistant is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-5 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={loading}
                placeholder="Ask about herbs..."
                className="flex-1 px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent disabled:bg-gray-100 text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white p-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:scale-100"
                aria-label="Send message"
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
        className={`bg-gradient-to-br from-[#2ECC71] to-[#1ea85a] text-white w-20 h-20 rounded-full shadow-2xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center border-4 border-white relative ${isOpen ? 'rotate-180' : ''}`}
        aria-label="Toggle chat"
        title="Chat with our Herbal Assistant"
      >
        <svg 
          className="w-10 h-10 transition-transform duration-300" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          <circle cx="12" cy="10" r="1.5"/>
          <circle cx="8" cy="10" r="1.5"/>
          <circle cx="16" cy="10" r="1.5"/>
        </svg>
        {!isOpen && <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>}
      </button>
    </div>
  );
};

export default Chatbot;