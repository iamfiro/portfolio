import style from './style.module.scss';
import {useLayoutEffect, useRef, useState} from "react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import { MdComputer } from "react-icons/md";
import { FiServer } from "react-icons/fi";
import { FaBullseye } from "react-icons/fa";
import {Stack as StackType, StackList} from "../../constant/stack.ts";
import {Column} from "../index.ts";

const Stack = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const wrapRef = useRef<HTMLDivElement>(null);
	const progressBarRef = useRef<HTMLDivElement>(null); // Reference for progress bar
	const [tabIndex, setTabIndex] = useState<'frontend' | 'backend' | 'etc' | 'none'>('none');
	const [filteredStack, setFilteredStack] = useState<StackType[]>([]);
	const [sectionData, setSectionData] = useState<{isFixed: boolean, lastLeave: 'top' | 'bottom'}>({
		isFixed: false,
		lastLeave: 'top'
	});

	const titleRefs = useRef<Array<HTMLHeadingElement | null>>([]);

	gsap.registerPlugin(ScrollTrigger);

	useLayoutEffect(() => {
		gsap.to(wrapRef.current, {
			scrollTrigger: {
				trigger: containerRef.current,
				start: 'top top',
				end: 'bottom bottom',
				onLeave: () => {
					setSectionData({
						isFixed: false,
						lastLeave: 'bottom'
					});
				},
				onLeaveBack: () => {
					setSectionData({
						isFixed: false,
						lastLeave: 'top'
					});
				},
				onEnter: () => {
					setSectionData({
						isFixed: true,
						lastLeave: 'top'
					});
				},
				onEnterBack: () => {
					setSectionData({
						isFixed: true,
						lastLeave: 'bottom'
					});
				},
				onUpdate: (self) => {
					// Update progress bar width
					if (progressBarRef.current) {
						const progress = self.progress * 100;
						progressBarRef.current.style.width = `${progress}%`;
					}
				},
			},
		});

		gsap.set('.stack_list_title', {
			y: 70,
			opacity: 0,
		});
		gsap.to('.stack_list_title', {
			scrollTrigger: {
				trigger: containerRef.current,
				start: 'top top'
			},
			y: 0,
			opacity: .3,
			duration: .8,
			stagger: .2,
		});
	}, []);

	useLayoutEffect(() => {
		const titles = titleRefs.current;
		const fixedHeight = 1200; // Fixed height for start and end triggers
		const tabs: Array<'frontend' | 'backend' | 'etc'> = ['frontend', 'backend', 'etc']; // Explicitly typed array

		titles.forEach((titleRef, index) => {
			if (titleRef) {
				gsap.to(titleRef, {
					scrollTrigger: {
						trigger: containerRef.current,
						start: index === 0 ? 'top+=600px top' : `top+=${fixedHeight * (index + 1)}px top`, // Adjust start value for the first titleRef
						end: `+=${fixedHeight * (index + 1)}px`, // End after an additional 600px
						onEnter: () => {
							setTabIndex(tabs[index]);
						},
						onLeave: () => {
							setTabIndex(tabs[index + 1] || 'none');
						},
						onEnterBack: () => {
							setTabIndex(tabs[index]);
						},
						onLeaveBack: () => {
							setTabIndex(tabs[index - 1] || 'none');
						},
					},
				});
			}
		});
	}, []); // No dependency on dynamic section heights, just the fixed value

	useLayoutEffect(() => {
		console.log('filteredStack', filteredStack);
		const target = gsap.utils.toArray(document.getElementsByClassName('stack_item'));

		target.forEach((el, index) => {
			gsap.set(el as HTMLDivElement, {
				opacity: 0,
				y: 40,
			});
			gsap.to(el as HTMLDivElement, {
				opacity: 1,
				y: 0,
				duration: .7,
				delay: .05 * index,
			});
		});
	}, [filteredStack]);

	useLayoutEffect(() => {
		const stackList = StackList.filter((stack) => stack.type === tabIndex);

		setFilteredStack(stackList);
	}, [tabIndex]);

	return (
		<div className={style.container} ref={containerRef} style={{ justifyContent: sectionData.lastLeave === 'top' ? 'flex-start' : 'flex-end' }}>
			<section className={style.wrap} ref={wrapRef} style={{
				position: sectionData.isFixed ? 'fixed' : 'relative',
				marginLeft: sectionData.isFixed ? 0 : 30,
				marginTop: sectionData.isFixed ? 0 : 80,
				width: sectionData.isFixed ? 'calc(100% - 60px)' : '100%',
				top: sectionData.isFixed ? 80 : 0,
				left: sectionData.isFixed ? 30 : 0,
			}}>
				<div className={style.sectionList}>
					<Column style={{gap: '60px'}}>
						<h2
							className={`${style.sectionTitle} stack_list_title`}
							ref={(el) => titleRefs.current[0] = el}
							style={{
								opacity: tabIndex === 'frontend' ? .7 : .3,
							}}
						><MdComputer/> 프론트엔드</h2>
						<h2
							className={`${style.sectionTitle} stack_list_title`}
							ref={(el) => titleRefs.current[1] = el}
							data-selected={tabIndex === 'backend'}
							style={{
								opacity: tabIndex === 'backend' ? .7 : .3,
							}}
						><FiServer/> 백엔드</h2>
						<h2
							className={`${style.sectionTitle} stack_list_title`}
							ref={(el) => titleRefs.current[2] = el}
							data-selected={tabIndex === 'etc'}
							style={{
								opacity: tabIndex === 'etc' ? .7 : .3,
							}}
						><FaBullseye/> 기타</h2>
					</Column>
					<div className={style.progressBarContainer}>
						<div className={style.progressBar} ref={progressBarRef}></div>
					</div>
				</div>
				<div className={style.stackContainer}>
					{
						filteredStack.map((stack, index) => (
							<div key={index} className={`${style.stack} stack_item`}>
								<img src={stack.icon} alt={stack.name}/>
								<span>{stack.name}</span>
							</div>
						))
					}
				</div>
			</section>
		</div>
	);
};

export default Stack;
