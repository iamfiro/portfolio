'use client'

import style from './HeroApp.module.scss';
import {useEffect, useRef} from "react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import Image from "next/image";

// ScrollTrigger 등록
gsap.registerPlugin(ScrollTrigger);

const HeroApp = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.fromTo(
            containerRef.current,
            {
                borderRadius: 50,
                width: '90%',
            },
            {
                borderRadius: 0,
                width: '100%',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top+=200px bottom",
                    end: "bottom bottom",
                    scrub: true,
                },
            }
        );
    }, []);



    return (
        <div ref={containerRef} className={style.container}>
            <Image
                src={'/mockup_fresio_left.png'}
                alt={'2024_프레시오 목업 왼쪽 이미지'}
                width={'1229'} height={'3086'}
                className={style.mockup}
            />
            <Image
                src={'/mockup_fresio_right.png'}
                alt={'2024_프레시오 목업 오른쪽 이미지'}
                width={'1229'} height={'3086'}
                className={style.mockup}
            />
        </div>
    )
}

export default HeroApp;