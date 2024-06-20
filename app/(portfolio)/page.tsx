import { HeroTitle } from '@/components';
import style from '@/styles/portfolio.module.scss';
import { FiArrowDownCircle } from "react-icons/fi";

export default function Home() {
    return (
        <>
        <main className={style.container}>
            <section className={style.hero}>
                <div />
                <HeroTitle />
                <div className={style.scrollNotification}>
                    <div>아래로 스크롤 하세요!</div>
                    <FiArrowDownCircle size={30} />
                </div>
            </section>
        </main>
        </>
    )
}