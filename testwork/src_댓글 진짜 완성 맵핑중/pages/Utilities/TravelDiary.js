import React, { useState } from 'react';

function TravelDiary() {
    const [entries, setEntries] = useState([]);
    const [newEntry, setNewEntry] = useState('');

    const addEntry = () => {
        setEntries([...entries, newEntry]);
        setNewEntry('');
    };

    return (
        <div>
            <h1>Travel Diary</h1>
            <textarea 
                value={newEntry} 
                onChange={(e) => setNewEntry(e.target.value)} 
                placeholder="Write about your travel experience..."
            />
            <button onClick={addEntry}>Add Entry</button>
            <ul>
                {entries.map((entry, index) => (
                    <li key={index}>{entry}</li>
                ))}
            </ul>
        </div>
    );
}

export default TravelDiary;
