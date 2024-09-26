import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";


function CourseBoard() {
  // 글 목록 정보
  const [pageInfo, setPageInfo] = useState([])
  //검색 조건과 키워드
  const [searchState, setSearchState] = useState({
    condition: "",
    keyword: ""
  })

  // "/posts/course?pageNum=x"에서 pageNum을 추출하기 위한 Hook
  const [searchParams, setSearchParams] = useSearchParams({ pageNum: 1 })

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
        //국내코스, 해외코스 필터
        console.log(res.data.list)
        const filteredPageInfo = res.data.list.filter((item) => {
          return domesticInternational === "Domestic" ? item.country === "Korea" : item.country !== "Korea"
        })
        //서버로부터 응답된 데이터 state에 넣기
        setPageInfo(filteredPageInfo)

        setDesiredCountry(domesticInternational === "Domestic" ? "국내여행 코스 페이지" : "해외여행 코스 페이지")
        setPageTurn(domesticInternational === "Domestic" ? "해외로" : "국내로")
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    let pageNum = searchParams.get("pageNum")
    if (pageNum == null) pageNum = 1
    refreshPageInfo(pageNum)
  }, [domesticInternational, searchParams])


  //원하는 글 정보 조건검색
  const conditionalSearch = () => {
    const query = new URLSearchParams(searchState).toString()
    navigate(`/course?${query}`)
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
    // move(1)
  }


  return (
    <div className="container mx-auto p-4 max-w-[900px]">
      <Link
        to={{ pathname: "/posts/course/new", search: `?di=${domesticInternational}` }}
        className="text-blue-500">여행코스 계획하기
      </Link>
      <button
        onClick={handleDesiredCountry}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
      >{pageTurn}</button>
      <h2 className="text-2xl font-bold mb-4">{desiredCountry}</h2>
      <label htmlFor="search">검색조건</label>
      <select
        onChange={handleSearchChange}
        value={searchState.condition}
        name="condition"
        id="search"
        className="border border-gray-300 p-2 rounded-md ml-2"
      >
        <option value="">선택</option>
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
        className="border border-gray-300 p-2 rounded-md ml-2"
      />
      <button onClick={() => conditionalSearch()} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md">
        검색
      </button>
      <button onClick={handleReset} className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-md">
        Reset
      </button>

      <table className="table-auto w-full border divide-y divide-x divide-gray-200">
        <thead className="text-center">
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>좋아요</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody className="text-center divide-y">
          {pageInfo.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td className="text-left" >
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">{`#${item.country}`}</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">{`#${item.city}`}</span>
                  {item.tags &&
                    item.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                        {tag}
                      </span>
                    ))}
                </div>
                <Link to={`/posts/course/${item.id}/detail?di=${domesticInternational}`}>{item.title}</Link>
              </td>
              {/* className="p-3 border-b border-gray-300" */}
              <td>{item.likeCount}</td>
              <td>{item.writer}</td>
              <td>{item.updatedAt ? item.updatedAt.slice(0, 10) : item.createdAt.slice(0, 10)}</td>
              <td>{item.viewCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4">
        <strong>{pageInfo.totalRow}</strong>개의 글이 있습니다
      </p>
    </div>
  )
}

export default CourseBoard