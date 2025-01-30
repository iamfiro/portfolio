import { Flex } from '@creative-kit/react';
import s from './style.module.scss';

const Footer = () => {
    return (
        <Flex justify="between" align="center">
            <span className={s.copyright}>ⓒ 2025 devfiro.com</span>
        </Flex>
    );
}

export default Footer;