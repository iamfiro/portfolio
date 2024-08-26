import style from './style.module.scss';
import {useLayoutEffect, useRef} from "react";
import AwardImage from '../../assets/image/svg/Awards.svg';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import {Column} from "../index.ts";
import AwardList from "../../constant/award.ts";

const Award = () => {
	const titleRef = useRef<HTMLImageElement>(null);

	useLayoutEffect(() => {
		gsap.registerPlugin(ScrollTrigger);

		gsap.to(titleRef.current, {
			scrollTrigger: {
				trigger: titleRef.current,
				start: 'bottom bottom+=100px',
				end: 'center center',
				scrub: 1,
			},
			ease: 'power1.inOut',
			width: '10%'
		});

		gsap.fromTo('.award_list', {
			opacity: 0,
			y: 100
		}, {
			opacity: 1,
			y: 0,
			duration: .8,
			stagger: .2,
			scrollTrigger: {
				trigger: titleRef.current,
				start: 'top center',
				end: 'center center',
			}
		});
	}, []);

	return (
		<section className={style.container}>
			<img src={AwardImage} alt="Award" className={style.title} ref={titleRef}/>
			<Column className={style.awardList}>
				{
					AwardList.map((award, index) => (
						<article className={`${style.award} award_list`} key={index}>
							<span className={style.awardYear}>( {award.year} )</span>
							<span>{award.title}</span>
						</article>
					))
				}
			</Column>
		</section>
	)
}

export default Award;
