import axios from 'axios';
import React, { createRef, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faHeart, faMessage } from '@fortawesome/free-solid-svg-icons';

//새로 등록한 댓글을 추가할 인덱스
let commentIndex = 0

const CourseBoardDetail = () => {
  //"/posts/course/:id" 에서 id에 해당되는 경로 파라미터 값 얻어오기
  const { id } = useParams()
  //로그인된 user정보
  const username = useSelector(state => state.userData.username, shallowEqual); // 로그인된 username
  const userId = useSelector(state => state.userData.id, shallowEqual) // 로그인된 user의 id

  //게시물 작성자 정보
  const [writerProfile, setWriterProfile] = useState({})
  //좋아요 버튼 설정
  const [isLiked, setIsLiked] = useState(false)
  //글 하나의 정보 상태값으로 관리
  const [post, setPost] = useState({ tags: [], days: [{ places: [""], dayMemo: "" }] })

  //댓글 목록을 상태값으로 관리
  const [commentList, setCommentList] = useState([])
  //댓글의 현재 페이지 번호
  const [pageNum, setPageNum] = useState(1)
  //댓글 전체 페이지의 개수(마지막 페이지 번호)
  const [totalPageCount, setTotalPageCount] = useState(0)
  //현재 로딩중인지 여부
  const [isLoading, setLoading] = useState(false)
  //댓글 내용 상태값
  const [commentInnerText, setCommentInnerText] = useState("")
  //댓글 글자수 제한
  const maxLength = 3000;

  //검색 키워드 관련 처리
  const [params, setParams] = useSearchParams()
  //Confirm 모달을 띄울지 여부를 상태값으로 관리
  const [confirmShow, setConfirmShow] = useState(false)
  //action 발행하기 위해
  const dispatch = useDispatch()
  const navigate = useNavigate();

  // const post = {
  //   writer: 'aaaa',
  //   title: '여행 제목',
  //   country: '대한민국',
  //   city: '서울',
  //   tags: ['#여행', '#서울'],
  //   days: [
  //     {
  //       dayMemo: '첫날 메모',
  //       places: [
  //         { place_name: '경복궁', placeMemo: '궁전 방문' },
  //         { place_name: '인사동', placeMemo: '전통 문화 체험' },
  //       ],
  //     },
  //     {
  //       dayMemo: '둘째날 메모',
  //       places: [
  //         { place_name: '남산타워', placeMemo: '야경 감상' },
  //       ],
  //     },
  //   ],
  // };

  useEffect(() => {
    //검색 키워드 정보도 같이 보내기
    const query = new URLSearchParams(params).toString()
    //글 정보 가져오기
    axios.get(`/api/v1/posts/${id}?${query}`)
      .then(res => {
        console.log(res.data)
        const postData = res.data
        setPost(postData)

        //댓글 목록 배열에 ref라는 방 추가
        const list = res.data.commentList.map(item => {
          item.ref = createRef()
          return item
        })
        //댓글 목록
        setCommentList(list)
        //전체 댓글 페이지의 개수를 상태값으로 넣어주기
        setTotalPageCount(res.data.totalPageCount)

        const resUserId = postData.userId
        return axios.get(`/api/v1/users/${resUserId}`)
      })
      .then(res => {
        const writerData = res.data
        setWriterProfile(writerData)
      })
      .catch(error => {
        console.log("데이터를 가져오지 못했습니다.", error)
      })
  }, [id]) //경로 파라미터가 변경될 때 서버로부터 데이터 다시 받기

  //글 삭제를 눌렀을 때 호출되는 함수
  const deleteHandleYes = () => {
    axios.delete(`${id}`)
      .then(res => {
        console.log(res.data)
        navigate("/posts/course")
      })
      .catch(error => {
        console.log(error)
      })
  }

  //작성자 프로필 보기
  const handleViewProfile = () => {
    navigate(`/users/${writerProfile.id}`)
  }

  const handleLike = () => {
    if (username) {
      axios.post(`/api/v1/posts/${id}/likes`, { postId: post.id, userId: userId })
        .then(res => {
          setIsLiked(!isLiked)
          setPost({
            ...post,
            likeCount: post.likeCount + 1
          })
        })
        .catch((error) => {
          console.log(error)
          alert(error.response.data)
        })
    } else {
      alert("로그인을 해주세요")
    }
  }

  //댓글 등록
  const handleCommentSubmit = (e) => {
    e.preventDefault()
    //만일 로그인하지 않았으면
    if (!username) {
      //로그인 모달 띄운다
      const payload = {
        show: true,
        message: "댓글 저장을 위해 로그인이 필요 합니다!",
      }
      //로그인창을 띄우는 action 을 발행하면서 payload 를 전달한다. 
      dispatch({ type: "LOGIN_MODAL", payload })
      return
    }
    const action = e.target.action
    const method = e.target.method
    const formData = new FormData(e.target)

    axios[method](action, formData)
      .then(res => {
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
      .catch(error => {
        console.log(error)
      })
  }








  return (
    <div className="container">
      <NavLink
        to={{
          pathname: "/posts/course",
          search: post.country === "한국" ? "?di=Domestic" : "?di=International"
        }}>
        여행 코스 게시판{">"}
      </NavLink>
      <div className="flex flex-col h-screen bg-gray-100 p-6 overflow-auto">
        <div className="flex flex-wrap gap-2 mt-2">
          {/* 태그s */}
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">
            #{post.country}
          </span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">
            #{post.city}
          </span>
          {post.tags && post.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center"
            >
              {tag}
            </span>
          ))}
          {
            username === post.writer && <>
              <button
                onClick={() => navigate(`/posts/course/${id}/edit`)}
                className="text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-4 py-2.5 text-center">
                수정
              </button>
              <button
                onClick={() => setConfirmShow(true)}
                className="text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-4 py-2.5 text-center">
                삭제
              </button>
            </>
          }
          <ConfirmModal show={confirmShow} message="글을 삭제하시겠습니까?"
            yes={deleteHandleYes} no={() => setConfirmShow(false)} />

          <button
            onClick={() => navigate("/posts/course")}
            className="text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-4 py-2.5 text-center">
            목록으로 돌아가기
          </button>
        </div>
        {/* title */}
        <div className="m-3">
          <strong>{post.title}</strong>
          {/* title / 좋아요 버튼 / 좋아요,조회수 */}
          {/* 내 게시물이 아닌경우에만 좋아요 버튼 보여주기 */}
          {
            userId !== post.userId &&
            <button
              className={`mx-3 ${isLiked ? "bg-pink-600" : "bg-pink-400"
                } text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
              type="button"
              disabled={isLiked}
              onClick={handleLike}
            >
              <FontAwesomeIcon icon={faHeart} className="mr-2" />
              Like
            </button>
          }
          <span className="text-sm text-gray-500">
            <span className="mx-3"><FontAwesomeIcon icon={faEye} className="h-5 w-5 mr-2" />{post.viewCount}</span>
            <span className="mr-3"><FontAwesomeIcon icon={faHeart} className="h-4 w-4 mr-2" />{post.likeCount}</span>
            <span className="mr-3"><FontAwesomeIcon icon={faMessage} className="h-4 w-4 mr-2" />{post.likeCount}</span>
          </span>
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
                viewBox="0 0 16 16"
              >
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path
                  fillRule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.206 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                />
              </svg>
            )}
            <div>
              <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">
                {writerProfile.nickname}
              </h3>
              <p className="text-sm font-semibold leading-6 text-indigo-600">
                {writerProfile.gender} / {writerProfile.age}
              </p>
            </div>
            <div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleViewProfile}
              >
                프로필 보기
              </button>
            </div>
          </div>
        </div>

            {/* post에 days가 정의되어있지 않아서 오류나서 주석처리, 추 후 postData로 처리할거라고 함
        <div className="space-y-6 mt-6 mb-6">
          {post.days.map((day, dayIndex) => (
            <div key={dayIndex} className="border p-4 rounded-lg bg-white shadow">
              <h2 className="text-xl font-semibold mb-4">Day {dayIndex + 1}</h2>
              <div className="mb-4">
                <label className="block font-semibold">Day Memo</label>
                <p className="border p-2 w-3/4 bg-white">{day.dayMemo}</p>
              </div>
              {day.places.map((place, placeIndex) => (
                <div key={placeIndex} className="mb-4">
                  <h3 className="font-semibold mb-2">{placeIndex + 1}번 장소</h3>
                  <p className="border p-2 w-full bg-white mb-2">{place.place_name}</p>
                  <label className="block font-semibold">장소 메모</label>
                  <p className="border p-2 w-full bg-white">{place.placeMemo}</p>
                </div>
              ))}
            </div>
          ))}
        </div> */}

        {/* 댓글 list */}
        <div className="border-b border-gray-200 py-4">
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              {writerProfile.profilePicture ? (
                <img
                  src={writerProfile.profilePicture}
                  className="w-10 h-10 rounded-full" // 크기를 10으로 줄임
                  alt="작성자 프로필"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40" // SVG 크기를 조정
                  height="40"
                  fill="currentColor"
                  className="bi bi-person-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  <path
                    fillRule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.206 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                  />
                </svg>
              )}
              <span className="font-bold">작성자</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600">⋮</button>
          </div>
          <p className="mt-2">내용</p>
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
            <span className="text-xs text-gray-400">등록일(수정일)</span>
            <button>답글쓰기</button>
          </div>
        </div>


        {/* 댓글 작성 form */}
        <div className="border-3 rounded-lg p-3 mt-4 mb-6 bg-white">
          <ul>
            {
              commentList.map((item, index) => (
                <li key={item.id}
                  ref={item.ref}
                >

                </li>
              ))
            }
          </ul>
          <div className="font-bold">임시아이디{writerProfile.nickname}</div>
          <form onSubmit={handleCommentSubmit}
            action={`/api/v1/posts/${post.id}/comments`}
            method="post"
          >
            <div className="relative">
            <input type="hidden" name="ref_group" defaultValue={post.num} />
            <input type="hidden" name="target_id" defaultValue={post.writer} />
              <textarea
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
                  onClick={() => commentIndex = 0}
                >
                  등록
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};

export default CourseBoardDetail;
