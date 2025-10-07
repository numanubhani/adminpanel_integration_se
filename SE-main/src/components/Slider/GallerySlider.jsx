import { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GrNext, GrPrevious } from "react-icons/gr";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function SampleNextArrow({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 cursor-pointer hover:border-gray-500"
    >
      <GrNext size={20} className="text-[#777]" />
    </div>
  );
}

function SamplePrevArrow({ onClick, currentSlide }) {
  if (currentSlide === 0) return null;
  return (
    <div
      onClick={onClick}
      className="absolute left-[-10px] top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 cursor-pointer hover:border-gray-500"
    >
      <GrPrevious size={20} className="text-[#777]" />
    </div>
  );
}

const popularFilters = [
  "All Photos",
  "Profile Picture",
  "Teaser",
  "Full Body",
  "Chest/Stomach",
  "Butt",
  "P/V",
  "Legs",
  "Feet",
];

function GallerySlider({ gallery, setGallery }) {
  const sliderRef = useRef(null);
  const filterSliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All Photos");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Main gallery settings
  const settings = {
    className: "center",
    centerMode: false,
    infinite: false, // ✅ no duplicate "cloned" slides
    centerPadding: "60px",
    slidesToShow: 1,
    speed: 500,
    rows: isMobile ? 1 : 2,
    slidesPerRow: isMobile ? 1 : 3,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          rows: 2,
          slidesPerRow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          rows: 1,
          slidesPerRow: 1,
          dots: true,
          arrows: false,
        },
      },
    ],
  };

  // Filter slider settings
  const filterSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: isMobile ? 2 : 3,
    slidesToScroll: 1,
    variableWidth: true,
    arrows: false,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          variableWidth: true,
        },
      },
    ],
  };

  // Toggle auto-enter
  const setSelection = (id) => {
    setGallery((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selection: !item.selection } : item
      )
    );
  };

  // Toggle like
  const toggleLike = (id) => {
    setGallery((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, liked: !item.liked } : item
      )
    );
  };

  // Apply filter
  const filteredGallery =
    activeFilter === "All Photos"
      ? gallery
      : gallery.filter((item) => item.bodyPart === activeFilter);

  return (
    <div className="w-full pb-10">
      {/* Filter buttons slider */}
      <div className="relative flex flex-col sm:flex-row sm:items-center mb-4 gap-2">
        <button className="flex items-center px-4 py-2 mr-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 6H21M7 12H17M10 18H14"
              stroke="#CEB46A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="ml-2 font-medium text-[#CEB46A]">Filters</span>
        </button>

        <div className="relative slider-container w-full max-w-screen-lg px-4 sm:px-10">
          {!isMobile && (
            <>
              <SamplePrevArrow
                onClick={() => filterSliderRef.current?.slickPrev()}
                currentSlide={currentSlide}
              />
              <SampleNextArrow
                onClick={() => filterSliderRef.current?.slickNext()}
              />
            </>
          )}
          <Slider ref={filterSliderRef} {...filterSettings}>
            {popularFilters.map((filter) => (
              <div key={filter} className="pr-2">
                <button
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
                    activeFilter === filter
                      ? "bg-[#CEB46A] text-black"
                      : "bg-[#1C1C1E] text-white"
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Image gallery */}
      <div className="relative slider-badge-container w-full max-w-screen-lg px-2 sm:px-10">
        {filteredGallery.length > 0 ? (
          <Slider ref={sliderRef} {...settings}>
            {filteredGallery.map((item) => (
              <div key={item.id} className="p-1 sm:p-2">
                <div className="relative bg-[#1C1C1E] rounded-[15px] overflow-hidden">
                  {/* Heart icon */}
                  <div
                    className="absolute top-2 right-2 z-20 text-xl cursor-pointer text-[#CEB46A]"
                    onClick={() => toggleLike(item.id)}
                  >
                    {item.liked ? <FaHeart /> : <FaRegHeart />}
                  </div>

                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-[200px] sm:h-[230px] object-cover rounded-t-[15px]"
                    loading="lazy"
                  />

                  {/* Info bar */}
                  <div className="bg-[#1C1C1E] flex justify-between items-center px-[15px] sm:px-[20px] py-[10px]">
                    <span className="text-sm sm:text-md truncate pr-2 text-[#CEB46A]">
                      {item.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white">Auto Enter</span>
                      <label className="inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={item.selection}
                          onChange={() => setSelection(item.id)}
                        />
                        <div
                          className={`relative w-10 h-6 ${
                            item.selection ? "bg-amber-00" : "bg-gray-200"
                          } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-500 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-gray-200 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#CEB46A]`}
                        ></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-center text-gray-400 mt-6">
            No images available in this category.
          </p>
        )}
      </div>
    </div>
  );
}

export default GallerySlider;
