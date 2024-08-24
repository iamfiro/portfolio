interface ColumnProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
	onClick?: () => void;
	ref?: React.RefObject<HTMLDivElement>;
}

const Column = ({ children, className, style, onClick, ref }: ColumnProps) => {
    return <div className={className} ref={ref} onClick={onClick} style={
        {
            display: 'flex',
            flexDirection: 'column',
            ...style
        }
    }>{children}</div>;
}

export default Column;
