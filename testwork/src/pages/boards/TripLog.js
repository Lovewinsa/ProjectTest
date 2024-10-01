import axios from "axios"
import React, { createRef, useEffect, useRef, useState } from "react"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { NavLink, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import ConfirmModal from "../../components/ConfirmModal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faHeart, faMessage } from "@fortawesome/free-solid-svg-icons"
import SavedPlacesKakaoMapComponent from "../../components/SavedPlacesKakaoMapComponent"
import SavedPlacesGoogleMapComponent from "../../components/SavedPlacesGoogleMapComponent"

const TripLog = () => {
    //"/posts/course/:id/detail" 에서 id에 해당되는 경로 파라미터 값 얻어오기
    const { id } = useParams()
    //로그인된 user정보
    const loggedInUserId = useSelector((state) => state.userData.id, shallowEqual) // 로그인된 user의 id
    const loggedInUsername = useSelector((state) => state.userData.username, shallowEqual) // 로그인된 username
    const loggedInNickname = useSelector((state) => state.userData.nickname, shallowEqual) // 로그인된 nickname
    const loggedInProfilePicture = useSelector((state) => state.userData.profilePicture, shallowEqual) // 로그인된 user의 프로필사진

    //게시물 작성자 정보
    const [writerProfile, setWriterProfile] = useState({})
    //글 하나의 정보 상태값으로 관리
    const [post, setPost] = useState({ tags: [], postData: [{ dayMemo: "", places: [""] }] })

    //맵에 전달할 장소 정보 상태값으로 관리
    const [allPlaces, setAllPlaces] = useState([])
    //카카오 지도의 중심 좌표를 저장하는 상태값
    const [kakaoMapCenterLocation, setKakaoMapCenterLocation] = useState({ Ma: 37.5665, La: 126.978 })
    //구글 지도의 중심 좌표를 저장하는 상태값
    const [googleMapCenterLocation, setGoogleMapCenterLocation] = useState({ Ma: 37.5665, La: 126.978 })

    //현재 로딩중인지 여부
    const [isLoading, setLoading] = useState(false)

    const searchParams = useSearchParams()
    const location = useLocation()

    //Confirm 모달을 띄울지 여부를 상태값으로 관리
    const [confirmShow, setConfirmShow] = useState(false)
    //action 발행하기 위해
    const navigate = useNavigate()

    useEffect(() => {
        //id가 변경될 때 기존 게시물 데이터가 화면에 남아있는 것 방지
        setPost({ tags: [], postData: [{ dayMemo: "", places: [""] }] }) // 초기값으로 설정

        //글 정보 가져오기
        axios
            .get(`/api/v1/posts/${id}`)
            .then((res) => {
                const postData = res.data.dto
                setPost(postData)

                //장소 정보
                const places = postData.postData.reduce((acc, day) => acc.concat(day.places), [])
                setAllPlaces(places)

                // 첫 번째 장소로 지도 중심 설정
                if (places.length > 0 && places[0].position && postData.country === "Korea") {
                    setKakaoMapCenterLocation({ Ma: places[0].position.Ma, La: places[0].position.La });
                }
                if (places.length > 0 && places[0] && postData.country !== "Korea") {
                    setGoogleMapCenterLocation({ Ma: places[0].Ma, La: places[0].La });
                }

                //게시물 작성자의 정보
                const resUserId = postData.userId || null
                if (!resUserId) {
                    throw new Error("게시물 작성자의 정보가 없습니다.")
                }

                return axios
                    .get(`/api/v1/users/${resUserId}/author`)
                    .then((res) => {
                        const writerData = res.data
                        setWriterProfile(writerData)
                    })
                    .catch((error) => {
                        console.log("작성자 정보를 불러오지 못했습니다.", error)
                        alert("작성자 정보를 불러오는 중 문제가 발생했습니다.")
                    })


            })
            .catch((error) => {
                console.log("데이터를 가져오지 못했습니다.", error)
                alert("게시물을 불러오는 중 문제가 발생했습니다.")
            })
    }, [id, searchParams]) //경로 파라미터가 변경될 때 서버로부터 데이터 다시 받기

    //작성자 프로필 보기
    const handleViewProfile = () => {
        navigate(`/users/${writerProfile.id}/profile`)
    }

    //장소명 눌렀을 때 실행되는 함수
    const handlePlaceClick = (place) => {
        if (place.position && place.position.Ma !== undefined && place.position.La !== undefined) {
            setKakaoMapCenterLocation({ Ma: place.position.Ma, La: place.position.La })
        } else {
            setGoogleMapCenterLocation({ Ma: place.Ma, La: place.La })
        }
    }

    return (

        <div className="container mx-auto p-4 max-w-[1024px]">
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

                    {/* 버튼 */}
                    <button
                        onClick={() => navigate("/posts/course")}
                        className="text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-4 py-2.5 text-center">
                        목록으로 돌아가기
                    </button>
                    <button
                        className="text-white bg-indigo-600 hover:bg-indigo-500 rounded-full text-sm px-5 py-2"
                        onClick={handleSubmit}>
                        작성 완료
                    </button>
                </div>

                <div className="flex justify-between items-center m-3">
                    <div>
                        <strong>{post.title}</strong>
                    </div>
                    <div className="my-2 text-sm text-gray-500">
                        {/* 여행 일정 */}
                        <span>
                            여행 일정 : {post.startDate === null ? "설정하지 않았습니다." : new Date(post.startDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                            {post.endDate === null ? "" : ` ~ ${new Date(post.endDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}`}
                        </span>
                    </div>
                </div>

                {/* Day 목록 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-6">
                    {(post.postData || [{ dayMemo: "", places: [] }]).map((day, dayIndex) => (
                        <div key={dayIndex} className="bg-white rounded-lg shadow-md p-4">
                            <h2 className="text-xl font-semibold mb-4">Day {dayIndex + 1}
                                <span className="my-2 text-sm text-gray-500"></span>
                            </h2>
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
                        post.country === "Korea" ?
                            <SavedPlacesKakaoMapComponent savedPlaces={allPlaces} centerLocation={kakaoMapCenterLocation} />
                            :
                            <SavedPlacesGoogleMapComponent savedPlaces={allPlaces} centerLocation={googleMapCenterLocation} />
                    }
                </div>


                {/* 원글의 댓글 작성 form */}
                <div className={`border-3 rounded-lg p-3 mt-4 mb-6 bg-white ${!loggedInUsername ? 'hidden' : ''}`}>
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

                                                {/* 답글 및 기타 버튼 */}
                                                <div className="mt-2 text-sm text-gray-500">
                                                    <small className="ml-4 text-gray-400">{item.createdAt}</small>
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
                        className={`bg-green-500 text-white py-2 px-4 rounded ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
                            }`}
                        disabled={isLoading}
                        onClick={handleMoreComment}>
                        {isLoading ? (
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

export default TripLog