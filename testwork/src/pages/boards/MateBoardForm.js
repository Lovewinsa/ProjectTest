import React, { useEffect, useState } from "react"
import { NavLink, useNavigate, useSearchParams } from "react-router-dom"

// Require Editor CSS files.
import "froala-editor/css/froala_style.min.css"
import "froala-editor/css/froala_editor.pkgd.min.css"

import axios from "axios"
import FroalaEditor from "react-froala-wysiwyg"
import { shallowEqual, useSelector } from "react-redux"
import Calendar from "react-calendar"
import moment from "moment"
import { citiesByCountry } from "../../constants/mapping"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

function MateBoardForm(props) {
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

  // 날짜 관리
  const [selectedDateRange, setSelectedDateRange] = useState([null, null])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

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
          rating: 80,
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
    if (!post.title) {
      alert("제목을 입력해주세요.")
      return
    }

    const updatedPost = {
      ...post,
      tags: postTags,
      userId: userId,
      writer: nickname,
      startDate: startDate,
      endDate: endDate,
    }

    try {
      const response = await axios.post("/api/v1/posts/mate", updatedPost)

      alert("새 글 작성에 성공하였습니다.")
      navigate(`/posts/mate?di=${domesticInternational}`)
    } catch (error) {
      console.log(error)
    }
  }

  // 날짜 초기화
  const handleDateReset = () => {
    setSelectedDateRange([null, null]) // 날짜 범위를 현재 날짜로 초기화
    setStartDate("")
    setEndDate("")
  }
  // 현재 날짜로 돌아오는 함수 추가
  const handleTodayClick = () => {
    const today = new Date()
    setStartDate(today.toLocaleDateString("ko-KR"))
    setEndDate(today.toLocaleDateString("ko-KR"))
    setSelectedDateRange([today, today]) // 현재 날짜로 설정
  }
  // 달력에서 날짜를 선택할 때 호출되는 함수
  const handleDateChange = (dateRange) => {
    setSelectedDateRange(dateRange)
    setStartDate(dateRange[0] ? dateRange[0].toLocaleDateString("ko-KR") : "")
    setEndDate(dateRange[1] ? dateRange[1].toLocaleDateString("ko-KR") : "")
  }

  // 캘린더의 날짜 스타일을 설정하는 함수 추가
  const tileClassName = ({ date }) => {
    const day = date.getDay() // 0: 일요일, 1: 월요일, ..., 6: 토요일
    // 기본적으로 검은색으로 설정
    let className = "text-black"

    // 토요일과 일요일에만 빨간색으로 변경
    if (day === 0 || day === 6) {
      className = "text-red-500" // 토요일과 일요일에 숫자를 빨간색으로 표시
    }

    return className // 최종 클래스 이름 반환
  }

  return (
    <div className="container mx-auto p-4 max-w-[900px]">
      <div className=" h-full bg-white p-6 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold text-gray-800">
            {domesticInternational === "Domestic" ? "국내 " : "해외 "}메이트 모집
          </h1>
          <button
            onClick={() => navigate(`/posts/mate?di=${domesticInternational}`)}
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
                      <option value="스페인">스페인</option>
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
            <label htmlFor="title" className="mt-3 font-semibold">
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

          <div className="bg-white mt-3">
            <label htmlFor="Calendar" className="block font-semibold">
              일정 기간
            </label>
            <div className="my-3">
              <p>
                {startDate || "0000.00.00."} ~ {endDate || "0000.00.00."}
                <button
                  onClick={handleDateReset}
                  className="ml-3 text text-sm bg-tripDuoGreen text-white px-2 py-1 rounded hover:bg-green-600 transition duration-150">
                  초기화
                </button>
              </p>
            </div>

            <Calendar
              selectRange={true}
              className="w-full p-4 bg-white rounded-lg border-none" // 달력 컴포넌트의 테두리를 없애기 위해 border-none 추가
              onChange={handleDateChange}
              value={selectedDateRange || [new Date(), new Date()]} // 초기값 또는 선택된 날짜 범위
              minDetail="month" // 상단 네비게이션에서 '월' 단위만 보이게 설정
              maxDetail="month" // 상단 네비게이션에서 '월' 단위만 보이게 설정
              navigationLabel={null}
              showNeighboringMonth={false} //  이전, 이후 달의 날짜는 보이지 않도록 설정
              calendarType="hebrew" //일요일부터 보이도록 설정
              tileClassName={tileClassName} // 날짜 스타일 설정
              formatYear={(locale, date) => moment(date).format("YYYY")} // 네비게이션 눌렀을때 숫자 년도만 보이게
              formatMonthYear={(locale, date) => moment(date).format("YYYY. MM")} // 네비게이션에서 2023. 12 이렇게 보이도록 설정
              prevLabel={
                <FaChevronLeft className="text-green-500 hover:text-green-700 transition duration-150 mx-auto" />
              }
              nextLabel={
                <FaChevronRight className="text-green-500 hover:text-green-700 transition duration-150 mx-auto" />
              }
              prev2Label={null}
              next2Label={null}
              tileContent={({ date }) => {
                return (
                  <span className={date.getDay() === 0 || date.getDay() === 6 ? "text-red-500" : "text-black"}>
                    {date.getDate()} {/* 날짜 숫자만 표시 */}
                  </span>
                )
              }} // 날짜 내용 설정
              formatDay={() => null}
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
                placeholderText: "정확한 장소 혹은 주소, 시간, 인원을 필수로 입력해 주세요.",
                height: 200,
              }}></FroalaEditor>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MateBoardForm
