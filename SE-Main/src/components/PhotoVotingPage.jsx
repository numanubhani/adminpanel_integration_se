// File: pages/PhotoVotingPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import HandModeling from "../assets/images/hand-modeling.jpg";

export default function PhotoVotingPage() {
  const { contestId } = useParams();
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchedPhotos = [
      {
        id: 1,
        image: HandModeling,
        name: "Anna",
        votes: 12,
      },
      {
        id: 2,
        image: HandModeling,
        name: "Lena",
        votes: 8,
      },
      {
        id: 3,
        image: HandModeling,
        name: "Mira",
        votes: 4,
      },
    ];
    setPhotos(fetchedPhotos);
  }, [contestId]);

  const handleVote = (photoId) => {
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photoId ? { ...p, votes: p.votes + 1 } : p
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:ml-64 w-full">
        <Topbar pageTitle="Voting Panel" />
        <h1 className="text-3xl font-bold text-[#ceb46a] mb-6">
          Vote for Contestants - Contest #{contestId}
        </h1>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-[#1C1C1E] rounded-lg shadow p-4">
              <img
                src={photo.image}
                alt={photo.name}
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="mt-2 text-xl font-semibold">{photo.name}</h3>
              <p className="text-sm text-gray-400">Votes: {photo.votes}</p>
              <button
                onClick={() => handleVote(photo.id)}
                className="mt-3 w-full py-2 bg-[#ceb46a] text-black rounded-md"
              >
                Vote
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
