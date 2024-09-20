import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function CourseScrollBoard() {
  // 글 목록 정보
  const [pageInfo, setPageInfo] = useState([]);
  // 검색 조건과 키워드
  const [searchState, setSearchState] = useState({
    condition: "",
    keyword: "",
  });

  const [searchParams, setSearchParams] = useSearchParams({});
  const [domesticInternational, setDomesticInternational] = useState(
    searchParams.get("di") || "Domestic"
  );
  const [pageTurn, setPageTurn] = useState("해외여행 코스");
  const [desiredCountry, setDesiredCountry] = useState(null);
  const [page, setPage] = useState(1); // 현재 페이지 상태
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부
  const navigate = useNavigate();

  // 국내, 해외 선택 이벤트
  const handleDesiredCountry = () => {
    setDomesticInternational(
      domesticInternational === "International" ? "Domestic" : "International"
    );
    setPage(1); // 페이지 전환 시 페이지 번호 초기화
  };

  // 글 목록 새로 불러오는 함수
  const fetchPageInfo = (pageNum = 1) => {
    const query = new URLSearchParams(searchState).toString();
    axios
      .get(`/api/v1/posts/course?${query}&page=${pageNum}`)
      .then((res) => {
        const filteredPageInfo = res.data.filter((item) => {
          return domesticInternational === "Domestic"
            ? item.country === "한국"
            : item.country !== "한국";
        });

        if (pageNum === 1) {
          // 첫 페이지일 경우 데이터 초기화
          setPageInfo(filteredPageInfo);
        } else {
          // 그 외 페이지일 경우 기존 데이터에 추가
          setPageInfo((prevPageInfo) => [...prevPageInfo, ...filteredPageInfo]);
        }

        // 더 불러올 데이터가 있는지 확인
        setHasMore(filteredPageInfo.length > 0);

        setDesiredCountry(
          domesticInternational === "Domestic"
            ? "국내여행 코스 페이지"
            : "해외여행 코스 페이지"
        );
        setPageTurn(
          domesticInternational === "Domestic" ? "해외로" : "국내로"
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchPageInfo(1);
  }, [domesticInternational]);

  // 무한 스크롤 처리
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        hasMore
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  useEffect(() => {
    if (page > 1) {
      fetchPageInfo(page);
    }
  }, [page]);

  // 원하는 글 정보 조건검색
  const conditionalSearch = () => {
    const query = new URLSearchParams(searchState).toString();
    navigate(`/course?${query}`);
  };

  const handleSearchChange = (e) => {
    setSearchState({
      ...searchState,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = () => {
    setSearchState({
      condition: "",
      keyword: "",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Link
        to={{
          pathname: "/posts/course/new",
          search: `?di=${domesticInternational}`,
        }}
        className="text-blue-500"
      >
        여행코스 계획하기
      </Link>
      <button
        onClick={handleDesiredCountry}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
      >
        {pageTurn}
      </button>
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
      <button
        onClick={() => conditionalSearch()}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        검색
      </button>
      <button
        onClick={handleReset}
        className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-md"
      >
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
              <td className="text-left">
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">
                    {`#${item.country}`}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">
                    {`#${item.city}`}
                  </span>
                  {item.tags &&
                    item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
                <Link to={`/posts/course/${item.id}/detail`}>
                  {item.title}
                </Link>
              </td>
              <td>{item.likeCount}</td>
              <td>{item.writer}</td>
              <td>{item.updatedAt ? item.updatedAt : item.createdAt}</td>
              <td>{item.viewCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4">
        <strong>{pageInfo.length}</strong>개의 글이 있습니다
      </p>
    </div>
  );
}

export default CourseScrollBoard;
