import axios from "axios"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { shallowEqual, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { cityMapping, countryMapping } from "../../constants/mapping"

function MyRecord(props) {
  const loggedInUserId = useSelector((state) => state.userData.id, shallowEqual) // 로그인된 user의 id
  const [postList, setPostList] = useState([])

  const [currentPage, setCurrentPage] = useState(1) // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(1) // 총 페이지 수 상태
  const observerRef = useRef(null) // 무한 스크롤 관찰자
  const navigate = useNavigate() // 페이지 이동을 위한 navigate

  useEffect(() => {
    fetchPostList(1) // 초기 데이터 로드
  }, [])

  // 게시글 리스트를 가져오는 함수
  const fetchPostList = (pageNum) => {
    axios
      .get(`/api/v1/posts/trip_log?userId=${loggedInUserId}&pageNum=${pageNum}`)
      .then((res) => {
        setPostList((prevList) => {
          const combinedPosts = [...prevList, ...res.data.list]

          // 중복 제거 (id를 기준으로, acc: 중복이 제거된 누적된 배열)
          const uniquePosts = combinedPosts.reduce((acc, currentPost) => {
            if (!acc.some((post) => post.id === currentPost.id)) {
              acc.push(currentPost)
            }
            return acc
          }, [])

          return uniquePosts
        })
        setTotalPages(res.data.totalPages) // 총 페이지 수 업데이트
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // 무한 스크롤을 위한 IntersectionObserver 설정
  const observerCallback = useCallback(
    (entries) => {
      const target = entries[0]
      if (target.isIntersecting && currentPage < totalPages) {
        setCurrentPage((prevPage) => prevPage + 1) // 페이지 번호 증가
      }
    },
    [currentPage, totalPages]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback)
    if (observerRef.current) {
      observer.observe(observerRef.current)
    }
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
    }
  }, [observerCallback])

  useEffect(() => {
    if (currentPage > 1) {
      fetchPostList(currentPage) // 새로운 페이지의 게시글 로드
    }
  }, [currentPage])

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
    <div className="container mx-auto p-4 max-w-[1024px]">
      {/* 게시글 작성 버튼 */}
      {/* <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate("/posts/trip_log/new?status=PRIVATE")}
          className="bg-tripDuoMint text-white font-bold px-4 py-2 rounded-md shadow-md hover:bg-tripDuoGreen transition-all duration-300">
          여행기록 작성
        </button>
      </div> */}
      <div className="flex justify-end">
        <div className="bg-tripDuoMint text-white font-bold px-4 py-2 rounded-md shadow-md">
          <span>여행기록 작성:</span>
          <span
            className="ml-2 cursor-pointer hover:bg-tripDuoGreen transition-all duration-300 px-2 rounded"
            onClick={() => navigate("/posts/trip_log/new?status=PRIVATE&di=Domestic")}>
            국내
          </span>
          <span className="mx-2">/</span>
          <span
            className="cursor-pointer hover:bg-tripDuoGreen transition-all duration-300 px-2 rounded"
            onClick={() => navigate("/posts/trip_log/new?status=PRIVATE&di=International")}>
            해외
          </span>
        </div>
      </div>
      <div className="container mx-auto p-4 max-w-[1024px]">
        {postList ? (
          <>
            <div className="py-5">
              <p className="font-bold text-xl text-center">내 여행 기록</p>
            </div>
            <ul className="space-y-4">
              {postList.map((post) => {
                const imageFileName = getImageFileName(post.city, post.country)
                const imagePath = `/img/countryImages/${imageFileName}.jpg`
                return (
                  <li
                    key={post.id}
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
                    <a href={`/posts/trip_log/${post.id}/detail`} className="block">
                      <div className="md:flex justify-between">
                        <div>
                          <h4 className="text-xl font-semibold">{post.title}</h4>
                        </div>
                        <div className="flex md:flex-col md:min-w-32 md:space-y-2">
                          <p>
                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded mr-2">
                              #{post.city}
                            </span>
                          </p>
                          <p>
                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                              #{post.country}
                            </span>
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">작성일: {new Date(post.createdAt).toLocaleDateString()}</p>
                    </a>
                  </li>
                )
              })}
            </ul>
            <div ref={observerRef} className="h-10"></div>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-xl font-semibold">작성한 여행기록이 없습니다</h3>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyRecord
