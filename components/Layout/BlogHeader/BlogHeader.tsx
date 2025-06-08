import { Flex } from '@/components/ui';
import s from './style.module.scss';

import { FaRegCalendar } from 'react-icons/fa6';
import { IoMdTime } from 'react-icons/io';
import Image from 'next/image';

interface BlogHeaderProps {
	title: string;
	date: Date;
	thumbnail: string;
	readingMinutes: number;
}

const BlogHeader = (props: BlogHeaderProps) => {
	const { title, date, thumbnail, readingMinutes } = props;
	return (
		<header>
			<h1 className={s.title}>{title}</h1>
			<Flex align="center" gap={10}>
				<Flex align="center" gap={5}>
					<FaRegCalendar
						size={12}
						className={s.icon}
						style={{ marginBottom: 3 }}
					/>
					<span className={s.date}>
						{date.toLocaleDateString()}
					</span>
				</Flex>
				<Flex align="center" gap={3}>
					<IoMdTime size={15} className={s.icon} />
					<span className={s.date}>{readingMinutes}분</span>
				</Flex>
			</Flex>
			{thumbnail && (
				<Image
					src={thumbnail}
					alt={title}
					width={1200}
					height={630}
					className={s.thumbnail}
				/>
			)}
		</header>
	);
};

export default BlogHeader;
