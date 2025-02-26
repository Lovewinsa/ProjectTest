import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import Home from "../pages/Home"
import Sample from "../pages/Sample"
import Signup from "../pages/Signup"
import Agreement from "../pages/Agreement"
import LoginPage from "../pages/LoginPage"
import LogoutPage from "../pages/LogoutPage"
import MyProfile from "../pages/myPage/MyProfile"
import MyProfileForm from "../pages/myPage/MyProfileForm"
import CompletedSignup from "../pages/CompletedSignup"
import KakaoRedirect from "../components/KakaoRedirect"
import GoogleRedirect from "../components/GoogleRedirect"
import ChangePassword from "../pages/myPage/ChangePassword"
import MateBoard from "../pages/boards/MateBoard"
import MateBoardForm from "../pages/boards/MateBoardForm"
import MateBoardEditForm from "../pages/boards/MateBoardEditForm"
import MateBoardDetail from "../pages/boards/MateBoardDetail"
import TripChecklist from "../pages/Utilities/TripChecklist"
import TripSafetyInfo from "../pages/Utilities/TripSafetyInfo"
import ExchangeInfo from "../pages/Utilities/ExchangeInfo"
import CourseBoard from "../pages/boards/CourseBoard"
import CourseBoardForm from "../pages/boards/CourseBoardForm"
import CourseBoardDetail from "../pages/boards/CourseBoardDetail"
import CourseBoardEditForm from "../pages/boards/CourseBoardEditForm"
import MyPlace from "../pages/myTripTmp/MyPlace"
import MyPlan from "../pages/myTripTmp/MyPlan"
import MyRecord from "../pages/myTripTmp/MyRecord"
import WishMate from "../pages/myTripTmp/WishMate"
import LikedPostsPage from "../pages/myTripTmp/LikedPostsPage"
import ChatRoom from "../components/ChatRoom"
import MyPage from "../pages/myPage/MyPage"

import ProtectedRoute from "../components/ProtectedRoute"
import TripLogBoardForm from "../pages/boards/TripLogBoardForm"
import TripLogBoard from "../pages/boards/TripLogBoard"
import CommunityBoard from "../pages/boards/CommunityBoard"
import CommunityBoardForm from "../pages/boards/CommunityBoardForm"
import TripLogBoardDetail from "../pages/boards/TripLogBoardDetail"
import TripLogBoardEditForm from "../pages/boards/TripLogBoardEditForm"
import TripLogBoardFormNew from "../pages/boards/TripLogBoardFormNew"
import CommunityBoardDetail from "../pages/boards/CommunityBoardDetail"
import CommunityBoardEditForm from "../pages/boards/CommunityBoardEditForm"
import ResetPassword from "../pages/myPage/ResetPassword"
import ApiDocs from "../pages/admin/ApiDocs"
import ReportBoard from "../pages/admin/ReportBoard"
import AdminDashboard from "../pages/admin/AdminHome"
import UserBoard from "../pages/admin/UserBoard"
import AdminLayout from "../components/AdminLayout"
import MyPlace2 from "../pages/myTripTmp/MyPlace2"
import UtilHome from "../pages/Utilities/UtilHome"
import TripCostCalculator from "../pages/Utilities/TripCostCalculator"
import InputExamples from "../pages/myTripTmp/InputExamples"

// /users/:id
// /users/:id/setting
// /posts/:{ mate, course, photo, review }/:id/{update, detail, ...}

