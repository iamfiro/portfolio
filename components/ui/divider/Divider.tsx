import { LayoutSizeProps } from '@/types/layout';

import s from './style.module.scss';

interface DividerProps extends Partial<Pick<LayoutSizeProps, 'fullWidth' | 'fullHeight'>> {
    width?: string;
    height?: string;
}

export default function Divider(props: DividerProps) {
    return <div className={s.divider} style={{
        width: props.fullWidth ? '100%' : props.width ?? '2px',
        height: props.fullHeight ? '100%' : props.height ?? '2px',
    }} />
}