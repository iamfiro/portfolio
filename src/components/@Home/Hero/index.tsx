import style from './HomeHero.module.scss';
import { IoMdArrowUp } from "react-icons/io";
import { BsRssFill } from "react-icons/bs";

const HomeHero = () => {
    return (
        <div className={style.wrap}>
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
                    <div className={style.recentBlog}>
                        <div className={style.category}>
                            <BsRssFill />
                            <span>최근 블로그</span>
                        </div>
                        <div className={style.name}>
                            <span>인공지능과 사람 지능의 인과관계</span>
                            <IoMdArrowUp/>
                        </div>
                        <span className={style.content}>
                            이 글은 인공지능과 사람 지능의 인가관계에 대해 설명합니다.
                            인공지능은 사람의 지능을 모방하는 기술입니다.
                            인가관계란 인공지능이 사람의 지능을 모방하는 것을 의미합니다.
                            인공지능과 사람 지능의 인가관계에 대해 좀 더 자세히 살펴보면 다음과 같습니다.
                            인공지능은 사람의 학습능력, 추론능력, 문제해결능력 등을 모방하여 구현합니다. 즉, 사람이 경험과 학습을 통해 지식을 쌓아가고 이를 바탕으로 문제를 해결해 나가는 과정을 컴퓨터 프로그램으로 구현하는 것이 인공지능의 핵심입니다.
                        </span>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default HomeHero