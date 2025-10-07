import React, { useState, useMemo } from "react";
import FilterData from "./FilterData";
import SortData from "./SortData";
import { PopoverButton } from "@headlessui/react";


const TransactionTable = ({
  data: initialData,
  title,
  type,
  setTransactions,
}) => {
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;


  const [sortSelected, setSortSelected] = useState("");
  const [filter, setFilter] = useState(false);

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

  const handleDelete = (id) => {
    console.log("Delete transaction with ID:", id);
    setTransactions((prev) =>
      prev.filter((transaction) => transaction.id !== id)
    );
  };

  const handleSort = (value) => {
    setSortSelected(value);
    // Implement sorting logic here
    console.log("Sorting data...", value);
  };


  return (
    <div className="w-full mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold mb-2 font-inter mr-3 text-[#ceb46a]">
          {title}
        </h2>
        <div className="relative flex-grow max-w-sm">
          <input
            type="text"
            placeholder="Search"
            value={filterValue}
            onChange={handleFilterChange}
            className="pl-10 pr-4 py-2 rounded-full border border-[#ceb46a] bg-[#1C1C1E] text-[#667080] w-full"
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
        <FilterData isOpen={filter} setIsOpen={setFilter} />

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

      <div className="overflow-hidden rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-[#ceb46a] text-black">
              <th className="py-4 px-6 text-left">{type} ID</th>
              <th className="py-4 px-6 text-left">Amount</th>
              <th className="py-4 px-6 text-left">Date</th>
              <th className="py-4 px-6 text-left">Status</th>
              <th className="py-4 px-6 text-left">Method</th>
              <th className="py-4 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((transaction, index) => (
              <tr
                key={transaction.id}
                className={
                  index % 2 === 0
                    ? "bg-[#161617] text-white"
                    : "bg-[#1C1C1E] text-white"
                }
              >
                <td className="py-4 px-6">{transaction.id}</td>
                <td className="py-4 px-6">${transaction.amount}</td>
                <td className="py-4 px-6">{transaction.date}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      transaction.status === "Completed"
                        ? "bg-tarnsparent text-[#2D8E00] border border-[#2D8E00]"
                        : "text-[#EA4335] border border-[#EA4335]"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
                <td className="py-4 px-6">{transaction.method}</td>
                <td className="py-4 px-6">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(transaction.id)}
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

      <div className="flex justify-between items-center mt-4">
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

export default TransactionTable;
