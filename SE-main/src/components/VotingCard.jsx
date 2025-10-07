import React from "react";
import ImageMock from "../assets/images/image-mock.png";
import Dropdown from "../components/DropDown";
import { MenuButton } from "@headlessui/react";
import { FaBars, FaHeart } from "react-icons/fa";


const VotingCard = () => {
  const handleMenuClick = (value) => {
    console.log(value);
  };
  return (
    <div className="rounded-lg bg-gray-800 p-6 shadow-md h-[280px] sm:h-[300px] w-full md:h-[500px] md:w-[555px]">
      <div className="flex justify-between">
        <Dropdown
          triggerButton={
            <MenuButton>
              <button className="p-2 rounded-xl text-white">
                <FaBars size={30} />
              </button>
            </MenuButton>
          }
          items={[
            {
              label: "Tip Creator",
              value: "tip-creator",
              onClick: handleMenuClick,
            },
            {
              label: "Visit Profile",
              value: "tip-creator",
              onClick: handleMenuClick,
            },
            {
              label: "Flag for Review",
              value: "tip-creator",
              onClick: handleMenuClick,
            },
          ]}
        />

        <button className="text-[#ea4335]">
          <FaHeart size={30} />
        </button>
      </div>
      <div className="flex items-center justify-center mt-6 lg:mt-10">
        <img
          className="size-[150px] md:size-[300px]"
          src={ImageMock}
          alt="content"
        />
      </div>
    </div>
  );
};

export default VotingCard;
