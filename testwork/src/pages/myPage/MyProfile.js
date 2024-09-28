import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { shallowEqual, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faFaceGrinStars,
  faFaceLaughSquint,
  faFaceMeh,
  faFaceSmile,
  faPersonCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import "../../css/MyProfile.css";
import FollowerFolloweeModal from "../../components/FollowerFolloweeModal";

function MyProfile(props) {
  // to do : cur_location, rating, last_login
  const { id } = useParams(); // 프로필 사용자의 id
  const userId = useSelector((state) => state.userData.id, shallowEqual); // 접속된 사용자의 id
  const nickname = useSelector((state) => state.userData.nickname, shallowEqual); // 접속된 사용자의 nickname
  // 접족된 사용자와 profile 의 사용자가 같은지
  const [isProfileOwner, setProfileOwner] = useState(false);

  const navigate = useNavigate();

  const [profile, setProfile] = useState({});

  // 팔로우 상태 관리
  const [followingStatus, setFollowingStatus] = useState(false);
  // 팔로우 알림 관리
  const toastMessageRef = useRef();

  //프로필 토글 관리
  const dropdownMenuRef = useRef();

  // 리뷰 작성 관련
  const [userReview, setUserReview] = useState({
    reviewerId: id,
    content: "",
    // tags : [],
    // rating : 0
  });

  // 팔로잉/팔로워 모달 상태관리
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState();

  // 차단 상태 관린
  const [blockStatus, setBlockStatue] = useState(false);

  // 버튼 스타일 - 신청 전/후 색상 변경
  const followButtonClasses = `px-4 py-2 text-sm font-medium rounded-md ${
    followingStatus ? "bg-gray-200 text-gray-800" : "bg-blue-500 text-white"
  }`;

  // 리뷰 최대 글자수
  const maxLength = 3000;

  useEffect(() => {
    axios
      .get(`/api/v1/users/${id}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.theirFollowType === "BLOCK") {
          alert("해당 사용자가 당신을 차단하여 더 이상 프로필을 볼 수 없습니다.");
          navigate("/");
        }

        if (res.data.myFollowType === "BLOCK") {
          setBlockStatue(true);
        } else if (res.data.myFollowType === "FOLLOW") {
          setFollowingStatus(true);
        }

        //불러온 사용자의 정보 저장
        setProfile(res.data.userProfileInfo);
        console.log(res.data);

        // 접속된 사용자와 프로필 사용자의 id 가 같으면 Owner = true
        if (userId === res.data.userProfileInfo.userId) {
          setProfileOwner(true);
        }
      })
      .catch((error) => console.log(error));
  }, [id, userId]);

  //--------------------------이벤트 관리 부--------------------------------------

  // 프로필 수정 클릭
  const handleClick = () => {
    navigate(`/users/${id}/profile/edit`);
  };

  // 팔로잉/팔로워 모달 open
  const handleOpenModal = (tab) => {
    setModalTab(tab);
    setModalOpen(true);
  };
  // 팔로잉/팔로워 모달 close
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // 토스트 메세지
  const toastOn = () => {
    toastMessageRef.current.classList.add("active");
    setTimeout(() => {
      toastMessageRef.current.classList.remove("active");
    }, 1500);
  };

  // 차단 버튼 클릭 이벤트
  const handleBlock = () => {
    if (!blockStatus) {
      // 차단 중이지 않은 경우 (blockStatus = false)
      if (window.confirm(`${profile.nickname}님을 차단하시겠습니까?`)) {
        axios
          .post(`/api/v1/users/${id}/block/${userId}`)
          .then((res) => {
            console.log(res.data);
            setBlockStatue(true);
            dropdownMenuRef.current.classList.toggle("hidden"); // dropdown 메뉴 숨김
          })
          .catch((error) => console.log(error));
      }
    } else {
      // 차단 중인 경우 (blockStatus = true)
      if (window.confirm(`차단을 해제하시겠습니까?`)) {
        axios
          .post(`/api/v1/users/${id}/block/${userId}`)
          .then((res) => {
            console.log(res.data);
            setBlockStatue(false);
            dropdownMenuRef.current.classList.toggle("hidden"); // dropdown 메뉴 숨김
          })
          .catch((error) => console.log(error));
      }
    }
  };

  // 팔로우 버튼 클릭 이벤트
  // to do : 팔로우 상태 알림 ( ex) android splash )
  const handleClickFollow = () => {
    if (!followingStatus) {
      //팔로우 중이지 않은경우 (followingStatue = false)
      toastOn();
      axios
        .post(`/api/v1/users/${id}/follow/${userId}`)
        .then((res) => {
          console.log(res.data);
          setFollowingStatus(true);
        })
        .catch((error) => console.log(error));
    } else {
      // 팔로우 중인 경우 (followingStatus = true)
      if (window.confirm("팔로우를 취소 하시겠습니까?")) {
        axios
          .delete(`/api/v1/users/${id}/follow/${userId}`)
          .then((res) => {
            console.log(res.data);
            setFollowingStatus(false);
          })
          .catch((error) => console.log(error));
      }
    }
  };

  //프로필 토글 버튼 클릭
  const handleClickToggle = () => {
    dropdownMenuRef.current.classList.toggle("hidden");
  };

  // 입력된 리뷰 내용 상태값으로 저장
  const handleInputReview = (e) => {
    setUserReview({
      ...userReview,
      content: e.target.value,
    });
  };

  // 리뷰 드롭다운 태그 메뉴 관련
  const handleReviewDropDown = (e) => {
    if (e === "BAD") {
    } else if (e === "GOOD") {
    } else if (e === "GREAT") {
    }
  };

  //프로필 링크 복사
  const handleCopy = () => {
    const tmpText = `localhost:3000/users/${id}/profile`;
    navigator.clipboard
      .writeText(tmpText)
      .then(() => {
        alert("클립보드에 복사되었습니다.");
        dropdownMenuRef.current.classList.toggle("hidden"); // dropdown 메뉴 숨김
      })
      .catch((error) => console.log(error));
  };

  //덧글 작성 요청시 사용자 정보가 없으면 로그인 페이지로 리다일렉트
  const handleCommentSubmit = (e) => {
    e.preventDefault();

    userId
      ? axios
          .post(`/api/v1/users/${id}/reviews`, userReview)
          .then((res) => {
            console.log(res.data);

            // 초기화
            setUserReview({
              ...userReview,
              content: "",
            });
          })
          .catch((error) => console.log(error))
      : alert("로그인 페이지로 이동됩니다.");
    navigate("/login");
  };

  return (
    <div className="container mx-auto p-4 max-w-[900px]">
      {isProfileOwner && (
        <div>
          <button
            type="button"
            className="mb-20 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            onClick={() => {
              navigate(`/users/${id}`);
            }}>
            마이 페이지
          </button>
        </div>
      )}
      {/* 전체 div */}
      <div className="flex-col">
        {blockStatus && (
          <p className="ml-10 mb-0 text-sm text-red-600">
            <FontAwesomeIcon icon={faPersonCircleXmark} />
            &nbsp;차단된 사용자 입니다.
          </p>
        )}

        {/* 프로필 부분 전체 */}
        <div className="relative flex-col ">
          {/* 세로로 가운데, 아이템들 수평 간격 6px 마진 3  */}
          <div className="flex items-center gap-x-6 m-3 justify-center">
            {/* 프로필 이미지 핸들링 */}
            {profile.profilePicture ? (
              <img src={profile.profilePicture} width={100} height={100} className="rounded-full" alt="" />
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
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                />
              </svg>
            )}

            <div>
              <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">{profile.nickname}</h3>
              <p className="text-sm font-semibold leading-6 text-indigo-600">
                {profile.gender} / {profile.age}
              </p>
            </div>

            {/* 프로필 사용자 / 방문자 구분 */}
            {isProfileOwner ? (
              <div>
                <button
                  className="px-4 py-2 text-sm font-medium rounded-md bg-gray-600 text-gray-100"
                  onClick={handleClick}>
                  프로필 수정하기
                </button>
              </div>
            ) : (
              // 팔로우, 평가
              <div className="flex ">
                <button className={followButtonClasses} onClick={handleClickFollow}>
                  {followingStatus && <FontAwesomeIcon icon={faCheck} />}
                  &nbsp;팔로우
                </button>
                <div id="toast_message" ref={toastMessageRef}>
                  {profile.nickname}님을 팔로우하기 시작합니다
                </div>
              </div>
            )}
            {/* Toggle 버튼 (신고/차단) 프로필 주인이 아닐시에만 랜더링*/}
            {!isProfileOwner && (
              <div className="flex items-center dropdown-wrapper">
                <button
                  onClick={handleClickToggle}
                  data-dropdown-toggle="dropdownDots"
                  className="dropdown-button inline-flex items-center p-2 text-sm font-medium text-center text-gray-600 bg-white rounded-lg hover:bg-gray-100 focus:ring-1focus:outline-none focus:ring-gray-50"
                  type="button">
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 4 15">
                    <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                  </svg>
                </button>

                <div
                  id="dropdownDots"
                  ref={dropdownMenuRef}
                  className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dropdown-inner">
                  <div className="py-2 text-sm text-gray-700" aria-labelledby="dropdownMenuIconButton">
                    <p onClick={handleCopy} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      프로필 링크
                    </p>
                    <p onClick={handleBlock} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      {!blockStatus ? (
                        <>차단</>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faCheck} />
                          차단됨
                        </>
                      )}
                    </p>
                    <p className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">신고</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 팔로우/팔로우 카운트 뷰 + 팝업 페이지 */}
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => {
                handleOpenModal("followee");
              }}>
              <strong>{profile.followeeCount}</strong>Following
            </button>
            <button
              onClick={() => {
                handleOpenModal("follower");
              }}>
              <strong>{profile.followerCount}</strong>Followers
            </button>
          </div>
        </div>

        {/* MODAL */}
        {isModalOpen && <FollowerFolloweeModal id={id} ff={modalTab} onClose={handleCloseModal} />}

        {/* sns 아이콘 */}
        <div className="mt-3 flex justify-center">
          <a className="h-8 w-8 rounded-full outline-none focus:outline-none" type="button" href={profile.socialLinks}>
            <svg
              className="fill-current transition duration-700 ease-in-out text-gray-700 hover:text-pink-600"
              role="img"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <title>Instagram</title>
              <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
            </svg>
          </a>
          <span> {profile.socialLinks} </span>

          <a
            className="ml-5 h-8 w-8 rounded-full outline-none focus:outline-none"
            type="button"
            href={profile.socialLinks}>
            <svg
              className="fill-current transition duration-700 ease-in-out text-gray-700 hover:text-green-600"
              role="img"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <title>Github</title>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
          <span> {profile.socialLinks} </span>
        </div>

        {/* profile message */}
        <div className="my-3">
          <label htmlFor="profileMessage" className="form-label ">
            자기 소개
          </label>
          <div id="profileMessage" className="border-2 border-gray-400 rounded-md p-2 min-h-[100px] overflow-y-auto">
            {profile.profileMessage}
          </div>
        </div>

        {/* 리뷰 */}
        <div className="mt-10 text-center space-x-20">
          <FontAwesomeIcon
            className="w-12 h-12 fill-current transition duration-700 ease-in-out text-gray-700 hover:text-orange-600"
            onClick={() => handleReviewDropDown("BAD")}
            icon={faFaceMeh}
          />
          <FontAwesomeIcon
            className="w-12 h-12 fill-current transition duration-700 ease-in-out text-gray-700 hover:text-green-600"
            onClick={() => handleReviewDropDown("GOOD")}
            icon={faFaceSmile}
          />
          <FontAwesomeIcon
            className="w-12 h-12 fill-current transition duration-700 ease-in-out text-gray-700 hover:text-cyan-600"
            onClick={() => handleReviewDropDown("GREAT")}
            icon={faFaceLaughSquint}
          />
          {/* BAD */}
          <div>
            <div class="flex items-center mb-4">
              <input
                id="checkbox"
                type="checkbox"
                value=""
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2"
              />
              <label for="default-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                checkbox
              </label>
            </div>
            <div class="flex items-center mb-4">
              <input
                id="checked"
                type="checkbox"
                value=""
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 "
              />
              <label for="checked-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Checked
              </label>
            </div>

          </div>
          
        </div>

        <div className="border-3 rounded-lg p-3 mb-6 bg-white">
          <div className="font-bold">{nickname}</div>
          <form onSubmit={handleCommentSubmit}>
            <div className="relative">
              <textarea
                className="border border-white rounded w-full h-24 p-2"
                placeholder={userId ? "리뷰를 남겨보세요" : "리뷰를 작성하시려면 로그인이 필요합니다."}
                value={userReview.content}
                maxLength={maxLength}
                onChange={handleInputReview}
              />
              <div className="absolute top-2 right-2 text-gray-500 text-sm">
                {userReview.content.length}/{maxLength}
              </div>
              <div className="flex items-center justify-between">
                <button type="submit" className="text-gray-500 hover:text-gray-700 font-semibold">
                  등록
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
