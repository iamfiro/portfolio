import { Flex } from '@/components/ui';

import AwardItem from './AwardItem';
import s from './style.module.scss';

import awards from '@/public/awards/_awards.json';

const Award = () => {
	return (
		<section>
			<h1 className={s.title}>수상실적</h1>
			<Flex direction='column' gap={20}>
                {awards.map((award) => (
                    <AwardItem
                        key={award.id}
                        name={award.name}
                        date={award.date}
                        description={award.description}
                    />
                ))}
			</Flex>
		</section>
	);
};

export default Award;
