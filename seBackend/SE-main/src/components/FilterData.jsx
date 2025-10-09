import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import SelectList from "./SelectList";
import Datepicker from "react-tailwindcss-datepicker";
import {
  Dialog,
  DialogPanel,
  DialogBackdrop,
  CloseButton,
} from "@headlessui/react";

const allStatus = [
  { label: "Open", value: "open" },
  { label: "Close", value: "close" },
];

const allCategories = [
  { label: "Hair Color", value: "hair_color" },
  { label: "Height", value: "height" },
  { label: "Weight", value: "weight" },
  { label: "Skin Tone", value: "skin_tone" },
  { label: "Body Type", value: "body_type" },
  { label: "Shoe Size", value: "shoe_size" },
  { label: "Bust", value: "bust" },
  { label: "Penis Size", value: "penis_size" },
  { label: "Face", value: "face" },
  { label: "Feet", value: "feet" },
];

const FilterData = ({ isOpen, setIsOpen }) => {
  const [status, setSatus] = useState(allStatus[0]);
  const [category, setCategory] = useState(allCategories[0]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleRest = (type) => {
    if (type === "date") {
      setStartDate(null);
      setEndDate(null);
      return;
    }
    if (type === "status") {
      setSatus(allStatus[0]);
      return;
    }
    if (type === "category") {
      setCategory(allCategories[0]);
      return;
    }
    setStartDate(null);
    setEndDate(null);
    setSatus(allStatus[0]);
    setCategory(allCategories[0]);
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-[409px] w-full space-y-4 border rounded-xl border-gray-400 bg-[#161617]">
          <div className="flex items-center justify-between gap-3 border-b border-[#667080] p-4">
            <div className="flex items-center gap-3">
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
              <span className="text-xs text-white">Filter</span>
            </div>
            <CloseButton className="bg-[#ceb46a] text-black rounded-full p-1">
              <IoCloseOutline size={20} />
            </CloseButton>
          </div>

          <div className="p-5 space-y-7">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-white">
                <label className="font-medium">Contest Date</label>
                <button onClick={() => handleRest("date")}>Reset</button>
              </div>
              <div className="flex items-center justify-between gap-5">
                <div className="flex flex-col space-y-2">
                  <label className="text-xs">Start Date:</label>
                  <Datepicker
                    inputClassName="bg-transparent border border-gray-400 rounded-xl p-2 text-white text-sm placeholder:text-sm"
                    inputId="startDate"
                    inputName="startDate"
                    displayFormat="DD/MM/YYYY"
                    required={true}
                    useRange={false}
                    asSingle={true}
                    value={{ startDate, endDate: startDate }}
                    onChange={(newValue) => setStartDate(newValue.startDate)}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-xs">End Date:</label>
                  <Datepicker
                    inputClassName="bg-transparent border border-gray-400 rounded-xl p-2 text-white text-sm placeholder:text-sm"
                    inputId="endDate"
                    inputName="endDate"
                    displayFormat="DD/MM/YYYY"
                    required={true}
                    useRange={false}
                    asSingle={true}
                    value={{ startDate: endDate, endDate: endDate }}
                    onChange={(newValue) => setEndDate(newValue.startDate)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-white">
                <label className="font-medium">Status:</label>
                <button onClick={() => handleRest("status")}>Reset</button>
              </div>
              <SelectList
                className="border rounded-xl border-gray-400"
                buttonClassName="bg-transparent text-[11px]"
                optionsClassName="border border-gray-400"
                optionClassName="text-xs"
                label=""
                options={allStatus}
                value={status}
                onChange={setSatus}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-white">
                <label className="font-medium">Category:</label>
                <button onClick={() => handleRest("category")}>Reset</button>
              </div>
              <SelectList
                className="border rounded-xl border-gray-400"
                buttonClassName="bg-transparent text-[11px]"
                optionsClassName="border border-gray-400"
                optionClassName="text-xs"
                label=""
                options={allCategories}
                value={category}
                onChange={setCategory}
              />
            </div>
          </div>

          <div className="flex px-5 pb-5 gap-4">
            <button
              onClick={() => handleRest("")}
              className="border w-2/4 border-gray-400 rounded-full text-lg font-medium text-white px-4 py-2"
            >
              Reset
            </button>
            <button className="w-2/4 bg-[#ceb46a] hover:bg-[#b9a05a] transition duration-300 rounded-full text-lg font-medium text-black px-4 py-2">
              Apply
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default FilterData;
