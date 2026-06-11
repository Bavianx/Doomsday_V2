import { useEffect, useRef, useState } from 'react'

interface GlobeProps {
    onCountryClick?: (country: string) => void
}

let cachedGeoJson: any = null

function GlobeComponent({ onCountryClick }: GlobeProps) {
    const globeRef = useRef<HTMLDivElement>(null)
    const [threatPoints, setThreatPoints] = useState<any[]>([])

    // Fetch threat points from Django
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/countries/')
            .then(res => res.json())
            .then(data => setThreatPoints(data.countries))
    }, [])

    // Build globe when threat points are ready
    useEffect(() => {
        if (!globeRef.current || threatPoints.length === 0) return

        // Build threatMap from fetched data
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

        import('globe.gl').then(({ default: Globe }) => {
            const globe = new Globe(globeRef.current!)
                .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
                .width(globeRef.current!.clientWidth)
                .height(globeRef.current!.clientHeight)

            const controls = globe.controls()
            controls.minDistance = 120
            controls.maxDistance = 300
            controls.enablePan = false

            // Resize handler — only resizes, nothing else
            const handleResize = () => {
                if (globeRef.current) {
                    globe.width(globeRef.current.clientWidth)
                    globe.height(globeRef.current.clientHeight)
                }
            }
            window.addEventListener('resize', handleResize)

            // Load GeoJSON — separate from resize
            loadGeoJson().then(countries => {
                globe
                    .polygonsData(countries.features)
                    .polygonAltitude(0.01)
                    .polygonStrokeColor(() => 'rgba(255,255,255,0.03)')
                    .onPolygonClick((d: any) => {
                        const name = d.properties.name
                        if (onCountryClick) onCountryClick(name)
                    })

                let frame = 0

                setInterval(() => {
                    frame += 0.07

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
                }, 300)
            })

            return () => window.removeEventListener('resize', handleResize)
        })
    }, [threatPoints])

    return <div ref={globeRef} style={{ width: '100%', height: '100%' }} />
}

export default GlobeComponent