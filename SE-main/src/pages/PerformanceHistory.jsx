import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ContestTable2 from "../components/ContestTable2";
import Topbar from "../components/Topbar";
import RowSlider from "../components/Slider/RowSlider";
import { FaTrophy } from "react-icons/fa";
import badgeImg from "../assets/images/badge-img.jpg"; 
import { TrophyIcon } from "@heroicons/react/24/solid";

const contestsData = [
  {
    id: 1,
    gallery: "Full Body",
    name: "Glow Up",
    winDate: "2025-03-10",
    position: 1,
    upvotes: 400,
  },
  {
    id: 2,
    gallery: "Butt",
    name: "Booty Bash",
    winDate: "2025-04-12",
    position: 8,
    upvotes: 220,
  },
  {
    id: 3,
    gallery: "Feet",
    name: "Fancy Feet",
    winDate: "2025-05-08",
    position: 22,
    upvotes: 150,
  },
];

const badges = [
  {
    title: "1st Place",
    subtext: "Top Voted",
      icon: <TrophyIcon className="w-6 h-6 text-yellow-400" />,
    image: badgeImg,
  },
  {
    title: "2nd Place",
    subtext: "Fan Favorite",
     icon: <TrophyIcon className="w-6 h-6 text-yellow-400" />,
    image: badgeImg,
  },
  {
    title: "3rd Place",
    subtext: "Contest Winner",
    icon: <FaTrophy className="text-[#ceb46a] w-6 h-6" />,
    image: badgeImg,
  },
  {
    title: "8th Place",
    subtext: "Finished 8th",
    icon: <FaTrophy className="text-[#ceb46a] w-6 h-6" />,
    image: badgeImg,
  },
  {
    title: "22nd Place",
    subtext: "Finished 22nd",
    icon: <FaTrophy className="text-[#ceb46a] w-6 h-6" />,
    image: badgeImg,
  },
];


export default function PerformanceHistory() {
  const handleViewMore = () => {
    // Add logic here if needed
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:ml-64 w-full">
        <Topbar pageTitle="Performance History" />

        {/* 🟡 Updated top metrics section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-4">
          {[
            { title: "Contests Joined" },
            { title: "Avg. Upvotes per Contest" },
            { title: "Avg. Upvotes (Winners)" },
            { title: "Best Individual Performance (Upvotes)" },
            { title: "Images Favorited" },
            { title: "Galleries Favorited" },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-[#1C1C1E] rounded-2xl shadow-sm px-4 py-5 w-full"
            >
              <h2 className="text-lg font-bold text-[#ceb46a] mb-1">
                {card.title}
              </h2>
              <p className="text-gray-400 text-xs">
                Full Body: 180 | Chest & Stomach: 175 | Butt: 160 | P/V: 150 | Legs: 170 | Feet: 140
              </p>
            </div>
          ))}

          <div className="bg-[#1C1C1E] rounded-2xl shadow-sm px-4 py-5 w-full">
            <h2 className="text-[26px] font-bold font-inter text-[#B49252]">
              4,890
            </h2>
            <p className="text-gray-500 text-xs font-inter">
              Teaser Gallery Views
            </p>
          </div>

          <div className="bg-[#1C1C1E] rounded-2xl shadow-sm px-4 py-5 w-full">
            <h2 className="text-[26px] font-bold font-inter text-[#B49252]">
              4,890
            </h2>
            <p className="text-gray-500 text-xs font-inter">
              Total Profile Visits
            </p>
          </div>
        </div>

        {/* 🟡 Recent Contest Performance Table */}
        <div className="py-6 md:py-5 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4 font-inter text-[#CEB46A]">
            Recent Contest Performance
          </h2>
          <ContestTable2 data={contestsData} />
        </div>

        {/* 🟡 View more button */}
        <div className="relative flex items-center justify-center w-full my-5 md:my-8">
          <div className="absolute w-full border-t border-[#ceb46a]"></div>
          <button
            onClick={handleViewMore}
            className="relative z-10 px-4 sm:px-6 py-2 bg-[#ceb46a] text-black rounded-full shadow text-sm md:text-base"
          >
            View more
          </button>
        </div>

        {/* 🟡 Top Contest Performance with Trophy Icon */}
        <div className="">
          <h2 className="text-xl font-semibold mb-4 font-inter text-[#CEB46A]">
            Top Contest Performance
          </h2>
          <RowSlider items={badges} />
        </div>
      </div>
    </div>
  );
}
