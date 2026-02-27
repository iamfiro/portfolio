import { useLocation } from "react-router-dom";
import s from "./Header.module.scss";
import {Button} from "../Button";
import { Flex } from "../Flex";

export default function Header() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname.includes(path);

    return (
        <header className={s.container}>
            <img src="/logo.svg" alt="logo" className={s.logo} />
            <ul className={s.link}>
                <li className={location.pathname === "/" ? s.active : ""}>
                    <a href="/">Home</a>
                </li>
                <li className={isActive("/projects") ? s.active : ""}>
                    <a href="/projects">Project</a>
                </li>
                <li className={isActive("/awards") ? s.active : ""}>
                    <a href="/awards">Award</a>
                </li>
                <li className={isActive("/blog") ? s.active : ""}>
                    {isActive("/blog") ? (
                        <span>Blog</span>
                    ) : (
                        <a href="/blog" target="_blank">Blog</a>
                    )}
                </li>
            </ul>
            <Flex gap={10}>
                <Button variant={'secondary'} size={'sm'}>
                    Go to Dashboard
                </Button>
                <Button variant={'primary'} size={'sm'}>
                    Contact me
                </Button>
            </Flex>
        </header>
    )
}