import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GrNext, GrPrevious } from "react-icons/gr";
import { useRef, useState } from "react";
import { FaTrophy } from "react-icons/fa";

function SampleNextArrow({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="absolute right-[-10px] top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 cursor-pointer hover:border-gray-500"
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

function RowSlider({dots, arrows, items}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  const settings = {
    dots: dots,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: arrows,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
  };

  return (
    <div className="relative slider-badge-container  xl:px-10">
      {/* Arrows outside the slider */}
      <SamplePrevArrow
        onClick={() => sliderRef.current?.slickPrev()}
        currentSlide={currentSlide}
      />
      <SampleNextArrow
        onClick={() => sliderRef.current?.slickNext()}
      />

      <Slider ref={sliderRef} {...settings} >
        {items.map((item, num) => (
    <div key={num}>
  <div className="p-2 flex justify-center">
    <div className="bg-[#1C1C1E] max-w-[280px] w-full shadow-[0_5px_10px_rgba(0,0,0,0.05),5px_0_10px_rgba(0,0,0,0.05),-5px_0_10px_rgba(127,86,217,0.05)] rounded-xl overflow-hidden h-full flex flex-col">
      
      {/* Image */}
      <img
        src={item.image}
        alt="Badge"
        className="w-full h-40 object-cover rounded-t-xl"
      />

      {/* Trophy + Text */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-10 h-10 flex items-center justify-center bg-[#2b2b2d] rounded-full">
          <FaTrophy className="text-[#ceb46a] w-5 h-5" />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-white text-base font-semibold leading-tight">
            {item.title}
          </h2>
          <p className="text-sm text-gray-400">{item.subtext}</p>
        </div>
      </div>
    </div>
  </div>
</div>


        ))}
      </Slider>
    </div>
  );
}

export default RowSlider;