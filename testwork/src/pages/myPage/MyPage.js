import axios from "axios"
import { useEffect, useState } from "react"
import { shallowEqual, useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"
import BlockModal from "../../components/BlockModal"
import { myPageMenuList, ratingConfig } from "../../constants/mapping"

function MyPage() {
  const navigate = useNavigate()

  const userId = useSelector((state) => state.userData.id, shallowEqual) // 접속된 사용자의 id
  const userRole = useSelector((state) => state.loginStatus.role, shallowEqual)
  const [profile, setProfile] = useState({})
  const { id } = useParams()
  const [imageData, setImageData] = useState(null)

  // 차단 목록 모달 상태 관리
  const [isBlockModalOpen, setBlockModalOpen] = useState(false)

  //--------------------------------------------------------------------------------------------------------------rating 관리 부
  // rating 비교 조건 데이터

  // rating 값에 따른 아이콘과 색상 계산 //
  const getRatingDetails = (ratings) => {
    return ratingConfig.find((config) => ratings >= config.min && ratings <= config.max) || { imageSrc: "default.svg" } // 기본값
  }

  const imageSrc = getRatingDetails(profile.ratings || 0)
  //---------------------------------------------------------------------------------------------------------------rating 관리부

  // 접속된 사용자가 없거나 본인이 아니라면 home 으로 리다일렉트
  useEffect(() => {
    axios
      .get(`/api/v1/users/${id}`)
      .then((res) => {
        if (!userId || userId !== res.data.userProfileInfo.userId) {
          alert("잘못된 접근입니다.")
          navigate(`/`)
        }

        setProfile(res.data.userProfileInfo)

        if (res.data.userProfileInfo.profilePicture) {
          setImageData(res.data.userProfileInfo.profilePicture)
        }
      })
      .catch((error) => console.log(error))
  }, [id, userId, navigate, imageSrc])

  //------------------------------------------------------------------------ 이벤트 관리부
  // 프로필 보기 클릭
  const handleClick = () => {
    navigate(`/users/${id}/profile`)
  }

  // 차단 목록 모달 open
  const handleOpenBlockModal = () => {
    setBlockModalOpen(true)
  }
  // 차단 목록 모달 close
  const handleCloseBlockModal = () => {
    setBlockModalOpen(false)
  }

  const handleDeleteUser = () => {
    if (
      window.prompt(
        `[주의] \n회원 탈퇴를 진행하시면 사용자의 정보가 영구히 삭제됩니다. \n이해하셨으면 [탈퇴] 를 입력해 주세요.`
      ) === "탈퇴"
    ) {
      axios
        .delete(`/api/v1/users/${id}`)
        .then((res) => {
          navigate("/", { state: { needLogout: true } })
        })
        .catch((error) => console.log(error))
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-[900px] shadow-md rounded-lg">
      <div>
        <button
          type="button"
          className="mb-20 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          onClick={() => {
            navigate(`/`)
          }}>
          HOME
        </button>
      </div>
      {/* 프로필 */}
      <div className="m-3 flex justify-center">
        <div className="flex items-center gap-x-6 m-3">
          {imageData ? (
            <img src={imageData} className="w-20 h-20 rounded-full shadow-lg" alt="profile" />
          ) : (
            <img
              className="bi bi-person-circle w-20 h-20"
              src={`${process.env.PUBLIC_URL}/img/defaultImages/defaultProfilePicture.svg`}
              alt="default profile img"
            />
          )}
          <div>
            <div className="flex items-center">
              <img
                className="w-6 h-6 mr-2"
                src={`${process.env.PUBLIC_URL}/img/userRatingImages/${imageSrc.imageSrc}`}
                alt="user rating"
                title={`${imageSrc.imageSrc.replace(".svg", "")}`}
              />
              <span className="text-base font-semibold leading-7 tracking-tight text-gray-900">{profile.nickname}</span>
            </div>
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
      <h1 className="text-3xl font-bold my-10 text-center">My Page</h1>
      <div className="borderBox">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center mx-10">
          {myPageMenuList.map((menuItem, idx) => {
            if (menuItem.title.startsWith("ADMIN") && userRole !== "ADMIN") {
              return null
            }
            return (
              <Link
                key={idx}
                className="text-tripDuoGreen group-hover:text-tripDuoMint text-decoration-none"
                to={`${menuItem.link}`}>
                <li className="bg-white shadow-md rounded-lg p-4 cursor-pointer border border-green-600 hover:scale-102 transition duration-300 hover:shadow-xl group">
                  <strong className="text-2xl">{menuItem.title}</strong>
                  {menuItem.subTitle}

                  <p className="text-sm sm:text-xs mt-3">{menuItem.content}</p>
                </li>
              </Link>
            )
          })}
          <Link
                key={id}
                className="text-tripDuoGreen group-hover:text-tripDuoMint text-decoration-none"
                to={"/input"}>
                <li className="bg-white shadow-md rounded-lg p-4 cursor-pointer border border-green-600 hover:scale-102 transition duration-300 hover:shadow-xl group">
                  <strong className="text-2xl">testInput</strong>
                          </li>
              </Link>
        </ul>
      </div>

      {isBlockModalOpen && <BlockModal id={id} onClose={handleCloseBlockModal} />}

      <div className="my-20 space-y-3 text-center">
        <p className="text-2xl my-5">
          <strong>계정 관리</strong>
        </p>
        <p>
          <strong className="p-2 hover:bg-gray-100 cursor-pointer" onClick={handleOpenBlockModal}>
            차단 목록
          </strong>
        </p>
        <p>
          <strong className="p-2 hover:bg-gray-100 cursor-pointer" onClick={handleDeleteUser}>
            회원 탈퇴
          </strong>
        </p>
      </div>
    </div>
  )
}

export default MyPage
