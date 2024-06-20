import { HeroStack, HeroTitle } from '@/components';
import HeroAbout from '@/components/HeroAbout';
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
            <HeroAbout />
            <HeroStack />
        </main>
        </>
    )
}