import style from './style.module.scss';
import {TiWeatherCloudy} from "react-icons/ti";
import {Column, Row} from "../index.ts";
import {IoArrowDownOutline} from "react-icons/io5";
import {useLayoutEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import TitleCreativeLogo from "../../assets/hero_title_creative.svg";
import TitleDeveloperLogo from "../../assets/hero_title_developer.svg";
import { MdOutlineSchool } from "react-icons/md";
import gsap from 'gsap';
import FadingImage from "../FadingImage";
import Texture1 from "../../assets/image/newjeans_black.png";
import Texture2 from "../../assets/image/newjeans.webp";
import Noise from "../../assets/image/displacement/noise.png";
import {Canvas} from "@react-three/fiber";

interface ProjectProps {
	index: number;
	name: string;
	year: number;
	thumbnails: string;
	href: string;
	hoveredIndex: number | null;
	setHoveredIndex: (index: number | null) => void;
}

const Project = ({index, name, year, thumbnails, href, hoveredIndex, setHoveredIndex}: ProjectProps) => {
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
				<Row style={{gap: '50px'}}>
					<span className={style.projectIndex}>0{index}</span>
					<span className={style.projectName}>{name}</span>
				</Row>
				<span className={style.projectYear}>( {year} )</span>
			</Column>
			<Canvas style={{ width: '270px', height: '170px' }} camera={{ position: [0, 0, 2], fov: 50 }}>
				<FadingImage isHovered={isHovered} image={Texture1} image2={Texture2} displacement={Noise} />
			</Canvas>
		</article>
	);
};

const Hero = () => {
	const [projectTab, setProjectTab] = useState<'all' | 'project' | 'design' | 'other'>('all');
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const scrollToRef = useRef<HTMLSpanElement>(null);
	const titleTopRef = useRef<HTMLImageElement>(null);
	const titleBottomRef = useRef<HTMLImageElement>(null)

	useLayoutEffect(() => {
		// GSAP 타임라인 선언
		const tl = gsap.timeline({ paused: true });

		// 텍스트가 올라가면서 사라진 후 아래에서 다시 나타나는 애니메이션
		tl.to(scrollToRef.current, { duration: 0.8, yPercent: 100 });
		tl.set(scrollToRef.current, { yPercent: -100 });
		tl.to(scrollToRef.current, { duration: 0.8, yPercent: 0 });

		// 3초마다 애니메이션 재시작
		setInterval(() => {
			tl.restart();
		}, 3000);
	}, []);

	const projects = [
		{
			index: 1,
			name: '선린투데이',
			year: 2024,
			thumbnails: 'https://i.namu.wiki/i/w11dbZZeomJI4bD3_KItw3vq7tgglcM1YQA_xHULxMsixPpY1S7KcB8WrEFhJNuSuejiiQkicGKMH12JvpUqBQ.webp',
			type: 'project'
		},
		{index: 2, name: '디자인 프로젝트', year: 2023, thumbnails: 'https://example.com/design-project.jpg', type: 'design'},
		{index: 3, name: '기타 작업', year: 2022, thumbnails: 'https://example.com/other-work.jpg', type: 'other'},
		// 추가 프로젝트 데이터
	];

	const filteredProjects = projects.filter((project) =>
		projectTab === 'all' ? true : project.type === projectTab
	);

	return (
		<div className={style.container}>
			<section className={style.left}>
				<Row style={{ justifyContent: 'space-between' }}>
					<span className={style.weather}>
						<TiWeatherCloudy size={20}/> 32 °C, Cloudy
					</span>
					<Column>
						<div />
					</Column>
				</Row>
				<Column style={{gap: '30px'}}>
					<Column style={{gap: '10px'}}>
						<img src={TitleCreativeLogo} alt={'CREATIVE DEVELOPER'} className={style.title} ref={titleTopRef} />
						<img src={TitleDeveloperLogo} alt={'CREATIVE DEVELOPER'} className={style.title} style={{ width: '95%' }} ref={titleBottomRef} />
						<h2 className={style.introduce}><MdOutlineSchool /> Sunrin High School</h2>
					</Column>
					<button className={style.scrollTo}>
						<span className={style.scrollTo} ref={scrollToRef}>( <IoArrowDownOutline/> 아래로 스크롤하세요 )</span>
					</button>
				</Column>
			</section>
			<section className={style.right} style={{alignItems: 'flex-end'}}>
				<Row className={style.recentProject}>
					<span>최근 프로젝트</span>
					<Row className={style.projectSelect}>
						<button data-selected={projectTab === 'all'} onClick={() => setProjectTab('all')}>전체</button>
						<button data-selected={projectTab === 'project'} onClick={() => setProjectTab('project')}>프로젝트
						</button>
						<button data-selected={projectTab === 'design'} onClick={() => setProjectTab('design')}>디자인
						</button>
						<button data-selected={projectTab === 'other'} onClick={() => setProjectTab('other')}>기타
						</button>
					</Row>
				</Row>
				<div className={style.projectList}>
					{filteredProjects.map((project) => (
						<Project
							key={project.index}
							index={project.index}
							name={project.name}
							year={project.year}
							thumbnails={project.thumbnails}
							href={''}
							hoveredIndex={hoveredIndex}
							setHoveredIndex={setHoveredIndex}
						/>
					))}
				</div>
			</section>
		</div>
	);
};

export default Hero;
