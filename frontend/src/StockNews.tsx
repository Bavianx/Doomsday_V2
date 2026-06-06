import { useState, useEffect } from 'react'

function StockNews() {
    const [articles, setArticles] = useState<any[]>([])

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/stocknews/')
            .then(res => res.json())
            .then(data => setArticles(data.articles))
    }, [])

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">
                World Stock News
            </h3>
            <div style={{ maxHeight: '400px' }} className="flex flex-col divide-y divide-gray-800 overflow-y-auto">
                {articles.map((item: any, index: number) => (
                    <div key={index} className="py-2">
                        <p className="text-sm text-gray-200">{item.title}</p>
                        <small className="text-xs text-gray-500">{item.source}</small>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StockNews