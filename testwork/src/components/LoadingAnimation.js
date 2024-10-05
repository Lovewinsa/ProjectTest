import React from 'react';

const LoadingAnimation = ({ imageWidth }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-white bg-opacity-75 pointer-events-none">
      {/* 로고가 처음부터 화면에 표시되지만, 클리핑되어 점차 채워짐 */}
      <div className="relative w-64 h-32">
        <img
          src="/img/TripDuologo.png"
          alt="Loading"
          className="w-full h-full object-contain"
          style={{
            clipPath: `inset(0 ${imageWidth} 0 0)`, // 오른쪽부터 점점 보이도록 조정
            transition: 'clip-path 3s cubic-bezier(0.65, 0, 0.35, 1)', // 속도 조정: 매우 느리게 시작해 중간부터 빠르게
          }}
        />
      </div>
    </div>
  );
};

export default LoadingAnimation;
