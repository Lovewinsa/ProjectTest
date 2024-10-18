import axios from "axios"
import React, { useEffect, useState } from "react"
import FroalaEditor from "react-froala-wysiwyg"
import { Link, NavLink, useNavigate, useParams } from "react-router-dom"
import LoadingAnimation from "../../components/LoadingAnimation"

function CommunityBoardEditForm(props) {
  //로딩 상태 추가
  const [loading, setLoading] = useState(false)

  const { id } = useParams()

  const [post, setPost] = useState({})

  const navigate = useNavigate()

  useEffect(() => {
    // 로딩 애니메이션을 0.5초 동안만 표시
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 700)

    axios
      .get(`/api/v1/posts/${id}/update`)
      .then((res) => {
        console.log(res.data)
        // 데이터 전달 확인
        setPost(res.data)
      })
      .catch((error) => console.log(error))
  }, [id])

  //수정 내용 put 요청
  const handleSubmit = () => {
    axios
      .put(`/api/v1/posts/${id}`, post)
      .then((res) => {
        console.log(post)
        //데이터 전달 확인
        alert("수정에 성공하였습니다.")
        navigate(`/posts/community/${id}/detail`) // 상세 페이지로 돌려보내기
      })
      .catch((error) => console.log(error))
  }

  // handleChange 처럼 Post 값으로 관리한다.
  const handleModelChange = (e) => {
    setPost({
      ...post,
      content: e,
    })
  }

  const handleChange = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="container mx-auto p-4 max-w-[900px]">
      {/* 로딩 애니메이션 */}
      {loading && <LoadingAnimation />}
      <div className="h-full bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold text-gray-800">여행 코스 수정</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/posts/community/${id}/detail`)}
              className="text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full text-sm px-5 py-2">
              게시글로 돌아가기
            </button>
            <button
              className="text-white bg-indigo-600 hover:bg-indigo-500 rounded-full text-sm px-5 py-2"
              onClick={handleSubmit}>
              수정 완료
            </button>
          </div>
        </div>

        {/* 태그 */}
        <div className="flex flex-wrap gap-2 m-3">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">#{post.country}</span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">#{post.city}</span>
          {post.tags &&
            post.tags.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                {tag}
              </span>
            ))}
        </div>

        <div>
          <div className="m-3">
            <label className="font-semibold" htmlFor="title">
              제목
            </label>
            <input
              className="w-full border-gray-300 rounded-md"
              onChange={handleChange}
              type="text"
              id="title"
              name="title"
              value={post.title || ""}
            />
          </div>

          <div>
            <label className="font-semibold block mb-3" htmlFor="content">
              내용
            </label>
            <FroalaEditor
              model={post.content}
              onModelChange={handleModelChange}
              config={{
                height: 200,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityBoardEditForm
