import { useState } from 'react';

export const useHover = () => {
	const [hoveredItem, setHoveredItem] = useState<string | null>(null);

	const isOtherItemHovered = (id: string) =>
		hoveredItem !== null && hoveredItem !== id;

	const handleHover = (id: string, isHovered: boolean) =>
		setHoveredItem(isHovered ? id : null);

	return {
		isOtherItemHovered,
		handleHover,
	};
};
