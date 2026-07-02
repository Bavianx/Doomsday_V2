import { useEffect, useRef, useState } from 'react'

interface GlobeProps {
    onCountryClick?: (country: string) => void
}

interface Fire {
    lat: number
    lng: number
    brightness: number
}

interface Quake {
    lat: number
    lng: number
    magnitude: number
    place: string
}

let cachedGeoJson: any = null

function GlobeComponent({ onCountryClick }: GlobeProps) {
    const globeRef = useRef<HTMLDivElement>(null)
    const [threatPoints, setThreatPoints] = useState<any[]>([])
    const [quakes, setQuakes] = useState<Quake[]>([])
    const globeInstanceRef = useRef<any>(null)
    const [fires, setFires] = useState<Fire[]>([])

    // Fetch threat points from Django
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/countries/')
            .then(res => res.json())
            .then(data => setThreatPoints(data.countries))
    }, [])

    // Fetch USGS earthquakes
    useEffect(() => {
        fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=5.5&limit=50&orderby=time')
            .then(res => res.json())
            .then(data => {
                const parsed: Quake[] = data.features.map((f: any) => ({
                    lat: f.geometry.coordinates[1],
                    lng: f.geometry.coordinates[0],
                    magnitude: f.properties.mag,
                    place: f.properties.place
                }))
                setQuakes(parsed)
            })
    }, [])

    // Update rings when quakes load
    useEffect(() => {
        if (!globeInstanceRef.current || quakes.length === 0) return
        globeInstanceRef.current
            .ringsData(quakes)
            .ringLat((d: any) => d.lat)
            .ringLng((d: any) => d.lng)
            .ringMaxRadius((d: any) => d.magnitude * 0.5)
            .ringPropagationSpeed(1.25)
            .ringRepeatPeriod(2400)
            .ringColor(() => (t: number) => `rgba(34,211,238,${1 - t})`)
            .ringAltitude(0.02)
    }, [quakes])

    // Fetch NASA FIRMS wildfires
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/firms/')
            .then(res => res.text())
            .then(csv => {
                const lines = csv.trim().split('\n')
                const headers = lines[0].split(',')
                const latIdx = headers.indexOf('latitude')
                const lngIdx = headers.indexOf('longitude')
                const brightIdx = headers.indexOf('bright_ti4')
                const parsed = lines.slice(1).map(line => {
                    const cols = line.split(',')
                    return {
                        lat: parseFloat(cols[latIdx]),
                        lng: parseFloat(cols[lngIdx]),
                        brightness: parseFloat(cols[brightIdx])
                    }
                }).filter(f => !isNaN(f.lat) && !isNaN(f.lng) && f.brightness > 350)
                setFires(parsed)
            })
    }, [])

    // Update wildfire points when fires load
    useEffect(() => {
        if (!globeInstanceRef.current || fires.length === 0) return
        globeInstanceRef.current
            .pointsData(fires)
            .pointLat((d: any) => d.lat)
            .pointLng((d: any) => d.lng)
            .pointAltitude(0.03)
            .pointRadius((d: any) => Math.min((d.brightness - 300) / 200, 1.5))
            .pointColor(() => 'rgba(255,200,50,0.85)')
    }, [fires])

    // Build globe when threat points are ready
    useEffect(() => {
        if (!globeRef.current || threatPoints.length === 0) return

        const threatMap: { [key: string]: number } = {}
        threatPoints.forEach(point => {
            threatMap[point.name] = point.score
        })

        const loadGeoJson = async () => {
            if (!cachedGeoJson) {
                const res = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
                cachedGeoJson = await res.json()
            }
            return cachedGeoJson
        }

        let animationId: number

        import('globe.gl').then(({ default: Globe }) => {
            const width = globeRef.current!.clientWidth
            const height = globeRef.current!.clientHeight

            const globe = new Globe(globeRef.current!)
                .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
                .width(width)
                .height(height)

            globeInstanceRef.current = globe
            const controls = globe.controls()
            controls.enablePan = false

            const getAltitude = () => {
                const w = window.innerWidth
                if (w < 500) return 7.0
                if (w < 768) return 5.5
                if (w < 1024) return 3.5
                return 2.2
            }

            const getDistances = () => {
                const w = window.innerWidth
                if (w < 500) return { min: 350, max: 700 }
                if (w < 768) return { min: 280, max: 600 }
                if (w < 1024) return { min: 200, max: 450 }
                return { min: 120, max: 300 }
            }

            const distances = getDistances()
            controls.minDistance = distances.min
            controls.maxDistance = distances.max
            globe.pointOfView({ altitude: getAltitude() })

            const handleResize = () => {
                if (globeRef.current) {
                    globe.width(globeRef.current.clientWidth)
                    globe.height(globeRef.current.clientHeight)
                }
            }

            const resizeObserver = new ResizeObserver(() => handleResize())
            resizeObserver.observe(globeRef.current!)
            window.addEventListener('resize', handleResize)

            loadGeoJson().then(countries => {
                globe
                    .polygonsData(countries.features)
                    .polygonAltitude(0.01)
                    .polygonStrokeColor(() => 'rgba(255,255,255,0.03)')
                    .onPolygonClick((d: any) => {
                        const name = d.properties.name
                        if (onCountryClick) onCountryClick(name)
                    })

                if (quakes.length > 0) {
                    globe
                        .ringsData(quakes)
                        .ringLat((d: any) => d.lat)
                        .ringLng((d: any) => d.lng)
                        .ringMaxRadius((d: any) => d.magnitude * 1)
                        .ringPropagationSpeed(1.5)
                        .ringRepeatPeriod(2400)
                        .ringColor(() => (t: number) => `rgba(34,211,238,${1 - t})`)
                        .ringAltitude(0.02)
                }

                let frame = 0

                const animate = () => {
                    frame += 0.02
                    globe.polygonCapColor((d: any) => {
                        const name = d.properties.name
                        const score = threatMap[name]
                        if (!score) return 'rgba(255,255,255,0.01)'
                        const wave = (Math.sin(frame + score) + 1) / 2
                        const alpha = 0.15 + wave * 0.6
                        return score >= 8 ? `rgba(239,68,68,${alpha})` :
                               score >= 6 ? `rgba(249,115,22,${alpha})` :
                               `rgba(234,179,8,${alpha})`
                    })
                    animationId = requestAnimationFrame(animate)
                }
                animate()
            })

            return () => {
                resizeObserver.disconnect()
                window.removeEventListener('resize', handleResize)
                cancelAnimationFrame(animationId)
            }
        })
    }, [threatPoints, quakes])

    return <div ref={globeRef} style={{ width: '100%', height: '100%' }} />
}

export default GlobeComponent