import StackIcon from "@/components/ui/StackIcon/StackIcon";
import { AvailableTechStack, humanizeTechStackName } from "@/constants/Project";
import { Flex } from "@creative-kit/react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

import s from './style.module.scss';

interface CarouselProjectItemProps {
	name: string;
	stack: AvailableTechStack[];
	imageSrc: string | StaticImport;
}

const CarouselProjectItem = ({
	name,
	stack,
	imageSrc,
}: CarouselProjectItemProps) => {
	return (
		<Flex justify="start" className={s.container} gap={12}>
			<Image
				className={s.image}
				src={imageSrc}
				alt={name}
				height={10}
				width={2000}
			/>
			<Flex justify="between">
				<span className={s.projectName}>{name}</span>
				<Flex gap={8}>
					{stack.map((stackName) => (
						<StackIcon
							key={stackName}
							iconName={stackName}
							size={14}
							showTooltip
                            tooltipName={humanizeTechStackName(stackName)}
						/>
					))}
				</Flex>
			</Flex>
		</Flex>
	);
};

export default CarouselProjectItem;
