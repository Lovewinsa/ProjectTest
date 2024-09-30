import { useLocation, useNavigate, useOutlet } from "react-router-dom"
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"
import { useEffect, useState } from "react"
import { decodeToken } from "jsontokens"
import LoadingAnimation from "./components/LoadingAnimation"

const useJwtExpirationHandler = (token) => {
  useEffect(() => {
    if (!token) return

    const result = decodeToken(localStorage.token.substring(7))
    const expirationTime = result.payload.exp * 1000
    const currentTime = Date.now()
    const timeLeft = expirationTime - currentTime

    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        alert("토큰이 만료되었습니다. 다시 로그인해주세요.")
        localStorage.removeItem("token") // 로컬 스토리지에서 토큰 삭제
        window.location.reload()
      }, timeLeft)

      return () => clearTimeout(timer)
    } else {
      alert("토큰이 만료되었습니다. 다시 로그인해주세요.")
      localStorage.removeItem("token")
      window.location.reload()
    }
  }, [token])
}

function App() {
  const currentOutlet = useOutlet()
  const [token, setToken] = useState(localStorage.getItem("token"))

  useJwtExpirationHandler(token)

  const [loading, setLoading] = useState(true) // 초기 상태를 true로 변경
  const [imageWidth, setImageWidth] = useState('0%'); // 초기 너비 0%
  const location = useLocation();
  const navigate = useNavigate()

  useEffect(() => {
    // 로딩 상태가 3초 뒤에 false로 바뀌고 이미지를 채움
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    // 이미지 채워지는 애니메이션
    const widthTimer = setTimeout(() => {
      setImageWidth('100%'); // 3초에 걸쳐 너비가 100%로 확장
    }, 100);

    return () => {
      clearTimeout(timer);
      clearTimeout(widthTimer);
    };
  }, [location.pathname]); // 페이지가 전환될 때마다 로딩 상태를 트리거

  return (
    <div className="app-container">
      {loading && <LoadingAnimation imageWidth={imageWidth} />} {/* imageWidth를 prop으로 전달 */}
      {!loading && (
        <>
          <NavBar />
          <div className="main-content">{currentOutlet}</div>
          <Footer />
        </>
      )}
    </div>
  )
}

export default App
