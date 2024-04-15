'use client'

import { projectList } from '@/data/project';
import style from './style.module.scss';
import Image from 'next/image';
import { IoMdArrowUp } from "react-icons/io";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const Project = () => {
    return (
        <div className={style.container} id='project'>
            <div className={style.top}>
                <h1>Works</h1>
                <div />
            </div>
            {projectList.map((project, index) => {
                const projectRef = useRef<HTMLAnchorElement>(null);
                
                useEffect(() => {
                    gsap.registerPlugin(ScrollTrigger);
                    gsap.fromTo(projectRef.current, {
                        y: 100,
                        opacity: 0,
                    }, {
                        scrollTrigger: {
                            trigger: projectRef.current,
                            start: 'top 80%',
                        },
                        y: 0,
                        opacity: 1,
                        duration: 0.8
                    })
                }, []);

                return (
                    <a 
                        href={project.href} 
                        ref={projectRef} 
                        target='_blank' 
                        className={style.itemContainer} key={index}
                        style={{ flexDirection: index%2 === 0 ? 'row' : 'row-reverse'}}
                    >
                        <span className={style.date}>{project.date}</span>
                        <div style={{ alignItems: index%2 === 0 ? 'flex-end' : 'flex-start'}}>
                            <Image src={project.image} alt={project.name} />
                            <span className={style.name}>{project.name} <IoMdArrowUp /></span>
                        </div>
                    </a>
                )
            })}
        </div>
    )
}

export default Project;