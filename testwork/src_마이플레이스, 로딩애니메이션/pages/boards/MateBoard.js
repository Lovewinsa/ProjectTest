import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart, faMessage } from "@fortawesome/free-solid-svg-icons";

function MateBoard() {
  //배열 안에서 객체로 관리
  const [pageData, setPageData] = useState([]);
  const [mark, setMark] = useState([]);

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

  // 달력에서 선택된 날짜 범위 저장
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // 캘린더 표시 여부 상태

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

  // 날짜 초기화
  const handleDateReset = () => {
    setSelectedDateRange([null, null]); // 날짜 범위를 현재 날짜로 초기화
    setSearchCriteria({
      ...searchCriteria,
      startDate: "", // 시작 날짜 초기화
      endDate: "", // 종료 날짜 초기화
    });
  };
  // 현재 날짜로 돌아오는 함수 추가
  const handleTodayClick = () => {
    const today = new Date();
    setSelectedDateRange([today, today]); // 현재 날짜로 설정
    setSearchCriteria({
      ...searchCriteria,
      startDate: today.toLocaleDateString("ko-KR"),
      endDate: today.toLocaleDateString("ko-KR"),
    });
  };
  // 달력에서 날짜를 선택할 때 호출되는 함수
  const handleDateChange = (dateRange) => {
    setSelectedDateRange(dateRange);
    setIsCalendarOpen(false); // 날짜 선택 후 캘린더 닫기
    setSearchCriteria({
      ...searchCriteria,
      startDate: dateRange[0] ? dateRange[0].toLocaleDateString("ko-KR") : "",
      endDate: dateRange[1] ? dateRange[1].toLocaleDateString("ko-KR") : "",
    });
  };

  // searchParams 가 바뀔때마다 실행된다.
  // searchParams 가 없다면 초기값 "Domestic" 있다면 di 란 key 값의 데이터를 domesticInternational에 전달한다
  useEffect(() => {
    const diValue = searchParams.get("di") || "Domestic"; // 국내/국제 값 가져오기
    const city = searchParams.get("city") || ""; // 도시 가져오기
    const startDate = searchParams.get("startDate") || ""; // 시작 날짜 가져오기
    const endDate = searchParams.get("endDate") || ""; // 종료 날짜 가져오기
    const country = searchParams.get("country") || ""; // 국가 가져오기
    const keyword = searchParams.get("keyword") || "";

    setDomesticInternational(diValue);
    setSearchCriteria({ city, startDate, endDate, country, keyword, condition: searchCriteria.condition }); // 검색 조건 설정
    // 국내/국제 값 업데이트
  }, [searchParams]);

  // domesticInternational 가 바뀔때마다 실행된다.
  // to D~ I~ Button 을 누를때 or 새로운 요청이 들어왔을때
  useEffect(() => {
    axios
      .get("/api/v1/posts/mate")
      .then((res) => {
        const filtered = res.data.list.filter((item) => {
          const matchesDomesticInternational =
            domesticInternational === "Domestic" ? item.country === "한국" : item.country !== "한국";
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

          // 선택한 startDate와 endDate 범위에 포함되는 항목만 필터링
          const matchesDateRange = (item) => {
            const itemStartDate = new Date(item.startDate);
            const itemEndDate = new Date(item.endDate);
            const searchStartDate = searchCriteria.startDate ? new Date(searchCriteria.startDate) : null;
            const searchEndDate = searchCriteria.endDate ? new Date(searchCriteria.endDate) : null;

            // 검색 범위의 날짜가 설정되지 않았으면 모든 게시물 표시
            if (!searchStartDate && !searchEndDate) {
              return true;
            }

            // 검색 범위에 날짜가 설정되었을 경우 날짜 범위 체크
            return (
              (itemStartDate < searchEndDate && itemEndDate > searchStartDate) ||
              (itemStartDate <= searchStartDate && itemEndDate >= searchStartDate) ||
              (itemStartDate <= searchEndDate && itemEndDate >= searchEndDate)
            );
          };

          // 필터링 적용
          if (!matchesDateRange(item)) return false;

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
        setWhereAreYou(domesticInternational === "Domestic" ? "국내 여행 메이트 페이지" : "해외 여행 메이트 페이지");
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
      startDate: searchCriteria.startDate,
      endDate: searchCriteria.endDate,
      keyword: searchCriteria.keyword,
      di: domesticInternational,
    });
  };
  const handleSortChange = (e) => {
    setSortBy(e.target.value); // 정렬 기준 변경
  };

  return (
    <div className="container mx-auto p-4">
      <Link to={{ pathname: "/posts/mate/new", search: `?di=${domesticInternational}` }}>새글 작성</Link>
      <button className="border border-1 bg-light-green-200" onClick={handleButtonClick}>
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

          {/* 캘린더 표시 여부에 따라 렌더링 */}
          {isCalendarOpen && (
            <div className="absolute z-50 bg-white shadow-lg p-2">
              <Calendar
                selectRange={true}
                onChange={handleDateChange}
                value={selectedDateRange || [new Date(), new Date()]} // 초기값 또는 선택된 날짜 범위
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
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">{`#${item.country}`}</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">{`#${item.city}`}</span>
                  {item.tags &&
                    item.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
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
                {
                  item.updatedAt ? <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">update</span> : <span className="px-8"></span>
                }
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
  );
}

export default MateBoard;
