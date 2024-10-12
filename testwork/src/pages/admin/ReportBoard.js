import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";

const ReportBoard = () => {
  const [reports, setReports] = useState([]); // 신고 정보
  const [selectedReport, setSelectedReport] = useState({}); // 선택된 신고 정보
  const [targetTypes, setTargetTypes] = useState([]); // 대상 정보
  const [reportedUserIds, setReportedUserIds] = useState([]); // 소유자 id 정보
  const [targetAccountStatus, setTargetAccountStatus] = useState([]); // 소유자 계정 상태 정보
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [pageSize, setPageSize] = useState(10); // 페이지당 행 수
  const [modalOpen, setModalOpen] = useState(false); // 모달 열림 여부
  const [reportStatus, setReportStatus] = useState(""); // 선택된 신고 상태
  const [accountStatus, setAccountStatus] = useState(""); // 선택된 계정 상태
  const [totalReportPages, setTotalReportPages] = useState(); // 총 페이지 수

  // 검색 조건
  const [searchCriteria, setSearchCriteria] = useState({
    reportedUserId: "",
    reportStatus: "",
    targetType: "",
    createdAtMonth: ""
  });

  const handleCriteriaChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 새로운 검색을 시작하는 함수
  const handleSearch = () => {
    setReports([]); // 새로운 검색 시 데이터 초기화
    setCurrentPage(1); // 페이지 초기화
    getReports();
  };

  // 신고 목록 가져오기
  const getReports = async () => {
    const params = {
      reportedUserId: searchCriteria.reportedUserId || null,
      reportStatus: searchCriteria.reportStatus || null,
      targetType: searchCriteria.targetType || null,
      createdAtMonth: searchCriteria.createdAtMonth || null,
      pageNum: currentPage,
      pageSize: pageSize
    };

    try {
      const response = await axios.get("/api/v1/reports", { params });
      console.log(response.data);
      setReports(response.data.list); // 신고 정보 업데이트
      setTargetTypes(response.data.targetTypeList); // 대상 정보 업데이트
      setReportedUserIds(response.data.reportedUserIdList); // 소유자 id 업데이트
      setTargetAccountStatus(response.data.targetAccountStatusList); // 소유자 계정 상태 정보 업데이트
      setTotalReportPages(response.data.totalReportPages); // 총 페이지 수 업데이트
    } catch (error) {
      console.error("신고 목록을 가져오는 데 실패했습니다:", error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [pageSize, searchCriteria.reportStatus, searchCriteria.targetType, searchCriteria.createdAtMonth]);

  useEffect(() => {
    getReports();
  }, [currentPage]);

  // 신고 처리 API 요청
  const handleProcessReport = async () => {
    try {
      await axios.put(`/api/v1/reports/${selectedReport.infos.id}`, {
        reportStatus: reportStatus,
        accountStatus: accountStatus,
      });
      setModalOpen(false); // 모달 닫기
      getReports(); // 신고 목록 새로 고침
    } catch (error) {
      console.error("신고 정보를 업데이트하는 데 실패했습니다:", error);
    }
  };

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage); // 페이지 변경
  };

  const handleChangePageSize = (event) => {
    setPageSize(parseInt(event.target.value, 10)); // 페이지당 행 수 변경
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-center flex-1">신고 목록</h1>
        </div>

        {/* 검색 조건 입력 폼 */}
        <div className="my-4 p-4 w-full md:w-1/2 bg-white rounded-lg shadow-md border border-gray-300">
          <div className="flex flex-col md:flex-row items-center gap-2 w-full">
            <input
              type="text"
              name="reportedUserId"
              onChange={handleCriteriaChange}
              placeholder="소유자 id"
              onKeyDown={handleKeyDown}
              className="border border-tripDuoGreen text-sm rounded-md px-3 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-tripDuoMint transition-all duration-300"
            />
            
            <button
              onClick={handleSearch}
              className="font-bold bg-tripDuoMint text-white px-3 py-2 text-sm rounded-md shadow-md hover:bg-tripDuoGreen transition-all duration-300">
              검색
            </button>
          </div>

          {/* 상태 선택 */}
          <div className="flex items-center gap-2 mt-2">
            <span>상태 : </span>
            {["PROCESSED", "UNPROCESSED", "PENDING"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  // 현재 선택된 상태와 동일하면 해제, 아니면 선택
                  setSearchCriteria((prev) => ({
                    ...prev,
                    reportStatus: prev.reportStatus === status ? "" : status
                  }));
                }}
                className={`font-bold ${searchCriteria.reportStatus === status ? 'bg-tripDuoGreen' : 'bg-tripDuoMint'} text-white px-3 py-1 text-sm rounded-md shadow-md transition-all duration-300`}>
                {status === "PROCESSED" ? "처리됨" : status === "UNPROCESSED" ? "처리되지 않음" : "보류 중"}
              </button>
            ))}
          </div>

          {/* 대상 선택 */}
          <div className="flex items-center gap-2 mt-2">
            <span>대상 : </span>
            {["USER", "USER_REVIEW", "POST", "POST_COMMENT", "CHAT_ROOM", "CHAT_MESSAGE"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  // 현재 선택된 대상과 동일하면 해제, 아니면 선택
                  setSearchCriteria((prev) => ({
                    ...prev,
                    targetType: prev.targetType === type ? "" : type
                  }));
                }}
                className={`font-bold ${searchCriteria.targetType === type ? 'bg-tripDuoGreen' : 'bg-tripDuoMint'} text-white px-3 py-1 text-sm rounded-md shadow-md transition-all duration-300`}>
                {type === "USER" ? "사용자" : type === "USER_REVIEW" ? "사용자 리뷰" : type === "POST" ? "게시글" : type === "POST_COMMENT" ? "게시글 댓글" : type === "CHAT_ROOM" ? "채팅방" : "채팅메시지"}
              </button>
            ))}
          </div>

          {/* 날짜 선택 */}
          <div className="flex items-center gap-2 mt-2">
            <span>날짜 : </span>
            <button className="font-bold bg-tripDuoMint text-white px-3 py-1 text-sm rounded-md shadow-md hover:bg-tripDuoGreen transition-all duration-300">
              뭔가 년과 월을 선택할 수 있는 느낌
            </button>
          </div>
        </div>

        <select value={pageSize} onChange={handleChangePageSize} className="border border-gray-300 rounded py-2">
          {[10, 25, 50].map((option) => (
            <option key={option} value={option}>
              {option}개씩 보기
            </option>
          ))}
        </select>

        <div className="overflow-x-auto mt-3">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">id</th>
                <th className="border border-gray-300 px-4 py-2">신고자 id</th>
                <th className="border border-gray-300 px-4 py-2">대상</th>
                <th className="border border-gray-300 px-4 py-2">상태</th>
                <th className="border border-gray-300 px-4 py-2">소유자 id</th>
                <th className="border border-gray-300 px-4 py-2">소유자<br/>계정 상태</th>
                <th className="border border-gray-300 px-4 py-2">날짜</th>
                <th className="border border-gray-300 px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr className="text-center" key={report.id}>
                  <td className="border border-gray-300 px-4 py-2">{report.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{report.reporterId}</td>

                  <td className="border border-gray-300 px-4 py-2">
                    {targetTypes[index] === "USER" && "사용자"}
                    {targetTypes[index] === "USER_REVIEW" && "사용자 리뷰"}
                    {targetTypes[index] === "POST" && "게시글"}
                    {targetTypes[index] === "POST_COMMENT" && "게시글 댓글"}
                    {targetTypes[index] === "CHAT_ROOM" && "채팅방"}
                    {targetTypes[index] === "CHAT_MESSAGE" && "채팅메시지"}
                  </td>

                  <td className="border border-gray-300 px-4 py-2">
                    {report.status === "PROCESSED" && "처리됨"}
                    {report.status === "UNPROCESSED" && "처리되지 않음"}
                    {report.status === "PENDING" && "보류 중"}
                  </td>

                  <td className="border border-gray-300 px-4 py-2">{reportedUserIds[index]}</td>
                  
                  <td className="border border-gray-300 px-4 py-2">
                    {targetAccountStatus[index] === "ACTIVE" && "활성"}
                    {targetAccountStatus[index] === "INACTIVE" && "비활성"}
                    {targetAccountStatus[index] === "WARNED" && "경고"}
                    {targetAccountStatus[index] === "SUSPENDED" && "정지"}
                  </td>

                  <td className="border border-gray-300 px-4 py-2">{new Date(report.createdAt).toLocaleString()}</td>
                  
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => {
                        setModalOpen(true);
                        const selectedReport = {
                          infos: report,
                          targetType: targetTypes[index],
                          targetId: reportedUserIds[index],
                          targetAccountStatus: targetAccountStatus[index]
                        };
                        setSelectedReport(selectedReport); // 선택된 신고 정보를 상태에 저장
                      }}>
                      자세히 보기
                    </button>
                    {modalOpen && (
                      <ReportModal
                        isOpen={modalOpen}
                        onClose={() => setModalOpen(false)}
                        onConfirm={handleProcessReport}
                        report={selectedReport} // 선택된 신고 정보를 모달에 전달
                        setStatus={setReportStatus}
                        setAccountStatus={setAccountStatus}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center items-center mt-4">
          <button
              disabled={currentPage === 1}
              onClick={() => handleChangePage(currentPage - 1)}
              className="border border-gray-300 rounded px-4 py-2 mr-2 disabled:opacity-50">
              이전
          </button>
          <span>
              페이지 {currentPage} / {totalReportPages}
          </span>
          <button
              disabled={currentPage >= totalReportPages}
              onClick={() => handleChangePage(currentPage + 1)}
              className="border border-gray-300 rounded px-4 py-2 ml-2 disabled:opacity-50">
              다음
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

// 모달 컴포넌트
const ReportModal = ({ isOpen, onClose, onConfirm, report, setStatus, setAccountStatus }) => {
  if (!isOpen) return null;

  return (
    <div className="modal fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-content bg-white p-4 rounded shadow-lg relative">
        {/* 닫기 SVG 아이콘 */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 384 512" 
          className="absolute top-2 right-2 w-6 h-6 cursor-pointer" // 위치 및 크기 설정
          onClick={onClose} // 클릭 시 모달 닫기
        >
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
        </svg>
        
        {/* 신고 정보 표시 */}
        <h3 className="text-lg font-bold mb-4">신고 상세 정보</h3>
        <div>
          <p><strong>신고자 ID:</strong> {report.infos.reporterId}</p>
          <p><strong>대상:</strong> {report.targetType}</p>
          <p><strong>대상 ID:</strong> {report.targetId}</p>
          <p><strong>상태:</strong> {report.infos.status === "PROCESSED" ? "처리됨" : report.status === "UNPROCESSED" ? "처리되지 않음" : "보류 중"}</p>
          <p><strong>날짜:</strong> {new Date(report.infos.createdAt).toLocaleString()}</p>
          <p><strong>소유자 계정 상태:</strong> {report.targetAccountStatus}</p>
        </div>

        {/* 좌우로 배치하기 위한 부모 div 추가 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <div className="report-status" style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', backgroundColor: '#f9fafb', marginRight: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: '600' }}>신고 상태 변경</h3>
            <div className="radio-group" style={{ display: 'flex', flexDirection: 'column' }}>
              {["PROCESSED", "UNPROCESSED", "PENDING"].map((status) => (
                <label key={status} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="reportStatus" 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)} 
                    style={{ marginRight: '0.5rem' }} 
                  />
                  {/* 보여지는 텍스트 변경 */}
                  {status === "PROCESSED" && "처리됨"}
                  {status === "UNPROCESSED" && "처리되지 않음"}
                  {status === "PENDING" && "보류 중"}
                </label>
              ))}
            </div>
          </div>

          <div className="account-status" style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', backgroundColor: '#f9fafb' }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: '600' }}>계정 상태 변경</h3>
            <div className="radio-group" style={{ display: 'flex', flexDirection: 'column' }}>
              {["ACTIVE", "INACTIVE", "WARNED", "SUSPENDED"].map((status) => (
                <label key={status} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="accountStatus" 
                    value={status} 
                    onChange={(e) => setAccountStatus(e.target.value)} 
                    style={{ marginRight: '0.5rem' }} 
                  />
                  {/* 보여지는 텍스트 변경 */}
                  {status === "ACTIVE" && "활성"}
                  {status === "INACTIVE" && "비활성"}
                  {status === "WARNED" && "경고"}
                  {status === "SUSPENDED" && "정지"}
                </label>
              ))}
            </div>
          </div>
        </div>

        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={onConfirm} style={{ marginTop: '1rem' }}>
          확인
        </button>
      </div>
    </div>
  );
};

export default ReportBoard;