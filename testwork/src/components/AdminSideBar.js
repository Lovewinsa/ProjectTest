import React from "react"
import { NavLink } from "react-router-dom"

const Sidebar = () => {
  return (
    <div className="w-48 h-full bg-green-700 text-white p-4 mt-10">
      <ul className="space-y-2">
        <li>
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) => `block p-2 rounded ${isActive ? "bg-tripDuoGreen" : "hover:bg-tripDuoGreen"}`}
            end
          >
            대시보드
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin-dashboard/users"
            className={({ isActive }) => `block p-2 rounded ${isActive ? "bg-tripDuoGreen" : "hover:bg-tripDuoGreen"}`}
          >
            유저 목록
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin-dashboard/reports"
            className={({ isActive }) => `block p-2 rounded ${isActive ? "bg-tripDuoGreen" : "hover:bg-tripDuoGreen"}`}
          >
            신고 처리
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin-dashboard/api-docs"
            className={({ isActive }) => `block p-2 rounded ${isActive ? "bg-tripDuoGreen" : "hover:bg-tripDuoGreen"}`}
          >
            Api Documentation
          </NavLink>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
