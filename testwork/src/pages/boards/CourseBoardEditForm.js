import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import CourseKakaoMapComponent from "../../components/CourseKakaoMapComponent";
import { shallowEqual, useSelector } from "react-redux";
import CourseGoogleMapComponent from "../../components/CourseGoogleMapComponent";


const CourseBoardEditForm = () => {
    const userId = useSelector((state) => state.userData.id, shallowEqual)
    const nickname = useSelector((state) => state.userData.nickname, shallowEqual)
    const username = useSelector((state) => state.userData.username, shallowEqual)

    // postInfo 하나의 state로 통합 관리
    const [postInfo, setPostInfo] = useState({
        id: "",
        userId: "",
        writer: "",
        type: "COURSE",
        title: "",
        postData: [{ places: [], dayMemo: "" }],
        country: "",
        city: "",
        tags: [],
        status: "PUBLIC"
    })

    const [selectedDayIndex, setSelectedDayIndex] = useState(null)
    const [selectedPlaceIndex, setSelectedPlaceIndex] = useState(null)
    const [savedPlaces, setSavedPlaces] = useState([])
    const [isSelectPlace, setIsSelectPlace] = useState(false)

    const [searchParams] = useSearchParams()
    const domesticInternational = searchParams.get("di") || "Domestic"

    const navigate = useNavigate()
    const { id } = useParams()  // URL에서 게시물 ID를 가져옴

    // 나라별 도시 목록
    const citiesByCountry = {
        Korea: ["서울", "부산", "제주", "인천"],
        Japan: ["도쿄", "오사카", "교토", "삿포로"],
        China: ["베이징", "상하이", "광저우", "시안"],
        India: ["델리", "뭄바이", "콜카타", "벵갈루루"],
        UK: ["런던", "맨체스터", "버밍엄", "리버풀"],
        Germany: ["베를린", "뮌헨", "프랑크푸르트", "함부르크"],
        France: ["파리", "마르세유", "리옹", "니스"],
        Italy: ["로마", "밀라노", "베네치아", "피렌체"],
        USA: ["뉴욕", "로스앤젤레스", "시카고", "마이애미"],
        Canada: ["토론토", "밴쿠버", "몬트리올", "오타와"],
        Brazil: ["상파울루", "리우데자네이루", "브라질리아", "살바도르"],
        Australia: ["시드니", "멜버른", "브리즈번", "퍼스"],
        Russia: ["모스크바", "상트페테르부르크", "노보시비르스크", "예카테린부르크"],
        SouthAfrica: ["케이프타운", "요하네스버그", "더반", "프리토리아"],
        // Add more countries and cities as needed
    }

    const cities = citiesByCountry[postInfo.country] || []

    useEffect(() => {
        // 기존 게시물 데이터를 가져와 초기화
        axios.get(`/api/v1/posts/${id}/update`)
            .then((res) => {
                setPostInfo(res.data)
            })
            .catch((error) => console.log(error))
    }, [id])

    const handleSubmit = () => {
        axios.put(`/api/v1/posts/${id}`, postInfo)  // PUT 요청으로 업데이트
            .then((res) => {
                alert("수정했습니다")
                // 업데이트 후 해당글 자세히보기로 이동
                navigate(`/posts/course/${id}/detail?di=${domesticInternational}`)
            })
            .catch((error) => console.log(error))
    }

    //태그 입력
    const handleTagInput = (e) => {
        const value = e.target.value
        if (value.endsWith(" ") && value.trim() !== "") {
            const newTag = value.trim()
            if (newTag !== "#" && newTag.startsWith("#") && !postInfo.tags.includes(newTag)) {
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

    //장소 메모 
    const handlePlaceMemoChange = (dayIndex, placeIndex, memo) => {
        const newDays = [...postInfo.postData]
        newDays[dayIndex].places[placeIndex] = {
            ...newDays[dayIndex].places[placeIndex],
            placeMemo: memo,
        }
        setPostInfo((prev) => ({
            ...prev,
            postData: newDays
        }))
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

    return (
        <div className="container mx-auto p-6 max-w-[900px]">
            <div className="flex flex-col h-full bg-white p-6 shadow-lg rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-semibold text-gray-800">여행 코스 수정</h1>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => navigate(`/posts/course/${id}/detail?di=${domesticInternational}`)}
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
                                <option value="">나라를 선택하세요</option>
                                <optgroup label="아시아">
                                    <option value="Korea">대한민국</option>
                                    <option value="Japan">일본</option>
                                    <option value="China">중국</option>
                                    <option value="India">인도</option>
                                </optgroup>

                                <optgroup label="유럽">
                                    <option value="UK">영국</option>
                                    <option value="Germany">독일</option>
                                    <option value="France">프랑스</option>
                                    <option value="Italy">이탈리아</option>
                                </optgroup>

                                <optgroup label="북아메리카">
                                    <option value="USA">미국</option>
                                    <option value="Canada">캐나다</option>
                                </optgroup>

                                <optgroup label="남아메리카">
                                    <option value="Brazil">브라질</option>
                                </optgroup>

                                <optgroup label="오세아니아">
                                    <option value="Australia">호주</option>
                                </optgroup>

                                <optgroup label="기타">
                                    <option value="Russia">러시아</option>
                                    <option value="SouthAfrica">남아프리카 공화국</option>
                                </optgroup>
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
                                    Day Memo
                                </label>
                                <textarea
                                    className="border-gray-300 rounded-md p-2 w-full"
                                    id={`dayMemo-${dayIndex}`}
                                    value={day.dayMemo || ""}
                                    onChange={(e) => handleDayMemoChange(dayIndex, e.target.value)}
                                    placeholder="메모를 입력하세요..."
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
                                    <div className="mb-2">
                                        <label htmlFor={`placeMemo-${dayIndex}-${placeIndex}`} className="text-sm text-gray-700">
                                            장소 메모
                                        </label>
                                        <input
                                            className="border-gray-300 rounded-md p-2 w-full"
                                            type="text"
                                            id={`placeMemo-${dayIndex}-${placeIndex}`}
                                            value={place.placeMemo || ""}
                                            onChange={(e) => handlePlaceMemoChange(dayIndex, placeIndex, e.target.value)}
                                        />
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

                        {postInfo.country === "Korea" ? (
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
    )
}

export default CourseBoardEditForm
