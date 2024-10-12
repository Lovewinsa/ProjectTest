import axios from "axios"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { shallowEqual, useSelector } from "react-redux"
import { useNavigate } from "react-router"

function MyPlan(props) {
  //course 변수 사용하기 위해 임시로 useState() 사용
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
      .get(`/api/v1/posts/course?userId=${loggedInUserId}&pageNum=${pageNum}`)
      .then((response) => {
        setPostList((prevList) => {
          const combinedPosts = [...prevList, ...response.data.list]

          // 중복 제거 (id를 기준으로, acc: 중복이 제거된 누적된 배열)
          const uniquePosts = combinedPosts.reduce((acc, currentPost) => {
            if (!acc.some((post) => post.id === currentPost.id)) {
              acc.push(currentPost)
            }
            return acc
          }, [])

          return uniquePosts
        })
        setTotalPages(response.data.totalPages) // 총 페이지 수 업데이트
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

  return (
    <div className="container mx-auto p-4 max-w-[1024px]">
      {/* 게시글 작성 버튼 */}
      <div className="flex justify-between mb-6">
        <h3 className="text-2xl font-bold">내 여행 리스트</h3>
        <button
          onClick={() => navigate("/posts/course/new?status=PRIVATE")}
          className="bg-tripDuoMint text-white font-bold px-4 py-2 rounded-md shadow-md hover:bg-tripDuoGreen transition-all duration-300"
        >
          새 여행 계획하기
        </button>
      </div>

      {postList.length > 0 ? (
        <>
          <ul className="space-y-4">
            {postList.map((post) => (
              <li key={post.id} className="p-4 border rounded-lg shadow-md">
                <a href={`/posts/course/${post.id}/detail`} className="block">
                  <h4 className="text-xl font-semibold">{post.title}</h4>
                  <p className="text-gray-600">{post.description}</p>
                  <p className="text-sm text-gray-500">작성일: {new Date(post.createdAt).toLocaleDateString()}</p>
                </a>
              </li>
            ))}
          </ul>

          {/* 무한 스크롤 트리거 */}
          <div ref={observerRef} className="h-10"></div>
        </>
      ) : (
        <div className="text-center">
          <h3 className="text-xl font-semibold">계획중인 여행이 없습니다</h3>
        </div>
      )}
    </div>
  )
}

export default MyPlan
