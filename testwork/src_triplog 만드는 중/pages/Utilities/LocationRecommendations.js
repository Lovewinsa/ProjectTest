import React, { useState, useEffect } from 'react';

function LocationRecommendations() {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        // 실제 API 대신 임시 데이터 사용
        const mockData = [
            { id: 1, location: 'Paris, France', description: 'Famous for the Eiffel Tower and its rich history.' },
            { id: 2, location: 'Kyoto, Japan', description: 'Known for its temples, gardens, and the Gion district.' }
        ];
        setRecommendations(mockData);
    }, []);

    return (
        <div>
            <h1>Location Recommendations</h1>
            <ul>
                {recommendations.map(recommendation => (
                    <li key={recommendation.id}>
                        <strong>{recommendation.location}:</strong> {recommendation.description}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LocationRecommendations;
