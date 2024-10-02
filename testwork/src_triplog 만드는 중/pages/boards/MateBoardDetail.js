import { faEye, faHeart, faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import DOMPurify from "dompurify";
import React, { createRef, useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { NavLink } from "react-router-dom";

//새로 등록한 댓글을 추가할 인덱스
let commentIndex = 0;
//댓글 글자수 제한
const maxLength = 3000;

function MateBoardDetail(props) {
  const { id } = useParams(); // 게시물 번호
  // 로그인된 유저 정보
  const userId = useSelector((state) => state.userData.id, shallowEqual); // 로그인된 user의 id
  const username = useSelector((state) => state.userData.username, shallowEqual); // 로그인된 username
  const nickname = useSelector((state) => state.userData.nickname, shallowEqual); // 로그인된 유저의 nickname
  const profilePicture = useSelector((state) => state.userData.profilePicture, shallowEqual); // 로그인된 유저의 profilePicture

  const navigate = useNavigate();

  const [post, setPost] = useState({ tags: [] });
  const [isRecruited, setIsRecruited] = useState(false);

  // 작성자 프로필 설정
  const [writerProfile, setWriterProfile] = useState({});

  //좋아요 버튼 설정
  const [isLiked, setLiked] = useState(false);

  //덧글 관련 설정 ( to do )
  // 댓글 목록
  const [commentList, setCommentList] = useState([]);
  //댓글의 현재 페이지 번호
  const [pageNum, setPageNum] = useState(1);
  //댓글 전체의 페이지 개수
  const [totalCommentPages, setTotalCommentPages] = useState(0);
  //현재 로딩중인지 여부
  const [isLoading, setLoading] = useState(false);
  //원글의 댓글 내용 상태값
  const [commentInnerText, setCommentInnerText] = useState("");
  //dropdown 상태 정의
  const [dropdownIndex, setDropdownIndex] = useState(null);
  //dropdown 참조값
  const dropdownRefs = useRef([]);
  // 각 답글 폼 상태를 관리하는 배열
  const [replyTexts, setReplyTexts] = useState({});
  // 각 수정 폼 상태를 관리하는 배열
  const [editTexts, setEditTexts] = useState({});

  // HTML 로 구성된 Content 관리
  const [contentHTML, setContentHTML] = useState(); // HTML 로 구성된 Content
  const cleanHTML = DOMPurify.sanitize(contentHTML); // HTML 클린징으로 보안처리

  // 버튼 스타일 - 신청 전/후 색상 변경
  const likeButtonClasses = `px-4 py-2 text-sm font-medium rounded-md ${
    isRecruited ? "bg-gray-200 text-gray-800" : "bg-green-500 text-white"
  }`;

  useEffect(() => {
    axios
      .get(`/api/v1/posts/${id}`)
      .then((res) => {
        console.log(res.data);

        setPost(res.data.dto);
        setContentHTML(res.data.dto.content);
        setLiked(res.data.dto.like);

        setWriterProfile(res.data.userProfileInfo);

        //댓글 목록이 존재하는지 확인 후, 배열에 ref라는 방 추가
        const list = Array.isArray(res.data.commentList)
          ? res.data.commentList.map((item) => {
              item.ref = createRef();
              return item;
            })
          : [];
        //댓글 목록
        setCommentList(list);

        setTotalCommentPages(res.data.totalCommentPages);
      })
      .catch((error) => console.log(error));
  }, [id]);

  // 신청하기 클릭
  const handleRecruit = (e) => {
    setIsRecruited(!isRecruited);
  };

  // 프로필 보기 클릭
  const handleClickProfile = () => {
    navigate(`/users/${writerProfile.id}/profile`);
  };

  //좋아요 버튼 클릭
  const handleLike = () => {
    if (username) {
      if (!isLiked) {
        // isLiked = false 좋아요 누르지 않음
        axios
          .post(`/api/v1/posts/${id}/likes`, { postId: post.id, userId: userId })
          .then((res) => {
            setLiked(true);
            //view 페이지에서만 숫자 변경
            setPost({
              ...post,
              likeCount: post.likeCount + 1,
            });
          })
          .catch((error) => {
            console.log(error);
            alert(error.response.data);
          });
      } else if (isLiked) {
        // isLiked = true 좋아요 누름
        axios
          .delete(`/api/v1/posts/${id}/likes/${userId}`)
          .then((res) => {
            setLiked(false);
            //view 페이지에서만 숫자 변경
            setPost({
              ...post,
              likeCount: post.likeCount - 1,
            });
          })
          .catch((error) => {
            console.log(error);
            alert(error.response.data);
          });
      }
    } else {
      alert("로그인을 해주세요");
    }
  };

  // --------------댓글 관련 이벤트
  // 답글 텍스트 상태 업데이트
  const handleReplyTextChange = (index, value) => {
    setReplyTexts((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  // 수정 텍스트 상태 업데이트
  const handleEditTextChange = (index, value) => {
    setEditTexts((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  // 드롭다운 토글 함수
  const toggleDropdown = (e, index) => {
    e.stopPropagation();
    if (dropdownIndex === index) {
      // 같은 인덱스를 다시 클릭하면 드롭다운을 닫음
      setDropdownIndex(null);
    } else {
      // 새로운 인덱스를 클릭하면 해당 드롭다운을 열음
      setDropdownIndex(index);
    }
  };

  // 부모 요소에 클릭 이벤트를 추가하여 드롭다운 닫기 처리
  const handleClickOutside = (event) => {
    if (
      dropdownIndex !== null &&
      dropdownRefs.current[dropdownIndex] &&
      !dropdownRefs.current[dropdownIndex].contains(event.target)
    ) {
      setDropdownIndex(null);
    }
  };

  // 신고 처리 함수
  const handleReportComment = (commentId) => {
    // 신고 기능 구현
    alert(`댓글 ID ${commentId}가 신고되었습니다.`);
    // 추가로 서버에 신고 요청을 보내는 로직을 여기에 추가
  };

  //댓글 등록
  const handleCommentSubmit = (e) => {
    e.preventDefault();

    //댓글 정보
    const data = {
      postId: id,
      userId: userId,
      writer: nickname,
      profilePicture: profilePicture,
      content: e.target.content.value,
      // parentCommentId: e.target.parentCommentId.value,
      toUsername: e.target.toUsername?.value || "",
      status: "PUBLIC",
    };

    axios
      .post(`/api/v1/posts/${post.id}/comments`, data)
      .then((res) => {
        console.log(res.data);
        //방금 저장한 댓글의 정보
        const newComment = res.data;
        //댓글의 정보에 ref라는 방을 추가하고 거기에 참조값을 담을 object넣어준다
        newComment.ref = createRef();
        //새로운 배열을 만들면서 기존 배열에 저장된 아이템을 펼쳐 놓아서 상태값을 변경
        setCommentList([...commentList, newComment]);
        //댓글 입력한 textarea 초기화
        setCommentInnerText("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //답글 등록
  const handleReplySubmit = (e) => {
    e.preventDefault();
    const data = {
      postId: id,
      userId: userId,
      writer: nickname,
      profilePicture: profilePicture,
      content: e.target.content.value,
      toUsername: e.target.toUsername.value,
      parentCommentId: e.target.parentCommentId.value,
      status: "PUBLIC",
    };

    axios
      .post(`/api/v1/posts/${post.id}/comments`, data)
      .then((res) => {
        console.log(res.data);
        //방금 저장한 댓글의 정보
        const newComment = res.data;
        //댓글의 정보에 ref라는 방을 추가하고 거기에 참조값을 담을 object넣어준다
        newComment.ref = createRef();
        //이 댓글을 commentIndex에 끼워 넣기
        commentList.splice(commentIndex, 0, res.data);
        //새로운 배열을 만들면서 기존 배열에 저장된 아이템을 펼쳐 놓아서 상태값을 변경
        setCommentList([...commentList]);
        //댓글 입력한 textarea 초기화
        e.target.content.value = "";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //댓글 삭제
  const handleDeleteComment = (commentId, ref) => {
    axios
      .delete(`/api/v1/posts/${id}/comments/${commentId}`)
      .then((res) => {
        ref.current.querySelector(".commentSource").outerHTML = "<p>삭제된 댓글입니다</p>";
        /*
            commentId.current는 li요소의 참조값
            commentId.current.querySelector("dl")은 li요소의 자손 중에서 dl요소를 찾아서 참조값 가져오기
            .outerHTML = "새로운 요소"는 새로운 요소로 대체(replace)하기
          */
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //댓글 수정 버튼
  const handleUpdateComment = (e) => {
    e.preventDefault();
    const action = e.target.action;
    const updatedData = {
      id: e.target.commentId.value,
      postId: e.target.id.value,
      userId: userId,
      writer: nickname,
      profilePicture: profilePicture,
      content: e.target.content.value,
      parentCommentId: e.target.parentCommentId.value,
      toUsername: e.target.toUsername.value,
      status: "PUBLIC",
      createdAt: e.target.createdAt.value,
    };
    axios
      .put(action, updatedData)
      .then((res) => {
        //수정한 댓글 UI에 반영
        const newCommentList = commentList.map((item) => {
          if (item.id === parseInt(e.target.commentId.value)) {
            //수정된 댓글을 기존 배열의 위치에서 업데이트
            return {
              ...item,
              content: e.target.content.value,
            };
          }
          return item;
        });
        //새로운 배열로 상태값 변경
        setCommentList(newCommentList);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //댓글 더보기 버튼
  const handleMoreComment = () => {
    //현재 댓글의 페이지가 마지막 페이지인지 여부를 알아내서
    const isLast = pageNum >= totalCommentPages;
    //만일 마지막 페이지라면
    if (isLast) {
      alert("댓글의 마지막 페이지 입니다");
    } else {
      //마지막 페이지가 아니라면
      //로딩 상태로 바꿔준다
      setLoading(true);
      //요청할 댓글의 게시물id
      const postId = id;
      //요청할 댓글의 페이지
      const page = pageNum + 1;
      //서버에 데이터 추가 요청
      axios
        .get(`/api/v1/posts/${postId}/comments?pageNum=${page}`)
        .then((res) => {
          console.log(res.data);
          //res.data에는 댓글 목록과 전체 페이지 개수가 들어있다.
          //댓글 목록에 ref를 추가한 새로운 배열을 얻어내서
          const newList = res.data.commentList.map((item) => {
            item.ref = createRef();
            return item;
          });
          //현재까지 출력된 댓글 목록에 새로운 댓글 목록을 추가해 새로운 배열로 상태값 변경
          //댓글 목록 데이터 변경하기
          setCommentList([...commentList, ...newList]);
          setTotalCommentPages(res.data.totalCommentPages);
          //증가된 페이지 번호도 반영
          setPageNum(page);

          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-[900px]">
      <div className="flex flex-col h-full bg-gray-100 p-6">
      <div className="container">
        <NavLink
          to={{
            pathname: "/posts/mate",
            search: post.country === "한국" ? "?di=Domestic" : "?di=International",
          }}
        >
          Mate
        </NavLink>

        {/* 태그s */}
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">#{post.country}</span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">#{post.city}</span>
          {post.tags &&
            post.tags.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                {tag}
              </span>
            ))}
        </div>

        {/* title */}
        <h5 className="m-3">
          {id}번 <strong>{post.title}</strong>
          {/* title / 좋아요 버튼 / 좋아요,조회수, 덧글수 */}
          {/* 내 게시물이 아닌경우에만 좋아요 버튼 보여주기 */}
          {userId !== post.userId && (
            <button
              className={`mx-3 ${
                isLiked ? "bg-pink-600" : "bg-pink-400"
              } text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
              type="button"
              onClick={handleLike}
            >
              <FontAwesomeIcon icon={faHeart} className="mr-2" />
              {isLiked ? "unLike" : "Like"}
            </button>
          )}
          {/* 조회수, 좋아요, 덧글 수 */}
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
        </h5>

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
                type="button"
                className="text-white bg-gray-500 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-3 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                onClick={handleClickProfile}
              >
                프로필 보기
              </button>
            </div>
          </div>
        </div>

        <p>안녕하세요~</p>

        <a href="/">대충 경로 공유한 url</a>
        <br />
        <br />

        {/* Froala Editor 내용 */}
        <div dangerouslySetInnerHTML={{ __html: cleanHTML }}></div>

        {/* 카드 */}
        <div className="mt-20 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
            {post.country} / {post.city}
          </h5>

          <div className="mb-3 flex flex-wrap gap-2">
            <p className="text-sm text-gray-500">Tags.</p>
            {post.tags &&
              post.tags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                  {tag}
                </span>
              ))}
          </div>

          <p className="mb-3 font-semibold text-gray-600">저녁 7시 30분 -역 앞 -카페</p>

          <button className={likeButtonClasses} onClick={handleRecruit}>
            {isRecruited ? "취소하기" : "신청하기"}
          </button>
        </div>
      </div>
      {
        // 로그인된 username 과 post의 userId 로 불러온 작성자 아이디가 동일하면 랜더링
        userId === post.userId && (
          <div className="container mt-3">
            <button
              type="button"
              className="m-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              onClick={() => navigate(`/posts/mate/${id}/edit`)}
            >
              수정
            </button>
            <button
              type="button"
              className="m-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              onClick={() => {
                axios
                  .delete(`/api/v1/posts/${id}`)
                  .then((res) => {
                    alert("글 삭제 성공");
                    // 국/해외 페이지 별 리다일렉트
                    post.country === "한국"
                      ? navigate(`/posts/mate?di=Domestic`)
                      : navigate(`/posts/mate?di=International`);
                  })
                  .catch((error) => console.log(error));
              }}
            >
              삭제
            </button>
          </div>
        )
      }

      {/* 원글의 댓글 작성 form */}
      <div className={`border-3 rounded-lg p-3 mt-4 mb-6 bg-white ${!username ? "hidden" : ""}`}>
        <div className="font-bold text-lg">{nickname}</div>
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
                onClick={() => (commentIndex = 0)}
              >
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
              className={`flex items-start space-x-4 ${item.id !== item.parentCommentId ? "pl-12" : ""}`}
            >
              {item.status === "DELETED" ? (
                <p>삭제된 댓글입니다</p>
              ) : (
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
                              fill="currentColor"
                            >
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
                        <div
                          className="relative inline-block text-left"
                          ref={(el) => (dropdownRefs.current[index] = el)}
                        >
                          <button
                            onClick={(e) => toggleDropdown(e, index)}
                            className="flex items-center p-2 text-gray-500 rounded hover:text-gray-700"
                          >
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
                              <div
                                className="py-1"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="options-menu"
                              >
                                <button
                                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                  onClick={() => {
                                    setDropdownIndex(null);
                                    handleReportComment(item.id);
                                  }}
                                >
                                  신고
                                </button>
                                {item.writer === nickname && (
                                  <>
                                    <button
                                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                      onClick={() => {
                                        setDropdownIndex(null);
                                        const updateForm = item.ref.current.querySelector(".updateCommentForm");
                                        updateForm.classList.remove("hidden");
                                      }}
                                    >
                                      수정
                                    </button>
                                    <button
                                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                      onClick={() => {
                                        setDropdownIndex(null);
                                        handleDeleteComment(item.id, item.ref);
                                      }}
                                    >
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
                            const text = e.target.innerText;
                            const replyForm = item.ref.current.querySelector(".replyCommentForm");

                            if (text === "답글") {
                              e.target.innerText = "취소";
                              replyForm.classList.remove("hidden");
                            } else {
                              e.target.innerText = "답글";
                              replyForm.classList.add("hidden");
                            }
                          }}
                        >
                          답글
                        </button>
                      </div>
                    </div>

                    {/* 답글 작성 폼 */}
                    <div className="replyCommentForm border-3 rounded-lg p-3 mt-4 mb-6 bg-white hidden">
                      <div className="font-bold text-lg">{nickname}</div>
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
                              handleReplyTextChange(index, e.target.value);
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
                              commentIndex = index + 1;
                              const replyForm = item.ref.current.querySelector(".replyCommentForm");
                              replyForm.classList.add("hidden");
                            }}
                          >
                            답글 등록
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* 댓글 수정 폼 */}
                    <div className="updateCommentForm border-3 rounded-lg p-3 mt-4 mb-6 bg-white hidden">
                      <div className="font-bold text-lg">{nickname}</div>
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
                              const updateForm = item.ref.current.querySelector(".updateCommentForm");
                              updateForm.classList.add("hidden");
                            }}
                          >
                            수정 확인
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      {/* 댓글 더보기 버튼 */}
      <div className="grid grid-cols-1 md:grid-cols-2 mx-auto mb-5">
        <button
          className={`bg-green-500 text-white py-2 px-4 rounded ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
          }`}
          disabled={isLoading}
          onClick={handleMoreComment}
        >
          {isLoading ? (
            <span className="animate-spin inline-block w-5 h-5 border-2 border-t-2 border-white rounded-full"></span>
          ) : (
            <span>댓글 더보기</span>
          )}
        </button>
      </div>
      </div>
    </div>
  );
}

export default MateBoardDetail;
