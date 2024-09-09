import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.clear();
        dispatch({ type: "UPDATE_USER", payload: null });
        navigate('/');  // 홈 페이지 또는 로그인 페이지로 리다이렉트
        window.location.reload();  // 페이지 새로고침
    }, [dispatch, navigate]);

    return (
        <div>
            {/* 로그아웃 페이지 내용 */}
        </div>
    );
}

export default LogoutPage;
