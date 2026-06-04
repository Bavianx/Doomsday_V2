import React, { useState } from 'react'
import GlobeComponent from './components/Globe'
import SearchBar from './components/SearchBar'
import ThreatDashboard from './components/ThreatDashboard'


function App() {
    const [view, setView] = useState<'globe' | 'dashboard'>('globe')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

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
                    {/* Country overlay upon click — only shows when country selected */}
                    {selectedCountry && (
                        <div className="mb-6 bg-gray-900 border border-red-900 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-lg font-bold text-red-400">
                                    {selectedCountry}
                                </h2>
                                <button 
                                    onClick={() => setSelectedCountry(null)}
                                    className="text-gray-500 hover:text-white text-sm"
                                >
                                    ✕ clear
                                </button>
                            </div>
                            <p className="text-sm text-gray-400">
                                Showing threat intelligence for {selectedCountry}
                            </p>
                        </div>
                    )}
                    <ThreatDashboard query={searchQuery} />
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
