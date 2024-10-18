import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { cityMapping, countryMapping } from "../constants/mapping"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart } from "@fortawesome/free-solid-svg-icons"

function BestPosts(props) {
  const navigate = useNavigate()

  const [postLists, setPostLists] = useState({
    domesticCourse: [],
    internationalCourse: [],
    domesticMate: [],
    internationalMate: [],
  })

  const [cloudFrontUrl, setCloudFrontUrl] = useState("")

  useEffect(() => {
    axios
      .get("/api/v1/posts/mate/home")
      .then((response) => {
        console.log(response.data)
        setPostLists({
          domesticCourse: response.data.domesticCoursePostList,
          internationalCourse: response.data.internationalCoursePostList,
          domesticMate: response.data.domesticMatePostList,
          internationalMate: response.data.internationalMatePostList,
        })
        setCloudFrontUrl(response.data.PROFILE_PICTURE_CLOUDFRONT_URL)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  // city 또는 country 값에 따른 이미지 파일명 변환 함수
  const getImageFileName = (city, country) => {
    if (city && cityMapping[city]) {
      return cityMapping[city]
    } else if (country && countryMapping[country]) {
      return countryMapping[country]
    } else {
      return "defaultImage"
    }
  }

  const renderPostList = (title, postList) => (
    <div>
      <h3 className="text-xl font-semibold my-5">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {postList.map((post, index) => {
          const imageFileName = getImageFileName(post.city, post.country)
          const imagePath = `/img/countryImages/${imageFileName}.jpg`

          return (
            <div key={index} className="bg-white shadow-2xl rounded-lg overflow-hidden">
              <img
                src={imagePath || "https://picsum.photos/200/150?random=11"}
                alt={post.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <img
                    src={
                      post.userProfileInfo.profilePicture
                        ? cloudFrontUrl + post.userProfileInfo.profilePicture
                        : `${process.env.PUBLIC_URL}/img/defaultImages/defaultProfilePicture.svg`
                    }
                    alt={post.userProfileInfo.nickname}
                    className="w-10 h-10 rounded-full mr-2 cursor-pointer"
                    onClick={() => navigate(`/users/${post.userProfileInfo.user.id}/profile`)}
                  />
                  <span
                    className="font-semibold cursor-pointer"
                    onClick={() => navigate(`/users/${post.userProfileInfo.user.id}/profile`)}>
                    {post.userProfileInfo.nickname}
                  </span>
                </div>
                <h4
                  className="font-bold text- cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis"
                  onClick={() => {
                    const di =
                      postList === postLists.domesticCourse || postList === postLists.domesticMate
                        ? "Domestic"
                        : "International";
                    navigate(`/posts/${post.type.toLowerCase()}/${post.id}/detail?di=${di}`);
                  }}>
                  {post.title}
                </h4>
                <div className="flex justify-between items-center mt-7">
                  {post.type === "COURSE" ? (
                    <span className="text-sm text-gray-600">⭐ {post.rating}</span>
                  ) : post.type === "MATE" ? (
                    <span className="text-sm text-gray-600">
                      <FontAwesomeIcon icon={faHeart} className="h-4 w-4 mr-1" /> {post.likeCount}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div>
      {renderPostList("인기 국내 여행 코스", postLists.domesticCourse)}
      {renderPostList("인기 해외 여행 코스", postLists.internationalCourse)}
      {renderPostList("인기 국내 여행 메이트", postLists.domesticMate)}
      {renderPostList("인기 해외 여행 메이트", postLists.internationalMate)}
    </div>
  )
}

export default BestPosts
