'use client'

import { Title } from '@/components';
import style from './page.module.scss';
import { StackProps } from '@/types/stack';
import Image from 'next/image';

function Stack({ name, icon, description }: StackProps) {
    return (
        <div>
            <div>
                <Image src={`/icons/${icon}.svg`} width={50} alt={name} height={50} />
                <Title size={24} color={'#000000'}>{name}</Title>
            </div>
            <ul>
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
                <Stack name='React' icon='react' description={['React를 사용하여 프론트엔드 개발을 하고 있습니다']} />
            </section>
        </main>
        </>
    );
}
