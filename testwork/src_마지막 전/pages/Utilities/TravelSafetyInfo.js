import React, { useState, useEffect } from 'react';

function TravelSafetyInfo() {
    const [safetyInfo, setSafetyInfo] = useState([]);

    useEffect(() => {
        // 실제 API 호출을 통해 안전 정보를 불러오는 로직 추가 가능
        const mockSafetyData = [
            { id: 1, location: 'France', info: 'Recently, some regions in France have faced protests.' },
            { id: 2, location: 'Japan', info: 'Typhoon warnings in the southern region.' }
        ];
        setSafetyInfo(mockSafetyData);
    }, []);

    return (
        <div>
            <h1>Travel Safety Information</h1>
            <ul>
                {safetyInfo.map(info => (
                    <li key={info.id}>
                        <strong>{info.location}:</strong> {info.info}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TravelSafetyInfo;
