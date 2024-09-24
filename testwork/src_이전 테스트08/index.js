import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import router from './router/router';
import { decodeToken } from 'jsontokens';
import axios from 'axios';
import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';

const userData = {
  id: null,      
  username: null,
  nickname: null,
  profilePicture: null
}

const loginStatus = {
  isLogin: false,
  role: null     
}

if (localStorage.token) {
  const result = decodeToken(localStorage.token.substring(7))
  const expTime = result.payload.exp * 1000
  const now = new Date().getTime()
  if (expTime > now) {

    userData.id = result.payload.id
    userData.username = result.payload.username
    userData.nickname = result.payload.nickname
    userData.profilePicture = "https://dudszofpa0onq.cloudfront.net/" + result.payload.profilePicture
    
    axios.defaults.headers.common["Authorization"] = localStorage.token
  } else {
    delete localStorage.token
  }
}

const initialState = { userData, loginStatus }

const reducer = (state = initialState, action) => {
  let newState;

  switch (action.type) {
      case "LOGIN_USER":
          newState = {
              ...state,
              userData: {
                  ...state.userData,
                  id: action.payload.id,           
                  username: action.payload.username,
                  nickname: action.payload.nickname,
                  profilePicture: action.payload.profilePicture
              },
              loginStatus: {
                  ...state.loginStatus,
                  isLogin: true,
                  role: action.payload.role
              }
          };
          break;

      case "LOGOUT_USER":
          newState = {
              ...state,
              userData: {
                  id: null,
                  username: null,
                  nickname: null,
                  profilePicture: null
              },
              loginStatus: {
                  isLogin: false,
                  role: null
              }
          };
          break;

      case "UPDATE_USER":
          newState = {
              ...state,
              userData: {
                  ...state.userData,
                  username: action.payload.username,
                  nickname: action.payload.nickname,
                  profilePicture: action.payload.profilePicture
              }
          };
          break;

      default:
          newState = state;
          break;
  }

  return newState;
};

const store = createStore(reducer)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>

);

reportWebVitals();