'use client'

import { Title } from '@/components';
import style from '@/style/page.module.scss';
import { StackProps } from '@/types/stack';
import Image from 'next/image';

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

function Stack({ name, icon, description }: StackProps) {
    return (
        <div className={style.stack}>
            <div className={style.stack_header}>
                <Image src={icon} width={50} alt={name} height={50} />
                <Title size={24} color={'#000000'}>{name}</Title>
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
    return (
        <>
        <main className={style.main}>
            <section className={style.section}>
                <header className={style.header}>
                    <strong>FIRO</strong>
                    <div style={{ display: 'flex' }}>
                        <ul className={style.header_list}>
                            <li>페이지 내 바로가기</li>
                            <a href='#main'>메인</a>
                            <a href='#about'>소개</a>
                            <a href='#project'>프로젝트 리스트</a>
                            <a href='#social'><Title size={15} color={'#8E8C98'}>소셜</Title></a>
                        </ul>
                        <ul className={style.header_list}>
                            <li>페이지</li>
                            <a href='/'>포트폴리오</a>
                            <a href='/project'>프로젝트</a>
                        </ul>
                    </div>
                </header>
                <Title size={48} color={'#000000'} weight={400}>상상을 현실로 만드는 <strong>프론트엔드 개발자</strong></Title>
                <div className={style.gradient} />
            </section>
            <section className={style.section} style={{ marginTop: 150 }}>
                <p className={style.about}>
                    <strong>안녕하세요, 매일 한걸음 씩 나아가는 개발자 조성주입니다</strong><br/>
                    현재 선린인터넷고등학교 소프트웨어과에 재학 중입니다<br/>
                    새로운 기술을 배우는 데 거부감이 없으며<br/>
                    사람들이 좋아할, 필요할 만한 서비스를 만들고 있습니다<br/>
                    또한, 민첩하게 변화하는 환경에 적응하려고 노력하고 있습니다<br/>
                </p>
            </section>
            <section className={style.section} style={{ marginTop: 200 }}>
                <div className={style.iam_container}>
                    <p className={style.iam_paragraph}>
                        <strong><b style={{ color: '#41d021' }}>사용자 친화적</b>을<br/>중요하게 생각합니다</strong><br/>
                        <div style={{ height: '5px' }} />
                        일상생활에서 불편하게 느끼는 부분을 해결하는 서비스를<br/>만들려고 노력하고 있습니다<br/>
                    </p>
                    <p className={style.iam_paragraph}>
                        <strong>뭐든지 <b style={{ color: '#c57aff' }}>기록</b>하려고<br/>노력하고 있어요</strong><br/>
                        <div style={{ height: '5px' }} />
                        내가 배웠던 기술을 열심히 기록하며<br/>과거의 나를 통해 한발짝 도약하는 사람이 되고 싶습니다<br/>
                    </p>
                    <p className={style.iam_paragraph}>
                        <strong><b style={{ color: '#4294ff' }}>끊임없이 새로운 기술을 배우는 것</b>을<br/>중요하게 생각합니다</strong><br/>
                        <div style={{ height: '5px' }} />
                        빠르게 바뀌는 개발 시장에서 뒤쳐지지 않게 꾸준히 새로운 기술을 배우고 있습니다<br/>
                    </p>
                </div>
            </section>
            <section className={style.section} style={{ marginTop: 200 }}>
                <Title size={28} color={'#000000'} bold>사용하는 기술</Title>
                <div className={style.stack_container}>
                    <Stack name='Next.js' icon={nextjs} description={['App Router를 사용할 줄 압니다', 'SSR의 장점을 이용하여 SEO 최적화를 할 수 있습니다', 'middleware를 사용하여 인증/인가를 구현한 적이 있습니다']} />
                    <Stack name='React.js' icon={react} description={['컴포넌트 재사용성을 고려하여 컴포넌트를 제작할 수 있습니다', 'Webpack을 최적화해 빌드 시간을 단축시킨 경험이 있습니다']} />
                    <Stack name='Typescript' icon={typescript} description={['Union Type, Generic등의 타입스크립트 타입을 압니다', 'Interface와 Type의 차이를 압니다']} />
                    <Stack name='Electron' icon={electron} description={['Electron을 이용하여 [ Github 잔디 기록 프로그램 ] 을 만든 경험이 있습니다', 'IPC를 이용하여 Main 프로세스와 Render 프로세스가 통신하는 방법을 압니다']} />
                    <Stack name='Prisma' icon={prisma} description={['테이블 간 관계 (1:1, 1:n, n:m)를 고려하여 Scheme를 작성 할 줄 압니다', 'Prisma를 이용하여 DB 마이그레이션을 할 줄 압니다']} />
                    <Stack name='Javascript' icon={javascript} description={['try / catch문을 활용하여 예외처리를 할 수 있습니다', '로컬 스토리지, 쿠키를 사용하여 데이터를 저장하는 방법을 압니다', 'map, foreach를 사용하여 배열에 대한 반복문을 효율적으로 사용하는 방법을 압니다']} />
                    <Stack name='HTML5' icon={html} description={['시맨틱 태그를 이용하여 SEO 최적화를 한 경험이 있습니다', 'meta 태그를 이용해 다른 서비스에서 웹사이트 식별을 쉽게 만들 수 있습니다']} />
                    <Stack name='CSS' icon={css} description={['최신 CSS 문법을 공부해 스타일 코드를 효율적으로 만들기 위해 노력하고 있습니다', 'keyframe을 사용해 웹사이트 애니메이션을 구현할 줄 압니다']} />
                    <Stack name='Sass' icon={sass} description={['@mixin, @include, @extend 문법을 사용할 줄 압니다', '중첩 선택자가 너무 편해 매우 좋아합니다']} />
                    <Stack name='Figma' icon={figma} description={['사용자가 편하게 볼 수 있는 서비스를 개발하기 위해 UI 디자인을 공부하고 있습니다', 'Auto Layout을 사용할 줄 압니다']} />
                    <Stack name='Discord.js' icon={discordjs} description={['Typescript를 이용하여 발로란트 전적 검색 봇을 개발한 적이 있습니다', '자동 Slash Command Push를 구현 할 줄 압니다']} />
                    <Stack name='Swagger' icon={swagger} description={['Swagger를 이용하여 Rest API 문서를 작성할 줄 압니다']} />
                </div>
            </section>
        </main>
        </>
    );
}
