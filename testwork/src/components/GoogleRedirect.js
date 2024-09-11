import axios from 'axios';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function GoogleAuthLogin() {
// 현재 사이트 URL 중 code 뒷 부분을 가져오는 코드
const code = new URL(window.location.href).searchParams.get("code")
const encode = encodeURIComponent(code)
console.log(code)

const header ={
"Content-Type" : "application/x-www-form-urlencoded;charset=utf-8"
 };

// useEffect(함수, 반배열) 함수는 component가 활성화 될 때 최도 1번 호출된다. 
useEffect(() => {
    //백엔드로에게 인가코드 넘기고 토큰 받기 
    axios.get("/api/v1/auth/google/accessTokenCallback?code="+code)
    .then(res=>{
        const token = res.data;
            window.localStorage.setItem("GoogleToken", token);
            console.log(token)
            const authHeader = token.substring(7)
            if(token){
                axios.get("/api/v1/auth/googleLogin",{
                    headers : {"Authorization": `Bearer ${token}`, 
                                header,
                    },
                })
                .then(res=>{
                    console.log(res.data)
                    window.localStorage.setItem("GoogleID", JSON.stringify(res.data.id))
                })
                .catch(error=>{
                    console.log("Google 정보 가져오기 실패")
                });
            }
    })
    .catch(error=>{
        console.log(error)
    });
    
},[code])

    return (
        <div>
             <p>구글 로그인중입니다.</p>
        </div>
    );
}

export default GoogleAuthLogin;
