'use client'

import { useEffect, useRef } from "react";

function Utterances() {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const script = document.createElement('script');

        const config = {
            src: 'https://utteranc.es/client.js',
            repo: 'iamfiro/portfolio',
            'issue-number': '1', // Replace [ENTER ISSUE NUMBER HERE] with a valid issue number
            label: '✨댓글',
            theme: 'github-light',
            crossOrigin: 'anonymous',
            async: true,
        };
    
        Object.entries(config).forEach(([key, value]) => {
            return script.setAttribute(key, String(value));
        });
        
        if(ref.current) {
            const existingScript = ref.current.querySelector('script');
            if (existingScript) ref.current.removeChild(existingScript);
            
            // Use setTimeout to delay the execution of the script
            setTimeout(() => {
                if(ref.current) ref.current.appendChild(script);
            }, 0);
        }
    }, []);

    return <div ref={ref} />;
}

export default Utterances;