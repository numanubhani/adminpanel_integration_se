import React, { useState, useMemo, useEffect } from "react";
import SortData from "./SortData";
import { PopoverButton } from "@headlessui/react";
import FilterData from "./FilterData";
import { FaTrophy, FaAward, FaMedal, FaStar } from "react-icons/fa";

const TopCreatorsTable = ({ data: initialData, title }) => {
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const itemsPerPage = 6;

  const [sortSelected, setSortSelected] = useState("");
  const [filter, setFilter] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredData = useMemo(() => {
    if (!filterValue) return initialData;

    return initialData.filter((item) => {
      const searchStr = filterValue.toLowerCase();
      return item.name.toLowerCase().includes(searchStr);
    });
  }, [initialData, filterValue]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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

  const handleSort = (value) => {
    setSortSelected(value);
    console.log("Sorting data...", value);
  };

  const renderMobileView = () => {
  return (
    <div className="space-y-4">
      {paginatedData.map((creator, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg ${
            index % 2 === 0 ? "bg-[#161617]" : "bg-[#1C1C1E]"
          }`}
        >
          <div className="flex items-center mb-3">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-8 h-8 mr-3 rounded-full border-2 border-white shadow-md"
            />
            <h3 className="font-semibold text-white">{creator.name}</h3>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm text-white">
            <div>
              <span className="text-gray-400 block">UpVotes</span>
              <span className="font-medium">{creator.votes}</span>
            </div>
            <div>
              <span className="text-gray-400 block">Contests Joined</span>
              <span className="font-medium">{creator.contests_joined}</span>
            </div>
            <div>
              <span className="text-gray-400 block">Contests Won</span>
              <span className="font-medium flex items-center gap-1">
                {creator.contests_win}
                <FaTrophy className="text-[#ceb46a] text-sm" />
              </span>
            </div>
            <div>
              <span className="text-gray-400 block">Galleries Completed</span>
              <span className="font-medium">{creator.galleries_completed}</span>
            </div>
          </div>

 <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-white">
  {/* Top 3 Finishes */}
  <div className="flex flex-col items-start">
    <span className="text-gray-400">Top 3 Finishes</span>
    <span className="font-semibold flex items-center gap-1">
      {Number.isFinite(Number(creator.top3Finishes)) ? creator.top3Finishes : 10}
      <FaMedal className="text-[#ceb46a] text-sm" />
    </span>
  </div>

  {/* Top 10 Finishes */}
  <div className="flex flex-col items-start">
    <span className="text-gray-400">Top 10 Finishes</span>
    <span className="font-semibold flex items-center gap-1">
      {Number.isFinite(Number(creator.top10Finishes)) ? creator.top10Finishes : 7}
      <FaStar className="text-[#ceb46a] text-sm" />
    </span>
  </div>
</div>





        </div>
      ))}
    </div>
  );
};


  const renderDesktopView = () => {
    return (
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-[#ceb46a] text-black">
              <th className="py-4 px-6 text-left">Content Creator</th>
              <th className="py-4 px-6 text-center">UpVotes</th>
              <th className="py-4 px-6 text-center">Contests Joined</th>
              <th className="py-4 px-6 text-center">Contests Won</th>
             <th className="py-4 px-6 text-center">Top 3 Finishes</th>
              <th className="py-4 px-6 text-center">Top 10 Finishes</th>
              <th className="py-4 px-6 text-center">Galleries Completed</th>
            </tr>
          </thead>
       <tbody>
  {paginatedData.map((creator, index) => {
    console.log(`Creator Row #${index + 1}:`, creator); // Debug line

    return (
      <tr
        key={index}
        className={
          index % 2 === 0
            ? "bg-[#161617] text-white"
            : "bg-[#1C1C1E] text-white"
        }
      >
        <td className="py-4 px-6 flex items-center gap-3 font-semibold">
          <img
            src={creator.avatar}
            alt={creator.name}
            className="size-8 rounded-full border-2 border-white shadow-md"
          />
          {creator.name}
        </td>

        <td className="py-4 px-6 text-center">{creator.votes}</td>

        <td className="py-4 px-6 text-center">{creator.contests_joined}</td>

        {/* ✅ 4. Contests Win */}
        <td className="py-4 px-6 text-center">
          {creator.contests_win} <FaTrophy className="text-[#ceb46a] inline ml-1 text-sm" />
        </td>

       <td className="py-4 px-6 text-center">
  {creator.top3Finishes}
</td>
<td className="py-4 px-6 text-center">
  {creator.top10Finishes}
</td>


        {/* ✅ 6. Galleries Completed */}
        <td className="py-4 px-6 text-center">{creator.galleries_completed}</td>
      </tr>
    );
  })}
</tbody>


        </table>
      </div>
    );
  };

  return (
    <div className="w-full mx-auto">
      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold mb-2 md:mb-0 font-inter md:mr-3 text-[#CEB46A]">
          {title}
        </h2>
        <div className="relative flex-grow max-w-sm">
          <input
            type="text"
            placeholder="Search"
            value={filterValue}
            onChange={handleFilterChange}
            className="pl-10 pr-4 py-2 rounded-full border border-[#ceb46a] w-full bg-[#1C1C1E] text-[#667080]"
          />
          <svg
            className="absolute left-3 top-2.5 text-[#ceb46a]"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <div className="flex gap-2 mt-2 md:mt-0">
          <button
            onClick={() => setFilter(true)}
            className="p-2 border border-[#ceb46a] rounded outline-0"
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

          <FilterData isOpen={filter} setIsOpen={setFilter} />

          <SortData
            triggerButton={
              <PopoverButton className="p-2 border border-[#ceb46a] rounded outline-0">
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

      {isMobile ? renderMobileView() : renderDesktopView()}

      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
        <div className="text-sm text-gray-600 order-2 sm:order-1">
          Page {currentPage} of {totalPages || 1}
        </div>
        <div className="flex gap-2 order-1 sm:order-2">
          <button
            className="px-3 sm:px-4 py-1 text-[#667080] border border-gray-300 rounded flex items-center gap-1 disabled:opacity-50 text-sm"
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
            <span className="hidden sm:inline">Previous</span>
          </button>
          <button
            className="px-3 sm:px-4 py-1 text-[#667080] border border-gray-300 rounded flex items-center gap-1 disabled:opacity-50 text-sm"
            onClick={nextPage}
            disabled={currentPage >= totalPages}
          >
            <span className="hidden sm:inline">Next</span>
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

export default TopCreatorsTable;
