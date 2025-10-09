import Sidebar from "../components/Sidebar";
import ContestTable3 from "../components/ContestTable3";
import Topbar from "../components/Topbar";
import TransactionTable from "../components/TransactionTable";
import { useState } from "react";
import SelectList from "../components/SelectList";

const paymentHistory = [
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
const depositHistory = [
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

const withdrawalMethods = [
  // { label: "Select payment Method", value: "" },
  { label: "Bank Transfer", value: "1" },
  { label: "Paypal", value: "2" },
  { label: "American Payment", value: "3" },
];
export default function MyWallet() {
  const [method, setMethod] = useState(withdrawalMethods[0]);
  const [payments, setPaylents] = useState(paymentHistory);
  const [deposits, setDeposits] = useState(depositHistory);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 lg:ml-64">
        <Topbar pageTitle="My Wallet" />

        <div className="bg-[#1C1C1E] shadow-[0_5px_10px_rgba(0,0,0,0.05),5px_0_10px_rgba(0,0,0,0.05),-5px_0_10px_rgba(127,86,217,0.05)] rounded-xl p-6 w-full relative mt-16">
          <form class="w-full mx-auto">
            {/* <label
              for="withdrawal-method"
              class="block mb-2 text-md font-medium text-white"
            >
              Add Funds
            </label> */}
            {/* <select
              id="withdrawal-method"
              class="bg-transparent border border-[#ceb46a] text-[#667080] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option selected>Select Withdrawal Method</option>
              <option value="1">Bank Transfer</option>
              <option value="2">Paypal</option>
              <option value="3">American Payment</option>
            </select> */}

            <SelectList
              label="Add Funds"
              options={withdrawalMethods}
              value={method}
              onChange={setMethod}
              placeholder="Select payment Method"
            />
          </form>
          <div className="flex justify-end space-x-4 mt-6">
            <button className="py-2 px-4 border-2 border-[#ceb46a] rounded-md text-[#ceb46a]">
              Cancel
            </button>
            <button className="py-2 px-6 bg-[#ceb46a] text-black rounded-md">
              Deposit
            </button>
          </div>
        </div>

        <div className="py-10 mt-5">
          <TransactionTable
            data={deposits}
            setTransactions={setDeposits}
            title="Deposit History"
            type="Deposit"
          />
        </div>

        <div className="py-7">
          <TransactionTable
            setTransactions={setPaylents}
            data={payments}
            title="Payment Transaction History"
            type="Transaction"
          />
        </div>
      </div>
    </div>
  );
}
