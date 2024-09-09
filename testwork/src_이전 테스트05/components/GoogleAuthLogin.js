import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function GoogleAuthLogin() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // 사용자를 서버의 OAuth 엔드포인트로 리디렉션
    window.location.href = 'https://your-server.com/auth/google'; // 경로 설정 필요
  };

  useEffect(() => {
    // URL에서 토큰을 확인하는 로직
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token'); // 서버에서 리디렉션 시 전달한 토큰

    if (token) {
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem('token', token);
      // 인증된 상태로 라우트 이동
      navigate('/dashboard'); // 인증 후 이동할 페이지 경로
    }
  }, [navigate]);

  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
}

export default GoogleAuthLogin;
