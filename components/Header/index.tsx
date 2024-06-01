import style from './style.module.scss';

interface HeaderProps {
    children: React.ReactNode;
}

interface NavItemProps extends HeaderProps {
    href: string;
    selected?: boolean;
}

function NavItem({ children, href, selected }: NavItemProps) {
    return (
        <a href={href} className={style.navItem} data-active={selected}>
            {children}
        </a>
    );
}

function Header({ children }: HeaderProps) {
    return (
        <header className={style.header}>
            <nav className={style.nav}>
                {children}
            </nav>
            <ul className={style.list}>
                <li>
                    <a href='https://devfiro.com/iamfiro' target='_blank'>GitHub</a>
                </li>
            </ul>
        </header>
    );
}

Header.NavItem = NavItem;

export default Header;