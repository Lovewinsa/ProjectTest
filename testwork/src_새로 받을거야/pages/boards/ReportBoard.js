import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReportBoard = () => {
    const [reports, setReports] = useState([]); // 신고 목록 상태
    const [page, setPage] = useState(0); // 현재 페이지
    const [rowsPerPage, setRowsPerPage] = useState(10); // 페이지당 행 수
    const [totalReports, setTotalReports] = useState(0); // 총 신고 수
    const [openDialog, setOpenDialog] = useState(false); // 다이얼로그 열림 여부
    const [selectedReport, setSelectedReport] = useState(null); // 선택된 신고

    // 신고 목록 가져오기
    const fetchReports = async (pageNum = 1) => {
        try {
            const response = await axios.get(`/api/v1/reports?pageNum=${pageNum}&sortBy=createdAt_desc`);
            setReports(response.data.list); // 신고 목록 업데이트
            setTotalReports(response.data.totalRowCount); // 총 신고 수 업데이트
        } catch (error) {
            console.error('신고 목록을 가져오는 데 실패했습니다:', error);
        }
    };

    useEffect(() => {
        fetchReports(page + 1); // 페이지가 변경될 때마다 신고 목록 가져오기
    }, [page]);

    const handleChangePage = (newPage) => {
        setPage(newPage); // 페이지 변경
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10)); // 페이지당 행 수 변경
        setPage(0); // 페이지를 0으로 초기화
    };

    const handleCloseDialog = () => {
        setOpenDialog(false); // 다이얼로그 닫기
        fetchReports(); // 신고 처리 후 목록 갱신
    };

    // 총 페이지 수 계산
    const totalPages = Math.ceil(totalReports / rowsPerPage) || 1;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-center mb-4">신고 목록</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2">신고 ID</th>
                            <th className="border border-gray-300 px-4 py-2">신고자</th>
                            <th className="border border-gray-300 px-4 py-2">신고 대상/id</th>
                            <th className="border border-gray-300 px-4 py-2">신고 대상</th>
                            <th className="border border-gray-300 px-4 py-2">신고 상태</th>
                            <th className="border border-gray-300 px-4 py-2">신고 날짜</th>
                            <th className="border border-gray-300 px-4 py-2">작업</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report.id}>
                                <td className="border border-gray-300 px-4 py-2">{report.id}</td>
                                <td className="border border-gray-300 px-4 py-2">{report.reporterId}</td>
                                <td className="border border-gray-300 px-4 py-2">{report.targetType}</td>
                                <td className="border border-gray-300 px-4 py-2">{report.targetId}</td>
                                <td className="border border-gray-300 px-4 py-2">{report.reportStatus}</td>
                                <td className="border border-gray-300 px-4 py-2">{new Date(report.createdAt).toLocaleString()}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        onClick={() => {}}
                                    >
                                        처리
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <select
                    value={rowsPerPage}
                    onChange={handleChangeRowsPerPage}
                    className="border border-gray-300 rounded p-2"
                >
                    {[10, 25, 50].map((option) => (
                        <option key={option} value={option}>
                            {option}개씩 보기
                        </option>
                    ))}
                </select>
                <div>
                    <button
                        disabled={page === 0}
                        onClick={() => handleChangePage(page - 1)}
                        className="border border-gray-300 rounded px-4 py-2 mr-2 disabled:opacity-50"
                    >
                        이전
                    </button>
                    <span>페이지 {page + 1} / {totalPages}</span>
                    <button
                        disabled={(page + 1) * rowsPerPage >= totalReports}
                        onClick={() => handleChangePage(page + 1)}
                        className="border border-gray-300 rounded px-4 py-2 ml-2 disabled:opacity-50"
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportBoard;
