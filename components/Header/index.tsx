import Image from "next/image";
import Logo from '@/public/logo.png';
import style from './style.module.scss';
import Link from "next/link";
// 소셜 아이콘
import { SocialLink } from "@/content/social";
import { FaGithub } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

export default function Header() {
    return (
        <header className={style.container} role="heading">
            <div className={style.left}>
                <Image src={Logo} width={25} alt="page logo" />
                <h1 className={style.name}>개발자 FIRO</h1>
                <ul className={style.menu}>
                    <li>
                        <Link href="#project">프로젝트 리스트</Link>
                    </li>
                </ul>
            </div>
            <div className={style.right}>
                <Link href={SocialLink.github} className={style.social} target="_blank">
                    <FaGithub size={18} />
                </Link>
                <Link href={SocialLink.instagram} className={style.social} target="_blank">
                    <FaInstagram size={18} />
                </Link>
            </div>
        </header>
    )
}