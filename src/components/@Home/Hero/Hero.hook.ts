import {RefObject, useEffect} from "react";
import {gsap} from "gsap";

interface UseHeroAnimationProps {
	containerRef: RefObject<HTMLDivElement>
}

export const useHeroAnimation = ({containerRef}: UseHeroAnimationProps) => {
    useEffect(() => {
        if(!containerRef.current) return;

        gsap.fromTo(containerRef.current, {
            marginTop: 0,
        }, {
            y: '20vh',
            ease: 'linear',

            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            }
        });

        gsap.to(containerRef.current, {
            opacity: 0,
            ease: 'linear',

            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom-=150px center',
                scrub: true,
            }
        });
    }, []);
}