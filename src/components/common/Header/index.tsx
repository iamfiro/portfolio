import { ReactNode } from 'react';
import style from './style.module.scss';

interface HeaderProps {
    children: ReactNode;
}

function Header({ children }: HeaderProps) {
    return (
        <header className={style.header}>
            {children}
        </header>
    );
}

Header.NavList = ({ children }: HeaderProps) => <ul className={style.navContainer}>{children}</ul>;
Header.NavItem = ({ children }: HeaderProps) => <li className={style.navItem}>{children}</li>;
export default Header;