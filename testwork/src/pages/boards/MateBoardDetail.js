
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { NavLink } from "react-router-dom";



function MateBoardDetail(props) {
  const {id} = useParams(); // 게시물 번호

  const username = useSelector(state => state.userData.username, shallowEqual); //로그인된 username

  const [post, setPost] = useState({tags:[]});
  const [isRecruited, setIsRecruited] = useState(false);

  // 작성자 프로필 설정
  const [writerProfile, setWriterProfile] = useState({});
  const [imageData, setImageData] = useState(null)

  //좋아요 버튼 설정
  const [isLiked, setIsLiked] = useState(false)

  const navigate = useNavigate()

  const buttonClasses = ` btn btn-sm ${
    isRecruited ? "btn-secondary" : "btn-success"
  }`;

  const handleRecruit = (e) => {
    setIsRecruited(!isRecruited);
  };

  const handleClick = () => {
    navigate(`/users/${writerProfile.id}/profile`);
  }

  const handleLike = ()=>{
    setIsLiked(!isLiked)
  }

  useEffect(() => {
    axios
      .get(`/api/v1/posts/${id}`)
      .then((res) => {
        //글 정보 전달 확인
        setPost(res.data);
        const id = res.data.userId  

        //유저 정보 받아서 state 값으로 저장
        axios.get(`/api/v1/users/${id}`)
        .then(res=>{
            //유저 정보 전달 확인
            setWriterProfile(res.data)
      })
        .catch(error=>console.log(error))
      })
      .catch((error) => console.log(error));
  }, [id]);
  return (
    <>
      <div className="container">
        <NavLink
          to={{
            pathname: "/posts/mate",
            search: post.country === "한국" ? "?di=Domestic" : "?di=International"
          }}
        >
          Mate
        </NavLink>

        <div className="flex flex-wrap gap-2 mt-2">
          {/* 태그s */}
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">
            #{post.country}
          </span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">
            #{post.city}
          </span>
          {post.tags && post.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center"
            >
              {tag}
            </span>
          ))}
        </div>
        {/* title */}
        <h5 className="m-3">
          {id}번 <strong>{post.title}</strong>
          <button
            className={`mx-3 ${
              isLiked ? "bg-pink-600" : "bg-pink-400"
            } text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
            type="button"
            onClick={handleLike}
          >
            Like
          </button>
          <span className="text-sm text-gray-500">
            <span className="mx-3">view.{post.viewCount}</span>
            <span>likes.{post.likeCount}</span>
          </span>
        </h5>

        {/* 프로필 */}
        <div className="container my-3">
          <div className="flex items-center gap-x-6">
            {writerProfile.profilePicture ? (
              <img src={writerProfile.profilePicture} className="w-20 h-20 rounded-full" alt="" />
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
            <div>
              <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">
                {writerProfile.nickname}
              </h3>
              <p className="text-sm font-semibold leading-6 text-indigo-600">
                {writerProfile.gender} / {writerProfile.age}
              </p>
            </div>
            <div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleClick}
              >
                프로필 보기
              </button>
            </div>
          </div>
        </div>

        <p>안녕하세요~</p>

        <a href="/">대충 경로 공유한 url</a>
        <br />
        <br />

        <div dangerouslySetInnerHTML={{ __html: post.content }}></div>

        <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>
              {post.country} / {post.city}
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              태그 / {post.tags}
            </Card.Subtitle>
            <Card.Text>저녁 7시 30분 tmp 역 앞 test 카페</Card.Text>
            <Button className={buttonClasses} onClick={handleRecruit}>
              {isRecruited ? "취소하기" : "신청하기"}
            </Button>
          </Card.Body>
        </Card>
      </div>

      {
        // 로그인된 username 과 post의 userId 로 불러온 작성자 아이디가 동일하면 랜더링
        username === writerProfile.username && (
          <div className="container mt-3">
            <Button
              className="m-1"
              onClick={() => navigate(`/posts/mate/${id}/edit`)}
            >
              수정
            </Button>
            <Button
              className="m-1"
              onClick={() => {
                axios
                  .delete(`/api/v1/posts/${id}`)
                  .then((res) => {
                    alert("글 삭제 성공");
                    // 국/해외 페이지 별 리다일렉트
                    post.country === "한국"
                      ? navigate(`/posts/mate?di=Domestic`)
                      : navigate(`/posts/mate?di=International`);
                  })
                  .catch((error) => console.log(error));
              }}
            >
              삭제
            </Button>
          </div>
        )
      }
    </>
  );
}

export default MateBoardDetail;
