import style from './style.module.scss';
import { FaCode } from "react-icons/fa6";
import { IoSchool } from "react-icons/io5";
import { FaPerson } from "react-icons/fa6";
import { FaVirus } from "react-icons/fa6";

function HeroAbout() {
    return (
        <>
        <section className={style.container}>
            <span><IoSchool color='var(--color-green)' /> 선린인터넷고등학교에 재학중에 있으며<br/><FaCode color='var(--color-orange)' />개발하는 것을 좋아하고<br/><FaPerson color='var(--color-blue)' />사람들에게 도움되는 서비스를 개발하려고 노력합니다<br/>또한<br/><FaVirus  color='var(--color-purple)'/> 새로운 기술을 배우는 것을 좋아합니다</span>
        </section>
        </>
    );
}

export default HeroAbout;