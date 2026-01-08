import { useLocation } from "react-router-dom";
import s from "./style.module.scss";
import { LINK } from "@/shared/constants";

export default function Header() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname.includes(path);
    
    return (
        <header className={s.container}>
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