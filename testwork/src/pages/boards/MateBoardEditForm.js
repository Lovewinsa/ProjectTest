import axios from "axios"
import moment from "moment"
import React, { useEffect, useState } from "react"
import Calendar from "react-calendar"
import FroalaEditor from "react-froala-wysiwyg"
import { Link, NavLink, useNavigate, useParams } from "react-router-dom"
import LoadingAnimation from "../../components/LoadingAnimation"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

function MateBoardEditForm(props) {
  //로딩 상태 추가
  const [loading, setLoading] = useState(false)

  const { id } = useParams()

  const [post, setPost] = useState({})

  const navigate = useNavigate()

  // 날짜 관리
  const [selectedDateRange, setSelectedDateRange] = useState([null, null])

  // 날짜 초기화
  const handleDateReset = () => {
    setSelectedDateRange([null, null]) // 날짜 범위를 현재 날짜로 초기화
    setPost({
      ...post,
      startDate: "",
      endDate: "",
    })
  }
  // 현재 날짜로 돌아오는 함수 추가
  const handleTodayClick = () => {
    const today = new Date()
    setPost({
      ...post,
      startDate: today.toLocaleDateString("ko-KR"),
      endDate: today.toLocaleDateString("ko-KR"),
    })
    setSelectedDateRange([today, today]) // 현재 날짜로 설정
  }
  // 달력에서 날짜를 선택할 때 호출되는 함수
  const handleDateChange = (dateRange) => {
    setSelectedDateRange(dateRange)
    setPost({
      ...post,
      startDate: dateRange[0] ? dateRange[0].toLocaleDateString("ko-KR") : "",
      endDate: dateRange[1] ? dateRange[1].toLocaleDateString("ko-KR") : "",
    })
  }

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
        setSelectedDateRange([res.data.startDate, res.data.endDate])
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
        navigate(`/posts/mate/${id}/detail`) // 상세 페이지로 돌려보내기
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
      {/* 로딩 애니메이션 */}
      {loading && <LoadingAnimation />}
      <div className=" h-full bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold text-gray-800">여행 코스 수정</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/posts/mate/${id}/detail`)}
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
        <div className="flex flex-wrap gap-2 mt-10">
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

          <div className="p-4">
            <label htmlFor="Calendar" className="block font-semibold">
              일정 기간
            </label>
            <div className="my-3">
              <p>
                {post.startDate || "0000.00.00."} ~ {post.endDate || "0000.00.00."}
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

export default MateBoardEditForm
