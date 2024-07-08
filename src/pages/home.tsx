import { LandingHero } from "../components";
import Header from "../components/common/Header";
import style from '../styles/page.module.scss';
function Home() {
    return (
        <>
        <main className={style.main}>
            <Header>
                <Header.NavList>
                    <Header.NavItem>프로젝트</Header.NavItem>
                    <Header.NavItem>사용기술</Header.NavItem>
                    <Header.NavItem>Contact</Header.NavItem>
                </Header.NavList>
            </Header>
            <LandingHero />
        </main>
        </>
    );
}

export default Home;