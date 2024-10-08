import axios from "axios";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import BlockModal from "../../components/BlockModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faDove, faFeather, faPlane, faUser } from "@fortawesome/free-solid-svg-icons";

function MyPage() {
  const userId = useSelector((state) => state.userData.id, shallowEqual); // 접속된 사용자의 id
  const [profile, setProfile] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageData, setImageData] = useState(null);

  // 차단 목록 모달 상태 관리
  const [isBlockModalOpen, setBlockModalOpen] = useState(false);

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
  ];

  // rating 값에 따른 아이콘과 색상 계산 //
  const getRatingDetails = (ratings) => {
    return (
      ratingConfig.find((config) => ratings >= config.min && ratings <= config.max) || { icon: faUser, color: "black" }
    ); // 기본값
  };

  const { icon: ratingIcon, color: ratingColor } = getRatingDetails(profile.ratings || 0);
  //---------------------------------------------------------------------------------------------------------------rating 관리부

  // 접속된 사용자가 없거나 본인이 아니라면 home 으로 리다일렉트
  useEffect(() => {
    axios
      .get(`/api/v1/users/${id}`)
      .then((res) => {
        if (!userId || userId !== res.data.userProfileInfo.userId) {
          alert("잘못된 접근입니다.");
          navigate(`/`);
        }

        setProfile(res.data.userProfileInfo);

        if (res.data.userProfileInfo.profilePicture) {
          setImageData(res.data.userProfileInfo.profilePicture);
        }
      })
      .catch((error) => console.log(error));
  }, [id, userId, navigate, ratingIcon]);

  //------------------------------------------------------------------------ 이벤트 관리부
  // 프로필 보기 클릭
  const handleClick = () => {
    navigate(`/users/${id}/profile`);
  };

  // 차단 목록 모달 open
  const handleOpenBlockModal = () => {
    setBlockModalOpen(true);
  };
  // 차단 목록 모달 close
  const handleCloseBlockModal = () => {
    setBlockModalOpen(false);
  };

  const handleDeleteUser = () => {
    if (
      window.prompt(
        `[주의] \n회원 탈퇴를 진행하시면 사용자의 정보가 영구히 삭제됩니다. \n이해하셨으면 [탈퇴] 를 입력해 주세요.`
      ) === "탈퇴"
    ) {
      axios
        .delete(`/api/v1/users/${id}`)
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-[900px]">
      {/* 프로필 */}
      <div className="m-3 flex justify-center">
        <div className="flex items-center gap-x-6 m-3">
          {imageData ? (
            <img src={imageData} className="w-20 h-20 rounded-full" />
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
            <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">
              <FontAwesomeIcon icon={ratingIcon} color={ratingColor}></FontAwesomeIcon>
              {profile.nickname}
            </h3>
            <p className="text-sm font-semibold leading-6 text-green-600">
              {profile.gender} / {profile.age}
            </p>
          </div>
          <div>
            <button
              className="px-4 py-2 text-sm font-medium rounded-md bg-gray-600 text-gray-100"
              onClick={handleClick}>
              프로필 보기
            </button>
          </div>
        </div>
      </div>

      {/* 마이 페이지 메뉴 */}
      <h1 className="text-3xl font-bold m-4">My Page</h1>
      <div className="borderbox">
        <ul className="grid grid-cols-2 gap-4">
          <li className="bg-white shadow-md rounded-lg p-4">
            <h3>
              <Link className="text-gray-500 hover:text-black text-decoration-none" to={`/myPlan/${id}`}>
                <strong>Travel Plan</strong>(여행 계획)
              </Link>
            </h3>
            <p>
              여행을 계획하거나
              <br />
              계획한 여행들을 확인하실 수 있습니다.
            </p>
          </li>
          <li className="bg-white shadow-md rounded-lg p-4">
            <h3>
              <Link className="text-gray-500 hover:text-black text-decoration-none" to={`/myRecord/${id}`}>
                <strong>Travel Record</strong>(여행 기록)
              </Link>
            </h3>
            <p>고객님의 여행 기록을 확인하실 수 있습니다.</p>
          </li>
          <li className="bg-white shadow-md rounded-lg p-4">
            <h3>
              <Link className="text-gray-500 hover:text-black text-decoration-none" to={`/wishMate/${id}`}>
                <strong>Wish Mate</strong>(관심 메이트)
              </Link>
            </h3>
            <p>관심 메이트로 등록하신 여행 메이트를 확인하실 수 있습니다.</p>
          </li>
          <li className="bg-white shadow-md rounded-lg p-4">
            <h3>
              <Link className="text-gray-500 hover:text-black text-decoration-none" to={`/myPlace/${id}`}>
                <strong>My Place</strong>(마이 플레이스)
              </Link>
            </h3>
            <p>관심있는 지역, 음식점들을 관리할 수 있습니다.</p>
          </li>
        </ul>
      </div>

      {isBlockModalOpen && <BlockModal id={id} onClose={handleCloseBlockModal} />}

      <div className="mt-20 space-y-3">
        <p>
          <strong className="py-2 hover:bg-gray-100 cursor-pointer" onClick={handleOpenBlockModal}>
            차단 목록
          </strong>
        </p>
        <p>
          <strong className="py-2 hover:bg-gray-100 cursor-pointer" onClick={handleDeleteUser}>
            회원 탈퇴
          </strong>
        </p>
        <p className="py-2">내 활동 기록</p>
      </div>
    </div>
  );
}

export default MyPage;
