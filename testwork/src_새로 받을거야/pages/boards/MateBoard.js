import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import moment from "moment"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faHeart, faMessage } from "@fortawesome/free-solid-svg-icons"
import LoadingAnimation from "../../components/LoadingAnimation"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa" // Font Awesome 또는 원하는 아이콘 라이브러리 사용

function MateBoard() {
  const calendarRef = useRef(null)

  //로딩 상태 추가
  const [loading, setLoading] = useState(false)

  //배열 안에서 객체로 관리
  const [pageData, setPageData] = useState([])

  //파라미터 값 관리
  // URL에서 검색 매개변수를 가져오기 위한 상태
  const [searchParams, setSearchParams] = useSearchParams()

  // 사용자가 입력한 검색 조건을 저장하기 위한 상태
  const [searchCriteria, setSearchCriteria] = useState({
    country: "",
    city: "",
    startDate: "",
    endDate: "",
    keyword: "",
    condition: "title", // 검색 옵션: 제목 또는 작성자
  })

  // *이후에 di 값이 영향을 미치지는않지만 계속 남아있음
  const [domesticInternational, setDomesticInternational] = useState()
  const [pageTurn, setPageTurn] = useState("to International")

  // 페이지 전환 버튼
  const [whereAreYou, setWhereAreYou] = useState(null)
  const [sortBy, setSortBy] = useState("latest") // 정렬 기준 초기값 설정

  // 달력에서 선택된 날짜 범위 저장
  const [selectedDateRange, setSelectedDateRange] = useState([null, null])
  const [isCalendarOpen, setIsCalendarOpen] = useState(false) // 캘린더 표시 여부 상태

  // 검색 기준 변경 핸들러
  const handleConditionChange = (e) => {
    setSearchCriteria({
      ...searchCriteria,
      condition: e.target.value,
      keyword: "",
    })
  }

  // 검색 조건 입력 변화에 대한 처리 함수
  const handleSearchChange = (e) => {
    const { name, value } = e.target
    setSearchCriteria({ ...searchCriteria, [name]: value })
  }

  // 제목 또는 작성자 검색 쿼리 처리
  const handleQueryChange = (e) => {
    const value = e.target.value
    setSearchCriteria({
      ...searchCriteria,
      keyword: value, // 검색어를 keyword로 저장
    })
  }

  // 달력에서 날짜를 선택할 때 호출되는 함수
  const handleDateChange = (dateRange) => {
    setSelectedDateRange(dateRange)
    setIsCalendarOpen(false) // 날짜 선택 후 캘린더 닫기
    setSearchCriteria({
      ...searchCriteria,
      startDate: dateRange[0] ? dateRange[0].toLocaleDateString("ko-KR") : "",
      endDate: dateRange[1] ? dateRange[1].toLocaleDateString("ko-KR") : "",
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

  // 날짜 초기화
  const handleDateReset = () => {
    setSelectedDateRange([null, null]) // 날짜 범위를 현재 날짜로 초기화
    setSearchCriteria({
      ...searchCriteria,
      startDate: "", // 시작 날짜 초기화
      endDate: "", // 종료 날짜 초기화
    })
  }

  // 캘린더 외부 클릭시 캘린더 모달 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false) // 달력 닫기
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // searchParams 가 바뀔때마다 실행된다.
  // searchParams 가 없다면 초기값 "Domestic" 있다면 di 란 key 값의 데이터를 domesticInternational에 전달한다
  useEffect(() => {
    // 로딩 애니메이션을 0.5초 동안만 표시
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 700)

    const diValue = searchParams.get("di") || "Domestic" // 국내/국제 값 가져오기
    const city = searchParams.get("city") || "" // 도시 가져오기
    const startDate = searchParams.get("startDate") || "" // 시작 날짜 가져오기
    const endDate = searchParams.get("endDate") || "" // 종료 날짜 가져오기
    const country = searchParams.get("country") || "" // 국가 가져오기
    const keyword = searchParams.get("keyword") || ""

    setDomesticInternational(diValue)
    setSearchCriteria({ city, startDate, endDate, country, keyword, condition: searchCriteria.condition }) // 검색 조건 설정
    // 국내/국제 값 업데이트
  }, [searchParams])

  const fetchFilteredPosts = () => {
    //필터링할 검색조건을 params에 담는다
    const params = {
      country: searchCriteria.country || null,
      city: searchCriteria.city || null,
      startDate: searchCriteria.startDate || null,
      endDate: searchCriteria.endDate || null,
      keyword: searchCriteria.keyword || null,
      condition: searchCriteria.condition || null,
      sortBy,
    }

    // API 호출
    axios
      .get("/api/v1/posts/mate", { params })
      .then((res) => {
        //필터링되어 돌아온 params를 받는다
        console.log(res.data)
        let filtered = res.data.list
        //국내 해외 필터링
        if (domesticInternational === "Domestic") {
          filtered = filtered.filter((item) => item.country === "한국")
        } else if (domesticInternational === "International") {
          filtered = filtered.filter((item) => item.country !== "한국")
        }
        //필터링된 데이터를 상태에 저장한다
        setPageData(filtered)
        //페이지 제목을 변경한다
        setWhereAreYou(
          domesticInternational === "International" ? "해외 여행 메이트 페이지" : "국내 여행 메이트 페이지"
        )
        //페이지 전환버튼을 변경한다
        setPageTurn(domesticInternational === "International" ? "to Domestic" : "to International")
      })
      .catch((error) => {
        console.log("Error:", error)
      })
  }

  // 해외 / 국내 전환시 호출
  useEffect(() => {
    fetchFilteredPosts()
  }, [domesticInternational])

  // -------------이벤트 관리부

  const search = () => {
    fetchFilteredPosts() // 비동기 처리를 기다리지 않음
  }

  // 국내/해외 변경 버튼 핸들러-
  const handleButtonClick = () => {
    // 국내 상태에서 눌렀을 때
    //상태 변경
    setDomesticInternational(domesticInternational === "International" ? "Domestic" : "International")
    setSearchParams({
      ...searchCriteria,
      di: domesticInternational === "International" ? "Domestic" : "International",
    })
  }

  // 새로운 검색을 시작하는 함수
  const handleSearch = () => {
    setSearchParams({
      country: searchCriteria.country,
      city: searchCriteria.city,
      startDate: searchCriteria.startDate,
      endDate: searchCriteria.endDate,
      condition: searchCriteria.condition,
      keyword: searchCriteria.keyword,
      di: domesticInternational,
    })

    search()
  }
  const handleSortChange = (e) => {
    setSortBy(e.target.value) // 정렬 기준 변경
    // 정렬 기준에 따라 pageData를 정렬
    const sortedData = [...pageData].sort((a, b) => {
      if (e.target.value === "latest") {
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
      } else if (e.target.value === "viewCount") {
        return b.viewCount - a.viewCount
      } else if (e.target.value === "likeCount") {
        return b.likeCount - a.likeCount
      }
      return 0 // 기본값
    })
    setPageData(sortedData) // 정렬된 데이터를 상태에 저장
  }

  return (
    <div className="container mx-auto m-4">
      {/* 로딩 애니메이션 */}
      {loading && <LoadingAnimation />}
      <Link
        className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-gray-100 mr-3"
        to={{ pathname: "/posts/mate/new", search: `?di=${domesticInternational}` }}>
        새글 작성
      </Link>
      <button
        className="px-4 py-2 text-sm font-medium rounded-md bg-gray-600 text-gray-100"
        onClick={handleButtonClick}>
        {pageTurn}
      </button>
      <h4 className="font-bold mb-4">{whereAreYou}</h4>

      {/* 검색 조건 입력 폼 */}
      <div className="my-4 space-y-4">
        {/* 국가와 도시를 한 행으로 배치 */}
        <div className="flex items-center gap-4">
          {domesticInternational === "International" && (
            <input
              type="text"
              name="country"
              value={searchCriteria.country}
              onChange={handleSearchChange}
              placeholder="국가"
              className="border border-gray-300 rounded-md px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          )}

          <input
            type="text"
            name="city"
            value={searchCriteria.city}
            onChange={handleSearchChange}
            placeholder="도시"
            className="border border-gray-300 rounded-md px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
        </div>

        {/* 제목/작성자 선택 필드 */}
        <div className="flex items-center gap-4">
          <select
            value={searchCriteria.condition}
            onChange={handleConditionChange}
            className="border border-gray-300 rounded-md px-4 py-2 w-1/6 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300">
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="title_writer">제목 + 내용</option>
          </select>

          <input
            type="text"
            name={searchCriteria.condition}
            value={searchCriteria[searchCriteria.condition]}
            onChange={handleQueryChange}
            placeholder={searchCriteria.condition}
            className="border border-gray-300 rounded-md px-4 py-2 w-5/6 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition-all duration-300">
            {selectedDateRange[0] && selectedDateRange[1]
              ? `${selectedDateRange[0].toLocaleDateString()} ~ ${selectedDateRange[1].toLocaleDateString()}`
              : "날짜 선택"}
          </button>

          {/* 캘린더 표시 여부에 따라 렌더링 */}
          <div ref={calendarRef}>
            {isCalendarOpen && (
              <div className="absolute z-50 bg-white shadow-lg p-2">
                <button
                  onClick={handleDateReset}
                  className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700 transition duration-150">
                  날짜 리셋
                </button>
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
                  // <button
                  //   onClick={(event) => {
                  //     event.preventDefault()
                  //     // handleDateReset()
                  //     handleDateChange([new Date(), new Date()])
                  //   }}
                  //   className="text-black-500 hover:text-green-700 transition duration-150 mx-auto">
                  //   오늘로
                  // </button>
                  //}  다음 달의 다음 달로 이동하는 버튼을 오늘로 이동하는 버튼으로 변경
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
            )}
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition-all duration-300 mt-4">
          검색
        </button>
      </div>

      {/* 검색 정렬 기준 다운바 */}
      <div className="my-4">
        <label htmlFor="sortBy" className="mr-2">
          정렬 기준:
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={handleSortChange}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300">
          <option value="latest">최신순</option>
          <option value="viewCount">조회수순</option>
          <option value="likeCount">좋아요순</option>
        </select>
      </div>

      {/* 메이트 게시판 테이블 */}
      <table className="table-auto w-full border divide-y divide-x divide-gray-200">
        <thead className="text-center">
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>날짜</th>
            <th>작성일</th>
            <th>조회수/댓글수/좋아요</th>
          </tr>
        </thead>
        <tbody className="text-center divide-y">
          {pageData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td className="text-left">
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">{`#${item.country}`}</span>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">{`#${item.city}`}</span>
                  {item.tags &&
                    item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                        {tag}
                      </span>
                    ))}
                </div>
                <Link to={`/posts/mate/${item.id}/detail`}>{item.title}</Link>
              </td>
              <td>{item.writer}</td>
              <td>
                {item.startDate} ~ {item.endDate}
              </td>
              <td className="text-xs ">
                {item.updatedAt ? (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                    update
                  </span>
                ) : (
                  <span className="px-8"></span>
                )}
                {new Date(item.updatedAt ? item.updatedAt : item.createdAt).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                })}
              </td>
              {/* 조회수, 좋아요, 덧글 수 */}
              <td>
                <span className="text-sm text-gray-500">
                  <span className="mx-3">
                    <FontAwesomeIcon icon={faEye} className="h-4 w-4 mr-2" />
                    {item.viewCount}
                  </span>
                  <span className="mr-3">
                    <FontAwesomeIcon icon={faHeart} className="h-4 w-4 mr-2" />
                    {item.likeCount}
                  </span>
                  <span className="mr-3">
                    <FontAwesomeIcon icon={faMessage} className="h-4 w-4 mr-2" />
                    {item.commentCount}
                  </span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MateBoard
