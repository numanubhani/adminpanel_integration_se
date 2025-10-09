import Sidebar from '../components/Sidebar';
import ContestTable3 from '../components/ContestTable3';
import Topbar from '../components/Topbar';
import ContestFilter from '../components/ContestFilter';
import { useState, useEffect } from 'react';
import BASE_URL from '../utils/instance';

export default function Contests() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const role = localStorage.getItem("role");
  
  // Fetch contests from backend
  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        
        const response = await fetch(`${BASE_URL}accounts/contests/`, {
          headers: {
            "Authorization": token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch contests");
        }

        const data = await response.json();
        console.log("Fetched contests:", data);
        
        // Transform backend data to match expected format for ContestTable3
        const transformedData = data.map(contest => ({
          id: contest.id,
          name: contest.title,
          status: contest.is_active ? "Active" : "Inactive",
          category: contest.category,
          method: contest.recurring === "none" ? "One-time" : contest.recurring,
          rank: `${contest.joined || 0}/${contest.max_participants || 500}`,
        }));
        
        setContests(transformedData);
        setError("");
      } catch (err) {
        console.error("Error fetching contests:", err);
        setError(err.message || "Failed to load contests");
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:ml-64 w-full">
        <Topbar pageTitle="Contests"/>

        {error && (
          <div className="mb-4 p-4 bg-red-900 bg-opacity-50 border border-red-500 rounded text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="text-[#ceb46a] text-lg">Loading contests...</div>
          </div>
        ) : (
          <>
            <div className="overflow-hidden">
              <ContestFilter role={role} />
            </div>

            {role === "Judge" ? null : (
              <div className="py-6 md:py-10 mt-3 md:mt-5 overflow-x-auto">
                <ContestTable3 role={role} data={contests} setContests={setContests} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}