import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import CourseKakaoMapComponent from "../../components/CourseKakaoMapComponent"
import { shallowEqual, useSelector } from "react-redux"
import CourseGoogleMapComponent from "../../components/CourseGoogleMapComponent"
import Calendar from "react-calendar"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import moment from "moment"
import { citiesByCountry } from "../../constants/mapping"

const CourseBoardForm = () => {
  const userId = useSelector((state) => state.userData.id, shallowEqual)
  const nickname = useSelector((state) => state.userData.nickname, shallowEqual)

  const calendarRef = useRef(null);

  // 달력에서 선택된 날짜 범위 저장
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // 캘린더 표시 여부 상태

  const [title, setTitle] = useState("")
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")

  // 선택한 나라에 맞는 도시 목록을 얻음
  const cities = citiesByCountry[country] || []
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState([])
  const [days, setDays] = useState([{ places: [""], dayMemo: "" }])

  const [selectedDayIndex, setSelectedDayIndex] = useState(null)
  const [selectedPlaceIndex, setSelectedPlaceIndex] = useState(null)
  const [savedPlaces, setSavedPlaces] = useState([])
  const [isSelectPlace, setIsSelectPlace] = useState(false)

  //검색 키워드, 국내외 관련 처리
  const [searchParams] = useSearchParams()
  const domesticInternational = searchParams.get("di") || "Domestic"
  const status = searchParams.get("status") //"PUBLIC"이거나 "PRIVATE"인 경우 처리
  const navigate = useNavigate()

  //국내 글 작성시 대한민국 자동 선택처리
  useEffect(() => {
    if (domesticInternational === "Domestic") {
      setCountry("대한민국")
    } else {
      setCountry("")
    }
  }, [domesticInternational])

  // 날짜 초기화
  const handleDateReset = () => {
    setSelectedDateRange([null, null]) // 날짜 범위를 현재 날짜로 초기화
  }

  // 달력에서 날짜를 선택할 때 호출되는 함수
  const handleDateChange = (dateRange) => {
    setSelectedDateRange(dateRange)
    // 날짜 선택 후 캘린더 닫기
    setIsCalendarOpen(false)
  }

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
      if (newTag !== "#" && newTag.startsWith("#") && !tags.includes(newTag)) {
        // 태그 최대 6개로 제한
        if (tags.length >= 6) {
          alert("태그는 최대 6개까지 추가할 수 있습니다.")
          return
        }

        setTags([...tags, newTag])
        setTagInput("")
      }
    }
  }

  const removeTag = (tagToRemove) => setTags(tags.filter((tag) => tag !== tagToRemove))

  const addDay = () => setDays([...days, { places: [""], dayMemo: "" }])

  const removeDay = (dayIndex) => {
    if (days.length > 1) {
      setDays(days.filter((_, index) => index !== dayIndex))
    }
  }

  const addPlace = (dayIndex) => {
    const newDays = [...days]
    newDays[dayIndex].places.push("")
    setDays(newDays)
  }

  const removePlace = (dayIndex, placeIndex) => {
    const newDays = [...days]

    if (newDays[dayIndex].places.length > 1) {
      // 장소 데이터가 2개 이상일 때 UI와 장소 데이터를 모두 삭제
      newDays[dayIndex].places.splice(placeIndex, 1)
    } else {
      // 장소 데이터가 1개일 때 UI는 남기고 장소 데이터만 삭제
      newDays[dayIndex].places[placeIndex] = "" // 빈 값으로 장소 데이터 삭제
    }

    setDays(newDays)
  }

  const handlePlaceSelection = (dayIndex, placeIndex) => {
    setSelectedDayIndex(dayIndex)
    setSelectedPlaceIndex(placeIndex)
    setIsSelectPlace(true)
  }

  const handleSavePlace = (place) => {
    if (place && isSelectPlace) {
      const newDays = [...days]

      const currentPlace = newDays[place.dayIndex].places[place.placeIndex]
      const updatedPlace = {
        ...place,
        placeMemo: currentPlace.placeMemo || "", // 기존 메모를 유지
      }

      newDays[place.dayIndex].places[place.placeIndex] = updatedPlace
      setDays(newDays)
      setSavedPlaces([...savedPlaces, updatedPlace])
      setIsSelectPlace(false)
    }
  }

  const handlePlaceMemoChange = (dayIndex, placeIndex, memo) => {
    const newDays = [...days]
    newDays[dayIndex].places[placeIndex] = {
      ...newDays[dayIndex].places[placeIndex],
      placeMemo: memo,
    }
    setDays(newDays)
  }

  const handleDayMemoChange = (dayIndex, memo) => {
    const newDays = [...days]
    newDays[dayIndex].dayMemo = memo
    setDays(newDays)
  }

  //작성 완료 버튼
  const handleSubmit = () => {
    if (!title) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!country) {
      alert("나라를 선택해주세요.");
      return;
    }

    const post = {
      userId,
      writer: nickname,
      type: "COURSE",
      title,
      country,
      city,
      startDate: selectedDateRange[0],
      endDate: selectedDateRange[1],
      tags,
      postData: days,
      status: status,
    }
    axios
      .post("/api/v1/posts/course", post)
      .then((res) => {
        status === "PRIVATE" ? navigate("/private/myPlan")
          : navigate(`/posts/course?di=${domesticInternational}`)
      })
      .catch((error) => console.log(error))
  }

  // 캘린더의 날짜 스타일을 설정하는 함수 추가
  const tileClassName = ({ date }) => {
    const day = date.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
    // 기본적으로 검은색으로 설정
    let className = "text-black";

    // 토요일과 일요일에만 빨간색으로 변경
    if (day === 0 || day === 6) {
      className = "text-red-500"; // 토요일과 일요일에 숫자를 빨간색으로 표시
    }

    return className; // 최종 클래스 이름 반환
  }

  return (
    <div className="container mx-auto p-6 max-w-[900px]">
      <div className="flex flex-col h-full bg-white p-6 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold text-gray-800">
            {status === "PRIVATE" && "나만의 "}{domesticInternational === "Domestic" ? "국내 " : "해외 "}여행 코스 작성
          </h1>
          <button
            onClick={() => {
              status === "PRIVATE" ? navigate(`/private/myPlan`)
                : navigate(`/posts/course?di=${domesticInternational}`)
            }}
            className="text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full text-sm px-5 py-2">
            목록으로 돌아가기
          </button>
          <button
            className="text-white bg-indigo-600 hover:bg-indigo-500 rounded-full text-sm px-5 py-2"
            onClick={handleSubmit}>
            작성 완료
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex mb-4">
            {/* 제목 요소 */}
            <div className="flex-grow-[4]">
              <label htmlFor="title" className="block text-lg font-medium text-gray-700">
                제목
              </label>
              <input
                className="border-gray-300 rounded-md p-2 w-full"
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={status === "PRIVATE" ? "MyPage에서 확인 가능한 게시물입니다." : ""}
                maxLength={50}
              />
            </div>

            {/* 날짜 선택 및 날짜 초기화 버튼 */}
            <div className="flex flex-grow-[1] items-end justify-end ml-4">
              <button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full text-sm px-5 py-2"
              >
                날짜 선택
              </button>
              <button onClick={handleDateReset} className="text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full text-sm px-5 py-2 ml-2">
                날짜 초기화
              </button>
            </div>
          </div>

          {/* 선택한 날짜 */}
          <div className="sm:col-span-6">
            <p style={{ marginTop: '-10px', marginBottom: '-20px' }} className="text-sm text-gray-600 text-right">
              {selectedDateRange[0] && selectedDateRange[1]
                ? `${selectedDateRange[0].toLocaleDateString()} ~ ${selectedDateRange[1].toLocaleDateString()}`
                : "0000. 00. 00. ~ 0000. 00. 00."}
            </p>
          </div>

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
                  className="w-full p-4 bg-white rounded-lg border-none" // 달력 컴포넌트의 테두리를 없애기 위해 border-none 추가
                  onChange={handleDateChange}
                  value={selectedDateRange || [new Date(), new Date()]} // 초기값 또는 선택된 날짜 범위
                  minDetail="month" // 상단 네비게이션에서 '월' 단위만 보이게 설정
                  maxDetail="month" // 상단 네비게이션에서 '월' 단위만 보이게 설정
                  navigationLabel={null}
                  showNeighboringMonth={false} //  이전, 이후 달의 날짜는 보이지 않도록 설정
                  calendarType="hebrew" //일요일부터 보이도록 설정
                  tileClassName={tileClassName} // 날짜 스타일 설정
                  formatYear={(locale, date) => moment(date).format("YYYY")} // 네비게이션 눌렀을때 숫자 년도만 보이게
                  formatMonthYear={(locale, date) => moment(date).format("YYYY. MM")} // 네비게이션에서 2023. 12 이렇게 보이도록 설정
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
                    );
                  }} // 날짜 내용 설정
                  formatDay={() => null}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="country" className="block text-lg font-medium text-gray-700">
                나라
              </label>
              <select
                className="border-gray-300 rounded-md p-2 w-full"
                id="country"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value)
                  setCity("")
                }}>
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
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!country} //나라가 선택되지 않으면 비활성화
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
              {tags.map((tag, index) => (
                <span key={index} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                  {tag}
                  <button className="ml-2 text-gray-600 hover:text-gray-900" onClick={() => removeTag(tag)}>
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="bg-gray-50 p-4 rounded-lg shadow-inner">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Day {dayIndex + 1}</h2>
                <div className="flex space-x-2">
                  <button onClick={addDay} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
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
                  maxLength={200}
                />
              </div>

              {day.places.map((place, placeIndex) => (
                <div key={placeIndex} className="mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-20">{placeIndex + 1}번 장소</span>
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
                          className={`text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-4 py-2.5 text-center ${day.places.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          onClick={() => removePlace(dayIndex, placeIndex)}
                          disabled={day.places.length === 0}>
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div>
                      <label htmlFor={`placeMemo-${dayIndex}-${placeIndex}`} className="text-sm text-gray-700">
                        장소 메모
                      </label>
                      <input
                        className="border-gray-300 rounded-md p-2 w-full"
                        type="text"
                        id={`placeMemo-${dayIndex}-${placeIndex}`}
                        value={place.placeMemo || ""}
                        onChange={(e) => handlePlaceMemoChange(dayIndex, placeIndex, e.target.value)}
                        maxLength={150}
                      />
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

      {
        isSelectPlace && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-w-4xl"
              style={{ maxHeight: "80vh", overflowY: "auto" }}>
              <div className="flex justify-between items-center mb-4">
                <div className="text-xl font-bold">
                  Day {selectedDayIndex + 1} : {selectedPlaceIndex + 1}번 장소 선택 중
                </div>
                <button
                  onClick={() => setIsSelectPlace(false)}
                  className="text-red-600 hover:text-red-800 text-3xl font-bold"
                  aria-label="Close">
                  &times;
                </button>
              </div>

              {domesticInternational === "Domestic" ? (
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
        )
      }
    </div >
  )
}

export default CourseBoardForm
