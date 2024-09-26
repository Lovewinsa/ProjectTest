import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

function KakaoRedirect(props) {
    // 로그인 성공시 MyPage로 이동
    const navigate = useNavigate();


    // 현재 사이트 URL 중 code 뒷 부분을 가져오는 코드
    const code = new URL(window.location.href).searchParams.get("code")
    console.log(code)
    

    const header ={
    "Content-Type" : "application/x-www-form-urlencoded;charset=utf-8"
     };

    // useEffect(함수, 반배열) 함수는 component가 활성화 될 때 최도 1번 호출된다. 
    useEffect(() => {
        // 백엔드로에게 인가코드 넘기고 토큰받기 
        axios.get("/api/v1/auth/kakao/accessTokenCallback?code="+code, {
            headers:header,
        })
        .then(res=>{
            const token = res.data;
                window.localStorage.setItem("KakaoToken", token);
                // 로그인 성공 시 MyPage로 이동
                console.log(token)
                const authHeader = token.substring(7)
                if(token){
                    axios.get("/api/v1/auth/kakaoLogin",{
                        headers : {"Authorization": `Bearer ${token}`, 
                                    header,
                        },
                    })
                    .then(res=>{
                        console.log(res.data)
                        window.localStorage.setItem("kakaoId", JSON.stringify(res.data.id))
                        navigate('/');  // 홈 페이지로 리디렉트
                        window.location.reload();  // 페이지 새로고침
                    })
                    .catch(error=>{
                        console.log("kakao 정보 가져오기 실패")
                        

                    });
                }
        })
        .catch(error=>{
            console.log(error)
        });
        
    },[code])

    
        
    return (
        <div>
            <p>카카오 로그인중입니다.</p>
        </div>
    );
}

export default KakaoRedirect;