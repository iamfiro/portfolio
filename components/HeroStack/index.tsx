import style from "./style.module.scss";
import { IconCloud } from "..";

const slugs = [
	"typescript",
	"javascript",
    "react",
    "next-dot-js",
    "express",
    "mongodb",
    "postgresql",
    "tailwindcss",
    "sass",
    "html5",
    "css3",
    "git",
    "github",
    "docker",
    "prisma",
    "jest", 
    "nginx",
    "firebase",
    "figma",
    "testinglibrary",
    "python",
    "mysql",
    "react-native",
    "c",
    "android",
    "amazonaws",
];

export default function HeroStack() {
	return (
        <section className={style.container}>
            <div className={style.top}>
                <h1 className={style.title}>사용하는 기술</h1>
                <span className={style.tip}>TIP: 기술에 대한 자세한 정보를 보시려면 아래 아이콘을 눌러주세요</span>
            </div>
            <div className={style.iconContainer}>
                <IconCloud iconSlugs={slugs} />
            </div>
        </section>
    )
}
