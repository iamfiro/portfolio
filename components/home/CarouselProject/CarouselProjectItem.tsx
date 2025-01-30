import StackIcon from '@/components/ui/StackIcon/StackIcon';
import { AvailableTechStack, humanizeTechStackName } from '@/constants/Project';
import { Flex } from '@creative-kit/react';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';

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
				src={`/projects/${imageSrc}`}
				alt={name}
				width={800}
				height={450}
				quality={10}
				loading="lazy"
				placeholder="blur"
				blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4dHRsdHR4dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0XFyAeIRshIRshHRkdIR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
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
