import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// App.js 를 import 해서 
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
// src/router/router.js 를 import
import router from './router/router';
import { decodeToken } from 'jsontokens';
import axios from 'axios';
// legacy_createStore 를 createStore 라는 이름으로 사용하기 (store 를 만들 함수)
import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';

// token 이 존재 한다면 token 에서 값을 읽어와서 저장할 변수 만들기
let username=null

//만일 토큰이 존재한다면
if(localStorage.token){
  //토큰을 디코딩 ( 앞에 7 자리를 제거한 , Bearer+ 를 제거한 문자열을 디코딩)
  const result = decodeToken(localStorage.token.substring(7))
  console.log("토큰을 디코딩한 결과 확인해 보기")
  console.log(result)
  //expire 되는 시간이 초 단위로 저장되어 있으므로 1000 을 곱해서 ms 초 단위로 만든다
  const expTime = result.payload.exp*1000
  //현재 시간 ms 초 단위로 얻어내기 
  const now = new Date().getTime() 
  //만일 유효기간이 만료 되지 않았다면 
  if(expTime > now){
    //토큰에 저장되어 있는 subject (username) 을 변수에 담는다. 
    username=result.payload.sub
    console.log(username)
    console.log(typeof(username))
    //axios 의 header 에 인증정보를 기본으로 가지고 갈수 있도록 설정 
    axios.defaults.headers.common["Authorization"]=localStorage.token
  }else{
    //만료된 토큰은 삭제한다 
    delete localStorage.token
  }
}

//로그인 모달 관리하기 위한 object
const loginModal={
  show:false,
  message:""
}

// store 에서 관리될 state 의 초기값
const initialState={ username, loginModal }

//reducer 함수 (action 을 발행하면 호출되는 함수)
const reducer = (state=initialState, action)=>{
  let newState
  if(action.type === "UPDATE_USER"){
    newState={
      ...state,
      username:action.payload
    }
  }else if(action.type === "LOGIN_MODAL"){
    newState={
      ...state,
      loginModal: action.payload
    }
  }else{
    newState=state
  }

  return newState
}
// reducer 함수를 전달하면서 store(저장소) 를 만든다
const store=createStore(reducer)

//id 가 root 인 곳에 UI 출력하기 
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>

);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();