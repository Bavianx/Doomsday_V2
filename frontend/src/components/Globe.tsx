import { useEffect, useRef } from 'react';

interface GlobeProps {
    onCountryClick?: (country: string) => void
}

function GlobeComponent({ onCountryClick }: GlobeProps) {
    const globeRef = useRef<HTMLDivElement>(null)

    // Hardcoded threat points 
    const threatPoints = [
        { lat: 55.7, lng: 37.6, country: 'Russia', score: 9.1 },
        { lat: 35.6, lng: 139.7, country: 'Japan', score: 4.2 },
        { lat: 39.9, lng: 116.4, country: 'China', score: 7.8 },
        { lat: 38.9, lng: -77.0, country: 'USA', score: 5.5 },
        { lat: 33.6, lng: 73.1, country: 'Pakistan', score: 8.2 },
        { lat: 35.7, lng: 51.4, country: 'Iran', score: 8.9 },
        { lat: 37.5, lng: 127.0, country: 'North Korea', score: 9.4 },
    ]
    useEffect(() => {
        if (!globeRef.current) return

        const threatMap: { [key: string]: number } = {
            'Russia': 9.1,
            'China': 7.8,
            'United States of America': 5.5,
            'Pakistan': 8.2,
            'Iran': 8.9,
            'North Korea': 9.4,
            'Japan': 4.2,
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
        
        fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
            .then(res => res.json())
            .then(countries => {
                globe
                    .polygonsData(countries.features)
                    .polygonAltitude(0.01)
                    .polygonCapColor((d: any) => {
                        const name = d.properties.name
                        const score = threatMap[name]
                        if (!score) return 'rgba(255,255,255,0.02)'
                        return score >= 8 ? 'rgba(239,68,68,0.6)' :
                            score >= 6 ? 'rgba(249,115,22,0.4)' :
                            'rgba(234,179,8,0.3)'
                    })
                    .polygonStrokeColor(() => 'rgba(255,255,255,0.03)')
                    .onPolygonClick((d: any) => {
                        const name = d.properties.name
                        if (onCountryClick) onCountryClick(name)
                    })
                let frame = 0

                setInterval(() => {
                    frame += 0.07  // speed of wave

                    globe.polygonCapColor((d: any) => {
                        const name = d.properties.name
                        const score = threatMap[name]
                        if (!score) return 'rgba(255,255,255,0.01)'
                        
                        // each country gets a slightly offset wave based on its score
                        const wave = (Math.sin(frame + score) + 1) / 2  // 0 to 1
                        const alpha = 0.15 + wave * 0.6
                        
                        return score >= 8 ? `rgba(239,68,68,${alpha})` :
                            score >= 6 ? `rgba(249,115,22,${alpha})` :
                            `rgba(234,179,8,${alpha})`
                    })
                }, 50)
            })
        })
    }, []);

    return <div ref={globeRef} style={{ width: '100%', height: '100%' }} />
}

export default GlobeComponent;
