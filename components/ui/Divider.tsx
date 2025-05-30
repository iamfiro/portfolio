import { LayoutSizeProps } from '@/types/layout';

interface DividerProps extends Partial<Pick<LayoutSizeProps, 'fullWidth' | 'fullHeight'>> {
    width?: string;
    height?: string;
}

export default function Divider(props: DividerProps) {
    return <div style={{
        minWidth: props.fullWidth ? '100%' : props.width ?? '1px',
        minHeight: props.fullHeight ? '100%' : props.height ?? '1px',
        backgroundColor: 'var(--border-default)',
    }} />
}