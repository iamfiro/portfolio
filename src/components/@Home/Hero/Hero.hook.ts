'use client'

import {Ref, useEffect, useRef} from "react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useHeroAnimation = (): Ref<HTMLDivElement> => {
	const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(!containerRef.current) return;

        if (!containerRef) {
			throw Error('containerRef가 Element를 참조하지 않습니다.');
		}

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
    });

	return containerRef;
}