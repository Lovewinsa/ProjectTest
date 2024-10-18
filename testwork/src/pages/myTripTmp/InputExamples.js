import React from "react";

const InputExamples = () => {
  return (
    <div className="p-10 space-y-8">
      <h2 className="text-2xl font-bold mb-5">Tailwind Input Examples</h2>

      {/* 기본 스타일 */}
      <div>
        <label className="block text-gray-700 mb-2">기본 스타일</label>
        <input
          type="text"
          className="border border-gray-300 rounded-md p-2"
          placeholder="기본 스타일"
        />
      </div>

      {/* 포커스 시 스타일링 */}
      <div>
        <label className="block text-gray-700 mb-2">포커스 스타일</label>
        <input
          type="text"
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="포커스 시 스타일"
        />
      </div>

      {/* 배경색과 텍스트 색상 변경 */}
      <div>
        <label className="block text-gray-700 mb-2">배경색과 텍스트 색상</label>
        <input
          type="text"
          className="border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-700"
          placeholder="배경색 및 텍스트 색상"
        />
      </div>

      {/* 입력 상자 크기 및 정렬 조정 */}
      <div>
        <label className="block text-gray-700 mb-2">크기 및 정렬</label>
        <input
          type="text"
          className="border border-gray-300 rounded-md p-2 w-full md:w-1/2"
          placeholder="크기 및 정렬 조정"
        />
      </div>

      {/* 비활성화 상태 스타일링 */}
      <div>
        <label className="block text-gray-700 mb-2">비활성화 상태</label>
        <input
          type="text"
          className="border border-gray-300 rounded-md p-2 bg-gray-200 text-gray-500 cursor-not-allowed"
          disabled
          placeholder="비활성화 상태"
        />
      </div>

      {/* 상태 전환 애니메이션 추가 */}
      <div>
        <label className="block text-gray-700 mb-2">애니메이션 효과</label>
        <input
          type="text"
          className="border border-gray-300 rounded-md p-2 transition duration-150 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          placeholder="상태 전환 애니메이션"
        />
      </div>

      {/* 더 복잡한 스타일 (그라데이션 배경, 그림자, 커스텀 폰트) */}
      <div>
        <label className="block text-gray-700 mb-2">복잡한 스타일</label>
        <input
          type="text"
          className="border border-gray-300 rounded-md p-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 font-semibold"
          placeholder="그라데이션 배경 및 그림자"
        />
      </div>

      {/* 둥근 테두리와 두꺼운 테두리 */}
      <div>
        <label className="block text-gray-700 mb-2">둥근 테두리 및 두꺼운 테두리</label>
        <input
          type="text"
          className="border-4 border-blue-500 rounded-full p-2 text-blue-700 focus:outline-none focus:border-blue-700"
          placeholder="둥근 테두리"
        />
      </div>

      {/* 입력 상자 내부 아이콘과 함께 사용 */}
      <div className="relative">
        <label className="block text-gray-700 mb-2">내부 아이콘과 함께</label>
        <input
          type="text"
          className="border border-gray-300 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="내부 아이콘이 있는 입력 상자"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default InputExamples;
