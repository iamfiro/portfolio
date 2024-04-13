import { ProjectProps } from "@/types/project";

// 이미지
import sunrin_today from '@/public/project/sunrin-today.png';
import newjeans from '@/public/project/newjeans.png';
import watch from '@/public/project/watch.png';
import lofi from '@/public/project/lofi.png';
import google_card from '@/public/project/google-card.png';
import valorant_bot from '@/public/project/valorant-bot.png';

export const projectList: ProjectProps[] = [
    {
        type: 'project',
        name: 'Sunrin High school Meal Reminder Service',
        description: '',
        image: sunrin_today,
        href: 'https://instagram.com/sunrin_today',
        date: '2024'
    },
    {
        type: 'project',
        name: 'Valorant stats / Competition schedule bot',
        description: 'Discord.js로 개발한 디스코드 봇',
        image: valorant_bot,
        href: '/',
        date: '2023'
    },
    {
        type: 'design',
        name: 'Newjeans poster design',
        description: 'Photoshop으로 제작한 뉴진스 포스터 디자인',
        image: newjeans,
        href: 'https://www.instagram.com/p/C1MYDY6vGXC/',
        date: '2023'
    },
    {
        type: 'design',
        name: 'Smartwatch design - Simplify OS',
        description: 'Photoshop과 Figma로 제작한 스마트워치 디자인',
        image: watch,
        href: 'https://www.instagram.com/p/C1jFVtGLgsf',
        date: '2023'
    },
    {
        type: 'design',
        name: 'Google identity card design',
        description: 'Figma로 제작한 구글 명함 디자인',
        image: google_card,
        href: 'https://www.instagram.com/p/C1jFVtGLgsf',
        date: '2023'
    },
    {
        type: 'project',
        name: 'Lofi Station',
        description: 'Lo-fi 음악을 더 쉽게',
        image: lofi,
        href: 'https://lofi.firos.dev',
        date: '2022'
    },
]