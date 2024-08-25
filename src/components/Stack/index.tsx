import style from './style.module.scss';
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const Stack = () => {
	const containerRef = useRef<HTMLDivElement>(null);

	gsap.registerPlugin(ScrollTrigger);

	useLayoutEffect(() => {
		if(!containerRef.current) return;

		const tl = gsap.timeline();

		tl.to(containerRef.current, {
			scrollTrigger: {
				trigger: containerRef.current,
				start: 'top bottom',
				end: 'top top',
				scrub: 1,
				onEnter: () => console.log('enter'),
				onLeave: () => console.log('leave'),
			},
			marginTop: `-${window.innerHeight}px`,
			ease: 'none',
		});
	}, []);

	return (
		<section className={style.container} style={{ position: 'relative', zIndex: 1 }}>
			<div className={`${style.container} stories_container`} ref={containerRef}>
				a
			</div>
			<div className={style.nextSection} style={{ zIndex: 0 }}>
				{/* 다음 섹션의 콘텐츠 */}
			</div>
		</section>
	);
};

export default Stack;
