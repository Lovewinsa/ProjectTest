import React from "react";

function ConfirmModal({ show, message, yes, no }) {
  if (!show) return null; // 모달이 보이지 않을 때는 null 반환

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
        {/* Modal Header */}
        <div className="text-xl font-bold mb-4">알림</div>
        
        {/* Modal Body */}
        <div className="mb-6">
          <p>{message}</p>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={yes}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            확인
          </button>
          <button
            onClick={no}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
    
  );
}

export default ConfirmModal;
