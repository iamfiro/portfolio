import { ProjectProps } from "@/types/project";

// 이미지
import sunrin_today from '@/public/project/sunrin-today.png';
import newjeans from '@/public/project/newjeans.png';
import watch from '@/public/project/watch.png';
import lofi from '@/public/project/lofi.png';

export const projectList: ProjectProps[] = [
    {
        type: 'project',
        name: '선린투데이',
        description: '선린인고 급식 알림 서비스',
        image: sunrin_today,
        href: 'https://instagram.com/sunrin_today'
    },
    {
        type: 'design',
        name: '뉴진스 포스터 디자인',
        description: 'Photoshop으로 제작한 뉴진스 포스터 디자인',
        image: newjeans,
        href: 'https://www.instagram.com/p/C1MYDY6vGXC/'
    },
    {
        type: 'design',
        name: '스마트워치 디자인 - Simplify OS',
        description: 'Photoshop과 Figma로 제작한 스마트워치 디자인',
        image: watch,
        href: 'https://www.instagram.com/p/C1jFVtGLgsf'
    },
    {
        type: 'project',
        name: 'Lofi Station',
        description: 'Lo-fi 음악을 더 쉽게',
        image: lofi,
        href: 'https://lofi.firos.dev'
    },
]