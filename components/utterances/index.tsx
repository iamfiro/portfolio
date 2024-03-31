'use client'

import { useEffect, useRef } from "react";

function Utterances() {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const script = document.createElement('script');

        const config = {
            src: 'https://utteranc.es/client.js',
            repo: 'iamfiro/portfolio',
            'issue-term': 'pathname',
            label: '✨댓글',
            theme: 'github-light',
            crossOrigin: 'anonymous',
            defer: true,
        };
    
        Object.entries(config).forEach(([key, value]) => {
            return script.setAttribute(key, String(value));
        });
        
        if(ref.current) {
            const existingScript = ref.current.querySelector('script');
            if (existingScript) ref.current.removeChild(existingScript);
            
            ref.current.appendChild(script);
        }
    }, []);

    return <div ref={ref} />;
}

export default Utterances;