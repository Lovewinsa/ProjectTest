import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";

// Require Editor CSS files.
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";

import axios from "axios";
import FroalaEditor from "react-froala-wysiwyg";
import { shallowEqual, useSelector } from "react-redux";
import Calendar from "react-calendar";
import moment from "moment";

function MateBoardForm(props) {
  //유저 정보 관리
  const userId = useSelector((state) => state.userData.id, shallowEqual);
  const nickname = useSelector((state) => state.userData.nickname, shallowEqual);
  const username = useSelector((state) => state.userData.username, shallowEqual);

  const [domesticInternational, setDomesticInternational] = useState();
  const [SearchParams, setSearchParams] = useSearchParams();
  const [post, setPost] = useState({}); // 게시물의 정보

  const navigate = useNavigate();

  //태그 관리
  const [tagInput, setTagInput] = useState("");
  const [postTags, setPostTags] = useState([]);

  // 날짜 관리
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  //나라별 도시 목록
  const citiesByCountry = {
    대한민국: ["서울", "부산", "제주", "인천"],
    일본: ["도쿄", "오사카", "교토", "삿포로"],
    중국: ["베이징", "상하이", "광저우", "시안"],
    인도: ["델리", "뭄바이", "콜카타", "벵갈루루"],
    스페인: ["바르셀로나", "그라나다", "마드리드", "세비야"],
    영국: ["런던", "맨체스터", "버밍엄", "리버풀"],
    독일: ["베를린", "뮌헨", "프랑크푸르트", "함부르크"],
    프랑스: ["파리", "마르세유", "리옹", "니스"],
    이탈리아: ["로마", "밀라노", "베네치아", "피렌체"],
    미국: ["뉴욕", "로스앤젤레스", "시카고", "마이애미"],
    캐나다: ["토론토", "밴쿠버", "몬트리올", "오타와"],
    브라질: ["상파울루", "리우데자네이루", "브라질리아", "살바도르"],
    호주: ["시드니", "멜버른", "브리즈번", "퍼스"],
    러시아: ["모스크바", "상트페테르부르크", "노보시비르스크", "예카테린부르크"],
    "남아프리카 공화국": ["케이프타운", "요하네스버그", "더반", "프리토리아"],
    // Add more countries and cities as needed
  };

  // 선택한 나라에 맞는 도시 목록을 얻음
  const cities = citiesByCountry[post.country] || []; //citiesByCountry[country]가 undefined 또는 null일 경우 빈 배열 반환

  //username 으로 로그인 여부 확인하여 로그인 하지 않으면 로그인 페이지로 넘기기
  useEffect(() => {
    username ?? navigate("/login");
  }, [username, navigate]);

  useEffect(
    (post) => {
      setDomesticInternational(SearchParams.get("di"));

      if (domesticInternational) {
        setPost({
          ...post,
          country: domesticInternational === "Domestic" ? "대한민국" : "",
          tags: [],
          viewCount: 10,
          likeCount: 10,
          rating: 80,
          status: "OPEN",
          city: "",
        });
      }
    },
    [domesticInternational]
  );

  // handleChange 처럼 Post 값으로 관리한다.
  const handleModelChange = (e) => {
    setPost({
      ...post,
      content: e,
    });
  };

  const handleChange = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    });
  };

  // 태그 입력 핸들러
  const handleTagInput = (e) => {
    const value = e.target.value;
    setTagInput(value);

    if (value.endsWith(" ") && value.trim() !== "") {
      const newTag = value.trim();
      if (newTag !== "#" && newTag.startsWith("#") && !postTags.includes(newTag)) {
        setPostTags([...postTags, newTag]);
        setTagInput("");
      }
    }
  };

  //태그 제거
  const removeTag = (tagToRemove) => setPostTags(postTags.filter((tag) => tag !== tagToRemove));

  const handleSubmit = async () => {
    if (!post.title) {
      alert("제목을 입력해주세요.");
      return;
    }
    
    const updatedPost = {
      ...post,
      tags: postTags,
      userId: userId,
      writer: nickname,
      startDate: startDate,
      endDate: endDate,
    };

    try {
      const response = await axios.post("/api/v1/posts/mate", updatedPost);

      alert("새 글 작성에 성공하였습니다.");
      navigate(`/posts/mate?di=${domesticInternational}`);
    } catch (error) {
      console.log(error);
    }
  };

  // 날짜 초기화
  const handleDateReset = () => {
    setSelectedDateRange([null, null]); // 날짜 범위를 현재 날짜로 초기화
    setStartDate("");
    setEndDate("");
  };
  // 현재 날짜로 돌아오는 함수 추가
  const handleTodayClick = () => {
    const today = new Date();
    setStartDate(today.toLocaleDateString("ko-KR"));
    setEndDate(today.toLocaleDateString("ko-KR"));
    setSelectedDateRange([today, today]); // 현재 날짜로 설정
  };
  // 달력에서 날짜를 선택할 때 호출되는 함수
  const handleDateChange = (dateRange) => {
    setSelectedDateRange(dateRange);
    setStartDate(dateRange[0] ? dateRange[0].toLocaleDateString("ko-KR") : "");
    setEndDate(dateRange[1] ? dateRange[1].toLocaleDateString("ko-KR") : "");
  };

  return (
    <div className="container mx-auto p-4 max-w-[900px]">
      <div className=" h-full bg-white p-6 shadow-lg rounded-lg">
        <NavLink
          className="px-4 py-2 text-sm font-medium rounded-md bg-gray-600 text-gray-100 mb-4"
          to={{
            pathname: "/posts/mate",
            search: `?di=${domesticInternational}`,
          }}>
          Mate
        </NavLink>

        <h3 className="mt-4">{domesticInternational} 게시판 작성 폼</h3>

        {/* 국가/도시 태그 선택 폼 */}
        <div className="m-3" onSubmit={(e) => e.preventDefault()}>
          <div>
            {/* 해외 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {domesticInternational === "International" && (
                <div className="flex flex-col">
                  <label htmlFor="city" className="font-semibold">
                    나라
                  </label>
                  <select
                    className="border-gray-300 rounded-md"
                    value={post.country}
                    name="country"
                    onChange={handleChange}>
                    <option value="">나라를 선택하세요</option>
                    <optgroup label="아시아">
                      <option value="일본">일본</option>
                      <option value="중국">중국</option>
                      <option value="인도">인도</option>
                    </optgroup>

                    <optgroup label="유럽">
                      <option value="영국">영국</option>
                      <option value="독일">독일</option>
                      <option value="스페인">스페인</option>
                      <option value="프랑스">프랑스</option>
                      <option value="이탈리아">이탈리아</option>
                    </optgroup>

                    <optgroup label="북아메리카">
                      <option value="미국">미국</option>
                      <option value="캐나다">캐나다</option>
                    </optgroup>

                    <optgroup label="남아메리카">
                      <option value="브라질">브라질</option>
                    </optgroup>

                    <optgroup label="오세아니아">
                      <option value="호주">호주</option>
                    </optgroup>

                    <optgroup label="기타">
                      <option value="러시아">러시아</option>
                      <option value="남아프리카 공화국">남아프리카 공화국</option>
                    </optgroup>
                  </select>
                </div>
              )}
              {post.country ? (
                <div className="flex flex-col">
                  <label htmlFor="city" className="font-semibold">
                    도시
                  </label>
                  <select className="border-gray-300 rounded-md" value={post.city} name="city" onChange={handleChange}>
                    <option value="">도시를 선택하세요</option>
                    {cities.map((cityOption) => (
                      <option key={cityOption} value={cityOption}>
                        {cityOption}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 my-2">
            {post.country ? (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">#{post.country}</span>
            ) : (
              ""
            )}

            {/* 도시 태그 출력*/}
            {post.city ? (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">#{post.city}</span>
            ) : (
              ""
            )}
          </div>

          {/* 태그 입력 폼 */}
          <div>
            <label htmlFor="tags" className="block font-semibold">
              태그
            </label>
            <input
              id="tags"
              value={tagInput}
              onChange={handleTagInput}
              placeholder="#태그 입력 후 스페이스바"
              className="border p-2 w-1/3 border-gray-300 rounded-md"
            />
            <div className="flex flex-wrap gap-2 my-2">
              {postTags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                  {tag}
                  <button
                    className="ml-2 p-0 h-4 w-4 text-black flex items-center justify-center"
                    onClick={() => removeTag(tag)}>
                    <span className="text-sm font-bold">&times;</span>
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="w-100">
            <label htmlFor="title" className="mt-3 font-semibold">
              제목
            </label>
            <input className="w-full border-gray-300 rounded-md" onChange={handleChange} type="text" id="title" name="title" />
          </div>

          <div className="bg-white p-4">
            <Calendar
              selectRange={true}
              onChange={handleDateChange}
              value={selectedDateRange || [new Date(), new Date()]} // 초기값 또는 선택된 날짜 범위
              formatDay={(locale, date) => moment(date).format("DD")}
              minDetail="month" // 상단 네비게이션에서 '월' 단위만 보이게 설정
              maxDetail="month" // 상단 네비게이션에서 '월' 단위만 보이게 설정
              navigationLabel={null}
              showNeighboringMonth={false} //  이전, 이후 달의 날짜는 보이지 않도록 설정
              calendarType="hebrew" //일요일부터 보이도록 설정
            />
            <button onClick={handleDateReset} className="bg-red-500 text-white px-4 py-2 ml-2">
              날짜 초기화
            </button>
            <button onClick={handleTodayClick} className="bg-green-500 text-white px-4 py-2 ml-2">
              오늘로 돌아가기
            </button>
          </div>

          <div className="my-3">
            <p>
              <strong>시작일 : {startDate}</strong>
            </p>
            <p>
              <strong>종료일 : {endDate}</strong>
            </p>
          </div>

          <div>
            <label htmlFor="content">내용</label>
            <FroalaEditor
              model={post.content}
              onModelChange={handleModelChange}
              config={{
                placeholderText: "정확한 장소 혹은 주소, 시간, 인원을 필수로 입력해 주세요.",
                height: 200,
              }}></FroalaEditor>
          </div>
        </div>
        <button
          className="px-4 py-2 text-sm font-medium rounded-md bg-gray-600 text-gray-100 mb-4"
          onClick={handleSubmit}>
          제출
        </button>
      </div>
    </div>
  );
}

export default MateBoardForm;
