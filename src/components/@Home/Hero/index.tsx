'use client'

import style from './HomeHero.module.scss';
import RecentBlogPost from "@/components/@Home/RecentBlogPost/RecentBlogPost";
import {useHeroAnimation} from "@/components/@Home/Hero/Hero.hook";
import RecentProject from "@/components/@Home/RecentProject/RecentProject";

const HomeHero = () => {
    const containerRef = useHeroAnimation();

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
                    <RecentProject />
                    <RecentBlogPost />
                </section>
            </div>
        </div>
    )
}

export default HomeHero