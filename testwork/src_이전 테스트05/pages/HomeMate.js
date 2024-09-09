import React from 'react';
import { Link } from 'react-router-dom';

function HomeMate(props) {
    return (
        <div>
            <h1>여행 메이트 페이지</h1>
            <Link to={"/mateBoard"}>메이트 게시판</Link>
        </div>
    );
}

export default HomeMate;