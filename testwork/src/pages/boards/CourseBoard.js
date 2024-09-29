import axios from "axios"
import { useEffect, useState } from "react"
import Calendar from "react-calendar"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

function CourseBoard() {
  // 글 목록 정보
  const [pageInfo, setPageInfo] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  //검색 조건과 키워드
  const [searchCriteria, setSearchCriteria] = useState({
    country: "",
    city: "",
    startDate: "",
    endDate: "",
    keyword: "",
    condition: "title",
  })

  // "/posts/course?pageNum=x"에서 pageNum을 추출하기 위한 Hook
  const [searchParams, setSearchParams] = useSearchParams({ pageNum: 1 })
  //국내 페이지, 해외 페이지
  const [domesticInternational, setDomesticInternational] = useState(searchParams.get("di") || "Domestic")
  const [pageTurn, setPageTurn] = useState("해외로") //페이지 전환 버튼
  const [desiredCountry, setDesiredCountry] = useState("국내여행 코스")
   // 정렬 기준 초기값 설정
  const [sortBy, setSortBy] = useState("latest")
  //// 달력에서 선택된 날짜 범위 저장
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // 캘린더 표시 여부 상태

  const navigate = useNavigate()

  //글 목록 새로 읽어오는 함수
  const refreshPageInfo = (pageNum) => {
    //검색 기능과 관련된 query 문자열 읽어오기
    const query = new URLSearchParams(searchCriteria).toString()
    axios
      .get(`/api/v1/posts/course?pageNum=${pageNum}&${query}`) //
      .then((res) => {
        console.log(searchCriteria)
        //국내코스, 해외코스 필터
        const filteredPageInfo = res.data.list.filter((item) => {
          const matchesDomesticInternational = domesticInternational === "Domestic" ? item.country === "Korea" : item.country !== "Korea"
          if (!matchesDomesticInternational) return false

          const matchesCountry = searchCriteria.country ? item.country.includes(searchCriteria.country) : true
          if (!matchesCountry) return false

          const matchesCity = searchCriteria.city ? item.city.includes(searchCriteria.city) : true
          if (!matchesCity) return false

          // 조건에 따라 제목 또는 작성자를 필터링
          const matchesKeyword =
            searchCriteria.condition === "title"
              ? item.title.includes(searchCriteria.keyword)
              : searchCriteria.condition === "writer"
              ? item.writer.includes(searchCriteria.keyword)
              : searchCriteria.condition === "content"
              ? item.content.includes(searchCriteria.keyword)
              : searchCriteria.condition === "title_content"
              ? item.title.includes(searchCriteria.keyword) || item.content.includes(searchCriteria.keyword)
              : true

          if (!matchesKeyword) return false

          // 선택한 startDate와 endDate 범위에 포함되는 항목만 필터링
          const matchesDateRange = (item) => {
            const itemStartDate = new Date(item.startDate)
            const itemEndDate = new Date(item.endDate)
            const searchStartDate = searchCriteria.startDate ? new Date(searchCriteria.startDate) : null
            const searchEndDate = searchCriteria.endDate ? new Date(searchCriteria.endDate) : null

            // 검색 범위의 날짜가 설정되지 않았으면 모든 게시물 표시
            if (!searchStartDate && !searchEndDate) {
              return true
            }

            // 검색 범위에 날짜가 설정되었을 경우 날짜 범위 체크
            return (
              (itemStartDate < searchEndDate && itemEndDate > searchStartDate) ||
              (itemStartDate <= searchStartDate && itemEndDate >= searchStartDate) ||
              (itemStartDate <= searchEndDate && itemEndDate >= searchEndDate)
            )
          }

          // 필터링 적용
          if (!matchesDateRange(item)) return false

          return true
        })
        //정렬 기준
        const sorted = filteredPageInfo.sort((a, b) => {
          if (sortBy === "latest") {
            return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt) // 최신순
          } else if (sortBy === "viewCount") {
            return b.viewCount - a.viewCount // 조회수순
          } else if (sortBy === "likeCount") {
            return b.likeCount - a.likeCount // 좋아요순
          }
          return 0 // 기본값
        })

        //서버로부터 응답된 데이터 state에 넣기
        setDesiredCountry(domesticInternational === "Domestic" ? "국내여행 코스 페이지" : "해외여행 코스 페이지")
        setPageTurn(domesticInternational === "Domestic" ? "해외로" : "국내로")
        setPageInfo(sorted)
        setTotalPages(res.data.totalPostPages) // 총 페이지 수 업데이트
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // searchParams 가 바뀔때마다 실행된다.
  // searchParams 가 없다면 초기값 "Domestic" 있다면 di 란 key 값의 데이터를 domesticInternational에 전달한다
  useEffect(() => {
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

  useEffect(() => {
    let pageNum = searchParams.get("pageNum") || 1
    setCurrentPage(Number(pageNum))
    refreshPageInfo(pageNum)
  }, [domesticInternational, searchCriteria, sortBy])

  //국내, 해외 선택 이벤트
  const handleDesiredCountry = () => {
    setDomesticInternational(domesticInternational === "International" ? "Domestic" : "International")
    setSearchParams({
      ...searchCriteria,
      di: domesticInternational === "International" ? "Domestic" : "International",
    });
  }

  // 페이지 이동 핸들러
  const paginate = (pageNum) => {
    setCurrentPage(pageNum)
    refreshPageInfo(pageNum)
  }

  // 새로운 검색을 시작하는 함수
  const handleSearch = () => {
    const pageNum = 1
    const country = searchCriteria.country
    const city = searchCriteria.city
    const startDate = searchCriteria.startDate
    const endDate = searchCriteria.endDate
    const keyword = searchCriteria.keyword
    const di = domesticInternational
    setSearchParams((prev) => [
      pageNum, 
      country,
      city,
      startDate,
      endDate,
      keyword,
      di
    ])
  }

  // 정렬 기준 변경
  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  // 검색 기준 변경 핸들러
  const handleConditionChange = (e) => {
    setSearchCriteria({
      ...searchCriteria,
      condition: e.target.value,
      keyword: "",
    })
  }

  //검색 조건을 변경하거나 검색어를 입력하면 호출되는 함수
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

  // 날짜 초기화
  const handleDateReset = () => {
    setSelectedDateRange([null, null]) // 날짜 범위를 현재 날짜로 초기화
    setSearchCriteria({
      ...searchCriteria,
      startDate: "", // 시작 날짜 초기화
      endDate: "", // 종료 날짜 초기화
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

  //Reset 버튼을 눌렀을 때
  const handleReset = () => {
    //검색조건과 검색어 초기화
    setSearchCriteria({
      country: "",
      city: "",
      startDate: "",
      endDate: "",
      condition: "",
      keyword: "",
    })
    // //1페이지 내용이 보여지게
    refreshPageInfo(1)
  }

  // 현재 시간과 작성일을 비교해 '몇 시간 전' 또는 '몇 일 전'을 계산하는 함수
  const getTimeDifference = (createdAt, updatedAt) => {
    const postDate = new Date(updatedAt ? updatedAt : createdAt)
    const now = new Date()
    const timeDiff = now - postDate // 시간 차이를 밀리초 단위로 계산

    const diffInMinutes = Math.floor(timeDiff / (1000 * 60)) // 밀리초 -> 분
    const diffInHours = Math.floor(timeDiff / (1000 * 60 * 60)) // 밀리초 -> 시간
    const diffInDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) // 밀리초 -> 일

    if (diffInMinutes < 60) {
      // 1시간 이내일 경우 '몇 분 전'
      return `${diffInMinutes}분 전`
    } else if (diffInHours < 24) {
      // 24시간 이내일 경우 '몇 시간 전'
      return `${diffInHours}시간 전`
    } else {
      // 24시간 이상일 경우 '몇 일 전'
      return `${diffInDays}일 전`
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-[1024px]">
      <div className="container mx-auto">
        <div className="flex justify-between mb-4">
          <Link
            to={{ pathname: "/posts/course/new", search: `?di=${domesticInternational}` }}
            className="text-blue-500">
            여행코스 계획하기
          </Link>
          <button
            onClick={handleDesiredCountry}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-500">
            {pageTurn}
          </button>
        </div>
        <h1 className="text-3xl font-bold text-center mb-8">
          {desiredCountry}
        </h1>

        {/* 검색 조건 입력 폼 */}
        <div className="my-4">
          {domesticInternational === "International" && ( // 국제 검색일 때 위치 입력 필드 렌더링
            <input
              type="text"
              name="country"
              value={searchCriteria.country}
              onChange={handleSearchChange}
              placeholder="국가"
              className="border px-2 py-1 mx-2"
            />
          )}
          <input
            type="text"
            name="city"
            value={searchCriteria.city}
            onChange={handleSearchChange}
            placeholder="도시"
            className="border px-2 py-1 mx-2"
          />

          {/* 제목/작성자 검색 옵션 선택 */}
          <div className="flex items-center mb-2">
            <select value={searchCriteria.condition} onChange={handleConditionChange} className="border px-2 py-1 mx-2">
              <option value="title">제목</option>
              <option value="writer">작성자</option>
              <option value="content">내용</option>
              <option value="title+writer">제목 + 내용</option>
            </select>
          </div>

          <input
            type="text"
            name={searchCriteria.condition} // 동적으로 이름 설정
            value={searchCriteria[searchCriteria.condition]} // 검색 타입에 따라 값 설정
            onChange={handleQueryChange}
            placeholder={searchCriteria.condition === "title" ? "제목" : "작성자"}
            className="border px-2 py-1 mx-2"
          />
          <div>
            {/* 날짜 선택 버튼 */}
            <button
              onClick={() => setIsCalendarOpen(!isCalendarOpen)} // 버튼 클릭 시 캘린더 표시/숨김 토글
              className="bg-blue-500 text-white px-4 py-2 mb-4">
              {selectedDateRange[0] && selectedDateRange[1] // 날짜가 선택되었을 때
                ? `${selectedDateRange[0].toLocaleDateString()} ~ ${selectedDateRange[1].toLocaleDateString()}`
                : "날짜 선택"}{" "}
              {/* 날짜가 선택되지 않았을 때 */}
            </button>

            {/* 날짜 초기화 버튼 */}
            <button onClick={handleDateReset} className="bg-red-500 text-white px-4 py-2 ml-2">
              날짜 초기화
            </button>
            <button
              onClick={() => {
                console.log(searchCriteria)
              }}>
              test
            </button>
            {/* 캘린더 표시 여부에 따라 렌더링 */}
            {isCalendarOpen && (
              <div className="absolute z-50 bg-white shadow-lg p-2">
                <Calendar
                  selectRange={true}
                  onChange={handleDateChange}
                  value={selectedDateRange || [new Date(), new Date()]} // 초기값 또는 선택된 날짜 범위
                />
              </div>
            )}
          </div>
          <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2">
            검색
          </button>
        </div>

        {/* 검색 정렬 기준 다운바 */}
        <div className="my-4">
          <label htmlFor="sortBy" className="mr-2">
            정렬 기준:
          </label>
          <select id="sortBy" value={sortBy} onChange={handleSortChange} className="border px-2 py-1">
            <option value="latest">최신순</option>
            <option value="viewCount">조회수순</option>
            <option value="likeCount">좋아요순</option>
          </select>
        </div>

        {/* 카드 리스트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {pageInfo.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={post.image || "/placeholder.jpg"} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-bold">{post.title}</h2>
                <p className="text-sm text-gray-600">작성자: {post.writer}</p>
                <p className="text-sm text-gray-600">작성일: {getTimeDifference(post.createdAt, post.updatedAt)}</p>
                <p className="text-sm text-right text-green-800 font-semibold">
                  {post.country} - {post.city}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-yellow-500">⭐ {post.rating?.toFixed(1) || "0.0"}</span>
                  <span className="text-sm text-gray-500">조회수: {post.viewCount}</span>
                </div>
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {post.tags &&
                      post.tags.map((tag, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이징 버튼 */}
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-300 text-gray-700"
            }`}>
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-4 py-2 rounded ${
                currentPage === number ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
              }`}>
              {number}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-300 text-gray-700"
            }`}>
            &gt;
          </button>
        </div>

        <p className="mt-4 text-center">
          <strong>{pageInfo.length}</strong>개의 글이 있습니다.
        </p>
      </div>
    </div>
  )
}

export default CourseBoard
