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
import LoginListPage from "../pages/LoginListPage"
import Mypage from "../pages/myPage/Mypage"
import MyProfile from "../pages/myPage/MyProfile"
import MyProfileForm from "../pages/myPage/MyProfileForm"
import CompletedSignup from "../pages/CompletedSignup"

const routes = [
    // /users/:id
    // /users/:id/setting
    // /posts/:mate, course, photo, review }/:id
    // 
    {path:"/", element: <Home/>},
    {path:"/home-inter", element: <HomeInternational/>},
    {path:"/home-mate", element: <HomeMate/>},
    {path:"/users/:id", element: <Mypage/>},
    {path:"/users/:id/profile", element:<MyProfile/>},
    {path:"/users/:id/setting", element: <MyProfileForm/>},
    {path:"/sample", element: <Sample/>},
    {path:"/agreement", element: <Agreement/>},
    {path:"/signup", element: <Signup/>},
    {path:"/login", element: <LoginPage/>},
    {path:"/logout", element: <LogoutPage /> },
    {path:"/loginlist", element:<LoginListPage/>},
    {path:"/completedSignup", element:<CompletedSignup/>}
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