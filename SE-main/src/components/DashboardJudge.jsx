import Sidebar from "../components/Sidebar";
import creator1Img from "../assets/images/creator1.png";
import Topbar from "../components/Topbar";
import FavoriteCard from "./FavoriteCard";
import { useState, useEffect } from "react";
import { BASE_URL } from "../Instance";
import TopCreatorsTable from "./TopCreatorsTable";
import { FaTrophy, FaMedal, FaStar} from 'react-icons/fa6'; 
import { Trophy, Users, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Image1 from "../assets/contest images/image1.jpg";
import Image2 from "../assets/contest images/image2.jpg";
import Image3 from "../assets/contest images/image3.jpg";
import Image4 from "../assets/contest images/image4.jpg";
import Image5 from "../assets/contest images/image5.jpg";
import Image6 from "../assets/contest images/image6.jpg";
import Image7 from "../assets/contest images/image7.jpg";
import Image8 from "../assets/contest images/image8.jpg";

 const allContests = [
  {
    id: 1,
    title: "Beach Body",
    description: "Show off your elegant feet.",
    category: "Hand",
    user_joined: "75/500",
    image: Image6,
    attributes: {
      gender: "Male",
      age: "18-25",
      PenisSize: "5'",
      bodyType: "Slim",
      skinTone: "Fair",
      HairColor: "Blonde"
    },
    estimatedPrice: "$2200",
    startTime: "2025-06-01T08:00:00Z",
    endTime: "2025-06-03T08:00:00Z"
  },
  {
    id: 2,
    title: "Perfect Pose",
    description: "Submit your best legs!",
    category: "Face",
    user_joined: "100/500",
    image: Image1,
    attributes: {
      gender: "Female",
      age: "25-35",
      bustSize: "36D",
      bodyType: "Athletic",
      skinTone: "Medium",
      HairColor: "Brown"
    },
    estimatedPrice: "$1200",
    startTime: "2025-06-04T08:00:00Z",
    endTime: "2025-06-06T08:00:00Z"
  },
  {
    id: 3,
    title: "Best Chest",
    description: "Style your feet with trendy shoes.",
    category: "Foot",
    user_joined: "60/500",
    image: Image8,
    attributes: {
      gender: "Female",
      age: "20-30",
      bustSize: "36B",
      bodyType: "Petite",
      skinTone: "Tan",
      HairColor: "Black"
    },
    estimatedPrice: "$1200",
    startTime: "2025-06-07T08:00:00Z",
    endTime: "2025-06-09T08:00:00Z"
  },
  {
    id: 4,
    title: "Nicest legs",
    description: "Show off your toned body ready for the beach.",
    category: "Body",
    user_joined: "120/500",
    image: Image3,
    attributes: {
      gender: "Female",
      age: "22-28",
      PenisSize: "6.5'",
      bodyType: "Muscular",
      skinTone: "Olive",
      HairColor: "Olive"
    },
    estimatedPrice: "$2200",
    startTime: "2025-06-10T08:00:00Z",
    endTime: "2025-06-13T08:00:00Z"
  },
  {
    id: 5,
    title: "Cutest Feets",
    description: "Strike your best formal evening look.",
    category: "Pose",
    user_joined: "90/500",
    image: Image5,
    attributes: {
      gender: "Female",
      age: "30-40",
      bustSize: "36C",
      bodyType: "Curvy",
      skinTone: "Light",
      HairColor: "Blonde"
    },
    estimatedPrice: "$1200",
    startTime: "2025-06-15T08:00:00Z",
    endTime: "2025-06-18T08:00:00Z"
  },
  {
    id: 6,
    title: "Runway Ready",
    description: "Walk your best walk and pose like a model.",
    category: "Fashion",
    user_joined: "110/500",
    image: Image4,
    attributes: {
      gender: "Other",
      age: "20-35",
      bustSize: "36B",
      bodyType: "Tall",
      skinTone: "Brown",
      HairColor: "Blonde"
    },
    estimatedPrice: "$1200",
    startTime: "2025-06-20T08:00:00Z",
    endTime: "2025-06-23T08:00:00Z"
  },
  {
    id: 6,
    title: "Prettiest V",
    description: "Walk your best walk and pose like a model.",
    category: "Fashion",
    user_joined: "120/500",
    image: Image7,
    attributes: {
      gender: "Female",
      age: "20-35",
      bustSize: "36B",
      bodyType: "Tall",
      skinTone: "Brown",
      HairColor: "Blonde"
    },
    estimatedPrice: "$1000",
    startTime: "2025-06-20T08:00:00Z",
    endTime: "2025-06-23T08:00:00Z"
  },
  {
    id: 7,
    title: "Best Figure",
    description: "Walk your best walk and pose like a model.",
    category: "Fashion",
    user_joined: "110/500",
    image: Image6,
    attributes: {
      gender: "Male",
      age: "20-35",
      PenisSize: "5.5'",
      bodyType: "Tall",
      skinTone: "Brown",
      HairColor: "Blonde"
    },
    estimatedPrice: "$2500",
    startTime: "2025-06-20T08:00:00Z",
    endTime: "2025-06-23T08:00:00Z"
  }

];

const top_creators = [
  {
    name: "Alina Batosh",
    avatar: creator1Img,
    contests_joined: 310,
    votes: 290,
    contests_win: 80,
    galleries_completed: "8 of 8",
    trophyCount: 3,
    badgeCount: 13,
    top3Finishes: 6,     // 3 * 2
    top10Finishes: 13,   // same as badgeCount
  },
  {
    name: "John Smith",
    avatar: creator1Img,
    contests_joined: 270,
    votes: 250,
    contests_win: 75,
    galleries_completed: "6 of 8",
    trophyCount: 2,
    badgeCount: 10,
    top3Finishes: 4,
    top10Finishes: 10,
  },
  {
    name: "Lana Rose",
    avatar: creator1Img,
    contests_joined: 310,
    votes: 320,
    contests_win: 60,
    galleries_completed: "7 of 8",
    trophyCount: 4,
    badgeCount: 9,
    top3Finishes: 8,
    top10Finishes: 9,
  },
  {
    name: "Kevin Hart",
    avatar: creator1Img,
    contests_joined: 290,
    votes: 215,
    contests_win: 45,
    galleries_completed: "5 of 8",
    trophyCount: 1,
    badgeCount: 4,
    top3Finishes: 2,
    top10Finishes: 4,
  },
  {
    name: "Maya Ali",
    avatar: creator1Img,
    contests_joined: 350,
    votes: 400,
    contests_win: 90,
    galleries_completed: "8 of 8",
    trophyCount: 5,
    badgeCount: 15,
    top3Finishes: 10,
    top10Finishes: 15,
  },
];

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
];

