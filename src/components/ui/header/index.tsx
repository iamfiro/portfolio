import Link from "next/link";

import s from "./style.module.scss";

export default function Header() {
  return (
    <header className={s.header}>
      <img src="/logo_white.svg" alt="logo" />
      <ul className={s.list}>
        <li>
          <Link href="/">홈</Link>
        </li>
        <li>
          <Link href="/">블로그</Link>
        </li>
        <li>
          <Link href="/">프로젝트</Link>
        </li>
        <li></li>
      </ul>
    </header>
  );
}
