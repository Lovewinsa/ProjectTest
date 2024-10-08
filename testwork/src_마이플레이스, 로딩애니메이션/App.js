import { useOutlet } from "react-router-dom"
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"
import { useEffect, useState } from "react"
import { decodeToken } from "jsontokens"

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

  return (
    <div className="app-container">
      <NavBar />
      <div className="main-content">{currentOutlet}</div>
      <Footer />
    </div>
  )
}

export default App
