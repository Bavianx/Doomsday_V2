import { useEffect, useRef } from 'react';

function GlobeComponent() {
    const globeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!globeRef.current) return;

        import('globe.gl').then(({ default: Globe }) => {
            const globe = new Globe(globeRef.current!)
                .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
                .width(window.innerWidth)
                .height(window.innerHeight);

            const controls = globe.controls();

            controls.minDistance = 120;
            controls.maxDistance = 300;

            controls.enablePan = false;
        });
    }, []);

    return <div ref={globeRef} />;
}

export default GlobeComponent;
