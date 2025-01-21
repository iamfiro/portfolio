import s from './style.module.scss'

const Hero = () => {
    return (
        <section>
            <h1 className={s.title}>
                안녕하세요, 프론트엔드 개발자 조성주입니다. <br/>
                저는 현재 선린인터넷고등학교에 재학 중이며, <br/>
                개발에 대한 열정으로 끊임없이 성장하고 있습니다. <br/>
                사람들에게 도움이 되는 서비스를 만드는 것을 목표로 <br/>
                꾸준히 노력하고 있으며, 새로운 기술을 배우고 <br/>
                도전하는 것을 즐깁니다.
            </h1>
            <h2 className={s.description}>
                부가 설명입니다.
            </h2>
        </section>
    )
}

export default Hero;