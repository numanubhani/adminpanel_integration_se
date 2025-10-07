import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import CreatorCard from "../components/CreatorCard";
import ContestTable from "../components/ContestTable";
import {
  FaTrophy,
  FaStar,
  FaMedal,
  FaChartLine,
  FaDollarSign,
} from "react-icons/fa";
import creator1Img from "../assets/images/creator1.png";
import Topbar from "../components/Topbar";
import { useEffect, useState } from "react";
import { BASE_URL } from "../Instance";

const defaultStats = [
  { label: "Contests Joined", value: 0, icon: <FaChartLine size={20} /> },
  { label: "Best Finish", value: "-", icon: <FaTrophy size={20} /> },
  { label: "Top 3 Finishes", value: 0, icon: <FaMedal size={20} /> },
  { label: "Top 10 Finishes", value: 0, icon: <FaStar size={20} /> },
  { label: "Total Earnings", value: "$0", icon: <FaDollarSign size={20} /> },
];

const contestsStartingSoon = [
  {
    id: 1,
    name: "Best Hands Challenge",
    status: "Open",
    startDate: "2025-06-05",
    endDate: "2025-06-10",
    maxEntrants: 200,
  },
  {
    id: 2,
    name: "Hot Body Contest",
    status: "Open",
    startDate: "2025-06-07",
    endDate: "2025-06-14",
    maxEntrants: 290,
  },
];

const activeContests = [
  {
    id: 101,
    name: "Feet Model of the Month",
    status: "In Progress",
    startDate: "2025-05-25",
    endDate: "2025-06-01",
    maxEntrants: 180,
  },
  {
    id: 102,
    name: "Creative Pose Challenge",
    status: "In Progress",
    startDate: "2025-05-20",
    endDate: "2025-06-05",
    maxEntrants: 150,
  },
];

export default function DashboardCreator() {
  const [contests, setContests] = useState(contestsStartingSoon);
  const [active, setActive] = useState(activeContests);
  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${BASE_URL}dashboard/contributor/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        setStats([
          { label: "Contests Joined", value: d.contests_joined, icon: <FaChartLine size={20} /> },
          { label: "Best Finish", value: d.best_finish, icon: <FaTrophy size={20} /> },
          { label: "Top 3 Finishes", value: d.top_3_finishes, icon: <FaMedal size={20} /> },
          { label: "Top 10 Finishes", value: d.top_10_finishes, icon: <FaStar size={20} /> },
          { label: "Total Earnings", value: `$${d.total_earnings}`, icon: <FaDollarSign size={20} /> },
        ]);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:ml-64 w-full">
        <Topbar pageTitle="Dashboard" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 md:mb-10">
          {stats.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>

        {/* Contests Starting Soon */}
        <h2 className="text-xl font-semibold text-white mb-4">Contests Starting Soon</h2>
        <div className="mb-10 overflow-x-auto">
          <ContestTable
            data={contests}
            setContests={setContests}
            showJoinButton={true}
          />
        </div>

        {/* Your Active Contests */}
        <h2 className="text-xl font-semibold text-white mb-4">Your Active Contests</h2>
        <div className="overflow-x-auto">
          <ContestTable
            data={active}
            setContests={setActive}
            showInProgress={true}
          />
        </div>
      </div>
    </div>
  );
}
