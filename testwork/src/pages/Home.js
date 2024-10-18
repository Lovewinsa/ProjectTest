import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "keen-slider/keen-slider.min.css"
import "../css/Home.css"
import { useDispatch } from "react-redux"
import LoadingAnimation from "../components/LoadingAnimation"
import TripDuoCarousel from "../components/TripDuoCarousel"
import MenuItems from "../components/MenuItems"
import BestPosts from "../components/BestPosts"

function Home() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 로딩 애니메이션을 0.5초 동안만 표시
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 400)
  }, [])

  const isLoggedIn = localStorage.getItem("token") !== null // 토큰이 존재하는지 확인

  useEffect(() => {
    if (location.state && location.state.needLogout) {
      // 로그아웃 처리
      dispatch({ type: "LOGOUT_USER"})
      localStorage.clear()

      // 상태 초기화 (새로고침 효과)
      navigate("/", { replace: true })
    }
  }, [location, dispatch, navigate])

  return (
    <div className="container mx-auto px-8 bg-white min-h-screen">
      {loading && <LoadingAnimation duration={0.3} />}
      <div className="my-3 relative">
        <header className="py-8 text-center">
          <h1 className="mt-2 text-gray-600 font-bold text-xl">여행 메이트와 여행 계획을 한번에!</h1>
        </header>
        <div className="relative">
          <TripDuoCarousel />
        </div>
      </div>

      <div className="my-3 h-8" />

      {/* menu icons */}
      <div>
        <MenuItems />
      </div>

      {/* best posts */}
      <div className="my-12">
        <BestPosts />
      </div>

      <div className="my-12">
        <h3 className="text-xl font-semibold mb-4 text-tripDuoGreen">국내 추천 여행지(추후 구현)</h3>
        {!isLoggedIn && ( // 로그인하지 않은 경우에만 보이도록 수정
          <p className="text-gray-600 text-sm text-left mb-4">로그인하시면, 고객님만을 위한 여행지를 추천해드립니다.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((product) => (
            <div key={product} className="bg-white shadow-2xl rounded-lg overflow-hidden">
              <img
                src={`https://picsum.photos/200/150?random=${product + 5}`}
                alt={`여행지 ${product}`}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h4 className="font-bold">{`여행지 ${product}`}</h4>
                <p className="text-gray-600">여행지 이름</p>
                <div className="flex justify-end">
                  <button className="mt-2 bg-tripDuoMint text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300">
                    더 보기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 부가기능 */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-tripDuoGreen">여행을 쉽고 간편하게</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
            <img
              src="https://picsum.photos/200/150?random=11"
              alt="여행 체크리스트"
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <h4 className="font-bold text-lg">여행 체크리스트</h4>
              <div className="flex justify-end">
                <button
                  onClick={() => navigate("/checklist")}
                  className="mt-2 bg-tripDuoMint text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300">
                  Move &gt;
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
            <img src="https://picsum.photos/200/150?random=14" alt="여행 플레너" className="w-full h-32 object-cover" />
            <div className="p-4">
              <h4 className="font-bold text-lg">가고싶은 장소 저장하기</h4>
              <div className="flex justify-end">
                <button
                  onClick={() => navigate("/planner")}
                  className="mt-2 bg-tripDuoMint text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300">
                  Move &gt;
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
            <img src="https://picsum.photos/200/150?random=12" alt="환율 정보" className="w-full h-32 object-cover" />

            <div className="p-4">
              <h4 className="font-bold text-lg">환율 정보</h4>
              <div className="flex justify-end">
                <button
                  onClick={() => navigate("/exchange")}
                  className="mt-2 bg-tripDuoMint text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300">
                  Move &gt;
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
            <img
              src="https://picsum.photos/200/150?random=13"
              alt="여행 경비 계산기"
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <h4 className="font-bold text-lg">여행 경비 계산기</h4>
              <div className="flex justify-end">
                <button
                  onClick={() => navigate("/calculator")}
                  className="mt-2 bg-tripDuoMint text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300">
                  Move &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
