import style from './style.module.scss';
import {useLayoutEffect, useRef} from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import {Column} from '../index.ts';
import ProjectList from '../../constant/project.ts';
import TitleIcon from '../../assets/image/svg/Projects.svg';

const Project = () => {
	const titleRef = useRef<HTMLImageElement>(null);
	const projectRefs = useRef<HTMLDivElement[]>([]);

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
			width: '10%',
		});

		gsap.fromTo('.project_list', {
			opacity: 0,
			y: 100,
		}, {
			opacity: 1,
			y: 0,
			duration: .8,
			stagger: .2,
			scrollTrigger: {
				trigger: titleRef.current,
				start: 'top center',
				end: 'center center',
			},
		});
	}, []);

	const handleMouseEnter = (index: number) => {
		gsap.to(projectRefs.current[index], {
			clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
			duration: 0.3,
		});
	};

	const handleMouseLeave = (index: number) => {
		gsap.to(projectRefs.current[index], {
			clipPath: 'polygon(0 0, 0% 0, 0% 100%, 0% 100%)',
			duration: 0.3,
		});
	};

	return (
		<section className={style.container}>
			<img src={TitleIcon} alt="Project" className={style.title} ref={titleRef}/>
			<Column className={style.projectList}>
				{
					ProjectList.map((project, index) => (
						<article
							className={`${style.project} project_list`}
							key={index}
							onMouseEnter={() => handleMouseEnter(index)}
							onMouseLeave={() => handleMouseLeave(index)}
						>
							<Column className={style.projectContent} style={{gap: '10px'}}>
								<span className={style.projectYear}>( {project.year} )</span>
								<span>{project.name}</span>
							</Column>
							<img
								src={project.thumbnails2}
								alt={project.name}
								className={style.projectImage}
								ref={el => projectRefs.current[index] = el}
								style={{ clipPath: 'polygon(0 0, 0% 0, 0% 100%, 0% 100%)' }}
							/>
						</article>
					))
				}
			</Column>
		</section>
	);
};

export default Project;
