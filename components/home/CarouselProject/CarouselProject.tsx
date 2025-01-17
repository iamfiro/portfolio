import { Flex } from '@creative-kit/react';
import { PropsWithChildren } from 'react';

import s from './style.module.scss';

import Image from 'next/image';

import { AvailableTechStack } from '@/constants/Project';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

const CarouselProject = ({ children }: PropsWithChildren) => {
	return (
		<Flex gap={20} className={s.wrapper}>
			{children}
		</Flex>
	);
};

export default CarouselProject;

// Item
interface CarouselProjectItemProps {
	name: string;
	stack: AvailableTechStack[];
	imageSrc: string | StaticImport;
}

const CarouselProjectItem = ({name, stack, imageSrc}: CarouselProjectItemProps) => {
	return (
		<Flex justify="start" className={s.container} gap={14}>
			<Image
				className={s.image}
				src={imageSrc}
				alt={name}
				height={10}
				width={2000}
			/>
            <Flex justify='between'>
                <span>{name}</span>
                {stack}
            </Flex>
		</Flex>
	);
};

CarouselProject.Item = CarouselProjectItem;
