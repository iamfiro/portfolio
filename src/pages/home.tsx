import {CustomCursor, Header} from "../components";
import useMousePosition from "../hooks/useMouseEvent.ts";
import Hero from "../components/Hero";

const PageHome = () => {
	const mousePosition = useMousePosition();
	return (
		<>
			<Header />
			<Hero />
			<CustomCursor x={mousePosition.x} y={mousePosition.y} />
		</>
	)
}

export default PageHome;
