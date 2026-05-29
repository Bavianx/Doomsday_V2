import React from 'react';
import { useState } from 'react'

function SearchBar() {
  const [query, setQuery] = useState('')
  return (
    <div>
      <input
        type="text"
        value={query} // Current state of the input
        onChange={(e) => setQuery(e.target.value)}  // updates the request state on each keystroke //
      />
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
