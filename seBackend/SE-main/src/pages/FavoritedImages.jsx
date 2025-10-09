import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import FavoriteCard from "../components/FavoriteCard";
import { useNavigate } from "react-router-dom";
import creator1Img from "../assets/images/creator1.png";

export default function FavoritedImages() {
  const navigate = useNavigate();
  const [fav_creators, setFavCreators] = useState([
    {
      id: 1,
      name: "Ariana Paul",
      role: "Content Creator",
      avatar: creator1Img,
      isFavorite: false,
      stats: { content: 40, votes: 350, contests: 8, badges: 5 },
    },
    {
      id: 2,
      name: "John Smith",
      role: "Video Editor",
      avatar: creator1Img,
      isFavorite: true,
      stats: { content: 12, votes: 210, contests: 3, badges: 2 },
    },
    {
      id: 3,
      name: "Lana Rose",
      role: "Photographer",
      avatar: creator1Img,
      isFavorite: false,
      stats: { content: 20, votes: 310, contests: 5, badges: 4 },
    },
    {
      id: 4,
      name: "Kevin Hart",
      role: "Cinematographer",
      avatar: creator1Img,
      isFavorite: true,
      stats: { content: 18, votes: 250, contests: 4, badges: 3 },
    },
    {
      id: 5,
      name: "Maya Ali",
      role: "Influencer",
      avatar: creator1Img,
      isFavorite: true,
      stats: { content: 22, votes: 420, contests: 9, badges: 6 },
    },
    {
      id: 6,
      name: "Sarah Johnson",
      role: "Model",
      avatar: creator1Img,
      isFavorite: true,
      stats: { content: 35, votes: 280, contests: 7, badges: 4 },
    },
    {
      id: 7,
      name: "Mike Wilson",
      role: "Photographer",
      avatar: creator1Img,
      isFavorite: false,
      stats: { content: 15, votes: 180, contests: 3, badges: 2 },
    },
    {
      id: 8,
      name: "Emma Davis",
      role: "Content Creator",
      avatar: creator1Img,
      isFavorite: true,
      stats: { content: 28, votes: 320, contests: 6, badges: 5 },
    },
  ]);

  const toggleFavorite = (id) => {
    setFavCreators((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  };

  const favoritedImages = fav_creators.filter(creator => creator.isFavorite);

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:ml-64 w-full">
        <Topbar pageTitle="Favorited Images" />
        
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#ceb46a] mb-2">
                Favorited Images
              </h1>
              <p className="text-gray-400">
                {favoritedImages.length} favorited images
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

        {/* Images Grid */}
        {favoritedImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favoritedImages.map((creator) => (
              <FavoriteCard
                key={creator.id}
                avatar={creator.avatar}
                isFavorite={creator.isFavorite}
                onToggleFavorite={() => toggleFavorite(creator.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-[#1c1c1c] rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Favorited Images</h3>
            <p className="text-gray-400 mb-6">
              You haven't favorited any images yet. Start exploring and favorite the ones you love!
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-[#ceb46a] text-black px-6 py-2 rounded-lg font-medium hover:bg-[#d6c074] transition-colors duration-200"
            >
              Explore Images
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
