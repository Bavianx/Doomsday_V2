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

        import('globe.gl').then(({ default: Globe }) => {
            const globe = new Globe(globeRef.current!)
                .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
                .width(globeRef.current!.clientWidth)
                .height(globeRef.current!.clientHeight)
                .pointsData(threatPoints)
                .ringsData(threatPoints)
                .ringLat('lat')
                .ringLng('lng')
                .ringColor((d: any) => d.score >= 8 ? '#ef4444' : '#f97316')
                .ringMaxRadius((d: any) => d.score / 2)
                .ringPropagationSpeed(.5)
                .ringRepeatPeriod(1850)
                .pointLat('lat')
                .pointLng('lng')
                .pointColor((d: any) => d.score >= 8 ? '#ef4444' : d.score >= 6 ? '#f97316' : '#eab308')
                .pointAltitude((d: any) => d.score / 50)
                .pointRadius(0.5)
                .pointLabel((d: any) => `${d.country}: ${d.score}`)
                .onPointClick((d: any) => {
                    if (onCountryClick) onCountryClick(d.country)
                })

            const controls = globe.controls()
            controls.minDistance = 120
            controls.maxDistance = 300
            controls.enablePan = false
        })
    }, []);

    return <div ref={globeRef} style={{ width: '100%', height: '100%' }} />
}

export default GlobeComponent;
