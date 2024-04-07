'use client'

import { Utterances } from '@/components';
import style from '@/style/page.module.scss';
import { StackProps } from '@/types/stack';
import Image from 'next/image';

// Vercel Speed Light / Analytics
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

import { FaInstagram } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { IoMdCode } from "react-icons/io";
import { MdBrush } from "react-icons/md";
import { FaBook } from "react-icons/fa6";
import { IoMdArrowUp } from "react-icons/io";

// Stack SVG
import nextjs from '@/public/svg/nextdotjs.svg';
import react from '@/public/svg/react.svg';
import typescript from '@/public/svg/typescript.svg';
import electron from '@/public/svg/electron.svg';
import prisma from '@/public/svg/prisma.svg';
import javascript from '@/public/svg/javascript.svg';
import html from '@/public/svg/html5.svg';
import css from '@/public/svg/css.svg';
import sass from '@/public/svg/sass.svg';
import figma from '@/public/svg/figma.svg';
import discordjs from '@/public/svg/discord.svg';
import swagger from '@/public/svg/swagger.svg';
import { useEffect, useState } from 'react';
import { ProjectProps } from '@/types/project';
import { projectList } from '@/data/project';

type projectIndexType = 'all' | 'project' | 'design';

function Stack({ name, icon, description }: StackProps) {
    return (
        <div className={style.stack}>
            <div className={style.stack_header}>
                <Image src={icon} width={50} alt={name} height={50} />
                <span className={style.stack_name}>{name}</span>
            </div>
            <ul className={style.stack_description}>
                {description.map((desc, index) => (
                    <li key={index}>{desc}</li>
                ))}
            </ul>
        </div>
    )
}

