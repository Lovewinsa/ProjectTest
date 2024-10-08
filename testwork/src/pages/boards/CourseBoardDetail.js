import axios from "axios"
import React, { createRef, useEffect, useRef, useState } from "react"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { NavLink, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import ConfirmModal from "../../components/ConfirmModal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCrown, faDove, faEye, faFeather, faHeart, faMessage, faPlane, faUser } from "@fortawesome/free-solid-svg-icons"
import SavedPlacesKakaoMapComponent from "../../components/SavedPlacesKakaoMapComponent"
import SavedPlacesGoogleMapComponent from "../../components/SavedPlacesGoogleMapComponent"
import LoadingAnimation from "../../components/LoadingAnimation"


//새로 등록한 댓글을 추가할 인덱스
let commentIndex = 0
//댓글 글자수 제한
const maxLength = 3000

const CourseBoardDetail = () => {
   //로딩 상태 추가
   const [loading, setLoading] = useState(false)
  //"/posts/course/:id/detail" 에서 id에 해당되는 경로 파라미터 값 얻어오기
  const { id } = useParams()
  //로그인된 user정보
  const loggedInUserId = useSelector((state) => state.userData.id, shallowEqual) // 로그인된 user의 id
  const loggedInUsername = useSelector((state) => state.userData.username, shallowEqual) // 로그인된 username
  const loggedInNickname = useSelector((state) => state.userData.nickname, shallowEqual) // 로그인된 nickname
  const loggedInProfilePicture = useSelector((state) => state.userData.profilePicture, shallowEqual) // 로그인된 user의 프로필사진

  //게시물 작성자 정보
  const [writerProfile, setWriterProfile] = useState({})
  //좋아요 버튼 설정
  const [isLiked, setIsLiked] = useState(false)
  const [likeId, setLikeId] = useState()
  //글 하나의 정보 상태값으로 관리
  const [post, setPost] = useState({ tags: [], postData: [{ dayMemo: "", places: [""] }] })
  //게시물 작성자가 맞는지 여부
  const isWriter = loggedInUserId === post.userId

  //맵에 전달할 장소 정보 상태값으로 관리
  const [allPlaces, setAllPlaces] = useState([])
  //카카오 지도의 중심 좌표를 저장하는 상태값
  const [kakaoMapCenterLocation, setKakaoMapCenterLocation] = useState({ Ma: 37.5665, La: 126.978 })
  //구글 지도의 중심 좌표를 저장하는 상태값
  const [googleMapCenterLocation, setGoogleMapCenterLocation] = useState({ Ma: 37.5665, La: 126.978 })
  //댓글 목록을 상태값으로 관리
  const [commentList, setCommentList] = useState([])
  //댓글의 현재 페이지 번호
  const [pageNum, setPageNum] = useState(1)
  //댓글 전체 페이지의 개수(마지막 페이지 번호)
  const [totalPageCount, setTotalPageCount] = useState(0)
  //현재 댓글목록 로딩중인지 여부
  const [isCommentListLoading, setIsCommentListLoading] = useState(false)
  //원글의 댓글 내용 상태값
  const [commentInnerText, setCommentInnerText] = useState("")
  //dropdown 상태 정의
  const [dropdownIndex, setDropdownIndex] = useState(null)
  //dropdown 참조값
  const dropdownRefs = useRef([])
  // 각 답글 폼 상태를 관리하는 배열
  const [replyTexts, setReplyTexts] = useState({})
  // 각 수정 폼 상태를 관리하는 배열
  const [editTexts, setEditTexts] = useState({})

  //검색 키워드, 국내외 관련 처리
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const searchParams2 = new URLSearchParams(location.search)
  const domesticInternational = searchParams.get('di')
  //Confirm 모달을 띄울지 여부를 상태값으로 관리
  const [confirmShow, setConfirmShow] = useState(false)
  //action 발행하기 위해
  const navigate = useNavigate()

  //--------------------------------------------------------------------------------------------------------------rating 관리 부
  // rating 비교 조건 데이터
  const ratingConfig = [
    { min: 0, max: 1499, icon: faFeather, color: "gray" }, // 이코노미
    { min: 1500, max: 2999, icon: faFeather, color: "blue" }, // 프리미엄 이코노미
    { min: 3000, max: 4499, icon: faDove, color: "gray" }, // 비지니스
    { min: 4500, max: 5999, icon: faDove, color: "blue" }, // 프리미엄 비지니스
    { min: 6000, max: 7499, icon: faPlane, color: "gray" }, // 퍼스트
    { min: 7500, max: 8999, icon: faPlane, color: "blue" }, // 프리미엄 퍼스트
    { min: 9000, max: 10000, icon: faCrown, color: "yellow" }, // 로얄
    { min: -Infinity, max: Infinity, icon: faUser, color: "black" }, // 기본값
  ]

  // rating 값에 따른 아이콘과 색상 계산 //
  const getRatingDetails = (ratings) => {
    return (
      ratingConfig.find((config) => ratings >= config.min && ratings <= config.max) || { icon: faUser, color: "black" }
    ) // 기본값
  }

  const { icon: ratingIcon, color: ratingColor } = getRatingDetails(writerProfile.ratings || 0);
  //--------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    // 로딩 애니메이션을 0.5초 동안만 표시
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 700)
    //id가 변경될 때 기존 게시물 데이터가 화면에 남아있는 것 방지
    setPost({ tags: [], postData: [{ dayMemo: "", places: [""] }] }) // 초기값으로 설정
    setCommentList([])
    setTotalPageCount(0)

    //검색 키워드 정보도 같이 보내기
    const query = new URLSearchParams(searchParams).toString()
    //글 정보 가져오기
    axios
      .get(`/api/v1/posts/${id}?${query}`)
      .then((res) => {
        //게시글 정보
        const postData = res.data.dto
        setPost(postData)
        //글 작성자 정보
        const writerData = res.data.userProfileInfo
        setWriterProfile(writerData)

        //장소 정보
        const places = postData.postData.reduce((acc, day) => acc.concat(day.places), [])
        console.log(places)
        setAllPlaces(places)

        // 첫 번째 장소로 지도 중심 설정
        if (places.length > 0 && places[0].position && domesticInternational === "Domestic") {
          setKakaoMapCenterLocation({ Ma: places[0].position.Ma, La: places[0].position.La });
        }
        if (places.length > 0 && places[0] && domesticInternational === "Domestic") {
          setGoogleMapCenterLocation({ Ma: places[0].Ma, La: places[0].La });
        }

        //댓글 목록이 존재하는지 확인 후, 배열에 ref라는 방 추가
        const list = Array.isArray(res.data.commentList)
          ? res.data.commentList.map((item) => {
            item.ref = createRef()
            return item
          })
          : []
        //댓글 목록
        setCommentList(list)
        //전체 댓글 페이지의 개수를 상태값으로 넣어주기
        setTotalPageCount(res.data.totalCommentPages)


      })
      .catch((error) => {
        console.log("데이터를 가져오지 못했습니다.", error)
        alert("게시물을 불러오는 중 문제가 발생했습니다.")
      })
  }, [id, searchParams]) //경로 파라미터가 변경될 때 서버로부터 데이터 다시 받기

  useEffect(() => {
    // 마운트될 때 클릭 이벤트를 추가
    document.addEventListener("mousedown", handleClickOutside)

    // 언마운트될 때 이벤트 리스너 제거
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownIndex])

  //글 삭제를 눌렀을 때 호출되는 함수
  const deleteHandleYes = () => {
    axios
      .delete(`/api/v1/posts/${id}`)
      .then((res) => {
        alert("해당 글이 삭제되었습니다.")
        navigate(`/posts/course?di=${domesticInternational}`)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //작성자 프로필 보기
  const handleViewProfile = () => {
    navigate(`/users/${writerProfile.id}/profile`)
  }

  const handleLike = () => {
    if (loggedInUsername) {
      if (!isLiked) { // 좋아요를 누르지 않은 경우
        axios
          .post(`/api/v1/posts/${id}/likes`, { postId: post.id, userId: loggedInUserId })
          .then((res) => {
            setIsLiked(true)
            //view 페이지에서만 숫자 변경
            setPost((prevPost) => ({
              ...prevPost,
              likeCount: prevPost.likeCount + 1,
            }))
            setLikeId(res.data)
          })
          .catch((error) => {
            console.log(error)
            alert(error.response.data)
          })
      } else if (isLiked) { //이미 좋아요 누른 경우
        axios
          .delete(`/api/v1/posts/${id}/likes/${loggedInUserId}`)
          .then((res) => {
            setIsLiked(false)
            //view 페이지에서만 숫자 변경
            setPost({
              ...post,
              likeCount: post.likeCount - 1,
            })
          })
          .catch((error) => {
            console.log(error)
            alert(error.response.data)
          })
      }
    } else {
      alert("로그인을 해주세요")
    }
  }

  //장소명 눌렀을 때 실행되는 함수
  const handlePlaceClick = (place) => {
    if (place.position && place.position.Ma !== undefined && place.position.La !== undefined) {
      setKakaoMapCenterLocation({ Ma: place.position.Ma, La: place.position.La })
    } else {
      setGoogleMapCenterLocation({ Ma: place.Ma, La: place.La })
    }
  };

  // 답글 텍스트 상태 업데이트
  const handleReplyTextChange = (index, value) => {
    setReplyTexts((prev) => ({
      ...prev,
      [index]: value,
    }))
  }

  // 수정 텍스트 상태 업데이트
  const handleEditTextChange = (index, value) => {
    setEditTexts((prev) => ({
      ...prev,
      [index]: value,
    }))
  }

  // 드롭다운 토글 함수
  const toggleDropdown = (e, index) => {
    e.stopPropagation()
    if (dropdownIndex === index) {
      // 같은 인덱스를 다시 클릭하면 드롭다운을 닫음
      setDropdownIndex(null)
    } else {
      // 새로운 인덱스를 클릭하면 해당 드롭다운을 열음
      setDropdownIndex(index)
    }
  }

  // 부모 요소에 클릭 이벤트를 추가하여 드롭다운 닫기 처리
  const handleClickOutside = (event) => {
    if (dropdownIndex !== null && dropdownRefs.current[dropdownIndex] && !dropdownRefs.current[dropdownIndex].contains(event.target)) {
      setDropdownIndex(null)
    }
  }

  // 신고 처리 함수
  const handleReportComment = (commentId) => {
    if (!loggedInUserId) {
      alert("로그인 후 이용가능합니다.")
    } else {
      // 신고 기능 구현
      alert(`댓글 ID ${commentId}가 신고되었습니다.`)
      // 추가로 서버에 신고 요청을 보내는 로직을 여기에 추가
    }

  }

  //댓글 등록
  const handleCommentSubmit = (e) => {
    e.preventDefault()
    //댓글 정보
    const data = {
      postId: id,
      userId: loggedInUserId,
      writer: loggedInNickname,
      profilePicture: loggedInProfilePicture,
      content: e.target.content.value,
      // parentCommentId: e.target.parentCommentId.value,
      toUsername: e.target.toUsername?.value || "",
      status: "PUBLIC",
    }

    axios
      .post(`/api/v1/posts/${post.id}/comments`, data)
      .then((res) => {
        console.log(res.data)
        //방금 저장한 댓글의 정보
        const newComment = res.data
        //댓글의 정보에 ref라는 방을 추가하고 거기에 참조값을 담을 object넣어준다
        newComment.ref = createRef()
        //새로운 배열을 만들면서 기존 배열에 저장된 아이템을 펼쳐 놓아서 상태값을 변경
        setCommentList([...commentList, newComment])
        //댓글 입력한 textarea 초기화
        setCommentInnerText("")
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //답글 등록
  const handleReplySubmit = (e) => {
    e.preventDefault()

    const data = {
      postId: id,
      userId: loggedInUserId,
      writer: loggedInNickname,
      profilePicture: loggedInProfilePicture,
      content: e.target.content.value,
      toUsername: e.target.toUsername.value,
      parentCommentId: e.target.parentCommentId.value,
      status: "PUBLIC"
    }

    axios.post(`/api/v1/posts/${post.id}/comments`, data)
      .then((res) => {
        console.log(res.data)
        //방금 저장한 댓글의 정보
        const newComment = res.data
        //댓글의 정보에 ref라는 방을 추가하고 거기에 참조값을 담을 object넣어준다
        newComment.ref = createRef()
        //이 댓글을 commentIndex에 끼워 넣기
        commentList.splice(commentIndex, 0, res.data)
        //새로운 배열을 만들면서 기존 배열에 저장된 아이템을 펼쳐 놓아서 상태값을 변경
        setCommentList([...commentList])
        //댓글 입력한 textarea 초기화
        e.target.content.value = ""
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //댓글 삭제
  const handleDeleteComment = (commentId, ref) => {
    axios
      .delete(`/api/v1/posts/${id}/comments/${commentId}`)
      .then((res) => {
        ref.current.querySelector(".commentSource").outerHTML = "<p>삭제된 댓글입니다</p>"
        /*
          commentId.current는 li요소의 참조값
          commentId.current.querySelector("dl")은 li요소의 자손 중에서 dl요소를 찾아서 참조값 가져오기
          .outerHTML = "새로운 요소"는 새로운 요소로 대체(replace)하기
        */
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //댓글 수정 버튼
  const handleUpdateComment = (e) => {
    e.preventDefault()
    const action = e.target.action
    const updatedData = {
      id: e.target.commentId.value,
      postId: e.target.id.value,
      userId: loggedInUserId,
      writer: loggedInUserId,
      profilePicture: loggedInProfilePicture,
      content: e.target.content.value,
      parentCommentId: e.target.parentCommentId.value,
      toUsername: e.target.toUsername.value,
      status: "PUBLIC",
      createdAt: e.target.createdAt.value,
    }
    axios
      .put(action, updatedData)
      .then((res) => {
        //수정한 댓글 UI에 반영
        const newCommentList = commentList.map((item) => {
          if (item.id === parseInt(e.target.commentId.value)) {
            //수정된 댓글을 기존 배열의 위치에서 업데이트
            return {
              ...item,
              content: e.target.content.value
            }
          }
          return item
        })
        //새로운 배열로 상태값 변경
        setCommentList(newCommentList)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //댓글 더보기 버튼
  const handleMoreComment = () => {
    //현재 댓글의 페이지가 마지막 페이지인지 여부를 알아내서
    const isLast = pageNum >= totalPageCount
    //만일 마지막 페이지라면
    if (isLast) {
      alert("댓글의 마지막 페이지 입니다")
    } else {
      //마지막 페이지가 아니라면
      //로딩 상태로 바꿔준다
      setIsCommentListLoading(true)
      //요청할 댓글의 게시물id
      const postId = id
      //요청할 댓글의 페이지
      const page = pageNum + 1
      //서버에 데이터 추가 요청
      axios
        .get(`/api/v1/posts/${postId}/comments?pageNum=${page}`)
        .then((res) => {
          console.log(res.data)
          //res.data에는 댓글 목록과 전체 페이지 개수가 들어있다.
          //댓글 목록에 ref를 추가한 새로운 배열을 얻어내서
          const newList = res.data.commentList.map((item) => {
            item.ref = createRef()
            return item
          })
          //현재까지 출력된 댓글 목록에 새로운 댓글 목록을 추가해 새로운 배열로 상태값 변경
          //댓글 목록 데이터 변경하기
          setCommentList([...commentList, ...newList])
          setTotalPageCount(res.data.totalCommentPages)
          //증가된 페이지 번호도 반영
          setPageNum(page)

          setIsCommentListLoading(false)
        })
        .catch((error) => {
          console.log(error)
          setIsCommentListLoading(false)
        })
    }
  }

  //댓글 등록일 날짜 형식 변환
  const formatDate = (dateString) => {
    const date = new Date(dateString)

    const formattedDate = date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })

    const formattedTime = date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

    return `${formattedDate} ${formattedTime}`
  }


  return (

    <div className="container mx-auto p-4 max-w-[1024px]">
      {/* 로딩 애니메이션 */}
{loading && <LoadingAnimation />}
      <div className="flex flex-col h-full bg-gray-100 p-6">
        <div className="flex flex-wrap justify-between items-center gap-2 mt-2">
          <div className="flex gap-2">
            {/* 태그s */}
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">#{post.country}</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">#{post.city}</span>
            {post.tags &&
              post.tags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                  {tag}
                </span>
              ))}
          </div>

          {/* 목록으로 버튼 */}
          <button
            onClick={() => navigate(`/posts/course?di=${domesticInternational}`)}
            className="text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-4 py-2.5 text-center">
            목록으로 돌아가기
          </button>
        </div>

        {/* 여행 일정 */}
        <div className="my-2 text-sm text-gray-500">
          <span>
            여행 일정 : {post.startDate === null ? "설정하지 않았습니다." : new Date(post.startDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
            {post.endDate === null ? "" : ` ~ ${new Date(post.endDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}`}
          </span>
        </div>

        <div className="flex justify-between items-center m-3">
          <div>
            <strong>{post.title}</strong>
            {/* title / 좋아요 버튼 / 좋아요, 조회수 */}
            {!isWriter && (
              <button
                className={`mx-3 ${isLiked ? "bg-pink-600" : "bg-pink-400"
                  } text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                type="button"
                onClick={handleLike}>
                <FontAwesomeIcon icon={faHeart} className="mr-2" />
                Like
              </button>
            )}
            <span className="text-sm text-gray-500">
              <span className="mx-3">
                <FontAwesomeIcon icon={faEye} className="h-5 w-5 mr-2" />
                {post.viewCount}
              </span>
              <span className="mr-3">
                <FontAwesomeIcon icon={faHeart} className="h-4 w-4 mr-2" />
                {post.likeCount}
              </span>
              <span className="mr-3">
                <FontAwesomeIcon icon={faMessage} className="h-4 w-4 mr-2" />
                {post.commentCount}
              </span>
            </span>
          </div>

          {/* 수정, 삭제 버튼 */}
          {loggedInNickname === post.writer && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/posts/trip_log/${id}/new?di=${domesticInternational}`)}
                className="text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-4 py-2.5 text-center">
                여행기록 작성
              </button>
              <button
                onClick={() => navigate(`/posts/course/${id}/edit?di=${domesticInternational}`)}
                className="text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-4 py-2.5 text-center">
                수정
              </button>
              <button
                onClick={() => setConfirmShow(true)}
                className="text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-4 py-2.5 text-center">
                삭제
              </button>
            </div>
          )}
          <ConfirmModal
            show={confirmShow}
            message="글을 삭제하시겠습니까?"
            yes={deleteHandleYes}
            no={() => setConfirmShow(false)}
          />
        </div>

        {/* 프로필 */}
        <div className="container my-3">
          <div className="flex items-center gap-x-6">
            {writerProfile.profilePicture ? (
              <img src={writerProfile.profilePicture} className="w-20 h-20 rounded-full" alt="" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100"
                height="100"
                fill="currentColor"
                className="bi bi-person-circle"
                viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path
                  fillRule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.206 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                />
              </svg>
            )}
            <div>
              <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">
                <FontAwesomeIcon icon={ratingIcon} color={ratingColor}></FontAwesomeIcon>
                {writerProfile.nickname}
              </h3>
              <p className="text-sm font-semibold leading-6 text-indigo-600">
                {writerProfile.gender} / {writerProfile.age}
              </p>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleViewProfile}>
                프로필 보기
              </button>
            </div>
          </div>
        </div>

        {/* Day 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-6">
          {(post.postData || [{ dayMemo: "", places: [] }]).map((day, dayIndex) => (
            <div key={dayIndex} className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4">Day {dayIndex + 1}</h2>
              <div className="mb-4">
                <label className="block font-semibold">Day Memo</label>
                <p className="border p-2 w-3/4 bg-gray-100">{day.dayMemo || "메모가 없습니다"}</p>
              </div>
              {day.places && day.places.length > 0 ? (
                day.places.map((place, placeIndex) => (
                  <div key={placeIndex} className="mb-4 border rounded-lg p-2 bg-gray-50">
                    <h3 className="font-semibold mb-2">{placeIndex + 1}번 장소</h3>
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => {

                        handlePlaceClick(place)
                      }}>
                      {place.place_name || "장소명이 없습니다"}
                    </button>
                    <label className="block font-semibold">장소 메모</label>
                    <p className="border p-2 w-full bg-white">{place.placeMemo || "메모가 없습니다"}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">장소가 없습니다.</p>
              )}
            </div>
          ))}
        </div>
        <div>
          {
            domesticInternational === "Domestic" ?
              <SavedPlacesKakaoMapComponent savedPlaces={allPlaces} centerLocation={kakaoMapCenterLocation} />
              :
              <SavedPlacesGoogleMapComponent savedPlaces={allPlaces} centerLocation={googleMapCenterLocation} />
          }
        </div>


        {/* 원글의 댓글 작성 form */}
        {loggedInUserId ?
          <div className="border-3 rounded-lg p-3 mt-4 mb-6 bg-white">
            <div className="font-bold text-lg">{loggedInNickname}</div>
            <form onSubmit={handleCommentSubmit}>
              <div className="relative">
                {/* 원글의 id */}
                <input type="hidden" name="id" defaultValue={post.id} />
                {/* 원글의 작성자 */}
                <input type="hidden" name="toUsername" defaultValue={post.writer} />
                <input type="hidden" name="status" />
                <textarea
                  name="content"
                  className="border border-white rounded w-full h-24 p-2"
                  placeholder="댓글을 남겨보세요"
                  value={commentInnerText}
                  maxLength={maxLength}
                  onChange={(e) => setCommentInnerText(e.target.value)}
                />
                <div className="absolute top-2 right-2 text-gray-500 text-sm">
                  {commentInnerText.length}/{maxLength}
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="text-blue-500 hover:text-blue-700 font-semibold"
                    onClick={() => (commentIndex = 0)}>
                    등록
                  </button>
                </div>
              </div>
            </form>
          </div>
          :
          <p className="text-center border-3 rounded-lg p-3 mt-4 mb-6 bg-white">
            댓글 기능은 로그인 후 이용 가능합니다.
          </p>
        }


        {/* 댓글 목록 */}
        <div className="mt-6 space-y-6">
          <ul className="space-y-4">
            {commentList.map((item, index) => (
              <li
                key={item.id}
                ref={item.ref}
                //댓글Ui수정 전 추가되어있던  bg-white shadow-md p-4 rounded-lg
                className={`flex items-start space-x-4 ${item.id !== item.parentCommentId ? "pl-12" : ""}`}>
                {item.status === "DELETED" ?
                  <p>삭제된 댓글입니다</p>
                  :
                  <>
                    {/* 댓글 요소들 */}
                    <div className="flex-1">
                      <div className="commentSource">
                        <div className="flex items-center justify-between">
                          <div className="flex items-end">
                            {/* 프로필 사진 또는 기본 아이콘 */}
                            {item.profilePicture === null ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-10 h-10 text-gray-400"
                                viewBox="0 0 16 16"
                                fill="currentColor">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                <path
                                  fillRule="evenodd"
                                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.206 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                                />
                              </svg>
                            ) : (
                              <img src={item.profilePicture} className="w-10 h-10 rounded-full" alt="프로필" />
                            )}
                            <span className="font-bold text-gray-900">{item.writer}</span>
                          </div>


                          {/* Dropdown 메뉴 */}
                          <div className="relative inline-block text-left" ref={(el) => (dropdownRefs.current[index] = el)}>
                            <button
                              onClick={(e) => toggleDropdown(e, index)}
                              className="flex items-center p-2 text-gray-500 rounded hover:text-gray-700">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 6v.01M12 12v.01M12 18v.01"
                                />
                              </svg>
                            </button>

                            {/* Dropdown 내용 */}
                            {dropdownIndex === index && (
                              <div className="absolute right-0 w-40 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg">
                                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                  <button
                                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                    onClick={() => {
                                      setDropdownIndex(null)
                                      handleReportComment(item.id)
                                    }}>
                                    신고
                                  </button>
                                  {item.writer === loggedInNickname && (
                                    <>
                                      <button
                                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                        onClick={() => {
                                          setDropdownIndex(null)
                                          const updateForm = item.ref.current.querySelector(".updateCommentForm")
                                          updateForm.classList.remove("hidden")
                                        }}>
                                        수정
                                      </button>
                                      <button
                                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                        onClick={() => {
                                          setDropdownIndex(null)
                                          handleDeleteComment(item.id, item.ref)
                                        }}>
                                        삭제
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 댓글 내용 */}
                        <p className="whitespace-pre-wrap text-gray-700 mt-1">{item.content}</p>

                        {/* 등록일 / 답글 및 기타 버튼 */}
                        <div className="mt-2 text-sm text-gray-500">
                          <small className="ml-4 text-gray-400">{formatDate(item.createdAt)}</small>
                          <button
                            className="ml-4 text-blue-500 hover:text-blue-700 text-sm"
                            onClick={(e) => {
                              const text = e.target.innerText
                              const replyForm = item.ref.current.querySelector(".replyCommentForm")

                              if (text === "답글") {
                                e.target.innerText = "취소"
                                replyForm.classList.remove("hidden")
                              } else {
                                e.target.innerText = "답글"
                                replyForm.classList.add("hidden")
                              }
                            }}>
                            답글
                          </button>
                        </div>
                      </div>




                      {/* 답글 작성 폼 */}
                      <div className="replyCommentForm border-3 rounded-lg p-3 mt-4 mb-6 bg-white hidden">
                        <div className="font-bold text-lg">{loggedInNickname}</div>
                        <form onSubmit={handleReplySubmit}>
                          <div className="relative">
                            {/* 원글의 작성자 */}
                            <input type="hidden" name="id" defaultValue={post.id} />
                            {/* 답글 대상자 username */}
                            <input type="hidden" name="toUsername" defaultValue={item.toUsername} />
                            <input type="hidden" name="status" />
                            {/* 댓글의 그룹번호(=답글 대상 댓글의 id) */}
                            <input type="hidden" name="parentCommentId" defaultValue={item.parentCommentId} />
                            <textarea
                              name="content"
                              className="border border-white rounded w-full h-24 p-2"
                              placeholder="답글을 남겨보세요"
                              value={replyTexts[index] || ""}
                              maxLength={maxLength}
                              onChange={(e) => {
                                handleReplyTextChange(index, e.target.value)
                              }}
                            />
                            <div className="char-limit absolute top-2 right-2 text-gray-500 text-sm">
                              {replyTexts[index]?.length || 0}/{maxLength}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <button
                              type="submit"
                              className="text-blue-500 hover:text-blue-700 font-semibold"
                              onClick={() => {
                                (commentIndex = index + 1)
                                const replyForm = item.ref.current.querySelector(".replyCommentForm")
                                replyForm.classList.add("hidden")
                              }}>
                              답글 등록
                            </button>
                          </div>
                        </form>
                      </div>

                      {/* 댓글 수정 폼 */}
                      <div className="updateCommentForm border-3 rounded-lg p-3 mt-4 mb-6 bg-white hidden">
                        <div className="font-bold text-lg">{loggedInNickname}</div>
                        <form action={`/api/v1/posts/${id}/comments/${item.id}`} onSubmit={handleUpdateComment}>
                          <div className="relative">
                            <input type="hidden" name="commentId" defaultValue={item.id} />
                            <input type="hidden" name="id" defaultValue={item.postId} />
                            <input type="hidden" name="toUsername" defaultValue={item.toUsername} />
                            <input type="hidden" name="status" />
                            <input type="hidden" name="createdAt" defaultValue={item.createdAt} />
                            <input type="hidden" name="parentCommentId" defaultValue={item.parentCommentId} />
                            <textarea
                              name="content"
                              className="border border-white rounded w-full h-24 p-2"
                              defaultValue={item.content}
                              maxLength={maxLength}
                              onChange={(e) => handleEditTextChange(index, e.target.value)}
                            />
                            <div className="absolute top-2 right-2 text-gray-500 text-sm">
                              {editTexts[index]?.length || 0}/{maxLength}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <button
                              type="submit"
                              className="text-blue-500 hover:text-blue-700 font-semibold"
                              onClick={() => {
                                const updateForm = item.ref.current.querySelector(".updateCommentForm")
                                updateForm.classList.add("hidden")
                              }}>
                              수정 확인
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </>
                }
              </li>
            ))}
          </ul>
        </div>

        {/* 댓글 더보기 버튼 */}
        <div className="grid grid-cols-1 md:grid-cols-2 mx-auto mb-5">
          <button
            className={`bg-green-500 text-white py-2 px-4 rounded ${isCommentListLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
              }`}
            disabled={isCommentListLoading}
            onClick={handleMoreComment}>
            {isCommentListLoading ? (
              <span className="animate-spin inline-block w-5 h-5 border-2 border-t-2 border-white rounded-full"></span>
            ) : (
              <span>댓글 더보기</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CourseBoardDetail