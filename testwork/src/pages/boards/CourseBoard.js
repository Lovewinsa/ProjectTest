import axios from "axios";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { Link, useNavigate, useSearchParams } from "react-router-dom";


function CourseBoard() {
  // 글 목록 정보
  const [pageInfo, setPageInfo] = useState([])
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // 파라미터 값 관리
  const [searchParams, setSearchParams] = useSearchParams()
  //검색 조건과 키워드
  const [searchCriteria, setSearchCriteria] = useState({
    country: "",
    city: "",
    startDate: "",
    endDate: "",
    keyword: "",
    condition: "title", // 검색 옵션: 제목 또는 작성자
  })

  //국내/해외 페이지
  const [domesticInternational, setDomesticInternational] = useState("")
  //국내/해외 페이지 전환 버튼
  const [pageTurn, setPageTurn] = useState("")
  const [desiredCountry, setDesiredCountry] = useState(null)

  //정렬기준 초기값 설정
  const [sortBy, setSortBy] = useState("latest")

  // 달력에서 선택된 날짜 범위 저장
  const [selectedDateRange, setSelectedDateRange] = useState([null, null])
  // 캘린더 표시 여부 상태
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    let pageNum = searchParams.get("pageNum") || 1
    const diValue = searchParams.get("di") || "Domestic"
    const city = searchParams.get("city") || ""
    const startDate = searchParams.get("startDate") || ""
    const endDate = searchParams.get("endDate") || ""
    const country = searchParams.get("country") || ""
    const keyword = searchParams.get("keyword") || ""
    const condition = searchCriteria.condition || "title"; // 기존 조건 유지

    setCurrentPage(Number(pageNum))
    setDomesticInternational(diValue)
    
    setSearchCriteria((prev) => ({
      ...prev,
      city,
      startDate,
      endDate,
      country,
      keyword,
      condition: condition
    }))

    axios
      .get(`/api/v1/posts/course`, {
        params: {
          pageNum: Number(pageNum),
          country: country || undefined,
          city: city || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          keyword: keyword || undefined,
          condition: condition, // 조건이 없으면 제목으로 설정
          sortBy: sortBy || "latest", // 정렬 조건이 없으면 최신순으로 설정
          di: diValue || "Domestic", // 국내/해외 페이지가 설정되지 않았으면 기본값으로 설정
        },
      })
      .then(res => {
        //국내코스, 해외코스 필터
        const filteredPageInfo = res.data.list.filter((item) => {

          const matchesDomesticInternational = diValue === "Domestic" ? item.country === "Korea" : item.country !== "Korea"
          if (!matchesDomesticInternational) return false

          const matchesCountry = searchCriteria.country ? item.country.includes(searchCriteria.country) : true
          if (!matchesCountry) return false

          const matchesCity = searchCriteria.city ? item.city.includes(searchCriteria.city) : true
          if (!matchesCity) return false

          // 조건에 따라 제목 또는 작성자를 필터링
          const matchesKeyword = searchCriteria.condition === "title"
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
          if (!matchesDateRange(item)) return false

          return true
        })

        //정렬 조건
        const sorted = filteredPageInfo.sort((a, b) => {
          if (sortBy === "latest") {
            return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt); // 최신순
          } else if (sortBy === "viewCount") {
            return b.viewCount - a.viewCount // 조회수순
          } else if (sortBy === "likeCount") {
            return b.likeCount - a.likeCount // 좋아요순
          }
          return 0 // 기본값
        })

        //서버로부터 응답된 데이터 state에 넣기
        setDesiredCountry(diValue === "Domestic" ? "국내여행 코스 페이지" : "해외여행 코스 페이지")
        setPageTurn(diValue === "Domestic" ? "해외로" : "국내로")
        setPageInfo(sorted)
        // 총 페이지 수 업데이트
        console.log(res.data.list)
        // console.log(sorted)
        setTotalPages(res.data.totalPostPages)

      })
      .catch(error => {
        console.log(error)
      })
  }, [searchParams, sortBy])


  //국내, 해외 선택 이벤트
  const handleDesiredCountry = () => {
    setDomesticInternational(domesticInternational === "International" ? "Domestic" : "International")
    setSearchParams({
      ...searchCriteria,
      di: domesticInternational === "International" ? "Domestic" : "International",
    })
  };

  // 새로운 검색을 시작하는 함수
  const handleSearch = () => {
    setSearchParams({
      country: searchCriteria.country,
      city: searchCriteria.city,
      startDate: searchCriteria.startDate,
      endDate: searchCriteria.endDate,
      keyword: searchCriteria.keyword,
      di: domesticInternational,
    });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value); // 정렬 기준 변경
  };

  // 검색 기준 변경 핸들러
  const handleConditionChange = (e) => {
    setSearchCriteria({
      ...searchCriteria,
      condition: e.target.value,
      keyword: ""
    });
  };

  // 검색 조건 입력 변화에 대한 처리 함수
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({ ...searchCriteria, [name]: value });
  };

  // 제목 또는 작성자 검색 쿼리 처리
  const handleQueryChange = (e) => {
    const value = e.target.value;
    setSearchCriteria({
      ...searchCriteria,
      keyword: value, // 검색어를 keyword로 저장
    });
  };

  // 날짜 초기화
  const handleDateReset = () => {
    setSelectedDateRange([null, null]); // 날짜 범위를 현재 날짜로 초기화
    setSearchCriteria({
      ...searchCriteria,
      startDate: "", // 시작 날짜 초기화
      endDate: "",   // 종료 날짜 초기화
    });
  };

  // 현재 날짜로 돌아오는 함수 추가
  const handleTodayClick = () => {
    const today = new Date();
    setSelectedDateRange([today, today]); // 현재 날짜로 설정
    setSearchCriteria({
      ...searchCriteria,
      startDate: today.toLocaleDateString('ko-KR'),
      endDate: today.toLocaleDateString('ko-KR'),
    })
  }

  // 달력에서 날짜를 선택할 때 호출되는 함수
  const handleDateChange = (dateRange) => {
    setSelectedDateRange(dateRange)
    setIsCalendarOpen(false) // 날짜 선택 후 캘린더 닫기
    setSearchCriteria({
      ...searchCriteria,
      startDate: dateRange[0] ? dateRange[0].toLocaleDateString('ko-KR') : "",
      endDate: dateRange[1] ? dateRange[1].toLocaleDateString('ko-KR') : "",
    })
  }

  // 페이지 이동 핸들러
  const paginate = (pageNum) => {
    setCurrentPage(pageNum)
    setSearchParams({ ...searchParams, pageNum })
  }

  //Reset 버튼을 눌렀을 때
  const handleReset = () => {
    //검색조건과 검색어 초기화
    setSearchCriteria({
      condition: "",
      keyword: ""
    })
    // //1페이지 내용이 보여지게
    // refreshPageInfo(1)
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

  // 게시물 클릭 시 해당 게시물 상세 페이지로 이동
  const handlePostClick = (id) => {
    navigate(`/posts/course/${id}/detail?di=${domesticInternational}`)
  }


  return (
    <div className="container mx-auto p-4 max-w-[1024px]">
      <div className="container mx-auto">
        <div className="flex justify-between mb-4">
          <Link
            to={{
              pathname: "/posts/course/new",
              search: `?di=${domesticInternational}&status=PUBLIC`
            }}
            className="text-blue-500"
          >
            여행코스 계획하기
          </Link>
          <button
            onClick={handleDesiredCountry}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-500 transition-all duration-300"
          >
            {pageTurn}
          </button>
        </div>
        <h1 className="text-3xl font-bold text-center mb-8">
          {desiredCountry}
        </h1>

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
              className="border border-gray-300 rounded-md px-4 py-2 w-1/6 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            >
              <option value="title">제목</option>
              <option value="writer">작성자</option>
              <option value="content">내용</option>
              <option value="title+writer">제목 + 내용</option>
            </select>

            <input
              type="text"
              name={searchCriteria.condition}
              value={searchCriteria[searchCriteria.condition]}
              onChange={handleQueryChange}
              placeholder={searchCriteria.condition === "title" ? "제목" : "작성자"}
              className="border border-gray-300 rounded-md px-4 py-2 w-5/6 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>

          {/* 날짜 선택 및 검색 버튼 */}
          <div className="flex items-center space-x-2 mt-4">
            <button
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition-all duration-300"
            >
              {selectedDateRange[0] && selectedDateRange[1]
                ? `${selectedDateRange[0].toLocaleDateString()} ~ ${selectedDateRange[1].toLocaleDateString()}`
                : "날짜 선택"}
            </button>

            {/* 캘린더 표시 여부에 따라 렌더링 */}
            {isCalendarOpen && (
              <div className="absolute z-50 bg-white shadow-lg rounded-md p-4 mt-2">
                <Calendar
                  selectRange={true}
                  onChange={handleDateChange}
                  value={selectedDateRange || [new Date(), new Date()]}
                  formatDay={(locale, date) => moment(date).format("DD")}
                  minDetail="month" // 상단 네비게이션에서 '월' 단위만 보이게 설정
                  maxDetail="month" // 상단 네비게이션에서 '월' 단위만 보이게 설정
                  navigationLabel={null}
                  showNeighboringMonth={false} //  이전, 이후 달의 날짜는 보이지 않도록 설정
                  calendarType="hebrew" //일요일부터 보이도록 설정
                />
                <button onClick={handleDateReset} className="bg-red-500 text-white px-4 py-2 ml-2">
                  날짜 초기화
                </button>
                <button onClick={handleTodayClick} className="bg-green-500 text-white px-4 py-2 ml-2">
                  오늘로 돌아가기
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition-all duration-300 mt-4"
          >
            검색
          </button>
        </div>

        {/* 검색 정렬 기준 다운바 */}
        <div className="my-4">
          <label htmlFor="sortBy" className="mr-2">정렬 기준:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={handleSortChange}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          >
            <option value="latest">최신순</option>
            <option value="viewCount">조회수순</option>
            <option value="likeCount">좋아요순</option>
          </select>
        </div>

        {/* 카드 리스트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {pageInfo.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
              onClick={() => handlePostClick(post.id)}
            >
              <img src={post.image || "/placeholder.jpg"} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-bold">{post.title}</h2>
                <p className="text-sm text-gray-600">작성자: {post.writer}</p>
                <p className="text-sm text-gray-600">작성일: {getTimeDifference(post.createdAt, post.updatedAt)}</p>
                <p className="text-sm text-gray-600">{post.startDate === null ? "설정하지 않았습니다." : new Date(post.startDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                  {post.endDate === null ? "" : ` ~ ${new Date(post.endDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}`}</p>
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
                          {tag}
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
            className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-300 text-gray-700"
              }`}
          >
            &lt;
          </button>
          {/* totalPages만큼 배열 생성 */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-4 py-2 rounded ${currentPage === number ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
                }`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-300 text-gray-700"}`}
          >
            &gt;
          </button>
        </div>

        <p className="mt-4 text-center">
          <strong>{pageInfo.length}</strong>개의 글이 있습니다.
        </p>
      </div>
    </div>
  );
}

export default CourseBoard