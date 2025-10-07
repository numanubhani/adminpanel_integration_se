import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useNavigate } from "react-router-dom";
import creator1Img from "../assets/images/creator1.png";

export default function FavoritedGalleries() {
  const navigate = useNavigate();
  const [selectedGallery, setSelectedGallery] = useState(null);

  const favoritedGalleries = [
    {
      id: 1,
      title: "Summer Feet Collection",
      creator: "Dalton Ward",
      image: creator1Img,
      itemsCount: 18,
    },
    {
      id: 2,
      title: "Elegant Hands",
      creator: "Ariana Paul",
      image: creator1Img,
      itemsCount: 12,
    },
    {
      id: 3,
      title: "City Lights Pose",
      creator: "Lana Rose",
      image: creator1Img,
      itemsCount: 15,
    },
    {
      id: 4,
      title: "Nature Walk Style",
      creator: "Kevin Hart",
      image: creator1Img,
      itemsCount: 10,
    },
    {
      id: 5,
      title: "Expressions & Angles",
      creator: "Maya Ali",
      image: creator1Img,
      itemsCount: 20,
    },
    {
      id: 6,
      title: "Urban Fashion",
      creator: "Sarah Johnson",
      image: creator1Img,
      itemsCount: 14,
    },
    {
      id: 7,
      title: "Beach Vibes",
      creator: "Mike Wilson",
      image: creator1Img,
      itemsCount: 16,
    },
    {
      id: 8,
      title: "Studio Portraits",
      creator: "Emma Davis",
      image: creator1Img,
      itemsCount: 22,
    },
    {
      id: 9,
      title: "Street Style",
      creator: "Alex Thompson",
      image: creator1Img,
      itemsCount: 13,
    },
    {
      id: 10,
      title: "Minimalist Beauty",
      creator: "Lisa Chen",
      image: creator1Img,
      itemsCount: 19,
    },
  ];

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:ml-64 w-full">
        <Topbar pageTitle="Favorited Galleries" />
        
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#ceb46a] mb-2">
                Favorited Galleries
              </h1>
              <p className="text-gray-400">
                {favoritedGalleries.length} favorited galleries
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-[#ceb46a] hover:text-[#d6c074] text-sm font-medium transition-colors duration-200 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Galleries Grid */}
        {favoritedGalleries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favoritedGalleries.map((gallery) => (
              <div
                key={gallery.id}
                className="bg-[#1c1c1c] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => setSelectedGallery(gallery)}
              >
                <img
                  src={gallery.image}
                  alt={gallery.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-white text-lg font-semibold mb-1">
                    {gallery.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">by {gallery.creator}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#ceb46a]">
                      Photos: {gallery.itemsCount}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/contests');
                      }}
                      className="transition-all duration-200 transform hover:scale-105 border border-black bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow hover:bg-green-500"
                    >
                      Active
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-[#1c1c1c] rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Favorited Galleries</h3>
            <p className="text-gray-400 mb-6">
              You haven't favorited any galleries yet. Start exploring and favorite the ones you love!
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-[#ceb46a] text-black px-6 py-2 rounded-lg font-medium hover:bg-[#d6c074] transition-colors duration-200"
            >
              Explore Galleries
            </button>
          </div>
        )}

        {/* Gallery Modal */}
        {selectedGallery && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-[#1c1c1e] w-full max-w-md p-6 rounded-xl relative shadow-lg">
              <button
                onClick={() => setSelectedGallery(null)}
                className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition-colors"
              >
                &times;
              </button>
              <h3 className="text-xl text-[#ceb46a] font-bold mb-2">
                {selectedGallery.title}
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                by {selectedGallery.creator}
              </p>
              <img
                src={selectedGallery.image}
                alt={selectedGallery.title}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-white">
                  Total Photos: <span className="font-bold">{selectedGallery.itemsCount}</span>
                </p>
                <button
                  onClick={() => navigate('/contests')}
                  className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-green-500 transition-colors"
                >
                  View Gallery
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedGallery(null)}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-lg font-medium hover:bg-gray-500 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Handle unfavorite action
                    setSelectedGallery(null);
                  }}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-500 transition-colors"
                >
                  Unfavorite
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
