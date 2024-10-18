import { Outlet, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

function ProtectedRoute({ children }) {
  const isLogin = useSelector((state) => (state.userData.username ? true : false))

  if (!isLogin) {
    alert("해당 페이지는 로그인이 필요합니다.")
    return <Navigate to="/login" replace /> // replace : 뒤로가기로 페이지에 들어가는상황 방지
  }

  return children || <Outlet />
}

export default ProtectedRoute
