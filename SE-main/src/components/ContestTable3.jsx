import React, { useState, useMemo, useEffect } from "react";
import SortData from "./SortData";
import { PopoverButton } from "@headlessui/react";
import FilterData from "./FilterData";

const ContestTable3 = ({ role, data: initialData, setContests }) => {
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const itemsPerPage = 6;

  const [sortSelected, setSortSelected] = useState("");
  const [filter, setFilter] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Check on mount
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Filtering functionality
  const filteredData = useMemo(() => {
    if (!filterValue) return initialData;

    return initialData.filter((item) => {
      const searchStr = filterValue.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchStr) ||
        item.status.toLowerCase().includes(searchStr) ||
        item.method.includes(searchStr) ||
        item.category.includes(searchStr)
      );
    });
  }, [initialData, filterValue]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(0, 5);

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
    setCurrentPage(1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleDelete = (contestId) => {
    setContests((prev) => prev.filter((contest) => contest.id !== contestId));
  };

  const getStatusStyle = (status) => {
    return status === "Completed"
      ? "px-3 py-1 rounded-full text-sm bg-transparent text-[#2D8E00] border border-[#2D8E00]"
      : "px-3 py-1 rounded-full text-sm text-[#EA4335] border border-[#EA4335]";
  };

  const handleSort = (value) => {
    setSortSelected(value);
    // Implement sorting logic here
    console.log("Sorting data...", value);
  };

  // Mobile card view
  const renderMobileView = () => {
    return (
      <div className="space-y-4">
        {paginatedData.map((contest, index) => (
          <div
            key={`contest-${index}`}
            className="bg-[#1C1C1E] rounded-lg p-4 text-white"
          >
            <h3 className="font-semibold text-lg mb-3">{contest.name}</h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">ID:</span>
                <span>{contest.id}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Category:</span>
                <span>{contest.category}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={getStatusStyle(contest.status)}>
                  {contest.status}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Method:</span>
                <span>{contest.method}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Rank:</span>
                <span>{contest.rank}</span>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => handleDelete(contest.id)}
                className="p-2 border border-[#EA4335] rounded"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#EA4335"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
              <button className="p-2 border border-gray-300 rounded">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Desktop table view
  const renderDesktopView = () => {
    return (
      <div className="overflow-hidden rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-[#ceb46a] text-black">
              <th className="py-4 px-6 text-left">Contest ID</th>
              <th className="py-4 px-6 text-left">Name</th>
              <th className="py-4 px-6 text-left">Category</th>
              <th className="py-4 px-6 text-left">Status</th>
              <th className="py-4 px-6 text-left">Method</th>
              <th className="py-4 px-6 text-left">Rank</th>
              <th className="py-4 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((contest, index) => (
              <tr
                key={`contest-${index}`}

                className={
                  index % 2 === 0
                    ? "bg-[#161617] text-white"
                    : "bg-[#1C1C1E] text-white"
                }
              >
                <td className="py-4 px-6">{contest.id}</td>
                <td className="py-4 px-6">{contest.name}</td>
                <td className="py-4 px-6">{contest.category}</td>
                <td className="py-4 px-6">
                  <span className={getStatusStyle(contest.status)}>
                    {contest.status}
                  </span>
                </td>
                <td className="py-4 px-6">{contest.method}</td>
                <td className="py-4 px-6">{contest.rank}</td>
                <td className="py-4 px-6">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(contest.id)}
                      className="p-2 border border-[#EA4335] rounded"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#EA4335"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </button>
                    <button className="p-2 border border-gray-300 rounded">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14"></path>
                        <path d="M12 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="w-full mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold mb-2 sm:mb-0 font-inter sm:mr-3 text-[#ceb46a]">
          Contest History
        </h2>
        <div className="relative flex-grow max-w-sm w-full">
          <input
            type="text"
            placeholder="Search"
            value={filterValue}
            onChange={handleFilterChange}
            className="pl-10 pr-4 py-2 rounded-full border border-[#ceb46a] bg-[#1C1C1E] text-[#667080] w-full"
          />
          <svg
            className="absolute left-3 top-2.5 text-gray-400"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ceb46a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <button
            onClick={() => setFilter(true)}
            className={"p-2 border border-[#ceb46a] rounded outline-0"}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ceb46a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </button>
          <SortData
            triggerButton={
              <PopoverButton
                className={"p-2 border border-[#ceb46a] rounded outline-0"}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ceb46a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="6" x2="20" y2="6"></line>
                  <line x1="4" y1="12" x2="20" y2="12"></line>
                  <line x1="4" y1="18" x2="20" y2="18"></line>
                </svg>
              </PopoverButton>
            }
            options={[
              { value: "newest", label: "Max entrants first" },
              { value: "oldest", label: "Lowest entrants first" },
              { value: "random", label: "Random" },
            ]}
            value={sortSelected}
            onChange={handleSort}
          />
        </div>
      </div>
      <FilterData isOpen={filter} setIsOpen={setFilter} />
      {isMobile ? renderMobileView() : renderDesktopView()}

      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages || 1}
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-1 border border-[#667080] text-[#667080] rounded flex items-center gap-1 disabled:opacity-50"
            onClick={previousPage}
            disabled={currentPage <= 1}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Previous
          </button>
          <button
            className="px-4 py-1 border border-[#667080] text-[#667080] rounded flex items-center gap-1 disabled:opacity-50"
            onClick={nextPage}
            disabled={currentPage >= totalPages}
          >
            Next
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContestTable3;
