import { Header } from "@/components";

interface HomeLayoutProps {
    children: React.ReactNode;
}

function HomeLayout({ children }: HomeLayoutProps) {
    return (
        <>
        <Header />
        {children}
        </>
    );
}

export default HomeLayout;