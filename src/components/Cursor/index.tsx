import React from "react";

interface CustomCursorProps {
    text?: string;
    cursorColor?: string;
    textColor?: string;
	x: number;
	y: number;
}

const CustomCursor: React.FC<CustomCursorProps> = ({
    text = "Developer", // Default text
    cursorColor = "#000", // Default cursor color (purple)
    textColor = "#fff", // Default text color (white)
	x,
	y,
}) => {
    return (
		<div
			className="custom-cursor"
			style={{
				top: y,
				left: x,
			}}
		>
			<svg className="size-3.5" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 20 20">
				<path fill={cursorColor} d="M19.438 6.716 1.115.05A.832.832 0 0 0 .05 1.116L6.712 19.45a.834.834 0 0 0 1.557.025l3.198-8 7.995-3.2a.833.833 0 0 0 0-1.559h-.024Z"></path>
			</svg>
			{/*<div>{text}</div>*/}
		</div>
	);
};

export default CustomCursor;
