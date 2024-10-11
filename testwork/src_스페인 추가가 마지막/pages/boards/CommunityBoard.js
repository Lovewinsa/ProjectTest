import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart, faMessage } from "@fortawesome/free-solid-svg-icons";
import LoadingAnimation from "../../components/LoadingAnimation";

function CommunityBoard() {
  //로딩 상태 추가
  const [loading, setLoading] = useState(false);

  // 글 목록 정보
  //배열 안에서 객체로 관리
  const [pageData, setPageData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  //파라미터 값 관리
  // URL에서 검색 매개변수를 가져오기 위한 상태
  const [searchParams, setSearchParams] = useSearchParams();

  // 사용자가 입력한 검색 조건을 저장하기 위한 상태
  const [searchCriteria, setSearchCriteria] = useState({
    country: "",
    city: "",
    startDate: "",
    endDate: "",
    keyword: "",
    condition: "title", // 검색 옵션: 제목 또는 작성자
  });

  // *이후에 di 값이 영향을 미치지는않지만 계속 남아있음
  const [domesticInternational, setDomesticInternational] = useState();
  const [pageTurn, setPageTurn] = useState("to International");

  // 페이지 전환 버튼
  const [whereAreYou, setWhereAreYou] = useState(null);
  const [sortBy, setSortBy] = useState("latest"); // 정렬 기준 초기값 설정

  // 검색 기준 변경 핸들러
  const handleConditionChange = (e) => {
    setSearchCriteria({
      ...searchCriteria,
      condition: e.target.value,
      keyword: "",
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

  // searchParams 가 바뀔때마다 실행된다.
  // searchParams 가 없다면 초기값 "Domestic" 있다면 di 란 key 값의 데이터를 domesticInternational에 전달한다
  useEffect(() => {
    // 로딩 애니메이션을 0.5초 동안만 표시
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 700);

    const diValue = searchParams.get("di") || "Domestic"; // 국내/국제 값 가져오기
    const city = searchParams.get("city") || ""; // 도시 가져오기
    const country = searchParams.get("country") || ""; // 국가 가져오기
    const keyword = searchParams.get("keyword") || "";

    setDomesticInternational(diValue);
    setSearchCriteria({ city, country, keyword, condition: searchCriteria.condition }); // 검색 조건 설정
    // 국내/국제 값 업데이트
  }, [searchParams]);

  // domesticInternational 가 바뀔때마다 실행된다.
  // to D~ I~ Button 을 누를때 or 새로운 요청이 들어왔을때
  useEffect(() => {
    // 로딩 애니메이션을 0.5초 동안만 표시
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);

    axios
      .get("/api/v1/posts/community")
      .then((res) => {
        const filtered = res.data.list.filter((item) => {
          const matchesDomesticInternational =
            domesticInternational === "Domestic" ? item.country === "대한민국" : item.country !== "대한민국";
          if (!matchesDomesticInternational) return false;

          const matchesCountry = searchCriteria.country ? item.country.includes(searchCriteria.country) : true;
          if (!matchesCountry) return false;

          const matchesCity = searchCriteria.city ? item.city.includes(searchCriteria.city) : true;
          if (!matchesCity) return false;

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
              : true;

          if (!matchesKeyword) return false;

          return true;
        });

        const sorted = filtered.sort((a, b) => {
          if (sortBy === "latest") {
            return new Date(b.createdAt) - new Date(a.createdAt); // 최신순
          } else if (sortBy === "viewCount") {
            return b.viewCount - a.viewCount; // 조회수순
          } else if (sortBy === "likeCount") {
            return b.likeCount - a.likeCount; // 좋아요순
          }
          return 0; // 기본값
        });
        setPageData(sorted);
        setWhereAreYou(
          domesticInternational === "Domestic" ? "국내 여행 커뮤니티 페이지" : "해외 여행 커뮤니티 페이지"
        );
        setPageTurn(domesticInternational === "Domestic" ? "to International" : "to Domestic");
      })
      .catch((error) => console.log(error));
  }, [domesticInternational, searchCriteria, sortBy]);

  // -------------이벤트 관리부

  // 국내/해외 변경 버튼 핸들러-
  const handleButtonClick = () => {
    // 국내 상태에서 눌렀을 때
    //상태 변경
    setDomesticInternational(domesticInternational === "International" ? "Domestic" : "International");
    setSearchParams({
      ...searchCriteria,
      di: domesticInternational === "International" ? "Domestic" : "International",
    });
  };

  // 새로운 검색을 시작하는 함수
  const handleSearch = () => {
    setSearchParams({
      country: searchCriteria.country,
      city: searchCriteria.city,
      keyword: searchCriteria.keyword,
      di: domesticInternational,
    });
  };
  const handleSortChange = (e) => {
    setSortBy(e.target.value); // 정렬 기준 변경
  };

  // 페이지 이동 핸들러
  const paginate = (pageNum) => {
    setCurrentPage(pageNum);
    setSearchParams({ ...searchParams, pageNum });
  };

  // 현재 시간과 작성일을 비교해 '몇 시간 전' 또는 '몇 일 전'을 계산하는 함수
  const getTimeDifference = (createdAt, updatedAt) => {
    const postDate = new Date(updatedAt ? updatedAt : createdAt);
    const now = new Date();
    const timeDiff = now - postDate; // 시간 차이를 밀리초 단위로 계산

    const diffInMinutes = Math.floor(timeDiff / (1000 * 60)); // 밀리초 -> 분
    const diffInHours = Math.floor(timeDiff / (1000 * 60 * 60)); // 밀리초 -> 시간
    const diffInDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // 밀리초 -> 일

    if (diffInMinutes < 60) {
      // 1시간 이내일 경우 '몇 분 전'
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      // 24시간 이내일 경우 '몇 시간 전'
      return `${diffInHours}시간 전`;
    } else {
      // 24시간 이상일 경우 '몇 일 전'
      return `${diffInDays}일 전`;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-[1024px]">
      {/* 로딩 애니메이션 */}
      {loading && <LoadingAnimation />}
      <div className="container mx-auto m-4">
        <Link
          className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-gray-100 mr-3"
          to={{ pathname: "/posts/community/new", search: `?di=${domesticInternational}` }}>
          새글 작성
        </Link>
        <button
          className="px-4 py-2 text-sm font-medium rounded-md bg-gray-600 text-gray-100"
          onClick={handleButtonClick}>
          {pageTurn}
        </button>
        <h4 className="font-bold mb-4">{whereAreYou}</h4>

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

        {/* 메이트 게시판 리스트 */}

        <ul className="w-full border border-gray-200 divide-y divide-gray-200">
          {pageData.map((item) => (
            <li key={item.id} className="grid grid-cols-1 sm:grid-cols-4 items-center text-center py-2 gap-2">
              {/* 첫 번째 열: 게시글 정보 */}
              <div className="col-span-2 sm:col-span-2 text-left pl-5">
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded items-center">{`#${item.country}`}</span>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded items-center">{`#${item.city}`}</span>
                  {item.tags &&
                    item.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                </div>
                <div className="mt-2">
                <Link to={`/posts/community/${item.id}/detail`} >
                  {item.title}
                </Link>
                </div>
              </div>

              {/* 두 번째 열: 작성자 */}
              <div className="sm:text-center text-sm sm:col-span-1 font-semibold text-gray-500">{item.writer}</div>

              {/* 세 번째 열: 작성일/수정일 */}
              <div className="text-xs sm:text-center text-left mr-5 sm:mr-1">
                {item.updatedAt ? (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                    update
                  </span>
                ) : (
                  <span className="px-8"></span>
                )}
                {new Date(item.updatedAt ? item.updatedAt : item.createdAt).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
                <div className="text-xs text-gray-500 sm:text-center text-left">
                  <span className="mx-3">
                    <FontAwesomeIcon icon={faEye} className="h-4 w-4 mr-1" />
                    {item.viewCount}
                  </span>
                  <span className="mr-3">
                    <FontAwesomeIcon icon={faHeart} className="h-4 w-4 mr-1" />
                    {item.likeCount}
                  </span>
                  <span className="">
                    <FontAwesomeIcon icon={faMessage} className="h-4 w-4 mr-1" />
                    {item.commentCount}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* 페이징 버튼 */}
        <div className="flex justify-center space-x-2 mt-5">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-300 text-gray-700"
            }`}>
            &lt;
          </button>
          {/* totalPages만큼 배열 생성 */}
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
          <strong>{pageData.length}</strong>개의 글이 있습니다.
        </p>
      </div>
    </div>
  );
}

export default CommunityBoard;
