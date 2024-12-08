'use client'

import style from './HeroApp.module.scss';
import {useEffect, useRef} from "react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const HeroApp = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const leftImageRef = useRef<HTMLImageElement>(null);
    const rightImageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // 스크롤 트리거 설정
        const scrollTrigger = {
            trigger: container,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
        };

        // 메인 애니메이션
        gsap.fromTo(
            container,
            {
                borderRadius: 50,
                width: '90%',
                y: 0,
                position: 'relative'
            },
            {
                borderRadius: 0,
                width: '100%',
                y: '-50vh', // viewport height의 50%만큼 위로 이동
                ease: 'none',
                scrollTrigger: scrollTrigger,
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <div className={style.wrapper}>
            <div ref={containerRef} className={style.container}>
                <Image
                    src={'/mockup_fresio_left.png'}
                    alt={'2024_프레시오 목업 왼쪽 이미지'}
                    width={'1229'}
                    height={'3086'}
                    className={style.mockup}
                    ref={leftImageRef}
                />
                <Image
                    src={'/mockup_fresio_right.png'}
                    alt={'2024_프레시오 목업 오른쪽 이미지'}
                    width={'1229'}
                    height={'3086'}
                    className={style.mockup}
                    ref={rightImageRef}
                />
            </div>
        </div>
    )
}

export default HeroApp;