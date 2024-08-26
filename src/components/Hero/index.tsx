import {useLayoutEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Column, Row} from '../index.ts';
import style from './style.module.scss';
import {TiWeatherCloudy} from 'react-icons/ti';
import {IoArrowDownOutline} from 'react-icons/io5';
import {MdOutlineSchool} from 'react-icons/md';
import gsap from 'gsap';
import FadingImage from '../FadingImage';
import Noise from '../../assets/image/displacement/noise.png';
import {Canvas} from '@react-three/fiber';
import ProjectList from '../../constant/project.ts';
import TitleCreativeLogo from '../../assets/hero_title_creative.svg';
import TitleDeveloperLogo from '../../assets/hero_title_developer.svg';
import GitHeader from '../../assets/image/svg/git-header.svg';
import {createPortal} from "react-dom";
import DEVFIRO_Logo from '../../assets/DEVFIRO.svg';
import { Project as ProjectType } from "../../constant/project.ts";

interface ProjectProps {
	index: number;
	name: string;
	year: number;
	thumbnails: string;
	thumbnails2: string;
	href: string;
	hoveredIndex: number | null;
	setHoveredIndex: (index: number | null) => void;
	className?: string;
}

// Define the 4tab type
type ProjectTab = 'all' | 'project' | 'design' | 'other';

const Project = ({index, name, year, href, hoveredIndex, setHoveredIndex, thumbnails, thumbnails2, className}: ProjectProps) => {
	const navigate = useNavigate();
	const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index;
	const isHovered = hoveredIndex === index;

	return (
		<article
			className={`${style.project} ${className}`}
			onClick={() => navigate(href)}
			onMouseEnter={() => setHoveredIndex(index)}
			onMouseLeave={() => setHoveredIndex(null)}
			style={{opacity: isOtherHovered ? 0.35 : 1}}
		>
			<Column style={{gap: '11px'}}>
				<Row style={{gap: '30px'}}>
					<span className={style.projectIndex}>0{index}</span>
					<span className={style.projectName}>{name}</span>
				</Row>
				<span className={style.projectYear}>( {year} )</span>
			</Column>
			<Canvas style={{width: '270px', height: '170px'}} camera={{position: [0, 0, 2], fov: 45}}>
				<FadingImage isHovered={isHovered} image={thumbnails} image2={thumbnails2} displacement={Noise}/>
			</Canvas>
		</article>
	);
};

