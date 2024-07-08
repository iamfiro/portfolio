import { LandingHero } from "../components";
import style from '../styles/page.module.scss';
function Home() {
    return (
        <>
        <main className={style.main}>
            <LandingHero />
        </main>
        </>
    );
}

export default Home;