export default function Home() {
    const [projectIndex, setProjectIndex] = useState<projectIndexType>('all');
    const filterProject = projectList.filter((project: ProjectProps) => 
        projectIndex === 'all' ? true : projectIndex === 'project' ? project.type === 'project' : project.type === 'design'
    )
    return (
        <>
        <main className={style.main}>
            <section className={style.section} style={{ padding: '70px 0 0 0', justifyItems: 'center' }}>
                <header className={style.header}>
                    <span className={style.header_title}>©devfiro</span>
                    <ul>
                        <a href='#project'>작업물 리스트</a>
                        <a href='#stack'>사용하는 기술</a>
                        <a href='#contact'>소셜</a>
                    </ul>
                    <button className={style.button} style={{ margin: '0 30px 0 auto', padding: '10px 20px' }}>외주 신청하기</button>
                </header>
                <h1 className={style.welcome_title}>Web developers who turn <span>imagination</span> into <span>reality</span></h1>
                <h2 className={style.welcome_description}>상상을 현실로 만드는 프론트엔드 개발자</h2>
                <div className={style.welcome_button}>
                    <button className={style.button}>외주 신청하기</button>
                    <a href="https://instagram.com/tjdwn_.firo" target='_blank' className={style.button}>
                        <FaInstagram style={{ marginRight: '10px'}} /> 인스타그램 바로가기
                    </a>
                </div>
            </section>
            <section className={style.section} style={{ padding: '200px 0 0 0', justifyItems: 'center' }}>
                <p className={style.about_p}>
                    <strong>안녕하세요, 매일 한걸음 씩 나아가는 개발자 조성주입니다<br/></strong>
                    현재 선린인터넷고등학교 소프트웨어과에 재학 중입니다<br/>
                    새로운 기술을 배우는 데 거부감이 없으며<br/>
                    사람들이 좋아할, 필요할 만한 서비스를 만들고 있습니다<br/>
                    또한, 민첩하게 변화하는 환경에 적응하려고 노력하고 있습니다
                </p>
                <div className={style.about_container}>
                    <article className={style.about_section}>
                        <div style={{ backgroundColor: '#41d021' }}><MdBrush color='#fff' /></div>
                        <strong>사용자 친화적을<br/>중요하게 생각합니다</strong>
                        <span>일상생활에서 불편하게 느끼는 부분을<br/>해결하는 서비스를 만들려고 노력하고 있습니다</span>
                    </article>
                    <article className={style.about_section}>
                        <div style={{ backgroundColor: '#c57aff' }}><FaBook color='#fff' /></div>
                        <strong>뭐든지 기록하려고<br/>노력하고 있어요</strong>
                        <span>내가 배웠던 기술을 기록하며 과거의 나를<br/>통해 한발짝 도약하는 사람이 되고 싶습니다</span>
                    </article>
                    <article className={style.about_section}>
                        <div style={{ backgroundColor: '#4294ff' }}><IoMdCode color='#fff' /></div>
                        <strong>끊임없이 새로운 기술을 배우는 것을<br/>중요하게 생각합니다</strong>
                        <span>빠르게 바뀌는 개발 시장에서 뒤쳐지지 않게<br/>꾸준히 새로운 기술을 배우고 있습니다</span>
                    </article>
                </div>
            </section>
            <section className={style.section} id='project' style={{ padding: '300px 0 0 0',  justifyItems: 'center' }}>
                <ul className={style.project_select}>
                    <li onClick={() => setProjectIndex('all')} style={{ backgroundColor: projectIndex === 'all' ? '#dcdcdc' : ''}}>모든 작업물</li>
                    <li onClick={() => setProjectIndex('project')} style={{ backgroundColor: projectIndex === 'project' ? '#dcdcdc' : ''}} data-selected="false">프로젝트</li>
                    <li onClick={() => setProjectIndex('design')} style={{ backgroundColor: projectIndex === 'design' ? '#dcdcdc' : ''}} data-selected="false">디자인</li>
                </ul>
                <div className={style.project_container}>
                    {
                        filterProject.map((project: ProjectProps, index: number) => {
                            return (
                                <a href={project.href} target='_blank' key={index} className={style.project_section}>
                                    <Image src={project.image} alt={project.name} />
                                    <div className={style.project_bottom}>
                                        <div className={style.project_bottom_left}>
                                            <strong>{project.name}</strong>
                                            <span>{project.description}</span>
                                        </div>
                                        <IoMdArrowUp />
                                    </div>
                                </a>
                            )
                        
                        })
                    }
                </div>
            </section>
            <section className={style.section} id='stack' style={{ padding: '300px 0 0 0', justifyItems: 'center' }}>
                <div className={style.stack_container}>
                    <Stack name='Next.js' icon={nextjs} description={['App Router를 사용할 줄 압니다', 'SSR의 장점을 이용하여 SEO 최적화를 할 수 있습니다', 'middleware를 사용하여 인증/인가를 구현한 적이 있습니다']} />
                    <Stack name='React.js' icon={react} description={['컴포넌트 재사용성을 고려하여 컴포넌트를 제작할 수 있습니다', 'Webpack을 최적화해 빌드 시간을 단축시킨 경험이 있습니다', 'Recoil을 사용하여 전역 상태 관리를 한 경험이 있습니다']} />
                    <Stack name='Typescript' icon={typescript} description={['Union Type, Generic등의 타입스크립트 타입을 압니다', 'Interface와 Type의 차이를 압니다']} />
                    <Stack name='Electron' icon={electron} description={['Electron을 이용하여 [ Github 잔디 기록 프로그램 ] 을 만든 경험이 있습니다', 'IPC를 이용하여 Main 프로세스와 Render 프로세스가 통신하는 방법을 압니다']} />
                    <Stack name='Prisma' icon={prisma} description={['관계형 데이터베이스의 관계를 이용해 설계 할 줄 압니다', 'Prisma를 이용하여 DB 마이그레이션을 할 줄 압니다']} />
                    <Stack name='Javascript' icon={javascript} description={['try / catch문을 활용하여 예외처리를 할 수 있습니다', '로컬 스토리지, 쿠키를 사용하여 데이터를 저장하는 방법을 압니다', 'map, foreach를 사용하여 배열에 대한 반복문을 효율적으로 사용하는 방법을 압니다']} />
                    <Stack name='HTML5' icon={html} description={['시맨틱 태그를 이용하여 SEO 최적화를 한 경험이 있습니다', 'meta 태그를 이용해 다른 서비스에서 웹사이트 식별을 쉽게 만들 수 있습니다']} />
                    <Stack name='CSS' icon={css} description={['최신 CSS 문법을 공부해 스타일 코드를 효율적으로 만들기 위해 노력하고 있습니다', 'keyframe을 사용해 웹사이트 애니메이션을 구현할 줄 압니다']} />
                    <Stack name='Sass' icon={sass} description={['@mixin, @include, @extend 문법을 사용할 줄 압니다', '중첩 선택자가 너무 편해 매우 좋아합니다']} />
                    <Stack name='Figma' icon={figma} description={['사용자가 편하게 볼 수 있는 서비스를 개발하기 위해 UI 디자인을 공부하고 있습니다', 'Auto Layout을 사용할 줄 압니다']} />
                    <Stack name='Discord.js' icon={discordjs} description={['Typescript를 이용하여 발로란트 전적 검색 봇을 개발한 적이 있습니다', '자동 Slash Command Push를 구현 할 줄 압니다']} />
                    <Stack name='Swagger' icon={swagger} description={['Swagger를 이용하여 Rest API 문서를 작성할 줄 압니다']} />
                </div>
            </section>
            <section className={style.section} id='stack' style={{ padding: '300px 0 0 0', justifyItems: 'center' }}>
                <div className={style.stack_future_container}>
                    <div>
                        <h1>web development</h1>
                        <h1>next.js</h1>
                        <h1>react.js</h1>
                        <h1>clean code</h1>
                        <h1>app development</h1>
                        <h1>web ui-ux design</h1>
                        <h1>design Systems</h1>
                        <h1>figma</h1>
                        <h1>poster design</h1>
                        <h1>and more...</h1>
                    </div>
                    <div>
                        <span>가장 최근에 작업한 작업물을 보고 싶다면?<br/>아래 버튼을 눌러 확인하세요</span>
                        <a href="https://instagram.com/tjdwn_.firo" target='_blank' className={style.button} style={{ marginTop: '20px'}}>
                            <FaInstagram style={{ marginRight: '10px'}} /> 인스타그램 바로가기
                        </a>
                    </div>
                </div>
            </section>
            <section className={style.section} id='contact' style={{ padding: '200px 0 0 0', justifyItems: 'center' }}>
                <span className={style.contact_title}>여기로 연락주세요 😎👇</span>
                <div className={style.contact}>
                    <MdOutlineEmail />
                    <span>me@devfiro.com</span>
                </div>
            </section>
        </main>
        <SpeedInsights />
        <Analytics/>
        </>
    );
}
