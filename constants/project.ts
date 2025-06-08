import { Stack } from "@/constants/stack";

export interface Project {
    id: string;
    name: string;
    description: string;
    stack: Stack[];
    image: string;
    date: Date;
}

export const Project: Project[] = [
    {
        id: "tapie-rebranding",
        name: "테이피 웹사이트 리브랜딩",
        description: "테이피 웹사이트 리브랜딩",
        stack: [Stack.nextjs],
        image: "tapie/brand.webp",
        date: new Date("2021-07-01")
    },
    {
        id: "nodream",
        name: "온디바이스 졸음운전 방지 AI 서비스 - Nodream",
        description: "테이피 웹사이트 리브랜딩",
        stack: [Stack.nextjs],
        image: "nodream/thumbnail.webp",
        date: new Date("2021-07-01")
    },
		{
			id: "fresio",
			name: "프레시오",
			description: "프레시오",
			stack: [Stack.nextjs],
			image: "fresio/onboard_main.png",
			date: new Date("2021-07-01")
		}
]