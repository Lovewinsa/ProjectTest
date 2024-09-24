import axios from "axios";
import { useEffect, useState } from "react";
import { Link, NavLink, useSearchParams } from "react-router-dom";

function MateBoard() {
  //배열 안에서 객체로 관리
  const [pageData, setPageData] = useState([]);
  //파라미터 값 관리
  const [searchParams, setSearchParams] = useSearchParams();

  // searchPrams 에 di 값이 있으면 그 값으로 없다면 Domestic 으로 설정
  // *이후에 di 값이 영향을 미치지는않지만 계속 남아있음
  const [domesticInternational, setDomesticInternational] = useState();
  
  const [pageTurn, setPageTurn] = useState("to International"); // 페이지 전환 버튼
  const [whereAreYou, setWhereAreYou] = useState(null);

  // searchParams 가 바뀔때마다 실행된다. 
  // searchParams 가 없다면 초기값 "Domestic" 있다면 di 란 key 값의 데이터를 domesticInternational에 전달한다
  useEffect(() => {
    const diValue = searchParams.get("di") || "Domestic";
    setDomesticInternational(diValue);
  }, [searchParams]);

  // domesticInternational 가 바뀔때마다 실행된다.
  // to D~ I~ Button 을 누를때 or 새로운 요청이 들어왔을때
  useEffect(() => {
    axios
      .get("/api/v1/posts/mate")
      .then((res) => {
        
        const filteredData = res.data.list.filter((item) => {
          return domesticInternational === "Domestic" ? item.country === "한국" : item.country !== "한국";
        });
        
        setPageData(filteredData);

        setWhereAreYou(domesticInternational === "Domestic" ? "국내 여행 메이트 페이지" : "해외 여행 메이트 페이지");
        setPageTurn(domesticInternational === "Domestic" ? "to International" : "to Domestic");
      })
      .catch((error) => console.log(error));
  }, [domesticInternational]);

  // -------------이벤트 관리부

  // 국내/해외 변경 버튼 핸들러-
  const handleButtonClick = () => {
    if (domesticInternational === "International") {
      // 국내 상태에서 눌렀을 때
      //상태 변경
      setDomesticInternational("Domestic");
    } else if (domesticInternational === "Domestic") {
      setDomesticInternational("International");
    }
  };


  return (
    <>
      <h3>{whereAreYou}</h3>
      <NavLink to={{ pathname: "/posts/mate/new", search: `?di=${domesticInternational}` }}>새글 작성</NavLink>
      <button className="border border-1 bg-light-green-200" onClick={handleButtonClick}>
        {pageTurn}
      </button>

      {/* 메이트 게시판 테이블 */}
      <table className="table-auto w-full border divide-y divide-x divide-gray-200">
        <thead className="text-center">
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회수</th>
            <th>좋아요</th>
          </tr>
        </thead>
        <tbody className="text-center divide-y">
          {pageData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td className="text-left">
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">{`#${item.country}`}</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full items-center">{`#${item.city}`}</span>
                  {item.tags &&
                    item.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                        {tag}
                      </span>
                    ))}
                </div>
                <Link to={`/posts/mate/${item.id}/detail`}>{item.title}</Link>
              </td>
              <td>{item.writer}</td>
              <td>{item.updatedAt ? item.updatedAt : item.createdAt}</td>
              <td>{item.viewCount}</td>
              <td>{item.likeCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default MateBoard;
