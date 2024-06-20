import { IconCloud } from "..";

const slugs = [
	"typescript",
	"javascript",
	"dart",
	"java",
	"react",
	"flutter",
	"android",
	"html5",
	"css3",
	"nodedotjs",
	"express",
	"nextdotjs",
	"prisma",
	"amazonaws",
	"postgresql",
	"firebase",
	"nginx",
	"vercel",
	"testinglibrary",
	"jest",
	"cypress",
	"docker",
	"git",
	"jira",
	"github",
	"gitlab",
	"visualstudiocode",
	"androidstudio",
	"sonarqube",
	"figma",
];

export default function HeroStack() {
	return <IconCloud iconSlugs={slugs} />;
}
