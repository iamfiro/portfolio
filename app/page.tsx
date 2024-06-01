import Header from '@/components/Header';
import style from '../styles/page.module.scss';

export default function Home() {
    return (
        <>
		<main className={style.container}>
			<Header>
				<Header.NavItem href="/home" selected>홈</Header.NavItem>
				<Header.NavItem href="/about">프로젝트</Header.NavItem>
			</Header>
		</main>
        </>
    );
}