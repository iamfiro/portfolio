import { createElement, forwardRef, PropsWithChildren, Ref } from 'react';

import s from './style.module.scss';

export type ButtonVariant = 'primary' | 'secondary';

export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
	href?: string;

	variant?: ButtonVariant;
	size?: ButtonSize;

	fullRadius?: boolean;
	fullWidth?: boolean;

	leadingIcon?: React.ReactNode;
	trailingIcon?: React.ReactNode;

	isLoading?: boolean;
}

type ButtonProps = ButtonBaseProps & PropsWithChildren;

// @typescript-eslint/no-explicit-any
const Button = forwardRef(function Button(
	props: ButtonProps,
	ref: Ref<HTMLButtonElement | HTMLAnchorElement>,
) {
	const {
		variant = 'primary',
		size = 'lg',
		leadingIcon,
		trailingIcon,
		fullRadius,
		fullWidth,
		children,
		isLoading,
		...rest
	} = props;

	const as = props.href ? 'a' : 'button';
	const className = `${s.button} ${isLoading ? s.loading : ''} ${fullRadius ? s.fullRadius : ''} ${fullWidth ? s.fullWidth : ''}`;
	const render = isLoading ? (
		<span className={s.loader} />
	) : (
		<>
			{leadingIcon && leadingIcon}
			{children}
			{trailingIcon && trailingIcon}
		</>
	);

	return createElement(
		as,
		{
			ref,
			className,
			'data-variant': variant,
			'data-size': size,
			disabled: as === 'button' ? isLoading : undefined,
			...rest,
			target: props.href ? '_blank' : undefined,
		},
		render,
	);
});

export default Button;
