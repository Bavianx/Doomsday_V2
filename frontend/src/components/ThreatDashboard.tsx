import React from 'react';
import { useState, useEffect } from 'react'

interface ThreatDashboardProps {        // TS Blueprint for components requiring a string query
    query: string
    selectedCountry?: string | null
}

function ThreatDashboard({ query, selectedCountry }: ThreatDashboardProps) {
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        let url = `http://127.0.0.1:8000/api/threats/`  // default page

        if (selectedCountry) {
            url = `http://127.0.0.1:8000/api/country/?country=${selectedCountry}` // selected country page
        } else if (query) {
            url = `http://127.0.0.1:8000/api/search/?q=${query}` //query search
        }
        
        fetch(url)  // calls Rest API given the URL chosen 
            .then(res => res.json())    //response -> JSON
            .then(data => {
                setData(query ? data.results : data.headlines) // two API's return two keys for the search (query),(data.results) and threats (default),(data.headlines)
            }) 
    }, [query, selectedCountry])  //runs query for selected country  (specified data sets)

    if (!data) return <p className="text-gray-400">Loading...</p>

    return (
    <div className="space-y-3">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-5">
                {query ? `Results: ${query}` : 'Live Threat Intelligence'}
            </h3>
            <div className="overflow-hidden" style={{ maxHeight: '600px' }}>
                <div className="auto-scroll">
                    {/* First render */}
                    {data.map((item: any, index: number) => (
                        <div key={index} className="flex items-start justify-between p-4 border-b border-gray-800 hover:bg-gray-800 transition-colors">
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
                            <p className={`text-sm ${
                                item.ai_score >= 7 ? 'text-red-300 font-semibold' :
                                item.ai_score >= 4 ? 'text-yellow-200' :
                                'text-gray-200'
                            }`}>
                            </p>
                        </div>
                    ))}
                    {data.map((item: any, index: number) => (
                        <div key={`dup-${index}`} className="flex items-start justify-between p-4 border-b border-gray-800 hover:bg-gray-800 transition-colors">
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
        </div>
    </div>
)
}

export default ThreatDashboard;