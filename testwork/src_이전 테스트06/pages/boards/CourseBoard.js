import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";


function CourseBoard() {
    // 글 목록 페이지 정보
    const [pageInfo, setPageInfo] = useState({
        list: []
    })
    //검색 조건과 키워드를 상태값으로 관리
    const [searchState, setSearchState] = useState({
        condition: "",
        keyword: ""
    })
    // "/posts/course?pageNum=x"에서 pageNum을 추출하기 위한 Hook
    const [params, setParams] = useSearchParams({ pageNum: 1 })
    //페이징 숫자를 출력할 때 사용하는 배열을 상태값으로 관리
    const [pageArray, setPageArray] = useState([])

    const navigate = useNavigate()

    //글 목록 새로 읽어오는 함수
    const refresh = (pageNum) => {
        //검색 기능과 관련된 query 문자열 읽어오기
        const query = new URLSearchParams(searchState).toString()
        axios.get(`/api/v1/posts/course/?pageNum=${pageNum}&${query}`)
            .then(res => {
                //서버로부터 응답된 데이터 state에 넣기
                setPageInfo(res.data)
                //페이징 처리에 관련된 배열을 state로 넣기
                const result = range(res.data.startPageNum, res.data.endPageNum)
                setPageArray(result)
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        let pageNum = params.get("pageNum")
        if (pageNum == null)
            pageNum = 1
        refresh(pageNum)
    }, [params])

    //페이징 UI를 만들 때 사용할 배열 리턴하는 함수
    function range(start, end) {
        const result = []
        for (let i = start; i <= end; i++) {
            result.push(i)
        }
        return result
    }

    //페이지를 변경하는 함수
    const move = (pageNum = 1) => {
        //검색조건에 맞는 query 문자열 얻어내기
        const query = new URLSearchParams(searchState).toString()
        navigate(`/posts/course?pageNum=${pageNum}&${query}`)
    }

    //검색 조건을 변경하거나 검색어를 입력하면 호출되는 함수
    const handleSearchChange = (e) => {
        setSearchState({
            ...searchState,
            [e.target.name]: e.target.value  //검색조건 혹은 검색 키워드가 변경된 값을 반영
        })
    }

    //Reset 버튼을 눌렀을 때
    const handleReset = () => {
        //검색조건과 검색어 초기화
        setSearchState({
            condition: "",
            keyword: ""
        })
        //1페이지 내용이 보여지게
        move(1)
    }


    return (
        <div className="container mx-auto p-4">
      <Link to="/posts/course/new" className="text-blue-500">여행코스 계획하기</Link>
      <h2 className="text-2xl font-bold mb-4">국내여행 코스 게시판 입니다</h2>
      <label htmlFor="search">검색조건</label>
      <select
        onChange={handleSearchChange}
        value={searchState.condition}
        name="condition"
        id="search"
        className="border border-gray-300 p-2 rounded-md ml-2"
      >
        <option value="">선택</option>
        <option value="title_content">제목+내용</option>
        <option value="title">제목</option>
        <option value="writer">작성자</option>
      </select>
      <input
        onChange={handleSearchChange}
        value={searchState.keyword}
        type="text"
        placeholder="검색어..."
        name="keyword"
        className="border border-gray-300 p-2 rounded-md ml-2"
      />
      <button onClick={() => move()} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md">
        검색
      </button>
      <button onClick={handleReset} className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-md">
        Reset
      </button>
      
      <table className="min-w-full bg-white border-collapse">
        <thead>
          <tr>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border-b border-gray-300">좋아요</th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border-b border-gray-300">작성자</th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border-b border-gray-300">나라</th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border-b border-gray-300">도시</th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border-b border-gray-300">제목</th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border-b border-gray-300">조회수</th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border-b border-gray-300">태그</th>
          </tr>
        </thead>
        <tbody>
          {pageInfo.list.map((item) => (
            <tr key={item.num} className="bg-white hover:bg-gray-100">
              <td className="p-3 border-b border-gray-300">{item.likes}</td>
              <td className="p-3 border-b border-gray-300">{item.user_id}</td>
              <td className="p-3 border-b border-gray-300">{item.location_country}</td>
              <td className="p-3 border-b border-gray-300">{item.location_city}</td>
              <td className="p-3 border-b border-gray-300">{item.title}</td>
              <td className="p-3 border-b border-gray-300">{item.views}</td>
              <td className="p-3 border-b border-gray-300">{item.tags}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4">
        <strong>{pageInfo.totalRow}</strong>개의 글이 있습니다
      </p>

      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => move(pageInfo.startPageNum - 1)}
          className={`px-4 py-2 border rounded ${
            pageInfo.startPageNum === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100"
          }`}
          disabled={pageInfo.startPageNum === 1}
        >
          &laquo;
        </button>

        {pageArray.map((item) => (
          <button
            onClick={() => move(item)}
            key={item}
            className={`px-4 py-2 border rounded ${
              pageInfo.pageNum === item ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-100"
            }`}
          >
            {item}
          </button>
        ))}

        <button
          onClick={() => move(pageInfo.endPageNum + 1)}
          className={`px-4 py-2 border rounded ${
            pageInfo.endPageNum >= pageInfo.totalPageCount ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100"
          }`}
          disabled={pageInfo.endPageNum >= pageInfo.totalPageCount}
        >
          &raquo;
        </button>
      </div>
    </div>
    );
}

export default CourseBoard;