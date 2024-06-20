import style from './style.module.scss';
import { FaGithub } from 'react-icons/fa';

function AvailableWork() {
    return (
        <div className={style.availableWork}>
            <div className={style.circle} />
            <span>Available for Work</span>
        </div>
    )
}

function HeroTitle() {
    return (
        <>
        <section className={style.container}>
            <AvailableWork />
            <h1 className={style.title}>꾸준히 성장하는 개발자<br/>조성주입니다</h1>
            <span className={style.description}>새로운 기술을 배우는 데 거부감이 없으며<br/>사람들이 좋아할, 필요할 만한 서비스를 만드려고 합니다</span>
            <span className={style.emoji}>❤️ 🍚 🧸 🖥️ 🚗</span>
        </section>
        </>
    );
}

export default HeroTitle;