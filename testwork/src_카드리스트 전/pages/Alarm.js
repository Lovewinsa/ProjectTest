// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function Alarm({ token }) {
//   const [alerts, setAlerts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // API 호출로 알람 데이터 가져오기
//   const fetchUserAlerts = async () => {
//     if (!token) {
//       setError("로그인이 필요합니다.");
//       setLoading(false);
//       return;
//     }

//     try {
//       // 서버에 API 요청 (토큰 포함)
//       const response = await axios.get("https://your-api-endpoint.com/alerts", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       // 서버에서 받은 알람 데이터를 최신순으로 정렬
//       const sortedAlerts = response.data.alerts.sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//       );
//       setAlerts(sortedAlerts); // 알람 데이터 저장
//     } catch (err) {
//       setError("알람을 가져오는데 실패했습니다.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 컴포넌트가 마운트될 때 알람 데이터 불러오기
//   useEffect(() => {
//     fetchUserAlerts();
//   }, [token]);

//   // 알람 읽음 처리 함수 (서버와 연동)
//   const markAsRead = async (id) => {
//     try {
//       await axios.put(
//         `https://your-api-endpoint.com/alerts/${id}/read`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       // 로컬 상태에서 알람을 읽음 처리
//       setAlerts((prevAlerts) =>
//         prevAlerts.map((alert) =>
//           alert.id === id ? { ...alert, read: true } : alert
//         )
//       );
//     } catch (err) {
//       setError("알람을 읽음 처리하는데 실패했습니다.");
//     }
//   };

//   if (loading) return <div className="text-center py-10">로딩 중...</div>;
//   if (error) return <div className="text-center text-red-500">{error}</div>;

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6 text-center">내 알람</h1>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="py-3 px-4 text-left font-semibold text-gray-600">알람 내용</th>
//               <th className="py-3 px-4 text-left font-semibold text-gray-600">상태</th>
//               <th className="py-3 px-4 text-left font-semibold text-gray-600">날짜</th>
//               <th className="py-3 px-4 text-left font-semibold text-gray-600">동작</th>
//             </tr>
//           </thead>
//           <tbody>
//             {alerts.length === 0 ? (
//               <tr>
//                 <td colSpan="4" className="py-4 text-center text-gray-500">
//                   알람이 없습니다.
//                 </td>
//               </tr>
//             ) : (
//               alerts.map((alert) => (
//                 <tr key={alert.id} className="border-t border-gray-200">
//                   <td className="py-3 px-4">
//                     <span className={alert.read ? "line-through text-gray-500" : ""}>
//                       {alert.message}
//                     </span>
//                   </td>
//                   <td className="py-3 px-4">{alert.read ? "읽음" : "안읽음"}</td>
//                   <td className="py-3 px-4">{new Date(alert.createdAt).toLocaleString()}</td>
//                   <td className="py-3 px-4">
//                     {!alert.read && (
//                       <button
//                         onClick={() => markAsRead(alert.id)}
//                         className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
//                       >
//                         읽음
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default Alarm;
import React, { useState, useEffect } from "react";

function Alarm() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 임의의 알람 데이터
  const mockAlerts = [
    {
      id: 1,
      message: "새로운 댓글이 달렸습니다.",
      read: false,
      createdAt: "2024-09-18T14:30:00",
    },
    {
      id: 2,
      message: "계정 정보가 업데이트되었습니다.",
      read: true,
      createdAt: "2024-09-17T09:15:00",
    },
    {
      id: 3,
      message: "새로운 친구 요청이 있습니다.",
      read: false,
      createdAt: "2024-09-16T17:45:00",
    },
  ];

  // 컴포넌트가 마운트될 때 하드코딩된 알람 데이터 불러오기
  useEffect(() => {
    setTimeout(() => {
      setAlerts(mockAlerts);
      setLoading(false);
    }, 1000); // 1초 후 데이터 로드
  }, []);

  // 알람 읽음 처리 함수
  const markAsRead = (id) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === id ? { ...alert, read: true } : alert
      )
    );
  };

  // 알람 삭제 함수
  const deleteAlert = (id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  if (loading) return <div className="text-center py-10">로딩 중...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">내 알람</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">알람 내용</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">상태</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">날짜</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">동작</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  알람이 없습니다.
                </td>
              </tr>
            ) : (
              alerts.map((alert) => (
                <tr key={alert.id} className="border-t border-gray-200">
                  <td className="py-3 px-4">
                    <span className={alert.read ? "line-through text-gray-500" : ""}>
                      {alert.message}
                    </span>
                  </td>
                  <td className="py-3 px-4">{alert.read ? "읽음" : "안읽음"}</td>
                  <td className="py-3 px-4">{new Date(alert.createdAt).toLocaleString()}</td>
                  <td className="py-3 px-4 flex space-x-2">
                    {!alert.read && (
                      <button
                        onClick={() => markAsRead(alert.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        읽음
                      </button>
                    )}
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Alarm;


