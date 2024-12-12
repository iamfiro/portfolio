'use client'

import style from './HomeHero.module.scss';
import { IoMdArrowUp } from "react-icons/io";
import {useEffect, useRef} from "react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import RecentBlogPost from "@/components/@Home/RecentBlogPost/RecentBlogPost";

gsap.registerPlugin(ScrollTrigger);

const HomeHero = () => {
    const containerRef = useRef<HTMLDivElement>(null);

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

    return (
        <div className={style.wrap} ref={containerRef}>
            <div className={style.container}>
                <div className={style.top}>
                    <h1 className={style.title}>
                        <span>끊임없이 배우고 성장하는</span>
                        <br/>
                        <span>프론트엔드 개발자</span>
                    </h1>
                    <section className={style.tag}>
                        <article>프론트엔드</article>
                        <article>UI / UX</article>
                        <article>선린인터넷고등학교</article>
                    </section>
                </div>
                <section className={style.bottom}>
                    <article className={style.recentProject}>
                        <img src="/project/nodream.png" alt="hero-image"/>
                        <div>
                            <span>최근 프로젝트</span>
                            <IoMdArrowUp/>
                        </div>
                    </article>
                    <RecentBlogPost />
                </section>
            </div>
        </div>
    )
}

export default HomeHero