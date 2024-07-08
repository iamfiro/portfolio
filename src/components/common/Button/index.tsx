import style from './style.module.scss';

interface ButtonProps {
    children: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
    type?: 'primary' | 'secondary' | 'no-border';
}

function Button({ children, size, type }: ButtonProps) {
    return (
        <button className={`${style.button} size-${size} type-${type}`}>{children}</button>
    );
}

export default Button;