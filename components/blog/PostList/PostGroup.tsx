import { PropsWithChildren } from 'react';

import s from './style.module.scss';

import { Flex } from '@/components/ui';

interface PostListGroupProps extends PropsWithChildren {
    year: number;
}

const PostListGroup = ({children, year}: PostListGroupProps) => {
    return (
        <Flex gap={40} className={s.postGroupContainer}>
            <span className={s.postGroupYear}>{year}</span>
            <Flex direction='column' gap={20} style={{width: '100%'}}>
                {children}
            </Flex>
        </Flex>
    );
}

export default PostListGroup;