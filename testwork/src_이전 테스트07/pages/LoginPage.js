import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import { decodeToken } from "jsontokens";
import "../css/LoginPage.css";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function LoginPage() {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const kakaoToken = localStorage.getItem("KakaoToken");

    if (token || kakaoToken) {
      // 토큰이 있는 상태라면 홈으로 리디렉션
      navigate("/");
    }
  }, [navigate]);

  const processToken = (token) => {
    if (token.startsWith("Bearer+")) {
      localStorage.setItem("token", token);
      const result = decodeToken(token.substring(7));

      const userData = {
        id: result.payload.id,
        username: result.payload.username,
        nickname: result.payload.nickname,
        profilePicture: result.payload.profilePicture,
      };

      const loginStatus = {
        isLogin: true,
        role: result.payload.role,
      };

      dispatch({ type: "LOGIN_USER", payload: { userData, loginStatus } });
      axios.defaults.headers.common["Authorization"] = token;
      navigate("/");
      window.location.reload();
    }
  };

  const handleLogin = () => {
    if (!loginData.username || !loginData.password) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    axios
      .post("/api/v1/auth/login", loginData)
      .then((res) => {
        processToken(res.data);
      })
      .catch(() => {
        setError("로그인에 실패했습니다.");
      });
  };

  const googleURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_GOOGLE_LOGIN_API_KEY}&redirect_uri=${process.env.REACT_APP_GOOGLE_REDIRECT_URL}&response_type=code&scope=email profile`;

  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_LOGIN_API_KEY}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT_URL}&response_type=code`;

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
            value={loginData.username}
            placeholder="User Name..."
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={loginData.password}
            placeholder="Password..."
            onChange={handleChange}
          />
          {error && <div style={{ color: "red" }}>{error}</div>}
          <button onClick={handleLogin} className="login-button">
            로그인
          </button>
        </div>
        <img className="logo" alt="IconImage" src="/img/KakaoLogin.png" onClick={handleKakaoLogin} />
        <button onClick={handleGoogleLogin}>구글 로그인</button>
        <p>
          회원가입 하지 않으셨다면
          <Nav.Link as={NavLink} to="/agreement">
            클릭
          </Nav.Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
