import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
  const [domesticInternational, setDomesticInternational] = useState("Domestic");
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

    let pageNum = searchParams.get("pageNum") || 1;
    const diValue = searchParams.get("di") || "Domestic"; // 국내/국제 값 가져오기
    const city = searchParams.get("city") || ""; // 도시 가져오기
    const country = searchParams.get("country") || ""; // 국가 가져오기
    const keyword = searchParams.get("keyword") || "";

    setCurrentPage(Number(pageNum));
    setDomesticInternational(diValue);

    setSearchCriteria({ city, country, keyword, condition: searchCriteria.condition }); // 검색 조건 설정
    // 국내/국제 값 업데이트
  }, [searchParams]);

  // domesticInternational 가 바뀔때마다 실행된다.
  // to D~ I~ Button 을 누를때 or 새로운 요청이 들어왔을때
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
    };

    // API 호출
    axios
      .get("/api/v1/posts/mate", { params })
      .then((res) => {
        //필터링되어 돌아온 params를 받는다
        console.log(res.data);
        let filtered = res.data.list;
        //국내 해외 필터링
        if (domesticInternational === "Domestic") {
          filtered = filtered.filter((item) => item.country === "한국");
        } else if (domesticInternational === "International") {
          filtered = filtered.filter((item) => item.country !== "한국");
        }
        //필터링된 데이터를 상태에 저장한다
        setPageData(filtered);
        //페이지 제목을 변경한다
        setWhereAreYou(
          domesticInternational === "International" ? "해외 여행 메이트 페이지" : "국내 여행 메이트 페이지"
        );
        //페이지 전환버튼을 변경한다
        setPageTurn(domesticInternational === "International" ? "to Domestic" : "to International");
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  // 해외 / 국내 전환시 호출
  useEffect(() => {
    fetchFilteredPosts();
  }, [domesticInternational]);

  // -------------이벤트 관리부
  const search = () => {
    fetchFilteredPosts(); // 비동기 처리를 기다리지 않음
  };

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
      condition: searchCriteria.condition,
      keyword: searchCriteria.keyword,
      di: domesticInternational,
    });

    search();
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value); // 정렬 기준 변경
    // 정렬 기준에 따라 pageData를 정렬
    const sortedData = [...pageData].sort((a, b) => {
      if (e.target.value === "latest") {
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      } else if (e.target.value === "viewCount") {
        return b.viewCount - a.viewCount;
      } else if (e.target.value === "likeCount") {
        return b.likeCount - a.likeCount;
      }
      return 0; // 기본값
    });
  };

  // 페이지 이동 핸들러
  const paginate = (pageNum) => {
    setCurrentPage(pageNum);
    setSearchParams({ ...searchParams, pageNum });
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
                <Link to={`/posts/community/${item.id}/detail`}>{item.title}</Link>
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
  );
}
export default CommunityBoard;
