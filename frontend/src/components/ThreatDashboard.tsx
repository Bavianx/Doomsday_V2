import React from 'react';
import { useState, useEffect } from 'react'

function ThreatDashboard() {
    const [data, setData] = useState<any>(null) // Stores the API response // default as null for first data sets until data is passed

    useEffect(() => {     //Runs this automatically on load of app
        fetch('http://127.0.0.1:8000/api/threats/')
            .then(res => res.json())
            .then(data => setData(data))      //Stores the JSON in state
    }, [])

    if (!data) return <p>Loading...</p>

    return (
        <div>
            <h3>Latest Headlines:</h3>
            {data.headlines.map((item: any, index: number) => (
                <div key={index}>
                    <p><strong>{item.headline}</strong></p>
                    <small>{item.source} — {item.category} — {item.ai_score}</small>
                </div>
            ))}
        </div>
    )
}

export default ThreatDashboard;