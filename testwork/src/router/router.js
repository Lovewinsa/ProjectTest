import { createBrowserRouter } from "react-router-dom";
import App from "../App";

import Home from "../pages/Home";
import Sample from "../pages/Sample";
import HomeAbroad from "../pages/HomeAbroad";
import HomeMate from "../pages/HomeMate";
import Signup from "../pages/Signup";
import Agreement from "../pages/Agreement";
import LoginPage from "../pages/LoginPage";
import LogoutPage from "../pages/LogoutPage";
import MyPage from "../pages/myPage/MyPage";
import MyProfile from "../pages/myPage/MyProfile";
import MyProfileForm from "../pages/myPage/MyProfileForm";
import CompletedSignup from "../pages/CompletedSignup";
import KakaoRedirect from "../components/KakaoRedirect";
import GoogleRedirect from "../components/GoogleRedirect";
import ChangePassword from "../pages/myPage/ChangePassword";
import MateBoard from "../pages/boards/MateBoard";
import MateBoardForm from "../pages/boards/MateBoardForm";
import MateBoardEditForm from "../pages/boards/MateBoardEditForm";
import MateBoardDetail from "../pages/boards/MateBoardDetail";
import TravelChecklist from "../pages/Utilities/TravelChecklist";
import TravelSafetyInfo from "../pages/Utilities/TravelSafetyInfo";
import TravelCostCalculator from "../pages/Utilities/TravelCostCalculator";
import TravelPlanner from "../pages/Utilities/TravelPlaner";
import LocationRecommendations from "../pages/Utilities/LocationRecommendations";
import ExchangeInfo from "../pages/Utilities/ExchangeInfo";
import TravelDiary from "../pages/Utilities/TravelDiary";
import LanguageCultureTips from "../pages/Utilities/LanguageCultureTips";
import ExtraPage from "../pages/Utilities/ExtraPage";
import CourseBoard from "../pages/boards/CourseBoard";
import CourseBoardForm from "../pages/boards/CourseBoardForm";
import CourseBoardDetail from "../pages/boards/CourseBoardDetail";
import CourseBoardEditForm from "../pages/boards/CourseBoardEditForm";
import MyPlace from "../pages/myTripTmp/MyPlace"
import MyPlan from "../pages/myTripTmp/MyPlan"
import MyRecord from "../pages/myTripTmp/MyRecord"
import WishMate from "../pages/myTripTmp/WishMate"


const routes = [
  // /users/:id
  // /users/:id/setting
  // /posts/:{ mate, course, photo, review }/:id/{edit, detail, ...}
  //

  // ### home ###
  { path: "/", element: <Home /> },
  { path: "/home-abroad", element: <HomeAbroad /> },
  { path: "/home-mate", element: <HomeMate /> },

  // ### sign up, login, logout ... ###
  { path: "/sample", element: <Sample /> },
  { path: "/agreement", element: <Agreement /> },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/logout", element: <LogoutPage /> },
  { path: "/completedSignup", element: <CompletedSignup /> },
  { path: "/kakaoLogin/redirect", element: <KakaoRedirect /> },
  { path: "/googleLogin/redirect", element: <GoogleRedirect /> },

  // ### profile setting(보여지는 정보) ###
  { path: "/users/:id", element: <MyPage /> },
  { path: "/users/:id/profile", element: <MyProfile /> },
  { path: "/users/:id/profile/edit", element: <MyProfileForm /> },

  // ### my page 메뉴 설정 ###
  { path: "/myPlace/:id", element: <MyPlace />},
  { path: "/myPlan/:id", element: <MyPlan />},
  { path: "/myRecord/:id", element: <MyRecord />},
  { path: "/wishMate/:id", element: <WishMate />},

  // ### 개인정보 설정(보안, 인증정보) ###
  { path: "/auth/:id/changePassword", element: <ChangePassword /> },

  // ### board ###

  //      ### mate ###
  { path: "/posts/mate", element: <MateBoard /> },
  { path: "/posts/mate/new", element: <MateBoardForm /> },
  { path: "/posts/mate/:id/edit", element: <MateBoardEditForm /> },
  { path: "/posts/mate/:id/detail", element: <MateBoardDetail /> },

  //      ### course ###
  { path: "/posts/course", element: <CourseBoard /> },
  { path: "/posts/course/new", element: <CourseBoardForm /> },
  { path: "/posts/course/:id/edit", element: <CourseBoardEditForm/> },
  { path: "/posts/course/:id/detail", element: <CourseBoardDetail /> },

  // ### 부가 기능 ###

  { path: "/checklist", element: <TravelChecklist /> },
  { path: "/exchange", element: <ExchangeInfo /> },
  { path: "/safetyInfo", element: <TravelSafetyInfo /> },
  { path: "/calculator", element: <TravelCostCalculator /> },
  { path: "/planner", element: <TravelPlanner /> },
  { path: "/recommendations", element: <LocationRecommendations /> },
  { path: "/diary", element: <TravelDiary /> },
  { path: "/languageTip", element: <LanguageCultureTips /> },
  { path: "/extra", element: <ExtraPage /> },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: routes.map((route) => {
      return {
        index: route.path === "/",
        path: route.path === "/" ? undefined : route.path,
        element: route.element,
      };
    }),
  },
]);

export default router;
