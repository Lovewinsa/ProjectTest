import axios from "axios"
import React, { useEffect, useState } from "react"
import { shallowEqual, useSelector } from "react-redux"

function WishMate(props) {
  const loggedInUserId = useSelector((state) => state.userData.id, shallowEqual) // 로그인된 user의 id
  const [course, setCourse] = useState({})
  const [postList, setPostList] = useState([])
  useEffect(() => {
    axios
      .get(`/api/v1/posts/${loggedInUserId}/likes`)
      .then((response) => {
        console.log(response.data)
        setPostList(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <>
      <div className="container mx-auto p-4 max-w-[1024px]">
        {course ? (
          <>
          <div className="py-5">
            <p className="font-bold text-xl text-center">관심 메이트 목록</p>
          </div>
            <ul className="space-y-4">
              {postList
                .filter((post) => post.post.type === "MATE")
                .map((post) => (
                  <li key={post.post.id} className="p-4 border rounded-lg shadow-md">
                    <a href={`/posts/mate/${post.post.id}/detail`} className="block">
                      <h4 className="text-xl font-semibold">{post.post.title}</h4>
                      <p className="text-gray-600">{post.post.description}</p>
                      <p className="text-sm text-gray-500">
                        작성일: {new Date(post.post.createdAt).toLocaleDateString()}
                      </p>
                    </a>
                  </li>
                ))}
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
