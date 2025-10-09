import React from "react";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FavoriteCard = ({ avatar, isFavorite, onToggleFavorite }) => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-xl shadow-md group">
      <img
        src={avatar}
        alt="Favorite"
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Active button - now always shown */}
      <button
        onClick={() => navigate('/contests')}
        className="absolute top-2 left-2 bg-green-600 text-white text-sm px-3 py-1 rounded-full border border-black shadow-lg z-10 transition-transform hover:scale-105"
      >
        Active
      </button>

      {/* Heart Favorite Toggle */}
      <button
        onClick={onToggleFavorite}
        className="absolute top-2 right-2 text-white text-xl z-10"
        aria-label="Toggle Favorite"
      >
        <FaHeart
          className={`transition-transform duration-300 ${
            isFavorite ? "text-red-500 scale-110" : "text-gray-300"
          }`}
        />
      </button>
    </div>
  );
};

export default FavoriteCard;
