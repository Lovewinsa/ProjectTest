import React, { useState } from 'react';

function TravelPlanner() {
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState('');

    const addEvent = () => {
        setEvents([...events, newEvent]);
        setNewEvent('');
    };

    return (
        <div>
            <h1>Travel Planner</h1>
            <input 
                type="text" 
                value={newEvent} 
                onChange={(e) => setNewEvent(e.target.value)} 
                placeholder="Add a new event" 
            />
            <button onClick={addEvent}>Add Event</button>
            <ul>
                {events.map((event, index) => (
                    <li key={index}>{event}</li>
                ))}
            </ul>
        </div>
    );
}

export default TravelPlanner;
