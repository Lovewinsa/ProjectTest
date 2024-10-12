import axios from "axios"
import moment from "moment/moment"
import { useEffect, useRef, useState } from "react"
import Calendar from "react-calendar"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import LoadingAnimation from "../../components/LoadingAnimation"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

function CourseBoard() {
    const [loading, setLoading] = useState(false)
    const [pageInfo, setPageInfo] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [isFetching, setIsFetching] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams()
    const [searchCriteria, setSearchCriteria] = useState({
        country: "",
        city: "",
        startDate: "",
        endDate: "",
        keyword: "",
        condition: "title",
    })

    const [domesticInternational, setDomesticInternational] = useState("Domestic")
    const [pageTurn, setPageTurn] = useState("")
    const [desiredCountry, setDesiredCountry] = useState(null)
    const [sortBy, setSortBy] = useState("latest")
    const [selectedDateRange, setSelectedDateRange] = useState([null, null])
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const calendarRef = useRef(null)

    const observerRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setIsCalendarOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const fetchFilteredPosts = (pageNum = 1) => {
        setLoading(true)
        const params = {
            country: searchCriteria.country || null,
            city: searchCriteria.city || null,
            startDate: searchCriteria.startDate || null,
            endDate: searchCriteria.endDate || null,
            keyword: searchCriteria.keyword || null,
            condition: searchCriteria.condition || null,
            sortBy,
            pageNum,
            pageSize: 12,
        }

        axios
            .get("/api/v1/posts/course", { params })
            .then((res) => {
                let filtered = res.data.list

                if (domesticInternational === "Domestic") {
                    filtered = filtered.filter((item) => item.country === "대한민국")
                } else if (domesticInternational === "International") {
                    filtered = filtered.filter((item) => item.country !== "대한민국")
                }

                setPageInfo((prevInfo) => [...prevInfo, ...filtered])
                setTotalPages(res.data.totalPostPages)
                setDesiredCountry(domesticInternational === "Domestic" ? "국내여행 코스 페이지" : "해외여행 코스 페이지")
                setPageTurn(domesticInternational === "Domestic" ? "해외로" : "국내로")
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        setPageInfo([])
        setCurrentPage(1)
        fetchFilteredPosts(1)
    }, [domesticInternational])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const target = entries[0]
            if (target.isIntersecting && !isFetching && currentPage < totalPages) {
                setIsFetching(true)
                setCurrentPage((prevPage) => prevPage + 1)
            }
        })
        if (observerRef.current) {
            observer.observe(observerRef.current)
        }

        // currentPage가 변경될 때마다 fetchFilteredPosts를 호출
        if (currentPage > 1) {
            fetchFilteredPosts(currentPage);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current)
            }
        }
    }, [isFetching, currentPage, totalPages])

    const handleDesiredCountry = () => {
        const newDomesticInternational = domesticInternational === "International" ? "Domestic" : "International"
        setDomesticInternational(newDomesticInternational)
        setSearchParams({
            ...searchCriteria,
            di: newDomesticInternational,
        })
    }

    // 검색 핸들러
    const handleSearch = () => {
        setPageInfo([]) // 새로운 검색 시 데이터 초기화
        setCurrentPage(1) // 페이지 초기화
        fetchFilteredPosts(1) // 첫 페이지 데이터 다시 불러오기
    }

    const handleSortChange = (e) => {
        const newSortBy = e.target.value
        setSortBy(newSortBy)
        
        let sortedData = [...pageInfo]
        if (newSortBy === "latest") {
            sortedData.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        } else if (newSortBy === "viewCount") {
            sortedData.sort((a, b) => b.viewCount - a.viewCount)
        } else if (newSortBy === "likeCount") {
            sortedData.sort((a, b) => b.likeCount - a.likeCount)
        }
        setPageInfo(sortedData)
    }

    const handleConditionChange = (e) => {
        setSearchCriteria({
            ...searchCriteria,
            condition: e.target.value,
            keyword: "",
        })
    }

    const handleSearchChange = (e) => {
        const { name, value } = e.target
        setSearchCriteria({ ...searchCriteria, [name]: value })
    }

    const handleQueryChange = (e) => {
        const value = e.target.value
        setSearchCriteria({
            ...searchCriteria,
            keyword: value,
        })
    }

    const handleDateReset = () => {
        setSelectedDateRange([null, null])
        setSearchCriteria({
            ...searchCriteria,
            startDate: "",
            endDate: "",
        })
    }

    const handleDateChange = (dateRange) => {
        setSelectedDateRange(dateRange)
        setIsCalendarOpen(false)
        setSearchCriteria({
            ...searchCriteria,
            startDate: dateRange[0] ? dateRange[0].toLocaleDateString("ko-KR") : "",
            endDate: dateRange[1] ? dateRange[1].toLocaleDateString("ko-KR") : "",
        })
    }

    const tileClassName = ({ date }) => {
        const day = date.getDay()
        let className = "text-black"
        if (day === 0 || day === 6) {
            className = "text-red-500"
        }
        return className
    }

    const handlePostClick = (id) => {
        navigate(`/posts/course/${id}/detail?di=${domesticInternational}`)
    }

    const getImageFileName = (city, country) => {
        const cityMapping = {
            서울: "KOR_Seoul_01",
            부산: "KOR_Busan_01",
            제주: "KOR_Jeju_01",
            도쿄: "JPN_Tokyo_01",
            오사카: "JPN_Osaka_01",
        }

        const countryMapping = {
            대한민국: "KOR_01",
            일본: "JPN_01",
        }

        if (city && cityMapping[city]) {
            return cityMapping[city]
        } else if (country && countryMapping[country]) {
            return countryMapping[country]
        } else {
            return "defaultImage"
        }
    }

    const getTimeDifference = (createdAt, updatedAt) => {
        const postDate = new Date(updatedAt ? updatedAt : createdAt)
        const now = new Date()
        const timeDiff = now - postDate
        const diffInMinutes = Math.floor(timeDiff / (1000 * 60))
        const diffInHours = Math.floor(timeDiff / (1000 * 60 * 60))
        const diffInDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24))

        if (diffInMinutes < 60) {
            return `${diffInMinutes}분 전`
        } else if (diffInHours < 24) {
            return `${diffInHours}시간 전`
        } else {
            return `${diffInDays}일 전`
        }
    }

    return (
        <div className="container mx-auto p-4 max-w-[1024px]">
            {loading && <LoadingAnimation />}
            <div className="container mx-auto">
                <div className="flex justify-between mb-4">
                    <Link
                        to={{
                            pathname: "/posts/course/new",
                            search: `?di=${domesticInternational}&status=PUBLIC`,
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
                <h1 className="text-3xl font-bold text-center mb-8">{desiredCountry}</h1>

                {/* 검색 조건 입력 폼 */}
                <div className="my-4 space-y-4">
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
                            <option value="content">내용</option>
                            <option value="title_content">제목 + 내용</option>
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

                        <div ref={calendarRef}>
                            {isCalendarOpen && (
                                <div className="absolute z-50 bg-white shadow-lg p-2">
                                    <button
                                        onClick={handleDateReset}
                                        className="text text-sm absolute top-8 right-20 bg-tripDuoGreen text-white px-2 py-1 rounded hover:bg-green-700 transition duration-150"
                                    >
                                        today
                                    </button>
                                    <Calendar
                                        selectRange={true}
                                        className="w-full p-4 bg-white rounded-lg border-none"
                                        onChange={handleDateChange}
                                        value={selectedDateRange || [new Date(), new Date()]}
                                        minDetail="month"
                                        maxDetail="month"
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
                        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition-all duration-300 mt-4"
                    >
                        검색
                    </button>
                </div>

                {/* 검색 정렬 기준 */}
                <div className="my-4">
                    <label htmlFor="sortBy" className="mr-2">
                        정렬 기준:
                    </label>
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
                    {pageInfo.map((post) => {
                        const imageFileName = getImageFileName(post.city, post.country)
                        const imagePath = `/img/countryImages/${imageFileName}.jpg`
                        return (
                            <div
                                key={post.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer border border-green-600 hover:scale-105 transition duration-300 hover:shadow-xl"
                                onClick={() => handlePostClick(post.id)}
                            >
                                <img src={imagePath || "/placeholder.jpg"} alt={post.title} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h2 className="text-lg font-bold">{post.title}</h2>
                                    <p className="text-sm text-gray-600">작성자: {post.writer}</p>
                                    <p className="text-sm text-gray-600">
                                        작성일: {getTimeDifference(post.createdAt, post.updatedAt)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {post.startDate === null
                                            ? ""
                                            : new Date(post.startDate).toLocaleDateString("ko-KR", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                            })}
                                        {post.endDate === null
                                            ? ""
                                            : ` ~ ${new Date(post.endDate).toLocaleDateString("ko-KR", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                            })}`}
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
                                                    <span
                                                        key={index}
                                                        className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* 무한 스크롤 트리거 */}
                <div ref={observerRef}></div>
            </div>
        </div>
    )

}

export default CourseBoard
