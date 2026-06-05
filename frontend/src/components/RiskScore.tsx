import { useState, useEffect } from 'react'

function RiskScore() {
    const [risk, setRisk] = useState<any>(null)

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/risk/')
            .then(res => res.json())
            .then(data => setRisk(data))
    }, [])

    if (!risk) return null

    return (
        <div className="mb-6 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4">
                Global Risk Score
            </h3>
            <div className="flex items-baseline gap-2 mb-4">
                <span className={`text-6xl font-bold ${
                    risk.global_score >= 7 ? 'text-red-400' :   //risk weight identifiers
                    risk.global_score >= 4 ? 'text-yellow-400' :
                    'text-green-400'
                }`}>
                    {risk.global_score}
                </span>
                <span className="text-gray-500 text-lg">/ 10</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
                {Object.entries(risk.categories).map(([category, score]: [string, any]) => ( //mapping the categories of risks to scores within the new columns
                    <div key={category} className="bg-gray-800 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-400 uppercase mb-1">{category}</div>
                        <div className={`text-lg font-bold ${ //risk weight identifiers
                            score >= 7 ? 'text-red-400' :
                            score >= 4 ? 'text-yellow-400' :
                            'text-green-400'
                        }`}>{score}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RiskScore