'use client'

import { useEffect, useRef } from 'react';
import style from './style.module.scss';
import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from 'gsap/CustomEase';

const BigTitle = () => {
    const textRef = useRef(null);
    const text2Ref = useRef(null);
    const text3Ref = useRef(null);
    const text4Ref = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)
        gsap.registerPlugin(CustomEase) 

        gsap.to([textRef.current, text2Ref.current, text3Ref.current, text4Ref.current], {
            scrollTrigger: {
                trigger: textRef.current,
                start: `top 50%`,
                end: `+=80%`,
                scrub: true,
                markers: false,
            },
            ease: "power2.out",    
            stagger: 0.1,
            duration: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        })
    }, [])
    return (
        <div className={style.container}>
            <h1 className={`${style.title} hover`} ref={textRef}>Creative</h1>
            <h1 className={style.title} ref={text2Ref}>Web Developer</h1>
            <h1 className={style.title} ref={text3Ref}>React</h1>
            <h1 className={style.title} ref={text4Ref}>Next.js</h1>
            <div className={style.right}>
            hi, i'm FIRO, front-end developer currently studying software at Sunrin Internet High School in  South Korea. not reluctant to learn new technologies and are creating services that people will love and need.
            </div>
        </div>
    )
};

export default BigTitle;