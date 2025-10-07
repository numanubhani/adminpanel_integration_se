import React from "react";

const SubscriptionCard = ({name, image, specification, subscriptionFrom, creatorId, status}) => {
  return (
    <div className="max-w-sm p-6 bg-[#1C1C1E] rounded-2xl shadow-md">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={image}
          alt="Profile"
          className="size-[60px] rounded-full border-2 border-gray-300"
        />
        <div>
          <h2 className="text-lg font-semibold text-[#ceb46a]">{name}</h2>
          <p className="text-xs text-gray-500">Creator ID: #{creatorId}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        { specification && specification.map((spec, index) => (
          <span className="bg-[#ceb46a] text-[#000000] font-medium text-sm px-4 py-2 rounded-full shadow-sm">
            {spec}
          </span>
        ))}
      </div>

      <p className="text-sm text-[#ffffff] mb-4">
        Subscribed Since: <span className="font-medium">{subscriptionFrom}</span>
      </p>

      <div className={`inline-block px-4 py-1 ${status === 1 ? 'text-[#2D8E00]' : 'text-[#EA4335]'} border-2 ${status === 1 ? 'border-[#2D8E00]' : 'border-[#EA4335]'} rounded-full font-medium`}>
        { status === 1 ? 'Active' : 'Cancelled' }
      </div>
    </div>
  );
};

export default SubscriptionCard;
