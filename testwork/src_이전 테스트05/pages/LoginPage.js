import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import axios from 'axios';
import { decodeToken } from 'jsontokens';
import '../css/LoginPage.css';
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function LoginPage() {
    const [state, setState] = useState({
        username: '',
        password: ''
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const kakaoToken = localStorage.getItem('KakaoToken');
        
        if (token || kakaoToken) {
            // 토큰이 있는 상태라면 홈으로 리디렉션
            navigate('/');
        }
    }, [navigate]);

    const processToken = (token) => {
        localStorage.setItem('token', token);
        const result = decodeToken(token.substring(7)); // 'Bearer+' 제거
        const username = result.payload.sub;
        dispatch({ type: "UPDATE_USER", payload: username });
        axios.defaults.headers.common["Authorization"] = token;
        navigate('/'); // 로그인 성공 시 리다이렉트
        window.location.reload();  // 페이지 새로고침
    };

    const handleLogin = () => {
        if (!state.username || !state.password) {
            setError("아이디와 비밀번호를 모두 입력해주세요.");
            return;  
        }   

        axios.post("/api/v1/auth/login", state)
            .then(res => {
                processToken(res.data);
            })
            .catch(() => {
                setError("로그인에 실패했습니다.");  // 에러 메시지 설정
            });
    };

    const G_REDIRECT_URL = "http://localhost:3000/api/v1/auth/google/accessTokenCallback";
    const G_CLIENT_ID_API_KEY = "813308724720-70o3vscmtc40nt6v9llmj7t96l28k3sp.apps.googleusercontent.com";
    const googleURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${G_CLIENT_ID_API_KEY}&redirect_uri=${G_REDIRECT_URL}&response_type=code&scope=email profile`;

    const K_REST_API_KEY = 'ea3fc29935a7e7b17c9a328b221b9488';
    const k_REDIRECT_URL = "http://localhost:3000/api/v1/auth/kakao/accessTokenCallback";
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${K_REST_API_KEY}&redirect_uri=${k_REDIRECT_URL}&response_type=code`;

    const handleGoogleLogin = () => {
        window.location = googleURL;
    };

    const handleKakaoLogin = () => {
        window.location = kakaoURL;
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>로그인</h2>
                <div className="login-form">
                    <label htmlFor="username">User Name</label>
                    <input 
                        type="text" 
                        name="username" 
                        id="username"
                        value={state.username} 
                        placeholder="User Name..." 
                        onChange={handleChange} 
                    />
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password"
                        value={state.password} 
                        placeholder="Password..." 
                        onChange={handleChange} 
                    />
                    {error && <div style={{ color: 'red' }}>{error}</div>} 
                    <button onClick={handleLogin} className="login-button">로그인</button>
                </div>
                <img className="logo" alt="IconImage" src="/img/KakaoLogin.png" onClick={handleKakaoLogin} />
                <button onClick={handleGoogleLogin}>구글 로그인</button>
                <p>회원가입 하지 않으셨다면 <Nav.Link as={NavLink} to="/agreement">클릭</Nav.Link></p>
            </div>
        </div>
    );
}

export default LoginPage;
