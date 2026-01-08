import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import s from "./style.module.scss";
import { LINK } from "@/shared/constants";

export default function Header() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname.includes(path);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const scrollDifference = currentScrollY - lastScrollY;

            if (currentScrollY <= 0) {
                setIsVisible(true);
            }
            
            else if (scrollDifference > 0 && currentScrollY > 200 && Math.abs(scrollDifference) > 10) {
                setIsVisible(false);
            }
            
            else if (scrollDifference < 0) {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollY]);

    return (
        <header className={`${s.container} ${isVisible ? s.visible : s.hidden}`}>
            <section className={s.header}>
                <img src="/logo_white.svg" alt="logo" />
                <ul className={s.link}>
                    <li className={location.pathname === "/" ? s.active : ""}>
                        <a href="/">포트폴리오</a>
                    </li>
                    <li className={isActive("/projects") ? s.active : ""}>
                        <a href="/projects">프로젝트</a>
                    </li>
                    <li className={isActive("/awards") ? s.active : ""}>
                        <a href="/awards">수상실적</a>
                    </li>
                    <li className={isActive("/blog") ? s.active : ""}>
                        {isActive("/blog") ? (
                            <span>블로그</span>
                        ) : (
                            <a href="/blog" target="_blank">블로그</a>
                        )}
                    </li>
                </ul>
            </section>
            <section className={`${s.header} ${s.social}`}>
                <a href={LINK.github}>
                    <img src="/icon/social/github-white.svg" alt="github" />
                </a>
                <a href={LINK.linkedin}>
                    <img src="/icon/social/linkedin-white.svg" alt="linkedin" />
                </a>
                <a href={LINK.instagram}>
                    <img src="/icon/social/instagram-white.svg" alt="instagram" />
                </a>
            </section>
        </header>
    )
}