import { Button, JobStatus } from '../../common';
import style from './style.module.scss';
import { FaGithub } from "react-icons/fa";

function LandingHero() {
    return (
        <>
        <section className={style.hero}>
            <JobStatus />
            <h1 className={style.title}>상상을 현실로 만드는<br />프론트엔드 개발자</h1>
            <h2 className={style.subtitle}>
                안녕하세요 프론트엔드 개발자 조성주 입니다
                <br />
                새로운 기술을 배우는 데 거부감이 없으며 사람들이 좋아할, 필요할 만한 서비스를 만드려고 합니다
            </h2>
            <div className={style.buttonContainer}>
                <Button><FaGithub size={18} /> <span style={{ marginBottom: '-2px' }}>GitHub 바로가기</span></Button>
            </div>
        </section>
        </>
    );
}

export default LandingHero;