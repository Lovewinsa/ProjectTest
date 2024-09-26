import { faEye, faHeart, faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { NavLink } from "react-router-dom";

function MateBoardDetail(props) {
  const { id } = useParams(); // 게시물 번호
  const username = useSelector((state) => state.userData.username, shallowEqual); // 로그인된 username
  const userId = useSelector((state) => state.userData.id, shallowEqual); // 로그인된 user의 id

  const navigate = useNavigate();

  const [post, setPost] = useState({ tags: [] });
  const [isRecruited, setIsRecruited] = useState(false);

  // 작성자 프로필 설정
  const [writerProfile, setWriterProfile] = useState({});

  //좋아요 버튼 설정
  const [isLiked, setLiked] = useState(false);

  //덧글 관련 설정 ( to do )
  const [commentList, setCommentList] = useState([]);
  const [totalCommentPages, setTotalCommentPages] = useState(0);

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
        setLiked(res.data.dto.like);
        setWriterProfile(res.data.userProfileInfo);
        setCommentList(res.data.commentList);
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
      axios
        .post(`/api/v1/posts/${id}/likes`, { postId: post.id, userId: userId })
        .then((res) => {
          setLiked(!isLiked);
          setPost({
            ...post,
            likeCount: post.likeCount + 1,
          });
        })
        .catch((error) => {
          console.log(error);
          alert(error.response.data);
        });
    } else {
      alert("로그인을 해주세요");
    }
  };

  return (
    <>
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
              disabled={isLiked}
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
        {/* to do : dangerouslySetInnterHTML 외에 다른방법 찾기 */}
        <div dangerouslySetInnerHTML={{ __html: post.content }}></div>

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
    </>
  );
}

export default MateBoardDetail;