const Hero = () => {
	const [projectTab, setProjectTab] = useState<ProjectTab>('all');
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const [isFirstLoad, setIsFirstLoad] = useState(true);
	const [isFixed, setIsFixed] = useState(true);
	const scrollToRef = useRef<HTMLSpanElement>(null);
	const heroContainerRef = useRef<HTMLDivElement>(null);
	const titleContainerRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		const tl = gsap.timeline({paused: true});

		tl.to(scrollToRef.current, {duration: 0.8, yPercent: 100});
		tl.set(scrollToRef.current, {yPercent: -100});
		tl.to(scrollToRef.current, {duration: 0.8, yPercent: 0});

		const interval = setInterval(() => {
			tl.restart();
		}, 2500);

		return () => clearInterval(interval);
	}, []);

	// 스크롤 fixed 애니메이션
	useLayoutEffect(() => {
		const handleScroll = () => {
			if (!titleContainerRef.current || !heroContainerRef.current) return;

			const heroRect = heroContainerRef.current.getBoundingClientRect();
			const titleRect = titleContainerRef.current.getBoundingClientRect();

			if (titleRect.bottom > heroRect.bottom - 31) {
				setIsFixed(false);
			}
			else if (titleRect.top < heroRect.top + 60) {
				setIsFixed(true);
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	// 타이틀 애니메이션
	useLayoutEffect(() => {
		gsap.fromTo('#hero_title_creative', {y: 100}, {y: 0, duration: 2, delay: 3.7, ease: 'circ.out'});
		gsap.fromTo('#hero_title_developer', {y: 100}, {y: 0, duration: 2, delay: 3.7, ease: 'power3'});
		gsap.fromTo('#hero_title_school', {y: 50, opacity: 0}, {y: 0, opacity: 2, duration: 1.2, delay: 3.7});
		gsap.fromTo('#hero_title_scroll', {x: -50, opacity: 0}, {x: 0, opacity: 1, duration: 1, delay: 4.4, ease: 'power1'});
	}, []);

	useLayoutEffect(() => {
		const target = gsap.utils.toArray(document.getElementsByClassName('hero_title_project'));

		target.forEach((element, index) => {
			gsap.fromTo(element as HTMLButtonElement, {y: 50, opacity: 0}, {y: 0, opacity: 1, duration: 1, delay: 3.7 + index * 0.15, ease: 'power3'});
			gsap.to(element as HTMLDivElement, {y: 180, opacity: 0.0, duration: 0});
		});
	}, []);

	// 프로젝트 애니메이션
	useLayoutEffect(() => {
		if(isFirstLoad) {
			setIsFirstLoad(false);

			const target = gsap.utils.toArray(document.getElementsByClassName('hero_title_project'));

			target.forEach((element, index) => {
				gsap.to(element as HTMLDivElement, {y: 180, opacity: 0.0, duration: 0});
				gsap.fromTo(element as HTMLDivElement, {y: 180, opacity: 0.2}, {y: 0, opacity: 1, duration: 1, delay: 3.7 + index * 0.15, ease: 'power3'});
			});
		} else {
			const target = gsap.utils.toArray(document.getElementsByClassName('hero_title_project'));

			target.forEach((element, index) => {
				gsap.fromTo(element as HTMLDivElement, {y: 180, opacity: 0.2}, {y: 0, opacity: 1, duration: 1, delay: .5 + index * 0.15, ease: 'power3'});
			});
		}
	}, [projectTab]);

	const filteredProjects: ProjectType[] = ProjectList.filter((project) =>
		projectTab === 'all' ? true : project.type === projectTab
	);

	const [loadingProgress, setLoadingProgress] = useState(0);
	const loadingContainerRef = useRef<HTMLDivElement>(null);
	const loadingContentRef = useRef<HTMLDivElement>(null);

	// 로딩 카운터 애니메이션
	useLayoutEffect(() => {
		let loadingProgress = 0;
		function StartLoading() {
			if (loadingProgress < 100) {
				const increment = Math.floor(Math.random() * 10) + 1;
				loadingProgress = Math.min(loadingProgress + increment, 100);
				setLoadingProgress(loadingProgress);

				const delay = Math.floor(Math.random() * 3000) + 2200;
				setTimeout(StartLoading, delay);
			}
		}

		const interval = setInterval(StartLoading, 100);

		return () => clearInterval(interval);
	}, []);

	// 로딩 후 애니메이션
	useLayoutEffect(() => {
		gsap.to(loadingContainerRef.current, {
			scale: 0.3,
			ease: 'power4.inOut',
			duration: 2,
			delay: 2,
		})

		gsap.to(loadingContentRef.current, {
			scale: 1.8,
			ease: 'power4.inOut',
			duration: 2,
			delay: 2,
		});

		gsap.fromTo(loadingContainerRef.current, {
			clipPath: 'polygon(0 0, 100% 0%, 100% 100%, 0 100%)',
			ease: 'power4.inOut'
		}, {
			clipPath: 'polygon(0 0, 100% 0%, 100% 0%, 0 0%)',
			ease: 'power4.inOut',
			duration: 2,
			delay: 2.75,
		})
	}, []);

	useLayoutEffect(() => {
		const target = gsap.utils.toArray(document.getElementsByClassName('hero_project_select'));

		gsap.fromTo('.hero_project_title', {
			clipPath: 'polygon(0 0, 0% 0, 0% 100%, 0 100%)'
		}, {clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 1, delay: 3.7, ease: 'power1'});

		gsap.fromTo('.hero_weather', {
			clipPath: 'polygon(0 0, 0% 0, 0% 100%, 0 100%)'
		}, {clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 1.5, delay: 3.7, ease: 'power1'});

		target.forEach((element, index) => {
			gsap.fromTo(element as HTMLButtonElement, {y: 50, opacity: 0}, {y: 0, opacity: 1, duration: 1, delay: 3.7 + index * 0.05, ease: 'power3'});
		});
	}, []);

	return (
		<>
			<div className={style.container} ref={heroContainerRef}>
				<section className={style.left}>
					<Row style={{justifyContent: 'space-between'}}>
					<span className={`${style.weather} hero_weather`}>
						{/* TODO: 날씨 구현 */}
						<TiWeatherCloudy size={20}/> 32 °C, Cloudy
					</span>
						<Column>
							<div/>
						</Column>
					</Row>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '30px',
							position: isFixed ? 'fixed' : 'unset',
							width: isFixed ? 'calc(50% - 60px)' : '100%',
						}}
						className={style.stickyContainer}
						ref={titleContainerRef}
					>
						<Column style={{gap: '10px'}}>
							<div style={{overflowY: 'hidden'}}>
								<img
									src={TitleCreativeLogo}
									alt={'CREATIVE DEVELOPER'}
									className={style.title}
									id={'hero_title_creative'}
								/>
							</div>
							<div style={{overflowY: 'hidden'}}>
								<img
									src={TitleDeveloperLogo}
									alt={'CREATIVE DEVELOPER'}
									className={style.title}
									style={{width: '95%'}}
									id={'hero_title_developer'}
								/>
							</div>
							<h2 className={style.introduce}>
							<span id={"hero_title_school"}>
								<MdOutlineSchool/> Sunrin High School
							</span>
							</h2>
						</Column>
						<button className={style.scrollTo}>
							<span className={style.scrollTo} ref={scrollToRef} id={"hero_title_scroll"}>( <IoArrowDownOutline/> 아래로 스크롤하세요 )</span>
						</button>
					</div>
				</section>
				<section className={style.right} style={{alignItems: 'flex-end'}}>
					<Row className={style.recentProject}>
						<span className={'hero_project_title'}>최근 프로젝트</span>
						<Row className={style.projectSelect}>
							<button data-selected={projectTab === 'all'} onClick={() => setProjectTab('all')}
									className={'hero_project_select'}>
								전체
							</button>
							<button data-selected={projectTab === 'project'} onClick={() => setProjectTab('project')}
									className={'hero_project_select'}>
								프로젝트
							</button>
							<button data-selected={projectTab === 'design'} onClick={() => setProjectTab('design')}
									className={'hero_project_select'}>
								디자인
							</button>
							<button data-selected={projectTab === 'other'} onClick={() => setProjectTab('other')}
									className={'hero_project_select'}>
								기타
							</button>
						</Row>
					</Row>
					<div className={style.projectList}>
						{filteredProjects.map((project, index) => (
							<div style={{overflowY: 'hidden'}}>
								<Project
									key={index}
									index={index + 1}
									name={project.name}
									year={project.year}
									thumbnails={project.thumbnails}
									thumbnails2={project.thumbnails2}
									href={project.href}
									hoveredIndex={hoveredIndex}
									setHoveredIndex={setHoveredIndex}
									className={'hero_title_project'}
								/>
							</div>
						))}
					</div>
					<img src={GitHeader} alt={'GitHeader'} className={style.gitHeader}/>
				</section>
			</div>
			{
				createPortal(
					<>
						<div className={style.loadingContainer} ref={loadingContainerRef}>
							<div ref={loadingContentRef}>
								<span className={style.loadingProgress}>{loadingProgress}</span>
								<img src={DEVFIRO_Logo} alt={'DEVFIRO_Logo'} className={style.loadingLogo}/>
							</div>
						</div>
					</>, document.body
				)
			}
		</>
	);
};

export default Hero;
