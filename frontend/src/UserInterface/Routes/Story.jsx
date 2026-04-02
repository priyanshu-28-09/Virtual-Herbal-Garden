import React, { useState } from 'react';

const herbalStories = [
  {
    id: 1,
    title: "Turmeric: Golden Healer",
    category: "Medicinal Herbs",
    image: "https://images.unsplash.com/photo-1596040799555-a7a0b24bada7?w=400&h=300&fit=crop",
    description: "Turmeric has been used in Ayurveda for thousands of years. Its active compound, curcumin, has powerful anti-inflammatory and antioxidant properties. Learn how to use turmeric in your daily wellness routine.",
    content: "Turmeric (Curcuma longa) is a golden-yellow spice with remarkable healing properties. Rich in curcumin, it's used to reduce inflammation, support digestion, and boost immunity. Add it to warm milk, curries, or smoothies for maximum benefits."
  },
  {
    id: 2,
    title: "Ashwagandha: Stress Relief",
    category: "Adaptogens",
    image: "https://images.unsplash.com/photo-1599599810694-f3a0ca6fdf28?w=400&h=300&fit=crop",
    description: "Ashwagandha is an ancient adaptogenic herb that helps your body manage stress and anxiety. Discover how this powerful herb can improve sleep quality and mental clarity.",
    content: "Ashwagandha (Withania somnifera) is a cornerstone of Ayurvedic medicine. It helps balance cortisol levels, reduces anxiety, and promotes deep, restorative sleep. Take it as a powder mixed with warm milk or water."
  },
  {
    id: 3,
    title: "Neem: Nature's Purifier",
    category: "Detox Herbs",
    image: "https://images.unsplash.com/photo-1591847456485-add146cbee02?w=400&h=300&fit=crop",
    description: "Neem is nature's antibiotic and detoxifier. Used for centuries in traditional medicine for skin health, neem offers antibacterial and antifungal benefits.",
    content: "Neem leaves are incredibly versatile. Use neem oil for skin care, neem tea for detoxification, or neem powder for oral health. Its strong antibacterial properties make it excellent for fighting infections naturally."
  },
  {
    id: 4,
    title: "Ginger: Digestive Fire",
    category: "Spices",
    image: "https://images.unsplash.com/photo-1596040799555-5a0f8e3e4a0f?w=400&h=300&fit=crop",
    description: "Ginger warms the body, aids digestion, and relieves nausea. This versatile root has been a staple in traditional medicine for thousands of years.",
    content: "Fresh ginger root is a powerhouse for digestive health. It stimulates the digestive fire (agni), reduces bloating, and alleviates nausea. Brew ginger tea or add fresh ginger to your meals for optimal benefits."
  },
  {
    id: 5,
    title: "Basil: Sacred Healer",
    category: "Culinary Herbs",
    image: "https://images.unsplash.com/photo-1591847456485-add146cbee02?w=400&h=300&fit=crop",
    description: "Holy basil (Tulsi) is revered as a sacred herb in Indian culture. It boosts immunity, reduces stress, and supports respiratory health.",
    content: "Tulsi or Holy Basil is known as 'The Queen of Herbs' in Ayurveda. Rich in antioxidants, it strengthens the immune system and promotes mental clarity. Brew fresh tulsi leaves into a refreshing tea."
  },
  {
    id: 6,
    title: "Aloe Vera: Cooling Miracle",
    category: "Topical Herbs",
    image: "https://images.unsplash.com/photo-1596040799555-a7a0b24bada7?w=400&h=300&fit=crop",
    description: "Aloe vera is nature's cooling balm. Used internally and externally, it supports skin health, digestion, and overall wellness.",
    content: "Aloe vera gel soothes burnt or inflamed skin instantly. Its cooling properties make it perfect for treating minor burns, sunburns, and skin irritations. Also great for digestive health when consumed safely."
  }
];

const Story = () => {
  const [selectedStory, setSelectedStory] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6FFF5] to-[#B8F6D1] dark:from-[#0F1720] dark:to-[#153726] py-12 px-6">
      {/* Header */}
      <div className="text-center mb-12 max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-[#2ECC71] to-[#58E07A] bg-clip-text text-transparent mb-4">
          🌿 Herbal Wisdom & Stories
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
          Explore inspiring stories about medicinal herbs and their healing powers
        </p>
        <div className="h-1 w-40 bg-gradient-to-r from-[#2ECC71] to-[#87E08A] rounded-full mx-auto"></div>
      </div>

      {/* Stories Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {herbalStories.map((story) => (
          <div
            key={story.id}
            onClick={() => setSelectedStory(story)}
            className="bg-white dark:bg-[#0F1720] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-200 dark:border-gray-800"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={story.image}
                alt={story.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block bg-[#2ECC71] text-white px-3 py-1 rounded-full text-xs font-semibold mb-2">
                  {story.category}
                </span>
                <h3 className="text-white text-lg font-bold">{story.title}</h3>
              </div>
            </div>
            <div className="p-5">
              <p className="text-gray-700 dark:text-gray-300 line-clamp-2 text-sm">
                {story.description}
              </p>
              <button className="mt-4 w-full bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white py-2 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold">
                Read Story
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0F1720] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800">
            {/* Modal Header */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={selectedStory.image}
                alt={selectedStory.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <button
                onClick={() => setSelectedStory(null)}
                className="absolute top-4 right-4 bg-white dark:bg-gray-800 text-black dark:text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-all duration-200 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div className="mb-4">
                <span className="inline-block bg-[#2ECC71] text-white px-4 py-1 rounded-full text-sm font-semibold">
                  {selectedStory.category}
                </span>
              </div>
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2ECC71] to-[#58E07A] mb-4">
                {selectedStory.title}
              </h2>
              <div className="h-1 w-16 bg-gradient-to-r from-[#2ECC71] to-[#87E08A] rounded-full mb-6"></div>
              
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                {selectedStory.description}
              </p>
              
              <div className="bg-gradient-to-r from-[#E6FFF5] to-[#B8F6D1] dark:from-[#1a2f24] dark:to-[#0F1720] p-6 rounded-xl border border-[#2ECC71] border-opacity-30 mb-6">
                <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed">
                  {selectedStory.content}
                </p>
              </div>

              <button
                onClick={() => setSelectedStory(null)}
                className="w-full bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Story;