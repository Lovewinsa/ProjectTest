import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import reportWebVitals from "./reportWebVitals"
import { RouterProvider } from "react-router-dom"
import router from "./router/router"
import { decodeToken } from "jsontokens"
import axios from "axios"
import { legacy_createStore as createStore } from "redux"
import { Provider } from "react-redux"

const userData = {
  id: null,
  username: null,
  nickname: null,
  profilePicture: null,
}

const loginStatus = {
  isLogin: false,
  role: null,
}

if (localStorage.token) {
  const result = decodeToken(localStorage.token.substring(7))
  const expirationTime = result.payload.exp * 1000
  const currentTime = Date.now()
  if (expirationTime > currentTime) {
    userData.id = result.payload.id
    userData.username = result.payload.username
    userData.nickname = result.payload.nickname
    userData.profilePicture = result.payload.profilePicture
    loginStatus.role = result.payload.role

    axios.defaults.headers.common["Authorization"] = localStorage.token
  } else {
    localStorage.removeItem("token")
  }
}

const initialState = { userData, loginStatus }

const reducer = (state = initialState, action) => {
  let newState

  switch (action.type) {
    case "LOGIN_USER":
      newState = {
        ...state,
        userData: {
          ...state.userData,
          id: action.payload.userData.id,
          username: action.payload.userData.username,
          nickname: action.payload.userData.nickname,
          profilePicture: action.payload.userData.profilePicture,
        },
        loginStatus: {
          ...state.loginStatus,
          isLogin: true,
          role: action.payload.loginStatus.role,
        },
      }
      break

    case "LOGOUT_USER":
      newState = {
        ...state,
        userData: {
          id: null,
          username: null,
          nickname: null,
          profilePicture: null,
        },
        loginStatus: {
          isLogin: false,
          role: null,
        },
      }
      break

    case "UPDATE_USER":
      newState = {
        ...state,
        userData: {
          ...state.userData,
          username: action.payload.userData.username,
          nickname: action.payload.userData.nickname,
          profilePicture: action.payload.userData.profilePicture,
        },
      }
      break

    default:
      newState = state
      break
  }

  return newState
}

const store = createStore(reducer)

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)

reportWebVitals()
