import { createBrowserRouter } from "react-router-dom"
import App from "../App"

import Home from "../pages/Home"
import Sample from "../pages/Sample"
import HomeInternational from "../pages/HomeInternational"
import HomeMate from "../pages/HomeMate"
import Signup from "../pages/Signup"
import Agreement from "../pages/Agreement"
import LoginPage from "../pages/LoginPage"
import LogoutPage from "../pages/LogoutPage"
import MyPage from "../pages/myPage/MyPage"
import MyProfile from "../pages/myPage/MyProfile"
import MyProfileForm from "../pages/myPage/MyProfileForm"
import CompletedSignup from "../pages/CompletedSignup"
import KakaoRedirect from "../components/KakaoRedirect"
import ChangePassword from "../pages/myPage/ChangePassword"
import MateBoard from "../pages/boards/MateBoard"
import MateBoardForm from "../pages/boards/MateBoardForm"
import MateBoardEditForm from "../pages/boards/MateBoardEditForm"
import CourseForm from "../pages/boards/CourseForm"
import Course from "../pages/boards/Course"
import MapComponentBox from "../components/MapComponentBox"
import CourseDetail from "../pages/boards/CourseDetail"
import CourseUpdateForm from "../pages/boards/CourseUpdateForm"

const routes = [
    // /users/:id
    // /users/:id/setting
    // /posts/:mate, course, photo, review }/:id
    // 
    {path:"/", element: <Home/>},
    {path:"/home-inter", element: <HomeInternational/>},
    {path:"/home-mate", element: <HomeMate/>},
    {path:"/users/:id", element: <MyPage/>},
    {path:"/users/:id/profile", element:<MyProfile/>},
    {path:"/users/:id/setting", element: <MyProfileForm/>},
    {path:"/sample", element: <Sample/>},
    {path:"/agreement", element: <Agreement/>},
    {path:"/signup", element: <Signup/>},
    {path:"/login", element: <LoginPage/>},
    {path:"/logout", element: <LogoutPage /> },
    {path:"/completedSignup", element:<CompletedSignup/>},
    {path:"/api/v1/auth/kakao/accessTokenCallback", element:<KakaoRedirect/>},
    {path:"/changePassword", element:<ChangePassword/>},
    {path:"/mateBoard", element:<MateBoard/>},
    {path:"/mateBoard/new", element:<MateBoardForm/>},
    {path:"/mateBoard/:num/edit", element:<MateBoardEditForm/>},
    {path:"/course", element:<Course/>},
    {path:"/course/new", element:<CourseForm/>},
    {path:"/mapcomponent", element:<MapComponentBox/>},
    {path:"/course/detail", element:<CourseDetail/>},
    {path:"/course/:id/edit", element:<CourseUpdateForm/>}

]

const router = createBrowserRouter([{
    path:"/",
    element: <App/>,
    children: routes.map((route)=>{
        return {
            index: route.path ==="/",
            path: route.path === "/" ? undefined : route.path,
            element: route.element
        }

    })
}])

export default router