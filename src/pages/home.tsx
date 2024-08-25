import {CustomCursor, Footer, Header, About, Hero, Stack} from "../components";
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
