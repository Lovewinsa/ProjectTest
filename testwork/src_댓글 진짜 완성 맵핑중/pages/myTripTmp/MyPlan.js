import React, { useState } from 'react';



function MyPlan(props) {
    //course 변수 사용하기 위해 임시로 useState() 사용
    const [course, setCourse] = useState({})

    return (
        <>
            <div>
                {
                    course ?
                        <>
                            <h3>여행 리스트 출력</h3>
                        </>
                        :
                        <>
                            <h3>계획중인 여행이 없습니다</h3>
                        </>
                }
            </div>
        </>
    );
}

export default MyPlan;