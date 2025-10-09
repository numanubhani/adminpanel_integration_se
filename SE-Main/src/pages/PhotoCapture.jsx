import React, { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useNavigate, useLocation } from "react-router-dom";
import SelectList from "../components/SelectList";
import Webcam from "react-webcam";
import { Toaster, toast } from "sonner";

const bodyParts = [
  { value: "All Photos", label: "All Photos" },
  { value: "Profile Picture", label: "Profile Picture" },
  { value: "Teaser", label: "Teaser" },
  { value: "Full Body", label: "Full Body" },
  { value: "Chest/Stomach", label: "Chest & Stomach" },
  { value: "Butt", label: "Butt" },
  { value: "P/V", label: "P/V" },
  { value: "Legs", label: "Legs" },
  { value: "Feet", label: "Feet" },
];

export default function PhotoCapture() {
  const navigate = useNavigate();
  const [bodyPart, selectBodyPart] = useState(bodyParts[0]);
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");

  const enterGallery = () => {
    navigate(`/photo-capture?type=${bodyPart.value}`);
  };

  const [image, setImage] = useState(null);
  const [openCamera, setOpenCamera] = useState(false);
  const webcamRef = useRef(null);

  // Video constraints based on camera selection
  const videoConstraints = {
    height: 256,
    facingMode: isFrontCamera ? "user" : "environment",
  };

  const handleRetake = () => {
    setImage(null);
    setOpenCamera(true);
  };

  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  // 🔹 Save image to backend
  const handleSubmit = async () => {
    if (!image) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setImage(imageSrc);
        toast.success("Image captured successfully.");
      }
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const blob = await fetch(image).then((res) => res.blob());
      const formData = new FormData();
      formData.append("body_part", bodyPart.value);
      formData.append("image", blob, `${bodyPart.value}.jpg`);

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/accounts/body-part-images/`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");
      toast.success("Image saved successfully.");

      // reset for next photo
      setTimeout(() => {
        setImage(null);
        setOpenCamera(true);
      }, 1500);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to save image.");
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:ml-64 w-full">
        <Toaster position="top-center" richColors />
        <Topbar
          pageTitle={`Photo Capture ${type ? "- " + bodyPart.value : ""}`}
        />

        {/* Instructions page */}
        {!type && (
          <>
            <div className="bg-[#1C1C1E] rounded-xl p-4 sm:p-6 md:p-8 w-full max-w-5xl mx-auto mt-6 md:mt-10">
              <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#ceb46a]">
                Photo Capture Instructions
              </h2>
              <ul className="list-disc list-inside text-white font-medium">
                <li>
                  <em>
                    Capture photos for the contest categories you plan on
                    joining
                  </em>
                </li>
                <li>
                  <em>
                    When capturing photos, it&apos;s your choice whether to
                    include or exclude your face and/or identifying marks
                  </em>
                </li>
                <li>
                  <em>
                    Select manual or auto entry for contest participation (auto
                    entry recommended)
                  </em>
                </li>
              </ul>
            </div>

            <div className="bg-[#1C1C1E] rounded-xl p-4 sm:p-6 w-full max-w-3xl mx-auto mt-8 md:mt-16">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-center text-[#ceb46a]">
                Select Body Parts to Capture
              </h2>
              <form className="w-full mx-auto">
                <SelectList
                  label="Select Body Part"
                  options={bodyParts}
                  value={bodyPart}
                  onChange={selectBodyPart}
                />
              </form>
              <div className="flex justify-end space-x-4 mt-6">
                <button className="py-2 px-4 border-2 border-[#CEB46A] rounded-md text-[#CEB46A]">
                  Cancel
                </button>
                <button
                  onClick={enterGallery}
                  className="py-2 px-6 bg-[#CEB46A] text-black rounded-md"
                >
                  Enter Gallery
                </button>
              </div>
            </div>
          </>
        )}

        {/* Camera Page */}
        {type && (
          <div className="max-w-lg mx-auto p-4 min-h-[calc(100vh-100px)] flex flex-col">
            {/* Body part buttons */}
            <div className="flex items-center overflow-x-auto gap-3 pb-4">
              {bodyParts.map((part) => (
                <button
                  key={part.value}
                  onClick={() => selectBodyPart(part)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                    bodyPart.value === part.value
                      ? "bg-[#CEB46A] text-black"
                      : "bg-[#1C1C1E] text-white border border-[#333]"
                  }`}
                >
                  {part.label}
                </button>
              ))}
            </div>

            {/* Scrollable preview area */}
            <div className="overflow-y-auto max-h-[65vh] flex-1 space-y-6">
              <div className="border-2 border-dashed border-[#CEB46A] rounded-lg cursor-pointer flex flex-col items-center justify-center relative">
                {image ? (
                  <div className="h-[400px] w-full">
                    <img
                      src={image}
                      alt="Captured"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ) : openCamera ? (
                  <div className="h-[400px] w-full relative">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {/* Camera Toggle Button */}
                    <button
                      onClick={toggleCamera}
                      className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
                      title={`Switch to ${
                        isFrontCamera ? "Rear" : "Front"
                      } Camera`}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                    {/* Camera Indicator */}
                    <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                      {isFrontCamera ? "Front Camera" : "Rear Camera"}
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-64 flex flex-col items-center justify-center text-blue-900 mb-2">
                    <p className="text-[#777] font-medium mt-5">Capture image</p>
                  </div>
                )}
              </div>
            </div>

            {/* Confirm Buttons */}
            <div className="sticky bottom-0 bg-black pt-4">
              <div className="flex gap-4">
                {openCamera && !image && (
                  <>
                    <button
                      onClick={() => setOpenCamera(false)}
                      className="w-1/2 bg-transparent border border-[#CEB46A] text-[#CEB46A] py-3 px-4 rounded-lg font-medium transition-colors hover:bg-[#ceb46a]/10"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        const imageSrc = webcamRef.current.getScreenshot();
                        if (imageSrc) {
                          setImage(imageSrc);
                          toast.success("Image captured successfully.");
                        }
                      }}
                      className="w-1/2 bg-[#CEB46A] text-black py-3 px-4 rounded-lg font-medium transition-colors hover:bg-[#d6c074]"
                    >
                      Capture
                    </button>
                  </>
                )}

                {image && (
                  <>
                    <button
                      onClick={handleRetake}
                      className="w-1/2 bg-transparent border border-[#CEB46A] text-[#CEB46A] py-3 px-4 rounded-lg font-medium transition-colors hover:bg-[#ceb46a]/10"
                    >
                      Retake
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="w-1/2 bg-[#CEB46A] text-black py-3 px-4 rounded-lg font-medium transition-colors hover:bg-[#d6c074]"
                    >
                      Save
                    </button>
                  </>
                )}

                {!openCamera && !image && (
                  <button
                    onClick={() => setOpenCamera(true)}
                    className="w-full bg-[#CEB46A] text-black py-3 px-4 rounded-lg font-medium transition-colors hover:bg-[#d6c074]"
                  >
                    Open Camera
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
