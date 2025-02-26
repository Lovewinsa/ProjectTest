import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import axios from 'axios'; // axios import
import { decodeToken } from 'jsontokens'; // decodeToken import
import '../css/LoginPage.css';
import GoogleAuthLogin from "../components/GoogleAuthLogin";
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

    const handleLogin = () => {
        if (!state.username || !state.password) {
            setError("아이디와 비밀번호를 모두 입력해주세요.");
            return;  
        }   

        axios.post("/api/v1/auth/login", state)
            .then(res => {
                const token = res.data;
                localStorage.setItem('token', token);
                setError(false);

                const result = decodeToken(token.substring(7)); // 'Bearer+' 제거
                const username = result.payload.sub;
                dispatch({ type: "UPDATE_USER", payload: username });
                axios.defaults.headers.common["Authorization"] = token;

                navigate('/'); // 로그인 성공 시 리다이렉트
            })
            .catch(() => {
                setError("로그인에 실패했습니다.");  // 에러 메시지 설정
            });
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
                <GoogleAuthLogin show={true} className="google-auth-login" />
                <p>회원가입 하지 않으셨다면 <Nav.Link as={NavLink} to="/agreement">클릭</Nav.Link></p>
            </div>
        </div>
    );
}

export default LoginPage;
