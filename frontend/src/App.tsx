import React, { useState } from 'react'
import GlobeComponent from './components/Globe'
import SearchBar from './components/SearchBar'
import ThreatDashboard from './components/ThreatDashboard'
import RiskScore from './components/RiskScore'
import StockNews from './StockNews'


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

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-gray-950">

            {/* Globe layer — always rendered, fades based on view */}
            <div className={`absolute inset-0 transition-opacity duration-700 ${
                view === 'globe' ? 'opacity-100' : 'opacity-30'
            }`}>
                <GlobeComponent onCountryClick={(country) => { 
                    setSelectedCountry(country)
                    setView('dashboard')
                }} />
            </div>

            {/* Minimal navbar — always visible */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4">
                <h1 className="text-xl font-bold text-red-500 tracking-widest"> DOOMSDAY</h1>
                <SearchBar onSearch={setSearchQuery} />
            </div>

            {/* Dashboard layer — slides up on scroll down */}
            <div className={`absolute inset-0 z-20 transition-all duration-700 ${
                view === 'dashboard' 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-full pointer-events-none'
            }`}>
                <div className="h-full overflow-y-auto bg-gray-950/90 backdrop-blur-sm pt-20 px-6">
                    {/* Minimal navbar — always visible */}
                    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4">
                        <h1 className="text-xl font-bold text-red-500 tracking-widest"> DOOMSDAY</h1>
                        <div className="absolute left-1/3 -translate-x-1/2">
                            <SearchBar onSearch={setSearchQuery} />
                        </div>
                    </div>

                    {/* Coordinates bar */}
                    <div className="mb-4 py-2 px-4 rounded-lg flex items-center gap-6">
                        <span className="text-xs text-gray-500 uppercase tracking-widest">Location | </span>
                        <span className="text-sm text-gray-300">
                            LAT: {selectedCountry ? '—' : '0.00 ,'}   {/*Will implement true to nature geolocation for selected area*/}
                            &nbsp;LNG: {selectedCountry ? '—' : '0.00'}
                        </span>
                        <span className="text-sm text-red-400 font-medium">
                            {selectedCountry || ' | Global View'}
                        </span>
                    </div>
                    {/* Three column layout */}
                    <div className="grid grid-cols-3 gap-4">
                        
                        {/* Left — Live Threat Feed */}
                        <div className="flex flex-col gap-4">
                            <ThreatDashboard query={searchQuery} selectedCountry={selectedCountry} />
                        </div>

                        {/* Middle — Stock News + Global Risk Score */}
                        <div className="flex flex-col gap-4">
                            <StockNews />
                            <RiskScore />
                        </div>

                        {/* Right — AI Assessment + Threat Scores */}
                        <div className="flex flex-col gap-4" >
                            <h3 className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3" style={{ color: '#f0ece4' }}>
                                AI Assessment
                            </h3>
                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                                <p className="text-sm text-gray-400">
                                    Claude API integration pending credits.
                                </p>
                            </div>
                            {/* Threat Scores */}
                                <h3 className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3" style={{ color: '#f0ece4' }}>
                                    Threat Scores
                                </h3>
                                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">

                                    <div className="flex flex-col gap-3">
                                        {/* Nuclear — DEFCON Rating score */}
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
