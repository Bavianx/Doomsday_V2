## Doomsday Dashboard V2
A full stack AI-powered geopolitical intelligence platform. Built with a Django REST API backend, React and TypeScript frontend, and a live 3D Globe.gl world map showing real-time threat intelligence, earthquake data, and geopolitical risk scores.
V2 is a complete rebuild of Doomsday V1 — moving from a monolithic Django template architecture to a fully decoupled REST API and React frontend.

## Live Demo

Deployment in progress — AWS target

## Features

- 3D Interactive Globe — Globe.gl spinning Earth with live threat pulse rings on high-risk countries
  
- Scroll Transition — Smooth globe → dashboard transition on mouse scroll with threshold detection
  
- Country Click Intelligence — Click any threat point on the globe to filter the dashboard by that country's specific news
  
- Live Threat Feed — Real-time headlines ingested from NewsAPI across four threat categories
  
- AI Threat Scoring — Mock scoring pipeline ready for Claude API integration, scoring each headline 0-10
  
- Global Risk Score — Weighted composite score calculated from nuclear (35%), geopolitical (25%), economic (25%), and cyber (15%) category averages
  
- Live Search — Search any threat topic or country, dashboard updates instantly
  
- Auto Refresh — Backend automatically re-fetches news if data is older than 6 hours
  
- Category Colour Coding — Nuclear, geopolitical, economic, and cyber headlines colour coded with dynamic score colours (red/yellow/green)

Architecture
┌─────────────────────────────┐         ┌──────────────────────────────┐
│     React + TypeScript      │  ←────→ │     Django REST API          │
│     Frontend                │  JSON   │     Backend                  │
│                             │         │                              │
│  Globe.gl — 3D world map    │         │  PostgreSQL database         │
│  ThreatDashboard component  │         │  NewsAPI integration         │
│  RiskScore component        │         │  Anthropic Claude API        │
│  SearchBar component        │         │  AI scoring pipeline         │
│  Scroll transition logic    │         │  Auto-refresh logic          │
│  Country click handler      │         │  Weighted risk calculator    │
└─────────────────────────────┘         └──────────────────────────────┘

## V2 Roadmap

- [ ] Three.js Doomsday Clock — 3D animated clock driven by global risk score
- [ ] USGS Earthquake API — Live seismic activity on the globe
- [ ] NASA FIRMS Wildfires — Live wildfire perimeters on the globe
- [ ] GeoJSON Country Borders — Proper country outlines on the globe
- [ ] Real Claude API Scoring — Replace mock scoring with live LLM analysis
- [ ] Celery + Redis — Automated background news fetching every hour
- [ ] WebSockets — Push live updates to React without polling
- [ ] AWS Deployment — Production deployment
- [ ] Globe Scale Transition — Globe shrinks when dashboard is active
- [ ] GDELT Integration — Global geopolitical event database
