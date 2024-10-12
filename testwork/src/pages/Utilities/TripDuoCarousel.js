import React from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

const TripDuoCarousel = () => {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    mode: "free-snap",
    slides: {
      perView: 1.2, // 양쪽 일부가 보이도록 설정
      spacing: 15,  // 슬라이드 간격
      origin: "center",

    },
    created(s) {
      s.moveToIdx(1, true, { duration: 0 });
    },
  });

  const images = [
    'KOR_01',
    'AUS_01',
    'RUS_01',
    'USA_01',
    'BRA_01',
  ];

  return (
    <div className="relative max-w-4xl mx-auto overflow-hidden"> {/* 전체 슬라이더 감싸는 div에 overflow-hidden 적용 */}
      <div ref={sliderRef} className="keen-slider">
        {images.map((src, idx) => (
          <div key={idx} className="keen-slider__slide">
            <img
              src={`${process.env.PUBLIC_URL}/img/countryImages/${src}.jpg`}
              alt={`Slide ${idx + 1}`}
              className="w-full h-64 object-cover rounded-lg transition-all duration-300"
            />
          </div>
        ))}
      </div>
      <button
        onClick={() => instanceRef.current?.prev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
      >
        left
      </button>
      <button
        onClick={() => instanceRef.current?.next()}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
      >
        right
      </button>
    </div>
  );
};

export default TripDuoCarousel;