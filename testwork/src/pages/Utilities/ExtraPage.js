import React from 'react';
import { Link } from 'react-router-dom';

function ExtraPage() {
  const utilities = [
    { title: '체크리스트', path: '/checklist' },
    { title: '환율 정보', path: '/exchange' },
    { title: '여행경비 계산기', path: '/calculator' },
    { title: '여행 플래너', path: '/planner' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {utilities.map((utility, index) => (
          <li key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <Link to={utility.path} className="block p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{utility.title}</h3>
              <p className="text-gray-600">자세히 보기</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExtraPage;

