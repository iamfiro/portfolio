import { HStack } from '@/components/ui';
import { spacing } from '@/styles/token';
import { carouselProject as carouselProjects } from '@/constants/carouselProject';

import Item from './item';
import * as s from './style.css';

const CarouselProject = () => {
	return (
		<HStack gap={spacing.large} className={s.wrapper}>
			{carouselProjects.map((item, index) => (
				<Item
					key={index}
					name={item.project.name}
					imageSrc={item.imageSrc}
				/>
			))}
		</HStack>
	);
};

export default CarouselProject;