const routes = [
  // ### home ###
  { path: "/", element: <Home /> },
  { path: "/input", element: <InputExamples />},

  // ### sign up, login, logout ... ###
  { path: "/sample", element: <Sample /> },
  { path: "/agreement", element: <Agreement /> },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/logout", element: <LogoutPage /> },
  { path: "/completedSignup", element: <CompletedSignup /> },
  { path: "/kakaoLogin/redirect", element: <KakaoRedirect /> },
  { path: "/googleLogin/redirect", element: <GoogleRedirect /> },

  // ### Reset Password ###
  { path: "/auth/resetPassword", element: <ResetPassword /> },

  // ### board ###

  //      ### mate ###
  { path: "/posts/mate", element: <MateBoard /> },
  { path: "/posts/mate/:id/detail", element: <MateBoardDetail /> },

  //      ### course ###
  { path: "/posts/course", element: <CourseBoard /> },
  { path: "/posts/course/:id/detail", element: <CourseBoardDetail /> },

  //      ### trip_log ###
  { path: "/posts/trip_log", element: <TripLogBoard /> },
  { path: "/posts/trip_log/:id/detail", element: <TripLogBoardDetail /> },

  // { path: "/posts/trip_log/:id/detail", element: <TripLogDetail />},

  //      ### Community ###
  { path: "/posts/community", element: <CommunityBoard /> },
  { path: "/posts/community/:id/detail", element: <CommunityBoardDetail /> },

  // ### 부가 기능 ###
  { path: "/utils", element: <UtilHome /> },
  { path: "/utils/checklist", element: <TripChecklist /> },
  { path: "/utils/exchangeInfo", element: <ExchangeInfo /> },
  { path: "/utils/calculator", element: <TripCostCalculator /> },
  { path: "/utils/safetyInfo", element: <TripSafetyInfo /> },
  
  // ### etc ###
]

const protectedRoutes = [
  // ### board ###

  //      ### mate ###
  { path: "/posts/mate/new", element: <MateBoardForm /> },
  { path: "/posts/mate/:id/edit", element: <MateBoardEditForm /> },

  //      ### course ###
  { path: "/posts/course/new", element: <CourseBoardForm /> },
  { path: "/posts/course/:id/edit", element: <CourseBoardEditForm /> },

  //      ### trip_log ###
  { path: "posts/trip_log/new", element: <TripLogBoardFormNew /> },
  { path: "posts/trip_log/:id/new", element: <TripLogBoardForm /> },
  { path: "posts/trip_log/:id/edit", element: <TripLogBoardEditForm /> },

  //      ### Community ###
  { path: "/posts/community/new", element: <CommunityBoardForm /> },
  { path: "/posts/community/:id/edit", element: <CommunityBoardEditForm /> },

  // ### profile setting(보여지는 정보) ###
  { path: "/users/:id", element: <MyPage /> },
  { path: "/users/:id/profile", element: <MyProfile /> },
  { path: "/users/:id/profile/edit", element: <MyProfileForm /> },

  // ### my page 메뉴 설정 ###
  { path: "/private/myPlace", element: <MyPlace /> },
  { path: "/private/myPlace2", element: <MyPlace2 /> },
  { path: "/private/myPlan", element: <MyPlan /> },
  { path: "/private/myTripLog", element: <MyRecord /> },
  { path: "/private/wishMate", element: <WishMate /> },
  { path: "/private/likedCourse", element: <LikedPostsPage /> },

  // ### 개인정보 설정(보안, 인증정보) ###
  { path: "/auth/:id/changePassword", element: <ChangePassword /> },

  // ### chat ###
  { path: "/chatroom", element: <ChatRoom /> },
  { path: "/chatroom/:id", element: <ChatRoom /> },
]

const adminRoutes = [
  // ### admin ###
  { path: "/admin-dashboard", element: <AdminDashboard /> },
  { path: "/admin-dashboard/users", element: <UserBoard /> },
  { path: "/admin-dashboard/reports", element: <ReportBoard /> },
  { path: "/admin-dashboard/api-docs", element: <ApiDocs /> },
]

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      ...routes.map((route) => ({
        index: route.path === "/",
        path: route.path === "/" ? undefined : route.path,
        element: route.element,
      })),
      // Protected routes
      {
        element: <ProtectedRoute />, // 로그인을 요구하는 모든 경로를 ProtectedRoute로 감싸기
        children: protectedRoutes.map((route) => ({
          path: route.path,
          element: route.element,
        })),
      },
      // Admin routes with layout
      {
        element: <AdminLayout />, // AdminLayout을 사용하여 사이드 바 포함
        children: adminRoutes.map((route) => ({
          path: route.path,
          element: route.element,
        })),
      },
    ],
  },
])

export default router
