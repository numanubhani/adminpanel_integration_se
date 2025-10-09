import { FaSearch, FaCaretDown, FaWallet } from "react-icons/fa";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useEffect, useState } from "react";
import defaultUserImg from "../assets/images/user.png";

export default function Topbar({ pageTitle }) {
  const [role, setRole] = useState("");
  const [profile, setProfile] = useState({
    screenName: "",
    idDocument: "",
  });

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(
          `https://selectexposure.pythonanywhere.com/api/accounts/profile/me/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();

        setProfile({
          screenName: data.screenName || data.screen_name || "User",
          idDocument: data.id_document
            ? (data.id_document.startsWith("http")
                ? data.id_document
                : `${process.env.REACT_APP_API_BASE}${data.id_document}`)
            : "",
        });
      } catch (err) {
        console.error("Topbar profile fetch error:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col gap-4 mb-6 md:mb-12 pt-4 md:pt-0 w-full px-2 relative">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div className="w-6 h-6 lg:hidden" />
        </div>

        {/* Right Section: Wallet + User */}
        <div className="flex items-center gap-4 mt-[-16px]">
          {role === "Judge" && (
            <div className="flex items-center bg-[#2a2a2d] border border-[#ceb46a] text-[#ceb46a] px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
              <FaWallet className="mr-1" />
              $15
            </div>
          )}

          {/* User Dropdown */}
          <Popover className="relative">
            <PopoverButton as="div" className="flex items-center gap-2 cursor-pointer">
              <img
                src={profile.idDocument || defaultUserImg}
                alt="User"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex flex-col justify-center leading-tight">
                <p className="text-sm font-medium text-[#ceb46a] leading-none">
                  {profile.screenName || "Loading..."}
                </p>
                <p className="text-xs text-gray-500 leading-none">
                  {role === "Judge" ? "User" : role || "Loading..."}
                </p>
              </div>
              <FaCaretDown className="text-[#ceb46a] mt-1" />
            </PopoverButton>

            <PopoverPanel className="absolute z-10 mt-2 bg-[#1c1c1e] rounded-xl w-36 p-2 shadow-md border border-gray-700/40">
              <a
                href="/my-info"
                className="block w-full px-4 py-2 rounded-md hover:bg-gray-800/60 text-sm text-white"
              >
                Settings
              </a>
              <button
                onClick={() => {
                  localStorage.removeItem("auth");
                  localStorage.removeItem("token");
                  localStorage.removeItem("role");
                  window.location.href = "/login";
                }}
                className="block w-full text-left px-4 py-2 rounded-md hover:bg-gray-800/60 text-sm text-white"
              >
                Logout
              </button>
            </PopoverPanel>
          </Popover>
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full flex justify-center">
        <div className="relative w-full max-w-md">
          <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-[#ceb46a]" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-[#1C1C1E] w-full text-[grey] pl-10 pr-4 py-2 border border-[#1C1C1E] rounded-md shadow-sm focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
