import style from './style.module.scss';
import {useLayoutEffect} from "react";
import SplitType from "split-type";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const About = () => {
	gsap.registerPlugin(ScrollTrigger);

	useLayoutEffect(() => {
		new SplitType('#about_content', {
			// types: 'lines',
			// lineClass: 'char',
		});

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
					<span className={style.iamTitle}>제가 생각하는 저는...</span>
				</div>
				<div>
					<p className={style.iamContent}>
						프론트엔드 개발자로서 사용자 중심의 서비스를 만들기 위해 노력하고 있습니다<br/>
						새로운 기술에 대한 지식을 쌓는 것을 즐기며<br/>
						최신 기술을 통해 사용자에게 즐거움을 주는 서비스를 만들고 싶습니다
					</p>
				</div>
			</section>
		</div>
	)
}

export default About;
