import axios from "axios"
import React, { useEffect, useState } from "react"
import { shallowEqual, useSelector } from "react-redux"

function MyPlan(props) {
  //course 변수 사용하기 위해 임시로 useState() 사용
  const loggedInUserId = useSelector((state) => state.userData.id, shallowEqual) // 로그인된 user의 id
  const [course, setCourse] = useState({})
  const [postList, setPostList] = useState([])
  useEffect(() => {
    axios
      .get(`/api/v1/posts/course?userId=${loggedInUserId}`)
      .then((response) => {
        console.log(response.data)
        setPostList(response.data.list)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <>
      <div>
        {course ? (
          <>
            <h3>여행 리스트 출력</h3>
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

export default MyPlan
