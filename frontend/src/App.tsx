import React from 'react';
import { useState, useEffect } from 'react'

function SearchBar() {
  const [query, setQuery] = useState('')    // state for what the user types then query holds the current value all under an empty string 
  const [results, setResults] = useState<any[]>([])


  const handleSearch = async () => {  //runs when user presses enter with async added for wait confirmation from the API
    const response = await fetch(`http://127.0.0.1:8000/api/search/?q=${query}`)  //calls the query into the URL and awaits a response back from the Django API
    const data = await response.json()  //converts raw response data into JS object
    setResults(data.results) //Displays outcome to users (result)
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
      {results.map((item, index) => (
          <div key={index}>
              <p><strong>{item.title}</strong></p>
              <small>{item.source}</small>
          </div>
      ))}
    </div>
  )
}

function ThreatFeed() {
    const [score, setScore] = useState('')
    useEffect(() => {
          fetch('http://127.0.0.1:8000/api/health/')
              .then(res => res.json())
              .then(data => setScore(data.status))  // Variable identifier specifically for calling Django keys to access data
      }, [])

      return <p>Global Risk Score: {score}</p>
}


function ThreatScore({score}: { score: number }) {
  return (
    <div>
    <p> Global Risk Score: {score}</p>
    </div>
  );
}

function ThreatDashboard() {              // Live Threat data scoring displaying the core concept of the project
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/threats/')
            .then(res => res.json())
            .then(data => setData(data))    // Variable identifier specifically for calling Django keys to access data e.g. data.country
    }, [])

    if (!data) return <p>Loading...</p> //Stall 

    return (         
        <div> 
            <h2>Global Risk Score: {data.global_score}</h2>       
            <h3>Categories:</h3>
            <p>Nuclear: {data.categories.nuclear}</p>
            <p>Geopolitical: {data.categories.geopolitical}</p>
            <p>Economic: {data.categories.economic}</p>
            <p>Cyber: {data.categories.cyber}</p>
            <h3>Latest Headlines:</h3>
            {data.headlines.map((item: any, index: number) => (
                <div key={index}>
                    <p><strong>{item.title}</strong> — {item.score}</p>
                </div>
            ))}
        </div>
    )
}

function App() {
  return (
    <div className="App">
      <h1>Doomsday V2</h1>
      <p>Global Threat Intelligence Platform</p>
      <ThreatScore score={5.87} />
      <SearchBar/>
      <ThreatFeed />
      <ThreatDashboard />
    </div>
  );
}


export default App;
