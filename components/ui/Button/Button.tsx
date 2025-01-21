import { ComponentPropsWithRef, createElement, forwardRef, HTMLAttributes, PropsWithChildren, Ref } from 'react';
import s from './style.module.scss';

interface ButtonBaseProps {
    href?: string

	variant?: 'primary' | 'secondary';
	size?: 'sm' | 'md' | 'lg';

	leadingIcon?: React.ReactNode;
	trailingIcon?: React.ReactNode;

	isLoading?: boolean; 
}

type ButtonProps = ButtonBaseProps & PropsWithChildren

const Button = forwardRef(function Button(props: ButtonProps, ref: Ref<any>) {
	const {
		variant = 'primary',
		size = 'lg',
		leadingIcon,
		trailingIcon,
		children,
		isLoading,
		...rest
	} = props;

    const as = props.href ? 'a' : 'button';
    const className = `${s.button} ${isLoading ? s.loading : ''}`;
    const render = isLoading ? (
        <span className={s.loader} />
    ) : (
        <>
            {leadingIcon && leadingIcon}
            {children}
            {trailingIcon && trailingIcon}
        </>
    )

	return createElement(
        as,
        {
            ref,
            className,
            'data-variant': variant,
            'data-size': size,
            disabled: as === 'button' ? isLoading : undefined,
            ...rest
        },
        render
    )
});

export default Button;
