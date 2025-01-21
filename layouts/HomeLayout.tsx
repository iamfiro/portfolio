import { PropsWithChildren } from 'react';
import s from './layout.module.scss';
import { Flex } from '@creative-kit/react';

const HomeLayout = ({children}: PropsWithChildren) => {
    return (
        <Flex as={'main'} className={s.homeLayout}>
            {children}
        </Flex>
    );
}

export default HomeLayout;