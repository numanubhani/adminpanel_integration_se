import { useState, useEffect } from "react";
import { BsChevronDown } from "react-icons/bs";
import { FilterIcon } from "./CustomSVG";
import CreatorCard from "./CreatorCard";
import creator1Img from "../assets/images/creator1.png";
import { Medal, Users, Star } from "lucide-react";
import { FaStar, FaTrophy, FaMedal } from "react-icons/fa6";

export default function ContentContributorsUI({ onContributorClick }) {
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedContributor, setSelectedContributor] = useState(null);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 1024);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleFilters = () => setShowFilters((prev) => !prev);

  const filterCategories = [
  { name: "Gender", options: ["Male", "Female", "Other"] },
  {
    name: "Age",
    options: ["18–21", "22–25", "26–29", "30–34", "35–40", "40+"]
  },
  { name: "Skin Tone", options: ["Light", "Medium", "Dark"] },
  {
    name: "Hair Color",
    options: [
      "Blonde",
      "Brown",
      "Black",
      "Red",
      "Auburn",
      "Dirty Blonde",
      "Strawberry Blonde"
    ]
  },
  {
  name: "Body Type",
  options: [
    { label: "Women", heading: true, className: "text-white" },
    "Petite",
    "Short & Curvy",
    "Avg/Athletic",
    "Tall & Slender",
    "Plus Size",
    
    
    { label: "Men", heading: true, className: "text-white" },
    "Short & Fit",
    "Short & Broad",
    "Avg/Athletic",
    "Tall & Fit",
    "Big & Tall"
  ]
},
  {
    name: "Shoe Size",
    options: [
       { label: "Women", heading: true, className: "!text-white font-semibold" },

      "<6",
      "6–7.5",
      "8–9.5",
      "10+",
      { label: "Men", heading: true, style: { color: "white" } },
      "<8",
      "8.5–10",
      "10.5–12.5",
      "13+"
    ]
  },
  {
    name: "Height",
    options: [
       { label: "Women", heading: true, className: "!text-white font-semibold" },

      "<5’1”",
      "5’1”–5’4”",
      "5’5”–5’8”",
      "5’9”–6’",
      ">6’",
      { label: "Men", heading: true, style: { color: "white" } },
      " <5’6”",
      "5’6”–5’9”",
      "5’10”–6’1”",
      "6’2”–6’5”",
      ">6’5”"
    ]
  },
  {
    name: "Weight",
    options: [
      { label: "Women", heading: true, className: "!text-white font-semibold" },

      "<110 lbs",
      "110–129 lbs",
      "130–149 lbs",
      "150–174 lbs",
      "175–200 lbs",
      ">200 lbs",
      { label: "Men", heading: true, style: { color: "white" } },
      "<150 lbs",
      "150–174 lbs",
      "175–199 lbs",
      "200–224 lbs",
      "225–249 lbs",
      "250–299 lbs",
      ">299 lbs"
    ]
  },
  {
    name: "Bust Size",
    options: ["AA", "A", "B", "C", "D", "DD/E", "DDD/F", ">DDD"]
  },
  {
    name: "Penis Size",
   options: ["<4\"", "4–5.5\"", "6–7.5\"", "8–9.5\"", "10+\""]
  },
  {
    name: "Photo Gallery",
    options: ["Teaser", "Full Body", "Chest & Stomach", "Butt", "P/V", "Legs", "Feet"]
  }
];


  const contributors = [
    {
      name: "Ariana Paul",
      img: creator1Img,
      age: 28,
      gender: "Female",
      bust: "C",
      bodyType: "Curvy",
      hairColor: "Blonde",
      skinTone: "Medium",
      height: "-",
      weight: "-",
      shoeSize: "7",
      contests: 8,
      badges: 15,
      photoGalleries: "0 of 0",
    },
    {
      name: "Marcus Liu",
      img: creator1Img,
      age: 34,
      gender: "Male",
      penisSize: "6-7.5\"",
      bodyType: "Athletic",
      hairColor: "Black",
      skinTone: "Fair",
      height: "5'10\"",
      weight: "175",
      shoeSize: "10",
      contests: 14,
      badges: 8,
      photoGalleries: "2 of 5",
    },
    {
      name: "Emily Clarke",
      img: creator1Img,
      age: 29,
      gender: "Female",
      bust: "B",
      bodyType: "Petite",
      hairColor: "Black",
      skinTone: "Light",
      height: "5'3\"",
      weight: "115",
      shoeSize: "6",
      contests: 12,
      badges: 9,
      photoGalleries: "5 of 5",
    },
    {
      name: "Lana Rivera",
      img: creator1Img,
      age: 33,
      gender: "Female",
      bust: "D",
      bodyType: "Curvy",
      hairColor: "Brown",
      skinTone: "Medium",
      height: "5'7\"",
      weight: "140",
      shoeSize: "8",
      contests: 5,
      badges: 11,
      photoGalleries: "4 of 6",
    },
    {
      name: "Zoe Kim",
      img: creator1Img,
      age: 26,
      gender: "Female",
      bust: "A",
      bodyType: "Petite",
      hairColor: "Black",
      skinTone: "Light",
      height: "5'1\"",
      weight: "105",
      shoeSize: "5",
      contests: 9,
      badges: 6,
      photoGalleries: "3 of 4",
    },
    {
      name: "Darius Grant",
      img: creator1Img,
      age: 32,
      gender: "Male",
      penisSize: "8+\"",
      bodyType: "Muscular",
      hairColor: "Dark Brown",
      skinTone: "Dark",
      height: "6'2\"",
      weight: "200",
      shoeSize: "12",
      contests: 12,
      badges: 3,
      photoGalleries: "8 of 8",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#1C1C1E] text-white">
   <div className="p-4 border-b border-gray-700">
  <div className="flex justify-between items-center">
    {/* Left: Filters Button */}
    <button
      onClick={toggleFilters}
      className="text-2xl p-2 rounded-md focus:outline-none text-white flex items-center gap-2"
    >
      <FilterIcon />
      <span className="text-base font-medium">Filters</span>
    </button>
    <div className="flex-1 text-center">
      <h1 className="text-xl md:text-2xl font-bold text-[#ceb46a] mb-8">
        Content Contributors
      </h1>
    </div>

    <div className="w-[84px] md:w-[128px]" /> 
  </div>

  <div className="flex flex-wrap justify-start md:justify-center gap-4 text-base text-white px-2 mt-4">
  <div className="flex items-center gap-2">
    <FaTrophy className="text-[#ceb46a] text-2xl" />
    <span className="font-medium">1st Place</span>
  </div>
  <div className="flex items-center gap-2">
    <FaMedal className="text-[#ceb46a] text-2xl" />
    <span className="font-medium">Top 3</span>
  </div>
  <div className="flex items-center gap-2">
    <FaStar className="text-[#ceb46a] text-2xl" />
    <span className="font-medium">Top 10</span>
  </div>
</div>

</div>
      {showFilters && isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleFilters}></div>
      )}

      <div className="flex flex-1 w-full overflow-hidden">
        {showFilters && (
          <div className={`w-full md:w-[300px] bg-[#0f0f10] border-r border-gray-700 p-4 overflow-y-auto z-50 fixed md:static inset-0 md:inset-auto h-full md:h-auto transition-transform duration-300 ${isMobile ? "block" : "hidden"} md:block`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Filters</h2>
              {isMobile && <button onClick={toggleFilters} className="text-white text-xl">✕</button>}
            </div>
          <div className="space-y-4">
  {filterCategories.map((cat) => (
    <div key={cat.name}>
      <label className="block text-sm mb-1 font-semibold text-[#ceb46a]">{cat.name}</label>
      <div className="flex flex-wrap gap-2">
        {cat.options.map((option, idx) => {
          if (typeof option === "object" && option.heading) {
            return (
              <div
                key={`heading-${idx}`}
                className="w-full text-xs font-bold text-white mt-2 mb-1 uppercase tracking-wide"
              >
                {option.label}
              </div>
            );
          } else {
            return (
              <label key={`option-${idx}`} className="text-sm flex items-center gap-1">
                <input type="checkbox" value={option} className="accent-[#ceb46a]" />
                {option}
              </label>
            );
          }
        })}
      </div>
    </div>
  ))}
  <button className="w-full mt-2 py-2 bg-[#ceb46a] text-black font-semibold rounded-full">
    Apply Filters
  </button>
</div>
          </div>
        )}

        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <div className={`grid gap-6 ${showFilters && !isMobile ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'}`}>
            {contributors.map((c, i) => (
              <CreatorCard key={i} {...c} onClick={() => {
                setSelectedContributor(c);
                if (onContributorClick) onContributorClick(c);
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}