import React from 'react';
import { Link } from 'react-router-dom';

function ExtraPage() {
    return (
        <div className="borderbox">
        <ul className="myPage">
          <li className="myPageList">
            <h3><Link to="/checklist"><strong>체크리스트</strong>()</Link></h3>
            <p><Link to="/checklist"><br /></Link></p>
          </li>
          <li className="myPageList">
            <h3><Link to="/exchangeInfo"><strong>환율 정보</strong>()</Link></h3>
            <p><Link to="/exchangeInfo"></Link></p>
          </li>
          <li className="myPageList">
            <h3><Link to="/safetyInfo"><strong>안전 정보</strong>()</Link></h3>
            <p><Link to="/safetyInfo"></Link></p>
          </li>
          <li className="myPageList">
            <h3><Link to="/calculator"><strong>여행경비 계산기</strong></Link></h3>
            <p><Link to="/calculator"></Link></p>
          </li>
          <li className="myPageList">
            <h3><Link to="/planner"><strong>여행 플레너</strong></Link></h3>
            <p><Link to="/planner"></Link></p>
          </li>
          <li className="myPageList">
            <h3><Link to="/recommendations"><strong>여행 추천 장소</strong></Link></h3>
            <p><Link to="/recommendations"></Link></p>
          </li>
          <li className="myPageList">
            <h3><Link to="/diary"><strong>여행 일기</strong></Link></h3>
            <p><Link to="/diary"></Link></p>
          </li>
          <li className="myPageList">
            <h3><Link to="/languageTip"><strong>여행 대화문화 팁</strong></Link></h3>
            <p><Link to="/languageTip"></Link></p>
          </li>
        </ul>
      </div>
    );
}

export default ExtraPage;