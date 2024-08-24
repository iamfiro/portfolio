import {useEffect, useLayoutEffect, useRef, useState} from 'react';
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

interface ProjectProps {
	index: number;
	name: string;
	year: number;
	thumbnails: string;
	thumbnails2: string;
	href: string;
	hoveredIndex: number | null;
	setHoveredIndex: (index: number | null) => void;
}

// Define the 4tab type
type ProjectTab = 'all' | 'project' | 'design' | 'other';

const Project = ({index, name, year, href, hoveredIndex, setHoveredIndex, thumbnails, thumbnails2}: ProjectProps) => {
	const navigate = useNavigate();
	const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index;
	const isHovered = hoveredIndex === index;

	return (
		<article
			className={style.project}
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
	const [isFixed, setIsFixed] = useState(true);
	const scrollToRef = useRef<HTMLSpanElement>(null);
	const heroContainerRef = useRef<HTMLDivElement>(null);
	const titleContainerRef = useRef<HTMLDivElement>(null);
	const endOfHeroRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		const tl = gsap.timeline({paused: true});

		tl.to(scrollToRef.current, {duration: 0.8, yPercent: 100});
		tl.set(scrollToRef.current, {yPercent: -100});
		tl.to(scrollToRef.current, {duration: 0.8, yPercent: 0});

		const interval = setInterval(() => {
			tl.restart();
		}, 3000);

		return () => clearInterval(interval);
	}, []);

useEffect(() => {
    const handleScroll = () => {
        if (!titleContainerRef.current || !heroContainerRef.current) return;

        const heroRect = heroContainerRef.current.getBoundingClientRect();
        const titleRect = titleContainerRef.current.getBoundingClientRect();

		console.log(
			'titleRect.bottom:', titleRect.bottom,
			'heroRect.bottom:', heroRect.bottom - 31,
			'titleRect.top:', titleRect.top,
			'heroRect.top:', heroRect.top
		)


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

	const filteredProjects = ProjectList.filter((project) =>
		projectTab === 'all' ? true : project.type === projectTab
	);

	return (
		<div className={style.container} ref={heroContainerRef}>
			<section className={style.left}>
				<Row style={{justifyContent: 'space-between'}}>
					<span className={style.weather}>
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
						<img src={TitleCreativeLogo} alt={'CREATIVE DEVELOPER'} className={style.title}/>
						<img src={TitleDeveloperLogo} alt={'CREATIVE DEVELOPER'} className={style.title} style={{width: '95%'}}/>
						<h2 className={style.introduce}>
							<MdOutlineSchool/> Sunrin High School
						</h2>
					</Column>
					<button className={style.scrollTo}>
						<span className={style.scrollTo} ref={scrollToRef}>( <IoArrowDownOutline/> 아래로 스크롤하세요 )</span>
					</button>
				</div>
			</section>
			<section className={style.right} style={{alignItems: 'flex-end'}}>
				<Row className={style.recentProject}>
					<span>최근 프로젝트</span>
					<Row className={style.projectSelect}>
						<button data-selected={projectTab === 'all'} onClick={() => setProjectTab('all')}>
							전체
						</button>
						<button data-selected={projectTab === 'project'} onClick={() => setProjectTab('project')}>
							프로젝트
						</button>
						<button data-selected={projectTab === 'design'} onClick={() => setProjectTab('design')}>
							디자인
						</button>
						<button data-selected={projectTab === 'other'} onClick={() => setProjectTab('other')}>
							기타
						</button>
					</Row>
				</Row>
				<div className={style.projectList}>
					{filteredProjects.map((project, index) => (
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
						/>
					))}
				</div>
				<img src={GitHeader} alt={'GitHeader'} className={style.gitHeader}/>
			</section>
			<div ref={endOfHeroRef} style={{ height: '1px'}} />
		</div>
	);
};

export default Hero;
