import React from 'react';
import { useState } from 'react'

function SearchBar() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState('')


  const handleSearch = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/health/')
    const data = await response.json()
    setResult(data.status)
  }
  return (
    <div>
      <input
        type="text"
        value={query} // Current state of the input
        onChange={(e) => setQuery(e.target.value)}  // updates the request state on each keystroke //
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder='Search threats..'
      />
      <p>{result}</p>
    </div>
  )
}

function ThreatScore({score}: { score: number }) {
  return (
    <div>
    <p> Global Risk Score: {score}</p>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <h1>Doomsday V2</h1>
      <p>Global Threat Intelligence Platform</p>
      <ThreatScore score={5.87} />
      < SearchBar/>
    </div>
  );
}





export default App;
