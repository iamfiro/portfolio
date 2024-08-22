interface FlowerLogoProps {
	className: string;
}

const FlowerLogo = ({ className }: FlowerLogoProps) => {
	return (
		<svg className={className} width="68" height="70" viewBox="0 0 68 70" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="flowerGradient" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stopColor="var(--logo-first-color)" />
					<stop offset="100%" stopColor="var(--logo-second-color)" />
				</linearGradient>
			</defs>
			<g fill="url(#flowerGradient)">
				<path d="M34 0H68V1C68 19.7777 52.7777 35 34 35V35V0Z"/>
				<path d="M68 35L68 70V70C49.2223 70 34 54.7777 34 36L34 35L68 35Z"/>
				<path d="M34 70L-3.8147e-06 70L-3.72728e-06 69C-2.08568e-06 50.2223 15.2223 35 34 35V35L34 70Z"/>
				<path d="M0 35L4.86748e-06 -3.8147e-06V-3.8147e-06C18.7777 -1.20327e-06 34 15.2223 34 34L34 35L0 35Z"/>
			</g>
		</svg>
	)
}

export default FlowerLogo;
