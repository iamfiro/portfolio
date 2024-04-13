'use client'

import { useEffect, useRef } from 'react';
import style from './style.module.scss';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

const Motto = () => {
    const ref = useRef<HTMLDivElement>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)
        gsap.fromTo(ref.current, {
            scale: 0,
        }, {
            scale: 1,
            scrollTrigger: {
                trigger: ref.current,
                start: `top 200%`,
                end: `+=80%`,
                scrub: true,
                markers: false,
            },
            ease: "linear",
        })

        gsap.fromTo(containerRef.current, {
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)',
        }, {
            scrollTrigger: {
                trigger: containerRef.current,
                start: `top 120%`,
                end: `+=40%`,
                scrub: true,
                markers: false,
            },
            ease: "linear",    
            stagger: 0.1,
            duration: 1,
            clipPath: 'polygon(0 0, 100% 0%, 100% 100%, 0% 100%)',
        })

        const splitTypes = document.querySelectorAll('.text');

        splitTypes.forEach((el: any) => {
            const text = new SplitType(el as HTMLElement, { types: 'chars,words' });

            gsap.from(text.chars, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 55%',
                    end: '+=70%',
                    scrub: true,
                    markers: false,
                },
                duration: 0.1,
                opacity: 0.2,
                stagger: 0.1,
            })
        });
    }, []);

    return (
        <div className={style.wrap}>
            <div className={style.container} ref={ref}>
                <div className={style.left}>
                    <h1 className={style.title} ref={containerRef}>I value this</h1>
                    <h3 className={style.subTitle}>I take user-friendliness important to us</h3>
                    <span className={`${style.text} text`}>Trying to create a service that solves the inconveniences that are inconvenient in everyday life</span>
                    <h3 className={style.subTitle}>I'm trying to record anything to record anything.</h3>
                    <span className={`${style.text} text`}>I want to be the one to document the skills I've learned and take a leap forward through my past self.</span>
                    <h3 className={style.subTitle}>We value constantly learning new skills learning new skills</h3>
                    <span className={`${style.text} text`}>Keeping up with the fast-paced development market I'm constantly learning new skills</span>
                </div>
            </div>
        </div>
    )
};

export default Motto;