import { PropsWithChildren } from 'react';
import s from './layout.module.scss';
import { Flex } from '@/components/ui';

const BlogLayout = ({ children }: PropsWithChildren) => {
	return (
		<Flex justify='center' className={s.blogLayoutContainer}>
			<Flex direction="column" as={'main'} className={s.blogLayout}>
				{children}
			</Flex>
		</Flex>
	);
};

export default BlogLayout;
