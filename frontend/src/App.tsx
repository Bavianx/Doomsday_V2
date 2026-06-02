import React from 'react'
import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import ThreatDashboard from './components/ThreatDashboard'



function App() {
 const [searchQuery, setSearchQuery] = useState('') // searchbar communicates query to app -> app passes this to threatdashboard -> threatdashboard returns the data based on search 

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                <h1 className="text-xl font-bold text-red-500 tracking-widest"> DOOMSDAY</h1>
                <SearchBar onSearch={setSearchQuery} />
                <span className="text-sm text-gray-500">V2</span>
            </nav>
            <main className="px-6 py-6">
                <ThreatDashboard query={searchQuery} />  
            </main>
        </div>
    )
  
}


export default App;
