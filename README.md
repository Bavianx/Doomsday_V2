# PANTHEON — Geopolitical Intelligence Dashboard

A full-stack AI-powered geopolitical intelligence platform built with a Django REST API backend, React/TypeScript frontend, and a live 3D Globe.gl world map showing real-time threat intelligence, earthquake data, wildfire activity, and geopolitical risk scores.

V2 is a complete rebuild of Doomsday V1 — moving from a monolithic Django template architecture to a fully decoupled REST API and React frontend.

---

## Live Demo

> Deployment in progress — AWS deployment underway.

---

## Features

- **3D Interactive Globe** — Globe.gl spinning Earth with live threat pulse animation on high-risk countries, USGS earthquake rings, and NASA FIRMS wildfire points
- **Three-Layer Globe Visualisation** — Country threat heatmap (red/orange/yellow polygons), cyan concentric earthquake rings scaled by magnitude, and gold/amber wildfire pinpoints — all simultaneously readable with distinct altitude layers
- **Scroll Transition** — Smooth globe → dashboard transition on mouse scroll with threshold detection
- **Country Click Intelligence** — Click any country on the globe to filter the dashboard by that country's specific threat news and set true lat/lng coordinates
- **Live Threat Feed** — Real-time headlines ingested from NewsAPI across four threat categories, clickable through to source articles
- **AI Threat Scoring** — Mock scoring pipeline ready for Claude API integration, scoring each headline 0–10
- **AI Assessment Panel** — Summary risk assessment generated from current threat scores, Claude API integration ready
- **Global Risk Score** — Weighted composite score: nuclear (35%), geopolitical (25%), economic (25%), cyber (15%)
- **DEFCON Nuclear Scoring** — Nuclear threat category displayed as DEFCON level
- **Live Search** — Search any threat topic or country, dashboard updates instantly
- **World Stock News** — Live financial headlines alongside threat intelligence
- **Auto Refresh** — Backend automatically re-fetches news if data is older than 3 hours
- **Celery + Redis Background Tasks** — Automated news fetching and scoring every 3 hours via Celery beat scheduler
- **Category Colour Coding** — Nuclear, geopolitical, economic, and cyber headlines colour coded with dynamic score colours

---

## Architecture

Frontend (React + TypeScript) communicates with Backend (Django REST API) via JSON over HTTP.

```
Frontend                        Backend
─────────────────────────────────────────────────────
Globe.gl — 3D world map    ←→   PostgreSQL database
ThreatDashboard component  ←→   NewsAPI integration
RiskScore component        ←→   Anthropic Claude API (ready)
AIAssessment component     ←→   AI scoring pipeline
SearchBar component        ←→   Auto-refresh logic
StockNews component        ←→   Weighted risk calculator
Scroll transition logic    ←→   USGS Earthquake API
Country click handler      ←→   NASA FIRMS Wildfire API (proxied)
Celery beat scheduler      ←→   Background task queue (Redis)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS, Globe.gl |
| Backend | Django, Django REST Framework |
| Database | PostgreSQL |
| Task Queue | Celery, Redis (Memurai on Windows) |
| News Data | NewsAPI |
| Earthquake Data | USGS Earthquake API |
| Wildfire Data | NASA FIRMS (VIIRS SNPP NRT) |
| AI Scoring | Anthropic Claude API (mock active, real API ready) |
| Deployment | AWS (in progress) |

---

## Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL
- Memurai (Redis for Windows) or Redis

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate         # Windows
pip install -r requirements.txt
```

Create a `.env` file in `/backend/`:

```
NEWS_API_KEY=your_newsapi_key
ANTHROPIC_API_KEY=your_anthropic_key
FIRMS_KEY=your_nasa_firms_key
DATABASE_URL=your_postgres_url
```

Run migrations and start the server:

```bash
python manage.py migrate
python manage.py runserver
```

### Celery (Background Tasks)

Open two additional terminals with venv active:

**Terminal 1 — Worker:**
```bash
celery -A core worker --pool=solo -l info
```

**Terminal 2 — Beat Scheduler:**
```bash
celery -A core beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
```

### Frontend

```bash
cd frontend
npm install
npm start
```

App runs at `http://localhost:3000`

---

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/health/` | GET | API health check |
| `/api/threats/` | GET | Live threat headlines with AI scores |
| `/api/search/?q=` | GET | Search headlines by keyword |
| `/api/country/?country=` | GET | Filter headlines by country |
| `/api/risk/` | GET | Global risk score and category breakdown |
| `/api/countries/` | GET | Country threat scores for globe heatmap |
| `/api/stocknews/` | GET | Financial news headlines |
| `/api/assessment/` | GET | AI-generated risk assessment summary |
| `/api/firms/` | GET | NASA FIRMS wildfire data (proxied) |
| `/api/fetch/` | GET | Manually trigger news fetch |
| `/api/score/` | GET | Manually trigger AI scoring |

---

## Known Limitations

- **Globe resizing** — Globe.gl's Three.js renderer initialises at a fixed size on first render. Globe canvas initialises at the viewport size on first load. Resizing the browser window after load may cause rendering inconsistencies. Refreshing the page resolves this. A full fix would require destroying and recreating the globe instance on resize. 
- **Wildfire data volume** — NASA FIRMS returns tens of thousands of data points globally. The proxy is limited to 200 rows and filtered to brightness > 350 to maintain performance. Without this filter the globe becomes unresponsive.
- **Dual navbar** — The navbar is currently shared across the globe and dashboard views. On the dashboard it overlays scrolled content when scrolling. A split navbar architecture is planned as a post-deployment improvement currently affecting the viewing experience of users.
- **Claude API scoring** — Real Claude API scoring is implemented in `AI_Scorer.py` (`score_news_items_claude()`) but requires a funded Anthropic API key to activate. The mock scorer (`score_news_items()`) is active by default.
- **Celery on Windows** — Celery requires `--pool=solo` on Windows due to multiprocessing limitations. On Linux/AWS this flag is not needed.
- **StrictMode double fetching** — React StrictMode causes double API calls in development. This does not occur in production builds.

---

## Roadmap

- [x] USGS Earthquake API — Live seismic rings on the globe
- [x] NASA FIRMS Wildfires — Live wildfire points on the globe
- [x] GeoJSON Country Borders — Country outlines on the globe
- [x] Real Claude API Scoring — Code complete, pending API credits
- [x] Celery + Redis — Automated background news fetching every 3 hours
- [ ] AWS Deployment — Production deployment in progress
- [ ] WebSockets — Push live updates to React without polling
- [ ] GDELT Integration — Global geopolitical event database
- [ ] Globe Scale Transition — Globe shrinks when dashboard is active
- [ ] Split Navbar — Separate globe and dashboard navbars

---

## V1 vs V2

| | V1 | V2 |
|---|---|---|
| Architecture | Monolithic Django templates | Decoupled REST API + React |
| Frontend | Django HTML/Bootstrap | React + TypeScript + Tailwind |
| Globe | None | Globe.gl with three data layers |
| Database | SQLite | PostgreSQL |
| Task Queue | None | Celery + Redis |
| AI Scoring | Mock only | Mock + Claude API ready |
| Data Sources | NewsAPI only | NewsAPI + USGS + NASA FIRMS |

---

