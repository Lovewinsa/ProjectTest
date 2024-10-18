import React, { useState } from "react"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { useNavigate } from "react-router"
import { carouselItems } from "../constants/mapping"

const TripDuoCarousel = () => {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0) // 현재 슬라이드 상태 추가
  const [sliderRef, instanceRef] = useKeenSlider({
    mode: "free-snap",
    slides: {
      perView: 1.2, // 양쪽 일부가 보이도록 설정
      spacing: 15, // 슬라이드 간격
      origin: "center",
    },
    created(s) {
      s.moveToIdx(0, true, { duration: 0 }) // 시작 인덱스를 0으로 변경
    },
    dragSpeed: 0.5,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel) // 슬라이드가 변경될 때 현재 슬라이드 업데이트
    },
    loop: true,
  })

  // 버튼을 클릭했을 때 실행할 함수 정의
  const handlePrev = () => {
    if (instanceRef.current) instanceRef.current.prev()
  }

  const handleNext = () => {
    if (instanceRef.current) instanceRef.current.next()
  }

  // dot 클릭 시 해당 슬라이드로 이동
  const handleDotClick = (index) => {
    if (instanceRef.current) instanceRef.current.moveToIdx(index)
  }

  // 이미지 클릭 시 해당 슬라이드로 이동
  const handleImageClick = (item, index) => {
    if (instanceRef.current) {
      const currentIndex = instanceRef.current.track.details.rel // 현재 인덱스 얻기
      if (index !== currentIndex) {
        instanceRef.current.moveToIdx(index)
      } else {
        navigate(item.linkSrc)
      }
    } else {
      console.log("슬라이더 인스턴스가 없습니다.")
    }
  }

  return (
    <div className="relative max-w-5xl mx-auto overflow-hidden">
      <div ref={sliderRef} className="keen-slider">
        {carouselItems.map((item, index) => (
          <div key={index} className="keen-slider__slide">
            <img
              src={`${process.env.PUBLIC_URL}/img/countryImages/${item.imageSrc}`}
              alt={`Slide ${index + 1}`}
              className="w-full h-[500px] object-cover rounded-lg transition-all duration-300 cursor-pointer" // 높이를 약간 늘림
              onClick={() => handleImageClick(item, index)} // 이미지 클릭 시 해당 슬라이드로 이동
            />
          </div>
        ))}
      </div>
      {/* 왼쪽(이전) 버튼 */}
      <button
        onClick={handlePrev}
        className="absolute left-[5px] top-1/2 transform -translate-y-1/2 text-tripDuoMint border-2 rounded-full p-2 text-4xl z-10 transition-transform duration-200 hover:scale-110 bg-white bg-opacity-70 shadow-lg">
        <FaChevronLeft className="text-tripDuoGreen transition duration-150 mx-auto" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-[5px] top-1/2 transform -translate-y-1/2 text-tripDuoMint border-2 rounded-full p-2 text-4xl z-10 transition-transform duration-200 hover:scale-110 bg-white bg-opacity-70 shadow-lg">
        <FaChevronRight className="text-tripDuoGreen transition duration-150 mx-auto" />
      </button>
      {/* 슬라이드 점들 */}
      <div className="flex justify-center mt-4">
        {carouselItems.map((_, index) => (
          <div
            key={index}
            onClick={() => handleDotClick(index)} // 점 클릭 시 해당 슬라이드로 이동
            className={`w-3 h-3 mx-1 rounded-full cursor-pointer transition-all duration-200 ${
              currentSlide === index ? "bg-tripDuoMint scale-125" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default TripDuoCarousel
