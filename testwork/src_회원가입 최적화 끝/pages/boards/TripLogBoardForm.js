import axios from "axios"
import React, { useEffect, useState } from "react"
import { shallowEqual, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import SavedPlacesKakaoMapComponent from "../../components/SavedPlacesKakaoMapComponent"
import SavedPlacesGoogleMapComponent from "../../components/SavedPlacesGoogleMapComponent"
import LoadingAnimation from "../../components/LoadingAnimation"

const TripLogBoardForm = () => {
  //로딩 상태 추가
  const [loading, setLoading] = useState(false)
  const { id } = useParams()
  //로그인된 user정보
  const loggedInUserId = useSelector((state) => state.userData.id, shallowEqual) // 로그인된 user의 id
  const loggedInUsername = useSelector((state) => state.userData.username, shallowEqual) // 로그인된 username
  const loggedInNickname = useSelector((state) => state.userData.nickname, shallowEqual) // 로그인된 nickname
  const loggedInProfilePicture = useSelector((state) => state.userData.profilePicture, shallowEqual) // 로그인된 user의 프로필사진

  //게시물 작성자 정보
  const [writerProfile, setWriterProfile] = useState({})
  //글 하나의 정보 상태값으로 관리
  const [post, setPost] = useState({
    tags: [],
    postData: [{ dayMemo: "", places: [""] }]
  })

  const [title, setTitle] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState([])
  const [days, setDays] = useState([{ dayMemo: "", places: [""] }])

  //맵에 전달할 장소 정보 상태값으로 관리
  const [allPlaces, setAllPlaces] = useState([])
  //카카오 지도의 중심 좌표를 저장하는 상태값
  const [kakaoMapCenterLocation, setKakaoMapCenterLocation] = useState({ Ma: 37.5665, La: 126.978 })
  //구글 지도의 중심 좌표를 저장하는 상태값
  const [googleMapCenterLocation, setGoogleMapCenterLocation] = useState({ Ma: 37.5665, La: 126.978 })

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const domesticInternational = queryParams.get("di")
  const [searchParams] = useSearchParams()
  const status = searchParams.get("status") || "PUBLIC" //"PUBLIC"이거나 "PRIVATE"인 경우 처리


  //action 발행하기 위해
  const navigate = useNavigate()

  useEffect(() => {
    //id가 변경될 때 기존 게시물 데이터가 화면에 남아있는 것 방지
    setPost({ tags: [], postData: [{ dayMemo: "", places: [""] }] }) // 초기값으로 설정

    // 로딩 애니메이션을 0.5초 동안만 표시
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 700)

    //글 정보 가져오기
    axios
      .get(`/api/v1/posts/${id}`)
      .then((res) => {
        const postData = res.data.dto
        setPost(postData)
        setTitle(`[ ${res.data.dto.title} ] 게시물의 여행기록`)
        console.log(res.data.dto)
        //장소 정보
        const places = postData.postData.reduce((acc, day) => acc.concat(day.places), [])
        setAllPlaces(places)

        // 첫 번째 장소로 지도 중심 설정
        if (places.length > 0 && places[0].position && postData.country === "대한민국") {
          setKakaoMapCenterLocation({ Ma: places[0].position.Ma, La: places[0].position.La })
        }
        if (places.length > 0 && places[0] && postData.country !== "대한민국") {
          setGoogleMapCenterLocation({ Ma: places[0].Ma, La: places[0].La })
        }

        //게시물 작성자의 정보
        const resUserId = postData.userId || null
        if (!resUserId) {
          throw new Error("게시물 작성자의 정보가 없습니다.")
        }

        const writerData = res.data.userProfileInfo
        setWriterProfile(writerData)
      })
      .catch((error) => {
        console.log("데이터를 가져오지 못했습니다.", error)
        alert("게시물을 불러오는 중 문제가 발생했습니다.")
      })
  }, [id]) //경로 파라미터가 변경될 때 서버로부터 데이터 다시 받기

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

  //Day 메모
  const handleDayMemoChange = (dayIndex, memo) => {
    const newDays = [...days]

    // dayIndex에 해당하는 객체가 없으면 기본 값을 추가
    if (!newDays[dayIndex]) {
      newDays[dayIndex] = { dayMemo: "", places: [""] }
    }

    newDays[dayIndex].dayMemo = memo
    setDays(newDays)
  }

  //장소명 눌렀을 때 실행되는 함수
  const handlePlaceClick = (place) => {
    if (place.position && place.position.Ma !== undefined && place.position.La !== undefined) {
      setKakaoMapCenterLocation({ Ma: place.position.Ma, La: place.position.La })
    } else {
      setGoogleMapCenterLocation({ Ma: place.Ma, La: place.La })
    }
  }

  const handleTagInput = (e) => {
    const value = e.target.value
    setTagInput(value)

    if (value.endsWith(" ") && value.trim() !== "") {
      const newTag = value.trim()
      if (newTag !== "#" && newTag.startsWith("#") && !tags.includes(newTag)) {
        setTags([...tags, newTag])
        setTagInput("")
      }
    }
  }

  //tag 삭제
  const removeTag = (tagToRemove) => setTags(tags.filter((tag) => tag !== tagToRemove))

  //글 작성 완료
  const handleSubmit = () => {
    const postInfo = {
      userId: loggedInUserId,
      writer: loggedInNickname,
      type: "TRIP_LOG",
      title,
      country: post.country,
      city: post.city,
      startDate: post.startDate,
      endDate: post.endDate,
      tags,
      postData: days,
      status: status,
    }
    axios
      .post("/api/v1/posts/trip_log", postInfo)
      .then((res) => {
        console.log(postInfo)
        navigate(`/posts/trip_log?di=${domesticInternational}`)
      })
      .catch((error) => console.log(error))
  }

  return (
    <div className="container mx-auto p-4 max-w-[1024px]">
      {/* 로딩 애니메이션 */}
      {loading && <LoadingAnimation />}
      <div className="flex flex-col h-full bg-gray-100 p-6">
        <div className="flex justify-between items-center gap-2 mt-2">
          {/* 왼쪽 정렬: 태그s */}
          <div className="flex gap-2">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">#{post.country}</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">#{post.city}</span>
          </div>

          {/* 오른쪽 정렬: 버튼 */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/posts/course/${id}/detail?di=${domesticInternational}`)}
              className="text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-4 py-2.5 text-center">
              게시글로 돌아가기
            </button>
            <button
              className="text-white bg-indigo-600 hover:bg-indigo-500 rounded-full text-sm px-5 py-2"
              onClick={handleSubmit}>
              작성 완료
            </button>
          </div>
        </div>

        {/* 여행 일정 */}
        <div className="my-2 text-sm text-gray-500">
          <span>
            여행 일정 :{" "}
            {post.startDate === null
              ? "설정하지 않았습니다."
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
          </span>
        </div>
        <div className="flex justify-between items-center m-3">
          {/* 제목 요소 */}
          <div className="flex-grow-[4]">
            <label htmlFor="title" className="block text-lg font-medium text-gray-700">
              제목
            </label>
            <input
              className="border-gray-300 rounded-md p-2 w-full"
              type="text"
              id="title"
              defaultValue={title}
              onChange={(e) => setTitle(e.target.value)}
            />
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

        {/* Day 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-6">
          {(post.postData || [{ dayMemo: "", places: [] }]).map((day, dayIndex) => (
            <div key={dayIndex} className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4">
                Day {dayIndex + 1} - {post.startDate && calculateDate(post.startDate, dayIndex)} {/* 날짜 표시 */}
                <span className="my-2 text-sm text-gray-500"></span>
              </h2>
              <div className="mb-4">
                <label htmlFor={`dayMemo-${dayIndex}`} className="block text-lg font-medium text-gray-700">
                  Day Record
                </label>
                <textarea
                  className="border-gray-300 rounded-md p-2 w-full"
                  id={`dayMemo-${dayIndex}`}
                  onChange={(e) => handleDayMemoChange(dayIndex, e.target.value)}
                  placeholder="이날은 무슨 일이 있었나요?"
                />
              </div>
              {day.places.map((place, placeIndex) => (
                <div key={placeIndex} className="mb-4 border rounded-lg p-2 bg-gray-50">
                  <h3 className="font-semibold mb-2">{placeIndex + 1}번 장소</h3>
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => {
                      handlePlaceClick(place)
                    }}>
                    {place.place_name || "장소명이 없습니다"}
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div>
          {post.country === "대한민국" ? (
            <SavedPlacesKakaoMapComponent savedPlaces={allPlaces} centerLocation={kakaoMapCenterLocation} />
          ) : (
            <SavedPlacesGoogleMapComponent savedPlaces={allPlaces} centerLocation={googleMapCenterLocation} />
          )}
        </div>
      </div>
    </div>
  )
}

export default TripLogBoardForm
