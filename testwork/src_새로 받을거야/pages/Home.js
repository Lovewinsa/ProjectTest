import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import '../css/Home.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import LoadingAnimation from '../components/LoadingAnimation';

function Home() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        // 로딩 애니메이션을 0.5초 동안만 표시
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 700)
    }, [])
    const [currentSlide, setCurrentSlide] = useState(0); // 현재 슬라이드 상태 추가
    const [matePosts, setMatePosts] = useState([]); // 메이트 게시물 상태
    const [sortBy, setSortBy] = useState("viewCount"); // 정렬 기준 초기값 설정
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태
    const [writerProfile, setWriterProfile] = useState({});
    const [sliderRef, slider] = useKeenSlider({
        loop: true,
        slides: {
            perView: 3,
            spacing: 10, // 간격을 0으로 설정
        },
        breakpoints: {
            '(max-width: 1024px)': {
                slides: { perView: 2 },
            },
            '(max-width: 768px)': {
                slides: { perView: 1 },
            },
        },
        dragSpeed: 0.5,
        slideChanged(s) {
            setCurrentSlide(s.track.details.rel); // 슬라이드가 변경될 때 현재 슬라이드 업데이트
        },
    });

   // 버튼을 클릭했을 때 실행할 함수 정의
    const handlePrev = () => {
        if (slider.current) slider.current.prev();
    };

    const handleNext = () => {
        if (slider.current) slider.current.next();
    };

    // 점 클릭 시 해당 슬라이드로 이동
    const handleDotClick = (index) => {
        if (slider.current) slider.current.moveToIdx(index);
    };

    const navigateToMate = (destination) => {
        navigate(`/posts/mate?di=${destination}`);
    };

    const navigateToCourse = (destination) => {
        navigate(`/posts/course?di=${destination}`);
    };

    const navigateToPage = (path) => {
        navigate(path);
    };

    const navigateToLogin = () => {
        navigate("/login"); // 로그인 페이지로 이동
    };

    const isLoggedIn = localStorage.getItem("token") !== null; // 토큰이 존재하는지 확인

    useEffect(() => {
        const MatePosts = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('/api/v1/posts/mate');
                console.log(response.data); // API 응답 데이터 확인

                // posts를 response.data.list에서 추출
                const posts = response.data.list; 

                // posts가 배열인지 확인
                console.log(Array.isArray(posts)); // true여야 함

                // 정렬 및 필터링 로직
                const sortedPosts = Array.isArray(posts) ? posts.sort((a, b) => {
                    if (sortBy === "viewCount") {
                        return b.viewCount - a.viewCount; // 조회수 순
                    } else if (sortBy === "likeCount") {
                        return b.likeCount - a.likeCount; // 좋아요 순
                    }
                    return 0; // 기본값
                }) : []; // posts가 배열이 아닐 경우 빈 배열로 초기화

                const topThreePosts = sortedPosts.slice(0, 3); // 상위 3개 게시물
                setMatePosts(topThreePosts);
            } catch (error) {
                console.error("게시물 로딩 중 오류 발생:", error);
            } finally {
                setIsLoading(false);
            }
        };

        MatePosts();
    }, [sortBy]);

    useEffect(() => {
        if (location.state && location.state.needLogout) {
          // 로그아웃 처리
          dispatch({ type: "LOGOUT_USER", payload: null })
          localStorage.clear()
          
          // 상태 초기화 (새로고침 효과)
          navigate("/", { replace: true })
        }
      }, [location, dispatch, navigate])


    if (isLoading) {
        return <p>로딩 중...</p>;
    }
    
    return (
        <div className="container mx-auto px-8 bg-white min-h-screen">
            {loading && <LoadingAnimation />}
            <div className="my-12 relative">
                <header className="py-8 text-center">
                    <h1 className="text-3xl font-bold text-green-600">국내 여행</h1>
                    <p className="mt-2 text-gray-600">다양한 국내 여행 정보를 만나보세요!</p>
                </header>
                <div className="relative">
                 {/* 슬라이더 */}
                    <div ref={sliderRef} className="keen-slider w-full my-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                            <div key={item} className="keen-slider__slide flex justify-center">
                                <div className="w-[90vw] max-w-[350px] h-[450px] bg-white shadow-lg rounded-lg overflow-hidden">
                                    <img
                                        src={`https://picsum.photos/350/450?random=${item}`}
                                        alt={`여행지 ${item}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 왼쪽(이전) 버튼 */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 bg-transparent text-green-600 rounded-none p-0 text-3xl z-10 transition-transform duration-200 hover:scale-150"
                        style={{ width: '50px', height: '50px' }} // 버튼 크기 설정
                    >
                        &#8592; {/* 왼쪽 화살표 */}
                    </button>

                    {/* 오른쪽(다음) 버튼 */}
                    <button
                        onClick={handleNext}
                        className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 bg-transparent text-green-600 rounded-none p-0 text-3xl z-10 transition-transform duration-200 hover:scale-150"
                        style={{ width: '50px', height: '50px' }} // 버튼 크기 설정
                    >
                        &#8594; {/* 오른쪽 화살표 */}
                    </button>
                    {/* 슬라이드 점들 */}
                    <div className="flex justify-center mt-4">
                        {[...Array(10)].map((_, index) => (
                            <div
                                key={index}
                                onClick={() => handleDotClick(index)} // 점 클릭 시 해당 슬라이드로 이동
                                className={`w-3 h-3 mx-1 rounded-full cursor-pointer transition-all duration-200 ${
                                    currentSlide === index ? "bg-green-600 scale-125" : "bg-gray-300"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="my-12 h-16" />

            <div className="flex items-center justify-between mb-8 p-4 bg-green-300 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-white">여행메이트 찾기</h3>
                <div className="flex space-x-4">
                    <div
                        className="relative min-w-[80px] cursor-pointer"
                        onClick={() => navigateToMate("Domestic")}
                    >
                        <img src="https://picsum.photos/80/80?random=1" alt="국내" className="rounded-full border-2 border-white shadow-md" />
                        <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">국내</span>
                    </div>
                    <div
                        className="relative min-w-[80px] cursor-pointer"
                        onClick={() => navigateToMate("International")}
                    >
                        <img src="https://picsum.photos/80/80?random=2" alt="해외" className="rounded-full border-2 border-white shadow-md" />
                        <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">해외</span>
                    </div>
                </div>
            </div>


            <div className="flex items-center justify-between mb-8 p-4 bg-green-300 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-white">여행 코스 검색</h3>
                <div className="flex space-x-4">
                    <div
                        className="relative min-w-[80px] cursor-pointer"
                        onClick={() => navigateToCourse("Domestic")}
                    >
                        <img src="https://picsum.photos/80/80?random=1" alt="국내" className="rounded-full border-2 border-white shadow-md" />
                        <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">국내</span>
                    </div>
                    <div
                        className="relative min-w-[80px] cursor-pointer"
                        onClick={() => navigateToCourse("International")}
                    >
                        <img src="https://picsum.photos/80/80?random=2" alt="해외" className="rounded-full border-2 border-white shadow-md" />
                        <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">해외</span>
                    </div>
                </div>
            </div>

            <div className="my-12 h-16" />

            <div className="my-12">
                <h3 className="text-xl font-semibold mb-4 text-green-600">국내 인기 게시물</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {matePosts.map((post) => (
                        <div 
                            key={post.id} 
                            className="relative bg-white shadow-lg rounded-lg overflow-hidden flex flex-col transition-transform cursor-pointer"
                            onClick={() => navigate(`/posts/mate/${post.id}/detail`)} // 클릭 시 해당 게시물로 이동
                        >
                            <div className="h-32 w-full bg-gray-300" />
                            <div className="flex justify-center -mt-16">
                                {post.writerProfile && post.writerProfile.profilePicture ? (
                                    <img src={post.writerProfile.profilePicture} className="w-20 h-20 rounded-full" alt="작성자 프로필" />
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="100"
                                        height="100"
                                        fill="currentColor"
                                        className="bi bi-person-circle"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                        <path
                                            fillRule="evenodd"
                                            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.206 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                                        />
                                    </svg>
                                )}
                            </div>
                            <div className="p-4 text-center flex-grow">
                                <h4 className="font-bold text-lg">{post.writer}</h4>
                                <p className="text-gray-600">{post.content || '여행을 좋아하는 메이트입니다.'}</p>
                                <p className="text-gray-500">좋아요: {post.likeCount}</p>
                                <p className='text-gray-500'>조회수: {post.viewCount}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            <div className="my-12 h-16" />

            <div className="my-12">
                <h3 className="text-xl font-semibold mb-4 text-green-600">국내 추천 여행지(임시)</h3>
                {!isLoggedIn && ( // 로그인하지 않은 경우에만 보이도록 수정
                    <p className="text-gray-600 text-sm text-left mb-4">
                        <span className='cursor-pointer' onClick={navigateToLogin}>로그인</span> 하시면, 고객님만을 위한 여행지를 추천해드립니다.
                    </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((product) => (
                        <div key={product} className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <img src={`https://picsum.photos/200/150?random=${product + 5}`} alt={`여행지 ${product}`} className="w-full h-32 object-cover" />
                            <div className="p-4">
                                <h4 className="font-bold">{`여행지 ${product}`}</h4>
                                <p className="text-gray-600">여행지 이름</p>
                                <button className="mt-2 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300">
                                    더 보기
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="my-12 h-16" />

            {/* 추가된 카드들 */}
            <div className="my-12">
                <h3 className="text-xl font-semibold mb-4 text-green-600">여행을 쉽고 간편하게</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <img src="https://picsum.photos/200/150?random=11" alt="여행 체크리스트" className="w-full h-32 object-cover" />
                        <div className="p-4">
                            <h4 className="font-bold text-lg">여행 체크리스트</h4>
                            <button onClick={() => navigateToPage("/checklist")} className="mt-2 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300">
                                작성하기
                            </button>
                        </div>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <img src="https://picsum.photos/200/150?random=12" alt="환율 정보" className="w-full h-32 object-cover" />
                        <div className="p-4">
                            <h4 className="font-bold text-lg">환율 정보</h4>
                            <button onClick={() => navigateToPage("/exchange")} className="mt-2 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300">
                                살펴보기
                            </button>
                        </div>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <img src="https://picsum.photos/200/150?random=13" alt="여행 경비 계산기" className="w-full h-32 object-cover" />
                        <div className="p-4">
                            <h4 className="font-bold text-lg">여행 경비 계산기</h4>
                            <button onClick={() => navigateToPage("/calculator")} className="mt-2 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300">
                                계산하기
                            </button>
                        </div>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <img src="https://picsum.photos/200/150?random=14" alt="여행 플레너" className="w-full h-32 object-cover" />
                        <div className="p-4">
                            <h4 className="font-bold text-lg">여행 플레너</h4>
                            <button onClick={() => navigateToPage("/planner")} className="mt-2 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300">
                                계획짜기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;