import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedOption, setSelectedOption] = useState("국내");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        if (location.pathname === "/home-abroad") {
            setSelectedOption("해외");
        } else {
            setSelectedOption("국내");
        }
    }, [location.pathname]);

    const [searchParams, setSearchParams] = useState({
        city: "",
        startDate: "",
        endDate: "",
    });

    const handleSelect = (eventKey) => {
        setSelectedOption(eventKey === "Home" ? "국내" : "해외");
        if (eventKey === "Home") {
            navigate("/");
        } else if (eventKey === "international") {
            navigate("/home-abroad");
        }
        setDropdownOpen(false); // Close dropdown after selection
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        const { city, startDate, endDate } = searchParams;
        console.log("Searching with params:", { city, startDate, endDate });
        
        navigate(`/posts/mate?city=${city}&startdate=${startDate}&enddate=${endDate}&di=Domestic`);
    };

    const [events, setEvents] = useState({});
    const [newEvent, setNewEvent] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [visibleDates, setVisibleDates] = useState({});

    useEffect(() => {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
        setNewDate(dateStr);
        setNewTime(timeStr);
    }, []);

    const addEvent = () => {
        if (!newEvent || !newDate || !newTime) return;

        const updatedEvents = { ...events };
        if (!updatedEvents[newDate]) {
            updatedEvents[newDate] = [];
        }

        updatedEvents[newDate].push({ time: newTime, event: newEvent });
        setEvents(updatedEvents);
        setNewEvent('');
        setNewDate('');
        setNewTime('');
    };

    const toggleVisibility = (date) => {
        setVisibleDates({
            ...visibleDates,
            [date]: !visibleDates[date],
        });
    };

    return (
        <div className="container mx-auto px-4">
            <div className="flex justify-end pt-2 relative">
                <button
                    className="inline-flex justify-center w-24 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    {selectedOption}
                </button>
                {dropdownOpen && (
                    <div className="absolute right-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1" role="menu" aria-orientation="vertical">
                            <button onClick={() => handleSelect("Home")} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">국내</button>
                            <button onClick={() => handleSelect("international")} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">해외</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="my-4">
                <h2 className="text-2xl font-bold text-center">여행 메이트 찾기</h2>
                <form className="mt-4 max-w-lg mx-auto">
                    <div className="mb-4">
                        <label className="block text-gray-700">여행지</label>
                        <input
                            type="text"
                            placeholder="여행지를 입력하세요..."
                            name="city"
                            value={searchParams.city}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">출발일</label>
                        <input
                            type="date"
                            name="startDate"
                            value={searchParams.startDate}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">귀국일</label>
                        <input
                            type="date"
                            name="endDate"
                            value={searchParams.endDate}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                    >
                        검색
                    </button>
                </form>
            </div>

            <div className="my-4">
                <h3 className="text-xl font-semibold">추천 여행 메이트</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((mate) => (
                        <div key={mate} className="bg-white shadow-md rounded-lg overflow-hidden">
                            <img src={`https://picsum.photos/200/150?random=${mate}`} alt={`여행 메이트 ${mate}`} className="w-full h-32 object-cover" />
                            <div className="p-4">
                                <h4 className="font-bold">여행 메이트 {mate}</h4>
                                <p>이 메이트는 {mate}번 여행 스타일을 선호합니다.</p>
                                <button className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                                    프로필 보기
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="my-4">
                <h3 className="text-xl font-semibold">인기 여행지</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((dest) => (
                        <div key={dest} className="bg-white shadow-md rounded-lg overflow-hidden">
                            <img src={`https://picsum.photos/200/150?random=${dest + 3}`} alt={`여행지 ${dest}`} className="w-full h-32 object-cover" />
                            <div className="p-4">
                                <h4 className="font-bold">여행지 {dest}</h4>
                                <p>이 여행지는 {dest}번 여행 스타일과 잘 어울립니다.</p>
                                <button className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                                    더 알아보기
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="my-4">
                <h3 className="text-xl font-semibold">사용자 리뷰 및 성공 사례</h3>
                <ul className="list-disc list-inside mt-4">
                    <li>리뷰 1: 이 사이트를 통해 최고의 여행 메이트를 만났어요!</li>
                    <li>리뷰 2: 함께한 여행이 잊을 수 없는 추억이 되었어요.</li>
                    <li>리뷰 3: 다음 여행도 여기서 메이트를 구할 거예요!</li>
                </ul>
            </div>

            <div className="my-4">
                <h3 className="text-xl font-semibold">뉴스레터 가입</h3>
                <form className="mt-4 max-w-lg mx-auto">
                    <div className="mb-4">
                        <label className="block text-gray-700">이메일 주소</label>
                        <input
                            type="email"
                            placeholder="이메일을 입력하세요..."
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="button"
                        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                    >
                        가입하기
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Home;
