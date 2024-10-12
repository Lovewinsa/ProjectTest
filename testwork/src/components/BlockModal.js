import { faCrown, faDove, faFeather, faPlane, faUser, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { setActive } from "@material-tailwind/react/components/Tabs/TabsContext"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router"

// rating 비교 조건 데이터
const ratingConfig = [
  { min: 0, max: 1499, icon: faFeather, color: "gray" }, // 이코노미
  { min: 1500, max: 2999, icon: faFeather, color: "blue" }, // 프리미엄 이코노미
  { min: 3000, max: 4499, icon: faDove, color: "gray" }, // 비지니스
  { min: 4500, max: 5999, icon: faDove, color: "blue" }, // 프리미엄 비지니스
  { min: 6000, max: 7499, icon: faPlane, color: "gray" }, // 퍼스트
  { min: 7500, max: 8999, icon: faPlane, color: "blue" }, // 프리미엄 퍼스트
  { min: 9000, max: 10000, icon: faCrown, color: "yellow" }, // 로얄
  { min: -Infinity, max: Infinity, icon: faUser, color: "black" }, // 기본값
]

function BlockModal({ id, onClose }) {
  const navigate = useNavigate()

  const [blockedList, setBlockedList] = useState([])

  // rating 값에 따른 아이콘과 색상 계산 //
  const getRatingDetails = (ratings) => {
    return (
      ratingConfig.find((config) => ratings >= config.min && ratings <= config.max) || { icon: faUser, color: "black" }
    ) // 기본값
  }

  useEffect(() => {
    axios
      .get(`/api/v1/users/${id}/blockInfos`)
      .then((res) => {
        setBlockedList(res.data)
      })
      .catch((error) => console.log(error))
  }, [id])

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-1/4 max-w-4xl min-h-[400px] w-[300px] bg-white rounded-lg shadow-lg overflow-hidden top-1/4">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="text-sm font-medium text-center w-full">
            <div className="flex justify-center space-x-4">
              <p className={`cursor-pointer text-md font-bold p-2 border-b-2 text-red-500`}>차단 목록</p>
            </div>
          </div>
          <button type="button" className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto max-h-[75vh]">
          <ul className="divide-y divide-gray-100">
            {blockedList.length === 0 ? (
              <p className="text-center text-gray-500">차단한 사용자가 없습니다.</p>
            ) : (
              blockedList.map((blocked) => {
                const { icon: ratingIcon, color: ratingColor } = getRatingDetails(blocked.ratings || 0)
                return (
                  <li
                    key={blocked.userId}
                    className="flex justify-between gap-x-6 py-4"
                    onClick={() => {
                      navigate(`/users/${blocked.userId}/profile`)
                    }}>
                    <div className="flex min-w-0 gap-x-4">
                      {blocked.profilePicture ? (
                        <img
                          alt="profilePicture"
                          src={blocked.profilePicture}
                          className="h-12 w-12 flex-none rounded-full bg-gray-50"
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          className="h-12 w-12 bi bi-person-circle"
                          viewBox="0 0 16 16">
                          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                          <path
                            fillRule="evenodd"
                            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                          />
                        </svg>
                      )}
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900">{blocked.nickname}</p>
                        <p className="text-sm leading-6 text-gray-900">
                          {blocked.age} / {blocked.gender}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
                      <p>
                        <FontAwesomeIcon icon={ratingIcon} color={ratingColor} className="mr-2"></FontAwesomeIcon>
                      </p>
                      <p className="text-sm leading-6 text-gray-900">{blocked.ratings}</p>
                    </div>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default BlockModal
