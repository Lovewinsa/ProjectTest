import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';

const CourseBoardDetail = () => {
  //"/posts/course/:id" 에서 id에 해당되는 경로 파라미터 값 얻어오기
  const { id } = useParams()
  //글 하나의 정보 상태값으로 관리
  // const [post, setPost] = useState()
  //검색 키워드 관련 처리
  const [params, setParams] = useSearchParams()
  //Confirm 모달을 띄울지 여부를 상태값으로 관리
  const [confirmShow, setConfirmShow] = useState(false)
  const navigate = useNavigate();

  //
  const post = {
    writer: 'aaaa',
    title: '여행 제목',
    country: '대한민국',
    city: '서울',
    tags: ['#여행', '#서울'],
    days: [
      {
        dayMemo: '첫날 메모',
        places: [
          { place_name: '경복궁', placeMemo: '궁전 방문' },
          { place_name: '인사동', placeMemo: '전통 문화 체험' },
        ],
      },
      {
        dayMemo: '둘째날 메모',
        places: [
          { place_name: '남산타워', placeMemo: '야경 감상' },
        ],
      },
    ],
  };

  //글 삭제를 눌렀을 때 호출되는 함수
  const deleteHandleYes = () => {
    axios.delete(`${id}`)
      .then(res => {
        console.log(res.data)
        navigate("/posts/course")
      })
      .catch(error => {
        console.log(error)
      })
  }

  // useEffect(() => {
  //   //서버에 요청을 할 때 검색 키워드 관련 정보도 같이 보낸다
  // const query = new URLSearchParams(params).toString()
  //   axios.get(`/api/v1/posts/course/${id}?${query}`)
  //     .then((response) => {
  //       setPost(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     });
  // }, [id]);

  //로그인된 사용자명이 store에 있는지 읽어와 본다
  const username = useSelector(state => state.username)

  return (
    <div className="container">
      <div className="flex flex-col h-screen bg-gray-100 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold mb-4">여행 코스 상세보기</h1>
          {
            username === post.writer && <>
              <button
                onClick={() => navigate(`/posts/course/${id}/edit`)}
                className="text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-4 py-2.5 text-center">
                수정
              </button>
              <button
                onClick={() => setConfirmShow(true)}
                className="text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-4 py-2.5 text-center">
                삭제
              </button>
            </>
          }
          <ConfirmModal  show={confirmShow} message="글을 삭제하시겠습니까?" 
                yes={deleteHandleYes} no={()=>setConfirmShow(false)}/>

          <button
            onClick={() => navigate("/posts/course")}
            className="text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-4 py-2.5 text-center">
            목록으로 돌아가기
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block font-semibold">제목</label>
            <p className="border p-2 w-1/2 bg-white">{post.title}</p>
          </div>
          <div>
            <label className="block font-semibold">여행할 나라</label>
            <p className="border p-2 w-1/4 bg-white">{post.country}</p>
          </div>
          <div>
            <label className="block font-semibold">여행할 도시</label>
            <p className="border p-2 w-1/4 bg-white">{post.city}</p>
          </div>
          <div>
            <label className="block font-semibold">태그</label>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 mt-6">
          {post.days.map((day, dayIndex) => (
            <div key={dayIndex} className="border p-4 rounded-lg bg-white shadow">
              <h2 className="text-xl font-semibold mb-4">Day {dayIndex + 1}</h2>
              <div className="mb-4">
                <label className="block font-semibold">Day Memo</label>
                <p className="border p-2 w-3/4 bg-white">{day.dayMemo}</p>
              </div>
              {day.places.map((place, placeIndex) => (
                <div key={placeIndex} className="mb-4">
                  <h3 className="font-semibold mb-2">{placeIndex + 1}번 장소</h3>
                  <p className="border p-2 w-full bg-white mb-2">{place.place_name}</p>
                  <label className="block font-semibold">장소 메모</label>
                  <p className="border p-2 w-full bg-white">{place.placeMemo}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseBoardDetail;
