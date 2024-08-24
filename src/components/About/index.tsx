import style from './style.module.scss';
import {useLayoutEffect} from "react";
import SplitType from "split-type";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { FaUserAlt, FaBookOpen } from "react-icons/fa";
import { FaPenNib } from "react-icons/fa6";

const About = () => {
	gsap.registerPlugin(ScrollTrigger);

	useLayoutEffect(() => {
		new SplitType('#about_content');

		gsap.fromTo('#about_content .char', {
			y: 100,
			opacity: 0
		}, {
			y: 0,
			opacity: .8,
			duration: .5,
			stagger: .02,
			ease: 'power1',
			scrollTrigger: {
				trigger: '#about_content',
				start: 'top 90%',
			}
		});

		const symbolTl = gsap.timeline({paused: false, repeat: -1});

		symbolTl.to('#iam_title_symbol', {duration: 1, opacity: .7});
		symbolTl.to('#iam_title_symbol', {duration: .5, opacity: .3});
		symbolTl.to('#iam_title_symbol', {duration: 1, opacity: .7});
	}, []);

	return (
		<div className={style.container}>
			<section>
				<div style={{overflowY: 'hidden'}} id={"about_title_container"}>
					<span id={"about_title"} className={style.aboutTitle}>About Me</span>
				</div>
				<p className={style.aboutContent} id={"about_content"}>
					안녕하세요, 프론트엔드 개발자 조성주입니다<br/>
					현재 선린인터넷고등학교에 재학 중이며<br/>
					개발에 대한 열정을 가지고 있습니다<br/>
					사람들에게 도움이 되는 서비스를 만들기 위해 꾸준히 노력하고 있으며<br/>
					새로운 기술을 배우는 것을 즐깁니다.
				</p>
			</section>
			<hr className={style.divider} />
			<section className={style.iamContainer}>
				<div>
					<span className={style.iamTitleSymbol} id={'iam_title_symbol'}>●</span>
					<span className={style.iamTitle}>제가 생각하는 개발자는...</span>
				</div>
				<div>
					<p className={style.iamContent}>
						<strong><FaUserAlt /> 사용자 친화적을 중요하게 생각합니다</strong>
						일상생활에서 불편하게 느끼는 부분을 해결하는 서비스를 만들려고 노력하고 있습니다
					</p>
					<p className={style.iamContent}>
						<strong><FaPenNib /> 뭐든지 기록하려고 노력하고 있어요</strong>
						내가 배웠던 기술을 열심히 기록하며<br/>
						과거의 나를 통해 한발짝 도약하는 사람이 되고 싶습니다
					</p>
					<p className={style.iamContent}>
						<strong><FaBookOpen /> 끊임없이 새로운 기술을 배우는 것을 중요하게 생각합니다</strong>
						빠르게 바뀌는 개발 시장에서 뒤쳐지지 않게 꾸준히 새로운 기술을 배우고 있습니다
					</p>
				</div>
			</section>
		</div>
	)
}

export default About;
