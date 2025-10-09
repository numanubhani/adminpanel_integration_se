import Sidebar from '../components/Sidebar';
import ContestTable3 from '../components/ContestTable3';
import Topbar from '../components/Topbar';
import ContestFilter from '../components/ContestFilter';
import { useState } from 'react';

const contestData = [
    {
      id: 1,
      name: "Best Hands Challenge",
      status: "Completed",
      category: "Face",
      method: "unkown",
      rank: "Top 10",
    },
    {
      id: 2,
      name: "Feet Model of the Month",
      status: "Canceled",
      category: "Face",
      method: "unkown",
      rank: "Top 10",
    },
    {
      id: 3,
      name: "Face Reveal Challenge",
      status: "Completed",
      category: "Face",
      method: "unkown",
      rank: "Top 10",
    },
    {
      id: 4,
      name: "Hot Body Contest",
      status: "Completed",
      category: "Face",
      method: "unkown",
      rank: "Top 10",
    },
    {
      id: 5,
      name: "Creative Pose Challenge",
      status: "Canceled",
      category: "Face",
      method: "unkown",
      rank: "Top 10",
    },
    {
      id: 6,
      name: "Best Fashion Look",
      status: "Completed",
      category: "Face",
      method: "unkown",
      rank: "Top 10",
    },
    {
      id: 7,
      name: "Best Bust",
      status: "Completed",
      category: "Bust",
      method: "unkown",
      rank: "Top 10",
    }, 
    {
      id: 8,
      name: "Best Fashion Look",
      status: "Completed",
      category: "Feet",
      method: "unkown",
      rank: "Top 10",
    }
  ];

export default function Contests() {
  const [contests, setContests] = useState(contestData);
  const role = localStorage.getItem("role");
  

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:ml-64 w-full">
        <Topbar pageTitle="Contests"/>

        <div className="overflow-hidden">
          <ContestFilter role={role} />
        </div>

       {role === "Judge" ? null : <div className="py-6 md:py-10 mt-3 md:mt-5 overflow-x-auto">
          <ContestTable3 role={role} data={contests} setContests={setContests} />
        </div>}
        
      </div>
    </div>
  );
}