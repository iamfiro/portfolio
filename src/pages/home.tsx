import { LandingHero } from "../components";
import Header from "../components/common/Header";
import style from '../styles/page.module.scss';
function Home() {
    return (
        <>
        <main className={style.main}>
            <Header>
                <Header.NavList>
                    <Header.NavItem>Project</Header.NavItem>
                    <Header.NavItem>Skills</Header.NavItem>
                    <Header.NavItem>Contact</Header.NavItem>
                </Header.NavList>
            </Header>
            <LandingHero />
        </main>
        </>
    );
}

export default Home;