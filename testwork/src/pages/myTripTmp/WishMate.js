import axios from "axios"
import React, { useEffect, useState } from "react"
import { shallowEqual, useSelector } from "react-redux"
import { cityMapping, countryMapping } from "../../constants/mapping"

function WishMate(props) {
  const userId = useSelector((state) => state.userData.id, shallowEqual) // 로그인된 user의 id
  const [course, setCourse] = useState({})
  const [postList, setPostList] = useState([])
  useEffect(() => {
    axios
      .get(`/api/v1/posts/${userId}/likes`)
      .then((response) => {
        console.log(response.data)
        setPostList(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [userId])

  // city 또는 country 값에 따른 이미지 파일명 변환 함수
  const getImageFileName = (city, country) => {
    // city 값이 있으면 city에 맞는 이미지, 없으면 country에 맞는 이미지 반환
    if (city && cityMapping[city]) {
      return cityMapping[city]
    } else if (country && countryMapping[country]) {
      return countryMapping[country]
    } else {
      return "defaultImage" // 매핑되지 않은 경우 기본값 처리
    }
  }

  return (
    <>
      <div className="container mx-auto p-4 max-w-[1024px]">
        {course ? (
          <>
            <div className="py-5">
              <p className="font-bold text-xl text-center">관심 메이트</p>
            </div>
            <ul className="space-y-4">
              {postList
                .filter((post) => post.post.type === "MATE")
                .map((post) => {
                  const imageFileName = getImageFileName(post.post.city, post.post.country)
                  const imagePath = `/img/countryImages/${imageFileName}.jpg`
                  return (
                    <li
                      key={post.post.id}
                      className={`p-4 border rounded-lg shadow-md border border-green-600 hover:scale-102 transition duration-300 hover:shadow-xl`}
                      style={{
                        backgroundImage: `linear-gradient(to right,
                        rgba(255, 255, 255, 1) 0%, 
                        rgba(255, 255, 255, 1) 20%, 
                        rgba(255, 255, 255, 0.5) 40%, 
                        rgba(255, 255, 255, 0) 60%, 
                        rgba(255, 255, 255, 0) 80%),
                        url(${imagePath})`,
                        backgroundSize: "cover", // 이미지 채우기
                        backgroundPosition: "center",
                        // /* 혼합 모드 설정 */
                        mixBlendMode: "multiply",
                      }}>
                      <a href={`/posts/mate/${post.post.id}/detail`} className="block">
                        <div className="md:flex justify-between">
                          <div>
                            <h4 className="text-xl font-semibold">{post.post.title}</h4>
                          </div>
                          <div className="flex md:flex-col md:min-w-32 md:space-y-2">
                            <p>
                              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded mr-2">
                                #{post.post.city}
                              </span>
                            </p>
                            <p>
                              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                                #{post.post.country}
                              </span>
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          작성일: {new Date(post.post.createdAt).toLocaleDateString()}
                        </p>
                      </a>
                    </li>
                  )
                })}
            </ul>
          </>
        ) : (
          <>
            <h3>계획중인 여행이 없습니다</h3>
          </>
        )}
      </div>
    </>
  )
}

export default WishMate
