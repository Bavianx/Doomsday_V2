import React from 'react'
import SearchBar from './components/SearchBar'
import ThreatDashboard from './components/ThreatDashboard'



function App() {
  return (
    <div className="App">
      <h1>Doomsday V2</h1>
      <p>Global Threat Intelligence Platform</p>
      <SearchBar />
      <ThreatDashboard />
    </div>
  );
}


export default App;
