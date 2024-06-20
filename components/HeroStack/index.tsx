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
	return <IconCloud iconSlugs={slugs} />;
}
