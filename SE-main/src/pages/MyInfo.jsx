import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { TbEdit } from "react-icons/tb";
import { FaCheck } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import BASE_URL from "../utils/instance";  // adjust path as per your structure


export default function MyInfo() {
  const [editing, setEditing] = useState(null);
  const [data, setData] = useState({
    screenName: "",
    email: "",
    password: "**********", // placeholder
  });

  const [tempValues, setTempValues] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 🔹 Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://selectexposure.pythonanywhere.com/api/accounts/profile/me/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Failed to fetch profile");
        const profile = await res.json();

        setData({
          screenName: profile.screen_name || "",
          email: profile.email || "",
          password: "**********",
        });

        if (profile.id_document) {
          const backendHost =
            process.env.REACT_APP_BACKEND_BASE || "http://127.0.0.1:8000";
          setProfileImage(
            profile.id_document.startsWith("http")
              ? profile.id_document
              : `${backendHost}${profile.id_document}`
          );
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = (field) => {
    setTempValues({ ...tempValues, [field]: data[field] });
    setEditing(field);
  };

  const handleSave = async (field) => {
    const token = localStorage.getItem("token");

    try {
      const payload = {};
      if (field === "screenName") payload.screen_name = tempValues[field];
      if (field === "email") payload.email = tempValues[field];

      if (Object.keys(payload).length > 0) {
        const res = await fetch(
          `https://selectexposure.pythonanywhere.com/accounts/profile/me/`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) throw new Error("Update failed");

        const updated = await res.json();

        setData((prev) => ({
          ...prev,
          screenName: updated.screen_name || prev.screenName,
          email: updated.email || prev.email,
        }));
      }

      setEditing(null);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setEditing(null);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // 🔹 Upload DP to backend
  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Local preview
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfileImage(ev.target.result);
      };
      reader.readAsDataURL(file);

      // Send to backend
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("id_document", file);

      try {
        const res = await fetch(
          `https://selectexposure.pythonanywhere.com/api/accounts/profile/me/`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!res.ok) throw new Error("Failed to upload image");

        const updated = await res.json();

        const backendHost =
          process.env.REACT_APP_BACKEND_BASE || "http://127.0.0.1:8000";
        setProfileImage(
          updated.id_document.startsWith("http")
            ? updated.id_document
            : `${backendHost}${updated.id_document}`
        );
      } catch (err) {
        console.error("Image upload failed:", err);
        alert("Failed to upload image");
      }
    }
  };

  const renderField = (sectionLabel, childrens) => {
    return (
      <div className="flex flex-col sm:flex-row items-start border-b border-gray-200 py-4 sm:py-6 px-4 sm:px-6">
        <div className="w-full sm:w-2/4 font-medium text-white mb-2 sm:mb-0">
          {sectionLabel}
        </div>
        <div className="w-full">
          {childrens.map((child) => (
            <div
              key={child.name}
              className="flex items-center justify-between py-2"
            >
              {editing === child.name ? (
                <div className="flex items-center flex-1">
                  <input
                    type={child.name === "password" ? "password" : "text"}
                    className="bg-transparent text-white border border-gray-300 rounded px-2 py-1 w-full"
                    value={tempValues[child.name]}
                    onChange={(e) =>
                      setTempValues({
                        ...tempValues,
                        [child.name]: e.target.value,
                      })
                    }
                  />
                  <button
                    onClick={() => handleSave(child.name)}
                    className="ml-2 text-green-600"
                  >
                    <FaCheck size={18} />
                  </button>
                  <button onClick={handleCancel} className="ml-2 text-red-600">
                    <IoMdClose size={18} />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-sm text-gray-500">{child.label}</div>
                  <div className="flex items-center">
                    <span className="text-white break-all">{child.value}</span>
                  </div>
                </div>
              )}

              {editing !== child.name && (
                <button
                  onClick={() => handleEdit(child.name)}
                  className="text-[#CEB46A] ml-2"
                >
                  <TbEdit size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleDeleteProfile = () => {
    console.log("Profile deleted");
    setShowDeleteModal(false);
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:ml-64 w-full">
        <Topbar pageTitle="My Info" />

        <div className="max-w-3xl mx-auto p-2 sm:p-4 font-sans">
          {/* Profile Avatar */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#CEB46A] shadow">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-[#1C1C1E] w-full h-full" />
                )}
              </div>
              <button
                className="absolute bottom-3 right-2 bg-[#CEB46A] p-2 rounded-full shadow text-black"
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

          {/* Profile Fields */}
          <div className="bg-[#1C1C1E] rounded-lg shadow">
            {renderField("Profile Details", [
              { label: "Screen Name", name: "screenName", value: data.screenName },
            ])}

            {renderField("Security", [
              { label: "Email Address", name: "email", value: data.email },
              { label: "Password", name: "password", value: data.password },
            ])}

            {/* Two Factor Auth */}
            <div className="flex flex-col sm:flex-row items-start border-b border-gray-200 py-4 sm:py-6 px-4 sm:px-6">
              <div className="w-full sm:w-2/4 font-medium text-white mb-2 sm:mb-0">
                Two-Factor Authentication
              </div>
              <div className="w-full flex flex-col gap-2">
                <span className="text-sm text-gray-400 mb-2">
                  Protect your account with an extra layer of security.
                </span>
                <button
                  className="py-2 px-4 bg-[#ceb46a] text-black font-medium rounded hover:bg-[#b9a05a] transition duration-300 focus:outline-none w-fit"
                  onClick={() => alert("2FA setup coming soon!")}
                >
                  Enable / Manage 2FA
                </button>
              </div>
            </div>
          </div>

          {/* Delete Profile */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-red-600"
            >
              Delete Profile
            </button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold text-black">
              Are you sure you want to delete your profile?
            </h2>
            <p className="text-sm text-gray-600 mt-4">
              By deleting your profile, you are agreeing to relinquish any
              remaining funds in your wallet.
            </p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProfile}
                className="px-4 py-2 bg-red-600 text-white rounded"
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
