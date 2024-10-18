import React, { useEffect, useState } from "react"
import { NavLink, useNavigate, useSearchParams } from "react-router-dom"

// Require Editor CSS files.
import "froala-editor/css/froala_style.min.css"
import "froala-editor/css/froala_editor.pkgd.min.css"

import axios from "axios"
import FroalaEditor from "react-froala-wysiwyg"
import { shallowEqual, useSelector } from "react-redux"
import { citiesByCountry } from "../../constants/mapping"

function CommunityBoardForm() {
  //유저 정보 관리
  const userId = useSelector((state) => state.userData.id, shallowEqual)
  const nickname = useSelector((state) => state.userData.nickname, shallowEqual)
  const username = useSelector((state) => state.userData.username, shallowEqual)

  const [domesticInternational, setDomesticInternational] = useState()
  const [SearchParams, setSearchParams] = useSearchParams()
  const [post, setPost] = useState({}) // 게시물의 정보

  const navigate = useNavigate()

  //태그 관리
  const [tagInput, setTagInput] = useState("")
  const [postTags, setPostTags] = useState([])

  // 선택한 나라에 맞는 도시 목록을 얻음
  const cities = citiesByCountry[post.country] || [] //citiesByCountry[country]가 undefined 또는 null일 경우 빈 배열 반환

  //username 으로 로그인 여부 확인하여 로그인 하지 않으면 로그인 페이지로 넘기기
  useEffect(() => {
    username ?? navigate("/login")
  }, [username, navigate])

  useEffect(
    (post) => {
      setDomesticInternational(SearchParams.get("di"))

      if (domesticInternational) {
        setPost({
          ...post,
          country: domesticInternational === "Domestic" ? "대한민국" : "",
          tags: [],
          viewCount: 10,
          likeCount: 10,
          rating: 0,
          status: "OPEN",
          city: "",
        })
      }
    },
    [domesticInternational]
  )

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

  // 태그 입력 핸들러
  const handleTagInput = (e) => {
    const value = e.target.value

    // 태그 길이 15자로 제한
    if (value.length <= 15) {
      setTagInput(value)
    } else if (value.length > 15){
      alert("태그는 #포함 최대 15자까지 입력 가능합니다.")
      setTagInput("")
      return
    }


    if (value.endsWith(" ") && value.trim() !== "") {
      const newTag = value.trim()
      if (newTag !== "#" && newTag.startsWith("#") && !postTags.includes(newTag)) {
        if (postTags.length >= 6) {
          alert("태그는 최대 6개까지 추가할 수 있습니다.")
          setTagInput("")
          return
        }

        setPostTags([...postTags, newTag])
        setTagInput("")
      }
    }
  }

  //태그 제거
  const removeTag = (tagToRemove) => setPostTags(postTags.filter((tag) => tag !== tagToRemove))

  const handleSubmit = async () => {
    const updatedPost = {
      ...post,
      tags: postTags,
      userId: userId,
      writer: nickname,
    }

    try {
      const response = await axios.post("/api/v1/posts/community", updatedPost)

      alert("새 글 작성에 성공하였습니다.")
      navigate(`/posts/community?di=${domesticInternational}`)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-[900px]">
      <div className=" h-full bg-white p-6 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold text-gray-800">
            {domesticInternational === "Domestic" ? "국내 " : "해외 "}커뮤니티 게시물 작성
          </h1>
          <button
            onClick={() => navigate(`/posts/community?di=${domesticInternational}`)}
            className="text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full text-sm px-5 py-2">
            목록으로 돌아가기
          </button>
          <button
            className="text-white bg-indigo-600 hover:bg-indigo-500 rounded-full text-sm px-5 py-2"
            onClick={handleSubmit}>
            작성 완료
          </button>
        </div>

        {/* 국가/도시 태그 선택 폼 */}
        <div className="m-3" onSubmit={(e) => e.preventDefault()}>
          <div>
            {/* 해외 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {domesticInternational === "International" && (
                <div className="flex flex-col">
                  <label htmlFor="city" className="font-semibold">
                    나라
                  </label>
                  <select
                    className="border-gray-300 rounded-md"
                    value={post.country}
                    name="country"
                    onChange={handleChange}>
                    <option value="">나라를 선택하세요</option>
                    <optgroup label="아시아">
                      <option value="일본">일본</option>
                      <option value="중국">중국</option>
                      <option value="인도">인도</option>
                    </optgroup>

                    <optgroup label="유럽">
                      <option value="영국">영국</option>
                      <option value="독일">독일</option>
                      <option value="프랑스">프랑스</option>
                      <option value="이탈리아">이탈리아</option>
                    </optgroup>

                    <optgroup label="북아메리카">
                      <option value="미국">미국</option>
                      <option value="캐나다">캐나다</option>
                    </optgroup>

                    <optgroup label="남아메리카">
                      <option value="브라질">브라질</option>
                    </optgroup>

                    <optgroup label="오세아니아">
                      <option value="호주">호주</option>
                    </optgroup>

                    <optgroup label="기타">
                      <option value="러시아">러시아</option>
                      <option value="남아프리카 공화국">남아프리카 공화국</option>
                    </optgroup>
                  </select>
                </div>
              )}
              {post.country ? (
                <div className="flex flex-col">
                  <label htmlFor="city" className="font-semibold">
                    도시
                  </label>
                  <select className="border-gray-300 rounded-md" value={post.city} name="city" onChange={handleChange}>
                    <option value="">도시를 선택하세요</option>
                    {cities.map((cityOption) => (
                      <option key={cityOption} value={cityOption}>
                        {cityOption}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 my-2">
            {post.country ? (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">#{post.country}</span>
            ) : (
              ""
            )}

            {/* 도시 태그 출력*/}
            {post.city ? (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">#{post.city}</span>
            ) : (
              ""
            )}
          </div>

          {/* 태그 입력 폼 */}
          <div>
            <label htmlFor="tags" className="block font-semibold">
              태그
            </label>
            <input
              id="tags"
              value={tagInput}
              onChange={handleTagInput}
              placeholder="#태그 입력 후 스페이스바"
              className="border p-2 w-1/3 border-gray-300 rounded-md"
            />
            <div className="flex flex-wrap gap-2 my-2">
              {postTags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                  {tag}
                  <button
                    className="ml-2 p-0 h-4 w-4 text-black flex items-center justify-center"
                    onClick={() => removeTag(tag)}>
                    <span className="text-sm font-bold">&times;</span>
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="w-100">
            <label htmlFor="title" className="font-semibold mt-3">
              제목
            </label>
            <input
              className="w-full border-gray-300 rounded-md"
              onChange={handleChange}
              type="text"
              id="title"
              name="title"
            />
          </div>

          <div className="mt-3">
            <label htmlFor="content" className="block font-semibold mb-3">
              내용
            </label>
            <FroalaEditor
              model={post.content}
              onModelChange={handleModelChange}
              config={{
                placeholderText: "과도한 욕설, 비방, 개인정보 노출 등은 제재될 수 있습니다.",
                height: 200,
              }}></FroalaEditor>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityBoardForm
