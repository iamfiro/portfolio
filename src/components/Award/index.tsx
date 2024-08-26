import style from './style.module.scss';
import {useLayoutEffect, useRef, useState} from "react";
import AwardImage from '../../assets/image/svg/Awards.svg';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import {Column} from "../index.ts";
import AwardList from "../../constant/award.ts";

const Award = () => {
	// const [activeMenu, setActiveMenu] = useState<number | null>(null);
	const titleRef = useRef<HTMLImageElement>(null);

	useLayoutEffect(() => {
		gsap.registerPlugin(ScrollTrigger);

		gsap.to(titleRef.current, {
			scrollTrigger: {
				trigger: titleRef.current,
				start: 'bottom bottom',
				end: 'center center',
				scrub: 1,
				onEnter: () => {
					console.log('Enter');
				}
			},
			width: '10%'
		});
	}, []);

	return (
		<section className={style.container}>
			<img src={AwardImage} alt="Award" className={style.title} ref={titleRef}/>
			<Column className={style.awardList}>
				{
					AwardList.map((award, index) => (
						<article className={style.award} key={index}>
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