export default function DashboardJudge() {
  const [isMobile, setIsMobile] = useState(false);
  const [userStats, setUserStats] = useState({ total_votes_cast: 0, contests_judged: 0, favorite_creators: 0, wallet_balance: 0, recent_activity: [] });
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
  ]);
  const [selectedGallery, setSelectedGallery] = useState(null);
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelectedGallery(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);
    const navigate = useNavigate();
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${BASE_URL}dashboard/user/`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setUserStats(d))
      .catch(() => {});
  }, []);

  const toggleFavorite = (id) => {
    setFavCreators((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 p-3 md:p-6 lg:ml-64 w-full">
        <Topbar pageTitle="Dashboard" />

        {/* Images Favorited Section */}
        <div className="py-5 md:py-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-semibold font-inter text-[#ceb46a]">
              Images Favorited
            </h2>
            <button
              onClick={() => navigate('/favorited-images')}
              className="text-[#ceb46a] hover:text-[#d6c074] text-sm font-medium transition-colors duration-200 flex items-center gap-1"
            >
              See All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {fav_creators.slice(0, isMobile ? 2 : 4).map((creator) => (
              <FavoriteCard
                key={creator.id}
                avatar={creator.avatar}
                isFavorite={creator.isFavorite}
                onToggleFavorite={() => toggleFavorite(creator.id)}
              />
            ))}
          </div>
        </div>

        {/* Galleries Favorited Section */}
        <div className="py-5 md:py-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-[#ceb46a]">
              Galleries Favorited
            </h2>
            <button
              onClick={() => navigate('/favorited-galleries')}
              className="text-[#ceb46a] hover:text-[#d6c074] text-sm font-medium transition-colors duration-200 flex items-center gap-1"
            >
              See All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favoritedGalleries.map((gallery) => (
              <div
                key={gallery.id}
                className="bg-[#1c1c1c] rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={gallery.image}
                  alt={gallery.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-white text-lg font-semibold">
                    {gallery.title}
                  </h3>
                  <p className="text-sm text-gray-400">by {gallery.creator}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-xs text-[#ceb46a]">
                      {gallery.itemsCountLabel ?? "Photos"}: {gallery.itemsCount}
                    </p>
                    <button
  onClick={() => navigate('/contests')}
  className="transition-all duration-200 transform hover:scale-105 border border-black bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow hover:bg-green-500"
>
  Active
</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          {selectedGallery && (
            <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
              <div className="bg-[#1c1c1e] w-full max-w-md p-6 rounded-xl relative shadow-lg">
                <button
                  onClick={() => setSelectedGallery(null)}
                  className="absolute top-2 right-3 text-white text-2xl"
                >
                  &times;
                </button>
                <h3 className="text-xl text-[#ceb46a] font-bold mb-2">
                  {selectedGallery.title}
                </h3>
                <p className="text-sm text-gray-400 mb-2">
                  by {selectedGallery.creator}
                </p>
                <img
                  src={selectedGallery.image}
                  alt={selectedGallery.title}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <p className="text-sm text-white">
                  Total {selectedGallery.itemsCountLabel ?? "Photos"}:{" "}
                  <span className="font-bold">{selectedGallery.itemsCount}</span>
                </p>
              </div>
            </div>
          )}
        </div>  
        <div className="py-5 md:py-10">
          <TopCreatorsTable
            title="Top Contributors"
            data={top_creators.map((creator) => ({
              ...creator,

              // Trophy icon for the contributor
              trophyIcon: (
                <Trophy
                  className="inline w-5 h-5 ml-1 text-[#ceb46a]"
                  title="Top Contributor"
                />
              ),

              // Top 3 finishes using Users icon
              top3Finishes: (
                <span className="inline-flex items-center gap-1 text-white">
                  {Math.floor(creator.top3Finishes / 2)}
                  <FaMedal className="text-[#ceb46a]"
                    title="Top 3 Finishes"
                  />
                </span>
              ),

              // Top 10 finishes using Star icon
              top10Finishes: (
                <span className="inline-flex items-center gap-1 text-white">
                  {Math.floor(creator.top10Finishes / 1.5)}
                  <FaStar className="text-[#ceb46a]" 
                    title="Top 10 Finishes"
                  />
                </span>
              ),
            }))}
          />
        </div>




 {/* Popular Contests Section */}
<div className="py-5 md:py-10">
  <h2 className="text-lg md:text-xl font-semibold text-[#ceb46a] mb-4">
    Popular Contests
  </h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {allContests.map((contest) => (
      <div
        key={contest.id}
        className="bg-[#1c1c1c] rounded-lg overflow-hidden shadow-md"
      >
        {/* Contest Image */}
        <img
          src={contest.image} // Contest-specific image
          alt={contest.title}
          className="w-full h-80 object-cover"
        />

       <div className="p-4">
  {/* Contest Title */}
  <h3 className="text-white text-lg font-semibold">
    {contest.title}
  </h3>

  {/* Contest Category */}
  <p className="text-xs text-[#ceb46a]">{contest.category}</p>

  {/* User Joined */}
  <p className="text-xs text-gray-400 mt-1">
    Participants: {contest.user_joined}
  </p>

 

  {/* Contest Attributes */}
  <div className="mt-2">
    <p className="text-xs text-gray-400">Gender: {contest.attributes.gender}</p>
    <p className="text-xs text-gray-400">Age: {contest.attributes.age}</p>
    {contest.attributes.PenisSize && (
      <p className="text-xs text-gray-400">Penis Size: {contest.attributes.PenisSize}</p>
    )}
    <p className="text-xs text-gray-400">Body Type: {contest.attributes.bodyType}</p>
    <p className="text-xs text-gray-400">Skin Tone: {contest.attributes.skinTone}</p>
    <p className="text-xs text-gray-400">Hair Color: {contest.attributes.HairColor}</p>
  </div>

  {/* Time Left */}
  <p className="text-xs text-gray-400 mt-1">
    Time Remaining:{" "}
    {new Date(contest.endTime).toLocaleString("en-US", {
      hour12: true,
    })}
  </p>

  <div className="mt-1 flex items-center justify-between">
    {/* View Button */}
    <button className="bg-[#ceb46a] text-black text-xs px-2 py-0.5 rounded font-semibold">
      View
    </button>
  </div>
</div>

      </div>
    ))}
  </div>
</div>
      </div>
    </div>
  );
}
