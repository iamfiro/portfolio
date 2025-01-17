import { Flex } from '@creative-kit/react';
import s from './style.module.scss';

interface PageWrapperProps {
    children: React.ReactNode;
}

const PageWrapper = ({children}: PageWrapperProps) => {
    return (
        <Flex direction='column' justify='center' className={s.pageWrapper}>
            {children}
        </Flex>
    );
}

export default PageWrapper;