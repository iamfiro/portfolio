import React, { useEffect, useState } from "react";

interface CustomCursorProps {
    text?: string;
    cursorColor?: string;
    textColor?: string;
}

const CustomCursor: React.FC<CustomCursorProps> = ({
    text = "Developer", // Default text
    cursorColor = "#6c5ce7", // Default cursor color (purple)
    textColor = "#fff" // Default text color (white)
}) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", onMouseMove);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, []);

    return (
		<div
			className="custom-cursor"
			style={{
				top: mousePosition.y,
				left: mousePosition.x,
				color: textColor,
			}}
		>
			<svg className="size-3.5" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 20 20">
				<path fill={cursorColor} d="M19.438 6.716 1.115.05A.832.832 0 0 0 .05 1.116L6.712 19.45a.834.834 0 0 0 1.557.025l3.198-8 7.995-3.2a.833.833 0 0 0 0-1.559h-.024Z"></path>
			</svg>
			<div
				style={{
					backgroundColor: cursorColor,
				}}
			>{text}</div>
		</div>
	);
};

export default CustomCursor;
