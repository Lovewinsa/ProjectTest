import React from "react"
import { Link } from "react-router-dom"

function UtilHome() {
  const utilities = [
    {
      title: "여행 준비 체크리스트",
      path: "/utils/checklist",
      content: "체크리스트를 통해 빠짐없는 즐거운 여행을 즐기세요!",
    },
    { title: "환율 정보 확인", path: "/utils/exchangeInfo", content: "오늘의 환율 정보는?" },
    { title: "여행 경비 계산", path: "/utils/calculator", content: "여행 경비를 계산해드려요!" },
    {
      title: "해외여행 안전 정보",
      path: "/utils/safetyInfo",
      content: "안전 정보를 꼭 확인하고 여행 계획을 세우세요!",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800">여행을 함께하는 tripDuo</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {utilities.map((item, index) => (
          <li
            key={index}
            className="bg-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition duration-500 border-2 border-tripDuoGreen">
            <Link to={item.path} className="block p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
              <p>{item.content}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UtilHome
