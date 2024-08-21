import {useEffect, useState} from "react";

const CustomCursor = () => {
	const [mousePosition, setMousePosition] = useState({
		x: 400,
		y: 400
	});

	console.log(mousePosition);

	useEffect(() => {
		const onMouseMove = (e: MouseEvent) => {
			const {clientX, clientY} = e;
			setMousePosition({x: clientX, y: clientY});
		};

		window.addEventListener('mousemove', onMouseMove);

		return () => {
			window.removeEventListener('mousemove', onMouseMove);
		};
	}, []);

	return (
		<></>
	)
}

export default CustomCursor;
