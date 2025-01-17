import { Flex } from '@creative-kit/react';
import s from './style.module.scss';
import { PropsWithChildren } from 'react';

const HorizontalProjectList = ({children}: PropsWithChildren) => {
    return (
        <Flex justify="center" direction="row" className={s.container}>
            {children}
        </Flex>
    );
}

export default HorizontalProjectList;