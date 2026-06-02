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
        <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                Live Threat Intelligence
            </h3>
            <div className="bg-gray-900 rounded-xl border border-gray-800 divide-y divide-gray-800">
                {data.headlines.map((item: any, index: number) => (
                    <div key={index} className="flex items-start justify-between p-4 hover:bg-gray-800 transition-colors">
                        <div className="flex items-start gap-3">
                            <span className={`text-xs px-2 py-1 rounded font-medium flex-shrink-0 ${
                                item.category === 'cyber' ? 'bg-red-900 text-red-300' :
                                item.category === 'nuclear' ? 'bg-orange-900 text-orange-300' :
                                item.category === 'geopolitical' ? 'bg-yellow-900 text-yellow-300' :
                                'bg-blue-900 text-blue-300'
                            }`}>
                                {item.category.toUpperCase()}
                            </span>
                            <div>
                                <p className="text-sm text-gray-200">{item.headline}</p>
                                <p className="text-xs text-gray-500 mt-1">{item.source}</p>
                            </div>
                        </div>
                        <span className={`text-sm font-bold flex-shrink-0 ml-4 ${
                            item.ai_score >= 7 ? 'text-red-400' :
                            item.ai_score >= 4 ? 'text-yellow-400' :
                            'text-green-400'
                        }`}>
                            {item.ai_score}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ThreatDashboard;