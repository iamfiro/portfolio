import Header from '@/components/Header';
import style from '../styles/page.module.scss';
import { Project } from '@/components';
import photoshop from '@/public/image/photoshop.svg';
import projectSunrin from '@/public/project/sunrin-today.png';
import projectNewjeans from '@/public/project/newjeans.png'

export default function Home() {
    return (
        <>
		<main className={style.container}>
			<Header>
				<Header.NavItem href="/home" selected>홈</Header.NavItem>
				<Header.NavItem href="/about">프로젝트</Header.NavItem>
			</Header>
			<p className={style.about}>
				상상을 현실로 만드는 개발자 조성주입니다<br/><br/>
				새로운 기술을 배우는 데 거부감이 없으며<br/>
				사람들이 좋아할, 필요할 만한 서비스를 만들고 있습니다<br/><br/>
			</p>
			<section className={style.grid}>
				<Project name='선린인고 급식 알림' href='https://instagram.com/sunrin_today' image={projectSunrin} />
				<Project
					name='뉴진스 포스터 디자인'
					href=''
					image={projectNewjeans}
					styles={{ gridColumn: '4/5', gridRow: '1/2', backgroundColor: '#2B4991' }}
					titleColor='white'
				/>
			</section>
		</main>
        </>
    );
}