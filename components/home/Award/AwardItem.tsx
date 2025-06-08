import { Flex } from '@/components/ui';

import s from './style.module.scss';

interface AwardItemProps {
    name: string;
    date: string;
    description: string;
}

const AwardItem = ({name, date, description}: AwardItemProps) => {
	return (
		<article>
			<Flex align='center' gap={10}>
				<h1 className={s.awardTitle}>{name}</h1>
                <h2 className={s.awardDate}>{date}</h2>
			</Flex>
            <p className={s.awardDescription}>{description}</p>
		</article>
	);
};

export default AwardItem;
