import {CustomCursor, Header} from "../components";
import useMousePosition from "../hooks/useMouseEvent.ts";
import {About, Hero, Stack} from "../components";

const PageHome = () => {
	const mousePosition = useMousePosition();
	return (
		<>
			<Header/>
			<Hero/>
			<About />
			<Stack />
			<h1>asd</h1>
			<h1>asd</h1>
			<h1>asd</h1>
			<h1>asd</h1>
			<h1>asd</h1>
			<h1>asd</h1>
			<h1>asd</h1>
			<h1>asd</h1>
			<h1>asd</h1>
			<CustomCursor x={mousePosition.x} y={mousePosition.y}/>
		</>
	)
}

export default PageHome;
