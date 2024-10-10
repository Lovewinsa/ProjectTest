import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import FroalaEditor from "react-froala-wysiwyg";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import LoadingAnimation from "../../components/LoadingAnimation"

function MateBoardEditForm(props) {
  //로딩 상태 추가
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  const [post, setPost] = useState({});

  const navigate = useNavigate();

  // 날짜 관리
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);

  // 날짜 초기화
  const handleDateReset = () => {
    setSelectedDateRange([null, null]); // 날짜 범위를 현재 날짜로 초기화
    setPost({
      ...post,
      startDate: "",
      endDate: "",
    });
  };
  // 현재 날짜로 돌아오는 함수 추가
  const handleTodayClick = () => {
    const today = new Date();
    setPost({
      ...post,
      startDate: today.toLocaleDateString("ko-KR"),
      endDate: today.toLocaleDateString("ko-KR"),
    });
    setSelectedDateRange([today, today]); // 현재 날짜로 설정
  };
  // 달력에서 날짜를 선택할 때 호출되는 함수
  const handleDateChange = (dateRange) => {
    setSelectedDateRange(dateRange);
    setPost({
      ...post,
      startDate: dateRange[0] ? dateRange[0].toLocaleDateString("ko-KR") : "",
      endDate: dateRange[1] ? dateRange[1].toLocaleDateString("ko-KR") : "",
    });
  };

  useEffect(() => {
    // 로딩 애니메이션을 0.5초 동안만 표시
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 700);

    axios
      .get(`/api/v1/posts/${id}/update`)
      .then((res) => {
        console.log(res.data);
        // 데이터 전달 확인
        setPost(res.data);
        setSelectedDateRange([res.data.startDate, res.data.endDate]);
      })
      .catch((error) => console.log(error));
  }, [id]);

  //수정 내용 put 요청
  const handleSubmit = () => {
    axios
      .put(`/api/v1/posts/${id}`, post)
      .then((res) => {
        console.log(post);
        //데이터 전달 확인
        alert("수정에 성공하였습니다.");
        navigate(`/posts/mate/${id}/detail`); // 상세 페이지로 돌려보내기
      })
      .catch((error) => console.log(error));
  };

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

  return (
    <div className="container mx-auto p-4 max-w-[900px]">
      {/* 로딩 애니메이션 */}
      {loading && <LoadingAnimation />}
      <div className=" h-full bg-gray-100 p-6">
        <NavLink
          className="px-4 py-2 text-sm font-medium rounded-md bg-gray-600 text-gray-100"
          to={`/posts/mate/${id}/detail`}>
          상세 페이지로
        </NavLink>

        <h3 className="mt-3">{id} 번 게시물 수정 폼</h3>

        {/* 태그 */}
        <div className="flex flex-wrap gap-2 mt-10">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">#{post.country}</span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">#{post.city}</span>
          {post.tags &&
            post.tags.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                {tag}
              </span>
            ))}
        </div>

        <form>
          <div className="m-3">
            <label className="font-semibold" htmlFor="title">
              제목
            </label>
            <input
              className="w-full border-gray-300 rounded-md"
              onChange={handleChange}
              type="text"
              id="title"
              name="title"
              value={post.title || ""}
            />
          </div>

          <div className="p-4">
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
              <strong>시작일 : {post.startDate}</strong>
            </p>
            <p>
              <strong>종료일 : {post.endDate}</strong>
            </p>
          </div>

          <div>
            <label className="font-semibold" htmlFor="content">
              내용
            </label>
            <FroalaEditor
              model={post.content}
              onModelChange={handleModelChange}
              config={{
                height: 200,
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            type="button"
            className="mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            수정
          </button>
        </form>
      </div>
    </div>
  );
}

export default MateBoardEditForm;
