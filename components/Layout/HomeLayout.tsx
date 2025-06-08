import { PropsWithChildren } from 'react';

import { VStack } from '@/components/ui';

import s from './layout.module.scss';

const HomeLayout = ({children}: PropsWithChildren) => {
    return (
        <VStack as={'main'} className={s.homeLayout}>
            {children}
        </VStack>
    );
}

export default HomeLayout;