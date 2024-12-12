import style from './HomeHero.module.scss';
import { IoMdArrowUp } from "react-icons/io";
import RecentBlogPost from "@/components/@Home/RecentBlogPost/RecentBlogPost";
import {useHeroAnimation} from "@/components/@Home/Hero/Hero.hook";

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