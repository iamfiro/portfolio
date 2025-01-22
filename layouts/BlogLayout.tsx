import { PropsWithChildren } from 'react';
import s from './layout.module.scss';
import { Flex } from '@creative-kit/react';

const BlogLayout = ({children}: PropsWithChildren) => {
    return (
        <Flex direction='column' as={'main'} className={s.blogLayout}>
            {children}
        </Flex>
    );
}

export default BlogLayout;