import style from './Header.module.scss';
import Link from "next/link";
import { HiOutlineMail } from "react-icons/hi";
const Header = () => {

    return (
        <header className={style.header}>
            <div className={style.maxWidth}>
                <Link href={'/'} className={style.logoCTA}>
                    <h1 className={style.title}>@devfiro</h1>
                </Link>
                <ul className={style.nav}>
                    <li>
                        <Link href={'/blog'}>블로그</Link>
                    </li>
                    <li>
                        <Link href={'/project'}>프로젝트</Link>
                    </li>
                    <li>
                        <Link href={'/activity'}>활동</Link>
                    </li>
                    <li>
                        <Link href={'/contact'}>문의하기</Link>
                    </li>
                </ul>
                <Link href={'mailto:hello@de vfiro.com'} className={style.email}>
                    <HiOutlineMail size={20}/>
                    <span>hello@devfiro.com</span>
                </Link>
            </div>
        </header>
    )
}

export default Header;