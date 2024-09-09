import { Container, Nav, Navbar, NavbarBrand } from 'react-bootstrap';
import '../css/BsNavBar.css';
import { useState, useCallback, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import AlertModal from "./AlertModal";
import bootstrapBundleMin from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios';

function BsNavBar() {
    const username = useSelector(state => state.username, shallowEqual);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [alertShow, setAlertShow] = useState(false);
    const [openSections, setOpenSections] = useState({});
    const [lastVisited, setLastVisited] = useState('/');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profile, setProfile] = useState({});
    const [kakaoId, setKakaoId] = useState(null);  // 카카오 ID 상태 추가

    useEffect(() => {
        const token = localStorage.getItem('token');
        const kakaoToken = localStorage.getItem('KakaoToken');
        const KakaoId = localStorage.getItem('kakaoId');
        if (token || kakaoToken || username) {
            setIsLoggedIn(true);
            if(KakaoId){
                setKakaoId(JSON.parse(KakaoId))
            }
        } else {
            setIsLoggedIn(false);
        }
    }, [username]);

    const toggleSection = (section) => {
        setOpenSections(prevState => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };

    const handleLogout = () => {
        const kakaoToken = localStorage.getItem("KakaoToken");
        const kakaoId = localStorage.getItem("kakaoId");
    
        if (kakaoToken && kakaoId) {
            axios.post("/api/v1/auth/kakaoLogout", { kakaoId }, {
                headers: {
                    "Authorization": `Bearer ${kakaoToken.substring(7)}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            })
            .then(res => {
                console.log("카카오 로그아웃 성공:", res.data);
                localStorage.removeItem("KakaoToken");
                localStorage.removeItem("kakaoId");
                completeLogout();
            })
            .catch(error => {
                console.error("카카오 로그아웃 실패:", error);
                alert("로그아웃에 실패했습니다.");
            });
        } else {
            completeLogout();
        }
    };

    const completeLogout = () => {
        localStorage.clear();
        dispatch({ type: "UPDATE_USER", payload: null });
        setIsLoggedIn(false);
        navigate('/');
        window.location.reload();
    };

    const handleYes = () => {
        setAlertShow(false);
    };

    const handleLogin = useCallback(() => {
        navigate('/login');
    }, [navigate]);

    const handleLoginLogoutClick = () => {
        if (isLoggedIn) {
            handleLogout();
        } else {
            handleLogin('/login');
        }
    
        const offcanvasElement = document.getElementById('staticBackdrop');
        const offcanvasInstance = bootstrapBundleMin.Offcanvas.getInstance(offcanvasElement);
        if (offcanvasInstance) {
            offcanvasInstance.hide();
        }
    };

    const handleTripDuoClick = () => {
        navigate(lastVisited);
    };

    useEffect(()=>{      
        if(username){
            axios.get(`/api/v1/users/username/${username}`)
            .then(res=>{
                console.log(res);
                setProfile(res.data);
            })
            .catch(error => console.log(error));
        }    
    }, [username]);
    
    useEffect(() => {
        if (location.pathname === '/home-inter' || location.pathname === '/') {
            setLastVisited(location.pathname);
        }
    }, [location.pathname]);

    const myPageIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-person-square" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
        </svg>
    );

    const notification = (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
        </svg>
    );

    const toggleBtn = (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
        </svg>
    );

    return (
        <>
            <AlertModal show={alertShow} message={"로그아웃 되었습니다"} yes={handleYes} />

            <Navbar className="custom-navbar">
                <Container>
                    <button type="button" data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="staticBackdrop">
                        {toggleBtn}
                    </button>

                    <NavbarBrand href="#" className='appName' onClick={handleTripDuoClick}>
                        TripDuo
                    </NavbarBrand>

                    <Nav className="justify-content-end">
                        {isLoggedIn && <Nav.Link as={NavLink} to="/sample">{notification}</Nav.Link>}
                        {isLoggedIn && 
                        <Nav.Link as={NavLink} to={`/users/${profile.id}`}>
                            {profile.profilePicture != null
                                ? <img src={profile.profilePicture[0]} className='w-[30px] h-[30px] rounded-full' alt="Profile" />
                                : myPageIcon}
                        </Nav.Link>}
                        {isLoggedIn ? (
                            <Nav.Link as="button" onClick={handleLoginLogoutClick}><strong>로그아웃</strong></Nav.Link>
                        ) : (
                            <Nav.Link as={NavLink} to="/login"><strong>로그인/회원가입</strong></Nav.Link>
                        )}
                    </Nav>
                </Container>
            </Navbar>

            <Nav fill variant="tabs" defaultActiveKey="/">
                <Nav.Item>
                    <Nav.Link as={NavLink} to="/" onClick={() => setLastVisited('/')}>국내 여행</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={NavLink} to="/home-inter" onClick={() => setLastVisited('/home-inter')}>해외 여행</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={NavLink} to="/home-mate">여행 메이트</Nav.Link>
                </Nav.Item>
            </Nav>

            <div className="offcanvas offcanvas-start" data-bs-backdrop="static" tabIndex="-1" id="staticBackdrop" aria-labelledby="staticBackdropLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="staticBackdropLabel">
                        <button 
                            className="btn btn-link" 
                            onClick={handleLoginLogoutClick} 
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <strong>{isLoggedIn ? '로그아웃' : '로그인/회원가입'}</strong>
                        </button>
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body custom-canvas">
                    <ul className="list-group">
                        <li className="list-group-item">
                            <dt onClick={() => toggleSection('domestic')} className="toggle">
                                국내 여행
                            </dt>
                            <dl className={`content ${openSections.domestic ? 'open' : ''}`}>
                                <div className="ps-3">여행 기록</div>
                                <div className="ps-3">여행 계획</div>
                                <div className="ps-3">여행 메이트</div>
                                <div className="ps-3">여행 정보</div>
                                <div className="ps-3">커뮤니티</div>
                            </dl>
                        </li>

                        <li className="list-group-item">
                            <dt onClick={() => toggleSection('travelMate')} className="toggle">
                                여행 메이트
                            </dt>
                            <dl className={`content ${openSections.travelMate ? 'open' : ''}`}>
                                <div className="ps-3">전체 게시판</div>
                            </dl>
                        </li>

                        <li className="list-group-item">
                            <dt onClick={() => toggleSection('myPage')} className="toggle">
                                마이 페이지
                            </dt>
                            <dl className={`content ${openSections.myPage ? 'open' : ''}`}>
                                <div className="ps-3">여행 기록</div>
                                <div className="ps-3">여행 계획</div>
                                <div className="ps-3">관심 메이트</div>
                                <div className="ps-3">마이 플레이스</div>
                                <div className="ps-3">체크 리스트</div>
                                <div className="ps-3">예산 관리</div>
                            </dl>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default BsNavBar;
