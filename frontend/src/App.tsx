import React from 'react'
import SearchBar from './components/SearchBar'
import ThreatDashboard from './components/ThreatDashboard'



function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-red-500 tracking-widest">DOOMSDAY</h1>
        <SearchBar />
        <span className="text-sm text-gray-500">V2</span>
      </nav>
      
      {/* Main content */}
      <main className="px-6 py-6">
        <ThreatDashboard />
      </main>
    </div>
  )
}


export default App;
