import {CustomCursor, Footer, Header, About, Hero, Stack, Award, Project} from "../components";
import useMousePosition from "../hooks/useMouseEvent.ts";

const PageHome = () => {
	const mousePosition = useMousePosition();
	return (
		<>
			<Header/>
			<Hero/>
			<About />
			<Stack />
			<Project />
			<Award />
			<Footer />
			<CustomCursor x={mousePosition.x} y={mousePosition.y}/>
		</>
	)
}

export default PageHome;
