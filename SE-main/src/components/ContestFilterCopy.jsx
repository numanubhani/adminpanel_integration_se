import { useState, useEffect } from "react";
import { BsChevronDown } from "react-icons/bs";
import HandModeling from "../assets/images/hand-modeling.jpg";
import { FilterIcon } from "./CustomSVG";

export default function ModelingContestsUICopy({ role }) {
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedParts, setSelectedParts] = useState([]);
  const navigate = useNavigate();
const allContests = [
  {
    id: 1,
    title: "Cutest Hands",
    description: "Show off your elegant hands.",
    category: "Hand",
    user_joined: "75",
    image: HandModeling,
    attributes: {
      gender: "Female",
      age: "18-25",
      bustSize: "34B",
      bodyType: "Slim",
      skinTone: "Fair"
    },
    startTime: "2025-06-01T08:00:00Z",
    endTime: "2025-06-03T08:00:00Z"
  },
  {
    id: 2,
    title: "Perfect Smile",
    description: "Submit your best smile!",
    category: "Face",
    user_joined: "100",
    image: HandModeling,
    attributes: {
      gender: "Male",
      age: "25-35",
      bustSize: "N/A",
      bodyType: "Athletic",
      skinTone: "Medium"
    },
    startTime: "2025-06-04T08:00:00Z",
    endTime: "2025-06-06T08:00:00Z"
  },
  {
    id: 3,
    title: "Footwear Fashion",
    description: "Style your feet with trendy shoes.",
    category: "Foot",
    user_joined: "60",
    image: HandModeling,
    attributes: {
      gender: "Female",
      age: "20-30",
      bustSize: "N/A",
      bodyType: "Petite",
      skinTone: "Tan"
    },
    startTime: "2025-06-07T08:00:00Z",
    endTime: "2025-06-09T08:00:00Z"
  },
  {
    id: 4,
    title: "Beach Body",
    description: "Show off your toned body ready for the beach.",
    category: "Body",
    user_joined: "120",
    image: HandModeling,
    attributes: {
      gender: "Male",
      age: "22-28",
      bustSize: "N/A",
      bodyType: "Muscular",
      skinTone: "Olive"
    },
    startTime: "2025-06-10T08:00:00Z",
    endTime: "2025-06-13T08:00:00Z"
  },
  {
    id: 5,
    title: "Elegant Pose",
    description: "Strike your best formal evening look.",
    category: "Pose",
    user_joined: "90",
    image: HandModeling,
    attributes: {
      gender: "Female",
      age: "30-40",
      bustSize: "36C",
      bodyType: "Curvy",
      skinTone: "Light"
    },
    startTime: "2025-06-15T08:00:00Z",
    endTime: "2025-06-18T08:00:00Z"
  },
  {
    id: 6,
    title: "Runway Ready",
    description: "Walk your best walk and pose like a model.",
    category: "Fashion",
    user_joined: "110",
    image: HandModeling,
    attributes: {
      gender: "Other",
      age: "20-35",
      bustSize: "36B",
      bodyType: "Tall",
      skinTone: "Brown"
    },
    startTime: "2025-06-20T08:00:00Z",
    endTime: "2025-06-23T08:00:00Z"
  }
];


  const [contests, setContests] = useState(allContests);

  const bodyPartOptions = [
    { value: "Hand", label: "Hand" },
    { value: "Face", label: "Face" },
    { value: "Foot", label: "Foot" },
    { value: "Body", label: "Body" },
    { value: "Fashion", label: "Fashion" },
    { value: "Pose", label: "Pose" },
  ];

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
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleFilters = () => setShowFilters((prev) => !prev);

  const scrollbarStyle = {
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(155, 155, 155, 0.5) transparent",
  };

  return (
    <div className={`flex flex-col h-auto bg-[#1C1C1E] overflow-y-auto rounded-xl ${role === "Creator" ? "md:h-[652px]" : "md:h-[85vh]"}`} style={scrollbarStyle}>
      <div className="flex flex-col md:flex-row relative ">
        {showFilters && isMobile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={toggleFilters}></div>
        )}

        {showFilters && (
          <div className="w-full md:w-[316px] max-h-[622px] shadow-sm flex flex-col z-20 bg-[#0f0f10] border border-gray-300/30 rounded-md sticky top-[100px] inset-0 md:inset-auto transition-transform duration-300 h-screen md:h-auto">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <button onClick={toggleFilters} className="text-2xl p-2 rounded-md focus:outline-none md:hidden">
                  <FilterIcon />
                </button>
                <h2 className="text-xl font-bold text-white">Filters</h2>
              </div>
              <button onClick={toggleFilters} className="p-2 rounded-md focus:outline-none md:hidden text-white">
                ✕
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 pb-6" style={scrollbarStyle}>
              <div className="space-y-5">
                <label className="block text-sm font-medium mb-2 text-white">Body Part</label>
                <Select
                  isMulti
                  options={bodyPartOptions}
                  value={selectedParts}
                  onChange={applyFilters}
                  className="text-black"
                  placeholder="Select Body Parts"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden bg-[#1C1C1E]">
          <div className="flex items-center justify-between p-4 shadow-sm">
            <button onClick={toggleFilters} className="text-2xl p-2 rounded-md focus:outline-none">
              <FilterIcon />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-[#ceb46a]">Contests</h1>
            <div className="w-10" />
          </div>

          <div className="overflow-y-auto px-4 md:px-6 pb-6 flex-1 hide-scrollbar" style={scrollbarStyle}>
            <div className={`grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 ${showFilters ? "xl:grid-cols-3" : "xl:grid-cols-4"}`}>
              {contests.map((contest) => (
                <div key={contest.id} className="bg-black rounded-lg shadow-sm">
                  <div className="relative h-48">
                    <img src={contest.image} alt={contest.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <h3 className="text-white text-2xl md:text-3xl font-bold">{contest.title}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <ul className="list-disc list-inside text-white text-sm mb-2">
                      <li>Gender: {contest.attributes.gender}</li>
                      <li>Age: {contest.attributes.age}</li>
                      <li>Bust Size: {contest.attributes.bustSize}</li>
                      <li>Body Type: {contest.attributes.bodyType}</li>
                      <li>Skin Tone: {contest.attributes.skinTone}</li>
                      <li>Contributors Joined: {contest.attributes.user_joined}</li>
                    </ul>
                    <p className="text-white text-sm mb-2">
                      Starts In: <CountdownTimer targetTime={contest.startTime} />
                    </p>
                    <p className="text-white text-sm mb-4">
                      Ends In: <CountdownTimer targetTime={contest.endTime} />
                    </p>
                    <div className="flex space-x-4">
                      <button className="flex-1 py-2 border-2 border-[#ceb46a] rounded-md text-center text-[#ceb46a]">
                        Remove
                      </button>
                      <button onClick={() => navigate(`/vote/${contest.id}`)} className="...">
  Enter
</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}