import React from 'react';

function LanguageCultureTips() {
    const tips = [
        { country: 'France', language: 'French', tip: 'Always greet with "Bonjour" when entering a store or cafe.' },
        { country: 'Japan', language: 'Japanese', tip: 'Bow slightly when greeting someone as a sign of respect.' }
    ];

    return (
        <div>
            <h1>Language and Culture Tips</h1>
            <ul>
                {tips.map((tip, index) => (
                    <li key={index}>
                        <strong>{tip.country} ({tip.language}):</strong> {tip.tip}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LanguageCultureTips;
