import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ContentContributorsUI from "../components/ContentContributorsFilter";
import CreatorCard from "../components/CreatorCard"; // ✅ use updated card

export default function ExploreContent() {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const role = localStorage.getItem("role");
  if (role === "Content Creator") return null;

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:ml-64 w-full">
        <Topbar pageTitle="Explore Content" />
        <ContentContributorsUI onContributorClick={setSelectedProfile} />
      </div>

      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#1c1c1e] rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg border border-[#ceb46a]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Contributor Details</h2>
              <button
                onClick={() => setSelectedProfile(null)}
                className="text-white text-xl font-bold hover:text-[#ceb46a]"
              >
                ✖
              </button>
            </div>
            <CreatorCard {...selectedProfile} detailedView={true} />
          </div>
        </div>
      )}
    </div>
  );
}
