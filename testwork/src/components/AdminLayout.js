import React from "react"
import Sidebar from "../components/AdminSideBar"
import { Navigate, Outlet } from "react-router"
import { shallowEqual, useSelector } from "react-redux"

const AdminLayout = ({ children }) => {
  const userRole = useSelector((state) => state.loginStatus.role, shallowEqual)

  if (userRole !== "ADMIN") {
    alert("해당 페이지는 ADMIN만 접근할 수 있습니다.")
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex">
      <Sidebar /> {/* Sidebar는 한 번만 렌더링 */}
      <div className="p-4 flex-1">{children || <Outlet />}</div>
    </div>
  )
}

export default AdminLayout
