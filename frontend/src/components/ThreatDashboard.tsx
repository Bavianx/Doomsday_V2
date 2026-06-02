import React from 'react';
import { useState, useEffect } from 'react'

interface ThreatDashboardProps {        // TS Blueprint for components requiring a string query
    query: string
}

function ThreatDashboard({ query }: ThreatDashboardProps) { 
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        const url = query
            ? `http://127.0.0.1:8000/api/search/?q=${query}` // if true opens page
            : `http://127.0.0.1:8000/api/threats/`  // if false returns to threats page
        
        fetch(url)  // calls Rest API given the URL chosen 
            .then(res => res.json())    //response -> JSON
            .then(data => {
                setData(query ? data.results : data.headlines) // two API's return two keys for the search (query),(data.results) and threats (default),(data.headlines)
            }) 
    }, [query])

    if (!data) return <p className="text-gray-400">Loading...</p>

    return (
        <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                {query ? `Results: ${query}` : 'Live Threat Intelligence'}
            </h3>
            <div className="bg-gray-900 rounded-xl border border-gray-800 divide-y divide-gray-800">
                {data.map((item: any, index: number) => ( // loops through each headline within the data array to display the sub data 
                    <div key={index} className="flex items-start justify-between p-4 hover:bg-gray-800 transition-colors">
                        <div className="flex items-start gap-3">
                            <span className={`text-xs px-2 py-1 rounded font-medium flex-shrink-0 ${
                                item.category === 'cyber' ? 'bg-red-900 text-red-300' :
                                item.category === 'nuclear' ? 'bg-orange-900 text-orange-300' :
                                item.category === 'geopolitical' ? 'bg-yellow-900 text-yellow-300' :
                                'bg-blue-900 text-blue-300'
                            }`}>
                                {item.category ? item.category.toUpperCase() : 'NEWS'}
                            </span>
                            <div>
                                <p className="text-sm text-gray-200">{item.headline || item.title}</p>
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