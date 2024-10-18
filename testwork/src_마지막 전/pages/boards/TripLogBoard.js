import axios from "axios";
import moment from "moment/moment";
import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import LoadingAnimation from "../../components/LoadingAnimation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function TripLogBoard() {
    //로딩 상태 추가
    const [loading, setLoading] = useState(false)
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
    const [sortBy, setSortBy] = useState("latest"); // 정렬 기준 초기값 설정

    // 달력에서 선택된 날짜 범위 저장
    const [selectedDateRange, setSelectedDateRange] = useState([null, null])
    // 캘린더 표시 여부 상태
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const calendarRef = useRef(null)

    //무한 스크롤 트리거
    const observerRef = useRef(null)

    const navigate = useNavigate()

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

    useEffect(() => {
        // 로딩 애니메이션을 0.5초 동안만 표시
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 700)
        let pageNum = searchParams.get("pageNum") || 1
        const diValue = searchParams.get("di") || "Domestic"
        const city = searchParams.get("city") || ""
        const startDate = searchParams.get("startDate") || ""
        const endDate = searchParams.get("endDate") || ""
        const country = searchParams.get("country") || ""
        const keyword = searchParams.get("keyword") || ""

        setCurrentPage(Number(pageNum))
        setDomesticInternational(diValue)

        setSearchCriteria({ city, startDate, endDate, country, keyword, condition: searchCriteria.condition })

    }, [searchParams])

    // 검색 필터 + 국내/해외 필터
    const fetchFilteredPosts = (pageNum = 1) => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 700)

        const params = {
            di: domesticInternational || null,
            country: searchCriteria.country || null,
            city: searchCriteria.city || null,
            startDate: searchCriteria.startDate || null,
            endDate: searchCriteria.endDate || null,
            keyword: searchCriteria.keyword || null,
            condition: searchCriteria.condition || null,
            sortBy,
            pageNum,
            pageSize: 12
        }

        axios
            .get("/api/v1/posts/trip_log", { params })
            .then((res) => {
                //필터링되어 돌아온 데이터
                let filtered = res.data.list

                //국내 해외 필터링
                if (domesticInternational === "Domestic") {
                    filtered = filtered.filter((item) => item.country === "대한민국")
                } else if (domesticInternational === "International") {
                    filtered = filtered.filter((item) => item.country !== "대한민국")
                }

                // 국내/해외에 따라 상태 값 관리
                setPageInfo((prevInfo) => {
                    const combinedPosts = [
                        ...prevInfo.filter((item) =>
                            (domesticInternational === "Domestic" ? item.country === "대한민국" : item.country !== "대한민국")
                        ),
                        ...filtered
                    ]

                    // 중복 제거 (id를 기준으로)
                    const uniquePosts = combinedPosts.reduce((acc, currentPost) => {
                        if (!acc.some(post => post.id === currentPost.id)) {
                            acc.push(currentPost)
                        }
                        return acc
                    }, [])

                    return uniquePosts
                })

                let tempStr = ""
                if (domesticInternational === "Domestic") {
                    tempStr = "국내 여행 코스"
                } else if (domesticInternational === "International") {
                    tempStr = "해외 여행 코스"
                }
                setDesiredCountry(`${tempStr}`)

                setTotalPages(res.data.totalPostPages)
                setPageTurn(domesticInternational === "Domestic" ? "해외로" : "국내로")
            })
            .catch((error) => {
                console.log(error)
            })
    }

    // 해외 / 국내 전환시 호출
    useEffect(() => {
        setPageInfo([])
        setCurrentPage(1)
        fetchFilteredPosts(1)
    }, [domesticInternational])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const target = entries[0]
            if (target.isIntersecting && currentPage < totalPages) {
                setCurrentPage((prevPage) => prevPage + 1)
            }
        })
        if (observerRef.current) {
            observer.observe(observerRef.current)
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current)
            }
        }
    }, [currentPage, totalPages])

    useEffect(() => {
        if (currentPage > 1) {
            fetchFilteredPosts(currentPage)
        }
    }, [currentPage])

    //국내, 해외 선택 이벤트
    const handleDesiredCountry = () => {
        const newDomesticInternational = domesticInternational === "International" ? "Domestic" : "International"
        setDomesticInternational(newDomesticInternational)
        setSearchParams({
            ...searchCriteria,
            di: newDomesticInternational,
        })
    }

    // 새로운 검색을 시작하는 함수
    const handleSearch = () => {
        setPageInfo([]) // 새로운 검색 시 데이터 초기화
        setCurrentPage(1) // 페이지 초기화
        fetchFilteredPosts(1) // 첫 페이지 데이터 다시 불러오기
    }

    // 정렬 기준 변경
    const handleSortChange = (e) => {
        const newSortBy = e.target.value
        setSortBy(e.target.value)

        // 정렬 기준에 따라 pageData를 정렬
        let sortedData = [...pageInfo]
        if (newSortBy === "latest") {
            sortedData.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        } else if (newSortBy === "viewCount") {
            sortedData.sort((a, b) => b.viewCount - a.viewCount)
        } else if (newSortBy === "likeCount") {
            sortedData.sort((a, b) => b.likeCount - a.likeCount)
        }
        setPageInfo(sortedData) // 정렬된 데이터를 상태에 저장
    }

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

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    // 날짜 초기화
    const handleDateReset = () => {
        setSelectedDateRange([null, null]) // 날짜 범위를 현재 날짜로 초기화
        setSearchCriteria({
            ...searchCriteria,
            startDate: "", // 시작 날짜 초기화
            endDate: "",   // 종료 날짜 초기화
        })
    }

    // 달력에서 날짜를 선택할 때 호출되는 함수
    const handleDateChange = (dateRange) => {
        setSelectedDateRange(dateRange)
        // 날짜 선택 후 캘린더 닫기
        setIsCalendarOpen(false)
        setSearchCriteria({
            ...searchCriteria,
            startDate: dateRange[0] ? dateRange[0].toLocaleDateString('ko-KR') : "",
            endDate: dateRange[1] ? dateRange[1].toLocaleDateString('ko-KR') : "",
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
        navigate(`/posts/trip_log/${id}/detail?di=${domesticInternational}`)
    }

    // city 또는 country 값에 따른 이미지 파일명 변환 함수
    const getImageFileName = (city, country) => {
        const cityMapping = {
            // 대한민국
            "서울": "KOR_Seoul_01",
            "부산": "KOR_Busan_01",
            "제주": "KOR_Jeju_01",
            "인천": "KOR_Incheon_01",
            // 일본
            "도쿄": "JPN_Tokyo_01",
            "오사카": "JPN_Osaka_01",
            "교토": "JPN_Kyoto_01",
            "삿포로": "JPN_Sapporo_01",
            // 중국
            "베이징": "CHN_Beijing_01",
            "상하이": "CHN_Shanghai_01",
            "광저우": "CHN_Guangzhou_01",
            "시안": "CHN_Xian_01",
            // 인도
            "델리": "IND_Delhi_01",
            "뭄바이": "IND_Mumbai_01",
            "콜카타": "IND_Kolkata_01",
            "벵갈루루": "IND_Bengaluru_01",
            // 스페인
            "바르셀로나": "ESP_Barcelona_01",
            "그라나다": "ESP_Granada_01",
            "마드리드": "ESP_Madrid_01",
            "세비야": "ESP_Seville_01",
            // 영국
            "런던": "GBR_London_01",
            "맨체스터": "GBR_Manchester_01",
            "버밍엄": "GBR_Birmingham_01",
            "리버풀": "GBR_Liverpool_01",
            // 독일
            "베를린": "DEU_Berlin_01",
            "뮌헨": "DEU_Munich_01",
            "프랑크푸르트": "DEU_Frankfurt_01",
            "함부르크": "DEU_Hamburg_01",
            // 프랑스
            "파리": "FRA_Paris_01",
            "마르세유": "FRA_Marseille_01",
            "리옹": "FRA_Lyon_01",
            "니스": "FRA_Nice_01",
            // 이탈리아
            "로마": "ITA_Roma_01",
            "밀라노": "ITA_Milano_01",
            "베네치아": "ITA_Venezia_01",
            "피렌체": "ITA_Firenze_01",
            // 미국
            "뉴욕": "USA_NewYork_01",
            "로스앤젤레스": "USA_LosAngeles_01",
            "시카고": "USA_Chicago_01",
            "마이애미": "USA_Miami_01",
            // 캐나다
            "토론토": "CAN_Toronto_01",
            "밴쿠버": "CAN_Vancouver_01",
            "몬트리올": "CAN_Montreal_01",
            "오타와": "CAN_Ottawa_01",
            // 브라질
            "상파울루": "BRA_SaoPaulo_01",
            "리우데자네이루": "BRA_RioDeJaneiro_01",
            "브라질리아": "BRA_Brasilia_01",
            "살바도르": "BRA_Salvador_01",
            // 호주
            "시드니": "AUS_Sydney_01",
            "멜버른": "AUS_Melbourne_01",
            "브리즈번": "AUS_Brisbane_01",
            "퍼스": "AUS_Perth_01",
            // 러시아
            "모스크바": "RUS_Moscow_01",
            "상트페테르부르크": "RUS_SaintPetersburg_01",
            "노보시비르스크": "RUS_Novosibirsk_01",
            "예카테린부르크": "RUS_Yekaterinburg_01",
            // 남아프리카 공화국
            "케이프타운": "ZAF_CapeTown_01",
            "요하네스버그": "ZAF_Johannesburg_01",
            "더반": "ZAF_Durban_01",
            "프리토리아": "ZAF_Pretoria_01",
        };

        const countryMapping = {
            "대한민국": "KOR_01",
            "일본": "JPN_01",
            "중국": "CHN_01",
            "인도": "IND_01",
            "스페인": "ESP_01",
            "영국": "GBR_01",
            "독일": "DEU_01",
            "프랑스": "FRA_01",
            "이탈리아": "ITA_01",
            "미국": "USA_01",
            "캐나다": "CAN_01",
            "브라질": "BRA_01",
            "호주": "AUS_01",
            "러시아": "RUS_01",
            "남아프리 카공화국": "ZAF_01",
        };

        // city 값이 있으면 city에 맞는 이미지, 없으면 country에 맞는 이미지 반환
        if (city && cityMapping[city]) {
            return cityMapping[city];
        } else if (country && countryMapping[country]) {
            return countryMapping[country];
        } else {
            return "defaultImage"; // 매핑되지 않은 경우 기본값 처리
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-[1024px]">
            {/* 로딩 애니메이션 */}
            {loading && <LoadingAnimation />}
            <div className="container mx-auto">
                <div className="flex justify-between mb-4">
                    <button
                        onClick={() => {
                            window.location.href = `/posts/trip_log/new?di=${domesticInternational}&status=PUBLIC`
                        }}
                        className="bg-tripDuoMint font-bold text-white px-4 py-2 text-sm rounded-md shadow-md hover:bg-tripDuoGreen transition-all duration-300 flex items-center">
                        여행기록 작성
                    </button>
                    <button
                        onClick={handleDesiredCountry}
                        className="bg-tripDuoMint font-bold text-white px-4 py-2 text-sm rounded-md shadow-md hover:bg-tripDuoGreen transition-all duration-300 flex items-center">
                        {pageTurn}
                    </button>
                </div>
                <h1 className="font-bold mb-4">{desiredCountry}</h1>

                {/* 검색 조건 입력 폼 */}
                <div className="my-4 space-y-4 p-4 w-full md:w-1/2 bg-white rounded-lg shadow-md shadow-tripDuoMint border border-tripDuoGreen">
                    {/* 제목/작성자 선택 필드 */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <select
                            value={searchCriteria.condition}
                            onChange={handleConditionChange}
                            className="border border-tripDuoGreen text-sm rounded-md px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-tripDuoMint transition-all duration-300">
                            <option value="title">제목</option>
                            <option value="content">내용</option>
                            <option value="title_content">제목 및 내용</option>
                        </select>

                        <input
                            type="text"
                            name={searchCriteria.condition}
                            value={searchCriteria[searchCriteria.condition]}
                            onChange={handleQueryChange}
                            placeholder={searchCriteria.condition}
                            onKeyDown={handleKeyDown}
                            className="border border-tripDuoGreen text-sm rounded-md px-4 py-2 w-full md:w-2/3 focus:outline-none focus:ring-2 focus:ring-tripDuoMint transition-all duration-300"
                        />
                    </div>

                    {/* 국가와 도시를 한 행으로 배치 */}
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                        {domesticInternational === "International" && (
                            <input
                                type="text"
                                name="country"
                                value={searchCriteria.country}
                                onChange={handleSearchChange}
                                onKeyDown={handleKeyDown}
                                placeholder="국가"
                                className="border text-sm border-tripDuoGreen rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-tripDuoMint transition-all duration-300"
                            />
                        )}

                        <input
                            type="text"
                            name="city"
                            value={searchCriteria.city}
                            onChange={handleSearchChange}
                            onKeyDown={handleKeyDown}
                            placeholder="도시"
                            className="border text-sm border-tripDuoGreen rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-tripDuoMint transition-all duration-300"
                        />

                        {/* 날짜 선택 및 검색 버튼 */}
                        <button
                            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                            className="bg-tripDuoMint text-white font-bold px-4 py-2 text-sm rounded-md shadow-md hover:bg-tripDuoGreen transition-all duration-300 flex items-center">
                            <span className="whitespace-nowrap">
                                {selectedDateRange[0] && selectedDateRange[1]
                                    ? `${selectedDateRange[0].getFullYear().toString().slice(-2)}${(selectedDateRange[0].getMonth() + 1)
                                        .toString()
                                        .padStart(2, "0")}${selectedDateRange[0]
                                            .getDate()
                                            .toString()
                                            .padStart(2, "0")} / ${selectedDateRange[1].getFullYear().toString().slice(-2)}${(
                                                selectedDateRange[1].getMonth() + 1
                                            )
                                                .toString()
                                                .padStart(2, "0")}${selectedDateRange[1].getDate().toString().padStart(2, "0")}`
                                    : "날짜 선택"}
                            </span>
                        </button>

                        {/* 캘린더 표시 여부에 따라 렌더링 */}
                        <div ref={calendarRef}>
                            {isCalendarOpen && (
                                <div className="absolute z-50 bg-white shadow-lg p-2">
                                    <button
                                        onClick={handleDateReset}
                                        className="text text-sm absolute top-8 right-20 bg-tripDuoGreen text-white px-2 py-1 rounded hover:bg-green-700 transition duration-150">
                                        today
                                    </button>
                                    <Calendar
                                        selectRange={true}
                                        className="w-full p-4 bg-white rounded-lg border-none"
                                        onChange={handleDateChange}
                                        value={selectedDateRange || [new Date(), new Date()]}
                                        minDetail="month"
                                        maxDetail="month"
                                        navigationLabel={null}
                                        showNeighboringMonth={false}
                                        calendarType="hebrew"
                                        tileClassName={tileClassName}
                                        formatYear={(locale, date) => moment(date).format("YYYY")}
                                        formatMonthYear={(locale, date) => moment(date).format("YYYY. MM")}
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
                                                    {date.getDate()}
                                                </span>
                                            )
                                        }}
                                        formatDay={() => null}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end w-full items-center">
                            <button
                                onClick={handleSearch}
                                className="font-bold bg-tripDuoMint text-white px-4 py-2 text-sm rounded-md shadow-md hover:bg-tripDuoGreen transition-all duration-300">
                                검색
                            </button>
                        </div>
                    </div>
                </div>

                {/* 검색 정렬 기준 다운바 */}
                <div className="my-4">
                    <select
                        id="sortBy"
                        value={sortBy}
                        onChange={handleSortChange}
                        className="flex justify-start w-full md:w-1/6 border border-tripDuoGreen text-sm rounded-md px-5 py-2 focus:outline-none focus:ring-2 focus:ring-tripDuoMint transition-all duration-300">
                        <option value="latest">최신순</option>
                        <option value="viewCount">조회수순</option>
                        <option value="likeCount">좋아요순</option>
                    </select>
                </div>

                {/* 카드 리스트 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {pageInfo.map((post) => {
                        // 변환된 city 또는 country 값을 사용하여 이미지 경로 설정
                        const imageFileName = getImageFileName(post.city, post.country);
                        const imagePath = `/img/countryImages/${imageFileName}.jpg`;
                        return (
                            <div
                                key={post.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer border border-green-600 hover:scale-105 transition duration-300 hover:shadow-xl"
                                onClick={() => handlePostClick(post.id)}
                            >
                                {/* post.image가 없으면 cityImagePath 사용 */}
                                <img
                                    src={imagePath || "/placeholder.jpg"}
                                    alt={post.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="text-lg font-bold">{post.title}</h2>
                                    <p className="text-sm text-gray-600">작성자: {post.writer}</p>
                                    <p className="text-sm text-gray-600">작성일: {getTimeDifference(post.createdAt, post.updatedAt)}</p>
                                    <p className="text-sm text-gray-600">
                                        {post.startDate === null ? "설정하지 않았습니다." : new Date(post.startDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                        {post.endDate === null ? "" : ` ~ ${new Date(post.endDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}`}
                                    </p>
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
                        );
                    })}
                </div>

                {/* 무한 스크롤 트리거 */}
                <div ref={observerRef}></div>
            </div>
        </div>
    );
}

export default TripLogBoard