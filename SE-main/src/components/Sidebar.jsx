import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaCamera,
  FaImages,
  FaMoneyBillWave,
  FaUser,
  FaInfoCircle,
  FaSignOutAlt,
  FaSignal,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { SlBadge } from "react-icons/sl";
import Logo from "../assets/images/logo.png";
import { BiSearchAlt2 } from "react-icons/bi";
import { FaUserPlus } from "react-icons/fa";
import { IoMdWallet } from "react-icons/io";
import { RiMessage2Fill } from "react-icons/ri";
import { IoIosNotifications } from "react-icons/io";

export default function Sidebar() {
  const location = useLocation();
  const role = (localStorage.getItem("role") || "").toLowerCase(); // ✅ case-insensitive
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Close sidebar on navigation (mobile only)
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  const adminMenu = [
    { name: "Dashboard", icon: <MdDashboard />, path: "/admin/dashboard" },
    { name: "Creator Validation", icon: <FaUserPlus />, path: "/admin/validation" },
    { name: "Contests Management", icon: <SlBadge />, path: "/admin/contests" },
    { name: "Content Moderation", icon: <FaImages />, path: "/admin/moderation" },
    { name: "Contributor Metrics", icon: <FaSignal />, path: "/admin/leaderboard" },
    { name: "Smoke Signal", icon: <FaUser />, path: "/admin/smoke-signal" },
    { name: "Contest Performance", icon: <FaCamera />, path: "/admin/daily-contests" },
    { name: "Contributor Performance", icon: <FaUser />, path: "/admin/contributor-performance" },
    { name: "Accounts Payable", icon: <FaUser />, path: "/admin/photo-approvals" },
  ];

  const creatorMenu = [
    { name: "Dashboard", icon: <MdDashboard />, path: "/dashboard" },
    { name: "Performance History", icon: <FaSignal />, path: "/performance-history" },
    { name: "Contests", icon: <SlBadge />, path: "/contests" },
    { name: "Photo Capture", icon: <FaCamera />, path: "/photo-capture" },
    { name: "My Photo Galleries", icon: <FaImages />, path: "/photo-galleries" },
    { name: "Funds Withdrawal", icon: <FaMoneyBillWave />, path: "/funds-withdrawal" },
    { name: "My Profile", icon: <FaUser />, path: "/profile" },
    { name: "My Info", icon: <FaInfoCircle />, path: "/my-info" },
    { name: "Terms & Conditions", icon: <RiMessage2Fill />, path: "/conditions" },
    { name: "FAQs", icon: <RiMessage2Fill />, path: "/faqs" },
  ];

  const judgeMenu = [
    { name: "Dashboard", icon: <MdDashboard />, path: "/dashboard" },
    { name: "Explore Content", icon: <BiSearchAlt2 />, path: "/explore-content" },
    { name: "Contests", icon: <SlBadge />, path: "/contests" },
    { name: "Send a Smoke Signal", icon: <FaUserPlus />, path: "/invite-creators", highlight: true },
    { name: "My Wallet", icon: <IoMdWallet />, path: "/my-wallet" },
    { name: "Crowd Cash", icon: <RiMessage2Fill />, path: "/crowd_cash" },
    { name: "My Info", icon: <FaInfoCircle />, path: "/my-info" },
    { name: "Notifications", icon: <IoIosNotifications />, path: "/notifications" },
    { name: "Terms & Conditions", icon: <RiMessage2Fill />, path: "/conditions" },
    { name: "FAQs", icon: <RiMessage2Fill />, path: "/faqs" },
  ];

  // ✅ Match role properly
  const menuItems =
    role === "admin"
      ? adminMenu
      : role === "user"
      ? judgeMenu
      : role === "contributor"
      ? creatorMenu
      : [];

  // Mobile hamburger toggle
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-30 bg-[#1C1C1E] p-2 rounded-md text-[#ceb46a]"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isMobile
            ? `fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`
            : "hidden"
        } lg:block`}
        onClick={isMobile ? toggleSidebar : undefined}
      >
        <div
          className={`w-64 border-r border-[#ceb46a] p-4 h-screen fixed left-0 top-0 z-20 bg-black flex flex-col justify-between transition-transform duration-300 ${
            isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <div className="mb-8">
              <img src={Logo} alt="Logo" className="h-30" />
            </div>
            <ul>
              {menuItems.map((item, i) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={i}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 mb-4 px-2 py-2 rounded-md cursor-pointer 
                        ${
                          isActive
                            ? "bg-[#CEB46A] text-[#000000]"
                            : "text-[#ffffff] hover:text-[#000000] hover:bg-[#CEB46A]"
                        }`}
                    >
                      <span>{item.icon}</span>
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-8">
            <li
              className="text-white flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer"
              onClick={() => {
                localStorage.clear(); // ✅ clear everything
                window.location.href = "/login";
              }}
            >
              <FaSignOutAlt /> Logout
            </li>
          </div>
        </div>
      </div>
    </>
  );
}
