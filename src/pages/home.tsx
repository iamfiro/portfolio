import {CustomCursor, Footer, Header, About, Hero, Stack, Award} from "../components";
import useMousePosition from "../hooks/useMouseEvent.ts";

const PageHome = () => {
	const mousePosition = useMousePosition();
	return (
		<>
			<Header/>
			<Hero/>
			<About />
			<Stack />
			<Footer />
			<Award />
			<CustomCursor x={mousePosition.x} y={mousePosition.y}/>
		</>
	)
}

export default PageHome;
