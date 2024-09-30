import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";


function CourseBoard() {
  // 글 목록 정보
  const [pageInfo, setPageInfo] = useState([])
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  //검색 조건과 키워드
  const [searchState, setSearchState] = useState({
    condition: "",
    keyword: ""
  })

  // "/posts/course?pageNum=x"에서 pageNum을 추출하기 위한 Hook
  const [searchParams] = useSearchParams({ pageNum: 1 })
  //국내 페이지, 해외 페이지
  const [domesticInternational, setDomesticInternational] = useState(searchParams.get("di") || "Domestic")
  const [pageTurn, setPageTurn] = useState("해외여행 코스") //페이지 전환 버튼
  const [desiredCountry, setDesiredCountry] = useState(null)

  const navigate = useNavigate()

  //국내, 해외 선택 이벤트
  const handleDesiredCountry = () => {
    setDomesticInternational(domesticInternational === "International" ? "Domestic" : "International")
  };

  //글 목록 새로 읽어오는 함수
  const refreshPageInfo = (pageNum) => {
    //검색 기능과 관련된 query 문자열 읽어오기
    const query = new URLSearchParams(searchState).toString()
    axios.get(`/api/v1/posts/course?pageNum=${pageNum}&${query}`)//
      .then(res => {
        console.log(res.data)
        //국내코스, 해외코스 필터
        const filteredPageInfo = res.data.list.filter((item) => {
          return domesticInternational === "Domestic" ? item.country === "Korea" : item.country !== "Korea"
        })
        //서버로부터 응답된 데이터 state에 넣기
        setDesiredCountry(domesticInternational === "Domestic" ? "국내여행 코스 페이지" : "해외여행 코스 페이지")
        setPageTurn(domesticInternational === "Domestic" ? "해외로" : "국내로")
        setPageInfo(filteredPageInfo)
        setTotalPages(res.data.totalPostPages); // 총 페이지 수 업데이트

      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    let pageNum = searchParams.get("pageNum") || 1
    setCurrentPage(Number(pageNum))
    refreshPageInfo(pageNum)
  }, [domesticInternational, searchParams])

  // 페이지 이동 핸들러
  const paginate = (pageNum) => {
    setCurrentPage(pageNum)
    refreshPageInfo(pageNum)
  }

  //원하는 글 정보 조건검색
  const conditionalSearch = () => {
    const query = new URLSearchParams(searchState).toString()
    navigate(`/course?${query}`)
    refreshPageInfo(1)
  }

  //검색 조건을 변경하거나 검색어를 입력하면 호출되는 함수
  const handleSearchChange = (e) => {
    setSearchState({
      ...searchState,
      [e.target.name]: e.target.value  //검색조건 혹은 검색 키워드가 변경된 값을 반영
    })
  }

  //Reset 버튼을 눌렀을 때
  const handleReset = () => {
    //검색조건과 검색어 초기화
    setSearchState({
      condition: "",
      keyword: ""
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

  // 게시물 클릭 시 해당 게시물 상세 페이지로 이동
  const handlePostClick = (id) => {
    navigate(`/posts/course/${id}/detail?di=${domesticInternational}`)
  }


  return (
    <div className="container mx-auto p-4 max-w-[1024px]">
      <div className="container mx-auto">
        <div className="flex justify-between mb-4">
          <Link
            to={{ pathname: "/posts/course/new", search: `?di=${domesticInternational}` }}
            className="text-blue-500"
          >
            여행코스 계획하기
          </Link>
          <button
            onClick={handleDesiredCountry}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-500"
          >
            {pageTurn}
          </button>
        </div>
        <h1 className="text-3xl font-bold text-center mb-8">
          {domesticInternational === "Domestic" ? "국내여행 코스" : "해외여행 코스"}
        </h1>

        {/* 검색 섹션 */}
        <div className="flex justify-center mb-8">
          <select
            onChange={handleSearchChange}
            value={searchState.condition}
            name="condition"
            id="search"
            className="border border-gray-300 p-2 rounded-md"
          >
            <option value="">검색 조건 선택</option>
            <option value="title_content">제목+내용</option>
            <option value="title">제목</option>
            <option value="writer">작성자</option>
          </select>
          <input
            onChange={handleSearchChange}
            value={searchState.keyword}
            type="text"
            placeholder="검색어..."
            name="keyword"
            className="border border-gray-300 p-2 rounded-md mx-2"
          />
          <button onClick={conditionalSearch} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            검색
          </button>
          <button onClick={handleReset} className="px-4 py-2 bg-gray-500 text-white rounded-md ml-2">
            Reset
          </button>
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
            className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-300 text-gray-700"
              }`}
          >
            &lt;
          </button>
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
            className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-300 text-gray-700"
              }`}
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