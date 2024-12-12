import HomeHero from "@/components/@Home/Hero";
import HeroApp from "@/components/@Home/HeroApp/HeroApp";
import {Header} from "@/components/ui";

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