import React from 'react';


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
    </div>
  );
}




export default App;
