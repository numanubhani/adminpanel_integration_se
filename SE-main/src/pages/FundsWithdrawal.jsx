import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import Topbar from "../components/Topbar";
import {
  Balance,
  Withdrawal,
  Calculator,
  Withdrawal2,
} from "../components/CustomSVG";
import TransactionTable from "../components/TransactionTable";
import SelectList from "../components/SelectList";
import { useState } from "react";

const stats = [
  { label: "Available Balance", value: "$1250.00", icon: <Balance /> },
  { label: "Total Withdrawal", value: "$655.00", icon: <Withdrawal /> },
  {
    label: "Last Withdrawal",
    value: "2025-03-10",
    icon: <Calculator size={20} />,
  },
  {
    label: "Minimum Withdrawal",
    value: "$50.00",
    icon: <Withdrawal2 size={20} />,
  },
];

const transactionData = [
  {
    id: 1,
    status: "Completed",
    date: "2025-03-10",
    amount: 200,
    method: "Bank Transfer",
  },
  {
    id: 2,
    status: "Canceled",
    date: "2025-03-10",
    amount: 200,
    method: "Bank Transfer",
  },
  {
    id: 3,
    status: "Completed",
    date: "2025-03-10",
    amount: 200,
    method: "Bank Transfer",
  },
  {
    id: 4,
    status: "Completed",
    date: "2025-03-10",
    amount: 200,
    method: "Bank Transfer",
  },
  {
    id: 5,
    status: "Canceled",
    date: "2025-03-10",
    amount: 200,
    method: "Bank Transfer",
  },
  {
    id: 6,
    status: "Completed",
    date: "2025-03-10",
    amount: 200,
    method: "Bank Transfer",
  },
];

const methods = [
  { value: 1, label: "Bank Transfer" },
  { value: 2, label: "Paypal" },
  { value: 3, label: "American Payment" },
];

export default function FundsWithdrawal() {
    const [method, setMethod] = useState(methods[0]);
    const [transactions, setTransactions] = useState(transactionData);
  
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:ml-64 w-full">
        <Topbar pageTitle="Funds Withdrawal" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-10">
          {stats.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>

        <div className="bg-[#1C1C1E] shadow-[0_5px_10px_rgba(0,0,0,0.05),5px_0_10px_rgba(0,0,0,0.05),-5px_0_10px_rgba(127,86,217,0.05)] rounded-xl p-4 md:p-6 w-full relative mt-8 md:mt-16">
          <form className="w-full mx-auto">
            <SelectList
              label="Select Withdrawal Method"
              options={methods}
              value={method}
              onChange={setMethod}
              placeholder="Select Withdrawal Method"
            />
            {/* <label
              htmlFor="withdrawal-method"
              className="block mb-2 text-md font-medium text-white"
            >
              Select Withdrawal Method
            </label>
            <select
              id="withdrawal-method"
              className="bg-transparent border border-[#ceb46a] text-[#667080] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option selected>Select Withdrawal Method</option>
              <option value="1">Bank Transfer</option>
              <option value="2">Paypal</option>
              <option value="3">American Payment</option>
            </select> */}
          </form>
          <div className="flex justify-end space-x-4 mt-6">
            <button className="py-2 px-4 border-2 border-[#ceb46a] rounded-md text-[#ceb46a]">
              Cancel
            </button>
            <button className="py-2 px-6 bg-[#ceb46a] text-black rounded-md">
              Withdraw
            </button>
          </div>
        </div>

        <div className="py-6 md:py-10 overflow-x-auto">
          <TransactionTable
            data={transactions}
            setTransactions={setTransactions}
            title="Transaction History"
            type="Transaction"
          />
        </div>
      </div>
    </div>
  );
}
