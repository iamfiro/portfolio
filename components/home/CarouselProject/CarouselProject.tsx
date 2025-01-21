import { Flex } from '@creative-kit/react';

import s from './style.module.scss';

import project from '@/public/projects/_carouselProject.json'

import CarouselProjectItem from './CarouselProjectItem';
import { AvailableTechStack } from '@/constants/Project';

const CarouselProject = () => {
	return (
		<Flex gap={20} className={s.wrapper}>
			{project.map((item, index) => (
				<CarouselProjectItem
					key={index}
					name={item.name}
					stack={item.stack as AvailableTechStack[]}
					imageSrc={item.image}
				/>
			))}
		</Flex>
	);
};

export default CarouselProject;