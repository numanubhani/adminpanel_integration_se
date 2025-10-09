import React, { useState } from 'react';
import { FaTrophy, FaMedal, FaStar, FaHeart, FaCamera } from 'react-icons/fa6';
import { FaTimes } from 'react-icons/fa';

const CreatorCard = ({
  name = "Marcus Liu",
  age = 34,
  bust,
  penisSize = "6-7.5\"",
  bodyType = "Athletic",
  hairColor = "Black",
  skinTone = "Fair",
  height = "5'10\"",
  weight = 175,
  shoeSize = 10,
  photoGalleries = "2 of 5",
  gender = "Male",
  contests = 14,
  badges = 16,
  top10 = 30,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState(null);

  const galleries = [
    { name: "Teaser", price: "Free", development: false, trophies: 3, ribbons: 12, photos: 5 },
    { name: "Full Body", price: "$TBD", development: false, trophies: 3, ribbons: 12, photos: 8 },
    { name: "Chest & Stomach", price: "$TBD", development: false, trophies: 3, ribbons: 12, photos: 4 },
    { name: "Butt", price: "$TBD", development: false, trophies: 3, ribbons: 12, photos: 6 },
    { name: "P/V", price: "$TBD", development: false, trophies: 7, ribbons: 42, photos: 7 },
    { name: "Legs", price: "$TBD", development: false, trophies: 3, ribbons: 12, photos: 7 },
    { name: "Feet", price: "$TBD", development: false, trophies: 3, ribbons: 12, photos: 9 },
  ];

  return (
    <>
     <div
  onClick={() => setIsModalOpen(true)}
  className="cursor-pointer bg-black text-white p-4 rounded-xl border border-[#ceb46a] shadow-md hover:shadow-lg transition-all w-full max-w-full sm:max-w-[360px] flex flex-col"
>
 <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start w-full">
 <div className="w-full sm:w-auto flex justify-center sm:justify-start">
  <div className="w-28 h-28 sm:w-28 sm:h-28 bg-white text-black font-semibold flex items-center justify-center rounded-lg text-sm text-center shadow-md">
    Profile Picture
  </div>
</div>
    <div className="flex-1 text-sm space-y-1">
      <div className="text-lg font-bold text-[#ceb46a]">{name}</div>
      <p><strong>Age:</strong> {age}</p>
      <p><strong>Body Type:</strong> {bodyType}</p>
      <p><strong>Skin Tone:</strong> {skinTone}</p>
      <p><strong>Hair Color:</strong> {hairColor}</p>
      <p><strong>Height:</strong> {height}</p>
      <p><strong>Weight:</strong> {weight} lbs</p>
      {gender === 'Female' && bust && <p><strong>Bust:</strong> {bust}</p>}
      {gender === 'Male' && penisSize && <p><strong>Penis Size:</strong> {penisSize}</p>}
      <p><strong>Shoe Size:</strong> {shoeSize}</p>
      <p><strong>Photo Galleries:</strong> {photoGalleries}</p>
    </div>
  </div>

 <div className="flex justify-center gap-2 mt-4 sm:mt-auto pt-2">
  <div className="flex items-center gap-1 border border-[#ceb46a] text-white px-3 py-1 rounded-full text-xs font-semibold">
    <FaTrophy className="text-[#ceb46a]"  /> x{contests}
  </div>
  <div className="flex items-center gap-1 border border-[#ceb46a] text-white px-3 py-1 rounded-full text-xs font-semibold">
    <FaMedal className="text-[#ceb46a]" /> x{badges}
  </div>
  <div className="flex items-center gap-1 border border-[#ceb46a] text-white px-3 py-1 rounded-full text-xs font-semibold">
    <FaStar className="text-[#ceb46a]" /> x{top10}
  </div>
</div>

</div>


 {isModalOpen && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center px-4">
    <div className="bg-black border border-[#ceb46a] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative text-white">
      
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-3 right-3 text-[#ceb46a] text-xl"
        title="Close"
      >
        <FaTimes />
      </button>

      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-6 w-full sm:justify-center">
  <div className="w-full sm:w-auto flex justify-center sm:justify-start">
  <div className="w-28 h-28 sm:w-28 sm:h-28 bg-white text-black font-semibold flex items-center justify-center rounded-lg text-sm text-center shadow-md">
    Profile Picture
  </div>
</div>




        <div className="flex-1 text-sm space-y-1 leading-relaxed">
          <div className="text-lg font-bold text-[#ceb46a]">{name}</div>
          <p><strong>Age:</strong> {age}</p>
          <p><strong>Body Type:</strong> {bodyType}</p>
          <p><strong>Skin Tone:</strong> {skinTone}</p>
          <p><strong>Hair Color:</strong> {hairColor}</p>
          <p><strong>Height:</strong> {height}</p>
          <p><strong>Weight:</strong> {weight} lbs</p>
          {gender === 'Female' && bust && <p><strong>Bust:</strong> {bust}</p>}
          {gender === 'Male' && penisSize && <p><strong>Penis Size:</strong> {penisSize}</p>}
          <p><strong>Shoe Size:</strong> {shoeSize}</p>
          <p><strong>Photo Galleries:</strong> {photoGalleries}</p>
          <div className="flex flex-wrap gap-2 mt-3 text-sm">
            <div className="flex items-center gap-1 border border-[#ceb46a] text-white px-3 py-1 rounded-full text-xs font-semibold">
              <FaTrophy className="text-[#ceb46a]" /> x{contests}
            </div>
            <div className="flex items-center gap-1 border border-[#ceb46a] text-white px-3 py-1 rounded-full text-xs font-semibold">
              <FaMedal className="text-[#ceb46a]" /> x{badges}
            </div>
            <div className="flex items-center gap-1 border border-[#ceb46a] text-white px-3 py-1 rounded-full text-xs font-semibold">
              <FaStar className="text-[#ceb46a]" /> x{top10}
            </div>
          </div>
        </div>
      </div>
      <div className="text-lg text-[#ceb46a] font-semibold mb-4 text-center">
        Photo Galleries
      </div>
      <div className="flex flex-col gap-4">
        {galleries.map((gallery, index) => (
          <div
            key={index}
            onClick={() => setSelectedGallery(gallery)}
           className="cursor-pointer bg-[#CEB46A] text-black px-4 pt-3 pb-2 rounded-md shadow-md w-full max-w-md mx-auto relative"
>
            <div className="flex justify-between items-start mb-2">
              <FaHeart className="text-red-600 text-lg" />
              <span className="text-black text-sm font-semibold">
                {gallery.price === "Free" ? "Free" : `${gallery.price}`}
              </span>
            </div>

            <div className="flex justify-center items-center gap-2 mb-2">
              <h3 className="text-lg font-bold">{gallery.name}</h3>
              <div className="flex items-center gap-1 text-sm font-semibold">
                <FaCamera className="text-black" />
                <span>x{gallery.photos}</span>
              </div>
            </div>

            {!gallery.development && (
              <div className="absolute bottom-2 left-2 bg-green-600 text-white px-3 py-[2px] rounded-full text-xs font-bold shadow-sm">
                Active
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-2 mt-3">
             <div className="flex items-center gap-1 bg-[#1C1C1E] text-white border border-[#ceb46a] px-3 py-[2px] rounded-full font-semibold text-xs">
                <FaTrophy className="text-[#ceb46a]" /> x{gallery.trophies}
              </div>
              <div className="flex items-center gap-1 bg-[#1C1C1E] text-white border border-[#ceb46a] px-3 py-[2px] rounded-full font-semibold text-xs">
                <FaMedal className="text-[#ceb46a]" /> x{gallery.medals || 15}
              </div>
              <div className="flex items-center gap-1 bg-[#1C1C1E] text-white border border-[#ceb46a] px-3 py-[2px] rounded-full font-semibold text-xs">
                <FaStar className="text-[#ceb46a]" /> x{gallery.ribbons}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sub-modal */}
      {selectedGallery && (
        <div className="fixed inset-0 z-[999] bg-black bg-opacity-80 flex items-center justify-center px-4">
          <div className="bg-[#1C1C1E] text-white border border-[#ceb46a] rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setSelectedGallery(null)}
              className="absolute top-3 right-3 text-[#ceb46a] text-xl"
              title="Close"
            >
              <FaTimes />
            </button>

            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-[#ceb46a]">{selectedGallery.name}</h2>
              <p className="text-sm mt-1">
                {selectedGallery.price === "Free" ? "$Free" : `$${selectedGallery.price}`} •{" "}
                {selectedGallery.photos} photos
              </p>
            </div>

            <div className="flex justify-center gap-2 mt-4">
              <div className="flex items-center gap-1 bg-[#ceb46a] text-black px-3 py-1 rounded-full font-semibold text-xs shadow-sm">
                <FaTrophy /> x{selectedGallery.trophies}
              </div>
              <div className="flex items-center gap-1 bg-[#1C1C1E] text-white border border-[#ceb46a] px-3 py-1 rounded-full font-semibold text-xs">
                <FaMedal className="text-[#ceb46a]" /> x{selectedGallery.medals || 15}
              </div>
              <div className="flex items-center gap-1 bg-[#1C1C1E] text-white border border-[#ceb46a] px-3 py-1 rounded-full font-semibold text-xs">
                <FaStar className="text-[#ceb46a]" /> x{selectedGallery.ribbons}
              </div>
            </div>

            <div className="mt-6 text-sm text-center">
              <p className="italic text-gray-400">Gallery preview or details here...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)}



    </>
  );
};

export default CreatorCard;
