import { useEffect, useState } from 'react'

function AIAssessment() {
    const [assessment, setAssessment] = useState<string>('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/assessment/')
            .then(res => res.json())
            .then(data => {
                setAssessment(data.assessment)
                setLoading(false)
            })
    }, [])

    return (
        <div className="rounded-xl p-4 flex-1" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)'
        }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {loading ? 'Loading assessment...' : assessment}
            </p>
        </div>
    )
}

export default AIAssessment