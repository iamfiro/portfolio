import { Project } from "@/constants/project";

interface CarouselProject {
    imageSrc: string;
		project: Project;
}

const tapie = Project.find((project) => project.id === "tapie-rebranding") || Project[0];
const fresio = Project.find((project) => project.id === "fresio") || Project[0];

export const carouselProject: CarouselProject[] = [
    {
        imageSrc: "tapie/brand.webp",
				project: tapie
    },
    {
        imageSrc: "fresio/onboard_main.png",
				project: fresio
    },
    {
        imageSrc: "fresio/onboard_timer.png",
				project: fresio
    },
    {
        imageSrc: "fresio/onboard_diet.png",
				project: fresio
    },
    {
        imageSrc: "fresio/setting.png",
				project: fresio
    }
]; 