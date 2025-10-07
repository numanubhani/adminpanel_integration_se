import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import GallerySlider from "../components/Slider/GallerySlider";
import { Toaster, toast } from "sonner";

export default function PhotoGalleries() {
  const [gallery, setGallery] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // ✅ Get filter from query param (if redirected after upload)
  const queryParams = new URLSearchParams(location.search);
  const filter = queryParams.get("filter");

  // ✅ Fetch images from backend
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://selectexposure.pythonanywhere.com/api/accounts/body-part-images/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch gallery");
        const data = await res.json();

        // ✅ Map API response → gallery format
        const formatted = data.map((item, index) => ({
          id: item.id,
          title: `Image ${index + 1}`,
          image: item.image,
          bodyPart: item.body_part,
          selection: false,
          liked: false,
        }));

        // ✅ If redirected with filter, show only that filter
        if (filter && filter !== "All Photos") {
          setGallery(formatted.filter((img) => img.bodyPart === filter));
        } else {
          setGallery(formatted);
        }
      } catch (err) {
        console.error("Gallery load error:", err);
        toast.error("Failed to load gallery images.");
      }
    };

    fetchGallery();
  }, [filter]);

  // ✅ Resize check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 p-2 sm:p-4 md:p-6 lg:ml-64 w-full">
        <Toaster position="top-center" richColors />
        <Topbar pageTitle="My Photo Galleries" />

        <div className="overflow-hidden mt-4">
          {/* ✅ Pass API-fetched images */}
          <GallerySlider gallery={gallery} setGallery={setGallery} />
        </div>
      </div>
    </div>
  );
}
