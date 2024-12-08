import {Header} from "@/components";
import HomeHero from "@/components/@Home/Hero";
import HeroApp from "@/components/@Home/HeroApp/HeroApp";

export default function Home() {
    return (
        <>
            <Header />
            <HomeHero />
            <HeroApp />
            <div style={{height: '200vh'}} />
        </>
    );
}