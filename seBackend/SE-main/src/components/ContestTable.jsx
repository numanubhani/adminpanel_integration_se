import React, { useState, useMemo, useEffect } from "react";
import SortData from "./SortData";
import { PopoverButton } from "@headlessui/react";
import FilterData from "./FilterData";

const ContestTable = ({ data: initialData, setContests }) => {
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const itemsPerPage = 6;
  const [sortSelected, setSortSelected] = useState("");
  const [filter, setFilter] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 1024);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const filteredData = useMemo(() => {
    if (!filterValue) return initialData;
    return initialData.filter((item) => {
      const searchStr = filterValue.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchStr) ||
        item.status.toLowerCase().includes(searchStr) ||
        item.startDate.includes(searchStr) ||
        item.endDate.includes(searchStr) ||
        item.maxEntrants.toString().includes(searchStr)
      );
    });
  }, [initialData, filterValue]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
    setCurrentPage(1);
  };

  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const previousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const getStatusStyle = (status) =>
    status === "Open"
      ? "px-3 py-1 rounded-full text-sm text-green-500 border border-green-500"
      : "px-3 py-1 rounded-full text-sm text-yellow-400 border border-yellow-400";

  const handleJoinClick = (contest) => {
    setSelectedContest(contest);
    setShowModal(true);
  };

  const handleConfirmJoin = () => {
    console.log("Joining contest:", selectedContest);
    setShowModal(false);
    setSelectedContest(null);
  };

  const handleDelete = (contestId) => {
    setContests((prev) => prev.filter((contest) => contest.id !== contestId));
  };

  const renderModal = () => {
    if (!showModal || !selectedContest) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white rounded p-6 w-[90%] max-w-md text-black">
          <h2 className="text-lg font-semibold mb-4">Join Contest</h2>
          <p className="mb-4">Are you sure you want to join <strong>{selectedContest.name}</strong>?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border rounded text-gray-700 border-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmJoin}
              className="px-4 py-2 bg-[#ceb46a] text-black rounded hover:bg-yellow-500"
            >
              Confirm Join
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderAction = (contest) => {
    if (contest.status === "Open") {
      return (
        <>
          <button
            onClick={() => handleJoinClick(contest)}
            className="px-3 py-1 bg-[#ceb46a] text-black rounded text-sm hover:bg-yellow-500"
          >
            Join
          </button>
          <button
            onClick={() => handleDelete(contest.id)}
            className="p-2 border border-red-500 text-red-500 rounded"
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
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        </>
      );
    }
    return <span className="text-yellow-400 font-semibold text-sm">In Progress</span>;
  };

  const renderDesktopView = () => (
    <div className="overflow-hidden rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="bg-[#ceb46a] text-black">
            <th className="py-4 px-6 text-left">Contest Name</th>
            <th className="py-4 px-6 text-left">Status</th>
            <th className="py-4 px-6 text-left">Start Date</th>
            <th className="py-4 px-6 text-left">End Date</th>
            <th className="py-4 px-6 text-left">Max Entrants</th>
            <th className="py-4 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((contest, index) => (
            <tr
              key={contest.id}
              className={index % 2 === 0 ? "bg-[#161617] text-white" : "bg-[#1C1C1E] text-white"}
            >
              <td className="py-4 px-6">{contest.name}</td>
              <td className="py-4 px-6">
                <span className={getStatusStyle(contest.status)}>{contest.status}</span>
              </td>
              <td className="py-4 px-6">{contest.startDate}</td>
              <td className="py-4 px-6">{contest.endDate}</td>
              <td className="py-4 px-6">{contest.maxEntrants}</td>
              <td className="py-4 px-6 flex gap-2 items-center">
                {renderAction(contest)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderMobileView = () => (
    <div className="space-y-4">
      {paginatedData.map((contest) => (
        <div key={contest.id} className="bg-[#1C1C1E] p-4 rounded text-white">
          <h3 className="font-semibold text-lg mb-2">{contest.name}</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={getStatusStyle(contest.status)}>{contest.status}</span>
            </div>
            <div className="flex justify-between">
              <span>Start Date:</span>
              <span>{contest.startDate}</span>
            </div>
            <div className="flex justify-between">
              <span>End Date:</span>
              <span>{contest.endDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Max Entrants:</span>
              <span>{contest.maxEntrants}</span>
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            {renderAction(contest)}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full">
      {renderModal()}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
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
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <button onClick={() => setFilter(true)} className="p-2 border border-[#ceb46a] rounded">
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
              <PopoverButton className={"p-2 border border-[#ceb46a] rounded outline-0"}>
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
            onChange={(val) => setSortSelected(val)}
          />
        </div>
      </div>
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
            Previous
          </button>
          <button
            className="px-4 py-1 border border-[#667080] text-[#667080] rounded flex items-center gap-1 disabled:opacity-50"
            onClick={nextPage}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContestTable;