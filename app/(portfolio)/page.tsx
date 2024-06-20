import { HeroTitle } from '@/components';
import style from '@/styles/portfolio.module.scss';

export default function Home() {
    return (
        <>
        <main className={style.container}>
            <section className={style.hero}>
                <div />
                <HeroTitle />
                <div />
            </section>
        </main>
        </>
    )
}