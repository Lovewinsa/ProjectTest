import { faUser, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { ratingConfig } from "../constants/mapping"

function BlockModal({ id, onClose }) {
  const navigate = useNavigate()

  const [blockedList, setBlockedList] = useState([])

  // rating 값에 따른 아이콘과 색상 계산 //
  const getRatingDetails = (ratings) => {
    return ratingConfig.find((config) => ratings >= config.min && ratings <= config.max) || { imageSrc: "default.svg" } // 기본값
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
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black bg-opacity-50">
      <div
        onClick={(event) => event.stopPropagation()} // 내부 클릭은 모달을 닫지 않음
        className="relative w-1/4 max-w-4xl min-h-[400px] w-[300px] bg-white rounded-lg shadow-lg overflow-hidden top-1/4">
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
                const imageSrc = getRatingDetails(blocked.ratings || 0)
                return (
                  <li
                    key={blocked.userId}
                    className="flex justify-between gap-x-6 py-4 cursor-pointer"
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
                        <img
                          className="bi bi-person-circle w-12 h-12"
                          src={`${process.env.PUBLIC_URL}/img/defaultImages/defaultProfilePicture.svg`}
                          alt="default profile img"
                        />
                      )}
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900">{blocked.nickname}</p>
                        <p className="text-sm leading-6 text-gray-900">
                          {blocked.age} / {blocked.gender}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
                      <img
                        className="w-6 h-6"
                        src={`${process.env.PUBLIC_URL}/img/userRatingImages/${imageSrc.imageSrc}`}
                        alt="user rating"
                        title={`${imageSrc.imageSrc.replace(".svg", "")}`}
                      />
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
