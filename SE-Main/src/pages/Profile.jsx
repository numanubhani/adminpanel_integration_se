import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { TbEdit } from "react-icons/tb";
import { FaMedal, FaTrophy, FaCamera, FaStar } from "react-icons/fa";

export default function Profile() {
  const [profileData, setProfileData] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [editMode, setEditMode] = useState({});
  const fileInputRef = useRef(null);

  // 🔹 Fetch profile from backend
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://selectexposure.pythonanywhere.com/api/accounts/profile/me/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();

      // ✅ Map backend → frontend
      setProfileData([
        { id: "legalFullName", label: "Name", value: data.legal_full_name || "", locked: true },
        { id: "screenName", label: "Screen Name", value: data.screen_name || "", locked: true },
        { id: "age", label: "Age", value: data.age ? `${data.age} Years` : "", locked: true },
        { id: "gender", label: "Gender", value: data.gender, locked: true },
        { id: "hairColor", label: "Hair Color", value: data.hair_color || "" },
        { id: "skinTone", label: "Skin Tone", value: data.skin_tone || "" },
        { id: "height", label: "Height", value: data.height || "" },
        { id: "weight", label: "Weight", value: data.weight || "" },
        { id: "body_type", label: "Body Type", value: data.body_type || "" },
        { id: "shoe_size", label: "Shoe Size", value: data.shoe_size || "" },
        { id: "bust_size", label: "Bust Size", value: data.bust_size || "N/A" },
        { id: "penis_size", label: "Penis Size", value: data.penis_length || "" },
        { id: "nationality", label: "Nationality", value: data.nationality || "", locked: true },
        { id: "state", label: "State", value: data.state || "" },
     { id: "country", label: "Country of Residence", value: data.country_residence || "", locked: true },
        {
          id: "allowNameInSearch",
          label: "Allow Name in Search",
          value: data.allow_name_in_search ? "Yes" : "No",
        },
      ]);

      // ✅ Handle profile image (idDocument)
      if (data.id_document) {
        if (data.id_document.startsWith("http")) {
          // Backend ne full URL diya hai
          setProfileImage(data.id_document);
        } else {
          // Backend ne sirf relative path diya (/media/...)
          const backendHost =
            process.env.REACT_APP_BACKEND_BASE;
          setProfileImage(`${backendHost}${data.id_document}`);
        }
      }
    } catch (err) {
      console.error("Profile load error:", err);
    }
  };

  fetchProfile();
}, []);


  const toggleEditMode = (id) => {
    setEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleChange = (id, newValue) => {
    setProfileData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: newValue } : item))
    );
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfileImage(ev.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Demo galleries (static)
  const galleries = [
    { name: "Teaser", development: false, trophies: 3, ribbons: 12, photos: 5 },
    { name: "Full Body", development: false, trophies: 3, ribbons: 12, photos: 8 },
    { name: "Legs", development: false, trophies: 3, ribbons: 12, photos: 7 },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:ml-64 w-full">
        <Topbar pageTitle="My Profile" />

        <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto">
          {/* LEFT PROFILE SECTION */}
          <div className="w-full md:w-1/2 bg-[#1C1C1E] rounded-xl mb-6 md:mb-0 p-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#CEB46A] shadow">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="bg-[#333] w-full h-full" />
                  )}
                </div>
                <button
                  className="absolute bottom-3 right-2 bg-[#CEB46A] p-2 rounded-full text-black shadow"
                  onClick={handleImageClick}
                >
                  <TbEdit size={16} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>

            {/* Render fields */}
            {profileData.map((item) => (
              <div key={item.id} className="mb-6 border-b pb-2">
                <div className="text-gray-400 text-sm">{item.label}</div>
                <div className="flex justify-between items-center">
                  {editMode[item.id] && !item.locked ? (
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => handleChange(item.id, e.target.value)}
                      className="font-semibold bg-[#1C1C1E] text-lg border-b border-blue-500 focus:outline-none w-full"
                    />
                  ) : (
                    <div className="font-semibold text-lg">{item.value}</div>
                  )}
                  {!item.locked && (
                    <button
                      className="text-[#CEB46A] ml-2"
                      onClick={() => toggleEditMode(item.id)}
                    >
                      <TbEdit size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT GALLERIES SECTION */}
          <div className="flex flex-col items-center gap-2 mt-4">
            {galleries.map((gallery, index) => (
              <div
                key={index}
                className="relative bg-[#CEB46A] rounded-xl px-4 py-2 w-[500px] mx-auto shadow-md h-[100px] flex flex-col justify-between"
              >
                <div className="flex justify-center items-center gap-2 text-black -mt-2">
                  <h3 className="text-lg font-bold">{gallery.name}</h3>
                  <FaCamera className="text-black text-sm" />
                  <span className="text-sm font-semibold">x{gallery.photos}</span>
                </div>
                <div className="flex justify-between items-end mt-1">
                  {!gallery.development && (
                    <span className="bg-green-500 border border-black text-white text-xs font-semibold px-2.5 py-[1px] rounded-sm shadow-sm">
                      Active
                    </span>
                  )}
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 bg-black text-white px-3 py-[2px] rounded-full text-xs font-semibold">
                      <FaTrophy className="text-[#CEB46A]" /> x{gallery.trophies}
                    </div>
                    <div className="flex items-center gap-1 bg-black text-white px-3 py-[2px] rounded-full text-xs font-semibold">
                      <FaMedal className="text-[#CEB46A]" /> x{gallery.medals || 15}
                    </div>
                    <div className="flex items-center gap-1 bg-black text-white px-3 py-[2px] rounded-full text-xs font-semibold">
                      <FaStar className="text-[#CEB46A]" /> x{gallery.ribbons}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
