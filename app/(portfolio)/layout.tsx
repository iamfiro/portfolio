import { Header, HeroNotification } from "@/components";

interface HomeLayoutProps {
    children: React.ReactNode;
}

function HomeLayout({ children }: HomeLayoutProps) {
    return (
        <>
        <Header />
        <HeroNotification />
        {children}
        </>
    );
}

export default HomeLayout;