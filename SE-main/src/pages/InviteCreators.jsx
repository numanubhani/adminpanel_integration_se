import Sidebar from "../components/Sidebar";
import creator1Img from "../assets/images/creator1.png";
import Topbar from "../components/Topbar";
import { useState } from "react";
import InvitationTable from "../components/InvitationTable";
import SelectList from "../components/SelectList";

const messageOptions = [
  {
    label: "Select a message",
    value: "",
  },
  {
    label:
      "You’re perfect! You could retire if you joined Select Exposure!\nJoin now to start winning contests: https://selectexposure.com/join",
    value: "msg1",
  },
  {
    label:
      "With your body, you could make millions on Select Exposure!\nJoin now to start winning contests: https://selectexposure.com/join",
    value: "msg2",
  },
  {
    label:
      "You have the world’s BEST butt! You’d crush it on Select Exposure.\nJoin now to start winning contests: https://selectexposure.com/join",
    value: "msg3",
  },
  {
    label:
      "You have the cutest feet! You should enter them into a Select Exposure Contest.\nJoin now to start winning contests: https://selectexposure.com/join",
    value: "msg4",
  },
  {
    label:
      "You have a great body! You should show it off on Select Exposure.\nJoin now to start winning contests: https://selectexposure.com/join",
    value: "msg5",
  },
  {
    label:
      "A Select Exposure User has nominated your Legs for an online Hot Body Contest.\nJoin now to start winning contests: https://selectexposure.com/join",
    value: "msg6",
  },
  {
    label:
      "A Select Exposure User has nominated your Chest & Stomach for an online Hot Body Contest.\nJoin now to start winning contests: https://selectexposure.com/join",
    value: "msg7",
  },
  {
    label:
      "A Select Exposure User wants to see your Butt in a Select Exposure Hot Body Contest.\nJoin now to start winning contests: https://selectexposure.com/join",
    value: "msg8",
  },
  {
    label:
      "A Select Exposure User has nominated your Feet for an online Hot Body Contest.\nJoin now to start winning contests: https://selectexposure.com/join",
    value: "msg9",
  },
];


export default function InviteCreators() {
  const [message, setMessage] = useState(messageOptions[0]);
  const [invitations, setInvitations] = useState([
    {
      id: 1,
      email: "friend1@email.com",
      method: "Email",
      date: "2025-03-10",
      joining_status: "Joined",
    },
    {
      id: 2,
      email: "friend2@email.com",
      method: "Email",
      date: "2025-03-10",
      joining_status: "Pending",
    },
    {
      id: 3,
      email: "Asim Halder",
      method: "SMS",
      date: "2025-03-10",
      joining_status: "Failed",
    },
    {
      id: 4,
      email: "friend5@email.com",
      method: "Email",
      date: "2025-03-10",
      joining_status: "Pending",
    },
  ]);

  const [activeTab, setActiveTab] = useState("email");
  const [emailAddress, setEmailAddress] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSend = () => {
    setShowConfirmModal(true);
  };

  const confirmSend = () => {
    setShowConfirmModal(false);
    console.log("Sending invite to:", emailAddress);
    // Add real invite logic here
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:ml-64 w-full">
        <Topbar pageTitle="Send a Smoke Signal" />

        <div className="mx-auto p-2 md:p-6 w-full">
          <h1 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4 font-inter text-white flex items-center gap-2">
            Know a smoke that should be on Select Exposure?
          </h1>

          <p className="text-gray-700 mb-4 md:mb-8 text-white text-sm md:text-base">
            Answer: Yes! We all know a smoke we'd like to see strip down – It
            could be a classmate, co-worker, neighbor, friend, even a teacher or
            nurse. Use Smoke Signal to send an <span className="underline">anonymous</span> invite to join Select
            Exposure. Your secret is safe with us! <strong>We’ll even use the email address or phone number you provide to let you know if your smoke joins Select Exposure.</strong>
          </p>

          <div className="bg-[#1C1C1E] rounded-lg shadow-md p-3 md:p-6 mb-4 md:mb-6">
            <div className="border-b mb-4 md:mb-6">
              <div className="flex">
                <button
                  className={`pb-2 mr-4 font-medium text-sm md:text-base ${
                    activeTab === "email"
                      ? "border-b-2 border-[#ceb46a] text-[#ceb46a]"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("email")}
                >
                  Invite via Email
                </button>
                <button
                  className={`pb-2 font-medium text-sm md:text-base ${
                    activeTab === "sms"
                      ? "border-b-2 border-[#ceb46a] text-[#ceb46a]"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("sms")}
                >
                  Invite via SMS
                </button>
              </div>
            </div>

            <div className="mb-4">
              <SelectList
                label="Choose An Invite Message:"
                options={messageOptions}
                value={message}
                onChange={setMessage}
                placeholder="Select a message"
              />
            </div>

            {activeTab === "email" && (
              <div className="mb-4 md:mb-6">
                <label className="block text-white font-medium mb-2 text-sm md:text-base">
                  Enter Email Address:
                </label>
                <input
                  type="email"
                  className="w-full p-2 md:p-3 text-[#667080] border border-[#ceb46a] bg-transparent placeholder-[#667080] rounded-lg text-sm md:text-base"
                  placeholder="Enter email address"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
              </div>
            )}

            {activeTab === "sms" && (
              <div className="mb-4 md:mb-6">
                <label className="block text-white font-medium mb-2 text-sm md:text-base">
                  Enter Phone Number:
                </label>
                <input
                  type="tel"
                  className="w-full p-2 md:p-3 text-[#667080] border border-[#ceb46a] bg-transparent placeholder-[#667080] rounded-lg text-sm md:text-base"
                  placeholder="Enter phone number"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 md:gap-4">
              <button className="px-4 md:px-8 py-2 md:py-3 border border-[#ceb46a] text-[#ceb46a] font-medium rounded-lg text-sm md:text-base">
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="px-4 md:px-8 py-2 md:py-3 bg-[#ceb46a] text-black font-medium rounded-lg text-sm md:text-base flex items-center gap-2"
              >
                <span className="bg-black text-[#ceb46a] text-xm font-bold px-2 py-1 rounded-full">$1</span>
                Send Invite
              </button>
            </div>
          </div>
        </div>

        <div className="py-4 md:py-10 overflow-x-auto">
          <InvitationTable data={invitations} />
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-[#1C1C1E] text-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-[#ceb46a]">Confirm Invite</h2>
            <p className="mb-6">
              Are you sure you want to send this Smoke Signal invite? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="border border-[#ceb46a] px-4 py-2 rounded text-[#ceb46a]"
              >
                Cancel
              </button>
              <button
                onClick={confirmSend}
                className="bg-[#ceb46a] text-black px-4 py-2 rounded font-semibold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
