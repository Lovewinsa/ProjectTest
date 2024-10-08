import React, { useState, useEffect } from 'react';

const LoadingAnimation = () => {
  const [imageWidth, setImageWidth] = useState('0%'); // 처음에는 0%로 시작

  useEffect(() => {
    // 애니메이션이 시작되도록 타이머 설정
    const timer = setTimeout(() => {
      setImageWidth('100%'); // 100%로 설정하여 왼쪽부터 오른쪽까지 이미지가 보이게 함
    }, 100); // 0.1초 후 애니메이션 시작

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-white bg-opacity-75 pointer-events-none">
      {/* 로고가 처음에는 화면에 보이지 않다가 왼쪽부터 점차 채워짐 */}
      <div className="relative w-64 h-32">
        <img
          src="/img/TripDuologo.png"
          alt="Loading"
          className="w-full h-full object-contain"
          style={{
            clipPath: `inset(0 ${100 - parseInt(imageWidth)}% 0 0)`, // 왼쪽부터 점차 보이도록 설정
            transition: 'clip-path 0.7s cubic-bezier(0.65, 0, 0.35, 1)', // 애니메이션 속도 설정
          }}
        />
      </div>
    </div>
  );
};

export default LoadingAnimation;
