import {Ref, useEffect, useRef} from "react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useHeroAppContainerAnimation = (): Ref<HTMLDivElement> => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const scrollTrigger = {
			trigger: container,
			start: "top bottom",
			end: "bottom bottom+=150px",
			scrub: true,
		};

		// 메인 애니메이션
		gsap.fromTo(
			container,
			{
				borderRadius: 50,
				width: '90%',
				y: 0,
				position: 'relative'
			},
			{
				borderRadius: 0,
				width: '100%',
				y: '-50vh', // viewport height의 50%만큼 위로 이동
				ease: 'none',
				scrollTrigger: scrollTrigger,
			}
		);

		return () => {
			ScrollTrigger.getAll().forEach(t => t.kill());
		};
	}, []);

	return containerRef;
}