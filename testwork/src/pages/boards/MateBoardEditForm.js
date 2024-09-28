import axios from "axios";
import React, { useEffect, useState } from "react";
import FroalaEditor from "react-froala-wysiwyg";
import { Link, useNavigate, useParams } from "react-router-dom";

function MateBoardEditForm(props) {
  const { id } = useParams();

  const [post, setPost] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/v1/posts/${id}/update`)
      .then((res) => {
        console.log(res.data);
        // 데이터 전달 확인
        setPost(res.data); // 저장된 내용을 model 을 통해 Froala 에디터에 전달
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
      <Link to={`/posts/mate/${id}/detail`}>상세 페이지로</Link>

      <h3>{id} 번 게시물 수정 폼</h3>

      {/* 태그 */}
      <div className="flex flex-wrap gap-2 m-3">
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
          <label htmlFor="title">제목</label>
          <input onChange={handleChange} type="text" id="title" name="title" value={post.title || ""} />
        </div>

        <div>
          <label htmlFor="content">내용</label>
          <FroalaEditor model={post.content} onModelChange={handleModelChange} />
        </div>
        
        <button
          onClick={handleSubmit}
          type="button"
          className="mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          수정
        </button>
      </form>
    </div>
  );
}

export default MateBoardEditForm;
