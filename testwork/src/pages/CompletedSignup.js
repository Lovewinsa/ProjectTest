import axios from "axios"
import { useEffect, useState } from "react"
import { shallowEqual, useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"
import LoadingAnimation from "../components/LoadingAnimation"

function CompletedSignup() {
  const userId = useSelector((state) => state.userData.id, shallowEqual) // 접속된 사용자의 id

  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({})
  const location = useLocation()
  const navigate = useNavigate()
  const { isAllChecked } = location.state || {}

  useEffect(() => {
    // 스크롤을 화면 위로
    window.scrollTo(0, 0)

    if (!isAllChecked) {
      alert("잘못된 경로입니다")
      navigate("/")
    } else {
      const hasReloaded = sessionStorage.getItem("hasReloaded")
      if (!hasReloaded) {
        sessionStorage.setItem("hasReloaded", "true")
        window.location.reload()
      }
    }
  }, [isAllChecked, navigate])

  useEffect(() => {
    // 로딩 애니메이션을 0.5초 동안만 표시
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 700)
    // if (!username) return

    // const fetchProfile = async () => {
    //   try {
    //     const response = await axios.get(`/api/v1/users/username/${username}`)
    //     setProfile(response.data)
    //   } catch (error) {
    //     console.error("프로필 데이터를 가져오는 중 오류 발생:", error)
    //   }
    // }

    // fetchProfile()
  }, [userId])

  return (
    <div className="bg-white min-h-screen flex items-start justify-center py-16">
      {loading && <LoadingAnimation />}
      <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-12 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-20 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <svg
            viewBox="0 0 1024 1024"
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0">
            <circle r={512} cx={512} cy={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
            <defs>
              <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>
          <div className="max-w-md text-center lg:text-left lg:flex-auto lg:py-24 mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">회원가입이 완료되었습니다.</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              추가정보 입력을 통해 TripDuo의 모든 기능을
              <br />
              편하게 이용해 보세요.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 flex-nowrap">
              {userId && (
                <>
                  <Link
                    to={`/users/${userId}/profile/edit`}
                    className="rounded-md bg-white px-3.5 py-2.5 mb-4 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                    추가정보 입력
                  </Link>
                  <Link to="/" className="text-sm font-semibold mb-4 leading-6 text-white">
                    TripDuo 둘러보기 <span aria-hidden="true">→</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompletedSignup
