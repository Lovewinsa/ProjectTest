import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import CourseKakaoMapComponent from "../../components/CourseKakaoMapComponent";
import CourseGoogleMapComponent from "../../components/CourseGoogleMapComponent";
import LoadingAnimation from "../../components/LoadingAnimation";
import { citiesByCountry } from "../../constants/mapping";


const TripLogBoardEditForm = () => {
    //로딩 상태 추가
    const [loading, setLoading] = useState(false)
    const [selectedDayIndex, setSelectedDayIndex] = useState(null)
    const [selectedPlaceIndex, setSelectedPlaceIndex] = useState(null)
    const [savedPlaces, setSavedPlaces] = useState([])
    const [isSelectPlace, setIsSelectPlace] = useState(false)

    const [searchParams] = useSearchParams()
    const domesticInternational = searchParams.get("di") || "Domestic"
    const status = searchParams.get("status") || "PUBLIC"

    // postInfo 하나의 state로 통합 관리
    const [postInfo, setPostInfo] = useState({
        id: "",
        userId: "",
        writer: "",
        type: "TRIP_LOG",
        title: "",
        postData: [{ places: [], dayMemo: "" }],
        country: "",
        city: "",
        tags: [],
        status: status
    })
    const [tagInput, setTagInput] = useState("")

    const navigate = useNavigate()
    const { id } = useParams()  // URL에서 게시물 ID를 가져옴

    const cities = citiesByCountry[postInfo.country] || []

    useEffect(() => {
        // 로딩 애니메이션을 0.5초 동안만 표시
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 700)
        // 기존 게시물 데이터를 가져와 초기화
        axios.get(`/api/v1/posts/${id}/update`)
            .then((res) => {
                setPostInfo(res.data)
            })
            .catch((error) => console.log(error))
    }, [id])

    //태그 입력
    const handleTagInput = (e) => {
        const value = e.target.value

        // 태그 길이 15자로 제한
        if (value.length > 15) {
            alert("태그는 최대 15자까지 입력 가능합니다.");
            return
        }

        setTagInput(value)

        if (value.endsWith(" ") && value.trim() !== "") {
            const newTag = value.trim()

            //조건: #으로 시작, 중복 방지, # 단독 입력 방지
            if (newTag !== "#" && newTag.startsWith("#") && !postInfo.tags.includes(newTag)) {
                // 태그 최대 6개로 제한
                if (postInfo.tags.length >= 6) {
                    alert("태그는 최대 6개까지 추가할 수 있습니다.")
                    return
                }

                setPostInfo((prev) => ({
                    ...prev,
                    tags: [...prev.tags, newTag]
                }))
                e.target.value = ""
            }
        }
    }

    //태그 지우기 버튼
    const removeTag = (tagToRemove) => {
        setPostInfo((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove)
        }))
    }

    // 날짜 계산 함수
    const calculateDate = (startDate, dayIndex) => {
        const date = new Date(startDate)
        date.setDate(date.getDate() + dayIndex) // 시작 날짜에 dayIndex 만큼 더함
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
    }

    //Day 추가 버튼
    const addDay = () => {
        setPostInfo((prev) => ({
            ...prev,
            postData: [...prev.postData, { places: [{ place_name: "", placeMemo: "" }], dayMemo: "" }]
        }));
    };

    //Day 삭제 버튼
    const removeDay = (dayIndex) => {
        if (postInfo.postData.length > 1) {
            setPostInfo((prev) => ({
                ...prev,
                postData: prev.postData.filter((_, index) => index !== dayIndex)
            }))
        }
    }

    //장소 추가 버튼
    const addPlace = (dayIndex) => {
        const newDays = [...postInfo.postData]
        newDays[dayIndex].places.push("")
        setPostInfo((prev) => ({
            ...prev,
            postData: newDays
        }))
    }

    //장소 삭제 버튼
    const removePlace = (dayIndex, placeIndex) => {
        const newDays = [...postInfo.postData]

        if (newDays[dayIndex].places.length > 1) {
            // 장소 데이터가 2개 이상일 때 UI와 장소 데이터를 모두 삭제
            newDays[dayIndex].places.splice(placeIndex, 1)
        } else {
            // 장소 데이터가 1개일 때 UI는 남기고 장소 데이터만 삭제
            newDays[dayIndex].places[placeIndex] = ""
        }

        setPostInfo((prev) => ({
            ...prev,
            postData: newDays
        }))
    }

    //장소 선택 버튼
    const handlePlaceSelection = (dayIndex, placeIndex) => {
        setSelectedDayIndex(dayIndex)
        setSelectedPlaceIndex(placeIndex)
        setIsSelectPlace(true)
    }

    //장소 저장 버튼
    const handleSavePlace = (place) => {
        if (place && isSelectPlace) {
            const newDays = [...postInfo.postData]
            const currentPlace = newDays[place.dayIndex].places[place.placeIndex]
            const updatedPlace = {
                ...place,
                placeMemo: currentPlace.placeMemo || "",
            }

            newDays[place.dayIndex].places[place.placeIndex] = updatedPlace
            setPostInfo((prev) => ({
                ...prev,
                postData: newDays
            }))
            setSavedPlaces([...savedPlaces, updatedPlace])
            setIsSelectPlace(false)
        }
    }

    //Day 메모
    const handleDayMemoChange = (dayIndex, memo) => {
        const newDays = [...postInfo.postData]
        newDays[dayIndex].dayMemo = memo
        setPostInfo((prev) => ({
            ...prev,
            postData: newDays
        }))
    }

    //수정 완료 버튼
    const handleSubmit = () => {
        if (!postInfo.title) {
            alert("제목을 입력해주세요.");
            return;
        }

        if (!postInfo.country) {
            alert("나라를 선택해주세요.");
            return;
        }

        axios.put(`/api/v1/posts/${id}`, postInfo)  // PUT 요청으로 업데이트
            .then((res) => {
                alert("수정했습니다")
                // 업데이트 후 해당글 자세히보기로 이동
                navigate(`/posts/trip_log/${id}/detail?di=${domesticInternational}`)
            })
            .catch((error) => console.log(error))
    }


    return (
        <div className="container mx-auto p-6 max-w-[900px]">
            {/* 로딩 애니메이션 */}
            {loading && <LoadingAnimation />}
            <div className="flex flex-col h-full bg-white p-6 shadow-lg rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-semibold text-gray-800">여행기록 수정</h1>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => navigate(`/posts/trip_log/${id}/detail?di=${domesticInternational}`)}
                            className="text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full text-sm px-5 py-2">
                            게시글로 돌아가기
                        </button>
                        <button
                            className="text-white bg-indigo-600 hover:bg-indigo-500 rounded-full text-sm px-5 py-2"
                            onClick={handleSubmit}>
                            수정 완료
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-lg font-medium text-gray-700">
                            제목
                        </label>
                        <input
                            className="border-gray-300 rounded-md p-2 w-full"
                            type="text"
                            id="title"
                            value={postInfo.title}
                            onChange={(e) =>
                                setPostInfo((prev) => ({ ...prev, title: e.target.value }))
                            }
                            maxLength={50}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="country" className="block text-lg font-medium text-gray-700">
                                나라
                            </label>
                            <select
                                className="border-gray-300 rounded-md p-2 w-full"
                                id="country"
                                value={postInfo.country}
                                onChange={(e) =>
                                    setPostInfo((prev) => ({ ...prev, country: e.target.value }))
                                }
                            >
                                {domesticInternational === "Domestic" ? (
                                    // Domestic일 경우 대한민국만 표시
                                    <option value="대한민국">대한민국</option>
                                ) : (
                                    // International일 경우 기존 나라 선택 옵션 제공
                                    <>
                                        <option value="">나라를 선택하세요</option>
                                        <optgroup label="아시아">
                                            <option value="일본">일본</option>
                                            <option value="중국">중국</option>
                                            <option value="인도">인도</option>
                                        </optgroup>

                                        <optgroup label="유럽">
                                            <option value="영국">영국</option>
                                            <option value="독일">독일</option>
                                            <option value="스페인">스페인</option>
                                            <option value="프랑스">프랑스</option>
                                            <option value="이탈리아">이탈리아</option>
                                        </optgroup>

                                        <optgroup label="북아메리카">
                                            <option value="미국">미국</option>
                                            <option value="캐나다">캐나다</option>
                                        </optgroup>

                                        <optgroup label="남아메리카">
                                            <option value="브라질">브라질</option>
                                        </optgroup>

                                        <optgroup label="오세아니아">
                                            <option value="호주">호주</option>
                                        </optgroup>

                                        <optgroup label="기타">
                                            <option value="러시아">러시아</option>
                                            <option value="남아프리카 공화국">남아프리카 공화국</option>
                                        </optgroup>
                                    </>
                                )}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="city" className="block text-lg font-medium text-gray-700">
                                도시
                            </label>
                            <select
                                className="border-gray-300 rounded-md p-2 w-full"
                                id="city"
                                value={postInfo.city}
                                onChange={(e) =>
                                    setPostInfo((prev) => ({ ...prev, city: e.target.value }))
                                }
                            >
                                <option value="">도시를 선택하세요</option>
                                {cities.map((cityOption) => (
                                    <option key={cityOption} value={cityOption}>
                                        {cityOption}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="tags" className="block text-lg font-medium text-gray-700">
                            태그
                        </label>
                        <input
                            id="tags"
                            value={tagInput}
                            onChange={handleTagInput}
                            placeholder="#태그 입력 후 스페이스바"
                            className="border-gray-300 rounded-md p-2 w-full"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {postInfo.tags.map((tag, index) => (
                                <span key={index} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                                    {tag}
                                    <button
                                        className="ml-2 text-gray-600 hover:text-gray-900"
                                        onClick={() => removeTag(tag)}>
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 space-y-6">
                    {postInfo.postData.map((day, dayIndex) => (
                        <div key={dayIndex} className="bg-gray-50 p-4 rounded-lg shadow-inner">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-semibold">Day {dayIndex + 1} - {postInfo.startDate && calculateDate(postInfo.startDate, dayIndex)}</h2>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={addDay}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                                        Day 추가
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                        onClick={() => removeDay(dayIndex)}>
                                        Day 삭제
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor={`dayMemo-${dayIndex}`} className="block text-lg font-medium text-gray-700">
                                    Day Record
                                </label>
                                <textarea
                                    className="border-gray-300 rounded-md p-2 w-full"
                                    id={`dayMemo-${dayIndex}`}
                                    value={day.dayMemo || ""}
                                    onChange={(e) => handleDayMemoChange(dayIndex, e.target.value)}
                                    placeholder="이날은 무슨 일이 있었나요?"
                                    maxLength={500}
                                />
                            </div>

                            {day.places.map((place, placeIndex) => (
                                <div key={placeIndex} className="mb-4">
                                    <div className="flex items-center space-x-2">
                                        <span className="w-20">
                                            {placeIndex + 1}번 장소: {place.place_name || "장소 없음"}
                                        </span>
                                        <button
                                            type="button"
                                            className="text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2.5 text-center"
                                            onClick={() => handlePlaceSelection(dayIndex, placeIndex)}>
                                            장소 선택
                                        </button>
                                        <div className="flex-grow flex items-center">
                                            <input
                                                value={place.place_name || ""}
                                                className="flex-grow border-gray-300 rounded-md p-2"
                                                disabled
                                            />
                                            <div className="ml-2 w-1/4">
                                                <button
                                                    className={`text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-4 py-2.5 text-center ${day.places.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                                                    onClick={() => removePlace(dayIndex, placeIndex)}
                                                    disabled={day.places.length === 0}>
                                                    삭제
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            ))}
                            <button
                                onClick={() => addPlace(dayIndex)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                                장소 추가
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {isSelectPlace && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-w-4xl" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-xl font-bold">Day {selectedDayIndex + 1} : {selectedPlaceIndex + 1}번 장소 선택 중</div>
                            <button
                                onClick={() => setIsSelectPlace(false)}
                                className="text-red-600 hover:text-red-800 text-3xl font-bold"
                                aria-label="Close"
                            >
                                &times;
                            </button>
                        </div>

                        {postInfo.country === "대한민국" ? (
                            <CourseKakaoMapComponent
                                onSave={handleSavePlace}
                                selectedDayIndex={selectedDayIndex}
                                selectedPlaceIndex={selectedPlaceIndex}
                                isSelectPlace={isSelectPlace}

                            />
                        ) : (
                            <CourseGoogleMapComponent
                                onSave={handleSavePlace}
                                selectedDayIndex={selectedDayIndex}
                                selectedPlaceIndex={selectedPlaceIndex}
                                isSelectPlace={isSelectPlace}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TripLogBoardEditForm
