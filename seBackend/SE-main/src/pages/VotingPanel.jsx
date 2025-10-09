import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import VotingCard from "../components/VotingCard";

export default function VotingPanel() {
  const role = localStorage.getItem("role");
  if (role === "Content Creator") return null;

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:ml-64 w-full">
        <Topbar pageTitle="Voting Panel" />

        <div className=" p-2 md:p-6 w-full flex flex-col justify-center  sm:flex-row gap-6">
          <VotingCard />
          <VotingCard />
        </div>
      </div>
    </div>
  );
}
