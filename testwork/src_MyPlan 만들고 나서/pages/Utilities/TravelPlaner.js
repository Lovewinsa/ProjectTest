import React, { useState, useEffect } from 'react';

function TravelPlanner() {
    const [events, setEvents] = useState({});
    const [newEvent, setNewEvent] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [visibleDates, setVisibleDates] = useState({});

    // 컴포넌트가 처음 렌더링될 때만 현재 날짜와 시간으로 초기화
    useEffect(() => {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD 형식
        const timeStr = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM 형식
        setNewDate(dateStr);
        setNewTime(timeStr);
    }, []); // 빈 배열을 넣어 컴포넌트가 처음 렌더링될 때만 실행

    const addEvent = () => {
        if (!newEvent || !newDate || !newTime) return;

        const updatedEvents = { ...events };
        if (!updatedEvents[newDate]) {
            updatedEvents[newDate] = [];
        }

        updatedEvents[newDate].push({ time: newTime, event: newEvent });
        setEvents(updatedEvents);
        setNewEvent('');
        setNewDate('');
        setNewTime('');
    };

    const toggleVisibility = (date) => {
        setVisibleDates({
            ...visibleDates,
            [date]: !visibleDates[date],
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            <h1 className="text-4xl font-bold mb-8 text-blue-600">Travel Planner</h1>
            
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
                <div className="flex flex-col space-y-6 mb-8">
                    <input 
                        type="text" 
                        value={newEvent} 
                        onChange={(e) => setNewEvent(e.target.value)} 
                        placeholder="Add a new event" 
                        className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex space-x-4">
                        <input 
                            type="date" 
                            value={newDate} 
                            onChange={(e) => setNewDate(e.target.value)} 
                            className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 flex-1"
                        />
                        <input 
                            type="time" 
                            value={newTime} 
                            onChange={(e) => setNewTime(e.target.value)} 
                            step="600" 
                            className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 flex-1"
                        />
                    </div>
                    <button 
                        onClick={addEvent} 
                        className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Add Event
                    </button>
                </div>

                <ul className="space-y-6">
                    {Object.keys(events).map((date) => (
                        <li key={date} className="bg-gray-50 border border-gray-200 rounded-lg">
                            <div 
                                onClick={() => toggleVisibility(date)} 
                                className="flex justify-between items-center p-6 cursor-pointer font-semibold text-gray-800 hover:bg-gray-100 rounded-t-lg"
                            >
                                <span>{date}</span>
                                <span>{visibleDates[date] ? '▲' : '▼'}</span>
                            </div>
                            {visibleDates[date] && (
                                <ul className="bg-white p-6 space-y-4">
                                    {events[date].map((event, index) => (
                                        <li key={index} className="flex justify-between">
                                            <span className="text-gray-700">{event.time}</span>
                                            <span className="text-gray-900">{event.event}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default TravelPlanner;
