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
            <div className="text-center mb-4">
                <div className={`text-6xl font-bold ${
                    risk.global_score >= 7 ? 'text-red-400' :
                    risk.global_score >= 4 ? 'text-yellow-400' :
                    'text-green-400'
                }`}>
                    {risk.global_score}
                </div>
                <div className="text-gray-500 text-sm mt-1">out of 10</div>
            </div>

        </div>
    )
}

export default RiskScore