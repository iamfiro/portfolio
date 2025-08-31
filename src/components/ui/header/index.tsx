import Link from 'next/link';

import s from './style.module.scss';

export default function Header() {
  return (
    <header className={s.header}>
      <img src="/logo.svg" alt="logo" />
      <ul className={s.list}>
        <li data-active={true}>
          <Link href="/">포트폴리오</Link>
        </li>
        <li data-active={false}>
          <Link href="/">블로그</Link>
        </li>
        <li data-active={false}>
          <Link href="/">프로젝트</Link>
        </li>
      </ul>
    </header>
  );
}
