import {CustomCursor, Header} from "../components";
import useMousePosition from "../hooks/useMouseEvent.ts";

const PageHome = () => {
	const mousePosition = useMousePosition();
	return (
		<>
			<Header />
			<h1>Home</h1>
			<p>Welcome to the home page!</p>
			<CustomCursor text={'Anonymous'} x={mousePosition.x} y={mousePosition.y} />
		</>
	)
}

export default PageHome;
