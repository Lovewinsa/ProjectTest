import { faUser, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { ratingConfig } from "../constants/mapping"

const defaultProfile = (
  <img
    className="bi bi-person-circle w-12 h-12"
    src={`${process.env.PUBLIC_URL}/img/defaultImages/defaultProfilePicture.svg`}
    alt="default profile img"
  />
)

function FollowModal({ id, ff, onClose }) {
  const navigate = useNavigate()

  const [followerList, setFollowerList] = useState([])
  const [followeeList, setFolloweeList] = useState([])

  const [activeTab, setActiveTab] = useState(ff)

  // rating 값에 따른 아이콘과 색상 계산 //
  const getRatingDetails = (ratings) => {
    return ratingConfig.find((config) => ratings >= config.min && ratings <= config.max) || { imageSrc: "default.svg" }
  }

  useEffect(() => {
    // id 유저를 팔로우에 대한 리스트
    axios
      .get(`/api/v1/users/${id}/followInfos`)
      .then((res) => {
        console.log(res.data)
        setFollowerList(res.data.followerList)
        setFolloweeList(res.data.followeeList)
        console.log(res.data.followerList)
        console.log(res.data.followeeList)
      })
      .catch((error) => console.log(error))
  }, [id, ff])

  const handleActiveTab = (tab) => {
    setActiveTab(tab)
  }

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black bg-opacity-50">
      <div
        onClick={(event) => event.stopPropagation()} // 내부 클릭은 모달을 닫지 않음
        className="relative w-1/4 max-w-4xl min-h-[400px] w-[300px] bg-white rounded-lg shadow-lg overflow-hidden top-1/4">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="text-sm font-medium text-center w-full">
            <ul className="flex justify-center space-x-4">
              <li>
                <p
                  onClick={() => handleActiveTab("followee")}
                  className={`cursor-pointer text-md font-bold p-2 border-b-2 ${
                    activeTab === "followee"
                      ? "text-blue-700 border-blue-500"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}>
                  팔로잉
                </p>
              </li>

              <li>
                <p
                  onClick={() => handleActiveTab("follower")}
                  className={`cursor-pointer text-md font-bold p-2 border-b-2 ${
                    activeTab === "follower"
                      ? "text-blue-700 border-blue-500"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}>
                  팔로워
                </p>
              </li>
            </ul>
          </div>
          <button type="button" className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto max-h-[75vh]">
          <ul className="divide-y divide-gray-100">
            {/* 팔로잉 */}
            {activeTab === "followee" ? (
              followeeList.length === 0 ? (
                <p className="text-center text-gray-500">팔로잉이 없습니다.</p>
              ) : (
                followeeList.map((followee) => {
                  const imageSrc = getRatingDetails(followee.ratings || 0)
                  return (
                    <li
                      key={followee.userId}
                      className="flex justify-between gap-x-6 py-4 cursor-pointer"
                      onClick={() => {
                        navigate(`/users/${followee.id}/profile`)
                        onClose()
                      }}>
                      <div className="flex min-w-0 gap-x-4">
                        {followee.profilePicture ? (
                          <img
                            alt="profilePicture"
                            src={followee.profilePicture}
                            className="h-12 w-12 flex-none rounded-full bg-gray-50"
                          />
                        ) : (
                          defaultProfile
                        )}
                        <div className="min-w-0 flex-auto">
                          <p className="text-sm font-semibold leading-6 text-gray-900">{followee.nickname}</p>
                          <p className="text-sm leading-6 text-gray-900">
                            {followee.age} / {followee.gender}
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
              )
            ) : null}

            {/* 팔로워 */}
            {activeTab === "follower" ? (
              followerList.length === 0 ? (
                <p className="text-center text-gray-500">팔로워가 없습니다.</p>
              ) : (
                followerList.map((follower) => {
                  const imageSrc = getRatingDetails(follower.ratings || 0)
                  return (
                    <li
                      key={follower.userId}
                      className="flex justify-between gap-x-6 py-4 cursor-pointer"
                      onClick={() => {
                        navigate(`/users/${follower.userId}/profile`)
                        onClose()
                      }}>
                      <div className="flex min-w-0 gap-x-4">
                        {follower.profilePicture ? (
                          <img
                            alt="profilePicture"
                            src={follower.profilePicture}
                            className="h-12 w-12 flex-none rounded-full bg-gray-50"
                          />
                        ) : (
                          defaultProfile
                        )}
                        <div className="min-w-0 flex-auto">
                          <p className="text-sm font-semibold leading-6 text-gray-900">{follower.nickname}</p>
                          <p className="text-sm leading-6 text-gray-900">
                            {follower.age} / {follower.gender}
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
              )
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FollowModal
