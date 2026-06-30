import React, { useState } from 'react'
import GlobeComponent from './components/Globe'
import SearchBar from './components/SearchBar'
import ThreatDashboard from './components/ThreatDashboard'
import RiskScore from './components/RiskScore'
import StockNews from './StockNews'
import { countryCoords } from './countryCoords'
import AIAssessment from './components/AIAssessment'


function App() {
    const [view, setView] = useState<'globe' | 'dashboard'>('globe')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
    const [riskData, setRiskData] = useState<any>(null)

    React.useEffect(() => {
            fetch('http://127.0.0.1:8000/api/risk/')
                .then(res => res.json())
                .then(data => setRiskData(data))
    }, [])
    
    const scrollAccumulator = React.useRef(0);

    const handleScroll = (e: WheelEvent) => {
        scrollAccumulator.current += e.deltaY;

        if (scrollAccumulator.current > 300 && view === 'globe') {
            setView('dashboard');
        }

        if (scrollAccumulator.current < 300 && view === 'dashboard') {
            setView('globe');
        }
    };

    React.useEffect(() => {
        window.addEventListener('wheel', handleScroll)
        return () => window.removeEventListener('wheel', handleScroll)
    }, [view])
    
    const coords = selectedCountry ? countryCoords[selectedCountry] : null

    return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-950">
        
        {/* Sticky navbar */}
        <div className="absolute top-0 left-0 right-0 z-30 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-3 sm:py-5 gap-2 sm:gap-0">
            <h1 className="text-xl font-bold tracking-widest" style={{ color: '#FFD700' }}>DOOMSDAY</h1>
            <div className="sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                <SearchBar onSearch={(query) => {
                    setSearchQuery(query)
                    setView('dashboard')
                }} />
            </div>
        </div>

        {/* Globe layer */}
        <div className={`absolute inset-x-0 top-0 transition-opacity duration-700 flex items-center justify-center ${
            view === 'globe' ? 'opacity-100' : 'opacity-30'
        }`}>
            <GlobeComponent onCountryClick={(country) => {
                setSelectedCountry(country)
                setView('dashboard')
            }} />
        </div>

        {/* Dashboard layer */}
        <div className={`absolute inset-0 z-20 transition-all duration-700 ${
            view === 'dashboard'
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-full pointer-events-none'
        }`}>
            <div className="h-full overflow-y-auto pt-32 px-8 pb-6">

                {/* Coordinates bar */}
                <div className="mb-4 py-2 px-4 rounded-lg flex items-center gap-6">
                    <span className="text-xs text-gray-500 uppercase tracking-widest">Location |</span>
                    <span className="text-sm text-gray-300">
                        LAT: {coords ? coords[0].toFixed(2) : '0.00'} ,
                        &nbsp;LNG: {coords ? coords[1].toFixed(2) : '0.00'}
                    </span>
                    <span className="text-sm text-red-400 font-medium">
                        {selectedCountry || '| Global View'}
                    </span>
                </div>

                {/* Three column layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-1">

                    {/* Left — Live Threat Feed */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#f0ece4' }}>
                            {searchQuery ? `Results: ${searchQuery}` : 'Live Threat Intelligence'}
                        </h3>
                        <ThreatDashboard query={searchQuery} selectedCountry={selectedCountry} />
                    </div>

                    {/* Middle — Stock News + Global Risk Score */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#f0ece4' }}>
                            World Stock News
                        </h3>
                        <StockNews />
                        <RiskScore />
                    </div>

                    {/* Right — AI Assessment + Threat Scores */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#f0ece4' }}>
                            AI Assessment
                        </h3>
                        <AIAssessment />

                        <h3 className="text-xs font-semibold tracking-widest uppercase mt-8" style={{ color: '#f0ece4' }}>
                            Threat Scores
                        </h3>
                        <div className="rounded-xl p-4" style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)'
                        }}>
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400 uppercase tracking-widest">Nuclear</span>
                                    <span className="text-sm font-bold text-red-400">
                                        DEFCON {riskData ? Math.ceil((10 - riskData.categories.nuclear) / 2) : '—'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400 uppercase tracking-widest">Geopolitical</span>
                                    <span className={`text-sm font-bold ${riskData?.categories.geopolitical >= 7 ? 'text-red-400' : riskData?.categories.geopolitical >= 4 ? 'text-yellow-400' : 'text-green-400'}`}>
                                        {riskData?.categories.geopolitical ?? '—'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400 uppercase tracking-widest">Economic</span>
                                    <span className={`text-sm font-bold ${riskData?.categories.economic >= 7 ? 'text-red-400' : riskData?.categories.economic >= 4 ? 'text-yellow-400' : 'text-green-400'}`}>
                                        {riskData?.categories.economic ?? '—'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400 uppercase tracking-widest">Cyber</span>
                                    <span className={`text-sm font-bold ${riskData?.categories.cyber >= 7 ? 'text-red-400' : riskData?.categories.cyber >= 4 ? 'text-yellow-400' : 'text-green-400'}`}>
                                        {riskData?.categories.cyber ?? '—'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        {/* Scroll hint */}
        {view === 'globe' && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-gray-500 text-xs animate-bounce">
                scroll down for dashboard
            </div>
        )}
    </div>
    )
}
export default App