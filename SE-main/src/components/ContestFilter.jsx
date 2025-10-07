// File: ModelingContestsUI.jsx
import { useState, useEffect } from "react";
import { BsChevronDown } from "react-icons/bs";
import Select from "react-select";
import { FilterIcon } from "./CustomSVG";
import { useNavigate } from "react-router-dom";
import Image1 from "../assets/contest images/image1.jpg";
import Image2 from "../assets/contest images/image2.jpg";
import Image3 from "../assets/contest images/image3.jpg";
import Image4 from "../assets/contest images/image4.jpg";
import Image5 from "../assets/contest images/image5.jpg";
import Image6 from "../assets/contest images/image6.jpg";
import Image7 from "../assets/contest images/image7.jpg";
import Image8 from "../assets/contest images/image8.jpg";

function CountdownTimer({ targetTime }) {
  const [status, setStatus] = useState("counting");
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetTime));

  function getTimeLeft(time) {
    const diff = new Date(time) - new Date();
    return Math.max(diff, 0);
  }

  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days > 0 ? `${days}d ` : ""}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeLeft(targetTime);
      setTimeLeft(remaining);
      if (remaining === 0) {
        setStatus("expired");
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  return (
    <span>
      {status === "expired" ? "Complete" : `Starts In: ${formatTime(timeLeft)}`}
    </span>
  );
}

export default function ModelingContestsUI({ role }) {
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedParts, setSelectedParts] = useState([]);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedContestId, setSelectedContestId] = useState(null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setUserRole(storedRole || "");
  }, []);

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

  const [contests, setContests] = useState(allContests);

  const bodyPartOptions = [
    { value: "Teaser", label: "Teaser" },
    { value: "Full Body", label: "Full Body" },
    { value: "Chest & Stomach", label: "Chest & Stomach" },
    { value: "Butt", label: "Butt" },
    { value: "P/V", label: "P/V" },
    { value: "Legs", label: "Legs" },
    { value: "Feet", label: "Feet" },
  ];

  const handleEnterClick = (id) => {
    setSelectedContestId(id);
    setShowConfirm(true);
  };

  const confirmEntry = () => {
    navigate(`/vote/${selectedContestId}`);
    setSelectedContestId(null);
    setShowConfirm(false);
  };

  const applyFilters = (selectedOptions) => {
    setSelectedParts(selectedOptions);
    if (!selectedOptions.length) {
      setContests(allContests);
    } else {
      const values = selectedOptions.map((o) => o.value);
      const filtered = allContests.filter((c) => values.includes(c.category));
      setContests(filtered);
    }
  };

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 1024);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <div className={`flex flex-col h-auto bg-[#1C1C1E] overflow-y-auto rounded-xl ${role === "Creator" ? "md:h-[652px]" : "md:h-[85vh]"}`}>
      <div className="flex items-center justify-between p-4 shadow-sm">
        <button onClick={() => setShowFilters(!showFilters)} className="text-2xl p-2 rounded-md focus:outline-none">
          <FilterIcon />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-[#ceb46a]">Contests</h1>
        <div className="w-10" />
      </div>

      <div className="px-4 md:px-6 pb-6">
        {showFilters && (
  <div className="mb-4">
    <Select
      isMulti
      value={selectedParts}
      options={bodyPartOptions}
      onChange={applyFilters}
      placeholder="Filter by body part..."
      className="text-black"
    />
  </div>
)}

        <div className={`grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 ${showFilters ? "xl:grid-cols-3" : "xl:grid-cols-4"}`}>
          {contests.map((contest) => (
            <div key={contest.id} className="bg-black rounded-lg overflow-hidden">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img 
  src={contest.image} 
  alt={contest.title} 
  className="w-full h-60 object-contain rounded-md mb-3" 
/>

                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <h3 className="text-white text-2xl md:text-3xl font-bold">{contest.title}</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="text-white text-sm mb-2 space-y-1">
                  <p><span className="font-bold text-white">Gender:</span> {contest.attributes.gender}</p>
                  <p><span className="font-bold text-white">Age:</span> {contest.attributes.age}</p>
                  <p><span className="font-bold text-white">Bust Size:</span> {contest.attributes.bustSize}</p>
                  <p><span className="font-bold text-white">Body Type:</span> {contest.attributes.bodyType}</p>
                  <p><span className="font-bold text-white">Skin Tone:</span> {contest.attributes.skinTone}</p>
                  <p><span className="font-bold text-white">Hair Color:</span> {contest.attributes.HairColor}</p>
                  <p><span className="font-bold text-white">Contributors Joined:</span> {contest.user_joined}</p>
                  {role !== "Judge" && (
            <div className="flex justify-between">
              <span className="text-gray-400 justify-left">Estimated Prize:</span>
              <span>{contest.estimatedPrice}</span>
            </div>
          )}
                </div>
                <p className="text-green-400 font-bold text-sm mb-2">
                  <CountdownTimer targetTime={contest.startTime} />
                </p>
                <p className="text-red-400 font-bold text-sm mb-4">
                  Ends In: <CountdownTimer targetTime={contest.endTime} />
                </p>
                <button
                  onClick={() => handleEnterClick(contest.id)}
                  className="w-full flex items-center justify-center gap-2 bg-[#ceb46a] text-black rounded-md font-semibold text-sm px-3 py-1.5 hover:opacity-90 transition"
                >
                  {userRole !== "Content Contributor" ? (<><div className="w-5 h-5 bg-white text-black text-[10px] font-bold flex items-center justify-center rounded-full border border-gray-400">$1</div> ENTER</>) : (<>JOIN</>)}
                </button>
              </div>
            </div>
          ))}

          {contests.length === 0 && (
            <p className="text-center text-gray-400 col-span-full mt-10">
              No contests found for selected filters.
            </p>
          )}
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#1C1C1E] border border-[#ceb46a] rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold text-[#ceb46a] mb-4">Confirm Entry</h2>
            <p className="text-white mb-6">Are you sure you want to enter this contest? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button className="px-4 py-2 text-sm border border-gray-500 rounded text-gray-300 hover:bg-gray-700/40 transition" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="px-4 py-2 text-sm bg-[#ceb46a] text-black rounded hover:bg-yellow-600 transition" onClick={confirmEntry}>Yes, Enter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
